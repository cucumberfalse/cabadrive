# Review Contract

Reviewers check the pull request against the active feature spec, not only
against the implementation diff. Acceptance criteria, negative scenarios, and
known issues are the source of truth for expected behavior.

Review Agent must not change code, docs, tests, specs, templates, workflow
files, or scripts while acting as reviewer. It reports code review findings as
GitHub inline review threads so each finding is anchored to the changed line.
Backend-specific no-finding summary behavior remains allowed where documented
below.

## Role And Process Review

Reviewers check role boundaries in addition to code behavior:

- Repository-changing work must enter through Orchestrator by default, and
  Orchestrator must invoke Analyst first when no current `feature-request.md`
  exists.
- Read-only work may proceed without feature memory only while it remains
  non-mutating. Reviewers should flag repository mutations that began from a
  read-only interaction without an Orchestrator-first stop and handoff.
- A non-Orchestrator active model must not directly implement a new
  repository-changing request or self-promote into another role. Reviewers
  should flag any bypass even when the resulting diff is otherwise correct.
- New repository-changing work and each new task slice must have latest
  `origin/main` startup/base evidence and a fresh isolated worktree/branch,
  except when Orchestrator explicitly assigns the Analyst-created latest-main
  handoff branch as the single implementation PR slice.
- Orchestrator must not directly edit repository files. File changes must come
  from the role-appropriate subagent.
- Analyst requirement clarification must be relayed through Orchestrator.
  Analyst is the only normal-flow role that may initiate user requirement
  clarification; after Analyst handoff, later roles use recorded assumptions,
  Implementation Agent feedback, or documented blocker exceptions.
- Agents must not switch roles mid-task. Work outside the current role must be
  rerouted by Orchestrator.
- Accidental direct-edit recovery must be visible in process memory when it
  occurs: stop/report/preserve/restart through Orchestrator or user
  disposition, with no hidden continuation, silent role switching, destructive
  cleanup, or unauthorized revert of user/sibling work.
- One task slice must map to one isolated worktree, one branch, and one PR.
- Orchestrator assignment should warn subagents that parallel agents may be
  active and require preservation of existing dirty diffs, branches, commits,
  PRs, and process memory.
- Sibling worktrees, branches, dirty diffs, commits, PR state, feature folders,
  and process memory must not be mutated without explicit Orchestrator
  coordination.
- When a feature has multiple contributing slices, reviewers should verify that
  the cycle PR set records each PR slice's purpose, branch, PR metadata, head
  SHA, status, and inclusion in final validation.
- Implementation PRs must stay inside the assigned feature memory and must not
  mix unrelated changes.
- Implementation must not start without complete feature memory:
  `feature-request.md`, `spec.md`, `plan.md`, and `tasks.md`, except documented
  legacy/no-intake exceptions.
- Blocking Implementation Agent feedback must be either resolved in scope or
  have Architect disposition before completion.
- Process changes must not contradict the existing `011` Orchestrator-Analyst
  routing baseline or sibling `012` final-validation-loop guidance when that
  guidance is present or in flight.
- Initial Review Agent review may proceed before final Architect or Analyst
  validation evidence exists. Reviewers may still review whether the PR text,
  docs, specs, and templates require the planned final-validation steps at the
  right phase.
- Final Architect validation must occur before final Analyst validation,
  completion, or Orchestrator finalization/merge, after implementation, review,
  checks, and follow-up development appear complete. Reviewers should check
  that Architect validation covers all PR slices, Architect-assigned tasks and
  dispositions, architectural guidance, open task state, process memory, and
  customer intent in spirit.
- Final Analyst validation must occur after Architect passes and before final
  completion or Orchestrator finalization/merge. It must check the customer's desired
  outcome in spirit and letter. Analyst gap notes must be Analyst-owned, return
  counts must stay within the limit of 5, and Analyst feedback must receive
  Architect accept/task/ticket/dispose disposition before follow-up development.
