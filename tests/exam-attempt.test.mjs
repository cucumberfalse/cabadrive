import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import ts from "typescript";

function transpileToModule(path) {
  const compiled = ts.transpileModule(readFileSync(path, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      isolatedModules: true,
    },
    fileName: path,
  }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);
}

const module = await transpileToModule("src/examAttemptStorage.ts");
const {
  EXAM_ATTEMPT_KEY,
  parseExamAttempt,
  remainingSeconds,
  saveExamAttempt,
  readExamAttempt,
  clearExamAttempt,
} = module;

class FakeStorage {
  constructor(entries = {}, { setFailures = [], getFailures = [], removeFailures = [] } = {}) {
    this.entries = new Map(Object.entries(entries));
    this.setFailures = [...setFailures];
    this.getFailures = [...getFailures];
    this.removeFailures = [...removeFailures];
  }
  getItem(key) {
    const failure = this.getFailures.shift();
    if (failure) throw failure;
    return this.entries.get(key) ?? null;
  }
  setItem(key, value) {
    const failure = this.setFailures.shift();
    if (failure) throw failure;
    this.entries.set(key, value);
  }
  removeItem(key) {
    const failure = this.removeFailures.shift();
    if (failure) throw failure;
    this.entries.delete(key);
  }
}

const quota = () => Object.assign(new Error("quota"), { name: "QuotaExceededError" });
const validIds = new Set(["q-1", "q-2", "q-3"]);
const examAnswer = (questionId, correct = true) => ({
  questionId,
  selectedAnswerId: correct ? "a-1" : "",
  isCorrect: correct,
  answeredAt: "2026-01-01T00:00:05.000Z",
  mode: "exam",
});
const validSnapshot = (overrides = {}) => ({
  version: 1,
  questionIds: ["q-1", "q-2", "q-3"],
  answers: [examAnswer("q-1", true)],
  startedAt: 1_000_000,
  deadline: 1_000_000 + 45 * 60_000,
  ...overrides,
});
const now = 1_000_000 + 5_000;
const opts = { now, validQuestionIds: validIds };

test("EXAM_ATTEMPT_KEY matches the versioned cabadrive namespace", () => {
  assert.equal(EXAM_ATTEMPT_KEY, "cabadrive.exam-attempt.v1");
});

test("parseExamAttempt returns a valid unexpired snapshot", () => {
  const parsed = parseExamAttempt(JSON.stringify(validSnapshot()), opts);
  assert.deepEqual(parsed, validSnapshot());
});

test("parseExamAttempt strips unknown fields to the canonical answer shape", () => {
  const raw = JSON.stringify(
    validSnapshot({
      answers: [{ ...examAnswer("q-1", true), extra: "ignore-me" }],
    }),
  );
  const parsed = parseExamAttempt(raw, opts);
  assert.deepEqual(parsed.answers, [examAnswer("q-1", true)]);
});

test("parseExamAttempt allows a skipped exam answer (empty selectedAnswerId)", () => {
  const raw = JSON.stringify(validSnapshot({ answers: [examAnswer("q-1", false)] }));
  const parsed = parseExamAttempt(raw, opts);
  assert.deepEqual(parsed.answers, [examAnswer("q-1", false)]);
});

test("parseExamAttempt rejects null and non-JSON raw", () => {
  assert.equal(parseExamAttempt(null, opts), null);
  assert.equal(parseExamAttempt("not-json{", opts), null);
  assert.equal(parseExamAttempt("null", opts), null);
  assert.equal(parseExamAttempt('"a string"', opts), null);
});

test("parseExamAttempt rejects the wrong version", () => {
  assert.equal(parseExamAttempt(JSON.stringify(validSnapshot({ version: 2 })), opts), null);
  assert.equal(parseExamAttempt(JSON.stringify(validSnapshot({ version: undefined })), opts), null);
});

test("parseExamAttempt rejects malformed questionIds", () => {
  assert.equal(parseExamAttempt(JSON.stringify(validSnapshot({ questionIds: [] })), opts), null);
  assert.equal(parseExamAttempt(JSON.stringify(validSnapshot({ questionIds: "q-1" })), opts), null);
  assert.equal(
    parseExamAttempt(JSON.stringify(validSnapshot({ questionIds: ["q-1", ""] })), opts),
    null,
  );
  assert.equal(
    parseExamAttempt(JSON.stringify(validSnapshot({ questionIds: ["q-1", "q-1"] })), opts),
    null,
  );
});

test("parseExamAttempt rejects unknown questionIds (not in the current pool)", () => {
  assert.equal(
    parseExamAttempt(JSON.stringify(validSnapshot({ questionIds: ["q-1", "q-404"] })), opts),
    null,
  );
});

