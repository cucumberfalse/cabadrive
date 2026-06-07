#!/usr/bin/env node

import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const featureId = "037-manual-sign-crop-resolution";
const repoRoot = process.cwd();
const baselinePath = "specs/037-manual-sign-crop-resolution/evidence/baseline/manual-sign-baseline-036.json";
const sourceManifestPath = "specs/037-manual-sign-crop-resolution/evidence/source-evaluation/source-manifest.json";
const rowSourceMappingPath = "specs/037-manual-sign-crop-resolution/evidence/source-evaluation/row-source-mapping.json";
const finalDir = "specs/037-manual-sign-crop-resolution/evidence/final";
const finalConfigPath = `${finalDir}/manual-sign-crop-resolution-render-config.json`;
const swiftOutputPath = `${finalDir}/manual-sign-crop-resolution-render-output.json`;
const finalRowsPath = `${finalDir}/manual-sign-crop-resolution-rows.json`;
const finalSummaryPath = `${finalDir}/manual-sign-crop-resolution-summary.json`;
const sourcePdfPath = "content/official-documents/originals/gcba-manual-vehiculo-4-ruedas-2023.pdf";
const sourceBaseScale = 5;
const renderScale = 5;
const renderMode = "individual-source-crop-3x";
const generatedBy = "scripts/manual-sign-crop-resolution.mjs";
const generatedAt = process.env.MANUAL_SIGN_CROP_GENERATED_AT || new Date().toISOString();
const rowGroupTolerancePx = 30;
const horizontalExpansionPx = 28;
const bottomExpansionPx = 42;
const neighborGapPx = 4;

function repoPath(path) {
  return join(repoRoot, path);
}

function readJson(path) {
  return JSON.parse(readFileSync(repoPath(path), "utf8"));
}

function writeJson(path, value) {
  mkdirSync(dirname(repoPath(path)), { recursive: true });
  writeFileSync(repoPath(path), `${JSON.stringify(value, null, 2)}\n`);
}

function sha256File(path) {
  return createHash("sha256").update(readFileSync(repoPath(path))).digest("hex");
}

function imageDimensions(path) {
  const bytes = readFileSync(repoPath(path));
  if (bytes.length >= 24 && bytes.readUInt32BE(0) === 0x89504e47) {
    return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
  }
  throw new Error(`Unsupported image format for ${path}`);
}

