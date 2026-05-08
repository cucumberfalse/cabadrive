import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

function scorePercent(correct, total) {
  if (total <= 0) return 0;
  return Math.floor((correct / total) * 100);
}

function mistakesFromHistory(history) {
  const stats = new Map();
  for (const answer of history) {
    const current = stats.get(answer.questionId) || { wrong: 0 };
    if (!answer.isCorrect) current.wrong += 1;
    current.last = answer;
    stats.set(answer.questionId, current);
  }
  return [...stats.entries()].filter(([, stat]) => stat.wrong > 0).sort((a, b) => b[1].wrong - a[1].wrong);
}

function selectExamSet(questions, count, questionOrderRule, random = Math.random) {
  if (questionOrderRule === "random_questions_from_available_validated_pool") {
    const shuffled = [...questions];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(random() * (index + 1));
      [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  return [...questions].sort((a, b) => {
    if (Number(b.flags.hasImage) !== Number(a.flags.hasImage)) {
      return Number(b.flags.hasImage) - Number(a.flags.hasImage);
    }
    return a.id.localeCompare(b.id);
  }).slice(0, Math.min(count, questions.length));
}

test("scoring floors percentage for official exam threshold comparison", () => {
  assert.equal(scorePercent(34, 40), 85);
  assert.equal(scorePercent(33, 40), 82);
});

test("mistake history prioritizes repeated wrong answers", () => {
  const mistakes = mistakesFromHistory([
    { questionId: "b-fallback-001", isCorrect: false },
    { questionId: "b-fallback-002", isCorrect: false },
    { questionId: "b-fallback-001", isCorrect: false },
    { questionId: "b-fallback-003", isCorrect: true }
  ]);
  assert.equal(mistakes[0][0], "b-fallback-001");
  assert.equal(mistakes[0][1].wrong, 2);
});

test("exam selection honors random order rule from the configured pool", () => {
  const questions = ["q1", "q2", "q3", "q4", "q5"].map((id, index) => ({
    id,
    flags: { hasImage: index % 2 === 0 }
  }));
  const lowShuffle = selectExamSet(questions, 3, "random_questions_from_available_validated_pool", () => 0).map((question) => question.id);
  const highShuffle = selectExamSet(questions, 3, "random_questions_from_available_validated_pool", () => 0.99).map((question) => question.id);

  assert.notDeepEqual(lowShuffle, highShuffle);
  assert.equal(new Set(lowShuffle).size, 3);
  assert.equal(new Set(highShuffle).size, 3);
});

test("exam config uses current 2025 CABA format", () => {
  const exam = JSON.parse(readFileSync("content/config/caba-exam-format.json", "utf8"));
  assert.equal(exam.questionCount, 40);
  assert.equal(exam.timeLimitMinutes, 45);
  assert.equal(exam.passingScore, 85);
  assert.equal(exam.status, "defined");
});
