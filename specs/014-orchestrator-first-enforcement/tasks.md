# Tasks: Orchestrator-First Enforcement

## Setup

- [x] T001 Confirm active implementation worktree and branch match Orchestrator assignment before editing.
- [x] T002 Confirm complete feature memory exists: `specs/014-orchestrator-first-enforcement/{feature-request.md,spec.md,plan.md,tasks.md}`.
- [x] T003 Read `.specify/memory/constitution.md`, `AGENTS.md`, durable project docs, `docs/specify/README.md`, active feature memory, and relevant prior process memory for `003`, `007`, `011`, and sibling `012` before editing.
- [x] T004 Search scoped durable workflow docs/templates for existing repository-changing, read-only, Orchestrator, Analyst, Architect, Implementation Agent, Review Agent, feature-memory, recovery, worktree, parallel-work, review, and final-validation language.
- [x] T005 Record baseline `git status --short --branch`, note unrelated untracked/dirty work, and preserve sibling `012`/`013` worktrees, branches, PRs, diffs, and process memory.

## Implementation

- [x] T006 Update `AGENTS.md` so a non-Orchestrator active model that receives a new repository-changing request must stop, must not self-promote into Orchestrator or Implementation Agent, and must route the request to Orchestrator.
- [x] T007 Update `AGENTS.md` to distinguish read-only requests from repository-changing requests and to require Orchestrator-first routing when a read-only interaction becomes repository-changing.
- [x] T008 Update `AGENTS.md` to preserve Orchestrator delegation, Analyst-first intake, Architect artifact-only boundaries, Implementation Agent complete-feature-memory prerequisites, and Review Agent non-mutating boundaries.
- [x] T009 Update `AGENTS.md` with accidental-direct-edit recovery: stop immediately, report the process failure, preserve user/sibling work, avoid destructive cleanup, and restart through Orchestrator/user disposition.
- [x] T010 Update `CLAUDE.md` with the same active-model stop condition, read-only distinction, implementation prerequisites, and recovery path so local agent behavior matches repository protocol.
- [x] T011 Update `.specify/memory/constitution.md` only as needed to add concise stop-condition, read-only distinction, and accidental-direct-edit recovery principles without duplicating detailed workflow docs.
- [x] T012 Update `.specify/templates/feature-request-template.md` so future Analyst intake can record Orchestrator routing context, read-only-to-repository-changing transition context, accidental-start recovery context, and parallel-work constraints.
- [x] T013 Update `.specify/templates/spec-template.md` and `.specify/templates/plan-template.md` so future Architect artifacts name active-model stop conditions, implementation prerequisites, recovery requirements, sibling-process coordination, and out-of-scope executable enforcement where relevant.
- [x] T014 Update `.specify/templates/tasks-template.md` so future tasks record Orchestrator assignment, complete feature memory, isolated worktree/branch/PR slice, sibling-work preservation, recovery notes, review enforcement, verification evidence, and Implementation Agent feedback.
- [x] T015 Update `docs_project/project/devops/ai-pr-workflow.md` as the main durable process narrative for active-model routing, read-only exceptions, repository-changing transitions, accidental-direct-edit recovery, and coordination with `011`/`012`.
- [x] T016 Update `docs_project/project/devops/review-contract.md` so Review Agent checks Orchestrator-first bypasses, role self-promotion, missing feature memory, unsafe recovery, sibling-work mutation, and contradictions with `011`/`012`.
- [x] T017 Update `.github/pull_request_template.md` if needed so PR authors/reviewers confirm Orchestrator-first routing, complete feature memory, no unhandled bypass/recovery issue, and sibling-work preservation.
- [x] T018 Update `specs/README.md` if needed to align feature-memory lifecycle guidance with the active-model stop condition, read-only distinction, and recovery path.
- [x] T019 Keep implementation limited to scoped process docs/templates and `specs/014-orchestrator-first-enforcement/tasks.md`; do not change product code, content, runtime files, package metadata, lockfiles, CI workflows, branch protection, secrets, production resources, or sibling feature memory.
- [x] T020 Record any scope tension, proposed executable enforcement, or `011`/`012` coordination issue under "Implementation Agent Feedback" instead of broadening implementation directly.

