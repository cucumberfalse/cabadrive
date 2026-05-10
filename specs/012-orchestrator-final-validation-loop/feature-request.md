# Feature Request: Orchestrator Final Validation Loop

## Analyst Artifact Status

Создано Analyst intake в изолированном worktree `/Users/chap/devel/cabadrive-012-orchestrator-final-validation-loop` на ветке `codex/012-orchestrator-final-validation-loop`.

## Orchestrator Routing Context

- Orchestrator entry: Orchestrator передал Analyst новую repository-changing process feature.
- Assigned intake worktree/branch: `/Users/chap/devel/cabadrive-012-orchestrator-final-validation-loop`, `codex/012-orchestrator-final-validation-loop`.
- Parallel-work note: параллельные Orchestrator и агенты могут быть активны; существующие ветки, dirty diffs, commits, PRs и process memory должны быть сохранены.
- Numbering note: на этом worktree максимальный numeric prefix под `specs/` равен `011`; целевой folder `specs/012-orchestrator-final-validation-loop/` свободен, поэтому collision не найден.

## User Request

Пользователь просит доработать repository workflow/process, не learner-facing продукт.

Требуемое поведение:

- Orchestrator начинает каждую новую работу строго от последнего `main` и создает собственное новое изолированное окружение от него.
- Перед тем как считать работу завершенной, Orchestrator сначала должен вызвать Architect.
- Architect валидирует, что по всем PRs выполнены все задачи, которые Architect поставил, реализованная работа соответствует архитектурным указаниям, открытых задач не осталось, а итог соответствует намерению заказчика по духу.
- Если Architect находит gaps, Architect обновляет Architect artifacts и просит Orchestrator продолжить разработку на основе найденного.
- Затем Orchestrator вызывает Analyst.
- Analyst валидирует, что финальный результат соответствует желаемому результату заказчика по духу и по букве.
- Если Analyst находит gaps, Analyst обновляет Analyst artifacts и просит Orchestrator продолжить разработку на основе найденного; Architect сначала принимает или disposes этот feedback, затем возвращает управление Orchestrator, который управляет follow-up development.
- Architect может возвращаться максимум 10 раз внутри каждого cycle.
- Analyst может возвращаться максимум 5 раз внутри каждого cycle.
- Если лимит возвратов к Architect превышен, Architect сообщает об этом Orchestrator, а Orchestrator просит Analyst создать новый feature request.
- Если лимит возвратов к Analyst превышен, Analyst создает новый feature request в отдельной ветке.

## Clarified Answers And Assumptions

- Уточняющие вопросы не задавались, потому что запрос достаточно конкретен для Architect planning.
- Это один process/workflow feature: все требования относятся к финальному validation loop Orchestrator перед объявлением завершения работы.
- Внешний смысл "каждая новая работа от последнего main" принят как требование к Orchestrator startup/assignment flow; Architect должен уточнить, как это сочетается с уже действующим правилом one worktree, one branch, one PR per task slice и с Analyst-created intake handoff.
- "До завершения работы" принято как final completion gate после implementation/review/check work across the feature, но до объявления completion и, если разрешено, до merge/final merge mechanics.
- "Все PRs" принято как все PR slices, которые Orchestrator открыл или координировал для текущей feature/process cycle.
- "Architect updates Architect artifacts" принято как обновление `spec.md`, `plan.md`, `tasks.md` или Architect-owned disposition records, без прямого implementation work.
- "Analyst updates Analyst artifacts" принято как обновление Analyst-owned intake/validation artifacts. Architect должен решить, является ли это обновлением текущего `feature-request.md`, добавлением отдельного Analyst validation section/artifact, или созданием нового feature request при лимитах.
- "Создает новый feature request в отдельной ветке" принято как новый repository-changing intake flow, который должен сохранять действующие role boundaries, branch/worktree isolation, numbering/collision rules и no-direct-main workflow.
- Запрос не требует product UI, content, runtime, CI, branch protection, scripts, secrets или production resource changes, если Architect явно не обоснует minimal enforcement scope.

## Project Context Reviewed

