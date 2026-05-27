# Tasks: Layout-Preserving Russian Manual Reader

## Status Legend

- `[ ]` Not started
- `[~]` In progress
- `[x]` Complete

## Architect Task State

- `[x]` Read Analyst intake for feature `028`.
- `[x]` Review relevant durable docs and feature `027` memory.
- `[x]` Inspect current merged manual reader enough to identify the side-by-side layout, flat page list, and mobile row-overlap risk.
- `[x]` Create `spec.md`.
- `[x]` Create `plan.md`.
- `[x]` Create implementation-ready `tasks.md`.

## Implementation Tasks

### Layout Data Foundation

- `[x]` Confirm the canonical PDF path, SHA-256, page count, and existing 200 local page assets still match feature `027` evidence.
- `[x]` Add a committed manual layout manifest under `content/manuals/gcba-manual-vehiculo-4-ruedas-2023/`, preferably `layout.ru.json`, or equivalent validated manifest fields.
- `[x]` Ensure the layout manifest has exactly 200 ordered page layout records.
- `[x]` For every page, record canvas dimensions/aspect ratio tied to the existing local page asset dimensions.
- `[x]` For every page, record the local visual base asset or generated local visual layer used to preserve images/diagrams/tables/icons.
- `[x]` For every page with visible source text, record masks or equivalent replacement regions so Spanish source text is not the primary visible instructional layer.
- `[x]` Segment each page's exact Russian translation into ordered layout blocks with stable IDs, block type, bounding box, reading order, typography/fit metadata, and provenance.
- `[x]` Record visual-only regions for images, diagrams, tables, icons, and decorative/page-composition elements that remain from the local visual base.
- `[x]` Record page-level coverage metadata proving the ordered Russian blocks reconstruct the full existing exact translation for that page.
- `[x]` Add or update TypeScript types/loaders in `src/data/manual4Ruedas.ts` for the layout manifest while preserving route-level lazy loading.

### Semantic Navigation

- `[x]` Add a committed semantic navigation manifest under `content/manuals/gcba-manual-vehiculo-4-ruedas-2023/`, preferably `navigation.ru.json`, or equivalent validated manifest fields.
- `[x]` Derive top-level navigation from source index pages `11-12` / PDF pages `12-13`.
- `[x]` Include front matter, `Введение`, chapters 1-5, appendices I-IV, and source-derived child topics.
- `[x]` Store stable IDs, Russian titles, Spanish/source titles when available, levels, start/end pages, source evidence, and children.
- `[x]` Validate printed-page to PDF-page mapping against existing manifest page labels/headings.
- `[x]` Make semantic navigation the primary manual navigation in the UI.
- `[x]` Keep direct page access/search as secondary controls, grouped or labeled by semantic section.

### Frontend Reader

- `[x]` Replace the primary side-by-side `.manual-page-grid` experience with a single Russian manual page canvas.
- `[x]` Render Russian layout blocks inside the page composition instead of displaying `translation.fullTranslationRu` as one plain paragraph/card.
- `[x]` Keep original Spanish source view, if retained, behind an optional secondary comparison/provenance control only.
- `[x]` Remove primary-reader labels such as `Перевод из approved primary-source chunk`; keep provenance compact and secondary.
- `[x]` Add previous/next controls that work within search/semantic context and across the full document.
- `[x]` Add fit-to-width behavior and, if needed, zoom controls for page readability.
- `[x]` Ensure long Russian text wraps, fits, or scales according to block metadata without overlapping neighboring blocks.
- `[x]` Preserve deferred manual loading so layout/navigation/manual corpus data do not enter the non-manual startup bundle.
- `[x]` Preserve service-worker install-precache exclusions for the heavy manual corpus chunk and 200 manual page images, with on-demand runtime caching still available after manual access.

### Mobile UI Fixes

- `[x]` Rework manual semantic-navigation rows and secondary page-list rows to use auto-height or stable min-height layouts that grow with multi-line titles.
- `[x]` Ensure page-number markers cannot overlap text or neighboring rows.
- `[x]` Ensure subtitles/status/provenance snippets cannot be painted under later rows.
- `[x]` Ensure mobile list/detail state hides inactive panes visually and interactively.
- `[x]` Verify the dense page range around pages `114`-`123` on representative mobile viewport sizes.
- `[x]` Capture mobile screenshot or bounding-box evidence for pages `114`-`123` showing no overlap, clipping, smearing, or page-marker collision.

