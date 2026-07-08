# Tasks: Complete Manual Translation Audit

## Status Legend

- `[x]` Complete
- `[ ]` Pending

## Architect Planning Tasks

- [x] T001 Confirm Architect assignment for
  `/Users/chap/devel/cabadrive-worktrees/040-manual-translation-completion`
  on branch `codex/040-manual-translation-completion`.
- [x] T002 Confirm verified base from Orchestrator: `origin/main` at
  `ddaa670022d240caa6861adbf30e2e6c8200223f`.
- [x] T003 Preserve role boundary: Architect edits only `spec.md`, `plan.md`,
  and `tasks.md` under `specs/041-manual-translation-completion/`.
- [x] T004 Read the constitution, project docs, frontend/backend docs, feature
  inventory, learning/manual flows, specify archive README, and active
  `feature-request.md`.
- [x] T005 Read prior relevant feature memory for glossary term translations
  and image-readability translations.
- [x] T006 Inspect current manual guide data/rendering/validator surfaces
  read-only, including likely files named by Orchestrator.
- [x] T007 Confirm screenshot-highlighted residues exist in
  `src/data/manual-sections/ch3-highways.ts`.
- [x] T008 Define native `Руководство` scope boundaries, audit method,
  terminology handling, implementation tasks, validation evidence, acceptance
  criteria, negative scenarios, and review requirements.

## Orchestrator / Implementation Setup

- [x] T009 Orchestrator assigns Implementation Agent to this worktree/branch or
  another fresh latest-main isolated slice, explicitly preserving sibling
  worktrees, dirty diffs, branches, commits, PRs, and process memory.
- [x] T010 Implementation Agent confirms branch, PR slice, scoped files,
  latest-main base, current `git status --short --branch`, and parallel-work
  preservation warning before editing product files.
- [x] T011 Implementation Agent reads `feature-request.md`, `spec.md`,
  `plan.md`, and this `tasks.md` before editing.
- [x] T012 Implementation Agent keeps this file current with decisions, dead
  ends, evidence paths, exact validation command results, and feedback.

## Whole-Guide Text Audit

- [x] T013 Add `scripts/manual-guide-translation-completeness-audit.mjs`.
- [x] T014 Use TypeScript compiler AST evaluation or an equivalent structured
  section-data loader rather than raw grep as the primary audit mechanism.
- [x] T015 Enumerate all current implemented manual guide sections from
  `src/data/manual-sections/*.ts` and record counts in evidence.
- [x] T016 Inspect learner-facing fields including section/block titles,
  paragraphs, list items, table columns/cells, captions, alt text, card body
  text, nested group/example labels, and structured term translation fields.
- [x] T017 Exclude or separately classify non-learner-facing fields:
  `sourceTextEs`, `sourceTitleEs`, registry source titles, evidence notes,
  asset paths, URLs, hashes, selectors, route hashes, test ids, source regions,
  and source/provenance metadata.
- [x] T018 Treat protected image pixels as out of scope for this text audit
  while still checking adjacent learner-facing DOM support fields where present.
- [x] T019 Add required-probe detection for `Ingreso: carriles de aceleración`,
  `carriles de aceleración`, `calzada`, `tránsito de la vía principal`,
  `espejos retrovisores`, `incorporación`, `luz de giro izquierda`,
  `espacio / gap`, `velocidad adecuada del tramo`, `autopista`, and
  `vía rápida`.
- [x] T020 Add a Spanish residue detector for Latin/Spanish traffic phrases,
  accented/unaccented variants, and mixed Russian/Spanish strings.
- [x] T021 Add a narrow evidence-backed exception model for acronyms, official
  names, road names, legal/document identifiers, URLs, hashes, file names,
  source ids, and other non-translation cases.
- [x] T022 Ensure generic traffic terms cannot be broadly allowlisted without
  nearby Russian support.
- [x] T023 Add committed evidence at
  `content/validation/manual-guide-translation-completeness.evidence.json`.
- [x] T024 Ensure check mode fails on missing, malformed, stale, incomplete, or
  over-broad evidence and does not rewrite files unless `--write` is passed.
