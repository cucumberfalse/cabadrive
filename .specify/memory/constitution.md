# Cabadrive Constitution

## Core Principles

### I. Spec-First Development

Every repository-changing request defaults to Orchestrator entry and must have feature memory under `specs/<feature-id>/` before implementation. Orchestrator invokes Analyst first when no current `feature-request.md` exists; Analyst intake creates `feature-request.md`; Architect planning creates `spec.md`, `plan.md`, and `tasks.md` before implementation agents edit repository files.

### II. Testable Boundaries

Product behavior must be implemented behind boundaries that can be tested without real external services unless the test is explicitly integration-level.

### III. Test-First Bias

New behavior should begin with failing tests or a documented reason why tests are deferred. PRs without verification are not merge-ready.

### IV. Supervised Verification

Every product-code PR must name its goal, scope, acceptance criteria, negative scenario, and verification evidence before merge. AI-written summaries do not replace evidence tied to the requested behavior.

### V. PR-Only Workflow

Direct pushes to the default branch are forbidden after branch protection is enabled.

### VI. One Worktree Per Task

Parallel implementation work must use separate worktrees, branches, and PRs. Orchestrator must warn assigned subagents when parallel work may exist and require preservation of existing dirty diffs, branches, commits, PRs, and process memory.

### VII. Deployability Contract

The default branch must remain deployable. Broken default branch status has priority over feature work.

### VIII. Simplicity

New abstractions require a current reason documented in `plan.md`.

### IX. Process Memory

Feature tasks must record dead ends, decisions, known issues, verification evidence, and Implementation Agent feedback before merge so future agents inherit the working context. Orchestrator must route each feedback item to Architect for a task/ticket or an explicit not-needed decision.

## Workflow

1. Orchestrator receives repository-changing work by default, remains in the Orchestrator role, and invokes Analyst first when no current `feature-request.md` exists.
2. Analyst creates the next numbered feature folder, writes `feature-request.md`, routes any normal-flow requirement clarification through Orchestrator, then hands off and shuts down.
3. Orchestrator takes the Analyst-created intake context forward and invokes Architect after Analyst handoff.
4. Architect writes `spec.md`, `plan.md`, and `tasks.md`, including implementation, review, and test/verification requirements.
5. Orchestrator assigns implementation in an isolated worktree and does not directly edit repository files.
6. Implementation Agent follows the active feature memory and records verification evidence, process memory, and any divergence or improvement feedback.
7. Orchestrator routes Implementation Agent feedback to Architect for disposition.
8. Run local preflight.
9. Open a PR.
10. Review Agent checks the diff and feature-memory compliance without changing code; code review findings are GitHub inline review threads.
11. Resolve CI and review.
12. Merge only when gates are green and merge authority is satisfied; explicit user authorization may let Orchestrator merge without asking again, but does not remove gates.

## Governance

Changes to this constitution require a PR that updates dependent templates and agent rule files.
