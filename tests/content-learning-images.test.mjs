import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { test } from "node:test";
import { pathToFileURL } from "node:url";
import { collectLearningImageCoverageUnits, formatLearningImageSummary, isDirectInvocation, svgForImage, validateLearningImages } from "../scripts/content-learning-images.mjs";

const topicGuide = JSON.parse(readFileSync("content/guide/topic-study-guide.ru.json", "utf8"));
const vocabulary = JSON.parse(readFileSync("content/vocabulary/ru.vocabulary.json", "utf8"));
const manifest = JSON.parse(readFileSync("content/learning-images/learning-images.manifest.json", "utf8"));
const evidence = JSON.parse(readFileSync("content/validation/learning-images.evidence.json", "utf8"));

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function validateWithMockFiles(badManifest) {
  return validateLearningImages({
    topicGuide,
    vocabulary,
    manifest: badManifest,
    evidence,
    fileExists: () => true,
    fileSha256: (localPath) => {
      const image = badManifest.images.find((item) => item.localPath === localPath);
      return image?.sha256 || "";
    },
    readDimensions: () => ({ width: badManifest.images[0].width, height: badManifest.images[0].height })
  });
}

test("learning-image validator passes current manifest and reports computed coverage", () => {
  const output = execFileSync("node", ["scripts/content-learning-images.mjs"], { encoding: "utf8" });
  const result = validateLearningImages({ topicGuide, vocabulary, manifest, evidence });
  assert.equal(output.trim(), formatLearningImageSummary(result.summary));
});

test("learning-image CLI direct invocation guard handles URL-escaped paths", () => {
  const scriptPath = resolve("tmp path with spaces", "content-learning-images.mjs");
  const scriptUrl = pathToFileURL(scriptPath).href;
  assert.ok(scriptUrl.includes("%20"));
  assert.equal(isDirectInvocation(scriptUrl, scriptPath), true);
  assert.equal(isDirectInvocation(scriptUrl, resolve("other path", "content-learning-images.mjs")), false);
  assert.equal(isDirectInvocation(scriptUrl, undefined), false);
});

test("learning-image manifest has no duplicate direct image hashes", () => {
  const directImageIds = new Set(manifest.coverage.filter((record) => record.status === "direct").flatMap((record) => record.imageIds));
  const hashes = manifest.images.filter((image) => directImageIds.has(image.imageId)).map((image) => image.sha256);
  assert.equal(hashes.length, directImageIds.size);
  assert.equal(new Set(hashes).size, hashes.length);
});

test("direct SVG generation uses unit-specific visual entropy", () => {
  const firstSvg = svgForImage("topic-learning:parallel-parking:1:watch-side-clearance-before-moving", "topic");
  const secondSvg = svgForImage("topic-learning:parallel-parking:2:watch-rear-clearance-before-moving", "topic");
  assert.notEqual(sha256(firstSvg), sha256(secondSvg));
  const visualNumbers = (svg) => [
    svg.match(/M(\d+) \d+ h\d+ a26 26 0 0 1 24 17/)?.[1],
    svg.match(/r="(\d+)" fill="#ffffff" stroke/)?.[1],
    svg.match(/M(\d+) 322 c22 -34/)?.[1],
    svg.match(/opacity="(0\.\d+)"/g)?.at(-1)
  ];
  assert.notDeepEqual(visualNumbers(firstSvg), visualNumbers(secondSvg));
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
  const result = validateWithMockFiles(badManifest);
  assert.ok(result.errors.some((error) => error.includes("content/assets/learning/generated/v1")));
  assert.ok(result.errors.some((error) => error.includes("canonical question-image assets")));
});

test("learning-image validator rejects traversed localPath outside learning assets without throwing", () => {
  const badManifest = clone(manifest);
  badManifest.images[0].localPath = "content/assets/learning/../../assets/questions/source-bandinopla-testdeconducir-b/b1.jpg";
  const result = validateWithMockFiles(badManifest);
  assert.ok(result.errors.some((error) => error.includes("content/assets/learning/generated/v1")));
  assert.ok(result.errors.some((error) => error.includes("canonical question-image assets")));
});

test("learning-image validator rejects absolute localPath without throwing", () => {
  const badManifest = clone(manifest);
  badManifest.images[0].localPath = resolve(manifest.images[0].localPath);
  const result = validateWithMockFiles(badManifest);
  assert.ok(result.errors.some((error) => error.includes("repository-relative")));
});

test("learning-image validator accepts safe dot-segment localPath after resolution", () => {
  const safeManifest = clone(manifest);
  safeManifest.images[0].localPath = safeManifest.images[0].localPath.replace("generated/v1/", "generated/v1/./");
  const result = validateWithMockFiles(safeManifest);
  assert.ok(!result.errors.some((error) => error.includes("localPath")));
});

test("learning-image validator rejects non-string localPath values without throwing", () => {
  for (const localPath of [null, { path: manifest.images[0].localPath }, [manifest.images[0].localPath], 42]) {
    const badManifest = clone(manifest);
    badManifest.images[0].localPath = localPath;
    const result = validateWithMockFiles(badManifest);
    assert.ok(result.errors.some((error) => error.includes("localPath must be a repository-relative string")));
  }
});

