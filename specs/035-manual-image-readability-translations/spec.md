# Spec: Manual Image Readability And Russian Translations

## Architect Scope

This Architect assignment plans feature
`035-manual-image-readability-translations` only.

- Assigned worktree:
  `/Users/chap/devel/cabadrive-worktrees/035-manual-image-readability-translations`.
- Assigned branch: `codex/035-manual-image-readability-translations`.
- Verified latest-main base: `origin/main` at
  `74c104f6d3c73a2586000dddd85953ca31586fb7`.
- Intake artifact:
  `specs/035-manual-image-readability-translations/feature-request.md`.
- Parallel work may exist. Preserve all sibling worktrees, branches, commits,
  PRs, dirty diffs, and process memory.
- Architect writes only `spec.md`, `plan.md`, and `tasks.md` under this feature
  folder. Architect does not edit code, tests, assets, durable docs, commits,
  pushes, PRs, reviews, or merges.

## Relationship To Feature 034

Feature `034-manual-visual-content-crop` was merged as PR `#200` at
`74c104f`. It established the current high-quality crop, no-upscale,
useful-content-bounds, protected-pixel, and visual-completeness baseline.

This feature does not reopen feature `034` as failed crop work by default. It
addresses the next defect class: many manual-guide images now preserve official
pixels and may be tighter than before, but embedded Spanish labels, captions,
quotes, map labels, document words, or catalog captions are still not readable
enough for a Russian-speaking learner or are not mapped to selectable Russian
DOM text. Source fidelity and crop quality are prerequisites; they are not
sufficient acceptance evidence for this feature.

## Goal

Make every image with learner-relevant embedded Spanish text in the interactive
`Руководство` manual usable by a Russian-speaking learner with minimal Spanish.
The implementation must inventory the whole manual-guide image surface, make
intended-readable source text inspectable where possible, provide structured
nearby Russian DOM translations or captions for learner-relevant Spanish text,
and add a validation gate that prevents future source-fidelity-only passes.

## User Outcome

When a manual image contains Spanish text, the learner can inspect the relevant
source pixels and understand the Spanish text from nearby selectable Russian
support. A broad paragraph that only summarizes the image is not enough for a
sheet, diagram, map, document card, or quote photo with multiple meaningful
labels.

## Protected-Image Rule

Photos, traffic signs, road markings, maps, document examples, official source
fragments, and other protected source-as-is pixels must remain unchanged. Do
not translate, relabel, redraw, recolor, clean, reconstruct, retouch, mask,
inpaint, or cover protected pixels with Russian text or plates. Russian support
belongs outside the protected image as selectable DOM text close to the image.

Cropping or splitting is allowed only when it is source-faithful and preserves
all meaningful source content needed by the image's learning role. Use official
PDF/original material at the best practical quality, cap runtime display at the
natural asset width, and use contained figure-level scrolling on narrow screens
when needed to avoid shrinking intended-readable source text.

## Scope

In scope:

- Whole interactive manual-guide image inventory across all implemented
  sections and all image-rendering block types, not only
  `source-image-cards`.
- Structured Russian support for every learner-relevant embedded Spanish text
  item, including labels, captions, terms, quote text, document words, map
  labels, sign catalog captions, diagram labels, and sheet group headings.
- Readability fixes through higher-quality official extraction, tighter
  source-faithful crops, split panels, focused cards, or contained natural-width
  display where the current whole-sheet/full-card display is too small.
- A new deterministic or semi-deterministic manual-guide readability and
  translation coverage audit wired into `pnpm run validate:manual-guide` and
  the existing content validation path.
- Visual and Playwright evidence on representative desktop and mobile layouts.
- Durable docs updates only if implementation changes or clarifies the reusable
  manual image readability/translation contract.

Out of scope:

- Runtime PDF viewers, PDF.js, iframe/object/embed PDF loading, remote images,
  backend services, runtime network fetches, or live AI/OCR dependencies.
- Editing the official source archive pixels or translating inside protected
  images.
- Practice-question, exam-mode, source-reader, or unrelated product-surface
  changes.
- Treating feature `034` visual completeness records as whole-guide completion
  for this feature without refreshing the embedded-Spanish/readability
  inventory.

## Required User-Named Coverage

Implementation evidence must explicitly cover these groups:

- Appendix IV sign/marking/signal sheets:
  `app4-signs-horizontal`, `app4-signs-informational`,
  `app4-signs-traffic-lights`, `app4-signs-warning`,
  `app4-signs-temporary`, and `app4-signs-regulatory`.
- `app3-driving-factors`, especially `app3-body-posture-source-card` /
  `body-posture-source-as-is.png`.
- Safety elements across `app1`, `app2`, and `app3`: tire, blind spot,
  headrest, and belt/seatbelt visuals.
- `app2-highways-hospitals`, especially `app2-hospital-map-source-card`.
- `ch2-required-documents`: DNI, license, beginner sign, cedula, VTV, and RVA
  cards.
- `ch1-bicycle`: bicycle sign sheet and distance examples.
- `ch4-distractions` and `ch5-anticipatory-efficient-driving` quote/photo
  examples.

## Inventory Model

The implementation must create or extend an auditable inventory/evidence model
that records every manual-guide image reference. At minimum each image record
must include:

- `sectionId`, section title/source pages, and source module path.
- `blockKind`, `blockId`, and `cardId` or block-specific image id.
- Runtime image selector/test target and translation DOM selector when
  applicable.
- Asset path, natural dimensions, SHA-256, source page, source region, and
  extraction/source method when known.
