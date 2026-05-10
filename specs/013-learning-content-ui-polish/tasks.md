# Tasks: Learning Content UI Polish

## Architect Planning Setup

- [x] T001 Confirm assigned worktree is `/Users/chap/devel/cabadrive-013-learning-content-ui-polish`.
- [x] T002 Confirm active branch is `codex/013-learning-content-ui-polish`.
- [x] T003 Read `.specify/memory/constitution.md`.
- [x] T004 Read `docs_project/README.md`.
- [x] T005 Read `docs_project/project-idea.md`.
- [x] T006 Read `docs_project/project/frontend/frontend-docs.md`.
- [x] T007 Read `docs_project/project/backend/backend-docs.md`.
- [x] T008 Read `docs_project/project/feature-inventory.md`.
- [x] T009 Read `docs_project/screens/learning-and-exam-flows.md`.
- [x] T010 Read `docs/specify/README.md`.
- [x] T011 Read active `specs/013-learning-content-ui-polish/feature-request.md`.
- [x] T012 Inspect feature `008` memory for materials UI context.
- [x] T013 Inspect feature `006` process memory for parking-clearance/topic-guide validation context.
- [x] T014 Inspect sibling feature `010` feature memory read-only for overlap with `QuestionCard`, navigation, and support reveal.
- [x] T015 Inspect current relevant source/content/test shapes read-only to make implementation tasks precise.

## Architect Artifacts

- [x] T016 Create `spec.md` with goal, scope, non-goals/out-of-scope, assumptions, user stories, acceptance criteria, negative scenarios, functional requirements, implementation boundaries, conflict checks with `010`, verification requirements, and review requirements.
- [x] T017 Create `plan.md` with implementation slices, content/evidence approach, UI approach, 010 conflict strategy, test strategy, risks, rollback, and handoff.
- [x] T018 Create this `tasks.md` with implementation tasks, review requirements, process memory, verification evidence placeholders, and feedback-disposition sections.

## Required Slice A: Setup And 010 Conflict Check

- [x] T019 Confirm implementation starts from complete feature memory: `feature-request.md`, `spec.md`, `plan.md`, and `tasks.md`.
- [x] T020 Confirm Implementation Agent uses only the Orchestrator-assigned isolated worktree and branch for implementation.
- [x] T021 Run `git status --short` and record any pre-existing dirty files.
- [x] T022 Check whether sibling feature `010` has merged into `origin/main`.
- [x] T023 If `010` has merged, sync this branch with `origin/main` before UI edits and record the result. Not applicable: 010 is unmerged, so T024 path was used.
- [x] T024 If `010` has not merged, inspect sibling `010` feature memory and `git diff --stat` read-only, then record overlapping files and the no-copy decision.
- [x] T025 Confirm implementation will not edit `specs/014-orchestrator-first-enforcement/*`.
- [x] T026 Record the final conflict/order decision in Process Memory before product/content edits.

## Required Slice B: Translation Data And Alignment Evidence

- [x] T027 Inspect current `content/translations/ru.translations.json` entries for `b-fallback-028` and `b-fallback-412`.
- [x] T028 Add or update `b-fallback-028` Russian question translation and all answer translations if missing or inadequate.
- [x] T029 Add or update `b-fallback-412` Russian question translation and all answer translations if missing or inadequate.
- [x] T030 Ensure each translation entry contains the required unofficial Russian-support disclaimer.
- [x] T031 Generate approved alignment evidence for each added or changed translation entry using the current Spanish source tuple and translation tuple.
- [x] T032 Update `content/validation/ru-translation-alignment.evidence.json` without leaving duplicate or stale entries.
- [x] T033 Run `node --test tests/content-translation-alignment.test.mjs`.
- [x] T034 Run `pnpm run validate:content`.
- [x] T035 Record translation decisions, reviewer/date/evidence notes, and command evidence in Process Memory.

## Required Slice C: Parking-Clearance Material Polish

