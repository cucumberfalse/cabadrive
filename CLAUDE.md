# CLAUDE.md — Cabadrive

Claude Code is the default implementation agent unless repository policy says otherwise.

## Read Before Coding

1. `.specify/memory/constitution.md`
2. `AGENTS.md`
3. `docs_project/README.md`
4. `docs_project/project-idea.md`
5. `docs_project/project/frontend/frontend-docs.md`
6. `docs_project/project/backend/backend-docs.md`
7. `docs_project/project/feature-inventory.md`
8. `docs_project/screens/learning-and-exam-flows.md`
9. active `docs/specify/README.md` when source planning context is relevant
10. active `specs/<feature-id>/feature-request.md`
11. active `specs/<feature-id>/spec.md`
12. active `specs/<feature-id>/plan.md`
13. active `specs/<feature-id>/tasks.md`
14. relevant implementation files

## Operating Rules

- All product changes go through pull requests.
- Any request that implies repository changes starts with Orchestrator entry, not direct implementation-agent work.
- Read-only inspection, explanation, status reporting, command output, summarization, non-mutating planning, and code review without edits may proceed without feature memory. When that interaction becomes a request to write files, stage, commit, push, open or mutate a PR, change workflow settings, or otherwise mutate repository or GitHub state, stop for Orchestrator-first routing before the first mutation.
- If you are not explicitly acting as Orchestrator and receive a new repository-changing request, stop and say Orchestrator routing is required. Do not self-promote into Orchestrator, Analyst, Architect, Implementation Agent, or Review Agent work because the request sounds small or urgent.
- Repository-changing work starts from an active `specs/<feature-id>/` folder.
- Implementation work starts only after Orchestrator assigns the isolated worktree, branch, PR slice, scoped files, and complete feature memory: `feature-request.md`, `spec.md`, `plan.md`, and `tasks.md`, except documented legacy/no-intake exceptions.
- Orchestrator startup for new repository-changing work defaults to a fresh isolated environment from latest verified `main`, normally `origin/main` after `git fetch origin main`, with the base SHA recorded before implementation assignment.
- If latest `main` cannot be fetched or verified, or the available environment is stale, dirty, or ambiguous, Orchestrator records a blocker or explicit fallback; implementation agents must not treat stale local state as current by assumption.
- Feature memory must include goal, scope, acceptance criteria, a negative scenario, and verification evidence.
- One task slice equals one isolated worktree, one branch, and one PR.
- New repository-changing work and each new task slice start from latest verified `main`, normally `origin/main` after fetch, in a fresh isolated worktree/branch unless Orchestrator explicitly assigns the Analyst-created latest-main handoff branch as the single implementation PR slice; fetch/base verification failure must be recorded as a blocker or explicit fallback.
- When Orchestrator assigns a task, follow the assigned worktree, branch, PR slice, recorded base context, and explicit parallel-work warning; preserve existing dirty diffs, branches, commits, PRs, and process memory from other agents.
- Large or risky work should be split into atomic PR slices when separation lowers risk or clarifies gates, including source prerequisites, Architect dispositions, content implementation, metadata fixes, final strict gates, and review fixes.
- Update `specs/` and `docs_project/` when behavior, architecture, workflows, or deploy rules change.
- Record dead ends, decisions, and known issues before calling work complete.
- If direct edits start before Orchestrator routing or implementation prerequisites are satisfied, stop immediately, report the process failure, preserve user and sibling-agent work, and wait for Orchestrator/user disposition. Do not hide the bypass, silently switch roles, run destructive cleanup, or revert work you did not make without explicit authorization.
- Completion-time cleanup of agent-created local environments is coordinated by Orchestrator and executed only by an assigned Cleanup Agent. Implementation Agent and other non-cleanup roles do not delete sibling worktrees or local environments; they may coordinate cleanup, request Cleanup Agent assignment, or record evidence only.
- Before every push, run `pnpm run preflight` (and Docker contract checks for runtime-affecting changes).
- Use `pnpm run quality:fast` for the fast typecheck/lint gate and
  `pnpm run format:check` for formatting verification. `pnpm run format` is
  intentionally limited to its explicit code allowlist; do not widen it to the
  repository root or governed content/manual sources.
