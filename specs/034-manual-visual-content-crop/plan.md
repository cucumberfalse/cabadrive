# Plan: Manual Visual Content Crop

## Technical Approach

Keep the feature `032` full-width card contract and add a source-asset quality
layer above it. The corrected result should not depend on making a bad image
bigger; it should make the meaningful official source region the image that is
rendered.

Preferred shape:

- Add a PDF-vs-runtime visual completeness audit that identifies
  learner-meaningful visual regions in the official manual and matches them to
  interactive guide blocks/assets.
- Add a repeatable inventory/detection path for manual visuals that can compute
  or record useful-content bounding boxes and excessive-margin ratios.
- Use the canonical PDF
  `content/official-documents/originals/gcba-manual-vehiculo-4-ruedas-2023.pdf`
  or best retained official source asset to re-export affected regions at high
  DPI/source-native quality.
- Replace or add crop-specific local assets for affected visuals.
- Update section data, implementation evidence, validation evidence, and tests
  so corrected assets carry source page, crop bounds, dimensions, hashes,
  runtime display size, and no-upscale proof.
- Preserve current renderer/CSS behavior from feature `032` unless crop metadata
  requires a small additive field or data attribute.

Do not solve the issue with CSS zoom, image transforms, or browser stretching.

## Readability Refinement

The post-PR user clarification adds a whole-document readability gate:
intended-readable text inside images should be visually no smaller than nearby
manual body text. This stays inside the current feature because it refines the
definition of "large enough to inspect" for the same image-content defect.

Current PR `#200` crop evidence is not enough by itself for this clarified
gate. Appendix IV crops are now tight, but their natural widths are only around
`664-757px` and evidence records that the official PDF raster is
source-limited. Implementation must prove the embedded labels/captions are
still visually comparable to document text, or it must attempt a better
official source/strategy and record any remaining source-limited exception for
Orchestrator/user disposition.

Latest user clarification supersedes the current Appendix IV source-limited
completion path for user-highlighted visuals. The implementation should not
ask the owner to accept tiny sign labels merely because whole-sheet extraction
from the manual PDF is source-limited. It must attempt a large-sign strategy:
direct official PDF/source-region extraction of individual signs or sign rows,
retained official original image assets where they are better, or another
source-faithful multi-panel layout that makes signs large without modifying
protected pixels.

For the hospital map, the implementation must revisit the current
`app2-hospital-map-source-card` with an official-original extraction target.
The map image remains protected source-as-is: no translation, cleanup, redraw,
mask, or relabeling inside the map. The goal is best available official source
quality and readable map labels at body-text-equivalent visual size.

Latest copy refinement: the runtime guide must stop exposing internal
source/provenance phrasing as learner-facing Russian copy. Evidence/spec fields
may keep technical source language, but rendered guide titles, captions, card
bodies, notes, and explanations should read like normal adapted Russian
learning material.

## Inventory Method

Implementation should create a systematic inventory before final asset changes.
The inventory has two layers: first, official PDF visual regions compared
against runtime guide visuals; second, quality/readability checks for visuals
that are present or newly added.

Inventory coverage:

- learner-meaningful visual regions visible in the official PDF/manual pages,
  including images, diagrams, photos, infographics, signs, maps, charts,
  source-document examples, labels, and meaningful safety icons;
- all current `source-image-cards` cards in `src/data/manual-sections/`;
- all `source-artwork` blocks;
- all bespoke/manual visual local asset references under
  `content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/`;
- any complete-manual page assets currently visible in the interactive guide;
- Appendix IV page-sheet assets `185-200` as a named group.

For each item, record:

- section id/file;
- block/card id when present;
- source page;
- asset path;
- natural dimensions;
- display mode/layout disposition where present;
- protected/source-as-is category and exception metadata;
- useful bbox and bbox/ink ratio where automated measurement is practical;
- risk disposition: `corrected`, `affected-pending`, `not-affected`,
  `acceptable-tight-crop`, `compact`, `source-limited-exception`, or a similar
  clear local enum;
