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
    assert.equal(evidence.counts.acceptedCoverageExceptions, 16);
    assert.equal(evidence.counts.validationFindings, 0);
    assert.equal(evidence.requiredExampleCoverage.every((entry) => entry.status === "pass"), true);
    assert.equal(evidence.readabilityEvidenceGroups.every((entry) => entry.status === "pass"), true);
    assert.equal(evidence.inventory.filter((record) => record.visibleSpanish && !record.textReadabilityEvidence).length, 0);
    assert.equal(
      evidence.inventory.filter((record) =>
        record.visibleSpanish &&
        record.structuredRussianSupport.items.some((item) => item.learnerRelevant !== false && !item.termEs)
      ).length,
      0
    );
    assert.equal(
      evidence.inventory.filter((record) =>
        record.visibleSpanish &&
        record.structuredRussianSupport.items.some((item) => item.learnerRelevant !== false && !item.translationRu)
      ).length,
      0
    );
    assert.equal(
      evidence.inventory.find((record) => record.imageId === "app4-warning-page-187-source-card").textReadabilityEvidence.status,
      "source-limited-with-structured-dom-support"
    );
    const app4WarningReview = evidence.inventory.find((record) => record.imageId === "app4-warning-page-187-source-card").textReadabilityEvidence.sourceLimitedException.officialSourceAlternativeReview;
    assert.equal(app4WarningReview.status, "concrete-official-source-alternatives-reviewed");
    assert.equal(app4WarningReview.officialPageAsset.exists, true);
    assert.equal(app4WarningReview.retainedFullSheetAsset.exists, true);
    assert.equal(app4WarningReview.currentTightCropAsset.exists, true);
    assert.equal(app4WarningReview.currentTightCropAsset.sourceRegionToCropDeltaPx.width <= 8, true);
    assert.equal(app4WarningReview.currentTightCropAsset.sourceRegionToCropDeltaPx.height <= 8, true);
    assert.equal(app4WarningReview.exactEvidencePaths.every((evidencePath) => existsSync(evidencePath)), true);
    assert.equal(
      evidence.inventory.find((record) => record.imageId === "traffic-rules-signs").translationDomSelector,
      ".manual-source-image-term-translations"
    );
    assert.equal(evidence.blockKindCounts["source-image-cards"], 46);
    assert.equal(evidence.blockKindCounts["impact-diagram.body"], 1);
  } finally {
    rmSync(tempRoot, { force: true, recursive: true });
  }
});

test("manual guide image readability/translations audit rejects App IV source-limited exceptions without concrete crop proof", async () => {
  const tempRoot = mkdtempSync(join(tmpdir(), "cabadrive-manual-image-readability-app4-proof-"));
  const sectionRoot = join(tempRoot, "manual-sections");
  const evidencePath = join(tempRoot, "manual-guide-image-readability-translations.evidence.json");
  mkdirSync(sectionRoot);

  try {
    const fixtureAssetPath =
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/app4-signs-warning/sign-sheet-187-source-crop-as-is.jpg";
    writeFileSync(
      join(sectionRoot, "fixture.ts"),
      `export const fixtureSection = {
  sectionId: "app4-signs-warning",
  titleRu: "Fixture App IV",
  sourcePages: [187],
  visualEvidence: {
    sourceScreenshots: ["content/validation/manual-guide/app4-signs-warning/page-187-warning-source-crop.jpg"],
    russianScreenshots: ["content/validation/manual-guide/app4-signs-warning/app4-signs-warning-desktop.png"]
  },
  blocks: [{
    id: "warning-source-sheets",
    kind: "source-image-cards",
    titleRu: "Fixture images",
    sourceTextEs: "Preventivas.",
    cards: [{
      id: "app4-warning-page-187-source-card",
      titleRu: "Bad crop proof",
      displayMode: "full-width",
      maxDisplayWidthPx: 672,
      minDisplayWidthPx: 672,
      sourcePage: 187,
      sourceRegion: { x: 0, y: 0, width: 1, height: 1 },
      assetPath: ${JSON.stringify(fixtureAssetPath)},
      altRu: "Fixture image",
      visibleSpanish: true,
      officialSignException: {
        kind: "official-traffic-sign-source-as-is",
        visibleSpanishScope: "official-sign-image-only",
        sourceAsIs: true
      },
      termTranslations: [
        { termEs: "Preventivas", translationRu: "Предупреждающие" }
      ]
    }],
    visualNotes: []
  }]
};\n`
    );

    await assertAuditFails(
      evidencePath,
      /source-limited-tight-crop-delta-too-large: app4-warning-page-187-source-card/u,
      ["--write"],
      { MANUAL_GUIDE_IMAGE_READABILITY_SECTION_ROOT: sectionRoot }
    );
  } finally {
    rmSync(tempRoot, { force: true, recursive: true });
  }
});

