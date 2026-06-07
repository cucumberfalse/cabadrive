# Tasks: Manual Sign Crop Accuracy And 3x Resolution Re-Extraction

## Startup And Context

- [x] Confirm assigned Implementation Agent context: worktree `/Users/chap/devel/cabadrive-worktrees/037-manual-sign-crop-resolution`, branch `codex/037-manual-sign-crop-resolution`, feature memory `specs/037-manual-sign-crop-resolution/`, scoped Appendix IV sign data/assets/UI/validation files, and Orchestrator parallel-work preservation warning.
- [x] Verify required feature memory exists before implementation: `feature-request.md`, `spec.md`, `plan.md`, and this `tasks.md`.
- [x] Inspect current `src/data/manual-signs/app4SignEntries.json`, `src/data/manual-signs/app4SignCatalog.ts`, `src/App.tsx`, `src/styles.css`, `scripts/manual-sign-inventory.mjs`, `scripts/manual-visual-content-crops.swift`, `scripts/render-manual-pdf-pages.swift`, and `tests/manual-sign-inventory.test.mjs` only as needed for this feature.
- [x] Record the implementation start note here, including current branch, base SHA, and any dirty files found before editing.

## Baseline Snapshot

- [x] Generate a baseline snapshot from the current feature `036` inventory before runtime changes.
- [x] Commit or stage evidence under `specs/037-manual-sign-crop-resolution/evidence/baseline/`, including all `316` current rows.
- [x] Record baseline summary:
  - total rows;
  - rows by section;
  - rows by source page;
  - rows by entry kind;
  - render mode counts;
  - extraction method counts;
  - min/max/median `cropNaturalWidth` and `cropNaturalHeight`;
  - known tiny examples from the user screenshot such as `NO ESTACIONAR` rows.
- [x] Ensure the baseline evidence records `baselineCropNaturalWidth`, `baselineCropNaturalHeight`, `baselineCropRegion`, `baselineSourceAsset`, `baselineAssetHash`, `baselineRenderMode`, and `baselineExtractionMethod` per row.

## Row Disposition

- [x] Preserve or explicitly correct all `316` baseline rows.
- [x] Record final disposition for each `catalog-entry` row as requiring a high-resolution final visual asset. Final: all `283` catalog entries retained with direct `individual-source-crop-3x` PNG assets.
- [x] Record final disposition for each `contextual-visual` row: retained with 3x visual asset, moved to supplemental context, or removed from the sign catalog with reason. Final: all `3` contextual visuals retained with direct `individual-source-crop-3x` PNG assets.
- [x] Record final disposition for each `category-heading` row as `category-heading-dom` or another explicit non-sign disposition, and exclude headings from sign/sign-like coverage counts. Final: all `30` category headings render as DOM/non-sign rows.
- [x] If any row count/order/source-page/caption correction is needed, stop and record Implementation Agent feedback for Architect disposition before treating the correction as final. Final: row count, order, source pages, and captions were preserved; crop-bound corrections were implementation-scoped and recorded in final evidence.

## Source Evaluation Gate

- [x] Treat the previous official CABA PDF scale-15 probe and retained Anexo L panel inspection as source-attempt evidence only, not as final all-row `3x` proof.
- [x] Acquire or verify the official/public source candidates named in `spec.md`: retained CABA manual PDF, retained Anexo L panels, Argentina.gob.ar Anexo L HTML, Argentina.gob.ar ANSV sign catalog PDF, Argentina.gob.ar Anexo article 22 PDF/archive, and researched official GCBA Boletin/pliego/signage PDFs for local variants.
- [x] Archive any newly used official source files under `content/official-documents/originals/` or a clear subfolder; record source URL, archived path, SHA-256 hash where practical, issuer, page count/asset count, and acquisition timestamp. Newly archived files are under `content/official-documents/originals/traffic-sign-source-evaluation-037/`; GCBA ANX-58/ANX-59 were web-verified but local archive attempts timed out at zero bytes and are recorded as unavailable in the manifest.
- [x] Generate `specs/037-manual-sign-crop-resolution/evidence/source-evaluation/source-manifest.json`.
- [x] Generate `specs/037-manual-sign-crop-resolution/evidence/source-evaluation/row-source-mapping.json` covering every `catalog-entry` and retained learner-facing `contextual-visual` row.
- [x] For each sign-like row, record evaluated candidates, exact-match status, variant mismatch/no-coverage/insufficient-resolution reasons, chosen source id, source page/item reference, native/effective dimensions, and rejected-candidate rationale.
- [x] Only choose Argentina.gob.ar/ANSV/Anexo L visuals for nationally defined signs when the row mapping proves exact visual equivalence to the CABA manual entry. Source-evaluation result: no national-source row was chosen because row-level exact visual equivalence and crop coordinates were not proven.
- [x] Only choose GCBA Boletin/pliego/signage visuals for CABA-local variants when the row mapping proves exact visual equivalence, including plates/tablets/arrows/labels. Source-evaluation result: no GCBA alternate row was chosen because local archive or exact row-level variant mapping was not available/proven.
- [x] Record source-limited exception candidates only after the row has evaluated every mandatory relevant official source and no exact-match official source can provide `3x` effective dimensions.
- [x] If source-limited exceptions would exceed `28` of the `286` sign-like rows or `20%` of any sign section, stop and record new Implementation Agent feedback for Architect disposition before PR readiness. Result: stopped at the gate because `286/286` sign-like rows are source-limited candidates and all six sections exceed `20%`.