- reason and reviewer note.

For each official PDF visual region, also record:

- PDF page and approximate source-region bounds;
- visual type: sign, marking, signal, map, diagram, chart, photo,
  infographic, object/icon, document example, or other;
- learner-meaningful classification and rationale;
- matching runtime section/block/card id, if present;
- disposition: `present`, `added`, `duplicate-covered`,
  `explicitly-omitted`, `missing-blocker`, or equivalent;
- if omitted or duplicate-covered, the reason and covering block;
- if added, the new asset path, runtime placement, dimensions, hash,
  display-size evidence, and no-upscale proof.

Add these fields for every image containing intended-readable text:

- text-readability relevance: `none`, `supporting`, `required`, or equivalent;
- smallest inspected/estimated source-image text sample;
- rendered text-height estimate or manual visual comparison result;
- nearby manual body text baseline from computed CSS or documented screenshot
  comparison;
- disposition: `readable`, `needs-larger-display`, `needs-better-source`,
  `source-limited-exception`, or equivalent;
- evidence path for screenshot/OCR/manual inspection.

For Appendix IV sign inventory, also record:

- whether a text sample is inside the sign/plate visual or external catalog
  caption;
- source crop boundary proving external captions are outside the protected sign
  body before translating them;
- per-sign or per-row output asset/path, source page, source region, dimensions,
  hash, and runtime display size when the implementation splits sheets;
- the Russian external caption text and its DOM location when translated.

For the hospital map inventory, record source-original search/extraction
attempts, final source path, output dimensions, label readability evidence, and
confirmation that map pixels/text are unmodified.

For runtime-copy inventory, scan learner-visible Russian strings in manual
section data and rendered guide components. Record each occurrence of banned or
suspicious provenance wording, the runtime field where it appears, the rewrite,
and any allowed exception. Do not count internal fields such as `sourceTextEs`,
`sourcePage`, `sourceRegion`, `assetPath`, `implementationEvidence`,
validation JSON, or specs/tasks as learner-facing copy unless the renderer
actually displays them to the learner.

The detector can be implemented with any repository-appropriate repeatable
method. A Playwright/canvas based scan is acceptable because Playwright is
already available and can inspect pixels without adding image-decoding
dependencies. A pure Node image decoder or documented platform script is also
acceptable if it is deterministic and recorded. If a one-off platform helper is
used for extraction, the committed evidence must still make the result
reviewable in normal repo checks.

Use the initial RGB `<245` non-white threshold from Orchestrator evidence as a
starting point. If the implementation refines the threshold, record why.

## Visual Completeness Audit

The latest user clarification makes visual completeness a same-cycle gate. Do
not limit the scan to existing `source-image-card` and `source-artwork` entries:
Implementation must inspect the official PDF/manual and identify visuals that
teach or identify exam-relevant content even when they are currently absent
from runtime data.

Conservative inclusion rule:

- include visuals that convey a rule, risk, classification, comparison,
  example, diagram, map, sign, marking, signal, chart, photo, object, icon, or
  label;
- allow omission only for decorative/background/page-furniture visuals or
  repeated simple icons whose learning meaning is fully covered elsewhere;
- name the runtime block that covers a duplicate visual.

Concrete required missing-image candidates:

- Tire manufacturing/date and tread-life visual with `Fecha de Fabricación`
  and `Vida útil de los Neumáticos`: locate exact source page/section, export
  the full learner-meaningful region including the tire photo/date callout,
  tread-life chart, and associated bullet text, then insert it at readable
  manual scale or record a narrow official-source blocker.
- Blind-spot full-width visual headed `¿A qué se denomina punto ciego?` with
  `PUNTO CIEGO AUTOS`, `PUNTO CIEGO MOTOS`, `CAMIONES Y COLECTIVOS`, and
  `Cuanto más grande es el vehículo, mayor es el punto ciego.` Locate exact
  runtime owner, likely around the mirrors/blind-spots content where source
  text references official page `108` and possibly related page `128`, export
  from the official original, and display as-is at full-width scale with no
  extra blank fields.
