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

### Post-Final-Validation Review Fixes

- `[x]` Resolve PR #170 thread `PRRT_kwDOSX65IM6E8s5Z` / comment `3307364462`: defer loading the full `manual4RuedasRu` manifest/corpus until the `Руководство 4R` view opens, using route/view-level lazy loading, a dynamic local import, or an equivalent local-first boundary that removes the 200-page manual corpus from the initial app startup bundle.
- `[x]` Preserve the local-first manual contract while deferring loading: the manual view must still load all 200 pages from repository-served local assets/content, avoid runtime PDF viewer/PDF.js behavior, avoid remote/manual network fetches, and keep accessible loading/error states.
- `[x]` Add or update verification for deferred manual loading, including evidence that `src/App.tsx` no longer has a top-level static import of the full manual corpus and that the manual surface still opens and renders representative first/middle/last pages after the lazy boundary loads.
- `[x]` Resolve PR #170 thread `PRRT_kwDOSX65IM6E8s5T` / comment `3307364457`: precompute normalized per-page manual search strings with `useMemo` or equivalent caching tied to the loaded manifest, then filter against that cache instead of recomputing normalized full-page text for every page on each render or keystroke.
- `[x]` Add or update manual-search regression coverage after caching, preserving zero-match empty-detail behavior, representative page rendering, exact RU content/provenance display, and local-only/no-network constraints.
- `[x]` Rerun and record relevant local validation/build/test evidence after the review fixes, including the manual validator, focused unit/e2e coverage, build, and repository preflight as applicable.
- `[x]` Resolve PR #170 thread `PRRT_kwDOSX65IM6E9J_W` / comment `3307532483`, review `4368314983`: update service-worker generation/runtime caching so the dynamic `manual4Ruedas-*.js` chunk is not included in install-time precache. Implementation may exclude the manual chunk from `scripts/generate-service-worker.mjs` precache assets and cache it on demand when the manual route loads, or use an equivalent local-first runtime caching path that keeps non-manual startup from fetching the chunk.
- `[x]` Add startup regression coverage for the service-worker/manual-chunk boundary: non-manual app startup must not request or load the `manual4Ruedas-*.js` chunk, while opening the manual view still loads the local chunk and preserves representative manual rendering, no remote/manual PDF requests, and accessible loading/error behavior.
- `[x]` Resolve PR #170 thread `PRRT_kwDOSX65IM6E9J_a` / comment `3307532488`, review `4368314983`: align process memory with PR head `44e4173a7fb0e15f02883b0771895557d4279c6b` as the post-fix implementation head before this follow-up, record prior head `b25890ecd48148819d45ffdd9407fcd7654195c6` and previous P2 threads as superseded/resolved/outdated, and keep the cycle PR set/final-validation guard text current.
- `[x]` Rerun and record relevant local validation/build/test evidence after these new P2 fixes, including service-worker generation/build output, focused startup/chunk coverage, manual route coverage, `node scripts/check-feature-memory.mjs --worktree`, and repository preflight as applicable.
- `[x]` Resolve PR #170 thread `PRRT_kwDOSX65IM6E9nih` / comment `3307705691`, review after head `260c16dc03c93a8e98ce6be063e651dd97f0f37a`: exclude manual page JPEG assets such as `/content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/pages/page-*.jpg` from install-time service-worker precache while preserving local manual access through on-demand runtime caching when the `Руководство 4R` surface opens.
- `[x]` Update service-worker generation tests and build-inspection expectations so install-time precache excludes both the dynamic `manual4Ruedas-*.js` corpus chunk and the 200 manual page JPEG assets, while ordinary app assets remain precached and successful manual asset GET responses remain runtime-cacheable.
- `[x]` Add or update startup/runtime coverage as needed to prove non-manual app startup does not request or install-precache manual page JPEG assets, while opening the manual view still loads local page images, preserves representative first/middle/last page rendering, and records no remote/manual PDF/backend/live-AI requests.
- `[x]` Rerun and record relevant validation evidence after the P1 fix, including service-worker focused tests, build/service-worker inspection, manual validator, focused e2e coverage as applicable, `node scripts/check-feature-memory.mjs --worktree`, and repository preflight.
- `[x]` Resolve PR #170 thread `PRRT_kwDOSX65IM6E90rE` / comment `3307779988`, review `4368625136`: align process memory so current head `00cf8b7e8ef1c4b6eeae44ad02d398d923e74511` is explicitly named as the post-fix implementation/effective-content candidate, and older `d2ca3401d2b93627ac623d8cd0b8e37bc8dc38e0` references are historical/superseded.
- `[x]` Dispose PR #170 thread `PRRT_kwDOSX65IM6E9zUc` / comment `3307772443` as not-needed implementation work: install-time precaching of the full manual chunk and 200 page JPEGs remains intentionally excluded under the accepted deferred-loading architecture, while repository-served local assets and runtime GET caching preserve local/offline reuse after manual access.

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
- `[x]` Prior P2 review findings for deferred manual loading and cached manual search are fixed and Implementation Agent verification evidence is recorded.
- `[x]` Current-head P2 review findings from review `4368314983` for service-worker precache behavior and process-memory alignment are fixed and Implementation Agent verification evidence is recorded.
- `[x]` Current-head P1 review finding `PRRT_kwDOSX65IM6E9nih` for manual page JPEG install-time precache behavior is fixed and Implementation Agent verification evidence is recorded.
- `[ ]` Final Architect and Analyst validation must rerun after these post-final-validation fixes land; Implementation Agent does not perform those role actions.

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

