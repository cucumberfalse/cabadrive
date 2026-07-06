# Spec: Scroll To Top On Page Navigation

## Role And Scope

- Current role: Architect, explicitly assigned by Orchestrator for feature
  `040-scroll-top-navigation`.
- Worktree: `/Users/chap/devel/cabadrive-worktrees/040-scroll-top-navigation`.
- Branch: `codex/040-scroll-top-navigation`.
- Verified base: `origin/main` at
  `a714064dc205395ff734d86358e5010cd256e574`.
- Intake artifact:
  `specs/040-scroll-top-navigation/feature-request.md`.
- Parallel agents/worktrees may exist. Preserve sibling worktrees, branches,
  commits, PRs, dirty diffs, and process memory.
- Architect owns only this feature's `spec.md`, `plan.md`, and `tasks.md`.
  Architect does not edit code, tests, runtime files, commits, PRs, reviews, or
  merges.

## Problem

Cabadrive is a React/Vite SPA with route-like state held in `src/App.tsx`.
When a learner is scrolled down on a long page and selects another app page or
manual route, the browser can keep the old vertical scroll position. The newly
selected destination then appears midway down the page instead of at its
heading and starting context.

The reported case is the `Руководство` manual navigation: a scrolled manual
list/content area keeps the previous offset when the learner switches pages.

## Goal

On app page or route changes, the newly selected Cabadrive page opens at the
top of the visible viewport rather than preserving the previous page's scroll
offset.

## User Outcome

A learner who switches from a scrolled page to another primary section or
manual topic lands at the beginning of the selected content and can see the
heading, status context, and first content block immediately.

## Scope

In scope:

- Top-level app navigation among primary sections such as `Учить`, `Экзамен`,
  `Ошибки`, `Словарь`, `Материалы`, `Руководство`, `Источники`, `Процесс`, and
  `CABA/RF`.
- Manual guide route changes inside `Руководство`, including Introduction
  route hashes and `#manual-section-*` hashes.
- Direct hash/popstate navigation that changes the active manual route.
- Desktop and mobile viewport behavior.
- Preserving local-first/offline runtime behavior.

Out of scope:

- Reworking manual navigation, content, route names, copy, data, assets, or
  visual design.
- Changing question/exam/material/source/process content.
- Adding a router library unless implementation evidence shows the current
  local state model cannot satisfy the request cleanly.
- Building custom per-route historical scroll restoration.
- Resetting scroll for non-route interactions such as selecting an answer,
  moving to the next question inside the same learning card, opening a
  disclosure, switching source-language modes, or using local search within the
  current page.

## Current Architecture Notes

`src/App.tsx` currently owns the route-like state:

- `view: View` chooses the primary app surface.
- `selectedIntroductionId` chooses current Introduction route content.
- `selectedManualSectionId` chooses current implemented manual section route.
- `selectView`, `selectIntroductionEntry`, and `selectManualSection` update
  state and push URLs with `window.history.pushState`.
- `hashchange` and `popstate` route app-owned hashes to the manual guide view.

Focused browser tests already live under `tests/e2e/`, with broad app coverage
in `tests/e2e/app.spec.ts` and manual appendix route coverage in
`tests/e2e/manual-ticket-placement.spec.ts`.

## Hash And Deep-Link Decision

Normal Cabadrive route/page changes must scroll to top. This includes
app-owned hash routes such as `#pandemia-vial`, `#intro-enfoque-etico`,
`#intro-accidente-incidente`, `#intro-plan-seguridad-vial`, and
`#manual-section-*`, because in the current app these hashes select route
content rather than serving as mid-page anchors.

Explicit anchor/deep-link behavior remains allowed only when a hash targets a
real in-page element under the current app contract. In that case the
implementation may scroll to the target element after rendering. It must not
preserve an unrelated prior scroll offset while waiting for the target.

Browser back/forward between app-owned routes should also land at the top of
the selected page unless the destination is an explicit real anchor target.

## Acceptance Criteria

1. From a scrolled primary section, selecting a different top-level app section
   renders the destination at the top of the viewport.
2. From a scrolled `Руководство` navigation/content position, selecting a
   different implemented manual route renders the new route at the top.
