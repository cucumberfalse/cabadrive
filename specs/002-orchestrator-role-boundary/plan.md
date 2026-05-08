# Plan: Orchestrator Role Boundary

## Summary

Update Cabadrive durable agent instructions so the repository workflow reflects the corrected division of responsibility: Architect creates feature memory for each request, Orchestrator coordinates and enforces the flow, Implementation Agents implement from assigned memory, and Review Agents verify compliance.

This feature is intentionally documentation/process scoped. It does not alter product code, runtime behavior, CI workflows, or repository automation scripts.

## Technical Context

- runtime: none; process documentation only.
- dependencies: none.
- product paths: none.
- expected documentation paths: `AGENTS.md` and any other durable agent-rule files that repeat the old Orchestrator ownership model.
- feature memory path: `specs/002-orchestrator-role-boundary/`.

## Scope Boundaries

- in scope: role definitions, request intake flow, feature-memory ownership, process acceptance criteria, review expectations.
- out of scope: product UI, content pipeline, Docker runtime scaffold, CI/workflow script changes, branch-protection logic, automated enforcement.

## Constitution Check

- Spec-first: yes; this feature memory is created before repository-rule edits.
- Testable boundaries: yes; verification is a constrained diff review plus text checks for old/new role language.
- Test-first bias: not applicable to executable tests because this is documentation-only; verification will use reviewable textual evidence.
- Supervised verification: yes; acceptance criteria map to explicit documentation checks.
- PR-only: yes; implementation should land through a branch and PR.
- One worktree per task: yes; implementation should happen in the assigned worktree only.
- Deployability: neutral; no runtime behavior changes.
- Simplicity: yes; no new tooling or abstractions.
- Process memory: yes; decisions and known issues are recorded in `tasks.md`.

## Implementation Approach

1. Review current durable agent instructions for statements assigning feature-memory creation to the Orchestrator.
2. Update role descriptions to introduce or clarify the Architect role.
3. Update request intake guidance so every repository-changing request is routed to a separate `specs/<feature-id>/` folder before implementation.
4. Update Implementation Agent and Review Agent guidance only where needed to preserve handoff and compliance expectations.
5. Confirm the diff does not touch product code, workflow scripts, runtime files, or CI automation.

## Verification

| Acceptance criterion | Planned evidence |
| --- | --- |
| AC-001 | Text review shows the Orchestrator role says coordination/enforcement only and no direct repository edits. |
| AC-002 | Text review shows new request guidance requires a separate `specs/<feature-id>/` folder before implementation. |
| AC-003 | Text review shows the Architect role owns creation or update of `spec.md`, `plan.md`, and `tasks.md`. |
| AC-004 | Text review shows Implementation Agent guidance starts from assigned feature memory. |
| AC-005 | Text review shows Review Agent guidance can verify role-boundary and feature-memory compliance. |
| AC-006 | `git diff --name-only` for the implementation PR contains only process documentation and `specs/002-orchestrator-role-boundary/` files. |

Negative scenario evidence:

- Search output confirms no remaining durable instruction says the Orchestrator creates or updates feature memory.
- Search output confirms missing feature memory is treated as a blocker before implementation.

## Risks

- Risk: multiple durable docs may repeat the old role model.
- Mitigation: search for `Orchestrator`, `feature memory`, `feature-memory`, `spec.md`, `plan.md`, and `tasks.md` before finalizing the documentation update.

- Risk: "every request" could be interpreted too broadly for read-only questions.
- Mitigation: document the assumption that the rule applies to repository-changing requests; read-only discussion can remain outside implementation flow unless it becomes a change request.
