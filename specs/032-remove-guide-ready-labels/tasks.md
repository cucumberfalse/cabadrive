# Tasks: Remove Ready Labels From Guide Navigation

## Status Legend

- `[ ]` Not started
- `[~]` In progress
- `[x]` Complete

## Architect Planning Setup

- [x] T001 Confirm assigned role is Architect only.
- [x] T002 Confirm assigned worktree `/Users/chap/devel/cabadrive-worktrees/032-remove-guide-ready-labels`, branch `codex/032-remove-guide-ready-labels`, and verified base `origin/main 51e42f657d867fb802bbe3a68591b6008b45a60f`.
- [x] T003 Confirm parallel-work preservation constraints, including no changes to sibling worktrees or `/Users/chap/devel/cabadrive/specs/032-manual-figures-full-width/`.
- [x] T004 Read `.specify/memory/constitution.md`.
- [x] T005 Read durable project memory sufficient for the scoped manual-navigation UI change: `docs_project/README.md`, `docs_project/project-idea.md`, `docs_project/project/frontend/frontend-docs.md`, `docs_project/project/backend/backend-docs.md`, `docs_project/project/feature-inventory.md`, `docs_project/screens/learning-and-exam-flows.md`, and `docs/specify/README.md`.
- [x] T006 Read Analyst intake at `specs/032-remove-guide-ready-labels/feature-request.md`.
- [x] T007 Inspect relevant source/test files read-only: `src/App.tsx`, `src/styles.css`, `src/data/manualGuide.ts`, `tests/content-manual-guide-chapters.test.mjs`, and `tests/e2e/app.spec.ts`.
- [x] T008 Create `spec.md`.
- [x] T009 Create `plan.md`.
- [x] T010 Create this `tasks.md`.

## Implementation Setup

- [x] T011 Confirm Implementation Agent starts from complete feature memory: `feature-request.md`, `spec.md`, `plan.md`, and `tasks.md`.
- [x] T012 Confirm assigned implementation worktree, branch, PR slice, and latest verified base or Orchestrator-approved handoff context.
- [x] T013 Run `git status --short --branch` before editing and record any pre-existing dirty/untracked state.
- [x] T014 Read active feature memory and relevant source/tests before editing.
- [x] T015 Confirm parallel-work preservation: no sibling worktrees, branches, PRs, commits, dirty diffs, or process memory will be overwritten, reset, rebased, deleted, or otherwise mutated.

## UI Implementation Tasks

- [x] T016 Update `src/App.tsx` `renderManualSectionButton(section)` so implemented/available manual sections do not render visible `готово`.
- [x] T017 Remove `готово` from implemented manual section accessible names; available rows should use the section title as their accessible name unless implementation records a better accessible pattern.
- [x] T018 Preserve pending/unavailable labels and `aria-label` pending context for unavailable sections if such sections are still represented.
- [x] T019 Preserve `disabled`, `aria-disabled`, `aria-current`, `onClick`, route-hash, and deep-link behavior.
- [x] T020 Preserve existing data attributes: `data-status`, `data-route-hash`, `data-source-pages`, `data-content-module-path`, `data-source-region-metadata-status`, and `data-visual-evidence-status`.
- [x] T021 Preserve existing `data-testid` values unless a test-only rename is explicitly justified in process memory.
- [x] T022 Avoid changing manual content modules, `src/data/manualGuide.ts`, source archive content, generated assets, validators, runtime/Docker contracts, or unrelated app surfaces.
- [x] T023 Inspect desktop and mobile manual navigation after removing the label; add only scoped `.manual-guide-*` CSS if spacing/readability regresses.

## Test And Verification Tasks

