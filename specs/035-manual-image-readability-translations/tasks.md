# Tasks: Manual Image Readability And Russian Translations

## Status Legend

- `[x]` Complete
- `[ ]` Pending

## Architect Planning Tasks

- [x] T001 Confirm Architect assignment for
  `/Users/chap/devel/cabadrive-worktrees/035-manual-image-readability-translations`
  on branch `codex/035-manual-image-readability-translations`.
- [x] T002 Confirm verified base from Orchestrator: `origin/main` at
  `74c104f6d3c73a2586000dddd85953ca31586fb7`.
- [x] T003 Preserve role boundary: Architect edits only `spec.md`, `plan.md`,
  and `tasks.md` under
  `specs/035-manual-image-readability-translations/`.
- [x] T004 Read constitution, project docs, frontend/backend docs, feature
  inventory, learning/exam flows, specify archive README, active
  `feature-request.md`, feature `034` memory, manual conversion guidelines,
  and relevant source/validator files read-only.
- [x] T005 Inspect existing `ManualGuideContentBlock` image shapes,
  `SourceImageCardsBlockView`, source-image-card CSS, current validator entry
  points, visual-completeness evidence, and user-named section files read-only.
- [x] T006 Record goal, scope, protected-image rule, objective inventory fields,
  acceptance thresholds, validation requirements, tests, visual evidence,
  implementation feedback process, and PR/review/final-validation readiness.

## Orchestrator / Implementation Setup

- [x] T007 Orchestrator assigns Implementation Agent to this worktree/branch or
  another fresh latest-main isolated slice, explicitly preserving sibling
  worktrees, dirty diffs, branches, commits, PRs, and process memory.
- [x] T008 Implementation Agent confirms branch, PR slice, scoped files,
  latest-main base, current `git status --short --branch`, and parallel-work
  preservation warning before editing.
- [x] T009 Implementation Agent reads `feature-request.md`, `spec.md`,
  `plan.md`, and this `tasks.md` before editing.
- [x] T010 Implementation Agent keeps this file current with decisions,
  dead ends, evidence paths, exact validation command results, and feedback.

## Whole-Guide Image Inventory

- [x] T011 Enumerate every implemented manual-guide section under
  `src/data/manual-sections/`.
- [x] T012 Enumerate every image reference rendered by the manual guide,
  including `source-image-cards`, `source-artwork`, `mobility-context.space`,
  `pedestrian-infrastructure.cards`, `priority-area-map`,
  `bicycle-signage`, `bicycle-distance.examples`,
  `public-transport-comparison`, `public-transport-infrastructure.cards`,
  `shared-trip-closing`, and any other image block found in `src/App.tsx`.
- [x] T013 Refresh and record current counts for implemented sections, total
  image references, images with visible Spanish text, problematic images,
  fixed images, and accepted exceptions. Compare the result with the user's
  baseline of `50` sections, `82` image references, `54` Spanish-text images,
  and `33` problematic images.
- [x] T014 For every image record, capture section id/title, source module,
  block kind/id, card/image id, asset path, source page/region, natural
  dimensions, SHA-256, display mode, display width caps, rendered desktop and
  mobile sizes, and no-upscale status.
- [x] T015 For every visible-Spanish image, record protected/source-as-is
  classification, exception type, visible-Spanish scope, and protected-pixel
  rule.
- [x] T016 Inventory embedded Spanish text items or justified groups with role,
  learner relevance, protected-pixel boundary, Russian DOM mapping, coverage
  status, and readability disposition.
- [x] T017 Record explicit not-learner-relevant and source-limited exceptions
  with evidence instead of silently omitting them.

## Validation / Evidence Gate

- [x] T018 Add a manual-guide image readability/translation audit script,
  preferably `scripts/manual-guide-image-readability-translations-audit.mjs`,
  or extend an existing audit only if the result remains clear.
- [x] T019 Use a structured source/data extraction strategy, preferably
  TypeScript compiler AST parsing or a source/data adapter, rather than brittle
  single-purpose string matching.
- [x] T020 Add committed evidence at
  `content/validation/manual-guide-image-readability-translations.evidence.json`
  with schema version, feature id, counts, inventory records, required-example
  coverage, exceptions, and screenshot/evidence paths.
- [x] T021 Ensure check mode fails on missing, malformed, stale, or drifted
  evidence and does not rewrite files unless `--write` is passed.
