# Feature Request: Auto Merge Finalization

## Analyst Artifact Status

Created by Analyst intake in isolated worktree `/Users/chap/devel/cabadrive-018-auto-merge-finalization` on branch `codex/018-auto-merge-finalization`.

## Orchestrator Routing Context

- Orchestrator entry: user explicitly assigned this task to Analyst for Cabadrive process intake.
- Assigned intake worktree/branch: `/Users/chap/devel/cabadrive-018-auto-merge-finalization`, `codex/018-auto-merge-finalization`.
- Latest-main base evidence: `origin/main` and `HEAD` both resolved to `a26a12493123fcc0774a513e44fbf23663658ec0` on `2026-05-10T13:11:27Z`.
- Parallel-work note: parallel Orchestrators and agents may be active. Existing dirty diffs, branches, commits, PRs, and process memory must be preserved. The next feature-folder scan in this worktree found maximum visible prefix `017`; `specs/018-auto-merge-finalization/` was free.

## User Request

Original request, in Russian:

```text
Ты Analyst для репозитория Cabadrive. Работай только в отдельном worktree `/Users/chap/devel/cabadrive-018-auto-merge-finalization` на ветке `codex/018-auto-merge-finalization`. Следуй `/Users/chap/devel/cabadrive-018-auto-merge-finalization/AGENTS.md` строго для роли Analyst: прочитай repository memory в указанном порядке, создай next feature folder по правилам (в этом worktree на базе origin/main ожидаемый max prefix 017, значит target `specs/018-auto-merge-finalization/`, если при чтении не обнаружишь более новый max), напиши ровно один intake artifact `feature-request.md`. Не меняй код, docs, workflow, scripts или любые другие файлы. Не создавай `spec.md`, `plan.md`, `tasks.md`. Задача пользователя: выяснить, почему оркестраторы всё еще заканчивают словами “осталось только финальное человеческое approval/merge mechanics”, и подготовить изменения, чтобы оркестрация автоматически доводила PR до финала и мержила при зеленых required checks, resolved findings, clean mergeability. В intake зафиксируй original request, context, assumptions, risks, open questions, acceptance expectations, and research/source pointers from local repo docs/scripts. После записи верни кратко path changed.
```

## Clarified Answers And Assumptions

- No clarification questions were asked because the user gave explicit Analyst-role constraints, target worktree, target branch, expected feature folder, forbidden file types, and intake content requirements.
- This is a repository workflow/process feature, not learner-facing Cabadrive product work.
- The request is one feature because the diagnosis and desired change both concern the same final Orchestrator completion/merge behavior.
- "Automatically доводила PR до финала и мержила" is interpreted as Orchestrator-driven finalization and merge when gates are satisfied, not direct pushes to `main`.
- "Green required checks" means the current required checks listed in `.unicorn-hub/config.json`: `baseline-checks`, `docker-validation`, `guard`, `AI Review`, and `osv-scan`.
- "Resolved findings" is interpreted as blocking review findings resolved or outdated, with no unresolved required conversation threads under branch protection.
- "Clean mergeability" is interpreted as no unresolved merge conflicts and GitHub merge state allowing merge into the protected base branch.
- Existing gates must remain intact: final Architect validation, final Analyst validation, current-PR-head guard when applicable, required checks on current head, review-finding status, conflict status, acceptance evidence, process memory, Implementation Agent feedback disposition, and branch protection.
- The user is asking to remove or narrow the current default stop condition that leaves a human as final merge owner, so Architect should explicitly decide whether this request itself is durable auto-merge authorization for future Orchestrators or whether repository docs/templates must define a new standing authorization model.

## Project Context Reviewed

