#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  imageMetadataFingerprint,
  questionFingerprint,
  questionUsageFingerprint,
  sha256Canonical
} from "./content-image-metadata.mjs";

const SHA256_PATTERN = /^[a-f0-9]{64}$/;
const REVIEW_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const ALLOWED_SOURCE_ROLES = new Set(["answer_critical_highlight", "supporting", "distractor_trap", "background_irrelevant_dim"]);
const FORBIDDEN_UI_SEMANTIC_KEYS = new Set([
  "important",
  "importance",
  "unimportant",
  "criticality",
  "relevance",
  "relevanceRole",
  "role",
  "highlight",
  "dim",
  "distractor"
]);

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}

function collectImageDetailIds(image) {
  const ids = new Set();
  for (const detail of image?.visualDetails || []) {
    if (isNonEmptyString(detail.id)) ids.add(detail.id);
    if (isNonEmptyString(detail.detailId)) ids.add(detail.detailId);
  }
  for (const roadUser of image?.roadUsers || []) {
    for (const gesture of roadUser.gestures || []) {
      if (isNonEmptyString(gesture.id)) ids.add(gesture.id);
      if (isNonEmptyString(gesture.detailId)) ids.add(gesture.detailId);
    }
  }
  for (const field of ["markings", "crossings", "curbsOrShoulders"]) {
    for (const detail of image?.roadLayout?.[field] || []) {
      if (isNonEmptyString(detail.id)) ids.add(detail.id);
      if (isNonEmptyString(detail.detailId)) ids.add(detail.detailId);
    }
  }
  for (const collection of [image?.annotations, image?.visibleText, image?.spatialRelationships]) {
    for (const detail of collection || []) {
      if (isNonEmptyString(detail.id)) ids.add(detail.id);
      if (isNonEmptyString(detail.detailId)) ids.add(detail.detailId);
    }
  }
  return ids;
}

function collectImageRegionIds(image) {
  const ids = new Set();
  for (const region of image?.regions || []) {
    if (isNonEmptyString(region.regionId)) ids.add(region.regionId);
    if (isNonEmptyString(region.id)) ids.add(region.id);
  }
  return ids;
}

function collectUsageDetailIds(usage) {
  const ids = new Set();
  for (const detail of usage?.answerCriticalDetails || []) {
    if (isNonEmptyString(detail.detailId)) ids.add(detail.detailId);
  }
  for (const relevance of usage?.relevanceMap || []) {
    for (const detailId of relevance.detailIds || []) ids.add(detailId);
  }
  return ids;
}

function collectUsageRegionIds(usage) {
  const ids = new Set();
  for (const detail of usage?.answerCriticalDetails || []) {
    for (const regionId of detail.regionIds || []) ids.add(regionId);
  }
  for (const relevance of usage?.relevanceMap || []) {
    for (const regionId of relevance.regionIds || []) ids.add(regionId);
  }
  return ids;
}

function findForbiddenSemanticKeys(value, errors, label, path = label) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => findForbiddenSemanticKeys(item, errors, label, `${path}[${index}]`));
    return;
  }
  if (!isPlainObject(value)) return;
  for (const [key, child] of Object.entries(value)) {
    if (key !== "sourceRole" && FORBIDDEN_UI_SEMANTIC_KEYS.has(key)) {
      errors.push(`${label}: overlay must not define UI-side relevance key ${path}.${key}; use sourceRole from 009 usage instead.`);
    }
    findForbiddenSemanticKeys(child, errors, label, `${path}.${key}`);
  }
}

export function imageOverlayTuple(overlay) {
  return {
    overlayId: overlay.overlayId,
    status: overlay.status,
    questionId: overlay.questionId,
    imageId: overlay.imageId,
    localPath: overlay.localPath,
    imageSha256: overlay.imageSha256,
    questionFingerprint: overlay.questionFingerprint,
    metadataFingerprint: overlay.metadataFingerprint,
    usageFingerprint: overlay.usageFingerprint,
    relevanceIds: overlay.relevanceIds || [],
    referencedDetailIds: overlay.referencedDetailIds || [],
    referencedRegionIds: overlay.referencedRegionIds || [],
    regions: overlay.regions || []
  };
}

export function imageOverlayFingerprint(overlay) {
  return sha256Canonical(imageOverlayTuple(overlay));
}

