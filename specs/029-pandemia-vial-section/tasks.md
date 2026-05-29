# Tasks: Native Russian Introduction Section Rebuild

## Status Legend

- `[x]` Complete
- `[ ]` Pending

## Architect Planning Tasks

- [x] Read Analyst intake in `specs/029-pandemia-vial-section/feature-request.md`.
- [x] Review relevant project memory and manual-source context.
- [x] Verify planned source anchor: `intro-road-pandemic`, page 15, `Pandemia vial` / `Дорожная пандемия`.
- [x] Record prior rejection: no full-page raster base, no masks over Spanish text, no Russian overlay translation on original page image.
- [x] Incorporate latest user feedback: larger scale, source-faithful cropped assets preferred over poor SVG redraws, remove scale/context controls, simplify Russian wording while preserving source details.
- [x] Incorporate newest user feedback: remove visible non-ticket source/provenance, footnote, page marker, upper-left book motif, and add reusable future-section checklist including automated no-overlap checks.
- [x] Incorporate newest visual feedback: intro/body font parity with `Материалы`, fully visible city circle icons, and semantically accurate `8 male + 2 female` people-grid.
- [x] Incorporate paragraph-flow feedback: normal prose paragraphs must not use forced line breaks to mimic PDF wrapping; only fixed infographic/image blocks may keep deliberate layout line breaks.
- [x] Incorporate latest asset-fidelity rejection: current clean SVG replacements look redrawn/different and must be replaced by original PDF/source artwork crops or visually indistinguishable high-fidelity cleaned originals.
- [x] Incorporate latest layout/framing rejection: current browser preview looks like a small data fragment on a huge blank PDF page; implementation must crop/reframe to the meaningful content block with normal web margins/density.
- [x] Incorporate live-browser responsive-prose rejection: reframing alone is insufficient when a fixed-width canvas clips or horizontally scrolls ordinary prose at narrow in-app widths.
- [x] Incorporate selectable-text rejection: Russian prose and meaningful statistic labels must be selectable/copyable text, not image-preview pixels or text with disabled selection.
- [x] Incorporate lower-city-row alignment feedback: `8 из 10` and `49%` gray rows must start at the same vertical level as their matching left pictogram blocks.
- [x] Incorporate earlier typography feedback: heading/body initially targeted source PDF rounded/geometric sans rhythm, later superseded by the readability-first direction where it conflicts.
- [x] Incorporate infographic typography/context-label feedback: statistic cards, blue strips, gray boxes, labels/numbers need the same current section typography treatment and context labels need consistent weight/emphasis.
- [x] Incorporate Orchestrator durable-QA clarification: every accepted visual issue becomes a reusable requirement, validation checklist item, and evidence expectation for future PDF-section conversions across the document.
- [x] Incorporate latest font-identity feedback: source embedded fonts are GothamRounded/HelveticaWorld, Avenir-first is rejected, and future sections must identify embedded PDF fonts before selecting typography.
- [x] Incorporate latest infographic geometry/density feedback: lower city gaps/panel proportions/text padding, upper global-card density/card rhythm, and icon-to-strip attachment/cap geometry require reusable checks.
- [x] Incorporate latest cap-geometry feedback: icon-to-strip attachment must use localized central cap/rise on a rectangular strip, not a full-width rounded pill/dome.
- [x] Incorporate latest global-card seam/alignment feedback: no white seam, rectangular panel preservation, equal paired-card heights/bottom alignment, and bounded gray-card empty-space ratio.
- [x] Incorporate repeated lower-city-row regression feedback: top-edge checks are insufficient; source row geometry, panel density, and grouped non-regression checks are required.
- [x] Incorporate newest readability-first typography change: SF-rounded/Gotham-like imitation and forced heading wrap are rejected; use a modern UI readability stack.
- [x] Incorporate current scope extension: keep `Pandemia vial` as one route, add separate Introduction routes for `Enfoque ético - ciudadano en la cultura vial`, `¿Accidente o incidente de tránsito?`, and `Plan de seguridad vial de la Ciudad de Buenos Aires`, and navigate by source `Índice` headings rather than PDF pages.
- [x] Record that this extension is allowed in active feature 029 because it directly follows the original staged rollout: after approving `Pandemia vial`, implement several more blocks before any whole-document conversion.
- [x] Incorporate latest source-artwork preservation feedback: page 17 risk-factor/recommendation native symbolic cards are rejected, all source images/infographics/pictograms must be preserved 1:1, and pages 18-20 diagrams inherit the no-generic-replacement guard.
- [x] Incorporate latest `intro-plan-seguridad-vial` feedback: page 18 consequences gauge diagram and page 19 work-axis circular pictogram grid require 1:1 source-faithful preservation and must reject generic replacements.
- [x] Incorporate latest recurring-style feedback: repeated block types need reusable style tokens/guidelines, and blue law/callout blocks must not drift between centered and left-aligned styles without source evidence.
- [x] Incorporate latest full-manual navigation IA feedback: navigation must be hierarchical and scalable for the future full Russian interactive manual, with current Introduction routes as populated children inside the full source `Índice` tree.
- [x] Incorporate latest main-app guide placement feedback: the interactive Russian manual lives in `Руководство`, replaces user-facing `Руководство 4R`, preserves existing Introduction hashes, and must not create duplicate manual destinations.
- [x] Incorporate latest Russian adaptation feedback: use natural/simple Russian rather than formal literal translation, especially for the Plan shared-responsibility, Vision Zero, and safe-system paragraphs.
- [x] Incorporate latest ticket-detail retention feedback: simplification must be checked against local ticket/practice-source material and cannot silently drop unclear ticket-relevant details.
- [x] Incorporate latest post-completion visual checker feedback: Introduction pages need an artifact-backed source-vs-Russian visual fidelity checker/harness with pass/fail output before Implementation Agent claims done.
- [x] Incorporate latest local text-flow clarification: adjacent paragraphs/sentences may be locally merged, split, or combined for clarity, but section/block order, lists, diagrams, and navigation must not be globally rearranged.
- [x] Incorporate latest page 18 distortion blocker: source-derived pieces are not enough when the assembled consequences diagram is distorted, unrecognizable, overlapping, fragmented, or non-source-like.
- [x] Incorporate latest page 17/page 19 clipping and geometry blockers: source assets/metadata are not enough when risk cards, recommendation icons, or axis pictograms are clipped, square-cropped, covered, misframed, or non-source-like.
- [x] Incorporate latest page 17 clipboard/notebook omission and page 18 label/center-artifact blockers as reusable checklist rules while preserving prior clipboard-preservation history as superseded.
- [x] Update acceptance criteria, implementation tasks, negative scenarios, review requirements, and known risks.

## Current Introduction Scope Extension Tasks

These tasks extend the active feature scope. They do not supersede any accepted `Pandemia vial` requirement; all reusable Pandemia QA guards remain required for every new Introduction page.

- [x] Preserve `Pandemia vial` as a standalone page/route and keep its accumulated QA checklist, rejected approaches, pending guards, and evidence expectations.
- [x] Add a standalone page/route for `Enfoque ético - ciudadano en la cultura vial`.
- [x] Add a standalone page/route for `¿Accidente o incidente de tránsito?`.
- [x] Add a standalone page/route for `Plan de seguridad vial de la Ciudad de Buenos Aires`.
- [x] Build document navigation from source `Índice` headings rather than raw PDF pages; the visible Introduction navigation must list the four current headings as separate items in source order.
- [x] Replace any one-off horizontal Introduction list/tab/card navigation with a scalable full-document navigation shell/data model based on the source `Índice` hierarchy.
- [x] Mount the integrated Russian interactive document under the main app block/tab labeled `Руководство`.
- [x] Remove or hide the legacy `Руководство 4R` manual-viewer entry/view from user-facing navigation so it is not a separate current guide destination.
- [x] Ensure the full-document `Índice` navigation shell belongs inside `Руководство`, not a prototype/experimental/Introduction-only destination.
- [x] Add top-level/support navigation entries for `Presentación` / `Предисловие` and `Glosario` / `Глоссарий`.
- [x] Add full-document navigation groups for `INTRODUCCIÓN`, chapters 1-5, and annexes I-IV, preserving source Spanish titles and `Pág.` references as metadata.
- [x] Place the four implemented Introduction routes as active/navigable children under `INTRODUCCIÓN` / `Введение`.
- [x] Represent unimplemented future groups/children as pending/disabled/collapsed placeholders without creating content pages for them.
- [x] Use Russian visible navigation labels while preserving Spanish source labels/page refs in data for mapping/QA; do not render source/provenance clutter inside content pages.
- [x] Ensure direct route/hash navigation still works for the four implemented Introduction sections from inside the full hierarchy.
- [x] Preserve existing direct hashes `#pandemia-vial`, `#intro-enfoque-etico`, `#intro-accidente-incidente`, and `#intro-plan-seguridad-vial` as deep links into the appropriate `Руководство` child content.
- [x] Ensure hash navigation sets active `Руководство`, active `Введение`, and active child state on desktop and mobile.
- [x] Keep `Plan de seguridad vial de la Ciudad de Buenos Aires` as one heading route/page across its verified source span, not as separate page 18/19/20 routes.
- [x] Verify and record exact source spans before building:
  - `intro-road-pandemic`: `Pandemia vial`, currently manifest range `15-15`;
  - `intro-ethical-civic-approach`: `Enfoque ético - ciudadano en la cultura vial`, currently manifest range `16-16`;
  - `intro-incident`: `¿Accidente o incidente de tránsito?`, currently manifest range `17-17`;
  - `intro-road-safety-plan`: `Plan de seguridad vial de la Ciudad de Buenos Aires`, currently manifest range `18-20`.
- [x] For each added heading, inspect source `Índice`, `navigation.ru.json`, `manual.ru.json`, `layout.ru.json`, and local PDF renders before implementation; record title text, page span, content order, page-local subheadings, visual blocks/images, and omitted book-layout/provenance artifacts.
- [x] For `Enfoque ético - ciudadano en la cultura vial`, implement primarily as normal responsive Russian prose/list/callout layout unless source inspection finds visual blocks requiring source crops.
- [x] For `¿Accidente o incidente de tránsito?`, implement primarily as normal responsive Russian prose/list/callout layout unless source inspection finds visual blocks requiring source crops.
- [x] For `Plan de seguridad vial de la Ciudad de Buenos Aires`, inspect pages 18-20 for visual blocks/callouts/graphics before choosing prose-only versus source-crop treatment; preserve the source hierarchy across the full heading span.
- [x] For any added section visual block, use source-derived/cleaned local assets for artwork and keep Russian learning text selectable/copyable as DOM/SVG text.
  - Rejected Architect disposition: page 20 photo uses a local source crop without the Spanish quote, but page 17 risk-factor/recommendation and page 19 work-axis native symbolic blocks are not acceptable final work. Exact cleaned source crops/source-faithful reconstructions must replace generic symbolic cards/icons before acceptance.
- [x] Ensure every added page uses simple learner-facing Russian while preserving all ticket-relevant source details, numbers, named concepts, legal references, lists, and callouts.
- [x] Rewrite/review Russian prose so it reads as natural common Russian, not formal literal translation; use short/direct phrasing understandable to younger learners where possible.
- [x] Apply local text-flow simplification where useful: merge adjacent paragraphs, split complex sentences, or combine short sentences when this makes Russian shorter and clearer.
- [x] Keep text-flow optimization local: preserve source section/block order and do not rearrange sections, lists, diagrams, navigation, or source heading order.
- [x] Specifically rewrite/review the three `Plan de seguridad vial` paragraphs on shared road-safety responsibility, Vision Zero, and safe-system design while preserving all details.
- [x] After simplification, compare rewritten content against available local ticket/practice-source material and verify no ticket question/answer/explanation detail was removed, weakened, or changed.
- [x] Record before/after evidence for local text transformations and verify preserved local order, preserved ticket-critical details, and no accidental global structure change.
- [x] Preserve or record Architect/Analyst disposition for any named entity, number, year, obligation, definition, condition, list, safety principle, exception word, or other detail whose ticket relevance is unclear.
- [x] Ensure every added page omits visible source/provenance, page markers/page numbers, footnotes, and book-only decorative motifs unless specifically needed for exam learning.
- [x] Ensure every added page has responsive prose without forced PDF-style line breaks and no horizontal scrolling for ordinary text.
- [x] Ensure every added page uses readable local/offline UI typography and records computed font evidence where tests cover typography.
- [x] Ensure every added page has selectable/copyable Russian headings, body text, list items, callouts, and meaningful visual/stat labels.
- [x] Ensure no added page renders a full PDF page raster, PDF viewer, iframe/object/embed, mask-over-Spanish text, or Russian overlay translation on the original Spanish page.

## Current Introduction Verification Checklist

- [x] Content tests assert all four route ids, source `Índice` labels, Russian titles, verified page spans, and route order.
- [x] Content tests assert source coverage for each added heading: title, all learning-relevant paragraphs, lists, callouts, statistics/numbers, visual labels when present, and omission of non-ticket source/book artifacts.
- [x] Content tests reject raw page-number navigation as the primary Introduction document navigation.
- [x] Content tests verify `Plan de seguridad vial de la Ciudad de Buenos Aires` remains one heading route across pages 18-20.
- [x] Content tests verify no visible Spanish primary text remains in any added page or cleaned visual asset.
- [x] Content tests verify no runtime PDF viewer, full-page raster base, mask, overlay translation, remote fetch, backend, or live-AI pattern is introduced.
- [x] Playwright tests open each Introduction route directly and through navigation.
- [x] Playwright tests verify navigation labels/order/active state match source `Índice` headings.
- [x] Tests verify the full-document navigation tree includes support entries, Introduction, chapters 1-5, and annexes I-IV with source Spanish metadata and Russian visible labels.
- [x] Tests reject flat post/page-only navigation and one-off horizontal Introduction tab/card bars that cannot scale to the full `Índice`.
- [x] Tests verify unimplemented future groups/children are pending/disabled/collapsed placeholders and do not create fake content pages.
- [x] Tests verify route/hash behavior, active group and active child state, keyboard navigation, accessible labels/current-state semantics, mobile/narrow usability, and active Introduction item discoverability inside the full hierarchy.
- [x] Tests verify the main app guide destination label is `Руководство` and legacy `Руководство 4R` tab/link text is not exposed as a separate user-facing destination.
- [x] Tests verify no duplicate manual/guide destinations exist after the interactive document is mounted.
- [x] Tests verify existing hashes `#pandemia-vial`, `#intro-enfoque-etico`, `#intro-accidente-incidente`, and `#intro-plan-seguridad-vial` deep-link into `Руководство` child content and preserve active state.
- [x] Tests verify mobile/narrow navigation still exposes the active Introduction child inside `Руководство` without falling back to an isolated tab strip.
- [x] Tests/checks verify simplified Russian still preserves ticket-critical details by comparing against available local ticket/practice-source material.
- [x] Tests/checks fail if simplification removes or changes named entities, numbers, years, obligations, definitions, conditions, lists, safety principles, or exception words from ticket-relevant content.
- [x] Review/checker evidence compares before/after local text transformations and verifies preserved local order, preserved ticket-critical details, and no accidental global structure change.
- [x] Visual source-fidelity checker/harness runs after implementation and records source screenshots, Russian screenshots, component/bounding-box metadata, asset presence/source-region checks, style-token checks, navigation-shell checks, and pass/fail report.
- [x] Visual checker fails on lost/modified source images, generic icon replacement, lost formatting/layout/style, inconsistent style tokens, and the reported page 17/page 18/page 19/navigation regression classes.
- [x] Playwright tests verify each added route starts on meaningful content, not blank PDF-page whitespace.
- [x] Playwright tests verify heading/body/list/callout text on every added route wraps responsively at desktop, narrow in-app, and mobile viewports without horizontal clipping or document-level horizontal scroll.
- [x] Playwright tests verify selectable/copyable text behavior for each added route using computed `user-select`, `pointer-events`, and selection API or equivalent.
- [x] Playwright tests verify any horizontal scroller is limited to fixed visual blocks and excludes ordinary prose.
- [x] Playwright tests verify no zoom/context/source/provenance/page controls appear.
- [x] Playwright screenshots are captured for all four Introduction routes at desktop and mobile, with additional narrow screenshots when layout risk is high.

## Latest Source-Artwork Preservation Correction Tasks

These tasks supersede any evidence that accepted native symbolic/card replacements because exact cleaned source crops were not yet extracted. The latest user feedback explicitly rejects that compromise.

- [x] Mark current page 17 `Factores de Riesgo` / `Recomendaciones` native symbolic/card replacement as rejected, not an acceptable known issue.
- [x] Replace page 17 risk-factor/recommendation generic cards/icons with source-faithful artwork and geometry: original wind/tree, car, people, gray/yellow panels, blue recommendation label, border, spacing, and proportions. Superseded note: the decorative recommendation clipboard/notebook/check icon is no longer required and must be omitted from the web version.
- [x] Remove generic person/avatar icons from page 17 risk-factor/recommendation visuals.
- [x] Extract or reconstruct source-faithful page 17 visual assets from the PDF/source render at sufficient resolution, using clean text-free crops or source-faithful shapes where Spanish text must be replaced.
- [x] Keep page 17 Russian infographic text selectable/copyable as DOM/SVG text while preserving the original infographic geometry, colors, spacing, icon artwork, panel shapes, and borders.
- [x] Do not use full-page raster, visible Spanish source text, wholesale masks, or broad Russian overlays for page 17 infographic translation.
- [x] Record page 17 source-derived asset metadata for every risk-factor/recommendation visual component: source page/region, local crop or reconstruction mode, cleanup scope, visible-text status, and screenshot comparison evidence.
- [x] Add/update tests that fail when page 17 risk-factor/recommendation artwork is generic symbolic DOM/CSS/SVG cards, generic person/avatar icons, redesigned cards, or missing source-derived metadata/crops.
- [x] Add/update tests proving page 17 risk-factor/recommendation visuals contain no visible Spanish and preserve selectable Russian text where text was translated.
- [x] Capture screenshot comparison evidence for page 17 risk-factor/recommendation artwork against the source page.
- [x] Apply the same non-regression guard to pages 18-20 work-axis/consequences diagrams: source pictograms/infographics must use source-derived/source-faithful artwork and cannot remain accepted generic icon/card replacements.
- [x] Add/update tests and screenshot evidence for pages 18-20 diagrams rejecting generic icon replacements when source pictograms/infographics exist.

## Latest Plan Visual And Style Correction Tasks

These tasks extended the source-artwork correction to `intro-plan-seguridad-vial` and added a reusable document style guide requirement. They were originally Architect-recorded pending tasks and are now closed by the later Implementation Agent evidence in this file.

- [x] Replace page 18 `Consecuencias de los Incidentes de tránsito` generic/simplified visuals with the original gauge/semi-circle incident diagram.
- [x] Preserve page 18 source components exactly: black fatal-victims wedge/label, beige category labels/panels, family/economy icon, health icon, institutions icon, pointer shape, colors, geometry, proportions, spacing, connector lines, and overall composition.
- [x] Reject page 18 simplified cards, generic icons, redrawn diagrams, altered colors, different chart geometry, cropped-away source components, blurred/stretched artwork, or text-only substitutes.
- [x] Record page 18 source-derived asset metadata/regions/crops or source-faithful reconstruction metadata for each diagram component, including cleanup scope and no-visible-Spanish status.
- [x] Keep page 18 Russian diagram text selectable where feasible and avoid page-wide raster preview as the whole solution.
- [x] Capture page 18 screenshot comparison against the source page and add tests that fail if source components are missing or generic replacements are used.
- [x] Replace page 19 `Ejes de trabajo` generic/simplified visuals with the original four circular gray fields and exact pictograms.
- [x] Preserve page 19 walking/pedestrian, megaphone, officer/police, and group/people pictograms with original icon sizes, placement, title relation to circle, blue title style, text placement, two-column grid spacing, and proportions.
- [x] Reject page 19 generic avatars, approximate symbols, modified pictograms, altered circle/grid geometry, or different title/text placement.
- [x] Record page 19 source-derived asset metadata/regions/crops or source-faithful reconstruction metadata for each work-axis visual component, including cleanup scope and no-visible-Spanish status.
- [x] Keep page 19 Russian diagram text selectable where feasible and avoid page-wide raster preview as the whole solution.
- [x] Capture page 19 screenshot comparison against the source page and add tests that fail if source components are missing or generic replacements are used.
- [x] Create or update a reusable document style guideline/token record for recurring block types in these Introduction sections.
- [x] Record style tokens/guidelines for typography family/weights, headline/body sizes, line-height, colors, paddings, margins, border widths/radii, alignment, icon/image positioning, and responsive behavior.
- [x] Normalize `intro-enfoque-etico` blue law/callout blocks so repeated instances use one consistent source-validated style unless a source-backed variant is documented.
- [x] For blue law/callout blocks, validate consistent background color, left accent stripe, padding, text alignment, font weight, line-height, width behavior, and margin cadence.
- [x] Add tests/checks that fail accidental centered-versus-left-aligned callout drift or any recurring style element implemented without style-guideline coverage.
- [x] Implement or update an initial visual source-fidelity checker/harness for the Introduction pages in this PR slice.
- [x] Visual checker compares original Spanish source screenshots/renders with Russian web screenshots for the implemented Introduction pages.
- [x] Visual checker records component/bounding-box metadata, asset presence/source-region checks, style-token checks, navigation-shell checks, and a pass/fail report.
- [x] Visual checker fails validation if source images, infographics, pictograms, layout, formatting, or style are lost, modified, simplified, replaced, misaligned, recolored, blurred/stretched, or otherwise not source-faithful.
- [x] Visual checker explicitly covers page 17 risk-factor pictograms/recommendation block, page 18 consequences/gauge diagram, page 19 work-axis circular pictograms, blue callout alignment/style, and the full-document `Руководство` navigation shell.
- [x] Visual checker output must not be only an AI-written summary; it must cite artifact evidence such as source screenshot, Russian screenshot, component metadata, and pass/fail checks.

## Latest Page 18 Distortion Blocker Tasks

These tasks supersede earlier page 18 completion evidence. Prior checks that only proved source-derived crops, component metadata, or generic gauge presence are not enough until the complete assembled diagram is visually recognizable against the source screenshot.

- [x] Rebuild page 18 `Последствия дорожных инцидентов` / source `Consecuencias de los Incidentes de tránsito` so the complete diagram reads as the original gauge/semi-circle composition, not as scattered source fragments.
- [x] Preserve the page 18 source composition with the same overall gauge/semi-circle geometry, aligned beige sectors, gray outer arc, dark center ring, pointer, black fatality wedge and label, category labels, connector lines, relative positions, spacing, and proportions.
- [x] Remove the failed screenshot classes from page 18: icon fragments floating in the wrong place, white/gray chunks over or cutting through arcs, black wedge covering text, labels not aligned with connector geometry, category text colliding with the diagram, misaligned fragments, broken gauge/arc continuity, misplaced black wedge, clipped/stretched/disconnected fragments, and mismatched overall geometry.
- [x] Ensure Russian labels in the page 18 diagram do not overlap diagram shapes, pictograms, connector lines, or each other.
- [x] If a piecewise/native reconstruction cannot pass source-composition checks, switch to a cleaned source-derived diagram crop/background for non-text artwork, then place selectable Russian text layers in source-faithful positions with no visible Spanish and no full-page raster.
- [x] Update the visual source-fidelity checker so it fails when source-derived pieces are assembled into a distorted, unrecognizable, or non-source-like composition, not only when source-derived assets are absent.
- [x] Add page 18 screenshot and bounding-box assertions for overall gauge/semi-circle match, beige-sector alignment, gray outer arc continuity, dark center ring and pointer placement, black wedge/label placement, category label/connector alignment, no text/shape overlap, and no broken seams/clipped/stretched/disconnected fragments.
- [x] Add regression fixtures or explicit assertions based on the failed screenshot examples so this exact distortion class fails future checks.
- [x] Capture fresh desktop and mobile screenshots for `#intro-plan-seguridad-vial` after the rebuild and compare page 18 against the source before claiming the blocker resolved.