- [x] T024 Update `tests/content-manual-guide-chapters.test.mjs` to remove assertions for `const sectionStatusLabel = isAvailable ? "готово" : "ожидает PR"` and unconditional `<small>{sectionStatusLabel}</small>`.
- [x] T025 Add static/source assertions that the old implemented `готово` label path is not present while disabled-state and metadata attributes remain protected.
- [x] T026 Update `tests/e2e/app.spec.ts` manual-guide coverage to assert `manual-guide-nav` has no visible `готово`.
- [x] T027 Add or update e2e coverage for Appendix III cargo navigation: `appendix-3-cargo`, `app3-cargo-driver-profile`, `app3-social-responsibility`, `app3-driving-factors`, `app3-safe-driving`, `app3-safety-elements`, and `app3-highways`.
- [x] T028 Verify Appendix III child buttons are visible, enabled, have `data-status="implemented"`, and contain no `готово`.
- [x] T029 Verify selecting at least one Appendix III child updates the URL hash, active row, `data-active-group-id`, `data-active-child-id`, and rendered manual section.
- [x] T030 Preserve or run existing Introduction route deep-link coverage.
- [x] T031 Preserve or run existing Chapter 4 `Стресс` and `Отвлечения` deep-link coverage.
- [x] T032 Preserve or run existing local-only checks for no runtime network, PDF viewer, backend/live-AI, or remote asset dependency.
- [x] T033 Verify representative unrelated source/status labels remain covered by existing tests or record explicit evidence if touched.
- [x] T034 Run focused static tests for manual-guide source expectations and record output.
- [x] T035 Run focused Playwright manual-guide coverage, for example `pnpm exec playwright test tests/e2e/app.spec.ts -g "Manual guide|Руководство"`, and record output.
- [x] T036 Run `pnpm run test` and record output.
- [x] T037 Run `pnpm run build` and record output.
- [x] T038 Run `node scripts/check-feature-memory.mjs --worktree` and record output.
- [x] T039 Run `git diff --check` and record output.
- [x] T040 Run `pnpm run preflight` before PR readiness unless Orchestrator explicitly narrows validation, and record output.
- [x] T041 Capture screenshot evidence if useful for review or if DOM assertions do not adequately demonstrate the visual removal.

## Documentation Tasks

- [x] T042 Leave durable project docs unchanged if the implementation is a pure manual-navigation UI cleanup with no behavior, architecture, runtime, content, or workflow contract change.
- [x] T043 If implementation changes durable behavior or contracts, stop for Orchestrator/Architect disposition before updating docs.

## Review Requirements

- [x] T044 Review Agent verifies complete feature memory and role-boundary compliance.
- [x] T045 Review Agent verifies the diff is narrow and justified by the `Руководство` ready-label request.
- [x] T046 Review Agent verifies no unrelated status/source labels, official/unofficial disclosures, manual content, archive metadata, validators, backend/runtime, PDF, or service-worker behavior changed unexpectedly.
- [x] T047 Review Agent verifies implemented manual section data attributes and deep-link behavior remain intact.
- [x] T048 Review Agent verifies Appendix III evidence, active-state evidence, no visible/accessibility-exposed `готово`, and Implementation Agent verification evidence.
- [x] T049 Review Agent verifies Implementation Agent feedback has Architect disposition before final validation.

## Acceptance Checklist

- [x] A001 `Руководство` navigation shows no visible `готово` next to implemented manual section rows.
- [x] A002 Appendix III cargo rows from the screenshot show no visible `готово`.
- [x] A003 Implemented manual section accessible names do not include `готово`.
- [x] A004 Manual section titles remain visible/readable and active rows remain visually identifiable.
- [x] A005 Manual section route hashes, click navigation, direct deep links, and `aria-current` behavior remain intact.
- [x] A006 Implemented manual section diagnostic data attributes remain intact.
- [x] A007 Pending/unavailable entries, if present, remain disabled and distinguishable.
- [x] A008 Unrelated status/source labels remain visible where required.
- [x] A009 No runtime network, PDF viewer, backend, live-AI, remote-asset, manual-content, source-archive, generated-asset, validator, or Docker contract change is introduced.
- [x] A010 Required local verification evidence is recorded in this feature memory.

## Process Memory

### Decisions