3. Hash/popstate navigation to an app-owned manual route does not retain the
   previous route's vertical offset.
4. The behavior is verified on representative desktop and mobile viewports.
5. Same-page interactions that do not change the app route do not trigger an
   unrelated scroll-to-top side effect.
6. Existing explicit deep links remain understandable: app-owned route hashes
   open the route at top; any real element anchor target may scroll to that
   target.
7. Existing learning, exam, manual, source-reader, materials, local asset, and
   offline behavior remains unchanged except for the intended scroll reset.

## Negative Scenarios

- A learner scrolls halfway down `Руководство`, clicks another manual topic,
  and lands halfway down the new topic.
- A learner scrolls down `Материалы`, clicks `Источники`, and the source reader
  opens at the same old offset.
- A direct change to an app-owned manual hash preserves the previous offset
  because only button handlers were updated.
- The implementation scrolls to top on every render, answer selection,
  disclosure open, search keystroke, language-mode change, or ticket
  next/previous action.
- A future real element anchor is forcibly overridden to absolute top instead
  of its target.

## Implementation Requirements

- Implement centrally in `src/App.tsx` around the existing route state rather
  than scattering `window.scrollTo` calls across every nav button.
- Derive a route scroll key from the state that actually represents page
  identity, such as `view`, `selectedIntroductionId`, and
  `selectedManualSectionId`.
- Run the scroll after the destination route has rendered, using a React effect
  or similarly reliable mechanism. Avoid timing that reads stale DOM.
- Prefer `window.scrollTo({ top: 0, left: 0, behavior: "auto" })` for route
  changes. Do not introduce smooth scrolling because the requested behavior is
  deterministic page entry, and smooth animation can make tests flaky.
- Consider setting `window.history.scrollRestoration = "manual"` while the app
  is mounted if browser restoration fights the route reset; restore the prior
  value on cleanup when practical.
- Inspect whether any visible scroll is owned by a nested app/manual container.
  If the window is the only active scroll container, document that in
  `tasks.md`. If a route-owning nested container is present, reset that
  container as well without touching unrelated internal scrollers.
- Keep the route reset local-first and dependency-free.
- Do not change content, assets, data schemas, route labels, or existing hash
  values.

## Verification Requirements

Implementation Agent must record evidence in `tasks.md` for:

- `git diff --check`.
- Focused Playwright coverage for top-level route scroll reset on desktop.
- Focused Playwright coverage for the reported manual route scenario on
  desktop.
- Focused Playwright coverage for at least one route reset on mobile.
- A regression proving same-page interaction does not scroll to top
  unexpectedly.
- Hash/deep-link behavior evidence for an app-owned manual route and, if an
  existing real element anchor target is found, that anchor behavior.
- Relevant broader repository checks. At minimum run the focused e2e test file
  after `pnpm run build` if the Playwright setup serves `dist` via preview.

Recommended focused commands:

```bash
git diff --check
pnpm run build
pnpm exec playwright test tests/e2e/app.spec.ts
```

If implementation adds a smaller focused test file or uses a supported path
filter, record the exact command and result. Orchestrator may require
`pnpm run preflight` and GitHub required checks before completion.

## Review Requirements

Review Agent should verify:

- Scroll reset is centralized and keyed to route/page identity, not scattered
  across individual buttons.
- App-owned hash routes and popstate/hashchange paths are covered, not only
  top-level tab clicks.
- Same-page controls do not trigger accidental scroll resets.
- The implementation does not introduce smooth-scroll flakiness, router
  churn, content edits, remote dependencies, or localStorage/progress changes.
- Tests prove both the manual scenario and a non-manual top-level route.

## Process-Memory Gates

- Implementation Agent must keep
  `specs/040-scroll-top-navigation/tasks.md` current with decisions, evidence,
  changed files, dead ends, known issues, and any feedback for Architect
  disposition.
- Any desired product behavior beyond route scroll reset must be recorded as
  Implementation Agent feedback instead of implemented silently.
- Final Architect validation is not part of this planning assignment and must
  be invoked later by Orchestrator after implementation, review, checks, and
  process memory are current.