- [x] T025 Wire the new audit into `pnpm run validate:manual-guide` and keep
  `pnpm run validate:content` coverage consistent.

## Content Fixes

- [x] T026 Run the audit in write/draft mode to produce the current candidate
  residue inventory before fixing content.
- [x] T027 Fix `src/data/manual-sections/ch3-highways.ts` screenshot probes
  with Russian-only wording or retained Spanish plus adjacent Russian support.
- [x] T028 Fix all analogous residues reported by the audit across
  `src/data/manual-sections/*.ts`.
- [x] T029 Review likely residue-heavy files from Architect read-only
  inspection: `ch3-speed.ts`, `ch3-stopping-parking.ts`,
  `app1-other-required-safety-elements.ts`, `app3-safe-driving.ts`, and
  `app3-safety-elements.ts`.
- [x] T030 Preserve official road/street names, organization names, legal
  references, acronyms, and document/system names where useful, while
  translating surrounding generic Spanish terms.
- [x] T031 Keep recurring terminology consistent for `calzada`,
  `incorporación`, `autopista`, `vía rápida`, `carril`, `banquina`,
  `luz de giro`, `balizas`, `auxilio`, `sobrepaso`, and `adelantamiento`.
- [x] T032 Preserve legal, numeric, safety, document, lane, priority, speed,
  emergency, and source-order meaning while editing wording.
- [x] T033 Preserve protected source image pixels and feature `035`
  image-adjacent translation behavior.
- [x] T034 Update `visualEvidence.notes` or section process notes only when
  necessary to keep evidence meaning current.

## Renderer / CSS Tasks

- [x] T035 Prefer content/data fixes; avoid renderer changes unless adjacent
  Spanish/Russian support cannot be expressed by existing block shapes.
- [x] T036 If renderer changes are needed, reuse `ManualImageTermTranslations`
  or a small shared structured Spanish/Russian pair renderer.
- [x] T037 If Spanish/Russian pair rendering changes, use `lang="es"` for
  retained Spanish and `lang="ru"` for Russian translations where feasible.
- [x] T038 Ensure new parenthesized or structured translations wrap naturally,
  remain selectable DOM text, and do not create mobile clipping or
  document-level overflow.

## Tests

- [x] T039 Add tests for audit write/check behavior, missing evidence, stale
  evidence, and malformed evidence.
- [x] T040 Add tests proving the audit enumerates all current implemented
  manual guide sections and learner-facing field classes.
- [x] T041 Add tests proving the audit ignores `sourceTextEs`, `sourceTitleEs`,
  asset paths, URLs, hashes, route hashes, and protected image pixel metadata.
- [x] T042 Add tests proving Spanish residue in learner-facing headings, list
  items, table cells, captions, card text, and alt text fails without nearby
  Russian support.
- [x] T043 Add tests proving over-broad generic Spanish traffic-term exceptions
  fail.
- [x] T044 Add tests proving all screenshot probes are represented in evidence
  and pass after content fixes.
- [x] T045 Update existing manual-guide content tests that currently assert
  Spanish-only residues in `ch3-highways.ts` and related files.
- [x] T046 Add or update focused E2E/Playwright coverage for the Chapter 3
  highways route on desktop and mobile.
- [x] T047 E2E verifies corrected screenshot terms, selectable DOM text,
  nearby Russian support, and no document-level horizontal overflow.
- [x] T048 Keep existing source-fidelity, image-readability, glossary,
  navigation, content, and e2e tests passing.

## Durable Docs

- [x] T049 Update
  `docs_project/project/frontend/manual-conversion-guidelines.md` only if the
  new text audit or Spanish-term retention rule becomes durable guidance.
- [x] T050 If docs are updated, keep them concise and limited to the reusable
  manual text translation contract.

## Local Verification

- [x] T051 Run `node scripts/check-feature-memory.mjs --worktree`.
- [x] T052 Run `node scripts/manual-guide-translation-completeness-audit.mjs --write`
  after intentional evidence/content changes.
