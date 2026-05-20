# Feature Request: UI/UX And Learning Source Of Truth

## Analyst Artifact Status

This is the Analyst intake artifact for a repository-changing request. Per the Cabadrive role boundary, this artifact records the request, project context, research, assumptions, risks, open questions, and acceptance expectations only.

It intentionally does not include a technical solution, implementation plan, task breakdown, product-code changes, source-of-truth documents, reviews, commits, pushes, PR state, or files outside this assigned intake artifact.

## Original User Request

The user asked in Russian, explicitly assigning the Analyst role and noting that other agents are working in parallel:

```text
текст задачи

=== начало
оработки ui ux
нужно
- собрать современные акутуальные ui ux практики, которые рекомендуется использовать при разработке в целом, и при разработке учебныых материалов в частности
практики обучения, которые позволяют максимально быстро и эффективно освоить материал
- проанализировать статьи, которые пишут разрабочики таких сервисов, как дуолингуо, взять из них мысли, идеи и подходы, которые можно применить в продукте
на основании материалов подготовить документы, которые будут являться источником правды для ui ux.
далее сделать файнал чек документов - источников правды, и исключить противоречия, неконсистентность между собой а так же неконситентность с соверенными подходами
далее, на основании материалов, по каждому пункту материала провести спложшной анализ продукта (декомпозировать на атомарные задачи) и предложить список задач на доработку
перед тем, как брать задачи в работку, сделать файнал чек, пройтись по задачам и исключить противоречия, неконсистентность между собой а так же неконситентность с источником правды
проверить, что в рамках задач будет сделано/исправлено вот это
1 после выбора ответа всегда включать перевод и поянение
2 неудобно расположена кнопка следующий - сделать внизу, также даобавить кнопку предыдущий
3 при включении пояснения на картинке затемнять неважные детали, оставляя только важные. Для определения, что важно, использовать метоописание изображений, которое создается в друго фича реквесте (найди где). Нужно поверх картинки накладывать затемнение, их в рамках этого фича реквеста сохранить для каждой картинки где-то рядом с пояснение

=== конец

ты аналитик, праллельно с тобой работают другие агенты, создай для себя отдельное окружение и работай в нем
задача, оставаясь строго в роли аналитика сделай работу
по итогу напиши только название бранча
если нужны уточнения - задай вопросы
```

## Working Environment

The Analyst work was performed in an isolated worktree:

```text
/Users/chap/devel/cabadrive-010-ui-ux-learning-intake
```

Branch:

```text
codex/010-ui-ux-learning-intake
```

Feature folder:

```text
specs/010-ui-ux-learning-source-of-truth/
```

## Prefix Decision

The updated checkout from `origin/main` contains feature folders through `007`, and parallel local worktrees already exist for `008` and `009`. To avoid colliding with other active agents, this intake uses prefix `010`.

Relevant parallel work found:

- `codex/008-learning-materials-intake`, folder `specs/008-learning-materials-ui/`, which adds a learner-facing topic materials UI from the earlier `006` topic guide.
- `codex/009-ticket-image-metadata-intake`, folder `specs/009-image-metadata-learning-support/`, which defines the requested image metadata layer and image-aware validation/completion of translations and explanations.

## Scope Split Decision

This request combines research, durable UI/UX standards, learning-design standards, consistency checks, a full product audit, task generation, and implementation of the validated mandatory fixes inside the same feature request. These are tightly connected because the user wants UI work in `010` to be governed by one source of truth rather than ad hoc redesign decisions.

At intake time, keep this as one feature memory. Architect should still split implementation into reviewable slices, likely separating:

- source-of-truth documentation;
- consistency/final-check evidence;
- product audit and task inventory;
- learner card interaction fixes;
- image explanation overlay work that depends on feature `009`.

No separate feature folder is recommended by Analyst for the mandatory fixes. If Architect later identifies additional non-mandatory audit findings that are too large for `010`, those may be proposed as follow-up child features, but the validated mandatory fixes listed in this intake remain in scope for implementation in `010` after the relevant gates and dependencies are satisfied.

