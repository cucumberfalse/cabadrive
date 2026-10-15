# Feature Request: <FEATURE_NAME>

## Analyst Artifact Status

`[State whether this was created by Analyst intake, migrated from a legacy request, or prepared as a seed artifact.]`

## Orchestrator Routing Context

- Orchestrator entry: `[Who routed this repository-changing request to Analyst, and when.]`
- Active-model stop condition: `[If the request first reached a non-Orchestrator active model, record that it stopped instead of implementing and routed to Orchestrator.]`
- Read-only transition context: `[If the interaction began read-only, record when it became repository-changing. Otherwise state "Not applicable."]`
- Assigned intake worktree/branch: `[Latest-main isolated worktree and branch used for Analyst intake.]`
- Latest-main base evidence: `[origin/main fetch/verification method, base ref or SHA, date/time if available, or documented fallback/blocker if verification was unavailable.]`
- Parallel-work note: `[Known or assumed parallel Orchestrators/agents, plus preservation constraints.]`
- Accidental-start recovery context: `[If any direct edits, staging, commits, pushes, PR mutations, or other repository changes started before routing, record stop/report/preserve/disposition status. Otherwise state "None."]`
- Cleanup context: `[Known cleanup assumptions, candidate agent artifacts, excluded active worktrees, or "not applicable".]`

## User Request

`[Original user request, preserving relevant wording and constraints.]`

## Clarified Answers And Assumptions

- `[Question Analyst sent to Orchestrator, answer Orchestrator returned from the user, or explicit assumption if no answer was available.]`
- `If no clarification was requested, state why the intake was clear enough for Architect planning.`
- `If cleanup may be needed, record that candidate names, paths, or timestamps are only discovery hints and not deletion proof.`

## Project Context Reviewed

- `[Durable Cabadrive document, source file, or prior feature memory reviewed.]`

## External Research

- `[Source title](https://example.com): [Brief reason it matters.]`

If external research was not used, record why it was unnecessary or unsafe for this request.

## Problem Statement

`[The problem to solve, separated from the proposed solution.]`

## Proposed Outcome Or Workflow

1. `[Expected product, process, or documentation outcome.]`
2. `[If applicable, expected cleanup handoff, validation, evidence, and preservation behavior.]`

## Role Boundaries Or Affected Actors

- `[Actor or role]: [Responsibility and boundary.]`
- `Cleanup Agent: [When applicable, cleanup-only responsibility, forbidden actions, positive-proof validation, refusal rules, and evidence handoff.]`

## Artifact And Handoff Expectations

- Analyst writes only this `feature-request.md` intake artifact during intake.
- Non-Orchestrator active models do not create implementation changes for this request before Orchestrator routing.
- Requirement clarification, when needed, is initiated only by Analyst and relayed through Orchestrator.
- Analyst hands off to Orchestrator and shuts down after intake is ready, until Orchestrator explicitly invokes final Analyst validation after Architect passes or assigns a new intake request.
- Architect starts from this artifact and writes `spec.md`, `plan.md`, and `tasks.md`.
- Implementation starts only after complete feature memory exists and Orchestrator assigns an isolated worktree, branch, and PR slice.
- Handoff context for Orchestrator: `[intake branch/worktree, feature folder, and any known parallel-work constraints.]`
- The Analyst-created latest-main handoff context may continue through Architect planning and may become the single implementation PR slice only if Orchestrator explicitly assigns it that way; additional task slices require separate latest-main isolated worktrees/branches/PRs.
- Cleanup assumptions and excluded active work, if relevant, must be included in the handoff context.

## Open Questions And Risks

- `[Open question, ambiguity, risk, or split/collision note.]`
- `[Cleanup ownership, approved roots, active-work preservation, or ambiguous candidate risk.]`

## Acceptance Expectations

- `[Expectation for Architect to convert into acceptance criteria.]`
- `[Expected latest-main startup evidence and cleanup evidence/refusal expectations, when relevant.]`

## Final Analyst Validation Notes

Append-only Analyst-owned section used only when Orchestrator invokes final
Analyst validation after final Architect validation passes.

Keep this section free of placeholder key/value lines before the effective
content head is frozen. After a passing validation, append the pass, completion
time, validated effective content SHA, and return count as new lines. The
completion-time bullet ends at canonical `Z` without a terminal period. Record
gaps and customer-intent analysis before the effective content head is frozen;
substantive post-freeze changes require full CI and renewed role validation.