- [x] T053 Run `pnpm run validate:manual-guide`.
- [x] T054 Run `pnpm run validate:content`.
- [x] T055 Run focused tests for the new audit and touched manual-guide data.
- [x] T056 Run `pnpm exec tsc --noEmit`.
- [x] T057 Run `pnpm run test`.
- [x] T058 Run `pnpm run build`.
- [x] T059 Run focused Playwright/E2E checks for Chapter 3 highways.
- [x] T060 Run `pnpm run test:e2e` if feasible.
- [x] T061 Run `git diff --check`.
- [x] T062 Run `pnpm run preflight` before PR readiness if feasible; otherwise
  record the blocker and substitute evidence with Orchestrator coordination.
- [x] T063 Record exact command results and evidence paths in this file.

## Review / PR / Final Validation Prep

- [x] T064 Implementation Agent stages, commits, pushes, and opens or updates
  one ready PR only if assigned by Orchestrator.
- [ ] T065 Review Agent checks whole-guide coverage, audit strength,
  terminology consistency, protected-image preservation, responsive/selectable
  text, tests, and process-memory compliance.
- [x] T066 Implementation Agent records and resolves review findings only
  through Orchestrator assignment.
- [x] T067 Orchestrator routes any Implementation Agent feedback to Architect
  for task/ticket/not-needed disposition before final validation.
- [ ] T068 Orchestrator invokes final Architect validation before final Analyst
  validation after implementation, checks, review, and feedback disposition are
  complete.
- [ ] T069 Orchestrator invokes final Analyst validation only after Architect
  passes and records the required final-validation markers.
- [ ] T070 Orchestrator verifies required checks, current PR head, conflicts,
  review conversations, acceptance evidence, process memory, and final guards
  before completion/finalization/merge.

## PR #206 Review Fix Tasks

- [x] T071 Confirm Implementation Agent assignment for PR #206 review fixes on
  `/Users/chap/devel/cabadrive-worktrees/040-manual-translation-completion`,
  branch `codex/040-manual-translation-completion`, preserving sibling
  worktrees, branches, commits, PRs, dirty diffs, and process memory.
- [x] T072 Strengthen
  `scripts/manual-guide-translation-completeness-audit.mjs` so meaningful
  learner-facing Latin segments are candidates by default, not only terms in
  `spanishDetectorTerms`.
- [x] T073 Keep accepted exceptions narrow to official names, acronyms, URLs,
  road names, legal identifiers, units, and equivalent non-prose cases; require
  generic Spanish prose, traffic terms, document terms, and learner-facing
  Latin residues to have support, structured pairing, or unresolved evidence.
- [x] T074 Add audit support for reverse parenthetical Russian/Spanish
  support, immediate dash/colon support, and structured `termEs` pair support
  for either `translationRu` or `labelRu`.
- [x] T075 Add Russian support for `certificado del seguro de responsabilidad
  civil` in `src/data/manual-sections/ch2-required-documents.ts`.
- [x] T076 Fix newly surfaced learner-facing residues across
  `src/data/manual-sections/*.ts`, including `arterias`,
  `plaza de acompañante`, singular `motovehículo`, `habitáculo`, `trailer`,
  `Isofix`, `Latch`, `aquaplaning`, `manual`, and related document, traffic,
  alcohol, safety, mobility, parking, priority, and glossary terms.
- [x] T077 Refresh
  `content/validation/manual-guide-translation-completeness.evidence.json`
  with the strengthened audit.
- [x] T078 Add focused tests proving unmatched Latin learner-facing residues
  fail even when they are not dictionary terms, including the document and
  alcohol examples from the review findings.
- [x] T079 Refresh source-fidelity, image-readability, registry hash, and manual
  ticket-placement evidence affected by manual wording changes while preserving
  reviewed placement route/anchor decisions.
- [x] T080 Update placement invariants/tests for reviewed anchors whose exact
  learner-facing wording changed only to add Russian support.
- [x] T081 Run focused tests, required validation, build, diff hygiene, and
  preflight after the review-fix memory update.

## Decisions

- Decision: Scope is limited to the native interactive `Руководство` user
  surface.
- Decision: Use one implementation PR slice by default.
- Decision: Add a deterministic text-surface translation-completeness audit
  with committed evidence.
- Decision: Spanish retained for learner recognition must receive immediate
  parenthesized Russian translation or equivalent adjacent structured support.
