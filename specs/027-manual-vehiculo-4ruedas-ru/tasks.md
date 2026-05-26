# Tasks: Complete RU Manual Surface

## Status Legend

- `[ ]` Not started
- `[~]` In progress
- `[x]` Complete

## Architect Task State

- `[x]` Create `spec.md` from Analyst intake.
- `[x]` Create `plan.md` from Analyst intake.
- `[x]` Create implementation-ready `tasks.md`.

## Implementation Tasks

### Source and Asset Foundation

- `[x]` Confirm the canonical source PDF metadata matches intake evidence: path, SHA-256, and 200-page count.
- `[x]` Add or update a manual/source-document registry entry for `gcba-manual-vehiculo-4-ruedas-2023`.
- `[x]` Implement deterministic local generation or ingestion for page-faithful visual assets for all 200 pages, or an equivalent manifest-backed preservation strategy.
- `[x]` Create a per-page visual asset manifest with page number, local path, dimensions, checksum, and source PDF metadata.
- `[x]` Ensure generated/static assets are available to the built site without runtime PDF loading or network access.

### Translation Corpus and Coverage

- `[x]` Inventory existing approved RU chunks relevant to the 4-wheel vehicle manual.
- `[x]` Implement coverage validation before any existing RU chunk is reused.
- `[x]` Map every reused RU chunk to exact source page/content ranges and record provenance.
- `[x]` Add complete exact RU translations for all source text not covered by validated existing chunks.
- `[x]` Create or update a RU manual content manifest aligned to the official source pages/content units.
- `[x]` Verify headings, captions, tables, callouts, labels, legends, footnotes, and layout-sensitive text are included.

### Frontend Surface

- `[x]` Add a dedicated complete RU manual route, block, or reader surface.
- `[x]` Connect the surface to local manifest/content loaders only.
- `[x]` Render ordered navigation across all manual pages/content units.
- `[x]` Show local visual-preservation assets in study context for each page/content unit.
- `[x]` Show exact RU content and visible Spanish official-source traceability.
- `[x]` Prevent fallback to a PDF iframe, browser PDF viewer, runtime PDF renderer, remote images, or network content fetches.
- `[x]` Add accessible loading/error states that do not mask missing content as successful completion.

### Validators and Tests

- `[x]` Add a source coverage validator proving 200/200 pages are represented and ordered.
- `[x]` Add a visual asset validator proving every required local asset exists and is referenced.
- `[x]` Add a translation coverage validator proving no mapped source unit is missing RU content.
- `[x]` Add a reused-chunk validator proving reused RU chunks have exact source coverage.
- `[x]` Add a runtime dependency validator or test that blocks PDF viewer usage and remote manual assets.
- `[x]` Add frontend tests for route access, manifest loading, and representative first/middle/last page rendering.
- `[x]` Run local preflight/build checks required by the repository and record results.

### Documentation and Evidence

- `[x]` Update `docs_project/project/frontend/frontend-docs.md` for the new complete RU manual surface.
- `[x]` Update `docs_project/project/feature-inventory.md` for the complete manual feature and constraints.
- `[x]` Update backend/content docs if new content-generation scripts, manifests, validators, or asset workflows are added.
- `[x]` Record acceptance evidence for source coverage, translation coverage, visual coverage, offline/local behavior, and UI access.
- `[x]` Record any dead ends, decisions, or known issues in this feature memory for Architect disposition.

## Acceptance Checklist

- `[x]` Dedicated complete RU manual surface exists and is reachable.
- `[x]` All 200 source pages/content units are represented.
- `[x]` RU translation is complete and exact, with no simplification or omission.
- `[x]` All source images/visual content are preserved through local page-faithful assets or a validated equivalent manifest.
- `[x]` Existing RU chunks are reused only after exact coverage validation.
- `[x]` Runtime does not depend on PDF viewer behavior or network access.
- `[x]` Spanish official source remains traceable for each page/content unit.
- `[x]` Validators, tests, and durable docs are complete.

## Implementation Decisions