- `Matafuegos` and `Chaleco reflectivo`: locate exact source page/section and
  add the official visuals/icons at normal size. For `Matafuegos`, compare the
  visual height to surrounding document body text; the user's anchor is about
  `15` lines high, so implementation should not collapse it into a thumbnail.
- Headrest diagrams: keep the official image intact, including Spanish terms
  such as `Altura apoyacabeza`, `Distancia del apoyacabeza`, `Bueno`,
  `Aceptable`, `Regular`, `Malo`, and `Botón de desbloqueo`; add Russian term
  translations as separate selectable DOM text below/near the image.
- Sustainable mobility/public-space visual: replace the current low-quality or
  reconstructed Russian visual headed
  `СКОЛЬКО МЕСТА НУЖНО 50 ЛЮДЯМ, ЧТОБЫ ПЕРЕДВИГАТЬСЯ?` with the original
  official image, keep protected image text unchanged, and add Russian
  translations for terms such as by bus, walking, bicycle, and car outside the
  image. Runtime size should preserve the original image-to-text relationship.

For each added candidate, update runtime data, source-fidelity evidence,
content tests, and Playwright/visual evidence. If an official visual cannot be
faithfully extracted, record the PDF/source attempts and route a
`missing-blocker` to Orchestrator/human; do not silently omit it.

## Crop And Export Method

Likely extraction path:

1. Locate the source PDF page and approximate useful bbox from the detector.
2. Manually review the bbox against the source page to avoid clipping tiny
   labels, captions, or meaningful whitespace inside a sign/marking sheet.
3. Add safety padding around the useful region.
4. Re-render the source page/region from the official PDF at a scale high
   enough that the final crop natural width is at least the intended maximum
   CSS display width. Prefer extra density for high-DPI screens when feasible.
5. Crop from that high-DPI render or source-native extraction.
6. Save a local asset with loss settings that preserve labels and sign edges.
7. Compute dimensions and SHA-256.
8. Update data/evidence to point at the corrected crop and cap display at or
   below the natural crop width.

Existing `scripts/render-manual-pdf-pages.swift` may be extended or used as a
reference for PDF rendering. A new helper is acceptable if it is clearly scoped
to high-DPI region extraction and is not part of runtime behavior.

If the official PDF embeds a low-resolution raster and higher-DPI export does
not improve source detail, record the source limitation and cap display; do not
retouch or upscale.

If embedded text remains smaller than nearby manual body text after a
source-faithful crop, do not stop at the source limitation. First check whether
a better official source or source-faithful strategy is available, such as:

- a higher-quality official PDF/source asset already archived in the repo;
- official sign/marking/signal source images from another governed official
  document retained under `content/official-documents/`;
- splitting an official sheet into smaller official sub-crops so each protected
  source region can render larger without pixel upscaling;
- presenting multiple official crop panels for one low-resolution page sheet
  when that is the only source-faithful way to make labels readable.

Any such strategy must preserve protected pixels and source provenance. If no
strategy can satisfy the readability target, record a source-limited exception
with attempted alternatives and send it back to Orchestrator for user
disposition before review/final validation.

Direct PDF/source-region helper direction:

- The interrupted `scripts/manual-visual-content-crops.swift` direction adding
  direct PDF source-region render/probe support is useful supporting machinery
  and should be preserved by Implementation Agent.
- It is insufficient by itself if it only proves whole-sheet raster source
  limitation. It must be adapted or supplemented to target individual signs,
  sign rows, the hospital map source region, and probe scales/strategies that
  can demonstrate maximum practical official-original quality.
- If the helper cannot reliably render a region at the needed quality,
  Implementation Agent should record the failure with probe evidence and try a
  different official source/strategy rather than reverting to browser upscaling
  or protected-pixel edits.

