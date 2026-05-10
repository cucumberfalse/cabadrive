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

## Hard Completion Gate

This feature is explicitly not an MVP, placeholder, draft-seed, baseline-coverage, or "good enough for later review" task. It is complete only when all current tickets, all current ticket text, all current answer choices, all current images, all Russian translations, and all Russian explanations are fully and qualitatively worked through.

Required final quality:

- every one of the 460 current fallback tickets has a complete idiomatic Russian question translation, complete idiomatic Russian answer translations, and a complete learner-facing Russian explanation;
- every one of the 275 current unique image files has full visual metadata based on the actual image, detailed enough for a reviewer to recreate a close image prompt or detect that a generated close image is missing important visible facts;
- every one of the 276 current image-backed question usages has question-specific answer-critical details tied to the actual image and the current answer choices;
- every explanation explains why the correct answer is correct and why each incorrect answer is not correct for this ticket;
- every image-backed explanation uses the approved image metadata and usage mapping when the image contains answer-critical information;
- all approved review evidence means full content review, not only deterministic count/fingerprint presence.

Validation and review must reject placeholders even when counts are correct. A PR that reaches 460 translations, 460 explanations, 275 image records, or 276 usage records by using generic templates, question-derived-only descriptions, source-image-frame placeholders, transliteration, Spanish residue, or generic filler is not complete.

## One-Time Parallel Content-Agent Workflow

Image metadata, Russian translations, and Russian explanations must be produced or fully reviewed by one-time content agents working in parallel over non-overlapping shards. This is repository content production, not a permanent runtime service.

Required orchestration model:

- Orchestrator assigns each content agent an isolated worktree/branch and an explicit non-overlapping range.
- Current shard ranges are `001-092`, `093-184`, `185-276`, `277-368`, and `369-460` unless an Implementation Agent records an Architect-approved replacement.
- Each range owner edits only the assigned shard files for the assigned content family:
  - image metadata: `content/image-metadata/question-images/<range>.json`;
  - translations: `content/translations/ru/<range>.json`;
  - explanations: `content/explanations/ru/<range>.json`.
- Content agents must not edit another range, another agent's worktree, generated compatibility indexes by hand, unrelated product files, or durable docs unless their slice explicitly assigns that work.
- After shard edits, agents regenerate compatibility indexes with the repository shard writer and record the exact command evidence.
- Each shard must carry review evidence naming the range, content family, reviewer/agent, source files touched, question/image IDs covered, validation commands, remaining ambiguities, and any controlled exceptions.

Image metadata agents must inspect the actual local image files. Metadata cannot be approved from Spanish question text, answer keys, topic-guide rationales, filenames, hashes, source URLs, or generated captions alone.

Translation agents must prepare or review idiomatic Russian question and answer translations for every ticket in their assigned range. Generator output, glossary wrappers, transliteration, draft scaffolds, or Spanish-with-Russian-framing cannot be accepted as completed translations.

Explanation agents must prepare or review ticket-specific Russian explanations for every ticket in their assigned range. Explanations must cover correct-answer rationale, wrong-answer rationales, source/ticket scoping, and image-critical reasoning where applicable. Generated fallback prose is draft scaffolding only until a content agent reviews and approves it.

The final PR must include evidence that all assigned content-agent ranges for all three content families were completed and reviewed. Count coverage and fingerprint freshness remain required, but they are not enough without this range-level content evidence.

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
- Require full qualitative review gates for image metadata, translations, and explanations in addition to deterministic coverage gates.
- Reject generic baseline metadata, answer-cue-only mappings, draft-wrapper translations, transliteration, untranslated Spanish residue, and generic explanation filler from approved final content.
- Require official-source trace or cautious ticket-specific scoping for rule, legal, procedure, numeric, traffic-sign, licensing, or road-safety claims that go beyond direct ticket wording and direct image description.
- Require range-owned one-time content-agent production/review for image metadata, translations, and explanations.
- Require durable docs to describe the ticket lifecycle for adding, changing, and deleting tickets, including content artifacts, evidence refresh, validation, and cleanup of linked artifacts.
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
- A permanent runtime agent, live image-analysis service, live translation service, or live explanation-generation service.

## Assumptions

- "Every image" means every local image referenced by the current 460-question fallback bank.
- "Every ticket" means the 460 records in `content/questions/caba-b.unofficial-fallback.questions.json` at implementation time.
- Questions without images need translations and explanations, but no image metadata.
- The duplicate `b2.jpg` image should have one shared visual metadata entry and two question-specific usage mappings.
- AI assistance may be used by implementation agents to draft descriptions, translations, or explanations, but committed validation must rely on deterministic local JSON, fingerprints, and review evidence.
- Review evidence may be solo self-audit unless the Orchestrator or repository policy requires additional human review; the evidence must still be explicit and reproducible.
- Review evidence for final approved content must mean actual content review. Counts, hashes, and generated evidence records alone are not sufficient proof of image, translation, or explanation quality.
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

