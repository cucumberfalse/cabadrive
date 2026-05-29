# Plan: Native Russian Introduction Section Rebuild

## Role And Branch Context

- Current role for this artifact: Architect
- Feature: `029-pandemia-vial-section`
- Worktree: `/Users/chap/devel/cabadrive-worktrees/029-pandemia-vial-section`
- Branch: `codex/029-pandemia-vial-section`
- Base: `origin/main` at `afb0d2b8d00cb9d823266d661bab85fbe18043e8`
- Parallel work may exist; preserve all sibling work and process memory.

## Current Scope Extension Plan

The latest user request extends active feature `029-pandemia-vial-section` from one `Pandemia vial` approval page to the current `INTRODUCCIÓN` / Introduction block set. This is allowed in the active feature branch because it follows the original staged rollout recorded by Analyst: approve `Pandemia vial`, then do several more blocks, then only later consider whole-document conversion.

Implementation now plans four standalone pages/routes based on source `Índice` headings, not raw PDF page numbers:

| Route/navigation id | Source `Índice` heading | Russian route title | Manifest range to verify |
| --- | --- | --- | --- |
| `intro-road-pandemic` | `Pandemia vial` | `Дорожная пандемия` | `15-15` |
| `intro-ethical-civic-approach` | `Enfoque ético - ciudadano en la cultura vial` | `Этико-гражданский подход в дорожной культуре` | `16-16` |
| `intro-incident` | `¿Accidente o incidente de tránsito?` | `Авария или дорожный инцидент?` | `17-17` |
| `intro-road-safety-plan` | `Plan de seguridad vial de la Ciudad de Buenos Aires` | `План дорожной безопасности города Буэнос-Айрес` | `18-20` |

The implementation must verify the exact source span, text, images, visual blocks, and layout for each new heading from the source `Índice`, `navigation.ru.json`, `manual.ru.json`, `layout.ru.json`, and PDF renders before building. Existing page-local headings inside the manifests do not override the route boundary from the source `Índice`; for example, `Plan de seguridad vial de la Ciudad de Buenos Aires` stays one page/route even when it spans several PDF pages and contains subheadings.

Navigation must be built as a scalable full-document information architecture for the future Russian interactive manual, not as a one-off horizontal Introduction list. The current four Introduction routes are the first populated children inside the full source `Índice` hierarchy. Future chapters/annexes may appear as pending/disabled/collapsed placeholders, but this feature must not create content pages outside the assigned Introduction children.

The integrated Russian interactive document is the main app destination labeled `Руководство`. It replaces the current user-facing `Руководство 4R` manual-viewer entry/view instead of living beside it as a prototype or second manual block. The full `Índice` navigation shell belongs inside `Руководство`, and existing direct hashes (`#pandemia-vial`, `#intro-enfoque-etico`, `#intro-accidente-incidente`, and `#intro-plan-seguridad-vial`) must deep-link into the appropriate child content there.

Target full-document IA for navigation:

| Kind | Source label / page | Russian visible label | Children |
| --- | --- | --- | --- |
| Support | `Presentación` | `Предисловие` | none |
| Support | `Glosario` | `Глоссарий` | none |
| Group | `INTRODUCCIÓN`, `Pág. 13` | `Введение` | `Pandemia vial`; `Enfoque ético - ciudadano en la cultura vial`; `¿Accidente o incidente de tránsito?`; `Plan de seguridad vial de la Ciudad de Buenos Aires` |
| Group | `CAPÍTULO 1: HACIA UNA MOVILIDAD SUSTENTABLE`, `Pág. 20` | `Глава 1. К устойчивой мобильности` | `Ciudades para las personas`; `¿Qué es la movilidad sustentable?`; `Prioridad peatonal`; `Bicicleta`; `Sistema de transporte público`; `Viaje compartido` |
| Group | `CAPÍTULO 2: CONDUCIR ES UN ACTO DE RESPONSABILIDAD`, `Pág. 42` | `Глава 2. Вождение - ответственное действие` | `Responsabilidades legales`; `Documentación obligatoria`; `Obligaciones en caso de incidentes viales`; `Scoring` |
| Group | `CAPÍTULO 3: NORMAS BÁSICAS DE CONDUCCIÓN`, `Pág. 56` | `Глава 3. Основные правила вождения` | `Prioridad normativa`; `Prioridades de paso`; `Uso de luces`; `Velocidad`; `Giros en intersecciones`; `Adelantamiento y sobrepaso`; `Conducción en autopistas y otras vías rápidas`; `Conducción en situaciones adversas`; `Detención y estacionamiento` |
| Group | `CAPÍTULO 4: CAPACIDAD NATURAL`, `Pág. 88` | `Глава 4. Физическое состояние водителя` | `Ingesta de alcohol y drogas`; `Sueño y fatiga`; `Estrés`; `Distracciones` |
| Group | `CAPÍTULO 5: ACTITUD AL CONDUCIR`, `Pág. 97` | `Глава 5. Поведение за рулем` | `Tipos de actitudes`; `Hacia una sociedad igualitaria`; `Prevención y asistencia en situaciones de violencia de género`; `Conducción preventiva y eficiente` |
| Annex | `ANEXO I AUTOMÓVILES PARTICULARES`, `Pág. 103` | `Приложение I. Легковые автомобили` | `Elementos de seguridad`; `Otros elementos de seguridad obligatorios`; `Elementos de seguridad recomendables` |
| Annex | `ANEXO II TRANSPORTE DE PASAJEROS/AS`, `Pág. 122` | `Приложение II. Пассажирский транспорт` | `Una responsabilidad social`; `Elementos de seguridad`; `Factores involucrados en la conducción`; `Conducción segura`; `Autopistas y Hospitales` |
| Annex | `ANEXO III TRANSPORTE DE CARGA Y MERCADERÍAS`, `Pág. 151` | `Приложение III. Грузовой транспорт и перевозка товаров` | `Perfil del transportista de cargas`; `Una responsabilidad social`; `Factores involucrados en la conducción`; `Conducción segura`; `Elementos de seguridad`; `Autopistas` |
| Annex | `ANEXO IV SEÑALES VIALES`, `Pág. 183` | `Приложение IV. Дорожные знаки и разметка` | `Reglamentarias`; `Preventivas`; `Informativas`; `Transitorias`; `Horizontales`; `Señalamiento luminoso` |

All reusable QA requirements accumulated for `Pandemia vial` apply to every added page: native web page, selectable/copyable Russian text, no runtime PDF viewer/full-page raster/mask/overlay translation, no visible Spanish primary text, source-derived cleaned artwork when needed, responsive prose without forced PDF line breaks, readable local/offline UI typography, no non-ticket source/provenance/page/book-layout clutter, no excessive blank page canvas, no zoom/context controls, Playwright layout/nav tests, content tests, and screenshot evidence.

## Current Feedback State

The user rejected or partially rejected the current prototype. A follow-up Implementation Agent must preserve the earlier prohibitions against full-page runtime rasters, masks, and overlay translation, while also addressing the latest feedback:

- scale is too small;
- current SVG redraws/icons are poor and less faithful than the original;
- `Вписать` / `100%` controls are unnecessary;
- `Мировой контекст` / `Контекст города` buttons are unnecessary;
- Russian wording should be simpler while keeping exact meaning and ticket-relevant details.

Newest feedback adds content pruning and reusable QA requirements:

- visible source/provenance details that are not needed for solving tickets should be removed from the learning document;
- for this section, remove bottom source-attribution wording and keep only the conclusion that road safety requires joint work by all society;
- remove the footnote entirely;
- remove book-layout elements that do not fit the website/document experience: page marker/page number and the blue upper-left semicircle/corner motif;
- maintain a reusable checklist of corrected issues for future sections, including automated no-overlap checks and screenshot review.

Latest Russian wording and validation feedback adds:

- Russian text must read like natural Russian learning prose, not like a formal literal translation;
- use common words, short/direct phrasing, and language roughly understandable to younger schoolchildren;
- shorten formal text where possible only when meaning and exam-ticket details remain intact;
- local consecutive text may be simplified and shortened by merging adjacent paragraphs, splitting complex sentences, or combining short sentences when this improves clarity;
- local text-flow optimization must preserve source order and structure at the section/block level; it must not globally rearrange sections, lists, diagrams, navigation, or source heading order;
- the three `Plan de seguridad vial` paragraphs about shared responsibility, Vision Zero, and safe-system design need explicit adaptation review;
- simplification must be checked against local ticket/practice-source material where available, especially named entities, numeric facts, years, obligations, definitions, conditions, lists, safety principles, and exception words;
- if exact ticket relevance is unclear, preserve the detail or record an Architect/Analyst disposition instead of silently dropping it;
- after implementation, a visual source-fidelity checker/harness must compare original Spanish source material with the Russian web page/section and fail on lost/modified images, infographics, pictograms, layout, formatting, style, generic icon replacements, and inconsistent document style tokens.

Newest visual/content feedback adds:

- intro/body explanatory text must be approximately the same size as ordinary `Материалы` body text, not merely above a 14px minimum;
- city statistic circle icons must be fully visible and separated from text/backgrounds;
- the `8 из 10` people-grid asset must accurately show 8 male pictograms and 2 female pictograms; replace/recreate/clean the asset if needed;
- normal intro/body paragraphs must not contain forced line breaks to mimic PDF wrapping; paragraph text should be adaptive DOM text that wraps by container width. Fixed image/infographic blocks, labels, and pinned statistic text may keep deliberate line breaks when needed to preserve layout.

Newest asset-fidelity feedback supersedes the latest clean SVG replacement approach:

- the current visual assets still look redrawn and substantially different from the PDF;
- visual pictograms/icons must use original PDF/source artwork whenever possible, preferably high-resolution crops from the PDF or best available local source render;
- cleanup is limited to removing source text that must be replaced by Russian DOM/SVG text;
- newly designed generic/reconstructed SVG icons are not acceptable when visibly different from the source;
- vectorization is allowed only when visually indistinguishable from the original artwork; the latest clean SVG replacements do not meet this bar and must be replaced;
- city circle icons must be original motorcyclist/pedestrian/car artwork crops or high-fidelity cleaned originals;
- the `8 из 10` people-grid should use original high-quality source pictograms/crop if possible and must preserve original silhouette/style plus exact 8 male and 2 female semantics.

Newest layout/framing feedback adds:

- the current browser preview looks like a small data fragment on a huge blank white PDF page and is not acceptable;
- the visible section must not render a full PDF page canvas or huge blank top/side/bottom whitespace;
- use the PDF page as reference for the meaningful `Pandemia vial` content block, then crop/reframe the web section around that block;
- preserve the infographic design, alignment, original artwork, typography relationships, and pinned infographic layout inside the content block;
- present the result as a normal responsive web page section with ordinary margins and density;
- desktop must show a readable block, not a tiny centered island;
- mobile must start on meaningful content; pan/scroll is acceptable only where the fixed infographic requires it.

Newest responsive-prose feedback adds:

- live-browser verification found the page is reframed, but the whole section remains a fixed-width canvas that clips or horizontally scrolls ordinary prose in a narrower in-app browser window;
- normal prose roles (`heading`, `intro`, and bottom learning conclusion/body) must be responsive web-flow content or otherwise fit the viewport/container without horizontal clipping or horizontal scrolling;
- horizontal scrolling/panning is allowed only for fixed infographic/image blocks that need pinned PDF-like layout, not for ordinary prose;
- the meaningful infographic may remain pinned/fixed internally, but it should sit inside/after/around responsive prose rather than one monolithic fixed-width canvas;
- tests must verify no horizontal clipping/overflow for prose at the in-app/narrow viewport and mobile viewport while retaining source-derived PNG/crop assets and no rejected SVG runtime references.

Newest selectable-text feedback adds:

- the section must behave like an ordinary web page, not an image preview;
- ordinary Russian text and meaningful statistic labels must be real selectable/copyable DOM text unless a narrow fixed-infographic reason is documented;
- at minimum `heading`, `intro`, bottom learning conclusion/body, and statistic labels must not disable selection or pointer interaction;
- tests should verify selection/copyability or at least computed `user-select`, `pointer-events`, and browser selection APIs for prose and labels.

Newest lower-city-row alignment feedback adds:

- the lower city infographic gray rows for `8 из 10` and `49%` must align horizontally with the left pictogram blocks as in the source PDF;
- the top edge of the `8 из 10` gray row aligns with the top of the people-grid pictogram block;
- the top edge of the `49%` gray row aligns with the top of the two-person pictogram block;
- Playwright/bounding-box checks must compare `people-grid-icon` with `male-victims-panel`/`male-victims`, and `people-pair-icon` with `age-range-panel`/`age-range`.

Repeated lower-city-row regression feedback adds:

- repeated user-reported visual regressions must become stricter reusable guards, not only notes;
- lower paired row alignment is not satisfied by top-edge tolerance alone;
- panel top, vertical center, bottom, and height must remain proportionate to the matching left pictogram group so the source row reads as one row/baseline;
- lower gray panel height must be bounded relative to the pictogram group and its internal text block;
- lower gray panels need maximum empty-space and bottom-whitespace checks;
- any upper/global card fix must rerun the grouped visual non-regression suite, including all prior lower city row alignment/density checks.

Earlier typography feedback adds (superseded by the readability-first direction where it conflicts):