- Decision: `sourceTextEs`, source titles, IDs, URLs, hashes, asset paths,
  route hashes, validation metadata, and protected source image pixels are not
  learner-facing text residues for this audit.
- Decision: Generic Spanish traffic terms cannot be accepted as untranslated
  exceptions merely because they are official terms.
- Implementation decision: Confirmed assigned worktree
  `/Users/chap/devel/cabadrive-worktrees/040-manual-translation-completion`,
  branch/PR slice `codex/040-manual-translation-completion`, verified base
  `origin/main` at `ddaa670022d240caa6861adbf30e2e6c8200223f`, and parallel
  work preservation warning before product edits.
- Implementation decision: Scope for edits remains `src/data/manual-sections/`,
  manual-guide validation scripts/evidence/tests, package validation wiring,
  focused E2E coverage, and this feature task log. Renderer/CSS changes are
  deferred unless content/audit work proves they are necessary.
- Implementation decision: Added
  `scripts/manual-guide-translation-completeness-audit.mjs` as a deterministic
  TypeScript AST/evaluation audit over `src/data/manual-sections/*.ts` instead
  of a raw grep scan.
- Implementation decision: The audit classifies learner-facing fields
  separately from `sourceTextEs`, `sourceTitleEs`, route/hash/path/provenance
  metadata, validation notes, and protected source-image pixels. It allows
  retained Spanish only when immediate Russian support is present or when a
  narrow official-name/acronym/URL-style exception is recorded.
- Implementation decision: The committed evidence is
  `content/validation/manual-guide-translation-completeness.evidence.json`.
  The original implementation evidence covered 50 sections, 2920 inspected
  learner-facing strings, 433 Spanish-residue records, 344
  supported/translated records, 89 narrow exceptions, 0 unresolved records, and
  all 11 required screenshot probes.
- Implementation decision: Content fixes were sufficient. No renderer or CSS
  changes were needed; existing manual-guide block shapes support adjacent
  Spanish/Russian wording and remain selectable DOM text.
- Implementation decision: Manual text edits changed ticket-placement content
  fingerprints, so the placement baseline, runtime pages, reviewed shards,
  topic routes, manifest seal, and validation evidence were refreshed
  mechanically while preserving route/anchor decisions.
- Implementation decision: Updated
  `docs_project/project/frontend/manual-conversion-guidelines.md` because the
  Spanish retention rule is reusable durable conversion guidance.
- Review-fix decision: PR #206 findings `discussion_r3537379264`,
  `discussion_r3537379273`, and `discussion_r3537389209` exposed that the
  first audit had a detector/evidence blind spot. The review fix changes the
  audit from dictionary-term discovery to meaningful Latin-segment discovery so
  unmatched learner-facing Latin text is classified as supported, structured
  pair, narrow exception, or unresolved finding.
- Review-fix decision: Narrow exceptions remain allowed for official acronyms,
  names, URLs, road/place/person names, legal identifiers, measurement units,
  and similar non-prose text. Generic Spanish traffic, document, safety, and
  learner-facing prose terms do not pass as exceptions without Russian support.
- Review-fix decision: Newly surfaced residues were fixed in manual section
  data rather than hidden in broader exceptions. The final strengthened evidence
  covers 50 sections, 2920 inspected learner-facing strings, 1181 candidate
  residue records, 994 supported retained/translated records, 187 narrow
  exceptions, and 0 unresolved findings.
- Review-fix decision: Manual wording changes changed source-fidelity hashes,
  image-readability wording evidence, and ticket-placement fingerprints. Those
  derived artifacts were refreshed consistently; `b-fallback-430` keeps the
  same route and answer-bearing anchor with only added Russian support for
  `trailer`.

## Dead Ends

- Initial `pnpm run validate:content` shell wrapper failed before validation
  because zsh reserves the variable name `status`; reran with `rc`.
- Initial full `pnpm run test` failed because existing content-contract tests
  still asserted Spanish-only residue in Chapter 3/4 data. Updated those tests
  to assert the intended supported Spanish/Russian form.
