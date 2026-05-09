# Spec: Image Metadata And Learning Support Completion

## Analyst Intake

- Source request: `feature-request.md`.
- Active feature folder: `specs/009-image-metadata-learning-support/`.
- Current branch/worktree for this Architect pass: `codex/009-ticket-image-metadata-intake` in `/Users/chap/devel/cabadrive-009-ticket-image-metadata-intake`.
- This Architect artifact must not change product code, content data, tests, scripts, durable docs outside this feature folder, commits, pushes, or PR state.

## Baseline

Architect orientation confirmed the intake baseline against the current worktree:

- `content/questions/caba-b.unofficial-fallback.questions.json` has 460 category B fallback questions.
- 276 question records have an `image` reference.
- Those references point to 275 distinct local image paths.
- `content/assets/questions/source-bandinopla-testdeconducir-b/b2.jpg` is reused by `b-fallback-256` and `b-fallback-303`.
- `content/translations/ru.translations.json` has 10 entries.
- `content/explanations/ru.explanations.json` has 5 entries.
- Current validation checks local image existence and image file hashes, but not semantic image content.
- Current translation alignment validation is deterministic and offline, but only validates translation entries that already exist.
- Current explanation validation does not require all 460 questions, does not require answer-level explanation coverage, and does not compare explanations to question images.

## Goal

Create a complete, deterministic, offline-validated learning-support layer for the current 460 fallback tickets: structured JSON metadata for every current question image, per-question answer-critical visual detail mappings, image-aware Russian explanations that do not contradict visible facts, complete Russian translations and answer translations for all current questions, and validation evidence that catches stale source/image/question/explanation/translation changes.

## Scope

In scope:

- Define one consistent structured JSON schema for current question-image metadata.
- Cover every current question image reference with metadata, using shared visual metadata for each unique image and question-specific critical-detail mappings for every image-backed question.
- Tie image metadata to local image path, image SHA-256, original URL when present, source ID, and deterministic review evidence.
- Tie every question-specific critical-detail mapping to a stable question fingerprint that includes question text, ordered answers, correct answer ID, image path, and image hash.
- Mark answer-critical visual details for every image-backed question and link them to the relevant question ID and, when applicable, correct answer ID or wrong-answer trap.
- Correct the `b-fallback-001` Russian explanation so it describes the visible cyclist and straight right-arm signal rather than a driver with a bent raised left arm.
- Add validation regression coverage proving the old `b-fallback-001` explanation fails.
- Complete Russian question translations and answer-choice translations for all 460 current questions.
- Complete Russian explanations for all 460 current questions.
- For every explanation, explain why the correct answer is correct and include concise wrong-answer rationales for every incorrect answer unless Architect later records an explicit exception.
- For image-backed explanations, require image-critical details to be represented in structured alignment evidence and reflected in the learner-facing explanation text.
- Require official-source trace or cautious ticket-specific scoping for rule, legal, procedure, numeric, traffic-sign, licensing, or road-safety claims that go beyond direct ticket wording and direct image description.
- Add or extend deterministic offline validators, unit tests, content validation integration, docs, feature-memory evidence, local preflight, and PR workflow evidence in future implementation slices.

Out of scope:

- Replacing the current unofficial fallback question bank.
- Claiming the fallback bank is official, complete, or externally validated as the GCBA category B bank.
- Generating or replacing source images.
- Introducing a backend, runtime API, cloud service, live OCR, live LLM, live image model, live translation service, or network dependency in runtime, tests, build, validation, preflight, or CI.
- Making Russian support official or primary over Spanish source text.
- Rewriting the topic study guide as the source of truth for question-card translations or explanations without an explicit synchronization decision recorded in this feature memory.
- Broad driving-school, legal-manual, or Spanish-course content beyond what helps answer the current tickets.
- Direct merges to `main`.

## Assumptions

- "Every image" means every local image referenced by the current 460-question fallback bank.
- "Every ticket" means the 460 records in `content/questions/caba-b.unofficial-fallback.questions.json` at implementation time.
- Questions without images need translations and explanations, but no image metadata.
- The duplicate `b2.jpg` image should have one shared visual metadata entry and two question-specific usage mappings.
- AI assistance may be used by implementation agents to draft descriptions, translations, or explanations, but committed validation must rely on deterministic local JSON, fingerprints, and review evidence.
- Review evidence may be solo self-audit unless the Orchestrator or repository policy requires additional human review; the evidence must still be explicit and reproducible.
- If an image is ambiguous or low-resolution, metadata records uncertainty instead of inventing facts.
- Existing topic-guide answer explanations may be used as drafting input, but the main question-card translation/explanation layer must have its own complete validated entries unless Architect later disposes a synchronization design.

