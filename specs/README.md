# Feature Memory

Create one folder per repository-changing feature or change:

```text
001-example/
  feature-request.md
  spec.md
  plan.md
  tasks.md
```

`feature-request.md` is the Analyst intake artifact. It records the original
request, clarification Q&A, assumptions, project context, external research
when used, open questions, risks, and acceptance expectations before Architect
planning starts.

Repository-changing requests default to Orchestrator entry. Orchestrator
fetches or otherwise verifies latest `origin/main`, creates or requires a fresh
isolated intake worktree/branch, invokes Analyst first when no current
`feature-request.md` exists, relays any Analyst clarification questions to the
user, returns answers to Analyst, and takes the Analyst-created latest-main
intake branch/worktree context forward after Analyst handoff. Analyst is the
only normal-flow role that may initiate user requirement clarification.

The Analyst-created latest-main handoff context may continue through Architect
planning. It may become the single implementation PR slice only when
Orchestrator explicitly assigns it that way. Additional task slices must start
from latest `origin/main` in separate isolated worktrees, branches, and PRs, and
parallel dirty diffs, branches, commits, PRs, and process memory must be
preserved.

`spec.md`, `plan.md`, and `tasks.md` are the Architect-owned implementation
feature memory. Repository-changing PRs must include all four artifacts once the
Analyst workflow is in use. Legacy feature folders created before Analyst
adoption may omit `feature-request.md` only when the reason is recorded in
`tasks.md`.

Current executable feature-memory guard checks still enforce the existing
`spec.md`, `plan.md`, and `tasks.md` contract. Until guard-script support is
added in a separate feature, `feature-request.md` presence is a mandatory
manual author/review process check for non-legacy repository-changing work.

Use the installed `.specify/templates/` files so each feature records goal,
scope, acceptance evidence, negative scenarios, process memory, review
requirements, and verification requirements.

## Work Cycle And Final Validation

A work cycle is one repository-changing user request represented by one feature
folder. It includes Analyst intake, Architect planning, all implementation and
review PR slices, final validation passes, follow-up returns, and completion or
return-limit escalation.

Feature memory or PR process evidence must maintain a cycle PR set for final
validation. The set records every contributing PR slice by purpose, branch, PR
number or reliable discovery metadata, current or final head SHA, status, and
whether it is included in final validation.

Before completion or authorized merge mechanics, Orchestrator invokes final
Architect validation first. Architect validates all PR slices, Architect-assigned
tasks and dispositions, architectural guidance, open task state, process memory,
and customer intent in spirit. Architect gaps update only Architect-owned
artifacts/dispositions, increment the Architect return count, and return control
to Orchestrator. Architect may return work at most 10 times per work cycle; if
another Architect gap would exceed that limit, Architect reports the breach and
Orchestrator asks Analyst for a new feature request.

After Architect passes, Orchestrator invokes final Analyst validation. Analyst
validates the final result against the customer's desired outcome in spirit and
letter using the original request, clarified answers, assumptions, and
acceptance expectations. Analyst gaps update only Analyst-owned validation notes
in `feature-request.md`, increment the Analyst return count, and must be routed
to Architect for accept/task/ticket/dispose disposition before follow-up
development. Analyst may return work at most 5 times per work cycle; if another
Analyst gap would exceed that limit, Analyst creates a new feature request in a
separate latest-main branch/worktree.

Final validation adds gates but does not replace merge readiness. Required
checks, blocking review status, conflict status, acceptance evidence, current
process memory, Implementation Agent feedback disposition, final guard evidence,
and human merge-owner rules remain required.

## Numbering

The Analyst chooses the feature folder number by scanning existing directories
under `specs/`, taking the maximum numeric prefix, adding one, and zero-padding
to three digits. Duplicate existing prefixes do not change the rule; for
example, if several `002-*` folders exist, the next prefix is `003`.

If the target folder name collides, keep the same next numeric prefix and choose
a clearer slug, or ask the Orchestrator to coordinate before writing. When
parallel Orchestrators or agents may be active, Orchestrator must account for
observed sibling worktrees, branches, and unmerged feature folders before
assigning work, and must warn subagents to preserve existing dirty diffs,
branches, commits, PRs, and process memory. If one request contains independent
goals, split them into separate folders or record a split decision before
handoff.