- Architect scoped the feature to removing learner-facing implemented-section `готово` labels from `Руководство` navigation only.
- Architect expects a small `src/App.tsx` change and focused updates to `tests/content-manual-guide-chapters.test.mjs` and `tests/e2e/app.spec.ts`.
- Existing `data-testid` values with `pending` in their names should be preserved to avoid unrelated churn.
- `data-status` and source/evidence metadata remain part of diagnostics and must not be removed.
- Pending labels such as `ожидает`, `позже`, or `ожидает PR` are not the user's reported problem and should remain available for unavailable entries unless implementation records a narrow reason.
- Durable docs are not expected to change for this pure UI-label cleanup.
- Implementation kept `data-testid="manual-guide-pending-section-${section.id}"` unchanged and changed only the implemented-section status text path: available rows use `aria-label={section.labelRu}` and unavailable rows keep `ожидает PR`.
- Implementation left `.manual-guide-*` CSS unchanged because pending `<small>` styles still apply and available rows render cleanly without a status element.

### Context Evidence

- Implementation Agent startup `pwd` returned `/Users/chap/devel/cabadrive-worktrees/032-remove-guide-ready-labels`.
- Implementation Agent startup `git status --short --branch` returned `## codex/032-remove-guide-ready-labels...origin/main` with untracked `specs/032-remove-guide-ready-labels/`, matching the assigned handoff feature memory.
- Architect startup `git status --short --branch` reported `## codex/032-remove-guide-ready-labels...origin/main` with untracked `specs/032-remove-guide-ready-labels/`, expected from feature-memory creation.
- Architect confirmed assigned worktree HEAD is `51e42f657d867fb802bbe3a68591b6008b45a60f`.
- Architect confirmed `specs/032-remove-guide-ready-labels/feature-request.md` exists in the assigned worktree.
- Analyst intake records the original user request and screenshot: visible `готово` labels appear beside Appendix III cargo navigation rows in `Руководство`.
- `src/App.tsx` currently renders `const sectionStatusLabel = isAvailable ? "готово" : "ожидает PR"` inside `renderManualSectionButton(section)`.
- `src/App.tsx` currently renders that label visibly in `<small>{sectionStatusLabel}</small>` and in the section button `aria-label`.
- `tests/content-manual-guide-chapters.test.mjs` currently asserts the old `готово` implementation string, so tests must be updated with the behavior change.
- `tests/e2e/app.spec.ts` already covers manual-guide hierarchy, implemented section data attributes, active state, route hashes, direct deep links, and local-only constraints.

### Dead Ends

- Architect planning: none.
- Implementation: none.
- First `pnpm run build` attempt failed because this fresh worktree had no `node_modules`, causing `pdf-parse` to be unavailable to `scripts/content-manual-vehiculo-4ruedas.mjs`; `pnpm install --frozen-lockfile` restored dependencies without lockfile changes, and the repeated build passed.

### Known Issues

- No known issues.

### Implementation Agent Feedback

- None.

### Verification Evidence

- Architect created only:
  - `specs/032-remove-guide-ready-labels/spec.md`
  - `specs/032-remove-guide-ready-labels/plan.md`
  - `specs/032-remove-guide-ready-labels/tasks.md`
- Architect did not edit source code, tests, runtime content, durable project docs outside assigned feature memory, staging, commits, pushes, PRs, or reviews.
- Implementation Agent ran `pnpm install --frozen-lockfile` after the first build revealed missing `node_modules`; command passed and did not change the lockfile.
- `pnpm exec node --test tests/content-manual-guide-chapters.test.mjs`: passed, 91/91 tests.
- `pnpm run build`: passed after dependency install. Evidence included content validation pass for 460 category B fallback questions and 276 local image references, manual guide source-fidelity `status: "pass"` with 50 implemented sections and 0 pending sections, Vite production build success, and service worker generated with 1844 cached assets. Vite emitted the existing large chunk warning.
- `pnpm exec playwright test tests/e2e/app.spec.ts -g "Manual guide|Руководство"`: passed, 6/6 tests across `chromium` and `mobile`; coverage included the updated Appendix III manual-guide navigation test, Chapter 4 direct routes, and phone-width manual label readability.
- `pnpm run test`: passed, 401/401 tests.
- `node scripts/check-feature-memory.mjs --worktree`: passed via `specs/032-remove-guide-ready-labels/{spec,plan,tasks}.md`.
- `git diff --check`: passed with no output.
- `pnpm run preflight`: passed. The command completed `check-feature-memory`, `check:repo`, `validate:content`, `pnpm run test` with 401/401 tests, repeated `pnpm run build`, and `pnpm run test:e2e` with 78/78 browser tests across `chromium` and `mobile`.
- Review Agent evidence: PR #196 review `PRR_kwDOSX65IM8AAAABCDucOQ` / review id `4433091641` recorded `Codex Review: No blocking findings for b671cae9699c0bacfd2cd0961e630e663de20252`, covering scoped ready-label removal, feature memory, pending labels, route/deep-link state, active state, diagnostic metadata, and recorded verification evidence.