- Prior post-final-validation P2 review fix recorded at `2026-05-26T23:33:54Z` for PR #170 threads `PRRT_kwDOSX65IM6E8s5Z` / comment `3307364462` and `PRRT_kwDOSX65IM6E8s5T` / comment `3307364457`.
- Decision: `src/App.tsx` now type-imports only `ManualPage` and `ManualRuManifest`; `Manual4RuedasView` dynamically imports `./data/manual4Ruedas` from a `useEffect` when the view mounts, then runs `assertManualManifestRuntimeShape(manual4RuedasRu)` and `manualManifestSummary(manifest)` before rendering the loaded reader state.
- Loading/error behavior: the manual view now exposes a loading state with `data-testid="manual-loading"` before the manifest is ready, keeps the existing local manifest validation error fallback, and still uses repository-served local manifest data and `/content/assets/...` page images only.
- Runtime validator coverage: `scripts/content-manual-vehiculo-4ruedas.mjs` now rejects a top-level runtime import from `./data/manual4Ruedas` in `src/App.tsx` and requires a dynamic local import boundary for the manual corpus.
- Search decision: `Manual4RuedasView` now builds `manualSearchIndex` with `useMemo` from the loaded manifest pages, storing `{ page, searchText }` entries once per manifest; filtering now checks `entry.searchText.includes(query)` instead of calling `manualPageSearchText(page)` inside the `filter(...)` expression on every render/keystroke.
- Regression coverage: `tests/content-manual-vehiculo-4ruedas.test.mjs` now verifies that `src/App.tsx` has no top-level static runtime import from `./data/manual4Ruedas`, includes the dynamic local import and loading state, computes the summary after runtime validation, precomputes manual search text through `useMemo`, and does not call `manualPageSearchText(` inside the `matchingPages` filter statement.
- `pnpm run validate:manual-4ruedas` passed with `Manual 4 ruedas RU validated: 200/200 pages, 200 local page assets, 198 approved reused translations, 2 visual-label translation pages.`
- `node --test tests/content-manual-vehiculo-4ruedas.test.mjs` passed: 6 tests, 0 failures.
- `pnpm run build` passed. It ran `validate:content`, synced `content/assets` into ignored `public/content/assets`, built with Vite, emitted the full manual corpus as a separate dynamic `manual4Ruedas-*.js` chunk, and generated a service worker with 1929 cached assets. The build emitted Vite's non-fatal large-chunk warning for other bundled local content.
- `pnpm exec playwright test tests/e2e/app.spec.ts -g "complete RU manual"` passed: 4 tests across `chromium` and `mobile`, 0 failures. Coverage included representative first/middle/last manual pages, zero-match empty-detail behavior, local JPEG assets, no PDF viewer elements, no `.pdf` links, no external requests, no PDF requests, and no backend/live-AI requests.
- `pnpm run preflight` passed after the review-fix task-memory update. It included `check-feature-memory --worktree`, `check:repo`, `validate:content`, 283 Node tests, production build/service-worker generation with the separate dynamic `manual4Ruedas-*.js` chunk, and 54 Playwright tests across `chromium` and `mobile`. The build emitted Vite's non-fatal large-chunk warning for bundled local content.
- Current-head P2 review fix recorded at `2026-05-26T23:59:08Z` for PR #170 threads `PRRT_kwDOSX65IM6E9J_W` / comment `3307532483` and `PRRT_kwDOSX65IM6E9J_a` / comment `3307532488`, review `4368314983`.
- Post-follow-up implementation head: `221f634b8feb9a4c46528da655d352baa2a78131` (`Fix manual service worker precache`), created after pre-follow-up head `44e4173a7fb0e15f02883b0771895557d4279c6b` and prior superseded head `b25890ecd48148819d45ffdd9407fcd7654195c6`.
- Prior process-memory evidence head: `d2ca3401d2b93627ac623d8cd0b8e37bc8dc38e0` (`Record manual service worker evidence`), an evidence-only process-memory update after `221f634b8feb9a4c46528da655d352baa2a78131`; superseded by current post-fix implementation/effective-content candidate head `00cf8b7e8ef1c4b6eeae44ad02d398d923e74511`.
- Service-worker decision: `scripts/generate-service-worker.mjs` now exposes testable generation helpers and excludes both hashed `/assets/manual4Ruedas-*.js` files and `/content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/pages/page-*.jpg` manual page assets from install-time `ASSETS`; ordinary build assets, unrelated `content/assets`, and non-page manual-adjacent assets remain eligible for precache. The fetch handler still caches successful GET responses with `cache.put(event.request, copy)`, so the manual corpus chunk and manual page images are cached on demand after the manual view opens.
- Startup regression coverage: `tests/e2e/app.spec.ts` now verifies non-manual startup reaches the default trainer without requesting `/assets/manual4Ruedas-*.js`; opening `Руководство 4R` then requests the local manual chunk once, renders page `1 / 200`, and records no external or PDF requests.
- Service-worker regression coverage: `tests/service-worker-generation.test.mjs` builds a temporary `dist` fixture with a hashed `manual4Ruedas-*.js` chunk, ordinary JS assets, a non-JS manual asset, manual JPEG page assets, unrelated manual-adjacent content assets, and an old `sw.js`; it asserts install precache excludes only the deferred manual JS corpus chunk and 4R manual page JPEGs while the generated service worker retains runtime GET caching.
- `node --test tests/service-worker-generation.test.mjs` passed: 2 tests, 0 failures.
- `node --test tests/service-worker-generation.test.mjs tests/content-manual-vehiculo-4ruedas.test.mjs` passed: 8 tests, 0 failures.
- `pnpm run validate:manual-4ruedas` passed with `Manual 4 ruedas RU validated: 200/200 pages, 200 local page assets, 198 approved reused translations, 2 visual-label translation pages.`
- `pnpm run build` passed after the P1 fix. It ran `validate:content`, synced `content/assets` into ignored `public/content/assets`, built with Vite, emitted `dist/assets/manual4Ruedas-DqzUnZXS.js` as a separate dynamic chunk, and generated a service worker with 1728 cached assets. Direct inspection confirmed `dist/sw.js` install-time `ASSETS` has `manualChunks: 0`, `manualImages: 0`, `assetCount: 1728`, and still contains `cache.addAll(ASSETS)`, `fetch(event.request)`, and runtime `cache.put(event.request, copy)`.
- `pnpm exec playwright test tests/e2e/app.spec.ts -g "complete RU manual|manual corpus chunk"` passed: 6 tests across `chromium` and `mobile`, 0 failures. Coverage included representative first/middle/last manual pages, the non-manual-startup/manual-chunk request boundary, zero-match empty-detail behavior, local JPEG assets, no PDF viewer elements, no `.pdf` links, no external requests, no PDF requests, and no backend/live-AI requests.
- `node scripts/check-feature-memory.mjs --worktree` passed with `Feature-memory gate passed via specs/027-manual-vehiculo-4ruedas-ru/{spec,plan,tasks}.md`.
- `pnpm run preflight` passed after the P1 fix and task-memory update. It included `check-feature-memory --worktree`, `check:repo`, `validate:content`, 285 Node tests, production build/service-worker generation with both the separate dynamic `manual4Ruedas-DqzUnZXS.js` chunk and the 200 manual page JPEG assets excluded from install-time `ASSETS`, and 56 Playwright tests across `chromium` and `mobile`. The build emitted Vite's non-fatal large-chunk warning for bundled local content.
- Post-build direct `dist/sw.js` inspection confirmed `manualChunks: 0`, `manualImages: 0`, `assetCount: 1728`, `hasRuntimeFetch: true`, `hasRuntimeCache: true`, and `hasInstallAddAll: true`; `dist/assets/manual4Ruedas-DqzUnZXS.js` still exists for on-demand local manual loading, and the 200 manual page JPEGs remain repository-served local assets for runtime loading.
- P1 review fix recorded at `2026-05-27T00:43:52Z` for PR #170 thread `PRRT_kwDOSX65IM6E9nih` / comment `3307705691`.
- Decision: `isManualPageImageAsset()` now matches only the dedicated 4R manual page JPEG path pattern `/content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/pages/page-###.jpg`; `shouldInstallPrecacheAsset()` excludes that matcher in addition to `/sw.js` and `/assets/manual4Ruedas-*.js`, avoiding a broad `content/assets` exclusion.
- Current post-fix implementation/effective-content candidate head: `00cf8b7e8ef1c4b6eeae44ad02d398d923e74511`, which contains the accepted P1 manual page JPEG precache fix, validation evidence, and this review-disposition process-memory state.
- Regression coverage: `tests/service-worker-generation.test.mjs` verifies the manual page matcher, excludes `page-001.jpg` and `page-200.jpg` from install precache, keeps ordinary app assets and manual-adjacent non-page/unrelated content assets eligible, and proves generated `sw.js` retains install `cache.addAll(ASSETS)` plus runtime `fetch(event.request)` and `cache.put(event.request, copy)`.
- `node --test tests/service-worker-generation.test.mjs` passed: 2 tests, 0 failures.
- `pnpm run validate:manual-4ruedas` passed with `Manual 4 ruedas RU validated: 200/200 pages, 200 local page assets, 198 approved reused translations, 2 visual-label translation pages.`
- `pnpm exec playwright test tests/e2e/app.spec.ts -g "complete RU manual|manual corpus chunk"` passed: 6 tests across `chromium` and `mobile`, 0 failures. Coverage included representative first/middle/last manual pages, local JPEG rendering, the non-manual-startup/manual-chunk request boundary, zero-match empty-detail behavior, no external requests, no PDF requests, and no backend/live-AI requests.
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
- Most recent completed preflight evidence before review `4368314983` is recorded with `pnpm run preflight` passing after the prior P2 review-fix task-memory update; it included `check-feature-memory --worktree`, `check:repo`, `validate:content`, 283 Node tests, production build/service-worker generation with the separate dynamic `manual4Ruedas-*.js` chunk, and 54 Playwright tests across `chromium` and `mobile`.
- Review-fix regression coverage is recorded for prior PR #170 review threads: the guarded-manifest-summary unit test passed, the zero-match manual-search e2e test passed with no rendered page detail/counter/navigation and restored page-1 fallback after search reset, and the prior P2 regression tests passed for deferred manual-corpus loading plus cached normalized manual search.
- Review `4368314983` and follow-up P1 regression coverage is recorded for the service-worker/startup boundary: focused Node tests prove install-time `ASSETS` excludes `/assets/manual4Ruedas-*.js` and the 200 4R manual page JPEGs while preserving runtime caching and ordinary asset precache, build inspection proves the generated manual chunk exists but is absent from `dist/sw.js` precache and `manualImages` is `0`, and focused Playwright tests prove non-manual startup does not request the manual corpus chunk while the manual view still loads and renders local page images.

