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
9. active `specs/<feature-id>/spec.md`
10. active `specs/<feature-id>/plan.md`
11. active `specs/<feature-id>/tasks.md`
12. relevant source files

If docs are stale or missing for the requested work, refresh `docs_project/` first before product-code implementation.

## Agent Roles

### Orchestrator

- Reads repository memory before starting.
- Creates or updates feature memory before product-code changes.
- Ensures feature memory names goal, scope, acceptance criteria, negative scenario, and verification evidence.
- Slices work into one branch and one PR per task.
- Keeps docs, specs, and PR state aligned.
- Does not declare completion until the PR is merge-ready.

### Implementation Agent

- Works only from an assigned isolated worktree.
- Stays within one branch and one PR per task slice.
- Updates `specs/<feature-id>/tasks.md` in the same PR.
- Records dead ends, decisions, and known issues in the active feature memory.
- Updates durable docs when behavior, architecture, workflows, or deploy rules change.
- Never merges directly to the default branch.

### Review Agent

- Reviews pull request diffs for bugs, regressions, missing tests, and contract violations.
- Does not implement unrelated features during review.
- Emits review output in the configured backend format.

## Agent Boundaries

- One worker equals one worktree.
- One implementation loop equals one branch and one PR.
- Product-code PRs require complete feature memory: `spec.md`, `plan.md`, and `tasks.md`.
- Acceptance criteria must be verified with evidence, not only an AI-written summary.
- `docs_project/`, `.specify/`, `specs/`, and `docs/specify/` are durable memory, not disposable session notes.
- Do not edit secrets or production resources directly.

## Delivery Workflow

- Product changes land through pull requests; do not push directly to `main`.
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

- `codex`: native GitHub PR review with `P0`-`P3` findings, or a no-findings `Codex Review:` summary comment that names the current head.
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
