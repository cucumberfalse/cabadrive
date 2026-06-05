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
- [x] T078 Review Agent checks source extraction quality, whole-manual
  inventory completeness, useful-content bbox evidence, protected-image
  preservation, no-upscale proof, mobile layout, feature `032` regression
  safety, and process-memory compliance. Latest AI Review on PR `#200` current
  head `860a4ef4ab66a28b066625d4ffe52f526cce2d5b` passed at
  `2026-06-05T21:50:48Z`.
- [x] T079 Implementation Agent records and resolves review findings only
  through Orchestrator assignment. Same-cycle P1/P2 and CI blockers have
  Architect dispositions and implementation evidence below.
- [x] T080 Orchestrator invokes final Architect validation before final Analyst
  validation after implementation, checks, review, and feedback disposition are
  complete. Final Architect validation is recorded at the end of this file.

## Same-Cycle Acceptance Clarification Follow-Up

- [x] T081 Architect receives and dispositions user clarification:
  `проверь весь документ, изображения должны быть крупными; один из ориенторов
  - текст на изображениях, размер минимального шрифта должен быть визуально не
  меньше, чем текст документа`.
- [x] T082 Architect classifies the clarification as same-cycle acceptance
  refinement for feature `034`, not a new feature request and not a reason to
  edit `feature-request.md`.
- [x] T083 Architect records that current PR `#200` crop evidence may be
  insufficient for the clarified criterion because Appendix IV crop widths are
  only about `664-757px` and source labels/captions may still render below
  body text size.
- [x] T084 Implementation Agent updates the whole-manual inventory with
  text-readability relevance for every image containing intended-readable text:
  `none`, `supporting`, `required`, or an equivalent local enum.
- [x] T085 Implementation Agent records a nearby document body-text baseline
  for manual comparison, preferably measured from computed runtime CSS for the
  same section/card context.
- [x] T086 Implementation Agent measures or manually inspects the smallest
  intended-readable text in representative source images and records the text
  sample, viewport, rendered image size, estimated/observed text height, body
  text baseline, evidence path, and pass/fail disposition.
- [x] T087 Implementation Agent must cover Appendix IV pages `185-200` for
  embedded sign/marking/signal labels and captions.
- [x] T088 Implementation Agent must cover representative non-Appendix images
  with embedded readable text, including source-document examples and
  maps/diagrams where present.
- [x] T089 For any image whose embedded intended-readable text is visually
  smaller than nearby document body text, Implementation Agent first attempts a
  better official source or source-faithful strategy instead of silently
  accepting the current crop.
- [x] T090 Better-source/strategy attempts must consider higher-quality
  official source assets retained in `content/official-documents/`, higher-DPI
  source extraction, and source-faithful split/sub-crops or multi-panel
  presentation when a full sheet cannot meet readability without upscaling.
- [x] T091 If no official source/strategy can meet the text-size criterion
  without pixelated upscaling or protected-pixel edits, Implementation Agent
  records a `source-limited-exception` with attempted alternatives and routes it
  to Orchestrator for user disposition before review/final validation.
- [x] T092 Implementation Agent updates content/static tests or validation
  evidence so images with intended-readable embedded text cannot pass with only
  useful bbox ratio evidence.
- [x] T093 Implementation Agent updates Playwright or equivalent browser
  evidence to include desktop/mobile screenshots that show corrected images and
  nearby body text together for readability comparison.
- [x] T094 Implementation Agent records exact follow-up command results in this
  `tasks.md` and reruns focused tests, `pnpm run validate:manual-guide`,
  `pnpm run validate:content`, `pnpm exec tsc --noEmit`, `pnpm run test`,
  focused Playwright, `git diff --check`, and preflight if feasible.
- [x] T095 PR `#200` must not proceed to Review Agent/final validation as
  complete until T084-T094 are implemented or Orchestrator records a
  user-disposition blocker for accepted source-limited exceptions.

## Latest Sign And Map Readability Refinement

- [x] T096 Architect receives and dispositions latest user clarification:
  whole Appendix IV sheets are not enough when signs/captions remain tiny;
  signs such as `NO AVANZAR` should be extracted/rendered from the official
  PDF/original in maximum practical quality; external sign captions may be
  translated into Russian only outside protected sign pixels; text/pixels
  inside sign bodies, supplementary plates/tablets, and placards remain
  original; the hospital map must be best-quality official original with
  readable labels and no internal translation/modification.
- [x] T097 Architect records this as same-cycle acceptance refinement for
  feature `034`, not a new feature request and not a reason to edit
  `feature-request.md`.
- [x] T098 Architect disposes the interrupted Swift direct PDF source-region
  helper direction: useful supporting machinery to preserve/adapt, but
  insufficient by itself if it only proves whole-sheet source limitation. It
  must be adapted or supplemented for individual sign/sign-row fragments,
  hospital-map source-region extraction, and maximum-practical official-source
  quality probes.
- [x] T099 Implementation Agent must not treat current Appendix IV
  `source-limited-exception` evidence as final completion. Final validation is
  blocked until latest sign-fragment/map requirements are implemented and
  evidenced, or a narrow evidence-backed blocker is routed to
  Orchestrator/human after exhausting official-original extraction options.
- [x] T100 Implementation Agent must classify Appendix IV sign text/pixels into
  protected sign body/plate/tablet/placard pixels versus external source
  captions/labels. Ambiguous text is protected until evidence proves it is
  external.
- [x] T101 Implementation Agent must extract/render individual signs, sign
  rows, or equivalent official source fragments at maximum practical quality
  from the canonical official PDF/original or better retained official source.
  Whole-sheet overview may remain supplementary but cannot be the only
  user-facing readable sign presentation.
- [x] T102 Implementation Agent must make representative signs, including a
  `NO AVANZAR`-style regulatory sign, visually large enough to inspect with
  no pixelated browser upscaling.
- [x] T103 Implementation Agent may translate external captions/labels under or
  near signs into Russian DOM/SVG text only when source-region evidence proves
  those captions are outside the protected sign/plate visual.
- [x] T104 Implementation Agent must preserve all text/pixels inside sign
  bodies, supplementary plates/tablets, and official sign placards exactly as
  source pixels: no translation, redraw, cleanup, mask, retouch, inpaint,
  replacement, or relabeling.
- [x] T105 Implementation Agent must revisit `app2-hospital-map-source-card`
  and extract/use the best available official original map source so all map
  labels are readable with visual font no smaller than nearby document body
  text.
- [x] T106 Implementation Agent must not translate, relabel, clean, redraw,
  mask, retouch, or otherwise modify anything inside the hospital map image.
- [x] T107 Implementation Agent must update data/evidence/tests to record
  per-sign/row/hospital-map source path, source region, extraction scale/probe
  method, output dimensions, hashes, runtime display size, no-upscale proof,
  protected-pixel classification, and translated-external-caption boundaries.
- [x] T108 Implementation Agent must update Playwright or equivalent visual
  evidence with desktop/mobile screenshots for individual Appendix IV signs and
  the hospital map, including nearby body text comparison.
- [x] T109 Implementation Agent must update content/static tests so protected
  sign interiors and map internals cannot be translated/modified, while
  external sign captions may be translated only as separate DOM/SVG text.
- [x] T110 If official original extraction still cannot meet readability for a
  user-highlighted visual, Implementation Agent must record a narrow blocker
  with all official-source attempts and route it to Orchestrator/human. Broad
  "source-limited" completion is no longer acceptable for Appendix IV signs or
  the hospital map. Final disposition: no same-cycle readability blocker
  remains for the user-highlighted Appendix IV signs or hospital map; the
  current head uses large official Anexo L regulatory panels plus the focused
  `NO AVANZAR` card, and the hospital map has best-official direct PDF region
  crop evidence.
- [x] T111 Implementation Agent reruns focused content tests,
  `pnpm run validate:manual-guide`, `pnpm run validate:content`,
  `pnpm exec tsc --noEmit`, focused Playwright, `git diff --check`, and full
  preflight if feasible, then records exact evidence in this `tasks.md`.

## Latest Runtime Copy Cleanup Refinement

- [x] T112 Architect receives and dispositions latest user clarification:
  image/content size should preserve the official original's readability
  relationship to document text, and runtime guide copy must be audited for
  learner-facing provenance/service wording such as `источник`,
  `Визуал источника`, `из источника`, `исходный фрагмент`,
  `рабочий фрагмент`, `Главный вывод источника`, and similar.
- [x] T113 Architect records this as same-cycle acceptance refinement for
  feature `034`, not a new feature request and not a reason to edit
  `feature-request.md`.
- [x] T114 Implementation Agent must audit the whole runtime `Руководство`
  guide for learner-facing Russian strings containing source/provenance/meta
  wording, including the explicit user examples:
  `Визуал источника: правильный ремень`,
  `Визуал источника: положение подголовника`,
  `Фотографии сохранены как исходный фрагмент...`, and
  `Главный вывод источника`.
- [x] T115 Implementation Agent must distinguish learner-visible strings from
  internal technical provenance/evidence fields. Internal fields such as
  `sourceTextEs`, `sourcePage`, `sourceRegion`, asset paths, validation
  evidence, specs, and process memory may retain technical source wording.
- [x] T116 Implementation Agent must rewrite visual-card titles, card bodies,
  captions, `visualNotes` that render to learners, `noteRu`, and similar
  runtime copy into normal adapted Russian learning language.
- [x] T117 Implementation Agent must not overlay rewritten copy onto protected
  maps/signs/photos/diagrams or edit protected pixels. This cleanup is DOM/text
  copy only unless prior feature rules explicitly allow a separate overlay.
- [x] T118 Implementation Agent must create or update tests/audit tooling so
  banned learner-facing provenance wording fails in future. The audit should
  scan runtime guide strings and include an explicit allowlist only for genuine
  legal/source citation contexts.
- [x] T119 Implementation Agent must record grep/audit evidence showing all
  runtime guide occurrences of `источник`-family and `исходн*`/`рабочий
  фрагмент`-style wording are removed, rewritten, or allowlisted with rationale.
- [x] T120 Implementation Agent should provide DOM or screenshot evidence for
  representative rewritten visual cards where useful, especially the examples
  named by the user.
- [x] T121 Implementation Agent must keep the earlier protected-image rules and
  latest image-quality work intact while doing the copy cleanup.
- [x] T122 Final validation remains blocked until both the latest sign/map image
  quality work and this runtime copy audit/rewrite are implemented and
  evidenced. Final disposition: sign/map image-quality work and the runtime
  learner-facing copy audit/rewrite are implemented, evidenced, and covered by
  current passing checks.

## Consolidated 2026-06-05 Requirements Gate

- [x] T123 Architect receives urgent Orchestrator instruction to consolidate
  all latest user requirements in feature memory so context compaction does not
  lose them.
- [x] T124 Architect records consolidated requirements in `spec.md` as the
  canonical same-cycle contract for feature `034`, including whole-document
  visual completeness, image quality/scale, protected-image fidelity, separate
  term translations, Appendix IV signs, hospital map, blind-spot visual,
  learner-facing copy cleanup, evidence/tests, and completion gate.
- [x] T125 Architect records latest concrete visual candidate: the current
  runtime image/headline `СКОЛЬКО МЕСТА НУЖНО 50 ЛЮДЯМ, ЧТОБЫ
  ПЕРЕДВИГАТЬСЯ?` with labels `НА АВТОБУСЕ`, `ПЕШКОМ`,
  `НА ВЕЛОСИПЕДЕ`, and `НА АВТОМОБИЛЕ` appears low-quality/pixelated or
  reconstructed and must be replaced by the official original image with
  separate Russian translations outside protected pixels.
- [x] T126 Implementation Agent must perform a whole-document visual
  completeness audit comparing official PDF/manual visual regions to runtime
  guide visual blocks/assets, not only enumerating images already present in
  runtime data. Final evidence is
  `content/validation/manual-guide-visual-completeness.evidence.json`.
- [x] T127 Implementation Agent must disposition every learner-meaningful PDF
  visual as present, added, duplicate-covered, explicitly omitted with
  rationale, or narrow missing-image blocker. Learner-meaningful means any
  image/diagram/photo/infographic/map/sign sheet/chart/icon that conveys a
  rule, risk, classification, comparison, example, label, or visual term.
  Final disposition evidence records user examples and residual partial scopes
  without hiding them.
- [x] T128 Implementation Agent must locate, export from the official
  PDF/original, and insert or narrowly block the required candidate visuals:
  tire manufacturing/date and tread-life visual (`Fecha de Fabricación`,
  `Vida útil de los Neumáticos`), blind-spot visual
  (`¿A qué se denomina punto ciego?`), `Matafuegos`,
  `Chaleco reflectivo`, hospital map, Appendix IV signs, headrest diagrams,
  and the public-space `50` people mobility visual.
- [x] T129 Implementation Agent must export images at best available faithful
  official quality, remove excessive blank/white margins, avoid bitmap
  stretching, cap runtime display at natural dimensions, and preserve the
  original image-to-document-text scale relationship. For `Matafuegos`, record
  the extinguisher visual-height comparison against the user's approximate
  `15` body-text-line anchor.
- [x] T130 Implementation Agent must preserve protected image pixels for maps,
  blind-spot, headrest, tire, extinguisher, vest, public-space, signs, photos,
  diagrams, and similar visuals: no redraw, vector recreation, retouching,
  recoloring, masking, inpainting, cleanup, replacement, or translation inside
  the image unless a prior accepted feature explicitly allowed a specific
  overlay/cleanup.
- [x] T131 Implementation Agent must keep visuals with Spanish terms as
  original protected images and add Russian translations/glossaries separately
  below or near the image as selectable DOM text. This includes the headrest
  terms `Altura apoyacabeza`, `Distancia del apoyacabeza`, `Bueno`,
  `Aceptable`, `Regular`, `Malo`, and `Botón de desbloqueo`, and similar
  term-bearing visuals.
- [x] T132 Implementation Agent must replace the public-space mobility visual
  with the official original image, keep image internals unchanged, provide
  separate Russian translations for terms such as by bus, walking, bicycle, and
  car, extract at high faithful quality, avoid extra blank margins, and display
  it at the original-like scale relative to body text.
- [x] T133 Implementation Agent must continue the Appendix IV sign follow-up:
  whole sign sheets are insufficient when signs/captions remain tiny; use large
  individual signs, sign rows, or source-faithful panels where possible, and
  translate only proven external catalog captions such as `NO AVANZAR`.
  2026-06-05 regulatory-panel slice: broad regulatory readability now uses
  large protected official Anexo L panels `01`-`04` before the CABA overview
  sheets, keeps the focused `NO AVANZAR` card, and keeps CABA pages `185`/`186`
  as overview/local variants.