## Asset Naming And Provenance

Prefer new crop-specific names for corrected affected assets, for example:

- `sign-sheet-185-source-crop-as-is.jpg`
- `sign-sheet-186-source-crop-as-is.jpg`
- `marking-sheet-195-source-crop-as-is.jpg`

Naming should preserve the protected source-as-is meaning while making clear
that the visible runtime asset is a meaningful source crop, not the full PDF
page. If implementation replaces an existing path instead, it must update
process memory and tests so stale full-page assumptions are impossible.

For each corrected asset, update or add evidence fields for:

- original source document path and page;
- crop source coordinate system;
- crop bounds;
- extraction scale/method;
- output dimensions;
- output SHA-256;
- before/after useful-content ratio;
- runtime max display width and no-upscale status;
- protected pixel policy: source-faithful crop only, no visual edits.

Do not leave corrected page-sheet cards with `sourceRegion:
{ x: 0, y: 0, width: 2976, height: 4209 }` unless the entire page is the
meaningful source visual and the inventory records why it is not a margin
defect.

## Data And Renderer

Expected file areas for Implementation Agent:

- `src/data/manual-sections/app4-signs-regulatory.ts` and sibling Appendix IV
  section files for corrected asset paths, source regions, dimensions, and
  visual notes.
- Other `src/data/manual-sections/*` files only for inventory-confirmed
  affected visuals.
- `src/data/manualGuide.ts` only if the data model needs a reusable
  crop/useful-content metadata field.
- `src/App.tsx` only if runtime data attributes are needed for useful-content
  evidence; preserve existing `displayMode`, source exception, and lazy-loading
  attributes.
- `src/data/manual-sections/*` for learner-facing Russian copy rewrites such as
  visual-card titles, `bodyRu`, `visualNotes`, `noteRu`, captions, and
  section-specific explanation text.
- `src/styles.css` only for minimal preservation of feature `032` behavior; CSS
  cannot be the primary crop fix.
- `content/assets/manuals/.../sections/...` for corrected crop assets.
- `content/validation/manual-guide-source-fidelity.evidence.json` or a new
  focused evidence JSON for inventory/crop measurements.
- `tests/content-manual-guide-chapters.test.mjs` and
  `tests/e2e/app.spec.ts` for regression coverage.
- `docs_project/project/frontend/manual-conversion-guidelines.md` only if a
  reusable crop/inventory/evidence rule is introduced or clarified.
- `specs/034-manual-visual-content-crop/tasks.md` for process memory.

The current full-width card metadata should remain meaningful:

- `displayMode: "full-width"` still controls layout.
- `maxDisplayWidthPx` must cap display at corrected natural width.
- `minDisplayWidthPx` for panoramic cards remains contained visual-only scroll,
  not document-level overflow.
- protected exception attributes must continue to render:
  `data-official-sign-exception`, `data-source-image-exception`,
  `data-visible-spanish-scope`, and `data-source-as-is`.

## Priority Candidates

Must correct unless a blocker is recorded:

| Candidate | Current evidence | Required disposition |
| --- | --- | --- |
| `app4-regulatory-page-185-source-card` | bbox area ratio `0.0330` | high-DPI source crop |
| `app4-regulatory-page-186-source-card` | bbox area ratio `0.0357` | high-DPI source crop |

High-priority inspect/correct group:

| Section | Pages | Reason |
| --- | ---: | --- |
| `app4-signs-regulatory` | `185-186` | reported defect |
| `app4-signs-warning` | `187-188` | same page-sheet pattern, page `187` ratio `0.0335` |
| `app4-signs-informational` | `189-192` | same page-sheet pattern |
| `app4-signs-temporary` | `193-194` | same page-sheet pattern |
| `app4-signs-horizontal` | `195-196` | page `195` ratio `0.0336` |
| `app4-signs-traffic-lights` | `197-200` | same page-sheet pattern |