## Dead Ends and Known Issues

- The earlier intermediate `node scripts/content-manual-vehiculo-4ruedas.mjs --write-manifest` failure was resolved after adding `src/data/manual4Ruedas.ts` and completing the runtime reader.
- Prior P2 review findings after earlier final validation have implementation fixes and local verification evidence recorded in the Implementation Agent pass ending at head `44e4173a7fb0e15f02883b0771895557d4279c6b`.
- Review `4368314983` introduced two accepted P2 follow-up findings at pre-follow-up head `44e4173a7fb0e15f02883b0771895557d4279c6b`: the dynamic manual chunk remained in install-time service-worker precache, and process memory still named `b25890ecd48148819d45ffdd9407fcd7654195c6` as the then-current head. Both accepted findings are implemented at post-follow-up implementation head `221f634b8feb9a4c46528da655d352baa2a78131`, with historical process-memory evidence recorded at `d2ca3401d2b93627ac623d8cd0b8e37bc8dc38e0`.
- PR #170 thread `PRRT_kwDOSX65IM6E9nih` introduced an accepted P1 follow-up after final validation evidence commit `260c16dc03c93a8e98ce6be063e651dd97f0f37a`; the implementation in this pass excludes the 200 manual page JPEGs from install-time service-worker precache while preserving on-demand runtime caching.
- Prior final Architect and Analyst validation for effective content head `330898c36037a14508acdc91381deb3652c0a166` remains stale/superseded for completion and merge readiness until Orchestrator reroutes final Architect and Analyst validation on the new post-fix PR head.

