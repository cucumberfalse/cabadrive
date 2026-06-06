# Manual Conversion Guidelines

## Purpose

This guide is the durable frontend contract for converting official PDF/manual
fragments into Russian interactive web document sections in Cabadrive. It
generalizes the accepted requirements from feature `029-pandemia-vial-section`
so future sections do not depend on re-reading the full feature history.

The current user-facing destination is `Руководство`. It is the Russian
interactive manual surface built from the official GCBA 4-wheel manual source
and organized by the source `Índice`. The old visible `Руководство 4R` manual
viewer entry is replaced by `Руководство`; old manifest/source assets may
remain as internal inputs and validation material, but should not appear as a
second guide destination.

## Source And Routing

- Treat the PDF as the source mockup/reference, not as the runtime document.
- Do not render a runtime PDF viewer, iframe, object/embed, PDF.js canvas,
  remote image, full-page raster background, or image-only page.
- Route boundaries come from the source `Índice`, not raw PDF page numbers.
  If one index heading spans several PDF pages, it remains one route.
- The `Руководство` navigation must scale to the full source hierarchy:
  support entries, Introduction, chapters, annexes, and child sections.
  Unimplemented entries are pending/disabled/collapsed placeholders, not fake
  content pages.
- Current implemented Introduction fixtures are:
  `#pandemia-vial`, `#intro-enfoque-etico`,
  `#intro-accidente-incidente`, and `#intro-plan-seguridad-vial`.
- Preserve Spanish source titles, source page references, hashes, and crop
  provenance in data/tests/process memory. Do not render source/provenance
  clutter inside the learner document unless it helps solve exam tickets.

## Text And Language

- Russian headings, body text, lists, callouts, and meaningful statistic labels
  must be selectable/copyable DOM or SVG text.
- Do not bake Russian learning text into image crops except for a documented
  narrow visual exception.
- Do not use `user-select: none`, `pointer-events: none`, or equivalent
  selection blockers on learning text.
- Use natural, simple Russian. Prefer common words, short sentences, and clear
  learner-facing phrasing over formal literal translation.
- Simplification is allowed only when source meaning and ticket-critical detail
  are retained. Preserve named entities, numbers, years, obligations,
  definitions, conditions, lists, safety principles, and exception words unless
  Architect/Analyst explicitly disposes the detail.
- Local text-flow edits may merge adjacent paragraphs, split complex sentences,
  or combine short sentences for clarity. They must not rearrange section
  order, list order, diagram order, route order, or source heading order.
- Visible footnotes, page markers, source attributions, and book-only
  decoration should be omitted when they do not help exam learning.
- Manual glossary rows should use structured data rather than colon-delimited
  prose strings: keep the Spanish source term, concise Russian translation, and
  Russian definition in separate fields, render the Spanish term with semantic
  selectable emphasis and `lang="es"`, and render the Russian translation and
  definition as selectable Russian text close to the term.

## Artwork Transfer

- Preserve source artwork 1:1 for images, infographics, pictograms, diagrams,
  panel shapes, borders, colors, spacing, and proportions.
- New source images and crops must be extracted/exported at a high-resolution
  target: x5 zoom/source export, direct high-DPI PDF export, source-native
  raster dimensions, or a documented equivalent/better method. Evidence must
  record the method, output dimensions, SHA-256 hash where practical, runtime
  display size, and `noUpscale` proof that the browser does not enlarge the
  asset beyond its exported dimensions.
- Use original PDF/source artwork crops or source-transferred originals by
  default. Generic icon sets, approximate redrawn SVGs, alternate card designs,
  source-like-but-different pictograms, or reconstructed diagrams fail the
  conversion contract.
- Vectorization is acceptable only with evidence that it is visually
  indistinguishable from the source and only for non-protected artwork.
- Crop narrowly scoped artwork fragments or complete infographics as needed;
  never use the full PDF page as the visible base.
- Photos, traffic-sign images, and road-marking images are protected
  source-as-is assets. Do not translate, relabel, redraw, recolor, clean,
  reconstruct, retouch, mask, inpaint, remove meaningful content, or otherwise
  edit them. Russian explanation must live outside the protected image.
