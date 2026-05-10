import { createHash } from "node:crypto";

const SHA256_PATTERN = /^[a-f0-9]{64}$/;
const REVIEW_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const PLACEHOLDER_IMAGE_METADATA_PATTERN =
  /\b(source[-_ ]?image[-_ ]?frame|manual[-_ ]?review[-_ ]?required|deterministic baseline|baseline metadata|object-level visual facts are not asserted|object-level detail remains uncertain|specific visual objects are not asserted|unknown or not manually reviewed|pending manual image review)\b/i;
const GENERIC_USAGE_DETAIL_PATTERN =
  /\b(source[-_ ]?image|answer[-_ ]?cue|visible context|critical[-_ ]?source[-_ ]?image|referenced source image|generic visual|object-level detail remains uncertain)\b/i;

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}

export function canonicalJson(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((item) => canonicalJson(item)).join(",")}]`;
  return `{${Object.keys(value)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`)
    .join(",")}}`;
}

export function sha256Canonical(value) {
  return createHash("sha256").update(canonicalJson(value)).digest("hex");
}

export function sourceTupleForQuestion(question) {
  return {
    questionId: question.id,
    officialTextEs: question.officialTextEs,
    answers: (question.answers || []).map((answer) => ({
      id: answer.id,
      officialTextEs: answer.officialTextEs
    })),
    correctAnswerId: question.correctAnswerId,
    image: question.image
      ? {
          localPath: question.image.localPath || null,
          sha256: question.image.sha256
        }
      : null
  };
}

export function questionFingerprint(question) {
  return sha256Canonical(sourceTupleForQuestion(question));
}

export function imageReferenceFingerprint(questions) {
  return sha256Canonical(
    (questions || [])
      .filter((question) => question.image)
      .map((question) => ({
        questionId: question.id,
        localPath: question.image.localPath,
        sha256: question.image.sha256,
        originalUrl: question.image.originalUrl || null
      }))
  );
}

export function questionSetFingerprint(questions) {
  return sha256Canonical((questions || []).map((question) => sourceTupleForQuestion(question)));
}

export function imageMetadataTuple(image) {
  return {
    imageId: image.imageId,
    localPath: image.localPath,
    originalUrl: image.originalUrl || null,
    sha256: image.sha256,
    sourceIds: image.sourceIds || [],
    kind: image.kind,
    descriptionLanguage: image.descriptionLanguage,
    visualSummary: image.visualSummary,
    generationPromptSummary: image.generationPromptSummary,
    scene: image.scene || {},
    roadLayout: image.roadLayout || null,
    objects: image.objects || [],
    roadUsers: image.roadUsers || [],
    signsSignalsMarkings: image.signsSignalsMarkings || [],
    annotations: image.annotations || [],
    visibleText: image.visibleText || [],
    spatialRelationships: image.spatialRelationships || [],
    uncertainties: image.uncertainties || []
  };
}

export function imageMetadataFingerprint(image) {
  return sha256Canonical(imageMetadataTuple(image));
}

export function questionUsageTuple(usage) {
  return {
    questionId: usage.questionId,
    imageId: usage.imageId,
    localPath: usage.localPath,
    imageSha256: usage.imageSha256,
    questionFingerprint: usage.questionFingerprint,
    correctAnswerId: usage.correctAnswerId,
    questionContext: usage.questionContext || null,
    answerCriticalDetails: usage.answerCriticalDetails || [],
    relevanceMap: usage.relevanceMap || [],
    imageRole: usage.imageRole
  };
}

export function questionUsageFingerprint(usage) {
  return sha256Canonical(questionUsageTuple(usage));
}

export function buildImageMetadataEvidenceEntry({ image, reviewer, reviewedAt, notes }) {
  return {
    imageId: image.imageId,
    localPath: image.localPath,
    imageSha256: image.sha256,
    status: "approved",
    reviewer,
    reviewedAt,
    metadataSha256: imageMetadataFingerprint(image),
    checks: {
      pathAndHashCurrent: true,
      visualCoverageReviewed: true,
      objectDetailCoverageReviewed: true,
      uncertaintyRecorded: true,
      noInventedCriticalFacts: true
    },
    notes
  };
}

export function buildQuestionUsageEvidenceEntry({ usage, reviewer, reviewedAt, notes }) {
  return {
    questionId: usage.questionId,
    imageId: usage.imageId,
    status: "approved",
    reviewer,
    reviewedAt,
    questionFingerprint: usage.questionFingerprint,
    usageSha256: questionUsageFingerprint(usage),
    checks: {
      questionTupleCurrent: true,
      imageReferenceCurrent: true,
      criticalDetailsMapped: true,
      answerLinksCurrent: true
    },
    notes
  };
}

function collectImageReferences(questions) {
  const imageBackedQuestions = (questions || []).filter((question) => question.image);
  const uniqueByPath = new Map();
  for (const question of imageBackedQuestions) {
    const key = question.image.localPath;
    const existing = uniqueByPath.get(key);
    if (existing && existing.sha256 !== question.image.sha256) {
      existing.hashConflict = true;
    } else if (!existing) {
      uniqueByPath.set(key, {
        localPath: question.image.localPath,
        sha256: question.image.sha256,
        originalUrl: question.image.originalUrl || null,
        sourceIds: new Set([question.sourceId]),
        questionIds: [question.id],
        hashConflict: false
      });
    } else {
      existing.sourceIds.add(question.sourceId);
      existing.questionIds.push(question.id);
    }
  }
  return {
    imageBackedQuestions,
    uniqueImages: [...uniqueByPath.values()].map((image) => ({
      ...image,
      sourceIds: [...image.sourceIds].sort()
    }))
  };
}

function allObjectIds(image) {
  const ids = new Set();
  for (const object of [...(image.objects || []), ...(image.roadUsers || []), ...(image.signsSignalsMarkings || [])]) {
    if (isNonEmptyString(object.id)) ids.add(object.id);
    if (isNonEmptyString(object.objectId)) ids.add(object.objectId);
  }
  for (const annotation of image.annotations || []) {
    if (isNonEmptyString(annotation.id)) ids.add(annotation.id);
    if (isNonEmptyString(annotation.objectId)) ids.add(annotation.objectId);
  }
  return ids;
}

function allDetailIds(image, usage) {
  const ids = new Set();
  for (const detail of image.visualDetails || []) {
    if (isNonEmptyString(detail.id)) ids.add(detail.id);
    if (isNonEmptyString(detail.detailId)) ids.add(detail.detailId);
  }
  for (const detail of usage.answerCriticalDetails || []) {
    if (isNonEmptyString(detail.detailId)) ids.add(detail.detailId);
  }
  for (const roadUser of image.roadUsers || []) {
    for (const gesture of roadUser.gestures || []) {
      if (isNonEmptyString(gesture.id)) ids.add(gesture.id);
      if (isNonEmptyString(gesture.detailId)) ids.add(gesture.detailId);
    }
  }
  for (const field of ["markings", "crossings", "curbsOrShoulders"]) {
    for (const detail of image.roadLayout?.[field] || []) {
      if (isNonEmptyString(detail.id)) ids.add(detail.id);
      if (isNonEmptyString(detail.detailId)) ids.add(detail.detailId);
    }
  }
  return ids;
}

function allRegionIds(image) {
  const ids = new Set();
  for (const region of image?.regions || []) {
    if (isNonEmptyString(region.regionId)) ids.add(region.regionId);
    if (isNonEmptyString(region.id)) ids.add(region.id);
  }
  return ids;
}

function allReferenceIds(image, usage) {
  const ids = new Set([...allObjectIds(image), ...allDetailIds(image, usage), ...allRegionIds(image)]);
  for (const collection of [image?.annotations, image?.visibleText, image?.spatialRelationships]) {
    for (const item of collection || []) {
      if (isNonEmptyString(item.id)) ids.add(item.id);
      if (isNonEmptyString(item.objectId)) ids.add(item.objectId);
      if (isNonEmptyString(item.detailId)) ids.add(item.detailId);
      if (isNonEmptyString(item.regionId)) ids.add(item.regionId);
    }
  }
  return ids;
}

const FORBIDDEN_SHARED_RELEVANCE_KEYS = new Set([
  "important",
  "importance",
  "unimportant",
  "criticality",
  "relevance",
  "relevanceRole",
  "highlight",
  "dim",
  "distractor",
  "displayIntent"
]);

function requireQuestionNeutralSharedMetadata(value, label, errors, path = label) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => requireQuestionNeutralSharedMetadata(item, label, errors, `${path}[${index}]`));
    return;
  }
  if (!isPlainObject(value)) return;
  for (const [key, child] of Object.entries(value)) {
    if (key === "review") continue;
    if (FORBIDDEN_SHARED_RELEVANCE_KEYS.has(key)) {
      errors.push(`${label}: shared image metadata must not contain question-scoped relevance key ${path}.${key}.`);
    }
    requireQuestionNeutralSharedMetadata(child, label, errors, `${path}.${key}`);
  }
}

