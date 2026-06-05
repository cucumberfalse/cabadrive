# Tasks: Manual Visual Content Crop

## Status Legend

- `[x]` Complete
- `[ ]` Pending

## Architect Planning Tasks

- [x] T001 Confirm Architect assignment for
  `/Users/chap/devel/cabadrive-worktrees/034-manual-visual-content-crop` on
  branch `codex/034-manual-visual-content-crop`.
- [x] T002 Confirm verified base from Orchestrator: `origin/main` at
  `7b410e6c55be177e860cf28641c5181d67890862`.
- [x] T003 Preserve role boundary: Architect edits only `spec.md`, `plan.md`,
  and `tasks.md` under `specs/034-manual-visual-content-crop/`.
- [x] T004 Read constitution, project docs, frontend/backend docs,
  feature inventory, learning/exam flows, specify archive README, active
  `feature-request.md`, prior feature `032` memory, manual conversion
  guidelines, and relevant source files read-only.
- [x] T005 Inspect current feature `032` source-image-card data, renderer, CSS,
  source-fidelity checks, e2e checks, and Appendix IV asset paths read-only.
- [x] T006 Incorporate Orchestrator read-only excessive-margin evidence for
  `sign-sheet-185`, `sign-sheet-186`, `sign-sheet-187`, `marking-sheet-195`,
  `hospital-map`, and `body-posture` ratios.
- [x] T007 Record goal, scope, non-goals, excessive-margin criteria,
  extraction/cropping quality requirements, acceptance criteria, negative
  scenarios, implementation plan, test requirements, and handoff guidance.

## Implementation Assignment Checklist

- [x] T008 Orchestrator assigns Implementation Agent to this worktree/branch or
  another fresh latest-main isolated slice, explicitly preserving sibling
  worktrees, dirty diffs, branches, commits, PRs, and process memory.
- [x] T009 Implementation Agent confirms branch, PR slice, scoped files,
  latest-main base, and current `git status --short --branch` before editing.
- [x] T010 Implementation Agent reads `feature-request.md`, `spec.md`,
  `plan.md`, and this `tasks.md` before editing.

## Whole-Manual Inventory

- [x] T011 Enumerate every current `source-image-cards` card in
  `src/data/manual-sections/`.
- [x] T012 Enumerate every `source-artwork` block.
- [x] T013 Enumerate bespoke/manual visual local asset references under
  `content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/`.
- [x] T014 Identify any complete-manual page assets currently visible inside
  the interactive `Руководство` surface.
- [x] T015 Create a repeatable or committed inventory record for each visual:
  section, block/card id, source page, asset path, dimensions, display mode,
  protected/source-as-is status, useful bbox/ratio where practical,
  disposition, reason, and reviewer note.
- [x] T016 Record the pixel threshold/method used for useful-content detection,
  starting from non-white RGB `<245` unless implementation justifies a safer
  threshold.
- [x] T017 Flag candidates with bbox area ratio below `0.20`, bbox width/height
  ratio below `0.60` for major visuals, or manual-review tiny-content symptom.
- [x] T018 Record false positives/acceptable sparse cases explicitly instead
  of silently ignoring them.
- [x] T019 Confirm reported examples are in the inventory:
  `app4-regulatory-page-185-source-card` and
  `app4-regulatory-page-186-source-card`.
- [x] T020 Confirm Appendix IV pages `185-200` are inventoried as a group.
- [x] T021 Confirm contrast examples `hospital-map-source-as-is.png`
  (`0.4205` ratio) and `body-posture-source-as-is.png` (`0.3652` ratio) are
  dispositioned as already tight/acceptable or source-limited, not blindly
  recropped.

## Source Extraction And Cropping

- [x] T022 For page `185`, locate the meaningful official sign-sheet region in
  the source PDF and manually review detector bounds for clipped labels.
- [x] T023 For page `186`, locate the meaningful official sign-sheet region in
  the source PDF and manually review detector bounds for clipped labels.
- [x] T024 For Appendix IV pages `187-200`, locate and disposition each
  page-sheet source region; correct every below-threshold sibling unless a
  specific exception is recorded.
- [x] T025 Re-render affected source regions/pages from the canonical PDF or
  best official source at high enough DPI/source-native quality that final crop
  natural width is at least the intended max CSS display width.
