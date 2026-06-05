# Spec: AI Review Codex Connector Login Gate

## Analyst Intake

- Source request: `feature-request.md`
- Intake assumptions or open questions carried into this spec: no product questions are open. The target Codex login is `chatgpt-codex-connector`, the compatibility login to preserve is `chatgpt-codex-connector[bot]`, and the failure mode is a default-branch AI Review gate trust mismatch.
- Orchestrator routing context: Orchestrator assigned Architect planning for feature `033-ai-review-login-gate` in `/Users/chap/devel/cabadrive-worktrees/033-ai-review-login-gate` on branch `codex/033-ai-review-login-gate`.
- Active-model stop condition: Architect is operating only under the Orchestrator assignment and will write only `spec.md`, `plan.md`, and `tasks.md`; implementation, staging, commit, push, PR, review, check reruns, and merge remain out of Architect scope.
- Read-only transition: The request is repository-changing because it plans scripts/tests/config changes for the required AI Review gate; Analyst intake already recorded the route before implementation.
- Parallel-work constraints: parallel Cabadrive work may exist. All dirty diffs, branches, commits, PRs, sibling worktrees, feature folders, and process memory must be preserved.
- Startup base evidence: Orchestrator reported verified base `origin/main` at `51e42f657d867fb802bbe3a68591b6008b45a60f`; Architect read-only check observed current `HEAD` at the same SHA.
- Cleanup applicability: cleanup is not applicable for this feature. No local environment deletion or artifact cleanup is assigned.

## Cycle Definition

- Work cycle: one repository-changing gate-fix request represented by `specs/033-ai-review-login-gate/`, from latest-main startup through a single implementation PR slice, final validation, completion, or escalation.
- Cycle PR set expectations: `tasks.md` must record each contributing PR slice with purpose, branch, PR metadata or number, current/final head SHA, status, and whether it is included in final validation.
- Latest-main startup rule: this Analyst/Architect handoff worktree may continue as the single implementation PR slice only if Orchestrator explicitly assigns it. Any additional implementation slice must start from latest verified `main`, normally after fetching `origin main`, in a fresh isolated worktree/branch. Fetch or base verification failure is a blocker or recorded fallback.

## Goal

Allow the AI Review gate to trust current Codex native review evidence from `chatgpt-codex-connector` alongside `chatgpt-codex-connector[bot]` while preserving current-head, strict-login, severity, and default-branch trusted-script safeguards.

## Scope

In scope:

- Trust classification for Codex review logins used by `scripts/ai-review-helpers.mjs` and consumers such as `scripts/ai-review-gate.mjs` and `scripts/finalize-pr.mjs`.
- Regression tests for positive trust of both Codex connector login forms and negative rejection of stale, unknown, broad association, and cross-agent trust cases.
- Process evidence showing why this is a separate default-branch-effective PR slice before PR `#198` can satisfy branch protection.
- Orchestrator post-merge handoff requirement to rerun or observe `AI Review` on PR `#198` after this gate fix lands on default.

Out of scope:

- Cabadrive learner UI, manual content, runtime behavior, Docker runtime contract, question data, source archives, or manual page assets.
- Broadening trust to arbitrary GitHub users, associations, repository owners, app identities, or global review logins beyond the narrow Codex connector compatibility requirement.
- Weakening stale-head rejection, Codex severity/thread handling, resolved-thread behavior, Claude/Gemini contracts, required check names, branch protection, or default-branch trusted-script checkout.
- PR-local changes inside PR `#198`; that PR cannot unblock its own AI Review gate by changing trusted gate scripts because the workflow checks those scripts out from the repository default branch.
- Cleanup of worktrees or local environments.

## User Stories

### User Story 1

As an Orchestrator managing protected Cabadrive PRs, I want the AI Review gate to accept the current Codex connector login, so that a valid current-head Codex native review can satisfy the required check without relaxing review trust.

### User Story 2

As a repository maintainer, I want the gate fix to land through a narrow default-branch-effective PR, so that existing and parallel PRs continue to be protected by trusted scripts while gaining the corrected Codex login compatibility.

## Acceptance Criteria

1. Given the selected review agent is `codex`, when `isTrustedReviewLogin` checks `chatgpt-codex-connector[bot]`, then the login remains trusted.
2. Given the selected review agent is `codex`, when `isTrustedReviewLogin` checks `chatgpt-codex-connector`, then the login is trusted.
3. Given a native Codex review from either trusted connector login targets the current head and existing Codex severity/thread rules classify it as passing, when `AI Review` validates evidence, then the gate can pass.
4. Given a Codex native review or summary comment targets an older head, when the gate validates a newer head, then the stale evidence is rejected.
5. Given a Codex native review, review comment, or summary comes from an unknown or unrelated login, when the gate validates evidence, then it is rejected even if the GitHub association is trusted.
6. Given a human, owner, member, collaborator, Claude login, Gemini login, or administrative account posts review-like text, when Codex trust is evaluated, then it is not accepted unless it is explicitly in the trusted Codex login set.
7. Given the AI Review workflow runs on a PR, when it resolves gate scripts, then it still checks out scripts from the repository default branch.
8. Given Claude or Gemini evidence is validated, when this change is applied, then their existing trust and severity behavior remains unchanged unless a minimal compatibility adjustment is deliberately documented and tested.
9. Given this PR lands on default, when Orchestrator returns to PR `#198`, then Orchestrator reruns or observes `AI Review` using the default-branch gate fix and current PR `#198` head evidence.

