# Tasks: Orchestrator-First Analyst Routing

## Setup

- [x] T001 Confirm active implementation worktree is `/Users/chap/devel/cabadrive-011-orchestrator-analyst-routing-intake` and active branch is `codex/011-orchestrator-analyst-routing-intake`.
- [x] T002 Read `.specify/memory/constitution.md`, `AGENTS.md`, durable project docs, `docs/specify/README.md`, and `specs/011-orchestrator-analyst-routing/{feature-request.md,spec.md,plan.md,tasks.md}` before editing.
- [x] T003 Search scoped durable workflow docs/templates for existing repository-changing, Analyst, Orchestrator, clarification, merge, worktree, branch, PR, and parallel-work language.
- [x] T004 Record baseline `git status --short --branch` and ensure unrelated work is not modified.

## Implementation

- [x] T005 Update `AGENTS.md` so repository-changing user requests default to Orchestrator entry and Orchestrator invokes Analyst first while remaining strictly in the Orchestrator role.
- [x] T006 Update `AGENTS.md` role guidance so Analyst requirement clarification flows through Orchestrator, Analyst is the only normal-flow role that may initiate such clarification, and later roles use assumptions/feedback/Architect disposition unless a documented blocker exception applies.
- [x] T007 Update `AGENTS.md` parallel-work guidance so Orchestrator creates or requires isolated worktrees/branches/PR slices and explicitly warns subagents that parallel agents may be active and existing work must be preserved.
- [x] T008 Update `AGENTS.md` handoff and merge guidance so Orchestrator continues after Analyst handoff through Architect, implementation, review, checks, and user-authorized merge without asking again, while preserving all merge-readiness gates and default human merge ownership when authorization is absent.
- [x] T009 Update `CLAUDE.md` to align implementation-agent operating rules with Orchestrator-first routing, Analyst-through-Orchestrator clarification, parallel-work isolation, and authorized merge gate preservation.
- [x] T010 Update `.specify/memory/constitution.md` only as needed so the canonical workflow starts with Orchestrator receiving repository-changing work and invoking Analyst before Architect planning.
- [x] T011 Update `.specify/templates/feature-request-template.md` so future Analyst intake can record Orchestrator routing, clarification questions/answers relayed through Orchestrator, branch/worktree handoff context, and parallel-work assumptions.
- [x] T012 Update `.specify/templates/spec-template.md` and `.specify/templates/tasks-template.md` only as needed so future planning and process memory capture Orchestrator-first routing, implementation handoff context, parallel-work warnings, verification evidence, and feedback dispositions.
- [x] T013 Update `docs_project/project/devops/ai-pr-workflow.md` as the main durable workflow narrative for Orchestrator-first default entry, Analyst-first intake, clarification relay, parallel isolation, post-Analyst continuation, and authorized merge behavior.
- [x] T014 Update `docs_project/project/devops/review-contract.md` so Review Agent checks Orchestrator-first routing, Analyst clarification relay, parallel-work isolation, role-boundary preservation, and merge-gate preservation.
- [x] T015 Update `specs/README.md` if needed to align feature-memory lifecycle and numbering/collision guidance with Orchestrator-first routing and parallel work.
- [x] T016 Update `.github/pull_request_template.md` if needed so PR authors/reviewers confirm Orchestrator-first routing, parallel-work isolation, role boundaries, and authorized-merge preconditions.
- [x] T017 Keep implementation limited to scoped process docs/templates and `specs/011-orchestrator-analyst-routing/tasks.md`; do not change product code, content, runtime files, package metadata, CI workflows, branch protection, secrets, or production resources.
- [x] T018 Record any scope tension, proposed executable enforcement, or need for follow-up automation under "Implementation Agent Feedback" instead of implementing it in this feature.

## Verification

