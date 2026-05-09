# Spec: Agent Workflow Autonomy And Role-Boundary Hardening

## Analyst Intake

- Source request: `feature-request.md`
- Intake assumptions or open questions carried into this spec:
  - This is a repository workflow/process feature, not learner-facing product work.
  - Durable guidance and templates are sufficient for this slice; executable feature-request guard enforcement remains out of scope unless a later Architect feature scopes it.
  - Orchestrator autonomy must be explicit enough to proceed safely without weakening role ownership.

## Goal

Create durable process guidance that makes Orchestrator autonomy, role boundaries, PR slicing, merge readiness, and feedback routing reproducible for future Cabadrive work.

## Scope

In scope:

- `AGENTS.md`
- `CLAUDE.md`
- `docs_project/project/devops/ai-pr-workflow.md`
- `docs_project/project/devops/review-contract.md`
- `.github/pull_request_template.md`
- `specs/007-agent-workflow-autonomy/*` during implementation

Out of scope:

- Learner-facing app behavior or content.
- Docker/runtime changes.
- Branch protection changes.
- CI auto-merge implementation.
- Executable `feature-request.md` guard enforcement unless a later Architect feature scopes it.
- Product source, tests, workflows, package metadata, lockfiles, secrets, or production resources except where explicitly listed in scope.

## User Stories

### User Story 1

As an Orchestrator, I want clear autonomy rules for proceeding, retrying, rerouting, replacing stuck subagents, asking the human, and declaring completion, so that I can drive repository work to merge readiness without violating role boundaries.

### User Story 2

As an Implementation Agent, I want one slice to map to one worktree, one branch, and one PR, so that each change remains reviewable, isolated, and mergeable.

### User Story 3

As a Review Agent, I want merge-readiness, evidence, and role-boundary expectations documented, so that reviews can catch workflow regressions as well as code defects.

## Acceptance Criteria

1. Given durable agent guidance, when Orchestrator work requires repository file edits, then guidance states Orchestrator never edits repo files directly and delegates edits to the role-appropriate subagent.
2. Given subagent guidance, when an agent is assigned a role, then guidance states the subagent cannot switch roles mid-task and different work must be rerouted by Orchestrator.
3. Given Orchestrator autonomy guidance, when repository memory, PR state, check state, and reviewer feedback provide enough context, then guidance defines when Orchestrator proceeds, retries/reruns, reroutes to a subagent, replaces a stuck subagent, or asks the human.
4. Given PR slicing guidance, when implementation work is decomposed, then one task slice equals one isolated worktree, one branch, and one PR.
5. Given large or risky work, when source prerequisites, Architect dispositions, content implementation, metadata fixes, final strict gates, or review fixes are separable, then guidance requires separate PR slices when separation lowers risk or clarifies gates.
6. Given user-authorized auto-merge or merge authority, when a PR is merge-ready, then guidance documents required preconditions before Orchestrator may merge without asking again.
7. Given a stuck or non-reporting subagent, when Orchestrator intervenes, then guidance requires inspection of local worktree, branch, dirty diff, commits, PRs, and GitHub state while preserving existing work unless the human explicitly permits discarding it.
8. Given completion guidance, when Orchestrator declares a task complete, then completion evidence must be based on GitHub state and local read-only checks, not only AI-written summaries.
9. Given role guidance, when agents need repository actions, then Analyst, Architect, Implementation Agent, Review Agent, and Orchestrator commit, push, PR, review, rerun, and merge permissions are clarified without weakening Analyst or Architect boundaries.
10. Given durable docs and templates, when the implementation diff is reviewed, then PR template and devops workflow/review docs align on role boundaries, PR slicing, feedback routing, merge readiness, and evidence expectations.

## Negative Scenarios

