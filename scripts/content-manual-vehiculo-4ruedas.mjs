#!/usr/bin/env node
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

export const MANUAL_DOCUMENT_ID = "gcba-manual-vehiculo-4-ruedas-2023";
export const MANUAL_MANIFEST_PATH = `content/manuals/${MANUAL_DOCUMENT_ID}/manual.ru.json`;
export const MANUAL_ASSET_DIRECTORY = `content/assets/manuals/${MANUAL_DOCUMENT_ID}/pages`;
export const EXPECTED_SOURCE = {
  rawOriginalPath: `content/official-documents/originals/${MANUAL_DOCUMENT_ID}.pdf`,
  archiveMarkdownPath: `content/official-documents/documents/${MANUAL_DOCUMENT_ID}.md`,
  rawOriginalSha256: "69c6e1c582db4f96337fc13db09fffab26f9ce6364279c6beb2abc21d9ad3e8e",
  pageCount: 200,
  titleEs: "Manual de conducción vehicular - Categoría B / Automóviles",
  sourceUrl: "https://static.buenosaires.gob.ar/sites/default/files/2024-11/MANUAL_Vehiculo_4Ruedas_2023%20SA.pdf"
};

const defaultRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const SHA256_PATTERN = /^[a-f0-9]{64}$/;
const PLACEHOLDER_PATTERN =
  /(?:^|[^\p{L}\p{N}_])(?:todo|tbd|placeholder|draft|lorem\s+ipsum|чернов\p{L}*|заглушк\p{L}*)(?=$|[^\p{L}\p{N}_])/iu;
const MANUAL_CHUNK_SHARDS = [
  `content/primary-sources/documents/${MANUAL_DOCUMENT_ID}--001-050.ru.json`,
  `content/primary-sources/documents/${MANUAL_DOCUMENT_ID}--051-100.ru.json`,
  `content/primary-sources/documents/${MANUAL_DOCUMENT_ID}--101-150.ru.json`,
  `content/primary-sources/documents/${MANUAL_DOCUMENT_ID}--151-198.ru.json`
];
const MANUAL_QA_SHARDS = [
  `content/primary-sources/qa/${MANUAL_DOCUMENT_ID}--001-050.qa.json`,
  `content/primary-sources/qa/${MANUAL_DOCUMENT_ID}--051-100.qa.json`,
  `content/primary-sources/qa/${MANUAL_DOCUMENT_ID}--101-150.qa.json`,
  `content/primary-sources/qa/${MANUAL_DOCUMENT_ID}--151-198.qa.json`
];
const SUPPLEMENTAL_VISUAL_TEXT = new Map([
  [
    199,
    {
      sourceTextEs:
        "Ilustración de cierre con textos repetidos: Tránsito; Señales; Peatones; Movilidad sustentable.",
      fullTranslationRu:
        "Завершающая иллюстрация с повторяющимися надписями: дорожное движение; знаки; пешеходы; устойчивая мобильность.",
      headingRu: "Завершающая иллюстрация"
    }
  ],
  [
    200,
    {
      sourceTextEs: "Buenos Aires Ciudad.",
      fullTranslationRu: "Город Буэнос-Айрес.",
      headingRu: "Логотип города Буэнос-Айрес"
    }
  ]
]);

function path(root, relativePath) {
  return join(root, relativePath);
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}

function normalizePath(value) {
  return String(value || "").replaceAll("\\", "/");
}

function readJson(root, relativePath) {
  return JSON.parse(readFileSync(path(root, relativePath), "utf8"));
}

function sha256Buffer(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function sha256File(root, relativePath) {
  return sha256Buffer(readFileSync(path(root, relativePath)));
}

function padPageNumber(pageNumber) {
  return String(pageNumber).padStart(3, "0");
}

function assetPathForPage(pageNumber) {
  return `${MANUAL_ASSET_DIRECTORY}/page-${padPageNumber(pageNumber)}.jpg`;
}

function jpegDimensions(buffer) {
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) return undefined;
  let offset = 2;
  while (offset + 9 < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = buffer[offset + 1];
    offset += 2;
    if (marker === 0xd8 || marker === 0xd9) continue;
    if (offset + 2 > buffer.length) return undefined;
    const length = buffer.readUInt16BE(offset);
    if (length < 2 || offset + length > buffer.length) return undefined;
    if (
      (marker >= 0xc0 && marker <= 0xc3) ||
      (marker >= 0xc5 && marker <= 0xc7) ||
      (marker >= 0xc9 && marker <= 0xcb) ||
      (marker >= 0xcd && marker <= 0xcf)
    ) {
      return {
        height: buffer.readUInt16BE(offset + 3),
        width: buffer.readUInt16BE(offset + 5)
      };
    }
    offset += length;
  }
  return undefined;
}

