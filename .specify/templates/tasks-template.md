# Tasks: <FEATURE_NAME>

## Setup

- [ ] T001 Confirm active feature folder, assigned isolated worktree, branch, and PR slice.
- [ ] T002 Confirm complete feature memory exists: `feature-request.md`, `spec.md`, `plan.md`, and `tasks.md`, except documented legacy/no-intake exceptions.
- [ ] T003 Record latest-main startup evidence for this slice, normally `origin/main` after fetch, or the documented fallback/blocker.
- [ ] T004 Confirm the active model is operating under Orchestrator assignment and is not self-promoting from a new repository-changing user request.
- [ ] T005 Read `feature-request.md`, `spec.md`, and `plan.md` before editing.
- [ ] T006 If the request began read-only, record the transition point that made it repository-changing.
- [ ] T007 If any direct edits started before routing or prerequisites, record stop/report/preserve/recovery disposition before continuing.
- [ ] T008 Confirm Orchestrator provided any parallel-work warning and preserve existing dirty diffs, branches, commits, PRs, sibling feature folders, process memory, active worktrees, and ambiguous local paths.
- [ ] T009 Record baseline checks before editing, including `git status --short --branch`.

## Implementation

- [ ] T010 `[Task]`
- [ ] T011 Record any scope tension, proposed executable enforcement, cleanup uncertainty, PR/worktree overlap, missing architecture decision, or `011`/`012` coordination issue as Implementation Agent feedback instead of implementing it directly.

## Cleanup Or Handoff

- [ ] T012 If cleanup is not applicable, record why.
- [ ] T013 If cleanup is applicable, record approved cleanup roots, excluded active/current worktrees, dry-run inventory, validation results, action/refusal reason for each candidate, and post-cleanup confirmation for removed targets.
- [ ] T014 Preserve current, active, dirty, untracked, unpushed, open-PR, locked, running-process, ambiguous, user-owned, out-of-root, or process-memory-referenced targets.

## Verification

- [ ] T015 Run local preflight.
- [ ] T016 Record verification evidence and update docs/tasks status.
- [ ] T017 Confirm changed files are limited to assigned scope and exclude sibling feature folders/worktrees.
- [ ] T018 Confirm Review Agent enforcement evidence covers Orchestrator-first bypasses, missing feature memory, role-boundary violations, unsafe recovery, sibling-work preservation, latest-main startup, and cleanup evidence/refusal when relevant.
- [ ] T019 Confirm every Implementation Agent feedback item has Architect disposition before completion.
- [ ] T020 Update cycle PR set with this slice's purpose, branch, PR metadata, head SHA, status, and final-validation inclusion.
- [ ] T021 Record final Architect validation evidence, return count, and gap dispositions when Orchestrator invokes it.
- [ ] T022 Record final Analyst validation evidence, Analyst return count, and Architect disposition for any Analyst feedback when Orchestrator invokes it.
- [ ] T023 If any commit lands after final Architect or Analyst validation, record `Effective content head: <40-hex-sha>`, `Architect validated effective content head: <40-hex-sha>`, and `Analyst validated effective content head: <40-hex-sha>` for the same SHA, then confirm whether the later commit is final-validation evidence-only or makes prior validation stale.
- [ ] T024 Confirm merge-readiness gates remain satisfied after final validation on the current PR head: required checks, blocking review status, conflicts, acceptance evidence, process memory, feedback disposition, current-PR-head read-only guard, final guards, cleanup evidence/refusal when relevant, branch-protection readiness, and absence of exceptional human blockers.

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
- Architect validated effective content head: `[same 40-hex SHA, or not yet validated]`
- Analyst validated effective content head: `[same 40-hex SHA, or not yet validated]`
- Final-validation evidence-only commit: `[none, current-head SHA and evidence-only scope, or stale because non-evidence content changed]`
- Current-PR-head read-only guard: `[pending, pass with current head and gate evidence, or failed and routed back through role-appropriate follow-up/final validation]`
- Analyst feedback Architect disposition: `[none, accepted task/ticket, explicit dispose, or pending blocker]`
- Limit escalation: `[none, Architect breach -> Orchestrator asks Analyst for new feature request, or Analyst creates new feature request in separate latest-main branch/worktree]`

### Cleanup Evidence

- `[Not applicable, or inventory/validation/action/refusal/post-cleanup evidence for assigned cleanup scope.]`

## Implementation Agent Feedback

- `[Divergence request, improvement, unknown, or blocker for Architect disposition. Use "None" if empty.]`

## Architect Dispositions

- `[For each feedback item, record task/ticket created or explicit not-needed decision. Use "None" when there is no Implementation Agent feedback.]`
