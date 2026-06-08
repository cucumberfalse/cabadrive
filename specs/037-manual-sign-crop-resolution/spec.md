# Specification: Manual Sign Crop Accuracy And 3x Resolution Re-Extraction

## Role And Scope

This Architect artifact is for feature `037-manual-sign-crop-resolution`.

- Assigned worktree: `/Users/chap/devel/cabadrive-worktrees/037-manual-sign-crop-resolution`
- Assigned branch: `codex/037-manual-sign-crop-resolution`
- Verified base: `origin/main` at `a371374aa9234f671db9604d98936e73651adb6b`
- Intake artifact: `specs/037-manual-sign-crop-resolution/feature-request.md`
- Parallel work may exist. Preserve sibling worktrees, branches, commits, dirty diffs, PRs, and process memory.

Architect owns only `spec.md`, `plan.md`, and `tasks.md` in this feature folder. Implementation, tests, runtime assets, durable docs outside this folder, commits, pushes, PRs, review, and merge are outside this Architect role.

## User Outcome

Russian-speaking learners can study every Appendix IV sign/sign-like entry without blurry, pixelated, or incorrectly clipped visuals. Each entry shows the intended official source item, at a naturally higher extraction resolution, with Spanish and Russian captions outside the protected image and without any protected-pixel edits.

The user's concrete complaint is that some signs are cropped incorrectly and all signs are poor quality. The required fix is a real official-source re-extraction at approximately three times the current natural crop resolution, not CSS zoom or browser upscaling of the current low-resolution sheet clips.

## Source Baseline

The implementation starts from the current feature `036` final catalog:

- `src/data/manual-signs/app4SignEntries.json`
- `316` total rows across source pages `185-197`
- `283` `catalog-entry` rows
- `30` `category-heading` rows
- `3` `contextual-visual` rows
- six sections:
  - `app4-signs-regulatory`
  - `app4-signs-warning`
  - `app4-signs-informational`
  - `app4-signs-temporary`
  - `app4-signs-horizontal`
  - `app4-signs-traffic-lights`
- current render mode: `source-image-css-clip`
- current extraction method: `source-image-css-clip-from-existing-official-source-as-is-asset; no crop file written or re-encoded`

For this feature, the measurable baseline for each current row is the effective content in the `a371374aa9234f671db9604d98936e73651adb6b` base version of `src/data/manual-signs/app4SignEntries.json`:

- `id`
- `sectionId`
- `sourcePage`
- `sourceOrder`
- `entryKind`
- `spanishLabel`
- `variant`
- `russianTranslation`
- `sourceAsset`
- `sourceRegion`
- `assetPath`
- `naturalWidth`
- `naturalHeight`
- `cropRegion`
- `displayRegion`
- `cropNaturalWidth`
- `cropNaturalHeight`
- `hash`
- `renderMode`
- `extractionMethod`

Implementation must generate committed before/after evidence from this baseline before changing the runtime inventory.

## Exact 3x Requirement

For every in-scope visual row, the final output must meet a per-row natural-resolution target:

- `finalOutputNaturalWidth >= ceil(3 * baselineCropNaturalWidth)`
- `finalOutputNaturalHeight >= ceil(3 * baselineCropNaturalHeight)`

This is a dimension target, not an area target. A `72x74` current crop therefore requires at least `216x222` final natural pixels for the corresponding final crop or protected-content bounds.

If Implementation intentionally changes crop padding or removes blank margins, it may additionally record `baselineUsefulBounds` and `finalUsefulBounds` for the protected visual content. In that case, the useful protected-content width and height must each be at least `3x` the baseline useful protected-content width and height. The default target remains the existing `baselineCropNaturalWidth` and `baselineCropNaturalHeight`.

High-DPI PDF rendering is not sufficient by itself if it only interpolates an already low-resolution embedded raster. Evidence must distinguish a real higher-resolution official-source extraction from CSS enlargement, browser transforms, or a re-encoded upscale of the current clip.

Any row that cannot meet the exact target from official source material after best-source attempts is a blocker until Architect disposes it. Such a row must record a `source-limited-exception` with source attempts, output dimensions, why the exact target is impossible, and why the result is the best faithful official-source outcome. A broad page-level or section-level exception is not sufficient.