- the current typography looks like the default app Inter/system style and does not match the source PDF;
- heading/body should approximate the original rounded/geometric sans roles more closely, including the heavy rounded heading and lighter rounded/geometric body rhythm;
- use a local/offline font already available in the project/runtime, or add an appropriate local font asset only if licensing/source is acceptable;
- remote font dependencies are forbidden;
- if the exact source font cannot be identified/used, document the closest available rounded/geometric sans choice;
- tune heading/body weights, letter spacing, line-height, paragraph spacing, and text block width while keeping Russian readable, responsive, selectable, and copyable;
- tests/visual QA should record computed `font-family`, `font-weight`, and `line-height` for heading and intro/body, plus fresh typography comparison screenshots.

Additional typography and durable QA feedback adds:

- typography matching applies to infographic cards, blue strips, gray boxes, statistic numbers, and labels, not only heading/body prose;
- use one coherent section typography system across prose and infographic roles; after the newest feedback this means the readability-first UI stack, not a rounded/geometric imitation;
- context labels `В мире` and `В городе Буэнос-Айрес` must use consistent emphasis logic;
- because `Contexto` is omitted in Russian and is not needed, do not bold only `Буэнос-Айрес`;
- either each remaining context label uses one consistent weight, or both labels use a symmetric two-level treatment;
- tests should check computed context-label weights or verify no `::first-line`/partial styling causes only part of a label to be bold;
- every accepted visual issue from user/reviewer/Orchestrator/browser QA must become a reusable requirement, validation checklist item, and evidence expectation for future PDF-section conversions, not only this `Pandemia vial` prototype.

Newest font-identity feedback adds:

- read-only PDF research identified embedded source fonts: `GothamRounded-Book` (`Gotham Rounded Book`, weight 325), `GothamRounded-Light` (`Gotham Rounded Light`, weight 300), `GothamRounded-Medium` (`Gotham Rounded Medium`, weight 350), `GothamRounded-Bold` (`Gotham Rounded Bold`, weight 700), and `HelveticaWorld-Regular`;
- no local Gotham files were found, but local rounded macOS fonts exist at `/System/Library/Fonts/SFNSRounded.ttf`, `/System/Library/Fonts/SFCompactRounded.ttf`, and `/System/Library/Fonts/Supplemental/Arial Rounded Bold.ttf`;
- the current Avenir-first stack is rejected by the user as still unlike the source;
- the later SF-rounded/GothamRounded-like attempt is also rejected by the user as worse and unlike the original;
- font selection must now prioritize readable Russian UI typography over exact source-font imitation;
- tests/evidence must prove the primary Pandemia stack no longer starts with Avenir or `SFNSRounded`/`SF Compact Rounded`/`SF Pro Rounded`;
- all future sections must identify embedded/source PDF fonts before choosing web typography.

Newest readability-first typography direction adds:

- when PDF font imitation harms Russian readability/visual quality, use a modern UI readability stack instead of forcing source-like rounded imitation;
- prefer `system-ui`, `-apple-system`, `BlinkMacSystemFont`, `"Segoe UI"`, `Roboto`, `"Noto Sans"`, `"Helvetica Neue"`, Arial, sans-serif, or an equivalent locally bundled readable UI font with acceptable source/licensing;
- local macOS preview should resolve toward Apple system/SF through the platform stack, not SFNSRounded-first and not Avenir-first;
- remove any forced/narrow heading width that causes `Дорожная пандемия` to break into two lines at normal desktop width;
- keep structural visual fidelity for layout/assets/geometry/density, but prioritize readable Russian typography over exact PDF font mimicry.

Newest infographic geometry/density feedback adds:

- lower city statistic rows (`8 из 10`, `49%`) need a source-like horizontal gap between left pictogram blocks and right gray panels; the current almost-no-gap look is rejected;
- lower gray panel text needs source-like internal padding and vertical balance, not top-pinned text;
- lower gray panels must match source proportions/density and must not become overly tall empty containers;
- upper global cards (`1,4 МИЛЛИОНА`, `50 МИЛЛИОНОВ`) have too much empty space in gray rectangles and need source-like card density;
- statistic-card fonts and number/label rhythm remain visually suspect; current font-stack acceptance is insufficient if card rhythm differs from the PDF;
- airplane/stadium pictograms should look attached/linked to the blue strip/cap as in the PDF, not like detached image crops;
- future sections must validate panel proportions, icon-panel gaps, internal text padding/vertical alignment, card density, and icon-to-strip attachment/cap geometry using bounding-box ratios/gaps, padding checks, and screenshot comparison.

Newest cap-geometry feedback adds:

- the latest attachment fix made the blue strip look like a huge full-width rounded half-pill/dome, which is rejected;
- source geometry is a mostly rectangular blue strip with a localized central rounded/semicircular cap or rise behind the pictogram;
- left and right portions of the strip should remain flat/rectangular; any rounded cap must be localized near the airplane/stadium icon center;
- tests/evidence should verify strip rectangularity at left/right and cap localization near the icon;
- future sections must distinguish localized decorative cap geometry from full-container `border-radius`.

Newest global-card seam/alignment feedback adds:

- live-preview QA shows a white seam/gap above the blue strip between the pictogram/cap and the rectangle; this is rejected;
- icon, localized cap, strip, and card top must visually touch as one source-like unit;
- blue strip and gray card panels remain rectangular at left/right; local cap geometry must not reshape the whole rectangle;
- paired global cards (`1,4 МИЛЛИОНА`, `50 МИЛЛИОНОВ`) use equal panel heights and aligned bottom edges/baseline grid;
- gray-card empty-space ratio is bounded, and text block top/bottom padding should be source-like rather than leaving a large unused lower area;
- future sections must include bounding-box checks for seam/gap, rectangular panel preservation, paired-card height/bottom alignment, and empty-space ratio.

Newest source-artwork preservation feedback adds:

- the current native symbolic/card replacement for page 17 `Factores de Riesgo` / `Recomendaciones` is rejected and must not be treated as an acceptable known issue;
- all section images, infographics, pictograms, and diagram artwork must be preserved 1:1 from the source through source-derived crops, cleaned originals, or source-faithful reconstruction, except page 18 where the latest requirement forbids reconstruction and requires the complete original infographic crop;
- generic icons, redesigned cards, approximated diagrams, modified pictograms, or generic DOM/CSS icon sets are not acceptable replacements when the source contains specific artwork;
- when infographic text must be Russian, preserve source geometry, colors, spacing, icon artwork, panel shapes, borders, and proportions exactly, and replace only the needed text with selectable Russian DOM/SVG layers;
- do not use a full-page raster, visible Spanish text, wholesale masks, or broad Russian overlays to translate an infographic;
- for page 17, preserve the source wind/tree, car, people, gray/yellow panels, blue recommendation label, border, spacing, and proportions; generic person/avatar icons fail. The earlier page 17 clipboard/notebook/check preservation requirement is superseded: omit the decorative recommendation icon entirely from the web version because it harms layout/readability; tests must not require its presence;
- tests must require source-derived asset metadata/crops, reject generic symbolic replacements, verify no visible Spanish, and include screenshot comparison for risk-factor/recommendation artwork;
- pages 18-20 work-axis/consequences diagrams inherit this as a non-regression guard: source pictograms/infographics cannot be left as accepted generic icon replacements.

Newest `intro-plan-seguridad-vial` visual preservation feedback adds:

- page 18 `Consecuencias de los Incidentes de tránsito` must preserve the original gauge/semi-circle incident diagram, black fatal-victims wedge/label, beige category labels/panels, family/economy icon, health icon, institutions icon, pointer shape, colors, geometry, proportions, spacing, connector lines, and overall composition;
- page 18 cannot be simplified into cards, generic icons, redrawn diagrams, altered colors, different chart geometry, cropped-away components, blurred/stretched artwork, or text-only substitutes;
- page 19 `Ejes de trabajo` must preserve the original four circular gray fields and exact walking/pedestrian, megaphone, officer/police, and group/people pictograms, with original icon sizes, placement, title relation to circle, blue title style, text placement, two-column grid spacing, and proportions;
- page 19 cannot be replaced by generic avatars, approximate symbols, modified pictograms, or alternate grid geometry;
- the general rule is non-negotiable: never lose, simplify, redraw, swap, crop away, recolor, blur, stretch, rasterize text-only substitutes for, or otherwise modify source images/infographics/pictograms/diagrams; only Russian text may differ where source text exists;
- tests and evidence must fail generic replacements or missing source components, require source-derived metadata/regions/crops, prove no visible Spanish, keep text selectable where feasible, and include screenshot comparison. Page 18 evidence must specifically prove complete-source-crop use rather than reconstruction.

Newest page 18 distortion blocker feedback adds:

- the current `#intro-plan-seguridad-vial` page 18 Russian `Последствия дорожных инцидентов` diagram is rejected because the assembled source-derived pieces are distorted beyond recognition compared with source `Consecuencias de los Incidentes de tránsito`;
- source-derived assets are necessary but not sufficient: the checker must fail when those pieces are assembled into a distorted, unrecognizable, or non-source-like composition;
- page 18 must be visually recognizable as the source with the same overall gauge/semi-circle composition, aligned beige sectors, gray outer arc, dark center ring, pointer, black fatality wedge and label, category labels and connector lines, and source-like relative positions, spacing, and proportions;
- no Russian labels may overlap diagram shapes, pictograms, connector lines, or other labels; no broken seams, clipped fragments, stretched crops, disconnected fragments, or source pieces floating outside their source role may remain;
- the failed screenshot classes are explicit no-go examples: icon fragments floating in the wrong place, white/gray chunks over arcs, black wedge covering text, labels not aligned with connector geometry, category text colliding with the diagram, misaligned fragments, broken arc/gauge continuity, misplaced black fatality wedge, and mismatched geometry;
- piecewise reconstruction is no longer acceptable for this diagram after the user's latest rejection. Page 18 must use a complete original PDF infographic crop for the non-text visual layer, cleaned only to remove Spanish/source text, with Russian selectable DOM/SVG text placed over the cleaned text areas.

Latest page 18 full-source-crop blocker feedback supersedes earlier completion evidence:

- do not redraw, reconstruct, approximate, or component-reassemble the page 18 diagram with CSS, SVG, native DOM shapes, or separately positioned source fragments;
- retain arcs, sectors, pointer, black fatality wedge, label boxes, connector lines, pictograms, colors, geometry, proportions, and spacing from the complete source crop;
- the only permitted visual cleanup is removing/cleaning original Spanish/source text so Russian DOM/SVG text can replace it;
- the checker must fail if the diagram asset is not a full source crop, if geometry/material proportions differ materially from the source screenshot, if any original component is missing/cropped, if components were redrawn/reconstructed instead of retained from the crop, or if Spanish/source text remnants remain.

Latest page 18 overlay-transfer feedback adds:

- the center-circle DOM text `ДОРОЖНЫЙ ИНЦИДЕНТ` must not create or reveal a protruding rectangle/background under it; cleanup/backing may not extend beyond the original circular field or alter the ring/pointer geometry;
- category label text inside source label boxes (`СЕМЬЯ И ЭКОНОМИКА`, `ИНСТИТУЦИИ`, `ЗДОРОВЬЕ`, `ПОГИБШИЕ`) must be vertically centered inside the original плашка/label box, not pinned high or low; `ИНСТИТУЦИИ` is the concrete no-go example for off-center text;
- the `ЗДОРОВЬЕ` label box must preserve source label geometry: consistent corners/radius, original height, baseline/center alignment, and source proportion. If Russian text needs fitting, change only the DOM text/wrapper width where necessary, not label height/corner shape/source graphics;
- any DOM overlay/background that visually changes source label shape, ring, center circle, connector lines, or pointer is a source-artwork modification and must fail validation.

Newest page 17/page 19 clipping and geometry blocker feedback adds:

- page 17 `Factores de Riesgo` is rejected when it uses source-derived fragments but changes the source style into square/rectangular image crops and flat panels;
- source risk cards are three long rounded rectangles with a large circular/lobed left edge, with the pictogram centered and fully visible inside that lobe;
- accepted page 17 risk cards require long light-gray Ambient/Ambiental and Vehicle/Vehicular panels, a yellow Human/Humano panel, rounded right corners, integrated circular left lobe, source-like spacing, title/body positions, and no clipped/square crop artifacts;
- page 17 `Recomendaciones` clipboard/notebook/check icon preservation is superseded by the latest user decision; omit that decorative book-layout icon entirely and validate the recommendation callout without requiring it;
- page 19 `Ejes de trabajo` must show complete pedestrian/walking, megaphone, officer/police, and group/people source pictograms inside gray circular fields with no cropped quadrants, cut-off tips, visible square crop-box corners, parent-overflow clipping, or icon/background coverage;
- page 19 remains four circle/title/text items in a two-column grid on desktop; responsive stacking is allowed only when needed and must preserve full icons, source-like spacing, and title/circle/text relationships;
- the checker must validate visible composition beyond asset existence/source metadata: no clipping, no visible square crop boxes in circular lobes/circles, no icon/background coverage, no overflow cuts, no parent `overflow:hidden` clipping of required icons, and source-like lobe/card/circle geometry, spacing, and alignment;
- explicit checker failures now include page 17 flat risk rectangles with square icon crops, a reintroduced/clipped page 17 recommendation clipboard after the omission decision, page 19 axis icons showing only a cropped quadrant, and page 18 gauge fragments misaligned;
- automated checks should cover image bounding boxes inside intended circle/lobe with padding, computed `object-fit: contain` or equivalent no-forced-crop behavior, parent overflow safety, screenshot comparison/manual review evidence, and Playwright screenshot/bounding-box checks at desktop, narrow, and mobile widths.

Latest page 17/page 19 transfer alignment feedback adds:

- page 17 `Рекомендации` no longer requires or permits the decorative clipboard/notebook/check icon after the latest user decision; do not spend more effort preserving a low-value clipped icon, and do not require it in tests;
- page 17 recommendation checker must not require clipboard/notebook/check presence. It must fail if the callout label/border is misaligned, clipped, visually unfaithful, or if a partial/reintroduced clipboard/notebook/check fragment remains visible;
- page 17 `Факторы риска` pictograms inside circular lobes must be framed like the source: alpha bounds visually centered in the lobe, source-like alpha-size fraction of the circle, and important details such as car diagonal support and people lower silhouettes complete;
- page 17 risk-card checker must compare alpha visual center to the lobe center, not only image element boxes, and fail if all icons use the same CSS box while visible alpha content is differently centered or scaled;
- page 19 `Направления работы` circles must use a stable desktop 2x2 grid with equal circle diameters, aligned top-row and bottom-row center-y coordinates, aligned left/right column center-x coordinates, and consistent row/column gaps independent of title/body wrapping;
- page 19 grid checker must fail if title wrapping causes icon-circle drift, if row/column centers exceed tolerance, if diameters differ, or if desktop collapses into an uneven masonry layout. Mobile/stacked variants may differ but must keep local alignment and complete pictograms;
- page 18 overlay-transfer rules carry forward unchanged: no protruding center backing rectangle under `ДОРОЖНЫЙ ИНЦИДЕНТ`, label text vertically centered, and `ЗДОРОВЬЕ` label shape/size/corners source-faithful with only width allowed to vary when needed.

Latest page 18 label and center-artifact blockers add:

- `ИНСТИТУЦИИ` must not be visually top- or bottom-pinned; all category labels must be vertically centered inside their source label boxes;
- `ЗДОРОВЬЕ` must not overflow its light-brown backing. Russian fitting may widen the label/text wrapper, but source label height, corner radius/shape, vertical centering, and connector relationships must remain intact;
- `ПОГИБШИЕ` must use category-label typography consistent with the other page 18 category labels while remaining inside the black source box;
- the center `ДОРОЖНЫЙ ИНЦИДЕНТ` layer must not have any rectangular DOM background, opaque cleanup patch, mask, or backing artifact that covers the source circle/ring;
- the checker must fail label backings shorter than their text, mismatched/broken label corners, top/bottom-pinned label text, inconsistent category label typography, and any opaque rectangle in the center circle.

Latest page 18 regression after native label backing attempt supersedes prior acceptance:

- the preview at `http://127.0.0.1:4187/?preview=page18-fixes-1779996165464#intro-plan-seguridad-vial` is rejected because it introduced more visible artifacts around label boxes/corners/connectors/ring and still leaves `ИНСТИТУЦИИ` and `ПОГИБШИЕ` vertically low inside their labels;
- earlier task/checker evidence that marked page 18 label cleanup, `ЗДОРОВЬЕ`, `ПОГИБШИЕ`, and center-circle artifacts resolved is stale until a new implementation passes this regression class;
- do not repair page 18 by adding block patches, square/rectangular masks, color-matched plates, or partial opaque label overlays over source artwork. Source text cleanup must happen at glyph/local-pixel level, restoring background boundaries where letters crossed multiple colors;
- label text centering is judged against the visible source label backing/pill, not the CSS element box. Use rendered ink bounds or screenshot-derived measurements compared with the visible backing, and include named checks for `ИНСТИТУЦИИ` and `ПОГИБШИЕ`;
- artifacts around source label corners, connector-line crossings, the dark ring, the pointer, and the center circle are checker failures even if automated tests still pass color/size/bounding-box tolerances;
- `ЗДОРОВЬЕ` must render as one coherent source-like label with enough horizontal padding, consistent corner radii, and no exposed tabs/steps/fragmented corners. If width changes are unavoidable, only width may change and the final visible shape must still look like the source label;
- completion requires a fresh browser screenshot compared against the original/source crop with explicit visual notes that all user-marked artifact classes are absent. Automated geometry checks alone cannot close this blocker.

Latest page 19 source-pictogram crop blocker feedback adds:

- current page 19 axis pictogram crops are visibly clipped and cannot be accepted as source-faithful;
- use complete source pictograms from the PDF with enough transparent/source padding around the content so no foot, handle, head, body, or group edge touches the asset bounds or appears cut by the gray circle;
- tight crops that only show a central quadrant, have visible square crop corners, or rely on `object-fit: contain` while the natural image content is already cut are rejected;
- the checker must inspect natural image/content bounds or equivalent metadata/screenshot evidence, not only rendered element boxes, and must fail if a pictogram touches crop bounds without padding or if a generic/reconstructed icon replaces the source pictogram.

Newest recurring-style feedback adds:

- `intro-enfoque-etico` blue callout/law blocks show inconsistent alignment; one left-aligned and one centered is rejected unless source evidence shows a variant;
- repeated block types must use one consistent style across the document family unless the source has a clear recorded different style;
- every recurring style element needs reusable tokens/guidelines for typography family/weights, headline/body sizes, line-height, colors, paddings, margins, border widths/radii, alignment, icon/image positioning, and responsive behavior;
- blue law/callout blocks specifically need one shared style for background color, left accent stripe, padding, text alignment, font weight, line-height, width behavior, and margin cadence;
- every new style element must be added to the style guideline and validated against the source before implementation is accepted.

Existing runtime diffs must be preserved until Orchestrator assigns Implementation Agent work; Architect does not edit or revert them.

## Implementation Strategy

The follow-up implementation should:

0. Expand from a single `Pandemia vial` page to the four-page Introduction block set:
   - preserve the accepted/rejected `Pandemia vial` requirements and existing pending QA guards;
   - create/update a reusable full-document navigation model that treats source `Índice` groups and child headings as route boundaries;
   - expose four separate Introduction route/navigation entries in source order inside the full hierarchy;
   - include support entries, chapter/annex group headers, and child entries from the target full manual IA as pending/disabled/collapsed where unimplemented;
   - keep the implementation limited to those four Introduction headings, not the whole manual.
0.1. Build the navigation IA from the target source `Índice`:
   - support entries: `Presentación` / `Предисловие`, `Glosario` / `Глоссарий`;
   - Introduction group `INTRODUCCIÓN`, page 13, with the four implemented children;
   - chapter groups 1-5 with source child entries and page refs;
   - annex groups I-IV with source child entries and page refs;
   - preserve Spanish source titles and `Pág.` refs as metadata, while visible labels are Russian;
   - avoid rendering source/provenance/QA metadata inside content pages.
0.2. Navigation behavior:
   - implemented Introduction children have direct route/hash navigation and active item state;
   - unimplemented groups/children are non-content placeholders, pending/disabled/collapsed as appropriate;
   - active Introduction item remains discoverable in the hierarchy with active group and active child styling/ARIA semantics;
   - keyboard navigation, accessible labels/current state, and mobile/narrow usability are part of the implementation contract.
0.3. Main app placement:
   - mount the interactive Russian manual as the main app block/tab labeled `Руководство`;
   - remove the legacy `Руководство 4R` manual-viewer entry/view from user-facing navigation when the new `Руководство` document is present;
   - do not expose a separate prototype/experimental/Introduction-only block for these pages;
   - keep old manual-viewer internals only if repo architecture requires them, and only hidden from the current user-facing guide destination;
   - preserve existing direct hashes `#pandemia-vial`, `#intro-enfoque-etico`, `#intro-accidente-incidente`, and `#intro-plan-seguridad-vial` as deep links into `Руководство` child content with correct active group/child state.
0a. Verify source boundaries before building the three added sections:
   - confirm index labels and ordering from the source `Índice` / `index_pages_11_12`;
   - confirm manifest ids, `startPage`, `endPage`, source text, and Russian draft text from `navigation.ru.json` and `manual.ru.json`;
   - inspect `layout.ru.json` and local renders `page-016.jpg` through `page-020.jpg` for visual hierarchy, images, callouts, lists, and page-local subheadings;
   - record evidence for every heading before implementing runtime content.
0b. Choose section layout by source complexity:
   - for primarily textual sections such as `Enfoque ético - ciudadano en la cultura vial` and `¿Accidente o incidente de tránsito?`, use normal responsive web prose/list/callout layout while preserving source hierarchy and order;
   - for `Plan de seguridad vial de la Ciudad de Buenos Aires`, verify whether pages 18-20 contain visual blocks/callouts before deciding prose-only versus source-crop treatment;
   - when a section has visual blocks/images, use source-derived cleaned crops for artwork and keep Russian learning text as selectable/copyable DOM/SVG text.
0c. Re-dispose the page 17/page 19 symbolic-card implementation feedback:
   - reject page 17 native symbolic/card replacement for `Factores de Riesgo` / `Recomendaciones`; it is a blocking follow-up, not an accepted known issue;
   - inspect page 17 source artwork and extract or reconstruct source-faithful wind/tree, car, people, gray/yellow panels, blue recommendation label, border, spacing, and proportions; omit the superseded decorative clipboard/check icon;
   - inspect pages 18-20 work-axis/consequences diagrams and replace any generic symbolic pictograms/cards with source-derived/source-faithful artwork before final acceptance;
   - record asset metadata for every visual artifact: source page/region, crop path or reconstruction mode, cleanup scope, whether text was removed, and screenshot comparison evidence.
0d. Add a document-family style-token pass:
   - inventory recurring block types in the four Introduction pages, including blue law/callout blocks;
   - create reusable style guidance/tokens for typography, sizes, line-height, colors, padding, margins, border widths/radii, alignment, icon/image positioning, and responsive behavior;
   - normalize repeated blue law/callout blocks to one source-validated style unless the source shows a documented variant;
   - add validation that fails accidental alignment/style drift between repeated block instances.
1. Reassess the current prototype against the latest feedback:
   - identify the smallest rendered text and compare it to existing study-material text;
   - list SVG/icon elements that look unlike the original;
   - list source regions that should become cleaned cropped assets;
   - identify any latest clean SVG replacements or generic/reconstructed icons that must be replaced by original artwork crops;
   - list scale/context controls to remove;
   - list Russian phrases that should be simplified.
   - compare intro/body font size with ordinary `Материалы` body text, not only a hard minimum;
   - inspect city circle icons for visibility, clipping, and text/background coverage;
   - verify `8 из 10` pictogram semantics: 8 male and 2 female pictograms;
   - inspect normal intro/body prose for manual line breaks inserted only to mimic the PDF;
   - compare every pictogram/icon asset against the source fragment for original silhouette/style fidelity.
2. Keep the PDF fragment as mockup/reference only:
   - use `page-015.jpg` through `page-020.jpg` for measurement and crop extraction only;
   - never render it as a full-page background/base;
   - do not mask Spanish text or overlay Russian translation on the source page.
3. Rebuild/adjust the native composition:
   - use structural HTML/CSS/SVG for layout, text, colors, statistic bands, and shapes;
   - use original PDF/source artwork crops for pictograms/icons/images whenever possible;
   - extract crops at high resolution from the PDF or best available local source render;
   - clean cropped assets only where visible Spanish text must be removed;
   - preserve source images, infographics, pictograms, panel shapes, borders, colors, spacing, and proportions 1:1; do not redesign or approximate them;
   - when replacing infographic text with Russian, keep the original artwork and geometry intact and place selectable Russian DOM/SVG text only in the source text positions;
   - use vector/CSS/SVG artwork replacement only when it is visually indistinguishable from the original;
   - replace the latest clean SVG city/pictogram assets if they look redrawn or generic;
   - replace the current page 17 generic risk-factor/recommendation cards with source-faithful artwork and geometry;
   - rebuild page 17 risk cards as source-like long rounded panels with integrated circular/lobed left edges, correct gray/yellow panel roles, rounded right corners, source pictograms centered/fully visible inside lobes, and source-like title/body spacing;
   - rebuild page 17 `Recomendaciones` without the decorative clipboard/notebook/check icon; keep the blue label, border, spacing, and callout alignment clean and unclipped;
   - ensure page 17 `Recomendaciones` tests fail if a clipped/degraded clipboard/notebook/check fragment is reintroduced, but pass when the decorative icon is absent and the callout remains faithful/readable;
   - frame page 17 risk pictograms by visual alpha bounds: alpha center aligns with each circular-lobe center, alpha area occupies a source-like fraction of the lobe, and source details such as car diagonal support and people lower silhouettes remain visible;
   - replace current page 18 consequences treatment with one complete original source infographic crop for the non-text visual layer; clean only Spanish/source text, then overlay Russian selectable DOM/SVG labels in the source text positions;
   - do not redraw or reconstruct the page 18 arcs, sectors, pointer, black fatal-victims wedge/label, beige panels, family/economy, health, institutions icons, connector lines, colors, spacing, or proportions with CSS/SVG/native shapes or separately assembled fragments;
   - validate page 18 against the original source crop: full-crop presence, gauge/arc continuity, aligned beige sectors, gray outer arc, dark center ring, pointer, black fatality wedge/label, category label boxes, connector lines, relative spacing/proportions, and no residual Spanish/source text;
   - reject page 18 floating fragments, white/gray chunks over arcs, black wedge/text collision, label/connector misalignment, category text collision, broken seams, clipped fragments, stretched crops, disconnected fragments, mismatched overall geometry, or any evidence that the diagram was redrawn/reassembled instead of retained from the full crop;
   - place page 18 Russian text overlays without visible backing rectangles or masks that protrude outside original text areas; the center-circle `ДОРОЖНЫЙ ИНЦИДЕНТ` label must stay inside the circular field/ring and must not cover pointer/ring geometry;
   - vertically center page 18 DOM text inside each source category label box and validate `ИНСТИТУЦИИ` as a known regression case;
   - preserve page 18 source label box height, corner geometry/radius, and connector relationships for `СЕМЬЯ И ЭКОНОМИКА`, `ИНСТИТУЦИИ`, `ЗДОРОВЬЕ`, and `ПОГИБШИЕ`; if Russian text needs adjustment, change only text/wrapper width, not the source label shape;
   - replace current page 19 work-axis generic symbols/cards with the source four circular gray fields and exact walking/pedestrian, megaphone, officer/police, and group/people pictograms, blue title style, text placement, grid spacing, and proportions;
   - rebuild page 19 axis visuals so every pictogram uses a complete source crop with enough transparent/source padding and is contained within its gray circle at desktop, narrow, and mobile widths, with no visible crop boxes, cropped quadrants, cut-off tips, tight natural crop bounds, parent-overflow clipping, or icon/background coverage;
   - lay out page 19 work-axis circles on a stable desktop 2x2 grid whose circle center coordinates and diameters are independent from title/body text wrapping; text may wrap inside its own area without moving the circle out of row/column alignment;
   - keep Russian text as native DOM/SVG/text.
