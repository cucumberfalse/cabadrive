# Plan: <FEATURE_NAME>

## Summary

`[Implementation approach.]`

## Technical Context

- runtime:
- dependencies:
- product paths:
- data changes:
- latest-main base evidence: `[Latest verified main evidence, normally origin/main after fetch, or documented fallback/blocker if fetch or base verification was unavailable.]`
- assigned isolated worktree/branch:
- cleanup applicability: `[Not applicable, or cleanup scope/candidates/approved roots/refusal expectations.]`

## Scope Boundaries

- in scope:
- out of scope:
- role-routing constraints: `[Orchestrator-first entry, non-Orchestrator stop condition, read-only transition rule, and no self-promotion expectations.]`
- recovery constraints: `[Accidental direct-edit stop/report/preserve/restart requirements, or "Not applicable."]`
- sibling-process coordination: `[Relevant prior or sibling process features to preserve, such as 011 or 012, or "None."]`

## Constitution Check

- Spec-first:
- Testable boundaries:
- PR-only:
- Latest-main isolation: `[Fresh isolated worktree/branch from latest verified main; fetch failure or unverified base is a blocker or documented fallback, not silent stale reuse.]`
- Final validation loop:
- Simplicity:
- Deployability:
- Active-model stop condition:
- Complete feature-memory prerequisite:
- Sibling-work preservation:

## Cycle And PR-Set Tracking

- Work cycle boundary: `[Feature folder/request through all PR slices, final validations, completion, or escalation.]`
- Cycle PR set recording location: `[tasks.md, PR body, or other durable process evidence.]`
- PR slice fields: `purpose`, `branch`, `PR metadata`, `head SHA`, `status`, `included in final validation`.
- Analyst handoff handling: `[Whether latest-main intake branch continues only through planning or is assigned as the single PR slice.]`
- Additional task-slice startup: `[How each additional slice verifies latest main, normally origin/main after fetch, handles fetch/base verification failure as a documented fallback or blocker, and creates a fresh isolated worktree/branch/PR.]`

## Complexity Tracking

`[Document any new abstraction or complexity.]`

## Cleanup Planning

- Cleanup applicability: `[Not applicable, or why cleanup is in scope.]`
- Cleanup Agent assignment: `[Who performs cleanup-only validation/action, or "not applicable".]`
- Approved cleanup roots: `[Explicit roots; never rely on name pattern alone.]`
- Excluded/current work: `[Current Orchestrator, Analyst, Architect, Implementation Agent, Review Agent, Cleanup Agent worktrees, active PR work, user-owned paths, and ambiguous targets.]`
- Required validation: `[Positive-proof checks for repository identity, worktree registration, agent-created proof, activity, locks/processes, cleanliness, upstream/unpushed state, PR state, completion signal, and deletion method.]`
- Refusal conditions: `[Current, active, dirty, untracked, unpushed, open-PR, locked, running-process, ambiguous, user-owned, out-of-root, missing-check, or PR-lookup-failure targets are preserved.]`
- Evidence handoff: `[Dry-run inventory, per-target validation/action/refusal, deletion command, post-cleanup confirmation, and confirmation that active/ambiguous work was not touched.]`

## Verification

| Acceptance criterion | Evidence |
| --- | --- |
| AC-001 | `[Command, test, screenshot, diff, or manual check]` |
| Latest-main startup | `[Text search, command output, base SHA, or process evidence]` |
| Cycle PR set | `[Evidence that purpose, branch, PR metadata, head SHA, status, and validation inclusion are recorded]` |
| Final Architect validation | `[Evidence Architect validation ran before Analyst and covered all PR slices, Architect-assigned tasks/dispositions, architectural guidance, open task state, process memory, and customer intent in spirit]` |
| Final Analyst validation | `[Evidence Analyst validation ran after Architect and checked customer intent in spirit and letter]` |
| Effective content head and current-head guard | `[Validated effective content head, final-validation evidence-only commit evidence if any, current PR head, read-only guard result, and stale-validation routing if any non-evidence post-validation content changed]` |
| Cleanup applicability and evidence/refusal | `[Not applicable rationale, or Cleanup Agent dry-run inventory, validation, action/refusal, post-cleanup confirmation, and active-work preservation evidence]` |
| Cleanup review expectations | `[Review evidence that cleanup wording preserves role boundaries, blocks unsafe deletion, requires positive proof, and refuses ambiguous/current/active/user-owned targets]` |
| Return limits | `[Architect return count <= 10, Analyst return count <= 5, or new-feature-request escalation evidence]` |
| Merge gates | `[Required checks, review, conflict, acceptance evidence, process memory, feedback disposition, current-head guard, final guards, cleanup evidence/refusal when relevant, and human merge-owner evidence]` |

Negative scenario evidence:

- `[Command, test, screenshot, diff, or manual check]`

Process enforcement evidence:

- `[Text search or review evidence for non-Orchestrator stop conditions, implementation prerequisites, recovery guidance, and Review Agent bypass checks when relevant.]`

## Risks

- `[Risk and mitigation]`
