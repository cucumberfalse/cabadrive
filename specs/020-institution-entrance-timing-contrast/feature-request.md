# Feature Request: Institution Entrance Timing Contrast

## Analyst Artifact Status

Created by Analyst intake in worktree `/Users/chap/devel/cabadrive-020-institution-entrance-timing-contrast` on branch `codex/020-institution-entrance-timing-contrast`.

This artifact records request intake only. It intentionally does not include technical architecture, implementation planning, task breakdown, source edits, tests, commits, pushes, PR state, or files outside this assigned `feature-request.md`.

## Orchestrator Routing Context

- Orchestrator request: final Orchestrator validation on latest `main` commit `2af08b0` found that the original customer task remains incomplete in visible learner material.
- Assigned intake worktree/branch: `/Users/chap/devel/cabadrive-020-institution-entrance-timing-contrast`, `codex/020-institution-entrance-timing-contrast`.
- Current worktree evidence before intake edit: active branch matched the assignment, `git rev-parse HEAD` returned `2af08b0b918fadb14504ae63a7b2850070906992`, and `git status --short` returned no tracked or untracked changes before creating this feature folder.
- Existing local feature folders reached numeric prefix `019`; this assigned follow-up uses the next numeric prefix, `020`, matching the branch name and requested feature folder.

## Scope Split Decision

This request is one cohesive learner-facing content gap: the institutional entrance parking-clearance rule already teaches the hospital/health entrance distance, but not the related timing contrast for school, temple, and bank entrances where learners can see it.

No scope split is needed for Analyst intake. Architect may still slice implementation work if the fix touches multiple learner surfaces.

## User Request

The repository-changing request is to create an intake artifact for the remaining visible learner-material gap:

- The app visibly teaches the hospital/health entrance rule `10 metros de cada lado de la entrada`.
- The app visibly teaches that `5 metros` is a trap in the hospital/health entrance context.
- The original customer also specified related timing contrast:
  - schools: the rule applies `en horas de clase`;
  - temples: the rule applies during `oficios/ceremonias`;
  - banks: the rule applies during `horario de atención al público`.
- Current source-backed JSON mentions this timing contrast, but rendered materials/CABA-RF smoke evidence showed only the hospital/health phrasing, not the school/temple/bank timing nuance in learner-facing text.
- Create `specs/020-institution-entrance-timing-contrast/feature-request.md` only. Do not edit any other files.
- No Q&A needed; record assumptions.

## Project Context Reviewed

- `.specify/memory/constitution.md`: spec-first development, role boundaries, final validation loop, process memory, PR-only workflow, and one worktree per task.
- `docs_project/README.md`: durable documentation baseline and read order.
- `docs_project/project-idea.md`: Cabadrive purpose, Spanish-primary/Russian-support positioning, and target learner.
- `docs_project/project/frontend/frontend-docs.md`: current React/Vite local-first app, content mode, UI rules, materials behavior, and CABA/RF separation.
- `docs_project/project/backend/backend-docs.md`: no-backend MVP and content-validation tooling boundaries.
- `docs_project/project/feature-inventory.md`: current materials, CABA/RF, difficulty, local-first, and unofficial fallback behavior.
- `docs_project/screens/learning-and-exam-flows.md`: materials and CABA/RF learner flows.
- `docs/specify/README.md`: original product constraints, source validation mindset, and definition of success.
- `specs/013-learning-content-ui-polish/*`: prior hospital/health entrance learner-facing fix and process memory.
- `specs/006-topic-study-guide/tasks.md`: prior source-trace and review-fix notes for parking clearances, including the time-qualified school/temple/bank entrance rules.
- `content/guide/topic-study-guide.ru.json`: parking topic visible material, trap notes, ticket explanations, and source-backed claims inspected read-only.
- `content/guide/topic-study-guide.source-trace.json`: source-trace note for Ley 2148 7.1.9(l) inspected read-only.
- `content/guide/ru.condensed-guide.json`: CABA/RF compact guide inspected read-only.
- `src/App.tsx`: materials rendering path inspected read-only to check whether topic `claims` are displayed.
- `tests/e2e/app.spec.ts` and `tests/content-topic-guide.test.mjs`: current smoke/content assertions inspected read-only.

## External Research

No external research was used. The requested gap is already grounded in local feature memory and local source-backed content. Architect may require implementation to re-check the archived official Ley 2148 evidence if content wording changes beyond the already recorded claim/source-trace scope.

## Discovered Visible-Content Gap

