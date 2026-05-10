# Spec: <FEATURE_NAME>

## Analyst Intake

- Source request: `feature-request.md`
- Intake assumptions or open questions carried into this spec: `[list or "none"]`
- Orchestrator routing context: `[Orchestrator-first entry, latest-main Analyst handoff branch/worktree, base evidence, and clarification relay summary.]`
- Active-model stop condition: `[How non-Orchestrator direct implementation was avoided, or recovery status if an accidental start occurred.]`
- Read-only transition: `[Whether the request was read-only before becoming repository-changing, and what triggered routing.]`
- Parallel-work constraints: `[Known isolated worktree/branch/PR expectations and preservation warnings.]`
- Startup base evidence: `[Latest verified main evidence, normally origin/main after fetch, or documented fallback/blocker.]`
- Cleanup applicability: `[Not applicable, or cleanup scope/candidates/approved roots/refusal expectations.]`

## Cycle Definition

- Work cycle: `[One repository-changing user request represented by this feature folder, from latest-main startup through PR slices, final validation, completion, or escalation.]`
- Cycle PR set expectations: `[How each PR slice will record purpose, branch, PR metadata, head SHA, status, and final-validation inclusion.]`
- Latest-main startup rule: `[How new work and additional task slices verify latest main, normally origin/main after fetch, handle fetch/base verification fallback or blocker state, and create fresh isolated worktrees/branches/PRs; note whether the Analyst handoff branch may be the single PR slice.]`

## Goal

`[One-sentence outcome this change must produce.]`

## Scope

In scope:

- `[Path, behavior, or workflow included in this change]`

Out of scope:

- `[Path, behavior, or workflow intentionally not changed]`
- `[Cleanup targets, roots, user-owned paths, active work, or automation intentionally not changed.]`

## User Stories

### User Story 1

As a `[user]`, I want `[capability]`, so that `[value]`.

## Acceptance Criteria

1. Given `[context]`, when `[action]`, then `[result]`.
2. Given cleanup is applicable, when a target is current, active, dirty, untracked, unpushed, open-PR, locked, running-process, ambiguous, user-owned, or outside approved roots, then cleanup is refused and evidence records preservation.

## Negative Scenarios

1. Given `[invalid or risky context]`, when `[action]`, then `[safe result or explicit rejection]`.
2. Given a cleanup candidate is identified only by name pattern, timestamp, or memory, when deletion is considered, then the Cleanup Agent preserves it unless positive-proof validation succeeds.

## Requirements

- FR-001: `[Functional requirement]`
- FR-XXX: `If this is repository-changing process work, preserve Orchestrator-first routing, non-Orchestrator active-model stop conditions, read-only transition rules, Analyst-through-Orchestrator clarification, role boundaries, accidental-start recovery, and sibling-work preservation.`
- FR-XXX: `If this work has PR slices, require cycle PR-set tracking and final Architect validation before final Analyst validation, completion, or authorized merge mechanics.`
- FR-XXX: `If Analyst final validation finds gaps, require Analyst-owned validation notes and Architect accept/task/ticket/dispose disposition before follow-up development.`
- FR-XXX: `Record Architect return limit 10 and Analyst return limit 5 per work cycle, plus new-feature-request escalation when limits are exceeded.`
- FR-XXX: `If cleanup is in scope, define approved cleanup roots, Cleanup Agent boundaries, positive-proof validation, refusal conditions, evidence requirements, and Orchestrator handoff behavior.`

## Success Criteria

- SC-001: `[Measurable outcome]`
- SC-XXX: `Latest-main startup evidence and cleanup evidence/refusal outcomes are recorded when relevant.`

## Assumptions

- `[Assumption]`

## Review And Verification Requirements

- Implementation requirements: `[Constraints the Implementation Agent must follow, including complete feature memory and Orchestrator-assigned isolated worktree/branch/PR slice before edits.]`
- Review requirements: `[What Review Agent must verify, including Orchestrator-first bypass checks, missing feature memory, role self-promotion, unsafe recovery, sibling-work mutation, latest-main startup, cycle PR-set coverage, final-validation compliance, return-limit handling, Analyst-feedback Architect disposition, cleanup safety/evidence when relevant, and workflow compliance.]`
- Test/verification requirements: `[Commands, checks, screenshots, text searches, cleanup inventory, refusal evidence, or post-cleanup confirmations expected before completion.]`
- Handoff and blocker requirements: `[How post-Analyst assumptions, Implementation Agent feedback, Architect dispositions, blocker exceptions, and merge-owner rules are handled.]`
- Final validation requirements: `[Architect validates all PR slices, Architect-assigned tasks/dispositions, architectural guidance, open task state, process memory, and customer intent in spirit. Analyst validates customer intent in spirit and letter after Architect passes. Existing merge-readiness gates remain intact.]`
