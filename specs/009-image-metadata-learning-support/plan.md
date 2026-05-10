# Plan: Image Metadata And Learning Support Completion

## Summary

Build the feature in staged PR-sized implementation slices. First add the schema and deterministic validators in draft-safe mode. Then prove the model on the known `b-fallback-001` defect. Then complete image metadata, question-specific relevance mappings, translations, and explanations in reviewable shards, with evidence gates that detect stale images, stale question tuples, stale metadata, stale relevance roles, stale translations, and stale explanations. Finish by enabling strict global validation, updating durable docs/specs, running local preflight, and opening PRs through the repository workflow.

This plan is a full-completion plan, not an MVP or placeholder-seeding plan. Final readiness requires qualitative content review for every current ticket and image: complete image metadata, complete idiomatic Russian translations, and complete ticket-specific explanations. Count coverage, hashes, generated evidence, and locally passing tests do not make the feature ready when the content itself remains generic, draft-like, question-derived-only, or unreviewed.

The content completion model is one-time parallel content-agent work over non-overlapping shards. Image metadata agents inspect actual local image files and capture stable object/detail/region IDs plus semantic localization. Usage/relevance agents map those details to question-specific answer-critical/highlight, supporting, distractor/trap, and background/irrelevant/dim roles. Translation and explanation agents prepare or review every Russian text item in their range. Generators, templates, transliteration, glossary drafts, and text-inferred image metadata may be draft scaffolding only; they cannot be final approved content without range-level content-agent review evidence.

This Architect pass creates only `spec.md`, `plan.md`, and `tasks.md`.

## Technical Context

- Runtime: static local-first React/Vite app; no backend.
- Current runtime contract: Docker-only for end users with `make build`, `make up`, and `make down`.
- Current app imports JSON content through `src/data/content.ts`.
- Current validation entry point: `scripts/validate-content.mjs`.
- Current preflight command: `pnpm run preflight`.
- Current required checks: `baseline-checks`, `docker-validation`, `guard`, `AI Review`, `osv-scan`.
- Current question file: `content/questions/caba-b.unofficial-fallback.questions.json`.
- Current images: local files under `content/assets/questions/source-bandinopla-testdeconducir-b/`.
- Current Russian translation layer: `content/translations/ru.translations.json`.
- Current Russian explanation layer: `content/explanations/ru.explanations.json`.
- Current deterministic translation alignment precedent: `scripts/content-translation-alignment.mjs` plus `content/validation/ru-translation-alignment.evidence.json`.

Likely future paths:

```text
content/image-metadata/question-images.manifest.json
content/image-metadata/question-images/
content/validation/question-image-metadata.evidence.json
content/validation/ru-explanation-alignment.evidence.json
content/validation/ru-translation-alignment.evidence.json
scripts/content-image-metadata.mjs
scripts/content-explanation-alignment.mjs
scripts/content-translation-alignment.mjs
scripts/validate-content.mjs
tests/content-image-metadata.test.mjs
tests/content-explanation-alignment.test.mjs
tests/content-translation-alignment.test.mjs
tests/content-validation.test.mjs
src/data/content.ts
docs_project/project/backend/backend-docs.md
docs_project/project/frontend/frontend-docs.md
docs_project/project/feature-inventory.md
docs_project/project/content-sources.md
docs_project/screens/learning-and-exam-flows.md
docs/specify/04_data_model.md
docs/specify/05_content_pipeline.md
specs/009-image-metadata-learning-support/tasks.md
```

Final filenames may differ if implementation records a better repository fit in `tasks.md` and Architect disposes the change before merge.

## Constitution Check

- Spec-first: yes; Analyst intake exists and Architect artifacts precede implementation.
- Testable boundaries: yes; validators must be no-file-I/O helpers with direct unit tests, then integrated into content validation.
- Test-first bias: yes; each implementation slice must add failing or targeted tests for its validator/content surface before or alongside changes.
- Supervised verification: yes; acceptance criteria require command/evidence records, not AI summaries.
- PR-only workflow: yes; implementation changes must land through branches and PRs.
- One worktree per task: yes; each implementation slice uses an isolated worktree/branch/PR and must not touch other agents' work.
- Deployability: yes; intermediate PRs must keep existing app/build/preflight gates coherent.
- Simplicity: yes; prefer JSON, canonical fingerprints, and local validators before new dependencies or framework changes.
- Process memory: yes; `tasks.md` must record decisions, dead ends, known issues, verification evidence, and Implementation Agent feedback disposition.

