# Feature Request: Learning Content UI Polish

## Analyst Artifact Status

Created by Analyst intake in worktree `/Users/chap/devel/cabadrive-013-learning-content-ui-polish` on branch `codex/013-learning-content-ui-polish`.

This artifact records request intake only. It intentionally does not include technical architecture, implementation planning, task breakdown, source edits, tests, commits, pushes, PR state, or files outside this assigned `feature-request.md`.

## Orchestrator Routing Context

- Orchestrator entry: the parent Orchestrator restarted the work after an improper direct-edit attempt and delegated intake to Analyst.
- Assigned intake worktree/branch: `/Users/chap/devel/cabadrive-013-learning-content-ui-polish`, `codex/013-learning-content-ui-polish`.
- Base context: current worktree was reset clean from `origin/main` before this Analyst pass.
- Parallel-work note: sibling worktrees exist at `/Users/chap/devel/cabadrive-010-ui-ux-learning-intake` and `/Users/chap/devel/cabadrive-012-orchestrator-final-validation-loop`; their branches, diffs, PR state, and feature memory must be preserved.

## Numbering Decision

The current worktree's local `specs/` tree contains feature folders through numeric prefix `011`. A sibling worktree already contains `specs/012-orchestrator-final-validation-loop/`, and the assigned branch name is `codex/013-learning-content-ui-polish`.

To avoid a foreseeable collision with active parallel feature `012`, this learner-facing intake uses `specs/013-learning-content-ui-polish/`. This follows the repository's parallel-work preservation intent and matches the assigned branch.

## Scope Split Decision

This request contains two independent goals:

- learner-facing content/UI polish for Cabadrive study surfaces;
- repository process hardening so future repository-changing requests are routed through Orchestrator first.

Analyst split them into separate feature folders because they affect different ownership boundaries, acceptance evidence, and review surfaces. This `013` feature covers only learner-facing content/UI polish. The protocol hardening request is captured separately in `specs/014-orchestrator-first-enforcement/feature-request.md`.

## User Request

The user originally requested learner-facing fixes:

- Add Russian translation to the canonical Spanish question block in materials.
- Correct and improve readability of the hospital/medical entrance parking-clearance text so it teaches `10 metros de cada lado de la entrada`.
- Preserve and translate Spanish phrases used in the hospital/medical entrance material.
- Expand vocabulary.
- Enrich or reconsider sparse `CABA/RF` content.
- Reduce excessive disclaimers.
- Remove visible per-ticket `Статус: неофициальная B-практика`.
- Show ticket IDs in the `Учить` section.
- Check for conflicts with feature `010`.

After that, the user corrected process and asked that all work restart by protocol through Orchestrator. That process-correction portion is not implemented here; it is recorded as separate feature `014`.

## Clarified Answers And Assumptions

- No clarification questions were asked because the requested learner-facing fixes are specific enough for Architect planning.
- This is a product/content/UI feature, not a repository-process feature.
- "Materials" is interpreted as the `Материалы` topic materials view that renders guide ticket blocks by joining guide ticket references to canonical bundled questions and answers.
- "Canonical Spanish question block in materials" is interpreted as the block currently showing canonical Spanish question text and official Spanish answers inside each materials ticket block.
- The requested Russian translation in materials should use the existing translation layer where possible and must preserve official Spanish primacy.
- The hospital/medical entrance issue concerns parking-clearance tickets such as `b-fallback-028` and `b-fallback-412`, and related learning material in `content/guide/topic-study-guide.ru.json`.
- The parking-clearance teaching target is that hospital/medical/health entrance questions should clearly teach `10 metros de cada lado de la entrada`, while false/incorrect `5 metros` variants remain explained as traps.
- "Preserve and translate Spanish phrases" means important Spanish exam phrases should remain visible and be paired with Russian meaning, not replaced by Russian-only prose.
- "Expand vocabulary" is accepted as targeted expansion for learner-facing gaps discovered in this request, especially terms used in the affected materials, ticket blocks, and CABA/RF guide. Architect should decide exact scope and validation format.
- "Enrich or reconsider sparse CABA/RF" means the existing compact CABA/RF guide should either receive useful additional learner content or be intentionally repositioned if current content is too thin, without making unsupported official claims.
- "Reduce excessive disclaimers" means keep source/status clarity at product/status surfaces or concise section-level wording, but avoid repetitive noisy disclaimers inside every repeated learning block.
- "Remove visible per-ticket `Статус: неофициальная B-практика`" applies to repeated materials ticket metadata. It does not remove the underlying content status from data, validation, or higher-level UI status surfaces.
- "Show ticket IDs in `Учить`" applies to the learning question flow, so learners can identify and report exact tickets while studying.
- Feature `010` is parallel context and may change support reveal/navigation/source-of-truth behavior. This feature must check for conflicts and should not consume unmerged files from the `010` worktree.

