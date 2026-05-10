# Plan: <FEATURE_NAME>

## Summary

`[Implementation approach.]`

## Technical Context

- runtime:
- dependencies:
- product paths:
- data changes:
- latest-main base evidence:
- assigned isolated worktree/branch:

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
- Latest-main isolation:
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
- Additional task-slice startup: `[How each additional slice verifies latest origin/main and creates a fresh isolated worktree/branch/PR.]`

## Complexity Tracking

`[Document any new abstraction or complexity.]`

## Verification

| Acceptance criterion | Evidence |
| --- | --- |
| AC-001 | `[Command, test, screenshot, diff, or manual check]` |
| Latest-main startup | `[Text search, command output, base SHA, or process evidence]` |
| Cycle PR set | `[Evidence that purpose, branch, PR metadata, head SHA, status, and validation inclusion are recorded]` |
| Final Architect validation | `[Evidence Architect validation ran before Analyst and covered all PR slices, Architect-assigned tasks/dispositions, architectural guidance, open task state, process memory, and customer intent in spirit]` |
| Final Analyst validation | `[Evidence Analyst validation ran after Architect and checked customer intent in spirit and letter]` |
| Effective content head and current-head guard | `[Validated effective content head, final-validation evidence-only commit evidence if any, current PR head, read-only guard result, and stale-validation routing if any non-evidence post-validation content changed]` |
| Return limits | `[Architect return count <= 10, Analyst return count <= 5, or new-feature-request escalation evidence]` |
| Merge gates | `[Required checks, review, conflict, acceptance evidence, process memory, feedback disposition, final guards, and human merge-owner evidence]` |

Negative scenario evidence:

- `[Command, test, screenshot, diff, or manual check]`

Process enforcement evidence:

- `[Text search or review evidence for non-Orchestrator stop conditions, implementation prerequisites, recovery guidance, and Review Agent bypass checks when relevant.]`

## Risks

- `[Risk and mitigation]`
