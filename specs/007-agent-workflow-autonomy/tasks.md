# Tasks: Agent Workflow Autonomy And Role-Boundary Hardening

## Setup

- [x] T001 Confirm active implementation worktree, branch, and assigned feature folder.
- [x] T002 Read `feature-request.md`, `spec.md`, and `plan.md` before editing.
- [x] T003 Search scoped durable docs/templates for existing role, PR slicing, merge readiness, review, and feedback language.
- [x] T004 Confirm whether `CLAUDE.md` exists and record the result before editing.

## Implementation

- [x] T005 Update `AGENTS.md` so Orchestrator autonomy, no-direct-file-edits, subagent no-role-switching, and role-specific repository permissions are explicit.
- [x] T006 Update `CLAUDE.md` if present so it aligns with `AGENTS.md`; if absent, record that no edit was possible.
- [x] T007 Update `docs_project/project/devops/ai-pr-workflow.md` with proceed/retry/reroute/ask rules, one-slice/one-worktree/one-branch/one-PR guidance, stuck-subagent preservation, merge-ready gates, and GitHub/local evidence requirements.
- [x] T008 Update `docs_project/project/devops/review-contract.md` so reviews check role boundaries, merge readiness, evidence, feedback routing, and unsafe completion conditions.
- [x] T009 Update `.github/pull_request_template.md` so authors/reviewers confirm feature memory, task-slice scope, role boundaries, feedback disposition, and merge-readiness evidence.
- [x] T010 Keep this `tasks.md` current in the same PR as implementation work.
- [x] T011 Record any Implementation Agent feedback or scope tension in the feedback section below instead of implementing outside scope.
- [x] T012 Obtain Architect disposition for every recorded feedback item before completion.

## Verification

- [x] T013 Verify Orchestrator no-direct-edit guidance with text-search evidence.
- [x] T014 Verify subagent no-role-switching guidance with text-search evidence.
- [x] T015 Verify autonomous proceed/retry/reroute/ask and stuck-subagent preservation guidance with text-search evidence.
- [x] T016 Verify one-slice/one-worktree/one-branch/one-PR guidance with text-search evidence.
- [x] T017 Verify merge-ready and auto-merge precondition guidance with text-search evidence.
- [x] T018 Verify completion evidence uses GitHub and local state, not only AI summaries.
- [x] T019 Verify role-specific commit, push, PR, review, rerun, and merge permissions by manual diff review.
- [x] T020 Verify negative scenarios are covered: red/missing/running required checks, blocking review findings, conflicts, stale process memory, missing evidence, and unresolved Implementation Agent feedback block merge/completion.
- [x] T021 Run `node scripts/check-feature-memory.mjs --worktree`.
- [x] T022 Run `pnpm run check:repo`.
- [x] T023 Run `pnpm run preflight` before push/PR.
- [x] T024 Run `git diff --name-only` and confirm changes are limited to scoped docs/templates plus `specs/007-agent-workflow-autonomy/*`.
- [x] T025 Perform manual diff review for docs/process consistency across agent guidance, devops docs, review contract, and PR template.
- [x] T026 Record final verification evidence in this file.

## Process Memory

### Dead Ends

- First `pnpm run preflight` attempt failed at `vite build` with `sh: vite: command not found` because `node_modules` was absent in the fresh worktree. Ran `pnpm install --frozen-lockfile`; lockfile was already up to date and no package files changed. Reran preflight successfully.

### Decisions

- Treat this feature as process documentation/template work only.
- Keep learner-facing app behavior, content, Docker/runtime, branch protection, CI auto-merge implementation, and executable `feature-request.md` guard enforcement out of scope.
- Define auto-merge as an authorized Orchestrator action under merge-ready preconditions, not a new CI automation feature.
- Require Implementation Agent feedback to be routed to Architect disposition before completion.
- `CLAUDE.md` exists and was updated in scope to align with `AGENTS.md`.
- No Implementation Agent feedback was recorded, so no additional Architect disposition was required.

### Known Issues

- Executable `feature-request.md` guard enforcement remains out of scope for this feature and requires a future Architect-scoped feature if desired.
- None affecting this implementation slice.

### Verification Evidence

