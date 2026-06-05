# Tasks: AI Review Codex Connector Login Gate

## Setup

- [x] T001 Confirm active feature folder, assigned isolated worktree, branch, and PR slice. Evidence: `/Users/chap/devel/cabadrive-worktrees/033-ai-review-login-gate`, branch `codex/033-ai-review-login-gate`, feature folder `specs/033-ai-review-login-gate/`.
- [x] T002 Confirm complete feature memory exists before implementation. `feature-request.md` exists; Architect creates `spec.md`, `plan.md`, and `tasks.md` in this step before implementation.
- [x] T003 Record latest-main startup evidence for this slice. Orchestrator reported `origin/main` at `51e42f657d867fb802bbe3a68591b6008b45a60f`; Architect read-only `git rev-parse HEAD` observed the same SHA.
- [x] T004 Confirm the active model is operating under Orchestrator assignment and is not self-promoting from a new repository-changing user request. Architect is strictly assigned by Orchestrator for feature 033.
- [x] T005 Read `feature-request.md` before editing and inspect relevant durable docs/gate surfaces: constitution, project docs, AI PR workflow, review contract, AI Review workflow, helper, gate, and tests.
- [x] T006 Record the read-only transition point. This is repository-changing gate-fix planning from intake; no read-only interaction became implementation outside Orchestrator route.
- [x] T007 Record accidental-start status. No Architect accidental edits outside allowed artifacts occurred in this worktree during planning.
- [x] T008 Confirm Orchestrator provided the parallel-work warning and preserve existing dirty diffs, branches, commits, PRs, sibling feature folders, process memory, active worktrees, and ambiguous local paths.
- [x] T009 Record baseline checks before Architect edits. `git status --short --branch` showed branch `codex/033-ai-review-login-gate...origin/main` with untracked `specs/033-ai-review-login-gate/` from Analyst intake.

## Implementation

- [x] T010 Update `scripts/ai-review-helpers.mjs` so the default trusted Codex login list includes both `chatgpt-codex-connector[bot]` and `chatgpt-codex-connector`. Evidence: updated `defaultTrustedReviewLogins.codex`.
- [x] T011 Preserve `trustedReviewLoginsForAgent` merge semantics and do not convert `trustedAssociations` into AI review login trust. Evidence: merge code unchanged; association-only regression tests added.
- [x] T012 Avoid broad `.unicorn-hub/config.json` trust changes unless implementation records why that path is narrower or more durable and adds tests proving no cross-agent or association-based trust broadening. Evidence: `.unicorn-hub/config.json` untouched; cross-agent tests cover default isolation.
- [x] T013 Add focused tests in `tests/ai-review-helpers.test.mjs` proving both Codex connector login forms are trusted for `codex`. Evidence: `both Codex connector login forms are trusted only for codex by default`.
- [x] T014 Add focused tests proving `chatgpt-codex-connector` can satisfy current-head native Codex pass classification when existing severity/thread rules classify the review as passing. Evidence: `latestCodexNativeReviewResult accepts current-head native review from botless connector`.
- [x] T015 Add negative tests proving unknown logins remain rejected for Codex native review and summary evidence. Evidence: unknown-login summary and native review assertions.
- [x] T016 Add negative tests proving trusted GitHub associations such as `OWNER`, `MEMBER`, or `COLLABORATOR` are not substitutes for trusted AI review logins. Evidence: `author_association: "OWNER"` remains rejected for unknown login.
- [x] T017 Add stale-head regression coverage for native Codex review and/or Codex summary evidence. Evidence: stale summary SHA and stale native review assertions.
- [x] T018 Add cross-agent isolation coverage proving the new Codex login is not trusted for Claude or Gemini unless explicitly configured. Evidence: default Claude/Gemini false assertions and agent-specific Claude opt-in assertion.
- [x] T019 Keep `.github/workflows/ai-review.yml` default-branch trusted-script checkout behavior unchanged; if the workflow is touched, update/run `tests/ai-review-workflow.test.mjs`. Evidence: workflow untouched; workflow guard test passed.
- [x] T020 Run or extend `tests/finalize-pr.test.mjs` if implementation adds finalize-specific assertions or changes trust behavior beyond the shared helper default. Evidence: not applicable; no finalize-specific assertions were added and the change is limited to the shared helper default requested by Architect.
- [x] T021 Record any scope tension, proposed executable enforcement, missing architecture decision, default-branch prerequisite issue, or PR/worktree overlap as Implementation Agent feedback instead of implementing outside scope. Evidence: no Implementation Agent feedback items identified.

