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
- `[x]` For every page with visible source text, record masks or equivalent replacement regions so Spanish source text is not the primary visible instructional layer. Follow-up completed: masks are generated per text block rather than as one broad generic flow mask.
- `[x]` Segment each page's exact Russian translation into ordered layout blocks with stable IDs, block type, per-block bounding box, reading order, typography/fit metadata, and provenance. Follow-up completed: bounds are assigned per block from page-kind, heading/list/table/caption roles, one/two-column structure, and visual-heavy page structure rather than from one uniform splitter.
- `[x]` Record visual-only regions for images, diagrams, tables, icons, and decorative/page-composition elements that remain from the local visual base. Follow-up completed: visual regions record page-specific section art bands, sign grids, gutters, margins, and footer/page-chrome regions instead of one full-page catch-all.
- `[x]` Record page-level coverage metadata proving the ordered Russian blocks reconstruct the full existing exact translation for that page and that the recorded per-block geometry is the geometry used at runtime.
- `[x]` Add or update TypeScript types/loaders in `src/data/manual4Ruedas.ts` for the layout manifest while preserving route-level lazy loading.

### Semantic Navigation

- `[x]` Add a committed semantic navigation manifest under `content/manuals/gcba-manual-vehiculo-4-ruedas-2023/`, preferably `navigation.ru.json`, or equivalent validated manifest fields.
- `[x]` Derive top-level navigation from source index pages `11-12` / PDF pages `12-13`.
- `[x]` Include front matter, `Введение`, chapters 1-5, appendices I-IV, and source-derived child topics.
- `[x]` Store stable IDs, Russian titles, Spanish/source titles when available, levels, start/end pages, source evidence, and children.
- `[x]` Validate printed-page to PDF-page mapping against existing manifest page labels/headings.
- `[x]` Make semantic navigation the primary manual navigation in the UI, preserving the exact selected topic identity even when sibling topics share the same start page.
- `[x]` Keep direct page access/search as secondary controls, grouped or labeled by semantic section.

### Frontend Reader

- `[x]` Replace the primary side-by-side `.manual-page-grid` experience with a single Russian manual page canvas.
- `[x]` Render Russian layout blocks inside the page composition instead of displaying `translation.fullTranslationRu` as one plain paragraph/card. Follow-up completed: the renderer positions each block using that block's own bounds and no longer emits `.manual-russian-page-flow`.
- `[x]` Keep original Spanish source view, if retained, behind an optional secondary comparison/provenance control only.
- `[x]` Remove primary-reader labels such as `Перевод из approved primary-source chunk`; keep provenance compact and secondary.
- `[x]` Add previous/next controls that work within search/semantic context and across the full document.
- `[x]` Add fit-to-width behavior and, if needed, zoom controls for page readability.
- `[x]` Ensure long Russian text wraps, fits, or scales according to block metadata without overlapping neighboring blocks. Follow-up completed: per-block typography metadata drives container-relative font scale/line height and Playwright checks block overflow/overlap on representative pages.
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
- `[x]` Add validator checks that every page layout references existing local assets and has in-bounds, non-generic block/mask/visual-region coordinates tied to real page structure.
- `[x]` Add validator checks that ordered Russian text blocks reconstruct each page's `translation.fullTranslationRu` after documented whitespace normalization.
- `[x]` Add validator checks that top-level navigation includes source-index entries for `Введение`, chapters 1-5, appendices I-IV, and covers the full page range without gaps.
- `[x]` Add validator or tests that fail if manual runtime code reintroduces iframe/embed/object PDF display, PDF.js-style runtime rendering, remote manual assets, runtime fetches, backend endpoints, or live-AI calls.
- `[x]` Update Node tests for manual manifest/runtime shape, layout coverage, text coverage, semantic navigation coverage, stale manifest failure cases, and generic-layout failure cases.
- `[x]` Update Playwright tests so the old side-by-side Spanish visual plus separate Russian translation card is absent from primary UI.
- `[x]` Add Playwright desktop coverage for first page, index pages, an image/diagram-heavy page, Appendix I, Appendix II around pages `114`-`123`, Appendix IV signs, and final pages, including evidence that multiple Russian blocks are independently placed from their own layout bounds.
- `[x]` Add Playwright mobile coverage for semantic navigation, secondary page list rows, and the page canvas around pages `114`-`123` with bounding-box no-overlap assertions for independently positioned blocks.
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