## Design Approach

### Data Ownership

The question file remains the source of truth for Spanish question text, ordered answers, correct answer ID, image path, and image SHA-256.

The new image metadata layer owns semantic visual facts from actual local image review. It must not duplicate Spanish question text except as fingerprints or trace labels, and it must not substitute question-derived answer cues for visual inspection.

The new question image usage layer owns per-question relevance semantics. It references shared image metadata by `imageId`, references visible objects/details/regions by stable IDs, and references question/answer IDs by stable IDs.

Feature `009` owns image semantics and question-specific relevance. Parallel feature `010` may later render overlays, highlights, dimming, spotlights, callouts, and labels from `009` metadata. `010` owns presentation geometry and interaction, but it must not invent a competing source for answer-critical or irrelevant visual details.

The Russian translation layer owns question and answer translations for the question card.

The Russian explanation layer owns learner-facing explanations for the question card. Topic guide content may be used as drafting input, but it is not automatically the source of truth for the question-card explanation layer.

### Quality Bar

Implementation must treat image metadata, translations, and explanations as final user-facing learning content.

Image metadata quality requires:

- actual visual review of every image;
- concrete scene, camera/framing, object, road layout, sign/signal/marking, road-user, annotation, visible-text, relationship, and uncertainty details where visible;
- stable object/detail/region IDs and semantic localization for every visual fact referenced by usage mappings or explanations;
- optional approximate bounding boxes or polygons when the content agent can identify reliable boundaries, with semantic region descriptors required when exact coordinates are not feasible;
- enough detail for close visual recreation or review against a close recreation;
- question-specific relevance mappings that name actual visible facts, identify answer-critical/highlight details, distinguish supporting, distractor/trap, and background/irrelevant/dim details, and link answer-critical or trap details to the current answer choices.

Translation quality requires:

- idiomatic Russian question and answer text;
- no untranslated Spanish except intentional proper nouns, acronyms, source labels, or visible sign text;
- no transliteration, glossary scaffolding, draft wrappers, or machine-output labels;
- preservation of answer-critical qualifiers, negation, modality, numeric values, and road-user/sign/traffic context.

Explanation quality requires:

- ticket-specific correct-answer rationale;
- ticket-specific wrong-answer rationales for every incorrect answer;
- image-specific rationale where the image carries answer-critical information;
- source trace or ticket-specific fallback scoping for generalized rule/legal/procedure claims;
- no generic filler that would fit many unrelated tickets.

### Metadata Granularity

Use one shared visual metadata entry per unique image path/hash plus one question usage mapping per image-backed question.

This is required because `b2.jpg` is reused by two different questions. Shared visual metadata prevents drift; question usage mappings let the same image support different answer-critical interpretations.

Shared metadata must remain question-neutral: it names what is visibly present, assigns stable IDs, describes regions, and records uncertainty. Per-question usage must remain question-specific: it classifies those same IDs as answer-critical/highlight, supporting, distractor/trap, or background/irrelevant/dim for the exact question and answer set. The same object can be answer-critical in one usage and background/irrelevant in another.

### Sharding For Reviewability

The implementation should avoid one huge content PR and may avoid one huge JSON file. Preferred sharding:

- one manifest/index with baseline, schema version, and shard list;
- image metadata shards grouped by image filename numeric ranges or source-local path ranges;
- translation and explanation shards only if the app/import path and validator can consume them cleanly without a build-time network/service dependency.

If implementation keeps the existing single translation/explanation JSON files, content PRs must be sequenced so agents do not edit the same file concurrently. The Orchestrator must assign non-overlapping worktrees/branches and avoid simultaneous PRs that fight over the same monolithic file.

Current implementation infrastructure uses five range shards for all three content families:

```text
001-092
093-184
185-276
277-368
369-460
```

Current source-of-truth shard paths:

```text
content/image-metadata/question-images/<range>.json
content/translations/ru/<range>.json
content/explanations/ru/<range>.json
```

Every content agent must be assigned an explicit range and content family, use an isolated worktree/branch, and edit only the corresponding shard file(s). Generated compatibility indexes must be regenerated through the shard writer, not hand-edited. The expected command after shard edits is:

```sh
node scripts/content-shards.mjs --write-indexes
```

