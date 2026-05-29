# Spec: Interactive Russian Manual Chapters 1 And 2

## Analyst Intake

- Source request: `feature-request.md`
- Intake assumptions or open questions carried into this spec: no blocking user clarification is required. The intake assumes Chapter 1 and Chapter 2 mean source manual pages `21-56`, inclusive, and that `каждую страницу` means one implementation PR per source page/content page.
- Orchestrator routing context: Orchestrator assigned Architect work in `/Users/chap/devel/cabadrive-worktrees/030-manual-chapters-1-2` on branch `codex/030-manual-chapters-1-2`, with verified base `origin/main` at `b82794b42c6661af8ff40e361a138e0ef074fc6c`.
- Active-model stop condition: Architect is acting only after explicit Orchestrator assignment. This artifact does not authorize Architect to implement product files, tests, assets, commits, pushes, PRs, or merges.
- Read-only transition: the original user request was repository-changing from the start because it requests continuation of the product `Руководство` and PR/merge delivery.
- Parallel-work constraints: parallel agents may exist. Preserve sibling worktrees, branches, commits, PRs, dirty diffs, process memory, and the root main worktree's unrelated untracked `tmp_repair_page18_center.swift`.
- Startup base evidence: `origin/main` at `b82794b42c6661af8ff40e361a138e0ef074fc6c` was provided by Orchestrator and observed locally as the current branch base.
- Cleanup applicability: not applicable to this Architect planning assignment. Cleanup, if later assigned, is a separate Cleanup Agent role.

## Cycle Definition

- Work cycle: one repository-changing request represented by `specs/030-manual-chapters-1-2/`, from latest-main startup through one shared prerequisite PR if used, 36 page PR slices, review/check gates, final Architect validation, final Analyst validation, completion, or escalation.
- Cycle PR set expectations: `tasks.md` records every contributing PR slice with purpose, page number or shared-prerequisite scope, branch, PR metadata, current/final head SHA, status, required evidence, merge status, and whether it is included in final validation.
- Latest-main startup rule: every implementation slice starts from latest verified `main`, normally after `git fetch origin main`. Fetch/base verification failure is a blocker or explicitly recorded fallback, not permission to reuse stale local state. The Analyst/Architect handoff branch is planning-only and must not become a page implementation PR unless Orchestrator explicitly assigns that exceptional route.

## Page And Slice Definition

For this cycle, a `page/content-page` means exactly one source manual PDF page and its matching manifest/local render entry:

- manual page number `N` where `21 <= N <= 56`;
- `content/manuals/gcba-manual-vehiculo-4-ruedas-2023/manual.ru.json#/pages[N-1]`;
- `content/manuals/gcba-manual-vehiculo-4-ruedas-2023/layout.ru.json#/pages[N-1]`;
- `content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/pages/page-NNN.jpg`.

There is no exception in this spec: pages `21` and `43` are chapter divider/title pages and still count as content pages requiring separate page PRs. Source-`Índice` topics remain the primary navigation hierarchy, but each implemented topic page is delivered as its own page/content-page route or child entry under that hierarchy.

## Goal

Continue the native Russian interactive `Руководство` into official manual Chapter 1 and Chapter 2 as source-faithful, selectable, responsive web pages, delivered one source page per merged PR.

## Scope

In scope:

- Convert pages `21-42` for `CAPÍTULO 1: HACIA UNA MOVILIDAD SUSTENTABLE`.
- Convert pages `43-56` for `CAPÍTULO 2: CONDUCIR ES UN ACTO DE RESPONSABILIDAD`.
- Include chapter divider pages `21` and `43`.
- Preserve the source `Índice` hierarchy and current navigation IDs unless a later Architect disposition records a source-backed correction.
- Add page-level content entries under the full `Руководство` hierarchy while keeping topic/chapter navigation source-derived.
- Reuse the conversion principles from `docs_project/project/frontend/manual-conversion-guidelines.md` and feature `029-pandemia-vial-section`.
- Use local source artwork/crops, source-region metadata, cleaned originals, selectable Russian text layers, responsive prose, visual checker evidence, and screenshot/bounding-box QA.
- Update durable docs only if implementation changes the durable manual conversion contract, style tokens, validation workflow, navigation behavior, or runtime expectations.

Out of scope:

- Chapters 3-5, appendices, front matter, and Introduction fixes not required by Chapter 1/2 integration.
- Practice-question bank changes or claims that the fallback question set is official/complete.
- Runtime backend, live AI, analytics, remote fonts, remote images, runtime fetches, runtime PDF rendering, or PDF viewer integration.
- User-owned or sibling worktree cleanup.
- Architect implementation, test edits, asset generation, commits, pushes, PR creation, or merge actions.

## User Stories

### User Story 1

As a Russian-speaking learner preparing for the CABA theory exam, I want Chapter 1 pages in `Руководство` to be readable native Russian web pages, so that I can understand sustainable mobility, pedestrian priority, bicycles, public transport, and shared trips without parsing Spanish PDF pages.

### User Story 2

