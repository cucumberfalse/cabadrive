# Tasks: Orchestrator Final Validation Loop

## Setup

- [x] T001 Confirm active implementation worktree is `/Users/chap/devel/cabadrive-012-orchestrator-final-validation-loop` and active branch is `codex/012-orchestrator-final-validation-loop`.
- [x] T002 Read `.specify/memory/constitution.md`, `AGENTS.md`, durable project docs, `docs/specify/README.md`, and `specs/012-orchestrator-final-validation-loop/{feature-request.md,spec.md,plan.md,tasks.md}` before editing.
- [x] T003 Record baseline `git status --short --branch` and ensure unrelated work is not modified.
- [x] T004 Search scoped durable workflow docs/templates for existing latest-main, Orchestrator, Analyst, Architect, validation, completion, PR slicing, merge readiness, feedback, and role-boundary language.
- [x] T005 Confirm Orchestrator provided the parallel-work warning and preserve existing dirty diffs, branches, commits, PRs, and process memory.

## Implementation

- [x] T006 Update `AGENTS.md` so new repository-changing work and each new task slice start from latest `origin/main` in a fresh isolated environment, while in-flight work is preserved and updated only through proper role routing.
- [x] T007 Update `AGENTS.md` and `CLAUDE.md` to define final Architect validation before final Analyst validation and to preserve all role boundaries.
- [x] T008 Update `.specify/memory/constitution.md` so the canonical workflow includes final Architect validation, final Analyst validation, bounded return handling, and completion only after preserved gates.
- [x] T009 Update `docs_project/project/devops/ai-pr-workflow.md` with the main narrative for work-cycle boundaries, cycle PR-set tracking, latest-main startup, final validation ordering, gap returns, return limits, and new-feature-request escalation.
- [x] T010 Update `docs_project/project/devops/review-contract.md` so Review Agent checks final-validation compliance, PR-set coverage, return-limit handling, Analyst-feedback Architect disposition, and preserved merge gates.
- [x] T011 Update `.specify/templates/feature-request-template.md` so future Analyst intake can include append-only final Analyst validation notes, Analyst return count, and escalation context without allowing Analyst planning or implementation.
- [x] T012 Update `.specify/templates/spec-template.md` so future Architect specs capture cycle definition, PR-set tracking, final Architect and Analyst validation responsibilities, return limits, and role-boundary constraints.
- [x] T013 Update `.specify/templates/plan-template.md` so future plans include final-validation verification mapping, latest-main startup evidence, cycle PR-set evidence, and return-limit evidence.
- [x] T014 Update `.specify/templates/tasks-template.md` so future process memory can track cycle PR set, final validation evidence, validation return counts, Analyst feedback, and Architect dispositions.
- [x] T015 Update `.github/pull_request_template.md` so PR authors/reviewers confirm latest-main startup, cycle PR-set coverage, final Architect validation, final Analyst validation, return-limit state, and merge-readiness gates.
- [x] T016 Update `specs/README.md` where feature-memory lifecycle guidance needs latest-main startup, cycle PR-set tracking, final validation notes, or escalation clarification.
- [x] T017 Keep implementation limited to scoped process docs/templates and `specs/012-orchestrator-final-validation-loop/tasks.md`; do not change product code, content, runtime files, package metadata, CI workflows, branch protection, secrets, GitHub settings, or production resources.
- [x] T018 Record any scope tension, proposed executable enforcement, or need for follow-up automation under "Implementation Agent Feedback" instead of implementing it in this feature.

## Verification

