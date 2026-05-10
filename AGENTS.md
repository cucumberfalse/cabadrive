# AGENTS.md — Cabadrive

> Universal onboarding document for AI agents working in this repository.

## What This Project Is

Cabadrive is a local-first web trainer that helps experienced Russian-speaking drivers prepare for the CABA theory exam using official Spanish source material plus clearly labeled unofficial learning support.

**Primary stack:** static local-first web app (React + TypeScript + Vite planned), Docker-only local runtime contract<br>
**Deploy target:** local Docker-served build first, optional static hosting second<br>
**Owner model:** single-repository, spec-driven PR workflow

## Read Order

Before implementation work, read in this order:

1. `.specify/memory/constitution.md`
2. `docs_project/README.md`
3. `docs_project/project-idea.md`
4. `docs_project/project/frontend/frontend-docs.md`
5. `docs_project/project/backend/backend-docs.md`
6. `docs_project/project/feature-inventory.md`
7. `docs_project/screens/learning-and-exam-flows.md`
8. `docs/specify/README.md` (source planning archive)
9. active `specs/<feature-id>/feature-request.md`
10. active `specs/<feature-id>/spec.md`
11. active `specs/<feature-id>/plan.md`
12. active `specs/<feature-id>/tasks.md`
13. relevant source files

If docs are stale or missing for the requested work, refresh `docs_project/` first before product-code implementation.

## Repository-Changing Request Routing

Any user request that implies repository changes defaults to Orchestrator entry. This includes feature requests, bug reports, documentation or process changes, implementation requests, and similarly phrased work. Agents must not begin direct Analyst, Architect, Implementation Agent, or Review Agent work for such requests unless Orchestrator has assigned that role and task slice.

Read-only requests may be answered without creating feature memory or invoking the implementation flow when they are limited to inspection, explanation, status reporting, command output, summarization, planning that writes no files, or non-mutating code review. If a read-only interaction becomes a request to write repository files, stage, commit, push, open or mutate a PR, change workflow settings, or otherwise mutate repository or GitHub state, the Orchestrator-first stop condition applies before the first mutation.

The active model must identify its current role before acting on a repository-changing request. If the active model is not explicitly operating as Orchestrator with a repository-changing assignment, it must stop, state that Orchestrator routing is required, and must not self-promote into Orchestrator, Analyst, Architect, Implementation Agent, or Review Agent work. A user request to "just fix", "update docs", "change the workflow", or similar repository-changing phrasing is not by itself an Orchestrator handoff.

The Orchestrator stays strictly in the Orchestrator role. When no current `feature-request.md` exists for the repository-changing request, Orchestrator invokes Analyst first for intake, gives Analyst the original request and relevant constraints, and does not write the intake artifact directly.

Analyst is the only normal-flow role that may initiate user requirement clarification. Analyst sends concise clarification questions to Orchestrator; Orchestrator asks the user and returns the answers to Analyst. After Analyst handoff, Orchestrator, Architect, Implementation Agent, and Review Agent do not initiate new user requirement clarification; they use recorded assumptions, record Implementation Agent feedback for Architect disposition, or stop only for documented blocker exceptions such as safety, permissions, credentials, data-loss risk, repository conflicts or status ambiguity, an explicit user instruction not to merge, or an unresolved owner decision for an accepted known issue.

Orchestrator must assume parallel Orchestrators and agents may be active. Before starting a new repository-changing work item or assigning a new task slice, Orchestrator fetches or otherwise verifies latest `origin/main`, creates or requires a fresh isolated worktree/branch from that latest main, records the base context, and explicitly warns each subagent that parallel work may exist and that existing dirty diffs, branches, commits, PRs, and process memory must be preserved.

After Analyst creates the latest-main intake branch/worktree context and `feature-request.md`, Orchestrator takes that handoff forward by invoking Architect and later Implementation Agent and Review Agent as needed. That Analyst-created handoff context may continue through Architect planning and may be assigned as the single implementation PR slice when Orchestrator explicitly chooses that route; additional implementation task slices require their own latest-main isolated worktrees, branches, and PRs. For Orchestrator-managed PRs, the standing repository workflow authorizes Orchestrator to continue through implementation, review, checks, final validation, conservative finalization, and merge once every objective merge-readiness gate is verified. Orchestrator stops for a human only when a narrow blocker exists: missing credentials or permissions, explicit instruction not to merge, ambiguous repository or PR state that risks data loss or the wrong PR, a protected-branch policy blocker, or an unresolved owner decision for an accepted known issue.