## Project Context Reviewed

- `.specify/memory/constitution.md`: spec-first development, Orchestrator-first entry, role boundaries, process memory, PR-only workflow, and parallel-work preservation.
- `docs_project/README.md`: durable documentation baseline and read order.
- `docs_project/project-idea.md`: Cabadrive purpose, Spanish-primary/Russian-support positioning, target user, and local-first exam-prep focus.
- `docs_project/project/frontend/frontend-docs.md`: current React/Vite/PWA shape, Docker-only runtime, content mode, UI rules, materials behavior, and CABA/RF separation.
- `docs_project/project/backend/backend-docs.md`: no-backend MVP and content-validation tooling boundaries.
- `docs_project/project/feature-inventory.md`: current MVP surfaces, unofficial fallback content mode, materials, vocabulary, CABA/RF guide, and offline behavior.
- `docs_project/screens/learning-and-exam-flows.md`: learn, exam, mistake review, vocabulary, materials, and CABA/RF flows.
- `docs/specify/README.md`: original product constraints, canonical terms, and definition of success.
- `specs/005-translation-validation-toggle/*`: Spanish-primary translation reveal behavior, alignment evidence, and product-level status clarity instead of repeated per-card disclaimers.
- `specs/006-topic-study-guide/tasks.md`: prior parking-clearance source evidence and review-fix notes around hospital/health-center 10 m logic.
- `specs/008-learning-materials-ui/*`: materials surface context.
- `specs/010-ui-ux-learning-source-of-truth/*` in sibling worktree: parallel support reveal/navigation/source-of-truth context that must be checked for conflicts.
- `src/App.tsx`: current learning question card, materials ticket block, per-ticket status span, source line, and navigation surfaces inspected for intake context only.
- `content/guide/topic-study-guide.ru.json`: parking-clearance material, Spanish terms, and ticket explanations inspected for intake context only.
- `content/questions/caba-b.unofficial-fallback.questions.json`: `b-fallback-028` and `b-fallback-412` canonical Spanish tickets inspected for intake context only.
- `content/translations/ru.translations.json`, `content/explanations/ru.explanations.json`, and `content/vocabulary/ru.vocabulary.json`: existing Russian support layers inspected for intake context only.
- `tests/e2e/app.spec.ts`: current materials assertions and visible status expectations inspected for likely verification impact.

## External Research

External research was not used. The request can be framed from existing repository content, local archived official documents, and prior Cabadrive feature memory. If Architect or Implementation Agent needs to verify current legal text beyond archived local sources, that should be explicitly scoped and recorded.

## Problem Statement

Cabadrive has the right broad direction for Spanish-primary questions with Russian learning support, but several learner-facing surfaces still feel unfinished or noisy:

- materials ticket blocks show canonical Spanish text and answers but do not show the existing Russian translation alongside that canonical ticket context;
- repeated ticket-level status labels add noise where a section-level/source-level status would be enough;
- the hospital/medical entrance parking-clearance material needs to be clearer and more readable around the exam-critical rule `10 metros de cada lado de la entrada`;
- vocabulary and CABA/RF support may be too sparse for the targeted learner;
- the learning view lacks visible ticket IDs for reporting and cross-reference;
- parallel feature `010` may touch overlapping learning UX behavior and must be coordinated rather than accidentally overwritten.

## Desired Product Outcome

The learner should be able to study materials and question cards with less friction:

- official Spanish remains visible and primary;
- Russian support appears where it helps comprehension, including inside materials ticket blocks;
- key Spanish phrases are preserved and paired with concise Russian meaning;
- hospital/medical entrance parking-clearance content teaches the 10 m rule clearly and avoids confusing school/bank/temple qualification leakage;
- repeated disclaimers are reduced without hiding the unofficial fallback status of the current content set;
- ticket IDs are easy to see in `Учить`;
- vocabulary and CABA/RF support are meaningfully richer where currently thin;
- implementation is checked against the parallel `010` source-of-truth/support/navigation work.

## Role Boundaries Or Affected Actors

- Orchestrator: coordinates this learner-facing feature after Analyst handoff, preserves sibling worktrees, and routes planning/implementation/review to the correct roles.
- Architect: starts from this intake and owns `spec.md`, `plan.md`, and `tasks.md`; must define exact scope, acceptance criteria, negative scenarios, conflict checks with `010`, and verification requirements.
- Implementation Agent: may edit product/content/test/docs files only after complete feature memory exists and only in an assigned isolated worktree/branch/PR slice.
- Review Agent: should review for learner-facing regressions, source/status clarity, content correctness, missing tests, and role/process compliance.

## Open Questions And Risks

- Feature `010` may already plan or implement overlapping support reveal/navigation/source-of-truth work. Architect should specify whether `013` waits for `010`, rebases after `010`, or limits itself to non-overlapping content/UI adjustments.
- Removing repeated per-ticket status labels must not create an implied claim that the fallback question set is official or complete.
- Adding Russian translations to materials must not make Russian text visually primary over official Spanish.
- Translation and vocabulary changes may require refreshed deterministic validation evidence, including translation alignment fingerprints if existing translation files change.
- Hospital/medical parking-clearance content must stay aligned with local archived official-source evidence and prior `006` review-fix notes.
- Expanding CABA/RF can easily become a broad local-law guide; Architect should constrain it to exam-relevant, source-supported differences for Russian-speaking experienced drivers.
- "Expand vocabulary" is broad. Architect should define whether this feature expands only terms needed by the touched materials or performs a wider vocabulary audit.
- Existing e2e tests currently assert the repeated materials status label. Tests will likely need intentional updates if Architect scopes its removal.

## Acceptance Expectations

- Complete feature memory exists before implementation: `feature-request.md`, `spec.md`, `plan.md`, and `tasks.md`.
- The Architect plan explicitly checks for conflicts with sibling feature `010` and states how implementation will avoid consuming unmerged `010` work.
- Materials ticket blocks show Russian question translation and answer translations, when available, alongside canonical Spanish question and answers without making Russian primary.
- Materials ticket blocks have a clear fallback when a Russian translation is missing.
- The hospital/medical entrance parking-clearance material clearly teaches `10 metros de cada lado de la entrada`.
- Spanish phrases such as `entrada`, `hospital`, `centro de salud`, and `10 metros de cada lado de la entrada` remain visible where pedagogically useful and are paired with Russian meaning.
- The `b-fallback-028` and `b-fallback-412` explanations stay readable, consistent with each other, and clear that `5 metros` is the wrong/trap value for the hospital/health entrance context.
- Vocabulary is expanded according to an Architect-scoped rule, with source question links/provenance and validation coverage where existing validators require it.
- `CABA/RF` is enriched or explicitly reconsidered according to Architect-scoped exam-relevant criteria, without unsupported official claims.
- Repeated visible per-ticket `Статус: неофициальная B-практика` is removed or replaced with a less noisy pattern, while product-level/source-level unofficial fallback clarity remains visible.
- Ticket IDs are visible in the `Учить` question flow.
- Existing Spanish-primary, unofficial Russian support, active exam support-hiding, local-first, and Docker-only runtime constraints remain intact.
- Verification evidence should include relevant content validation, unit/e2e tests for affected UI behavior, build/preflight as scoped by Architect, and targeted text-search or screenshot evidence for the status-label and ticket-ID changes.

## Handoff

Analyst hands this learner-facing intake to Orchestrator and shuts down. Architect should create `spec.md`, `plan.md`, and `tasks.md` for `specs/013-learning-content-ui-polish/` before any implementation begins.
