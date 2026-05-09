# Feature Request: Image Metadata And Learning Support Completion

## Analyst Artifact Status

This is the Analyst intake artifact for a repository-changing request. Per the Cabadrive role boundary, this artifact records the request, project context, evidence, assumptions, risks, open questions, and acceptance expectations only. It intentionally does not include a technical solution, implementation plan, task breakdown, code changes, product-content edits, reviews, commits, or PR state.

## Original User Request

The user asked in Russian, while explicitly assigning the Analyst role and noting that other agents are working in parallel:

> ты аналитик, праллельно с тобой работают другие агенты, создай для себя отдельное окружение и работай в нем
> задача, оставаясь строго в роли аналитика сделай работу
>
> баг - в попросе ¿Qué indica esta seña? ошибка в Учебное пояснение
> На изображении показан жест рукой для поворота направо: водитель вытягивает левую руку и сгибает ее вверх, показывая направление маневра.
> на самом деле там прямая вытянутая праввая рука
> в раках бага нужно не просто его исправить, а сделать следующую работу
> 1 По каждой картинке подготвить метаописание, такое, чтоб если скормить его нейросети, то она нарисуют точно такую же или очень близкую к оргиналу картинку. Описание должно быть не просто текст, а ждесон стркутура, в которой перечислены все объекты, детали и их состояние, например для катинки из примера - что это город, 4-полосная догрога, сзади 2 пешеходных перехода с зеброй, на переднем плане велосепедист лицом к зрителю в шлеме, который показывает вытянутой правй рукой направо. Все это должно быть структурировано в джейсон единоо формата для всех картинок
> 2 В джейсоне детали, которые важны для билета, должны быть помечены соответствующим образом, в данном случае важно, что это велосипедист, и его жест
> 3 На основе этих метаоописаний по кадому билету провести валидацию пояснений, если оно не соответствует избражению, как в примере - исправить
> 3 Для многих вопросв нет пояснений, проверить и подготовить для всех
> 4 Для многих вопросов нет переводов, проверить и подготовить для всех

Translated intent:

- There is a concrete defect in the learning explanation for the question `¿Qué indica esta seña?`: the current Russian explanation says the image shows a driver extending the left arm and bending it upward for a right turn, but the image actually shows a straight extended right arm.
- The defect should not be fixed in isolation. The feature should introduce structured JSON image metadata for every question image.
- The image metadata must be detailed enough that an image-generation model could recreate the original or a very close image.
- The metadata must use one consistent JSON format for all images and enumerate objects, details, states, scene context, and relevant visual facts.
- The metadata must mark details that are important for the ticket answer. In the example, the important details are that the subject is a cyclist and the cyclist's gesture.
- Explanations must be validated against the image metadata for every ticket. If an explanation conflicts with the image, it must be corrected.
- Missing explanations must be identified and prepared for all questions.
- Missing translations must be identified and prepared for all questions.

The user later instructed that the final response for this turn should contain only the branch name.

## Environment And Prefix Decision

The Analyst work was performed in an isolated worktree:

```text
/Users/chap/devel/cabadrive-009-ticket-image-metadata-intake
```

Branch:

```text
codex/009-ticket-image-metadata-intake
```

The current checkout in `/Users/chap/devel/cabadrive` already contained an empty `specs/007-agent-workflow-autonomy/` directory, and another parallel worktree already had branch `codex/008-learning-materials-intake` with an untracked `specs/008-learning-materials-ui/` folder. To avoid colliding with parallel intake work, this request uses feature folder:

```text
specs/009-image-metadata-learning-support/
```

## Scope Split Decision

This request combines four closely related content-integrity goals:

- create image metadata;
- use that metadata to validate image-backed explanations;
- fill missing Russian explanations;
- fill missing Russian translations.

These should remain one feature at intake time because they all protect the same learner-facing support surface: unofficial Russian learning aids must not contradict the Spanish question, the answer choices, or the image shown on the ticket. Architect should still decompose implementation into small PR-sized slices because the content volume is large.

No separate feature folder is recommended at intake time.

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
- `docs/specify/04_data_model.md`
- `specs/005-translation-validation-toggle/feature-request.md`
- `specs/005-translation-validation-toggle/spec.md`
- `specs/006-topic-study-guide/feature-request.md`
- `specs/006-topic-study-guide/spec.md`

Relevant local files inspected for evidence only:

- `content/questions/caba-b.unofficial-fallback.questions.json`
- `content/assets/questions/source-bandinopla-testdeconducir-b/b13.jpg`
- `content/translations/ru.translations.json`
- `content/validation/ru-translation-alignment.evidence.json`
- `content/explanations/ru.explanations.json`
- `content/guide/topic-study-guide.ru.json`
- `content/guide/topic-study-guide.coverage.json`
- `scripts/validate-content.mjs`
- `scripts/content-translation-alignment.mjs`
- `tests/content-validation.test.mjs`
- `tests/content-translation-alignment.test.mjs`

Relevant project constraints:

- Cabadrive is a local-first React/Vite trainer for Russian-speaking drivers preparing for the CABA theory exam.
- The current MVP has no backend; validation is repository tooling and CI/local preflight, not a runtime service.
- Official Spanish text remains primary.
- Russian translations, explanations, guide content, and visual metadata are unofficial learning support and must not imply official GCBA question-bank coverage.
- Current content mode is `unofficial_b_fallback`, sourced from the non-official `bandinopla/simulador-test-de-conducir` category B/CABA fallback set.
- Question images are stored locally under `content/assets/questions/source-bandinopla-testdeconducir-b/` and are part of the offline learning surface.
- Existing translation validation already uses deterministic local alignment evidence for the currently translated subset; this feature should build on that concept rather than introducing nondeterministic runtime validation.

## Current Repository Evidence

Current content counts observed in the isolated worktree:

- `content/questions/caba-b.unofficial-fallback.questions.json` contains 460 questions.
- 276 question records contain an `image` reference.
- Those 276 image references point to 275 distinct local image paths.
- The duplicate image path is `content/assets/questions/source-bandinopla-testdeconducir-b/b2.jpg`, used by `b-fallback-256` and `b-fallback-303`.
- `content/translations/ru.translations.json` contains 10 Russian translation entries.
- `content/explanations/ru.explanations.json` contains 5 Russian explanation entries.
- `content/guide/topic-study-guide.coverage.json` has assignments for 460 questions, and `content/guide/topic-study-guide.ru.json` has guide-specific answer explanations, but that guide content is separate from the question-card translation/explanation layers named in this request.

Current validation behavior:

- `scripts/validate-content.mjs` checks that image paths are local, files exist, and image hashes match.
- `scripts/content-translation-alignment.mjs` validates structure and approved deterministic evidence for translation entries that already exist.
- Existing translation validation does not require translation coverage for all 460 questions.
- Existing explanation validation checks references, disclaimer wording, and source IDs for explanation entries that already exist.
- Existing explanation validation does not require explanation coverage for all 460 questions.
- Existing explanation validation does not compare explanation claims against the actual question image or any structured image metadata.
- Existing tests assert that there are exactly 5 explanation entries and only apply a length/topic-wording heuristic to those 5 entries.

## Concrete Bug Evidence

Question `b-fallback-001`:

- Spanish question: `¿Qué indica esta seña?`
- Answer options:
  - `b-fallback-001-a1`: `Adelantamiento por la derecha.`
  - `b-fallback-001-a2`: `Giro a la derecha.`
  - `b-fallback-001-a3`: `Detenerse.`
- Correct answer: `b-fallback-001-a2`
- Image path: `content/assets/questions/source-bandinopla-testdeconducir-b/b13.jpg`
- Image hash in question data: `aae6435fd73747197db844c9cfc7f520b94efb5095e33f043b84d5dc15e7f2b7`

The current explanation says:

```text
На изображении показан жест рукой для поворота направо: водитель вытягивает левую руку и сгибает ее вверх, показывая направление маневра.
```

Visual inspection of `b13.jpg` confirms the user report:

- It is a real street photo in an urban setting.
- The foreground subject is a cyclist riding a bicycle, facing roughly toward the viewer.
- The cyclist wears a helmet, white T-shirt, and shorts.
- The cyclist's right arm is extended straight and horizontally to the cyclist's right side, which appears on the viewer's left side of the image.
- A red oval annotation highlights the extended arm.
- The gesture is not a bent-up left arm.

This means the current Russian explanation contains an image-specific factual error. The correct answer may still be `Giro a la derecha`, but the visual rationale must describe the actual gesture shown.

## Problem Statement

The app already treats Russian translations and explanations as unofficial learning aids, but learners can still rely on them to understand image-based questions. If an explanation describes visual facts that are not present in the image, the learner may memorize the wrong signal or misunderstand the answer even when the Spanish answer choice is correct.

The current data model has local image files and hashes, but it lacks a machine-readable semantic description of the image. As a result, validation can prove that an image file exists, but cannot detect that an explanation says "left arm bent upward" while the image shows a cyclist's right arm extended straight.

The translation and explanation coverage is also incomplete relative to the user's desired learning experience: only 10 of 460 questions have entries in the main Russian translation layer, and only 5 of 460 have entries in the main Russian explanation layer.