- [x] T134 Implementation Agent must continue the hospital-map follow-up:
  re-extract or verify `app2-hospital-map-source-card` from the best official
  original source so labels are readable at body-text scale, without translating
  or modifying the map image.
- [x] T135 Implementation Agent must insert/display the blind-spot visual
  as-is from the official original; it should be full-width/tight like the
  original and not a small centered image inside a large blank area.
- [x] T136 Implementation Agent must audit the whole learner-facing runtime
  guide copy for provenance/service wording (`источник`, `Визуал источника`,
  `из источника`, `исходный фрагмент`, `рабочий фрагмент`,
  `Главный вывод источника`, and similar) and rewrite visible titles, bodies,
  captions, and notes as normal adapted Russian learning copy. Internal
  evidence/spec/provenance fields may retain technical `source` wording.
- [x] T137 Implementation Agent must preserve the interrupted Swift direct PDF
  source-region helper work and adapt it where useful, but treat it only as
  supporting machinery; it is insufficient unless it supports the actual
  completeness/quality/scale evidence required here.
- [x] T138 Implementation Agent must record evidence listing present, added,
  missing, duplicate-covered, explicitly omitted, and blocker visuals with
  source page/region, extraction method/scale, asset dimensions, hash where
  practical, runtime display size, no-upscale proof, protected-image policy,
  and screenshots.
  Partial 2026-06-05 representative slice: evidence for `NO AVANZAR` records
  source path, crop region, method, dimensions, hash, runtime display bounds,
  and protected/external-caption boundary.
  2026-06-05 regulatory-panel slice: evidence for Anexo L panels `01`-`04`
  records official source paths, byte-identical runtime copies, dimensions,
  SHA-256 hashes, no-upscale/min-width display metadata, protected-image
  boundary, separate Russian DOM translations, CABA overview disposition, and
  the reason panel `05` is not selected for regulatory scope.
  Partial 2026-06-05 blind-spot slice: evidence for
  `app1-blind-spot-source-card` records printed/manual page `108`, PDF/render
  page `109`, direct-PDF crop and final trim coordinates, `546x440`
  dimensions, SHA-256
  `b5457a99da41bbb3f46985072e39641c20ee408844bd34f83051eefa55e2ed35`,
  runtime no-upscale display bounds, source-limited PDF raster disposition, and
  protected-image policy.
- [x] T139 Implementation Agent must add or update tests/audit scripts so
  missing meaningful visuals, tiny image displays, excessive blank margins,
  protected-image edits, missing separate translations, and learner-facing
  source/provenance wording regressions fail.
  Partial 2026-06-05 representative slice: tests now assert the focused
  `NO AVANZAR` asset/hash/no-upscale policy, separate term translation, and
  Playwright readability relative to the overview sheet.
  2026-06-05 regulatory-panel slice: tests now assert all four Anexo L panel
  assets are byte-identical official copies, recorded in registry/evidence,
  protected with official-sign exceptions, displayed without upscaling, and
  paired with separate DOM translations.
  Partial 2026-06-05 blind-spot slice: tests and audits now assert the
  blind-spot asset/hash/no-upscale policy, source-as-is visible Spanish
  exception, page `108`/PDF page `109` offset, separate Russian DOM term
  translations, absent learner-facing provenance wording, and remaining tire /
  broader Appendix IV pending scope.
- [x] T140 Implementation Agent must run and record focused content tests,
  `pnpm run validate:manual-guide`, `pnpm run validate:content`,
  `pnpm exec tsc --noEmit`, focused Playwright screenshots/checks for
  representative required visuals, `git diff --check`, and full
  `pnpm run preflight` if feasible.
  Partial 2026-06-05 representative slice: see `NO AVANZAR Representative
  Focused Crop Evidence - 2026-06-05` for that slice's command evidence. See
  `Appendix IV Anexo Regulatory Panel Evidence - 2026-06-05` below for the
  latest regulatory-panel command evidence.
- [x] T141 PR `#200` final validation remains blocked until T126-T140 and the
  explicit user-example checklist below are implemented and evidenced, or every
  remaining gap is a narrow evidence-backed blocker routed to
  Orchestrator/human. Final Architect validation accepts the explicitly exposed
  App2/App3 equipment residual as non-blocking residual scope for this PR
  because the user-called-out `Matafuegos`/`Chaleco reflectivo` visuals are
  restored from the official App I source and the residual is not hidden or
  claimed complete.
- [x] T142 Architect records the explicit `Context Examples From User` section
  in `spec.md`, listing the concrete user screenshot/callout examples, why each
  matters, the expected implementation outcome, and the review/evidence hook.
- [x] T143 Implementation Agent must treat `spec.md` section
  `Context Examples From User` as a named evidence checklist. For each listed
  example, record one of: implemented with evidence, duplicate-covered with the
  covering block named, explicitly omitted with rationale, or narrow blocker
  routed to Orchestrator/human.
  Partial 2026-06-05 representative slice: Appendix IV regulatory signs /
  `NO AVANZAR` was recorded as `implemented-representative`; later
  regulatory-panel evidence supersedes that status with
  `implemented-regulatory-panels-with-caba-overview`.
  Partial 2026-06-05 blind-spot slice: blind-spot visual is recorded as
  `implemented` with source-as-is crop evidence; tire manufacturing/tread-life
  remains pending and `NO AVANZAR` remained `implemented-representative` until
  the later regulatory-panel slice.
- [x] T144 Implementation Agent evidence must specifically cover the user
  examples: Appendix IV regulatory signs and `NO AVANZAR`, hospital map,
  seatbelt/headrest copy problems, blind-spot visual, tire
  manufacturing/tread-life visual, `Matafuegos`, `Chaleco reflectivo`,
  headrest combined diagram/glossary, `50` people mobility-space visual, and
  whole-guide `источник` wording cleanup.
  Partial 2026-06-05 representative slice: Appendix IV regulatory signs /
  `NO AVANZAR` received concrete representative evidence. The later
  regulatory-panel slice adds broad Anexo L panels `01`-`04`; CABA sheets
  remain overview/local variants rather than being replaced.
  Partial 2026-06-05 blind-spot slice: blind spot now has concrete evidence in
  the app1 runtime card, visual completeness audit, crop inventory, registry,
  static tests, and focused Playwright assertions. Tire and broad Appendix IV
  rows/panels remain visible as pending/non-complete scope.
- [x] T145 Implementation Agent app1 equipment slice restores the official
  Appendix I page 120 `Matafuegos` and `Chaleco reflectivo` images as
  source-faithful crops with Russian translations outside the image; app2/app3
  equipment visuals remain pending for separate slices.

## Review Feedback: Visual Completeness Evidence Check Mode

- [x] T146 Architect receives and dispositions AI Review finding on PR `#200`
  current head `77126c397bdb26c8d0fa356cceadede516267fda`: validation/build
  paths now invoke `scripts/manual-guide-visual-completeness-audit.mjs`, but
  the script unconditionally writes tracked evidence file
  `content/validation/manual-guide-visual-completeness.evidence.json` with
  `writeFileSync`, so stale committed evidence can be silently regenerated and
  validation can pass.
- [x] T147 Architect classifies the finding as same-cycle required review fix
  for feature `034`, not a future ticket. Final validation remains blocked
  until the implementation fix and evidence are complete.
- [x] T148 Implementation Agent must split the visual-completeness audit into
  read-only/check behavior for validation paths and explicit write/generate
  behavior for intentional evidence regeneration. The script should default to
  check mode, or package scripts must otherwise make the check/write mode
  explicit and unambiguous.
- [x] T149 Implementation Agent must ensure check mode computes the expected
  visual-completeness evidence and compares it with committed
  `content/validation/manual-guide-visual-completeness.evidence.json`, failing
  with a clear message when the committed file is missing, malformed, stale, or
  different. Check mode must not rewrite the tracked evidence file.
- [x] T150 Implementation Agent must update package scripts used by
  `validate:manual-guide`, `validate:content`, `build`, preflight, or
  equivalent gates so they call read-only check mode rather than write mode.
  Evidence regeneration must require an explicit command or flag such as
  `--write`.
- [x] T151 Implementation Agent must add or update focused tests proving stale
  committed visual-completeness evidence fails instead of being regenerated
  silently, or at minimum proving check mode does not modify
  `content/validation/manual-guide-visual-completeness.evidence.json` while
  reporting a diff. Prefer a fixture/temp-copy test that mutates expected
  evidence without touching repository state.
- [x] T152 Implementation Agent must run and record review-fix verification:
  focused audit check/write split tests, `pnpm run validate:manual-guide`,
  `pnpm run validate:content`, `pnpm run build` if build invokes this audit,
  `node scripts/check-feature-memory.mjs --worktree`, and `git diff --check`.
  Full `pnpm run preflight` should be rerun if feasible before PR readiness.

## AI Review P2 Check-Mode Fix Evidence - 2026-06-05

- Implementation Agent continued assigned PR `#200` in
  `/Users/chap/devel/cabadrive-worktrees/034-manual-visual-content-crop`,
  branch `codex/034-manual-visual-content-crop`, from required committed head
  `77126c397bdb26c8d0fa356cceadede516267fda`. Startup dirty
  Architect-owned feature-memory edits in `spec.md`, `plan.md`, and
  `tasks.md` were preserved and adopted.
- Updated `scripts/manual-guide-visual-completeness-audit.mjs` so default
  execution is read-only check mode. It builds the expected evidence document
  in memory, stringifies it deterministically with a trailing newline, parses
  the committed evidence file, compares exact bytes, and fails clearly for
  missing, malformed, stale, or different evidence. It also fails check mode
  when learner-facing copy audit findings exist. Check mode does not write
  `content/validation/manual-guide-visual-completeness.evidence.json`.
- Evidence regeneration now requires explicit write mode:
  `node scripts/manual-guide-visual-completeness-audit.mjs --write`. Added
  package script
  `generate:manual-guide-visual-completeness-evidence` for that intentional
  path. Existing `validate:manual-guide`, `validate:content`, `build`, and
  preflight paths continue to call the default read-only checker.
- Added focused temp-fixture test
  `tests/manual-guide-visual-completeness-audit.test.mjs`. It verifies missing
  evidence fails without creating a file, `--write` generates evidence,
  current check mode leaves evidence unchanged, stale valid JSON fails without
  being rewritten, malformed JSON fails without being rewritten, and failure
  output tells the operator to rerun the explicit `--write` command.
- Verification passed:
  `node --test tests/manual-guide-visual-completeness-audit.test.mjs`;
  `node scripts/manual-guide-visual-completeness-audit.mjs` printed
  `checked`; `node scripts/manual-guide-visual-completeness-audit.mjs --write`
  printed `wrote` and left tracked evidence unchanged because it was current;
  `node scripts/manual-visual-content-inventory.mjs`;
  `node --test tests/content-manual-guide-chapters.test.mjs` (`97` pass);
  `pnpm run validate:manual-guide`; `pnpm run validate:content`;
  `pnpm exec tsc --noEmit`; `pnpm run build` passed and its validation stage
  printed `manual guide visual completeness audit checked ...`;
  `node scripts/check-feature-memory.mjs --worktree`; `git diff --check`.

## First Controlled Batch Evidence - 2026-06-05

- Implementation Agent status: first controlled batch only; do not treat
  feature `034` as complete.
- Implemented repeatable audit script
  `scripts/manual-guide-visual-completeness-audit.mjs`. Current AI Review P2
  fix evidence above supersedes the original default-write behavior: normal
  validation now checks committed
  `content/validation/manual-guide-visual-completeness.evidence.json`, while
  explicit `--write` intentionally regenerates it. The evidence records every
  `spec.md` `Context Examples From User` example by name with statuses such as
  `implemented` and `needs-implementation`.
- Implemented learner-facing copy guard for runtime `Руководство` Russian
  strings in `src/data/manual-sections/*.ts`. The guard blocks visible
  provenance/meta wording including `Визуал источника`,
  `Главный вывод источника`, `исходный фрагмент`, `рабочий фрагмент`, and
  inappropriate visible `источник` / `из источника`, while allowing internal
  technical fields such as `sourceTextEs`, `sourcePage`, validation evidence,
  specs, and process memory. It is wired into `pnpm run validate:manual-guide`
  and `pnpm run validate:content`.
- Implemented user example `mobility-space-50-people`: runtime
  `ch1-sustainable-mobility` now uses the official Spanish source crop
  `content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch1-sustainable-mobility/space-comparison-50-people-source.jpg`
  as protected source pixels, with separate selectable Russian term
  translations below the image. Evidence source crop:
  `content/validation/manual-guide/ch1-sustainable-mobility/page-023-space-comparison-50-people-source-crop.jpg`,
  dimensions `585x125`, SHA-256
  `72598aaf807780e1745a1ce3fc5ab0f307bd2703b23f53ecbf499457cf3eba6e`.
- Evidence statuses in
  `content/validation/manual-guide-visual-completeness.evidence.json` mark
  `mobility-space-50-people`, `seatbelt-headrest-copy-problems`, and
  `whole-guide-source-wording-copy-audit` as implemented for this batch.
  Remaining user examples are still `needs-implementation`: Appendix IV
  regulatory signs / `NO AVANZAR`, hospital map, blind-spot visual, tire
  manufacturing/tread-life visual, `Matafuegos`, `Chaleco reflectivo`, and
  headrest combined diagram/glossary.
- Focused verification passed:
  `node scripts/manual-guide-visual-completeness-audit.mjs`;
  `node --test --test-name-pattern "Manual guide visual completeness audit records user examples and blocks learner-facing provenance copy|ch1 sustainable mobility section covers source page 23 infographics and no unrelated section content" tests/content-manual-guide-chapters.test.mjs`
  (`2` pass, `94` skipped); `git diff --check`.
- Broader validation note before this checkpoint: full
  `node --test tests/content-manual-guide-chapters.test.mjs` failed after the
  runtime copy cleanup because legacy Chapter 1 source-fidelity fingerprints
  still need a coherent refresh for touched module bytes. Orchestrator
  checkpoint requested stopping scope growth and using the focused batch checks
  above; final PR validation remains blocked until full source-fidelity/content
  validation is restored.

## App2 Headrest Combined Diagram Micro-Slice Evidence - 2026-06-05

