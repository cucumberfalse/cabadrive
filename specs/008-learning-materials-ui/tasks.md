# Tasks: Learning Materials UI

## Architect Planning Setup

- [x] T001 Confirm assigned worktree is `/Users/chap/devel/cabadrive-008-learning-materials-intake`.
- [x] T002 Confirm active branch is `codex/008-learning-materials-intake`.
- [x] T003 Read `.specify/memory/constitution.md`.
- [x] T004 Read `docs_project/README.md`.
- [x] T005 Read `docs_project/project-idea.md`.
- [x] T006 Read `docs_project/project/frontend/frontend-docs.md`.
- [x] T007 Read `docs_project/project/backend/backend-docs.md`.
- [x] T008 Read `docs_project/project/feature-inventory.md`.
- [x] T009 Read `docs_project/screens/learning-and-exam-flows.md`.
- [x] T010 Read `docs/specify/README.md`.
- [x] T011 Read `specs/008-learning-materials-ui/feature-request.md`.
- [x] T012 Read relevant `specs/006-topic-study-guide/spec.md`.
- [x] T013 Read relevant `specs/006-topic-study-guide/plan.md`.
- [x] T014 Read relevant `specs/006-topic-study-guide/tasks.md`.
- [x] T015 Inspect relevant source/data files for context only: `src/App.tsx`, `src/data/content.ts`, `tests/e2e/app.spec.ts`, `content/guide/topic-study-guide.ru.json`, and `content/guide/topic-study-guide.coverage.json`.

## Architect Artifacts

- [x] T016 Create `spec.md` with goal, scope, non-goals, assumptions, user stories, acceptance criteria, negative scenarios, functional requirements, verification requirements, and review requirements.
- [x] T017 Create `plan.md` with implementation strategy for one UI slice, conservative local patterns, topic guide data import, dedicated view, list/detail navigation, canonical question joins, local images, tests, docs guidance, validation, and preflight.
- [x] T018 Create this `tasks.md` with implementation checklist, process memory requirements, verification evidence requirements, and `006` Slice F cross-reference.

## Implementation Slice: Topic Materials UI

- [x] T019 Confirm implementation starts from complete feature memory: `feature-request.md`, `spec.md`, `plan.md`, and `tasks.md`.
- [x] T020 Confirm implementation uses an assigned isolated worktree and branch for product changes, not this Architect-only branch unless Orchestrator explicitly assigns it.
- [x] T021 Re-read `spec.md`, `plan.md`, and this `tasks.md` before editing product files.
- [x] T022 Import `content/guide/topic-study-guide.ru.json` through `src/data/content.ts`.
- [x] T023 Add typed UI-facing models for topic guide metadata, topics, Spanish terms, ticket blocks, answer explanations, and trap notes.
- [x] T024 Add or reuse a canonical `questionById` lookup for joining guide tickets to `Question` records.
- [x] T025 Add a helper or local render path that matches guide `answerExplanations[].answerId` to canonical answers.
- [x] T026 Add learner-facing status labels for guide `draft`, topic `draft`, `unofficial_learning_aid`, and `unofficial_b_fallback` without exposing raw enum names as primary copy.
- [x] T027 Add a new app view value for the topic materials section.
- [x] T028 Add a new top navigation button, preferred label `Материалы`, without removing `Учить`, `Экзамен`, `Ошибки`, `Словарь`, or `CABA/RF`.
- [x] T029 Implement a dedicated `TopicGuideView` or equivalent separate component for the new materials section.
- [x] T030 Render the topic list in the order provided by `topic-study-guide.ru.json`.
- [x] T031 Implement topic selection/list-detail navigation inside the materials section.
- [x] T032 Render selected topic title and summary.
- [x] T033 Render `learningMaterialRu` as concise Russian study material.
- [x] T034 Render `practicalReasoningRu` when present.
- [x] T035 Render `spanishTerms` with Spanish term text, Russian meaning, and compact source-question context if useful.
- [x] T036 Render `trapNotes` when present after inspecting the exact content shape.
- [x] T037 Render each topic `tickets` block as a full guide ticket block.
- [x] T038 For each ticket block, render canonical Spanish question text from the joined canonical `Question`.
- [x] T039 For each ticket block, render canonical answer options in canonical order.
- [x] T040 For each ticket block, visibly indicate the canonical correct answer.
- [x] T041 For each answer option, render the matching Russian guide explanation when provided.
- [x] T042 For questions with canonical local images, render the image using local asset semantics such as `assetUrl(question.image.localPath)`.
- [x] T043 Handle missing question IDs, answer IDs, or explanation joins without crashing, and cover the behavior with a test or record why existing validation makes the state unreachable.
- [x] T044 Keep active exam attempt behavior unchanged: no translation/explanation support is introduced there by this feature.
- [x] T045 Keep the existing condensed CABA/RF guide available as a separate view.
- [x] T046 Ensure no raw PDF viewer, runtime network fetch, remote image URL, backend endpoint, or cloud dependency is introduced.
- [x] T047 Update CSS only as needed for the new view, preserving existing responsive behavior and preventing text overflow on mobile.
- [x] T048 Update durable `docs_project/` docs only if implementation changes documented navigation or learning-flow behavior; otherwise record that docs did not need changes.