- `AGENTS.md`: текущие role boundaries, Orchestrator-first routing, Analyst clarification relay, parallel-work preservation, merge/completion gates.
- `.specify/memory/constitution.md`: spec-first development, one worktree per task, PR-only workflow, supervised verification, process memory.
- `docs_project/README.md`: durable documentation baseline and read order.
- `docs_project/project-idea.md`: Cabadrive product context, confirming this request is process-only.
- `docs_project/project/frontend/frontend-docs.md`: current local-first React/Vite/PWA shape and Docker-only runtime contract.
- `docs_project/project/backend/backend-docs.md`: no-backend MVP and tooling boundaries.
- `docs_project/project/feature-inventory.md`: MVP inventory and explicit product out-of-scope areas.
- `docs_project/screens/learning-and-exam-flows.md`: learner-facing flows, confirming no UI/product change is requested.
- `docs/specify/README.md`: original planning archive, constraints, canonical terms, and success definition.
- `specs/README.md`: feature-memory lifecycle, Analyst artifact contract, numbering, collision, split, and manual `feature-request.md` enforcement notes.
- `docs_project/project/devops/ai-pr-workflow.md`: Orchestrator-first workflow, role permissions, autonomous orchestration, PR slicing, merge readiness, feature-memory enforcement limits.
- `docs_project/project/devops/review-contract.md`: review role boundaries and merge-blocking process conditions.
- `.specify/templates/feature-request-template.md`: expected Analyst intake artifact structure.
- `.github/pull_request_template.md`: SENAR done gate, workflow scope, merge readiness, and validation expectations.
- `CLAUDE.md`: implementation-agent operating rules and role boundaries.
- `specs/002-orchestrator-role-boundary/*`: prior Orchestrator/Architect boundary context.
- `specs/003-analyst-role-intake/*`: Analyst role, intake artifact, handoff, and feedback-disposition context.
- `specs/007-agent-workflow-autonomy/*`: Orchestrator autonomy, PR slicing, merge readiness, stuck-subagent handling, and role-boundary hardening.
- `specs/011-orchestrator-analyst-routing/*`: Orchestrator-first repository-changing routing, Analyst clarification relay, parallel-work isolation, and post-Analyst continuation.

## External Research

External research was not used. The request is an internal Cabadrive process feature, and the existing repository memory already defines the relevant role model, feature-memory contract, Orchestrator coordination rules, PR slicing, and merge-readiness gates.

## Problem Statement

Current Cabadrive guidance defines Orchestrator-first routing, Analyst intake, Architect planning, Implementation Agent execution, Review Agent review, PR slicing, and merge-readiness gates. However, the durable workflow does not yet define a final validation loop where Orchestrator explicitly re-invokes Architect and then Analyst before completion, with bounded retry cycles and escalation into a new feature request when the final result still fails architectural or customer-intent validation.

This creates a gap between "PRs/checks/review are ready" and "the whole process truly satisfies the Architect's intended tasks and the customer's desired outcome in spirit and letter."

## Proposed Outcome Or Workflow

1. Orchestrator starts each new repository-changing work item from the latest `main` and creates or requires a fresh isolated environment.
2. Orchestrator continues to coordinate implementation, review, checks, and PR slices under existing role boundaries.
3. Before declaring the work complete, Orchestrator invokes Architect for final validation.
4. Architect checks all PR slices for the cycle against Architect-owned tasks, architectural guidance, open task state, and customer intent in spirit.
5. If Architect finds gaps, Architect updates Architect-owned artifacts/dispositions and returns the cycle to Orchestrator for follow-up development.
6. After Architect validation passes, Orchestrator invokes Analyst for final customer-intent validation.
7. Analyst checks whether the final result matches the customer's desired outcome in spirit and letter.
8. If Analyst finds gaps, Analyst updates Analyst-owned artifacts or validation notes and returns feedback to Orchestrator; Architect must first accept, task, ticket, or explicitly dispose that feedback before Orchestrator manages follow-up development.
9. The validation loop has hard return limits: Architect may be returned to at most 10 times per cycle; Analyst may be returned to at most 5 times per cycle.
10. If the Architect return limit is exceeded, Architect reports the limit breach to Orchestrator, and Orchestrator asks Analyst to create a new feature request.
11. If the Analyst return limit is exceeded, Analyst creates a new feature request in a separate branch.