The metadata may be sharded under `content/image-metadata/question-images/` for reviewability. A single schema and validator must apply to every shard. The app does not need to render metadata in the current feature unless an implementation slice explicitly scopes that UI.

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

### Image Metadata Quality Gate

Approved image metadata must be based on inspection of the actual local image. It must not be inferred only from question text, answer text, filenames, source URLs, topic-guide rationale, or the correct answer.

Validation/review must reject final approved metadata when:

- the entry uses baseline or placeholder language such as "source image", "source-image frame", "manual review required", "deterministic baseline", "object-level detail remains uncertain", or equivalent generic wording;
- the entry is only an answer cue, alt text, question restatement, filename restatement, or generic description of a possible traffic situation;
- the entry is marked `approved` while preserving low-confidence baseline facts that have not been visually reviewed;
- the entry omits scene, camera/framing, principal objects, road layout/sign/marking/road-user details visible in the actual image, visible annotations, or material uncertainties;
- the entry cannot support a close visual recreation of the image because it lacks concrete object, position, relationship, text/sign, marking, gesture, or annotation details;
- uncertainty is used as a substitute for review instead of a scoped note about genuinely ambiguous/cropped/low-resolution visual facts;
- question usage records use generic critical details such as "source image", "answer cue", or "visible context" without naming the actual answer-critical visible fact and linking it to answer reasoning.

Low confidence is acceptable only for a specific ambiguous visual fact that has been reviewed and scoped as uncertain. A metadata entry whose overall content is low-confidence baseline coverage cannot be approved.

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
- non-empty idiomatic Russian question translation;
- non-empty idiomatic Russian answer translations for every current answer ID and no extra answer IDs;
- method/reviewer/reviewedAt/disclaimer fields or equivalent metadata preserving unofficial status;
- deterministic alignment evidence with current source and translation fingerprints.

Translation validation must fail when:

- any current question lacks a translation;
- a translation references a missing question;
- an answer translation is missing, empty, extra, or attached to the wrong answer ID;
- any question or answer translation contains untranslated Spanish residue beyond unavoidable proper nouns, acronyms, source labels, or traffic-sign text that is intentionally preserved and explained;
- any translation is a wrapper, draft marker, glossary scaffold, machine-output label, transliteration, or Spanish text with Russian framing rather than a Russian translation;
- any translation is semantically incomplete because it drops answer-critical qualifiers, negation, modality, numeric values, road-user roles, sign meaning, or image-relevant wording from the Spanish source;
- translation review evidence does not include reviewer confirmation for idiomatic Russian, completeness, exact answer-ID coverage, and absence of untranslated Spanish/draft residue;
- source text, answer IDs, answer text, correct answer ID, or image hash changes without refreshed evidence;
- Russian translation text changes without refreshed evidence.

### Explanation Coverage

`content/explanations/ru.explanations.json`, or an approved shard-equivalent imported by the app, must cover all 460 current question IDs.

Every explanation entry must include:

- `questionId`;
- complete learner-facing Russian explanation text;
- structured correct-answer rationale tied to `correctAnswerId`;
- answer-specific rationale for every incorrect answer ID, unless a future Architect disposition records a controlled exception;
- `explanationType` or controlled tags;
- related source IDs for source-backed claims;
- disclaimer preserving unofficial status;
- review metadata and deterministic evidence.

Explanation validation/review must fail when:

- an explanation is generic filler that would fit many unrelated questions;
- the correct-answer rationale does not name the specific rule, sign, maneuver, hazard, wording, or image fact that makes the current correct answer correct;
- any wrong-answer rationale only says "incorrect" or repeats the answer without explaining the ticket-specific reason it is wrong;
- an image-backed explanation ignores answer-critical image details, invents visual facts, or relies only on the question text when the image is needed;
- an explanation contains unsupported current legal/rule/procedure claims beyond the ticket/image facts without source trace or ticket-specific fallback scoping;
- reviewer evidence does not confirm completeness, answer-specificity, image-specificity where applicable, and absence of generic filler.

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
- FR-021: Reject approved image metadata that is placeholder, generic, question-derived-only, answer-cue-only, low-confidence baseline, or missing full visual-review evidence.
- FR-022: Reject approved Russian translations that contain untranslated Spanish residue, transliteration, wrapper/draft scaffolding, incomplete answer coverage, or non-idiomatic Russian not backed by review evidence.
- FR-023: Reject approved explanations that are generic filler, lack answer-specific rationales, omit image-specific reasoning where needed, or are not backed by review evidence.
- FR-024: Require final PR readiness to include non-draft PR state, completed AI Review, green required checks, resolved Review Agent findings, and completed T099-T102/T109-T111 readiness tasks.
- FR-025: Require one-time parallel content-agent production or full review for image metadata, translations, and explanations using non-overlapping range-owned shards.
- FR-026: Require image metadata range agents to inspect actual local image files and record evidence of direct visual review.
- FR-027: Require translation and explanation range agents to record review evidence that final Russian content is idiomatic, complete, ticket-specific, and not generator/template/transliteration output.
- FR-028: Require durable documentation for adding, changing, and deleting tickets, including image analysis when an image exists, Russian translation, Russian explanation, evidence refresh, validation, and cleanup of linked artifacts.
- FR-029: Require shared image metadata deletion rules: when a ticket is deleted, remove only its usage/evidence unless no remaining question usage references the shared image metadata.

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
26. Given any image metadata entry is marked `approved`, validation/review fails unless evidence confirms full visual review of the actual image and the entry contains concrete visible scene/object/road/sign/marking/road-user/annotation/relationship details sufficient for close visual recreation.
27. Given approved image metadata or usage contains placeholder terms, generic source-image references, manual-review-required text, deterministic-baseline wording, question-derived-only facts, or answer-cue-only details, validation/review fails.
28. Given approved image metadata uses low confidence as the overall state of the entry rather than scoped uncertainty for specific ambiguous visual facts, validation/review fails.
29. Given a Russian translation contains Spanish residue, transliteration, draft wrapper text, glossary scaffolding, or untranslated answer text, validation/review fails.
30. Given a Russian translation drops answer-critical meaning from the Spanish question or answer choices, review fails even if deterministic counts and fingerprints pass.
31. Given an explanation lacks ticket-specific correct-answer rationale or any ticket-specific wrong-answer rationale, validation/review fails.
32. Given an image-backed explanation omits required answer-critical image facts or relies only on question-derived text when the image is answer-critical, validation/review fails.
33. Given a final PR remains draft, has skipped AI Review, has pending T099-T102, T109-T111, or T114-T120, or lacks Review Agent content-quality sampling evidence, it is not ready to merge.
34. Given any final image metadata shard, review fails unless shard evidence identifies the assigned image-analysis content agent/range and confirms direct inspection of every local image in that range.
35. Given any final translation shard, review fails unless shard evidence identifies the assigned translation content agent/range and confirms idiomatic Russian review for every question and answer choice in that range.
36. Given any final explanation shard, review fails unless shard evidence identifies the assigned explanation content agent/range and confirms ticket-specific correct/wrong-answer rationale review for every question in that range.
37. Given any content-agent slice, review fails if the agent edited shard files outside its assigned non-overlapping range or hand-edited generated compatibility indexes.
38. Given a ticket is added or materially changed in future repository work, durable docs require image metadata analysis when an image exists, Russian translations, Russian explanations, evidence refresh, strict validation, and process-memory evidence before completion.
39. Given a ticket is deleted in future repository work, durable docs require removal or refresh of linked translations, explanations, question image usages, content evidence, and validation records.
40. Given a deleted ticket used a shared image, durable docs require preserving shared image metadata while any remaining usage references it and deleting shared metadata only when it has no remaining usages.
41. Given final feature readiness, review fails unless durable docs include the ticket add/change/delete lifecycle and cleanup rules from AC-38 through AC-40.

## Negative Scenarios

