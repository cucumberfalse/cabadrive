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

## Architect Follow-Up Tasks Required Before Merge

Architect disposition recorded at `2026-06-07T11:51:30-03:00`: PR `#202` at head
`7187b6986f5ad03af83a8f756aa85c2b3815c927` is not merge-ready. The residual crop QA issue is
accepted as required follow-up work, not as a non-blocking known issue. Architect return count
for this work cycle: `1/10` at that point. Current Architect return count is `2/10` after the
additional inventory-source blocker recorded below. Final Architect validation has not been
performed.

- [x] Replace or refine the deterministic equal-grid crop generation/data with per-entry source regions for every inventory entry on pages `185-197`.
- [x] Give special attention to non-uniform sheets and sections: warning pages `187-188`, informational pages `189-192`, temporary pages `193-194`, horizontal-marking pages `195-196`, and traffic-light/signal page `197`.
- [x] Verify all final `316` rows against their source sheets so each crop/source region contains the intended sign/sign-like item, contextual visual, or intentional heading, including attached plates/tablets, embedded labels, arrows, borders, colors, and multi-part visual content that belongs to the entry.
- [x] Confirm every crop/source region avoids clipped protected parts, mismatched neighboring items, misleading blank-only regions, and source content that contradicts the Spanish/Russian caption.
- [x] Preserve existing source-as-is constraints while correcting crops: no redraw, vectorization, cleanup, sharpening, recolor, translation inside images, generated replacement, or browser upscaling beyond natural source dimensions.
- [x] Regenerate `src/data/manual-signs/app4SignEntries.json` and any supporting validation output after crop corrections.
- [x] Add auditable evidence that covers every entry, such as per-entry crop audit data/contact sheets plus desktop and mobile screenshots for all six Appendix IV sign sections, or an equivalent proof that all entries were checked.
- [x] Update validation so the PR cannot pass with `spot-check`/`representative-only` crop evidence or unaudited crop boxes.
- [x] Re-run and record: `node scripts/manual-sign-inventory.mjs --write`, `pnpm run validate:manual-sign-inventory`, `node --test tests/manual-sign-inventory.test.mjs`, `pnpm run test`, `pnpm run build`, `git diff --check`, and full `pnpm run preflight` unless a concrete blocker is recorded.
- [x] Update this feature memory with the corrected crop count, all-section visual evidence paths, validation outcomes, and any remaining known issue for Architect disposition.

## Architect Inventory-Source Follow-Up Required Before Implementation Continues

Architect disposition recorded at `2026-06-07T12:11:45-03:00`: after horizontal follow-up commit
`820a4a0f5d5517c5483ba92e70dd017583e8fdae`, the horizontal contact sheet still shows a deeper
merge-blocking model issue. The inventory is derived from existing `termTranslations` rather
than proven actual visual entries on the source sheets, so source order and caption-to-visual
correctness are not guaranteed even when crop coordinates are refined. Example observed by
Orchestrator: page `196` row `Carril exclusivo para transporte público de pasajeros` maps to a
visual showing arrow markings, while other rows show category headings, partial material, or
mismatched visual content. PR `#202` must not proceed to further implementation completion,
final Architect validation, final Analyst validation, or merge until this inventory-source
blocker is resolved.

- [x] Rebuild or reconcile the final inventory from actual source-sheet visual items and Spanish labels/headings on pages `185-197`, in visual reading order.
- [x] Treat existing `termTranslations` only as translation seed data unless each row is reconciled to an actual visual catalog item or intentional source heading.
- [x] Add an explicit row classification such as catalog sign/sign-like item versus category heading/structural label, using repository-consistent naming.
- [x] Include category headings only when intentionally preserving source structure; do not count headings as sign/sign-like coverage unless the source sheet presents that heading as an actual catalog entry.
- [x] For every final sign/sign-like entry, prove the Spanish label and Russian translation match the clipped/displayed source visual.
- [x] Record any source-sheet item that is split, merged, excluded, converted to a heading row, or newly added compared with the old `termTranslations`-derived scaffold.
- [x] Update inventory counts by section/page after reconciliation, distinguishing sign/sign-like coverage counts from optional heading rows.
- [x] Regenerate crops/source regions only after the reconciled source inventory is established, so coordinate work follows the actual visual catalog rather than the old translation list.
- [x] Add validation/evidence that fails on unreconciled translation-derived rows, caption-to-visual mismatches, heading rows counted as sign coverage, or rows whose source visual contradicts the Spanish/Russian caption.
- [x] Add all-section contact sheets or equivalent per-entry evidence that shows every final row's source visual together with Spanish and Russian captions for audit.
- [x] Re-run and record the same validation/build/test/preflight commands listed in the crop follow-up after inventory reconciliation and crop correction are complete.

## Horizontal Follow-Up Slice 2026-06-07

- [x] Correct horizontal-marking pages `195-196` only by replacing equal-grid crop fallback for `app4-horizontal-page-195-source-card` and `app4-horizontal-page-196-source-card` with explicit per-term regions in `manualCropRegionsByCard`.
- [x] Regenerate `src/data/manual-signs/app4SignEntries.json` with `node scripts/manual-sign-inventory.mjs --write`; command passed with `244` entries, pages `185-197`, and p198-p200 disposition recorded.
- [x] Capture horizontal-only contact-sheet evidence after corrected regions:
  - `specs/036-manual-sign-pages/evidence/contact-sheets/manual-signs-horizontal-195-196-contact-sheet.png`
  - `specs/036-manual-sign-pages/evidence/contact-sheets/manual-signs-horizontal-195-196-contact-sheet.summary.json`
- [x] Verify the horizontal contact sheet with a bounded Playwright screenshot run against local Vite on `http://127.0.0.1:5175/#manual-section-app4-signs-horizontal`; summary recorded `29` entries, source pages `[195, 196]`, `0` no-upscale violations, `0` unloaded images, `0` empty captions, monotonic order `true`, and document horizontal overflow `0`.
- [x] Run bounded checks for this narrow slice:
  - `pnpm run validate:manual-sign-inventory` passed.
  - `node --test tests/manual-sign-inventory.test.mjs` passed: `2/2` tests.
  - `git diff --check` passed with no whitespace errors.
  - Optional `pnpm run test` passed: `435/435` tests.
- [x] Historical note: broader Architect follow-up remained open after this horizontal-only slice, but the later final evidence/preflight slice completed all-section source-visual reconciliation and validation for the final `316` rows.

