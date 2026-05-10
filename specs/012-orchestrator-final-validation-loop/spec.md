# Spec: Orchestrator Final Validation Loop

## Analyst Intake

- Source request: `feature-request.md`
- Intake assumptions or open questions carried into this spec:
  - This is a repository workflow/process feature, not learner-facing product work.
  - The requested final validation loop belongs after implementation, review, checks, and PR-slice coordination, but before Orchestrator declares completion or performs authorized merge mechanics.
  - "All PRs" means every PR slice Orchestrator opened or coordinated for the current work cycle, including merged, open, replacement, and follow-up slices that contribute to the feature outcome.
  - "Latest main" applies when Orchestrator starts a new repository-changing work item and when Orchestrator creates each new task-slice worktree/branch. Existing in-flight slices are preserved and are brought current only through the proper role if merge readiness requires it.
  - Analyst final validation must be represented as Analyst-owned validation notes on the Analyst-owned intake artifact unless a return-limit breach requires a new feature request.
  - Durable documentation/templates are sufficient for this feature. Executable guard or workflow automation changes remain out of scope unless a later feature scopes them.
- Orchestrator routing context: Orchestrator assigned Architect planning in `/Users/chap/devel/cabadrive-012-orchestrator-final-validation-loop` on branch `codex/012-orchestrator-final-validation-loop` after Analyst created `feature-request.md`.
- Parallel-work constraints: parallel Orchestrators and agents may be active; preserve all existing branches, dirty diffs, commits, PRs, and process memory.

## Goal

Make Cabadrive's durable workflow require latest-main isolated startup and a bounded final validation loop where Architect validates the full PR cycle first, Analyst validates customer intent second, and all gaps are routed back through role-safe Orchestrator coordination before completion.

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
- `specs/012-orchestrator-final-validation-loop/*`

Out of scope:

- Learner-facing app behavior, content, translations, assets, storage, or search.
- Runtime, Docker, package, lockfile, service worker, or product test changes.
- CI workflow, branch-protection, required-check configuration, GitHub settings, secrets, or production resources.
- Executable guard-script enforcement for latest-main startup, final validation loop counts, or Analyst final validation notes.
- Direct implementation by Orchestrator, Architect, Analyst, or Review Agent.

## Definitions

- Work cycle: one repository-changing user request represented by one `specs/<feature-id>/` folder, from Orchestrator startup through final completion, including Analyst intake, Architect planning, all implementation/review PR slices, final validation passes, and any follow-up slices before completion or escalation.
- Cycle PR set: the durable list of PR slices for the work cycle. It must identify each slice by purpose, branch, PR number or discoverable PR metadata, current or final head SHA, merge/open/closed status, and whether it is included in final validation.
- Effective content head: the PR head that contains the implementation, docs/templates, feature memory, review-fix changes, and other behaviorally meaningful content that Architect and Analyst validate before completion. A later final-validation evidence-only commit may exist only to record those validation results in role-owned process memory.
- Final-validation evidence-only commit: a narrow follow-up commit after Architect and Analyst validation that changes only role-owned validation evidence or process-memory records, such as Analyst-owned validation notes in `feature-request.md` and Implementation Agent process evidence in `tasks.md`. It must not change product behavior, durable workflow rules, templates, scoped implementation docs, code, tests, runtime files, CI, branch protection, or review dispositions except to record the already-completed validation evidence.
- Final validation return: a failed final validation pass that sends the work back to Orchestrator for follow-up development or disposition. Passing validation and read-only rechecks do not count as returns.
- Architect return limit: at most 10 failed Architect final-validation or Architect-disposition returns per work cycle. On the next Architect gap after the limit is exhausted, Architect records the limit breach and tells Orchestrator to ask Analyst for a new feature request.
- Analyst return limit: at most 5 failed Analyst final-validation returns per work cycle. On the next Analyst gap after the limit is exhausted, Analyst creates a new feature request in a separate latest-main branch/worktree.
- Analyst-owned validation notes: append-only final-validation entries in `feature-request.md` or a template-defined Analyst-owned section of that same artifact. Analyst must not edit `spec.md`, `plan.md`, `tasks.md`, implementation files, reviews, commits, pushes, PRs, or merge state.

## User Stories

### User Story 1

As an Orchestrator, I want every new work item and task slice to start from latest `main` in an isolated environment, so that parallel work is not overwritten and stale bases are visible before implementation begins.

### User Story 2

As an Architect, I want a required final validation pass across the full PR set and all Architect-assigned tasks, so that completion cannot be declared while architectural gaps, open tasks, or intent mismatches remain.

### User Story 3

As an Analyst, I want to validate the final result against the customer's intent in spirit and letter after Architect passes it, so that the workflow checks both technical delivery and the original requested outcome.

### User Story 4

As a Review Agent or project owner, I want bounded return counts and escalation rules, so that unresolved validation loops become new feature intake instead of unbounded churn inside one cycle.

