# Plan: Auto Merge Finalization

## Implementation Strategy

Use one implementation PR slice unless Orchestrator later splits review fixes. The slice should first update workflow language, then add the executable helper and tests, then wire the package script and verification evidence.

Implementation must preserve existing work and begin by updating the branch from latest `origin/main` because intake started at `a26a124...` and `origin/main` later advanced to `995905b...`, adding sibling `specs/018-learning-ticket-timer`.

## Target Files

Expected implementation files:

- `AGENTS.md`
- `docs_project/project/devops/ai-pr-workflow.md`
- `docs_project/project/devops/review-contract.md`
- `.github/pull_request_template.md`
- `scripts/finalize-pr.mjs`
- focused helper tests in the repository's existing test location or a minimal scripts test location consistent with current tooling
- `package.json` for the finalization package script
- `specs/018-auto-merge-finalization/tasks.md`

Architect may accept equivalent test-file placement if it follows existing repo conventions discovered during implementation.

## Technical Design

`scripts/finalize-pr.mjs` should be a Node CLI that performs conservative checks before invoking GitHub merge behavior. Prefer existing local dependencies and GitHub CLI/API patterns already used by repository scripts. Keep side effects limited to GitHub PR finalization; all local repository inspection must be read-only.

The helper should separate pure gate evaluation from GitHub command execution so tests can exercise blocker logic without real GitHub mutation. The executable path should:

1. Resolve PR context and current head.
2. Load `.unicorn-hub/config.json` and read `requiredChecks`.
3. Query GitHub for PR draft state, mergeability/conflicts, current head SHA, status/check conclusions, review threads/conversations, and review-gate evidence.
4. Inspect process memory for final Architect validation, final Analyst validation, acceptance evidence, feedback disposition, known issues, and current-head guard evidence.
5. If all gates pass, squash merge the PR through GitHub.
6. If checks are pending and an explicit auto-merge flag is present, enable GitHub auto-merge instead of immediate merge.
7. Otherwise print actionable blockers and exit nonzero.

The helper must not implement any admin bypass, force merge, direct push, or branch protection override.

## Documentation Design

Docs should replace the routine human-final-owner terminal state with automatic Orchestrator finalization for Orchestrator-managed PRs once all objective gates pass. Keep exceptional human blockers explicit and narrow. Keep role boundaries clear: Orchestrator may perform GitHub-level finalization and merge, while Implementation Agent and Review Agent never merge and Orchestrator still does not edit repository files.

The PR template should guide authors to record finalization evidence and exceptional blockers rather than requiring routine human merge-owner acceptance.

## Verification Plan

Implementation Agent must record evidence for:

- `pnpm run preflight`
- helper unit tests or equivalent focused script tests
- text search showing removed or narrowed "only final human approval or merge mechanics remaining" and human-final-owner default wording
- text search showing preserved required checks, review resolution, final Architect/Analyst validation, process memory, current-head guard, and PR-only/no-direct-push requirements
- source review showing `.unicorn-hub/config.json` still owns required checks
- source review showing helper defaults to squash and does not expose bypass or direct-push paths

Runtime Docker verification is not required unless implementation changes runtime-affecting product files.

## Review Requirements

Review Agent should block if the implementation:

- weakens any merge-readiness gate
- allows direct pushes to `main`
- allows merge without current-head verification
- treats pending, missing, or red required checks as merge-ready
- bypasses branch protection
- removes final Architect or Analyst validation
- leaves docs/templates still saying routine completion stops at final human approval
- omits tests for helper blocker behavior

## Known Risks

- GitHub mergeability and review-thread APIs can be eventually consistent; the helper should report ambiguity as a blocker.
- Multiple review backends exist; implementation must honor the documented blocking semantics without overfitting to a stale summary.
- Branch protection or rulesets may block merge for reasons beyond local config; the helper must report those as protected-branch blockers.