- [x] T019 Run `git diff --check`.
- [x] T020 Run `node scripts/check-feature-memory.mjs --worktree`.
- [x] T021 Run `pnpm run check:repo`.
- [x] T022 Run `pnpm run preflight`.
- [x] T023 Verify latest-main isolated startup language with text-search evidence from `plan.md`.
- [x] T024 Verify Analyst handoff, single-slice continuation, and additional task-slice latest-main isolation language with text-search evidence from `plan.md`.
- [x] T025 Verify work-cycle and cycle PR-set tracking language with text-search evidence from `plan.md`.
- [x] T026 Verify final Architect validation before Analyst validation and before completion/merge with text-search evidence from `plan.md`.
- [x] T027 Verify Architect validation scope across all PR slices, Architect-assigned tasks, architectural guidance, open tasks, process memory, and customer intent in spirit.
- [x] T028 Verify Architect gap handling, Architect-owned dispositions, Architect return count, and Architect limit-exceeded escalation.
- [x] T029 Verify final Analyst validation against customer intent in spirit and letter after Architect pass.
- [x] T030 Verify Analyst-owned validation notes, Analyst feedback routing through Architect disposition, Analyst return count, and Analyst limit-exceeded escalation.
- [x] T031 Verify preserved merge-readiness gates and role boundaries.
- [x] T032 Run `git diff --name-only` and manually confirm changed files are limited to scoped process docs/templates and `specs/012-orchestrator-final-validation-loop/*`.
- [x] T033 Record verification evidence, dead ends, decisions, known issues, and Implementation Agent feedback in this file before completion.

## Process Memory

### Dead Ends

- Initial `pnpm run preflight` attempt failed during `vite build` with `sh: vite: command not found` because the isolated worktree had no `node_modules`; resolved by running `pnpm install --frozen-lockfile` without package or lockfile changes, then rerunning preflight successfully.

### Decisions

- Implementation decision: Keep changes to documentation/templates and this feature memory only; no product, runtime, package metadata, lockfile, CI workflow, branch-protection, secret, GitHub setting, or production-resource files were edited.
- Implementation decision: Include the pre-existing untracked `feature-request.md`, `spec.md`, and `plan.md` in the final PR with `tasks.md` so the feature memory is complete, while only editing `tasks.md` inside the feature folder during implementation.
- Architect decision: Treat this as one process feature because all requested changes concern one final-validation loop around existing Orchestrator workflow.
- Architect decision: Define a work cycle as one repository-changing user request represented by one feature folder, spanning intake, planning, all PR slices, final validation, follow-up returns, and completion or escalation.
- Architect decision: Require a cycle PR set for final validation. The set must name each PR slice by purpose, branch, PR metadata, head SHA, status, and final-validation inclusion.
- Architect decision: Latest-main startup applies to new repository-changing work and each new task-slice worktree/branch. Existing in-flight work is preserved and brought current through proper role routing only when needed.
- Architect decision: The Analyst-created latest-main intake branch/worktree is valid handoff context for Architect planning. It may become the single implementation PR slice only if Orchestrator explicitly assigns it that way; additional slices get fresh latest-main worktrees/branches/PRs.
- Architect decision: Analyst final validation uses append-only Analyst-owned validation notes in `feature-request.md`. Analyst must not edit Architect artifacts, code, tests, docs outside the assigned Analyst-owned section, reviews, commits, pushes, PRs, or merge state.
- Architect decision: Failed Architect final-validation or Architect-disposition passes that return follow-up work count toward the Architect limit of 10 per cycle. Failed Analyst final-validation passes count toward the Analyst limit of 5 per cycle. Passing validations do not count as returns.
- Architect decision: If Architect limit is exceeded, Architect records the breach and tells Orchestrator to ask Analyst for a new feature request. If Analyst limit is exceeded, Analyst creates a new feature request in a separate latest-main branch/worktree.
- Architect decision: Implementation is documentation/template-only. No learner-facing app, runtime, CI workflow, branch-protection, executable guard, secret, GitHub setting, or production-resource changes are in scope.
- Review-fix decision: Address unresolved PR #65 P2 review thread `PRRT_kwDOSX65IM6A3Tdt` on `AGENTS.md` line 138 by making the Analyst role definition explicitly allow Orchestrator-invoked final Analyst validation after Architect passes, limited to append-only Analyst-owned `feature-request.md` validation notes or new feature-request creation only on limit-exceeded escalation.
- Review-fix decision: Reconcile parallel durable wording in `CLAUDE.md`, `.specify/memory/constitution.md`, `.specify/templates/feature-request-template.md`, `docs_project/project/devops/ai-pr-workflow.md`, and `specs/README.md` so "Analyst shuts down" means after intake until Orchestrator invokes final Analyst validation or a new intake request.
- Review-fix decision: Address unresolved PR #65 P2 review thread `PRRT_kwDOSX65IM6A3U6s` on `docs_project/project/devops/review-contract.md` lines 64-66 by distinguishing initial Review Agent review from Orchestrator final completion/merge-readiness evaluation. Initial review may proceed before final Architect/Analyst validation evidence exists and may review whether planned final-validation requirements are present; missing final-validation evidence blocks only the final completion/merge-readiness phase after implementation, review, checks, and follow-up development appear complete.

