# Plan: Interactive Russian Manual Chapters 1 And 2

## Summary

Continue the accepted native `Руководство` conversion model from the Introduction into Chapter 1 and Chapter 2. Use one shared prerequisite PR for page-routing/schema/checker infrastructure, then one page/content-page PR for each source page `21-56`, merging every page separately with page-specific visual evidence.

## Technical Context

- runtime: static local-first React + TypeScript + Vite app, Docker-served for local runtime.
- dependencies: existing local toolchain; no runtime backend, remote assets, remote fonts, live AI, or PDF renderer.
- product paths likely touched by implementation: `src/App.tsx`, `src/styles.css`, `src/data/pandemiaVialSection.ts` or a successor manual-guide data module, `content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/`, `tests/`, `tests/e2e/`, optional visual checker scripts, and this feature memory.
- source/reference paths: `content/manuals/gcba-manual-vehiculo-4-ruedas-2023/manual.ru.json`, `layout.ru.json`, `navigation.ru.json`, local renders `page-021.jpg` through `page-056.jpg`, and the archived official PDF SHA `69c6e1c582db4f96337fc13db09fffab26f9ce6364279c6beb2abc21d9ad3e8e`.
- latest-main base evidence: Orchestrator provided `origin/main` at `b82794b42c6661af8ff40e361a138e0ef074fc6c`; implementation slices must verify latest `origin/main` again before branch/worktree creation.
- assigned isolated worktree/branch for Architect planning: `/Users/chap/devel/cabadrive-worktrees/030-manual-chapters-1-2`, `codex/030-manual-chapters-1-2`.
- cleanup applicability: not applicable to Architect planning; no cleanup is authorized.

## Scope Boundaries

- in scope: Chapter 1 pages `21-42`, Chapter 2 pages `43-56`, source-`Índice` navigation integration, page-level routes/placeholders, local source artwork/crops, Russian native text, tests, visual checker evidence, process memory.
- out of scope: Chapters 3-5, annexes, practice-question changes, old manual-reader replacement outside what is required for `Руководство`, cleanup, merge actions by Architect.
- role-routing constraints: every file-changing implementation starts with Orchestrator assignment. Non-Orchestrator agents stop on new repository-changing requests and do not self-promote.
- recovery constraints: if direct edits occur before routing or prerequisites, the agent stops, reports, preserves sibling/user work, and waits for Orchestrator/user disposition.
- sibling-process coordination: preserve feature `029-pandemia-vial-section` decisions, `docs_project/project/frontend/manual-conversion-guidelines.md`, existing Introduction hashes/routes, sibling worktrees, and the root untracked `tmp_repair_page18_center.swift`.

## Constitution Check

- Spec-first: complete `feature-request.md`, `spec.md`, `plan.md`, and `tasks.md` are required before implementation.
- Testable boundaries: page data, route coverage, forbidden patterns, source-artwork metadata, visual checker output, and Playwright assertions must be testable per page.
- PR-only: no direct push to `main`; one page/content page per implementation PR.
- Latest-main isolation: every shared/page slice starts from latest verified `main`; unverified/fetch-failed base is a blocker or documented fallback.
- Final validation loop: Orchestrator invokes final Architect validation, then final Analyst validation after Architect passes.
- Simplicity: the shared prerequisite is allowed to avoid duplicating page-route/checker infrastructure across 36 page PRs; no additional abstraction is accepted without `plan.md`/process-memory justification.
- Deployability: required checks and local preflight/Docker verification remain gates before merge readiness.
- Active-model stop condition: Architect writes only Architect-owned artifacts in this assignment.
- Complete feature-memory prerequisite: Implementation Agent must confirm `feature-request.md`, `spec.md`, `plan.md`, and `tasks.md`.
- Sibling-work preservation: every slice records parallel-work warning and avoids dirty/untracked/sibling mutation.

## Cycle And PR-Set Tracking

