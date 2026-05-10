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

## User Clarification / Intake Update: Agent-Based Full Content Completion

The user later clarified, while again emphasizing parallel work and role boundaries, that the image-analysis portion must be treated as a one-time content-production operation performed by agents that actually inspect the local image files.

Clarified intent:

- Image metadata must be produced from real visual analysis of the local question images by agents.
- This is a one-time repository content task, not a permanent runtime service.
- The expected execution model is to run a batch of agents in parallel over the image set so each assigned image range is visually inspected and described.
- Image metadata must not be replaced by generation from ticket text, answer keys, topic-guide rationales, deterministic placeholders, baseline records, generic answer cues, or inferred metadata that does not come from looking at the image.
- The feature is not an MVP or partial scaffold. Completion means all current tickets, all current text support, and all current images are fully handled.
- All Russian translations must be complete and high quality across the full current question set.
- All Russian explanations must be complete and high quality across the full current question set.
- All image metadata must be complete and high quality across the full current image set.
- Image analysis must be detailed enough to support the originally requested recreation-quality metadata and ticket-critical visual validation.

This clarification supersedes any interpretation that placeholder image metadata, low-confidence baseline coverage, generic source-image descriptions, or draft/wrapped translations could satisfy the feature.

## User Clarification / Intake Update: Agent-Based Translation, Explanation, And Ticket Lifecycle Flow

The user further clarified that the same one-time agent-based content standard applies to Russian translations and Russian explanations, not only to image metadata.

Clarified intent:

- Russian translations must be produced or reviewed by assigned content agents as a one-time full-content completion task.
- Russian explanations must be produced or reviewed by assigned content agents as a one-time full-content completion task.
- Translation and explanation coverage must not be satisfied by a generator, template, glossary wrapper, transliteration pass, semi-automatic placeholder, or other mechanical fallback.
- The parallel content-agent batch should cover all three artifact families at full quality: image metadata, Russian translations, and Russian explanations.
- Content agents may work in parallel by assigned ranges, but each range must meet the same completion bar for every ticket, every answer choice, every explanation, and every image/usage in scope.
- Architect should hand off to Implementation Agents with explicit range ownership and isolated worktree expectations because other orchestrators and agents are working in parallel.
- Durable project documentation must describe the lifecycle for adding, changing, and deleting tickets.
- When a ticket is added or materially changed, the documented lifecycle must require the relevant analysis/review workflows before the change can be considered complete: image metadata if an image exists, Russian translations, Russian explanations, quality evidence, and consistency validation.
- When a ticket is deleted, the documented lifecycle must require deleting or updating related artifacts such as translation entries, explanation entries, evidence records, question-image usage mappings, and validation records.
- Shared image metadata must be deleted only when no remaining ticket uses that image; otherwise only the deleted ticket's usage or critical-detail mapping should be removed.

This clarification supersedes any interpretation that translation or explanation completion can be treated as generator output with a validation wrapper. The requested outcome is complete, high-quality, agent-reviewed content for the whole current ticket set plus documented maintenance rules for future ticket changes.

## User Clarification / Intake Update: Branch 010 Image Overlay Dependency

The user added context from parallel branch `codex/010-ui-ux-learning-intake`: feature `010` is expected to use feature `009` image descriptions as the semantic source for image explanation overlays.

Clarified intent:

- Analyst should inspect branch `010` read-only as an example of how image descriptions will be consumed.
- Image metadata must contain enough information not only for description/recreation and explanation validation, but also for downstream learning UI behavior.
- The downstream UI should be able to highlight important image details and dim or de-emphasize irrelevant details/background while an explanation is shown.
- Important details include signs, traffic lights, markings, gestures, road users, vehicles, objects, annotations, and other visual facts when they affect the answer.
- Importance is question-specific. The same visible sign, marking, object, or background element may be answer-critical in one ticket, supporting context in another, a distractor in another, or irrelevant background in another.
- Shared image metadata should describe visible objects/details/relationships independently of any one question.
- Per-question image usage should identify the relevance of those visible details for that specific ticket, including answer-critical, supporting, distractor, and background/irrelevant details where applicable.
- Architect should ensure the metadata/usage schema and validation support these question-specific highlight/dim relevance semantics without creating a competing UI-only source of truth.