## Second Source-Disposition Follow-Up

- [x] Record Architect disposition for the completed source-evaluation gate result: `286/286` sign-like rows are source-limited candidates, `0/286` have exact native/effective `3x` candidates, and the prior total/per-section threshold is exceeded in every section.
- [x] Continue implementation under the `2026-06-07T21:36:51Z` all-row source-limited disposition instead of stopping again solely because `286/286` rows are source-limited.
- [x] Use `content/official-documents/originals/gcba-manual-vehiculo-4-ruedas-2023.pdf` as the default final visual source for every sign-like row unless an updated row-source mapping proves a better exact official source for that specific row. Current source-evaluation result proves no better exact row source, so final crop generation uses the retained CABA manual PDF for all `286` sign-like rows.
- [x] Generate corrected per-row output crops with final file dimensions at least `ceil(3 * baselineCropNaturalWidth)` by `ceil(3 * baselineCropNaturalHeight)` while recording that source-limited rows are `3x` output-pixel crops, not true native/effective `3x` detail. Final: `286/286` sign-like rows meet output-pixel dimensions.
- [x] Keep `threeXStatus: "source-limited-exception"` for rows whose effective/native source detail remains below exact `3x`, and add a disposition such as `sourceLimitedDisposition: "best-official-source-3x-output-pixels"`. Final: `286/286` sign-like rows use that status/disposition.
- [x] Add and validate `outputPixelScaleRatioWidth` and `outputPixelScaleRatioHeight` separately from effective/native `qualityScaleRatioWidth` and `qualityScaleRatioHeight`.
- [x] Ensure validation fails if any source-limited row is counted or worded as a true native/effective `3x` pass. Final summary records `trueNativeEffectiveThreeXPassRows: 0`.
- [x] Do not sharpen, clean, redraw, vectorize, recolor, denoise, retouch, mask, inpaint, translate embedded text, OCR/retype labels, or otherwise alter protected official pixels.
- [x] Do not use CSS/browser upscaling, `image-rendering` tricks, old feature-036 low-resolution sheet clips, runtime PDF rendering, remote assets, generated art, or unofficial substitutes.
- [x] Record in PR/completion wording that the result is source-faithful best-official-source `3x` output pixels with source-limited native detail. No new owner/human decision is required before continuing implementation under this wording; if the owner requires true native/effective `3x` detail, stop and route back to Orchestrator because better official exact sources are needed.

## Crop Generation And Correction

- [x] Choose and record the extraction source for each sign-like row from the completed source-evaluation gate: official CABA PDF, better retained official source asset, archived Argentina.gob.ar/ANSV/GCBA source, or Architect-disposed row-level source-limited exception. Final: all `286` sign-like rows use the retained CABA manual PDF because no better exact official row source was proven.
- [x] Implement or extend deterministic extraction tooling to produce per-entry high-resolution official-source crop assets for all retained `catalog-entry` rows.
- [x] Produce equivalent high-resolution assets for retained `contextual-visual` rows, or record their non-catalog disposition.
- [x] Use stable runtime asset paths, preferably `content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/<section-id>/individual-3x/<entry-id>.png`.
- [x] Ensure final output file width is at least `ceil(3 * baselineCropNaturalWidth)` and final output file height is at least `ceil(3 * baselineCropNaturalHeight)` for every sign-like row.
- [x] For any source-limited row, record `effectiveFinalNaturalWidth`, `effectiveFinalNaturalHeight`, `sourceNativeWidth`, `sourceNativeHeight`, `sourceLimitedReason`, `sourceEvaluationId`, `sourceLimitedDisposition`, `outputPixelScaleRatioWidth`, and `outputPixelScaleRatioHeight`; compute quality ratios from effective source detail rather than interpolated output pixels.
- [x] Correct crop bounds for every row while extracting, including all attached plates/tablets, arrows, markings, signal heads, embedded labels, and multi-part visual content that belongs to the entry.
- [x] Exclude neighboring signs, unrelated text, misleading blank-only regions, and source content that contradicts the row caption.
- [x] Prefer PNG/lossless output for signs, markings, traffic lights, and line art; record any JPEG use and reason. Final: all `286` sign-like output assets are PNG.
- [x] Do not sharpen, denoise, redraw, vectorize, recolor, mask, retouch, inpaint, translate, or otherwise modify protected pixels.
- [x] Do not create final assets by scaling the existing feature `036` low-resolution clips.

## Inventory And UI Updates

- [x] Update the governed sign inventory so sign-like rows reference final per-entry high-resolution assets directly.
- [x] Add final quality fields: baseline reference, output path, output dimensions, output hash, extraction method, output-pixel ratios, effective/native quality ratios, 3x status, source-limited disposition, crop audit status, no-upscale display limits, and protected-pixel preservation note.
- [x] Update TypeScript types in `src/data/manual-signs/app4SignCatalog.ts`.
- [x] Update the app renderer so sign-like entries no longer use the existing low-resolution `source-image-css-clip` runtime path.
- [x] Keep Spanish and Russian captions as selectable text outside protected images.
- [x] Render category headings as semantic DOM text/grouping or record why another approach is required.
- [x] Preserve source order, section grouping, and caption-to-visual matching.
- [x] Preserve local/static/offline behavior with bundled assets only.