## Acceptance Criteria

1. Given Orchestrator receives a new repository-changing work item, when starting intake or assigning a new task slice, then durable guidance requires fetching or otherwise verifying latest `origin/main`, creating or requiring a fresh isolated worktree/branch from that latest main, recording the base context, and preserving parallel work.
2. Given Analyst has created an intake branch/worktree from latest main, when Analyst hands off, then guidance explains that Orchestrator may continue that isolated handoff context for Architect planning and, if explicitly assigned as the PR slice, for implementation; additional task slices must get their own latest-main isolated worktree/branch/PR.
3. Given a feature may involve multiple PR slices, when Orchestrator prepares for final validation, then durable guidance requires a cycle PR set with each PR slice's purpose, branch, PR metadata, head SHA, status, and inclusion in final validation.
4. Given implementation, review, checks, and follow-up development appear complete, when Orchestrator wants to declare completion or perform authorized merge mechanics, then Orchestrator must invoke Architect final validation before Analyst final validation.
5. Given Architect performs final validation, when evaluating the cycle, then Architect must validate all PR slices in the cycle PR set, all Architect-assigned tasks and dispositions, architectural guidance, open task state, current process memory, and customer intent in spirit.
6. Given Architect finds gaps, when returning the work, then Architect updates only Architect-owned artifacts or dispositions, records the gap and next required task/ticket/not-needed decision, increments the Architect return count, and returns control to Orchestrator for role-appropriate follow-up development.
7. Given Architect final validation passes, when Orchestrator continues final validation, then Orchestrator invokes Analyst final validation before declaring completion.
8. Given Analyst performs final validation, when evaluating the cycle, then Analyst validates the final result against the customer's desired outcome in spirit and letter using the original request, clarified answers, assumptions, and acceptance expectations.
9. Given Analyst finds gaps within the return limit, when returning feedback, then Analyst updates only Analyst-owned validation notes, increments the Analyst return count, and Orchestrator must route that feedback to Architect for accept/task/ticket/dispose disposition before any follow-up development starts.
10. Given Architect or Analyst return limits are exhausted, when another gap would require a return, then durable guidance requires the specified escalation: Architect reports the breach to Orchestrator and Orchestrator asks Analyst for a new feature request; Analyst creates a new feature request in a separate latest-main branch/worktree.
11. Given final validation is added, when merge readiness is evaluated, then existing gates remain intact: green required checks on current heads, no blocking review findings, no unresolved conflicts, acceptance evidence, current process memory, resolved/disposed Implementation Agent feedback, final guard evidence, and human merge-owner rules.
12. Given Architect and Analyst validated an effective content head, when a later commit only records final-validation evidence in role-owned process memory, then Orchestrator may use that validation for the effective content head only if a read-only final guard on the current PR head confirms the later commit is evidence-only, process memory is current, checks/review/conflict gates are still satisfied, and no non-evidence content changed after role validation.
13. Given this feature is implemented, when the final diff is reviewed, then changed files are limited to scoped process docs/templates and `specs/012-orchestrator-final-validation-loop/*`, with no product, runtime, CI, branch-protection, secret, or production-resource changes.

## Negative Scenarios

1. Given Orchestrator starts a new repository-changing work item from a stale local branch, when no latest-main base is verified or recorded, then the workflow must reject completion as noncompliant.
2. Given parallel work exists, when Orchestrator assigns a task, then guidance must not allow reusing another worker's worktree, overwriting dirty diffs, or silently adopting another branch/PR.
3. Given multiple PR slices contributed to a cycle, when only the latest PR is validated, then final validation must be considered incomplete.
4. Given Architect finds unresolved tasks, architectural drift, missing dispositions, or process-memory gaps, when Orchestrator wants to proceed to Analyst validation, then guidance must block Analyst validation until Architect gaps are disposed and follow-up development is completed.
5. Given Analyst identifies a customer-intent gap, when Orchestrator wants to send the issue directly to Implementation Agent, then guidance must block that route until Architect accepts, tasks, tickets, or explicitly disposes the Analyst feedback.
6. Given validation returns exceed the configured limit, when the cycle still has gaps, then guidance must not allow unbounded retries inside the same feature cycle.
7. Given final validation passes but checks are red, missing, queued, or running; blocking review findings remain; conflicts exist; process memory is stale; acceptance evidence is missing; or unresolved feedback lacks disposition, then Orchestrator must not declare completion or merge.
8. Given Analyst final validation notes are needed, when Analyst writes them, then Analyst must not edit Architect artifacts, implementation files, review comments, commits, pushes, PRs, or merge state.
9. Given a commit lands after Architect or Analyst validation, when that commit changes anything beyond final-validation evidence-only process memory or invalidates current-head gates, then Orchestrator must treat the prior role validations as stale and route the work for role-appropriate follow-up instead of recursively relying on the stale evidence.

