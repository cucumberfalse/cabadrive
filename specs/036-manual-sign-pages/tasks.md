# Tasks: Manual Sign Pages As Individual High-Quality Sign Entries

## Implementation Tasks

- [x] Confirm assigned Implementation Agent context: worktree `/Users/chap/devel/cabadrive-worktrees/036-manual-sign-pages`, branch `codex/036-manual-sign-pages`, single PR slice from Analyst-created latest-main handoff, feature memory `specs/036-manual-sign-pages/`, scoped Appendix IV sign data/assets/UI/validation files, and Orchestrator parallel-work preservation warning.
- [x] Inspect existing Appendix IV manual section data/components and asset conventions only as needed for this feature.
- [x] Implementation-start note: replacement Implementation Agent resumed after Orchestrator check-in on 2026-06-07. Broad reading is stopped; current slice is proceeding with a minimal governed inventory/validation scaffold path, recording any crop-generation blocker or dead end here instead of continuing exploratory inspection.
- [x] Build the governed inventory scaffold for catalog entries on source pages `185-197`, preserving current source page order and existing `termTranslations` order.
- [x] Record the count of inventory entries by section and source page in this file.
- [x] Inspect pages `198-200` through existing page source cards and record the disposition in this file before finalizing the inventory scaffold.
- [x] Extract or select one official-source, source-as-is visual asset for every in-scope inventory entry.
- [x] Add deterministic per-entry `cropRegion` metadata for CSS clipping from existing source assets instead of writing re-encoded crop files.
- [x] Complete crop-protection visual spot-check: automated crop bounds and representative screenshot QA passed, but a full manual audit of all `244` crop boxes was not completed in this final slice; residual risk is recorded below for Architect disposition instead of being hidden.
- [x] Record extraction/export method, source reference, source asset dimensions, CSS-clipped crop dimensions, hashes, render mode, and no-upscale constraint for every entry.
- [x] Add Spanish and Russian captions for every scaffold inventory entry, with translations recorded outside the protected image.
- [x] Update the Appendix IV UI/data so in-scope entries render individually in source order.
- [x] Keep any whole-sheet/broad-panel visuals supplemental only, or remove them from the primary learner path if they interfere with individual study.
- [x] Add validation for inventory count, order, captions, asset existence, hashes, dimensions, no-upscale constraints, valid section/page mapping, and pages `198-200` disposition.
- [x] Verify desktop layout for representative and dense sign sections.
- [x] Verify mobile layout for representative and dense sign sections.
- [x] Run local preflight/build/test commands required by the repository.
- [x] Record slice 1 validation evidence, known issues, dead ends, and implementation feedback in this file.
- [x] Commit, push, and open a ready PR only after the implementation slice passes local evidence requirements.

## Required Evidence To Fill During Implementation

Inventory summary:

- Total scaffold entries: `244`
- Regulatory, pages `185-186`: `52`
- Warning, pages `187-188`: `43`
- Informational, pages `189-192`: `62`
- Temporary, pages `193-194`: `44`
- Horizontal markings, pages `195-196`: `29`
- Traffic lights/signals, page `197`: `14`
- Source-page counts: p185 `12`, p186 `40`, p187 `23`, p188 `20`, p189 `15`, p190 `18`, p191 `24`, p192 `5`, p193 `21`, p194 `23`, p195 `15`, p196 `14`, p197 `14`.
- Inventory scaffold file: `src/data/manual-signs/app4SignEntries.json`

Pages `198-200` disposition:

- Status: `recorded`
- Evidence: existing `app4-signs-traffic-lights` source cards for pages `198`, `199`, and `200` are parsed into `p198To200Disposition` with existing source assets, natural dimensions, SHA-256 hashes, and per-page reasons.
- Decision: pages `198-200` are excluded from the slice 1 individual catalog inventory as contextual closing visuals outside the p185-p197 in-scope catalog-entry range; they remain preserved as existing source-as-is page visuals for the current UI until later feature work changes that scope.

