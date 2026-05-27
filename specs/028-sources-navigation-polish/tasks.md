# Tasks: Sources Fragment Navigation Polish

## Status Legend

- `[ ]` Not started
- `[~]` In progress
- `[x]` Complete

## Architect Planning Setup

- [x] T001 Confirm assigned role is Architect only.
- [x] T002 Confirm assigned worktree `/Users/chap/devel/cabadrive-worktrees/028-sources-navigation-polish`, branch `codex/028-sources-navigation-polish`, and verified base `origin/main c6e3c34d93bd63a0836c148ccfc5d0e32375a930`.
- [x] T003 Read `.specify/memory/constitution.md`.
- [x] T004 Read durable project memory sufficient for the source-reader UI scope: `docs_project/README.md`, `docs_project/project-idea.md`, `docs_project/project/frontend/frontend-docs.md`, `docs_project/project/backend/backend-docs.md`, `docs_project/project/feature-inventory.md`, `docs_project/screens/learning-and-exam-flows.md`, `docs/specify/README.md`, and `docs_project/project/frontend/design-system.md`.
- [x] T005 Read Analyst intake at `specs/028-sources-navigation-polish/feature-request.md`.
- [x] T006 Inspect relevant source/test files read-only: `src/App.tsx`, `src/styles.css`, `tests/e2e/app.spec.ts`, and `package.json`.
- [x] T007 Create `spec.md`.
- [x] T008 Create `plan.md`.
- [x] T009 Create this `tasks.md`.

## Implementation Setup

- [x] T010 Confirm Implementation Agent starts from complete feature memory: `feature-request.md`, `spec.md`, `plan.md`, and `tasks.md`.
- [x] T011 Confirm assigned implementation worktree, branch, PR slice, and latest verified base or Orchestrator-approved handoff context.
- [x] T012 Run `git status --short --branch` before editing and record any pre-existing dirty/untracked state.
- [x] T013 Read active feature memory and relevant source/docs before editing.
- [x] T014 Confirm parallel-work preservation: no sibling worktrees, branches, PRs, commits, dirty diffs, or process memory will be overwritten, reset, rebased, deleted, or otherwise mutated.

## UI Fix Tasks

- [x] T015 Reproduce or inspect the `Источники` `Фрагменты` navigation defect on a desktop viewport using a long source document.
- [x] T016 Reproduce or inspect the same navigation on a mobile viewport after opening a source document.
- [x] T017 Identify the minimal layout cause. Start with `.source-toc-list`, `.source-toc button`, `.source-toc span`, and `.source-toc small`; broaden only if evidence requires it.
- [x] T018 Implement the smallest practical layout fix, expected to be scoped to `src/styles.css` source-reader TOC selectors.
- [x] T019 Ensure TOC buttons cannot shrink into vertical text overlap or sibling-row collision.
- [x] T020 Ensure label and subtitle text wrap or truncate deliberately with stable `line-height`, spacing, and `overflow-wrap`/clamp behavior as needed.
- [x] T021 Ensure selected/active TOC rows remain visually distinct.
- [x] T022 Ensure keyboard focus remains visible and does not cause row overlap, clipping, or layout jump.
- [x] T023 Ensure mobile TOC rows avoid horizontal overflow and remain touch-friendly.
- [x] T024 Preserve source document selection behavior and selected-chunk initialization.
- [x] T025 Preserve fragment selection behavior and displayed chunk updates.
- [x] T026 Preserve `Просто`, `Полный перевод`, and `Оригинал ES` mode switching for the selected chunk.
- [x] T027 Preserve source-reader official/unofficial labeling and local-only content boundaries.
- [x] T028 Do not change official source content, Russian source-reader content, content validators, backend/runtime contracts, PDF handling, service-worker strategy, or unrelated app surfaces unless Orchestrator/Architect disposition explicitly expands scope.

## Test and Verification Tasks

