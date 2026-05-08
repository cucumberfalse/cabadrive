# Spec: Analyst Role Intake

## Goal

Introduce an `Analyst` role into Cabadrive's agent workflow so repository-changing requests can be clarified, researched, and captured as a durable `feature-request.md` intake artifact before Architect planning begins.

## Scope

In scope:

- Define the Analyst role in durable agent/workflow guidance.
- Add `feature-request.md` to the feature-memory artifact contract.
- Document the Analyst intake sequence: create next numbered `specs/` folder, clarify with Q&A, research relevant external practices, synthesize the request, hand off to Orchestrator, and shut down.
- Clarify that Orchestrator controls the process after Analyst handoff by invoking Architect, Implementation Agent, and Review Agent, while never directly editing repository files.
- Clarify that Architect writes technical solution, task decomposition, review requirements, and test/verification requirements, but does not write code.
- Clarify that Implementation Agent changes code/tests only according to the active feature memory and records divergence feedback for Architect.
- Clarify that Orchestrator tracks Implementation Agent feedback and invokes Architect for disposition.
- Clarify that Review Agent does not change code and that code review findings must be GitHub inline review threads.
- Update relevant durable docs/templates so future agents can reproduce the workflow.

Out of scope:

- Product code changes.
- Runtime scaffold, Docker behavior, app UI, app tests, content pipeline, or data model changes.
- CI workflow, branch-protection, GitHub Actions, or automation script changes.
- Automated Analyst tooling or executable enforcement.
- Production resource or secret changes.
- Opening, merging, or pushing PRs as part of this Architect feature-memory creation.

## User Stories

### User Story 1

As a project owner, I want an Analyst to clarify and research incoming feature requests before architecture starts, so that implementation work is based on a durable, well-understood request instead of session-only context.

### User Story 2

As an Architect, I want a consistent `feature-request.md` intake artifact, so that I can convert user intent, assumptions, research, risks, and open questions into a technical spec, plan, and task decomposition.

### User Story 3

As an Orchestrator, I want Analyst handoff and feedback-tracking rules to be explicit, so that I can coordinate Analyst, Architect, Implementation Agent, and Review Agent without directly editing files.

### User Story 4

As a Review Agent, I want role boundaries and inline finding expectations documented, so that review can verify both the diff and the workflow contract.

## Acceptance Criteria

1. Given durable agent instructions, when an agent reads the role list, then `Analyst` is defined as the owner of intake, clarification, external research, `feature-request.md`, handoff to Orchestrator, and shutdown.
2. Given feature-memory guidance, when a repository-changing request is initiated through Analyst, then the guidance requires a new `specs/<next-number>-<slug>/feature-request.md` artifact before Architect planning.
3. Given numbering guidance, when Analyst creates a feature folder, then the documented rule describes selecting the next sequential numeric prefix from existing `specs/` directories and handling collisions or splits.
4. Given Architect guidance, when Architect starts work after Analyst handoff, then the guidance states that Architect writes technical solution and task decomposition with implementation, review, and test/verification requirements, but does not write code.
5. Given Orchestrator guidance, when Analyst handoff is complete, then Orchestrator is responsible for coordinating development through production by invoking Architect, Implementation Agent, and Review Agent, while not directly editing repository files.
6. Given Implementation Agent guidance, when the agent needs to diverge from the active spec/task or identifies an improvement, then it records feedback in the assigned markdown process memory for Architect disposition.
7. Given Orchestrator guidance, when Implementation Agent feedback exists, then Orchestrator tracks it and invokes Architect so each item becomes either a ticket/task or an explicit not-needed decision.
8. Given Review Agent guidance, when code review findings are produced, then findings are required to be GitHub inline review threads and the Review Agent is forbidden from changing code.
9. Given repository templates, when a future feature is created, then templates or instructions make the `feature-request.md` artifact reproducible with sections for request, assumptions, project context, research, workflow, boundaries, risks, and acceptance expectations.
10. Given this process feature implementation, when the final diff is inspected, then no product code, runtime files, CI workflows, automation scripts, secrets, or production resources are modified.

