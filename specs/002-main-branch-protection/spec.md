# Spec: Main Branch Protection

## Goal

Ensure `main` accepts changes only through pull requests and merge readiness depends on every active PR check passing.

## Scope

In scope:

- Branch-protection required check source of truth in `.unicorn-hub/config.json`
- Repository workflow documentation for `main`
- Feature-memory evidence for this policy change

Out of scope:

- GitHub billing or repository visibility changes
- New CI workflows or new branch-protection tooling

## User Stories

### User Story 1

As a repository maintainer, I want `main` protected by a PR-only workflow, so that changes cannot bypass review and CI.

## Acceptance Criteria

1. Given the active GitHub PR workflows, when branch protection is applied, then `baseline-checks`, `guard`, `AI Review`, and `osv-scan` are required before merge.
2. Given a contributor reads the repository process docs, when they prepare a change for `main`, then they see that direct pushes are not allowed and PR checks must be green.

## Negative Scenarios

1. Given GitHub branch protection is unavailable for the private repository, when the protection script is run, then enforcement is rejected by GitHub and the limitation is recorded instead of silently claiming success.

## Requirements

- FR-001: `requiredChecks` must include every active check that runs on pull requests.
- FR-002: Delivery docs must state that `main` is PR-only.
- FR-003: Delivery docs must state that all required PR checks must pass before merge.

## Success Criteria

- SC-001: Local preflight passes with the updated required check list and feature memory.
- SC-002: The branch-protection source of truth can be applied without additional repo file changes when GitHub enables branch protection for this repository.

## Assumptions

- The active required PR check contexts are the job names observed in recent PR checks: `baseline-checks`, `guard`, `AI Review`, and `osv-scan`.