- [x] T029 Add or update focused Playwright coverage for desktop `.source-toc` visual stability.
- [x] T030 Add or update focused Playwright coverage for mobile `.source-toc` visual stability.
- [x] T031 Include geometry assertions where practical: visible TOC buttons do not overlap adjacent visible buttons, child `span` and `small` do not overlap, and visible text is not clipped by the button box.
- [x] T032 Include or preserve assertion that selecting a TOC item updates `source-chunk-reader`.
- [x] T033 Include or preserve assertion that switching source documents refreshes the fragment list and selected chunk.
- [x] T034 Include or preserve assertions for `source-mode-simple`, `source-mode-full`, and `source-mode-spanish`.
- [x] T035 Include or preserve local-only assertions: no external requests, PDF requests, backend/live-AI requests, iframe/embed/object PDF viewers, or `.pdf` source-reader links.
- [x] T036 Run focused primary-source e2e coverage, for example `pnpm exec playwright test tests/e2e/app.spec.ts -g "primary source"`, and record output.
- [x] T037 Run `pnpm run test` and record output.
- [x] T038 Run `pnpm run build` and record output.
- [x] T039 Run `node scripts/check-feature-memory.mjs --worktree` and record output.
- [x] T040 Run `git diff --check` and record output.
- [x] T041 Run `pnpm run preflight` before PR readiness unless Orchestrator explicitly narrows validation, and record output.
- [x] T042 Capture desktop and mobile screenshot evidence if useful for review or if geometry assertions are not sufficient.

## Documentation Tasks

- [x] T043 Leave durable project docs unchanged if the implementation is a pure source-reader TOC UI polish with no behavior, architecture, runtime, content, or workflow contract change.
- [x] T044 If implementation changes durable behavior or contracts, update the relevant `docs_project/` file and record why here.

## Review Requirements

- [ ] T045 Review Agent verifies complete feature memory and role-boundary compliance.
- [ ] T046 Review Agent verifies the diff is narrow and justified by the `Источники` fragment navigation defect.
- [ ] T047 Review Agent verifies no official source content, Russian source-reader corpus, archive metadata, validator, backend/runtime, PDF, or service-worker behavior changed unexpectedly.
- [ ] T048 Review Agent verifies desktop and mobile no-overlap/no-clipping evidence for `.source-toc` rows.
- [ ] T049 Review Agent verifies source document selection, fragment selection, text modes, keyboard focus, and local-only constraints remain covered.
- [ ] T050 Review Agent verifies Implementation Agent feedback has Architect disposition before final validation.

## Acceptance Checklist

- [x] A001 Desktop `Источники` `Фрагменты` rows show no text overlap, smeared collisions, or accidental clipping.
- [x] A002 Mobile `Источники` `Фрагменты` rows show no text overlap, smeared collisions, accidental clipping, or horizontal overflow.
- [x] A003 Long labels/subtitles wrap or truncate intentionally without hiding orientation-critical identifiers.
- [x] A004 Active and focused TOC rows remain readable and accessible.
- [x] A005 Selecting source documents and fragments still works.
- [x] A006 `Просто`, `Полный перевод`, and `Оригинал ES` still work for the selected chunk.
- [x] A007 Source-reader official/unofficial labels remain intact.
- [x] A008 No runtime network, PDF, backend, live-AI, or remote-asset dependency is introduced.
- [x] A009 Required local verification evidence is recorded in this feature memory.

## Process Memory

### Decisions

- The feature is scoped to a narrow UI polish for the `Источники` fragment navigation.
- The likely minimal implementation is CSS-only around `.source-toc` selectors, but Implementation Agent may choose another narrow fix if code inspection proves the layout constraint lives elsewhere.
- Durable project docs are not expected to change unless implementation changes product behavior, architecture, runtime, content boundaries, or documented design rules.
- Geometry-based e2e assertions are required because ordinary text assertions can pass while visual overlap remains.
- Implementation Agent kept the product fix CSS-only in `src/styles.css`, scoped to `.source-toc` selectors.
- The minimal cause was confirmed as shrinkable `.source-toc` flex-column items with content taller than the previous `min-height: 42px`; visible `span`/`small` text could escape the button box and visually collide.
- The chosen fix makes `.source-toc button` non-shrinking (`flex: 0 0 auto`) and gives each button a stable grid layout, explicit gap, line-height, `min-width: 0`, normal wrapping, and existing `overflow-wrap` support.
- Durable docs were left unchanged because the implementation does not change product behavior, architecture, runtime, content boundaries, or workflow contracts.

### Context Evidence

