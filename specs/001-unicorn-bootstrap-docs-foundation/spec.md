# Spec: Unicorn Bootstrap Docs Foundation

## Goal

Install the Unicorn Hub workflow baseline into Cabadrive and replace template placeholders with project-specific durable documentation before product-code implementation.

## Scope

In scope:

- Bootstrap workflow files from Unicorn Hub with the closest safe profile.
- Adapt root agent guidance (`AGENTS.md`, `CLAUDE.md`, `README.md`) for Cabadrive.
- Build `docs_project/` from existing `docs/specify/` planning artifacts.
- Configure `.unicorn-hub/config.json` for Cabadrive process defaults.
- Validate repository preflight for the bootstrapped state.

Out of scope:

- Product runtime implementation (`src/`, Docker runtime scaffold, UI code).
- Official content ingestion and validation pipeline implementation.
- Production deployment configuration.

## User Stories

### User Story 1

As a project owner, I want the portable multi-agent blueprint installed with Cabadrive-specific docs, so that agents can work from consistent memory before coding features.

### User Story 2

As an implementation agent, I want durable docs and workflow guardrails in place, so that future feature work starts spec-first and passes repository gates.

## Acceptance Criteria

1. Given a clean Cabadrive repository, when bootstrap runs from a local Unicorn Hub path, then workflow templates, scripts, and configuration are installed successfully.
2. Given installed templates, when placeholders are reviewed, then project-facing docs reflect Cabadrive context rather than unresolved scaffolding text.
3. Given the CREATE-DOCS protocol requirement, when docs are prepared, then `docs_project/` contains project idea, market, technical docs, feature inventory, and interaction maps.
4. Given bootstrapped workflow guards, when local verification runs, then `pnpm run preflight` passes.
5. Given a bootstrap repository without `pnpm-lock.yaml`, when CI `baseline-checks` runs, then `actions/setup-node` does not fail on pnpm cache preconditions.
6. Given the first bootstrap PR where trusted scripts are not yet on `main`, when `AI Review` runs, then the job exits green with an explicit bootstrap compatibility notice instead of failing with `MODULE_NOT_FOUND`.
7. Given the AI review helper module, when parsing priority markers, SHA markers, and trusted login rules, then automated tests validate expected behavior.

## Negative Scenarios

1. Given product-path changes without feature memory, when preflight runs, then the check fails and blocks completion.
2. Given unresolved placeholders in durable docs, when implementation starts, then agents may misinterpret project scope; this change prevents that by replacing placeholders.

## Requirements

- FR-001: Bootstrap must use a local filesystem source for Unicorn Hub scripts.
- FR-002: The selected profile must be documented and reflected in `.unicorn-hub/config.json`.
- FR-003: Durable docs in `docs_project/` must be populated from Cabadrive planning context before first product feature spec.
- FR-004: The PR must include complete feature memory (`spec.md`, `plan.md`, `tasks.md`) for this bootstrap change.
- FR-005: `.github/workflows/ci.yml` must avoid enabling pnpm cache in `setup-node` when `pnpm-lock.yaml` is absent.
- FR-006: `.github/workflows/ai-review.yml` must handle the first-bootstrap case where trusted gate scripts are missing on the default branch without making required `AI Review` permanently red.
- FR-007: The repository should include a lightweight local test suite for `scripts/ai-review-helpers.mjs` covering severity parsing, SHA marker extraction, and trusted reviewer login logic.

## Success Criteria

- SC-001: `pnpm run preflight` succeeds after bootstrap and documentation updates.
- SC-002: No unresolved template placeholders remain in `AGENTS.md`, `CLAUDE.md`, `README.md`, and key `docs_project/` files.

## Assumptions

- `generic` is the closest safe profile because runtime stack scaffolding is not yet committed and command contracts need project-specific follow-up.