## Automated Validation

- [x] Update `scripts/manual-sign-inventory.mjs` or add a focused validator so validation fails on missing baseline evidence, missing source-evaluation evidence, missing output assets, hash mismatch, dimension mismatch, failed 3x target without valid source-limited exception, pending crop audit, stale evidence, missing no-upscale proof, or forbidden render modes for sign-like rows.
- [x] Add or update tests in `tests/manual-sign-inventory.test.mjs` for:
  - all baseline rows retained or explicitly corrected;
  - final counts by section/page/kind;
  - category-heading rows excluded from sign/sign-like quality counts;
  - every sign-like row has a final asset and hash;
  - every sign-like row meets the 3x dimension target or has Architect-disposed exception evidence;
  - every source-limited row has source-evaluation evidence, effective/native dimension fields, crop audit pass, and no-upscale proof;
  - no sign-like row uses the old low-resolution `source-image-css-clip` extraction path;
  - runtime display constraints do not upscale images beyond natural dimensions;
  - forbidden generated/replacement/remote/PDF-viewer patterns are absent.
- [x] Add automated edge/crop checks where feasible, including out-of-bounds checks and suspicious non-white edge contact checks that require reviewer notes.
- [x] Ensure `pnpm run validate:content` and `pnpm run build` include or indirectly exercise the updated sign inventory validation.

## Evidence

- [x] Generate final before/after evidence for all `316` baseline rows under `specs/037-manual-sign-crop-resolution/evidence/final/`.
- [x] Include source-evaluation evidence in final evidence freshness checks: `source-manifest.json`, `row-source-mapping.json`, and per-row chosen-source references.
- [x] Evidence must include per row:
  - id;
  - entry kind;
  - section id;
  - source page/order;
  - Spanish/Russian captions;
  - baseline crop dimensions;
  - required minimum 3x dimensions;
  - final output dimensions;
  - effective final/source-native dimensions when a row is source-limited;
  - scale ratios;
  - output path/hash;
  - extraction method/source;
  - crop audit status;
  - no-upscale proof;
  - protected-pixel note;
  - source evaluation id;
  - disposition.
- [x] Generate all-section contact sheets showing every final row with final visual, Spanish/Russian captions, source page, before/after dimensions, 3x status, and audit status.
- [x] Contact sheets must cover:
  - regulatory;
  - warning;
  - informational;
  - temporary;
  - horizontal markings;
  - traffic lights/signals.
- [x] Generate desktop screenshots for all six Appendix IV sections.
- [x] Generate mobile screenshots for all six Appendix IV sections.
- [x] Generate visual QA summary JSON with entry counts, unloaded images, no-upscale violations, overflow, caption gaps, render-mode violations, and pending audit counts.
- [x] Record category-heading and contextual-visual disposition summary.
- [x] Record all source-limited exceptions. The all-row source-limited result is disposed by the `2026-06-07T21:36:51Z` Architect update only when rows satisfy the source-evaluation contract, output-pixel `3x` proof, effective/native detail disclosure, crop audit, and no-upscale proof.
- [x] Include forbidden-pattern check evidence.

## Local Verification Commands

- [x] Run the crop/evidence generation command and record the exact command and outcome here. Early scale-15 coordinate probing was rejected as source-proof evidence; final command `node scripts/manual-sign-crop-resolution.mjs --write` passed and wrote `286` sign-like PNG crops plus final evidence with `286` output-pixel `3x` rows, `286` source-limited exceptions, and `0` true native/effective `3x` pass rows.
- [x] Run the source-evaluation command and record the exact command, source count, row mapping count, exact `3x` candidate count, and source-limited candidate count here. `node scripts/manual-sign-source-evaluation.mjs --write` wrote evidence, then intentionally exited `2` because the gate is blocked: sources `9`, mapped sign-like rows `286`, exact `3x` candidate rows `0`, source-limited candidate rows `286`, sections over `20%`: `6`.
- [x] Run `node scripts/manual-sign-inventory.mjs --write` and record the outcome. Passed after final crop generation: `Manual sign inventory validation passed: 316 entries, pages 185-197, p198-200 disposition recorded.`
- [x] Run `pnpm run validate:manual-sign-inventory` and record the outcome. Passed after final crop generation with the same `316` entry validation result.
- [x] Run `node --test tests/manual-sign-inventory.test.mjs` and record the outcome. Passed after PR #203 review-fix crop audit update: `11/11` focused manual sign inventory tests.
- [x] Run `pnpm run test` and record the outcome. Passed in PR #203 review-fix preflight; latest assignment #2 preflight reports `447/447` tests.
- [x] Run `pnpm run build` and record the outcome. Passed; Vite emitted existing large-chunk warnings only and generated a service worker with `2156` cached assets.
- [x] Run Playwright/visual QA for all six sign sections and record the command, server URL, and evidence paths. PR #203 review-fix rerun: `node scripts/manual-sign-visual-qa.mjs` wrote all contact sheets; `pnpm exec vite --host 127.0.0.1 --port 5178` served `http://127.0.0.1:5178/`; `node scripts/manual-sign-visual-qa.mjs --runtime-url http://127.0.0.1:5178/` wrote all desktop/mobile runtime screenshots and `visual-qa-summary.json`.
- [x] Run `git diff --check` and record the outcome. Passed before final process-memory update; rerun after this update before staging.
- [x] Run `pnpm run preflight` unless a concrete blocker is recorded with fallback evidence. Passed after PR #203 review fix: feature-memory gate, repo baseline check, content validation, manual-sign inventory validation, `447/447` tests, build/service worker generation, and `82/82` Playwright e2e tests.