1. Given a PR has red, missing, or running required checks, when Orchestrator evaluates merge readiness, then Orchestrator must not merge.
2. Given blocking review findings are unresolved, when Orchestrator evaluates merge readiness, then Orchestrator must route or wait for resolution instead of merging.
3. Given merge conflicts exist, when Orchestrator evaluates merge readiness, then Orchestrator must not merge until conflicts are resolved in a proper implementation slice.
4. Given process memory is stale, acceptance evidence is missing, or Implementation Agent feedback lacks Architect disposition, when Orchestrator evaluates completion, then completion must be blocked.
5. Given a stuck subagent has dirty diffs, local commits, an open branch, or an open PR, when Orchestrator replaces or reroutes the work, then existing work must be preserved unless explicit human direction permits discarding it.
6. Given an agent receives work outside its role, when the work is still needed, then the agent must not switch roles and Orchestrator must reroute it.

## Requirements

- FR-001: Durable guidance must state that Orchestrator does not directly edit repository files.
- FR-002: Durable guidance must state that subagents cannot switch roles mid-task.
- FR-003: Orchestrator guidance must define autonomous proceed, retry/rerun, reroute, replace-stuck-subagent, and ask-human rules.
- FR-004: PR guidance must define one task slice as one isolated worktree, one branch, and one PR.
- FR-005: PR guidance must require atomic decomposition for large work and follow-up fixes when separation lowers risk.
- FR-006: Merge guidance must document auto-merge or merge preconditions when the user has already authorized merge behavior.
- FR-007: Stuck-subagent guidance must require preserving dirty diffs, branches, commits, and PRs.
- FR-008: Completion guidance must require GitHub and local-state evidence for required checks, review findings, conflicts, process memory, acceptance evidence, and final guards.
- FR-009: Role guidance must clarify commit, push, PR, rerun, review, and merge permissions by role.
- FR-010: Review guidance must require blocking feedback to be routed through the correct role and tracked to resolution or explicit Architect disposition.
- FR-011: PR template and devops workflow/review docs must align with the updated role and completion contract.
- FR-012: Implementation must avoid learner-facing app, content, Docker/runtime, CI auto-merge, branch-protection, and executable guard changes.

## Success Criteria

- SC-001: Text search finds Orchestrator no-direct-edit and subagent no-role-switch guidance in durable agent docs.
- SC-002: Text search finds proceed/retry/reroute/ask and stuck-subagent preservation guidance in durable workflow docs.
- SC-003: Text search finds one-worktree/branch/PR slicing guidance and merge-readiness preconditions.
- SC-004: Text search finds role-specific commit, push, PR, review, rerun, and merge permission guidance.
- SC-005: Diff review shows only in-scope docs/templates and `specs/007-agent-workflow-autonomy/*` changed.
- SC-006: Verification evidence is recorded in `tasks.md`.

## Assumptions

- `CLAUDE.md` exists or will be checked by the Implementation Agent; if absent, the absence must be recorded as process evidence rather than creating unrelated files outside scope without reason.
- Process-only changes can be verified through text search, diff review, feature-memory checks, repo checks, and preflight.
- Auto-merge means a documented Orchestrator permission under explicit user authorization and merge-ready preconditions, not a new CI automation feature.

## Review And Verification Requirements

- Implementation requirements: The Implementation Agent must update only the scoped durable docs/templates and this feature memory, keep `tasks.md` current, preserve ASCII unless existing files require otherwise, and route any feedback or scope tension to Architect disposition instead of broadening implementation.
- Review requirements: The Review Agent must verify role boundaries, PR slicing, merge-readiness gates, feedback routing, and changed-file scope, with blocking findings for any workflow text that permits Orchestrator file edits, role switching, unsafe merge, stale evidence, or silent scope expansion.
- Test/verification requirements: Run `node scripts/check-feature-memory.mjs --worktree`, `pnpm run check:repo`, and `pnpm run preflight` before push/PR when implementation reaches that stage; also perform manual diff review for docs/process consistency and record evidence in `tasks.md`.
