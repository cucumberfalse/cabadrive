# Tasks: Institution Entrance Timing Contrast

## Architect Planning Setup

- [x] T001 Confirm assigned worktree is `/Users/chap/devel/cabadrive-020-institution-entrance-timing-contrast`.
- [x] T002 Confirm active branch is `codex/020-institution-entrance-timing-contrast`.
- [x] T003 Read `.specify/memory/constitution.md`.
- [x] T004 Read `docs_project/README.md`.
- [x] T005 Read `docs_project/project-idea.md`.
- [x] T006 Read `docs_project/project/frontend/frontend-docs.md`.
- [x] T007 Read `docs_project/project/backend/backend-docs.md`.
- [x] T008 Read `docs_project/project/feature-inventory.md`.
- [x] T009 Read `docs_project/screens/learning-and-exam-flows.md`.
- [x] T010 Read `docs/specify/README.md`.
- [x] T011 Read active `specs/020-institution-entrance-timing-contrast/feature-request.md`.
- [x] T012 Inspect current `parking-clearances-and-corners` topic content read-only.
- [x] T013 Inspect current CABA/RF parking-health entry read-only.
- [x] T014 Inspect current materials/content tests read-only.
- [x] T015 Inspect feature `006` and feature `013` process memory for parking-clearance source and validation context.

## Architect Artifacts

- [x] T016 Create `spec.md` with goal, scope, decisions, acceptance criteria, negative scenarios, functional requirements, boundaries, verification requirements, and review requirements.
- [x] T017 Create `plan.md` with the content-first implementation approach, source/evidence guidance, tests, risks, rollback, and handoff.
- [x] T018 Create this `tasks.md` with implementation tasks, review requirements, process memory, verification placeholders, and feedback-disposition sections.

## Required Slice A: Setup And Source Orientation

- [x] T019 Confirm implementation starts from complete feature memory: `feature-request.md`, `spec.md`, `plan.md`, and `tasks.md`.
- [x] T020 Confirm Implementation Agent uses only the Orchestrator-assigned isolated worktree and branch for implementation.
- [x] T021 Run `git status --short` and record any pre-existing dirty files.
- [x] T022 Inspect `content/guide/topic-study-guide.ru.json` parking topic before editing.
- [x] T023 Inspect `content/guide/topic-study-guide.source-trace.json` entry `parking-clearances-distances-corners-and-cordon`.
- [x] T024 Inspect feature `006` process memory note for Ley 2148 7.1.9(l) timing-qualified school/temple/bank entrances.
- [x] T025 Inspect feature `013` process memory for the current hospital/health `10 metros` and `5 metros` trap behavior.
- [x] T026 Record source basis and whether source trace needs edits before changing content.

## Required Slice B: Visible Parking Material Contrast

- [x] T027 Add a concise rendered-material contrast to `parking-clearances-and-corners`, preferably in `learningMaterialRu` after the hospital/health paragraph.
- [x] T028 Preserve visible `hospital/centro de salud`.
- [x] T029 Preserve exact visible phrase `10 metros de cada lado de la entrada`.
- [x] T030 Preserve `5 metros` as trap/falso/wrong wording for the hospital/health entrance context.
- [x] T031 Add visible school timing phrase `en horas de clase` with concise Russian support.
- [x] T032 Add visible temple timing phrase `oficios/ceremonias` or `oficios o ceremonias` with concise Russian support.
- [x] T033 Add visible bank timing phrase `horario de atención al público` with concise Russian support.
- [x] T034 Keep the contrast separate enough that hospital/health entrance logic remains unconditional for the current tickets.
- [x] T035 Avoid broad rewrites of unrelated parking topic paragraphs, tickets, or taxonomy-mixed content.
- [x] T036 Avoid changing `b-fallback-028` and `b-fallback-412` answer explanations unless needed to preserve clarity; record any such edit.
- [x] T037 Do not render all topic `claims` globally. If claim rendering seems necessary, stop and record feedback for Architect/Orchestrator disposition.

## Required Slice C: Source Trace, Fingerprints, And Content Validation

