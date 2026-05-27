# Spec: Layout-Preserving Russian Manual Reader

## Role and Context

- Feature ID: `028-manual-layout-ru`
- Architect assignment worktree: `/Users/chap/devel/cabadrive-worktrees/028-manual-layout-ru`
- Branch: `codex/028-manual-layout-ru`
- Verified base provided by Orchestrator: `origin/main` at `c6e3c34d93bd63a0836c148ccfc5d0e32375a930`
- Analyst intake: `specs/028-manual-layout-ru/feature-request.md`
- Prior related feature memory: `specs/027-manual-vehiculo-4ruedas-ru/`
- Prior merged PR: `#170`, merge commit `c6e3c34d93bd63a0836c148ccfc5d0e32375a930`
- Canonical official PDF: `content/official-documents/originals/gcba-manual-vehiculo-4-ruedas-2023.pdf`
- Source evidence inherited from feature `027`: SHA-256 `69c6e1c582db4f96337fc13db09fffab26f9ce6364279c6beb2abc21d9ad3e8e`, 200 PDF pages, byte-identical to the user-provided `MANUAL_Vehiculo_4Ruedas_2023 SA.pdf`.

## Goal

Correct the `Руководство 4R` surface so it is a site-native Russian web version of the official 200-page manual, preserving the original document structure, page composition, images, diagrams, tables, captions, callouts, visual hierarchy, and page order as closely as feasible without using a runtime PDF viewer.

The corrected result must replace the current side-by-side Spanish page image plus separate Russian text card. The primary reading surface must look and behave like the manual itself in Russian, not like a source screenshot adjacent to a translation transcript.

## Non-Negotiable Product Decisions

1. The primary `Руководство 4R` experience is a Russian layout-preserving document reader.
2. The current two-column model, where a Spanish PDF render is shown beside a separate plain Russian translation card, must be removed from the primary experience.
3. Existing exact Russian translations from feature `027` may be reused, but they must be placed into page-layout blocks and validated against full per-page translation coverage.
4. Existing local page-faithful JPEG renders remain useful as visual source assets, but visible Spanish text in those renders must not be the primary instructional layer. The Russian web page must mask/replace source text areas or use generated Russian page layers so the visible document page is Russian. Masks must cover the original source text/caption geometry in the page image, not merely the destination Russian block boxes.
5. All 200 pages/content units remain in scope. No MVP, sample subset, partial conversion, summary, simplification, omission, or placeholder page is acceptable.
6. All source images, diagrams, tables, icons, labels, captions, callouts, footnotes, page numbers, and layout-sensitive relationships must remain present locally and connected to the translated page.
7. The app must not use a runtime PDF iframe, PDF embed/object, browser PDF viewer, PDF.js-style runtime renderer, remote image, backend endpoint, live AI request, or runtime network fetch for manual content/assets.
8. Navigation must be derived from the manual's real structure. A flat 200-page list may remain as a secondary tool, but it must not be the only or primary navigation model.
9. Mobile navigation/list UI must be fixed so rows and page entries never overlap, clip, smear, or collide, including the dense page range around pages `114`-`123`.
10. Official Spanish source traceability remains available, but source/provenance metadata must not dominate the primary reading layout.

## Chosen Architecture

Use a manifest-backed `layout-preserving Russian page renderer`.

Implementation must add a static layout layer for the manual that describes each PDF page as a fixed-aspect web page with ordered Russian text blocks, masks for source text regions, visual-region preservation, and page/source provenance. Runtime rendering uses HTML/CSS/SVG/React from committed local JSON/assets; it does not parse or render the PDF.

The preferred runtime page composition is:

- A fixed-ratio page canvas matching the PDF page aspect ratio (`1191x1684` from feature `027` assets).
- The existing local page render as a visual base for images, diagrams, tables, icons, decorative shapes, and other non-text visual context.
- Opaque or page-colored masks over source Spanish text and caption regions where the original render would otherwise show Spanish as the visible instructional layer. The mask geometry must come from source-text/source-caption regions or equivalent precomposed/structured Russian replacement regions, not from the placed Russian text boxes.
- Positioned Russian text blocks over those regions, using per-block typography metadata and responsive fit rules.
- Optional original-source comparison as a secondary traceability toggle only; the default/primary page must be Russian.

An implementation may additionally generate precomposed local Russian page preview assets from the same layout manifest for performance or visual regression, but the source of truth for coverage must remain structured layout data plus committed local assets. A raster-only Russian screenshot without validated text/block coverage is not sufficient.

## Required Data Model

Extend or add manual data under `content/manuals/gcba-manual-vehiculo-4-ruedas-2023/`.

Required logical artifacts:

- `manual.ru.json` remains the complete translation/source manifest from feature `027`.
- Add a layout manifest, for example `layout.ru.json`, or equivalent manifest fields that are lazy-loaded with the manual route.
- Add a navigation/structure manifest, for example `navigation.ru.json`, or equivalent manifest fields that are lazy-loaded with the manual route.

Each page layout entry must include:

- `pageNumber` and `sourcePageNumber`.
- `canvas` size/aspect metadata tied to the existing local page asset dimensions.
- Reference to the existing local page visual asset or an explicitly generated local visual layer.
- Ordered `blocks` array with stable IDs.
- For every text block: type (`heading`, `body`, `list`, `tableCell`, `caption`, `callout`, `footnote`, `pageNumber`, `label`, or equivalent), `textRu`, optional `textEs`, reading order, bounding box in page-relative units, typography/fit metadata, and provenance to the source page/chunk.
- For masks: source-region bounding box, background/fill strategy, source-text/source-caption provenance, and the source text or visual label being hidden/replaced. On visual-heavy pages, including Appendix IV sign pages, mask entries must cover sign headings, captions, and other original Spanish labels visible in the underlying page image even when the Russian replacement text is placed elsewhere.
- For visual-only regions: bounding boxes for images/diagrams/tables/icons that are intentionally preserved from the local source visual.
- Per-page coverage metadata proving that the ordered Russian text blocks reconstruct the existing exact page translation.

The layout manifest must not be treated as disposable generated scratch. It is production content and must be committed, validated, and reviewable.

## Required Navigation Model

Add semantic navigation derived from the manual's own index and headings.

At minimum, top-level navigation must include:

- Front matter: title, presentation, category/material overview, glossary, index.
- `Введение` starting at printed page `13` / PDF page `14`.
- `Глава 1: К устойчивой мобильности` starting at printed page `20` / PDF page `21`.
- `Глава 2: Управление транспортным средством - акт ответственности` starting at printed page `42` / PDF page `43`.
- `Глава 3: Основные нормы вождения` starting at printed page `56` / PDF page `57`.
- `Глава 4: Естественная способность` starting at printed page `88` / PDF page `89`.
- `Глава 5: Поведение при управлении` starting at printed page `97` / PDF page `98`.
- `Приложение I. Частные автомобили` starting at printed page `103` / PDF page `104`.
- `Приложение II. Пассажирский транспорт` starting at printed page `122` / PDF page `123`.
- `Приложение III. Перевозка грузов и товаров` starting at printed page `151` / PDF page `152`.
- `Приложение IV. Дорожные знаки` starting at printed page `183` / PDF page `184`.

Navigation entries must support child topics from the index pages `11-12` of the source text, including topics such as `Дорожная пандемия`, `Пешеходный приоритет`, `Обязательные документы`, `Скорость`, `Сон и усталость`, `Предупредительное и эффективное вождение`, `Элементы безопасности`, `Безопасное вождение`, and the sign categories in Appendix IV. Implementation may add more child topics from page headings when the index does not enumerate every visible subsection.

Each navigation entry must include:

- Stable ID.
- Russian title.
- Spanish/source title where available.
- Level (`frontMatter`, `chapter`, `appendix`, `topic`, or equivalent).
- Start page and end page.
- Source evidence (`index_pages_11_12`, page heading, or curated manual review).
- Children where applicable.

Search results must be grouped or labelled by this semantic structure. Direct page access must remain available as secondary navigation, not as a single long primary list.

## User Experience Requirements

- Opening `Руководство 4R` defaults to the semantic table-of-contents/navigation view and the first meaningful manual page, not a bare 200-page button list.
- The primary content pane renders one Russian manual page at a time as a document page with preserved page layout.
- Page controls support previous/next within the current semantic section and across the full document.
- Users can jump by chapter/topic, search text, or direct page number.
- Source metadata remains visible in a compact provenance area or disclosure, not as large chips interrupting the manual page.
- The UI must avoid labels such as `Перевод из approved primary-source chunk` inside the primary reading page; such data belongs in compact provenance/debug-style metadata only.
- Optional original Spanish comparison may exist behind a clearly secondary control, but the default view must not show Spanish source and Russian translation side-by-side.
- On desktop, the navigation can sit beside the page. On mobile, navigation and page view must switch cleanly without overlapping panels.
- The page canvas must support fit-to-width by default and may include zoom controls if needed for legibility.
- Long Russian text must wrap, fit, or scale within its block without overflowing into neighboring blocks.

## Mobile Requirements

- Semantic navigation rows and secondary page rows must use stable min-height or auto-height layouts that grow with text; no fixed row height may clip multi-line titles.
- Page-number markers must not overlap row text or neighboring rows.
- The retained page list must not place subtitles/status text under later rows.
- The mobile state must clearly switch between navigation/list and page detail; hidden panes must not remain visually or interactively present.
- Representative mobile verification must include the dense range around pages `114`-`123`, because the user reported visible overlap there.
- The page view must remain readable on mobile without forcing the user to inspect a tiny side-by-side screenshot/translation split.

