# Spec: Orchestrator-First Analyst Routing

## Analyst Intake

- Source request: `feature-request.md`
- Intake assumptions or open questions carried into this spec:
  - This is a repository workflow/process feature, not learner-facing product work.
  - Repository-changing user requests should enter through Orchestrator by default, including feature, bug, docs, process, implementation, and similarly phrased change requests.
  - Analyst remains the intake owner but is invoked by Orchestrator first; Analyst does not become the default direct entrypoint.
  - Analyst may initiate requirement clarification in normal flow, but questions must be passed through Orchestrator to the user and answers passed back to Analyst.
  - After Analyst handoff, Orchestrator should continue without further user requirement questions unless a documented safety, permission, credential, data-loss, conflict, or merge-owner blocker requires human input.
  - Explicit user authorization for Orchestrator merge behavior permits Orchestrator to merge without asking again only after all merge-readiness gates are verified.

## Goal

Make Cabadrive's durable workflow guidance state that repository-changing requests default to Orchestrator entry, Orchestrator invokes Analyst first, clarification flows through Orchestrator, parallel work is isolated and communicated, and post-Analyst orchestration continues through authorized merge readiness without weakening gates.

## Scope

In scope:

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
- `specs/011-orchestrator-analyst-routing/*`

Out of scope:

- Learner-facing app behavior, content, translations, assets, storage, or search.
- Runtime, Docker, service worker, package, lockfile, or CI workflow changes.
- Branch-protection or required-check configuration changes.
- Executable guard-script enforcement for `feature-request.md` or Orchestrator routing.
- Secrets, credentials, production resources, or GitHub repository settings.
- Direct implementation by Analyst, Architect, Review Agent, or Orchestrator.

## User Stories

### User Story 1

As an Orchestrator, I want every repository-changing request to route to me first, so that I can preserve role boundaries and delegate the first intake step to Analyst.

### User Story 2

As an Analyst, I want clarification questions to flow through Orchestrator, so that intake can clarify requirements without Analyst taking over user-facing orchestration.

### User Story 3

As an Implementation Agent, I want explicit instructions about isolated worktrees, branches, PR slices, and parallel agents, so that I do not overwrite or conflate other active work.

### User Story 4

As a project owner, I want Orchestrator to continue after Analyst handoff through implementation, review, checks, and authorized merge without repeated requirement questions, so that process work can finish while all gates remain intact.

## Acceptance Criteria

1. Given durable agent and workflow guidance, when a user asks for any repository-changing work, then the guidance states the default entrypoint is Orchestrator, not direct Analyst, Architect, Implementation Agent, or Review Agent work.
2. Given Orchestrator receives a repository-changing request without a current `feature-request.md`, when the workflow starts, then Orchestrator must remain in the Orchestrator role and invoke Analyst first for intake.
3. Given Analyst needs requirement clarification, when no user instruction forbids questions, then Analyst passes concise clarification questions to Orchestrator, Orchestrator asks the user, and Orchestrator returns the answers to Analyst before intake is completed.
4. Given normal flow after Analyst handoff, when Architect, Implementation Agent, Review Agent, or Orchestrator lacks a requirement detail, then durable guidance says they must not initiate new requirement clarification with the user and must instead use recorded assumptions, record feedback, or ask Orchestrator to route an Architect disposition unless a documented blocker exception applies.
5. Given parallel Orchestrators or agents may be active, when Orchestrator creates or assigns work, then guidance requires isolated worktrees, branches, and PR slices and requires Orchestrator to warn subagents that parallel work exists and existing work must be preserved.
6. Given Analyst creates an intake branch/worktree and `feature-request.md`, when Analyst hands off, then guidance explains how Orchestrator takes that handoff context forward and invokes Architect, Implementation Agent, and Review Agent without Analyst continuing.
7. Given the user explicitly authorizes Orchestrator merge or auto-merge behavior, when the PR is merge-ready, then guidance states Orchestrator may merge without asking again only after verifying green required checks, no blocking review findings, no conflicts, current process memory, acceptance evidence, and resolved/disposed Implementation Agent feedback.
8. Given no explicit merge authorization exists, when a PR is otherwise ready, then guidance preserves the human as default final merge owner.
9. Given process docs/templates are updated, when the diff is reviewed, then related workflow language in `AGENTS.md`, `CLAUDE.md`, `.specify/memory/constitution.md`, `.specify/templates/*`, `.github/pull_request_template.md`, `docs_project/project/devops/*`, and `specs/README.md` is consistent and does not weaken role boundaries.

## Negative Scenarios

