# Feature Request: Web UI For Existing Topic Learning Materials

## Request Intake

Add a web-interface section for the learning materials created through the earlier topic-study-guide work. The section must be reachable from a new top navigation button. Activating that button should open the learning documentation/materials inside the app, organized by the previously created topic sections.

This request is repository-changing, but this Analyst pass writes only this intake artifact. Product code, tests, durable docs, technical specs, implementation tasks, commits, and PR work are for later roles.

## Original User Request

The user asked in Russian:

- act as Analyst;
- other agents are working in parallel, so create a separate environment and work there;
- add a section to the web interface with learning materials;
- split that section by the sections created earlier;
- add a new button at the top; clicking it opens the docs/materials;
- do everything required in the Analyst role;
- at the end, report the branch name;
- ask clarifying questions in Q&A mode if needed.

## Clarifying Answers

The user then clarified:

- everything was created in request `006`;
- use the data collected there.

No further blocking question is needed for Analyst intake. This feature can proceed with explicit assumptions and open questions for Architect instead of pausing the user.

## Working Environment

Separate worktree created for this Analyst task:

```text
/Users/chap/devel/cabadrive-008-learning-materials-intake
```

Branch:

```text
codex/008-learning-materials-intake
```

Feature folder:

```text
specs/008-learning-materials-ui/
```

Numbering note: the original shared workspace already showed parallel `007` feature work, so this intake uses `008` to avoid colliding with another agent's active feature folder.

## Project Context

Cabadrive is a static local-first React/TypeScript/Vite web trainer for Russian-speaking drivers preparing for the CABA category B theory exam.

Relevant constraints from repository memory:

- Runtime is local-first and static; MVP has no backend.
- End-user local runtime contract is Docker-only: `make build`, `make up`, `make down`.
- Official Spanish question text remains primary.
- Russian translations, explanations, vocabulary, and guide material are unofficial learning aids.
- The current question content mode is `unofficial_b_fallback`, not an official complete GCBA category B bank.
- UI must not imply official or complete CABA question-bank coverage.
- Existing primary navigation currently includes learning, exam, mistakes, vocabulary, and the existing CABA/RF guide.

## Existing 006 Data To Reuse

This feature must build on `specs/006-topic-study-guide/` rather than recreating the learning-material dataset.

Observed relevant artifacts from request `006`:

- `content/guide/topic-study-guide.ru.json`
- `content/guide/topic-study-guide.coverage.json`
- `content/guide/topic-study-guide.source-trace.json`
- `content/official-documents/`
- `scripts/content-topic-guide.mjs`
- `scripts/official-documents-validation.mjs`
- `specs/006-topic-study-guide/feature-request.md`
- `specs/006-topic-study-guide/spec.md`
- `specs/006-topic-study-guide/plan.md`
- `specs/006-topic-study-guide/tasks.md`

Current observed topic-guide state:

- guide id: `topic-study-guide`;
- guide locale: `ru`;
- guide status: `draft`;
- guide content status: `unofficial_learning_aid`;
- topic count: 38;
- coverage baseline expected question count: 460;
- coverage status: `draft`;
- coverage assignments exist for the current 460 fallback ticket IDs;
- many topic content slices have been authored, while `006` still leaves UI integration work open.

Current observed frontend state:

- `src/data/content.ts` imports the existing condensed guide `content/guide/ru.condensed-guide.json`;
- it does not yet import `content/guide/topic-study-guide.ru.json`, coverage, or source-trace data;
- `src/App.tsx` has `View = "learn" | "exam" | "mistakes" | "vocabulary" | "guide"`;
- current `GuideView` renders the older CABA/RF condensed guide, not the topic-study-guide materials;
- the top tab row currently has buttons for `Учить`, `Экзамен`, `Ошибки`, `Словарь`, and `CABA/RF`.

Relevant open `006` implementation tasks:

- T061 Add a separate topic guide section or navigation entry without removing current learning/exam/vocabulary flows.
- T062 Render topic list and topic detail pages from structured guide content.
- T063 Render canonical Spanish question text, answer options, correct answer, local image, and Russian explanations for each guide ticket block.
- T064 Render Spanish words, concise Russian material, and trap notes in the required topic sequence.
- T065 Preserve unofficial-learning-aid clarity for Russian guide material and fallback question status.
- T066 Ensure no raw PDF viewer or runtime network fetch is required.
- T067 Add Playwright coverage for guide reachability, required topic sequence, local images, and topic-ticket rendering.

## Source Review

Internal sources read for this intake:

- `.specify/memory/constitution.md`
- `docs_project/README.md`
- `docs_project/project-idea.md`
- `docs_project/project/frontend/frontend-docs.md`
- `docs_project/project/backend/backend-docs.md`
- `docs_project/project/feature-inventory.md`
- `docs_project/screens/learning-and-exam-flows.md`
- `docs/specify/README.md`
- `specs/006-topic-study-guide/feature-request.md`
- `specs/006-topic-study-guide/spec.md`
- `specs/006-topic-study-guide/plan.md`
- `specs/006-topic-study-guide/tasks.md`
- `src/App.tsx`
- `src/data/content.ts`
- `content/guide/topic-study-guide.ru.json`
- `content/guide/topic-study-guide.coverage.json`
- `tests/e2e/app.spec.ts`

No new external research was performed during this intake. The user's clarification explicitly points this feature to the data collected in request `006`, and the requested work is a UI exposure/integration request rather than a new legal-source or content-research request.

## Assumptions

