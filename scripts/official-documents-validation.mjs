const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const SHA256_PATTERN = /^[a-f0-9]{64}$/;
const HTTP_URL_PATTERN = /^https?:\/\/\S+$/;
const LOSSY_SOURCE_FORMATS = new Set(["pdf", "scan", "image", "doc", "docx", "odt"]);
const CURRENT_USABLE_STATUSES = new Set(["current", "in_force", "currently_valid", "valid_current_material"]);
const CURRENTNESS_STATUSES = new Set([
  ...CURRENT_USABLE_STATUSES,
  "historical",
  "stale",
  "superseded",
  "repealed",
  "not_current",
  "unknown"
]);
const VALIDATION_STATUSES = new Set(["pending", "passed", "failed"]);

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizePath(value) {
  return String(value || "").replaceAll("\\", "/");
}

function pathSegments(value) {
  return normalizePath(value)
    .split("/")
    .filter((segment) => segment.length > 0);
}

function isLocalSectionPath(value, sectionPath) {
  if (!isNonEmptyString(value)) return false;
  const normalized = normalizePath(value);
  if (normalized.startsWith("/") || /^[a-zA-Z]:\//.test(normalized)) return false;
  if (pathSegments(normalized).includes("..")) return false;
  const normalizedSection = normalizePath(sectionPath).replace(/\/+$/, "");
  return normalized === normalizedSection || normalized.startsWith(`${normalizedSection}/`);
}

function fileRecordFor(fileMetadata, localPath) {
  if (!localPath) return undefined;
  if (typeof fileMetadata === "function") return fileMetadata(localPath);
  if (fileMetadata instanceof Map) return fileMetadata.get(localPath);
  if (isPlainObject(fileMetadata)) return fileMetadata[localPath];
  return undefined;
}

function fileExists(fileMetadata, localPath) {
  const record = fileRecordFor(fileMetadata, localPath);
  if (record === undefined) return false;
  if (record === true) return true;
  if (record === false || record === null) return false;
  if (isPlainObject(record) && "exists" in record) return record.exists === true;
  return Boolean(record);
}

function fileSha256(fileMetadata, localPath) {
  const record = fileRecordFor(fileMetadata, localPath);
  if (isPlainObject(record) && isNonEmptyString(record.sha256)) return record.sha256;
  return undefined;
}

function validateRequiredString(errors, value, label) {
  if (!isNonEmptyString(value)) errors.push(`${label} must be a non-empty string.`);
}

function validateDate(errors, value, label) {
  if (!DATE_PATTERN.test(value || "")) errors.push(`${label} must be YYYY-MM-DD.`);
}

function validateLocalPath(errors, value, label, sectionPath, fileMetadata, { markdown = false } = {}) {
  validateRequiredString(errors, value, label);
  if (!isNonEmptyString(value)) return;
  if (!isLocalSectionPath(value, sectionPath)) {
    errors.push(`${label} must stay inside ${sectionPath}.`);
  }
  if (markdown && !normalizePath(value).endsWith(".md")) {
    errors.push(`${label} must point to a Markdown file.`);
  }
  if (!fileExists(fileMetadata, value)) errors.push(`${label} is missing from local file metadata.`);
}

function sourceTraceUsesCurrentClaim(entry) {
  return entry?.claimUse !== "historical_context" && entry?.currentClaim !== false;
}

export function validateOfficialDocumentsManifest({ manifest, fileMetadata = {}, sourceTrace } = {}) {
  const errors = [];
  if (!isPlainObject(manifest)) {
    errors.push("official documents manifest must be an object.");
    return errors;
  }

  if (manifest.version !== 1) errors.push("official documents manifest version must be 1.");
  if (!["draft", "published"].includes(manifest.status)) {
    errors.push("official documents manifest status must be draft or published.");
  }
  if (manifest.schema !== "official-documents-manifest.v1") {
    errors.push("official documents manifest schema must be official-documents-manifest.v1.");
  }
  const sectionPath = isNonEmptyString(manifest.sectionPath) ? normalizePath(manifest.sectionPath).replace(/\/+$/, "") : "";
  if (sectionPath !== "content/official-documents") {
    errors.push("official documents manifest sectionPath must be content/official-documents.");
  }
  if (!Array.isArray(manifest.entries)) errors.push("official documents manifest entries must be an array.");

  const entryById = new Map();
  for (const entry of asArray(manifest.entries)) {
    if (!isPlainObject(entry)) {
      errors.push("official document entry must be an object.");
      continue;
    }

    const label = isNonEmptyString(entry.id) ? entry.id : "official document entry";
    validateRequiredString(errors, entry.id, `${label}.id`);
    if (entryById.has(entry.id)) errors.push(`${entry.id}: duplicate official document id.`);
    if (isNonEmptyString(entry.id)) entryById.set(entry.id, entry);

    validateRequiredString(errors, entry.title, `${label}.title`);
    validateRequiredString(errors, entry.officialSourceType, `${label}.officialSourceType`);
    validateRequiredString(errors, entry.sourceUrl, `${label}.sourceUrl`);
    if (isNonEmptyString(entry.sourceUrl) && !HTTP_URL_PATTERN.test(entry.sourceUrl)) {
      errors.push(`${label}.sourceUrl must be an http(s) URL.`);
    }
    validateDate(errors, entry.retrievalDate, `${label}.retrievalDate`);
    validateRequiredString(errors, entry.sourceFormat, `${label}.sourceFormat`);
    validateRequiredString(errors, entry.conversionMethod, `${label}.conversionMethod`);
    validateRequiredString(errors, entry.conversionNotes, `${label}.conversionNotes`);
    validateLocalPath(errors, entry.localPath, `${label}.localPath`, sectionPath, fileMetadata, { markdown: true });

    if (entry.hashAlgorithm !== "sha256") errors.push(`${label}.hashAlgorithm must be sha256.`);
    if (!SHA256_PATTERN.test(entry.hash || "")) errors.push(`${label}.hash must be a 64-character lowercase sha256 hex digest.`);
    const localSha256 = fileSha256(fileMetadata, entry.localPath);
    if (isNonEmptyString(localSha256) && SHA256_PATTERN.test(entry.hash || "") && entry.hash !== localSha256) {
      errors.push(`${label}.hash must match local Markdown sha256 metadata.`);
    }

    const sourceFormat = String(entry.sourceFormat || "").toLowerCase();
    if (LOSSY_SOURCE_FORMATS.has(sourceFormat)) {
      validateLocalPath(errors, entry.rawOriginalPath, `${label}.rawOriginalPath`, sectionPath, fileMetadata);
    } else if (isNonEmptyString(entry.rawOriginalPath)) {
      validateLocalPath(errors, entry.rawOriginalPath, `${label}.rawOriginalPath`, sectionPath, fileMetadata);
    }

    if (!isPlainObject(entry.currentness)) {
      errors.push(`${label}.currentness must be an object.`);
    } else {
      validateDate(errors, entry.currentness.checkedAt, `${label}.currentness.checkedAt`);
      validateRequiredString(errors, entry.currentness.status, `${label}.currentness.status`);
      validateRequiredString(errors, entry.currentness.validationStatus, `${label}.currentness.validationStatus`);
      if (isNonEmptyString(entry.currentness.status) && !CURRENTNESS_STATUSES.has(entry.currentness.status)) {
        errors.push(`${label}.currentness.status must be one of ${[...CURRENTNESS_STATUSES].join(", ")}.`);
      }
      if (
        isNonEmptyString(entry.currentness.validationStatus) &&
        !VALIDATION_STATUSES.has(entry.currentness.validationStatus)
      ) {
        errors.push(`${label}.currentness.validationStatus must be one of pending, passed, failed.`);
      }
      validateRequiredString(errors, entry.currentness.statusEvidence, `${label}.currentness.statusEvidence`);
      validateRequiredString(errors, entry.currentness.amendmentRepealEvidence, `${label}.currentness.amendmentRepealEvidence`);
      if (!Array.isArray(entry.currentness.evidenceUrls) || entry.currentness.evidenceUrls.length === 0) {
        errors.push(`${label}.currentness.evidenceUrls must be a non-empty array.`);
      } else {
        for (const url of entry.currentness.evidenceUrls) {
          if (!isNonEmptyString(url) || !HTTP_URL_PATTERN.test(url)) {
            errors.push(`${label}.currentness.evidenceUrls must contain only http(s) URLs.`);
            break;
          }
        }
      }
    }

    if (!isPlainObject(entry.exactTextValidation)) {
      errors.push(`${label}.exactTextValidation must be an object.`);
    } else {
      validateRequiredString(errors, entry.exactTextValidation.status, `${label}.exactTextValidation.status`);
      if (
        isNonEmptyString(entry.exactTextValidation.status) &&
        !VALIDATION_STATUSES.has(entry.exactTextValidation.status)
      ) {
        errors.push(`${label}.exactTextValidation.status must be one of pending, passed, failed.`);
      }
      if (
        ["passed", "failed"].includes(entry.exactTextValidation.status) &&
        !DATE_PATTERN.test(entry.exactTextValidation.checkedAt || "")
      ) {
        errors.push(`${label}.exactTextValidation.checkedAt must be YYYY-MM-DD when exact-text validation has run.`);
      }
    }
  }

  for (const traceEntry of asArray(sourceTrace?.entries)) {
    if (!sourceTraceUsesCurrentClaim(traceEntry)) continue;
    const traceLabel = isNonEmptyString(traceEntry?.id) ? traceEntry.id : "source trace entry";
    for (const documentId of asArray(traceEntry?.officialDocumentIds)) {
      const document = entryById.get(documentId);
      if (!document) {
        errors.push(`${traceLabel}: source trace references missing official document ${documentId}.`);
        continue;
      }
      const status = document.currentness?.status;
      const validationStatus = document.currentness?.validationStatus;
      if (!CURRENT_USABLE_STATUSES.has(status) || validationStatus !== "passed") {
        errors.push(
          `${traceLabel}: current guide claims must cite only current official documents; ${documentId} has status ${status || "missing"} and validationStatus ${validationStatus || "missing"}.`
        );
      }
    }
  }

  return errors;
}
