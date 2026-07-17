# AI PR Workflow

Changes to `main` must land through pull requests, never direct pushes.

Repository-changing work starts with Orchestrator entry by default. Feature
requests, bug reports, documentation or process changes, implementation
requests, and similarly phrased work must not begin as direct Analyst,
Architect, Implementation Agent, or Review Agent work unless Orchestrator has
assigned that role and task slice.

Read-only assistance is allowed outside the implementation flow when it only
inspects, explains, summarizes, reports status, shows command output, plans
without writing files, or reviews without mutating files or GitHub state. The
moment the interaction asks for or implies repository mutation, including docs
or process edits, staging, committing, pushing, opening or changing a PR, or
workflow-setting changes, the active model must apply Orchestrator-first
routing before the first mutation.

If the active model is not explicitly operating as Orchestrator for that
repository-changing request, it must stop and say Orchestrator routing is
needed. It must not silently become Orchestrator, Analyst, Architect,
Implementation Agent, or Review Agent, and it must not treat a direct user
implementation request as a role handoff.

Before starting any new repository-changing work item, Orchestrator verifies
latest `main`, normally by fetching `origin/main`, creates or requires a fresh
isolated worktree/branch from that verified base, records the base context, and
preserves parallel work. Fetch failure or unavailable base verification is a
documented fallback or blocker, never permission to silently reuse stale local
state. When no current `feature-request.md` exists, Orchestrator
invokes Analyst first for intake while remaining strictly in the Orchestrator
role. Analyst creates the next numbered `specs/<feature-id>/` folder, writes the
intake `feature-request.md`, hands off the latest-main intake branch/worktree
context to Orchestrator, and shuts down until Orchestrator explicitly invokes
final Analyst validation or a new intake request. The Architect then writes
`spec.md`, `plan.md`, and `tasks.md` from that intake artifact before
implementation begins.

The Analyst-created latest-main handoff context may continue through Architect
planning. Orchestrator may also assign that same handoff branch/worktree as the
single implementation PR slice for the work cycle when it explicitly chooses
that route. Additional implementation task slices always start from latest
verified `main`, normally `origin/main` after fetch, in their own isolated
worktrees, branches, and PRs, with the active feature memory included or
referenced as Orchestrator directs; fetch/base verification failure must be
recorded as a blocker or explicit fallback.

The Orchestrator controls development through production readiness by invoking
Analyst, Architect, Implementation Agent, and Review Agent as needed. The
Orchestrator coordinates and gates the work, but must not directly edit
repository files. If an Implementation Agent records divergence or improvement
feedback, the Orchestrator tracks it and invokes Architect so each item becomes
either a task/ticket or an explicit not-needed decision.

If accidental direct edits or GitHub mutations start before the Orchestrator
route or implementation prerequisites are satisfied, recovery is stop, report,
preserve, and restart through Orchestrator/user disposition. The agent records
what happened, preserves user and sibling-agent work, and waits for an explicit
adopt/revert/salvage decision assigned to the proper role. Hidden continuation,
silent role switching, destructive cleanup, and reverting work the agent did
not make are not allowed.

## Work Cycle And PR Set

A work cycle is one repository-changing user request represented by one
`specs/<feature-id>/` folder. It starts when Orchestrator accepts the request and
creates or requires the latest-main isolated intake environment. It ends only
when final Architect validation and final Analyst validation pass, every
merge-readiness gate is satisfied, and Orchestrator has completed conservative
finalization and merge; or when return-limit escalation creates a new feature
request or a narrow exceptional human blocker is recorded.

The cycle PR set is the durable list of every PR slice that contributes to that
work cycle, including open, merged, closed, replacement, and follow-up slices.
Feature memory or PR process evidence must record each slice's purpose, branch,
PR number or reliable discovery metadata, current or final head SHA, status, and
whether it is included in final validation. Replacement-agent or rerouted-slice
work preserves and documents the prior slice state instead of hiding it from
final validation.

