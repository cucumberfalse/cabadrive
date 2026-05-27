# Implementation Plan: Layout-Preserving Russian Manual Reader

## Summary

Replace the current transcript-style manual reader with a layout-preserving Russian document reader. The implementation should keep the proven feature `027` source/translation/asset foundation, then add structured page-layout data, semantic navigation, validators, and responsive UI that renders each manual page as a Russian web page with the original visual composition preserved.

## Architecture

### 1. Preserve Feature 027 Foundations

- Keep `content/official-documents/originals/gcba-manual-vehiculo-4-ruedas-2023.pdf` as the canonical source.
- Keep the existing 200 local page-faithful JPEG assets as visual source assets unless a better local generated layer is added.
- Keep the exact Russian translation corpus from `content/manuals/gcba-manual-vehiculo-4-ruedas-2023/manual.ru.json`.
- Preserve the existing deferred-loading and service-worker decisions: the manual corpus and 200 page images are not install-time precached, but local static assets and successful runtime GET caching remain available when the manual view opens.

### 2. Add Layout Manifest

Add a production layout manifest under `content/manuals/gcba-manual-vehiculo-4-ruedas-2023/`, preferably `layout.ru.json`.

The layout manifest should be lazy-loaded with the manual view and should define:

- Document/canvas metadata.
- One layout record per page.
- Page visual base reference.
- Masks for visible Spanish text and caption regions, using source-region geometry rather than destination Russian block geometry.
- Ordered Russian text blocks with page-relative positions.
- Visual-only regions that preserve original images, diagrams, tables, and icons.
- Per-block provenance and fit strategy.
- Per-page coverage metadata.

The manifest may be produced by a helper script plus curated review. If generation is used, generated outputs must be committed and validators must detect stale generation. The implementation must not depend on runtime PDF parsing.

### 3. Add Semantic Navigation Manifest

Add `navigation.ru.json` or equivalent manifest fields for document-structure navigation.

Build the top-level structure from the source index content already present on PDF pages `12-13` / printed pages `11-12`. Include front matter, introduction, chapters, appendices, and child topics. Use page-heading evidence to refine child ranges where the source index only names a topic without an explicit page.

The navigation model should be consumed by the UI and validators. It must not be a hard-coded React-only list hidden from validation.

When runtime code derives the current semantic topic from a page-only action such as search, direct page entry, previous/next, or a restored URL without a preserved entry ID, it must prefer a child topic whose `startPage` exactly equals the selected page before falling back to the first topic whose range covers the page. This is required for overlapping ranges such as `ch4-sleep-fatigue` covering pages `93-94` and `ch4-stress` starting on page `94`; page `94` must label/highlight as `Стресс` for direct page selection.

Previous/next navigation must also apply the exact-start rule before preserving an existing covering entry. If the current selection is page-only page `93` under `ch4-sleep-fatigue` and the learner advances to page `94`, the destination page has a more specific exact-start child (`ch4-stress`), so the UI must switch the selected semantic label/highlight to `ch4-stress` / `Стресс` rather than preserving `ch4-sleep-fatigue`. Preserving a prior entry is acceptable only when the destination page has no more specific exact-start topic.

Manual search must index and return semantic entry identity separately from page identity. When a query matches a navigation topic or page text associated with a specific topic, the result must retain the matching entry ID and pass that ID through click/open behavior. Same-page topics must therefore produce distinct results or result metadata even when their `startPage` is identical; searching for `ch5-gender-violence-prevention` on page `100` must label/highlight/open that topic, not the first same-page topic `ch5-equal-society`.

### 4. Refactor Manual Runtime UI

Refactor `Manual4RuedasView` in `src/App.tsx` or split it into purpose-built manual components under `src/` following local patterns.

Required UI changes:

- Replace `.manual-page-grid` side-by-side visual/translation layout with a single page reader.
- Render a page canvas using the layout manifest.
- Display Russian text blocks inside the page composition.
- Keep provenance compact and secondary.
- Add semantic table-of-contents navigation as the primary manual navigation.
- Keep search and page number jump as secondary controls.
- Fix mobile navigation and retained page list layout with auto-height rows, stable page-number columns, and no clipped secondary text.

The old `.manual-translation` primary card and status labels such as `Перевод из approved primary-source chunk` should disappear from the primary reading experience. Provenance may remain in compact metadata or details.

### 5. Validation and Tooling

Extend `scripts/content-manual-vehiculo-4ruedas.mjs` or add a focused layout validator that is invoked by `pnpm run validate:manual-4ruedas` and `pnpm run validate:content`.

Validation should cover:

- Existing source hash/page/asset/translation checks from feature `027`.
- Presence of 200 layout page entries.
- Ordered page layout records from 1 through 200.
- Every layout page references an existing local visual base.
- Every translated page has at least one layout block or an explicit visual-only/label-only representation.
- Ordered text from layout blocks reconstructs `translation.fullTranslationRu` for the page after documented whitespace normalization.
- Required block types cover headings, body text, lists, captions, tables, callouts, footnotes, labels, and page numbers where present.
- Mask and text block bounds are within the page canvas.
- Mask geometry is source-text/source-caption geometry or a structured/precomposed Russian replacement region across the full 200-page manual. Validators must fail any destination-Russian-block-derived mask that lacks source-text/source-caption provenance, even outside Appendix IV and even if the destination Russian block happens to overlap part of the hidden source text.
- Non-Appendix validation must include representative body, list, table, caption, diagram/infographic, and callout pages, proving masks/provenance come from source visual text regions or structured/precomposed Russian replacements rather than translated block placement. Appendix IV visual-heavy pages remain required explicit mask/coverage checks, including page `185`, so sign headings and captions from the Spanish source image are not visible in the primary Russian reader.
- Text blocks do not use placeholder strings, summary markers, or intentionally untranslated Spanish body text.
- Navigation ranges cover the full document, are ordered, and include the top-level source-index entries.
- Runtime source scan still blocks PDF viewer/runtime PDF rendering/remote/manual network/backend/live-AI patterns.
- TypeScript strictness is verified with `pnpm exec tsc --noEmit` if available in this repo, or through the equivalent local preflight/build type-check command if standalone `tsc` is not wired.

