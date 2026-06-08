# Feature Request: Manual Sign Crop Accuracy And 3x Resolution Re-Extraction

## Intake Context

- Analyst role: assigned by Orchestrator for Cabadrive feature intake only.
- Assigned worktree: `/Users/chap/devel/cabadrive-worktrees/037-manual-sign-crop-resolution`.
- Assigned branch: `codex/037-manual-sign-crop-resolution`.
- Verified base provided by Orchestrator: `origin/main` at `a371374aa9234f671db9604d98936e73651adb6b`, fetched `2026-06-07`.
- Feature folder: `specs/037-manual-sign-crop-resolution/`.
- Existing maximum numeric prefix observed under `specs/`: `036`; this feature uses `037`.
- Parallel-work warning from Orchestrator: parallel Orchestrators/agents may be active. Preserve all existing dirty diffs, branches, commits, PRs, sibling worktrees, and process memory. Do not touch sibling worktrees or unrelated files.
- Intake artifact scope: this Analyst intake creates only `specs/037-manual-sign-crop-resolution/feature-request.md`.
- Analyst writes no code, tests, technical spec, plan, tasks, runtime assets, durable docs outside this assigned intake artifact, commits, pushes, PRs, merge actions, or repository/GitHub coordination.

## Original User Request

Russian original:

> 1. часть знаков обрезано криво
> 2. все знакеи в плохом качестве, вырезать с разрешением выше в 3 раза
>
> оркестратор

The user attached a screenshot of the manual sign catalog grid. Several sign entries are visibly blurry/pixelated, and some crops are visibly wrong: content is cut off, a neighboring sign or text appears inside the crop, or only part of the intended sign item is visible. Examples in the screenshot include no-parking/parking-related entries where the crop cuts through neighboring material or clips the sign, and entries whose sign image is too low-quality for comfortable study.

Plain-language interpretation:

- The individual sign catalog produced by feature `036-manual-sign-pages` is not acceptable yet.
- Some individual sign crops/source regions are inaccurate and need to be corrected against the official source sheets.
- All sign/sign-like images need to be re-extracted or regenerated at approximately three times higher natural resolution than the current displayed/cropped sign assets, using official source material, so they do not look blurry at runtime.
- The fix must improve source extraction quality and crop accuracy, not browser-upscale the current low-quality crops.

No normal-flow clarification is required for intake. The request is specific enough to route to architecture with assumptions and acceptance expectations recorded below.

## Request Classification

This is a repository-changing corrective defect/regression request for the current interactive `Руководство` Appendix IV sign catalog.

It is a follow-up to:

- feature `034-manual-visual-content-crop`, which established that manual visuals must be sourced from official material at high quality, not stretched from margin-heavy or low-useful-content rasters; and
- feature `036-manual-sign-pages`, which rebuilt Appendix IV sign pages into individual sign/sign-like entries but recorded the implementation as `source-image-css-clip` from unchanged official source-sheet assets, with `316` final rows and no separate crop files written for app rendering.

The new defect is narrower than feature `036`'s original product goal but critical to that goal: individual entries exist, but crop regions and visual quality do not consistently satisfy the user's requested study experience.

## Project Context

- Cabadrive is a static local-first React/TypeScript/Vite web trainer for Russian-speaking drivers preparing for the CABA theory exam.
- There is no runtime backend. Content and assets must remain bundled local/static content after build.
- The local runtime contract remains Docker-only for end users: `make build`, `make up`, and `make down`.
- The user-facing manual destination is `Руководство`, a native interactive Russian document surface derived from the official GCBA four-wheel vehicle manual and organized by the source `Índice`.
- The manual surface must not use a runtime PDF viewer, PDF.js canvas, iframe/object/embed PDF loading, remote images, runtime network fetches, backend endpoints, live AI, full-page raster-only document rendering, or remote fonts.
- Manual conversion rules require source-faithful local artwork and high-resolution extraction evidence: x5/source export, direct high-DPI PDF export, source-native raster dimensions, or documented equivalent/better method, with dimensions, hashes where practical, runtime display size, and no-upscale proof.
- Traffic signs, signal images, road markings, photos, and maps are protected source-as-is assets. They must not be translated, relabeled, redrawn, recolored, cleaned, sharpened, reconstructed, vectorized, retouched, masked, inpainted, denoised, or otherwise modified.
- Russian translations/captions belong outside protected images as selectable text.
- Official sign imagery, including sign faces, embedded text, supplementary plates/tablets, arrows, colors, borders, pictograms, and any included source label pixels, must remain original official imagery.