function pageAssetMetadata(root, pageNumber) {
  const localPath = assetPathForPage(pageNumber);
  const absolutePath = path(root, localPath);
  if (!existsSync(absolutePath)) {
    return {
      localPath,
      format: "jpeg",
      width: 0,
      height: 0,
      sha256: ""
    };
  }
  const buffer = readFileSync(absolutePath);
  const dimensions = jpegDimensions(buffer) ?? { width: 0, height: 0 };
  return {
    localPath,
    format: "jpeg",
    width: dimensions.width,
    height: dimensions.height,
    sha256: sha256Buffer(buffer)
  };
}

function extractShardDocument(shard, relativePath, errors) {
  const document = shard.document ?? (Array.isArray(shard.documents) ? shard.documents[0] : undefined);
  if (!isPlainObject(document)) {
    errors.push(`${relativePath}: shard must contain document or documents[0].`);
    return undefined;
  }
  if (document.officialDocumentId !== MANUAL_DOCUMENT_ID) {
    errors.push(`${relativePath}: officialDocumentId must be ${MANUAL_DOCUMENT_ID}.`);
  }
  return document;
}

export function loadManualChunkCorpus(root = defaultRoot) {
  const errors = [];
  const chunks = [];
  const qaRecords = [];
  const chunkShardById = new Map();
  const qaShardById = new Map();

  for (const relativePath of MANUAL_CHUNK_SHARDS) {
    if (!existsSync(path(root, relativePath))) {
      errors.push(`${relativePath}: manual translation shard is missing.`);
      continue;
    }
    const shard = readJson(root, relativePath);
    const document = extractShardDocument(shard, relativePath, errors);
    for (const chunk of document?.chunks ?? []) {
      chunks.push(chunk);
      if (isNonEmptyString(chunk?.chunkId)) chunkShardById.set(chunk.chunkId, relativePath);
    }
  }

  for (const relativePath of MANUAL_QA_SHARDS) {
    if (!existsSync(path(root, relativePath))) {
      errors.push(`${relativePath}: manual QA shard is missing.`);
      continue;
    }
    const shard = readJson(root, relativePath);
    const document = extractShardDocument(shard, relativePath, errors);
    for (const record of document?.chunks ?? []) {
      qaRecords.push(record);
      if (isNonEmptyString(record?.chunkId)) qaShardById.set(record.chunkId, relativePath);
    }
  }

  chunks.sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || String(a.chunkId).localeCompare(String(b.chunkId)));
  return { errors, chunks, qaRecords, chunkShardById, qaShardById };
}