- `[x]` Primary `Руководство 4R` renders a Russian page-layout-preserving web manual, not a Spanish screenshot beside a Russian text card. Follow-up implementation now drives runtime placement from per-block bounds.
- `[x]` All 200 source pages/content units are represented in layout data and runtime UI.
- `[x]` Exact Russian translation remains complete with no simplification, omission, summary, or placeholder content.
- `[x]` Images, diagrams, tables, icons, captions, callouts, labels, footnotes, page numbers, and page visual hierarchy remain present locally as structured page composition rather than a full-page visual catch-all plus one text flow.
- `[x]` Source-derived semantic navigation is available for front matter, introduction, chapters, appendices, and child topics, and same-page sibling topics keep the selected topic highlighted/labeled.
- `[x]` Flat page navigation/search is secondary and does not remain the only way to browse the manual.
- `[x]` Mobile navigation, page rows, and mobile page canvas are readable and non-overlapping, including pages `114`-`123`, after the independently positioned layout fix.
- `[x]` Runtime uses no PDF viewer, runtime PDF rendering, remote manual asset, backend endpoint, live AI request, or runtime network fetch for manual content/assets.
- `[x]` Deferred-loading and on-demand runtime caching decisions from feature `027` remain intact.
- `[x]` Validators, tests, docs, and process memory are complete for the corrected per-block layout architecture.
- `[x]` Review findings are disposed by Architect before follow-up implementation; follow-up fixes are implemented and remain subject to Review Agent/Orchestrator verification.
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

- No implementation-known product issues remain after the accepted P1 layout follow-up and accepted P2 same-page semantic topic identity follow-up. Review Agent and Orchestrator verification remain pending.

## Implementation Agent Feedback

- None yet.

## Implementation Decisions And Evidence