## Regulatory/Warning Visual Inventory Slice 2026-06-07

- [x] Add the explicit visual inventory model in `scripts/manual-sign-inventory.mjs` as `visualSourceEntries` with `sectionId`, `sourcePage`, `sourceCardId`, `entryKind`, `spanishLabel`, optional `variant`, `russianTranslation`, `cropRegion`, `sourceSheetLabelEvidence`, and `auditStatus: "reconciled-source-visual"`.
- [x] Switch regulatory generation from Anexo panel cards to the CABA source sheet cards `app4-regulatory-page-185-source-card` and `app4-regulatory-page-186-source-card` for the explicit visual rows.
- [x] Generate regulatory and warning rows from `visualSourceEntries` instead of `termTranslations` for this narrow slice. Scope is intentionally partial: `20` reconciled source-visual rows total, covering regulatory examples on pages `185-186` and required warning variants on pages `187-188`, not every visual sign on those pages.
- [x] Keep all non-regulatory/warning sections on the old scaffold path, but mark each remaining row with `entryKind: "catalog-entry"`, `sourceSheetLabelEvidence: "pending visual-source reconciliation"`, and `auditStatus: "pending-reconciliation"`.
- [x] Regenerate `src/data/manual-signs/app4SignEntries.json`; at the end of this partial regulatory/warning slice, the mixed inventory summary was `169` entries: `20` `reconciled-source-visual` rows and `149` `pending-reconciliation` rows.
- [x] Update `tests/manual-sign-inventory.test.mjs` to require `entryKind`, `auditStatus`, and `sourceSheetLabelEvidence`, forbid pending regulatory/warning rows, assert required real variants (`CURVA (En "S")`, `PENDIENTE (Ascendente)`, `ESTRECHAMIENTO (En una sola mano)`, `CRUZ DE SAN ANDRÉS (Más de dos vías)`, and `PROXIMIDAD DE SEÑAL RESTRICTIVA` variants `Pare`/`Paso`/`Otra`), and assert pending non-regulatory/warning rows remain visible.
- [x] Update the manual sign caption renderer so entries with a `variant` show it in the Spanish text caption and image alt text.
- [x] Run bounded validation for this slice:
  - `node scripts/manual-sign-inventory.mjs --write` passed: `169` entries, pages `185-197`, p198-p200 disposition recorded.
  - `pnpm run validate:manual-sign-inventory` passed.
  - `node --test tests/manual-sign-inventory.test.mjs` passed: `4/4` tests.
  - `git diff --check` passed with no whitespace errors.
  - Additional quick check `pnpm run build` passed and generated a service worker with `1870` cached assets.
- [x] Historical note: PR `#202` remained not merge-ready after this partial slice because it did not complete full regulatory/warning coverage, reconcile informational/temporary/horizontal/traffic-light sections, or eliminate all `pending-reconciliation` rows. Later slices completed those implementation items.

## Regulatory Page 185 Completion Slice 2026-06-07

- [x] Replace the existing partial regulatory page `185` rows in `scripts/manual-sign-inventory.mjs` with the complete visual-source row list for `app4-regulatory-page-185-source-card`: `2` category headings and `27` catalog entries, all with `sectionId: "app4-signs-regulatory"`, `sourcePage: 185`, `auditStatus: "reconciled-source-visual"`, source label/heading evidence, and the requested exact `cropRegion` values.
- [x] Regenerate `src/data/manual-signs/app4SignEntries.json` with `node scripts/manual-sign-inventory.mjs --write`; command passed with `192` entries, pages `185-197`, and p198-p200 disposition recorded.
- [x] Update focused inventory tests so page `185` must keep the complete ordered row set, exact crop regions, heading/catalog-entry split, Russian captions, source evidence strings, reconciled audit status, and source-card references.
- [x] Run requested focused validation for this slice:
  - `pnpm run validate:manual-sign-inventory` passed: `192` entries, pages `185-197`, p198-p200 disposition recorded.
  - `node --test tests/manual-sign-inventory.test.mjs` passed: `5/5` tests.
- [x] Run final whitespace check after this `tasks.md` update: `git diff --check` passed with no whitespace errors.
- [x] Historical note: PR `#202` remained not merge-ready after this tiny slice. Page `185` was complete at that point, while page `186`, warning pages beyond the current selected rows, and informational/temporary/horizontal/traffic-light sections still needed their remaining visual-source reconciliation work.

## Regulatory Page 186 Completion Slice 2026-06-07

- [x] Replace the partial regulatory page `186` rows in `scripts/manual-sign-inventory.mjs` with the complete visual-source row list for `app4-regulatory-page-186-source-card`: `3` category headings and `28` catalog entries, all with `sectionId: "app4-signs-regulatory"`, `sourcePage: 186`, `auditStatus: "reconciled-source-visual"`, source label/heading evidence, and the requested exact `cropRegion` values.
- [x] Regenerate `src/data/manual-signs/app4SignEntries.json` with `node scripts/manual-sign-inventory.mjs --write`; command passed with `218` entries, pages `185-197`, and p198-p200 disposition recorded.
- [x] Update focused inventory tests so page `186` must keep the complete ordered row set, exact crop regions, heading/catalog-entry split, Russian captions, source evidence strings, reconciled audit status, and source-card references.
- [x] Record that regulatory pages `185-186` are now complete in the explicit visual-source inventory: `60` regulatory rows total, with `29` rows on page `185` and `31` rows on page `186`.
- [x] Run requested focused validation for this slice:
  - `pnpm run validate:manual-sign-inventory` passed: `218` entries, pages `185-197`, p198-p200 disposition recorded.
  - `node --test tests/manual-sign-inventory.test.mjs` passed: `6/6` tests.
  - `git diff --check` passed with no whitespace errors.
- [x] Historical note: PR `#202` remained not merge-ready after this tiny slice. Regulatory pages `185-186` were complete, but warning pages beyond the current selected rows and informational/temporary/horizontal/traffic-light sections still needed their remaining visual-source reconciliation work before final validation or merge.

## Warning Page 187 Completion Slice 2026-06-07