## Cleanup Or Handoff

- [x] T022 Cleanup is not applicable. This feature does not assign local environment cleanup or deletion.
- [x] T023 If cleanup is requested later, refuse in non-cleanup roles and route to Orchestrator/Cleanup Agent with approved roots and positive-proof validation. Evidence: no cleanup requested; non-cleanup role boundary preserved.
- [x] T024 Preserve current, active, dirty, untracked, unpushed, open-PR, locked, running-process, ambiguous, user-owned, out-of-root, or process-memory-referenced targets. Evidence: no cleanup or sibling worktree operations performed.

## Verification

- [x] T025 Run focused helper tests: `node --test tests/ai-review-helpers.test.mjs`. Evidence: failed before helper change on new botless connector acceptance tests, then passed 16/16 after helper change.
- [x] T026 Run workflow guard tests if workflow assertions are touched or as static checkout evidence: `node --test tests/ai-review-workflow.test.mjs`. Evidence: passed 3/3 and confirms default-branch trusted-script checkout assertion remains covered.
- [x] T027 Run finalize tests if finalization behavior is directly asserted or changed: `node --test tests/finalize-pr.test.mjs`. Evidence: not applicable; no finalize-specific behavior or assertions changed beyond the shared helper default.
- [x] T028 Run feature-memory gate: `node scripts/check-feature-memory.mjs --worktree`. Evidence: passed.
- [x] T029 Run whitespace/scope sanity: `git diff --check`. Evidence: passed.
- [x] T030 Run `pnpm run preflight` when feasible for this workflow/tooling change; if not feasible, record why and list completed focused coverage. Evidence: first run failed because this fresh worktree had no `node_modules`; after `pnpm install --frozen-lockfile`, rerun passed.
- [x] T031 Record verification evidence and update task status/process memory before commit. Evidence: command results and decisions recorded in Process Memory.
- [x] T032 Confirm changed files are limited to assigned scope and exclude sibling feature folders/worktrees. Evidence: changed tracked files are `scripts/ai-review-helpers.mjs` and `tests/ai-review-helpers.test.mjs`; untracked new feature memory is limited to `specs/033-ai-review-login-gate/`; no sibling worktree operations performed.
- [ ] T033 Confirm Review Agent enforcement evidence covers Orchestrator-first bypasses, missing feature memory, role-boundary violations, unsafe recovery, sibling-work preservation, latest-main startup, strict trust, stale-head rejection, and cleanup not-applicable evidence. Pending Review Agent review.
- [x] T034 Confirm every Implementation Agent feedback item has Architect disposition before completion. Evidence: no Implementation Agent feedback items were identified; no Architect disposition needed.
- [x] T035 Update cycle PR set with this slice's purpose, branch, PR metadata, head SHA, status, and final-validation inclusion. Evidence: PR `#199` opened ready for review at `https://github.com/cucumberfalse/cabadrive/pull/199`; implementation/effective content head at PR opening was `1eeb9236df513700c5d8dc73816af6fdcb1080bc`.
- [x] T036 Record post-merge Orchestrator requirement: after this gate fix lands on default, rerun or observe `AI Review` on PR `#198` and verify it evaluates current PR `#198` head evidence. Evidence: requirement remains recorded in Known Issues and Cycle PR Set notes.
- [ ] T037 Record final Architect validation evidence, return count, and gap dispositions when Orchestrator invokes it.
- [ ] T038 Record final Analyst validation evidence, Analyst return count, and Architect disposition for any Analyst feedback when Orchestrator invokes it.
- [ ] T039 If any commit lands after final Architect or Analyst validation, record `Effective content head: <40-hex-sha>`, `Architect validated effective content head: <40-hex-sha>`, and `Analyst validated effective content head: <40-hex-sha>` for the same SHA, then confirm whether the later commit is final-validation evidence-only or makes prior validation stale.
- [ ] T040 Confirm merge-readiness gates remain satisfied after final validation on the current PR head: required checks, blocking review status, conflicts, acceptance evidence, process memory, feedback disposition, current-PR-head read-only guard, final guards, cleanup evidence/refusal when relevant, branch-protection readiness, and absence of exceptional human blockers.

