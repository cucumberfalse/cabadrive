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

test("exam config uses current 2025 CABA format", () => {
  const exam = JSON.parse(readFileSync("content/config/caba-exam-format.json", "utf8"));
  assert.equal(exam.questionCount, 40);
  assert.equal(exam.timeLimitMinutes, 45);
  assert.equal(exam.passingScore, 85);
  assert.equal(exam.status, "defined");
});