- Architect setup: created `spec.md`, `plan.md`, and `tasks.md` only in `specs/007-agent-workflow-autonomy/`.
- Setup: `pwd` returned `/Users/chap/devel/cabadrive-007-agent-workflow-intake`; `git status --short --branch` showed `## codex/007-agent-workflow-intake...origin/main` with `specs/007-agent-workflow-autonomy/` untracked before edits.
- Read order completed through `.specify/memory/constitution.md`, `AGENTS.md`, durable project docs, `docs/specify/README.md`, and `specs/007-agent-workflow-autonomy/{feature-request.md,spec.md,plan.md,tasks.md}`.
- Initial scope search completed with `rg -n "Orchestrator|Analyst|Architect|Implementation Agent|Review Agent|worktree|branch|PR|merge|auto-merge|feedback|required checks|conflict|inline review" AGENTS.md CLAUDE.md docs_project/project/devops .github specs/007-agent-workflow-autonomy`.
- `CLAUDE.md` exists (`ls -l CLAUDE.md`) and was edited in this PR.
- T013: `rg -n "Orchestrator.*(never|must not).*edit|directly edit|delegat" AGENTS.md CLAUDE.md docs_project/project/devops` found matches in `AGENTS.md`, `CLAUDE.md`, `docs_project/project/devops/ai-pr-workflow.md`, and `docs_project/project/devops/review-contract.md`.
- T014: `rg -n "switch roles|cannot switch|must not switch|reroute" AGENTS.md CLAUDE.md docs_project/project/devops` found no-role-switch and reroute guidance in `AGENTS.md`, `CLAUDE.md`, AI PR workflow docs, and review contract.
- T015: `rg -n "proceed|retry|rerun|reroute|ask the human|stuck subagent|replace" AGENTS.md CLAUDE.md docs_project/project/devops` found proceed, retry/rerun, reroute, ask-human, and stuck-subagent handling guidance.
- T016: `rg -n "one .*worktree.*branch.*PR|one task slice|isolated worktree" AGENTS.md CLAUDE.md docs_project/project/devops .github/pull_request_template.md` found one-slice/one-worktree/one-branch/one-PR guidance in agent docs, AI PR workflow, review contract, and PR template.
- T017: `rg -n "auto-merge|merge-ready|required checks|blocking review|conflicts|authorized" AGENTS.md CLAUDE.md docs_project/project/devops .github/pull_request_template.md` found merge-ready and authorized auto-merge preconditions across durable docs and the PR template.
- T018: `rg -n "GitHub state|local.*state|local.*guard|AI-written|summary|evidence" AGENTS.md CLAUDE.md docs_project/project/devops .github/pull_request_template.md` found GitHub/local guard evidence requirements and AI-summary limits.
- T019/T020: manual diff review confirmed role-specific commit, push, PR, review, rerun, and merge permissions are aligned, and negative merge blockers cover red/missing/running checks, blocking review findings, conflicts, stale process memory, missing evidence, and unresolved Implementation Agent feedback.
- `git diff --check` passed.
- `rg -n "[^\\x00-\\x7F]" AGENTS.md CLAUDE.md docs_project/project/devops/ai-pr-workflow.md docs_project/project/devops/review-contract.md .github/pull_request_template.md specs/007-agent-workflow-autonomy` found only pre-existing title punctuation in `AGENTS.md` and `CLAUDE.md`.
- `node scripts/check-feature-memory.mjs --worktree` passed: `Feature-memory gate passed via specs/007-agent-workflow-autonomy/{spec,plan,tasks}.md`.
- `pnpm run check:repo` passed: `Repository baseline check passed.`
- First `pnpm run preflight` attempt failed because `node_modules` was missing and `vite` was unavailable; `pnpm install --frozen-lockfile` completed with lockfile up to date.
- Second `pnpm run preflight` passed: content validation passed, 72 node tests passed, production build and service worker generation passed, and 8 Playwright tests passed.
- `git diff --name-only` showed only `.github/pull_request_template.md`, `AGENTS.md`, `CLAUDE.md`, `docs_project/project/devops/ai-pr-workflow.md`, and `docs_project/project/devops/review-contract.md`; `git status --short` also showed the in-scope untracked feature folder `specs/007-agent-workflow-autonomy/`.
- Manual diff review covered `AGENTS.md`, `CLAUDE.md`, `docs_project/project/devops/ai-pr-workflow.md`, `docs_project/project/devops/review-contract.md`, `.github/pull_request_template.md`, and this feature memory for consistency and scope.

## Implementation Agent Feedback

- None.

## Architect Dispositions

- No Architect disposition required because no Implementation Agent feedback has been recorded.