Any replacement sharding scheme must be recorded in `tasks.md`, preserve non-overlapping ownership, keep deterministic imports/validation, and be approved by Architect disposition before merge.

### One-Time Content-Agent Production Model

The final content pass is not an automated generator job. It is a coordinated one-time production/review workflow:

- Image metadata agents inspect the assigned local images directly and replace or approve every visible scene/object/road/sign/marking/road-user/annotation/relationship detail in the assigned image metadata shard.
- Image metadata agents capture stable `objectId`, `detailId`, and `regionId` references for visible facts that may be used by explanations, validators, or future overlays.
- Image metadata agents provide semantic region descriptors for referenced details and add approximate boxes/polygons only when reliable enough for review.
- Usage/relevance agents review the assigned question usage mappings and ensure answer-critical/highlight, supporting, distractor/trap, and background/irrelevant/dim roles are actual visible facts linked to current answer reasoning.
- Usage/relevance agents must not submit only prose descriptions; each mapping must reference shared image IDs and explain why each referenced detail matters or can be ignored for that exact ticket.
- Translation agents review or author idiomatic Russian question and answer-choice translations for every assigned ticket, preserving answer-critical meaning and removing Spanish residue, transliteration, wrappers, and glossary scaffolding.
- Explanation agents review or author ticket-specific explanations for every assigned ticket, including correct-answer rationale, wrong-answer rationales, source/ticket scoping, and image-critical reasoning where applicable.
- Each agent records range evidence: assigned range, content family, local files touched, question/image IDs covered, reviewer identity, review timestamp, validation commands, remaining ambiguities, and controlled exceptions.
- Each range should run the relevant structural and quality validators before handoff; final readiness still requires a fresh global quality gate and Review Agent sampling.

The Orchestrator may run image, translation, and explanation agents in parallel as long as their assigned files do not overlap. If a range needs cross-family coordination, such as an image-backed explanation waiting on image metadata, the agent records the dependency instead of inventing or bypassing missing visual facts.

### Ticket Lifecycle Documentation Requirement

Durable docs must be updated after Architect handoff to document how future ticket changes keep all derived artifacts in sync.

Required lifecycle coverage:

- Adding a ticket requires adding or validating the Spanish source tuple, local image/hash when present, image metadata when an image exists, question image usage mapping when an image exists, Russian question/answer translations, Russian explanation, review evidence, generated indexes, and validation/preflight evidence.
- Changing ticket text, answer IDs/text, correct answer, image path, image hash, or material image content requires refreshing affected translations, explanations, image usage mappings, overlay/relevance roles, image metadata when relevant, evidence fingerprints, generated indexes, and validators.
- Deleting a ticket requires removing or refreshing linked translations, explanations, question image usages, overlay/relevance mappings, explanation alignment evidence, translation evidence, usage evidence, generated indexes, and validation records.
- Shared image metadata is removed only when no remaining question usage references the image. If another ticket still uses the image, only the deleted/changed ticket's usage and related evidence are removed or refreshed.

Preferred docs to update in implementation:

- `docs_project/project/content-sources.md` for source/content lifecycle and artifact cleanup rules;
- `docs_project/project/backend/backend-docs.md` for offline validators and evidence;
- `docs_project/project/frontend/frontend-docs.md` only if import/runtime behavior or missing-support UI behavior changes;
- `docs/specify/04_data_model.md` and `docs/specify/05_content_pipeline.md` for canonical schema/pipeline terms when they change.

### Fingerprints

Use canonical JSON SHA-256 fingerprints, following the existing translation-alignment precedent.

Required source tuple components:

- `questionId`;
- `officialTextEs`;
- ordered `answers[].id` and `answers[].officialTextEs`;
- `correctAnswerId`;
- `image.localPath` and `image.sha256` when present.

Required image tuple components:

- `imageId`;
- `localPath`;
- `sha256`;
- normalized metadata fields that describe visible scene, objects, annotations, relationships, uncertainties, and visual detail IDs.
- normalized object/detail/region IDs and semantic localization descriptors referenced by usage or explanation evidence.

Required usage tuple components:

- `questionId`;
- `imageId`;
- `questionFingerprint`;
- `correctAnswerId`;
- relevance mappings for answer-critical/highlight, supporting, distractor/trap, and background/irrelevant/dim details;
- linked object/detail/region IDs and answer IDs where applicable.

Required translation tuple components:

- `questionId`;
- Russian question text;
- answer translations ordered by current source answer IDs.

Required explanation tuple components:

- `questionId`;
- learner-facing explanation text;
- correct-answer rationale;
- wrong-answer rationales ordered by current source answer IDs;
- source IDs or ticket-specific claim scopes;
- image detail references for image-backed questions.

Validation must compare current tuple fingerprints to approved evidence and fail on stale content.

### Evidence Model

Use deterministic local evidence files rather than automated semantic claims.

Image metadata evidence entries must record:

- `imageId`;
- `localPath`;
- `imageSha256`;
- `metadataSha256`;
- reviewer/reviewedAt/status;
- checks for visible scene coverage, object/detail/region ID coverage, road/sign/marking/road-user coverage, annotation coverage, spatial relationship coverage, semantic localization, uncertainty handling, no question-derived-only description, no placeholder/baseline wording, and no invented critical facts.

Question usage evidence entries must record:

- `questionId`;
- `imageId`;
- `questionFingerprint`;
- `usageSha256`;
- reviewer/reviewedAt/status;
- checks for answer-critical/highlight detail mapping, supporting/distractor/background relevance mapping, answer/trap linkage, no generic source-image/answer-cue detail IDs, no mark-everything-critical mapping, and no usage approval without reviewed visual facts.

Explanation alignment evidence entries must record:

- `questionId`;
- `sourceQuestionSha256`;
- `explanationSha256`;
- `imageMetadataSha256` and `usageSha256` for image-backed questions;
- reviewer/reviewedAt/status;
- checks for correct-answer rationale, wrong-answer rationales, source/ticket-specific scoping, image-critical details addressed, no generic filler, and no visual contradiction.
- checks that image-backed explanations reference the relevant answer-critical/highlight and supporting or distractor details needed for the rationale, while remaining consistent with background/irrelevant/dim mappings.

Translation evidence entries must also record reviewer checks for idiomatic Russian, complete answer translations, no untranslated Spanish residue, no transliteration, no wrapper/draft scaffolding, and no dropped answer-critical meaning.

Translation evidence entries must extend the existing model to full coverage of all current questions.

### Explanation Validation Strategy

Do not attempt broad natural-language understanding in validation. Use structured explanation fields and alignment evidence to make the review decision durable.

Recommended explanation shape:

```ts
type RussianQuestionExplanation = {
  questionId: string;
  textRu: string;
  correctAnswerExplanationRu: string;
  wrongAnswerExplanations: Record<answerId, string>;
  explanationType: string | string[];
  relatedSourceIds: string[];
  claimScope?: "direct_ticket" | "direct_image" | "current_official_source" | "ticket_specific_fallback";
  imageDetailReferences?: string[];
  disclaimer: string;
  reviewer?: string;
  reviewedAt?: string;
};
```

The final implementation may use different field names, but validation must be able to prove complete coverage and answer-level rationale coverage.

### `b-fallback-001` First Proof

The first content proof should be the known defect:

- add/validate `b13.jpg` image metadata;
- add/validate `b-fallback-001` question usage mapping;
- correct the explanation;
- add a regression test showing the old explanation fails;
- run targeted validation and record evidence.

This proves the architecture catches the motivating bug before the full 275-image and 460-question content effort begins.

## Implementation Slices

Each slice below is intended to be one branch and one PR unless the Orchestrator explicitly records a narrower split. Agents must use isolated worktrees and not touch other agents' branches or changes.

### Slice A: Schema And Validator Foundation

Goal: add draft-safe schemas, empty or minimal manifests, and deterministic validators without requiring full coverage yet.

Tasks:

- Add preferred image metadata manifest/shard structure.
- Add no-file-I/O image metadata validation helper.
- Add no-file-I/O explanation alignment validation helper.
- Extend or parameterize translation alignment validation to support strict full coverage later without breaking current draft state.
- Integrate draft-safe validators into `scripts/validate-content.mjs`.
- Add synthetic unit tests for schema shape, duplicate IDs, missing paths, missing critical details, stale fingerprints, missing evidence, and bad references.
- Update durable docs for new paths and validation concepts if new files are introduced.
- Record evidence in `tasks.md`.

Exit criteria:

- Draft-safe content validation still passes.
- Unit tests prove validators fail bad synthetic metadata/evidence.
- No full content coverage is required yet.

### Slice B: `b-fallback-001` Bug Proof

