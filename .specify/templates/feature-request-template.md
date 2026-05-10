# Feature Request: <FEATURE_NAME>

## Analyst Artifact Status

`[State whether this was created by Analyst intake, migrated from a legacy request, or prepared as a seed artifact.]`

## Orchestrator Routing Context

- Orchestrator entry: `[Who routed this repository-changing request to Analyst, and when.]`
- Active-model stop condition: `[If the request first reached a non-Orchestrator active model, record that it stopped instead of implementing and routed to Orchestrator.]`
- Read-only transition context: `[If the interaction began read-only, record when it became repository-changing. Otherwise state "Not applicable."]`
- Assigned intake worktree/branch: `[Isolated worktree and branch used for Analyst intake.]`
- Parallel-work note: `[Known or assumed parallel Orchestrators/agents, plus preservation constraints.]`
- Accidental-start recovery context: `[If any direct edits, staging, commits, pushes, PR mutations, or other repository changes started before routing, record stop/report/preserve/disposition status. Otherwise state "None."]`

## User Request

`[Original user request, preserving relevant wording and constraints.]`

## Clarified Answers And Assumptions

- `[Question Analyst sent to Orchestrator, answer Orchestrator returned from the user, or explicit assumption if no answer was available.]`
- `If no clarification was requested, state why the intake was clear enough for Architect planning.`

## Project Context Reviewed

- `[Durable Cabadrive document, source file, or prior feature memory reviewed.]`

## External Research

- `[Source title](https://example.com): [Brief reason it matters.]`

If external research was not used, record why it was unnecessary or unsafe for this request.

## Problem Statement

`[The problem to solve, separated from the proposed solution.]`

## Proposed Outcome Or Workflow

1. `[Expected product, process, or documentation outcome.]`

## Role Boundaries Or Affected Actors

- `[Actor or role]: [Responsibility and boundary.]`

## Artifact And Handoff Expectations

- Analyst writes only this `feature-request.md` intake artifact.
- Non-Orchestrator active models do not create implementation changes for this request before Orchestrator routing.
- Requirement clarification, when needed, is initiated only by Analyst and relayed through Orchestrator.
- Analyst hands off to Orchestrator and shuts down after intake is ready.
- Architect starts from this artifact and writes `spec.md`, `plan.md`, and `tasks.md`.
- Implementation starts only after complete feature memory exists and Orchestrator assigns an isolated worktree, branch, and PR slice.
- Handoff context for Orchestrator: `[intake branch/worktree, feature folder, and any known parallel-work constraints.]`

## Open Questions And Risks

- `[Open question, ambiguity, risk, or split/collision note.]`

## Acceptance Expectations

- `[Expectation for Architect to convert into acceptance criteria.]`
