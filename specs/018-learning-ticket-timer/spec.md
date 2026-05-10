# Spec: Learning Ticket Timer

## Analyst Intake

- Source request: `feature-request.md`.
- Active feature folder: `specs/018-learning-ticket-timer/`.
- Assigned Architect worktree: `/Users/chap/devel/cabadrive-018-learning-ticket-timer-intake`.
- Assigned branch: `codex/018-learning-ticket-timer-intake`.
- Architect scope: create and maintain only `spec.md`, `plan.md`, and `tasks.md`. Product code, tests, durable docs, scripts, runtime files, commits, pushes, PRs, and reviews are out of scope for this Architect pass.

## Goal

Add a soft per-ticket pacing timer to `Учить` so learners practice the official CABA exam rhythm without turning learning mode into a hard exam attempt. The timer must be derived from official exam-format metadata, remain calm and controllable, mark the current ticket as unresolved if the target expires before answer selection, and preserve active exam non-scaffolding boundaries.

## Scope

In scope for this feature:

- Learning mode (`Учить`) ticket attempts only.
- Per-ticket countdown shown on each current learning question card or immediately adjacent to it.
- Training target derived from `content/config/caba-exam-format.json`.
- Explicit per-ticket pause/resume control for the current learning ticket.
- Timeout state for the current ticket when the target expires before answer selection.
- Session-scoped timeout and pause state for the current learning collection/navigation session.
- Tests for target derivation, countdown, timeout, pause/resume, after-timeout answer behavior, navigation state, active exam non-regression, mobile layout, keyboard access, and preflight.
- Feature memory updates in `tasks.md` by the later Implementation Agent.

Out of scope:

- Active exam attempt timer changes.
- Mistake review timer, topic materials timer, vocabulary timer, or CABA/RF guide timer.
- User settings for globally enabling/disabling or configuring the timer.
- Backend, analytics, remote timing service, server sessions, or runtime network calls.
- Persisting timeout events to localStorage in this slice.
- Consuming unmerged feature `010` implementation files.
- Editing `feature-request.md` in this Architect pass.

Support-mode extension is explicitly deferred. Mistake review may later receive the same pacing aid only through a new feature or an Architect-approved follow-up, because this slice should first prove the learning timer without adding pressure to mistake remediation.

## Dependencies And Coordination

- Feature `010-ui-ux-learning-source-of-truth` is a read-only coordination contract for UI/learning rules. Its unmerged implementation files must not be copied or consumed.
- If feature `010` has landed before implementation, the Implementation Agent must rebase or sync onto current `main` and adapt to the merged `QuestionCard`, `LearnView`, bottom previous/next navigation, and support-state rules.
- If feature `010` has not landed, implementation must avoid making state/navigation choices that would block 010's documented direction: bottom navigation, active recall first, support after attempt, user control, accessible controls, and state preservation.
- The timer UI should be placed to survive either current top-next navigation or 010-style bottom previous/next navigation. It must not duplicate or compete with primary progression controls.
- Read-only explorer guidance identifies the likely main implementation surfaces as `src/App.tsx` (`QuestionCard`, `LearnView`, `ExamView`), `src/domain.ts` (`mistakesFromHistory`), `src/data/content.ts` (`ProgressAnswer`), `src/styles.css`, and `tests/e2e/app.spec.ts`.
- Feature `010` direct conflict guidance: parent-owned attempt state and footer navigation are likely the cleanest merged direction. Implementation must coordinate with actual merged `main` and must not copy unmerged 010 files.

## User Stories

### User Story 1

As a learner in `Учить`, I want a visible per-ticket timer based on the official exam pace, so I can feel whether I am spending exam-realistic time on the current question.

### User Story 2

As a learner using learning mode, I want to pause and resume the timer for the current ticket, so I can consciously switch from timed recall to slower study without disabling timers everywhere.

### User Story 3

As a learner who runs out of time before answering, I want the current ticket marked as unresolved without auto-answering or auto-advancing, so I can still study the question and then answer deliberately.

### User Story 4

As a reviewer, I want tests proving the learning timer is derived from official format metadata and does not change active exam behavior, so the training aid stays aligned with product and exam boundaries.

## Functional Requirements

