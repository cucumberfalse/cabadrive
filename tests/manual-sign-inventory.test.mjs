import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const inventoryPath = "src/data/manual-signs/app4SignEntries.json";
const finalRowsPath = "specs/037-manual-sign-crop-resolution/evidence/final/manual-sign-crop-resolution-rows.json";
const finalSummaryPath = "specs/037-manual-sign-crop-resolution/evidence/final/manual-sign-crop-resolution-summary.json";
const sourceManifestPath = "specs/037-manual-sign-crop-resolution/evidence/source-evaluation/source-manifest.json";
const rowSourceMappingPath = "specs/037-manual-sign-crop-resolution/evidence/source-evaluation/row-source-mapping.json";
const scriptPath = "scripts/manual-sign-inventory.mjs";
const cropResolutionScriptPath = "scripts/manual-sign-crop-resolution.mjs";
const appPath = "src/App.tsx";
const cssPath = "src/styles.css";

const expectedEntriesBySection = {
  "app4-signs-regulatory": 60,
  "app4-signs-warning": 59,
  "app4-signs-informational": 95,
  "app4-signs-temporary": 56,
  "app4-signs-horizontal": 33,
  "app4-signs-traffic-lights": 13
};

const expectedEntriesBySourcePage = {
  185: 29,
  186: 31,
  187: 29,
  188: 30,
  189: 31,
  190: 27,
  191: 36,
  192: 1,
  193: 27,
  194: 29,
  195: 17,
  196: 16,
  197: 13
};

function loadJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function sha256File(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function imageDimensions(path) {
  const bytes = readFileSync(path);
  if (bytes.length >= 24 && bytes.readUInt32BE(0) === 0x89504e47) {
    return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
  }
  throw new Error(`Unsupported image format in test: ${path}`);
}

function countBy(rows, key) {
  return rows.reduce((counts, row) => {
    const value = String(row[key]);
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
}

function signLike(entry) {
  return entry.entryKind === "catalog-entry" || entry.entryKind === "contextual-visual";
}

function entryById(entries, id) {
  const entry = entries.find((candidate) => candidate.id === id);
  assert.ok(entry, id);
  return entry;
}

test("manual sign inventory validator passes for feature 037 output", () => {
  const output = execFileSync("node", [scriptPath], { encoding: "utf8" });
  assert.match(output, /Manual sign inventory validation passed: 316 entries/u);
});

test("inventory retains all baseline rows and final 037 summary counts", () => {
  const inventory = loadJson(inventoryPath);
  assert.equal(inventory.featureId, "037-manual-sign-crop-resolution");
  assert.equal(inventory.inventoryStatus, "individual-source-crop-3x-source-limited");
  assert.equal(inventory.entries.length, 316);
  assert.deepEqual(countBy(inventory.entries, "sectionId"), expectedEntriesBySection);
  assert.deepEqual(countBy(inventory.entries, "sourcePage"), Object.fromEntries(Object.entries(expectedEntriesBySourcePage).map(([page, count]) => [String(page), count])));
  assert.deepEqual(inventory.summary.renderModeCounts, {
    "category-heading-dom": 30,
    "individual-source-crop-3x": 286
  });
  assert.equal(inventory.summary.outputPixelThreeXRows, 286);
  assert.equal(inventory.summary.sourceLimitedExceptionRows, 286);
  assert.equal(inventory.summary.trueNativeEffectiveThreeXPassRows, 0);
});

test("source-evaluation and final evidence cover every sign-like row", () => {
  const inventory = loadJson(inventoryPath);
  const finalRows = loadJson(finalRowsPath).rows;
  const finalSummary = loadJson(finalSummaryPath);
  const sourceManifest = loadJson(sourceManifestPath);
  const rowSourceMapping = loadJson(rowSourceMappingPath);
  const signLikeEntries = inventory.entries.filter(signLike);
  const finalRowsById = new Map(finalRows.map((row) => [row.id, row]));
  const mappingById = new Map(rowSourceMapping.rows.map((row) => [row.rowId, row]));

  assert.equal(sourceManifest.evaluatedSourceCount, 9);
  assert.equal(finalSummary.signLikeRows, 286);
  assert.equal(finalSummary.sourceLimitedExceptionRows, 286);
  assert.equal(finalSummary.trueNativeEffectiveThreeXPassRows, 0);
  assert.equal(signLikeEntries.length, 286);
  for (const entry of signLikeEntries) {
    assert.ok(finalRowsById.has(entry.id), entry.id);
    assert.ok(mappingById.has(entry.id), entry.id);
    assert.equal(mappingById.get(entry.id).chosenSourceId, "caba-manual-pdf", entry.id);
  }
});

test("every sign-like entry uses a committed individual 3x output PNG with matching dimensions and hash", () => {
  const inventory = loadJson(inventoryPath);
  for (const entry of inventory.entries.filter(signLike)) {
    assert.equal(entry.renderMode, "individual-source-crop-3x", entry.id);
    assert.match(entry.assetPath, /\/individual-3x\/.+\.png$/u, entry.id);
    assert.ok(existsSync(entry.assetPath), entry.id);
    const dimensions = imageDimensions(entry.assetPath);
    const hash = sha256File(entry.assetPath);
    assert.equal(entry.naturalWidth, dimensions.width, entry.id);
    assert.equal(entry.naturalHeight, dimensions.height, entry.id);
    assert.equal(entry.finalOutputNaturalWidth, dimensions.width, entry.id);
    assert.equal(entry.finalOutputNaturalHeight, dimensions.height, entry.id);
    assert.equal(entry.hash, hash, entry.id);
    assert.equal(entry.finalOutputSha256, hash, entry.id);
    assert.ok(dimensions.width >= entry.requiredMinimumWidth, entry.id);
    assert.ok(dimensions.height >= entry.requiredMinimumHeight, entry.id);
    assert.deepEqual(entry.cropRegion, { x: 0, y: 0, width: dimensions.width, height: dimensions.height }, entry.id);
    assert.deepEqual(entry.displayRegion, entry.cropRegion, entry.id);
  }
});

test("source-limited rows disclose output-pixel 3x separately from effective/native quality", () => {
  const inventory = loadJson(inventoryPath);
  for (const entry of inventory.entries.filter(signLike)) {
    assert.equal(entry.threeXStatus, "source-limited-exception", entry.id);
    assert.equal(entry.sourceLimitedDisposition, "best-official-source-3x-output-pixels", entry.id);
    assert.notEqual(entry.threeXStatus, "passed", entry.id);
    assert.ok(entry.outputPixelScaleRatioWidth >= 3, entry.id);
    assert.ok(entry.outputPixelScaleRatioHeight >= 3, entry.id);
    assert.ok(entry.qualityScaleRatioWidth < 1, entry.id);
    assert.ok(entry.qualityScaleRatioHeight < 1, entry.id);
    assert.equal(entry.cropAuditStatus, "reviewed-final-correct", entry.id);
    assert.equal(entry.cropAuditBasis?.passes, true, entry.id);
    assert.equal(entry.cropAuditBasis?.outputPixelTargetPass, true, entry.id);
    assert.equal(entry.cropAuditBasis?.sourceBoundsPass, true, entry.id);
    assert.equal(entry.cropAuditBasis?.edgeContactPass, true, entry.id);
    assert.equal(entry.cropAuditBasis?.neighborContaminationGuardPass, true, entry.id);
    if (entry.sectionId === "app4-signs-warning") {
      assert.equal(entry.cropAuditBasis?.warningRightEdgeGuardPass, true, entry.id);
      assert.equal(entry.cropAuditBasis?.warningLeftEdgeGuardPass, true, entry.id);
    }
    if (entry.sectionId === "app4-signs-regulatory" && /zona-de-caudales/u.test(entry.id)) {
      assert.equal(entry.cropAuditBasis?.regulatoryCaudalesRightEdgeGuardPass, true, entry.id);
      assert.equal(entry.cropAuditBasis?.regulatoryCaudalesSourceLabelTrimPass, true, entry.id);
    }
    const page185RegulatoryParkingRow =
      entry.sectionId === "app4-signs-regulatory" &&
      entry.sourcePage === 185 &&
      /no-estacionar|detenerse/u.test(entry.id);
    const page185RegulatoryParkingAttachmentRow = page185RegulatoryParkingRow && /acarreo|zona-de-caudales|ciclovia/u.test(entry.id);
    if (page185RegulatoryParkingRow) {
      assert.equal(entry.cropAuditBasis?.regulatoryParkingRightEdgeGuardPass, true, entry.id);
      assert.equal(entry.cropAuditBasis?.regulatoryParkingSourceLabelTrimPass, true, entry.id);
      assert.equal(entry.cropAuditBasis?.neighborContaminationGuardPass, true, entry.id);
    }
    if (page185RegulatoryParkingAttachmentRow) {
      if (entry.cropAuditBasis?.edgeContact?.right) {
        assert.ok(
          entry.cropAuditBasis.relativeSourceWidthRatio <= entry.cropAuditBasis.regulatoryParkingRightEdgeMaximumRelativeWidthRatio,
          entry.id
        );
      }
    }
    assert.equal(typeof entry.cropAuditBasis?.relativeSourceWidthRatio, "number", entry.id);
    assert.equal(typeof entry.cropAuditBasis?.relativeSourceHeightRatio, "number", entry.id);
    assert.equal(entry.noUpscaleProof?.passes, true, entry.id);
    assert.match(entry.finalOutputComposition, /aspect-fit/u, entry.id);
    assert.match(entry.protectedPixelPreservation, /without stretching/u, entry.id);
  }
});

test("review-blocked crop regressions have explicit passing audit basis and corrected bounds", () => {
  const inventory = loadJson(inventoryPath);
  const expectations = [
    {
      id: "app4regulatory-p185-029-no-cambiar-de-carril-catalog-entry",
      minSourceWidth: 50,
      minSourceHeight: 50
    },
    {
      id: "app4regulatory-p186-018-uso-de-cadenas-para-nieve-catalog-entry",
      minSourceWidth: 50,
      minSourceHeight: 50
    },
    {
      id: "app4regulatory-p186-019-giro-obligatorio-derecha",
      minSourceWidth: 50,
      minSourceHeight: 50
    },
    {
      id: "app4regulatory-p186-020-giro-obligatorio-izquierda",
      minSourceWidth: 50,
      minSourceHeight: 50
    },
    {
      id: "app4informational-p190-005-fin-de-camino-peatonal-a-100-m",
      minSourceWidth: 35,
      minSourceHeight: 50,
      maxSourceWidth: 60,
      maxSourceHeight: 70
    },
    {
      id: "app4traffic-lights-p197-010-avanzar-peatones",
      minSourceWidth: 80,
      minSourceHeight: 40,
      maxSourceHeight: 55,
      minSourceY: 2200
    }
  ];

  for (const expectation of expectations) {
    const entry = entryById(inventory.entries, expectation.id);
    const sourceRegion = entry.finalSourceRegionAtBaseScale;
    assert.equal(entry.cropAuditStatus, "reviewed-final-correct", expectation.id);
    assert.equal(entry.cropAuditBasis?.passes, true, expectation.id);
    assert.ok(sourceRegion.width >= expectation.minSourceWidth, expectation.id);
    assert.ok(sourceRegion.height >= expectation.minSourceHeight, expectation.id);
    if (expectation.maxSourceWidth) assert.ok(sourceRegion.width <= expectation.maxSourceWidth, expectation.id);
    if (expectation.maxSourceHeight) assert.ok(sourceRegion.height <= expectation.maxSourceHeight, expectation.id);
    if (expectation.minSourceY) assert.ok(sourceRegion.y >= expectation.minSourceY, expectation.id);
  }
});

test("review-blocked warning contamination regressions have isolated final crops", () => {
  const inventory = loadJson(inventoryPath);
  const expectations = [
    {
      id: "app4warning-p188-004-cruce-de-ciclistas-catalog-entry",
      maxSourceWidth: 80,
      maxSourceHeight: 80
    },
    {
      id: "app4warning-p188-005-jinetes-catalog-entry",
      maxSourceWidth: 75,
      maxSourceHeight: 80
    },
    {
      id: "app4warning-p188-009-presencia-de-vehiculos-extranos-tranvia",
      maxSourceWidth: 80,
      maxSourceHeight: 80
    },
    {
      id: "app4warning-p188-010-presencia-de-vehiculos-extranos-tractor",
      maxSourceWidth: 80,
      maxSourceHeight: 80
    },
    {
      id: "app4warning-p188-016-paneles-de-prevencion-curva-chevron",
      maxSourceWidth: 45,
      maxSourceHeight: 55
    },
    {
      id: "app4warning-p188-024-flecha-direccional-catalog-entry",
      maxSourceWidth: 60,
      maxSourceHeight: 40
    }
  ];

  for (const expectation of expectations) {
    const entry = entryById(inventory.entries, expectation.id);
    assert.equal(entry.cropAuditStatus, "reviewed-final-correct", expectation.id);
    assert.equal(entry.cropAuditBasis?.passes, true, expectation.id);
    assert.equal(entry.cropAuditBasis?.neighborContaminationGuardPass, true, expectation.id);
    assert.notEqual(entry.cropAuditBasis?.edgeContact?.right, true, expectation.id);
    assert.ok(entry.finalSourceRegionAtBaseScale.width <= expectation.maxSourceWidth, expectation.id);
    assert.ok(entry.finalSourceRegionAtBaseScale.height <= expectation.maxSourceHeight, expectation.id);
  }
});

test("warning crops cannot pass reviewed audit with right-edge neighboring fragments", () => {
  const inventory = loadJson(inventoryPath);
  const warningEntries = inventory.entries.filter(
    (entry) => signLike(entry) && entry.sectionId === "app4-signs-warning"
  );

  for (const entry of warningEntries) {
    assert.equal(entry.cropAuditBasis?.warningRightEdgeGuardPass, true, entry.id);
    assert.equal(entry.cropAuditBasis?.warningLeftEdgeGuardPass, true, entry.id);
    assert.equal(entry.cropAuditBasis?.neighborContaminationGuardPass, true, entry.id);
    assert.notEqual(entry.cropAuditBasis?.edgeContact?.right, true, entry.id);
    if (entry.cropAuditBasis?.edgeContact?.left) {
      assert.ok(
        entry.cropAuditBasis.relativeSourceWidthRatio <= entry.cropAuditBasis.warningHorizontalEdgeMaximumRelativeWidthRatio,
        entry.id
      );
    }
  }
});

test("regulatory Zona de Caudales crops trim neighboring right-edge labels and signs", () => {
  const inventory = loadJson(inventoryPath);
  const expectations = [
    {
      id: "app4regulatory-p185-025-no-estacionar-zona-de-caudales-flecha-derecha",
      maxSourceWidth: 82,
      maxSourceHeight: 92
    },
    {
      id: "app4regulatory-p185-026-no-estacionar-zona-de-caudales-flecha-izquierda",
      maxSourceWidth: 82,
      maxSourceHeight: 92
    }
  ];

  for (const expectation of expectations) {
    const entry = entryById(inventory.entries, expectation.id);
    assert.equal(entry.cropAuditStatus, "reviewed-final-correct", expectation.id);
    assert.equal(entry.cropAuditBasis?.passes, true, expectation.id);
    assert.equal(entry.cropAuditBasis?.regulatoryCaudalesRightEdgeGuardPass, true, expectation.id);
    assert.equal(entry.cropAuditBasis?.regulatoryCaudalesSourceLabelTrimPass, true, expectation.id);
    assert.equal(entry.cropAuditBasis?.neighborContaminationGuardPass, true, expectation.id);
    assert.equal(entry.finalTailTrimMode, "preserve-colorless-lower-attachment-trim-detached-source-label", expectation.id);
    assert.notEqual(entry.cropAuditBasis?.edgeContact?.right, true, expectation.id);
    assert.ok(entry.finalSourceRegionAtBaseScale.width <= expectation.maxSourceWidth, expectation.id);
    assert.ok(entry.finalSourceRegionAtBaseScale.height <= expectation.maxSourceHeight, expectation.id);
  }
});

test("page-185 regulatory parking crops use the generalized right-edge and source-label guard", () => {
  const inventory = loadJson(inventoryPath);
  const page185ParkingExpectations = [
    "app4regulatory-p185-020-no-estacionar-catalog-entry",
    "app4regulatory-p185-021-no-estacionar-acarreo-de-infractores-placa-horar",
    "app4regulatory-p185-022-no-estacionar-acarreo-de-infractores-placa-horar",
    "app4regulatory-p185-023-no-estacionar-entre-discos",
    "app4regulatory-p185-024-no-estacionar-entre-aceras",
    "app4regulatory-p185-025-no-estacionar-zona-de-caudales-flecha-derecha",
    "app4regulatory-p185-026-no-estacionar-zona-de-caudales-flecha-izquierda",
    "app4regulatory-p185-027-no-estacionar-ni-detenerse-catalog-entry",
    "app4regulatory-p185-028-no-estacionar-ni-detenerse-sobre-la-ciclovia"
  ];
  const attachmentExpectations = new Set([
    "app4regulatory-p185-021-no-estacionar-acarreo-de-infractores-placa-horar",
    "app4regulatory-p185-022-no-estacionar-acarreo-de-infractores-placa-horar",
    "app4regulatory-p185-025-no-estacionar-zona-de-caudales-flecha-derecha",
    "app4regulatory-p185-026-no-estacionar-zona-de-caudales-flecha-izquierda",
    "app4regulatory-p185-028-no-estacionar-ni-detenerse-sobre-la-ciclovia"
  ]);

  const regulatoryParkingRows = inventory.entries.filter(
    (entry) => signLike(entry) && entry.sectionId === "app4-signs-regulatory" && entry.sourcePage === 185 && /no-estacionar|detenerse/u.test(entry.id)
  );
  assert.deepEqual(regulatoryParkingRows.map((entry) => entry.id), page185ParkingExpectations);

  for (const id of page185ParkingExpectations) {
    const entry = entryById(inventory.entries, id);
    assert.equal(entry.cropAuditStatus, "reviewed-final-correct", id);
    assert.equal(entry.cropAuditBasis?.passes, true, id);
    assert.equal(entry.cropAuditBasis?.regulatoryParkingRightEdgeGuardPass, true, id);
    assert.equal(entry.cropAuditBasis?.regulatoryParkingSourceLabelTrimPass, true, id);
    assert.equal(entry.cropAuditBasis?.neighborContaminationGuardPass, true, id);
    if (attachmentExpectations.has(id)) {
      assert.equal(entry.finalTailTrimMode, "preserve-colorless-lower-attachment-trim-detached-source-label", id);
    }
    if (/zona-de-caudales|ciclovia/u.test(id)) {
      assert.notEqual(entry.cropAuditBasis?.edgeContact?.right, true, id);
      assert.ok(entry.finalSourceRegionAtBaseScale.width <= 82, id);
      assert.ok(entry.finalSourceRegionAtBaseScale.height <= 92, id);
    }
    if (entry.cropAuditBasis?.edgeContact?.right) {
      assert.ok(
        entry.cropAuditBasis.relativeSourceWidthRatio <= entry.cropAuditBasis.regulatoryParkingRightEdgeMaximumRelativeWidthRatio,
        id
      );
    }
    if (attachmentExpectations.has(id)) {
      assert.ok(entry.finalSourceRegionAtBaseScale.height <= Math.ceil(entry.baselineCropNaturalHeight * 0.72), id);
    }
  }
});

test("external source captions are trimmed from informational pedestrian crossing crops", () => {
  const inventory = loadJson(inventoryPath);
  for (const id of [
    "app4informational-p190-007-cruce-peatonal-derecha",
    "app4informational-p190-008-cruce-peatonal-izquierda"
  ]) {
    const entry = entryById(inventory.entries, id);
    assert.equal(entry.cropAuditStatus, "reviewed-final-correct", id);
    assert.equal(entry.cropAuditBasis?.passes, true, id);
    assert.ok(entry.finalSourceRegionAtBaseScale.y >= 1840, id);
    assert.ok(entry.finalSourceRegionAtBaseScale.height <= 60, id);
  }
});

test("crop generator cannot stamp reviewed-final-correct without audit pass", () => {
  const cropResolutionSource = readFileSync(cropResolutionScriptPath, "utf8");
  assert.match(cropResolutionSource, /automatedCropAudit\.passes\s*\?\s*"reviewed-final-correct"\s*:\s*"pending-crop-audit"/u);
  assert.doesNotMatch(cropResolutionSource, /cropAuditStatus:\s*"reviewed-final-correct"/u);
  assert.match(cropResolutionSource, /edgeContactPass/u);
  assert.match(cropResolutionSource, /sourceBoundsPass/u);
  assert.match(cropResolutionSource, /neighborContaminationGuardPass/u);
  assert.match(cropResolutionSource, /warningRightEdgeGuardPass/u);
  assert.match(cropResolutionSource, /regulatoryCaudalesRightEdgeGuardPass/u);
  assert.match(cropResolutionSource, /regulatoryParkingRightEdgeGuardPass/u);
});

test("category headings are DOM dispositions and excluded from sign quality counts", () => {
  const inventory = loadJson(inventoryPath);
  const headings = inventory.entries.filter((entry) => entry.entryKind === "category-heading");
  assert.equal(headings.length, 30);
  for (const entry of headings) {
    assert.equal(entry.renderMode, "category-heading-dom", entry.id);
    assert.equal(entry.assetPath, null, entry.id);
    assert.equal(entry.threeXStatus, "not-applicable-category-heading", entry.id);
    assert.equal(entry.cropAuditStatus, "category-heading-dom", entry.id);
  }
});

test("known screenshot problem rows have corrected source bounds and no old CSS clip runtime path", () => {
  const inventory = loadJson(inventoryPath);
  const animalCart = inventory.entries.find((entry) => entry.id === "app4regulatory-p185-011-no-circular-carro-de-traccion-animal");
  const noParkingPlate = inventory.entries.find((entry) => entry.id === "app4regulatory-p185-021-no-estacionar-acarreo-de-infractores-placa-horar");
  assert.ok(animalCart);
  assert.ok(noParkingPlate);
  assert.equal(animalCart.finalTailTrimMode, "trim-external-catalog-label");
  assert.equal(noParkingPlate.finalTailTrimMode, "preserve-colorless-lower-attachment-trim-detached-source-label");
  assert.ok(animalCart.finalSourceRegionAtBaseScale.width < animalCart.baselineCropNaturalWidth, animalCart.id);
  assert.ok(noParkingPlate.finalSourceRegionAtBaseScale.height <= Math.ceil(noParkingPlate.baselineCropNaturalHeight * 0.72), noParkingPlate.id);
  assert.equal(noParkingPlate.cropAuditBasis?.regulatoryParkingRightEdgeGuardPass, true, noParkingPlate.id);
  assert.equal(animalCart.cropAuditBasis?.passes, true, animalCart.id);
  assert.equal(noParkingPlate.cropAuditBasis?.passes, true, noParkingPlate.id);
  assert.equal(animalCart.renderMode, "individual-source-crop-3x");
  assert.equal(noParkingPlate.renderMode, "individual-source-crop-3x");
});

test("runtime renderer uses direct image assets and no learner-facing sheet clip component", () => {
  const appSource = readFileSync(appPath, "utf8");
  const cssSource = readFileSync(cssPath, "utf8");
  assert.match(appSource, /function ManualSignImage/u);
  assert.doesNotMatch(appSource, /ManualSignSourceClip/u);
  assert.doesNotMatch(appSource, /manual-sign-source-viewport/u);
  assert.match(appSource, /data-render-mode=\{entry\.renderMode\}/u);
  assert.match(cssSource, /\.manual-sign-image\b/u);
  assert.doesNotMatch(cssSource, /\.manual-sign-source-viewport/u);
  assert.doesNotMatch(cssSource, /transform:\s*translate\(calc\(-1 \* var\(--manual-sign-crop-x\)/u);
});

test("inventory and renderer avoid forbidden replacement or runtime-source patterns", () => {
  const inventoryText = readFileSync(inventoryPath, "utf8");
  const appSource = readFileSync(appPath, "utf8");
  assert.doesNotMatch(inventoryText, /"renderMode": "source-image-css-clip"/u);
  assert.doesNotMatch(inventoryText, /threeXStatus": "passed"/u);
  assert.doesNotMatch(appSource, /<iframe|<object|<embed|pdfjs|fetch\(/iu);
  assert.doesNotMatch(inventoryText, /https?:\/\//u);
});
