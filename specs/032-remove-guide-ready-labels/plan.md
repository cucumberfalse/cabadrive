# Implementation Plan: Remove Ready Labels From Guide Navigation

## Summary

Implement a narrow `Руководство` navigation cleanup: remove the visible and accessible `готово` status label from implemented manual section buttons while keeping all navigation, active-state, deep-link, disabled, and diagnostic metadata behavior intact. The expected product change is a small `src/App.tsx` adjustment plus focused updates to static and e2e tests that currently encode the old label.

## Architecture

### 1. Preserve Manual Navigation Data Flow

- Keep `manualGuideNavigation`, `manualGuideSectionIsAvailable`, `manualGuideActiveGroupId`, selected entry state, and selected manual section state unchanged unless a direct defect is found.
- Keep manual section content modules and `src/data/manualGuide.ts` unchanged.
- Keep all section route hashes and URL hash handling unchanged.
- Keep the existing local-only manual rendering path without adding runtime network, backend, PDF, or live-AI dependencies.

### 2. Remove Implemented-Section Ready Label

- In `src/App.tsx`, update `renderManualSectionButton(section)` so available/implemented sections render only the section title in the button body.
- Replace the current `sectionStatusLabel = isAvailable ? "готово" : "ожидает PR"` pattern with pending-only labeling if the code still needs a label for unavailable sections.
- Remove the visible `<small>готово</small>` equivalent for available sections.
- Remove `готово` from the accessible name for available sections, preferably using the section label alone.
- Preserve pending/unavailable treatment for future not-available sections: disabled state, `aria-disabled`, and a pending label or accessible pending reason may remain.

### 3. Preserve Diagnostics And Styling

- Preserve existing `data-testid` values even though several are named `manual-guide-pending-section-*`; renaming them would cause unnecessary test churn outside the user request.
- Preserve `data-status`, `data-route-hash`, `data-source-pages`, `data-content-module-path`, `data-source-region-metadata-status`, and `data-visual-evidence-status`.
- Leave `.manual-guide-children button small` CSS in place if pending labels still use it.
- If spacing looks awkward after removing implemented labels, make only scoped `.manual-guide-*` CSS adjustments needed for stable title alignment.

### 4. Update Tests To Protect The New Contract

- Update `tests/content-manual-guide-chapters.test.mjs` so it no longer asserts the old `готово` string or unconditional `<small>{sectionStatusLabel}</small>`.
- Add static assertions that guard against reintroducing the old implemented `готово` label path while preserving disabled behavior and metadata attributes.
- Update `tests/e2e/app.spec.ts` manual-guide coverage to assert the visible nav has no `готово`.
- Include the screenshot-relevant Appendix III group in browser coverage:
  - open/find `data-guide-entry-id="appendix-3-cargo"`;
  - verify its implemented child section buttons are visible/enabled;
  - verify those buttons do not contain `готово`;
  - select at least one Appendix III section and verify URL hash, active state, and rendered manual section content.

### 5. Process Memory

- Implementation Agent keeps `tasks.md` current as work proceeds.
- Record any dead end, any reason for touching CSS or tests beyond the expected files, verification output, known issues, and Implementation Agent feedback.
- Route any scope expansion or uncertainty to Orchestrator for Architect disposition.

## Recommended Implementation Steps

1. Confirm complete feature memory exists and startup worktree/branch/status match the Orchestrator assignment.
2. Inspect `renderManualSectionButton` in `src/App.tsx`.
3. Refactor the status label branch so available sections render no status `<small>` and no `готово` in `aria-label`; keep pending behavior available for unavailable sections.
4. Run/update focused static tests around manual-guide source expectations.
5. Run/update focused e2e around `Руководство`, including Appendix III and no visible `готово`.
6. Inspect desktop/mobile layout if CSS changed or if label removal creates spacing artifacts.
7. Run the required local verification commands and record evidence in `tasks.md`.

## Testing Plan

- Static/source tests:
  - `tests/content-manual-guide-chapters.test.mjs` rejects the old implemented `готово` render branch.
  - Existing manual metadata/data-attribute assertions remain protected.
- Playwright:
  - `Руководство` navigation opens and contains expected groups.
  - `manual-guide-nav` does not contain visible `готово`.
  - Appendix III cargo child buttons are visible, enabled, carry `data-status="implemented"`, and contain no `готово`.
  - Selecting an Appendix III child updates the hash and active row and renders the corresponding section.
  - Existing Introduction and Chapter 4 manual deep-link tests continue to pass.
  - Existing local-only checks for no PDF viewer/network/backend dependency continue to pass.
- Local commands:
  - focused test command for the changed static tests if available;
  - focused Playwright command for manual-guide coverage;
  - `pnpm run test`;
  - `pnpm run build`;
  - `node scripts/check-feature-memory.mjs --worktree`;
  - `git diff --check`;
  - `pnpm run preflight` before PR readiness unless narrowed by Orchestrator.

## Risks And Mitigations

- Risk: a broad status-label removal hides required trust/source labels. Mitigation: scope product edits to `IntroductionSectionsView` manual section button rendering and verify representative status/source surfaces remain covered.
- Risk: removing the label changes accessible names used by tests. Mitigation: update tests to use title-only names for implemented sections and explicit test IDs/data attributes for metadata.
- Risk: pending sections lose important availability signaling. Mitigation: keep pending-only label/ARIA logic for unavailable sections.
- Risk: active row or deep-link selection regresses. Mitigation: require e2e coverage for active state and direct hash routes.
- Risk: visual spacing becomes awkward on small screens. Mitigation: inspect or cover mobile layout; apply only scoped CSS if necessary.

## Architect Guidance To Implementation Agent

- Work only from the Orchestrator-assigned implementation worktree, branch, and PR slice.
- Confirm the assigned branch/PR slice, scoped files, and parallel-work preservation warning before editing.
- Do not overwrite, reset, rebase, delete, or mutate sibling worktrees, branches, dirty diffs, commits, PRs, or process memory.
- Do not touch `/Users/chap/devel/cabadrive/specs/032-manual-figures-full-width/` or sibling worktrees.
- Keep the change narrow: expected files are `src/App.tsx`, focused tests, and this feature's `tasks.md`.
- Do not change manual section content, source archives, validators, generated assets, runtime/Docker contracts, or unrelated status/source labels.
- Record verification evidence and any Implementation Agent feedback in `tasks.md`.

## Handoff Readiness

This plan is ready for Orchestrator to assign as a single narrow UI/test PR slice from the approved Analyst/Architect handoff context or another latest-main isolated worktree.
