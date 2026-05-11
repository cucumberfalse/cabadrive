# Tasks: Learn All Questions

## Architect Planning Setup

- [x] T001 Confirm assigned worktree is `/Users/chap/devel/cabadrive-023-learn-all-questions`.
- [x] T002 Confirm active branch is `codex/023-learn-all-questions`.
- [x] T003 Read `AGENTS.md`.
- [x] T004 Read `.specify/memory/constitution.md`.
- [x] T005 Read `docs_project/project/frontend/frontend-docs.md`.
- [x] T006 Read `docs_project/project/feature-inventory.md`.
- [x] T007 Read `docs_project/screens/learning-and-exam-flows.md`.
- [x] T008 Read active `specs/023-learn-all-questions/feature-request.md`.
- [x] T009 Inspect relevant source/tests read-only enough to ground architecture: `src/search.ts`, `src/App.tsx`, `src/domain.ts`, and `tests/e2e/app.spec.ts`.

## Architect Artifacts

- [x] T010 Create `spec.md` with goal, scope, requirements, acceptance criteria, negative scenario, verification evidence requirements, review requirements, and architectural decisions.
- [x] T011 Create `plan.md` with implementation strategy, likely files, test guidance, verification plan, review plan, risks, rollback, and handoff.
- [x] T012 Create this `tasks.md` with concrete implementation tasks, review tasks, process-memory sections, evidence placeholders, and feedback-disposition requirements.

## Required Slice A: Implementation Setup

- [x] T013 Confirm Implementation Agent starts from complete feature memory: `feature-request.md`, `spec.md`, `plan.md`, and `tasks.md`.
- [x] T014 Confirm Implementation Agent uses the Orchestrator-assigned isolated worktree and branch.
- [x] T015 Run `git status --short --branch` before editing and record any pre-existing dirty or untracked files.
- [x] T016 Read the active feature memory and relevant source files before editing.
- [x] T017 Confirm no sibling worktree, sibling branch, sibling PR, dirty diff, or process memory will be overwritten, rebased, reset, removed, or otherwise mutated.

## Required Slice B: Test-First Coverage

- [x] T018 Add or update unit tests for the Learn/default shuffle helper before or alongside implementation.
- [x] T019 Unit-test that shuffle returns every input question exactly once and does not mutate the input array.
- [x] T020 Unit-test controlled randomization so different injected random streams can produce different orders without flaky probability assertions.
- [x] T021 Add or update Playwright coverage proving default Learn navigation total is `460`.
- [x] T022 Add or update Playwright coverage proving default Learn order changes across controlled refresh/reopen and stays stable within one session.
- [x] T023 Add or update Playwright coverage proving search still narrows the active collection and no-match search renders no card/navigation/answers.
- [x] T024 Update existing learning-flow tests that assume canonical `questions[0]` is the first default card, using ticket-ID search or controlled order instead of weakening the assertions.
- [x] T025 Preserve or add regression coverage for timer, support reveal, answer/progress restoration, local image/overlay behavior, and difficult marking.
- [x] T026 Preserve or add regression coverage that unofficial fallback labeling remains visible.

## Required Slice C: Default Learn Collection

- [x] T027 Remove the empty-query 25-question cap from the default Learn behavior.
- [x] T028 Implement default Learn as all current available validated questions for the active content mode.
- [x] T029 Add or reuse a pure shuffle helper with injectable randomness for deterministic tests.
- [x] T030 Ensure the default all-question order is initialized once per active app/Learn session and changes on refresh/reopen.
- [x] T031 Ensure timer ticks, answer selection, support reveal, difficult marking, and progress updates do not reshuffle the active default order.
- [x] T032 Ensure clearing a search query returns to the same session default order.
- [x] T033 Ensure implementation does not mutate imported `data.questions`.
- [x] T034 Ensure default navigation total is the full current bank count, currently `460`.

## Required Slice D: Search And Learning Behavior Preservation

- [x] T035 Preserve non-empty `searchQuestions(query)` matching across question IDs, Spanish text, answer text, topics, Russian translations, and explanations.
- [x] T036 Preserve search result navigation inside the filtered collection, including boundary disabled states.
- [x] T037 Preserve no-match search empty state with no answerable fallback card.
- [x] T038 Preserve per-ticket learning timer behavior, including pause/resume, expiry unresolved state, and answered-after-expiry behavior.
- [x] T039 Preserve answer recording and stored progress behavior by question ID.
- [x] T040 Preserve in-session selected-answer/support restoration when navigating away and back.
- [x] T041 Preserve difficult marking behavior by question ID.
- [x] T042 Preserve hidden-by-default Russian question/answer translations and automatic reveal after answer selection.
- [x] T043 Preserve local image rendering and approved explanation overlays only when learning support is visible.
- [x] T044 Confirm active exam mode remains unchanged and does not expose learning support during an active attempt.
- [x] T045 Confirm mistake review remains unchanged unless any shared helper change is deliberate and regression-tested.
- [x] T046 Preserve truthful `unofficial_b_fallback` / unofficial category B fallback labeling.