- `pnpm run validate:content` and `pnpm run test` initially failed after manual
  wording edits because manual ticket-placement fingerprints were stale. Ran the
  placement generator, then refreshed reviewed placement fingerprints and
  manifest seal mechanically; `pnpm run validate:manual-ticket-placement`
  passed afterward.
- During PR #206 review fixes, `pnpm run test` initially failed because exact
  retention/placement invariants still expected the old unsupported wording for
  `trailer`, `avenida`, `Isofix`, and `Latch`. Updated those tests to assert the
  supported Spanish/Russian wording now present in manual content and reviewed
  placement evidence.
- During PR #206 review fixes, the first `pnpm run preflight` stopped at
  `scripts/check-feature-memory.mjs --worktree` because product files had
  changed before this review-fix evidence section was updated. This task log is
  now touched in the same PR, and preflight must be rerun after this update.
- During PR #206 review fixes, the first post-memory `pnpm run preflight`
  reached E2E and failed only on stale Playwright expectations for an exact
  `Отвлечения` heading and the updated `Metrobus de Buenos Aires` Russian
  support text. Updated those E2E expectations and reran the affected tests
  before the final preflight.

## Known Issues

- No unresolved learner-facing Spanish residues remain under the new audit.
- Build output still reports existing large Rollup chunk warnings for major
  app/content bundles. This is pre-existing bundle-size noise and not caused by
  a new runtime dependency for this feature.

## Implementation Agent Feedback

- Manual ticket-placement reviewed fingerprints are sensitive to learner-facing
  manual text edits. This implementation refreshed them mechanically, but future
  manual wording changes should expect the same placement-evidence maintenance.

## Architect Disposition of Implementation Agent Feedback

- Disposition: accepted as known maintenance for future manual wording changes;
  no additional task is required in this feature because this implementation
  already refreshed the affected ticket-placement fingerprints, reviewed shards,
  manifest seal, and validation evidence, and
  `pnpm run validate:manual-ticket-placement` passed afterward.
- Future ticket: not needed now. Future manual text-edit features should plan
  for ticket-placement evidence refresh when learner-facing wording changes alter
  placement fingerprints.
- Additional feedback check: no other Implementation Agent feedback items are
  recorded in this feature memory.

## Verification Evidence

- Architect read-only context:
  - Branch/worktree observed as
    `codex/040-manual-translation-completion...origin/main`.
  - `specs/041-manual-translation-completion/feature-request.md` exists.
  - `package.json` currently wires `validate:manual-guide` through source
    fidelity, visual completeness, and image readability/translation audits.
  - Current `ch3-highways.ts` contains the screenshot-highlighted Spanish
    residues in learner-facing `titleRu`, `textRu`, and `itemsRu` fields.
  - Existing image readability audit demonstrates the preferred deterministic
    evidence pattern for this feature's text audit.
- Implementation setup:
  - `pwd && git branch --show-current && git status --short --branch`:
    `/Users/chap/devel/cabadrive-worktrees/040-manual-translation-completion`,
    branch `codex/040-manual-translation-completion`,
    `## codex/040-manual-translation-completion...origin/main`, with
    untracked `specs/041-manual-translation-completion/` feature memory.
  - Read before product edits: `.specify/memory/constitution.md`,
    `docs_project/README.md`, `docs_project/project-idea.md`,
    `docs_project/project/frontend/frontend-docs.md`,
    `docs_project/project/backend/backend-docs.md`,
    `docs_project/project/feature-inventory.md`,
    `docs_project/screens/learning-and-exam-flows.md`,
    `docs/specify/README.md`,
    `specs/041-manual-translation-completion/feature-request.md`,
    `specs/041-manual-translation-completion/spec.md`,
    `specs/041-manual-translation-completion/plan.md`, and this `tasks.md`.