## Negative Scenarios

1. Given a vague repository-changing request, when Analyst cannot clarify all details, then Analyst records explicit assumptions and open questions in `feature-request.md` instead of inventing hidden requirements.
2. Given an Analyst receives a request that contains multiple independent goals, when creating intake memory, then the workflow requires splitting or recording a split decision rather than bundling unrelated work into one vague artifact.
3. Given an Implementation Agent finds an improvement outside the active spec, when it wants to implement the improvement, then it must record feedback and wait for Architect disposition instead of broadening scope directly.
4. Given a Review Agent finds code issues, when it reports blocking findings, then it must use GitHub inline review threads and must not patch files itself.
5. Given this feature is implemented, when changed files are reviewed, then changes outside process docs/templates and `specs/003-analyst-role-intake/` are considered out of scope unless the Implementation Agent records an Architect-approved reason.

## Requirements

- FR-001: Durable agent instructions must add an Analyst role with responsibilities for request intake, Q&A clarification, external research, feature folder creation, `feature-request.md`, handoff to Orchestrator, and shutdown.
- FR-002: Durable workflow guidance must define `feature-request.md` as the Analyst intake artifact and explain how it relates to `spec.md`, `plan.md`, and `tasks.md`.
- FR-003: The workflow must document how Analyst chooses the next sequential numeric prefix for `specs/<feature-id>/`.
- FR-004: The workflow must require Analyst to combine user request, clarified answers, Cabadrive project context, and external research into one detailed feature request artifact.
- FR-005: The workflow must state that Orchestrator controls development through production by invoking Architect, Implementation Agent, and Review Agent.
- FR-006: The workflow must preserve the Orchestrator no-direct-file-edits boundary.
- FR-007: Architect guidance must state that Architect writes the technical solution and task decomposition, including implementation, review, and test/verification requirements, and does not write code.
- FR-008: Implementation Agent guidance must state that implementation follows the active spec/task and that divergence or improvement feedback is recorded in markdown process memory for Architect review.
- FR-009: Orchestrator guidance must state that Implementation Agent feedback is tracked and routed to Architect, and each item receives either a task/ticket or a not-needed decision.
- FR-010: Review Agent guidance must state that Review Agent does not change code and code review findings must be GitHub inline review threads.
- FR-011: Templates or template guidance must be updated so future Analyst artifacts are consistent.
- FR-012: Implementation must avoid product code, runtime, CI workflow, automation script, secret, and production resource changes.

## Success Criteria

- SC-001: Text search finds `Analyst` role guidance in durable agent documentation.
- SC-002: Text search finds `feature-request.md` guidance in feature-memory documentation or templates.
- SC-003: Text search finds feedback-disposition guidance linking Implementation Agent feedback, Orchestrator tracking, and Architect decisions.
- SC-004: Text search finds Review Agent guidance requiring GitHub inline review threads for code review findings.
- SC-005: The implementation PR diff is limited to process docs/templates and `specs/003-analyst-role-intake/`.
- SC-006: Local text checks and preflight evidence are recorded in `tasks.md`.

## Assumptions

- This feature changes process documentation only.
- Internet research is part of Analyst intake when useful and safe, not a requirement for read-only local questions.
- "Production" in the Orchestrator responsibility means the full PR-to-merge readiness path, not direct deployment or direct production changes.
- A no-finding review summary can remain allowed where the review backend supports it; the explicit inline-thread requirement applies to code review findings.
- The Implementation Agent may adjust the exact implementation file list after searching the repository, but must stay within process documentation/template scope.

## Rationale

- GOV.UK discovery guidance supports separating problem understanding from building and explicitly defining constraints and out-of-scope work before delivery.
- GitLab's product development flow supports a validation track before build work and keeping the work item description as the single source of truth.
- Atlassian PRD guidance supports consistent requirements artifacts with goals, background, assumptions, user stories, open questions, and out-of-scope items.
- GitHub issue forms support structured intake that encourages contributors to provide specific information.
- The Scrum Guide supports transparent, understood backlog items and clarifying scope as more is learned.
