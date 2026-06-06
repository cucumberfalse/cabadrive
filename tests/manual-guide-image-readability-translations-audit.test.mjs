import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);
const scriptPath = "scripts/manual-guide-image-readability-translations-audit.mjs";

async function runAudit(evidencePath, args = [], env = {}) {
  return execFileAsync("node", [scriptPath, ...args], {
    env: {
      ...process.env,
      ...env,
      MANUAL_GUIDE_IMAGE_READABILITY_TRANSLATIONS_EVIDENCE_PATH: evidencePath
    },
    maxBuffer: 1024 * 1024 * 16
  });
}

async function assertAuditFails(evidencePath, expectedMessage, args = [], env = {}) {
  await assert.rejects(
    () => runAudit(evidencePath, args, env),
    (error) => {
      assert.equal(error.code, 1);
      assert.match(error.stderr, expectedMessage);
      return true;
    }
  );
}

test("manual guide image readability/translations audit requires explicit write mode for evidence updates", async () => {
  const tempRoot = mkdtempSync(join(tmpdir(), "cabadrive-manual-image-readability-audit-"));
  const evidencePath = join(tempRoot, "manual-guide-image-readability-translations.evidence.json");

  try {
    await assertAuditFails(evidencePath, /committed evidence file is missing/u);
    assert.equal(existsSync(evidencePath), false, "check mode does not create missing evidence");

    const writeResult = await runAudit(evidencePath, ["--write"]);
    assert.match(writeResult.stdout, /manual guide image readability\/translations audit wrote/u);
    const writtenEvidence = readFileSync(evidencePath, "utf8");

    const checkResult = await runAudit(evidencePath);
    assert.match(checkResult.stdout, /manual guide image readability\/translations audit checked/u);
    assert.equal(readFileSync(evidencePath, "utf8"), writtenEvidence, "check mode leaves current evidence unchanged");

    const staleEvidence = writtenEvidence.replace('"schemaVersion": 1', '"schemaVersion": 999');
    writeFileSync(evidencePath, staleEvidence);
    await assertAuditFails(evidencePath, /committed evidence is stale or different/u);
    assert.equal(readFileSync(evidencePath, "utf8"), staleEvidence, "check mode does not rewrite stale evidence");

    writeFileSync(evidencePath, "{not-json}\n");
    await assertAuditFails(evidencePath, /committed evidence file is malformed JSON/u);
    assert.equal(readFileSync(evidencePath, "utf8"), "{not-json}\n", "check mode does not rewrite malformed evidence");

    unlinkSync(evidencePath);
    await assertAuditFails(evidencePath, /committed evidence file is missing/u);
  } finally {
    rmSync(tempRoot, { force: true, recursive: true });
  }
});

test("manual guide image readability/translations evidence covers current whole-guide image counts and required examples", async () => {
  const tempRoot = mkdtempSync(join(tmpdir(), "cabadrive-manual-image-readability-counts-"));
  const evidencePath = join(tempRoot, "manual-guide-image-readability-translations.evidence.json");

  try {
    await runAudit(evidencePath, ["--write"]);
    const evidence = JSON.parse(readFileSync(evidencePath, "utf8"));

    assert.equal(evidence.counts.implementedSections, 50);
    assert.equal(evidence.counts.imageReferences, 84);
    assert.equal(evidence.counts.visibleSpanishImages, 54);
    assert.equal(evidence.counts.visibleSpanishImagesWithStructuredRussianSupport, 54);
    assert.equal(evidence.counts.validationFindings, 0);
    assert.equal(evidence.requiredExampleCoverage.every((entry) => entry.status === "pass"), true);
    assert.equal(evidence.blockKindCounts["source-image-cards"], 46);
    assert.equal(evidence.blockKindCounts["impact-diagram.body"], 1);
  } finally {
    rmSync(tempRoot, { force: true, recursive: true });
  }
});

test("manual guide image readability/translations audit rejects visible Spanish cards covered only by bodyRu", async () => {
  const tempRoot = mkdtempSync(join(tmpdir(), "cabadrive-manual-image-readability-fixture-"));
  const sectionRoot = join(tempRoot, "manual-sections");
  const evidencePath = join(tempRoot, "manual-guide-image-readability-translations.evidence.json");
  mkdirSync(sectionRoot);

  try {
    const fixtureAssetPath =
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch2-required-documents/dni-source-as-is.jpg";
    writeFileSync(
      join(sectionRoot, "fixture.ts"),
      `export const fixtureSection = {
  sectionId: "fixture-visible-spanish",
  titleRu: "Fixture",
  sourcePages: [1],
  visualEvidence: { sourceScreenshots: [], russianScreenshots: [] },
  blocks: [{
    id: "fixture-source-images",
    kind: "source-image-cards",
    titleRu: "Fixture images",
    sourceTextEs: "Documento Nacional de Identidad.",
    cards: [{
      id: "fixture-body-only-card",
      titleRu: "Body only",
      displayMode: "compact",
      sourcePage: 1,
      sourceRegion: { x: 0, y: 0, width: 320, height: 118 },
      assetPath: ${JSON.stringify(fixtureAssetPath)},
      altRu: "Fixture image",
      visibleSpanish: true,
      sourceImageException: {
        kind: "source-document-example-original-visible-text",
        visibleSpanishScope: "source-document-example-image-only",
        sourceAsIs: true,
        russianExplanationOutsideImage: true
      },
      bodyRu: "Общий пересказ без структурного перевода подписи."
    }],
    visualNotes: []
  }]
};\n`
    );

    await assertAuditFails(
      evidencePath,
      /visible-spanish-missing-structured-russian-support: fixture-body-only-card/u,
      ["--write"],
      { MANUAL_GUIDE_IMAGE_READABILITY_SECTION_ROOT: sectionRoot }
    );

    const failedEvidence = JSON.parse(readFileSync(evidencePath, "utf8"));
    assert.equal(failedEvidence.counts.visibleSpanishImages, 1);
    assert.equal(failedEvidence.counts.visibleSpanishImagesWithStructuredRussianSupport, 0);
    assert.equal(
      failedEvidence.inventory.find((record) => record.imageId === "fixture-body-only-card").structuredRussianSupport.itemCount,
      0
    );
  } finally {
    rmSync(tempRoot, { force: true, recursive: true });
  }
});