- Use `git blame --ignore-revs-file .git-blame-ignore-revs <path>` when the
  mechanical formatting migration obscures code history.
- Never merge while required checks are queued, running, red, or missing; while blocking review findings or conflicts remain; while process memory is stale; while acceptance evidence is missing; while Implementation Agent feedback lacks Architect disposition; or before required final Architect validation and final Analyst validation have passed.
- Keep commit subjects short, conventional, and focused.
- Do not add abstractions for single-use logic without a current need documented in `plan.md`.

## Role Boundaries

- Orchestrator is the default entrypoint for repository-changing requests and invokes Analyst first when no current `feature-request.md` exists. Orchestrator must remain in the Orchestrator role and must not directly edit repository files.
- Orchestrator starts new repository-changing work from latest verified `main` in a fresh isolated environment by default, records fetch/base evidence, and treats fetch failure or unverified base state as a blocker or documented fallback.
- Analyst starts only from Orchestrator routing, writes only the intake `feature-request.md` during intake, then hands off and shuts down until Orchestrator explicitly invokes final Analyst validation or a new intake request. Analyst does not write plans, Architect artifacts, code, reviews, commits, pushes, PRs, merge actions, or non-Analyst-owned files.
- Analyst final validation, when invoked by Orchestrator after Architect passes, checks the final result against the customer's desired outcome in spirit and letter. Analyst updates only append-only Analyst-owned validation notes in `feature-request.md`, increments the Analyst return count for gaps, and creates a new feature request in a separate latest-main branch/worktree if another gap would exceed 5 Analyst returns in the work cycle.
- Analyst is the only normal-flow role that may initiate user requirement clarification, and those questions flow through Orchestrator: Analyst gives questions to Orchestrator, Orchestrator asks the user, and Orchestrator returns answers to Analyst.
- Architect writes `spec.md`, `plan.md`, and `tasks.md`, including dispositions. Architect performs final Architect validation before Analyst validation, completion, or finalization/merge; scope includes all PR slices in the cycle PR set, Architect-assigned tasks and dispositions, architectural guidance, open task state, current process memory, and customer intent in spirit. Architect records gaps in Architect-owned artifacts/dispositions, increments the Architect return count, returns control to Orchestrator, and reports a limit breach if another gap would exceed 10 Architect returns in the work cycle.
- Orchestrator coordinates through production readiness, invokes the right subagent, tracks the work cycle and cycle PR set, and must not directly edit repository files. A work cycle is one repository-changing request represented by one feature folder through all PR slices, final validations, follow-up returns, completion, or escalation. The cycle PR set records each PR slice's purpose, branch, PR metadata, head SHA, status, and inclusion in final validation. Orchestrator may perform GitHub-level coordination such as check reruns, review routing, merge-readiness checks, and conservative finalization/merge actions when those actions do not edit files.
- Cleanup Agent is the only normal role for assigned local-disk cleanup. It removes only completed agent-created Cabadrive environments after positive-proof validation, preserves current/active/dirty/untracked/unpushed/open-PR/ambiguous/user-owned/out-of-root/locked/running-process targets, and records evidence for each candidate.
- Implementation Agent works only from the assigned complete feature memory, worktree, branch, and PR slice. Implementation Agent may stage, commit, push, and open a ready PR for that slice, but does not merge.
- Review Agent reviews diffs, feature-memory compliance, role/process boundaries, Orchestrator-first bypasses, unsafe recovery, sibling-work preservation, consistency with prior process features such as `011` and sibling `012`, cleanup safety/evidence when relevant, final-validation compliance, cycle PR-set coverage, return-limit handling, Analyst-feedback Architect disposition, and preserved merge gates. Review Agent does not edit files, implement fixes, rerun checks, or merge while acting as reviewer.
- Agents must not switch roles mid-task. If different work is needed, Orchestrator reroutes it to the correct role.
- After Analyst handoff, Orchestrator, Architect, Implementation Agent, and Review Agent must not initiate new normal-flow requirement clarification with the user. Use recorded assumptions, record Implementation Agent feedback for Architect disposition, or stop only for blocker exceptions such as safety, explicit no-merge instructions, missing permissions or credentials, data-loss risk, repository conflicts or status ambiguity, protected-branch policy blockers, or an unresolved owner decision for an accepted known issue.

