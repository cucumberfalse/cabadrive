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

## Verification

- [x] T008 Run local preflight and confirm all checks pass.
- [x] T009 Update this task list with final verification evidence.

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