## Decisions

- Preserve all 200 official source pages with local page-faithful JPEG assets generated from the canonical PDF, avoiding runtime PDF loading while retaining layout, images, tables, labels, and visual-only pages.
- Publish the RU manual through `content/manuals/gcba-manual-vehiculo-4-ruedas-2023/manual.ru.json` and the dedicated `Руководство 4R` app surface, with local assets, exact RU content, ordered navigation, search, and Spanish source/provenance traceability.
- Reuse existing approved RU chunks only where validators prove exact source coverage; represent pages 199-200 with page-faithful renders plus exact RU translations of visible labels.
- Keep runtime and tests blocking iframe/embed/object PDF viewers, PDF.js-style rendering, remote manual assets, manual PDF requests, and backend/live-AI dependencies.
- Accept both recorded review-fix decisions: guarded manifest summary computation uses the runtime-validated manifest, and zero-match manual search leaves the detail pane empty instead of falling back to page 1.
- Defer install-time service-worker caching for the heavy complete-manual payload: the dynamic `manual4Ruedas-*.js` chunk and 200 4R manual page JPEGs are excluded from install precache, while runtime successful GET caching preserves local/offline reuse after the manual surface opens.

## Dead Ends

- The earlier intermediate `node scripts/content-manual-vehiculo-4ruedas.mjs --write-manifest` failure was resolved after adding `src/data/manual4Ruedas.ts` and completing the runtime reader.

## Known Issues

- No known issues.

## Implementation Agent Feedback

- None.

## Post-Final-Validation Architect Disposition