## Required Slice E: Content Readiness And Docs Disposition

- [x] T047 Record local content-count evidence for 460 questions and 276 image-backed records.
- [x] T048 Run content validation and record whether the current support/content bank is ready for all 460 questions.
- [x] T049 If a content/support readiness gap is discovered, stop short of claiming readiness, record the exact gap, and ask Orchestrator for Architect disposition or a separate scoped content-preparation slice.
- [x] T050 Do not edit question content, translations, explanations, images, overlays, or generated content indexes unless Orchestrator/Architect explicitly route a content-preparation follow-up.
- [x] T051 Do not update `docs_project/` by default; record that existing docs already cover 460 current fallback questions, active-collection Learn navigation, and unofficial fallback labeling.
- [x] T052 If implementation changes visible copy, behavior documentation, architecture, runtime workflow, or source/status semantics, update the relevant durable docs and record why.

## Required Slice F: Local Verification

- [x] T053 Run `node -e "const q=require('./content/questions/caba-b.unofficial-fallback.questions.json'); console.log(q.length, q.filter(x=>x.image).length)"` and record output.
- [x] T054 Run `pnpm run validate:content` and record outcome.
- [x] T055 Run `pnpm run test` and record outcome.
- [x] T056 Run `pnpm run build` and record outcome.
- [x] T057 Run `pnpm run test:e2e` and record outcome.
- [x] T058 Run `node scripts/check-feature-memory.mjs --worktree` and record outcome.
- [x] T059 Run `git diff --check` and record outcome.
- [x] T060 Run `pnpm run preflight` and record outcome, or record exact unrelated blocker and Orchestrator disposition.
- [x] T061 Run `git diff --name-only` or equivalent and confirm changed files are scoped to app/tests plus this feature memory and any justified durable docs.
- [x] T062 Confirm no unresolved merge conflicts.
- [x] T063 Record all verification evidence in Process Memory before review.

## Review Requirements

- [ ] T064 Review Agent verifies complete feature `023` memory exists before implementation changes.
- [ ] T065 Review Agent verifies role boundaries and scoped-file compliance.
- [ ] T066 Review Agent verifies default Learn exposes all 460 questions and no empty-query 25 cap remains.
- [ ] T067 Review Agent verifies session-stable randomization and refresh/reopen variability are deterministic-test covered.
- [ ] T068 Review Agent verifies search narrowing and no-match behavior remain correct.
- [ ] T069 Review Agent verifies support/timer/progress/difficult/image/overlay behavior remains keyed by question ID and regression-tested.
- [ ] T070 Review Agent verifies exam mode is not unintentionally changed.
- [ ] T071 Review Agent verifies unofficial fallback labeling remains intact and no official-complete-bank claim was introduced.
- [ ] T072 Review Agent verifies docs updates are either unnecessary with recorded reason or correctly scoped if behavior/copy changed.
- [ ] T073 Review Agent verifies verification evidence covers acceptance criteria and local preflight.
- [ ] T074 Review Agent verifies no unresolved Implementation Agent feedback remains before merge readiness.

## Process Memory

### Architect Decisions

- Default Learn should use all current available validated questions from the active content mode; for the current local fallback bank this is 460 questions.
- The reported 25-ticket behavior is caused by the empty-query path in `src/search.ts` returning `questions.slice(0, 25)` and `LearnView` using that empty-query result as its default collection.
- Randomization should be session-local and stable: initialize a shuffled all-question order once per app/Learn session, then keep it unchanged until refresh/reopen.
- Search should remain narrowing behavior. A non-empty query uses search results and navigation follows that filtered collection; clearing search returns to the same session default order.
- Keep learning mutable state keyed by question ID, not list index.
- Prefer a pure shuffle helper with injectable randomness for deterministic tests.
- No `docs_project` update is required by default because existing durable docs already state the 460-question fallback bank, 276 image-backed references, active Learn navigation, and unofficial fallback labeling requirements. Implementation must revisit this if it changes visible copy, documented behavior, architecture, or workflow.

### Context Evidence

- Architect status check reported worktree `/Users/chap/devel/cabadrive-023-learn-all-questions` on `codex/023-learn-all-questions...origin/main` with untracked `specs/023-learn-all-questions/`.
- Architect read the active intake, which records local evidence that `content/questions/caba-b.unofficial-fallback.questions.json` contains 460 question records and 276 records with an `image` reference.
- Architect read frontend docs and feature inventory stating the MVP uses local bundled content, current content mode is `unofficial_b_fallback`, the current fallback bank has complete Russian support for 460 questions, and image metadata coverage is complete for 276 image-backed question references.
- Architect read learning flow docs requiring Learn navigation inside the active search collection, hidden-by-default Russian support, per-ticket timer, local images, automatic support reveal after answer selection, and unofficial support labeling.
- Architect inspected `src/search.ts`: `searchQuestions("")` currently returns `questions.slice(0, 25)`.
- Architect inspected `src/App.tsx`: `LearnView` initializes `query` to `""`, computes `results` from `searchQuestions(query)`, and uses `results.length` for bottom navigation.
- Architect inspected `src/domain.ts`: existing exam random selection is scoped to exam and slices to exam count; it is a useful pattern but should not be reused in a way that changes exam semantics.
- Architect inspected `tests/e2e/app.spec.ts`: existing learning tests assume the first canonical question is visible by default, so implementation must update those tests carefully for randomized default order.