Read-only branch `010` context inspected:

- `docs_project/project/frontend/image-explanation-overlays.md` states that feature `009` owns image semantics, answer-critical details, question usage mappings, fingerprints, and stale-data evidence, while feature `010` owns presentation geometry, dimming, spotlight, outline, callout, label placement, and rendering rules.
- The same overlay document says the UI must not invent highlights when approved `009` metadata or usage mapping is missing, stale, or incomplete; the fallback is a normal local image plus truthful explanation text.
- `specs/010-ui-ux-learning-source-of-truth/spec.md` requires image-backed explanations to signal important visual details, reduce irrelevant visual load, keep labels near referenced regions, and consume `009` metadata/usage mappings rather than defining a competing source for answer-critical details.
- `specs/010-ui-ux-learning-source-of-truth/feature-request.md` records the current UI gap: `QuestionCard` renders a static local image and explanation text, with no overlay, dimming, or answer-critical visual highlighting.
- `src/App.tsx` in branch `010` confirms the current product surface renders the image as a normal `<img>` and renders explanation text separately; no image-level relevance data is available there yet.

This clarification supersedes any interpretation that a simple "critical detail" boolean alone is sufficient if it cannot distinguish question-specific answer-critical, supporting, distractor, and background relevance for future highlight/dim behavior.

## User Clarification / Intake Update: Question-Scoped Image Relevance

The user further clarified the boundary between shared image semantics and question-specific importance/relevance:

- Importance and unimportance of an image area must be evaluated only in the context of the specific question where that image is used.
- Shared image metadata may describe visible objects, details, relationships, regions, annotations, and uncertainty, but it must not assign global "important" or "unimportant" meaning to those details independently of a question.
- Question-specific image usage owns the relevance role for a visible detail in a concrete ticket: answer-critical, supporting, distractor/trap, background/irrelevant, or another Architect-defined role.
- The same shared visible detail can be important in one question, irrelevant in another, and a distractor in a third, depending on the question wording, answer choices, correct answer, and explanation.
- If an image is not used by a question, this feature should not evaluate importance/relevance for its details. The original "every image" scope means every local image referenced by the current question bank, not arbitrary repository images.

This clarification supersedes any interpretation that shared image metadata may contain global important/unimportant flags or that non-question images need importance/relevance evaluation.

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
- branch `codex/010-ui-ux-learning-intake`, read-only:
  - `docs_project/project/frontend/image-explanation-overlays.md`
  - `docs_project/project/frontend/ui-ux-source-of-truth.md`
  - `specs/010-ui-ux-learning-source-of-truth/feature-request.md`
  - `specs/010-ui-ux-learning-source-of-truth/spec.md`
  - `src/App.tsx`

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

Every question-referenced image should have structured, reviewable JSON metadata that describes the visible scene, objects, actors, road environment, markings, signs, gestures, vehicle states, camera/framing, and visible details. The metadata should be detailed enough to serve as a high-quality prompt for recreating a close visual match with an image-generation model.

For each image-backed ticket, the question-specific image usage must identify which shared visible details matter for answering that ticket. Those relevant details should be linked to the specific question and, where appropriate, to the correct answer or a common wrong-answer trap.

