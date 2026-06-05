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
- [ ] T099 Implementation Agent must not treat current Appendix IV
  `source-limited-exception` evidence as final completion. Final validation is
  blocked until latest sign-fragment/map requirements are implemented and
  evidenced, or a narrow evidence-backed blocker is routed to
  Orchestrator/human after exhausting official-original extraction options.
- [ ] T100 Implementation Agent must classify Appendix IV sign text/pixels into
  protected sign body/plate/tablet/placard pixels versus external source
  captions/labels. Ambiguous text is protected until evidence proves it is
  external.
- [ ] T101 Implementation Agent must extract/render individual signs, sign
  rows, or equivalent official source fragments at maximum practical quality
  from the canonical official PDF/original or better retained official source.
  Whole-sheet overview may remain supplementary but cannot be the only
  user-facing readable sign presentation.
- [ ] T102 Implementation Agent must make representative signs, including a
  `NO AVANZAR`-style regulatory sign, visually large enough to inspect with
  no pixelated browser upscaling.
- [ ] T103 Implementation Agent may translate external captions/labels under or
  near signs into Russian DOM/SVG text only when source-region evidence proves
  those captions are outside the protected sign/plate visual.
- [ ] T104 Implementation Agent must preserve all text/pixels inside sign
  bodies, supplementary plates/tablets, and official sign placards exactly as
  source pixels: no translation, redraw, cleanup, mask, retouch, inpaint,
  replacement, or relabeling.
- [ ] T105 Implementation Agent must revisit `app2-hospital-map-source-card`
  and extract/use the best available official original map source so all map
  labels are readable with visual font no smaller than nearby document body
  text.
- [ ] T106 Implementation Agent must not translate, relabel, clean, redraw,
  mask, retouch, or otherwise modify anything inside the hospital map image.
- [ ] T107 Implementation Agent must update data/evidence/tests to record
  per-sign/row/hospital-map source path, source region, extraction scale/probe
  method, output dimensions, hashes, runtime display size, no-upscale proof,
  protected-pixel classification, and translated-external-caption boundaries.
- [ ] T108 Implementation Agent must update Playwright or equivalent visual
  evidence with desktop/mobile screenshots for individual Appendix IV signs and
  the hospital map, including nearby body text comparison.
- [ ] T109 Implementation Agent must update content/static tests so protected
  sign interiors and map internals cannot be translated/modified, while
  external sign captions may be translated only as separate DOM/SVG text.
- [ ] T110 If official original extraction still cannot meet readability for a
  user-highlighted visual, Implementation Agent must record a narrow blocker
  with all official-source attempts and route it to Orchestrator/human. Broad
  "source-limited" completion is no longer acceptable for Appendix IV signs or
  the hospital map.
- [ ] T111 Implementation Agent reruns focused content tests,
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
- [ ] T114 Implementation Agent must audit the whole runtime `Руководство`
  guide for learner-facing Russian strings containing source/provenance/meta
  wording, including the explicit user examples:
  `Визуал источника: правильный ремень`,
  `Визуал источника: положение подголовника`,
  `Фотографии сохранены как исходный фрагмент...`, and
  `Главный вывод источника`.
- [ ] T115 Implementation Agent must distinguish learner-visible strings from
  internal technical provenance/evidence fields. Internal fields such as
  `sourceTextEs`, `sourcePage`, `sourceRegion`, asset paths, validation
  evidence, specs, and process memory may retain technical source wording.
- [ ] T116 Implementation Agent must rewrite visual-card titles, card bodies,
  captions, `visualNotes` that render to learners, `noteRu`, and similar
  runtime copy into normal adapted Russian learning language.
- [ ] T117 Implementation Agent must not overlay rewritten copy onto protected
  maps/signs/photos/diagrams or edit protected pixels. This cleanup is DOM/text
  copy only unless prior feature rules explicitly allow a separate overlay.
- [x] T118 Implementation Agent must create or update tests/audit tooling so
  banned learner-facing provenance wording fails in future. The audit should
  scan runtime guide strings and include an explicit allowlist only for genuine
  legal/source citation contexts.
- [ ] T119 Implementation Agent must record grep/audit evidence showing all
  runtime guide occurrences of `источник`-family and `исходн*`/`рабочий
  фрагмент`-style wording are removed, rewritten, or allowlisted with rationale.
- [ ] T120 Implementation Agent should provide DOM or screenshot evidence for
  representative rewritten visual cards where useful, especially the examples
  named by the user.
- [ ] T121 Implementation Agent must keep the earlier protected-image rules and
  latest image-quality work intact while doing the copy cleanup.
- [ ] T122 Final validation remains blocked until both the latest sign/map image
  quality work and this runtime copy audit/rewrite are implemented and
  evidenced.

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
- [ ] T126 Implementation Agent must perform a whole-document visual
  completeness audit comparing official PDF/manual visual regions to runtime
  guide visual blocks/assets, not only enumerating images already present in
  runtime data.
- [ ] T127 Implementation Agent must disposition every learner-meaningful PDF
  visual as present, added, duplicate-covered, explicitly omitted with
  rationale, or narrow missing-image blocker. Learner-meaningful means any
  image/diagram/photo/infographic/map/sign sheet/chart/icon that conveys a
  rule, risk, classification, comparison, example, label, or visual term.