For Appendix IV, expected implementation now shifts from "corrected sheet crop"
to "large official sign fragments/rows/panels plus translated external
captions where allowed." Whole-sheet crops may remain as overview/context, but
they do not satisfy the latest acceptance criteria alone.

Likely not affected by this margin-heavy defect but still inventory-required:

- `hospital-map-source-as-is.png`, ratio `0.4205`, already a relatively tight
  crop and source-as-is map exception.
- `body-posture-source-as-is.png`, ratio `0.3652`, already a relatively tight
  crop.
- Compact document/license/headrest snippets accepted by feature `032` only if
  the new inventory confirms they are genuinely compact.

New text-size priority candidates:

- Appendix IV pages `185-200`, because each sheet includes many small Spanish
  source labels/captions and current crop widths may be too small for the
  user's body-text-size criterion.
- Source-document examples in `ch2-required-documents`, because their document
  text may be source-visible and learner-relevant.
- Maps/diagrams with labels, especially hospital map and body posture, even
  when their crop ratios are already acceptable.
- Source-artwork/infographic blocks that keep visible source text under an
  approved exception.

Additional latest-priority candidates:

- Individual `NO AVANZAR`-style regulatory signs and their external captions,
  using the official/original PDF/source at maximum practical quality.
- Hospital map card `app2-hospital-map-source-card`, which must be rechecked
  against the official original rather than treated as already acceptable only
  because its bbox ratio is relatively tight.
- Tire manufacturing/date and tread-life visual with `Fecha de Fabricación`
  and `Vida útil de los Neumáticos`, because the user reports it as a missing
  official learner visual.
- Blind-spot full-width visual with `¿A qué se denomina punto ciego?`,
  `PUNTO CIEGO AUTOS`, `PUNTO CIEGO MOTOS`, `CAMIONES Y COLECTIVOS`, and the
  blue sentence `Cuanto más grande es el vehículo, mayor es el punto ciego.`,
  because it is an official full-width visual that should not be reduced to
  missing text-only summary.
- `Matafuegos` and `Chaleco reflectivo` official visuals/icons, because the
  user reports them as missing and expects normal original-scale display; for
  `Matafuegos`, use the approximate `15` body-text-line visual-height anchor.
- Headrest diagrams/terminology, because the latest requirement says they must
  be displayed as the original image, with Russian term translations outside
  the protected image.
- Sustainable mobility/public-space visual about how much space `50` people
  need to move by bus, walking, bicycle, or car, because the current runtime
  Russian version appears low-quality/pixelated or reconstructed and must be
  replaced by the official original.
- Runtime copy examples explicitly called out by the user:
  `Визуал источника: правильный ремень`,
  `Визуал источника: положение подголовника`,
  `Фотографии сохранены как исходный фрагмент...`, and
  `Главный вывод источника`.
- Whole-guide Russian copy using `источник`, `из источника`,
  `исходный фрагмент`, `рабочий фрагмент`, `исходная схема`,
  `исходная карта`, `исходные примеры`, or similar as visual provenance
  shorthand.

## Testing Strategy

Content/static tests:

- Require `scripts/manual-guide-visual-completeness-audit.mjs` to default to
  read-only/check behavior for validation and build paths. The script may
  support evidence regeneration only through an explicit `--write` or similarly
  named generate mode.
- Assert check mode compares freshly computed visual-completeness evidence
  against
  `content/validation/manual-guide-visual-completeness.evidence.json` and
  fails when the committed file is stale, missing, malformed, or different.
  The failure should be clear enough for an Implementation Agent to rerun the
  explicit write/generate command intentionally.
- Assert validation/build package scripts use check mode and do not rewrite the
  tracked evidence file as a side effect. A focused test may hash or stat the
  evidence file before/after check mode, or use a stale fixture/temp copy to
  prove stale committed evidence fails instead of being silently regenerated.
- Require a PDF-vs-runtime visual completeness inventory with dispositions for
  official learner-meaningful visual regions, not only current runtime image
  assets.