## Architect Source-Disposition Update

Architect disposition recorded `2026-06-07T21:16:39Z`: accept the Implementation feedback as a real source blocker for the current extraction route, not as a reason to fake `3x` output. The rejected scale-15 CABA PDF probe and retained Anexo L panel inspection remain useful evidence, but they are not final all-row proof. The feature should continue after a mandatory source-evaluation gate.

The exact per-row `3x` target remains the primary requirement. Implementation must first acquire, archive when appropriate, and evaluate the best available official/public sources before final crop generation:

- existing retained CABA manual PDF: `content/official-documents/originals/gcba-manual-vehiculo-4-ruedas-2023.pdf`;
- existing retained official Anexo L panel images under `content/official-documents/originals/decreto-779-1995-anexo-l-senalizacion-vial-uniforme-images/`;
- Argentina.gob.ar Anexo L HTML: `https://www.argentina.gob.ar/normativa/recurso/30389/dto779-1995-anexoL/htm`;
- Argentina.gob.ar ANSV sign catalog PDF: `https://www.argentina.gob.ar/sites/default/files/2022/02/ansv_licencias_manual_senaletica_2.pdf`;
- Argentina.gob.ar Anexo article 22 PDF/archive: `https://www.argentina.gob.ar/normativa/30389_dec196-3_pdf/archivo`;
- official GCBA Boletin/pliego/signage PDFs that document local CABA parking/signage variants, including the researched candidates:
  - `https://documentosboletinoficial.buenosaires.gob.ar/publico/PE-RES-MIGC-SSPO-18-25-ANX-58.pdf`;
  - `https://documentosboletinoficial.buenosaires.gob.ar/publico/PE-RES-MIGC-SSPO-18-25-ANX-59.pdf`;
  - `https://buenosaires.gob.ar/areas/planeamiento_obras/licitations/web/uploads/82c01107e6211ae413694ce564d255a3.pdf`.

Source trust rules:

- The retained CABA manual PDF is the primary source for row order, caption mapping, and CABA-specific visual intent.
- Argentina.gob.ar/ANSV/Anexo L sources may provide final visuals for nationally defined signs only when the row evidence proves an exact visual match, including sign face, plates/tablets, arrows, labels, and variant meaning.
- GCBA official documents may provide final visuals for CABA-local variants only when the row evidence proves an exact visual match to the learner-facing entry.
- Construction/specification/pliego documents are acceptable as official visual sources only when they are public official GCBA documents and the selected visual is an exact match; they are not acceptable for approximate replacement or inferred variants.
- Unofficial images, generated art, redrawn/vector substitute signs, OCR/retyped labels, screenshots from non-official sites, and CSS/image upscales are not accepted sources.

Source-evaluation evidence must be recorded before final crop generation and must cover every sign-like row. Required evidence:

- `specs/037-manual-sign-crop-resolution/evidence/source-evaluation/source-manifest.json` listing each evaluated source, source URL or retained path, local archived path if added, SHA-256 hash where practical, issuer, official-status basis, page count or asset count, vector/raster/native-resolution notes, and acquisition timestamp or unavailable reason.
- `specs/037-manual-sign-crop-resolution/evidence/source-evaluation/row-source-mapping.json` with one record per `catalog-entry` and retained learner-facing `contextual-visual`, including every evaluated candidate, match status, chosen source, source page/item reference, native/effective source dimensions, and reason rejected for non-chosen candidates.
- Contact-sheet or crop-probe evidence showing the chosen source visual next to the baseline row for every exact-match or exception row.

Row-level `source-limited-exception` is Architect-disposed by this update only when all of these conditions are met:

- the source-evaluation gate above was completed for that row;
- no evaluated official exact-match source can provide `3x` effective protected-content dimensions;
- the chosen output uses the highest effective native official source detail available for that exact visual match;
- `qualityScaleRatioWidth` and `qualityScaleRatioHeight` are computed from effective source detail, not from an interpolated render file;
- the row records `effectiveFinalNaturalWidth`, `effectiveFinalNaturalHeight`, `sourceNativeWidth`, `sourceNativeHeight`, `sourceLimitedReason`, and `sourceEvaluationId`;
- the crop audit is `reviewed-final-correct`;
- runtime display never exceeds the final asset natural dimensions;
- the row is not counted as `threeXStatus: "passed"`.

