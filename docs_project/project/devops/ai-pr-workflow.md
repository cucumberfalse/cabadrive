# AI PR Workflow

Changes to `main` must land through pull requests, never direct pushes.

Repository-changing work starts with Orchestrator entry by default. Feature
requests, bug reports, documentation or process changes, implementation
requests, and similarly phrased work must not begin as direct Analyst,
Architect, Implementation Agent, or Review Agent work unless Orchestrator has
assigned that role and task slice.

Before starting any new repository-changing work item, Orchestrator fetches or
otherwise verifies latest `origin/main`, creates or requires a fresh isolated
worktree/branch from that latest main, records the base context, and preserves
parallel work. When no current `feature-request.md` exists, Orchestrator invokes
Analyst first for intake while remaining strictly in the Orchestrator role.
Analyst creates the next numbered `specs/<feature-id>/` folder, writes the
intake `feature-request.md`, hands off the latest-main intake branch/worktree
context to Orchestrator, and shuts down until Orchestrator explicitly invokes
final Analyst validation or a new intake request. The Architect then writes
`spec.md`, `plan.md`, and `tasks.md` from that intake artifact before
implementation begins.

The Analyst-created latest-main handoff context may continue through Architect
planning. Orchestrator may also assign that same handoff branch/worktree as the
single implementation PR slice for the work cycle when it explicitly chooses
that route. Additional implementation task slices always start from latest
`origin/main` in their own isolated worktrees, branches, and PRs, with the
active feature memory included or referenced as Orchestrator directs.

The Orchestrator controls development through production readiness by invoking
Analyst, Architect, Implementation Agent, and Review Agent as needed. The
Orchestrator coordinates and gates the work, but must not directly edit
repository files. If an Implementation Agent records divergence or improvement
feedback, the Orchestrator tracks it and invokes Architect so each item becomes
either a task/ticket or an explicit not-needed decision.

## Work Cycle And PR Set

A work cycle is one repository-changing user request represented by one
`specs/<feature-id>/` folder. It starts when Orchestrator accepts the request and
creates or requires the latest-main isolated intake environment. It ends only
when final Architect validation and final Analyst validation pass, every
merge-readiness gate is satisfied, and completion or authorized merge mechanics
are the only remaining step; or when return-limit escalation creates a new
feature request.

The cycle PR set is the durable list of every PR slice that contributes to that
work cycle, including open, merged, closed, replacement, and follow-up slices.
Feature memory or PR process evidence must record each slice's purpose, branch,
PR number or reliable discovery metadata, current or final head SHA, status, and
whether it is included in final validation. Replacement-agent or rerouted-slice
work preserves and documents the prior slice state instead of hiding it from
final validation.

## Role Boundaries And Permissions

Agents stay inside the role assigned for the current task. They must not switch
roles mid-task; when different work is needed, the Orchestrator reroutes it to a
new or existing subagent with the correct role.

- Analyst creates only the intake `feature-request.md` during intake, does not
  write plans, Architect artifacts, code, reviews, commits, pushes, PRs, merge
  actions, or non-Analyst-owned files, and shuts down after handoff until
  Orchestrator explicitly invokes final Analyst validation or a new intake
  request.
- Analyst final validation, when invoked after Architect passes, checks the
  final result against the customer's desired outcome in spirit and letter using
  the original request, clarified answers, assumptions, and acceptance
  expectations. Analyst updates only append-only Analyst-owned validation notes
  in `feature-request.md`, or creates a new feature request only when
  limit-exceeded escalation requires it.
- Analyst is the only normal-flow role that may initiate user requirement
  clarification. Analyst passes concise questions to Orchestrator; Orchestrator
  asks the user and returns the answers to Analyst before intake completes.
- Architect creates and updates `spec.md`, `plan.md`, `tasks.md`, and
  disposition records, but does not write implementation changes, review PRs,
  commit, push, open PRs, or merge.
- Architect final validation, when invoked before Analyst validation,
  completion, or authorized merge mechanics, covers all PR slices in the cycle
  PR set, all Architect-assigned tasks and dispositions, architectural guidance,
  open task state, current process memory, and customer intent in spirit.
- Orchestrator may coordinate GitHub state, rerun checks, route reviews, inspect
  merge readiness, track the work cycle and cycle PR set, invoke final
  validation, and perform authorized merge actions, but must not directly edit
  repository files.