4. Increase scale/readability:
   - enlarge the meaningful content block and typography so the smallest text is comparable to study-material text;
   - make intro/body explanatory text approximately match ordinary `Материалы` body text;
   - prefer larger content-block scale over microtype, without wrapping it in a full page-sized blank canvas;
   - tune source-like heading/body font roles, line-height, paragraph rhythm, and text block width.
5. Simplify UI:
   - remove `Вписать` / `100%`;
   - remove `Мировой контекст` / `Контекст города` buttons;
   - keep only minimal affordances such as route/anchor; do not render source/provenance UI for this section unless it is directly ticket-relevant.
6. Simplify Russian:
   - use plain Russian for a learner with low Spanish proficiency;
   - preserve all source details, numbers, organizations, dates/source context, and ticket-relevant facts;
   - keep ordinary prose as adaptive paragraphs that wrap by container width;
   - avoid formal literal translation and bureaucratic wording;
   - prefer common words, short sentences, and natural Russian phrasing understandable to younger schoolchildren where possible;
   - shorten text only when no source meaning or exam-ticket detail is lost;
   - optimize local consecutive text flow when helpful: merge adjacent paragraphs, split complex sentences, or combine multiple short sentences for clearer Russian;
   - keep this local: preserve section/block order and never rearrange sections, lists, diagrams, navigation, or source heading order;
   - explicitly rewrite/review the `Plan de seguridad vial` paragraphs on shared responsibility, Vision Zero (`no deaths or permanent injuries`, Sweden 1997, more than three decades as a reference), and safe-system design that contains/reduces human-error consequences.
6a. Verify ticket-detail retention after simplification:
   - compare rewritten Russian content against local ticket/practice-source material where available;
   - preserve named entities, numbers, years, obligations, definitions, conditions, lists, safety principles, exception words, and other ticket-question/answer/explanation details;
   - if ticket relevance is unclear, keep the detail or record an Architect/Analyst decision; do not silently omit it.
6b. Verify local text-flow transformations:
   - compare before/after for each merged paragraph, split complex sentence, or combined short-sentence group;
   - confirm local source order, meaning, and ticket-critical details are preserved;
   - confirm no accidental global structure change to sections, lists, diagrams, navigation, or source heading order.
7. Prune non-learning visible content:
   - remove visible source/provenance text unless it helps solve tickets;
   - remove the footnote and footnote URL from the visible document;
   - remove page marker/page number;
   - remove the blue upper-left book motif;
   - keep source traceability internally in data/tests/process memory.
8. Reframe the section for the web:
   - crop/reframe the rendered web section to the meaningful `Pandemia vial` content region;
   - remove excessive blank PDF-page whitespace while preserving the internal infographic layout;
   - use normal web page margins/density around the content block;
   - ensure desktop does not show a tiny centered island;
   - ensure mobile first view starts on meaningful content and only pans/scrolls where the fixed infographic requires it.
9. Separate responsive prose from pinned infographic layout:
   - render `heading`, `intro`, and bottom learning conclusion/body in normal responsive web flow;
   - ensure these prose roles fit narrow in-app and mobile viewport widths without horizontal clipping or scrolling;
   - scope any fixed-width container or horizontal scroll to infographic/image blocks only;
   - avoid one monolithic fixed-width canvas that contains both prose and infographic.
10. Preserve text selection/copyability:
   - keep ordinary Russian prose and meaningful statistic labels as selectable/copyable text, not image pixels;
   - ensure `heading`, `intro`, bottom learning conclusion/body, and statistic labels do not use `user-select: none`, `pointer-events: none`, or equivalent blockers;
   - allow images/assets to remain images, but do not bake Russian text into those assets;
   - document any narrow fixed-infographic exception and do not apply it to required prose/stat-label roles.
11. Preserve lower city row alignment:
   - align the `people-grid-icon` pictogram block and the `8 из 10` gray statistic row at the same top level;
   - align the `people-pair-icon` pictogram block and the `49%` gray statistic row at the same top level;
   - keep a small tolerance for browser rendering, but treat visible lower gray rows as a failure;
   - preserve source-like horizontal gap between each left pictogram block and its gray statistic panel;
   - tune gray panel height/width proportions and text top/bottom padding so the panel is dense and balanced rather than tall/empty/top-pinned;
   - verify panel top, vertical center, bottom, and height against the matching left pictogram group, not only top-edge alignment;
   - bound gray-panel empty-space ratio and bottom whitespace relative to both the icon group and text block;
   - rerun grouped visual non-regression checks after fixes to upper/global cards.
12. Match readability-first typography:
   - start from the identified embedded PDF fonts as diagnostic context, then apply the user's newest readability-first direction;
   - replace the rejected SF-rounded/GothamRounded-like attempt and the rejected Avenir-first stack;
   - use `system-ui`, `-apple-system`, `BlinkMacSystemFont`, `"Segoe UI"`, `Roboto`, `"Noto Sans"`, `"Helvetica Neue"`, Arial, sans-serif, or an equivalent locally bundled readable UI font with acceptable source/licensing;
   - add a local font asset only when licensing/source is acceptable and no remote dependency is introduced;
   - document exact stack/font choice and why readability-first supersedes source-font imitation here;
   - tests must reject Avenir-first and SFNSRounded/SF Compact Rounded/SF Pro Rounded-first stacks unless a later explicit decision changes this;
   - remove forced/narrow heading width that breaks `Дорожная пандемия` into two lines at normal desktop width;
   - tune heading/body weight, letter spacing, line-height, paragraph spacing, and text block width for readable Russian rhythm while preserving source hierarchy;
   - tune infographic labels, numbers, statistic cards, blue strips, and gray boxes using the same readability-first typography system;
   - keep context-label emphasis consistent: no bold-only `Буэнос-Айрес`; use full-label same weight or symmetric two-level treatment for both labels.
13. Match global-card geometry:
   - reduce excessive empty space in the upper gray statistic cards while preserving source proportions;
   - verify `1,4 МИЛЛИОНА` and `50 МИЛЛИОНОВ` number/label rhythm against the PDF, independent of the general font-stack check;
   - attach/link airplane and stadium pictograms visually to the blue strip/cap geometry as in the source;
   - preserve the strip as primarily rectangular, with only a localized central cap/rise under the icon rather than a full-width rounded dome;
   - eliminate any white seam/gap between icon/cap and strip/card top;
   - keep paired global panels equal in height and aligned at their bottom edge/baseline grid;
   - bound the gray-card empty-space ratio and tune text top/bottom padding so large unused lower areas do not remain.
14. Verify with automated layout checks, selection/copyability checks, alignment checks, typography checks, panel-ratio/gap/padding checks, and screenshots.
15. Add or update an initial post-completion visual source-fidelity checker harness for these Introduction pages:
   - compare original Spanish source screenshots/renders with Russian web screenshots;
   - include component/bounding-box metadata, asset presence/source-region checks, style-token checks, and a pass/fail report;
   - fail and return work for lost, modified, simplified, replaced, misaligned, recolored, blurred, stretched, or generic source artwork/layout/style;
   - fail and return work when page 18 is not a complete cleaned source crop with Russian text overlays, or when it is redrawn/reconstructed/reassembled from pieces;
   - add page 18 composition checks for full original infographic crop presence, overall gauge/semi-circle source match, arc continuity, sector alignment, center ring/pointer/wedge placement, label/connector alignment, no text/shape overlap, no floating/clipped/stretched/disconnected fragments, and no residual Spanish/source text;
   - add page 18 overlay checks that fail visible DOM/background rectangles outside original source text geometry, especially any opaque rectangle, cleanup patch, or backing artifact under center-circle `ДОРОЖНЫЙ ИНЦИДЕНТ` that covers the source ring;
   - add page 18 category-label checks for DOM text vertical centering within source label boxes, including explicit top- and bottom-pinning coverage for `ИНСТИТУЦИИ`, plus `СЕМЬЯ И ЭКОНОМИКА`, `ЗДОРОВЬЕ`, and `ПОГИБШИЕ`;
   - add page 18 label-geometry checks that source label rendered heights/corners/radii remain source-faithful, that `ЗДОРОВЬЕ` and other label backings are never smaller/shorter than their Russian text, and that only DOM text/wrapper width may vary for Russian fitting while connector relationships remain source-like;
   - add page 18 category-typography checks that `ПОГИБШИЕ` uses the same category-label font size/style as the other page 18 labels while staying inside the black source box;
   - add page 18 center-circle checks that `ДОРОЖНЫЙ ИНЦИДЕНТ` remains transparent text inside the circular field/ring and does not cover or deform the ring, pointer, center circle, or connector geometry;
   - add page 18 artifact-regression checks from the rejected `page18-fixes` preview: visible tabs/seams/patches around label corners, connector-line crossings, source label boxes, the dark ring, pointer, or center circle fail even when DOM size/color checks pass;
   - measure label vertical centering against the visible source label backing/pill and rendered text ink, not against an invisible CSS wrapper; `ИНСТИТУЦИИ` and `ПОГИБШИЕ` must be named fixtures for lower-pinned text;
   - reject block-patch cleanup: no broad rectangular/color-matched masks, square cover-ups, or partial label plates may be used to hide Spanish letters or artifacts. Cleanup evidence must show glyph-local removal/restored source pixels or an explicitly source-faithful complete label replacement with no seams;
   - require a fresh browser screenshot comparison against the original/source crop before page 18 label cleanup can be marked done; automated checks alone are advisory until the user-marked artifact classes are visually absent;
   - fail and return work when source-derived assets exist but visible icons are clipped, square-cropped, covered, forced-cropped, or misframed inside source circles/lobes;
   - add page 17 risk-card checks for integrated circular/lobed left edges, long rounded panel geometry, correct gray/yellow panel roles, icon bounding boxes centered inside lobes with padding, no visible square crop boxes, and source-like title/body positions;
   - add page 17 recommendation checks that no clipboard/notebook/check icon is required or visible after the latest omission decision, and that the blue label/border/callout remains aligned, unclipped, and source-faithful enough without that decorative icon;
   - add page 17 recommendation checks that fail reintroduced or partially clipped clipboard/notebook/check fragments, but do not fail because the icon is absent;
   - add page 17 risk-lobe alpha-framing checks that compare alpha visual center to lobe center, compare alpha bounds size to source-like circle fraction, and catch cut car diagonal support/people lower silhouettes or per-icon visible centering drift hidden by identical CSS boxes;
   - add page 19 axis checks for complete source pictograms inside gray circles, source/padded transparent crop margins, no natural content touching crop bounds, no cropped quadrants/cut-off tips/square crop-box corners, preserved desktop two-column circle/title/text layout, and desktop/narrow/mobile coverage;
   - add page 19 stable-grid checks for equal circle diameters, top-row center-y alignment, bottom-row center-y alignment, left/right column center-x alignment, consistent row/column gaps, no title-wrapping-driven circle drift, and no desktop masonry layout;
   - check computed `object-fit` or equivalent full-artwork containment and parent overflow safety where automated DOM checks are practical;
   - explicitly cover page 17 risk-factor/recommendation artwork, page 18 consequences/gauge diagram, page 19 work-axis circular pictograms, blue callout alignment/style, and the full-document `Руководство` navigation shell;
   - do not rely only on AI-written summary.

## Preferred File Touches

Implementation Agent may choose exact filenames, but expected touches remain:

- `src/data/pandemiaVialSection.ts` or equivalent section data.
- Introduction-section data/navigation files that add `intro-ethical-civic-approach`, `intro-incident`, and `intro-road-safety-plan` without losing `intro-road-pandemic`.
- `src/App.tsx` for route/view behavior.
- `src/styles.css` for native PDF-fragment-faithful composition and scale.
- Local isolated cropped assets under an asset-sync-compatible path if source crops are used.
- `tests/content-pandemia-vial-section.test.mjs` or equivalent focused Node test.
- Focused content tests for the added Introduction headings and heading-based navigation.
- `tests/e2e/app.spec.ts` for Playwright checks.
- `specs/029-pandemia-vial-section/tasks.md` for task/evidence updates.

## Boundaries

Do not:

- Edit manual sections outside the four listed Introduction `Índice` headings.
- Replace the whole manual surface.
- Navigate the document by raw PDF page numbers instead of source `Índice` headings.
- Use a flat post/page-only navigation model or one-off horizontal Introduction tabs/cards that cannot scale to the full `Índice`.
- Keep `Руководство 4R` and the new interactive `Руководство` document as duplicate user-facing manual destinations.
- Mount the current Introduction pages as a separate prototype, experiment, or Introduction-only block outside the main `Руководство` destination.
- Break existing direct hashes for the four Introduction routes or route them outside `Руководство`.
- Collapse all Introduction headings into one long page.
- Split `Plan de seguridad vial de la Ciudad de Buenos Aires` into PDF-page routes instead of one heading route.
- Create fake content pages for unimplemented future chapters/annexes.
- Expose Spanish source titles/page refs as content-page clutter instead of navigation metadata.
- Lose active group/child state, keyboard accessibility, accessible labels, or mobile/narrow usability in the navigation shell.
- Implement a new heading before its exact PDF span, source text/images/layout, and index label have been verified and recorded.
- Use `page-015.jpg` or any other full Introduction page render as the rendered page background/base.
- Use masks over Spanish source text.
- Overlay Russian translation on the Spanish page image.
- Keep poor SVG redraws when cleaned source crops would better match the original.
- Keep latest clean SVG replacements or generic/reconstructed pictogram/icon art when they visibly differ from the PDF.
- Keep page 17 `Factores de Riesgo` / `Recomendaciones` as native generic symbolic cards, generic person/avatar icons, or redesigned DOM/CSS pictograms.
- Keep page 17 `Factores de Riesgo` as flat rectangles with square/rectangular crops instead of source-like long rounded panels with integrated circular/lobed left edges.
- Keep page 17 risk-card icons clipped, awkwardly cropped, outside the lobe, covered by panel/background layers, or showing visible square crop-box edges.
- Keep or reintroduce the page 17 `Recomendaciones` decorative clipboard/notebook/check icon after the latest user decision to remove it, especially any clipped/degraded fragment, or keep tests that require the icon to exist.
- Keep page 17 risk-lobe icons when alpha visual center differs from lobe center beyond tolerance, alpha bounds are too small/large versus the source, car diagonal support/people lower silhouettes are cut, or identical CSS boxes hide different visible centering.
- Keep pages 18-20 work-axis/consequences diagrams as accepted generic icon/card replacements when the source has specific pictograms or infographics.
- Keep page 18 `Consecuencias de los Incidentes de tránsito` as simplified cards, generic icons, redrawn diagram geometry, altered colors, missing source components, blurred/stretched artwork, or text-only substitute.
- Keep any page 18 `Consecuencias de los Incidentes de tránsito` result that redraws, reconstructs, componentizes, or reassembles the original infographic instead of using the complete cleaned source crop as the visual layer.
- Keep any page 18 result with residual Spanish/source text inside the cleaned crop, or with missing/cropped original diagram components.
- Keep the current page 18 `Последствия дорожных инцидентов` assembly when it is distorted beyond recognition, even if the individual fragments are source-derived.
- Let page 18 pass with floating icon fragments, white/gray chunks over arcs, black wedge covering text, labels disconnected from connector geometry, category text collisions, broken gauge/arc seams, clipped or stretched fragments, or mismatched overall geometry.
- Let page 18 pass with a protruding DOM/background rectangle under center-circle `ДОРОЖНЫЙ ИНЦИДЕНТ`, or any center text backing that extends outside the circular field/ring or covers pointer/ring geometry.
- Let page 18 pass with category-label DOM text vertically off-center, top-pinned, or bottom-pinned inside the source box, including the known `ИНСТИТУЦИИ` regression.
- Let page 18 pass with `ЗДОРОВЬЕ` or any other category label whose backing is smaller/shorter than its Russian text or whose DOM/background overlay changes the source box height, corner/radius shape, connector relationship, or source graphic proportions.
- Let page 18 pass with `ПОГИБШИЕ` category typography that visibly differs from the other page 18 category labels.
- Let any page 18 DOM overlay/background visually change source label shapes, ring, center circle, connector lines, or pointer.
- Keep page 19 `Ejes de trabajo` as generic avatars/icons, approximate symbols, altered circular fields, changed icon sizes/placement, or different grid/title/text relationships.
- Keep page 19 axis pictograms cropped, showing only a quadrant, with cut-off icon tips, visible square crop-box corners inside circles, parent-overflow clipping, or icon/background coverage.
- Keep page 19 axis pictogram assets whose natural content touches crop bounds without transparent/source padding, even when the rendered image fits inside the gray circle.
- Accept page 19 responsive variants that stack content while clipping icons or losing the source circle/title/text relationship.
- Accept page 19 desktop work-axis circles with unequal diameters, top-row/bottom-row center-y drift, left/right column center-x drift, inconsistent row/column gaps, title-wrapping-driven circle drift, or uneven masonry-style placement.
- Translate an infographic by using a full-page raster, leaving visible Spanish, or masking/overlaying the Spanish page wholesale.
- Omit source-derived asset metadata/crops and screenshot comparison evidence for visual sections with pictograms/infographics.
- Leave repeated blue callout/law blocks with inconsistent alignment, padding, width behavior, font treatment, stripe/background, or margin cadence unless the source shows a documented variant.
- Implement a new recurring style element without adding it to the style guideline and validating it against the source.
- Use vectorized artwork without evidence that it is visually indistinguishable from the source.
- Keep `Вписать` / `100%` controls.
- Keep `Мировой контекст` / `Контекст города` buttons.
- Keep visible source/provenance text that is not needed for ticket solving.
- Keep the footnote visible in this section.
- Keep the page marker/page number visible in this section.
- Keep the blue upper-left semicircle/corner book motif visible.
- Keep tiny microtype that is not comparable to study-material text.
- Keep a full PDF page-sized white canvas or huge blank top/side/bottom whitespace around the section.
- Keep the content as a tiny centered island on a mostly blank page.
- Let mobile open on blank whitespace before the meaningful `Pandemia vial` content.
- Keep a monolithic fixed-width canvas that includes normal prose and causes heading/intro/body to clip or horizontally scroll at narrow widths.
- Put `heading`, `intro`, or bottom learning conclusion/body prose inside the horizontal scroller used for fixed infographic content.
- Make the Russian text feel like an image preview by baking prose or meaningful statistic labels into images.
- Disable text selection or pointer interaction on `heading`, `intro`, bottom learning conclusion/body, or statistic labels.
- Offset lower city gray statistic rows below their matching left pictogram blocks.
- Rely only on no-overlap checks for lower city rows without verifying source top alignment.
- Rely only on top-edge alignment for lower city rows without checking source row geometry, panel center/bottom/height, and empty-space ratio.
- Let lower city pictogram blocks nearly touch gray statistic panels when the PDF shows a clear gap.
- Use lower gray statistic panels with excessive height, poor density, or too much empty space.
- Pin lower gray panel text to the top edge without source-like internal padding/vertical balance.
- Keep untuned default typography, the rejected Avenir-first stack, or the rejected SF-rounded/GothamRounded-like stack as accepted final typography.
- Add remote font dependencies.
- Add a local font asset without acceptable licensing/source documentation.
- Keep Avenir, `SFNSRounded`, `SF Compact Rounded`, or `SF Pro Rounded` as the first/primary family after the user's rejection unless a later explicit decision changes the typography direction.
- Choose typography without documenting both the embedded source font context and the readability-first reason for not pursuing exact/rounded imitation.
- Force a narrow heading width that breaks `Дорожная пандемия` into two lines at normal desktop width.
- Leave heading/body weight, letter spacing, line-height, paragraph spacing, or text block width untuned and unevidenced.
- Leave infographic cards, blue strips, gray boxes, numbers, or labels outside the deliberate readability-first typography system.
- Use disconnected typography where prose is readable/tuned but infographic labels/cards remain untuned default text.
- Treat a passing section-wide font-stack check as enough when upper statistic card number/label rhythm remains visually unlike the PDF.
- Leave upper global gray statistic cards with excessive empty space or source-mismatched proportions.
- Render airplane/stadium pictograms as detached images instead of visually attached to the blue strip/cap geometry.
- Replace source localized cap/rise geometry with a full-width rounded half-pill/dome strip.
- Apply whole-strip/container border-radius when the source requires a rectangular strip plus localized center cap.
- Leave a white seam/gap between icon/cap and blue strip/card top.
- Use unequal upper global card panel heights or misaligned bottom edges.
- Leave gray-card text above a large unused lower area instead of bounding empty-space ratio and source-like padding.
- Lose rectangular left/right edges on the blue strip or gray panel while trying to create the local cap.
- Bold only `Буэнос-Айрес` or otherwise apply context-label emphasis asymmetrically.
- Use `::first-line` or similar partial styling that makes only part of a context label bold.
- Use overly formal Russian wording that obscures learner comprehension.
- Leave the three `Plan de seguridad vial` explanatory paragraphs as formal literal translation when they can be expressed in simpler natural Russian without losing meaning.
- Shorten or simplify Russian text in a way that removes, weakens, or changes exam-ticket information from local ticket/practice-source material.
- Drop unclear ticket-relevant details without preserving them or recording an Architect/Analyst decision.
- Use local text-flow optimization as permission to rearrange section/block order, list order, diagram order, navigation order, or source heading order.
- Merge/split/combine local text without before/after evidence that order, meaning, and ticket-critical details are preserved.
- Claim completion without running a visual source-fidelity checker/harness and recording a source-vs-Russian pass/fail report with artifacts.
- Let the visual checker pass generic icon replacement, lost source artwork, lost formatting/layout/style, inconsistent style tokens, or the previously reported page 17/page 18/page 19/navigation regressions.
- Add remote URLs as runtime assets.
- Add `fetch`, backend calls, PDF runtime rendering, iframes, objects, embeds, or PDF.js.
- Reuse a source page layout manifest as final proof of native pixel fidelity without route-specific DOM/layout verification.

## Asset Strategy

- Use vector/CSS/SVG for shapes, statistic bands, text containers, and simple faithful graphics.
- For icons/illustrations, use original PDF/source artwork by default: high-resolution isolated crops from the PDF or best available local source render.
- Preserve source artwork 1:1 for images, infographics, pictograms, diagrams, panel shapes, borders, colors, spacing, and proportions. Russian text replacement is the localization layer, not permission to redesign the infographic.
- Cut isolated crops from the original source artwork for city circle icons and pictogram groups instead of designing new generic icons.
- Clean crops only where visible Spanish text must be removed for Russian DOM/SVG text.
- Do not use newly designed generic/reconstructed SVG pictograms/icons when they visibly differ from the PDF.
- Vectorization is allowed only with evidence that it is visually indistinguishable from the original artwork; the latest clean SVG replacements are explicitly rejected and must be replaced.
- Crops must be local, source-derived, tightly scoped, and not full-page or full-section rasters.
- Crops must not contain visible Spanish text; clean text out before use or choose a crop region without text.
- Russian labels/statistics remain native DOM/SVG/text over the native composition, not burned into cropped assets.
- Russian labels/statistics that carry learning meaning must be selectable/copyable text unless a narrow pinned-infographic exception is documented.
- Record crop provenance, source region, cleanup status, and local path in data or tasks evidence.
- For city statistic circles, motorcyclist/pedestrian/car assets must be original artwork crops or high-fidelity cleaned originals, fully visible, and not hidden behind labels, opaque backgrounds, or circle text.
- For the `8 из 10` people-grid, the asset must preserve source meaning and source style: 8 male pictograms and 2 female pictograms with original silhouette/style. If cleanup is needed, clean the original crop/pictograms without redesigning their look.
- For page 17 `Factores de Riesgo` / `Recomendaciones`, preserve source wind/tree, car, people, gray/yellow panels, blue recommendation label, border, spacing, and proportions; generic person/avatar icons and generic cards are rejected. The decorative recommendation clipboard/notebook/check icon is a superseded book-layout detail and must be omitted entirely from the web version; tests/checkers must not require it.
- For pages 18-20 work-axis/consequences diagrams, preserve source pictograms/infographic artwork and record source-derived crop/reconstruction metadata; generic icon sets are not accepted final output.
- For page 18 `Consecuencias de los Incidentes de tránsito`, preserve the source gauge/semi-circle diagram, black fatal-victims wedge/label, beige category panels, family/economy, health, and institutions icons, pointer shape, colors, connector lines, spacing, geometry, proportions, and overall composition.
- For page 19 `Ejes de trabajo`, preserve the source four circular gray fields and exact walking/pedestrian, megaphone, officer/police, and group/people pictograms, including icon sizes/placement, title-to-circle relationship, blue title style, text placement, two-column grid spacing, and proportions.

## Document Style Guide Strategy

- Treat recurring visual/text blocks as document-family style elements, not one-off ad hoc CSS.
- Record tokens/guidelines for each recurring style element: typography family/weights, headline/body sizes, line-height, colors, paddings, margins, border widths/radii, alignment, icon/image positioning, and responsive behavior.
- Reuse a single style for repeated block types unless source inspection records a deliberate variant.
- Blue law/callout blocks use one source-validated token set for background color, left accent stripe, padding, text alignment, font weight, line-height, width behavior, and margin cadence.
- Add validation that compares repeated blue law/callout blocks and fails accidental centered-versus-left-aligned drift.
- When implementation encounters a new recurring style element, it must add the element to the style guideline and validate against the source before acceptance.

## Section Framing Strategy

