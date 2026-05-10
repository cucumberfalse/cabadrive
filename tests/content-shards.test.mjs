import assert from "node:assert/strict";
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
