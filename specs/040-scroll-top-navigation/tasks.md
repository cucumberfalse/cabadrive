# Tasks: Scroll To Top On Page Navigation

## Status Legend

- `[x]` Complete
- `[ ]` Pending

## Architect Planning Tasks

- [x] T001 Confirm Architect assignment for worktree
  `/Users/chap/devel/cabadrive-worktrees/040-scroll-top-navigation` on branch
  `codex/040-scroll-top-navigation`.
- [x] T002 Record verified base supplied by Orchestrator:
  `origin/main` at `a714064dc205395ff734d86358e5010cd256e574`.
- [x] T003 Preserve role boundary: Architect edits only
  `specs/040-scroll-top-navigation/spec.md`,
  `specs/040-scroll-top-navigation/plan.md`, and
  `specs/040-scroll-top-navigation/tasks.md`.
- [x] T004 Read required repository memory:
  `.specify/memory/constitution.md`, `docs_project/README.md`,
  `docs_project/project-idea.md`,
  `docs_project/project/frontend/frontend-docs.md`,
  `docs_project/project/backend/backend-docs.md`,
  `docs_project/project/feature-inventory.md`,
  `docs_project/screens/learning-and-exam-flows.md`, and
  `docs/specify/README.md`.
- [x] T005 Read active intake:
  `specs/040-scroll-top-navigation/feature-request.md`.
- [x] T006 Inspect relevant source files read-only:
  `src/App.tsx`, `tests/e2e/app.spec.ts`, and
  `tests/e2e/manual-ticket-placement.spec.ts`.
- [x] T007 Identify likely implementation location as centralized SPA
  navigation state in `src/App.tsx`.
- [x] T008 Decide hash/deep-link behavior: normal route/page changes and
  app-owned manual hashes scroll top; real explicit element anchors may scroll
  to their target but must not preserve unrelated prior offset.
- [x] T009 Create Architect-owned `spec.md`, `plan.md`, and this `tasks.md`.

## Implementation Setup

- [x] T010 Orchestrator assigns Implementation Agent to this worktree/branch or
  another fresh latest-main isolated implementation slice, with explicit
  sibling-work preservation warning.
- [x] T011 Implementation Agent confirms branch, PR slice, scoped files,
  feature memory, current `git status --short --branch`, and parallel-work
  preservation warning before editing.
- [x] T012 Implementation Agent reads `feature-request.md`, `spec.md`,
  `plan.md`, and this `tasks.md` before editing.
- [x] T013 Implementation Agent keeps this file current with changed files,
  exact command results, decisions, dead ends, known issues, and feedback.

## Implementation Tasks

- [x] T014 Inspect the current rendered scroll owner for the reported manual
  scenario on desktop and mobile. Record whether `window` is sufficient or a
  route-level nested container must also be reset.
- [x] T015 Add a centralized route scroll reset in `src/App.tsx`, keyed to
  route/page identity rather than every render.
- [x] T016 Ensure the route key changes for top-level `view` changes,
  Introduction route changes, and implemented manual section changes.
- [x] T017 Ensure the route key does not change for same-page interactions such
  as answer selection, learning next/previous, search input, source mode
  changes, or disclosure open/close.
- [x] T018 Use instant deterministic scroll behavior, not smooth scrolling.
- [x] T019 Cover `hashchange` and `popstate` paths through the same central
  route-key behavior.
- [x] T020 If needed, set `history.scrollRestoration = "manual"` while the app
  is mounted and restore the prior value on cleanup.
- [x] T021 Preserve app-owned hash values and existing route selection behavior.
- [x] T022 Do not edit content, route labels, manual data, source data, assets,
  progress storage, or local-first/offline contracts.

## Test Tasks

- [x] T023 Add focused Playwright coverage for a desktop top-level route change
  from a scrolled source page to a new page at top.
- [x] T024 Add focused Playwright coverage for the reported desktop manual
  route scenario: from a scrolled `Руководство` route/list/content position to
  another implemented manual route at top.
- [x] T025 Add focused Playwright coverage for a mobile route reset.
- [x] T026 Add focused coverage for app-owned hash route changes, including a
  `#manual-section-*` route.
- [x] T027 Add a negative regression proving a same-page interaction does not
  reset scroll unexpectedly.
- [x] T028 If an existing real element anchor target is found, add or record
  evidence that explicit anchor targeting remains intact.

## Verification Tasks

- [x] T029 Run `git diff --check`.
- [x] T030 Run `pnpm run build` before Playwright if the focused Playwright
  command serves `dist` via preview.
- [x] T031 Run focused Playwright command(s) covering the new scroll behavior
  and record exact results.
- [x] T032 Run any broader Orchestrator-required checks, such as
  `pnpm run preflight`, or record the exact blocker/fallback.
- [x] T033 Record acceptance evidence in this file with route pairs, viewport
  coverage, scroll assertions, and command output summaries.

## Review / Final Validation Tasks

- [ ] T034 Review Agent verifies centralized route-key behavior, manual route
  coverage, hash/popstate coverage, same-page negative coverage, and absence
  of unrelated content/runtime changes.
- [ ] T035 Orchestrator resolves or dispositions review findings and required
  checks.
- [ ] T036 Orchestrator invokes final Architect validation only after
  implementation, review, checks, and process memory appear current.
- [ ] T037 Orchestrator invokes final Analyst validation only after final
  Architect validation passes.