- [x] Replace the partial warning page `187` rows in `scripts/manual-sign-inventory.mjs` with the complete visual-source row list for `app4-warning-page-187-source-card`: `2` category headings and `27` catalog entries, all with `sectionId: "app4-signs-warning"`, `sourcePage: 187`, `auditStatus: "reconciled-source-visual"`, source label/heading evidence, and the requested exact `cropRegion` values.
- [x] Regenerate `src/data/manual-signs/app4SignEntries.json` with `node scripts/manual-sign-inventory.mjs --write`; command passed with `243` entries, pages `185-197`, and p198-p200 disposition recorded.
- [x] Update focused inventory tests so page `187` must keep the complete ordered row set, exact crop regions, heading/catalog-entry split, Russian captions, source evidence strings, reconciled audit status, and source-card references.
- [x] Record that warning page `187` is now complete in the explicit visual-source inventory: `29` warning page-187 rows total, with `2` category headings and `27` catalog entries.
- [x] Run requested focused validation for this slice:
  - `pnpm run validate:manual-sign-inventory` passed: `243` entries, pages `185-197`, p198-p200 disposition recorded.
  - `node --test tests/manual-sign-inventory.test.mjs` passed: `7/7` tests.
- [x] Historical note: PR `#202` remained not merge-ready after this tiny slice. Regulatory pages `185-186` and warning page `187` were complete, but warning page `188` and informational/temporary/horizontal/traffic-light sections still needed their remaining visual-source reconciliation work before final validation or merge.

## Warning Page 188 Completion Slice 2026-06-07

- [x] Replace the partial warning page `188` rows in `scripts/manual-sign-inventory.mjs` with the complete visual-source row list for `app4-warning-page-188-source-card`: `4` category headings and `26` catalog entries, all with `sectionId: "app4-signs-warning"`, `sourcePage: 188`, `auditStatus: "reconciled-source-visual"`, source label/heading evidence, and the requested exact `cropRegion` values.
- [x] Regenerate `src/data/manual-signs/app4SignEntries.json` with `node scripts/manual-sign-inventory.mjs --write`; command passed with `268` entries, pages `185-197`, and p198-p200 disposition recorded.
- [x] Update focused inventory tests so page `188` must keep the complete ordered row set, exact crop regions, heading/catalog-entry split, Russian captions, source evidence strings, reconciled audit status, and source-card references.
- [x] Record that warning pages `187-188` are now complete in the explicit visual-source inventory: `59` warning rows total, with `29` rows on complete page `187` and `30` rows on complete page `188`.
- [x] Run requested focused validation for this slice:
  - `pnpm run validate:manual-sign-inventory` passed: `268` entries, pages `185-197`, p198-p200 disposition recorded.
  - `node --test tests/manual-sign-inventory.test.mjs` passed: `8/8` tests.
  - `git diff --check` passed with no whitespace errors.
- [x] Historical note: PR `#202` remained not merge-ready after this tiny slice. Regulatory pages `185-186` and warning pages `187-188` were complete, while informational/temporary/horizontal/traffic-light sections still needed their remaining visual-source reconciliation work before final validation or merge. Later slices completed those implementation items.

## Required Evidence To Fill During Implementation

Inventory summary:

- Total current mixed inventory entries: `268`
- Reconciled source-visual rows: `119`
- Pending reconciliation rows: `149`
- Regulatory, pages `185-186`: `60` reconciled rows (`29` on complete page `185`, `31` on complete page `186`)
- Warning, pages `187-188`: `59` reconciled rows (`29` on complete page `187`, `30` on complete page `188`)
- Informational, pages `189-192`: `62`
- Temporary, pages `193-194`: `44`
- Horizontal markings, pages `195-196`: `29`
- Traffic lights/signals, page `197`: `14`
- Source-page counts: p185 `29`, p186 `31`, p187 `29`, p188 `30`, p189 `15`, p190 `18`, p191 `24`, p192 `5`, p193 `21`, p194 `23`, p195 `15`, p196 `14`, p197 `14`.
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
- Regulatory page `185` completion validation on 2026-06-07:
  - `node scripts/manual-sign-inventory.mjs --write` passed: `192` entries, pages `185-197`, p198-p200 disposition recorded.
  - `pnpm run validate:manual-sign-inventory` passed: `192` entries, pages `185-197`, p198-p200 disposition recorded.
  - `node --test tests/manual-sign-inventory.test.mjs` passed: `5/5` tests.
  - `git diff --check` passed with no whitespace errors.
- Regulatory page `186` completion validation on 2026-06-07:
  - `node scripts/manual-sign-inventory.mjs --write` passed: `218` entries, pages `185-197`, p198-p200 disposition recorded.
  - `pnpm run validate:manual-sign-inventory` passed: `218` entries, pages `185-197`, p198-p200 disposition recorded.
  - `node --test tests/manual-sign-inventory.test.mjs` passed: `6/6` tests.
  - `git diff --check` passed with no whitespace errors.
- Warning page `187` completion validation on 2026-06-07:
  - `node scripts/manual-sign-inventory.mjs --write` passed: `243` entries, pages `185-197`, p198-p200 disposition recorded.
  - `pnpm run validate:manual-sign-inventory` passed: `243` entries, pages `185-197`, p198-p200 disposition recorded.
  - `node --test tests/manual-sign-inventory.test.mjs` passed: `7/7` tests.
- Warning page `188` completion validation on 2026-06-07:
  - `node scripts/manual-sign-inventory.mjs --write` passed: `268` entries, pages `185-197`, p198-p200 disposition recorded.
  - `pnpm run validate:manual-sign-inventory` passed: `268` entries, pages `185-197`, p198-p200 disposition recorded.
  - `node --test tests/manual-sign-inventory.test.mjs` passed: `8/8` tests.
  - `git diff --check` passed with no whitespace errors.
- Informational page `189` completion validation on 2026-06-07:
  - Scope completed: source page `189` only, source card `app4-informational-page-189-source-card`, section `app4-signs-informational`.
  - Added `31` explicit `visualSourceEntries` in source order: `2` `category-heading` rows and `29` `catalog-entry` rows.
  - Page `189` now has `31` `reconciled-source-visual` rows and `0` `pending-reconciliation` rows; old grid/pending placeholders for page `189` are replaced by the explicit visual rows.
  - No cropped image files were created and no source pixels were altered; each entry continues to use CSS clipping from the unchanged official source image.
  - Generated inventory summary after this slice: `284` total entries. Pending rows remaining by section: `app4-signs-informational: 47`, `app4-signs-temporary: 44`, `app4-signs-horizontal: 29`, `app4-signs-traffic-lights: 14`.
  - `node scripts/manual-sign-inventory.mjs --write` passed: `284` entries, pages `185-197`, p198-p200 disposition recorded.
  - `pnpm run validate:manual-sign-inventory` passed: `284` entries, pages `185-197`, p198-p200 disposition recorded.
  - `node --test tests/manual-sign-inventory.test.mjs` passed: `9/9` tests, including exact page `189` order, labels, variants, Russian translations, crop regions, and no pending page `189` rows.
  - `git diff --check` passed with no whitespace errors.
  - Known issues: broader source-visual reconciliation remains open for informational pages `190-192`, temporary pages `193-194`, horizontal pages `195-196`, and traffic-light/signal page `197` as recorded in Architect follow-up tasks; this slice intentionally completed page `189` only.
