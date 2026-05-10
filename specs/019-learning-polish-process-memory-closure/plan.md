# Plan: Learning Polish Process Memory Closure

## Implementation Strategy

Use one narrow process-memory PR on branch `codex/019-learning-polish-process-memory-closure`. The Implementation Agent updates feature `013` task state only after re-verifying current `main` and PR #69 facts, then records feature `019` implementation evidence in the active tasks file.

No product files are part of this plan.

## Slice 1: Setup And Fact Verification

1. Confirm worktree and branch:
   - `/Users/chap/devel/cabadrive-019-learning-polish-process-memory-closure`
   - `codex/019-learning-polish-process-memory-closure`
2. Run `git fetch origin`.
3. Confirm `origin/main` is current and contains PR #69 merge commit `6562410`.
4. Inspect PR #69 merged state with `gh pr view 69` or GitHub connector metadata.
5. Inspect `specs/013-learning-content-ui-polish/tasks.md` T096-T112 before editing.
6. Record all setup and fact evidence in `specs/019-learning-polish-process-memory-closure/tasks.md`.

## Slice 2: Feature 013 Closure Update

Update only `specs/013-learning-content-ui-polish/tasks.md` to:

- mark T096-T112 complete or otherwise explicitly reconciled;
- add a nearby process-memory note such as `Feature 019 post-merge closure`;
- state that closure happened after PR #69 merged, via feature `019`;
- cite the verified facts for PR #69 review, required checks, final Architect validation, final Analyst validation, and post-merge latest-main validation;
- preserve existing feature `013` implementation evidence, dead ends, known issues, and feedback dispositions.

Preferred wording pattern:

```text
Feature 019 post-merge closure, 2026-05-10: these items were reconciled after PR #69 had already merged. This note preserves chronology and does not claim the original 013 implementation agent checked them before merge.
```

## Slice 3: Feature 019 Process Memory

Update `specs/019-learning-polish-process-memory-closure/tasks.md` during implementation to record:

- files changed;
- verification commands and outcomes;
- allowed diff-scope evidence;
- no product/content/test/runtime changes;
- known issues or explicit none;
- Implementation Agent feedback, if any.

If Implementation finds a real product or validation gap, stop and record it as feedback for Orchestrator/Architect. Do not expand this feature into product work.

## Verification Plan

Required local checks:

```bash
git status --short --branch
git diff --name-only origin/main...HEAD
git diff --check
node scripts/check-feature-memory.mjs origin/main HEAD
pnpm run preflight
```

`pnpm run preflight` remains required by repository workflow before push. If it cannot run because of an environment issue, the blocker must be recorded exactly with command output summary and the Orchestrator must decide whether to proceed.

Recommended targeted fact checks:

```bash
git merge-base --is-ancestor 6562410 origin/main
gh pr view 69 --json number,state,mergedAt,mergeCommit,headRefOid,url
```

Use the GitHub connector if `gh` is unavailable or unauthenticated.

## Review Plan

Review Agent reviews this as a process-memory-only PR:

- confirm role boundaries and complete feature memory;
- confirm only allowed process-memory files changed;
- confirm the post-merge closure note is accurate and evidence-backed;
- confirm feature `013` chronology was preserved;
- confirm no learner-facing behavior or content changed.

## Risk Management

- Risk: Marking old tasks complete could look like retroactive pre-merge completion.
  - Mitigation: require explicit feature `019` post-merge wording.
- Risk: Implementation may discover an actual product gap during verification.
  - Mitigation: stop and route as Architect/Orchestrator feedback instead of changing product files.
- Risk: `origin/main` advances during work.
  - Mitigation: fetch before final verification and re-check diff scope before push.

## Rollback

If the closure wording is wrong or evidence is insufficient, revert only the feature `013` task-memory update and active feature `019` implementation task updates on this branch. Do not touch product files or `main`.

## Handoff To Orchestrator

After Architect artifacts are complete, Orchestrator may assign Implementation Agent in this same isolated worktree/branch because the Analyst-created latest-main intake handoff continued through Architect planning and this feature has one narrow implementation slice.