## Relevant Prior Feature Memory

Feature `034-manual-visual-content-crop` established that high-quality source extraction is required when manual visuals are too small, blurry, or unreadable. It rejected CSS-only stretching and protected official imagery from retouching or translated overlays.

Feature `036-manual-sign-pages` established the sign-catalog product goal:

- every in-scope Appendix IV sign/sign-like item should be represented individually;
- source order must be preserved;
- each entry should have Spanish and Russian captions outside the image;
- protected sign imagery must remain unmodified; and
- evidence should prove coverage, order, image quality, no-upscale behavior, and protected-pixel preservation.

Feature `036` final evidence recorded:

- `316` inventory rows across source pages `185-197`;
- `283` catalog entries, `30` category-heading rows, and `3` contextual visuals;
- six Appendix IV sections: regulatory, warning, informational, temporary, horizontal markings, and traffic lights/signals;
- app rendering through `renderMode: "source-image-css-clip"`;
- extraction method recorded as `source-image-css-clip-from-existing-official-source-as-is-asset; no crop file written or re-encoded`; and
- source assets clipped from existing sign-sheet images under `content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/...`.

The new screenshot indicates that this approach can preserve original pixels while still failing the learner experience: crop regions may be off, and the natural quality/resolution of the source-sheet clips is too low for individual sign study.

## Goal

Repair the Appendix IV individual sign catalog so that every sign/sign-like entry is accurately cropped and displayed from a higher-quality official-source extraction, with natural image quality high enough for study and without altering protected sign pixels.

The expected improvement is approximately `3x` higher extraction/output resolution for all sign/sign-like images compared with the current individual sign crops/source-region outputs, or a documented official-source-equivalent/better method that provides at least the same practical quality improvement.

## Scope

In scope:

- All current individual sign/sign-like catalog entries from feature `036`, covering Appendix IV source pages `185-197` and all six sign catalog sections:
  - `app4-signs-regulatory`;
  - `app4-signs-warning`;
  - `app4-signs-informational`;
  - `app4-signs-temporary`;
  - `app4-signs-horizontal`;
  - `app4-signs-traffic-lights`.
- Correct every inaccurate crop/source region where the visible image cuts off the intended entry, includes neighboring entries, clips captions or attached plates/tablets, or shows the wrong source item for the Spanish/Russian caption.
- Re-extract or regenerate every sign/sign-like visual at roughly three times higher natural resolution than the current individual crop/source-region output, using the official source PDF or another evidence-backed official retained source asset.
- Preserve all source order, row counts, section mapping, and caption-to-visual matching established by feature `036`, unless Architect records a correction to a feature `036` inventory error.
- Preserve Spanish and Russian captions as selectable text outside the protected image.
- Preserve protected official sign/marking/signal pixels exactly inside the crop; quality improvement must come from higher-resolution source extraction, not image editing.
- Record evidence for crop correctness, source page/region, extraction method, natural dimensions before/after, hashes where practical, runtime display size, no-upscale behavior, and protected-pixel preservation.
- Add or update tests/validation/evidence so future regressions catch clipped crops, neighboring-content crops, wrong caption-to-visual matches, low-resolution crops, and runtime upscaling.
- Update durable docs only if implementation changes or clarifies the reusable sign extraction/crop-quality contract.

Out of scope:

- Reopening the product decision to make individual sign entries; that is already the feature `036` direction.
- Adding unrelated new manual sections or changing non-sign manual chapters.
- Changing practice question content, exam mode behavior, current content availability mode, source archive policy, or unrelated product surfaces.
- Using generated, unofficial, redrawn, cleaned, sharpened, vectorized, translated-inside-image, recolored, masked, retouched, inpainted, denoised, reconstructed, or approximate replacement sign artwork.
- Translating or modifying Spanish text inside a sign body, supplementary plate/tablet, marking, signal, or other protected image region.
- Treating CSS zoom, browser transforms, `image-rendering`, or display scaling of the current low-resolution clips as a quality fix.
- Introducing runtime PDF rendering, remote images, network fetches, a backend service, or live AI.
- Analyst choosing exact extraction tools, crop algorithms, asset naming, renderer architecture, test structure, or merge strategy.

## Assumptions

- The screenshot shows the current `Руководство` Appendix IV sign catalog after feature `036` or equivalent integration work.
- "Все знаки" means all individual sign/sign-like catalog entries currently in scope for feature `036`, not only the visible screenshot examples.
- "Вырезать с разрешением выше в 3 раза" means the natural source extraction/output for each individual entry should be approximately `3x` higher in pixel dimensions or effective useful detail than the current individual displayed crop/source-region. Architect should define the measurable dimension baseline and any acceptable equivalent.
- If the current app uses CSS clipping from a source sheet, the fix may require real per-entry high-resolution crop assets or another source-faithful rendering strategy that provides higher natural detail per entry.
- Cropping may include the sign plus its official attached plate/tablet and any external source label pixels only when those pixels are part of the intended source crop. Russian captions still remain outside the image.
- If a source item has external catalog caption text below or near the sign, implementation may either keep those source pixels in the image or crop only the protected visual and repeat the Spanish label as external selectable text, as long as the result is source-faithful, complete, and not misleading.
- Some official source sheets may be embedded as limited-resolution rasters in the PDF. Before recording a source limitation, implementation should attempt the best official-source extraction strategy, including higher-DPI PDF rendering, source-native embedded image extraction, retained official source assets, or larger per-sign source regions.
- No normal-flow user clarification is needed before architecture. If implementation finds that exact `3x` is impossible for a subset from official sources, that should be recorded with evidence and routed as a narrow blocker/disposition, not silently accepted.

## Risks

- Automated crop correction can accidentally omit attached plates/tablets, sign labels, arrows, or other protected/exam-relevant details.
- Larger extraction may expose that some current crop coordinates were matched to the wrong source item; validation needs caption-to-visual review, not only image dimensions.
- Re-extracting hundreds of sign images can create large asset diffs and performance impact if file format, compression, lazy loading, and display caps are not handled carefully.
- A naive `3x` browser display increase would worsen pixelation; the quality gain must be natural/source extraction quality, not CSS enlargement.
- If the official source PDF embeds low-quality raster sheets, a fully satisfactory `3x` quality improvement may require finding a better official retained source or recording an evidence-backed limitation.
- Protecting source pixels while increasing quality may be confused with image cleanup. Evidence must distinguish source-faithful high-resolution extraction from forbidden retouching or enhancement.
- Contact-sheet or representative screenshot evidence alone may miss an individual bad crop; this feature needs all-entry audit evidence.

## Open Questions

- Architect should define the exact measurable baseline for "`3x` higher resolution": per-entry crop natural width/height, useful sign bounding-box dimensions, exported DPI, or another objective metric tied to current feature `036` output.
- Architect should decide whether every entry must become a separate committed raster asset, whether high-resolution CSS clipping from higher-resolution official sheets is acceptable, or whether a mixed strategy is safest.
- Architect should decide whether category-heading and contextual-visual rows from feature `036` need the same `3x` treatment or only catalog-entry/sign-like rows. The user said "знаки"; default assumption is all sign/sign-like catalog entries, with headings/contextual rows dispositioned explicitly.
- Architect should define evidence expectations for crop correctness: per-entry contact sheets, audited JSON, automated visual bounds checks, manual review status, screenshot coverage, or a combination.
- Architect should decide how to record a narrow source-limited exception if exact `3x` is impossible for a specific official source item after best-source attempts.

## Acceptance Expectations

The feature should be considered successful only when all of the following are true:

1. Every in-scope sign/sign-like catalog entry has been checked against the official source visual and has a corrected crop/source region.
2. No entry is visibly cut off, clipped through the intended sign, missing an attached plate/tablet, or contaminated by neighboring signs/text that do not belong to that entry.
3. Every in-scope sign/sign-like visual is re-extracted or regenerated from official source material at approximately `3x` higher natural resolution than the current individual crop/source-region output, or a documented official-source-equivalent/better quality target accepted by Architect.
4. The final displayed images do not look blurry, pixelated, stretched, or browser-upscaled at their intended desktop and mobile runtime sizes.
5. Runtime display never enlarges an entry beyond its natural/source output dimensions.
6. Spanish and Russian captions remain outside protected imagery and continue to match the displayed source visual.
7. Source order, section grouping, and complete coverage from feature `036` are preserved or explicitly corrected with evidence.
8. The implementation remains fully local-first/static and uses bundled local assets only.
9. Protected source imagery remains unmodified: no redraw, cleanup, sharpening, recolor, translation inside image, mask, inpaint, denoise, vectorization, or generated replacement.
10. Evidence records before/after dimensions or quality baseline for every entry, source page/source region or source asset, extraction method, hashes where practical, runtime display/no-upscale proof, and crop audit status.
11. Desktop and mobile visual QA covers all six Appendix IV sign sections, and all-entry contact sheets or equivalent evidence make every corrected entry auditable.
12. Automated validation/tests fail on missing entries, stale hashes/dimensions, crop regions outside source bounds, low-resolution/non-`3x` outputs without an accepted exception, caption omissions, order regressions, and forbidden protected-image edit patterns where feasible.
13. Standard local verification required by Architect/Implementation is recorded before PR completion, including focused sign inventory validation, relevant tests, build/preflight as appropriate, and `git diff --check`.

## Negative Scenarios

- Fixing only the screenshot examples while leaving other Appendix IV entries blurry or mis-cropped.
- Increasing CSS image size or grid/card size without re-extracting higher-quality source visuals.
- Browser-upscaling the current low-resolution source-sheet clips and calling that the `3x` quality improvement.
- Keeping a crop that cuts off part of a sign, plate, arrow, marking, signal, or source label that belongs to the entry.
- Showing the wrong sign image next to a Spanish/Russian caption.
- Including neighboring signs or unrelated text inside the crop because the crop bounds are wrong.
- Replacing official sign pixels with cleaned, redrawn, generated, sharpened, vectorized, translated, recolored, retouched, or reconstructed artwork.
- Moving Russian translations inside the image or covering Spanish/protected pixels with overlays.
- Weakening feature `036` completeness, order, or caption requirements while fixing quality.
- Relying only on representative screenshots rather than all-entry audit evidence.
- Introducing runtime PDF viewer behavior, remote assets, network fetches, backend services, or non-local dependencies.

## Acceptance Evidence Expected

- A current all-entry inventory for the sign catalog with one auditable row per in-scope entry, including section id, source page, source order, Spanish label, Russian translation, source visual reference, crop/source region, output asset path or render strategy, natural dimensions, hash where practical, extraction method, no-upscale constraint, protected-source preservation note, and audit status.
- Before/after quality evidence showing the current feature `036` crop/source-region dimensions or effective useful detail and the new `3x` or equivalent higher-quality output for each entry or for each entry class with per-entry dimensions recorded.
- All-entry crop correctness evidence, such as per-section contact sheets or an equivalent review artifact, showing every final visual with its Spanish/Russian caption so wrong, clipped, or neighboring-content crops can be audited.
- Desktop and mobile screenshots or Playwright evidence for all six Appendix IV sections:
  - regulatory;
  - warning;
  - informational;
  - temporary;
  - horizontal markings;
  - traffic lights/signals.
- Automated validation for inventory completeness, source order, captions, asset existence, hashes, dimensions, no-upscale constraints, crop bounds, and absence of pending/unreviewed crop-quality rows.
- Evidence that protected official image pixels are not modified beyond source-faithful extraction/cropping.
- Evidence that the final browser display does not upscale the images beyond natural/source output dimensions.
- Recorded disposition for category headings/contextual visuals and any official-source-limited entries.
- Command evidence requested by Architect, expected to include focused sign inventory validation/tests, app tests/build as appropriate, `git diff --check`, and preflight or documented blocker/fallback.

