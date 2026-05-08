# Spec: Orchestrator Role Boundary

## Goal

Clarify Cabadrive repository agent instructions so every user request starts as a separate feature under `specs/`, the Architect owns feature-memory creation, and the Orchestrator coordinates subagents and enforces workflow without directly editing repository files.

## Scope

In scope:

- Update durable repository agent instructions and rules that define agent roles and request intake flow.
- Make the Orchestrator boundary explicit: coordination, assignment, sequencing, and enforcement only.
- Make the Architect responsibility explicit: create or update feature memory before any implementation work.
- Require each user request to map to its own `specs/<feature-id>/` folder with `spec.md`, `plan.md`, and `tasks.md` before implementation.
- Preserve implementation and review responsibilities for their respective agents.

Out of scope:

- Product code changes.
- Workflow script changes.
- CI, branch-protection, or automation behavior changes.
- Runtime scaffold, Docker contract, or app feature implementation.

## User Stories

### User Story 1

As a project owner, I want every request captured as a separate feature memory folder before work starts, so that no implementation begins from ad hoc session context.

### User Story 2

As an Orchestrator, I want my role boundary to be explicit, so that I coordinate assigned agents and enforce repository process without directly editing docs, code, or workflow files.

### User Story 3

As an Architect, I want feature-memory ownership documented, so that I can create the spec, plan, and task checklist required before implementation agents begin work.

## Acceptance Criteria

1. Given repository agent instructions, when an agent reads the Orchestrator role, then the Orchestrator is described as a coordinator/enforcer that does not directly edit repository files.
2. Given a new user request, when repository workflow guidance is followed, then the request is represented by a separate `specs/<feature-id>/` folder before implementation starts.
3. Given feature-memory guidance, when an Architect role is used, then the Architect is explicitly responsible for creating or updating `spec.md`, `plan.md`, and `tasks.md`.
4. Given implementation guidance, when an Implementation Agent starts work, then it is instructed to work from assigned feature memory rather than creating the request-level memory itself.
5. Given review guidance, when a Review Agent checks a PR, then it can verify that role boundaries and feature-memory requirements were followed.
6. Given this process-rule feature, when the change is implemented, then no product code, workflow scripts, CI automation, or runtime files are modified.

## Negative Scenarios

1. Given an Orchestrator receives a user request, when no feature memory exists, then the Orchestrator must route the request to Architect work instead of directly editing files.
2. Given a request touches multiple independent goals, when feature memory is created, then the goals must be split into separate feature folders rather than bundled into one vague process record.
3. Given an Implementation Agent is assigned work, when `spec.md`, `plan.md`, or `tasks.md` is missing, then implementation must not begin.

## Requirements

- FR-001: Agent instructions must state that every user request becomes a separate feature under `specs/` before implementation.
- FR-002: Agent instructions must define an Architect role responsible for feature-memory creation and updates.
- FR-003: Agent instructions must define the Orchestrator as responsible for coordinating agents, enforcing flow, and keeping PR/process state aligned.
- FR-004: Agent instructions must state that the Orchestrator must not directly edit code, docs, specs, workflow files, or scripts.
- FR-005: Implementation Agent instructions must refer to assigned feature memory as input and keep `tasks.md` current during implementation.
- FR-006: Review Agent instructions must include checking role-boundary compliance for process-rule changes.
- FR-007: The feature implementation must avoid product-code and workflow-script changes.

## Success Criteria

- SC-001: The updated durable instructions remove or replace any statement that says the Orchestrator creates or updates feature memory.
- SC-002: The updated durable instructions identify Architect-owned feature memory as the required first step for every request.
- SC-003: The feature PR diff is limited to agent/process documentation and this feature memory.

## Assumptions

- "Every request" means every repository-changing request, including process-rule changes, documentation changes, product changes, and workflow changes.
- The Orchestrator may request or coordinate edits through assigned agents, but does not perform direct repository edits itself.
- This change is governance/process documentation only; executable enforcement can be considered in a later feature if needed.
