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

## Agent Roles

### Analyst

- Owns repository request intake before architecture work starts.
- Creates the next `specs/<feature-id>/` folder using the max existing numeric prefix under `specs/` plus one, zero-padded to three digits, followed by a short slug.
- If duplicate numeric prefixes already exist, still uses the maximum numeric prefix plus one; if a collision occurs on the target folder name, chooses a clearer slug or asks the Orchestrator to coordinate before writing.
- Splits independent goals into separate feature folders, or records why a split is deferred.
- Runs a Q&A loop until requirements are clear enough for architecture work, or records explicit assumptions and open questions.
- Uses public-safe external research when current or external practice context would improve the request, and records sources used.
- Writes exactly one intake artifact, `feature-request.md`, combining the original request, user answers, project context, research, assumptions, risks, open questions, and acceptance expectations.
- Writes no code, technical plan, implementation tasks, reviews, commits, PRs, or files outside the assigned intake artifact.
- Hands off to the Orchestrator after `feature-request.md` is ready, then shuts down.
- Must not switch into Architect, Implementation Agent, Review Agent, or Orchestrator work during the same task. If additional work is needed, Orchestrator reroutes it.

### Architect

- Starts from `feature-request.md` after Analyst handoff.
- Owns `spec.md`, `plan.md`, and `tasks.md` creation and updates for the assigned feature memory.
- Writes the technical solution, task decomposition, implementation requirements, review requirements, and test/verification requirements.
- Ensures feature memory names goal, scope, acceptance criteria, negative scenario, and verification evidence.
- Splits or redirects independent goals that Analyst has not already separated instead of bundling unrelated changes into one process record.
- Architect does not write code, tests, runtime files, or implementation changes.
- Hands complete feature memory to the Orchestrator for coordination and enforcement.
- Does not stage, commit, push, open PRs, review PRs, or merge while acting as Architect unless a future spec explicitly changes that boundary.
- Must not switch into Analyst, Implementation Agent, Review Agent, or Orchestrator work during the same task. If additional work is needed, Orchestrator reroutes it.

### Orchestrator

- Reads repository memory before starting.
- Coordinates assigned agents from request intake through production readiness and enforces the repository workflow.
- Invokes Analyst for repository-changing request intake when no current `feature-request.md` exists.
- Confirms each repository-changing user request has its own `specs/<feature-id>/` folder with Analyst intake and Architect-owned planning artifacts before implementation starts.
- Invokes Architect, Implementation Agent, and Review Agent as needed after Analyst handoff.
- Slices work into one branch and one PR per task, then delegates repository file changes to assigned agents.
- Keeps docs, specs, and PR state aligned through coordination and verification.
- Tracks Implementation Agent feedback and invokes Architect to dispose each item as a task/ticket or an explicit not-needed decision.
- Must not directly edit repository files, including code, docs, specs, workflow files, or scripts.
- May proceed autonomously when repository memory, PR state, check state, and reviewer feedback give enough context to continue without product or architecture decisions.
- May retry or rerun stuck, failed, or inconclusive checks when the cause is a clear workflow state; routes code, docs, content, spec, or test fixes to the proper subagent.
- May perform GitHub-level coordination that does not edit repository files, including check/rerun coordination, review routing, merge-readiness checks, conflict/status inspection, and authorized merge actions.
- When a subagent is stuck or does not report, inspects the worktree, branch, dirty diff, local commits, PR, and GitHub state before replacing or rerouting; existing work must be preserved unless the human explicitly permits discarding it.
- Asks the human when requirements conflict, repository state is ambiguous enough to risk data loss or scope change, credentials/permissions are missing, or a decision belongs to the human merge owner.
- Does not declare completion until the PR is merge-ready and completion is verified from GitHub state plus local read-only guards, not only AI-written summaries.

### Implementation Agent

- Starts from assigned feature memory and does not begin implementation if `spec.md`, `plan.md`, or `tasks.md` is missing.
- Works only from an assigned isolated worktree.
- Stays within one branch and one PR per task slice.
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
- Review Agent does not change code, docs, tests, specs, or templates while acting as reviewer.
- Reports code review findings as GitHub inline review threads. Backend-specific no-finding summary behavior remains allowed by the review contract.
- Does not implement unrelated features during review.
- Emits review output in the configured backend format.
- Does not stage, commit, push, open implementation PRs, rerun checks, or merge while acting as Review Agent.
- Must not switch into Analyst, Architect, Implementation Agent, or Orchestrator work during the same task. If fixes are needed, Orchestrator routes them to the proper role.

## Agent Boundaries

- One worker equals one worktree.
- One implementation loop equals one branch and one PR.
- One task slice equals one isolated worktree, one branch, and one PR.
- Large or risky work should be decomposed into atomic PR slices when separation lowers risk or clarifies gates, including source prerequisites, Architect dispositions, content implementation, metadata fixes, final strict gates, and review fixes.
- Every repository-changing user request must be represented by its own `specs/<feature-id>/` folder before implementation.
- Analyst-created feature folders start with `feature-request.md`; Architect then adds `spec.md`, `plan.md`, and `tasks.md`.
- Repository-changing PRs require complete implementation feature memory: `feature-request.md`, `spec.md`, `plan.md`, and `tasks.md`, except legacy feature folders created before Analyst adoption may explicitly record why no intake artifact exists.
- Acceptance criteria must be verified with evidence, not only an AI-written summary.
- `docs_project/`, `.specify/`, `specs/`, and `docs/specify/` are durable memory, not disposable session notes.
- Do not edit secrets or production resources directly.

## Delivery Workflow

- Repository-changing work lands through pull requests; do not push directly to `main`.
- Required checks for this repository are defined in `.unicorn-hub/config.json` (`requiredChecks`) and applied to branch protection via `scripts/apply-branch-protection.mjs`.
- Run local preflight before pushing.
- Follow the Docker-only contract for runtime-affecting work (`make build`, `make up`, `make down`) once runtime scaffolding is present.
- A human remains the default final merge authority unless the current user instructions explicitly authorize auto-merge or Orchestrator merge authority.
- Merge only after every required check is green on the current head, blocking review findings are resolved or outdated, the PR has no conflicts, process memory is current, acceptance evidence is recorded, no unresolved Implementation Agent feedback lacks Architect disposition, and final local/read-only guards pass.
- If authorized to merge, Orchestrator may merge without asking again only after verifying merge readiness from GitHub state and local read-only guards.
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
- final guard evidence from GitHub state and local read-only checks
- updated specs and docs where needed
- only final human approval or merge mechanics remaining
