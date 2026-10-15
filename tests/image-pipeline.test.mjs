import assert from "node:assert/strict";
import { test } from "node:test";
import { safePath, variantWidths } from "../scripts/image-pipeline.mjs";

test("image paths refuse traversal, remote URLs and ambiguous separators", () => {
  for (const path of [
    "../outside.png",
    "content//a.png",
    "https://x/a.png",
    "content/a.png?x",
    "content/./a.png",
    "content\\a.png",
  ]) {
    assert.throws(() => safePath(path));
  }
  assert.equal(safePath("content/assets/a.png"), "content/assets/a.png");
});
test("configured widths never enlarge and small images retain natural width", () => {
  assert.deepEqual(variantWidths(300), [300]);
  assert.deepEqual(variantWidths(2400), [480, 800, 1200, 1600, 2400]);
  assert.deepEqual(variantWidths(1240, 1240), [480, 800, 1200, 1240]);
  assert.deepEqual(variantWidths(1600, 1200), [480, 800, 1200, 1600]);
  assert.deepEqual(variantWidths(300, 250), [250]);
  assert.throws(() => variantWidths(1200, 1240), /target/);
  assert.throws(() => variantWidths(1240, 0), /target/);
});

import { mkdtemp, rm, readFile, writeFile, symlink, mkdir, copyFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";
import { nativeTools, comparePng, parseMetric, repositoryRoot } from "../scripts/image-qa.mjs";
import {
  decodeMaster,
  loadSources,
  measureLikeSizedQuality,
  qualityPass,
  encodeWithRetry,
  metricSample,
  sha256,
  diskPath,
  jsonBytes,
  immutableWrite,
} from "../scripts/image-pipeline.mjs";
import { runPipeline, parseArguments } from "../scripts/image-pipeline-cli.mjs";
import { fixturePng, createRasterFixture } from "./image-pipeline-fixtures.mjs";
import {
  svgInvariants,
  svgSample,
  auditSvg,
  verifySvgEvidence,
  svgEvidencePath,
} from "../scripts/image-svg-audit.mjs";

async function fixture(operation) {
  const root = await mkdtemp(join(tmpdir(), "cabadrive-image-test-"));
  try {
    return await operation(root);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}
const tools = await nativeTools(); // Required real integration, never silently skipped.

test("PNG guard rejects JPEG extension/bytes, header-only/truncated and animated PNG", async () => {
  const png = await fixturePng("photo", 300, 160);
  const jpeg = await sharp(png).jpeg().toBuffer();
  for (const [bytes, path] of [
    [jpeg, "x.png"],
    [png, "x.JPG"],
    [png.subarray(0, 40), "x.png"],
    [png.subarray(0, png.length - 12), "x.png"],
  ])
    await assert.rejects(decodeMaster(bytes, path));
  const corruptPixels = Buffer.from(png);
  let cursor = 8;
  while (corruptPixels.toString("ascii", cursor + 4, cursor + 8) !== "IDAT")
    cursor += corruptPixels.readUInt32BE(cursor) + 12;
  corruptPixels[cursor + 8] = 0xff;
  await sharp(corruptPixels).metadata(); // Header inspection alone still succeeds.
  await assert.rejects(decodeMaster(corruptPixels, "pixels.png"));
  const animationChunk = Buffer.alloc(20);
  animationChunk.writeUInt32BE(8);
  animationChunk.write("acTL", 4);
  await assert.rejects(
    decodeMaster(Buffer.concat([png.subarray(0, 33), animationChunk, png.subarray(33)]), "x.png"),
    /Animated|real lossless PNG/,
  );
  assert.equal((await decodeMaster(png, "x.PNG")).width, 300);
});
test("registry enforces exact master inventory, target, duplicates and symlink safety", async () =>
  fixture(async (root) => {
    const sources = await createRasterFixture(root, ["photo"], 300);
    await writeFile(join(root, "content/assets-masters/extra.jpg"), "not PNG");
    await assert.rejects(loadSources(root), /inventory/);
    await rm(join(root, "content/assets-masters/extra.jpg"));
    await writeFile(
      join(root, "content/image-pipeline.sources.json"),
      jsonBytes({ schemaVersion: 1, sources: [sources[0], sources[0]] }),
    );
    await assert.rejects(loadSources(root), /Duplicate/);
    await writeFile(
      join(root, "content/image-pipeline.sources.json"),
      jsonBytes({ schemaVersion: 1, sources: [{ ...sources[0], targetWidth: 480 }] }),
    );
    await assert.rejects(loadSources(root), /target/);
    await writeFile(
      join(root, "content/image-pipeline.sources.json"),
      jsonBytes({ schemaVersion: 1, sources }),
    );
    await rm(join(root, sources[0].masterPath));
    await symlink(join(root, sources[0].sourcePath), join(root, sources[0].masterPath));
    await assert.rejects(loadSources(root), /symlink/);
  }));
test("real native metrics reject degraded and mismatched candidates without resizing", async () => {
  const png = await fixturePng("text", 800, 640);
  const master = await decodeMaster(png, "master.png");
  const equal = await comparePng(png, png, tools, true);
  assert.equal(equal.dssim, 0);
  assert.equal(equal.ssimulacra2, 100);
  const good = await sharp(png).jpeg({ quality: 95, chromaSubsampling: "4:4:4" }).toBuffer();
  const measured = await measureLikeSizedQuality(master, good, "jpeg", 800, 640, tools, true);
  assert.ok(qualityPass(measured, true));
  assert.equal(measured.referenceWidth, 800);
  const bad = await sharp({ create: { width: 800, height: 640, channels: 3, background: "black" } })
    .jpeg()
    .toBuffer();
  assert.ok(
    !qualityPass(await measureLikeSizedQuality(master, bad, "jpeg", 800, 640, tools, true), true),
  );
  await assert.rejects(measureLikeSizedQuality(master, good, "jpeg", 480, 384, tools), /dimension/);
  await assert.rejects(measureLikeSizedQuality(master, good, "jpeg", 1200, 960, tools), /exceed/);
  await assert.rejects(comparePng(png, await fixturePng("photo", 300, 160), tools), /dimensions/);
});
test("metric parsers, explicit missing/wrong native tools and bounded retry fail closed", async () => {
  for (const output of ["NaN", "Infinity", "-1", "garbage", ""])
    assert.throws(() => parseMetric(output, "dssim"));
  await assert.rejects(nativeTools({ dssim: "/missing/image-tool" }), /ENOENT/);
  await fixture(async (root) => {
    await mkdir(join(root, "bin"));
    const fake = join(root, "bin/dssim");
    const ssimulacra2 = join(root, "bin/ssimulacra2_rs");
    await copyFile(tools.ssimulacra2, ssimulacra2);
    const receipt = JSON.parse(
      await readFile(join(repositoryRoot, ".cache/image-qa/install-receipt.json"), "utf8"),
    );
    async function bindFake() {
      receipt.binaries.dssim = sha256(await readFile(fake));
      await writeFile(join(root, "install-receipt.json"), JSON.stringify(receipt));
    }
    await writeFile(fake, "#!/bin/sh\necho 'Version 9.9.9'\n", { mode: 0o700 });
    await bindFake();
    await assert.rejects(nativeTools({ dssim: fake, ssimulacra2 }), /Wrong/);
    await writeFile(
      fake,
      "#!/bin/sh\nif [ \"$1\" = '-h' ]; then echo 'Version 3.4.0'; else echo NaN; fi\n",
      { mode: 0o700 },
    );
    await bindFake();
    await assert.rejects(nativeTools({ dssim: fake, ssimulacra2 }), /Invalid/);
  });
  const attempts = [];
  const result = await encodeWithRetry(
    async (quality) => {
      attempts.push(quality);
      return Buffer.from([quality]);
    },
    async (bytes) => ({ dssim: bytes[0] === 82 ? 0.02 : 0.001 }),
    82,
    false,
  );
  assert.deepEqual(attempts, [82, 87]);
  assert.equal(result.attempt, 2);
  await assert.rejects(
    encodeWithRetry(
      async () => Buffer.from("x"),
      async () => ({ dssim: 0.5 }),
      98,
      false,
    ),
    /one quality/,
  );
});
test("unverified native tools never execute even for help/version", async () =>
  fixture(async (root) => {
    await mkdir(join(root, "bin"));
    const binary = join(root, "bin/ssimulacra2_rs");
    await copyFile(tools.ssimulacra2, binary);
    const sentinel = join(root, "invoked");
    await writeFile(binary, `#!/bin/sh\ntouch '${sentinel}'\necho 'ssimulacra2_rs 0.5.2'\n`, {
      mode: 0o700,
    });
    const receipt = await readFile(join(repositoryRoot, ".cache/image-qa/install-receipt.json"));
    await writeFile(join(root, "install-receipt.json"), receipt);
    await assert.rejects(nativeTools({ ssimulacra2: binary }), /differs/);
    await assert.rejects(readFile(sentinel), /ENOENT/);
    await writeFile(join(root, "install-receipt.json"), "{}\n");
    await assert.rejects(nativeTools({ ssimulacra2: binary }), /Stale native/);
    await assert.rejects(readFile(sentinel), /ENOENT/);
    await rm(join(root, "install-receipt.json"));
    await assert.rejects(nativeTools({ ssimulacra2: binary }));
    await assert.rejects(readFile(sentinel), /ENOENT/);
  }));
test("hash-ranked SSIMULACRA2 sample is deterministic with 5% ceiling and minimum one", () => {
  const rows = Array.from({ length: 31 }, (_, index) => ({
    sourcePath: `content/assets/${index}.jpg`,
    width: 480,
    format: "jpeg",
  }));
  assert.deepEqual(metricSample(rows), metricSample([...rows].reverse()));
  assert.equal(metricSample(rows).size, 2);
  assert.equal(metricSample(rows.slice(0, 1)).size, 1);
  assert.equal(metricSample([]).size, 0);
});
test(
  "real photo/text generation exercises all codecs/widths, repeatability and independent integrity negatives",
  { timeout: 180000 },
  async () =>
    fixture(async (root) => {
      await createRasterFixture(root);
      const options = { root, rasterOnly: true };
      const first = await runPipeline("build", options);
      assert.equal(first.manifest.sources.length, 2);
      for (const source of first.manifest.sources) {
        assert.equal(source.variants.length, 15);
        for (const variant of source.variants) {
          assert.equal(variant.qa.referenceWidth, variant.width);
          assert.ok(qualityPass(variant.qa, variant.qa.ssimulacra2 !== undefined));
        }
      }
      const manifestPath = join(root, "content/image-derivatives.manifest.json");
      const original = await readFile(manifestPath);
      const second = await runPipeline("build", options);
      assert.equal(second.manifest.sources.length, 2);
      assert.deepEqual(await readFile(manifestPath), original);
      await runPipeline("validate", options);
      const originalManifest = JSON.parse(original);
      for (const modify of [
        (m) => {
          m.policy.pipelineVersion++;
        },
        (m) => {
          m.sources[0].variants.pop();
        },
        (m) => {
          m.sources[0].variants.push(m.sources[0].variants[0]);
        },
        (m) => {
          m.sources[0].generationSha256 = "0".repeat(64);
        },
        (m) => {
          m.sources[0].variants[0].qa.dssim = Infinity;
        },
      ]) {
        const changed = structuredClone(originalManifest);
        modify(changed);
        await writeFile(manifestPath, jsonBytes(changed));
        await assert.rejects(runPipeline("validate", { ...options, write: true }));
      }
      await writeFile(manifestPath, original);
      const variant = originalManifest.sources[0].variants[0];
      const path = join(root, diskPath(variant.path));
      const bytes = await readFile(path);
      await writeFile(path, "tamper");
      await assert.rejects(runPipeline("validate", { ...options, write: true }), /tampering/);
      assert.deepEqual(await readFile(manifestPath), original);
      await assert.rejects(runPipeline("build", options), /collision/);
      await writeFile(path, bytes);
      await rm(path);
      await assert.rejects(runPipeline("validate", options));
      await runPipeline("build", options);
      assert.deepEqual(await readFile(manifestPath), original);
      const forged = structuredClone(originalManifest);
      const row = forged.sources[0].variants.find((v) => v.format === "jpeg" && v.width === 800);
      const degraded = await sharp({
        create: { width: row.width, height: row.height, channels: 3, background: "black" },
      })
        .jpeg()
        .toBuffer();
      row.sha256 = sha256(degraded);
      row.bytes = degraded.length;
      row.path = row.path.replace(/\.[a-f0-9]{8}\.jpg$/, `.${row.sha256.slice(0, 8)}.jpg`);
      row.qa.dssim = 0;
      await writeFile(join(root, diskPath(row.path)), degraded);
      await writeFile(manifestPath, jsonBytes(forged));
      await assert.rejects(runPipeline("validate", { ...options, write: true }), /real quality/);
      await writeFile(manifestPath, original);
      const masterPath = join(root, originalManifest.sources[0].masterPath);
      const masterBytes = await readFile(masterPath);
      await writeFile(
        masterPath,
        await sharp(masterBytes).modulate({ brightness: 0.98 }).png().toBuffer(),
      );
      await assert.rejects(runPipeline("validate", options), /Stale/);
      const changed = await runPipeline("build", options);
      assert.notEqual(
        changed.manifest.sources[0].generationSha256,
        originalManifest.sources[0].generationSha256,
      );
    }),
);
test("small-source natural-width variants and immutable collision/symlink targets", async () =>
  fixture(async (root) => {
    await createRasterFixture(root, ["photo"], 300);
    const result = await runPipeline("build", { root, rasterOnly: true });
    assert.deepEqual(
      result.manifest.sources[0].variants.map((row) => row.width),
      [300, 300, 300],
    );
    await immutableWrite(root, "content/assets-derived/img/a/sentinel", Buffer.from("a"));
    await assert.rejects(
      immutableWrite(root, "content/assets-derived/img/a/sentinel", Buffer.from("b")),
      /collision/,
    );
    await symlink(
      join(root, "content/assets/photo.jpg"),
      join(root, "content/assets-derived/img/a/link"),
    );
    await assert.rejects(
      immutableWrite(root, "content/assets-derived/img/a/link", Buffer.from("x")),
      /symlink/,
    );
    assert.throws(() => parseArguments(["--unknown"], "build"));
    assert.throws(() => parseArguments(["--raster-only"], "build"));
  }));
test(
  "full real learning SVG audit preserves source corpus, dimensions and 30 sampled renders",
  { timeout: 120000 },
  async () => {
    const stored = JSON.parse(await readFile(join(repositoryRoot, svgEvidencePath), "utf8"));
    const audit = await auditSvg(repositoryRoot, tools);
    verifySvgEvidence(stored, audit.evidence);
    const forged = structuredClone(stored);
    forged.records[0].optimizedSha256 = "0".repeat(64);
    assert.throws(() => verifySvgEvidence(forged, audit.evidence), /mismatch/);
    assert.equal(audit.evidence.classD.count, 1382);
    assert.equal(audit.evidence.sample.length, 30);
    assert.equal(audit.evidence.classE.status, "absent");
    assert.equal(audit.evidence.protectedManual.count, 4);
    assert.deepEqual(
      svgSample(audit.evidence.records.map((row) => row.path)),
      audit.evidence.sample.map((row) => row.path),
    );
    assert.throws(
      () =>
        svgInvariants(
          '<svg width="1" height="1" viewBox="0 0 1 1"><image href="https://remote/a.png"/></svg>',
        ),
      /External/,
    );
    assert.throws(() => svgInvariants('<svg viewBox="0 0 1 1"/>'), /dimensions/);
  },
);

import { syncPublicAssets } from "../scripts/sync-public-assets.mjs";
test("asset sync preserves persistent derivatives while excluding masters/SVG/cache", async () =>
  fixture(async (root) => {
    await createRasterFixture(root, ["photo"], 300);
    const result = await runPipeline("build", { root, rasterOnly: true });
    await mkdir(join(root, "content/assets-derived/svg"), { recursive: true });
    await writeFile(join(root, "content/assets-derived/svg/a.svg"), "audit only");
    syncPublicAssets(root);
    for (const row of result.manifest.sources[0].variants)
      assert.deepEqual(
        await readFile(join(root, "public", row.path)),
        await readFile(join(root, diskPath(row.path))),
      );
    syncPublicAssets(root);
    for (const excluded of [
      "public/content/assets-masters/photo.png",
      "public/content/assets-derived/svg/a.svg",
      "public/.cache/image-qa",
    ])
      await assert.rejects(readFile(join(root, excluded)));
  }));

test("asset sync refuses delivery parent symlinks", async () =>
  fixture(async (root) => {
    await createRasterFixture(root, ["photo"], 300);
    await mkdir(join(root, "public"));
    await symlink(join(root, "content"), join(root, "public/content"));
    assert.throws(() => syncPublicAssets(root), /symlink/);
  }));
