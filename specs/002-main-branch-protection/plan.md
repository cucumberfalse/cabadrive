# Plan: Main Branch Protection

## Summary

Update the repository branch-protection source of truth so `main` is PR-only and every active PR gate is listed as a required check.

## Technical Context

- runtime: GitHub branch protection applied through `scripts/apply-branch-protection.mjs`
- dependencies: GitHub CLI with repository admin access
- product paths: `docs_project/`
- data changes: `.unicorn-hub/config.json` `requiredChecks`

## Scope Boundaries

- in scope: required check configuration and process documentation for `main`
- out of scope: changing repository visibility or GitHub billing plan

## Constitution Check

- Spec-first: this feature-memory folder records the requested policy change.
- Testable boundaries: local preflight verifies config and docs remain structurally valid.
- PR-only: this change is prepared on a branch for review before merge.
- Simplicity: reuse the existing branch-protection script and config.
- Deployability: enforcement is applied separately through the GitHub branch protection API when available.

## Complexity Tracking

No new abstraction is added; the existing config list is extended with the missing PR check.

## Verification

| Acceptance criterion | Evidence |
| --- | --- |
| AC-001 | `.unicorn-hub/config.json` includes all active PR check contexts: `baseline-checks`, `guard`, `AI Review`, and `osv-scan`. |
| AC-002 | `AGENTS.md`, `README.md`, and `docs_project/project/devops/ai-pr-workflow.md` state that `main` changes must land through PRs. |

Negative scenario evidence:

- GitHub branch protection API returned HTTP 403 for the private repository on the current plan, so the repo change documents the required config but cannot activate enforcement until GitHub enables branch protection for this repository.

## Risks

- Direct pushes to `main` cannot be technically blocked while GitHub branch protection is unavailable for this private repository; mitigation is to apply the existing script after upgrading the plan or making the repository public.