- FR-001: Compute the learning ticket target from `data.examFormat` / `content/config/caba-exam-format.json`, not from an unrelated hard-coded duration.
- FR-002: The target formula is `ceil((timeLimitMinutes * 60 / questionCount) / 15) * 15` seconds. With 45 minutes and 40 questions, the target is `75` seconds (`1:15`).
- FR-003: If `questionCount` or `timeLimitMinutes` is invalid or absent, the timer must fail closed by hiding the learning timer and showing no misleading target; implementation should record the data issue in tests or process memory.
- FR-004: The timer appears only in `Учить` learning question attempts.
- FR-005: Active exam attempts continue to use only the exam-wide timer and must not show the learning per-ticket timer, pause/resume control, or timeout-unresolved state.
- FR-006: The timer starts when the current learning ticket becomes active/rendered for the learner.
- FR-007: Changing the active learning ticket initializes that ticket's timer state if no same-session state exists for that ticket.
- FR-008: In the same learning session, revisiting a ticket preserves that ticket's timer state, including remaining time, paused/running/expired status, and whether the timeout already occurred.
- FR-009: Changing the search query creates a new active collection context and may initialize timer state for newly activated tickets; it must not create hidden modulo jumps or continue timing an invisible ticket.
- FR-010: The timer counts down only while the current ticket's timer state is running and the document/component is active enough for React interval cleanup to operate correctly.
- FR-011: The timer stops automatically when the learner selects an answer before expiry.
- FR-012: The learner can pause and resume the timer for the current ticket before selecting an answer or before expiry.
- FR-013: Pause/resume is explicitly scoped to the current ticket and does not globally disable learning timers.
- FR-014: Paused state keeps the current remaining time visible and uses calm copy such as `Пауза`.
- FR-015: When the timer reaches zero before an answer is selected, the current ticket enters a visible unresolved/not-solved state.
- FR-016: Timeout must not select an answer, submit an answer, reveal exam-only support, auto-advance, skip, finish an exam, or mutate active exam state.
- FR-017: Timeout in this slice is session-only. It is not appended to `progress.answers` and does not appear in mistake review as an incorrect answer.
- FR-017A: Timeout must not be encoded as a fake incorrect `ProgressAnswer` unless a later Architect decision explicitly changes the progress model, because that would pollute `mistakesFromHistory` and mistake review.
- FR-017B: Timer timeout must not count as answer selection for feature `010` post-answer auto-reveal semantics unless a later requirement explicitly asks for support reveal on timeout.
- FR-018: After timeout, the learner may still select an answer. That answer is recorded normally in existing learning progress, with UI evidence that it was answered after the target.
- FR-019: Answering after timeout clears no timeout history for the visible current card; the card should communicate both facts: target expired, then answer selected.
- FR-020: Answering before timeout records a normal learning answer and freezes or completes the timer display without unresolved status.
- FR-021: Manual pre-answer support reveal in learning mode does not pause or stop the timer; the learner controls timing through the explicit pause/resume button.
- FR-022: The timer UI must be compact, calm, mobile-friendly, and visually integrated with the question-card status/meta area or an adjacent timing row.
- FR-023: UI text must communicate soft pacing rather than punishment. Preferred Russian labels: `Темп билета`, `1:15`, `Пауза`, `Продолжить`, `Время вышло - билет пока не решен`, `Ответ после лимита`.
- FR-024: Dynamic second-by-second updates must not be announced to screen readers every second. Use accessible labels for the current state and announce only meaningful transitions such as paused/resumed/expired when practical.
- FR-025: Pause/resume controls must be keyboard reachable, have stable accessible names, visible focus, and not rely on color alone.
- FR-026: Mobile layout must avoid overlap among timer, pause/resume, answer choices, feedback, support controls, and 010 bottom navigation if present.
- FR-027: The feature must preserve local-first/offline behavior and introduce no backend, network call, analytics, or remote time dependency.
- FR-028: Durable docs are updated by the later Implementation Agent only if implementation changes documented behavior beyond what current docs already cover.
- FR-029: `tasks.md` must remain current with decisions, dead ends, known issues, Implementation Agent feedback, and verification evidence.

## Acceptance Criteria