## Project Context Reviewed

Repository memory and durable docs reviewed:

- `.specify/memory/constitution.md`
- `docs_project/README.md`
- `docs_project/project-idea.md`
- `docs_project/project/frontend/frontend-docs.md`
- `docs_project/project/backend/backend-docs.md`
- `docs_project/project/feature-inventory.md`
- `docs_project/screens/learning-and-exam-flows.md`
- `docs/specify/README.md`

Parallel feature context reviewed:

- `specs/008-learning-materials-ui/feature-request.md`
- `specs/008-learning-materials-ui/spec.md`
- `specs/008-learning-materials-ui/tasks.md`
- `specs/009-image-metadata-learning-support/feature-request.md`

Relevant local files inspected for evidence only:

- `src/App.tsx`
- `src/styles.css`
- `src/data/content.ts`
- `tests/e2e/app.spec.ts`

Relevant project constraints:

- Cabadrive is a local-first React/Vite trainer for Russian-speaking drivers preparing for the CABA category B theory exam.
- MVP has no backend; runtime must remain Docker-served/static/offline-capable.
- Official Spanish question text remains primary.
- Russian translations, explanations, topic guide material, and future image metadata are unofficial learning support.
- Current question content mode is `unofficial_b_fallback`, not a complete official GCBA question bank.
- Active exam attempts hide translation and explanation support.
- Learning and mistake review currently start with Russian translation hidden.
- Question images are local assets and part of the learning surface.

## Current UI Evidence

Observed in `src/App.tsx` on the isolated worktree base:

- `QuestionCard` has local `showTranslation` and `showExplanation` state.
- Translation is toggled by activating the Spanish question text block in non-exam modes.
- Explanation is toggled by a separate `Пояснение` button in non-exam modes.
- After selecting an answer, the UI shows result feedback and the correct Spanish answer, but it does not automatically reveal translation or explanation.
- Exam mode hides translation and explanation support during active attempts.
- `LearnView` has a `Следующий` button in the top toolbar beside search.
- There is no learner-facing `Предыдущий` button in the current learning view.
- `QuestionCard` renders a static image with `img src={assetUrl(question.image.localPath)}` and no overlay, dimming, or answer-critical visual highlighting.
- Existing tests assert that translation is hidden initially and can be toggled, and that exam mode hides translation/explanation.

Observed in `src/styles.css`:

- Main question UI uses card-like blocks with 8px radii and responsive mobile stacking.
- The learning toolbar moves to a column on narrow screens, but the `Следующий` control remains above the card rather than at the bottom of the question flow.

## Related Feature 009 Dependency

Feature `009-image-metadata-learning-support` is the related request the user asked to find.

Its intake records that:

- every current question image should get structured JSON metadata;
- metadata should describe scene, objects, road users, gestures, signs, markings, relationships, annotations, uncertainty, and answer-critical details;
- answer-critical details should link to question IDs and, where relevant, answer IDs or traps;
- shared image metadata should describe visible objects/details/regions, while importance and relevance roles should be assigned only in per-question image usage for actual image-backed questions;
- images not used by a question do not need importance/relevance evaluation;
- `b-fallback-001` should record that the subject is a cyclist and that the cyclist's right arm is extended straight/horizontally;
- image-backed explanations should be validated against this metadata;
- Russian translations and explanations should be completed for all current questions.

This `010` feature should not redefine the `009` metadata schema. It should depend on `009` for answer-critical image details and define how the UI/UX source of truth uses those details for visual explanation overlays.

Implementation dependency rule: `010` may use feature `009`'s specification as a contract while `009` is still in progress, but it must not consume, copy, or build directly on unmerged working changes from `009`. The `009` implementation can become an implementation input for `010` only after `009` is fully completed and merged into `main`. Until then, `010` should proceed only with independent documentation, audit, task validation, and non-overlay implementation slices; overlay implementation must wait for the completed/merged `009` baseline.

