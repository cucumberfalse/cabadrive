import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { collectLearningImageCoverageUnits, formatLearningImageSummary, validateLearningImages } from "../scripts/content-learning-images.mjs";

const topicGuide = JSON.parse(readFileSync("content/guide/topic-study-guide.ru.json", "utf8"));
const vocabulary = JSON.parse(readFileSync("content/vocabulary/ru.vocabulary.json", "utf8"));
const manifest = JSON.parse(readFileSync("content/learning-images/learning-images.manifest.json", "utf8"));
const evidence = JSON.parse(readFileSync("content/validation/learning-images.evidence.json", "utf8"));

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

test("learning-image validator passes current manifest and reports computed coverage", () => {
  const output = execFileSync("node", ["scripts/content-learning-images.mjs"], { encoding: "utf8" });
  const result = validateLearningImages({ topicGuide, vocabulary, manifest, evidence });
  assert.equal(output.trim(), formatLearningImageSummary(result.summary));
});

test("learning-image units are computed from topic guide and vocabulary", () => {
  const units = collectLearningImageCoverageUnits({ topicGuide, vocabulary });
  assert.equal(units.filter((unit) => unit.kind === "topicSummary").length, topicGuide.topics.length);
  assert.equal(units.filter((unit) => unit.kind === "vocabularyTerm").length, vocabulary.length);
  assert.equal(units.length, evidence.summary.coverageUnitCount);
  assert.ok(units.every((unit) => /^[a-f0-9]{64}$/.test(unit.sourceFingerprint)));
});

test("learning-image validator rejects stale coverage fingerprints", () => {
  const badManifest = clone(manifest);
  badManifest.coverage[0].sourceFingerprint = "0".repeat(64);
  const result = validateLearningImages({ topicGuide, vocabulary, manifest: badManifest, evidence });
  assert.ok(result.errors.some((error) => error.includes("source fingerprint is stale")));
});

test("learning-image validator rejects remote or question-image replacement paths", () => {
  const badManifest = clone(manifest);
  badManifest.images[0].localPath = "content/assets/questions/source-bandinopla-testdeconducir-b/b1.jpg";
  const result = validateLearningImages({
    topicGuide,
    vocabulary,
    manifest: badManifest,
    evidence,
    fileExists: () => true,
    fileSha256: () => badManifest.images[0].sha256,
    readDimensions: () => ({ width: badManifest.images[0].width, height: badManifest.images[0].height })
  });
  assert.ok(result.errors.some((error) => error.includes("content/assets/learning")));
  assert.ok(result.errors.some((error) => error.includes("canonical question-image assets")));
});

test("learning-image validator rejects missing coverage records", () => {
  const badManifest = clone(manifest);
  badManifest.coverage.pop();
  const result = validateLearningImages({ topicGuide, vocabulary, manifest: badManifest, evidence });
  assert.ok(result.errors.some((error) => error.includes("missing learning-image coverage record")));
});

test("learning-image validator rejects generic topic-wide shared coverage", () => {
  const badManifest = clone(manifest);
  const topicRecord = badManifest.coverage.find((record) => record.unitKind !== "vocabularyTerm");
  topicRecord.status = "shared";
  topicRecord.sharedConcept = {
    conceptKey: `topic:${topicRecord.unitId.split(":")[1]}`,
    titleRu: "Общая тема",
    rationaleRu: "Намеренно слишком общий bucket всей темы, который не доказывает смысловую близость единиц.",
    relatedUnitIds: badManifest.coverage
      .filter((record) => record.unitId.includes(`:${topicRecord.unitId.split(":")[1]}:`) || record.unitId.endsWith(`:${topicRecord.unitId.split(":")[1]}`))
      .slice(0, 4)
      .map((record) => record.unitId)
  };
  const result = validateLearningImages({ topicGuide, vocabulary, manifest: badManifest, evidence });
  assert.ok(result.errors.some((error) => error.includes("generic topic-wide sharing")));
});