## Review And Final Validation Preparation

- [x] Keep this `tasks.md` current with implementation decisions, dead ends, source attempts, evidence paths, and command results.
- [x] Record final row counts by section, source page, and entry kind.
- [x] Record final sign-like 3x pass count, source-limited exception count, category-heading non-applicable count, and contextual-visual disposition count.
- [x] Confirm source-limited exception count is covered by the `2026-06-07T21:36:51Z` Architect reroute disposition, with `286/286` sign-like rows source-limited and no row claimed as a true native/effective `3x` pass unless new exact source proof is added.
- [x] Record final runtime render-mode counts and prove old low-resolution sheet clips are not the sign-like learner-facing path.
- [x] Record no-upscale proof summary.
- [x] Record protected-image preservation summary.
- [x] Record any Implementation Agent feedback for Architect disposition. Final: no new blocker feedback remains after the second disposition; the source-limited disclosure remains an explicit handoff note for Architect/Orchestrator wording.
- [x] Ensure no review/final-validation claim relies on representative-only evidence.
- [x] Leave PR review, final Architect validation, final Analyst validation, merge-readiness checks, and merge to Orchestrator and assigned roles.

## Architect Disposition Log

- Architect disposition `2026-06-07T21:16:39Z`, return/disposition count for this source blocker: `1`. Implementation feedback accepted: current CABA PDF scale-15 coordinate probe and retained Anexo L panels do not prove honest all-row `3x` output. Disposition: continue feature `037` with a mandatory official source-evaluation gate, keep exact per-row `3x` as the primary target, allow row-level `source-limited-exception` only under the source-evaluation and effective-dimension contract in `spec.md`, and require a new Architect reroute if exceptions exceed `28` sign-like rows or `20%` of any section.
- Architect disposition `2026-06-07T21:36:51Z`, return/disposition count for this source blocker: `2`. Implementation feedback accepted after the mandatory source-evaluation gate: evaluated source count `9`, mapped sign-like rows `286`, exact native/effective `3x` candidates `0`, source-limited candidates `286`, and all six sections exceed the previous `20%` threshold. Disposition: revise the measurable target to source-faithful best-official-source crops with at least `3x` output pixels while preserving `source-limited-exception` status and explicit disclosure that these rows are not true native/effective `3x` detail. Implementation may continue under this contract; Orchestrator must not present the result as native/effective `3x`. If the owner requires true native/effective `3x`, better official exact sources are required and the work is blocked.

## Implementation Evidence Log

Fill this section during implementation.

- Start note: Implementation began at `2026-06-07T20:59:12Z` in `/Users/chap/devel/cabadrive-worktrees/037-manual-sign-crop-resolution` on branch `codex/037-manual-sign-crop-resolution`; `HEAD` and merge-base were both `a371374aa9234f671db9604d98936e73651adb6b`. Pre-edit dirty state was limited to the new untracked feature memory folder `specs/037-manual-sign-crop-resolution/` handed off by Analyst/Architect.
- Baseline summary: generated `specs/037-manual-sign-crop-resolution/evidence/baseline/manual-sign-baseline-036.json` and `manual-sign-baseline-036-summary.json` before runtime inventory changes. Baseline contains `316` rows: `283` catalog entries, `3` contextual visuals, and `30` category headings. Rows by section: regulatory `60`, warning `59`, informational `95`, temporary `56`, horizontal `33`, traffic lights/signals `13`. Rows by source page: 185 `29`, 186 `31`, 187 `29`, 188 `30`, 189 `31`, 190 `27`, 191 `36`, 192 `1`, 193 `27`, 194 `29`, 195 `17`, 196 `16`, 197 `13`. Baseline render mode count: `source-image-css-clip: 316`. Baseline crop natural width min/max/median: `36/555/86`; height min/max/median: `27/320/83`. User-screenshot NO ESTACIONAR examples from page 185 are recorded in the baseline summary.
- Extraction method summary: attempted direct high-scale official PDF extraction from `content/official-documents/originals/gcba-manual-vehiculo-4-ruedas-2023.pdf` using feature-036 `sourceRegion + cropRegion` geometry, with `sourceBaseScale: 5` and `renderScale: 15`. The attempted generated runtime assets were removed and `src/data/manual-signs/app4SignEntries.json` was restored with `node scripts/manual-sign-inventory.mjs --write` because the probe could not honestly prove the feature-037 all-row 3x requirement. Retained official Anexo L panel images were inspected; they are official but limited panels and do not cover all CABA Appendix IV rows/variants.
- First source-proof result: blocked before final inventory/runtime changes because the first exact/native `3x` proof could not be established from the available CABA PDF and retained Anexo L panels. That blocker was recorded for Architect and disposed at `2026-06-07T21:16:39Z`.
- Early evidence paths:
  - Baseline: `specs/037-manual-sign-crop-resolution/evidence/baseline/manual-sign-baseline-036.json`
  - Baseline summary: `specs/037-manual-sign-crop-resolution/evidence/baseline/manual-sign-baseline-036-summary.json`
  - Source attempt summary: `specs/037-manual-sign-crop-resolution/evidence/source-attempts/source-attempts-summary.json`
  - Probe image, current x5 baseline crop: `specs/037-manual-sign-crop-resolution/evidence/source-attempts/page185-no-estacionar-baseline-x5-crop.jpg`
  - Probe image, rejected scale-15 coordinate attempt: `specs/037-manual-sign-crop-resolution/evidence/source-attempts/page185-no-estacionar-pdf-scale15-scaled-coordinate-probe.png`