If more than `28` of the `286` sign-like baseline rows, or more than `20%` of any sign section, would require `source-limited-exception`, Implementation must stop and route a new feedback item to Architect before PR readiness. That many exceptions would materially change the user's requested `3x` outcome and needs another disposition.

## Architect Second Source-Disposition Update

Architect disposition recorded `2026-06-07T21:36:51Z`: the completed mandatory source-evaluation gate is accepted as sufficient evidence that the exact native/effective `3x` target is unavailable from currently evaluated official sources for every sign-like row.

The source-limited threshold breach is disposed for the specific evaluated result recorded in `specs/037-manual-sign-crop-resolution/evidence/source-evaluation/row-source-mapping.json`: `286/286` mapped sign-like rows are source-limited candidates, `0/286` are exact native/effective `3x` candidates, and all six sections exceed the prior `20%` threshold. This disposition does not permit fake native detail, generated replacements, unofficial substitutes, sharpening, cleanup, or CSS/browser upscaling.

Revised measurable target for PR-ready implementation:

- produce one corrected per-row local output crop for every retained sign-like row using the best exact-match official source identified by the source-evaluation gate;
- use the retained CABA manual PDF as the authoritative final visual source when no better exact official candidate is proven for a row;
- render/crop final source-faithful output pixels at `finalOutputNaturalWidth >= ceil(3 * baselineCropNaturalWidth)` and `finalOutputNaturalHeight >= ceil(3 * baselineCropNaturalHeight)`;
- compute and report `outputPixelScaleRatioWidth` and `outputPixelScaleRatioHeight` from final file pixels, and compute `qualityScaleRatioWidth` and `qualityScaleRatioHeight` from effective/native official source detail;
- keep `threeXStatus: "source-limited-exception"` for rows whose effective/native detail does not meet the exact `3x` target, even when the final file has `3x` output pixels;
- add an explicit source-limited disposition such as `sourceLimitedDisposition: "best-official-source-3x-output-pixels"` for those rows;
- do not count source-limited rows as `threeXStatus: "passed"`;
- record that the result is source-limited best-official-source output, not true new native detail.

Implementation may continue without a new owner/human clarification before crop generation because this path still targets the user's visible complaints: bad crop bounds and poor-quality learner-facing sheet clips. This is a material revision of the strict native/effective-detail target, so Orchestrator must preserve the limitation in PR/completion wording. If the owner requires a promise of true native/effective `3x` detail instead of source-faithful `3x` output pixels, the feature remains blocked until better official exact sources are provided.

Additional requirements for the all-row source-limited path:

- no generated art, unofficial art, redrawn/vector substitutes, sharpening, denoise, cleanup, retouching, masking, inpainting, recolor, contrast enhancement, OCR/retyped embedded labels, or translated text inside protected imagery;
- no CSS transform, browser zoom, `image-rendering` trick, old low-resolution `source-image-css-clip`, or display size that exceeds final asset natural dimensions;
- crop bounds must be reviewed for every sign-like row and marked `reviewed-final-correct`;
- crops must include all attached plates/tablets/arrows/labels/multi-part content belonging to the entry and exclude neighboring entries or unrelated source text;
- evidence must include per-row baseline dimensions, required `3x` output pixel dimensions, final output dimensions, effective/native source dimensions, chosen source, source-evaluation id, output hash, crop audit status, no-upscale proof, and protected-pixel note;
- contact sheets must cover every sign-like row in all six sections and show Spanish/Russian captions, source page/order, final visual, output-pixel ratios, effective/native ratios, and source-limited status;
- desktop and mobile screenshots must cover all six Appendix IV sign sections and prove no clipping, overlap, document-level horizontal overflow, broken images, or browser upscaling;
- validation must fail if source-limited output is worded, counted, or encoded as true native/effective `3x` detail.

## In Scope

In scope:

- All current `283` `catalog-entry` sign/sign-like rows from source pages `185-197`.
- All current `3` `contextual-visual` rows if they remain learner-facing inside the sign catalog.
- All current `30` `category-heading` rows for coverage/disposition evidence, even though they are not sign-like visual rows.
- Crop correction for every row whose current crop clips the intended item, includes neighboring material, omits attached plates/tablets/arrows/labels that belong to the entry, or mismatches the Spanish/Russian caption.
- Replacing the current learner-facing `source-image-css-clip` runtime path for sign-like visual entries with source-faithful higher-natural-resolution output.
- Inventory, data, UI, validation, tests, and evidence needed to make all rows auditable.
- Updates to durable docs only if Implementation changes the reusable sign extraction, asset, validation, or display contract.

Out of scope:

- Reopening the product decision to show individual sign catalog entries.
- Rebuilding unrelated manual chapters or non-Appendix IV visuals.
- Changing practice questions, exam mode, content availability mode, or source archive policy.
- Generated, unofficial, redrawn, cleaned, sharpened, vectorized, translated-inside-image, recolored, masked, retouched, inpainted, denoised, reconstructed, or approximate replacement sign artwork.
- Runtime PDF rendering, remote images, runtime network fetches, backend services, or live AI.
- Treating CSS zoom, browser transforms, `image-rendering`, larger cards, or display scaling of the existing low-resolution clips as the quality fix.

## Row Disposition Requirements

All `316` baseline rows must appear in final evidence with an explicit disposition.

- `catalog-entry`: must have a final high-resolution official-source visual output meeting the 3x target, or a row-level Architect-disposed source-limited exception.
- `contextual-visual`: if still rendered in the sign catalog, must meet the same source-faithful high-resolution/no-upscale/crop-audit requirements as catalog entries. If moved out of the individual catalog or removed from learner-facing sign cards, evidence must explain where it went and why it is not counted as a sign entry.
- `category-heading`: should be rendered as normal selectable DOM text or a semantic section/group heading, not as a required sign image. It does not need a 3x raster output, but evidence must record `category-heading-dom` or another explicit non-sign disposition and must exclude headings from sign/sign-like coverage counts.

Final counts may differ from `316` only when Implementation proves a feature `036` inventory error and records the correction in feature memory and evidence. Count changes are Architect-review blockers until disposed.

## Protected Image Rules

Traffic signs, road markings, traffic lights/signals, plates/tablets, arrows, pictograms, borders, colors, embedded Spanish text, and contextual visual pixels are protected official imagery.

Allowed:

- source-faithful extraction/cropping from the official archived PDF or a better retained official source asset;
- lossless crop output where practical;
- format conversion required to bundle local static assets, with evidence of dimensions and hash;
- narrow whitespace/padding choices that do not alter protected pixels.

Forbidden:

- redraw, vectorization, generated replacement, approximate recreation, cleanup, sharpening, denoise, recolor, retouch, mask, inpaint, content-aware fill, background reconstruction, or visual enhancement;
- translating, covering, retyping, moving, or replacing text inside a sign, plate, tablet, marking, signal, map, source label, or other protected image region;
- changing sign shapes, colors, borders, arrows, pictograms, signal lights, plate/tablet content, or embedded labels;
- cropping away any part of the intended official entry;
- including neighboring signs or unrelated source text because crop bounds are wrong;
- browser upscaling beyond natural output dimensions.

Spanish and Russian captions remain selectable text outside the protected image. If official external Spanish catalog-label pixels remain inside a crop, they must be original source pixels and must not be translated or covered.

## Data Requirements

The final inventory must be machine-checkable and must include one final row per retained baseline row or documented corrected row. For each row it must record:

- stable `id`
- `featureId` or quality revision marker for `037-manual-sign-crop-resolution`
- original feature `036` baseline reference
- `entryKind`
- `sectionId`
- `sourcePage`
- `sourceOrder`
- `sourceOrderWithinPage`
- Spanish label and optional variant
- Russian translation
- source-sheet label/heading evidence
- source document identity
- source-evaluation id and source trust tier
- source page or official retained source asset
- source region before and after correction
- baseline crop region and baseline natural crop dimensions
- final output asset path or explicit non-visual disposition
- final output natural width and height
- effective final natural width and height when PDF/raster interpolation would otherwise inflate file pixels
- source native width and height for selected source-limited rows
- final output SHA-256 hash where an asset exists
- extraction method
- render mode
- `qualityScaleRatioWidth` and `qualityScaleRatioHeight`
- `outputPixelScaleRatioWidth` and `outputPixelScaleRatioHeight` for source-limited `3x` output files
- source-limited disposition wording for rows that meet output-pixel `3x` but not effective/native `3x`
- 3x status: `passed`, `source-limited-exception`, or `not-applicable-category-heading`
- crop audit status
- protected-pixel preservation note
- runtime display maximum width/height
- no-upscale proof fields