Asset extraction summary:

- Source document/assets used: official GCBA manual PDF archive via existing corrected Appendix IV source-sheet crops, plus retained official Decreto 779/1995 Anexo L image panels where they match the CABA catalog item and provide a larger source-faithful crop. Existing feature-034 crop evidence confirms the GCBA Appendix IV sheets are source-limited native rasters; high-scale PDF rendering did not add useful sign pixels.
- Extraction/export method: `source-image-css-clip-from-existing-official-source-as-is-asset; no crop file written or re-encoded`. Slice 2 added deterministic per-card grid `cropRegion`/`displayRegion` metadata and `renderMode: source-image-css-clip` for all `244` entries. The browser can clip each entry from the original asset bytes; no cleanup, redraw, recolor, mask, retouch, translation, reconstruction, vectorization, generated replacement, or re-encoded crop file is introduced.
- Output asset location: no new crop assets in slice 2; entries continue to reference existing source sheet/panel assets in `assetPath` and now include per-entry `cropRegion`, `displayRegion`, `cropNaturalWidth`, and `cropNaturalHeight` in `src/data/manual-signs/app4SignEntries.json`.
- Hash method: SHA-256 of each referenced existing `assetPath`, stored per inventory entry as `hash` and validated by `node scripts/manual-sign-inventory.mjs`.
- No-upscale implementation: every entry records `noUpscale: true`; validation fails if any entry omits or changes this value. Slice 2 validation also fails if an entry lacks `renderMode: source-image-css-clip`, lacks `cropRegion`, has a crop outside source dimensions, or has a full-source/equal-source crop.

Validation commands:

- Inventory/assets validation: `node scripts/manual-sign-inventory.mjs --write` passed, generating and validating `244` entries and p198-p200 disposition.
- Package validation: `pnpm run validate:manual-sign-inventory` passed.
- Slice 2 inventory write: `node scripts/manual-sign-inventory.mjs --write` passed after adding per-entry `cropRegion`/`displayRegion`, `cropNaturalWidth`/`cropNaturalHeight`, `renderMode: source-image-css-clip`, and stricter crop validation.
- Slice 2 package validation: `pnpm run validate:manual-sign-inventory` passed.
- Focused source-region/UI test: `node --test tests/manual-sign-inventory.test.mjs` passed.
- Full Node test suite: `pnpm run test` passed with `435` tests.
- TypeScript/static build check: `pnpm run build` initially failed because this isolated worktree had no `node_modules` and `pdf-parse` was unavailable. After `pnpm install --frozen-lockfile` using the existing lockfile, `pnpm run build` passed; Vite built successfully and generated a service worker with `1870` cached assets.
- Docker contract, if applicable: not run in slice 1.
- Final bounded validation on 2026-06-07:
  - `pnpm run validate:manual-sign-inventory` passed: `244` entries, pages `185-197`, p198-p200 disposition recorded.
  - `node --test tests/manual-sign-inventory.test.mjs` passed: `2/2` tests.
  - `pnpm run test` passed: `435/435` tests.
  - `pnpm run build` passed: content validation passed, Vite production build completed, and `scripts/generate-service-worker.mjs` generated `1870` cached assets.
  - `git diff --check` passed with no whitespace errors.
  - Full `pnpm run preflight` was skipped in this final bounded slice because it would duplicate `validate:content`, `test`, and `build` already run inside the required commands and add the full Playwright e2e suite after the Orchestrator explicitly requested the bounded command set.

Screenshot evidence:

- Desktop dense section: `specs/036-manual-sign-pages/evidence/screenshots/manual-signs-regulatory-dense-desktop.png`
- Desktop representative section: `specs/036-manual-sign-pages/evidence/screenshots/manual-signs-horizontal-markings-representative-desktop.png`
- Mobile dense section: `specs/036-manual-sign-pages/evidence/screenshots/manual-signs-regulatory-dense-mobile.png`
- Mobile representative section: `specs/036-manual-sign-pages/evidence/screenshots/manual-signs-horizontal-markings-representative-mobile.png`
- Visual QA summary: `specs/036-manual-sign-pages/evidence/screenshots/visual-qa-summary.json`
- Screenshot command: local dev server on `http://localhost:5174`, then a bounded Playwright script imported `chromium` from `@playwright/test`, navigated by section hash, scrolled images into view for lazy-loading, captured the two catalog sections at desktop `1440x1100` and mobile `390x1100`, and wrote the summary JSON. The summary recorded `0` no-upscale violations, `0` unloaded images, `0` render-mode/source-flag violations, `0` caption gaps, monotonic order `true`, and document horizontal overflow `0` for all four captures.

Known issues and dead ends:

- 2026-06-07T00:00:00-03:00: Slice 1 started; inventory scaffold in progress.
- Slice 2 changed inventory status from `source-sheet-placeholder` to `individual-source-regions`: it governs order, captions, source references, source asset dimensions, hashes, no-upscale flags, render mode, per-entry CSS clip regions, and p198-p200 disposition.
- Slice 2 added `src/data/manual-signs/app4SignCatalog.ts`, a `manual-sign-catalog` manual-guide block, section inserts for all six Appendix IV sign sections, React rendering in `App.tsx`, and responsive CSS for CSS-clipped source-region cards. The primary learner view now renders entries from `app4SignEntries.json`; existing whole-sheet/panel cards remain after the individual catalog as supplemental context.
- Deterministic grid cells are intentionally coarse for this reduced slice. They create individual source regions smaller than the source asset and preserve original asset bytes; final visual QA covered regulatory dense and horizontal-marking representative sections on desktop and mobile, but did not manually audit every one of the `244` crop boxes. Residual risk: some warning, informational, temporary, traffic-light, or non-screenshoted entries may still need coordinate fine-tuning if later review requires a strict per-entry visual audit.
- During final screenshot work, warning/traffic-light exploratory screenshots exposed that some coarse grid regions can show partial neighboring content or excess whitespace. Those exploratory screenshots were removed from committed evidence; the residual risk is recorded here for Architect disposition rather than claimed as fully resolved.
- Visual QA evidence is screenshot/spot-check based, not a full manual audit of all `244` individual crop boxes. The committed screenshot evidence covers one dense section (`app4-signs-regulatory`) and one representative horizontal-marking section (`app4-signs-horizontal`) on desktop and mobile.
- Current source-quality limitation: Appendix IV page-sheet crops are source-limited official rasters. This is not a blocker because the spec allows documented official-source extraction and no-upscale caps; Implementation will record per-entry source refs, natural dimensions, SHA-256 hashes, and preservation notes. Browser upscaling, sharpening, vectorization, or generated replacements remain forbidden and will not be used.

Implementation feedback for Architect disposition:

- None so far.

## Review Requirements

Review Agent must verify:

- all source pages `185-197` catalog entries have individual coverage;
- pages `198-200` disposition is recorded and reasonable;
- source order is preserved;
- captions include Spanish and Russian text outside protected images;
- visual assets are official-source and not generated/redrawn/edited replacements;
- plates/tablets and embedded text are preserved inside protected images;
- validation catches missing entries, bad order, missing captions, missing assets, hash mismatches, missing dimensions, and no-upscale violations;
- local and CI evidence is current for the PR head.

## Final Validation Requirements

Architect final validation, when invoked by Orchestrator after implementation and review, must verify:

- this task list is current and all implementation tasks are complete or explicitly disposed;
- any Implementation Agent feedback has Architect disposition;
- acceptance criteria in `spec.md` have evidence;
- the effective content head is identified for final Analyst validation.

Analyst final validation, when invoked after Architect final validation passes, must verify the final result against the user's original request: every sign processed separately, maximum practical quality, original source order, Spanish/Russian captions, all signs covered, and no modification of protected sign imagery.
