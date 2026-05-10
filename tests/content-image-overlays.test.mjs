import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";
import {
  imageOverlayFingerprint,
  validateImageExplanationOverlays
} from "../scripts/content-image-overlays.mjs";
import {
  imageMetadataFingerprint,
  questionFingerprint,
  questionUsageFingerprint
} from "../scripts/content-image-metadata.mjs";

const reviewer = "Codex overlay validator fixture";
const reviewedAt = "2026-05-10";

const baseQuestion = {
  id: "q-overlay-1",
  sourceId: "source-1",
  officialTextEs: "¿Qué detalle visual decide la respuesta?",
  answers: [
    { id: "q-overlay-1-a1", officialTextEs: "Incorrecta." },
    { id: "q-overlay-1-a2", officialTextEs: "Correcta." }
  ],
  correctAnswerId: "q-overlay-1-a2",
  image: {
    localPath: "content/assets/questions/example-overlay.jpg",
    originalUrl: "https://example.invalid/example-overlay.jpg",
    sha256: "2".repeat(64)
  }
};

function baseImage() {
  return {
    imageId: "question-image-overlay-example",
    localPath: baseQuestion.image.localPath,
    originalUrl: baseQuestion.image.originalUrl,
    sha256: baseQuestion.image.sha256,
    sourceIds: ["source-1"],
    kind: "traffic_sign",
    descriptionLanguage: "en",
    visualSummary: "Reviewed sign image with one key symbol and background.",
    generationPromptSummary: "Synthetic sign image with one key symbol and background.",
    scene: { setting: "synthetic" },
    objects: [
      { id: "sign", type: "traffic_sign", label: "sign", confidence: "high" },
      { id: "background", type: "background", label: "background", confidence: "medium" }
    ],
    regions: [
      { regionId: "key-region", label: "key region", semanticLocation: "center", localizationConfidence: "high" },
      { regionId: "background-region", label: "background region", semanticLocation: "edges", localizationConfidence: "medium" }
    ],
    roadUsers: [],
    signsSignalsMarkings: [],
    visualDetails: [
      { id: "key-symbol", objectIds: ["sign"], regionIds: ["key-region"], description: "The key symbol is visible.", confidence: "high" },
      { id: "background-texture", objectIds: ["background"], regionIds: ["background-region"], description: "The background texture is visible.", confidence: "medium" }
    ],
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
    imageId: "question-image-overlay-example",
    localPath: baseQuestion.image.localPath,
    imageSha256: baseQuestion.image.sha256,
    questionFingerprint: questionFingerprint(baseQuestion),
    correctAnswerId: baseQuestion.correctAnswerId,
    answerCriticalDetails: [
      {
        detailId: "key-symbol",
        objectIds: ["sign"],
        regionIds: ["key-region"],
        description: "The key symbol decides the correct answer for this exact question.",
        supportsAnswerIds: ["q-overlay-1-a2"],
        rejectsAnswerIds: ["q-overlay-1-a1"],
        criticality: "required",
        confidence: "high"
      }
    ],
    imageRole: "answer_critical",
    relevanceMap: [
      {
        relevanceId: "overlay-highlight-key-symbol",
        detailIds: ["key-symbol"],
        objectIds: ["sign"],
        regionIds: ["key-region"],
        role: "answer_critical_highlight",
        rationaleRuOrEn: "The key symbol is the question-specific cue.",
        supportsAnswerIds: ["q-overlay-1-a2"],
        rejectsAnswerIds: ["q-overlay-1-a1"],
        displayIntent: "highlight",
        confidence: "high"
      },
      {
        relevanceId: "overlay-dim-background",
        detailIds: ["background-texture"],
        objectIds: ["background"],
        regionIds: ["background-region"],
        role: "background_irrelevant_dim",
        rationaleRuOrEn: "The background is visible but not answer-critical for this question.",
        supportsAnswerIds: [],
        rejectsAnswerIds: [],
        displayIntent: "dim",
        confidence: "medium"
      }
    ],
    review: {
      status: "approved",
      reviewer,
      reviewedAt
    }
  };
}

function baseOverlay({ image = baseImage(), usage = baseUsage() } = {}) {
  return {
    overlayId: "overlay-q-overlay-1",
    status: "approved",
    questionId: baseQuestion.id,
    imageId: image.imageId,
    localPath: baseQuestion.image.localPath,
    imageSha256: baseQuestion.image.sha256,
    questionFingerprint: questionFingerprint(baseQuestion),
    metadataFingerprint: imageMetadataFingerprint(image),
    usageFingerprint: questionUsageFingerprint(usage),
    relevanceIds: ["overlay-highlight-key-symbol", "overlay-dim-background"],
    referencedDetailIds: ["key-symbol", "background-texture"],
    referencedRegionIds: ["key-region", "background-region"],
    regions: [
      {
        overlayRegionId: "overlay-dim-background-region",
        sourceRole: "background_irrelevant_dim",
        relevanceId: "overlay-dim-background",
        detailIds: ["background-texture"],
        regionIds: ["background-region"],
        rect: { x: 0, y: 0, width: 100, height: 30 }
      },
      {
        overlayRegionId: "overlay-highlight-key-region",
        sourceRole: "answer_critical_highlight",
        relevanceId: "overlay-highlight-key-symbol",
        detailIds: ["key-symbol"],
        regionIds: ["key-region"],
        rect: { x: 40, y: 40, width: 20, height: 20 }
      }
    ],
    provenance: {
      method: "validator_fixture",
      reviewer,
      reviewedAt
    }
  };
}