- [x] T026 Do not bitmap-upscale an already-cropped low-resolution raster as the
  quality fix.
- [x] T027 Add safety padding around useful bboxes and record the padding rule
  or manual crop bounds.
- [x] T028 Save corrected assets as crop-specific source-as-is filenames where
  feasible, or record why replacing existing paths is safer.
- [x] T029 Compute natural dimensions and SHA-256 for every corrected asset.
- [x] T030 Record before/after useful-content bbox ratios for every corrected
  asset.
- [x] T031 Verify corrected page-sheet crops target useful bbox width/height
  ratios of at least `0.75` and bbox area ratio of at least `0.55`, or record a
  source-shape exception.
- [x] T032 Preserve all meaningful official signs, labels, captions, markings,
  map details, diagram lines, photos, and source-document pixels.
- [x] T033 Do not translate, relabel, redraw, recolor, clean, mask, retouch,
  inpaint, reconstruct, or vector-recreate protected source imagery.

## Data, Metadata, Renderer

- [x] T034 Update affected Appendix IV section data with corrected asset paths,
  crop-specific `sourceRegion` values, display/no-upscale metadata, alt text
  updates if needed, and visual notes.
- [x] T035 Ensure corrected page-sheet cards do not keep stale full-page
  `sourceRegion: { x: 0, y: 0, width: 2976, height: 4209 }` unless explicitly
  justified.
- [x] T036 Update implementation evidence for source page, source document,
  crop bounds, extraction method, dimensions, hash, runtime display size, and
  no-upscale proof.
- [x] T037 Preserve `displayMode: "full-width"` behavior from feature `032`.
- [x] T038 Preserve `maxDisplayWidthPx` caps so corrected images are not
  displayed wider than natural/source asset width.
- [x] T039 Preserve `minDisplayWidthPx` panoramic behavior where present and do
  not create document-level overflow.
- [x] T040 Preserve protected source exception attributes in runtime output:
  `data-official-sign-exception`, `data-source-image-exception`,
  `data-visible-spanish-scope`, and `data-source-as-is`.
- [x] T041 Preserve local asset loading and `loading="lazy"`.
- [x] T042 Keep Russian explanation/selectable learner text outside protected
  images.
- [x] T043 Avoid new card-id-specific CSS/display selectors as the crop
  mechanism.

## Durable Docs

- [x] T044 Update
  `docs_project/project/frontend/manual-conversion-guidelines.md` only if the
  implementation introduces reusable crop/inventory/evidence rules.
- [x] T045 If docs are updated, document high-DPI source-region extraction,
  useful-content bbox evidence, and no-upscale requirements without restating
  transient process notes.
- [x] T046 Do not update unrelated durable docs.

## Content And Static Tests

- [x] T047 Add or update tests requiring complete visual inventory/disposition
  evidence for the whole interactive manual.
- [x] T048 Add tests asserting pages `185` and `186` are corrected from
  margin-heavy full-page assets to meaningful source crops.
- [x] T049 Add tests asserting the old `~0.03` useful bbox ratio for reported
  sign sheets cannot pass as the final runtime asset state.
- [x] T050 Add tests asserting Appendix IV pages `185-200` are scanned and all
  below-threshold page-sheet assets are corrected or explicitly excepted.
- [x] T051 Add tests for corrected asset existence, dimensions, SHA-256,
  crop/source page metadata, extraction method, and no-upscale display caps.
- [x] T052 Add tests proving protected source-as-is exception metadata remains
  present for signs, markings, signals, maps, photos, and source-document
  examples.
- [x] T053 Add or update tests so existing feature `032` display-mode inventory,
  full-width/compact dispositions, and panoramic min-width behavior stay intact.
- [x] T054 Add tests rejecting new hard-coded source-card `data-card-id` CSS
  workarounds for this defect.
- [x] T055 Add tests or evidence for already tight/source-limited contrast
  assets such as hospital map and body posture.

## Playwright Evidence

- [x] T056 Add or update a helper that measures useful-content bbox inside the
  rendered image, not only the outer image element.
- [x] T057 Add desktop and mobile checks for
  `/#manual-section-app4-signs-regulatory`.