- [x] T038 If rendered wording changes the meaning of existing source-backed claims, update `content/guide/topic-study-guide.source-trace.json` and matching claim text.
- [x] T039 If rendered wording simply exposes the existing source-traced claim, leave source trace unchanged and record that decision.
- [x] T040 Run `pnpm run validate:content` after content edits.
- [x] T041 If validation reports stale `parking-clearances-and-corners` difficulty metadata, refresh only the affected `difficultyMeta.sourceFingerprint`.
- [x] T042 If term/trap/claim counts change, update `difficultyMeta.rationaleRu` count text truthfully.
- [x] T043 Run `node --test tests/content-topic-guide.test.mjs`.
- [x] T044 Record fingerprint/source-trace decisions and command evidence in Process Memory.

## Required Slice D: Content Tests For Rendered Fields

- [x] T045 Add or update a focused content test for the institution entrance timing contrast.
- [x] T046 Ensure the content test builds proof text only from fields rendered by `TopicGuideView`, not `claims`.
- [x] T047 Assert rendered-field text contains `hospital/centro de salud`.
- [x] T048 Assert rendered-field text contains `10 metros de cada lado de la entrada`.
- [x] T049 Assert rendered-field text frames `5 metros` as trap/falso/wrong for hospital/health entrances.
- [x] T050 Assert rendered-field text contains `en horas de clase`.
- [x] T051 Assert rendered-field text contains `oficios` and `ceremonias`.
- [x] T052 Assert rendered-field text contains `horario de atención al público`.
- [x] T053 Run `node --test tests/content-topic-guide.test.mjs` and record evidence.

## Required Slice E: E2E Learner Visibility Smoke

- [x] T054 Add or update e2e coverage in `tests/e2e/app.spec.ts` for the parking topic in `Материалы`.
- [x] T055 E2E asserts visible `10 metros de cada lado de la entrada`.
- [x] T056 E2E asserts visible `5 metros` trap/falso/wrong context or the trap note remains visible.
- [x] T057 E2E asserts visible `en horas de clase`.
- [x] T058 E2E asserts visible `oficios` and `ceremonias`.
- [x] T059 E2E asserts visible `horario de atención al público`.
- [x] T060 Preserve existing materials local-first/no external/PDF smoke coverage.
- [x] T061 Run `pnpm run test:e2e` and record evidence.

## Optional Slice F: CABA/RF Only If Justified

- [x] T062 Decide whether the materials-only fix satisfies the learner-visible acceptance criteria.
- [x] T063 If materials-only is sufficient, leave `content/guide/ru.condensed-guide.json` unchanged and record the decision.
- [x] T064 Not applicable by Architect disposition: CABA/RF is not necessary because the materials-only fix satisfies learner-visible acceptance.
- [x] T065 Not applicable by Architect disposition: CABA/RF was not edited, so disclaimer/status semantics and guide separation remain unchanged.
- [x] T066 Not applicable by Architect disposition: CABA/RF was not edited, so no matching CABA/RF e2e or content tests are required for this feature.
- [x] T067 Record CABA/RF decision and evidence in Process Memory.

## Required Slice G: Active Exam And Local-First Regression

- [x] T068 Confirm no active exam support behavior was intentionally changed.
- [x] T069 Ensure active exam e2e support-hiding coverage remains green through `pnpm run test:e2e` or `pnpm run preflight`.
- [x] T070 Confirm no runtime network dependency, backend, remote content fetch, or external asset dependency was introduced.
- [x] T071 If implementation touches UI/runtime behavior, run Docker smoke: `make build`, `make up`, smoke check `http://localhost:5173`, and `make down`.
- [x] T072 If Docker is unavailable, record exact blocker output and any cleanup attempt.

## Required Slice H: Final Verification And PR Readiness

- [x] T073 Run `pnpm run validate:content`.
- [x] T074 Run `pnpm run test`.
- [x] T075 Run `pnpm run build`.
- [x] T076 Run `pnpm run test:e2e`.
- [x] T077 Run `pnpm run preflight`.
- [x] T078 Run `git diff --check`.
- [x] T079 Record command summaries and acceptance evidence in Process Memory.
- [x] T080 Confirm all acceptance criteria have evidence, not only AI-written summary.
- [x] T081 Confirm Implementation Agent feedback is recorded for Architect disposition.
- [x] T082 Confirm no unresolved merge conflicts before PR readiness.
- [ ] T083 Confirm no blocking review findings remain before completion.
- [ ] T084 Confirm required checks are green after PR push.
- [ ] T085 Confirm only final human approval or merge mechanics remain before marking the PR complete.

## Review Requirements