The old `source-image-css-clip` render mode may remain only for non-learner-facing evidence or for an Architect-disposed high-resolution-sheet fallback that proves the displayed clip uses newly extracted high-resolution official source pixels and meets the 3x target. Existing low-resolution sheet clips from feature `036` must not remain the learner-facing sign-like visual path.

## Asset Requirements

Preferred final runtime representation:

- one committed local raster crop asset per `catalog-entry`;
- one committed local raster crop asset per retained `contextual-visual`;
- no raster asset required for `category-heading` rows when rendered as DOM headings.

Preferred asset location:

- `content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/<section-id>/individual-3x/<entry-id>.png`

PNG is preferred for signs, markings, labels, and traffic lights because lossless output protects edges and small text. JPEG may be used only for photographic contextual visuals when it is source-faithful, high-quality, and recorded.

Acceptable source order:

1. A better retained official source asset already in the repository, if evidence proves it is official and at least meets the 3x target.
2. Direct high-DPI crop/export from `content/official-documents/originals/gcba-manual-vehiculo-4-ruedas-2023.pdf`, using source page/region math derived from the reconciled feature `036` inventory.
3. Acquired and archived official Argentina.gob.ar, ANSV, or GCBA source material that passes the source trust and exact-match rules in the Architect Source-Disposition Update.
4. A row-level `source-limited-exception` output from the best exact-match official source only after the source-evaluation gate proves that no official source can meet the exact `3x` target for that row.

Under the `2026-06-07T21:36:51Z` disposition, item 4 is permitted for all `286` evaluated sign-like rows only when every source-limited row also meets the revised all-row output-pixel, disclosure, crop-audit, and no-upscale requirements.

The implementation must not commit generated or unofficial substitute sign art.

## UI Requirements

The Appendix IV sign catalog UI must:

- render sign-like entries from their final high-resolution output assets, not from the current low-resolution sheet clips;
- keep source order and section grouping intact;
- render category headings as text/group structure or explicitly disposition them;
- show Spanish and Russian captions outside the image;
- keep images crisp at intended desktop and mobile sizes without exceeding natural dimensions;
- avoid clipped images, overlapping text, document-level horizontal overflow, and layout shifts;
- keep local/offline behavior and bundled assets only.

For wide or tall visual entries, contained figure-level scrolling is acceptable when needed to avoid downscaling source text below readable size. Document-level horizontal overflow is not acceptable.

## Validation Requirements

Automated validation must fail when any of these occur:

- missing baseline snapshot or before/after evidence for a retained row;
- missing source-evaluation manifest or row-source mapping for a sign-like retained row;
- missing final row for any retained baseline row;
- unexpected count/order/section/source-page regression;
- `catalog-entry` or retained `contextual-visual` lacks a final output asset;
- final asset missing, hash mismatch, or dimensions mismatch inventory;
- final output dimensions fail the 3x target without row-level Architect-disposed exception;
- source-limited exception lacks source-evaluation id, effective/native dimensions, source-limited reason, crop-audit pass, no-upscale proof, or stays above the exception threshold without a later Architect disposition;
- all-row source-limited output lacks the `2026-06-07T21:36:51Z` disposition fields, output-pixel scale proof, effective/native source-detail proof, or disclosure that the row is not a true native/effective `3x` pass;
- final render path still uses the existing low-resolution `source-image-css-clip` clips for sign-like learner-facing visuals;
- crop region lies outside source bounds;
- crop audit status is missing, pending, representative-only, or failed;
- crop edge checks indicate likely clipped protected content without an explicit reviewed disposition;
- caption is missing or mismatched against the displayed source visual;
- category heading rows are counted as sign/sign-like coverage;
- browser runtime displays an image larger than its natural dimensions;
- forbidden protected-image edit patterns, generated art paths, remote URLs, runtime PDF viewer patterns, or backend/network dependencies appear in the implementation path.

