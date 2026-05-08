# Feature Request: Translation Validation And Toggle

## Analyst Artifact Status

This is the Analyst intake artifact for a repository-changing request. Per the Cabadrive role boundary, this artifact records the request, context, evidence, assumptions, risks, open questions, and acceptance expectations only. It intentionally does not include a technical solution, implementation plan, tasks, code changes, reviews, commits, or PR state.

## Original User Request

The user asked in Russian, in Analyst role mode:

> явный баг - перевод не соответствует испанскому тексту
> надо
> 1. пофиксить
> 2. добавить валидацию переводов, чтоб они были корректными
> 3. перевод должен быть виден не сразу, а включаться по кнопке
> создай бранч, в нем папку для новой фичи и свой артефакт

Translated intent:

- There is an obvious bug: the Russian translation does not correspond to the Spanish source text.
- The product must fix the mismatched translation.
- The repository must add validation so translations are correct, not merely present.
- The translation must not be visible immediately; the user should reveal it with a button.
- Create a branch, a new feature folder, and this Analyst artifact.

## User Follow-Up

The user added these UX requirements after the initial artifact was created:

- Place the question translation directly under the Spanish question text, not below the image.
- Remove the visible heading `Неофициальный перевод`.
- Remove the visible disclaimer text `Неофициальный учебный перевод...`; the user considers the unofficial status clear enough without repeating it in the question card.
- Reveal the question translation by clicking the Spanish question text area itself.
- Hide the question translation again on the second click of the same text area.
- Also remove the visible explanation disclaimer text `Это учебное пояснение проекта. Оно не заменяет официальный источник и не является официальной формулировкой экзаменационного материала.`
- More generally, do not show these repeated per-card disclaimer texts in the question UI.
- Make educational explanations more detailed, expanded, and useful for learning.

## Scope Split Decision

This request combines one learner-facing defect and closely related content-quality/UX safeguards for the same question support surface:

- content correction for the affected translation;
- validation of translation correctness;
- UI behavior that hides translation until user action.
- expanded educational explanations for the same learning card context.

These should remain one feature because the user experience risk is the same: unofficial Russian support can mislead learners if it is wrong or overexposed. No split into separate feature folders is recommended at intake time.

## Project Context Reviewed

Reviewed repository memory and product docs:

- `.specify/memory/constitution.md`
- `docs_project/README.md`
- `docs_project/project-idea.md`
- `docs_project/project/frontend/frontend-docs.md`
- `docs_project/project/backend/backend-docs.md`
- `docs_project/project/feature-inventory.md`
- `docs_project/screens/learning-and-exam-flows.md`
- `docs/specify/README.md`

Relevant existing project constraints:

- Cabadrive is a local-first React/Vite trainer for Russian-speaking drivers preparing for the CABA theory exam.
- Official Spanish text must remain primary.
- Russian translations and explanations are unofficial learning aids and must be clearly labeled.
- The current practice content mode is `unofficial_b_fallback`, not an official GCBA question bank.
- The MVP has no backend; validation is repository tooling and CI/local preflight, not a runtime service.
- Docker-only runtime remains the end-user contract.
- `docs_project/screens/learning-and-exam-flows.md` already states that Learn Questions uses an optional toggle for Russian translation.
- `docs_project/screens/learning-and-exam-flows.md` already states that Exam Simulation hides translation/explanation during the active attempt.
- Existing durable docs currently say translations and explanations are explicitly marked as unofficial. The follow-up request asks to remove repeated per-card translation and explanation disclaimer text, so Architect should either update the docs or preserve unofficial-status clarity elsewhere in the UI.

Relevant local files inspected for evidence only:

- `content/questions/caba-b.unofficial-fallback.questions.json`
- `content/translations/ru.translations.json`
- `scripts/validate-content.mjs`
- `src/App.tsx`
- `tests/content-validation.test.mjs`
- `tests/e2e/app.spec.ts`

## Evidence From Current Repository

The screenshot shows a learning card with Spanish question:

```text
¿Qué indica esta seña?
```

But the visible Russian translation says:

```text
Что рекомендуется сделать первым делом, если вы стали участником ДТП?
```

Local content inspection confirms the same mismatch for `b-fallback-001`:

- Spanish question: `¿Qué indica esta seña?`
- Spanish answers:
  - `Adelantamiento por la derecha.`
  - `Giro a la derecha.`
  - `Detenerse.`
- Correct answer id: `b-fallback-001-a2`
- Current Russian translation asks about the first recommended action after a traffic accident.
- Current Russian answer translations also describe accident-response actions and do not correspond to the Spanish answer choices.

The current validation script checks that a translation references an existing question and includes an unofficial disclaimer, but it does not detect this semantic mismatch.

The current question card initializes translation as visible in learning and mistakes modes. This conflicts with the requested behavior and with the documented optional-toggle learning flow.

## Problem Statement

Russian translation is an unofficial aid, but learners can still rely on it while studying. If the translation belongs to another Spanish question or answer set, the user may learn the wrong meaning, choose the wrong answer, and lose trust in the app. The risk is amplified because the translation is currently displayed immediately in learning mode rather than being intentionally revealed.

## Desired Product Outcome

Learners should see the Spanish question and answer choices first. Russian translation should be available as an explicit aid only after the learner chooses to reveal it by clicking the Spanish question text area. The revealed question translation should appear immediately under the Spanish question text, before the image, and should hide again when the user clicks the same area a second time. When shown, the Russian translation must correspond to the exact Spanish question and answer options on the card.

Educational explanations should be more detailed and expanded than the current short notes. They should help an experienced Russian-speaking driver understand why the answer is correct, what local CABA/Argentina rule or exam concept is involved, what common trap or wording nuance matters, and how to remember the point without turning the app into a full driving-school textbook.

The question card should not repeat the visible heading `Неофициальный перевод`, the long visible translation disclaimer `Неофициальный учебный перевод...`, or the visible explanation disclaimer `Это учебное пояснение проекта. Оно не заменяет официальный источник и не является официальной формулировкой экзаменационного материала.` Architect should reconcile this with the existing project rule that unofficial support must remain clear to learners.

## Acceptance Expectations For Architect

Architect should convert these into formal acceptance criteria and verification requirements:

- `b-fallback-001` has a corrected Russian question translation aligned with `¿Qué indica esta seña?`.
- `b-fallback-001` answer translations align with the exact Spanish answers `Adelantamiento por la derecha.`, `Giro a la derecha.`, and `Detenerse.`
- Content validation fails when a translation is structurally or semantically mismatched with the referenced Spanish question or its answer choices.
- Validation covers the question text and every answer translation, not only the presence of `questionId`, answer ids, and disclaimer text.
- Validation has evidence that would have caught the current `b-fallback-001` mismatch.
- Learning mode starts with translation hidden.
- Mistake review starts with translation hidden unless Architect explicitly documents a different product reason.
- Clicking the Spanish question text area reveals the question translation on demand.
- Clicking the same Spanish question text area again hides the question translation.
- The revealed question translation appears directly under the Spanish question text, before the image and before answer choices.
- The question card does not show the heading `Неофициальный перевод` for the question translation.
- The question card does not show the long disclaimer text `Неофициальный учебный перевод...` for the question translation.
- The question card does not show the explanation disclaimer text `Это учебное пояснение проекта. Оно не заменяет официальный источник и не является официальной формулировкой экзаменационного материала.`
- Repeated per-card disclaimer texts are removed from the learning question UI unless Architect records a strong safety/compliance reason to keep a shorter alternative.
- Educational explanations are expanded beyond terse one-line notes where current content is too shallow.
- Expanded explanations state why the correct answer is correct and, where useful, why tempting wrong answers are wrong.
- Expanded explanations address local CABA/Argentina exam context, practical driver intuition, and Spanish wording traps when those are relevant to the question.
- Expanded explanations remain focused on exam preparation and do not become a broad Spanish course, full driving course, or legal encyclopedia.
- If answer-choice translations remain available, Architect should specify whether they follow the same click-to-reveal state as the question translation.
- Exam mode continues to hide translation and explanation during the active attempt.
- Search may still index Russian translations if that remains intentional, but hidden-on-card behavior must not make search results misleading.
- Unofficial-status clarity is preserved at an appropriate product level without repeating the removed per-card disclaimers, or the docs are explicitly updated to match the new UX decision.
- Tests or verification evidence cover the corrected content, the new validation behavior, and the hidden-by-default UI behavior.
- Durable docs are updated if implementation changes or clarifies the documented learning/exam flow.