- Work cycle boundary: feature `030-manual-chapters-1-2` from this planning branch through all accepted PR slices, final validation, completion, or escalation.
- Cycle PR set recording location: `tasks.md` section `Cycle PR Set`, with matching PR body notes recommended for each PR.
- PR slice fields: `purpose`, `source page`, `branch`, `PR metadata`, `head SHA`, `status`, `evidence`, `merged?`, `included in final validation`.
- Analyst handoff handling: the planning worktree remains planning-only. Orchestrator may reuse it only for role-appropriate planning/final-validation notes, not implementation unless explicitly reassigned.
- Additional task-slice startup: Orchestrator fetches/verifies `origin/main`, records base SHA, creates one fresh isolated worktree/branch per shared/page slice, warns about parallel work, and requires no sibling mutation.

## PR Slicing Plan

Recommended total: 37 PRs.

1. Shared prerequisite PR, no converted Chapter 1/2 page content:
   - establish Chapter 1/2 page-route model under `Руководство`;
   - add pending page registry for pages `21-56`;
   - add or generalize page content schema, visual-artwork metadata shape, style-token registry, and source-fidelity checker harness;
   - add tests that pages can be pending without fake content and that old manual viewer/PDF patterns remain forbidden.
2. Page PRs `21` through `56`, one source page/content page per PR:
   - branch from latest verified `main`, normally after the shared prerequisite and any previous conflicting page PRs have merged;
   - implement only that page's content, page-local source crops/assets, page-local tests/checker fixtures, screenshot evidence, and process-memory entry;
   - update navigation from pending to implemented only for that page;
   - record merge-readiness evidence before Orchestrator finalization.

Default merge order is page order, `21 -> 56`, because adjacent pages often share topic-local navigation/data files and ordered rollout keeps process memory easy to audit. Orchestrator may parallelize non-overlapping page PRs only after verifying latest-main base and conflict safety.

## Page Route And Navigation Approach

- Keep `Руководство` as the visible destination.
- Keep existing Introduction hashes working.
- Represent Chapter 1 and Chapter 2 as active top-level groups under the full source `Índice` tree.
- Represent source topics as children under the chapters, and implemented page/content-page entries as ordered page children or route anchors under the relevant topic.
- Recommended page route id format: `manual-page-021` through `manual-page-056`, with stable aliases or hash routes only if the implementation already has a compatible pattern.
- Page numbers remain source metadata and secondary navigation, not the sole primary UI.
- Chapter divider pages `21` and `43` belong directly under their chapter as chapter-opening pages.

## Content And Visual Strategy

- Start from source inspection for each page: `navigation.ru.json`, `manual.ru.json`, `layout.ru.json`, local page render, and official PDF when region/crop confirmation is needed.
- Use the existing approved Russian translation as source material, then simplify only locally for learner clarity.
- Preserve source order and ticket-critical detail. If a detail appears legally or exam relevant, keep it unless Architect explicitly disposes it.
- Convert prose to native responsive DOM flow. Do not preserve PDF column widths when they make text cramped or scroll horizontally.
- Preserve meaningful source visuals with local crops or visually indistinguishable reconstruction. Full-page source renders are reference/extraction inputs only.
- For text-bearing artwork, clean only the source text area at glyph/local-pixel level where feasible, preserve surrounding shapes/connectors/edges, and overlay selectable Russian DOM/SVG labels.
- Omit page numbers, footnote mechanics, source clutter, and book-only decoration when they do not help exam learning. For legal/source footnotes that carry exam-relevant law/document details, convert the substance into learner-facing notes or citations without preserving the footnote marker as decoration.
- Record style tokens for recurring Chapter 1/2 block types: chapter divider, source-topic page header, two-column prose converted to responsive flow, blue/legal callout, warning/recommendation, sign/table row, pictogram figure, infographic label, legal document list, emergency checklist, contact/resource list, closing slogan.

## Infographic And Artwork Quality Gate

Every page PR has a visual gate. Pages with diagrams, signs, pictograms, tables, photos, or infographic-like callouts require strict evidence:

- source-region/crop metadata with page number, region coordinates, asset path, dimensions/hash when practical, cleanup status, and visible-Spanish status;
- source screenshot/reference and Russian screenshot at desktop and mobile, plus narrow/high-risk viewport when fixed visuals are present;
- bounding-box checks for label fit, no overlap, no clipping, no layout overflow, and source-like relationships;
- no generic icon replacement, redesigned diagram, broad mask, DOM plate, color-matched rectangle, clipped crop box, distorted source-piece assembly, or visible Spanish;
- visual checker pass/fail report that names any manual visual review notes, not just an AI-written summary.