- Display mode, `maxDisplayWidthPx`, `minDisplayWidthPx`, rendered desktop and
  mobile sizes, and no-upscale status.
- Whether the image contains visible Spanish text.
- Protected/source-as-is classification and the exact exception type when
  Spanish remains inside protected pixels.
- Embedded Spanish text inventory, with an item for each learner-relevant text
  unit or an explicit grouped entry when grouping is justified for dense
  catalog material.
- For each embedded Spanish text item: `termEs` or source phrase, text role
  such as `catalog-caption`, `sign-body`, `diagram-label`, `map-label`,
  `document-field`, `quote`, `sheet-heading`, or `decorative`, learner
  relevance, protected-pixel boundary, Russian DOM translation/caption, and
  coverage status.
- Readability status for intended-readable items: passed, fixed by crop/panel,
  fixed by contained natural-width display, source-limited exception, or not
  learner-relevant.
- Exception records with evidence, attempted alternatives, owner-disposition
  need if any, and whether Russian support is still provided outside the image.

## Coverage Thresholds

The audit must fail unless all of these are true:

1. Every current manual-guide image reference is represented in the inventory.
   The user-reported baseline is `50` sections, `82` image references,
   `54` images with Spanish text, and `33` problematic images. Implementation
   must refresh those counts from current code and record the current evidence.
2. Every image with `visibleSpanish: true` has either structured Russian DOM
   support for learner-relevant embedded text or an explicit evidence-backed
   exception. A generic `bodyRu` paragraph alone does not satisfy coverage when
   the image contains multiple labels/captions/terms.
3. `source-image-cards` should use the existing `termTranslations` rendering
   where it is sufficient. If richer fields are needed, extend the type in a
   compatible way and preserve the same nearby DOM pattern. Other image block
   types must get equivalent structured fields/rendering or be adapted into the
   same reusable support component.
4. For dense official sign, marking, signal, and catalog sheets, a whole sheet
   with only a group-level Russian summary is not accepted. Use readable
   panels, focused cards, high-resolution official crops, or grouped
   translation tables that let a learner map each visible external catalog
   caption/label to Russian. Do not translate sign bodies or plates inside the
   pixels.
5. Intended-readable embedded source text should render visually comparable to
   nearby manual body text. The minimum accepted baseline is: no browser
   upscaling; representative intended-readable text is at least `14px` rendered
   height and at least `90%` of the computed nearby manual body font size, or a
   stricter same-size criterion if the implementation can measure it reliably.
   If automated text-height measurement is not reliable, use manually reviewed
   screenshot evidence tied to the inventory record.
6. On mobile, preserved readability may use contained figure-level horizontal
   scrolling for fixed images. It must not create document-level overflow,
   overlap translation text, or shrink source text below the accepted threshold
   when a natural-width display is declared.
7. Exceptions are narrow. A source-limited exception must record attempted
   higher-quality official extraction, original/retained source search, tighter
   crop, split/panel/card strategy, and why those cannot meet the threshold
   without protected-pixel edits or upscaling. Translation coverage is still
   required unless the text is classified as not learner-relevant.

## Acceptance Criteria

- Whole-guide inventory is current, committed as evidence, and covers all
  manual-guide image-rendering block types.
- Every user-named group is fixed or explicitly dispositioned with evidence.
- `app3-body-posture-source-card` has structured Russian support for each
  meaningful Spanish posture/body/seat label and no longer relies only on a
  broad summary.
- App IV sign, marking, and signal sheets no longer depend on whole sheets plus
  generic `bodyRu`; learner-relevant external captions and labels have
  auditable Russian DOM support.
- Required document examples, bicycle visuals, hospital map, safety visuals,
  and quote/photo examples have itemized or justified grouped Russian support
  for embedded Spanish text.
- Protected source pixels remain unchanged except for allowed source-faithful
  cropping/splitting from official source material.
- Runtime layout keeps image and Russian support visually connected, selectable,
  responsive, and non-overlapping.
- New validation fails for missing structured Russian support, stale inventory,
  missing evidence files, source-fidelity-only acceptance, browser upscaling of
  intended-readable images, or unreviewed source-limited exceptions.
- Existing source-fidelity, visual-completeness, no-upscale, local-first,
  forbidden-runtime-pattern, navigation, and copy/provenance guards remain in
  force.

## Negative Scenarios

- `pnpm run validate:manual-guide` passes while visible-Spanish images lack
  per-label/per-quote/per-document Russian support.
- A dense sign sheet, map, document card, quote photo, or posture diagram uses
  only a broad `bodyRu` summary for multiple visible Spanish labels.
- The implementation fixes one reported file but leaves analogous App IV sheets
  in the same state.
- Images are simply enlarged by browser upscaling or phone-width downscaling is
  accepted as readable without evidence.
- Protected official pixels are translated, relabeled, cleaned, retouched,
  masked, reconstructed, or covered by Russian overlays.
- New validation relies on unchecked prose notes rather than structured image
  records, stable fingerprints, and existing-file/screenshot checks.

## Review And Final Validation Expectations

Review Agent must check the diff for role-boundary compliance, whole-guide
coverage, protected-image preservation, translation completeness, validator
strength, mobile/desktop layout safety, test coverage, and process-memory
currency. Review should specifically look for source-fidelity-only shortcuts
and generic `bodyRu` being counted as structured coverage.

Before Orchestrator finalization, the PR head must have green required checks,
accepted review, current process memory, evidence for every acceptance
criterion, final Architect validation before final Analyst validation, and all
final guards required by repository workflow.
