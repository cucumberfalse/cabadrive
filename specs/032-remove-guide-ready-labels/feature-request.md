# Feature Request: Remove Ready Labels From Guide Navigation

## Analyst Artifact Status

Created by Analyst intake for Orchestrator-routed repository-changing request.

## Orchestrator Routing Context

- Orchestrator entry: The user first addressed the active model as Orchestrator and requested a repository-changing UI fix: "ты оркестратор; убери метки готово в руководстве". Orchestrator then assigned Analyst intake.
- Active-model stop condition: Not applicable for this assigned Analyst turn; Analyst was explicitly invoked by Orchestrator and did not implement product changes.
- Read-only transition context: Not applicable; the original request implied repository changes from the start.
- Assigned intake worktree/branch: `/Users/chap/devel/cabadrive-worktrees/032-remove-guide-ready-labels` on branch `codex/032-remove-guide-ready-labels`.
- Latest-main base evidence: Orchestrator reported `git fetch origin main` verification with base SHA `51e42f657d867fb802bbe3a68591b6008b45a60f`. Analyst confirmed the assigned worktree HEAD is `51e42f657d867fb802bbe3a68591b6008b45a60f`.
- Parallel-work note: Parallel worktrees/branches may exist. Preserve all existing dirty diffs, branches, commits, PRs, and process memory. Do not touch sibling worktrees.
- Accidental-start recovery context: None.
- Cleanup context: Not applicable for intake. Any later cleanup must be assigned separately and must preserve active or ambiguous worktrees.

## User Request

Original request:

> ты оркестратор
> убери метки готово в руководстве

Orchestrator assignment context:

> В приложенном скриншоте видна навигация раздела `Руководство`: рядом с пунктами глав/разделов отображаются метки `готово`; нужно убрать эти видимые метки из UI руководства.

Screenshot-derived context: In the `Руководство` navigation, the manual section `Приложение III. Перевозка грузов и товаров` and its child rows show visible `готово` labels aligned to the right of items such as `Профиль перевозчика грузов`, `Социальная ответственность`, `Факторы, участвующие в вождении`, `Безопасное вождение`, `Элементы безопасности`, and `Автомагистрали`. The user wants these visible ready labels removed.

## Clarified Answers And Assumptions

- No clarification was requested because the request and screenshot identify both the affected surface (`Руководство`) and the UI element to remove (`готово` labels).
- Assumption: The requested change is visual/UI-facing only: remove the visible `готово` markers from the guide/manual navigation, while preserving underlying data, converted/pending status logic, routing, active-row highlighting, and section availability behavior.
- Assumption: The scope is limited to the `Руководство` surface. Other product status labels or required source/content mode labels elsewhere should not be removed unless Architect explicitly scopes them.
- Assumption: If a shared component renders these labels, implementation should adjust it narrowly enough to avoid regressions in unrelated surfaces.

## Project Context Reviewed

- `.specify/memory/constitution.md`: spec-first workflow, role boundaries, one-worktree-per-task, process memory, verification, and final-validation requirements.
- `docs_project/README.md`: durable project documentation read order and feature memory location.
- `docs_project/project-idea.md`: Cabadrive audience, local-first exam-prep purpose, and official Spanish plus unofficial Russian support boundary.
- `docs_project/project/frontend/frontend-docs.md`: current React/Vite local-first frontend, Docker runtime contract, and `Руководство` as the user-facing Russian interactive manual destination.
- `docs_project/project/backend/backend-docs.md`: no runtime backend; relevant validation and manual-content tooling context.
- `docs_project/project/feature-inventory.md`: current complete manual/guide surfaces and validation expectations.
- `docs_project/screens/learning-and-exam-flows.md`: `Руководство 4R` / complete manual navigation flow and local-first/manual UI expectations.
- `docs/specify/README.md`: original specify-stage product constraints, Docker-only runtime, no PDF viewer, and focused exam-prep success definition.
- `.specify/templates/feature-request-template.md`: intake artifact structure.

## External Research

External research was not used. The request concerns a current local UI behavior in this repository and was sufficiently specified by the user's screenshot plus durable project memory.

## Problem Statement

The `Руководство` navigation currently exposes visible `готово` labels next to manual chapter/topic rows. These labels add visual noise and are not desired in the guide navigation UI shown to learners.

## Proposed Outcome Or Workflow

1. The guide/manual navigation no longer shows visible `готово` text labels next to chapter, section, or topic rows.
2. The navigation continues to show the same section titles, active selection state, spacing, responsive behavior, and route/deep-link behavior.
3. Any internal readiness/completion/conversion state remains available for code logic or future tooling if still needed; only the learner-facing label display is removed from the scoped UI.
4. Implementation records verification evidence, preferably including at least one focused UI/browser check of the affected `Руководство` navigation state.

## Role Boundaries Or Affected Actors

