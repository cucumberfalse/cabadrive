# Feature Request: Sources Fragment Navigation Polish

## Analyst Intake

- Feature id: `028-sources-navigation-polish`
- Analyst role invoked by Orchestrator for intake only.
- Repository worktree: `/Users/chap/devel/cabadrive-worktrees/028-sources-navigation-polish`
- Branch: `codex/028-sources-navigation-polish`
- Verified base: `origin/main` at `c6e3c34d93bd63a0836c148ccfc5d0e32375a930`
- Parallel work may exist. Preserve existing dirty diffs, branches, commits, PRs, and process memory.
- Intake status: ready for Architect handoff.

## Original Request

> работай строго как оркестратор проблема в блоке источники навигация смазана

The attached screenshot shows the `Источники` section. The middle `Фрагменты` navigation column has vertically compressed or overlapping fragment items: titles and subtitles bleed into neighboring rows, text appears cut off or visually smeared, and the selected item is hard to read.

## Project Context Read

Analyst intake reviewed the required durable memory:

- `.specify/memory/constitution.md`
- `docs_project/README.md`
- `docs_project/project-idea.md`
- `docs_project/project/frontend/frontend-docs.md`
- `docs_project/project/backend/backend-docs.md`
- `docs_project/project/feature-inventory.md`
- `docs_project/screens/learning-and-exam-flows.md`
- `docs/specify/README.md`

Relevant context:

- Cabadrive is a local-first React/TypeScript/Vite web trainer for Russian-speaking CABA theory-exam learners.
- `Источники` is a distinct official primary-source reader, separate from `Материалы` and `Руководство 4R`.
- The reader defaults to simple Russian, supports full Russian translation and original Spanish, and must label Russian layers as unofficial learning support.
- The reader must use bundled local content only and must not introduce runtime backend/network dependencies.
- UI should support mobile-first interaction and fast exam-focused study.

No external research was needed for this UI defect intake.

## Problem Statement

In the official source reader, fragment navigation is not reliably readable. The visible defect is in the `Фрагменты` list, where fragment titles/subtitles overlap vertically or are clipped inside navigation items. This makes it difficult to identify and select a fragment and reduces trust in the official-source reference surface.

The issue appears to be presentation/layout related rather than a content-source or validation problem.

## Goal

Make the `Источники` fragment navigation readable, stable, and accessible across desktop and mobile layouts while preserving the existing source-reader behavior.

## Scope

In scope:

- Polish the `Фрагменты` navigation list in `Источники`.
- Ensure fragment rows have stable vertical spacing and no text overlap, clipping artifacts, or smeared-looking line collisions.
- Preserve readable active, hover, and keyboard-focus states.
- Preserve document selection, fragment selection, and source-reader language mode switching.
- Verify the fix on desktop and mobile-sized viewports.
- Keep the official Spanish archive and Russian learning-support boundaries unchanged.

Out of scope:

- Changing official source content, Russian translations, simple Russian rewrites, or official-documents archive validation.
- Adding new source documents or changing exact-text/currentness governance.
- Redesigning unrelated top-level navigation, `Материалы`, `Руководство 4R`, exam mode, or learning question cards.
- Introducing a backend, runtime network fetch, live AI, remote assets, PDF viewer, or new content pipeline.

## Assumptions

- The screenshot represents the intended defect: fragment list items in the `Источники` detail view are vertically too tight or otherwise constrained so their text overlaps or is clipped.
- Requirements are clear enough for architecture without additional user clarification.
- A conservative UI/layout fix is preferred over broad visual redesign.
- Existing design modernization work may provide reusable styles or tokens, but the fix should remain scoped to the source-reader fragment navigation.
- The current 19-document source-reader content set remains the relevant validation target.

## Acceptance Expectations

Architect and Implementation Agent should ensure that:

- On desktop, `Источники` fragment navigation is visually readable with no vertical text overlap, no smeared line collisions, and no unintended clipping in normal item, active item, hover item, and focused item states.
- On mobile, the same fragment navigation remains readable and usable without overlap or horizontal overflow.
- Long Spanish fragment titles wrap or truncate in a deliberate, polished way that does not collide with subtitles or adjacent items.
- The selected fragment remains visually distinct and accessible.
- Keyboard focus is visible and does not distort item layout.
- Switching documents still updates the fragment list and selected fragment correctly.
- Switching between simple Russian, full Russian, and original Spanish still works for the selected source/chunk.
- The fix does not regress source-reader labels that distinguish official Spanish text from unofficial Russian learning support.
- Verification evidence includes at least one desktop and one mobile viewport check of the `Источники` reader, preferably with screenshots or Playwright coverage where appropriate.

## Risks

- A purely local CSS adjustment could fix the observed desktop screenshot while leaving mobile or long-title cases broken.
- Truncating too aggressively could hide important article/chapter identifiers that learners use to orient themselves.
- Broad shared-component changes could accidentally affect other navigation surfaces outside `Источники`.

## Open Questions

- None blocking intake. If implementation discovers that the defect is caused by shared layout primitives or recent design-system changes, record that finding in process memory for Architect disposition before broadening scope.

## Handoff

Analyst intake is complete. Orchestrator may route this feature request to Architect for `spec.md`, `plan.md`, and `tasks.md`.

## Final Analyst Validation

- Analyst validation pass: passed
- Final Analyst validation completed at: 2026-05-27T00:08:10-03:00
- Analyst validated effective content head: 3198229bd03b1037cb49622fbcb56999b0c9dd22
- Analyst validation return count: 0
- New feature request escalation needed: no
- Validation scope: final Analyst validation checked the completed result against the original customer request in spirit and letter: the user asked to work through Orchestrator workflow and reported that navigation in the `Источники` block was smeared/overlapping.
- Customer outcome validation: passed. The recorded implementation and verification evidence show a narrow `Источники` `.source-toc` fragment-navigation layout fix that prevents row shrink overlap/clipping, keeps labels/subtitles readable on desktop and mobile, preserves selected/focus states, and keeps document selection, fragment selection, and `Просто`/`Полный перевод`/`Оригинал ES` behavior intact.
- Acceptance expectation validation: passed. Evidence recorded by implementation and Architect includes pre-fix geometry failure, post-fix desktop/mobile Playwright geometry pass, focused primary-source e2e pass, full tests/build/preflight pass, no review findings, and no change to official/unofficial source labeling or local-only constraints.
- Analyst gaps: none.