function requireEvidenceEntry(entry, overlay, errors) {
  const label = overlay.overlayId || overlay.questionId || "image overlay";
  if (!entry) {
    errors.push(`${label}: missing approved overlay evidence.`);
    return;
  }
  if (entry.status !== "approved") errors.push(`${label}: overlay evidence status must be approved.`);
  if (!isNonEmptyString(entry.reviewer)) errors.push(`${label}: overlay evidence reviewer must be a non-empty string.`);
  if (!REVIEW_DATE_PATTERN.test(entry.reviewedAt || "")) errors.push(`${label}: overlay evidence reviewedAt must be YYYY-MM-DD.`);
  if (entry.questionId !== overlay.questionId) errors.push(`${label}: overlay evidence questionId mismatch.`);
  if (entry.overlaySha256 !== imageOverlayFingerprint(overlay)) errors.push(`${label}: overlay evidence overlaySha256 mismatch.`);
  for (const check of [
    "questionUsageCurrent",
    "metadataCurrent",
    "rolesFromQuestionUsage",
    "regionsInBounds",
    "localAssetOnly",
    "noInventedRelevance"
  ]) {
    if (entry.checks?.[check] !== true) errors.push(`${label}: overlay evidence checks.${check} must be true.`);
  }
}

function requireMetadataEvidence({ image, usage, metadataEvidence, errors, label }) {
  const imageEntry = (metadataEvidence?.imageEntries || []).find((entry) => entry.imageId === image?.imageId);
  const usageEntry = (metadataEvidence?.usageEntries || []).find((entry) => entry.questionId === usage?.questionId);
  if (!imageEntry || imageEntry.status !== "approved") errors.push(`${label}: missing approved 009 image metadata evidence.`);
  if (!usageEntry || usageEntry.status !== "approved") errors.push(`${label}: missing approved 009 question usage evidence.`);
  if (imageEntry && imageEntry.metadataSha256 !== imageMetadataFingerprint(image)) errors.push(`${label}: stale 009 metadata evidence fingerprint.`);
  if (usageEntry && usageEntry.usageSha256 !== questionUsageFingerprint(usage)) errors.push(`${label}: stale 009 usage evidence fingerprint.`);
}

