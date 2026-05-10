# Spec: Institution Entrance Timing Contrast

## Analyst Intake

- Source request: `feature-request.md`.
- Active feature folder: `specs/020-institution-entrance-timing-contrast/`.
- Assigned branch: `codex/020-institution-entrance-timing-contrast`.
- Assigned worktree: `/Users/chap/devel/cabadrive-020-institution-entrance-timing-contrast`.
- Architect scope: create and maintain only `spec.md`, `plan.md`, and `tasks.md` in this feature folder. Product code, content JSON, tests, durable docs outside this folder, commits, pushes, PRs, and sibling feature memory are out of scope for this Architect pass.

## Goal

Complete the learner-facing institution-entrance timing contrast that remains hidden after the hospital/health entrance polish. Learners should see that `hospital/centro de salud` entrance parking-clearance practice keeps the visible `10 metros de cada lado de la entrada` and `5 metros` trap framing, while schools, temples, and banks are time-qualified by `en horas de clase`, `oficios/ceremonias`, and `horario de atención al público`.

## Scope

In scope for the future implementation slice:

- Add a concise, source-backed visible contrast to the `parking-clearances-and-corners` topic rendered in `Материалы`.
- Preserve the current learner-facing hospital/health entrance rule: `hospital/centro de salud -> 10 metros de cada lado de la entrada`.
- Preserve the current `5 metros` trap/falso/wrong framing for the hospital/health entrance context.
- Make school timing visible with the Spanish phrase `en horas de clase` or a source-equivalent Spanish-primary phrase plus Russian support.
- Make temple timing visible with `oficios/ceremonias` or source-equivalent `oficios o ceremonias` wording plus Russian support.
- Make bank timing visible with `horario de atención al público` plus Russian support.
- Keep the contrast narrow, exam-focused, and easy to read for Russian-speaking learners with low Spanish.
- Use existing source-trace/official-document evidence for Ley 2148 7.1.9(l), and update source-trace only if implementation changes the source-backed claim rather than simply rendering its existing meaning.
- Refresh deterministic validation/fingerprint evidence affected by content edits, especially the parking topic difficulty source fingerprint if validation reports it stale.
- Add content-level assertions that check visible rendered-material fields, not non-rendered `claims`.
- Add e2e smoke proving the timing contrast is visible in the chosen learner surface.
- Preserve active exam support-hiding and local-first/offline constraints.
- Keep this feature's `tasks.md` current with implementation decisions, dead ends, known issues, verification evidence, and Implementation Agent feedback.

Out of scope:

- Rendering all topic `claims` globally in `TopicGuideView`.
- Broadly redesigning `Материалы`, `CABA/RF`, navigation, exam flow, or support reveal behavior.
- Rewriting the whole parking topic, reassigning taxonomy-mixed parking tickets, or changing unrelated topic guide content.
- Changing canonical question answers or fallback practice-source status.
- Claiming complete official GCBA category B coverage.
- Adding a backend, runtime API, remote content fetch, analytics, live AI dependency, or external asset dependency.
- Editing durable docs outside this feature folder unless future implementation changes user-facing workflow, architecture, runtime, or deploy behavior beyond a narrow content addition.
- Merging directly to `main`.

## Architect Decisions

- Primary solution: add the contrast to existing rendered parking topic material, preferably one concise paragraph in `learningMaterialRu` and, only if useful, one focused trap note.
- Do not render `selectedTopic.claims` globally for this feature. The current gap exists because `claims` are source-backed metadata/source summaries, not polished learner prose. Rendering every claim would change many topics and carries unnecessary product risk.
- Keep ticket explanations for `b-fallback-028` and `b-fallback-412` focused on hospital/health entrances unless a tiny wording adjustment is needed to prevent confusion. Do not leak school/temple/bank timing into those ticket-specific explanations as if the health entrance rule were conditional.
- CABA/RF is optional, not required for the primary fix. Touch it only if implementation can add a compact, source-supported institutional-entrance contrast without broadening the feature. If CABA/RF is touched, add matching tests.
- Do not add vocabulary entries unless implementation determines the timing phrases need term cards for comprehension. The visible paragraph/trap note is enough if it includes the Spanish phrases directly.
- Content tests must assemble the text from fields the materials UI renders, such as `summaryRu`, `learningMaterialRu`, `practicalReasoningRu`, `spanishTerms`, `trapNotes`, and relevant ticket explanations. They must not pass solely because `claims` contain the timing contrast.
- E2E must assert actual DOM visibility in `Материалы` for the timing phrases.