### Known Issues

- Executable enforcement for latest-main startup, cycle PR-set completeness, final validation ordering, return counts, and Analyst validation notes remains out of scope; enforcement is durable guidance plus manual author/review checks unless a future feature scopes automation.
- "Customer intent in spirit and letter" remains partly qualitative. This spec makes it reviewable by requiring source request, clarified answers, assumptions, acceptance expectations, PR-set evidence, and recorded validation notes.
- Multiple durable docs/templates repeat role workflow language, so implementation must use text search and manual diff review to prevent drift.
- Local dependency install was required for this isolated worktree before preflight could find `vite`; `pnpm install --frozen-lockfile` completed without tracked package or lockfile changes.

### Verification Evidence

- Implementation Agent setup: `pwd` returned `/Users/chap/devel/cabadrive-012-orchestrator-final-validation-loop`; `git status --short --branch` returned `## codex/012-orchestrator-final-validation-loop...origin/main` with only `?? specs/012-orchestrator-final-validation-loop/` before implementation edits.
- Implementation Agent read order before editing: read `.specify/memory/constitution.md`, `docs_project/README.md`, `docs_project/project-idea.md`, `docs_project/project/frontend/frontend-docs.md`, `docs_project/project/backend/backend-docs.md`, `docs_project/project/feature-inventory.md`, `docs_project/screens/learning-and-exam-flows.md`, `docs/specify/README.md`, `specs/012-orchestrator-final-validation-loop/{feature-request.md,spec.md,plan.md,tasks.md}`, `AGENTS.md`, and `CLAUDE.md`.
- Implementation Agent baseline search: ran `rg -n "Orchestrator|Analyst|Architect|Implementation Agent|Review Agent|origin/main|latest main|worktree|branch|PR|cycle|final validation|completion|merge|feedback|disposition|required checks|conflict" AGENTS.md CLAUDE.md docs_project/project/devops .github/pull_request_template.md .specify/memory/constitution.md .specify/templates specs/README.md` before edits.
- Implementation Agent parallel-work confirmation: user assignment explicitly warned that parallel Orchestrators and agents may be active and required preserving existing branches, dirty diffs, commits, PRs, and process memory.
- `git diff --check` passed with no whitespace errors.
- `node scripts/check-feature-memory.mjs --worktree` passed with `Feature-memory gate passed via specs/012-orchestrator-final-validation-loop/{spec,plan,tasks}.md`.
- `pnpm run check:repo` passed with `Repository baseline check passed.`
- Initial `pnpm run preflight` passed feature-memory, repo baseline, content validation, and 72 node tests, then failed at `vite build` because `node_modules` was absent (`vite: command not found`).
- `pnpm install --frozen-lockfile` completed successfully, adding local dependencies from the unchanged lockfile; no package or lockfile tracked changes resulted.
- Rerun `pnpm run preflight` passed: feature-memory gate, repository baseline, content validation (`460 category B fallback questions, 276 local image references`), 72 node tests, production build/service-worker generation, and 14 Playwright e2e tests.
- Final rerun after updating `tasks.md` passed: `git diff --check`, `node scripts/check-feature-memory.mjs --worktree`, `pnpm run check:repo`, and `pnpm run preflight` all exited 0; preflight again included content validation, 72 node tests, production build/service-worker generation, and 14 Playwright e2e tests.
- Acceptance text search AC-001 found latest-main/fresh-isolated/preserve-parallel guidance in `AGENTS.md`, `CLAUDE.md`, `.specify/memory/constitution.md`, `docs_project/project/devops/*`, `.specify/templates/*`, `.github/pull_request_template.md`, and `specs/README.md`.
- Acceptance text search AC-002 found Analyst-created handoff context, Architect planning, single PR slice, and additional task-slice language in `AGENTS.md`, `CLAUDE.md`, `docs_project/project/devops/ai-pr-workflow.md`, templates, and `specs/README.md`.
- Acceptance text search AC-003 found work-cycle and cycle PR-set tracking with purpose, branch, PR metadata, head SHA, status, and validation inclusion in `AGENTS.md`, `CLAUDE.md`, `docs_project/project/devops/ai-pr-workflow.md`, templates, `.github/pull_request_template.md`, and `specs/README.md`.
- Acceptance text search AC-004 found final Architect validation before Analyst validation/completion/merge in `AGENTS.md`, `CLAUDE.md`, `.specify/memory/constitution.md`, `docs_project/project/devops/*`, templates, and `.github/pull_request_template.md`.
- Acceptance text search AC-005 found Architect validation scope covering all PR slices, Architect-assigned tasks/dispositions, architectural guidance, open task state, process memory, and customer intent in spirit in `AGENTS.md`, `CLAUDE.md`, `docs_project/project/devops/*`, and templates.
- Acceptance text search AC-006 found Architect gap handling, Architect-owned dispositions, task/ticket/not-needed decisions, return counts, and limit escalation in `AGENTS.md`, `CLAUDE.md`, `docs_project/project/devops/ai-pr-workflow.md`, templates, and `specs/README.md`.
- Acceptance text search AC-007 and AC-008 found final Analyst validation after Architect, spirit-and-letter/customer-intent language, and original request/clarified answers/assumptions/acceptance expectations in `AGENTS.md`, `CLAUDE.md`, `docs_project/project/devops/ai-pr-workflow.md`, templates, and `specs/README.md`.
- Acceptance text search AC-009 and AC-010 found Analyst-owned validation notes, Analyst feedback routing through Architect accept/task/ticket/dispose before follow-up, return limits `10` and `5`, and new-feature-request escalation to separate latest-main branch/worktree in `AGENTS.md`, `CLAUDE.md`, `docs_project/project/devops/*`, templates, and `specs/README.md`.
- Acceptance text search AC-011 found preserved required checks, blocking review, conflicts, process memory, acceptance evidence, Implementation Agent feedback disposition, final guards, human merge-owner rules, and AI-written summary limits in `AGENTS.md`, `CLAUDE.md`, `.specify/memory/constitution.md`, `docs_project/project/devops/*`, and `.github/pull_request_template.md`.
- Scope check: `git diff --name-only` reported only scoped tracked docs/templates (`AGENTS.md`, `CLAUDE.md`, `.specify/memory/constitution.md`, `.specify/templates/*`, `.github/pull_request_template.md`, `docs_project/project/devops/*`, and `specs/README.md`); `git ls-files --others --exclude-standard` reported only the assigned feature-memory files under `specs/012-orchestrator-final-validation-loop/`.
- Review context: `gh api graphql` for PR #65 returned head `8baf460d4536846fb8e62f73a9a3dc1e8e9b43de` with one unresolved, not-outdated P2 review thread `PRRT_kwDOSX65IM6A3Tdt` on `AGENTS.md` line 138 requesting reconciliation between Analyst shutdown and final validation.
- Review-fix text search: `rg -n "Analyst (writes only|creates only|hands off|shuts down|owns repository request intake|final validation|validation notes|new feature request|Architect artifacts|merge actions)|writes exactly one intake|only .*intake artifact|until Orchestrator explicitly invokes" AGENTS.md CLAUDE.md .specify/memory/constitution.md .specify/templates/feature-request-template.md docs_project/project/devops/ai-pr-workflow.md specs/README.md` found explicit final-validation permissions and no unreconciled "only intake then shuts down" durable wording in the updated files.
- Review-fix verification: `git diff --check`, `node scripts/check-feature-memory.mjs --worktree`, and `pnpm run check:repo` all exited 0 after the P2 fix.
- Review-fix preflight: `pnpm run preflight` exited 0 after the P2 fix; it passed feature-memory gate, repository baseline, content validation (`460 category B fallback questions, 276 local image references`), 72 node tests, production build/service-worker generation, and 14 Playwright e2e tests. Vite reported the existing large-chunk warning only.
- Review-fix scope check: `git diff --name-only` reported only `.specify/memory/constitution.md`, `.specify/templates/feature-request-template.md`, `AGENTS.md`, `CLAUDE.md`, `docs_project/project/devops/ai-pr-workflow.md`, `specs/012-orchestrator-final-validation-loop/tasks.md`, and `specs/README.md`; `git ls-files --others --exclude-standard` reported no untracked files.
- Review context update: Orchestrator assigned a scoped review fix for PR #65 at head `eeca6c5a910ac445350406c3fbfbe4327531c33d` with unresolved P2 review thread `PRRT_kwDOSX65IM6A3U6s` on `docs_project/project/devops/review-contract.md` lines 64-66: "Don't block initial reviews on final validation evidence."
- Review-fix text search for `PRRT_kwDOSX65IM6A3U6s`: `rg -n "Initial Review Agent review|initial PR review|absence of final Architect|final-validation loop is invoked only after|final completion or merge-readiness|missing final-validation evidence" docs_project/project/devops/review-contract.md` found that initial Review Agent review may proceed before final-validation evidence exists, absence of final Architect/Analyst validation evidence is not itself blocking during initial PR review, and missing final-validation evidence is blocking during Orchestrator final completion or merge-readiness evaluation.
- Review-fix scope for `PRRT_kwDOSX65IM6A3U6s`: changed only `docs_project/project/devops/review-contract.md` and `specs/012-orchestrator-final-validation-loop/tasks.md`; no product code, content, runtime files, package or lockfiles, CI workflows, branch protection, secrets, GitHub settings, or production resources were edited.
- Review-fix verification for `PRRT_kwDOSX65IM6A3U6s`: `git diff --check`, `node scripts/check-feature-memory.mjs --worktree`, `pnpm run check:repo`, and the targeted `rg` text search all exited 0 after the review-contract wording change.
- Review-fix preflight for `PRRT_kwDOSX65IM6A3U6s`: `pnpm run preflight` exited 0 after the review-contract wording change; it passed feature-memory gate, repository baseline, content validation (`460 category B fallback questions, 276 local image references`), 72 node tests, production build/service-worker generation, and 14 Playwright e2e tests. Vite reported the existing large-chunk warning only.
- Final Architect validation setup for PR #65: active worktree `/Users/chap/devel/cabadrive-012-orchestrator-final-validation-loop`, branch `codex/012-orchestrator-final-validation-loop`, local head `cf314599f6d495c33667d4405fc72306efa51ba2`; `git diff --name-status origin/main...HEAD` showed only scoped process docs/templates and `specs/012-orchestrator-final-validation-loop/*`.
- Final Architect validation scope review: inspected active feature memory, PR diff scope from `origin/main...HEAD`, durable workflow wording for latest-main startup, cycle PR-set tracking, final Architect-before-Analyst validation, Analyst-owned validation notes, bounded return limits, preserved role boundaries, and preserved merge-readiness gates.
- Final Architect validation review-fix check: confirmed the resolved P2 findings are handled in durable wording. Analyst shutdown language now explicitly allows later Orchestrator-invoked final Analyst validation, and `review-contract.md` now distinguishes initial Review Agent review from final completion/merge-readiness evidence requirements.
- Final Architect validation whitespace check: `git diff --check origin/main...HEAD` exited 0.