- [ ] T086 Review Agent verifies complete feature memory exists and role boundaries were followed.
- [ ] T087 Review Agent verifies implementation did not render all topic `claims` globally.
- [ ] T088 Review Agent verifies the timing contrast is visible in rendered learner material, not only source metadata.
- [ ] T089 Review Agent verifies hospital/health `10 metros de cada lado de la entrada` remains visible.
- [ ] T090 Review Agent verifies `5 metros` remains framed as trap/falso/wrong for the hospital/health entrance context.
- [ ] T091 Review Agent verifies school timing uses `en horas de clase` or source-equivalent wording.
- [ ] T092 Review Agent verifies temple timing uses `oficios/ceremonias` or `oficios o ceremonias`.
- [ ] T093 Review Agent verifies bank timing uses `horario de atención al público`.
- [ ] T094 Review Agent verifies tests do not rely only on non-rendered `claims`.
- [ ] T095 Review Agent verifies source-trace/fingerprint evidence is current for touched content.
- [ ] T096 Review Agent verifies active exam support-hiding and local-first constraints did not regress.
- [ ] T097 Review Agent verifies `tasks.md` contains current decisions, verification evidence, known issues, dead ends, and Implementation Agent feedback before merge readiness.

## Process Memory

### Architect Decisions

- Primary learner surface is `Материалы`, specifically the existing rendered `parking-clearances-and-corners` topic.
- The implementation should prefer a content-only addition in `learningMaterialRu`, with at most one focused trap note if useful.
- Rendering all topic `claims` globally is explicitly out of scope for this feature because it would affect many topics and expose source summaries as learner prose.
- `CABA/RF` is optional. It should remain unchanged if the materials surface satisfies visibility; if edited, it must stay compact and tested.
- Ticket-specific explanations for `b-fallback-028` and `b-fallback-412` should stay centered on hospital/health entrances unless a small clarity edit is necessary.
- Content tests must prove visibility from rendered fields and exclude `claims`.
- The implementation must refresh affected deterministic fingerprints/evidence as required by validators.
- Architect did not edit product code, content JSON, tests, durable docs outside this feature folder, commits, pushes, PRs, sibling feature folders, or other files.

### Implementation Decisions

- Added exactly one rendered `learningMaterialRu` paragraph after the hospital/health entrance paragraph in `content/guide/topic-study-guide.ru.json`.
- The new paragraph keeps `hospital/centro de salud` as the current-ticket anchor for `10 metros de cada lado de la entrada`, and separately teaches schools as `en horas de clase`, temples as `oficios/ceremonias`, and banks as `horario de atención al público`.
- Left `b-fallback-028` and `b-fallback-412` answer explanations unchanged because they already preserve the unconditional hospital/health entrance logic and the `5 metros` trap/falso/wrong framing.
- Did not render `claims` globally and did not edit `src/App.tsx`; the existing rendered `learningMaterialRu` field was sufficient.
- Did not add a trap note because the new contrast paragraph is visible in the short material and the existing `5 metros` hospital/health trap note remains visible.
- Refreshed only `parking-clearances-and-corners` `difficultyMeta.sourceFingerprint`, from `5131312421bf205a64f18e22cc8e3305b7673f8e5d1b1c2eaa2a84205a0da749` to `38a4a7c668baac2c263f18031f98d01dc7ba9374ad0235892e1e7d1fb65d5542`, after `pnpm run validate:content` reported it stale.
- Left `difficultyMeta.rationaleRu` unchanged because term, trap-note, and claim counts did not change: 15 terms, 5 trap notes, 3 source claims.
- Left `content/guide/topic-study-guide.source-trace.json` unchanged because the rendered paragraph exposes the existing source-traced timing contrast without changing the claim/source-trace meaning.
- Left `content/guide/ru.condensed-guide.json` unchanged because `Материалы` now satisfies the visible learner-surface acceptance criteria and CABA/RF was optional.
- Ran `pnpm install --frozen-lockfile` after the first full `pnpm run test` attempt failed from missing local `node_modules`; the lockfile was already current and no tracked package files changed.

### Context Evidence

