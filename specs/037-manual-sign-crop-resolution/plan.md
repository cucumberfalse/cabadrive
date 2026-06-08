# Plan: Manual Sign Crop Accuracy And 3x Resolution Re-Extraction

## Architecture Direction

Use the final feature `036` reconciled source inventory as the ordering and caption baseline, but replace the learner-facing visual delivery path for sign-like entries. The current runtime clips tiny regions from low-resolution source-sheet images through CSS. That design preserved pixels but failed the user's quality and crop-accuracy expectations.

The conservative target for feature `037` is:

- committed per-entry high-resolution official-source crop assets for all `catalog-entry` rows;
- committed per-entry high-resolution official-source crop assets for retained `contextual-visual` rows;
- semantic DOM headings for `category-heading` rows;
- inventory fields and validation that prove per-row `3x` output-pixel dimensions, effective/native source-detail status, corrected crop audit, no-upscale runtime display, and protected-source preservation.

High-resolution sheet clipping is allowed only as an intermediate extraction technique or as a narrow Architect-disposed fallback. It must not repeat the current failure mode of clipping small regions from the existing `664-757px` source-sheet crops.

Follow-up disposition `2026-06-07T21:16:39Z`: Implementation's source blocker is accepted. The official CABA PDF scale-15 probe and retained Anexo L panel inspection are not enough for final all-row `3x` evidence. Continue the same feature with a mandatory source-evaluation gate before final crop generation; exact `3x` remains the primary target, and source-limited exceptions are allowed only row-by-row under the contract in `spec.md`.

Second follow-up disposition `2026-06-07T21:36:51Z`: the mandatory source-evaluation gate is complete and shows `286/286` sign-like rows are source-limited, with `0` exact native/effective `3x` candidates and all six sections over the previous exception threshold. The plan now accepts an all-row best-official-source fallback: generate corrected per-row crops with at least `3x` output pixels from the exact official source, disclose source limitation, and keep source-limited rows out of true native/effective `3x` pass counts. This is the only accepted way to continue without fabricating detail.

## Implementation Strategy

1. Snapshot the current baseline.
   - Read `src/data/manual-signs/app4SignEntries.json` from the assigned branch before implementation edits.
   - Write feature `037` baseline evidence under `specs/037-manual-sign-crop-resolution/evidence/baseline/`.
   - Preserve all `316` baseline row ids, counts, sections, source pages, entry kinds, crop dimensions, render modes, and hashes.

2. Preserve the `036` reconciled inventory model as the seed.
   - Keep the visual row order, caption mapping, section mapping, and entry kind decisions unless a specific row is proven wrong.
   - Record any correction to the `036` inventory as an explicit process-memory item requiring Architect disposition.

3. Complete the source-evaluation gate.
   - Acquire or verify the official/public sources named in `spec.md`, including the CABA manual PDF, retained Anexo L panels, Argentina.gob.ar Anexo L/ANSV sources, and researched GCBA official variant PDFs.
   - Archive newly used official source files under `content/official-documents/originals/` or a clearly named subfolder, with hashes and source URLs in evidence.
   - Write `specs/037-manual-sign-crop-resolution/evidence/source-evaluation/source-manifest.json`.
   - Write `specs/037-manual-sign-crop-resolution/evidence/source-evaluation/row-source-mapping.json` covering all sign-like rows.
   - For each row, classify source candidates as exact visual match, variant mismatch, insufficient resolution, no coverage, unavailable, or chosen best official source.
   - Historical gate result: source-limited exceptions exceeded `28` sign-like rows and `20%` of every section, and Architect disposed that result in `spec.md` at `2026-06-07T21:36:51Z`.
   - Do not stop again solely because the already evaluated `286/286` sign-like rows are source-limited; do stop if later evidence changes row counts, introduces unproven source substitutions, or claims exact native/effective `3x` without proof.

4. Re-extract final visuals from official source material.
   - Default final source after the completed source-evaluation gate: `content/official-documents/originals/gcba-manual-vehiculo-4-ruedas-2023.pdf`, because it remains the only exact row-order/caption source for all rows.
   - Prefer a higher-resolution exact-match official Argentina.gob.ar/ANSV/GCBA source only when the row-source mapping is updated with proof that it is exact for that row, including visual face, plates/tablets, arrows, labels, and variant meaning.
   - Use each row's `sourceRegion` plus `cropRegion` mapping to locate the corresponding official PDF/source page region.
   - Render/crop source-faithfully at a scale that makes the final output file at least `3x` the baseline row's current natural crop width and height.
   - For rows that remain source-limited, record `threeXStatus: "source-limited-exception"` plus a disposition such as `best-official-source-3x-output-pixels`; do not call those rows exact native/effective `3x` passes.
   - Do not sharpen, clean up, redraw, vectorize, recolor, denoise, OCR/retype, translate embedded pixels, or otherwise improve protected image pixels after source rendering/cropping.
   - Prefer PNG for signs, markings, traffic lights, labels, and line art.
   - Prefer direct per-entry assets in a stable folder such as `content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/<section-id>/individual-3x/`.
   - Do not upscale the current feature `036` clipped output to manufacture dimensions.