## Finalization Model

Earlier Cabadrive workflow text made "human final merge owner" the default
terminal state and allowed Orchestrator merge only when the current user had
already granted explicit authorization. That wording caused Orchestrators to
stop after reporting that only final human approval or merge mechanics remained,
even when checks, review, conflicts, process memory, and final validation were
already satisfied. The repository now treats Orchestrator-managed PRs as having
standing authorization for conservative finalization after objective gates pass.

Orchestrator finalization is a GitHub-level coordination action, not direct
repository editing and not CI-driven unattended merging. Orchestrator must verify
the current PR head from GitHub state plus local read-only guards, then squash
merge through GitHub only when all gates are satisfied. Red, missing, queued,
pending, running, skipped, or ambiguous required checks are blockers. Pending
required checks may only lead to GitHub protected auto-merge when Orchestrator
explicitly asks for that behavior with the finalization helper.

Human intervention remains exceptional: missing credentials or permissions,
explicit user instruction not to merge, ambiguous repository or PR state that
could risk data loss or the wrong PR, unresolved accepted-known-issue owner
decisions, or protected-branch/ruleset policy blockers that prevent GitHub merge
despite satisfied workflow gates.

## Fresh Latest-Main Startup

Every new repository-changing Orchestrator run defaults to a fresh isolated
environment based on latest verified `main`. The normal startup path is:

1. fetch `origin main`;
2. record the verified `origin/main` base SHA in feature memory or handoff
   evidence;
3. create or assign a new isolated worktree, branch, and PR slice from that
   base;
4. warn assigned subagents that parallel work may exist and that existing dirty
   diffs, branches, commits, PRs, process memory, active worktrees, and
   ambiguous local paths must be preserved.

If fetch fails, `origin/main` cannot be verified, or the only available
environment is stale, dirty, or ambiguous, Orchestrator must stop for a
documented blocker exception or record an explicit fallback with evidence. It
must not silently reuse a stale worktree or unknown base as if it were current.

## Role Boundaries And Permissions

Agents stay inside the role assigned for the current task. They must not switch
roles mid-task; when different work is needed, the Orchestrator reroutes it to a
new or existing subagent with the correct role.

- Analyst creates only the intake `feature-request.md` during intake, does not
  write plans, Architect artifacts, code, reviews, commits, pushes, PRs, merge
  actions, or non-Analyst-owned files, and shuts down after handoff until
  Orchestrator explicitly invokes final Analyst validation or a new intake
  request.
- Analyst starts only after Orchestrator routes the request to Analyst; Analyst
  does not self-assign intake from a new repository-changing request.
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
- If asked to implement while acting as Architect, Architect stops and routes
  the request back to Orchestrator.
- Architect final validation, when invoked before Analyst validation,
  completion, or finalization/merge, covers all PR slices in the cycle
  PR set, all Architect-assigned tasks and dispositions, architectural guidance,
  open task state, current process memory, and customer intent in spirit.
- Orchestrator may coordinate GitHub state, rerun checks, route reviews, inspect
  merge readiness, track the work cycle and cycle PR set, invoke final
  validation, and perform conservative finalization/merge actions, but must not
  directly edit repository files.
- Orchestrator coordinates completion-time cleanup through Cleanup Agent when
  completed agent-created environments should be removed. Orchestrator must not
  directly delete local repository environments.
- Orchestrator relays Analyst clarification questions, but after Analyst
  handoff does not initiate new normal-flow requirement clarification with the
  user. Later roles use recorded assumptions, record Implementation Agent
  feedback for Architect disposition, or stop only for blocker exceptions such
  as safety, permissions, credentials, data-loss risk, repository conflicts or
  status ambiguity, explicit no-merge instruction, or an accepted-known-issue
  owner decision.
- Implementation Agent works in the assigned isolated worktree, branch, and PR
  slice only after complete feature memory exists: `feature-request.md`,
  `spec.md`, `plan.md`, and `tasks.md`, except documented legacy/no-intake
  exceptions. It may stage, commit, push, and open a ready PR for that slice,
  but it does not merge.