If an agent realizes it has started direct repository changes before the required Orchestrator-first route or feature-memory prerequisites are satisfied, it must stop immediately, report the process failure to Orchestrator or the user, preserve all user and sibling-agent work, and wait for Orchestrator/user disposition. Recovery may adopt, revert, or salvage the accidental edits only when Orchestrator or the user explicitly authorizes that path and assigns the role-appropriate agent. Hidden continuation, silent role switching, destructive cleanup, and reverting work the current agent did not make are forbidden.

## Agent Roles

### Analyst

- Owns repository request intake before architecture work starts, and owns final Analyst validation only when Orchestrator invokes it after final Architect validation passes.
- May start only after Orchestrator routes a repository-changing request to Analyst; Analyst must not self-assign intake from a new user request.
- Creates the next `specs/<feature-id>/` folder using the max existing numeric prefix under `specs/` plus one, zero-padded to three digits, followed by a short slug.
- If duplicate numeric prefixes already exist, still uses the maximum numeric prefix plus one; if a collision occurs on the target folder name, chooses a clearer slug or asks the Orchestrator to coordinate before writing.
- Splits independent goals into separate feature folders, or records why a split is deferred.
- Runs a Q&A loop through Orchestrator until requirements are clear enough for architecture work, or records explicit assumptions and open questions.
- Initiates normal-flow user requirement clarification only by passing concise questions to Orchestrator; Analyst does not independently conduct direct user Q&A outside that relay.
- Uses public-safe external research when current or external practice context would improve the request, and records sources used.
- Writes exactly one intake artifact, `feature-request.md`, during intake, combining the original request, user answers, project context, research, assumptions, risks, open questions, and acceptance expectations.
- When Orchestrator invokes final Analyst validation after Architect passes, may append Analyst-owned final validation notes to `feature-request.md`, including `Analyst validation pass: passed` and `Final Analyst validation completed at: <ISO 8601 timestamp>` when passing, increment the Analyst return count for gaps, and create a new feature request only on limit-exceeded escalation.
- Writes no code, technical plan, implementation tasks, Architect artifacts, reviews, commits, pushes, PRs, merge actions, or files outside the assigned Analyst-owned artifact section.
- Hands off to the Orchestrator after intake `feature-request.md` is ready, then shuts down until Orchestrator explicitly invokes final Analyst validation or a new intake request.
- Must not switch into Architect, Implementation Agent, Review Agent, or Orchestrator work during the same task. If additional work is needed, Orchestrator reroutes it.

### Architect

- Starts from `feature-request.md` after Analyst handoff.
- Owns `spec.md`, `plan.md`, and `tasks.md` creation and updates for the assigned feature memory.
- Writes the technical solution, task decomposition, implementation requirements, review requirements, and test/verification requirements.
- Ensures feature memory names goal, scope, acceptance criteria, negative scenario, and verification evidence.
- Splits or redirects independent goals that Analyst has not already separated instead of bundling unrelated changes into one process record.
- Performs final Architect validation when Orchestrator requests it before final Analyst validation, completion, or finalization/merge. The validation covers the full cycle PR set, Architect-assigned tasks and dispositions, architectural guidance, open task state, current process memory, and customer intent in spirit. When passing, records `Architect validation pass: passed` and `Final Architect validation completed at: <ISO 8601 timestamp>` in Architect-owned feature memory.
- When final Architect validation finds gaps, updates only Architect-owned artifacts or dispositions, records the gap and next task/ticket/not-needed decision, increments the Architect return count, and returns control to Orchestrator for role-appropriate follow-up development.
- May return work for final-validation gaps at most 10 times per work cycle. If another Architect gap would exceed that limit, records the limit breach and tells Orchestrator to ask Analyst for a new feature request.
- Architect does not write code, tests, runtime files, or implementation changes.
- While acting as Architect, writes only assigned Architect-owned artifacts such as `spec.md`, `plan.md`, `tasks.md`, and dispositions; if asked to implement, stops and routes back to Orchestrator.
- Hands complete feature memory to the Orchestrator for coordination and enforcement.
- Does not stage, commit, push, open PRs, review PRs, or merge while acting as Architect unless a future spec explicitly changes that boundary.
- Must not switch into Analyst, Implementation Agent, Review Agent, or Orchestrator work during the same task. If additional work is needed, Orchestrator reroutes it.