- Architect startup `git status --short --branch` reported `## codex/028-sources-navigation-polish...origin/main` with untracked `specs/028-sources-navigation-polish/`, expected from Analyst-created feature memory.
- Implementation Agent startup at `2026-05-26T23:49:55-03:00` confirmed complete feature memory in `/Users/chap/devel/cabadrive-worktrees/028-sources-navigation-polish` on branch `codex/028-sources-navigation-polish`.
- Implementation Agent startup `git status --short --branch` reported `## codex/028-sources-navigation-polish...origin/main` with untracked `specs/028-sources-navigation-polish/`; this is expected Analyst/Architect feature memory and must be preserved.
- Implementation Agent confirmed the Orchestrator-approved single PR slice uses Analyst-created latest-main handoff context from `origin/main` at `c6e3c34d93bd63a0836c148ccfc5d0e32375a930`.
- Implementation Agent confirmed parallel-work preservation: no sibling worktrees, branches, PRs, commits, dirty diffs, or process memory will be overwritten, reset, rebased, deleted, or otherwise mutated.
- Implementation Agent read the required durable memory, active feature memory, `src/App.tsx`, `src/styles.css`, `tests/e2e/app.spec.ts`, `package.json`, and `playwright.config.ts` before product/test edits.
- Analyst intake records original screenshot defect as vertically compressed or overlapping fragment items in the `Фрагменты` navigation column.
- `src/App.tsx` renders `.source-toc-list` buttons with a label `span` and subtitle `small`.
- `src/styles.css` currently defines `.source-toc-list` as a vertical flex list and `.source-toc button` with `min-height: 42px`; long labels can require more height than the minimum.
- Existing e2e tests cover primary-source modes, long-document TOC selection, keyboard focus, compact/expanded source-reader layout, and no runtime network/PDF/backend dependencies.
- Implementation Agent added `assertSourceTocGeometry` in `tests/e2e/app.spec.ts` to inspect visible TOC button bounding boxes, label/subtitle geometry, sibling-row overlap, and mobile horizontal overflow.

### Dead Ends

- Architect planning: none.
- Implementation startup `pnpm run build` initially failed before dependency install because `node_modules` was absent in the isolated worktree and `pdf-parse` could not be resolved by the manual validator. `pnpm install --frozen-lockfile` completed successfully and no tracked dependency files changed.

### Known Issues

- The feature folder is currently untracked in this Architect worktree, as expected for new feature memory.
- No blocking open questions from Analyst intake.
- Implementation Agent found no new known product issues or unresolved blockers.

### Implementation Agent Feedback

- None yet.

### Verification Evidence

- Architect created only:
  - `specs/028-sources-navigation-polish/spec.md`
  - `specs/028-sources-navigation-polish/plan.md`
  - `specs/028-sources-navigation-polish/tasks.md`
- Architect did not edit code, tests, runtime content, durable docs, staging, commits, pushes, PRs, or files outside assigned Architect artifacts.
- Pre-fix focused geometry reproduction at `2026-05-26T23:55:57-03:00`: `pnpm exec playwright test tests/e2e/app.spec.ts -g "primary source fragment navigation"` failed 4/4 as expected before the CSS fix, reporting visible TOC labels/subtitles clipped by the button box on desktop and mobile projects.
- Post-fix focused geometry check: `pnpm exec playwright test tests/e2e/app.spec.ts -g "primary source fragment navigation"` passed 4/4.
- Focused primary-source e2e: `pnpm exec playwright test tests/e2e/app.spec.ts -g "primary source"` passed 12/12 across chromium and mobile projects.
- Unit/content/tooling tests: `pnpm run test` passed 285/285.
- Build: `pnpm run build` passed after dependency installation; content validation passed, Vite built production assets, and service worker generation completed with 1728 cached assets.
- Feature memory check: `node scripts/check-feature-memory.mjs --worktree` passed.
- Whitespace check: `git diff --check` passed.
- Full preflight at `2026-05-26T23:58:14-03:00`: `pnpm run preflight` passed. Included feature-memory gate, repository baseline check, `validate:content`, `pnpm run test` (285/285), production build/service-worker generation, and full Playwright e2e via `pnpm run test:e2e` (60/60).
- Screenshot evidence was not separately captured because the desktop and mobile Playwright geometry assertions directly cover row overlap, child text clipping, focus stability, fragment selection, and mobile horizontal overflow.