Automated checks cannot replace all visual review. Each final sign-like row must have auditable contact-sheet evidence showing the final visual with Spanish/Russian captions and audit status.

## Acceptance Criteria

1. Every retained `catalog-entry` row from the current `316`-row baseline has a corrected final official-source visual output.
2. Every retained `contextual-visual` row has the same treatment or an explicit non-catalog disposition.
3. Every `category-heading` row is explicitly dispositioned and excluded from sign/sign-like quality counts.
4. Every sign-like final output is at least `3x` the current baseline natural crop width and height in output pixels and either meets true effective/native `3x` detail or has the all-row Architect-disposed `source-limited-exception` fields and disclosure from the `2026-06-07T21:36:51Z` update.
5. No sign-like entry is visibly clipped, cut through, missing attached plate/tablet/arrow/source label content that belongs to the entry, contaminated by neighboring content, or matched to the wrong caption.
6. Protected official imagery is not edited, redrawn, translated inside the image, cleaned, sharpened, recolored, masked, retouched, inpainted, vectorized, or replaced.
7. The runtime UI displays high-resolution local assets without browser upscaling beyond natural dimensions.
8. Spanish and Russian captions remain selectable text outside protected imagery and continue to match the visual.
9. Source order, section grouping, and caption-to-visual matching from the reconciled feature `036` inventory are preserved or explicitly corrected with evidence.
10. Evidence includes all `316` baseline rows or a documented corrected row set, all six sections, source-evaluation mapping, before/after dimensions, no-upscale proof, protected-image preservation notes, and crop audit status.
11. Desktop and mobile screenshot evidence covers all six Appendix IV sign sections.
12. Automated validation/tests cover inventory, source-evaluation evidence, assets, hashes, dimensions, 3x targets, source-limited exception contract, no-upscale behavior, forbidden patterns, and evidence freshness.
13. Local verification commands requested in `tasks.md` pass or have a documented blocker/fallback routed through Orchestrator.

## Negative Scenarios

- Fixing only screenshot examples.
- Keeping the `036` low-resolution sheet clips and making cards larger.
- Rendering the current low-resolution clip through CSS zoom, transforms, or `image-rendering`.
- Generating 3x files by scaling the current clipped raster instead of extracting from official source material.
- Accepting a high-DPI PDF export without proving it is not merely an interpolated upscale when a better official source is available.
- Leaving crop audit as representative-only or spot-check-only.
- Cropping off plates/tablets/arrows/sign edges/source label pixels that belong to the entry.
- Including parts of neighboring signs or unrelated source text inside a final crop.
- Showing a sign next to the wrong Spanish/Russian caption.
- Replacing official pixels with cleaned, redrawn, generated, vectorized, sharpened, translated, recolored, retouched, masked, inpainted, or reconstructed artwork.
- Counting category headings as sign-quality coverage.
- Introducing runtime PDF rendering, remote assets, backend services, live AI, or network fetches.

## Acceptance Evidence Required

Implementation must record:

- baseline snapshot for the feature `036` current inventory at base `a371374aa9234f671db9604d98936e73651adb6b`;
- before/after per-row JSON or CSV for all `316` baseline rows, including dimensions, ratios, disposition, hashes, source refs, and no-upscale proof;
- per-entry extraction evidence for each final visual asset;
- all-section contact sheets showing every final row with Spanish/Russian captions and crop audit status;
- desktop and mobile screenshots for all six sign sections;
- source-limited exception evidence for every source-limited row, including disclosure that `3x` output pixels are not true native/effective `3x` detail;
- source-evaluation manifest and row-source mapping before final crop generation;
- category-heading and contextual-visual dispositions;
- forbidden-pattern check output;
- local command evidence for focused inventory validation, focused tests, full tests/build/preflight as required by `tasks.md`, and `git diff --check`;
- process-memory updates in `tasks.md`, including decisions, known issues, dead ends, Implementation Agent feedback, and verification outcomes.