### 6. Testing

Add focused Node tests for validators and manifest shape.

Update Playwright tests for:

- Primary `Руководство 4R` page opens and renders the Russian layout page.
- Representative first, index, infographic/image-heavy, table/list, pages `114`-`123`, Appendix IV, and final pages render from local assets.
- Representative non-Appendix pages and Appendix IV sign pages prove source Spanish headings/captions/body text are masked or replaced in the primary Russian canvas using source-provenance validation plus visual/pixel/text coverage, not merely covered by newly placed Russian labels. Page `185` remains a required Appendix IV regression target.
- The old side-by-side `.manual-visual` plus `.manual-translation` primary layout is absent.
- Semantic navigation opens named sections/topics and updates the page.
- Search results are grouped/labeled by semantic section and preserve distinct same-page entry IDs, with a regression for `ch5-gender-violence-prevention` on page `100` not collapsing to `ch5-equal-society`.
- Mobile navigation and secondary page list rows do not overlap. Use bounding-box assertions, not only text visibility.
- No external/manual PDF/backend/live-AI requests occur.
- Type-check verification covers nested handler narrowing, including the manual navigation manifest path, so `navigation` is narrowed/captured before handler functions use it.

Keep existing tests for deferred manual loading and service-worker manual asset exclusions, updating selectors as needed.

### 7. Documentation

Update durable docs after implementation:

- `docs_project/project/frontend/frontend-docs.md`: describe the layout-preserving Russian manual reader, semantic navigation, and primary UI behavior.
- `docs_project/screens/learning-and-exam-flows.md`: update the `Руководство 4R` flow from page-by-page transcript reader to semantic document navigation plus Russian page canvas.
- `docs_project/project/backend/backend-docs.md`: document new layout/navigation manifest tooling and validation.
- `docs_project/project/feature-inventory.md`: update the current manual feature description.

## File Areas for Implementation Agent

Implementation is expected to touch these areas:

- `content/manuals/gcba-manual-vehiculo-4-ruedas-2023/`
- `src/data/manual4Ruedas.ts`
- `src/App.tsx` and/or new manual components under `src/`
- `src/styles.css`
- `scripts/content-manual-vehiculo-4ruedas.mjs` and possibly a new generation/validation helper
- `tests/content-manual-vehiculo-4ruedas.test.mjs`
- `tests/e2e/app.spec.ts`
- `docs_project/project/frontend/frontend-docs.md`
- `docs_project/screens/learning-and-exam-flows.md`
- `docs_project/project/backend/backend-docs.md`
- `docs_project/project/feature-inventory.md`
- `specs/028-manual-layout-ru/tasks.md`

Implementation should avoid touching unrelated practice-question, exam, materials, or source-reader behavior except where shared styles/components require narrowly scoped responsive fixes.

## Navigation Rationale

The source manual already contains a usable document structure in its index. Using that index avoids arbitrary page buckets and directly satisfies the user's request for meaningful navigation.

The top-level ranges should map printed page references to PDF page records using the existing page-label evidence. For the current PDF, printed page `13` corresponds to PDF page `14`, printed page `20` to PDF page `21`, and so on. Validators should cross-check this mapping instead of relying on a silent magic offset.

## Layout Rationale

The user asked for the web version to preserve document structure, pictures, and layout in Russian. A plain transcript cannot satisfy that. Reconstructing every page as structured DOM/SVG over local visual assets gives the closest practical static-web result:

- It keeps all original visual material local.
- It avoids runtime PDF rendering.
- It lets Russian text live inside the document layout.
- It keeps text coverage testable.
- It supports accessibility/search better than a raster-only translated page image.

## Performance and Offline Rationale

Continue the feature `027` performance decision: do not install-precache the heavy manual corpus or all page images on first app load. The manual remains local-first because all assets are committed and served by the static app; runtime caching can store them after the learner opens the manual.

The new layout/navigation manifests should remain lazy-loaded with the manual route so normal trainer startup does not pay the complete manual cost.

## Risks and Mitigations

- Russian text is often longer than Spanish: require per-block fit strategies, no-overlap validation, and representative visual QA.
- Fully automated PDF layout extraction may be imperfect: allow committed curated layout data, but require validators and reviewable provenance.
- Masking source text could hide nearby visuals: require visual-region review and representative screenshot evidence for image/table-heavy pages.
- Large layout manifests could increase manual chunk size: lazy-load the manual route and keep service-worker install precache exclusions.
- Semantic navigation ranges may drift from page headings: validate against source index pages and representative page headings.

## Implementation Agent Guidance

- Work only in the Orchestrator-assigned implementation worktree/branch/PR slice.
- Preserve sibling worktrees, branches, commits, PRs, dirty diffs, and process memory.
- Keep `specs/028-manual-layout-ru/tasks.md` current with evidence, decisions, dead ends, and Implementation Agent feedback.
- Do not silently reduce scope to a subset of pages or representative samples.
- Do not reintroduce PDF viewer behavior or runtime network dependencies.
- Record any infeasible page/layout issue as Implementation Agent feedback for Architect disposition rather than shipping an untracked exception.
