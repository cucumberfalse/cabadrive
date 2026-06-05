# Plan: AI Review Codex Connector Login Gate

## Summary

Implement a narrow AI Review gate compatibility fix by adding `chatgpt-codex-connector` to the default trusted Codex login set while preserving the existing `chatgpt-codex-connector[bot]` login and all current evidence-quality gates. The preferred durable path is the shared helper default in `scripts/ai-review-helpers.mjs`, because both `scripts/ai-review-gate.mjs` and `scripts/finalize-pr.mjs` consume that trust helper and the repository config currently has no explicit trusted-review-login overrides.

## Technical Context

- runtime: repository tooling and GitHub Actions gate scripts, not Cabadrive browser runtime.
- dependencies: existing Node ESM scripts and Node test runner.
- product paths: likely `scripts/ai-review-helpers.mjs`, `tests/ai-review-helpers.test.mjs`, optionally `tests/ai-review-workflow.test.mjs`, `tests/finalize-pr.test.mjs`, and this feature memory. Avoid product UI/content paths.
- data changes: none.
- latest-main base evidence: Orchestrator reported `origin/main` at `51e42f657d867fb802bbe3a68591b6008b45a60f`; Architect read-only `git rev-parse HEAD` returned `51e42f657d867fb802bbe3a68591b6008b45a60f`.
- assigned isolated worktree/branch: `/Users/chap/devel/cabadrive-worktrees/033-ai-review-login-gate`, branch `codex/033-ai-review-login-gate`.
- cleanup applicability: not applicable. No cleanup scope, roots, or deletion authority are assigned.

## Scope Boundaries

- in scope: Codex trusted-review login defaults, helper tests, AI Review workflow/static guard tests if touched, finalization tests if the shared helper behavior needs explicit finalization coverage, and process memory for the PR slice.
- out of scope: learner UI, content, manual image sizing, Docker runtime, branch protection configuration changes, broad trusted associations, broad `trustedReviewLogins` config additions, Claude/Gemini behavior changes, and PR-local changes to PR `#198`.
- role-routing constraints: Orchestrator-first route is complete through Analyst intake and Architect assignment. Architect must not implement. Implementation starts only after Orchestrator assigns Implementation Agent with complete feature memory.
- recovery constraints: no Architect accidental edit outside allowed artifacts has occurred. If Implementation Agent discovers accidental or sibling edits, it must stop, preserve, and report for Orchestrator disposition.
- sibling-process coordination: this slice exists because feature `032-manual-figures-full-width` PR `#198` cannot unblock its own AI Review check while trusted scripts are checked out from default. Preserve feature `032` work, PR state, and process memory.

## Constitution Check

- Spec-first: satisfied by existing `feature-request.md`; this plan adds `spec.md`, `plan.md`, and `tasks.md` before implementation.
- Testable boundaries: trust behavior is pure helper logic and can be tested without GitHub network access.
- PR-only: implementation must land via PR, not direct push to `main`.
- Latest-main isolation: startup base is verified as `origin/main` at `51e42f657d867fb802bbe3a68591b6008b45a60f`. Additional slices require fresh latest-main worktrees or a documented blocker/fallback.
- Final validation loop: Orchestrator must invoke final Architect validation before final Analyst validation after implementation, review, checks, and follow-up work appear complete.
- Simplicity: no new abstraction is planned; reuse `trustedReviewLoginsForAgent` and its default-login data.
- Deployability: default branch remains protected by the same AI Review current-head, severity, and trusted-script checkout rules.
- Active-model stop condition: non-Orchestrator agents must stop on new repository-changing requests unless assigned. Architect stops at planning.
- Complete feature-memory prerequisite: Implementation Agent must see `feature-request.md`, `spec.md`, `plan.md`, and `tasks.md` before editing.
- Sibling-work preservation: all sibling worktrees, branches, dirty diffs, commits, PRs, and process memory must be preserved.

## Cycle And PR-Set Tracking

- Work cycle boundary: feature `033-ai-review-login-gate` from intake through the gate-fix PR, final validations, completion, or escalation.
- Cycle PR set recording location: `tasks.md` process memory and the implementation PR body.
- PR slice fields: `purpose`, `branch`, `PR metadata`, `head SHA`, `status`, `included in final validation`.
- Analyst handoff handling: Orchestrator may assign this handoff worktree/branch as the single implementation PR slice.
- Additional task-slice startup: any extra slice must verify latest `origin/main`, record the SHA, use a fresh isolated worktree/branch/PR, and preserve existing work. Fetch/base verification failure blocks or requires explicit fallback evidence.

## Complexity Tracking

No new abstraction should be introduced. The narrow change is adding a second Codex connector login to the existing default trusted login array. A config-based implementation is allowed only if Implementation Agent records why it is narrower or more durable and proves it does not create broad or cross-agent trust.

## Implementation Guidance

