import {
  imageMetadataFingerprint,
  questionFingerprint,
  questionUsageFingerprint,
  sha256Canonical
} from "./content-image-metadata.mjs";

const SHA256_PATTERN = /^[a-f0-9]{64}$/;
const REVIEW_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}

function explanationTupleForQuestion(question, explanation) {
  const wrongAnswerExplanations = isPlainObject(explanation.wrongAnswerExplanations)
    ? explanation.wrongAnswerExplanations
    : {};
  return {
    questionId: explanation.questionId,
    textRu: explanation.textRu,
    correctAnswerId: explanation.correctAnswerId,
    correctAnswerExplanationRu: explanation.correctAnswerExplanationRu,
    wrongAnswerExplanations: (question.answers || [])
      .filter((answer) => answer.id !== question.correctAnswerId)
      .map((answer) => ({
        id: answer.id,
        textRu: wrongAnswerExplanations[answer.id] || ""
      })),
    explanationType: explanation.explanationType,
    claimScope: explanation.claimScope || null,
    relatedSourceIds: explanation.relatedSourceIds || [],
    imageDetailReferences: explanation.imageDetailReferences || [],
    visualClaims: explanation.visualClaims || []
  };
}

export function explanationFingerprint(question, explanation) {
  return sha256Canonical(explanationTupleForQuestion(question, explanation));
}

export function buildExplanationAlignmentEvidenceEntry({ question, explanation, image, usage, reviewer, reviewedAt, notes }) {
  return {
    questionId: explanation.questionId,
    status: "approved",
    reviewer,
    reviewedAt,
    sourceQuestionSha256: questionFingerprint(question),
    explanationSha256: explanationFingerprint(question, explanation),
    ...(image && usage
      ? {
          imageId: image.imageId,
          imageMetadataSha256: imageMetadataFingerprint(image),
          usageSha256: questionUsageFingerprint(usage)
        }
      : {}),
    checks: {
      correctAnswerRationalePresent: true,
      wrongAnswerRationalesPresent: true,
      claimScopeReviewed: true,
      imageCriticalDetailsAddressed: image && usage ? true : undefined,
      noVisualContradiction: image && usage ? true : undefined
    },
    notes
  };
}

function findImageAndUsage({ question, imageMetadataManifest }) {
  const usage = (imageMetadataManifest?.questionUsages || []).find((item) => item.questionId === question.id);
  const image = usage ? (imageMetadataManifest?.images || []).find((item) => item.imageId === usage.imageId) : undefined;
  return { image, usage };
}

function allVisualObjects(image) {
  const objects = new Map();
  for (const object of [...(image?.objects || []), ...(image?.roadUsers || []), ...(image?.signsSignalsMarkings || [])]) {
    if (isNonEmptyString(object.id)) objects.set(object.id, object);
  }
  for (const annotation of image?.annotations || []) {
    if (isNonEmptyString(annotation.id)) objects.set(annotation.id, annotation);
  }
  return objects;
}

function findGesture(image, gestureId) {
  for (const roadUser of image?.roadUsers || []) {
    for (const gesture of roadUser.gestures || []) {
      if (gesture.id === gestureId) return gesture;
    }
  }
  return undefined;
}

function validateVisualClaims({ explanation, image, label, errors }) {
  const visualClaims = explanation.visualClaims || [];
  if (!Array.isArray(visualClaims)) {
    errors.push(`${label}: visualClaims must be an array when present.`);
    return;
  }
  const objects = allVisualObjects(image);
  for (const claim of visualClaims) {
    if (!isPlainObject(claim)) {
      errors.push(`${label}: visual claim must be an object.`);
      continue;
    }
    if (!isNonEmptyString(claim.objectId)) {
      errors.push(`${label}: visual claim objectId must be non-empty.`);
      continue;
    }
    const object = objects.get(claim.objectId);
    if (!object) {
      errors.push(`${label}: visual claim references missing object ${claim.objectId}.`);
      continue;
    }
    if (isNonEmptyString(claim.objectType) && object.type && claim.objectType !== object.type) {
      errors.push(`${label}: visual claim objectType ${claim.objectType} contradicts metadata type ${object.type}.`);
    }
    if (isNonEmptyString(claim.gestureId)) {
      const gesture = findGesture(image, claim.gestureId);
      if (!gesture) {
        errors.push(`${label}: visual claim references missing gesture ${claim.gestureId}.`);
        continue;
      }
      if (isNonEmptyString(claim.bodyPart) && gesture.bodyPart !== claim.bodyPart) {
        errors.push(`${label}: visual claim bodyPart ${claim.bodyPart} contradicts metadata bodyPart ${gesture.bodyPart}.`);
      }
      if (isNonEmptyString(claim.pose) && gesture.pose !== claim.pose) {
        errors.push(`${label}: visual claim pose ${claim.pose} contradicts metadata pose ${gesture.pose}.`);
      }
      if (isNonEmptyString(claim.actorPerspectiveDirection) && gesture.actorPerspectiveDirection !== claim.actorPerspectiveDirection) {
        errors.push(
          `${label}: visual claim actorPerspectiveDirection ${claim.actorPerspectiveDirection} contradicts metadata actorPerspectiveDirection ${gesture.actorPerspectiveDirection}.`
        );
      }
      if (isNonEmptyString(claim.viewerPerspectiveDirection) && gesture.viewerPerspectiveDirection !== claim.viewerPerspectiveDirection) {
        errors.push(
          `${label}: visual claim viewerPerspectiveDirection ${claim.viewerPerspectiveDirection} contradicts metadata viewerPerspectiveDirection ${gesture.viewerPerspectiveDirection}.`
        );
      }
    }
  }
}