function requireApprovedReview(review, label, errors) {
  if (!isPlainObject(review)) {
    errors.push(`${label}: review must be an object.`);
    return;
  }
  if (review.status !== "approved") errors.push(`${label}: review.status must be approved.`);
  if (!isNonEmptyString(review.reviewer)) errors.push(`${label}: review.reviewer must be a non-empty string.`);
  if (!REVIEW_DATE_PATTERN.test(review.reviewedAt || "")) errors.push(`${label}: review.reviewedAt must be YYYY-MM-DD.`);
}

function serializedText(value) {
  return JSON.stringify(value || "").replace(/[_-]+/g, " ");
}

function hasPlaceholderImageMetadata(image) {
  return PLACEHOLDER_IMAGE_METADATA_PATTERN.test(serializedText(image));
}

function hasGenericUsageDetail(detail) {
  return GENERIC_USAGE_DETAIL_PATTERN.test(serializedText(detail));
}

function hasConcreteVisualObject(object) {
  if (!isPlainObject(object)) return false;
  if (!isNonEmptyString(object.id) || !isNonEmptyString(object.type)) return false;
  if (/source[-_ ]?image|unknown|frame|placeholder|generic/i.test(`${object.id} ${object.type} ${object.label || ""}`)) return false;
  return object.confidence !== "low";
}