### Orchestrator

- Reads repository memory before starting.
- Coordinates assigned agents from request intake through production readiness and enforces the repository workflow.
- Is the default entrypoint for every repository-changing user request.
- Remains in the Orchestrator role even when the requested change is small; Orchestrator coordinates and delegates file-changing work instead of performing it directly.
- Invokes Analyst for repository-changing request intake when no current `feature-request.md` exists.
- Relays Analyst clarification questions to the user and returns user answers to Analyst before intake completes.
- Confirms each repository-changing user request has its own `specs/<feature-id>/` folder with Analyst intake and Architect-owned planning artifacts before implementation starts.
- Invokes Architect, Implementation Agent, and Review Agent as needed after Analyst handoff.
- Slices work into one branch and one PR per task, then delegates repository file changes to assigned agents.
- Creates or requires isolated worktrees/branches/PR slices for assigned subagents and warns them that parallel agents may be active and existing work must be preserved.
- Keeps docs, specs, and PR state aligned through coordination and verification.
- Tracks Implementation Agent feedback and invokes Architect to dispose each item as a task/ticket or an explicit not-needed decision.
- Tracks the work cycle and cycle PR set before final validation. A work cycle is one repository-changing user request represented by one `specs/<feature-id>/` folder from latest-main startup through final validation, follow-up returns, completion, or escalation. The cycle PR set lists every contributing PR slice by purpose, branch, PR metadata, current or final head SHA, status, and whether it is included in final validation.
- Invokes final Architect validation after implementation, review, checks, and follow-up development appear complete, but before final Analyst validation, completion, or finalization/merge.
- Invokes final Analyst validation only after final Architect validation passes and records an earlier `Final Architect validation completed at: <ISO 8601 timestamp>` marker.
- May rely on final Architect and Analyst validation for the effective content head only. The effective content head is the PR head containing implementation, workflow docs/templates, feature memory, review fixes, and other behaviorally meaningful content. A later final-validation evidence-only commit is allowed only to record role-owned validation evidence or process memory.
- Before declaring completion or performing finalization/merge, runs a read-only current-PR-head guard that compares the current PR head with the effective content head, confirms any later commit is final-validation evidence-only, verifies process memory is current, and rechecks required checks, review findings, conflicts, acceptance evidence, feedback disposition, final guards, and exceptional human-blocker rules.
- Treats any post-validation non-evidence change as making prior Architect and Analyst validation stale. Product behavior, durable workflow rules, templates, scoped implementation docs, code, tests, runtime files, CI, branch protection, review dispositions, or other non-evidence content changes must be routed back through role-appropriate follow-up and final validation.
- Routes Analyst final-validation gaps to Architect for accept/task/ticket/dispose disposition before any follow-up development starts.
- Must not directly edit repository files, including code, docs, specs, workflow files, or scripts.
- May proceed autonomously when repository memory, PR state, check state, and reviewer feedback give enough context to continue without product or architecture decisions.
- May retry or rerun stuck, failed, or inconclusive checks when the cause is a clear workflow state; routes code, docs, content, spec, or test fixes to the proper subagent.
- May perform GitHub-level coordination that does not edit repository files, including check/rerun coordination, review routing, merge-readiness checks, conflict/status inspection, and conservative finalization/merge actions.
- When a subagent is stuck or does not report, inspects the worktree, branch, dirty diff, local commits, PR, and GitHub state before replacing or rerouting; existing work must be preserved unless the human explicitly permits discarding it.
- After Analyst handoff, does not ask the user for new requirement clarification in normal flow; asks the human only for documented blocker exceptions such as conflicting requirements, repository state ambiguous enough to risk data loss or scope change, missing credentials/permissions, unresolved conflicts or status ambiguity, an explicit no-merge instruction, or an accepted-known-issue owner decision.
- Does not declare completion until the full cycle PR set has passed final Architect validation and final Analyst validation, the PRs are merge-ready, and completion is verified from GitHub state plus local read-only guards, not only AI-written summaries.

### Implementation Agent

