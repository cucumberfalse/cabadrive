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

## Artwork Transfer

- Preserve source artwork 1:1 for images, infographics, pictograms, diagrams,
  panel shapes, borders, colors, spacing, and proportions.
- Use original PDF/source artwork crops or cleaned originals by default.
  Generic icon sets, approximate redrawn SVGs, alternate card designs, or
  source-like-but-different pictograms fail the conversion contract.
- Vectorization is acceptable only with evidence that it is visually
  indistinguishable from the source.
- Crop narrowly scoped artwork fragments or complete infographics as needed;
  never use the full PDF page as the visible base.
- Remove Spanish text from artwork with local source-crop cleanup or inpainting
  that preserves surrounding pixels, edges, connector lines, rings, panels, and
  corners.
- Do not cover Spanish text with broad masks, square patches, color-matched
  plates, DOM label backgrounds, or opaque rectangles that change the source
  artwork.
- Russian replacement labels sit as selectable text in source-faithful
  positions. If text fitting requires a change, prefer text wrapping, font
  tuning, or a documented width-only label adjustment; do not change source
  shape height, corner geometry, connector relationships, or diagram structure.

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
  visible Spanish text.
- Recurring style tokens match across repeated blocks.
- Screenshots exist for desktop, narrow/high-risk, and mobile layouts where
  relevant.

The checker must fail on:

- runtime PDF/full-page raster/image-only rendering;
- generic icon replacement, redesigned pictograms, missing source artwork, or
  source-derived pieces assembled into a distorted composition;
- broad masks, square patches, DOM plates, backing rectangles, or visible
  cleanup artifacts over source artwork;
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
2. Record crop paths, source regions, cleanup scope, and visible-Spanish status.
3. Record Russian wording decisions and ticket-critical detail retention.
4. Add or update style-token metadata for every recurring block type.
5. Add content tests for route coverage, forbidden patterns, local assets,
   navigation hierarchy, and visible labels.
6. Add Playwright checks for responsive prose, selectable text, artwork
   bounding boxes, named fixture geometry, and screenshots.
7. Run focused content tests, TypeScript, build, focused Playwright, whitespace
   check, and preflight before PR readiness.
