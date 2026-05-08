# Spec: Translation Validation And Toggle

## Analyst Intake

- Source request: `feature-request.md`
- Intake assumptions or open questions carried into this spec:
  - The current defect is concrete: `b-fallback-001` Russian question and answer translations describe a traffic-accident question while the Spanish source asks `¿Qué indica esta seña?`.
  - Translation validation must be deterministic, offline, and compatible with local-first/no-backend constraints.
  - Removing repeated per-card disclaimers is a UI simplification, not a change to unofficial status.
  - Expanded explanations should improve the existing learning support surface without turning this feature into a full content-authoring pass for all 460 fallback questions.

## Goal

Correct the known mismatched Russian translation, add deterministic repository validation that blocks unaudited or stale translation alignment, and make Russian translation an intentional reveal action in learning and mistake-review question cards while keeping Spanish source text primary.

## Scope

In scope:

- Correct `b-fallback-001` Russian question translation and answer-choice translations so they match the exact Spanish question and answer options.
- Audit every existing entry in `content/translations/ru.translations.json` and add deterministic alignment evidence for the exact Spanish/Russian question and answer pairs.
- Add offline content validation for translation structure and approved alignment evidence.
- Add tests proving that the current `b-fallback-001` mismatch would fail validation.
- Start learning mode and mistake review with translation hidden.
- Use the Spanish question text area as the primary translation toggle in learning and mistake review.
- Show the revealed question translation directly under the Spanish question text, before the image and answer options.
- Hide answer-choice translations until the same translation reveal state is active.
- Remove the per-card visible heading `Неофициальный перевод`, the long per-card translation disclaimer, and the per-card explanation disclaimer from the question UI.
- Expand the existing Russian explanation entries so they meet the learning-quality checklist in this spec.
- Update durable docs that describe learning/exam flows or unofficial-support labeling if implementation changes their current wording.
- Keep `tasks.md` current with decisions, dead ends, known issues, verification evidence, and Implementation Agent feedback.

Out of scope:

- Replacing the fallback question bank or claiming official/full category B bank coverage.
- Translating every fallback question beyond the current Russian translation layer.
- Adding explanations for all 460 fallback questions.
- Introducing a backend, network translation service, remote AI validator, cloud sync, or runtime API.
- Making Russian text primary, hiding Spanish source text, or changing exam scoring/selection rules.
- Changing source-scope validation except where needed to keep content validation integration coherent.
- Editing docs outside the behavior touched by this feature.

## Architect Decisions

### Translation Validation

Translation correctness validation must be deterministic and offline. The implementation must not call live translation, LLM, or network services in validation, tests, build, preflight, runtime, or CI.

Semantic alignment is represented by explicit review evidence for each exact Spanish/Russian pair, not by an automated claim that software can prove meaning. Validation must compute stable fingerprints for:

- the Spanish source tuple: `questionId`, `officialTextEs`, ordered answer ids/texts, `correctAnswerId`, and image hash when present;
- the Russian translation tuple: `questionId`, `questionTextRu`, and answer translations ordered by the Spanish answer ids.

Every translation must have an approved local evidence record whose source fingerprint and translation fingerprint match the current files. If Spanish source text, answer ids, answer text, correct-answer id, image hash, or Russian translation text changes without refreshed evidence, validation must fail.

### Audit Coverage

All current Russian translation entries must be audited in this feature. The current translation layer is small, and the known mismatch suggests possible sequence or copy/paste drift, so correcting only `b-fallback-001` is not sufficient.

### Answer Translations

Answer-choice translations share the same reveal state as the question translation. They are hidden by default in learning and mistake review, appear only after the Spanish question text area toggles translation on, and hide again when the same area toggles translation off. There is no separate answer-translation reveal state.

### Mistake Review

Mistake review mirrors learning mode for translation visibility. It starts hidden because remediation should still make the learner read the Spanish first, then intentionally request Russian support.

### Explanation Behavior And Coverage