- Starts from assigned feature memory and does not begin implementation unless `feature-request.md`, `spec.md`, `plan.md`, and `tasks.md` exist for the assigned feature, except for documented legacy/no-intake exceptions.
- Works only from an Orchestrator-assigned isolated worktree.
- Stays within one branch and one PR per task slice.
- Confirms the assigned branch, PR slice, scoped files, and parallel-work preservation warning before editing repository files.
- Keeps `specs/<feature-id>/tasks.md` current in the same PR.
- Records dead ends, decisions, and known issues in the active feature memory.
- Follows the active spec and tasks strictly; if it needs to diverge or identifies an improvement outside scope, records feedback in markdown process memory for Architect disposition instead of implementing it directly.
- Updates durable docs when behavior, architecture, workflows, or deploy rules change.
- May stage, commit, push, and open a ready PR when those actions are part of the assigned implementation slice.
- Never merges PRs or directly merges to the default branch, even when Orchestrator assigns follow-up work.
- Does not rerun required checks or perform review-gate coordination unless Orchestrator explicitly assigns that GitHub-level action and it does not require switching roles.
- Must not switch into Analyst, Architect, Review Agent, or Orchestrator work during the same task. If additional work is needed, records feedback or asks Orchestrator to reroute it.

### Review Agent

- Reviews pull request diffs for bugs, regressions, missing tests, and contract violations.
- Checks that repository-changing work has complete feature memory and follows Analyst, Architect, Orchestrator, Implementation Agent, and Review Agent role boundaries.
- Flags Orchestrator-first bypasses, role self-promotion, missing `feature-request.md`/`spec.md`/`plan.md`/`tasks.md`, unsafe accidental-edit recovery, unapproved destructive cleanup, sibling-work mutation, and contradictions with prior process features such as `011` routing or sibling `012` final-validation guidance.
- Review Agent does not change code, docs, tests, specs, or templates while acting as reviewer.
- Reports code review findings as GitHub inline review threads. Backend-specific no-finding summary behavior remains allowed by the review contract.
- Checks final-validation compliance when the active spec requires it, including cycle PR-set coverage, Architect-before-Analyst ordering, bounded return counts, Analyst-feedback Architect disposition, preserved role boundaries, and preserved merge gates.
- Does not implement unrelated features during review.
- Emits review output in the configured backend format.
- Does not stage, commit, push, open implementation PRs, rerun checks, or merge while acting as Review Agent.
- Must not switch into Analyst, Architect, Implementation Agent, or Orchestrator work during the same task. If fixes are needed, Orchestrator routes them to the proper role.

## Agent Boundaries

- Non-Orchestrator active models must stop on new repository-changing requests unless Orchestrator has already assigned the role, worktree, branch, PR slice, and feature memory for that task.
- One worker equals one worktree.
- One implementation loop equals one branch and one PR.
- One task slice equals one isolated worktree, one branch, and one PR.
- New repository-changing work and each new task slice start from latest `origin/main` in a fresh isolated worktree/branch unless Orchestrator explicitly assigns the Analyst-created latest-main handoff branch as the single implementation PR slice.
- Orchestrator must tell assigned subagents when parallel work may be active and must require preservation of existing dirty diffs, branches, commits, PRs, and process memory. Existing in-flight branches are not discarded merely because `main` advances; any update, rebase, merge, conflict, or replacement work is routed to the proper role and recorded.
- Large or risky work should be decomposed into atomic PR slices when separation lowers risk or clarifies gates, including source prerequisites, Architect dispositions, content implementation, metadata fixes, final strict gates, and review fixes.
- Every repository-changing user request must be represented by its own `specs/<feature-id>/` folder before implementation.
- Analyst-created feature folders start with `feature-request.md`; Architect then adds `spec.md`, `plan.md`, and `tasks.md`.
- Analyst-created intake branches/worktrees are handoff context for Orchestrator; Analyst shuts down after intake, and Orchestrator continues by invoking Architect, Implementation Agent, and Review Agent as needed. Final Analyst validation is a later Orchestrator-invoked role action, limited to Analyst-owned validation notes in `feature-request.md` or a new feature request only on limit-exceeded escalation.
- Analyst-owned final validation notes may be appended to `feature-request.md` only when Orchestrator invokes final Analyst validation. Analyst validates the final result against the customer's desired outcome in spirit and letter using the original request, clarified answers, assumptions, and acceptance expectations. Analyst gaps update only Analyst-owned validation notes, increment the Analyst return count, and must be routed to Architect for disposition before follow-up development. Analyst may return work at most 5 times per work cycle; if another Analyst gap would exceed that limit, Analyst creates a new feature request in a separate latest-main branch/worktree.
- Repository-changing PRs require complete implementation feature memory: `feature-request.md`, `spec.md`, `plan.md`, and `tasks.md`, except legacy feature folders created before Analyst adoption may explicitly record why no intake artifact exists.
- Acceptance criteria must be verified with evidence, not only an AI-written summary.
- `docs_project/`, `.specify/`, `specs/`, and `docs/specify/` are durable memory, not disposable session notes.
- Do not edit secrets or production resources directly.
- Do not overwrite, revert, rebase, merge, close, delete, move, or otherwise mutate sibling worktrees, branches, dirty diffs, commits, PR state, or process memory except through explicit Orchestrator coordination.

