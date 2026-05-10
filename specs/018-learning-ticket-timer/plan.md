# Plan: Learning Ticket Timer

## Summary

Implement the feature as a narrow learning-mode pacing aid. Add a derived target helper, per-ticket timer state for `Учить`, a compact accessible timer UI, and focused tests. Keep timeout session-only and non-punitive: it marks the visible current ticket as unresolved, but it does not write an incorrect answer, advance the learner, or affect active exam mode.

This Architect pass creates only `spec.md`, `plan.md`, and `tasks.md`.

## Technical And Product Context

- Frontend: React + TypeScript + Vite static SPA.
- Runtime: local-first/offline-capable static build; no backend.
- Current progress: localStorage-backed `StoredProgress` with `answers`, `difficultQuestionIds`, and `examAttempts`.
- Current exam timer: exam-wide countdown from `data.examFormat.timeLimitMinutes * 60`.
- Current learning mode: `LearnView` renders `QuestionCard`, records selected answers in `progress.answers`, and currently has no per-ticket timer.
- Current `QuestionCard`: local selected-answer and support-visibility state resets on question change in `origin/main`; feature `010` may change this by adding bottom navigation and same-session state preservation.
- Official exam format source: `content/config/caba-exam-format.json`.
- Read-only explorer findings name the likely main implementation surfaces: `src/App.tsx` (`QuestionCard`, `LearnView`, `ExamView`), `src/domain.ts` (`mistakesFromHistory`), `src/data/content.ts` (`ProgressAnswer`), `src/styles.css`, and `tests/e2e/app.spec.ts`.

## Constitution Check

- Spec-first: yes; Analyst intake exists and this plan creates Architect-owned artifacts before implementation.
- Testable boundaries: yes; target formula and timer state can be tested without external services.
- Test-first bias: yes; implementation tasks require focused tests before merge readiness.
- Supervised verification: yes; acceptance criteria require evidence, not only summary.
- PR-only workflow: yes; implementation lands through an isolated branch and PR.
- One worktree per task: yes; implementation must use an Orchestrator-assigned worktree.
- Deployability: yes; no backend or runtime network dependency is introduced.
- Simplicity: yes; prefer local React state and small pure helpers over new storage or timing subsystems.
- Process memory: yes; `tasks.md` must be updated with decisions, evidence, dead ends, and feedback.

## Architecture Decisions

### Training Target Formula

Use:

```text
averageSeconds = (timeLimitMinutes * 60) / questionCount
targetSeconds = ceil(averageSeconds / 15) * 15
```

For current official metadata:

```text
45 * 60 / 40 = 67.5
ceil(67.5 / 15) * 15 = 75 seconds
```

Rationale:

- The official average is the only durable source for pacing.
- Rounding up to the nearest 15 seconds gives a readable learning target (`1:15`) while staying close to exam pace.
- The rounded value is a training target, not a separate official exam rule.

Implementation should place this in a small pure helper near existing domain/app helpers, for example `src/domain.ts` or a timer helper module if local structure makes that cleaner. Do not duplicate the formula in tests and UI independently.

### Scope

Implement only in `Учить` for this slice. Defer mistake review/support-mode timer extension because mistake review has a different emotional purpose and may need separate product tuning.

### Timer Start

Start timing when the learning question becomes the active rendered ticket. This is the clearest rule for users and tests: if the ticket is visible as the current card, the pacing target is running unless paused, expired, or answered.

### Timer State

Use same-session client state keyed by `question.id` and active learning collection context. Preferred shape:

```ts
type LearningTicketTimerState = {
  remainingSeconds: number;
  status: "running" | "paused" | "expired" | "answered";
  expiredAt?: string;
  answeredAfterExpiry?: boolean;
};
```

Implementation may adjust names, but must preserve these semantics.

Do not add this to `StoredProgress` in this slice. Keeping timeout session-only avoids polluting mistake review and preserves the existing progress model. If future analytics or weak-topic scheduling needs unresolved timing data, introduce a separate persisted shape in a new feature.

Do not encode timeout as `selectedAnswerId: ""`, `isCorrect: false`, or any other fake incorrect answer unless Architect explicitly reopens this decision. The current `mistakesFromHistory` pipeline reads `progress.answers`; fake timeout answers would make timeout-only tickets appear as mistakes and would blur answer attempts with pacing events.

### Timeout

When `remainingSeconds` reaches zero before answer selection:

- set status to `expired`;
- show calm unresolved copy;
- keep the learner on the same ticket;
- do not select an answer;
- do not call `onAnswered`;
- do not create a fake incorrect `ProgressAnswer`;
- do not count timeout as answer selection for 010 post-answer auto-reveal;
- do not reveal exam-only scaffolding;
- do not auto-advance.

Suggested visible copy:

```text
Время вышло - билет пока не решен
```

### Pause And Resume

Provide one explicit per-ticket toggle:

- running -> `Пауза`;
- paused -> `Продолжить`;
- expired/answered -> disabled or hidden according to the cleanest UI, but it must not imply it can undo timeout or answer state.

Paused state shows remaining time and does not count down. Pause is not persisted and does not apply globally.

### Answer Before Timeout

Selecting an answer while running or paused:

- records the existing normal learning answer;
- sets timer status to `answered`;
- freezes the timer display or changes it to a completed pacing state;
- does not show unresolved state.

Suggested copy:

```text
В темпе
```

Use this only if it fits the final UI without adding noise.

### Answer After Timeout

Selecting an answer after timeout:

- records the existing normal learning answer with current `ProgressAnswer` shape;
- preserves visible evidence that the target expired first;
- may show a small `Ответ после лимита` status;
- does not retroactively erase the timeout state for the current card;
- does not add a separate persisted unresolved event.

This keeps progress compatible while letting the user learn from the answer.

### Navigation And State

Preferred rule:

- The active ticket has one timer state per `question.id` within the current mounted learning session.
- Previous/next navigation, including feature `010` bottom navigation if merged, restores that ticket's state.
- Search query changes reset the active index to the first result if feature `010` has not already implemented that rule.
- A ticket not currently visible should not continue decrementing in the background.
- Returning to a running ticket resumes countdown from the last preserved remaining time, not from wall-clock elapsed time.

This conservative rule avoids invisible background timers and matches learning-mode user control. If Implementation finds 010 has a stronger merged state model, adapt to it while preserving no-background-countdown and same-session restoration.

### UI Placement

Preferred placement is inside the question card near metadata/status, before the Spanish prompt, or in an adjacent timing row immediately above the card. The timer should be visible without dominating the answer flow.

UI requirements:

- use the existing `Timer` icon if lucide icons are already in use;
- no alarming animation, sound, or punitive language;
- compact chip/row with remaining time and pause/resume button;
- use text plus icon where needed for clarity;
- accessible names expose state, for example `Темп билета: осталось 1:15` and `Поставить таймер билета на паузу`;
- no live region that announces every second;
- optional polite status only for `paused`, `resumed`, and `expired`.

### Accessibility

- Pause/resume is a native button.
- Disabled/inactive states have clear accessible state.
- Focus order follows: question/status, timer control, support controls if present, answers, feedback, bottom navigation.
- Color cannot be the only indicator for running/paused/expired/answered.
- Respect WCAG timing-adjustable spirit: because this is a non-essential learning timer, the learner can pause it.

### Persistence

No `StoredProgress` schema change in this slice. No localStorage migration required.

Reason:

- Current `answers` history represents actual answer attempts.
- Persisting timeout as a wrong answer would pollute mistake review.
- A separate persisted timing-event model is premature without a product surface that uses it.

### Durable Docs

Later implementation should update durable docs only if the merged behavior changes existing documented flows. Likely candidates if needed:

- `docs_project/screens/learning-and-exam-flows.md` to mention soft timer in learning;
- `docs_project/project/frontend/frontend-docs.md` if UI rules need a brief timer note.

Do not update durable docs in this Architect pass.

## Coordination With Feature 010

Before implementation:

1. Fetch/sync the implementation worktree with current `origin/main`.
2. Check whether feature `010` has merged.
3. If merged, use its current `QuestionCard` / `LearnView` state model and bottom navigation as the integration point.
4. If not merged, keep timer changes narrow and document expected rebase touchpoints for `QuestionCard`, `LearnView`, CSS, and e2e tests.

Expected conflict zones:

- `src/App.tsx` around `QuestionCard` props/state.
- `LearnView` collection/index/navigation state.
- CSS classes for question-card meta/action rows.
- `tests/e2e/app.spec.ts` around learning-flow expectations.

Do not consume files from `/Users/chap/devel/cabadrive-010-ui-ux-learning-intake` except as read-only planning context.

Explorer guidance: if 010 has merged parent-owned attempt state and footer navigation, prefer integrating the timer into that parent-owned state model rather than adding competing child-only state inside `QuestionCard`. Coordinate with the actual merged `main`; do not copy 010 unmerged files.