## Desired Product Outcome

Every question image should have structured, reviewable JSON metadata that describes the visible scene, objects, actors, road environment, markings, signs, gestures, vehicle states, camera/framing, and any other relevant details. The metadata should be detailed enough to serve as a high-quality prompt for recreating a close visual match with an image-generation model.

For each image-backed ticket, the metadata must identify which visual details matter for answering that ticket. Those important details should be linked to the relevant question and, where appropriate, to the correct answer or a common wrong-answer trap.

Russian explanations should be validated against those image descriptions. If an explanation references visual details that are absent, contradicted, or attached to the wrong object, validation should fail or the content should be corrected before publication.

Every current question should have Russian learning support coverage:

- Russian question translation;
- Russian answer-choice translations;
- Russian explanation of why the correct answer is correct;
- where useful, explanation of why wrong answers are wrong;
- image-aware explanation when the question includes an image.

The outcome should stay compatible with local-first/offline validation and should not introduce a backend or live network/LLM dependency into runtime, tests, build, preflight, or CI.

## Acceptance Expectations For Architect

Architect should convert these into formal acceptance criteria and verification requirements:

- A new structured JSON image metadata layer exists for the current image-backed question set.
- The metadata uses one consistent schema across all image entries.
- Every current question image reference is covered by metadata, either directly per question-image pair or by a shared unique-image entry plus question-specific critical-detail mapping.
- The metadata is tied to the image path and image hash so stale metadata is detected when an image changes.
- The metadata enumerates scene context, road layout, lanes, markings, visible signs/signals, vehicles, road users, gestures, object positions, object states, annotations, and relevant visual relationships where present.
- The metadata includes enough detail to recreate a close visual approximation of the original image with an image-generation model.
- The metadata marks details that are important for answering each ticket.
- Critical details can be linked to a question ID and, where relevant, the correct answer ID or wrong-answer trap.
- `b-fallback-001` image metadata explicitly records that the subject is a cyclist, not merely a generic driver, and that the cyclist's right arm is extended straight/horizontally to the cyclist's right side.
- `b-fallback-001` metadata marks the cyclist and the right-arm gesture as answer-critical.
- The `b-fallback-001` Russian explanation is corrected so it no longer says the driver extends the left arm and bends it upward.
- The corrected `b-fallback-001` explanation describes the actual right-arm straight extension and keeps the correct answer `Giro a la derecha`.
- Explanation validation includes a regression fixture or equivalent evidence proving that the current wrong `b-fallback-001` explanation would fail.
- Explanation validation fails when an image-backed explanation asserts a critical visual detail that contradicts the image metadata.
- Explanation validation fails when an image-backed question has no metadata or no answer-critical visual detail.
- All 460 current questions have Russian question translations and answer-choice translations.
- Translation validation covers all 460 current questions, not only the currently translated subset.
- Translation validation remains deterministic and offline, preferably with explicit local review evidence/fingerprints similar to the existing translation alignment model.
- All 460 current questions have Russian explanations.
- Explanation validation covers all 460 current questions, not only existing explanation entries.
- Explanations explain why the correct answer is correct and, where the answer choices make it useful, why incorrect answers are incorrect.
- Explanations for image-backed questions are consistent with the image metadata.
- Explanations that include legal, rule, procedure, numeric, traffic-sign, or licensing claims beyond direct ticket wording are traceable to appropriate current official sources or are kept ticket-specific and explicitly cautious.
- Existing topic-guide answer explanations are either reused, synchronized, or intentionally kept separate from the main question-card explanation layer by an Architect decision.
- Durable docs are updated if new content files, metadata schemas, validation gates, or learning-support coverage rules are introduced.
- Local verification evidence includes content validation, unit tests for metadata/explanation validation, translation alignment coverage, and preflight.

## Clarified Assumptions

- No further Q&A is required before architecture: the bug example is concrete, the expected image metadata outcome is clear, and unresolved implementation choices can be handled by Architect.
- "Every image" means every local image referenced by the current question bank. Because one local image is reused by two question records, Architect should decide whether the canonical metadata is per unique image or per question-image pair.
- "Every ticket" means the current 460 records in `content/questions/caba-b.unofficial-fallback.questions.json`.
- Questions without images still need Russian translations and explanations, but they do not need image metadata.
- If the same image supports multiple questions, the visible-scene metadata may be shared, but the answer-critical detail mapping may need to be question-specific.
- The request does not ask to generate or replace source images.
- The request does not ask to replace the fallback question bank or change content availability mode.
- The request does not ask to make Russian text official or primary over Spanish source text.
- The detailed image metadata is a learning/validation support artifact, not an official description of the exam image.
- AI assistance may be useful for drafting image descriptions, translations, or explanations, but final committed validation should rely on deterministic local evidence and reviewable content, not live AI calls.
- The existing translation-alignment evidence model is relevant precedent but may need to expand from 10 entries to complete coverage.
- The existing topic guide has many guide-specific ticket explanations, but the user appears to be asking about the main question-card translation/explanation coverage. Architect should confirm or decide how these layers should relate.

