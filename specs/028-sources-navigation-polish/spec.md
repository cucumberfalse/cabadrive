# Spec: Sources Fragment Navigation Polish

## Role and Context

- Feature ID: `028-sources-navigation-polish`
- Architect assignment worktree: `/Users/chap/devel/cabadrive-worktrees/028-sources-navigation-polish`
- Branch: `codex/028-sources-navigation-polish`
- Verified base: `origin/main` at `c6e3c34d93bd63a0836c148ccfc5d0e32375a930`
- Intake source: `specs/028-sources-navigation-polish/feature-request.md`
- Parallel work may exist. Preserve existing dirty diffs, branches, commits, PRs, and process memory.

## Goal

Make the `Источники` fragment navigation readable and stable across desktop and mobile layouts. The `Фрагменты` list must not show vertical text overlap, smeared line collisions, accidental clipping, or unstable active/focus item sizing while preserving existing source-reader behavior.

## Project Constraints

- Cabadrive remains a static local-first React/TypeScript/Vite app with no runtime backend.
- The Docker/local runtime contract remains unchanged.
- `Источники` is a distinct official primary-source reader backed by bundled local content.
- Official Spanish archive content remains verbatim and separate from Russian learning-support layers.
- The reader defaults to simple Russian, supports full Russian translation and original Spanish, and must not add simplified Spanish.
- The fix must not introduce runtime network fetches, remote assets, live AI, backend calls, PDF viewers, or source-content pipeline changes.

## Scope

In scope:

- The fragment navigation UI inside `Источники`, especially `.source-toc`, `.source-toc-list`, and `.source-toc button` behavior.
- Readable layout for long Spanish/Russian official labels and heading subtitles.
- Normal, active, hover where present, and keyboard-focus states.
- Desktop and mobile source-reader layouts.
- Focused regression coverage for fragment selection, document selection, language modes, and local-only runtime behavior.

Out of scope:

- Changing official source documents, source-reader corpus JSON, translations, simple rewrites, exact-text validation, currentness governance, or archive metadata.
- Redesigning top-level navigation, `Материалы`, `Руководство 4R`, exam mode, learning cards, source search semantics, or content filters.
- Adding a backend, runtime PDF viewer, remote assets, network fetches, or new content tooling.
- Broad design-system refactors beyond what is necessary to fix the fragment list.

## Current Code Observations

- The source reader is implemented in `src/App.tsx` in `PrimarySourcesView`.
- The fragment navigation markup is a `nav.source-toc` containing `.source-toc-list` and one button per chunk.
- Each TOC button contains a primary `span` for `chunk.officialLabel` and a secondary `small` for the last heading path segment.
- Relevant styles are in `src/styles.css`.
- Current `.source-toc-list` is a vertical flex list with `max-height`, `gap`, scrolling, and no explicit item anti-shrink constraint.
- Current `.source-toc button` uses `min-height: 42px`, padding, and block child text. Long labels can exceed the minimum height; implementation must ensure rows expand or intentionally clamp without colliding with sibling rows.
- Existing e2e coverage in `tests/e2e/app.spec.ts` already covers primary-source reader modes, search, filters, long-document TOC selection, keyboard focus, compact/mobile layout, and no runtime network/PDF/backend dependencies. It does not yet assert the visual no-overlap/no-clipping condition for TOC item text.

## UX Requirements

- Fragment items must be readable when labels and subtitles wrap to multiple lines.
- Rows may grow vertically or use a deliberate line-clamp/truncation strategy, but text must never overlap adjacent rows or collide with the subtitle.
- The selected fragment must remain visually distinct.
- Keyboard focus must be visible and must not distort row layout.
- Mobile layout must avoid horizontal overflow and preserve touch-friendly targets.
- Long article/chapter identifiers should remain visible enough for learners to orient themselves. Do not truncate so aggressively that article numbers or section names disappear.

## Implementation Requirements