- Informational page `190` completion validation on 2026-06-07:
  - Scope completed: source page `190` only, source card `app4-informational-page-190-source-card`, section `app4-signs-informational`.
  - Added `27` explicit `visualSourceEntries` in source order: `1` `category-heading` row and `26` `catalog-entry` rows.
  - Page `190` now has `27` `reconciled-source-visual` rows and `0` `pending-reconciliation` rows; old grid/pending placeholders for page `190` are replaced by the explicit visual rows.
  - No cropped image files were created and no source pixels were altered; each entry continues to use CSS clipping from the unchanged official source image.
  - Generated inventory summary after this slice: `293` total entries. Pending rows remaining by section: `app4-signs-informational: 29`, `app4-signs-temporary: 44`, `app4-signs-horizontal: 29`, `app4-signs-traffic-lights: 14`.
  - `node scripts/manual-sign-inventory.mjs --write` passed: `293` entries, pages `185-197`, p198-p200 disposition recorded.
  - `pnpm run validate:manual-sign-inventory` passed: `293` entries, pages `185-197`, p198-p200 disposition recorded.
  - `node --test tests/manual-sign-inventory.test.mjs` passed: `10/10` tests, including exact page `190` order, labels, variants, Russian translations, crop regions, and no pending page `190` rows.
  - `git diff --check` passed with no whitespace errors.
  - Known issues: broader source-visual reconciliation remains open for informational pages `191-192`, temporary pages `193-194`, horizontal pages `195-196`, and traffic-light/signal page `197` as recorded in Architect follow-up tasks; this slice intentionally completed page `190` only.
- Informational pages `191-192` completion validation on 2026-06-07:
  - Scope completed: source pages `191-192`, source cards `app4-informational-page-191-source-card` and `app4-informational-page-192-source-card`, section `app4-signs-informational`.
  - Added `36` explicit source page `191` `visualSourceEntries` in source order: `2` `category-heading` rows and `34` `catalog-entry` rows.
  - Added `1` explicit source page `192` `visualSourceEntry` with `entryKind: contextual-visual` for the Estrella Amarilla photo. It renders as an individually clipped source visual but is recorded separately from sign/catalog coverage counts.
  - Pages `191-192` now have `37` `reconciled-source-visual` rows and `0` `pending-reconciliation` rows; old grid/pending placeholders for pages `191-192` are replaced by explicit visual rows.
  - Informational section status after this slice: `0` pending rows remain.
  - No cropped image files were created and no source pixels were altered; each entry continues to use CSS clipping from unchanged official source images.
  - Generated inventory summary after this slice: `301` total entries. Pending rows remaining by section: `app4-signs-temporary: 44`, `app4-signs-horizontal: 29`, `app4-signs-traffic-lights: 14`.
  - `node scripts/manual-sign-inventory.mjs --write` passed: `301` entries, pages `185-197`, p198-p200 disposition recorded.
  - `pnpm run validate:manual-sign-inventory` passed: `301` entries, pages `185-197`, p198-p200 disposition recorded.
  - `node --test tests/manual-sign-inventory.test.mjs` passed: `12/12` tests, including exact page `191` order, labels, variants, Russian translations, crop regions, page `192` contextual visual metadata, and no pending page `191-192` rows.
  - `git diff --check` passed with no whitespace errors.
  - Known issues: broader source-visual reconciliation remains open for temporary pages `193-194`, horizontal pages `195-196`, and traffic-light/signal page `197` as recorded in Architect follow-up tasks; this slice intentionally completed informational pages `191-192` only.
- Temporary page `193` completion validation on 2026-06-07:
  - Scope completed: source page `193` only, source card `app4-temporary-page-193-source-card`, section `app4-signs-temporary`.
  - Added `27` explicit `visualSourceEntries` in source order: `3` `category-heading` rows and `24` `catalog-entry` rows.
  - Page `193` now has `27` `reconciled-source-visual` rows and `0` `pending-reconciliation` rows; old grid/pending placeholders for page `193` are replaced by the explicit visual rows.
  - No cropped image files were created and no source pixels were altered; each entry continues to use CSS clipping from the unchanged official source image.
  - Generated inventory summary after this slice: `307` total entries. Pending rows remaining by section: `app4-signs-temporary: 23`, `app4-signs-horizontal: 29`, `app4-signs-traffic-lights: 14`.
  - `node scripts/manual-sign-inventory.mjs --write` passed: `307` entries, pages `185-197`, p198-p200 disposition recorded.
  - `pnpm run validate:manual-sign-inventory` passed: `307` entries, pages `185-197`, p198-p200 disposition recorded.
  - `node --test tests/manual-sign-inventory.test.mjs` passed: `13/13` tests, including exact page `193` order, labels, variants, Russian translations, crop regions, and no pending page `193` rows.
  - `git diff --check` passed with no whitespace errors.
  - Known issues: broader source-visual reconciliation remains open for temporary page `194`, horizontal pages `195-196`, and traffic-light/signal page `197` as recorded in Architect follow-up tasks; this slice intentionally completed temporary page `193` only.
- Temporary page `194` completion validation on 2026-06-07:
  - Scope completed: source page `194` only, source card `app4-temporary-page-194-source-card`, section `app4-signs-temporary`.
  - Added `29` explicit `visualSourceEntries` in source order: `3` `category-heading` rows and `26` `catalog-entry` rows.
  - Page `194` now has `29` `reconciled-source-visual` rows and `0` `pending-reconciliation` rows; old grid/pending placeholders for page `194` are replaced by the explicit visual rows.
  - Temporary section status after this slice: `0` pending rows remain.
  - No cropped image files were created and no source pixels were altered; each entry continues to use CSS clipping from the unchanged official source image.
  - Generated inventory summary after this slice: `313` total entries. Pending rows remaining by section: `app4-signs-horizontal: 29`, `app4-signs-traffic-lights: 14`.
  - `node scripts/manual-sign-inventory.mjs --write` passed: `313` entries, pages `185-197`, p198-p200 disposition recorded.
  - `pnpm run validate:manual-sign-inventory` passed: `313` entries, pages `185-197`, p198-p200 disposition recorded.
  - `node --test tests/manual-sign-inventory.test.mjs` passed: `14/14` tests, including exact page `194` order, labels, variants, Russian translations, crop regions, and no pending page `194` rows.
  - `git diff --check` passed with no whitespace errors.
  - Known issues: broader source-visual reconciliation remains open for horizontal pages `195-196` and traffic-light/signal page `197` as recorded in Architect follow-up tasks; this slice intentionally completed temporary page `194` only.