## Latest Page 17/Page 19 Clipping And Geometry Blocker Tasks

These tasks supersede earlier page 17/page 19 completion evidence. Prior checks that only proved source-derived crops, component metadata, or generic source-artwork presence are not enough until visible card/lobe/circle geometry and icon clipping are checked.

- [x] Rebuild page 17 `Factores de Riesgo` risk cards as source-like long rounded panels: light gray for Ambient/Ambiental and Vehicle/Vehicular, yellow for Human/Humano, rounded right corners, integrated circular/lobed left edge, source pictogram centered and fully visible inside the lobe, source-like spacing, and source-like title/body positions.
- [x] Remove page 17 risk-card failure classes: square/rectangular icon crops stuck to the left, missing circular lobe, flat-rectangle-only panels, clipped or awkward icons, visible crop-box edges, wrong panel geometry, and altered source style.
- [x] Superseded by latest user feedback: do not rebuild/preserve the page 17 `Recomendaciones` clipboard/check icon. Remove that decorative icon entirely and validate the remaining callout label/border alignment.
- [x] Rebuild page 19 `Ejes de trabajo` so all four circular pictogram fields show complete source icons inside gray circles: pedestrian/walking, megaphone, officer/police, and group/people.
- [x] Remove page 19 axis-icon failure classes: cropped quadrants, partial square crop corners, cut-off icon tips, visible crop-box artifacts, parent-overflow clipping, and icon/background coverage.
- [x] Preserve page 19 source composition as four circle/title/text items in a two-column grid on desktop; responsive stacking may happen only when needed and must preserve full icons, source-like spacing, and title/circle/text relationships.
- [x] Update the visual source-fidelity checker so asset existence/source metadata is necessary but not sufficient; it must fail clipped, square-cropped, covered, force-cropped, or misframed visible composition.
- [x] Add checker assertions for image bounding boxes inside intended circles/lobes with padding, computed `object-fit: contain` or equivalent no-forced-crop behavior, parent overflow safety, source-like lobe/card/circle geometry, spacing, and alignment.
- [x] Add Playwright screenshot/bounding-box checks for page 17 risk-card lobe/icon geometry, page 17 recommendation callout alignment/no reintroduced clipboard fragments, page 19 axis icon completeness, and page 18 no-distortion composition at desktop, narrow, and mobile widths where applicable.
- [x] Add explicit regression examples/assertions so the current screenshots would fail: page 17 flat rectangles with square icon crops, a reintroduced/clipped recommendation clipboard after the omission decision, page 19 axis icons showing only a cropped quadrant or crop-box corner, and page 18 gauge assembled from misaligned fragments.
- [x] Capture fresh desktop, narrow, and mobile screenshots after rebuilding page 17 and page 19 visuals, then compare against the source before claiming blockers resolved.

## Current Page 18/Page 19 Source-Crop Blocker Tasks

These tasks supersede earlier page 18/page 19 completion evidence. Previous attempts that redrew, reconstructed, componentized, or tightly cropped source artwork are rejected by the user and cannot be accepted as source-faithful.

- [x] Rebuild page 18 `Последствия дорожных инцидентов` / source `Consecuencias de los Incidentes de tránsito` using the complete original PDF infographic crop as the non-text visual layer.
- [x] Clean/remove only visible Spanish/source text from the page 18 complete source crop, then overlay selectable Russian DOM/SVG text in the original text positions.
- [x] Do not redraw, reconstruct, approximate, or separately reassemble page 18 arcs, sectors, pointer, black fatality wedge, label boxes, connector lines, pictograms, colors, geometry, proportions, or spacing with CSS/SVG/native shapes.
- [x] Reject page 18 if any original diagram component is missing, cropped away, materially shifted, visually redrawn, proportionally changed, blurred/stretched, or if any Spanish/source text remnants remain.
- [x] Update the page 18 checker to fail when the visual asset is not a full source crop, when geometry differs materially from the source screenshot, when labels/boxes/connector lines/arcs/pointer/sectors/icons are redrawn instead of retained from the source crop, or when Spanish/source remnants remain.
- [x] Rebuild page 19 `Направления работы` pictograms from complete source PDF pictogram crops with enough transparent/source padding so no pedestrian, megaphone, officer, or group edge touches the asset bounds.
- [x] Reject page 19 tight crops that show only part of a pictogram, cut off feet/handles/heads/bodies, expose square crop-box corners inside gray circles, or rely on `object-fit: contain` after the natural image content is already clipped.
- [x] Update the page 19 checker to inspect natural/content bounds or equivalent metadata plus rendered screenshots, and fail if a pictogram touches crop bounds without padding, is visibly clipped in the gray circle, or is replaced by a generic/reconstructed icon.
- [x] Add regression evidence from the latest user screenshots so the current broken page 18 diagram and page 19 clipped axis icons fail before implementation is considered complete again.
- [x] Capture fresh source-vs-Russian desktop and mobile screenshots for page 18 and page 19 after the rebuild, and record pass/fail evidence before returning to Orchestrator.

## Current Page 18 Overlay Transfer Blocker Tasks

These tasks convert the latest user feedback into transfer rules and validation criteria. They supersede any page 18 evidence that only proves a full source crop exists; text overlays can still fail by changing source geometry.

- [x] Remove any visible protruding DOM/background rectangle under center-circle text `ДОРОЖНЫЙ ИНЦИДЕНТ`; center text must remain inside the original circular field/ring and must not cover the pointer, ring, center circle, connector lines, or source geometry.
- [x] Ensure DOM text in category labels `СЕМЬЯ И ЭКОНОМИКА`, `ИНСТИТУЦИИ`, `ЗДОРОВЬЕ`, and `ПОГИБШИЕ` is vertically centered inside each original source label box, with explicit validation for the current `ИНСТИТУЦИИ` off-center regression.
- [x] Preserve source label-box geometry for `ЗДОРОВЬЕ` and all category labels: height, corner/radius shape, source baseline/center alignment, connector relationships, and source proportions. If Russian fitting needs adjustment, only DOM text/wrapper width may vary.
- [x] Reject any DOM overlay/background that visually changes source label shapes, ring, center circle, connector lines, or pointer.
- [x] Update the page 18 checker with bounding-box/visual checks for category-label text vertical centering inside source boxes.
- [x] Update the page 18 checker to fail extra DOM/background rectangles visible outside source label geometry, including the protruding center-circle background example.
- [x] Update the page 18 checker to verify label-box rendered heights/corners/radii remain source-faithful and only width can vary where a Russian text wrapper needs fitting.
- [x] Update the page 18 checker to verify center-circle text has no backing-rectangle protrusion and stays inside the circular field/ring without covering pointer/ring geometry.
- [x] Add screenshot/regression evidence for the no-go examples: protruding rectangle under `ДОРОЖНЫЙ ИНЦИДЕНТ`, vertically off-center `ИНСТИТУЦИИ`, mismatched/incorrect `ЗДОРОВЬЕ` label corners/size, and DOM overlays that alter source label/ring/pointer geometry.

## Current Page 17/Page 19 Transfer Alignment Blocker Tasks

These tasks convert the latest user feedback into reusable transfer rules and validation criteria. They supersede evidence that only checks source-asset existence or image element boxes.

- [x] Superseded: do not rebuild/validate the page 17 `Рекомендации` clipboard/notebook/check icon as a required source crop; omit it as a decorative book-layout icon and do not require it in tests.
- [x] Reject page 17 recommendation icon clipping by blue label, border, container overflow, parent overflow, or crop bounds; no source icon distortion or hiding under the blue label is allowed.
- [x] Update the page 17 recommendation checker so it does not require clipboard presence and instead fails if the callout label/border is misaligned, clipped, visually unfaithful, or a partial/reintroduced clipboard fragment remains visible.
- [x] Reframe page 17 `Факторы риска` pictograms inside circular lobes using visual alpha bounds: alpha center aligns with lobe center, alpha bounds occupy a source-like fraction of the circle, and important content such as car diagonal support and people lower silhouettes remains complete.
- [x] Update the page 17 risk-lobe checker to fail alpha-center drift beyond tolerance, alpha bounds too small/large versus source, cut important parts, or visible centering differences hidden by identical CSS image boxes.
- [x] Rebuild/validate page 19 `Направления работы` as a stable desktop 2x2 grid independent from title/body wrapping: equal circle diameters, top-row center-y alignment, bottom-row center-y alignment, left/right column center-x alignment, and consistent row/column gaps.
- [x] Update the page 19 checker to fail top-row/bottom-row y drift, column x drift, unequal circle diameters, title-wrapping-driven circle drift, inconsistent grid gaps, or desktop masonry-style layout. Mobile/stacked variants may differ but must keep local alignment and complete icons.
- [x] Carry forward page 18 overlay-transfer checks while fixing page 17/page 19: no protruding `ДОРОЖНЫЙ ИНЦИДЕНТ` backing rectangle, vertically centered label text, and source-faithful `ЗДОРОВЬЕ` label shape/size/corners.
- [x] Add screenshot/regression evidence for the no-go examples: reintroduced/clipped decorative clipboard fragment, wrong lobe alpha-centering/framing, cut car/people details, and uneven page 19 row/column circle alignment.

## Latest Full-Manual Navigation IA Tasks

These tasks capture the navigation target for the future full Russian interactive manual. They do not expand runtime content scope beyond the four implemented Introduction children.

- [x] Expose the integrated Russian manual as the main app destination labeled `Руководство`.
- [x] Replace the user-facing `Руководство 4R` manual-viewer destination with the new `Руководство` interactive document; old internals may remain only if hidden or explicitly required by repo architecture.
- [x] Ensure the full-document `Índice` navigation tree is nested inside `Руководство`.
- [x] Reject any implementation that presents the current Introduction pages as a separate prototype/experimental block outside `Руководство`.
- [x] Define a reusable full-document navigation data model/tree with support entries, chapter/annex groups, and child entries from the source `Índice`.
- [x] Include support entries: `Presentación` / `Предисловие` and `Glosario` / `Глоссарий`.
- [x] Include `INTRODUCCIÓN`, `Pág. 13` / `Введение` with implemented children: `Pandemia vial`, `Enfoque ético - ciudadano en la cultura vial`, `¿Accidente o incidente de tránsito?`, and `Plan de seguridad vial de la Ciudad de Buenos Aires`.
- [x] Include `CAPÍTULO 1: HACIA UNA MOVILIDAD SUSTENTABLE`, `Pág. 20` / `Глава 1. К устойчивой мобильности` with pending children: `Ciudades para las personas`, `¿Qué es la movilidad sustentable?`, `Prioridad peatonal`, `Bicicleta`, `Sistema de transporte público`, `Viaje compartido`.
- [x] Include `CAPÍTULO 2: CONDUCIR ES UN ACTO DE RESPONSABILIDAD`, `Pág. 42` / `Глава 2. Вождение - ответственное действие` with pending children: `Responsabilidades legales`, `Documentación obligatoria`, `Obligaciones en caso de incidentes viales`, `Scoring`.
- [x] Include `CAPÍTULO 3: NORMAS BÁSICAS DE CONDUCCIÓN`, `Pág. 56` / `Глава 3. Основные правила вождения` with pending children: `Prioridad normativa`, `Prioridades de paso`, `Uso de luces`, `Velocidad`, `Giros en intersecciones`, `Adelantamiento y sobrepaso`, `Conducción en autopistas y otras vías rápidas`, `Conducción en situaciones adversas`, `Detención y estacionamiento`.
- [x] Include `CAPÍTULO 4: CAPACIDAD NATURAL`, `Pág. 88` / `Глава 4. Физическое состояние водителя` with pending children: `Ingesta de alcohol y drogas`, `Sueño y fatiga`, `Estrés`, `Distracciones`.
- [x] Include `CAPÍTULO 5: ACTITUD AL CONDUCIR`, `Pág. 97` / `Глава 5. Поведение за рулем` with pending children: `Tipos de actitudes`, `Hacia una sociedad igualitaria`, `Prevención y asistencia en situaciones de violencia de género`, `Conducción preventiva y eficiente`.
- [x] Include `ANEXO I AUTOMÓVILES PARTICULARES`, `Pág. 103` / `Приложение I. Легковые автомобили` with pending children: `Elementos de seguridad`, `Otros elementos de seguridad obligatorios`, `Elementos de seguridad recomendables`.
- [x] Include `ANEXO II TRANSPORTE DE PASAJEROS/AS`, `Pág. 122` / `Приложение II. Пассажирский транспорт` with pending children: `Una responsabilidad social`, `Elementos de seguridad`, `Factores involucrados en la conducción`, `Conducción segura`, `Autopistas y Hospitales`.
- [x] Include `ANEXO III TRANSPORTE DE CARGA Y MERCADERÍAS`, `Pág. 151` / `Приложение III. Грузовой транспорт и перевозка товаров` with pending children: `Perfil del transportista de cargas`, `Una responsabilidad social`, `Factores involucrados en la conducción`, `Conducción segura`, `Elementos de seguridad`, `Autopistas`.
- [x] Include `ANEXO IV SEÑALES VIALES`, `Pág. 183` / `Приложение IV. Дорожные знаки и разметка` with pending children: `Reglamentarias`, `Preventivas`, `Informativas`, `Transitorias`, `Horizontales`, `Señalamiento luminoso`.
- [x] Preserve source Spanish title and page reference metadata for every navigation entry while showing Russian labels to users.
- [x] Mark unimplemented entries as pending/disabled/collapsed without creating route content pages outside the current Introduction scope.
- [x] Add active group and active child state so active Introduction pages are discoverable inside the full hierarchy.
- [x] Add route/hash behavior for implemented Introduction children and guard against broken direct links.
- [x] Preserve direct hashes `#pandemia-vial`, `#intro-enfoque-etico`, `#intro-accidente-incidente`, and `#intro-plan-seguridad-vial` as aliases/deep links into `Руководство` child entries.
- [x] Add tests that fail if `Руководство 4R` and the new interactive document both appear as separate user-facing manual destinations.
- [x] Add keyboard/a11y labels, current-state semantics, and disabled/pending semantics for navigation controls.
- [x] Add mobile/narrow navigation behavior that remains usable without flattening the IA into a one-off tab strip.
- [x] Add tests that reject flat post/page-only navigation, page-number navigation, and one-off horizontal Introduction tabs/cards as the final navigation model.

## Implementation Evidence - Introduction Scope Extension

- Implementation Agent update completed in worktree `/Users/chap/devel/cabadrive-worktrees/029-pandemia-vial-section` on branch `codex/029-pandemia-vial-section`; no stage, commit, push, merge, rebase, reset, or clean was performed.
- Source spans verified from `navigation.ru.json`, `manual.ru.json`, `layout.ru.json`, and local renders `page-016.jpg` through `page-020.jpg`:
  - `intro-road-pandemic`: `Pandemia vial`, route `#pandemia-vial`, page 15.
  - `intro-ethical-civic-approach`: `Enfoque ético - ciudadano en la cultura vial`, route `#intro-enfoque-etico`, page 16.
  - `intro-incident`: `¿Accidente o incidente de tránsito?`, route `#intro-accidente-incidente`, page 17.
  - `intro-road-safety-plan`: `Plan de seguridad vial de la Ciudad de Buenos Aires`, route `#intro-plan-seguridad-vial`, pages 18-20 as one route.
- Data/model decision: `src/data/pandemiaVialSection.ts` now exports `introductionNavigation` and `introductionArticleSections`; existing `pandemiaVialSection` remains the standalone Pandemia data source.
- Runtime decision: `src/App.tsx` keeps Pandemia as the native infographic renderer and adds an `IntroductionSectionsView` with heading-based navigation plus native article rendering for the three added pages.
- Accessibility follow-up: the active Introduction source-index heading button now exposes `aria-current="page"` and each heading nav button has an accessible label matching its Russian heading.
- Visual decision: page 20 final photo uses `content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/intro-road-safety-plan/child-seat-photo-source.jpg`, cropped from `page-020.jpg` above the Spanish quote; the Russian quote is separate selectable DOM text.
- Rejected known issue for Architect disposition: exact cleaned source crops for page 17 risk-factor/recommendation icons and page 19 work-axis icons were not extracted in this slice. The shipped native symbolic cards/icons are rejected by latest user feedback and cannot be accepted as final merely because labels are Russian DOM text and Spanish text is absent.
- Verification commands/results:
  - `node --test tests/content-pandemia-vial-section.test.mjs` - passed, 10/10 tests.
  - `pnpm exec tsc --noEmit` - passed.
  - `pnpm run build` - passed; content validation, asset sync, Vite build, and service worker generation succeeded.
  - `pnpm exec playwright test tests/e2e/app.spec.ts -g "Pandemia vial prototype|Introduction index routes"` - passed, 4/4 tests across chromium and mobile.
  - `git diff --check` - passed with no whitespace errors.
  - `git diff --check` - passed with no whitespace errors.
  - `pnpm run test` - passed, 305/305 Node tests.
  - `git diff --check` - passed with no whitespace errors.
  - Browser plugin sanity check attempted against `http://127.0.0.1:4173/#intro-plan-seguridad-vial`; tab loaded title `Cabadrive`, but the in-app browser DOM/screenshot API returned incomplete/timeout data, so automated Playwright evidence above is the reliable browser verification for this slice.
  - Accessibility follow-up verification: `node --test tests/content-pandemia-vial-section.test.mjs` passed 10/10; `pnpm run build` passed to refresh `vite preview` assets; `pnpm exec playwright test tests/e2e/app.spec.ts -g "Introduction index routes"` passed 2/2 across chromium and mobile; `git diff --check` passed.

## Superseded Implementation Context

The worktree currently may contain implementation diffs from earlier prototype attempts. Architect did not edit or revert runtime/code/test files.

The following traits are not accepted evidence and must be replaced/superseded by Implementation Agent:

- full page render used as visible background/base;
- masks over Spanish text;
- Russian overlay translation on original Spanish page;
- tiny text much smaller than study-material text;
- poor hand-drawn SVG icons/images when cleaned source crops would be more faithful;
- visible `Вписать` / `100%` controls;
- visible `Мировой контекст` / `Контекст города` buttons;
- overly formal Russian wording that can be simplified without losing meaning;
- visible source/provenance text not needed for ticket solving;
- visible footnote;
- visible page marker/page number;
- visible blue upper-left semicircle/corner book motif;
- missing automated overlap/bounding-box checks for infographic/circle and lower-content collisions.
- intro/body explanatory text smaller than ordinary `Материалы` body text;
- city statistic icons hidden, covered, clipped, or merged with text/backgrounds;
- `8 из 10` people-grid asset that does not accurately show 8 male pictograms and 2 female pictograms;
- forced line breaks inside ordinary intro/body prose used only to mimic PDF line wrapping;
- latest clean SVG replacements that look redrawn or substantially different from the PDF;
- generic/reconstructed SVG pictograms/icons used instead of original source artwork when the look differs from the PDF;
- flat post/page-only navigation, page-number navigation, or one-off horizontal Introduction tabs/cards used as the final navigation model;
- current Introduction routes isolated from the future full-manual `Índice` hierarchy instead of living as children under `INTRODUCCIÓN` / `Введение`;
- unimplemented future chapters/annexes represented as fake content pages rather than pending/disabled/collapsed placeholders;
- Spanish source titles/page refs exposed as content-page provenance clutter instead of navigation metadata;
- navigation without active group/child state, route/hash direct links, keyboard/a11y labels, current-state semantics, or mobile/narrow usability;
- page 17 `Factores de Riesgo` / `Recomendaciones` implemented as generic native symbolic cards/icons instead of source-faithful wind/tree, car, people, gray/yellow panels, blue recommendation label, border, spacing, and proportions;
- page 17 `Factores de Riesgo` rendered as flat rectangles with square/rectangular icon crops instead of source-like long rounded gray/yellow panels with integrated circular/lobed left edges;
- page 17 risk-card pictograms clipped, awkwardly cropped, outside the lobe, covered by panel/background layers, or showing visible square crop-box artifacts;
- page 17 `Recomendaciones` decorative clipboard/check icon remains or is reintroduced after the latest omission decision, especially if clipped by the blue label, border, container, background, or parent overflow;
- pages 18-20 work-axis/consequences diagrams implemented as accepted generic icon/card replacements when the source has specific pictograms or infographics;
- page 18 `Consecuencias de los Incidentes de tránsito` implemented as simplified cards, generic icons, redrawn diagram geometry, altered colors, cropped-away source components, blurred/stretched artwork, or a text-only substitute instead of the source gauge/semi-circle diagram;
- page 18 missing source components: black fatal-victims wedge/label, beige category labels/panels, family/economy icon, health icon, institutions icon, pointer shape, connector lines, colors, spacing, geometry, proportions, or overall composition;
- page 18 source-derived pieces assembled into a distorted, unrecognizable, or non-source-like diagram, including floating fragments, white/gray chunks over arcs, black wedge covering text, label/connector misalignment, category text collisions, broken seams, clipped/stretched/disconnected fragments, or mismatched overall geometry;
- page 19 `Ejes de trabajo` implemented as generic avatars/icons, approximate symbols, modified pictograms, altered circular fields/grid geometry, changed icon sizes/placement, or different title/circle/text relationships;
- page 19 axis pictograms cropped, showing only a quadrant, with cut-off icon tips, visible square crop-box corners, parent-overflow clipping, or icon/background coverage;
- visual checker passing page 17/page 19 because assets exist even when visible composition is clipped, square-cropped, covered, force-cropped, or non-source-like;
- infographic Russian text implemented through full-page raster, visible Spanish, wholesale mask, or broad Russian overlay instead of local text-free source crops/source-faithful shapes plus selectable Russian DOM/SVG text layers;
- visual sections lacking source-derived asset metadata/crops and screenshot comparison evidence;
- repeated blue law/callout blocks with inconsistent background, left accent stripe, padding, text alignment, font weight, line-height, width behavior, or margin cadence without source-backed variant evidence;
- recurring style elements implemented without a recorded style guideline/token and source validation;
- city circle motorcyclist/pedestrian/car icons that are not original artwork crops or high-fidelity cleaned originals;
- `8 из 10` people-grid artwork that preserves counts but changes the original silhouette/style;
- full PDF page-sized white canvas or page shell with huge blank top/side/bottom whitespace;
- tiny centered `Pandemia vial` content island surrounded by mostly blank page area;
- mobile first view that starts on blank whitespace before the meaningful section content;
- monolithic fixed-width section canvas that contains ordinary prose and makes `heading`, `intro`, or bottom learning conclusion/body clip or horizontally scroll at narrow widths;
- horizontal scrolling/panning applied to normal prose instead of only fixed infographic/image blocks;
- ordinary Russian prose or meaningful statistic labels rasterized/baked into images instead of real selectable/copyable text;
- `user-select: none`, `pointer-events: none`, or equivalent blockers on `heading`, `intro`, bottom learning conclusion/body, or statistic labels;
- lower city gray statistic rows for `8 из 10` or `49%` starting lower/higher than their matching left pictogram blocks;
- default app Inter/system typography left in place when it visibly differs from the source PDF;
- remote font dependencies or undocumented local font assets;
- heading/body weight, letter spacing, line-height, paragraph spacing, or text block width not tuned/evidenced against source rhythm;
- infographic cards, blue strips, gray boxes, numbers, or labels left in default app typography while prose is tuned;
- disconnected typography where the section does not use one current readability-first typography system across prose and infographic roles;
- context labels with asymmetric emphasis, especially bolding only `Буэнос-Айрес`;
- `::first-line`, nested-span, or equivalent partial styling that bolds only part of a context label;
- Avenir-first Pandemia stack used as accepted primary typography after the user's rejection;
- SFNSRounded/SF Compact Rounded/SF Pro Rounded-first or GothamRounded-like imitation used as accepted primary typography after the user's rejection;
- forced/narrow heading width that breaks `Дорожная пандемия` into two lines at normal desktop width;
- typography selection that ignores the identified embedded GothamRounded source fonts;
- future-section typography chosen without embedded/source PDF font identification;
- repeated user-reported visual regressions recorded only as notes instead of stricter reusable guards;
- lower city row checks that pass only on top-edge alignment without checking panel center/bottom/height, empty-space ratio, and bottom whitespace;
- lower city pictograms nearly touching gray statistic panels when the source shows a clear horizontal gap;
- lower gray statistic panels that are too tall, sparse, or have excessive empty space;
- lower gray statistic panel text pinned to the top without balanced internal padding;
- upper global statistic cards with excessive empty gray-box space or source-mismatched density;
- statistic card font rhythm accepted only because the general stack is correct, despite visual mismatch with the PDF;
- airplane/stadium pictograms that look detached from the blue strip/cap instead of visually linked as in the source;
- blue strip rendered as a huge full-width rounded half-pill/dome instead of a rectangular strip with localized center cap;
- whole-container `border-radius` used where the source has a localized cap/rise near the icon;
- white seam/gap between icon/cap and blue strip/card top;
- upper global paired cards with unequal panel heights or misaligned bottom edges;
- blue strip or gray card panels losing rectangular left/right edges while trying to create the cap;
- unbounded gray-card empty-space ratio, especially a large unused lower area under the text.

