import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import ts from "typescript";
const javascript = ts.transpileModule(readFileSync("src/data/imageAssets.ts", "utf8"), {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const { assetSrcSetFromManifest } = await import(
  `data:text/javascript;base64,${Buffer.from(javascript).toString("base64")}`
);
const sourcePath = "content/assets/original.jpg";
const fixture = () => ({
  schemaVersion: 1,
  sources: [
    {
      sourcePath,
      variants: [800, 480].flatMap((width) =>
        ["jpeg", "webp", "avif"].map((format) => ({
          width,
          height: width / 2,
          format,
          path: `content/img/a/fixture-${width}.012345ab.${format === "jpeg" ? "jpg" : format}`,
        })),
      ),
    },
  ],
});
test("responsive helper returns independent sorted local format sets and largest JPEG fallback", () => {
  const result = assetSrcSetFromManifest(fixture(), sourcePath);
  assert.equal(result.width, 800);
  assert.equal(result.height, 400);
  assert.equal(result.fallbackSrc, "/content/img/a/fixture-800.012345ab.jpg");
  assert.equal(result.srcSet, result.jpegSrcSet);
  assert.match(result.avifSrcSet, /480w, .*800w$/);
  assert.ok(!result.webpSrcSet.includes("avif"));
});
test("malformed, missing, unsafe, duplicate and unbalanced manifest records fail closed", () => {
  for (const transform of [
    (m) => {
      m.schemaVersion = 2;
    },
    (m) => {
      m.sources.push(m.sources[0]);
    },
    (m) => {
      m.sources[0].variants.pop();
    },
    (m) => {
      m.sources[0].variants.push(m.sources[0].variants[0]);
    },
    (m) => {
      m.sources[0].variants[0].path = "https://remote/asset.jpg";
    },
    (m) => {
      m.sources[0].variants[0].path = "content/img/a/../escape.jpg";
    },
    (m) => {
      m.sources[0].variants[0].height = 0;
    },
    (m) => {
      m.sources[0].variants[0].width = 1.5;
    },
    (m) => {
      m.sources[0].variants[0].format = "gif";
    },
    (m) => {
      m.sources[0].variants[0].height++;
    },
  ]) {
    const manifest = fixture();
    transform(manifest);
    assert.equal(assetSrcSetFromManifest(manifest, sourcePath), null);
  }
  for (const value of [null, {}, { schemaVersion: 1, sources: [] }])
    assert.equal(assetSrcSetFromManifest(value, sourcePath), null);
  assert.equal(assetSrcSetFromManifest(fixture(), "../escape"), null);
});