test("manual guide image readability/translations audit rejects empty Russian glossary definitions", async () => {
  const tempRoot = mkdtempSync(join(tmpdir(), "cabadrive-manual-image-readability-russian-translation-"));
  const sectionRoot = join(tempRoot, "manual-sections");
  const evidencePath = join(tempRoot, "manual-guide-image-readability-translations.evidence.json");
  mkdirSync(sectionRoot);

  try {
    const fixtureAssetPath =
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch2-required-documents/dni-source-as-is.jpg";
    writeFileSync(
      join(sectionRoot, "fixture.ts"),
      `export const fixtureSection = {
  sectionId: "fixture-empty-russian-translation",
  titleRu: "Fixture",
  sourcePages: [1],
  visualEvidence: { sourceScreenshots: [], russianScreenshots: [] },
  blocks: [{
    id: "fixture-source-images",
    kind: "source-image-cards",
    titleRu: "Fixture images",
    sourceTextEs: "Documento Nacional de Identidad.",
    cards: [{
      id: "fixture-empty-russian-card",
      titleRu: "Empty Russian translation",
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
      termTranslations: [
        { termEs: "Documento Nacional de Identidad", translationRu: "" }
      ]
    }],
    visualNotes: []
  }]
};\n`
    );

    await assertAuditFails(
      evidencePath,
      /structured-russian-support-missing-russian-translation: fixture-empty-russian-card/u,
      ["--write"],
      { MANUAL_GUIDE_IMAGE_READABILITY_SECTION_ROOT: sectionRoot }
    );

    const failedEvidence = JSON.parse(readFileSync(evidencePath, "utf8"));
    const record = failedEvidence.inventory.find((entry) => entry.imageId === "fixture-empty-russian-card");
    assert.equal(record.translationDomSelector, ".manual-source-image-term-translations");
    assert.equal(record.structuredRussianSupport.itemCount, 1);
    assert.equal(record.structuredRussianSupport.items[0].termEs, "Documento Nacional de Identidad");
    assert.equal(record.structuredRussianSupport.items[0].translationRu, "");
  } finally {
    rmSync(tempRoot, { force: true, recursive: true });
  }
});

test("manual guide image readability/translations audit rejects minDisplayWidth-only readability evidence", async () => {
  const tempRoot = mkdtempSync(join(tmpdir(), "cabadrive-manual-image-readability-min-width-"));
  const sectionRoot = join(tempRoot, "manual-sections");
  const evidencePath = join(tempRoot, "manual-guide-image-readability-translations.evidence.json");
  mkdirSync(sectionRoot);

  try {
    const fixtureAssetPath =
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch2-required-documents/dni-source-as-is.jpg";
    writeFileSync(
      join(sectionRoot, "fixture.ts"),
      `export const fixtureSection = {
  sectionId: "fixture-min-width-only",
  titleRu: "Fixture",
  sourcePages: [1],
  visualEvidence: { sourceScreenshots: [], russianScreenshots: [] },
  blocks: [{
    id: "fixture-source-images",
    kind: "source-image-cards",
    titleRu: "Fixture images",
    sourceTextEs: "Documento Nacional de Identidad.",
    cards: [{
      id: "fixture-min-width-card",
      titleRu: "Min width only",
      displayMode: "full-width",
      maxDisplayWidthPx: 440,
      minDisplayWidthPx: 440,
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
      termTranslations: [
        { termEs: "Documento Nacional de Identidad", translationRu: "Национальный документ личности" }
      ]
    }],
    visualNotes: []
  }]
};\n`
    );

    await assertAuditFails(
      evidencePath,
      /visible-spanish-missing-text-readability-evidence: fixture-min-width-card/u,
      ["--write"],
      { MANUAL_GUIDE_IMAGE_READABILITY_SECTION_ROOT: sectionRoot }
    );

    const failedEvidence = JSON.parse(readFileSync(evidencePath, "utf8"));
    const record = failedEvidence.inventory.find((entry) => entry.imageId === "fixture-min-width-card");
    assert.equal(record.display.minDisplayWidthPx, 440);
    assert.equal(record.structuredRussianSupport.itemCount, 1);
    assert.equal(record.textReadabilityEvidence, null);
  } finally {
    rmSync(tempRoot, { force: true, recursive: true });
  }
});