- Page-faithful visual preservation is implemented with local JPEG renders under `content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/pages/`, generated from the canonical PDF using `scripts/render-manual-pdf-pages.swift`. This preserves original page layout, images, icons, tables, typography-sensitive structure, and final visual-only pages without runtime PDF loading.
- The manual manifest lives at `content/manuals/gcba-manual-vehiculo-4-ruedas-2023/manual.ru.json` and records 200 page entries with source page numbers, source PDF hash/path, local asset path, dimensions, asset SHA-256, RU translation text, and provenance.
- Existing approved primary-source manual chunks are reused only for pages 1-198 after validator checks exact text equality with the reused chunk, approved QA status, shard path, QA shard path, and source-span/source-fingerprint provenance. Pages 199-200 are visual-label pages not covered by the text-extraction chunks; they are represented by page-faithful renders plus exact RU translations of visible labels.
- The app exposes the complete manual through the top-level `Руководство 4R` surface, separate from `Источники`, with search, all-page list navigation, previous/next navigation, local rendered page image, exact RU translation, and per-page source/provenance metadata.
- The runtime manual surface imports static JSON and uses `assetUrl()` for local `/content/assets/...` images only. Validators and Playwright tests block iframe/embed/object PDF loading, PDF.js-style runtime rendering, runtime fetches, remote manual assets, and PDF requests.

## Current Evidence

- `shasum -a 256 content/official-documents/originals/gcba-manual-vehiculo-4-ruedas-2023.pdf` returned `69c6e1c582db4f96337fc13db09fffab26f9ce6364279c6beb2abc21d9ad3e8e`.
- `mdls -name kMDItemNumberOfPages content/official-documents/originals/gcba-manual-vehiculo-4-ruedas-2023.pdf` returned `200`.
- `swift scripts/render-manual-pdf-pages.swift content/official-documents/originals/gcba-manual-vehiculo-4-ruedas-2023.pdf content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/pages --scale 2 --quality 0.9` rendered `page-001.jpg` through `page-200.jpg`, each reported as `1191x1684`.
- `find content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/pages -type f | wc -l` returned `200`; `du -sh` for the page asset folder returned `31M`.
- `pnpm run validate:manual-4ruedas` passed with `Manual 4 ruedas RU validated: 200/200 pages, 200 local page assets, 198 approved reused translations, 2 visual-label translation pages.`
- `node --test tests/content-manual-vehiculo-4ruedas.test.mjs tests/content-validation.test.mjs` passed: 9 tests, 0 failures.
- `pnpm run test` passed: 281 tests, 0 failures.
- `pnpm run build` passed. It ran `validate:content`, synced `content/assets` into ignored `public/content/assets`, built with Vite, and generated a service worker with 1928 cached assets. The build emitted Vite's non-fatal large-chunk warning for the bundled local content corpus.
- `pnpm exec playwright test tests/e2e/app.spec.ts -g "complete RU manual"` passed: 2 tests across `chromium` and `mobile`, 0 failures.
- `pnpm run test:e2e` passed: 52 tests across `chromium` and `mobile`, 0 failures. The manual e2e verified the `Руководство 4R` surface, first/middle/last page rendering, local JPEG dimensions, exact RU translation samples, no iframe/embed/object PDF viewer, no `.pdf` links in the manual reader, no external requests, no PDF requests, and no backend/live-AI requests.
- `pnpm run preflight` passed. It included `check-feature-memory --worktree`, `check:repo`, `validate:content`, 281 Node tests, build/service-worker generation, and 52 Playwright tests across `chromium` and `mobile`.

## Review Fix Evidence