## Process Memory

### Dead Ends

- None during Architect planning.
- Expected test-first red run: after adding regression tests and before updating the helper default, `node --test tests/ai-review-helpers.test.mjs` failed on botless `chatgpt-codex-connector` acceptance assertions. This confirmed the regression tests covered the target failure mode.

### Decisions

- Preferred implementation path: update the default Codex trusted login list in `scripts/ai-review-helpers.mjs`, not broad config, because both AI Review and finalize helper consumers share the helper and `.unicorn-hub/config.json` has empty trusted-review-login overrides.
- This is a separate default-branch-effective PR slice because `.github/workflows/ai-review.yml` checks out trusted gate scripts from the repository default branch. A fix only inside PR `#198` would not unblock that PR's own required AI Review check.
- Cleanup is not applicable for this feature.
- `.unicorn-hub/config.json` remains untouched to avoid broad global trust changes across review agents.
- `.github/workflows/ai-review.yml` remains untouched; `tests/ai-review-workflow.test.mjs` provides static evidence that default-branch trusted-script checkout remains covered.
- `tests/finalize-pr.test.mjs` was not run because no finalize-specific behavior or assertions were changed beyond the shared helper default, and focused helper tests cover the shared trust helper contract.

### Known Issues

- PR `#198` remains dependent on this fix landing on default before its AI Review check can be rerun or observed successfully with current default-branch gate logic.
- If PR `#198` receives a new behaviorally meaningful commit, its existing Codex review evidence for `9df31d213419b107ca49797c0357ce8151c8effe` must remain stale and a fresh current-head review is required.
- During implementation, local `origin/main` advanced from the assigned verified base `51e42f657d867fb802bbe3a68591b6008b45a60f` to `bcee0fbffc8878bfbaf0876352b32636b8a40790` (`Add structured manual glossary translations (#197)`). Read-only diff inspection showed no overlap with `scripts/ai-review-helpers.mjs`, `tests/ai-review-helpers.test.mjs`, or `specs/033-ai-review-login-gate/`. No merge or rebase was performed by Implementation Agent.

### Verification Evidence