- [ ] T128 Implementation Agent must locate, export from the official
  PDF/original, and insert or narrowly block the required candidate visuals:
  tire manufacturing/date and tread-life visual (`Fecha de Fabricación`,
  `Vida útil de los Neumáticos`), blind-spot visual
  (`¿A qué se denomina punto ciego?`), `Matafuegos`,
  `Chaleco reflectivo`, hospital map, Appendix IV signs, headrest diagrams,
  and the public-space `50` people mobility visual.
- [ ] T129 Implementation Agent must export images at best available faithful
  official quality, remove excessive blank/white margins, avoid bitmap
  stretching, cap runtime display at natural dimensions, and preserve the
  original image-to-document-text scale relationship. For `Matafuegos`, record
  the extinguisher visual-height comparison against the user's approximate
  `15` body-text-line anchor.
- [ ] T130 Implementation Agent must preserve protected image pixels for maps,
  blind-spot, headrest, tire, extinguisher, vest, public-space, signs, photos,
  diagrams, and similar visuals: no redraw, vector recreation, retouching,
  recoloring, masking, inpainting, cleanup, replacement, or translation inside
  the image unless a prior accepted feature explicitly allowed a specific
  overlay/cleanup.
- [ ] T131 Implementation Agent must keep visuals with Spanish terms as
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
- [ ] T133 Implementation Agent must continue the Appendix IV sign follow-up:
  whole sign sheets are insufficient when signs/captions remain tiny; use large
  individual signs, sign rows, or source-faithful panels where possible, and
  translate only proven external catalog captions such as `NO AVANZAR`.
- [ ] T134 Implementation Agent must continue the hospital-map follow-up:
  re-extract or verify `app2-hospital-map-source-card` from the best official
  original source so labels are readable at body-text scale, without translating
  or modifying the map image.
- [ ] T135 Implementation Agent must insert/display the blind-spot visual
  as-is from the official original; it should be full-width/tight like the
  original and not a small centered image inside a large blank area.
- [ ] T136 Implementation Agent must audit the whole learner-facing runtime
  guide copy for provenance/service wording (`источник`, `Визуал источника`,
  `из источника`, `исходный фрагмент`, `рабочий фрагмент`,
  `Главный вывод источника`, and similar) and rewrite visible titles, bodies,
  captions, and notes as normal adapted Russian learning copy. Internal
  evidence/spec/provenance fields may retain technical `source` wording.
- [ ] T137 Implementation Agent must preserve the interrupted Swift direct PDF
  source-region helper work and adapt it where useful, but treat it only as
  supporting machinery; it is insufficient unless it supports the actual
  completeness/quality/scale evidence required here.
- [ ] T138 Implementation Agent must record evidence listing present, added,
  missing, duplicate-covered, explicitly omitted, and blocker visuals with
  source page/region, extraction method/scale, asset dimensions, hash where
  practical, runtime display size, no-upscale proof, protected-image policy,
  and screenshots.
- [ ] T139 Implementation Agent must add or update tests/audit scripts so
  missing meaningful visuals, tiny image displays, excessive blank margins,
  protected-image edits, missing separate translations, and learner-facing
  source/provenance wording regressions fail.
- [ ] T140 Implementation Agent must run and record focused content tests,
  `pnpm run validate:manual-guide`, `pnpm run validate:content`,
  `pnpm exec tsc --noEmit`, focused Playwright screenshots/checks for
  representative required visuals, `git diff --check`, and full
  `pnpm run preflight` if feasible.
- [ ] T141 PR `#200` final validation remains blocked until T126-T140 and the
  explicit user-example checklist below are implemented and evidenced, or every
  remaining gap is a narrow evidence-backed blocker routed to
  Orchestrator/human.
- [x] T142 Architect records the explicit `Context Examples From User` section
  in `spec.md`, listing the concrete user screenshot/callout examples, why each
  matters, the expected implementation outcome, and the review/evidence hook.
- [ ] T143 Implementation Agent must treat `spec.md` section
  `Context Examples From User` as a named evidence checklist. For each listed
  example, record one of: implemented with evidence, duplicate-covered with the
  covering block named, explicitly omitted with rationale, or narrow blocker
  routed to Orchestrator/human.
- [ ] T144 Implementation Agent evidence must specifically cover the user
  examples: Appendix IV regulatory signs and `NO AVANZAR`, hospital map,
  seatbelt/headrest copy problems, blind-spot visual, tire
  manufacturing/tread-life visual, `Matafuegos`, `Chaleco reflectivo`,
  headrest combined diagram/glossary, `50` people mobility-space visual, and
  whole-guide `источник` wording cleanup.

## First Controlled Batch Evidence - 2026-06-05

- Implementation Agent status: first controlled batch only; do not treat
  feature `034` as complete.
- Implemented repeatable audit script
  `scripts/manual-guide-visual-completeness-audit.mjs`. It writes
  `content/validation/manual-guide-visual-completeness.evidence.json` and
  records every `spec.md` `Context Examples From User` example by name with
  statuses such as `implemented` and `needs-implementation`.
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
