# Feature Request: Learn All Questions

Created by Analyst intake in fresh-main isolated worktree `/Users/chap/devel/cabadrive-023-learn-all-questions`.

## Original Request

User request in Russian:

> “ты оркестратор; баг - почему в разделе учить всего 25 билетов, хотя заявлено, что в базе 460 вопросов B, 276 с картинками. по логике в учить должны быть все, после обновления порядок рандомизируется. если все не готовы - надо подготовить и выложить”

Additional user constraint: work must happen in a separate environment from fresh main.

## Intake Scope

This is a learner-facing bug/intake request for the `Учить` / Learn Questions surface.

The user expectation is:

- Learn mode should expose all available category B questions, not only 25 tickets.
- The available bank is expected to include 460 B questions.
- The available bank is expected to include 276 image-backed question references.
- On refresh/reopen, Learn mode order should randomize.
- If the full question/support bank is not ready, the missing preparation should be completed and published through the normal repository workflow.

This intake records the request only. It does not create technical design, tasks, implementation, tests, commits, PRs, or product documentation changes.

## Project Context Read

Analyst read the required repository memory:

- `.specify/memory/constitution.md`
- `docs_project/README.md`
- `docs_project/project-idea.md`
- `docs_project/project/frontend/frontend-docs.md`
- `docs_project/project/backend/backend-docs.md`
- `docs_project/project/feature-inventory.md`
- `docs_project/screens/learning-and-exam-flows.md`
- `docs/specify/README.md`

Relevant durable context:

- Cabadrive is a local-first, offline-capable web trainer for Russian-speaking experienced drivers preparing for the CABA theory exam.
- The MVP has no backend; content is bundled locally and user progress is stored locally.
- Current content mode is `unofficial_b_fallback`, not a confirmed full official GCBA bank.
- The current fallback practice source is category B/CABA material from `bandinopla/simulador-test-de-conducir`, with clear non-official labeling required.
- Frontend docs and feature inventory state that the current fallback bank has 460 category B tickets, complete Russian translations/explanations, and image metadata coverage.
- Learn mode should show official Spanish primary text, local images, hidden-by-default Russian support, answer feedback, weak-topic links, ticket IDs, difficulty metadata, and bottom previous/next navigation inside the active search collection.
- Docker-only runtime and repository PR workflow remain in force for any later implementation.

## Observed Local Facts

Observed in `/Users/chap/devel/cabadrive-023-learn-all-questions`:

- Existing `specs/` numeric prefixes go up to `022`; duplicate prefixes exist, but the next max-plus-one prefix is `023`.
- `specs/023-learn-all-questions/` did not exist before this intake.
- `content/questions/caba-b.unofficial-fallback.questions.json` contains 460 question records.
- The same local question file contains 276 records with an `image` reference.
- `docs_project/project/feature-inventory.md` states current image metadata coverage is complete for 275 unique local images and 276 image-backed question references.
- `specs/009-image-metadata-learning-support/spec.md` records the 460 current fallback tickets and 276 image-backed question usages as a completed-content target.
- `src/search.ts` currently returns `questions.slice(0, 25)` when `searchQuestions()` receives an empty query.
- `src/App.tsx` `LearnView` initializes `query` as an empty string and computes `results` with `searchQuestions(query)`, so the default Learn collection follows the empty-query cap.
- `LearnView` navigation uses `results.length`; therefore, with an empty query, the visible Learn navigation is limited to 25 results even though the local bank has 460 questions.
- Exam mode already has a random-selection helper in `src/domain.ts`, but this intake does not prescribe reusing or changing it.
- No local evidence was observed that default Learn mode randomizes all 460 questions on page refresh/reopen.

## Problem Statement

The Learn Questions surface appears to contradict product/content claims: the app carries a 460-question category B fallback bank with 276 image-backed references, but default Learn mode exposes only 25 tickets because the empty search query path is capped. This makes the learner believe the available study set is much smaller than the bank and blocks normal all-question study.

The user also expects Learn mode to present the full available study bank in a randomized order after refresh/reopen, so repeated sessions do not always start from the same first tickets.

## Assumptions

- “25 билетов” refers to the default Learn mode collection size and navigation count, not the exam simulation size.
- “Все” means all locally available valid Learn-mode practice questions in the current content mode, currently the 460 category B fallback questions.
- Randomization is expected for the default all-question Learn collection when the app is refreshed or reopened.
- Search behavior should still allow narrowed result collections when the learner enters a query.
- The current bank should remain truthfully labeled as `unofficial_b_fallback`; exposing all questions must not imply an official full GCBA bank.
- “Если все не готовы” refers to missing content readiness only if verification finds a coverage gap; observed local facts indicate the current question file and support-memory claims already cover the 460/276 counts.

## Risks

- Randomizing Learn order can disrupt current per-question timer state, restored answer state, previous/next behavior, or progress expectations if identity is tied to list index rather than question ID.
- A naive random order on every render could reshuffle while the learner types, answers, navigates, or state updates; randomization should be stable for a session and change only on refresh/reopen or an explicit reset.
- Returning all 460 questions for an empty query may affect performance, scroll/navigation expectations, or tests that assumed the 25-item cap.
- Search result order and default Learn order may need different behavior; changing `searchQuestions()` globally could affect any other caller.
- Product copy must continue to avoid claiming official full-bank status.
- If content validation reveals support gaps despite the observed 460/276 counts, implementation may need a content-preparation slice rather than only a frontend behavior fix.

## Open Questions

- Should default Learn randomization use a fresh random order on every browser refresh/reopen, or should it persist a daily/session seed in localStorage?
- Should users have a way to reshuffle manually, or is refresh/reopen randomization sufficient for this request?
- When a search query is active, should search results remain deterministic or also be randomized?
- Should Learn mode show an explicit `1 / 460` style total for the all-question collection to reassure the learner that the full bank is available?
- Are there existing tests or UX expectations that intentionally limited empty search results to 25 for performance or onboarding reasons?
- If future content modes have fewer or more questions, should Learn always expose all available validated questions for the active mode?

## Acceptance Expectations

Architect and Implementation Agent should turn this intake into verifiable acceptance criteria. Expected behavior-level outcomes:

- Default Learn mode exposes all available validated Learn questions in the active content mode; for the current local fallback bank, this means 460 questions.
- Default Learn navigation/count reflects the full all-question collection, not a 25-item cap.
- Questions with local images remain available in Learn mode; current evidence expectation is 276 image-backed question references remain reachable.
- Refreshing/reopening the app randomizes the default Learn order while keeping the order stable during a single active Learn session.
- Searching still narrows the active Learn collection to matching questions and previous/next navigation follows that active collection.
- Russian translation/explanation reveal behavior, image rendering, timer behavior, answer recording, difficult marking, and progress storage continue to work after all-question exposure.
- UI/status language continues to label the current bank truthfully as the unofficial category B fallback set, not as a confirmed full official GCBA bank.
- If implementation discovers missing content/support readiness, the gap is recorded and completed through scoped content work before claiming the all-question Learn experience is ready.
- Verification evidence should include local content-count evidence for 460 questions and 276 image-backed references, automated or manual Learn-mode evidence that the default collection reaches all 460, and evidence that refresh/reopen changes order without mid-session reshuffling.

## Research

No external research was used for this intake. The request is grounded in repository memory and local source/content inspection.
