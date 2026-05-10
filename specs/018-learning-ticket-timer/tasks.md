# Tasks: Learning Ticket Timer

## Architect Planning Setup

- [x] T001 Confirm assigned worktree is `/Users/chap/devel/cabadrive-018-learning-ticket-timer-intake`.
- [x] T002 Confirm active branch is `codex/018-learning-ticket-timer-intake`.
- [x] T003 Read `AGENTS.md` and confirm Architect-only boundary.
- [x] T004 Read `.specify/memory/constitution.md`.
- [x] T005 Read `docs_project/README.md`.
- [x] T006 Read `docs_project/project-idea.md`.
- [x] T007 Read `docs_project/project/frontend/frontend-docs.md`.
- [x] T008 Read `docs_project/project/backend/backend-docs.md`.
- [x] T009 Read `docs_project/project/feature-inventory.md`.
- [x] T010 Read `docs_project/screens/learning-and-exam-flows.md`.
- [x] T011 Read `docs/specify/README.md`.
- [x] T012 Read active `specs/018-learning-ticket-timer/feature-request.md`.
- [x] T013 Read feature `010` feature memory read-only from `/Users/chap/devel/cabadrive-010-ui-ux-learning-intake/specs/010-ui-ux-learning-source-of-truth/`.
- [x] T014 Read feature `010` durable source-of-truth docs read-only where available.
- [x] T015 Inspect current `content/config/caba-exam-format.json`.
- [x] T016 Inspect current `LearnView`, `QuestionCard`, `ExamView`, storage, and e2e test context read-only.
- [x] T016A Record read-only explorer findings for likely implementation surfaces and 010 conflict guidance.

## Architect Artifacts

- [x] T017 Create `spec.md` with formal goal, scope, out of scope, dependencies, user stories, requirements, acceptance criteria, negative scenarios, verification requirements, and review requirements.
- [x] T018 Create `plan.md` with formula decision, timer state model, timeout behavior, pause/resume behavior, persistence decision, navigation rules, 010 coordination, implementation slices, tests, risks, and rollback.
- [x] T019 Create this `tasks.md` with implementation tasks, evidence hooks, review requirements, and process-memory sections.

## Required Slice A: Timer Target Helper

- [x] T020 Confirm implementation starts from complete feature memory: `feature-request.md`, `spec.md`, `plan.md`, and `tasks.md`.
- [x] T021 Confirm Implementation Agent uses only the Orchestrator-assigned isolated worktree and branch.
- [x] T022 Sync/rebase implementation worktree with current `origin/main` before editing.
- [x] T023 Check whether feature `010` has landed and record the integration baseline in Process Memory.
- [x] T023A Inspect likely implementation surfaces before editing: `src/App.tsx` (`QuestionCard`, `LearnView`, `ExamView`), `src/domain.ts` (`mistakesFromHistory`), `src/data/content.ts` (`ProgressAnswer`), `src/styles.css`, and `tests/e2e/app.spec.ts`.
- [x] T024 Add a pure helper that derives learning target seconds from `examFormat.timeLimitMinutes` and `examFormat.questionCount`.
- [x] T025 Implement formula `ceil(((timeLimitMinutes * 60) / questionCount) / 15) * 15`.
- [x] T026 Ensure invalid exam format metadata fails closed by returning no timer target or equivalent non-misleading state.
- [x] T027 Reuse or expose duration formatting so `75` seconds displays as `1:15`.
- [x] T028 Add tests for current official format: `45` minutes / `40` questions -> `75` seconds.
- [x] T029 Add tests for at least one alternate valid format to prove derivation is not hard-coded.
- [x] T030 Add tests for invalid config behavior.

## Required Slice B: Learning Timer State