function hasConcreteVisualReviewEvidence(review) {
  const evidence = review?.visualReviewEvidence;
  return (
    isPlainObject(evidence) &&
    evidence.method === "actual_image_inspection" &&
    isNonEmptyString(evidence.reviewerNotes) &&
    evidence.sceneCoverage === true &&
    evidence.objectCoverage === true &&
    evidence.answerCriticalCoverage === true
  );
}

function requireFullQualityImageMetadata(image, label, errors) {
  if (hasPlaceholderImageMetadata(image)) {
    errors.push(`${label}: full-quality image metadata must not contain placeholder, baseline, source-image-frame, or manual-review-required wording.`);
  }
  if (!hasConcreteVisualReviewEvidence(image.review)) {
    errors.push(`${label}: full-quality image metadata requires review.visualReviewEvidence from actual image inspection.`);
  }
  const concreteObjects = [
    ...(image.objects || []),
    ...(image.roadUsers || []),
    ...(image.signsSignalsMarkings || [])
  ].filter(hasConcreteVisualObject);
  if (concreteObjects.length < 1) {
    errors.push(`${label}: full-quality image metadata must include concrete non-placeholder visible objects with at least medium confidence.`);
  }
  if (!Array.isArray(image.visualDetails) || image.visualDetails.length < 1) {
    errors.push(`${label}: full-quality image metadata must include visualDetails that name visible, recreatable image facts.`);
  }
  if (image.review?.qualityStatus && image.review.qualityStatus !== "complete") {
    errors.push(`${label}: review.qualityStatus must be complete for full-quality image metadata.`);
  }
}