- Disposition recorded at: 2026-05-26T23:50:02Z
- Current PR: #170
- Current head requiring follow-up: `44e4173a7fb0e15f02883b0771895557d4279c6b`
- Previous follow-up implementation head: `b25890ecd48148819d45ffdd9407fcd7654195c6` (superseded by `44e4173a7fb0e15f02883b0771895557d4279c6b`; prior P2 threads `PRRT_kwDOSX65IM6E8s5Z` and `PRRT_kwDOSX65IM6E8s5T` are fixed and resolved/outdated at current head)
- Prior effective content head: `19f8bf803126ade66e639da47666d4ff47a8bf7f`
- Prior final validation status: stale/superseded because current-head review `4368314983` found two accepted P2 follow-up issues after final validation and after the previous follow-up implementation.
- Architect return count: 2
- Accepted finding: PR #170 thread `PRRT_kwDOSX65IM6E9J_W`, comment `3307532483`, review `4368314983`, `src/App.tsx:1421`; the dynamic import removed the manual corpus from the main bundle, but generated `dist/sw.js` still install-time precaches `/assets/manual4Ruedas-*.js`. Implementation must exclude the manual chunk from install-time precache or move it to equivalent on-demand runtime caching while preserving local-first manual behavior.
- Accepted finding: PR #170 thread `PRRT_kwDOSX65IM6E9J_a`, comment `3307532488`, review `4368314983`, `specs/027-manual-vehiculo-4ruedas-ru/tasks.md:190`; process memory must align the cycle PR set and final-validation guard with current head `44e4173a7fb0e15f02883b0771895557d4279c6b` as the post-fix implementation head before this follow-up, and mark prior head `b25890ecd48148819d45ffdd9407fcd7654195c6` plus earlier P2 threads as superseded/resolved/outdated.
- Architect disposition: both findings are accepted as follow-up implementation tasks; no rejection is justified.
- Implementation boundary: Architect records disposition and tasks only. Architect does not edit code, tests, docs, runtime files, GitHub threads, or PR state.
- Next routing: Orchestrator should assign Implementation Agent follow-up for the unchecked `Post-Final-Validation Review Fixes` tasks above.
- Follow-up completion note: Implementation Agent fixed the accepted review `4368314983` findings at `221f634b8feb9a4c46528da655d352baa2a78131`, and the later evidence-only process-memory update at `d2ca3401d2b93627ac623d8cd0b8e37bc8dc38e0` recorded the service-worker evidence for that historical follow-up.
- Historical validation requirement: final Architect validation and final Analyst validation were required after that follow-up using `d2ca3401d2b93627ac623d8cd0b8e37bc8dc38e0` as the then-current effective-content candidate; later P1 implementation superseded that candidate.
- Disposition recorded at: 2026-05-27T00:37:52Z
- Current PR: #170
- Current PR head requiring follow-up: `260c16dc03c93a8e98ce6be063e651dd97f0f37a`
- Effective content head validated before this finding: `330898c36037a14508acdc91381deb3652c0a166`
- Prior final validation status: stale/superseded for merge readiness because AI Review produced accepted P1 thread `PRRT_kwDOSX65IM6E9nih` after final validation evidence was committed.
- Architect return count: 3
- Accepted finding: PR #170 thread `PRRT_kwDOSX65IM6E9nih`, comment `3307705691`, path `scripts/generate-service-worker.mjs`, line 15; `collectInstallPrecacheAssets` still includes the 200 manual page JPEG assets in install-time precache, causing about 31 MB of manual images to download at first app load even when users never open `Руководство 4R`.
- Architect disposition: accepted as a required follow-up implementation task; no owner decision is required because the finding matches the existing deferred-manual-loading and local-first runtime intent.
- Implementation requirement: exclude manual page JPEG assets from install-time precache while preserving on-demand local/runtime caching for the manual view and without reintroducing runtime PDF, remote asset, backend, or live-AI dependencies.
- Verification requirement: update service-worker tests/build inspection and startup/manual-route coverage as needed, then rerun local validation and preflight evidence before final Architect and Analyst validation rerun.
- Implementation boundary: Architect records disposition and tasks only. Architect does not edit code, tests, docs, runtime files, GitHub threads, or PR state.
- Next routing: Orchestrator should assign Implementation Agent follow-up for the unchecked P1 `Post-Final-Validation Review Fixes` tasks above.
- Validation requirement: final Architect validation and final Analyst validation must rerun after P1 implementation and verification, using the new post-fix effective content head.
- Disposition recorded at: 2026-05-27T00:59:09Z
- Current PR: #170
- Current PR head requiring disposition: `00cf8b7e8ef1c4b6eeae44ad02d398d923e74511`
- Current post-fix implementation/effective-content candidate head: `00cf8b7e8ef1c4b6eeae44ad02d398d923e74511`
- Prior process-memory evidence head `d2ca3401d2b93627ac623d8cd0b8e37bc8dc38e0` is historical/superseded by the later P1 implementation and evidence sequence.
- Prior final validation status: stale/superseded for merge readiness until final Architect and Analyst validation rerun on current head `00cf8b7e8ef1c4b6eeae44ad02d398d923e74511` or a later evidence-only head.
- Architect return count: 4
- Accepted process-memory finding: PR #170 thread `PRRT_kwDOSX65IM6E90rE`, comment `3307779988`, review `4368625136`, `specs/027-manual-vehiculo-4ruedas-ru/tasks.md`; current post-fix head `00cf8b7e8ef1c4b6eeae44ad02d398d923e74511` must be named clearly as the post-fix implementation/effective-content candidate, and old `d2ca3401d2b93627ac623d8cd0b8e37bc8dc38e0` candidate references must be historical/superseded.
- Architect disposition: accepted as required process-memory follow-up and addressed in Architect-owned `tasks.md`; no product code, tests, runtime files, GitHub threads, staging, commits, pushes, or merge actions are part of this Architect disposition.
- Conflicting AI Review finding: PR #170 thread `PRRT_kwDOSX65IM6E9zUc`, comment `3307772443`, `scripts/generate-service-worker.mjs`, line 19, requests keeping the manual corpus chunk and manual page JPEGs in install-time service-worker precache.
- Architect disposition: not-needed as implementation work. Restoring install-time precache for the full manual payload conflicts with the accepted deferred-loading architecture from prior review dispositions, which requires non-manual startup not to request or install-precache the heavy manual corpus/chunk/images.
- Rationale: the local-first contract for this feature is satisfied by repository-served local static assets, no runtime PDF/remote/backend/live-AI dependency, and runtime on-demand GET caching after the learner opens `Руководство 4R`; current docs and feature memory do not require first offline manual use before the manual has ever been opened online.
- Resolution: no owner decision is required because the established Architect direction already balances local-first manual availability with startup performance by excluding the full manual payload from install-time precache and preserving on-demand local/runtime caching.
- Validation requirement: final Architect and Analyst validation must rerun after AI Review routing completes and after any evidence-only process-memory commit, using current head `00cf8b7e8ef1c4b6eeae44ad02d398d923e74511` or the later evidence-only head as appropriate.

