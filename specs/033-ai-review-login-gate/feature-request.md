# Feature Request: AI Review Codex Connector Login Gate

## Intake Role

Analyst intake for an Orchestrator-assigned repository-changing gate-fix request.

Analyst created exactly this intake artifact for feature `033-ai-review-login-gate` and made no code, test, planning, documentation, staging, commit, push, PR, or merge changes.

## Base And Worktree Context

- Repository/worktree: `/Users/chap/devel/cabadrive-worktrees/033-ai-review-login-gate`
- Branch: `codex/033-ai-review-login-gate`
- Verified base: `origin/main` at `51e42f657d867fb802bbe3a68591b6008b45a60f`
- Base verification source: Orchestrator reported successful fetch before worktree creation; Analyst read-only verification observed `HEAD` and merge base at `51e42f657d867fb802bbe3a68591b6008b45a60f`.
- Parallel-work warning: parallel Cabadrive work may be active. Preserve all existing dirty diffs, branches, commits, PRs, sibling worktrees, and process memory.

## Original Triggering Context

PR `#198` for feature `032-manual-figures-full-width` is otherwise implemented and reviewed, but the required GitHub check `AI Review` is stuck or pending.

Current-head native Codex review evidence exists on PR `#198` from GitHub login `chatgpt-codex-connector` for head `9df31d213419b107ca49797c0357ce8151c8effe`.

Read-only helper evidence provided by Orchestrator shows the current default trust behavior:

- `isTrustedReviewLogin("chatgpt-codex-connector[bot]", "codex")` returns `true`.
- `isTrustedReviewLogin("chatgpt-codex-connector", "codex")` returns `false`.
- `.unicorn-hub/config.json` currently has an empty `trustedReviewLoginsByAgent` object.

Feature `032` Architect disposition recorded that a PR-local fix inside PR `#198` would not unblock its own `AI Review` check because `.github/workflows/ai-review.yml` checks out trusted gate scripts from the default branch. A separate latest-main gate-fix slice is therefore needed.

## Project And Process Context

Cabadrive uses a PR-only, spec-first workflow. Required checks are configured in `.unicorn-hub/config.json` and currently include `AI Review`.

The `AI Review` workflow validates the configured review backend from `AI_REVIEW_AGENT`; for Codex, native GitHub review evidence or a trusted no-findings summary can satisfy the gate only when it applies to the current PR head and contains no blocking severity.

The workflow intentionally checks out trusted gate scripts from the repository default branch before validating review evidence. This prevents a pull request from weakening its own review gate, but it also means fixes to the gate must land on default before they can unblock older or parallel PRs that depend on that gate.

Relevant local surfaces observed during intake:

- `.github/workflows/ai-review.yml`
- `.unicorn-hub/config.json`
- `scripts/ai-review-helpers.mjs`
- `scripts/ai-review-gate.mjs`
- `tests/ai-review-helpers.test.mjs`
- `tests/ai-review-workflow.test.mjs`
- `docs_project/project/devops/ai-pr-workflow.md`
- `docs_project/project/devops/review-contract.md`

## Requested Outcome

Fix the AI Review gate trust logic, configuration, and regression coverage so current Codex connector native reviews from `chatgpt-codex-connector` are accepted alongside the existing trusted `chatgpt-codex-connector[bot]` login.

The fix must preserve strict trust boundaries. It must not broaden review acceptance to arbitrary GitHub users, arbitrary `OWNER` comments, stale reviews, stale comments, or unrelated bot/application identities.

## Acceptance Expectations

1. Codex review login trust accepts both `chatgpt-codex-connector[bot]` and `chatgpt-codex-connector` for the Codex review backend.
2. Native Codex review evidence from either trusted Codex connector login can satisfy `AI Review` only when the review applies to the current head SHA and the existing Codex severity/thread rules classify it as passing.
3. Existing stale-head rejection remains intact for native reviews and summary comments.
4. Unknown or unrelated logins remain rejected for Codex review evidence.
5. Trusted GitHub association values such as `OWNER`, `MEMBER`, or `COLLABORATOR` are not treated as substitutes for trusted AI review logins.
6. Claude and Gemini review trust behavior is preserved unless Architect deliberately scopes a minimal, tested compatibility adjustment.
7. The default-branch trusted-script checkout behavior remains intact.
8. Regression tests cover the new Codex connector login acceptance and the negative trust cases.
9. The change is small, auditable, and suitable to land before rerunning or observing `AI Review` for PR `#198`.
10. Verification evidence should include focused gate-helper tests and the repository's normal local preflight expectations for workflow/tooling changes.