- A metadata file that only repeats image alt text is not complete.
- A metadata file that mostly repeats the Spanish question, answer key, topic-guide rationale, filename, source URL, or inferred exam concept is not complete.
- A metadata record marked approved while saying object-level detail is uncertain or manual review is still required is not complete.
- A low-confidence deterministic baseline record cannot be made final by adding an evidence hash.
- A metadata file that describes the full scene but has no per-question answer-critical detail mapping is not complete.
- A per-image metadata entry copied into every question instead of sharing unique-image metadata is not acceptable unless implementation records a concrete reviewability reason and Architect approves it.
- A question usage mapping that marks all objects as critical without linking to answer reasoning is not complete.
- A question usage mapping that uses generic `source image`, `answer cue`, `visible context`, or equivalent placeholder critical details is not complete.
- An image-backed explanation that passes only because it has the right `questionId` is not acceptable.
- An image-backed explanation that relies on a question-derived answer cue while ignoring actual visible image details is not acceptable.
- A validation approach based only on keyword overlap between Russian prose and metadata is not sufficient.
- A validation approach that requires live AI/OCR/translation/network access is not acceptable.
- A translation layer covering fewer than 460 current questions is not complete.
- A translation layer with 460 entries is still incomplete if entries contain Spanish residue, transliteration, wrappers, glossary drafts, or incomplete answer translations.
- A translation shard produced by a generator, glossary pass, transliteration pass, or template fill is not complete until a content agent reviews every question and answer in the assigned range and records evidence.
- An explanation layer covering fewer than 460 current questions is not complete.
- An explanation layer with 460 entries is still incomplete if entries are generic filler, lack correct/wrong-answer rationales, omit image-specific reasoning, or are not reviewed.
- An explanation shard produced by fallback templates, copied topic labels, or generic generated prose is not complete until a content agent reviews every rationale in the assigned range and records evidence.
- An image metadata shard inferred from ticket text, answers, filenames, hashes, or generated captions is not complete until a content agent inspects every actual local image in the assigned range and replaces or approves the visible facts.
- A content-agent PR that edits outside its assigned range, edits another agent's shard, or hand-edits generated compatibility indexes is not acceptable.
- Durable docs that describe adding tickets but omit translation, explanation, image analysis, evidence refresh, or validation are incomplete.
- Durable docs that describe deleting tickets but omit cleanup of translations, explanations, image usages, evidence records, or shared-image reference checks are incomplete.
- A bulk content PR that adds all metadata, all translations, all explanations, validators, docs, and UI/import changes at once is too large for reliable review and violates this plan.
- Russian support must not become official source text, hide Spanish source text, or imply official-bank coverage.
- Implementation must not change product code, content, tests, scripts, or durable docs from this Architect-only branch before Orchestrator handoff.
- A draft PR, skipped AI Review, unresolved blocking review finding, pending merge conflict, or pending readiness task means the feature is not ready even if local commands pass.

## Verification And Review Requirements

Implementation Agent requirements:

- Start only after `feature-request.md`, `spec.md`, `plan.md`, and `tasks.md` exist.
- Use only the assigned isolated worktree and branch for the slice.
- Do not touch other agents' worktrees, branches, or unrelated changes.
- Keep the slice within the task scope assigned by the Orchestrator.
- For content slices, edit only the assigned non-overlapping shard files and never another content agent's range.
- For image metadata slices, inspect the actual local image files before approving metadata and record range-level evidence.
- For translation and explanation slices, perform full content-agent review of every assigned ticket and answer, not only generator output validation.
- Regenerate compatibility indexes with the repository shard writer after shard edits and record the exact command evidence.
- For durable docs slices, document ticket add/change/delete lifecycle rules without editing unrelated product content.
- Update this feature memory in the same PR with evidence, decisions, dead ends, known issues, and feedback.
- If implementation needs to diverge from this spec, record feedback in `tasks.md` for Architect disposition instead of silently changing scope.

Review Agent requirements:

- Review the PR against this feature memory, not only the diff.
- Use an isolated review worktree/context and do not edit files while acting as reviewer.
- Verify that image metadata, critical detail mappings, translations, explanations, evidence, validators, docs, and tests match the assigned slice.
- Sample and inspect content quality, not only schema/count success. Review must include representative image metadata, high-risk image metadata, representative translations, representative explanations, all known prior blockers, and any generator/validator patterns likely to create placeholders.
- Block the PR if placeholders, draft wrappers, transliteration, Spanish residue, low-confidence baseline metadata, generic source-image/answer-cue usage mappings, generic explanation filler, or unreviewed approved content remain.
- Verify deterministic offline behavior and absence of live AI/network validation.
- Verify stale hash/fingerprint failure modes and the old `b-fallback-001` regression.
- Verify content-agent shard evidence for every assigned image, translation, and explanation range included in the PR.
- Verify durable docs include ticket lifecycle rules for adding, changing, deleting, evidence refresh, and shared image cleanup before final readiness.
- Report blocking findings as GitHub inline review threads when acting under the repository review contract.

Final feature readiness requires:

- green required checks from `.unicorn-hub/config.json`;
- completed, non-skipped AI Review on the current PR head;
- PR is not draft;
- no unresolved merge conflicts;
- no blocking review findings;
- evidence for every acceptance criterion;
- Review Agent content-quality sampling evidence for images, translations, and explanations;
- content-agent range evidence for all image metadata, translation, and explanation shards;
- durable docs for ticket add/change/delete lifecycle and artifact cleanup;
- tasks T099-T102, T109-T111, and T114-T120 complete;
- current process memory for dead ends, decisions, known issues, verification evidence, and Implementation Agent feedback;
- only final human approval or merge mechanics remaining.