- [x] T022 Ensure the audit fails when a visible-Spanish image lacks structured
  Russian support or a recorded exception.
- [x] T023 Ensure the audit fails when a multi-label image is counted as covered
  only by generic `bodyRu`.
- [x] T024 Ensure the audit fails when intended-readable embedded source text
  lacks readability/no-upscale disposition.
- [x] T025 Wire the new audit into `pnpm run validate:manual-guide` and keep
  `validate:content` coverage consistent.

## Runtime Data And Rendering

- [x] T026 Preserve existing `termTranslations` rendering for
  `source-image-cards`.
- [x] T027 Extend `termTranslations` compatibly only if validation metadata
  requires optional fields; preserve `termEs` and `translationRu`.
- [x] T028 Add equivalent structured translation fields/rendering for
  non-`source-image-cards` visible-Spanish image blocks where needed.
- [x] T029 Render Spanish terms with `lang="es"` and Russian translations as
  selectable DOM text near the image.
- [x] T030 Reuse or generalize `.manual-source-image-term-translations` rather
  than introducing unrelated display patterns.
- [x] T031 Preserve existing visible-Spanish/protected-source data attributes
  on rendered images.
- [x] T032 Ensure mobile translation blocks wrap cleanly and do not overlap
  images, controls, or following content.
- [x] T033 Do not add card-id-specific CSS selectors as the fix mechanism.

## Required Content Fixes

- [x] T034 Audit and complete App IV regulatory coverage, including existing
  Anexo panels, CABA overview sheets, and focused examples.
- [x] T035 Add readable panel/focused-card/high-resolution crop and structured
  Russian support for `app4-signs-warning`.
- [x] T036 Add readable panel/focused-card/high-resolution crop and structured
  Russian support for `app4-signs-informational`.
- [x] T037 Add readable panel/focused-card/high-resolution crop and structured
  Russian support for `app4-signs-temporary`.
- [x] T038 Add readable panel/focused-card/high-resolution crop and structured
  Russian support for `app4-signs-horizontal`.
- [x] T039 Add readable panel/focused-card/high-resolution crop and structured
  Russian support for `app4-signs-traffic-lights`, including quote/closing
  text dispositions for pages 198-200.
- [x] T040 For App IV, translate only external catalog captions/labels where
  they are outside protected sign bodies, plates, tablets, markings, or signal
  pixels.
- [x] T041 Fix `app3-body-posture-source-card` so meaningful Spanish posture,
  body, seat, and distance labels have structured Russian DOM support.
- [x] T042 Verify readability for `body-posture-source-as-is.png`; re-extract
  or adjust source-faithful display if it fails the accepted threshold.
- [x] T043 Verify and complete safety-element tire, blind-spot, headrest, and
  belt/seatbelt coverage across `app1`, `app2`, and `app3`.
- [x] T044 Add missing structured Russian support for `app3-seatbelt-source-card`
  if embedded Spanish labels/captions are learner-relevant.
- [x] T045 Verify `app2-hospital-map-source-card` has current map readability
  evidence, no-upscale proof, and structured or grouped Russian support for map
  legend/list labels.
- [x] T046 Add structured Russian support for `ch2-required-documents` visible
  document/card examples: DNI, license, beginner sign, cedulas, VTV, and RVA.
- [x] T047 Add structured Russian support for `ch1-bicycle` visible-Spanish
  sign/distance images or record justified grouped coverage.
- [x] T048 Add quote-level Spanish/Russian support for `ch4-distractions`
  photo/quote material.
- [x] T049 Add quote-level Spanish/Russian support for
  `ch5-anticipatory-efficient-driving` photo/quote material.
- [x] T050 Confirm every user-named group is represented in the new evidence as
  fixed, already compliant, or explicitly dispositioned.

## Protected Assets And Readability

- [x] T051 For every new or changed protected image asset, prove source-as-is
  handling and no protected-pixel translation, retouching, masking, cleanup,
  reconstruction, or overlay.
- [x] T052 For every new or changed image asset, record extraction method,
  dimensions, SHA-256, runtime display size, and no-upscale proof.
- [x] T053 For dense sheets that cannot meet readability as a whole image, use
  official high-resolution panels, focused cards, or source-faithful sub-crops
  before considering a source-limited exception.