- Worktree check returned `/Users/chap/devel/cabadrive-020-institution-entrance-timing-contrast`.
- Branch check returned `codex/020-institution-entrance-timing-contrast`.
- Pre-Architect status showed untracked `specs/020-institution-entrance-timing-contrast/`, containing the Analyst-created `feature-request.md`.
- The parking topic currently renders hospital/health entrance prose and `5 metros` trap notes in `learningMaterialRu`/`trapNotes`.
- The parking topic currently contains the school/temple/bank timing contrast in `claims[0].textRu`, but `TopicGuideView` does not render `claims`.
- Current CABA/RF has one compact hospital/health entrance entry and does not show school/temple/bank timing.
- Source trace entry `parking-clearances-distances-corners-and-cordon` records time-qualified school/temple/bank entrance examples under Ley 2148 7.1.9(l).
- Feature `006` process memory records the prior review fix that school entrances are qualified by class hours, temple entrances by services/ceremonies, and bank entrances by public service hours.
- Feature `013` process memory records the current hospital/health `10 metros de cada lado de la entrada` and `5 metros` trap behavior and warns against unsupported broad CABA/RF expansion.
- Implementation setup on 2026-05-10: `git fetch origin main --quiet` showed `origin/main` at `90a11d943880606586d4bc02aa7774a8d7a73f3d`; `git rev-parse HEAD` returned the same SHA; `git merge-base --is-ancestor 90a11d943880606586d4bc02aa7774a8d7a73f3d HEAD` exited `0`; active branch is `codex/020-institution-entrance-timing-contrast`.
- Implementation pre-edit status on 2026-05-10: `git status --short` showed only untracked `specs/020-institution-entrance-timing-contrast/`, the feature memory created before this Implementation Agent pass. No tracked product/content/test files were dirty before implementation edits.
- Complete feature memory was present before implementation edits: `feature-request.md`, `spec.md`, `plan.md`, and `tasks.md`.
- Source basis before content edits: use existing local `content/guide/topic-study-guide.source-trace.json` entry `parking-clearances-distances-corners-and-cordon`, which cites Ley 2148 7.1.8, 7.1.9, and 7.1.13 and explicitly records that hospital/health-center 10 m ticket logic is unconditional while school, temple, and bank examples are time-qualified by Ley 2148 7.1.9(l).
- Source-trace decision before content edits: planned content change only exposes the already source-traced timing contrast in rendered `learningMaterialRu`; it does not change the meaning of the existing claim/source-trace entry, so `content/guide/topic-study-guide.source-trace.json` should remain unchanged unless validation or review exposes a mismatch.

### Dead Ends

- Initial full `pnpm run test` attempt failed after 109 passing subtests because `tests/domain.test.mjs` could not import package `typescript`; root cause was missing `node_modules` in this isolated worktree. `pnpm install --frozen-lockfile` installed the locked dependencies locally without tracked package-file changes, and the rerun passed 116 tests.
- Official `make up` Docker smoke was blocked by the fixed Compose `container_name: cabadrive`: Docker reported that `/cabadrive` was already in use by container `0d6fc7e5f782eec79a308c7acb95c2f14bf79a03e8b8c53fe50cb38dfc049c3b`. Read-only `docker inspect` showed that container belongs to sibling project `cabadrive-main-final-validation` with working dir `/Users/chap/devel/cabadrive-main-final-validation`, so this implementation did not stop, remove, or rename it.

### Known Issues

- The original hidden-claims issue is resolved in `Материалы` by rendered `learningMaterialRu`; source `claims` remain non-rendered by design.
- The expected stale topic difficulty fingerprint was resolved by updating only the parking topic `sourceFingerprint`.
- `make up` at `http://localhost:5173` remains blocked in this local environment by a sibling `/cabadrive` container using the repository's fixed container name. This is an environment/parallel-work collision, not a content/build failure. Cleanup: `make down` removed only the network created by the failed current-worktree `make up`; the sibling container was preserved.

### Verification Evidence

