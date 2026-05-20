# Plan: Feature 009 Process Memory Closure

## Summary

This is a process-memory closure follow-up. The implementation should not touch product behavior or feature 009 content. It should audit the remaining unchecked final readiness/review tasks in feature 009 against the already merged PR #63 and current `main`, then update `specs/009-image-metadata-learning-support/tasks.md` so the completion contract is truthful.

If evidence proves an item was fulfilled, close it with the exact evidence. If evidence is missing or ambiguous, leave it open or mark it with an explicit not-closed/not-applicable disposition. The purpose is accurate durable memory, not retroactive optimism.

## Technical Context

- Repository: `cucumberfalse/cabadrive`.
- Feature 009 folder: `specs/009-image-metadata-learning-support/`.
- Feature 019 folder: `specs/019-feature-009-memory-closure/`.
- PR #63: `[codex] Implement image metadata learning support`.
- PR #63 merge commit on `main`: `78e0176e361eeea583dd797296bfa994b3f1f695`.
- Current known PR #63 checks to verify: `baseline-checks`, `docker-validation`, `guard`, `AI Review`, `osv-scan`.

## Constitution Check

- Spec-first: yes; Analyst intake exists and this Architect pass creates implementation requirements before repository-changing implementation.
- Testable boundaries: yes; the implementation is documentation/process-memory only and must be verified by read-only audits plus local normal validation as needed.
- Test-first bias: not applicable to product tests because no behavior changes are planned; command-based evidence is required instead.
- Supervised verification: yes; all acceptance criteria require concrete evidence.
- PR-only workflow: yes; closure changes must land through a new PR.
- One worktree per task: yes; Implementation Agent must use the assigned isolated worktree/branch.
- Process memory: yes; both feature 009 task state and feature 019 execution state must remain current.
- Simplicity: yes; no new scripts, schemas, or abstractions are needed unless the audit reveals a real missing product gate.

## Implementation Approach

1. Confirm branch/worktree context and preserve unrelated work.
2. Inspect `specs/009-image-metadata-learning-support/tasks.md` target items and current process-memory evidence.
3. Verify PR #63 merge and check state using GitHub and local git metadata.
4. Inspect Review Agent evidence for the target review tasks.
5. Run only read-only/normal local validation needed to support the closure claim.
6. Update `specs/009-image-metadata-learning-support/tasks.md` target checkboxes and evidence notes.
7. Update `specs/019-feature-009-memory-closure/tasks.md` with implementation evidence.
8. Verify the diff is limited to allowed process-memory files.
9. Open a small PR and request Review Agent confirmation.

## Evidence Commands

Implementation should prefer these commands, adjusting only when the environment requires an equivalent:

```sh
git status --short --branch
git log origin/main --oneline --decorate --max-count=20
git show --stat --oneline --decorate --max-count=1 78e0176e361eeea583dd797296bfa994b3f1f695
gh pr view 63 --repo cucumberfalse/cabadrive --json number,title,state,isDraft,mergeCommit,headRefName,baseRefName,mergedAt,statusCheckRollup,url
gh pr checks 63 --repo cucumberfalse/cabadrive
rg -n "T098|T099|T100|T101|T102|T109|T110|T111|T120|T155|T166|T175|T176" specs/009-image-metadata-learning-support/tasks.md
git diff --check
```

If Review Agent evidence is not clear from `gh pr view`, Implementation should inspect PR #63 comments/reviews through GitHub tooling and record the exact artifact names, dates, URLs, or comment/review identifiers used.

## Task Disposition Guidance

- Close tasks as completed when evidence shows they were fulfilled before PR #63 merged.
- Use a short parenthetical evidence note for individual tasks when practical.
- Add a process-memory subsection for the closure audit with command outputs, PR URL, merge commit, checks, Review Agent conclusion, and any caveats.
- Do not rewrite historical process-memory decisions except to append closure evidence.
- Do not remove task IDs.
- Do not invent Review Agent sampling evidence. For T120, T155, T166, T175, and T176, require review/audit proof specific to those claims.
- If T098 has no direct Docker smoke evidence, record whether it was satisfied by `docker-validation`/runtime checks or explicitly not applicable because this closure PR has no runtime-affecting changes. The distinction must be visible.

## Validation Matrix

Required for the closure PR:

- Target task-state audit shows every fulfilled target item is checked and every unfulfilled target item is explicitly dispositioned.
- `git diff --check` passes.
- `git status --short`/diff review proves no product, content, validator, generated index, test, runtime, or unrelated durable-doc file changed.
- GitHub PR checks for the closure PR are green.
- Review Agent confirms no blockers.

Optional unless the Implementation Agent finds a real product coverage concern:

- `pnpm run validate:content`
- `pnpm run validate:content:quality`
- `pnpm run preflight`
- Docker smoke commands

If optional commands are run, exact outputs must be recorded. If a real product coverage gap is found, Implementation must stop and route the gap back to Orchestrator/Architect rather than silently expanding this follow-up.

## Risks

- Closing a task from merge status alone could erase useful review history. Mitigation: require task-specific evidence for review/sampling items.
- PR #63 evidence may be distributed across checks, comments, reviews, and process memory. Mitigation: cite concrete commands and artifacts.
- A process-memory-only PR can drift into product cleanup. Mitigation: allowed diff is explicitly constrained.

## Handoff

Implementation Agent should perform the audit and memory update in one small branch/PR. Review Agent should review the resulting diff primarily for truthfulness, evidence quality, scope control, and compliance with feature 009/019 role boundaries.