- [x] T054 For source-limited exceptions, record attempted official extraction,
  original/retained source search, tighter crop, split/panel/card strategy, and
  reason none can pass without upscaling or protected-pixel edits.
- [x] T055 Ensure mobile fixed-width images use contained figure/card scrolling
  only and do not create document-level horizontal overflow.

## Tests

- [x] T056 Add tests for the new audit write/check behavior, stale evidence,
  missing evidence, and malformed evidence.
- [x] T057 Add tests proving the audit enumerates the full current image set
  and detects count drift.
- [x] T058 Add fixture tests that fail visible-Spanish images with no structured
  Russian support.
- [x] T059 Add fixture tests that fail multi-label visible-Spanish images
  covered only by generic `bodyRu`.
- [x] T060 Add tests for required user-named group coverage.
- [x] T061 Add tests that App IV whole sheets cannot pass without readable
  panel/focused-card/high-resolution crop coverage or structured translations.
- [x] T062 Add tests that `app3-body-posture-source-card` has itemized label
  translations.
- [x] T063 Add tests preserving protected-image rules against translated signs,
  retouched photos, masked maps, broad plates, opaque rectangles, or Russian
  in-image overlays on protected pixels.
- [x] T064 Add renderer tests or static checks for reusable translation lists,
  `lang="es"`, and preserved data attributes.
- [x] T065 Keep existing source-fidelity, visual-completeness, content, and e2e
  tests passing.

## Playwright / Visual Evidence

- [x] T066 Add or update focused Playwright checks for one dense App IV group
  after correction.
- [x] T067 Add focused Playwright checks for `app3-body-posture-source-card`.
- [x] T068 Add focused Playwright checks for one `ch2-required-documents`
  document example.
- [x] T069 Add focused Playwright checks for `app2-hospital-map-source-card`.
- [x] T070 Add focused Playwright checks for one quote/photo example from
  `ch4-distractions` or `ch5-anticipatory-efficient-driving`.
- [x] T071 In Playwright evidence, assert image visibility, no browser upscaling,
  nearby translation DOM visibility/selectability, `lang="es"` where
  applicable, no mobile document-level overflow, and contained scrolling for
  natural-width fixed images.
- [x] T072 Save representative desktop/mobile screenshots and reference them in
  committed evidence.

## Durable Docs

- [x] T073 Update
  `docs_project/project/frontend/manual-conversion-guidelines.md` only if the
  implementation adds or clarifies reusable manual image readability or
  translation rules.
- [x] T074 If docs are updated, keep them durable and concise; avoid transient
  process notes and unrelated documentation churn.

## Local Verification

- [x] T075 Run `node scripts/check-feature-memory.mjs --worktree`.
- [x] T076 Run the new audit in write mode when evidence intentionally changes.
- [x] T077 Run `pnpm run validate:manual-guide`.
- [x] T078 Run `pnpm run validate:content`.
- [x] T079 Run focused tests for the new audit and touched renderer/data paths.
- [x] T080 Run `pnpm exec tsc --noEmit`.
- [x] T081 Run `pnpm run test`.
- [x] T082 Run `pnpm run build`.
- [x] T083 Run focused Playwright checks.
- [x] T084 Run `pnpm run test:e2e` if feasible.
- [x] T085 Run `git diff --check`.
- [x] T086 Run `pnpm run preflight` before PR readiness if feasible; otherwise
  record the blocker and substitute evidence.
- [x] T087 Record exact command results and evidence paths in this file.

## Review / PR / Final Validation Prep

- [x] T088 Implementation Agent stages, commits, pushes, and opens or updates
  one ready PR only if assigned by Orchestrator.
- [ ] T089 Review Agent checks whole-guide coverage, validator strength,
  protected-image preservation, readability evidence, Russian DOM translation
  completeness, UI responsiveness, tests, and process-memory compliance.
- [x] T090 Implementation Agent records and resolves review findings only
  through Orchestrator assignment.
- [ ] T091 Orchestrator routes any Implementation Agent feedback to Architect
  for task/ticket/not-needed disposition before final validation.
- [ ] T092 Orchestrator invokes final Architect validation before final Analyst
  validation after implementation, checks, review, and feedback disposition are
  complete.
- [ ] T093 Orchestrator invokes final Analyst validation only after Architect
  passes and records the required final-validation markers.
