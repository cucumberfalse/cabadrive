# Specification: Auto Merge Finalization

## Goal

Change Cabadrive's repository workflow so Orchestrator-managed PRs do not routinely stop at "only final human approval or merge mechanics remaining" after objective gates pass. The workflow must instead continue through conservative finalization and merge when the current PR is provably merge-ready, while preserving PR-only delivery, role boundaries, branch protection, and final validation.

## Root Cause

The current durable docs and PR template still frame human final merge ownership as the default terminal state. `AGENTS.md` and workflow docs allow Orchestrator merge only when explicit current user authorization already exists, and the completion contract still says a task is complete when "only final human approval or merge mechanics" remain. No executable helper exists to perform or verify finalization consistently, so Orchestrators have no concrete final step beyond reporting readiness.

## Scope

In scope:

- Update durable workflow docs and PR template language so routine final human approval is no longer the terminal blocker for Orchestrator-managed PRs that satisfy all gates.
- Add an executable conservative PR finalization helper, tentatively `scripts/finalize-pr.mjs`.
- Add a package script for the helper.
- Add focused tests for finalization gate logic.
- Keep required checks sourced from `.unicorn-hub/config.json`.
- Keep process evidence in `specs/018-auto-merge-finalization/tasks.md` current through implementation.

Out of scope:

- Changing branch-protection rules to weaken safeguards.
- Direct pushes to `main`.
- Editing secrets or production resources.
- Replacing GitHub branch protection, review-gate checks, or final Architect/Analyst validation.
- Implementing CI-driven unattended merging without Orchestrator-controlled final checks.

## Architecture Decision

Implement docs/templates plus an executable conservative helper. Docs-only changes are insufficient because they would explain the desired behavior but still leave Orchestrators without a repeatable command that verifies the current PR head, required checks, review state, mergeability, final validation evidence, and protected-branch readiness before merge.

The helper should be a local Orchestrator tool that uses GitHub state and local read-only checks to either merge the PR safely or report blockers. It must never bypass GitHub protections. Squash merge is the default merge method because the active ruleset allows only squash.

## Helper Requirements

The helper must:

- Operate only on a pull request; refuse to act without a PR context or explicit PR identifier.
- Never push directly to `main` or any protected branch.
- Verify the current PR head SHA and guard against stale local or supplied head state.
- Require the PR to be non-draft.
- Require clean mergeability and no unresolved merge conflicts.
- Require every check listed in `.unicorn-hub/config.json` `requiredChecks` to be green on the current PR head.
- Treat red, missing, queued, pending, skipped-as-unsatisfied, or running required checks as blockers.
- Require all GitHub required review conversations to be resolved.
- Require no unresolved blocking review findings according to the active review contract.
- Require final Architect validation and final Analyst validation evidence in the process memory, in the documented order.
- Require acceptance evidence, current process memory, no unresolved Implementation Agent feedback without Architect disposition, and current-head guard evidence as documented by the workflow.
- Use squash merge by default.
- Never use admin bypasses or force options to defeat branch protection.
- If required checks are pending, optionally enable GitHub auto-merge only when an explicit flag is provided; otherwise report pending checks as blockers.

## Human Blockers

Human intervention remains required only for exceptional blockers:

- Missing credentials or permissions.
- Explicit user instruction not to merge.
- An unresolved accepted-known-issue owner decision.
- Ambiguous repository or PR state that could risk data loss, scope change, or wrong-PR merge.
- A protected-branch, ruleset, or GitHub policy blocker that prevents merge despite satisfied workflow gates.

## Acceptance Criteria

1. Durable docs explain the root cause: human-final-owner/default terminal wording plus authorization-only Orchestrator merge and no executable finalization helper.
2. Durable docs and PR template define Orchestrator finalization as the expected path after objective gates pass, except for documented human blockers.
3. The helper verifies PR-only operation, current head, non-draft state, mergeability, required checks from `.unicorn-hub/config.json`, review resolution, blocking findings, final validation evidence, process evidence, and current-head guard evidence before merge.
4. The helper defaults to squash merge and never bypasses GitHub protections or direct-pushes to `main`.
5. Pending checks do not merge by default; an explicit flag may enable GitHub auto-merge instead.
6. Tests cover pass and blocker scenarios for required checks, stale head, draft PR, conflicts, unresolved review state, missing validation evidence, and pending-check behavior.
7. Verification records text-search evidence that old terminal human-approval wording was removed or narrowed and that gate wording remains preserved.

## Negative Scenario

If a PR has all local process memory present but one required check from `.unicorn-hub/config.json` is still pending or missing on the current PR head, the helper must not merge. Without the explicit auto-merge flag it reports the check as a blocker; with the flag it may enable GitHub auto-merge only through GitHub's protected auto-merge mechanism.

## Process Context

This feature began from `a26a124...`, but `origin/main` advanced to `995905b...` after intake and added sibling `specs/018-learning-ticket-timer`. Implementation Agent must update, rebase, or merge latest `main` before final PR readiness and preserve the duplicate-prefix context rather than overwriting sibling work.

## Final Architect Validation Notes

Append-only Architect-owned section used only when Orchestrator invokes final Architect validation.

- Architect validation pass: not yet invoked.
- Architect return count for this work cycle: 0.
- Open Architect dispositions: none at planning handoff.