The metadata and question-specific image usage should also support future explanation-time UI signaling. Shared image metadata should describe what is visibly present. Per-question usage should classify how those visible details function for the current ticket, such as answer-critical cue, supporting context, distractor/trap cue, or irrelevant/background detail that may be dimmed when explaining the answer.

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
- The metadata for every image is based on direct inspection of the local image file by an assigned image-analysis agent, with reviewable evidence that the image was inspected.
- Metadata inferred only from question text, answer keys, topic-guide rationales, filenames, hashes, placeholder templates, generic answer cues, or deterministic baseline generators is rejected.
- Placeholder metadata, `source image` generic cues, low-confidence baseline descriptions, and records that say precise visual details are still uncertain cannot be marked complete or approved.
- Architect should require a parallel-agent content workflow for the one-time image analysis, while preserving deterministic local validation for committed artifacts.
- Shared image metadata does not mark details as globally important or unimportant.
- Question-specific image usage marks details that are important, supporting, distracting, or irrelevant for answering each concrete ticket.
- Critical details can be linked to a question ID and, where relevant, the correct answer ID or wrong-answer trap.
- Shared image metadata describes visible scene/object/detail facts independently from any one question's answer logic.
- Per-question image usage maps shared visible details to relevance for that specific ticket, including answer-critical, supporting, distractor/trap, and background/irrelevant roles where applicable.
- The same shared visible detail can have different relevance roles in different tickets without duplicating or corrupting the shared image description.
- Images not referenced by any current question do not need image metadata or importance/relevance evaluation for this feature.
- The metadata/usage contract provides enough semantic structure for downstream feature `010` to highlight important details and dim irrelevant/background details during explanation-time UI, while leaving presentation geometry/rendering decisions to `010`.
- Validation or review evidence rejects image-backed question usage that lacks enough question-specific relevance information to support explanation validation and future highlight/dim behavior.
- `b-fallback-001` image metadata explicitly records that the subject is a cyclist, not merely a generic driver, and that the cyclist's right arm is extended straight/horizontally to the cyclist's right side.
- `b-fallback-001` question-specific image usage marks the cyclist and the right-arm gesture as answer-critical for that question.
- The `b-fallback-001` Russian explanation is corrected so it no longer says the driver extends the left arm and bends it upward.
- The corrected `b-fallback-001` explanation describes the actual right-arm straight extension and keeps the correct answer `Giro a la derecha`.
- Explanation validation includes a regression fixture or equivalent evidence proving that the current wrong `b-fallback-001` explanation would fail.
- Explanation validation fails when an image-backed explanation asserts a critical visual detail that contradicts the image metadata.
- Explanation validation fails when an image-backed question has no metadata or no answer-critical visual detail.
- All 460 current questions have Russian question translations and answer-choice translations.
- Translation validation covers all 460 current questions, not only the currently translated subset.
- Translation validation remains deterministic and offline, preferably with explicit local review evidence/fingerprints similar to the existing translation alignment model.
- Draft translations, glossary wrappers, partially Spanish text, untranslated answer choices, or machine-looking placeholders cannot count as translation coverage.
- Russian translations are completed or reviewed by assigned content agents as a one-time full-content operation; generator-only, template-only, glossary-only, transliteration-only, or semi-automatic placeholder output cannot count as done.
- Translation quality expectations apply to every ticket and every answer choice, not only to examples or sampled items.
- All 460 current questions have Russian explanations.
- Explanation validation covers all 460 current questions, not only existing explanation entries.
- Explanations explain why the correct answer is correct and, where the answer choices make it useful, why incorrect answers are incorrect.
- Explanations for image-backed questions are consistent with the image metadata.
- Draft explanations, filler rationales, copied topic labels, generic answer cues, or explanations that have not been checked against ticket text and image metadata cannot count as explanation coverage.
- Russian explanations are completed or reviewed by assigned content agents as a one-time full-content operation; generator-only, template-only, copied-guide-only, or filler output cannot count as done.
- Explanation quality expectations apply to every ticket, not only to image-backed questions or known failing examples.
- Explanations that include legal, rule, procedure, numeric, traffic-sign, or licensing claims beyond direct ticket wording are traceable to appropriate current official sources or are kept ticket-specific and explicitly cautious.
- Existing topic-guide answer explanations are either reused, synchronized, or intentionally kept separate from the main question-card explanation layer by an Architect decision.
- Durable docs are updated if new content files, metadata schemas, validation gates, or learning-support coverage rules are introduced.
- Durable docs are updated with a ticket lifecycle flow for adding, changing, and deleting tickets, including required image-metadata, translation, explanation, evidence, usage, and cleanup rules.
- The ticket lifecycle flow requires added or materially changed tickets to pass the relevant content-agent analysis/review workflows before merge.
- The ticket lifecycle flow requires deleted tickets to remove or update related translations, explanations, evidence, validation records, and question-image usages; shared image metadata is retained until no remaining ticket uses the image.
- Local verification evidence includes content validation, unit tests for metadata/explanation validation, translation alignment coverage, and preflight.