## Current Decisions

- Use route/page identity as the scroll-reset boundary.
- Treat current app-owned hashes as route selectors, not mid-page anchors.
- Allow future/current real element anchors to scroll to their target if such a
  contract exists, while still preventing stale prior-route offset.
- Do not add custom historical per-route scroll restoration for this request.
- Keep the likely implementation in `src/App.tsx` unless source inspection
  during implementation proves a route-owned scroll container needs a narrow
  supporting change.
- Implementation Agent confirmed the visible vertical page/content scroll owner
  is `window`. `.manual-guide-nav` is an internal scrollable navigation pane
  (`overflow-y: auto`), while `.manual-guide-content` is normal document flow
  (`overflow-y: visible`) with `scrollTop` 0 in the rendered manual route
  probe. The central reset therefore targets `window` only and leaves internal
  navigation/table/image scrollers alone.
- The route scroll key is derived from `view` plus the active manual route
  identity when `view === "pandemia"` (`selectedManualSectionId` or
  `selectedIntroductionId`). It intentionally excludes same-page UI state.
- `history.scrollRestoration` is set to `manual` while the app is mounted and
  restored on cleanup so browser history restoration does not fight the app's
  route-entry behavior.
- Existing real element anchors: no current non-app-owned route anchor contract
  was found in the scoped inspection. The implementation still checks a
  non-app-owned hash for a matching DOM id after render and scrolls that
  element into view instead of carrying stale offset.

## Dead Ends

- Initial `pnpm run build` failed before dependency installation because this
  fresh worktree had no `node_modules`; content validation could not load
  `pdf-parse/lib/pdf-parse.js`. Ran `pnpm install`, which changed no package
  metadata, then reran `pnpm run build` successfully.
- First focused Playwright run found a strict-locator issue in the new desktop
  top-level test because the source reader also has a source-list button whose
  accessible name contains `Материалы`. Scoped the route click to `.tabs`; the
  focused Playwright command then passed.

## Known Issues

- None accepted during implementation.

## Implementation Notes

- Changed `src/App.tsx` to add a centralized requestAnimationFrame route-scroll
  effect after route render, with instant `window.scrollTo({ top: 0, left: 0,
  behavior: "auto" })` for app-owned routes.
- Changed `src/App.tsx` to preserve future/current real element anchors by
  trying `document.getElementById()` for non-app-owned hashes after render.
- Changed `tests/e2e/app.spec.ts` to add focused route-scroll coverage that
  dispatches DOM clicks from an already scrolled page, avoiding Playwright's
  automatic pre-click scroll masking the stale-offset regression.
- Test route pairs added:
  - Desktop top-level: `Источники` scrolled to `Материалы`, expect
    `window.scrollY <= 1`.
  - Desktop manual: `#manual-section-ch3-speed` scrolled to
    `#manual-section-ch3-stopping-parking`, expect `window.scrollY <= 1`.
  - Mobile top-level: `Материалы` scrolled to `Источники`, expect
    `window.scrollY <= 1`.
  - App-owned hash/popstate: `#manual-section-ch3-speed` scrolled to
    `#manual-section-ch1-bicycle`, then browser Back from a scrolled bicycle
    route to `#manual-section-ch3-speed`, expect `window.scrollY <= 1` after
    each route change.
  - Negative same-page: opening `manual-ticket-disclosure` on the same manual
    route keeps `window.scrollY > 100`.

## Verification Evidence

- `git diff --check`:
  - Result: passed with no output.
- `pnpm run build`:
  - First run result: failed because `node_modules` was missing and
    `scripts/content-manual-vehiculo-4ruedas.mjs` could not load
    `pdf-parse/lib/pdf-parse.js`.
  - Recovery: `pnpm install` completed from the existing lockfile and changed
    no package metadata.
  - Rerun result: passed.
  - Build evidence included `validate:content` passing with 460 fallback
    questions and 276 local image references, manual 4 ruedas validation
    passing for 200/200 pages, manual sign inventory passing for 316 entries,
    manual ticket placement passing for 460 questions / 460 placements, Vite
    production build passing, and service worker generation with 2156 cached
    assets.
- Focused Playwright command:
  - Command: `pnpm exec playwright test tests/e2e/app.spec.ts --grep "route navigation resets stale window scroll|manual route navigation resets stale window scroll|mobile route navigation resets stale window scroll|app-owned manual hash navigation resets stale window scroll|same-page manual disclosure"`
  - First run result: 8 passed, 2 failed due strict locator in the new test
    selecting both the top-level `Материалы` tab and a source-list document
    button.
  - Rerun result after locator fix: 10 passed across `chromium` and `mobile`.
- Broader check:
  - Command: `pnpm run test`
  - Result: passed, 469 tests, 0 failures.
- Scroll owner evidence:
  - Focused manual e2e probe on `#manual-section-ch3-speed` confirmed
    `window.scrollY` starts at 0; `.manual-guide-content` has
    `overflow-y: visible` and `scrollTop` 0; `.manual-guide-nav` has
    `overflow-y: auto` and is scrollable. The route-level vertical owner is
    `window`; the scrollable nav is an internal navigation pane.

## Implementation Agent Feedback For Architect Disposition

- None.

## Final Validation

Final Architect validation has not been performed. This planning assignment
only creates the implementation-ready feature memory.