## Verification

- [x] T021 Run `git diff --check`.
- [x] T022 Run `node scripts/check-feature-memory.mjs --worktree`.
- [x] T023 Run `pnpm run check:repo`.
- [x] T024 Run `pnpm run preflight`.
- [x] T025 Verify non-Orchestrator active-model stop-condition language with text-search evidence from `plan.md`.
- [x] T026 Verify read-only versus repository-changing distinction and transition language with text-search evidence from `plan.md`.
- [x] T027 Verify Orchestrator-first Analyst routing and no-direct-Orchestrator-edit language remains present with text-search evidence from `plan.md`.
- [x] T028 Verify Architect artifact-only boundary and Implementation Agent complete-feature-memory prerequisites with text-search evidence from `plan.md`.
- [x] T029 Verify accidental-direct-edit recovery guidance, stop/report/preserve/restart language, and destructive-cleanup prohibition with text-search evidence from `plan.md`.
- [x] T030 Verify sibling/parallel work preservation language with text-search evidence from `plan.md`.
- [x] T031 Verify Review Agent enforcement checks for bypasses, missing feature memory, role-boundary violations, unsafe recovery, and `011`/`012` consistency with text-search evidence from `plan.md`.
- [x] T032 Run `git diff --name-only` and manually confirm changed files are limited to scoped process docs/templates and `specs/014-orchestrator-first-enforcement/*`.
- [x] T033 Record verification evidence, dead ends, decisions, known issues, and Implementation Agent feedback in this file before completion.

## Process Memory

### Dead Ends

- Conflict-resolution worktree initially had no `node_modules`, so the first post-merge `pnpm run preflight` failed at `vite build` with `sh: vite: command not found` after content validation and 72/72 node tests passed. Mitigation: ran `pnpm install --frozen-lockfile`, which installed dependencies from the unchanged lockfile and produced no tracked package or lockfile changes, then reran preflight successfully.
- Initial `pnpm run preflight` could not complete because this worktree had no `node_modules`; `vite build` failed with `sh: vite: command not found`. Mitigation: ran `pnpm install --frozen-lockfile`, which installed dependencies from the unchanged lockfile, then reran `pnpm run preflight` successfully.
- Initial patch application used the default workspace path and created the Architect artifacts under `/Users/chap/devel/cabadrive/specs/014-orchestrator-first-enforcement/` instead of the assigned worktree. Correction: moved the three Architect artifacts into `/Users/chap/devel/cabadrive-013-learning-content-ui-polish/specs/014-orchestrator-first-enforcement/` with `apply_patch`, removed the empty directory I created in the original workspace, and verified no remaining 014 files are present there.
- Review follow-up temp-copy attempt initially failed because a zsh loop variable named `path` shadowed zsh's command search path, causing standard commands to be unavailable inside that shell. Correction: reran the clean temp-clone evidence command with a non-special loop variable; no repository files were changed by the failed attempt.

### Decisions