- [x] T036 Inspect `parking-clearances-and-corners` in `content/guide/topic-study-guide.ru.json` before editing.
- [x] T037 Polish the institution-entrance learning prose so hospital/health entrances clearly teach `10 metros de cada lado de la entrada`.
- [x] T038 Preserve Spanish phrases with Russian meaning for `entrada`, `hospital`, `centro de salud`, `10 metros de cada lado de la entrada`, and `5 metros de cada lado de la entrada` where supported by question/answer wording.
- [x] T039 Update `b-fallback-028` answer explanations only as needed for readability and correctness.
- [x] T040 Update `b-fallback-412` answer explanations only as needed for readability and correctness.
- [x] T041 Update trap notes so `5 metros` is explicitly the wrong/trap value in the hospital/health entrance context.
- [x] T042 Avoid broad rewrites of unrelated topic paragraphs and record any unavoidable adjacent edit.
- [x] T043 Add or update a focused content test if existing tests do not directly catch the `10 metros` and `5 metros` acceptance requirements.
- [x] T044 Run `node --test tests/content-topic-guide.test.mjs`.
- [x] T045 Run `pnpm run validate:content`.
- [x] T046 Record text-search/test evidence for the parking-clearance acceptance requirements in Process Memory.

## Required Slice D: Materials Ticket Translation UI And Status Noise

- [x] T047 Inspect `TopicGuideTicketBlock` and existing materials e2e tests after the 010 conflict decision.
- [x] T048 Render Russian question translation in materials ticket blocks using `translationByQuestion` or an equivalent existing content-data boundary.
- [x] T049 Render Russian answer translations alongside the matching canonical Spanish answers when translations are available.
- [x] T050 Render a concise missing-translation fallback for materials ticket blocks without translation entries.
- [x] T051 Keep Spanish question and answer text visually primary.
- [x] T052 Remove visible per-ticket `Статус: неофициальная B-практика` from materials ticket metadata.
- [x] T053 Preserve section-level materials status clarity for draft/unofficial/fallback content.
- [x] T054 Add e2e coverage for a translated materials ticket, preferably `b-fallback-028` after Slice B.
- [x] T055 Add e2e coverage for missing-translation fallback using a stable untranslated ticket.
- [x] T056 Add e2e or DOM coverage proving repeated per-ticket status is gone while section/product status remains visible.
- [x] T057 Verify local images and canonical ticket joins still render in materials.
- [x] T058 Record UI decisions and e2e evidence in Process Memory.

## Required Slice E: Ticket IDs In Учить

- [x] T059 Inspect `QuestionCard` metadata after the 010 conflict decision and any branch sync.
- [x] T060 Add visible ticket ID in the `Учить` question flow, preferably in the question metadata row.
- [x] T061 Ensure ticket ID display is usable on mobile and does not overflow metadata chips.
- [x] T062 Keep active exam translation/explanation support behavior unchanged.
- [x] T063 Add e2e coverage proving `Учить` shows the active ticket ID.
- [x] T064 If exam-mode ticket ID behavior is changed, add explicit e2e coverage and record why it is exam-safe; otherwise record that exam was left unchanged.
- [x] T065 Record ticket-ID placement and verification evidence in Process Memory.

## Required Slice F: Vocabulary Expansion

- [x] T066 Audit affected parking-clearance material for missing learner-critical vocabulary.
- [x] T067 Audit CABA/RF additions or repositioning for any new vocabulary terms needed by that content.
- [x] T068 Add only targeted vocabulary entries tied to existing question IDs and Spanish examples.
- [x] T069 Ensure each added term has `id`, `termEs`, `translationRu`, `category`, `explanationRu`, `examples`, `criticality`, and `sourceQuestionIds`.
- [x] T070 Prefer terms from exact canonical question/answer wording; record any guide-only term decision.
- [x] T071 Run `pnpm run validate:content`.
- [x] T072 Record added, skipped, and deferred vocabulary terms with reasons in Process Memory.

## Required Slice G: CABA/RF Enrichment Or Repositioning

- [x] T073 Audit current `content/guide/ru.condensed-guide.json` for sparse or noisy entries.
- [x] T074 Identify source-supported, exam-relevant contrasts that can be added within this feature without broad legal research.
- [x] T075 Enrich CABA/RF only with compact supported contrasts, or reposition it with clearer scope/status if responsible enrichment is not possible.
- [x] T076 Preserve CABA/RF as a separate compact guide from `Материалы`.
- [x] T077 Preserve disclaimer/status semantics and avoid unsupported official claims.
- [x] T078 Add or update tests for the CABA/RF content/surface if visible behavior or expected text changes.
- [x] T079 Run relevant validation/tests.
- [x] T080 Record enrichment, repositioning, and follow-up decisions in Process Memory.

