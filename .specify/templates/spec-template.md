# Spec: <FEATURE_NAME>

## Analyst Intake

- Source request: `feature-request.md`
- Intake assumptions or open questions carried into this spec: `[list or "none"]`
- Orchestrator routing context: `[Orchestrator-first entry, Analyst handoff branch/worktree, and clarification relay summary.]`
- Active-model stop condition: `[How non-Orchestrator direct implementation was avoided, or recovery status if an accidental start occurred.]`
- Read-only transition: `[Whether the request was read-only before becoming repository-changing, and what triggered routing.]`
- Parallel-work constraints: `[Known isolated worktree/branch/PR expectations and preservation warnings.]`

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
- FR-XXX: `If this is repository-changing process work, preserve Orchestrator-first routing, non-Orchestrator active-model stop conditions, read-only transition rules, Analyst-through-Orchestrator clarification, role boundaries, accidental-start recovery, and sibling-work preservation.`

## Success Criteria

- SC-001: `[Measurable outcome]`

## Assumptions

- `[Assumption]`

## Review And Verification Requirements

- Implementation requirements: `[Constraints the Implementation Agent must follow, including complete feature memory and Orchestrator-assigned isolated worktree/branch/PR slice before edits.]`
- Review requirements: `[What Review Agent must verify, including Orchestrator-first bypass checks, missing feature memory, role self-promotion, unsafe recovery, sibling-work mutation, and workflow compliance when relevant.]`
- Test/verification requirements: `[Commands, checks, screenshots, or evidence expected before completion.]`
- Handoff and blocker requirements: `[How post-Analyst assumptions, Implementation Agent feedback, Architect dispositions, blocker exceptions, and merge-owner rules are handled.]`