## Clarified Assumptions

- No further Q&A is required before architecture: the bug example is concrete, the desired UI behavior is clear, and unresolved details can be handled by Architect as implementation choices.
- The scope is the current Russian translation layer for the current `unofficial_b_fallback` question set.
- The request does not ask to replace the source question bank or change content availability mode.
- The request does not ask to introduce a backend or external runtime dependency.
- The request does not ask to hide Spanish source text or make Russian the primary text.
- The follow-up replaces the earlier "button" wording with a more specific interaction: click the Spanish question text area to toggle the question translation.
- Removing the per-card translation/explanation disclaimers is intended as UI simplification, not a claim that translations or explanations are official.
- Expanded explanations should prioritize learner comprehension and exam relevance over exhaustive legal citation.
- Translation correctness validation may require a combination of deterministic checks, curated review evidence, and targeted fixtures; the exact mechanism is for Architect to specify.
- The immediate known mismatch is `b-fallback-001`, but validation should guard against similar mismatches elsewhere in the translation file.

## External Research

No external internet research was used for this intake. The request is grounded in a concrete local bug report, an attached screenshot, and existing repository documentation. External research may be useful later if Architect wants to define a broader translation-quality review model, but it is not needed to start architecture for this defect.

## Risks

- Semantic translation correctness is difficult to prove with purely deterministic validation; a weak implementation could create false confidence while still allowing wrong translations.
- A validation approach that depends on live network translation services would conflict with the repository's local-first and deterministic preflight expectations unless explicitly scoped as offline evidence generation rather than runtime behavior.
- Fixing only `b-fallback-001` without validating the rest of the translation layer may leave similar hidden defects.
- Hiding translations by default may change existing e2e expectations and learner workflow; tests should assert the intended new behavior.
- Removing repeated per-card unofficial labels and disclaimers may conflict with existing project documentation and could reduce trust clarity if no replacement product-level signal exists.
- Using the Spanish question text itself as the toggle target requires accessible keyboard behavior and a clear enough affordance without adding noisy instructional copy.
- Expanding explanations for many questions could become a large content task; Architect may need to decide whether this feature requires broad coverage or starts with the affected/visible subset plus a repeatable quality standard.
- Longer explanations can clutter the learning flow if typography, collapse behavior, or reveal timing are not handled carefully.
- The current translation file may contain a sequence offset or source-order mismatch. If so, more than one question can be affected.
- Because the current content is an unofficial fallback and `needs_review`, validation language must avoid implying official approval of translated content.

## Open Questions For Architect

- Should translation correctness validation block every translation unless it has explicit human-review evidence, or should it start with targeted automated checks plus curated fixtures for known mismatches?
- Should all existing translations be audited in this feature, or should the implementation correct the known mismatch and add validation that prevents recurrence going forward?
- Should hidden-by-default translation apply to answer-choice translations as well as the question-level translation block? The user request appears to imply yes.
- Should expanded explanations be applied to every current question in this feature, or should Architect define a first-pass coverage target and a quality checklist for future content passes?
- Should explanation reveal behavior change, or only the explanation content and removal of disclaimer text?
- Should mistake review mirror learning mode exactly, or should it have a distinct default because it is a remediation flow?
- How should the clickable Spanish question area expose its toggle state accessibly without reintroducing visible instructional or disclaimer text the user asked to remove?
- Where should the app preserve the "translations and explanations are unofficial" product guarantee after removing per-card headings and disclaimer text?

## Handoff Expectation

Orchestrator should hand this feature folder to Architect next. Architect should create `spec.md`, `plan.md`, and `tasks.md` before any Implementation Agent changes product code, content, tests, or durable docs.
