# Tasks: Unicorn Bootstrap Docs Foundation

## Setup

- [x] T001 Confirm active feature folder and branch.
- [x] T002 Run baseline checks before editing.

## Implementation

- [x] T003 Bootstrap Unicorn Hub portable workflow into the target repository.
- [x] T004 Replace root-level workflow placeholders with Cabadrive-specific guidance.
- [x] T005 Build durable `docs_project/` content from `docs/specify/` materials.
- [x] T006 Add initial feature inventory and UX interaction map docs.
- [x] T007 Adapt `.unicorn-hub/config.json` defaults for Cabadrive context.
- [x] T008 Fix `baseline-checks` bootstrap failure by making `setup-node` pnpm cache conditional on `pnpm-lock.yaml`.
- [x] T009 Fix first-PR `AI Review` bootstrap deadlock by gating trusted script execution and emitting explicit compatibility notice when scripts are missing on default branch.

## Verification

- [x] T010 Run local preflight and confirm all checks pass.
- [x] T011 Update this task list with final verification evidence.

## Process Memory

### Dead Ends

- Initial preflight attempt failed because feature memory files did not yet exist for this PR, which is expected by the repository guard.

### Decisions

- Chose `generic` profile as the safest bootstrap baseline due to missing committed runtime scaffold.
- Reused existing `docs/specify/` content as source-of-truth input for `docs_project/` to satisfy CREATE-DOCS before product coding.

### Known Issues

- Docker runtime contract (`make build`, `make up`, `make down`) is documented but not yet implemented in repository code.

### Verification Evidence

- `pnpm run preflight` passed with:
  - feature-memory gate success for `specs/001-unicorn-bootstrap-docs-foundation/`
  - repository baseline check success
- Workflow hardening changes applied:
  - `.github/workflows/ci.yml` now enables `setup-node` pnpm cache only when `pnpm-lock.yaml` exists.
  - `.github/workflows/ai-review.yml` now emits a bootstrap compatibility notice and exits green when trusted gate scripts are absent on default branch.