## Acceptance Criteria

1. `Руководство 4R` renders the complete 200-page manual as a Russian layout-preserving web document.
2. The primary manual page is not a Spanish screenshot beside a plain Russian translation card.
3. Every page has local static visual assets and structured Russian layout data.
4. Ordered Russian layout blocks cover the complete exact Russian translation for every page, with no intentional omissions or summaries.
5. Images, diagrams, tables, icons, captions, callouts, labels, footnotes, page numbers, and visual hierarchy are preserved as part of the page composition.
6. The manual offers source-derived semantic navigation by front matter, introduction, chapters, appendices, and topics.
7. Direct page navigation/search remains available but is secondary to semantic navigation.
8. Mobile semantic navigation and page-list UI render without overlap, clipping, smeared text, or page-number collisions, including pages `114`-`123`.
9. Runtime uses only committed local static content/assets and no PDF viewer/runtime PDF rendering/network/backend/live-AI dependency.
10. Durable docs describe the corrected layout strategy, navigation model, validation workflow, and local/offline behavior.
11. Tests and validation evidence cover 200/200 page coverage, text layout coverage, visual/layout preservation, semantic navigation coverage, mobile layout stability, and forbidden runtime dependencies.

## Negative Scenarios

- Keeping the feature `027` two-column Spanish render plus plain Russian card as the corrected result.
- Showing a text-only Russian transcript with images nearby but outside the original page structure.
- Showing page screenshots only while the Russian translation remains outside the page.
- Treating search as a substitute for semantic navigation.
- Exposing only a flat 200-page list as primary navigation.
- Using low-resolution or blurred assets where the existing local page render or a crisper generated layer can be used.
- Adding a runtime PDF iframe, PDF embed/object, browser PDF viewer, PDF.js renderer, remote asset URL, backend call, or live AI call.
- Replacing exact translation with simplified Russian, summaries, shortened labels, or intentionally untranslated Spanish body text.
- Allowing mobile rows, buttons, page markers, or page blocks to overlap or clip.

## Verification Evidence Required

- Manual validator output proving 200/200 source pages still pass source, translation, asset, and provenance checks.
- New layout validator output proving every page has page-layout data and every page's ordered Russian blocks reconstruct the existing exact translation.
- Source-text/caption mask validation output proving visible Spanish instructional text is removed from the primary Russian canvas on representative visual-heavy pages, including PDF/page `185` and additional Appendix IV sign pages.
- Navigation validator output proving semantic navigation covers the full page range without gaps or inverted/overlapping ranges, and top-level entries match source index pages `11-12`.
- Runtime dependency scan proving no manual PDF viewer, runtime PDF rendering, remote/manual network fetch, backend endpoint, or live-AI dependency.
- Playwright desktop and mobile evidence that:
  - `Руководство 4R` opens to the Russian layout-preserving page reader.
  - The old side-by-side Spanish image plus plain translation card is absent from primary UI.
  - Semantic navigation works for at least introduction, one middle chapter, Appendix I, Appendix II around pages `114`-`123`, and Appendix IV.
  - Mobile navigation/list rows around pages `114`-`123` do not overlap or clip based on bounding-box assertions and screenshots.
  - Representative image-heavy/table/sign pages render with local assets, nonblank page composition, and no visible Spanish source headings/captions in the primary Russian reader; page `185` must be explicitly covered.
- TypeScript verification must include `pnpm exec tsc --noEmit` where available, or equivalent strict type-check coverage through the repository preflight/build command if the standalone command is unavailable.
- Local preflight/build evidence before PR completion.

## Review Requirements

Review Agent must specifically check:

- Role/process compliance and complete feature memory.
- No product code was added before Architect artifacts existed.
- The primary manual UI is not the feature `027` side-by-side reader under a cosmetic restyle.
- The semantic navigation is source-derived and not arbitrary page buckets.
- Layout/text validators actually fail on missing pages, missing layout blocks, missing text coverage, or stale navigation ranges.
- Mobile list/navigation fixes are covered by tests for pages `114`-`123`.
- Runtime constraints and local-first/deferred-loading constraints from feature `027` remain intact.

## Final Validation Expectations

Final Architect validation must verify the full cycle PR set, implementation evidence, review dispositions, current process memory, semantic navigation coverage, layout/text coverage, mobile UI evidence, and absence of stale feature `027` side-by-side behavior.

Final Analyst validation must run only after Architect passes and should validate the result against the user's correction in spirit and letter: Russian web manual preserving structure/layout/images, meaningful navigation, and fixed smearing/overlap.
