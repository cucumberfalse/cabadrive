# Spec: Source Scope Guard

## Analyst Intake

- Source request: `feature-request.md`
- Intake assumptions or open questions carried into this spec:
  - The guard should protect practice-source selection for category B, not remove every question or source text that mentions motorcycles.
  - Full official CABA category B bank validation remains out of scope.
  - Current `unofficial_b_fallback` content can remain if its source has explicit category B practice scope.

## Goal

Replace fuzzy A/A4/motorcycle source metadata rejection with a structured practice-source scope contract that accepts category B sources and rejects non-B practice sources without blocking valid category B material that mentions motorcycles as road users.

## Scope

In scope:

- Add structured practice-question source scope metadata for question-bank sources in `content/sources/sources.json`.
- Add a small testable source-scope validation boundary used by `scripts/validate-content.mjs`.
- Update content validation so every practice question source explicitly allows the question category.
- Reject missing, unknown, category A, category A4, motorcycle-specific, and non-B practice source scopes.
- Add Node tests for source-scope validation edge cases.
- Update durable docs and this feature memory to state that the guard is source-level, not topic-text-level.

Out of scope:

- Replacing the fallback question bank.
- Claiming official or complete category B question-bank coverage.
- Filtering individual questions by motorcycle-related words in `officialTextEs`, answers, translations, or explanations.
- UI changes unrelated to displaying existing source/content labels.
- Docker runtime behavior changes.
- Branch protection, CI workflow, or automation-script changes beyond the local validation script and tests.

## User Stories

### User Story 1

As a Cabadrive maintainer, I want practice-question sources to declare which license category they support, so that category B training cannot accidentally use category A, A4, or motorcycle-specific banks.

### User Story 2

As a category B learner, I want valid B practice questions about shared-road topics, including motorcycles or motovehicles, to remain available, so that the trainer prepares me for realistic traffic questions instead of over-filtering useful material.

### User Story 3

As a future content ingester, I want source eligibility to be machine-readable rather than inferred from title text, so that adding or reviewing sources is deterministic and testable.

## Acceptance Criteria

1. Given a practice question whose source has structured scope allowing category B, when content validation runs, then the question is accepted even if source title, source notes, question text, or answer text mentions motorcycles.
2. Given a practice question whose source has no structured practice scope, when content validation runs, then validation fails with a source-scope error.
3. Given a practice question whose source scope allows only category A, A4, motorcycle, or any category other than B, when content validation runs, then validation fails.
4. Given the current committed fallback dataset, when `pnpm run validate:content` runs, then validation passes and still reports 460 category B fallback questions and 276 local image references.
5. Given local tests run, when `pnpm run test` executes, then source-scope regression tests cover valid B-with-motorcycle-mentions, missing scope, non-B category scope, and unknown scope kind.
6. Given durable docs are inspected, when future agents read backend/feature inventory guidance, then they can see that the guard excludes non-B practice sources while allowing cross-category road-user mentions inside valid category B material.

## Negative Scenarios

1. Given a source title says "category B" but its structured scope is missing or not category B, when validation runs, then title text must not rescue the source.
2. Given a source title or retrieval note contains "motos" only as a shared-road topic but structured scope is category B, when validation runs, then the source must not be rejected by text matching.
3. Given a question is marked category B but references a source scoped to category A, A4, motorcycle, or unknown practice scope, when validation runs, then the build must fail before production output.
4. Given this feature is implemented, when reviewing the diff, then unrelated UI, Docker, CI, branch-protection, or source-bank replacement changes are out of scope unless recorded with Architect disposition.

## Requirements

- FR-001: Define one structured practice-question source scope object for question-bank sources.
- FR-002: Require every source referenced by practice questions to provide structured practice-question scope.
- FR-003: Require each practice question's category to be included in the referenced source's eligible categories.
- FR-004: Require source-scope kind to be one of the policy-allowed practice source kinds.
- FR-005: Reject source scopes whose eligible categories are not all allowed for the current MVP category B practice mode.
- FR-006: Remove fuzzy A/A4/motorcycle metadata rejection from the primary validation path.
- FR-007: Preserve rejection of the current question-level `category !== "B"` rule.
- FR-008: Add source-scope tests outside the full content fixture so edge cases can be tested directly.
- FR-009: Update durable docs to describe the source-level boundary.
- FR-010: Record verification evidence, decisions, known issues, and Implementation Agent feedback in `tasks.md`.

## Success Criteria

- SC-001: `pnpm run validate:content` passes on the committed dataset.
- SC-002: `pnpm run test` passes and includes source-scope regression tests.
- SC-003: `pnpm run build` passes.
- SC-004: `pnpm run preflight` passes, or any unrelated blocker is recorded with exact evidence.
- SC-005: `git diff --check` passes.
- SC-006: Changed docs and feature memory state that A/A4/motorcycle-specific sources are excluded, but motorcycle mentions inside valid B material are allowed.

## Assumptions

- The current fallback source is intended as category B/CABA practice data and may be annotated accordingly.
- CABA category B training can include questions about shared-road users, signs, lanes, parking, or rules that mention motorcycles or motovehicles.
- A small validation helper module is justified because source-scope rules need direct unit coverage without mutating committed fixture files.

## Review And Verification Requirements

- Implementation requirements: keep the change focused on content validation, source metadata, targeted tests, docs, and feature memory. Do not replace the dataset or alter UI behavior unless a test exposes a necessary integration issue.
- Review requirements: verify that structured scope, not regex over source text, controls source eligibility; verify tests cover both false-positive and false-negative cases; verify docs do not imply official/full-bank category B coverage.
- Test/verification requirements: run `pnpm run validate:content`, `pnpm run test`, `pnpm run build`, `pnpm run preflight`, and `git diff --check`; record exact outcomes in `tasks.md`.