## Implementation Tasks

- [x] Confirm assigned Implementation Agent context with Orchestrator:
  - worktree: `/Users/chap/devel/cabadrive-worktrees/029-pandemia-vial-section`
  - branch: `codex/029-pandemia-vial-section`
  - PR slice: not opened or mutated in this assignment
  - base SHA: `afb0d2b8d00cb9d823266d661bab85fbe18043e8` from feature memory
  - parallel-work preservation warning acknowledged: yes; no staging, commit, push, merge, rebase, reset, or clean performed
- [x] Reassess current prototype against latest feedback:
  - smallest text scale issue: existing Playwright failure showed `pedestrians` horizontal overflow; focused follow-up also exposed `airplane-strip` overflow before final widening
  - poor SVG/icon/image elements to replace: current prototype uses seven cleaned source crops and no `pandemia-svg-icon`
  - source crop candidates: retained existing local airplane, stadium, motorcyclist, pedestrian, car, people-grid, and people-pair crops under `content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/pandemia-vial/`
  - controls/buttons to remove: no zoom controls, focus controls, or context buttons are rendered
  - translation phrases to simplify: circular city labels shortened to `на мото`, `пешком`, and `в авто`
- [x] Re-verify exact source span from:
  - `content/manuals/gcba-manual-vehiculo-4-ruedas-2023/navigation.ru.json`
  - `content/manuals/gcba-manual-vehiculo-4-ruedas-2023/manual.ru.json`
  - `content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/pages/page-015.jpg` as reference/extraction source only
- [x] Record source-span and visual evidence:
  - navigation entry: `intro-road-pandemic`
  - page number/source page marker: PDF page 15, source marker `14` retained as metadata only and no longer visible in the learning composition
  - reference visual asset path/SHA: `content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/pages/page-015.jpg`, SHA-256 `9e25a91abe857426dfcc978e361a2511a6ab7a0c144ccc97f757c72ffe4b1496`
  - all source text/statistic/icon labels found: title, intro, world context, `= 4700 AVIONES LLENOS`, `1,4 MILLONES`, `= 715 ESTADIOS LLENOS`, `50 MILLONES`, city context, `96`, `48%`, `34%`, `11%`, `8 DE CADA 10`, `49%`, source-attribution paragraph, footnote URL, and page marker; latest visible learning composition intentionally omits source-attribution sentences, footnote, page marker, and book corner motif
  - crop regions selected: seven isolated source-derived icon crops recorded in `src/data/pandemiaVialSection.ts`
- [x] Create/revise dedicated section data:
  - source metadata and page reference traceability;
  - all Russian text/statistic segments;
  - simple Russian wording;
  - visual-region metadata;
  - isolated crop asset metadata with local path, source region, and cleanup status when crops are used.
- [x] Ensure all ticket-relevant source text/captions/statistics/labels are covered in Russian:
  - source page marker `14` kept only as metadata, not visible;
  - opening paragraph;
  - `Pandemia vial` title;
  - footnote `1/` verified as source material but removed from visible learning document by latest user instruction;
  - explanatory paragraph;
  - `Contexto Mundial`;
  - `Contexto Ciudad de Buenos Aires`;
  - global statistics/icons/labels;
  - city statistics/icons/labels;
  - any additional visual labels discovered during image inspection.
- [x] Increase overall prototype scale so the smallest rendered text is comparable to existing study-material text.
- [x] Prefer larger fixed-format content block/horizontal scroll over shrinking text into microtype; latest framing feedback constrains this to the meaningful content region, not a full PDF page canvas.
- [x] Replace poor hand-redrawn SVG icons/images with isolated source crops when crops better match the original.
- [x] Clean cropped source images/icons of visible Spanish text when needed.
- [x] Keep Russian labels/text as native DOM/SVG/text, not baked into cropped assets.
- [x] Keep CSS/SVG/vector redraws only where they match the original well.
- [x] Ensure no full PDF/page image is rendered as the section background/base.
- [x] Ensure no mask-over-Spanish-text implementation remains.
- [x] Ensure no Russian overlay translation on the original Spanish page image remains.
- [x] Ensure no visible Spanish text remains in the primary composition or cropped assets.
- [x] Remove `Вписать` / `100%` scale controls.
- [x] Remove `Мировой контекст` / `Контекст города` buttons.
- [x] Simplify Russian wording while preserving exact meaning, all numbers, organizations, dates/source context, and details that can matter in exam tickets.
- [x] Keep only minimal affordances such as route/anchor; visible provenance disclosure was removed by latest user instruction.
- [x] Implement responsive desktop/mobile layout with no overlapping/clipped text; horizontal scroll is acceptable only where the fixed content block requires it.
- [x] Add/update focused Node/content tests for:
  - data coverage;
  - simple Russian text coverage;
  - local cleaned crop assets;
  - no full-page raster base;
  - no masks;
  - no overlay translation;
  - no removed controls/buttons;
  - no visible Spanish text;
  - forbidden runtime patterns.
- [x] Add/update Playwright tests for:
  - prototype route availability;
  - study-material-like minimum text size;
  - readable Russian text;
  - source-faithful visual assets;
  - no visible Spanish text;
  - no full-page background image;
  - no zoom/context controls;
  - no old side-by-side UI;
  - no full-manual page-list-first experience.
- [x] Capture desktop and mobile screenshot evidence for user approval.
- [x] Run required verification commands and record results below.
- [x] Update this task file with decisions, evidence, known issues, and any Implementation Agent feedback for Architect disposition.

## Latest Follow-Up Implementation Tasks

These tasks supersede any earlier completed evidence that conflicts with the newest feedback.

- [x] Remove visible source/provenance details that are not needed for solving tickets from the learning document.
- [x] Update the bottom paragraph so it removes source-attribution wording like `Эти данные взяты...` and keeps only the learning-relevant conclusion that road safety requires joint work by all society.
- [x] Remove the footnote and footnote URL entirely from the visible document.
- [x] Remove the visible page marker/page number.
- [x] Remove the blue upper-left semicircle/corner book motif.
- [x] Keep internal source/provenance traceability in data/tests/process memory as needed for validation, without rendering it in the learning document.
- [x] Add/update automated bounding-box checks for text overflow and element overlap on desktop and mobile.
- [x] Add/update specific overlap checks:
  - infographic/circle text must not collide with icon images;
  - circles/indicators must not collide with below icons/rows;
  - bottom paragraph must not collide with any lower-page element or any footnote/page-marker remnant.
- [x] Capture and record screenshot review evidence in addition to DOM/content checks.
- [x] Apply and update the reusable PDF-section QA checklist below before handoff.

## Newest Visual Follow-Up Tasks

These tasks supersede any earlier evidence that only checked a generic 14px minimum or only checked content presence.

- [x] Increase intro/body explanatory text, including the paragraph beginning `Дорожное движение - одна из самых...`, so it is approximately the same size as ordinary body text in `Материалы`.
- [x] Add/update tests comparing intro/body computed font size against ordinary `Материалы` body text, not only a hard minimum.
- [x] Remove forced line breaks from normal intro/body paragraphs, including breaks like `сложных` / `систем` or `безопаснее` / `работать` inside one paragraph.
- [x] Ensure normal prose is rendered as adaptive DOM paragraph text that wraps by container width.
- [x] Keep deliberate line breaks only in fixed image/infographic labels, pinned statistic text, or visual blocks where they are part of layout.
- [x] Add/update tests or content assertions proving normal paragraph text has no manual PDF-style line-break tokens/elements.
- [x] Ensure each city statistic circle has separate readable text and a fully visible icon image.
- [x] Add/update bounding-box checks proving circle labels/text do not overlap, hide, clip, or cover city circle icons.
- [x] Verify circle backgrounds/text containers do not obscure icon crops.
- [x] Replace/recreate/clean the `8 из 10` people-grid asset if the current crop is poor or semantically inaccurate.
- [x] Ensure the `8 из 10` pictogram group accurately shows 8 identical male pictograms and 2 female pictograms.
- [x] Add/update tests or structured asset metadata proving the `8 из 10` pictogram count and gender semantics.
- [x] Capture fresh desktop/mobile screenshots after the font, circle-icon, and people-grid fixes.

## Latest Asset-Fidelity Follow-Up Tasks

These tasks supersede earlier evidence that accepted clean SVG replacements solely because they were local, text-free, or semantically counted correctly. The user rejected those assets as visibly redrawn and different from the PDF.

- [x] Audit every pictogram/icon/image asset against the source PDF fragment and list which assets are original crops, cleaned originals, rejected SVG replacements, or structural vector shapes.
- [x] Replace latest clean SVG city circle assets with original motorcyclist, pedestrian, and car artwork crops or high-fidelity cleaned originals extracted from the PDF/source render at the best available resolution.
- [x] Replace/rework the `8 из 10` people-grid using original high-quality source pictograms/crop if possible; if cleanup is needed, preserve the original silhouette/style and exact 8 male plus 2 female semantics.
- [x] Do not use newly designed generic/reconstructed SVG pictograms/icons unless screenshot/source comparison proves they are visually indistinguishable from the original artwork.
- [x] Clean source crops only where visible Spanish text must be removed for Russian DOM/SVG text; do not over-clean or redesign the artwork.
- [x] Update asset metadata with source region, extraction resolution/source render, cleanup status, source-artwork mode, and fidelity evidence for each visual asset.
- [x] Add/update tests or assertions rejecting latest known clean SVG replacements as accepted artwork unless they are replaced by source-derived high-fidelity assets.
- [x] Add screenshot/source comparison evidence for city circle icons and the `8 из 10` people-grid.
- [x] Re-run content, unit/build, and targeted Playwright checks after replacing the rejected assets and record fresh evidence.

## Latest Layout/Framing Follow-Up Tasks

These tasks supersede earlier evidence that only proved readable text or no full-page raster. The web page must not feel like a blank PDF canvas containing a small data fragment.

- [x] Identify the meaningful `Pandemia vial` content region from the source page and record the framing decision in data/tasks evidence.
- [x] Reframe the visible web section around that content region instead of rendering a full PDF page-sized canvas/page shell.
- [x] Remove excessive blank top, side, and bottom whitespace while preserving the original infographic design, alignment, pinned image/infographic layout, source artwork, and typography relationships inside the content block.
- [x] Present the block with normal responsive web page margins and density.
- [x] Ensure desktop shows the block at readable scale without a tiny centered island.
- [x] Ensure mobile first view starts on meaningful content, not blank whitespace; allow pan/scroll only where the fixed infographic/content block requires it.
- [x] Add/update Playwright screenshot and bounding-box checks for content-region framing, excessive whitespace, desktop density, and mobile initial viewport.
- [x] Re-run screenshots after reframing and record evidence that the page feels like a normal web page section.

## Latest Responsive-Prose Follow-Up Tasks

These tasks supersede earlier evidence that the section was reframed but still implemented as one fixed-width canvas. Ordinary prose must adapt; only infographic/image blocks may remain pinned or horizontally scroll.

- [x] Separate normal prose roles (`heading`, `intro`, and bottom learning conclusion/body) from any fixed-width infographic canvas/scroller.
- [x] Render normal prose in responsive web flow, or otherwise ensure it fits the viewport/container, so it wraps naturally at the in-app/narrow browser width and mobile viewport.
- [x] Keep fixed/pinned layout only for the meaningful infographic/image block where preserving PDF-like layout requires it.
- [x] Ensure horizontal scroll/pan is scoped to the infographic/image block only and never required for normal prose.
- [x] Preserve source-derived PNG/crop assets, no rejected SVG runtime references, no full PDF page canvas/blank margins, no source UI/page marker/footnote/corner, font parity, and no forced paragraph line breaks while making prose responsive.
- [x] Add/update Playwright checks that measure `heading`, `intro`, and bottom learning conclusion/body bounding boxes at the in-app/narrow viewport and mobile viewport and fail on horizontal overflow/clipping.
- [x] Add/update checks that any horizontal scrolling container excludes normal prose roles and is limited to fixed infographic/image blocks.
- [x] Capture fresh narrow in-app and mobile screenshots proving prose wraps without clipping while the infographic remains source-faithful.

## Latest Selectable-Text Follow-Up Tasks

These tasks supersede earlier evidence that only checked text presence. The section must behave like a normal web page, not an image preview.

- [x] Ensure ordinary Russian text and meaningful statistic labels are real selectable/copyable DOM/SVG text, not baked into PNG/source crops or preview images.
- [x] At minimum verify `heading`, `intro`, bottom learning conclusion/body, and statistic labels do not use `user-select: none`, `pointer-events: none`, or equivalent selection/copy blockers.
- [x] Keep images/assets as images, but keep Russian prose and labels as accessible text layered or placed separately from the artwork.
- [x] Document any narrow fixed-infographic exception; it must not apply to `heading`, `intro`, bottom learning conclusion/body, or meaningful statistic labels.
- [x] Add/update Playwright checks that use computed `user-select`/`pointer-events` and browser selection APIs, or an equivalent selection/copyability check, for required prose and label roles.
- [x] Add/update tests proving meaningful statistic labels are represented as text nodes/elements and not only inside image assets.
- [x] Capture fresh evidence that text can be selected/copied at desktop, narrow in-app, and mobile viewports.

## Latest Lower-City-Row Alignment Follow-Up Tasks

These tasks supersede evidence that only checked no-overlap in the lower city rows. Source fidelity requires row-level alignment between each left pictogram block and its gray statistic panel; top alignment alone is not enough because the panel can still look vertically detached or too empty.

- [x] Align the top edge of `male-victims-panel`/`male-victims` with the top edge of `people-grid-icon` within a small tolerance.
- [x] Align the top edge of `age-range-panel`/`age-range` with the top edge of `people-pair-icon` within a small tolerance.
- [x] Add/update Playwright bounding-box checks comparing `people-grid-icon` to `male-victims-panel`/`male-victims`.
- [x] Add/update Playwright bounding-box checks comparing `people-pair-icon` to `age-range-panel`/`age-range`.
- [x] Preserve existing no-overlap checks while adding these top-alignment checks; no-overlap alone is not sufficient.
- [x] Strengthen lower-row non-regression checks to compare top, center, bottom, and height ratio between each pictogram block and its gray panel.
  - Evidence: `people-grid-icon` now uses a compact 58px source-geometry height matching `male-victims-panel`; `people-pair-icon` uses a compact 56px source-geometry height matching `age-range-panel`; Playwright asserts row center/bottom deltas and panel/icon height ratio.
- [x] Bound lower-row gray panel empty-space and lower padding so compact panels do not regress into tall empty boxes.
  - Evidence: Playwright asserts lower-row text bottom padding is not excessive and panel empty-space ratio stays at or below 0.32.
- [x] Capture fresh desktop/narrow/mobile screenshots showing lower city rows aligned like the source PDF.

## Latest Typography Follow-Up Tasks

These tasks supersede evidence that only checked font size parity with `Материалы`. The SF-rounded/Gotham-like attempt was rejected by user QA as visually worse and too decorative for this section; typography now prioritizes a modern readable UI/system stack while preserving selectable Russian text.

Architect note: any older completed evidence in this section that still requires SF-rounded / Arial Rounded primary alternatives is historical and does not satisfy final acceptance. The current direction rejects SFNSRounded/SF Compact Rounded/SF Pro Rounded-first stacks unless a later explicit user/Architect decision changes it.

- [x] Record rejected typography attempt before replacing it.
  - Rejected attempt: source PDF fonts were identified as GothamRounded Book/Light/Medium/Bold plus HelveticaWorld-Regular, but local Gotham files were unavailable. The attempted SF-rounded-first substitute (`SFNSRounded`, `SF Compact Rounded`, `SF Pro Rounded`, Arial Rounded, then Avenir/Helvetica fallbacks) did not satisfy user visual QA and is no longer the accepted direction.
- [x] Choose a simple readable modern UI/system stack aligned with current Apple/Google/UI design practice for legible interface text.
  - Decision: `.pandemia-prototype` now uses `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans", "Helvetica Neue", Arial, sans-serif`; no remote font dependency or bundled font asset was added.
- [x] Add an appropriate local font asset only if source/licensing is acceptable; do not introduce any remote font dependency.
  - Decision: no font asset was added; the accepted stack uses locally available platform UI fonts only.
- [x] Tune heading font family, weight, letter spacing, line-height, and block width for readability while keeping Russian selectable.
  - Evidence: `.pandemia-segment-heading` uses the modern UI stack, weight `700`, line-height `1.12`, letter-spacing `0`, and no forced `16ch`/narrow max-width that breaks `Дорожная пандемия` at desktop/in-app width.
- [x] Tune intro/body font family, weight, letter spacing, line-height, paragraph spacing, and text block width for comfortable reading while keeping responsive prose behavior.
  - Evidence: intro/body use the modern UI stack, normal body weight `400`, line-height `1.62`, letter-spacing `0`, and `67ch` responsive prose width.
- [x] Apply the same readable section typography to infographic text roles, including statistic cards, blue strips, gray boxes, labels, and numbers.
  - Evidence: every `.pandemia-segment`, including context labels, blue-strip labels, gray-panel statistics, numbers, captions, and city statistics, uses `var(--pandemia-font-family)` scoped to `.pandemia-prototype`; stat/context weights remain strong but non-decorative.
- [x] Ensure `В мире` and `В городе Буэнос-Айрес` use consistent weight/emphasis; do not bold only `Буэнос-Айрес`.
  - Evidence: both context labels use one consistent full-label style; no partial bolding remains.
- [x] Remove/avoid `::first-line`, nested-span, or equivalent partial styling if it creates asymmetric context-label emphasis.
  - Evidence: `.pandemia-segment-context-label::first-line` was removed and Node tests reject reintroducing it.
- [x] Add/update tests or Playwright checks recording computed `font-family`, `font-weight`, `line-height`, and letter spacing for heading and intro/body.
- [x] Add/update tests recording computed typography for infographic labels/numbers/cards, including blue strips and gray boxes, not only heading/body.
- [x] Add/update tests verifying context labels have consistent computed weight across each label, or that both labels use a documented symmetric two-level treatment.
  - Superseded evidence: existing Playwright evidence that requires SF rounded / Arial Rounded primary alternatives is rejected by the newest typography direction and must be replaced by the pending readability-first guard below.
- [x] Capture fresh desktop/narrow/mobile screenshots for typography comparison after tuning.
  - Screenshot evidence:
    - `test-results/app-Pandemia-vial-prototyp-41f38-an-PDF-faithful-composition-chromium/pandemia-vial-chromium.png`
    - `test-results/app-Pandemia-vial-prototyp-41f38-an-PDF-faithful-composition-chromium/pandemia-vial-narrow.png`
    - `test-results/app-Pandemia-vial-prototyp-41f38-an-PDF-faithful-composition-mobile/pandemia-vial-mobile.png`
- [x] Preserve source-derived PNG assets, lower-row alignment, responsive/selectable text, no rejected SVG runtime refs, no full PDF canvas, and no source UI/page marker/footnote/corner while tuning typography.

## Newest Readability-First Typography Correction Tasks

These tasks are pending because the user rejected the SF-rounded/Gotham-like pass and the forced heading wrap.

- [x] Replace any SFNSRounded/SF Compact Rounded/SF Pro Rounded-first or GothamRounded-like accepted stack with a modern UI readability stack: `system-ui`, `-apple-system`, `BlinkMacSystemFont`, `"Segoe UI"`, `Roboto`, `"Noto Sans"`, `"Helvetica Neue"`, Arial, sans-serif, or an equivalent locally bundled readable UI font with acceptable source/licensing.
- [x] Preserve embedded PDF font identification as context/evidence, but document why readability-first typography supersedes exact source-font mimicry for this section.
- [x] Ensure the primary Pandemia stack does not start with Avenir, `SFNSRounded`, `SF Compact Rounded`, or `SF Pro Rounded`; update tests that currently require SF-rounded alternatives.
- [x] Remove forced/narrow heading width constraints, including any `16ch`-style max width, that cause `Дорожная пандемия` to break into two lines at normal desktop/in-app width.
- [x] Verify the heading wraps naturally only when viewport/container width truly requires it.
- [x] Tune heading/body/stat-card/blue-strip/gray-box typography using the readability-first stack while preserving source hierarchy, source-like density, and selectable/copyable text.
- [x] Capture fresh desktop/narrow/mobile screenshots after typography correction.
- [x] Add/update Playwright or computed-style checks recording final `font-family`, `font-weight`, `line-height`, letter spacing, paragraph rhythm, and heading wrap behavior.

## Latest Infographic Geometry/Density Follow-Up Tasks

These tasks supersede evidence that only checked lower-row top alignment, no-overlap, or the general font stack. The statistic panels/cards must match source spacing, density, padding, and attachment geometry.