### Validators and Tests

- `[x]` Extend `pnpm run validate:manual-4ruedas` to validate the layout manifest, navigation manifest, and existing feature `027` source/translation/asset checks.
- `[x]` Add validator checks that ordered page layout records cover pages 1-200 exactly once.
- `[x]` Add validator checks that every page layout references existing local assets and has in-bounds block/mask/visual-region coordinates.
- `[x]` Add validator checks that ordered Russian text blocks reconstruct each page's `translation.fullTranslationRu` after documented whitespace normalization.
- `[x]` Add validator checks that top-level navigation includes source-index entries for `Введение`, chapters 1-5, appendices I-IV, and covers the full page range without gaps.
- `[x]` Add validator or tests that fail if manual runtime code reintroduces iframe/embed/object PDF display, PDF.js-style runtime rendering, remote manual assets, runtime fetches, backend endpoints, or live-AI calls.
- `[x]` Update Node tests for manual manifest/runtime shape, layout coverage, text coverage, semantic navigation coverage, and stale manifest failure cases.
- `[x]` Update Playwright tests so the old side-by-side Spanish visual plus separate Russian translation card is absent from primary UI.
- `[x]` Add Playwright desktop coverage for first page, index pages, an image/diagram-heavy page, Appendix I, Appendix II around pages `114`-`123`, Appendix IV signs, and final pages.
- `[x]` Add Playwright mobile coverage for semantic navigation and secondary page list rows around pages `114`-`123` with bounding-box no-overlap assertions.
- `[x]` Preserve or update existing deferred-manual-loading and service-worker tests.
- `[x]` Run and record `pnpm run validate:manual-4ruedas`.
- `[x]` Run and record focused Node tests.
- `[x]` Run and record focused Playwright tests.
- `[x]` Run and record `pnpm run preflight` before implementation handoff/PR readiness.

### Documentation

- `[x]` Update `docs_project/project/frontend/frontend-docs.md` for the layout-preserving Russian manual reader and semantic navigation.
- `[x]` Update `docs_project/screens/learning-and-exam-flows.md` for the corrected `Руководство 4R` flow.
- `[x]` Update `docs_project/project/backend/backend-docs.md` for new layout/navigation manifest validation and any generation tooling.
- `[x]` Update `docs_project/project/feature-inventory.md` for the corrected manual feature.
- `[x]` Record implementation decisions, verification evidence, dead ends, and known issues in this `tasks.md`.

## Acceptance Checklist

- `[x]` Primary `Руководство 4R` renders a Russian page-layout-preserving web manual, not a Spanish screenshot beside a Russian text card.
- `[x]` All 200 source pages/content units are represented in layout data and runtime UI.
- `[x]` Exact Russian translation remains complete with no simplification, omission, summary, or placeholder content.
- `[x]` Images, diagrams, tables, icons, captions, callouts, labels, footnotes, page numbers, and page visual hierarchy remain present locally.
- `[x]` Source-derived semantic navigation is available for front matter, introduction, chapters, appendices, and child topics.
- `[x]` Flat page navigation/search is secondary and does not remain the only way to browse the manual.
- `[x]` Mobile navigation and page rows are readable and non-overlapping, including pages `114`-`123`.
- `[x]` Runtime uses no PDF viewer, runtime PDF rendering, remote manual asset, backend endpoint, live AI request, or runtime network fetch for manual content/assets.
- `[x]` Deferred-loading and on-demand runtime caching decisions from feature `027` remain intact.
- `[x]` Validators, tests, docs, and process memory are complete.
- `[ ]` Review findings are resolved or disposed by Architect before final validation.
- `[ ]` Final Architect validation passes before final Analyst validation.
- `[ ]` Final Analyst validation passes before Orchestrator completion/merge readiness.

## Initial Architect Decisions

- Use a layout-preserving page renderer rather than a transcript reader. This is required because the user's correction explicitly asks for the web version to preserve document structure, pictures, and layout in Russian.
- Keep feature `027` exact translation and local asset foundation, but do not keep feature `027` primary presentation model.
- Use the source index on printed pages `11-12` as the foundation for meaningful navigation. Page-only browsing is secondary.
- Preserve the accepted feature `027` deferred-loading/service-worker architecture: heavy manual payloads are local static assets but are not install-time precached for users who never open the manual.