- Merge-conflict resolution decision: updated branch `codex/014-orchestrator-first-enforcement` in isolated worktree `/Users/chap/devel/cabadrive-014-orchestrator-first-enforcement` by merging latest `origin/main` (`9534ab054b6b22ccd56e5c204ab8469c027faef9`) without squash, preserving feature 014 active-model stop/recovery/review enforcement while retaining main's feature 012 latest-main/final-validation-loop guidance.
- Implementation decision: Updated `.specify/templates/checklist-template.md` in addition to the task-named templates because the feature scope allows `.specify/templates/*` and checklist reuse benefits from the same Orchestrator-first/recovery gate.
- Implementation decision: No executable enforcement, CI workflow, branch-protection, package, lockfile, product, content, runtime, or sibling-feature changes were made; enforcement remains durable docs/templates plus review/process evidence as scoped.
- Architect decision: This feature is process/workflow hardening only and must not include learner-facing app, runtime, CI, branch-protection, executable guard, secret, or production-resource changes.
- Architect decision: `011-orchestrator-analyst-routing` remains the baseline for Orchestrator-first intake and Analyst-first routing. This feature adds active-model stop conditions, recovery, and review enforcement around that baseline.
- Architect decision: Sibling `012-orchestrator-final-validation-loop` remains the place for latest-main startup, cycle PR-set, final-validation, effective-content-head, and merge-readiness loop mechanics. This feature must preserve and coordinate with those rules, not duplicate or replace them.
- Architect decision: Read-only inspection, explanation, status reporting, summarization, and non-mutating review remain allowed without creating a new feature folder. The Orchestrator-first stop condition triggers when the request asks for or implies repository mutation.
- Architect decision: Accidental direct-edit recovery is stop/report/preserve/restart through Orchestrator/user disposition. It does not authorize destructive cleanup, hidden continuation, silent role switching, or reverting user/sibling work.
- Architect decision: Executable enforcement may be useful future work, but this feature scopes implementation to durable docs/templates and feature memory.

### Known Issues

- PR #66 still has an external GitHub Actions `AI Review` billing/spending-limit blocker. This is not code-fixable in feature 014 scope, and no workflow, branch-protection, or billing-related changes were made.
- Documentation/template enforcement still depends on agents and reviewers reading and applying the protocol; executable guard automation remains out of scope.
- Sibling `012` may contain in-flight wording that has not landed on this branch. Implementation must inspect it read-only if available and record any coordination issue instead of editing sibling work.
- Current worktree also contains untracked `specs/013-learning-content-ui-polish/`; this feature must preserve it and avoid changing 013 memory.
- No `011`/sibling `012` conflict was found that required Architect disposition; this feature references those process features as preserved baselines instead of duplicating their full final-validation mechanics.
- Review finding P2 disposition: the earlier `node scripts/check-feature-memory.mjs --worktree` evidence was not sufficient for merge readiness because it passed via preserved untracked `specs/013-learning-content-ui-polish/` while `docs_project/` is a configured product path. Follow-up evidence now uses a clean temporary clone containing the current modified tracked files and only assigned `specs/014-orchestrator-first-enforcement/` memory, proving the feature-memory gate passes via 014 without staging or mutating 013.

### Verification Evidence