- [x] Measure source-like horizontal gaps between lower city pictogram blocks and gray statistic panels, then apply equivalent tolerances for `people-grid-icon` to `male-victims-panel`/`male-victims` and `people-pair-icon` to `age-range-panel`/`age-range`.
  - Evidence: `male-victims-panel` and `age-range-panel` were moved right to restore a visible white gap after the source-derived people icons; Playwright asserts the rendered gap is at least 28px.
- [x] Tune lower gray statistic panel height/width proportions so `8 из 10` and `49%` rows are not oversized empty containers.
  - Evidence: `male-victims-panel` is now 58 source-geometry px high and `age-range-panel` is 56 source-geometry px high; Playwright asserts rendered lower panel height is not oversized.
- [x] Tune lower gray panel text placement so text has balanced internal top/bottom padding or source-like vertical alignment rather than being pinned to the top.
  - Evidence: `male-victims` and `age-range` text bounds were narrowed and moved inside the panels; Playwright asserts at least 6px top and bottom padding inside each gray panel.
- [x] Tune upper global gray statistic cards so `1,4 МИЛЛИОНА` and `50 МИЛЛИОНОВ` cards have source-like density and not excessive empty gray space.
  - Evidence: global gray-card panels were shortened, and card text bounds were moved to keep top/bottom padding; Playwright asserts maximum card heights and internal padding.
- [x] Re-check statistic card font rhythm independently from the general font stack; card number/label rhythm must visually match the PDF.
  - Evidence: existing Playwright computed typography checks still cover `stat-card` and `stat-strip` roles after the card geometry changes.
- [x] Adjust airplane and stadium crop placement/cap geometry so each pictogram appears attached/linked to its blue strip as in the PDF.
  - Historical evidence now insufficient: prior checks proved attachment/touching, but Orchestrator live-preview QA found the strip now looks like a full-width rounded half-pill/dome. Attachment evidence must also prove localized cap geometry and rectangular left/right strip portions.
- [x] Add Playwright/bounding-box checks for lower-row horizontal gaps, gray panel width/height ratios, internal text top/bottom padding or vertical balance, upper-card empty-space ratios, and airplane/stadium icon-to-strip attachment.
  - Evidence: focused Playwright prototype test passed after adding these checks.
- [x] Add static geometry guards where useful for future regressions.
  - Evidence: focused Node test asserts key geometry for global strip panels, lower gray panels, lower text bounds, and blue-strip rounded cap CSS.
- [x] Capture fresh desktop/narrow/mobile screenshots and compare the lower city rows and upper global cards against the PDF fragment before user approval.
  - Screenshot evidence:
    - `test-results/app-Pandemia-vial-prototyp-41f38-an-PDF-faithful-composition-chromium/pandemia-vial-chromium.png`
    - `test-results/app-Pandemia-vial-prototyp-41f38-an-PDF-faithful-composition-chromium/pandemia-vial-narrow.png`
    - `test-results/app-Pandemia-vial-prototyp-41f38-an-PDF-faithful-composition-mobile/pandemia-vial-mobile.png`

## Newest Lower City Row Non-Regression Tasks

These tasks are pending because the lower city row alignment/density issue has repeated. Repeated user-reported issues become stricter guards, not just another note.

- [x] Re-check `male-victims-panel`/`male-victims` against `people-grid-icon` using full source row geometry: top, vertical center, bottom, height ratio, and source row/baseline feel.
- [x] Re-check `age-range-panel`/`age-range` against `people-pair-icon` using full source row geometry: top, vertical center, bottom, height ratio, and source row/baseline feel.
- [x] Bound lower gray panel height relative to its matching pictogram group and to its internal text block; panels must not extend far beyond the icon group or become huge empty containers.
- [x] Add/update empty-space ratio and bottom-whitespace checks for both lower gray panels.
- [x] Ensure any upper/global card geometry or typography fix reruns the full grouped visual non-regression suite, including lower city row alignment, density, padding, source-derived assets, selectable text, responsive prose, and rejected typography guards.
- [x] Capture fresh screenshots proving the lower rows read as two source-like paired rows, not floating panels above/below the pictograms.

## Latest Localized Cap Follow-Up Tasks

These tasks supersede attachment checks that only prove the icon touches the strip. The source uses a rectangular blue strip with a localized central cap/rise, not a full-width rounded dome.

- [x] Replace any full-width rounded half-pill/dome treatment on airplane/stadium blue strips with source-like geometry: rectangular strip body plus localized cap/rise under the icon.
  - Evidence: `airplane-strip-panel` and `stadium-strip-panel` are flat rectangular `blue-strip` shapes; `airplane-strip-cap` and `stadium-strip-cap` are separate localized `blue-cap` shapes.
- [x] Verify the left and right portions of each blue strip remain visually flat/rectangular and are not rounded as part of a single huge pill.
  - Evidence: `.pandemia-native-shape-blue-strip` uses `border-radius: 0`; focused Node test rejects the prior full-width rounded-top strip rule.
- [x] Verify any rounded/semicircular cap is localized near the airplane/stadium icon center and has a source-like width relative to the icon/strip.
  - Evidence: Playwright asserts each localized cap is narrower than 55% of its strip, starts/ends inside the strip, and is centered under the matching source icon.
- [x] Verify the localized cap and rectangular strip physically touch/overlap with no visible white seam between the cap/icon base and the blue strip.
  - Evidence: Playwright asserts each cap bottom reaches the flat strip bottom within 1px and each strip touches the gray panel seam within 2px.
- [x] Keep paired airplane/stadium global cards on the same layout grid: matching gray-panel heights, aligned bottom edges, and consistent text vertical placement.
  - Evidence: `airplane-card-panel` and `stadium-card-panel` now share the same 58px source geometry height and y-position; Playwright asserts rendered height and bottom deltas are within 2px.
- [x] Bound upper global-card empty-space ratio after tightening the gray panels so the cards do not regress into tall empty containers.
  - Evidence: Playwright asserts each card has bounded lower padding, balanced text center offset, and an empty-space ratio at or below 0.38.
- [x] Add Playwright/bounding-box or computed-style checks that distinguish localized cap geometry from whole-container `border-radius`.
  - Evidence: focused Playwright checks localized cap width/centering/merge behavior and computed `0px` strip corner radii, while focused Node checks flat strip CSS and separate cap geometry.
- [x] Capture fresh screenshots comparing the airplane/stadium strip/cap geometry to the PDF before user approval.
  - Screenshot evidence:
    - `test-results/app-Pandemia-vial-prototyp-41f38-an-PDF-faithful-composition-chromium/pandemia-vial-chromium.png`
    - `test-results/app-Pandemia-vial-prototyp-41f38-an-PDF-faithful-composition-chromium/pandemia-vial-narrow.png`
    - `test-results/app-Pandemia-vial-prototyp-41f38-an-PDF-faithful-composition-mobile/pandemia-vial-mobile.png`

## Latest Global Card Seam/Alignment Follow-Up Tasks

These tasks supersede checks that only prove card density or icon-strip contact. The paired global cards must behave as source-like matched panels.

- [x] Remove any white seam/gap between the airplane/stadium icon cap and the blue strip/card top so icon, cap, strip, and card read as one unit.
- [x] Preserve rectangular left/right edges for both blue strips and gray card panels; local cap geometry must not round or reshape the whole rectangle.
- [x] Equalize paired global-card panel heights for the `1,4 МИЛЛИОНА` and `50 МИЛЛИОНОВ` cards.
- [x] Align paired global-card bottom edges to the same baseline/grid within a small documented tolerance.
- [x] Bound gray-card empty-space ratio and tune text top/bottom padding so the text block does not leave a large unused lower area.
- [x] Add Playwright/bounding-box or screenshot/pixel checks for icon/cap/strip seam, rectangular panel preservation, paired-card height equality, paired-card bottom alignment, and empty-space ratio.
- [x] Capture fresh desktop/narrow/mobile screenshots comparing the paired global cards with the PDF before user approval.

## Forbidden Patterns Checklist

- [x] No runtime PDF iframe/object/embed.
- [x] No PDF.js, `PDFViewer`, or `getDocument(` runtime rendering.
- [x] No runtime `fetch(` for prototype/manual content.
- [x] No backend/live-AI/network dependency.
- [x] No remote GCBA image/manual asset dependency.
- [x] No full PDF/page raster rendered as section background/base.
- [x] No full PDF page-sized white canvas/page shell with huge blank top/side/bottom whitespace.
- [x] No tiny centered content island inside mostly blank page area.
- [x] No mobile initial viewport that starts on blank whitespace before the meaningful content.
- [x] No monolithic fixed-width canvas that contains ordinary prose and causes prose to clip or horizontally scroll.
- [x] No horizontal scroll/pan required for `heading`, `intro`, or bottom learning conclusion/body prose.
- [x] No rejected SVG runtime references are reintroduced while fixing responsive prose.
- [x] No ordinary Russian prose or meaningful statistic label is available only as image pixels.
- [x] No `user-select: none`, `pointer-events: none`, or equivalent blocker on `heading`, `intro`, bottom learning conclusion/body, or statistic labels.
- [x] No lower city gray statistic panel starts visibly lower/higher than its matching left pictogram block.
- [x] No lower city gray statistic panel crowds or overlaps its left pictogram block; a source-like white gap must remain.
- [x] No lower city gray statistic text is pinned to the panel's top edge without source-like vertical padding.
- [x] No lower city gray statistic panel remains oversized/empty after text fitting.
- [x] No global airplane/stadium gray card remains vertically oversized/empty after text fitting.
- [x] No airplane/stadium gray cards use different heights or visibly misaligned bottom edges.
- [x] No airplane/stadium card text has a large unbalanced lower empty area.
- [x] No airplane/stadium source crop icon looks detached from its blue strip cap.
- [x] No airplane/stadium blue strip renders as a full-width rounded half-pill/dome.
- [x] No whole-strip/container border-radius substitutes for the source's localized center cap/rise.
- [x] No white seam/gap appears between the localized cap and the rectangular blue strip.
- [x] No white seam/gap remains between icon/cap and the blue strip/card top.
- [x] No upper global paired cards have unequal panel heights or misaligned bottom edges.
- [x] No blue strip or gray card panel loses rectangular left/right edges because of full-panel rounding.
- [x] No global gray card leaves a large unused lower area or unbounded empty-space ratio.
- [x] No rejected SF-rounded/Gotham-like or Avenir-first typography remains as the accepted heading/body look.
- [x] No accepted Pandemia primary typography stack starts with Avenir, `SFNSRounded`, `SF Compact Rounded`, or `SF Pro Rounded` after the user's rejection.
- [x] No typography evidence relies only on "not Inter"; it must record embedded source font context plus the readability-first decision.
- [x] No forced/narrow heading width breaks `Дорожная пандемия` into two lines at normal desktop width.
- [x] No infographic card/blue-strip/gray-box/number/label typography remains outside the readability-first section system.
- [x] No disconnected typography where prose uses the readability-first stack but infographic text uses untuned default text.
- [x] No context-label partial bolding of only `Буэнос-Айрес`.
- [x] No `::first-line`, nested-span, or equivalent asymmetric context-label styling.
- [x] No remote font dependency.
- [x] No local font asset without acceptable source/licensing documentation.
- [x] No typography change that breaks responsive/selectable prose or meaningful infographic labels.
- [x] No mask-over-Spanish-text implementation.
- [x] No Russian DOM overlay translation on original Spanish page image.
- [x] No poor hand-drawn SVG assets remain where cleaned source crops would better match the original.
- [x] No visible Spanish text remains inside cropped assets.
- [x] No `Вписать` / `100%` scale controls.
- [x] No `Мировой контекст` / `Контекст города` buttons.
- [x] No visible source/provenance text that is not needed for ticket solving.
- [x] No visible footnote for this section.
- [x] No visible page marker/page number for this section.
- [x] No visible blue upper-left semicircle/corner book motif.
- [x] No text overflow in any rendered section segment.
- [x] No element overlap in infographic/circle areas or lower paragraph area.
- [x] No tiny text smaller than study-material-like text.
- [x] No intro/body text smaller than ordinary `Материалы` body text.
- [x] No forced PDF-style line breaks inside normal intro/body paragraphs.
- [x] No city circle icon is hidden, clipped, or covered by text/backgrounds.
- [x] No `8 из 10` people-grid asset with incorrect or unclear 8-male/2-female semantics.
- [x] No latest rejected clean SVG replacement remains as accepted pictogram/icon artwork.
- [x] No generic/reconstructed SVG pictogram/icon replaces source artwork when it visibly differs from the PDF.
- [x] No vectorized pictogram/icon is accepted without evidence that it is visually indistinguishable from source artwork.
- [x] No city circle motorcyclist/pedestrian/car icon uses generic new artwork instead of original/high-fidelity cleaned source artwork.
- [x] No `8 из 10` people-grid changes the original silhouette/style while preserving only the numeric semantics.
- [x] No side-by-side Spanish screenshot plus Russian text card.
- [x] No redesigned card/article/marketing layout replacing the PDF fragment.
- [x] No page-list-first prototype experience.
- [x] No whole-manual replacement in this slice.

## Required Verification Commands

Implementation Agent should record command results here:

Architect note: this older verification block was superseded by the final documentation/merge-prep evidence below. The typography and lower-row non-regression guards that were pending when this block was written are closed by later focused checks and final `pnpm run preflight`.

- [x] `pnpm run validate:content`
  - result: passed as part of `pnpm run build` on 2026-05-27 after the card/panel layout fidelity fix; output included `Content validation passed: 460 category B fallback questions, 276 local image references.`
- [x] Focused Node prototype test
  - command: `node --test tests/content-pandemia-vial-section.test.mjs`
  - result: passed on 2026-05-27 after the readable-typography/lower-row regression fix, 7/7 subtests; assertions require accepted runtime assets to be `*-source.png`, reject clean-vector/rejected SVG references in runtime data/app code, require responsive prose outside the fixed stage, require text selection not to be disabled, require the modern UI/system typography stack, reject SF-rounded-first/Avenir-first/Inter Pandemia stacks, reject context-label `::first-line` styling, and assert key source-like card/panel geometry guards
- [x] `pnpm run test`
  - result: passed on 2026-05-27 after the readable-typography/lower-row regression fix, 302/302 Node subtests
- [x] `pnpm run build`
  - result: passed on 2026-05-27 after the readable-typography/lower-row regression fix; Vite built successfully and service worker generated with 1746 cached assets
- [x] Targeted Playwright prototype check or `pnpm run test:e2e`
  - command: `pnpm exec playwright test tests/e2e/app.spec.ts -g "Pandemia vial prototype" --project=chromium --project=mobile`
  - result: passed on 2026-05-27, 2/2 tests after the readable-typography/lower-row regression fix; fresh desktop, narrow in-app-like, and mobile screenshots captured; checks include source-derived `*-source.png` accepted assets, reframed infographic density/no huge blank margins, desktop no tiny island, mobile no blank-start, responsive prose outside the horizontal-scroll stage, no document horizontal scroll required to read prose, 760px narrow viewport prose fit, intro/body font-size parity with `Материалы`, heading no forced `ch` max-width and desktop one-line rendering, no forced line breaks in normal paragraphs, text/stat labels selectable/copyable (`pointer-events` not `none`, `user-select` not `none`, Selection API includes intro/body Russian text), computed typography for heading/intro/body and infographic roles, modern UI/system stack, no SF-rounded-first stack, no Avenir-first stack, no Inter, no partial context-label `::first-line` styling, lower-row icon-to-panel gap, lower-row top/center/bottom/height-ratio alignment, lower gray panel height/density, lower empty-space ratio, lower text top/bottom padding, global gray-card height/density, equal global card heights/bottoms, rectangular blue strips with localized caps/no seam, airplane/stadium icon-to-blue-strip attachment, no visible source attribution, no footnote/page marker/corner motif, no text/icon overlap inside city circles, icon center not covered by text/background layers, explicit `8 male / 2 female` people-grid metadata, and no circle/lower-row overlap
- [x] `git diff --check`
  - result: passed on 2026-05-27 after the readable-typography/lower-row regression fix
- [x] `pnpm run preflight` before publish if Orchestrator assigns PR publication/final readiness.
  - result: passed in the final documentation/merge-prep pass after the hidden legacy-manual test hook adjustment; see `Implementation Evidence - Documentation And Merge Preparation`.

## Verification Evidence Placeholders

