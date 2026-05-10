# Spec: Learning Content UI Polish

## Analyst Intake

- Source request: `feature-request.md`.
- Active feature folder: `specs/013-learning-content-ui-polish/`.
- Assigned branch: `codex/013-learning-content-ui-polish`.
- Assigned worktree: `/Users/chap/devel/cabadrive-013-learning-content-ui-polish`.
- Architect scope: create and maintain only `spec.md`, `plan.md`, and `tasks.md` for this feature folder. Product code, content JSON, tests, durable docs, scripts, templates, commits, pushes, PRs, sibling feature memory, and sibling worktrees are out of scope for this Architect pass.

## Goal

Polish learner-facing content and UI around Cabadrive study surfaces so Russian-speaking learners can understand material tickets, key parking-clearance wording, vocabulary, CABA/RF contrasts, and ticket references with less repeated disclaimer noise while preserving official Spanish primacy, unofficial Russian-support clarity, and the current `unofficial_b_fallback` content-mode truth.

## Scope

In scope for the future implementation slice:

- Add Russian question and answer translations to canonical Spanish ticket blocks in `Материалы` when translations exist.
- Provide a clear missing-translation fallback in materials ticket blocks without hiding canonical Spanish text.
- Add or update Russian translation entries for parking-clearance tickets needed by this request, including `b-fallback-028` and `b-fallback-412`, with deterministic translation-alignment evidence.
- Correct and improve readability of the hospital/medical/health entrance parking-clearance material so it clearly teaches `10 metros de cada lado de la entrada`.
- Preserve important Spanish exam phrases in the affected material and pair them with Russian meanings, especially `entrada`, `hospital`, `centro de salud`, `10 metros de cada lado de la entrada`, and the trap phrase `5 metros de cada lado de la entrada`.
- Keep `b-fallback-028` and `b-fallback-412` explanations readable, mutually consistent, and explicit that `5 metros` is the wrong/trap value for the hospital/health entrance context.
- Expand vocabulary with a tightly scoped set of exam-relevant terms discovered in this feature, prioritizing terms used by the affected parking-clearance materials and any CABA/RF additions.
- Enrich or explicitly reposition the existing `CABA/RF` guide with source-supported, exam-relevant contrasts for Russian-speaking experienced drivers.
- Reduce repeated disclaimer/status noise in learner-facing repeated blocks, including removing visible per-ticket `Статус: неофициальная B-практика` from materials ticket metadata.
- Preserve compact content-mode/source clarity at product, section, or footer surfaces so the UI does not imply official or complete GCBA category B coverage.
- Show ticket IDs in the `Учить` question flow so learners can identify and report exact tickets.
- Update tests and verification evidence for all changed behavior.
- Check and record conflict handling with sibling feature `010` before implementation changes touch overlapping UI files.
- Keep this feature's process memory current with decisions, dead ends, known issues, verification evidence, and Implementation Agent feedback.

Out of scope:

- Editing `specs/014-orchestrator-first-enforcement/*` or changing repository process enforcement.
- Consuming, copying, or depending on unmerged files from sibling feature `010`.
- Replacing the current fallback question bank or claiming complete official GCBA category B coverage.
- Making Russian text the primary question source.
- Hiding all unofficial/fallback status information from the product.
- Broadly rewriting the 460-ticket topic guide, publishing the draft guide, or performing a full legal-source research pass.
- Creating a backend, runtime API, cloud sync, analytics, remote content fetch, live AI dependency, raw PDF viewer, or external asset dependency.
- Redesigning navigation or support-reveal behavior owned by `010` beyond the narrow ticket-ID/status/materials needs of this feature.
- Changing active exam behavior, except to verify that active exam still hides learning support.
- Editing files outside the assigned implementation slice or merging directly to `main`.

## Non-Goals

- Do not publish the draft topic guide or convert this polish slice into a final 460-ticket content-release gate.
- Do not build a new source-research program for CABA traffic law; use existing validated/archive-backed sources where available and record follow-ups where support is insufficient.
- Do not redesign Cabadrive's whole learning UX, navigation model, or answer-flow behavior beyond the scoped materials, CABA/RF, vocabulary, disclaimer-noise, and `Учить` ticket-ID changes.
- Do not change repository workflow enforcement; that belongs to feature `014`.
- Do not make unofficial Russian learning support appear official, complete, or primary over Spanish question text.