- [x] T031 Inspect the current merged `LearnView` and `QuestionCard` state model before editing, especially if feature `010` has landed.
- [x] T032 Add per-ticket same-session timer state keyed by `question.id` or an equivalent scoped key.
- [x] T033 Start the timer when the learning ticket becomes the active rendered ticket.
- [x] T034 Ensure only the currently visible learning ticket counts down.
- [x] T035 Initialize newly activated tickets with the derived target when no same-session state exists.
- [x] T036 Preserve timer state when navigating away and back to the same ticket in the same learning session.
- [x] T037 Reset or initialize timer state coherently when search query changes the active collection; avoid hidden modulo jumps.
- [x] T038 Stop/freeze countdown when the learner selects an answer before expiry.
- [x] T039 Expire at zero before answer without calling `onAnswered`.
- [x] T040 Clean up intervals on question change, unmount, and status changes.
- [x] T041 Add deterministic tests for countdown start, cleanup, and no background countdown for invisible tickets.

## Required Slice C: Pause/Resume Control And Timer UI

- [x] T042 Add compact learning timer UI with `Темп билета` or equivalent calm label.
- [x] T043 Display remaining time using `m:ss`, including current expected `1:15`.
- [x] T044 Add explicit per-ticket pause/resume button.
- [x] T045 Use stable accessible names for pause/resume, including current state where useful.
- [x] T046 Ensure pause stops countdown and keeps remaining time visible.
- [x] T047 Ensure resume continues from the preserved remaining time.
- [x] T048 Ensure pausing one ticket does not globally disable timers for other tickets.
- [x] T049 Show expired state with calm copy such as `Время вышло - билет пока не решен`.
- [x] T050 Show answered-after-target state with calm copy such as `Ответ после лимита`.
- [x] T051 Ensure color is not the only status indicator.
- [x] T052 Avoid live-region updates every second; announce only meaningful state changes if a live region is used.
- [x] T053 Ensure timer, support controls, answer choices, feedback, and navigation do not overlap on mobile.
- [x] T054 Ensure keyboard focus reaches pause/resume predictably with visible focus.

## Required Slice D: Timeout And Progress Semantics

- [x] T055 Ensure timeout before answer records no `ProgressAnswer` and does not mutate `progress.answers`.
- [x] T055A Ensure timeout is not encoded as a fake incorrect answer such as empty `selectedAnswerId` with `isCorrect: false`.
- [x] T055B Ensure timeout by itself does not count as answer selection for feature `010` post-answer auto-reveal behavior.
- [x] T056 Ensure timeout before answer does not mark the ticket as a mistake in mistake review.
- [x] T057 Ensure timeout before answer does not auto-select, auto-submit, auto-reveal exam-only scaffolding, or auto-advance.
- [x] T058 Ensure answer before timeout records a normal learning answer and shows no unresolved state.
- [x] T059 Ensure answer after timeout remains possible.
- [x] T060 Ensure answer after timeout records exactly one normal learning answer using existing `ProgressAnswer` shape.
- [x] T061 Preserve visible current-card evidence that the answer happened after the target.
- [x] T062 Ensure manual pre-answer translation/explanation reveal does not affect timer state unless the learner explicitly pauses.
- [x] T063 Add tests for timeout-only no-progress mutation.
- [x] T064 Add tests for answer before timeout.
- [x] T065 Add tests for answer after timeout.
- [x] T066 Add tests that mistake review is not polluted by timeout-only state.

## Required Slice E: Active Exam Non-Regression

- [x] T067 Ensure per-ticket learning timer renders only for learning mode.
- [x] T068 Ensure active exam attempts continue using the existing exam-wide countdown.
- [x] T069 Ensure active exam attempts do not show `Темп билета`, pause/resume learning timer controls, unresolved learning timeout, or answered-after-limit status.
- [x] T070 Ensure active exam support remains hidden according to existing exam rules.
- [x] T071 Add or update e2e tests for active exam non-regression.

## Required Slice F: Navigation And Feature 010 Coordination