- `AGENTS.md`: repository-changing workflow, role boundaries, Orchestrator autonomy, current authorized-merge wording, default human merge-owner wording, completion contract.
- `.specify/memory/constitution.md`: spec-first workflow, PR-only rule, supervised verification, process memory, final validation loop, and current merge-authority language.
- `docs_project/README.md`: durable documentation baseline and read order.
- `docs_project/project-idea.md`: product context confirming this request is process-only.
- `docs_project/project/frontend/frontend-docs.md`: current local-first React/Vite/PWA shape, Docker-only runtime, and verification commands.
- `docs_project/project/backend/backend-docs.md`: no-backend MVP and local tooling boundaries.
- `docs_project/project/feature-inventory.md`: MVP inventory and explicit product out-of-scope areas.
- `docs_project/screens/learning-and-exam-flows.md`: learner-facing flows, confirming no UI/product behavior is requested.
- `docs/specify/README.md`: original planning archive, constraints, canonical terms, and success definition.
- `docs_project/project/devops/ai-pr-workflow.md`: current Orchestrator workflow, work-cycle/PR-set tracking, final validation loop, merge-readiness conditions, and explicit statement that auto-merge is not CI automation and requires current user authorization.
- `docs_project/project/devops/review-contract.md`: review blocking conditions, final-validation evidence expectations, explicit user authorization for Orchestrator merge, and default human final merge owner.
- `specs/README.md`: feature-memory lifecycle, final validation, merge-readiness gates, human merge-owner rules, and numbering/collision guidance.
- `.github/pull_request_template.md`: SENAR done gate and merge-readiness checklist, including remaining known issues accepted by human merge owner and auto-merge/Orchestrator merge authorization checkbox.
- `.unicorn-hub/config.json`: required checks list and default branch configuration.
- `scripts/apply-branch-protection.mjs`: branch-protection application with required checks, zero required approving reviews, required conversation resolution, and force-push/delete restrictions.
- `.github/workflows/ci.yml`, `.github/workflows/pr-guard.yml`, `.github/workflows/ai-review.yml`, `.github/workflows/osv-scan.yml`: local CI workflow names corresponding to required checks and review gate behavior.
- `scripts/ai-review-gate.mjs` and `scripts/ai-review-helpers.mjs`: local review-gate implementation used by the `AI Review` check.
- `specs/007-agent-workflow-autonomy/*`: prior process feature that documented authorized Orchestrator merge as conditional on explicit user authorization and all merge-ready gates.
- `specs/011-orchestrator-analyst-routing/*`: prior process feature that tightened Orchestrator-first routing and post-Analyst continuation while preserving default human merge ownership absent explicit authorization.
- `specs/012-orchestrator-final-validation-loop/*`: prior process feature that added final Architect/Analyst validation, current-PR-head guard, and completion wording that still ends with "only final human approval or merge mechanics remaining."

## External Research

External research was not used. The request asks why Cabadrive's own Orchestrators still stop at final human approval or merge mechanics, and the relevant evidence is in local repository process docs, templates, branch-protection scripts, required-check config, CI workflows, and prior feature memory.

## Local Research And Source Pointers

- `AGENTS.md` currently says user-authorized Orchestrator merge may proceed without asking again, but also says a human remains the default final merge authority unless current user instructions explicitly authorize auto-merge or Orchestrator merge authority.
- `AGENTS.md` completion contract still lists "only final human approval or merge mechanics remaining" as the terminal state.
- `docs_project/project/devops/ai-pr-workflow.md` defines the work cycle as ending when final validation passes and "completion or authorized merge mechanics are the only remaining step," then later says auto-merge is not a CI automation feature and requires current user instructions already authorizing merge behavior.
- `docs_project/project/devops/review-contract.md` says explicit user authorization removes only the need to ask again and that a human remains the default final merge owner when no such authorization exists.
- `specs/README.md` says final validation does not replace merge readiness and human merge-owner rules remain required.
- `.github/pull_request_template.md` asks the author to confirm any remaining known issue is accepted by the human merge owner, and separately asks whether auto-merge or Orchestrator merge is already authorized.
- `.unicorn-hub/config.json` defines required checks as `baseline-checks`, `docker-validation`, `guard`, `AI Review`, and `osv-scan`.
- `scripts/apply-branch-protection.mjs` applies those checks as required status contexts, sets `required_approving_review_count` to `0`, and enables `required_conversation_resolution: true`, so unresolved review conversations can still block merge even without mandatory human approval count.
- `.github/workflows/ai-review.yml` and `scripts/ai-review-gate.mjs` implement the configured AI review gate for the current PR head; this is the local mechanism related to resolved or acceptable review evidence.

