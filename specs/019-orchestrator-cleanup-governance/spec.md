# Spec: Orchestrator Cleanup Governance

## Analyst Intake

- Source request: `feature-request.md`
- Intake assumptions or open questions carried into this spec:
  - This is one repository workflow/governance feature because startup environment rules, agent lifecycle cleanup, and one-time cleanup are one Orchestrator operating contract.
  - "Latest main" means a freshly created isolated environment based on the newest verified default branch state, normally `origin/main` after `git fetch origin main`.
  - "Agent-created disk artifacts" means local work environments created for agent work, including sibling worktrees and helper-created worktrees, not durable repository memory, user directories, caches needed by active work, secrets, or production resources.
  - Cleanup must be positive-proof and conservative. A path that is merely named like an agent worktree is a candidate only; ambiguity blocks deletion.
  - Candidate examples such as `/Users/chap/devel/cabadrive-009-content-093-184` must be validated before removal and must be preserved if active, dirty, unpushed, tied to an open PR, ambiguous, or user-owned.
- Orchestrator routing context:
  - Analyst intake was created in `/Users/chap/devel/cabadrive-014-orchestrator-cleanup-governance` on branch `codex/014-orchestrator-cleanup-governance`.
  - Architect planning starts from that handoff and must not perform cleanup, implementation, staging, commits, pushes, PR creation, or review.
- Parallel-work constraints:
  - Parallel agents and Orchestrators may be active. All existing dirty diffs, branches, commits, PRs, process memory, active worktrees, and ambiguous local paths must be preserved.
  - Coordination risk resolved and updated: after clean rebase onto `origin/main` `78e0176e361eeea583dd797296bfa994b3f1f695` from PR #63, this branch is based on the latest verified main state without conflicts. PR #63 adds product/content learning support and feature memory `specs/009`; current main's maximum feature-memory prefix remains `018`, so this cleanup feature memory remains valid at `specs/019-orchestrator-cleanup-governance/`. Prior PR #66/PR #72 and PR #69/P2 latest-base notes are historical/superseded latest-base evidence only, and prior final Architect/Analyst validations are stale pending fresh rerun after this PR #63 rebase.

## Goal

Make Cabadrive's durable agent workflow require Orchestrator startup from a fresh latest-main isolated environment and require conservative completion-time cleanup of completed agent-created disk environments through a narrowly scoped Cleanup Agent, with one-time cleanup evidence for finished artifacts.

## Scope

In scope:

- Durable role and workflow guidance for Orchestrator startup from latest `main` in a fresh isolated environment.
- A first-class `Cleanup Agent` role with narrow local-disk cleanup permissions, forbidden actions, validation requirements, and evidence requirements.
- Completion-time Orchestrator guidance for coordinating cleanup without directly deleting files or weakening role boundaries.
- Review guidance that blocks unsafe cleanup wording or implementation.
- Future feature-memory and PR-template guidance so cleanup evidence and parallel-work preservation are captured.
- One-time cleanup task definition and evidence requirements for completed agent-created local environments under approved Cabadrive agent-environment roots.
- `specs/019-orchestrator-cleanup-governance/{feature-request.md,spec.md,plan.md,tasks.md}`.

Out of scope:

- Learner-facing app behavior, content, translations, assets, search, storage, UI, or exam logic.
- Docker runtime behavior, service worker behavior, package dependency changes, branch protection settings, secrets, credentials, or production resources.
- Automatic deletion tooling that can remove paths without an explicit Cleanup Agent assignment and recorded validation evidence.
- Cleanup of the current worktree, active worktrees, ambiguous paths, user-owned directories, durable repository memory, caches needed by active work, or anything outside approved agent-environment roots.
- Direct implementation, review, cleanup, staging, commits, pushes, PR creation, or merge by Analyst, Architect, Review Agent, or Orchestrator.

## User Stories

### User Story 1

As an Orchestrator, I want every new repository-changing task to start from a fresh isolated environment based on latest verified `main`, so that stale worktrees and parallel agent leftovers do not become the starting point for new work.

### User Story 2

As a project owner, I want completed agent-created work environments to be cleaned up at completion, so that disk artifacts do not accumulate after agents finish.

### User Story 3

As a Cleanup Agent, I want an exact validation checklist and refusal rules, so that I delete only old agent-created environments that are provably safe to remove.

### User Story 4