function requireEvidenceEntry(entry, label, expectedHashes, requiredChecks, errors) {
  if (!entry) {
    errors.push(`${label}: missing approved explanation alignment evidence.`);
    return;
  }
  if (entry.status !== "approved") errors.push(`${label}: explanation alignment evidence status must be approved.`);
  if (!isNonEmptyString(entry.reviewer)) errors.push(`${label}: explanation alignment evidence reviewer must be a non-empty string.`);
  if (!REVIEW_DATE_PATTERN.test(entry.reviewedAt || "")) {
    errors.push(`${label}: explanation alignment evidence reviewedAt must be YYYY-MM-DD.`);
  }
  for (const [field, expected] of Object.entries(expectedHashes)) {
    if (entry[field] !== expected) errors.push(`${label}: explanation alignment evidence ${field} mismatch.`);
  }
  for (const [field, expected] of Object.entries(expectedHashes)) {
    if (field.endsWith("Sha256") && !SHA256_PATTERN.test(entry[field] || "")) {
      errors.push(`${label}: explanation alignment evidence ${field} must be a sha256 hex digest.`);
    }
    if (expected === undefined && entry[field] !== undefined) {
      errors.push(`${label}: explanation alignment evidence ${field} should be omitted.`);
    }
  }
  for (const check of requiredChecks) {
    if (entry.checks?.[check] !== true) errors.push(`${label}: explanation alignment evidence checks.${check} must be true.`);
  }
}