- [x] T072 If feature `010` bottom previous/next navigation has landed, integrate timer state with the merged bottom navigation path.
- [x] T072A If feature `010` parent-owned attempt state/footer navigation has landed, prefer integrating timer state with that merged parent-owned model instead of adding competing child-only state.
- [x] T073 If feature `010` has not landed, record expected rebase/conflict zones in Process Memory.
- [x] T074 Ensure previous/next navigation restores same-session timer state for revisited tickets.
- [x] T075 Ensure first/last boundary behavior does not accidentally keep timing an invisible ticket.
- [x] T076 Ensure learning search result changes do not continue timing a question no longer in the visible collection.
- [x] T077 Add navigation tests for timer reset/preserve behavior.
- [x] T078 Add mobile e2e or screenshot evidence including timer plus bottom navigation when 010 is present.

## Required Slice G: Durable Docs And Process Memory

- [x] T079 Decide whether durable docs need updates after implementation; update only if behavior, architecture, workflow, or documented learning flow changed.
- [x] T080 If docs are updated, keep them scoped to learning timer behavior and cite this feature memory.
- [x] T081 Record implementation decisions in Process Memory.
- [x] T082 Record dead ends and known issues in Process Memory.
- [x] T083 Record 010 coordination/rebase evidence in Process Memory.
- [x] T084 Record verification evidence for every acceptance criterion or exact unrelated blocker.
- [x] T085 Keep this task list current in the same PR as implementation work.

## Required Slice H: Verification And PR Readiness

- [x] T086 Run `pnpm run validate:content`.
- [x] T087 Run `pnpm run test`.
- [x] T088 Run `pnpm run build`.
- [x] T089 Run `pnpm run test:e2e`.
- [x] T090 Run `pnpm run preflight`.
- [x] T091 Run `git diff --check`.
- [ ] T092 For runtime-affecting changes, run `make down`, `make build`, `make up`, smoke check `http://localhost:5173`, and `make down`.
- [x] T093 If Docker smoke is blocked by unrelated environment state, record the exact blocker and fallback runtime evidence.
- [x] T094 Confirm required checks are green after PR push.
- [x] T095 Confirm no unresolved merge conflicts.
- [x] T096 Confirm no blocking review findings remain.
- [x] T097 Confirm acceptance evidence, process memory, docs decisions, and known issues are current before merge readiness.

## Review Requirements

- [x] T098 Review Agent verifies implementation stayed within the Orchestrator-assigned slice and worktree.
- [x] T099 Review Agent verifies feature memory is complete and current.
- [x] T100 Review Agent verifies target formula is derived from exam format metadata and tests cover `45 / 40 -> 75s`.
- [x] T101 Review Agent verifies no unmerged feature `010` files were copied or consumed.
- [x] T102 Review Agent verifies timer scope is learning mode only.
- [x] T103 Review Agent verifies active exam non-regression.
- [x] T104 Review Agent verifies timeout before answer is session-only and does not append progress answers.
- [x] T104A Review Agent verifies timeout is not represented as a fake incorrect `ProgressAnswer`, does not pollute `mistakesFromHistory`, and does not trigger 010 post-answer auto-reveal by itself.
- [x] T105 Review Agent verifies answer after timeout remains possible and records a normal learning answer.
- [x] T106 Review Agent verifies pause/resume is per-ticket, accessible, keyboard reachable, and not global.
- [x] T107 Review Agent verifies mobile layout evidence and no text/control overlap.
- [x] T108 Review Agent verifies `tasks.md` process memory and verification evidence are current before merge readiness.

## Process Memory

### Architect Decisions