- [ ] T094 Orchestrator verifies required checks, current PR head, conflicts,
  review conversations, acceptance evidence, process memory, and final guards
  before completion/finalization/merge.

## Implementation Evidence Log

Implementation Agent should append concise evidence here during implementation.

- Implementation Agent assignment confirmed in
  `/Users/chap/devel/cabadrive-worktrees/035-manual-image-readability-translations`
  on branch `codex/035-manual-image-readability-translations`; assigned PR
  slice is this single branch. Verified base from Orchestrator:
  `origin/main` at `74c104f6d3c73a2586000dddd85953ca31586fb7`.
  Initial `git status --short --branch` before edits:
  `## codex/035-manual-image-readability-translations...origin/main` plus
  untracked `specs/035-manual-image-readability-translations/` process memory.
  Parallel-work warning acknowledged; no sibling worktrees, branches, commits,
  PRs, or unrelated dirty diffs were touched.
- Required feature memory read before editing: `feature-request.md`, `spec.md`,
  `plan.md`, and `tasks.md`. Required repository onboarding/docs were also
  read in the requested order.
- Added deterministic audit script:
  `scripts/manual-guide-image-readability-translations-audit.mjs`. It uses the
  TypeScript compiler AST evaluator to load section data, enumerates all
  image-rendering block kinds found in the manual guide, records image
  dimensions and SHA-256, validates visible-Spanish exception metadata,
  structured Russian support, source-image-card generic-`bodyRu` gaps,
  no-upscale/readability disposition, required example coverage, and stale
  evidence.
- Added committed evidence:
  `content/validation/manual-guide-image-readability-translations.evidence.json`.
  Current refreshed counts: `50` implemented sections, `84` rendered image
  references, `54` visible-Spanish images, `54` visible-Spanish images with
  structured Russian support, `54` protected source-as-is visible-Spanish
  images, `0` accepted coverage exceptions, `0` validation findings. User
  baseline `50/82/54/33` is recorded in the evidence; current image references
  are `84` because the audit counts every rendered image-bearing block shape,
  including multi-image diagrams.
- Wired the new audit into `package.json` scripts:
  `validate:manual-guide` and `validate:content`.
- Runtime rendering: generalized the existing
  `.manual-source-image-term-translations` pattern into
  `ManualImageTermTranslations`, preserving `termEs`/`translationRu`, rendering
  Spanish terms with `lang="es"`, and reusing it for `source-image-cards` plus
  compatible non-source-card shapes (`bicycle-signage`,
  `bicycle-distance.examples`, and `shared-trip-closing`) without adding
  card-id-specific CSS.
- Content coverage added or completed for required groups:
  App IV warning, informational, temporary, horizontal, traffic-light, and
  regulatory sheets; `app3-body-posture-source-card`; app1 tire/blind-spot,
  app2 headrest, app3 seatbelt; `app2-hospital-map-source-card`;
  `ch2-required-documents` DNI/license/beginner/cedulas/VTV/RVA cards;
  `ch4-distractions` quote photo; `ch5-anticipatory-efficient-driving` quote
  photo; and `ch1-shared-trip` quote image.
- Protected pixels decision: no new raster assets were added and no protected
  official pixels were translated, retouched, masked, inpainted, overlaid, or
  replaced. Fixes are DOM translations/captions/glossaries plus validation
  evidence against existing source-as-is assets.
- ch1-bicycle review-fix decision: Review Agent correctly rejected the earlier
  grouped `noticeItemsRu`/`textRu` coverage because it had no auditable Spanish
  source terms. The fix now adds real `termTranslations` to
  `src/data/manual-sections/ch1-bicycle.ts` for the page-32 sign sheet and the
  page-34 safe/unsafe distance panels. `BicycleDistanceBlockView` now exposes
  `data-distance-id` so Playwright and audit runtime selectors can target each
  panel. The ch1 legacy source-fidelity baseline remains legacy, but its
  `ch1-bicycle` state fingerprint in
  `content/validation/manual-guide-source-fidelity.evidence.json` was updated
  to the stable checker hash
  `ad06413f4e249cedfcd5f069f4f38fda3c566b04384d6686fabb692a968fa5e5`
  because the section module bytes intentionally changed; no protected image
  asset hashes or implementation evidence fingerprints changed.