## Required Slice H: Durable Docs

- [x] T081 Check whether behavior changes require updates to `docs_project/project/frontend/frontend-docs.md`, `docs_project/project/feature-inventory.md`, or `docs_project/screens/learning-and-exam-flows.md`.
- [x] T082 Update durable docs only where behavior, architecture, workflows, or deploy rules changed.
- [x] T083 Keep docs concise and aligned with Spanish-primary, unofficial Russian-support, content-mode, materials, vocabulary, and CABA/RF rules.
- [x] T084 Record docs updated or explicit no-docs-needed decision in Process Memory.

## Required Slice I: Final Verification And PR Readiness

- [x] T085 Run `pnpm run validate:content`.
- [x] T086 Run `pnpm run test`.
- [x] T087 Run `pnpm run build`.
- [x] T088 Run `pnpm run test:e2e`.
- [x] T089 Run `pnpm run preflight`.
- [x] T090 Run `git diff --check`.
- [x] T091 For runtime-affecting changes, run `make build`, `make up`, smoke check `http://localhost:5173`, and `make down`, or record exact unrelated blocker and cleanup attempted.
- [x] T092 Record command summaries and acceptance evidence in Process Memory.
- [x] T093 Confirm all changed acceptance criteria have evidence, not only a summary.
- [x] T094 Confirm Implementation Agent feedback is recorded for Architect disposition.
- [x] T095 Confirm no unresolved merge conflicts before PR readiness.
- [ ] T096 Confirm no blocking review findings remain before completion.
- [ ] T097 Confirm required checks are green after PR push.
- [ ] T098 Confirm only final human approval or merge mechanics remain before marking the PR complete.

## Review Requirements

- [ ] T099 Review Agent verifies complete feature memory exists and role boundaries were followed.
- [ ] T100 Review Agent verifies no files under `specs/014-orchestrator-first-enforcement/` were edited.
- [ ] T101 Review Agent verifies sibling `010` artifacts were not copied or consumed while unmerged.
- [ ] T102 Review Agent verifies 010 overlap was checked and recorded before UI edits.
- [ ] T103 Review Agent verifies materials translations preserve Spanish-primary display and use governed translation data.
- [ ] T104 Review Agent verifies translation alignment evidence is fresh for every added or changed translation.
- [ ] T105 Review Agent verifies parking-clearance text teaches `10 metros de cada lado de la entrada` and frames `5 metros` as the hospital/health entrance trap.
- [ ] T106 Review Agent verifies vocabulary additions are scoped, useful, and linked to valid questions.
- [ ] T107 Review Agent verifies CABA/RF additions or repositioning are compact, source-supported, and not padded with unsupported claims.
- [ ] T108 Review Agent verifies repeated per-ticket status noise is reduced without hiding fallback/unofficial content-mode truth.
- [ ] T109 Review Agent verifies `Учить` ticket IDs are visible and mobile-safe.
- [ ] T110 Review Agent verifies active exam support-hiding behavior did not regress.
- [ ] T111 Review Agent verifies local-first/offline behavior remains intact.
- [ ] T112 Review Agent verifies `tasks.md` contains current process memory, verification evidence, known issues, dead ends, and Implementation Agent feedback before merge readiness.

## Process Memory

### Architect Decisions

- This feature is learner-facing content/UI polish only; process hardening belongs to separate feature `014` and must not be edited here.
- Materials ticket translations should use the existing canonical translation layer (`content/translations/ru.translations.json` via `translationByQuestion`) rather than duplicating Russian strings inside UI code or topic guide ticket blocks.
- Adding or changing translations requires matching deterministic alignment evidence in `content/validation/ru-translation-alignment.evidence.json`.
- Parking-clearance edits should be narrow and centered on the hospital/health entrance `10 metros de cada lado de la entrada` rule and the `5 metros` trap.
- Vocabulary expansion is scoped to terms needed by touched material and CABA/RF additions, not a broad vocabulary audit.
- CABA/RF must remain compact and source-supported; responsible repositioning plus follow-up is acceptable if enrichment would require unsupported claims.
- Reduce repeated visible per-ticket status noise, but preserve product/section-level `unofficial_b_fallback` clarity.
- Ticket IDs are required in `Учить`; active exam behavior should remain unchanged unless explicitly justified and tested.
- Feature `010` overlaps `src/App.tsx`, `src/styles.css`, and `tests/e2e/app.spec.ts`; Implementation must check/rebase/coordinate before editing those surfaces.
- Architect did not edit product code, content JSON, tests, durable docs, `feature-request.md`, sibling feature folders, commits, pushes, or PR state.

