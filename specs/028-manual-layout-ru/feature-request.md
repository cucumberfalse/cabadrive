# Feature Request: Russian Manual Web Layout Correction

## Intake Metadata

- Feature ID: `028-manual-layout-ru`
- Intake role: Analyst
- Assigned worktree: `/Users/chap/devel/cabadrive-worktrees/028-manual-layout-ru`
- Assigned branch: `codex/028-manual-layout-ru`
- Verified base provided by Orchestrator: `origin/main` at `c6e3c34d93bd63a0836c148ccfc5d0e32375a930`
- Prior related merged PR: `#170`, merge commit `c6e3c34d93bd63a0836c148ccfc5d0e32375a930`
- Parallel-work warning: parallel work may exist; sibling worktrees, branches, commits, PRs, dirty diffs, and process memory must be preserved.
- Intake artifact scope: this Analyst intake creates only this `feature-request.md`; Architect-owned `spec.md`, `plan.md`, and `tasks.md` are intentionally not created by Analyst.

## Original Corrective Request

User correction after PR `#170`:

> сделано не по тз, я просил сохранить полностью структуру документа, включая картинки и верстку, но в веб версии вместо пдф и на русском

Additional UI bug report:

> еще вот тут все смазано, нужно исправить

Additional navigation clarification:

> тут нужно сделать осмысленную навигацию, а не просто постраничную

The user attached screenshots showing:

- The current manual reader displays an original Spanish page image on the left and a separate plain Russian translation card on the right. This does not preserve the document layout in Russian.
- The manual page list on mobile is visually broken: rows overlap vertically, text is clipped/smeared, and page-number blocks collide with neighboring list items.
- The mobile page-list problem is visible again around pages `114`-`123`, and the flat 200-page list is not an acceptable primary navigation model by itself.

## Source Material and Existing Context

- Canonical source PDF remains `content/official-documents/originals/gcba-manual-vehiculo-4-ruedas-2023.pdf`.
- Prior feature `027-manual-vehiculo-4ruedas-ru` established that the user-provided PDF is byte-identical to the repository archive:
  - SHA-256: `69c6e1c582db4f96337fc13db09fffab26f9ce6364279c6beb2abc21d9ad3e8e`
  - Page count: `200`
- Current merged feature `027` provides a dedicated `Руководство 4R` surface, page-faithful Spanish PDF page JPEGs, and page-aligned Russian text.
- The corrective request clarifies that this is not sufficient: the expected result is not a side-by-side source image plus separate translation text, but a web-rendered Russian version of the manual that preserves the original document's structure, composition, images, and layout as closely as feasible.
- Existing project constraints still apply:
  - local-first static web app
  - no runtime backend
  - no runtime PDF iframe/embed/object/PDF.js viewer
  - official Spanish source traceability remains required
  - Russian text remains learning support unless an official Russian source is later proven

## Requested Outcome

Correct the complete manual experience so the 200-page `MANUAL_Vehiculo_4Ruedas_2023 SA.pdf` is available on the site as a Russian web version that preserves the document structure, layout, page order, visual hierarchy, and all images/diagrams/tables as closely as feasible without using a runtime PDF viewer.

The result must be complete, not an MVP, sample, prototype, partial conversion, or test-only version. It must not simplify, summarize, omit, condense, or editorially replace the source content.

The mobile manual page list must also be fixed so page entries render cleanly without overlap, clipping, smeared text, or colliding page-number blocks.

The corrected manual reader must provide meaningful navigation by the manual's own document structure, such as sections, chapters, headings, topics, or table-of-contents groupings. Page-level access may remain, but users must not be forced to navigate the complete manual only through a flat 200-page list.

## Scope

- Rework the `Руководство 4R` manual surface so the Russian translation is integrated into a document-like web layout rather than displayed as a separate plain text translation beside the Spanish source page image.
- Preserve the complete 200-page manual.
- Preserve original page order and page-level structure.
- Add meaningful document-structure navigation derived from the manual itself, not only a flat page-by-page list.
- Keep direct page access where useful, but make semantic navigation by section/chapter/topic/table-of-contents structure available and usable.
- Preserve the document's layout/composition as closely as feasible in web form:
  - headings
  - subheadings
  - body text blocks
  - images
  - diagrams
  - tables
  - icons
  - captions
  - callouts
  - footnotes
  - page-level visual hierarchy and relative placement
