# Specification: Native Russian Introduction Section Rebuild

## Feature Metadata

- Feature ID: `029-pandemia-vial-section`
- Role owner for this artifact: Architect
- Assigned worktree: `/Users/chap/devel/cabadrive-worktrees/029-pandemia-vial-section`
- Assigned branch: `codex/029-pandemia-vial-section`
- Verified base: `origin/main` at `afb0d2b8d00cb9d823266d661bab85fbe18043e8`
- Parallel-work warning: parallel work may exist; preserve sibling worktrees, branches, commits, PRs, dirty diffs, and process memory.

## Current Scope Extension

This Architect update records the user's latest request as an allowed explicit scope extension inside active feature `029-pandemia-vial-section`, not as a new standalone whole-document conversion.

The extension is allowed because it directly follows the staged rollout recorded by Analyst: after approving the `Pandemia vial` conversion model, the user wants several more blocks before any full-document conversion. The active branch/worktree may therefore continue with the Introduction block set while preserving every accumulated `Pandemia vial` requirement, checklist, rejection, and verification expectation.

The updated implementation scope is the source `INTRODUCCIÓN` / `INTRODUCCION` index block as four independent document pages/routes:

- `Pandemia vial` remains one standalone page/route.
- `Enfoque ético - ciudadano en la cultura vial` becomes one standalone page/route.
- `¿Accidente o incidente de tránsito?` becomes one standalone page/route.
- `Plan de seguridad vial de la Ciudad de Buenos Aires` becomes one standalone page/route.

Navigation must be driven by source `Índice` headings, not raw PDF page numbers. Each source index heading becomes its own route/navigation entry. The visible Introduction navigation must therefore list the four headings above as separate items, even when a heading spans multiple PDF pages or when an existing manifest page record has a different page-local heading.

Navigation must also be designed as the first populated slice of the future full Russian interactive version of the entire PDF manual, not as a one-off horizontal list or Introduction-only tab bar. Current Introduction pages must sit inside a scalable full-document information architecture based on the source `Índice`: top-level/support entries, chapter/annex group headers, and child section entries. Unimplemented future groups/children may be visible as pending/disabled/collapsed placeholders, but the current four Introduction children must remain directly navigable by source heading.

This integrated Russian interactive document belongs in the main app block/tab named `Руководство`. It replaces the current user-facing `Руководство 4R` manual-viewer destination rather than appearing beside it as a separate prototype or experimental block. Existing direct hashes (`#pandemia-vial`, `#intro-enfoque-etico`, `#intro-accidente-incidente`, and `#intro-plan-seguridad-vial`) must still deep-link into the corresponding `Руководство` child content and set the active full-hierarchy navigation state.

All accepted reusable QA requirements from `Pandemia vial` apply to every new Introduction page: native web page, Russian text selectable/copyable, no PDF viewer/full-page raster/masks/Russian overlay over Spanish, source-derived images/crops where needed, normal responsive prose without forced PDF line breaks, readable UI typography, no unnecessary source/provenance/page/book-layout elements, no excessive blank page canvas, no zoom/context controls, visual fidelity/layout checks, Playwright evidence, and screenshot evidence.

## Latest User Feedback

The current `Pandemia vial` prototype is not accepted. The feature memory must guide a follow-up implementation that preserves these constraints:

- The PDF/page render remains a mockup/reference only.
- A full PDF/page raster must not be rendered as the runtime background/base.
- Mask-over-Spanish-source-text and Russian overlay translation on the original page remain forbidden.
- Russian text remains native DOM/SVG/text in the reconstructed layout.

New binding feedback:

1. Increase the scale. The smallest rendered text must be comparable to text in Cabadrive study materials, not tiny PDF microtype.
2. Current hand-redrawn SVG icons/images are not close enough to the original. Prefer isolated cropped assets from the original, cleaned of visible text if needed, when they better preserve the source likeness. Do not keep poor manual vector redraws just to avoid raster assets.
3. Remove the `Вписать` / `100%` scale controls.
4. Remove the `Мировой контекст` and `Контекст города` buttons.
5. Simplify Russian wording. Use plain learner-facing Russian without excessive formalization while preserving exact meaning and all details that may matter in exam tickets.

Newest binding feedback for the next iteration:

1. Exclude visible source/provenance information from the learning document when it is not needed for solving exam tickets. Keep source traceability internally in data/tests/process memory.
2. For this section's bottom paragraph, remove source-attribution wording like `Эти данные взяты...` and keep only the learning-relevant conclusion: the idea that road safety improves only when all society works on it together.
3. Remove the footnote entirely from the visible document; it is not needed for ticket solving.
4. Remove book-layout elements that do not apply to the website/document experience: the page marker/page number and the blue upper-left semicircle/corner motif.
5. Maintain a reusable implementation/QA checklist so future PDF-section conversions do not rely on the human manually catching repeated issues.

Additional newest feedback to record as reusable criteria:

1. Intro/body explanatory text is still too small. Main text such as `Дорожное движение - одна из самых...` must be approximately the same size as ordinary body text in the app's `Материалы` section, not merely above a generic 14px minimum.
2. Images inside city statistic circles are hidden/covered by text or backgrounds. Circle visuals need separate readable text and fully visible icons.
3. The `8 из 10` people-grid asset is wrong/low-quality unless it accurately conveys the original meaning: 8 identical male pictograms and 2 female pictograms. If the crop is poor, recreate/clean that asset or use a native/clean vector/asset specifically for this pictogram group, while preserving the source meaning.
4. Normal prose paragraphs must be adaptive DOM text that wraps naturally by container width. Do not insert forced line breaks just to mimic PDF line wrapping, for example between `сложных` and `систем` or between `безопаснее` and `работать` when the text is one paragraph or a normal multi-sentence paragraph. This does not apply to image/infographic blocks, labels, or pinned statistic text, which may remain fixed to preserve layout.

Latest visual asset feedback:

1. The latest visual assets are rejected because they look redrawn and substantially different from the PDF artwork.
2. Visual assets for this page must use original PDF/source artwork whenever possible, preferably extracted/cropped from the PDF or the best available local source render at high resolution, then cleaned only where Spanish text must be removed for Russian DOM/SVG text.
3. Do not replace source pictograms/icons with newly designed generic or reconstructed SVG icons if the result is visibly different from the PDF.
4. Vectorization is allowed only when visually indistinguishable from the original artwork. The latest clean SVG replacements do not meet this bar and must be replaced.
5. City circle icons for motorcyclist, pedestrian, and car must be original artwork crops or high-fidelity cleaned originals, not generic new icons.
6. The `8 из 10` people grid should use original high-quality source pictograms/crop if possible. If cleanup is required, preserve the original silhouette/style and exact 8 male plus 2 female semantics.

Latest layout/framing feedback:

1. The current browser preview looks like a small data fragment placed on a huge blank white PDF page with excessive margins. This is rejected.
2. The visible `Pandemia vial` section must not render the full PDF page canvas or preserve huge blank top, side, or bottom whitespace.
3. Treat the PDF page as the visual source/layout reference for the meaningful `Pandemia vial` content block, then crop/reframe the actual web section around that content region.
4. Preserve the original infographic design, alignment, images, typography relationships, and pinned image/infographic layout within the content block.
5. Present the block as an ordinary responsive web page section with normal page margins and density.
6. Desktop should show the content block at readable scale without a tiny centered island.
7. Mobile may scroll or pan only where the fixed infographic requires it, but the first view must not start on blank whitespace.

Latest responsive prose feedback:

1. Orchestrator live-browser verification found the page is reframed, but the whole section remains a fixed-width canvas; ordinary prose clips or horizontally scrolls on a narrower in-app browser window. This is rejected.
2. Normal prose roles, including `heading`, `intro`, and the bottom learning conclusion/body, must live in responsive web flow or otherwise fit the viewport/container without horizontal clipping or horizontal scrolling.
3. Ordinary prose should wrap naturally like normal web content. It must not depend on a monolithic fixed-width canvas.
4. Horizontal scrolling/panning is allowed only for fixed infographic/image blocks where preserving the PDF-like pinned infographic layout requires it.
5. The meaningful infographic may remain pinned/fixed internally, but it should be presented inside or between responsive web-flow prose blocks, not as one fixed-width canvas that also contains and clips paragraphs.
6. Tests must verify no horizontal clipping/overflow for prose at the in-app/narrow viewport and mobile viewport while preserving source-derived PNG/crop assets, no rejected SVG runtime references, no huge blank canvas, no source UI/page marker/footnote/corner, font parity, and no forced paragraph line breaks.

Latest selectable-text feedback:

1. The current experience still feels like an image preview because text is not available as normal selectable/copyable text. This is rejected.
2. All ordinary Russian text and meaningful statistic labels should be real selectable/copyable DOM text unless a narrow fixed-infographic reason is explicitly documented.
3. At minimum, `heading`, `intro`, bottom learning conclusion/body, and statistic labels must not have `user-select: none`, `pointer-events: none`, or equivalent selection/copy prevention.
4. The section must behave like an ordinary web page: images/assets are images, but Russian text is selectable, copyable, and accessible text rather than rasterized/baked into images.
5. Tests should verify selection/copyability, or at least computed `user-select`, `pointer-events`, and browser selection APIs for prose and meaningful labels.

Latest lower-city-row alignment feedback:

1. In the lower city infographic, the gray statistic rows for `8 из 10` and `49%` currently sit lower than their matching left pictogram blocks. This is rejected.
2. The lower city rows must preserve the source PDF alignment: each left pictogram block and its corresponding gray statistic panel share the same vertical start level within a small tolerance.
3. The top edge of the `8 из 10` gray row must align with the top of the people-grid pictogram block.
4. The top edge of the `49%` gray row must align with the top of the two-person pictogram block.
5. Tests must add Playwright/bounding-box checks for `people-grid-icon` versus `male-victims-panel`/`male-victims`, and `people-pair-icon` versus `age-range-panel`/`age-range`.

Repeated lower-city-row regression feedback:

1. The lower city rows have regressed again. Repeated user-reported issues must become stricter reusable guards, not just notes.
2. Lower paired row alignment is not satisfied by a `top <= 4px` check alone. The row must preserve source row geometry: the left pictogram group and the gray rectangle read as one row on the same source baseline/row level.
3. Panel top, vertical center, bottom, and height must be proportionate to the corresponding left icon group. The gray panel must not float above/below the icon group or extend far beyond it.
4. Lower gray panel height must be bounded relative to both its left pictogram group and its internal text block.
5. Lower gray panels must include maximum empty-space ratio and bottom-whitespace checks so they do not create huge unused areas.
6. Any fix to upper/global cards must run grouped non-regression checks for all previously accepted visual feedback, including lower city row alignment/density, source-derived assets, typography, selectable text, and responsive prose.

Earlier typography feedback (superseded by the newest readability-first direction where it conflicts):

1. Typography does not yet match the original PDF. The current look feels like the default Cabadrive app Inter/system typography, while the source uses different rounded/geometric sans roles.
2. The Russian web section must approximate the source PDF typography more closely: heading letter shapes should read closer to the rounded heavy Spanish `Pandemia vial` heading, and body text should use a lighter rounded/geometric sans with larger line spacing and paragraph rhythm.
3. Use a local/offline font already available in the project/runtime, or add an appropriate local font asset only if licensing/source is acceptable. Remote font dependencies are forbidden.
4. This earlier closest rounded/geometric fallback direction is superseded for this section by the newest user rejection of SF-rounded/Gotham-like imitation; preserve only the requirement to document font choice and rationale.
5. Tune heading/body font family, weights, letter spacing, line-height, paragraph spacing, and text block width to match the original visual rhythm while keeping Russian readable, responsive, selectable, and copyable.
6. Tests/visual QA must record computed `font-family`, `font-weight`, and `line-height` for heading and intro/body, and include fresh screenshots for typography comparison.

Additional typography feedback:

1. Typography matching applies to the infographic too, not only heading/body prose. Statistic cards, blue strips, gray boxes, numbers, and labels must approximate the original font roles and rhythm.
2. Russian context labels must use consistent emphasis logic. Since `Contexto` is omitted in Russian and is not needed for ticket solving, do not bold only `Буэнос-Айрес`.
3. Either all text in each remaining context label uses the same weight, or both context labels use a consistent two-level treatment.
4. Tests should check context labels have consistent computed weight across their text, or verify that any two-level treatment is applied symmetrically to both labels.
5. Tests should reject `::first-line` or similar partial styling that results in only part of a context label, especially only the city name, being bold.

Font-identity context and superseded rounded-font approach:

1. Source PDF font identity is known and remains useful diagnostic context: the source uses embedded `GothamRounded-Book` (`Gotham Rounded Book`, weight 325), `GothamRounded-Light` (`Gotham Rounded Light`, weight 300), `GothamRounded-Medium` (`Gotham Rounded Medium`, weight 350), `GothamRounded-Bold` (`Gotham Rounded Bold`, weight 700), plus `HelveticaWorld-Regular`.
2. The earlier Avenir-first Russian stack was rejected by the user as unlike the source PDF.
3. The later SF-rounded/GothamRounded-like attempt is also rejected by the user: `шрифт не похож по стилю на оригинал, и вообще стало хуже, чем было`.
4. Future PDF-section conversions must still identify embedded/source PDF fonts before choosing web typography, but font imitation is not accepted when it harms Russian readability or overall visual quality.

Newest readability-first typography direction:

1. When PDF font imitation harms Russian readability/visual quality, use a modern UI readability stack instead of forcing source-like rounded imitation.
2. Prefer a platform/system UI stack for this web page: `system-ui`, `-apple-system`, `BlinkMacSystemFont`, `"Segoe UI"`, `Roboto`, `"Noto Sans"`, `"Helvetica Neue"`, Arial, sans-serif; or an equivalent locally bundled readable UI font with acceptable source/licensing.
3. For local macOS preview this should resolve toward Apple system/SF through the platform stack, not `SFNSRounded`/`SF Compact Rounded` first and not Avenir-first.
4. Tests/evidence must prove the primary Pandemia stack no longer starts with Avenir and does not start with `SFNSRounded`/`SF Compact Rounded`/`SF Pro Rounded` for the final accepted prototype unless a later explicit user/Architect decision changes it.
5. Remove any forced/narrow heading width that causes `Дорожная пандемия` to break into two lines at normal desktop width. The heading should wrap naturally only when the viewport/container truly requires it.
6. Keep structural visual fidelity where it matters: layout, alignment, source-derived artwork, density, statistic geometry, readable hierarchy, and text rhythm. For typography, prioritize clean Russian readability over exact PDF font mimicry.

Newest infographic geometry/density feedback:

1. Lower city statistic rows (`8 из 10`, `49%`) need source-like horizontal gap between the left pictogram blocks and the gray statistic rectangles. The current near-zero gap is rejected.
2. Text inside lower gray statistic rectangles must have source-like internal padding and vertical balance. It must not look pinned to the top edge.
3. Lower gray statistic rectangles must match the source proportions and density. They must not be oversized tall containers with excessive empty space.
4. Upper global statistic cards (`1,4 МИЛЛИОНА`, `50 МИЛЛИОНОВ`) must not contain excessive empty gray-box space; card proportions, number/label rhythm, and density must be source-like.
5. Fonts inside statistic cards remain subject to visual comparison. The current accepted font stack/evidence is not sufficient if the card font rhythm still looks visibly different from the PDF.
6. Airplane/stadium pictograms must be visually linked/attached to the blue strip as in the PDF. They must not look like separate detached images. The cap/attachment geometry between icon crop and blue strip must be validated.
7. Future sections must validate panel proportions, icon-panel gaps, internal text vertical alignment/padding, card density, and icon-to-strip attachment/cap geometry with bounding-box ratios/gaps, padding checks, and screenshot comparison.

Newest cap-geometry feedback:

1. The latest implementation attached the airplane/stadium icons to the blue strip, but the blue strip now reads as a huge full-width rounded half-pill/dome. This is rejected.
2. Source cap geometry is a mostly flat rectangular blue strip with a localized central rounded/semicircular cap or rise behind the pictogram.
3. The full blue strip must not become a giant rounded-top container. Left and right strip portions should remain rectangular/flat while any rounded cap is localized near the icon center.
4. Tests/evidence must distinguish local decorative cap geometry from full-container border-radius by checking left/right strip rectangularity and cap localization near the icon.
5. Future sections must treat localized cap/rise geometry as a separate reusable QA item, not a generic `border-radius` on the whole strip/container.

Newest global-card seam/alignment feedback:

1. The upper global statistic cards still show a white seam/gap above the blue strip between the pictogram/cap and the rectangle. This is rejected.
2. The icon, localized cap, blue strip, and card top must visually touch as one source-like unit; no white seam is allowed between the icon cap and strip/card top.
3. The blue strip and gray card panels must remain rectangular at the left and right edges; any rounded cap is local to the icon area only and must not reshape the whole rectangle.
4. Paired global statistic cards must use equal panel heights and aligned bottom edges/baseline grid, as in the source PDF.
5. Gray card empty-space ratio must be bounded. The text block should sit with source-like top/bottom padding and must not leave a large unused lower area.
6. Future sections must include bounding-box checks for icon/cap/strip seam/gap, rectangular panel preservation, paired-card height equality, paired-card bottom alignment, and gray-card empty-space ratio.

Durable visual-feedback rule:

1. Every accepted visual issue found by the user, reviewer, Orchestrator, or browser QA during this section work must be converted into a reusable requirement and validation checklist item for future PDF-section-to-Russian-web conversions.
2. This rule is durable for future manual-section work: the checklist below is not just for `Pandemia vial`; it is the starting QA contract for analogous sections across the document when those sections are assigned.
3. Future conversions must carry forward the current corrected classes of issues: source/reference-only PDF use, source-derived/cleaned visual assets, no provenance/page/book-layout clutter unless ticket-relevant, selectable Russian text, responsive prose, fixed infographic alignment where needed, no forced paragraph line breaks, readability-first modern UI typography when source-font imitation harms Russian quality, and consistent emphasis logic for paired labels.

Latest source-artwork preservation feedback:

