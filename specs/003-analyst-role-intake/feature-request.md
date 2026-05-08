# Feature Request: Analyst Role Intake

## Analyst Artifact Status

This document is the Analyst-style intake artifact for introducing the future Analyst role. The repository does not yet define an Analyst role, so this artifact was prepared by the Architect as a seed artifact for the same workflow that the feature will document.

## User Request

The user asked in Russian to add a new `Analyst` role to Cabadrive's agent workflow.

Requested behavior:

- Analyst accepts a feature request and creates a new directory in `specs/` using the next sequential feature number plus one.
- Analyst runs a Q&A loop to clarify requirements.
- Analyst searches the internet to understand how other products/projects solve similar intake, discovery, and requirement-writing problems.
- Analyst combines existing project context, user answers, and internet research into one detailed `feature request` document for the Architect.
- Analyst then invokes or hands off to the Orchestrator and shuts down.
- Orchestrator controls development through production by invoking Architect, Implementation Agent, and Review Agent.
- Architect does not write code. Architect writes the technical solution and task decomposition, including detailed implementation, review, and test requirements.
- Orchestrator may not change repository files directly. Orchestrator coordinates only.
- Review bot may not change code. It writes GitHub comments and opens/closes inline threads. Code review findings must be GitHub inline review threads.
- Implementation Agent changes code and tests strictly according to the spec/task. If it needs to diverge or finds an improvement, it records feedback for Architect in the markdown files it works with.
- Orchestrator must track Implementation Agent feedback and invoke Architect to analyze it. Each item becomes either a ticket/task or an explicit decision that it is not needed.

## Clarified Assumptions

- This is a repository process feature, not a product feature for Cabadrive learners.
- The first implementation should update durable instructions, templates, and PR guidance only.
- The feature should not add executable automation, CI workflows, runtime code, product UI, tests for app behavior, or branch-protection changes.
- `feature-request.md` becomes a durable intake artifact alongside `spec.md`, `plan.md`, and `tasks.md` for future features.
- The Analyst creates only the intake artifact and then exits. The Analyst does not write product code, technical plans, implementation tasks, reviews, commits, or PRs.
- "Next sequential number plus one" means the next highest numeric prefix under `specs/`, with repository-specific collision handling if multiple folders already share a prefix.
- The Orchestrator remains the coordinator and may ask other agents to update files, but must not directly edit files itself.
- Architect output begins after Analyst handoff and should include technical solution, task decomposition, review expectations, and test/verification requirements.
- Implementation Agent feedback should be recorded in the active feature memory, then triaged by Architect through Orchestrator coordination.

## Project Context

Cabadrive is a local-first web trainer for experienced Russian-speaking drivers preparing for the CABA theory exam. The repository uses a spec-driven PR workflow and durable memory in `docs_project/`, `.specify/`, `specs/`, and `docs/specify/`.

Current role model:

- `AGENTS.md` defines Architect, Orchestrator, Implementation Agent, and Review Agent.
- Architect currently creates or updates one `specs/<feature-id>/` folder for each repository-changing request before implementation.
- Orchestrator coordinates assigned agents and enforces workflow, but does not directly edit files.
- Implementation Agent starts from complete assigned feature memory.
- Review Agent checks PR diffs for bugs, regressions, missing tests, and contract violations.

Current templates:

- `.specify/templates/spec-template.md`
- `.specify/templates/plan-template.md`
- `.specify/templates/tasks-template.md`
- `.specify/templates/checklist-template.md`

Current durable workflow docs:

- `specs/README.md`
- `.specify/memory/constitution.md`
- `docs_project/project/devops/ai-pr-workflow.md`
- `docs_project/project/devops/review-contract.md`
- `.github/pull_request_template.md`

## Researched Practices