## Cycle PR Set

- PR #170: branch `codex/027-manual-vehiculo-4ruedas-ru`, prior final-validated effective content head `19f8bf803126ade66e639da47666d4ff47a8bf7f`, post-fix implementation head before review `4368314983` follow-up `44e4173a7fb0e15f02883b0771895557d4279c6b`, prior follow-up head `b25890ecd48148819d45ffdd9407fcd7654195c6` superseded, review `4368314983` implementation head `221f634b8feb9a4c46528da655d352baa2a78131` superseded by later evidence-only process-memory commit `d2ca3401d2b93627ac623d8cd0b8e37bc8dc38e0`, status open with accepted P2 follow-up implemented and current-head no-findings review evidence recorded by Orchestrator, included in this work cycle, final validation pending after the P1 manual-page-precache follow-up.
- PR #170 update: final validation evidence commit head `260c16dc03c93a8e98ce6be063e651dd97f0f37a` recorded validation for effective content head `330898c36037a14508acdc91381deb3652c0a166`; subsequent AI Review P1 thread `PRRT_kwDOSX65IM6E9nih` is accepted as required follow-up, included in this work cycle, implemented and locally verified in this pass, and makes prior final Architect and Analyst validation stale/superseded for completion and merge readiness until validation reruns on the new post-fix PR head.
- PR #170 update: current post-fix implementation/effective-content candidate head is `00cf8b7e8ef1c4b6eeae44ad02d398d923e74511`; process-memory P2 `PRRT_kwDOSX65IM6E90rE` is accepted and addressed, while conflicting AI Review P1 `PRRT_kwDOSX65IM6E9zUc` is disposed as not-needed implementation work with no owner decision required.

## Final Validation Evidence