1. The current page 17 `Factores de Riesgo` / `Recomendaciones` native symbolic/card replacement is rejected. It is not an acceptable known issue and must not be treated as final evidence.
2. For all current and future sections, source images, infographics, pictograms, and diagram artwork must be preserved 1:1 as source-derived assets or source-faithful reconstructions. Do not substitute generic icons, redesigned cards, approximated diagrams, modified pictograms, or DOM/CSS icon sets when the source contains specific artwork. Page 18 is stricter than this general rule: reconstruction is not allowed there.
3. If text inside an infographic must be Russian, preserve the original infographic geometry, colors, spacing, icon artwork, panel shapes, borders, and proportions exactly. Replace only the text with selectable Russian DOM/SVG text layers where necessary.
4. Do not solve infographic translation by shipping a full-page raster, leaving Spanish text visible, masking/overlaying the Spanish page wholesale, or broadly covering the source with Russian labels. Use clean source crops, text-free icon crops, and source-faithful structural shapes as needed.
5. Page 17 specifically requires source-faithful reconstruction of `Factores de Riesgo` and `Recomendaciones`: original wind/tree, car, and people icons; gray/yellow panels; blue recommendation label; border; spacing; and proportions. Generic person/avatar icons or generic risk/recommendation cards fail acceptance. The earlier requirement to preserve the decorative clipboard/notebook/check icon in `Recomendaciones` is superseded by the latest user decision: omit that low-value book-layout decoration entirely from the web rendering because it harms layout/readability; tests must not require its presence.
6. Tests and evidence must reject generic symbolic replacements and require source-derived asset metadata/crops for the risk-factor/recommendation artwork, no visible Spanish, and screenshot comparison against the source page.
7. This is also a non-regression checklist item for pages 18-20 work-axis/consequences diagrams: if the source has pictograms, diagrams, or infographics, generic icon replacements must not remain as accepted final work.

Latest `intro-plan-seguridad-vial` visual preservation feedback:

1. The same 1:1 preservation problem applies to `intro-plan-seguridad-vial` visuals. Page 18 `Consecuencias de los Incidentes de tránsito` must preserve the original gauge/semi-circle incident diagram, black fatal-victims wedge/label, beige category labels/panels, family/economy icon, health icon, institutions icon, pointer shape, colors, geometry, proportions, spacing, connector lines, and overall composition.
2. Page 18 may not be replaced by simplified cards, generic icons, redrawn diagrams, altered colors, different chart geometry, cropped-away source components, blurred/stretched artwork, or text-only substitutes.
3. Page 19 `Ejes de trabajo` must preserve the original four circular gray fields and exact pictograms: walking/pedestrian, megaphone, officer/police, and group/people. Preserve original icon sizes, placement, title relationship to circle, blue title style, text placement, two-column grid spacing, and proportions.
4. Page 19 may not be replaced by generic avatars, approximate symbols, simplified cards, modified pictograms, or alternate grid/chart geometry.
5. General non-negotiable rule: never lose, simplify, redraw, swap, crop away, recolor, blur, stretch, rasterize text-only substitutes for, or otherwise modify source images, infographics, diagrams, or pictograms. The only permitted content difference is Russian text where text content exists; artwork, geometry, spacing, proportions, and color system remain source-faithful.
6. Text should remain selectable where feasible, final UI must not contain visible Spanish text, and a page-wide raster preview must not be used as the whole solution.
7. Checklist/evidence must explicitly fail if page 18/page 19 visuals are generic replacements or if any source component is missing. Evidence must include source-derived asset metadata, source regions/crops, and screenshot comparison against the source pages. For page 18, evidence must prove a complete cleaned original infographic crop is used rather than source-faithful reconstruction.

Latest page 18 distortion blocker feedback:

1. The current `#intro-plan-seguridad-vial` page 18 Russian `Последствия дорожных инцидентов` diagram is rejected even though it appears to use source-derived pieces. The assembled composition is distorted beyond recognition compared with source `Consecuencias de los Incidentes de tránsito`.
2. The source-fidelity checker must fail not only when source-derived assets are absent, but also when source-derived pieces are assembled into a distorted, unrecognizable, or non-source-like composition.
3. Page 18 acceptance requires a visually recognizable match to the source: the same overall gauge/semi-circle composition, aligned beige sectors, gray outer arc, dark center ring, pointer, black fatality wedge and label, category labels and connector lines, relative positions, spacing, and proportions.
4. Russian labels must not overlap diagram shapes, pictograms, connector lines, or each other. The diagram must have no broken seams, clipped fragments, stretched crops, disconnected fragments, or source pieces floating outside their source role.
5. Explicit failed-screenshot examples that must fail future validation: icon fragments floating in the wrong place; white/gray chunks laid over or cutting through arcs; the black wedge covering text; category labels not aligned with connector geometry; category text colliding with the diagram; misaligned fragments; broken arc/gauge continuity; misplaced black fatality wedge; and mismatched overall geometry.
6. Generic, piecewise, CSS/SVG/native, or component-by-component reconstruction is not acceptable for page 18 after the latest user rejection. Implementation must use the complete original PDF infographic crop as the non-text artwork, clean only the source text areas, place Russian selectable text layers in source-faithful positions, remove all visible Spanish, and avoid a full-page raster.
7. Any earlier page 18 evidence that only proves component crops/metadata exist is superseded by this blocker until the complete assembled diagram passes source-composition, no-overlap, and screenshot comparison checks.

Latest page 18 overlay-transfer blocker feedback:

1. DOM text overlays must not introduce visible backing shapes that change source artwork. The center-circle text `ДОРОЖНЫЙ ИНЦИДЕНТ` must not have a protruding rectangle/background under it; any text cleanup/backing must stay inside the original circular field and must not cover or deform the ring, center circle, connector geometry, or pointer.
2. DOM text inside the source category label boxes must be vertically centered relative to each original label box. Off-center text that appears pinned to the top or bottom fails, with `ИНСТИТУЦИИ` called out as the concrete no-go example.
3. Category label geometry is source artwork, not a DOM shape to redesign. `ЗДОРОВЬЕ` must preserve the source label-box height, corner radius/shape, baseline/center alignment, and box proportions. If Russian text needs fitting, only the DOM text/wrapper width may vary where necessary; height, corner form, ring, connector lines, and source graphic shape must not be changed.
4. Any DOM overlay/background that visually changes source label shape, ring, center circle, connector lines, or pointer is rejected. The checker must treat such overlays as source-artwork modification, not as harmless text placement.

Latest page 18 label and center-artifact blocker feedback:

1. `ИНСТИТУЦИИ` is rejected when it appears top- or bottom-pinned inside the source label box. It must be vertically centered within the original beige label backing.
2. `ЗДОРОВЬЕ` is rejected when the Russian text overflows the light-brown label backing, when the backing is too small for the text, or when its corners/shape are mismatched, broken, or visibly different from the source label-box geometry.
3. `ПОГИБШИЕ` is rejected when its font size/style visibly differs from the other page 18 category labels. Category-label typography must be consistent across page 18 while each label remains inside its original source box, including the black fatal-victims label.
4. The center `ДОРОЖНЫЙ ИНЦИДЕНТ` text still fails if any rectangular backing, cleanup patch, opaque DOM background, mask, or square artifact is visible over the circle/ring. Center text must be transparent text only over the cleaned source circle.
5. Reusable transfer rule: Russian label boxes may widen when required by Russian text length, but source label-box height, corner radius/shape, vertical centering, and connector relationships must be preserved. The visual checker must reject label backgrounds shorter than text, mismatched corners, top/bottom-pinned text, inconsistent category-label typography, and any opaque rectangle in the center circle.

Current page 18 label-artifact regression feedback supersedes prior page 18 acceptance:

1. The in-browser result at `http://127.0.0.1:4187/?preview=page18-fixes-1779996165464#intro-plan-seguridad-vial` is rejected. Earlier `[x]` evidence for page 18 label cleanup, native category label backings, and center artifact removal is superseded until this exact regression class passes fresh visual review.
2. Visible cleanup artifacts around label boxes, label-box corners, connector-line intersections, the center ring, and the center circle fail acceptance. Concrete no-go examples are the user-marked seams/patches around `СЕМЬЯ И ЭКОНОМИКА`, `ЗДОРОВЬЕ`, `ИНСТИТУЦИИ`, connector lines, and the center ring/circle.
3. Do not fix Spanish-text removal or Russian fitting by covering the source with block patches, square/rectangular masks, color-matched plates, or partial label overlays. Cleanup must be local to the original glyphs and must preserve surrounding non-text pixels; if a letter crosses a background boundary, the boundary must be restored/inpainted, not hidden under a block.
4. Label text vertical centering must be measured against the visible source label box/pill that the learner sees, not against an invisible CSS box or wrapper. Use rendered text ink/bounding boxes or screenshot-derived measurements against the source label backing. `ИНСТИТУЦИИ` and `ПОГИБШИЕ` are explicit no-go examples for text pinned to the lower part of the label.
5. `ЗДОРОВЬЕ` must have one coherent source-like label backing: the backing must be wider than the text with source-like padding, keep consistent corner radii, and have no exposed small corner tabs, step artifacts, or mismatched left/right corners.
6. `ПОГИБШИЕ` must share the same category-label typographic system as the other page 18 labels, including visual weight, optical size, line-height, and vertical center, while preserving the black source label role.
7. Center `ДОРОЖНЫЙ ИНЦИДЕНТ` must have no visible rectangular cleanup/DOM/image patch inside or across the circle. Any hard-edged rectangle over the ring, pointer, or circular field fails even if its color approximately matches the background.
8. Do not mark page 18 label cleanup/checker tasks complete from automated geometry checks alone. Completion requires a fresh browser screenshot of the current preview compared with the original source and explicit human/QA visual confirmation that the user-marked artifact classes are absent.

Latest page 17/page 19 clipping and geometry blocker feedback:

1. The current page 17 Russian `Factores de Riesgo` visual is rejected because the visible style changed substantially from the source. Source-derived image presence is not enough when the card geometry is wrong.
2. Page 17 `Factores de Riesgo` source cards are three long rounded rectangles with a large circular/lobed left edge. The pictogram belongs centered and fully visible inside that circular left lobe, not as a square or rectangular crop stuck onto the left side.
3. Page 17 risk-card acceptance requires source-like long light-gray panels for Ambient/Ambiental and Vehicle/Vehicular, a yellow panel for Human/Humano, rounded right corners, an integrated circular left lobe, centered fully visible source pictogram inside the lobe, source-like spacing, title/body positions, and no clipped square/rectangular crop artifacts.
4. The failed page 17 screenshot classes must fail future validation: flat rectangles without a proper circular lobe, square/rectangular cropped image fragments, icons clipped or awkwardly positioned, visible crop-box edges, wrong panel geometry, and altered risk-card style.
5. Superseded by the latest user decision: do not keep fighting the page 17 `Recomendaciones` decorative clipboard/notebook/check icon. Remove it entirely from the web rendering because it is book-layout decoration, not needed for ticket meaning, and repeated preservation attempts degraded fidelity/readability. The recommendation callout must still preserve source-like blue label, border, spacing, and alignment without a clipped or reintroduced icon.
6. Page 19 `Ejes de trabajo` pictograms are rejected when clipped. All four gray circular pictogram fields must show the complete source icon inside the circle: pedestrian/walking, megaphone, officer/police, and group/people. No partial square crop corners, cropped quadrants, cut-off icon tips, visible crop-box artifacts, or icon/background coverage may remain.
7. Page 19 remains the source composition: four circle/title/text items in a two-column grid on desktop. Responsive variants may stack only where needed, but must preserve complete icons, gray circular fields, title/circle/text relationships, spacing, and source-like visual hierarchy at desktop, narrow, and mobile widths.
8. The source-fidelity checker must validate visible composition, not only asset existence/source metadata. It must check no clipping, no visible square crop boxes inside circular lobes/circles, no icon/background coverage, no overflow cuts, no parent `overflow:hidden` clipping of required icons, source-like lobe/card/circle geometry, spacing, and alignment.
9. Explicit new checker-failure examples: page 17 risk cards rendered as flat rectangles with square icon crops; a page 17 recommendation clipboard reintroduced or clipped after the omission decision; page 19 axis icons showing only a cropped quadrant or visible square crop box; and page 18 gauge assembled from misaligned fragments.
10. Automated checks are required where practical: image bounding boxes sit inside intended circle/lobe with source-like padding; computed `object-fit` or equivalent preserves full artwork rather than forced cropping; parent overflow does not clip required icons; and Playwright screenshot/bounding-box checks plus screenshot comparison/manual review evidence cover desktop, narrow, and mobile.

Latest page 17/page 19 transfer-alignment feedback:

1. Superseded: the earlier requirement to preserve a complete page 17 `Рекомендации` clipboard/notebook/check crop is no longer active. The icon is decorative book-layout artwork and must be omitted entirely from the web rendering; tests/checkers must not require it.
2. Page 17 `Рекомендации` checker must no longer require a clipboard/notebook/check icon. It must instead fail if the callout label/border becomes misaligned, clipped, visually unfaithful, or if a partially clipped/reintroduced decorative clipboard/notebook/check fragment remains visible.
3. Page 17 `Факторы риска` pictograms inside circular lobes must match source framing. Each source pictogram alpha bounds must be visually centered in its circular lobe and occupy a source-like fraction of the circle area. The checker must align the alpha visual center, not only the `<img>` element box, with the lobe center.
4. Page 17 risk pictogram checker must fail when alpha center differs from lobe center beyond tolerance, alpha bounds are too small/large versus the original, an important part such as the car diagonal support or people lower silhouettes is cut by the lobe/crop, or all icons share the same CSS box while visible alpha content is framed differently.
5. Page 19 `Направления работы` circles must form a stable source-like 2x2 grid on desktop. Equal circle diameters, top-row center-y alignment, bottom-row center-y alignment, left/right column center-x alignment, and consistent row/column gaps are required. Title/body wrapping must not move a circle out of the grid.
6. Page 19 grid checker must fail when top-row circle centers differ in y beyond tolerance, bottom-row centers differ, circle diameters differ, title wrapping causes icon-circle drift, or desktop collapses into an uneven masonry layout. Mobile/stacked layouts may differ, but must preserve local alignment and complete icons.
7. Page 18 overlay-transfer rules from the previous feedback remain active while page 17/page 19 are fixed: no protruding center backing rectangle under `ДОРОЖНЫЙ ИНЦИДЕНТ`, label text vertically centered in source boxes, and `ЗДОРОВЬЕ` source label shape/size/corners preserved.

Latest recurring-style feedback:

1. Blue callout/law blocks on `intro-enfoque-etico` currently use inconsistent alignment: one appears left-aligned and another centered. This inconsistency is rejected unless the source explicitly shows a variant.
2. Repeated block types must use one consistent style across these document sections unless the original source has a clear, recorded different style.
3. Every recurring style element introduced in this document family must be recorded as a reusable style token/guideline before implementation acceptance: typography family/weights, headline/body sizes, line-height, colors, paddings, margins, border widths/radii, alignment, icon/image positioning, and responsive behavior.
4. Blue law/callout blocks specifically must share the same background color, left accent stripe, padding, text alignment, font weight, line-height, width behavior, and margin cadence across the document unless a source-backed variant is recorded.
5. Do not center one callout and left-align another by accident. When a new style element appears, add it to the style guideline and validate it against the source before implementation is accepted.

## Goal

Build the Introduction block set from the GCBA manual as native, site-rendered Russian web document pages that visually match the relevant source PDF fragments while navigating by source `Índice` headings.

`Pandemia vial` remains the first approved-model page, and the same native conversion/QA contract now extends to `Enfoque ético - ciudadano en la cultura vial`, `¿Accidente o incidente de tránsito?`, and `Plan de seguridad vial de la Ciudad de Buenos Aires`.

The source PDF fragments are mockups, not runtime documents. The accepted implementation must recreate each heading page with native HTML/CSS/SVG plus isolated source-derived assets where those assets improve visual fidelity.

## Source Location

The source of truth for this slice is the committed GCBA 4-wheel manual corpus, source `Índice` headings, manifests, and local page renders used only for reference/asset extraction:

- Navigation file: `content/manuals/gcba-manual-vehiculo-4-ruedas-2023/navigation.ru.json`
- Text manifest: `content/manuals/gcba-manual-vehiculo-4-ruedas-2023/manual.ru.json`
- Layout manifest: `content/manuals/gcba-manual-vehiculo-4-ruedas-2023/layout.ru.json`
- Reference page renders: `content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/pages/page-015.jpg` through `page-020.jpg`
- Source index evidence: `index_pages_11_12`

Current Introduction index-heading scope:

| Navigation id | Source `Índice` heading | Russian navigation title | Manifest range to verify |
| --- | --- | --- | --- |
| `intro-road-pandemic` | `Pandemia vial` | `Дорожная пандемия` | `startPage: 15`, `endPage: 15` |
| `intro-ethical-civic-approach` | `Enfoque ético - ciudadano en la cultura vial` | `Этико-гражданский подход в дорожной культуре` | `startPage: 16`, `endPage: 16` |
| `intro-incident` | `¿Accidente o incidente de tránsito?` | `Авария или дорожный инцидент?` | `startPage: 17`, `endPage: 17` |
| `intro-road-safety-plan` | `Plan de seguridad vial de la Ciudad de Buenos Aires` | `План дорожной безопасности города Буэнос-Айрес` | `startPage: 18`, `endPage: 20` |

Implementation Agent must re-verify exact PDF page spans, source text, source images, layout boundaries, and index labels before building each page. Existing manifest labels may omit accents or use page-local headings; visible navigation follows the source `Índice` heading concept and must not split content by raw PDF pages.

Observed `Pandemia vial` source content span includes source marker `14`, intro paragraph, `Pandemia vial` title, footnote, explanatory paragraph, `Contexto Mundial`, `Contexto Ciudad de Buenos Aires`, and visual statistic/icon content that Implementation Agent must re-verify from the source fragment. Some observed source elements are source-trace/book-layout material and must be omitted from the visible learning document for this section and treated as reusable guidance for later Introduction pages.

## Target Full-Document Navigation IA