## Tests And Evidence

- [x] T049 Add e2e coverage that the new top navigation button opens the materials section.
- [x] T050 Add e2e coverage that existing learn/exam/mistakes/vocabulary/CABA-RF navigation remains reachable.
- [x] T051 Add e2e coverage that the topic list renders from `topic-study-guide.ru.json`.
- [x] T052 Add e2e coverage that a topic detail renders title, summary/material, Spanish terms, and status labels.
- [x] T053 Add e2e or unit coverage that a guide ticket block joins to canonical Spanish question text and answer options.
- [x] T054 Add e2e or unit coverage that correct answer and per-answer Russian explanations render.
- [x] T055 Add e2e coverage for a guide ticket with a local image.
- [x] T056 Add e2e or DOM evidence for a dual-topic ticket rendering as a full block in both topic pages when existing data supports this.
- [x] T057 Add unit coverage for join/status helpers if helpers are extracted.
- [x] T058 Verify no runtime network/PDF dependency by code review and, where practical, Playwright request monitoring.
- [x] T059 Run `pnpm run validate:content`.
- [x] T060 Run `pnpm run test`.
- [x] T061 Run `pnpm run build`.
- [x] T062 Run `pnpm run test:e2e`.
- [x] T063 Run `pnpm run preflight`.
- [x] T064 Run `git diff --check`.
- [x] T065 Record command evidence, screenshots if useful, and any exact unrelated blockers in Process Memory below.

## Cross-Reference To 006 Slice F

- [x] T066 Confirm this `008` UI implementation closes/cross-references `006` Slice F T061: separate topic guide section/navigation entry.
- [x] T067 Confirm this `008` UI implementation closes/cross-references `006` Slice F T062: topic list and topic detail rendering from structured guide content.
- [x] T068 Confirm this `008` UI implementation closes/cross-references `006` Slice F T063: canonical Spanish question text, answer options, correct answer, local image, and Russian explanations for guide ticket blocks.
- [x] T069 Confirm this `008` UI implementation closes/cross-references `006` Slice F T064: Spanish words, concise Russian material, and trap notes in required topic sequence.
- [x] T070 Confirm this `008` UI implementation closes/cross-references `006` Slice F T065: unofficial-learning-aid and fallback question status clarity.
- [x] T071 Confirm this `008` UI implementation closes/cross-references `006` Slice F T066: no raw PDF viewer or runtime network fetch.
- [x] T072 Confirm this `008` UI implementation closes/cross-references `006` Slice F T067: Playwright coverage for reachability, required topic sequence, local images, and topic-ticket rendering.
- [x] T073 Do not edit `specs/006-topic-study-guide/*` while closing/cross-referencing these tasks unless a later Architect explicitly changes that boundary.

## PR Readiness

- [x] T074 Confirm implementation PR has a single assigned UI slice.
- [x] T075 Confirm `tasks.md` process memory is current before review.
- [x] T076 Confirm any Implementation Agent feedback items are recorded for Architect disposition.
- [x] T077 Confirm no out-of-scope product/content/source changes are included.
- [x] T078 Confirm no blocking review findings remain.
- [ ] T079 Confirm required checks are green after push/PR.
- [ ] T080 Confirm the PR has no unresolved merge conflicts.
- [ ] T081 Leave only final human approval or merge mechanics remaining.

## Process Memory

### Architect Decisions