As a Russian-speaking learner, I want Chapter 2 pages to preserve legal/document/incident obligations accurately, so that simplified Russian wording does not weaken exam-critical duties, restrictions, numbers, document names, or legal consequences.

### User Story 3

As the project owner, I want each source page merged in a separate PR, so that infographic quality, wording, and visual regressions can be reviewed and accepted page by page.

## Acceptance Criteria

1. Given the user opens `Руководство`, when Chapter 1 or Chapter 2 is expanded, then implemented pages `21-56` appear under the source `Índice` hierarchy with pending states only for pages not yet merged.
2. Given any page PR slice, when its diff is reviewed, then it contains exactly one source page/content page's user-facing content plus necessary page-local assets/tests/process-memory updates, and no second source page is silently bundled.
3. Given page `21` or page `43`, when implemented, then the divider/title page is its own page PR and preserves the source divider role without rendering a full-page PDF raster.
4. Given a page contains ordinary prose, lists, legal text, or callouts, when rendered at desktop, narrow in-app, and mobile viewports, then Russian text is selectable/copyable, responsive, and free of horizontal clipping or forced PDF line breaks.
5. Given a page contains source artwork, pictograms, signs, tables, diagrams, or infographics, when rendered, then source geometry, colors, panels, connectors, borders, proportions, and meaningful visual relationships are preserved from local source crops or visually indistinguishable reconstruction.
6. Given any visual block with source text, when converted, then Spanish source text is absent from the learner view, Russian labels are selectable DOM/SVG text where feasible, and cleanup does not create broad masks, square patches, plates, or visible artifacts.
7. Given a page has legal/document/incident-obligation content, when Russian wording is simplified, then named entities, law/document names, numbers, time limits, obligations, exceptions, ordered steps, contacts when retained, and safety/legal meaning remain traceable to the source.
8. Given visual checker evidence is produced for a page, when the page PR is marked ready, then evidence includes source screenshot/reference, Russian screenshot(s), source-region/crop metadata, component/bounding-box checks, visible-Spanish checks, responsive checks, selectable-text checks, and explicit pass/fail output.
9. Given all page PRs and any shared prerequisite PR are complete, when final validation starts, then the cycle PR set records every contributing PR and final Architect validation runs before final Analyst validation.

## Negative Scenarios

1. Given implementation work starts, when a PR includes multiple page/content pages from `21-56`, then it is not merge-ready unless Architect records a source-backed exception and Orchestrator explicitly accepts it. This spec records no such exception.
2. Given the old full-manual page-layout reader exists internally, when Chapter 1/2 content is exposed, then it must not be the primary learner experience, must not expose `Руководство 4R` as a duplicate destination, and must not use side-by-side Spanish PDF/translation output.
3. Given a page has an infographic or pictogram, when implementation replaces it with generic icons, altered colors, approximate cards, distorted reassembly, cropped fragments, or a text-only substitute, then review blocks the PR.
4. Given Spanish source text remains visible in a learner-facing crop, or cleanup uses a broad mask/plate/rectangle that visibly changes source artwork, then the PR is blocked.
5. Given Russian text is baked into page images or blocked by `user-select: none`, `pointer-events: none`, or equivalent, then the PR is blocked.
6. Given a legal/document page simplifies away a number, document name, time limit, obligation, restriction, exception, or responsibility type, then the PR is blocked until Architect disposition records the change as acceptable or the detail is restored.
7. Given a page PR claims visual quality from structural tests only, without source-vs-Russian screenshots and bounding-box/artifact checks, then it is not merge-ready.
8. Given cleanup is considered only by name pattern, timestamp, or memory, then cleanup is refused unless a Cleanup Agent receives a separate assignment and positive-proof validation passes.

## Requirements