- Implementation Agent status: ultra-narrow Orchestrator-assigned slice for
  PR `#200` only. Scope is limited to the Appendix II/app2 headrest combined
  diagram; do not treat feature `034`, whole-document visual completeness, app1
  headrest, Appendix IV signs, hospital map, blind spot, tire, `Matafuegos`, or
  `Chaleco reflectivo` as complete from this evidence.
- Startup status before this slice was clean:
  `## codex/034-manual-visual-content-crop...origin/codex/034-manual-visual-content-crop`.
  Assigned worktree, branch, and PR were confirmed:
  `/Users/chap/devel/cabadrive-worktrees/034-manual-visual-content-crop`,
  `codex/034-manual-visual-content-crop`, PR `#200`; current saved HEAD before
  this slice was `22235ea380e5f686a9743a8ac40bc2684fcfa1ee`.
- Created protected combined runtime asset
  `content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/app2-safety-elements/headrest-combined-diagram-source-as-is.jpg`
  and identical validation/source asset
  `content/validation/manual-guide/app2-safety-elements/page-132-headrest-combined-diagram-source-crop.jpg`.
  Both are `820x600`, SHA-256
  `cd08c88256c94afec04b3a9b601d56d9c71743702e7d17106af2d918946b174c`.
- Extraction command used the retained official x5 page render as source:
  `sips --cropToHeightWidth 600 820 --cropOffset 2160 1040 content/validation/manual-guide/app2-safety-elements/page-132-safety-elements-source-crop.jpg --out content/validation/manual-guide/app2-safety-elements/page-132-headrest-combined-diagram-source-crop.jpg`.
  The crop is intentionally conservative: it keeps some bottom whitespace and
  the page number rather than risk clipping protected labels. Visual check
  confirmed the single image preserves `Altura apoyacabeza`,
  `Distancia del apoyacabeza`, `Bueno`, `Aceptable`, `Regular`, `Malo`, and
  `Botón de desbloqueo`; protected Spanish pixels were not translated,
  cleaned, retouched, relabeled, redrawn, masked, or reconstructed.
- Runtime data now replaces the two split app2 cards
  `app2-headrest-height-source-card` and
  `app2-headrest-distance-source-card` with one full-width source-image card
  `app2-headrest-combined-source-card`, `visibleSpanish: true`,
  `maxDisplayWidthPx: 820`, and `sourceImageException` scoped to the protected
  source image only.
- Added `termTranslations` support to source-image cards and rendered the app2
  Spanish terms as selectable DOM text below the image:
  `Altura apoyacabeza` -> `Высота подголовника`,
  `Distancia del apoyacabeza` -> `Расстояние до подголовника`,
  `Bueno` -> `Хорошо`, `Aceptable` -> `Допустимо`,
  `Regular` -> `Средне`, `Malo` -> `Плохо`,
  `Botón de desbloqueo` -> `Кнопка разблокировки`.
- Added strict source-fidelity vocabulary category `source-as-is-diagram` so
  protected diagrams with visible Spanish can use the same no-edit/no-upscale
  source-as-is validation path without being misclassified as photos.
- Updated
  `scripts/manual-guide-visual-completeness-audit.mjs` and regenerated
  `content/validation/manual-guide-visual-completeness.evidence.json`.
  The `headrest-combined-diagram` user example is recorded as implemented for
  app2 only with runtime asset path, source asset path, hash, dimensions,
  source region, protected-image policy, no-upscale display cap, DOM
  translation selector, and a note that app1 page 113 remains outside this
  slice.
- Updated `tests/content-manual-guide-chapters.test.mjs` to expect the app2
  combined card/asset/translations/evidence instead of the old split app2
  headrest assets. The reusable source-image-card inventory count changed from
  `38` to `37` because two app2 split cards became one full-width card.
- Verification so far:
  `node scripts/manual-guide-visual-completeness-audit.mjs` passed;
  focused `node --test --test-name-pattern "Manual guide visual completeness audit records user examples and blocks learner-facing provenance copy|Appendix II safety visuals render as preserved source images with provenance evidence|Appendix II sections retain passenger-transport legal, safety, health, and route details|Manual guide source-fidelity evidence schema records strict full-manual visual policy" tests/content-manual-guide-chapters.test.mjs`
  passed (`4` pass, `92` skipped);
  `pnpm run validate:manual-guide` passed;
  `pnpm exec tsc --noEmit` passed.
- Full `node --test tests/content-manual-guide-chapters.test.mjs` still fails
  only at the pre-existing blocker documented by Orchestrator:
  `Manual guide source-fidelity checker keeps already-merged Chapter 1 legacy baseline evidence allowed`,
  assertion message
  `ch1-public-transport-system baseline evidence remains legacy before planned audit`,
  expected `false`, actual `true`. Headrest-specific tests pass.
- Process note: `node scripts/check-feature-memory.mjs --worktree` was run
  before this `tasks.md` evidence entry existed and failed because product
  paths had changed without a feature-memory diff. This was a sequencing
  issue; rerun after this tasks update is required and should be recorded
  below.
- Final verification for this micro-slice:
  `node scripts/check-feature-memory.mjs --worktree` passed after this
  `tasks.md` update with
  `Feature-memory gate passed via specs/034-manual-visual-content-crop/{spec,plan,tasks}.md`;
  `git diff --check` passed.

## Sustainable Mobility Browser Smoke Expectation Micro-Slice - 2026-06-05

- Implementation Agent status: ultra-narrow Orchestrator-assigned slice for
  PR `#200` only. Scope is limited to stale e2e/browser smoke expectations for
  the Chapter 1 sustainable mobility `50` people space-comparison visual after
  the already accepted official Spanish source-as-is replacement.
- Startup status before edits was clean:
  `## codex/034-manual-visual-content-crop...origin/codex/034-manual-visual-content-crop`.
  Assigned worktree, branch, and PR were confirmed:
  `/Users/chap/devel/cabadrive-worktrees/034-manual-visual-content-crop`,
  `codex/034-manual-visual-content-crop`, PR `#200`; current saved HEAD before
  this slice was `7c3b7f705345d2feb6c473a273a880c205d82f79`. Parallel
  work/sibling state preservation warning was honored.
- Updated only `tests/e2e/app.spec.ts` product test expectations: the
  `ch1-sustainable-mobility` section now asserts the specific
  `space-comparison-50-people-source.jpg` image has
  `data-visible-spanish="true"`,
  `data-source-image-exception="source-image-original-visible-text"`,
  `data-visible-spanish-scope="source-image-only"`, and
  `data-source-as-is="true"`; verifies the separate selectable Spanish/Russian
  term translations for bus, walking, bicycle, and car; and reduces the
  remaining `img[data-visible-spanish="false"]` count from `2` to `1`.
- Updated the same stale smoke block so mobile layout checks no longer require
  the old reconstructed `manual-space-mobile-pair` sprite icons or flag local
  scrolling for protected source-as-is images. Vulnerability-ranking mobile
  pair checks remain intact.
- Verification:
  initial focused Playwright before rebuilding `dist` failed because
  `vite preview` served stale built assets with the old runtime metadata;
  `pnpm run build` passed and regenerated the current preview bundle;
  focused
  `pnpm exec playwright test tests/e2e/app.spec.ts --grep "Manual guide exposes implemented Chapter 1"`
  passed (`2` pass: chromium and mobile);
  `pnpm run test` passed (`422` pass);
  `pnpm run validate:manual-guide` passed;
  `pnpm exec tsc --noEmit` passed;
  `git diff --check` passed before this evidence entry.

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
- Architect disposition `2026-06-05T08:50:24-03:00`: the new user
  clarification is same-cycle acceptance refinement. Follow-up Implementation
  Agent work is required before PR `#200` proceeds to Review Agent/final
  validation because current crop evidence proves margin removal and
  no-upscale behavior, but does not yet prove that intended-readable text
  inside images is visually no smaller than nearby document body text.
- Architect disposition `2026-06-05T09:29:59-03:00`: dispose
  `cedulas-source-card` feedback as a future ticket, not a same-cycle task,
  not a blocker, and not silently accepted as complete. Rationale:
  `cedulas-source-card` is a supporting source-document example in
  `ch2-required-documents`, already displayed full-width with no-upscale
  source-as-is evidence and adjacent selectable DOM explanation for the
  learner-critical rule. It is not one of the Appendix IV page-sheet visuals
  that drove the user's urgent readability complaint, and evidence does not
  classify it as a source-limited owner-disposition blocker. Implementation
  correctly avoided replacing it without a reliable high-DPI extraction path
  because an unsafe replacement could regress protected source fidelity. A
  separate follow-up should verify or improve source-region/high-DPI extraction
  for source-document examples, including `cedulas-source-card`, from a fresh
  Orchestrator-routed feature or task slice if owner priority warrants it.
  This disposition creates no additional required implementation work in
  PR `#200`; the remaining completion blocker is the already-recorded
  Orchestrator/user disposition for Appendix IV source-limited readability
  exceptions.
- Architect disposition `2026-06-05T11:19:40-03:00`: latest user clarification
  blocks final validation and supersedes treating current Appendix IV
  `source-limited-exception` records as enough for owner disposition. The user
  wants large official signs/fragments, translated Russian external captions
  only outside protected sign pixels, and strict preservation of anything
  inside signs/plates/tablets/placards. The hospital map must also be
  revisited from the official original/best source so map labels are readable
  without translating or modifying the map. The interrupted Swift direct
  source-region helper is useful supporting machinery and must be preserved or
  adapted by Implementation Agent, but it is insufficient if it only confirms
  whole-sheet source limitation. PR `#200` requires same-cycle implementation
  follow-up before review/final validation.
- Architect disposition `2026-06-05T11:19:40-03:00`: latest runtime-copy
  clarification is same-cycle acceptance refinement. Learner-facing
  `Руководство` text must be audited and rewritten so visual-card titles,
  captions, bodies, and notes read as adapted Russian learning copy rather than
  provenance/service commentary. Internal evidence/spec/provenance records may
  keep technical source wording. PR `#200` requires same-cycle implementation
  follow-up and evidence before review/final validation.
- Architect disposition `2026-06-05T11:29:09-03:00`: urgent consolidated user
  requirements and the new public-space `50` people mobility visual are
  same-cycle acceptance refinements for feature `034`, not a new feature
  request and not a reason to edit `feature-request.md`. The canonical summary
  is now recorded in `spec.md`. PR `#200` must not proceed to final validation
  until the full-document PDF-vs-runtime visual completeness audit, required
  missing-image additions, original-image protected-pixel handling, separate
  Russian term translations, image quality/scale evidence, Appendix IV sign
  work, hospital map work, blind-spot/public-space visuals, and learner-facing
  copy cleanup are implemented and evidenced, or narrow blockers are routed to
  Orchestrator/human.
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
- Replacement follow-up adoption decision `2026-06-05T09:21:39-03:00`:
  current replacement Implementation Agent confirmed the assigned worktree
  `/Users/chap/devel/cabadrive-worktrees/034-manual-visual-content-crop`,
  branch `codex/034-manual-visual-content-crop`, PR `#200`, local `HEAD`
  `98a5336fed769e30d716f95a1493b1b66848fefc`, and
  `origin/codex/034-manual-visual-content-crop`
  `98a5336fed769e30d716f95a1493b1b66848fefc`. Startup status was
  `## codex/034-manual-visual-content-crop...origin/codex/034-manual-visual-content-crop`
  with dirty inherited follow-up edits in
  `content/validation/manual-guide-visual-content-crop.evidence.json`,
  `docs_project/project/frontend/manual-conversion-guidelines.md`,
  `scripts/manual-visual-content-crops.swift`,
  `scripts/manual-visual-content-inventory.mjs`,
  `specs/034-manual-visual-content-crop/spec.md`,
  `specs/034-manual-visual-content-crop/plan.md`,
  `specs/034-manual-visual-content-crop/tasks.md`, Appendix IV section data,
  `tests/content-manual-guide-chapters.test.mjs`, and
  `tests/e2e/app.spec.ts`. This pass adopts and preserves the inherited diff,
  including Architect process-memory edits and partial text-readability
  inventory work, and fixes forward without discarding protected crop assets or
  sibling work.
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

- Open after Architect clarification disposition: current PR `#200` evidence
  records `source-limited-exception` for Appendix IV page-sheet text
  readability. The official PDF high-scale render and retained official Anexo L
  image assets do not provide more source glyph pixels, and split/sub-crop
  presentation would not make those protected source glyphs larger without
  browser upscaling or reconstruction. The implementation mitigation keeps
  each Appendix IV sheet at natural crop width with contained figure scrolling
  on narrow screens, but the strict "no smaller than body text" target remains
  unmet for the smallest Spanish labels and requires Orchestrator/user
  disposition before final validation. Latest user clarification now requires
  implementation follow-up rather than owner acceptance of the broad
  whole-sheet source-limited path: use large official sign fragments/rows or an
  equivalent source-faithful layout where possible.
  Hospital map quality/readability is now an explicit open same-cycle issue:
  `app2-hospital-map-source-card` must be re-extracted or verified from the
  official original/best source so map labels are readable and unchanged inside
  the image.
  Runtime learner-facing copy audit is also an explicit open same-cycle issue:
  current guide strings include provenance/meta wording such as
  `Визуал источника`, `исходный фрагмент`, and `Главный вывод источника`.
  These must be rewritten as normal Russian learning copy with audit/test
  evidence before final validation.
  Whole-document visual completeness is now an explicit open same-cycle issue:
  the guide must be compared against official PDF visual regions, and missing
  learner-meaningful visuals must be added or dispositioned. Required named
  candidates include tire manufacturing/date and tread-life, blind spot,
  `Matafuegos`, `Chaleco reflectivo`, hospital map, Appendix IV signs,
  headrest diagrams, and the public-space `50` people mobility visual.
  `cedulas-source-card` feedback is disposed as a future ticket, not as a
  same-cycle blocker. It remains a supporting source-document example with
  existing no-upscale/source-as-is evidence; future work should verify whether
  a reliable high-DPI source-region extraction can improve it without protected
  source regression.

## Implementation Agent Feedback

- Appendix IV source-limited readability exception requires
  same-cycle implementation follow-up before review/final validation as
  complete under the latest user clarification:
  `app4-regulatory-page-185-source-card`,
  `app4-regulatory-page-186-source-card`, `app4-warning-page-187-source-card`,
  `app4-warning-page-188-source-card`,
  `app4-informational-page-189-source-card`,
  `app4-informational-page-190-source-card`,
  `app4-informational-page-191-source-card`,
  `app4-informational-page-192-source-card`,
  `app4-temporary-page-193-source-card`,
  `app4-temporary-page-194-source-card`,
  `app4-horizontal-page-195-source-card`,
  `app4-horizontal-page-196-source-card`,
  `app4-traffic-lights-page-197-source-card`,
  `app4-traffic-lights-page-198-source-card`,
  `app4-traffic-lights-page-199-source-card`, and
  `app4-traffic-lights-page-200-source-card`.