## Verification

| Acceptance criterion | Evidence |
| --- | --- |
| One page per PR | PR diff scope, `tasks.md` cycle PR set row, Review Agent scope check |
| Source-`Índice` hierarchy | content tests for Chapter 1/2 groups, topic/page placement, pending/implemented state |
| Native Russian text | DOM tests, Playwright selection/computed-style checks, no rasterized text-only page |
| Responsive prose | Playwright desktop/narrow/mobile bounding-box checks and screenshots |
| Source-faithful visuals | visual checker metadata, source/Russian screenshots, crop hashes/regions, bounding-box checks |
| No forbidden runtime patterns | content tests scanning for PDF viewer, full-page raster base, side-by-side translation, remote URLs, masks/plates |
| Legal/document detail retention | content tests or review evidence comparing source facts/numbers/obligations to Russian page content |
| Local-first runtime | `pnpm run build`, `pnpm run preflight`, Docker `make build`, isolated `make up`, browser screenshot/check, `make down` |
| Latest-main startup | Orchestrator slice assignment and Implementation Agent baseline `git status`/base evidence |
| Cycle PR set | `tasks.md` rows for shared prerequisite and pages `21-56` |
| Final Architect validation | Architect-owned validation notes after all PR slices appear complete |
| Final Analyst validation | Analyst-owned validation notes after Architect pass |
| Effective content head and current-head guard | matching SHA markers and Orchestrator read-only current-PR-head guard if evidence-only commits follow validation |
| Cleanup applicability and evidence/refusal | not applicable unless Orchestrator assigns Cleanup Agent |
| Return limits | Architect return count `0-10`, Analyst return count `0-5`, or escalation evidence |
| Merge gates | required checks from `.unicorn-hub/config.json`: `baseline-checks`, `docker-validation`, `guard`, `AI Review`, `osv-scan`, plus review/conflict/process-memory gates |

Per page recommended commands:

```bash
node --test tests/content-pandemia-vial-section.test.mjs
pnpm run validate:content
pnpm run test
pnpm run build
pnpm exec playwright test tests/e2e/app.spec.ts -g "Manual|Руководство|page 0NN"
pnpm run preflight
make build
COMPOSE_PROJECT_NAME=cabadrive-030-page-NNN CABADRIVE_HOST_PORT=<free-port> make up
make down
git diff --check
```

Implementation Agent may substitute a newer focused checker/test name created by the shared prerequisite PR, but must record the exact command and result.

## Cleanup Planning

- Cleanup applicability: not applicable for this planning and implementation cycle unless Orchestrator later assigns cleanup.
- Cleanup Agent assignment: not applicable.
- Approved cleanup roots: none.
- Excluded/current work: all current Orchestrator/Analyst/Architect/Implementation/Review worktrees, sibling work, root main worktree, untracked root files, active PR branches, user-owned paths, and ambiguous targets.
- Required validation: if cleanup is later assigned, Cleanup Agent must perform positive-proof validation before removal.
- Refusal conditions: current, active, dirty, untracked, unpushed, open-PR, locked, running-process, ambiguous, user-owned, out-of-root, missing-check, or PR-lookup-failure targets are preserved.
- Evidence handoff: not applicable unless Cleanup Agent is assigned.

## Risks

- 36 page PRs plus a prerequisite PR create coordination overhead. Mitigation: sequential default merge order and explicit cycle PR set.
- Visual assets may require careful crop cleanup. Mitigation: strict source-region metadata, screenshots, and checker fail cases.
- Legal/document pages may be over-simplified. Mitigation: detail-retention checks and Review Agent legal/content focus.
- Shared infrastructure changes after page PRs merge can invalidate earlier visual validation. Mitigation: prerequisite-first architecture and final current-head guard.
- Existing legacy manual layout code may tempt reuse of full-page raster/mask patterns. Mitigation: explicit forbidden-pattern tests and review requirements.