As a Review Agent, I want cleanup evidence and negative scenarios recorded in feature memory, so that unsafe cleanup or data-loss risk blocks merge.

## Acceptance Criteria

1. Given durable Orchestrator guidance, when any new repository-changing task starts, then Orchestrator must default to creating or assigning a fresh isolated environment based on latest verified `main`, normally `origin/main` after a successful fetch.
2. Given `git fetch origin main` fails or latest default-branch state cannot be verified, when Orchestrator starts work, then guidance must not allow silently reusing a stale or dirty environment; Orchestrator must use a documented fallback, record the limitation, or stop for a blocker exception.
3. Given durable role guidance, when completion-time cleanup is needed, then Orchestrator coordinates cleanup through a Cleanup Agent or explicitly equivalent assigned cleanup role and does not directly delete local repository environments.
4. Given Cleanup Agent guidance, when a cleanup candidate is evaluated, then deletion is allowed only after positive proof that the target is an old agent-created Cabadrive environment, inactive, clean, pushed or merged as appropriate, not tied to an open PR, not referenced by active process memory, and inside an approved cleanup root.
5. Given a candidate path is active, current, dirty, has untracked work, has unpushed commits, lacks upstream/merge evidence, has an open or unresolved PR, is locked, has running processes, is outside approved roots, is user-owned, or is ambiguous, when cleanup runs, then deletion must be refused and evidence must record why it was preserved.
6. Given cleanup evidence is recorded, when the PR is reviewed, then evidence must include the candidate inventory, validation result, PR/branch/process checks, action taken for each path, and post-cleanup confirmation for removed paths.
7. Given the one-time cleanup requested in this ticket, when implementation reaches the cleanup step, then finished agent-created environments are removed only after passing the validation checklist, while current active work and ambiguous environments are preserved with evidence.
8. Given durable docs/templates are updated, when text search and review are performed, then Orchestrator startup, Cleanup Agent role boundaries, completion-time cleanup, refusal conditions, and one-time cleanup evidence requirements are consistent across the scoped process documents.
9. Given the reported parallel PR #65 on a `codex/012-...` branch, when this feature proceeds, then the implementation must record a coordination check and must not overwrite, rename, delete, or assume ownership of PR #65 artifacts without Orchestrator/Architect disposition.
10. Given this feature is implemented, when changed files are reviewed, then product code, content behavior, runtime configuration, secrets, branch protection, and unrelated workflow automation remain out of scope.

## Negative Scenarios

1. Given a directory name matches `cabadrive-*`, when no repository/worktree/branch/PR/process-memory evidence proves it is an old completed agent environment, then Cleanup Agent must preserve it.
2. Given a candidate worktree has any `git status --short` output, when cleanup is considered, then Cleanup Agent must refuse deletion.
3. Given a candidate branch has commits not present in its upstream or not verified as merged/closed work, when cleanup is considered, then Cleanup Agent must refuse deletion.
4. Given a candidate has an open PR, unresolved PR state, or PR lookup cannot be performed, when cleanup is considered, then Cleanup Agent must preserve it unless Orchestrator records a blocker resolution with evidence.
5. Given a candidate is the current worktree, the assigned implementation worktree, a sibling worktree referenced by active process memory, or a locked worktree, when cleanup is considered, then Cleanup Agent must refuse deletion.
6. Given a path is outside the approved Cabadrive agent-environment roots or cannot be tied to the Cabadrive remote, when cleanup is considered, then Cleanup Agent must refuse deletion.
7. Given latest-main startup fetch fails, when Orchestrator starts a repository-changing task, then guidance must not allow continuing from an unknown stale base as if it were current.
8. Given PR #65 or another parallel branch contains a same-path or overlapping feature-memory conflict, when implementation is preparing the PR, then Orchestrator must stop and route coordination instead of overwriting or silently renumbering.

## Requirements

