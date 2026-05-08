# Tasks: Source Scope Guard

## Setup

- [x] T001 Confirm active feature folder and branch.
- [x] T002 Read `feature-request.md`, `spec.md`, and `plan.md` before editing product files.
- [x] T003 Run baseline checks before implementation edits.

## Implementation

- [x] T004 Add policy fields for practice-source scope allowlists.
- [x] T005 Add structured `practiceQuestionScope` metadata to the current fallback source.
- [x] T006 Add `scripts/content-source-scope.mjs` as a small testable validation helper.
- [x] T007 Update `scripts/validate-content.mjs` to use structured source-scope validation and remove fuzzy metadata rejection from the primary guard.
- [x] T008 Add Node regression tests for valid B-with-motorcycle-mentions, missing scope, non-B scope, unknown scope kind, and category mismatch.
- [x] T009 Update durable docs for source-level guard behavior.

## Verification

- [x] T010 Run `pnpm run validate:content`.
- [x] T011 Run `pnpm run test`.
- [x] T012 Run `pnpm run build`.
- [x] T013 Run `pnpm run preflight`.
- [x] T014 Run `git diff --check`.
- [x] T015 Record verification evidence and update docs/tasks status.
- [x] T016 Confirm every Implementation Agent feedback item has Architect disposition before completion.

## PR Readiness

- [x] T017 Review diff scope for unrelated changes.
- [x] T018 Create or prepare a PR according to repository workflow.

## Process Memory

### Dead Ends

- None yet.

### Decisions

- Use `004-source-scope-guard` because the existing highest numeric prefix under `specs/` is `003`.
- Treat the weakness as a content-validation/source-selection problem, not a UI or question-filtering problem.
- Keep full official category B bank validation out of scope.
- Add `scripts/content-source-scope.mjs` instead of embedding more logic in `scripts/validate-content.mjs`, because source-scope edge cases need direct tests with synthetic sources.
- Replace fuzzy metadata rejection with structured source eligibility. Source titles and question text can mention motorcycles when the source scope explicitly permits category B.

### Known Issues

- Full official CABA category B question bank availability remains unresolved.
- Structured source scope improves validation determinism, but still depends on review discipline when adding or changing source records.

### Verification Evidence

- Branch check: `git status --short --branch` reported `## main...origin/main` before the new branch was created.
- Branch creation: `git switch -c codex/004-source-scope-guard` succeeded.
- Analyst intake created `specs/004-source-scope-guard/feature-request.md`.
- Architect planning created `spec.md`, `plan.md`, and `tasks.md`.
- Baseline `pnpm run validate:content` passed before implementation: 460 category B fallback questions and 276 local image references.
- Baseline `pnpm run test` passed before implementation: 18/18 Node tests.
- Implementation added policy allowlists, current fallback `practiceQuestionScope`, source-scope helper, validator integration, unit tests, and durable docs.
- `pnpm run validate:content` passed after implementation: 460 category B fallback questions and 276 local image references.
- `pnpm run test` passed after implementation: 23/23 Node tests, including source-scope regressions for valid B-with-motorcycle-mentions, missing scope, non-B scope, unknown scope kind, and category mismatch.
- `pnpm run build` passed after implementation: content validation, asset sync, Vite build, and generated service worker with 280 cached assets. Vite emitted the existing non-blocking chunk-size warning.
- Docs/source-scope search passed: `rg -n "source-level|practice source|motorcycle mentions|cross-category|practiceQuestionScope|structured practice-source" docs_project specs/004-source-scope-guard scripts tests content` found the new source-level guard guidance, helper, tests, and source metadata.
- `git diff --check` passed with no output.
- `pnpm run preflight` passed: feature-memory gate, repository baseline, content validation, unit tests 23/23, production build, nested e2e build, and Playwright 8/8. Vite emitted the existing non-blocking chunk-size warning; Playwright web server emitted existing `NO_COLOR`/`FORCE_COLOR` warnings.
- Diff scope review found only source-scope validation, content source/policy metadata, durable docs, tests, and `specs/004-source-scope-guard/` changes.
- GitHub publish prerequisites passed: `gh --version` reported 2.92.0, `gh auth status` showed authenticated user `cucumberfalse`, and `gh repo view --json nameWithOwner,defaultBranchRef` resolved `cucumberfalse/cabadrive` with default branch `main`.
- PR is prepared from branch `codex/004-source-scope-guard` with a draft PR body summarizing source-scope guard changes and verification.

## Implementation Agent Feedback

None.

## Architect Dispositions

No Architect disposition required because no Implementation Agent feedback was recorded.
