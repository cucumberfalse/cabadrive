#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";

const featureId = "037-manual-sign-crop-resolution";
const baselineEvidencePath = "specs/037-manual-sign-crop-resolution/evidence/baseline/manual-sign-baseline-036.json";
const sourceEvaluationDir = "specs/037-manual-sign-crop-resolution/evidence/source-evaluation";
const sourceManifestPath = `${sourceEvaluationDir}/source-manifest.json`;
const rowSourceMappingPath = `${sourceEvaluationDir}/row-source-mapping.json`;
const archivedSourceRoot =
  "specs/037-manual-sign-crop-resolution/evidence/source-evaluation/archived-sources/traffic-sign-source-evaluation-037";
const generatedBy = "scripts/manual-sign-source-evaluation.mjs";
const generatedAt = process.env.SOURCE_EVALUATION_GENERATED_AT || new Date().toISOString();

const sourceIds = [
  "caba-manual-pdf",
  "retained-anexo-l-panels",
  "argentina-anexo-l-html",
  "argentina-anexo-l-html-images",
  "argentina-ansv-sign-catalog-pdf",
  "argentina-anexo-art22-archive-pdf",
  "gcba-boletin-anx-58",
  "gcba-boletin-anx-59",
  "gcba-pliego-signage-pdf"
];

function repoPath(path) {
  return join(process.cwd(), path);
}

function readJson(path) {
  return JSON.parse(readFileSync(repoPath(path), "utf8"));
}

function sha256File(path) {
  return createHash("sha256").update(readFileSync(repoPath(path))).digest("hex");
}

function fileStats(path) {
  const absolute = repoPath(path);
  if (!existsSync(absolute)) return null;
  const stats = statSync(absolute);
  return {
    path,
    bytes: stats.size,
    mtime: stats.mtime.toISOString(),
    sha256: sha256File(path)
  };
}

function listFiles(path) {
  const absolute = repoPath(path);
  if (!existsSync(absolute)) return [];
  return readdirSync(absolute)
    .filter((name) => !name.startsWith("."))
    .map((name) => join(path, name))
    .filter((candidate) => statSync(repoPath(candidate)).isFile())
    .sort();
}

function jpegDimensions(path) {
  const bytes = readFileSync(repoPath(path));
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return null;

  let offset = 2;
  while (offset + 9 < bytes.length) {
    while (offset < bytes.length && bytes[offset] !== 0xff) offset += 1;
    while (offset < bytes.length && bytes[offset] === 0xff) offset += 1;
    if (offset >= bytes.length) break;

    const marker = bytes[offset];
    offset += 1;
    if (marker === 0xd9 || marker === 0xda) break;
    if (offset + 2 > bytes.length) break;

    const segmentLength = bytes.readUInt16BE(offset);
    if (segmentLength < 2 || offset + segmentLength > bytes.length) break;

    const isStartOfFrame =
      (marker >= 0xc0 && marker <= 0xc3) ||
      (marker >= 0xc5 && marker <= 0xc7) ||
      (marker >= 0xc9 && marker <= 0xcb) ||
      (marker >= 0xcd && marker <= 0xcf);
    if (isStartOfFrame && segmentLength >= 7) {
      return {
        width: bytes.readUInt16BE(offset + 5),
        height: bytes.readUInt16BE(offset + 3)
      };
    }

    offset += segmentLength;
  }

  return null;
}

function assetRecords(paths) {
  return paths.map((path) => {
    const stats = fileStats(path);
    const dimensions = extname(path).toLowerCase() === ".jpg" || extname(path).toLowerCase() === ".jpeg" ? jpegDimensions(path) : null;
    return {
      path,
      bytes: stats?.bytes ?? null,
      sha256: stats?.sha256 ?? null,
      dimensions
    };
  });
}