function requireFullQualityUsageDetail(detail, label, errors) {
  if (hasGenericUsageDetail(detail)) {
    errors.push(`${label}: critical detail ${detail.detailId || "(missing id)"} must name actual visible answer-critical facts, not source-image or answer-cue placeholders.`);
  }
  if (!isNonEmptyString(detail.description) || detail.description.trim().length < 24) {
    errors.push(`${label}: critical detail ${detail.detailId || "(missing id)"} must include a specific visible-fact description.`);
  }
  if (detail.criticality === "required" && detail.confidence === "low") {
    errors.push(`${label}: required critical detail ${detail.detailId || "(missing id)"} cannot have low confidence in the full-quality gate.`);
  }
}

function requireRelevanceMap({ usage, image, question, label, requireFullQuality, errors }) {
  if (usage.relevanceMap === undefined) {
    if (requireFullQuality) errors.push(`${label}: full-quality usage must include relevanceMap.`);
    return;
  }
  if (!Array.isArray(usage.relevanceMap)) {
    errors.push(`${label}: relevanceMap must be an array when present.`);
    return;
  }

  const allowedRoles = new Set(["answer_critical_highlight", "supporting", "distractor_trap", "background_irrelevant_dim"]);
  const allowedDisplayIntents = new Set(["highlight", "keep_visible", "callout_optional", "dim"]);
  const roles = [];
  const objectIds = image ? allObjectIds(image) : new Set();
  const detailIds = image ? allDetailIds(image, usage) : new Set();
  const regionIds = image ? allRegionIds(image) : new Set();
  const referenceIds = image ? allReferenceIds(image, usage) : new Set();
  const sourceAnswerIds = new Set((question.answers || []).map((answer) => answer.id));

  for (const relevance of usage.relevanceMap) {
    if (!isPlainObject(relevance)) {
      errors.push(`${label}: relevanceMap entries must be objects.`);
      continue;
    }
    const relevanceId = relevance.relevanceId || relevance.targetId;
    const relevanceLabel = `${label}: relevance ${relevanceId || "(missing id)"}`;
    if (!isNonEmptyString(relevanceId)) errors.push(`${relevanceLabel} must have a non-empty relevanceId or targetId.`);
    const role = typeof relevance.role === "string" ? relevance.role.replace(/[/-]/g, "_") : "";
    if (!allowedRoles.has(role)) errors.push(`${relevanceLabel} role is invalid.`);
    roles.push(role);
    if (!isNonEmptyString(relevance.rationaleRuOrEn || relevance.rationaleRu)) {
      errors.push(`${relevanceLabel} must include rationaleRuOrEn or rationaleRu.`);
    }
    if (relevance.confidence !== undefined && !["high", "medium", "low"].includes(relevance.confidence)) {
      errors.push(`${relevanceLabel} confidence is invalid.`);
    }
    if (relevance.displayIntent !== undefined && !allowedDisplayIntents.has(relevance.displayIntent)) {
      errors.push(`${relevanceLabel} displayIntent is invalid.`);
    }
    const referencedCount =
      (relevance.detailIds || []).length +
      (relevance.objectIds || []).length +
      (relevance.regionIds || []).length +
      (isNonEmptyString(relevance.targetId) ? 1 : 0);
    if (requireFullQuality && role === "answer_critical_highlight" && referencedCount < 1) {
      errors.push(`${relevanceLabel} must reference at least one detail, object, region, or target id.`);
    }
    for (const detailId of relevance.detailIds || []) {
      if (!detailIds.has(detailId)) errors.push(`${relevanceLabel} references missing detail ${detailId}.`);
    }
    for (const objectId of relevance.objectIds || []) {
      if (!objectIds.has(objectId)) errors.push(`${relevanceLabel} references missing object ${objectId}.`);
    }
    for (const regionId of relevance.regionIds || []) {
      if (!regionIds.has(regionId)) errors.push(`${relevanceLabel} references missing region ${regionId}.`);
    }
    if (isNonEmptyString(relevance.targetId) && !referenceIds.has(relevance.targetId)) {
      errors.push(`${relevanceLabel} references missing target ${relevance.targetId}.`);
    }
    for (const answerId of [...(relevance.supportsAnswerIds || []), ...(relevance.rejectsAnswerIds || []), ...(relevance.answerIds || [])]) {
      if (!sourceAnswerIds.has(answerId)) errors.push(`${relevanceLabel} references missing answer ${answerId}.`);
    }
  }

  if (requireFullQuality) {
    if (!roles.includes("answer_critical_highlight")) {
      errors.push(`${label}: full-quality usage must include an answer_critical_highlight relevance role.`);
    }
    if (!roles.some((role) => role !== "answer_critical_highlight")) {
      errors.push(`${label}: full-quality usage must include non-critical supporting, distractor, or background relevance context.`);
    }
    if (roles.length > 0 && roles.every((role) => role === "answer_critical_highlight")) {
      errors.push(`${label}: full-quality usage must not mark every relevance entry answer-critical.`);
    }
  }
}