- The implementation evidence below is preserved as historical evidence for PR `#172` head `5f9a61301bdf52dff1c3da6bbea265559447854b`, but it is superseded for layout-preservation acceptance by the blocking Review Agent findings disposed below.
- Added committed derived manifests: `layout.ru.json` contains 200 page layout records with canvas metadata, source-text masks, visual preservation regions, ordered Russian blocks, bounds, typography/fit metadata, provenance, and reconstruction hashes; `navigation.ru.json` contains 11 top-level source-derived sections and 56 child topics from index pages 11-12 plus page-heading review.
- Runtime manual loading remains behind `import("./data/manual4Ruedas")`; non-manual startup still defers the manual chunk, and service-worker install precache exclusions for the manual data chunk and 200 page images remain covered by existing tests/build.
- The primary UI now renders `manual-page-canvas` / `manual-page-russian-layout`; validator scans block `.manual-page-grid`, `.manual-visual`, and `.manual-translation` from returning to the manual runtime source.
- Focused validation passed: `pnpm run validate:manual-4ruedas` -> `Manual 4 ruedas RU validated: 200/200 pages, 200 layout pages, 11 semantic sections, 56 topics, 200 local page assets, 198 approved reused translations, 2 visual-label translation pages.`
- Focused Node tests passed: `node --test tests/content-manual-vehiculo-4ruedas.test.mjs` -> 8/8 tests passed.
- Build passed: `pnpm run build` -> content validation, asset sync, Vite build, and service-worker generation completed; manual chunk remained a deferred `manual4Ruedas-*.js` asset.
- Focused Playwright passed: `pnpm exec playwright test tests/e2e/app.spec.ts -g "complete RU manual" --project=chromium` -> 3/3 tests passed, including semantic navigation, old split UI absence, local-only manual requests, and mobile bounding-box no-overlap checks for pages 114-123.
- Full preflight passed: `pnpm run preflight` -> feature memory gate, repository checks, content validation, Node test suite, production build/service-worker generation, and full Playwright suite completed; E2E reported 58/58 tests passed.
- Browser plugin sanity check against built preview at `http://127.0.0.1:5178/` confirmed `canvasCount: 1`, `oldGridCount: 0`, and page 14 Russian layout text in the primary manual detail.
- Follow-up layout generation replaces uniform flow splitting with per-block absolute boxes, per-block source-text masks, and non-full-page visual regions. Validators now fail on uniform synthetic block geometry, single generic scrolling text regions, broad one-mask replacement, full-page-only visual catch-all regions, stale block typography fit, runtime `.manual-russian-page-flow`, or renderer source that does not call `manualBoundsStyle(block.bounds)`.
- Follow-up runtime rendering uses `manual-page-russian-layout` as an absolute layer and renders each `manual-layout-block` with its own `block.bounds`, `fontScale`, and `lineHeight`; preserved visual regions are exposed as page metadata/DOM regions for regression checks.
- Follow-up focused validation passed: `pnpm run validate:manual-4ruedas` -> `Manual 4 ruedas RU validated: 200/200 pages, 200 layout pages, 11 semantic sections, 56 topics, 200 local page assets, 198 approved reused translations, 2 visual-label translation pages.`
- Follow-up focused Node tests passed: `node --test tests/content-manual-vehiculo-4ruedas.test.mjs` -> 9/9 tests passed, including generic flow geometry and full-page catch-all rejection.
- Follow-up focused Playwright passed after production build: `pnpm exec playwright test tests/e2e/app.spec.ts -g "complete RU manual"` -> 6/6 tests passed across desktop and mobile, including absolute block placement, overflow/overlap checks, preserved visual-region non-overlap, old flow absence, and mobile pages 114-123.
- Follow-up Browser sanity check against built preview at `http://127.0.0.1:5178/` confirmed `canvasCount: 1`, `layoutBlockCount: 3`, `absoluteBlocks: true`, `distinctBoxes: 3`, `visualRegionCount: 2`, `oldFlowCount: 0`, and `oldSplitCount: 0` on page 14.
- Follow-up full preflight passed: `pnpm run preflight` -> feature memory gate, repository checks, content validation, 288/288 Node tests, production build/service-worker generation, and 58/58 Playwright tests completed.
- Same-page semantic topic identity follow-up stores the selected semantic navigation entry by stable ID and uses page-only lookup only as a fallback. Direct topic clicks pass the clicked entry ID into page selection, and previous/next page controls preserve the current semantic entry while the destination page remains inside that entry's page range.
- Static Node coverage now verifies the runtime source keeps selected-entry state and page-coverage checks, and verifies the committed same-page sibling pair `ch4-stress` and `ch4-distractions` both start on page `95`.
- Same-page semantic topic Playwright coverage now clicks `ch4-stress` and `ch4-distractions` in the complete RU manual flow and verifies both remain selectable on page `95` with the correct selected-topic label and active-row highlight.
- Same-page semantic topic focused Node tests passed: `node --test tests/content-manual-vehiculo-4ruedas.test.mjs` -> 9/9 tests passed.
- Same-page semantic topic focused Playwright passed after production build: `pnpm exec playwright test tests/e2e/app.spec.ts -g "complete RU manual surface"` -> 2/2 tests passed across desktop and mobile.
- Same-page semantic topic validation passed: `pnpm run validate:manual-4ruedas` -> `Manual 4 ruedas RU validated: 200/200 pages, 200 layout pages, 11 semantic sections, 56 topics, 200 local page assets, 198 approved reused translations, 2 visual-label translation pages.`
- Same-page semantic topic full preflight passed: `pnpm run preflight` -> feature memory gate, repository checks, content validation, 288/288 Node tests, production build/service-worker generation, and 58/58 Playwright tests completed.

## Architect Disposition Of Review Findings

- `PRRT_kwDOSX65IM6E_DSH` (`src/App.tsx:1491`, review `4369149578`): accepted as blocking P1. The renderer violates the spec because it maps every `layout.blocks` entry into a single `.manual-russian-page-flow`, so each block's own `bounds` do not drive placement. Follow-up task: Implementation Agent must render each Russian layout block as an independently positioned page element using that block's `bounds`, typography, fit metadata, and reading-order/provenance data. A flow container may exist only as a page canvas/layer; it must not be the mechanism that collapses all translated content into one scrolling text stream.
- `PRRT_kwDOSX65IM6E_DSL` (`scripts/content-manual-vehiculo-4ruedas.mjs:687`, review `4369149578`): accepted as blocking P1. The generated layout data violates the spec because block geometry is synthetic uniform splitting (`boundsWithinRegion`) and visual preservation is represented by a generic full-page region/mask pattern rather than page-specific document structure. Follow-up task: Implementation Agent must replace the generator/manifest data with page-specific block bounds, masks, and visual regions derived from real page structure or curated against the rendered pages. Generic one-flow regions, one full-page visual catch-all, and coordinates that merely divide the transcript evenly are not acceptable.
- `PRRT_kwDOSX65IM6E_DXO` (`src/App.tsx`, current review head `c9f82a422db76009e28e3fa8b9cc5592f7843438`): accepted as blocking P2 implementation follow-up. The feature requires meaningful semantic navigation, not only page navigation. If a user clicks a topic whose `startPage` is shared with a sibling, such as `ch4-distractions` sharing page `95` with `ch4-stress`, the UI must preserve the clicked topic's stable ID for active-row highlighting, section labels, and previous/next semantic context. Recomputing `selectedSemanticEntry` only from the selected page is insufficient because it collapses distinct same-page topics to the first matching entry.