- Architect planning read-only evidence: `git rev-parse HEAD` returned `51e42f657d867fb802bbe3a68591b6008b45a60f`.
- Architect planning read-only evidence: `git status --short --branch` showed only untracked feature memory before Architect artifact creation.
- Implementation startup confirmation at `2026-06-05T04:10:14Z`: active role is Implementation Agent under Orchestrator assignment for feature `033-ai-review-login-gate`; assigned worktree `/Users/chap/devel/cabadrive-worktrees/033-ai-review-login-gate`; branch `codex/033-ai-review-login-gate`; scope limited to `scripts/ai-review-helpers.mjs`, focused AI Review tests, and this feature memory unless evidence shows a narrower required exception.
- Implementation startup base evidence: `git rev-parse HEAD` returned `51e42f657d867fb802bbe3a68591b6008b45a60f`; `git merge-base HEAD origin/main` returned `51e42f657d867fb802bbe3a68591b6008b45a60f`, matching the verified base.
- Implementation startup status evidence: `git status --short --branch` showed `## codex/033-ai-review-login-gate...origin/main` and only untracked `specs/033-ai-review-login-gate/` from feature memory before implementation edits. Parallel work may exist; sibling worktrees, dirty diffs, branches, commits, PRs, and process memory must be preserved.
- Test-first evidence: `node --test tests/ai-review-helpers.test.mjs` failed before helper update, with failures on `both Codex connector login forms are trusted only for codex by default`, `trustedReviewLoginsForAgent merges defaults and config overrides`, `isAcceptableCodexSummaryComment accepts botless Codex connector login`, and `latestCodexNativeReviewResult accepts current-head native review from botless connector`.
- Focused helper verification: `node --test tests/ai-review-helpers.test.mjs` passed after helper update: 16 tests, 16 pass.
- Workflow/static checkout verification: `node --test tests/ai-review-workflow.test.mjs` passed: 3 tests, 3 pass.
- Feature-memory verification: `node scripts/check-feature-memory.mjs --worktree` passed.
- Whitespace verification: `git diff --check` passed.
- Preflight first attempt: `pnpm run preflight` failed during `validate:content` because this fresh worktree had no `node_modules` and `pdf-parse/lib/pdf-parse.js` could not be resolved.
- Dependency setup evidence: `pnpm install --frozen-lockfile` completed successfully with lockfile up to date and reused packages.
- Full preflight rerun: `pnpm run preflight` passed after dependency install. Evidence included content validation pass, `node --test tests/*.test.mjs` with 408 tests passed, production build/service-worker generation passed with existing large-chunk warnings, and Playwright e2e with 78 tests passed.
- Read-only post-preflight status: `git status --short --branch` showed branch `codex/033-ai-review-login-gate...origin/main [behind 1]`, modified `scripts/ai-review-helpers.mjs`, modified `tests/ai-review-helpers.test.mjs`, and untracked `specs/033-ai-review-login-gate/`; untracked generated/dependency directories were ignored by repository rules.
- Read-only overlap inspection for advanced `origin/main`: `git diff HEAD..origin/main -- scripts/ai-review-helpers.mjs tests/ai-review-helpers.test.mjs specs/033-ai-review-login-gate` produced no diff.
- Final post-process-memory verification: `node scripts/check-feature-memory.mjs --worktree` passed and `git diff --check` passed after verification evidence updates.

### Cycle PR Set

- Slice: purpose `AI Review Codex connector login gate fix`; branch `codex/033-ai-review-login-gate`; PR metadata `#199` at `https://github.com/cucumberfalse/cabadrive/pull/199`, ready/open, base `main`, head branch `codex/033-ai-review-login-gate`; implementation/effective content head at PR opening `1eeb9236df513700c5d8dc73816af6fdcb1080bc`; status `open, mergeable, required checks running at PR-open inspection`; included in final validation `yes`.
- Process-memory note: this PR metadata update is process-memory-only after the implementation/effective content head. Orchestrator final-validation guards should treat any later commit containing only role/process evidence under `specs/033-ai-review-login-gate/` according to the repository evidence-only commit rules.
- Post-merge Orchestrator handoff requirement: after this gate-fix PR lands on default, rerun or observe `AI Review` on PR `#198` and verify it evaluates current PR `#198` head evidence rather than stale review evidence.

### Final Validation Evidence

- Architect validation: not yet invoked.
- Architect return count: 0.
- Analyst validation: not yet invoked.
- Analyst return count: 0.
- Effective content head: not yet validated.
- Architect validated effective content head: not yet validated.
- Analyst validated effective content head: not yet validated.
- Final-validation evidence-only commit: none.
- Current-PR-head read-only guard: pending.
- Analyst feedback Architect disposition: none.
- Limit escalation: none.

### Cleanup Evidence

- Cleanup not applicable. No cleanup scope, roots, candidates, or deletion authority are assigned.

## Implementation Agent Feedback

- None.

## Architect Dispositions

- None.
