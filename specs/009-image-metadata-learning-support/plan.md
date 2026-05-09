# Plan: Image Metadata And Learning Support Completion

## Summary

Build the feature in staged PR-sized implementation slices. First add the schema and deterministic validators in draft-safe mode. Then prove the model on the known `b-fallback-001` defect. Then complete image metadata, translations, and explanations in reviewable shards, with evidence gates that detect stale images, stale question tuples, stale metadata, stale translations, and stale explanations. Finish by enabling strict global validation, updating durable docs/specs, running local preflight, and opening PRs through the repository workflow.

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

The new image metadata layer owns semantic visual facts. It must not duplicate Spanish question text except as fingerprints or trace labels.

The new question image usage layer owns per-question critical details. It references shared image metadata by `imageId` and references question/answer IDs by stable IDs.

The Russian translation layer owns question and answer translations for the question card.

The Russian explanation layer owns learner-facing explanations for the question card. Topic guide content may be used as drafting input, but it is not automatically the source of truth for the question-card explanation layer.

### Metadata Granularity

Use one shared visual metadata entry per unique image path/hash plus one question usage mapping per image-backed question.

This is required because `b2.jpg` is reused by two different questions. Shared visual metadata prevents drift; question usage mappings let the same image support different answer-critical interpretations.

### Sharding For Reviewability

The implementation should avoid one huge content PR and may avoid one huge JSON file. Preferred sharding:

- one manifest/index with baseline, schema version, and shard list;
- image metadata shards grouped by image filename numeric ranges or source-local path ranges;
- translation and explanation shards only if the app/import path and validator can consume them cleanly without a build-time network/service dependency.

If implementation keeps the existing single translation/explanation JSON files, content PRs must be sequenced so agents do not edit the same file concurrently. The Orchestrator must assign non-overlapping worktrees/branches and avoid simultaneous PRs that fight over the same monolithic file.

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

Required usage tuple components:

- `questionId`;
- `imageId`;
- `questionFingerprint`;
- `correctAnswerId`;
- answer-critical details and linked answer IDs.

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
- checks for visible scene coverage, object/detail coverage, annotation coverage, uncertainty handling, and no invented critical facts.

Question usage evidence entries must record:

- `questionId`;
- `imageId`;
- `questionFingerprint`;
- `usageSha256`;
- reviewer/reviewedAt/status;
- checks for answer-critical detail mapping and answer/trap linkage.

Explanation alignment evidence entries must record:

- `questionId`;
- `sourceQuestionSha256`;
- `explanationSha256`;
- `imageMetadataSha256` and `usageSha256` for image-backed questions;
- reviewer/reviewedAt/status;
- checks for correct-answer rationale, wrong-answer rationales, source/ticket-specific scoping, image-critical details addressed, and no visual contradiction.

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

- C1: image filename range 1;
- C2: image filename range 2;
- C3: image filename range 3;
- C4: image filename range 4;
- C5: remaining images, duplicate-image audit, and global strict image coverage.

The Orchestrator may choose exact ranges based on file counts. Each shard must own a non-overlapping image set and corresponding question usages. Duplicate image `b2.jpg` must be assigned once and both `b-fallback-256` and `b-fallback-303` usages must be checked together.

Each shard must:

- add detailed visual metadata for assigned unique images;
- add or update question usage mappings for assigned image-backed questions;
- mark answer-critical details;
- record uncertainty for ambiguous images;
- add metadata evidence;
- run targeted validator tests and `pnpm run validate:content`;
- update process memory.

Final C slice must enable strict image coverage:

- 276 current image references covered by question usages;
- 275 current unique image paths covered by metadata;
- no stale image hash/path/question fingerprints;
- no image-backed question missing answer-critical details.

### Slice D: Translation Coverage Shards

Goal: complete Russian question and answer translations for all 460 current questions.

Recommended slicing:

- D1: `b-fallback-001` through `b-fallback-115`;
- D2: `b-fallback-116` through `b-fallback-230`;
- D3: `b-fallback-231` through `b-fallback-345`;
- D4: `b-fallback-346` through `b-fallback-460`;
- D5: strict global translation coverage and evidence freshness gate.

If implementation uses a monolithic translation JSON file, run these slices sequentially on one branch/PR at a time to avoid conflicts. If implementation introduces validated translation shards, ensure `src/data/content.ts`, validators, tests, and docs explain the import/merge behavior.

Each shard must:

- add Russian question translation;
- add answer translations for exact answer IDs;
- add or refresh translation alignment evidence;
- run translation validation and tests;
- record evidence.

Final D slice must enable strict full translation coverage for all 460 current question IDs.

### Slice E: Explanation Coverage Shards

Goal: complete Russian explanations for all 460 current questions.

Recommended slicing:

- E1-E4 mirror the translation ranges, or split by topic if source-trace risk is easier to review by topic.
- E-final enables strict global explanation coverage and answer-rationale validation.