- `app2-hospital-map-source-card` now requires same-cycle implementation
  follow-up for official-original/best-quality map extraction and label
  readability evidence, with map pixels/text preserved unmodified.
- Runtime learner-facing Russian guide copy now requires same-cycle
  implementation follow-up: audit and rewrite source/provenance/meta wording
  across the whole guide, update tests so regressions fail, and record grep or
  structured audit evidence.
- Whole-document visual completeness now requires same-cycle implementation
  follow-up: compare official PDF/manual visual regions to current runtime
  guide visuals, add or disposition all learner-meaningful missing visuals, and
  produce evidence/tests. Named required candidates are tire
  manufacturing/date and tread-life, blind spot, `Matafuegos`,
  `Chaleco reflectivo`, hospital map, Appendix IV signs, headrest diagrams,
  and the public-space `50` people mobility visual. The public-space visual
  must use the official original image as-is with separate Russian translations
  below/near the image, not the current low-quality/reconstructed Russian
  version.
- Architect disposition for `cedulas-source-card`: future ticket. The visual
  crop evidence records attempted page-image and canonical-PDF explicit-region
  probes, but this follow-up did not replace the source-document example
  because the reliable high-DPI extraction path was not established without
  risking protected-source regression. This is not a same-cycle task and not an
  owner-disposition blocker for PR `#200`; Orchestrator may route a later
  source-document example extraction/readability feature if desired.

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
- Same-cycle readability follow-up verification `2026-06-05T09:26:56-03:00`:
  `node scripts/manual-visual-content-inventory.mjs` passed and regenerated
  `content/validation/manual-guide-visual-content-crop.evidence.json` with
  `wholeManualInventory`, text-readability evidence for `38` source-image
  cards and `2` source-artwork blocks, `16` Appendix IV
  `source-limited-exception` records, `16` owner-disposition-required card ids,
  `1` Architect-disposition-required feedback id
  (`cedulas-source-card`), official Anexo L better-source audit width range
  `613-620px`, and desktop/mobile viewport comparison records for readable or
  source-limited image text. `node --test
  tests/content-manual-guide-chapters.test.mjs` passed with `95` tests,
  `95` pass, `0` fail, duration `11786.76825ms`; the focused content test now
  fails if `wholeManualInventory` or per-card text-readability evidence is
  missing. `node scripts/check-feature-memory.mjs --worktree` passed.
  `pnpm run validate:manual-guide` passed with `50` implemented sections,
  `0` pending sections, and manual source-fidelity status `pass`.
  `pnpm run validate:content` passed with `460` category B fallback questions,
  `276` local image references, `200/200` manual pages, and manual
  source-fidelity status `pass`. `pnpm exec tsc --noEmit` passed.
  `pnpm run test` passed with `421` tests, `421` pass, `0` fail, duration
  `12450.450667ms`. `pnpm run build` passed, generated a service worker with
  `1860` cached assets, and emitted only the existing Vite large-chunk warning.
  Focused Playwright `pnpm exec playwright test --grep "Manual guide
  full-width source image cards stay readable and avoid upscaling"` passed with
  `2` tests, `2` pass, duration `11.3s`, producing representative desktop and
  mobile screenshots under
  `test-results/app-Manual-guide-full-widt-84d9e-eadable-and-avoid-upscaling-*`.
  `git diff --check` passed. Full `pnpm run preflight` passed: feature-memory
  gate, repository baseline check, `validate:content`, `pnpm run test`
  (`421` tests passed), `pnpm run build` (service worker with `1860` cached
  assets), and nested `pnpm run test:e2e` with `82` tests passed in `47.1s`.
  Post-preflight `git status --short --branch` remained scoped to the expected
  dirty follow-up files on
  `codex/034-manual-visual-content-crop...origin/codex/034-manual-visual-content-crop`;
  no generated build/public noise was introduced.

## Validator-Blocker Fix Evidence - 2026-06-05

- Implementation Agent CI-blocker micro-slice for PR `#200` started from
  assigned worktree
  `/Users/chap/devel/cabadrive-worktrees/034-manual-visual-content-crop`,
  branch `codex/034-manual-visual-content-crop`, HEAD
  `ff75578cb7cec96be6a3c8e3797cbbf119d4b000`. Startup
  `git status --short --branch` was clean on the assigned branch.
- Narrow metadata/test fix: removed sections that already carry strict
  source-fidelity evidence from the Chapter 1 legacy-baseline allowlists.
  `ch1-public-transport-system` is now asserted as strict recorded evidence
  with `visualEvidenceSchemaVersion: 3` and
  `visualRulePolicyId: 031-strict-source-fidelity` instead of expecting
  missing legacy fields. The same deterministic allowlist sync was applied to
  `ch1-shared-trip` after the focused test showed it already has the same
  strict recorded evidence in the current registry.
- Updated only source-fidelity test/metadata surfaces:
  `tests/content-manual-guide-chapters.test.mjs`,
  `scripts/manual-guide-source-fidelity.mjs`, and
  `content/validation/manual-guide-source-fidelity.evidence.json`. No visual
  runtime content, source assets, crop assets, or guide rendering files were
  modified.
- Verification run during this micro-slice:
  `node --test tests/content-manual-guide-chapters.test.mjs` passed with
  `96` tests, `96` pass, `0` fail; `pnpm run validate:manual-guide` passed
  with source-fidelity status `pass`, `50` implemented sections, `0` pending
  sections, and strict visual rule policy `031-strict-source-fidelity`;
  `pnpm exec tsc --noEmit` passed;
  `node scripts/check-feature-memory.mjs --worktree` passed; `git diff
  --check` passed; `pnpm run test` passed with `422` tests, `422` pass, `0`
  fail.

- Implementation Agent validator-blocker slice started from assigned PR `#200`
  worktree
  `/Users/chap/devel/cabadrive-worktrees/034-manual-visual-content-crop`,
  branch `codex/034-manual-visual-content-crop`, HEAD
  `1a90836c382cdd77a30ae15512bc5f6e311b3a19`. Startup status preserved the
  pre-existing dirty files `scripts/manual-visual-content-crops.swift`,
  `spec.md`, and `plan.md`; this slice did not edit those files.
- Reproduced blocker with `pnpm run validate:manual-guide`: source-fidelity
  failed with
  `ch1-public-transport-system implementationEvidence.visualEvidenceSchemaVersion must be 3 for new manual units`.
- Inspected `scripts/manual-guide-source-fidelity.mjs`,
  `tests/content-manual-guide-chapters.test.mjs`,
  `src/data/manual-sections/ch1-public-transport-system.ts`,
  `content/manuals/gcba-manual-vehiculo-4-ruedas-2023/interactive-guide/section-registry.chapters-1-2.json`,
  and `content/validation/manual-guide-source-fidelity.evidence.json`.
- Narrow fix: promoted `ch1-public-transport-system` implementation evidence to
  strict visual evidence schema `3`, added strict source-region extraction
  metadata, local asset categories, runtime no-upscale evidence, and
  source-integrity records, then refreshed only that section's source-fidelity
  policy fingerprints.
- After that fix, `pnpm run validate:manual-guide` immediately reported the same
  narrow issue for `ch1-shared-trip`. That section had unchanged legacy
  evidence but a stale legacy state fingerprint, so this slice promoted
  `ch1-shared-trip` to the same strict schema `3` metadata and refreshed only
  its source-fidelity policy fingerprints.
- Re-run `pnpm run validate:manual-guide` passed: `manual-guide-source-fidelity`
  checked `50` sections, `0` pending sections, strict visual rule policy
  `031-strict-source-fidelity`; `manual-guide-visual-completeness-audit.mjs`
  completed and left no additional diff.
- Required checks for this blocker slice passed:
  `pnpm run validate:manual-guide`;
  `pnpm exec tsc --noEmit`;
  `node scripts/check-feature-memory.mjs --worktree`;
  `git diff --check`.

## App1 Equipment Source Crop Evidence - 2026-06-05

- Implementation Agent app1 equipment slice started from assigned PR `#200`
  worktree
  `/Users/chap/devel/cabadrive-worktrees/034-manual-visual-content-crop`,
  branch `codex/034-manual-visual-content-crop`, HEAD
  `840352d30bb2f11c932ef318c329fba674b2b01e`. Startup status was clean on the
  assigned branch. Parallel work may exist; this slice preserved sibling
  worktrees, branches, PRs, and process memory.
- Created official page-120 source-faithful crops from
  `content/validation/manual-guide/app1-other-required-safety-elements/page-120-other-required-safety-elements-source-crop.jpg`
  without upscaling, redraw, relabeling, translation, cleanup, masking,
  inpainting, or retouching. Orchestrator corrected the first coordinates to
  tighter final crops before commit:
  `Matafuegos` source region `x=1060`, `y=1660`, `width=340`,
  `height=330`; `Chaleco reflectivo` source region `x=1060`, `y=1990`,
  `width=340`, `height=340`.
- Runtime assets are byte-identical to validation crops:
  `content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/app1-other-required-safety-elements/matafuegos-source-as-is.jpg`
  and
  `content/validation/manual-guide/app1-other-required-safety-elements/page-120-matafuegos-source-crop.jpg`
  are `340x330`, SHA-256
  `b8e5bb0ccea12bf6b4be881fff17cd4da3c935557cfa670d8e39cf49ea05376e`.
  `content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/app1-other-required-safety-elements/chaleco-reflectivo-source-as-is.jpg`
  and
  `content/validation/manual-guide/app1-other-required-safety-elements/page-120-chaleco-reflectivo-source-crop.jpg`
  are `340x340`, SHA-256
  `f4935b08d31512a4b06e39b00766cc3a5036c9f9cab4be3442ab7a83a7904581`.
- Runtime section
  `src/data/manual-sections/app1-other-required-safety-elements.ts` now renders
  `app1-matafuegos-source-card` and
  `app1-chaleco-reflectivo-source-card` as full-width `source-image-cards`
  capped at natural `340px` width. Spanish titles remain inside the official
  images. Russian translations are selectable DOM text below the images:
  `Matafuegos` -> `Огнетушитель`; `Chaleco reflectivo` ->
  `Световозвращающий жилет`. Orchestrator copy correction before commit
  removed learner-facing `источник` wording from this new block: the visible
  title is `Огнетушитель и световозвращающий жилет`, and the extinguisher body
  copy says the extinguisher is required equipment and must be safely secured
  within the driver's reach, without referring to source provenance.
- Updated source registry and audit evidence:
  `content/manuals/gcba-manual-vehiculo-4-ruedas-2023/interactive-guide/section-registry.chapters-1-2.json`
  records source-region metadata, local asset metadata, source integrity,
  no-upscale runtime display size, visible Spanish source-image exceptions, and
  term translations for both app1 equipment images.
  `scripts/manual-guide-visual-completeness-audit.mjs` and regenerated
  `content/validation/manual-guide-visual-completeness.evidence.json` mark
  `matafuegos-chaleco-reflectivo` as `implemented-app1-only`, with an explicit
  remaining-scope note that app2/app3 equipment visuals are pending.
- Focused verification before full suite:
  `node scripts/manual-guide-source-fidelity.mjs` passed with `50`
  implemented sections, `0` pending sections, and strict visual policy
  `031-strict-source-fidelity`. `node --test
  tests/content-manual-guide-chapters.test.mjs` passed with `97` tests, `97`
  pass, `0` fail, duration `11830.099875ms`.
- Final app1 equipment verification after copy correction:
  `node --test tests/content-manual-guide-chapters.test.mjs` passed with `97`
  tests, `97` pass, `0` fail, duration `11587.339875ms`. A focused visible
  string scan of the new `mandatory-equipment-source-visuals` block inspected
  `9` visible Russian strings and found `0` offenders for
  `источник|исходн|фрагмент|source`. `pnpm run validate:manual-guide`
  passed, `pnpm run validate:content` passed, and `pnpm exec tsc --noEmit`
  passed after the copy correction.
- Focused Playwright screenshot/probe ran against local Vite at
  `http://127.0.0.1:5174/` after clicking the `Руководство` tab and the
  `app1-other-required-safety-elements` manual section. It verified both
  images have `data-source-image-exception="source-image-original-visible-text"`,
  `data-visible-spanish-scope="source-image-only"`, `data-source-as-is="true"`,
  no runtime upscaling, and no visible `источник|исходн|фрагмент|source`
  wording in the new card title/body/translation text. Desktop rendered both
  images at natural `340px` width; mobile rendered them at `271px` width.
  Screenshot evidence:
  `content/validation/manual-guide/app1-other-required-safety-elements/app1-equipment-source-cards-desktop.png`
  and
  `content/validation/manual-guide/app1-other-required-safety-elements/app1-equipment-source-cards-mobile.png`.

## Whole-Guide Learner-Facing Copy Cleanup Evidence - 2026-06-05

- Implementation Agent copy-cleanup slice started from assigned PR `#200`
  worktree
  `/Users/chap/devel/cabadrive-worktrees/034-manual-visual-content-crop`,
  branch `codex/034-manual-visual-content-crop`. Startup status before edits was
  clean on the assigned branch at saved HEAD
  `a6a6f90634a383982a01590c30861aaad545b559`. Parallel worktree/branch/PR
  preservation warning was honored; no sibling worktrees, branches, or PRs were
  touched.
- Whole-guide learner-facing audit scope covered runtime strings in
  `src/data/manual-sections/*.ts` for provenance/service wording including
  `источник`, `источника`, `из источника`, `исходн*`, `рабочий фрагмент`,
  `фрагмент сохран`, `сохранен как`, `как в источнике`, `фотофрагмент`,
  `x5-фрагмент`, `перенесенн*`, `Визуал источника`, and
  `Главный вывод источника`. Internal technical provenance fields such as
  `sourceTextEs`, `sourcePage`, `sourceRegion`, source-image exception
  metadata, asset paths, validation evidence, and process memory were preserved.
- Before/after grep evidence for that broad pattern in
  `src/data/manual-sections/*.ts`: previous assigned head
  `a6a6f90634a383982a01590c30861aaad545b559` had `112` hits. Current tree has
  `1` hit:
  `src/data/manual-sections/app2-driving-factors.ts:57`, `Постоянно принимать
  решения о маневрах, что создает значимый источник стресса и усталости.`
  This is allowlisted because `источник стресса` means a cause of stress, not
  document provenance.