- Orchestrator relays Analyst clarification questions, but after Analyst
  handoff does not initiate new normal-flow requirement clarification with the
  user. Later roles use recorded assumptions, record Implementation Agent
  feedback for Architect disposition, or stop only for blocker exceptions such
  as safety, permissions, credentials, data-loss risk, repository conflicts or
  status ambiguity, or an unapproved human merge-owner decision.
- Implementation Agent works in the assigned isolated worktree, branch, and PR
  slice. It may stage, commit, push, and open a ready PR for that slice, but it
  does not merge.
- Review Agent reviews the PR and reports findings, preferably as GitHub inline
  review threads. It does not edit files, implement fixes, rerun checks, or
  merge while acting as reviewer.

## Autonomous Orchestration

Orchestrator should proceed without unnecessary human questions when repository
memory, PR state, check state, and reviewer feedback provide enough context and
no product or architecture decision is being made.

Expected routing:

- proceed when the next action is implied by current feature memory, PR state,
  or documented workflow;
- retry or rerun checks when a stuck, failed, or inconclusive check has a clear
  workflow cause;
- reroute code, docs, content, spec, test, or review-fix work to the role that
  owns it;
- after Analyst handoff, continue without asking new requirement questions when
  recorded memory and assumptions provide enough context;
- ask the human only when requirements conflict, credentials or permissions are
  missing, repository state is ambiguous enough to risk data loss or scope
  expansion, conflicts or status ambiguity block progress, or the decision
  belongs to the human merge owner.

If a subagent is stuck or does not provide a final report, Orchestrator inspects
the assigned worktree, branch, dirty diff, local commits, open or discoverable
PRs, and GitHub state before replacing or rerouting the task. Existing dirty
diffs, branches, commits, PR work, and process memory must be preserved unless
the human explicitly permits discarding them. If GitHub search does not show an
expected PR, Orchestrator should also search by head branch, recent PRs, commit
SHA, or other reliable metadata before assuming no PR exists.

When assigning any subagent, Orchestrator must assume parallel Orchestrators and
agents may be active. Orchestrator creates or requires an isolated latest-main
worktree, branch, and PR slice and explicitly warns the subagent to preserve
existing dirty diffs, branches, commits, PRs, and process memory. Numeric
feature-prefix or branch ambiguity from parallel work is routed through
Orchestrator coordination instead of being solved by overwriting another
worker's files.

## PR Slicing

One task slice equals one isolated worktree, one branch, and one PR.
Implementation PRs must not mix unrelated work or silently broaden scope beyond
the assigned feature memory.

Each new task slice starts from latest `origin/main`, records the base context,
and receives its own isolated worktree, branch, and PR. Existing in-flight
branches are not discarded merely because `main` advances. If merge readiness
requires rebasing, merging, conflict resolution, or replacement work,
Orchestrator routes that work to the proper role and records it in process
memory and the cycle PR set.

Large or risky features should be decomposed into atomic, mergeable PR slices
when separation lowers risk or clarifies gates. Common slice boundaries include
source prerequisites, Architect dispositions, content implementation, metadata
fixes, final strict gates, review fixes, and minimal follow-up PRs for defects
found by final guards.

## Final Validation Loop

After implementation, review, checks, and follow-up development appear complete,
but before declaring completion or performing authorized merge mechanics,
Orchestrator verifies the cycle PR set and invokes final Architect validation.
Architect must validate every PR slice in the cycle PR set, all
Architect-assigned tasks and dispositions, architectural guidance, open task
state, current process memory, and customer intent in spirit.

If Architect finds gaps, Architect updates only Architect-owned artifacts or
disposition records, records the gap and next required task/ticket/not-needed
decision, increments the Architect return count, and returns control to
Orchestrator for role-appropriate follow-up development. Architect may return
work at most 10 times per work cycle. If another Architect gap would exceed
that limit, Architect records the breach and tells Orchestrator to ask Analyst
for a new feature request.

Only after final Architect validation passes does Orchestrator invoke final
Analyst validation. Analyst checks whether the final result matches the
customer's desired outcome in spirit and letter using the original request,
clarified answers, assumptions, open questions, and acceptance expectations.