## Role Boundaries Or Affected Actors

- Orchestrator: starts new work from latest `main`, creates or requires isolated worktree/branch context, coordinates all follow-up development, invokes Architect before Analyst for final validation, tracks validation-loop counts, and does not directly edit repository files.
- Architect: validates final implementation against Architect-owned tasks, architectural guidance, open task state, and customer intent in spirit; updates Architect artifacts/dispositions when gaps are found; reports Architect return-limit breach to Orchestrator.
- Analyst: validates final result against the customer's desired outcome in spirit and letter; updates Analyst-owned artifacts when gaps are found; triggers a new feature request in a separate branch when Analyst return limit is exceeded.
- Implementation Agent: receives follow-up development only from Orchestrator after Architect disposition and works in assigned isolated task slices.
- Review Agent: continues to review PR diffs, role/process compliance, acceptance evidence, and contract violations; does not become the final customer-intent validator unless separately assigned as reviewer.
- Human/user: remains the source of customer intent and final merge authority unless explicit Orchestrator merge/auto-merge authorization exists under current repository rules.

## Artifact And Handoff Expectations

- Analyst writes only this `feature-request.md` intake artifact.
- Requirement clarification was not needed; assumptions are recorded above for Architect disposition.
- Analyst hands off to Orchestrator and shuts down after this artifact is ready.
- Architect starts from this artifact and writes `spec.md`, `plan.md`, and `tasks.md`.
- Handoff context for Orchestrator: branch `codex/012-orchestrator-final-validation-loop`, worktree `/Users/chap/devel/cabadrive-012-orchestrator-final-validation-loop`, feature folder `specs/012-orchestrator-final-validation-loop/`.

## Open Questions And Risks

- "Strictly from latest main" may conflict with continuation from an Analyst-created intake branch/worktree or existing PR slices. Architect should define when Orchestrator must refresh from `origin/main`, when it may continue an intake branch, and how to preserve parallel work.
- The request uses "cycle" without defining exact boundaries. Architect should define whether a cycle means one feature folder, one Orchestrator assignment, one PR group, or one final-validation attempt sequence.
- Analyst currently writes exactly one intake artifact in normal flow and then shuts down. Architect must decide how final Analyst validation updates are represented without violating Analyst boundaries.
- If Analyst creates a new feature request after exceeding its return limit, numbering and branch creation must avoid collisions with parallel work.
- The requested loop must not weaken current merge-readiness gates: green required checks, no blocking review findings, no conflicts, current process memory, acceptance evidence, and resolved/disposed Implementation Agent feedback.
- The requested "customer intent in spirit and letter" is intentionally qualitative. Architect should define reviewable evidence expectations without turning Analyst or Architect into implementation roles.
- Bounded retries reduce infinite loops, but a new feature request after limit breach may fragment process memory unless handoff expectations are explicit.
- If multiple PRs are involved, Orchestrator needs a durable way to identify the full PR set for the cycle before final validation.

## Acceptance Expectations

- Durable workflow guidance states that every new repository-changing work item starts from the latest `main` and uses a fresh isolated worktree/branch environment, with explicit preservation of parallel work.
- Durable Orchestrator guidance requires final Architect validation before Orchestrator declares work complete.
- Architect final validation covers all PR slices for the cycle, Architect-assigned tasks, architectural guidelines, open task state, and customer intent in spirit.
- Durable workflow guidance states what happens when Architect finds gaps: Architect updates Architect-owned artifacts/dispositions and returns the work to Orchestrator for follow-up development.
- Durable Orchestrator guidance requires Analyst final validation after Architect validation.
- Analyst final validation checks the final result against the customer's desired outcome in spirit and letter.
- Durable workflow guidance states what happens when Analyst finds gaps: Analyst updates Analyst-owned artifacts/validation notes, Orchestrator routes feedback to Architect first for acceptance/disposition, and only then Orchestrator manages follow-up development.
- Validation-loop return limits are documented: Architect maximum 10 returns per cycle; Analyst maximum 5 returns per cycle.
- Exceeding the Architect return limit triggers Architect reporting the breach to Orchestrator, then Orchestrator asks Analyst to create a new feature request.
- Exceeding the Analyst return limit triggers Analyst creating a new feature request in a separate branch.
- Existing role boundaries remain intact: Orchestrator does not directly edit files, Architect does not implement, Analyst does not plan implementation, Review Agent does not patch files, and Implementation Agent does not merge.
- Existing completion gates remain intact and are not replaced by AI-written summaries.
- Implementation scope is expected to be process docs/templates/feature memory only unless Architect explicitly scopes a minimal enforcement change.
- Verification should include text-search evidence for latest-main startup, isolated environment creation, final Architect validation, final Analyst validation, bounded return counts, new-feature-request escalation, role-boundary preservation, and merge-readiness gate preservation.