## Architect Decisions

### Shared Image Metadata With Question-Specific Critical Details

Use shared image metadata per unique image and separate question-specific mappings for critical details.

Rationale:

- The same local image can be reused by multiple questions, as `b2.jpg` already is.
- The visible scene should be described once so metadata review does not drift.
- Answer-critical interpretation depends on the question text and answer choices, so it belongs in a per-question usage record.
- This avoids duplicating 275 full image descriptions across 276 image-backed questions while still allowing each ticket to mark different critical details or traps.

### Preferred Future Content Layout

Implementation may adjust filenames after recording the reason in `tasks.md`, but the preferred layout is:

```text
content/image-metadata/question-images.manifest.json
content/image-metadata/question-images/
content/validation/question-image-metadata.evidence.json
content/validation/ru-explanation-alignment.evidence.json
content/validation/ru-translation-alignment.evidence.json
```

The metadata may be sharded under `content/image-metadata/question-images/` for reviewability. A single schema and validator must apply to every shard. The app does not need to render metadata in the MVP unless an implementation slice explicitly scopes that UI.

### JSON Schema Requirements

The schema below is requirements-level, not implementation code. Final field names may differ only if the same semantics and validation are preserved.

```ts
type QuestionImageMetadataManifest = {
  version: 1;
  questionSourcePath: "content/questions/caba-b.unofficial-fallback.questions.json";
  baseline: {
    questionCount: 460;
    imageReferenceCount: 276;
    uniqueImageCount: 275;
    questionSetFingerprint: string;
    imageReferenceFingerprint: string;
    createdAt: string;
    reviewedAt?: string;
  };
  images: ImageMetadataEntry[];
  questionUsages: QuestionImageUsage[];
};

type ImageMetadataEntry = {
  imageId: string;
  localPath: string;
  originalUrl?: string;
  sha256: string;
  sourceIds: string[];
  kind:
    | "street_photo"
    | "traffic_sign"
    | "road_marking"
    | "diagram"
    | "vehicle_photo"
    | "document_or_infographic"
    | "other";
  descriptionLanguage: "en" | "ru" | "es";
  visualSummary: string;
  generationPromptSummary: string;
  scene: {
    setting?: string;
    environment?: string;
    cameraView?: string;
    framing?: string;
    lighting?: string;
    weatherOrSurface?: string;
  };
  roadLayout?: {
    roadType?: string;
    laneCount?: number | "unknown";
    laneDirections?: string[];
    markings?: VisualDetailRef[];
    crossings?: VisualDetailRef[];
    curbsOrShoulders?: VisualDetailRef[];
  };
  objects: VisualObject[];
  roadUsers?: RoadUser[];
  signsSignalsMarkings?: VisualObject[];
  annotations?: VisualAnnotation[];
  visibleText?: VisibleText[];
  spatialRelationships?: SpatialRelationship[];
  uncertainties?: UncertaintyNote[];
  review: {
    status: "draft" | "approved" | "needs_review";
    reviewer?: string;
    reviewedAt?: string;
    evidenceEntryId?: string;
  };
};

type QuestionImageUsage = {
  questionId: string;
  imageId: string;
  localPath: string;
  imageSha256: string;
  questionFingerprint: string;
  correctAnswerId: string;
  answerCriticalDetails: AnswerCriticalDetail[];
  imageRole: "answer_critical" | "contextual_with_critical_detail";
  review: {
    status: "draft" | "approved" | "needs_review";
    reviewer?: string;
    reviewedAt?: string;
    evidenceEntryId?: string;
  };
};

type AnswerCriticalDetail = {
  detailId: string;
  objectIds: string[];
  description: string;
  supportsAnswerIds?: string[];
  rejectsAnswerIds?: string[];
  criticality: "required" | "trap" | "supporting";
  confidence: "high" | "medium" | "low";
};
```

Required visual detail categories:

- scene context and visual style;
- camera/framing and viewing angle;
- road layout, lane count when visible, directions, surfaces, curbs, shoulders, medians, intersections, crossings, and markings;
- traffic signs, traffic lights, lane signals, painted symbols, boards, panels, and visible text;
- vehicles, vehicle types, positions, orientations, maneuvers, lights, damage, cargo, and relative order;
- road users including drivers, cyclists, motorcyclists, pedestrians, passengers, animals, and officials;
- gestures, body pose, arm/hand direction, signal use, and highlighted limbs when present;
- annotations such as red circles, arrows, labels, overlays, cropped diagrams, and highlighted regions;
- spatial relationships such as ahead/behind, left/right from viewer perspective, left/right from actor perspective, next to, crossing, approaching, stopping, parked, or yielding;
- uncertainties for unclear, cropped, low-resolution, or ambiguous details.

### `b-fallback-001` Required Metadata

The `b-fallback-001` metadata and usage must explicitly record:

- image path `content/assets/questions/source-bandinopla-testdeconducir-b/b13.jpg`;
- image hash `aae6435fd73747197db844c9cfc7f520b94efb5095e33f043b84d5dc15e7f2b7`;
- a street-photo urban setting;
- a cyclist in the foreground, not only a generic driver;
- the cyclist facing roughly toward the viewer;
- the cyclist wearing a helmet;
- the cyclist's right arm extended straight and horizontally to the cyclist's right side;
- the viewer-perspective distinction, because the cyclist's right side can appear on the viewer's left;
- the red oval or equivalent annotation highlighting the arm;
- the cyclist and right-arm straight gesture as answer-critical details for `b-fallback-001`;
- link to correct answer `b-fallback-001-a2`.

### Translation Coverage

`content/translations/ru.translations.json`, or an approved shard-equivalent imported by the app, must cover all 460 current question IDs.

Every translation entry must include:

- `questionId`;
- non-empty Russian question translation;
- non-empty answer translations for every current answer ID and no extra answer IDs;
- method/reviewer/reviewedAt/disclaimer fields or equivalent metadata preserving unofficial status;
- deterministic alignment evidence with current source and translation fingerprints.

Translation validation must fail when:

- any current question lacks a translation;
- a translation references a missing question;
- an answer translation is missing, empty, extra, or attached to the wrong answer ID;
- source text, answer IDs, answer text, correct answer ID, or image hash changes without refreshed evidence;
- Russian translation text changes without refreshed evidence.

### Explanation Coverage

`content/explanations/ru.explanations.json`, or an approved shard-equivalent imported by the app, must cover all 460 current question IDs.

Every explanation entry must include:

- `questionId`;
- concise learner-facing Russian explanation text;
- structured correct-answer rationale tied to `correctAnswerId`;
- concise rationale for every incorrect answer ID, unless a future Architect disposition records a controlled exception;
- `explanationType` or controlled tags;
- related source IDs for source-backed claims;
- disclaimer preserving unofficial status;
- review metadata and deterministic evidence.

For image-backed questions, every explanation entry must also have structured image-alignment evidence that:

- references the image metadata `imageId`;
- references the question usage entry;
- references every required answer-critical visual detail, or records a controlled exception for why a critical detail is not verbalized;
- asserts that the explanation has no visual claim contradicted by metadata;
- includes fingerprints for the question source tuple, explanation tuple, image metadata, and question usage mapping.

### Image-Aware Explanation Validation

Semantic image truth cannot be fully proven by code. Validation must combine:

- structured image metadata;
- structured per-question critical details;
- structured explanation visual-claim/alignment evidence;
- stable fingerprints;
- targeted contradiction checks where fields are controlled enough to check deterministically.

Validation must fail when:

- an image-backed question lacks an approved image metadata entry;
- an image-backed question lacks an approved question usage mapping;
- an image-backed question lacks at least one answer-critical detail;
- image metadata has a stale path/hash or a stale review evidence fingerprint;
- question usage has a stale question fingerprint;
- explanation evidence is missing for an image-backed question;
- explanation evidence does not reference required critical details;
- explanation evidence references a missing image, object, detail, answer, or question usage;
- explanation or metadata changes without refreshed evidence;
- a structured visual claim contradicts the metadata, such as `subject=driver` where the critical object is `cyclist`, or `left_arm_bent_up` where the metadata says `right_arm_extended_straight_horizontal`.