Goal: prove the schema and validator catch the known visual explanation defect.

Tasks:

- Add approved shared metadata for `b13.jpg`.
- Add approved question usage mapping for `b-fallback-001`.
- Correct the Russian explanation for `b-fallback-001`.
- Add image/explanation alignment evidence for `b-fallback-001`.
- Add a regression test using the old left-arm/bent-arm explanation and assert deterministic failure.
- Ensure correct answer remains `b-fallback-001-a2`.
- Record before/after evidence and commands in `tasks.md`.

Exit criteria:

- Old explanation fails validation in a test.
- Corrected explanation passes image-aware validation.
- `pnpm run validate:content`, targeted tests, and `git diff --check` pass.

### Slice C: Image Metadata Coverage Shards

Goal: complete metadata and question usage mappings for all current image-backed questions.

Recommended slicing:

- C1: `content/image-metadata/question-images/001-092.json`;
- C2: `content/image-metadata/question-images/093-184.json`;
- C3: `content/image-metadata/question-images/185-276.json`;
- C4: `content/image-metadata/question-images/277-368.json`;
- C5: `content/image-metadata/question-images/369-460.json`, duplicate-image audit, and global strict image coverage.

The Orchestrator may choose different exact ranges only with an Architect-recorded disposition. Each shard must own a non-overlapping image set and corresponding question usages. Duplicate image `b2.jpg` must be assigned once and both `b-fallback-256` and `b-fallback-303` usages must be checked together.

Each shard must:

- inspect every assigned local image file directly and add detailed visual metadata based on actual image review, not only question text, answer keys, topic-guide rationale, filenames, hashes, source URLs, or generated captions;
- assign stable object/detail/region IDs to referenced visible facts and provide semantic localization for those regions;
- include approximate boxes or polygons when a visible region can be localized reliably, while allowing semantic-only localization when exact coordinates would be misleading;
- add or update question usage mappings for assigned image-backed questions;
- map referenced details/regions to question-specific relevance roles: answer-critical/highlight, supporting, distractor/trap, and background/irrelevant/dim;
- mark answer-critical/highlight details with actual visible facts and current answer-choice linkage;
- identify enough non-critical, distractor, supporting, or background/irrelevant context to support future dimming rather than marking the whole image critical;
- record uncertainty for ambiguous images;
- add metadata evidence;
- add usage/relevance evidence;
- record range-level image-analysis content-agent evidence;
- edit only the assigned shard file and regenerate generated indexes through `node scripts/content-shards.mjs --write-indexes`;
- run targeted validator tests and `pnpm run validate:content`;
- update process memory.

Final C slice must enable strict image coverage:

- 276 current image references covered by question usages;
- 275 current unique image paths covered by metadata;
- no stale image hash/path/question fingerprints;
- no image-backed question missing answer-critical/highlight details;
- no image-backed question missing relevance mappings for non-critical, distractor, supporting, or background/irrelevant context;
- no usage mapping that marks every visible detail critical;
- no approved placeholder, baseline, low-confidence overall, question-derived-only, source-image-frame, or generic answer-cue metadata/usage records.

### Slice D: Translation Coverage Shards

Goal: complete Russian question and answer translations for all 460 current questions.

Recommended slicing:

- D1: `content/translations/ru/001-092.json`;
- D2: `content/translations/ru/093-184.json`;
- D3: `content/translations/ru/185-276.json`;
- D4: `content/translations/ru/277-368.json`;
- D5: `content/translations/ru/369-460.json`;
- D-final: strict global translation coverage and evidence freshness gate.

The current source-of-truth is sharded. If a future implementation proposes returning to a monolithic translation JSON file, run these slices sequentially on one branch/PR at a time and record an Architect disposition before content edits.

Each shard must:

- add or review idiomatic Russian question translation;
- add or review idiomatic Russian answer translations for exact answer IDs;
- add or refresh translation alignment evidence;
- add reviewer evidence for completeness, absence of untranslated Spanish residue, absence of transliteration, and preservation of answer-critical meaning;
- record range-level translation content-agent evidence and any hard cases;
- edit only the assigned translation shard and regenerate generated indexes through `node scripts/content-shards.mjs --write-indexes`;
- run translation validation and tests;
- record evidence.

Final D slice must enable strict full translation coverage for all 460 current question IDs and must block wrapper/draft/glossary/scaffolded translations even when coverage counts pass.

### Slice E: Explanation Coverage Shards

