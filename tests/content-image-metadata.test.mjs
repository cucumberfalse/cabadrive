import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  buildImageMetadataEvidenceEntry,
  buildQuestionUsageEvidenceEntry,
  questionFingerprint,
  validateQuestionImageMetadata
} from "../scripts/content-image-metadata.mjs";

const reviewer = "Cabadrive solo self-audit";
const reviewedAt = "2026-05-09";

const baseQuestion = {
  id: "q1",
  sourceId: "source-1",
  officialTextEs: "¿Qué indica esta señal?",
  answers: [
    { id: "q1-a1", officialTextEs: "Opción incorrecta." },
    { id: "q1-a2", officialTextEs: "Opción correcta." }
  ],
  correctAnswerId: "q1-a2",
  image: {
    localPath: "content/assets/questions/example.jpg",
    originalUrl: "https://example.invalid/example.jpg",
    sha256: "1".repeat(64)
  }
};

function baseImage() {
  return {
    imageId: "question-image-example",
    localPath: baseQuestion.image.localPath,
    originalUrl: baseQuestion.image.originalUrl,
    sha256: baseQuestion.image.sha256,
    sourceIds: ["source-1"],
    kind: "traffic_sign",
    descriptionLanguage: "en",
    visualSummary: "A reviewed synthetic sign image.",
    generationPromptSummary: "Synthetic sign image prompt.",
    scene: { setting: "synthetic" },
    objects: [{ id: "sign", type: "traffic_sign", label: "sign", confidence: "high" }],
    regions: [{ regionId: "sign-region", label: "sign region", semanticLocation: "center", localizationConfidence: "high" }],
    roadUsers: [],
    signsSignalsMarkings: [],
    visualDetails: [{ id: "sign-shape", objectIds: ["sign"], regionIds: ["sign-region"], description: "The sign shape is visible and answer-critical." }],
    annotations: [],
    visibleText: [],
    spatialRelationships: [],
    uncertainties: [],
    review: {
      status: "approved",
      reviewer,
      reviewedAt
    }
  };
}

function baseUsage() {
  return {
    questionId: baseQuestion.id,
    imageId: "question-image-example",
    localPath: baseQuestion.image.localPath,
    imageSha256: baseQuestion.image.sha256,
    questionFingerprint: questionFingerprint(baseQuestion),
    correctAnswerId: baseQuestion.correctAnswerId,
    answerCriticalDetails: [
      {
        detailId: "sign-shape",
        objectIds: ["sign"],
        regionIds: ["sign-region"],
        description: "The sign is the relevant visual cue.",
        supportsAnswerIds: ["q1-a2"],
        rejectsAnswerIds: ["q1-a1"],
        criticality: "required",
        confidence: "high"
      }
    ],
    imageRole: "answer_critical",
    relevanceMap: [
      {
        relevanceId: "sign-shape-highlight",
        detailIds: ["sign-shape"],
        objectIds: ["sign"],
        regionIds: ["sign-region"],
        role: "answer_critical_highlight",
        rationaleRuOrEn: "The sign shape is the question-specific cue for the correct answer.",
        supportsAnswerIds: ["q1-a2"],
        rejectsAnswerIds: ["q1-a1"],
        displayIntent: "highlight",
        confidence: "high"
      },
      {
        relevanceId: "sign-background-context",
        detailIds: [],
        objectIds: ["sign"],
        regionIds: ["sign-region"],
        role: "supporting",
        rationaleRuOrEn: "The visible sign panel should remain visible as supporting context.",
        displayIntent: "keep_visible",
        confidence: "high"
      }
    ],
    review: {
      status: "approved",
      reviewer,
      reviewedAt
    }
  };
}