Explanation reveal behavior does not need to change beyond removing the visible per-card disclaimer text. The existing explanation action can remain explicit because the user asked to change translation reveal, not explanation reveal.

Expanded explanation coverage target: every existing entry in `content/explanations/ru.explanations.json` must be expanded to the quality checklist below. This feature does not require creating explanations for questions that currently have no explanation entry.

### Unofficial-Status Clarity

The question card must stop repeating the removed per-card disclaimer texts, but unofficial status remains mandatory at the product and data levels:

- Home/onboarding and content-mode surfaces continue to state that Russian translations and explanations are unofficial learning support.
- The question-card source/status footer continues to mark the practice question set as unofficial fallback/needs review.
- Translation and explanation metadata may keep disclaimer fields for validation and future surfaces, but those fields are not rendered as repeated per-card disclaimer copy.
- Durable docs must be updated if they currently imply that every question card must display those disclaimer texts.

### Search

Search may continue to index Russian translations and explanations. Hidden-on-card behavior must not remove searchability, but search results must still lead to a question card where Spanish text is primary and translation starts hidden.

## User Stories

### User Story 1

As a Russian-speaking learner, I want the Spanish question to appear first and the Russian translation to be revealed only when I ask for it, so that I practice reading the exam language instead of relying on Russian by default.

### User Story 2

As a learner using Russian support, I want the translation and answer translations to match the exact Spanish question on the card, so that unofficial support does not teach me the wrong meaning.

### User Story 3

As a maintainer, I want translation alignment evidence to be deterministic and local, so that preflight can block stale or unaudited translations without external services.

### User Story 4

As a learner reviewing mistakes, I want the same hidden-by-default translation behavior as learning mode, so that remediation still reinforces Spanish comprehension.

## Acceptance Criteria

1. Given `b-fallback-001`, when the Russian translation is shown, then the question translation corresponds to `¿Qué indica esta seña?`.
2. Given `b-fallback-001`, when answer translations are shown, then they correspond to `Adelantamiento por la derecha.`, `Giro a la derecha.`, and `Detenerse.` using the same answer ids as the Spanish source.
3. Given any Russian translation entry, when content validation runs, then it fails if the entry is missing question text, has missing/extra answer ids, has empty answer translations, or references a missing question.
4. Given any Russian translation entry, when its source fingerprint or translation fingerprint does not match approved local alignment evidence, then content validation fails.
5. Given the old `b-fallback-001` accident-question Russian translation in a regression fixture, when translation validation runs, then validation fails even though the `questionId` exists and the answer count is structurally plausible.
6. Given the current committed translation layer, when `pnpm run validate:content` runs after implementation, then validation passes only with approved alignment evidence for every existing Russian translation entry.
7. Given learning mode first renders a question card, then no Russian question translation, no answer translation, and no `Неофициальный перевод` heading are visible.
8. Given learning mode, when the learner clicks or keyboard-activates the Spanish question text area, then the Russian question translation appears directly below that Spanish text and before the image.
9. Given learning mode with translation revealed, when the learner clicks or keyboard-activates the same Spanish question text area again, then the Russian question and answer translations hide.
10. Given mistake review first renders a question card, then translation is hidden by default and follows the same reveal/hide behavior as learning mode.
11. Given active exam mode, when the user interacts with the question card, then translation and explanation remain hidden during the active attempt.
12. Given answer choices in learning or mistake review, then answer translations are visible only while the shared translation reveal state is on.
13. Given the question card UI, then it does not render the long translation disclaimer text `Неофициальный учебный перевод...` and does not render the explanation disclaimer text `Это учебное пояснение проекта. Оно не заменяет официальный источник и не является официальной формулировкой экзаменационного материала.`
14. Given existing explanation entries, then each expanded explanation states why the correct answer is correct and, where useful, why tempting wrong answers are wrong.
15. Given existing explanation entries, then each expanded explanation stays exam-focused and covers local CABA/Argentina context, practical driver intuition, or Spanish wording traps when relevant.
16. Given durable docs are inspected after implementation, then they describe optional/revealed translation behavior and unofficial support clarity without requiring repeated per-card disclaimers.