## Follow-Up Implementation Requirements

- Layout generation must stop treating `translation.fullTranslationRu` as a transcript to be evenly divided through one flow region. Each page must have a reviewable set of block bounds matching visible document structure: headings, body paragraphs, bullet/list items, table cells, captions, callouts, labels, footnotes, and page numbers.
- Runtime rendering must apply `manualBoundsStyle(block.bounds)` or equivalent per block. Tests or static validation must fail if the renderer maps all blocks into one unpositioned parent flow or ignores `block.bounds`.
- Manifest validation must fail when a page's text blocks are generated by uniform vertical splitting, when all or most text blocks share a single generic region without page-specific geometry, or when a text-bearing page declares only a full-page visual region instead of meaningful preserved visual/non-text regions.
- Node tests must include negative fixtures or mutation checks for generic flow bounds, full-page-only visual regions, and renderer/source patterns that ignore per-block bounds.
- Playwright coverage must verify, on representative pages including page `14` and pages `114`-`123`, that multiple Russian blocks have distinct in-page bounding boxes and do not overlap each other or preserved visual regions on desktop and mobile.
- Existing successful validation/preflight evidence may be reused only after the above fixes are implemented and rerun; the previous pass does not satisfy the layout-preservation acceptance criteria by itself.
- Same-page semantic topic selection must store or derive the selected navigation entry by stable entry ID, not by page number alone. Implementation Agent may keep both selected page and selected entry ID in state, or may pass the clicked entry through a lookup that is aware of the requested entry. Browser history/permalink behavior, if touched, must preserve backwards-compatible page access while allowing topic-specific selection when an entry ID is available.
- Runtime behavior must be verified with at least one same-page sibling pair from the committed navigation manifest, including `ch4-stress` and `ch4-distractions` on page `95`. Clicking the later sibling must open the correct page while highlighting and labeling the later sibling, not the first sibling for that page.
- Tests must include a regression check for same-page semantic topic identity. Prefer Playwright coverage in the complete RU manual flow plus a focused unit/Node test for the navigation lookup helper if one exists or is introduced. Existing navigation and page-search tests should continue proving direct page access remains available as secondary navigation.

## Review Requirements

- Review Agent must verify the corrected UI is not a cosmetic restyle of the feature `027` two-column transcript reader.
- Review Agent must verify semantic navigation is source-derived and validated.
- Review Agent must verify layout/text validators fail on missing layout coverage, missing text coverage, stale navigation, or runtime PDF/network dependency regressions.
- Review Agent must verify mobile no-overlap evidence covers pages `114`-`123`.
- Review Agent must verify process memory and durable docs were updated.

## Cycle PR Set

- Implementation PR slice: PR `#172` on branch `codex/028-manual-layout-ru`, current reviewed head before the P2 follow-up was `c9f82a422db76009e28e3fa8b9cc5592f7843438`, based on verified `origin/main` at `c6e3c34d93bd63a0836c148ccfc5d0e32375a930`. Included in final validation only after accepted blocking review findings are fixed and re-reviewed.

## Final Validation Evidence

- Current final-validation status: accepted P1 layout findings and accepted P2 same-page semantic topic identity finding have follow-up implementation evidence recorded above; Review Agent/Orchestrator verification remains pending before final validation.
- Architect return count: 0.
- Limit escalation: none.
- Effective content head: pending implementation.
- Architect validated effective content head: pending implementation.
- Analyst validated effective content head: pending implementation.