## Assumptions

- `Материалы` means the topic-materials view introduced by feature `008`, which renders `content/guide/topic-study-guide.ru.json` and joins guide ticket references to canonical questions.
- "Canonical Spanish question block in materials" means the ticket block that currently renders canonical Spanish question text and official Spanish answers from `content/questions/caba-b.unofficial-fallback.questions.json`.
- Russian translations should come from `content/translations/ru.translations.json` rather than ad hoc UI-only strings when they correspond to canonical question/answer text.
- Translation changes require refreshed `content/validation/ru-translation-alignment.evidence.json` entries for every changed or added translation.
- Existing guide terms in `content/guide/topic-study-guide.ru.json` may be improved when needed, but implementation should avoid broad topic-guide churn.
- CABA/RF enrichment should use existing source-supported content and local archived source evidence where available; unsupported assertions must be labeled as ticket-specific, omitted, or recorded as follow-up.
- Feature `010` may edit `src/App.tsx`, `src/styles.css`, `tests/e2e/app.spec.ts`, and durable docs. This feature must re-check `010` state immediately before implementation, then coordinate with Orchestrator on rebase/ordering.

## User Stories

### User Story 1

As a learner reading `Материалы`, I want each canonical ticket block to show the official Spanish question and answers plus Russian translations when available, so that I can connect the exam wording to meaning without leaving the material.

### User Story 2

As a learner studying hospital/health-center parking rules, I want the material to clearly teach `10 metros de cada lado de la entrada`, so that I do not confuse it with the `5 metros` trap.

### User Story 3

As a learner with low Spanish proficiency, I want important Spanish phrases preserved next to Russian meanings, so that I recognize the wording in a ticket instead of memorizing only Russian paraphrases.

### User Story 4

As a learner using `Учить`, I want to see the ticket ID on the question card, so that I can report or revisit the exact ticket.

### User Story 5

As a learner moving through repeated material blocks, I want fewer repeated status chips, while still seeing clear section-level truth about unofficial fallback content.

### User Story 6

As a maintainer, I want every translation/content polish change backed by validation and process memory, so that future changes can distinguish learner support from official-source claims.

## Acceptance Criteria

