import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";
import {
  buildCurrentOverlayBundle,
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
    referencedObjectIds: ["sign", "background"],
    referencedRegionIds: ["key-region", "background-region"],
    regions: [
      {
        overlayRegionId: "overlay-dim-background-region",
        sourceRole: "background_irrelevant_dim",
        relevanceId: "overlay-dim-background",
        detailIds: ["background-texture"],
        objectIds: ["background"],
        regionIds: ["background-region"],
        rect: { x: 0, y: 0, width: 100, height: 30 }
      },
      {
        overlayRegionId: "overlay-highlight-key-region",
        sourceRole: "answer_critical_highlight",
        relevanceId: "overlay-highlight-key-symbol",
        detailIds: ["key-symbol"],
        objectIds: ["sign"],
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
            fullCurrentCoverageChecked: true
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

test("non-critical overlay geometry cannot fully mask answer-critical regions", () => {
  const fullFrameDim = baseOverlay();
  fullFrameDim.regions[0] = { ...fullFrameDim.regions[0], rect: { x: 0, y: 0, width: 100, height: 100 } };
  const fullFrameErrors = validateSynthetic({ overlay: fullFrameDim });
  assert(fullFrameErrors.some((error) => error.includes("background_irrelevant_dim must not use a full-frame dim rectangle")));
  assert(fullFrameErrors.some((error) => error.includes("background_irrelevant_dim must not fully cover answer-critical region")));

  for (const sourceRole of ["supporting", "distractor_trap"]) {
    const relevanceId = `overlay-${sourceRole}-cover-critical`;
    const usage = baseUsage();
    usage.relevanceMap = [
      ...usage.relevanceMap,
      {
        relevanceId,
        detailIds: ["background-texture"],
        objectIds: ["background"],
        regionIds: ["background-region"],
        role: sourceRole,
        rationaleRuOrEn: "A non-critical fixture region must not mask the answer cue.",
        supportsAnswerIds: [],
        rejectsAnswerIds: [],
        displayIntent: sourceRole === "supporting" ? "support" : "trap",
        confidence: "medium"
      }
    ];
    const overlay = baseOverlay({ usage });
    overlay.relevanceIds = [...overlay.relevanceIds, relevanceId];
    overlay.regions = [
      ...overlay.regions,
      {
        overlayRegionId: `overlay-${sourceRole}-cover-critical`,
        sourceRole,
        relevanceId,
        detailIds: ["background-texture"],
        objectIds: ["background"],
        regionIds: ["background-region"],
        rect: { x: 40, y: 40, width: 20, height: 20 }
      }
    ];
    assert(
      validateSynthetic({ usage, overlay }).some((error) =>
        error.includes(`${sourceRole} must not fully cover answer-critical region`)
      )
    );
  }
});

test("missing and duplicate current overlay coverage fail strict validation", () => {
  const bundle = manifestAndEvidence();
  const missing = validateImageExplanationOverlays({
    questions: [baseQuestion],
    metadataManifest: bundle.metadataManifest,
    metadataEvidence: bundle.metadataEvidence,
    overlayManifest: { ...bundle.overlayManifest, overlays: [] },
    overlayEvidence: { ...bundle.overlayEvidence, overlayEntries: [] }
  });
  assert(missing.includes("q-overlay-1: expected exactly one approved current overlay, found 0."));
  assert(missing.includes("q-overlay-1: expected exactly one approved overlay evidence entry, found 0."));

  const duplicateOverlay = { ...baseOverlay(), overlayId: "overlay-q-overlay-1-duplicate" };
  const duplicateEvidence = {
    ...bundle.overlayEvidence.overlayEntries[0],
    overlayId: duplicateOverlay.overlayId,
    overlaySha256: imageOverlayFingerprint(duplicateOverlay)
  };
  const duplicate = validateImageExplanationOverlays({
    questions: [baseQuestion],
    metadataManifest: bundle.metadataManifest,
    metadataEvidence: bundle.metadataEvidence,
    overlayManifest: { ...bundle.overlayManifest, overlays: [bundle.overlayManifest.overlays[0], duplicateOverlay] },
    overlayEvidence: { ...bundle.overlayEvidence, overlayEntries: [bundle.overlayEvidence.overlayEntries[0], duplicateEvidence] }
  });
  assert(duplicate.includes("q-overlay-1: expected exactly one approved current overlay, found 2."));
  assert(duplicate.some((error) => error.includes("duplicate approved current overlays")));
});

test("stale overlay evidence fails validation", () => {
  const bundle = manifestAndEvidence();
  const staleEvidence = {
    ...bundle.overlayEvidence,
    overlayEntries: [{ ...bundle.overlayEvidence.overlayEntries[0], overlaySha256: "0".repeat(64) }]
  };
  assert(
    validateImageExplanationOverlays({
      questions: [baseQuestion],
      metadataManifest: bundle.metadataManifest,
      metadataEvidence: bundle.metadataEvidence,
      overlayManifest: bundle.overlayManifest,
      overlayEvidence: staleEvidence
    }).includes("overlay-q-overlay-1: overlay evidence overlaySha256 mismatch.")
  );
});

test("shared-metadata-only overlays and overlays outside current question usage fail", () => {
  const sharedOnly = baseOverlay();
  sharedOnly.relevanceIds = ["overlay-highlight-key-symbol", "overlay-dim-background"];
  sharedOnly.referencedDetailIds = ["key-symbol", "background-texture"];
  sharedOnly.regions[0] = { ...sharedOnly.regions[0], detailIds: ["key-symbol"], regionIds: ["key-region"] };
  assert(
    validateSynthetic({ overlay: sharedOnly }).some((error) =>
      error.includes("detail key-symbol is not assigned to 009 relevance overlay-dim-background")
    )
  );

  const questionWithoutImage = { ...baseQuestion, id: "q-overlay-no-image", image: undefined };
  const overlayForWrongQuestion = { ...baseOverlay(), questionId: questionWithoutImage.id };
  const bundle = manifestAndEvidence({ overlay: overlayForWrongQuestion });
  assert(
    validateImageExplanationOverlays({
      questions: [questionWithoutImage],
      ...bundle
    }).some((error) => error.includes("references a question without an image"))
  );
});

test("deterministic current overlay bundle covers every approved usage once", () => {
  const image = baseImage();
  const usage = baseUsage();
  const generated = buildCurrentOverlayBundle({
    questions: [baseQuestion],
    metadataManifest: { version: 1, images: [image], questionUsages: [usage] },
    reviewer,
    reviewedAt
  });
  assert.equal(generated.overlayManifest.overlays.length, 1);
  assert.equal(generated.overlayEvidence.overlayEntries.length, 1);
  assert.deepEqual(
    validateImageExplanationOverlays({
      questions: [baseQuestion],
      metadataManifest: { version: 1, images: [image], questionUsages: [usage] },
      metadataEvidence: manifestAndEvidence({ image, usage }).metadataEvidence,
      overlayManifest: generated.overlayManifest,
      overlayEvidence: generated.overlayEvidence
    }),
    []
  );
});