- Analyst: Owns only this intake artifact and records user intent, context, assumptions, risks, and acceptance expectations.
- Orchestrator: Coordinates Architect, Implementation Agent, Review Agent, checks, PR state, final validation, and any cleanup assignment.
- Architect: Converts this intake into `spec.md`, `plan.md`, and `tasks.md`, including exact implementation scope and verification requirements.
- Implementation Agent: May edit product code/docs only after complete feature memory exists and Orchestrator assigns the implementation slice.
- Review Agent: Reviews the PR for scoped behavior, regressions, verification evidence, and role-boundary compliance.
- Cleanup Agent: Not currently applicable; cleanup requires a separate explicit Orchestrator assignment.

## Artifact And Handoff Expectations

- Analyst writes only this `feature-request.md` intake artifact during intake.
- Non-Orchestrator active models do not create implementation changes for this request before Orchestrator routing.
- Requirement clarification, when needed, is initiated only by Analyst and relayed through Orchestrator.
- Analyst hands off to Orchestrator and shuts down after intake is ready, until Orchestrator explicitly invokes final Analyst validation after Architect passes or assigns a new intake request.
- Architect starts from this artifact and writes `spec.md`, `plan.md`, and `tasks.md`.
- Implementation starts only after complete feature memory exists and Orchestrator assigns an isolated worktree, branch, and PR slice.
- Handoff context for Orchestrator: `/Users/chap/devel/cabadrive-worktrees/032-remove-guide-ready-labels`, branch `codex/032-remove-guide-ready-labels`, feature folder `specs/032-remove-guide-ready-labels/`, base SHA `51e42f657d867fb802bbe3a68591b6008b45a60f`, and the parallel-work preservation constraints above.
- The Analyst-created latest-main handoff context may continue through Architect planning and may become the single implementation PR slice only if Orchestrator explicitly assigns it that way; additional task slices require separate latest-main isolated worktrees/branches/PRs.

## Open Questions And Risks

- Open questions: None for intake.
- Risk: A shared status label component may be used outside `Руководство`; implementation should avoid removing unrelated status/status-mode labels elsewhere.
- Risk: If `готово` currently communicates converted-versus-pending availability, removing visible labels must not make pending/unavailable manual sections look actionable in a misleading way. Architect should decide whether any non-text visual distinction remains needed for pending items.
- Risk: Responsive layout should be checked because removing right-side labels may alter row alignment and wrapping on narrow screens.

## Acceptance Expectations

- In the `Руководство` navigation, no visible `готово` text appears next to manual chapter, section, or topic rows, including the `Приложение III. Перевозка грузов и товаров` case shown in the screenshot.
- The selected guide row remains visually identifiable, and guide navigation remains usable after the labels are removed.
- Existing manual navigation routes and deep links continue to work.
- No unrelated product status labels, official/unofficial source disclosures, or non-`Руководство` UI labels are removed unintentionally.
- Verification evidence is recorded in process memory, with a focused automated or browser check covering the affected guide navigation.

## Final Analyst Validation Notes

Append-only Analyst-owned section used only when Orchestrator invokes final Analyst validation after final Architect validation passes.

- Analyst validation pass: passed
- Final Analyst validation completed at: 2026-06-05T00:27:21-03:00
- Analyst validated effective content head: b671cae9699c0bacfd2cd0961e630e663de20252
- Analyst return count for this work cycle: 0
- Customer intent check: passed. The final result matches the original request in spirit and letter: the learner-facing `готово` labels are removed from the `Руководство` navigation, including the Appendix III cargo rows shown in the screenshot, while the guide remains navigable and the implementation preserves pending `ожидает PR`, route/deep-link behavior, active state, diagnostic data attributes, and unrelated source/status disclosures.
- Evidence basis: Analyst reviewed this intake, Architect spec/plan, existing Architect final-validation evidence in `tasks.md`, local HEAD `b671cae9699c0bacfd2cd0961e630e663de20252`, and the effective-content diff. Evidence shows `src/App.tsx` now renders available manual section buttons with title-only visible text and accessible names, renders pending status only for unavailable sections, preserves manual section metadata attributes, and focused static/e2e tests cover absence of visible/accessibility-exposed `готово`, Appendix III cargo rows, active state, data attributes, and Appendix III deep links. Recorded verification includes focused manual-guide tests, full test/build/preflight evidence, green required checks, and Review Agent no-blocking review for PR #196.
- Gaps, if any: none.
- Architect disposition routing: No Analyst feedback or gaps require Architect disposition.
- Analyst limit escalation: Not applicable; return count remains 0.
- Analyst boundary reminder: Do not edit Architect artifacts, code, reviews, commits, pushes, PRs, merge state, or files outside Analyst-owned intake/final-validation notes except the new feature request required by limit-exceeded escalation.