## Implementation Slices

### Slice A: Timer Target Helper

Goal: derive and format the learning target from exam format metadata.

Tasks:

- Add a pure helper for target seconds with validation.
- Reuse existing `formatDuration` or move formatting into a shared helper if needed.
- Unit test current 45/40 config and another fixture.

Exit criteria:

- No UI can drift from official metadata.
- Invalid config does not produce misleading UI.

### Slice B: Learning Timer State

Goal: manage per-ticket session state in learning mode.

Tasks:

- Add timer state keyed by question ID or by a small state object owned by `LearnView`/card integration.
- Start on active ticket render.
- Pause/resume current ticket.
- Stop/freeze on answer.
- Expire at zero without calling answer handlers.
- Preserve state when navigating away/back in the same session.
- Avoid background countdown for invisible tickets.

Exit criteria:

- Countdown behavior is deterministic under fake timers or equivalent test control.
- No localStorage progress mutation occurs on timeout alone.

### Slice C: Timer UI

Goal: present the timer calmly and accessibly.

Tasks:

- Add compact timer row/chip with remaining time.
- Add pause/resume button with stable accessible names.
- Add expired and answered-after-limit states.
- Ensure mobile layout remains stable with answer buttons and bottom nav.
- Avoid screen-reader spam from second-by-second updates.

Exit criteria:

- Keyboard and mobile evidence is recorded.
- Text does not overflow in supported viewport tests.

### Slice D: Progress And Answer Semantics

Goal: integrate timeout with current answer flow without changing persisted progress schema.

Tasks:

- Ensure answer before timeout records as today.
- Ensure timeout before answer records no answer.
- Ensure answer after timeout records a normal learning answer.
- Keep visible after-timeout status on the current card.
- Verify mistake review is not affected by timeout-only tickets.

Exit criteria:

- Tests prove timeout-only state is session/UI-only.
- Answer-after-timeout still increments stored answer count once.

### Slice E: Exam Non-Regression

Goal: prove active exam behavior stays separate.

Tasks:

- Ensure learning timer component/control is not rendered for `mode="exam"`.
- Existing exam-wide timer remains unchanged.
- Active exam support remains hidden.
- Add/adjust e2e assertions.

Exit criteria:

- Exam test proves no learning timer labels/controls in active attempt.

### Slice F: Documentation And Verification

Goal: finish process memory and verification.

Tasks:

- Update durable docs if implementation changes documented flows.
- Update `tasks.md` with decisions and evidence.
- Run required commands and record results.
- Record any 010 rebase/coordination notes.

Exit criteria:

- Feature memory has evidence for each acceptance criterion or an explicit unrelated blocker.

## Testing Strategy

Preferred test layers:

- Unit tests for target formula and formatting.
- Component/unit tests with fake timers if the existing test setup supports them.
- Playwright e2e for user-visible learning timer, pause/resume, timeout, answer after timeout, exam non-regression, mobile layout, and keyboard focus.

If fake timers are awkward in Playwright, implementation may expose the helper and use a test fixture or dependency injection for a shorter timer target in tests, as long as production still derives from exam format metadata.

Required command evidence:

```bash
pnpm run validate:content
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run preflight
git diff --check
```

For runtime-affecting work, run Docker smoke where possible:

```bash
make down
make build
make up
curl -fsS http://localhost:5173
make down
```

If Docker is blocked by an unrelated shared container conflict, record the exact blocker and provide fallback local preview evidence.

## Risks And Mitigations

- Risk: hard-feeling timer increases anxiety. Mitigation: soft copy, pause/resume, no blocking after timeout.
- Risk: timeout pollutes mistakes. Mitigation: session-only timeout state and tests for no `progress.answers` write.
- Risk: timeout accidentally triggers 010 auto-reveal as if it were answer selection. Mitigation: keep timeout separate from selected-answer/attempt state unless explicitly required.
- Risk: config drift. Mitigation: derived helper and formula tests.
- Risk: feature 010 merge conflict. Mitigation: rebase before implementation and keep timer state integration narrow.
- Risk: screen-reader noise. Mitigation: no per-second live announcements.
- Risk: hidden background countdown surprises users. Mitigation: only current visible ticket decrements.

## Rollback

The timer should be easy to revert because it is confined to helper/tests, learning state/UI, and styling. No persisted data migration is introduced. If a release issue appears, remove the learning timer rendering and related session state without touching stored progress.