- Rewrote learner-visible Russian copy across the manual into direct study
  language. Examples include `источник рекомендует` -> direct recommendation or
  rule wording, `Главная формула источника` -> `Ключевая формула темы`,
  `Итог источника` -> `Главный вывод`, `Термин источника` -> `Термин`, and
  service-like image notes such as `сохранено без изменений`,
  `исходный фрагмент`, and `перенесенная схема` into normal descriptions of
  what the learner should read or inspect.
- Tone follow-up from the user was applied before commit: visible copy avoids
  explaining provenance or artifact processing where simpler learner text works.
  Protected visual explanations now say things like `Сами знаки на листах идут
  на испанском как визуальные образцы` or `Русский текст дан рядом`, rather than
  centering `официальный визуальный материал`, `официальных листах`, or
  processing language.
- Strengthened `scripts/manual-guide-visual-completeness-audit.mjs` copy guard.
  The generated
  `content/validation/manual-guide-visual-completeness.evidence.json` now
  records denied pattern ids `source-family-provenance`,
  `main-source-takeaway`, `source-quote-card-title`,
  `raw-working-fragment`, `saved-as-source`, and `transferred-visual-meta`;
  allowlist id `stress-cause-source`; `findingCount: 0`;
  `allowlistedCount: 1`; and the single `источник стресса` occurrence with
  rationale.
- Updated `tests/content-manual-guide-chapters.test.mjs` so the cleanup is
  asserted: no learner-facing manual-section literals may contain the broadened
  provenance/service patterns, the audit evidence must expose the denied ids and
  only the semantic `stress-cause-source` allowlist, and representative rewritten
  strings for safety equipment, signs, maps, bicycle signs, seatbelt/headrest,
  Chapter 3 speed, Chapter 4 alcohol/sleep, and Chapter 5 attitude/equality are
  checked.
- No images were changed in this copy-cleanup slice. Protected image pixels,
  source-image metadata, source regions, source integrity, and provenance
  evidence were not changed for visual meaning. The only source-fidelity
  evidence change was refreshing legacy state fingerprints for touched Chapter 1
  module bytes (`ch1-pedestrian-priority` and `ch1-bicycle`); legacy evidence
  fingerprints and visual asset bytes were not changed.
- Verification for this copy-cleanup slice passed:
  `node scripts/manual-guide-visual-completeness-audit.mjs`;
  `node --test tests/content-manual-guide-chapters.test.mjs` (`97` pass,
  `0` fail);
  `pnpm run validate:manual-guide`;
  `pnpm run validate:content`;
  `pnpm exec tsc --noEmit`;
  `node scripts/check-feature-memory.mjs --worktree`;
  `git diff --check`.
  Focused Playwright smoke was not run for this slice because it changed
  learner-facing copy/static audit coverage only and did not alter frontend
  runtime layout or image assets; earlier visual slices retain their screenshot
  evidence.

## Hospital Map Follow-Up Evidence - 2026-06-05

- Implementation Agent hospital-map slice started from assigned PR `#200`
  worktree
  `/Users/chap/devel/cabadrive-worktrees/034-manual-visual-content-crop`,
  branch `codex/034-manual-visual-content-crop`. Startup status before edits was
  clean on assigned HEAD `3565eee00917def61e0acc9cff0bb6551a53165b`.
  Parallel worktree/branch/PR preservation warning was honored; no sibling
  worktrees, branches, or PRs were touched.
- User example covered: `Hospital map` /
  `app2-hospital-map-source-card`. Previous runtime asset
  `content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/app2-highways-hospitals/hospital-map-source-as-is.png`
  was `780x335`, SHA-256
  `ee73e1266080824b0f1d2c9176b4e120e733db5f4a48440cbbdc974fab8af526`.
  Useful-content bbox evidence from the old crop was `x=251`, `y=0`,
  `width=328`, `height=335`, with area ratio `0.4205128205128205` and width
  ratio `0.4205128205128205`.
- Official-source extraction used
  `content/official-documents/originals/gcba-manual-vehiculo-4-ruedas-2023.pdf`,
  page `150`, through `scripts/manual-visual-content-crops.swift` and focused
  config
  `content/validation/manual-guide-hospital-map-source-crop.config.json`.
  Probe scales `12`, `20`, `30`, and `36` all succeeded; selected render scale
  was `36`, maximum successful probe scale was `36`.
- A direct-PDF attempt using the old retained-page `y` coordinate produced a
  mostly blank `2405x2413` crop during diagnosis. It was visually rejected
  before commit and is not used as a runtime asset or source-integrity crop.
  The corrected PDF-region coordinate uses `sourceRegionAtBaseScale`
  `{ x: 1332, y: 2050, width: 780, height: 335 }`.
- The first corrected visible official render produced a full map+title/list
  panel `588x837`, SHA-256
  `6df8225c42b792a1d47d2d600f36a0ded89278952041fb809b866b3f86392454`, saved as
  validation-only evidence at
  `content/validation/manual-guide/app2-highways-hospitals/page-150-hospital-map-panel-source-crop.png`.
  It was not selected for runtime because the title/list panel reduced the
  colored map's useful runtime scale.
- Final runtime/source-integrity asset is the source-faithful map-only crop:
  `content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/app2-highways-hospitals/hospital-map-source-as-is.png`
  and
  `content/validation/manual-guide/app2-highways-hospitals/page-150-hospital-map-source-crop.png`
  are byte-identical `440x380` PNG files, SHA-256
  `742f7e66213866c7e07861b9a93ab7fdd8c00e8b384e96a239b1b1cb712ca1d0`.
  Final trim bounds at render scale are `{ x: 937, y: 1705, width: 440,
  height: 380 }`.
- Final useful-content ratios for the map-only crop are area ratio
  `0.7142763157894737`, width ratio `0.7477272727272727`, and height ratio
  `0.9552631578947368`. This removes the old blank side fields and keeps the
  colored map itself as the runtime focus.
- Source limitation recorded honestly: high-scale official PDF probes did not
  materially increase the barrio-label glyph detail beyond the native raster.
  The implementation therefore uses the tightest source-faithful map-only crop,
  avoids browser/CSS upscaling, and keeps mobile from shrinking the map below
  its natural width.
- Runtime metadata updated in
  `src/data/manual-sections/app2-highways-hospitals.ts`:
  `sourceRegion: { x: 1332, y: 2050, width: 780, height: 335 }`,
  `maxDisplayWidthPx: 440`, `minDisplayWidthPx: 440`, asset path unchanged.
  Existing Russian legend/list remains selectable DOM text below the image.
  Learner-facing copy avoids banned `источник` / `исходный` /
  `фрагмент` wording.
- Protected-image policy: Spanish barrio labels, H/H1/H2 markers, colors,
  roads, boundaries, and geometry remain unchanged inside the protected map
  image. No translation, relabeling, redraw, cleanup, mask, retouch, inpaint,
  recolor, or other internal map-pixel modification was performed.
- Registry/evidence/tests updated:
  `content/manuals/gcba-manual-vehiculo-4-ruedas-2023/interactive-guide/section-registry.chapters-1-2.json`,
  `content/validation/manual-guide-source-fidelity.evidence.json`,
  `content/validation/manual-guide-visual-content-crop.evidence.json`,
  `content/validation/manual-guide-visual-completeness.evidence.json`,
  `scripts/manual-guide-source-fidelity.mjs`,
  `scripts/manual-guide-visual-completeness-audit.mjs`,
  `tests/content-manual-guide-chapters.test.mjs`, and
  `tests/e2e/app.spec.ts`. Visual completeness now marks
  `app2-hospital-map-source-card` as `implemented`, not
  `needs-implementation`. The stale e2e expectation for bicycle source-wording
  cleanup was changed from the removed provenance phrase to
  `Официальная таблица знаков оставлена без изменений; пояснение ниже не
  является частью изображения.`
- Verification completed so far for this slice:
  `node scripts/manual-guide-visual-completeness-audit.mjs` passed and rewrote
  visual-completeness evidence; `node --test
  tests/content-manual-guide-chapters.test.mjs` passed with `97` tests, `97`
  pass, `0` fail, duration `12701.4785ms`; `pnpm run validate:manual-guide`
  passed; `pnpm run validate:content` passed; `pnpm exec tsc --noEmit` passed;
  `node scripts/check-feature-memory.mjs --worktree` passed after this feature
  memory section was added; `git diff --check` passed; `pnpm run build` passed
  and generated the service worker with `1863` cached assets.
- Playwright/e2e verification for this slice:
  `pnpm exec playwright test tests/e2e/app.spec.ts -g "Manual guide full-width
  source image cards stay readable and avoid upscaling" --project=chromium`
  passed (`1` test, `1` pass), covering desktop/mobile viewport loops and
  screenshot capture for `app2-highways-hospitals` within the focused
  source-card scenario. `pnpm exec playwright test tests/e2e/app.spec.ts -g
  "Manual guide exposes implemented Chapter 1" --project=chromium` passed (`1`
  test, `1` pass), covering the stale bicycle source-wording expectation.
  Broader e2e ran as `pnpm exec playwright test tests/e2e/app.spec.ts
  --project=chromium` (`41` passed, `34.3s`) and `pnpm exec playwright test
  tests/e2e/app.spec.ts --project=mobile` (`41` passed, `44.3s`). Full
  `pnpm run test:e2e` was not run as the wrapper because it would repeat the
  already-passed build plus both Playwright projects; the equivalent build and
  both configured projects were run directly.
- Screenshot evidence from the focused/full source-card e2e is under
  `test-results/app-Manual-guide-full-widt-84d9e-eadable-and-avoid-upscaling-chromium/`
  and the corresponding mobile project output. The hospital-map runtime card
  renders the `440x380` map-only asset at no more than natural width, with
  `minDisplayWidthPx: 440` enabling contained visual-only horizontal scrolling
  on narrow screens and no document-level horizontal overflow.

## NO AVANZAR Representative Focused Crop Evidence - 2026-06-05

- Implementation Agent `NO AVANZAR` slice continued in assigned PR `#200`
  worktree
  `/Users/chap/devel/cabadrive-worktrees/034-manual-visual-content-crop`,
  branch `codex/034-manual-visual-content-crop`. Startup status before edits
  was clean on the assigned branch after previous worker commit
  `9651f49845c53ae7a78f2631132139f738618801`; parallel worktree/branch/PR
  preservation was honored and no sibling worktrees, branches, or PRs were
  touched.
- This is a representative focused crop, not full Appendix IV completion.
  Visual-completeness evidence records
  `appendix-iv-regulatory-signs-no-avanzar` as
  `implemented-representative`, keeps that example in
  `remainingRequiredExamples`, and adds the explicit note that it covers the
  reported `NO AVANZAR` example only, not every Appendix IV regulatory sign or
  row. Remaining visible required examples are the blind-spot visual and tire
  manufacturing/tread-life visual, plus the broader Appendix IV sign/row scope
  if future slices add more focused signs.
- Official retained source used:
  `content/official-documents/originals/decreto-779-1995-anexo-l-senalizacion-vial-uniforme-images/dec196AnexoIII-01.jpg`,
  dimensions `615x743`, SHA-256
  `d6a784a157b9f4822dab33a9cd56fb7bda3dfb415283cb5c2acf0a731d7b5ef9`.
  The crop region is official Anexo image pixels
  `{ x: 32, y: 85, width: 200, height: 145 }`, covering the R.1 sign and its
  external printed catalog caption `NO AVANZAR`.
- Extraction command:
  `sips -s format jpeg -s formatOptions 100 --cropToHeightWidth 145 200 --cropOffset 85 32 content/official-documents/originals/decreto-779-1995-anexo-l-senalizacion-vial-uniforme-images/dec196AnexoIII-01.jpg --out content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/app4-signs-regulatory/no-avanzar-source-as-is.jpg`.
  Runtime asset and validation crop are byte-identical `200x145` JPEG files:
  `content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/app4-signs-regulatory/no-avanzar-source-as-is.jpg`
  and
  `content/validation/manual-guide/app4-signs-regulatory/page-185-no-avanzar-source-crop.jpg`,
  SHA-256
  `037f998385ae004aeb7bf4ece381ea6cf4e6b0eaec77d8c2a2f5816cb783afba`.
- Direct CABA page `185` PDF/original probes were recorded in
  `content/validation/manual-guide-no-avanzar-source-crop.evidence.json`.
  Scale `12`, `20`, and `36` attempts all remained source-limited for useful
  sign-caption glyph detail (`~503-504` useful-width pixels), so the retained
  official Anexo L R.1 source image was selected for the focused runtime card
  while the CABA Appendix IV sheets remain overview context.
- Runtime card:
  `app4-regulatory-no-avanzar-source-card` in
  `src/data/manual-sections/app4-signs-regulatory.ts`, title
  `Проезд запрещен`, `displayMode: "full-width"`, `maxDisplayWidthPx: 200`,
  `minDisplayWidthPx: 200`, and no browser upscaling. Separate selectable DOM
  term translation below the protected image is `NO AVANZAR` ->
  `Проезд запрещен`.
- Protected-image boundary: the sign body, red ring/slash, black arrow, and the
  Spanish `NO AVANZAR` catalog-caption pixels inside the crop remain unchanged.
  No AI generation, redraw, retouch, cleanup, mask, recolor, translation, or
  reconstruction was performed inside the image. The Russian wording appears
  only in DOM outside the image; ambiguous sign/plate/tablet/placard text
  remains protected by default.
- Registry/evidence/tests updated:
  `content/manuals/gcba-manual-vehiculo-4-ruedas-2023/interactive-guide/section-registry.chapters-1-2.json`,
  `content/validation/manual-guide-visual-content-crop.evidence.json`,
  `content/validation/manual-guide-visual-completeness.evidence.json`,
  `content/validation/manual-guide-no-avanzar-source-crop.evidence.json`,
  `scripts/manual-visual-content-inventory.mjs`,
  `scripts/manual-guide-visual-completeness-audit.mjs`,
  `tests/content-manual-guide-chapters.test.mjs`, and `tests/e2e/app.spec.ts`.
  Static tests assert the focused asset dimensions/hash, source-integrity crop,
  no-upscale runtime metadata, `officialSignException`, separate term
  translation, and that representative Appendix IV scope remains visible in
  `remainingRequiredExamples`.