The navigation shell for this feature must be compatible with the future full Russian interactive manual. The current Introduction pages are the first populated children of this full `Índice` tree. Future chapters and annexes may remain pending/disabled/collapsed placeholders until their content is implemented; do not create content pages for them in this feature unless separately assigned.

The shell is mounted as the main app `Руководство` destination. The legacy `Руководство 4R` manual-viewer entry/view is superseded for users and must be removed from user-facing navigation. If old manual-viewer code remains internally during transition, it must not be exposed as the current guide destination unless a later repo-architecture decision explicitly requires it.

User-visible navigation labels should be Russian. The navigation data should preserve the source Spanish title, source group title, and page reference (`Pág.`) as metadata for mapping and QA. Do not expose QA/provenance clutter inside content pages; navigation may show meaningful chapter grouping, implemented/pending state, and progress/state where useful.

Target navigation tree:

| Type | Source label / page | Russian user label | Child source entries |
| --- | --- | --- | --- |
| Support | `Presentación` | `Предисловие` | none yet |
| Support | `Glosario` | `Глоссарий` | none yet |
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

Implementation may add Russian labels for child entries as part of the navigation data. If a child entry is not implemented in this feature, it must be clearly non-navigable or route to a deliberate pending state that does not create a fake content page. The active Introduction item must be discoverable inside the full hierarchy, with active group and active child state.

## Scope

In scope:

- Four standalone preview/route/surfaces for the current Introduction index headings:
  - `Дорожная пандемия` / `Pandemia vial`;
  - `Этико-гражданский подход в дорожной культуре` / `Enfoque ético - ciudadano en la cultura vial`;
  - `Авария или дорожный инцидент?` / `¿Accidente o incidente de tránsito?`;
  - `План дорожной безопасности города Буэнос-Айрес` / `Plan de seguridad vial de la Ciudad de Buenos Aires`.
- Full-document navigation shell/data model based on the source `Índice` hierarchy, with the current Introduction children populated and future chapters/annexes represented as pending/disabled/collapsed placeholders where appropriate.
- Main app integration under the user-facing block/tab `Руководство`, replacing the legacy `Руководство 4R` manual-viewer destination as the current guide entry point.
- Document navigation based on source `Índice` groups and headings rather than PDF page numbers.
- Russian user-facing navigation labels with Spanish source labels and page references preserved as metadata for mapping/QA.
- Active route/hash behavior, active group/child state, keyboard/a11y labels, mobile/narrow usability, and direct navigation to the four implemented Introduction children inside the full hierarchy, including legacy direct hashes `#pandemia-vial`, `#intro-enfoque-etico`, `#intro-accidente-incidente`, and `#intro-plan-seguridad-vial`.
- Native HTML/CSS/SVG reconstruction of the PDF fragment in Russian.
- Dedicated section-level data, not a generic whole-manual migration.
- Complete Russian semantic DOM for every learning-relevant source text, caption, label, statistic, and visual label in each page.
- Adaptive DOM prose paragraphs without manual PDF-style line breaks.
- Responsive web-flow prose for `heading`, `intro`, and bottom learning conclusion/body, with no horizontal clipping/scrolling at narrow in-app or mobile viewport widths.
- Selectable/copyable Russian DOM text for ordinary prose and meaningful statistic labels; no image-preview-only text.
- Source-faithful lower city row alignment between pictogram blocks and their gray statistic panels.
- Source-faithful lower city row geometry: horizontal gap between pictograms and gray panels, panel height/width proportions, internal padding, and vertical text balance match the PDF.
- Stricter lower city row non-regression: top/center/bottom/height and empty-space ratios are checked against the left pictogram group, not only a top-edge delta.
- Internal traceability for omitted source/provenance/book-layout elements.
- Larger readable scale with the smallest text comparable to existing study-material text.
- Intro/body explanatory text scaled to approximately match ordinary body text in `Материалы`.
- Readability-first modern UI typography for heading, body, and infographic text roles, replacing the rejected SF-rounded/GothamRounded-like attempt.
- A unified readable local/offline typography system across the Introduction pages, covering heading/body prose plus infographic labels, numbers, statistic cards, blue strips, gray statistic boxes, and context labels where those roles exist.
- Platform/system UI font stack that starts with `system-ui`, `-apple-system`, `BlinkMacSystemFont`, `"Segoe UI"`, `Roboto`, `"Noto Sans"`, `"Helvetica Neue"`, Arial, sans-serif, or an equivalent locally bundled readable UI font with acceptable source/licensing.
- Natural heading wrapping: no forced narrow heading width that breaks `Дорожная пандемия` into two lines at normal desktop width.
- Consistent context label weight/emphasis, with no partial bolding of only `Буэнос-Айрес`.
- Source-faithful global statistic card density and attachment geometry: gray cards are not overly empty, card font rhythm matches the source, and airplane/stadium pictograms appear attached to the blue strip/cap as in the PDF.
- Source-faithful blue-strip cap geometry: the strip remains mostly rectangular with only a localized central cap/rise under the airplane/stadium pictogram, never a full-width rounded pill/dome.
- Source-faithful global card pairing: airplane/stadium card panels have no white seam between icon/cap/strip, retain rectangular left/right edges, have equal panel heights, align their bottom edges, and bound empty-space below text.
- Reframed content-region layout: crop the web section around the meaningful `Pandemia vial` content block instead of rendering the full PDF page canvas with large blank margins.
- Source-faithful visual assets:
  - every source image, infographic, pictogram, and diagram artwork is preserved 1:1 as source-derived artwork or a source-faithful reconstruction;
  - page 18 `Consecuencias de los Incidentes de tránsito` is the explicit exception where source-faithful reconstruction is not accepted; the visual layer must be one complete cleaned original PDF infographic crop;
  - original PDF/source artwork crops extracted from the PDF or best available local source render at high resolution whenever possible;
  - cleaned source artwork only where visible Spanish text must be removed for Russian DOM/SVG text;
  - infographic text replacement keeps original geometry, colors, spacing, icon artwork, panel shapes, borders, and proportions; only the text changes to selectable Russian DOM/SVG layers where needed;
  - CSS/SVG/vector only for structural shapes, layout primitives, or vectorizations that are visually indistinguishable from the original artwork;
  - no newly designed generic/reconstructed SVG pictograms/icons, redesigned cards, approximated diagrams, modified pictograms, or generic DOM/CSS icon sets when they differ from or replace source artwork;
  - Russian labels rendered as native DOM/SVG/text, not baked into the crop.
- Reusable document style guidelines for recurring block types:
  - style tokens/guidelines capture typography family/weights, headline/body sizes, line-height, colors, paddings, margins, border widths/radii, alignment, icon/image positioning, and responsive behavior;
  - repeated block types use one consistent style unless a source-backed variant is recorded;
  - blue law/callout blocks share background color, left accent stripe, padding, text alignment, font weight, line-height, width behavior, and margin cadence.
- Minimal affordances such as direct route/anchor. Source/provenance metadata must remain internal for these pages unless it is directly ticket-relevant.
- Tests/evidence proving native layout, learning-relevant Russian coverage, no visible Spanish text, no full-page raster base, no mask/overlay translation approach, removed controls/buttons, removed source/book-layout clutter, readable scale, no overlap, simple Russian wording, and local preview readiness.

Out of scope:

- Full manual replacement or manual sections outside the four listed Introduction index headings.
- Implementing content pages for future chapters/annexes outside the four Introduction children.
- Keeping both the legacy `Руководство 4R` destination and the new interactive Russian manual as separate user-facing app navigation destinations.
- Mounting the Introduction pages under a separate prototype, experiment, or Introduction-only destination instead of the main `Руководство` block.
- Runtime PDF viewer, PDF.js, iframe/object/embed PDF display, or browser PDF rendering.
- Backend endpoints, live AI, remote images, runtime network fetch, or remote manual URLs.
- Full page image as rendered background/base.
- Full PDF page canvas/page-sized white artboard with excessive blank top, side, or bottom whitespace.
- Tiny centered content island inside a large blank page-like shell.
- Monolithic fixed-width canvas that contains ordinary prose and causes the prose to clip or require horizontal scrolling.
- Horizontal scrolling/panning for `heading`, `intro`, or bottom learning conclusion/body prose.
- Rasterized/baked-in Russian text used for ordinary prose or meaningful statistic labels.
- CSS/attributes that disable selection or pointer interaction for `heading`, `intro`, bottom learning conclusion/body, or statistic labels.
- Lower city gray statistic rows that start lower/higher than their corresponding left pictogram blocks instead of matching the source alignment.
- Lower city gray statistic panels placed with little/no horizontal gap from the left pictograms when the source shows a visible gap.
- Lower city gray statistic panel text pinned to the top edge or lacking source-like internal vertical padding/balance.
- Lower city gray statistic panels that are too tall or too empty compared with the source proportions.
- Lower city gray panels whose vertical center, bottom, or height is disproportionate to the corresponding left pictogram group, even if top edges are close.
- Lower city gray panels extending far beyond the icon group and creating large bottom whitespace or excessive empty-space ratio.
- Fixes to upper/global cards that regress lower city row alignment, density, text padding, or panel proportions.
- Repeated user-reported visual regressions recorded only as notes instead of stricter reusable guards.
- Default app Inter/system typography used without deliberate readability, rhythm, and hierarchy tuning.
- Remote web font dependencies.
- Avenir-first Pandemia typography stack used as the accepted primary stack after the user rejected it.
- SFNSRounded/SF Compact Rounded/SF Pro Rounded-first Pandemia typography stack used as the accepted primary stack after the user rejected the SF-rounded/GothamRounded-like attempt.
- Forced source-font mimicry that makes Russian readability or visual quality worse than a modern UI readability stack.
- Forced/narrow heading width that causes `Дорожная пандемия` to break into two lines at normal desktop width.
- Typography selection that ignores the identified embedded source fonts as diagnostic context before choosing the final web stack.
- Future PDF-section typography chosen without first identifying embedded/source PDF fonts.
- Typography that ignores source rhythm: wrong heading/body roles, weights, letter spacing, line-height, paragraph spacing, or text block width.
- Infographic labels/numbers/cards left in default app typography when the source uses different roles.
- Treating the current font pass as sufficient when statistic card font rhythm remains visibly different from the PDF.
- Upper global statistic cards with excessive empty gray-box space or source-mismatched number/label rhythm.
- Airplane/stadium pictograms that look detached from the blue strip instead of attached/linked through source-like cap geometry.
- Blue strips turned into full-width rounded half-pills/domes while trying to attach airplane/stadium pictograms.
- Full-container `border-radius` used as a substitute for the PDF's localized cap/rise geometry.
- White seam/gap visible between airplane/stadium pictogram cap and the blue strip/card top.
- Upper global paired card panels with unequal heights or misaligned bottom edges.
- Upper global gray cards with text near the top and large unused lower area, or an unbounded empty-space ratio.
- Blue strip or gray card panels losing rectangular left/right edges because the full panel was rounded instead of only the local cap.
- Page 17 `Рекомендации` tests/checkers requiring the decorative clipboard/notebook/check icon, or any web rendering that reintroduces a partial, clipped, or layout-damaging clipboard/notebook/check fragment after the superseding omission decision.
- Inconsistent context label emphasis, including bolding only `Буэнос-Айрес` while `В мире` has no matching treatment.
- `::first-line` or equivalent partial styling that causes only part of a context label to be bold.
- Masking Spanish text in the page image and placing Russian text above it.
- Overlay translation on top of the original Spanish page.
- Side-by-side Spanish screenshot plus Russian transcript.
- Poor SVG/icon redraws when cleaned source crops would be more faithful.
- Newly designed generic/reconstructed SVG pictograms/icons that visibly differ from the source artwork.
- Simplified cards, generic icons, redrawn diagrams, altered colors, changed chart geometry, cropped-away source components, blurred/stretched artwork, or text-only substitutes for page 18/page 19 source visuals.
- Recurring callout/law blocks or other repeated block types with accidental alignment/style drift, including one centered blue callout and another left-aligned without source evidence.
- Flat post/page-only navigation, one-off horizontal Introduction tabs/cards, or a navigation component that cannot scale to the full source `Índice` hierarchy.
- Future chapters/annexes appearing as working content pages when their content has not been integrated.
- Navigation exposing QA metadata/source provenance clutter inside content pages instead of keeping Spanish titles/page refs in data metadata.
- User-facing navigation that still shows `Руководство 4R` as the current guide destination after the interactive `Руководство` document is added.
- Existing direct hashes for the four Introduction pages broken, redirected outside `Руководство`, or failing to set active `Руководство` group/child state.
- Scale controls such as `Вписать` / `100%`.
- Extra context buttons such as `Мировой контекст` / `Контекст города`.
- Visible source/provenance details that are not needed for ticket solving.
- Visible footnote for this section.
- Visible page marker/page number for this section.
- Blue upper-left semicircle/corner motif from the book layout.
- Overly formal Russian wording that makes the section harder for the target learner.
- Reusing the existing broad page 15 layout as final layout evidence.
- Final-validation records; those happen only when Orchestrator invokes final Architect validation later.

## Product Requirements

1. The app exposes a scalable full-document navigation shell based on the source `Índice`, with support entries, chapter/annex group headers, and child entries. The four implemented Introduction pages are populated children inside `Введение` / `INTRODUCCIÓN`, not isolated one-off tabs.
1a. Navigation is hierarchical and heading-based, not PDF-page-based: `Pandemia vial`, `Enfoque ético - ciudadano en la cultura vial`, `¿Accidente o incidente de tránsito?`, and `Plan de seguridad vial de la Ciudad de Buenos Aires` appear as separate navigable children under the Introduction group.
1b. `Plan de seguridad vial de la Ciudad de Buenos Aires` remains one navigation item/page even if its source span covers pages 18-20 or contains page-local subheadings such as `Ejes de trabajo`.
1c. The target full-document IA includes `Presentación`, `Glosario`, `INTRODUCCIÓN`, chapters 1-5, and annexes I-IV from the source `Índice`; future unimplemented groups/children are visible or gracefully collapsed/pending/disabled without creating fake content pages.
1d. User-visible navigation labels are Russian; source Spanish titles and `Pág.` references are preserved as navigation metadata for mapping/QA without adding source/provenance clutter to content pages.
1e. Active item state makes the current Introduction child discoverable within the full hierarchy, including active group and active child styling/ARIA state.
1f. The full-document navigation shell lives inside the main app block/tab `Руководство`, replacing the user-facing `Руководство 4R` manual-viewer entry/view.
1g. The app does not expose both `Руководство 4R` and the new interactive document as separate user-facing manual destinations.
1h. Existing direct hashes `#pandemia-vial`, `#intro-enfoque-etico`, `#intro-accidente-incidente`, and `#intro-plan-seguridad-vial` deep-link into the appropriate `Руководство` child content and update active group/child state.
2. Each first screen is the native Russian reconstruction for the selected source heading, not full-manual page navigation and not a raw PDF-page viewer.
3. Each reconstruction matches its source PDF fragment's composition, font roles, sizes/proportions, colors, alignments, image/statistic/icon placement when present, and visual hierarchy.
4. The whole prototype is scaled up enough that the smallest text is comparable to Cabadrive study-material text. Do not preserve PDF microtype.
4a. Intro/body explanatory text is approximately the same size as ordinary body text in `Материалы`; it must not be treated as a small caption just because the PDF source is small.
4a.1. Typography uses a deliberate modern UI readability stack, not the rejected SF-rounded/GothamRounded-like imitation and not accidental default styling.
4a.2. Embedded PDF fonts are documented as source context, but heading/body use a local/offline readability-first stack: `system-ui`, `-apple-system`, `BlinkMacSystemFont`, `"Segoe UI"`, `Roboto`, `"Noto Sans"`, `"Helvetica Neue"`, Arial, sans-serif, or an equivalent licensed/local readable UI font.
4a.3. Heading/body weights, letter spacing, line-height, paragraph spacing, and text block width are tuned for readable Russian rhythm while preserving the source hierarchy and responsiveness.
4a.4. Infographic labels, numbers, blue strips, gray boxes, and statistic cards use the same readable typography direction and computed metrics; card rhythm still needs visual comparison to the source.
4a.5. Context labels (`В мире` and `В городе Буэнос-Айрес`) use consistent weight/emphasis logic; no partial bolding of only the city name.
4a.6. The primary Pandemia font stack does not start with Avenir or `SFNSRounded`/`SF Compact Rounded`/`SF Pro Rounded`; tests reject those as first-family choices for the final accepted prototype unless a later explicit user/Architect decision changes this.
4a.7. The `Дорожная пандемия` heading is not constrained by a forced narrow width; it remains on one line at normal desktop widths and wraps only when the viewport/container genuinely requires it.
4b. Intro/body prose paragraphs wrap naturally by container width and do not contain forced PDF-style line breaks inside normal paragraph text.
4c. The visible section is reframed around the meaningful `Pandemia vial` content region with normal web-page margins/density; it does not render the entire PDF page canvas or a tiny island surrounded by blank whitespace.
4d. Desktop presents the block at readable scale without excessive top/side/bottom whitespace; mobile starts on content and only scrolls/pans where the fixed infographic requires it.
4e. Normal prose roles, including `heading`, `intro`, and bottom learning conclusion/body, are responsive web-flow content and fit the viewport/container without horizontal clipping or horizontal scrolling.
4f. Any horizontal scroll/pan is scoped only to fixed infographic/image blocks; prose must sit before, after, or around those blocks in normal responsive flow.
5. Russian text is selectable/readable semantic DOM or SVG text.
5a. At minimum, `heading`, `intro`, bottom learning conclusion/body, and meaningful statistic labels are selectable/copyable text and do not disable selection or pointer events.
5b. The section behaves like an ordinary web page, not an image preview: source-derived images remain images, while Russian prose and labels remain accessible text.
6. No Spanish text is visible in the primary composition or inside cropped image/icon assets.
7. The full PDF page render is not visible as the composition base.
8. Icon/image fidelity is strict. Use original PDF/source artwork, extracted/cropped from the PDF or best available local source render at high resolution, then clean only where Spanish text must be removed.
8a. Do not use newly designed generic/reconstructed SVG pictograms/icons when they visibly differ from the source PDF artwork.
8b. Vectorization is allowed only when visually indistinguishable from the original artwork; the latest clean SVG replacements are rejected and must be replaced.
8c. City statistic circle icons remain fully visible and visually separated from circle text/backgrounds, and use original artwork crops or high-fidelity cleaned originals.
8d. The `8 из 10` people-grid visual accurately communicates 8 male pictograms and 2 female pictograms while preserving the original silhouette/style.
8e. Lower city infographic rows preserve source alignment: the top of `people-grid-icon` aligns with `male-victims-panel`/`male-victims`, and the top of `people-pair-icon` aligns with `age-range-panel`/`age-range`, within a small visual tolerance.
8f. Lower city infographic rows preserve source spacing and panel geometry: the pictogram-to-gray-panel horizontal gap is source-like, gray panel height/width proportions are not oversized, and panel text has balanced internal padding rather than being pinned to the top.
8f.1. Lower city row non-regression checks must preserve full source row geometry: panel top, vertical center, bottom, and height are proportionate to the matching left pictogram group, and panel empty-space/bottom-whitespace ratios are bounded relative to the panel text block.
8g. Upper global cards preserve source density and attachment geometry: gray statistic rectangles do not contain excessive empty space, the `1,4 МИЛЛИОНА`/`50 МИЛЛИОНОВ` number-label rhythm is source-like, and airplane/stadium pictograms visually attach to the blue strip/cap as in the PDF.
8h. Upper global blue strips preserve source cap geometry: flat rectangular strip portions remain visible at the left/right, and any rounded/semicircular cap is localized under the airplane/stadium pictogram instead of becoming a full-width rounded dome.
8i. Upper global cards preserve source pairing geometry: no white seam appears between icon/cap and blue strip/card top, the left/right panel edges remain rectangular, the two card panels have equal heights, their bottom edges align to the same baseline, and gray-card empty-space ratio is bounded with source-like top/bottom text padding.
8j. Page 17 `Factores de Riesgo` / `Recomendaciones` visuals are source-faithful: original wind/tree, car, and people artwork; gray/yellow risk-factor panels; blue recommendation label; border; spacing; and proportions are preserved. Current native symbolic/card replacements are rejected, and the decorative clipboard/notebook/check icon is omitted entirely under the latest user decision; tests must not require it.
8k. Pages 18-20 work-axis/consequences diagrams inherit the same source-artwork rule: pictograms, infographic panels, and diagram artwork must not be left as generic icon/card replacements when the source has specific visual design.
8l. Page 18 `Consecuencias de los Incidentes de tránsito` preserves the original gauge/semi-circle incident diagram, black fatal-victims wedge/label, beige category labels/panels, family/economy icon, health icon, institutions icon, pointer shape, colors, geometry, proportions, spacing, connector lines, and overall composition.
8m. Page 19 `Ejes de trabajo` preserves the original four circular gray fields, walking/pedestrian pictogram, megaphone pictogram, officer/police pictogram, group/people pictogram, original icon sizes/placement, title-to-circle relationship, blue title style, text placement, two-column grid spacing, and proportions.
8n. Page 18/page 19 visuals are not simplified into cards, generic avatars/icons, approximate symbols, redrawn diagrams, altered colors, changed chart geometry, cropped-away source components, blurred/stretched artwork, or text-only substitutes.
8o. Style tokens/guidelines exist for recurring document block types and are reused consistently unless a source-backed variant is recorded. Blue law/callout blocks share one documented style for background, left accent stripe, padding, text alignment, font weight, line-height, width behavior, and margin cadence.
9. No `Вписать` / `100%` controls are visible.
10. No `Мировой контекст` / `Контекст города` buttons are visible. Those labels belong in the document layout only.
11. Source/provenance information that is not needed for ticket solving is not visible in the learning document.
12. The footnote is removed entirely from the visible document.
13. The page marker/page number is removed entirely from the visible document.
14. The blue upper-left semicircle/corner book motif is removed from the visible document.
15. The bottom paragraph keeps only the learning-relevant conclusion that improving road safety requires joint work by all society.
16. Russian wording reads as natural Russian learning text, not as a formal literal translation. Prefer common words, short sentences, and phrasing understandable to younger schoolchildren where the source meaning allows it.
16a. The three `Plan de seguridad vial` paragraphs need explicit rewriting review: shared road-safety responsibility; Vision Zero ethical principle including no deaths or permanent injuries, Sweden 1997, and more than three decades as a reference; and the transport-system design principle of containing/reducing consequences of human error and creating a safe system.
16b. Shortening is encouraged only when it does not remove, weaken, or alter meaning or exam-ticket details.
16c. Local consecutive text may be optimized for simpler flow: adjacent paragraphs may be merged, complex sentences may be split, and several short sentences may be combined when this makes Russian clearer and shorter.
16d. Text-flow optimization is local only. Preserve source document structure and order at the section/block level; do not globally rearrange sections, lists, diagrams, navigation, or source heading order.
17. The result is suitable to show to the user for approval and must include a local URL plus screenshot/description in Implementation Agent handoff for every Introduction heading route.