## Problem Statement

Cabadrive's durable workflow currently allows Orchestrator to merge only when explicit current user instructions authorize Orchestrator merge or auto-merge behavior. Otherwise the documented default final state remains that every gate is satisfied and "only final human approval or merge mechanics" remain. That explains why Orchestrators still stop with that phrase: repository memory frames human final merge ownership as the default, and treats auto-merge as an authorization-dependent manual Orchestrator action rather than a standing orchestration responsibility once objective gates are green.

This creates a mismatch with the user's desired outcome: after required checks are green, blocking findings are resolved or outdated, conversations are resolved, mergeability is clean, final validation is current, and process evidence is complete, Orchestrator should continue through finalization and merge instead of reporting that a human still needs to perform approval or merge mechanics.

## Proposed Outcome Or Workflow

1. Durable workflow guidance should explain the root cause of the current stop phrase: default human merge-owner wording plus explicit-authorization-only Orchestrator merge.
2. Durable workflow guidance should define the desired finalization behavior: Orchestrator automatically continues through final validation, current-head guard, merge-readiness verification, and merge when all objective gates are satisfied.
3. The new behavior should preserve PR-only delivery and must not allow direct pushes to `main`.
4. The new behavior should preserve branch protection and required checks from `.unicorn-hub/config.json`.
5. The new behavior should require resolved or outdated blocking review findings and resolved required conversations before merge.
6. The new behavior should require clean mergeability/no conflicts before merge.
7. The new behavior should preserve final Architect validation before final Analyst validation, and stale-validation handling for post-validation changes.
8. The new behavior should require Orchestrator to verify GitHub state and local read-only guard evidence on the current PR head before merging.
9. The new behavior should narrow or remove "human final merge owner" as the default terminal blocker for Orchestrator-managed PRs, while still documenting exceptional human-blocker cases such as missing credentials/permissions, repository state ambiguity, accepted known issues requiring owner decision, protected-branch policy failures, or explicit user instruction not to merge.
10. The new behavior should update docs/templates/process memory consistently so future Orchestrators do not end with "only final human approval/merge mechanics remaining" when objective gates are already satisfied.

## Role Boundaries Or Affected Actors

- Orchestrator: should remain the coordinator, verify gates from GitHub/local state, route file changes to subagents, perform authorized or newly-default final merge action only after all merge-readiness gates pass, and record completion evidence.
- Analyst: owns this intake only, and later final Analyst validation only if Orchestrator invokes it after Architect passes; Analyst must not design or implement the technical solution.
- Architect: should decide exact durable workflow changes, authorization model, affected docs/templates, acceptance criteria, negative scenarios, verification requirements, and whether any executable guard or GitHub-level automation is in scope.
- Implementation Agent: should make only Architect-scoped docs/templates/script/workflow changes, keep `tasks.md` current, and not merge.
- Review Agent: should verify the new workflow does not weaken gates, role boundaries, branch protection, review resolution, or validation freshness.
- Human/user: remains final authority for product intent and exceptional blockers, but the requested workflow aims to remove routine final human merge mechanics when objective gates are satisfied.

## Artifact And Handoff Expectations

- Analyst writes only this `feature-request.md` intake artifact during intake.
- Requirement clarification was not needed; assumptions are recorded above.
- Analyst hands off to Orchestrator and shuts down after intake is ready, until Orchestrator explicitly invokes final Analyst validation after Architect passes or assigns a new intake request.
- Architect starts from this artifact and writes `spec.md`, `plan.md`, and `tasks.md`.
- Handoff context for Orchestrator: branch `codex/018-auto-merge-finalization`, worktree `/Users/chap/devel/cabadrive-018-auto-merge-finalization`, feature folder `specs/018-auto-merge-finalization/`.
- The Analyst-created latest-main handoff context may continue through Architect planning and may become the single implementation PR slice only if Orchestrator explicitly assigns it that way; additional task slices require separate latest-main isolated worktrees/branches/PRs.