function requireEvidenceEntry(entry, label, expectedHashes, checks, errors) {
  if (!entry) {
    errors.push(`${label}: missing approved image metadata evidence.`);
    return;
  }
  if (entry.status !== "approved") errors.push(`${label}: evidence status must be approved.`);
  if (!isNonEmptyString(entry.reviewer)) errors.push(`${label}: evidence reviewer must be a non-empty string.`);
  if (!REVIEW_DATE_PATTERN.test(entry.reviewedAt || "")) errors.push(`${label}: evidence reviewedAt must be YYYY-MM-DD.`);
  for (const [field, expected] of Object.entries(expectedHashes)) {
    if (entry[field] !== expected) errors.push(`${label}: evidence ${field} mismatch.`);
  }
  for (const check of checks) {
    if (entry.checks?.[check] !== true) errors.push(`${label}: evidence checks.${check} must be true.`);
  }
}

function validateB001({ image, usage, errors }) {
  if (!image || !usage) return;
  if (image.localPath !== "content/assets/questions/source-bandinopla-testdeconducir-b/b13.jpg") {
    errors.push("b-fallback-001: image metadata must reference b13.jpg.");
  }
  if (image.sha256 !== "aae6435fd73747197db844c9cfc7f520b94efb5095e33f043b84d5dc15e7f2b7") {
    errors.push("b-fallback-001: image metadata must keep the current b13.jpg hash.");
  }
  const cyclist = [...(image.roadUsers || []), ...(image.objects || [])].find(
    (object) => object.id === "cyclist-foreground" && object.type === "cyclist"
  );
  if (!cyclist) errors.push("b-fallback-001: image metadata must include cyclist-foreground with type cyclist.");
  const gesture = (cyclist?.gestures || []).find((item) => item.id === "right-arm-straight-horizontal");
  if (!gesture) {
    errors.push("b-fallback-001: cyclist metadata must include right-arm-straight-horizontal gesture.");
  } else {
    if (gesture.bodyPart !== "right_arm") errors.push("b-fallback-001: gesture bodyPart must be right_arm.");
    if (gesture.pose !== "extended_straight_horizontal") {
      errors.push("b-fallback-001: gesture pose must be extended_straight_horizontal.");
    }
    if (gesture.actorPerspectiveDirection !== "right") {
      errors.push("b-fallback-001: gesture actorPerspectiveDirection must be right.");
    }
    if (gesture.viewerPerspectiveDirection !== "left") {
      errors.push("b-fallback-001: gesture viewerPerspectiveDirection must be left.");
    }
  }
  const hasHelmet = cyclist?.attributes?.helmet === true;
  if (!hasHelmet) errors.push("b-fallback-001: cyclist metadata must record helmet=true.");
  const redOval = (image.annotations || []).some((annotation) => annotation.type === "red_oval" && annotation.targetIds?.includes("right-arm-straight-horizontal"));
  if (!redOval) errors.push("b-fallback-001: image metadata must include a red oval annotation for the right-arm gesture.");
  const criticalDetails = usage.answerCriticalDetails || [];
  if (!criticalDetails.some((detail) => detail.objectIds?.includes("cyclist-foreground") && detail.supportsAnswerIds?.includes("b-fallback-001-a2"))) {
    errors.push("b-fallback-001: usage must mark the cyclist as answer-critical for b-fallback-001-a2.");
  }
  if (!criticalDetails.some((detail) => detail.detailId === "right-arm-straight-horizontal" && detail.supportsAnswerIds?.includes("b-fallback-001-a2"))) {
    errors.push("b-fallback-001: usage must mark the right-arm straight gesture as answer-critical for b-fallback-001-a2.");
  }
}

