# Tasks: Translation Validation And Toggle

## Setup

- [x] T001 Confirm the active implementation worktree and branch are assigned for `005-translation-validation-toggle`.
- [x] T002 Read `feature-request.md`, `spec.md`, `plan.md`, and relevant source files before product edits.
- [x] T003 Run baseline `pnpm run validate:content` and record the result below, or record why it could not run.
- [x] T004 Run baseline `pnpm run test` and record the result below, or record why it could not run.

## Content And Validation

- [x] T005 Correct `b-fallback-001` Russian question translation.
- [x] T006 Correct `b-fallback-001` Russian answer translations for every Spanish answer id.
- [x] T007 Audit every current `content/translations/ru.translations.json` entry against its Spanish question and answer options.
- [x] T008 Add local approved translation-alignment evidence for every current Russian translation entry.
- [x] T009 Add a small testable translation-alignment validation helper.
- [x] T010 Integrate translation-alignment validation into `scripts/validate-content.mjs`.
- [x] T011 Add tests for structural translation failures: missing question, missing/extra answer id, empty question text, and empty answer translation.
- [x] T012 Add tests for evidence failures: missing evidence, stale source fingerprint, stale translation fingerprint, duplicate evidence, and unsupported evidence status.
- [x] T013 Add regression coverage showing the old `b-fallback-001` accident-question translation fails validation.

## UI And Learning Behavior

- [x] T014 Start learning mode with translation hidden.
- [x] T015 Start mistake review with translation hidden.
- [x] T016 Make the Spanish question text area the translation toggle in learning and mistake review.
- [x] T017 Add keyboard-accessible toggle behavior and accessible expanded/collapsed state.
- [x] T018 Render revealed question translation directly under Spanish question text and before image/answers.
- [x] T019 Make answer translations share the same reveal state and remain hidden before reveal.
- [x] T020 Preserve active exam mode with translation and explanation hidden during the active attempt.
- [x] T021 Remove `Неофициальный перевод` from the question-card translation UI.
- [x] T022 Remove the long per-card translation disclaimer render from the question-card UI.
- [x] T023 Remove the per-card explanation disclaimer render from the question-card UI.

## Explanation Content

- [x] T024 Expand every existing `content/explanations/ru.explanations.json` entry to explain why the correct answer is correct.
- [x] T025 Include wrong-answer trap, local CABA/Argentina context, practical driver intuition, or Spanish wording nuance where relevant.
- [x] T026 Confirm expanded explanations remain focused and do not claim official status.

## Docs And Process Memory

- [x] T027 Update durable docs for hidden-by-default/revealed translation behavior and active exam hiding.
- [x] T028 Update durable docs for unofficial-support clarity after removing repeated per-card disclaimers.
- [x] T029 Update durable docs for deterministic local translation-alignment validation.
- [x] T030 Keep this `tasks.md` checklist current while implementation proceeds.
- [x] T031 Record dead ends, decisions, known issues, and exact verification evidence below.
- [x] T032 Record every Implementation Agent feedback item below.
- [x] T033 Obtain Architect disposition for every Implementation Agent feedback item before completion.

## Verification

- [x] T034 Run `pnpm run validate:content`.
- [x] T035 Run `pnpm run test`.
- [x] T036 Run `pnpm run build`.
- [x] T037 Run `pnpm run test:e2e`.
- [x] T038 Run `pnpm run preflight`.
- [x] T039 Run `git diff --check`.
- [x] T040 Verify removed question-card strings with text search and/or e2e assertions.
- [x] T041 Verify durable docs mention revealed translation behavior and unofficial-support clarity.
- [x] T042 Verify diff scope excludes backend/runtime services, source-bank replacement, unrelated redesign, and default-branch merge.
- [x] T043 Record final verification evidence in this file.

## PR Readiness

- [x] T044 Confirm all acceptance criteria have evidence recorded in this file.
- [ ] T045 Confirm no blocking review findings remain.
- [ ] T046 Confirm required checks are green after push/PR.
- [ ] T047 Confirm the PR has no unresolved merge conflicts.
- [ ] T048 Leave only final human approval or merge mechanics remaining.

## Process Memory

### Dead Ends

- A one-off evidence generation command initially failed because `node - <<'NODE'` treated stdin as CommonJS and rejected top-level `import`. Re-ran the same read-only generation with `node --input-type=module - <<'NODE'`; no repository file was written by the failed command.
- A final status `rg` check was accidentally quoted with shell backticks inside double quotes, so `pnpm run preflight` ran again as command substitution and passed, but the surrounding `rg` failed with a regex parse error. This did not change repository files; final verification uses the explicit successful `preflight` and `git diff --check` runs recorded below.

### Decisions

- Use deterministic offline translation validation. No live translation service, LLM call, network call, backend, or runtime API may be required for validation.
- Represent semantic alignment through explicit local review evidence tied to exact Spanish and Russian fingerprints. Validation proves freshness and approval of the reviewed pair; it does not pretend to infer meaning automatically.
- Audit all current Russian translation entries in this feature because the translation layer is small and the known mismatch may indicate drift beyond one row.
- Make answer-choice translations share the same reveal state as the question translation.
- Make mistake review mirror learning mode: translation starts hidden and is revealed intentionally.
- Keep explanation reveal behavior explicit; change explanation content and remove the per-card disclaimer render only.
- Expand every existing explanation entry, but do not require new explanations for all 460 fallback questions in this feature.
- Preserve unofficial-status clarity through home/content-mode/source-status surfaces and metadata validation instead of repeated per-card disclaimer paragraphs.
- Search may continue indexing Russian support text; question cards still keep Spanish primary and translation hidden by default.
- Implementation audit found all 10 current Russian translation entries were drifted or structurally inconsistent with the current Spanish question tuples, not only `b-fallback-001`; all current entries were corrected and covered by alignment evidence.
- Added `content/validation/ru-translation-alignment.evidence.json` as the local approved evidence artifact and `scripts/content-translation-alignment.mjs` as the no-file-I/O validation boundary.
- Kept translation/explanation disclaimer fields in content metadata for validation and future surfaces, but removed their repeated question-card rendering.

