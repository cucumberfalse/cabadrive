# Plan: Feature 009 Process Memory Consistency

## Summary

Implement one tiny process-memory PR. Replace the stale T121 wording in `specs/009-image-metadata-learning-support/tasks.md` that says T098 remains open, because T098 is already checked and closed with Docker-smoke evidence. Record the supporting PR #93/#94/#97/#99 and fresh-main audit evidence, then verify the repository's content/index/overlay/unit gates still pass.

This Architect pass creates only feature `022` planning artifacts. The Architect must not edit feature 009, product code, tests, runtime files, durable docs, commits, pushes, PRs, or review state.

## Technical Context

- Feature 009 owns image metadata, Russian learning support, validators, generated indexes, overlay semantics handoff, and related readiness process memory.
- Feature 009 has already merged and later closure work checked T098 with branch-owned Docker-smoke evidence.
- Current contradiction:
  - T098 is checked and closed.
  - T121 is checked but says T098 `remains open with explicit Docker-smoke disposition`.
- Later process-memory and runtime-isolation PRs support the closed state:
  - PR #93 closed/recorded T098 Docker-smoke closure.
  - PR #94 fixed Docker smoke isolation and recorded runtime evidence.
  - PR #97 closed final 010/019 process gates after PR #93.
  - PR #99 closed feature 021 process gates after PR #94.
- Fresh main audit confirms current `origin/main` still has the stale T121 sentence while T098 is checked.

## Constitution Check

- Spec-first: yes; Analyst intake exists and this plan creates `spec.md`, `plan.md`, and `tasks.md` before implementation.
- Testable boundaries: yes; verification uses exact `rg`, GitHub PR, feature-memory, and validation commands.
- Test-first bias: not applicable to product tests because no behavior changes are allowed; existing validation gates must still pass.
- Supervised verification: yes; acceptance requires command evidence, not only a written summary.
- PR-only workflow: yes; implementation must land through the assigned branch/PR.
- One worktree per task: yes; use `/Users/chap/devel/cabadrive-022-feature-009-memory-consistency` only.
- Process memory: yes; feature `022` tasks must record decisions, evidence, dead ends, known issues, and feedback disposition.
- Simplicity: yes; one sentence replacement plus evidence notes is enough.

## Implementation Approach

1. Confirm worktree and branch:

```bash
git status --short --branch
```

2. Inspect the current contradiction:

```bash
rg -n "T098|T121|remains open|remains intentionally open" specs/009-image-metadata-learning-support/tasks.md
```

3. Refresh PR and main evidence:

```bash
git show -s --format='%H%n%s%n%cI' origin/main
gh pr view 93 --repo cucumberfalse/cabadrive --json number,title,state,isDraft,mergedAt,mergeCommit,headRefName,baseRefName,headRefOid,url,statusCheckRollup
gh pr view 94 --repo cucumberfalse/cabadrive --json number,title,state,isDraft,mergedAt,mergeCommit,headRefName,baseRefName,headRefOid,url,statusCheckRollup
gh pr view 97 --repo cucumberfalse/cabadrive --json number,title,state,isDraft,mergedAt,mergeCommit,headRefName,baseRefName,headRefOid,url,statusCheckRollup
gh pr view 99 --repo cucumberfalse/cabadrive --json number,title,state,isDraft,mergedAt,mergeCommit,headRefName,baseRefName,headRefOid,url,statusCheckRollup
```

4. Edit only:

```text
specs/009-image-metadata-learning-support/tasks.md
specs/022-feature-009-memory-consistency/tasks.md
```

5. In feature 009 T121, remove or replace only the stale T098-open wording. A suitable replacement is:

```text
T098 is outside the original T121 blocking condition and is now closed by the later feature 019 Docker-smoke follow-up recorded in T098 and PR #93, with subsequent Docker isolation/process-gate evidence from PR #94, PR #97, and PR #99.
```

Implementation may choose a shorter sentence if it preserves the same facts and avoids broad rewriting.

6. Add a concise feature `022` evidence note to `tasks.md` with the exact command outputs or summarized stable identifiers from PR #93/#94/#97/#99 and the fresh main audit.

7. Run verification and record evidence.

## Expected Changed Files

Allowed implementation files:

```text
specs/009-image-metadata-learning-support/tasks.md
specs/022-feature-009-memory-consistency/tasks.md
```

No other file should change. If a command such as dependency installation creates local ignored files, do not commit them and record the situation only if it affects verification.

## Verification Plan

Required local checks:

```bash
git status --short --branch
rg -n "T098|T121|remains open|remains intentionally open" specs/009-image-metadata-learning-support/tasks.md
rg -n "T098 remains open|T098 remains intentionally open|remains open with explicit Docker-smoke disposition" specs/009-image-metadata-learning-support/tasks.md
rg -n "^- \\[ \\] T(098|099|100|101|102|109|110|111|114|115|116|117|118|119|120|121|163|164|165|166)" specs/009-image-metadata-learning-support/tasks.md
node scripts/content-shards.mjs --check-indexes
pnpm run validate:content
pnpm run validate:content:quality
pnpm run validate:overlays
pnpm run test
node scripts/check-feature-memory.mjs --worktree
git diff --check
git diff --name-only
```

Expected results:

- stale-wording search returns no output;
- unchecked readiness/review target task audit returns no output;
- content indexes are fresh;
- structural content validation passes;
- content quality validation passes;
- overlay validation passes;
- unit tests pass;
- feature-memory gate passes;
- diff check passes;
- changed files are only the two allowed process-memory files.

If a validation command fails for an environmental reason, the Implementation Agent must record the exact blocker and still run all unaffected checks. Product/code fixes are not allowed under this feature.

## Review Plan

Review Agent should treat this as process-memory truthfulness work:

- inspect the T098 and T121 lines before and after;
- verify the stale phrase is gone;
- verify T098 and T121 remain checked;
- verify the correction does not rewrite unrelated feature 009 history;
- verify feature `022` process memory records PR #93/#94/#97/#99 and fresh-main evidence;
- verify the diff is process-memory-only;
- verify required checks and local evidence are present.

## Risks And Mitigations

- Risk: The edit overcorrects and erases useful PR #63 readiness history.
  - Mitigation: replace only the stale T098 sentence and preserve T121's original readiness evidence.
- Risk: Future agents still read T098 as open from another phrase.
  - Mitigation: require exact `rg` searches for stale wording and open-task contradictions.
- Risk: A tiny process-memory PR skips validation.
  - Mitigation: require content index, content, quality, overlay, unit, feature-memory, and diff checks as appropriate to prove current main remains healthy.
- Risk: Parallel agents have unrelated work in other worktrees.
  - Mitigation: use only the assigned worktree and do not touch sibling branches, worktrees, containers, or PRs.

## Handoff

Orchestrator may assign one Implementation Agent to this same isolated worktree and branch for the single process-memory PR slice. Implementation must start from complete feature `022` memory and keep `tasks.md` current.
