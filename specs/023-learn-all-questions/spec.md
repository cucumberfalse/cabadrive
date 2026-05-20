# Spec: Learn All Questions

## Analyst Intake

- Source request: `feature-request.md`.
- Active feature folder: `specs/023-learn-all-questions/`.
- Assigned Architect worktree: `/Users/chap/devel/cabadrive-023-learn-all-questions`.
- Assigned branch: `codex/023-learn-all-questions`.
- Architect scope is limited to creating or updating `spec.md`, `plan.md`, and `tasks.md` in this feature folder.

## Goal

Fix `Учить` / Learn mode so the default learning collection exposes every locally available valid question for the active content mode. For the current `unofficial_b_fallback` bank this means 460 category B questions, including the 276 image-backed question references already present in local content.

The default all-question Learn order must be randomized for each browser refresh/reopen, remain stable during the active session, and preserve the existing learning support behavior: search narrowing, per-ticket timer, answer/progress recording, previous/next state restoration, difficult marking, Russian support reveal behavior, local images, image overlays, and truthful unofficial fallback labeling.

## Scope

In scope:

- Change default Learn collection behavior from the current empty-query 25-question cap to all available current Learn questions.
- Add or reuse a testable shuffle helper so default Learn order is randomized once per session/app load and does not reshuffle during ordinary renders, timer ticks, answer selection, navigation, or query state changes.
- Preserve search as a narrowing behavior when the learner enters a query.
- Preserve previous/next navigation inside the active collection:
  - default all-question collection when query is empty;
  - filtered search collection when query is non-empty.
- Preserve answer, timer, support reveal, difficult marking, progress, local image, overlay, and fallback-status behavior keyed by question identity.
- Add or update automated tests proving the all-question default and session-stable randomization behavior.
- Record implementation decisions, dead ends, known issues, verification evidence, and any Implementation Agent feedback in `specs/023-learn-all-questions/tasks.md`.

Out of scope:

- Replacing the current `unofficial_b_fallback` content source or claiming an official complete GCBA bank.
- Creating new questions, translations, explanations, images, image metadata, overlays, topics, vocabulary, or official-source reader content unless implementation discovers a real readiness gap that blocks the stated 460/276 acceptance criteria.
- Changing exam simulation question count/order semantics.
- Changing Mistake Review ordering except where a shared helper refactor is required and fully regression-tested.
- Changing the Docker runtime contract, service worker strategy, backend architecture, branch protection, secrets, or production resources.
- Durable `docs_project/` updates unless implementation changes documented behavior, visible status language, architecture, workflow, or deploy rules beyond aligning Learn with existing documented expectations.

## User Stories

### User Story 1

As a learner opening `Учить`, I want the app to let me study the whole available current bank, so I do not miss questions that exist locally.

### User Story 2

As a learner returning after refresh or reopening the app, I want a fresh order, so practice does not always start with the same tickets.

### User Story 3

As a learner using search, I want the search box to narrow the active Learn collection and navigation to stay inside the filtered results.

### User Story 4

As a reviewer, I want command and UI evidence for 460 reachable Learn questions and 276 image-backed references, so the fix is proven against the reported mismatch rather than only summarized.

## Functional Requirements

- FR-001: Empty-query/default Learn mode must include all questions from the active validated local Learn question bank.
- FR-002: For the current fallback content, the default Learn collection total must be 460.
- FR-003: The current 276 image-backed question references must remain reachable in Learn mode.
- FR-004: Default Learn order must be randomized on refresh/reopen.
- FR-005: Default Learn order must remain stable during one active app session across renders, timer ticks, answer selection, difficult marking, previous/next navigation, and support reveal changes.
- FR-006: Clearing a search query must return to the same default session order that existed before the search, not generate a new shuffle.
- FR-007: Non-empty search must narrow the active Learn collection to matching questions and must not fall back to an answerable question when there are no matches.
- FR-008: Search result navigation must continue to use the active filtered collection and boundary states.
- FR-009: Existing per-question timer state must remain keyed by question ID and must not be reset by the larger default collection except when the learner navigates to a never-seen ticket.
- FR-010: Existing answer attempt state and revealed support must remain keyed by question ID so previous/next restoration still works after navigation.
- FR-011: Existing progress storage and difficult marking must continue to record by question ID.
- FR-012: Russian question/answer translations and explanations must remain hidden by default and reveal through the existing controls or after answer selection.
- FR-013: Active exam attempts must remain unaffected: no learning timer, translation, explanation, overlays, or difficulty hints are introduced into active exam mode.
- FR-014: UI/status copy must continue to label the practice bank as the unofficial category B fallback set and must not imply official full GCBA coverage.
- FR-015: If implementation discovers the content/support bank is not actually ready for all 460 current questions, it must record the gap in `tasks.md`, add scoped tasks or ask Orchestrator for a content-preparation slice, and must not claim ready status until the gap is closed or explicitly dispositioned by Architect.

## Acceptance Criteria

