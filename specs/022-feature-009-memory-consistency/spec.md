# Spec: Feature 009 Process Memory Consistency

## Analyst Intake

- Source request: `feature-request.md`.
- Active feature folder: `specs/022-feature-009-memory-consistency/`.
- Assigned worktree: `/Users/chap/devel/cabadrive-022-feature-009-memory-consistency`.
- Assigned branch: `codex/022-feature-009-memory-consistency`.
- This Architect pass may create or update only `spec.md`, `plan.md`, and `tasks.md` in this feature folder.

## Goal

Make feature `009-image-metadata-learning-support` process memory internally consistent after T098 closure. The implementation must remove or replace stale wording in `specs/009-image-metadata-learning-support/tasks.md` that says T098 remains open, because T098 is now checked and closed with branch-owned Docker smoke evidence.

This is a tiny process-memory correction. It must not change product code, content, generated indexes, validators, tests, Docker/runtime files, durable docs, or unrelated specs.

## Baseline

Current `origin/main` audit context:

- `origin/main` is at `5170ec652e1c026b19319fe808824f4eb316d49f`, `[codex] Add orchestrator cleanup governance (#67)`, dated `2026-05-10T20:24:23-03:00`.
- Feature 009 T098 is checked and records successful Docker smoke evidence from branch `codex/019-feature-009-docker-smoke-closure`.
- Feature 009 T121 is checked but still ends with stale wording: `T098 is not part of the T121 blocking condition and remains open with explicit Docker-smoke disposition.`
- Feature 009 process memory later records that the same Docker-smoke follow-up closes T098 with branch-owned runtime smoke evidence.

Relevant merged PR evidence to cite:

- PR #93, `[codex] Record feature 009 T098 Docker smoke blocker`, merged `2026-05-10T19:41:56Z`, head `d4630809de880dfddb7a5a3ea71ac052f224e172`, merge commit `c6076e580f2c59169957800fd2c80eacac3ca328`, with required checks green.
- PR #94, `[codex] Isolate Docker smoke runtime`, merged `2026-05-10T19:50:44Z`, head `7627b74264acf1ff592db7be94db4d29336b49cb`, merge commit `4cc2bb735e1a92151ca3aa9001c82ae0f65c730f`, with required checks green and Docker isolation evidence.
- PR #97, `Close final 010 and 019 process memory gates`, merged `2026-05-10T19:53:46Z`, head `30fd4b1803192e6416c6784a468d5fb6484fb65a`, merge commit `f5fcb1602885022bb60b412f90bf290d51674c76`, with required checks green.
- PR #99, `[codex] Close feature 021 process gates`, merged `2026-05-10T20:03:27Z`, head `0b3b6da43a981ff67ec63bb246bb6870679cb64e`, merge commit `55d196a8762fc156520f045a48c0cb25ee83d569`, with required checks green.

## Scope

In scope:

- Update `specs/009-image-metadata-learning-support/tasks.md` only as needed to remove or replace the stale T121 claim that T098 remains open.
- Preserve the historical fact that T098 was outside the original T121 blocking condition, if useful.
- Record that T098 is now closed with PR #93 Docker-smoke closure evidence and later PR #94/#97/#99/fresh-main audit support.
- Keep `specs/022-feature-009-memory-consistency/tasks.md` current during implementation.
- Create one small PR containing process-memory changes only.

Out of scope:

- Product UI, app runtime, Docker implementation, validators, tests, generated content indexes, image metadata, translations, explanations, overlay data, or content evidence changes.
- Durable docs outside process memory.
- Reopening feature 009 content, validator, overlay, or runtime implementation work.
- Rewriting broad historical process memory when a targeted sentence replacement is enough.
- Staging, committing, pushing, reviewing, or merging by the Architect.

## Functional Requirements