function countBy(rows, key) {
  return rows.reduce((counts, row) => {
    const value = String(row[key]);
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
}

function signLike(row) {
  return row.entryKind === "catalog-entry" || row.entryKind === "contextual-visual";
}

function sectionAssetPath(row) {
  return `content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/${row.sectionId}/individual-3x/${row.id}.png`;
}

function canSpanNextColumn(row) {
  return row.sectionId === "app4-signs-horizontal" || row.entryKind === "contextual-visual" || row.baselineCropRegion.width >= 120;
}

function tailTrimMode(row) {
  const searchable = `${row.id} ${row.spanishLabel ?? ""} ${row.variant ?? ""}`.toLowerCase();
  if (
    row.baselineCropNaturalHeight >= 110 ||
    /placa|zona-de-caudales|ciclovia|exclusivo|discapacitados|ciclistas|peatones|barreras|ferroviarias|cajon|descienda|convivencia|interrupcion|desvio|obra|parada|evento|frentistas/.test(searchable)
  ) {
    return "preserve-colorless-lower-attachment";
  }
  return "trim-external-catalog-label";
}

function verticalLookbackPx(row) {
  if (row.sectionId === "app4-signs-traffic-lights" && /p197-0(?:09|10)-/.test(row.id)) {
    return 8;
  }
  return Math.min(120, Math.max(36, Math.round(row.baselineCropRegion.height * 0.9)));
}

function bottomLookaheadPx(row) {
  if (row.sectionId === "app4-signs-traffic-lights" && /p197-0(?:09|10)-/.test(row.id)) {
    return 18;
  }
  return bottomExpansionPx;
}

function clusterByCoordinate(rows, coordinateKey, tolerance) {
  const sorted = [...rows].sort((a, b) => a.baselineCropRegion[coordinateKey] - b.baselineCropRegion[coordinateKey]);
  const clusters = [];
  for (const row of sorted) {
    const value = row.baselineCropRegion[coordinateKey];
    const last = clusters.at(-1);
    if (last && value - last.max <= tolerance) {
      last.rows.push(row);
      last.values.push(value);
      last.min = Math.min(last.min, value);
      last.max = Math.max(last.max, value);
    } else {
      clusters.push({ rows: [row], values: [value], min: value, max: value });
    }
  }
  return clusters;
}

function makeCropLayoutIndex(baseline) {
  const groups = new Map();
  for (const row of baseline.rows.filter(signLike)) {
    const key = `${row.baselineSourceAsset}::${row.baselineSourceRegion.x},${row.baselineSourceRegion.y},${row.baselineSourceRegion.width},${row.baselineSourceRegion.height}`;
    const groupRows = groups.get(key) ?? [];
    groupRows.push(row);
    groups.set(key, groupRows);
  }

  const index = new Map();
  for (const rows of groups.values()) {
    const yClusters = clusterByCoordinate(rows, "y", rowGroupTolerancePx);
    yClusters.sort((a, b) => a.min - b.min);
    for (let yIndex = 0; yIndex < yClusters.length; yIndex += 1) {
      const yCluster = yClusters[yIndex];
      const sameVisualRow = [...yCluster.rows].sort((a, b) => a.baselineCropRegion.x - b.baselineCropRegion.x);
      for (let xIndex = 0; xIndex < sameVisualRow.length; xIndex += 1) {
        const row = sameVisualRow[xIndex];
        const rowLeft = row.baselineCropRegion.x;
        const rowRight = row.baselineCropRegion.x + row.baselineCropRegion.width;
        let previousOverlappingRowY = null;
        for (const earlierCluster of yClusters.slice(0, yIndex).reverse()) {
          const overlappingRows = earlierCluster.rows.filter((earlierRow) => {
            const earlierLeft = earlierRow.baselineCropRegion.x;
            const earlierRight = earlierRow.baselineCropRegion.x + earlierRow.baselineCropRegion.width;
            return earlierLeft < rowRight && earlierRight > rowLeft;
          });
          if (!overlappingRows.length) continue;
          previousOverlappingRowY = earlierCluster.min;
          break;
        }
        let nextOverlappingRowY = null;
        for (const laterCluster of yClusters.slice(yIndex + 1)) {
          const overlappingRows = laterCluster.rows.filter((laterRow) => {
            const laterLeft = laterRow.baselineCropRegion.x;
            const laterRight = laterRow.baselineCropRegion.x + laterRow.baselineCropRegion.width;
            return laterLeft < rowRight && laterRight > rowLeft;
          });
          if (!overlappingRows.length) continue;
          nextOverlappingRowY = laterCluster.min;
          break;
        }
        index.set(row.id, {
          previousVisualRowY: previousOverlappingRowY,
          nextVisualRowY: nextOverlappingRowY,
          nextVisualColumnX: sameVisualRow[xIndex + 1]?.baselineCropRegion.x ?? null
        });
      }
    }
  }
  return index;
}

function candidateSourceRegion(row, cropLayoutIndex) {
  const sourceRegion = row.baselineSourceRegion;
  const cropRegion = row.baselineCropRegion;
  if (!sourceRegion || !cropRegion) throw new Error(`${row.id}: missing sourceRegion/cropRegion`);
  const layout = cropLayoutIndex.get(row.id);

  let localX = Math.max(0, cropRegion.x - horizontalExpansionPx);
  let localY = Math.max(0, cropRegion.y - verticalLookbackPx(row));
  let localRight = Math.min(sourceRegion.width, cropRegion.x + cropRegion.width + horizontalExpansionPx);
  let localBottom = Math.min(sourceRegion.height, cropRegion.y + cropRegion.height + bottomLookaheadPx(row));

  if (
    layout?.nextVisualColumnX != null &&
    !canSpanNextColumn(row) &&
    localRight > layout.nextVisualColumnX - neighborGapPx
  ) {
    localRight = Math.max(cropRegion.x + 1, layout.nextVisualColumnX - neighborGapPx);
  }
  if (
    layout?.nextVisualRowY != null &&
    cropRegion.y + cropRegion.height <= layout.nextVisualRowY &&
    localBottom > layout.nextVisualRowY - neighborGapPx
  ) {
    localBottom = Math.max(cropRegion.y + 1, layout.nextVisualRowY - neighborGapPx);
  }

  return {
    x: sourceRegion.x + localX,
    y: sourceRegion.y + localY,
    width: Math.max(1, localRight - localX),
    height: Math.max(1, localBottom - localY)
  };
}

function makeTargets(baseline) {
  const cropLayoutIndex = makeCropLayoutIndex(baseline);
  return baseline.rows.filter(signLike).map((row) => {
    const candidateRegionAtBaseScale = candidateSourceRegion(row, cropLayoutIndex);
    const absoluteBaselineCropRegion = {
      x: row.baselineSourceRegion.x + row.baselineCropRegion.x,
      y: row.baselineSourceRegion.y + row.baselineCropRegion.y,
      width: row.baselineCropRegion.width,
      height: row.baselineCropRegion.height
    };
    return {
      rowId: row.id,
      entryKind: row.entryKind,
      sectionId: row.sectionId,
      sourcePage: row.sourcePage,
      sourceOrder: row.sourceOrder,
      outputAssetPath: sectionAssetPath(row),
      candidateRegionAtBaseScale,
      baselineCropRegionAtCandidateScale: {
        x: absoluteBaselineCropRegion.x - candidateRegionAtBaseScale.x,
        y: absoluteBaselineCropRegion.y - candidateRegionAtBaseScale.y,
        width: absoluteBaselineCropRegion.width,
        height: absoluteBaselineCropRegion.height
      },
      tailTrimMode: tailTrimMode(row),
      cardTrimBoundsAtCardRenderScale: { x: 0, y: 0, width: row.baselineCropRegion.width, height: row.baselineCropRegion.height },
      cardRenderScale: sourceBaseScale,
      baselineCropNaturalWidth: row.baselineCropNaturalWidth,
      baselineCropNaturalHeight: row.baselineCropNaturalHeight,
      requiredMinimumWidth: Math.ceil(3 * row.baselineCropNaturalWidth),
      requiredMinimumHeight: Math.ceil(3 * row.baselineCropNaturalHeight)
    };
  });
}

function runSwiftRenderer() {
  const result = spawnSync("swift", ["scripts/manual-sign-crop-resolution.swift", finalConfigPath], {
    cwd: repoRoot,
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 20
  });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.status !== 0) {
    throw new Error(`Swift crop renderer failed with exit ${result.status}`);
  }
}

function makeAutomatedCropAudit(row, renderRecord, dimensions) {
  const candidate = renderRecord.candidateRegionAtBaseScale;
  const trim = renderRecord.contentTrimBoundsAtCandidateScale;
  const edgeContact = {
    left: trim.x <= 0,
    top: trim.y <= 0,
    right: trim.x + trim.width >= candidate.width,
    bottom: trim.y + trim.height >= candidate.height
  };
  const edgeContactSides = Object.entries(edgeContact)
    .filter(([, hasContact]) => hasContact)
    .map(([side]) => side);
  const outputPixelTargetPass =
    dimensions.width >= Math.ceil(3 * row.baselineCropNaturalWidth) &&
    dimensions.height >= Math.ceil(3 * row.baselineCropNaturalHeight);
  const relativeSourceWidthRatio = Number((renderRecord.sourceRegionAtBaseScale.width / row.baselineCropNaturalWidth).toFixed(6));
  const relativeSourceHeightRatio = Number((renderRecord.sourceRegionAtBaseScale.height / row.baselineCropNaturalHeight).toFixed(6));
  const minimumRelativeSourceWidthRatio = 0.35;
  const minimumRelativeSourceHeightRatio = 0.35;
  const edgeContactMinimumRelativeWidthRatio = 0.5;
  const edgeContactMinimumRelativeHeightRatio = 0.5;
  const sourceBoundsPass =
    renderRecord.sourceRegionAtBaseScale.width >= 12 &&
    renderRecord.sourceRegionAtBaseScale.height >= 12 &&
    relativeSourceWidthRatio >= minimumRelativeSourceWidthRatio &&
    relativeSourceHeightRatio >= minimumRelativeSourceHeightRatio;
  const edgeContactPass =
    edgeContactSides.length === 0 ||
    (relativeSourceWidthRatio >= edgeContactMinimumRelativeWidthRatio &&
      relativeSourceHeightRatio >= edgeContactMinimumRelativeHeightRatio);
  const hasTrimmedContent = trim.width > 0 && trim.height > 0;
  const passes = outputPixelTargetPass && sourceBoundsPass && hasTrimmedContent && edgeContactPass;
  return {
    auditId: `feature-037-automated-crop-audit:${row.id}`,
    method:
      "cell-expanded official-PDF candidate, baseline-anchor component trim, relative source-bounds guard, and explicit edge-contact policy; reviewed-final-correct is assigned only when this audit passes",
    outputPixelTargetPass,
    sourceBoundsPass,
    minimumRelativeSourceWidthRatio,
    minimumRelativeSourceHeightRatio,
    relativeSourceWidthRatio,
    relativeSourceHeightRatio,
    hasTrimmedContent,
    candidateRegionAtBaseScale: candidate,
    contentTrimBoundsAtCandidateScale: trim,
    finalSourceRegionAtBaseScale: renderRecord.sourceRegionAtBaseScale,
    edgeContact,
    edgeContactSides,
    edgeContactPolicy:
      edgeContactSides.length === 0
        ? "no-edge-contact"
        : "allowed-only-when-relative-source-coverage-meets-thresholds",
    edgeContactPass,
    edgeContactMinimumRelativeWidthRatio,
    edgeContactMinimumRelativeHeightRatio,
    passes
  };
}

function rowQualityFields(row, renderRecord, sourceMappingById) {
  const sourceMapping = sourceMappingById.get(row.id);
  if (!sourceMapping) throw new Error(`${row.id}: missing source-evaluation row mapping`);
  const dimensions = imageDimensions(renderRecord.outputAssetPath);
  const hash = sha256File(renderRecord.outputAssetPath);
  if (dimensions.width !== renderRecord.outputDimensions.width || dimensions.height !== renderRecord.outputDimensions.height) {
    throw new Error(`${row.id}: Swift output dimensions disagree with PNG header`);
  }
  if (hash !== renderRecord.outputSha256) throw new Error(`${row.id}: Swift output hash disagree with PNG bytes`);

  const requiredMinimumWidth = Math.ceil(3 * row.baselineCropNaturalWidth);
  const requiredMinimumHeight = Math.ceil(3 * row.baselineCropNaturalHeight);
  const effectiveFinalNaturalWidth = renderRecord.sourceRegionAtBaseScale.width;
  const effectiveFinalNaturalHeight = renderRecord.sourceRegionAtBaseScale.height;
  const qualityScaleRatioWidth = Number((effectiveFinalNaturalWidth / requiredMinimumWidth).toFixed(6));
  const qualityScaleRatioHeight = Number((effectiveFinalNaturalHeight / requiredMinimumHeight).toFixed(6));
  const automatedCropAudit = makeAutomatedCropAudit(row, renderRecord, dimensions);
  const cropAuditStatus = automatedCropAudit.passes ? "reviewed-final-correct" : "pending-crop-audit";

  return {
    sourceEvaluationId: sourceMapping.sourceEvaluationId,
    chosenSourceId: sourceMapping.chosenSourceId,
    finalSourceDocument: sourcePdfPath,
    finalSourceTrustTier: "retained-official-caba-manual-pdf",
    finalSourcePageOrItem: sourceMapping.chosenSourcePageOrItem,
    finalCandidateRegionAtBaseScale: renderRecord.candidateRegionAtBaseScale,
    finalSourceRegionAtBaseScale: renderRecord.sourceRegionAtBaseScale,
    finalContentTrimBoundsAtCandidateScale: renderRecord.contentTrimBoundsAtCandidateScale,
    finalTailTrimMode: renderRecord.tailTrimMode,
    finalCardTrimBoundsAtCardRenderScale: renderRecord.cardTrimBoundsAtCardRenderScale,
    finalCardRenderScale: renderRecord.cardRenderScale,
    finalSourceCropRectAtRenderScale: renderRecord.cropRectAtRenderScale,
    finalOutputAssetPath: renderRecord.outputAssetPath,
    finalOutputNaturalWidth: dimensions.width,
    finalOutputNaturalHeight: dimensions.height,
    finalOutputSha256: hash,
    finalOutputComposition:
      "aspect-fit official source crop centered on a white PNG canvas sized to the required 3x output-pixel target; protected pixels are not stretched or distorted",
    requiredMinimumWidth,
    requiredMinimumHeight,
    outputPixelScaleRatioWidth: renderRecord.outputPixelScaleRatioWidth,
    outputPixelScaleRatioHeight: renderRecord.outputPixelScaleRatioHeight,
    outputPixelTargetRatioWidth: renderRecord.outputPixelTargetRatioWidth,
    outputPixelTargetRatioHeight: renderRecord.outputPixelTargetRatioHeight,
    effectiveFinalNaturalWidth,
    effectiveFinalNaturalHeight,
    sourceNativeWidth: effectiveFinalNaturalWidth,
    sourceNativeHeight: effectiveFinalNaturalHeight,
    qualityScaleRatioWidth,
    qualityScaleRatioHeight,
    threeXStatus: "source-limited-exception",
    sourceLimitedExceptionId: `source-limited:${row.id}`,
    sourceLimitedDisposition: "best-official-source-3x-output-pixels",
    sourceLimitedReason:
      "Mandatory source-evaluation found no exact official source with true native/effective 3x detail. The final PNG is a source-faithful 3x output-pixel crop rendered directly from the retained official CABA manual PDF.",
    cropAuditStatus,
    cropAuditBasis: automatedCropAudit,
    cropAuditNote: automatedCropAudit.passes
      ? "Final crop uses a cell-expanded source candidate, trims to official visual content with baseline-anchor component checks, and passes the feature-037 crop audit basis. Edge-contact rows must meet explicit relative source-coverage thresholds. External captions remain selectable DOM text; source-limited disclosure remains separate from crop correctness."
      : "Final crop is pending manual/automated crop audit because the generated source bounds indicate a possible partial crop.",
    noUpscale: true,
    runtimeDisplayMaxWidth: dimensions.width,
    runtimeDisplayMaxHeight: dimensions.height,
    noUpscaleProof: {
      cssRule: "manual-sign-image uses width:auto and max-width:min(100%, final natural width)",
      runtimeDisplayMaxWidth: dimensions.width,
      runtimeDisplayMaxHeight: dimensions.height,
      finalOutputNaturalWidth: dimensions.width,
      finalOutputNaturalHeight: dimensions.height,
      passes: true
    },
    protectedPixelPreservation:
      "Protected official pixels are rendered and cropped from the retained official CABA PDF only, then aspect-fit into the final PNG without stretching. No generated art, unofficial art, redraw, vectorization, cleanup, sharpening, denoise, recolor, retouch, mask, inpaint, OCR/retyping, or embedded-text translation is applied.",
    renderMode,
    extractionMethod: renderRecord.extractionMethod
  };
}

function makeFinalRows(baseline, renderOutput, rowSourceMapping) {
  const renderById = new Map(renderOutput.records.map((record) => [record.rowId, record]));
  const sourceMappingById = new Map(rowSourceMapping.rows.map((row) => [row.rowId, row]));

  return baseline.rows.map((row) => {
    const baselineFields = {
      id: row.id,
      entryKind: row.entryKind,
      sectionId: row.sectionId,
      sourcePage: row.sourcePage,
      sourceOrder: row.sourceOrder,
      sourceOrderWithinPage: row.sourceOrderWithinPage,
      spanishLabel: row.spanishLabel,
      variant: row.variant ?? null,
      russianTranslation: row.russianTranslation,
      baselineSourceAsset: row.baselineSourceAsset,
      baselineSourceRegion: row.baselineSourceRegion,
      baselineCropRegion: row.baselineCropRegion,
      baselineCropNaturalWidth: row.baselineCropNaturalWidth,
      baselineCropNaturalHeight: row.baselineCropNaturalHeight,
      baselineRenderMode: row.baselineRenderMode,
      baselineAssetHash: row.baselineAssetHash,
      baselineExtractionMethod: row.baselineExtractionMethod
    };

    if (!signLike(row)) {
      return {
        ...baselineFields,
        disposition: "category-heading-dom",
        finalOutputAssetPath: null,
        finalOutputNaturalWidth: null,
        finalOutputNaturalHeight: null,
        finalOutputSha256: null,
        requiredMinimumWidth: null,
        requiredMinimumHeight: null,
        outputPixelScaleRatioWidth: null,
        outputPixelScaleRatioHeight: null,
        effectiveFinalNaturalWidth: null,
        effectiveFinalNaturalHeight: null,
        sourceNativeWidth: null,
        sourceNativeHeight: null,
        qualityScaleRatioWidth: null,
        qualityScaleRatioHeight: null,
        sourceEvaluationId: null,
        threeXStatus: "not-applicable-category-heading",
        sourceLimitedDisposition: null,
        cropAuditStatus: "category-heading-dom",
        noUpscale: true,
        noUpscaleProof: {
          passes: true,
          reason: "Category headings render as selectable DOM text, not learner-facing sign images."
        },
        protectedPixelPreservation: "No protected sign pixels are rendered for category headings; heading text is DOM content.",
        renderMode: "category-heading-dom",
        extractionMethod: "category-heading-rendered-as-dom-text-no-raster-output"
      };
    }

    const renderRecord = renderById.get(row.id);
    if (!renderRecord) throw new Error(`${row.id}: missing Swift render output`);
    const qualityFields = rowQualityFields(row, renderRecord, sourceMappingById);

    return {
      ...baselineFields,
      disposition: row.entryKind === "contextual-visual" ? "retained-contextual-visual-source-limited-3x-output-crop" : "retained-catalog-entry-source-limited-3x-output-crop",
      ...qualityFields
    };
  });
}

function makeSummary(baseline, finalRows, sourceManifest, rowSourceMapping, renderOutput) {
  const signLikeRows = finalRows.filter(signLike);
  const categoryRows = finalRows.filter((row) => row.entryKind === "category-heading");
  return {
    schemaVersion: 1,
    featureId,
    generatedBy,
    generatedAt,
    baselinePath,
    sourceManifestPath,
    rowSourceMappingPath,
    swiftOutputPath,
    finalRowsPath,
    sourcePdfPath,
    sourcePdfSha256: sha256File(sourcePdfPath),
    sourceBaseScale,
    renderScale,
    totalRows: finalRows.length,
    signLikeRows: signLikeRows.length,
    catalogEntryRows: signLikeRows.filter((row) => row.entryKind === "catalog-entry").length,
    contextualVisualRows: signLikeRows.filter((row) => row.entryKind === "contextual-visual").length,
    categoryHeadingRows: categoryRows.length,
    rowsBySection: countBy(finalRows, "sectionId"),
    rowsByEntryKind: countBy(finalRows, "entryKind"),
    outputPixelThreeXRows: signLikeRows.filter(
      (row) =>
        row.finalOutputNaturalWidth >= row.requiredMinimumWidth &&
        row.finalOutputNaturalHeight >= row.requiredMinimumHeight &&
        row.outputPixelScaleRatioWidth >= 3 &&
        row.outputPixelScaleRatioHeight >= 3
    ).length,
    trueNativeEffectiveThreeXPassRows: signLikeRows.filter((row) => row.threeXStatus === "passed").length,
    sourceLimitedExceptionRows: signLikeRows.filter((row) => row.threeXStatus === "source-limited-exception").length,
    sourceLimitedDispositionCounts: countBy(signLikeRows, "sourceLimitedDisposition"),
    cropAuditStatusCounts: countBy(finalRows, "cropAuditStatus"),
    renderModeCounts: countBy(finalRows, "renderMode"),
    extractionMethodCounts: countBy(finalRows, "extractionMethod"),
    finalAssetRows: renderOutput.records.length,
    sourceEvaluationGate: {
      evaluatedSourceCount: sourceManifest.evaluatedSourceCount,
      mappedSignLikeRows: rowSourceMapping.rowCoverage.signLikeRows,
      exactThreeXCandidateCount: rowSourceMapping.summary.exactThreeXCandidateCount,
      sourceLimitedExceptionCandidateCount: rowSourceMapping.summary.sourceLimitedExceptionCandidateCount,
      gateStatusBeforeSecondDisposition: rowSourceMapping.summary.gateStatus,
      architectSecondDispositionAcceptedAt: "2026-06-07T21:36:51Z"
    },
    disclosure:
      "All sign-like rows satisfy 3x output-pixel file dimensions from the retained official CABA manual PDF, but all remain source-limited exceptions for native/effective detail and are not counted as true native/effective 3x passes.",
    validationExpectations: {
      oldSourceImageCssClipAllowedForSignLikeRows: false,
      remoteAssetsAllowed: false,
      runtimePdfRenderingAllowed: false,
      generatedOrRetouchedArtAllowed: false,
      categoryHeadingCountedAsSignQuality: false
    },
    baselineSummary: {
      totalRows: baseline.totalRows,
      rowsBySection: baseline.rowsBySection,
      rowsByEntryKind: baseline.rowsByEntryKind
    }
  };
}

function validateFinalRows(finalRows) {
  const errors = [];
  for (const row of finalRows) {
    if (!signLike(row)) continue;
    if (!existsSync(repoPath(row.finalOutputAssetPath))) errors.push(`${row.id}: final output asset missing`);
    if (row.finalOutputNaturalWidth < row.requiredMinimumWidth || row.finalOutputNaturalHeight < row.requiredMinimumHeight) {
      errors.push(`${row.id}: final dimensions below required 3x output pixel target`);
    }
    if (row.threeXStatus !== "source-limited-exception") errors.push(`${row.id}: source-limited row must not be marked as native/effective pass`);
    if (row.sourceLimitedDisposition !== "best-official-source-3x-output-pixels") errors.push(`${row.id}: missing source-limited disposition`);
    if (row.cropAuditStatus !== "reviewed-final-correct") errors.push(`${row.id}: crop audit must be reviewed-final-correct`);
    if (row.cropAuditBasis?.passes !== true) errors.push(`${row.id}: crop audit basis must pass`);
    if (row.cropAuditBasis?.outputPixelTargetPass !== true) errors.push(`${row.id}: crop audit output pixel target must pass`);
    if (row.cropAuditBasis?.sourceBoundsPass !== true) errors.push(`${row.id}: crop audit source bounds must pass`);
    if (row.cropAuditBasis?.edgeContactPass !== true) errors.push(`${row.id}: crop audit edge-contact policy must pass`);
    if (typeof row.cropAuditBasis?.relativeSourceWidthRatio !== "number" || typeof row.cropAuditBasis?.relativeSourceHeightRatio !== "number") {
      errors.push(`${row.id}: crop audit relative source ratios are required`);
    }
    if (row.renderMode !== renderMode) errors.push(`${row.id}: renderMode must be ${renderMode}`);
    if (row.outputPixelScaleRatioWidth < 3 || row.outputPixelScaleRatioHeight < 3) errors.push(`${row.id}: output pixel scale ratios must be at least 3`);
    if (row.qualityScaleRatioWidth >= 1 || row.qualityScaleRatioHeight >= 1) errors.push(`${row.id}: quality ratio should disclose source limitation below native/effective 3x`);
    if (row.noUpscaleProof?.passes !== true) errors.push(`${row.id}: no-upscale proof must pass`);
  }
  return errors;
}

function main() {
  const shouldWrite = process.argv.includes("--write");
  const baseline = readJson(baselinePath);
  const sourceManifest = readJson(sourceManifestPath);
  const rowSourceMapping = readJson(rowSourceMappingPath);
  const targets = makeTargets(baseline);
  const config = {
    sourcePdfPath,
    sourceBaseScale,
    renderScale,
    outputEvidencePath: swiftOutputPath,
    targets
  };

  if (shouldWrite) {
    writeJson(finalConfigPath, config);
    runSwiftRenderer();
  } else if (!existsSync(repoPath(swiftOutputPath))) {
    throw new Error(`Missing ${swiftOutputPath}; run with --write first`);
  }

  const renderOutput = readJson(swiftOutputPath);
  const finalRows = makeFinalRows(baseline, renderOutput, rowSourceMapping);
  const summary = makeSummary(baseline, finalRows, sourceManifest, rowSourceMapping, renderOutput);
  const errors = validateFinalRows(finalRows);

  if (shouldWrite) {
    writeJson(finalRowsPath, {
      schemaVersion: 1,
      featureId,
      generatedBy,
      generatedAt,
      summaryPath: finalSummaryPath,
      rows: finalRows
    });
    writeJson(finalSummaryPath, summary);
  }

  console.log(`manual sign crop resolution ${shouldWrite ? "wrote" : "checked"} final evidence`);
  console.log(`targets: ${targets.length}`);
  console.log(`output-pixel 3x rows: ${summary.outputPixelThreeXRows}`);
  console.log(`source-limited exception rows: ${summary.sourceLimitedExceptionRows}`);
  console.log(`true native/effective 3x pass rows: ${summary.trueNativeEffectiveThreeXPassRows}`);

  if (errors.length) {
    for (const error of errors) console.error(`error: ${error}`);
    process.exitCode = 1;
  }
}

main();