1. Given implementation begins, `feature-request.md`, `spec.md`, `plan.md`, and `tasks.md` exist in `specs/013-learning-content-ui-polish/`.
2. Given implementation planning is inspected, it records a conflict-check requirement for sibling feature `010` and prohibits consuming unmerged `010` files.
3. Given a materials ticket block renders a question that has a Russian translation entry, the block shows canonical Spanish question text and answers as primary and shows Russian question and answer translations as secondary support.
4. Given a materials ticket block renders a question without a Russian translation entry, the block shows a concise missing-translation fallback and keeps canonical Spanish text and answers usable.
5. Given materials ticket translations render, they use the existing translation data boundary or an equivalently testable local helper, not duplicated UI-only translation strings.
6. Given `b-fallback-028` and `b-fallback-412` are in the translation file after this feature, each entry has approved alignment evidence whose source and translation fingerprints match current content.
7. Given the parking-clearance material is viewed, it clearly states that hospital/health entrance parking clearance is `10 metros de cada lado de la entrada`.
8. Given the same material discusses `5 metros`, it presents that value as the wrong/trap value for the hospital/health entrance context, not as an alternate correct rule.
9. Given Spanish terms are rendered in the affected material, `entrada`, `hospital`, `centro de salud`, `10 metros de cada lado de la entrada`, and `5 metros de cada lado de la entrada` remain visible with Russian meanings where pedagogically useful and source/question wording supports them.
10. Given `b-fallback-028` and `b-fallback-412` ticket explanations are rendered in materials, they are readable, consistent with each other, and do not leak school/bank/temple qualification logic into the hospital/health-center rule except as carefully bounded contrast if source-supported.
11. Given vocabulary is expanded, every added term has a stable ID, Spanish term, Russian translation, category, explanation, example text, criticality, and `sourceQuestionIds` pointing to existing current questions.
12. Given vocabulary is expanded, added terms are scoped to touched material/CABA-RF gaps unless process memory records an explicit Architect-approved broader audit result.
13. Given CABA/RF is enriched, it remains a compact guide separate from `Материалы`, contains source-supported exam-relevant contrasts, and avoids unsupported official claims.
14. Given CABA/RF content cannot be responsibly enriched within this slice, implementation repositions it with clearer scope/status and records follow-up instead of padding it with unsupported content.
15. Given materials ticket metadata renders, visible repeated per-ticket `Статус: неофициальная B-практика` is removed or replaced with a less noisy non-repeated pattern.
16. Given repeated status noise is reduced, the app still visibly communicates at product or section level that current questions are unofficial fallback B practice and not a complete official GCBA bank.
17. Given the `Учить` question flow renders a question, the ticket ID is visible near the question metadata or heading in a way that is usable on desktop and mobile.
18. Given ticket IDs are added to `Учить`, active exam mode is not made more distracting unless the implementation intentionally preserves or adds only minimal exam-safe IDs with tests and process-memory justification.
19. Given support visibility is changed by sibling `010`, this feature preserves `010` mode rules after rebase: learning/support behavior may show support per `010`, and active exam attempts must keep translation/explanation support hidden.
20. Given implementation is complete, tests cover materials translations, missing-translation fallback, removal of repeated per-ticket status, product/section-level status clarity, `Учить` ticket ID visibility, and the parking-clearance text expectations.
21. Given content/translations change, `pnpm run validate:content` and `node --test tests/content-translation-alignment.test.mjs` pass with refreshed evidence.
22. Given topic guide or vocabulary content changes, `node --test tests/content-topic-guide.test.mjs` and `pnpm run validate:content` pass.
23. Given UI changes are made, `pnpm run test`, `pnpm run build`, `pnpm run test:e2e`, `pnpm run preflight`, and `git diff --check` pass or exact unrelated blockers are recorded.
24. Given runtime-affecting changes are included, Docker smoke evidence is recorded with `make build`, `make up`, a smoke check at `http://localhost:5173`, and `make down`, unless Orchestrator explicitly scopes it out due to an unrelated blocker.
25. Given Review Agent inspects the PR, process memory contains implementation decisions, verification evidence, known issues, dead ends, and Implementation Agent feedback.

## Negative Scenarios

- A materials ticket block that shows Russian translation instead of or above canonical Spanish in a way that makes Spanish secondary fails this feature.
- A materials ticket block that copies Russian translations directly into JSX instead of using governed content data creates drift and is not acceptable.
- Adding translations without matching approved translation-alignment evidence is not merge-ready.
- Saying only "10 m" without preserving `10 metros de cada lado de la entrada` weakens exam-term recognition and is incomplete.
- Presenting `5 metros` as a possible correct value for hospital/health entrances is a content bug.
- Removing every unofficial/fallback status from the app creates a misleading official-coverage impression and is not acceptable.
- Keeping visible `Статус: неофициальная B-практика` inside every materials ticket metadata row does not satisfy the noise-reduction request.
- Expanding vocabulary with generic Spanish-course terms unrelated to touched exam content is out of scope.
- Padding CABA/RF with unsourced general driving-law contrasts is out of scope.
- Implementing on top of unmerged `010` files copied from the sibling worktree violates the parallel-work boundary.
- Overwriting `010` support reveal/navigation behavior while adding ticket IDs is a conflict regression.
- Changing active exam attempts to reveal translations, explanations, or learning support violates the exam boundary.

## Functional Requirements

- FR-001: Render Russian question translation in materials ticket blocks when `translationByQuestion` has an entry for the canonical question.
- FR-002: Render Russian answer translations next to or beneath the corresponding Spanish answer in materials ticket blocks when available.
- FR-003: Render a concise, non-blocking missing-translation fallback when no translation entry exists for a materials ticket.
- FR-004: Keep canonical Spanish question text and answer options visually primary in materials ticket blocks.
- FR-005: Add or update translation entries for `b-fallback-028` and `b-fallback-412` if they are needed to satisfy the materials translation acceptance criteria.
- FR-006: Refresh translation alignment evidence for every added or changed translation entry.
- FR-007: Improve parking-clearance guide prose, terms, ticket explanations, and trap notes only as needed to teach the hospital/health entrance `10 metros de cada lado de la entrada` rule clearly.
- FR-008: Preserve and translate key Spanish phrases in affected parking-clearance material.
- FR-009: Expand vocabulary with targeted terms from affected material and CABA/RF additions, preserving validator-compatible structure.
- FR-010: Enrich or reposition `CABA/RF` with compact, source-supported, exam-relevant learner content.
- FR-011: Remove visible repeated per-ticket `Статус: неофициальная B-практика` from materials ticket metadata while keeping compact status clarity elsewhere.
- FR-012: Show ticket IDs in the `Учить` question flow.
- FR-013: Update or add focused e2e/unit/content tests for changed UI and content behavior.
- FR-014: Record conflict-check results with `010`, process decisions, verification evidence, and Implementation Agent feedback in `tasks.md`.

