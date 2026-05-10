# Plan: Orchestrator-First Analyst Routing

## Summary

Update Cabadrive's durable process guidance and templates so every repository-changing request defaults to Orchestrator entry, Orchestrator invokes Analyst first, Analyst clarification is routed through Orchestrator, parallel work isolation is explicitly communicated to subagents, and Orchestrator may continue after Analyst handoff through user-authorized merge only after all existing gates are green. This is a bounded documentation/template change with no product, runtime, CI, or executable guard implementation.

## Technical Context

- runtime: none; process documentation and templates only.
- dependencies: none.
- product paths: none.
- data changes: none.
- feature memory path: `specs/011-orchestrator-analyst-routing/`.
- implementation branch/worktree context: `codex/011-orchestrator-analyst-routing-intake` in `/Users/chap/devel/cabadrive-011-orchestrator-analyst-routing-intake`.
- likely implementation paths:
  - `AGENTS.md`
  - `CLAUDE.md`
  - `.specify/memory/constitution.md`
  - `.specify/templates/feature-request-template.md`
  - `.specify/templates/spec-template.md`
  - `.specify/templates/tasks-template.md`
  - `.github/pull_request_template.md`
  - `docs_project/project/devops/ai-pr-workflow.md`
  - `docs_project/project/devops/review-contract.md`
  - `specs/README.md`
  - `specs/011-orchestrator-analyst-routing/tasks.md`

## Scope Boundaries

- in scope: Orchestrator-first request trigger, Orchestrator invocation of Analyst, Analyst clarification loop through Orchestrator, Analyst-only normal-flow requirement clarification, parallel work isolation/subagent warning language, Analyst handoff continuation, authorized merge behavior under existing gates, role-boundary alignment, PR/review/template guidance, and this feature memory.
- out of scope: learner-facing behavior, content, translations, assets, Docker/runtime changes, service worker changes, package or lockfile changes, CI workflow changes, branch-protection changes, required-check configuration, executable guard-script changes, GitHub repository settings, secrets, and production resources.

## Constitution Check

- Spec-first: yes; Analyst intake exists as `feature-request.md`, and this Architect plan precedes implementation.
- Testable boundaries: yes; requirements map to text search, diff scope review, feature-memory validation, repo checks, and preflight.
- PR-only: yes; implementation must land through a PR and not direct push to `main`.
- One worktree per task: yes; implementation must use the assigned isolated worktree/branch/PR slice and preserve other active work.
- Simplicity: yes; update existing process docs/templates only, with no new automation or abstractions.
- Deployability: neutral; no runtime behavior changes.
- Process memory: yes; `tasks.md` must record decisions, risks, known issues, verification evidence, and Implementation Agent feedback.

## Implementation Approach

1. Confirm the assigned worktree, branch, and feature folder before editing:
   - `pwd`
   - `git status --short --branch`
   - `test -f specs/011-orchestrator-analyst-routing/feature-request.md`
2. Read active feature memory and scoped durable docs before editing.
3. Search current workflow language to avoid contradictory duplicate wording:
   - `rg -n "repository-changing|Analyst|Orchestrator|clarif|merge|worktree|branch|parallel|human" AGENTS.md CLAUDE.md docs_project/project/devops .github/pull_request_template.md .specify/memory/constitution.md .specify/templates specs/README.md`
4. Update `AGENTS.md` so it clearly states:
   - repository-changing user requests default to Orchestrator entry;
   - Orchestrator invokes Analyst first for intake and stays in the Orchestrator role;
   - Analyst clarification questions flow through Orchestrator;
   - Analyst is the only normal-flow role that may initiate requirement clarification;
   - Orchestrator gives subagents explicit parallel-work/isolation warnings;
   - post-Analyst orchestration continues without new requirement questions except documented blocker exceptions;
   - authorized merge still requires all merge-readiness gates.
5. Update `CLAUDE.md` with the same operational routing rules for implementation-agent contexts.
6. Update `.specify/memory/constitution.md` only as needed to make the canonical workflow order Orchestrator-first before Analyst intake without weakening the existing spec-first and PR-only principles.
7. Update `.specify/templates/feature-request-template.md`, `.specify/templates/spec-template.md`, and `.specify/templates/tasks-template.md` where useful so future feature memory captures Orchestrator-first routing, clarification Q&A through Orchestrator, branch/worktree handoff context, parallel-work warnings, and feedback disposition.
8. Update `docs_project/project/devops/ai-pr-workflow.md` as the main durable process narrative for the new routing flow, continuation rules, and authorized merge behavior.
9. Update `docs_project/project/devops/review-contract.md` so reviewers check for Orchestrator-first routing, Analyst-through-Orchestrator clarification, parallel-work warnings, and preserved merge gates.
10. Update `specs/README.md` only where feature-memory lifecycle or numbering guidance needs parallel-work or Orchestrator-first clarification.
11. Update `.github/pull_request_template.md` only if the done gate needs an explicit Orchestrator-first/parallel-work/authorized-merge checklist item.
12. Keep `specs/011-orchestrator-analyst-routing/tasks.md` current as implementation proceeds, including unchecked-to-checked task status, decisions, known issues, verification evidence, Implementation Agent feedback, and Architect dispositions.
13. Do not implement executable enforcement, CI automation, branch-protection changes, product code, or runtime changes in this feature.