- Verification for this slice after the evidence update passed:
  `node scripts/manual-guide-visual-completeness-audit.mjs`;
  `node --test tests/content-manual-guide-chapters.test.mjs` (`97` tests,
  `97` pass, `0` fail); `pnpm run validate:manual-guide`;
  `pnpm run validate:content`; `pnpm exec tsc --noEmit`; `pnpm run build`
  passed and generated the service worker with `1864` cached assets; focused
  Playwright source-card scenario
  `pnpm exec playwright test tests/e2e/app.spec.ts --grep "Manual guide full-width source image cards stay readable and avoid upscaling" --project=chromium`
  passed (`1` test, `1` pass). The Playwright scenario captures desktop and
  mobile screenshots for `/#manual-section-app4-signs-regulatory`, verifies the
  focused card is visible, the separate DOM translation is present, banned
  learner-facing provenance words are absent from the card, the image renders
  at its natural `200px` width without browser upscaling, and the focused sign's
  red-ring bbox is more than `1.45x` wider than the same sign measured inside
  the overview sheet.

## Blind-Spot Source Visual Evidence - 2026-06-05

- Implementation Agent blind-spot slice continued in assigned PR `#200`
  worktree
  `/Users/chap/devel/cabadrive-worktrees/034-manual-visual-content-crop`,
  branch `codex/034-manual-visual-content-crop`. Startup status before edits
  was clean on assigned head
  `786bef87bb50d303e7a3cced6439520bf6eb73d9`; parallel worktree/branch/PR
  preservation was honored and no sibling worktrees, branches, commits, dirty
  diffs, PR state, or process memory were reverted.
- The user-reported official visual headed
  `¿A qué se denomina punto ciego?` is implemented as
  `app1-blind-spot-source-card` in
  `src/data/manual-sections/app1-safety-elements.ts`, immediately after the
  `mirrors-and-blind-spots` block. Runtime title/body/term translations are
  Russian DOM text outside the image; learner-facing provenance wording such as
  `источник`, `исходный фрагмент`, `рабочий фрагмент`, and
  `Визуал источника` is absent from the card.
- Source page numbering is intentionally offset and recorded explicitly:
  printed/manual page `108` is rendered by the local PDF/page asset
  `content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/pages/page-109.jpg`
  and PDF helper `sourcePage: 109`. Evidence and crop filenames use
  `page-108` for the printed/manual page; registry extraction evidence records
  `pdfPage: 109` for the render/PDF page.
- Official source extraction used
  `content/official-documents/originals/gcba-manual-vehiculo-4-ruedas-2023.pdf`
  through `scripts/manual-visual-content-crops.swift` with direct PDF region
  rendering. The recorded source region is
  `{ x: 838, y: 1100, width: 1525, height: 1100 }` at base scale `5`; final
  trim is `{ x: 363, y: 1, width: 546, height: 440 }`, removing only unrelated
  surrounding page content/whitespace and the printed page number.
- Runtime asset
  `content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/app1-safety-elements/blind-spot-source-as-is.jpg`
  and validation crop
  `content/validation/manual-guide/app1-safety-elements/page-108-blind-spot-source-crop.jpg`
  are byte-identical `546x440` JPEG files, SHA-256
  `b5457a99da41bbb3f46985072e39641c20ee408844bd34f83051eefa55e2ed35`.
  Crop evidence is recorded in
  `content/validation/manual-guide-blind-spot-source-crop.evidence.json`.
- Source quality disposition is
  `source-limited-native-raster-in-official-pdf`: the official PDF embeds this
  visual at limited raster detail, so the committed crop preserves the best
  official direct-PDF pixels as-is, trims tightly, caps display at natural
  `546px` width, and prevents browser upscaling rather than enlarging a
  thumbnail.
- Protected-image boundary: the Spanish internal pixels, including
  `PUNTO CIEGO AUTOS`, `PUNTO CIEGO MOTOS`, `CAMIONES Y COLECTIVOS`, and
  `Cuanto más grande es el vehículo, mayor es el punto ciego.`, remain
  unchanged. No translation, relabeling, redraw, recolor, cleanup, retouch,
  mask, inpaint, or reconstruction was performed inside the image. Russian
  explanations/translations are separate DOM text outside the protected image.
- Registry/evidence/tests updated:
  `content/manuals/gcba-manual-vehiculo-4-ruedas-2023/interactive-guide/section-registry.chapters-1-2.json`,
  `content/validation/manual-guide-visual-completeness.evidence.json`,
  `content/validation/manual-guide-visual-content-crop.evidence.json`,
  `scripts/manual-guide-visual-completeness-audit.mjs`,
  `scripts/manual-visual-content-inventory.mjs`,
  `tests/content-manual-guide-chapters.test.mjs`, and `tests/e2e/app.spec.ts`.
  The audit recorded `blind-spot-visual` as `implemented`; at that slice's
  close, tire manufacturing/tread-life still remained pending and
  `NO AVANZAR` remained `implemented-representative`.
- Verification for this slice passed:
  `node scripts/manual-guide-visual-completeness-audit.mjs`;
  `node scripts/manual-visual-content-inventory.mjs`;
  `node --test tests/content-manual-guide-chapters.test.mjs` (`97` tests,
  `97` pass, `0` fail); `pnpm run validate:manual-guide`;
  `pnpm run validate:content`; `pnpm exec tsc --noEmit`; `pnpm run build`
  passed and generated the service worker with `1865` cached assets; focused
  Playwright source-card scenario
  `pnpm exec playwright test tests/e2e/app.spec.ts --grep "Manual guide full-width source image cards stay readable and avoid upscaling" --project=mobile`
  passed (`1` test, `1` pass); the same focused scenario with
  `--project=chromium` passed (`1` test, `1` pass). A first parallel Chromium
  attempt failed before running tests because the mobile run already occupied
  preview port `5205`; Chromium was rerun sequentially and passed.

## Tire Manufacturing / Tread-Life Source Visual Evidence - 2026-06-05

- Replacement Implementation Agent continued the assigned PR `#200` worktree
  `/Users/chap/devel/cabadrive-worktrees/034-manual-visual-content-crop`,
  branch `codex/034-manual-visual-content-crop`, from committed head
  `6b6fe48fd58184cac167fadc6aa529ad88a9c729`. The dirty tire slice left by the
  previous worker was preserved and adopted; no sibling worktrees, branches,
  commits, dirty diffs, PR state, or process memory were reverted.
- The user-reported official visual headed `Fecha de Fabricación` and
  `Vida útil de los Neumáticos` is implemented as
  `app1-tire-manufacturing-tread-life-source-card` in
  `src/data/manual-sections/app1-safety-elements.ts`, immediately after the
  pressure/depth callout. Runtime title, body, and term translations are
  Russian DOM text outside the image; learner-facing provenance wording such
  as `источник`, `исходный фрагмент`, `рабочий фрагмент`,
  `Визуал источника`, and `Главный вывод источника` is absent from the card.
- Runtime asset
  `content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/app1-safety-elements/tire-manufacturing-tread-life-source-as-is.jpg`
  and validation crop
  `content/validation/manual-guide/app1-safety-elements/page-108-tire-manufacturing-tread-life-source-crop.jpg`
  are byte-identical `760x995` JPEG files, SHA-256
  `1ee27aab0a0def7d6b0cd859adabb5f604889e1da604db54bf5cb0d8de7bdbf9`.
  Crop evidence is recorded in
  `content/validation/manual-guide-tire-manufacturing-tread-life-source-crop.evidence.json`.
- Source page and crop evidence: printed/manual page `108`, source region
  `{ x: 1115, y: 1635, width: 760, height: 995 }` from the retained official
  page-108 x5 render. The crop removes only outer page whitespace around the
  tire manufacturing/date, tread-life, recommendations, and pressure visual.
- Protected-image boundary: Spanish internal pixels, including headings,
  tire date callout, tread-life chart, bullets, `Recomendaciones`, and pressure
  labels, remain unchanged. No translation, relabeling, redraw, recolor,
  cleanup, retouch, mask, inpaint, or reconstruction was performed inside the
  image. Russian explanations/translations are separate DOM text outside the
  protected image.
- Registry/evidence/tests updated:
  `content/manuals/gcba-manual-vehiculo-4-ruedas-2023/interactive-guide/section-registry.chapters-1-2.json`,
  `content/validation/manual-guide-visual-completeness.evidence.json`,
  `content/validation/manual-guide-visual-content-crop.evidence.json`,
  `scripts/manual-guide-visual-completeness-audit.mjs`,
  `scripts/manual-visual-content-inventory.mjs`,
  `tests/content-manual-guide-chapters.test.mjs`, and `tests/e2e/app.spec.ts`.
  The audit now records `tire-manufacturing-tread-life` as
  `implemented-app1-canonical` and removes it from remaining required examples.

## Appendix IV Anexo Regulatory Panel Evidence - 2026-06-05

- Implementation Agent continued assigned PR `#200` in clean worktree
  `/Users/chap/devel/cabadrive-worktrees/034-manual-visual-content-crop`,
  branch `codex/034-manual-visual-content-crop`, from required head
  `f0414c449aa877fd96cbebff523373f3d58a7cd1`. Startup status before edits was
  `## codex/034-manual-visual-content-crop...origin/codex/034-manual-visual-content-crop`
  with no dirty files. Parallel worktree/branch/PR/process memory preservation
  was honored.
- Added large protected official Anexo L regulatory panels before the CABA
  page `185`/`186` overview sheets in
  `src/data/manual-sections/app4-signs-regulatory.ts`. The focused
  `app4-regulatory-no-avanzar-source-card` remains in place.
- Runtime assets are byte-identical copies from retained official source files
  under
  `content/official-documents/originals/decreto-779-1995-anexo-l-senalizacion-vial-uniforme-images/`:
  `dec196AnexoIII-01.jpg` ->
  `anexo-regulatory-panel-01-source-as-is.jpg`, `615x743`, SHA-256
  `d6a784a157b9f4822dab33a9cd56fb7bda3dfb415283cb5c2acf0a731d7b5ef9`;
  `dec196AnexoIII-02.jpg` ->
  `anexo-regulatory-panel-02-source-as-is.jpg`, `618x733`, SHA-256
  `1661401f0b8ce8036cab1e489e67ad29be05bfd78d695b396d18b67083230be6`;
  `dec196AnexoIII-03.jpg` ->
  `anexo-regulatory-panel-03-source-as-is.jpg`, `616x734`, SHA-256
  `ba8b2b3dca9b02e564fe0f4d463d36449b748ddb63e8ad7163eb29624e65eea3`;
  `dec196AnexoIII-04.jpg` ->
  `anexo-regulatory-panel-04-source-as-is.jpg`, `616x694`, SHA-256
  `93a4a1c7267b4ad8122c944c0cfaa420aa3dc7be8b39c6107e72903f77b9c868`.
- Panel `05` was inspected and not added because it starts `P.*` warning-sign
  material, not the page `186` regulatory end-of-prescription scope. Panels
  `01`/`02` cover page `185` and first page-`186` prohibitions/restrictions;
  panels `03`/`04` cover the remaining page-`186` exclusive circulation,
  mandatory direction, priority, control, and end-of-prescription material.
- Protected-image boundary: all sign bodies, symbols, numbers, supplementary
  plates/tablets, placards, Spanish catalog captions, and panel pixels remain
  unchanged. No translation, relabeling, redraw, recolor, cleanup, retouch,
  mask, inpaint, resize, or reconstruction was performed inside the images.
  Russian translations are separate selectable DOM `termTranslations` below
  the protected images.
- Runtime status/evidence changed from broad `implemented-representative`
  wording to `implemented-regulatory-panels-with-caba-overview`. Existing CABA
  page `185`/`186` source-sheet crops remain after the Anexo panels as
  CABA overview/local variants because the CABA manual may include local sheet
  context not replaced by the Anexo panels.
- Updated registry/evidence/audit/inventory/tests:
  `content/manuals/gcba-manual-vehiculo-4-ruedas-2023/interactive-guide/section-registry.chapters-1-2.json`,
  `content/validation/manual-guide-visual-completeness.evidence.json`,
  `content/validation/manual-guide-visual-content-crop.evidence.json`,
  `scripts/manual-guide-source-fidelity.mjs`,
  `scripts/manual-guide-visual-completeness-audit.mjs`,
  `scripts/manual-visual-content-inventory.mjs`,
  `tests/content-manual-guide-chapters.test.mjs`, and `tests/e2e/app.spec.ts`.
  The source-fidelity checker now accepts
  `retained-official-original-image-copy` as an explicit high-resolution target
  for byte-identical retained official originals.
- Verification passed:
  `node scripts/manual-guide-visual-completeness-audit.mjs`;
  `node scripts/manual-visual-content-inventory.mjs`;
  `node --test tests/content-manual-guide-chapters.test.mjs` (`97` tests,
  `97` pass, `0` fail); `pnpm run validate:manual-guide`;
  `pnpm run validate:content`; `pnpm exec tsc --noEmit`; `pnpm run build`
  passed and generated the service worker with `1870` cached assets; focused
  Playwright
  `pnpm exec playwright test tests/e2e/app.spec.ts --grep "Manual guide full-width source image cards stay readable and avoid upscaling" --project=chromium`
  passed (`1` test, `1` pass); the same focused Playwright command with
  `--project=mobile` passed (`1` test, `1` pass);
  `node scripts/check-feature-memory.mjs --worktree` passed; `git diff --check`
  passed.

## Architect Disposition: Current-Head AI Review Required Fixes - 2026-06-05

- Architect disposition was recorded for PR `#200` current head
  `ec2125ffa28cc5b079f7c0ed777b1ef9aba5e097` at
  `2026-06-05T17:49:29-03:00`. Both current-head P2 AI Review findings are
  accepted as same-cycle required fixes and block final validation.
- Required implementation task: fix
  `scripts/manual-guide-visual-completeness-audit.mjs` so
  `remainingRequiredExamples` or equivalent disposition evidence does not drop
  app-specific partial records merely because the status starts with
  `implemented`. In particular, `matafuegos-chaleco-reflectivo` currently uses
  `implemented-app1-only` while its notes say App2/App3 equipment visuals
  remain pending; that residual scope must stay visible or be renamed/classified
  so it is not mistaken for complete whole-document coverage. Implementation
  may update status/notes only if it explicitly validates against the original
  user request that App2/App3 equipment visuals are truly out of this feature
  and no longer a user-required example.
- Required implementation task: correct the learner-facing Russian translation
  for `NO AVANZAR` everywhere visible and evidence-tested, including
  `src/data/manual-sections/app4-signs-regulatory.ts` and generated evidence or
  tests that assert the term translation. `Движение прямо запрещено` is
  misleading because it implies only straight-ahead movement is forbidden.
  Prefer `Проезд запрещен` or another accurate phrase that means not to
  proceed/enter past the sign. Keep protected image pixels unchanged, including
  the Spanish `NO AVANZAR` catalog-caption pixels inside the source crop and
  regulatory panels.