## Assumptions

- Existing local source-trace evidence for `parking-clearances-distances-corners-and-cordon` is sufficient for this narrow content exposure.
- The phrase set in the user request is the desired learner-facing Spanish anchor set: `en horas de clase`, `oficios/ceremonias`, and `horario de atención al público`.
- `Материалы` is the correct primary surface because it already renders the parking topic study prose and trap notes.
- A content-only change to `content/guide/topic-study-guide.ru.json` should not require durable docs updates if no workflow, architecture, or rendering behavior changes.
- If the parking topic source fingerprint changes, the existing validation tooling will expose the stale fingerprint and the implementation should refresh only the affected deterministic evidence.

## User Stories

### User Story 1

As a learner studying parking clearances in `Материалы`, I want to see the timing contrast for school, temple, and bank entrances next to the hospital/health entrance rule, so that I do not memorize `10 metros` as one unconditional rule for every institution.

### User Story 2

As a low-Spanish learner, I want the exam-risk Spanish phrases `en horas de clase`, `oficios/ceremonias`, and `horario de atención al público` preserved with concise Russian support, so that I can recognize those qualifiers in exam wording.

### User Story 3

As a learner practicing the current hospital/health entrance tickets, I want the existing `10 metros de cada lado de la entrada` and `5 metros` trap explanation to remain clear, so that the new contrast does not weaken the current answer path.

### User Story 4

As a maintainer, I want tests and process memory to prove the contrast is visible in rendered learner material, not only present in non-rendered source claims.

## Acceptance Criteria

1. Given implementation begins, `feature-request.md`, `spec.md`, `plan.md`, and `tasks.md` exist in `specs/020-institution-entrance-timing-contrast/`.
2. Given `Материалы` renders the `parking-clearances-and-corners` topic, visible learner text includes `hospital/centro de salud` and `10 metros de cada lado de la entrada`.
3. Given the same topic renders, visible learner text presents `5 metros` as a trap/falso/wrong value for the hospital/health entrance context.
4. Given the same topic renders, visible learner text includes the school timing phrase `en horas de clase` or a source-equivalent Spanish-primary phrase with Russian support.
5. Given the same topic renders, visible learner text includes the temple timing phrase `oficios/ceremonias` or `oficios o ceremonias` with Russian support.
6. Given the same topic renders, visible learner text includes the bank timing phrase `horario de atención al público` with Russian support.
7. Given the timing contrast appears, it clearly distinguishes unconditional health entrance ticket logic from time-qualified school, temple, and bank entrance examples.
8. Given source-backed wording changes, the implementation records the checked source-trace basis and updates source-trace only if the existing claim/source-trace no longer matches the rendered content.
9. Given topic-guide content changes, affected deterministic fingerprints/evidence are refreshed as required by validators.
10. Given content tests are added or updated, they fail if the timing contrast is present only in `claims` and absent from fields rendered by `TopicGuideView`.
11. Given e2e tests run, at least one smoke assertion proves the timing contrast is visible in `Материалы` for the parking topic.
12. Given CABA/RF is edited, it remains compact, source-supported, separate from `Материалы`, and covered by tests.
13. Given active exam mode runs, translations/explanations/learning support remain hidden during the active attempt.
14. Given implementation is complete, `pnpm run validate:content`, `pnpm run test`, `pnpm run build`, `pnpm run test:e2e`, `pnpm run preflight`, and `git diff --check` pass or exact unrelated blockers are recorded.
15. Given runtime/local-first smoke is requested by the implementation scope, Docker commands `make build`, `make up`, smoke check at `http://localhost:5173`, and `make down` run successfully or exact environment blockers and cleanup attempts are recorded.
16. Given the PR is reviewed, `tasks.md` contains current process memory, verification evidence, known issues, dead ends, and Implementation Agent feedback before merge readiness.

## Negative Scenarios

- A data-only change that leaves the timing contrast only in `claims` does not satisfy this feature.
- A test that joins `claims` into the checked text can mask the bug and is not acceptable as the only content proof.
- Rendering all topic `claims` globally without a separate justified UI/content design is out of scope.
- Wording that implies schools, temples, and banks have the same unconditional rule as hospital/health entrances is a content bug.
- Wording that makes the hospital/health entrance rule sound conditional on school/temple/bank timing is a regression.
- Removing or weakening `10 metros de cada lado de la entrada` breaks the prior hospital/health fix.
- Presenting `5 metros` as a possible correct hospital/health entrance distance is a regression.
- Adding broad legal-guide prose or unrelated parking rules is out of scope.
- Adding unsupported source claims or stale source-trace evidence is not merge-ready.
- Changing active exam mode to reveal Russian support violates the exam boundary.

