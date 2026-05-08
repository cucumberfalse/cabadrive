# Tasks: Main Branch Protection

## Setup

- [x] T001 Confirm active feature folder and branch.
- [x] T002 Check existing branch-protection mechanism and GitHub API availability.

## Implementation

- [x] T003 Add `osv-scan` to `.unicorn-hub/config.json` required checks.
- [x] T004 Document that `main` must not receive direct pushes.
- [x] T005 Document that PRs require green checks before merge.

## Verification

- [x] T006 Run local preflight.
- [x] T007 Update docs and tasks status.

## Process Memory

### Dead Ends

- Direct GitHub branch protection and repository ruleset API calls returned HTTP 403 because this private repository does not currently have branch protection available on its GitHub plan.

### Decisions

- Reused the existing `scripts/apply-branch-protection.mjs` branch-protection path instead of adding a second policy mechanism.
- Added `osv-scan` because it is an active pull request check and was missing from `requiredChecks`.

### Known Issues

- GitHub enforcement still needs to be applied after branch protection becomes available for the private repository, either by upgrading the GitHub plan or changing repository visibility intentionally.

### Verification Evidence

- `pnpm run preflight` passed:
  - feature-memory gate success for `specs/002-main-branch-protection/`
  - repository baseline check success
- `pnpm run test` passed with 9/9 tests.
- `git diff --check` passed with no whitespace errors.