- Source span verified from manifest/navigation/reference image: `src/data/pandemiaVialSection.ts` records `intro-road-pandemic`, PDF page 15, marker `14`, chunk `gcba-manual-vehiculo-4-ruedas-2023--14-015`, and reference SHA `9e25a91abe857426dfcc978e361a2511a6ab7a0c144ccc97f757c72ffe4b1496`.
- Russian content/statistic coverage evidence: focused Node test checks required Russian title, intro, context labels, `1,4 МИЛЛИОНА`, `50 МИЛЛИОНОВ`, `96`, `48%`, `34%`, `11%`, `8 из 10`, `49%`, and the learning conclusion while asserting the visible Russian source-attribution sentences and footnote text are absent.
- Simple Russian wording review evidence: circular labels use `на мото`, `пешком`, `в авто`; focused Node test rejects listed formal residues.
- High-resolution source artwork crop evidence: runtime data now accepts seven source-derived PNG crops only: `icon-airplane-source.png`, `icon-stadium-source.png`, `icon-motorcyclist-source.png`, `icon-pedestrian-source.png`, `icon-car-source.png`, `icon-people-grid-source.png`, and `icon-people-pair-source.png`; each records PDF page 15 scale-4 extraction source, source region, cleanup status, source artwork mode, and fidelity evidence.
- Rejected clean SVG replacement removal evidence: focused Node tests reject `clean-vector-asset`, `icon-motorcyclist-clean.svg`, `icon-pedestrian-clean.svg`, `icon-car-clean.svg`, and `icon-people-grid-8m-2f.svg` in runtime data/app code; Playwright rejects those paths in rendered `img.currentSrc`; old SVG files may remain in the asset folder but are not referenced by accepted runtime data.
- City circle source-artwork fidelity evidence: motorcyclist, pedestrian, and car circles render cleaned original PNG crops from the PDF render, not generic SVG redraws; Playwright verifies each crop is inside its circle, separated from text, and not covered by text/background layers.
- `8 из 10` source silhouette/style evidence: `icon-people-grid-source.png` is a cleaned original PDF-render crop with structured metadata for 10 total pictograms, 8 male, 2 female, identical male signature, and source PDF silhouette signatures; focused Node and Playwright both assert this metadata and source-derived asset path.
- Content-region framing evidence: `src/data/pandemiaVialSection.ts` records `contentFrame` `{ x: 318, y: 452, width: 638, height: 890 }`, `firstMeaningfulContentOffset: { x: 30, y: 20 }`, and `bottomContentMargin: 38`, explicitly excluding the PDF page whitespace, book corner, footnote, and page marker.
- Desktop no-tiny-island/normal-density evidence: Playwright asserts the rendered infographic frame width is greater than 850px, aspect ratio is `0.68..0.9` rather than full-page PDF, heading starts within 80px top and 90px left of the frame, and infographic content-bound margins are under tight ratios (`left < 0.08`, `top < 0.05`, `right < 0.12`, `bottom < 0.08`).
- Mobile no-blank-start evidence: Playwright asserts the fixed content block is wider than the mobile stage only where horizontal pan is needed, and `scrollLeft < 8` so the first mobile view starts at the reframed content edge rather than blank PDF whitespace.
- Narrow in-app viewport prose no-horizontal-overflow evidence: Playwright sets chromium viewport to `760x900` after the main checks and verifies responsive prose stays inside the viewport, is not absolute/fixed, has no horizontal clipping, and does not make `document.documentElement.scrollWidth` exceed the viewport.
- Mobile viewport prose no-horizontal-overflow evidence: the same Playwright prose-fit guard runs in the mobile project and verifies prose is readable without horizontal pan while the fixed infographic remains scrollable.
- Infographic-only horizontal scroll scope evidence: `heading` and `intro` render in `pandemia-prose-intro`, `body` renders in `pandemia-prose-conclusion`, and Playwright asserts no `[data-prose-role="responsive"]` elements are inside `pandemia-stage-scroll`.
- Source-derived PNG assets/no rejected SVG runtime references preserved evidence: focused Node and Playwright checks still require seven accepted `*-source.png` crop assets and reject `clean-vector-asset`, `icon-*-clean.svg`, and `icon-people-grid-8m-2f.svg` runtime references.
- Selectable/copyable prose evidence: Playwright verifies every prose segment has `pointer-events` not `none` and `user-select` not `none`, then uses the browser Selection API over intro/body and asserts the selected text includes `Дорожное движение - одна из самых сложных систем` and `Это показывает: чтобы дороги стали безопаснее`.
- Selectable/copyable statistic labels evidence: meaningful infographic labels remain `pandemia-segment` DOM text nodes in the fixed infographic and are included in the computed-style guard requiring `pointer-events` not `none` and `user-select` not `none`.
- Text interaction CSS evidence (`user-select`/`pointer-events`): `.pandemia-segment` explicitly sets `pointer-events: auto` and `user-select: text`; focused Node tests assert those rules and assert `.pandemia-text-layer` does not disable pointer events.
- Text-node/accessibility evidence for meaningful labels: Playwright finds statistic labels with text locators such as `1,4 МИЛЛИОНА`, `50 МИЛЛИОНОВ`, `96 погибших`, `48% на мото`, `8 из 10`, and `49% от 25 до 54 лет`, proving they are DOM text rather than only image pixels.
- Lower city `8 из 10` row alignment evidence (`people-grid-icon` vs `male-victims-panel`/`male-victims`): latest Playwright run verifies the gray panel starts within 4px of the people-grid crop top edge, centers and bottoms align within 3px, the panel/icon height ratio is `0.94..1.06`, and the text remains fully inside the aligned gray panel.
- Lower city `49%` row alignment evidence (`people-pair-icon` vs `age-range-panel`/`age-range`): latest Playwright run verifies the gray panel starts within 4px of the two-person crop top edge, centers and bottoms align within 3px, the panel/icon height ratio is `0.94..1.06`, and the text remains fully inside the aligned gray panel.
- Lower city pictogram-to-panel horizontal gap evidence: Playwright asserts both lower-row icon-to-panel gaps are at least 28px.
- Lower city gray panel proportion/empty-space evidence: static Node guards assert compact source geometry for `people-grid-icon`/`male-victims-panel` and `people-pair-icon`/`age-range-panel`; Playwright asserts lower-row panel empty-space ratio is at most 0.32.
- Lower city gray panel text padding/vertical-balance evidence: Playwright asserts lower-row text has at least 6px top/bottom padding, bounded lower padding, and compact balanced placement inside each panel.
- Upper global card gray-box density evidence: `airplane-card-panel` and `stadium-card-panel` were tightened to matching 58px source-geometry heights; Playwright asserts rendered height <= 110px, bounded empty-space ratio, bounded lower padding, and vertically balanced card text.
- Upper global statistic card font-rhythm evidence:
- Airplane/stadium paired-card alignment evidence: Playwright asserts the airplane and stadium gray panels have matching rendered heights and aligned bottom edges within 2px.
- Airplane/stadium icon-to-blue-strip attachment/cap geometry evidence: Playwright asserts each flat strip touches its gray card, each localized cap rises above and merges into the flat strip with no white seam, and each source icon visually links into its localized cap.
- Blue-strip localized cap geometry/not-full-width-dome evidence: focused Node test rejects full-width rounded-top `.pandemia-native-shape-blue-strip`, requires separate `airplane-strip-cap`/`stadium-strip-cap` geometry and `.pandemia-native-shape-blue-cap`; Playwright asserts each strip corner radius is `0px`, each cap is narrower than 55% of the strip, contained within the strip width, centered under the matching icon, and aligned to merge with the flat strip rather than becoming a detached dome.
- Global card icon/cap/strip no-white-seam evidence:
- Global paired-card equal-height/bottom-alignment evidence:
- Global blue/gray panel rectangular left-right edge evidence:
- Global gray-card empty-space ratio/text padding evidence:
- Typography font choice/local source evidence: the earlier source-font pass identified GothamRounded-Book (`325`), GothamRounded-Light (`300`), GothamRounded-Medium (`350`), GothamRounded-Bold (`700`), plus HelveticaWorld-Regular, and confirmed local Gotham files were unavailable. User QA rejected the SF-rounded-first substitute as worse; `.pandemia-prototype` now defines the local/offline readability-first UI stack `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans", "Helvetica Neue", Arial, sans-serif`; no remote font dependency or bundled font asset was added.
- Heading computed typography evidence (`font-family`/`font-weight`/`line-height`/letter spacing/block width): Playwright records heading computed font family, rejects `Inter`, rejects SF-rounded-first and Avenir-first, requires a modern UI/system family, verifies readable strong weight in `680..760`, line-height ratio within `1.02..1.16`, and non-negative letter spacing; CSS sets weight `700`, line-height `1.12`, letter-spacing `0`, and no forced `16ch` max-width.
- Heading no-forced-wrap evidence: Playwright asserts the desktop/in-app heading has no `ch`-based forced narrow max-width, rendered height stays within one line-height band, and `scrollWidth` does not exceed `clientWidth`; mobile may wrap only under real viewport constraints.
- Intro/body computed typography evidence (`font-family`/`font-weight`/`line-height`/paragraph spacing/text width): Playwright records intro/body computed font family, rejects `Inter`, rejects SF-rounded-first and Avenir-first, verifies normal readable body weight in `390..430`, line-height ratio in `1.55..1.75`, and non-negative letter spacing; CSS sets weight `400`, line-height `1.62`, letter-spacing `0`, and `67ch` responsive paragraph width.
- Infographic/card/number typography evidence (`font-family`/`font-weight`/`line-height`/letter spacing for cards, blue strips, gray boxes, labels): Playwright records computed typography for all `.pandemia-segment` roles, including `context-label`, `stat-strip`, `stat-card`, and `city-stat`; each uses the modern UI Pandemia stack, rejects SF-rounded-first, rejects Avenir-first and `Inter`, keeps non-negative letter spacing, and records concrete line-height/weight values.
- Context label weight consistency evidence: Playwright verifies the two context labels are exactly `city-label` and `global-label`, and that their computed font weights match. CSS uses one full-label `font-weight: 700` rule for `.pandemia-segment-context-label`.
- No partial context-label pseudo-style/nested-span evidence: Node checks reject `.pandemia-segment-context-label::first-line`; Playwright compares each context label's base computed font family/weight to its `::first-line` computed font family/weight to guard against accidental partial emphasis.
- Typography comparison screenshot evidence: latest desktop, narrow, and mobile screenshots are `test-results/app-Pandemia-vial-prototyp-41f38-an-PDF-faithful-composition-chromium/pandemia-vial-chromium.png`, `test-results/app-Pandemia-vial-prototyp-41f38-an-PDF-faithful-composition-chromium/pandemia-vial-narrow.png`, and `test-results/app-Pandemia-vial-prototyp-41f38-an-PDF-faithful-composition-mobile/pandemia-vial-mobile.png`.
- Image/text hit-test evidence: `pandemia-text-layer` uses `display: contents`, actual text nodes carry the text z-index, image crops remain ordinary `img` elements, and Playwright confirms city icon centers resolve to their crop asset rather than a transparent overlay or text/background layer.
- Cropped asset text-cleaning evidence: data records `containsText: false` and cleanup statuses for all source-derived assets; Playwright verifies rendered accepted assets are local `*-source.png` files, not full-page rasters or rejected SVG/vector paths.
- Evidence that full page image is reference-only and not rendered as background/base: data marks `page-015.jpg` reference-only; focused Node test forbids runtime `assetUrl(pandemiaVialSection.source.referenceAsset...)`; Playwright confirmed page style does not include `page-015.jpg`.
- Evidence that mask-over-Spanish-text approach is absent: focused Node test forbids mask classes/test IDs and `PandemiaVialMask`; Playwright confirmed `pandemia-source-mask` count is 0.
- Evidence that Russian overlay translation on original page image is absent: runtime renders `data-rendering="native-html-css-svg"` and seven isolated crops only; no full-page reference asset is mounted.
- Minimum text scale evidence: Playwright checked every `pandemia-segment` font size is at least `max(14px, Materials body text * 0.875)` and no segment overflows horizontally or vertically.
- Intro/body font parity evidence: Playwright first measured ordinary `Материалы` paragraph text from `.material-unit-copy p`, then asserted `intro` and `body` computed font-size are within `-0.5px/+2px` of that value; CSS uses `font-size: 1rem` for both normal paragraph roles.
- Normal paragraph no-forced-line-break evidence: `intro` and `body` `textRu` strings contain no `\n`; CSS sets `white-space: normal` for those roles; Playwright asserts their rendered `textContent` has no newline and wraps as adaptive paragraph text.
- City circle icon visibility evidence: latest Playwright run after source PNG replacement verifies text stays above the crop, crops stay inside circle bounds, and the crop center is the top element at the icon center point.
- `8 из 10` pictogram semantic accuracy evidence: latest focused Node and Playwright runs verify source PNG path plus `8 male / 2 female` structured metadata and source silhouette signatures.
- Removed zoom/context controls evidence: Playwright confirmed no `pandemia-zoom-fit`, `pandemia-zoom-actual`, focus controls, `Вписать`, `100%`, or context buttons.
- Removed source/provenance/footnote/page marker/book motif evidence: focused Node test forbids rendered provenance controls, corner motif classes/IDs, page-marker/footnote roles, and visible footnote/source-attribution text; Playwright confirms no provenance block, footnote segment, page-marker segment, or `corner-motif` shape is rendered.
- Bottom paragraph learning-relevant conclusion evidence: `body` visible text is reduced to `Это показывает: чтобы дороги стали безопаснее, работать над этим нужно всему обществу вместе.`
- Automated no-overlap/bounding-box evidence: Playwright checks every city-circle text box stays above its matching icon asset, does not overlap it, each icon stays inside its circle, icon centers are not covered by text/background layers, and all three circles leave at least an 8px vertical gap before the people-grid icon and `male-victims` row.
- Screenshot review evidence: desktop and mobile screenshots listed below were visually checked after the latest user-caught issue fix.
- Content-frame screenshot evidence: latest desktop/mobile screenshots listed below were captured after source PNG replacement and reframing checks; desktop visually shows the cropped content block as the article, and mobile starts on the left content edge with horizontal pan only for the fixed-format infographic.
- Historical responsive-prose evidence, now superseded: prior checks did not catch the narrower in-app browser case where a reframed fixed-width canvas clips or horizontally scrolls ordinary prose.
- Historical text-presence evidence, now superseded: content/DOM checks must be strengthened with selectable/copyable text checks because the user reported the section feels like an image preview.
- Reusable future-section checklist applied: visible learning-only pruning, no book-only marker/corner/footnote, no source-attribution paragraph, and bounding-box overlap guards were applied to this prototype.
- Forbidden-pattern scan evidence: focused Node test scanned the prototype data/app/style slice for iframe/object/embed/PDF.js/fetch/remote assets/full-page raster/mask/overlay/old UI patterns.
- Desktop readability/visual evidence: `test-results/app-Pandemia-vial-prototyp-41f38-an-PDF-faithful-composition-chromium/pandemia-vial-chromium.png`
- Narrow in-app-like readability/visual evidence: `test-results/app-Pandemia-vial-prototyp-41f38-an-PDF-faithful-composition-chromium/pandemia-vial-narrow.png`
- Mobile readability/visual evidence: `test-results/app-Pandemia-vial-prototyp-41f38-an-PDF-faithful-composition-mobile/pandemia-vial-mobile.png`
- Russian text fitting differences: top blue strip labels were separated with a wider safe center gap; circular labels use compact learner wording; normal intro/body prose wraps without forced newlines; lower city gray rows are top-aligned with their matching left pictogram crops; body keeps only the learning conclusion. City circle icons and people-grid artwork now use original/high-fidelity source-derived PNG crops rather than rejected SVG/vector redraws.
- Screenshot path or artifact for user approval: desktop and mobile paths listed above.
- Local dev/preview server URL for user approval: Playwright preview served at its worktree-derived local URL during the test run; no persistent preview server was left running.

## Review Requirements

Review Agent must check:

- [x] Complete feature memory exists and tasks are current.
- [x] Implementation remains limited to the four current Introduction `Índice` headings and does not become a whole-document conversion.
- [x] `Pandemia vial`, `Enfoque ético - ciudadano en la cultura vial`, `¿Accidente o incidente de tránsito?`, and `Plan de seguridad vial de la Ciudad de Buenos Aires` are separate route/navigation entries.
- [x] Document navigation is based on source `Índice` headings rather than raw PDF pages; `Plan de seguridad vial de la Ciudad de Buenos Aires` is not split into page-number routes.
- [x] Source span and Russian coverage are complete for each Introduction heading, including statistic/infographic labels when present.
- [x] The three added headings have source-span evidence from source `Índice`, navigation/manual/layout manifests, and PDF renders before implementation acceptance.
- [x] Text-heavy added headings use normal responsive prose/list/callout layout; any visual blocks use source-derived artwork and selectable/copyable Russian DOM/SVG text.
- [x] Navigation is a scalable full-document hierarchy with support entries, chapter/annex groups, and child entries from the source `Índice`; it is not a flat page list or Introduction-only tab/card strip.
- [x] Main app navigation exposes the interactive Russian manual as `Руководство`, with the full `Índice` hierarchy inside that section.
- [x] Legacy `Руководство 4R` is not exposed as a separate user-facing manual/guide destination beside the new interactive document.
- [x] Current Introduction pages are reachable through `Руководство`, not through a prototype/experimental/Introduction-only block.
- [x] Russian navigation labels are visible, with Spanish source titles and `Pág.` refs retained as metadata rather than content-page clutter.
- [x] Unimplemented future groups/children are pending/disabled/collapsed placeholders and do not create fake content pages.
- [x] Active Introduction item is discoverable inside the full hierarchy with active group and child state.
- [x] Navigation route/hash behavior, keyboard interaction, accessible labels/current-state semantics, disabled/pending semantics, and mobile/narrow usability are verified.
- [x] Direct hashes `#pandemia-vial`, `#intro-enfoque-etico`, `#intro-accidente-incidente`, and `#intro-plan-seguridad-vial` open the matching `Руководство` child content, set active state, and work in mobile/narrow navigation.
- [x] Tests/review evidence rejects duplicate manual destinations and lingering visible `Руководство 4R` tab/link text.
- [x] Prototype is a native Russian HTML/CSS/SVG rebuild with isolated cleaned source assets where appropriate.
- [x] Full PDF/page raster is not rendered as background/base.
- [x] The visible web section is cropped/reframed around the meaningful `Pandemia vial` content region, not a full PDF page-sized blank canvas.
- [x] Desktop shows readable normal-density content without a tiny centered island.
- [x] Mobile starts on meaningful content and only scrolls/pans where the fixed infographic requires it.
- [x] `heading`, `intro`, and bottom learning conclusion/body prose are responsive web-flow content and do not horizontally clip/overflow at in-app/narrow or mobile viewport widths.
- [x] Horizontal scrolling/panning is scoped only to fixed infographic/image blocks, not normal prose.
- [x] `heading`, `intro`, bottom learning conclusion/body, and meaningful statistic labels are selectable/copyable text, not image-preview pixels.
- [x] Required text roles do not disable `user-select` or `pointer-events`, and selection/copyability is verified by tests.
- [x] Lower city row top alignment matches the source: `people-grid-icon` aligns with `male-victims-panel`/`male-victims`, and `people-pair-icon` aligns with `age-range-panel`/`age-range`.
- [x] Lower city row full geometry matches the source: panel top, center, bottom, height, and row/baseline feel are proportionate to the matching pictogram block; top-edge tolerance alone is insufficient.
- [x] Lower city rows preserve source-like horizontal gap between pictograms and gray panels.
- [x] Lower city gray panels preserve source-like proportions/density and do not contain excessive empty space.
- [x] Lower city gray panels have bounded empty-space ratio and bottom whitespace relative to icon group and text block.
- [x] Lower city gray panel text has source-like internal padding/vertical balance and is not pinned to the top.
- [x] Heading/body typography uses the accepted modern readable UI/system stack, not the rejected SF-rounded/Gotham-like or Avenir-first direction.
- [x] Rejected font attempts are recorded when user QA supersedes source-font imitation with readability-first UI typography.
- [x] Font choice is local/offline; any added font asset has acceptable source/licensing evidence and no remote dependency.
- [x] SFNSRounded/SF Compact Rounded/SF Pro Rounded, Avenir, or decorative rounded fonts do not lead the accepted Pandemia stack.
- [x] Computed heading and intro/body `font-family`, `font-weight`, `line-height`, letter spacing, and paragraph/text block rhythm are recorded in tests/evidence.
- [x] Heading does not use a forced narrow width/max-width that wraps `Дорожная пандемия` at normal desktop/in-app width.
- [x] Infographic labels/numbers/cards/blue strips/gray boxes also use the accepted readable UI typography and computed metrics are recorded.
- [x] Upper global statistic cards preserve source-like gray-box density and number/label rhythm; font-stack evidence alone is not accepted if card rhythm is visibly off.
- [x] Airplane/stadium pictograms visually attach to their blue strip/cap geometry as in the PDF, with bounding-box/screenshot evidence.
- [x] Airplane/stadium blue strips remain rectangular at left/right with only a localized cap/rise near the icon center; they are not full-width rounded domes.
- [x] Airplane/stadium icon/cap/strip/card top have no white seam/gap and read as one source-like unit.
- [x] Paired upper global card panels have equal heights and aligned bottom edges/baseline grid.
- [x] Upper global blue strips and gray panels preserve rectangular left/right edges; local cap geometry does not reshape the whole rectangle.
- [x] Upper global gray-card empty-space ratio is bounded, with source-like text top/bottom padding and no large unused lower area.
- [x] Context labels use consistent emphasis; `Буэнос-Айрес` is not the only bolded part and no asymmetric `::first-line`/nested-span styling remains.
- [x] Mask-over-Spanish-text and Russian-overlay-on-original-page-image approaches are absent.
- [x] Smallest rendered text is comparable to existing study-material text.
- [x] Intro/body explanatory text is approximately the same size as ordinary `Материалы` body text.
- [x] Normal intro/body paragraphs wrap by container width and contain no forced line breaks inserted to mimic PDF wrapping.
- [x] Poor SVG redraws and latest rejected clean SVG replacements are replaced by original PDF/source artwork crops or visually indistinguishable high-fidelity cleaned originals.
- [x] No newly designed generic/reconstructed SVG pictograms/icons are accepted when visibly different from the PDF.
- [x] Any vectorized pictogram/icon has source comparison evidence proving it is visually indistinguishable from the original artwork.
- [x] Page 17 `Factores de Riesgo` / `Recomendaciones` preserves source wind/tree, car, people, gray/yellow panels, blue recommendation label, border, spacing, and proportions; generic native cards/icons and generic person/avatar icons are absent, and the decorative clipboard/check icon is intentionally omitted.
- [x] Page 17 risk-factor/recommendation artwork has source-derived asset metadata/crops or source-faithful reconstruction metadata, no visible Spanish, selectable Russian text layers, and screenshot comparison evidence.
- [x] Latest page 17 risk-card geometry blocker is resolved: three source-like long rounded panels exist with correct light-gray/yellow roles, rounded right corners, integrated circular/lobed left edge, source pictogram centered/fully visible inside the lobe, source-like spacing, source-like title/body positions, and no square/rectangular crop artifacts.
- [x] Superseded: earlier page 17 `Recomendaciones` clipping blocker required a fully visible clipboard/check icon. Latest user feedback replaces it with full omission of that decorative icon and validation of the remaining callout alignment.
- [x] Pages 18-20 work-axis/consequences diagrams preserve source pictograms/infographic artwork and do not accept generic icon/card replacements as final.
- [x] Page 18 `Consecuencias de los Incidentes de tránsito` preserves the original gauge/semi-circle diagram, black fatal-victims wedge/label, beige category panels, family/economy, health, institutions icons, pointer, colors, connector lines, spacing, geometry, proportions, and overall composition.
- [x] Page 18 consequences visual has source-derived asset metadata/regions/crops or source-faithful reconstruction metadata, no visible Spanish, selectable Russian text where feasible, and screenshot comparison evidence.
- [x] Latest page 18 distortion blocker is resolved: the assembled consequences diagram is visually recognizable as the source gauge/semi-circle composition, with aligned beige sectors, gray outer arc, dark center ring, pointer, black fatality wedge/label, category labels, connector lines, source-like relative spacing/proportions, and no floating fragments or overlaps.
- [x] Page 18 no-distortion checker evidence proves source-derived pieces are not merely present but correctly assembled; it fails white/gray chunks over arcs, black wedge/text collision, label/connector misalignment, category text collision, broken seams, clipped fragments, stretched crops, disconnected fragments, and mismatched geometry.
- [x] Page 19 `Ejes de trabajo` preserves four gray circular fields, exact walking/pedestrian, megaphone, officer/police, and group/people pictograms, original icon sizes/placement, blue title style, title/circle/text relationships, two-column grid spacing, and proportions.
- [x] Page 19 work-axis visual has source-derived asset metadata/regions/crops or source-faithful reconstruction metadata, no visible Spanish, selectable Russian text where feasible, and screenshot comparison evidence.
- [x] Latest page 19 axis-icon clipping blocker is resolved: all four pictograms are complete inside gray circles at desktop, narrow, and mobile widths, with no cropped quadrants, cut-off tips, visible square crop-box corners, parent-overflow clipping, or icon/background coverage.
- [x] Latest page 19 source-composition blocker is resolved: desktop remains a source-like two-column circle/title/text grid, and any responsive stacked variant preserves full icons, source-like spacing, and title/circle/text relationships.
- [x] Reusable style guideline/tokens exist for recurring block types and include typography, sizing, line-height, colors, paddings, margins, borders/radii, alignment, icon/image positioning, and responsive behavior.
- [x] Blue law/callout blocks share consistent background color, left accent stripe, padding, text alignment, font weight, line-height, width behavior, and margin cadence unless a source-backed variant is documented.
- [x] Cropped image/icon assets contain no visible Spanish text.
- [x] `Вписать` / `100%` controls are absent.
- [x] `Мировой контекст` / `Контекст города` buttons are absent.
- [x] Visible source/provenance details not needed for ticket solving are absent.
- [x] Footnote is absent.
- [x] Page marker/page number is absent.
- [x] Blue upper-left semicircle/corner book motif is absent.
- [x] Bottom paragraph keeps only the learning-relevant road-safety conclusion.
- [x] Automated overlap/bounding-box checks prove no text overflow, no element overlap, and lower city row top alignment.
- [x] Automated bounding-box checks prove lower city row full geometry: panel top/center/bottom/height and empty-space/bottom-whitespace bounds.
- [x] Automated bounding-box checks prove lower-row gaps, panel proportions, text padding/vertical balance, upper-card density, and icon-to-strip attachment geometry.
- [x] Automated or screenshot evidence distinguishes local cap/rise geometry from whole-container border-radius on airplane/stadium strips.
- [x] Automated bounding-box/screenshot checks prove no icon/cap/strip seam, rectangular panel preservation, paired-card height equality, paired-card bottom alignment, and bounded empty-space ratio.
- [x] Post-completion visual source-fidelity checker/harness was implemented or updated for these Introduction pages and run before Implementation Agent claimed done.
- [x] Visual checker report includes source screenshots, Russian screenshots, component/bounding-box metadata, asset presence/source-region checks, style-token checks, navigation-shell checks, and explicit pass/fail status.
- [x] Visual checker fails on lost/modified/simplified/replaced source images, infographics, pictograms, layout, formatting, or style, including page 17 risk/recommendation, page 18 gauge/consequences, page 19 work-axis pictograms, blue callout style, and full-document navigation shell regressions.
- [x] Visual checker fails when source-derived assets exist but visible composition clips, square-crops, covers, force-crops, or misframes required icons inside source circles/lobes.
- [x] Visual checker includes bounding-box/object-fit/overflow checks for page 17 risk-card lobes, page 17 recommendation callout alignment/no reintroduced clipboard, page 19 gray circles, and page 18 no-distortion composition, plus screenshot/manual-review evidence.
- [x] City circle icons are fully visible, not hidden/covered by text or backgrounds, and use original motorcyclist/pedestrian/car artwork crops or high-fidelity cleaned originals.
- [x] `8 из 10` people-grid accurately communicates 8 male pictograms and 2 female pictograms while preserving original silhouette/style.
- [x] The user-found circle overlap bug is represented as a reusable checklist item and guarded by tests.
- [x] Every accepted visual issue from this iteration is represented as a reusable requirement/checklist item/evidence expectation for future PDF-section conversions.
- [x] Russian wording is natural, simple, and precise, preserving all ticket-relevant source details and avoiding formal literal translation.
- [x] Plan shared-responsibility, Vision Zero, and safe-system paragraphs have explicit natural-Russian adaptation review.
- [x] Ticket-detail retention checks compare simplified Russian against available local ticket/practice-source material and prove no ticket-critical information was removed, weakened, or changed.
- [x] Local paragraph/sentence transformations are reviewed before/after for preserved order, preserved ticket-critical details, and no global structure change.
- [x] Prototype is site-native and local-first.
- [x] Tests verify content coverage, route availability, readability, typography computed metrics/screenshots, selectable/copyable text, responsive prose no-horizontal-overflow at narrow/mobile widths, infographic-only horizontal scroll scope, native visual presence, no full-page raster base, no masks/overlay translation, removed controls/buttons, and absence of old UI.
- [x] Implementation Agent provided URL plus screenshot/description for user approval.

## Decisions