export function validateImageExplanationOverlays({
  questions,
  metadataManifest,
  metadataEvidence,
  overlayManifest,
  overlayEvidence,
  fileExists = () => true
}) {
  const errors = [];
  const questionById = new Map((questions || []).map((question) => [question.id, question]));
  const imageById = new Map((metadataManifest?.images || []).map((image) => [image.imageId, image]));
  const usageByQuestionId = new Map((metadataManifest?.questionUsages || []).map((usage) => [usage.questionId, usage]));
  const overlayEvidenceById = new Map((overlayEvidence?.overlayEntries || []).map((entry) => [entry.overlayId, entry]));

  if (!isPlainObject(overlayManifest)) {
    errors.push("question image overlay manifest must be an object.");
    return errors;
  }
  if (overlayManifest.version !== 1) errors.push("question image overlay manifest version must be 1.");
  if (overlayManifest.contentKind !== "question-image-explanation-overlays") {
    errors.push("question image overlay manifest contentKind must be question-image-explanation-overlays.");
  }
  if (overlayManifest.questionSourcePath !== "content/questions/caba-b.unofficial-fallback.questions.json") {
    errors.push("question image overlay manifest questionSourcePath must point to the fallback question file.");
  }
  if (overlayManifest.imageMetadataPath !== "content/image-metadata/question-images.manifest.json") {
    errors.push("question image overlay manifest imageMetadataPath must point to the 009 metadata manifest.");
  }
  if (!Array.isArray(overlayManifest.overlays)) errors.push("question image overlay manifest overlays must be an array.");
  if (!isPlainObject(overlayEvidence)) {
    errors.push("question image overlay evidence must be an object.");
  } else if (overlayEvidence.version !== 1) {
    errors.push("question image overlay evidence version must be 1.");
  }

  const overlayIds = new Set();
  for (const overlay of overlayManifest.overlays || []) {
    const label = isNonEmptyString(overlay?.overlayId) ? overlay.overlayId : "image overlay";
    if (!isPlainObject(overlay)) {
      errors.push("image overlay entry must be an object.");
      continue;
    }
    findForbiddenSemanticKeys(overlay, errors, label);
    if (!isNonEmptyString(overlay.overlayId)) errors.push(`${label}: overlayId must be a non-empty string.`);
    if (overlayIds.has(overlay.overlayId)) errors.push(`${overlay.overlayId}: duplicate overlay id.`);
    overlayIds.add(overlay.overlayId);
    if (overlay.status !== "approved") errors.push(`${label}: status must be approved before rendering.`);
    const question = questionById.get(overlay.questionId);
    if (!question) {
      errors.push(`${label}: references missing question ${overlay.questionId}.`);
      continue;
    }
    if (!question.image) errors.push(`${label}: references a question without an image.`);
    if (/^https?:\/\//.test(overlay.localPath || "")) errors.push(`${label}: localPath must be local, not remote.`);
    if (!isNonEmptyString(overlay.localPath) || !overlay.localPath.startsWith("content/assets/questions/")) {
      errors.push(`${label}: localPath must reference a bundled question asset.`);
    }
    if (isNonEmptyString(overlay.localPath) && !fileExists(overlay.localPath)) errors.push(`${label}: localPath is missing on disk.`);
    if (question.image && overlay.localPath !== question.image.localPath) errors.push(`${label}: localPath does not match the current question image.`);
    if (question.image && overlay.imageSha256 !== question.image.sha256) errors.push(`${label}: imageSha256 does not match the current question image.`);
    if (!SHA256_PATTERN.test(overlay.imageSha256 || "")) errors.push(`${label}: imageSha256 must be a sha256 hex digest.`);
    if (overlay.questionFingerprint !== questionFingerprint(question)) errors.push(`${label}: questionFingerprint mismatch.`);

    const image = imageById.get(overlay.imageId);
    const usage = usageByQuestionId.get(overlay.questionId);
    if (!image) errors.push(`${label}: references missing 009 image metadata ${overlay.imageId}.`);
    if (!usage) errors.push(`${label}: missing 009 question usage for ${overlay.questionId}.`);
    if (image && image.localPath !== overlay.localPath) errors.push(`${label}: 009 image metadata path mismatch.`);
    if (image && image.sha256 !== overlay.imageSha256) errors.push(`${label}: 009 image metadata hash mismatch.`);
    if (usage && usage.imageId !== overlay.imageId) errors.push(`${label}: 009 usage imageId mismatch.`);
    if (usage && usage.localPath !== overlay.localPath) errors.push(`${label}: 009 usage localPath mismatch.`);
    if (usage && usage.imageSha256 !== overlay.imageSha256) errors.push(`${label}: 009 usage imageSha256 mismatch.`);
    if (image && overlay.metadataFingerprint !== imageMetadataFingerprint(image)) errors.push(`${label}: metadataFingerprint mismatch.`);
    if (usage && overlay.usageFingerprint !== questionUsageFingerprint(usage)) errors.push(`${label}: usageFingerprint mismatch.`);
    if (image && usage) requireMetadataEvidence({ image, usage, metadataEvidence, errors, label });

    const relevanceById = new Map((usage?.relevanceMap || []).map((relevance) => [relevance.relevanceId, relevance]));
    const imageDetailIds = collectImageDetailIds(image);
    const imageRegionIds = collectImageRegionIds(image);
    const usageDetailIds = collectUsageDetailIds(usage);
    const usageRegionIds = collectUsageRegionIds(usage);
    const overlayRelevanceIds = new Set(overlay.relevanceIds || []);
    const overlayDetailIds = new Set(overlay.referencedDetailIds || []);
    const overlayRegionIds = new Set(overlay.referencedRegionIds || []);
    const seenRoles = [];

    if (!Array.isArray(overlay.relevanceIds) || overlay.relevanceIds.length < 1) errors.push(`${label}: relevanceIds must include at least one 009 relevanceId.`);
    if (!Array.isArray(overlay.referencedDetailIds) || overlay.referencedDetailIds.length < 1) errors.push(`${label}: referencedDetailIds must include at least one 009 detailId.`);
    if (!Array.isArray(overlay.referencedRegionIds) || overlay.referencedRegionIds.length < 1) errors.push(`${label}: referencedRegionIds must include at least one 009 regionId.`);

    for (const relevanceId of overlay.relevanceIds || []) {
      if (!relevanceById.has(relevanceId)) errors.push(`${label}: relevanceIds references missing 009 relevance ${relevanceId}.`);
    }
    for (const detailId of overlay.referencedDetailIds || []) {
      if (!imageDetailIds.has(detailId)) errors.push(`${label}: referencedDetailIds references missing metadata detail ${detailId}.`);
      if (!usageDetailIds.has(detailId)) errors.push(`${label}: referencedDetailIds references detail ${detailId} not used by current question usage.`);
    }
    for (const regionId of overlay.referencedRegionIds || []) {
      if (!imageRegionIds.has(regionId)) errors.push(`${label}: referencedRegionIds references missing metadata region ${regionId}.`);
      if (!usageRegionIds.has(regionId)) errors.push(`${label}: referencedRegionIds references region ${regionId} not used by current question usage.`);
    }

    if (!Array.isArray(overlay.regions) || overlay.regions.length < 1) errors.push(`${label}: regions must include at least one overlay region.`);
    for (const region of overlay.regions || []) {
      const regionLabel = `${label}: region ${region?.overlayRegionId || "(missing id)"}`;
      if (!isPlainObject(region)) {
        errors.push(`${label}: overlay regions must be objects.`);
        continue;
      }
      if (!isNonEmptyString(region.overlayRegionId)) errors.push(`${regionLabel} must have a non-empty overlayRegionId.`);
      if (!ALLOWED_SOURCE_ROLES.has(region.sourceRole)) errors.push(`${regionLabel} sourceRole is invalid.`);
      seenRoles.push(region.sourceRole);
      const relevance = relevanceById.get(region.relevanceId);
      if (!relevance) {
        errors.push(`${regionLabel} references missing 009 relevance ${region.relevanceId}.`);
      } else if (relevance.role !== region.sourceRole) {
        errors.push(`${regionLabel} sourceRole ${region.sourceRole} does not match 009 relevance role ${relevance.role}.`);
      }
      if (!overlayRelevanceIds.has(region.relevanceId)) errors.push(`${regionLabel} relevanceId must be listed in overlay.relevanceIds.`);
      for (const detailId of region.detailIds || []) {
        if (!imageDetailIds.has(detailId)) errors.push(`${regionLabel} references missing metadata detail ${detailId}.`);
        if (!usageDetailIds.has(detailId)) errors.push(`${regionLabel} references detail ${detailId} not used by current question usage.`);
        if (relevance && !(relevance.detailIds || []).includes(detailId)) errors.push(`${regionLabel} detail ${detailId} is not assigned to 009 relevance ${region.relevanceId}.`);
        if (!overlayDetailIds.has(detailId)) errors.push(`${regionLabel} detail ${detailId} must be listed in overlay.referencedDetailIds.`);
      }
      for (const regionId of region.regionIds || []) {
        if (!imageRegionIds.has(regionId)) errors.push(`${regionLabel} references missing metadata region ${regionId}.`);
        if (!usageRegionIds.has(regionId)) errors.push(`${regionLabel} references region ${regionId} not used by current question usage.`);
        if (relevance && !(relevance.regionIds || []).includes(regionId)) errors.push(`${regionLabel} region ${regionId} is not assigned to 009 relevance ${region.relevanceId}.`);
        if (!overlayRegionIds.has(regionId)) errors.push(`${regionLabel} region ${regionId} must be listed in overlay.referencedRegionIds.`);
      }
      const rect = region.rect;
      if (!isPlainObject(rect)) {
        errors.push(`${regionLabel} rect must be an object.`);
      } else {
        for (const field of ["x", "y", "width", "height"]) {
          if (!Number.isFinite(rect[field])) errors.push(`${regionLabel} rect.${field} must be a finite number.`);
        }
        if (Number.isFinite(rect.x) && rect.x < 0) errors.push(`${regionLabel} rect.x must be within image bounds.`);
        if (Number.isFinite(rect.y) && rect.y < 0) errors.push(`${regionLabel} rect.y must be within image bounds.`);
        if (Number.isFinite(rect.width) && rect.width <= 0) errors.push(`${regionLabel} rect.width must be positive.`);
        if (Number.isFinite(rect.height) && rect.height <= 0) errors.push(`${regionLabel} rect.height must be positive.`);
        if (Number.isFinite(rect.x) && Number.isFinite(rect.width) && rect.x + rect.width > 100) errors.push(`${regionLabel} rect.x + rect.width must be within 100.`);
        if (Number.isFinite(rect.y) && Number.isFinite(rect.height) && rect.y + rect.height > 100) errors.push(`${regionLabel} rect.y + rect.height must be within 100.`);
      }
    }
    if (!seenRoles.includes("answer_critical_highlight")) errors.push(`${label}: approved overlay must include an answer_critical_highlight region.`);
    if (!seenRoles.includes("background_irrelevant_dim")) errors.push(`${label}: approved overlay must include a background_irrelevant_dim region.`);
    requireEvidenceEntry(overlayEvidenceById.get(overlay.overlayId), overlay, errors);
  }

  return errors;
}

function readJson(root, relativePath) {
  return JSON.parse(readFileSync(join(root, relativePath), "utf8"));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const errors = validateImageExplanationOverlays({
    questions: readJson(root, "content/questions/caba-b.unofficial-fallback.questions.json"),
    metadataManifest: readJson(root, "content/image-metadata/question-images.manifest.json"),
    metadataEvidence: readJson(root, "content/validation/question-image-metadata.evidence.json"),
    overlayManifest: readJson(root, "content/image-overlays/question-explanation-overlays.manifest.json"),
    overlayEvidence: readJson(root, "content/validation/question-image-overlays.evidence.json"),
    fileExists: (relativePath) => existsSync(join(root, relativePath))
  });
  if (errors.length) {
    for (const error of errors) console.error(error);
    process.exit(1);
  }
  console.log("Image explanation overlays validated.");
}
