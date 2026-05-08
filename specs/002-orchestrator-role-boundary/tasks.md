# Tasks: Orchestrator Role Boundary

## Setup

- [x] T001 Create feature memory folder for this process-rule change.
- [x] T002 Record goal, scope, acceptance criteria, negative scenarios, and verification plan.
- [x] T003 Confirm implementation branch/worktree before editing durable agent instructions.

## Implementation

- [x] T004 Search durable docs for old Orchestrator ownership language.
- [x] T005 Update agent role instructions so the Architect owns feature-memory creation.
- [x] T006 Update Orchestrator instructions so the role is coordination and enforcement only, with no direct repository edits.
- [x] T007 Update request intake guidance so each repository-changing request maps to a separate `specs/<feature-id>/` folder before implementation.
- [x] T008 Update Implementation Agent handoff language to start from assigned feature memory.
- [x] T009 Update Review Agent guidance to check feature-memory and role-boundary compliance.

## Verification

- [x] T010 Verify no product code, workflow scripts, runtime files, CI files, or automation scripts changed.
- [x] T011 Verify no durable instruction still says the Orchestrator creates or updates feature memory.
- [x] T012 Verify acceptance criteria are covered with concrete documentation evidence.
- [x] T013 Update process memory with final decisions, dead ends, known issues, and verification evidence.

## Process Memory

### Dead Ends

- None.

### Decisions

- Treat this as a process documentation feature, not an executable workflow-enforcement feature.
- Apply "every request" to repository-changing requests, including process-rule and documentation changes.
- Keep implementation out of product code and workflow scripts.
- Use `AGENTS.md` as the durable role-boundary source for this change because the targeted search found the stale Orchestrator ownership language there.
- Leave unrelated untracked build artifact directories untouched: `dist/`, `node_modules/`, `public/`, and `test-results/`.
- Rebase onto `origin/main` before final PR handoff and resolve the single `AGENTS.md` conflict by preserving both the repository-changing scope and the no-direct-push-to-main rule.

### Known Issues

- Executable enforcement of this boundary is not part of this feature.
- `specs/002-orchestrator-role-boundary/` remains untracked in this worktree, so `git diff --name-only` shows only tracked-file changes; `git status --short` is needed to see this feature-memory update.

### Verification Evidence

- Branch/worktree: `git switch -c codex/002-orchestrator-role-boundary` succeeded before file edits.
- Old Orchestrator ownership search: `rg -n "Creates or updates feature memory|Creates or updates feature-memory|Orchestrator.*Creates|Orchestrator.*updates feature memory|Orchestrator.*create.*feature memory|Orchestrator.*update.*feature memory" AGENTS.md docs_project .specify/memory/constitution.md` returned no matches.
- Release old-language search: `rg -n "Creates or updates feature memory before product-code changes|Creates or updates feature memory before|Orchestrator.*Creates or updates feature memory|Orchestrator.*feature memory before product-code" AGENTS.md docs_project .specify/memory/constitution.md` returned no matches.
- New role-boundary search: `rg -n "### Architect|repository-changing user request|Must not directly edit|must not directly edit|Starts from assigned feature memory|complete feature memory|role boundaries|Coordinates assigned agents" AGENTS.md` found the Architect role, repository-changing request rule, Orchestrator no-direct-edit rule, Implementation Agent handoff rule, and Review Agent compliance rule.
- Scope check: `git diff --name-only` returned only `AGENTS.md` among tracked files.
- Worktree check: `git status --short` showed `M AGENTS.md`, untracked `specs/002-orchestrator-role-boundary/`, and unrelated untracked artifact directories `dist/`, `node_modules/`, `public/`, and `test-results/`.
- Whitespace check: `git diff --check` passed.
- Feature-memory check: `node scripts/check-feature-memory.mjs --worktree` passed with `No configured product paths changed; feature-memory gate passes.`
- Local preflight: `pnpm run preflight` passed, including `check:feature-memory` and `check:repo`.
- Documentation evidence: `AGENTS.md` lines 34-40 define Architect ownership of `spec.md`, `plan.md`, and `tasks.md`; lines 42-50 define Orchestrator coordination/enforcement and no direct repository edits; lines 54-57 define Implementation Agent handoff and task upkeep; lines 62-65 define Review Agent compliance checks; lines 73-74 require one feature folder and complete feature memory for repository-changing requests.
- Rebase evidence: `git rebase origin/main` found one `AGENTS.md` conflict in Delivery Workflow, resolved as `Repository-changing work lands through pull requests; do not push directly to main`.
