# Spec: <FEATURE_NAME>

## Analyst Intake

- Source request: `feature-request.md`
- Intake assumptions or open questions carried into this spec: `[list or "none"]`
- Orchestrator routing context: `[Orchestrator-first entry, latest-main Analyst handoff branch/worktree, base evidence, and clarification relay summary.]`
- Parallel-work constraints: `[Known isolated worktree/branch/PR expectations and preservation warnings.]`

## Cycle Definition

- Work cycle: `[One repository-changing user request represented by this feature folder, from latest-main startup through PR slices, final validation, completion, or escalation.]`
- Cycle PR set expectations: `[How each PR slice will record purpose, branch, PR metadata, head SHA, status, and final-validation inclusion.]`
- Latest-main startup rule: `[How new work and additional task slices verify latest origin/main and create fresh isolated worktrees/branches/PRs; note whether the Analyst handoff branch may be the single PR slice.]`

## Goal

`[One-sentence outcome this change must produce.]`

## Scope

In scope:

- `[Path, behavior, or workflow included in this change]`

Out of scope:

- `[Path, behavior, or workflow intentionally not changed]`

## User Stories

### User Story 1

As a `[user]`, I want `[capability]`, so that `[value]`.

## Acceptance Criteria

1. Given `[context]`, when `[action]`, then `[result]`.

## Negative Scenarios

1. Given `[invalid or risky context]`, when `[action]`, then `[safe result or explicit rejection]`.

## Requirements

- FR-001: `[Functional requirement]`
- FR-XXX: `If this is repository-changing process work, preserve Orchestrator-first routing, Analyst-through-Orchestrator clarification, and role boundaries.`
- FR-XXX: `If this work has PR slices, require cycle PR-set tracking and final Architect validation before final Analyst validation, completion, or authorized merge mechanics.`
- FR-XXX: `If Analyst final validation finds gaps, require Analyst-owned validation notes and Architect accept/task/ticket/dispose disposition before follow-up development.`
- FR-XXX: `Record Architect return limit 10 and Analyst return limit 5 per work cycle, plus new-feature-request escalation when limits are exceeded.`

## Success Criteria

- SC-001: `[Measurable outcome]`

## Assumptions

- `[Assumption]`

## Review And Verification Requirements

- Implementation requirements: `[Constraints the Implementation Agent must follow.]`
- Review requirements: `[What Review Agent must verify, including latest-main startup, cycle PR-set coverage, final-validation compliance, return-limit handling, Analyst-feedback Architect disposition, and workflow compliance when relevant.]`
- Test/verification requirements: `[Commands, checks, screenshots, or evidence expected before completion.]`
- Handoff and blocker requirements: `[How post-Analyst assumptions, Implementation Agent feedback, Architect dispositions, blocker exceptions, and merge-owner rules are handled.]`
- Final validation requirements: `[Architect validates all PR slices, Architect-assigned tasks/dispositions, architectural guidance, open task state, process memory, and customer intent in spirit. Analyst validates customer intent in spirit and letter after Architect passes. Existing merge-readiness gates remain intact.]`