test("manual guide image readability/translations audit rejects visible Spanish non-source-card prose without Spanish source terms", async () => {
  const tempRoot = mkdtempSync(join(tmpdir(), "cabadrive-manual-image-readability-infrastructure-terms-"));
  const sectionRoot = join(tempRoot, "manual-sections");
  const evidencePath = join(tempRoot, "manual-guide-image-readability-translations.evidence.json");
  mkdirSync(sectionRoot);

  try {
    const fixtureAssetPath =
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-pedestrian-priority/priority-street-source.jpg";
    writeFileSync(
      join(sectionRoot, "fixture.ts"),
      `export const fixtureSection = {
  sectionId: "ch1-pedestrian-priority",
  titleRu: "Fixture pedestrian",
  sourcePages: [26],
  visualEvidence: {
    sourceScreenshots: ["content/validation/manual-guide/ch1-pedestrian-priority/page-026-infrastructure-source-crop.jpg"],
    russianScreenshots: ["content/validation/manual-guide/ch1-pedestrian-priority/ch1-pedestrian-priority-desktop.png"]
  },
  blocks: [{
    id: "pedestrian-street-types",
    kind: "pedestrian-infrastructure",
    titleRu: "Fixture infrastructure",
    sourceTextEs: "Calle prioridad peatón.",
    cards: [{
      id: "priority-street",
      titleRu: "Priority street",
      sourcePage: 26,
      sourceRegion: { x: 423, y: 815, width: 170, height: 150 },
      assetPath: ${JSON.stringify(fixtureAssetPath)},
      altRu: "Fixture image",
      visibleSpanish: true,
      sourceImageException: {
        kind: "source-image-original-visible-text",
        visibleSpanishScope: "source-image-only",
        sourceAsIs: true,
        russianExplanationOutsideImage: true
      },
      details: [
        { labelRu: "Характеристики", textRu: "Общий русский текст без испанского источника." }
      ]
    }],
    visualNotes: []
  }]
};\n`
    );

    await assertAuditFails(
      evidencePath,
      /structured-russian-support-missing-source-spanish: priority-street/u,
      ["--write"],
      { MANUAL_GUIDE_IMAGE_READABILITY_SECTION_ROOT: sectionRoot }
    );
  } finally {
    rmSync(tempRoot, { force: true, recursive: true });
  }
});

test("manual guide image readability/translations audit rejects bicycle sign support without Spanish source terms", async () => {
  const tempRoot = mkdtempSync(join(tmpdir(), "cabadrive-manual-image-readability-bicycle-terms-"));
  const sectionRoot = join(tempRoot, "manual-sections");
  const evidencePath = join(tempRoot, "manual-guide-image-readability-translations.evidence.json");
  mkdirSync(sectionRoot);

  try {
    const fixtureAssetPath =
      "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-bicycle/bicycle-signs-source-as-is.jpg";
    writeFileSync(
      join(sectionRoot, "fixture.ts"),
      `export const fixtureSection = {
  sectionId: "ch1-bicycle",
  titleRu: "Fixture bicycle",
  sourcePages: [32],
  visualEvidence: {
    sourceScreenshots: ["content/validation/manual-guide/ch1-bicycle/page-032-rules-signs-source-crop.jpg"],
    russianScreenshots: ["content/validation/manual-guide/ch1-bicycle/ch1-bicycle-desktop.png"]
  },
  blocks: [{
    id: "traffic-rules-signs",
    kind: "bicycle-signage",
    titleRu: "Fixture sign sheet",
    sourceTextEs: "Señales de tránsito.",
    sourcePage: 32,
    sourceRegion: { x: 330, y: 545, width: 550, height: 220 },
    assetPath: ${JSON.stringify(fixtureAssetPath)},
    altRu: "Fixture sign sheet",
    visibleSpanish: true,
    officialSignException: {
      kind: "official-traffic-sign-source-as-is",
      visibleSpanishScope: "official-sign-image-only",
      sourceAsIs: true
    },
    termTranslations: [
      { termEs: "", translationRu: "Общий текст без испанской подписи" }
    ],
    noticeItemsRu: ["Generic grouped prose is not enough for this user-named image."],
    visualNotes: []
  }]
};\n`
    );

    await assertAuditFails(
      evidencePath,
      /structured-russian-support-missing-source-spanish: traffic-rules-signs/u,
      ["--write"],
      { MANUAL_GUIDE_IMAGE_READABILITY_SECTION_ROOT: sectionRoot }
    );

    const failedEvidence = JSON.parse(readFileSync(evidencePath, "utf8"));
    const record = failedEvidence.inventory.find((entry) => entry.imageId === "traffic-rules-signs");
    assert.equal(record.translationDomSelector, ".manual-source-image-term-translations");
    assert.equal(record.structuredRussianSupport.itemCount, 1);
    assert.equal(record.structuredRussianSupport.items[0].termEs, "");
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