- Assert every official learner-meaningful visual is present, added,
  duplicate-covered, explicitly omitted with rationale, or recorded as a
  narrow blocker.
- Assert the required missing-image candidates are located and added or
  narrowly blocked: tire manufacturing/date and tread-life visual, blind-spot
  full-width visual, `Matafuegos`, `Chaleco reflectivo`, headrest diagrams,
  and the public-space `50` people mobility visual.
- Require a complete manual visual inventory or structured evidence file.
- Assert reported pages `185` and `186` no longer use full-page source-region
  evidence with a `~0.03` useful bbox ratio.
- Assert Appendix IV pages `185-200` have scan/disposition records and all
  below-threshold page-sheet assets are corrected or explicitly excepted.
- Assert corrected crop assets exist, have readable dimensions, valid hashes,
  source page/crop bounds, extraction method, and no-upscale metadata.
- Assert protected source-as-is exceptions remain present for official signs,
  road markings, signals, maps, photos, and source-document examples.
- Assert existing feature `032` display-mode inventory stays complete and
  no new card-id-specific CSS selectors become the crop mechanism.
- Assert already tight crops are not forced through unnecessary recrops without
  evidence.
- Require text-readability dispositions for every inventoried image with
  intended-readable embedded text.
- Assert Appendix IV pages `185-200` have text-readability evidence, not only
  useful bbox evidence.
- Assert Appendix IV sign rendering uses large source-faithful sign fragments,
  rows, or panels when whole sheets fail the text-size target.
- Assert translated Russian captions are present only for external source
  captions/labels and are rendered as DOM/SVG text outside protected sign
  pixels.
- Assert no text inside a protected sign body, supplementary plate/tablet, or
  sign placard is translated, masked, removed, or replaced.
- Assert the hospital map uses a best-available official source extraction,
  remains unmodified inside the image, and has map-label readability evidence.
- Assert protected images with Spanish terms, including headrest diagrams and
  the public-space mobility visual, keep image internals unchanged and expose
  Russian translations only as separate DOM text below/near the image.
- Assert any `source-limited-exception` records attempted better official
  source/strategy checks and are called out in process memory for
  Orchestrator/user disposition.
- Add or update a runtime-copy audit test that extracts learner-facing Russian
  strings from the manual guide data/components and fails on banned
  source/provenance wording, while allowing internal technical fields.
- Assert the specific bad examples named by the user no longer appear in
  learner-facing runtime strings.
- Assert any remaining `источник` occurrence in learner-facing Russian is
  explicitly allowlisted as a legal/source citation context, not a visual-card
  provenance label.

Playwright tests:

- Navigate to `/#manual-section-app4-signs-regulatory` at desktop and mobile.
- For page `185` and `186`, compute image element metrics and useful-content
  bbox metrics. The assertion must compare the useful bbox inside the image to
  the manual content/card width, not only the outer image width.
- Assert corrected useful-content rendered width is at least `65%` of the
  containing manual content/card width when natural dimensions allow.
- Assert image CSS display width does not exceed natural asset width.
- Assert desktop display is far above the old tiny-content result and mobile
  display is inspectable without document-level horizontal overflow.
- Capture screenshots for the reported section.
- Add representative checks for another corrected Appendix IV sheet and at
  least one non-Appendix corrected asset if the inventory finds any.
- Keep existing feature `032` scenarios passing for hospital map, body posture,
  panoramic mirror card, and representative full-width cards.
- Where feasible, compare a sampled embedded text region against nearby
  document body text by OCR, image-processing text-height estimate, or a
  screenshot/manual-inspection protocol recorded in evidence. Automated
  measurement is preferred but not required if it is unreliable for tiny source
  labels; manual inspection must be explicit and representative.
- Capture desktop and mobile screenshots that include the corrected image and
  nearby manual body text in the same viewport for visual comparison.
- Capture representative Appendix IV screenshots that show individual signs
  large enough to inspect and external Russian captions beside/below them.
