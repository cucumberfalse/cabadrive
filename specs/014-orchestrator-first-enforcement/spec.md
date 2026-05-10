# Spec: Orchestrator-First Enforcement

## Analyst Intake

- Source request: `feature-request.md`
- Intake assumptions or open questions carried into this spec:
  - This is a repository workflow/process feature, not learner-facing product work.
  - Existing feature `011-orchestrator-analyst-routing` already established that repository-changing requests default to Orchestrator entry and that Orchestrator invokes Analyst first.
  - Sibling feature `012-orchestrator-final-validation-loop` may update latest-main startup, cycle PR tracking, final validation, and completion gates; this feature must coordinate with that work instead of replacing or contradicting it.
  - The remaining failure mode is operational: an active model that is not currently acting as Orchestrator can still begin repository edits after a new repository-changing user request.
  - Durable documentation/templates are expected to be the main implementation surface. Executable enforcement may be proposed as feedback only unless Orchestrator and Architect create a separate future feature.

## Goal

Make Cabadrive's durable workflow guidance unmistakably enforce Orchestrator-first routing for every new repository-changing user request by defining active-model stop conditions, allowed read-only work, implementation prerequisites, accidental-direct-edit recovery, and Review Agent checks that catch bypasses.

## Scope

In scope:

- `AGENTS.md`
- `CLAUDE.md`
- `.specify/memory/constitution.md`
- `.specify/templates/feature-request-template.md`
- `.specify/templates/spec-template.md`
- `.specify/templates/plan-template.md`
- `.specify/templates/tasks-template.md`
- `.github/pull_request_template.md`
- `docs_project/project/devops/ai-pr-workflow.md`
- `docs_project/project/devops/review-contract.md`
- `specs/README.md`
- `specs/014-orchestrator-first-enforcement/*`

Out of scope:

- Learner-facing app behavior, content, translations, assets, storage, or search.
- Product source, tests, Docker/runtime files, package metadata, lockfiles, service worker changes, or build behavior.
- CI workflow changes, branch-protection changes, required-check configuration, GitHub settings, secrets, or production resources.
- Direct implementation by Orchestrator, Analyst, Architect, or Review Agent.
- Executable guard-script enforcement unless a later feature explicitly scopes it.
- Rewriting or reverting sibling `011`, `012`, `013`, branch, worktree, PR, or process-memory state outside this assigned feature.

## Definitions

- New repository-changing user request: any new user request that implies writing repository files, opening or changing a PR, committing, pushing, modifying workflow rules, changing docs/templates/specs, editing source/tests/assets/content, or changing runtime/configuration. This includes process documentation requests.
- Read-only request: a request limited to inspection, explanation, summarization, status reporting, command output, code review without edits, or planning that does not write repository files or mutate GitHub state.
- Active model: the model currently receiving the user request in a session, regardless of whether it can technically edit files.
- Non-Orchestrator active model: an active model explicitly acting as Analyst, Architect, Implementation Agent, Review Agent, or any other non-Orchestrator role.
- Orchestrator-first stop condition: the mandatory pause when a non-Orchestrator active model receives a new repository-changing request without an explicit Orchestrator handoff and role-appropriate assignment.
- Accidental direct-edit start: any repository file edit, staged change, commit, push, PR mutation, or similar repository-changing action begun before the required Orchestrator-first route and feature-memory prerequisites are satisfied.

## User Stories

### User Story 1

As a non-Orchestrator active model, I want a clear stop condition for new repository-changing requests, so that I do not silently become an Implementation Agent or Orchestrator.

### User Story 2

As Orchestrator, I want durable guidance that distinguishes read-only assistance from repository-changing work, so that normal inspection can continue while file-changing work still enters through Orchestrator.

### User Story 3

As an Implementation Agent, I want explicit prerequisites before editing files, so that implementation begins only after Orchestrator assigns an isolated worktree/branch/PR slice with complete feature memory.

### User Story 4

As a Review Agent, I want bypass-detection checks, so that PRs that skipped Orchestrator-first routing, complete feature memory, or role boundaries are flagged even if the content diff looks reasonable.

### User Story 5

As the project owner, I want a recovery path for accidental direct edits, so that future agents stop safely, preserve user and sibling work, and restart by protocol instead of trying to paper over the process failure.