### Context Evidence

- Active worktree check showed `/Users/chap/devel/cabadrive-013-learning-content-ui-polish`.
- Active branch check showed `codex/013-learning-content-ui-polish`.
- Baseline `specs/013-learning-content-ui-polish/` contained only `feature-request.md` before this Architect pass.
- Implementation setup on 2026-05-10 started in `/Users/chap/devel/cabadrive-013-learning-content-ui-polish` on `codex/013-learning-content-ui-polish`, tracking `origin/main`.
- Pre-edit `git status --short --branch` showed only untracked `specs/013-learning-content-ui-polish/` in this worktree; no product/content/test files were dirty before implementation.
- Complete 013 feature memory was present and read before edits: `feature-request.md`, `spec.md`, `plan.md`, and `tasks.md`.
- Sibling 010 is not merged into this branch/main baseline: `/Users/chap/devel/cabadrive-010-ui-ux-learning-intake` is on `codex/010-ui-ux-learning-intake`, behind `origin/main` by one commit, with unmerged local changes.
- Sibling 010 read-only diff stat showed overlap in `src/App.tsx`, `src/styles.css`, `tests/e2e/app.spec.ts`, `docs_project/README.md`, `docs_project/project/feature-inventory.md`, `docs_project/project/frontend/frontend-docs.md`, and `docs_project/screens/learning-and-exam-flows.md`, plus new 010 docs/process files.
- 013 conflict decision: do not consume or copy sibling 010 source/doc/test files. Implement 013 as small current-main patches to `TopicGuideTicketBlock`, `QuestionCard` metadata, scoped content JSON, focused tests, and concise docs only. If later rebase conflicts with 010, Orchestrator should order/rebase rather than treating 010 as an implementation input.
- 014 boundary confirmed before edits: do not edit `specs/014-orchestrator-first-enforcement/*` or PR #66 state.
- Current `TopicGuideTicketBlock` renders canonical Spanish question/answers and a repeated per-ticket `Статус: неофициальная B-практика` chip.
- Current `QuestionCard` in `Учить` does not visibly include the ticket ID in the metadata row.
- Current `b-fallback-028` and `b-fallback-412` have no entries in `content/translations/ru.translations.json`.
- Current parking-clearance topic already includes `b-fallback-028` and `b-fallback-412`, Spanish phrase terms around `10 metros` and `5 metros`, and explanations that can be polished narrowly.
- Sibling 010 feature memory/diff indicates overlapping work in `src/App.tsx`, `src/styles.css`, `tests/e2e/app.spec.ts`, and durable docs around support reveal/navigation/source-of-truth behavior.
- Latest-main update on 2026-05-10: fetched `origin`, confirmed `origin/main` at `a26a12493123fcc0774a513e44fbf23663658ec0` (`[codex] Add learner difficulty labels (#71)`), and merged `origin/main` into `codex/013-learning-content-ui-polish` with `git merge --no-ff origin/main` rather than squash.
- Latest-main conflict resolution on 2026-05-10: resolved conflicts in `src/App.tsx`, `tests/e2e/app.spec.ts`, `docs_project/project/feature-inventory.md`, `docs_project/project/frontend/frontend-docs.md`, and `docs_project/screens/learning-and-exam-flows.md`. Resolution preserved feature 013 materials translations, missing-translation fallback, ticket IDs in `Учить`, compact CABA/RF wording, and removal of repeated materials per-ticket `Статус: неофициальная B-практика`; it also kept feature #71 learner difficulty indicators in learning, mistakes, materials topic headings, and materials ticket blocks.
- Latest-main scope boundary on 2026-05-10: no `specs/014-orchestrator-first-enforcement/*` files were edited while resolving the merge.

### Dead Ends