- [x] T058 Assert page `185` useful-content rendered width is at least `65%` of
  the containing manual content/card width when natural dimensions allow.
- [x] T059 Assert page `186` useful-content rendered width is at least `65%` of
  the containing manual content/card width when natural dimensions allow.
- [x] T060 Assert corrected image CSS display width does not exceed natural
  asset width.
- [x] T061 Assert no document-level horizontal overflow on mobile.
- [x] T062 Capture desktop/mobile screenshots for the reported regulatory
  section.
- [x] T063 Add representative desktop/mobile checks for another corrected
  Appendix IV sheet.
- [x] T064 Add representative desktop/mobile checks for a non-Appendix visual
  if the inventory finds one requiring correction.
- [x] T065 Keep existing Playwright checks passing for hospital map, body
  posture, panoramic mirror card, and representative full-width cards from
  feature `032`.

## Local Verification

- [x] T066 Run `node scripts/check-feature-memory.mjs --worktree`.
- [x] T067 Run focused inventory/source-crop tests.
- [x] T068 Run `pnpm run validate:manual-guide`.
- [x] T069 Run `pnpm run validate:content`.
- [x] T070 Run `pnpm exec tsc --noEmit`.
- [x] T071 Run `pnpm run test`.
- [x] T072 Run `pnpm run build`.
- [x] T073 Run focused Playwright checks.
- [x] T074 Run `git diff --check`.
- [x] T075 Run `pnpm run preflight` before PR readiness if feasible; otherwise
  record blocker/reason.
- [x] T076 Record exact command results and evidence paths in this `tasks.md`.

## Review / PR / Final Validation Prep

- [x] T077 Implementation Agent stages, commits, pushes, and opens/updates one
  ready PR only if assigned by Orchestrator. Status: implementation committed
  at `a1529501649c1e79765ddedc1081fb26eea522d4`, pushed to
  `origin/codex/034-manual-visual-content-crop`, and ready PR `#200`
  <https://github.com/cucumberfalse/cabadrive/pull/200> opened.
- [ ] T078 Review Agent checks source extraction quality, whole-manual
  inventory completeness, useful-content bbox evidence, protected-image
  preservation, no-upscale proof, mobile layout, feature `032` regression
  safety, and process-memory compliance.
- [ ] T079 Implementation Agent records and resolves review findings only
  through Orchestrator assignment.
- [ ] T080 Orchestrator invokes final Architect validation before final Analyst
  validation after implementation, checks, review, and feedback disposition are
  complete.

## Initial Evidence Notes

- Orchestrator read-only evidence: `sign-sheet-185-source-as-is.jpg` natural
  size `2976x4209`, useful bbox approx `1190,1682,503x821`, bbox area ratio
  `0.0330`, ink ratio `0.0040`.
- Orchestrator read-only evidence: `sign-sheet-186-source-as-is.jpg` natural
  size `2976x4209`, useful bbox approx `1242,1682,544x821`, bbox area ratio
  `0.0357`, ink ratio `0.0043`.
- Orchestrator read-only evidence: `sign-sheet-187-source-as-is.jpg` natural
  size `2976x4209`, useful bbox approx `1190,1682,511x821`, bbox area ratio
  `0.0335`.
- Orchestrator read-only evidence: `marking-sheet-195-source-as-is.jpg`
  natural size `2976x4209`, useful bbox approx `1190,1682,513x821`, bbox area
  ratio `0.0336`.
- Orchestrator read-only evidence: `hospital-map-source-as-is.png` bbox area
  ratio `0.4205`; this supports an already-tight/source-limited disposition
  unless later evidence proves otherwise.
- Orchestrator read-only evidence: `body-posture-source-as-is.png` bbox area
  ratio `0.3652`; this supports an already-tight/source-limited disposition
  unless later evidence proves otherwise.

## Decisions

- Architect decision: this feature corrects source asset/crop quality and
  useful-content ratio; feature `032` full-width layout remains the base and
  must not regress.
- Architect decision: an outer image/card width assertion is insufficient.
  Tests must measure or otherwise prove the useful content inside the image is
  large enough.
- Architect decision: affected protected signs/markings/signals/photos/maps may
  be cropped to remove empty outer margins, but meaningful pixels must remain
  source-faithful and unedited.
