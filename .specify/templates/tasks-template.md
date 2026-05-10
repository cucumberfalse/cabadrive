# Tasks: <FEATURE_NAME>

## Setup

- [ ] T001 Confirm active feature folder, assigned isolated worktree, branch, and PR slice.
- [ ] T002 Read `feature-request.md`, `spec.md`, and `plan.md` before editing.
- [ ] T003 Record baseline checks before editing, including `git status --short --branch` and latest-main base evidence when assigned.
- [ ] T004 Confirm Orchestrator provided any parallel-work warning and preserve existing dirty diffs, branches, commits, PRs, and process memory.

## Implementation

- [ ] T005 `[Task]`
- [ ] T006 Record any scope tension, proposed executable enforcement, or missing architecture decision as Implementation Agent feedback instead of implementing it directly.

## Verification

- [ ] T007 Run local preflight.
- [ ] T008 Record verification evidence and update docs/tasks status.
- [ ] T009 Confirm changed files are limited to assigned scope.
- [ ] T010 Confirm every Implementation Agent feedback item has Architect disposition before completion.
- [ ] T011 Update cycle PR set with this slice's purpose, branch, PR metadata, head SHA, status, and final-validation inclusion.
- [ ] T012 Record final Architect validation evidence, return count, and gap dispositions when Orchestrator invokes it.
- [ ] T013 Record final Analyst validation evidence, Analyst return count, and Architect disposition for any Analyst feedback when Orchestrator invokes it.
- [ ] T014 If any commit lands after final Architect or Analyst validation, record the effective content head and confirm whether the later commit is final-validation evidence-only or makes prior validation stale.
- [ ] T015 Confirm merge-readiness gates remain satisfied after final validation on the current PR head: required checks, blocking review status, conflicts, acceptance evidence, process memory, feedback disposition, current-PR-head read-only guard, final guards, and human merge-owner rules.

## Process Memory

### Dead Ends

- `[Tried path that was rejected, plus why]`

### Decisions

- `[Decision made, plus the current reason]`

### Known Issues

- `[Accepted limitation, follow-up, or risk]`

### Verification Evidence

- `[Command/check and result]`
- `[Manual scope review and acceptance-criteria evidence]`

### Cycle PR Set

- `[Purpose, branch, PR metadata or number, head SHA, status, and whether included in final validation.]`

### Final Validation Evidence

- Architect validation: `[not yet invoked, pass details, or gap details]`
- Architect return count: `[0-10]`
- Analyst validation: `[not yet invoked, pass details, or Analyst-owned validation-note reference]`
- Analyst return count: `[0-5]`
- Effective content head: `[SHA validated by Architect and Analyst, or not yet validated]`
- Final-validation evidence-only commit: `[none, current-head SHA and evidence-only scope, or stale because non-evidence content changed]`
- Current-PR-head read-only guard: `[pending, pass with current head and gate evidence, or failed and routed back through role-appropriate follow-up/final validation]`
- Analyst feedback Architect disposition: `[none, accepted task/ticket, explicit dispose, or pending blocker]`
- Limit escalation: `[none, Architect breach -> Orchestrator asks Analyst for new feature request, or Analyst creates new feature request in separate latest-main branch/worktree]`

## Implementation Agent Feedback

- `[Divergence request, improvement, unknown, or blocker for Architect disposition. Use "None" if empty.]`

## Architect Dispositions

- `[For each feedback item, record task/ticket created or explicit not-needed decision. Use "None" when there is no Implementation Agent feedback.]`