## Research And Sources

No external web research was used for this intake. The request, attached screenshot, repository memory, and existing feature memory were sufficient.

Sources read during intake:

- `.specify/memory/constitution.md`
- `docs_project/README.md`
- `docs_project/project-idea.md`
- `docs_project/project/frontend/frontend-docs.md`
- `docs_project/project/backend/backend-docs.md`
- `docs_project/project/feature-inventory.md`
- `docs_project/screens/learning-and-exam-flows.md`
- `docs/specify/README.md`
- `docs_project/project/frontend/manual-conversion-guidelines.md`
- `specs/034-manual-visual-content-crop/feature-request.md`
- `specs/034-manual-visual-content-crop/spec.md`
- `specs/034-manual-visual-content-crop/plan.md`
- `specs/034-manual-visual-content-crop/tasks.md`
- `specs/036-manual-sign-pages/feature-request.md`
- `specs/036-manual-sign-pages/spec.md`
- `specs/036-manual-sign-pages/plan.md`
- `specs/036-manual-sign-pages/tasks.md`
- `src/data/manual-signs/app4SignCatalog.ts`
- `src/data/manual-signs/app4SignEntries.json`
- `scripts/manual-sign-inventory.mjs`

## Analyst Handoff

This intake is ready for Orchestrator handoff to Architect. The customer intent is clear: the individual sign catalog must be corrected, not merely accepted because inventory rows exist. Some signs are cropped incorrectly, and all sign images need a higher-quality official-source re-extraction at roughly `3x` higher natural resolution, while preserving every protected sign pixel and keeping captions outside images. Architect should turn this into measurable resolution/crop-quality requirements and all-entry verification tasks before Implementation Agent edits code, assets, or tests.

## Final Analyst Validation Notes

Analyst validation pass: passed
Final Analyst validation completed at: 2026-06-08T00:19:36Z
Effective content head: 076cf8c8090decb4722f8bf0ca7814a158494137
Analyst validated effective content head: 076cf8c8090decb4722f8bf0ca7814a158494137
Analyst return count: 0
Analyst validation evidence: Final Architect validation passed first at 2026-06-08T00:18:14Z for the same effective content head 076cf8c8090decb4722f8bf0ca7814a158494137.
Analyst validation evidence: Review Agent latest PR #203 review reports no findings for the effective content head, and Orchestrator evidence reports required non-draft checks green except AI Review skipped while draft for later finalization handling.
Customer intent check: the reported crooked/clipped sign crops are addressed by direct per-entry sign-like assets, all cited crop clipping and neighboring-content contamination classes fixed, all six Appendix IV sign sections covered, source order and captions preserved, and Spanish/Russian captions kept outside protected imagery.
Customer intent check: the poor-quality sign issue is addressed under the Architect-disposed source-limited contract: `286` sign-like rows use source-faithful best-official-source `3x` output-pixel PNG crops with no browser upscaling, while honestly recording `286` source-limited exceptions and `0` true native/effective `3x` detail passes.
Customer intent check: this satisfies the original request in spirit and letter as far as the available official source permits, provided completion wording remains honest and does not claim true native/effective `3x` detail.
Gaps, if any: none remain under the recorded source-limited disposition.
Architect disposition routing: none required because no final Analyst gaps remain.
Analyst boundary reminder: Analyst final validation appended only to `specs/037-manual-sign-crop-resolution/feature-request.md` and did not edit code, tests, runtime assets, scripts, source data, Architect-owned artifacts, staging, commits, pushes, PR review state, checks, conversations, or merge state.

## Final Analyst Validation Refresh