### Cycle PR Set

- Purpose: process-only documentation/template implementation for `012-orchestrator-final-validation-loop`; branch: `codex/012-orchestrator-final-validation-loop`; PR metadata: PR #65, `https://github.com/cucumberfalse/cabadrive/pull/65`; implementation head SHA before final-validation evidence commit: `cf314599f6d495c33667d4405fc72306efa51ba2`; status: required GitHub checks reported green by Orchestrator, two prior P2 review findings fixed and resolved, Architect final validation passed for the implementation head, and Analyst final validation passed for the implementation head; included in final validation: yes.

### Final Validation Evidence

- Architect validation: pass for PR #65 current head `cf314599f6d495c33667d4405fc72306efa51ba2`; all Architect-assigned tasks and dispositions are complete, implementation matches the Architect guidance, no Architect gaps remain, process memory is current enough for final Analyst validation, and the review fixes were properly handled.
- Architect return count: 0.
- Analyst validation: pass for PR #65 implementation head `cf314599f6d495c33667d4405fc72306efa51ba2`; final Analyst validation checked the final result against the customer's desired outcome in spirit and letter, found no gaps, and updated only Analyst-owned notes in `feature-request.md`.
- Analyst return count: 0.
- Analyst feedback Architect disposition: none needed because final Analyst validation found no customer-intent gaps.
- Limit escalation: none.
- Final-validation evidence/process-memory commit scope: this follow-up commit is process-memory evidence only after implementation head `cf314599f6d495c33667d4405fc72306efa51ba2` passed Architect and Analyst validation; it preserves the Analyst-owned `feature-request.md` notes and updates only this `tasks.md` evidence section for Implementation Agent process memory.
- Architect setup: read `.specify/memory/constitution.md`, `docs_project/README.md`, `docs_project/project-idea.md`, `docs_project/project/frontend/frontend-docs.md`, `docs_project/project/backend/backend-docs.md`, `docs_project/project/feature-inventory.md`, `docs_project/screens/learning-and-exam-flows.md`, `docs/specify/README.md`, and `specs/012-orchestrator-final-validation-loop/feature-request.md` before creating Architect artifacts.
- Architect source orientation: inspected `AGENTS.md`, `CLAUDE.md`, `docs_project/project/devops/ai-pr-workflow.md`, `docs_project/project/devops/review-contract.md`, `.github/pull_request_template.md`, `.specify/templates/*`, `specs/README.md`, and prior feature memory for Analyst intake, Orchestrator autonomy, and Orchestrator-first routing.
- Architect baseline status: `pwd` returned `/Users/chap/devel/cabadrive-012-orchestrator-final-validation-loop`; `git branch --show-current` returned `codex/012-orchestrator-final-validation-loop`; `git status --short` showed untracked `specs/012-orchestrator-final-validation-loop/`.
- Active Architect artifacts were missing before creation: `specs/012-orchestrator-final-validation-loop/{spec.md,plan.md,tasks.md}` did not exist.
- Architect artifact check: `node scripts/check-feature-memory.mjs --worktree` passed with `No configured product paths changed; feature-memory gate passes.`
- Architect whitespace check: `git diff --check` produced no tracked-diff whitespace errors, and `rg -n "[ \t]+$" specs/012-orchestrator-final-validation-loop/{spec.md,plan.md,tasks.md}` found no trailing whitespace in the new Architect artifacts.
- Architect scope check: `git status --short --branch` reported branch `codex/012-orchestrator-final-validation-loop...origin/main` with only untracked `specs/012-orchestrator-final-validation-loop/`; no files were staged.