- [x] T019 Run `git diff --check`.
- [x] T020 Run `node scripts/check-feature-memory.mjs --worktree`.
- [x] T021 Run `pnpm run check:repo`.
- [x] T022 Run `pnpm run preflight`.
- [x] T023 Verify Orchestrator-first repository-changing trigger language with text-search evidence from `plan.md`.
- [x] T024 Verify Orchestrator invokes Analyst first and no-direct-edit role-boundary language with text-search evidence from `plan.md`.
- [x] T025 Verify Analyst-through-Orchestrator clarification and Analyst-only normal-flow requirement clarification language with text-search evidence from `plan.md`.
- [x] T026 Verify parallel-work isolation, one worktree/branch/PR slicing, explicit subagent warnings, and preservation of existing work with text-search evidence from `plan.md`.
- [x] T027 Verify Analyst handoff continuation and post-Analyst no-new-requirement-question language with blocker exceptions using text-search evidence from `plan.md`.
- [x] T028 Verify authorized merge and default human merge-owner language preserves required checks, review, conflicts, process memory, acceptance evidence, and Implementation Agent feedback gates.
- [x] T029 Run `git diff --name-only` and manually confirm changed files are limited to scoped process docs/templates and `specs/011-orchestrator-analyst-routing/*`.
- [x] T030 Record verification evidence, dead ends, decisions, known issues, and Implementation Agent feedback in this file before completion.

## Process Memory

### Dead Ends

- Initial `pnpm run preflight` could not complete because the local worktree had no `node_modules`; build failed at `vite build` with `sh: vite: command not found`. Mitigation: ran `pnpm install --frozen-lockfile` without lockfile changes, then reran `pnpm run preflight` successfully.
- Previous Implementation Agent was replaced after being stuck/non-reporting. Replacement Implementation Agent inspected the assigned worktree, branch status, committed diff against `origin/main`, and scoped process files before continuing; no existing useful work was reverted or overwritten.

### Decisions

- Implementation decision: fast-forwarded the assigned branch from `origin/main` before editing because it was behind by one commit; `origin/main` did not contain `specs/011-orchestrator-analyst-routing/`, so the untracked feature memory was preserved without conflict.
- Implementation decision: kept this feature documentation/template-only and did not add executable enforcement for Orchestrator-first routing or `feature-request.md` presence.
- Implementation decision: updated only the scoped process docs/templates plus this `tasks.md`; product/runtime files changed by the fast-forward are not part of this branch diff against `origin/main`.
- Replacement Implementation Agent decision: preserved the existing committed implementation, reran required validation, and limited follow-up edits to this process-memory update in `tasks.md`.
- Architect decision: Treat this as one process feature because all requested changes concern the same Orchestrator-first repository-changing workflow.
- Architect decision: Implementation is documentation/template-only. No learner-facing app, runtime, CI workflow, branch-protection, executable guard, secret, or production-resource changes are in scope.
- Architect decision: "Analyst is the only role allowed to clarify" means Analyst is the only normal-flow role that may initiate user requirement clarification. It does not remove Orchestrator responsibility to ask the human about safety, permissions, credentials, data-loss risk, repository conflicts/status ambiguity, or unapproved human merge-owner decisions.
- Architect decision: "Orchestrator continues through merge without asking again" applies only when current user instructions explicitly authorize Orchestrator merge or auto-merge behavior. It removes repeated permission prompts after Analyst handoff but does not remove required checks, review findings, conflict, process-memory, evidence, or feedback-disposition gates.
- Architect decision: The Analyst-created intake branch/worktree is the handoff context. Orchestrator may assign Architect and Implementation Agent work in this isolated branch/worktree as the single PR slice, while still preserving role boundaries and avoiding direct Orchestrator edits.
- Architect decision: Parallel-work handling is a first-class requirement. Orchestrator must tell subagents that parallel agents may be active, assign isolated worktrees/branches/PR slices, and require preservation of existing dirty diffs, branches, commits, PRs, and process memory.

### Known Issues

- Executable enforcement for Orchestrator-first routing or `feature-request.md` presence remains out of scope; enforcement remains durable guidance plus manual author/review checks unless a future feature scopes guard automation.
- Multiple durable docs/templates repeat role workflow language, so implementation must use search and manual diff review to prevent drift.
- Active sibling worktrees may contain newer `specs/` prefixes not visible on the current branch; this feature should clarify coordination expectations but not implement branch-discovery tooling.

### Verification Evidence