## Acceptance Criteria

1. Given durable agent/workflow guidance, when a non-Orchestrator active model receives a new repository-changing user request, then the guidance says it must not implement directly and must route the request to Orchestrator or stop with an Orchestrator-needed handoff.
2. Given durable guidance, when a request is read-only, then the guidance permits inspection, explanation, status, summarization, and non-mutating review without creating feature memory or invoking implementation flow.
3. Given a request starts read-only, when it becomes repository-changing, then the guidance requires the Orchestrator-first stop condition before any repository mutation.
4. Given Orchestrator receives a new repository-changing request, when no current `feature-request.md` exists, then guidance preserves the `011` rule that Orchestrator invokes Analyst first and does not perform Analyst, Architect, implementation, or review work directly.
5. Given Architect is explicitly assigned, when Architect starts from Analyst intake, then guidance preserves Architect's boundary: create or update only `spec.md`, `plan.md`, and `tasks.md` for the assigned feature and do not implement.
6. Given Implementation Agent is assigned, when implementation is about to start, then guidance requires complete feature memory (`feature-request.md`, `spec.md`, `plan.md`, `tasks.md`) plus Orchestrator assignment to an isolated worktree, branch, and PR slice.
7. Given an active model realizes it started direct edits improperly, when recovery begins, then guidance requires stopping immediately, reporting the mistake to Orchestrator/user, preserving sibling/user work, avoiding destructive cleanup, and restarting through Orchestrator-controlled disposition.
8. Given accidental direct edits exist, when recovery is needed, then guidance requires any revert, adoption, or salvage decision to be made by Orchestrator/user and implemented only by the role-appropriate agent.
9. Given parallel work or sibling worktrees exist, when this protocol is implemented or later applied, then guidance must not overwrite, revert, rebase, merge, close, or otherwise mutate sibling branches, dirty diffs, PRs, process memory, or worktrees except through explicit Orchestrator coordination.
10. Given Review Agent reviews a repository-changing PR, then review guidance requires checking Orchestrator-first routing, complete feature memory, role-appropriate artifacts, implementation prerequisites, recovery notes for any bypass, and coordination with `011`/`012`.
11. Given durable docs/templates are updated, then the wording must not duplicate or contradict `011` Orchestrator-Analyst routing or sibling `012` final-validation-loop guidance; this feature should add active-model stop/recovery/review enforcement around those rules.
12. Given this feature is implemented, when the final diff is inspected, then changed files are limited to scoped process docs/templates and `specs/014-orchestrator-first-enforcement/*`, with no product, runtime, CI, branch-protection, secret, production-resource, or sibling-feature edits.

## Negative Scenarios

1. Given a user asks a non-Orchestrator active model to "fix", "build", "update docs", "change the workflow", or otherwise modify repository files, when no Orchestrator handoff exists, then guidance must not allow direct edits.
2. Given a user asks a read-only question such as "what changed?", "review this diff", or "explain this file", when no mutation is requested, then guidance must not force a new feature folder solely for inspection.
3. Given an Architect is asked to implement while acting as Architect, then guidance must require Architect to stop at planning artifacts and route implementation back to Orchestrator.
4. Given an Implementation Agent lacks `feature-request.md`, `spec.md`, `plan.md`, or `tasks.md`, when asked to edit files, then implementation must be blocked until Orchestrator obtains complete feature memory.
5. Given accidental direct edits were made before protocol compliance, when the agent notices, then guidance must not allow hidden continuation, silent self-reassignment, destructive reset, or unauthorized revert of user/sibling work.
6. Given `011` and `012` process changes exist or are in-flight, when this feature is implemented, then the diff must not weaken Orchestrator-first Analyst routing, latest-main startup, cycle PR tracking, final validation, merge-readiness gates, or human merge-owner rules.

## Requirements

