# Plan: Learn All Questions

## Implementation Strategy

1. Add focused tests first.
   - Unit-test the shuffle/default Learn ordering helper with injected random functions.
   - Add or adjust Playwright coverage so default Learn shows total `460`, does not start from a hard 25-item collection, changes order across controlled refresh/reopen, and remains stable within one session.
   - Update brittle e2e expectations that assume `questions[0]` is the first default Learn card. Tests that need a specific ticket should search by ticket ID or use a deterministic seeded/controlled order.

2. Separate default Learn collection behavior from search narrowing.
   - Keep non-empty `searchQuestions(query)` behavior focused on filtering by question ID, Spanish text, answer text, topics, Russian translations, and explanations.
   - Remove the empty-query 25 cap for the default Learn path.
   - Prefer a `useMemo` or lazy `useState` session-order initialization that shuffles all current questions once per LearnView/app session.
   - When `query.trim()` is empty, Learn uses the session-shuffled all-question collection.
   - When `query.trim()` is non-empty, Learn uses filtered search results.

3. Preserve state by question ID.
   - Keep `timerStates`, `attemptsByQuestion`, progress answers, and difficult IDs keyed by `question.id`.
   - Keep `QuestionCard` keyed by `question.id`.
   - Ensure index reset on query change does not create a new session shuffle.
   - Ensure clearing the search returns to the same all-question order for the active session.

4. Preserve support and status behavior.
   - Do not change active exam behavior.
   - Do not change mistake review unless a shared helper refactor requires a regression-tested adjustment.
   - Do not change unofficial fallback labels except to preserve or clarify existing truth.

5. Record verification and process memory.
   - Keep `tasks.md` current in the implementation PR.
   - Record exact command outputs or concise evidence for all required checks and any blockers.

## Likely Files

Likely implementation files:

- `src/search.ts`
- `src/App.tsx`
- `src/domain.ts`
- `tests/e2e/app.spec.ts`
- `tests/*.test.mjs`

Feature memory file to update during implementation:

- `specs/023-learn-all-questions/tasks.md`

Durable docs:

- No `docs_project/` update is required by default because existing docs already state the current fallback bank has 460 questions, 276 image-backed references, Learn navigation follows the active collection, and fallback labeling must remain truthful.
- If implementation changes visible user copy, durable behavior rules, architecture, runtime workflow, or source/status semantics, update the relevant durable docs in the same PR and record why.

## Test Guidance

- Prefer a pure helper such as `shuffleQuestionsForLearning(questions, random = Math.random)` or a generic `shuffleQuestions(questions, random = Math.random)`.
- The helper must not mutate the imported `data.questions` array.
- Unit tests should prove:
  - all input questions are present exactly once;
  - canonical order can be changed with controlled randomness;
  - different controlled random streams can produce different orders;
  - empty input returns empty output.
- E2E tests should prove:
  - default Learn navigation total is `460`;
  - search for a known ID still finds that exact ticket;
  - no-match search still shows no card/navigation/answers;
  - answer/timer/support restoration still works after navigating away and back;
  - fallback label is still visible.
- For randomization e2e, use deterministic control rather than probabilistic assertions. Options include a test-only injected random sequence through `page.addInitScript` if the implementation supports it, or unit-level deterministic proof plus e2e proof that reload creates a new session order under controlled random input.

## Verification Plan

Required local verification before PR handoff:

```bash
git status --short --branch
node -e "const q=require('./content/questions/caba-b.unofficial-fallback.questions.json'); console.log(q.length, q.filter(x=>x.image).length)"
pnpm run validate:content
pnpm run test
pnpm run build
pnpm run test:e2e
node scripts/check-feature-memory.mjs --worktree
git diff --check
pnpm run preflight
```

Manual or automated UI evidence must name:

- the default Learn collection total;
- the first several question IDs from two controlled refresh/reopen sessions;
- evidence that the order did not change during in-session actions;
- a search narrowing example and no-match example;
- support/timer/progress preservation example;
- fallback label preservation.

## Review Plan

Review should focus on regressions and contract drift:

- Is the 25-item empty-query cap fully gone from the default Learn path?
- Is the full default collection exactly the current validated local bank, not a duplicate or partial projection?
- Is shuffle stable for a session and variable across refresh/reopen?
- Is randomization testable without flaky probability checks?
- Are search results still narrowed and no-match-safe?
- Did implementation avoid mutating global content arrays?
- Are all learning states still keyed by question ID?
- Are exam and mistake review unaffected except for deliberate, tested shared-helper changes?
- Is fallback labeling preserved?
- Is process memory current, with no unresolved Implementation Agent feedback?

## Risks And Mitigations

- Risk: Randomization makes existing e2e tests flaky because they expect the first canonical question.
  - Mitigation: Search by known ticket ID where a test needs a specific ticket, or use controlled random injection for default-order tests.
- Risk: Randomization runs on every render.
  - Mitigation: Initialize session order once using a lazy state initializer or stable memo with no state-changing dependencies.
- Risk: Search clearing generates a new shuffle.
  - Mitigation: Store the session order separately from query state.
- Risk: State restoration breaks because index changes.
  - Mitigation: Keep all mutable learning state keyed by question ID and verify by navigating away/back.
- Risk: Changing `searchQuestions` globally affects other search surfaces.
  - Mitigation: Keep search helper changes narrow and update all callers/tests if its empty-query contract changes.
- Risk: The UI accidentally implies official complete-bank status.
  - Mitigation: Preserve existing status strip/home wording and add regression coverage for the unofficial label.

## Rollback

If the implementation introduces regressions, revert the app/test changes from the implementation PR while preserving feature memory evidence. The content bank and durable docs should remain unchanged unless implementation records a separate content/readiness gap requiring Orchestrator disposition.

## Handoff

Implementation Agent may proceed after Orchestrator assigns the implementation slice with this complete feature memory. Implementation must stay in the assigned isolated worktree/branch, keep this feature's `tasks.md` current, and return any scope divergence or content-readiness discovery to Orchestrator for Architect disposition.