1. Given feature implementation starts, `feature-request.md`, `spec.md`, `plan.md`, and `tasks.md` exist in `specs/018-learning-ticket-timer/`.
2. Given exam format config contains `timeLimitMinutes: 45` and `questionCount: 40`, the learning timer target is displayed/calculated as `75` seconds / `1:15`.
3. Given the exam format metadata changes to another valid question count or duration in a test fixture, the target changes according to the documented 15-second ceiling formula.
4. Given the learner opens `Учить`, the active ticket shows the soft timer and current remaining time.
5. Given the learner opens `Экзамен`, no per-ticket learning timer or pause/resume learning control is visible during the active exam attempt.
6. Given a learning ticket becomes active, timing starts on render/current ticket activation.
7. Given the learner pauses the current ticket timer, countdown stops, remaining time stays visible, and the control changes to resume.
8. Given the learner resumes the paused current ticket timer, countdown continues from the preserved remaining time.
9. Given the learner pauses one ticket and navigates to another ticket, the next ticket has its own timer state and the pause does not globally disable timers.
10. Given the learner navigates back to a ticket in the same session, its timer state is restored according to the same-session preservation rule.
11. Given the learner selects an answer before expiry, the timer no longer counts down for that ticket and no unresolved state is shown.
12. Given the timer expires before answer selection, the current ticket shows unresolved/not-solved state and remains on the same ticket.
13. Given timeout occurs before answer selection, no answer is selected, no learning progress answer is appended, and mistake review is not polluted by a timeout-only event.
14. Given timeout has occurred, the learner can still answer; the selected answer is recorded through existing learning progress and the UI shows it was answered after the target.
15. Given manual support reveal occurs before answer in learning mode, the timer continues unless the learner explicitly pauses it.
16. Given dynamic timer updates occur, screen-reader-visible live updates do not fire every second; meaningful state changes have accessible names/status.
17. Given desktop and mobile viewports, timer UI, answer choices, feedback, support controls, and navigation do not overlap or overflow.
18. Given keyboard-only use, the learner can reach the timer control, pause/resume it, answer, and navigate without losing visible focus.
19. Given local build/runtime, the feature works without network, backend, analytics, or remote time service.
20. Given verification completes, `pnpm run validate:content`, `pnpm run test`, `pnpm run build`, `pnpm run test:e2e`, `pnpm run preflight`, and `git diff --check` pass or exact unrelated blockers are recorded.

## Negative Scenarios

- A fixed `75` second literal with no derivation from exam config is not acceptable.
- A timer in active exam mode is not acceptable.
- A hard learning lock that blocks answering after timeout is not acceptable.
- Timeout that auto-selects an answer, auto-advances, or records an incorrect answer in `progress.answers` is not acceptable for this slice.
- A global stop setting that disables timers for all tickets is not acceptable for the requested per-ticket control.
- A timer that announces every second through a live region is not acceptable.
- Timer controls that require pointer-only interaction or lack accessible names are not acceptable.
- Implementation that consumes unmerged feature `010` product files is not acceptable.

## Verification Requirements

- Unit/domain tests for the target formula, including current `45 / 40 => 75s` and at least one non-current valid fixture.
- Component or DOM tests for learning countdown, expiry, pause/resume, answer before expiry, and answer after expiry.
- Storage/progress tests or e2e assertions proving timeout-only state is not appended to `progress.answers`.
- E2E tests proving active exam attempts still show only the exam-wide timer and no learning timer controls.
- E2E or visual/layout evidence for mobile timer placement with answer choices and bottom navigation if feature `010` has landed.
- Keyboard/a11y evidence for pause/resume focus and accessible names/states.
- Full local verification commands named in acceptance criterion 20.

## Review Requirements

- Review Agent must verify this feature memory is complete before product-code changes.
- Review Agent must inspect the formula and ensure it is derived from `data.examFormat`.
- Review Agent must check that timeout remains session-only and does not pollute mistake review.
- Review Agent must check that timeout is not represented as a fake incorrect `ProgressAnswer` and does not trigger 010-style post-answer auto-reveal by itself.
- Review Agent must check that answering after timeout remains possible and records a normal learning answer.
- Review Agent must check active exam non-regression.
- Review Agent must check coordination with merged feature `010` behavior and that no unmerged `010` files were copied.
- Review Agent must check mobile and accessibility evidence for the timer UI.