1. Given the current bundled fallback question file, local content-count evidence shows 460 questions and 276 records with image references.
2. Given Learn mode opens with an empty query, the bottom navigation total displays 460 and default navigation can reach the last item without a 25-question cap.
3. Given Learn mode opens with an empty query, the order is randomized from the canonical content order for a controlled random seed or equivalent deterministic test.
4. Given the page reopens or refreshes with a different controlled random seed, the default first several Learn question IDs differ from the prior session.
5. Given timer ticks, answer selection, difficult marking, support reveal toggles, and previous/next navigation happen in one active session, the default Learn order does not reshuffle.
6. Given a search query is entered, Learn results narrow to matching questions, navigation total reflects the filtered result count, and previous/next stays inside that filtered collection.
7. Given the search query is cleared, Learn returns to the existing session's default all-question order and total 460.
8. Given a search has no matches, Learn shows the existing empty state and renders no answerable fallback card or navigation.
9. Given the learner answers a ticket and returns to it through default navigation or search, selected answer, feedback, revealed support, progress recording, and timer-completed state are restored for that question ID.
10. Given image-backed questions are reached in Learn mode, local images render and approved explanation overlays still appear only after support is visible.
11. Given the app status surfaces are inspected, they still identify the bank as `unofficial_b_fallback` / unofficial category B practice support rather than official complete GCBA coverage.
12. Given local verification runs, content validation, unit tests, Playwright e2e, production build, feature-memory gate, `git diff --check`, and repository preflight pass or exact unrelated blockers are recorded.

## Negative Scenarios

- Keeping an empty-query cap of 25 questions is not acceptable.
- Showing all 460 only after a search or hidden UI action is not acceptable; the default Learn collection must expose all available current questions.
- Shuffling on every render, timer tick, answer click, or state update is not acceptable.
- Persisting one permanent order forever in localStorage is not acceptable for this request; refresh/reopen must produce a fresh randomized default order.
- Search results must not be padded, capped to 25, or replaced with default questions when there are no matches.
- Changing exam simulation to use 460 questions or exposing learning support in active exam mode is not acceptable.
- Losing answer/timer/progress/difficult state because navigation index changed is not acceptable.
- Removing or weakening unofficial fallback labeling is not acceptable.
- Claiming missing content is ready without deterministic count/coverage evidence is not acceptable.

## Verification Requirements

Implementation must record command or test evidence for:

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

Implementation must also record UI/test evidence that:

- default Learn total is 460;
- default Learn order changes across refresh/reopen under controlled randomization;
- default Learn order remains stable within a session;
- search narrowing and no-match behavior still pass;
- support/timer/progress behavior still passes;
- unofficial fallback labeling remains visible.

If an environment lacks dependencies or browser/Docker support, the Implementation Agent must record the exact blocker, run all still-available checks, and ask Orchestrator for disposition.

## Review Requirements

Review Agent must verify:

- Complete feature `023` memory exists before implementation changes.
- Role boundaries were followed: Architect changed only this feature's `spec.md`, `plan.md`, and `tasks.md`; Implementation Agent changes are scoped to app/tests and this feature memory.
- Default Learn exposes all 460 current fallback questions, not a 25-item cap.
- Randomization is session-stable and refresh/reopen-variable.
- Search behavior remains narrowing and no-match-safe.
- Timer, support reveal, image rendering/overlays, progress recording, and difficult marking remain keyed by question ID and are regression-tested.
- Exam mode and mistake review are not unintentionally changed.
- Unofficial fallback labeling remains intact.
- Durable docs were either not changed with a recorded reason, or changed only if behavior/workflow documentation genuinely required it.
- Verification evidence covers all acceptance criteria or records exact unrelated blockers.
- No unresolved Implementation Agent feedback remains without Architect disposition.

## Architectural Decisions

- Treat this as a frontend behavior bug over an already-ready local content bank. Repository memory and intake evidence show 460 current questions and 276 image-backed question references are present.
- Prefer a small pure shuffle helper, likely in `src/domain.ts` or a narrow Learn helper module, with injectable randomness for deterministic unit tests.
- Keep default Learn randomization local to the app session/component lifetime rather than storing the order in progress or localStorage. This satisfies refresh/reopen variability while avoiding durable progress churn.
- Do not make `searchQuestions("")` globally mean "random all questions" unless all callers and tests are updated deliberately. A safer approach is to separate:
  - searchable filtering for non-empty queries;
  - default Learn collection construction and shuffling in `LearnView` or a dedicated helper.
- Keep all learning state keyed by question ID, not by collection index.
- Default behavior may display `1 / 460` through existing navigation; no new explicit counter copy is required unless implementation needs it for accessibility or testability.
- `docs_project` updates are not required by this design because existing durable docs already describe the current 460-question fallback bank, Learn navigation inside the active collection, and unofficial fallback labeling. If implementation changes visible copy, durable behavior, runtime workflow, or documented architecture, the Implementation Agent must record and perform the necessary docs update instead of relying on this default decision.