- Source image cards must declare an explicit reusable display disposition.
  Use `full-width` for complete or near-complete source pages, sign/marking or
  signal sheets, major maps, diagrams, source-document examples, transferred
  infographics, and large protected source visuals that need inspection at
  manual-content width. Use `compact` only for genuinely small snippets whose
  source role is compact. Full-width cards must render image and explanation in
  vertical flow, span the manual content column, preserve aspect ratio, and cap
  display width at the source/natural asset width so the browser does not
  upscale low-resolution crops. Ultra-wide or panoramic full-width source cards
  may additionally declare a reusable minimum readable display width; on narrow
  viewports, keep that overflow contained inside the figure/image visual only
  with horizontal scrolling. Do not create document-level horizontal overflow,
  and do not add card-id-specific CSS for this behavior.
- Full-width is not enough when the raster itself contains a tiny useful island
  inside a mostly blank page. Before accepting source-image cards, inventory
  useful-content bounds where practical and crop empty outer margins from the
  official PDF/source region so the protected visual itself fills the runtime
  image. Evidence must record before/after useful-content ratios, crop bounds,
  output dimensions, hashes, runtime display size, and no-upscale proof. If the
  official PDF embeds a source-limited raster and higher-scale rendering does
  not add useful pixels, record that limitation and cap display at natural crop
  width; do not stretch, retouch, redraw, or reconstruct the protected image.
- Intended-readable embedded text inside source images should be visually
  comparable to nearby manual body text. First try a better official source,
  high-DPI extraction, tighter official crop, or source-faithful split/sub-crop
  presentation. On narrow screens, a contained figure-level scroll minimum may
  preserve natural source width when downscaling would make source text smaller.
  If no official source-faithful strategy can satisfy the text-size target
  without upscaling or protected-pixel edits, record a source-limited exception
  with attempted alternatives and route it for owner disposition.
- Infographics must be transferred as high-quality source images, not redrawn
  or reconstructed from approximate CSS/SVG/icon components. If Spanish text is
  removed from an infographic, cleanup is glyph/letter-level only: restore each
  letter area with surrounding background pixels/colors while preserving edges,
  connector lines, rings, panels, corners, pictograms, proportions, and spacing.
- Do not cover Spanish text with broad masks, square patches, color-matched
  plates, DOM label backgrounds, opaque rectangles, broad boxes, or large
  patches that change the source artwork.
- Russian replacement labels sit as selectable DOM/SVG text in source-faithful
  positions where feasible. If text fitting requires a change, prefer text
  wrapping, font tuning, or a documented width-only label adjustment; do not
  change source shape height, corner geometry, connector relationships, or
  diagram structure.

## Typography And Style Tokens

- Identify embedded/source PDF fonts before choosing web typography. For the
  current Introduction source, the diagnostic font context is
  GothamRounded Book/Light/Medium/Bold plus HelveticaWorld-Regular.
- Use readability-first local/offline Russian typography when source-font
  imitation hurts visual quality. The current accepted stack starts with
  `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
  "Noto Sans", "Helvetica Neue", Arial, sans-serif`.
- Do not introduce runtime remote fonts.
- Body text must be comparable to ordinary `Материалы` body text, not PDF
  microtype. Normal prose must wrap in responsive web flow and must not require
  horizontal scrolling.
- Horizontal scrolling is allowed only for fixed infographic/image blocks where
  preserving the source layout requires it.
- Record recurring document-family style tokens before acceptance:
  typography family/weights, headline/body sizes, line-height, colors,
  paddings, margins, border widths/radii, alignment, icon/image positioning,
  and responsive behavior.
- Repeated block types use one style unless the source shows a documented
  variant. Blue law/callout blocks specifically share background color, left
  accent stripe, padding, text alignment, font weight, line-height, width
  behavior, and margin cadence.

## Named Visual Fixtures

Use these fixtures as regression anchors for future manual-section work:

- Page 17, `#intro-accidente-incidente`, `Factores de Riesgo`: three long
  rounded panels, source gray/yellow roles, integrated circular/lobed left
  edges, centered complete source pictograms, source-like title/body spacing,
  and no square crop boxes or clipped icon fragments.
- Page 17, `Recomendaciones`: omit the decorative clipboard/notebook/check icon.
  Preserve the blue label, border, spacing, and callout alignment; fail any
  reintroduced or clipped decorative icon fragment.
- Page 18, `#intro-plan-seguridad-vial`, `Consecuencias de los Incidentes de
  tránsito`: use the complete cleaned original infographic crop for non-text
  artwork. Preserve gauge/semi-circle geometry, beige sectors, gray outer arc,
  dark center ring, pointer, black fatality wedge/label, category label boxes,
  connector lines, pictograms, proportions, and spacing. Russian labels must be
  centered, transparent text overlays with no protruding backing rectangles.