function makeSourceManifest(baseline) {
  const retainedAnexoLPath = "content/official-documents/originals/decreto-779-1995-anexo-l-senalizacion-vial-uniforme-images";
  const argentinaImagesPath = `${archivedSourceRoot}/argentina-gob-ar-anexo-l-images`;
  const argentinaHtmlPath = `${archivedSourceRoot}/argentina-gob-ar-decreto-779-1995-anexo-l.html`;
  const argentinaHtml = existsSync(repoPath(argentinaHtmlPath)) ? readFileSync(repoPath(argentinaHtmlPath), "utf8") : "";
  const argentinaImageUrls = Array.from(
    new Set(Array.from(argentinaHtml.matchAll(/https?:\/\/[^"'\s)]+?\.(?:jpg|jpeg|png)/gi)).map((match) => match[0]))
  ).sort();

  const sources = [
    {
      id: "caba-manual-pdf",
      label: "GCBA Manual del Conductor, vehiculo 4 ruedas, Appendix IV source pages",
      issuer: "Gobierno de la Ciudad Autonoma de Buenos Aires",
      sourceType: "retained-official-pdf",
      sourceUrl: "https://buenosaires.gob.ar/licenciasdeconducir/material-de-estudio-para-el-examen-teorico",
      retainedPath: "content/official-documents/originals/gcba-manual-vehiculo-4-ruedas-2023.pdf",
      officialStatusBasis: "Existing retained GCBA manual PDF used by the current Appendix IV inventory for source order, caption mapping, and CABA-specific visual intent.",
      pageCount: 200,
      hashAlgorithm: "sha256",
      ...fileStats("content/official-documents/originals/gcba-manual-vehiculo-4-ruedas-2023.pdf"),
      nativeResolutionNotes:
        "The PDF is the exact row-order source. Prior feature-037 scale-15 probe did not prove additional native detail beyond the retained feature-036 sheet crops for the tested Appendix IV sign.",
      rowUseDecision:
        "Chosen as the exact visual-match source for every sign-like baseline row, but only as a source-limited exception candidate until a better exact official 3x source is found.",
      rowCoverage: {
        signLikeRowsCoveredByExactIntent: baseline.rows.filter((row) => row.entryKind === "catalog-entry" || row.entryKind === "contextual-visual").length,
        sourcePages: Object.keys(baseline.rowsBySourcePage).map((page) => Number(page))
      }
    },
    {
      id: "retained-anexo-l-panels",
      label: "Retained Decreto 779/1995 Anexo L image panels",
      issuer: "Poder Ejecutivo Nacional / Argentina.gob.ar retained archive",
      sourceType: "retained-official-image-panels",
      sourceUrl: "https://www.argentina.gob.ar/normativa/recurso/30389/dto779-1995-anexoL/htm",
      retainedPath: retainedAnexoLPath,
      officialStatusBasis: "Existing retained repository archive of official Anexo L panel images.",
      assetCount: listFiles(retainedAnexoLPath).length,
      assets: assetRecords(listFiles(retainedAnexoLPath)),
      nativeResolutionNotes:
        "Panel images are larger than many current row clips, but they are panel-level national material and do not by themselves prove row-level exact equivalence to each CABA learner-facing row, especially CABA-local variants, plates, arrows, embedded labels, and contextual visuals.",
      rowUseDecision: "Evaluated as official national panels; not selected for final row crops without row-level exact visual proof."
    },
    {
      id: "argentina-anexo-l-html",
      label: "Argentina.gob.ar Decreto 779/1995 Anexo L HTML",
      issuer: "Argentina.gob.ar",
      sourceType: "archived-official-html",
      sourceUrl: "https://www.argentina.gob.ar/normativa/recurso/30389/dto779-1995-anexoL/htm",
      archivedPath: argentinaHtmlPath,
      officialStatusBasis: "Official Argentina.gob.ar Anexo L HTML page archived for source evaluation.",
      hashAlgorithm: "sha256",
      ...fileStats(argentinaHtmlPath),
      embeddedImageUrlCount: argentinaImageUrls.length,
      embeddedImageUrls: argentinaImageUrls,
      nativeResolutionNotes:
        "The HTML gives legal text and panel image references, not a deterministic CABA row-level crop mapping.",
      rowUseDecision: "Evaluated for legal/source coverage; not selected as a direct final crop source."
    },
    {
      id: "argentina-anexo-l-html-images",
      label: "Argentina.gob.ar Anexo L embedded image panels",
      issuer: "Argentina.gob.ar",
      sourceType: "archived-official-image-panels",
      sourceUrl: "https://www.argentina.gob.ar/normativa/recurso/30389/dto779-1995-anexoL/htm",
      archivedPath: argentinaImagesPath,
      officialStatusBasis: "Images referenced by the official Argentina.gob.ar Anexo L HTML and archived locally for evaluation.",
      assetCount: listFiles(argentinaImagesPath).length,
      assets: assetRecords(listFiles(argentinaImagesPath)),
      nativeResolutionNotes:
        "The archived panels are official national source material, but the gate did not establish exact row-level equivalence to all CABA manual rows or 3x effective per-row crop dimensions.",
      rowUseDecision: "Evaluated as official national panels; not selected without row-level exact visual proof."
    },
    {
      id: "argentina-ansv-sign-catalog-pdf",
      label: "ANSV Manual de Senaletica",
      issuer: "Agencia Nacional de Seguridad Vial / Argentina.gob.ar",
      sourceType: "archived-official-pdf",
      sourceUrl: "https://www.argentina.gob.ar/sites/default/files/2022/02/ansv_licencias_manual_senaletica_2.pdf",
      archivedPath: `${archivedSourceRoot}/argentina-gob-ar-ansv-licencias-manual-senaletica-2.pdf`,
      officialStatusBasis: "Official Argentina.gob.ar hosted ANSV sign catalog PDF archived for evaluation.",
      pageCount: 27,
      hashAlgorithm: "sha256",
      ...fileStats(`${archivedSourceRoot}/argentina-gob-ar-ansv-licencias-manual-senaletica-2.pdf`),
      nativeResolutionNotes:
        "Catalog may contain nationally defined sign visuals, but this gate did not establish deterministic row-level exact matches and crop coordinates for CABA Appendix IV entries.",
      rowUseDecision: "Evaluated; not selected without row-level exact visual proof."
    },
    {
      id: "argentina-anexo-art22-archive-pdf",
      label: "Argentina.gob.ar Anexo article 22 archive PDF",
      issuer: "Argentina.gob.ar",
      sourceType: "archived-official-pdf",
      sourceUrl: "https://www.argentina.gob.ar/normativa/30389_dec196-3_pdf/archivo",
      archivedPath: `${archivedSourceRoot}/argentina-gob-ar-decreto-779-1995-anexo-articulo-22-archivo.pdf`,
      officialStatusBasis: "Official Argentina.gob.ar legal archive PDF downloaded for evaluation.",
      pageCount: 70,
      hashAlgorithm: "sha256",
      ...fileStats(`${archivedSourceRoot}/argentina-gob-ar-decreto-779-1995-anexo-articulo-22-archivo.pdf`),
      nativeResolutionNotes:
        "Legal archive source is official but did not produce all-row exact visual matches with CABA learner-facing variants during this gate.",
      rowUseDecision: "Evaluated; not selected without row-level exact visual proof."
    },
    {
      id: "gcba-boletin-anx-58",
      label: "GCBA Boletin Oficial ANX-58",
      issuer: "Gobierno de la Ciudad Autonoma de Buenos Aires",
      sourceType: "official-gcba-pdf-web-verified-archive-unavailable",
      sourceUrl: "https://documentosboletinoficial.buenosaires.gob.ar/publico/PE-RES-MIGC-SSPO-18-25-ANX-58.pdf",
      officialStatusBasis: "Official GCBA Boletin PDF URL opened and page-count verified via web evidence during source evaluation.",
      pageCount: 217,
      archivedPath: null,
      unavailableReason:
        "Repeated local curl attempts stalled at zero transferred bytes and exited with curl (28) timeout/too-slow errors; no local file was retained.",
      nativeResolutionNotes:
        "Potential GCBA local-variant source, but unavailable as a local archived source in this worktree and no exact row-level variant mapping was established.",
      rowUseDecision: "Evaluated as web-verified candidate; not selected."
    },
    {
      id: "gcba-boletin-anx-59",
      label: "GCBA Boletin Oficial ANX-59",
      issuer: "Gobierno de la Ciudad Autonoma de Buenos Aires",
      sourceType: "official-gcba-pdf-web-verified-archive-unavailable",
      sourceUrl: "https://documentosboletinoficial.buenosaires.gob.ar/publico/PE-RES-MIGC-SSPO-18-25-ANX-59.pdf",
      officialStatusBasis: "Official GCBA Boletin PDF URL opened and page-count verified via web evidence during source evaluation.",
      pageCount: 178,
      archivedPath: null,
      unavailableReason:
        "Repeated local curl attempts stalled at zero transferred bytes and exited with curl (28) timeout/too-slow errors; no local file was retained.",
      nativeResolutionNotes:
        "Potential GCBA local-variant source, but unavailable as a local archived source in this worktree and no exact row-level variant mapping was established.",
      rowUseDecision: "Evaluated as web-verified candidate; not selected."
    },
    {
      id: "gcba-pliego-signage-pdf",
      label: "GCBA public pliego/signage PDF candidate",
      issuer: "Gobierno de la Ciudad Autonoma de Buenos Aires",
      sourceType: "archived-official-gcba-pdf",
      sourceUrl: "https://buenosaires.gob.ar/areas/planeamiento_obras/licitations/web/uploads/82c01107e6211ae413694ce564d255a3.pdf",
      archivedPath: `${archivedSourceRoot}/gcba-planeamiento-obras-licitations-82c01107e6211ae413694ce564d255a3.pdf`,
      officialStatusBasis: "Public GCBA-hosted PDF archived for evaluation as a possible local signage variant source.",
      pageCount: 52,
      hashAlgorithm: "sha256",
      ...fileStats(`${archivedSourceRoot}/gcba-planeamiento-obras-licitations-82c01107e6211ae413694ce564d255a3.pdf`),
      nativeResolutionNotes:
        "Official GCBA candidate, but no deterministic exact row-level mapping was established for the CABA manual sign catalog entries.",
      rowUseDecision: "Evaluated; not selected without row-level exact visual proof."
    }
  ];

  return {
    schemaVersion: 1,
    featureId,
    generatedBy,
    generatedAt,
    sourceGateStatus: "blocked-source-limited-threshold-exceeded",
    baselineEvidencePath,
    rowSourceMappingPath,
    archivedSourceRoot,
    evaluatedSourceCount: sources.length,
    mandatorySourceIds: sourceIds,
    sources,
    previousSourceAttemptEvidence: [
      "specs/037-manual-sign-crop-resolution/evidence/source-attempts/source-attempts-summary.json",
      "specs/037-manual-sign-crop-resolution/evidence/source-attempts/page185-no-estacionar-baseline-x5-crop.jpg",
      "specs/037-manual-sign-crop-resolution/evidence/source-attempts/page185-no-estacionar-pdf-scale15-scaled-coordinate-probe.png"
    ]
  };
}

function sourceCandidate(row, sourceId) {
  if (sourceId === "caba-manual-pdf") {
    return {
      sourceId,
      matchStatus: "exact-visual-match-source-limited",
      exactVisualMatch: true,
      canMeetExactThreeX: false,
      sourcePageOrItem: `CABA manual page ${row.sourcePage}, source order ${row.sourceOrder}`,
      effectiveSourceWidth: row.baselineCropNaturalWidth,
      effectiveSourceHeight: row.baselineCropNaturalHeight,
      sourceNativeWidth: row.baselineCropNaturalWidth,
      sourceNativeHeight: row.baselineCropNaturalHeight,
      decision: "chosen-source-limited-exception-candidate",
      rationale:
        "The retained CABA manual is the exact row-order and caption source, but current evidence only proves the same effective source detail as the feature-036 sheet clip; the prior high-scale PDF probe did not establish real 3x native detail."
    };
  }

  if (sourceId === "gcba-boletin-anx-58" || sourceId === "gcba-boletin-anx-59") {
    return {
      sourceId,
      matchStatus: "archive-unavailable-no-row-level-exact-proof",
      exactVisualMatch: false,
      canMeetExactThreeX: null,
      sourcePageOrItem: null,
      effectiveSourceWidth: null,
      effectiveSourceHeight: null,
      sourceNativeWidth: null,
      sourceNativeHeight: null,
      decision: "rejected",
      rationale:
        "Official GCBA PDF URL was web-verified, but local archiving failed with zero-byte curl timeouts and no exact row-level CABA variant mapping was established."
    };
  }

  if (row.entryKind === "contextual-visual") {
    return {
      sourceId,
      matchStatus: "no-contextual-visual-coverage",
      exactVisualMatch: false,
      canMeetExactThreeX: null,
      sourcePageOrItem: null,
      effectiveSourceWidth: null,
      effectiveSourceHeight: null,
      sourceNativeWidth: null,
      sourceNativeHeight: null,
      decision: "rejected",
      rationale:
        "This official source family does not provide a proven exact row-level replacement for the retained learner-facing contextual visual."
    };
  }

  const nationalSourceIds = new Set([
    "retained-anexo-l-panels",
    "argentina-anexo-l-html",
    "argentina-anexo-l-html-images",
    "argentina-ansv-sign-catalog-pdf",
    "argentina-anexo-art22-archive-pdf"
  ]);

  if (nationalSourceIds.has(sourceId)) {
    return {
      sourceId,
      matchStatus: "not-chosen-no-row-level-exact-visual-proof",
      exactVisualMatch: false,
      canMeetExactThreeX: null,
      sourcePageOrItem: null,
      effectiveSourceWidth: null,
      effectiveSourceHeight: null,
      sourceNativeWidth: null,
      sourceNativeHeight: null,
      decision: "rejected",
      rationale:
        "The source is official national material, but the gate did not prove exact visual equivalence for this CABA row, including plates/tablets/arrows/labels/variant meaning, nor deterministic crop coordinates."
    };
  }

  return {
    sourceId,
    matchStatus: "not-chosen-no-row-level-exact-visual-proof",
    exactVisualMatch: false,
    canMeetExactThreeX: null,
    sourcePageOrItem: null,
    effectiveSourceWidth: null,
    effectiveSourceHeight: null,
    sourceNativeWidth: null,
    sourceNativeHeight: null,
    decision: "rejected",
    rationale:
      "The source is official/public, but the gate did not prove exact row-level visual equivalence or usable crop coordinates for this CABA manual row."
  };
}

function makeRowMapping(baseline) {
  const rows = baseline.rows
    .filter((row) => row.entryKind === "catalog-entry" || row.entryKind === "contextual-visual")
    .map((row) => {
      const requiredMinimumWidth = Math.ceil(3 * row.baselineCropNaturalWidth);
      const requiredMinimumHeight = Math.ceil(3 * row.baselineCropNaturalHeight);
      const evaluatedCandidates = sourceIds.map((sourceId) => sourceCandidate(row, sourceId));
      const chosen = evaluatedCandidates.find((candidate) => candidate.sourceId === "caba-manual-pdf");

      return {
        sourceEvaluationId: `source-eval:${row.id}`,
        rowId: row.id,
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
        requiredMinimumWidth,
        requiredMinimumHeight,
        chosenSourceId: "caba-manual-pdf",
        chosenSourceStatus: "source-limited-exception-candidate",
        chosenSourcePageOrItem: chosen.sourcePageOrItem,
        chosenExactVisualMatch: true,
        exactThreeXCandidateFound: false,
        threeXCandidateStatus: "failed-no-exact-official-3x-source-found",
        sourceLimitedExceptionCandidate: true,
        finalCropGenerationAllowed: false,
        effectiveCandidateWidth: row.baselineCropNaturalWidth,
        effectiveCandidateHeight: row.baselineCropNaturalHeight,
        sourceNativeWidth: row.baselineCropNaturalWidth,
        sourceNativeHeight: row.baselineCropNaturalHeight,
        qualityScaleRatioWidth: Number((row.baselineCropNaturalWidth / requiredMinimumWidth).toFixed(6)),
        qualityScaleRatioHeight: Number((row.baselineCropNaturalHeight / requiredMinimumHeight).toFixed(6)),
        sourceLimitedReason:
          "No evaluated official alternate source has proven row-level exact visual equivalence and 3x effective protected-content dimensions. The exact CABA manual source remains source-limited to the feature-036 sheet crop detail currently proven by evidence.",
        evaluatedCandidates
      };
    });

  const bySection = {};
  for (const row of rows) {
    bySection[row.sectionId] ??= {
      totalRows: 0,
      exactThreeXCandidateRows: 0,
      sourceLimitedExceptionCandidateRows: 0,
      maxAllowedSourceLimitedRowsAt20Percent: 0,
      sourceLimitedRatio: 0,
      exceeds20Percent: false
    };
    bySection[row.sectionId].totalRows += 1;
    if (row.exactThreeXCandidateFound) bySection[row.sectionId].exactThreeXCandidateRows += 1;
    if (row.sourceLimitedExceptionCandidate) bySection[row.sectionId].sourceLimitedExceptionCandidateRows += 1;
  }

  for (const section of Object.values(bySection)) {
    section.maxAllowedSourceLimitedRowsAt20Percent = Math.floor(section.totalRows * 0.2);
    section.sourceLimitedRatio = Number((section.sourceLimitedExceptionCandidateRows / section.totalRows).toFixed(6));
    section.exceeds20Percent = section.sourceLimitedRatio > 0.2;
  }

  const exactThreeXCandidateCount = rows.filter((row) => row.exactThreeXCandidateFound).length;
  const sourceLimitedExceptionCandidateCount = rows.filter((row) => row.sourceLimitedExceptionCandidate).length;
  const sectionsExceedingLimit = Object.entries(bySection)
    .filter(([, section]) => section.exceeds20Percent)
    .map(([sectionId, section]) => ({
      sectionId,
      sourceLimitedExceptionCandidateRows: section.sourceLimitedExceptionCandidateRows,
      totalRows: section.totalRows,
      sourceLimitedRatio: section.sourceLimitedRatio,
      maxAllowedSourceLimitedRowsAt20Percent: section.maxAllowedSourceLimitedRowsAt20Percent
    }));

  return {
    schemaVersion: 1,
    featureId,
    generatedBy,
    generatedAt,
    baselineEvidencePath,
    sourceManifestPath,
    rowCoverage: {
      signLikeRows: rows.length,
      catalogEntryRows: rows.filter((row) => row.entryKind === "catalog-entry").length,
      contextualVisualRows: rows.filter((row) => row.entryKind === "contextual-visual").length,
      categoryHeadingRowsExcluded: baseline.rows.filter((row) => row.entryKind === "category-heading").length,
      mandatorySourceIds: sourceIds
    },
    summary: {
      exactThreeXCandidateCount,
      sourceLimitedExceptionCandidateCount,
      totalExceptionLimit: 28,
      totalSignLikeRows: rows.length,
      exceedsTotalExceptionLimit: sourceLimitedExceptionCandidateCount > 28,
      perSectionLimitRatio: 0.2,
      bySection,
      sectionsExceedingLimit,
      gateStatus: "blocked-source-limited-threshold-exceeded",
      requiredAction:
        "Stop before final crop generation and route new Implementation Agent feedback to Architect because source-limited exception candidates exceed both the total and per-section thresholds."
    },
    rows
  };
}

function validateEvidence(sourceManifest, rowMapping) {
  const errors = [];

  if (sourceManifest.evaluatedSourceCount !== sourceIds.length) {
    errors.push(`expected ${sourceIds.length} evaluated sources, found ${sourceManifest.evaluatedSourceCount}`);
  }
  for (const sourceId of sourceIds) {
    if (!sourceManifest.sources.some((source) => source.id === sourceId)) errors.push(`missing source manifest entry ${sourceId}`);
  }
  if (rowMapping.rowCoverage.signLikeRows !== 286) errors.push(`expected 286 sign-like rows, found ${rowMapping.rowCoverage.signLikeRows}`);
  if (rowMapping.rowCoverage.catalogEntryRows !== 283) errors.push(`expected 283 catalog-entry rows, found ${rowMapping.rowCoverage.catalogEntryRows}`);
  if (rowMapping.rowCoverage.contextualVisualRows !== 3) errors.push(`expected 3 contextual-visual rows, found ${rowMapping.rowCoverage.contextualVisualRows}`);
  if (rowMapping.rowCoverage.categoryHeadingRowsExcluded !== 30) {
    errors.push(`expected 30 excluded category-heading rows, found ${rowMapping.rowCoverage.categoryHeadingRowsExcluded}`);
  }

  for (const row of rowMapping.rows) {
    if (row.evaluatedCandidates.length !== sourceIds.length) {
      errors.push(`${row.rowId}: expected ${sourceIds.length} evaluated candidates, found ${row.evaluatedCandidates.length}`);
    }
    for (const sourceId of sourceIds) {
      if (!row.evaluatedCandidates.some((candidate) => candidate.sourceId === sourceId)) {
        errors.push(`${row.rowId}: missing candidate ${sourceId}`);
      }
    }
    if (row.chosenSourceId !== "caba-manual-pdf") errors.push(`${row.rowId}: chosen source must remain the exact CABA manual source`);
    if (row.exactThreeXCandidateFound !== false) errors.push(`${row.rowId}: exact 3x candidate must be false under this gate result`);
    if (row.sourceLimitedExceptionCandidate !== true) errors.push(`${row.rowId}: must be marked source-limited candidate`);
  }

  return errors;
}

function main() {
  const write = process.argv.includes("--write");
  const baseline = readJson(baselineEvidencePath);
  const sourceManifest = makeSourceManifest(baseline);
  const rowMapping = makeRowMapping(baseline);
  const errors = validateEvidence(sourceManifest, rowMapping);

  if (write) {
    mkdirSync(repoPath(sourceEvaluationDir), { recursive: true });
    writeFileSync(repoPath(sourceManifestPath), `${JSON.stringify(sourceManifest, null, 2)}\n`);
    writeFileSync(repoPath(rowSourceMappingPath), `${JSON.stringify(rowMapping, null, 2)}\n`);
  }

  const summary = rowMapping.summary;
  console.log(`manual sign source evaluation ${write ? "wrote" : "checked"} evidence`);
  console.log(`sources: ${sourceManifest.evaluatedSourceCount}`);
  console.log(`mapped sign-like rows: ${rowMapping.rowCoverage.signLikeRows}`);
  console.log(`exact 3x candidate rows: ${summary.exactThreeXCandidateCount}`);
  console.log(`source-limited candidate rows: ${summary.sourceLimitedExceptionCandidateCount}`);
  console.log(`sections over 20% source-limited: ${summary.sectionsExceedingLimit.length}`);
  console.log(`gate status: ${summary.gateStatus}`);

  if (errors.length > 0) {
    for (const error of errors) console.error(`error: ${error}`);
    process.exitCode = 1;
    return;
  }

  if (summary.exceedsTotalExceptionLimit || summary.sectionsExceedingLimit.length > 0) {
    console.error("source evaluation gate blocked final crop generation: source-limited candidates exceed feature-037 thresholds");
    process.exitCode = 2;
  }
}

main();