- Training target formula is official average seconds per question rounded up to the nearest 15 seconds: `ceil(((timeLimitMinutes * 60) / questionCount) / 15) * 15`.
- Current metadata `45` minutes / `40` questions yields `75` seconds (`1:15`).
- Scope is learning mode (`Учить`) only for this slice. Mistake review/support-mode timer extension is deferred.
- Timer starts when the learning ticket becomes active/rendered.
- Timer state is same-session, per-ticket, and not persisted to localStorage in this slice.
- Timeout before answer marks the visible current ticket as unresolved/not solved, but does not select an answer, record progress, advance navigation, or affect exam mode.
- Answer after timeout is allowed and records a normal learning answer while preserving visible evidence that it happened after the target.
- Pause/resume is an explicit per-ticket control. It does not globally disable timers.
- Manual support reveal does not affect the timer; only explicit pause/resume controls timing.
- Navigation preserves same-session timer state for revisited tickets and does not count down invisible tickets in the background.
- Architect used feature `010` only as read-only planning context and did not consume unmerged implementation files.
- Read-only explorer findings added implementation guidance: main likely surfaces are `src/App.tsx` (`QuestionCard`, `LearnView`, `ExamView`), `src/domain.ts` (`mistakesFromHistory`), `src/data/content.ts` (`ProgressAnswer`), `src/styles.css`, and `tests/e2e/app.spec.ts`.
- Read-only explorer guidance accepted: avoid encoding timeout as a fake incorrect answer because it pollutes mistakes; timeout must not count as answer selection for 010 auto-reveal unless explicitly required; parent-owned attempt state/footer navigation is likely the cleanest merged 010 direction.
- Architect did not edit product code, tests, durable docs, scripts, runtime files, `feature-request.md`, commits, pushes, or PR state.

### Context Evidence

- Active worktree check showed `/Users/chap/devel/cabadrive-018-learning-ticket-timer-intake`.
- Active branch check showed `codex/018-learning-ticket-timer-intake...origin/main`.
- Baseline feature folder contained only `feature-request.md` before this Architect pass.
- `content/config/caba-exam-format.json` contains `questionCount: 40`, `timeLimitMinutes: 45`, `passingScore: 85`, and `status: defined`.
- Current `origin/main` code has an exam-wide timer in `ExamView` and no learning per-ticket timer.
- Current `origin/main` `QuestionCard` owns local answer/support state and resets on question change; feature `010` may have changed that by implementation time.
- Feature `010` source-of-truth context says active recall comes first, support can reveal after attempt in learning/support modes, active exam attempts hide scaffolding, bottom navigation follows the reading path, context preservation matters, and keyboard/focus/accessibility are required.
- Explorer guidance says feature `010` may directly conflict around parent-owned attempt state and footer navigation; implementation must coordinate with actual merged `main` and must not copy unmerged 010 files.

### Dead Ends

- Architect pass: none.
- Initial `pnpm run build` failed because the assigned worktree had no `node_modules` and Vite was not installed locally (`sh: vite: command not found`). Resolved by running `pnpm install`; lockfile remained unchanged.
- Initial `pnpm run test:e2e` failed globally because `QuestionCard` referenced `learningTimer` without destructuring it from props, causing a browser runtime `ReferenceError`. Fixed by adding the prop to the destructured parameter list.
- Review fix pass confirmed Playwright `page.clock.fastForward(76_000)` was the wrong timer primitive for expiry coverage because it only fires due timers at most once. The e2e timer tests now install the fake clock before `page.goto("/")` and use `page.clock.runFor(...)`, preserving the production-derived `1:15` target without a production-visible override.

### Known Issues

- Feature `010` may merge before implementation and change `QuestionCard`, `LearnView`, bottom navigation, support reveal, CSS, and e2e tests. Implementation must sync with merged `main` and adapt rather than copying unmerged 010 files.
- Current `origin/main` and this branch do not include feature `010`; no 010 merge commits were found after `git fetch origin`, and HEAD/origin main were both `f697b53` at implementation start. Current learning navigation still uses the top `Следующий` path, so timer restoration/no-background-countdown was verified through wraparound navigation over the current 25-item learning collection.
- Rebase pass on 2026-05-10 confirmed `origin/main` advanced to `a26a124` with difficulty labels from PR #71. Local branch is intentionally not pushed after rebase, so it diverges from `origin/codex/018-learning-ticket-timer` until an explicit push.
- Persisted unresolved timing data is intentionally deferred. If future product work wants timing analytics, it needs a new progress shape and separate mistake-review semantics.
- Docker smoke is blocked in this local environment because Docker daemon is not reachable at `unix:///Users/chap/.docker/run/docker.sock`.