- [GOV.UK Service Manual, discovery phase](https://www.gov.uk/service-manual/agile-delivery/how-the-discovery-phase-works): Discovery should happen before building. It should clarify users, context, constraints, problem framing, value, what is out of scope, and should not start building during discovery.
- [GitLab Product Development Flow](https://handbook.gitlab.com/handbook/product-development/how-we-work/product-development-flow/): GitLab separates validation work from build work when the customer problem is unclear, and treats issue descriptions as the single source of truth so contributors do not need to reconstruct current state from comments.
- [Atlassian PRD guidance](https://www.atlassian.com/agile/product-management/requirements): PRDs benefit from a consistent structure with goals, background, assumptions, user stories, success metrics, open questions, and explicit out-of-scope items.
- [GitHub issue templates/forms documentation](https://docs.github.com/en/enterprise-cloud@latest/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository): Structured forms encourage contributors to include specific information.
- [Scrum Guide 2020](https://scrumguides.org/docs/scrumguide/v2020/2020-Scrum-Guide-US.pdf): Product Backlog items should be transparent, visible, and understood; refinement adds details such as description, order, and size; scope may be clarified as more is learned.

## Proposed Workflow

1. User submits a repository-changing request.
2. Analyst determines whether the request needs repository changes. Read-only questions do not require feature memory.
3. Analyst creates `specs/<next-number>-<short-slug>/`.
4. Analyst writes `feature-request.md` in that folder.
5. Analyst asks targeted clarification questions until the request is clear enough for architecture work or until remaining unknowns can be explicitly recorded.
6. Analyst reads relevant Cabadrive durable context and active project docs.
7. Analyst performs internet research when the request would benefit from current or external practice context.
8. Analyst consolidates the original request, answers, project context, external research, assumptions, risks, open questions, and acceptance expectations into `feature-request.md`.
9. Analyst hands off to Orchestrator and shuts down.
10. Orchestrator invokes Architect to create or update `spec.md`, `plan.md`, and `tasks.md`.
11. Orchestrator assigns Implementation Agent work only after complete feature memory exists.
12. Implementation Agent changes repository files according to the active feature memory and records feedback in the markdown files it works with.
13. Orchestrator tracks Implementation Agent feedback and invokes Architect for disposition.
14. Architect turns each feedback item into either an implementation/review/test task or an explicit decision that it is not needed.
15. Review Agent reviews the PR. Code review findings must be GitHub inline review threads. Review Agent may not change code.
16. Orchestrator coordinates until required checks, review findings, merge conflicts, evidence, and process memory satisfy the completion contract.

## Role Boundaries

Analyst:

- Owns intake, clarification, external research, and `feature-request.md`.
- Creates the feature folder and the intake artifact.
- Does not create technical solution details beyond requirement context.
- Does not edit product code, tests, workflow files, specs beyond its assigned intake artifact, or PR state.
- Hands off and exits after Orchestrator is invoked.

Architect:

- Starts from `feature-request.md`.
- Writes or updates `spec.md`, `plan.md`, and `tasks.md`.
- Defines technical solution direction, scope boundaries, task decomposition, review requirements, and verification requirements.
- Does not write product code or tests.

Orchestrator:

- Coordinates workflow from intake through production.
- Invokes Analyst, Architect, Implementation Agent, and Review Agent as needed.
- Tracks feedback and gates.
- Must not directly edit repository files.

Implementation Agent:

- Implements according to assigned feature memory.
- Updates tasks and process memory in the assigned feature folder.
- Records divergence requests, improvements, unknowns, and blockers as feedback for Architect.
- Does not broaden scope without Architect disposition.

Review Agent:

- Reviews PR diffs and feature-memory compliance.
- Does not change code.
- Writes review output in the configured GitHub backend.
- Code review findings must be inline review threads.

## Artifact Contract

Future Analyst-created feature folders should contain:

```text
specs/<next-number>-<slug>/
  feature-request.md
```

After Architect work, repository-changing PRs should contain:

```text
specs/<next-number>-<slug>/
  feature-request.md
  spec.md
  plan.md
  tasks.md
```

`feature-request.md` should include at least:

- original user request
- clarified answers and assumptions
- project context reviewed
- external research with links when used
- problem statement
- proposed workflow or product outcome
- role boundaries or affected actors
- artifact and handoff expectations
- open questions and risks
- acceptance expectations for Architect to convert into criteria

## Open Questions And Risks

- The repository currently has multiple `002-*` feature folders. The implementation should define how Analyst chooses the next number when duplicate previous prefixes exist. Recommended default: use max numeric prefix plus one, so this feature uses `003`.
- It is not yet clear whether every future feature must include `feature-request.md`, or only features that went through Analyst. Recommended default: repository-changing requests should include it once the Analyst role exists.
- Internet research can be inappropriate for private, confidential, or purely local implementation details. Analyst guidance should require source selection and privacy judgment.
- Creating a folder before clarification may reserve feature numbers for requests that are later rejected or split. The workflow should say whether such folders remain as abandoned records or are renamed/split by Architect.
- Review backend behavior currently permits top-level no-finding summaries for Codex. The requested change is specifically that code review findings must be inline threads; implementation should avoid accidentally banning no-finding summaries unless the feature spec requires it.
- Updating process docs without executable enforcement leaves compliance dependent on review and orchestration discipline. That is acceptable for this feature unless the user later requests automation.

## Acceptance Expectations

- Durable role guidance defines Analyst and its handoff to Orchestrator.
- Feature-memory guidance includes `feature-request.md` as the Analyst intake artifact.
- Templates include a feature-request template or otherwise make the artifact reproducible.
- Architect, Orchestrator, Implementation Agent, and Review Agent boundaries are updated consistently.
- Implementation Agent feedback and Architect dispositions are represented in `tasks.md` or another durable process-memory location.
- Review guidance states that code review findings are GitHub inline review threads and that Review Agent does not change code.
- The implementation PR changes only process documentation/templates and this feature memory.
- Verification includes text-search evidence proving the new role and boundaries are present and old conflicting guidance is absent.
