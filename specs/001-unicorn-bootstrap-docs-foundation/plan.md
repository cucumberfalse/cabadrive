# Plan: Unicorn Bootstrap Docs Foundation

## Summary

Use Unicorn Hub bootstrap to install the portable workflow baseline, then replace placeholder content with Cabadrive-specific durable documentation derived from `docs/specify/`.

## Technical Context

- runtime: Node.js scripts plus markdown workflow artifacts.
- dependencies: pnpm for local script orchestration.
- product paths: root workflow files, `.github/`, `.specify/`, `.unicorn-hub/`, `docs_project/`, `scripts/`, `specs/`.
- data changes: documentation and process configuration only.

## Scope Boundaries

- in scope: bootstrap installation, docs adaptation, workflow config adaptation, feature memory initialization, preflight validation.
- out of scope: UI code, Docker runtime implementation, content dataset generation, deployment release setup.

## Constitution Check

- Spec-first: yes; feature memory is created before implementation completion.
- Testable boundaries: yes; preflight and placeholder checks are executable evidence.
- PR-only: yes; all changes are branch/PR scoped.
- Simplicity: yes; no new runtime abstractions introduced.
- Deployability: neutral; no deploy behavior changes.

## Complexity Tracking

No new code abstraction was introduced. Changes are process bootstrap and documentation baseline setup.

## Verification

| Acceptance criterion | Evidence |
| --- | --- |
| AC-001 | `node /Users/chap/devel/unicorn-hub/scripts/bootstrap-repo.mjs --source /Users/chap/devel/unicorn-hub --profile generic --project-name "Cabadrive"` output shows installed files. |
| AC-002 | Manual content review of root docs and `docs_project/` confirms Cabadrive-specific replacements. |
| AC-003 | `docs_project/` now includes `project-idea.md`, `marketing/go-to-market.md`, `project/frontend/frontend-docs.md`, `project/backend/backend-docs.md`, `project/feature-inventory.md`, and `screens/learning-and-exam-flows.md`. |
| AC-004 | `pnpm run preflight` passes. |

Negative scenario evidence:

- Running `pnpm run preflight` before feature-memory files existed failed with the expected feature-memory gate message.

## Risks

- Risk: selecting `generic` may require additional command/profile refinement once runtime scaffolding is added.
- Mitigation: keep profile explicit in `.unicorn-hub/config.json` and update in a follow-up feature when runtime implementation starts.