1. Given a user asks "let's build a feature" or reports a bug that implies repository edits, when an agent starts work, then guidance must not allow direct implementation before Orchestrator invokes Analyst and complete feature memory exists.
2. Given Analyst has clarification questions, when those questions are needed, then guidance must not allow Analyst to independently continue a direct user Q&A outside Orchestrator routing.
3. Given Architect, Implementation Agent, Review Agent, or Orchestrator wants more requirements after Analyst handoff, when the issue is not a safety, permission, credential, data-loss, conflict, or merge-owner blocker, then guidance must not allow interrupting the user for requirement clarification.
4. Given parallel work exists, when Orchestrator delegates to a subagent, then guidance must not allow reusing another worker's worktree, overwriting dirty diffs, or ignoring active branches/PRs.
5. Given required checks are red, missing, queued, or running; blocking review findings remain; conflicts exist; process memory is stale; acceptance evidence is missing; or Implementation Agent feedback lacks Architect disposition, when Orchestrator has merge authorization, then guidance must still block merge.
6. Given this feature is implemented, when changed files are reviewed, then learner-facing source, content, runtime, package, CI workflow, branch-protection, secret, or production-resource changes are out of scope.

## Requirements

- FR-001: Durable guidance must define repository-changing user requests as Orchestrator-first by default.
- FR-002: Durable guidance must state Orchestrator remains strictly in the Orchestrator role and delegates file changes or role-owned work to subagents.
- FR-003: Orchestrator guidance must require invoking Analyst first for repository-changing intake when no current `feature-request.md` exists.
- FR-004: Analyst guidance must state Analyst is the only normal-flow role that may initiate user requirement clarification and that all such clarification flows through Orchestrator.
- FR-005: Post-Analyst guidance must distinguish requirement clarification from blocker exceptions involving safety, permissions, credentials, data-loss risk, repository conflicts, or merge-owner decisions.
- FR-006: Parallel-work guidance must require isolated worktrees, branches, PR slices, and explicit subagent warnings that parallel agents may be active and existing work must be preserved.
- FR-007: Handoff guidance must explain that Analyst-created intake context is passed to Orchestrator, who continues by invoking Architect and later implementation/review roles.
- FR-008: Merge guidance must preserve explicit user authorization as the condition for Orchestrator merge without asking again and preserve all merge-readiness gates.
- FR-009: Feature-memory, PR, review, and template guidance must align with the Orchestrator-first and Analyst-through-Orchestrator flow.
- FR-010: Implementation must remain process documentation/template work plus this feature memory only.

## Success Criteria

- SC-001: Text search finds Orchestrator-first repository-changing trigger language in durable guidance.
- SC-002: Text search finds Orchestrator invokes Analyst first and Orchestrator no-direct-edit role-boundary language.
- SC-003: Text search finds Analyst clarification through Orchestrator and Analyst-only normal-flow requirement clarification language.
- SC-004: Text search finds parallel-work isolation and explicit subagent warning language.
- SC-005: Text search finds Analyst handoff continuation and post-Analyst no-new-requirement-question language with blocker exceptions.
- SC-006: Text search finds authorized merge behavior that preserves merge-readiness gates and default human merge ownership.
- SC-007: Diff review shows only scoped process docs/templates and `specs/011-orchestrator-analyst-routing/*` changed.
- SC-008: Verification evidence and any Implementation Agent feedback are recorded in `tasks.md`.

## Assumptions

- Durable documentation/templates are sufficient for this feature; executable guard or workflow automation can be proposed as future feedback but must not be implemented here.
- `CLAUDE.md` is present and should be updated because it contains active role, autonomy, and local workflow guidance.
- The current branch/worktree is the intake handoff context for this feature; the Implementation Agent may continue in this assigned isolated branch/worktree if Orchestrator assigns it as the single PR slice.
- Process-only changes can be verified with text search, diff review, feature-memory checks, repo checks, and preflight.

## Review And Verification Requirements

- Implementation requirements: The Implementation Agent must update only scoped process docs/templates and this feature memory, keep `tasks.md` current, preserve role boundaries, avoid product/runtime/CI/secret changes, and record any scope tension or proposed automation as Implementation Agent feedback for Architect disposition.
- Review requirements: The Review Agent must verify that the diff enforces Orchestrator-first routing, Analyst-through-Orchestrator clarification, parallel-work isolation, post-Analyst continuation, and merge-gate preservation without allowing direct Orchestrator edits, role switching, unsafe merge, or out-of-scope product/runtime changes.
- Test/verification requirements: Run `node scripts/check-feature-memory.mjs --worktree`, `pnpm run check:repo`, and `pnpm run preflight` before push/PR when implementation reaches that stage; perform text-search evidence for each acceptance criterion and manual diff review for scoped-file consistency; record all evidence in `tasks.md`.