- FR-001: `specs/009-image-metadata-learning-support/tasks.md` must no longer say or imply that T098 remains open or remains intentionally open.
- FR-002: T098 must remain checked and closed.
- FR-003: T121 must remain checked and must continue to describe the original PR #63 readiness blocking condition accurately.
- FR-004: The corrected wording must make clear that T098 is now closed by later Docker-smoke evidence, or must remove the stale T098 sentence entirely while relying on adjacent T098 evidence.
- FR-005: Process memory must cite evidence from PR #93, PR #94, PR #97, PR #99, and a fresh main audit.
- FR-006: The implementation diff must be limited to `specs/009-image-metadata-learning-support/tasks.md` and `specs/022-feature-009-memory-consistency/tasks.md`.
- FR-007: No product code, content data, generated indexes, validators, tests, runtime files, durable docs, or unrelated feature memory may change.

## Acceptance Criteria

1. Given feature 009 process memory is searched, there is no stale contradiction matching `T098 remains open` or `T098 remains intentionally open`.
2. Given feature 009 readiness tasks are audited, T098 and the relevant readiness/review target tasks remain checked.
3. Given T121 is read, it no longer contradicts T098's closed state.
4. Given T098 is read, its Docker-smoke closure evidence remains intact.
5. Given process memory is read, evidence is recorded from PR #93/#94/#97/#99 plus the fresh `origin/main` audit.
6. Given the diff is inspected, changes are limited to process memory and exclude product code/content/validators/tests/runtime/durable-doc changes.
7. Given local verification runs, stale-wording search, target task-state audit, content index check, content validation, content quality validation, overlay validation, unit tests, feature-memory gate, and `git diff --check` pass or exact environment blockers are recorded.

## Negative Scenarios

- Replacing the stale sentence with another phrase that still implies T098 is open is not acceptable.
- Unchecking, deleting, or weakening T098 closure evidence is not acceptable.
- Deleting the T121 readiness history instead of making it truthful is not acceptable.
- Editing content shards, generated indexes, validators, app code, tests, Docker files, or durable docs is not acceptable.
- Broadly rewriting feature 009 memory unrelated to the T098/T121 contradiction is not acceptable.
- Recording only an AI conclusion without command or PR evidence is not acceptable.

## Verification Requirements

Implementation must record command evidence for:

```bash
git status --short --branch
git show -s --format='%H%n%s%n%cI' origin/main
gh pr view 93 --repo cucumberfalse/cabadrive --json number,title,state,isDraft,mergedAt,mergeCommit,headRefName,baseRefName,headRefOid,url,statusCheckRollup
gh pr view 94 --repo cucumberfalse/cabadrive --json number,title,state,isDraft,mergedAt,mergeCommit,headRefName,baseRefName,headRefOid,url,statusCheckRollup
gh pr view 97 --repo cucumberfalse/cabadrive --json number,title,state,isDraft,mergedAt,mergeCommit,headRefName,baseRefName,headRefOid,url,statusCheckRollup
gh pr view 99 --repo cucumberfalse/cabadrive --json number,title,state,isDraft,mergedAt,mergeCommit,headRefName,baseRefName,headRefOid,url,statusCheckRollup
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

For the stale-wording `rg`, success means no output. For the unchecked target task audit, success means no output for the target readiness/review task set.

## Review Requirements

Review Agent must verify:

- Complete feature `022` memory exists before implementation changes.
- Architect, Implementation Agent, and Review Agent role boundaries were followed.
- The stale T098-open contradiction is gone from feature 009 process memory.
- T098 and T121 remain checked and truthful.
- Evidence from PR #93/#94/#97/#99 and fresh main audit is present.
- The diff is limited to allowed process-memory files.
- No product/content/validator/test/runtime/durable-doc changes are included.
- Verification evidence includes the required stale-wording search, checked-task audit, content/index/overlay/unit checks, feature-memory gate, and diff checks.

## Architectural Decisions

- Prefer minimal sentence replacement over broad historical rewriting.
- Keep T121 focused on the original PR #63 readiness gate, while making its T098 note reflect current closed state.
- Record later closure evidence where future Orchestrators will look first: feature 009 tasks and feature 022 implementation process memory.
- Treat this as process-memory-only; no new tests or scripts are warranted.