## Open Questions And Risks

- Should this feature define standing Orchestrator merge authorization for all future Cabadrive PRs once gates pass, or only make Orchestrator merge the default when the initiating user asks for auto-finalization? This is the central Architect decision.
- Should "automatic" mean Orchestrator performs a GitHub merge action, enables GitHub auto-merge, or both depending on current check state and repository permissions?
- Which merge method should Orchestrator use when merging: repository default, squash, merge commit, or rebase? Current local docs do not appear to define a preferred merge method.
- How should Orchestrator verify "resolved findings" across supported review backends and GitHub conversation-resolution branch protection without overfitting to one API path?
- How should Orchestrator handle nonblocking `P3` advisory findings, accepted known issues, or remaining known issues that currently require human merge-owner acceptance?
- If branch protection or GitHub permissions prevent merging despite green gates, should Orchestrator report a permissions blocker, enable auto-merge if allowed, or route a follow-up process change?
- If required checks are green but branch protection reports an additional unmet rule not listed in `.unicorn-hub/config.json`, the workflow must not merge around it.
- A careless implementation could weaken required checks, review resolution, final validation, or role boundaries while removing human approval wording. Architect and Review Agent should treat that as blocking.
- Executable automation may need GitHub credentials, repository settings, or workflow permissions. The feature should not edit secrets or production resources directly.
- Docs-only changes may reduce Orchestrator hesitation but may not make actual merges happen if agents lack tool permissions or the workflow lacks a concrete merge procedure.

## Acceptance Expectations

- The feature memory and durable docs explain why Orchestrators currently stop at "only final human approval/merge mechanics remaining."
- Durable workflow guidance states that Orchestrator should not stop at final human approval/merge mechanics for Orchestrator-managed PRs when all objective merge-readiness gates are satisfied and no explicit human-only blocker remains.
- Durable guidance defines the exact gate set for automatic finalization: current-head green required checks, resolved/outdated blocking findings, resolved required conversations, clean mergeability/no conflicts, current process memory, acceptance evidence, Implementation Agent feedback disposition, final Architect validation, final Analyst validation, and current-PR-head guard when applicable.
- Required checks stay sourced from `.unicorn-hub/config.json` and branch-protection behavior remains respected.
- The workflow preserves PR-only delivery and forbids direct pushes to `main`.
- The workflow preserves role boundaries: Orchestrator may perform GitHub-level finalization/merge actions but still may not edit repository files; Implementation Agent and Review Agent do not merge.
- Durable docs/templates no longer make routine human merge ownership the terminal blocker after objective gates pass, while still documenting exceptional human-only blockers.
- The PR template and review contract align with the new finalization model and do not ask authors to leave completed PRs at "human approval/merge mechanics" unless a documented blocker exists.
- Architect planning decides whether implementation is docs/templates only, executable GitHub workflow/tooling, or a staged approach, and records the reason.
- Verification includes text-search evidence for removed or revised human-merge-owner terminal wording, preserved gate wording, automatic finalization wording, role-boundary preservation, required-check source preservation, and exceptional human-blocker wording.
- Verification includes a local source review showing `.unicorn-hub/config.json`, `scripts/apply-branch-protection.mjs`, AI review gate behavior, and relevant GitHub workflows were considered.

## Final Analyst Validation Notes

Append-only Analyst-owned section used only when Orchestrator invokes final
Analyst validation after final Architect validation passes.

- Analyst validation pass: not yet invoked.
- Analyst return count for this work cycle: 0.
- Customer intent check: pending final implementation.
- Gaps, if any: not yet evaluated.
- Architect disposition routing: Orchestrator must route any Analyst feedback to Architect for accept/task/ticket/dispose before follow-up development.
- Analyst limit escalation: if another Analyst gap would exceed 5 returns, Analyst creates a new feature request in a separate latest-main branch/worktree and records the handoff.
- Analyst boundary reminder: do not edit Architect artifacts, code, reviews, commits, pushes, PRs, merge state, or files outside Analyst-owned intake/final-validation notes except the new feature request required by limit-exceeded escalation.