- Use the smallest practical UI/layout change, likely scoped to `src/styles.css` and only to the source-reader TOC selectors unless implementation proves a markup/test hook adjustment is necessary.
- Prefer CSS layout constraints over content changes.
- Ensure TOC items cannot shrink into text overlap. Candidate techniques include explicit `flex: 0 0 auto` on buttons, stable line-height, grid/flex child layout inside buttons, `overflow-wrap`, `min-width: 0`, `align-items`, and deliberate clamp/overflow rules if chosen.
- Preserve button semantics and accessible names.
- Preserve document selection behavior: choosing a source updates the selected document and first/matching chunk as before.
- Preserve fragment selection behavior: choosing a TOC item updates the displayed chunk.
- Preserve text mode behavior: `Просто`, `Полный перевод`, and `Оригинал ES` continue to switch the same selected chunk.
- Preserve source-reader labels distinguishing official Spanish text from unofficial Russian learning support.
- Do not alter source-reader content data, official archive data, content validators, service-worker strategy, or backend/runtime contracts.
- Keep feature memory current in `tasks.md`, recording implementation decisions, verification evidence, dead ends, known issues, and Implementation Agent feedback.

## Acceptance Criteria

1. Desktop `Источники` fragment navigation has no visible vertical overlap, line collision, or accidental clipping in normal and active TOC rows.
2. Mobile `Источники` fragment navigation has no visible vertical overlap, line collision, accidental clipping, or horizontal overflow in TOC rows.
3. Long fragment labels/subtitles wrap or truncate in an intentional polished way and do not collide with each other or adjacent rows.
4. The active TOC item remains visually distinct and accessible.
5. Keyboard focus remains visible on TOC items and does not change row geometry in a way that causes overlap or clipping.
6. Selecting another document still refreshes the fragment list and selected chunk correctly.
7. Selecting another fragment still updates the displayed source chunk.
8. `Просто`, `Полный перевод`, and `Оригинал ES` modes still render for the selected chunk.
9. The source reader still uses bundled local content only and introduces no runtime network, PDF, backend, live-AI, or remote-asset dependency.
10. Existing app flows covered by current primary-source e2e tests remain green.

## Negative Scenarios

- A CSS tweak fixes one screenshot width but leaves mobile fragment rows clipped or horizontally overflowing.
- TOC rows are forced to a fixed height while multi-line labels bleed into adjacent rows.
- Long labels are hidden so aggressively that article/chapter identifiers are no longer usable.
- Focus rings or active borders cause layout shift that reintroduces overlap.
- The fix changes source-reader content, document selection, language-mode state, source labels, or local-only behavior.
- A shared button/list style change unintentionally affects unrelated app surfaces.

## Verification Evidence Required

- Local inspection or automated evidence for desktop viewport around `1240x900` showing `.source-toc` items have no overlap/clipping.
- Local inspection or automated evidence for mobile viewport around `390x900` showing `.source-toc` items have no overlap/clipping and no horizontal overflow.
- Playwright coverage or equivalent DOM geometry assertions for `.source-toc-list` rows, including selected and non-selected rows with long labels.
- Regression evidence that fragment selection updates `source-chunk-reader`.
- Regression evidence that document selection still updates the fragment list/selected chunk.
- Regression evidence that `Просто`, `Полный перевод`, and `Оригинал ES` still switch content.
- Evidence that the source reader still has no runtime external requests, PDF requests, backend/live-AI requests, or PDF viewer elements.
- Passing local checks appropriate for the narrow UI change, at minimum focused e2e for primary sources, `pnpm run test`, `pnpm run build`, `node scripts/check-feature-memory.mjs --worktree`, and `git diff --check`. Run full `pnpm run preflight` before PR readiness unless Orchestrator explicitly assigns a narrower verification pass.

## Review Requirements

- Review Agent verifies complete feature memory exists and role boundaries were preserved.
- Review Agent verifies the implementation is scoped to the `Источники` fragment navigation defect unless recorded evidence justifies a slightly broader shared-style fix.
- Review Agent verifies no source content, official archive, translation corpus, backend/runtime, or PDF behavior changed.
- Review Agent verifies desktop and mobile evidence covers no overlap/clipping for TOC rows.
- Review Agent verifies existing primary-source behavior and local-only constraints remain covered by tests or recorded evidence.