- Architect decision: Appendix IV pages `185-200` are a priority pattern group.
- Architect decision: already tight crops such as hospital map and body posture
  need inventory evidence, not blind recropping.
- Architect decision: no user clarification is needed before implementation.
- Implementation startup decision `2026-06-05T13:24:00-03:00`:
  Implementation Agent assignment confirmed for worktree
  `/Users/chap/devel/cabadrive-worktrees/034-manual-visual-content-crop`,
  branch `codex/034-manual-visual-content-crop`, one implementation PR slice
  for feature `034-manual-visual-content-crop`, verified latest-main base
  `origin/main` at `7b410e6c55be177e860cf28641c5181d67890862`, and scoped
  files limited to source-quality crop helpers, Appendix IV/manual visual
  assets and metadata, manual-guide tests/evidence, durable manual conversion
  guidance if reusable rules are clarified, and this process-memory file.
  Parallel work may exist; sibling worktrees, unrelated branches, commits,
  PRs, dirty diffs, and process memory must be preserved. Startup status before
  product edits: `## codex/034-manual-visual-content-crop...origin/main` with
  untracked `specs/034-manual-visual-content-crop/` feature memory only.
- Replacement Implementation adoption decision `2026-06-05T08:38:14-03:00`:
  replacement Implementation Agent assignment confirmed for the same worktree
  `/Users/chap/devel/cabadrive-worktrees/034-manual-visual-content-crop`,
  branch `codex/034-manual-visual-content-crop`, one implementation PR slice,
  tracking `origin/main` at verified base
  `7b410e6c55be177e860cf28641c5181d67890862`. Parallel agents/worktrees may
  exist; sibling worktrees, unrelated branches, commits, PRs, dirty diffs, and
  process memory must be preserved. Startup adoption status before replacement
  implementation edits: `## codex/034-manual-visual-content-crop...origin/main`
  with the prior non-responsive agent's substantial uncommitted diff present:
  Appendix IV crop helper scripts, visual crop config/evidence, generated
  crop assets and validation crops for pages `185-200`, Appendix IV section
  metadata, generated interactive-guide registry metadata, content/e2e tests,
  durable manual conversion guidance, and this feature memory. Replacement
  agent adopts and preserves that diff for verification and fix-forward work;
  no inherited file has been discarded or reverted. Note: during replacement
  inspection, `node scripts/manual-visual-content-inventory.mjs` was rerun
  before this adoption note was written; the command completed successfully and
  regenerated the existing registry/evidence path for the inherited diff.
- Implementation decision `2026-06-05T11:42:43Z`: adopted the inherited
  source-limited crop approach after verification. The Swift helper attempts a
  higher-scale official PDF render, but evidence records rendered useful-width
  scale near `1.0` for pages `185-200`, so the official PDF embeds
  source-limited Appendix IV sheet pixels. The implemented fix therefore crops
  only empty outer page margins from the official source pixels and caps each
  runtime image at its natural crop width; it does not browser-upscale,
  retouch, redraw, reconstruct, relabel, translate, mask, inpaint, or otherwise
  modify protected pixels.
- Implementation decision `2026-06-05T11:42:43Z`: the large
  `section-registry.chapters-1-2.json` diff is intentional generated metadata
  propagation from `scripts/manual-visual-content-inventory.mjs`, not unrelated
  format churn. It updates Appendix IV pages `185-200` from stale full-page
  `0,0,2976,4209` source regions to crop-specific source regions, dimensions,
  SHA-256 hashes, useful-content ratio evidence, runtime no-upscale caps,
  visible-Spanish exception asset paths, and visual review notes.

## Dead Ends

- None known at Architect handoff.
- Scratch verification command dead end `2026-06-05T11:42:43Z`: an initial
  one-off `node -e` hash/summary audit failed because it used ESM `import`
  statements without `--input-type=module`. The command did not identify a
  product issue. It was rerun successfully with `node --input-type=module -e`
  and the successful result is recorded below.

## Known Issues

- No open known issues at implementation handoff. The official PDF
  source-quality limitation for Appendix IV pages `185-200` is recorded as an
  implementation decision and evidence-backed no-upscale disposition, not an
  unresolved issue.