The latest mainline content has the hospital/health entrance rule visible in learner-facing material, but the related school/temple/bank timing contrast is only present in source-backed claim data that the current materials UI does not render.

Read-only local inspection found:

- `content/guide/topic-study-guide.ru.json` visible parking material teaches `hospital/centro de salud`, `entrada`, `10 metros de cada lado de la entrada`, and the `5 metros` trap in `learningMaterialRu`, `spanishTerms`, `tickets`, and `trapNotes`.
- The timing contrast appears in `content/guide/topic-study-guide.ru.json` under the parking topic's `claims[0].textRu`: it says the 10 m offset for schools, temples, and banks depends on class hours, services/ceremonies, or `horario de atención al público`.
- `src/App.tsx` `TopicGuideView` renders `summaryRu`, `learningMaterialRu`, `practicalReasoningRu`, `spanishTerms`, `tickets`, and `trapNotes`; it does not render `selectedTopic.claims`.
- `content/guide/ru.condensed-guide.json` CABA/RF item `guide-parking-health-entrance` only covers `hospital/centro de salud`, `10 metros de cada lado de la entrada`, and `5 metros` as trap wording.
- `tests/e2e/app.spec.ts` CABA/RF smoke asserts the title `Входы в больницы и centros de salud`, matching the hospital/health phrasing. It does not assert school, temple, bank, `horas de clase`, `oficios`, `ceremonias`, or `horario de atención al público`.
- `tests/content-topic-guide.test.mjs` currently asserts the hospital/health `10 metros` rule and `5 metros` trap handling, not the school/temple/bank timing contrast.

## Local Validation Evidence

Read-only inspection and small local scripts produced the following evidence:

- Worktree/branch evidence:
  - `pwd` returned `/Users/chap/devel/cabadrive-020-institution-entrance-timing-contrast`.
  - `git rev-parse --abbrev-ref HEAD` returned `codex/020-institution-entrance-timing-contrast`.
  - `git rev-parse HEAD` returned `2af08b0b918fadb14504ae63a7b2850070906992`.
  - `git status --short` returned no output before the Analyst artifact was created.
- Feature numbering evidence:
  - `specs/` contained feature folders through `019-learning-polish-process-memory-closure`.
  - No `specs/020-*` folder existed before this intake.
- Source-backed timing evidence:
  - `specs/006-topic-study-guide/tasks.md` records that archived Ley 2148 evidence includes `10 m around hospital/health-center entrances` and `time-qualified 10 m rules for school, temple and bank entrances`.
  - `specs/006-topic-study-guide/tasks.md` also records a PR #28 review fix: school entrances are qualified by class hours, temple entrances by services/ceremonies, and bank entrances by public service hours under Ley 2148 7.1.9(l).
  - `content/guide/topic-study-guide.source-trace.json` says the hospital/health-center 10 m ticket logic is unconditional for those health entrances, while school, temple, and bank entrance examples are time-qualified by Ley 2148 7.1.9(l).
- Renderability evidence from local code/data inspection:
  - A local script over the parking topic showed `learningMaterial`, `trapNotes`, and `terms` contained hospital/health wording but not the school/temple/bank timing phrases.
  - The same script showed `claims` contained school/temple/bank timing wording, including `horario de atención al público`.
  - A render-path reconstruction using the fields currently rendered by `TopicGuideView` showed:
    - likely rendered materials: `hospital/centro de salud`, `10 metros de cada lado de la entrada`, and `5 metros` present;
    - likely rendered materials: `horas de clase`, `oficios`, `ceremonias`, `horario de atención al público`, school, temple, and bank timing terms absent;
    - source claims: timing contrast present;
    - CABA/RF guide: hospital/health wording present and timing contrast absent.
- Smoke-test evidence:
  - `tests/e2e/app.spec.ts` materials smoke checks the first learning paragraph, first term, first trap note, ticket block translations, and removed repeated per-ticket status; it does not check topic `claims`.
  - `tests/e2e/app.spec.ts` CABA/RF smoke checks the compact hospital/health guide title and does not check the timing contrast.

No product validation command was run because the Analyst role is only creating intake memory and the requested artifact is content/process memory, not implementation.

## Problem Statement

The learner can currently see and practice the hospital/health entrance distance rule, but cannot reliably learn the adjacent institutional timing nuance from visible learner-facing surfaces. That makes the original customer request incomplete in spirit: the app captures the timing contrast in source-backed JSON/process memory, but the learner experience still over-focuses on hospital/health entrances and omits the school/temple/bank timing qualifiers.