- Treat the PDF page as a visual/layout source for the content block, not as the web section's outer canvas.
- Identify the meaningful `Pandemia vial` content region and build the web section around that region.
- Preserve internal composition within the content region: infographic alignment, pinned image positions, typography relationships, source artwork, and statistic layout.
- Remove blank page margins that exist only because the source is a book/PDF page.
- Use ordinary responsive web page margins and density around the block.
- Desktop should show the block at readable scale without a small centered island.
- Mobile may expose horizontal scroll/pan for fixed infographic content, but the initial viewport must begin on content rather than blank page whitespace.
- Keep normal prose outside fixed-width/pinned infographic scrollers. The heading, intro, and bottom learning conclusion/body should wrap by viewport/container width like ordinary web content.
- The infographic/image region may be a pinned fixed-width block when needed to preserve PDF-like layout, but that fixed region must not force prose to horizontally scroll.
- Pinned infographic layout is not a reason to turn ordinary prose or meaningful labels into unselectable image-preview text.
- Lower city rows are part of the pinned infographic fidelity: paired left pictogram blocks and right gray statistic panels must share the same top level.
- Lower city rows also need source-like spacing and density: a visible horizontal gap between pictogram and panel, panel proportions that do not create oversized empty containers, and balanced internal text padding.
- Repeated lower city row regressions require stricter full-row geometry checks: panel top, vertical center, bottom, height, empty-space ratio, and bottom whitespace must be proportionate to the left pictogram group and text block, not merely within a top-edge tolerance.
- Upper global cards need source-like density and cap geometry: gray statistic rectangles should be compact like the PDF, and airplane/stadium crops should visually attach to the blue strip rather than float separately.
- Cap geometry should be local, not global: the blue strip remains rectangular across most of its width while a localized rounded/semicircular rise sits near the icon center.
- Global card pairs need source-like baseline geometry: icon/cap/strip/card top should have no seam, card panels should share equal height and bottom alignment, and unused gray-card area below text should stay bounded.

## Typography Strategy

- Do not rely on accidental default styling, but also do not force PDF font imitation after the user rejected the SF-rounded/Gotham-like result.
- Identify embedded/source PDF fonts before selecting web typography. For this section, source roles are GothamRounded Book/Light/Medium/Bold plus HelveticaWorld-Regular; this is context, not the final target when readability suffers.
- Use the newest readability-first direction: choose a good modern UI stack for Russian text instead of forcing a source-like rounded imitation.
- Prefer `system-ui`, `-apple-system`, `BlinkMacSystemFont`, `"Segoe UI"`, `Roboto`, `"Noto Sans"`, `"Helvetica Neue"`, Arial, sans-serif, or an equivalent locally bundled readable UI font with acceptable source/licensing.
- If adding a font asset, record its source and license acceptability in tasks evidence; do not fetch fonts remotely at runtime.
- Record why the previous Avenir-first and SFNSRounded/SF Compact Rounded/GothamRounded-like attempts are rejected.
- Tests must prove the primary Pandemia stack no longer starts with Avenir, `SFNSRounded`, `SF Compact Rounded`, or `SF Pro Rounded` unless a later explicit decision changes this.
- Remove forced/narrow heading width so `Дорожная пандемия` does not break into two lines at normal desktop width.
- Tune heading/body roles separately: family, weight, letter spacing, line-height, paragraph spacing, and text block width.
- Tune infographic roles separately too: statistic card labels/numbers, blue strip text, gray panel text, and context labels.
- Treat statistic card typography rhythm as its own visual check; a correct primary font stack is not sufficient if card number/label spacing, weight, or line rhythm still looks unlike the PDF.
- Treat prose and infographic typography as one readability-first system, not a prose-only font pass.
- Treat context labels as a pair; either both are single-weight labels or both use the same two-level emphasis pattern.
- Do not rely on `::first-line`, nested spans, or equivalent styling that makes only `Буэнос-Айрес` bold.
- Preserve Russian readability, responsiveness, and selectability while moving closer to the source visual rhythm.

## Learning-Relevance Content Rules

- The visible learning document should contain what helps solve exam tickets, not every book-production/source-trace artifact.
- Preserve source/provenance internally for validation, but do not render it unless it is learning-relevant.
- For this section, the bottom paragraph should keep only the conclusion that improving road safety requires everyone in society to work together.
- Remove the visible footnote entirely.
- Remove the visible page marker/page number.
- Remove the blue upper-left semicircle/corner motif because it is book layout decoration, not website learning content.

## Scale And Text Rules

- Increase overall prototype scale before shrinking text.
- The smallest visible Russian text must be comparable to text in existing `Материалы`/study-material surfaces.
- Intro/body explanatory text must be approximately the same size as ordinary body text in `Материалы`; it should not be only barely above a minimum threshold.
- Heading/body typography should use the deliberate modern UI readability stack, not the rejected Avenir-first or SF-rounded/GothamRounded-like attempts.
- Embedded GothamRounded/HelveticaWorld source roles remain documented context, but readable Russian typography now takes precedence over exact source-font mimicry.
- Infographic labels, numbers, cards, blue strips, gray boxes, and context labels should use the same readability-first typography direction too.
- Context labels `В мире` and `В городе Буэнос-Айрес` need consistent computed emphasis; do not partially bold only `Буэнос-Айрес`.
- Line-height, paragraph spacing, letter spacing, and text block width are part of readability and source rhythm, not cosmetic afterthoughts.
- The heading `Дорожная пандемия` should not be forced into a two-line break at normal desktop width by a narrow width constraint.
- Avoid tiny PDF-faithful microtype if it harms learner readability.
- Horizontal scroll is acceptable for fixed-format content composition on small screens.
- Horizontal scroll/pan is acceptable only for the fixed infographic/content block, not for a full blank PDF page canvas.
- Horizontal scroll/pan is also not acceptable for ordinary prose; `heading`, `intro`, and bottom learning conclusion/body must fit narrow and mobile containers.
- Remove visible zoom controls; responsive behavior should be automatic.
- Use plain Russian while preserving source meaning and details.
- Do not insert manual line breaks inside normal intro/body paragraphs to reproduce PDF line wrapping.
- Preserve deliberate line breaks only in fixed infographic/image blocks, labels, or statistic text where layout requires them.
- Do not disable selection/copying on ordinary prose or meaningful statistic labels. Required text roles must have selectable/copyable behavior even when visually positioned over or near image assets.

## Data Shape Guidance

Section data should support:

- `manualNavigationTree` or equivalent full-document ordered collection keyed by source `Índice` group and child ids.
- `manualDestinationLabel: "Руководство"` or equivalent main-app placement metadata for the integrated interactive guide.
- `legacyManualViewerExposure: "hidden"` or equivalent guard proving `Руководство 4R` is not a separate user-facing destination after this feature.
- `deepLinkAliases` or equivalent hash mapping for `#pandemia-vial`, `#intro-enfoque-etico`, `#intro-accidente-incidente`, and `#intro-plan-seguridad-vial` into `Руководство` child entries.
- `navigationSource: "full-indice-hierarchy"` or equivalent evidence that routes are hierarchy/heading-based rather than PDF-page-based or Introduction-tab-only.
- Support entries, chapter/annex group records, and child entries with `kind`, `sourceTitle`, `titleRu`, `sourcePageLabel`, `implementationState`, and optional route/hash.
- Pending/disabled/collapsed state metadata for unimplemented future groups/children.
- Active state metadata/selectors for active group and active child.
- Keyboard/a11y metadata such as accessible label text, current-state semantics, disabled/pending semantics, and mobile disclosure behavior.
- `introSections` or equivalent ordered collection keyed by source `Índice` heading/route id for the currently implemented Introduction children.
- Per-section `sourceSpan` metadata with verified `startPage`, `endPage`, index title, manifest id, source render paths, and verification note.
- Per-section `layoutMode`: `responsive-prose`, `prose-with-callouts`, or `visual-blocks-with-source-assets`, chosen after source inspection.
- `source.referenceAssetPath` and SHA for traceability only.
- `segments` with Spanish source/reference and simple Russian text.
- `languageAdaptation` or equivalent evidence for natural Russian wording, simplified phrasing, and explicit review of the `Plan de seguridad vial` shared-responsibility, Vision Zero, and safe-system paragraphs.
- `localTextFlowTransformations` or equivalent before/after evidence for paragraph merges, complex-sentence splits, and short-sentence combinations, with preserved local order and no global structure change.
- `ticketDetailRetention` or equivalent evidence mapping rewritten Russian content to available local ticket/practice-source details, including preserved named entities, numbers, years, obligations, definitions, conditions, lists, safety principles, and exception words.
- `visualFidelityReport` or equivalent checker output with pass/fail status, source screenshot path(s), Russian screenshot path(s), component/bounding-box metadata, asset presence/source-region checks, style-token checks, navigation-shell checks, and failure notes.
- `visualRegions` for layout roles.
- `styleGuidelines` or equivalent document-family style-token metadata for recurring block types.
- Per-style records for typography family/weights, headline/body sizes, line-height, colors, paddings, margins, border widths/radii, alignment, icon/image positioning, and responsive behavior.
- Blue law/callout style metadata covering background color, left accent stripe, padding, text alignment, font weight, line-height, width behavior, margin cadence, and any source-backed variants.
- `contentRegion` or equivalent framing metadata describing the meaningful source region, excluding non-content PDF-page whitespace.
- prose/infographic role separation so tests can distinguish responsive prose from fixed infographic/image blocks.
- `selectableTextRoles` or equivalent metadata/test selectors for `heading`, `intro`, bottom learning conclusion/body, and meaningful statistic labels.
- `alignmentPairs` or equivalent test selectors for lower city rows:
  - `people-grid-icon` to `male-victims-panel`/`male-victims`
  - `people-pair-icon` to `age-range-panel`/`age-range`
- `panelGeometry` or equivalent metrics for lower and upper statistic panels:
  - pictogram-to-panel horizontal gaps
  - panel width/height ratios and maximum empty-space allowance
  - text top/bottom padding or vertical-balance selectors
  - global-card icon-to-strip/cap attachment selectors for airplane and stadium
  - left/right strip rectangularity selectors or measurements
  - localized cap/rise width and position relative to icon center
  - seam/gap checks between icon/cap and strip/card top
  - paired global-card panel height and bottom-edge alignment measurements
  - gray-card empty-space ratio and text padding metrics
- `typography` metadata/evidence for heading and body:
  - identified embedded/source PDF fonts and role mapping
  - chosen local/offline font family
  - source/license or readability-first stack rationale
  - proof primary stack does not start with Avenir, `SFNSRounded`, `SF Compact Rounded`, or `SF Pro Rounded`
  - heading-width/wrap evidence for `Дорожная пандемия`
  - target roles and computed metrics to verify
- `infographicTypography` or equivalent evidence for statistic labels/numbers/cards, blue strips, gray boxes, and other meaningful infographic labels.
- `contextLabelTypography` or equivalent selectors/evidence proving consistent weight/emphasis for `В мире` and `В городе Буэнос-Айрес`.
- `assets` for isolated crops:
  - `id`
  - `kind`: `cleaned-source-crop`, `svg`, or `css`
  - `localPath` when applicable
  - `sourceRegion`
  - `containsText`: expected `false` for image crops
  - `cleanupStatus`
  - `sourceArtworkMode`: `original-crop`, `cleaned-original`, or `visually-indistinguishable-vector`
  - `fidelityEvidence`: reference/source comparison note, screenshot path, or reviewer check

## Test Plan

Required verification before handoff:

- `pnpm run validate:content`
- focused Node/content test for this prototype
- initial visual source-fidelity checker/harness for Introduction pages, with pass/fail report artifacts
- `pnpm run test`
- `pnpm run build`
- targeted Playwright prototype check, or full `pnpm run test:e2e` when feasible
- `pnpm run preflight` before PR publication/final readiness if Orchestrator assigns it

Required focused assertions:

- Full-document navigation tree includes support entries, Introduction, chapters 1-5, and annexes I-IV from the target source `Índice`.
- Main app navigation exposes the integrated document as `Руководство` and does not expose legacy `Руководство 4R` as a separate user-facing destination.
- The full-document `Índice` hierarchy is rendered inside `Руководство`, not as a separate prototype/experimental block.
- Four Introduction route/navigation entries exist in source `Índice` order as implemented children under the Introduction group and are not raw PDF page links.
- Future unimplemented chapters/annexes are pending/disabled/collapsed placeholders and do not create fake content pages.
- Visible navigation labels are Russian; Spanish source labels and `Pág.` references are preserved in metadata for mapping/QA.
- Navigation is not a flat post/page list and not a one-off horizontal Introduction tab/card bar.
- Each route opens a standalone page for its source heading: `Pandemia vial`, `Enfoque ético - ciudadano en la cultura vial`, `¿Accidente o incidente de tránsito?`, and `Plan de seguridad vial de la Ciudad de Buenos Aires`.
- `Plan de seguridad vial de la Ciudad de Buenos Aires` is one heading route/page across its verified source span, not separate `page-018`, `page-019`, and `page-020` routes.
- Content tests verify the exact source span and Russian coverage for each added heading, including titles, paragraphs, lists/callouts, statistics, and visual labels when present.
- Playwright navigation tests verify route availability, active nav state, source-order nav labels, page-specific screenshots, responsive prose, selectable/copyable Russian text, no full-page raster base, and no mask/overlay translation for each route.
- Playwright navigation tests verify route/hash behavior, active group and active child state, keyboard operation, accessible labels/current-state semantics, mobile/narrow disclosure/usability, and discoverability of the active Introduction item inside the full hierarchy.
- Playwright navigation tests verify `#pandemia-vial`, `#intro-enfoque-etico`, `#intro-accidente-incidente`, and `#intro-plan-seguridad-vial` deep-link into the correct `Руководство` child route, set active state, work on mobile/narrow navigation, and do not reveal duplicate manual destinations.
- Data references `intro-road-pandemic`, page 15, `Дорожная пандемия`, and `Pandemia vial`.
- All visible source text/statistics/labels/numbers are present in Russian.
- Russian wording is natural, simple, and preserves details; it does not read like formal literal translation.
- The `Plan de seguridad vial` shared-responsibility, Vision Zero, and safe-system design paragraphs are explicitly reviewed/reworked for natural Russian while preserving all learning-critical details.
- Ticket-detail retention is checked against available local ticket/practice-source material after simplification; no ticket question/answer/explanation information is removed, weakened, or changed.
- Unclear ticket relevance is handled by preserving the detail or recording an Architect/Analyst decision.
- Local text-flow transformations are checked before/after for preserved order, preserved ticket-critical details, and no accidental global structure change.
- Full page reference image is not rendered as background/base.
- No mask/overlay translation pattern exists.
- No `Вписать` / `100%` controls exist.
- No `Мировой контекст` / `Контекст города` buttons exist.
- Smallest rendered text is comparable to study-material text.
- Intro/body font size is approximately equal to ordinary `Материалы` body text.
- Normal prose paragraphs have no forced PDF-style line breaks and wrap by container width.
- Cropped assets, if used, are local, source-derived, tightly scoped, cleaned of visible Spanish text, and not full-page rasters.
- Pictogram/icon artwork is original source artwork or a visually indistinguishable vectorization; latest rejected clean SVG replacements are absent.
- Page 17 risk-factor/recommendation artwork uses source-derived crops or source-faithful reconstruction with metadata for wind/tree, car, people, panels, label, border, spacing, and proportions; generic symbolic/card replacements are absent and the decorative clipboard/check icon is omitted.
- Page 17 risk cards use source-like long rounded gray/yellow panels with rounded right corners and integrated circular/lobed left edges; pictograms are centered/fully visible inside the lobes with padding; square crop artifacts are absent.
- Page 17 recommendation callout evidence proves tests no longer require the decorative clipboard/check icon, the blue label/border/callout remains aligned and unclipped, and no clipped/reintroduced clipboard fragment is visible.
- Page 17 risk-lobe alpha-framing evidence proves each pictogram alpha center aligns with its circular-lobe center, alpha bounds occupy a source-like fraction of the circle, and source details such as car diagonal support/people lower silhouettes are not accidentally cut.
- Pages 18-20 work-axis/consequences diagrams do not accept generic icon/card replacements when source pictograms/infographics exist.
- Page 18 consequences artwork uses one complete cleaned original PDF infographic crop for the gauge/semi-circle diagram; arcs, sectors, pointer, black fatal-victims wedge/label, beige panels, family/economy, health, institutions icons, connector lines, colors, spacing, and proportions are retained from that crop, not redrawn/reconstructed/reassembled.
- Page 18 consequences composition has screenshot and bounding-box evidence that the cleaned full crop matches the source: gauge/semi-circle continuity, aligned beige sectors, gray outer arc, dark center ring, pointer, black fatality wedge/label, category labels, connector lines, and relative spacing/proportions.
- Page 18 no-distortion checks fail floating fragments, white/gray chunks over arcs, black wedge/text collision, label/connector misalignment, category text collision, broken seams, clipped fragments, stretched crops, disconnected fragments, mismatched geometry, partial crops, componentized assemblies, and residual Spanish/source text.
- Page 18 Russian text-layer evidence proves labels are selectable, source-positioned, free of visible Spanish, and applied over cleaned text areas of the source crop rather than over redrawn diagram geometry.
- Page 18 center-circle overlay evidence proves `ДОРОЖНЫЙ ИНЦИДЕНТ` has no protruding backing rectangle, remains inside the circular field/ring, and does not cover pointer/ring/center-circle geometry.
- Page 18 category-label evidence proves `СЕМЬЯ И ЭКОНОМИКА`, `ИНСТИТУЦИИ`, `ЗДОРОВЬЕ`, and `ПОГИБШИЕ` DOM text is vertically centered in each source label box.
- Page 18 label-geometry evidence proves rendered label-box heights, corners/radii, and source connector relationships remain source-faithful; if Russian text fitting changes width, it does not change height, corner shape, ring, pointer, or connector geometry.
- Page 19 work-axis artwork uses complete source crops for four gray circular fields and exact walking/pedestrian, megaphone, officer/police, and group/people pictograms; generic avatar/approximate symbol replacements are absent.
- Page 19 axis pictograms are complete inside their gray circles at desktop, narrow, and mobile widths, with no cropped quadrants, cut-off icon tips, visible crop-box corners, tight natural crop bounds, parent-overflow clipping, or icon/background coverage.
- Page 19 desktop preserves the source two-column circle/title/text grid; responsive stacking is supported only when needed and keeps icons complete and relationships source-like.
- Page 19 desktop grid evidence proves equal circle diameters, top-row and bottom-row center-y alignment, left/right column center-x alignment, consistent row/column gaps, no title-wrapping-driven circle drift, and no masonry-style uneven layout.
- Infographic Russian text is selectable DOM/SVG text placed in source-faithful positions; no full-page raster, visible Spanish, or wholesale mask/overlay translation is used.
- Source-derived asset metadata records source page/region, crop/reconstruction mode, cleanup status, and screenshot comparison evidence for risk-factor/recommendation and diagram artwork.
- Style guideline/tokens exist for recurring block types, including blue law/callout blocks, and validation proves repeated instances share background, stripe, padding, alignment, font weight, line-height, width behavior, and margin cadence unless a source-backed variant is recorded.
- Post-completion visual source-fidelity checker/harness returns a pass/fail report with source screenshots, Russian screenshots, component/bounding-box metadata, asset presence/source-region checks, and style-token checks.
- The checker fails the PR slice when images, infographics, pictograms, layout, formatting, or style are lost, modified, simplified, replaced, misaligned, recolored, blurred/stretched, or not source-faithful.
- The checker fails the PR slice when source-derived pieces are present but assembled into a distorted, unrecognizable, or non-source-like composition.
- The checker fails the PR slice when source-derived assets exist but visible composition clips, square-crops, covers, force-crops, or misframes required icons inside source circles/lobes.
- Checker evidence includes automated bounding-box checks where practical for image boxes inside intended circles/lobes with padding, `object-fit: contain` or equivalent no-forced-crop behavior, parent overflow safety, and screenshot comparison/manual review evidence.
- The checker explicitly fails on the user-reported classes: page 17 generic risk-factor/recommendation pictograms/cards, page 18 simplified/missing consequences gauge components, page 19 generic/approximate work-axis circular pictograms, blue callout alignment/style drift, and non-scalable/duplicate full-document navigation shell.
- Rendered section is cropped/reframed to the meaningful content block and does not include huge blank PDF-page whitespace.
- Desktop screenshot shows readable normal-density content, not a tiny centered island.
- Mobile screenshot starts on content; any horizontal scroll/pan is limited to the fixed infographic block.
- `heading`, `intro`, and bottom learning conclusion/body have no horizontal clipping/overflow at the in-app/narrow viewport and mobile viewport.
- Ordinary prose is not inside the horizontal scrolling/panning infographic container.
- Source-derived PNG/crop assets remain in use where required, and rejected SVG runtime references are absent.
- `heading`, `intro`, bottom learning conclusion/body, and meaningful statistic labels are selectable/copyable text, not rasterized image pixels.
- Computed styles for required text roles do not disable `user-select` or `pointer-events`.
- Browser selection APIs or equivalent Playwright checks can select representative prose and statistic labels.
- Lower city row top alignment is within a small tolerance for `people-grid-icon` versus `male-victims-panel`/`male-victims`.
- Lower city row top alignment is within a small tolerance for `people-pair-icon` versus `age-range-panel`/`age-range`.
- Lower city row pictogram-to-panel horizontal gap is source-like and verified by bounding boxes.
- Lower city gray panel proportions and empty-space ratios are source-like; panels are not overly tall or sparse.
- Lower city gray panel text has source-like top/bottom padding or vertical balance.
- Lower city full-row geometry checks compare panel top, vertical center, bottom, and height against the matching pictogram group; top-edge checks alone are insufficient.
- Lower city gray panel empty-space ratio and bottom whitespace are bounded relative to the panel text block.
- Grouped visual non-regression checks rerun all previously accepted visual feedback whenever upper/global card fixes are made.
- Upper global card gray-box density and panel proportions are source-like.
- Airplane/stadium icon-to-blue-strip attachment/cap geometry is verified with bounding boxes and screenshots.
- Blue strip cap geometry is verified as localized: left/right strip portions remain rectangular/flat and the rounded cap/rise is limited to the icon center area.
- Icon/cap/strip seam is absent; bounding boxes or screenshot/pixel checks prove the elements visually touch.
- Paired global cards have equal panel heights and aligned bottom edges within tolerance.
- Gray-card empty-space ratio is bounded and text top/bottom padding is source-like.
- Heading/body computed typography is recorded: font family, weight, line-height, and letter spacing.
- Intro/body paragraph rhythm is recorded: line-height, paragraph spacing, and text block width.
- Embedded/source PDF font identities are recorded before typography selection; for this section, GothamRounded roles are source context, and the final decision documents readability-first typography.
- The chosen modern UI readability stack and fallback order are recorded with rationale.
- Primary Pandemia font stack does not start with Avenir, `SFNSRounded`, `SF Compact Rounded`, or `SF Pro Rounded`; tests reject these first-family orderings.
- The `Дорожная пандемия` heading is not forced into two lines at normal desktop width by a narrow heading constraint.
- Infographic/card/number/label computed typography is recorded, including blue strip and gray panel text.
- Statistic card font rhythm is compared visually to the PDF; current font-stack evidence alone does not satisfy this if the cards still look off.
- Context labels have consistent computed font weight across each full label, or any two-level treatment is documented and symmetric across both labels.
- No asymmetric `::first-line`, nested-span, or equivalent partial styling creates city-name-only bolding.
- No remote font dependency exists; local font source/license or readability-first stack rationale is recorded.
- Fresh screenshots show typography comparison after font/rhythm tuning.
- City circle icons are fully visible and do not overlap with labels/text/backgrounds.
- City circle icons use original motorcyclist/pedestrian/car artwork crops or high-fidelity cleaned originals.
- `8 из 10` people-grid visual shows 8 male pictograms and 2 female pictograms while preserving original silhouette/style.
- No visible source/provenance, footnote, page marker/page number, or blue upper-left book motif remains for this section.
- Bottom paragraph contains the learning-relevant conclusion only.
- Automated bounding-box checks prove no text overflow and no element overlap.
- Specific overlap checks cover infographic/circle text versus icon crops, circles/indicators versus below icons/rows, and lower paragraph area versus any footnote/page-marker remnants.
- Playwright screenshots show desktop and mobile readability and source-faithful visuals.

## Reusable PDF-Section QA Checklist

Apply this checklist to future PDF-section-to-Russian-web conversions:

- Full manual IA: navigation uses the full source `Índice` hierarchy with support entries, chapter/annex groups, and child entries; do not build one-off flat tabs for a single section group.
- Main app guide destination: the interactive Russian document is exposed as `Руководство` and replaces the visible `Руководство 4R` manual-viewer destination.
- No duplicate manuals: visible navigation must not show both `Руководство 4R` and the new interactive document as separate guide/manual choices.
- Placeholder behavior: unimplemented groups/children are pending/disabled/collapsed or otherwise non-content placeholders; they must not pretend to be implemented pages.
- Navigation metadata: Russian labels are visible; Spanish source labels and page refs are retained as data for mapping/QA.
- Navigation accessibility: route/hash links, active group/child state, keyboard operation, accessible labels/current state, and mobile/narrow usability are required checks; existing Introduction hashes must enter the `Руководство` hierarchy.
- Natural Russian: avoid formal literal translation; use common Russian wording and short/direct phrasing understandable to younger learners while preserving official meaning.
- Ticket-detail retention: any simplification is followed by a check against local ticket/practice-source material; preserve or explicitly dispose details whose ticket relevance is unclear.
- Local text-flow optimization: merge adjacent paragraphs, split complex sentences, or combine short sentences only within the local text flow; do not change section/block-level structure or source order.
- Visual-feedback durability: every accepted visual issue from user/reviewer/Orchestrator/browser QA becomes a reusable requirement, validation checklist item, and evidence expectation before handoff.
- PDF/reference: use the PDF fragment as mockup/reference only; never render a full-page raster base.
- Section framing: do not render a full PDF page canvas or huge blank page margins; crop/reframe to the meaningful content block.
- Web density: desktop content is readable and normally dense, not a tiny centered island; mobile begins on content and avoids blank-start whitespace.
- Prose flow: `heading`, `intro`, and bottom learning conclusion/body wrap in responsive web flow and never require horizontal scrolling.
- Scroll scope: horizontal scroll/pan is limited to fixed infographic/image blocks.
- Selectable text: ordinary Russian prose and meaningful statistic labels are selectable/copyable; the section does not behave like an image preview.
- Interaction styles: required text roles do not use `user-select: none`, `pointer-events: none`, or equivalent blockers.
- Lower city alignment: matching left pictogram blocks and right gray statistic panels start at the same vertical level within a small tolerance.
- Alignment checks: verify `people-grid-icon` with `male-victims-panel`/`male-victims`, and `people-pair-icon` with `age-range-panel`/`age-range`.
- Full-row geometry checks: lower gray panels must preserve source-like top/center/bottom/height relationships to their pictogram groups; top-edge checks alone are not sufficient.
- Lower-row empty-space checks: bound panel height, empty-space ratio, and bottom whitespace relative to the icon group and text block.
- Grouped non-regression checks: fixes in one region rerun all prior visual QA so repeated user-reported issues become stricter guards.
- Horizontal gap checks: paired pictogram/statistic rows preserve source-like gap between icon block and gray panel.
- Panel proportion checks: gray statistic panels preserve source-like height/width ratios and avoid excessive empty area.
- Internal padding checks: statistic-panel text is vertically balanced with source-like top/bottom padding, not pinned to the top.
- Card density checks: global statistic cards preserve source-like compactness and number/label rhythm; a general font-stack pass is not sufficient.
- Icon-strip attachment checks: airplane/stadium pictograms visually attach to the blue strip/cap geometry; detached-looking crops fail.
- Local cap checks: the attachment cap must be localized near the icon center; full-width rounded pill/dome strips fail.
- Seam/gap checks: icon/cap/strip/card top must touch visually, with no white seam above the strip.
- Paired-card checks: global statistic card panels have equal heights and aligned bottom edges/baseline grid.
- Empty-space checks: global gray-card unused lower area is bounded and text padding is source-like.
- Typography decision: identify embedded/source PDF fonts before choosing the web typography for each future section, then choose the best localized reading experience.
- Readability-first fallback: when PDF font imitation harms Russian readability/visual quality, prefer a modern UI stack: `system-ui`, `-apple-system`, `BlinkMacSystemFont`, `"Segoe UI"`, `Roboto`, `"Noto Sans"`, `"Helvetica Neue"`, Arial, sans-serif, or an equivalent local readable font.
- Rejected stack guard: do not accept Avenir-first or SFNSRounded/SF Compact Rounded/SF Pro Rounded-first ordering after the user's rejection unless a later explicit decision changes it.
- Heading wrap guard: do not force/narrow the heading so `Дорожная пандемия` breaks at normal desktop width.
- Typography metrics: record computed font family/weight/line-height for heading and intro/body, plus visual screenshots.
- Unified section typography: apply the same readability-first system to prose, statistic cards, gray boxes, blue strips, labels, and numbers unless a source-faithful distinction is documented.
- Infographic typography metrics: record computed font family/weight/line-height/letter spacing for statistic cards, numbers, blue strips, gray boxes, and meaningful labels.
- Context label consistency: no partial bolding of only the city name; `В мире` and `В городе Буэнос-Айрес` use the same emphasis logic, verified by computed weights or pseudo-style absence.
- Native text: Russian text is DOM/SVG/text; no mask-over-Spanish-source and no overlay translation.
- Visual assets: use original PDF/source artwork for pictograms/icons/images whenever possible, preferably high-resolution local crops from the PDF or best available source render; crops are traceable, text-free/cleaned, tightly scoped, and not full-page rasters.
- Source-art preservation: preserve source images/infographics/pictograms/diagrams 1:1; do not redesign cards, substitute generic icons, or modify pictograms when the source artwork exists.
- Page 17 guard: `Factores de Riesgo` / `Recomendaciones` must preserve the original wind/tree, car, people, gray/yellow panels, blue recommendation label, border, spacing, and proportions, with no generic person/avatar icons; the decorative recommendation clipboard/check icon is intentionally omitted.
- Pages 18-20 guard: work-axis/consequences diagrams require source-derived artwork metadata/crops and screenshot comparison; generic icon replacements fail final acceptance.
- Page 18 guard: `Consecuencias de los Incidentes de tránsito` must preserve the source gauge/semi-circle diagram through a complete cleaned source crop; black fatal-victims wedge/label, beige panels, family/economy, health, institutions icons, pointer, connector lines, colors, spacing, and proportions are retained from the source crop. Simplified cards, altered chart geometry, CSS/SVG/native redraw, component reassembly, partial crops, and residual Spanish/source text fail.
- Page 19 guard: `Ejes de trabajo` must preserve the source four gray circular fields and exact walking/pedestrian, megaphone, officer/police, and group/people pictograms, icon sizes/placement, blue title style, title/circle/text relationships, grid spacing, and proportions; generic avatars and approximate symbols fail. Pictogram crops must include padding/transparent area so no natural icon content touches crop bounds or appears clipped.
- Cleanup discipline: clean source artwork only where visible source text must be removed for Russian DOM/SVG text.
- No generic replacements: do not substitute source pictograms/icons with newly designed generic/reconstructed SVGs when they visibly differ from the PDF.
- Style-token guard: add every recurring style element to the document style guideline before acceptance and validate repeated blocks against source-derived tokens.
- Blue callout guard: blue law/callout blocks share background color, left accent stripe, padding, text alignment, font weight, line-height, width behavior, and margin cadence; accidental mixed alignment fails.
- Vectorization threshold: vectorized artwork is accepted only when visually indistinguishable from the source and backed by comparison evidence.
- Post-completion visual checker: run an artifact-backed source-vs-Russian visual fidelity checker/harness before claiming done; it must produce pass/fail output and fail on lost/modified artwork, generic replacements, lost formatting/layout/style, inconsistent style tokens, and navigation-shell regressions.
- Learning relevance: visible content excludes source/provenance, footnotes, page markers, and book-only motifs unless needed for ticket solving.
- Russian language: natural, simple learner-facing wording with ticket-relevant numbers/details preserved.
- Readability: smallest text comparable to study-material text; no microtype.
- Intro/body parity: main explanatory text matches ordinary `Материалы` body text size.
- Paragraph wrapping: normal prose has no forced line breaks that mimic PDF wrapping; container width controls line breaks.
- UI restraint: remove nonessential zoom/focus/context controls unless explicitly requested.
- Layout fit: no text overflow and no element overlap.
- Overlap specifics: text inside infographic/circles does not collide with icon images; circles/indicators do not collide with below icons/rows; bottom paragraph/footnote/page marker areas do not collide.
- Circle icon fidelity/visibility: city circle icons are original motorcyclist/pedestrian/car artwork crops or high-fidelity cleaned originals, fully visible, and not covered by text/backgrounds.
- Pictogram semantics/fidelity: people-grid assets must preserve source meaning and original silhouette/style; for this section, `8 из 10` is 8 male pictograms plus 2 female pictograms.
- Evidence: automated overlap/bounding-box checks plus screenshot review are required; DOM/content checks alone are insufficient.
- Process memory: record user-found and fixed issues as reusable checklist items. The user-found circle overlap bug from this iteration is a standing future-section checklist item.

## Review Plan

Review Agent should check:

- Scope remains the four listed Introduction `Índice` headings, not a whole-document conversion.
- Navigation is based on source `Índice` headings and exposes four separate route/nav entries in source order.
- Main app placement exposes the interactive Russian document as `Руководство`, removes user-facing `Руководство 4R` as a separate destination, and nests the full `Índice` hierarchy inside `Руководство`.
- Existing Introduction hashes deep-link into `Руководство` child content with correct active state on desktop and mobile.
- Natural Russian adaptation, including the Plan shared-responsibility, Vision Zero, and safe-system paragraphs.
- Ticket-detail retention evidence against local ticket/practice-source material after simplification.
- Before/after evidence for any local paragraph/sentence transformations, proving preserved order/details and no global structure change.
- Added sections have source-span evidence from index/manifests/PDF renders before implementation acceptance.
- Text-heavy added sections use responsive prose and preserve source hierarchy/order; any visual blocks use source-derived assets and selectable Russian DOM/SVG text.
- Source/content/statistic coverage.
- Native rebuild and no rejected full-page raster/mask/overlay model.
- Content-region framing without full PDF-page blank canvas, huge whitespace, or tiny centered island.
- Desktop/mobile screenshot evidence for normal web density and no blank initial mobile view.
- Responsive prose at in-app/narrow and mobile viewport widths with no horizontal clipping/scroll.
- Horizontal scroll scoped to infographic/image blocks only.
- Selectable/copyable Russian prose and meaningful statistic labels.
- Computed style and selection API evidence for required text roles.
- Lower city row top alignment for `8 из 10` and `49%` panels against matching pictogram blocks.
- Lower city pictogram-to-panel horizontal gaps, gray-panel proportions, and internal text padding/vertical balance.
- Upper global card density, card font rhythm, and airplane/stadium icon-to-strip attachment/cap geometry.
- Localized cap geometry evidence proving the strip remains rectangular at left/right and is not a full-width rounded dome.
- Seam/gap, paired-card equal-height/bottom-alignment, and gray-card empty-space-ratio evidence.
- Lower city full-row geometry and empty-space/bottom-whitespace evidence, beyond top-edge alignment.
- Grouped non-regression evidence showing prior visual feedback checks reran after the latest fixes.
- Readability-first local/offline typography and computed heading/body metrics.
- Embedded PDF font identification evidence plus rationale for the final modern UI readability stack.
- A primary Pandemia font stack that does not start with Avenir, `SFNSRounded`, `SF Compact Rounded`, or `SF Pro Rounded`.
- Natural heading wrap evidence showing `Дорожная пандемия` is not forced into two lines at normal desktop width.
- Readability-first infographic typography metrics for cards, numbers, blue strips, gray boxes, and labels.
- Context-label weight/emphasis consistency, including absence of city-name-only bolding.
- Fresh screenshots for typography comparison.
- Minimum text scale/readability.
- Intro/body font parity with ordinary `Материалы` text.
- Normal prose paragraph flow without forced PDF-style line breaks.
- Icon/image fidelity: original source artwork crops or visually indistinguishable cleaned originals, not generic/reconstructed SVGs.
- Evidence that latest rejected clean SVG replacements have been removed or replaced.
- Page 18 `Consecuencias de los Incidentes de tránsito` source fidelity: original gauge/semi-circle diagram, black fatal-victims wedge/label, beige panels, family/economy/health/institutions icons, pointer, connector lines, colors, geometry, spacing, proportions, and screenshot comparison.
- Page 19 `Ejes de trabajo` source fidelity: original four gray circular fields, exact walking/pedestrian, megaphone, officer/police, and group/people pictograms, icon sizes/placement, blue title style, text placement, two-column grid spacing, proportions, and screenshot comparison.
- Style-guide coverage: recurring block types have source-validated style tokens; blue law/callout blocks share background, left stripe, padding, alignment, font weight, line-height, width behavior, and margin cadence unless a source-backed variant is recorded.
- Post-completion visual source-fidelity checker/harness pass/fail report with artifact evidence, and failure on the reported source-art/layout/style/navigation regression classes.
- City circle icon visibility and `8 из 10` pictogram semantic accuracy.
- Removed scale controls and context buttons.
- Natural, simple Russian wording without loss of meaning/details.
- Durable checklist coverage for every accepted visual issue so future section conversions inherit the guardrails.
- Removed visible source/provenance, footnote, page marker, and book motif where not ticket-relevant.
- Automated no-overlap/bounding-box checks, including the user-found circle overlap class of bugs.
- Local-first asset handling and tests.

## Architect Planning Status

- Previous mask/page-image-background approach marked rejected: complete.
- Native rebuild requirement recorded: complete.
- Latest prototype feedback incorporated: complete.
- Implementation tasks updated: complete.
- Runtime/code/test changes: pending Orchestrator assignment to Implementation Agent.

## Architect Handoff - Documentation And Merge Preparation

The feature memory now contains a canonical transfer contract in `spec.md` under `Architect Consolidation - Current Transfer Contract`. Implementation Agent must not treat the historical checklist as enough; before PR handoff, the reusable guidance has to be durable project documentation and the current implementation has to be verified against it.

### Required Durable Docs Update

Implementation Agent must add or update durable frontend documentation, preferably:

- `docs_project/project/frontend/manual-conversion-guidelines.md` - new reusable guide for PDF/manual-fragment to Russian interactive web conversion.
- `docs_project/project/frontend/frontend-docs.md` - link or short section pointing to the new guide and naming `Руководство` as the current interactive manual destination.

The durable guide must include:

- source PDF as mockup/reference, not runtime PDF/full-page raster/image-only page;
- source `Índice` heading routes and full `Руководство` hierarchy;
- natural/simple Russian simplification rules plus ticket-critical detail retention;
- selectable DOM/SVG text expectations;
- source artwork preservation rules;
- forbidden broad masks/square patches/DOM plates;
- source-crop and local inpaint/cleanup discipline;
- page 17, page 18, page 19 named no-regression fixtures;
- typography/readability guidance;
- recurring style-token requirements;
- visual checker pass/fail contract.

### Required Implementation/Verification Handoff

Before commit/PR handoff, Implementation Agent must:

- confirm Pandemia text uses the same Introduction article shell as `Этико-гражданский подход...` and `Авария или дорожный инцидент?`;
- preserve the current Pandemia infographic without restyling or source-artwork changes while applying the article shell to prose/background/padding/font rhythm;
- run at minimum:
  - `node --test tests/content-pandemia-vial-section.test.mjs`
  - `pnpm exec tsc --noEmit`
  - `pnpm run build`
  - `pnpm exec playwright test tests/e2e/app.spec.ts -g "Pandemia vial prototype|Introduction index routes"`
  - `git diff --check`
- capture or preserve screenshot/checker evidence for the current `#pandemia-vial`, `#intro-accidente-incidente`, and `#intro-plan-seguridad-vial` states, with special attention to page 17/18/19 no-regression fixtures;
- record verification output and any implementation feedback in `tasks.md`;
- ensure no unresolved Implementation Agent feedback remains for Architect disposition;
- stage/commit/push/open PR only after docs, product diffs, assets, tests, and feature memory are aligned.

### Merge-Gate Notes For Orchestrator

Final validation must occur after the implementation/docs commit is ready:

- Architect final validation must validate the effective content head and write only Architect-owned process memory.
- Analyst final validation must occur after Architect passes and write only Analyst-owned validation notes.
- Any later validation-evidence-only commit must be guarded by Orchestrator before merge; any non-evidence change after validation makes validation stale.