## Clarified Assumptions

- No further Q&A is required before architecture: the bug example is concrete, the expected image metadata outcome is clear, and unresolved implementation choices can be handled by Architect.
- "Every image" means every local image referenced by the current question bank. Because one local image is reused by two question records, Architect should decide whether the canonical metadata is per unique image or per question-image pair.
- "Every ticket" means the current 460 records in `content/questions/caba-b.unofficial-fallback.questions.json`.
- Questions without images still need Russian translations and explanations, but they do not need image metadata.
- Images that are not referenced by any current question are outside the image-metadata and importance/relevance evaluation scope of this request.
- If the same image supports multiple questions, the visible-scene metadata may be shared, but the answer-critical detail mapping may need to be question-specific.
- Branch `010` is dependency context for this intake only. It does not change the feature `009` role boundary: `009` should own image semantics and question-specific relevance, while `010` should own overlay presentation and rendering after consuming completed `009` metadata.
- A visible detail's relevance is not intrinsic to the image alone. Relevance must be evaluated against the specific question, answer choices, correct answer, and explanation.
- Future highlight/dim behavior can be supported by semantic detail references and relevance roles in `009`; exact overlay geometry, masks, CSS treatment, and label placement can remain `010` concerns unless Architect decides some minimal region identifier is necessary for a stable contract.
- The request does not ask to generate or replace source images.
- The image-analysis work is a one-time content completion effort carried out before merge by assigned agents inspecting local files, not an ongoing app feature.
- Agent-based image analysis may be parallelized by image or question ranges, but each range still needs the same full-quality acceptance standard.
- Parallel agents should be told to work only in their assigned isolated worktree/range to avoid conflicts with other orchestrators and agents.
- Any automated helper may organize, shard, validate, or load content, but it may not stand in for direct visual inspection of the images.
- The request does not ask to replace the fallback question bank or change content availability mode.
- The request does not ask to make Russian text official or primary over Spanish source text.
- The detailed image metadata is a learning/validation support artifact, not an official description of the exam image.
- AI assistance may be useful for drafting image descriptions, translations, or explanations, but final committed validation should rely on deterministic local evidence and reviewable content, not live AI calls.
- AI assistance for image metadata is acceptable only when the assigned agent actually views the local image and records visually grounded metadata; text-only inference is out of scope.
- AI assistance for translations and explanations is acceptable only as assigned content-agent work with full-ticket review and quality responsibility, not as unattended generator output.
- Translation, explanation, and image-metadata agents may be parallelized by ticket or artifact ranges, but the feature should still be treated as one complete content-quality outcome.
- The existing translation-alignment evidence model is relevant precedent but may need to expand from 10 entries to complete coverage.
- The existing topic guide has many guide-specific ticket explanations, but the user appears to be asking about the main question-card translation/explanation coverage. Architect should confirm or decide how these layers should relate.
- Durable docs are part of this feature's expected output if they are the right place to record future ticket add/change/delete workflow; Analyst is intentionally not choosing the exact docs path.

## External Research

No live external internet research was used for this intake. The request is grounded in a concrete local content defect and local repository evidence. Existing official-document archives were searched locally for context, but the intake did not attempt to revalidate current law/manual status.

