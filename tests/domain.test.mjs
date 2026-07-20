import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import ts from "typescript";

const domainSource = readFileSync("src/domain.ts", "utf8");
const domainJavaScript = ts.transpileModule(domainSource, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    isolatedModules: true,
  },
  fileName: "src/domain.ts",
}).outputText;
const domain = await import(
  `data:text/javascript;base64,${Buffer.from(domainJavaScript).toString("base64")}`
);
const {
  formatDuration,
  learningTicketTargetSeconds,
  mistakesFromHistory,
  scorePercent,
  selectExamSet,
  shuffleQuestions,
} = domain;

test("scoring floors percentage for official exam threshold comparison", () => {
  assert.equal(scorePercent(34, 40), 85);
  assert.equal(scorePercent(33, 40), 82);
});

test("mistake history prioritizes repeated wrong answers", () => {
  const mistakes = mistakesFromHistory([
    { questionId: "b-fallback-001", isCorrect: false },
    { questionId: "b-fallback-002", isCorrect: false },
    { questionId: "b-fallback-001", isCorrect: false },
    { questionId: "b-fallback-003", isCorrect: true },
  ]);
  assert.equal(mistakes[0].questionId, "b-fallback-001");
  assert.equal(mistakes[0].wrong, 2);
});

test("exam selection honors random order rule from the configured pool", () => {
  const questions = ["q1", "q2", "q3", "q4", "q5"].map((id, index) => ({
    id,
    flags: { hasImage: index % 2 === 0 },
  }));
  const lowShuffle = selectExamSet(
    questions,
    3,
    "random_questions_from_available_validated_pool",
    () => 0,
  ).map((question) => question.id);
  const highShuffle = selectExamSet(
    questions,
    3,
    "random_questions_from_available_validated_pool",
    () => 0.99,
  ).map((question) => question.id);

  assert.notDeepEqual(lowShuffle, highShuffle);
  assert.equal(new Set(lowShuffle).size, 3);
  assert.equal(new Set(highShuffle).size, 3);
});

test("learning shuffle returns every question once without mutating input", () => {
  const questions = ["q1", "q2", "q3", "q4", "q5"].map((id) => ({ id }));
  const originalOrder = questions.map((question) => question.id);
  const shuffled = shuffleQuestions(questions, () => 0).map((question) => question.id);

  assert.deepEqual(
    questions.map((question) => question.id),
    originalOrder,
  );
  assert.deepEqual([...shuffled].sort(), [...originalOrder].sort());
  assert.equal(new Set(shuffled).size, questions.length);
});

test("learning shuffle supports deterministic random streams", () => {
  const questions = ["q1", "q2", "q3", "q4", "q5"].map((id) => ({ id }));
  const lowShuffle = shuffleQuestions(questions, () => 0).map((question) => question.id);
  const highShuffle = shuffleQuestions(questions, () => 0.999999).map((question) => question.id);
  const streamedShuffle = shuffleQuestions(questions, sequenceRandom([0.2, 0.7, 0.1, 0.9])).map(
    (question) => question.id,
  );

  assert.notDeepEqual(lowShuffle, highShuffle);
  assert.notDeepEqual(streamedShuffle, highShuffle);
  assert.deepEqual(
    highShuffle,
    questions.map((question) => question.id),
  );
});

test("learning shuffle handles an empty input", () => {
  assert.deepEqual(
    shuffleQuestions([], () => 0.5),
    [],
  );
});

function sequenceRandom(values) {
  let index = 0;
  return () => {
    const value = values[index] ?? values.at(-1) ?? 0;
    index += 1;
    return value;
  };
}

test("exam config uses current 2025 CABA format", () => {
  const exam = JSON.parse(readFileSync("content/config/caba-exam-format.json", "utf8"));
  assert.equal(exam.questionCount, 40);
  assert.equal(exam.timeLimitMinutes, 45);
  assert.equal(exam.passingScore, 85);
  assert.equal(exam.status, "defined");
});

test("learning ticket target derives from official exam format and displays as m:ss", () => {
  const exam = JSON.parse(readFileSync("content/config/caba-exam-format.json", "utf8"));
  const target = learningTicketTargetSeconds(exam);

  assert.equal(target, 75);
  assert.equal(formatDuration(target), "1:15");
});

test("learning ticket target rounds alternate valid formats to nearest 15 seconds upward", () => {
  assert.equal(learningTicketTargetSeconds({ timeLimitMinutes: 30, questionCount: 20 }), 90);
  assert.equal(learningTicketTargetSeconds({ timeLimitMinutes: 10, questionCount: 9 }), 75);
});

test("learning ticket target fails closed for invalid exam format metadata", () => {
  assert.equal(learningTicketTargetSeconds({ timeLimitMinutes: 45, questionCount: 0 }), undefined);
  assert.equal(learningTicketTargetSeconds({ timeLimitMinutes: 0, questionCount: 40 }), undefined);
  assert.equal(
    learningTicketTargetSeconds({ timeLimitMinutes: Number.NaN, questionCount: 40 }),
    undefined,
  );
});