- Review Agent reviews the PR and reports findings, preferably as GitHub inline
  review threads. It does not edit files, implement fixes, rerun checks, or
  merge while acting as reviewer.
- Cleanup Agent performs only assigned local-disk cleanup of completed
  agent-created Cabadrive environments. It does not edit repository files,
  stage, commit, push, open PRs, review, merge, change branch protection, touch
  secrets, touch production resources, or remove user-owned directories.

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
  expansion, conflicts or status ambiguity block progress, explicit instructions
  forbid merge, or an accepted known issue still needs an owner decision.

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

## Completion-Time Cleanup

Cleanup is destructive local-disk work, so it is coordinated by Orchestrator and
executed only by an assigned Cleanup Agent. Non-cleanup roles may coordinate
cleanup, request Cleanup Agent assignment, or record evidence only; they must
not delete local repository environments. Cleanup starts with a dry-run
inventory and approved cleanup roots. Name patterns, modification times, and
memory are discovery hints only; they are not proof that deletion is safe.

Cleanup Agent may remove a candidate only when evidence proves all of the
following:

- the path is inside an approved Cabadrive agent-environment root;
- the path belongs to the Cabadrive repository remote or has Architect-approved
  Cabadrive agent metadata;
- worktree registration or equivalent metadata ties it to an agent-created work
  environment;
- the target is not the current Orchestrator, Analyst, Architect,
  Implementation Agent, Review Agent, Cleanup Agent, or user worktree;
- the target is inactive, not locked, and has no running process using it;
- `git status --short` is empty, including no untracked work;
- upstream, merge, or closure evidence proves there are no unpushed commits to
  preserve;
- GitHub lookup shows no open or unresolved PR for the branch/head SHA;
- active process memory does not reference the target;
- final agent report, merged/closed PR evidence, or explicit Orchestrator state
  proves the work is complete.

Cleanup Agent must preserve and record refusal evidence for current, active,
dirty, untracked, unpushed, no-upstream, open-PR, PR-lookup-failed, locked,
running-process, ambiguous, user-owned, out-of-root, non-Cabadrive, or
process-memory-referenced targets. Registered worktrees are removed with
`git worktree remove <path>`; raw recursive deletion is forbidden for registered
worktrees and is allowed only for non-worktree generated artifacts when the
assignment and evidence explicitly authorize it.

Cleanup evidence must include candidate inventory, approved roots, excluded
active/current paths, branch, HEAD SHA, remote URL, worktree registration state,
git status, upstream/unpushed result, PR state, lock/process result,
process-memory check, completion signal, action or refusal reason, exact
deletion command for removed targets, and post-cleanup confirmation.

## PR Slicing

One task slice equals one isolated worktree, one branch, and one PR.
Implementation PRs must not mix unrelated work or silently broaden scope beyond
the assigned feature memory.

Each new task slice starts from latest verified `main`, normally `origin/main`
after fetch, records the base context, and receives its own isolated worktree,
branch, and PR. Fetch/base verification failure must be recorded as a blocker
or explicit fallback; stale local state must not be silently reused. Existing
in-flight branches are not discarded merely because `main` advances. If merge
readiness requires rebasing, merging, conflict resolution, or replacement work,
Orchestrator routes that work to the proper role and records it in process
memory and the cycle PR set.

Large or risky features should be decomposed into atomic, mergeable PR slices
when separation lowers risk or clarifies gates. Common slice boundaries include
source prerequisites, Architect dispositions, content implementation, metadata
fixes, final strict gates, review fixes, and minimal follow-up PRs for defects
found by final guards.

## Final Validation Loop

After implementation, review, checks, and follow-up development appear complete,
but before declaring completion or performing finalization/merge,
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