## Complexity Tracking

No new runtime or tooling abstraction is expected. The main complexity is wording: "Orchestrator continues without asking" must prevent repeated requirement clarification after Analyst handoff while still requiring Orchestrator to stop for safety, permission, credential, data-loss, conflict, unresolved gate, or unapproved merge-owner blockers. Any ambiguity discovered during implementation must be recorded in `tasks.md` as Implementation Agent feedback rather than solved by expanding scope.

## Verification

| Acceptance criterion | Evidence |
| --- | --- |
| AC-001 | `rg -n "repository-changing.*Orchestrator|Orchestrator.*default entry|default.*Orchestrator" AGENTS.md CLAUDE.md docs_project/project/devops .specify/memory/constitution.md specs/README.md` |
| AC-002 | `rg -n "Orchestrator.*invoke.*Analyst|Analyst.*first|remain.*Orchestrator|strictly.*Orchestrator|must not directly edit" AGENTS.md CLAUDE.md docs_project/project/devops .specify/memory/constitution.md` |
| AC-003 | `rg -n "clarification.*Orchestrator|questions.*Orchestrator|answers.*Analyst|Analyst.*clarification" AGENTS.md CLAUDE.md docs_project/project/devops .specify/templates specs/README.md` |
| AC-004 | `rg -n "only.*Analyst.*clarif|Analyst.*only.*clarif|requirement clarification|blocker exception|safety|permission|credential|data loss|merge owner" AGENTS.md CLAUDE.md docs_project/project/devops .specify/templates` |
| AC-005 | `rg -n "parallel.*work|parallel.*agents|isolated worktree|one .*worktree.*branch.*PR|warn.*subagent|preserve existing work" AGENTS.md CLAUDE.md docs_project/project/devops .github/pull_request_template.md .specify/templates specs/README.md` |
| AC-006 | `rg -n "handoff|Analyst-created|intake branch|intake worktree|after Analyst handoff|invok.*Architect" AGENTS.md CLAUDE.md docs_project/project/devops .specify/memory/constitution.md .specify/templates specs/README.md` |
| AC-007 | `rg -n "authorized.*merge|merge without asking|required checks|blocking review|conflicts|process memory|acceptance evidence|Implementation Agent feedback" AGENTS.md CLAUDE.md docs_project/project/devops .github/pull_request_template.md` |
| AC-008 | `rg -n "human.*default.*merge|default.*merge owner|no such authorization|human remains" AGENTS.md CLAUDE.md docs_project/project/devops .github/pull_request_template.md` |
| AC-009 | Manual diff review plus `git diff --name-only` shows only scoped process docs/templates and `specs/011-orchestrator-analyst-routing/*` changed. |

Negative scenario evidence:

- Search evidence shows direct repository-changing implementation is not allowed before Orchestrator invokes Analyst and complete feature memory exists.
- Search evidence shows Analyst clarification must be routed through Orchestrator, not independent direct user Q&A.
- Search evidence shows non-Analyst roles do not initiate normal-flow requirement clarification after Analyst handoff.
- Search evidence shows parallel work must use isolated worktrees/branches/PR slices and preserve existing work.
- Search evidence shows authorized merge remains blocked by red/missing/running checks, blocking review findings, conflicts, stale process memory, missing evidence, or unresolved Implementation Agent feedback.
- Manual diff review confirms no learner-facing, runtime, CI workflow, branch-protection, secret, or production-resource changes.

Required command evidence:

- `node scripts/check-feature-memory.mjs --worktree`
- `pnpm run check:repo`
- `pnpm run preflight`
- `git diff --check`
- `git status --short --branch`

If a command cannot run because of local environment or unrelated repository state, record the exact command, failure, and mitigation in `tasks.md`.

## Risks

- Risk: Orchestrator-first wording could be read as allowing Orchestrator to perform Analyst, Architect, implementation, or review work directly.
- Mitigation: Pair the default entrypoint rule with explicit delegation and no-direct-file-edit role boundaries in every durable location that defines the workflow.

- Risk: Analyst-only clarification could hide real blockers discovered later.
- Mitigation: Define "requirement clarification" narrowly and preserve explicit exceptions for safety, permissions, credentials, data-loss risk, merge conflicts/status ambiguity, and human merge-owner decisions when merge was not already authorized.

- Risk: "Continue through merge" could weaken required checks or review gates.
- Mitigation: Keep the existing merge-ready preconditions and state that explicit user authorization removes only the need to ask again, not the gates.

- Risk: Parallel work guidance could conflict with current feature numbering guidance or active sibling worktrees.
- Mitigation: Require Orchestrator to account for parallel branches/worktrees, warn subagents, preserve existing work, and route numbering/collision ambiguity through Orchestrator coordination.

- Risk: Process docs and templates can drift because the same workflow is described in several files.
- Mitigation: Require text-search evidence and manual diff review across `AGENTS.md`, `CLAUDE.md`, `.specify`, devops docs, PR template, and `specs/README.md`.