Each shard must:

- add learner-facing explanation text;
- add correct-answer rationale;
- add wrong-answer rationales for every incorrect answer ID;
- add related source IDs or ticket-specific fallback scoping;
- for image-backed questions, reference image metadata critical details and add explanation alignment evidence;
- keep explanations concise and exam-focused;
- avoid unsupported current legal/rule claims;
- record evidence.

No explanation shard may invent image facts not present in metadata. If metadata is missing for an image-backed question in the shard, the shard must either depend on the relevant C slice or include the missing metadata in the same PR only if the Orchestrator scopes it explicitly.

Final E slice must enable strict explanation coverage for all 460 current question IDs.

### Slice F: Docs, Import, And UX Cleanup

Goal: make durable documentation and app imports align with the completed content model.

Tasks:

- Update `src/data/content.ts` if content files are sharded or explanation/translation types changed.
- Ensure the question card no longer needs fallback messages for missing translations/explanations for current questions, unless retained only for future imported questions.
- Update durable `docs_project/` docs for image metadata, complete translation/explanation coverage, evidence files, offline validation, and unofficial-support boundaries.
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
  - answer-critical detail coverage;
  - image/explanation alignment evidence freshness.
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
- Confirm no blocking review findings and no merge conflicts remain.

## Validation Matrix

| Area | Required evidence |
| --- | --- |
| Image metadata schema | Unit tests for required fields, duplicate image IDs, missing visual detail IDs, invalid enums, uncertainty handling. |
| Image coverage | Validator evidence showing 275 unique image entries and 276 question usages against current question file. |
| Stale image detection | Unit test mutating an image hash/path and expecting metadata/evidence failure. |
| Stale question detection | Unit test mutating text, answer IDs/text, correct answer ID, or image hash and expecting usage/evidence failure. |
| Critical details | Validator evidence that every image-backed question has at least one answer-critical detail linked to current question and answer context. |
| `b-fallback-001` | Metadata assertion for cyclist/right-arm straight gesture, corrected explanation assertion, old-explanation regression failure. |
| Translation coverage | Validator evidence for all 460 current question IDs, exact answer IDs, and fresh translation evidence. |
| Explanation coverage | Validator evidence for all 460 current question IDs, correct-answer rationales, wrong-answer rationales, and fresh explanation evidence. |
| Image-aware explanations | Validator evidence that image-backed explanations reference critical details and fail stale/contradictory claims. |
| Official-source boundary | Review evidence that generalized legal/rule/numeric/procedure claims are source-traced or scoped ticket-specific. |
| Docs/specs | `rg` or diff evidence showing updated durable docs/specs for new paths, schemas, validators, and coverage rules. |
| Local preflight | `pnpm run preflight` and `git diff --check` result, plus Docker smoke flow if runtime-affecting. |
| PR workflow | PR shows required checks green, AI Review satisfied, no conflicts, no blocking findings. |

## Risks And Mitigations

- Risk: metadata authoring volume is large and subjective.
  - Mitigation: shard metadata work, require structured fields, require uncertainty notes, and require deterministic review evidence.

- Risk: validators create false confidence by checking evidence rather than visual truth.
  - Mitigation: evidence explicitly records reviewer approval and fingerprints; Review Agent must inspect representative images and all high-risk/critical details in each shard.

- Risk: natural-language explanation validation becomes brittle.
  - Mitigation: validate structured explanation fields and image detail references instead of raw keyword overlap.

- Risk: all content in one JSON causes merge conflicts.
  - Mitigation: prefer sharded metadata and consider sharded translations/explanations; otherwise sequence monolithic-file slices.

- Risk: AI-generated drafts hallucinate visual details or legal claims.
  - Mitigation: require local review evidence, source trace/ticket-specific scoping, uncertainty fields, and no live AI dependency in validation.

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

## PR Workflow Requirements

For every implementation PR:

1. Confirm complete feature memory exists.
2. Confirm the PR is scoped to one assigned slice.
3. Record baseline and final verification evidence in `tasks.md`.
4. Run local verification appropriate to the slice.
5. Push the branch and open a PR through the repository workflow.
6. Wait for required checks: `baseline-checks`, `docker-validation`, `guard`, `AI Review`, `osv-scan`.
7. Resolve blocking review findings.
8. Confirm no merge conflicts.
9. Leave final merge to a human.

## Completion Definition

This feature is complete only when:

- all current image-backed questions have metadata and critical detail mappings;
- all current questions have validated Russian translations and explanations;
- the old `b-fallback-001` explanation fails validation and the corrected explanation passes;
- strict deterministic offline validation is enabled and passing;
- docs/specs and process memory are current;
- local preflight passes;
- the final PR has green required checks, no blocking review findings, no conflicts, and only human approval/merge mechanics remaining.