### Implementation Decisions

- Created implementation branch `codex/018-learning-ticket-timer` from main-based HEAD `f697b53` after `git fetch origin`, preserving untracked `specs/018-learning-ticket-timer/*` feature memory.
- Implemented `learningTicketTargetSeconds` and shared `formatDuration` in `src/domain.ts`. Invalid or absent `questionCount`, `timeLimitMinutes`, or rounding step returns `undefined`, which hides the learning timer rather than showing misleading pacing.
- Kept timer state in `LearnView` session state keyed by `question.id`; nothing is written to `StoredProgress` or localStorage until the learner selects an answer.
- Search query changes reset the active index and timer state for the new learning collection to avoid hidden modulo jumps and invisible countdowns.
- Added `learningTimer` as an optional `QuestionCard` prop and render it only from `LearnView`; `ExamView` and `MistakesView` do not pass the prop.
- Timeout changes only the current timer state to `expired`; it does not call `onAnswered`, select an answer, reveal support, auto-advance, or create a fake incorrect `ProgressAnswer`.
- Answering after timeout records exactly one existing-shape learning answer and preserves visible `Ответ после лимита` evidence on the current card.
- Timer UI uses calm text labels, visible non-color state text, a native pause/resume button with stable accessible names, and no live region for per-second announcements.
- Updated `docs_project/screens/learning-and-exam-flows.md` because the documented learning and exam flows now need to mention the learning timer and active-exam non-scaffolding boundary.
- Review finding P2 resolved in `tests/domain.test.mjs`: removed duplicated local implementations of `scorePercent`, `formatDuration`, `learningTicketTargetSeconds`, `mistakesFromHistory`, and `selectExamSet`. The Node test now transpiles `src/domain.ts` with the existing `typescript` dev dependency and imports the production exports from a data URL.
- Review finding P2 resolved in `tests/e2e/app.spec.ts`: replaced the real 75-second timeout wait with deterministic Playwright clock control using `clock.install({ time })` before navigation and `clock.runFor(76_000)`.
- Second Review Agent result after the P2 fix pass found no blocking findings. The previously reported P2 findings remain resolved: domain tests import transpiled production `src/domain.ts`, and e2e timeout coverage uses deterministic Playwright fake clock `runFor(...)` instead of a real 75-second wait.
- Rebased `codex/018-learning-ticket-timer` onto `origin/main` `a26a124` on 2026-05-10. Strategy was rebase to preserve a linear feature commit over the merged difficulty-label work.
- Rebase conflicts were resolved in `src/App.tsx`, `src/styles.css`, and `docs_project/screens/learning-and-exam-flows.md`; `tests/e2e/app.spec.ts` auto-merged but was inspected because it covers both difficulty labels and timer behavior.
- Conflict resolution preserved both main's difficulty-label behavior and this feature's learning timer behavior: `DifficultyIndicator` remains imported/rendered in learning, mistakes, and materials; active exams still omit difficulty chips; timer helpers remain imported from `src/domain.ts`; learning timer UI/CSS remains adjacent to difficulty chip CSS; flow docs now mention both difficulty metadata and the learning timer.
- PR #73 is ready for review on head `b70e91c` and is mergeable after rebase over `origin/main` `a26a124`.
- Required PR #73 checks are green on head `b70e91c`: baseline-checks, docker-validation, guard, AI Review, and osv-scan.
- Remote AI Review completed successfully and posted `Codex Review: Didn't find any major issues.`
- Local/rebased Review Agent found no blocking or advisory findings. There are no unresolved merge conflicts and no blocking review findings.
- Final human approval and merge authority remain the only non-task gate before merge.

