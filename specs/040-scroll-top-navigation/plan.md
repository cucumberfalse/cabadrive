# Plan: Scroll To Top On Page Navigation

## Summary

Implement this as one narrow frontend bug-fix PR slice. The current SPA keeps
navigation state in `src/App.tsx`, so the likely fix is a small route-scroll
manager inside `App` rather than a router migration or per-button patching.

The feature should preserve current content, data, local-first behavior,
offline build behavior, and existing app-owned hashes.

## Existing Rails To Reuse

- `src/App.tsx` already centralizes top-level view selection in `selectView`.
- The manual guide route state is also centralized in `App` through
  `selectedIntroductionId`, `selectedManualSectionId`,
  `selectIntroductionEntry`, `selectManualSection`, and `syncHashView`.
- `tests/e2e/app.spec.ts` already exercises primary navigation, manual guide
  routes, mobile layouts, and source/material flows.
- `tests/e2e/manual-ticket-placement.spec.ts` has compact manual-route
  fixtures if Implementation prefers a smaller manual-focused file.

## Technical Approach

1. Add a centralized route scroll effect in `App`.
   - Build a stable route key from route identity:
     `view`, `selectedIntroductionId`, and
     `selectedManualSection?.id` or `selectedManualSectionId`.
   - The key should change for primary page changes and manual route changes.
   - The key should not change for same-page interactions such as answers,
     search text, source mode toggles, disclosure state, or ticket
     next/previous controls.

2. Scroll after route render.
   - Use `useEffect` or `useLayoutEffect` with the route key.
   - Use `requestAnimationFrame` if needed so the new route's DOM exists before
     scrolling.
   - Use instant scroll behavior:
     `window.scrollTo({ top: 0, left: 0, behavior: "auto" })`.

3. Handle browser restoration and hash paths.
   - If native browser restoration interferes with the route-key effect, set
     `window.history.scrollRestoration = "manual"` while mounted and restore
     the previous value on cleanup.
   - Ensure `hashchange` and `popstate` paths update the same route identity,
     so the central effect covers them.
   - Treat existing app-owned route hashes as route selectors that open at top.
   - If a non-app-owned hash targets a real DOM element, scroll to the target
     after render rather than carrying over stale offset.

4. Inspect scroll ownership before finalizing.
   - Confirm whether the window/document is the only scroll owner for the
     reported manual scenario.
   - If a route-level nested container owns visible scroll on desktop or
     mobile, reset that route container too. Keep internal controls and
     intentionally scrollable figures/lists untouched.

## Suggested Test Shape

Add focused Playwright coverage, preferably near existing navigation tests in
`tests/e2e/app.spec.ts` unless the implementation benefits from a smaller new
file.

Recommended helpers:

- Navigate to a long page or manual route.
- Scroll with `page.evaluate(() => window.scrollTo(0, 900))` or to the bottom
  of a known long element.
- Assert `window.scrollY > 0`.
- Trigger a route change through the real UI or a hash/popstate path.
- Wait for the destination heading/test id.
- Assert `window.scrollY === 0` or `window.scrollY` is within a tiny tolerance.

Required browser cases:

- Desktop top-level route change, for example from a scrolled `Материалы` or
  `Руководство` page to `Источники`, `Учить`, or another primary section.
- Desktop manual route change from one implemented manual section to another,
  using the real `Руководство` navigation buttons when practical.
- Mobile route change, using an existing mobile project or explicit viewport.
- Hash route change, for example starting scrolled on one manual section and
  changing `window.location.hash` to a different `#manual-section-*` route.
- Same-page negative case, such as opening a manual ticket disclosure or moving
  between learning tickets, proving the new effect does not reset scroll when
  the page identity did not change.

If the existing Playwright setup serves `dist` through `vite preview`, run
`pnpm run build` before focused Playwright after source changes.

## File Scope For Implementation Agent

Expected implementation files:

- `src/App.tsx`
- `tests/e2e/app.spec.ts` or `tests/e2e/manual-ticket-placement.spec.ts`
- `specs/040-scroll-top-navigation/tasks.md`

Optional only if evidence shows need:

- `src/styles.css`, only for a discovered route-owned nested scroll container
  that needs an explicit stable selector or container behavior. Avoid CSS churn
  if window scrolling is the actual issue.

Do not edit:

- content files under `content/**`
- source data under `src/data/**`
- durable docs under `docs_project/**`
- unrelated tests or package metadata
- sibling feature memory

If another file becomes necessary, Implementation Agent should record feedback
in `tasks.md` and ask Orchestrator for Architect disposition before widening
scope.

## Acceptance Evidence

Implementation Agent should record:

- Changed files and why.
- Whether the visible route scroll owner is `window` only or includes a named
  route container.
- Exact Playwright assertions and route pairs used.
- Exact command results for focused and required checks.
- Any known limitations or no-op decisions, especially around real element
  anchors if none currently exist.

## Review And Final Validation Path

After implementation, Orchestrator should route review. Review should focus on
behavioral regressions and process compliance rather than content concerns.

Final Architect validation should only happen after:

- Implementation tasks and evidence are current.
- Focused scroll tests pass.
- Review findings are resolved or dispositioned.
- Required checks requested by Orchestrator are green or a blocker is recorded.

Final Analyst validation must happen after Architect validation passes.