- Tests added:
  `tests/manual-guide-image-readability-translations-audit.test.mjs` for
  write/check/stale/malformed evidence behavior, current whole-guide counts,
  required-example coverage, and a fixture where a visible-Spanish multi-label
  `source-image-card` covered only by `bodyRu` fails. Updated
  `tests/e2e/app.spec.ts` focused manual source-image test to assert
  translation DOM visibility, `dt lang="es"`, non-empty `dd` entries, required
  App IV groups, body posture, hospital map, document examples, app2 headrest,
  app3 seatbelt, and quote/photo examples.
- Commands already run:
  `pnpm install --frozen-lockfile` passed; lockfile unchanged.
  `node scripts/manual-guide-image-readability-translations-audit.mjs --write`
  passed and refreshed evidence.
  `node scripts/manual-guide-image-readability-translations-audit.mjs` passed.
  `node --test tests/manual-guide-image-readability-translations-audit.test.mjs`
  passed: 3 tests, 0 failures.
  `pnpm exec tsc --noEmit` passed.
  `pnpm run validate:manual-guide` passed after the ch1-bicycle revert and
  audit grouped-coverage adjustment.
  `pnpm run build` passed; it also ran `validate:content`, asset sync, Vite
  build, and service-worker generation. Vite emitted existing large-chunk
  warnings only.
  First focused Playwright attempt failed before browser startup because
  `dist` did not exist for `vite preview`; after `pnpm run build`,
  `pnpm exec playwright test tests/e2e/app.spec.ts -g "Manual guide full-width source image cards stay readable and avoid upscaling" --project=chromium`
  passed: 1 test, 0 failures.
  `node scripts/check-feature-memory.mjs --worktree` passed.
  `pnpm run validate:content` passed.
  `pnpm run test` passed: 428 tests, 0 failures.
  `git diff --check` passed.
  `pnpm run test:e2e` passed: 82 tests, 0 failures.
  `pnpm run preflight` passed: feature-memory gate, repository baseline,
  `validate:content`, `test` (428 tests, 0 failures), `build`, and nested
  `test:e2e` (82 tests, 0 failures). Build emitted existing large-chunk
  warnings only.
- Publication evidence: staged assigned slice, committed implementation as
  `fa5e221` (`Add manual image readability translation audit`), pushed branch
  `codex/035-manual-image-readability-translations` to origin, and opened ready
  PR `#201`: `https://github.com/cucumberfalse/cabadrive/pull/201`.
- Review fixes assignment for PR `#201` confirmed in the same worktree/branch
  on current review head
  `fb6db697a58f90ffda464e0e0e18e74ac898dbb9`. Initial review-fix status was
  `## codex/035-manual-image-readability-translations...origin/codex/035-manual-image-readability-translations`.
  Parallel-work preservation warning was acknowledged again; no sibling
  worktrees, branches, commits, PRs, or unrelated dirty diffs were touched.
- Review finding disposition:
  `scripts/manual-guide-image-readability-translations-audit.mjs` no longer
  treats `minDisplayWidthPx`/contained scrolling as sufficient readability
  evidence. Every visible-Spanish intended-readable image now records
  `textReadabilityEvidence`; manual-reviewed records include text-height and
  body-text parity fields, while dense App IV sheets use the explicit
  `app4-dense-official-sheet-source-limited-dom-glossary` group with attempted
  alternatives and structured DOM translation requirements. The audit fails on
  missing text readability evidence and incomplete representative group
  coverage.
- Review finding disposition:
  `ch1-bicycle` no longer passes through generic grouped prose with null
  Spanish terms. The audit removed the bicycle `noticeItemsRu`/`textRu`
  fallback, requires itemized `.manual-source-image-term-translations` entries
  to have non-empty Spanish `termEs`, and the section data now includes 13 sign
  pairs plus 2 safe-distance pairs and 1 unsafe-distance pair rendered next to
  the images.
- Review-fix evidence refresh:
  `content/validation/manual-guide-image-readability-translations.evidence.json`
  now records `acceptedCoverageExceptions: 16`, `readabilityEvidenceGroups`,
  per-record `textReadabilityEvidence`, App IV source-limited exceptions with
  attempted alternatives, and ch1-bicycle DOM selectors/itemized term counts.
- Review-fix tests added:
  `tests/manual-guide-image-readability-translations-audit.test.mjs` now has
  direct fixture coverage for the two loopholes: a visible-Spanish
  `source-image-card` with `minDisplayWidthPx` and translations but no text
  readability evidence fails, and a `bicycle-signage` image with an empty
  Spanish term fails. `tests/e2e/app.spec.ts` now asserts ch1-bicycle sign and
  distance `termTranslations` are visible in DOM with `lang="es"`.