## Cycle PR Set

- PR #196: https://github.com/cucumberfalse/cabadrive/pull/196
- Branch: `codex/032-remove-guide-ready-labels`
- Purpose: remove learner-visible `готово` labels from `Руководство` manual navigation while preserving route/deep-link behavior, active state, pending labels, and status/source diagnostics.
- Base SHA: `51e42f657d867fb802bbe3a68591b6008b45a60f`
- Prior validated product/content head: `b671cae9699c0bacfd2cd0961e630e663de20252`
- Historical Architect evidence-disposition head: `a777cfb3752105188f6f690870b17d3875926ec2`
- Process-memory correction assignment observed PR head before this fix commit: `bdec6d223c4aeb3b61109d5e9fe12d85464ba0b8`
- Status at historical Architect validation: open, ready for review/merge coordination, mergeable, not draft.
- Included in final validation: yes; this is the only PR slice in the work cycle.

## Final Validation Evidence

- Historical effective content head before process-memory correction: `b671cae9699c0bacfd2cd0961e630e663de20252`
- Architect return count: 0
- Analyst return count known to Architect before final Analyst validation: 0 from `feature-request.md`.
- Limit escalation: none.
- Implementation Agent feedback: none; no Architect disposition required.
- Known issues: none.
- Historical current-head guard disposition: at the prior evidence-disposition point, PR head `a777cfb3752105188f6f690870b17d3875926ec2` was later than validated product/content head `b671cae9699c0bacfd2cd0961e630e663de20252`; that historical note is superseded by this process-memory correction and is not a live finalization guard for the current PR head.
- Finalization guard requirement: after this process-memory correction is committed and becomes the new effective content head, Orchestrator must rerun final Architect validation, then final Analyst validation, then run a fresh read-only current-PR-head guard immediately before finalization/merge; any later commit after the rerun must be checked from live PR/local state instead of relying on historical static evidence.
- Check re-verification note: required check re-verification on the future rerun/current PR head remains an Orchestrator merge-readiness gate after this process-memory correction; this note does not claim checks are green on `bdec6d223c4aeb3b61109d5e9fe12d85464ba0b8` or on any later head.
- Historical required-check evidence: read-only PR inspection during the prior final-validation pass showed `.unicorn-hub/config.json` required checks `baseline-checks`, `docker-validation`, `guard`, `AI Review`, and `osv-scan` completed with `SUCCESS` on `b671cae9699c0bacfd2cd0961e630e663de20252`; this is preserved as historical verification evidence, not current merge-readiness evidence.
- Historical PR state evidence: read-only `gh pr view 196` during the prior final-validation pass showed PR #196 open, not draft, mergeable, base `main` at `51e42f657d867fb802bbe3a68591b6008b45a60f`, and head `b671cae9699c0bacfd2cd0961e630e663de20252`; this is preserved as historical evidence only.
- Local diff evidence: the cycle diff changes only `src/App.tsx`, `tests/content-manual-guide-chapters.test.mjs`, `tests/e2e/app.spec.ts`, and feature memory under `specs/032-remove-guide-ready-labels/`.
- Product scope evidence: `src/App.tsx` now renders implemented manual section buttons with the section title as the accessible name and renders `ожидает PR` only for unavailable sections; `data-status`, route hash, source page, source-region metadata, and visual-evidence attributes remain.
- Test evidence: static tests reject the old implemented `готово` render path, e2e coverage asserts no visible/accessibility-exposed `готово`, includes Appendix III cargo rows, and verifies Appendix III deep links, active state, and content rendering.
- Verification command evidence: Implementation Agent recorded passing focused static manual-guide tests, focused Playwright manual-guide tests, `pnpm run test`, `pnpm run build`, `node scripts/check-feature-memory.mjs --worktree`, `git diff --check`, and full `pnpm run preflight`.
- Final Architect validation command evidence: Architect read-only `node scripts/check-feature-memory.mjs --worktree` passed before this final-validation evidence update, and `git diff --check 51e42f657d867fb802bbe3a68591b6008b45a60f..b671cae9699c0bacfd2cd0961e630e663de20252` passed with no output.
- Role-boundary evidence: Analyst intake, Architect planning, Implementation Agent product/test changes, Review Agent no-finding review, and Orchestrator assignment were all present. The earlier Architect accidental wrong-worktree artifacts were explicitly recovered under Orchestrator authorization by copying only the three Architect-owned files into the assigned worktree and removing only those accidental wrong-location files plus the empty accidental directory.
- Sibling preservation evidence: no sibling worktree, branch, dirty diff, PR, or process memory was edited by Architect final validation; `/Users/chap/devel/cabadrive/specs/032-manual-figures-full-width/` was not touched.

