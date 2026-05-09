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
    roadUsers: [],
    signsSignalsMarkings: [],
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
        description: "The sign is the relevant visual cue.",
        supportsAnswerIds: ["q1-a2"],
        rejectsAnswerIds: ["q1-a1"],
        criticality: "required",
        confidence: "high"
      }
    ],
    imageRole: "answer_critical",
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
