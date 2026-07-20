import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import ts from "typescript";

const source = readFileSync("src/progressStoreCore.ts", "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    isolatedModules: true,
  },
  fileName: "src/progressStoreCore.ts",
}).outputText;
const core = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`
);
const {
  ANSWER_LIMIT,
  PROGRESS_BACKUP_KEY,
  PROGRESS_KEY,
  PROGRESS_RECOVERY_KEY,
  createProgressStore,
  emptyProgress,
  mistakesFromProgress,
  parseImportedProgress,
  pruneToLimit,
} = core;

class FakeStorage {
  constructor(entries = {}, failures = []) {
    this.entries = new Map(Object.entries(entries));
    this.failures = [...failures];
    this.writes = [];
  }
  getItem(key) {
    return this.entries.get(key) ?? null;
  }
  setItem(key, value) {
    this.writes.push([key, value]);
    const failure = this.failures.shift();
    if (failure) throw failure;
    this.entries.set(key, value);
  }
  removeItem(key) {
    this.entries.delete(key);
  }
}
const quota = () => Object.assign(new Error("quota"), { name: "QuotaExceededError" });
const answer = (index, correct = index % 3 !== 0) => ({
  questionId: `q-${index % 7}`,
  selectedAnswerId: `a-${index}`,
  isCorrect: correct,
  answeredAt: `2026-01-01T00:00:${String(index % 60).padStart(2, "0")}.000Z`,
  mode: "learning",
});
const attempt = {
  id: "exam-1",
  finishedAt: "2026-01-01T00:00:00.000Z",
  score: 85,
  passed: true,
  total: 40,
};
const v2 = (overrides = {}) => ({
  version: 2,
  answers: [answer(1)],
  difficultQuestionIds: ["q-1"],
  examAttempts: [attempt],
  prunedAnswerStats: [],
  ...overrides,
});

test("migrates production-shaped v1, backs up exact raw payload before v2 overwrite and reloads idempotently", () => {
  const raw = JSON.stringify({
    answers: [answer(1)],
    difficultQuestionIds: ["q-1"],
    examAttempts: [attempt],
  });
  const storage = new FakeStorage({ [PROGRESS_KEY]: raw });
  const store = createProgressStore(storage);
  assert.equal(storage.getItem(PROGRESS_BACKUP_KEY), raw);
  assert.equal(storage.writes[0][0], PROGRESS_BACKUP_KEY);
  assert.equal(storage.writes[1][0], PROGRESS_KEY);
  assert.deepEqual(store.getSnapshot().answers, [answer(1)]);
  const reload = createProgressStore(storage);
  assert.deepEqual(reload.getSnapshot(), store.getSnapshot());
  assert.equal(storage.writes.filter(([key]) => key === PROGRESS_BACKUP_KEY).length, 1);
});

test("does not overwrite v1 primary when exact backup write fails", () => {
  const raw = JSON.stringify({ answers: [answer(1)], difficultQuestionIds: [], examAttempts: [] });
  const storage = new FakeStorage({ [PROGRESS_KEY]: raw }, [
    new Error("blocked"),
    new Error("blocked again"),
  ]);
  const events = [];
  const store = createProgressStore(storage);
  store.subscribeRecovery((event) => events.push(event));
  store.dispatch({ type: "recordAnswer", answer: answer(2) });
  assert.equal(storage.getItem(PROGRESS_KEY), raw);
  assert.equal(events.at(-1).code, "migrationBackupFailed");
});

test("local corruption salvages retained suffix while corrupt aggregate contributes no invented mistakes", () => {
  const raw = JSON.stringify(
    v2({
      answers: [answer(3, false)],
      prunedAnswerStats: [
        { questionId: "q-9", wrong: 1, lastPrunedAnswer: answer(8, false), firstSeenOrder: 0 },
        { questionId: "q-9", wrong: 1, lastPrunedAnswer: answer(9, false), firstSeenOrder: 1 },
      ],
    }),
  );
  const store = createProgressStore(new FakeStorage({ [PROGRESS_KEY]: raw }));
  assert.deepEqual(store.getSnapshot().prunedAnswerStats, []);
  assert.deepEqual(
    mistakesFromProgress(store.getSnapshot()).map(({ questionId, wrong }) => ({
      questionId,
      wrong,
    })),
    [{ questionId: "q-3", wrong: 1 }],
  );
});

test("unknown local versions fail closed instead of being mistaken for legacy v1", () => {
  const storage = new FakeStorage({
    [PROGRESS_KEY]: JSON.stringify({ version: 99, answers: [answer(1, false)] }),
  });
  const store = createProgressStore(storage);
  assert.deepEqual(store.getSnapshot(), emptyProgress());
  assert.equal(storage.getItem(PROGRESS_BACKUP_KEY), null);
});

test("pruning six thousand answers preserves uncapped mistake selector including pruned-only errors and stable ties", () => {
  const history = Array.from({ length: 6000 }, (_, index) => answer(index, index % 5 !== 0));
  const full = new Map();
  for (const item of history) {
    const current = full.get(item.questionId) ?? { wrong: 0 };
    current.wrong += Number(!item.isCorrect);
    current.last = item;
    full.set(item.questionId, current);
  }
  const expected = [...full.entries()]
    .filter(([, item]) => item.wrong)
    .sort((a, b) => b[1].wrong - a[1].wrong)
    .map(([questionId, item]) => ({ questionId, wrong: item.wrong, last: item.last }));
  const capped = pruneToLimit({ ...emptyProgress(), answers: history });
  assert.equal(capped.answers.length, ANSWER_LIMIT);
  assert.deepEqual(mistakesFromProgress(capped), expected);
});

test("repeated pruning and quota retries fold disjoint prefixes exactly once", () => {
  const history = Array.from({ length: 12 }, (_, index) => answer(index, index % 2 === 1));
  const once = pruneToLimit({ ...emptyProgress(), answers: history }, 8);
  const twice = pruneToLimit(once, 4);
  assert.deepEqual(
    mistakesFromProgress(twice),
    mistakesFromProgress(pruneToLimit({ ...emptyProgress(), answers: history }, 4)),
  );
  const storage = new FakeStorage({}, [quota(), quota(), null]);
  const store = createProgressStore(storage);
  store.dispatch({ type: "finishExam", answers: history, attempt });
  assert.equal(store.getSnapshot().answers.length, 3);
  assert.equal(
    mistakesFromProgress(store.getSnapshot()).reduce((sum, item) => sum + item.wrong, 0),
    history.filter((item) => !item.isCorrect).length,
  );
});

test("quota exhaustion and ordinary writes retain a usable memory snapshot with typed recovery", () => {
  const storage = new FakeStorage({}, [quota(), quota()]);
  const store = createProgressStore(storage);
  const events = [];
  store.subscribeRecovery((event) => events.push(event));
  store.dispatch({ type: "recordAnswer", answer: answer(1, false) });
  assert.equal(store.getSnapshot().answers.length, 0);
  assert.equal(store.getSnapshot().prunedAnswerStats[0].wrong, 1);
  assert.equal(events.at(-1).code, "storageQuotaExhausted");
  const writeFail = createProgressStore(new FakeStorage({}, [new Error("security")]));
  const failed = [];
  writeFail.subscribeRecovery((event) => failed.push(event));
  writeFail.dispatch({ type: "recordAnswer", answer: answer(2) });
  assert.equal(writeFail.getSnapshot().answers.length, 1);
  assert.equal(failed.at(-1).code, "storageWriteFailed");
});

test("import/export is canonical and invalid input is atomic", () => {
  const storage = new FakeStorage();
  const store = createProgressStore(storage);
  store.dispatch({ type: "finishExam", answers: [answer(1, false), answer(2)], attempt });
  const exported = store.exportProgress();
  const imported = createProgressStore(new FakeStorage());
  assert.equal(imported.dispatch({ type: "importProgress", raw: exported }), true);
  assert.equal(imported.exportProgress(), exported);
  const before = imported.exportProgress();
  assert.equal(
    imported.dispatch({ type: "importProgress", raw: JSON.stringify({ ...v2(), version: 3 }) }),
    false,
  );
  assert.equal(imported.exportProgress(), before);
  assert.equal(
    parseImportedProgress(JSON.stringify(v2({ difficultQuestionIds: ["q-1", "q-1"] }))),
    undefined,
  );
  imported.dispatch({ type: "reset" });
  assert.deepEqual(imported.getSnapshot(), emptyProgress());
});

test("reset clears the primary, migration backup, and recovery diagnostic keys", () => {
  const raw = JSON.stringify({ answers: [answer(1)], difficultQuestionIds: [], examAttempts: [] });
  const storage = new FakeStorage({ [PROGRESS_KEY]: raw, [PROGRESS_RECOVERY_KEY]: "{}" });
  const store = createProgressStore(storage);
  assert.equal(storage.getItem(PROGRESS_BACKUP_KEY), raw);
  store.dispatch({ type: "reset" });
  assert.equal(storage.getItem(PROGRESS_BACKUP_KEY), null);
  assert.equal(storage.getItem(PROGRESS_RECOVERY_KEY), null);
  assert.deepEqual(store.getSnapshot(), emptyProgress());
});

test("reset removes the primary key even when the follow-up empty write fails", () => {
  const storage = new FakeStorage({ [PROGRESS_KEY]: JSON.stringify(v2()) }, [new Error("disk")]);
  const store = createProgressStore(storage);
  store.dispatch({ type: "reset" });
  assert.equal(storage.getItem(PROGRESS_KEY), null);
  assert.deepEqual(store.getSnapshot(), emptyProgress());
});

test("rejects zero-wrong aggregate whose last pruned answer is incorrect", () => {
  const badStat = {
    questionId: "q-9",
    wrong: 0,
    firstSeenOrder: 0,
    lastPrunedAnswer: { ...answer(9), questionId: "q-9", isCorrect: false },
  };
  assert.equal(
    parseImportedProgress(JSON.stringify(v2({ prunedAnswerStats: [badStat] }))),
    undefined,
  );
  const goodStat = {
    ...badStat,
    lastPrunedAnswer: { ...badStat.lastPrunedAnswer, isCorrect: true },
  };
  assert.notEqual(
    parseImportedProgress(JSON.stringify(v2({ prunedAnswerStats: [goodStat] }))),
    undefined,
  );
});

test("empty selectedAnswerId is accepted only for exam skips, not learning or mistakes", () => {
  const learningEmpty = { ...answer(1), selectedAnswerId: "", mode: "learning" };
  assert.equal(parseImportedProgress(JSON.stringify(v2({ answers: [learningEmpty] }))), undefined);
  const examSkip = { ...answer(2), selectedAnswerId: "", mode: "exam", isCorrect: false };
  assert.notEqual(parseImportedProgress(JSON.stringify(v2({ answers: [examSkip] }))), undefined);
});

test("persisted answers are canonicalized and extra enumerable fields are dropped", () => {
  const polluted = { ...answer(1), injectedField: "should-not-survive", bloat: [1, 2, 3] };
  const raw = JSON.stringify(v2({ answers: [polluted] }));
  const store = createProgressStore(new FakeStorage({ [PROGRESS_KEY]: raw }));
  const exported = store.exportProgress();
  assert.equal(exported.includes("injectedField"), false);
  assert.equal(exported.includes("bloat"), false);
  const [stored] = JSON.parse(exported).answers;
  assert.deepEqual(Object.keys(stored).sort(), [
    "answeredAt",
    "isCorrect",
    "mode",
    "questionId",
    "selectedAnswerId",
  ]);
});

test("all reducer actions are immutable and the source confines storage writes to the boundary", () => {
  const store = createProgressStore(new FakeStorage());
  const before = store.getSnapshot();
  store.dispatch({ type: "toggleDifficult", questionId: "q-1" });
  store.dispatch({ type: "recordAnswer", answer: answer(1) });
  assert.deepEqual(before, emptyProgress());
  assert.deepEqual(store.getSnapshot().difficultQuestionIds, ["q-1"]);
  const app = readFileSync("src/App.tsx", "utf8");
  assert.doesNotMatch(app, /saveProgress\(|localStorage\.(?:setItem|removeItem)|setProgress/);
  assert.match(readFileSync("src/progressStoreCore.ts", "utf8"), /storage\.setItem\(PROGRESS_KEY/);
});