- Early verification commands:
  - `node scripts/manual-sign-inventory.mjs --write` after cleanup: passed, restored the current feature-036 inventory.
  - `pnpm run validate:manual-sign-inventory`: passed.
  - `node --test tests/manual-sign-inventory.test.mjs`: passed, 18/18.
  - `git diff --check`: passed.
  - Full `pnpm run test`, `pnpm run build`, `pnpm run preflight`, and Playwright visual QA were deferred at that time because implementation was blocked before PR-ready runtime changes.
- Early known issues/dead ends: The official CABA PDF high-scale attempt did not prove a valid isolated native/effective 3x per-row crop for the page-185 `NO ESTACIONAR` probe from the current feature-036 region mapping; the retained official Anexo L images are useful official panels but do not provide all-row CABA coverage. A temporary generated per-entry asset/inventory attempt was removed to avoid leaving misleading `passed` 3x runtime state.
- Implementation feedback for Architect: blocker. Implementation cannot honestly complete the exact feature-037 requirement from currently available official source material without Architect disposition. Architect/Orchestrator should choose one of: locate/acquire better official retained source material for all `286` sign-like rows; accept explicit row-level source-limited exceptions and define their validation/display contract; or revise the measurable 3x target for source-limited CABA raster sheets.
- Architect disposition for the feedback above: disposed in the `Architect Disposition Log` at `2026-06-07T21:16:39Z`; next Implementation work is the source-evaluation gate before final crop generation.
- Source-evaluation update at `2026-06-07T21:33:31Z`: added `scripts/manual-sign-source-evaluation.mjs` and generated `specs/037-manual-sign-crop-resolution/evidence/source-evaluation/source-manifest.json` plus `row-source-mapping.json`. The gate covers all `286` sign-like rows (`283` catalog entries, `3` contextual visuals) and excludes `30` category headings from sign-quality counts. Evaluated source count is `9`: retained CABA manual PDF, retained Anexo L panels, archived Argentina.gob.ar Anexo L HTML, archived Argentina.gob.ar Anexo L embedded images, archived ANSV sign catalog PDF, archived Argentina.gob.ar article 22 PDF, web-verified GCBA ANX-58 (`217` pages), web-verified GCBA ANX-59 (`178` pages), and archived GCBA pliego/signage PDF.
- Source archive update: new official-source files are under `content/official-documents/originals/traffic-sign-source-evaluation-037/`: `argentina-gob-ar-decreto-779-1995-anexo-l.html`, `argentina-gob-ar-ansv-licencias-manual-senaletica-2.pdf`, `argentina-gob-ar-decreto-779-1995-anexo-articulo-22-archivo.pdf`, `gcba-planeamiento-obras-licitations-82c01107e6211ae413694ce564d255a3.pdf`, and `argentina-gob-ar-anexo-l-images/argentina-gob-ar-anexo-l-01.jpg` through `argentina-gob-ar-anexo-l-16.jpg`. The manifest records URL, issuer, path, SHA-256/hash data where local files exist, page count or asset count, and native-resolution notes.
- GCBA Boletin archive dead end: `PE-RES-MIGC-SSPO-18-25-ANX-58.pdf` and `PE-RES-MIGC-SSPO-18-25-ANX-59.pdf` opened as official web PDFs during source evaluation, but repeated `curl` attempts with bounded timeout and normal user-agent stalled at `0` transferred bytes and exited `curl (28)`. No zero-byte file was retained; both candidates are recorded in `source-manifest.json` as web-verified/archive-unavailable and not chosen.
- Source-evaluation command outcome: `node --check scripts/manual-sign-source-evaluation.mjs` passed. `node scripts/manual-sign-source-evaluation.mjs --write` wrote evidence, then intentionally exited `2` with gate status `blocked-source-limited-threshold-exceeded`: sources `9`, mapped sign-like rows `286`, exact `3x` candidate rows `0`, source-limited candidate rows `286`, sections over `20%`: `6`.
- Source-evaluation decision: the retained CABA manual PDF remains the only exact row-order/caption source for every sign-like row, but it is source-limited by current evidence to the feature-036 sheet crop effective detail. The mandatory national and GCBA alternate sources were evaluated and rejected for final row selection because row-level exact visual equivalence, CABA variant equivalence, local archive availability, and/or deterministic crop coordinates were not proven.
- New Implementation feedback for Architect: blocker after mandatory source-evaluation. The source-limited exception candidates exceed both allowed thresholds (`286 > 28` total and `100%` of every sign section > `20%`). Per `spec.md`, Implementation stopped before final crop generation, runtime inventory changes, final assets, UI changes, final tests, contact sheets, and PR-readiness work. Architect/Orchestrator needs to either provide/acquire better exact official sources, relax/dispose the exception threshold, or revise the measurable 3x target/display contract before Implementation can continue to final crop generation.
- Architect disposition for the feedback above: disposed in the `Architect Disposition Log` at `2026-06-07T21:36:51Z`; next Implementation work is final crop generation under the best-official-source `3x` output-pixel/source-limited disclosure contract.
- Final crop generation update at `2026-06-07T22:11:16Z`: added `scripts/manual-sign-crop-resolution.mjs` and `scripts/manual-sign-crop-resolution.swift`; `node scripts/manual-sign-crop-resolution.mjs --write` wrote `286` PNG assets and `specs/037-manual-sign-crop-resolution/evidence/final/manual-sign-crop-resolution-render-config.json`, `manual-sign-crop-resolution-render-output.json`, `manual-sign-crop-resolution-rows.json`, and `manual-sign-crop-resolution-summary.json`.
- Final crop extraction method: the Swift helper renders full official CABA PDF pages from `content/official-documents/originals/gcba-manual-vehiculo-4-ruedas-2023.pdf` at scale `5`, constrains row candidates by neighboring table row/column geometry, trims meaningful official content, and aspect-fits the crop into a white PNG canvas whose dimensions are at least `ceil(3 * baselineCropNaturalWidth)` by `ceil(3 * baselineCropNaturalHeight)`. Protected pixels are not sharpened, cleaned, redrawn, denoised, recolored, retouched, masked, inpainted, vectorized, OCR/retyped, translated, stretched, or replaced.
- Final counts: `316` rows preserved, `286` sign-like rows, `283` catalog entries, `3` contextual visuals, `30` category headings. Sign-like rows by section: regulatory `55`, warning `53`, informational `90`, temporary `50`, horizontal `29`, traffic lights/signals `9`. Category headings by section: regulatory `5`, warning `6`, informational `5`, temporary `6`, horizontal `4`, traffic lights/signals `4`. Source pages are unchanged from baseline: 185 `29`, 186 `31`, 187 `29`, 188 `30`, 189 `31`, 190 `27`, 191 `36`, 192 `1`, 193 `27`, 194 `29`, 195 `17`, 196 `16`, 197 `13`.
- Final quality summary: `286/286` sign-like rows meet `3x` output-pixel file dimensions; `286/286` remain `threeXStatus: source-limited-exception`; `286/286` use `sourceLimitedDisposition: best-official-source-3x-output-pixels`; `0/286` are counted as true native/effective `3x` passes; `30` category headings are `category-heading-dom` and excluded from sign quality counts.
- Final asset paths: committed PNG outputs are under `content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/<section-id>/individual-3x/<entry-id>.png`; file count is `286`. Runtime inventory `src/data/manual-signs/app4SignEntries.json` now has `renderModeCounts`: `individual-source-crop-3x: 286`, `category-heading-dom: 30`.
- Final inventory/UI update: `scripts/manual-sign-inventory.mjs` overlays feature-037 evidence onto the baseline build and validates asset hashes, dimensions, output-pixel ratios, source-evaluation references, source-limited disclosure, crop audit status, no-upscale proof, and forbidden render modes. `src/App.tsx` renders sign-like rows with direct local `<img>` assets and selectable Spanish/Russian captions outside protected images; category headings render as DOM rows. The old learner-facing `ManualSignSourceClip`/`source-image-css-clip` path is no longer used for sign-like runtime rows.
- Final TypeScript/style update: `src/data/manual-signs/app4SignCatalog.ts` records the feature-037 fields and nullable DOM-heading assets; `src/styles.css` uses natural-dimension constrained display (`max-width`/`max-height`) for direct sign images and removes the active old sheet-clip viewport styling.
- Crop-bound correction notes: known screenshot problem rows were corrected in final output. `app4regulatory-p185-011-no-circular-carro-de-traccion-animal` no longer includes neighboring partial labels; `app4regulatory-p185-021-no-estacionar-acarreo-de-infractores-placa-horar` preserves the attached plate while excluding neighboring/source label tail; `app4traffic-lights-p197-006-disposicion-de-unidades-opticas-vertical` preserves the full vertical signal; `app4traffic-lights-p197-003-rojo-rojo-intermitente-amarillo-amarillo-intermi` excludes right-neighbor arrows.
- Final visual evidence: `scripts/manual-sign-visual-qa.mjs` generated all six contact sheets under `specs/037-manual-sign-crop-resolution/evidence/contact-sheets/` plus all six desktop and all six mobile runtime screenshots under `specs/037-manual-sign-crop-resolution/evidence/screenshots/`. `visual-qa-summary.json` reports `0` unloaded images, `0` no-upscale violations, `0` overflow counts, `0` caption gaps, `0` old render-mode counts, `0` pending audit rows, and `0` inventory no-upscale violations.
- Final command outcomes:
  - `node --check scripts/manual-sign-crop-resolution.mjs`: passed.
  - `swiftc -typecheck scripts/manual-sign-crop-resolution.swift`: passed.
  - `node scripts/manual-sign-crop-resolution.mjs --write`: passed, wrote `286` output crops and all-row final evidence.
  - `node --check scripts/manual-sign-inventory.mjs`: passed.
  - `node scripts/manual-sign-inventory.mjs --write`: passed, `316` entries validated.
  - `pnpm install --frozen-lockfile`: passed; no lockfile change.
  - `node --check tests/manual-sign-inventory.test.mjs`: passed.
  - `node --test tests/manual-sign-inventory.test.mjs`: passed, `11/11`.
  - `node --check scripts/manual-sign-visual-qa.mjs`: passed.
  - `node scripts/manual-sign-visual-qa.mjs`: passed, wrote contact sheets.
  - `pnpm exec vite --host 127.0.0.1 --port 5178`: started Vite at `http://127.0.0.1:5178/`.
  - `node scripts/manual-sign-visual-qa.mjs --runtime-url http://127.0.0.1:5178/`: passed, wrote desktop/mobile screenshots and visual QA summary.
  - In-app Browser QA opened `http://localhost:5174/`, navigated to the regulatory sign section, and confirmed direct rendered sign cards without old render modes.
  - `pnpm run validate:manual-sign-inventory`: passed.
  - `pnpm run test`: passed; latest assignment #2 preflight reports `447/447`.
  - `pnpm run build`: passed; existing large-chunk warnings only; generated service worker with `2156` cached assets.
  - `pnpm run preflight`: passed, including feature-memory gate, repo baseline check, content validation, manual-sign inventory validation, `447/447` tests, build/service worker generation, and `82/82` Playwright e2e tests.