Goal: complete Russian explanations for all 460 current questions.

Recommended slicing:

- E1: `content/explanations/ru/001-092.json`;
- E2: `content/explanations/ru/093-184.json`;
- E3: `content/explanations/ru/185-276.json`;
- E4: `content/explanations/ru/277-368.json`;
- E5: `content/explanations/ru/369-460.json`;
- E-final enables strict global explanation coverage and answer-rationale validation.

Each shard must:

- add or review learner-facing explanation text;
- add or review ticket-specific correct-answer rationale;
- add or review ticket-specific wrong-answer rationales for every incorrect answer ID;
- add related source IDs or ticket-specific fallback scoping;
- for image-backed questions, reference image metadata critical details and add explanation alignment evidence;
- for image-backed questions, reference the required answer-critical/highlight details and any supporting or distractor/trap details needed to explain wrong answers;
- keep explanations concise and exam-focused;
- avoid unsupported current legal/rule claims;
- add reviewer evidence for answer-specificity, image-specificity where applicable, completeness, and absence of generic filler;
- record range-level explanation content-agent evidence and dependencies on image metadata shards;
- edit only the assigned explanation shard and regenerate generated indexes through `node scripts/content-shards.mjs --write-indexes`;
- record evidence.

No explanation shard may invent image facts not present in metadata. If metadata is missing for an image-backed question in the shard, the shard must either depend on the relevant C slice or include the missing metadata in the same PR only if the Orchestrator scopes it explicitly.

Final E slice must enable strict explanation coverage for all 460 current question IDs.
It must also block explanations that are structurally present but generic, missing answer-specific rationale, missing image-specific rationale, or not backed by review evidence.

### Slice F: Docs, Import, And UX Cleanup

Goal: make durable documentation and app imports align with the completed content model, including future ticket lifecycle rules.

Tasks:

- Update `src/data/content.ts` if content files are sharded or explanation/translation types changed.
- Ensure the question card no longer needs fallback messages for missing translations/explanations for current questions, unless retained only for future imported questions.
- Update durable `docs_project/` docs for image metadata, complete translation/explanation coverage, evidence files, offline validation, and unofficial-support boundaries.
- Update `docs_project/project/content-sources.md` with ticket lifecycle flow for adding, changing, and deleting tickets.
- Document that adding or materially changing a ticket requires image metadata/usage review when an image exists, Russian translation review, Russian explanation review, evidence refresh, generated-index refresh, strict validation, and process-memory evidence.
- Document that adding or materially changing a ticket with an image requires object/detail/region IDs and question-specific relevance mappings sufficient for future highlight/dim overlays.
- Document that deleting a ticket requires deleting or refreshing linked translations, explanations, question image usages, overlay/relevance mappings, explanation alignment evidence, translation evidence, usage evidence, generated indexes, and validation records.
- Document that shared image metadata is removed only when no remaining question usage references it.
- Update backend/frontend docs only where the import, validation, or user-facing support behavior changed.
- Update `docs/specify/04_data_model.md` and `docs/specify/05_content_pipeline.md` if canonical data model or pipeline terms changed.
- Add or update e2e coverage only if user-visible behavior changes.
- Record docs evidence in `tasks.md`.

### Slice G: Final Strict Gate And PR Readiness

Goal: prove the full feature is complete and merge-ready.

Tasks:

- Enable strict validators for:
  - all 460 translations;
  - all 460 explanations;
  - all 276 image-backed question usages;
  - all 275 unique image metadata entries;
  - answer-critical/highlight detail coverage;
  - supporting/distractor/background relevance coverage sufficient for future dimming;
  - image/explanation alignment evidence freshness;
  - stable object/detail/region ID references and semantic region localization;
  - no placeholder/generic/low-confidence-baseline image metadata or usage records;
  - no mark-everything-critical usage mappings;
  - no translation Spanish residue, transliteration, wrappers, or glossary drafts;
  - no generic explanation filler or missing answer-specific rationale.
- Run:
  - `pnpm run validate:content`;
  - `pnpm run test`;
  - `pnpm run build`;
  - `pnpm run test:e2e`;
  - `pnpm run preflight`;
  - `git diff --check`.
- For runtime-affecting changes, also run:
  - `make down`;
  - `make build`;
  - `make up`;
  - browser or HTTP smoke test against `http://localhost:5173`;
  - `make down`.