Architect should require current official-source verification during implementation when explanations make rule, legal, procedure, traffic-sign, licensing, or numeric claims beyond directly restating the ticket and image content.

## Risks

- The content volume is large: 275 distinct image descriptions, 276 image references, 460 question translations, 460 answer-translation sets, and 460 explanations.
- A single implementation PR attempting all content and validation would be too large to review reliably.
- Image metadata can become subjective or inconsistent unless the schema constrains objects, states, relationships, critical details, and uncertainty.
- Validation can easily prove only that metadata exists, not that it is visually true. The feature needs review evidence or another durable quality-control mechanism.
- If image metadata is generated by an AI model and not reviewed, hallucinated objects or wrong gestures could become trusted validation data.
- If image metadata is generated from ticket text or answer keys instead of direct image inspection, it can reproduce the same class of bug this feature is intended to prevent.
- Parallel image-analysis agents may produce inconsistent detail levels unless Architect defines minimum quality expectations and reviewer evidence.
- Parallel content work can create merge conflicts or duplicated edits unless work ranges and source-of-truth files are clearly assigned.
- Some source images may be low-resolution, cropped, annotated, or visually ambiguous; metadata may need an uncertainty field rather than forced precision.
- Explanation validation against metadata may create false positives if explanations use natural language that does not map cleanly to structured detail fields.
- Explanation validation may create false confidence if it only checks keyword overlap.
- Filling all translations and explanations can duplicate or diverge from existing topic-guide explanations unless Architect defines a source-of-truth relationship.
- Translation and explanation content can appear complete while still being low-quality if produced by a deterministic generator, glossary substitution, transliteration, or copied template; the feature needs review expectations that catch this.
- Parallel translation/explanation agents may produce inconsistent tone, terminology, depth, or explanation style unless Architect defines shared quality expectations and review evidence.
- Expanded explanation coverage can drift into a broad legal/driving-school manual unless kept exam-focused.
- Official traffic rules and GCBA materials can change; source-backed claims need currentness checks at implementation time.
- The current question set is an unofficial fallback set. Full learning-support coverage must not imply official or complete GCBA category B bank coverage.
- The image descriptions are detailed enough to recreate images; this may raise source-attribution and licensing-review concerns that Architect should consider in docs and metadata provenance.
- Metadata tied only to image hash may become stale if question wording or answer choices change; answer-critical mappings likely need question/answer fingerprints too.
- Future ticket deletion can leave stale translations, explanations, evidence, image usages, or orphaned metadata unless the documented lifecycle and validators require cleanup.
- Shared image metadata can be accidentally deleted when one ticket is removed even though another ticket still uses the same image.
- If `009` records only a flat recreation-oriented description, feature `010` will not know which details to highlight or dim for a specific question.
- If `009` records only answer-critical booleans, it may miss distractors and background elements that matter for teaching why the learner should ignore them.
- If question-specific relevance is mixed into shared image metadata without a usage layer, reused images can inherit the wrong answer-critical interpretation.
- If future overlay work has to infer relevance from explanation text or UI guesses because `009` lacks structured usage semantics, it can reintroduce the same class of image/explanation mismatch this feature is meant to prevent.

## Open Questions For Architect