- Conflict resolution setup: created and used isolated worktree `/Users/chap/devel/cabadrive-014-orchestrator-first-enforcement` on `codex/014-orchestrator-first-enforcement`, fetched `origin`, and merged latest `origin/main` (`9534ab054b6b22ccd56e5c204ab8469c027faef9`) into PR #66 branch without squash.
- Conflict resolution scope: resolved overlaps in `.github/pull_request_template.md`, `.specify/templates/feature-request-template.md`, `.specify/templates/spec-template.md`, `.specify/templates/tasks-template.md`, `AGENTS.md`, `CLAUDE.md`, `docs_project/project/devops/ai-pr-workflow.md`, `docs_project/project/devops/review-contract.md`, and `specs/README.md` by combining 014 Orchestrator-first stop/recovery enforcement with main's 012 latest-main/final-validation rules.
- Conflict marker check: `rg -n "^<<<<<<<|^=======|^>>>>>>>" .github/pull_request_template.md .specify/templates/feature-request-template.md .specify/templates/spec-template.md .specify/templates/tasks-template.md AGENTS.md CLAUDE.md docs_project/project/devops/ai-pr-workflow.md docs_project/project/devops/review-contract.md specs/README.md` returned no matches after resolution.
- Whitespace check during conflict resolution: `git diff --check` exited 0 before final verification rerun.
- Post-merge scoped diff review: `git diff --cached --name-status origin/main` before the merge commit showed only scoped feature 014 process docs/templates and `specs/014-orchestrator-first-enforcement/*` relative to `origin/main`; main's `specs/012-orchestrator-final-validation-loop/*` files were present only as second-parent merge content and not as PR #66 diff against `origin/main`.
- Post-merge commit: created merge commit `c27a688` (`Merge origin/main into orchestrator enforcement`) with no unmerged paths.
- Post-merge whitespace checks: `git diff --check` and `git diff --cached --check` exited 0.
- Post-merge feature-memory check: `node scripts/check-feature-memory.mjs origin/main HEAD` exited 0 with `Feature-memory gate passed via specs/014-orchestrator-first-enforcement/{spec,plan,tasks}.md`.
- Post-merge repo baseline check: `pnpm run check:repo` exited 0 with `Repository baseline check passed.`
- Post-merge preflight: first `pnpm run preflight` failed only because the fresh worktree lacked `node_modules` (`sh: vite: command not found`); after `pnpm install --frozen-lockfile`, rerun `pnpm run preflight` exited 0. Evidence included feature-memory worktree pass, repository baseline pass, content validation for 460 category B fallback questions and 276 local image references, 72/72 node tests passed, production build completed with the existing large chunk warning, service worker generated with 280 cached assets, and 14/14 Playwright tests passed.
- Implementation Agent setup: `git switch -c codex/014-orchestrator-first-enforcement origin/main` succeeded in `/Users/chap/devel/cabadrive-013-learning-content-ui-polish`; `git status --short --branch` reported `## codex/014-orchestrator-first-enforcement...origin/main` with untracked `specs/013-learning-content-ui-polish/` and `specs/014-orchestrator-first-enforcement/`.
- Implementation Agent feature-memory check: read `specs/014-orchestrator-first-enforcement/{feature-request.md,spec.md,plan.md,tasks.md}` before durable edits.
- Implementation Agent required-docs read: read `.specify/memory/constitution.md`, `AGENTS.md`, `CLAUDE.md`, `docs_project/README.md`, `docs_project/project-idea.md`, `docs_project/project/frontend/frontend-docs.md`, `docs_project/project/backend/backend-docs.md`, `docs_project/project/feature-inventory.md`, `docs_project/screens/learning-and-exam-flows.md`, `docs/specify/README.md`, scoped devops docs, templates, PR template, and `specs/README.md`.
- Implementation Agent prior-process read: inspected process memory for `003-analyst-role-intake`, `007-agent-workflow-autonomy`, `011-orchestrator-analyst-routing`, and sibling `/Users/chap/devel/cabadrive-012-orchestrator-final-validation-loop/specs/012-orchestrator-final-validation-loop/` read-only.
- Implementation Agent baseline search: `rg -n "repository-changing|read-only|Orchestrator|Analyst|Architect|Implementation Agent|Review Agent|feature-request|feature memory|stop|recover|recovery|revert|destructive|worktree|parallel|final validation|merge|self-promot|active model" AGENTS.md CLAUDE.md docs_project/project/devops .github/pull_request_template.md .specify/memory/constitution.md .specify/templates specs/README.md` found existing Orchestrator-first, role-boundary, parallel-work, and merge-readiness language, but only limited active-model stop/recovery wording.
- Implementation scope review: durable edits were limited to `.github/pull_request_template.md`, `.specify/memory/constitution.md`, `.specify/templates/checklist-template.md`, `.specify/templates/feature-request-template.md`, `.specify/templates/plan-template.md`, `.specify/templates/spec-template.md`, `.specify/templates/tasks-template.md`, `AGENTS.md`, `CLAUDE.md`, `docs_project/project/devops/ai-pr-workflow.md`, `docs_project/project/devops/review-contract.md`, `specs/README.md`, and this `tasks.md`.
- `git diff --check`: passed before process-memory evidence update.
- `node scripts/check-feature-memory.mjs --worktree`: exited 0, reporting `Feature-memory gate passed via specs/013-learning-content-ui-polish/{spec,plan,tasks}.md`. This is retained as a worktree-state check only; it is not accepted as 014 merge-readiness evidence because the command selected unrelated preserved untracked `013` memory.
- Review follow-up 014-specific feature-memory evidence: created a clean temporary clone from this worktree, copied current modified tracked files into it, copied only `specs/014-orchestrator-first-enforcement/`, intentionally did not copy `specs/013-learning-content-ui-polish/`, and ran `node "$tmp/scripts/check-feature-memory.mjs" --target "$tmp" --worktree`. The temp clone status showed `M docs_project/project/devops/ai-pr-workflow.md` and `?? specs/014-orchestrator-first-enforcement/`, with no `specs/013-learning-content-ui-polish/` entry; the checker exited 0 with `Feature-memory gate passed via specs/014-orchestrator-first-enforcement/{spec,plan,tasks}.md`.
- `pnpm run check:repo`: passed with `Repository baseline check passed.`
- Initial `pnpm run preflight`: failed at `vite build` because `node_modules` was missing after content validation passed and 72/72 node tests passed.
- `pnpm install --frozen-lockfile`: completed successfully, installing existing dependencies from the unchanged lockfile; no package or lockfile tracked changes resulted.
- Rerun `pnpm run preflight`: passed. Evidence included feature-memory gate exit 0 with the same `013` selection caveat, repository baseline pass, content validation pass for 460 category B fallback questions and 276 local image references, 72/72 node tests passed, production build completed with the existing large chunk warning, service worker generated with 280 cached assets, and 14/14 Playwright tests passed.
- SC-001 text search: `rg -n "non-Orchestrator|active model|must stop|stop condition|must not.*implement|self-promot" AGENTS.md CLAUDE.md docs_project/project/devops .specify/memory/constitution.md specs/README.md` found non-Orchestrator active-model stop and no-self-promotion language in `AGENTS.md`, `CLAUDE.md`, `.specify/memory/constitution.md`, `docs_project/project/devops/*`, and `specs/README.md`.
- SC-002 text search: `rg -n "read-only|inspection|status|summar|repository-changing|becomes repository-changing|transition" AGENTS.md CLAUDE.md docs_project/project/devops .specify/templates specs/README.md` found read-only and repository-changing transition language in `AGENTS.md`, `CLAUDE.md`, devops docs, templates, and `specs/README.md`.
- SC-003 text search: `rg -n "Orchestrator.*first|invoke.*Analyst|Analyst.*first|remain.*Orchestrator|does not directly edit|must not directly edit" AGENTS.md CLAUDE.md docs_project/project/devops .specify/memory/constitution.md specs/README.md` found Orchestrator-first, Analyst-first, and no-direct-edit language in durable guidance.
- SC-004 text search: `rg -n "Architect.*spec.md|Architect.*plan.md|Architect.*tasks.md|artifact.*boundary|complete feature memory|feature-request.md.*spec.md.*plan.md.*tasks.md|isolated worktree" AGENTS.md CLAUDE.md docs_project/project/devops .specify/templates specs/README.md` found Architect artifact boundary and Implementation Agent complete-feature-memory/isolation prerequisites across scoped docs/templates.
- SC-005 text search: `rg -n "accidental|direct edit|recovery|stop.*report|preserve|restart.*Orchestrator|destructive|revert.*authoriz" AGENTS.md CLAUDE.md docs_project/project/devops .specify/templates specs/README.md` found accidental direct-edit recovery, stop/report/preserve/restart, destructive-cleanup, and unauthorized-revert language.
- SC-006 text search: `rg -n "sibling|parallel work|worktree|dirty diff|branch|PR state|process memory|preserve" AGENTS.md CLAUDE.md docs_project/project/devops .github/pull_request_template.md .specify/templates specs/README.md` found sibling/parallel work preservation language across agent docs, devops docs, PR template, templates, and `specs/README.md`.
- SC-007 text search: `rg -n "Review Agent|review.*bypass|missing feature memory|role-boundary|role boundary|unsafe recovery|011|012|contradict" AGENTS.md CLAUDE.md docs_project/project/devops .github/pull_request_template.md specs/README.md` found Review Agent bypass, missing-memory, role-boundary, unsafe-recovery, and `011`/`012` consistency checks in scoped durable guidance.
- `git diff --name-only`: reported only scoped tracked process docs/templates: `.github/pull_request_template.md`, `.specify/memory/constitution.md`, `.specify/templates/checklist-template.md`, `.specify/templates/feature-request-template.md`, `.specify/templates/plan-template.md`, `.specify/templates/spec-template.md`, `.specify/templates/tasks-template.md`, `AGENTS.md`, `CLAUDE.md`, `docs_project/project/devops/ai-pr-workflow.md`, `docs_project/project/devops/review-contract.md`, and `specs/README.md`.
- `git ls-files --modified --others --deleted --exclude-standard`: additionally reported pre-existing untracked `specs/013-learning-content-ui-polish/*` and assigned untracked `specs/014-orchestrator-first-enforcement/*`. Manual scope review: `013` was preserved exactly and not edited; `014` changes are limited to this process-memory update plus existing assigned feature memory.
- `git status --short --branch`: reported `## codex/014-orchestrator-first-enforcement...origin/main`, modified scoped process docs/templates, and untracked `specs/013-learning-content-ui-polish/` plus `specs/014-orchestrator-first-enforcement/`.
- Final rerun after process-memory update: `git diff --check`, `node scripts/check-feature-memory.mjs --worktree`, and `pnpm run check:repo` all exited 0; feature-memory output again selected the preserved untracked `013` folder, so the 014-specific temp-clone evidence above is the merge-readiness evidence for this review follow-up.
- Review follow-up rerun after replacing the misleading evidence: `git diff --check`, `node scripts/check-feature-memory.mjs --worktree`, `pnpm run check:repo`, and the clean temp-clone 014-specific feature-memory command all exited 0. The direct worktree checker still selected preserved untracked `013`, while the clean temp clone showed no `013` status entry and passed via `specs/014-orchestrator-first-enforcement/{spec,plan,tasks}.md`.
- Architect setup: read `specs/014-orchestrator-first-enforcement/feature-request.md`, `.specify/memory/constitution.md`, `docs_project/README.md`, `docs_project/project-idea.md`, prior process memory for `003`, `007`, `011`, and sibling `012` planning artifacts before creating Architect artifacts.
- Architect baseline status: `git status --short --branch` reported branch `codex/013-learning-content-ui-polish...origin/main` with untracked `specs/013-learning-content-ui-polish/` and `specs/014-orchestrator-first-enforcement/`.
- Architect artifact scope: created only `specs/014-orchestrator-first-enforcement/spec.md`, `specs/014-orchestrator-first-enforcement/plan.md`, and `specs/014-orchestrator-first-enforcement/tasks.md`.
- Architect feature-memory check: `node scripts/check-feature-memory.mjs --worktree` passed with `No configured product paths changed; feature-memory gate passes.`
- Architect whitespace check: `rg -n "[ \t]+$" specs/014-orchestrator-first-enforcement/spec.md specs/014-orchestrator-first-enforcement/plan.md specs/014-orchestrator-first-enforcement/tasks.md` found no trailing whitespace.
- Architect final status: `git status --short --branch` reported only untracked `specs/013-learning-content-ui-polish/` and `specs/014-orchestrator-first-enforcement/` in the assigned worktree; `git -C /Users/chap/devel/cabadrive status --short --branch -- specs/014-orchestrator-first-enforcement` reported no 014 changes in the original workspace.

### Implementation Agent Feedback

- None.

## Architect Dispositions

- None; no Implementation Agent feedback has been reported.
