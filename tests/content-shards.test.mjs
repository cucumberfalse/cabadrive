import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import {
  CONTENT_SHARD_RANGES,
  assertGeneratedContentIndexesFresh,
  combinedContentFromShards,
  loadQuestionImageMetadataFromShards
} from "../scripts/content-shards.mjs";

test("content shards expose five deterministic non-overlapping ranges", () => {
  assert.deepEqual(
    CONTENT_SHARD_RANGES.map((range) => range.id),
    ["001-092", "093-184", "185-276", "277-368", "369-460"]
  );
  for (let index = 1; index < CONTENT_SHARD_RANGES.length; index += 1) {
    assert.equal(CONTENT_SHARD_RANGES[index - 1].end + 1, CONTENT_SHARD_RANGES[index].start);
  }
});

test("content shards combine into current generated indexes", () => {
  const combined = combinedContentFromShards();
  assert.deepEqual(combined.errors, []);
  assert.equal(combined.translations.length, 460);
  assert.equal(combined.explanations.length, 460);
  assert.equal(combined.imageMetadataManifest.images.length, 275);
  assert.equal(combined.imageMetadataManifest.questionUsages.length, 276);
  assert.deepEqual(assertGeneratedContentIndexesFresh(), []);
});

test("shared images have one owning image shard and per-question usage shards", () => {
  const { manifest, errors } = loadQuestionImageMetadataFromShards();
  assert.deepEqual(errors, []);
  const b2Images = manifest.images.filter(
    (image) => image.localPath === "content/assets/questions/source-bandinopla-testdeconducir-b/b2.jpg"
  );
  assert.equal(b2Images.length, 1);
  assert.deepEqual(
    manifest.questionUsages
      .filter((usage) => usage.localPath === "content/assets/questions/source-bandinopla-testdeconducir-b/b2.jpg")
      .map((usage) => usage.questionId),
    ["b-fallback-256", "b-fallback-303"]
  );
});

test("shared image metadata must stay in the lowest-numbered usage shard", () => {
  const rootPath = mkdtempSync(join(tmpdir(), "cabadrive-shard-ownership-"));
  const directory = join(rootPath, "content/image-metadata/question-images");
  mkdirSync(directory, { recursive: true });
  const sharedImage = {
    imageId: "question-image-b2",
    localPath: "content/assets/questions/source-bandinopla-testdeconducir-b/b2.jpg",
    sha256: "2".repeat(64)
  };
  const usage256 = {
    questionId: "b-fallback-256",
    imageId: sharedImage.imageId,
    localPath: sharedImage.localPath,
    imageSha256: sharedImage.sha256
  };
  const usage303 = {
    questionId: "b-fallback-303",
    imageId: sharedImage.imageId,
    localPath: sharedImage.localPath,
    imageSha256: sharedImage.sha256
  };

  for (const range of CONTENT_SHARD_RANGES) {
    const shard = {
      version: 1,
      contentKind: "question-image-metadata",
      sourceQuestionPath: "content/questions/caba-b.unofficial-fallback.questions.json",
      range,
      qualityStatus: "complete",
      images: range.id === "277-368" ? [sharedImage] : [],
      questionUsages: [
        ...(range.id === "185-276" ? [usage256] : []),
        ...(range.id === "277-368" ? [usage303] : [])
      ]
    };
    writeFileSync(join(directory, `${range.id}.json`), `${JSON.stringify(shard, null, 2)}\n`);
  }

  const { errors } = loadQuestionImageMetadataFromShards(rootPath);
  assert(
    errors.includes(
      "content/image-metadata/question-images/277-368.json: question-image-b2: image metadata belongs in shard 185-276 because b-fallback-256 is the lowest-numbered usage, not 277-368."
    )
  );
});