- FR-001: Durable guidance must define the non-Orchestrator active-model stop condition for new repository-changing requests.
- FR-002: Durable guidance must distinguish read-only requests from repository-changing requests and state when read-only work becomes repository-changing.
- FR-003: Durable Orchestrator guidance must preserve Orchestrator-first intake and delegation from `011`, including Analyst-first intake when no `feature-request.md` exists.
- FR-004: Durable role guidance must state that Analyst, Architect, Implementation Agent, and Review Agent cannot self-promote into Orchestrator or another role to satisfy a new repository-changing request.
- FR-005: Durable Architect guidance must preserve the Architect artifact boundary: assigned `spec.md`, `plan.md`, and `tasks.md` only.
- FR-006: Durable Implementation Agent guidance must require complete feature memory and isolated Orchestrator assignment before repository file edits.
- FR-007: Durable recovery guidance must define the accidental-direct-edit stop, report, preserve, and Orchestrator-disposition path.
- FR-008: Recovery guidance must explicitly forbid destructive cleanup or reverting work the current agent did not make unless Orchestrator/user explicitly authorizes it.
- FR-009: Durable parallel-work guidance must require preserving sibling worktrees, branches, dirty diffs, commits, PR state, and process memory.
- FR-010: Review guidance must require findings for Orchestrator-first bypasses, missing feature memory, role-boundary violations, unsafe recovery, and contradictions with `011` or `012`.
- FR-011: Templates and PR guidance must make the stop condition, implementation prerequisites, recovery notes, and review checks reproducible in future work.
- FR-012: Implementation must be documentation/template/process-memory only unless a later feature scopes executable guard enforcement.

## Success Criteria

- SC-001: Text search finds non-Orchestrator active-model stop-condition language in durable agent/workflow guidance.
- SC-002: Text search finds read-only versus repository-changing request distinction and transition language.
- SC-003: Text search finds Orchestrator-first Analyst routing preserved and no-direct-Orchestrator-edit language.
- SC-004: Text search finds Architect artifact-only boundary and Implementation Agent complete-feature-memory prerequisites.
- SC-005: Text search finds accidental-direct-edit recovery guidance with stop/report/preserve/restart language and destructive-cleanup prohibition.
- SC-006: Text search finds parallel sibling-work preservation language.
- SC-007: Text search finds Review Agent enforcement checks for bypasses, missing memory, role violations, recovery, and `011`/`012` consistency.
- SC-008: Diff review shows only scoped process docs/templates and `specs/014-orchestrator-first-enforcement/*` changed.
- SC-009: Verification evidence, decisions, known issues, and any Implementation Agent feedback are recorded in `tasks.md`.

## Assumptions

- `AGENTS.md` and `CLAUDE.md` are active durable guidance surfaces for future agents in this repository.
- Existing process docs/templates already contain much of the Orchestrator-first flow; implementation should strengthen operational enforcement rather than restating every rule.
- Read-only inspections may be performed by the active model when they do not mutate repository or GitHub state.
- Process-only changes can be verified with text search, manual diff review, feature-memory validation, repo checks, and preflight.
- Executable enforcement could be valuable later, but adding or changing scripts is out of scope for this feature.

## Coordination With 011 And 012

- `011-orchestrator-analyst-routing`: Treat as the base routing rule. Do not replace or weaken its Orchestrator-first, Analyst-first, clarification-through-Orchestrator, or authorized-merge language.
- `012-orchestrator-final-validation-loop`: Treat as sibling in-flight completion hardening. Do not duplicate final-validation return-limit, cycle PR-set, effective-content-head, or latest-main startup mechanics except where this feature references them as preserved gates.
- If implementation finds an apparent contradiction between current `main`, `011`, and sibling `012`, record it as Implementation Agent feedback in `tasks.md` and ask Orchestrator for Architect disposition before broadening scope.

## Review And Verification Requirements

- Implementation requirements: The Implementation Agent must update only scoped process docs/templates and this feature memory, keep `tasks.md` current, avoid product/runtime/CI/secret changes, preserve parallel work, and record any proposed automation or scope tension as Implementation Agent feedback for Architect disposition.
- Review requirements: The Review Agent must verify that the diff adds active-model stop conditions, read-only/repository-changing distinction, implementation prerequisites, accidental-direct-edit recovery, sibling-work preservation, and bypass review enforcement without weakening `011`, sibling `012`, role boundaries, or merge-readiness gates.
- Test/verification requirements: Run `git diff --check`, `node scripts/check-feature-memory.mjs --worktree`, `pnpm run check:repo`, and `pnpm run preflight` before push/PR when implementation reaches that stage; perform text-search evidence for each success criterion and manual diff review for scoped-file consistency; record all evidence in `tasks.md`.