- Content-term dead end: adding topic-guide Spanish terms with `sourceQuestionIds` for both `b-fallback-028` and `b-fallback-412` initially failed validation because `b-fallback-412` says `para cada lado` while `b-fallback-028` says `de cada lado`. Fix: keep `de cada lado de la entrada` tied only to `b-fallback-028`, and use `5 metros para cada lado de la entrada` for the exact `b-fallback-412` term while preserving the requested `5 metros de cada lado de la entrada` trap phrase in prose/explanations.
- Review follow-up dead end: a later Review Agent finding showed the same provenance problem still existed in `content/vocabulary/ru.vocabulary.json` for `term-de-cada-lado`. Fix: scope `term-de-cada-lado` to `b-fallback-028` with the exact `10 metros de cada lado de la entrada` example, and add separate `term-para-cada-lado` scoped to `b-fallback-412` with the exact `5 metros para cada lado de la entrada` example.
- Docker smoke blocker: `docker ps` and `make build` both failed because the Docker daemon is not reachable at `unix:///Users/chap/.docker/run/docker.sock`. No `make up` container was started, so no `make down` cleanup was possible.

### Known Issues

- Direct UI edits in 013 may conflict with unmerged 010 if Orchestrator does not order or rebase branches carefully.
- Docker smoke may conflict across parallel worktrees if the project keeps a fixed container name; Implementation should record any environment blocker exactly rather than silently skipping runtime evidence.
- `CABA/RF` enrichment may require source verification beyond this polish slice; unsupported additions should become follow-up, not filler.
- 010 remains unmerged and overlaps the same UI/test/docs files. This implementation did not consume 010 files; future sequencing/rebase may need small conflict resolution in `QuestionCard`, `TopicGuideTicketBlock`, `src/styles.css`, e2e tests, and durable docs.
- External GitHub Actions are currently blocked by a repository billing/spending-limit annotation; this implementation update will not attempt to change workflows, branch protection, or billing configuration.

### Verification Evidence

- `node --test tests/content-translation-alignment.test.mjs` passed 7 tests after adding `b-fallback-028` and `b-fallback-412` translations plus approved evidence.
- `node --test tests/content-topic-guide.test.mjs` passed 22 tests after adding focused parking-clearance assertions. The new test checks that the parking topic teaches `hospital/centro de salud -> 10 metros de cada lado de la entrada` and frames `5 metros de cada lado de la entrada` as trap/falso/wrong wording.
- `pnpm run validate:content` passed: 460 category B fallback questions and 276 local image references.
- `pnpm run test` passed 73 Node tests.
- `pnpm run build` passed; Vite built production assets and generated a service worker with 280 cached assets. Vite emitted the existing large chunk warning for `index-CPIjM-cz.js`.
- `pnpm run test:e2e` passed 14 Playwright tests across `chromium` and `mobile`.
- `pnpm run preflight` passed: feature-memory gate, repository baseline check, content validation, Node tests, build, and e2e.
- `git diff --check` passed.
- Docker smoke evidence: `make build` failed before build start with `Cannot connect to the Docker daemon at unix:///Users/chap/.docker/run/docker.sock. Is the docker daemon running?`; this is recorded as an environment blocker.
- Materials e2e evidence covers section-level draft/unofficial/fallback labels, a translated ticket block, governed Russian answer translations, missing-translation fallback on `b-fallback-031`, local image rendering, canonical Spanish answers, removal of repeated per-ticket `Статус: неофициальная B-практика`, and no external/PDF requests.
- Learning e2e evidence covers visible `Билет b-fallback-001` in the `Учить` question-card metadata while active exam e2e still confirms no translation/explanation support surfaces in an active attempt.
- CABA/RF e2e evidence covers the new compact contrast title `Входы в больницы и centros de salud`.
- Review follow-up 2026-05-10: `node --test tests/content-validation.test.mjs` passed 4 tests after adding focused parking vocabulary provenance coverage for `term-de-cada-lado` and `term-para-cada-lado`.
- Review follow-up 2026-05-10: `node --test tests/content-topic-guide.test.mjs` passed 22 tests after the vocabulary provenance fix.
- Review follow-up 2026-05-10: `pnpm run validate:content` passed after the vocabulary provenance fix: 460 category B fallback questions and 276 local image references.
- Latest-main update 2026-05-10: initial `pnpm run validate:content` and `node --test tests/content-validation.test.mjs` failed because #71 difficulty metadata detected stale `parking-clearances-and-corners` `difficultyMeta.sourceFingerprint` after the 013 topic-guide prose changes. Resolution was to recompute only that topic fingerprint with `difficultyTopicFingerprint`, leaving the #71 basis counts/hash unchanged.
- Latest-main update 2026-05-10: `git diff --check` passed after conflict resolution.
- Latest-main update 2026-05-10: `pnpm run validate:content` passed after fingerprint refresh: difficulty labels validated for 460 questions and 38 topics; content validation passed for 460 category B fallback questions and 276 local image references.
- Latest-main update 2026-05-10: `node --test tests/content-topic-guide.test.mjs` passed 22 tests.
- Latest-main update 2026-05-10: `node --test tests/content-validation.test.mjs` passed 4 tests.
- Latest-main update 2026-05-10: `pnpm run test` passed 81 Node tests.
- Latest-main update 2026-05-10: `pnpm run build` passed; Vite built production assets and generated a service worker with 280 cached assets. Vite emitted the existing large chunk warning for `index-B1FNbUYD.js`.
- Latest-main update 2026-05-10: `pnpm run test:e2e` passed 14 Playwright tests across `chromium` and `mobile`.
- Latest-main update 2026-05-10: `pnpm run preflight` passed: feature-memory gate, repository baseline check, content validation, Node tests, build, and e2e. Note: the feature-memory gate reported `specs/012-orchestrator-final-validation-loop/{spec,plan,tasks}.md` because that mainline feature memory is now present on `origin/main`; the 013 feature memory remains complete and current.
- Latest-main update 2026-05-10 Docker blocker: `docker ps` failed with `Cannot connect to the Docker daemon at unix:///Users/chap/.docker/run/docker.sock. Is the docker daemon running?`; per instruction, no `make build`, `make up`, or `make down` was attempted.