- FR-001: `Руководство` must remain the only user-facing interactive manual destination for this conversion.
- FR-002: Source `Índice` hierarchy remains primary: Chapter 1 and Chapter 2 entries group their topic children, and page/content-page entries live inside those groups rather than replacing navigation with raw page numbers.
- FR-003: Exactly 36 page/content-page implementation PR slices are required for pages `21-56`, inclusive.
- FR-004: One shared prerequisite PR is allowed and recommended only for shared route/schema/checker/style infrastructure with no converted Chapter 1/2 page content.
- FR-005: Every implementation slice after planning must use a fresh isolated worktree/branch from latest verified `main`.
- FR-006: Every page PR must update `tasks.md` process memory with page evidence, decisions, dead ends, known issues, Implementation Agent feedback, and cycle PR set details.
- FR-007: Every page must use native HTML/CSS/SVG/local assets; runtime PDF viewer, PDF.js, iframe/object/embed PDF display, remote assets, runtime fetches, backend endpoints, live AI calls, and remote fonts are forbidden.
- FR-008: Ordinary Russian learning text must be selectable/copyable DOM or SVG text and must not be rasterized into images.
- FR-009: Normal prose must wrap responsively; horizontal scrolling is allowed only inside fixed visual blocks whose source layout requires it.
- FR-010: Source artwork and infographics must be local, source-faithful, and backed by metadata: source page, source region, asset path, crop dimensions/hash when practical, cleanup scope, visible-Spanish status, and quality notes.
- FR-011: Generic icon sets, redesigned pictograms, approximate SVG redraws, altered colors, missing components, distorted source-piece assembly, broad masks, DOM label plates, and visible cleanup artifacts are forbidden.
- FR-012: Russian wording may be simplified locally for learner clarity only when source order, meaning, and ticket-critical details remain intact.
- FR-013: Recurring style tokens for document shell, headings, body, callouts, legal cards, figure captions, tables, sign/image blocks, and chapter dividers must be reused or extended with source-backed variants.
- FR-014: Page-specific tests must cover route availability, content coverage, forbidden patterns, local assets, source-region metadata, selectable text, responsive prose, visible-Spanish absence, and visual checker output.
- FR-015: Visual checker evidence is first-class and required for every page PR, with stricter checks for pages containing diagrams, pictograms, signs, callouts, tables, or image-heavy layouts.
- FR-016: Review Agent must verify role boundaries, Orchestrator-first routing, complete feature memory, latest-main startup evidence, sibling-work preservation, one-page PR scope, and visual-quality evidence.
- FR-017: The work cycle requires cycle PR-set tracking and final Architect validation before final Analyst validation, completion, conservative Orchestrator finalization, or merge.
- FR-018: If Analyst final validation finds gaps, Analyst-owned validation notes require Architect accept/task/ticket/dispose disposition before follow-up development.
- FR-019: If final validation targets an effective content head, record matching markers: `Effective content head: <40-hex-sha>`, `Architect validated effective content head: <40-hex-sha>`, and `Analyst validated effective content head: <40-hex-sha>`.
- FR-020: Architect return limit is 10 and Analyst return limit is 5 per work cycle; exceeding either limit requires new-feature-request escalation.
- FR-021: Cleanup is out of scope unless Orchestrator explicitly assigns Cleanup Agent work with approved roots and positive-proof validation.

## Success Criteria

- SC-001: Pages `21-56` are represented by 36 separate merged page PRs, plus no more than one shared prerequisite PR if Orchestrator accepts it.
- SC-002: `Руководство` exposes Chapter 1 and Chapter 2 in the full source `Índice` hierarchy, with page content replacing pending placeholders as PRs merge.
- SC-003: Every page PR records passing focused tests, visual checker output, screenshot evidence, and local preflight evidence before merge readiness.
- SC-004: Final validation covers the full cycle PR set and records current process memory, effective content head, role validation order, and merge-readiness gates.
- SC-005: No duplicate visible manual destination, runtime PDF/page-raster reader, remote dependency, or old side-by-side translation flow is introduced.

## Assumptions

- Existing `manual.ru.json`, `layout.ru.json`, `navigation.ru.json`, and local page renders are trusted source/reference inputs but not the final interactive runtime model.
- Existing Introduction style and `docs_project/project/frontend/manual-conversion-guidelines.md` are the baseline for new pages.
- Page PRs should normally merge sequentially after the shared prerequisite PR to reduce conflicts in shared navigation/index files. Parallel page PRs are allowed only if Orchestrator verifies non-overlapping files and latest-main rebasing/merging safety.
- Some page-render visual regions are currently classified as page chrome in the legacy layout; Implementation Agent must still inspect the source render because meaningful source infographics may not be fully expressed by the legacy manifest.

## Review And Verification Requirements

- Implementation requirements: Implementation Agent must start only after Orchestrator assigns an isolated worktree, branch, page number, PR slice, and complete feature memory. Implementation Agent edits exactly the assigned page plus necessary page-local tests/assets/process-memory entries, unless assigned the shared prerequisite PR.
- Review requirements: Review Agent checks Orchestrator-first compliance, role boundaries, latest-main startup, one-page slice scope, no sibling mutation, complete process memory, visual-source-fidelity gates, no forbidden manual rendering patterns, and final-validation compliance where applicable.
- Test/verification requirements: per page PRs run focused content tests, focused visual/source-fidelity checker, focused Playwright route test with screenshots, `pnpm run validate:content`, `pnpm run test`, `pnpm run build`, `pnpm run preflight`, and Docker runtime validation through `make build`, isolated `make up`, screenshot/browser check, and `make down` unless Orchestrator records a specific fallback.
- Handoff and blocker requirements: post-Analyst assumptions stand unless a documented blocker exists. Implementation Agent feedback is recorded in process memory and routed to Architect for disposition. Ambiguous source boundaries, unsafe cleanup, credentials/permissions, data-loss risk, conflicting requirements, or PR state ambiguity stop the role for Orchestrator/user disposition.
- Final validation requirements: Architect validates all PR slices, Architect-assigned tasks/dispositions, architectural guidance, open task state, process memory, and customer intent in spirit. Analyst validates customer intent in spirit and letter only after Architect passes. Passing effective-head validation records matching effective-head SHA markers. Any non-evidence post-validation change makes validation stale.