- Architect planning read `.specify/memory/constitution.md`, `AGENTS.md`, `docs_project/README.md`, `docs_project/project-idea.md`, frontend/backend docs, feature inventory, learning/exam flows, `docs/specify/README.md`, active `feature-request.md`, devops workflow docs, `specs/README.md`, PR template, `.specify/templates/*`, and `CLAUDE.md`.
- Architect baseline status: `git status --short --branch` reported `## codex/011-orchestrator-analyst-routing-intake...origin/main` with untracked `specs/011-orchestrator-analyst-routing/`.
- Implementation Agent setup: `pwd` confirmed `/Users/chap/devel/cabadrive-011-orchestrator-analyst-routing-intake`; `git branch --show-current` confirmed `codex/011-orchestrator-analyst-routing-intake`.
- Implementation Agent baseline status before sync: `git status --short --branch` reported `## codex/011-orchestrator-analyst-routing-intake...origin/main [behind 1]` with untracked `specs/011-orchestrator-analyst-routing/`.
- Sync safety check: `git ls-tree -r --name-only origin/main specs/011-orchestrator-analyst-routing` returned no paths; `git rev-list --left-right --count HEAD...origin/main` returned `0	1`.
- Sync result: `git merge --ff-only origin/main` succeeded and preserved the untracked feature memory.
- Implementation search baseline: `rg -n "repository-changing|Analyst|Orchestrator|clarif|merge|worktree|branch|parallel|human|Requirement|question|handoff|feedback" AGENTS.md CLAUDE.md docs_project/project/devops .github/pull_request_template.md .specify/memory/constitution.md .specify/templates specs/README.md` was used before editing scoped workflow language.
- `git diff --check`: passed.
- `node scripts/check-feature-memory.mjs --worktree`: passed with `Feature-memory gate passed via specs/011-orchestrator-analyst-routing/{spec,plan,tasks}.md`.
- `pnpm run check:repo`: passed with `Repository baseline check passed.`
- `pnpm install --frozen-lockfile`: installed existing dependencies from the lockfile after the first preflight failed because local `node_modules` was missing; no package or lockfile changes were produced.
- `pnpm run preflight`: passed after dependency install. Evidence included feature-memory gate pass, repository baseline pass, content validation pass for 460 category B fallback questions and 276 local image references, 72/72 node tests passed, production build completed with the existing large chunk warning, service worker generated with 280 cached assets, and 14/14 Playwright tests passed.
- AC-001 text search: `rg -n "repository-changing.*Orchestrator|Orchestrator.*default entry|default.*Orchestrator" AGENTS.md CLAUDE.md docs_project/project/devops .specify/memory/constitution.md specs/README.md` found Orchestrator-first repository-changing trigger language in `AGENTS.md`, `CLAUDE.md`, `.specify/memory/constitution.md`, `docs_project/project/devops/ai-pr-workflow.md`, and `specs/README.md`.
- AC-002 text search: `rg -n "Orchestrator.*invoke.*Analyst|Analyst.*first|remain.*Orchestrator|strictly.*Orchestrator|must not directly edit" AGENTS.md CLAUDE.md docs_project/project/devops .specify/memory/constitution.md` found Analyst-first invocation and no-direct-edit role-boundary language in `AGENTS.md`, `CLAUDE.md`, `.specify/memory/constitution.md`, `docs_project/project/devops/ai-pr-workflow.md`, and `docs_project/project/devops/review-contract.md`.
- AC-003 text search: `rg -n "clarification.*Orchestrator|questions.*Orchestrator|answers.*Analyst|Analyst.*clarification" AGENTS.md CLAUDE.md docs_project/project/devops .specify/templates specs/README.md` found Analyst-through-Orchestrator clarification relay language in `AGENTS.md`, `CLAUDE.md`, `.specify/templates/*`, `docs_project/project/devops/*`, and `specs/README.md`.
- AC-004 text search: `rg -n "only.*Analyst.*clarif|Analyst.*only.*clarif|requirement clarification|blocker exception|safety|permission|credential|data-loss|data loss|merge owner" AGENTS.md CLAUDE.md docs_project/project/devops .specify/templates` found Analyst-only normal-flow clarification and blocker-exception language in `AGENTS.md`, `CLAUDE.md`, `.specify/templates/spec-template.md`, `docs_project/project/devops/ai-pr-workflow.md`, and `docs_project/project/devops/review-contract.md`.
- AC-005 text search: `rg -n "parallel.*work|parallel.*agents|isolated worktree|one .*worktree.*branch.*PR|warn.*subagent|preserve existing work|preserve existing dirty" AGENTS.md CLAUDE.md docs_project/project/devops .github/pull_request_template.md .specify/templates specs/README.md` found isolated worktree/branch/PR slicing, parallel-work warning, and preservation language across `AGENTS.md`, `CLAUDE.md`, PR template, `.specify/templates/*`, devops docs, and `specs/README.md`.
- AC-006 text search: `rg -n "handoff|Analyst-created|intake branch|intake worktree|after Analyst handoff|invok.*Architect" AGENTS.md CLAUDE.md docs_project/project/devops .specify/memory/constitution.md .specify/templates specs/README.md` found Analyst handoff continuation and post-handoff guidance in `AGENTS.md`, `CLAUDE.md`, `.specify/memory/constitution.md`, `.specify/templates/*`, `docs_project/project/devops/*`, and `specs/README.md`.
- AC-007 text search: `rg -n "authorized.*merge|merge without asking|required checks|blocking review|conflicts|process memory|acceptance evidence|Implementation Agent feedback" AGENTS.md CLAUDE.md docs_project/project/devops .github/pull_request_template.md` found authorized-merge language and preserved merge gates in `AGENTS.md`, `CLAUDE.md`, `.github/pull_request_template.md`, and devops docs.
- AC-008 text search: `rg -n "human.*default.*merge|default.*merge owner|no such authorization|human remains" AGENTS.md CLAUDE.md docs_project/project/devops .github/pull_request_template.md` found default human merge-owner language in `AGENTS.md`, `CLAUDE.md`, `docs_project/project/devops/ai-pr-workflow.md`, and `docs_project/project/devops/review-contract.md`.
- Scope review: `git diff --name-only` showed only `.github/pull_request_template.md`, `.specify/memory/constitution.md`, `.specify/templates/feature-request-template.md`, `.specify/templates/spec-template.md`, `.specify/templates/tasks-template.md`, `AGENTS.md`, `CLAUDE.md`, `docs_project/project/devops/ai-pr-workflow.md`, `docs_project/project/devops/review-contract.md`, and `specs/README.md`; `git ls-files --modified --others --deleted --exclude-standard` additionally showed only the assigned `specs/011-orchestrator-analyst-routing/{feature-request.md,plan.md,spec.md,tasks.md}` feature memory.
- Replacement verification on resumed worktree: `git status --short --branch` reported `## codex/011-orchestrator-analyst-routing-intake...origin/codex/011-orchestrator-analyst-routing-intake`; `git log --oneline --decorate --max-count=8` showed existing commit `b9cba60 [codex] Route repository-changing work through Orchestrator` at local and remote branch heads before this process-memory update.
- Replacement verification: `git diff --check` passed.
- Replacement verification: `node scripts/check-feature-memory.mjs --worktree` passed with `No configured product paths changed; feature-memory gate passes.`
- Replacement verification: `pnpm run check:repo` passed with `Repository baseline check passed.`
- Replacement verification: `pnpm run preflight` passed with feature-memory gate pass, repository baseline pass, content validation pass for 460 category B fallback questions and 276 local image references, 72/72 node tests passed, production build completed with the existing large chunk warning, service worker generated with 280 cached assets, and 14/14 Playwright tests passed.
- Replacement AC text-search evidence: reran the AC-001 through AC-008 `rg` commands from `plan.md`; matches were found for Orchestrator-first trigger language, Analyst-first/no-direct-edit boundaries, Analyst-through-Orchestrator clarification, Analyst-only normal-flow clarification with blocker exceptions, parallel-work isolation and preservation warnings, Analyst handoff continuation, authorized merge gates, and default human merge ownership across the scoped durable guidance and templates.
- Replacement scope review: `git diff --name-only origin/main...HEAD` showed only scoped process docs/templates and `specs/011-orchestrator-analyst-routing/*` files.

## Implementation Agent Feedback

- None.

## Architect Dispositions

- None; no Implementation Agent feedback was reported.
