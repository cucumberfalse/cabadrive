# Tasks: Feature 009 Process Memory Consistency

## Architect Planning Setup

- [x] T001 Confirm active feature folder is `specs/022-feature-009-memory-consistency/`.
- [x] T002 Confirm assigned worktree is `/Users/chap/devel/cabadrive-022-feature-009-memory-consistency`.
- [x] T003 Confirm assigned branch is `codex/022-feature-009-memory-consistency`.
- [x] T004 Read `AGENTS.md`.
- [x] T005 Read `specs/022-feature-009-memory-consistency/feature-request.md`.
- [x] T006 Inspect feature 009 T098/T121 wording read-only.
- [x] T007 Inspect nearby process-memory planning style.
- [x] T008 Inspect PR #93/#94/#97/#99 metadata read-only.
- [x] T009 Inspect fresh `origin/main` head and current feature 009 contradiction read-only.

## Architect Artifacts

- [x] T010 Create `spec.md` with goal, scope, requirements, acceptance criteria, negative scenarios, verification requirements, review requirements, and architectural decisions.
- [x] T011 Create `plan.md` with implementation approach, expected changed files, verification plan, review plan, risks, and handoff.
- [x] T012 Create this `tasks.md` with implementation checklist, verification checklist, process memory, evidence placeholders, and feedback disposition sections.

## Required Slice A: Implementation Setup

- [x] T013 Confirm Implementation Agent starts from complete feature memory: `feature-request.md`, `spec.md`, `plan.md`, and `tasks.md`.
- [x] T014 Confirm Implementation Agent is in `/Users/chap/devel/cabadrive-022-feature-009-memory-consistency` on `codex/022-feature-009-memory-consistency`.
- [x] T015 Run `git status --short --branch` and record any pre-existing dirty or untracked files before editing.
- [x] T016 Confirm no sibling worktree, sibling branch, sibling PR, Docker container, product file, content file, validator, test, generated index, or durable doc will be mutated.

## Required Slice B: Evidence Refresh

- [x] T017 Run fresh main audit: `git show -s --format='%H%n%s%n%cI' origin/main`.
- [x] T018 Run feature 009 contradiction audit: `rg -n "T098|T121|remains open|remains intentionally open" specs/009-image-metadata-learning-support/tasks.md`.
- [x] T019 Capture PR #93 metadata and check rollup with `gh pr view 93`.
- [x] T020 Capture PR #94 metadata and check rollup with `gh pr view 94`.
- [x] T021 Capture PR #97 metadata and check rollup with `gh pr view 97`.
- [x] T022 Capture PR #99 metadata and check rollup with `gh pr view 99`.
- [x] T023 Record the evidence identifiers in Process Memory before final verification.

## Required Slice C: Feature 009 Memory Correction

- [x] T024 Edit only `specs/009-image-metadata-learning-support/tasks.md` and this feature `tasks.md`.
- [x] T025 Remove or replace the stale T121 wording that says T098 remains open with explicit Docker-smoke disposition.
- [x] T026 Preserve T098 as checked and preserve its Docker-smoke closure evidence.
- [x] T027 Preserve T121 as checked and preserve its PR #63 readiness-gate evidence.
- [x] T028 Record that T098 is now closed by later Docker-smoke closure evidence, citing PR #93 and subsequent PR #94/#97/#99/fresh-main audit context.
- [x] T029 Do not change product code, content shards, generated indexes, validators, tests, runtime files, durable docs, or unrelated feature memory.

## Required Slice D: Verification

- [x] T030 Run stale-wording search and confirm no output:

```bash
rg -n "T098 remains open|T098 remains intentionally open|remains open with explicit Docker-smoke disposition" specs/009-image-metadata-learning-support/tasks.md
```

- [x] T031 Run target readiness task audit and confirm no output:

```bash
rg -n "^- \\[ \\] T(098|099|100|101|102|109|110|111|114|115|116|117|118|119|120|121|163|164|165|166)" specs/009-image-metadata-learning-support/tasks.md
```

- [x] T032 Run `node scripts/content-shards.mjs --check-indexes`.
- [x] T033 Run `pnpm run validate:content`.
- [x] T034 Run `pnpm run validate:content:quality`.
- [x] T035 Run `pnpm run validate:overlays`.
- [x] T036 Run `pnpm run test`.
- [x] T037 Run `node scripts/check-feature-memory.mjs --worktree`.
- [x] T038 Run `git diff --check`.
- [x] T039 Run `git diff --name-only`/staged-file review and confirm changed files are limited to process memory:

```text
specs/009-image-metadata-learning-support/tasks.md
specs/022-feature-009-memory-consistency/feature-request.md
specs/022-feature-009-memory-consistency/plan.md
specs/022-feature-009-memory-consistency/spec.md
specs/022-feature-009-memory-consistency/tasks.md
```

- [x] T040 Record all verification evidence in Process Memory.

## Required Slice E: PR And Review

- [x] T041 Open one small process-memory-only PR.
- [x] T042 Confirm required checks were green on validated PR #112 head `8c5dfbe1d86f66b7741ee7d3c97c97d9acc14f4e`.
- [x] T043 Review Agent verifies stale contradiction removal, evidence quality, scope control, and role-boundary compliance.
- [x] T044 Resolve or route any Review Agent findings through Orchestrator.
- [x] T045 Record PR/check/review evidence without preclaiming stale-head gates.

## Process Memory

### Architect Decisions

- Scope is process-memory-only.
- Implementation may edit feature 009 only at `specs/009-image-metadata-learning-support/tasks.md`.
- Implementation must update this feature `tasks.md` with evidence while working.
- The desired correction is minimal: replace or remove stale T121 wording that says T098 remains open.
- T098 must stay checked and closed; T121 must stay checked and truthful.
- Evidence must include PR #93, PR #94, PR #97, PR #99, and fresh `origin/main` audit context.
- No product code, content, generated index, validator, test, runtime, durable-doc, or unrelated spec change is allowed.

### Architect Context Evidence

- Architect `git status --short --branch` showed `## codex/022-feature-009-memory-consistency` with untracked `specs/022-feature-009-memory-consistency/` before these artifacts were created.
- Architect `rg -n "T098|T121|remains open|remains intentionally open" specs/009-image-metadata-learning-support/tasks.md` found T098 checked with successful Docker-smoke evidence and T121 checked with stale wording that T098 `remains open with explicit Docker-smoke disposition`.
- Architect fresh-main audit showed `origin/main` at `5170ec652e1c026b19319fe808824f4eb316d49f`, `[codex] Add orchestrator cleanup governance (#67)`, dated `2026-05-10T20:24:23-03:00`.
- Architect PR #93 lookup showed merged PR `[codex] Record feature 009 T098 Docker smoke blocker`, head `d4630809de880dfddb7a5a3ea71ac052f224e172`, merge commit `c6076e580f2c59169957800fd2c80eacac3ca328`, merged `2026-05-10T19:41:56Z`, with required checks green.
- Architect PR #94 lookup showed merged PR `[codex] Isolate Docker smoke runtime`, head `7627b74264acf1ff592db7be94db4d29336b49cb`, merge commit `4cc2bb735e1a92151ca3aa9001c82ae0f65c730f`, merged `2026-05-10T19:50:44Z`, with required checks green.
- Architect PR #97 lookup showed merged PR `Close final 010 and 019 process memory gates`, head `30fd4b1803192e6416c6784a468d5fb6484fb65a`, merge commit `f5fcb1602885022bb60b412f90bf290d51674c76`, merged `2026-05-10T19:53:46Z`, with required checks green.
- Architect PR #99 lookup showed merged PR `[codex] Close feature 021 process gates`, head `0b3b6da43a981ff67ec63bb246bb6870679cb64e`, merge commit `55d196a8762fc156520f045a48c0cb25ee83d569`, merged `2026-05-10T20:03:27Z`, with required checks green.

### Dead Ends

- None during Architect planning.
- None during Implementation; branch rebase to current `origin/main` was clean before edits.

### Known Issues

- Feature 009 T121 previously contradicted T098's checked state by saying T098 remained open; Implementation replaced that stale wording with current closure evidence.
- No product/runtime/content issue is known or in scope for this feature.
- Current `origin/main` primary-source strict quality validation is not release-ready under `pnpm run validate:content:quality`; this feature did not change primary-source content, manifests, coverage, QA, or search files, and the failure is recorded as out of scope for Architect/Orchestrator disposition.

### Verification Evidence