## Content Requirements

1. Cover every learning-relevant source text/statistic/label in each listed Introduction heading page.
1a. Before implementing the three added headings, verify their exact source span, text order, image/visual blocks, page-local subheadings, and layout from the source `Índice`, `navigation.ru.json`, `manual.ru.json`, `layout.ru.json`, and local PDF renders.
1b. Treat source `Índice` headings as page/route boundaries. Do not expose raw PDF page numbers as the primary document navigation.
2. Use simple, clear, natural Russian for learners. The text must not sound like a bureaucratic or literal Spanish-to-Russian translation.
2a. Render ordinary intro/body prose as true paragraphs. Preserve sentence and paragraph structure, but let browser wrapping handle line breaks.
2b. Render ordinary Russian prose and meaningful statistic labels as real text, not as pixels inside image assets. HTML text is preferred for prose; SVG text is acceptable for narrow infographic layout only if it remains selectable/copyable and accessible.
2c. Prefer common Russian words, direct phrasing, and short sentence structure roughly understandable to younger schoolchildren.
2d. Shorten formal phrasing where possible if the same meaning and all exam-relevant details remain intact.
2e. For the `Plan de seguridad vial de la Ciudad de Buenos Aires` prose, explicitly adapt the paragraphs about shared responsibility, Vision Zero, and safe-system design into natural Russian while preserving all listed details.
2f. Local consecutive text-flow transformations are allowed when they improve clarity: merge adjacent paragraphs, split complex sentences, or combine multiple short sentences. These changes must preserve source order inside the local block and must not rearrange sections, lists, diagrams, navigation, or other block-level structure.
3. Do not summarize, shorten, or editorially replace the source when doing so would remove or weaken learning-critical or exam-ticket information.
4. Preserve details that may matter in exam tickets: named entities, organizations, dates/years, obligations, definitions, conditions, lists, safety principles, exception words, fatality/statistic concepts, CABA/GCBA/OSV references when learning-relevant, and all numbers/percentages.
4a. After rewriting/simplification, compare Russian content against local ticket/practice-source material where available. If exact ticket relevance is unclear, preserve the detail or record an Architect/Analyst decision; Implementation Agent must not silently drop it.
5. Existing `manual.ru.json` translation may be used as source material, but Implementation Agent must simplify/correct wording where it is too formal or where visual labels/statistics need better translation.
6. For `Pandemia vial`, remove the source-attribution lead-in from the bottom paragraph and keep only the conclusion: `Это показывает: чтобы дороги стали безопаснее, работать над этим нужно всему обществу вместе.` Exact final wording may vary if it stays simple and preserves that meaning.
7. Remove footnotes, page markers, source markers, source/provenance labels, and book-layout decorations from visible learning pages unless a specific item is needed for exam-ticket learning. Keep source/provenance traceability internally if needed for validation.
8. For the added mostly textual Introduction headings, use normal responsive web prose/layout while preserving source title hierarchy, paragraph order, lists, emphasis, and learning-relevant callouts.
9. If any added heading contains visual blocks, diagrams, screenshots, logos, icons, or image-like source elements, use source crops/cleaned assets for artwork and keep Russian text as DOM/SVG selectable/copyable text.
9a. When translating text inside an infographic, preserve the source geometry and artwork 1:1; remove Spanish text only from the affected local text areas or use text-free source crops, then place selectable Russian text in matching positions. Do not ship a full-page raster, visible Spanish text, or wholesale mask/overlay translation.
10. When a recurring style element appears, add it to the document style guideline before implementation acceptance and validate its tokens against the source: typography, sizing, line-height, colors, padding, margin cadence, borders/radii, alignment, image/icon positioning, and responsive behavior.
11. Implementation must add or update an initial visual source-fidelity checker harness for these Introduction pages in this PR slice and run it before claiming completion. The checker may combine automated tests, metadata checks, and human-review screenshot artifacts, but it must produce a pass/fail report and return the block to work when source images, infographics, pictograms, layout, formatting, or style are lost or modified.

## Native Visual Requirements

1. Treat each source heading's PDF fragment as the mockup. The coded result should match:
   - spatial composition;
   - element alignment;
   - margins and relative spacing;
   - image/icon/graphic placement;
   - font roles and hierarchy;
   - approximate font sizes and weights;
   - colors and visual treatments;
   - statistic and label styling, while footnote styling is intentionally omitted for this section;
   - overall page/section proportions.
2. The PDF page is a reference for the content block, not a requirement to render a full page-sized canvas. Reframe each web page to its meaningful source heading region and remove blank page margins that do not serve the web document.
3. The only accepted visual deviations are conservative Russian text fitting, scale increase for readability, and cropping/reframing away from non-content PDF-page whitespace.
4. Use structural HTML for document structure and CSS for layout/typography. Typography must use local/offline fonts and the readability-first modern UI direction while preserving the source hierarchy; use SVG/CSS for structural shapes and only for artwork vectorization when it is visually indistinguishable from the source.
5. Use original source artwork crops for pictograms/icons/images when a heading has visual artwork, especially Pandemia city circle icons, the `8 из 10` people-grid, page 17 risk-factor/recommendation artwork, page 18 consequences gauge diagram, and page 19 work-axis circular pictogram grid, unless a vectorized replacement can be proven visually indistinguishable.
5a. Page 17 must reconstruct the `Factores de Riesgo` and `Recomendaciones` infographic from source-faithful assets/shapes, including original wind/tree, car, and people pictograms, gray/yellow panels, blue recommendation label, border, spacing, and proportions. Generic avatar/person icons or redesigned cards are not acceptable. The recommendation clipboard/check pictogram is a superseded decorative exception and should be absent.
5b. Pages 18-20 must apply the same rule to source diagrams/pictograms; generic symbolic diagrams are temporary implementation scaffolding only and cannot be accepted final output.
5c. Page 18 `Consecuencias de los Incidentes de tránsito` must reconstruct the source gauge/semi-circle diagram with source-faithful component inventory and placement, including the black fatal-victims wedge/label, beige category panels, family/economy/health/institutions icons, pointer, connector lines, colors, spacing, and proportions.
5d. Page 19 `Ejes de trabajo` must reconstruct the source two-column grid of four gray circular fields with exact source pictograms, blue titles, title/circle/text relationships, icon placement/sizes, grid spacing, and proportions.
5e. Recurring document style elements must be governed by source-validated style tokens/guidelines. For blue law/callout blocks, one consistent token set controls background, left stripe, padding, text alignment, font weight, line-height, width behavior, and margin cadence unless the source shows a documented variant.
6. `page-015.jpg` through `page-020.jpg` may be used only as source reference, measurement aid, or input for extracting isolated image assets. They must not be rendered as full-page background/base.
7. The smallest rendered text must be checked against existing study-material text size.
8. The native composition should not be one fixed-width artboard containing every element. Keep ordinary prose responsive, and isolate fixed/pinned layout only to infographic/image regions that need it.

## Validation Requirements

Implementation should add/update focused tests or validators proving:

- Introduction navigation uses source `Índice` headings as page/route entries, not raw PDF pages.
- The four required route/navigation entries exist separately: `Pandemia vial`, `Enfoque ético - ciudadano en la cultura vial`, `¿Accidente o incidente de tránsito?`, and `Plan de seguridad vial de la Ciudad de Buenos Aires`.
- Each required route opens the correct native Russian page and does not collapse the Introduction block into one page or split it into PDF-page navigation.
- Exact source spans for the three added headings are verified from the source `Índice`, manifests, and PDF renders before implementation evidence is accepted.
- For each added heading, content tests verify source title, Russian title, all learning-relevant body text, lists/callouts/statistics, and absence of visible Spanish primary text.
- For each added heading, Playwright route/nav tests verify navigation order, route availability, active heading state, responsive prose, no full-page raster base, no mask/overlay approach, selectable/copyable Russian text, and screenshot evidence.
- Prototype data references `intro-road-pandemic` and page 15.
- Required Russian text includes title, learning-relevant body text, context labels, all visible statistic/infographic labels, and all numbers/percentages; the footnote is verified absent for this section.
- Russian wording is simple while preserving source details.
- Russian wording review proves the text reads naturally in Russian, avoids formal literal translation, uses common/simple phrasing, and specifically covers the three `Plan de seguridad vial` paragraphs about shared responsibility, Vision Zero, and safe-system design.
- Ticket-detail retention checks compare rewritten/simplified Russian content against available local ticket/practice-source material and prove no named entity, numeric fact, year, obligation, definition, condition, list, safety principle, or exception word from ticket-relevant content was removed, weakened, or changed.
- When ticket relevance is unclear, details are preserved or an Architect/Analyst decision is recorded; silent deletion during simplification fails validation.
- Before/after local text-flow checks verify paragraph merges, sentence splits, or sentence combinations preserve local source order, all ticket-critical details, and section/block-level structure. Any accidental global rearrangement of sections, lists, diagrams, or navigation fails validation.
- Any cropped image/icon assets are local, source-derived, not full-page rasters, and cleaned of visible Spanish text.
- Visual pictogram/icon assets are original PDF/source artwork crops or high-fidelity cleaned originals; any vectorization is visually indistinguishable from the source artwork.
- Source images, infographics, pictograms, and diagram artwork have asset metadata proving source region, extraction/crop or reconstruction mode, cleanup scope, and fidelity evidence. Missing source-derived metadata blocks acceptance for visual sections.
- The rejected latest clean SVG replacements are no longer used as the accepted city/pictogram artwork.
- Page 17 `Factores de Riesgo` / `Recomendaciones` tests reject the current native symbolic/card replacement and verify source-derived wind/tree, car, people, panel, border, spacing, and proportion evidence, while ensuring the decorative clipboard/notebook/check icon is not required or reintroduced.
- Page 17 screenshot comparison verifies the risk-factor/recommendation infographic matches the source design while showing no visible Spanish and using selectable Russian text where text was translated.
- Page 18 consequences diagram tests and screenshots reject simplified cards, generic icons, redrawn diagrams, altered colors, changed gauge geometry, missing black wedge/label, missing beige panels, missing family/economy/health/institutions icons, missing pointer, missing connector lines, and missing source proportions.
- Page 18 consequences overlay tests reject top- or bottom-pinned category text, including `ИНСТИТУЦИИ`; `ЗДОРОВЬЕ` label backing that is smaller/shorter than the Russian text, overflows, or has mismatched/broken corners; `ПОГИБШИЕ` typography that differs from the other category labels; and any opaque rectangular cleanup/backing artifact under center `ДОРОЖНЫЙ ИНЦИДЕНТ` that covers the source circle/ring.
- Page 18 Russian label boxes may widen only when Russian text requires it and only if source label height, corner radius/shape, vertical centering, and connector relationships remain source-like.
- Page 18 label-artifact regression tests must fail visible seams, tabs, hard-edged patches, or color-matched blocks around `СЕМЬЯ И ЭКОНОМИКА`, `ЗДОРОВЬЕ`, `ИНСТИТУЦИИ`, `ПОГИБШИЕ`, connector lines, and the center ring/circle. Tests must prove cleanup is glyph-local/inpainted and not achieved by broad block masks or partial opaque label plates.
- Page 18 label vertical-centering tests must compare rendered text ink against the visible source label backing/pill, not the CSS overlay rectangle. `ИНСТИТУЦИИ` and `ПОГИБШИЕ` must be checked as named regressions before acceptance can be restored.
- Page 18 checker results may not mark page 18 label cleanup complete until a fresh browser screenshot of the current preview is visually compared with the original/source crop and the user-marked artifact classes are explicitly absent.
- Page 19 work-axis tests and screenshots reject generic avatars/icons and verify four original gray circular fields, exact walking/pedestrian, megaphone, officer/police, and group/people pictograms, blue title style, title/circle/text placement, two-column grid spacing, and proportions.
- Pages 18-20 work-axis/consequences diagram tests and screenshots reject generic icon replacements when source pictograms/infographics exist.
- Style-guideline tests/evidence verify recurring style tokens exist and repeated block types use them consistently. Blue law/callout blocks must match background, left accent stripe, padding, text alignment, font weight, line-height, width behavior, and margin cadence unless a source-backed variant is documented.
- A post-completion visual source-fidelity checker runs for the Introduction pages and produces a pass/fail report with artifact evidence, including source screenshot(s), Russian screenshot(s), component/bounding-box metadata, asset presence/source-region checks, style-token checks, and explicit comparison notes.
- The visual checker fails validation and returns work when source images, infographics, pictograms, layout, formatting, or style are lost, modified, simplified, replaced, misaligned, recolored, blurred/stretched, or otherwise not source-faithful.
- The checker explicitly covers previously reported regression classes: page 17 risk-factor pictograms/recommendation block, page 18 consequences/gauge diagram, page 19 work-axis circular pictograms, blue callout alignment/style, and full-document navigation shell.
- Full page reference asset is reference-only and not rendered as background/base.
- The rendered section is cropped/reframed to the meaningful content block and does not include full-page canvas whitespace.
- Desktop screenshots show a readable block with normal web margins/density and no tiny centered island.
- Mobile screenshots show the first view begins on meaningful section content, not blank whitespace; any pan/scroll is limited to fixed infographic needs.
- `heading`, `intro`, and bottom learning conclusion/body prose fit the in-app/narrow viewport and mobile viewport without horizontal clipping/overflow or dependence on horizontal scrolling.
- Any horizontal scrolling container excludes ordinary prose and is limited to fixed infographic/image blocks.
- Ordinary Russian text and meaningful statistic labels are real DOM/SVG text, not baked into images.
- `heading`, `intro`, bottom learning conclusion/body, and statistic labels have computed `user-select` and `pointer-events` values that allow selection/copy interaction.
- Browser selection/copyability checks can select representative prose and statistic labels, or an explicitly documented equivalent accessibility/selection check passes.
- Mask/overlay translation patterns are absent.
- Scale controls and context buttons are absent.
- Visible source/provenance details that are not ticket-needed are absent.
- Footnote, page marker/page number, and blue upper-left book motif are absent for this section.
- Smallest rendered text is comparable to study-material text.
- Intro/body explanatory text is approximately the same size as ordinary `Материалы` body text.
- Heading and intro/body computed font family, weight, line-height, and spacing choices are recorded and match the documented readability-first typography decision.
- Infographic labels/numbers/cards computed font family, weight, line-height, and letter spacing are recorded and match the documented readability-first typography decision.
- Context labels have consistent computed weight across their text, or a documented symmetric two-level treatment for both labels; partial city-name-only bolding is absent.
- Typography evidence records the identified embedded source fonts (`GothamRounded-*` and `HelveticaWorld-Regular`) as context and records why the final stack prioritizes Russian readability over the rejected rounded imitation.
- Tests verify the primary Pandemia stack no longer starts with Avenir or `SFNSRounded`/`SF Compact Rounded`/`SF Pro Rounded`; Avenir/Helvetica/rounded fonts may appear only as later fallbacks unless a later explicit decision changes this.
- Tests verify `Дорожная пандемия` is not forced into a two-line heading at normal desktop width by a narrow fixed/max width.
- No remote font dependency is used; any added font asset has acceptable licensing/source recorded.
- Normal prose paragraphs contain no forced line breaks inserted to mimic PDF line wrapping.
- City statistic circle icons are fully visible and do not sit under text or opaque backgrounds.
- City statistic circle icons use original motorcyclist/pedestrian/car artwork crops or high-fidelity cleaned originals, not generic new icons.
- The `8 из 10` pictogram group is semantically accurate and source-faithful: 8 male pictograms and 2 female pictograms preserving the original silhouette/style.
- Lower city row top alignment matches the source: `people-grid-icon` and `male-victims-panel`/`male-victims` start together, and `people-pair-icon` and `age-range-panel`/`age-range` start together, within a small tolerance.
- Lower city row source spacing is checked: each left pictogram block has a source-like horizontal gap to its corresponding gray statistic panel, not a near-zero gap.
- Lower city gray panel proportions are checked with bounding-box ratios; panels are not much taller than their source role and do not create large empty containers.
- Lower city gray panel text padding/vertical balance is checked: top and bottom internal padding are source-like or visually balanced, and text is not pinned to the panel top.
- Lower city full-row geometry is checked: panel vertical center, bottom edge, and height are proportionate to the left pictogram group and cannot pass based only on top-edge proximity.
- Lower city gray panel empty-space ratio and bottom whitespace are bounded relative to both the panel and the text block.
- Grouped non-regression checks run after any upper/global card fix and cover all previously accepted visual feedback, especially lower city row geometry/density.
- Upper global card density is checked with bounding-box ratios and screenshot review; gray card empty space is source-like and not excessive.
- Upper global card font rhythm is checked independently of the section-wide font stack; accepted font evidence is not enough if card number/label rhythm remains visibly off.
- Airplane/stadium icon-to-blue-strip attachment/cap geometry is checked with bounding boxes and screenshots; icons must read as attached/linked to the strip, not detached.
- Blue-strip cap geometry is checked with bounding boxes, computed styles, or screenshot review proving left/right strip portions remain rectangular and the rounded cap/rise is localized near the icon center.
- Icon/cap/strip seam is checked: no white gap exists between pictogram/cap and the blue strip/card top.
- Paired global cards are checked for equal panel heights and aligned bottom edges.
- Global gray-card empty-space ratio and text top/bottom padding are checked so text does not sit above a large unused lower area.
- Automated layout checks verify no text overflow and no element overlap.
- Automated overlap checks cover infographic/circle text versus icon images, circles/indicators versus below icons/rows, and bottom paragraph versus any remaining lower-page elements.
- Runtime prototype code/style has no iframe/object/embed/PDF.js/fetch/remote asset/backend/live-AI patterns.
- Playwright checks verify no visible primary Spanish text and no rendered full-page background image base.