- Page 19, `#intro-plan-seguridad-vial`, `Ejes de trabajo`: preserve the four
  gray circular fields, exact pedestrian, megaphone, officer, and group source
  pictograms, blue titles, text placement, two-column desktop grid, equal circle
  diameters, row/column alignment, and padded unclipped source crops.
- Page 15, `#pandemia-vial`: prose uses the shared Introduction article
  shell/background/padding/font rhythm, while the infographic remains a fixed
  source-faithful block with original crops, no source-mask overlays, no zoom
  controls, no context buttons, and selectable statistic labels.

## Visual Checker Criteria

A conversion is not ready until a checker or focused Playwright evidence records
source screenshots, Russian screenshots, component/bounding-box metadata,
source-asset/crop metadata, style-token checks, navigation checks, and explicit
pass/fail output.

The checker should pass only when:

- `Руководство` is the active guide destination and the route lives inside the
  full source-`Índice` hierarchy.
- Russian text is selectable DOM/SVG text and ordinary prose has no horizontal
  clipping or forced PDF-style line breaks.
- Source artwork is present, source-faithful, locally bundled, and free of
  visible Spanish text except explicit source-as-is photo, traffic-sign, and
  road-marking exceptions.
- New image/crop metadata proves x5/equivalent extraction, dimensions, valid
  64-hex SHA-256 hashes where required, and runtime display-size/no-upscale
  evidence.
- Photo, traffic-sign, and road-marking records prove source-as-is handling and
  Russian explanation outside the image.
- Infographic and diagram records prove high-quality source-image/source-diagram
  transfer, no approximate redraw/reconstruction/generic icon replacement,
  glyph/letter-level Spanish cleanup when applicable, no broad
  masks/plates/patches, and selectable Russian DOM/SVG overlay where feasible.
- Recurring style tokens match across repeated blocks.
- Screenshots exist for desktop, narrow/high-risk, and mobile layouts where
  relevant.

The checker must fail on:

- runtime PDF/full-page raster/image-only rendering;
- generic icon replacement, redesigned pictograms, missing source artwork, or
  source-derived pieces assembled into a distorted composition;
- translated, relabeled, recolored, redrawn, retouched, masked, inpainted, or
  reconstructed photos, traffic signs, or road markings;
- approximate infographic or diagram redraws/reconstructions, or generic icon
  replacements, instead of source-image/source-diagram transfer;
- broad masks, square patches, broad boxes, large patches, DOM plates, opaque
  label backgrounds, backing rectangles, or visible cleanup artifacts over
  source artwork;
- low-resolution or runtime-upscaled source assets, or missing extraction
  method/dimensions/hash/runtime-display evidence;
- clipped icons, square crop boxes inside circles/lobes, parent-overflow cuts,
  mismatched row/column alignment, excessive blank canvas, or tiny centered
  content islands;
- page 18 label text that is top/bottom pinned, label boxes shorter than text,
  mismatched/broken label corners, inconsistent category-label typography, or
  an opaque rectangle behind `ДОРОЖНЫЙ ИНЦИДЕНТ`;
- duplicate user-facing `Руководство 4R` and `Руководство` guide destinations.

## Implementation Checklist

Before opening a PR for a manual fragment:

1. Verify source `Índice` heading, route id, page span, source text, visual
   blocks, and omitted book/source artifacts.
2. Record crop paths, source regions, x5/equivalent extraction method,
   dimensions, hashes where practical, runtime display-size/no-upscale evidence,
   cleanup scope, and visible-Spanish status.
3. Record Russian wording decisions and ticket-critical detail retention.
4. For photos, traffic signs, and road markings, record source-as-is evidence
   and keep Russian explanation outside the image.
5. For infographics, record source-image transfer evidence, glyph/letter-level
   cleanup scope when Spanish is removed, and selectable Russian overlay
   strategy where feasible.
6. Add or update style-token metadata for every recurring block type.
7. Add content tests for route coverage, forbidden patterns, local assets,
   navigation hierarchy, and visible labels.
8. Add Playwright checks for responsive prose, selectable text, artwork
   bounding boxes, named fixture geometry, and screenshots.
9. Run focused content tests, TypeScript, build, focused Playwright, whitespace
   check, and preflight before PR readiness.