- Horizontal-marking page `195` completion validation on 2026-06-07:
  - Scope completed: source page `195` only, source card `app4-horizontal-page-195-source-card`, section `app4-signs-horizontal`.
  - Added `17` explicit `visualSourceEntries` in source order: `3` `category-heading` rows and `14` `catalog-entry` rows.
  - Page `195` now has `17` `reconciled-source-visual` rows and `0` `pending-reconciliation` rows; old grid/pending placeholders for page `195` are replaced by the explicit visual rows.
  - No cropped image files were created and no source pixels were altered; each entry continues to use CSS clipping from the unchanged official source image.
  - Generated inventory summary after this slice: `315` total entries. Pending rows remaining by section: `app4-signs-horizontal: 14`, `app4-signs-traffic-lights: 14`.
  - `node scripts/manual-sign-inventory.mjs --write` passed: `315` entries, pages `185-197`, p198-p200 disposition recorded.
  - `pnpm run validate:manual-sign-inventory` passed: `315` entries, pages `185-197`, p198-p200 disposition recorded.
  - `node --test tests/manual-sign-inventory.test.mjs` passed: `15/15` tests, including exact page `195` order, labels, variants, Russian translations, crop regions, and no pending page `195` rows.
  - `git diff --check` passed with no whitespace errors.
  - Known issues: broader source-visual reconciliation remains open for horizontal page `196` and traffic-light/signal page `197` as recorded in Architect follow-up tasks; this slice intentionally completed horizontal-marking page `195` only.
- Horizontal-marking page `196` completion validation on 2026-06-07:
  - Scope completed: source page `196` only, source card `app4-horizontal-page-196-source-card`, section `app4-signs-horizontal`.
  - Added `16` explicit `visualSourceEntries` in source order: `1` `category-heading` row and `15` `catalog-entry` rows.
  - Page `196` now has `16` `reconciled-source-visual` rows and `0` `pending-reconciliation` rows; old grid/pending placeholders for page `196` are replaced by the explicit visual rows.
  - Horizontal section status after this slice: `0` pending rows remain.
  - No cropped image files were created and no source pixels were altered; each entry continues to use CSS clipping from the unchanged official source image.
  - Generated inventory summary after this slice: `317` total entries. Pending rows remaining by section: `app4-signs-traffic-lights: 14`.
  - `node scripts/manual-sign-inventory.mjs --write` passed: `317` entries, pages `185-197`, p198-p200 disposition recorded.
  - `pnpm run validate:manual-sign-inventory` passed: `317` entries, pages `185-197`, p198-p200 disposition recorded.
  - `node --test tests/manual-sign-inventory.test.mjs` passed: `16/16` tests, including exact page `196` order, labels, variants, Russian translations, crop regions, and no pending page `196` rows.
  - `git diff --check` passed with no whitespace errors.
  - Known issues: broader source-visual reconciliation remains open for traffic-light/signal page `197` as recorded in Architect follow-up tasks; this slice intentionally completed horizontal-marking page `196` only.
- Traffic-light/signal page `197` completion validation on 2026-06-07:
  - Scope completed: source page `197` only, source card `app4-traffic-lights-page-197-source-card`, section `app4-signs-traffic-lights`.
  - Added `13` explicit `visualSourceEntries` in source order: `4` `category-heading` rows, `7` `catalog-entry` rows, and `2` `contextual-visual` rows for the vertical and horizontal optical-unit layouts.
  - Page `197` now has `13` `reconciled-source-visual` rows and `0` `pending-reconciliation` rows; old grid/pending placeholders for page `197` are replaced by the explicit visual rows.
  - All sections status after this slice: `0` pending rows remain.
  - No cropped image files were created and no source pixels were altered; each entry continues to use CSS clipping from the unchanged official source image.
  - Generated inventory summary after this slice: `316` total entries. Pending rows remaining by section: none.
  - `node scripts/manual-sign-inventory.mjs --write` passed: `316` entries, pages `185-197`, p198-p200 disposition recorded.
  - `pnpm run validate:manual-sign-inventory` passed: `316` entries, pages `185-197`, p198-p200 disposition recorded.
  - `node --test tests/manual-sign-inventory.test.mjs` passed: `17/17` tests, including exact page `197` order, labels, variants, Russian translations, crop regions, contextual visual metadata, and no pending page `197` rows.
  - `git diff --check` passed with no whitespace errors.
  - Known issues: source-visual reconciliation rows are complete for pages `185-197`; broader review, final validation, and merge readiness remain with Review/Architect/Analyst/Orchestrator gates.