When Architect passes final validation, Architect records the pass in
Architect-owned memory with both `Architect validation pass: passed` and
`Final Architect validation completed at: <ISO 8601 timestamp>`. The timestamp
must be a parseable ISO 8601 timestamp with timezone, such as
`2026-05-10T13:00:00Z`.

Only after final Architect validation passes does Orchestrator invoke final
Analyst validation. Analyst checks whether the final result matches the
customer's desired outcome in spirit and letter using the original request,
clarified answers, assumptions, open questions, and acceptance expectations.

When Analyst passes final validation, Analyst records the pass in
Analyst-owned `feature-request.md` memory with both
`Analyst validation pass: passed` and
`Final Analyst validation completed at: <ISO 8601 timestamp>`. The Analyst
timestamp must be later than the Architect timestamp. The finalization helper
treats missing, invalid, equal, or reversed completion markers as a validation
order blocker, even when both legacy pass lines are present.

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

Architect and Analyst final validation may validate the effective content head:
the PR head that contains implementation, workflow docs/templates, feature
memory, review fixes, and other behaviorally meaningful content. A later commit
may avoid recursive Architect and Analyst validation only when it is strictly a
final-validation evidence-only commit. Evidence-only means it changes only
role-owned validation evidence or process memory, such as Analyst-owned
validation notes in `feature-request.md` or final-validation evidence in
`tasks.md`. Role/process evidence must record the marker
`Effective content head: <40-hex-sha>` for the head that was validated.
Architect-owned passing notes must also record
`Architect validated effective content head: <40-hex-sha>`, and
Analyst-owned passing notes must record
`Analyst validated effective content head: <40-hex-sha>` for the same SHA.

Before declaring completion or performing finalization/merge after such
a commit, Orchestrator must run a read-only current-PR-head guard. The guard
names the current PR head, compares it with the validated effective content
head, explicitly references the effective content head by full SHA or
unambiguous short prefix, confirms any intervening commit is evidence-only,
verifies process memory is current, and rechecks required checks, blocking
review findings, conflicts, acceptance evidence, feedback disposition, final
guards, and exceptional human-blocker rules. If any post-validation commit changes product behavior, durable workflow
rules, templates, scoped implementation docs, code, tests, runtime files, CI,
branch protection, review dispositions, or other non-evidence content, prior
Architect and Analyst validation is stale and Orchestrator must route the work
back through role-appropriate follow-up or final validation.

The active required-check list is `.unicorn-hub/config.json` (`requiredChecks`); installed defaults reflect the active profile. Stack-specific profiles that preserve existing target CI ship only `guard` and `AI Review` and expect the team to add the repository's real CI job names before applying branch protection.

PRs are merge-ready only when every required check is green on the current head,
blocking review findings are resolved or outdated, required review conversations
are resolved, docs/specs are updated, feature-memory feedback has Architect
disposition, acceptance evidence is recorded, final guards have evidence, final
Architect validation and final Analyst validation have passed in order,
with explicit ISO completion markers proving Architect completed before Analyst,
return-limit state is recorded, the current-PR-head guard is current when
required, and no conflicts remain. Red, missing,
queued, or running required checks; unresolved blocking review findings;
conflicts; stale process memory; missing evidence; or unresolved Implementation
Agent feedback block merge and completion. Analyst feedback also blocks
follow-up development and completion until Architect accepts, tasks, tickets, or
explicitly disposes it.