## Negative Scenarios To Preserve

- A Codex native review from an unknown login must not satisfy the gate.
- A Codex review or summary for an older head must not satisfy the gate for a newer PR head.
- A top-level comment by an arbitrary trusted association must not satisfy the gate unless it is from an explicitly trusted review login and matches the established Codex summary contract.
- A broad global trust addition must not accidentally trust unrelated Claude, Gemini, human, or administrative accounts for Codex review evidence.
- The PR under review must not be able to modify its own gate script and thereby pass itself.

## Assumptions

- `chatgpt-codex-connector` is the current login emitted by the Codex native GitHub review integration in this repository context.
- Keeping `chatgpt-codex-connector[bot]` trusted remains necessary for compatibility with existing or alternate Codex review evidence.
- The desired fix is process/tooling only and does not affect Cabadrive product runtime behavior, content, manual pages, Docker runtime, or learner UI.
- No normal-flow user clarification is needed because the Orchestrator assignment states the target login, existing trusted login, current failure mode, and required guardrails.
- No public external research was needed for Analyst intake; the request is grounded in Orchestrator-provided GitHub evidence and local repository inspection.

## Risks

- Over-fixing this as a broad login or association trust rule could weaken the review gate and allow non-review comments or unrelated accounts to pass required checks.
- Placing the fix only in `.unicorn-hub/config.json` may be insufficient if other helpers or tests expect the default trusted Codex logins to include current connector variants; Architect should choose the narrowest durable implementation path.
- Placing the fix only in PR-local code cannot unblock existing PRs until this gate-fix slice lands on default, because the workflow uses default-branch scripts.
- PR `#198` review evidence is tied to head `9df31d213419b107ca49797c0357ce8151c8effe`; if PR `#198` receives a new behaviorally meaningful commit, the old review evidence should remain stale and a fresh review should be required.

## Open Questions

No product requirement questions are open for intake.

Architect should decide whether the login compatibility belongs in the default trusted Codex login list, repository config, or a combination, and should require tests that prove the chosen path preserves the negative scenarios above.

## Handoff

Ready for Orchestrator handoff to Architect for `spec.md`, `plan.md`, and `tasks.md`.

## Final Analyst Validation

- Analyst validation pass: passed
- Final Analyst validation completed at: 2026-06-05T05:00:07Z
- Analyst validated effective content head: 900e516eeffe95a709ee5a4306df7f16b5cddce8
- Analyst validated after final Architect validation marker recorded in `tasks.md` at `2026-06-05T04:58:11Z` for the same effective content head.
- Effective content matches the intake intent in spirit and letter: the Codex AI Review gate trusts `chatgpt-codex-connector` alongside `chatgpt-codex-connector[bot]`, while preserving strict login trust, unknown-login rejection, association-only rejection, stale-head rejection before timestamp fallback, 7-40 character current-head prefix acceptance, default-branch trusted-script behavior, and the post-merge handoff requirement to unblock PR `#198` through the corrected default-branch gate.
- Analyst return count: 0; within the limit of 5. No Analyst gaps or new Architect dispositions are required.

## Final Analyst Validation Notes

- Analyst validation pass: passed
- Final Analyst validation completed at: 2026-06-05T05:17:04Z
- Analyst validated effective content head: 73864c5e7f1154f6959bac76914836e43e407dc5
- Analyst validation evidence: final Architect validation passed for the same effective content head and the recorded outcome matches the intake intent for trusted Codex connector login handling.
- Analyst validation evidence: PR `#199` head equals `73864c5e7f1154f6959bac76914836e43e407dc5`; required checks `AI Review`, `baseline-checks`, `docker-validation`, `guard`, and `osv-scan` are successful, with `mergeable` as `MERGEABLE` and `mergeStateStatus` as `CLEAN`.
- Analyst validation evidence: the final result accepts `chatgpt-codex-connector` alongside `chatgpt-codex-connector[bot]` while preserving strict explicit-login trust, untrusted-login rejection, association-only rejection, stale-head rejection, current-head 7-40 character prefix/full evidence acceptance, and default-branch trusted helper behavior.
- Analyst validation evidence: all PR `#199` review threads are resolved, review P2 findings were fixed and disposed, process memory records the PR `#198` post-merge AI Review follow-through, and no product-runtime scope was added.
- Analyst return count: 0; within the limit of 5. No Analyst gaps or new Architect dispositions are required.