- Record exact evidence for every acceptance criterion in `tasks.md`.
- Confirm required checks are green after PR push.
- Confirm the PR is not draft, AI Review has run on the current head and is not skipped, no blocking review findings remain, no merge conflicts remain, and Review Agent content-quality sampling evidence is recorded.

## Validation Matrix

| Area | Required evidence |
| --- | --- |
| Image metadata schema | Unit tests for required fields, duplicate image IDs, missing visual detail IDs, invalid enums, uncertainty handling. |
| Region/object IDs | Validator evidence that referenced object/detail/region IDs exist, have semantic localization, and use optional boxes/polygons only when present and well-formed. |
| Image coverage | Validator evidence showing 275 unique image entries and 276 question usages against current question file. |
| Image metadata quality | Review evidence and tests rejecting placeholder/baseline/question-derived-only/source-image-frame metadata, low-confidence overall approval, and generic answer-cue usage records. |
| Highlight/dim relevance | Validator and review evidence that every image-backed usage has answer-critical/highlight detail(s), enough supporting/distractor/background context for dimming, and no mark-everything-critical mappings. |
| Content-agent shard evidence | For each assigned image, translation, and explanation range: content family, range, files touched, reviewer/agent, IDs covered, direct image-inspection confirmation where applicable, validation commands, ambiguities, and controlled exceptions. |
| Stale image detection | Unit test mutating an image hash/path and expecting metadata/evidence failure. |
| Stale question detection | Unit test mutating text, answer IDs/text, correct answer ID, or image hash and expecting usage/evidence failure. |
| Critical details | Validator evidence that every image-backed question has at least one answer-critical/highlight detail linked to current question and answer context. |
| `b-fallback-001` | Metadata assertion for cyclist/right-arm straight gesture, corrected explanation assertion, old-explanation regression failure. |
| Translation coverage | Validator evidence for all 460 current question IDs, exact answer IDs, fresh translation evidence, no untranslated Spanish residue, no transliteration, and no draft/wrapper scaffolding. |
| Translation quality | Review evidence that translations are idiomatic Russian and preserve answer-critical meaning for sampled/high-risk tickets and every prior blocker. |
| Explanation coverage | Validator evidence for all 460 current question IDs, correct-answer rationales, wrong-answer rationales, and fresh explanation evidence. |
| Explanation quality | Review evidence that explanations are ticket-specific, answer-specific, image-specific where needed, and not generic filler. |
| Image-aware explanations | Validator evidence that image-backed explanations reference critical details and fail stale/contradictory claims. |
| Official-source boundary | Review evidence that generalized legal/rule/numeric/procedure claims are source-traced or scoped ticket-specific. |
| Docs/specs | `rg` or diff evidence showing updated durable docs/specs for new paths, schemas, validators, and coverage rules. |
| Ticket lifecycle docs | Durable docs evidence showing add/change/delete ticket flow, evidence refresh, generated-index refresh, validation requirements, linked artifact cleanup, and shared image metadata reference checks. |
| Overlay/relevance lifecycle docs | Durable docs evidence showing overlay/relevance metadata refresh when ticket text, answer IDs/text, correct answer, image path/hash/content, usage mappings, or explanations change or delete. |
| Local preflight | `pnpm run preflight` and `git diff --check` result, plus Docker smoke flow if runtime-affecting. |
| PR workflow | PR is not draft; required checks are green; AI Review is completed, not skipped; Review Agent content sampling is recorded; no conflicts; no blocking findings; T099-T102/T109-T111/T114-T120/T163-T166 are complete. |

## Risks And Mitigations

- Risk: metadata authoring volume is large and subjective.
  - Mitigation: shard metadata work, require actual local image inspection, require structured fields, require uncertainty notes, and require deterministic range-level review evidence.

- Risk: validators create false confidence by checking evidence rather than visual truth.
  - Mitigation: evidence explicitly records reviewer approval and fingerprints; Review Agent must inspect representative images, all prior blockers, generated-pattern risks, and all high-risk/critical details in each shard.

- Risk: natural-language explanation validation becomes brittle.
  - Mitigation: validate structured explanation fields and image detail references instead of raw keyword overlap.

- Risk: all content in one JSON causes merge conflicts.
  - Mitigation: use the current five range shards, assign non-overlapping files, regenerate compatibility indexes mechanically, and reject cross-range edits unless explicitly coordinated.

