# Feature Request: <FEATURE_NAME>

## Analyst Artifact Status

`[State whether this was created by Analyst intake, migrated from a legacy request, or prepared as a seed artifact.]`

## Orchestrator Routing Context

- Orchestrator entry: `[Who routed this repository-changing request to Analyst, and when.]`
- Assigned intake worktree/branch: `[Latest-main isolated worktree and branch used for Analyst intake.]`
- Latest-main base evidence: `[origin/main fetch/verification method, base ref or SHA, and date/time if available.]`
- Parallel-work note: `[Known or assumed parallel Orchestrators/agents, plus preservation constraints.]`

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
- Requirement clarification, when needed, is initiated only by Analyst and relayed through Orchestrator.
- Analyst hands off to Orchestrator and shuts down after intake is ready.
- Architect starts from this artifact and writes `spec.md`, `plan.md`, and `tasks.md`.
- Handoff context for Orchestrator: `[intake branch/worktree, feature folder, and any known parallel-work constraints.]`
- The Analyst-created latest-main handoff context may continue through Architect planning and may become the single implementation PR slice only if Orchestrator explicitly assigns it that way; additional task slices require separate latest-main isolated worktrees/branches/PRs.

## Open Questions And Risks

- `[Open question, ambiguity, risk, or split/collision note.]`

## Acceptance Expectations

- `[Expectation for Architect to convert into acceptance criteria.]`

## Final Analyst Validation Notes

Append-only Analyst-owned section used only when Orchestrator invokes final
Analyst validation after final Architect validation passes.

- Analyst validation pass: `[date/ref/head SHA or "not yet invoked"]`
- Analyst return count for this work cycle: `[0-5]`
- Customer intent check: `[Whether final result matches desired outcome in spirit and letter using original request, clarified answers, assumptions, and acceptance expectations.]`
- Gaps, if any: `[Analyst-owned note only; do not plan implementation here.]`
- Architect disposition routing: `[Orchestrator must route any Analyst feedback to Architect for accept/task/ticket/dispose before follow-up development.]`
- Analyst limit escalation: `[If another gap would exceed 5 returns, Analyst creates a new feature request in a separate latest-main branch/worktree and records the handoff.]`
