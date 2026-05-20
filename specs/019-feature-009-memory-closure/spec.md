# Spec: Feature 009 Process Memory Closure

## Analyst Intake

- Source request: `feature-request.md`.
- Active feature folder: `specs/019-feature-009-memory-closure/`.
- Assigned worktree: `/Users/chap/devel/cabadrive-019-feature-009-memory-closure`.
- Assigned branch: `codex/019-feature-009-memory-closure`.
- This Architect pass may create or update only `spec.md`, `plan.md`, and `tasks.md` in this feature folder.

## Baseline

Feature `009-image-metadata-learning-support` landed through PR #63 and is present on `main` at merge commit `78e0176e361eeea583dd797296bfa994b3f1f695`.

The product/content/validator work is understood to be complete based on the merged PR, Review Agent activity, and prior Orchestrator audit. The remaining defect is durable process memory: `specs/009-image-metadata-learning-support/tasks.md` still has unchecked final readiness/review tasks that should be closed or explicitly dispositioned after the merge.

Known unchecked feature 009 items to audit:

- T098-T102
- T109-T111
- T120
- T155
- T166
- T175
- T176

## Goal

Make feature 009 durable process memory truthful after PR #63 by requiring an Implementation Agent to update only process-memory evidence and checkboxes for fulfilled readiness/review tasks, using exact evidence from current `main`, PR #63, Review Agent output, and local read-only/normal validation commands.

## Scope

In scope:

- Audit the listed unchecked tasks in `specs/009-image-metadata-learning-support/tasks.md` against current `main` and PR #63.
- Mark feature 009 readiness/review tasks complete only when there is concrete evidence that the task was fulfilled before or by merge.
- Add concise evidence next to or near the closed task group so future agents can understand why each item was closed after the fact.
- Record any task that cannot be honestly closed as still open, not applicable, or requiring follow-up, with a reason.
- Update `specs/019-feature-009-memory-closure/tasks.md` while executing this follow-up.
- Create a small PR containing process-memory/spec documentation changes only.

Out of scope:

- Product code changes.
- Content shard, generated index, validation script, test, runtime, Docker, or UI changes.
- Reopening feature 009 image metadata, translation, explanation, or validator implementation.
- Editing old feature memory except `specs/009-image-metadata-learning-support/tasks.md`.
- Editing durable docs outside `specs/019-feature-009-memory-closure/` and the single feature 009 tasks file.
- Direct commits to `main`, merge mechanics, or PR #63 modification.

## Requirements

### Evidence Requirements

Implementation must collect exact evidence before changing feature 009 task state. Acceptable evidence includes:

- `git log origin/main --oneline --decorate --max-count=...` showing PR #63 merge commit on `main`.
- `git show --stat --oneline 78e0176e361eeea583dd797296bfa994b3f1f695` or equivalent merge-commit inspection.
- `gh pr view 63 --repo cucumberfalse/cabadrive --json number,title,state,isDraft,mergeCommit,headRefName,baseRefName,mergedAt,statusCheckRollup,url`.
- `gh pr checks 63 --repo cucumberfalse/cabadrive`.
- Review Agent evidence from PR #63 comments/reviews or check output, especially evidence that the AI Review check completed successfully on the merge head and no blockers remained.
- Local audit commands against the current branch/main content when needed, for example content quality validation and task-state inspection.

Implementation must quote or summarize exact command outputs in process memory. It must not replace evidence with an AI-written conclusion.

### Closure Rules

- T099 may be checked only if required checks and AI Review are verified green on the PR #63 head/merge-ready state.
- T100 may be checked only if PR #63 merge state or GitHub metadata proves no unresolved merge conflicts remained at merge.
- T101 may be checked only if Review Agent/PR evidence proves no blocking findings remained at merge.
- T102 may be checked only if PR #63 was not draft before merge and prior readiness/review gates were complete or explicitly satisfied by merge evidence.
- T109-T111 may be checked only if Review Agent execution and contract behavior are evidenced from PR #63.
- T120, T155, T166, T175, and T176 may be checked only if Review Agent or Orchestrator evidence supports the specific review/sampling assertions, not merely because PR #63 merged.
- T098 may be checked only if Docker/runtime smoke evidence exists or if Implementation records a precise not-applicable disposition for post-merge process-memory closure. A silent check is not allowed.

### Negative Scenarios

The follow-up fails if it:

- changes product code, content, validators, generated files, tests, or docs outside the allowed process-memory scope;
- marks a feature 009 task complete without evidence tied to PR #63, current `main`, Review Agent output, or validation command output;
- hides an unverified task by rewriting or deleting it;
- claims new product coverage or new review work was performed when only process-memory closure happened;
- leaves `specs/009-image-metadata-learning-support/tasks.md` with unchecked fulfilled readiness/review items after the audit.

## Acceptance Criteria

- `specs/009-image-metadata-learning-support/tasks.md` has no unchecked readiness/review item from the listed target set when that item was fulfilled by PR #63.
- Any target item not closed is explicitly dispositioned with evidence and a follow-up reason.
- Process memory cites PR #63, merge commit `78e0176e361eeea583dd797296bfa994b3f1f695`, check/review evidence, and local audit commands used.
- The PR diff is limited to `specs/009-image-metadata-learning-support/tasks.md` plus `specs/019-feature-009-memory-closure/` task tracking.
- Local validation appropriate for a process-memory-only change passes, including at least task-state audit, `git diff --check`, and any repository preflight/check command the Implementation Agent records as necessary.
- A Review Agent confirms no blocking findings for the closure PR.
