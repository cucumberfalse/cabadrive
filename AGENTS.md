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

### Architect

- Starts from `feature-request.md` after Analyst handoff.
- Owns `spec.md`, `plan.md`, and `tasks.md` creation and updates for the assigned feature memory.
- Writes the technical solution, task decomposition, implementation requirements, review requirements, and test/verification requirements.
- Ensures feature memory names goal, scope, acceptance criteria, negative scenario, and verification evidence.
- Splits or redirects independent goals that Analyst has not already separated instead of bundling unrelated changes into one process record.
- Architect does not write code, tests, runtime files, or implementation changes.
- Hands complete feature memory to the Orchestrator for coordination and enforcement.

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
- Does not declare completion until the PR is merge-ready.

### Implementation Agent

- Starts from assigned feature memory and does not begin implementation if `spec.md`, `plan.md`, or `tasks.md` is missing.
- Works only from an assigned isolated worktree.
- Stays within one branch and one PR per task slice.
- Keeps `specs/<feature-id>/tasks.md` current in the same PR.
- Records dead ends, decisions, and known issues in the active feature memory.
- Follows the active spec and tasks strictly; if it needs to diverge or identifies an improvement outside scope, records feedback in markdown process memory for Architect disposition instead of implementing it directly.
- Updates durable docs when behavior, architecture, workflows, or deploy rules change.
- Never merges directly to the default branch.

### Review Agent

- Reviews pull request diffs for bugs, regressions, missing tests, and contract violations.
- Checks that repository-changing work has complete feature memory and follows Analyst, Architect, Orchestrator, Implementation Agent, and Review Agent role boundaries.
- Review Agent does not change code, docs, tests, specs, or templates while acting as reviewer.
- Reports code review findings as GitHub inline review threads. Backend-specific no-finding summary behavior remains allowed by the review contract.
- Does not implement unrelated features during review.
- Emits review output in the configured backend format.

## Agent Boundaries

- One worker equals one worktree.
- One implementation loop equals one branch and one PR.
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
- A human remains the final merge authority.
- Merge only after every required check is green, blocking findings are resolved, and the PR has no conflicts.

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
- updated specs and docs where needed
- only final human approval or merge mechanics remaining