### Implementation Agent Feedback

- Added scoped vocabulary terms for exact canonical wording: `estacionar`, `entrada`, `de cada lado`, `para cada lado`, and `libre`. Skipped adding `hospital` and `centro de salud` to `content/vocabulary/ru.vocabulary.json` because those words are not present in the canonical text/answers for `b-fallback-028`/`b-fallback-412`; they remain visible in guide prose, explanations, and CABA/RF as image/context learning support. Architect may decide whether a future image-metadata/source-trace slice should permit image-derived vocabulary provenance.
- CABA/RF enrichment stayed compact and fallback-practice-bound: one parking-health-entrance contrast was added with `confidence: needs_review` and only the fallback practice source ID. No broad legal-source claim was added.
- Repeated status noise was reduced only in `TopicGuideTicketBlock`; product/materials section status and source footer truth remain visible.
- Exam mode was intentionally not changed for ticket IDs; the acceptance target was `Учить`, and active exam support-hiding remains covered by e2e.

### Architect Disposition Of Feedback

- Vocabulary provenance feedback: create a future task/ticket only if Orchestrator wants image/context-derived learner vocabulary such as `hospital` and `centro de salud` to become governed vocabulary. 013 does not require this before review because the implementation added only exact canonical-wording vocabulary with valid current question provenance, and left image/context-only words in guide prose, explanations, and CABA/RF support.
- CABA/RF enrichment feedback: explicit not-needed decision for 013. The compact `confidence: needs_review` fallback-practice contrast satisfies this polish slice better than adding broad legal-source claims without a source pass. Any official-source CABA/RF expansion should be handled as a separate future content/source-trace feature.
- Repeated status feedback: explicit not-needed decision for 013. Reducing repeated status noise only inside `TopicGuideTicketBlock` is sufficient because product/materials section status and source/footer truth remain visible, preserving the `unofficial_b_fallback` contract.
- Exam ticket-ID feedback: explicit not-needed decision for 013. Leaving active exam mode unchanged is correct because the acceptance target is `Учить`, and active exam support-hiding remains covered by e2e evidence.
- Architect disposition outcome: no in-scope follow-up implementation is required before Review Agent. 013 may proceed to review, subject to normal Orchestrator checks for PR state, CI, conflicts, and review findings.
