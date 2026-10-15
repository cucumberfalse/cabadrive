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
- [ ] Assign one Orchestrator owner for PR/check monitoring; use agent completion events or bounded waits with a deadline and backoff, and record only meaningful state changes. Recheck all exact-head gates immediately before merge.
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

Record other factual final process evidence here. Strict short-route Architect
bullets belong under the existing `Final Architect Validation Notes` heading
below, and Analyst bullets belong in `feature-request.md`. After both roles
pass, a structured guard line may record the already-checked parent head, exact
effective-content SHA, UTC time, and Git diff SHA-256 proof here; one structured,
timestamped cycle PR result may be appended under `Cycle PR Set`. Substantive
dispositions, task changes, and narrative evidence belong before the freeze and
require full CI if added later. Orchestrator records the read-only current-head
guard after the evidence commit without manufacturing a self-referential SHA,
then independently reruns it on the final head before merge.

### Cleanup Evidence

- `[Not applicable, or inventory/validation/action/refusal/post-cleanup evidence for assigned cleanup scope.]`

## Implementation Agent Feedback

- `[Divergence request, improvement, unknown, or blocker for Architect disposition. Use "None" if empty.]`

## Architect Dispositions

- `[For each feedback item, record task/ticket created or explicit not-needed decision. Use "None" when there is no Implementation Agent feedback.]`

## Final Architect Validation Notes

Keep this heading in the file before freezing the effective content head. After
a passing validation, append the exact effective-content SHA, pass, UTC ISO
completion time, validated effective-content SHA, and return count as new bullet
lines in the strict format documented in
`docs_project/project/devops/ai-pr-workflow.md`. The completion-time bullet ends
at canonical `Z` without a terminal period. Record substantive gaps before
the freeze; post-freeze changes to them require full CI and renewed validation.
