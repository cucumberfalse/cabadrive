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
- Feature memory must include goal, scope, acceptance criteria, a negative scenario, and verification evidence.
- One task slice equals one isolated worktree, one branch, and one PR.
- New repository-changing work and each new task slice start from latest `origin/main` in a fresh isolated worktree/branch unless Orchestrator explicitly assigns the Analyst-created latest-main handoff branch as the single implementation PR slice.
- When Orchestrator assigns a task, follow the assigned worktree, branch, PR slice, recorded base context, and explicit parallel-work warning; preserve existing dirty diffs, branches, commits, PRs, and process memory from other agents.
- Large or risky work should be split into atomic PR slices when separation lowers risk or clarifies gates, including source prerequisites, Architect dispositions, content implementation, metadata fixes, final strict gates, and review fixes.
- Update `specs/` and `docs_project/` when behavior, architecture, workflows, or deploy rules change.
- Record dead ends, decisions, and known issues before calling work complete.
- If direct edits start before Orchestrator routing or implementation prerequisites are satisfied, stop immediately, report the process failure, preserve user and sibling-agent work, and wait for Orchestrator/user disposition. Do not hide the bypass, silently switch roles, run destructive cleanup, or revert work you did not make without explicit authorization.
- Before every push, run `pnpm run preflight` (and Docker contract checks for runtime-affecting changes).
- Never merge while required checks are queued, running, red, or missing; while blocking review findings or conflicts remain; while process memory is stale; while acceptance evidence is missing; while Implementation Agent feedback lacks Architect disposition; or before required final Architect validation and final Analyst validation have passed.
- Keep commit subjects short, conventional, and focused.
- Do not add abstractions for single-use logic without a current need documented in `plan.md`.

## Role Boundaries

- Orchestrator is the default entrypoint for repository-changing requests and invokes Analyst first when no current `feature-request.md` exists. Orchestrator must remain in the Orchestrator role and must not directly edit repository files.
- Analyst starts only from Orchestrator routing, writes only the intake `feature-request.md` during intake, then hands off and shuts down until Orchestrator explicitly invokes final Analyst validation or a new intake request. Analyst does not write plans, Architect artifacts, code, reviews, commits, pushes, PRs, merge actions, or non-Analyst-owned files.
- Analyst final validation, when invoked by Orchestrator after Architect passes, checks the final result against the customer's desired outcome in spirit and letter. Analyst updates only append-only Analyst-owned validation notes in `feature-request.md`, increments the Analyst return count for gaps, and creates a new feature request in a separate latest-main branch/worktree if another gap would exceed 5 Analyst returns in the work cycle.
- Analyst is the only normal-flow role that may initiate user requirement clarification, and those questions flow through Orchestrator: Analyst gives questions to Orchestrator, Orchestrator asks the user, and Orchestrator returns answers to Analyst.
- Architect writes `spec.md`, `plan.md`, and `tasks.md`, including dispositions. Architect performs final Architect validation before Analyst validation, completion, or authorized merge mechanics; scope includes all PR slices in the cycle PR set, Architect-assigned tasks and dispositions, architectural guidance, open task state, current process memory, and customer intent in spirit. Architect records gaps in Architect-owned artifacts/dispositions, increments the Architect return count, returns control to Orchestrator, and reports a limit breach if another gap would exceed 10 Architect returns in the work cycle.
- Orchestrator coordinates through production readiness, invokes the right subagent, tracks the work cycle and cycle PR set, and must not directly edit repository files. A work cycle is one repository-changing request represented by one feature folder through all PR slices, final validations, follow-up returns, completion, or escalation. The cycle PR set records each PR slice's purpose, branch, PR metadata, head SHA, status, and inclusion in final validation. Orchestrator may perform GitHub-level coordination such as check reruns, review routing, merge-readiness checks, and authorized merge actions when those actions do not edit files.
- Implementation Agent works only from the assigned complete feature memory, worktree, branch, and PR slice. Implementation Agent may stage, commit, push, and open a ready PR for that slice, but does not merge.
- Review Agent reviews diffs, feature-memory compliance, role/process boundaries, Orchestrator-first bypasses, unsafe recovery, sibling-work preservation, consistency with prior process features such as `011` and sibling `012`, final-validation compliance, cycle PR-set coverage, return-limit handling, Analyst-feedback Architect disposition, and preserved merge gates. Review Agent does not edit files, implement fixes, rerun checks, or merge while acting as reviewer.
- Agents must not switch roles mid-task. If different work is needed, Orchestrator reroutes it to the correct role.
- After Analyst handoff, Orchestrator, Architect, Implementation Agent, and Review Agent must not initiate new normal-flow requirement clarification with the user. Use recorded assumptions, record Implementation Agent feedback for Architect disposition, or stop only for blocker exceptions such as safety, permissions, credentials, data-loss risk, repository conflicts or status ambiguity, or an unapproved human merge-owner decision.

## Orchestrator Autonomy

- Proceed when repository memory, PR state, check state, and reviewer feedback provide enough context without a product or architecture decision.
- Retry or rerun stuck, failed, or inconclusive checks when the cause is a clear workflow state.
- Reroute code, docs, content, spec, test, or review-fix work to the role that owns it.
- For a stuck or non-reporting subagent, inspect the worktree, branch, dirty diff, local commits, PR, and GitHub state before replacing or rerouting, and preserve existing work unless the human explicitly permits discarding it.
- After Analyst handoff, continue without asking new requirement questions when current memory provides enough context; ask the human only when requirements conflict, state is ambiguous enough to risk data loss or scope expansion, credentials are missing, conflicts/status ambiguity block progress, or the decision belongs to the human merge owner.
- When the user explicitly authorizes Orchestrator merge or auto-merge behavior, Orchestrator may merge without asking again only after verifying green required checks, no blocking review findings, no conflicts, current process memory, acceptance evidence, resolved or disposed Implementation Agent feedback, and final local/read-only guards.
- Before declaring completion or performing authorized merge mechanics, Orchestrator invokes final Architect validation first and final Analyst validation second. Analyst gaps must be routed to Architect for accept/task/ticket/dispose disposition before follow-up development starts.
- Final Architect and Analyst validation may apply to the effective content head: the PR head containing implementation, workflow docs/templates, feature memory, review fixes, and other behaviorally meaningful content. A later commit may skip recursive role validation only when it is a final-validation evidence-only commit that records role-owned validation evidence or process memory. Orchestrator must run a read-only current-PR-head guard before completion or authorized merge mechanics; any post-validation non-evidence change makes prior validation stale and must be routed back through role-appropriate follow-up or final validation.
- A human remains the default final merge owner when no explicit merge authorization exists.
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
- Do not satisfy review gates with stale comments or old SHAs.
- Do not put secrets in docs, specs, examples, or templates.
- Do not claim `official_full_bank` unless sources and validation evidence confirm it.