### Known Issues

- Full official CABA category B question bank availability remains unresolved and out of scope.
- Translation validation still depends on disciplined review of evidence. A reviewer can approve bad content, so Review Agent must inspect the known corrected translation and evidence.
- Existing content mode remains `unofficial_b_fallback`; this feature must not imply official or complete question-bank coverage.
- PR lifecycle tasks T045-T048 remain for Orchestrator/review/CI because this Implementation Agent assignment explicitly forbids committing, pushing, opening a PR, or merging.

### Verification Evidence

- Architect setup: read `.specify/memory/constitution.md`, `docs_project/README.md`, `docs_project/project-idea.md`, `docs_project/project/frontend/frontend-docs.md`, `docs_project/project/backend/backend-docs.md`, `docs_project/project/feature-inventory.md`, `docs_project/screens/learning-and-exam-flows.md`, `docs/specify/README.md`, and `specs/005-translation-validation-toggle/feature-request.md`.
- Architect source orientation: inspected current translation, question, explanation, validation, UI, and e2e test structure before creating this plan.
- Implementation setup: confirmed current worktree `/Users/chap/devel/cabadrive` on branch `codex/005-translation-validation-toggle`; initial status showed untracked `specs/005-translation-validation-toggle/` from Analyst/Architect.
- Implementation read-before-edit: read `AGENTS.md`, `.specify/memory/constitution.md`, durable project docs in the required order, all four feature memory files, `scripts/validate-content.mjs`, `tests/content-validation.test.mjs`, `src/App.tsx`, `src/styles.css`, `src/data/content.ts`, `tests/e2e/app.spec.ts`, `content/translations/ru.translations.json`, and `content/explanations/ru.explanations.json`.
- Baseline `pnpm run validate:content`: passed before implementation with `Content validation passed: 460 category B fallback questions, 276 local image references.`
- Baseline `pnpm run test`: passed before implementation, `23` tests passed.
- Corrected `b-fallback-001` evidence: `questionTextRu` is `Что означает этот жест?`; answers are `Обгон справа.`, `Поворот направо.`, and `Остановиться.` for answer ids `b-fallback-001-a1`, `b-fallback-001-a2`, and `b-fallback-001-a3`.
- Translation audit evidence: corrected all 10 current entries in `content/translations/ru.translations.json` and added approved fingerprint evidence for the same 10 entries in `content/validation/ru-translation-alignment.evidence.json`.
- Validation helper evidence: `tests/content-translation-alignment.test.mjs` covers current content passing, structural failures, missing question, missing evidence, stale source fingerprint, stale translation fingerprint, duplicate evidence, unsupported evidence status, and the old `b-fallback-001` accident translation regression.
- Explanation expansion evidence: `tests/content-validation.test.mjs` asserts every existing Russian explanation entry is an expanded exam-focused learning note instead of a terse one-line note.
- UI/e2e evidence: `tests/e2e/app.spec.ts` asserts learning and mistake review start with translation hidden, Spanish question text toggles reveal/hide, Enter key reveals translation, answer translations share reveal state, revealed question translation is between Spanish text and image/answers, active exam has no question translation/explanation support block, and `Неофициальный перевод` is not rendered.
- Removed UI string search: `rg -n "Неофициальный перевод|Неофициальный учебный перевод|Это учебное пояснение проекта" src || true` returned no matches.
- Durable docs evidence: `rg -n "hidden|reveal|Spanish question text|translation alignment|unofficial learning aids|unofficial support|translation reveal|hidden by default" docs_project` found updated lines in `docs_project/project/frontend/frontend-docs.md`, `docs_project/project/backend/backend-docs.md`, `docs_project/project/feature-inventory.md`, and `docs_project/screens/learning-and-exam-flows.md`.
- Intermediate `pnpm run validate:content`: passed after validation/content changes with `Content validation passed: 460 category B fallback questions, 276 local image references.`
- Intermediate `pnpm run test`: passed after validation/content changes, `30` tests passed.
- `pnpm run build`: passed after UI/docs changes; Vite built successfully and `generate-service-worker` reported `280` cached assets. Vite emitted the existing chunk-size warning for the main bundle.
- `pnpm run test:e2e`: passed after UI/docs changes, `8` Playwright tests passed across chromium and mobile projects.
- Final `pnpm run preflight`: passed after all implementation changes; feature-memory gate, repo baseline, content validation, `31` unit tests, build, and `8` e2e tests all completed successfully. Vite again emitted the existing chunk-size warning.
- `git diff --check`: passed with no whitespace errors before and after this process-memory update.
- Diff-scope review: changed paths are limited to current feature memory, translation/explanation content, local validation evidence/helper, content validator integration, focused tests/e2e, question-card UI/CSS, and durable docs. No backend/runtime service, source-bank replacement, default-branch merge, commit, push, or PR creation was performed.

### Implementation Agent Feedback

- None. No divergence or out-of-scope follow-up was identified during implementation.

### Architect Dispositions

- No Architect disposition required because no Implementation Agent feedback items were recorded.
