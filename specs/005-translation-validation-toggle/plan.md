# Plan: Translation Validation And Toggle

## Summary

Fix the known `b-fallback-001` translation drift, add a deterministic offline translation-alignment evidence gate, and revise the question card so Russian translation is hidden until the learner toggles it from the Spanish question text. Keep unofficial support clear through product-level/status surfaces and metadata, not repeated per-card disclaimer paragraphs.

## Technical Context

- runtime: static React/Vite app; no backend.
- validation: local Node scripts run through existing content validation and preflight.
- dependencies: no new runtime or network dependencies expected.
- likely product paths:
  - `content/questions/caba-b.unofficial-fallback.questions.json`
  - `content/translations/ru.translations.json`
  - `content/explanations/ru.explanations.json`
  - `content/validation/production-eligibility.policy.json`
  - new local translation-alignment evidence under `content/validation/`
  - `scripts/validate-content.mjs`
  - new helper such as `scripts/content-translation-alignment.mjs`
  - `tests/content-validation.test.mjs`
  - new helper tests such as `tests/content-translation-alignment.test.mjs`
  - `src/App.tsx`
  - `src/data/content.ts` if type fields change
  - `tests/e2e/app.spec.ts`
  - `docs_project/project/frontend/frontend-docs.md`
  - `docs_project/project/backend/backend-docs.md`
  - `docs_project/project/feature-inventory.md`
  - `docs_project/screens/learning-and-exam-flows.md`
  - this feature memory.

## Scope Boundaries

- in scope: current Russian translation layer, translation alignment validation, current explanation entries, question-card translation reveal UX, tests, durable docs, feature-memory process updates.
- out of scope: new backend/API, external semantic services, full 460-question explanation authoring, source-bank replacement, official-bank claims, exam scoring changes, unrelated UI redesign.

## Constitution Check

- Spec-first: yes; Analyst intake exists and this spec/plan/tasks set is created before implementation edits.
- Testable boundaries: yes; translation-alignment logic must be extracted into a direct unit-testable helper.
- Test-first bias: yes; regression tests must demonstrate the old mismatch fails before or alongside implementation.
- Supervised verification: yes; acceptance criteria and exact evidence are required before merge.
- PR-only workflow: yes; work is on `codex/005-translation-validation-toggle`.
- One worktree per task: implementation must use the assigned isolated worktree/branch.
- Deployability: yes; validation, build, e2e, and preflight remain required.
- Simplicity: yes; one small helper and one local evidence artifact are enough. Do not add schema frameworks or services unless implementation proves the local helper cannot meet the contract.
- Process memory: yes; `tasks.md` must record dead ends, decisions, known issues, evidence, and Implementation Agent feedback.

## Complexity Tracking

Add one small helper, tentatively `scripts/content-translation-alignment.mjs`, because semantic-alignment evidence needs direct synthetic tests without mutating committed content fixtures. The helper should:

- accept questions, translations, evidence entries, and policy/options as data;
- return validation error strings;
- perform no file I/O;
- compute stable fingerprints using canonical JSON serialization and `sha256`;
- validate answer-id coverage and evidence status;
- remain independent from React/runtime code.

Add one local evidence artifact under `content/validation/`, tentatively `ru-translation-alignment.evidence.json`, because the validator needs deterministic proof that a reviewer approved each exact Spanish/Russian pair. Suggested shape:

```json
{
  "locale": "ru",
  "version": 1,
  "entries": [
    {
      "questionId": "b-fallback-001",
      "status": "approved",
      "reviewer": "Cabadrive solo self-audit",
      "reviewedAt": "2026-05-08",
      "sourceTextSha256": "<sha256 of canonical Spanish tuple>",
      "translationTextSha256": "<sha256 of canonical Russian tuple>",
      "checks": {
        "questionTextAligned": true,
        "answerChoicesAligned": true,
        "answerIdsAligned": true
      },
      "notes": "Translation checked against the Spanish question and every answer option."
    }
  ]
}
```

The exact filename and field names may differ if the Implementation Agent finds a cleaner local convention, but the same information and deterministic failure behavior are required.

## Implementation Approach

1. Confirm active branch/worktree and read this feature memory before product edits.
2. Run baseline `pnpm run validate:content` and `pnpm run test` if feasible; record the result in `tasks.md`.
3. Correct `b-fallback-001` translation content:
   - question: translate `¿Qué indica esta seña?`;
   - answers: translate right-side passing, right turn, and stop/detenerse according to their exact answer ids;
   - ensure the correct answer remains `b-fallback-001-a2`.