5. Correct crop bounds while extracting.
   - Every final visual row must be checked against the official source page.
   - Crop boundaries must include all protected visual content that belongs to the entry, including plates/tablets, arrows, embedded labels, multi-part sign parts, markings, and signal heads.
   - Crop boundaries must exclude neighboring entries and unrelated text.
   - Edge checks should flag crops with meaningful non-white/non-transparent content touching the outer crop edge unless a reviewer records that the official item genuinely touches that edge.

6. Update runtime data and renderer.
   - Extend or replace the current `ManualSignEntry` data shape so sign-like rows reference final output assets directly.
   - Use a render mode such as `individual-source-crop-3x` for final sign-like assets.
   - Keep category headings as DOM text/grouping, not as image crops, unless there is a documented reason to retain source-heading pixels.
   - The UI may retain the existing card/grid language but should no longer render sign-like entries through `ManualSignSourceClip` over low-resolution sheet assets.
   - Display caps must ensure CSS display width/height do not exceed the final asset's natural dimensions.

7. Validate and evidence the full catalog.
   - Validation must cover all `316` baseline rows, not a representative subset.
   - Evidence must include all six sections and all final rows.
   - Contact sheets must show final images with Spanish/Russian captions, entry id, source page, baseline dimensions, final dimensions, scale ratios, and crop audit status.

## File And Asset Scope

Likely implementation files:

- `scripts/manual-sign-inventory.mjs`
- `scripts/manual-visual-content-crops.swift` or a new tightly scoped sign crop helper
- `src/data/manual-signs/app4SignEntries.json`
- `src/data/manual-signs/app4SignCatalog.ts`
- `src/App.tsx`
- `src/styles.css`
- `tests/manual-sign-inventory.test.mjs`
- possibly focused visual/evidence generation scripts under `scripts/`
- possibly manual-section files only if category heading rendering or block metadata needs a small change

Likely new runtime assets:

- `content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/app4-signs-regulatory/individual-3x/*.png`
- `content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/app4-signs-warning/individual-3x/*.png`
- `content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/app4-signs-informational/individual-3x/*.png`
- `content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/app4-signs-temporary/individual-3x/*.png`
- `content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/app4-signs-horizontal/individual-3x/*.png`
- `content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/app4-signs-traffic-lights/individual-3x/*.png`

Likely evidence files:

- `specs/037-manual-sign-crop-resolution/evidence/baseline/manual-sign-baseline-036.json`
- `specs/037-manual-sign-crop-resolution/evidence/source-evaluation/source-manifest.json`
- `specs/037-manual-sign-crop-resolution/evidence/source-evaluation/row-source-mapping.json`
- `specs/037-manual-sign-crop-resolution/evidence/final/manual-sign-crop-resolution-summary.json`
- `specs/037-manual-sign-crop-resolution/evidence/final/manual-sign-crop-resolution-rows.json`
- `specs/037-manual-sign-crop-resolution/evidence/contact-sheets/*.png`
- `specs/037-manual-sign-crop-resolution/evidence/screenshots/*.png`
- `specs/037-manual-sign-crop-resolution/evidence/screenshots/visual-qa-summary.json`

Durable docs outside `specs/037` should be changed only if Implementation creates a reusable asset/extraction contract that future manual work must follow.

## Extraction Method Guidance

Implementation may extend `scripts/manual-visual-content-crops.swift`, create a focused sign-crop helper, or use another deterministic local script. The script should:

- load the official PDF or better official source asset;
- load the source-evaluation manifest and row-source mapping before choosing an extraction source;
- map each baseline row to source-page coordinates;
- render or extract at a configured target scale;
- crop the row's intended source region;
- write final output assets;
- compute dimensions and SHA-256 hashes;
- write row-level extraction evidence;
- fail on missing rows, out-of-bounds regions, undersized outputs, missing hashes, or pending audit statuses.
- fail on missing source-evaluation records or source-limited rows that do not satisfy the exception contract.

When rendering from the official PDF, record:

- source PDF path and hash if practical;
- source page;
- base coordinate system;
- render scale or DPI;
- crop source bounds;
- output path;
- output dimensions;
- output hash;
- whether the result met the 3x target;
- whether the result is a true native/effective 3x pass or a source-limited 3x-output-pixel crop.

If a retained official source asset is better than the PDF render for a row, record the asset identity, dimensions, hash, and reason it is official and preferable.

When using newly acquired official sources, record the source URL, archived path, hash, issuer, page/item reference, exact-match rationale, and rejected-candidate rationale. If a PDF render produces more file pixels than the source's effective raster detail, compute quality ratios from the effective source detail, not from interpolated output dimensions.

## Baseline And 3x Evidence

The baseline evidence must preserve the current feature `036` crop dimensions before changes. The final evidence must join every final row to that baseline and compute:

- `baselineCropNaturalWidth`
- `baselineCropNaturalHeight`
- `finalOutputNaturalWidth`
- `finalOutputNaturalHeight`
- `qualityScaleRatioWidth`
- `qualityScaleRatioHeight`
- `outputPixelScaleRatioWidth`
- `outputPixelScaleRatioHeight`
- `effectiveFinalNaturalWidth`
- `effectiveFinalNaturalHeight`
- `sourceEvaluationId`
- `requiredMinimumWidth = ceil(3 * baselineCropNaturalWidth)`
- `requiredMinimumHeight = ceil(3 * baselineCropNaturalHeight)`
- `threeXStatus`
- `sourceLimitedExceptionId`, if applicable
- `sourceLimitedDisposition`, if applicable

For category headings, record `threeXStatus: "not-applicable-category-heading"` and exclude them from sign/sign-like target counts.

For contextual visuals, record either the same 3x fields as catalog entries or a documented non-catalog disposition.

For source-limited rows, record `threeXStatus: "source-limited-exception"` and keep the failed exact native/effective `3x` ratios visible. Also record output-pixel ratios proving the final file meets the user's requested `3x` output dimensions. These rows are acceptable under the `2026-06-07T21:36:51Z` disposition only and must not be summarized as true native/effective `3x` passes.

## Crop Audit Evidence

Automated geometry checks are required but not sufficient. The final evidence should include:

- per-row audit status such as `reviewed-final-correct`;
- reviewer note for any row whose crop touches non-white content at an edge;
- per-section contact sheets for all six sections;
- rows displayed with final visual, Spanish caption, Russian caption, source page, and before/after dimensions;
- summary counts for pass/fail/pending crop audit status.

Implementation must not record `spot-check`, `representative-only`, or `pending` crop audit status as passing evidence.

## Forbidden-Pattern Checks

Add or update validation so feature `037` fails on:

- sign-like rows with the old `source-image-css-clip` render mode and existing low-resolution sheet assets;
- extraction methods that say no crop file was written for sign-like rows;
- generated learning-image paths or unofficial replacement assets used as sign visuals;
- SVG/vector replacement signs unless Architect explicitly disposes a non-protected case, which is not expected here;
- runtime PDF viewer, iframe/object/embed, PDF.js canvas, remote images, network fetches, backend endpoints, or live AI;
- CSS or data that allows image display beyond natural dimensions;
- missing before/after dimensions, hashes, or evidence freshness.
- source-limited exceptions without source-evaluation evidence, effective/native dimension fields, crop audit pass, or no-upscale proof.
- source-limited rows described in data, evidence, UI text, PR text, or completion notes as true native/effective `3x` detail.

## UI And Performance Notes

The per-entry asset approach creates more files than feature `036`, but the catalog is still local/static and bounded. Implementation should:

- use `loading="lazy"` for entries beyond the first visible rows;
- preserve eager loading only for initial above-the-fold entries if needed;
- avoid oversized contact/evidence images in runtime bundles;
- keep evidence artifacts under `specs/037` and runtime assets under `content/assets`;
- avoid changing unrelated manual or practice surfaces.

## Verification Strategy

Required focused checks:

- regenerate baseline/final evidence;
- generate and validate source-evaluation evidence;
- run sign inventory validation;
- run focused sign inventory tests;
- run full Node tests;
- run production build;
- run Playwright/visual QA for all six sections;
- run `git diff --check`;
- run `pnpm run preflight` unless a concrete blocker is recorded.

Expected commands include:

```bash
node scripts/manual-sign-inventory.mjs --write
pnpm run validate:manual-sign-inventory
node --test tests/manual-sign-inventory.test.mjs
pnpm run test
pnpm run build
pnpm run preflight
git diff --check
```

If Implementation adds a new crop/evidence script, it must document the exact command in `tasks.md` and wire validation into the existing content/preflight path where appropriate.

## Review Requirements

Review must inspect:

- whether the final runtime path really stopped using the existing low-resolution sheet clips for sign-like visuals;
- source-evaluation manifest and row-source mapping for exact source matches, rejected candidates, and source-limited rows;
- all-row baseline/final evidence and 3x math;
- all-row crop audit/contact sheets, especially examples from the user's screenshot;
- source-limited exceptions and the all-row `2026-06-07T21:36:51Z` disposition;
- protected-image preservation;
- category-heading/contextual dispositions;
- caption-to-visual matching;
- no-upscale runtime proof;
- forbidden-pattern validation.

Orchestrator coordinates review, final Architect validation, final Analyst validation, checks, PR readiness, and merge. Implementation Agent must not merge.

## Process Memory

Implementation must keep `specs/037-manual-sign-crop-resolution/tasks.md` current with:

- baseline counts and dimensions summary;
- extraction method and source attempts;
- final counts by section, page, and entry kind;
- category-heading and contextual-visual disposition;
- evidence paths;
- command outcomes;
- known issues and dead ends;
- Implementation Agent feedback for Architect disposition.