If Analyst finds gaps within the return limit, Analyst updates only
Analyst-owned validation notes in `feature-request.md`, increments the Analyst
return count, and returns feedback to Orchestrator. Orchestrator must route that
Analyst feedback to Architect for accept/task/ticket/dispose disposition before
any follow-up development starts. Analyst may return work at most 5 times per
work cycle. If another Analyst gap would exceed that limit, Analyst creates a
new feature request in a separate latest-main branch/worktree.

Final validation return counts are per work cycle. Passing validation and
read-only rechecks do not count as returns. Follow-up PRs opened to address
Architect or Analyst validation gaps stay in the same work cycle until
completion or return-limit escalation.

The active required-check list is `.unicorn-hub/config.json` (`requiredChecks`); installed defaults reflect the active profile. Stack-specific profiles that preserve existing target CI ship only `guard` and `AI Review` and expect the team to add the repository's real CI job names before applying branch protection.

PRs are merge-ready only when every required check is green on the current head,
blocking review findings are resolved or outdated, docs/specs are updated,
feature-memory feedback has Architect disposition, acceptance evidence is
recorded, final guards have evidence, final Architect validation and final
Analyst validation have passed, return-limit state is recorded, and no conflicts
remain. Red, missing,
queued, or running required checks; unresolved blocking review findings;
conflicts; stale process memory; missing evidence; or unresolved Implementation
Agent feedback block merge and completion. Analyst feedback also blocks
follow-up development and completion until Architect accepts, tasks, tickets, or
explicitly disposes it.

Auto-merge is not a CI automation feature in this repository guidance. It means
Orchestrator may merge without asking again only when the current user
instructions already authorize merge behavior and Orchestrator has verified the
merge-ready preconditions through GitHub state plus local read-only guards. A
human remains the default merge owner when no such authorization exists.

Current executable feature-memory checks, including local preflight and the CI
guard script, still validate the existing `spec.md`, `plan.md`, and `tasks.md`
contract. The `feature-request.md` requirement is currently enforced by
author/review process checks until a separate guard-script feature adds
executable coverage.

The `AI Review` workflow validates the configured native review backend from the `AI_REVIEW_AGENT` repository variable. On same-repository pull request events with `AI_REVIEW_GITHUB_TOKEN` configured, it posts the selected backend trigger comment first, then polls for acceptable review evidence on the current PR head. Fork, read-only-token, or missing-review-token runs skip the automatic trigger and wait for existing or human-triggered review evidence. Manual `workflow_dispatch` runs keep the `trigger_mode` input so maintainers can choose `skip` when they only want to validate existing review evidence.

If `AI_REVIEW_GITHUB_TOKEN` is configured as a repository Actions secret, the workflow uses it for review-gate API calls; otherwise it falls back to the built-in `github.token`.

The required gate executes scripts from the default branch so review validation is not controlled by pull request code.

Before merge, the author should also confirm the SENAR done gate:

- repository-changing work entered through Orchestrator, and Orchestrator did
  not directly edit repository files
- manual author/review check: Analyst intake is present as `feature-request.md`, or a legacy/no-intake reason is recorded; this is not currently a preflight/CI guarantee
- any Analyst clarification was relayed through Orchestrator, or intake records
  why no clarification was needed
- assigned work used an isolated worktree, branch, and PR slice with
  parallel-work preservation guidance
- latest `origin/main` startup/base context is recorded for the work item and
  each new task slice, except when the Analyst-created latest-main handoff
  branch is explicitly used as the single PR slice
- the cycle PR set records each contributing PR slice by purpose, branch, PR
  metadata, head SHA, status, and final-validation inclusion
- every acceptance criterion has evidence in the PR, plan, or linked checks
- the negative scenario is covered or explicitly waived
- process memory records dead ends, decisions, known issues, verification evidence, and Implementation Agent feedback
- Implementation Agent feedback is either absent or has Architect disposition
- final Architect validation passed before final Analyst validation, and any
  Architect returns stayed within the limit of 10 or escalated to a new feature
  request through Orchestrator and Analyst
- final Analyst validation passed after Architect validation, and any Analyst
  gaps were recorded only in Analyst-owned validation notes, counted against the
  limit of 5, and routed through Architect disposition before follow-up
  development
- any remaining known issue is accepted by the human merge owner

Completion cannot rely only on an Implementation Agent summary, Review Agent
summary, or other AI-written summary. Orchestrator completion evidence must name
the current PR head and be backed by GitHub state plus local read-only checks
such as feature-memory validation, repository checks, preflight, text-search
evidence, and manual diff review appropriate to the feature.
