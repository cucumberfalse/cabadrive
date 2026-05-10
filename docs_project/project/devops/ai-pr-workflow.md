# AI PR Workflow

Changes to `main` must land through pull requests, never direct pushes.

Repository-changing work starts with Orchestrator entry by default. Feature
requests, bug reports, documentation or process changes, implementation
requests, and similarly phrased work must not begin as direct Analyst,
Architect, Implementation Agent, or Review Agent work unless Orchestrator has
assigned that role and task slice.

When no current `feature-request.md` exists, Orchestrator invokes Analyst first
for intake while remaining strictly in the Orchestrator role. Analyst creates
the next numbered `specs/<feature-id>/` folder, writes `feature-request.md`,
hands off the intake branch/worktree context to Orchestrator, and shuts down.
The Architect then writes `spec.md`, `plan.md`, and `tasks.md` from that intake
artifact before implementation begins.

The Orchestrator controls development through production readiness by invoking
Analyst, Architect, Implementation Agent, and Review Agent as needed. The
Orchestrator coordinates and gates the work, but must not directly edit
repository files. If an Implementation Agent records divergence or improvement
feedback, the Orchestrator tracks it and invokes Architect so each item becomes
either a task/ticket or an explicit not-needed decision.

## Role Boundaries And Permissions

Agents stay inside the role assigned for the current task. They must not switch
roles mid-task; when different work is needed, the Orchestrator reroutes it to a
new or existing subagent with the correct role.

- Analyst creates only `feature-request.md`, does not write plans, code,
  reviews, commits, pushes, or PRs, and shuts down after handoff.
- Analyst is the only normal-flow role that may initiate user requirement
  clarification. Analyst passes concise questions to Orchestrator; Orchestrator
  asks the user and returns the answers to Analyst before intake completes.
- Architect creates and updates `spec.md`, `plan.md`, `tasks.md`, and
  disposition records, but does not write implementation changes, review PRs,
  commit, push, open PRs, or merge.
- Orchestrator may coordinate GitHub state, rerun checks, route reviews, inspect
  merge readiness, and perform authorized merge actions, but must not directly
  edit repository files.
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
agents may be active. Orchestrator creates or requires an isolated worktree,
branch, and PR slice and explicitly warns the subagent to preserve existing
dirty diffs, branches, commits, PRs, and process memory. Numeric feature-prefix
or branch ambiguity from parallel work is routed through Orchestrator
coordination instead of being solved by overwriting another worker's files.

## PR Slicing

One task slice equals one isolated worktree, one branch, and one PR.
Implementation PRs must not mix unrelated work or silently broaden scope beyond
the assigned feature memory.

Large or risky features should be decomposed into atomic, mergeable PR slices
when separation lowers risk or clarifies gates. Common slice boundaries include
source prerequisites, Architect dispositions, content implementation, metadata
fixes, final strict gates, review fixes, and minimal follow-up PRs for defects
found by final guards.

The active required-check list is `.unicorn-hub/config.json` (`requiredChecks`); installed defaults reflect the active profile. Stack-specific profiles that preserve existing target CI ship only `guard` and `AI Review` and expect the team to add the repository's real CI job names before applying branch protection.

PRs are merge-ready only when every required check is green on the current head,
blocking review findings are resolved or outdated, docs/specs are updated,
feature-memory feedback has Architect disposition, acceptance evidence is
recorded, final guards have evidence, and no conflicts remain. Red, missing,
queued, or running required checks; unresolved blocking review findings;
conflicts; stale process memory; missing evidence; or unresolved Implementation
Agent feedback block merge and completion.

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
- every acceptance criterion has evidence in the PR, plan, or linked checks
- the negative scenario is covered or explicitly waived
- process memory records dead ends, decisions, known issues, verification evidence, and Implementation Agent feedback
- Implementation Agent feedback is either absent or has Architect disposition
- any remaining known issue is accepted by the human merge owner

Completion cannot rely only on an Implementation Agent summary, Review Agent
summary, or other AI-written summary. Orchestrator completion evidence must name
the current PR head and be backed by GitHub state plus local read-only checks
such as feature-memory validation, repository checks, preflight, text-search
evidence, and manual diff review appropriate to the feature.