### `b-fallback-001` Regression

Implementation must include a regression fixture or unit test proving the old explanation fails validation. The old explanation is the current defect:

```text
На изображении показан жест рукой для поворота направо: водитель вытягивает левую руку и сгибает ее вверх, показывая направление маневра.
```

The regression must fail for at least one deterministic reason:

- stale explanation fingerprint against approved evidence;
- structured visual claim mismatch against the `b13.jpg` metadata;
- explicit contradiction check for subject/gesture fields.

The corrected explanation must describe the cyclist's straight right-arm gesture and keep the correct answer `Giro a la derecha`.

### Official-Source And Fallback Boundary

Russian explanations remain unofficial learning support. Explanations may directly describe the Spanish ticket wording and visible image facts without official-source citation beyond the fallback source. If an explanation makes a generalized rule, legal, numeric, licensing, procedure, traffic-sign, or road-safety claim beyond direct ticket/image facts, it must either:

- cite current appropriate official sources already governed by the official-documents archive and source trace, or
- be scoped as a ticket-specific fallback explanation without presenting the claim as current general law.

The feature must not imply that the current fallback set is an official or complete GCBA category B question bank.

## Functional Requirements

- FR-001: Add a structured JSON question-image metadata layer for all current unique images referenced by the fallback question bank.
- FR-002: Add question-specific image usage records for all current image-backed questions.
- FR-003: Require at least one answer-critical detail for every current image-backed question.
- FR-004: Link answer-critical details to question IDs and, where applicable, answer IDs or wrong-answer traps.
- FR-005: Detect stale image metadata when the local image file hash, question image hash, image path, or original question image reference changes.
- FR-006: Detect stale question usage when official question text, answer IDs/text, correct answer ID, image path, or image hash changes.
- FR-007: Add deterministic review evidence for image metadata and question usage mappings.
- FR-008: Correct `b-fallback-001` image metadata and explanation around cyclist/right-arm signal.
- FR-009: Add regression validation proving the old `b-fallback-001` left-arm/bent-arm explanation fails.
- FR-010: Complete Russian question and answer translations for all 460 current questions.
- FR-011: Require translation validation to enforce full 460-question coverage and fresh deterministic alignment evidence.
- FR-012: Complete Russian explanations for all 460 current questions.
- FR-013: Require explanation validation to enforce full 460-question coverage, correct-answer rationale, and incorrect-answer rationales.
- FR-014: Require image-aware explanation evidence for every image-backed question.
- FR-015: Keep all validation deterministic, offline, and free of runtime/build/test/preflight network, LLM, OCR, or translation-service calls.
- FR-016: Add unit tests for metadata validation, stale fingerprints, coverage failures, and the `b-fallback-001` regression.
- FR-017: Integrate validators into `scripts/validate-content.mjs` and local preflight.
- FR-018: Update durable docs and specs when new content paths, schemas, validation gates, or coverage rules are introduced.
- FR-019: Keep `tasks.md` current with process memory, decisions, dead ends, known issues, verification evidence, and Implementation Agent feedback disposition.
- FR-020: Use isolated worktrees/branches/PRs for implementation slices and do not touch other agents' worktrees or unrelated changes.

## Acceptance Criteria