test("parseExamAttempt rejects malformed answers", () => {
  assert.equal(parseExamAttempt(JSON.stringify(validSnapshot({ answers: "x" })), opts), null);
  assert.equal(
    parseExamAttempt(JSON.stringify(validSnapshot({ answers: [{ questionId: "q-1" }] })), opts),
    null,
  );
  // learning answers require a non-empty selectedAnswerId
  assert.equal(
    parseExamAttempt(
      JSON.stringify(
        validSnapshot({
          answers: [
            {
              questionId: "q-1",
              selectedAnswerId: "",
              isCorrect: false,
              answeredAt: "2026-01-01T00:00:05.000Z",
              mode: "learning",
            },
          ],
        }),
      ),
      opts,
    ),
    null,
  );
});

test("parseExamAttempt rejects more answers than questions", () => {
  const raw = JSON.stringify(
    validSnapshot({
      questionIds: ["q-1"],
      answers: [examAnswer("q-1", true), examAnswer("q-1", true)],
    }),
  );
  assert.equal(parseExamAttempt(raw, opts), null);
});

test("parseExamAttempt rejects a terminal snapshot (every question already answered)", () => {
  // A finished attempt whose key survived (clear failed / tab killed after the
  // last answer) must not be resumable: restoring position = answers.length would
  // put the active render past the last question and dereference undefined.
  const terminal = JSON.stringify(
    validSnapshot({
      questionIds: ["q-1", "q-2"],
      answers: [examAnswer("q-1", true), examAnswer("q-2", false)],
    }),
  );
  assert.equal(parseExamAttempt(terminal, opts), null);
  // The boundary just below (one answer short of terminal) is still resumable.
  const resumable = JSON.stringify(
    validSnapshot({ questionIds: ["q-1", "q-2"], answers: [examAnswer("q-1", true)] }),
  );
  assert.notEqual(parseExamAttempt(resumable, opts), null);
});

test("parseExamAttempt rejects non-finite startedAt/deadline", () => {
  assert.equal(parseExamAttempt(JSON.stringify(validSnapshot({ startedAt: "x" })), opts), null);
  assert.equal(parseExamAttempt(JSON.stringify(validSnapshot({ deadline: null })), opts), null);
  // JSON cannot carry Infinity/NaN literally; a string field must still be rejected.
  assert.equal(
    parseExamAttempt(
      '{"version":1,"questionIds":["q-1"],"answers":[],"startedAt":1,"deadline":1e999}',
      opts,
    ),
    null,
  );
});

test("parseExamAttempt rejects an expired attempt and the exact deadline boundary", () => {
  assert.equal(parseExamAttempt(JSON.stringify(validSnapshot({ deadline: now - 1 })), opts), null);
  // deadline === now is expired (no positive remaining time left)
  assert.equal(parseExamAttempt(JSON.stringify(validSnapshot({ deadline: now })), opts), null);
  // deadline === now + 1 is still valid
  assert.notEqual(
    parseExamAttempt(JSON.stringify(validSnapshot({ deadline: now + 1 })), opts),
    null,
  );
});

test("remainingSeconds ceils future time, floors the past and the exact deadline at zero", () => {
  assert.equal(remainingSeconds(10_000, 0), 10);
  assert.equal(remainingSeconds(10_500, 0), 11); // ceil of 10.5s
  assert.equal(remainingSeconds(1, 0), 1);
  assert.equal(remainingSeconds(0, 0), 0);
  assert.equal(remainingSeconds(0, 5_000), 0); // past → floored at 0
});

test("saveExamAttempt writes under the key and round-trips through readExamAttempt", () => {
  const storage = new FakeStorage();
  assert.equal(saveExamAttempt(storage, validSnapshot()), true);
  assert.equal(storage.getItem(EXAM_ATTEMPT_KEY), JSON.stringify(validSnapshot()));
  assert.deepEqual(readExamAttempt(storage, opts), validSnapshot());
});

test("saveExamAttempt returns false without throwing when the write is rejected", () => {
  const denied = new FakeStorage({}, { setFailures: [new Error("security")] });
  assert.equal(saveExamAttempt(denied, validSnapshot()), false);
  const exhausted = new FakeStorage({}, { setFailures: [quota()] });
  assert.equal(saveExamAttempt(exhausted, validSnapshot()), false);
});

test("readExamAttempt returns null on read failure and for a stored broken/expired value", () => {
  assert.equal(
    readExamAttempt(new FakeStorage({}, { getFailures: [new Error("denied")] }), opts),
    null,
  );
  const broken = new FakeStorage({ [EXAM_ATTEMPT_KEY]: "not-json{" });
  assert.equal(readExamAttempt(broken, opts), null);
  const expired = new FakeStorage({
    [EXAM_ATTEMPT_KEY]: JSON.stringify(validSnapshot({ deadline: now - 10 })),
  });
  assert.equal(readExamAttempt(expired, opts), null);
  assert.equal(readExamAttempt(new FakeStorage(), opts), null);
});

test("clearExamAttempt removes the key and swallows removal failures", () => {
  const storage = new FakeStorage({ [EXAM_ATTEMPT_KEY]: JSON.stringify(validSnapshot()) });
  clearExamAttempt(storage);
  assert.equal(storage.getItem(EXAM_ATTEMPT_KEY), null);
  assert.doesNotThrow(() =>
    clearExamAttempt(new FakeStorage({}, { removeFailures: [new Error("denied")] })),
  );
});
