# Spec: Learning Polish Process Memory Closure

## Goal

Close the durable-process-memory mismatch discovered after PR #69 merged: `specs/013-learning-content-ui-polish/tasks.md` still shows final review and PR-readiness tasks T096-T112 as unchecked even though PR #69 was merged after review, checks, final validations, and post-merge latest-main verification.

This feature records that closure accurately and narrowly. It must not change learner-facing behavior, content, tests, runtime files, or unrelated feature memory.

## Scope

In scope:

- Verify current `main` and PR #69 facts before editing any process memory.
- Update `specs/013-learning-content-ui-polish/tasks.md` so T096-T112 no longer contradict the merged PR #69 outcome.
- Preserve chronology by explicitly marking the update as a post-merge closure performed through feature `019`, not as work originally completed by the feature `013` implementation agent before merge.
- Include evidence for PR #69 merge readiness and post-merge main validation in durable process memory.
- Keep active feature `019` tasks current with implementation and verification evidence.

Out of scope:

- Product UI changes.
- Content JSON changes.
- Test changes.
- Durable product docs changes outside process memory.
- Re-reviewing or rewriting the learner-facing implementation from PR #69.
- Editing unrelated feature folders.
- Changing workflow, branch protection, CI, scripts, or GitHub configuration.

## User Story

As a future Cabadrive agent reading feature memory, I need feature `013` to reflect the actual PR #69 closure state so I do not incorrectly reopen completed review gates or assume the learner-facing work was merged without review, checks, or final validation.

## Acceptance Criteria

1. `specs/013-learning-content-ui-polish/tasks.md` has T096-T112 reconciled with the actual PR #69 post-merge facts.
2. The reconciliation states that the closure was performed post-merge via feature `019`.
3. The update preserves feature `013` chronology and does not imply that unchecked tasks were completed before merge by the original `013` implementation agent.
4. Evidence is recorded for:
   - PR #69 merge state and merge commit on `main`.
   - no blocking review findings at merge closure.
   - required checks green for the relevant PR head.
   - final Architect validation PASS.
   - final Analyst validation PASS.
   - post-merge latest-main validation of the learner-facing outcome.
5. The active feature `019` process memory records implementation verification, known issues or explicit none, and any Implementation Agent feedback.
6. The diff contains no learner-facing product, content, test, runtime, CI, or unrelated documentation changes.
7. Local verification confirms the repository process-memory gate and diff-scope checks pass.

## Negative Scenarios

- Do not silently flip T096-T112 to checked without a post-merge feature `019` note and evidence.
- Do not rewrite feature `013` history as though all final review tasks were checked before PR #69 merged.
- Do not remove existing feature `013` dead ends, known issues, verification evidence, or feedback dispositions.
- Do not edit source code, content data, generated assets, tests, or product documentation.
- Do not add new learner-facing acceptance claims beyond the PR #69 facts already validated on `main`.
- Do not rely only on memory from this chat; Implementation must re-check current repository and PR/main facts.

## Functional Requirements

- FR-001: Implementation must start from complete feature `019` memory: `feature-request.md`, `spec.md`, `plan.md`, and `tasks.md`.
- FR-002: Implementation must verify the worktree is on branch `codex/019-learning-polish-process-memory-closure` and is based on current `origin/main`.
- FR-003: Implementation must inspect the current unchecked T096-T112 state before editing.
- FR-004: Implementation must update `specs/013-learning-content-ui-polish/tasks.md` with a clearly labeled "Feature 019 post-merge closure" note or equivalent process-memory section.
- FR-005: T096-T112 may be marked complete only with adjacent or nearby evidence that ties each cluster to the actual post-merge facts.
- FR-006: Implementation must keep `specs/019-learning-polish-process-memory-closure/tasks.md` current while performing the closure.
- FR-007: Implementation must not touch files outside:
  - `specs/013-learning-content-ui-polish/tasks.md`
  - `specs/019-learning-polish-process-memory-closure/tasks.md`
- FR-008: If verification discovers a product or validation gap instead of only stale process memory, Implementation must stop and record feedback for Orchestrator/Architect disposition rather than expanding this feature.

## Verification Requirements

Implementation must record command evidence for:

- `git status --short --branch`
- `git fetch origin`
- a current-head check showing `origin/main` contains PR #69 merge commit `6562410` or the equivalent current merge commit reference for PR #69
- PR #69 merged-state evidence using `gh pr view 69` or the GitHub connector when available
- `git diff --name-only origin/main...HEAD` showing only allowed process-memory files
- `git diff --check`
- `node scripts/check-feature-memory.mjs origin/main HEAD`
- `pnpm run preflight` unless a precise environment blocker is recorded

## Review Requirements

Review Agent must verify:

- Feature `019` has complete memory before implementation changes.
- The diff is limited to the allowed process-memory files.
- `specs/013-learning-content-ui-polish/tasks.md` preserves chronology and clearly labels the closure as post-merge via feature `019`.
- T096-T112 are closed or otherwise reconciled with explicit evidence, not merely checked off.
- No learner-facing product behavior, content, tests, or docs were changed.
- Feature `019` tasks include current implementation evidence and no unresolved feedback.

## Architectural Decisions

- This is a process-memory closure feature, not a product fix.
- The correct source of truth is the combination of current `origin/main`, PR #69 GitHub metadata, existing feature `013` evidence, and post-merge latest-main validation.
- The Implementation Agent may update active feature `019` process memory because keeping `tasks.md` current is part of the repository protocol.
- No new abstraction, script, validator, or durable product documentation update is warranted for this narrow closure.