function sourceHeadingRuForChunk(chunk) {
  const label = chunk.officialLabel || String(chunk.order);
  if (label === EXPECTED_SOURCE.titleEs) return "Титульная страница";
  const pageLabel = `Страница ${label}`;
  const translationLines = String(chunk.fullTranslationRu || "")
    .split(/\r?\n/)
    .map((line) => line.replace(/^#+\s*/, "").trim())
    .filter(Boolean);
  const firstContentLine = translationLines.find((line) => !/^\d+$/.test(line));
  if (!firstContentLine) return pageLabel;
  const shortHeading = firstContentLine.length > 92 ? `${firstContentLine.slice(0, 89)}...` : firstContentLine;
  return `${pageLabel}: ${shortHeading}`;
}

function translationEntryForPage(pageNumber, corpus) {
  const chunk = corpus.chunks.find((candidate) => candidate.order === pageNumber);
  const supplemental = SUPPLEMENTAL_VISUAL_TEXT.get(pageNumber);
  if (chunk) {
    const qaRecord = corpus.qaRecords.find((candidate) => candidate.chunkId === chunk.chunkId);
    return {
      status: "reused_primary_source_chunk",
      sourceTextCoverage: "pdf_extracted_visible_text",
      exactCoverage: true,
      sourceTextEs: chunk.originalSpanish,
      fullTranslationRu: chunk.fullTranslationRu,
      headingRu: sourceHeadingRuForChunk(chunk),
      headingPathEs: chunk.headingPath ?? [],
      officialLabel: chunk.officialLabel ?? String(pageNumber),
      chunkProvenance: {
        chunkId: chunk.chunkId,
        order: chunk.order,
        sourceSpan: chunk.sourceSpan,
        sourceTextSha256: chunk.sourceTextSha256,
        sourceFingerprint: chunk.sourceFingerprint,
        shardPath: corpus.chunkShardById.get(chunk.chunkId),
        qaShardPath: corpus.qaShardById.get(chunk.chunkId),
        translationQaStatus: qaRecord?.translationQa?.status,
        translationQaCheckedAt: qaRecord?.translationQa?.checkedAt,
        simplificationQaStatus: qaRecord?.simplificationQa?.status
      }
    };
  }
  if (supplemental) {
    return {
      status: "manual_visual_text",
      sourceTextCoverage: "visual_label_text",
      exactCoverage: true,
      sourceTextEs: supplemental.sourceTextEs,
      fullTranslationRu: supplemental.fullTranslationRu,
      headingRu: supplemental.headingRu,
      headingPathEs: [EXPECTED_SOURCE.titleEs, `PDF page ${pageNumber}`],
      officialLabel: String(pageNumber),
      visualTextTranslationProvenance: {
        featureId: "027-manual-vehiculo-4ruedas-ru",
        method: "manual visual-label transcription from page-faithful render",
        reviewedAt: "2026-05-26"
      }
    };
  }
  return {
    status: "missing",
    sourceTextCoverage: "missing",
    exactCoverage: false,
    sourceTextEs: "",
    fullTranslationRu: "",
    headingRu: `Страница ${pageNumber}`,
    headingPathEs: [EXPECTED_SOURCE.titleEs, `PDF page ${pageNumber}`],
    officialLabel: String(pageNumber)
  };
}

export function buildManualManifest(root = defaultRoot) {
  const corpus = loadManualChunkCorpus(root);
  const pages = Array.from({ length: EXPECTED_SOURCE.pageCount }, (_, index) => {
    const pageNumber = index + 1;
    return {
      pageNumber,
      sourcePageNumber: pageNumber,
      sourceTrace: {
        officialDocumentId: MANUAL_DOCUMENT_ID,
        rawOriginalPath: EXPECTED_SOURCE.rawOriginalPath,
        rawOriginalSha256: EXPECTED_SOURCE.rawOriginalSha256
      },
      visualAsset: pageAssetMetadata(root, pageNumber),
      translation: translationEntryForPage(pageNumber, corpus)
    };
  });

  const reusedApprovedChunkPages = pages.filter((page) => page.translation.status === "reused_primary_source_chunk").length;
  const manualVisualTextPages = pages.filter((page) => page.translation.status === "manual_visual_text").length;

  return {
    schema: "cabadrive-manual-ru.v1",
    version: 1,
    id: `${MANUAL_DOCUMENT_ID}-ru-complete`,
    locale: "ru",
    contentStatus: "unofficial_exact_translation",
    titleRu: "Полное руководство GCBA для транспортных средств категории B",
    titleEs: EXPECTED_SOURCE.titleEs,
    source: {
      officialDocumentId: MANUAL_DOCUMENT_ID,
      rawOriginalPath: EXPECTED_SOURCE.rawOriginalPath,
      rawOriginalSha256: EXPECTED_SOURCE.rawOriginalSha256,
      archiveMarkdownPath: EXPECTED_SOURCE.archiveMarkdownPath,
      sourceUrl: EXPECTED_SOURCE.sourceUrl,
      pageCount: EXPECTED_SOURCE.pageCount
    },
    visualAssetSet: {
      strategy: "page_faithful_pdf_render",
      generator: "scripts/render-manual-pdf-pages.swift",
      generatedFromPdfSha256: EXPECTED_SOURCE.rawOriginalSha256,
      renderScale: 2,
      format: "jpeg",
      compressionQuality: 0.9,
      assetDirectory: MANUAL_ASSET_DIRECTORY
    },
    translationCoverage: {
      strategy: "approved_primary_source_chunks_plus_manual_visual_label_pages",
      requiredPages: EXPECTED_SOURCE.pageCount,
      reusedApprovedChunkPages,
      manualVisualTextPages,
      omittedPages: pages.filter((page) => page.translation.status === "missing").length,
      chunkShardPaths: MANUAL_CHUNK_SHARDS,
      qaShardPaths: MANUAL_QA_SHARDS
    },
    pages
  };
}

async function readPdfPageCount(root, relativePath) {
  const pdfParse = require("pdf-parse/lib/pdf-parse.js");
  const result = await pdfParse(readFileSync(path(root, relativePath)), { max: 1 });
  return result.numpages;
}

function validateRuntimeManualSurface(errors, root) {
  const scannedFiles = ["src/App.tsx", "src/data/manual4Ruedas.ts"];
  const forbiddenPatterns = [
    { pattern: /<\s*iframe\b/iu, label: "iframe PDF/browser viewer" },
    { pattern: /<\s*object\b/iu, label: "object PDF/browser viewer" },
    { pattern: /<\s*embed\b/iu, label: "embed PDF/browser viewer" },
    { pattern: /\bpdfjs\b|\bPDFViewer\b|\bgetDocument\s*\(/u, label: "runtime PDF rendering library" },
    { pattern: /\bfetch\s*\(/u, label: "runtime fetch" },
    { pattern: /https?:\/\/static\.buenosaires\.gob\.ar|https?:\/\/buenosaires\.gob\.ar/iu, label: "remote manual URL in runtime code" }
  ];

  for (const relativePath of scannedFiles) {
    if (!existsSync(path(root, relativePath))) {
      errors.push(`${relativePath}: runtime source file is missing.`);
      continue;
    }
    const text = readFileSync(path(root, relativePath), "utf8");
    for (const { pattern, label } of forbiddenPatterns) {
      if (pattern.test(text)) errors.push(`${relativePath}: manual surface must not use ${label}.`);
    }
  }

  const appSourcePath = "src/App.tsx";
  const appSource = existsSync(path(root, appSourcePath)) ? readFileSync(path(root, appSourcePath), "utf8") : "";
  const topLevelRuntimeManualImport = /^import\s+(?!type\b)[^;]+from\s+["']\.\/data\/manual4Ruedas["'];/mu;
  if (topLevelRuntimeManualImport.test(appSource)) {
    errors.push(`${appSourcePath}: manual corpus must be loaded through the manual view lazy boundary, not a top-level runtime import.`);
  }
  if (!/import\(["']\.\/data\/manual4Ruedas["']\)/u.test(appSource)) {
    errors.push(`${appSourcePath}: manual surface must dynamically import the local manual corpus when the view opens.`);
  }
}

function validateManifestShape(errors, manifest) {
  if (!isPlainObject(manifest)) {
    errors.push("Manual manifest must be an object.");
    return;
  }
  if (manifest.schema !== "cabadrive-manual-ru.v1") errors.push("Manual manifest schema must be cabadrive-manual-ru.v1.");
  if (manifest.id !== `${MANUAL_DOCUMENT_ID}-ru-complete`) errors.push("Manual manifest id is unexpected.");
  if (manifest.locale !== "ru") errors.push("Manual manifest locale must be ru.");
  if (manifest.contentStatus !== "unofficial_exact_translation") {
    errors.push("Manual manifest contentStatus must be unofficial_exact_translation.");
  }
  if (manifest.source?.officialDocumentId !== MANUAL_DOCUMENT_ID) {
    errors.push("Manual manifest source.officialDocumentId is unexpected.");
  }
  if (manifest.source?.rawOriginalPath !== EXPECTED_SOURCE.rawOriginalPath) {
    errors.push("Manual manifest source.rawOriginalPath is unexpected.");
  }
  if (manifest.source?.rawOriginalSha256 !== EXPECTED_SOURCE.rawOriginalSha256) {
    errors.push("Manual manifest source.rawOriginalSha256 is unexpected.");
  }
  if (manifest.source?.pageCount !== EXPECTED_SOURCE.pageCount) {
    errors.push(`Manual manifest source.pageCount must be ${EXPECTED_SOURCE.pageCount}.`);
  }
  if (manifest.visualAssetSet?.strategy !== "page_faithful_pdf_render") {
    errors.push("Manual visualAssetSet.strategy must be page_faithful_pdf_render.");
  }
  if (manifest.visualAssetSet?.generatedFromPdfSha256 !== EXPECTED_SOURCE.rawOriginalSha256) {
    errors.push("Manual visual asset generation source hash does not match canonical PDF.");
  }
  if (!Array.isArray(manifest.pages)) errors.push("Manual manifest pages must be an array.");
}

export async function validateManualVehiculo4RuedasRu({ root = defaultRoot, manifest } = {}) {
  const errors = [];
  const loadedManifest = manifest ?? (existsSync(path(root, MANUAL_MANIFEST_PATH)) ? readJson(root, MANUAL_MANIFEST_PATH) : undefined);
  const corpus = loadManualChunkCorpus(root);
  errors.push(...corpus.errors);
  validateManifestShape(errors, loadedManifest);

  const rawPdfExists = existsSync(path(root, EXPECTED_SOURCE.rawOriginalPath));
  if (!rawPdfExists) {
    errors.push(`${EXPECTED_SOURCE.rawOriginalPath}: canonical PDF is missing.`);
  } else {
    const rawPdfSha256 = sha256File(root, EXPECTED_SOURCE.rawOriginalPath);
    if (rawPdfSha256 !== EXPECTED_SOURCE.rawOriginalSha256) {
      errors.push(`${EXPECTED_SOURCE.rawOriginalPath}: canonical PDF hash mismatch.`);
    }
    try {
      const pageCount = await readPdfPageCount(root, EXPECTED_SOURCE.rawOriginalPath);
      if (pageCount !== EXPECTED_SOURCE.pageCount) {
        errors.push(`${EXPECTED_SOURCE.rawOriginalPath}: expected ${EXPECTED_SOURCE.pageCount} pages, found ${pageCount}.`);
      }
    } catch (error) {
      errors.push(`${EXPECTED_SOURCE.rawOriginalPath}: could not read PDF page count: ${error.message}`);
    }
  }

  const pages = Array.isArray(loadedManifest?.pages) ? loadedManifest.pages : [];
  if (pages.length !== EXPECTED_SOURCE.pageCount) {
    errors.push(`Manual manifest must contain ${EXPECTED_SOURCE.pageCount} page entries, found ${pages.length}.`);
  }

  const chunksByOrder = new Map(corpus.chunks.map((chunk) => [chunk.order, chunk]));
  const qaByChunkId = new Map(corpus.qaRecords.map((record) => [record.chunkId, record]));
  let reusedApprovedChunkPages = 0;
  let manualVisualTextPages = 0;
  let localVisualAssets = 0;

  for (let index = 0; index < EXPECTED_SOURCE.pageCount; index += 1) {
    const expectedPageNumber = index + 1;
    const page = pages[index];
    if (!isPlainObject(page)) {
      errors.push(`Manual page ${expectedPageNumber}: entry must be an object.`);
      continue;
    }
    if (page.pageNumber !== expectedPageNumber) errors.push(`Manual page ${expectedPageNumber}: pageNumber is out of order.`);
    if (page.sourcePageNumber !== expectedPageNumber) errors.push(`Manual page ${expectedPageNumber}: sourcePageNumber must match source page.`);
    if (page.sourceTrace?.officialDocumentId !== MANUAL_DOCUMENT_ID) {
      errors.push(`Manual page ${expectedPageNumber}: sourceTrace.officialDocumentId is unexpected.`);
    }

    const asset = page.visualAsset;
    const expectedAssetPath = assetPathForPage(expectedPageNumber);
    if (!isPlainObject(asset)) {
      errors.push(`Manual page ${expectedPageNumber}: visualAsset must be an object.`);
    } else {
      const normalizedPath = normalizePath(asset.localPath);
      if (normalizedPath !== expectedAssetPath) errors.push(`Manual page ${expectedPageNumber}: visualAsset.localPath must be ${expectedAssetPath}.`);
      if (/^https?:\/\//iu.test(normalizedPath)) errors.push(`Manual page ${expectedPageNumber}: visualAsset.localPath must be local.`);
      if (/\.pdf(?:$|[?#])/iu.test(normalizedPath)) errors.push(`Manual page ${expectedPageNumber}: visualAsset.localPath must not be a PDF.`);
      if (asset.format !== "jpeg") errors.push(`Manual page ${expectedPageNumber}: visualAsset.format must be jpeg.`);
      if (!existsSync(path(root, expectedAssetPath))) {
        errors.push(`${expectedAssetPath}: visual asset missing.`);
      } else {
        localVisualAssets += 1;
        const buffer = readFileSync(path(root, expectedAssetPath));
        const dimensions = jpegDimensions(buffer);
        const actualSha256 = sha256Buffer(buffer);
        if (!dimensions) {
          errors.push(`${expectedAssetPath}: could not read JPEG dimensions.`);
        } else {
          if (asset.width !== dimensions.width) errors.push(`${expectedAssetPath}: width mismatch.`);
          if (asset.height !== dimensions.height) errors.push(`${expectedAssetPath}: height mismatch.`);
          if (asset.width < 1000 || asset.height < 1400) {
            errors.push(`${expectedAssetPath}: rendered dimensions are too small for page-faithful study.`);
          }
        }
        if (asset.sha256 !== actualSha256) errors.push(`${expectedAssetPath}: sha256 mismatch.`);
        if (!SHA256_PATTERN.test(asset.sha256 || "")) errors.push(`${expectedAssetPath}: sha256 must be a lowercase SHA-256 hash.`);
      }
    }

    const translation = page.translation;
    if (!isPlainObject(translation)) {
      errors.push(`Manual page ${expectedPageNumber}: translation must be an object.`);
      continue;
    }
    if (!translation.exactCoverage) errors.push(`Manual page ${expectedPageNumber}: translation.exactCoverage must be true.`);
    if (!isNonEmptyString(translation.fullTranslationRu)) errors.push(`Manual page ${expectedPageNumber}: fullTranslationRu is missing.`);
    if (!isNonEmptyString(translation.sourceTextEs)) errors.push(`Manual page ${expectedPageNumber}: sourceTextEs is missing.`);
    if (PLACEHOLDER_PATTERN.test(translation.fullTranslationRu || "")) {
      errors.push(`Manual page ${expectedPageNumber}: fullTranslationRu must not contain placeholder text.`);
    }

    if (translation.status === "reused_primary_source_chunk") {
      reusedApprovedChunkPages += 1;
      const chunk = chunksByOrder.get(expectedPageNumber);
      const provenance = translation.chunkProvenance;
      const qaRecord = provenance?.chunkId ? qaByChunkId.get(provenance.chunkId) : undefined;
      if (!chunk) errors.push(`Manual page ${expectedPageNumber}: reused chunk with order ${expectedPageNumber} is missing.`);
      if (expectedPageNumber > 198) errors.push(`Manual page ${expectedPageNumber}: only pages 1-198 may reuse approved primary-source chunks.`);
      if (chunk && provenance?.chunkId !== chunk.chunkId) errors.push(`Manual page ${expectedPageNumber}: chunk provenance id mismatch.`);
      if (chunk && translation.fullTranslationRu !== chunk.fullTranslationRu) {
        errors.push(`Manual page ${expectedPageNumber}: reused fullTranslationRu must match the approved chunk exactly.`);
      }
      if (chunk && translation.sourceTextEs !== chunk.originalSpanish) {
        errors.push(`Manual page ${expectedPageNumber}: reused sourceTextEs must match the approved chunk exactly.`);
      }
      if (qaRecord?.translationQa?.status !== "approved") {
        errors.push(`Manual page ${expectedPageNumber}: reused chunk translation QA must be approved.`);
      }
      if (qaRecord?.simplificationQa?.status !== "approved") {
        errors.push(`Manual page ${expectedPageNumber}: reused chunk simplification QA must be approved.`);
      }
      if (!isNonEmptyString(provenance?.shardPath) || !MANUAL_CHUNK_SHARDS.includes(provenance.shardPath)) {
        errors.push(`Manual page ${expectedPageNumber}: reused chunk shard provenance is missing or unexpected.`);
      }
      if (!isNonEmptyString(provenance?.qaShardPath) || !MANUAL_QA_SHARDS.includes(provenance.qaShardPath)) {
        errors.push(`Manual page ${expectedPageNumber}: reused chunk QA shard provenance is missing or unexpected.`);
      }
    } else if (translation.status === "manual_visual_text") {
      manualVisualTextPages += 1;
      if (!SUPPLEMENTAL_VISUAL_TEXT.has(expectedPageNumber)) {
        errors.push(`Manual page ${expectedPageNumber}: manual visual-text translation is only allowed for final visual-only pages.`);
      }
      if (translation.sourceTextCoverage !== "visual_label_text") {
        errors.push(`Manual page ${expectedPageNumber}: manual visual-text pages must use sourceTextCoverage visual_label_text.`);
      }
      if (translation.visualTextTranslationProvenance?.featureId !== "027-manual-vehiculo-4ruedas-ru") {
        errors.push(`Manual page ${expectedPageNumber}: manual visual-text provenance must reference feature 027.`);
      }
    } else {
      errors.push(`Manual page ${expectedPageNumber}: unsupported translation status ${translation.status}.`);
    }
  }

  if (reusedApprovedChunkPages !== 198) errors.push(`Manual translation reuse must cover 198 approved chunk pages, found ${reusedApprovedChunkPages}.`);
  if (manualVisualTextPages !== 2) errors.push(`Manual visual-label translations must cover 2 final pages, found ${manualVisualTextPages}.`);
  if (loadedManifest?.translationCoverage?.omittedPages !== 0) errors.push("Manual translationCoverage.omittedPages must be 0.");
  if (loadedManifest?.translationCoverage?.requiredPages !== EXPECTED_SOURCE.pageCount) {
    errors.push(`Manual translationCoverage.requiredPages must be ${EXPECTED_SOURCE.pageCount}.`);
  }
  if (loadedManifest?.translationCoverage?.reusedApprovedChunkPages !== reusedApprovedChunkPages) {
    errors.push("Manual translationCoverage.reusedApprovedChunkPages is stale.");
  }
  if (loadedManifest?.translationCoverage?.manualVisualTextPages !== manualVisualTextPages) {
    errors.push("Manual translationCoverage.manualVisualTextPages is stale.");
  }

  validateRuntimeManualSurface(errors, root);

  return {
    errors,
    summary: {
      pages: pages.length,
      sourcePdfPages: EXPECTED_SOURCE.pageCount,
      reusedApprovedChunkPages,
      manualVisualTextPages,
      localVisualAssets,
      assetDirectory: MANUAL_ASSET_DIRECTORY
    }
  };
}

export function formatManualValidationSummary(summary) {
  return `Manual 4 ruedas RU validated: ${summary.pages}/${summary.sourcePdfPages} pages, ${summary.localVisualAssets} local page assets, ${summary.reusedApprovedChunkPages} approved reused translations, ${summary.manualVisualTextPages} visual-label translation pages.`;
}

async function main() {
  const writeManifest = process.argv.includes("--write-manifest");
  if (writeManifest) {
    const manifest = buildManualManifest(defaultRoot);
    const targetPath = path(defaultRoot, MANUAL_MANIFEST_PATH);
    mkdirSync(dirname(targetPath), { recursive: true });
    writeFileSync(targetPath, `${JSON.stringify(manifest, null, 2)}\n`);
    console.log(`Wrote ${MANUAL_MANIFEST_PATH}`);
  }

  const validation = await validateManualVehiculo4RuedasRu({ root: defaultRoot });
  if (validation.errors.length) {
    console.error("Manual 4 ruedas RU validation failed:");
    for (const error of validation.errors) console.error(`- ${error}`);
    process.exit(1);
  }
  console.log(formatManualValidationSummary(validation.summary));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await main();
}
