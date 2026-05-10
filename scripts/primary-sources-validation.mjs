import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SHA256_PATTERN = /^[a-f0-9]{64}$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const QA_STATUSES = new Set(["draft", "reviewed", "approved"]);
const STRICT_MODES = new Set(["strict", "final", "release"]);
const CURRENT_USABLE_STATUSES = new Set(["current", "in_force", "currently_valid", "valid_current_material"]);
const FORBIDDEN_SPANISH_SIMPLIFICATION_PATHS = [
  "simplified-spanish",
  "simple-spanish",
  "simplified-es",
  "simple-es",
  "spanish-simplification",
  "es-simple"
];
const RUSSIAN_TEXT_PATH_KEYS = new Set([
  "translationPath",
  "translationRuPath",
  "fullTranslationRuPath",
  "simpleRuPath",
  "simplificationPath",
  "simplificationRuPath",
  "learnerContentPath",
  "learnerRussianPath"
]);
const PLACEHOLDER_PATTERN =
  /(?:^|[^\p{L}\p{N}_])(?:todo|tbd|placeholder|draft(?:\s|-)+placeholder|lorem\s+ipsum|чернов\p{L}*\s+подготовительн\p{L}*|заглушк\p{L}*)(?=$|[^\p{L}\p{N}_])/iu;

const defaultRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}

function normalizeIdentifier(value) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function isForbiddenSpanishSimplificationKey(value) {
  const normalized = normalizeIdentifier(value);
  if (!normalized) return false;
  const hasSpanishMarker = normalized.includes("spanish") || normalized.includes("es");
  const hasSimplificationMarker =
    normalized.includes("simplified") ||
    normalized.includes("simple") ||
    normalized.includes("simplification") ||
    normalized.includes("simplificacion");
  return hasSpanishMarker && hasSimplificationMarker;
}

function isForbiddenSpanishSimplificationPath(value) {
  const normalized = normalizePath(value).toLowerCase();
  return (
    FORBIDDEN_SPANISH_SIMPLIFICATION_PATHS.some((fragment) => normalized.includes(fragment)) ||
    isForbiddenSpanishSimplificationKey(normalized)
  );
}

function normalizePath(value) {
  return String(value || "").replaceAll("\\", "/");
}