Analyst validation pass: passed
Final Analyst validation completed at: 2026-06-08T03:29:12Z
Effective content head: 696bc400fc2a1b9f4f61759438ddf7744ff82196
Analyst validated effective content head: 696bc400fc2a1b9f4f61759438ddf7744ff82196
Analyst return count: 0, within the 5-return Analyst limit.
Prior Analyst validation freshness: the earlier Analyst validation for effective content head `076cf8c8090decb4722f8bf0ca7814a158494137` is stale for completion because later PR #203 commits changed product assets, source data, scripts, tests, official-source manifest/content records, runtime JSON projection, and evidence. This refresh validates only current effective content head `696bc400fc2a1b9f4f61759438ddf7744ff82196`.
Analyst validation evidence: Fresh final Architect validation passed first at 2026-06-08T03:27:37Z for the same effective content head `696bc400fc2a1b9f4f61759438ddf7744ff82196`.
Analyst validation evidence: Orchestrator reports PR #203 required checks passed on this head, including AI Review run `27113984933`, `baseline-checks`, `docker-validation`, `guard`, and `osv-scan`; latest Review Agent review `pullrequestreview-4446426483` has no findings, and older connector P1/P2 findings were addressed in commit `696bc400`.
Customer intent check: the original crooked-crop complaint is satisfied under the recorded evidence: all six Appendix IV sign sections are covered, `316` baseline rows are preserved, `286` sign-like rows use direct per-entry PNG assets, crop clipping/neighbor contamination classes from earlier reviews are fixed, source order and Spanish/Russian captions are preserved, and captions remain outside protected imagery.
Customer intent check: the original poor-quality / "3x higher resolution" request is satisfied under the accepted source-limited caveat: all `286` sign-like rows are source-faithful best-official-source `3x` output-pixel crops with no browser upscaling, while the implementation honestly records `286` source-limited exceptions and `0` true native/effective `3x` detail passes.
Customer intent check: protected official pixels remain source-faithful: no redraw, cleanup, sharpening, recolor, translation inside images, masking, retouching, vectorization, generated replacement, runtime PDF rendering, or remote asset dependency is accepted by the validation evidence.
Gaps, if any: none remain under the Architect-disposed source-limited contract and honest completion wording requirement.
Architect disposition routing: none required because no final Analyst gaps remain.
Analyst boundary reminder: Analyst final validation refresh appended only to `specs/037-manual-sign-crop-resolution/feature-request.md` and did not edit code, tests, assets, scripts, runtime files, source data, Architect-owned artifacts, GitHub state, staging, commits, pushes, review threads, required checks, or merge state.

## Final Analyst Validation Notes

Analyst validation pass: passed
Final Analyst validation completed at: 2026-06-08T03:57:17Z
Effective content head: 2b33ddbc4ae20c1af054a9ead46b17eeaa776e64
Analyst validated effective content head: 2b33ddbc4ae20c1af054a9ead46b17eeaa776e64
Analyst return count: 0
Analyst validation evidence: Fresh final Architect validation passed first at 2026-06-08T03:53:48Z for the same effective content head `2b33ddbc4ae20c1af054a9ead46b17eeaa776e64`, with Architect return count `0`.
Analyst validation evidence: Prior Analyst validations for effective content heads `076cf8c8090decb4722f8bf0ca7814a158494137` and `696bc400fc2a1b9f4f61759438ddf7744ff82196` are stale for completion because later PR #203 work changed product assets, source data, scripts, tests, official-source manifest/content records, runtime JSON projection, evidence, or process memory.
Analyst validation evidence: Orchestrator reports PR #203 required checks passed on this head, including AI Review run `27114767540`, `baseline-checks`, `docker-validation`, `guard`, and `osv-scan`; stale review threads were resolved after verification that they referred to fixed or outdated crop/manifest findings.
Analyst validation evidence: Process-memory parser reports acceptance evidence, current process memory, and feedback disposition are true, with no pending known-issue decision.
Customer intent check: the original badly cropped sign complaint is satisfied under the recorded evidence because all six Appendix IV sign sections are covered, `316` rows are preserved, `286` sign-like rows use direct PNG assets, known clipping and neighboring-content contamination classes are fixed, source order and captions remain aligned, and Spanish/Russian captions remain outside protected imagery.
Customer intent check: the original poor-quality and `3x` re-cut request is satisfied under the accepted source-limited caveat because `286/286` sign-like rows are source-faithful best-official-source `3x` output-pixel crops with no browser upscaling, while all `286` are honestly recorded as source-limited exceptions and `0` are claimed as true native/effective `3x` detail passes.
Customer intent check: protected official pixels remain source-faithful under the evidence: no redraw, cleanup, sharpening, recolor, translation inside images, masking, retouching, vectorization, generated replacement, runtime PDF rendering, or remote asset dependency is accepted.
Gaps, if any: none remain under the Architect-disposed source-limited contract and mandatory honest completion wording.
Architect disposition routing: none required because no final Analyst gaps remain.
Analyst limit escalation: not applicable; Analyst return count is `0`, within the 5-return limit.
Analyst boundary reminder: Analyst final validation appended only to `specs/037-manual-sign-crop-resolution/feature-request.md` and did not edit code, tests, assets, scripts, runtime files, source data, Architect-owned artifacts, GitHub state, staging, commits, pushes, review threads, required checks, or merge state.