- Architect gap returns must stay within the limit of 10 per work cycle. If the
  limit is exceeded, reviewers should expect a recorded Architect breach and
  Orchestrator request for Analyst to create a new feature request; if the
  Analyst limit is exceeded, reviewers should expect a new feature request in a
  separate latest-main branch/worktree.
- When final Architect and Analyst validation target an effective content head,
  any later commit may be treated as valid only if it is final-validation
  evidence-only process memory and Orchestrator's read-only current-PR-head
  guard proves no non-evidence content changed. Non-evidence changes after role
  validation make prior validation stale and must be routed back through
  role-appropriate follow-up or final validation before completion or merge.

Reviewers should block merge when the PR text, docs, specs, or implementation
permit unsafe completion. Blocking conditions include red, missing, queued, or
running required checks; unresolved `P0`, `P1`, or `P2` review findings;
unresolved conflicts; stale process memory; missing acceptance evidence; missing
negative-scenario coverage; Orchestrator-first bypasses; missing feature
memory; role-boundary violations; unsafe accidental-start recovery; sibling-work
mutation; contradictions with required `011`/`012` process guidance; or
unresolved Implementation Agent feedback without Architect disposition. During
initial PR review, absence of final Architect or Analyst validation evidence is
not itself blocking because the final-validation loop is invoked only after
implementation, review, checks, and follow-up development appear complete.
During Orchestrator's final completion or finalization/merge-readiness evaluation, missing
final-validation evidence, incomplete cycle PR set coverage, Analyst feedback
without Architect disposition, or exhausted return limits without
new-feature-request escalation are blocking process findings. So are missing
current-PR-head guard evidence after a post-validation evidence commit, or any
non-evidence post-validation change that still relies on prior Architect or
Analyst validation.

Review findings that require code, docs, tests, content, specs, metadata, or
process-memory edits are routed by Orchestrator to the proper role. Source
currentness or archive-evidence findings block merge until fixed by the
appropriate role or explicitly disposed by Architect when the spec allows it.
After a fix, Orchestrator verifies whether each blocking thread is resolved,
outdated, or still blocking before merge.

No-finding summaries satisfy the review gate only for the current PR head and do
not replace required checks, merge-conflict checks, feature-memory evidence,
local guard evidence, Orchestrator-first routing evidence, Analyst
clarification-relay evidence, latest-main startup evidence, parallel-work
isolation evidence, cycle PR-set evidence, final Architect validation, final
Analyst validation, effective content head evidence, current-PR-head guard
evidence, return-limit state, or manual review of the SENAR done gate.
For Orchestrator-managed PRs, routine human final approval is not a terminal
blocker after objective gates pass. Reviewers should instead block unsafe
finalization when the PR permits merge without current-head verification, green
required checks from `.unicorn-hub/config.json`, resolved review threads,
resolved or outdated blocking findings, clean mergeability, final validation
evidence, current process memory, feedback disposition, and local guard
evidence. Human intervention remains a blocker only for exceptional cases:
missing credentials or permissions, explicit instruction not to merge,
ambiguous repository or PR state, pending owner decision for an accepted known
issue, or protected-branch/ruleset policy blockers.

## Codex

Native GitHub PR review. Blocking findings use `P0`, `P1`, or `P2`. Advisory findings use `P3`. Code review findings must be GitHub inline review threads.

When Codex has no inline findings, a top-level `Codex Review:` summary comment from the trusted Codex bot also satisfies the gate, provided it either names the current head SHA in its body or was posted at or after the head commit timestamp (so stale summaries from prior heads cannot pass).

## Claude

Top-level comment must start with:

```text
AI_REVIEW_AGENT: claude
AI_REVIEW_SHA: <head-sha>
AI_REVIEW_OUTCOME: pass|advisory|block
```

Only `pass` satisfies the gate.

## Gemini

Native GitHub PR review from the configured app. Critical or high-severity findings block merge.