- 008 is treated as a standalone UI-integration feature that closes/cross-references 006 Slice F tasks T061-T067.
- The existing CABA/RF condensed guide remains a separate tab; the new topic materials section is additive.
- Preferred top navigation label is `Материалы`.
- The topic guide may be exposed while `draft` only with clear draft/incomplete and unofficial-learning-aid status.
- The UI must join guide ticket blocks to canonical question data instead of duplicating Spanish question text.
- Source-trace and official-document archive internals stay out of the main learner UI unless reduced to compact status context.
- This Architect pass must not edit `specs/006-topic-study-guide/*`.

### Architect Context Evidence

- Current branch/worktree check showed `/Users/chap/devel/cabadrive-008-learning-materials-intake` on `codex/008-learning-materials-intake`.
- `src/App.tsx` currently has `View = "learn" | "exam" | "mistakes" | "vocabulary" | "guide"` and a `GuideView` for the old condensed guide.
- `src/data/content.ts` currently imports `content/guide/ru.condensed-guide.json` but not the topic study guide artifacts.
- `content/guide/topic-study-guide.ru.json` currently reports id `topic-study-guide`, locale `ru`, status `draft`, content status `unofficial_learning_aid`, and 38 topics.
- `content/guide/topic-study-guide.coverage.json` currently reports status `draft` and expected question count 460.
- Existing 006 Slice F tasks T061-T067 are open and map directly to this 008 UI request.

### Known Issues

- The topic guide is currently draft; implementation must avoid final/published wording.
- The current question set remains `unofficial_b_fallback`; implementation must not imply official or complete GCBA category B coverage.
- The exact `trapNotes` shape should be inspected during implementation before typing/rendering.
- Physical dual-topic rendering evidence depends on existing guide data having a dual placement with rendered ticket data. If the data does not provide a suitable learner-facing example, implementation must record the blocker and add the closest testable renderer evidence.
- Long topic pages may be dense on mobile; implementation should keep layout scannable and only add pagination/collapsible behavior if needed.

### Implementation Agent Feedback

- Implementation used the Orchestrator-assigned worktree `/Users/chap/devel/cabadrive-008-learning-materials-intake` and branch `codex/008-learning-materials-intake`; this overrides the Architect note that future implementation might use a separate worktree.
- Playwright initially reused an already-running preview server on port `4173` from another local process, which served an older bundle without the `Материалы` tab. Review finding P2 correctly noted that requiring callers to remember `PLAYWRIGHT_PORT` was still unsafe. The config now computes a deterministic per-worktree default port, uses `vite preview --strictPort`, and disables server reuse by default; reuse is only an explicit local opt-in through `PLAYWRIGHT_REUSE_EXISTING_SERVER=1`, and remains disabled in CI.
- No `specs/006-topic-study-guide/*`, `content/guide/topic-study-guide.*.json`, `content/official-documents/*`, `content/questions/*`, package files, runtime files, or Docker files were edited.
- No separate Node unit test was added for component-local render helpers because the project has no TS component unit-test harness; existing `tests/content-topic-guide.test.mjs` validates missing question IDs and missing answer explanations at content level, while the UI keeps non-crashing fallback copy for missing questions/explanations.

### Implementation Decisions

- Imported `content/guide/topic-study-guide.ru.json` only through `src/data/content.ts`, with UI-facing TypeScript types for guide metadata, topics, terms, tickets, answer explanations, and trap notes.
- Added `questionById` in the data boundary and joined guide tickets to canonical `Question` records at render time for Spanish text, answer options, correct answer, source title/status, and images.
- Rendered canonical question image paths through `assetUrl(question.image.localPath)` and only allowed guide ticket `imageLocalPath` as a local `content/assets/` fallback.
- Added a new `materials` app view and `Материалы` top-nav button while preserving `Учить`, `Экзамен`, `Ошибки`, `Словарь`, and `CABA/RF`.
- Kept `CABA/RF` as the existing condensed contrast guide and kept active exam attempts unchanged: no translation/explanation support was introduced in exam mode.
- Rendered guide status as learner-facing Russian labels: `Черновик: материал неполный`, `Неофициальная учебная поддержка`, and `Текущие билеты: неофициальная B-практика, не полная официальная база GCBA`; raw enum values are not primary UI copy.
- Inspected `trapNotes` shape before typing/rendering: notes may have `id`, `sourceQuestionIds`, both, or only `textRu`.
- Updated durable docs for the new navigation and topic materials flow.