- Capture hospital map desktop/mobile screenshots with nearby body text and
  label-readability comparison evidence.
- Capture screenshots for the added tire, blind-spot, `Matafuegos`,
  `Chaleco reflectivo`, headrest, and public-space mobility visuals, including
  nearby body text where practical.
- For simple object/icon visuals such as `Matafuegos`, compare the rendered
  visual height to body-text line height and record whether it preserves the
  official scale relationship instead of becoming a thumbnail.
- Where useful, capture DOM/screenshot evidence for representative rewritten
  visual cards so review can see normal learning copy in place of provenance
  wording.

Standard checks:

- Run focused audit check/write split tests proving validation/build check mode
  does not rewrite
  `content/validation/manual-guide-visual-completeness.evidence.json` and
  fails on stale committed evidence.
- Run focused blind-spot provenance tests proving the official source page is
  `108` in runtime/source metadata and rendered `data-source-page`, while any
  PDF/render page offset `109` is kept only in explicitly named internal
  evidence fields.
- Recheck the blind-spot asset dimensions/hash after the metadata fix to prove
  protected image pixels were not changed.
- Run focused content/static tests early.
- Run `pnpm run validate:manual-guide`, `pnpm run validate:content`,
  `pnpm exec tsc --noEmit`, `pnpm run test`, `pnpm run build`, focused
  Playwright, and `git diff --check`.
- Run full `pnpm run preflight` before PR readiness if feasible.

## Documentation

Update `docs_project/project/frontend/manual-conversion-guidelines.md` only if
the implementation adds reusable rules such as:

- whole-manual excessive-margin/useful-content inventory;
- whole-document PDF-vs-runtime visual completeness audit for missing
  learner-meaningful visuals;
- required useful-content bbox ratio evidence;
- whole-manual source-image embedded-text readability evidence;
- source-faithful individual sign/row extraction and translated external
  caption rules;
- hospital map official-original extraction and protected map-pixel rules;
- runtime learner-facing copy must avoid provenance/service wording such as
  `Визуал источника`, `исходный фрагмент`, and `Главный вывод источника`;
- crop-specific asset naming/provenance;
- high-DPI source-region extraction beyond current x5 page renders;
- regression checks for tiny useful-content islands.

Do not update durable docs merely to restate this feature's process notes.

## Review Focus

Review Agent should especially check:

- validation/build package scripts run the visual-completeness audit in
  read-only check mode, and evidence regeneration requires explicit write mode;
- stale
  `content/validation/manual-guide-visual-completeness.evidence.json` causes a
  failing check instead of being rewritten silently;
- the reported screenshot symptom is fixed by source extraction/cropping, not
  CSS scale;
- missing learner-meaningful PDF visuals were found by a PDF-vs-runtime audit,
  not by only looking at current runtime assets;
- the tire, blind-spot, `Matafuegos`, and `Chaleco reflectivo` candidates are
  present at faithful quality/scale or narrowly dispositioned;
- headrest and public-space mobility visuals use protected official images
  with separate Russian translations outside the image;
- useful-content bbox evidence proves the signs themselves are large;
- embedded image text is visually comparable to body text, or source-limited
  exceptions are explicit and routed;
- Appendix IV uses large individual signs/fragments or an equivalent
  source-faithful layout, not only a whole tiny sheet;
- external sign captions are translated only outside protected sign pixels;
- hospital map labels are readable and unmodified inside the map image;
- blind-spot provenance metadata exposes official printed/manual page `108`
  to learners/runtime audits and does not expose the PDF/render page offset
  `109` as `data-source-page`;
- blind-spot metadata/evidence/tests preserve the existing protected image
  asset pixels, dimensions, and hash while correcting only provenance fields;
- runtime guide copy is natural adapted Russian and does not leak
  source/provenance service wording into learner-facing labels/explanations;
