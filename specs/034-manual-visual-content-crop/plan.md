# Plan: Manual Visual Content Crop

## Technical Approach

Keep the feature `032` full-width card contract and add a source-asset quality
layer above it. The corrected result should not depend on making a bad image
bigger; it should make the meaningful official source region the image that is
rendered.

Preferred shape:

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

## Inventory Method

Implementation should create a systematic inventory before final asset changes.

Inventory coverage:

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

The detector can be implemented with any repository-appropriate repeatable
method. A Playwright/canvas based scan is acceptable because Playwright is
already available and can inspect pixels without adding image-decoding
dependencies. A pure Node image decoder or documented platform script is also
acceptable if it is deterministic and recorded. If a one-off platform helper is
used for extraction, the committed evidence must still make the result
reviewable in normal repo checks.

Use the initial RGB `<245` non-white threshold from Orchestrator evidence as a
starting point. If the implementation refines the threshold, record why.

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

Likely not affected by this margin-heavy defect but still inventory-required:

- `hospital-map-source-as-is.png`, ratio `0.4205`, already a relatively tight
  crop and source-as-is map exception.
- `body-posture-source-as-is.png`, ratio `0.3652`, already a relatively tight
  crop.
- Compact document/license/headrest snippets accepted by feature `032` only if
  the new inventory confirms they are genuinely compact.

## Testing Strategy

Content/static tests:

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

Standard checks:

- Run focused content/static tests early.
- Run `pnpm run validate:manual-guide`, `pnpm run validate:content`,
  `pnpm exec tsc --noEmit`, `pnpm run test`, `pnpm run build`, focused
  Playwright, and `git diff --check`.
- Run full `pnpm run preflight` before PR readiness if feasible.

## Documentation

Update `docs_project/project/frontend/manual-conversion-guidelines.md` only if
the implementation adds reusable rules such as:

- whole-manual excessive-margin/useful-content inventory;
- required useful-content bbox ratio evidence;
- crop-specific asset naming/provenance;
- high-DPI source-region extraction beyond current x5 page renders;
- regression checks for tiny useful-content islands.

Do not update durable docs merely to restate this feature's process notes.

## Review Focus

Review Agent should especially check:

- the reported screenshot symptom is fixed by source extraction/cropping, not
  CSS scale;
- useful-content bbox evidence proves the signs themselves are large;
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