- Preserve all images and visual content with crisp local assets.
- Keep exact/full Russian translation, with no simplification, no omissions, and no summary replacement.
- Keep official Spanish source traceability and validation evidence.
- Fix the mobile manual navigation/list layout so all visible rows are readable, stable, and non-overlapping.
- Ensure the mobile manual navigation UI remains readable and non-overlapping both for semantic navigation and any retained page-level list.
- Update durable project documentation if implementation changes manual UI behavior, content/layout strategy, asset generation, validation, or local/offline runtime expectations.

## Out of Scope for This Intake

- Analyst does not choose the technical architecture for page reconstruction, overlaying, OCR/layout extraction, HTML/CSS page templates, or any other implementation strategy.
- Analyst does not create implementation tasks, technical plan, code, tests, runtime assets, validators, documentation updates outside this intake artifact, commits, pushes, PRs, or reviews.
- Analyst does not inspect or translate the full PDF during intake.
- This intake does not request changing the current practice-question content mode or making the fallback ticket bank official.

## Acceptance Expectations

- The `Руководство 4R` site surface shows the complete manual as a Russian web-rendered document, not as an original Spanish page image next to a separate plain translation card.
- All 200 pages/content units from the official source manual are represented.
- The Russian text is placed within a document-like layout that follows the original page structure and visual hierarchy as closely as feasible.
- Original images, diagrams, icons, tables, and other visual elements are preserved locally and render crisply in the Russian web version.
- Page order, section order, headings, captions, table relationships, callouts, and footnotes are not lost or rearranged in a way that changes study meaning.
- The manual reader offers meaningful navigation by the document's own structure: sections, chapters, headings, topics, table-of-contents entries, or an equivalent semantic grouping derived from the source manual.
- Direct page navigation/search can remain, but it is secondary or complementary; the complete manual is not navigable only as an undifferentiated 200-page list.
- The Russian translation is complete and exact: no simplification, no omissions, no summaries, no MVP/sample placeholders, and no intentionally untranslated source text.
- The solution does not use a runtime PDF iframe, browser PDF viewer, `object`/`embed` PDF display, PDF.js-style runtime PDF rendering, remote image dependency, backend endpoint, or live AI request.
- The official Spanish PDF remains traceable by source document ID, path/hash/page metadata, or equivalent visible/provenance metadata.
- The mobile page list/navigation renders without overlap, clipping, smeared rows, hidden row text, or page-number block collisions across representative mobile viewport sizes.
- The mobile navigation UI around dense page ranges such as pages `114`-`123` is specifically verified to be readable, stable, and non-overlapping.
- All manual images and rendered visual assets are local/static and support the existing local-first/offline build model.
- Verification evidence should demonstrate:
  - 200/200 manual coverage
  - translation coverage
  - document-structure navigation coverage
  - visual/layout preservation coverage
  - image asset crispness/coverage
  - absence of runtime PDF viewer/network/backend/live-AI dependencies
  - fixed mobile list layout with representative screenshot or automated visual/layout assertions

## Negative Scenarios

- Shipping the current side-by-side Spanish page image plus separate Russian translation card as the final corrected result.
- Showing only a text-only Russian translation with images nearby but not integrated into the page/document structure.
- Rendering a PDF or PDF-derived viewer at runtime and calling it a web version.
- Preserving only page screenshots while leaving the Russian translation outside the document layout.
- Converting only selected pages, representative samples, first pages, or an MVP subset.
- Keeping low-resolution or blurry images when crisper local assets are feasible.
- Letting mobile page list rows overlap, clip, smear, or hide page titles/subtitles.
- Providing only a flat 200-page list with no section/chapter/topic/table-of-contents navigation.
- Treating search alone as a substitute for meaningful document-structure navigation.

## Assumptions