## Negative Scenarios

1. A translation that merely has the right `questionId` and answer count must not pass without matching approved alignment evidence.
2. A translation evidence record for an old Spanish source tuple must fail after Spanish question text, answer text, answer ids, correct answer, or image hash changes.
3. A translation evidence record for old Russian translation text must fail after the Russian translation changes.
4. A missing answer translation, extra answer translation, or answer translation attached to the wrong answer id must fail validation.
5. Learning or mistake review must not show Russian translation immediately on initial card render.
6. The translation toggle must not be available in active exam mode.
7. Removing repeated per-card disclaimers must not remove product-level or source/status clarity that the practice set and Russian support are unofficial.
8. Expanded explanations must not become a general Spanish course, full driving-school manual, legal encyclopedia, or unsupported official claim.

## Functional Requirements

- FR-001: Correct the `b-fallback-001` Russian question and answer translations.
- FR-002: Audit every current Russian translation entry and create approved local alignment evidence for each exact Spanish/Russian pair.
- FR-003: Add a small testable translation-alignment validation boundary with no file I/O inside the core helper.
- FR-004: Integrate translation-alignment validation into `scripts/validate-content.mjs`.
- FR-005: Validate exact answer id coverage for every translation: no missing ids, no extra ids, no empty translated answer text.
- FR-006: Validate approved source and translation fingerprints for every current Russian translation entry.
- FR-007: Add regression tests showing the old `b-fallback-001` mismatch fails validation.
- FR-008: Initialize translation visibility to hidden in learning and mistake review.
- FR-009: Make the Spanish question text area the primary translation toggle in learning and mistake review.
- FR-010: Ensure the translation toggle is keyboard-accessible and exposes state through accessible attributes.
- FR-011: Render revealed question translation directly below Spanish question text and before the image.
- FR-012: Render answer-choice translations only while the shared translation state is revealed.
- FR-013: Preserve active exam mode with translation and explanation hidden during the active attempt.
- FR-014: Remove the specified per-card translation heading and translation/explanation disclaimer copy from the question UI.
- FR-015: Expand every existing Russian explanation entry to the explanation quality checklist.
- FR-016: Keep product-level unofficial-support clarity and update durable docs as needed.
- FR-017: Record verification evidence, process decisions, dead ends, known issues, and Implementation Agent feedback in `tasks.md`.

## Success Criteria

- SC-001: `pnpm run validate:content` passes and includes translation-alignment validation.
- SC-002: `pnpm run test` passes and includes translation-alignment regression coverage for the old `b-fallback-001` mismatch.
- SC-003: `pnpm run build` passes.
- SC-004: `pnpm run test:e2e` passes with coverage for hidden-by-default translation, question-text reveal/hide, answer translation reveal, mistake review, and active exam hiding.
- SC-005: `pnpm run preflight` passes, or any unrelated blocker is recorded with exact evidence.
- SC-006: `git diff --check` passes.
- SC-007: `tasks.md` contains exact verification evidence for every acceptance criterion and records any Implementation Agent feedback plus Architect disposition.

## Review And Verification Requirements

- Implementation review must verify that validation is deterministic/offline and does not depend on live translation services, LLM calls, or network access.
- Implementation review must verify that the evidence mechanism cannot be bypassed by a structurally plausible but unaudited translation.
- Implementation review must verify that UI changes do not make Russian primary, do not show removed per-card disclaimer text, and do not hide the product-level unofficial status.
- Implementation review must verify that active exam mode still hides translation and explanation during the active attempt.
- Implementation review must verify that expanded explanations are focused, useful, and do not make unsupported official claims.
- Verification evidence must include command outputs or concise recorded results for content validation, unit tests, build, e2e tests, preflight, diff check, and text-search checks for removed UI strings.
