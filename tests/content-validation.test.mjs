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

test("parking vocabulary source links match canonical ticket wording", () => {
  const questions = JSON.parse(readFileSync("content/questions/caba-b.unofficial-fallback.questions.json", "utf8"));
  const vocabulary = JSON.parse(readFileSync("content/vocabulary/ru.vocabulary.json", "utf8"));
  const questionById = new Map(questions.map((question) => [question.id, question]));
  const parkingTermIds = new Set(["term-de-cada-lado", "term-para-cada-lado"]);
  const normalize = (value) => value.toLowerCase().replace(/\s+/g, " ").trim();
  const canonicalText = (question) =>
    normalize([question.officialTextEs, ...question.answers.map((answer) => answer.officialTextEs)].join(" "));

  for (const term of vocabulary.filter((item) => parkingTermIds.has(item.id))) {
    for (const questionId of term.sourceQuestionIds) {
      const question = questionById.get(questionId);
      assert.ok(question, `${term.id} links missing question ${questionId}`);
      assert.ok(canonicalText(question).includes(normalize(term.termEs)), `${term.id} termEs does not appear in ${questionId}`);
    }
    for (const example of term.examples) {
      const question = questionById.get(example.questionId);
      assert.ok(question, `${term.id} example links missing question ${example.questionId}`);
      assert.ok(canonicalText(question).includes(normalize(example.textEs)), `${term.id} example text does not appear in ${example.questionId}`);
    }
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