- Appendix IV siblings were not missed;
- protected source imagery was not edited;
- no corrected crop is displayed beyond natural/source quality;
- inventory evidence covers the whole manual visual set;
- feature `032` full-width/no-upscale/panoramic behavior did not regress;
- mobile has no incoherent document-level overflow;
- feature memory is current and evidence-backed.

## Risks And Mitigations

- Risk: automatic crop clips tiny official labels.
  Mitigation: manual review plus safety padding around detector bbox.

- Risk: high-DPI extraction from the current PDF still produces limited detail.
  Mitigation: record source limitation and cap display; do not upscale/retouch.

- Risk: broad correction creates large image diffs.
  Mitigation: prioritize below-threshold assets and use appropriate JPEG/PNG
  output settings with evidence.

- Risk: tests only prove the image element is full-width.
  Mitigation: require useful-content bbox measurements inside the image.

- Risk: crop-specific naming conflicts with existing source-as-is tests.
  Mitigation: update provenance/evidence together and assert protected pixels
  are source-faithful crops, not edited assets.

## Architect Disposition

No additional user clarification is required. The main open implementation
decision is tooling shape for repeatable useful-content bbox measurement. Any
approach is acceptable if it is deterministic enough for review, records the
threshold/method, and backs acceptance with committed evidence.

## Current-Head AI Review Follow-Up Plan - `ec2125ffa28cc5b079f7c0ed777b1ef9aba5e097`

Architect accepts both current-head P2 findings as same-cycle required fixes.
Implementation Agent must:

- Update the visual-completeness audit/evidence semantics so partial statuses
  such as `implemented-app1-only` remain visible in remaining or disposition
  evidence unless the residual App2/App3 scope is explicitly validated against
  the original user request as out of scope. Do not let a generic
  `implemented*` prefix filter make whole-document evidence pass prematurely.
- Correct the learner-facing Russian translation for `NO AVANZAR` everywhere
  visible and evidence-tested, likely to `Проезд запрещен` or an equivalent
  phrase. Keep all protected sign/panel image pixels unchanged.
- Add or update focused tests/audit assertions and evidence so review can see
  both fixes: partial app-specific residual scope is still surfaced, and the
  corrected `NO AVANZAR` translation appears in runtime/evidence without the
  misleading straight-ahead-only wording.

## Current-Head AI Review And CI Follow-Up Plan - `d062fee35daa445d2caadbd2770900d1b93d2263`

Architect accepts the new AI Review P2 and current CI failure as same-cycle
blockers. Implementation Agent must:

- Fix the learner-facing provenance-copy audit in
  `scripts/manual-guide-visual-completeness-audit.mjs` so Cyrillic source-word
  patterns do not depend on ASCII `\b` boundaries. Use Unicode-aware
  lookarounds, Unicode property escapes where repository/runtime support
  allows them, or explicit Cyrillic/non-Cyrillic boundary checks. The audit
  must catch `источник`, `источника`, `из источника`,
  `Визуал источника`, `Главный вывод источника`, and similar forbidden
  provenance copy in learner-visible fields.
- Preserve semantic allowlisting for legitimate non-provenance usage such as
  `источник стресса`. The allowlist should be specific enough that it does not
  reopen visual/source provenance labels.
- Add focused test coverage for the Unicode/Cyrillic boundary behavior,
  including at least one inflected forbidden form (`источника`) and the
  allowed `источник стресса` phrase.
- Stabilize the e2e image sizing path used by
  `Manual guide full-width source image cards stay readable and avoid
  upscaling`. The helper should avoid an unbounded `image.decode()` wait,
  support lazy-loaded/manual images deterministically, and fail with a clear
  diagnostic for broken images, zero natural dimensions, unreadable content, or
  upscaled display. Do not remove the no-upscale or useful-content readability
  intent of the test.
- Record verification for both blockers: focused audit tests,
  `node scripts/manual-guide-visual-completeness-audit.mjs`, the focused
  Playwright grep in the same project(s) that failed CI where feasible,
  `node scripts/check-feature-memory.mjs --worktree`, and `git diff --check`.
