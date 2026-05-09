# Plan: Agent Workflow Autonomy And Role-Boundary Hardening

## Summary

Update Cabadrive's durable agent and devops process guidance so role boundaries, Orchestrator autonomy, PR slicing, merge readiness, stuck-subagent handling, and feedback routing are explicit and reproducible. This is a bounded documentation/template implementation with no learner-facing, runtime, CI, branch-protection, or executable guard changes.

## Technical Context

- runtime: none; process documentation and templates only.
- dependencies: none.
- product paths: none.
- data changes: none.
- feature memory path: `specs/007-agent-workflow-autonomy/`.
- likely implementation paths:
  - `AGENTS.md`
  - `CLAUDE.md`
  - `docs_project/project/devops/ai-pr-workflow.md`
  - `docs_project/project/devops/review-contract.md`
  - `.github/pull_request_template.md`
  - `specs/007-agent-workflow-autonomy/tasks.md`

## Scope Boundaries

- in scope: durable role guidance, Orchestrator autonomy rules, PR slicing rules, merge readiness, stuck-subagent handling, role-specific repository permissions, feedback routing, PR template/devops doc alignment, and this feature memory.
- out of scope: learner-facing behavior, content, Docker/runtime changes, branch protection, CI auto-merge implementation, workflow YAML, executable feature-request guard enforcement, app tests, package metadata, lockfiles, secrets, and production resources.

## Constitution Check

- Spec-first: yes; Analyst intake exists and this Architect feature memory precedes implementation.
- Testable boundaries: yes; requirements map to text search, diff scope, local checks, and manual process consistency review.
- PR-only: yes; implementation must land through a PR and not direct push to `main`.
- Simplicity: yes; update durable guidance only, with no new automation or runtime abstraction.
- Deployability: neutral; no runtime behavior changes.

## Implementation Approach

1. Confirm the assigned implementation worktree, branch, and feature memory before editing.
2. Search scoped durable docs for existing role, PR slicing, merge readiness, review, and feedback language:
   - `rg -n "Orchestrator|Analyst|Architect|Implementation Agent|Review Agent|worktree|branch|PR|merge|auto-merge|feedback|required checks|conflict|inline review" AGENTS.md CLAUDE.md docs_project/project/devops .github specs/007-agent-workflow-autonomy`
3. Update `AGENTS.md` and `CLAUDE.md` so role boundaries are aligned, including Orchestrator no-direct-file-edits, subagent no-role-switching, and role-specific repository permissions.
4. Update `docs_project/project/devops/ai-pr-workflow.md` with autonomous proceed/retry/reroute/ask rules, one-slice/one-worktree/one-branch/one-PR guidance, stuck-subagent preservation, merge-ready gates, and GitHub/local evidence requirements.
5. Update `docs_project/project/devops/review-contract.md` so review expectations block unsafe merges, stale evidence, unresolved feedback, and role-boundary violations.
6. Update `.github/pull_request_template.md` so PR authors and reviewers confirm role boundaries, feature-memory evidence, task-slice scope, and merge-readiness evidence.
7. Keep `specs/007-agent-workflow-autonomy/tasks.md` current as implementation proceeds, including decisions, known issues, verification evidence, Implementation Agent feedback, and Architect dispositions.
8. Do not add executable enforcement for `feature-request.md`, auto-merge, branch protection, or CI behavior in this feature.

## Complexity Tracking

No new runtime abstraction is expected. The main complexity is process wording: autonomy must help Orchestrator continue safely while preserving Analyst, Architect, Implementation Agent, and Review Agent ownership. Any ambiguity discovered during implementation must be recorded in `tasks.md` for Architect disposition.

## Verification

| Acceptance criterion | Evidence |
| --- | --- |
| AC-001 | `rg -n "Orchestrator.*(never|must not).*edit|directly edit|delegat" AGENTS.md CLAUDE.md docs_project/project/devops` |
| AC-002 | `rg -n "switch roles|cannot switch|must not switch|reroute" AGENTS.md CLAUDE.md docs_project/project/devops` |
| AC-003 | `rg -n "proceed|retry|rerun|reroute|ask the human|stuck subagent|replace" AGENTS.md CLAUDE.md docs_project/project/devops` |
| AC-004 | `rg -n "one .*worktree.*branch.*PR|one task slice|isolated worktree" AGENTS.md CLAUDE.md docs_project/project/devops .github/pull_request_template.md` |
| AC-005 | `rg -n "separate PR|atomic|source prerequisite|metadata fix|review fix|final guard" AGENTS.md CLAUDE.md docs_project/project/devops` |
| AC-006 | `rg -n "auto-merge|merge-ready|required checks|blocking review|conflicts|authorized" AGENTS.md CLAUDE.md docs_project/project/devops .github/pull_request_template.md` |
| AC-007 | `rg -n "dirty diff|dirty worktree|branch|commit|PR|preserv" AGENTS.md CLAUDE.md docs_project/project/devops` |
| AC-008 | `rg -n "GitHub state|local.*state|local.*guard|AI-written|summary|evidence" AGENTS.md CLAUDE.md docs_project/project/devops .github/pull_request_template.md` |
| AC-009 | `rg -n "commit|push|open.*PR|rerun|merge" AGENTS.md CLAUDE.md docs_project/project/devops` plus manual review by role. |
| AC-010 | `git diff --name-only` and manual diff review show scoped docs/templates and feature memory only. |

Negative scenario evidence:

- Search evidence shows Orchestrator must not merge with red, missing, or running required checks; blocking review findings; conflicts; stale process memory; missing evidence; or unresolved Implementation Agent feedback.
- Search evidence shows stuck-subagent work preservation before replacement/reroute.
- Manual diff review confirms PR template, AI PR workflow doc, review contract, and agent guidance do not contradict each other.

Required command evidence:

- `node scripts/check-feature-memory.mjs --worktree`
- `pnpm run check:repo`
- `pnpm run preflight`

If a command cannot run because of local environment or unrelated repository state, record the exact command, failure, and mitigation in `tasks.md`.

## Risks

- Risk: Autonomy wording could be read as permission for Orchestrator to make product or architecture changes directly.
- Mitigation: Pair every autonomy permission with role-boundary and delegation language.

- Risk: Merge guidance could imply unsafe auto-merge or new CI automation.
- Mitigation: Define auto-merge only as user-authorized Orchestrator action under documented merge-ready preconditions; keep CI implementation out of scope.

- Risk: `AGENTS.md`, `CLAUDE.md`, devops docs, and PR template could drift.
- Mitigation: Require manual diff review for consistency and text-search evidence across all scoped durable docs.

- Risk: Implementation Agent finds executable enforcement would be useful.
- Mitigation: Record the feedback in `tasks.md` for Architect disposition; do not implement it in this feature.