- Implementation verification:
  - `node scripts/manual-guide-translation-completeness-audit.mjs --write`:
    passed and wrote
    `content/validation/manual-guide-translation-completeness.evidence.json`.
  - `node scripts/manual-guide-image-readability-translations-audit.mjs --write`:
    passed after `termTranslations` wording changes and refreshed
    `content/validation/manual-guide-image-readability-translations.evidence.json`.
  - `pnpm run validate:manual-ticket-placement`: passed after refreshing
    placement fingerprints; 460 questions, 460 placements, 31 destination
    routes, density 1/12/45, 85 answer-bearing, 375 fallbacks.
  - `pnpm exec node --test tests/manual-guide-translation-completeness-audit.test.mjs`:
    passed, 5/5 subtests.
  - `pnpm run validate:manual-guide`: passed; source fidelity, visual
    completeness, image readability/translations, and translation completeness
    audits all green.
  - `node scripts/check-feature-memory.mjs --worktree`: passed.
  - `pnpm exec tsc --noEmit`: passed.
  - `git diff --check`: passed.
  - `pnpm run validate:content`: passed; translation completeness audit reports
    50 sections, 2920 strings, 433 residue records, 89 exceptions.
  - `pnpm run test`: passed, 474/474 tests.
  - `pnpm run build`: passed; generated service worker with 2156 cached assets.
  - `pnpm exec playwright test tests/e2e/app.spec.ts -g "Manual guide Chapter 3 highways"`:
    passed, 2/2 tests on Chromium desktop and mobile.
  - `pnpm run preflight`: passed; includes feature-memory check, repo check,
    content validation, unit tests, build, and full Playwright E2E. Full E2E
    passed 102/102 tests.
  - Staged implementation slice with `git add ...`.
  - Created implementation commit `Complete manual guide translation audit`.
  - Pushed branch `codex/040-manual-translation-completion` to origin.
  - Opened ready PR: https://github.com/cucumberfalse/cabadrive/pull/206.
- PR #206 review-fix verification, 2026-07-08T18:01:03Z:
  - `node scripts/manual-guide-translation-completeness-audit.mjs --write`:
    passed and refreshed
    `content/validation/manual-guide-translation-completeness.evidence.json`.
    Strengthened evidence reports 50 sections, 2920 inspected strings, 1181
    candidate residue records, 994 supported retained/translated records, 187
    accepted exceptions, and 0 unresolved findings.
  - `pnpm exec node --test tests/manual-guide-translation-completeness-audit.test.mjs`:
    passed, 8/8 tests, including non-dictionary Latin residue, document phrase,
    alcohol-limit residue, and generic traffic-term rejection fixtures.
  - `pnpm run generate:manual-ticket-placement`: passed; refreshed derived
    manual ticket placement data for 460 immutable reviewed records.
  - `pnpm run validate:manual-ticket-placement`: passed; 460 questions, 460
    placements, 31 destination routes, density 1/12/45, 85 answer-bearing, 375
    fallbacks.
  - `pnpm run validate:manual-guide`: passed; source fidelity, visual
    completeness, image readability/translations, and strengthened translation
    completeness all green.
  - `pnpm exec tsc --noEmit`: passed.
  - `pnpm run validate:content`: passed; strengthened translation completeness
    audit reports 50 sections, 2920 strings, 1181 residue records, 187
    exceptions.
  - `pnpm exec node --test tests/manual-ticket-placement.test.mjs`: passed,
    18/18 tests after updating the reviewed exact anchor fixture for
    `b-fallback-430`.
  - `pnpm exec node --test tests/content-manual-guide-chapters.test.mjs`:
    passed, 97/97 tests after updating the retention assertions for supported
    `avenida`, `Isofix`, and `Latch` wording.
  - `pnpm run test`: passed, 477/477 tests.
  - `pnpm run build`: passed; generated service worker with 2156 cached assets.
    Build still emits the existing large Rollup chunk warnings.
  - `pnpm run preflight`: first review-fix run failed at feature-memory guard
    before this evidence update; rerun required after this task-memory change.
  - `pnpm exec playwright test tests/e2e/app.spec.ts -g "Manual guide opens Chapter 4 stress and distractions from direct routes|Manual guide full-width source image cards stay readable and avoid upscaling"`:
    passed, 4/4 tests, after updating stale E2E expectations for the supported
    text.
  - `pnpm run preflight`: passed on rerun at 2026-07-08T18:07:47Z; feature
    memory gate, repo baseline check, content validation, unit tests, build, and
    full Playwright E2E all passed. Full E2E passed 102/102 tests.