function manifestAndEvidence({ image = baseImage(), usage = baseUsage() } = {}) {
  const manifest = {
    version: 1,
    questionSourcePath: "content/questions/caba-b.unofficial-fallback.questions.json",
    baseline: {
      questionCount: 1,
      imageReferenceCount: 1,
      uniqueImageCount: 1,
      questionSetFingerprint: "placeholder",
      imageReferenceFingerprint: "placeholder"
    },
    images: [image],
    questionUsages: [usage]
  };
  const evidence = {
    version: 1,
    imageEntries: [buildImageMetadataEvidenceEntry({ image, reviewer, reviewedAt })],
    usageEntries: [buildQuestionUsageEvidenceEntry({ usage, reviewer, reviewedAt })]
  };
  return { manifest, evidence };
}

function validateSynthetic(input = {}) {
  const { manifest, evidence } = manifestAndEvidence(input);
  manifest.baseline.questionSetFingerprint = "skip";
  manifest.baseline.imageReferenceFingerprint = "skip";
  return validateQuestionImageMetadata({
    questions: [baseQuestion],
    manifest,
    evidence,
    strictCoverage: false
  }).filter((error) => !error.includes("baseline.questionSetFingerprint") && !error.includes("baseline.imageReferenceFingerprint"));
}

function validateSyntheticFullQuality(input = {}) {
  const image = input.image || {
    ...baseImage(),
    review: {
      ...baseImage().review,
      qualityStatus: "complete",
      visualReviewEvidence: {
        method: "actual_image_inspection",
        reviewerNotes: "Synthetic reviewed sign fixture with a visible answer-critical sign shape.",
        sceneCoverage: true,
        objectCoverage: true,
        answerCriticalCoverage: true
      }
    }
  };
  const usage = input.usage || baseUsage();
  const { manifest, evidence } = manifestAndEvidence({ image, usage });
  manifest.baseline.questionSetFingerprint = "skip";
  manifest.baseline.imageReferenceFingerprint = "skip";
  return validateQuestionImageMetadata({
    questions: [baseQuestion],
    manifest,
    evidence,
    strictCoverage: false,
    requireFullQuality: true
  }).filter((error) => !error.includes("baseline.questionSetFingerprint") && !error.includes("baseline.imageReferenceFingerprint"));
}

test("current question image metadata has approved fresh coverage", () => {
  const questions = JSON.parse(readFileSync("content/questions/caba-b.unofficial-fallback.questions.json", "utf8"));
  const manifest = JSON.parse(readFileSync("content/image-metadata/question-images.manifest.json", "utf8"));
  const evidence = JSON.parse(readFileSync("content/validation/question-image-metadata.evidence.json", "utf8"));
  assert.deepEqual(validateQuestionImageMetadata({ questions, manifest, evidence }), []);
});

test("missing critical details fail image usage validation", () => {
  const usage = { ...baseUsage(), answerCriticalDetails: [] };
  const errors = validateSynthetic({ usage });
  assert(errors.includes("q1: usage must include at least one answer-critical detail."));
});

test("full-quality image gate accepts concrete reviewed metadata", () => {
  assert.deepEqual(validateSyntheticFullQuality(), []);
});

test("full-quality image gate rejects placeholder metadata and generic source-image details", () => {
  const image = {
    ...baseImage(),
    visualSummary: "Deterministic baseline metadata for a source image frame pending manual review required.",
    objects: [{ id: "source-image-frame", type: "source_image_frame", label: "source image", confidence: "low" }],
    visualDetails: [],
    uncertainties: [{ id: "manual-review-required", field: "objects", note: "object-level detail remains uncertain" }]
  };
  const usage = {
    ...baseUsage(),
    answerCriticalDetails: [
      {
        detailId: "q1-critical-source-image",
        objectIds: ["source-image-frame"],
        description: "The referenced source image is answer-critical for this ticket.",
        supportsAnswerIds: ["q1-a2"],
        rejectsAnswerIds: [],
        criticality: "required",
        confidence: "low"
      }
    ]
  };
  const errors = validateSyntheticFullQuality({ image, usage });
  assert(
    errors.includes(
      "question-image-example: full-quality image metadata must not contain placeholder, baseline, source-image-frame, or manual-review-required wording."
    )
  );
  assert(
    errors.includes(
      "q1: critical detail q1-critical-source-image must name actual visible answer-critical facts, not source-image or answer-cue placeholders."
    )
  );
});