## Requirements

- FR-001: Durable guidance must require every new repository-changing work item to start from latest `main` in a fresh isolated environment.
- FR-002: Durable guidance must distinguish new work startup from continuation of an Analyst-created latest-main handoff branch/worktree and from additional task-slice worktrees.
- FR-003: Durable guidance must define work cycle boundaries.
- FR-004: Durable guidance must require cycle PR-set tracking for final validation.
- FR-005: Orchestrator guidance must require final Architect validation before final Analyst validation and before completion.
- FR-006: Architect guidance must define final validation scope: all PR slices, Architect-assigned tasks, architectural guidance, open task state, process memory, dispositions, and customer intent in spirit.
- FR-007: Architect gap handling must update only Architect-owned artifacts/dispositions and return work to Orchestrator for follow-up development.
- FR-008: Orchestrator guidance must require Analyst final validation after Architect validation passes.
- FR-009: Analyst guidance must define final validation against customer intent in spirit and letter.
- FR-010: Analyst final validation gap handling must update only Analyst-owned validation notes and route feedback through Architect disposition before implementation.
- FR-011: Durable guidance must document Architect return limit `10` and Analyst return limit `5` per work cycle.
- FR-012: Durable guidance must document Architect-limit and Analyst-limit escalation to new feature request flows.
- FR-013: Final validation guidance must preserve Orchestrator no-direct-file-edit boundaries and all role-specific permissions.
- FR-014: Final validation guidance must preserve current merge-readiness gates and must not replace evidence with AI-written summaries.
- FR-015: Templates and PR guidance must make future cycle tracking, final validation evidence, return counts, and dispositions reproducible.
- FR-016: Implementation must remain process documentation/template work plus feature memory unless a future Architect feature scopes executable enforcement.
- FR-017: Final validation guidance must define how to handle a later final-validation evidence-only commit without an infinite loop: Architect and Analyst validate the effective content head, and Orchestrator performs a current-head read-only guard that proves any later commit is evidence-only and all merge-readiness gates remain current.

## Success Criteria

- SC-001: Text search finds latest-main isolated startup guidance in durable agent/workflow docs.
- SC-002: Text search finds work-cycle and cycle PR-set tracking guidance.
- SC-003: Text search finds final Architect validation ordering and scope.
- SC-004: Text search finds Architect gap handling and Architect return-limit escalation.
- SC-005: Text search finds final Analyst validation ordering, spirit-and-letter scope, and Analyst-owned validation-note boundaries.
- SC-006: Text search finds Analyst-feedback-to-Architect disposition requirements before follow-up development.
- SC-007: Text search finds Analyst return-limit escalation to a new feature request in a separate branch/worktree.
- SC-008: Text search finds preserved merge-readiness gates and role boundaries.
- SC-009: Diff review shows only scoped process docs/templates and `specs/012-orchestrator-final-validation-loop/*` changed.
- SC-010: Text search finds final-validation evidence-only commit handling, effective content head validation, and current PR head read-only guard requirements.
- SC-011: Verification evidence and any Implementation Agent feedback are recorded in `tasks.md`.

## Assumptions

- Existing process documentation and templates are the right implementation surface for this feature.
- `origin/main` is the authoritative latest-main reference for local startup guidance.
- If main advances after a slice starts, the slice is not discarded; Orchestrator verifies merge readiness and routes any needed rebase/merge/conflict work to the proper role.
- Analyst final validation notes can extend the existing `feature-request.md` artifact without creating a new normal-flow Analyst artifact. New `feature-request.md` creation is reserved for the specified limit-exceeded escalation or a separate repository-changing request.
- The current feature can be one process-doc/template PR slice unless Orchestrator intentionally decomposes it.

## Review And Verification Requirements

- Implementation requirements: Implementation Agent must update only scoped process docs/templates and this feature memory, keep `tasks.md` current, avoid product/runtime/CI/secret changes, preserve parallel work, and record any proposed automation or scope tension as Implementation Agent feedback for Architect disposition.
- Review requirements: Review Agent must verify latest-main startup, cycle and PR-set tracking, final Architect-before-Analyst ordering, validation return limits, Analyst-feedback Architect disposition, preserved role boundaries, preserved merge gates, changed-file scope, and evidence quality.
- Test/verification requirements: Run `git diff --check`, `node scripts/check-feature-memory.mjs --worktree`, `pnpm run check:repo`, and `pnpm run preflight` before push/PR when implementation reaches that stage; perform text-search evidence for each acceptance criterion and manual diff review for scoped-file consistency; record all evidence in `tasks.md`.
- Handoff and blocker requirements: Orchestrator owns follow-up routing, not direct edits. Architect owns dispositions for Architect artifacts and Analyst feedback. Analyst owns only intake/final validation notes. Human input remains limited to documented blocker exceptions or merge-owner decisions under existing guidance.