- Review-fix command results so far:
  `node scripts/manual-guide-image-readability-translations-audit.mjs --write`
  passed; `node --test tests/manual-guide-image-readability-translations-audit.test.mjs`
  passed: 5 tests, 0 failures; first review-fix
  `pnpm run validate:manual-guide` failed on stale `ch1-bicycle` legacy
  source-fidelity state fingerprint, then the stable fingerprint was updated;
  rerun `pnpm run validate:manual-guide` passed; mid-loop
  `node scripts/check-feature-memory.mjs --worktree` failed because this
  `tasks.md` review-fix update had not been written yet; `node scripts/manual-guide-image-readability-translations-audit.mjs`
  passed; `pnpm exec tsc --noEmit` passed; `pnpm run validate:content` passed;
  `pnpm run test` passed: 430 tests, 0 failures.
- Review-fix final verification:
  `pnpm run build` passed, including nested `validate:content`, asset sync,
  Vite build, and service-worker generation; Vite emitted the existing
  large-chunk warnings only. Focused Playwright command
  `pnpm exec playwright test tests/e2e/app.spec.ts -g "Manual guide full-width source image cards stay readable and avoid upscaling" --project=chromium`
  passed: 1 test, 0 failures. `git diff --check` passed.
  `node scripts/check-feature-memory.mjs --worktree` passed after this
  process-memory update. `pnpm run preflight` passed end to end: feature-memory
  gate, repository baseline, `validate:content`, `test` (430 tests, 0
  failures), `build`, nested `test:e2e`, and full Playwright suite (82 tests,
  0 failures). Build steps emitted the existing large-chunk warnings only.
- Representative evidence paths:
  `content/validation/manual-guide-image-readability-translations.evidence.json`
  references each section's existing source and Russian screenshot evidence,
  including App IV, posture, safety, hospital map, document, bicycle, and
  quote/photo groups. Focused Playwright also saved run-output screenshots for
  `manual-source-translations-app3-driving-factors-*` and
  `manual-source-translations-app4-signs-warning-*`.
- Second review fixes assignment for PR `#201` confirmed in the same
  worktree/branch on current review head
  `2377f739318bfeedac47e4d10a4233c73e88ef75`. Initial second-review status was
  `## codex/035-manual-image-readability-translations...origin/codex/035-manual-image-readability-translations`
  on branch `codex/035-manual-image-readability-translations`, with scoped
  dirty files only in manual image readability audit/evidence, source-fidelity
  evidence, manual guide data/model/renderer, e2e tests, focused audit tests,
  and this feature memory. Parallel-work preservation warning was acknowledged
  again; no sibling worktrees, branches, commits, PRs, or unrelated dirty diffs
  were touched.
- Second review P1 disposition, App IV source-limited exceptions:
  `scripts/manual-guide-image-readability-translations-audit.mjs` now requires
  concrete official-source alternative evidence for each dense App IV
  source-limited record. The evidence records exact existing paths and hashes
  for the full official page asset, retained full-sheet source crop, current
  tight crop asset, source screenshot evidence, and any focused panel assets;
  it also records the evaluated alternatives: official page/source asset
  review, current crop-vs-source-region delta, split/panel/card strategy review,
  and the contained natural-width DOM glossary decision. The audit fails
  `source-limited-with-structured-dom-support` records that lack this review,
  reference missing assets, use a non-tight crop delta, or omit the required
  exact evidence paths.
- Second review P1 disposition, non-source-card `termEs: null` loophole:
  structured Russian support for every learner-relevant visible-Spanish record
  now requires a non-empty Spanish source term/phrase globally, not only for
  source-image cards or `ch1-bicycle`. Added real `termTranslations` support to
  the `pedestrian-infrastructure`, `priority-area-map`, and
  `public-transport-infrastructure` block models and renderers, and populated
  itemized Spanish/Russian pairs for `ch1-pedestrian-priority` and
  `ch1-public-transport-system`, including priority streets, pedestrian
  streets, wayfinding, school routes, map labels, restriction signs, zone 30,
  bus lanes, and Metrobus labels. These render through
  `.manual-source-image-term-translations` near the affected images.