1. Given the current question file has 460 questions, validation fails unless the Russian translation layer covers all 460 current question IDs.
2. Given any current question, validation fails unless its translation has non-empty Russian question text and translations for exactly its current answer IDs.
3. Given a source question tuple changes, translation validation fails until evidence is refreshed.
4. Given a Russian translation tuple changes, translation validation fails until evidence is refreshed.
5. Given the current question file has 460 questions, validation fails unless the Russian explanation layer covers all 460 current question IDs.
6. Given any current question, validation fails unless its explanation includes a correct-answer rationale tied to the current `correctAnswerId`.
7. Given any incorrect answer ID, validation fails unless the explanation includes a concise wrong-answer rationale or an Architect-approved controlled exception.
8. Given a current image-backed question, validation fails unless it has an approved question image usage mapping.
9. Given a current unique image path, validation fails unless it has an approved shared image metadata entry.
10. Given an image-backed question, validation fails unless the usage mapping has at least one answer-critical detail.
11. Given `b-fallback-001`, metadata records the foreground subject as a cyclist and records the cyclist's right arm extended straight/horizontally to the cyclist's right side.
12. Given `b-fallback-001`, metadata marks the cyclist and right-arm gesture as answer-critical and links them to `b-fallback-001-a2`.
13. Given `b-fallback-001`, the Russian explanation no longer says the subject is a driver extending a left arm bent upward.
14. Given `b-fallback-001`, the corrected explanation describes the visible right-arm straight extension and keeps `Giro a la derecha` as the correct answer.
15. Given the old `b-fallback-001` explanation fixture, image-aware explanation validation fails deterministically.
16. Given an image hash changes, image metadata validation fails until metadata and review evidence are refreshed.
17. Given question text, answer IDs/text, correct answer ID, image path, or image hash changes, question usage validation fails until usage evidence is refreshed.
18. Given an explanation for an image-backed question asserts a structured visual claim absent from or contradicted by image metadata, validation fails.
19. Given explanation evidence references a missing image/detail/object/question/answer, validation fails.
20. Given metadata contains low-confidence or ambiguous facts, it records uncertainty instead of unreviewed precision.
21. Given implementation introduces new content paths, schemas, validators, or user-visible learning-support behavior, durable docs and relevant spec docs are updated.
22. Given local verification runs after each implementation PR, `pnpm run validate:content`, `pnpm run test`, `pnpm run build`, `git diff --check`, and scoped checks required by the slice pass or record exact unrelated blockers.
23. Given a final release PR for this feature, `pnpm run preflight` passes, required checks are green, no blocking review findings remain, and every acceptance criterion has evidence.
24. Given any implementation PR, `tasks.md` records verification evidence and any dead ends, decisions, known issues, or Implementation Agent feedback.
25. Given implementation or review starts, the agent uses only its assigned isolated worktree/branch and does not edit, revert, or merge changes from other worktrees.

## Negative Scenarios

- A metadata file that only repeats image alt text is not complete.
- A metadata file that describes the full scene but has no per-question answer-critical detail mapping is not complete.
- A per-image metadata entry copied into every question instead of sharing unique-image metadata is not acceptable unless implementation records a concrete reviewability reason and Architect approves it.
- A question usage mapping that marks all objects as critical without linking to answer reasoning is not complete.
- An image-backed explanation that passes only because it has the right `questionId` is not acceptable.
- A validation approach based only on keyword overlap between Russian prose and metadata is not sufficient.
- A validation approach that requires live AI/OCR/translation/network access is not acceptable.
- A translation layer covering fewer than 460 current questions is not complete.
- An explanation layer covering fewer than 460 current questions is not complete.
- A bulk content PR that adds all metadata, all translations, all explanations, validators, docs, and UI/import changes at once is too large for reliable review and violates this plan.
- Russian support must not become official source text, hide Spanish source text, or imply official-bank coverage.
- Implementation must not change product code, content, tests, scripts, or durable docs from this Architect-only branch before Orchestrator handoff.

## Verification And Review Requirements

Implementation Agent requirements:

- Start only after `feature-request.md`, `spec.md`, `plan.md`, and `tasks.md` exist.
- Use only the assigned isolated worktree and branch for the slice.
- Do not touch other agents' worktrees, branches, or unrelated changes.
- Keep the slice within the task scope assigned by the Orchestrator.
- Update this feature memory in the same PR with evidence, decisions, dead ends, known issues, and feedback.
- If implementation needs to diverge from this spec, record feedback in `tasks.md` for Architect disposition instead of silently changing scope.

Review Agent requirements:

- Review the PR against this feature memory, not only the diff.
- Use an isolated review worktree/context and do not edit files while acting as reviewer.
- Verify that image metadata, critical detail mappings, translations, explanations, evidence, validators, docs, and tests match the assigned slice.
- Verify deterministic offline behavior and absence of live AI/network validation.
- Verify stale hash/fingerprint failure modes and the old `b-fallback-001` regression.
- Report blocking findings as GitHub inline review threads when acting under the repository review contract.

Final feature readiness requires:

- green required checks from `.unicorn-hub/config.json`;
- no unresolved merge conflicts;
- no blocking review findings;
- evidence for every acceptance criterion;
- current process memory for dead ends, decisions, known issues, verification evidence, and Implementation Agent feedback;
- only final human approval or merge mechanics remaining.