1. Update `scripts/ai-review-helpers.mjs` so `defaultTrustedReviewLogins.codex` includes both `chatgpt-codex-connector[bot]` and `chatgpt-codex-connector`.
2. Keep `trustedReviewLoginsForAgent` merging behavior intact: defaults plus optional `trustedReviewLogins` plus optional `trustedReviewLoginsByAgent[agent]`.
3. Do not change `trustedAssociations` into AI review login trust. Associations can remain useful elsewhere, but they must not satisfy Codex review evidence.
4. Tighten Codex summary SHA handling so a summary body containing any 7-40 hex SHA-like marker that does not match the current full head or accepted current short head returns false before timestamp fallback. Timestamp freshness remains valid only for otherwise acceptable no-SHA Codex summaries.
5. Do not change `.github/workflows/ai-review.yml` unless implementation discovers a real workflow regression; the default-branch checkout behavior should remain intact.
6. Avoid editing `.unicorn-hub/config.json` unless there is a clear reason. A broad `trustedReviewLogins` addition is disfavored because it applies globally across agents.
7. If docs are touched, keep them limited to durable review/gate documentation and explain the exact trust boundary; docs are not required if tests and feature memory capture the behavior adequately.

## Cleanup Planning

- Cleanup applicability: not applicable; this is a scripts/tests/process-memory change.
- Cleanup Agent assignment: not applicable.
- Approved cleanup roots: none.
- Excluded/current work: all current, active, dirty, untracked, unpushed, open-PR, ambiguous, sibling, or user-owned worktrees and paths are excluded.
- Required validation: not applicable.
- Refusal conditions: any cleanup request or candidate must be refused by non-cleanup roles and routed to Orchestrator/Cleanup Agent.
- Evidence handoff: record "not applicable" cleanup evidence in `tasks.md`.

## Verification

| Acceptance criterion | Evidence |
| --- | --- |
| AC-001, AC-002 | `node --test tests/ai-review-helpers.test.mjs` proves both `chatgpt-codex-connector[bot]` and `chatgpt-codex-connector` are trusted for `codex`. |
| AC-003 | Helper tests cover current-head native Codex pass classification for both trusted connector login forms, or existing tests plus new targeted assertions prove the shared helper is consumed by native review classification. |
| AC-004 | Helper tests prove stale native reviews and stale summary comments remain rejected for changed heads, including an old-SHA summary with `headCommittedAt` supplied and a fresh comment timestamp. |
| AC-005, AC-006 | Helper tests prove unknown logins and association-only trust do not satisfy Codex review evidence; cross-agent tests prove the new login is not trusted for Claude/Gemini unless explicitly configured. |
| AC-007 | `node --test tests/ai-review-workflow.test.mjs` or static test evidence confirms `.github/workflows/ai-review.yml` still checks out `github.event.repository.default_branch`. |
| AC-008 | Existing plus focused tests prove Claude/Gemini behavior is unchanged; run finalize tests if finalization trust behavior is directly asserted. |
| AC-009 | `tasks.md` records post-merge Orchestrator requirement to rerun or observe `AI Review` on PR `#198` after this gate fix lands on default. |
| Latest-main startup | `feature-request.md`, `spec.md`, and `plan.md` record base `51e42f657d867fb802bbe3a68591b6008b45a60f`. |
| Cycle PR set | `tasks.md` records purpose, branch, PR metadata/number, head SHA, status, and final-validation inclusion. |
| Final Architect validation | Architect-owned final validation notes in `tasks.md` or `plan.md` when Orchestrator invokes final validation. |
| Final Analyst validation | Analyst-owned final validation notes in `feature-request.md` after Architect passes. |
| Effective content head and current-head guard | Process memory records matching effective-head markers and current-PR-head guard evidence before completion/finalization. |
| Cleanup applicability and evidence/refusal | `tasks.md` records cleanup not applicable. |
| Return limits | `tasks.md` records Architect return count <= 10 and Analyst return count <= 5, or escalation. |
| Merge gates | Orchestrator verifies required checks from `.unicorn-hub/config.json`, review findings, conflicts, acceptance evidence, process memory, feedback disposition, final validations, and current-head guard. |

Negative scenario evidence:

- Unknown Codex login rejection in `tests/ai-review-helpers.test.mjs`.
- Association-only rejection in `tests/ai-review-helpers.test.mjs`.
- Stale native review or summary rejection in `tests/ai-review-helpers.test.mjs`, including explicit old-SHA summary rejection before timestamp fallback.
- Cross-agent isolation in `tests/ai-review-helpers.test.mjs` or finalize tests.
- Default-branch checkout preserved in `tests/ai-review-workflow.test.mjs`.

Process enforcement evidence:

- `node scripts/check-feature-memory.mjs --worktree`
- `git diff --check`
- `pnpm run preflight` when feasible
- Manual diff review confirming changed files are limited to the assigned scope and no sibling work is touched

## Risks

- Risk: a broad config addition could trust the new login for non-Codex backends. Mitigation: prefer helper-level Codex default and add cross-agent negative tests.
- Risk: accepting `chatgpt-codex-connector` could accidentally allow stale PR `#198` evidence after a new head commit, especially if a summary names an old SHA but has a fresh timestamp. Mitigation: require current-head stale-rejection tests that pass `headCommittedAt`, reject mismatched SHA markers before timestamp fallback, and require Orchestrator rerun/observe on the current PR `#198` head after default merge.
- Risk: changing workflow checkout could let PRs weaken their own gate. Mitigation: keep workflow untouched or preserve `github.event.repository.default_branch` with workflow tests.
- Risk: finalization blocker detection also consumes trusted logins. Mitigation: consider focused finalize tests if implementation adds finalization-specific assertions or changes helper semantics beyond the default list.
