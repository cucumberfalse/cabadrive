# Tasks: Learning Polish Process Memory Closure

## Architect Planning Setup

- [x] T001 Confirm assigned worktree is `/Users/chap/devel/cabadrive-019-learning-polish-process-memory-closure`.
- [x] T002 Confirm active branch is `codex/019-learning-polish-process-memory-closure`.
- [x] T003 Read `.specify/memory/constitution.md`.
- [x] T004 Read `docs_project/README.md`.
- [x] T005 Read `docs_project/project-idea.md`.
- [x] T006 Read `docs_project/project/frontend/frontend-docs.md`.
- [x] T007 Read `docs_project/project/backend/backend-docs.md`.
- [x] T008 Read `docs_project/project/feature-inventory.md`.
- [x] T009 Read `docs_project/screens/learning-and-exam-flows.md`.
- [x] T010 Read `docs/specify/README.md`.
- [x] T011 Read active `specs/019-learning-polish-process-memory-closure/feature-request.md`.
- [x] T012 Inspect `specs/013-learning-content-ui-polish/feature-request.md` for the original customer scope.
- [x] T013 Inspect `specs/013-learning-content-ui-polish/tasks.md` T096-T112 and process memory.

## Architect Artifacts

- [x] T014 Create `spec.md` with goal, scope, acceptance criteria, negative scenarios, functional requirements, verification requirements, review requirements, and architectural decisions.
- [x] T015 Create `plan.md` with implementation strategy, slices, verification plan, review plan, risks, rollback, and handoff.
- [x] T016 Create this `tasks.md` with implementation tasks, review requirements, process memory, evidence placeholders, and feedback-disposition sections.

## Required Slice A: Implementation Setup And Current Facts

- [x] T017 Confirm Implementation Agent starts from complete feature memory: `feature-request.md`, `spec.md`, `plan.md`, and `tasks.md`.
- [x] T018 Confirm Implementation Agent uses only `/Users/chap/devel/cabadrive-019-learning-polish-process-memory-closure` on branch `codex/019-learning-polish-process-memory-closure`.
- [x] T019 Run `git status --short --branch` and record any pre-existing dirty files.
- [x] T020 Run `git fetch origin`.
- [x] T021 Confirm `origin/main` contains PR #69 merge commit `6562410` or record the current equivalent PR #69 merge reference.
- [x] T022 Verify PR #69 merged state, merge commit, and head/URL using `gh pr view 69` or the GitHub connector.
- [x] T023 Inspect `specs/013-learning-content-ui-polish/tasks.md` T096-T112 before editing and record the stale unchecked state.
- [x] T024 Confirm no product/content/test/runtime/CI/docs files will be edited.

## Required Slice B: Feature 013 Post-Merge Closure

- [x] T025 Update only `specs/013-learning-content-ui-polish/tasks.md` for the old feature-memory closure.
- [x] T026 Mark or reconcile T096-T098 with evidence for review findings, required checks, and PR completion state.
- [x] T027 Mark or reconcile T099-T112 with evidence for Review Agent no-findings coverage and review requirements.
- [x] T028 Add a clearly labeled `Feature 019 post-merge closure` note near the relevant checklist or in Process Memory.
- [x] T029 State explicitly that closure happened after PR #69 had merged and does not claim the original 013 implementation agent completed the checklist before merge.
- [x] T030 Include evidence for required checks, Review Agent no-findings, Architect PASS, Analyst PASS, and latest-main validation.
- [x] T031 Preserve existing 013 process memory, dead ends, known issues, verification evidence, and feedback dispositions.
- [x] T032 Record any uncertainty or missing fact as Implementation Agent feedback instead of inventing evidence.

## Required Slice C: Feature 019 Process Memory

- [x] T033 Keep this `tasks.md` current while implementing.
- [x] T034 Record changed files and diff-scope evidence.
- [x] T035 Record command evidence for verification.
- [x] T036 Record known issues or explicit none.
- [x] T037 Record Implementation Agent feedback or explicit none.
- [x] T038 Record Architect disposition requirement for any feedback that appears.

## Required Slice D: Verification And PR Readiness