## Final Architect Validation Notes

- Architect validation pass: passed
- Final Architect validation completed at: 2026-06-05T00:24:56-03:00
- Historical effective content head before process-memory correction: `b671cae9699c0bacfd2cd0961e630e663de20252`
- Architect validated effective content head: b671cae9699c0bacfd2cd0961e630e663de20252
- Architect return count: 0
- Architect validation evidence: this 2026-06-05T00:24:56-03:00 validation pass is historical and superseded for finalization by the follow-up process-memory correction assignment at observed PR head `bdec6d223c4aeb3b61109d5e9fe12d85464ba0b8`; Orchestrator must rerun final Architect validation and then final Analyst validation after the process-memory correction commit creates the new effective content head.
- Architect validation basis: single cycle PR #196 at prior head `b671cae9699c0bacfd2cd0961e630e663de20252`; complete feature memory; implementation diff; recorded verification evidence; Review Agent no-blocking review; read-only PR/check inspection; and current local clean status before final-validation evidence editing.
- Architect customer-intent conclusion: passed. The implementation removes the visible and accessibility-exposed `готово` labels from the `Руководство` navigation, including the Appendix III cargo rows shown in the screenshot, while preserving navigation, active state, route/deep-link behavior, pending affordance, diagnostic status data, and unrelated source/status labels.
- Architect task/disposition conclusion: all Architect-assigned implementation, verification, documentation, review, acceptance, and process-memory tasks are complete; Implementation Agent feedback is none, known issues are none, and no Architect disposition remains open.
- Architect gaps: none.

## Process-Memory Correction Before Final Validation Rerun

- Correction reason: finalize gate dry-run after the prior validation found stale current-head guard evidence and parser-unsafe known-issue wording, and local post-effective diff validation showed the current post-effective diff was not append-only evidence because earlier validation notes replaced placeholder/checklist lines.
- Correction scope: this follow-up edits only Architect-owned `specs/032-remove-guide-ready-labels/tasks.md`; it does not change product code, tests, source content, runtime files, `feature-request.md`, `spec.md`, or `plan.md`.
- Prior validated product/content head: `b671cae9699c0bacfd2cd0961e630e663de20252`.
- Observed PR head before this correction commit: `bdec6d223c4aeb3b61109d5e9fe12d85464ba0b8`.
- Expected next step: once this correction is committed, that commit must become the new effective content head for finalization purposes; Orchestrator must rerun final Architect validation and then final Analyst validation against that new SHA.
- Parser-safety disposition: the `Known Issues` section now records `No known issues.`, historical current-head evidence is marked as superseded and non-live, Implementation Agent feedback remains `None.`, and no new parser-facing `Effective content head:` line is added because the next effective content head is not known until after commit.