- Should image metadata be one entry per unique image path, one entry per question-image pair, or a shared image entry plus question-specific critical-detail annotations?
- What exact JSON schema should represent scene context, objects, road layout, road users, gestures, signs, markings, annotations, object states, spatial relationships, and uncertainty?
- How should the schema mark answer-critical details: boolean flags, `criticalForQuestionIds`, links to answer IDs, trap IDs, or another structure?
- How should per-question usage represent relevance roles such as answer-critical, supporting, distractor/trap, and background/irrelevant without turning `009` into the UI overlay renderer?
- What stable identifiers should shared visible details expose so feature `010` can later reference them for highlight/dim behavior and stale-data validation?
- Should background/irrelevant details be explicitly enumerated for every image-backed question, or can they be derived from "visible details not marked answer-critical/supporting/distractor" with review evidence?
- How should validation prove that each image-backed question has enough question-specific relevance semantics for both explanation validation and future highlight/dim behavior?
- Should critical details be required for every image-backed question, or only for images where the correct answer depends on a visual element?
- How should metadata handle duplicated images used by multiple questions with different answer-critical interpretations?
- How should metadata capture visible annotations such as the red oval on `b13.jpg`?
- What level of detail is required for "can recreate a close image" without making the metadata unreviewably verbose?
- How should ambiguous or low-quality images be represented without inventing details?
- Should the new metadata live under `content/images/`, `content/questions/`, `content/validation/`, or another path?
- Should generated image metadata have its own review evidence file with reviewer, reviewed date, image hash, and question/answer fingerprints?
- What evidence should prove that an assigned image-analysis agent actually inspected each local image rather than inferring metadata from ticket text?
- How should image ranges be assigned to parallel agents while keeping one consistent schema and quality bar?
- What minimum sampling or full-review requirement should catch inconsistent or shallow agent-produced metadata before PR readiness?
- Should explanation validation be deterministic schema/fingerprint validation, rule-based contradiction checks, human review evidence, or a combination?
- How should validation prove that the old `b-fallback-001` left-arm/bent-arm explanation fails?
- Should the main `content/explanations/ru.explanations.json` become the complete 460-question explanation layer, or should complete explanations be sourced from `content/guide/topic-study-guide.ru.json` and exported/synchronized?
- Should all explanations include wrong-answer explanations, or only questions where the wrong answers are plausible traps?
- What official-source trace is required for explanations that are mostly image recognition versus explanations that generalize a traffic rule?
- Should translation coverage for all 460 questions be completed in this feature, or split into independently reviewable slices under the same feature memory?
- How should complete translation evidence be generated and reviewed without relying on live network or LLM validation in CI?
- How should implementation slices be partitioned so parallel agents can work without conflicting on one huge JSON file?
- Should docs clarify that detailed image metadata is unofficial learning/validation support, not an official visual catalog?
- How should Architect define the one-time parallel content-agent workflow across image metadata, Russian translations, and Russian explanations without turning generator output into accepted content?
- What shared terminology, tone, and quality expectations should translation/explanation agents follow so parallel ranges read as one coherent learning-support layer?
- Which durable docs should record the add/change/delete ticket lifecycle flow?
- What exact lifecycle expectations should docs state for adding or changing tickets with images, adding or changing tickets without images, and deleting tickets that share image metadata with other tickets?

## Handoff Expectation

Orchestrator should hand this feature folder to Architect next. Architect should create `spec.md`, `plan.md`, and `tasks.md` before any Implementation Agent changes product code, content files, validation scripts, tests, durable docs, image metadata, translations, or explanations.

Architect should also update feature memory so the implementation gate explicitly rejects MVP/placeholder completion. The plan and tasks should require a one-time parallel-agent image-analysis workflow in which agents inspect the local images, plus full-quality completion gates for every current translation, explanation, ticket, and image metadata entry.

Architect should additionally carry forward this latest clarification: translations and explanations must also be completed or reviewed by one-time parallel content-agent work, not by generator/template/transliteration output. Architect should also require a durable docs update that explains the future ticket lifecycle for adding, changing, and deleting tickets, including associated artifact cleanup and shared-image retention rules.

Architect should also carry forward the branch `010` dependency clarification: feature `009` metadata and per-question usage must be rich enough to serve as the semantic contract for future image explanation overlays. In particular, shared image metadata should describe visible facts, while per-question usage should classify those facts as answer-critical, supporting, distractor/trap, or background/irrelevant for that ticket so feature `010` can later highlight or dim the right details without inventing UI-only semantics.