- Second review tests added:
  `tests/manual-guide-image-readability-translations-audit.test.mjs` now has
  direct regression coverage for an App IV source-limited exception without
  concrete crop proof and a visible-Spanish non-source-card record with only
  generic Russian prose/null Spanish terms. `tests/e2e/app.spec.ts` now asserts
  visible DOM translations for representative pedestrian priority, priority
  map, exclusive bus lane, and Metrobus non-source-card records.
- Second review evidence refresh:
  `content/validation/manual-guide-image-readability-translations.evidence.json`
  was refreshed in write mode. Sanity checks after refresh showed `0`
  learner-relevant structured support items with missing `termEs`, `16`
  accepted App IV source-limited exceptions with concrete
  `officialSourceAlternativeReview`, and representative DOM selectors/item
  counts for `priority-street` (`5`), `priority-areas-map` (`9`),
  `exclusive-lanes` (`4`), and `metrobus` (`5`).
- Second review source-fidelity note:
  first second-review `pnpm run validate:manual-guide` failed because the
  intentional `ch1-pedestrian-priority` section-module data change made the
  legacy source-fidelity state fingerprint stale. The fingerprint was
  recomputed with the same stable checker inputs used by
  `scripts/manual-guide-source-fidelity.mjs` and updated to
  `131c399fc6313e254c149c9cbe247685a9657029dc5032422931c63fc64d1571`.
  No protected image asset bytes or implementation evidence fingerprints
  changed.
- Second review command results so far:
  `node scripts/manual-guide-image-readability-translations-audit.mjs --write`
  passed and refreshed evidence; `node scripts/manual-guide-image-readability-translations-audit.mjs`
  passed; `node --test tests/manual-guide-image-readability-translations-audit.test.mjs`
  passed: 7 tests, 0 failures; rerun `pnpm run validate:manual-guide` passed
  after the `ch1-pedestrian-priority` legacy fingerprint update;
  `pnpm run validate:content` passed; `pnpm exec tsc --noEmit` passed;
  `pnpm run test` passed: 432 tests, 0 failures; `pnpm run build` passed,
  including nested `validate:content`, asset sync, Vite build, and
  service-worker generation. Vite emitted existing large-chunk warnings only.
  Focused Playwright command
  `pnpm exec playwright test tests/e2e/app.spec.ts -g "Manual guide full-width source image cards stay readable and avoid upscaling" --project=chromium`
  passed: 1 test, 0 failures.
- Second review preflight dead end and fix:
  first second-review `pnpm run preflight` passed feature-memory, repo
  baseline, `validate:content`, `test` (432 tests, 0 failures), nested build,
  and 80 of 82 Playwright tests, then failed the existing
  `Manual guide exposes implemented Chapter 1, Chapter 2, Chapter 3, Chapter
  4, Chapter 5, and Appendix III section pages` test on desktop/mobile. The
  cause was an old Spanish-residue assertion forbidding `Prioridad peatonal`
  anywhere in the pedestrian section; that phrase is now intentionally present
  inside structured `.manual-source-image-term-translations` DOM. The test now
  asserts that a translation block containing `Prioridad peatonal` exists, then
  removes translation blocks before checking the rest of the section has no
  stray `Prioridad peatonal`. Focused rerun
  `pnpm exec playwright test tests/e2e/app.spec.ts -g "Manual guide exposes implemented Chapter 1, Chapter 2, Chapter 3, Chapter 4, Chapter 5, and Appendix III section pages"`
  passed: 2 tests, 0 failures.
- Second review final verification:
  `git diff --check` passed; `node scripts/check-feature-memory.mjs --worktree`
  passed after the second-review process-memory update. Second full
  `pnpm run preflight` passed end to end: feature-memory gate, repository
  baseline, `validate:content`, `test` (432 tests, 0 failures), `build`,
  nested `test:e2e`, and full Playwright suite (82 tests, 0 failures). Build
  steps emitted the existing large-chunk warnings only.

## Implementation Feedback For Architect Disposition

Implementation Agent should append feedback items here. Orchestrator must route
each item to Architect for disposition before final validation.

- None requiring Architect disposition at this time. The ch1-bicycle legacy
  source-fidelity schema limitation was resolved inside scope by preserving the
  existing file and validating its already-rendered grouped Russian DOM
  coverage rather than requesting a new product decision.