- Final implementation evidence/preflight slice on 2026-06-07:
  - Final catalog inventory remains `316` total rows across source pages `185-197`, with `0` `pending-reconciliation` rows and p198-p200 disposition preserved.
  - Final row counts by section: `app4-signs-regulatory: 60`, `app4-signs-warning: 59`, `app4-signs-informational: 95`, `app4-signs-temporary: 56`, `app4-signs-horizontal: 33`, `app4-signs-traffic-lights: 13`.
  - Final row counts by source page: `185: 29`, `186: 31`, `187: 29`, `188: 30`, `189: 31`, `190: 27`, `191: 36`, `192: 1`, `193: 27`, `194: 29`, `195: 17`, `196: 16`, `197: 13`.
  - Final entry-kind counts: `category-heading: 30`, `catalog-entry: 283`, `contextual-visual: 3`.
  - Final evidence summary: `specs/036-manual-sign-pages/evidence/contact-sheets/final-catalog/manual-signs-final-catalog-evidence.summary.json`.
  - Final all-section contact sheets:
    - `specs/036-manual-sign-pages/evidence/contact-sheets/final-catalog/manual-signs-final-regulatory-contact-sheet.png`
    - `specs/036-manual-sign-pages/evidence/contact-sheets/final-catalog/manual-signs-final-warning-contact-sheet.png`
    - `specs/036-manual-sign-pages/evidence/contact-sheets/final-catalog/manual-signs-final-informational-contact-sheet.png`
    - `specs/036-manual-sign-pages/evidence/contact-sheets/final-catalog/manual-signs-final-temporary-contact-sheet.png`
    - `specs/036-manual-sign-pages/evidence/contact-sheets/final-catalog/manual-signs-final-horizontal-contact-sheet.png`
    - `specs/036-manual-sign-pages/evidence/contact-sheets/final-catalog/manual-signs-final-traffic-lights-contact-sheet.png`
  - Evidence summary records `0` pending rows, `0` unloaded contact-sheet images, `0` no-upscale/render-mode violations, `316` `source-image-css-clip` rows, `316` `noUpscale: true` rows, original source-asset SHA-256 hashes, and p198-p200 disposition.
  - Tests now assert final `316` total rows, exact section/page counts, zero pending rows, pages `185-197`, p198-p200 disposition, and committed final evidence/contact-sheet coverage.
  - No cropped image files were created for app rendering and no source pixels were altered; contact-sheet PNGs are committed evidence artifacts only. The app inventory continues to clip from unchanged original source assets.
  - `node scripts/manual-sign-inventory.mjs --write` passed: `316` entries, pages `185-197`, p198-p200 disposition recorded.
  - `pnpm run validate:manual-sign-inventory` passed: `316` entries, pages `185-197`, p198-p200 disposition recorded.
  - `node --test tests/manual-sign-inventory.test.mjs` passed: `18/18` tests.
  - `pnpm run test` passed: `451/451` tests.
  - `pnpm run build` passed. Vite emitted the existing large-chunk warning, but build and service worker generation completed successfully.
  - `pnpm run preflight` passed: feature-memory gate, repo baseline, content validation, `451/451` Node tests, build, and `82/82` Playwright e2e tests.
  - `git diff --check` passed with no whitespace errors.
  - Known implementation issues after this slice: none for manual sign inventory evidence/preflight. Final Review/Architect/Analyst validation and merge-readiness gates remain outside this Implementation Agent slice.

Screenshot evidence:

- Desktop dense section: `specs/036-manual-sign-pages/evidence/screenshots/manual-signs-regulatory-dense-desktop.png`
- Desktop representative section: `specs/036-manual-sign-pages/evidence/screenshots/manual-signs-horizontal-markings-representative-desktop.png`
- Mobile dense section: `specs/036-manual-sign-pages/evidence/screenshots/manual-signs-regulatory-dense-mobile.png`
- Mobile representative section: `specs/036-manual-sign-pages/evidence/screenshots/manual-signs-horizontal-markings-representative-mobile.png`
- Visual QA summary: `specs/036-manual-sign-pages/evidence/screenshots/visual-qa-summary.json`
- Screenshot command: local dev server on `http://localhost:5174`, then a bounded Playwright script imported `chromium` from `@playwright/test`, navigated by section hash, scrolled images into view for lazy-loading, captured the two catalog sections at desktop `1440x1100` and mobile `390x1100`, and wrote the summary JSON. The summary recorded `0` no-upscale violations, `0` unloaded images, `0` render-mode/source-flag violations, `0` caption gaps, monotonic order `true`, and document horizontal overflow `0` for all four captures.

Known issues and dead ends:

- Architect disposition 2026-06-07 after commit `820a4a0f5d5517c5483ba92e70dd017583e8fdae`: coordinate refinement alone is insufficient. The current row set must be reconciled from source-sheet visual items/headings, not accepted as a `termTranslations`-derived inventory. Caption-to-visual correctness for every final entry is now an explicit merge gate.
- Architect disposition 2026-06-07: the current screenshot evidence confirms only regulatory and horizontal-marking sections, while the known issue records that warning/traffic-light exploratory screenshots exposed partial neighboring content or excess whitespace. This violates the user requirement that every sign/sign-like entry be processed separately without cutting protected parts or mixing in wrong neighboring content. PR `#202` must return to Implementation for the follow-up tasks above before review completion, final Architect validation, final Analyst validation, or merge.
- 2026-06-07T00:00:00-03:00: Slice 1 started; inventory scaffold in progress.
- Slice 2 changed inventory status from `source-sheet-placeholder` to `individual-source-regions`: it governs order, captions, source references, source asset dimensions, hashes, no-upscale flags, render mode, per-entry CSS clip regions, and p198-p200 disposition.
- Slice 2 added `src/data/manual-signs/app4SignCatalog.ts`, a `manual-sign-catalog` manual-guide block, section inserts for all six Appendix IV sign sections, React rendering in `App.tsx`, and responsive CSS for CSS-clipped source-region cards. The primary learner view now renders entries from `app4SignEntries.json`; existing whole-sheet/panel cards remain after the individual catalog as supplemental context.
- Deterministic grid cells are intentionally coarse for this reduced slice. They create individual source regions smaller than the source asset and preserve original asset bytes; final visual QA covered regulatory dense and horizontal-marking representative sections on desktop and mobile, but did not manually audit every one of the `244` crop boxes. Residual risk: some warning, informational, temporary, traffic-light, or non-screenshoted entries may still need coordinate fine-tuning if later review requires a strict per-entry visual audit.
- During final screenshot work, warning/traffic-light exploratory screenshots exposed that some coarse grid regions can show partial neighboring content or excess whitespace. Those exploratory screenshots were removed from committed evidence; the residual risk is recorded here for Architect disposition rather than claimed as fully resolved.
- Visual QA evidence is screenshot/spot-check based, not a full manual audit of all `244` individual crop boxes. The committed screenshot evidence covers one dense section (`app4-signs-regulatory`) and one representative horizontal-marking section (`app4-signs-horizontal`) on desktop and mobile.
- Current source-quality limitation: Appendix IV page-sheet crops are source-limited official rasters. This is not a blocker because the spec allows documented official-source extraction and no-upscale caps; Implementation will record per-entry source refs, natural dimensions, SHA-256 hashes, and preservation notes. Browser upscaling, sharpening, vectorization, or generated replacements remain forbidden and will not be used.

Implementation feedback for Architect disposition:

- PR `#202` residual crop QA issue disposed by Architect as required follow-up work before merge. It is not accepted as a non-blocking known issue, and final Architect validation is intentionally deferred.
- PR `#202` inventory-source issue disposed by Architect as required follow-up work before implementation continues toward completion or merge. `termTranslations`-derived inventory is not accepted as final source of truth without row-by-row reconciliation to actual source-sheet visual items/headings and caption-to-visual evidence.

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
- the Architect follow-up tasks above are complete, or any remaining crop/evidence risk has an explicit non-blocking Architect disposition based on objective full-entry evidence;
- the inventory-source follow-up is complete, with caption-to-visual evidence for every final sign/sign-like row and heading rows excluded from sign coverage unless explicitly justified;
- the effective content head is identified for final Analyst validation.

Analyst final validation, when invoked after Architect final validation passes, must verify the final result against the user's original request: every sign processed separately, maximum practical quality, original source order, Spanish/Russian captions, all signs covered, and no modification of protected sign imagery.

## Decisions

- Architect disposition: final inventory accepts `283` catalog-entry rows, `30` category-heading rows, and `3` contextual-visual rows as the reconciled source-visual model for Appendix IV pages `185-197`.
- Architect disposition: category-heading and contextual-visual rows are typed separately and excluded from sign-like catalog coverage expectations where appropriate.
- Architect disposition: Review Agent finding on `ManualSignEntry.entryKind` was valid; product/type fix commit `100799eaa66448f5a7b287c00577b5d60c7f1a84` adds `contextual-visual` to the exported `ManualSignEntry.entryKind` union in `src/data/manual-signs/app4SignCatalog.ts`.
- Architect disposition: Review Agent classified `13` stale review threads as outdated/superseded and `3` duplicate contextual-visual type threads as fixed by `100799eaa66448f5a7b287c00577b5d60c7f1a84`.
- Review-fix implementation decision at 2026-06-07T15:30:24-03:00 for review thread `PRRT_kwDOSX65IM6HrbRG`: explicit visual-source inventory rows remain hard-coded in `scripts/manual-sign-inventory.mjs`; generated `sourceRef` values now point to `scripts/manual-sign-inventory.mjs#visualSourceEntries[index](source-card-id)` instead of dead `src/data/manual-sections/*.ts#*.visualSourceEntries[index]` targets.

## Dead Ends

- Architect disposition: deterministic grid crop and term-translation-derived inventory paths are superseded/resolved by row-by-row source-sheet visual reconciliation.
- Architect disposition: pre-fix final validation notes for earlier heads are stale after product/type fix commit `100799eaa66448f5a7b287c00577b5d60c7f1a84` and are intentionally omitted from this foundation memory so later final validation can run on the new effective content head.
- Previous final Architect/Analyst validation evidence for effective content head `e5041ad79eb7034e01374b65ac3ceebf44f775da` is stale after the sourceRef review-fix content changes to `scripts/manual-sign-inventory.mjs`, `src/data/manual-signs/app4SignEntries.json`, and `tests/manual-sign-inventory.test.mjs`; final validation is ready to rerun after this review-fix PR head is committed and pushed.

## Known Issues

- Architect disposition: superseded/resolved historical crop QA and inventory-source blockers by the final `316`-row reconciled source-visual inventory, all-section contact-sheet evidence, stricter validation/tests, and final preflight evidence.
- No known issues.

## Verification Evidence

- Verification evidence passed: `316` entries across source pages `185-197`, p198-p200 disposition recorded, `316` reconciled-source-visual rows, `0` pending rows, final counts `283` catalog-entry rows, `30` category-heading rows, and `3` contextual-visual rows.
- Verification evidence passed: final section counts regulatory `60`, warning `59`, informational `95`, temporary `56`, horizontal `33`, and traffic-lights/signals `13`.
- Verification evidence passed: final page counts p185 `29`, p186 `31`, p187 `29`, p188 `30`, p189 `31`, p190 `27`, p191 `36`, p192 `1`, p193 `27`, p194 `29`, p195 `17`, p196 `16`, p197 `13`.
- Verification evidence passed: final all-section contact-sheet evidence and summary exist under `specs/036-manual-sign-pages/evidence/contact-sheets/final-catalog/`.
- Verification evidence passed for final implementation evidence/preflight slice: `node scripts/manual-sign-inventory.mjs --write`, `pnpm run validate:manual-sign-inventory`, `node --test tests/manual-sign-inventory.test.mjs`, `pnpm run test`, `pnpm run build`, `pnpm run preflight`, and `git diff --check`.
- Type-fix verification for commit `100799eaa66448f5a7b287c00577b5d60c7f1a84`: `pnpm run validate:manual-sign-inventory` passed.
- Type-fix verification for commit `100799eaa66448f5a7b287c00577b5d60c7f1a84`: focused Node inventory test passed with the updated `ManualSignEntry.entryKind` union accepting `contextual-visual`.
- Type-fix verification for commit `100799eaa66448f5a7b287c00577b5d60c7f1a84`: `pnpm run build` passed.
- Type-fix verification for commit `100799eaa66448f5a7b287c00577b5d60c7f1a84`: diff check passed before this process-memory foundation rewrite; `git diff --check` must also pass after this file update.
- Review sourceRef fix verification at 2026-06-07T15:30:24-03:00: `node scripts/manual-sign-inventory.mjs --write` passed with `316` entries, pages `185-197`, and p198-p200 disposition recorded.
- Review sourceRef fix verification at 2026-06-07T15:30:24-03:00: `pnpm run validate:manual-sign-inventory` passed with `316` entries, pages `185-197`, and p198-p200 disposition recorded.
- Review sourceRef fix verification at 2026-06-07T15:30:24-03:00: `node --test tests/manual-sign-inventory.test.mjs` passed `18/18` tests, including regression coverage that explicit visual rows use `scripts/manual-sign-inventory.mjs#visualSourceEntries[...]` and reject dead `src/data/manual-sections/*.ts#*.visualSourceEntries[...]` targets.
- Review sourceRef fix verification at 2026-06-07T15:30:24-03:00: `pnpm run build` passed; Vite production build completed and `scripts/generate-service-worker.mjs` generated `1870` cached assets.

## Cycle PR Set