## Acceptance Criteria

1. Four local Introduction surfaces are accessible in the app as separate heading-based routes/navigation entries: `Дорожная пандемия`, `Этико-гражданский подход в дорожной культуре`, `Авария или дорожный инцидент?`, and `План дорожной безопасности города Буэнос-Айрес`.
1a. Navigation follows the source `Índice` headings, not raw PDF pages; `Plan de seguridad vial de la Ciudad de Buenos Aires` is one page/route even when its source span covers multiple PDF pages.
1b. The three added headings have exact page spans, source text, image/layout needs, and route ids verified from manifests/PDF renders before build evidence is accepted.
1c. The integrated Russian interactive manual is reached through the main app destination labeled `Руководство`; a separate user-facing `Руководство 4R` destination is absent.
1d. Direct hashes `#pandemia-vial`, `#intro-enfoque-etico`, `#intro-accidente-incidente`, and `#intro-plan-seguridad-vial` open the matching child content inside `Руководство` with correct active group/child navigation state.
2. Each page is a native Russian HTML/CSS/SVG rebuild of its relevant PDF fragment, not a redesigned article and not a flattened page preview.
3. The full source PDF page image is not rendered as background/base.
4. No mask-over-Spanish-text or Russian-overlay-on-original-page-image approach remains.
5. The smallest rendered text is comparable to Cabadrive study-material text.
5a. Intro/body explanatory text is approximately the same size as ordinary body text in `Материалы`.
5a.1. Heading/body typography uses a deliberate modern UI readability stack rather than the rejected SF-rounded/GothamRounded-like attempt, Avenir-first ordering, or untuned default styling.
5a.2. Typography uses local/offline fonts only; the embedded source font identity is documented as context, and the final readable stack or acceptable local font asset is documented with rationale.
5a.3. Computed heading and intro/body font family, weight, line-height, letter spacing, paragraph spacing, and text block width are tuned and evidenced with screenshots.
5a.4. Computed infographic label/number/card typography is tuned and evidenced, including blue-strip and gray-panel text.
5a.5. `В мире` and `В городе Буэнос-Айрес` context labels do not use inconsistent partial emphasis; if any two-level emphasis is used, both labels use the same logic.
5a.6. Avenir-first and SFNSRounded-first typography are rejected; tests prove the primary stack starts with the modern UI readability stack or an explicitly accepted local readable UI font.
5a.7. The `Дорожная пандемия` heading does not break into two lines at normal desktop width due to a forced/narrow heading container.
5b. Normal intro/body paragraphs are adaptive DOM text and contain no manual PDF-style line breaks inside paragraph content.
5c. The web section is cropped/reframed around the meaningful `Pandemia vial` content block and does not show a full PDF page canvas with huge blank margins.
5d. Desktop shows the block at readable scale and normal web density without a tiny centered island; mobile starts on content and avoids blank whitespace before the section.
5e. `heading`, `intro`, and bottom learning conclusion/body prose wrap in responsive web flow and do not horizontally clip or require horizontal scrolling at in-app/narrow and mobile viewport widths.
5f. Fixed-width/pinned layout is scoped to infographic/image blocks only; the prototype is not one monolithic fixed-width canvas containing prose.
5g. `heading`, `intro`, bottom learning conclusion/body, and meaningful statistic labels are selectable/copyable text with no `user-select: none`, `pointer-events: none`, or equivalent selection/copy prevention.
5h. Russian text is not rasterized into source crops or a preview image except for non-text artwork; the section feels like a web document, not an image preview.
6. Poor hand-redrawn SVG icons/images and the latest rejected clean SVG replacements are replaced by original PDF/source artwork crops or visually indistinguishable high-fidelity cleaned originals.
7. Cropped image/icon assets contain no visible Spanish text when used.
7a. No newly designed generic/reconstructed SVG pictograms/icons replace the source artwork when they visibly differ from the PDF.
7b. City statistic circle icons are fully visible and separate from circle labels/text/backgrounds, and use original motorcyclist/pedestrian/car artwork crops or high-fidelity cleaned originals.
7c. The `8 из 10` pictogram group is visually and semantically accurate: 8 male pictograms and 2 female pictograms, preserving the original silhouette/style.
7d. Lower city gray statistic panels align vertically with their corresponding left pictogram blocks: `people-grid-icon` with `male-victims-panel`/`male-victims`, and `people-pair-icon` with `age-range-panel`/`age-range`.
7e. Page 17 risk-factor/recommendation visual is rebuilt from source-faithful artwork and geometry; native generic cards/icons are not accepted.
7e.1. Page 17 `Factores de Riesgo` risk cards match the source card style: three long rounded panels, light gray for Ambient/Ambiental and Vehicle/Vehicular, yellow for Human/Humano, rounded right corners, integrated circular/lobed left edge, source pictogram centered and fully visible inside the lobe, source-like title/body positions, spacing, and proportions.
7e.2. Page 17 risk cards have no square/rectangular icon crops, visible crop-box edges, clipped icons, awkward partial fragments, flat-rectangle-only panels, or missing circular lobes.
7e.3. Page 17 `Recomendaciones` omits the decorative clipboard/check icon entirely; tests must not require it. The remaining blue label, border, spacing, and callout alignment stay source-faithful, unclipped, readable, and free of clipped/reintroduced decorative icon fragments.
7f. Pages 18-20 diagrams do not ship accepted final generic pictogram/card replacements when source diagrams contain specific artwork.
7g. Page 18 consequences diagram is source-faithful and complete: original gauge/semi-circle geometry, black fatal-victims wedge/label, beige category panels, family/economy/health/institutions icons, pointer, colors, spacing, connector lines, and proportions are present.
7g.1. Page 18 consequences diagram is visually recognizable as the source composition, not merely assembled from source-derived pieces: the semi-circle/gauge continuity, aligned beige sectors, gray outer arc, dark center ring, pointer, black fatality wedge and label, category labels, connector lines, and relative positions/spacing/proportions match the source within documented screenshot/bounding-box tolerances.
7g.2. Page 18 has no Russian label overlaps with diagram shapes, pictograms, connector lines, or other labels; no broken seams, clipped fragments, stretched crops, white/gray chunks over arcs, disconnected source fragments, misplaced black wedge, or category text collision remains.
7g.3. Piecewise reconstruction is rejected for page 18. The accepted strategy is the complete cleaned original PDF infographic crop for non-text artwork plus selectable Russian text layers in source-faithful positions, with no visible Spanish and no full-page raster.
7h. Page 19 work-axis diagram is source-faithful and complete: original four gray circles, exact walking/pedestrian, megaphone, officer/police, and group/people pictograms, blue title style, title/circle/text placement, two-column grid spacing, and proportions are present.
7h.1. Page 19 axis pictograms are complete and unclipped inside their gray circles at desktop, narrow, and mobile widths: no cropped quadrants, cut-off icon tips, visible square crop-box corners, parent-overflow clipping, tight natural crop bounds, or icon/background coverage.
7h.1a. Page 19 axis source crops include enough transparent/source padding around each pictogram that the natural icon content does not touch crop bounds; a visibly clipped source crop fails even if the rendered image element is contained.
7h.2. Page 19 keeps the source four circle/title/text items in a two-column grid on desktop; responsive stacking is allowed only when needed and must preserve full icons, source-like spacing, and title/circle/text relationships.
8. All Russian text is semantic DOM/SVG text and complete for each source heading page.
9. Russian wording is simple, natural, and precise, preserving all meaningful details, numbers, and ticket-relevant source concepts; non-ticket provenance stays internal. The text must not read like a formal literal translation.
9a. Simplification/shortening passes only when a ticket-detail retention check proves no exam-ticket question/answer/explanation information was removed, weakened, or changed. Compare against local ticket/practice-source material where available, especially named entities, numeric facts, years, obligations, definitions, conditions, lists, safety principles, and exception words; preserve unclear details or record an Architect/Analyst decision.
9b. Local text-flow changes are accepted only when before/after review proves the same local order and meaning are preserved. Adjacent paragraph merges, complex-sentence splits, and short-sentence combinations are allowed; global section/list/diagram/navigation rearrangement is not.
10. `Вписать` / `100%` controls are absent.
11. `Мировой контекст` / `Контекст города` buttons are absent.
12. Source/provenance details not needed for ticket solving are absent from the visible learning document.
13. The bottom paragraph contains only the learning-relevant conclusion about all society working together for road safety.
14. The footnote is absent.
15. The page marker/page number is absent.
16. The blue upper-left semicircle/corner book motif is absent.
17. Spanish source text is not visible as primary content anywhere in the composition.
18. Text does not overflow its boxes and visual/text elements do not overlap.
19. Specific overlap regressions are guarded: circle/infographic text does not collide with icon crops, circles/indicators do not collide with below icons/rows, and bottom paragraph/lower-page content does not collide with any footnote/page-marker remnants.
20. The prototype is local-first and uses no runtime PDF viewer, PDF embed, remote asset fetch, backend, or live AI.
21. Tests cover content coverage for all four pages, forbidden patterns, local assets, source-derived asset metadata/crops, route availability, source-`Índice` navigation, readable scale, readability-first typography with rejected font-stack guards, natural desktop heading wrap, native visual hierarchy, selectable/copyable Russian prose and statistic labels, no full-page raster base, no full-page whitespace canvas, no tiny centered island, responsive prose with no horizontal clipping/scroll at narrow and mobile widths, infographic-only horizontal scrolling where needed, no mask/overlay approach, removed controls/buttons, omitted source/book-layout clutter, page 17 risk-factor/recommendation source-fidelity, page 17 risk-card lobe geometry, page 17 recommendation callout alignment without clipboard icon, page 18 category-label/center-artifact blockers, page 19 axis icon clipping/crop-box artifacts, pages 18-20 diagram non-regression against generic replacements, automated overlap/bounding-box checks, screenshot review, and absence of old UI patterns.
22. Implementation starts a local dev or preview server after completion and provides Orchestrator/user a URL plus screenshot/description for every Introduction page approval route.
23. Reusable style guidelines are current: each recurring style element has recorded tokens/guidelines and repeated instances validate against them. Blue law/callout blocks do not have accidental alignment/style inconsistency.
24. Navigation tests cover route/hash behavior, direct links to the four implemented Introduction children, active group/child state, keyboard interaction, accessible names/labels, mobile/narrow usability, and placeholder behavior for unimplemented full-IA entries.
25. Main-app navigation tests verify the visible guide destination is `Руководство`, legacy `Руководство 4R` tab/link text is not exposed as a separate destination, hash routing lands inside `Руководство`, mobile navigation remains usable, and duplicate manual destinations are rejected.
26. A post-completion visual source-fidelity checker/harness exists for these Introduction pages, is run before Implementation Agent claims done, and records a pass/fail report with source screenshots, Russian screenshots, source-derived asset/component metadata, bounding-box/layout/style evidence, and explicit failures for lost/modified source artwork, generic icon replacement, lost formatting/layout/style, inconsistent style tokens, or duplicate/non-scalable navigation shell regressions.
26a. The checker fails when source-derived pieces are present but assembled into a distorted, unrecognizable, or non-source-like composition, including the reported page 18 failure class with floating fragments, broken gauge/arc continuity, misaligned beige sectors, white/gray chunks over arcs, misplaced black wedge, label/connector misalignment, and category text collisions.
26b. The checker fails when source-derived assets exist but the visible composition clips, crops, covers, or misframes them, including page 17 square crops inside risk-card lobes, a reintroduced/clipped page 17 recommendation clipboard, page 19 cropped axis pictograms, visible square crop boxes inside circles/lobes, parent `overflow:hidden` cuts, missing lobe/card/circle geometry, or source-like spacing/alignment loss.
26c. The checker fails page 18 when Russian label text is top- or bottom-pinned, a label backing is shorter than its text, label corners/radii are mismatched or broken, category-label typography differs across labels, or an opaque rectangle/background/mask remains visible in the center circle behind `ДОРОЖНЫЙ ИНЦИДЕНТ`.

## Negative Scenarios

