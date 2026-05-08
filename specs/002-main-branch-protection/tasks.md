# Tasks: Main Branch Protection

## Setup

- [x] T001 Confirm active feature folder and branch.
- [x] T002 Check existing branch-protection mechanism and GitHub API availability.

## Implementation

- [x] T003 Add `osv-scan` to `.unicorn-hub/config.json` required checks.
- [x] T004 Document that `main` must not receive direct pushes.
- [x] T005 Document that PRs require green checks before merge.
- [x] T008 Make pull request `AI Review` runs post the selected backend trigger before polling.
- [x] T009 Document automated AI Review trigger behavior.
- [x] T011 Handle trigger comment permission denial without an uncaught exception.

## Verification

- [x] T006 Run local preflight.
- [x] T007 Update docs and tasks status.
- [x] T010 Verify pull request AI Review trigger-mode behavior.

## Process Memory

### Dead Ends

- Direct GitHub branch protection and repository ruleset API calls returned HTTP 403 because this private repository does not currently have branch protection available on its GitHub plan.

### Decisions

- Reused the existing `scripts/apply-branch-protection.mjs` branch-protection path instead of adding a second policy mechanism.
- Added `osv-scan` because it is an active pull request check and was missing from `requiredChecks`.
- Kept manual `workflow_dispatch` trigger mode explicit, but made same-repository pull request events post the selected native review trigger comment before the gate starts polling.
- Restricted automatic pull request trigger comments to same-repository PRs and treated token write denial as a degraded mode that waits for existing or human-triggered review evidence.

### Known Issues

- GitHub enforcement still needs to be applied after branch protection becomes available for the private repository, either by upgrading the GitHub plan or changing repository visibility intentionally.
- Some native review backends may ignore trigger comments authored by `github-actions[bot]`, and some repository or PR contexts deny issue-comment writes to `GITHUB_TOKEN`; in those cases, a trusted human-authored trigger comment is still required.

### Verification Evidence

- `pnpm run preflight` passed:
  - feature-memory gate success for `specs/002-main-branch-protection/`
  - repository baseline check success
- `pnpm run test` passed with 11/11 tests, including same-repository pull request AI Review trigger-mode coverage and trigger-comment permission-denial handling.
- `git diff --check` passed with no whitespace errors.