- Current final-validation status: pending. Pre-follow-up PR head `260c16dc03c93a8e98ce6be063e651dd97f0f37a` had accepted P1 review finding `PRRT_kwDOSX65IM6E9nih`; that finding is implemented and locally verified in this pass. Final Architect and Analyst validation must rerun on the new post-fix PR head before completion or merge readiness.
- Effective content candidate head: `00cf8b7e8ef1c4b6eeae44ad02d398d923e74511` contains the P1 manual-page-precache implementation and current task-memory evidence, and is not yet final-validated. Prior final-validated effective content head `330898c36037a14508acdc91381deb3652c0a166` is superseded for completion; prior follow-up heads `b25890ecd48148819d45ffdd9407fcd7654195c6`, `221f634b8feb9a4c46528da655d352baa2a78131`, and `d2ca3401d2b93627ac623d8cd0b8e37bc8dc38e0` remain historical/superseded or contained in later PR history.
- Architect validation: previously passed at 2026-05-26T22:54:19Z for PR #170, but this pass is now stale/superseded until the accepted follow-up tasks are implemented and final validation reruns.
- Architect validated effective content head: 19f8bf803126ade66e639da47666d4ff47a8bf7f (prior; superseded; no current-head final Architect validation has passed yet)
- Architect return count: 2
- Limit escalation: none
- Analyst feedback Architect disposition: not applicable; no Analyst final-validation gap required Architect disposition.
- Current-PR-head read-only guard: prior effective content heads `19f8bf803126ade66e639da47666d4ff47a8bf7f` and `330898c36037a14508acdc91381deb3652c0a166` no longer represent the current review state. The accepted P1 follow-up for `PRRT_kwDOSX65IM6E9nih` is implemented and verified in this pass. Orchestrator must rerun final Architect and Analyst validation on the new post-fix PR head, and any later final-validation evidence-only commit must change only role-owned validation evidence/process memory.
- Effective content head: 330898c36037a14508acdc91381deb3652c0a166
- Architect validation: passed at 2026-05-27T00:28:04Z; PR #170 current head and required checks were verified by Orchestrator evidence.
- Architect return count: 2
- Architect validated effective content head: 330898c36037a14508acdc91381deb3652c0a166
- Limit escalation: none
- Analyst feedback Architect disposition: not applicable; no Analyst final-validation gap required Architect disposition.
- Current-PR-head read-only guard: PR head 330898c36037a14508acdc91381deb3652c0a166 matched effective content head 330898c36037a14508acdc91381deb3652c0a166 during Architect final validation; later final-validation evidence-only commit must change only role-owned validation evidence and process memory.
- Current final-validation status: stale/superseded for completion and merge readiness because AI Review produced accepted P1 thread `PRRT_kwDOSX65IM6E9nih` after final validation evidence commit `260c16dc03c93a8e98ce6be063e651dd97f0f37a`.
- Architect validation: stale/superseded after accepted P1 follow-up thread `PRRT_kwDOSX65IM6E9nih`; final Architect and Analyst validation must rerun after implementation and verification.
- Architect return count: 3
- Limit escalation: none
- Current final-validation status: stale/superseded for completion and merge readiness until final Architect and Analyst validation rerun on current post-fix implementation/effective-content candidate `00cf8b7e8ef1c4b6eeae44ad02d398d923e74511` or a later evidence-only head.
- Architect return count: 4
- Analyst feedback Architect disposition: not applicable; no Analyst final-validation gap required Architect disposition.
- Review disposition: process-memory P2 `PRRT_kwDOSX65IM6E90rE` is accepted and addressed; conflicting AI Review P1 `PRRT_kwDOSX65IM6E9zUc` is not-needed implementation work because install-time full-manual precache conflicts with accepted deferred loading and runtime on-demand caching.

## Final Architect Validation Notes

