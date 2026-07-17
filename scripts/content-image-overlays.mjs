#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  imageMetadataFingerprint,
  questionFingerprint,
  questionUsageFingerprint,
  sha256Canonical,
} from "./content-image-metadata.mjs";

const SHA256_PATTERN = /^[a-f0-9]{64}$/;
const REVIEW_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const ALLOWED_SOURCE_ROLES = new Set([
  "answer_critical_highlight",
  "supporting",
  "distractor_trap",
  "background_irrelevant_dim",
]);
const NON_CRITICAL_SOURCE_ROLES = new Set([
  "background_irrelevant_dim",
  "distractor_trap",
  "supporting",
]);
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
  "distractor",
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

function collectImageObjectIds(image) {
  const ids = new Set();
  for (const object of [
    ...(image?.objects || []),
    ...(image?.roadUsers || []),
    ...(image?.signsSignalsMarkings || []),
  ]) {
    if (isNonEmptyString(object.id)) ids.add(object.id);
    if (isNonEmptyString(object.objectId)) ids.add(object.objectId);
  }
  for (const annotation of image?.annotations || []) {
    if (isNonEmptyString(annotation.id)) ids.add(annotation.id);
    if (isNonEmptyString(annotation.objectId)) ids.add(annotation.objectId);
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

function addToMultimap(map, id, values) {
  if (!isNonEmptyString(id)) return;
  const set = map.get(id) || new Set();
  for (const value of values || []) {
    if (isNonEmptyString(value)) set.add(value);
  }
  map.set(id, set);
}

function collectImageRegionMappings(image) {
  const detailToRegionIds = new Map();
  const objectToRegionIds = new Map();
  for (const region of image?.regions || []) {
    const regionId = region.regionId || region.id;
    for (const objectId of region.includesObjectIds || [])
      addToMultimap(objectToRegionIds, objectId, [regionId]);
    for (const detailId of region.includesDetailIds || [])
      addToMultimap(detailToRegionIds, detailId, [regionId]);
  }

  function mapDetail(detail) {
    const detailId = detail?.id || detail?.detailId;
    const regionIds = new Set(detail?.regionIds || []);
    for (const objectId of detail?.objectIds || []) {
      for (const regionId of objectToRegionIds.get(objectId) || []) regionIds.add(regionId);
    }
    if (isNonEmptyString(detail?.objectId)) {
      for (const regionId of objectToRegionIds.get(detail.objectId) || []) regionIds.add(regionId);
    }
    addToMultimap(detailToRegionIds, detailId, [...regionIds]);
    for (const objectId of detail?.objectIds || [])
      addToMultimap(objectToRegionIds, objectId, [...regionIds]);
    if (isNonEmptyString(detail?.objectId))
      addToMultimap(objectToRegionIds, detail.objectId, [...regionIds]);
  }

  for (const detail of image?.visualDetails || []) mapDetail(detail);
  for (const roadUser of image?.roadUsers || []) {
    addToMultimap(objectToRegionIds, roadUser.id || roadUser.objectId, roadUser.regionIds || []);
    for (const gesture of roadUser.gestures || []) mapDetail(gesture);
  }
  for (const object of [...(image?.objects || []), ...(image?.signsSignalsMarkings || [])]) {
    addToMultimap(objectToRegionIds, object.id || object.objectId, object.regionIds || []);
  }
  for (const field of ["markings", "crossings", "curbsOrShoulders"]) {
    for (const detail of image?.roadLayout?.[field] || []) mapDetail(detail);
  }
  for (const annotation of image?.annotations || []) {
    const regionIds = new Set(annotation.regionIds || []);
    for (const targetId of annotation.targetIds || []) {
      for (const regionId of detailToRegionIds.get(targetId) || []) regionIds.add(regionId);
      for (const regionId of objectToRegionIds.get(targetId) || []) regionIds.add(regionId);
    }
    addToMultimap(detailToRegionIds, annotation.id || annotation.detailId, [...regionIds]);
    if (isNonEmptyString(annotation.objectId))
      addToMultimap(objectToRegionIds, annotation.objectId, [...regionIds]);
  }
  for (const detail of image?.visibleText || []) mapDetail(detail);
  for (const detail of image?.spatialRelationships || []) mapDetail(detail);
  return { detailToRegionIds, objectToRegionIds };
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

function collectUsageObjectIds(usage) {
  const ids = new Set();
  for (const detail of usage?.answerCriticalDetails || []) {
    for (const objectId of detail.objectIds || []) ids.add(objectId);
  }
  for (const relevance of usage?.relevanceMap || []) {
    for (const objectId of relevance.objectIds || []) ids.add(objectId);
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

function inferredRegionIdsForRelevance(relevance, image) {
  const explicitRegionIds = (relevance?.regionIds || []).filter(isNonEmptyString);
  if (explicitRegionIds.length) return [...new Set(explicitRegionIds)].sort();
  const regionIds = new Set();
  const { detailToRegionIds, objectToRegionIds } = collectImageRegionMappings(image);
  for (const detailId of relevance?.detailIds || []) {
    for (const regionId of detailToRegionIds.get(detailId) || []) regionIds.add(regionId);
  }
  for (const objectId of relevance?.objectIds || []) {
    for (const regionId of objectToRegionIds.get(objectId) || []) regionIds.add(regionId);
  }
  return [...regionIds].sort();
}

function regionIdsForRelevance(relevance, image) {
  return inferredRegionIdsForRelevance(relevance, image);
}

function detailIdsForRelevance(relevance, image) {
  const detailIds = new Set(relevance?.detailIds || []);
  const regionIds = new Set(regionIdsForRelevance(relevance, image));
  for (const region of image?.regions || []) {
    const regionId = region.regionId || region.id;
    if (!regionIds.has(regionId)) continue;
    for (const detailId of region.includesDetailIds || []) detailIds.add(detailId);
  }
  return [...detailIds].sort();
}

function objectIdsForRelevance(relevance, image) {
  const objectIds = new Set(relevance?.objectIds || []);
  const regionIds = new Set(regionIdsForRelevance(relevance, image));
  for (const region of image?.regions || []) {
    const regionId = region.regionId || region.id;
    if (!regionIds.has(regionId)) continue;
    for (const objectId of region.includesObjectIds || []) objectIds.add(objectId);
  }
  return [...objectIds].sort();
}

function clampRect(rect) {
  const x = Math.max(0, Math.min(96, rect.x));
  const y = Math.max(0, Math.min(96, rect.y));
  const width = Math.max(4, Math.min(100 - x, rect.width));
  const height = Math.max(4, Math.min(100 - y, rect.height));
  return {
    x: Number(x.toFixed(2)),
    y: Number(y.toFixed(2)),
    width: Number(width.toFixed(2)),
    height: Number(height.toFixed(2)),
  };
}

function rectFromApproximateBoundingBox(region) {
  const box = region?.approximateBoundingBox;
  if (!isPlainObject(box)) return null;
  const scale = box.coordinateSpace === "normalized_0_1" ? 100 : 1;
  for (const field of ["x", "y", "width", "height"]) {
    if (!Number.isFinite(box[field])) return null;
  }
  return clampRect({
    x: box.x * scale,
    y: box.y * scale,
    width: box.width * scale,
    height: box.height * scale,
  });
}

function rectFromSemanticLocation(text) {
  const value = (text || "").toLowerCase();
  let x = 18;
  let y = 18;
  let width = 64;
  let height = 64;
  if (value.includes("entire") || value.includes("whole"))
    return { x: 0, y: 0, width: 100, height: 100 };
  if (value.includes("left half")) {
    x = 0;
    width = 50;
  } else if (value.includes("right half")) {
    x = 50;
    width = 50;
  } else if (value.includes("left")) {
    x = 5;
    width = 38;
  } else if (value.includes("right")) {
    x = 57;
    width = 38;
  } else if (value.includes("center")) {
    x = 30;
    width = 40;
  }
  if (value.includes("upper") || value.includes("top")) {
    y = 5;
    height = 35;
  } else if (value.includes("lower") || value.includes("bottom")) {
    y = 60;
    height = 35;
  } else if (value.includes("foreground")) {
    y = 42;
    height = 46;
  } else if (value.includes("background")) {
    y = 0;
    height = 45;
  } else if (value.includes("center")) {
    y = 30;
    height = 40;
  }
  return clampRect({ x, y, width, height });
}

function deterministicRect(seed, sourceRole, index) {
  const digest = sha256Canonical({ seed, sourceRole, index });
  const n = (offset) => Number.parseInt(digest.slice(offset, offset + 4), 16);
  if (sourceRole === "background_irrelevant_dim") {
    const band = n(0) % 4;
    return [
      { x: 0, y: 0, width: 100, height: 28 },
      { x: 0, y: 72, width: 100, height: 28 },
      { x: 0, y: 0, width: 28, height: 100 },
      { x: 72, y: 0, width: 28, height: 100 },
    ][band];
  }
  const width = sourceRole === "answer_critical_highlight" ? 24 : 32;
  const height = sourceRole === "answer_critical_highlight" ? 20 : 26;
  return clampRect({
    x: n(4) % Math.max(1, 100 - width),
    y: n(8) % Math.max(1, 100 - height),
    width,
    height,
  });
}

function rectContains(container, target) {
  return (
    container.x <= target.x &&
    container.y <= target.y &&
    container.x + container.width >= target.x + target.width &&
    container.y + container.height >= target.y + target.height
  );
}

function rectIsFullFrame(rect) {
  return rect.x <= 0 && rect.y <= 0 && rect.x + rect.width >= 100 && rect.y + rect.height >= 100;
}

function nonCriticalCandidateRects(seed, sourceRole) {
  const digest = sha256Canonical({ seed, sourceRole, purpose: "non-critical-overlay-candidates" });
  const offset = Number.parseInt(digest.slice(0, 4), 16) % 8;
  const candidates = [
    { x: 0, y: 0, width: 100, height: 22 },
    { x: 0, y: 78, width: 100, height: 22 },
    { x: 0, y: 0, width: 22, height: 100 },
    { x: 78, y: 0, width: 22, height: 100 },
    { x: 0, y: 0, width: 34, height: 34 },
    { x: 66, y: 0, width: 34, height: 34 },
    { x: 0, y: 66, width: 34, height: 34 },
    { x: 66, y: 66, width: 34, height: 34 },
  ];
  return [...candidates.slice(offset), ...candidates.slice(0, offset)];
}

function avoidCriticalMaskingRect(rect, relevance, criticalRects, index) {
  if (relevance.role === "answer_critical_highlight") return rect;
  const masksCritical = criticalRects.some((criticalRect) => rectContains(rect, criticalRect));
  if (!masksCritical && !(relevance.role === "background_irrelevant_dim" && rectIsFullFrame(rect)))
    return rect;
  const fallback = nonCriticalCandidateRects(relevance.relevanceId, relevance.role).find(
    (candidate) => !criticalRects.some((criticalRect) => rectContains(candidate, criticalRect)),
  );
  return fallback || deterministicRect(relevance.relevanceId, relevance.role, index);
}

function rectForRelevance(relevance, image, index) {
  const regionsById = new Map(
    (image?.regions || []).map((region) => [region.regionId || region.id, region]),
  );
  const regionIds = inferredRegionIdsForRelevance(relevance, image);
  const rects = regionIds
    .map((regionId) => regionsById.get(regionId))
    .map(
      (region) =>
        rectFromApproximateBoundingBox(region) ||
        rectFromSemanticLocation(`${region?.semanticLocation || ""} ${region?.label || ""}`),
    )
    .filter(Boolean);
  if (!rects.length) return deterministicRect(relevance.relevanceId, relevance.role, index);
  const x1 = Math.min(...rects.map((rect) => rect.x));
  const y1 = Math.min(...rects.map((rect) => rect.y));
  const x2 = Math.max(...rects.map((rect) => rect.x + rect.width));
  const y2 = Math.max(...rects.map((rect) => rect.y + rect.height));
  return clampRect({ x: x1, y: y1, width: x2 - x1, height: y2 - y1 });
}

function uniqueSorted(values) {
  return [...new Set((values || []).filter(isNonEmptyString))].sort();
}

function buildGeneratedOverlay({ question, image, usage, reviewer, reviewedAt }) {
  const criticalRelevance = (usage.relevanceMap || []).filter(
    (relevance) => relevance.role === "answer_critical_highlight",
  );
  const nonCriticalRelevance = (usage.relevanceMap || []).filter((relevance) =>
    NON_CRITICAL_SOURCE_ROLES.has(relevance.role),
  );
  const selectedRelevance = [...criticalRelevance, ...nonCriticalRelevance];
  const criticalRects = criticalRelevance.map((relevance, index) =>
    rectForRelevance(relevance, image, index),
  );
  const regions = selectedRelevance.map((relevance, index) => {
    const regionIds = inferredRegionIdsForRelevance(relevance, image);
    const detailIds = detailIdsForRelevance(relevance, image);
    const objectIds = objectIdsForRelevance(relevance, image);
    const sourceRect = rectForRelevance(relevance, image, index);
    return {
      overlayRegionId: `overlay-${usage.questionId}-${relevance.relevanceId}`.replace(
        /[^a-zA-Z0-9_-]/g,
        "-",
      ),
      sourceRole: relevance.role,
      relevanceId: relevance.relevanceId,
      detailIds,
      objectIds,
      regionIds,
      rect: avoidCriticalMaskingRect(sourceRect, relevance, criticalRects, index),
      labelRu:
        relevance.role === "answer_critical_highlight"
          ? "Ключевая область для ответа"
          : relevance.role === "background_irrelevant_dim"
            ? "Второстепенный фон для этого вопроса"
            : relevance.role === "distractor_trap"
              ? "Отвлекающая деталь в этом вопросе"
              : "Поддерживающая визуальная деталь",
    };
  });
  const overlay = {
    overlayId: `overlay-${usage.questionId}-${image.imageId}-explanation`,
    status: "approved",
    questionId: usage.questionId,
    imageId: image.imageId,
    localPath: usage.localPath,
    imageSha256: usage.imageSha256,
    questionFingerprint: questionFingerprint(question),
    metadataFingerprint: imageMetadataFingerprint(image),
    usageFingerprint: questionUsageFingerprint(usage),
    relevanceIds: uniqueSorted(regions.map((region) => region.relevanceId)),
    referencedDetailIds: uniqueSorted(regions.flatMap((region) => region.detailIds)),
    referencedObjectIds: uniqueSorted(regions.flatMap((region) => region.objectIds)),
    referencedRegionIds: uniqueSorted(regions.flatMap((region) => region.regionIds)),
    regions,
    provenance: {
      method: "deterministic_overlay_from_approved_009_question_usage",
      reviewer,
      reviewedAt,
      notes:
        "Generated by scripts/content-image-overlays.mjs from approved 009 per-question usage/relevance; geometry is image-relative presentation data and does not assign independent importance.",
    },
  };
  return overlay;
}

export function buildCurrentOverlayBundle({ questions, metadataManifest, reviewer, reviewedAt }) {
  const questionById = new Map((questions || []).map((question) => [question.id, question]));
  const imageById = new Map(
    (metadataManifest?.images || []).map((image) => [image.imageId, image]),
  );
  const overlays = (metadataManifest?.questionUsages || [])
    .filter((usage) => {
      const question = questionById.get(usage.questionId);
      return question?.image && usage.review?.status === "approved";
    })
    .sort((a, b) => a.questionId.localeCompare(b.questionId))
    .map((usage) => {
      const question = questionById.get(usage.questionId);
      const image = imageById.get(usage.imageId);
      if (!question || !image)
        throw new Error(
          `Cannot generate overlay for ${usage.questionId}: missing question or image metadata.`,
        );
      return buildGeneratedOverlay({ question, image, usage, reviewer, reviewedAt });
    });
  const overlayEntries = overlays.map((overlay) => ({
    overlayId: overlay.overlayId,
    questionId: overlay.questionId,
    imageId: overlay.imageId,
    localPath: overlay.localPath,
    imageSha256: overlay.imageSha256,
    questionFingerprint: overlay.questionFingerprint,
    metadataFingerprint: overlay.metadataFingerprint,
    usageFingerprint: overlay.usageFingerprint,
    status: "approved",
    reviewer,
    reviewedAt,
    overlaySha256: imageOverlayFingerprint(overlay),
    checks: {
      questionUsageCurrent: true,
      metadataCurrent: true,
      overlayFingerprintCurrent: true,
      rolesFromQuestionUsage: true,
      roleSourceCurrentQuestionOnly: true,
      regionsInBounds: true,
      localAssetOnly: true,
      noInventedRelevance: true,
      staleDataChecksPassed: true,
      fullCurrentCoverageChecked: true,
    },
    notes:
      "Generated evidence for one approved current overlay tied to approved 009 question-specific usage/relevance.",
  }));
  return {
    overlayManifest: {
      version: 1,
      contentKind: "question-image-explanation-overlays",
      questionSourcePath: "content/questions/caba-b.unofficial-fallback.questions.json",
      imageMetadataPath: "content/image-metadata/question-images.manifest.json",
      imageMetadataEvidencePath: "content/validation/question-image-metadata.evidence.json",
      ownership: {
        sourceSemantics:
          "Feature 009 per-question image usage owns answer-critical, supporting, distractor, and background relevance roles.",
        overlayPresentation:
          "Feature 010 owns only image-relative presentation geometry for explanation-time support. This manifest is generated from approved current 009 question usage records.",
      },
      generation: {
        method: "scripts/content-image-overlays.mjs --write-current-overlays",
        reviewer,
        reviewedAt,
        overlayCount: overlays.length,
      },
      overlays,
    },
    overlayEvidence: {
      version: 1,
      reviewer,
      reviewedAt,
      generation: {
        method: "scripts/content-image-overlays.mjs --write-current-overlays",
        overlayCount: overlays.length,
      },
      overlayEntries,
    },
  };
}

function findForbiddenSemanticKeys(value, errors, label, path = label) {
  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      findForbiddenSemanticKeys(item, errors, label, `${path}[${index}]`),
    );
    return;
  }
  if (!isPlainObject(value)) return;
  for (const [key, child] of Object.entries(value)) {
    if (key !== "sourceRole" && FORBIDDEN_UI_SEMANTIC_KEYS.has(key)) {
      errors.push(
        `${label}: overlay must not define UI-side relevance key ${path}.${key}; use sourceRole from 009 usage instead.`,
      );
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
    referencedObjectIds: overlay.referencedObjectIds || [],
    referencedRegionIds: overlay.referencedRegionIds || [],
    regions: overlay.regions || [],
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
  if (entry.status !== "approved")
    errors.push(`${label}: overlay evidence status must be approved.`);
  if (!isNonEmptyString(entry.reviewer))
    errors.push(`${label}: overlay evidence reviewer must be a non-empty string.`);
  if (!REVIEW_DATE_PATTERN.test(entry.reviewedAt || ""))
    errors.push(`${label}: overlay evidence reviewedAt must be YYYY-MM-DD.`);
  if (entry.questionId !== overlay.questionId)
    errors.push(`${label}: overlay evidence questionId mismatch.`);
  if (entry.imageId !== overlay.imageId)
    errors.push(`${label}: overlay evidence imageId mismatch.`);
  if (entry.localPath !== overlay.localPath)
    errors.push(`${label}: overlay evidence localPath mismatch.`);
  if (entry.imageSha256 !== overlay.imageSha256)
    errors.push(`${label}: overlay evidence imageSha256 mismatch.`);
  if (entry.questionFingerprint !== overlay.questionFingerprint)
    errors.push(`${label}: overlay evidence questionFingerprint mismatch.`);
  if (entry.metadataFingerprint !== overlay.metadataFingerprint)
    errors.push(`${label}: overlay evidence metadataFingerprint mismatch.`);
  if (entry.usageFingerprint !== overlay.usageFingerprint)
    errors.push(`${label}: overlay evidence usageFingerprint mismatch.`);
  if (entry.overlaySha256 !== imageOverlayFingerprint(overlay))
    errors.push(`${label}: overlay evidence overlaySha256 mismatch.`);
  for (const check of [
    "questionUsageCurrent",
    "metadataCurrent",
    "overlayFingerprintCurrent",
    "rolesFromQuestionUsage",
    "roleSourceCurrentQuestionOnly",
    "regionsInBounds",
    "localAssetOnly",
    "noInventedRelevance",
    "staleDataChecksPassed",
    "fullCurrentCoverageChecked",
  ]) {
    if (entry.checks?.[check] !== true)
      errors.push(`${label}: overlay evidence checks.${check} must be true.`);
  }
}

function requireMetadataEvidence({ image, usage, metadataEvidence, errors, label }) {
  const imageEntry = (metadataEvidence?.imageEntries || []).find(
    (entry) => entry.imageId === image?.imageId,
  );
  const usageEntry = (metadataEvidence?.usageEntries || []).find(
    (entry) => entry.questionId === usage?.questionId,
  );
  if (!imageEntry || imageEntry.status !== "approved")
    errors.push(`${label}: missing approved 009 image metadata evidence.`);
  if (!usageEntry || usageEntry.status !== "approved")
    errors.push(`${label}: missing approved 009 question usage evidence.`);
  if (imageEntry && imageEntry.metadataSha256 !== imageMetadataFingerprint(image))
    errors.push(`${label}: stale 009 metadata evidence fingerprint.`);
  if (usageEntry && usageEntry.usageSha256 !== questionUsageFingerprint(usage))
    errors.push(`${label}: stale 009 usage evidence fingerprint.`);
}

export function validateImageExplanationOverlays({
  questions,
  metadataManifest,
  metadataEvidence,
  overlayManifest,
  overlayEvidence,
  fileExists = () => true,
}) {
  const errors = [];
  const questionById = new Map((questions || []).map((question) => [question.id, question]));
  const imageById = new Map(
    (metadataManifest?.images || []).map((image) => [image.imageId, image]),
  );
  const usageByQuestionId = new Map(
    (metadataManifest?.questionUsages || []).map((usage) => [usage.questionId, usage]),
  );
  const overlayEvidenceById = new Map();
  const overlayEvidenceQuestionIds = new Map();
  for (const entry of overlayEvidence?.overlayEntries || []) {
    if (overlayEvidenceById.has(entry.overlayId))
      errors.push(`${entry.overlayId}: duplicate overlay evidence entry.`);
    overlayEvidenceById.set(entry.overlayId, entry);
    if (isNonEmptyString(entry.questionId)) {
      const questionEntries = overlayEvidenceQuestionIds.get(entry.questionId) || [];
      questionEntries.push(entry.overlayId);
      overlayEvidenceQuestionIds.set(entry.questionId, questionEntries);
    }
  }

  if (!isPlainObject(overlayManifest)) {
    errors.push("question image overlay manifest must be an object.");
    return errors;
  }
  if (overlayManifest.version !== 1)
    errors.push("question image overlay manifest version must be 1.");
  if (overlayManifest.contentKind !== "question-image-explanation-overlays") {
    errors.push(
      "question image overlay manifest contentKind must be question-image-explanation-overlays.",
    );
  }
  if (
    overlayManifest.questionSourcePath !==
    "content/questions/caba-b.unofficial-fallback.questions.json"
  ) {
    errors.push(
      "question image overlay manifest questionSourcePath must point to the fallback question file.",
    );
  }
  if (
    overlayManifest.imageMetadataPath !== "content/image-metadata/question-images.manifest.json"
  ) {
    errors.push(
      "question image overlay manifest imageMetadataPath must point to the 009 metadata manifest.",
    );
  }
  if (!Array.isArray(overlayManifest.overlays))
    errors.push("question image overlay manifest overlays must be an array.");
  if (!isPlainObject(overlayEvidence)) {
    errors.push("question image overlay evidence must be an object.");
  } else if (overlayEvidence.version !== 1) {
    errors.push("question image overlay evidence version must be 1.");
  }

  const overlayIds = new Set();
  const approvedOverlaysByQuestionId = new Map();
  for (const overlay of overlayManifest.overlays || []) {
    const label = isNonEmptyString(overlay?.overlayId) ? overlay.overlayId : "image overlay";
    if (!isPlainObject(overlay)) {
      errors.push("image overlay entry must be an object.");
      continue;
    }
    findForbiddenSemanticKeys(overlay, errors, label);
    if (!isNonEmptyString(overlay.overlayId))
      errors.push(`${label}: overlayId must be a non-empty string.`);
    if (overlayIds.has(overlay.overlayId))
      errors.push(`${overlay.overlayId}: duplicate overlay id.`);
    overlayIds.add(overlay.overlayId);
    if (overlay.status !== "approved")
      errors.push(`${label}: status must be approved before rendering.`);
    if (overlay.status === "approved") {
      const questionOverlays = approvedOverlaysByQuestionId.get(overlay.questionId) || [];
      questionOverlays.push(overlay.overlayId);
      approvedOverlaysByQuestionId.set(overlay.questionId, questionOverlays);
    }
    const question = questionById.get(overlay.questionId);
    if (!question) {
      errors.push(`${label}: references missing question ${overlay.questionId}.`);
      continue;
    }
    if (!question.image) errors.push(`${label}: references a question without an image.`);
    if (/^https?:\/\//.test(overlay.localPath || ""))
      errors.push(`${label}: localPath must be local, not remote.`);
    if (
      !isNonEmptyString(overlay.localPath) ||
      !overlay.localPath.startsWith("content/assets/questions/")
    ) {
      errors.push(`${label}: localPath must reference a bundled question asset.`);
    }
    if (isNonEmptyString(overlay.localPath) && !fileExists(overlay.localPath))
      errors.push(`${label}: localPath is missing on disk.`);
    if (question.image && overlay.localPath !== question.image.localPath)
      errors.push(`${label}: localPath does not match the current question image.`);
    if (question.image && overlay.imageSha256 !== question.image.sha256)
      errors.push(`${label}: imageSha256 does not match the current question image.`);
    if (!SHA256_PATTERN.test(overlay.imageSha256 || ""))
      errors.push(`${label}: imageSha256 must be a sha256 hex digest.`);
    if (overlay.questionFingerprint !== questionFingerprint(question))
      errors.push(`${label}: questionFingerprint mismatch.`);

    const image = imageById.get(overlay.imageId);
    const usage = usageByQuestionId.get(overlay.questionId);
    if (!image) errors.push(`${label}: references missing 009 image metadata ${overlay.imageId}.`);
    if (!usage) errors.push(`${label}: missing 009 question usage for ${overlay.questionId}.`);
    if (image && image.localPath !== overlay.localPath)
      errors.push(`${label}: 009 image metadata path mismatch.`);
    if (image && image.sha256 !== overlay.imageSha256)
      errors.push(`${label}: 009 image metadata hash mismatch.`);
    if (usage && usage.imageId !== overlay.imageId)
      errors.push(`${label}: 009 usage imageId mismatch.`);
    if (usage && usage.localPath !== overlay.localPath)
      errors.push(`${label}: 009 usage localPath mismatch.`);
    if (usage && usage.imageSha256 !== overlay.imageSha256)
      errors.push(`${label}: 009 usage imageSha256 mismatch.`);
    if (image && overlay.metadataFingerprint !== imageMetadataFingerprint(image))
      errors.push(`${label}: metadataFingerprint mismatch.`);
    if (usage && overlay.usageFingerprint !== questionUsageFingerprint(usage))
      errors.push(`${label}: usageFingerprint mismatch.`);
    if (image && usage) requireMetadataEvidence({ image, usage, metadataEvidence, errors, label });

    const relevanceById = new Map(
      (usage?.relevanceMap || []).map((relevance) => [relevance.relevanceId, relevance]),
    );
    const imageDetailIds = collectImageDetailIds(image);
    const imageObjectIds = collectImageObjectIds(image);
    const imageRegionIds = collectImageRegionIds(image);
    const usageDetailIds = collectUsageDetailIds(usage);
    const usageObjectIds = collectUsageObjectIds(usage);
    const usageRegionIds = collectUsageRegionIds(usage);
    for (const relevance of usage?.relevanceMap || []) {
      for (const regionId of inferredRegionIdsForRelevance(relevance, image))
        usageRegionIds.add(regionId);
      for (const detailId of detailIdsForRelevance(relevance, image)) usageDetailIds.add(detailId);
      for (const objectId of objectIdsForRelevance(relevance, image)) usageObjectIds.add(objectId);
    }
    const overlayRelevanceIds = new Set(overlay.relevanceIds || []);
    const overlayDetailIds = new Set(overlay.referencedDetailIds || []);
    const overlayObjectIds = new Set(overlay.referencedObjectIds || []);
    const overlayRegionIds = new Set(overlay.referencedRegionIds || []);
    const seenRoles = [];
    const checkedRegions = [];

    if (!Array.isArray(overlay.relevanceIds) || overlay.relevanceIds.length < 1)
      errors.push(`${label}: relevanceIds must include at least one 009 relevanceId.`);
    if (!Array.isArray(overlay.referencedDetailIds) || overlay.referencedDetailIds.length < 1)
      errors.push(`${label}: referencedDetailIds must include at least one 009 detailId.`);
    if (!Array.isArray(overlay.referencedRegionIds) || overlay.referencedRegionIds.length < 1)
      errors.push(`${label}: referencedRegionIds must include at least one 009 regionId.`);
    if (overlay.referencedObjectIds !== undefined && !Array.isArray(overlay.referencedObjectIds)) {
      errors.push(`${label}: referencedObjectIds must be an array when present.`);
    }

    for (const relevanceId of overlay.relevanceIds || []) {
      if (!relevanceById.has(relevanceId))
        errors.push(`${label}: relevanceIds references missing 009 relevance ${relevanceId}.`);
    }
    for (const detailId of overlay.referencedDetailIds || []) {
      if (!imageDetailIds.has(detailId))
        errors.push(
          `${label}: referencedDetailIds references missing metadata detail ${detailId}.`,
        );
      if (!usageDetailIds.has(detailId))
        errors.push(
          `${label}: referencedDetailIds references detail ${detailId} not used by current question usage.`,
        );
    }
    for (const objectId of overlay.referencedObjectIds || []) {
      if (!imageObjectIds.has(objectId))
        errors.push(
          `${label}: referencedObjectIds references missing metadata object ${objectId}.`,
        );
      if (!usageObjectIds.has(objectId))
        errors.push(
          `${label}: referencedObjectIds references object ${objectId} not used by current question usage.`,
        );
    }
    for (const regionId of overlay.referencedRegionIds || []) {
      if (!imageRegionIds.has(regionId))
        errors.push(
          `${label}: referencedRegionIds references missing metadata region ${regionId}.`,
        );
      if (!usageRegionIds.has(regionId))
        errors.push(
          `${label}: referencedRegionIds references region ${regionId} not used by current question usage.`,
        );
    }

    if (!Array.isArray(overlay.regions) || overlay.regions.length < 1)
      errors.push(`${label}: regions must include at least one overlay region.`);
    for (const region of overlay.regions || []) {
      const regionLabel = `${label}: region ${region?.overlayRegionId || "(missing id)"}`;
      if (!isPlainObject(region)) {
        errors.push(`${label}: overlay regions must be objects.`);
        continue;
      }
      if (!isNonEmptyString(region.overlayRegionId))
        errors.push(`${regionLabel} must have a non-empty overlayRegionId.`);
      if (!ALLOWED_SOURCE_ROLES.has(region.sourceRole))
        errors.push(`${regionLabel} sourceRole is invalid.`);
      seenRoles.push(region.sourceRole);
      const relevance = relevanceById.get(region.relevanceId);
      if (!relevance) {
        errors.push(`${regionLabel} references missing 009 relevance ${region.relevanceId}.`);
      } else if (relevance.role !== region.sourceRole) {
        errors.push(
          `${regionLabel} sourceRole ${region.sourceRole} does not match 009 relevance role ${relevance.role}.`,
        );
      }
      if (!overlayRelevanceIds.has(region.relevanceId))
        errors.push(`${regionLabel} relevanceId must be listed in overlay.relevanceIds.`);
      if (!Array.isArray(region.detailIds))
        errors.push(`${regionLabel} detailIds must be an array.`);
      if (!Array.isArray(region.regionIds))
        errors.push(`${regionLabel} regionIds must be an array.`);
      if (region.objectIds !== undefined && !Array.isArray(region.objectIds))
        errors.push(`${regionLabel} objectIds must be an array when present.`);
      if (
        (region.detailIds || []).length +
          (region.objectIds || []).length +
          (region.regionIds || []).length <
        1
      ) {
        errors.push(
          `${regionLabel} must reference at least one current-question 009 detailId, objectId, or regionId.`,
        );
      }
      for (const detailId of region.detailIds || []) {
        if (!imageDetailIds.has(detailId))
          errors.push(`${regionLabel} references missing metadata detail ${detailId}.`);
        if (!usageDetailIds.has(detailId))
          errors.push(
            `${regionLabel} references detail ${detailId} not used by current question usage.`,
          );
        if (
          relevance &&
          !(relevance.detailIds || []).includes(detailId) &&
          !detailIdsForRelevance(relevance, image).includes(detailId)
        ) {
          errors.push(
            `${regionLabel} detail ${detailId} is not assigned to 009 relevance ${region.relevanceId}.`,
          );
        }
        if (!overlayDetailIds.has(detailId))
          errors.push(
            `${regionLabel} detail ${detailId} must be listed in overlay.referencedDetailIds.`,
          );
      }
      for (const objectId of region.objectIds || []) {
        if (!imageObjectIds.has(objectId))
          errors.push(`${regionLabel} references missing metadata object ${objectId}.`);
        if (!usageObjectIds.has(objectId))
          errors.push(
            `${regionLabel} references object ${objectId} not used by current question usage.`,
          );
        if (
          relevance &&
          !(relevance.objectIds || []).includes(objectId) &&
          !objectIdsForRelevance(relevance, image).includes(objectId)
        ) {
          errors.push(
            `${regionLabel} object ${objectId} is not assigned to 009 relevance ${region.relevanceId}.`,
          );
        }
        if (!overlayObjectIds.has(objectId))
          errors.push(
            `${regionLabel} object ${objectId} must be listed in overlay.referencedObjectIds.`,
          );
      }
      for (const regionId of region.regionIds || []) {
        if (!imageRegionIds.has(regionId))
          errors.push(`${regionLabel} references missing metadata region ${regionId}.`);
        if (!usageRegionIds.has(regionId))
          errors.push(
            `${regionLabel} references region ${regionId} not used by current question usage.`,
          );
        if (
          relevance &&
          !(relevance.regionIds || []).includes(regionId) &&
          !inferredRegionIdsForRelevance(relevance, image).includes(regionId)
        ) {
          errors.push(
            `${regionLabel} region ${regionId} is not assigned to 009 relevance ${region.relevanceId}.`,
          );
        }
        if (!overlayRegionIds.has(regionId))
          errors.push(
            `${regionLabel} region ${regionId} must be listed in overlay.referencedRegionIds.`,
          );
      }
      const rect = region.rect;
      if (!isPlainObject(rect)) {
        errors.push(`${regionLabel} rect must be an object.`);
      } else {
        for (const field of ["x", "y", "width", "height"]) {
          if (!Number.isFinite(rect[field]))
            errors.push(`${regionLabel} rect.${field} must be a finite number.`);
        }
        if (Number.isFinite(rect.x) && rect.x < 0)
          errors.push(`${regionLabel} rect.x must be within image bounds.`);
        if (Number.isFinite(rect.y) && rect.y < 0)
          errors.push(`${regionLabel} rect.y must be within image bounds.`);
        if (Number.isFinite(rect.width) && rect.width <= 0)
          errors.push(`${regionLabel} rect.width must be positive.`);
        if (Number.isFinite(rect.height) && rect.height <= 0)
          errors.push(`${regionLabel} rect.height must be positive.`);
        if (Number.isFinite(rect.x) && Number.isFinite(rect.width) && rect.x + rect.width > 100)
          errors.push(`${regionLabel} rect.x + rect.width must be within 100.`);
        if (Number.isFinite(rect.y) && Number.isFinite(rect.height) && rect.y + rect.height > 100)
          errors.push(`${regionLabel} rect.y + rect.height must be within 100.`);
        if (["x", "y", "width", "height"].every((field) => Number.isFinite(rect[field]))) {
          if (region.sourceRole === "background_irrelevant_dim" && rectIsFullFrame(rect)) {
            errors.push(
              `${regionLabel} background_irrelevant_dim must not use a full-frame dim rectangle.`,
            );
          }
          checkedRegions.push({ region, regionLabel, rect });
        }
      }
    }
    const criticalRegions = checkedRegions.filter(
      (entry) => entry.region.sourceRole === "answer_critical_highlight",
    );
    const nonCriticalRegions = checkedRegions.filter((entry) =>
      NON_CRITICAL_SOURCE_ROLES.has(entry.region.sourceRole),
    );
    for (const nonCritical of nonCriticalRegions) {
      for (const critical of criticalRegions) {
        if (rectContains(nonCritical.rect, critical.rect)) {
          errors.push(
            `${nonCritical.regionLabel} ${nonCritical.region.sourceRole} must not fully cover answer-critical region ${critical.region.overlayRegionId}.`,
          );
        }
      }
    }
    if (!seenRoles.includes("answer_critical_highlight"))
      errors.push(`${label}: approved overlay must include an answer_critical_highlight region.`);
    if (!seenRoles.some((role) => NON_CRITICAL_SOURCE_ROLES.has(role))) {
      errors.push(
        `${label}: approved overlay must include at least one non-critical dim/support region from current question usage.`,
      );
    }
    requireEvidenceEntry(overlayEvidenceById.get(overlay.overlayId), overlay, errors);
  }

  const approvedUsageQuestionIds = new Set(
    (metadataEvidence?.usageEntries || [])
      .filter((entry) => entry.status === "approved")
      .map((entry) => entry.questionId),
  );
  const approvedImageIds = new Set(
    (metadataEvidence?.imageEntries || [])
      .filter((entry) => entry.status === "approved")
      .map((entry) => entry.imageId),
  );
  const expectedCurrentQuestionIds = new Set();
  for (const question of questions || []) {
    if (!question.image) continue;
    const usage = usageByQuestionId.get(question.id);
    if (!usage || usage.review?.status !== "approved") continue;
    if (!approvedUsageQuestionIds.has(question.id) || !approvedImageIds.has(usage.imageId))
      continue;
    expectedCurrentQuestionIds.add(question.id);
  }
  for (const questionId of expectedCurrentQuestionIds) {
    const overlaysForQuestion = approvedOverlaysByQuestionId.get(questionId) || [];
    if (overlaysForQuestion.length !== 1) {
      errors.push(
        `${questionId}: expected exactly one approved current overlay, found ${overlaysForQuestion.length}.`,
      );
    }
    const evidenceForQuestion = overlayEvidenceQuestionIds.get(questionId) || [];
    if (evidenceForQuestion.length !== 1) {
      errors.push(
        `${questionId}: expected exactly one approved overlay evidence entry, found ${evidenceForQuestion.length}.`,
      );
    }
  }
  for (const [questionId, overlaysForQuestion] of approvedOverlaysByQuestionId) {
    if (!expectedCurrentQuestionIds.has(questionId)) {
      errors.push(
        `${questionId}: overlay exists for a question without approved current 009 image usage.`,
      );
    }
    if (overlaysForQuestion.length > 1) {
      errors.push(
        `${questionId}: duplicate approved current overlays: ${overlaysForQuestion.join(", ")}.`,
      );
    }
  }

  return errors;
}

function readJson(root, relativePath) {
  return JSON.parse(readFileSync(join(root, relativePath), "utf8"));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const questions = readJson(root, "content/questions/caba-b.unofficial-fallback.questions.json");
  const metadataManifest = readJson(root, "content/image-metadata/question-images.manifest.json");
  if (process.argv.includes("--write-current-overlays")) {
    const { overlayManifest, overlayEvidence } = buildCurrentOverlayBundle({
      questions,
      metadataManifest,
      reviewer: "Codex Implementation Agent 010 full overlay coverage",
      reviewedAt: "2026-05-10",
    });
    writeFileSync(
      join(root, "content/image-overlays/question-explanation-overlays.manifest.json"),
      `${JSON.stringify(overlayManifest, null, 2)}\n`,
    );
    writeFileSync(
      join(root, "content/validation/question-image-overlays.evidence.json"),
      `${JSON.stringify(overlayEvidence, null, 2)}\n`,
    );
  }
  const errors = validateImageExplanationOverlays({
    questions,
    metadataManifest,
    metadataEvidence: readJson(root, "content/validation/question-image-metadata.evidence.json"),
    overlayManifest: readJson(
      root,
      "content/image-overlays/question-explanation-overlays.manifest.json",
    ),
    overlayEvidence: readJson(root, "content/validation/question-image-overlays.evidence.json"),
    fileExists: (relativePath) => existsSync(join(root, relativePath)),
  });
  if (errors.length) {
    for (const error of errors) console.error(error);
    process.exit(1);
  }
  const currentUsageCount = metadataManifest.questionUsages.filter((usage) => {
    const question = questions.find((item) => item.id === usage.questionId);
    return question?.image && usage.review?.status === "approved";
  }).length;
  console.log(
    `Image explanation overlays validated: ${currentUsageCount} approved overlays for ${currentUsageCount} current image-backed question usages.`,
  );
}