- Final dead ends/implementation notes: initial direct `sourceRegion + cropRegion` PDF scaling produced blank/sliver/wrong crops and was rejected; whole-sheet mapping without row/column constraints admitted neighbors on some rows and was corrected; initial generic tail trimming could remove attached plates, so final tooling uses row-specific tail trim modes where needed; a Swift `UInt8` overflow in edge/content scanning was fixed before final crop output; PR #203 review-fix runtime QA used `pnpm exec vite --host 127.0.0.1 --port 5178` to avoid the earlier package-script port-forwarding ambiguity.
- PR #203 Review Agent blocking finding fix: review thread `pullrequestreview-4445932970` / discussion `discussion_r3370201362` identified visibly clipped/partial crops that had been stamped `reviewed-final-correct`, including `NO CAMBIAR DE CARRIL`, `USO DE CADENAS PARA NIEVE`, both `GIRO OBLIGATORIO` variants, `FIN DE CAMINO PEATONAL A 100 M`, and `AVANZAR` pedestrians. Root cause: candidate windows followed feature-036 row crops too closely, Swift trim could select an internal component or neighboring row/column, and the generator did not require a recorded passing crop-audit basis before assigning the reviewed status.
- PR #203 crop fix: `scripts/manual-sign-crop-resolution.mjs` now expands candidates with section-specific row/column safeguards, gives pedestrian traffic-light rows a short top lookback to avoid pulling the adjacent pedestrian signal, and assigns `reviewed-final-correct` only from `automatedCropAudit.passes`. `scripts/manual-sign-crop-resolution.swift` now uses baseline-anchor connected-component trimming, focused fallback around small color components, and preserves protected source pixels without cleanup/redraw. The cited rows now have corrected bounds: `NO CAMBIAR DE CARRIL` `57x58`, `USO DE CADENAS` `58x58`, `GIRO OBLIGATORIO derecha` `58x58`, `GIRO OBLIGATORIO izquierda` `58x58`, `FIN DE CAMINO PEATONAL A 100 M` `44x59`, and `AVANZAR` pedestrians `91x44` at source y `2207`.
- PR #203 audit/validation fix: every sign-like row now carries `cropAuditBasis` with output-pixel target, relative source-bounds thresholds, edge-contact policy, edge-contact pass, final source region, and `passes`. `scripts/manual-sign-inventory.mjs` and `tests/manual-sign-inventory.test.mjs` now fail on missing/pending/non-passing crop audit basis, hash/dimension mismatches, no-upscale violations, and the review-cited crop regressions. `visual-qa-summary.json` after the review fix reports `pendingAuditCount: 0`, `renderModeViolations: 0`, `noUpscaleViolationsInInventory: 0`, and `0` unloaded/no-upscale/overflow/caption-gap counts across contact sheets and desktop/mobile runtime screenshots.
- PR #203 review-fix assignment #2 start at `2026-06-07T23:21:39Z`: Review Agent blocking finding on head `7bdf95f12c8b7ba6c930b406171d7cccd2a19e23` says some warning-section final crops remain contaminated by neighboring entries/unrelated source text while still passing `cropAuditBasis` and `reviewed-final-correct`. Cited rows are `app4warning-p188-004-cruce-de-ciclistas-catalog-entry`, `app4warning-p188-005-jinetes-catalog-entry`, `app4warning-p188-009-presencia-de-vehiculos-extranos-tranvia`, and `app4warning-p188-010-presencia-de-vehiculos-extranos-tractor`. Implementation must fix the broader contamination class across all `286` sign-like rows, regenerate affected assets/evidence/contact sheets/runtime QA, strengthen validation/tests, keep source-limited disclosure unchanged, and push a follow-up PR commit without merging.
- PR #203 review-fix assignment #2 completed at `2026-06-07T23:46:57Z`: root cause was a warning-section crop path that combined too-wide horizontal expansion, broad external-label preservation, and color-component fallback selection that could include adjacent yellow warning signs or nearby source labels while still satisfying generic source-bounds/edge-contact thresholds. The all-row audit also found the same failure class in lower detached source captions for `app4informational-p190-007-cruce-peatonal-derecha` and `app4informational-p190-008-cruce-peatonal-izquierda`.
- PR #203 contamination fix: `scripts/manual-sign-crop-resolution.mjs` now routes warning rows through tighter external-label trimming, warning-specific lookback/lookahead, no warning column guards, and a required `neighborContaminationGuardPass`; `scripts/manual-sign-crop-resolution.swift` now selects the nearest color component only when it intersects the baseline anchor, clamps isolated warning crops, and trims lower detached source captions. `reviewed-final-correct` remains constrained to rows with a passing audit basis, and `scripts/manual-sign-inventory.mjs` rejects any sign-like row without `neighborContaminationGuardPass: true`.
- PR #203 contamination regression tests: `tests/manual-sign-inventory.test.mjs` now locks the four Review Agent cited warning rows to isolated final source dimensions, requires `neighborContaminationGuardPass`, verifies the generator cannot stamp `reviewed-final-correct` without the contamination guard, and adds coverage for the p190 lower-caption trim. Cited row final source bounds after regeneration: p188-004 `70x71`, p188-005 `67x71`, p188-009 `70x70`, p188-010 `75x71`; all remain `threeXStatus: source-limited-exception` with `sourceLimitedDisposition: best-official-source-3x-output-pixels`.
- PR #203 regenerated evidence for assignment #2: `node scripts/manual-sign-crop-resolution.mjs --write` regenerated all `286` sign-like PNG crops and final evidence under `specs/037-manual-sign-crop-resolution/evidence/final/`; `node scripts/manual-sign-inventory.mjs --write` regenerated `src/data/manual-signs/app4SignEntries.json`; `node scripts/manual-sign-visual-qa.mjs` regenerated all six contact sheets under `specs/037-manual-sign-crop-resolution/evidence/contact-sheets/`; `node scripts/manual-sign-visual-qa.mjs --runtime-url http://127.0.0.1:5178/` regenerated all six desktop and all six mobile screenshots plus `specs/037-manual-sign-crop-resolution/evidence/screenshots/visual-qa-summary.json`. Visual QA summary remains clean: `pendingAuditCount: 0`, `renderModeViolations: 0`, `noUpscaleViolationsInInventory: 0`, with `0` unloaded images, overflow counts, and caption gaps.
- PR #203 assignment #2 command outcomes:
  - `node --check scripts/manual-sign-crop-resolution.mjs`: passed.
  - `swiftc -typecheck scripts/manual-sign-crop-resolution.swift`: passed.
  - `node scripts/manual-sign-crop-resolution.mjs --write`: passed, wrote `286` output crops, `286` source-limited exceptions, and `0` true native/effective `3x` passes.
  - `node --check scripts/manual-sign-inventory.mjs`: passed.
  - `node --check tests/manual-sign-inventory.test.mjs`: passed.
  - `node scripts/manual-sign-inventory.mjs --write`: passed, `316` entries validated.
  - `pnpm run validate:manual-sign-inventory`: passed.
  - `node --test tests/manual-sign-inventory.test.mjs`: passed, `13/13`.
  - `node scripts/manual-sign-visual-qa.mjs`: passed, contact sheets regenerated.
  - `pnpm exec vite --host 127.0.0.1 --port 5178`: served runtime QA at `http://127.0.0.1:5178/`.
  - `node scripts/manual-sign-visual-qa.mjs --runtime-url http://127.0.0.1:5178/`: passed, desktop/mobile screenshots and visual QA summary regenerated.
  - `git diff --check`: passed before this final process-memory update; rerun after this update before staging.
  - `pnpm run preflight`: passed after the contamination fix, including feature-memory gate, repo baseline check, content validation, manual-sign inventory validation, `447/447` tests, build/service worker generation, and `82/82` Playwright e2e tests.
- Final Implementation Agent feedback for Architect/Orchestrator: no new blocker remains under the `2026-06-07T21:36:51Z` disposition, but completion/PR wording must keep the all-row source-limited disclosure: these are source-faithful best-official-source `3x` output-pixel crops, not true native/effective `3x` detail. If the owner later requires true native/effective `3x`, better exact official source material is required.