- "Дока" means an internal app section/page that renders the existing topic learning materials, not a raw PDF viewer and not an external documentation website.
- The new top button should open the topic-study-guide materials from request `006`, not replace the current `CABA/RF` condensed guide unless Architect later decides to combine them.
- The section should be learner-facing, but it must preserve draft/published safety from `006`; if the guide remains `draft`, Architect should decide whether to show it with an incomplete/draft label, hide incomplete topics, or require final strict publication first.
- The user-facing grouping should follow the 38 topic sections already represented in `content/guide/topic-study-guide.ru.json` / coverage, unless Architect explicitly dispositions a taxonomy cleanup.
- The feature should reuse canonical question data for Spanish text, answers, images, and source status; it should not duplicate canonical ticket text into UI-only data.
- No backend, runtime network access, or official-document viewer is needed for the requested UI.

## Scope Expectations

In scope for the eventual feature:

- Add a new top navigation control for learning materials/topic docs.
- Render a separate web section for topic-study-guide materials created by `006`.
- Show the list of available topic sections.
- Let the learner open a topic section and read its material.
- Render each topic in the required sequence from `006`: Russian material, practical reasoning where present, Spanish terms from ticket wording, ticket blocks with answer explanations, and trap notes.
- Join topic ticket blocks to canonical questions so Spanish source text, answer options, correct answer, images, and source status remain consistent.
- Preserve the existing CABA/RF guide unless Architect explicitly scopes replacement.
- Preserve unofficial-learning-aid and `unofficial_b_fallback` clarity in the new section.
- Keep the app local-first and offline-capable.
- Add or update tests for navigation reachability, topic rendering, local images, answer explanations, and no runtime network/PDF-viewer dependency.
- Update durable docs if the user-facing navigation or learning-flow documentation changes.
- Update `specs/006-topic-study-guide/tasks.md` or explicitly cross-reference it if Architect decides this feature is the UI slice of `006`.

Out of scope for this intake:

- Creating or rewriting the 006 topic guide content.
- Reworking the 006 taxonomy.
- Downloading or validating new official sources.
- Changing product code or tests.
- Writing Architect-owned `spec.md`, `plan.md`, or `tasks.md`.
- Claiming the fallback question bank is official or complete.
- Adding a backend, server-side rendering, cloud sync, analytics, or runtime internet dependency.

## Acceptance Expectations

The eventual implementation should be accepted only when evidence shows:

- a new top navigation button opens the topic learning materials section;
- the section uses the topic-guide data from request `006`, not the older condensed CABA/RF guide as a substitute;
- existing main flows remain reachable: learn, exam, mistakes, vocabulary, and the existing guide if retained;
- the topic list reflects the previously created topic sections;
- each rendered topic page follows the 006 structure: concise Russian material, Spanish terms, ticket blocks with explanations, and trap notes;
- ticket blocks render canonical Spanish question text and answer options;
- ticket blocks show the correct answer and explanations for incorrect alternatives where the 006 data provides them;
- local question images render when the canonical question includes an image;
- guide material is clearly treated as unofficial Russian learning support;
- current content mode remains clear: the question set is `unofficial_b_fallback`;
- no raw PDF viewer or runtime network fetch is required to use the section;
- e2e evidence proves the new button and at least one topic page work in the browser;
- validation/test/build/preflight expectations defined by Architect pass or record exact unrelated blockers.

## Risks

- The guide data is currently marked `draft`; exposing it as learner-ready without draft/incomplete signaling could overpromise completeness.
- The existing app already has a `guide` view for CABA/RF differences. A new "materials/docs" section could confuse users if labels and navigation hierarchy are not clear.
- Rendering all ticket blocks for a large topic at once may create a heavy or hard-to-scan page on mobile.
- Topic-guide content references canonical question IDs; missing joins or image-path mistakes could produce incomplete ticket cards.
- Physical repetition for dual-category tickets from `006` must be preserved if the UI exposes multiple topics.
- If the UI imports source-trace or official-document metadata directly, it could accidentally create a bulky learner surface or expose archive details meant for validation rather than study.
- If implementation updates `006` task memory and this `008` feature memory inconsistently, future agents may not know whether UI integration is tracked under `006`, `008`, or both.

## Open Questions For Architect

- Should this request become a standalone `008` feature, or should Architect treat it as the UI-integration slice of `006` with this intake as cross-reference?
- What should the new top button label be: `Материалы`, `Темы`, `Учебник`, `Дока`, or another Russian label?
- Should the old `CABA/RF` condensed guide remain as a separate tab, move under the new materials section, or be left unchanged for now?
- Should draft topics be visible to learners with an explicit label, or should the UI show only topics whose placements/content are ready enough for publication?
- Should topic detail navigation be single-page in-app state, hash routes, or a simple list/detail view within the existing React state model?
- Should source-trace/currentness metadata be shown to learners, hidden from the main study view, or available only as a compact "sources checked" detail?
- What topic-size or pagination rule should prevent very large topic pages from becoming unwieldy on mobile?
- Should the new section be covered by existing `GuideView` refactoring or by a new `TopicGuideView` to preserve the CABA/RF guide boundary?

## Analyst Handoff Notes

Architect should start from this intake plus `specs/006-topic-study-guide/` and avoid redoing the content-research work already completed there.

The likely implementation shape is small and UI-focused compared with the full `006` content effort:

- import structured topic-study-guide data through `src/data/content.ts`;
- add typed content models for topics and guide ticket blocks;
- create a dedicated topic guide view;
- add a new top navigation button;
- render topic list/detail content from existing structured JSON;
- join guide ticket IDs to canonical questions for Spanish text, answers, source status, and images;
- add Playwright coverage for reachability and rendered topic content;
- keep draft/published behavior and disclaimers aligned with 006 validation.

Architect must decide how to handle overlap with open `006` Slice F tasks. If the UI work lands as `008`, it should still update or reference `006` process memory so future agents do not duplicate the same UI integration.