- Required evidence/tests for the next Implementation Agent: focused audit or
  content tests must prove partial app-specific statuses remain surfaced in
  remaining/disposition evidence, and content/runtime/evidence assertions must
  prove the corrected `NO AVANZAR` Russian translation is used while the old
  straight-ahead-only wording is absent from learner-facing/evidence-tested
  locations. Record commands and outcomes here after implementation.

## AI Review P2 Translation And Partial-Status Fix Evidence - 2026-06-05

- Implementation Agent continued assigned PR `#200` in
  `/Users/chap/devel/cabadrive-worktrees/034-manual-visual-content-crop`,
  branch `codex/034-manual-visual-content-crop`, from committed head
  `ec2125ffa28cc5b079f7c0ed777b1ef9aba5e097`. Startup status preserved dirty
  Architect-owned feature-memory edits in `spec.md`, `plan.md`, and
  `tasks.md`; parallel worktree/branch/PR/process memory preservation was
  honored.
- Corrected the learner-facing `NO AVANZAR` Russian translation in
  `src/data/manual-sections/app4-signs-regulatory.ts` from the
  straight-ahead-only wording to `Проезд запрещен` for both the focused
  `app4-regulatory-no-avanzar-source-card` title/term translation and the
  Anexo L panel `01` separate DOM term translation. Protected sign/panel image
  pixels, Spanish catalog-caption pixels, asset files, crop regions, hashes,
  and no-upscale display metadata were not modified.
- Updated evidence-tested translation records in
  `content/validation/manual-guide-no-avanzar-source-crop.evidence.json` and
  regenerated
  `content/validation/manual-guide-visual-completeness.evidence.json` via
  explicit `node scripts/manual-guide-visual-completeness-audit.mjs --write`.
  Content and Playwright tests now assert `NO AVANZAR` -> `Проезд запрещен`
  and assert the prior misleading Russian wording is absent from the runtime
  module/card.
- Updated `scripts/manual-guide-visual-completeness-audit.mjs` so
  `remainingRequiredExamples` uses explicit complete-status semantics instead
  of a broad `status.startsWith("implemented")` filter. Partial statuses such
  as `implemented-app1-only` and `implemented-app2-only` remain visible unless
  future Architect/Implementation work records them as fully complete or
  explicitly out of scope.
- Regenerated visual-completeness evidence now keeps
  `matafuegos-chaleco-reflectivo` visible in `remainingRequiredExamples` with
  status `implemented-app1-only` and notes that App2/App3 equipment visuals
  remain outside this slice. The same evidence continues to treat
  `implemented-regulatory-panels-with-caba-overview`, `blind-spot-visual`, and
  `tire-manufacturing-tread-life` as complete for this review-fix scope, so
  those examples do not reappear in the remaining list.
- Verification passed after this note:
  `node scripts/manual-guide-visual-completeness-audit.mjs --write` regenerated
  visual-completeness evidence; `node scripts/manual-visual-content-inventory.mjs`
  passed with `46` source-image cards, `2` source-artwork blocks, and `16`
  corrected Appendix IV crops; `node scripts/manual-guide-visual-completeness-audit.mjs`
  passed in read-only check mode; `node --test tests/content-manual-guide-chapters.test.mjs`
  passed with `97` tests; `pnpm run validate:manual-guide` passed;
  `pnpm run validate:content` passed; `pnpm exec tsc --noEmit` passed;
  `pnpm run build` passed and generated the service worker with `1870` cached
  assets, with only the existing Vite large-chunk warning; focused Playwright
  `pnpm exec playwright test tests/e2e/app.spec.ts --grep "Manual guide full-width source image cards stay readable and avoid upscaling" --project=chromium`
  passed (`1` test); `node scripts/check-feature-memory.mjs --worktree`
  passed; `git diff --check` passed.

## Architect Disposition: Current-Head Unicode Audit And E2E Timeout Blockers - 2026-06-05

- [x] T153 Architect receives and dispositions AI Review P2 thread
  `PRRT_kwDOSX65IM6Herjc` for PR `#200` current head
  `d062fee35daa445d2caadbd2770900d1b93d2263`, path
  `scripts/manual-guide-visual-completeness-audit.mjs`, around line `94`.
  The finding is accepted as a same-cycle required fix: the
  learner-facing provenance-copy audit must not use JavaScript ASCII `\b`
  boundaries for Cyrillic source-word detection.
- [x] T154 Architect receives and dispositions current-head `baseline-checks`
  CI failure on the same head. The e2e test
  `Manual guide full-width source image cards stay readable and avoid
  upscaling` timed out in `tests/e2e/app.spec.ts` around lines `4762` and
  `4778` while awaiting `image.decode()` during image sizing checks.
  Implementation Agent Curie is assigned to stabilize this as same-cycle CI
  blocker work.
- [x] T155 Implementation Agent must update the learner-facing provenance-copy
  audit to use Unicode-aware boundaries/lookarounds or explicit
  Cyrillic/non-Cyrillic boundary checks. Forbidden learner-visible provenance
  words and phrases including `источник`, `источника`, `из источника`,
  `Визуал источника`, and `Главный вывод источника` must be detected even when
  adjacent to Cyrillic letters, punctuation, or common Russian inflection.
- [x] T156 Implementation Agent must preserve the legitimate allowlist for
  semantic non-provenance usage, specifically `источник стресса`, and ensure
  that allowlist does not permit visual/source provenance labels.
- [x] T157 Implementation Agent must add focused audit tests or fixtures for
  the Unicode/Cyrillic boundary behavior. Required cases: forbidden
  `источник`, inflected forbidden `источника`, phrase `из источника`, at least
  one explicit visual/source label such as `Визуал источника` or
  `Главный вывод источника`, and allowed `источник стресса`.
- [x] T158 Implementation Agent Curie must stabilize the Playwright image
  sizing helper/check so it does not hang indefinitely on `image.decode()`.
  The replacement path should use bounded waiting/fallbacks for image
  readiness and natural dimensions, handle lazy-loaded guide images
  deterministically, and fail clearly for broken images, zero natural
  dimensions, upscaled display, or unreadable useful-content sizing. It must
  not weaken the no-upscale/readability assertions for full-width source image
  cards.
- [x] T159 Implementation Agent must record focused verification for the
  Unicode audit fix: focused unit/content/audit tests, read-only
  `node scripts/manual-guide-visual-completeness-audit.mjs`, and evidence that
  the committed visual-completeness evidence remains current or is regenerated
  only through explicit write mode when needed.
- [x] T160 Implementation Agent Curie must record CI stabilization evidence:
  the focused Playwright command
  `pnpm exec playwright test tests/e2e/app.spec.ts --grep "Manual guide full-width source image cards stay readable and avoid upscaling"`
  in the failing CI project(s) where feasible, plus
  `node scripts/check-feature-memory.mjs --worktree` and `git diff --check`.
  If full `baseline-checks` cannot be run locally, record the reason and the
  closest reproducible focused command output.
- [x] T161 Final validation remains blocked until T155-T160 are implemented,
  evidenced, and any resulting review/CI findings are resolved or explicitly
  dispositioned by Architect through Orchestrator.

## Implementation Evidence: Unicode Audit And E2E Timeout Blockers - 2026-06-05

- Implementation Agent Curie adopted Architect disposition recorded in
  `spec.md`, `plan.md`, and T153-T161 above. Existing Architect-owned
  `spec.md`/`plan.md` changes were preserved and not edited by Implementation
  Agent.
- Unicode audit fix: updated
  `scripts/manual-guide-visual-completeness-audit.mjs` so
  `source-family-provenance` uses Unicode-aware lookarounds/property escapes
  instead of JavaScript ASCII `\b`; preserved the semantic `источник стресса`
  allowlist; and tightened allowlist behavior so allowed text is removed from
  the scan without letting another provenance phrase in the same literal pass.
  Added `MANUAL_GUIDE_SECTION_ROOT` test override for focused fixture coverage.
- Unicode audit test evidence:
  `node --test tests/manual-guide-visual-completeness-audit.test.mjs` passed
  with `2` tests. The focused fixture rejects `источник`, `источника`,
  `из источника`, and `Визуал источника`, while allowing
  `источник стресса`. Read-only
  `node scripts/manual-guide-visual-completeness-audit.mjs` passed and checked
  committed evidence at
  `content/validation/manual-guide-visual-completeness.evidence.json`; no
  write-mode evidence regeneration was needed.
- E2E timeout stabilization: updated `tests/e2e/app.spec.ts` with bounded
  `expectRenderedManualImage` polling for visible, complete images with
  positive natural dimensions and nonzero rendered rects. The affected
  full-width source-image sizing checks now measure synchronously after the
  bounded readiness check instead of awaiting unbounded `image.decode()` inside
  browser `evaluate()` calls. Existing assertions for display mode, useful
  content, rendered size, natural dimensions, no browser upscaling, and mobile
  no-overflow behavior remain in place.
- Verification passed after this note:
  `pnpm exec tsc --noEmit`; `pnpm run validate:content` with `460` category B
  fallback questions and `276` local image references; `pnpm run build`, which
  generated the service worker with `1870` cached assets and emitted only the
  existing Vite large-chunk warning; focused Playwright
  `pnpm exec playwright test tests/e2e/app.spec.ts -g "Manual guide full-width source image cards stay readable and avoid upscaling" --project=chromium --project=mobile`
  passed with `2` tests, `2` passed (`chromium` `5.1s`, `mobile` `14.2s`,
  total `16.8s`); `node scripts/check-feature-memory.mjs --worktree` passed;
  `git diff --check` passed. Full GitHub `baseline-checks` was not run locally;
  the closest local reproduction used the failing Playwright grep in both
  relevant projects plus the same build/content/TypeScript gates above.

## Architect Disposition: Blind-Spot Source Page Metadata P2 - 2026-06-05

- [x] T162 Architect receives and dispositions Codex AI Review P2 for PR
  `#200` current head `2a2a196a0f8f2402d4441c52de57d968e1880fdd`, comment
  `4439754562`, discussion `r3365430389`, path
  `src/data/manual-sections/app1-safety-elements.ts`, line `224`. At the time
  of finding, required checks except AI Review had passed on `2a2a196`; AI
  Review produced this P2.
- [x] T163 Architect classifies the finding as a same-cycle blocker for
  feature `034`, not a future ticket. The blind-spot source visual points to
  `page-108-blind-spot-source-crop.jpg` and records official printed/manual
  page `108`, but the rendered card exposes `data-source-page="109"`. This can
  mislead provenance display, audits, and screenshot evidence.
- [x] T164 Implementation Agent must align `app1-blind-spot-source-card`
  runtime/source metadata so the official printed/manual source page is `108`
  in `sourcePage`, rendered `data-source-page`, learner-facing provenance, and
  runtime audit surfaces. Any PDF/render asset offset `109` must be retained
  only in explicitly named internal evidence fields such as `pdfPage`,
  `renderPage`, or equivalent.
- Evidence: changed the runtime card in
  `src/data/manual-sections/app1-safety-elements.ts` from `sourcePage: 109` to
  `sourcePage: 108`. The renderer therefore emits
  `data-source-page="108"` for `app1-blind-spot-source-card`. The PDF/render
  offset remains evidence-only through
  `sourceRegionMetadata.extractionScaleEvidence.pdfPage: 109` and the crop
  evidence fields `pdfPage: 109` / `renderPage: 109`.
- [x] T165 Implementation Agent must update validation evidence, visual
  completeness evidence, crop inventory, registry records, and screenshot or
  Playwright evidence so they consistently distinguish official page `108`
  from PDF/render page `109` for `app1-blind-spot-source-card`.
- Evidence: updated
  `content/validation/manual-guide-blind-spot-source-crop.evidence.json` so
  the crop target records `sourcePage: 108`, `pdfPage: 109`, and
  `renderPage: 109`; updated the visual-completeness audit and crop inventory
  scripts to read the explicit internal PDF/render fields; regenerated/checked
  `content/validation/manual-guide-visual-completeness.evidence.json` and
  `content/validation/manual-guide-visual-content-crop.evidence.json` with no
  additional committed evidence drift. Registry source-region metadata already
  recorded official page `108` and internal `pdfPage: 109`.
- [x] T166 Implementation Agent must add or update focused tests so the
  blind-spot card fails if `data-source-page` regresses to `109`, if
  `sourcePage` is ambiguous, or if evidence treats the PDF/render page offset
  as the official source page.
- Evidence: updated `tests/content-manual-guide-chapters.test.mjs` to assert
  runtime `blindSpotCard.sourcePage === 108` and crop evidence
  `sourcePage === 108`, `pdfPage === 109`, `renderPage === 109`; updated the
  focused Playwright test to assert the rendered
  `app1-blind-spot-source-card` has `data-source-page="108"` and not `109`.
- [x] T167 Implementation Agent must not change protected blind-spot image
  pixels while fixing metadata. Evidence must preserve or recheck the existing
  `546x440` dimensions and SHA-256
  `b5457a99da41bbb3f46985072e39641c20ee408844bd34f83051eefa55e2ed35` for
  `blind-spot-source-as-is.jpg` and
  `page-108-blind-spot-source-crop.jpg`, unless Orchestrator assigns a
  separate image-extraction task.
- Evidence: no protected image assets were edited. Rechecked both
  `content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/app1-safety-elements/blind-spot-source-as-is.jpg`
  and
  `content/validation/manual-guide/app1-safety-elements/page-108-blind-spot-source-crop.jpg`
  with `sips` and `shasum -a 256`; both are still `546x440` and SHA-256
  `b5457a99da41bbb3f46985072e39641c20ee408844bd34f83051eefa55e2ed35`.
- [x] T168 Implementation Agent must run and record focused verification for
  this review fix: targeted content/static tests for blind-spot metadata,
  focused Playwright or DOM evidence proving `data-source-page="108"`,
  `node scripts/manual-guide-visual-completeness-audit.mjs`,
  `node scripts/manual-visual-content-inventory.mjs` if inventory/evidence is
  updated, `pnpm run validate:manual-guide`, `pnpm run validate:content`,
  `pnpm exec tsc --noEmit`, `node scripts/check-feature-memory.mjs --worktree`,
  and `git diff --check`. Rerun broader build/preflight if the metadata or
  evidence changes affect those gates.