test("learning-image validator reports malformed images field without throwing", () => {
  const badManifest = clone(manifest);
  badManifest.images = {};
  const result = validateLearningImages({ topicGuide, vocabulary, manifest: badManifest, evidence });
  assert.ok(result.errors.includes("learning-images.manifest.json: images must be an array."));
});

test("learning-image validator rejects null and primitive image entries without throwing", () => {
  for (const imageEntry of [null, "image", 12, true]) {
    const badManifest = clone(manifest);
    badManifest.images = [imageEntry];
    const result = validateLearningImages({ topicGuide, vocabulary, manifest: badManifest, evidence });
    assert.ok(result.errors.some((error) => error.includes("images[0]: image record must be an object.")));
  }
});

test("learning-image validator rejects array image entries without throwing", () => {
  const badManifest = clone(manifest);
  badManifest.images = [[manifest.images[0]]];
  const result = validateLearningImages({ topicGuide, vocabulary, manifest: badManifest, evidence });
  assert.ok(result.errors.some((error) => error.includes("images[0]: image record must be an object.")));
});

test("learning-image validator reports object image entries missing metadata without throwing", () => {
  const badManifest = clone(manifest);
  badManifest.images = [{}];
  const result = validateLearningImages({ topicGuide, vocabulary, manifest: badManifest, evidence });
  assert.ok(result.errors.some((error) => error.includes("images[0]: imageId is required.")));
  assert.ok(result.errors.some((error) => error.includes("images[0]: localPath must be a repository-relative string")));
});

test("learning-image validator reports mixed valid and invalid image entries without throwing", () => {
  const badManifest = clone(manifest);
  badManifest.images = [badManifest.images[0], null, badManifest.images[1], ["bad"]];
  const result = validateLearningImages({ topicGuide, vocabulary, manifest: badManifest, evidence });
  assert.ok(result.errors.some((error) => error.includes("images[1]: image record must be an object.")));
  assert.ok(result.errors.some((error) => error.includes("images[3]: image record must be an object.")));
});

test("learning-image validator reports malformed coverage field without throwing", () => {
  const badManifest = clone(manifest);
  badManifest.coverage = {};
  const result = validateLearningImages({ topicGuide, vocabulary, manifest: badManifest, evidence });
  assert.ok(result.errors.includes("learning-images.manifest.json: coverage must be an array."));
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

test("learning-image validator rejects non-string shared concept keys without throwing", () => {
  for (const conceptKey of [null, { key: "concept-speed" }, ["concept-speed"], 7]) {
    const badManifest = clone(manifest);
    const [first, second] = badManifest.coverage.filter((record) => record.unitKind !== "vocabularyTerm").slice(0, 2);
    first.status = "shared";
    first.sharedConcept = {
      conceptKey,
      titleRu: "Контроль дистанции",
      rationaleRu: "Пара близких учебных единиц про наблюдение и безопасное действие.",
      relatedUnitIds: [first.unitId, second.unitId]
    };
    const result = validateLearningImages({ topicGuide, vocabulary, manifest: badManifest, evidence });
    assert.ok(result.errors.some((error) => error.includes("sharedConcept.conceptKey is required")));
  }
});

test("learning-image validator accepts audited shared concept key shape", () => {
  const badManifest = clone(manifest);
  const [first, second] = badManifest.coverage.filter((record) => record.unitKind !== "vocabularyTerm").slice(0, 2);
  first.status = "shared";
  first.sharedConcept = {
    conceptKey: "concept-safe-observation-distance",
    titleRu: "Безопасное наблюдение",
    rationaleRu: "Пара близких учебных единиц использует одну схему наблюдения без привязки ко всей теме.",
    relatedUnitIds: [first.unitId, second.unitId]
  };
  const result = validateLearningImages({ topicGuide, vocabulary, manifest: badManifest, evidence });
  assert.ok(!result.errors.some((error) => error.includes("sharedConcept.")));
  assert.ok(!result.errors.some((error) => error.includes("generic topic-wide sharing")));
});

test("learning-image validator rejects null and primitive coverage entries without throwing", () => {
  for (const coverageEntry of [null, "coverage", 12, true]) {
    const badManifest = clone(manifest);
    badManifest.coverage = [coverageEntry];
    const result = validateLearningImages({ topicGuide, vocabulary, manifest: badManifest, evidence });
    assert.ok(result.errors.some((error) => error.includes("coverage[0]: coverage record must be an object.")));
  }
});

test("learning-image validator reports mixed valid and invalid coverage entries without throwing", () => {
  const badManifest = clone(manifest);
  badManifest.coverage = [badManifest.coverage[0], null, badManifest.coverage[1], 7];
  const result = validateLearningImages({ topicGuide, vocabulary, manifest: badManifest, evidence });
  assert.ok(result.errors.some((error) => error.includes("coverage[1]: coverage record must be an object.")));
  assert.ok(result.errors.some((error) => error.includes("coverage[3]: coverage record must be an object.")));
});