- PR #202 branch `codex/036-manual-sign-pages` current content head `2a11be5dee6307e9df1cedad094ded5c58e6c659`; status after review fixes: contextual-visual type issue fixed, sourceRef review fix applied, stale/duplicate review threads classified, no unresolved Implementation Agent feedback recorded; included in the final-validation cycle PR set.
- Process-memory foundation commit after this `tasks.md` rewrite is expected to become the next effective content head candidate for final Architect validation and final Analyst validation.
- PR #202 sourceRef review-fix content changed `scripts/manual-sign-inventory.mjs`, `src/data/manual-signs/app4SignEntries.json`, and `tests/manual-sign-inventory.test.mjs`; previous final validation for `e5041ad79eb7034e01374b65ac3ceebf44f775da` must not be reused because generated inventory data and test contracts changed.

## Implementation Agent Feedback

- No unresolved Implementation Agent feedback.
- Disposition: resolved by review-fix commit 100799eaa66448f5a7b287c00577b5d60c7f1a84 adding contextual-visual to ManualSignEntry.entryKind.
- Disposition: sourceRef review finding resolved at content head `2a11be5dee6307e9df1cedad094ded5c58e6c659` by pointing explicit visual-source generated refs to `scripts/manual-sign-inventory.mjs#visualSourceEntries[index](source-card-id)` and adding regression coverage.

## Final Validation Evidence

- Historical effective content head `e5041ad79eb7034e01374b65ac3ceebf44f775da` has been superseded by later sourceRef content and test changes at PR #202 content head `2a11be5dee6307e9df1cedad094ded5c58e6c659`.
- Current final Architect validation is deferred and ready to rerun after this process-memory foundation commit establishes the new effective content head candidate.
- Current final Analyst validation is deferred until after the rerun final Architect validation passes for the new effective content head candidate.
- Architect return count before rerun: 2.
- Analyst feedback Architect disposition before rerun: none.
- Limit escalation before rerun: none.
- Current-PR-head read-only guard will compare the rerun-validated effective content head candidate against the current PR head before finalization.
- Effective content head: 202af0dd1e7b92a308220ac5805afac2740e25dd
- Architect validation: passed at 2026-06-07T15:48:08-03:00.
- Architect return count: 2
- Architect validated effective content head: 202af0dd1e7b92a308220ac5805afac2740e25dd.
- Analyst feedback Architect disposition: none.
- Limit escalation: none.
- Current-PR-head read-only guard: Orchestrator will compare current PR head against effective content head 202af0dd1e7b92a308220ac5805afac2740e25dd and verify later commits are final-validation evidence-only before finalization.

## Superseded Architect Validation Notes

Architect validation pass: passed
Superseded Architect validation completed at: 2026-06-07T15:17:00-03:00
Effective content head: e5041ad79eb7034e01374b65ac3ceebf44f775da
Architect validated effective content head: e5041ad79eb7034e01374b65ac3ceebf44f775da
Architect return count: 2
Architect validation evidence: complete feature memory exists at specs/036-manual-sign-pages/feature-request.md, spec.md, plan.md, and tasks.md.
Architect validation evidence: final inventory evidence covers `316` rows across source pages `185-197`, with `283` catalog-entry rows, `30` category-heading rows, `3` contextual-visual rows, `316` reconciled-source-visual rows, and `0` pending rows.
Architect validation evidence: final all-section contact-sheet evidence and summary exist under specs/036-manual-sign-pages/evidence/contact-sheets/final-catalog/.
Architect validation evidence: `pnpm run validate:manual-sign-inventory` passed with `316` entries, pages `185-197`, and p198-p200 disposition recorded.
Architect validation evidence: `node --test tests/manual-sign-inventory.test.mjs` passed `18/18` tests.
Architect validation evidence: `git diff --check` passed before Architect validation notes were written.
Architect validation evidence: PR #202 head before validation notes matched effective content head `e5041ad79eb7034e01374b65ac3ceebf44f775da`.
Architect validation evidence: no live final Analyst validation marker was present before this final Architect pass.
Architect validation evidence: PR #202 current-head Review Agent comment reports no actionable findings for `e5041ad79eb7034e01374b65ac3ceebf44f775da`.
Architect validation evidence: required checks were still running at validation time; Orchestrator must recheck current-head checks before merge.
Architect disposition: no open Architect dispositions remain.
Architect disposition: no unresolved Implementation Agent feedback remains.
Architect disposition: review fix `100799eaa66448f5a7b287c00577b5d60c7f1a84` is resolved.
Historical note: this Architect validation is retained only as superseded evidence for `e5041ad79eb7034e01374b65ac3ceebf44f775da`; it is not a live final validation marker for current PR #202 content.

## Final Architect Validation Notes

Architect validation pass: passed
Final Architect validation completed at: 2026-06-07T15:48:08-03:00
Effective content head: 202af0dd1e7b92a308220ac5805afac2740e25dd
Architect validated effective content head: 202af0dd1e7b92a308220ac5805afac2740e25dd
Architect return count: 2
Architect validation evidence: complete feature memory exists at specs/036-manual-sign-pages/feature-request.md, spec.md, plan.md, and tasks.md.
Architect validation evidence: PR #202 current head matched effective content head 202af0dd1e7b92a308220ac5805afac2740e25dd before Architect evidence edits.
Architect validation evidence: Review Agent no-findings comment for 202af0dd1e7b92a308220ac5805afac2740e25dd is recorded at https://github.com/cucumberfalse/cabadrive/pull/202#issuecomment-4643666394, and no unresolved review threads are recorded.
Architect validation evidence: final inventory evidence covers 316 rows across source pages 185-197, with 316 reconciled-source-visual rows, 0 rows awaiting reconciliation, 283 catalog-entry rows, 30 category-heading rows, and 3 contextual-visual rows.
Architect validation evidence: final inventory sourceRefs are fixed to scripts/manual-sign-inventory.mjs#visualSourceEntries, resolving the sourceRef review fix.
Architect validation evidence: pnpm run validate:manual-sign-inventory passed on effective content head 202af0dd1e7b92a308220ac5805afac2740e25dd.
Architect validation evidence: node --test tests/manual-sign-inventory.test.mjs passed 18/18 tests on effective content head 202af0dd1e7b92a308220ac5805afac2740e25dd.
Architect validation evidence: git diff --check passed on effective content head 202af0dd1e7b92a308220ac5805afac2740e25dd before Architect evidence edits.
Architect disposition: no open Architect dispositions remain.
Architect disposition: no unresolved Implementation Agent feedback remains.
Architect disposition: sourceRef review fix is resolved.
Architect disposition: final inventory/evidence/test coverage is accepted for final Architect validation.
Architect validation evidence: Orchestrator must recheck required checks and current-head guard before merge.