- [x] T039 Run `git diff --name-only origin/main...HEAD` for the pre-commit snapshot and again after the Orchestrator latest-main merge; confirm the committed PR diff scope is limited to process-memory files.
- [x] T040 Run `git diff --check`.
- [x] T041 Run `node scripts/check-feature-memory.mjs origin/main HEAD`.
- [x] T042 Run `pnpm run preflight`, or record an exact environment blocker and Orchestrator disposition.
- [x] T043 Confirm no learner-facing product behavior, content, tests, runtime files, CI files, or unrelated docs changed.
- [x] T044 Confirm no unresolved merge conflicts.
- [x] T045 Confirm all acceptance criteria have evidence.
- [x] T046 Confirm no unresolved Implementation Agent feedback remains before review.

## Review Requirements

- [x] T047 Review Agent verifies complete feature `019` memory exists and role boundaries were followed.
- [x] T048 Review Agent verifies changed files are limited to allowed process-memory files.
- [x] T049 Review Agent verifies feature `013` T096-T112 closure is explicitly labeled as post-merge via feature `019`.
- [x] T050 Review Agent verifies chronology is preserved and no false pre-merge completion claim was introduced.
- [x] T051 Review Agent verifies evidence supports the closed review/check/final-validation items.
- [x] T052 Review Agent verifies no learner-facing product, content, tests, runtime, CI, or unrelated docs changed.
- [x] T053 Review Agent verifies this `tasks.md` contains current verification evidence, known issues, and Implementation Agent feedback disposition before merge readiness.

## Process Memory

### Architect Decisions

- Feature `019` is process-memory closure only.
- The only intended old-feature target is `specs/013-learning-content-ui-polish/tasks.md`.
- Implementation may update this active `tasks.md` to keep feature `019` current.
- No product code, content data, tests, runtime files, CI files, scripts, or product docs should change.
- T096-T112 should be reconciled with an explicit post-merge note, not silently checked.
- Current `main`, PR #69 metadata, existing feature `013` evidence, and post-merge latest-main validation are the evidence sources.

### Context Evidence