### Implementation Agent Feedback

- None.

## Architect Dispositions

- Analyst open question: "cycle" boundaries. Disposition: accepted and defined in `spec.md` and `plan.md` as one repository-changing request represented by one feature folder, including all PR slices and final validation returns until completion or escalation.
- Analyst open question: PR-set tracking. Disposition: accepted and required as a cycle PR set with branch, PR metadata, head SHA, status, purpose, and validation inclusion.
- Analyst open question: latest-main startup versus Analyst handoff and one worktree/branch/PR slicing. Disposition: accepted and framed as latest-main startup for new work and new task slices, with the Analyst-created latest-main handoff branch usable for Architect planning and optionally the single assigned PR slice.
- Analyst open question: Analyst final validation updates without role-boundary violation. Disposition: accepted as append-only Analyst-owned validation notes in `feature-request.md`; Analyst does not edit Architect artifacts or implementation/review/merge state.
- Analyst open question: merge-readiness gates and role boundaries. Disposition: preserved explicitly; final validation adds gates and evidence but does not replace required checks, review, conflict, process-memory, acceptance-evidence, feedback-disposition, or human merge-owner gates.
- Analyst open question: implementation scope. Disposition: documentation/templates plus feature memory only; executable enforcement is out of scope and should be future feedback if desired.