export function validateExplanationAlignment({
  questions,
  explanations,
  imageMetadataManifest,
  evidence,
  locale = "ru",
  strictCoverage = true
}) {
  const errors = [];
  const questionById = new Map((questions || []).map((question) => [question.id, question]));
  const explanationByQuestionId = new Map();

  if (!isPlainObject(evidence)) {
    errors.push("explanation alignment evidence must be an object.");
    evidence = {};
  } else {
    if (evidence.locale !== locale) errors.push(`explanation alignment evidence locale must be ${locale}.`);
    if (evidence.version !== 1) errors.push("explanation alignment evidence version must be 1.");
  }
  const evidenceEntries = Array.isArray(evidence.entries) ? evidence.entries : [];
  if (!Array.isArray(evidence.entries)) errors.push("explanation alignment evidence entries must be an array.");
  const evidenceByQuestionId = new Map();
  for (const entry of evidenceEntries) {
    const label = isNonEmptyString(entry?.questionId) ? entry.questionId : "explanation evidence entry";
    if (!isPlainObject(entry)) {
      errors.push("explanation evidence entry must be an object.");
      continue;
    }
    if (!isNonEmptyString(entry.questionId)) errors.push(`${label}: evidence questionId must be a non-empty string.`);
    if (evidenceByQuestionId.has(entry.questionId)) errors.push(`${entry.questionId}: duplicate explanation alignment evidence.`);
    evidenceByQuestionId.set(entry.questionId, entry);
  }

  for (const explanation of explanations || []) {
    const label = isNonEmptyString(explanation?.questionId) ? explanation.questionId : "explanation";
    if (!isPlainObject(explanation)) {
      errors.push("explanation entry must be an object.");
      continue;
    }
    if (!isNonEmptyString(explanation.questionId)) {
      errors.push("explanation questionId must be a non-empty string.");
      continue;
    }
    if (explanationByQuestionId.has(explanation.questionId)) errors.push(`${explanation.questionId}: duplicate explanation entry.`);
    explanationByQuestionId.set(explanation.questionId, explanation);

    const question = questionById.get(explanation.questionId);
    if (!question) {
      errors.push(`${label}: explanation references missing question.`);
      continue;
    }
    if (!isNonEmptyString(explanation.textRu)) errors.push(`${label}: textRu must be a non-empty string.`);
    if (!isNonEmptyString(explanation.correctAnswerId)) errors.push(`${label}: correctAnswerId must be a non-empty string.`);
    if (explanation.correctAnswerId !== question.correctAnswerId) errors.push(`${label}: correctAnswerId must match the current question.`);
    if (!isNonEmptyString(explanation.correctAnswerExplanationRu)) {
      errors.push(`${label}: correctAnswerExplanationRu must be a non-empty string.`);
    }
    if (!isPlainObject(explanation.wrongAnswerExplanations)) {
      errors.push(`${label}: wrongAnswerExplanations must be an object.`);
    }
    if (!["direct_ticket", "direct_image", "ticket_specific_fallback", "current_official_source"].includes(explanation.claimScope)) {
      errors.push(`${label}: claimScope is invalid.`);
    }
    if (!Array.isArray(explanation.relatedSourceIds) || explanation.relatedSourceIds.length < 1) {
      errors.push(`${label}: relatedSourceIds must include at least one source id.`);
    }
    if (!explanation.disclaimer?.includes("не является официальной")) {
      errors.push(`${label}: explanation disclaimer is missing official-status language.`);
    }

    const sourceAnswerIds = new Set((question.answers || []).map((answer) => answer.id));
    const wrongAnswerIds = (question.answers || []).filter((answer) => answer.id !== question.correctAnswerId).map((answer) => answer.id);
    const wrongAnswerExplanations = isPlainObject(explanation.wrongAnswerExplanations) ? explanation.wrongAnswerExplanations : {};
    const providedWrongIds = new Set(Object.keys(wrongAnswerExplanations));
    for (const answerId of wrongAnswerIds) {
      if (!providedWrongIds.has(answerId)) errors.push(`${label}: missing wrong-answer rationale for ${answerId}.`);
      if (providedWrongIds.has(answerId) && !isNonEmptyString(wrongAnswerExplanations[answerId])) {
        errors.push(`${label}: wrong-answer rationale for ${answerId} must be a non-empty string.`);
      }
    }
    for (const answerId of providedWrongIds) {
      if (!sourceAnswerIds.has(answerId)) errors.push(`${label}: wrongAnswerExplanations references missing answer ${answerId}.`);
      if (answerId === question.correctAnswerId) errors.push(`${label}: wrongAnswerExplanations must not include the correct answer ${answerId}.`);
    }

    const { image, usage } = findImageAndUsage({ question, imageMetadataManifest });
    const expectedHashes = {
      sourceQuestionSha256: questionFingerprint(question),
      explanationSha256: explanationFingerprint(question, explanation)
    };
    const requiredChecks = ["correctAnswerRationalePresent", "wrongAnswerRationalesPresent", "claimScopeReviewed"];
    if (question.image) {
      if (!usage) errors.push(`${label}: image-backed question is missing a question image usage mapping.`);
      if (!image) errors.push(`${label}: image-backed question is missing image metadata.`);
      if (!Array.isArray(explanation.imageDetailReferences) || explanation.imageDetailReferences.length < 1) {
        errors.push(`${label}: image-backed explanation must reference image-critical details.`);
      }
      const refs = new Set(explanation.imageDetailReferences || []);
      for (const detail of usage?.answerCriticalDetails || []) {
        if (detail.criticality === "required" && !refs.has(detail.detailId)) {
          errors.push(`${label}: explanation missing required image detail reference ${detail.detailId}.`);
        }
      }
      if (image && usage) {
        expectedHashes.imageMetadataSha256 = imageMetadataFingerprint(image);
        expectedHashes.usageSha256 = questionUsageFingerprint(usage);
        requiredChecks.push("imageCriticalDetailsAddressed", "noVisualContradiction");
        validateVisualClaims({ explanation, image, label, errors });
      }
    }

    requireEvidenceEntry(evidenceByQuestionId.get(explanation.questionId), label, expectedHashes, requiredChecks, errors);
  }

  if (strictCoverage) {
    for (const question of questions || []) {
      if (!explanationByQuestionId.has(question.id)) errors.push(`${question.id}: missing explanation entry.`);
    }
  }
  for (const entry of evidenceEntries) {
    if (isNonEmptyString(entry?.questionId) && !explanationByQuestionId.has(entry.questionId)) {
      errors.push(`${entry.questionId}: explanation alignment evidence has no matching explanation entry.`);
    }
  }

  return errors;
}