- Architect branch check showed `codex/019-learning-polish-process-memory-closure...origin/main`.
- Architect baseline status showed untracked `specs/019-learning-polish-process-memory-closure/` from Analyst intake.
- Feature `019` intake states PR #69 merged after green required checks, Review Agent no-findings, Architect PASS, Analyst PASS, and post-merge latest-main validation, but T096-T112 in feature `013` remained unchecked.
- Current local log at Architect planning time showed `origin/main` at `78e0176` with PR #69 merge commit `6562410` reachable behind it.
- Architect inspected feature `013` tasks and confirmed T096-T112 were still unchecked while process memory already contained extensive implementation and validation evidence.
- Implementation Agent setup, 2026-05-10: complete feature `019` memory was present and read before editing: `feature-request.md`, `spec.md`, `plan.md`, and `tasks.md`.
- Implementation Agent setup, 2026-05-10: active worktree was `/Users/chap/devel/cabadrive-019-learning-polish-process-memory-closure`; active branch was `codex/019-learning-polish-process-memory-closure`.
- Pre-edit status, 2026-05-10: `git status --short --branch` reported `## codex/019-learning-polish-process-memory-closure...origin/main` plus untracked `specs/019-learning-polish-process-memory-closure/` from Analyst/Architect setup. No product, content, test, runtime, CI, or unrelated docs files were dirty before implementation.
- Current-main fact check, 2026-05-10: `git fetch origin` completed; `git merge-base --is-ancestor 6562410 origin/main` exited 0; `git show -s --format=%H%n%s%n%cI origin/main` reported `78e0176e361eeea583dd797296bfa994b3f1f695`, `[codex] Implement image metadata learning support (#63)`, `2026-05-10T11:10:41-03:00`.
- PR #69 merge fact check, 2026-05-10: `git show -s --format=%H%n%s%n%cI 6562410` reported `65624107d856653e503e3f03fd1d51da83992984`, `[codex] Polish learning content study surfaces (#69)`, `2026-05-10T10:58:13-03:00`.
- GitHub PR #69 fact check, 2026-05-10: `gh pr view 69 --json number,state,mergedAt,mergeCommit,headRefOid,url,reviewDecision,statusCheckRollup` reported state `MERGED`, URL `https://github.com/cucumberfalse/cabadrive/pull/69`, merged at `2026-05-10T13:58:13Z`, head `bfe67a6ee245759f9fb51203f3452f1ee1f8b703`, merge commit `65624107d856653e503e3f03fd1d51da83992984`, and required checks `AI Review`, `baseline-checks`, `docker-validation`, `guard`, and `osv-scan` all `COMPLETED` with `SUCCESS`.
- GitHub review fact check, 2026-05-10: GitHub connector `_fetch_pr_comments` found Codex no-major-issues comments for PR #69, including the final bot summary at `2026-05-10T13:51:11Z`; `_list_pull_request_review_threads` returned no review threads; `_list_pull_request_reviews` returned no review submissions.
- Pre-edit stale-state check, 2026-05-10: inspected `specs/013-learning-content-ui-polish/tasks.md` and confirmed T096-T098 and T099-T112 were unchecked before this feature `019` closure.
- Scope decision, 2026-05-10: only `specs/013-learning-content-ui-polish/tasks.md` and `specs/019-learning-polish-process-memory-closure/tasks.md` are in the assigned write scope. No product, content, test, runtime, CI, scripts, durable product docs, or unrelated feature memory edits are in scope.
- Closure edit, 2026-05-10: updated `specs/013-learning-content-ui-polish/tasks.md` to check T096-T112 and added a `Feature 019 Post-Merge Closure` note that preserves chronology, records PR #69 Git/GitHub evidence, and cites feature `019` intake for Architect PASS, Analyst PASS, and post-merge latest-main validation evidence.
- Latest-main sync follow-up, 2026-05-10: Orchestrator merged current `origin/main` into this feature branch as merge commit `8ebeea768f936919c903983f07bacb6c423f4ca4` (`Merge origin/main into learning polish process memory closure`). The merge parents are feature head `1977874f4cf653d10a38949fd130b2481424c3c8` and latest `origin/main` `870c7f9514404b36cf75954c3c39814770495342` (`[codex] Implement UI UX learning overlays (#83)`, `2026-05-10T11:53:09-03:00`).
- Review Agent pass, 2026-05-10: Review Agent reviewed PR #86 head `3baf89033948310953e132fe256dc27dc0180f6b` and reported no findings at `https://github.com/cucumberfalse/cabadrive/pull/86#issuecomment-4415594461`. Scope reviewed: expected changed-file scope, complete feature `019` memory, post-merge feature `013` T096-T112 closure/chronology, PR #69 evidence, and no product/content/test/runtime/CI/unrelated docs changes.
- Post-review process-memory note, 2026-05-10: this update marks T047-T053 and records the Review Agent pass after the reviewed head. Because this is a process-memory update after review, Orchestrator must re-check latest-head diff scope, required checks, and review status before merge.

### Dead Ends

- None during Architect planning.
- Implementation preflight setup dead end, 2026-05-10: first `pnpm run preflight` failed during `pnpm run test` because this worktree had no `node_modules`; `tests/domain.test.mjs` could not import package `typescript` and the command ended with `ERR_MODULE_NOT_FOUND`. Resolution: ran `pnpm install --frozen-lockfile`, which reported the lockfile was up to date and installed dependencies without tracked package or lockfile changes, then reran `pnpm run preflight` successfully.

### Known Issues

- Feature `013` process memory stale-state is addressed by the feature `019` closure edit, and Slice D verification completed on 2026-05-10.
- No product or validation gap was found during implementation setup/fact checking.
- No known issues remain for this process-memory-only implementation. Final human review/PR mechanics remain outside the Implementation Agent assignment.

### Verification Evidence