- Review fix recorded at `2026-05-26T19:07:21-03:00` for PR #170 thread `discussion_r3307114807`.
- Decision: `Manual4RuedasView` now computes `manualManifestSummary(manifest)` only after the `manifestState.error || !manifestState.manifest` guard passes, using the runtime-validated `manifestState.manifest` value instead of reading the module-level manifest before fallback UI can render.
- Regression coverage: `tests/content-manual-vehiculo-4ruedas.test.mjs` now includes a focused guard-order test that fails if the manual summary computation moves before the runtime manifest guard or stops using the guarded manifest.
- `pnpm run validate:manual-4ruedas` passed with `Manual 4 ruedas RU validated: 200/200 pages, 200 local page assets, 198 approved reused translations, 2 visual-label translation pages.`
- `node --test tests/content-manual-vehiculo-4ruedas.test.mjs` passed: 5 tests, 0 failures.
- `pnpm run test` passed: 282 tests, 0 failures.
- `pnpm run build` passed. It ran `validate:content`, synced `content/assets` into ignored `public/content/assets`, built with Vite, and generated a service worker with 1928 cached assets. The build emitted Vite's non-fatal large-chunk warning for the bundled local content corpus.
- `node scripts/check-feature-memory.mjs --worktree` passed with `Feature-memory gate passed via specs/027-manual-vehiculo-4ruedas-ru/{spec,plan,tasks}.md`.
- Second review fix recorded at `2026-05-26T19:18:08-03:00` for PR #170 thread `discussion_r3307159517`.
- Decision: `Manual4RuedasView` now selects from `matchingPages` only while a search query is active. A zero-match query therefore leaves `selectedPage` undefined and renders the no-selection detail state instead of falling through to `manifest.pages[0]`. The no-query path still falls back to page 1 when no specific page is selected.
- Empty-state UI: the detail area now exposes `data-testid="manual-empty-detail"` with a search-specific no-selection message, and it omits page counters, rendered page content, and previous/next navigation when `matchingPages.length === 0`.
- Regression coverage: `tests/e2e/app.spec.ts` includes `complete RU manual search with no matches keeps the detail pane empty`, covering zero search matches, no rendered `manual-page-detail`, no `PDF page 1`, no page counter/navigation, and restored no-query page-1 fallback after resetting search.
- `pnpm run build` passed. It ran `validate:content`, synced `content/assets` into ignored `public/content/assets`, built with Vite, and generated a service worker with 1928 cached assets. The build emitted Vite's non-fatal large-chunk warning for the bundled local content corpus.
- `node --test tests/content-manual-vehiculo-4ruedas.test.mjs` passed: 5 tests, 0 failures.
- `pnpm exec playwright test tests/e2e/app.spec.ts -g "complete RU manual search with no matches" --project=chromium` passed: 1 test, 0 failures.
- An initial `pnpm run preflight` before this evidence update failed at `node scripts/check-feature-memory.mjs --worktree` with `Product paths changed without a complete feature-memory update`, as expected because `src/App.tsx` and `tests/e2e/app.spec.ts` had changed before `tasks.md` was touched.
- `pnpm run preflight` passed after `tasks.md` was updated for this fix. It included `check-feature-memory --worktree`, `check:repo`, `validate:content`, 282 Node tests, production build/service-worker generation, and 54 Playwright tests across `chromium` and `mobile`. The build emitted Vite's non-fatal large-chunk warning for the bundled local content corpus.

## Verification Evidence

- Source coverage is verified against the canonical official PDF: SHA-256 `69c6e1c582db4f96337fc13db09fffab26f9ce6364279c6beb2abc21d9ad3e8e`, `mdls` page count `200`, and `pnpm run validate:manual-4ruedas` reporting `200/200 pages`.
- Page-asset coverage is verified by the Swift render command producing `page-001.jpg` through `page-200.jpg` at `1191x1684`, `find ... | wc -l` returning `200`, and the manual validator confirming `200 local page assets`.
- RU content coverage is verified by `pnpm run validate:manual-4ruedas`, which reported `198 approved reused translations` and `2 visual-label translation pages`; content tests also passed for the complete manual corpus and validation rules.
- Local/offline/no-PDF behavior is verified by the runtime decision to import static JSON and local `/content/assets/...` images only, plus e2e checks confirming no iframe/embed/object PDF viewer, no `.pdf` links, no external requests, no PDF requests, and no backend/live-AI requests.
- Representative UI and e2e coverage is verified by the `complete RU manual` Playwright checks across `chromium` and `mobile`, covering the `Руководство 4R` surface, first/middle/last page rendering, local JPEG dimensions, exact RU translation samples, and source/provenance display.
- Full preflight evidence is recorded with `pnpm run preflight` passing after the review-fix task-memory update; it included `check-feature-memory --worktree`, `check:repo`, `validate:content`, 282 Node tests, production build/service-worker generation, and 54 Playwright tests across `chromium` and `mobile`.
- Review-fix regression coverage is recorded for both PR #170 review threads: the guarded-manifest-summary unit test in `tests/content-manual-vehiculo-4ruedas.test.mjs` passed, and the zero-match manual-search e2e test passed with no rendered page detail, no page counter/navigation, and restored page-1 fallback after search reset.

## Dead Ends and Known Issues

- The earlier intermediate `node scripts/content-manual-vehiculo-4ruedas.mjs --write-manifest` failure was resolved after adding `src/data/manual4Ruedas.ts` and completing the runtime reader.
- No unresolved functional blockers or accepted known issues remain for this implementation slice.

## Decisions