### Verification Evidence

- `pnpm install`: completed after initial missing `node_modules`; lockfile up to date and unchanged.
- `pnpm run validate:content`: passed; 460 category B fallback questions and 276 local image references.
- `pnpm run test`: passed; 75/75 node tests, including learning target current config `45 / 40 -> 75`, alternate valid formats, and invalid metadata fail-closed cases.
- Review fix focused `pnpm run test`: passed; 75/75 node tests now exercise transpiled production `src/domain.ts` exports instead of duplicated test helper implementations.
- Review fix focused `pnpm exec playwright test tests/e2e/app.spec.ts -g "learning timer|learning timeout"`: passed 4/4 on chromium and mobile using deterministic Playwright clock control.
- Review fix full `pnpm run build`: passed; build, asset sync, and service worker generation completed. Vite emitted the existing large chunk warning.
- Review fix full `pnpm run test:e2e`: passed 18/18 on chromium and mobile. Evidence covers timer visibility `1:15`, pause/resume keyboard focus, no background countdown for invisible tickets, deterministic timeout-only no progress mutation, answer after limit, active exam non-regression, mobile layout, and offline reload.
- Review fix full `pnpm run preflight`: passed feature-memory gate, repository baseline check, content validation, 75/75 node tests, build, and 18/18 e2e tests.
- Orchestrator reran/confirmed focused timer e2e and `git diff --check` after the P2 fix pass; full verification evidence from the fix pass remains recorded above.
- `git diff --check`: passed with no whitespace errors.
- Docker smoke attempted with `make down && make build && make up`; blocked before build because Docker daemon is not running/reachable: `Cannot connect to the Docker daemon at unix:///Users/chap/.docker/run/docker.sock`.
- Post-rebase `pnpm run validate:content`: passed on 2026-05-10; difficulty labels validated for 460 questions and 38 topics; content validation passed for 460 category B fallback questions and 276 local image references.
- Post-rebase `pnpm run test`: passed on 2026-05-10; 82/82 Node tests passed, including difficulty metadata tests and learning timer derivation tests for `45 / 40 -> 75s`.
- Post-rebase `pnpm run build`: passed on 2026-05-10; assets synced, Vite build completed, service worker generated with 280 cached assets. Vite emitted the existing large chunk warning.
- Post-rebase `pnpm run test:e2e`: passed on 2026-05-10; 18/18 Playwright tests passed on chromium and mobile. Coverage includes learning difficulty labels, mistake/material difficulty labels, active exam hiding difficulty chips and learning timer controls, learning timer `1:15`, deterministic fake-clock timeout, timeout-only no progress mutation, and answer-after-limit recording.
- Post-rebase `pnpm run preflight`: passed on 2026-05-10; feature-memory gate, repository baseline check, content validation, 82/82 Node tests, build, and 18/18 e2e tests all passed.
- Post-rebase `git diff --check`: passed on 2026-05-10 with no whitespace errors.
- Post-rebase Docker smoke attempted with `make down && make build && make up` on 2026-05-10; blocked before build because Docker daemon is not running/reachable at `unix:///Users/chap/.docker/run/docker.sock`.

### Implementation Agent Feedback

- No test-only timer injection seam was needed for this fix pass. Playwright fake clock with `runFor(...)` keeps timeout coverage deterministic while the production target remains derived from `data.examFormat`.
- If feature `010` later lands parent-owned answer/support state and bottom navigation, rebase conflict zones are expected in `src/App.tsx` around `QuestionCard`/`LearnView`, `src/styles.css` timer/card rows, and `tests/e2e/app.spec.ts` learning-flow assertions.