- Navigation is based on PDF pages (`page-016`, `page-017`, etc.) instead of source `Índice` headings.
- Navigation is a flat post/page list, an Introduction-only horizontal tab/card strip, or another one-off control that cannot scale to the full source `Índice` structure.
- The Introduction headings are collapsed into one long page rather than separate route/navigation entries inside the full hierarchy.
- `Plan de seguridad vial de la Ciudad de Buenos Aires` is split into raw PDF page routes instead of remaining one heading page.
- Unimplemented chapters/annexes create fake content pages instead of pending/disabled/collapsed navigation states.
- Active Introduction routes are not discoverable within the full hierarchy, or active group/child state is missing.
- Navigation is unusable at mobile/narrow widths, lacks keyboard access, or lacks accessible labels/current-state semantics.
- The app exposes both `Руководство 4R` and the new interactive `Руководство` document as separate user-facing destinations.
- The new interactive document is mounted as a prototype/experimental/Introduction-only block instead of replacing the current guide destination.
- The main app navigation still labels the current guide destination `Руководство 4R` after this feature.
- `#pandemia-vial`, `#intro-enfoque-etico`, `#intro-accidente-incidente`, or `#intro-plan-seguridad-vial` open outside the `Руководство` section, fail to open, or do not mark the correct active child.
- Any of the three added Introduction headings is implemented before exact source span, source text, image/layout needs, and index label are verified from manifests/PDF renders.
- Added mostly textual headings are forced into a fake PDF canvas instead of normal responsive web prose with source hierarchy preserved.
- Added headings with visual blocks use generic/redrawn assets or rasterized Russian text instead of source-derived artwork plus selectable DOM/SVG Russian text.
- The implementation uses `page-015.jpg` or another full PDF-page raster as the visible page background/base.
- The native implementation still renders a full PDF page-sized white canvas with a small content fragment and huge blank top/side/bottom whitespace.
- Desktop shows the section as a tiny centered island instead of a readable normal-density web section.
- Mobile opens on blank whitespace or requires panning through blank page area before reaching content.
- The section is reframed but remains a single fixed-width canvas that clips or horizontally scrolls ordinary prose in a narrower in-app browser window.
- `heading`, `intro`, or bottom learning conclusion/body prose is inside a horizontal scroller or overflows/clips horizontally at narrow or mobile widths.
- Horizontal scroll/pan is required for ordinary prose rather than only for fixed infographic/image blocks.
- The Russian heading, intro, bottom body/conclusion, or meaningful statistic labels are not selectable/copyable.
- Text elements set `user-select: none`, `pointer-events: none`, or equivalent selection blockers for ordinary prose or statistic labels.
- Meaningful Russian text is baked into images/assets so the section behaves like an image preview.
- The lower city gray `8 из 10` or `49%` rows start lower/higher than their matching left pictogram blocks.
- Tests only check no-overlap for lower city rows but do not verify source top alignment.
- Heading/body typography keeps an untuned default look instead of the deliberate readability-first UI stack and hierarchy.
- Infographic cards, numbers, blue strips, or gray boxes keep untuned default typography instead of the deliberate readability-first section system.
- Avenir remains the first/primary family in the Pandemia stack after the user's font rejection.
- `SFNSRounded`, `SF Compact Rounded`, or `SF Pro Rounded` remains the first/primary family in the Pandemia stack after the user's SF-rounded/Gotham-like font rejection.
- The heading `Дорожная пандемия` is forced into two lines at normal desktop width by a narrow max-width, `ch` width, or equivalent constraint.
- Implementation claims font fidelity without documenting the embedded source font identity and the later readability-first decision.
- A remote font is required to render the prototype.
- Font choice, weights, letter spacing, line-height, paragraph rhythm, or text block width are not documented or visually checked.
- Only `Буэнос-Айрес` is bolded in the city context label while `В мире` has no analogous emphasis.
- `::first-line` or similar styling creates unintended partial bolding in context labels.
- The implementation masks Spanish text and places Russian DOM text above the original page image.
- The implementation uses overlay translation on top of the Spanish source.
- Poor SVG icons remain even though cleaned original crops would be more faithful.
- The latest rejected clean SVG replacements remain in use as accepted artwork.
- Newly designed generic/reconstructed SVG pictograms/icons replace original artwork and visibly differ from the PDF.
- Page 17 `Factores de Riesgo` / `Recomendaciones` is represented by generic native symbolic cards, generic avatar/person icons, or redesigned DOM/CSS pictograms instead of source-faithful wind/tree, car, people, panel, border, spacing, and proportion reconstruction.
- Page 17 risk cards are rendered as flat rectangles without integrated circular/lobed left edges, or with square/rectangular icon crops stuck to the left.
- Page 17 risk-card icons are clipped, awkwardly cropped, not centered in the lobe, show visible crop-box edges, or sit outside/under the intended circular lobe.
- Page 17 `Recomendaciones` reintroduces the decorative clipboard/check icon after the latest user decision to remove it, or leaves any clipped/degraded fragment of that icon visible. The callout should be aligned, unclipped, and source-faithful enough without the decorative icon.
- Page 17 `Factores de Riesgo` pictogram alpha center does not align with the circular-lobe center, alpha bounds occupy a too-small/too-large fraction versus the source, car diagonal support is cut, people lower silhouettes are cut, or all icons pass by sharing one CSS box despite visibly different framing.
- Pages 18-20 work-axis/consequences diagrams retain generic icon replacements as accepted final output when source pictograms/infographics exist.
- Page 18 `Consecuencias de los Incidentes de tránsito` is represented by simplified cards, generic icons, redrawn/separate diagram geometry, altered colors, cropped-away components, blurred/stretched artwork, or a text-only substitute instead of the source gauge/semi-circle diagram.
- Page 18 source components are missing: black fatal-victims wedge/label, beige category panels, family/economy icon, health icon, institutions icon, pointer shape, connector lines, or source spacing/proportions.
- Page 18 source-derived pieces are present but assembled into a distorted, unrecognizable, or non-source-like diagram.
- Page 18 has icon fragments floating in the wrong place, white/gray chunks covering or breaking the arcs, a black wedge covering text, labels not aligned to connector geometry, category text colliding with the diagram, broken gauge/arc seams, clipped/stretched fragments, or mismatched overall geometry.
- Page 18 center-circle text has a protruding rectangle/background under `ДОРОЖНЫЙ ИНЦИДЕНТ`, or any text backing extends outside the circular field, covers the ring, covers the pointer, or changes center-circle geometry.
- Page 18 category label text is vertically off-center inside its source label box, including the concrete rejected case where `ИНСТИТУЦИИ` sits too high/low instead of centered.
- Page 18 `ЗДОРОВЬЕ` label box has mismatched corners, distorted radius/shape, incorrect height, or a DOM/background overlay that changes the source label shape instead of preserving it.
- Page 18 DOM overlays/backgrounds visually change source label shapes, ring, center circle, connector lines, or pointer.
- Page 19 `Ejes de trabajo` is represented by generic avatars/icons, approximate symbols, different circle/grid geometry, altered icon sizes/placement, or inconsistent blue title/text placement instead of the source four-circle pictogram grid.
- Page 19 axis pictograms are cropped, show only a quadrant/partial icon, have cut-off icon tips, visible square crop-box corners inside gray circles, parent-overflow clipping, or icon/background coverage.
- Page 19 loses the source desktop two-column circle/title/text composition without a responsive need, or a responsive stacked variant preserves text while clipping/misframing the pictograms.
- Page 19 work-axis circles have mismatched diameters, top-row or bottom-row center-y drift, left/right column center-x drift, inconsistent gaps, title-wrapping-driven circle drift, or desktop masonry-style uneven placement.
- Repeated blue callout/law blocks use inconsistent alignment, padding, width, font treatment, stripe, background, or margin cadence without a source-backed style variant.
- A new recurring style element is implemented without adding it to the style guideline and validating against the source.
- Infographic Russian text is implemented by masking/covering the Spanish page wholesale or by a full-page raster instead of local text-free source crops/source-faithful shapes plus selectable Russian text layers.
- Visual sections lack source-derived asset metadata/crops and screenshot comparison evidence.
- Vectorized artwork is used without evidence that it is visually indistinguishable from the source.
- Cropped assets retain visible Spanish text.
- The smallest text remains much smaller than study-material text.
- Intro/body explanatory text remains smaller than ordinary `Материалы` body text.
- Normal paragraph text contains forced line breaks to mimic the PDF layout.
- City circle icons are hidden, covered, clipped, visually merged with text/backgrounds, or use generic new icons instead of original/high-fidelity cleaned source artwork.
- The `8 из 10` visual does not accurately show 8 male pictograms and 2 female pictograms or changes the original silhouette/style.
- `Вписать` / `100%` controls remain visible.
- `Мировой контекст` / `Контекст города` buttons remain visible.
- Visible source/provenance text not needed for ticket solving remains in the learning document.
- The footnote remains visible.
- The page marker/page number remains visible.
- The blue upper-left semicircle/corner motif remains visible.
- Russian translation becomes bureaucratic/formal and harder to understand without adding source detail.
- Russian text reads like a formal literal translation instead of natural Russian learning prose, especially in the `Plan de seguridad vial` paragraphs about shared responsibility, Vision Zero, or safe-system design.
- Simplification removes, weakens, or changes information that appears in local exam ticket questions, answers, explanations, or practice-source material.
- Implementation drops a named entity, numeric fact, year, obligation, definition, condition, list item, safety principle, or exception word because its exact ticket relevance was unclear, without preserving it or recording an Architect/Analyst decision.
- Local text-flow edits accidentally rearrange section/block order, list order, diagram order, navigation order, or source heading order.
- Before/after local text-flow evidence is missing for merged paragraphs, split complex sentences, or combined short sentences.
- The section text or statistic labels are summarized, shortened, or omitted.
- Implementation claims completion without running and recording the required visual source-fidelity checker/harness and pass/fail report.
- The visual checker relies only on an AI-written summary without source/Russian screenshots, component metadata, bounding-box/layout/style evidence, asset presence/source-region checks, and explicit pass/fail output.
- The checker would pass despite the previously reported regression classes: page 17 generic risk-factor/recommendation replacements, page 18 simplified/misaligned gauge diagram, page 19 generic circular pictograms, inconsistent blue callout style/alignment, or a flat/duplicate/non-scalable navigation shell.
- The checker passes page 18 because individual crops/assets exist even though the assembled diagram is visibly distorted, non-source-like, overlapping, fragmented, or unrecognizable compared with the source.
- The checker passes page 17/page 19 because individual crops/assets exist even though visible icons are clipped, covered, square-cropped, placed outside the intended circle/lobe, or arranged in non-source-like card/circle geometry.
- Text inside infographic/circles collides with icon images.
- Circles or indicators collide with below icons/rows.
- Bottom paragraph collides with footnote/page marker or other lower-page elements.
- Tests rely only on DOM/content checks without automated overlap/bounding-box evidence and screenshot review.
- The prototype links users to the existing full manual page list and calls that the prototype.
- The app requires internet/network/runtime PDF rendering to show the prototype.

## Review Requirements

Review Agent should verify:

- Scope extension compliance: feature remains limited to the four listed Introduction index headings and does not become a whole-document conversion.
- Navigation model: route/sidebar/document navigation is derived from the full source `Índice` hierarchy, not raw PDF pages, with support entries, chapter/annex groups, and child entries; each implemented Introduction heading is a separate navigable child.
- Full-IA placeholders: unimplemented future chapters/annexes are pending/disabled/collapsed or otherwise non-content placeholders, not fake pages.
- Navigation labels/metadata: user-facing labels are Russian, while source Spanish labels and page refs are retained in metadata and not rendered as content-page provenance clutter.
- Navigation interaction: route/hash behavior, active group/child state, keyboard/a11y labels, and mobile/narrow usability are tested.
- Main app placement: the interactive Russian manual is the user-facing `Руководство` destination, the legacy `Руководство 4R` entry/view is not exposed as a separate manual destination, and the full `Índice` hierarchy is nested inside `Руководство`.
- Deep-link compatibility: existing hashes `#pandemia-vial`, `#intro-enfoque-etico`, `#intro-accidente-incidente`, and `#intro-plan-seguridad-vial` open the correct child content inside `Руководство` with active group/child state on desktop and mobile.
- Russian adaptation: wording is natural, common, simple Russian rather than a formal literal translation, with special review of the three `Plan de seguridad vial` paragraphs about shared responsibility, Vision Zero, and safe-system design.
- Ticket-detail retention: simplification is checked against available local ticket/practice-source material and does not drop or weaken named entities, numbers, years, obligations, definitions, conditions, lists, safety principles, or exception words. Unclear relevance is preserved or recorded for Architect/Analyst disposition.
- Local text-flow validation: reviewers/checkers compare before/after local transformations and verify preserved local order, preserved ticket-critical details, and no accidental global structure change.
- Source-span verification: each added heading has source span, text, image/layout needs, and reference render evidence recorded before implementation acceptance.
- Section strategy: mostly textual headings use normal responsive prose/layout preserving source hierarchy, while headings with visual blocks use source-derived/cleaned assets and selectable Russian DOM/SVG text.
- Native rebuild: structural HTML/CSS/SVG plus isolated assets only, not a full-page image background/base.
- Rejected approach absence: no page-image-as-background, no mask-over-Spanish-text, no Russian overlay translation.
- Section framing: the meaningful `Pandemia vial` content block is cropped/reframed as a normal web section, not placed inside a full PDF page canvas with large blank margins.
- Responsive density: desktop is readable without a tiny centered island; mobile starts on content and only scrolls/pans for fixed infographic needs.
- Responsive prose: `heading`, `intro`, and bottom learning conclusion/body are not clipped by a fixed-width canvas and do not require horizontal scrolling at in-app/narrow or mobile widths.
- Scroll scope: horizontal pan/scroll, if present, is limited to fixed infographic/image blocks.
- Selectable text: ordinary Russian text and meaningful statistic labels are real selectable/copyable DOM/SVG text, not image-preview pixels.
- Interaction CSS: representative prose and statistic labels do not disable `user-select` or `pointer-events`, and selection APIs can select/copy them or equivalent evidence is recorded.
- Lower city alignment: top edges of `people-grid-icon` and `male-victims-panel`/`male-victims` match, and top edges of `people-pair-icon` and `age-range-panel`/`age-range` match, within tolerance.
- Lower city spacing/density: source-like horizontal gap exists between each pictogram block and gray panel; gray panel height/width proportions and internal text padding/vertical balance are source-like.
- Lower city full-row geometry: panel top/center/bottom/height are proportionate to the corresponding icon group and panel empty-space/bottom whitespace is bounded; top-edge checks alone are insufficient.
- Visual non-regression grouping: fixes to one infographic region rerun checks for all previously accepted visual feedback, including lower rows.
- Global card density: upper gray statistic cards do not have excessive empty space, and statistic number/label rhythm is source-like.
- Icon-strip attachment: airplane/stadium crops appear attached to the blue strip/cap, not detached, with bounding-box and screenshot evidence.
- Local cap geometry: airplane/stadium attachment uses a localized center cap/rise on an otherwise rectangular strip, not a full-width rounded pill/dome.
- No seam: icon/cap/strip/card top read as one connected unit with no white gap.
- Paired global-card geometry: airplane and stadium cards have equal panel heights and aligned bottom edges.
- Global-card empty-space control: gray panels use bounded empty-space ratio and source-like text padding.
- Readability-first typography: heading/body font choice, weight, letter spacing, line-height, paragraph spacing, and text block width use the modern UI readability stack while preserving source hierarchy.
- Infographic typography fidelity: statistic cards, numbers, blue strips, gray boxes, and labels use the same readability-first section system and computed metrics; card-specific source rhythm is still visually checked.
- Statistic card typography: current accepted font work is insufficient if card-specific rhythm still visibly differs from the source.
- Context label consistency: `В мире` and `В городе Буэнос-Айрес` use consistent emphasis; no city-name-only bolding and no asymmetric `::first-line` styling.
- Font context: source embedded fonts are recorded before font choice, and the final decision explains why readable Russian UI typography supersedes source-font mimicry here.
- Rejected stack guards: Avenir-first and SFNSRounded/SF Compact Rounded/SF Pro Rounded-first stacks are absent unless a later explicit decision changes the typography direction.
- Heading wrap guard: `Дорожная пандемия` is not artificially broken at normal desktop width by a forced narrow heading container.
- Font sourcing: fonts are local/offline, with licensing/source or closest-alternative rationale documented; no remote font dependency.
- Readability: smallest text comparable to existing study-material text.
- Body readability: intro/body text approximately matches ordinary `Материалы` body text.
- Paragraph flow: normal prose wraps by container width, without forced PDF-line breaks.
- Asset fidelity: visual assets use original PDF/source artwork crops or high-fidelity cleaned originals; generic/reconstructed SVG replacements are rejected when visibly different. Page 18 has a stricter rule: use the complete original infographic crop as the non-text visual layer, cleaned only of source text.
- Vectorization bar: any vectorized pictogram/icon is visually indistinguishable from the original and has screenshot/source comparison evidence.
- Page 17 source fidelity: `Factores de Riesgo` and `Recomendaciones` preserve the source wind/tree, car, people, gray/yellow panels, blue label, border, spacing, and proportions; generic person/avatar icons and generic cards are absent, and the decorative clipboard/check icon is omitted.
- Page 17 risk-card geometry: three source-like long rounded panels are present with integrated circular/lobed left edges, correct gray/yellow panel roles, rounded right corners, fully visible centered pictograms inside lobes, source-like title/body positions, and no square crop artifacts.
- Page 17 recommendation callout guard: tests must not require clipboard/check icon presence. The blue label/border/callout remains aligned, unclipped, source-faithful enough, and free of any partial/reintroduced decorative icon fragments.
- Page 17 lobe alpha-centering guard: risk pictogram visual alpha bounds, not just the image element box, are centered in each circular lobe and occupy source-like circle fractions; car diagonal support and people lower silhouettes remain complete unless the source intentionally frames them that way.
- Pages 18-20 diagram non-regression: work-axis/consequences diagrams preserve source pictograms/infographic artwork and do not accept generic icon/card replacements.
- Page 18 source fidelity: consequences diagram preserves the gauge/semi-circle geometry, black fatal-victims wedge/label, beige category panels, family/economy, health, and institutions icons, pointer shape, colors, spacing, connector lines, and proportions.
- Page 18 source-composition fidelity: consequences diagram remains visually recognizable as the source, with continuous gauge/arc geometry, aligned beige sectors, gray outer arc, dark center ring, pointer, black fatality wedge/label, category labels, connector lines, and source-like relative positions/spacing/proportions.
- Page 18 no-distortion guard: screenshots and bounding boxes fail floating icon fragments, white/gray chunks over arcs, black wedge/text collision, label/connector misalignment, category text collision, broken seams, clipped fragments, stretched crops, disconnected fragments, and mismatched geometry.
- Page 18 full-source-crop mandate: `Consecuencias de los Incidentes de tránsito` must be built from one complete original PDF infographic crop for the visual layer, with Spanish/source text removed or cleaned from that crop, then Russian DOM/SVG text positioned over it. Do not redraw/reconstruct arcs, sectors, pointer, black wedge, label boxes, connector lines, pictograms, geometry, proportions, or colors with CSS/SVG/native shapes.
- Page 18 checker strictness: the visual checker fails if the page 18 asset is partial, componentized, redrawn, reconstructed, materially different from the source crop, missing/cropping any original diagram component, or retaining visible Spanish/source text.
- Page 18 center overlay guard: `ДОРОЖНЫЙ ИНЦИДЕНТ` is placed inside the original circular field with no visible protruding DOM/background rectangle and without covering or altering the ring, pointer, center circle, or connector geometry.
- Page 18 label-box transfer guard: DOM text in `СЕМЬЯ И ЭКОНОМИКА`, `ИНСТИТУЦИИ`, `ЗДОРОВЬЕ`, and `ПОГИБШИЕ` is vertically centered inside the corresponding original source label box; text pinned to the top/bottom, especially `ИНСТИТУЦИИ`, fails.
- Page 18 label geometry guard: source label-box height, corner radius/shape, baseline/center alignment, and source graphic proportions remain intact. For Russian fitting, only DOM text/wrapper width may vary where necessary; source label height, corner shape, ring, pointer, and connector lines must not be changed.
- Page 19 source fidelity: work-axis diagram preserves four gray circular fields, exact walking/pedestrian, megaphone, officer/police, and group/people pictograms, icon sizes/placement, blue title style, title/circle/text relationship, two-column grid spacing, and proportions.
- Page 19 icon clipping guard: all four axis pictograms are complete source pictograms within their gray circles at desktop, narrow, and mobile widths, with no cropped quadrants, cut-off tips, visible square crop-box corners, parent-overflow clipping, tight source-crop edges, or icon/background coverage.
- Page 19 crop-padding guard: each source pictogram asset must include enough transparent/padded source area that the natural image content does not touch crop bounds and cannot look clipped inside the circle; generic/reconstructed replacements or tight crops that merely pass `object-fit: contain` are rejected.
- Page 19 grid-alignment guard: desktop work-axis circles form a stable 2x2 grid independent from title/body wrapping: equal circle diameters, aligned top-row center-y, aligned bottom-row center-y, aligned left/right column center-x, and consistent row/column gaps.
- Page 19 no-masonry guard: title wrapping or text length must not push individual circles into uneven y positions or a masonry-like layout; responsive stacking is allowed only below desktop/narrow breakpoints and still preserves local alignment and complete pictograms.
- Visible composition guard: checker evidence validates card/lobe/circle geometry, icon bounding boxes inside intended circle/lobe with padding, `object-fit` or equivalent full-artwork containment, parent overflow safety, source-like spacing, and screenshot comparison/manual review evidence.
- Infographic translation method: Russian text layers are selectable and local to the original text positions, while source artwork/geometry remains 1:1 and no visible Spanish/full-page raster/wholesale mask remains.
- Asset metadata/evidence: risk-factor/recommendation and diagram artwork has source-region crop/reconstruction metadata and screenshot comparison evidence, with page 18 specifically requiring complete-cleaned-source-crop metadata and no reconstruction mode.
- Style-guide consistency: repeated block types use recorded source-validated tokens. Blue law/callout blocks share background, left accent stripe, padding, alignment, font weight, line-height, width behavior, and margin cadence unless a source-backed variant is recorded.
- Visual source-fidelity gate: a required checker/harness runs after implementation and returns pass/fail evidence, not only summary text. It compares source and Russian artifacts for source image/infographic/pictogram preservation, layout/formatting/style fidelity, style-token consistency, and scalable `Руководство` navigation; reported regression classes must fail the gate.
- Visual assembly gate: source-derived assets are necessary but not sufficient; the checker must compare the assembled composition against the source and fail distorted, unrecognizable, or non-source-like reconstructions.
- Visual clipping/crop gate: the checker must fail square crop boxes inside circular lobes/circles, clipped icons, forced-crop `object-fit` choices, parent overflow cuts, icon/background coverage, and source-like lobe/card/circle geometry loss even when source asset metadata exists.
- Circle QA: city circle icons are fully visible and separate from text/backgrounds.
- Pictogram semantics: `8 из 10` visual accurately shows 8 male and 2 female pictograms.
- No visible Spanish text, including inside cropped assets.
- UI simplification: no scale controls and no context buttons.
- Learning relevance: no visible source/provenance, footnote, page marker, or book motif when those do not help solve tickets.
- Language: Russian wording is simple and accurate while preserving ticket-relevant facts.
- Layout QA: automated bounding-box checks cover overflow and overlap, including user-found circle overlap regressions.
- Durable visual-feedback QA: every accepted visual issue from this iteration is represented as a reusable requirement/checklist item/evidence expectation for future PDF-section conversions.
- Tests and screenshot evidence cover the above.