- Earlier pre-commit `git fetch origin` completed before the first verification pass; at that time `origin/main` was `78e0176e361eeea583dd797296bfa994b3f1f695` (`[codex] Implement image metadata learning support (#63)`). That remains historical setup evidence, not the final latest-main sync evidence.
- Earlier pre-commit diff-scope snapshot: `git diff --name-only origin/main...HEAD` produced no output because no feature `019` commit existed yet under the user instruction not to commit or push. Worktree scope was checked separately with `git diff --name-only origin/main` and `git ls-files --others --exclude-standard`: tracked worktree diff was limited to `specs/013-learning-content-ui-polish/tasks.md`; untracked feature-memory setup paths were `specs/019-learning-polish-process-memory-closure/feature-request.md`, `plan.md`, `spec.md`, and `tasks.md`.
- Final latest-main sync evidence after Orchestrator merge: `git show -s --format=%H%n%P%n%s%n%cI HEAD` reported merge commit `8ebeea768f936919c903983f07bacb6c423f4ca4`, parents `1977874f4cf653d10a38949fd130b2481424c3c8` and `870c7f9514404b36cf75954c3c39814770495342`, subject `Merge origin/main into learning polish process memory closure`, committed `2026-05-10T11:54:07-03:00`.
- Final latest-main base evidence after Orchestrator merge: `git show -s --format=%H%n%s%n%cI origin/main` reported `870c7f9514404b36cf75954c3c39814770495342`, `[codex] Implement UI UX learning overlays (#83)`, `2026-05-10T11:53:09-03:00`.
- Final committed PR diff-scope evidence after Orchestrator merge: `git diff --name-only origin/main...HEAD` reported exactly `specs/013-learning-content-ui-polish/tasks.md`, `specs/019-learning-polish-process-memory-closure/feature-request.md`, `specs/019-learning-polish-process-memory-closure/plan.md`, `specs/019-learning-polish-process-memory-closure/spec.md`, and `specs/019-learning-polish-process-memory-closure/tasks.md`.
- `git diff --check` passed before and after preflight.
- `node scripts/check-feature-memory.mjs origin/main HEAD` passed with `No configured product paths changed; feature-memory gate passes.`
- First `pnpm run preflight` failed with an exact environment dependency blocker: missing `node_modules` caused `Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'typescript' imported from tests/domain.test.mjs`.
- `pnpm install --frozen-lockfile` completed successfully, reported the lockfile was up to date, and produced no tracked package metadata changes.
- Second `pnpm run preflight` passed before the later #83 latest-main merge: worktree feature-memory gate passed; repository baseline check passed; content validation passed with difficulty labels for 460 questions and 38 topics plus 460 category B fallback questions and 276 local image references; `pnpm run test` passed 112 Node tests; `pnpm run build` passed and generated a service worker with 280 cached assets, with the existing Vite large chunk warning; `pnpm run test:e2e` passed 22 Playwright tests across `chromium` and `mobile`.
- Final post-#83 latest-base `pnpm run preflight` passed after the Orchestrator merge of `origin/main` `870c7f9514404b36cf75954c3c39814770495342`: feature-memory gate passed; repository baseline check passed; content validation passed with difficulty labels for 460 questions and 38 topics plus 460 category B fallback questions and 276 local image references; `pnpm run test` passed 116 Node tests; `pnpm run build` passed and generated a service worker with 280 cached assets, with the existing Vite large chunk warning; `pnpm run test:e2e` passed 30 Playwright tests across `chromium` and `mobile`.
- `git diff --name-only --diff-filter=U` returned no paths, confirming no unresolved merge conflicts.
- Earlier pre-commit status evidence: `git status --short --branch` showed only `M specs/013-learning-content-ui-polish/tasks.md` and untracked `specs/019-learning-polish-process-memory-closure/` process-memory files. Latest-main sync status before this wording-only follow-up showed `## codex/019-learning-polish-process-memory-closure...origin/codex/019-learning-polish-process-memory-closure [ahead 2]` with no dirty paths. No learner-facing product behavior, content, tests, runtime files, CI files, scripts, durable product docs, or unrelated feature memory changed.
- Review Agent evidence: PR #86 review comment `https://github.com/cucumberfalse/cabadrive/pull/86#issuecomment-4415594461` reported no findings on head `3baf89033948310953e132fe256dc27dc0180f6b` after reviewing expected changed-file scope, complete feature `019` memory, feature `013` post-merge closure chronology, PR #69 evidence, and the absence of product/content/test/runtime/CI/unrelated docs changes.

### Implementation Agent Feedback

- Evidence boundary recorded: PR #69 merge state, required checks, merge commit, no review threads, and no native review submissions were rechecked through git/GitHub. Architect PASS, Analyst PASS, and post-merge latest-main validation are recorded in `specs/019-learning-polish-process-memory-closure/feature-request.md`; GitHub PR comments for #69 did not expose those role-validation notes, so this closure cites the durable feature `019` intake for those facts rather than restating them as GitHub-verified facts.
- No product or validation gap was found. No follow-up implementation feedback is open.

### Architect Disposition Of Feedback

- No Architect disposition required for product scope; no product or validation gap was found. The evidence boundary above is recorded for reviewer awareness.
