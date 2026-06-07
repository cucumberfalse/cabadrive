import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";

test("content validation command passes", () => {
  const output = execFileSync("node", ["scripts/validate-content.mjs"], { encoding: "utf8" });
  const learningEvidence = JSON.parse(readFileSync("content/validation/learning-images.evidence.json", "utf8"));
  const learningSummary = learningEvidence.summary;
  assert.match(output, /Difficulty labels validated: 460 questions, 38 topics/);
  assert.match(
    output,
    new RegExp(`Learning images validated: ${learningSummary.coverageUnitCount} units, ${learningSummary.imageCount} local images`)
  );
  assert.match(
    output,
    /Manual 4 ruedas RU validated: 200\/200 pages, 200 layout pages, 11 semantic sections, 56 topics, 200 local page assets, 198 approved reused translations, 2 visual-label translation pages/
  );
  assert.match(output, /Content validation passed/);
});

test("content validation wires learning-image runtime manifest into validator", () => {
  const source = readFileSync("scripts/validate-content.mjs", "utf8");
  assert.match(source, /content\/learning-images\/learning-images\.runtime\.json/);
  assert.match(source, /runtimeManifest:\s*learningImageRuntimeManifest/);
});

test("build content validation chain includes manual sign inventory guard", () => {
  const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
  assert.match(packageJson.scripts["validate:content"], /pnpm run validate:manual-sign-inventory/u);
  assert.match(packageJson.scripts.build, /pnpm run validate:content/u);
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

test("Russian explanations cover every current question with structured rationales", () => {
  const explanations = JSON.parse(readFileSync("content/explanations/ru.explanations.json", "utf8"));
  const questions = JSON.parse(readFileSync("content/questions/caba-b.unofficial-fallback.questions.json", "utf8"));
  assert.equal(explanations.length, questions.length);
  for (const explanation of explanations) {
    assert.ok(explanation.textRu.length >= 120, `${explanation.questionId} explanation is too terse`);
    assert.equal(typeof explanation.correctAnswerId, "string", explanation.questionId);
    assert.equal(typeof explanation.correctAnswerExplanationRu, "string", explanation.questionId);
    assert.equal(typeof explanation.wrongAnswerExplanations, "object", explanation.questionId);
    assert.ok(explanation.correctAnswerExplanationRu.length >= 40, `${explanation.questionId} correct-answer rationale is too terse`);
    assert.ok(Object.keys(explanation.wrongAnswerExplanations).length >= 1, `${explanation.questionId} missing wrong-answer rationales`);
  }
});