function manifestAndEvidence({ image = baseImage(), usage = baseUsage(), overlay = baseOverlay({ image, usage }) } = {}) {
  return {
    metadataManifest: {
      version: 1,
      images: [image],
      questionUsages: [usage]
    },
    metadataEvidence: {
      version: 1,
      imageEntries: [
        {
          imageId: image.imageId,
          imageSha256: image.sha256,
          status: "approved",
          reviewer,
          reviewedAt,
          metadataSha256: imageMetadataFingerprint(image),
          checks: {}
        }
      ],
      usageEntries: [
        {
          questionId: usage.questionId,
          status: "approved",
          reviewer,
          reviewedAt,
          usageSha256: questionUsageFingerprint(usage),
          checks: {}
        }
      ]
    },
    overlayManifest: {
      version: 1,
      contentKind: "question-image-explanation-overlays",
      questionSourcePath: "content/questions/caba-b.unofficial-fallback.questions.json",
      imageMetadataPath: "content/image-metadata/question-images.manifest.json",
      overlays: [overlay]
    },
    overlayEvidence: {
      version: 1,
      overlayEntries: [
        {
          overlayId: overlay.overlayId,
          questionId: overlay.questionId,
          status: "approved",
          reviewer,
          reviewedAt,
          overlaySha256: imageOverlayFingerprint(overlay),
          checks: {
            questionUsageCurrent: true,
            metadataCurrent: true,
            rolesFromQuestionUsage: true,
            regionsInBounds: true,
            localAssetOnly: true,
            noInventedRelevance: true
          }
        }
      ]
    }
  };
}

function validateSynthetic(input = {}) {
  const bundle = manifestAndEvidence(input);
  return validateImageExplanationOverlays({
    questions: [baseQuestion],
    ...bundle
  });
}

test("current approved question image overlays validate", () => {
  const questions = JSON.parse(readFileSync("content/questions/caba-b.unofficial-fallback.questions.json", "utf8"));
  const metadataManifest = JSON.parse(readFileSync("content/image-metadata/question-images.manifest.json", "utf8"));
  const metadataEvidence = JSON.parse(readFileSync("content/validation/question-image-metadata.evidence.json", "utf8"));
  const overlayManifest = JSON.parse(readFileSync("content/image-overlays/question-explanation-overlays.manifest.json", "utf8"));
  const overlayEvidence = JSON.parse(readFileSync("content/validation/question-image-overlays.evidence.json", "utf8"));
  assert.deepEqual(
    validateImageExplanationOverlays({
      questions,
      metadataManifest,
      metadataEvidence,
      overlayManifest,
      overlayEvidence,
      fileExists: (relativePath) => existsSync(relativePath)
    }),
    []
  );
});

test("stale and missing 009 usage dependencies fail overlay validation", () => {
  const staleOverlay = { ...baseOverlay(), usageFingerprint: "0".repeat(64) };
  assert(validateSynthetic({ overlay: staleOverlay }).includes("overlay-q-overlay-1: usageFingerprint mismatch."));

  const bundle = manifestAndEvidence();
  const errors = validateImageExplanationOverlays({
    questions: [baseQuestion],
    metadataManifest: { ...bundle.metadataManifest, questionUsages: [] },
    metadataEvidence: bundle.metadataEvidence,
    overlayManifest: bundle.overlayManifest,
    overlayEvidence: bundle.overlayEvidence
  });
  assert(errors.includes("overlay-q-overlay-1: missing 009 question usage for q-overlay-1."));
});

test("invented UI-side relevance roles fail overlay validation", () => {
  const overlay = baseOverlay();
  overlay.regions[0] = { ...overlay.regions[0], role: "important" };
  assert(validateSynthetic({ overlay }).some((error) => error.includes("UI-side relevance key")));
});

test("wrong source roles and out-of-bounds geometry fail overlay validation", () => {
  const wrongRole = baseOverlay();
  wrongRole.regions[1] = { ...wrongRole.regions[1], sourceRole: "background_irrelevant_dim" };
  assert(validateSynthetic({ overlay: wrongRole }).some((error) => error.includes("does not match 009 relevance role answer_critical_highlight")));

  const outOfBounds = baseOverlay();
  outOfBounds.regions[1] = { ...outOfBounds.regions[1], rect: { x: 90, y: 40, width: 20, height: 20 } };
  assert(validateSynthetic({ overlay: outOfBounds }).some((error) => error.includes("rect.x + rect.width must be within 100")));
});