Question-context relevance rule: `010` overlay presentation must consume `009` question-specific image usage/relevance for the concrete image-backed question being explained, not global importance flags on shared image metadata. Shared image metadata can tell the UI what visible details/regions exist, but it does not by itself decide which areas to dim or emphasize. If an image is not used by a question, or if a concrete question lacks approved usage/relevance data, `010` should not invent important/unimportant areas for overlay behavior.

## External Research Performed

Research date: 2026-05-09.

Sources used and relevant takeaways:

- Nielsen Norman Group, [10 Usability Heuristics for User Interface Design](https://www.nngroup.com/articles/ten-usability-heuristics/), updated 2024-01-30. Relevant principles for Cabadrive include visibility of status, user-language terminology, user control/freedom, consistency, error prevention, recognition over recall, efficient use for experienced users, focused/minimal surfaces, plain-language recovery, and contextual help.
- W3C, [Web Content Accessibility Guidelines (WCAG) 2.2](https://www.w3.org/TR/WCAG22/). Relevant baseline for UI source-of-truth includes perceivable/operable/understandable/robust design, visible focus, predictable interaction, language handling for Spanish/Russian content, target sizing, and avoiding pointer-only interactions where alternatives are needed.
- Dunlosky, Rawson, Marsh, Nathan, and Willingham, [Improving Students' Learning With Effective Learning Techniques](https://www.psychologicalscience.org/publications/journals/pspi/learning-techniques.html) / [SAGE DOI page](https://journals.sagepub.com/doi/10.1177/1529100612453266), 2013. The review rates practice testing and distributed practice as high-utility techniques across learners and tasks; self-explanation and interleaving are promising/moderate; rereading/highlighting alone are low-utility.
- Springer's Smart Learning Environments, [Multimedia learning principles in different learning environments: a systematic review](https://link.springer.com/article/10.1186/s40561-022-00200-2), 2022. Relevant principles include coherence, signaling, spatial/temporal contiguity, and reducing extraneous cognitive load. This directly supports dimming irrelevant image details and highlighting answer-critical regions during explanations.
- Duolingo Blog, [Why is spaced repetition so important for learning?](https://blog.duolingo.com/spaced-repetition-for-learning/), 2023. Relevant ideas: schedule review over time, review harder/wrong concepts sooner, and pair spacing with active recall rather than passive rereading.
- Duolingo Blog, [Introducing the new Duolingo learning path](https://blog.duolingo.com/new-duolingo-home-screen-design/), 2022. Relevant ideas: guide learners through the next best step, mix new and previously introduced concepts, group work into smaller units, and make practice feel like forward progress rather than punishment.
- Duolingo Blog, [Product principles](https://blog.duolingo.com/product-principles/). Relevant ideas: long-term learner benefit over short-term metrics, design for global/low-tech-literacy users, and continuously improve screens that are not yet good enough.
- Duolingo Blog, [The habit-building research behind your Duolingo streak](https://blog.duolingo.com/how-duolingo-streak-builds-habit/), 2022. Relevant ideas: small daily commitments can support habit formation, but motivational mechanics need flexibility so they do not demotivate learners who miss a day.
- Settles and Meeder, Duolingo Research, [A Trainable Spaced Repetition Model for Language Learning](https://research.duolingo.com/papers/settles.acl16.pdf?form=MG0AV3), ACL 2016. Relevant ideas: production learning systems can use learner performance history to select review material; incorrect answers should be accompanied by plain-language explanations; practice can target weak concepts.

Research interpretation for Cabadrive:

- The product should optimize for fast exam readiness, not time-on-app for its own sake.
- The strongest learning patterns for this domain are active recall on exam-like questions, immediate feedback, explanation after attempt, weak-topic review, distributed repetition, and image/signaling support that reduces visual ambiguity.
- Source-of-truth docs should explicitly distinguish "learning-support mode" from "exam mode" so helpful scaffolding never leaks into active exam simulation.
- Duolingo-style gamification should be treated carefully. Habit cues, streaks, and celebrations may help later, but this feature should prioritize correctness, trust, concise feedback, and exam-focused practice loops over engagement mechanics.

## Problem Statement

Cabadrive already has product rules for official Spanish primacy, hidden Russian support, local-first runtime, and exam-mode restrictions. However, there is no dedicated durable UI/UX source of truth that combines:

- modern general UI/UX expectations;
- accessibility expectations;
- learning-science practices for fast mastery;
- product-specific rules for bilingual exam preparation;
- image-backed explanation behavior;
- review/audit criteria for future UI work.

Without that source of truth, future UI changes can optimize isolated pain points while creating contradictions: for example, hiding support by default can reduce dependency before answering, but after an answer the learner needs immediate translation and explanation to learn from the attempt. Similarly, image explanations need visual signaling, but the signal must derive from structured answer-critical metadata rather than hand-placed arbitrary decoration.

## Desired Product Outcome

The feature should create durable source-of-truth documents for Cabadrive UI/UX and learning experience, then use those documents to audit the whole product, produce a consistent task inventory, validate that inventory, and implement the validated mandatory UX fixes inside this same feature request.

The source-of-truth documents, final documentation consistency check, product audit, and validated task inventory are preconditions/gates inside `010`, not the final deliverable by themselves. After those gates pass, `010` continues into implementation of the validated mandatory fixes that the user explicitly named.

The source-of-truth material should cover:

- general UI/UX principles that apply to the app;
- mobile-first and accessibility expectations;
- learning-material design principles for fast, durable exam preparation;
- bilingual Spanish/Russian content presentation rules;
- learning mode, mistake review, exam mode, vocabulary, guide/materials, and image-backed question rules;
- feedback/explanation timing;
- navigation placement and learner control;
- image explanation overlays based on answer-critical metadata;
- validation/review checklists so future PRs can prove consistency with the source of truth.

After those documents are drafted, the feature should require a final consistency check that removes contradictions between the docs themselves, existing durable project rules, current UI/UX practice, and the external research above.

Only after the source-of-truth docs pass that check should the product be audited against each principle. The audit should decompose each gap into atomic proposed tasks, then perform another final consistency check over the proposed tasks before implementation starts. The validated task inventory is a gate for implementation within `010`, not a handoff to an unspecified future feature.

## Mandatory UX Fixes To Be Implemented In This Feature

The task inventory must explicitly cover these user-requested fixes, and the validated versions of these fixes must be implemented in `010` after the source-of-truth, audit, dependency, and consistency gates are satisfied:

1. After a learner selects an answer in learning and mistake-review modes, Russian translation and the learning explanation must be revealed automatically. The learner should not need to separately toggle `Пояснение` after attempting the question. Active exam attempts must continue to hide translation/explanation support.
2. Question navigation must be improved: `Следующий` should be available at the bottom of the learning flow/card where the learner finishes reading feedback, and a `Предыдущий` control should be added. The design should work on mobile, keyboard, and screen-reader flows and avoid accidental answer loss or confusing state.
3. When explanation is shown for an image-backed question, the image should visually de-emphasize details that are irrelevant in that question context and keep details that are answer-critical in that question context prominent. The source for "important" and "unimportant" roles must be the per-question image usage/relevance from feature `009`, not global shared-image metadata and not subjective UI-only guesses. Overlay/dimming definitions or derived assets must be stored durably with or near the explanation/image-support content and validated so stale overlays are detected. This implementation slice is dependency-gated on `009` being completed and merged into `main`; before that point, `010` may prepare source-of-truth rules and task definitions from the `009` spec contract but must not implement against unmerged `009` work.

## Acceptance Expectations For Architect

Architect should convert these into formal acceptance criteria and verification requirements:

- The feature memory remains complete before implementation: `feature-request.md`, `spec.md`, `plan.md`, and `tasks.md`.
- Durable UI/UX source-of-truth docs are created under the repository's durable documentation structure.
- The source-of-truth docs cite or summarize the research basis used for modern UI/UX, accessibility, learning science, and Duolingo-style product lessons.
- The docs define Cabadrive-specific UI principles, not only generic UX advice.
- The docs preserve existing product constraints: official Spanish text primary, Russian support unofficial, `unofficial_b_fallback` clarity, local-first/no-backend runtime, and exam-mode support restrictions.
- The docs include learning-science rules for active recall, immediate post-answer feedback, explanation after attempt, weak-topic review, spaced/distributed repetition, interleaving where useful, self-explanation prompts where useful, and avoiding passive rereading as the main loop.
- The docs include multimedia/image rules: signal important visual details, remove/dim irrelevant visual load when explaining, keep labels near referenced image regions, and avoid decorative imagery in study surfaces.
- The docs include accessibility rules aligned with WCAG 2.2, including focus visibility, target sizing, keyboard operation, predictable controls, and language handling for Spanish/Russian mixed content.
- A final documentation consistency check is performed and recorded, proving there are no unresolved contradictions between the new docs, existing `docs_project/` rules, feature `008`, feature `009`, and the external research.
- A full product audit is performed against every source-of-truth point.
- The audit covers all current user-facing surfaces: status/onboarding, learning question flow, answer feedback, explanation/translation support, image-backed questions, exam mode, mistake review, vocabulary, CABA/RF guide, topic materials from feature `008` if present, search, progress/reset, mobile layout, and offline/status surfaces.
- The audit decomposes each identified product gap into atomic proposed tasks suitable for PR-sized implementation slices inside `010` or, for non-mandatory findings only, explicitly justified follow-up work.
- Before implementation work begins, the proposed task list gets a final consistency check against the source-of-truth docs and against itself.
- The final task inventory explicitly includes the three mandatory UX fixes listed above.
- The source-of-truth docs, final documentation consistency check, full product audit, and validated task inventory are treated as gates within this feature before implementation of mandatory fixes starts.
- The validated mandatory fixes are implemented in this same feature request after those gates pass and after dependency gates are satisfied.
- The automatic post-answer reveal behavior is specified only for learning/support modes, not active exam simulation.
- The previous/next navigation behavior defines where controls appear, how boundaries work, and how state is preserved when navigating.
- The image explanation overlay behavior depends on feature `009` metadata and does not create a competing metadata source.
- Overlay emphasis/dimming depends on feature `009` per-question image usage/relevance for the concrete image-backed question, not on global important/unimportant flags in shared image metadata.
- If an image is not used by a question, `010` does not need to define overlay importance/relevance for it.
- If feature `009` is not yet implemented and merged into `main` when this feature is planned or partly implemented, image overlay implementation is blocked or sliced behind an explicit dependency rather than faked.
- `010` may use the `009` spec as a contract while waiting, but may consume `009` implementation artifacts only after `009` is fully completed and merged into `main`.
- Overlay/dimming data is stored durably with clear ownership, provenance, and stale-data validation tied to image metadata/image hash/question ID.
- Review requirements include checking the source-of-truth docs, audit evidence, task consistency, and the three mandatory UX fixes.
- Verification evidence includes local documentation checks, product audit evidence, tests or review evidence for changed UI behavior, and preflight commands once implementation starts.

## Assumptions

- No further Q&A is needed before architecture: the user gave a clear process, mandatory fixes, and the dependent feature to find.
- "Современные актуальные UI/UX практики" means stable, currently accepted product-design, accessibility, and usability guidance, not a transient visual trend.
- "Учебные материалы" includes question cards, explanations, topic materials, vocabulary, guide content, and image-backed learning support.
- "Статьи разработчиков таких сервисов, как Дуолингуо" can be satisfied with official Duolingo product/design/engineering/research writing; the feature may add other learning-product references later if Architect finds them useful.
- The output source-of-truth docs should be durable project docs, not temporary notes in a spec folder only.
- The requested "сплошной анализ продукта" is Architect/Implementation work inside `010`; Analyst records it as a requirement but does not create the task list in this artifact.
- Source-of-truth creation, consistency checks, product audit, and task inventory validation are prerequisite gates inside `010`, not a substitute for implementing the validated mandatory fixes.
- The mandatory post-answer reveal should apply to learning and mistake review, because exam mode is intentionally unsupported during active attempts.
- The image overlay requirement should be designed around feature `009`'s structured shared image metadata plus per-question image usage/relevance roles.
- Importance and irrelevance are not intrinsic properties of a shared image region; they must be evaluated in the context of the specific question, answer choices, correct answer, and explanation.
- The image overlay implementation must wait for feature `009` to be fully completed and merged into `main`; before that, `010` can only rely on the `009` spec as a contract and work on independent slices.
- Feature `008` may already have added topic materials UI in another worktree. This feature must reconcile with it rather than overwrite or ignore it.

## Risks

- The request is broad and can become a redesign program rather than a focused feature unless Architect slices it carefully.
- The task inventory may be too large for one PR if every UI gap is implemented immediately; mandatory fixes still remain in-scope for `010`, while non-mandatory audit findings may need explicit follow-up disposition.
- Generic UX guidance can conflict with exam-prep behavior if not translated into Cabadrive-specific rules.
- Duolingo-style engagement mechanics can be misapplied; Cabadrive should not prioritize streaks, rewards, or DAU-style retention over exam readiness and content trust.
- Accessibility rules may expose current layout/control issues beyond the three mandatory fixes.
- Automatic explanation reveal after answer changes existing behavior and tests that currently expect hidden support until toggled.
- Bottom navigation needs careful state rules so learners do not lose selected answers, progress history, or search position.
- Image overlays depend on accurate metadata from `009`; if metadata is incomplete or wrong, overlays could teach the wrong visual cue.
- Overlay definitions can become stale when image files, hashes, question wording, or answer-critical metadata changes.
- Implementing overlays before `009` is merged would risk coupling `010` to unstable work, so overlay delivery may require a pause/rebase after independent `010` slices are complete.
- Feature `008` and `009` are parallel and may land before, after, or alongside this feature, so Architect must plan merge/rebase and dependency handling.

## Open Questions For Architect

- What exact durable doc set should become the UI/UX source of truth, and where should it live under `docs_project/`?
- Should the source-of-truth docs be one consolidated document or separate documents for general UX, learning design, accessibility, and visual explanation behavior?
- What evidence format should the final documentation consistency check use?
- What evidence format should the full product audit use so future reviewers can trace every task back to a source-of-truth point?
- Should the task inventory live only in `specs/010.../tasks.md`, or should durable docs also hold a longer-term UX backlog?
- How should this feature coordinate with `008` if the topic materials UI has already changed navigation and learning surfaces?
- What is the exact dependency contract with `009` for answer-critical image regions, overlays, image hashes, and question-specific critical details?
- Should image dimming be represented as vector overlay regions, CSS masks, metadata coordinates, pre-rendered assets, or another format?
- Where should overlay definitions be stored so they are "near" explanations while still remaining validated and maintainable?
- What fallback should the UI show if an image-backed explanation exists but `009` metadata or overlay data is missing?
- Should automatic translation reveal after answering reveal question translation, answer translations, or both?
- Should explanation reveal after answering always expand full text, or show a compact summary with the full explanation one tap away?
- Should previous/next navigation be linear across current search results, the full question bank, mistakes only, or mode-specific collections?
- Should previous/next preserve prior selected answers visually when revisiting a question, or reset to a fresh attempt?
- How should the product balance fast answer flow with enough post-answer explanation to prevent memorizing wrong visual/Spanish cues?

## Handoff Expectation

Orchestrator should hand this feature folder to Architect next. Architect should create or update `spec.md`, `plan.md`, and `tasks.md` before any Implementation Agent changes durable docs, product code, tests, content files, image overlay assets, or validation scripts.

Architect should treat source-of-truth docs, documentation consistency check, product audit, and validated task inventory as required gates within `010`, then plan implementation of the validated mandatory fixes in the same feature request. Implementation should proceed on independent slices while `009` is incomplete, and should start overlay/dimming implementation only after `009` is fully completed and merged into `main`.