- Evidence passed before this note:
  `node --test tests/content-manual-guide-chapters.test.mjs` (`97` tests);
  `node --test tests/manual-guide-visual-completeness-audit.test.mjs`
  (`2` tests); `node scripts/manual-guide-visual-completeness-audit.mjs
  --write`; `node scripts/manual-guide-visual-completeness-audit.mjs`;
  `node scripts/manual-visual-content-inventory.mjs`; `pnpm run
  validate:manual-guide`; `pnpm run validate:content`; `pnpm exec tsc
  --noEmit`; `pnpm run build`, which generated the service worker with `1870`
  cached assets and emitted only the existing Vite large-chunk warning; and
  focused Playwright
  `pnpm exec playwright test tests/e2e/app.spec.ts -g "Manual guide
  full-width source image cards stay readable and avoid upscaling"
  --project=chromium --project=mobile` (`2` passed, including DOM evidence for
  `data-source-page="108"`).
- [x] T169 Final validation remains blocked until T164-T168 are implemented,
  evidenced, and the AI Review P2 is resolved or made outdated by the fix.
  Final disposition: T164-T168 are complete, the latest AI Review passed on
  current head `860a4ef4ab66a28b066625d4ffe52f526cce2d5b`, and the metadata
  P2 is resolved or superseded.

## Architect Disposition: Current-Head E2E Visibility CI Blocker - 2026-06-05

- [x] T170 Architect receives and dispositions PR `#200` current head
  `7950b516933514948dcd2dad8b8c33af14ccbc3f`: required
  `baseline-checks` failed while `AI Review`, `docker-validation`, `guard`,
  and `osv-scan` passed. The failure is in `pnpm run test:e2e` after
  build/content validation passed and `80` tests passed.
- [x] T171 Architect classifies this as a same-cycle CI blocker for feature
  `034`, not a future ticket. The failing scenario is
  `tests/e2e/app.spec.ts:4574`,
  `Manual guide full-width source image cards stay readable and avoid
  upscaling`. Chromium resolved
  `app1-tire-manufacturing-tread-life-source-card` to the expected image but
  received hidden for `10s` at `expectRenderedManualImage`; mobile exceeded
  the default `30000ms` timeout around the same helper poll while processing
  the large source-card scenario.
- [x] T172 Implementation Agent must stabilize `expectRenderedManualImage` or
  the surrounding scenario by scrolling the actual image or containing figure
  into view before visibility, loaded/readiness, rendered-rect,
  natural-dimension, useful-content-width, no-upscale, and overflow checks.
  Scrolling only the card is insufficient for lazy/offscreen/large manual
  images in CI.
- Evidence: updated `tests/e2e/app.spec.ts` helper
  `expectRenderedManualImage` so it scrolls the nearest containing `figure`
  and then the actual `img` into view before the visibility assertion and the
  loaded/rendered polling check. The existing helper still requires the image
  to be visible, complete, have positive natural dimensions, and have a
  nonzero rendered rect before callers collect useful-content and sizing
  metrics.
- [x] T173 Implementation Agent must keep the content requirements intact:
  positive natural dimensions, visible nonzero rendered rect, no browser
  upscaling beyond natural/source dimensions, useful-content width/readability,
  and no mobile document-level overflow. Do not skip the tire card or weaken
  the test because the image is large or lazy-loaded.
- Evidence: no card IDs, natural-size checks, useful-content calculations,
  no-upscale assertions, readable scroll-card assertions, or document-overflow
  assertions were removed or relaxed. The tire card remains in the scenario
  with its existing `760x995` natural-size expectation, no-upscale check,
  rendered-width lower bound, term-translation checks, and protected
  source-as-is metadata checks.
- [x] T174 If timeout changes are needed, Implementation Agent must make them
  targeted to this large multi-section/source-card scenario or to the specific
  helper readiness expectation. Evidence must explain why the timeout covers
  legitimate CI workload across many sections/viewports/screenshots and does
  not mask a hidden, broken, unreadable, overflowing, or upscaled product
  image.
- Evidence: added `test.setTimeout(90_000)` only inside
  `Manual guide full-width source image cards stay readable and avoid
  upscaling`. This scenario loops across desktop and mobile viewports,
  multiple manual sections, many source-image cards, mobile readable-scroll
  checks, canvas useful-content calculations, and section screenshots. The
  timeout is scoped to that workload only and does not mask product failures
  because every image still must be visible, loaded, rendered with nonzero
  bounds, within natural-size/no-upscale limits, useful-content readable where
  required, and free of document-level horizontal overflow.
- [x] T175 Implementation Agent must record focused verification for this CI
  blocker: the Playwright grep
  `pnpm exec playwright test tests/e2e/app.spec.ts -g "Manual guide
  full-width source image cards stay readable and avoid upscaling"` in
  Chromium and mobile where feasible, plus any build/content validation gates
  rerun from the failed `baseline-checks` path, `node
  scripts/check-feature-memory.mjs --worktree`, and `git diff --check`.
  If full `baseline-checks` cannot be reproduced locally, record the closest
  local command evidence and reason.
- Evidence passed:
  `pnpm exec playwright test tests/e2e/app.spec.ts -g "Manual guide
  full-width source image cards stay readable and avoid upscaling"
  --project=chromium --project=mobile` (`2` passed: chromium in `5.5s`,
  mobile in `14.5s`); `pnpm run validate:content`; `pnpm exec tsc
  --noEmit`; and `pnpm run build`, including its validation stage and service
  worker generation with `1870` cached assets; `node
  scripts/check-feature-memory.mjs --worktree`; and `git diff --check`.
- [x] T176 Final validation remains blocked until T172-T175 are implemented,
  evidenced, and the current-head `baseline-checks` failure is resolved or
  superseded by passing required checks on a newer PR head. Final disposition:
  T172-T175 are complete and `baseline-checks` passed on current head
  `860a4ef4ab66a28b066625d4ffe52f526cce2d5b` at `2026-06-05T21:48:33Z`.

## Final Architect Validation - 2026-06-05

- Architect validation pass: passed
- Final Architect validation completed at: 2026-06-05T18:53:45-03:00
- Architect validated effective content head: 860a4ef4ab66a28b066625d4ffe52f526cce2d5b
- Cycle PR set: PR `#200`
  <https://github.com/cucumberfalse/cabadrive/pull/200>, branch
  `codex/034-manual-visual-content-crop`, effective content head
  `860a4ef4ab66a28b066625d4ffe52f526cce2d5b`, status included in final
  validation. Later current PR heads after final-validation evidence commits
  are not the validated effective content head unless the final Orchestrator
  current-PR-head guard proves the intervening diff is evidence-only.
- Current PR/check evidence verified by Architect before this note:
  PR headRefOid `860a4ef4ab66a28b066625d4ffe52f526cce2d5b`, mergeable
  `MERGEABLE`, not draft; required checks passed on current head:
  `AI Review` success at `2026-06-05T21:50:48Z`, `baseline-checks` success at
  `2026-06-05T21:48:33Z`, `docker-validation` success,
  `guard` success, and `osv-scan` success.
- Architect validation evidence: local HEAD matches the effective content head,
  worktree was clean before validation edits, latest visual-completeness audit
  passed in read-only check mode, `manual-visual-content-inventory` reported
  `46` source-image cards, `2` source-artwork blocks, and `16` corrected
  Appendix IV crops, and current feature memory records same-cycle
  dispositions for AI Review P1/P2 findings and CI blockers.
- Acceptance disposition: official-source fidelity, high-quality/large image
  rendering, protected-image internal text preservation, external Russian
  translations, learner-facing provenance-copy cleanup, read-only evidence
  check mode, and CI/e2e validation are evidenced for the required current
  head. No open architecture/product gap remains that should return to
  implementation before final Analyst validation.
- Residual scope disposition: visual-completeness evidence intentionally keeps
  `matafuegos-chaleco-reflectivo` visible as `implemented-app1-only` with
  App2/App3 equipment visuals not claimed complete. Architect accepts this as
  transparent non-blocking residual scope for this PR because the concrete
  user-called-out extinguisher/vest visuals are implemented from the official
  App I source, the residual is preserved for future Orchestrator disposition,
  and it is not hidden from `remainingRequiredExamples`.

## Architect Disposition: Post-Validation Evidence-Only Current-Head Guard - 2026-06-05

- [x] T177 Architect receives and dispositions Codex AI Review findings on PR
  `#200` current head `a9e321abc5eb0846ef57860769a6ebc089b846a4`: thread
  `PRRT_kwDOSX65IM6HfmSN` P1 on this `tasks.md` final-validation evidence and
  thread `PRRT_kwDOSX65IM6HfqNE` P2 on the same final-validation head/check
  evidence.
- [x] T178 Architect accepts both findings as same-cycle process blockers
  before completion/finalization. The existing final Architect validation
  marker for `860a4ef4ab66a28b066625d4ffe52f526cce2d5b` remains preserved as
  validation of the effective content head only. It must not be read as proof
  that a later evidence-only commit, including
  `a9e321abc5eb0846ef57860769a6ebc089b846a4` or any newer process-memory
  commit, was itself the effective content head at the time of validation.
- [x] T179 Implementation Agent must update process memory to distinguish
  `860a4ef4ab66a28b066625d4ffe52f526cce2d5b` as the effective content head
  from the mutable/current PR head after final-validation evidence-only
  commits. Do not edit product content, runtime files, source assets, tests,
  validation evidence JSON, package files, workflow files, or durable runtime
  docs for this process-only fix.
- Evidence: this process-memory fix preserves the final Architect and Analyst
  validation markers for
  `860a4ef4ab66a28b066625d4ffe52f526cce2d5b` and calls that SHA the effective
  content head. It no longer describes that SHA as both the current PR head
  and the effective content head after later evidence-only commits.
- [x] T180 Implementation Agent must add evidence-only-diff guard wording to
  process memory. The wording must say that any current PR head after
  validation evidence commits may differ from effective content head
  `860a4ef4ab66a28b066625d4ffe52f526cce2d5b` only by role/process memory
  evidence files such as
  `specs/034-manual-visual-content-crop/feature-request.md`,
  `specs/034-manual-visual-content-crop/tasks.md`, and any subsequent
  final-guard note. If the diff includes product behavior, runtime assets,
  tests, validation JSON, package/workflow files, durable implementation docs,
  or other non-evidence content, prior final validation is stale.
- Evidence: final-validation durability now requires the final Orchestrator
  read-only guard to prove the diff from effective content head
  `860a4ef4ab66a28b066625d4ffe52f526cce2d5b` to the actual current PR head is
  limited to role/process memory evidence files, including
  `specs/034-manual-visual-content-crop/feature-request.md`,
  `specs/034-manual-visual-content-crop/tasks.md`, and any subsequent
  final-guard note. Product behavior, runtime/source assets, tests, validation
  JSON, package/workflow files, durable implementation docs, or any other
  non-evidence content diff makes final validation stale and requires
  role-appropriate follow-up plus renewed final validation.
- [x] T181 Implementation Agent must avoid creating an impossible
  self-referential SHA requirement. The committed process memory does not need
  to know the SHA of the commit that contains itself before that commit exists.
  It must instead name effective content head
  `860a4ef4ab66a28b066625d4ffe52f526cce2d5b` and require Orchestrator to run a
  final read-only current-PR-head guard after the latest evidence-only commit.
- Evidence: this note names the effective content head but does not try to
  pre-record the SHA of the process-memory commit that contains the note.
  Orchestrator still must run the final read-only current-PR-head guard after
  the latest evidence-only commit and immediately before finalization/merge.
- [ ] T182 Orchestrator finalization remains blocked until a final read-only
  current-PR-head guard is run immediately before finalization/merge. That
  guard must compare the actual current PR head with effective content head
  `860a4ef4ab66a28b066625d4ffe52f526cce2d5b`, prove any intervening diff is
  evidence-only as defined in T180, and recheck required checks, AI Review /
  review-thread state, mergeability, conflicts, process memory currency, and
  acceptance evidence against the actual current head.
- Implementation disposition: requirement recorded and intentionally left
  pending for Orchestrator. Implementation Agent has not run or claimed the
  final Orchestrator current-PR-head guard.
- [x] T183 Implementation Agent must record process-only verification for this
  fix: `node scripts/check-feature-memory.mjs --worktree`, `git diff --check`,
  and a read-only diff/status summary proving only allowed feature-memory
  process files changed. Broader build/content/e2e checks are not required for
  this process-only update unless a non-process file changes, which would be a
  scope violation and would require Orchestrator/Architect rerouting.
- Verification evidence for this process-only fix:
  `node scripts/check-feature-memory.mjs --worktree` passed with
  `No configured product paths changed; feature-memory gate passes.`;
  `git diff --check` passed with no output. Read-only status before commit:
  `git status --short --branch` reported branch
  `codex/034-manual-visual-content-crop...origin/codex/034-manual-visual-content-crop`
  with modified process-memory files
  `specs/034-manual-visual-content-crop/plan.md`,
  `specs/034-manual-visual-content-crop/spec.md`, and
  `specs/034-manual-visual-content-crop/tasks.md`. The `spec.md` and
  `plan.md` changes are preserved Architect-owned process-memory edits from
  T177-T178 disposition; Implementation-owned process fix changes are in this
  `tasks.md` note. Read-only evidence-only context:
  `git diff --name-status
  860a4ef4ab66a28b066625d4ffe52f526cce2d5b..HEAD` reported only
  `M specs/034-manual-visual-content-crop/feature-request.md` and
  `M specs/034-manual-visual-content-crop/tasks.md`. Working-tree diff name
  status before commit reported only process-memory files under
  `specs/034-manual-visual-content-crop/`: `plan.md`, `spec.md`, and
  `tasks.md`. No product, runtime, source asset, test, validation JSON,
  package, workflow, or durable runtime-doc file changed for this process-only
  fix; broader build/content/e2e checks are therefore not required.
- [x] T184 Final validation/completion remains blocked until T179-T183 are
  implemented/evidenced and the AI Review findings are resolved, made outdated
  by the process-memory fix, or explicitly accepted by Orchestrator under the
  completion contract. The prior final validation markers for effective
  content head `860a4ef4ab66a28b066625d4ffe52f526cce2d5b` must be preserved
  unless a later non-evidence content change makes renewed validation required.
- Implementation disposition: T179-T181 and T183 are implemented and evidenced
  in process memory; T182 remains an Orchestrator finalization guard
  requirement and has not been run or claimed by Implementation Agent. Final
  validation/completion remains blocked until Orchestrator runs the final
  read-only current-PR-head guard immediately before finalization/merge and
  confirms the AI Review findings are resolved, outdated, or otherwise
  accepted under the completion contract.