- `node --test tests/content-topic-guide.test.mjs` passed 22 tests after the content/test edit and again after a final helper robustness tweak. The focused parking test now builds proof text from rendered `TopicGuideView` fields only (`summaryRu`, `learningMaterialRu`, `practicalReasoningRu`, `spanishTerms`, `trapNotes`, and ticket explanations), not `claims`, and asserts `hospital/centro de salud`, `10 metros de cada lado de la entrada`, `5 metros` trap/falso/wrong framing, `en horas de clase`, `oficios`/`ceremonias`, and `horario de atención al público`.
- First `pnpm run validate:content` after the content edit failed only with `parking-clearances-and-corners: difficultyMeta.sourceFingerprint is stale`; this drove the scoped fingerprint refresh.
- `pnpm run validate:content` passed after the fingerprint refresh: difficulty labels validated for 460 questions and 38 topics; content validation passed for 460 category B fallback questions and 276 local image references.
- Rerun `node --test tests/content-topic-guide.test.mjs` passed 22 tests after the fingerprint refresh.
- `pnpm run test` initially failed because this worktree lacked `node_modules` and `typescript`; after `pnpm install --frozen-lockfile`, `pnpm run test` passed 116 Node tests.
- `pnpm run build` passed: content validation, asset sync, Vite production build, and service-worker generation with 280 cached assets. Vite emitted the existing large chunk warning for `index-Sifs2Ba7.js`.
- `pnpm run test:e2e` passed 34 Playwright tests across chromium and mobile. The updated materials smoke asserts visible `hospital/centro de salud`, `10 metros de cada lado de la entrada`, `5 metros` trap context, `en horas de clase`, `oficios/ceremonias`, and `horario de atención al público`; the existing active exam support-hiding test remains green.
- `pnpm run preflight` passed after the final test-helper tweak: feature-memory gate, repository baseline check, content validation, 116 Node tests, build, and 34 Playwright tests.
- `git diff --check` passed with no whitespace errors.
- `rg -n "^(<<<<<<<|=======|>>>>>>>)" content/guide/topic-study-guide.ru.json tests/content-topic-guide.test.mjs tests/e2e/app.spec.ts specs/020-institution-entrance-timing-contrast/tasks.md` returned no matches, confirming no conflict markers in touched files.
- Docker evidence: `make build` passed and built image `cabadrive:local`, including content validation and production build inside Docker.
- Docker smoke blocker and fallback: `make up` failed because sibling container `/cabadrive` from `/Users/chap/devel/cabadrive-main-final-validation` already owns the fixed name. `make down` then removed only the failed current-worktree Compose network. To smoke the built image without disturbing sibling work, `docker run --rm -d --name cabadrive-020-smoke -p 5174:8080 cabadrive:local` started a temporary container, `curl -fsS http://localhost:5174/` returned the Cabadrive HTML shell with `<title>Cabadrive</title>`, and `docker stop cabadrive-020-smoke` removed the temporary container. A follow-up `docker ps --filter name=cabadrive-020-smoke` and current-worktree network check returned no entries.
- Current diff evidence: tracked product/test files changed are `content/guide/topic-study-guide.ru.json`, `tests/content-topic-guide.test.mjs`, and `tests/e2e/app.spec.ts`; `specs/020-institution-entrance-timing-contrast/` remains untracked feature memory from the assigned Analyst/Architect handoff, with this Implementation Agent updating `tasks.md`.

### Implementation Agent Feedback

- No Architect disposition is required for product scope: the content-only materials fix satisfied acceptance without UI changes, CABA/RF edits, source-trace edits, or broad claim rendering.
- Local workflow feedback: the repository's fixed Docker `container_name: cabadrive` makes parallel worktree `make up` smoke fragile because one sibling container blocks all others from using the official port/name. This implementation preserved sibling work and used an alternate temporary smoke container only after recording the official `make up` blocker.

### Architect Feedback Disposition

- Architect reviewed the current implementation diff on 2026-05-10. Tracked implementation changes are limited to `content/guide/topic-study-guide.ru.json`, `tests/content-topic-guide.test.mjs`, and `tests/e2e/app.spec.ts`; there are no CABA/RF, source-trace, UI/runtime, or global claim-rendering changes in the diff.
- Product-scope disposition: no follow-up is needed for feature 020. The rendered `Материалы` paragraph and focused tests satisfy the acceptance criteria, and CABA/RF/source-trace/UI changes are not needed for this feature.
- Optional tasks T064-T066 are closed as not applicable, not as implemented CABA/RF work. T062/T063 selected the materials-only path, so future audit should not treat T064-T066 as unfinished product work.
- Docker workflow disposition: the fixed Compose `container_name: cabadrive` is a real parallel-worktree smoke fragility and should be considered for a future workflow/infrastructure task outside feature 020. It is not a feature-020 product blocker because the official `make up` blocker and alternate temporary-container smoke evidence are recorded, and this feature does not require Docker workflow changes.