- Architect: active feature 029 is allowed to extend from `Pandemia vial` to the current Introduction block set because the Analyst intake explicitly described a staged rollout: approve `Pandemia vial`, then do several more blocks, then later consider whole-document conversion.
- Architect: this extension remains limited to the four current source `Índice` headings: `Pandemia vial`, `Enfoque ético - ciudadano en la cultura vial`, `¿Accidente o incidente de tránsito?`, and `Plan de seguridad vial de la Ciudad de Buenos Aires`.
- Architect: document navigation must be based on source `Índice` headings, not raw PDF pages.
- Architect: each source `Índice` heading in scope becomes its own route/navigation item; `Plan de seguridad vial de la Ciudad de Buenos Aires` remains one route even when its verified source span covers pages 18-20.
- Architect: navigation must be designed as the first populated slice of the future full Russian interactive manual IA, not as a one-off horizontal Introduction list.
- Architect: target navigation IA includes `Presentación`, `Glosario`, `INTRODUCCIÓN`, chapters 1-5, and annexes I-IV from the source `Índice`; current Introduction routes are populated children and future entries are pending/disabled/collapsed placeholders.
- Architect: user-visible navigation labels are Russian, while Spanish source titles and page refs remain metadata for mapping/QA and must not become content-page provenance clutter.
- Architect: navigation must support direct route/hash behavior, active group/child state, keyboard/a11y labels, current-state semantics, and mobile/narrow usability.
- Architect: the integrated Russian interactive document is the main app destination `Руководство`.
- Architect: `Руководство` replaces the user-facing `Руководство 4R` manual-viewer destination; both must not appear as separate current guide/manual destinations.
- Architect: existing hashes `#pandemia-vial`, `#intro-enfoque-etico`, `#intro-accidente-incidente`, and `#intro-plan-seguridad-vial` remain supported as deep links into `Руководство` child content.
- Architect: current Introduction pages must be reachable through `Руководство`, not through a separate prototype, experimental block, or Introduction-only destination.
- Architect: every new Introduction page inherits the reusable `Pandemia vial` QA contract: native web page, selectable/copyable Russian text, no PDF viewer/full-page raster/mask/overlay translation, responsive prose, readable local/offline UI typography, no unnecessary source/provenance/page/book-layout clutter, source-derived assets where needed, Playwright layout/nav checks, content tests, and screenshot evidence.
- Architect: Implementation Agent must verify exact source spans, source text, images, visual hierarchy, and layout for each added heading from source `Índice`, manifests, and PDF renders before building.
- Architect: primarily textual added headings should use normal responsive web prose/list/callout layout while preserving source hierarchy; headings with visual blocks/images use source-derived cleaned artwork and DOM/SVG Russian text.
- Architect: full page raster background/base, Spanish text masks, and Russian overlay translation on the original page image remain forbidden.
- Architect: the PDF page is a source/layout reference for the content block only; do not render a full PDF page-sized white canvas or preserve huge blank margins.
- Architect: crop/reframe the visible web section around the meaningful `Pandemia vial` content region while preserving the internal infographic layout and typography relationships.
- Architect: desktop must avoid a tiny centered island, and mobile must not start on blank whitespace before content.
- Architect: normal prose roles (`heading`, `intro`, and bottom learning conclusion/body) must be responsive web-flow content and must not live inside a fixed-width horizontal-scrolling canvas.
- Architect: horizontal scroll/pan is allowed only for fixed infographic/image blocks where pinned PDF-like layout requires it.
- Architect: ordinary Russian text and meaningful statistic labels must be selectable/copyable accessible text; the section must not feel like an image preview.
- Architect: at minimum `heading`, `intro`, bottom learning conclusion/body, and statistic labels must not disable `user-select` or `pointer-events`.
- Architect: lower city gray statistic panels must start at the same vertical level as their corresponding left pictogram blocks within a small tolerance.
- Architect: Playwright must compare `people-grid-icon` with `male-victims-panel`/`male-victims` and `people-pair-icon` with `age-range-panel`/`age-range`.
- Architect: lower city row fidelity also requires source-like horizontal gap, row-level top/center/bottom/height alignment, gray-panel proportions/density, and internal text padding/vertical balance; top alignment alone is insufficient.
- Architect: repeated lower city row regressions must become stricter non-regression guards, including empty-space and bottom-whitespace checks plus grouped visual QA reruns after any related fix.
- Architect: upper global statistic cards require source-like gray-box density, card font rhythm, and airplane/stadium icon-to-blue-strip attachment/cap geometry.
- Architect: airplane/stadium cap geometry must remain localized near the icon on an otherwise rectangular strip; full-width rounded pill/dome strips are rejected.
- Architect: upper global icon/cap/strip/card top must have no white seam, the paired panels must have equal heights and aligned bottoms, and gray-card empty-space ratio must be bounded.
- Architect: current accepted font work is not enough if statistic card rhythm remains visibly different from the PDF.
- Architect: user QA superseded the GothamRounded/SF-rounded imitation attempt; Pandemia now uses readability-first modern UI/system typography.
- Architect: typography must use local/offline fonts only and must not lead with SFNSRounded, SF Compact Rounded, SF Pro Rounded, Avenir, or decorative rounded fonts.
- Architect: source embedded fonts were identified as GothamRounded Book/Light/Medium/Bold plus HelveticaWorld-Regular; that evidence remains historical, but the accepted implementation is the modern UI/system stack because the source-font imitation was rejected.
- Architect: Avenir-first and SF-rounded-first stacks are rejected by the user and cannot remain the accepted primary Pandemia stack.
- Architect: future PDF-section conversions should identify embedded/source PDF fonts before choosing web typography, but must also record and follow user QA if readability supersedes source-font imitation.
- Architect: heading/body weight, letter spacing, line-height, paragraph spacing, and text block width require computed-style evidence plus fresh screenshots.
- Architect: typography matching applies to infographic cards, blue strips, gray boxes, labels, and numbers too, not only heading/body.
- Architect: the section should use one readability-first typography system across prose and infographic roles unless a documented source-faithful distinction requires otherwise.
- Architect: context labels must use consistent emphasis; do not bold only `Буэнос-Айрес` after omitting `Contexto`.
- Architect: tests must catch asymmetric context-label styling, including `::first-line`, nested-span, or equivalent city-name-only bolding.
- Architect: latest feedback allows and prefers cleaned cropped original images/icons when manual SVG redraws are poor or less source-faithful.
- Architect: cropped assets must be isolated, local, tightly scoped, and cleaned of visible Spanish text.
- Architect: Russian labels/text remain native DOM/SVG/text.
- Architect: latest user feedback rejects the clean SVG replacements because they look redrawn/different; they must be replaced by original PDF/source artwork crops or visually indistinguishable high-fidelity cleaned originals.
- Architect: newly designed generic/reconstructed SVG pictograms/icons are not acceptable when visibly different from the PDF.
- Architect: vectorization is allowed only with evidence that it is visually indistinguishable from the original artwork.
- Architect: latest user feedback rejects the current page 17 `Factores de Riesgo` / `Recomendaciones` native symbolic/card replacement; it is a blocking follow-up, not an accepted known issue.
- Architect: page 17 must preserve the original wind/tree, car, people, gray/yellow panels, blue recommendation label, border, spacing, and proportions; generic person/avatar icons and generic cards are not acceptable. The decorative recommendation clipboard/check icon is superseded and should be omitted.
- Architect: all source images, infographics, pictograms, and diagrams must be preserved 1:1 as source-derived artwork/source-faithful reconstruction. Russian text replacement must preserve source geometry and use selectable DOM/SVG text layers where needed.
- Architect: pages 18-20 work-axis/consequences diagrams inherit the same no-generic-replacement guard; generic icon/card replacements are temporary scaffolding only and cannot be accepted final.
- Architect: page 18 `Consecuencias de los Incidentes de tránsito` must preserve the original gauge/semi-circle diagram, black fatal-victims wedge/label, beige category panels, family/economy, health, institutions icons, pointer, connector lines, colors, spacing, geometry, proportions, and overall composition.
- Architect: page 19 `Ejes de trabajo` must preserve four gray circular fields and exact walking/pedestrian, megaphone, officer/police, and group/people pictograms, original icon sizes/placement, blue title style, title/circle/text relationships, two-column grid spacing, and proportions.
- Architect: recurring document style elements must have source-validated style tokens/guidelines; repeated block types use one consistent style unless source evidence records a variant.
- Architect: blue law/callout blocks must share background color, left accent stripe, padding, text alignment, font weight, line-height, width behavior, and margin cadence; accidental centered-versus-left-aligned drift is rejected.
- Architect: scale must increase; the smallest text should be comparable to existing study-material text.
- Architect: intro/body explanatory text must be approximately the same size as ordinary body text in `Материалы`, not merely above a 14px minimum.
- Architect: normal prose paragraphs must be adaptive DOM text with no manual PDF-style line breaks; fixed infographic/image labels may keep deliberate line breaks for layout.
- Architect: city statistic circle icons must remain fully visible, spatially separate from text/backgrounds, and use original motorcyclist/pedestrian/car artwork crops or high-fidelity cleaned originals.
- Architect: the `8 из 10` people-grid must accurately show 8 male pictograms and 2 female pictograms while preserving original silhouette/style; use original high-quality source pictograms/crop if possible.
- Architect: remove `Вписать` / `100%` controls and `Мировой контекст` / `Контекст города` buttons.
- Architect: Russian wording should be simpler while preserving exact meaning and all details relevant to exam tickets.
- Architect: Russian wording should read as natural Russian learning text, not formal literal translation; use common words and direct phrases understandable to younger learners where possible.
- Architect: simplification may optimize local consecutive text flow by merging adjacent paragraphs, splitting complex sentences, or combining short sentences, but it must not rearrange section/block structure, lists, diagrams, navigation, or source heading order.
- Architect: Plan shared-responsibility, Vision Zero, and safe-system paragraphs need explicit natural-Russian adaptation while preserving details such as no deaths/permanent injuries, Sweden 1997, more than three decades, and human-error consequence reduction.
- Architect: after simplification, ticket-detail retention is a blocking check against available local ticket/practice-source material; unclear ticket relevance means preserve the detail or record Architect/Analyst disposition.
- Architect: an initial post-completion visual source-fidelity checker/harness is required in this PR slice before Implementation Agent claims done, with artifact-backed pass/fail evidence rather than summary-only review.
- Architect: visible source/provenance, footnote, page marker/page number, and blue upper-left book motif are not needed for this section's ticket-solving learning goal and should be removed from the visible document.
- Architect: every issue caught during this iteration must become a reusable checklist item for future sections.
- Architect: every accepted visual issue in future PDF-section conversions must also become a reusable requirement, validation checklist item, and evidence expectation for document-wide reuse.
- Architect: the user-found circle overlap bug must be guarded by reusable overlap/bounding-box checks.
- Architect: docs update is required for the current merge request. The accumulated PDF-to-Russian interactive-document requirements and visual checker rules must be moved into durable frontend docs, not left only in feature memory.

## Reusable PDF-Section Implementation/QA Checklist

Use this checklist for this and future PDF-section-to-Russian-web conversions:

- [x] Every accepted visual issue becomes a reusable requirement, validation checklist item, and evidence expectation for future section conversions across the document.
- [x] Document navigation follows source `Índice` headings, not raw PDF page numbers.
- [x] Navigation is designed for the future full Russian interactive manual IA, with support entries, chapter/annex groups, and child entries; current Introduction pages are the first populated children.
- [x] Main app navigation exposes the interactive document as `Руководство`, replacing the visible `Руководство 4R` manual-viewer entry.
- [x] Visible navigation does not show duplicate manual destinations (`Руководство 4R` plus new interactive document).
- [x] Existing Introduction hashes deep-link into the correct `Руководство` child content and set active hierarchy state.
- [x] Each source index heading assigned to the feature becomes its own route/navigation item; multi-page headings remain one route unless the source `Índice` splits them.
- [x] Full-document navigation tree includes `Presentación`, `Glosario`, `INTRODUCCIÓN`, chapters 1-5, and annexes I-IV with source Spanish metadata, page refs, and Russian visible labels.
- [x] Unimplemented future navigation entries are pending/disabled/collapsed placeholders and do not create fake content pages.
- [x] Active group/child state, direct route/hash links, keyboard/a11y labels, current-state semantics, and mobile/narrow usability are verified.
- [x] Flat post/page-only navigation and one-off horizontal Introduction tabs/cards are rejected as final navigation.
- [x] Exact source span, source text, image/layout needs, and index label are verified from the source `Índice`, manifests, and PDF renders before implementation.
- [x] Primarily textual sections use normal responsive web prose/list/callout layout while preserving source hierarchy and order.
- [x] Sections with visual blocks use source-derived/cleaned artwork assets plus selectable/copyable DOM/SVG Russian text.
- [x] PDF fragment is mockup/reference only; no full-page PDF/page raster is rendered as runtime base.
- [x] Web section is cropped/reframed to the meaningful content region; no full PDF page canvas, page-sized white shell, or huge blank top/side/bottom whitespace.
- [x] Desktop shows readable normal-density content, not a tiny centered island.
- [x] Mobile first view starts on content; horizontal pan/scroll is limited to the fixed infographic/content block.
- [x] Normal prose roles (`heading`, `intro`, and bottom learning conclusion/body) wrap by viewport/container width and do not horizontally clip or require horizontal scrolling.
- [x] Any horizontal scroller contains only fixed infographic/image content, not normal prose.
- [x] Ordinary Russian prose and meaningful statistic labels are selectable/copyable text, not baked into images.
- [x] Required text roles allow text selection/copying; no `user-select: none`, `pointer-events: none`, or equivalent blocker.
- [x] Lower city paired rows preserve source top alignment: left pictogram block and right gray statistic panel share the same vertical start level within a small tolerance.
- [x] Playwright/bounding-box checks cover `people-grid-icon` vs `male-victims-panel`/`male-victims` and `people-pair-icon` vs `age-range-panel`/`age-range`.
- [x] Lower city paired rows preserve full source row geometry: panel top/center/bottom/height remain proportionate to the matching pictogram block; top-edge alignment alone is insufficient.
- [x] Lower city gray panels have bounded height, empty-space ratio, and bottom whitespace relative to icon group and text block.
- [x] Repeated user-reported visual regressions become stricter reusable guards and trigger grouped non-regression checks.
- [x] Lower city paired rows preserve source-like horizontal gap between pictogram block and gray statistic panel.
- [x] Lower city gray panels preserve source-like proportions and do not become oversized empty containers.
- [x] Lower city gray panel text has source-like internal top/bottom padding or vertical balance.
- [x] Embedded/source PDF fonts are identified before choosing section typography; for this section the source context is GothamRounded Book/Light/Medium/Bold plus HelveticaWorld-Regular.
- [x] If source-font imitation harms localized readability/quality, choose and document the modern UI readability stack instead of forcing a rounded/Gotham-like substitute.
- [x] Avenir-first and SFNSRounded/SF Compact Rounded/SF Pro Rounded-first stacks are rejected after the user's feedback unless a later explicit decision changes this.
- [x] Heading/body typography uses the documented modern UI readability stack.
- [x] Typography checks record computed heading and intro/body font family, weight, line-height, letter spacing, paragraph spacing, and text block width.
- [x] Heading wrap checks prove `Дорожная пандемия` is not forced into two lines at normal desktop width.
- [x] Infographic labels/numbers/cards/blue strips/gray boxes use the documented readability-first typography system, not untuned default typography.
- [x] Statistic card font rhythm is visually checked against the PDF; a passing font-stack assertion is not enough.
- [x] Upper global statistic cards preserve source-like gray-box density and avoid excessive empty area.
- [x] Airplane/stadium pictograms visually attach to the blue strip/cap geometry as in the PDF.
- [x] Icon-to-strip attachment preserves localized cap/rise geometry, with flat rectangular strip portions at left/right.
- [x] Icon/cap/strip/card top has no white seam/gap.
- [x] Paired global cards have equal panel heights and aligned bottom edges.
- [x] Global blue strip and gray panel left/right edges remain rectangular while any cap stays local.
- [x] Global gray-card empty-space ratio is bounded and text padding is source-like.
- [x] Typography system is unified across prose and infographic roles, with any source-faithful role distinction documented.
- [x] Context labels use consistent computed weight/emphasis; no city-name-only bolding or asymmetric pseudo-element/nested-span styling.
- [x] Fresh screenshots are reviewed for source-like typography rhythm.
- [x] Russian text is native DOM/SVG/text; no mask-over-Spanish-source and no overlay translation on the original page.
- [x] Visual assets use original PDF/source artwork whenever possible, preferably high-resolution local crops from the PDF or best available source render; cleanup only removes source text needed for Russian DOM/SVG text.
- [x] Source artwork is preserved 1:1 for images, infographics, pictograms, diagrams, panel shapes, borders, colors, spacing, and proportions; Russian text replacement is not a redesign license.
- [x] Latest rejected clean SVG replacements are removed/replaced before acceptance.
- [x] No generic/reconstructed SVG pictogram/icon is used when it visibly differs from the source PDF.
- [x] Any vectorized pictogram/icon is visually indistinguishable from the original and has source comparison evidence.
- [x] Page 17 `Factores de Riesgo` / `Recomendaciones` requires source-faithful wind/tree, car, people, gray/yellow panels, blue recommendation label, border, spacing, and proportions; generic cards/person icons are rejected, and the decorative clipboard/check icon is intentionally omitted.
- [x] Pages 18-20 work-axis/consequences diagrams require source-derived artwork metadata/crops and screenshot comparison when source pictograms/infographics exist; generic icon replacements are rejected as final.
- [x] Page 18 `Consecuencias de los Incidentes de tránsito` requires the source gauge/semi-circle diagram, black fatal-victims wedge/label, beige panels, family/economy, health, institutions icons, pointer, connector lines, colors, spacing, geometry, proportions, and overall composition; simplified cards/altered chart geometry are rejected.
- [x] Page 19 `Ejes de trabajo` requires four source gray circular fields and exact walking/pedestrian, megaphone, officer/police, and group/people pictograms with original sizing, placement, blue title style, text placement, grid spacing, and proportions; generic avatars/approximate symbols are rejected.
- [x] Recurring style elements require source-validated style tokens/guidelines before acceptance.
- [x] Blue law/callout blocks use consistent background color, left accent stripe, padding, text alignment, font weight, line-height, width behavior, and margin cadence unless a source-backed variant is documented.
- [x] Post-completion visual source-fidelity checker/harness runs with artifact-backed pass/fail output, not summary-only review.
- [x] Visual checker fails on lost/modified source images, generic icon replacement, lost formatting/layout/style, inconsistent style tokens, and non-scalable/duplicate navigation shell regressions.
- [x] Visible document includes only learning/ticket-relevant content; source/provenance, footnotes, page markers, and book-only motifs are omitted unless needed for solving tickets.
- [x] Russian wording is natural, simple, and learner-facing while preserving ticket-relevant numbers, statistics, details, and necessary source concepts.
- [x] Simplified wording is checked against local ticket/practice-source material; no ticket-question/answer/explanation information is removed, weakened, or changed.
- [x] Local text-flow changes are checked before/after for preserved local order and no accidental global structure change.
- [x] Smallest font is comparable to study-material text; no microtype.
- [x] Intro/body explanatory text is approximately the same size as ordinary `Материалы` body text.
- [x] Normal prose paragraphs wrap naturally by container width; no forced PDF-style line breaks inside paragraph text.
- [x] Nonessential UI controls are removed unless explicitly requested; no distracting zoom/focus/context controls.
- [x] No text overflow in any text segment.
- [x] No element overlap in desktop or mobile layouts.
- [x] Infographic/circle text does not collide with icon images.
- [x] Icons inside city statistic circles are fully visible and not covered by text or backgrounds.
- [x] City circle icons are original motorcyclist/pedestrian/car artwork crops or high-fidelity cleaned originals, not generic new icons.
- [x] Circles/indicators do not collide with below icons/rows.
- [x] `8 из 10` people-grid preserves source meaning: 8 identical male pictograms and 2 female pictograms.
- [x] `8 из 10` people-grid preserves original source silhouette/style, not only the numeric/gender semantics.
- [x] Bottom paragraph, footnote, and page marker areas do not collide. If footnote/page marker are removed, tests prove no remnants remain or collide.
- [x] Automated bounding-box/overlap checks are recorded.
- [x] Screenshot review is recorded for desktop and mobile.
- [x] User-found issues are added back into this checklist; the circle overlap bug found by the user is now a standing required check.

## Known Issues

- Latest user feedback supersedes prior acceptance evidence when page 17 risk/recommendation visuals are square-cropped, lack separated circular/lobed geometry, clip icons, or reintroduce/cut off the decorative recommendation clipboard after the omission decision; this is now a standing non-regression rule covered by the follow-up evidence below.
- Latest user feedback supersedes prior acceptance evidence when the page 18 consequences diagram is distorted, visibly dirty, contains residual source text/artifacts, or has Russian labels colliding with leftover background text; this is now a standing non-regression rule covered by the follow-up evidence below.
- Latest user feedback supersedes prior acceptance evidence when page 19 work-axis pictograms are clipped, square-cropped, partially visible, or covered inside gray circles; this is now a standing non-regression rule covered by the follow-up evidence below.
- The old exposed `Руководство 4R` tab is hidden from user-facing navigation. The legacy renderer code remains in the file for now but is no longer reachable through a visible manual destination.
- Full `pnpm run preflight` was not run in this assignment; focused Node, TypeScript, build, Playwright, and diff-check evidence is recorded below.

## Implementation Agent Feedback For Architect Disposition

- Architect disposition: Implementation Agent's page 17/page 19 symbolic-card known issue is not accepted. Page 17 risk-factor/recommendation native symbolic cards are rejected by latest user feedback and require follow-up replacement with source-faithful artwork, metadata, tests, and screenshots.
- Architect disposition: pages 18-20 work-axis/consequences visual blocks must be reviewed under the same source-artwork rule; any generic icon/card replacement is temporary scaffolding only and cannot be accepted final when the source has pictograms/infographics.
- Architect disposition: page 18 consequences and page 19 work-axis visuals are explicit implementation follow-ups, not optional polish; generic replacements or missing source components block acceptance.
- Architect disposition: the latest page 18 consequences screenshot is a blocker. Source-derived fragments do not satisfy acceptance when the complete diagram is distorted, unrecognizable, overlapping, fragmented, or non-source-like; Implementation must rebuild page 18 and update the checker to fail this exact class.
- Architect disposition: the latest page 17 risk/recommendation screenshots are blockers. Source-derived component crops do not satisfy acceptance when risk cards lack the source circular/lobed left edge, use square crop fragments, clip icons, or keep/reintroduce the decorative clipboard/check icon after the omission decision.
- Architect disposition: the latest page 19 axis screenshots are blockers. Source-derived pictogram crops do not satisfy acceptance when axis icons are cropped, partially visible, square-boxed, clipped by parent overflow, or covered inside gray circles.
- Architect disposition: recurring-style drift in blue law/callout blocks is an implementation follow-up; style-token guidance and validation are required before acceptance.
- Architect disposition: flat or Introduction-only navigation is not accepted final architecture. Implementation must provide the scalable full-manual navigation shell/data model with current Introduction routes discoverable inside it and future entries pending/disabled/collapsed.
- Architect disposition: exposing the new interactive document outside the main `Руководство` destination, or keeping visible `Руководство 4R` beside it as a duplicate manual destination, is not accepted final architecture. Implementation must replace the user-facing guide entry and preserve existing Introduction hashes into `Руководство` child content.
- Architect disposition: formal literal Russian translation is not accepted where natural Russian can preserve the same meaning. Plan shared-responsibility, Vision Zero, and safe-system paragraphs require natural-Russian adaptation plus ticket-detail retention evidence.
- Architect disposition: local text-flow optimization is allowed for clarity, but only with before/after evidence and without global structure changes.
- Architect disposition: visual checker/harness is now a required implementation follow-up for this PR slice. Completion is blocked without source screenshots, Russian screenshots, component/bounding-box metadata, asset/source-region checks, style-token checks, navigation checks, and pass/fail output that fails the user-reported regression classes.
- Architect disposition: visual checker/harness completion is also blocked unless it fails distorted source-piece assemblies, including page 18 floating fragments, broken gauge/arc seams, misplaced black wedge, label/connector misalignment, and category text collisions.
- Architect disposition: visual checker/harness completion is also blocked unless it fails clipping/crop/composition regressions, including page 17 flat risk rectangles with square icon crops, reintroduced/clipped page 17 recommendation clipboard fragments, page 19 cropped axis icon quadrants/crop-box corners, parent overflow cuts, and icon/background coverage.