## Implementation Agent Feedback

- None requiring Architect disposition. Replacement verification did not find a
  need to split scope, request new user clarification, or alter the architecture.

## Verification Evidence

- Replacement adoption verification `2026-06-05T11:38:14Z`:
  `node scripts/check-feature-memory.mjs --worktree` passed. Focused inventory
  regeneration `node scripts/manual-visual-content-inventory.mjs` passed with
  `38` source-image cards, `2` source-artwork blocks, and `16` corrected
  Appendix IV crops. Focused content test
  `node --test tests/content-manual-guide-chapters.test.mjs` passed with `95`
  tests, `95` pass, `0` fail, duration `11678.671792ms`.
- Replacement asset/evidence audit `2026-06-05T11:42:43Z`:
  `node --input-type=module -e '<hash audit for visual crop evidence targets>'`
  passed for all `16` corrected Appendix IV targets. Output confirmed pages
  `185-200` have crop dimensions from `664x980` through `757x1003`,
  after-crop useful area ratios from `0.635` through `0.667`, and rendered
  useful-width scale ratios around `0.988-1.002`, matching the recorded
  `source-limited-native-raster-in-official-pdf` disposition. Summary audit
  confirmed `38` source-image cards, `2` source-artwork blocks, `132` section
  asset files, `16` corrected Appendix IV crops, pages `185-200` covered, `7`
  compact source-image cards, and contrast examples
  `app2-hospital-map-source-card` and `app3-body-posture-source-card`.
- Required checks `2026-06-05T11:42:43Z`:
  `pnpm run validate:manual-guide` passed with `50` implemented sections and
  `0` pending sections. `pnpm run validate:content` passed with `460` category
  B fallback questions and `276` local image references, plus manual-guide
  source-fidelity pass. `pnpm exec tsc --noEmit` passed. `pnpm run test` passed
  with `421` tests, `421` pass, `0` fail, duration `12882.901917ms` in the
  preflight run. `pnpm run build` passed and generated a service worker with
  `1860` cached assets. `git diff --check` passed after preflight.
- Focused browser evidence `2026-06-05T11:42:43Z`:
  `pnpm exec playwright test --grep "Manual guide full-width source image cards stay readable and avoid upscaling"`
  passed with `2` tests, `2` pass, `0` fail, duration `8.9s`. The focused test
  covers Chromium and mobile, measures useful-content bounds inside the
  rendered cropped images, asserts corrected useful content occupies at least
  `65%` of the rendered image/card width when source quality allows, and
  asserts runtime image display width does not exceed natural crop width.
  Screenshot evidence paths include
  `test-results/app-Manual-guide-full-widt-84d9e-eadable-and-avoid-upscaling-chromium/manual-source-full-width-app4-signs-regulatory-desktop-chromium.png`,
  `test-results/app-Manual-guide-full-widt-84d9e-eadable-and-avoid-upscaling-chromium/manual-source-full-width-app4-signs-regulatory-mobile-chromium.png`,
  `test-results/app-Manual-guide-full-widt-84d9e-eadable-and-avoid-upscaling-chromium/manual-source-full-width-app4-signs-horizontal-desktop-chromium.png`,
  and
  `test-results/app-Manual-guide-full-widt-84d9e-eadable-and-avoid-upscaling-chromium/manual-source-full-width-app4-signs-horizontal-mobile-chromium.png`.
- Full preflight `2026-06-05T11:42:43Z`: `pnpm run preflight` passed. It ran
  feature-memory gate, repository baseline check, `validate:content`,
  `pnpm run test` (`421` tests passed), `pnpm run build` (service worker with
  `1860` cached assets), and nested `pnpm run test:e2e` with `82` tests passed
  in `45.1s`. The build emitted the existing Vite large-chunk warning but no
  failure.
- PR handoff evidence `2026-06-05T11:45:12Z`: staged feature-scoped files,
  committed implementation as `a1529501649c1e79765ddedc1081fb26eea522d4`,
  pushed branch `codex/034-manual-visual-content-crop` to origin, and opened
  ready PR `#200` at
  <https://github.com/cucumberfalse/cabadrive/pull/200>. This follow-up line is
  process-memory evidence only.