## Negative Scenarios

1. Given `OWNER`, `MEMBER`, or `COLLABORATOR` appears on a comment author association, when the login is not explicitly trusted for the selected AI review agent, then the evidence does not satisfy the gate.
2. Given a Codex review from `chatgpt-codex-connector` is tied to a previous commit, when the PR head changes, then the old review remains stale and a fresh current-head review is required.
3. Given a global config trust entry would trust the same login across Claude, Gemini, and Codex, when implementing this fix, then Implementation Agent must avoid that path unless tests prove no cross-agent trust broadening.
4. Given a PR modifies `.github/workflows/ai-review.yml` or gate scripts, when that same PR's AI Review job runs, then the job still uses default-branch trusted scripts rather than the PR's modified scripts.
5. Given a Codex review body or unresolved inline thread contains `P0`, `P1`, or `P2`, when evidence is evaluated, then the gate/finalization blocker remains.

## Requirements

- FR-001: The trusted Codex login set must include both `chatgpt-codex-connector[bot]` and `chatgpt-codex-connector`.
- FR-002: The preferred implementation path is to update the default Codex trusted login list in `scripts/ai-review-helpers.mjs`, because both the AI Review gate and finalize helper consume that helper and `.unicorn-hub/config.json` currently carries no repository-specific trusted review logins.
- FR-003: If Implementation Agent chooses a config-based or mixed code/config path instead, it must record why that is narrower or more durable than the helper default and must add tests proving no broad global trust or cross-agent trust regression.
- FR-004: Native Codex review acceptance must continue to require current-head matching and existing Codex pass/fail classification.
- FR-005: Codex no-findings summary acceptance must continue to require a trusted Codex login, the existing `Codex Review:` summary contract, and either a current head SHA marker or freshness by timestamp.
- FR-006: Trusted GitHub associations must remain separate from trusted AI review logins and must not satisfy the gate by themselves.
- FR-007: The AI Review workflow must continue to check out trusted gate scripts from `github.event.repository.default_branch`.
- FR-008: Tests must cover the new Codex connector login positive case and negative cases for unknown login, stale head, association-only trust, and cross-agent isolation.
- FR-009: This work must preserve Orchestrator-first routing, role boundaries, accidental-start recovery rules, latest-main startup evidence, cycle PR-set tracking, final Architect-before-Analyst validation, return limits, and sibling-work preservation.
- FR-010: No cleanup is in scope; any cleanup request must be routed separately to Orchestrator and Cleanup Agent.

## Success Criteria

- SC-001: Focused helper tests prove both Codex connector login forms are trusted for Codex.
- SC-002: Focused helper/gate tests prove unknown logins, association-only evidence, stale-head evidence, and blocking Codex severities remain rejected.
- SC-003: Workflow tests or static evidence prove default-branch trusted-script checkout remains unchanged.
- SC-004: Final process memory records the single slice purpose, branch, PR metadata, head SHA, status, final-validation inclusion, verification evidence, and post-merge PR `#198` rerun/observe requirement.
- SC-005: Required local verification passes, including focused tests, feature-memory check, `git diff --check`, and preflight if feasible.

## Assumptions

- `chatgpt-codex-connector` is the current login emitted by Codex native GitHub review evidence for this repository.
- `chatgpt-codex-connector[bot]` must stay trusted for compatibility with existing or alternate Codex evidence.
- The gate fix must land on default before it can unblock PR `#198` because AI Review checks out trusted gate scripts from default.
- No user-facing product behavior changes are required.

## Review And Verification Requirements

- Implementation requirements: Implementation Agent must start only after complete feature memory exists and Orchestrator assigns an isolated worktree/branch/PR slice. Keep the code change narrow, preferably limited to `scripts/ai-review-helpers.mjs` plus focused tests, with docs/config touched only if implementation evidence shows they are necessary.
- Review requirements: Review Agent must verify strict trust boundaries, current-head rejection, unknown-login rejection, association/login separation, default-branch checkout preservation, process-memory completeness, role-boundary compliance, and no unrelated product/runtime changes.
- Test/verification requirements: Required focused command is `node --test tests/ai-review-helpers.test.mjs`. Also run `node --test tests/ai-review-workflow.test.mjs` if workflow/default-branch checkout assertions are touched or as static guard evidence. Run `node --test tests/finalize-pr.test.mjs` if the helper default affects finalization blocker behavior or if finalize-specific tests are added. Always run `node scripts/check-feature-memory.mjs --worktree`, `git diff --check`, and `pnpm run preflight` when feasible for a workflow/tooling change.
- Handoff and blocker requirements: Implementation Agent feedback must be recorded in `tasks.md`; Orchestrator must route each item back to Architect for disposition. A protected-branch or permission issue that prevents merging this default-branch-effective slice is a human blocker for unblocking PR `#198`.
- Final validation requirements: Architect final validation must occur before Analyst final validation. Passing effective-head validation must record matching `Effective content head: <40-hex-sha>`, `Architect validated effective content head: <40-hex-sha>`, and `Analyst validated effective content head: <40-hex-sha>` markers. Any later non-evidence change makes prior validation stale.