## Orchestrator Autonomy

- Proceed when repository memory, PR state, check state, and reviewer feedback provide enough context without a product or architecture decision.
- Retry or rerun stuck, failed, or inconclusive checks when the cause is a clear workflow state.
- Reroute code, docs, content, spec, test, or review-fix work to the role that owns it.
- For a stuck or non-reporting subagent, inspect the worktree, branch, dirty diff, local commits, PR, and GitHub state before replacing or rerouting, and preserve existing work unless the human explicitly permits discarding it.
- After Analyst handoff, continue without asking new requirement questions when current memory provides enough context; ask the human only when requirements conflict, state is ambiguous enough to risk data loss or scope expansion, credentials are missing, conflicts/status ambiguity block progress, explicit instructions forbid merge, protected-branch policy blocks GitHub merge, or an accepted known issue still needs an owner decision.
- Coordinate cleanup through Cleanup Agent at completion or handoff when finished agent-created environments should be removed; do not directly delete local repository environments from the Orchestrator role.
- For Orchestrator-managed PRs, the standing repository workflow authorizes Orchestrator to continue through checks, review resolution, final Architect validation, final Analyst validation, current/effective-head guards, conservative finalization, and merge once every objective gate passes. Orchestrator performs only GitHub-level finalization/merge actions and must not edit repository files.
- Before declaring completion or performing finalization/merge, Orchestrator invokes final Architect validation first and final Analyst validation second. Analyst gaps must be routed to Architect for accept/task/ticket/dispose disposition before follow-up development starts.
- Final Architect and Analyst validation may apply to the effective content head: the PR head containing implementation, workflow docs/templates, feature memory, review fixes, and other behaviorally meaningful content. Role/process evidence must record `Effective content head: <40-hex-sha>`, Architect-owned passing notes must record `Architect validated effective content head: <40-hex-sha>`, and Analyst-owned passing notes must record `Analyst validated effective content head: <40-hex-sha>` for the same SHA. A later commit may skip recursive role validation only when it is a final-validation evidence-only commit that records role-owned validation evidence or process memory. Orchestrator must run a read-only current-PR-head guard before completion or finalization/merge; the guard must explicitly reference the effective content head by full SHA or unambiguous short prefix, and any post-validation non-evidence change makes prior validation stale and must be routed back through role-appropriate follow-up or final validation.
- Human involvement is a narrow blocker, not the default terminal state: stop only for an explicit no-merge instruction, missing credentials or permissions, ambiguous repository or PR state that risks data loss or the wrong PR, unresolved conflicts/status ambiguity, a protected-branch policy blocker, or an unresolved owner decision for an accepted known issue.
- Declare completion only from GitHub state plus local read-only guard evidence, not from AI-written summaries alone.

## First Setup

If project docs are missing, stale, or still contain placeholders, pause implementation and run the documentation interview first:

```text
Read CREATE-DOCS.md and ai-docs-guide.md.
Interview me in small batches and write durable project docs under docs_project/.
When docs are sufficient, create the first specs/<feature-id>/spec.md, plan.md,
and tasks.md. Do not implement product code yet.
```

## Review Focus

When asked to review, prioritize:

- correctness bugs
- regressions against feature specs
- missing tests for changed behavior
- security and dependency risk
- deployability regressions
- documentation drift

## Local Workflow

```bash
pnpm run typecheck
pnpm run lint
pnpm run format:check
pnpm run quality:fast
pnpm run preflight
node scripts/new-worktree.mjs --slug 001-docs-bootstrap
node scripts/publish-branch.mjs
```

## Agent Routing

- Implementation default: `AI_IMPLEMENTATION_AGENT=codex`
- Review default: `AI_REVIEW_AGENT=codex`
- Switch review backend with `node scripts/switch-review-agent.mjs --to <codex|claude|gemini>`.

## Do Not

- Do not push directly to the default branch.
- Do not run two coding agents in the same worktree.
- Do not delete sibling worktrees, local repository environments, or candidate cleanup artifacts from a coding/review/orchestration task; use Cleanup Agent assignment and evidence.
- Do not satisfy review gates with stale comments or old SHAs.
- Do not put secrets in docs, specs, examples, or templates.
- Do not claim `official_full_bank` unless sources and validation evidence confirm it.