## External Research

No live external internet research was used for this intake. The request is grounded in a concrete local content defect and local repository evidence. Existing official-document archives were searched locally for context, but the intake did not attempt to revalidate current law/manual status.

Architect should require current official-source verification during implementation when explanations make rule, legal, procedure, traffic-sign, licensing, or numeric claims beyond directly restating the ticket and image content.

## Risks

- The content volume is large: 275 distinct image descriptions, 276 image references, 460 question translations, 460 answer-translation sets, and 460 explanations.
- A single implementation PR attempting all content and validation would be too large to review reliably.
- Image metadata can become subjective or inconsistent unless the schema constrains objects, states, relationships, critical details, and uncertainty.
- Validation can easily prove only that metadata exists, not that it is visually true. The feature needs review evidence or another durable quality-control mechanism.
- If image metadata is generated by an AI model and not reviewed, hallucinated objects or wrong gestures could become trusted validation data.
- Some source images may be low-resolution, cropped, annotated, or visually ambiguous; metadata may need an uncertainty field rather than forced precision.
- Explanation validation against metadata may create false positives if explanations use natural language that does not map cleanly to structured detail fields.
- Explanation validation may create false confidence if it only checks keyword overlap.
- Filling all translations and explanations can duplicate or diverge from existing topic-guide explanations unless Architect defines a source-of-truth relationship.
- Expanded explanation coverage can drift into a broad legal/driving-school manual unless kept exam-focused.
- Official traffic rules and GCBA materials can change; source-backed claims need currentness checks at implementation time.
- The current question set is an unofficial fallback set. Full learning-support coverage must not imply official or complete GCBA category B bank coverage.
- The image descriptions are detailed enough to recreate images; this may raise source-attribution and licensing-review concerns that Architect should consider in docs and metadata provenance.
- Metadata tied only to image hash may become stale if question wording or answer choices change; answer-critical mappings likely need question/answer fingerprints too.

## Open Questions For Architect

- Should image metadata be one entry per unique image path, one entry per question-image pair, or a shared image entry plus question-specific critical-detail annotations?
- What exact JSON schema should represent scene context, objects, road layout, road users, gestures, signs, markings, annotations, object states, spatial relationships, and uncertainty?
- How should the schema mark answer-critical details: boolean flags, `criticalForQuestionIds`, links to answer IDs, trap IDs, or another structure?
- Should critical details be required for every image-backed question, or only for images where the correct answer depends on a visual element?
- How should metadata handle duplicated images used by multiple questions with different answer-critical interpretations?
- How should metadata capture visible annotations such as the red oval on `b13.jpg`?
- What level of detail is required for "can recreate a close image" without making the metadata unreviewably verbose?
- How should ambiguous or low-quality images be represented without inventing details?
- Should the new metadata live under `content/images/`, `content/questions/`, `content/validation/`, or another path?
- Should generated image metadata have its own review evidence file with reviewer, reviewed date, image hash, and question/answer fingerprints?
- Should explanation validation be deterministic schema/fingerprint validation, rule-based contradiction checks, human review evidence, or a combination?
- How should validation prove that the old `b-fallback-001` left-arm/bent-arm explanation fails?
- Should the main `content/explanations/ru.explanations.json` become the complete 460-question explanation layer, or should complete explanations be sourced from `content/guide/topic-study-guide.ru.json` and exported/synchronized?
- Should all explanations include wrong-answer explanations, or only questions where the wrong answers are plausible traps?
- What official-source trace is required for explanations that are mostly image recognition versus explanations that generalize a traffic rule?
- Should translation coverage for all 460 questions be completed in this feature, or split into independently reviewable slices under the same feature memory?
- How should complete translation evidence be generated and reviewed without relying on live network or LLM validation in CI?
- How should implementation slices be partitioned so parallel agents can work without conflicting on one huge JSON file?
- Should docs clarify that detailed image metadata is unofficial learning/validation support, not an official visual catalog?

## Handoff Expectation

Orchestrator should hand this feature folder to Architect next. Architect should create `spec.md`, `plan.md`, and `tasks.md` before any Implementation Agent changes product code, content files, validation scripts, tests, durable docs, image metadata, translations, or explanations.