## Reusable PDF-Section Conversion Checklist

Future PDF-section-to-Russian-web conversions must use this checklist before user review:

- Navigation basis: document navigation follows the full source `Índice` hierarchy, not raw PDF pages and not one-off flat tabs.
- Main app destination: the integrated Russian manual lives under the user-facing `Руководство` block/tab and replaces the exposed `Руководство 4R` manual-viewer destination.
- No duplicate guide destinations: visible navigation must not keep legacy `Руководство 4R` beside the new interactive document unless a later explicit architecture decision requires a hidden/internal legacy path.
- Scalable IA: support entries, chapter/annex group headers, and child entries are represented in a reusable data model; implemented children are navigable, unimplemented children are pending/disabled/collapsed without fake content pages.
- Navigation labels: user-visible labels are Russian; source Spanish title and page reference live in metadata for mapping/QA.
- Navigation interaction: direct route/hash links, active group/child state, keyboard/a11y labels, mobile/narrow usability, and discoverability of the active item inside the hierarchy are required checks; existing Introduction hashes route into `Руководство` child content.
- Heading routes: each source index heading assigned to the feature becomes its own route/navigation item; multi-page headings remain one route unless the source `Índice` splits them.
- Source-span intake: verify exact page span, text, images, and layout for each heading from the index, manifests, and PDF renders before implementation.
- Russian adaptation: write natural Russian learning prose with common words and short, clear phrasing; avoid formal literal translation, especially for Plan shared-responsibility, Vision Zero, and safe-system paragraphs.
- Ticket-detail guard: after simplification, compare against available ticket/practice-source material and preserve or explicitly dispose any named entity, number, year, obligation, definition, condition, list item, safety principle, or exception word that may matter for exam tickets.
- Local text-flow optimization: adjacent paragraphs may be merged, complex sentences split, and multiple short sentences combined for clarity, but source order and section/block-level structure must remain intact.
- Text-first sections: when a heading is primarily prose/lists without complex infographic artwork, use normal responsive web prose while preserving title hierarchy, order, callouts, and readable typography.
- Visual sections: when a heading includes image/infographic blocks, use source-derived/cleaned assets for artwork and selectable DOM/SVG Russian text for learning content.
- Source usage: PDF fragment is mockup/reference only; no full-page PDF/page raster is rendered as the runtime base.
- Section framing: crop/reframe the web document to the meaningful content block; do not render full PDF page canvas, large blank page margins, or a tiny centered content island.
- Responsive density: desktop shows readable normal-density content; mobile starts on meaningful content, with panning/scrolling only where fixed infographic layout requires it.
- Responsive prose flow: headings and ordinary paragraphs are outside monolithic fixed-width canvases and wrap naturally by viewport/container width.
- Infographic scroll scope: horizontal scrolling is allowed only around fixed infographic/image blocks, never for normal prose.
- Selectable text: ordinary Russian prose and meaningful statistic labels must be selectable/copyable text; do not bake them into image crops.
- Selection CSS: no `user-select: none`, `pointer-events: none`, or equivalent selection/copy blocker on heading, intro, bottom body/conclusion, or statistic labels.
- Lower city row alignment: for paired pictogram/statistic rows, left icon block and right gray panel start at the same vertical level within a small tolerance.
- Alignment tests: compare `people-grid-icon` with `male-victims-panel`/`male-victims` and `people-pair-icon` with `age-range-panel`/`age-range` using bounding boxes.
- Full-row geometry tests: compare panel top, center, bottom, height, and row baseline against the matching left pictogram group; do not accept top-edge checks alone.
- Empty-space tests: bound lower gray panel height relative to its icon group and text block, including maximum empty-space ratio and bottom-whitespace checks.
- Grouped non-regression tests: every visual fix reruns all existing visual QA items so upper/global-card changes cannot regress lower city rows or other accepted feedback.
- Panel gap checks: paired pictogram/statistic rows must preserve source-like horizontal gap; tests compare pictogram right edge to panel left edge within a documented tolerance.
- Panel proportion checks: statistic gray panels must match source-like width/height ratios and avoid oversized empty containers.
- Internal text padding checks: panel text must have balanced top/bottom padding or source-like vertical centering; it must not be pinned to the top.
- Card density checks: global statistic cards must avoid excessive empty gray-box space and keep source-like number/label rhythm.
- Icon-to-strip attachment checks: pictograms such as airplane/stadium must visually attach to the blue strip/cap geometry as in the PDF, with bounding-box/cap checks and screenshots.
- Cap localization checks: distinguish local decorative cap geometry from full-container border-radius; tests should verify the strip remains rectangular at left/right while the rounded cap is near the icon center.
- Seam checks: icon/cap/strip/card top must visually touch; bounding boxes or pixel/screenshot checks must reject a white seam/gap above the blue strip.
- Paired-card alignment checks: paired global cards must have equal panel heights and aligned bottom edges/baseline grid within a documented tolerance.
- Empty-space ratio checks: global gray cards must bound unused lower area and keep text block top/bottom padding source-like.
- Typography: identify embedded/source PDF fonts first, then choose local/offline typography that serves the localized web document; if font imitation harms Russian readability or visual quality, use a modern UI readability stack.
- Readability-first stack: prefer `system-ui`, `-apple-system`, `BlinkMacSystemFont`, `"Segoe UI"`, `Roboto`, `"Noto Sans"`, `"Helvetica Neue"`, Arial, sans-serif, or an equivalent locally bundled readable UI font with acceptable source/licensing.
- Rejected rounded stack guard: do not accept `SFNSRounded`, `SF Compact Rounded`, or `SF Pro Rounded` as the first family after this user's rejection unless a later explicit decision changes it; Avenir-first remains rejected too.
- Heading wrap: do not force a narrow heading width that breaks `Дорожная пандемия` at normal desktop width; heading wraps naturally only when the viewport/container requires it.
- Typography rhythm: tune and verify weight, letter spacing, line-height, paragraph spacing, and text block width for readable Russian rhythm while preserving source hierarchy.
- Infographic typography: tune and verify statistic labels/numbers/cards/blue strips/gray boxes, not only prose; use the same readability-first typography system across document and infographic roles unless a documented source-faithful role distinction requires otherwise.
- Context labels: keep weight/emphasis consistent across both context labels; no partial bolding of only the city name.
- Native rebuild: Russian text is native DOM/SVG/text; no mask-over-Spanish-source and no overlay translation on the original page.
- Visual assets: use original PDF/source artwork, preferably high-resolution local isolated crops from the PDF or best available source render; clean only visible source text that must be replaced by Russian DOM/SVG text.
- Preserve source art 1:1: images, infographics, pictograms, panel shapes, borders, colors, spacing, and proportions must not be redesigned or approximated. Russian text replacement is the only allowed localized change unless a deviation is explicitly approved.
- No generic replacement art: do not substitute source pictograms/icons with newly designed generic/reconstructed SVGs when they visibly differ from the PDF.
- Page 17 risk/recommendation guard: preserve original `Factores de Riesgo` and `Recomendaciones` artwork, including wind/tree, car, people, gray/yellow panels, blue label, border, spacing, and proportions; reject generic person/avatar icons and generic cards. The decorative recommendation clipboard/check icon is explicitly omitted after the latest user decision.
- Page 17 transfer-framing guard: risk-card pictogram alpha bounds are centered in circular lobes and scaled to source-like circle fractions, with important source details such as the car diagonal support and people lower silhouettes preserved. The recommendation callout is checked for label/border alignment and absence of clipped decorative icon fragments, not for clipboard preservation.
- Page 18 consequences guard: preserve the original gauge/semi-circle incident diagram by using the complete original PDF infographic crop as the visual layer, cleaned only of source text, then overlay Russian DOM/SVG text. The black fatal-victims wedge/label, beige category labels/panels, family/economy icon, health icon, institutions icon, pointer, colors, geometry, proportions, spacing, connector lines, and overall composition are retained from the source crop; simplified cards, generic icons, CSS/SVG/native redraw, partial reconstruction, component reassembly, and altered geometry fail.
- Page 18 overlay-transfer guard: Russian DOM/SVG text may replace source text, but it must not add visible rectangles, backing fills, masks, or shape changes outside the original text area. Center-circle text must remain inside the circle/ring without protrusions or any opaque rectangular cleanup artifact, and category-label text must be vertically centered in source label boxes.
- Page 18 source-label geometry guard: label boxes such as `ЗДОРОВЬЕ` retain source height, corner shape/radius, source alignment, and connector relationships; only text/wrapper width may vary if Russian fitting requires it. Label backings must not be shorter than their Russian text, and `ИНСТИТУЦИИ`, `ЗДОРОВЬЕ`, and `ПОГИБШИЕ` are explicit regression examples for bottom-pinning, overflow/broken corners, and inconsistent label typography.
- Page 19 work-axis guard: preserve four circular gray fields and exact walking/pedestrian, megaphone, officer/police, and group/people pictograms with original icon sizes/placement, blue title style, title/circle/text relationships, two-column grid spacing, and proportions; generic avatars/approximate symbols fail. Each pictogram crop must include source/padded transparent breathing room so no pictogram edge touches the crop bounds or appears cut inside its circle.
- Page 19 stable-grid guard: desktop work-axis circles remain on a stable two-by-two grid independent from text wrapping; equal diameters, row center-y alignment, column center-x alignment, and consistent gaps are checked.
- Pages 18-20 diagram guard: work-axis/consequences diagrams with source pictograms or infographics require source-derived artwork metadata/crops and screenshot comparison; generic icons are not accepted final.
- Style-token guard: every recurring style element must be added to a style guideline with typography, colors, spacing, borders, alignment, image/icon positioning, and responsive behavior before acceptance. Repeated block types use the same token unless a source-backed variant is documented.
- Blue callout guard: blue law/callout blocks share background color, left accent stripe, padding, text alignment, font weight, line-height, width behavior, and margin cadence; accidental centered-versus-left-aligned drift fails.
- Vectorization threshold: vectorized artwork is allowed only when visually indistinguishable from the original and backed by screenshot/source comparison evidence.
- Post-completion visual checker: every Introduction section conversion runs a source-vs-Russian visual fidelity checker/harness with source screenshots, Russian screenshots, component/bounding-box metadata, asset presence/source-region checks, style-token checks, and a pass/fail report.
- Visual checker failure classes: lost/modified source images, generic icon replacements, simplified/misaligned/recolored/blurred/stretched diagrams, redrawn page 18 diagram components, partial page 18 source crops, protruding page 18 DOM/background rectangles, opaque center-circle rectangles/masks, vertically off-center or bottom/top-pinned page 18 label text, label backing shorter than Russian text, mismatched/broken label corners, inconsistent page 18 category-label typography, reintroduced/clipped page 17 recommendation clipboard fragments, off-center page 17 risk alpha framing, tight/clipped page 19 pictogram crops, uneven page 19 2x2 circle grid, lost formatting/layout/style, inconsistent recurring style tokens, and non-scalable/duplicate navigation shell regressions fail acceptance.
- Learning relevance: omit visible source/provenance, footnotes, page markers, and book-only decorative motifs unless they help solve exam tickets.
- Russian wording: simple, natural learner-facing Russian, preserving ticket-relevant meaning, all numbers, statistics, and necessary source concepts.
- Scale/readability: smallest font comparable to study-material text; no microtype.
- Body text parity: intro/body explanatory text approximately matches ordinary `Материалы` body text, not just a minimum pixel threshold.
- Paragraph flow: normal prose paragraphs are adaptive DOM text with no forced PDF line wrapping; fixed infographic/image labels may keep deliberate line breaks.
- UI restraint: remove nonessential controls unless requested; avoid zoom/focus/context controls that distract from the document.
- Layout fit: no text overflow and no element overlap at desktop and mobile sizes.
- Specific overlap checks: text inside infographic/circles must not collide with icon images; circles/indicators must not collide with below icons/rows; bottom paragraph/footnote/page marker areas must not collide. For this section, footnote/page marker are removed, and tests must prove no remnants collide.
- Circle visual checks: icons inside statistic circles must be original motorcyclist/pedestrian/car artwork crops or high-fidelity cleaned originals, fully visible and not hidden by labels, backgrounds, or text boxes.
- Pictogram semantic checks: people-grid visuals must preserve source meaning and style; for this section, `8 из 10` means 8 identical male pictograms and 2 female pictograms with the original silhouette/style preserved.
- Testing evidence: include automated overlap/bounding-box checks and screenshot review, not only DOM/content checks.
- Process memory: every accepted visual issue fixed during a section iteration must be recorded here as a reusable requirement, validation checklist item, and evidence expectation so analogous future sections and eventual whole-document conversion inherit the guardrail.
- User-found regression: the user found a circle-overlap bug in this iteration; future sections must treat circle/indicator overlap as a required reusable checklist item.

## Verification Evidence Placeholders

Implementation Agent must replace these placeholders in `tasks.md` with concrete evidence before handoff:

- Source span verified from manifest/navigation/reference image:
- Russian content/statistic coverage checked:
- Simple Russian wording reviewed:
- Cropped/cleaned original image asset usage checked:
- High-resolution source artwork extraction/cleanup checked:
- Rejected clean SVG replacements removed/replaced:
- Native vector/CSS/SVG or isolated asset coverage checked, including proof that any artwork vectorization is visually indistinguishable from source:
- Evidence that full page image is reference-only and not rendered as background/base:
- Content-region framing/no-blank-page-canvas checked:
- Desktop density/no-tiny-island checked:
- Mobile initial viewport/no-blank-start checked:
- Narrow viewport prose no-horizontal-overflow checked:
- Mobile prose no-horizontal-overflow checked:
- Infographic-only horizontal scroll scope checked:
- Selectable/copyable prose checked:
- Selectable/copyable statistic labels checked:
- Text interaction CSS checked (`user-select`/`pointer-events`):
- Lower city `8 из 10` row top alignment checked:
- Lower city `49%` row top alignment checked:
- Lower city pictogram-to-panel horizontal gap checked:
- Lower city gray panel proportion/empty-space ratio checked:
- Lower city gray panel text vertical padding/balance checked:
- Lower city full-row geometry checked (top/center/bottom/height vs icon group):
- Lower city panel empty-space ratio and bottom-whitespace checked:
- Grouped visual non-regression suite completed:
- Upper global card gray-box density checked:
- Upper global card font rhythm checked:
- Airplane/stadium icon-to-blue-strip attachment/cap geometry checked:
- Blue-strip localized cap/not-full-width-dome checked:
- Icon/cap/strip no-white-seam checked:
- Global paired-card equal-height/bottom-alignment checked:
- Global gray-card empty-space ratio/text padding checked:
- Typography readability-first font choice and local/offline source checked:
- Embedded PDF font identity checked:
- Readability-first replacement rationale for rejected rounded imitation checked:
- Avenir-first stack absence checked:
- SFNSRounded/SF Compact Rounded/SF Pro Rounded-first stack absence checked:
- Heading natural desktop wrap/no forced two-line break checked:
- Heading computed typography checked (`font-family`/`font-weight`/`line-height`/letter spacing):
- Intro/body computed typography checked (`font-family`/`font-weight`/`line-height`/paragraph rhythm):
- Infographic/card/number typography checked:
- Context label weight consistency checked:
- No asymmetric `::first-line`/partial context-label styling checked:
- Typography comparison screenshots captured:
- Evidence that mask/overlay translation approach is absent:
- Minimum text scale/readability checked:
- Intro/body font parity with `Материалы` body text checked:
- Normal paragraph no-forced-line-break check completed:
- City circle icon visibility checked:
- City circle source-artwork fidelity checked:
- `8 из 10` pictogram semantic and silhouette/style accuracy checked:
- Removed scale controls/context buttons checked:
- Removed visible source/provenance, footnote, page marker, and book motif checked:
- Bottom paragraph learning-relevant conclusion checked:
- Automated no-overlap/bounding-box checks completed:
- Screenshot review completed:
- Reusable checklist applied:
- Forbidden runtime patterns checked:
- Playwright/DOM route and readability checked:
- Screenshot captured for user approval:
- Local dev/preview URL:

## Architect Decisions

- Decision: Full-page PDF/page-image background, Spanish-text masks, and overlay translation remain forbidden.
- Decision: The PDF page is a source/layout reference for the content block only; the web section must be cropped/reframed around meaningful `Pandemia vial` content and must not preserve huge blank PDF-page whitespace.
- Decision: Preserve pinned infographic/image layout within the content block, but present the block as a normal responsive web page section with normal margins/density.
- Decision: Normal prose (`heading`, `intro`, and bottom learning conclusion/body) must be responsive web-flow content and must not live inside a fixed-width horizontal-scrolling canvas.
- Decision: Horizontal scrolling/panning is allowed only for fixed infographic/image regions that need pinned PDF-like layout.
- Decision: Ordinary Russian text and meaningful statistic labels must remain selectable/copyable accessible text; the section must not behave like an image preview.
- Decision: At minimum, heading, intro, bottom body/conclusion, and stat labels must not disable text selection or pointer interaction.
- Decision: Lower city statistic rows must match the source vertical alignment: each gray statistic panel starts at the same top level as its corresponding left pictogram block within a small tolerance.
- Decision: Playwright must verify `people-grid-icon` versus `male-victims-panel`/`male-victims` and `people-pair-icon` versus `age-range-panel`/`age-range` top alignment.
- Decision: Lower city statistic rows must also preserve source-like horizontal gap, gray panel proportions, and internal text padding/vertical balance; top alignment alone is not enough.
- Decision: Upper global statistic cards must preserve source-like gray-box density, card font rhythm, and airplane/stadium icon-to-blue-strip attachment/cap geometry.
- Decision: Icon-to-strip attachment must preserve the PDF's localized central cap/rise on a rectangular strip; full-width rounded half-pill/dome strips are rejected.
- Decision: Upper global icon/cap/strip/card top must have no white seam/gap; paired global cards must have equal panel heights and aligned bottom edges, with bounded gray-card empty-space ratio.
- Decision: Heading/body typography must move away from accidental default styling and from the rejected SF-rounded/GothamRounded-like attempt toward deliberate modern UI readability.
- Decision: Remote font dependencies are forbidden; exact font source/licensing or closest-local-alternative rationale must be documented.
- Decision: Source font identity is GothamRounded/HelveticaWorld and must be recorded as context, but exact font imitation is no longer the primary target when it harms Russian readability/visual quality.
- Decision: Avenir-first stack is rejected by the user and cannot remain the accepted primary Pandemia typography stack.
- Decision: The SFNSRounded/SF Compact Rounded/GothamRounded-like attempt is also rejected by the user and cannot remain the accepted primary Pandemia typography stack.
- Decision: Prefer a modern UI readability stack: `system-ui`, `-apple-system`, `BlinkMacSystemFont`, `"Segoe UI"`, `Roboto`, `"Noto Sans"`, `"Helvetica Neue"`, Arial, sans-serif, or an equivalent locally bundled readable UI font with acceptable source/licensing.
- Decision: `Дорожная пандемия` must not be forced to wrap at normal desktop width; remove narrow heading-width constraints that create an unnecessary line break.
- Decision: Future PDF-section conversions must identify embedded/source PDF fonts before choosing web typography.
- Decision: Heading/body weight, letter spacing, line-height, paragraph spacing, and text block width are part of visual fidelity and require computed-style evidence plus screenshots.
- Decision: Infographic typography is part of visual fidelity too; statistic cards, numbers, blue strips, gray boxes, and labels need source-like local/offline font roles and computed-style evidence.
- Decision: Context labels must not bold only `Буэнос-Айрес`; use one weight for the full remaining label or a symmetric two-level treatment for both labels.
- Decision: Visual pictogram/icon assets must use original PDF/source artwork whenever possible, preferably high-resolution isolated crops from the PDF or best available local source render.
- Decision: Cropped assets must be cleaned only where visible Spanish text must be removed for Russian DOM/SVG text and cannot become a full-page raster base.
- Decision: Newly designed generic/reconstructed SVG pictograms/icons are not acceptable when visibly different from the PDF.
- Decision: Vectorization is acceptable only when visually indistinguishable from the source artwork; the latest clean SVG replacements do not meet this bar and must be replaced.
- Decision: Russian labels/text remain native DOM/SVG/text in the reconstructed layout.
- Decision: Remove `Вписать` / `100%` controls and `Мировой контекст` / `Контекст города` buttons.
- Decision: Increase scale so the smallest text is comparable to existing study-material text.
- Decision: Intro/body explanatory text must approximately match ordinary `Материалы` body text, not merely pass a 14px floor.
- Decision: Normal prose paragraphs must not use manual line breaks to mimic PDF wrapping; browser/container wrapping owns prose line breaks. Fixed infographic/image labels may remain pinned and manually broken when needed for layout.
- Decision: City statistic circle icons must be fully visible, spatially separate from text/backgrounds, and use original motorcyclist/pedestrian/car artwork crops or high-fidelity cleaned originals.
- Decision: The `8 из 10` pictogram group must accurately show 8 male pictograms and 2 female pictograms while preserving the original silhouette/style; use original source pictograms/crop whenever possible.
- Decision: Use simple Russian wording while preserving exact meaning and all details relevant to exam tickets.
- Decision: For this section, visible source/provenance details, the footnote, the page marker/page number, and the blue upper-left book motif are not learning-relevant and must be removed from the visible document.
- Decision: The reusable PDF-section checklist is part of this feature memory and should guide future section conversions.
- Decision: This remains a single section-level prototype for user approval.

## Known Issues And Risks

- Current runtime diffs may still reflect a rejected or now-insufficient prototype; Architect did not edit or revert runtime/code/test files.
- Source-derived cropped assets may require careful text cleaning so no Spanish remains visible.
- Latest clean SVG replacements have been rejected by the user as visibly different from the source and must not be treated as accepted evidence.
- Extracting high-resolution original artwork crops may require revisiting the PDF/source render and replacing lower-quality or over-cleaned assets.
- Increasing scale may require a larger fixed-format content block and/or horizontal scroll on small screens.
- Reframing must avoid solving readability by placing a tiny scaled block on a large blank page; use normal web density around the content block instead.
- Mobile may require horizontal pan for fixed infographic content, but blank whitespace before content is not acceptable.
- A reframed page can still fail if ordinary prose remains inside a monolithic fixed-width canvas; narrow in-app browser verification must guard against this.
- Tests must distinguish prose overflow from allowed infographic/image panning so a broad no-overflow check does not force redesign of pinned infographic blocks.
- A native-looking page can still fail if Russian text is effectively unselectable or baked into image-like layers; selection/copyability checks are required.
- Some fixed infographic labels may need pinned placement, but any exception to ordinary selectable text must be narrow, documented, and not apply to heading, intro, bottom body/conclusion, or meaningful statistic labels.
- No-overlap checks are not sufficient for the lower city infographic; source top alignment between pictograms and gray statistic rows must be checked separately.
- Top alignment checks are not sufficient for the lower city infographic; pictogram-to-panel gap, panel proportions, and text padding/vertical balance can still fail visually.
- Typography remains approval-risky unless the final readability-first font stack, computed heading/body metrics, infographic metrics, heading wrap behavior, and screenshots are recorded.
- Infographic typography can still fail even when prose typography improves; card/number/label metrics require their own checks.
- Current accepted font-stack evidence is insufficient if upper global card number/label rhythm remains visibly off in screenshot comparison.
- Upper icon crops can be source-derived and still fail if they look detached from their blue strip/cap; attachment geometry needs explicit checks.
- Attachment geometry can overcorrect into a full-width rounded dome; tests must distinguish localized cap/rise from whole-strip border-radius.
- A strip can pass attachment/local-cap checks while still failing due to a white seam above the strip or unequal paired-card height/bottom alignment; those need separate evidence.
- Context-label emphasis can regress through pseudo-elements such as `::first-line`; tests should inspect computed styling or DOM structure to prevent asymmetric partial bold.
- Font licensing/source can block adding a new local font asset; if so, Implementation Agent must use and document the approved modern UI readability stack rather than forcing a poor source-font imitation.
- The Avenir-first and SFNSRounded-first stacks have both been rejected visually; any evidence that only proves "not Inter" is insufficient until it proves the final readability-first stack and rejected-family guards.
- Platform font resolution can differ across environments; evidence must name the chosen stack, computed font family in preview, and rationale for readability-first selection against the rejected rounded imitation.
- Heading width can regress into PDF-mimicry; tests must catch unnecessary desktop line breaks in `Дорожная пандемия`.
- Simpler Russian wording requires review so simplification does not remove official-source details.
- Removing source/provenance from the visible document requires preserving enough internal traceability for validation.
- Removing book-layout elements changes the exact PDF appearance but better matches the website/document experience requested by the user.
- Overlap bugs can escape DOM/content checks; automated bounding-box checks and screenshot review are required.
- Existing evidence may not satisfy the newest body-font parity, circle-icon visibility, and `8 из 10` pictogram semantic requirements; Implementation Agent must add fresh evidence.
- Pixel fidelity remains approval-risky until screenshots are reviewed by the user.

## Implementation Agent Feedback

- Pending: Implementation Agent to record any divergence, missing source artifact, native redraw/crop limitation, Russian fitting tradeoff, or improvement suggestion here for Architect disposition.

## Architect Consolidation - Current Transfer Contract

This section is the current reusable contract for converting GCBA manual PDF fragments into the Russian interactive `Руководство`. It consolidates the user feedback and implementation lessons from the full `Pandemia vial` / Introduction iteration so future work does not depend on re-reading the entire conversation.

### Source-To-Web Definition

- Input is a PDF/manual source fragment. Output is a native, interactive Russian web document section.
- The source PDF is a mockup and source-of-truth for content, layout, artwork, visual hierarchy, proportions, and section order. It is not shipped as a runtime PDF viewer, full-page raster, side-by-side Spanish preview, or image-only transcript.
- The visible web page is section-based, not page-number-based. Source `Índice` headings define document routes; PDF page numbers remain metadata for mapping and QA.
- The current implemented slice is limited to the four Introduction headings, but the navigation shell and guidelines must scale to the whole source `Índice`.
- The integrated document is the user-facing `Руководство` destination. `Руководство 4R` must not remain as a duplicate visible guide/manual destination.

### Russian Text Contract

- Russian prose, headings, list items, callouts, statistic labels, and meaningful infographic labels are selectable/copyable DOM/SVG text.
- Russian wording should be natural and simple, using common Russian phrasing and short sentences. Formal literal translation is rejected.
- Local simplification is encouraged when it improves clarity: adjacent paragraphs may be merged, complex sentences split, and repeated short sentences combined.
- Simplification is local only. It must preserve source block/section order, lists, diagrams, navigation order, named entities, numbers, years, obligations, definitions, conditions, safety principles, exception words, and any detail that appears or may appear in exam tickets.
- Any detail with unclear ticket relevance must be preserved or explicitly disposed by Architect/Analyst; Implementation Agent must not silently drop it.
- Normal prose must wrap by container width. Do not insert manual PDF-style line breaks inside ordinary paragraphs. Deliberate line breaks are allowed only inside fixed visual/infographic labels when they are part of the designed layout.

### Visual Artwork Contract

- Source images, infographics, pictograms, and diagram artwork are preserved 1:1 whenever they exist in the PDF. Generic icons, redesigned cards, altered diagrams, approximate SVGs, recolored artwork, stretched/cropped replacements, or text-only substitutes fail acceptance.
- Use original PDF/source artwork crops at high enough resolution, or a vectorization/reconstruction only when it is visually indistinguishable from the source and backed by evidence.
- Russian text may replace source text, but artwork geometry, colors, spacing, panel shapes, borders, corner radii, icons, connector lines, and proportions remain source-faithful.
- Text cleanup must be local to the original text/glyph areas. Broad masks, square cover-ups, color-matched rectangles, block patches, and DOM label plates that modify source artwork are rejected.
- If cleanup crosses multiple source colors or edges, restore/inpaint the local background so no seams, tabs, hard rectangles, broken connector lines, or damaged rings/arcs remain visible.
- Source assets must not be browser-upscaled beyond their natural pixel quality; high-DPI extraction is required when screenshots show pixelation.

### Page-Specific Standing Guards

- `Pandemia vial`: text area uses the same article shell as other Introduction articles; infographic remains source-faithful and untouched by the article-shell restyle.
- `Pandemia vial` prose: no source/provenance paragraph, footnote, page number, blue corner motif, zoom controls, or context buttons. Keep only learning-relevant text.
- Page 17 `Factores de Riesgo`: risk cards are long rounded rectangles with integrated circular/lobed left edges; source pictograms are centered by visible alpha bounds and fully visible. Right rectangles are shorter than the lobe diameter and must not expose square seam corners.
- Page 17 `Recomendaciones`: omit the decorative clipboard/notebook/check icon after the user's explicit decision. Do not reintroduce clipped fragments. Preserve the callout label, border, spacing, and alignment.
- Page 18 `Consecuencias`: use one complete cleaned original source crop for the non-text diagram layer. Do not redraw, reconstruct, componentize, or reassemble arcs, sectors, pointer, black wedge, label boxes, connector lines, or pictograms.
- Page 18 labels: Russian category and center text are transparent overlays in source-like positions. `ИНСТИТУЦИИ` and `ПОГИБШИЕ` are named vertical-centering fixtures; `ЗДОРОВЬЕ` is a named label-box geometry fixture; `ДОРОЖНЫЙ ИНЦИДЕНТ` must not have a rectangular backing or patch over the circle/ring.
- Page 19 `Ejes de trabajo`: use source circular fields and exact walking/pedestrian, megaphone, officer/police, and group/people pictograms. Desktop is a stable 2x2 grid with equal circle diameters, aligned row centers, aligned column centers, and consistent gaps independent of text wrapping.

### Style Guidelines

- Introduction article pages share one article shell: readable off-white card/background, consistent border/radius/padding, `intro-document-header`, `intro-document-flow`, and common body rhythm.
- Repeated source block types must have documented tokens before acceptance: font family/weights, heading/body sizes, line-height, colors, padding, margins, border widths/radii, alignment, image positioning, icon positioning, and responsive behavior.
- Blue law/callout blocks use one consistent style for background, left accent stripe, padding, text alignment, font weight, line-height, width behavior, and margin cadence unless a source-backed variant is recorded.
- Typography starts from source font diagnosis, but final web typography prioritizes readable Russian. For this slice, use a modern local/offline UI stack rather than rejected Avenir-first or SF-rounded/Gotham-like imitations unless a later explicit decision changes that.
- `Дорожная пандемия` must not be forced into a two-line heading at normal desktop width.

### Validation Checker Contract

Before handoff and before merge readiness, Implementation Agent must run and record an artifact-backed source-vs-Russian visual checker/harness. It may combine tests, Playwright, image metadata, bounding boxes, screenshot comparison, and manual visual notes, but it must produce pass/fail evidence.

The checker must fail and return work when:

- source artwork is lost, redrawn, simplified, substituted, clipped, stretched, blurred, pixelated, recolored, or assembled into a visibly non-source-like composition;
- Spanish/source text remains in visible learning content or cleaned visual assets;
- broad masks, square patches, hard-edged cleanup artifacts, or DOM backgrounds alter source artwork;
- Russian text is unselectable where it should be DOM/SVG text;
- ordinary prose overflows, clips, or requires horizontal scrolling;
- fixed visual blocks clip icons, misalign circles/lobes/panels, expose crop boxes, or regress page 17/page 18/page 19 named fixtures;
- navigation is flat, page-number-based, detached from `Руководство`, exposes duplicate manual destinations, or breaks direct hashes;
- recurring style tokens drift between repeated blocks without source evidence.

### Durable Documentation Requirement

The reusable conversion contract above must be copied into durable project documentation in this PR, not left only in feature memory. Implementation Agent should add or update `docs_project/project/frontend/manual-conversion-guidelines.md` and link it from `docs_project/project/frontend/frontend-docs.md`, or choose an equivalent frontend docs location if the local docs structure suggests a better fit. The durable doc must include the conversion requirements, style guidelines, source-artwork preservation rules, Russian simplification rules, and visual checker checklist.