## Final Analyst Validation Notes

### Prior Validation

- Implementation head validated: `cf314599f6d495c33667d4405fc72306efa51ba2`.
- Analyst return count for this work cycle: `0`.
- Customer intent check: pass. The final result matches the customer's requested outcome in spirit and letter: latest-main isolated startup is documented for new work and task slices; final Architect validation is required before final Analyst validation; Architect validation covers tasks, architectural guidance, open task state, process memory, cycle PR set, and customer intent in spirit; Analyst validation covers the desired outcome in spirit and letter; Analyst gaps are routed through Architect accept/task/ticket/dispose disposition before follow-up development; Architect and Analyst return limits are `10` and `5`; and limit-exceeded escalation creates a new feature request through the specified paths.
- Gaps: none.
- Architect disposition routing: not needed because no Analyst customer-intent gaps were found.
- Analyst limit escalation: none.
- Analyst boundary reminder: this final validation updated only Analyst-owned notes in `feature-request.md`; no Architect artifacts, implementation docs/templates, code, reviews, commits, pushes, PRs, merge state, or `tasks.md` were edited.
- Staleness note: this validation is superseded because later T034/T035 follow-up changed durable workflow docs/templates after `cf314599f6d495c33667d4405fc72306efa51ba2`.

### Current Validation

- Effective content head validated: `e0afe395dab29a7b0f1a6fba7a99dd87b9365082`.
- Analyst return count for this work cycle: `0`.
- Customer intent check: pass. The final result matches the customer's requested outcome in spirit and letter: durable workflow guidance requires latest-`origin/main` isolated startup for new work and new task slices while preserving parallel work; requires final Architect validation before final Analyst validation, completion, or authorized merge mechanics; requires Architect validation across the cycle PR set, Architect-assigned tasks and dispositions, architectural guidance, open task state, current process memory, and customer intent in spirit; requires Analyst validation against the original request, assumptions, and acceptance expectations in spirit and letter; routes Analyst gaps through Architect accept/task/ticket/dispose disposition before follow-up development; documents Architect and Analyst return limits of `10` and `5`; escalates limit breaches to new feature-request flows as requested; preserves existing merge-readiness gates; and keeps role boundaries intact so Orchestrator coordinates without file edits, Architect plans/disposes without implementation, Analyst writes only Analyst-owned notes, Review Agent reviews without patching, and Implementation Agent does not merge.
- Current-head/evidence-only check: pass for customer intent. The T034/T035 follow-up adds the requested protection against stale final-validation evidence by defining the effective content head, allowing only narrow final-validation evidence-only commits, requiring Orchestrator's read-only current-PR-head guard before completion or authorized merge mechanics, and making any later non-evidence change stale until routed through role-appropriate follow-up or final validation.
- Gaps: none.
- Architect disposition routing: not needed because no Analyst customer-intent gaps were found.
- Analyst limit escalation: none.
- Staleness note: any commit after `e0afe395dab29a7b0f1a6fba7a99dd87b9365082` that changes non-evidence content makes this Analyst validation stale and must be routed back through the role-appropriate workflow before completion or authorized merge mechanics.
- Analyst boundary reminder: this final validation updated only Analyst-owned notes in `feature-request.md`; no Architect artifacts, implementation docs/templates, code, tests, reviews, commits, pushes, PR metadata, merge state, or `tasks.md` were edited.
