## Summary

- [Add summary]

## SENAR Done Gate

- [ ] Repository-changing work entered through Orchestrator; Orchestrator invoked Analyst first when no current `feature-request.md` existed and did not directly edit repository files.
- [ ] No non-Orchestrator active model directly implemented, self-promoted, or skipped the Orchestrator-first stop condition for this repository-changing work.
- [ ] Read-only interactions, if any, stopped for Orchestrator routing before becoming repository-changing.
- [ ] Manual author/review check: Analyst intake artifact `feature-request.md` is present, or legacy/no-intake reason is recorded in `tasks.md`. This item is not currently enforced by `pnpm run preflight`, CI, or `scripts/check-feature-memory.mjs`.
- [ ] Complete implementation feature memory is present: `feature-request.md`, `spec.md`, `plan.md`, and `tasks.md`, except documented legacy/no-intake exceptions.
- [ ] Analyst clarification, if needed, was relayed through Orchestrator; otherwise intake records why no clarification was needed.
- [ ] Accidental direct-edit recovery, if any, is recorded with stop/report/preserve/restart disposition and no unauthorized destructive cleanup.
- [ ] Latest `origin/main` startup/base evidence is recorded for the work item and for this task slice, or the PR explicitly uses the Analyst-created latest-main handoff branch as the single implementation PR slice.
- [ ] Cycle PR set is current and records each contributing PR slice by purpose, branch, PR metadata, head SHA, status, and final-validation inclusion.
- [ ] Feature memory names the goal and scope.
- [ ] Every acceptance criterion has evidence in the PR, plan, or linked checks.
- [ ] At least one negative scenario is covered or explicitly waived.
- [ ] `tasks.md` records dead ends, decisions, known issues, and verification evidence.
- [ ] Implementation Agent feedback is either absent or has Architect disposition recorded.
- [ ] Any remaining known issue is resolved, explicitly disposed by Architect, or recorded as an exceptional owner-decision blocker before merge.

## Workflow Scope

- [ ] This PR is one task slice: one isolated worktree, one branch, and one PR.
- [ ] Orchestrator warned assigned subagents that parallel agents may be active and existing dirty diffs, branches, commits, PRs, and process memory must be preserved.
- [ ] Sibling worktrees, branches, dirty diffs, commits, PR state, feature folders, and process memory were not mutated without explicit Orchestrator coordination.
- [ ] Additional task slices, if any, started from latest `origin/main` in separate isolated worktrees/branches/PRs; in-flight work was preserved rather than overwritten.
- [ ] Changes are limited to the assigned feature memory and scoped files; unrelated work is deferred.
- [ ] Role boundaries were preserved: Orchestrator did not directly edit repo files, and agents did not switch roles mid-task.
- [ ] Required review fixes, source prerequisites, metadata fixes, and final-guard fixes are split into separate PRs when separation lowers risk or clarifies gates.

## Merge Readiness

- [ ] Required checks are green on the current head, not red, missing, queued, or running.
- [ ] Blocking review findings are resolved or outdated.
- [ ] Required review conversations are resolved.
- [ ] The PR has no unresolved merge conflicts.
- [ ] Final Architect validation passed before final Analyst validation, recorded `Final Architect validation completed at: <ISO 8601 timestamp>`, and covered all PR slices, Architect-assigned tasks/dispositions, architectural guidance, open task state, process memory, and customer intent in spirit.
- [ ] Final Analyst validation passed after Architect validation, recorded `Final Analyst validation completed at: <ISO 8601 timestamp>`, and checked customer intent in spirit and letter.
- [ ] If commits landed after final Architect or Analyst validation, the PR records `Effective content head: <40-hex-sha>`, proves later commits are final-validation evidence-only, and includes Orchestrator current-PR-head read-only guard evidence that explicitly references that effective content head by full SHA or unambiguous short prefix. Non-evidence post-validation changes were routed back through role-appropriate follow-up or final validation.
- [ ] Architect return count is within the limit of 10 and Analyst return count is within the limit of 5, or limit-exceeded escalation created a new feature request as required.
- [ ] Analyst feedback, if any, has Architect accept/task/ticket/dispose disposition before follow-up development.
- [ ] Completion evidence uses GitHub state and local read-only guards, not only AI-written summaries.
- [ ] Orchestrator finalization is expected for Orchestrator-managed PRs after all gates pass; any no-merge instruction, credentials/permissions problem, protected-branch policy blocker, ambiguous PR state, or pending accepted-known-issue owner decision is recorded as an exceptional human blocker.
- [ ] Mutating finalization or auto-merge uses an explicit `--expected-head` or `--head-sha` for the reviewed and validated PR head; dry-run inspection may omit it.
- [ ] If pending required checks remain, `pnpm run pr:finalize -- --auto-merge-pending` may only enable GitHub protected auto-merge; it must not bypass required checks or branch protection.

## Validation

- [ ] `pnpm run preflight`