## Implementation Evidence - Latest Assignment

- Implementation Agent update completed in worktree `/Users/chap/devel/cabadrive-worktrees/029-pandemia-vial-section` on branch `codex/029-pandemia-vial-section`; no stage, commit, push, merge, rebase, reset, or clean was performed.
- Runtime navigation now exposes a single user-facing guide destination labeled `Руководство`; the visible legacy `Руководство 4R` destination and separate `Введение` prototype tab are removed. Existing hashes `#pandemia-vial`, `#intro-enfoque-etico`, `#intro-accidente-incidente`, and `#intro-plan-seguridad-vial` deep-link to active children inside the `Руководство` hierarchy.
- `src/data/pandemiaVialSection.ts` now includes `manualGuideNavigation` with support entries, `INTRODUCCIÓN`, chapters 1-5, annexes I-IV, Russian visible labels, Spanish source labels/page refs as metadata, active Introduction children, and pending disabled placeholders for unimplemented future entries.
- `src/data/pandemiaVialSection.ts` now includes `introductionDocumentStyleGuide` tokens/rules for typography, callout color/accent/padding/alignment, border/radius, and recurring source-artwork rules. `intro-enfoque-etico` law/quote callouts share one left-aligned blue callout style.
- Page 17 risk/recommendation visuals now use source-derived component crops:
  - `content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/intro-incident/icon-risk-ambiental-source.png`
  - `content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/intro-incident/icon-risk-vehicular-source.png`
  - `content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/intro-incident/icon-risk-humano-source.png`
  - Superseded: `content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/intro-incident/icon-recommendation-clipboard-source.png` was generated for an earlier preservation attempt, but the latest user decision removes the decorative icon from the web rendering.
- Page 17 risk-card runtime geometry now renders source-like long rounded gray/yellow panels with integrated circular/lobed left edges, transparent-background source pictograms centered inside each lobe, and visible vertical gaps between the three rows/lobes. Superseded: the previously preserved recommendation clipboard/check icon should now be removed.
- Page 18 consequences visuals now use a text-cleaned complete original page 18 PDF crop at `content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/intro-road-safety-plan/page-018/diagram-consequences-clean-source.png`; only Spanish/center text zones are removed, while the original arcs, pointer, sectors, label boxes, connector lines, icons, proportions, and composition remain from the source image. Russian labels are selectable DOM overlays in source-like positions.
- Page 19 work-axis visuals now use padded transparent 96x96 source pictogram assets for walking/pedestrian, megaphone, officer/police, and group/people pictograms under `content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/intro-road-safety-plan/page-019/`, with gray circular fields, desktop two-column title/circle/text geometry, responsive stacked geometry, and natural asset alpha padding so the full pictograms remain visible.
- Latest Architect follow-up supersedes the earlier page 17/page 18/page 19 visual acceptance value of source-derived crop presence alone. The current checker now requires visible lobe/circle/gauge composition, no clipping, no square crop boxes, `object-fit: contain`, parent overflow safety, and desktop/mobile screenshot evidence.
- Plan opening prose was reviewed and kept as shorter natural Russian while preserving shared responsibility, Buenos Aires best-performing-cities/countries principles, Vision Zero, 1997 Sweden, more-than-three-decades reference status, permanent injuries, human-error containment/reduction, and safe-system design.
- Visual checker/harness evidence is implemented through:
  - `tests/content-pandemia-vial-section.test.mjs`: source asset existence/source-region/no-visible-Spanish metadata checks, page 18 original-source-crop/no-reconstruction metadata checks, page 17 risk-list gap CSS checks, full-document navigation checks, style-token/callout drift checks, and generic replacement rejection checks.
  - `tests/e2e/app.spec.ts`: desktop/mobile screenshots, active hierarchy/hash checks, source-artwork rendered-asset checks, component bounding boxes, page 17 risk-card/card-lobe minimum gap checks, page 18 original-source-crop comparison outside text masks, page 18 text-mask cleanliness checks, page 19 natural alpha-padding checks, responsive/no-overflow checks, selectable-text checks, and existing Pandemia visual non-regression checks.
- Verification commands/results:
  - `node --test tests/content-pandemia-vial-section.test.mjs` - passed, 14/14 tests.
  - `pnpm exec tsc --noEmit` - passed.
  - `pnpm run build` - passed; content validation, asset sync, Vite build, and service worker generation succeeded.
  - `pnpm exec playwright test tests/e2e/app.spec.ts -g "Pandemia vial prototype|Introduction index routes"` - passed, 4/4 tests across chromium and mobile.
  - `pnpm run test` - passed, 309/309 Node tests.
  - `git diff --check` - passed with no whitespace errors.
- Screenshot/checker artifacts from the final focused Playwright run:
  - `test-results/app-Pandemia-vial-prototyp-41f38-an-PDF-faithful-composition-chromium/pandemia-vial-chromium.png`
  - `test-results/app-Pandemia-vial-prototyp-41f38-an-PDF-faithful-composition-chromium/pandemia-vial-narrow.png`
  - `test-results/app-Pandemia-vial-prototyp-41f38-an-PDF-faithful-composition-mobile/pandemia-vial-mobile.png`
  - `test-results/app-Introduction-index-rou-59e0b-tive-Russian-document-pages-chromium/intro-route-intro-incident-chromium.png`
  - `test-results/app-Introduction-index-rou-59e0b-tive-Russian-document-pages-chromium/intro-route-intro-incident-narrow.png`
  - `test-results/app-Introduction-index-rou-59e0b-tive-Russian-document-pages-chromium/intro-route-intro-road-safety-plan-chromium.png`
  - `test-results/app-Introduction-index-rou-59e0b-tive-Russian-document-pages-chromium/intro-route-intro-road-safety-plan-narrow.png`
  - `test-results/app-Introduction-index-rou-59e0b-tive-Russian-document-pages-mobile/intro-route-intro-incident-mobile.png`
  - `test-results/app-Introduction-index-rou-59e0b-tive-Russian-document-pages-mobile/intro-route-intro-road-safety-plan-mobile.png`

## Implementation Agent Follow-up - Page 17/18 Visual Blockers

- [x] Latest user feedback supersedes the native reconstruction approach for page 18. Page 18 `Последствия дорожных инцидентов` now uses the complete original PDF diagram crop as the visual layer, with only Spanish/center text zones cleaned and with no CSS/SVG/native redrawing of arcs, pointer, sectors, label boxes, connector lines, icons, or geometry.
- [x] Kept page 18 Russian labels as runtime DOM overlays in source-like positions over a text-free background, so the rendered diagram no longer reads as Russian labels pasted over dirty source leftovers.
- [x] Added page 18 checker coverage that rejects reconstruction and dirty background remnants: content metadata now requires a text-cleaned complete original PDF crop with no native/CSS/SVG reconstruction, and Playwright compares all non-text-masked pixels against `page-018.jpg` while checking the cleaned text masks for residual Spanish/text ink.
- [x] Added page 17 row separation: `.intro-risk-list` uses a fixed vertical gap, and the three long panels/circular lobes are visually separated instead of touching.
- [x] Added page 17 checker coverage that fails touching risk rows/lobes: content tests assert the CSS gap, and Playwright asserts consecutive card and lobe bounding boxes have at least 10px of vertical separation.
- [x] Replaced page 19 tight icon PNGs with padded transparent 96x96 source pictogram assets. Playwright now fails if the natural alpha bounds are tight-cropped or touch the asset edges, verifies the PNG is larger than the prior tight JPG crop, and still verifies each rendered icon is fully inside the gray circle with padding.
- [x] Latest follow-up screenshots reviewed:
  - `test-results/app-Introduction-index-rou-59e0b-tive-Russian-document-pages-chromium/intro-route-intro-incident-chromium.png`
  - `test-results/app-Introduction-index-rou-59e0b-tive-Russian-document-pages-mobile/intro-route-intro-incident-mobile.png`
  - `test-results/app-Introduction-index-rou-59e0b-tive-Russian-document-pages-chromium/intro-route-intro-road-safety-plan-chromium.png`
  - `test-results/app-Introduction-index-rou-59e0b-tive-Russian-document-pages-mobile/intro-route-intro-road-safety-plan-mobile.png`
- [x] Latest follow-up verification passed:
  - `node --test tests/content-pandemia-vial-section.test.mjs` - passed, 14/14 tests.
  - `pnpm exec tsc --noEmit` - passed.
  - `pnpm run build` - passed; content validation, asset sync, Vite build, and service worker generation succeeded.
  - `pnpm exec playwright test tests/e2e/app.spec.ts -g "Pandemia vial prototype|Introduction index routes"` - passed, 4/4 tests across chromium and mobile.

## Current Architect Feedback - Latest User Rejection

This feedback supersedes the latest Implementation Agent evidence above. The user reviewed the result and rejected page 18 as still visually poor and page 19 as still clipped.

- [x] Page 18 remains blocked unless the final non-text visual layer is the complete original PDF infographic crop with only Spanish/source text removed. Resolved in this follow-up with exact source crop `left=280 top=560 right=900 bottom=820` (`620x260`) from `page-018.jpg`; no CSS/SVG/native redraw, partial reconstruction, component reassembly, or redrawn arcs/sectors/pointer/black wedge/label boxes/connector lines/pictograms are used.
- [x] Page 18 checker must fail the current rejected class: a diagram that is visually different from the original source crop, has altered geometry/proportions, missing/cropped source components, reconstructed labels/boxes/connector lines/arcs/pointer/sectors/icons, or visible Spanish/source text remnants. Content tests now require `sourceRegion { x: 280, y: 560, width: 620, height: 260 }`, intrinsic `620x260`, and actual PNG IHDR `620x260`, while Playwright verifies browser natural size and source-pixel comparison outside text masks.
- [x] Page 19 remains blocked unless walking/pedestrian, megaphone, officer/police, and group/people use complete source PDF pictogram crops with transparent/source padding; no natural pictogram content may touch crop bounds or look cut inside the gray circle. Current 96x96 transparent PNGs remain in use and Playwright verifies natural alpha padding plus rendered containment inside gray circles.
- [x] Page 19 checker must fail the current rejected class: clipped/tight pictogram crops, crop-box corners visible inside circles, content cut off at natural asset bounds, or generic/reconstructed pictograms replacing source artwork. Playwright checks natural PNG dimensions are larger than the prior tight JPG crops, alpha margins are padded, `object-fit: contain` is used, and circle overflow does not clip.
- [x] Fresh source-vs-Russian screenshots and checker output must be recorded after these fixes before the page 18/page 19 visual blockers can be marked resolved again. Latest focused screenshots are under the `test-results/app-Introduction-index-rou-59e0b-tive-Russian-document-pages-*` directories listed below.

## Current Architect Feedback - Page 18 Overlay Geometry Rejection

This feedback supersedes the page 18 follow-up evidence below until the DOM overlay and label-transfer checks pass.

- [x] Reject the visible protruding rectangle/background under center-circle text `ДОРОЖНЫЙ ИНЦИДЕНТ`; cleanup/backing must not extend outside the circular source field or alter the ring, pointer, center circle, or connector geometry.
- [x] Reject vertically off-center category label text. The checker must validate vertical centering inside source label boxes, with `ИНСТИТУЦИИ` recorded as the concrete regression example.
- [x] Reject the `ЗДОРОВЬЕ` label box when corners/radii, height, size, or source-box proportions differ from the original. Russian fitting may adjust text/wrapper width only, not source label height or shape.
- [x] Reject any DOM overlay/background that visually changes page 18 source label shape, ring, center circle, connector lines, or pointer.
- [x] Completion requires updated checker evidence: label text vertical-centering bounding boxes, absence of extra visible DOM/background rectangles outside source geometry, source-faithful label-box heights/corners, and center-circle text containment inside the circular field/ring.

## Current Architect Feedback - Page 17/Page 19 Pictogram And Grid Rejection

This feedback supersedes page 17/page 19 visual evidence until the source-pictogram framing and grid checks pass.

- [x] Superseded: no longer reject page 17 `Рекомендации` for missing clipboard/check icon; reject only if a decorative clipboard fragment is reintroduced/clipped or the callout label/border becomes misaligned, clipped, or unfaithful.
- [x] Reject page 17 `Факторы риска` if pictogram alpha centers differ from circular-lobe centers beyond tolerance, alpha size is not source-like, car diagonal support or people lower silhouettes are cut, or image-element boxes pass while visible alpha framing is off.
- [x] Reject page 19 `Направления работы` if desktop circles do not form a stable two-by-two grid with equal diameters, aligned row center-y positions, aligned column center-x positions, and consistent gaps independent from title/body wrapping.
- [x] Reject page 19 desktop masonry or uneven-circle layouts caused by title wrapping; mobile/stacked layouts may differ only when complete icons and local alignment are preserved.
- [x] Completion requires checker evidence for recommendation callout alignment/no reintroduced clipboard fragment, lobe alpha-center/scale, page 19 circle center/diameter/gap measurements, and screenshots for the reported no-go examples.
- [x] Keep carrying forward page 18 overlay geometry checks while fixing these items: no `ДОРОЖНЫЙ ИНЦИДЕНТ` protrusion, vertical label centering, and source-faithful `ЗДОРОВЬЕ` label geometry.

## Implementation Agent Follow-up - Page 17/18/19 Transfer Alignment

- [x] Page 18 center text overlay now has transparent DOM text only: no background, background image, border, box shadow, or pseudo-element backing rectangle on `.intro-consequence-center` or its text spans.
- [x] Page 18 category labels now use centered flex text, and Playwright compares their vertical centers against the source label boxes, including the concrete `ИНСТИТУЦИИ` regression. The `ЗДОРОВЬЕ` text wrapper is checked against the source-height tolerance without creating a new DOM label geometry.
- [x] Superseded: page 17 recommendation clipboard was recropped in an earlier pass, but the latest user decision removes the decorative clipboard/check icon entirely because preserving it degraded layout.
- [x] Page 17 risk-lobe checker now uses rendered alpha bounds, not only image element boxes, and validates alpha-center alignment, fill ratio, and containment inside each circular lobe so the car support and people lower silhouettes are not silently cropped.
- [x] Page 19 work-axis cards now use fixed internal grid rows so title wrapping cannot move the circles. Desktop checks require equal circle diameter, aligned top-row/bottom-row center-y values, aligned left/right column center-x values, and consistent row/column geometry.
- [x] Fresh Browser preview audit at `http://127.0.0.1:4789/#intro-plan-seguridad-vial` confirmed transparent center background and equal `82x82` axis circles with row/column centers aligned. Preview server was stopped after inspection.
- [x] Fresh screenshot/checker artifacts:
  - `test-results/app-Introduction-index-rou-59e0b-tive-Russian-document-pages-chromium/intro-route-intro-incident-chromium.png`
  - `test-results/app-Introduction-index-rou-59e0b-tive-Russian-document-pages-mobile/intro-route-intro-incident-mobile.png`
  - `test-results/app-Introduction-index-rou-59e0b-tive-Russian-document-pages-chromium/intro-route-intro-road-safety-plan-chromium.png`
  - `test-results/app-Introduction-index-rou-59e0b-tive-Russian-document-pages-mobile/intro-route-intro-road-safety-plan-mobile.png`
- [x] Fresh verification passed:
  - `node --test tests/content-pandemia-vial-section.test.mjs` - passed, 14/14 tests.
  - `pnpm exec tsc --noEmit` - passed.
  - `pnpm run build` - passed; content validation, asset sync, Vite build, and service worker generation succeeded.
  - `pnpm exec playwright test tests/e2e/app.spec.ts -g "Pandemia vial prototype|Introduction index routes"` - passed, 4/4 tests across chromium and mobile.
  - `git diff --check` - passed with no whitespace errors.

## Implementation Agent Follow-up - Exact Page 18 Source Crop Validation

- [x] Regenerated `content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/intro-road-safety-plan/page-018/diagram-consequences-clean-source.png` from exact source crop `left=280 top=560 right=900 bottom=820` (`620x260`), superseding the rejected `500x350` and earlier `525x285` partial assets.
- [x] Re-cleaned center text with small inner-circle masks only; the dark ring, pointer, sectors, icons, black wedge, connector lines, and label boxes remain source pixels.
- [x] Updated runtime metadata, CSS aspect ratio, Russian overlay positions, and content/e2e checks to require `620x260` and reject stale `500x350`/`525x285` page 18 metadata or assets.
- [x] Verification passed:
  - `node --test tests/content-pandemia-vial-section.test.mjs` - passed, 14/14 tests.
  - `pnpm exec playwright test tests/e2e/app.spec.ts -g "Pandemia vial prototype|Introduction index routes"` - passed, 4/4 tests across chromium and mobile after `pnpm run build` refreshed `dist/` assets.
  - `pnpm exec tsc --noEmit` - passed.

## Implementation Agent Follow-up - Page 17 Risk Circle/Rectangle Seam

- [x] Latest user feedback supersedes prior page 17 risk-card acceptance where the right rectangles were visually taller than the left circles and exposed square seam corners.
- [x] Style-guide checklist for every `circle + rectangle` risk-row pattern: the right rectangle must be shorter than the left circle diameter, its top and bottom must stay inside the circle's vertical extent, the circle must overlap the rectangle seam enough to hide square corners/steps, row gaps must remain visible, and source pictograms must not be clipped, redrawn, or tight-cropped.
- [x] Runtime geometry now draws the right gray/yellow risk panel as a lower pseudo-element behind the circular lobe; the card container itself is transparent, so no full-height rectangle can protrude past the circle.
- [x] Risk pictogram PNGs now keep the original pictogram pixels on transparent `78x78` padded canvases, rejecting stale tight natural crops while preserving the source artwork and DOM Russian text strategy.
- [x] Checker coverage now fails regressions where the rectangle height is not lower than the circle, top/bottom rectangle edges protrude outside the circle, the seam is not overlapped by the circle, source pictograms touch natural PNG bounds, or rendered pictograms are clipped inside the lobe.
- [x] Fresh verification passed after this follow-up:
  - `node --test tests/content-pandemia-vial-section.test.mjs` - passed, 14/14 tests.
  - `pnpm exec tsc --noEmit` - passed.
  - `pnpm run build` - passed; content validation, asset sync, Vite build, and service worker generation succeeded.
  - `pnpm exec playwright test tests/e2e/app.spec.ts -g "Pandemia vial prototype|Introduction index routes"` - passed, 4/4 tests across chromium and mobile.
  - `git diff --check` - passed with no whitespace errors.
- [x] Fresh screenshot/checker artifacts for the risk-card seam validation are under:
  - `test-results/app-Introduction-index-rou-59e0b-tive-Russian-document-pages-chromium/intro-route-intro-incident-chromium.png`
  - `test-results/app-Introduction-index-rou-59e0b-tive-Russian-document-pages-chromium/intro-route-intro-incident-narrow.png`
  - `test-results/app-Introduction-index-rou-59e0b-tive-Russian-document-pages-mobile/intro-route-intro-incident-mobile.png`

## Implementation Agent Follow-up - High-DPI Source Cleanup and Page 17 Scale

- [x] Latest user feedback supersedes prior page 18 acceptance where the `620x260` runtime crop was visibly pixelated or cleaned with rectangular/white patch artifacts.
- [x] Page 18 checklist: source asset must be generated from the original PDF/high-DPI render; browser-rendered size must not exceed natural pixels; glyph-level text removal only; rectangular cover-up masks are forbidden even when color-matched to the background; text cleanup is per-glyph/local-background/inpaint, not rectangular cover-up or white box masking; cleanup masks must preserve non-text source pixels and geometry, and non-glyph pixels inside text zones must remain source pixels.
- [x] Page 18 artifact examples now explicitly blocked: no white rectangular mask remnants at category label corners (`ИНСТИТУЦИИ`, `ЗДОРОВЬЕ`, `СЕМЬЯ И ЭКОНОМИКА`); no masks cutting connector lines; no white marks on the black `ПОГИБШИЕ`/fatal-victims label or wedge; no damage to arcs, sectors, icons, pointer, center ring, label corners, or connector geometry.
- [x] Rejected the intermediate high-DPI `3720x1560` page 18 PNG that still used white/color-matched rectangular patches, then regenerated `page-018/diagram-consequences-clean-source.png` from `/Users/chap/Downloads/MANUAL_Vehiculo_4Ruedas_2023 SA.pdf` with PDF render scale 6 into high-DPI intrinsic `3720x1560`, preserving the approved `620x260` composition frame while avoiding browser upscaling.
- [x] Page 17 `Факторы риска` checklist extended: risk rows must use larger source-like circles/panels, rectangle height remains smaller than circle diameter, circle overlaps the seam, row text has top/bottom panel padding, icons are centered within the circle, visible alpha bounds occupy a source-like fraction of the circle, and source pictograms are not clipped or browser-upscaled.
- [x] Regenerated page 17 risk pictograms as transparent `512x512` high-DPI source-derived cutouts. Superseded: the `Рекомендации` clipboard high-DPI cutout was an earlier preservation attempt and should no longer be required or rendered.
- [x] Regenerated page 19 work-axis pictograms as transparent `192x192` high-DPI PDF source cutouts; stale `96x96` variants are rejected by content and e2e checks.
- [x] Checker coverage now fails browser upscaling above natural source pixels, low-res/pixelated source artwork, page18 white-box cleanup artifacts, stale rectangular/color-matched block patches in the institutions/arc/center regions, page17 small/compressed risk rows, off-center/too-small risk pictograms, missing row padding, reintroduced/clipped recommendation clipboard fragments, distorted recommendation callout alignment, and page19 low-res axis pictograms.
- [x] Fresh verification after this follow-up was superseded and completed by the Page 17/18/19 transfer-alignment pass:
  - `node --test tests/content-pandemia-vial-section.test.mjs` - passed, 14/14 tests.
  - `pnpm exec tsc --noEmit` - passed.
  - `pnpm run build` - passed.
  - `pnpm exec playwright test tests/e2e/app.spec.ts -g "Pandemia vial prototype|Introduction index routes"` - passed, 4/4 tests across chromium and mobile.
  - `git diff --check` - passed with no whitespace errors.

## Implementation Agent Follow-up - Plan Opening Wording

- [x] Replaced the stale three formal/literal opening Plan paragraphs in `src/data/pandemiaVialSection.ts` with two adjacent natural Russian paragraphs before `Основные принципы`.
- [x] Preserved all ticket-critical details: worldwide shared responsibility, Buenos Aires using principles from best-performing cities/countries, Vision Zero ethical principle, no deaths or permanent injuries in road incidents, Sweden 1997, Sweden as reference for more than three decades, and safe-system design that contains/reduces human-error consequences.
- [x] Added focused regression coverage in `tests/content-pandemia-vial-section.test.mjs` that rejects the old three exact paragraphs, checks the required details remain present, and documents the local simplification without locking the new prose too tightly.
- [x] Follow-up verification passed:
  - `node --test tests/content-pandemia-vial-section.test.mjs` - passed, 14/14 tests.
  - `pnpm exec tsc --noEmit` - passed.
  - `pnpm run build` - passed; content validation, asset sync, Vite build, and service worker generation succeeded.
  - `git diff --check` - passed with no whitespace errors.