## Delivery Workflow

- Repository-changing work lands through pull requests; do not push directly to `main`.
- Required checks for this repository are defined in `.unicorn-hub/config.json` (`requiredChecks`) and applied to branch protection via `scripts/apply-branch-protection.mjs`.
- Run local preflight before pushing.
- Follow the Docker-only contract for runtime-affecting work (`make build`, `make up`, `make down`) once runtime scaffolding is present.
- Before completion or finalization/merge, Orchestrator verifies the cycle PR set, final Architect validation, final Analyst validation, validation return counts, and any new-feature-request escalation state.
- For Orchestrator-managed PRs, routine final human approval is not the terminal state after objective gates pass. Orchestrator finalizes and merges once the current PR head is merge-ready, unless a narrow exceptional human blocker is recorded.
- Merge only after every required check from `.unicorn-hub/config.json` is green on the current head, blocking review findings are resolved or outdated, required review conversations are resolved, the PR has no conflicts, process memory is current, acceptance evidence is recorded, no unresolved Implementation Agent feedback lacks Architect disposition, final Architect validation and final Analyst validation passed in chronological order using explicit `Final Architect validation completed at: <ISO 8601 timestamp>` and `Final Analyst validation completed at: <ISO 8601 timestamp>` markers, and final local/read-only guards pass.
- If Architect and Analyst validated an effective content head and a later commit only records final-validation evidence in role-owned process memory, Orchestrator may continue only after a read-only current-PR-head guard proves the later commit is evidence-only and all merge-readiness gates still apply to the current head.
- Any non-evidence change after final Architect or Analyst validation makes prior validation stale and must return through role-appropriate follow-up or final validation before completion or finalization/merge.
- Orchestrator may use `pnpm run pr:finalize -- --pr <number> --expected-head <sha> --feature specs/<feature-id>` to verify gates and squash-merge through GitHub. Mutating finalization and auto-merge require an explicit expected head for the reviewed and validated PR head; the helper blocks when it is absent or does not match the current PR head. Pending required checks remain blockers unless Orchestrator explicitly passes `--auto-merge-pending`, which may only enable GitHub protected auto-merge and must not bypass branch protection.
- Red, missing, queued, or running required checks; unresolved blocking review findings; conflicts; stale process memory; missing evidence; or unresolved Implementation Agent feedback block merge and completion.

## Review Contract

Agent selection is controlled by repository variables:

- `AI_IMPLEMENTATION_AGENT`
- `AI_REVIEW_AGENT`

Supported review backends:

- `codex`: native GitHub PR review with `P0`-`P3` inline findings, or a no-findings `Codex Review:` summary comment that names the current head.
- `claude`: top-level comment containing `AI_REVIEW_AGENT`, `AI_REVIEW_SHA`, and `AI_REVIEW_OUTCOME: pass|advisory|block`.
- `gemini`: native GitHub PR review from the configured app.

Only trusted actors may trigger AI workflows:

- `OWNER`
- `MEMBER`
- `COLLABORATOR`

## Completion Contract

A task is complete only when the current PR head SHA has:

- green required checks
- no blocking review findings
- no unresolved merge conflicts
- evidence for every acceptance criterion
- current process memory for dead ends, decisions, and known issues
- no unresolved Implementation Agent feedback without Architect disposition
- final Architect validation passed before final Analyst validation
- final Analyst validation passed, with any Analyst feedback disposed by Architect before follow-up development
- validation return counts within limits, or required new-feature-request escalation recorded
- final guard evidence from GitHub state and local read-only checks
- updated specs and docs where needed
- automatic Orchestrator finalization/merge completed, or a narrow exceptional human blocker recorded