- Risk: AI-generated drafts hallucinate visual details or legal claims.
  - Mitigation: require local review evidence, source trace/ticket-specific scoping, uncertainty fields, no live AI dependency in validation, and explicit rejection of draft wrappers/placeholders as final content.

- Risk: count coverage hides poor-quality generated content.
  - Mitigation: add hard quality gates, reviewer evidence fields, Review Agent sampling, and blocker tests for placeholder metadata, generic usage mappings, Spanish residue, transliteration, and generic explanation filler.

- Risk: content-agent parallelism creates inconsistent style or missed cross-family dependencies.
  - Mitigation: use shared schema and validation, require range evidence, record dependencies between image metadata and image-backed explanations, and run final global quality review after all ranges merge.

- Risk: feature `010` overlay work cannot reliably highlight/dim because `009` records only prose or flat critical booleans.
  - Mitigation: require stable object/detail/region IDs, semantic localization, optional boxes/polygons where feasible, and per-question relevance roles that distinguish answer-critical/highlight, supporting, distractor/trap, and background/irrelevant/dim.

- Risk: future ticket additions/deletions leave stale derived artifacts.
  - Mitigation: require durable ticket lifecycle docs and validation/evidence cleanup rules, including shared image metadata reference checks and overlay/relevance metadata refresh.

- Risk: expanded explanations duplicate or diverge from topic guide content.
  - Mitigation: keep question-card explanation layer as source of truth for this feature, record any reuse/sync decision in process memory, and validate complete coverage there.

- Risk: official rules may have changed.
  - Mitigation: generalized current claims must cite governed current official documents or remain ticket-specific fallback explanations.

- Risk: intermediate PRs cannot satisfy final strict coverage.
  - Mitigation: validators must support draft/slice mode until final strict gate; final slice must enable strict global validation.

## Branch And Worktree Instructions

- This Architect branch must contain only the three planning artifacts.
- Every implementation slice must get its own isolated worktree, branch, and PR.
- Implementation Agents must not edit files in other worktrees, reuse another agent's branch, or revert unrelated changes.
- Review Agents must inspect diffs without changing code, content, docs, tests, specs, scripts, or templates.
- Orchestrator must avoid parallel assignments that write the same monolithic content file unless the work has been serialized or sharded.
- Orchestrator must tell each content agent that parallel orchestrators/agents are active, assign only one non-overlapping range/content family per slice, and require the agent to edit only its assigned shard files.
- All agents must be told that parallel orchestrators/agents are active and that they must use only their assigned isolated environment.

## PR Workflow Requirements

For every implementation PR:

1. Confirm complete feature memory exists.
2. Confirm the PR is scoped to one assigned slice.
3. Record baseline and final verification evidence in `tasks.md`.
4. Run local verification appropriate to the slice.
5. Push the branch and open a PR through the repository workflow.
6. Wait for required checks: `baseline-checks`, `docker-validation`, `guard`, `AI Review`, `osv-scan`.
7. Ensure AI Review is completed on the current head; skipped AI Review is not acceptable for readiness.
8. Resolve blocking review findings.
9. Confirm the PR is not draft.
10. Confirm no merge conflicts.
11. Confirm T099-T102, T109-T111, T114-T120, and T163-T166 are complete before marking ready.
12. Leave final merge to a human or Orchestrator-controlled auto-merge only after all readiness gates pass.

## Completion Definition

This feature is complete only when:

- all current image-backed questions have metadata and critical detail mappings;
- all current image-backed questions have stable object/detail/region references and question-specific relevance mappings for highlight/dim semantics;
- all current questions have validated Russian translations and explanations;
- all image metadata is complete enough for close recreation and has full visual-review evidence;
- all translations are idiomatic Russian with no Spanish residue, transliteration, wrappers, or incomplete answer translations;
- all explanations are ticket-specific, answer-specific, image-specific where needed, and free of generic filler;
- all three content families have completed range-level content-agent evidence;
- the old `b-fallback-001` explanation fails validation and the corrected explanation passes;
- strict deterministic offline validation is enabled and passing;
- docs/specs and process memory are current, including ticket add/change/delete lifecycle and shared-image cleanup rules;
- local preflight passes;
- the final PR is not draft, has completed non-skipped AI Review, green required checks, no blocking review findings, no conflicts, completed T099-T102/T109-T111/T114-T120/T163-T166, and only human approval/merge mechanics remaining.