For the target user, this matters because the exam risk is not just the number `10 metros`; it is recognizing when the same institutional entrance pattern is unconditional for health entrances versus time-qualified for other institutions.

## Desired Product Outcome

Learner-facing materials should make the full contrast visible and memorable while preserving the existing hospital/health fix:

- health entrances: `hospital/centro de salud` keep the existing `10 metros de cada lado de la entrada` teaching and `5 metros` trap framing;
- schools: the 10 m institutional entrance rule is time-qualified by `en horas de clase`;
- temples: the 10 m institutional entrance rule is time-qualified during `oficios/ceremonias`;
- banks: the 10 m institutional entrance rule is time-qualified during `horario de atención al público`;
- the wording should remain Spanish-primary where exam phrases matter and should pair those phrases with concise Russian learning support;
- the contrast should appear in visible learner material, not only in source-trace metadata or non-rendered claims.

## Assumptions

- No Q&A is needed because the Orchestrator report identifies the gap, the expected timing phrases, and the affected learner-facing surfaces.
- The relevant official-source basis is the already archived/local Ley 2148 7.1.9(l) evidence recorded by feature `006`; no live legal research is required for intake.
- The implementation should not remove or weaken the current hospital/health entrance `10 metros de cada lado de la entrada` and `5 metros` trap behavior.
- The fix can be satisfied by adding or exposing timing contrast in one or more existing learner-facing surfaces, such as `Материалы` and/or `CABA/RF`, as Architect scopes.
- If `claims` become rendered, Architect should decide whether all topic claims are appropriate learner-facing content or whether this specific contrast should be moved into already-rendered material/trap/contrast fields.
- The content should avoid implying that all institutional entrances share the same unconditional rule.
- The timing contrast should remain exam-focused and concise, not expand into a general legal guide.

## Risks

- Rendering all source-backed `claims` could expose dense or not-yet-polished content across topics, changing more learner material than intended.
- Adding school/temple/bank timing into the existing hospital/health paragraph could blur the current clear hospital rule if not carefully separated.
- Rewording source-backed legal claims may require refreshed deterministic validation evidence, topic difficulty fingerprints, source-trace checks, and focused tests.
- Tests that only assert the hospital/health rule may pass while the original timing gap remains invisible.
- The Spanish phrases have accents and variants: `atención`, `oficios`, `ceremonias`, and `en horas de clase` should be preserved accurately enough for exam recognition.
- The customer specifically asked for visible learner material; a data-only change or source-trace-only change would not satisfy the request.

## Open Questions

- Which visible surface should own the contrast: the parking topic's short material, trap notes, an explicitly rendered claim/callout, CABA/RF, or multiple surfaces?
- Should `TopicGuideView` start rendering selected topic `claims`, or should the timing contrast be duplicated/moved into fields that already render?
- Should the CABA/RF item be renamed from hospital/health only to a broader institutional entrance contrast, or should a separate compact item be added?
- What is the minimum test coverage: content-level assertions, e2e text visibility in `Материалы`, CABA/RF smoke, or all of them?

## Acceptance Expectations

- Complete feature memory exists before implementation: `feature-request.md`, `spec.md`, `plan.md`, and `tasks.md`.
- Learner-facing text visibly includes the school timing phrase `en horas de clase` or an equally precise Spanish-primary equivalent paired with Russian support.
- Learner-facing text visibly includes the temple timing phrase `oficios/ceremonias` or an equally precise Spanish-primary equivalent paired with Russian support.
- Learner-facing text visibly includes the bank timing phrase `horario de atención al público` paired with Russian support.
- Learner-facing text preserves the current hospital/health entrance rule `10 metros de cada lado de la entrada`.
- Learner-facing text preserves the current `5 metros` trap/falso framing for the hospital/health entrance context.
- The contrast clearly distinguishes unconditional health entrance logic from time-qualified school, temple, and bank entrance examples.
- The fix appears in rendered learner material, not only in source-trace JSON, validation evidence, or non-rendered topic claims.
- Verification includes targeted evidence that the timing contrast is visible in the implemented learner surface, preferably through content assertions and e2e smoke for the chosen surface.
- Existing Spanish-primary, unofficial Russian-support, local-first, active-exam support-hiding, and Docker-only runtime constraints remain intact.
- Any content/evidence fingerprints affected by implementation are refreshed and validated as scoped by Architect.

## Handoff

Analyst hands this intake to Orchestrator and shuts down. Architect should create `spec.md`, `plan.md`, and `tasks.md` for `specs/020-institution-entrance-timing-contrast/` before any implementation begins.