test("full-quality usage gate requires question-scoped relevance mapping", () => {
  const usage = {
    ...baseUsage(),
    relevanceMap: [
      {
        relevanceId: "missing-context",
        detailIds: ["sign-shape"],
        objectIds: ["sign"],
        regionIds: ["sign-region"],
        role: "answer_critical_highlight",
        rationaleRuOrEn: "Only the critical cue is mapped.",
        supportsAnswerIds: ["q1-a2"],
        displayIntent: "highlight",
        confidence: "high"
      }
    ]
  };
  const errors = validateSyntheticFullQuality({ usage });
  assert(errors.includes("q1: full-quality usage must include non-critical supporting, distractor, or background relevance context."));
  assert(errors.includes("q1: full-quality usage must not mark every relevance entry answer-critical."));
});

test("shared image metadata rejects global relevance keys", () => {
  const image = {
    ...baseImage(),
    objects: [{ id: "sign", type: "traffic_sign", label: "sign", confidence: "high", criticality: "required" }]
  };
  const errors = validateSyntheticFullQuality({ image });
  assert(errors.includes("question-image-example: shared image metadata must not contain question-scoped relevance key question-image-example.objects[0].criticality."));
});

test("relevance mappings must reference existing stable ids", () => {
  const usage = {
    ...baseUsage(),
    relevanceMap: [
      {
        ...baseUsage().relevanceMap[0],
        detailIds: ["missing-detail"],
        objectIds: ["missing-object"],
        regionIds: ["missing-region"]
      },
      baseUsage().relevanceMap[1]
    ]
  };
  const errors = validateSyntheticFullQuality({ usage });
  assert(errors.includes("q1: relevance sign-shape-highlight references missing detail missing-detail."));
  assert(errors.includes("q1: relevance sign-shape-highlight references missing object missing-object."));
  assert(errors.includes("q1: relevance sign-shape-highlight references missing region missing-region."));
});

test("stale question fingerprint fails image usage validation", () => {
  const usage = { ...baseUsage(), questionFingerprint: "0".repeat(64) };
  const { manifest, evidence } = manifestAndEvidence({ usage });
  const errors = validateQuestionImageMetadata({
    questions: [baseQuestion],
    manifest: {
      ...manifest,
      baseline: {
        ...manifest.baseline,
        questionSetFingerprint: "skip",
        imageReferenceFingerprint: "skip"
      }
    },
    evidence,
    strictCoverage: false
  });
  assert(errors.includes("q1: usage questionFingerprint mismatch."));
  assert(errors.includes("q1: evidence questionFingerprint mismatch."));
});

test("b-fallback-001 metadata records cyclist and straight right-arm gesture", () => {
  const manifest = JSON.parse(readFileSync("content/image-metadata/question-images.manifest.json", "utf8"));
  const usage = manifest.questionUsages.find((item) => item.questionId === "b-fallback-001");
  const image = manifest.images.find((item) => item.imageId === usage.imageId);
  const cyclist = image.roadUsers.find((item) => item.id === "cyclist-foreground");
  const gesture = cyclist.gestures.find((item) => item.id === "right-arm-straight-horizontal");
  assert.equal(cyclist.type, "cyclist");
  assert.equal(cyclist.attributes.helmet, true);
  assert.equal(gesture.bodyPart, "right_arm");
  assert.equal(gesture.pose, "extended_straight_horizontal");
  assert.equal(gesture.actorPerspectiveDirection, "right");
  assert.equal(gesture.viewerPerspectiveDirection, "left");
  assert(usage.answerCriticalDetails.some((detail) => detail.detailId === "right-arm-straight-horizontal" && detail.supportsAnswerIds.includes("b-fallback-001-a2")));
});