- The canonical PDF from feature `027` remains the source of truth for all 200 pages.
- The user's phrase "в веб версии вместо пдф и на русском" means a site-native Russian rendering of the manual, not a browser PDF viewer and not a static PDF embed.
- Exact translation content already produced or approved in feature `027` may be reused only if it still satisfies full-source coverage and can be integrated into the layout-preserving Russian web presentation.
- Spanish source page images can remain available for traceability or comparison if useful, but they do not by themselves satisfy the corrected requirement.
- The mobile list bug is part of the same corrective work because it affects the newly delivered manual surface.
- Meaningful navigation should be derived from the manual's real structure where possible, using source table-of-contents entries, headings, sections, chapters, or equivalent document evidence rather than arbitrary page buckets.
- Architect should decide the feasible implementation strategy and the validation standard for "as closely as feasible" layout preservation, while keeping the user's complete-structure intent central.

## Risks

- Full layout preservation for 200 pages is materially more demanding than page-aligned plain text and may require structured layout data, page templates, OCR/layout extraction, manual QA, or generated per-page web artifacts.
- There is a risk of translation/layout drift if Russian text length differs substantially from Spanish while trying to preserve page composition.
- Tables, icons, captions, and diagram labels may need special handling to avoid losing meaning or breaking visual alignment.
- Building semantic navigation may require extracting, validating, or manually curating the manual's section/topic structure so navigation does not become arbitrary or misleading.
- Image crispness and local-first performance must be balanced without reverting to heavy install-time precache behavior that prior feature memory intentionally avoided.
- Automated validation for layout fidelity may be harder than simple page/count validation; acceptance evidence may need a combination of deterministic checks, screenshot comparison, and representative manual QA records.

## Open Questions

- No blocking clarification is required for intake; the correction is explicit enough for Architect planning.
- Architect should define the implementation approach and evidence threshold for preserving Russian page layout "as closely as feasible" while keeping all content complete.
- Architect should define the semantic navigation model and evidence threshold for proving it follows the source manual's real structure.
- Architect should decide whether any Spanish original page preview remains in the UI as optional traceability/comparison, provided the primary corrected experience is the Russian layout-preserving web manual.

## Analyst Handoff

This intake is ready for Orchestrator handoff to Architect. The corrective scope is clear: repair the manual implementation so it preserves document structure/layout in Russian web form, add meaningful source-derived document navigation beyond a flat 200-page list, and fix the mobile manual navigation/list rendering bug, while preserving local-first/static constraints and full 200-page completeness.

## Final Analyst Validation

- Analyst validation pass: passed
- Final Analyst validation completed at: 2026-05-27T11:53:02Z
- Effective content head: 47ccb4631a3001a0e7814be13d963592d07cf283
- Analyst validated effective content head: 47ccb4631a3001a0e7814be13d963592d07cf283
- Analyst return count: 0 of 5.
- Limit escalation: none; Analyst return limit not approached and no new feature request is needed.
- Evidence reviewed: Architect final validation passed first at `2026-05-27T11:50:20Z` for the same effective content head; `pnpm run validate:manual-4ruedas` independently reported `200/200 pages`, `200 layout pages`, `11 semantic sections`, `56 topics`, and `200 local page assets`; targeted manifest checks confirmed pages `1-200`, source-derived top-level navigation including the introduction, chapters, and appendices, and layout/mask data on representative pages `114` and `185`; recorded implementation evidence covers strict TypeScript, focused Node, focused Playwright, production build, full preflight, mobile pages `114-123`, full-manual source-mask provenance, same-page semantic search identity, search page-list dedupe, and absence of runtime PDF/network/backend/live-AI dependencies.
- Customer intent validation: the recorded and rechecked evidence satisfies the original correction in spirit and letter: the primary `Руководство 4R` result is a complete Russian site-native manual page layout, not a PDF or side-by-side transcript; document structure, page order, images, diagrams, tables, captions, masks/replacements, and visual hierarchy are preserved through local static layout/assets; no simplification, deletion, summary, or partial subset is recorded; mobile navigation/readability around pages `114-123` is covered; and navigation is meaningful and source-derived rather than only a flat 200-page list.