### Dead Ends

- Architect planning: none.
- Implementation: initial `pnpm run test` failed because the assigned worktree had no installed `node_modules`; `tests/domain.test.mjs` could not import the declared `typescript` dev dependency. Ran `pnpm install --frozen-lockfile` to restore dependencies without changing the lockfile, then reran tests successfully.

### Known Issues

- The active feature folder is currently untracked in this Architect worktree, as expected for newly created feature memory.
- No product code or tests were changed by Architect.
- Implementation found no content/support readiness gaps for the requested 460-question Learn exposure.
- No durable `docs_project/` update was needed: existing durable docs already describe the 460 current fallback questions, 276 image-backed question references, Learn navigation inside the active collection, and truthful unofficial fallback labeling; implementation changed behavior to match those docs without changing visible copy, architecture, runtime workflow, or source/status semantics.

### Verification Evidence

- Architect artifact creation only: `spec.md`, `plan.md`, and `tasks.md` were created under `specs/023-learn-all-questions/`.
- Architect did not edit code, tests, durable docs, runtime files, content files, generated indexes, commits, PRs, or files outside `specs/023-learn-all-questions/`.

### Implementation Evidence

- Startup status before editing: `git status --short --branch` reported `## codex/023-learn-all-questions...origin/main` with untracked `specs/023-learn-all-questions/`; no sibling worktree, sibling branch, reset, rebase, or unrelated file mutation was performed.
- Implemented `shuffleQuestions(questions, random = Math.random)` in `src/domain.ts` as a pure Fisher-Yates helper that copies input before shuffling and accepts injectable randomness.
- Reused the shuffle helper for exam random selection without changing exam count/support semantics.
- Changed `searchQuestions("")` from `questions.slice(0, 25)` to `questions.slice()` so the empty-query search helper no longer carries the 25-question cap.
- Changed `LearnView` to initialize a shuffled `sessionQuestions` array once with lazy `useState`; empty-query Learn uses that stable session order, while non-empty search uses `searchQuestions(normalizedQuery)`.
- Added unit tests proving Learn shuffle keeps every input exactly once, does not mutate input, supports deterministic random streams, and handles empty input.
- Added Playwright coverage proving default Learn displays `1 / 460`, controlled orders differ across new page sessions, the order stays stable after difficult marking, answer selection, search, and clearing search, and existing first-ticket image/timer/support tests run under controlled randomness.
- Existing Playwright regressions continue to cover search narrowing and no-match behavior, timer pause/resume/expiry/answered-after-expiry behavior, answer/progress restoration by question ID, local image rendering, image explanation overlays, mistake-review empty state, active exam support hiding, and fallback labeling.
- Content count evidence: `node -e "const q=require('./content/questions/caba-b.unofficial-fallback.questions.json'); console.log(q.length, q.filter(x=>x.image).length)"` printed `460 276`.
- Content validation evidence: `pnpm run validate:content` passed with `Difficulty labels validated: 460 questions, 38 topics.` and `Content validation passed: 460 category B fallback questions, 276 local image references.`
- Unit evidence: after restoring dependencies, `pnpm run test` passed `213` tests.
- Build evidence: `pnpm run build` passed; build also validated content and generated a service worker with `280` cached assets. Vite retained the pre-existing large chunk warning.
- E2E evidence: `pnpm run test:e2e` passed `38` Playwright tests across chromium and mobile projects.
- Whitespace evidence: `git diff --check` passed with no output.
- Feature-memory evidence: `node scripts/check-feature-memory.mjs --worktree` passed with `Feature-memory gate passed via specs/023-learn-all-questions/{spec,plan,tasks}.md`.
- Preflight evidence: `pnpm run preflight` passed; it ran feature-memory gate, repository baseline check, content validation, `213` unit tests, production build, and `38` Playwright tests.
- Scope evidence: `git diff --name-only` reported `src/App.tsx`, `src/domain.ts`, `src/search.ts`, `tests/domain.test.mjs`, and `tests/e2e/app.spec.ts`; untracked scoped feature-memory files are under `specs/023-learn-all-questions/`.
- Conflict evidence: no unresolved merge conflict markers or unmerged paths were reported by git status/diff checks.

### Implementation Agent Feedback

- None. No Architect disposition is required from this implementation slice.

### Architect Dispositions

- No Implementation Agent feedback was raised; no Architect disposition is required before review.