- Architect artifact creation only: `spec.md`, `plan.md`, and `tasks.md` were created under `specs/022-feature-009-memory-consistency/`.
- Architect did not edit feature 009, product code, content, validators, tests, runtime files, durable docs, commits, pushes, PRs, or review state.
- Implementation setup: initial `git status --short --branch` showed `## codex/022-feature-009-memory-consistency` with untracked `specs/022-feature-009-memory-consistency/`; after `git fetch origin --prune`, the branch was rebased cleanly from initial `HEAD` `6f34c64a9ee2020c59aa25298c6396575c0e22f5` onto current `origin/main` `183cb33596859bd4e13e11f00fc26b17aded0a82`.
- Implementation fresh-main audit: `git show -s --format='%H%n%s%n%cI' origin/main` returned `183cb33596859bd4e13e11f00fc26b17aded0a82`, `[codex] Plan primary sources section (#68)`, `2026-05-10T20:29:39-03:00`.
- Implementation contradiction audit before edit found T098 checked with branch-owned Docker-smoke evidence and T121 checked with stale wording: `T098 is not part of the T121 blocking condition and remains open with explicit Docker-smoke disposition.`
- PR #93 evidence: merged `[codex] Record feature 009 T098 Docker smoke blocker`, head `d4630809de880dfddb7a5a3ea71ac052f224e172`, merge commit `c6076e580f2c59169957800fd2c80eacac3ca328`, merged `2026-05-10T19:41:56Z`, with `AI Review`, `baseline-checks`, `docker-validation`, `guard`, and `osv-scan` successful.
- PR #94 evidence: merged `[codex] Isolate Docker smoke runtime`, head `7627b74264acf1ff592db7be94db4d29336b49cb`, merge commit `4cc2bb735e1a92151ca3aa9001c82ae0f65c730f`, merged `2026-05-10T19:50:44Z`, with `AI Review`, `baseline-checks`, `docker-validation`, `guard`, and `osv-scan` successful.
- PR #97 evidence: merged `Close final 010 and 019 process memory gates`, head `30fd4b1803192e6416c6784a468d5fb6484fb65a`, merge commit `f5fcb1602885022bb60b412f90bf290d51674c76`, merged `2026-05-10T19:53:46Z`, with required checks successful; one earlier skipped AI Review run was superseded by a successful AI Review run.
- PR #99 evidence: merged `[codex] Close feature 021 process gates`, head `0b3b6da43a981ff67ec63bb246bb6870679cb64e`, merge commit `55d196a8762fc156520f045a48c0cb25ee83d569`, merged `2026-05-10T20:03:27Z`, with `AI Review`, `baseline-checks`, `docker-validation`, `guard`, and `osv-scan` successful.
- PR #95 evidence: merged `[codex] Add institution entrance timing contrast`, head `bda2d253a3352aa3f74c0b0db641b91208c41b38`, merge commit `6f34c64a9ee2020c59aa25298c6396575c0e22f5`, merged `2026-05-10T20:14:54Z`, with `AI Review`, `baseline-checks`, `docker-validation`, `guard`, and `osv-scan` successful.
- Implementation edit evidence: feature 009 T121 now says T098 is outside the original T121 blocking condition and is closed by later feature 019 Docker-smoke follow-up evidence recorded in T098 and PR #93, with subsequent main-state validation after PR #94, PR #97, PR #99, and PR #95.
- Stale contradiction search: `rg -n "T098.*remains open|T098.*remains intentionally open|remains open with explicit Docker-smoke disposition" specs/009-image-metadata-learning-support/tasks.md specs/019-feature-009-memory-closure/tasks.md specs/021-docker-smoke-isolation/tasks.md` returned no output. Historical feature 019 memory contains old-then-later-corrected wording such as `remained intentionally open then`, but it did not match the stale-current contradiction and was left unchanged as historical context.
- Target task-state audits: `rg -n "^- \\[ \\] T(098|099|100|101|102|109|110|111|120|121|155|166|175|176)" specs/009-image-metadata-learning-support/tasks.md` returned no output; the broader Architect audit `rg -n "^- \\[ \\] T(098|099|100|101|102|109|110|111|114|115|116|117|118|119|120|121|163|164|165|166)" specs/009-image-metadata-learning-support/tasks.md` also returned no output.
- Readback audit: `rg -n "T098|T121|remains open|remains intentionally open" specs/009-image-metadata-learning-support/tasks.md` showed T098 checked with Docker-smoke evidence, T121 checked with the corrected PR #93/#94/#97/#99/#95 closure note, and no feature 009 stale open wording.
- `node scripts/content-shards.mjs --check-indexes` passed: `Generated content indexes are fresh.`
- `pnpm run validate:content` passed: `Difficulty labels validated: 460 questions, 38 topics.` and `Content validation passed: 460 category B fallback questions, 276 local image references.`
- `pnpm run validate:content:quality` was run and failed before and after `pnpm install --frozen-lockfile` with current-main strict primary-source blockers: multiple official document `exactTextValidation.status` values are not `passed`, most primary-source documents lack strict learner/generated chunk coverage, `ley-24449-transito-seguridad-vial--draft-001` still has draft/placeholder Russian learner text, sourceSpan coverage reaches only line 5 of 3041, and translation/simplification QA is not approved with `YYYY-MM-DD` `checkedAt`. This feature's diff does not touch `content/primary-sources/`, official document manifests, validators, content shards, or generated indexes.
- `pnpm run validate:overlays` passed: `Image explanation overlays validated.`
- Initial `pnpm run test` ran 140/141 tests before failing because `tests/domain.test.mjs` could not import package `typescript`; `pnpm install --frozen-lockfile` installed dependencies from the lockfile in this worktree only, with no committed file changes. Rerun `pnpm run test` passed with `147` tests, `147` pass, `0` fail.
- `node scripts/check-feature-memory.mjs --worktree` passed: `No configured product paths changed; feature-memory gate passes.`
- `pnpm run check:repo` passed: `Repository baseline check passed.`
- `git diff --check` passed with no output.
- Pre-staging `git diff --name-only` returned only `specs/009-image-metadata-learning-support/tasks.md`; the feature 022 memory folder was still untracked from the Analyst/Architect handoff. Final staged-file review must include only feature 009 process memory plus complete feature 022 process memory (`feature-request.md`, `spec.md`, `plan.md`, and `tasks.md`) and no product/content/validator/test/runtime/durable-doc files.
- Staged-file review with `git diff --cached --name-only` returned exactly `specs/009-image-metadata-learning-support/tasks.md`, `specs/022-feature-009-memory-consistency/feature-request.md`, `specs/022-feature-009-memory-consistency/plan.md`, `specs/022-feature-009-memory-consistency/spec.md`, and `specs/022-feature-009-memory-consistency/tasks.md`.
- PR evidence: opened ready PR #112, `[codex] Close feature 009 memory consistency gap`, at `https://github.com/cucumberfalse/cabadrive/pull/112` from `codex/022-feature-009-memory-consistency` to `main`. Initial PR head was `fe59ec9d3ab529b4d8ba0e42efb3a8da3cf89f9e`; initial `gh pr view` showed `isDraft: false`, `state: OPEN`, and required checks pending/in progress. T042 remains unchecked here to avoid preclaiming green checks on a head that may change after this evidence commit.
- Review-thread fix evidence: PR #112 review thread `PRRT_kwDOSX65IM6A8KKa` correctly identified that T042 had been marked complete after the finalizer evidence commit, even though a new process-memory head requires fresh check confirmation. T042 is reopened on this head and must stay unchecked until the current pushed PR head has green required checks.
- Validated-head check evidence: PR #112 head `8c5dfbe1d86f66b7741ee7d3c97c97d9acc14f4e` was reconfirmed with required checks green before merge: `AI Review`, `baseline-checks`, `docker-validation`, `guard`, and `osv-scan` all completed with `SUCCESS`; the prior review thread was resolved and outdated.
- Follow-up race evidence: PR #112 merged to `main` at validated head `8c5dfbe1d86f66b7741ee7d3c97c97d9acc14f4e` before the follow-up evidence commit landed, so PR #114 carries only the T042 wording/evidence correction. PR #114 does not claim its own review head checks as a completed required task; its current-head check status remains Orchestrator/review evidence after this follow-up head completes CI.
- Finalizer review evidence for PR head `1a2faf9d1e4a2e3d65e93cf691269177330a18e5`: Review Agent reported no blocking findings. Scope review confirmed PR #112 changes only allowed process-memory files, no product/content/validator/runtime/test/generated-index/durable-doc files are in the diff, feature 022 memory is complete, and GitHub review threads are absent.
- Finalizer task-state evidence: Review Agent confirmed feature 009 T121 no longer says T098 remains open, T098 remains checked, T121 remains checked and truthful, and stale contradiction search plus target unchecked-task audit returned no output.
- Finalizer check evidence for PR head `1a2faf9d1e4a2e3d65e93cf691269177330a18e5`: `AI Review`, `baseline-checks`, `docker-validation`, `guard`, and `osv-scan` were green. The known `pnpm run validate:content:quality` failure remains unrelated current-main strict primary-source gating under `content/primary-sources` and is not caused by PR #112.
- Finalizer disposition evidence: no blocking review findings existed and no routed findings were required. Because this finalizer commit changes process memory, Orchestrator must reconfirm final PR checks on the new pushed head before declaring PR #112 merge-ready.

### Implementation Agent Feedback

- None. The `pnpm run validate:content:quality` failure is recorded above as an out-of-scope current-main verification blocker, not as a requested scope change for this process-memory correction.

### Architect Disposition Of Feedback

- None yet.

### Review Notes

- Review should reject any non-process-memory change.
- Review should verify that no stale `T098 remains open` wording survives in feature 009 memory.