- Preserve all 200 official source pages with local page-faithful JPEG assets generated from the canonical PDF, avoiding runtime PDF loading while retaining layout, images, tables, labels, and visual-only pages.
- Publish the RU manual through `content/manuals/gcba-manual-vehiculo-4-ruedas-2023/manual.ru.json` and the dedicated `Руководство 4R` app surface, with local assets, exact RU content, ordered navigation, search, and Spanish source/provenance traceability.
- Reuse existing approved RU chunks only where validators prove exact source coverage; represent pages 199-200 with page-faithful renders plus exact RU translations of visible labels.
- Keep runtime and tests blocking iframe/embed/object PDF viewers, PDF.js-style rendering, remote manual assets, manual PDF requests, and backend/live-AI dependencies.
- Accept both recorded review-fix decisions: guarded manifest summary computation uses the runtime-validated manifest, and zero-match manual search leaves the detail pane empty instead of falling back to page 1.

## Dead Ends

- The earlier intermediate `node scripts/content-manual-vehiculo-4ruedas.mjs --write-manifest` failure was resolved after adding `src/data/manual4Ruedas.ts` and completing the runtime reader.

## Known Issues

- None.

## Implementation Agent Feedback

- None.

## Cycle PR Set

- PR #170: branch `codex/027-manual-vehiculo-4ruedas-ru`, head SHA `19f8bf803126ade66e639da47666d4ff47a8bf7f`, status open/mergeable/checks passed, included in final validation.

## Final Validation Evidence

- Effective content head: 19f8bf803126ade66e639da47666d4ff47a8bf7f
- Architect validation: passed at 2026-05-26T22:54:19Z for PR #170 after validating the complete RU 4-wheel manual scope, recorded verification evidence, review-fix disposition, process memory, and current-head alignment.
- Architect validated effective content head: 19f8bf803126ade66e639da47666d4ff47a8bf7f
- Architect return count: 0
- Limit escalation: none
- Analyst feedback Architect disposition: not applicable; no Analyst final-validation gap required Architect disposition.
- Current-PR-head read-only guard: effective content head 19f8bf803126ade66e639da47666d4ff47a8bf7f matched the PR head during Architect validation; any later final-validation evidence-only commit must change only role-owned process-memory files and preserve required checks, review, mergeability, acceptance evidence, feedback disposition, and unresolved-thread gates.

## Final Architect Validation Notes

- Architect validation pass: passed
- Final Architect validation completed at: 2026-05-26T22:54:19Z
- Effective content head: 19f8bf803126ade66e639da47666d4ff47a8bf7f
- Architect validated effective content head: 19f8bf803126ade66e639da47666d4ff47a8bf7f
- Architect return count: 0
- Architect validation evidence: Scope matches the Analyst request and Architect spec: the implementation exposes a dedicated `Руководство 4R` surface, represents all 200 official source pages, preserves local page-faithful visual assets, provides complete RU content, and keeps Spanish official-source traceability.
- Architect validation evidence: Current-head and gate evidence passed for PR #170 at `19f8bf803126ade66e639da47666d4ff47a8bf7f`; Orchestrator evidence reports required checks `AI Review`, `baseline-checks`, `docker-validation`, `guard`, and `osv-scan` passed, and local Architect validation additionally passed `node scripts/check-feature-memory.mjs --worktree` and `pnpm run validate:manual-4ruedas`.
- Architect validation evidence: Prior Codex P2 review findings were fixed, outdated, and resolved; recorded review-fix evidence covers guarded manifest-summary computation and zero-match search behavior, with corresponding unit and Playwright regression coverage.
- Architect validation evidence: Verification evidence records the canonical PDF SHA-256 and 200-page source count, 200 local page assets, 198 approved reused translations, 2 visual-label translation pages, full preflight, build, Node test, content-validation, and Playwright e2e coverage.
- Architect validation evidence: Process memory includes current `## Verification Evidence`, `## Decisions`, `## Dead Ends`, `## Known Issues`, and `## Implementation Agent Feedback` sections; no unresolved implementation feedback or known issues remain.
- Architect validation evidence: Docs and tests are covered by implementation evidence for frontend docs, feature inventory, backend/content docs, content validators, frontend tests, e2e tests, and repository preflight.
- Architect validation evidence: Runtime architecture uses static manifest data and local `/content/assets/...` page images only; validators and e2e evidence block iframe/embed/object PDF viewers, PDF.js-style rendering, remote manual assets, manual PDF requests, external network fetches, and backend/live-AI dependencies for this manual surface.
- Architect gaps: none.
- Open Architect dispositions: none.