## Functional Requirements

- FR-001: Add visible learner-facing timing contrast to `parking-clearances-and-corners` rendered material.
- FR-002: Preserve visible `hospital/centro de salud`, `10 metros de cada lado de la entrada`, and `5 metros` trap wording.
- FR-003: Include school timing with `en horas de clase` or source-equivalent Spanish wording.
- FR-004: Include temple timing with `oficios/ceremonias` or `oficios o ceremonias`.
- FR-005: Include bank timing with `horario de atención al público`.
- FR-006: Keep the contrast concise and separate enough that health entrances remain unconditional in the learner's mental model.
- FR-007: Avoid global `claims` rendering; if implementation believes claim rendering is necessary, stop and record feedback for Architect/Orchestrator disposition.
- FR-008: Update source-trace, topic difficulty fingerprint, rationale counts, or other deterministic evidence only where validators or changed content require it.
- FR-009: Add/update content tests that check rendered-material fields and exclude `claims` from the proof path.
- FR-010: Add/update e2e smoke for `Материалы` visibility of the timing contrast.
- FR-011: Preserve active exam support-hiding and local-first/offline behavior.
- FR-012: Record all implementation decisions, verification evidence, known issues, and feedback in `tasks.md`.

## Implementation Boundaries

- Implementation Agent may edit product/content/test/durable docs only after complete feature memory exists and Orchestrator assigns the implementation slice.
- Recommended implementation is one narrow PR because the likely diff is content plus tests/evidence.
- Keep edits centered on:
  - `content/guide/topic-study-guide.ru.json`;
  - `tests/content-topic-guide.test.mjs`;
  - `tests/e2e/app.spec.ts`;
  - `content/guide/topic-study-guide.source-trace.json` only if existing source trace needs matching updates;
  - affected validation evidence/fingerprints only as required by validators;
  - `specs/020-institution-entrance-timing-contrast/tasks.md`.
- Avoid editing `src/App.tsx` unless the chosen visible surface cannot be satisfied by existing rendered fields. If UI rendering changes become necessary, record why the content-only path failed before editing UI.
- Avoid editing `content/guide/ru.condensed-guide.json` unless CABA/RF is deliberately chosen as an additional surface with tests.
- Do not edit unrelated feature folders, sibling worktrees, process enforcement files, or product code outside this narrow need.

## Verification Requirements

- Targeted content checks:
  - `node --test tests/content-topic-guide.test.mjs`;
  - test text must come from rendered-material fields, not `claims`.
- Content validation:
  - `pnpm run validate:content`;
  - refresh affected deterministic fingerprints/evidence before claiming validation complete.
- UI/regression checks:
  - `pnpm run test`;
  - `pnpm run build`;
  - `pnpm run test:e2e`;
  - `pnpm run preflight`;
  - `git diff --check`.
- Targeted e2e evidence:
  - open `Материалы`;
  - select or verify `parking-clearances-and-corners`;
  - assert visible `10 metros de cada lado de la entrada`;
  - assert visible `5 metros` trap/falso/wrong framing;
  - assert visible `en horas de clase`;
  - assert visible `oficios` and `ceremonias`;
  - assert visible `horario de atención al público`.
- Active exam/local-first evidence:
  - existing active exam support-hiding e2e must remain green;
  - no new runtime network dependency is introduced;
  - Docker smoke should run when feasible, with exact blocker recorded if Docker is unavailable.

## Review Requirements

- Review Agent must verify complete feature memory exists and role boundaries were followed.
- Review Agent must verify implementation did not render all topic `claims` globally.
- Review Agent must inspect the parking topic wording for clear unconditional health entrance logic and time-qualified school/temple/bank examples.
- Review Agent must verify the current `10 metros de cada lado de la entrada` and `5 metros` trap behavior remains visible.
- Review Agent must verify tests prove rendered visibility and do not rely only on non-rendered claims.
- Review Agent must check source-trace/fingerprint evidence is current for touched content.
- Review Agent must verify active exam support-hiding and local-first constraints were not regressed.
- Review Agent must check `tasks.md` contains implementation decisions, evidence, known issues, dead ends, and Implementation Agent feedback before merge readiness.
