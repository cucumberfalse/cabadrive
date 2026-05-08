# Cabadrive Constitution

## Core Principles

### I. Spec-First Development

Every repository-changing request must have feature memory under `specs/<feature-id>/` before implementation. Analyst intake creates `feature-request.md`; Architect planning creates `spec.md`, `plan.md`, and `tasks.md` before implementation agents edit repository files.

### II. Testable Boundaries

Product behavior must be implemented behind boundaries that can be tested without real external services unless the test is explicitly integration-level.

### III. Test-First Bias

New behavior should begin with failing tests or a documented reason why tests are deferred. PRs without verification are not merge-ready.

### IV. Supervised Verification

Every product-code PR must name its goal, scope, acceptance criteria, negative scenario, and verification evidence before merge. AI-written summaries do not replace evidence tied to the requested behavior.

### V. PR-Only Workflow

Direct pushes to the default branch are forbidden after branch protection is enabled.

### VI. One Worktree Per Task

Parallel implementation work must use separate worktrees, branches, and PRs.

### VII. Deployability Contract

The default branch must remain deployable. Broken default branch status has priority over feature work.

### VIII. Simplicity

New abstractions require a current reason documented in `plan.md`.

### IX. Process Memory

Feature tasks must record dead ends, decisions, known issues, verification evidence, and Implementation Agent feedback before merge so future agents inherit the working context. Orchestrator must route each feedback item to Architect for a task/ticket or an explicit not-needed decision.

## Workflow

1. Analyst creates the next numbered feature folder and writes `feature-request.md`.
2. Orchestrator invokes Architect after Analyst handoff.
3. Architect writes `spec.md`, `plan.md`, and `tasks.md`, including implementation, review, and test/verification requirements.
4. Orchestrator assigns implementation in an isolated worktree and does not directly edit repository files.
5. Implementation Agent follows the active feature memory and records verification evidence, process memory, and any divergence or improvement feedback.
6. Orchestrator routes Implementation Agent feedback to Architect for disposition.
7. Run local preflight.
8. Open a PR.
9. Review Agent checks the diff and feature-memory compliance without changing code; code review findings are GitHub inline review threads.
10. Resolve CI and review.
11. Merge only when gates are green.

## Governance

Changes to this constitution require a PR that updates dependent templates and agent rule files.