## Implementation Agent Follow-up - Page 18 Fatalities Label Centering

- [x] Adjusted only the page 18 dark `ПОГИБШИЕ` category label offset in `.intro-consequence-card.dark` so the selectable Russian label centers vertically inside the original black source label box. The complete cleaned source crop, source artwork, diagram geometry, and e2e tolerance were not changed.
- [x] Verification passed after rebuilding `dist/` for `vite preview`:
  - `pnpm run build` - passed; content validation, asset sync, Vite build, and service worker generation succeeded.
  - `pnpm exec playwright test tests/e2e/app.spec.ts -g "Introduction index routes" --project=chromium` - passed, 1/1 test.
  - `pnpm exec playwright test tests/e2e/app.spec.ts -g "Pandemia vial prototype|Introduction index routes"` - passed, 4/4 tests across chromium and mobile.
  - `node --test tests/content-pandemia-vial-section.test.mjs` - passed, 14/14 tests.
  - `pnpm exec tsc --noEmit` - passed.
  - `git diff --check` - passed with no whitespace errors.

## Current Architect Feedback - Page 17 Clipboard Omission And Page 18 Label Blockers

This feedback supersedes the immediately prior page 17 clipboard-preservation evidence and the prior page 18 label-centering acceptance evidence until updated implementation and checker evidence pass. Do not delete the earlier clipboard-preservation history; keep it as superseded context.

- [x] Page 17 `Рекомендации`: remove the decorative clipboard/notebook/check pictogram entirely from the web version. It is book-layout decoration, not needed for ticket meaning, and repeated source-crop preservation attempts degraded layout/readability.
- [x] Page 17 recommendation checker must not require clipboard/notebook/check presence. It must fail only if the callout label/border becomes misaligned, clipped, visually unfaithful, or if a clipped/reintroduced clipboard/notebook/check fragment remains visible.
- [x] Page 18 `ИНСТИТУЦИИ`: reject visual top- or bottom-pinning; the Russian label must be vertically centered inside the original source label box.
- [x] Page 18 `ЗДОРОВЬЕ`: reject text overflow beyond the light-brown backing, backing that is too small for the label, or mismatched/broken label-box corners. Russian fitting may widen the label/text wrapper only; source height, corner radius/shape, vertical centering, and connector relationships remain fixed.
- [x] Page 18 `ПОГИБШИЕ`: reject typography that visibly differs from other category labels. Category-label font size/style must be consistent across page 18 while staying inside the black source box.
- [x] Page 18 center `ДОРОЖНЫЙ ИНЦИДЕНТ`: reject any rectangular DOM background, opaque cleanup patch, mask, or backing artifact under the center text that covers the circle/ring. Center text must be transparent text only over the cleaned source circle.
- [x] Page 18 Russian label boxes may widen only if source height, corner shape/radius, vertical centering, and connector relationships remain source-like.
- [x] Visual checker must reject label backing shorter than Russian text, mismatched/broken corners, top/bottom-pinned label text, inconsistent page 18 category-label typography, and any opaque rectangle in the center circle.

## Implementation Agent Follow-up - Clipboard Omission And Page 18 Label Cleanup

- [x] Removed the page 17 decorative recommendation clipboard/notebook/check pictogram from runtime data and UI:
  - deleted `recommendationIconAssetId` from the `risk-factors` data type and `intro-incident` block in `src/data/pandemiaVialSection.ts`;
  - removed the `SourceArtworkImage` render from `.intro-recommendation` in `src/App.tsx`;
  - removed `.intro-recommendation-icon` styling and realigned the blue `Рекомендации` tab in `src/styles.css`.
- [x] Updated checker expectations so the page 17 recommendation callout requires exactly three source artwork assets for risk pictograms, explicitly rejects `recommendation-clipboard` / `.intro-recommendation-icon`, and validates the remaining blue tab/border alignment without an icon.
- [x] Updated page 18 category-label styling so `ИНСТИТУЦИИ`, `ЗДОРОВЬЕ`, and `ПОГИБШИЕ` share the same font-size, weight, line-height, and uppercase treatment while preserving per-source label height. `ПОГИБШИЕ` no longer has a separate tiny font-size.
- [x] Updated page 18 checker coverage to measure visible text ink center against source label-box center, verify Russian text width fits the source label backing, compare category typography across all labels, and keep the center label free of DOM backgrounds, borders, shadows, and pseudo-element backing.
- [x] Softened the page 18 cleaned source crop center-circle cleanup in `content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/intro-road-safety-plan/page-018/diagram-consequences-clean-source.png` so the center ring remains visible and no rectangular patch appears behind `ДОРОЖНЫЙ ИНЦИДЕНТ`.
- [x] Fresh screenshot/checker artifacts after this follow-up:
  - `test-results/app-Introduction-index-rou-59e0b-tive-Russian-document-pages-chromium/intro-route-intro-incident-chromium.png`
  - `test-results/app-Introduction-index-rou-59e0b-tive-Russian-document-pages-mobile/intro-route-intro-incident-mobile.png`
  - `test-results/app-Introduction-index-rou-59e0b-tive-Russian-document-pages-chromium/intro-route-intro-road-safety-plan-chromium.png`
  - `test-results/app-Introduction-index-rou-59e0b-tive-Russian-document-pages-mobile/intro-route-intro-road-safety-plan-mobile.png`
- [x] Verification passed for this follow-up:
  - `node --test tests/content-pandemia-vial-section.test.mjs` - passed, 14/14 tests.
  - `pnpm exec tsc --noEmit` - passed.
  - `pnpm run build` - passed; content validation, asset sync, Vite build, and service worker generation succeeded.
  - `pnpm exec playwright test tests/e2e/app.spec.ts -g "Pandemia vial prototype|Introduction index routes"` - passed, 4/4 tests across chromium and mobile.
- [x] Implementation Agent feedback for Architect disposition: none. The work stayed inside the latest assigned feedback and did not require changes to `spec.md` or `plan.md`.

## Implementation Agent Follow-up - Page 18 Native Category Label Backings

- [x] Latest accepted rule supersedes the prior transparent `h4` overlay requirement for page 18 category labels. CSS/native label backings are allowed for Russian category labels when they preserve source-like height, rounded corners, source colors, vertical centering, typography, and only widen as needed for Russian text.
- [x] Updated only the page 18 consequence category label boxes, keeping the center `ДОРОЖНЫЙ ИНЦИДЕНТ` patch untouched and preserving the page 17 recommendation-icon omission.
- [x] Added source-like beige/black rounded native backings for the page 18 category headings, with source-height scaling, source-width minimums, Russian-text width fitting, and a small optical vertical-centering adjustment for the label text.
- [x] Updated static and Playwright checks to reject the old transparent-label expectation and instead validate backing color, rounded corners, width >= text plus padding, source-height preservation, text optical vertical centering, and consistent category-label typography.
- [x] Verification passed for this follow-up:
  - `node --test tests/content-pandemia-vial-section.test.mjs` - passed, 14/14 tests.
  - `pnpm exec tsc --noEmit` - passed.
  - `pnpm run build` - passed; content validation, asset sync, Vite build, and service worker generation succeeded.
  - `pnpm exec playwright test tests/e2e/app.spec.ts -g "Introduction index routes" --project=chromium` - passed, 1/1 test.
  - `git diff --check` - passed with no whitespace errors.
  - In-app browser smoke check at `http://127.0.0.1:5178/?codex-label-check=2#intro-plan-seguridad-vial` confirmed beige `rgb(181, 172, 162)` label backings for `ИНСТИТУЦИИ`/`ЗДОРОВЬЕ`, black `rgb(0, 0, 0)` backing for `ПОГИБШИЕ`, shared `12.48px`/`800` category typography, rounded `6.12903px` corners, and source-height label boxes.

## Current Architect Feedback - Page 18 Label Artifact Regression

This feedback supersedes the two prior page 18 acceptance blocks above (`Clipboard Omission And Page 18 Label Cleanup` and `Page 18 Native Category Label Backings`) until a fresh implementation and browser visual review pass. The earlier `[x]` entries remain historical evidence only and must not be used as current acceptance for page 18 label cleanup.

- [x] Treat the user-marked preview at `http://127.0.0.1:4187/?preview=page18-fixes-1779996165464#intro-plan-seguridad-vial` as rejected. It has more visible artifacts around label corners, connector intersections, and the center ring/circle than the previous accepted intent.
- [x] Remove visible patch/seam/tab artifacts around `СЕМЬЯ И ЭКОНОМИКА`, `ЗДОРОВЬЕ`, `ИНСТИТУЦИИ`, connector lines, label-box corners, and the center ring/circle. Any hard-edged cleanup patch or color-matched plate in these regions fails.
- [x] Do not clean or repair page 18 by covering source artwork with broad rectangles, square masks, partial opaque label plates, or block backgrounds. Spanish/source letters must be removed at local source-text regions only, with no added DOM label backgrounds.
- [x] Re-center `ИНСТИТУЦИИ` and `ПОГИБШИЕ` vertically by comparing rendered text ink against the visible source label backing/pill, not against a CSS wrapper box. Both labels are named regression fixtures for bottom-pinned text.
- [x] Fix `ЗДОРОВЬЕ` as one coherent source-like label backing: enough horizontal padding for the Russian text, consistent corner radius/shape, no exposed tabs/steps, no mismatched left/right corners, and connector relationships preserved.
- [x] Keep `ПОГИБШИЕ` in the same category-label typographic system as the other page 18 labels: visual size, weight, line-height, optical centering, and label role must be consistent while the black source label remains recognizable.
- [x] Remove any center `ДОРОЖНЫЙ ИНЦИДЕНТ` rectangular patch or hard-edged cleanup artifact that covers the ring, pointer, circular field, or source background. Transparent text over a clean source circle is required.
- [x] Update the visual checker so artifact classes marked by the user fail even when color, width, border radius, or DOM bounding-box assertions pass. The checker must include screenshot-derived or image-comparison evidence for label-corner artifacts, connector-line artifacts, and ring/circle artifacts.
- [x] Do not mark this page 18 label cleanup complete until a fresh browser screenshot of the current preview is compared with the original/source crop and explicit visual notes confirm all user-marked artifact classes are absent.

## Implementation Evidence - Current Page 18 Label Artifact Regression

- Implementation Agent follow-up completed in assigned worktree `/Users/chap/devel/cabadrive-worktrees/029-pandemia-vial-section` on branch `codex/029-pandemia-vial-section`; no stage, commit, push, merge, rebase, reset, or cleanup was performed.
- Preserved the useful partial fix: page 18 category `h4` labels and center `ДОРОЖНЫЙ ИНЦИДЕНТ` are transparent DOM text only, with no background, border, box shadow, or pseudo-element backing. Source-shaped label backings remain in `diagram-consequences-clean-source.png`, not as DOM/CSS plates.
- Updated `.intro-consequence-card h4` to support optical vertical offsets without drawing backgrounds. `ИНСТИТУЦИИ` uses `--label-optical-y: calc(-1.2 / 620 * 100cqw)` and `ПОГИБШИЕ` uses `--label-optical-y: calc(-0.9 / 620 * 100cqw)`.
- Re-cleaned the page 18 source crop center using a high-DPI Swift/CoreGraphics circular local fill inside the original center circle, preserving the dark ring/pointer and avoiding a rectangular DOM or bitmap backing under the Russian center text.
- Updated cleanup metadata in `src/data/pandemiaVialSection.ts` so it no longer falsely claims native/CSS reconstruction or pure per-glyph cleanup where the asset uses source-shaped text-free label backings and circular center cleanup.
- Updated `tests/content-pandemia-vial-section.test.mjs` to require transparent/no-backing DOM label layers and truthful cleanup metadata. Updated `tests/e2e/app.spec.ts` to check h4 transparent background/no border/no shadow/no pseudo backing, named `ИНСТИТУЦИИ` and `ПОГИБШИЕ` text-ink vertical centering, source-label geometry, and center seam/patch artifact zones.
- Fresh preview URL: `http://127.0.0.1:4173/#intro-plan-seguridad-vial`.
- Fresh screenshot evidence: `test-results/page18-preview-4173.png`; metrics evidence: `test-results/page18-preview-4173-metrics.json`.
- Visual review notes from the fresh preview: the rejected DOM/native label backing plates are gone; center text is transparent over the source circle with no protruding rectangular backing; `ИНСТИТУЦИИ` and `ПОГИБШИЕ` read optically centered in their visible source boxes; `ЗДОРОВЬЕ` appears as one coherent source-like label box with the DOM text over it.
- Verification commands/results:
  - `node --test tests/content-pandemia-vial-section.test.mjs` - passed, 14/14 tests.
  - `pnpm exec tsc --noEmit` - passed.
  - `git diff --check` - passed.
  - `pnpm run build` - passed; content validation, asset sync, Vite build, and service worker generation succeeded.
  - `pnpm exec playwright test tests/e2e/app.spec.ts -g "Pandemia vial prototype|Introduction index routes"` - passed, 4/4 tests across chromium and mobile.

## Implementation Evidence - Current Page 18 Bitmap Artifact Fix

- Implementation Agent follow-up completed in assigned worktree `/Users/chap/devel/cabadrive-worktrees/029-pandemia-vial-section` on branch `codex/029-pandemia-vial-section`; no stage, commit, push, merge, rebase, reset, or cleanup was performed.
- Repaired only `content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/intro-road-safety-plan/page-018/diagram-consequences-clean-source.png` for the visible page 18 artifact class: restored the non-text horizontal artifact zones from local source page `content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/pages/page-018.jpg` instead of covering them with new rectangles or DOM/CSS backgrounds.
- Removed the two non-source beige horizontal bars below the diagram crop, the non-source beige strip under the institutions block, and the non-source black horizontal protrusion to the right of the fatal-victims wedge. Existing transparent DOM category labels and transparent center text were preserved.
- Updated cleanup metadata in `src/data/pandemiaVialSection.ts` to record the new no-bar/no-protrusion truth.
- Updated `tests/content-pandemia-vial-section.test.mjs` and `tests/e2e/app.spec.ts` so page 18 fails on the current regression zones: non-source beige horizontal bars below the diagram or under `ИНСТИТУЦИИ`, and a non-source black horizontal protrusion to the right of the fatal-victims wedge.
- Fresh preview URL: `http://127.0.0.1:4199/?preview=page18-artifact-fix-1780000000001#intro-plan-seguridad-vial`.
- Fresh screenshot evidence:
  - full page: `test-results/page18-artifact-fix-4199-final-refresh.png`
  - diagram crop: `test-results/page18-artifact-fix-4199-final-refresh-diagram.png`
- Browser smoke notes: final crop shows no bottom beige bars and no black protruding bar to the right of the fatality wedge; all page 18 `h4` label backgrounds computed as `rgba(0, 0, 0, 0)`, keeping transparent DOM labels. `ИНСТИТУЦИИ` and `ПОГИБШИЕ` remain centered over their source label boxes.
- Verification commands/results:
  - `node --test tests/content-pandemia-vial-section.test.mjs` - passed, 14/14 tests.
  - `pnpm exec tsc --noEmit` - passed.
  - `git diff --check` - passed.
  - `pnpm run build` - passed; content validation, asset sync, Vite build, and service worker generation succeeded.
  - `pnpm exec playwright test tests/e2e/app.spec.ts -g "Pandemia vial prototype|Introduction index routes"` - passed, 4/4 tests across chromium and mobile.

## Architect Consolidation - Requirements And Guideline Documentation Handoff

- [x] Consolidate the accumulated user feedback into a current canonical transfer contract in `spec.md` under `Architect Consolidation - Current Transfer Contract`.
- [x] Mark durable frontend documentation as required, not optional, for the current merge request.
- [x] Implementation Agent must add or update durable project documentation for the conversion rules, preferably `docs_project/project/frontend/manual-conversion-guidelines.md`, and link it from `docs_project/project/frontend/frontend-docs.md`.
- [x] Durable docs must include: source PDF as mockup/reference; no runtime PDF/full-page raster/image-only page; source `Índice` route boundaries; full `Руководство` hierarchy; selectable DOM/SVG text; natural/simple Russian; ticket-critical detail retention; source-artwork preservation; no generic icon substitutions; no broad masks/square patches/DOM plates; source-crop/inpaint cleanup; style-token rules; page 17/page 18/page 19 named fixtures; and visual checker pass/fail criteria.
- [x] Implementation Agent must verify that `Дорожная пандемия` prose uses the same Introduction article shell/background/padding/font rhythm as the other article-like Introduction pages while leaving the Pandemia infographic unchanged.
- [x] Implementation Agent must run and record final local verification:
  - `node --test tests/content-pandemia-vial-section.test.mjs`
  - `pnpm exec tsc --noEmit`
  - `pnpm run build`
  - `pnpm exec playwright test tests/e2e/app.spec.ts -g "Pandemia vial prototype|Introduction index routes"`
  - `git diff --check`
- [x] Implementation Agent must capture or preserve screenshot/checker evidence for `#pandemia-vial`, `#intro-accidente-incidente`, and `#intro-plan-seguridad-vial`, including page 17 lobe/card rules, page 18 complete-source-crop/label/artifact rules, and page 19 stable-circle-grid rules.
- [x] Implementation Agent must record any remaining divergence, missing source artifact, crop limitation, Russian fitting tradeoff, or checker limitation as feedback for Architect disposition before PR readiness.
- [x] No unresolved Implementation Agent feedback may remain before Orchestrator requests final Architect validation.

## Implementation Evidence - Documentation And Merge Preparation

- Implementation Agent update completed in worktree `/Users/chap/devel/cabadrive-worktrees/029-pandemia-vial-section` on branch `codex/029-pandemia-vial-section`.
- Durable documentation added:
  - `docs_project/project/frontend/manual-conversion-guidelines.md` records the reusable PDF/manual-fragment to Russian interactive web conversion guide, including source PDF as mockup/reference, source `Índice` routing, full `Руководство` hierarchy, selectable text, simple Russian, ticket-detail retention, source-artwork preservation, no generic icons, no broad masks/DOM plates, crop/inpaint cleanup, style-token guidance, page 17/18/19 fixtures, and checker pass/fail criteria.
  - `docs_project/project/frontend/frontend-docs.md` now links the guide and records `Руководство` as the current user-facing interactive manual destination that replaces visible `Руководство 4R`.
- `Дорожная пандемия` prose verification: runtime still renders `#pandemia-vial` as `<article className="intro-document pandemia-prototype">` with the shared `intro-document-header` and `intro-document-flow` shell. The visible heading has segment metadata for typography/checker evidence, intro/body prose remains responsive DOM text, and the infographic remains inside `pandemia-stage-scroll`/`pandemia-page` with the existing source-crop assets and geometry unchanged by this documentation pass.
- Legacy complete-manual e2e compatibility decision: because visible `Руководство 4R` is intentionally removed, the legacy hidden `Manual4RuedasView` can be opened only through internal test hook `/?legacyManual=1`. The user-facing navigation still exposes one guide destination, `Руководство`; the old complete-manual tests keep coverage without reintroducing a duplicate visible guide button.
- Screenshot/checker evidence preserved from the final focused Playwright run:
  - `#pandemia-vial`: `test-results/app-Pandemia-vial-prototyp-41f38-an-PDF-faithful-composition-chromium/pandemia-vial-chromium.png`, `test-results/app-Pandemia-vial-prototyp-41f38-an-PDF-faithful-composition-chromium/pandemia-vial-narrow.png`, and `test-results/app-Pandemia-vial-prototyp-41f38-an-PDF-faithful-composition-mobile/pandemia-vial-mobile.png`.
  - `#intro-accidente-incidente` / page 17: `test-results/app-Introduction-index-rou-59e0b-tive-Russian-document-pages-chromium/intro-route-intro-incident-chromium.png`, `test-results/app-Introduction-index-rou-59e0b-tive-Russian-document-pages-chromium/intro-route-intro-incident-narrow.png`, and `test-results/app-Introduction-index-rou-59e0b-tive-Russian-document-pages-mobile/intro-route-intro-incident-mobile.png`.
  - `#intro-plan-seguridad-vial` / pages 18-19: `test-results/app-Introduction-index-rou-59e0b-tive-Russian-document-pages-chromium/intro-route-intro-road-safety-plan-chromium.png`, `test-results/app-Introduction-index-rou-59e0b-tive-Russian-document-pages-chromium/intro-route-intro-road-safety-plan-narrow.png`, and `test-results/app-Introduction-index-rou-59e0b-tive-Russian-document-pages-mobile/intro-route-intro-road-safety-plan-mobile.png`.
  - Additional page 18 crop/artifact evidence remains available at `test-results/page18-artifact-fix-4199-final-refresh.png` and `test-results/page18-artifact-fix-4199-final-refresh-diagram.png`.
- Final verification commands/results after documentation and the legacy-manual test hook adjustment:
  - `node --test tests/content-pandemia-vial-section.test.mjs` - passed, 14/14 tests.
  - `pnpm exec tsc --noEmit` - passed.
  - `pnpm run build` - passed; content validation, asset sync, Vite build, and service worker generation succeeded.
  - `pnpm exec playwright test tests/e2e/app.spec.ts -g "Pandemia vial prototype|Introduction index routes"` - passed, 4/4 tests across chromium and mobile.
  - `git diff --check` - passed with no whitespace errors.
  - Initial `pnpm run preflight` rerun failed only because legacy complete-manual e2e tests still waited for the intentionally removed visible `Руководство 4R` button. After switching those tests to the hidden `/?legacyManual=1` hook, final `pnpm run preflight` passed: feature-memory gate, repository baseline, content validation, `pnpm run test` 309/309, build, and `pnpm run test:e2e` 66/66.
- Implementation Agent feedback for Architect disposition: none remaining. No unresolved divergence, missing source artifact, crop limitation, Russian fitting tradeoff, or checker limitation is known from this documentation/merge-prep pass.

## Current Architect Handoff Summary

- Current intended product state: four Introduction routes are implemented inside the scalable `Руководство` hierarchy; future chapters/annexes are navigation placeholders; `Руководство 4R` is not a duplicate visible destination.
- Current intended visual/content state: `Дорожная пандемия` prose is styled like the other Introduction article pages, while its infographic remains source-faithful; page 17/18/19 visual guardrails remain active and must not be relaxed for merge.
- Current durable-docs status: complete. `docs_project/project/frontend/manual-conversion-guidelines.md` was added and `docs_project/project/frontend/frontend-docs.md` links it.
- Current verification status: complete for PR readiness. Final focused checks and `pnpm run preflight` are recorded in `Implementation Evidence - Documentation And Merge Preparation`.
- Current blockers from Architect perspective: none. No unresolved Implementation Agent feedback, durable-docs gap, or verification rerun gap remains known in feature memory.

## Architect Review Disposition - PR #173 P1 Process-Memory Blocker

- Review finding: stale `tasks.md` process memory contradicted later implementation evidence by leaving durable-docs and verification gaps open, and by leaving outdated acceptance checklist items unchecked.
- Disposition: accepted as a process-memory blocker and resolved in this Architect follow-up.
- Changes made: stale pending language was updated; page 18/page 19 source-crop tasks, typography/lower-row/global-card acceptance checks, and `pnpm run preflight` were marked complete only where later Implementation Agent evidence in this file records completion.
- Remaining gaps: none known. If a future reviewer finds a product/runtime defect, it should be routed as a new implementation follow-up; this P1 process-memory contradiction is resolved.