## Current Evidence To Reuse

- Feature `027` established canonical PDF SHA-256 `69c6e1c582db4f96337fc13db09fffab26f9ce6364279c6beb2abc21d9ad3e8e`.
- Feature `027` established source page count `200`.
- Feature `027` committed 200 local page assets under `content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/pages/`.
- Current implementation exposes the broken/corrective target in `src/App.tsx`: `Manual4RuedasView` renders `.manual-page-grid` with `.manual-visual` and `.manual-translation`, and the page list uses 200 page buttons with long headings.
- Current CSS uses fixed/min row assumptions around `.manual-page-buttons button` that are insufficient for long mobile headings, matching the user's screenshot.
- Source index text in `manual.ru.json` lists the document structure on PDF pages `12-13`, including `Введение`, chapters 1-5, appendices I-IV, and child topics.

## Dead Ends

- Browser plugin screenshot capture timed out twice on the built preview. This did not block verification because Playwright bounding-box tests and Browser DOM state checks passed; no screenshot was required by the assigned implementation handoff.

## Known Issues

- None known for the implementation slice before review. The prior feature `027` side-by-side reader, mobile row overlap risk, and flat-primary navigation were replaced by this feature.

## Implementation Agent Feedback

- None yet.

## Implementation Decisions And Evidence

- Added committed derived manifests: `layout.ru.json` contains 200 page layout records with canvas metadata, source-text masks, visual preservation regions, ordered Russian blocks, bounds, typography/fit metadata, provenance, and reconstruction hashes; `navigation.ru.json` contains 11 top-level source-derived sections and 56 child topics from index pages 11-12 plus page-heading review.
- Runtime manual loading remains behind `import("./data/manual4Ruedas")`; non-manual startup still defers the manual chunk, and service-worker install precache exclusions for the manual data chunk and 200 page images remain covered by existing tests/build.
- The primary UI now renders `manual-page-canvas` / `manual-page-russian-layout`; validator scans block `.manual-page-grid`, `.manual-visual`, and `.manual-translation` from returning to the manual runtime source.
- Focused validation passed: `pnpm run validate:manual-4ruedas` -> `Manual 4 ruedas RU validated: 200/200 pages, 200 layout pages, 11 semantic sections, 56 topics, 200 local page assets, 198 approved reused translations, 2 visual-label translation pages.`
- Focused Node tests passed: `node --test tests/content-manual-vehiculo-4ruedas.test.mjs` -> 8/8 tests passed.
- Build passed: `pnpm run build` -> content validation, asset sync, Vite build, and service-worker generation completed; manual chunk remained a deferred `manual4Ruedas-*.js` asset.
- Focused Playwright passed: `pnpm exec playwright test tests/e2e/app.spec.ts -g "complete RU manual" --project=chromium` -> 3/3 tests passed, including semantic navigation, old split UI absence, local-only manual requests, and mobile bounding-box no-overlap checks for pages 114-123.
- Full preflight passed: `pnpm run preflight` -> feature memory gate, repository checks, content validation, Node test suite, production build/service-worker generation, and full Playwright suite completed; E2E reported 58/58 tests passed.
- Browser plugin sanity check against built preview at `http://127.0.0.1:5178/` confirmed `canvasCount: 1`, `oldGridCount: 0`, and page 14 Russian layout text in the primary manual detail.

## Review Requirements

- Review Agent must verify the corrected UI is not a cosmetic restyle of the feature `027` two-column transcript reader.
- Review Agent must verify semantic navigation is source-derived and validated.
- Review Agent must verify layout/text validators fail on missing layout coverage, missing text coverage, stale navigation, or runtime PDF/network dependency regressions.
- Review Agent must verify mobile no-overlap evidence covers pages `114`-`123`.
- Review Agent must verify process memory and durable docs were updated.

## Cycle PR Set

- Pending Orchestrator assignment. Expected implementation PR slice: feature `028` branch/worktree based on verified `origin/main` at `c6e3c34d93bd63a0836c148ccfc5d0e32375a930`, unless Orchestrator assigns a newer latest-main implementation worktree.

## Final Validation Evidence

- Current final-validation status: not started.
- Architect return count: 0.
- Limit escalation: none.
- Effective content head: pending implementation.
- Architect validated effective content head: pending implementation.
- Analyst validated effective content head: pending implementation.