## Final Analyst Validation Notes

Analyst validation pass: passed
Final Analyst validation completed at: 2026-06-08T05:04:51Z
Effective content head: 3393bceb100d28fc23ea8123ff1286723c598505
Analyst validated effective content head: 3393bceb100d28fc23ea8123ff1286723c598505
Analyst return count: 0
Analyst validation evidence: Fresh final Architect validation passed first at 2026-06-08T05:02:51Z for the same effective content head `3393bceb100d28fc23ea8123ff1286723c598505`, with Architect return count `0`.
Analyst validation evidence: Prior Analyst validations for earlier effective heads are stale for completion because later PR #203 assignment #8 changed source-evaluation archive placement, official-document manifest/content records, source-evaluation evidence, and process memory.
Analyst validation evidence: Assignment #8 correctly moves Feature 037 source-evaluation archives out of governed official-documents records and into Feature 037 evidence; this preserves the official-documents exact-text boundary without weakening the sign-crop acceptance evidence.
Analyst validation evidence: Orchestrator reports `baseline-checks`, `docker-validation`, `guard`, and `osv-scan` passed on this head; AI Review opened the expected stale-final-validation blocker that this fresh Architect-to-Analyst validation sequence addresses, not a product/content gap.
Analyst validation evidence: Assignment #8 verification records source-evaluation write with expected source-limited exit `2`, official-documents validation passed, focused official-doc/primary-source tests `69/69`, content validation passed, preflight passed with `451/451` Node tests and `82/82` Playwright tests, git diff check passed, and feature-memory gate passed.
Customer intent check: the original badly cropped sign complaint remains satisfied because all six Appendix IV sign sections are covered, `316` rows are preserved, `286` sign-like rows use direct PNG assets, known clipping and neighboring-content contamination classes are fixed, source order and captions remain aligned, and Spanish/Russian captions remain outside protected imagery.
Customer intent check: the original poor-quality and `3x` re-cut request remains satisfied under the accepted source-limited caveat because `286/286` sign-like rows are source-faithful best-official-source `3x` output-pixel crops with no browser upscaling, while all `286` are honestly recorded as source-limited exceptions and `0` are claimed as true native/effective `3x` detail passes.
Customer intent check: protected official pixels remain source-faithful under the evidence: no redraw, cleanup, sharpening, recolor, translation inside images, masking, retouching, vectorization, generated replacement, runtime PDF rendering, or remote asset dependency is accepted.
Gaps, if any: none remain under the Architect-disposed source-limited contract and mandatory honest completion wording.
Architect disposition routing: none required because no final Analyst gaps remain.
Analyst limit escalation: not applicable; Analyst return count is `0`, within the 5-return limit.
Analyst boundary reminder: Analyst final validation appended only to `specs/037-manual-sign-crop-resolution/feature-request.md` and did not edit code, tests, assets, scripts, runtime files, source data, Architect-owned artifacts, GitHub state, staging, commits, pushes, review threads, required checks, or merge state.