4. Audit all existing entries in `content/translations/ru.translations.json` for alignment with the current Spanish question and answer choices.
5. Add local translation-alignment evidence for every current Russian translation entry.
6. Implement the validation helper:
   - build canonical source tuples from question text, ordered answers, correct answer id, and image hash if present;
   - build canonical translation tuples using the source answer order;
   - reject missing question text, missing answer translation, extra answer id, empty strings, duplicate evidence, unsupported status, missing reviewer/review date, source hash mismatch, and translation hash mismatch;
   - produce error messages that name the affected `questionId`.
7. Integrate the helper into `scripts/validate-content.mjs`.
8. Add tests for:
   - current committed content passes with evidence;
   - old `b-fallback-001` accident translation fails;
   - missing evidence fails;
   - stale source hash fails;
   - stale translation hash fails;
   - missing/extra answer translations fail.
9. Update question-card UI:
   - initialize translation hidden for learning and mistake review;
   - reset translation hidden when question id or mode changes;
   - make the Spanish question text area the translation toggle in learning/mistake review with click plus keyboard activation;
   - expose state with `aria-expanded` and a stable `aria-controls` target;
   - render revealed question translation under the Spanish question text and before any image;
   - render answer translations only while the same state is revealed;
   - remove the visible `Неофициальный перевод` heading and the removed per-card disclaimer text from the card;
   - keep active exam mode with no translation toggle/reveal during the active attempt.
10. Expand every existing explanation entry:
    - explain why the correct answer is correct;
    - mention wrong-answer traps where useful;
    - include CABA/Argentina exam context, practical driver intuition, or Spanish wording nuance when relevant;
    - keep each explanation concise enough for a question card.
11. Remove the per-card explanation disclaimer render while keeping metadata validation unless the Architect later disposes a stronger metadata change.
12. Update durable docs for optional/revealed translation behavior, no-backend validation, explanation-support scope, and unofficial-support clarity without repeated per-card disclaimers.
13. Update e2e tests to click the Spanish question text area instead of the old translation button and to assert ordering/visibility.
14. Run verification commands and record exact evidence in `tasks.md`.
15. Review diff scope before handoff/PR: no backend, source-bank replacement, unrelated redesign, or default-branch merge.

## Verification Matrix

| Acceptance area | Evidence required |
| --- | --- |
| Corrected `b-fallback-001` translation | `jq`/test assertion for the corrected question and answer translations. |
| Structural translation validation | Unit tests for missing question text, missing/extra answer ids, empty strings, and missing question references. |
| Evidence-based alignment validation | Unit tests for missing evidence, stale source fingerprint, stale translation fingerprint, duplicate evidence, and unsupported status. |
| Known mismatch regression | Unit test using the old accident-question Russian translation for `b-fallback-001` and asserting validation failure. |
| Content validation integration | `pnpm run validate:content` passes only after evidence is present and current. |
| Learning hidden-by-default | Playwright assertion that no Russian translation or answer translation is visible on initial learning render. |
| Question-text toggle | Playwright assertion that activating the Spanish question text reveals/hides translation and answer translations. |
| Translation placement | Playwright locator/order assertion or DOM assertion showing translation is before the image and answer options. |
| Mistake review behavior | Playwright assertion that mistake review starts hidden and follows the same reveal state. |
| Active exam hiding | Playwright assertion that active exam mode does not expose translation or explanation. |
| Removed per-card strings | Text-search or Playwright assertions that removed disclaimer strings and `Неофициальный перевод` do not render in question cards. |
| Explanation expansion | Content test or targeted assertions that existing explanations exceed the old terse form and include required learning elements. |
| Durable docs | `rg` evidence for revealed translation behavior and unofficial-support clarity in `docs_project/`. |
| Full preflight | `pnpm run preflight`, `git diff --check`, and diff-scope review. |

## Risks And Mitigations

- Risk: deterministic validation can create false confidence if reviewers approve a bad translation.
  - Mitigation: validation explicitly records human/self-audit evidence and exact fingerprints; Review Agent must inspect the corrected content and evidence for the known mismatch.

- Risk: evidence hashes are hard to maintain by hand.
  - Mitigation: add a small script helper/exported function or clear test failure output so maintainers can recompute fingerprints locally without network access.

- Risk: removing repeated disclaimers reduces visible trust context.
  - Mitigation: keep product-level onboarding/content-mode and source/status footer clarity, keep metadata disclaimer validation, and update durable docs to describe this split.

- Risk: clickable question text lacks an affordance.
  - Mitigation: use focus style, accessible expanded state, and restrained visual treatment without visible instructional copy or repeated disclaimer text.

- Risk: expanding explanations bloats the card.
  - Mitigation: keep explicit explanation reveal behavior and concise exam-focused paragraphs.