- Architect validation pass: stale/superseded (previous pass completed at 2026-05-26T22:54:19Z)
- Prior final Architect validation completed at: 2026-05-26T22:54:19Z
- Prior effective content head: 19f8bf803126ade66e639da47666d4ff47a8bf7f
- Historical effective-content candidate head: d2ca3401d2b93627ac623d8cd0b8e37bc8dc38e0 (superseded by later P1 implementation and current post-fix candidate head `00cf8b7e8ef1c4b6eeae44ad02d398d923e74511`)
- Architect validated effective content head: 19f8bf803126ade66e639da47666d4ff47a8bf7f (prior; superseded)
- Architect return count: 2
- Prior Architect validation evidence, now superseded: Scope matched the Analyst request and Architect spec at `19f8bf803126ade66e639da47666d4ff47a8bf7f`; the implementation exposed a dedicated `Руководство 4R` surface, represented all 200 official source pages, preserved local page-faithful visual assets, provided complete RU content, and kept Spanish official-source traceability.
- Prior Architect validation evidence, now superseded: Gate evidence passed for PR #170 at `19f8bf803126ade66e639da47666d4ff47a8bf7f`; Orchestrator evidence reported required checks `AI Review`, `baseline-checks`, `docker-validation`, `guard`, and `osv-scan` passed, and local Architect validation additionally passed `node scripts/check-feature-memory.mjs --worktree` and `pnpm run validate:manual-4ruedas`.
- Prior Architect validation evidence, now superseded: Earlier Codex P2 review findings were fixed, outdated, and resolved; recorded review-fix evidence covered guarded manifest-summary computation and zero-match search behavior, with corresponding unit and Playwright regression coverage.
- Prior Architect validation evidence, now superseded: Verification evidence recorded the canonical PDF SHA-256 and 200-page source count, 200 local page assets, 198 approved reused translations, 2 visual-label translation pages, full preflight, build, Node test, content-validation, and Playwright e2e coverage.
- Historical Architect disposition: accepted review `4368314983` P2 follow-up tasks are implemented at `221f634b8feb9a4c46528da655d352baa2a78131`, process-memory evidence was recorded at `d2ca3401d2b93627ac623d8cd0b8e37bc8dc38e0`, and that head is superseded by current post-fix candidate `00cf8b7e8ef1c4b6eeae44ad02d398d923e74511`.
- Prior Architect validation evidence, now superseded: Docs and tests were covered by implementation evidence for frontend docs, feature inventory, backend/content docs, content validators, frontend tests, e2e tests, and repository preflight.
- Prior Architect validation evidence, now superseded: Runtime evidence showed local `/content/assets/...` page images and blocked iframe/embed/object PDF viewers, PDF.js-style rendering, remote manual assets, manual PDF requests, external network fetches, and backend/live-AI dependencies; follow-up evidence additionally records the dynamic manual chunk excluded from install-time service-worker precache and non-manual startup not requesting it.
- Architect gaps: none currently identified for accepted review `4368314983` findings; final Architect validation itself remains stale/superseded and must rerun on current post-fix candidate `00cf8b7e8ef1c4b6eeae44ad02d398d923e74511` or a later evidence-only head.
- Open Architect dispositions: none for review `4368314983`; later dispositions for P1 manual page precache and current process-memory alignment are recorded below.
- Architect validation pass: passed
- Final Architect validation completed at: 2026-05-27T00:28:04Z
- Effective content head: 330898c36037a14508acdc91381deb3652c0a166
- Architect validated effective content head: 330898c36037a14508acdc91381deb3652c0a166
- Architect return count: 2
- Architect validation evidence: Scope and customer intent match the Analyst request and Architect spec; PR #170 provides a dedicated Russian `Руководство 4R` surface for the complete official 4-wheel vehicle manual, with no MVP, sample, summary, or partial-reader substitution.
- Architect validation evidence: The implementation records all 200 official source pages/content units, complete RU page-aligned content, 198 validated reused approved translation pages, 2 translated visual-label pages, Spanish source page traceability, and the canonical PDF SHA-256 evidence.
- Architect validation evidence: Visual preservation is satisfied through 200 local page-faithful JPEG assets with recorded dimensions/checksums and manifest entries, preserving images, icons, diagrams, tables, labels, and layout-sensitive source relationships.
- Architect validation evidence: Runtime architecture uses local manifest data and local `/content/assets/...` images, with tests and validators covering no runtime PDF viewer, iframe/embed/object PDF use, PDF.js-style rendering, remote manual assets, manual PDF requests, external network calls, backend requests, or live-AI dependency.
- Architect validation evidence: Review-fix dispositions are complete; guarded manifest-summary order, zero-match search behavior, deferred manual corpus loading, cached search text, and review `4368314983` service-worker/process-memory findings all have implementation and regression evidence.
- Architect validation evidence: Service-worker evidence records the dynamic `manual4Ruedas-*.js` corpus chunk excluded from install-time precache while preserving 200 manual images and on-demand runtime caching, with focused Node and Playwright coverage for the manual corpus chunk boundary.
- Architect validation evidence: Orchestrator evidence reports current PR head `330898c36037a14508acdc91381deb3652c0a166`, PR #170 clean merge state, all review threads resolved, current-head Review Agent no findings, and required checks `AI Review`, `baseline-checks`, `docker-validation`, `guard`, and `osv-scan` completed successfully.
- Architect validation evidence: Durable docs, validators, tests, process memory, cycle PR set, review dispositions, accepted follow-up fixes, local feature-memory guard, prior `pnpm run preflight` evidence, and `## Known Issues` with `- No known issues.` are recorded for this work cycle.
- Architect gaps: none.
- Open Architect dispositions: none.
- Architect validation pass: stale/superseded by accepted P1 thread `PRRT_kwDOSX65IM6E9nih` after final validation evidence commit `260c16dc03c93a8e98ce6be063e651dd97f0f37a`.
- Effective content head: 330898c36037a14508acdc91381deb3652c0a166 (prior final-validated head before accepted P1 follow-up)
- Architect return count: 3
- Architect validation gap: PR #170 thread `PRRT_kwDOSX65IM6E9nih` requires excluding manual page JPEG assets from install-time service-worker precache while preserving on-demand local/runtime caching for the manual surface.
- Open Architect dispositions: accepted P1 follow-up is recorded as implementation work; no human owner decision is required. Final Architect and Analyst validation must rerun after implementation and verification.
- Architect validation pass: stale/superseded until final validation reruns on current post-fix implementation/effective-content candidate `00cf8b7e8ef1c4b6eeae44ad02d398d923e74511` or a later evidence-only head.
- Current post-fix implementation/effective-content candidate head: 00cf8b7e8ef1c4b6eeae44ad02d398d923e74511
- Architect return count: 4
- Architect validation gap: process-memory P2 `PRRT_kwDOSX65IM6E90rE` required naming `00cf8b7e8ef1c4b6eeae44ad02d398d923e74511` clearly as current candidate; this Architect-owned task-memory update addresses that gap.
- Architect disposition: AI Review P1 `PRRT_kwDOSX65IM6E9zUc` is not-needed implementation work; full manual chunk/page-image install-time precache is intentionally excluded to preserve deferred loading, startup performance, and the accepted service-worker architecture while retaining repository-served local assets and on-demand runtime caching.
- Open Architect dispositions: none; no owner decision is required for `PRRT_kwDOSX65IM6E9zUc`, and final Architect and Analyst validation must rerun only after AI Review routing and evidence-only process memory are current.