## Implementation Boundaries

- Implementation Agent may edit product/content/test/durable docs only after complete feature memory exists and Orchestrator assigns the implementation slice.
- Architect recommends one implementation PR for 013 unless Orchestrator chooses to split content and UI. If split, translation/content validation must land with the UI that depends on it or be clearly ordered.
- Implementation must not edit `specs/014-orchestrator-first-enforcement/*`.
- Implementation may read sibling `010` feature memory and status but must not copy unmerged sibling source files into this branch.
- If `010` has merged or is expected to merge first, Implementation should sync/rebase from `origin/main` and adapt the 013 UI changes to the merged shape.
- If `010` remains unmerged and touches the same UI file lines, Implementation must record the conflict in process memory and ask Orchestrator for ordering rather than guessing.

## Conflict Checks With 010

Implementation must perform these checks before product edits:

- Read current `origin/main` state and current branch state for `src/App.tsx`, `src/styles.css`, `tests/e2e/app.spec.ts`, and relevant durable docs.
- Inspect sibling `010` feature memory read-only for active decisions around `QuestionCard`, post-answer support reveal, bottom navigation, and source-of-truth docs.
- Run `git diff --stat` in the sibling `010` worktree read-only if available, and record overlap.
- If 010 is merged, rebase or fast-forward this branch before editing UI behavior.
- If 010 is unmerged, avoid consuming its files and design 013 changes as small patches that can survive rebase: add ticket-ID rendering as local metadata, add materials translation rendering in `TopicGuideTicketBlock`, and update tests with selectors that do not assume pre-010 navigation layout.

## Verification Requirements

- Content validation:
  - `pnpm run validate:content`;
  - `node --test tests/content-translation-alignment.test.mjs` when translations/evidence change;
  - `node --test tests/content-topic-guide.test.mjs` when topic guide content changes.
- UI and regression validation:
  - `pnpm run test`;
  - `pnpm run build`;
  - `pnpm run test:e2e`;
  - `pnpm run preflight`;
  - `git diff --check`.
- Targeted evidence:
  - e2e or DOM assertions that materials ticket blocks show Spanish and Russian translation support for at least one translated ticket;
  - e2e or DOM assertions for missing translation fallback;
  - text-search or e2e evidence that repeated per-ticket `Статус: неофициальная B-практика` is gone from materials ticket metadata;
  - e2e evidence that section/product-level unofficial fallback status remains visible;
  - e2e evidence that `Учить` shows the current ticket ID;
  - targeted content assertions for `10 metros de cada lado de la entrada` and `5 metros` trap handling in affected materials;
  - screenshot or DOM evidence for mobile if ticket ID/status layout changes materially.
- Docker evidence:
  - For runtime-affecting PRs, run `make build`, `make up`, smoke check `http://localhost:5173`, and `make down`, unless an unrelated environment blocker is recorded.

## Review Requirements

- Review Agent must verify this PR has complete feature memory and follows Architect/Implementation/Review role boundaries.
- Review Agent must check that no files under `specs/014-orchestrator-first-enforcement/` were edited.
- Review Agent must check that unmerged `010` files were not copied or consumed.
- Review Agent must inspect UI changes for preserving Spanish-primary display and unofficial Russian-support semantics.
- Review Agent must inspect translation changes and evidence for stale or missing fingerprints.
- Review Agent must inspect parking-clearance wording for the hospital/health entrance `10 metros de cada lado de la entrada` rule and the `5 metros` trap.
- Review Agent must check that repeated status noise is reduced without hiding fallback content-mode truth.
- Review Agent must check that ticket IDs in `Учить` do not regress active exam support-hiding behavior.
- Review Agent must check that tests and process memory include acceptance evidence before merge readiness.