For Orchestrator-managed PRs, merge readiness is not a "ready for human merge"
terminal state. Orchestrator should run the finalization helper, for example
`pnpm run pr:finalize -- --pr <number> --expected-head <sha> --feature specs/<feature-id>`,
after final validation and current-head guards are recorded. The helper reads
required checks from `.unicorn-hub/config.json`, verifies the current head,
review resolution, blocking findings, mergeability, process evidence, and then
uses GitHub squash merge by default. A feature that must preserve individual
commit identities may explicitly select merge commit with
`--merge-method merge`; unsupported values, including `rebase`, fail closed and
all existing expected-head/check/review/conflict/process-evidence gates remain
mandatory. Process evidence must include
`Effective content head: <40-hex-sha>`,
`Architect validated effective content head: <40-hex-sha>`, and
`Analyst validated effective content head: <40-hex-sha>` for the same SHA, and
the current-head guard evidence must explicitly reference that effective content
head by full SHA or unambiguous short prefix.
When the current PR head differs from the effective content head, the helper
uses local git to verify that every changed file after the effective head is one
of the active feature memory files: `feature-request.md`, `spec.md`, `plan.md`,
or `tasks.md`. It blocks if local git cannot verify the comparison or if any
other file changed. Mutating finalization and auto-merge require
`--expected-head` or `--head-sha` for the reviewed and validated PR head; the
helper blocks if the explicit expected head is absent or differs from the
current PR head returned by GitHub. Dry-run inspection may omit the expected
head. The helper provides no direct-push, force, or admin-bypass path. With
`--auto-merge-pending`, pending required checks may enable GitHub protected
auto-merge instead of immediate merge; without that flag they remain blockers.
PR #209 must be finalized with
`pnpm run pr:finalize -- --pr 209 --expected-head <sha> --feature specs/044-quality-tooling --merge-method merge`
so its recorded format-only commit remains reachable from `main`. Squash or
rebase finalization is not an allowed fallback for that PR.

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
- no non-Orchestrator active model implemented directly, self-promoted, or left
  an unhandled accidental-start recovery issue
- manual author/review check: Analyst intake is present as `feature-request.md`, or a legacy/no-intake reason is recorded; this is not currently a preflight/CI guarantee
- any Analyst clarification was relayed through Orchestrator, or intake records
  why no clarification was needed
- assigned work used an isolated worktree, branch, and PR slice with
  parallel-work preservation guidance
- sibling worktrees, branches, dirty diffs, commits, PR state, and process
  memory were preserved unless Orchestrator explicitly coordinated a change
- latest verified `main` startup/base context is recorded for the work item and
  each new task slice, except when the Analyst-created latest-main handoff
  branch is explicitly used as the single PR slice; any fallback/blocker is
  documented
- the cycle PR set records each contributing PR slice by purpose, branch, PR
  metadata, head SHA, status, and final-validation inclusion
- every acceptance criterion has evidence in the PR, plan, or linked checks
- the negative scenario is covered or explicitly waived
- process memory records dead ends, decisions, known issues, verification evidence, and Implementation Agent feedback
- cleanup evidence is present for any assigned cleanup scope, or cleanup is
  explicitly recorded as not applicable or refused for safety
- Implementation Agent feedback is either absent or has Architect disposition
- final Architect validation passed before final Analyst validation, and any
  Architect returns stayed within the limit of 10 or escalated to a new feature
  request through Orchestrator and Analyst
- final Analyst validation passed after Architect validation, and any Analyst
  gaps were recorded only in Analyst-owned validation notes, counted against the
  limit of 5, and routed through Architect disposition before follow-up
  development
- if the current PR head is after the effective content head validated by
  Architect and Analyst, Orchestrator's read-only current-PR-head guard confirms
  the recorded `Effective content head: <40-hex-sha>`, matching
  `Architect validated effective content head: <40-hex-sha>`, and matching
  `Analyst validated effective content head: <40-hex-sha>`, explicitly
  references that effective content head, verifies every later commit is
  final-validation evidence-only, and confirms all merge-readiness gates still
  apply to the current head
- any remaining known issue is resolved or has an explicit owner decision; if
  that decision is still pending, Orchestrator records it as an exceptional
  human blocker instead of merging

Completion cannot rely only on an Implementation Agent summary, Review Agent
summary, or other AI-written summary. Orchestrator completion evidence must name
the current PR head and be backed by GitHub state plus local read-only checks
such as feature-memory validation, repository checks, preflight, text-search
evidence, and manual diff review appropriate to the feature.