function isInsidePath(value, sectionPath) {
  if (!isNonEmptyString(value)) return false;
  const normalized = normalizePath(value);
  if (normalized.startsWith("/") || /^[a-zA-Z]:\//.test(normalized)) return false;
  const segments = normalized.split("/").filter(Boolean);
  if (segments.includes("..")) return false;
  const normalizedSection = normalizePath(sectionPath).replace(/\/+$/, "");
  return normalized === normalizedSection || normalized.startsWith(`${normalizedSection}/`);
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function requireObject(errors, value, label) {
  if (!isPlainObject(value)) errors.push(`${label} must be an object.`);
  return isPlainObject(value);
}

function requireArray(errors, value, label) {
  if (!Array.isArray(value)) errors.push(`${label} must be an array.`);
  return Array.isArray(value);
}

function requireString(errors, value, label) {
  if (!isNonEmptyString(value)) errors.push(`${label} must be a non-empty string.`);
}

function readArchiveText(root, archiveFiles, relativePath) {
  if (!isNonEmptyString(relativePath)) return undefined;
  if (archiveFiles instanceof Map && archiveFiles.has(relativePath)) return archiveFiles.get(relativePath);
  if (isPlainObject(archiveFiles) && Object.hasOwn(archiveFiles, relativePath)) return archiveFiles[relativePath];
  const absolutePath = join(root, relativePath);
  if (!existsSync(absolutePath)) return undefined;
  return readFileSync(absolutePath, "utf8");
}

function sourceSpanText(text, sourceSpan) {
  if (!isPlainObject(sourceSpan)) return undefined;
  const startLine = sourceSpan.startLine;
  const endLine = sourceSpan.endLine;
  if (!Number.isInteger(startLine) || !Number.isInteger(endLine) || startLine < 1 || endLine < startLine) {
    return undefined;
  }
  const lines = text.split(/\r?\n/);
  if (endLine > lines.length) return undefined;
  return lines.slice(startLine - 1, endLine).join("\n");
}

function sourceLines(text) {
  const lines = text.split(/\r?\n/);
  if (lines.length > 1 && lines.at(-1) === "") lines.pop();
  return lines;
}

function isValidSourceSpan(value) {
  return (
    isPlainObject(value) &&
    Number.isInteger(value.startLine) &&
    Number.isInteger(value.endLine) &&
    value.startLine >= 1 &&
    value.endLine >= value.startLine
  );
}

function validateContiguousSourceSpanCoverage(errors, { documentId, chunks, archiveText }) {
  const archiveLineCount = sourceLines(archiveText).length;
  const spans = [];
  for (const chunk of asArray(chunks)) {
    if (!isValidSourceSpan(chunk?.sourceSpan)) return;
    spans.push({
      chunkId: labelFor(chunk.chunkId, `${documentId}.coverageChunk`),
      startLine: chunk.sourceSpan.startLine,
      endLine: chunk.sourceSpan.endLine
    });
  }
  if (spans.length === 0) return;

  spans.sort((a, b) => a.startLine - b.startLine || a.endLine - b.endLine || a.chunkId.localeCompare(b.chunkId));
  let expectedStartLine = 1;
  for (const span of spans) {
    if (span.startLine !== expectedStartLine) {
      errors.push(
        `${documentId}: sourceSpan coverage must be contiguous; expected line ${expectedStartLine} but ${span.chunkId} starts at line ${span.startLine}.`
      );
      return;
    }
    expectedStartLine = span.endLine + 1;
  }
  if (expectedStartLine !== archiveLineCount + 1) {
    errors.push(
      `${documentId}: sourceSpan coverage must include all archive lines; covered through line ${expectedStartLine - 1} of ${archiveLineCount}.`
    );
  }
}

function validateNoForbiddenSpanishSimplification(errors, value, path = "primary sources") {
  if (Array.isArray(value)) {
    value.forEach((item, index) => validateNoForbiddenSpanishSimplification(errors, item, `${path}[${index}]`));
    return;
  }
  if (!isPlainObject(value)) return;
  for (const [key, nested] of Object.entries(value)) {
    if (isForbiddenSpanishSimplificationKey(key)) {
      errors.push(`${path}.${key} is forbidden; simplified Spanish is out of scope.`);
    }
    if (isNonEmptyString(nested) && key.toLowerCase().includes("path") && isForbiddenSpanishSimplificationPath(nested)) {
      errors.push(`${path}.${key} points to forbidden simplified Spanish content.`);
    }
    validateNoForbiddenSpanishSimplification(errors, nested, `${path}.${key}`);
  }
}

function validateLearnerRussianPaths(errors, value, path = "primary sources") {
  if (Array.isArray(value)) {
    value.forEach((item, index) => validateLearnerRussianPaths(errors, item, `${path}[${index}]`));
    return;
  }
  if (!isPlainObject(value)) return;
  for (const [key, nested] of Object.entries(value)) {
    if (RUSSIAN_TEXT_PATH_KEYS.has(key) && isInsidePath(nested, "content/official-documents")) {
      errors.push(`${path}.${key} must not store learner Russian content under content/official-documents.`);
    }
    validateLearnerRussianPaths(errors, nested, `${path}.${key}`);
  }
}

function labelFor(value, fallback) {
  return isNonEmptyString(value) ? value : fallback;
}

function validateQaRecord(errors, record, label, { strictMode }) {
  if (!requireObject(errors, record, label)) return;
  requireString(errors, record.status, `${label}.status`);
  if (isNonEmptyString(record.status) && !QA_STATUSES.has(record.status)) {
    errors.push(`${label}.status must be draft, reviewed, or approved.`);
  }
  requireString(errors, record.methodNotes, `${label}.methodNotes`);
  const requiresCheckedAt = strictMode || ["reviewed", "approved"].includes(record.status);
  if (requiresCheckedAt && !DATE_PATTERN.test(record.checkedAt || "")) {
    errors.push(`${label}.checkedAt must be YYYY-MM-DD when QA is reviewed, approved, or running strict mode.`);
  } else if (isNonEmptyString(record.checkedAt) && !DATE_PATTERN.test(record.checkedAt)) {
    errors.push(`${label}.checkedAt must be YYYY-MM-DD.`);
  }
  if (strictMode && record.status !== "approved") {
    errors.push(`${label}.status must be approved in strict mode.`);
  }
}

function validateRussianField(errors, value, label, { strictMode }) {
  if (!isNonEmptyString(value)) {
    if (strictMode) errors.push(`${label} must be a non-empty string in strict mode.`);
    return;
  }
  if (strictMode && PLACEHOLDER_PATTERN.test(value)) {
    errors.push(`${label} must not be placeholder or draft text in strict mode.`);
  }
}

function validateManifestReleaseReadiness(errors, entry, label) {
  const currentness = entry.currentness;
  if (!isPlainObject(currentness)) {
    errors.push(`${label}.currentness must be an object for strict primary-source validation.`);
  } else {
    if (!CURRENT_USABLE_STATUSES.has(currentness.status)) {
      errors.push(`${label}.currentness.status must be release-ready for strict primary-source validation.`);
    }
    if (currentness.validationStatus !== "passed") {
      errors.push(`${label}.currentness.validationStatus must be passed for strict primary-source validation.`);
    }
  }

  const exactTextValidation = entry.exactTextValidation;
  if (!isPlainObject(exactTextValidation)) {
    errors.push(`${label}.exactTextValidation must be an object for strict primary-source validation.`);
  } else if (exactTextValidation.status !== "passed") {
    errors.push(`${label}.exactTextValidation.status must be passed for strict primary-source validation.`);
  }
}

export function validatePrimarySources({
  manifest,
  corpus,
  coverage,
  qa,
  searchIndex,
  mode = "draft",
  root = defaultRoot,
  archiveFiles,
  learnerContentPaths = []
} = {}) {
  const errors = [];
  const strictMode = STRICT_MODES.has(mode);

  if (!requireObject(errors, manifest, "official documents manifest")) return errors;
  if (!requireArray(errors, manifest.entries, "official documents manifest entries")) return errors;
  requireObject(errors, corpus, "primary sources corpus");
  requireObject(errors, coverage, "primary sources coverage");
  requireObject(errors, qa, "primary sources QA");
  requireObject(errors, searchIndex, "primary sources search index");

  if (corpus?.schema !== "primary-sources-learner-corpus.v1") {
    errors.push("primary sources corpus schema must be primary-sources-learner-corpus.v1.");
  }
  if (corpus?.sectionPath !== "content/primary-sources") {
    errors.push("primary sources corpus sectionPath must be content/primary-sources.");
  }
  if (corpus?.locale !== "ru") errors.push("primary sources corpus locale must be ru.");
  if (isInsidePath(corpus?.sectionPath, "content/official-documents")) {
    errors.push("primary sources corpus sectionPath must not be under content/official-documents.");
  }
  for (const learnerPath of learnerContentPaths) {
    if (isInsidePath(learnerPath, "content/official-documents")) {
      errors.push(`${learnerPath} must not store learner Russian content under content/official-documents.`);
    }
  }
  validateLearnerRussianPaths(errors, corpus, "primary sources corpus");
  validateLearnerRussianPaths(errors, qa, "primary sources QA");
  validateNoForbiddenSpanishSimplification(errors, corpus, "primary sources corpus");
  validateNoForbiddenSpanishSimplification(errors, coverage, "primary sources coverage");
  validateNoForbiddenSpanishSimplification(errors, qa, "primary sources QA");
  validateNoForbiddenSpanishSimplification(errors, searchIndex, "primary sources search index");

  const manifestEntryById = new Map();
  const manifestIds = [];
  for (const entry of asArray(manifest.entries)) {
    if (!isPlainObject(entry) || !isNonEmptyString(entry.id)) continue;
    if (manifestEntryById.has(entry.id)) errors.push(`${entry.id}: duplicate official document id in manifest.`);
    manifestEntryById.set(entry.id, entry);
    manifestIds.push(entry.id);
    if (strictMode) validateManifestReleaseReadiness(errors, entry, entry.id);
  }

  const corpusDocumentById = new Map();
  const corpusChunksById = new Map();
  for (const document of asArray(corpus?.documents)) {
    if (!isPlainObject(document)) {
      errors.push("primary sources corpus document must be an object.");
      continue;
    }
    const documentId = labelFor(document.officialDocumentId, "primary sources corpus document");
    requireString(errors, document.officialDocumentId, `${documentId}.officialDocumentId`);
    if (corpusDocumentById.has(document.officialDocumentId)) {
      errors.push(`${document.officialDocumentId}: duplicate primary sources corpus document.`);
    }
    if (isNonEmptyString(document.officialDocumentId)) corpusDocumentById.set(document.officialDocumentId, document);
    if (isNonEmptyString(document.officialDocumentId) && !manifestEntryById.has(document.officialDocumentId)) {
      errors.push(`${document.officialDocumentId}: learner document is not present in official manifest.`);
    }
    requireString(errors, document.title, `${documentId}.title`);
    requireString(errors, document.shortTitleRu, `${documentId}.shortTitleRu`);
    requireString(errors, document.category, `${documentId}.category`);
    requireString(errors, document.jurisdiction, `${documentId}.jurisdiction`);
    requireString(errors, document.officialSourceType, `${documentId}.officialSourceType`);
    requireString(errors, document.archiveLocalPath, `${documentId}.archiveLocalPath`);
    requireArray(errors, document.chunks, `${documentId}.chunks`);
    if (strictMode && Array.isArray(document.chunks) && document.chunks.length === 0) {
      errors.push(`${documentId}.chunks must include at least one learner chunk in strict mode.`);
    }

    const manifestEntry = manifestEntryById.get(document.officialDocumentId);
    if (manifestEntry) {
      if (document.archiveLocalPath !== manifestEntry.localPath) {
        errors.push(`${documentId}.archiveLocalPath must match official manifest localPath.`);
      }
      if (document.title !== manifestEntry.title) errors.push(`${documentId}.title must match official manifest title.`);
      if (document.officialSourceType !== manifestEntry.officialSourceType) {
        errors.push(`${documentId}.officialSourceType must match official manifest officialSourceType.`);
      }
    }

    for (const chunk of asArray(document.chunks)) {
      if (!isPlainObject(chunk)) {
        errors.push(`${documentId}.chunks entry must be an object.`);
        continue;
      }
      const chunkId = labelFor(chunk.chunkId, `${documentId}.chunk`);
      requireString(errors, chunk.chunkId, `${chunkId}.chunkId`);
      requireString(errors, chunk.officialDocumentId, `${chunkId}.officialDocumentId`);
      if (chunk.officialDocumentId !== document.officialDocumentId) {
        errors.push(`${chunkId}.officialDocumentId must match parent document.`);
      }
      if (!Number.isInteger(chunk.order) || chunk.order < 1) errors.push(`${chunkId}.order must be a positive integer.`);
      if (!Array.isArray(chunk.headingPath) || chunk.headingPath.some((heading) => !isNonEmptyString(heading))) {
        errors.push(`${chunkId}.headingPath must be an array of non-empty strings.`);
      }
      requireString(errors, chunk.sourceFingerprint, `${chunkId}.sourceFingerprint`);
      requireString(errors, chunk.originalSpanish, `${chunkId}.originalSpanish`);
      validateRussianField(errors, chunk.fullTranslationRu, `${chunkId}.fullTranslationRu`, { strictMode });
      validateRussianField(errors, chunk.simpleRu, `${chunkId}.simpleRu`, { strictMode });
      if (corpusChunksById.has(chunk.chunkId)) errors.push(`${chunk.chunkId}: duplicate primary sources corpus chunk.`);
      if (isNonEmptyString(chunk.chunkId)) corpusChunksById.set(chunk.chunkId, chunk);
    }
  }

  const coverageDocumentById = new Map();
  const coverageChunksById = new Map();
  for (const document of asArray(coverage?.documents)) {
    if (!isPlainObject(document)) {
      errors.push("primary sources coverage document must be an object.");
      continue;
    }
    const documentId = labelFor(document.officialDocumentId, "primary sources coverage document");
    requireString(errors, document.officialDocumentId, `${documentId}.officialDocumentId`);
    if (coverageDocumentById.has(document.officialDocumentId)) {
      errors.push(`${document.officialDocumentId}: duplicate primary sources coverage document.`);
    }
    if (isNonEmptyString(document.officialDocumentId)) coverageDocumentById.set(document.officialDocumentId, document);
    if (isNonEmptyString(document.officialDocumentId) && !manifestEntryById.has(document.officialDocumentId)) {
      errors.push(`${document.officialDocumentId}: coverage document is not present in official manifest.`);
    }
    requireString(errors, document.archiveLocalPath, `${documentId}.archiveLocalPath`);
    requireString(errors, document.archiveSha256, `${documentId}.archiveSha256`);
    if (isNonEmptyString(document.archiveSha256) && !SHA256_PATTERN.test(document.archiveSha256)) {
      errors.push(`${documentId}.archiveSha256 must be a 64-character lowercase sha256 hex digest.`);
    }
    requireArray(errors, document.expectedChunkIds, `${documentId}.expectedChunkIds`);
    requireArray(errors, document.chunks, `${documentId}.chunks`);
    if (strictMode && Array.isArray(document.expectedChunkIds) && document.expectedChunkIds.length === 0) {
      errors.push(`${documentId}.expectedChunkIds must include at least one expected chunk ID in strict mode.`);
    }
    if (strictMode && Array.isArray(document.chunks) && document.chunks.length === 0) {
      errors.push(`${documentId}.chunks must include at least one generated coverage chunk in strict mode.`);
    }

    const manifestEntry = manifestEntryById.get(document.officialDocumentId);
    if (manifestEntry && document.archiveLocalPath !== manifestEntry.localPath) {
      errors.push(`${documentId}.archiveLocalPath must match official manifest localPath.`);
    }
    const archiveText = readArchiveText(root, archiveFiles, document.archiveLocalPath);
    if (archiveText === undefined) {
      errors.push(`${documentId}.archiveLocalPath is missing from archive files.`);
    } else if (SHA256_PATTERN.test(document.archiveSha256 || "") && sha256(archiveText) !== document.archiveSha256) {
      errors.push(`${documentId}.archiveSha256 must match current archive Markdown.`);
    }

    const chunkIdsInDocument = new Set();
    for (const chunk of asArray(document.chunks)) {
      if (!isPlainObject(chunk)) {
        errors.push(`${documentId}.chunks entry must be an object.`);
        continue;
      }
      const chunkId = labelFor(chunk.chunkId, `${documentId}.coverageChunk`);
      requireString(errors, chunk.chunkId, `${chunkId}.chunkId`);
      requireString(errors, chunk.officialDocumentId, `${chunkId}.officialDocumentId`);
      if (chunk.officialDocumentId !== document.officialDocumentId) {
        errors.push(`${chunkId}.officialDocumentId must match parent coverage document.`);
      }
      if (!Number.isInteger(chunk.order) || chunk.order < 1) errors.push(`${chunkId}.order must be a positive integer.`);
      if (!Array.isArray(chunk.headingPath) || chunk.headingPath.some((heading) => !isNonEmptyString(heading))) {
        errors.push(`${chunkId}.headingPath must be an array of non-empty strings.`);
      }
      if (!isPlainObject(chunk.sourceSpan)) {
        errors.push(`${chunkId}.sourceSpan must be an object.`);
      } else if (
        !Number.isInteger(chunk.sourceSpan.startLine) ||
        !Number.isInteger(chunk.sourceSpan.endLine) ||
        chunk.sourceSpan.startLine < 1 ||
        chunk.sourceSpan.endLine < chunk.sourceSpan.startLine
      ) {
        errors.push(`${chunkId}.sourceSpan must include valid startLine and endLine.`);
      }
      requireString(errors, chunk.sourceTextSha256, `${chunkId}.sourceTextSha256`);
      if (isNonEmptyString(chunk.sourceTextSha256) && !SHA256_PATTERN.test(chunk.sourceTextSha256)) {
        errors.push(`${chunkId}.sourceTextSha256 must be a 64-character lowercase sha256 hex digest.`);
      }
      requireString(errors, chunk.sourceFingerprint, `${chunkId}.sourceFingerprint`);
      if (isNonEmptyString(chunk.sourceTextSha256) && chunk.sourceFingerprint !== `sha256:${chunk.sourceTextSha256}`) {
        errors.push(`${chunkId}.sourceFingerprint must match sourceTextSha256.`);
      }
      if (chunkIdsInDocument.has(chunk.chunkId)) errors.push(`${chunk.chunkId}: duplicate coverage chunk in ${documentId}.`);
      chunkIdsInDocument.add(chunk.chunkId);
      if (coverageChunksById.has(chunk.chunkId)) errors.push(`${chunk.chunkId}: duplicate primary sources coverage chunk.`);
      if (isNonEmptyString(chunk.chunkId)) coverageChunksById.set(chunk.chunkId, { ...chunk, archiveLocalPath: document.archiveLocalPath });

      if (archiveText !== undefined && isPlainObject(chunk.sourceSpan)) {
        const text = sourceSpanText(archiveText, chunk.sourceSpan);
        if (text === undefined) {
          errors.push(`${chunkId}.sourceSpan does not map to current archive Markdown lines.`);
        } else if (SHA256_PATTERN.test(chunk.sourceTextSha256 || "") && sha256(text) !== chunk.sourceTextSha256) {
          errors.push(`${chunkId}.sourceTextSha256 must match current archive Markdown span.`);
        }
        const corpusChunk = corpusChunksById.get(chunk.chunkId);
        if (corpusChunk && text !== undefined && corpusChunk.originalSpanish !== text) {
          errors.push(`${chunkId}.originalSpanish must match current archive Markdown span.`);
        }
        if (corpusChunk && corpusChunk.sourceFingerprint !== chunk.sourceFingerprint) {
          errors.push(`${chunkId}.sourceFingerprint must match coverage sourceFingerprint.`);
        }
      }
    }
    const expectedChunkIdsInDocument = new Set();
    for (const expectedChunkId of asArray(document.expectedChunkIds)) {
      if (!isNonEmptyString(expectedChunkId)) {
        errors.push(`${documentId}.expectedChunkIds must contain only non-empty strings.`);
      } else {
        expectedChunkIdsInDocument.add(expectedChunkId);
        if (!chunkIdsInDocument.has(expectedChunkId)) {
          errors.push(`${documentId}: expected chunk ${expectedChunkId} is missing from coverage chunks.`);
        }
      }
    }
    for (const generatedChunkId of chunkIdsInDocument) {
      if (isNonEmptyString(generatedChunkId) && !expectedChunkIdsInDocument.has(generatedChunkId)) {
        errors.push(`${documentId}: generated coverage chunk ${generatedChunkId} is missing from expectedChunkIds.`);
      }
    }
    if (strictMode && archiveText !== undefined && Array.isArray(document.chunks)) {
      validateContiguousSourceSpanCoverage(errors, { documentId, chunks: document.chunks, archiveText });
    }
  }

  for (const manifestId of manifestIds) {
    if (strictMode && !corpusDocumentById.has(manifestId)) {
      errors.push(`${manifestId}: missing learner document coverage in strict mode.`);
    }
    if (strictMode && !coverageDocumentById.has(manifestId)) {
      errors.push(`${manifestId}: missing generated chunk coverage in strict mode.`);
    }
  }

  for (const [documentId, document] of corpusDocumentById) {
    const coverageDocument = coverageDocumentById.get(documentId);
    if (!coverageDocument) {
      errors.push(`${documentId}: learner document is missing generated chunk coverage.`);
      continue;
    }
    const coveredChunkIds = new Set(asArray(coverageDocument.chunks).map((chunk) => chunk?.chunkId).filter(isNonEmptyString));
    for (const chunk of asArray(document.chunks)) {
      if (isNonEmptyString(chunk.chunkId) && !coveredChunkIds.has(chunk.chunkId)) {
        errors.push(`${chunk.chunkId}: learner chunk is missing generated chunk coverage.`);
      }
    }
    if (strictMode) {
      const corpusChunkIds = new Set(asArray(document.chunks).map((chunk) => chunk?.chunkId).filter(isNonEmptyString));
      for (const expectedChunkId of asArray(coverageDocument.expectedChunkIds)) {
        if (isNonEmptyString(expectedChunkId) && !corpusChunkIds.has(expectedChunkId)) {
          errors.push(`${expectedChunkId}: expected chunk is missing from learner corpus in strict mode.`);
        }
      }
    }
  }

  const qaChunksById = new Map();
  for (const document of asArray(qa?.documents)) {
    if (!isPlainObject(document)) {
      errors.push("primary sources QA document must be an object.");
      continue;
    }
    const documentId = labelFor(document.officialDocumentId, "primary sources QA document");
    requireString(errors, document.officialDocumentId, `${documentId}.officialDocumentId`);
    if (isNonEmptyString(document.officialDocumentId) && !corpusDocumentById.has(document.officialDocumentId)) {
      errors.push(`${document.officialDocumentId}: QA document has no learner corpus document.`);
    }
    for (const chunk of asArray(document.chunks)) {
      if (!isPlainObject(chunk)) {
        errors.push(`${documentId}.QA chunks entry must be an object.`);
        continue;
      }
      const chunkId = labelFor(chunk.chunkId, `${documentId}.qaChunk`);
      requireString(errors, chunk.chunkId, `${chunkId}.chunkId`);
      if (qaChunksById.has(chunk.chunkId)) errors.push(`${chunk.chunkId}: duplicate primary sources QA chunk.`);
      if (isNonEmptyString(chunk.chunkId)) qaChunksById.set(chunk.chunkId, chunk);
      if (isNonEmptyString(chunk.chunkId) && !corpusChunksById.has(chunk.chunkId)) {
        errors.push(`${chunk.chunkId}: QA chunk has no learner corpus chunk.`);
      }
      validateQaRecord(errors, chunk.translationQa, `${chunkId}.translationQa`, { strictMode });
      validateQaRecord(errors, chunk.simplificationQa, `${chunkId}.simplificationQa`, { strictMode });
    }
  }

  for (const chunkId of corpusChunksById.keys()) {
    if (!qaChunksById.has(chunkId)) errors.push(`${chunkId}: learner chunk is missing QA metadata.`);
  }

  const searchProjectionKeys = new Set();
  for (const entry of asArray(searchIndex?.entries)) {
    if (!isPlainObject(entry)) {
      errors.push("primary sources search entry must be an object.");
      continue;
    }
    const entryId = labelFor(entry.entryId, "primary sources search entry");
    requireString(errors, entry.entryId, `${entryId}.entryId`);
    requireString(errors, entry.officialDocumentId, `${entryId}.officialDocumentId`);
    requireString(errors, entry.chunkId, `${entryId}.chunkId`);
    if (isNonEmptyString(entry.officialDocumentId) && !corpusDocumentById.has(entry.officialDocumentId)) {
      errors.push(`${entryId}: search entry references missing learner document ${entry.officialDocumentId}.`);
    }
    if (isNonEmptyString(entry.chunkId) && !corpusChunksById.has(entry.chunkId)) {
      errors.push(`${entryId}: search entry references missing learner chunk ${entry.chunkId}.`);
    }
    const corpusChunk = isNonEmptyString(entry.chunkId) ? corpusChunksById.get(entry.chunkId) : undefined;
    if (corpusChunk && isNonEmptyString(entry.officialDocumentId)) {
      if (corpusChunk.officialDocumentId !== entry.officialDocumentId) {
        errors.push(`${entryId}.officialDocumentId must match learner chunk officialDocumentId.`);
      } else {
        searchProjectionKeys.add(`${entry.officialDocumentId}\0${entry.chunkId}`);
      }
    }
    if (!Array.isArray(entry.textFields) || entry.textFields.some((field) => !isNonEmptyString(field))) {
      errors.push(`${entryId}.textFields must be an array of non-empty strings.`);
    } else {
      for (const field of entry.textFields) {
        if (isForbiddenSpanishSimplificationKey(field)) {
          errors.push(`${entryId}.textFields must not reference ${field}; simplified Spanish is out of scope.`);
        }
      }
    }
  }

  if (strictMode) {
    for (const [chunkId, chunk] of corpusChunksById) {
      if (
        isNonEmptyString(chunk.officialDocumentId) &&
        !searchProjectionKeys.has(`${chunk.officialDocumentId}\0${chunkId}`)
      ) {
        errors.push(`${chunkId}: learner chunk is missing search projection entry in strict mode.`);
      }
    }
  }

  return errors;
}

export function validatePrimarySourcesFromFiles({ root = defaultRoot, mode = "draft" } = {}) {
  const readJson = (relativePath) => JSON.parse(readFileSync(join(root, relativePath), "utf8"));
  return validatePrimarySources({
    mode,
    root,
    manifest: readJson("content/official-documents/manifest.json"),
    corpus: readJson("content/primary-sources/primary-sources.ru.json"),
    coverage: readJson("content/primary-sources/primary-sources.coverage.json"),
    qa: readJson("content/primary-sources/primary-sources.qa.json"),
    searchIndex: readJson("content/primary-sources/primary-sources.search.json"),
    learnerContentPaths: [
      "content/primary-sources/primary-sources.ru.json",
      "content/primary-sources/primary-sources.qa.json"
    ]
  });
}