- FR-001: Durable Orchestrator guidance must state that new repository-changing work starts by default in a new isolated environment based on latest verified `main`.
- FR-002: Startup guidance must define the normal verification path as fetching `origin/main`, creating or assigning an isolated worktree/branch/PR slice, and recording the base state.
- FR-003: Startup guidance must define a failure mode for unavailable fetch or unverified latest-main state.
- FR-004: Durable role guidance must add `Cleanup Agent` as a first-class role, unless implementation records an Architect-approved equivalent role design before editing docs.
- FR-005: Cleanup Agent guidance must allow local disk cleanup only for assigned cleanup targets and forbid product code edits, docs edits, spec edits, review, commits, pushes, PR creation, merges, branch protection, secrets, production resources, and unapproved user directories.
- FR-006: Orchestrator guidance must require cleanup coordination at completion or handoff, while preserving Orchestrator's no-direct-repository-edit and no-direct-destructive-cleanup boundary.
- FR-007: Cleanup validation must require positive proof of approved root, Cabadrive repository identity, agent-created status, worktree registration or equivalent metadata, inactive status, clean git status, no unpushed work, no open/unresolved PR, no locks/running processes, and no active process-memory references.
- FR-008: Cleanup validation must explicitly reject deletion based only on name pattern, modification time, or human memory.
- FR-009: One-time cleanup must inventory the user's listed candidate artifacts and any other obvious completed agent-created Cabadrive environments, then remove only those passing validation.
- FR-010: One-time cleanup evidence must record removed and preserved candidates, commands or checks used, validation results, and post-cleanup confirmation.
- FR-011: Review guidance must block merge if cleanup rules permit deletion of active, dirty, unpushed, open-PR, ambiguous, user-owned, out-of-root, or current work environments.
- FR-012: Implementation must remain process/governance plus one-time local cleanup evidence and must not change learner-facing product behavior or runtime contracts.

## Success Criteria

- SC-001: Text search finds latest-main fresh isolated environment startup language in durable Orchestrator guidance.
- SC-002: Text search finds fetch/base verification and stale/fetch-failure fallback language.
- SC-003: Text search finds `Cleanup Agent` role boundaries, allowed actions, forbidden actions, handoff behavior, and evidence requirements.
- SC-004: Text search finds completion-time cleanup coordination language that keeps Orchestrator out of direct destructive cleanup.
- SC-005: Text search finds cleanup refusal conditions for active, current, dirty, untracked, unpushed, open-PR, locked, running-process, ambiguous, user-owned, and out-of-root targets.
- SC-006: One-time cleanup evidence lists each candidate path, validation result, action taken, and post-action confirmation.
- SC-007: Manual diff review shows changes are limited to scoped process docs/templates, this feature memory, and any explicitly scoped cleanup evidence.
- SC-008: Verification evidence and any Implementation Agent feedback are recorded in `tasks.md`.

## Assumptions

- The current worktree `/Users/chap/devel/cabadrive-014-orchestrator-cleanup-governance` remains active and must not be cleaned.
- Approved cleanup roots are expected to include Cabadrive agent-created sibling worktrees under `/Users/chap/devel/` and helper-created worktrees under the repository's managed worktree directory, but implementation must document the final roots before cleanup.
- `gh` or equivalent GitHub PR state lookup is available for PR-state validation. If it is not available, affected candidates are ambiguous and preserved.
- Existing `scripts/new-worktree.mjs` already fetches the default base branch before adding a worktree; this feature primarily makes the Orchestrator rule durable rather than introducing broad new automation.
- Some old artifacts may lack enough metadata to prove agent ownership or completion; those must remain until the user explicitly authorizes a separate manual cleanup.

## Review And Verification Requirements

- Implementation requirements: The Implementation Agent must update only scoped process guidance/templates and this feature memory, keep `tasks.md` current, preserve parallel work, and route any cleanup uncertainty to Orchestrator/Architect instead of deleting.
- Cleanup requirements: The Cleanup Agent must perform a dry-run inventory first, validate every target against the checklist in `plan.md`, remove only targets that pass every required check, and return evidence for recording in process memory.
- Review requirements: The Review Agent must verify role boundaries, latest-main startup language, cleanup validation strictness, refusal conditions, one-time cleanup evidence, PR #65 coordination mitigation, and scoped-file compliance.
- Test/verification requirements: Run feature-memory checks, repository baseline checks, preflight unless unrelated environment blocks it, text-search evidence for each success criterion, `git diff --check`, `git status --short --branch`, and cleanup-specific before/after evidence.
- Handoff and blocker requirements: After Analyst handoff, later roles use recorded assumptions and feedback. Stop for blocker exceptions involving data-loss risk, ambiguous cleanup state, missing PR-state validation, path ownership ambiguity, fetch failure, credentials/permissions, conflicts, or merge-owner decisions.