export function validateQuestionImageMetadata({ questions, manifest, evidence, strictCoverage = true, requireFullQuality = false }) {
  const errors = [];
  const { imageBackedQuestions, uniqueImages } = collectImageReferences(questions);
  const questionById = new Map((questions || []).map((question) => [question.id, question]));
  const imageRefsByPath = new Map(uniqueImages.map((image) => [image.localPath, image]));

  for (const image of uniqueImages) {
    if (image.hashConflict) errors.push(`${image.localPath}: image references disagree on sha256.`);
  }

  if (!isPlainObject(manifest)) {
    errors.push("question image metadata manifest must be an object.");
    return errors;
  }
  if (manifest.version !== 1) errors.push("question image metadata manifest version must be 1.");
  if (manifest.questionSourcePath !== "content/questions/caba-b.unofficial-fallback.questions.json") {
    errors.push("question image metadata manifest questionSourcePath must point to the fallback question file.");
  }
  if (manifest.baseline?.questionCount !== (questions || []).length) {
    errors.push("question image metadata baseline.questionCount mismatch.");
  }
  if (manifest.baseline?.imageReferenceCount !== imageBackedQuestions.length) {
    errors.push("question image metadata baseline.imageReferenceCount mismatch.");
  }
  if (manifest.baseline?.uniqueImageCount !== uniqueImages.length) {
    errors.push("question image metadata baseline.uniqueImageCount mismatch.");
  }
  if (manifest.baseline?.questionSetFingerprint !== questionSetFingerprint(questions || [])) {
    errors.push("question image metadata baseline.questionSetFingerprint mismatch.");
  }
  if (manifest.baseline?.imageReferenceFingerprint !== imageReferenceFingerprint(questions || [])) {
    errors.push("question image metadata baseline.imageReferenceFingerprint mismatch.");
  }
  if (!Array.isArray(manifest.images)) errors.push("question image metadata manifest images must be an array.");
  if (!Array.isArray(manifest.questionUsages)) errors.push("question image metadata manifest questionUsages must be an array.");

  if (!isPlainObject(evidence)) {
    errors.push("question image metadata evidence must be an object.");
    evidence = {};
  } else {
    if (evidence.version !== 1) errors.push("question image metadata evidence version must be 1.");
  }
  const imageEvidenceEntries = Array.isArray(evidence.imageEntries) ? evidence.imageEntries : [];
  const usageEvidenceEntries = Array.isArray(evidence.usageEntries) ? evidence.usageEntries : [];
  if (!Array.isArray(evidence.imageEntries)) errors.push("question image metadata evidence imageEntries must be an array.");
  if (!Array.isArray(evidence.usageEntries)) errors.push("question image metadata evidence usageEntries must be an array.");
  const imageEvidenceById = new Map();
  const usageEvidenceByQuestionId = new Map();
  for (const entry of imageEvidenceEntries) {
    if (imageEvidenceById.has(entry?.imageId)) errors.push(`${entry.imageId}: duplicate image metadata evidence.`);
    imageEvidenceById.set(entry?.imageId, entry);
  }
  for (const entry of usageEvidenceEntries) {
    if (usageEvidenceByQuestionId.has(entry?.questionId)) errors.push(`${entry.questionId}: duplicate question usage evidence.`);
    usageEvidenceByQuestionId.set(entry?.questionId, entry);
  }

  const images = Array.isArray(manifest.images) ? manifest.images : [];
  const usages = Array.isArray(manifest.questionUsages) ? manifest.questionUsages : [];
  const imageById = new Map();
  const imageByPath = new Map();

  for (const image of images) {
    const label = isNonEmptyString(image?.imageId) ? image.imageId : "image metadata entry";
    if (!isPlainObject(image)) {
      errors.push("image metadata entry must be an object.");
      continue;
    }
    if (!isNonEmptyString(image.imageId)) errors.push(`${label}: imageId must be a non-empty string.`);
    if (imageById.has(image.imageId)) errors.push(`${image.imageId}: duplicate image metadata id.`);
    imageById.set(image.imageId, image);
    if (!isNonEmptyString(image.localPath)) errors.push(`${label}: localPath must be a non-empty string.`);
    if (imageByPath.has(image.localPath)) errors.push(`${image.localPath}: duplicate image metadata localPath.`);
    imageByPath.set(image.localPath, image);
    const sourceRef = imageRefsByPath.get(image.localPath);
    if (strictCoverage && !sourceRef) errors.push(`${label}: image metadata localPath is not referenced by current questions.`);
    if (sourceRef && sourceRef.sha256 !== image.sha256) errors.push(`${label}: image metadata sha256 mismatch for current question image.`);
    if (!SHA256_PATTERN.test(image.sha256 || "")) errors.push(`${label}: sha256 must be a sha256 hex digest.`);
    if (!isNonEmptyString(image.kind)) errors.push(`${label}: kind must be a non-empty string.`);
    if (image.descriptionLanguage !== "en") errors.push(`${label}: descriptionLanguage must be en.`);
    if (!isNonEmptyString(image.visualSummary)) errors.push(`${label}: visualSummary must be a non-empty string.`);
    if (!isNonEmptyString(image.generationPromptSummary)) errors.push(`${label}: generationPromptSummary must be a non-empty string.`);
    if (!Array.isArray(image.objects) || image.objects.length < 1) errors.push(`${label}: objects must include at least one object.`);
    if (!Array.isArray(image.uncertainties)) errors.push(`${label}: uncertainties must be an array.`);
    requireQuestionNeutralSharedMetadata(image, label, errors);
    if (requireFullQuality) requireFullQualityImageMetadata(image, label, errors);
    requireApprovedReview(image.review, label, errors);
    requireEvidenceEntry(
      imageEvidenceById.get(image.imageId),
      label,
      {
        imageSha256: image.sha256,
        metadataSha256: imageMetadataFingerprint(image)
      },
      ["pathAndHashCurrent", "visualCoverageReviewed", "objectDetailCoverageReviewed", "uncertaintyRecorded", "noInventedCriticalFacts"],
      errors
    );
  }

  if (strictCoverage) {
    for (const image of uniqueImages) {
      if (!imageByPath.has(image.localPath)) errors.push(`${image.localPath}: missing image metadata entry.`);
    }
  }

  const usageByQuestionId = new Map();
  for (const usage of usages) {
    const label = isNonEmptyString(usage?.questionId) ? usage.questionId : "question image usage";
    if (!isPlainObject(usage)) {
      errors.push("question image usage must be an object.");
      continue;
    }
    if (!isNonEmptyString(usage.questionId)) errors.push(`${label}: questionId must be a non-empty string.`);
    if (usageByQuestionId.has(usage.questionId)) errors.push(`${usage.questionId}: duplicate question image usage.`);
    usageByQuestionId.set(usage.questionId, usage);
    const question = questionById.get(usage.questionId);
    if (!question) {
      errors.push(`${label}: usage references missing question.`);
      continue;
    }
    if (!question.image) errors.push(`${label}: usage references a question without an image.`);
    const image = imageById.get(usage.imageId);
    if (!image) errors.push(`${label}: usage references missing image ${usage.imageId}.`);
    if (question.image && usage.localPath !== question.image.localPath) errors.push(`${label}: usage localPath does not match question image.`);
    if (question.image && usage.imageSha256 !== question.image.sha256) errors.push(`${label}: usage imageSha256 does not match question image.`);
    if (image && usage.localPath !== image.localPath) errors.push(`${label}: usage localPath does not match image metadata.`);
    if (image && usage.imageSha256 !== image.sha256) errors.push(`${label}: usage imageSha256 does not match image metadata.`);
    if (usage.questionFingerprint !== questionFingerprint(question)) errors.push(`${label}: usage questionFingerprint mismatch.`);
    if (usage.correctAnswerId !== question.correctAnswerId) errors.push(`${label}: usage correctAnswerId mismatch.`);
    if (!["answer_critical", "contextual_with_critical_detail"].includes(usage.imageRole)) {
      errors.push(`${label}: usage imageRole is invalid.`);
    }
    if (!Array.isArray(usage.answerCriticalDetails) || usage.answerCriticalDetails.length < 1) {
      errors.push(`${label}: usage must include at least one answer-critical detail.`);
    }
    const sourceAnswerIds = new Set((question.answers || []).map((answer) => answer.id));
    const objectIds = image ? allObjectIds(image) : new Set();
    const detailIds = image ? allDetailIds(image, usage) : new Set();
    const detailIdSet = new Set();
    for (const detail of usage.answerCriticalDetails || []) {
      if (!isNonEmptyString(detail.detailId)) errors.push(`${label}: critical detail id must be non-empty.`);
      if (detailIdSet.has(detail.detailId)) errors.push(`${label}: duplicate critical detail ${detail.detailId}.`);
      detailIdSet.add(detail.detailId);
      if (requireFullQuality) requireFullQualityUsageDetail(detail, label, errors);
      if (!detailIds.has(detail.detailId)) errors.push(`${label}: critical detail ${detail.detailId} is not present in the metadata detail set.`);
      if (!Array.isArray(detail.objectIds) || detail.objectIds.length < 1) errors.push(`${label}: critical detail ${detail.detailId} must reference objectIds.`);
      for (const objectId of detail.objectIds || []) {
        if (!objectIds.has(objectId)) errors.push(`${label}: critical detail ${detail.detailId} references missing object ${objectId}.`);
      }
      for (const answerId of [...(detail.supportsAnswerIds || []), ...(detail.rejectsAnswerIds || [])]) {
        if (!sourceAnswerIds.has(answerId)) errors.push(`${label}: critical detail ${detail.detailId} references missing answer ${answerId}.`);
      }
      if (!["required", "trap", "supporting"].includes(detail.criticality)) errors.push(`${label}: criticality is invalid for ${detail.detailId}.`);
      if (!["high", "medium", "low"].includes(detail.confidence)) errors.push(`${label}: confidence is invalid for ${detail.detailId}.`);
    }
    requireRelevanceMap({ usage, image, question, label, requireFullQuality, errors });
    requireApprovedReview(usage.review, label, errors);
    requireEvidenceEntry(
      usageEvidenceByQuestionId.get(usage.questionId),
      label,
      {
        questionFingerprint: questionFingerprint(question),
        usageSha256: questionUsageFingerprint(usage)
      },
      ["questionTupleCurrent", "imageReferenceCurrent", "criticalDetailsMapped", "answerLinksCurrent"],
      errors
    );
  }

  if (strictCoverage) {
    for (const question of imageBackedQuestions) {
      if (!usageByQuestionId.has(question.id)) errors.push(`${question.id}: missing question image usage mapping.`);
    }
  }

  const b001Usage = usageByQuestionId.get("b-fallback-001");
  const b001Image = b001Usage ? imageById.get(b001Usage.imageId) : undefined;
  if (questionById.has("b-fallback-001")) validateB001({ image: b001Image, usage: b001Usage, errors });

  return errors;
}