### Verification Evidence

- `pnpm run validate:content` passed: content validation reported 460 category B fallback questions and 276 local image references.
- `pnpm run test` passed: 72 Node tests passed.
- `pnpm run build` passed: validation, asset sync, Vite build, and service worker generation succeeded; Vite emitted the existing-style large chunk warning after bundling the guide JSON.
- `pnpm exec playwright test tests/e2e/app.spec.ts -g "materials view"` passed with no `PLAYWRIGHT_PORT`: 6 materials-focused tests passed across chromium and mobile, using deterministic default port `5275` for this worktree.
- `pnpm run test:e2e` passed with no `PLAYWRIGHT_PORT`: build plus 14 Playwright tests passed across chromium and mobile.
- `pnpm run preflight` passed with no `PLAYWRIGHT_PORT`: feature-memory gate, repo baseline check, content validation, 72 Node tests, build, and 14 Playwright tests all passed.
- `git diff --check` passed after review-finding fixes and process-memory update.
- Playwright coverage now verifies materials nav reachability, existing vocabulary/CABA-RF reachability plus existing learn/exam/mistakes flows, topic list/detail from topic guide data, draft/unofficial/fallback labels, canonical Spanish question/answers/correct answer/correct and incorrect explanations, local image rendering, dual-topic ticket `b-fallback-031` rendering as a full block with all canonical answers, correct-answer marker, and all per-answer explanations in both assigned topics, and no external request/PDF viewer for the materials section.

### Review Finding Follow-Up

- P2 Playwright default server reuse: addressed locally by deterministic per-worktree default port, `--strictPort`, and default `reuseExistingServer: false`; default `pnpm run test:e2e` and `pnpm run preflight` passed without `PLAYWRIGHT_PORT`.
- P3 materials test only proved correct-answer explanation: addressed by asserting an incorrect-answer explanation in the local-image ticket materials test.
- P3 dual-topic test was too shallow: addressed by asserting the full canonical answer set, correct-answer marker, and all guide per-answer explanations for `b-fallback-031` in both selected topics.
- Known P2/P3 review findings are fixed in this branch; T078 is checked for implementation readiness, with final review still owned by Review Agent.

### Final Sync Evidence

- Before PR sync, branch was behind `origin/main` by one commit: `98fa568 [codex] Harden agent workflow guidance`.
- Created local sync commit `5743b6f Implement learning materials UI` to include the full 008 diff scope, including previously untracked `specs/008-learning-materials-ui/*`.
- Ran `git rebase origin/main`; rebase completed with no conflicts.
- After rebase, local implementation commit became `9042d93871158f1f2a20f8d662eb4789ca1231fd` on top of `98fa568`.
- Branch status after sync: ahead of `origin/main` by one local commit, behind by zero.

### 006 Slice F Cross-Reference

- 008 closes/cross-references 006 Slice F T061 by adding the separate `Материалы` navigation entry and view.
- 008 closes/cross-references 006 Slice F T062 by rendering topic list/detail from `topic-study-guide.ru.json`.
- 008 closes/cross-references 006 Slice F T063 by rendering canonical Spanish ticket text, answers, correct answer, local images, and Russian per-answer explanations.
- 008 closes/cross-references 006 Slice F T064 by rendering Spanish terms, concise Russian material, practical reasoning, and trap notes in the topic detail.
- 008 closes/cross-references 006 Slice F T065 by surfacing unofficial-learning-aid and fallback question-set labels.
- 008 closes/cross-references 006 Slice F T066 by avoiding raw PDF viewers, runtime network fetches, backend endpoints, remote images, analytics, and cloud dependencies.
- 008 closes/cross-references 006 Slice F T067 by adding Playwright coverage for reachability, topic sequence, local images, canonical ticket rendering, and dual-topic ticket rendering.

### Known Issues After Implementation

- Topic guide content remains `draft`; the UI exposes it only with visible draft/incomplete and unofficial-learning-aid labels.
- Current question mode remains `unofficial_b_fallback`; the UI does not claim official or complete GCBA category B bank coverage.
- The bundled topic guide JSON increases the production JS chunk size; Vite reports a large chunk warning, but build and preflight pass.
- PR creation, push, review findings, required checks, conflicts, and human merge approval remain outside this implementation turn because the user explicitly requested no commit, push, or PR.
