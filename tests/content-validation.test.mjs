import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";

test("content validation command passes", () => {
  const output = execFileSync("node", ["scripts/validate-content.mjs"], { encoding: "utf8" });
  assert.match(output, /Content validation passed/);
});

test("category B fallback questions keep local image references", () => {
  const questions = JSON.parse(readFileSync("content/questions/caba-b.unofficial-fallback.questions.json", "utf8"));
  const withImages = questions.filter((question) => question.image);
  assert.equal(questions.length, 460);
  assert.equal(withImages.length, 276);
  for (const question of withImages.slice(0, 20)) {
    assert.equal(question.category, "B");
    assert.ok(!question.image.localPath.startsWith("http"));
    assert.ok(existsSync(question.image.localPath), question.image.localPath);
  }
});

test("existing Russian explanations are expanded exam-focused learning notes", () => {
  const explanations = JSON.parse(readFileSync("content/explanations/ru.explanations.json", "utf8"));
  assert.equal(explanations.length, 5);
  for (const explanation of explanations) {
    assert.ok(explanation.textRu.length >= 240, `${explanation.questionId} explanation is too terse`);
    assert.match(explanation.textRu, /вариант|правильн|экзамен|испанск|водител|дорог|движен/i, explanation.questionId);
  }
});
