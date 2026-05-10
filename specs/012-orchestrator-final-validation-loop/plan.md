# Plan: Orchestrator Final Validation Loop

## Summary

Update Cabadrive's durable process guidance and templates so Orchestrator starts new work from latest `main`, tracks the full PR set for each work cycle, runs final Architect validation before Analyst validation, routes all validation gaps through role-safe dispositions and follow-up development, enforces bounded return limits, and preserves existing merge-readiness gates. This is a bounded documentation/template implementation with no learner-facing, runtime, CI, branch-protection, or executable guard changes.

## Technical Context

- runtime: none; process documentation and templates only.
- dependencies: none.
- product paths: none.
- data changes: none.
- feature memory path: `specs/012-orchestrator-final-validation-loop/`.
- implementation branch/worktree context: `codex/012-orchestrator-final-validation-loop` in `/Users/chap/devel/cabadrive-012-orchestrator-final-validation-loop`.
- likely implementation paths:
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
  - `specs/012-orchestrator-final-validation-loop/tasks.md`

## Scope Boundaries

- in scope: latest-main startup guidance, fresh isolated environment requirements, work-cycle definition, PR-set tracking, final Architect validation ordering/scope, final Analyst validation ordering/scope, Analyst-owned validation notes, Architect and Analyst return limits, limit-exceeded escalation, Analyst-feedback Architect disposition, role-boundary preservation, merge-gate preservation, PR/review/template alignment, and this feature memory.
- out of scope: learner-facing behavior, content, translations, assets, Docker/runtime changes, package or lockfile changes, service worker changes, CI workflow changes, branch-protection changes, required-check configuration, GitHub repository settings, secrets, production resources, and executable enforcement scripts for this new process.

## Constitution Check

- Spec-first: yes; Analyst intake exists as `feature-request.md`, and this Architect-owned spec/plan/tasks set precedes implementation.
- Testable boundaries: yes; requirements map to text search, diff scope review, feature-memory validation, repo checks, and preflight.
- Test-first bias: process-only work is better verified by failing-review scenarios, text-search evidence, PR-template/manual gate checks, and feature-memory checks than by product tests.
- PR-only: yes; implementation must land through a PR and not direct push to `main`.
- One worktree per task: yes; implementation must use the assigned isolated worktree/branch/PR slice and preserve other active work.
- Simplicity: yes; update existing process docs/templates only, with no new runtime/tooling abstraction.
- Deployability: neutral; no runtime behavior changes.
- Process memory: yes; `tasks.md` must record decisions, known issues, verification evidence, final-validation evidence, return-limit state, and Implementation Agent feedback.

## Implementation Approach

1. Confirm the assigned worktree, branch, and feature folder before editing:
   - `pwd`
   - `git status --short --branch`
   - `test -f specs/012-orchestrator-final-validation-loop/feature-request.md`
2. Read active feature memory and scoped durable docs/templates before editing.
3. Search current process language to avoid contradictions:
   - `rg -n "Orchestrator|Analyst|Architect|Implementation Agent|Review Agent|origin/main|latest main|worktree|branch|PR|cycle|final validation|completion|merge|feedback|disposition|required checks|conflict" AGENTS.md CLAUDE.md docs_project/project/devops .github/pull_request_template.md .specify/memory/constitution.md .specify/templates specs/README.md`
4. Update `AGENTS.md` and `CLAUDE.md` so durable agent guidance states:
   - new repository-changing work starts from latest `origin/main`;
   - Orchestrator creates or requires a fresh isolated environment for intake and each new task slice;
   - Analyst-created latest-main handoff context may continue through Architect planning without violating isolation;
   - additional implementation task slices are one worktree, one branch, and one PR;
   - final Architect validation precedes Analyst validation;
   - final validation does not weaken role boundaries or merge gates.
5. Update `.specify/memory/constitution.md` only as needed to add the final validation sequence after review/check resolution and before completion/merge declaration.
6. Update `docs_project/project/devops/ai-pr-workflow.md` as the main durable process narrative:
   - define a work cycle and cycle PR set;
   - require PR-set tracking in feature memory or PR process evidence;
   - describe latest-main startup for new work and new task slices;
   - describe final Architect validation scope and gap returns;
   - describe final Analyst validation scope and gap returns;
   - define Architect return limit `10` and Analyst return limit `5`;
   - define new-feature-request escalation paths;
   - preserve completion and merge-readiness gates.
7. Update `docs_project/project/devops/review-contract.md` so Review Agent checks final-validation compliance, PR-set coverage, return-limit handling, Analyst-feedback Architect disposition, and preserved gates.
8. Update `.specify/templates/feature-request-template.md` so future Analyst artifacts can include append-only final Analyst validation notes, return count, and escalation references without letting Analyst plan or implement.
9. Update `.specify/templates/spec-template.md`, `.specify/templates/plan-template.md`, and `.specify/templates/tasks-template.md` so future Architect artifacts capture cycle definition, PR-set tracking, final validation evidence, return counts, validation gaps, Analyst feedback dispositions, and limit-exceeded decisions.
10. Update `.github/pull_request_template.md` so PR authors/reviewers confirm latest-main startup evidence, cycle PR-set coverage, final Architect validation, final Analyst validation, return-limit state, and preserved merge gates.
11. Update `specs/README.md` where feature-memory lifecycle guidance needs cycle/PR-set tracking, final validation notes, or latest-main startup language.
12. Keep `specs/012-orchestrator-final-validation-loop/tasks.md` current as implementation proceeds, including unchecked-to-checked task status, decisions, known issues, verification evidence, Implementation Agent feedback, and Architect dispositions.
13. Do not implement executable enforcement, workflow YAML changes, branch-protection changes, product code, runtime changes, or repository settings changes in this feature.

## Cycle And PR-Set Tracking

- The work cycle starts when Orchestrator accepts a repository-changing request and creates or requires the latest-main isolated Analyst intake environment.
- The work cycle ends only when final Architect validation and final Analyst validation pass, all merge-readiness gates are satisfied, and completion or authorized merge mechanics are the only remaining step; or when return-limit escalation creates a new feature request.
- Follow-up PRs opened to address Architect or Analyst validation gaps remain in the same cycle until completion or escalation.
- The cycle PR set must include each contributing PR slice with branch, PR number or discovery metadata, purpose, head SHA, status, and validation inclusion.
- Replacement-agent or rerouted-slice work must preserve and document the prior slice state instead of hiding it from final validation.

## Final-Validation Evidence-Only Commit Rule

- Architect and Analyst final validation may validate the effective content head: the head that contains implementation, docs/templates, feature memory, review fixes, and other behaviorally meaningful changes.
- A later commit may record final-validation evidence without forcing recursive Architect and Analyst revalidation only when it is strictly evidence-only process memory, such as Analyst-owned validation notes in `feature-request.md` or final-validation evidence in `tasks.md`.
- Orchestrator must perform a read-only current-head guard before completion or authorized merge mechanics. That guard verifies the current PR head, compares it to the validated effective content head, confirms intervening changes are evidence-only, checks process memory is current, and confirms required checks, review, conflict, acceptance-evidence, feedback-disposition, final guard, and human merge-owner gates remain satisfied.
- If any post-validation commit changes product behavior, durable workflow rules, templates, scoped implementation docs, code, tests, runtime files, CI, branch protection, review dispositions, or any non-evidence content, prior Architect and Analyst validations are stale and Orchestrator must route the work back through role-appropriate final validation or follow-up development.
- A failed read-only current-head guard is not a validation return by itself. It counts as an Architect return only when Architect finds a gap or records a disposition that sends the cycle back to Orchestrator for follow-up development.

## Latest-Main Startup Rule

- Orchestrator must fetch or otherwise verify latest `origin/main` before creating a new work item or task-slice branch/worktree.
- Analyst intake branches are created from latest main and become the handoff context for Architect planning.
- If Orchestrator explicitly assigns the intake/planning branch as the single implementation PR slice, that branch may continue as the slice because it is already the fresh isolated environment for the cycle.
- Additional implementation slices must start from latest main in their own isolated worktree/branch/PR and include or reference the active feature memory as directed by Orchestrator.
- Existing in-flight branches are not discarded merely because main advanced; merge readiness or conflict resolution work is routed to the proper role and recorded.

## Complexity Tracking

No new runtime, CI, or tooling abstraction is expected. The main complexity is process wording: "latest main", "cycle", "all PRs", and "customer intent in spirit and letter" must be concrete enough for review without turning Architect or Analyst into implementation agents. Any request for executable enforcement should be recorded in `tasks.md` as Implementation Agent feedback for later Architect disposition.

## Verification

| Acceptance criterion | Evidence |
| --- | --- |
| AC-001 | `rg -n "latest.*main|origin/main|fresh.*isolated|isolated worktree|fresh.*worktree|base.*SHA|preserve.*parallel" AGENTS.md CLAUDE.md docs_project/project/devops .specify/memory/constitution.md .specify/templates specs/README.md .github/pull_request_template.md` |
| AC-002 | `rg -n "Analyst-created|handoff context|intake branch|intake worktree|Architect planning|single.*PR slice|additional.*task slice" AGENTS.md CLAUDE.md docs_project/project/devops .specify/templates specs/README.md` |
| AC-003 | `rg -n "work cycle|cycle PR set|PR set|PR slice.*purpose|head SHA|included in final validation|validation inclusion" AGENTS.md CLAUDE.md docs_project/project/devops .specify/templates .github/pull_request_template.md specs/README.md` |
| AC-004 | `rg -n "Architect.*final validation|final Architect validation|before.*Analyst|before.*completion|before.*merge" AGENTS.md CLAUDE.md docs_project/project/devops .specify/memory/constitution.md .specify/templates .github/pull_request_template.md` |
| AC-005 | `rg -n "all PR slices|Architect-assigned tasks|architectural guidance|open task|process memory|customer intent.*spirit|spirit" AGENTS.md CLAUDE.md docs_project/project/devops .specify/templates` |
| AC-006 | `rg -n "Architect.*gap|Architect.*disposition|task/ticket|not-needed|return count|Architect return|returns control to Orchestrator" AGENTS.md CLAUDE.md docs_project/project/devops .specify/templates specs/README.md` |
| AC-007 | `rg -n "Analyst.*final validation|after Architect|spirit and letter|customer.*intent" AGENTS.md CLAUDE.md docs_project/project/devops .specify/templates .github/pull_request_template.md` |
| AC-008 | `rg -n "original request|clarified answers|assumptions|acceptance expectations|desired outcome|spirit and letter" docs_project/project/devops .specify/templates specs/README.md AGENTS.md CLAUDE.md` |
| AC-009 | `rg -n "Analyst-owned|validation notes|feature-request.md|Analyst feedback|Architect.*accept|Architect.*task|Architect.*ticket|Architect.*dispose|before.*follow-up" AGENTS.md CLAUDE.md docs_project/project/devops .specify/templates specs/README.md` |
| AC-010 | `rg -n "10|ten|5|five|return limit|limit.*exceed|new feature request|separate.*branch|separate.*worktree" AGENTS.md CLAUDE.md docs_project/project/devops .specify/templates specs/README.md` |
| AC-011 | `rg -n "required checks|blocking review|conflicts|process memory|acceptance evidence|Implementation Agent feedback|final guard|human.*merge|AI-written summaries" AGENTS.md CLAUDE.md docs_project/project/devops .github/pull_request_template.md .specify/memory/constitution.md` |
| AC-012 | `rg -n "effective content head|evidence-only|current PR head|read-only.*guard|post-validation commit|recursive|stale" AGENTS.md CLAUDE.md docs_project/project/devops .specify/templates .github/pull_request_template.md specs/README.md specs/012-orchestrator-final-validation-loop/*.md` |
| AC-013 | `git diff --name-only` plus manual diff review showing only scoped process docs/templates and `specs/012-orchestrator-final-validation-loop/*` changed. |

Negative scenario evidence:

- Search evidence shows stale/non-latest startup is not allowed for new work or new task slices.
- Search evidence shows all PR slices in the cycle PR set must be included in final validation.
- Search evidence shows Architect gaps block Analyst validation and completion.
- Search evidence shows Analyst gaps must receive Architect disposition before follow-up development.
- Search evidence shows validation loops are bounded and escalate to new feature requests when limits are exceeded.
- Search evidence shows final validation does not replace required checks, review, conflict, process-memory, evidence, feedback-disposition, or human merge-owner gates.
- Search evidence shows final-validation evidence-only commits are allowed only for role-owned evidence recording and must be covered by Orchestrator's current-head read-only guard.
- Manual diff review confirms no learner-facing, runtime, CI workflow, branch-protection, secret, or production-resource changes.

Required command evidence:

- `git diff --check`
- `node scripts/check-feature-memory.mjs --worktree`
- `pnpm run check:repo`
- `pnpm run preflight`
- `git status --short --branch`

If a command cannot run because of local environment or unrelated repository state, record the exact command, failure, and mitigation in `tasks.md`.

## Risks

- Risk: Latest-main wording could be read as permission to discard active branches whenever main advances.
- Mitigation: Explicitly distinguish new-work/new-slice startup from preserving in-flight work and routing any rebase or conflict work to the proper role.

- Risk: "All PRs" could be under-specified for multi-slice features.
- Mitigation: Require a cycle PR set with branch, PR metadata, head SHA, status, purpose, and validation inclusion.

- Risk: Analyst final validation could violate the current "one intake artifact" boundary.
- Mitigation: Use append-only Analyst-owned validation notes inside `feature-request.md`; create a new feature request only for limit-exceeded escalation or a separate repository-changing request.

- Risk: Final validation could become an AI-written summary that weakens merge gates.
- Mitigation: Preserve existing gates and require evidence from PR state, local read-only checks, text search, diff review, and recorded process memory.

- Risk: Requiring final validation on every evidence-recording commit could create an infinite loop where validation evidence makes itself stale.
- Mitigation: Define the effective content head and allow a narrow final-validation evidence-only commit, then require Orchestrator's current-head read-only guard to prove the later commit only records validation evidence and does not change meaningful content.

- Risk: Return limits could hide unresolved work.
- Mitigation: Exceeding a limit escalates into a new feature request with preserved context instead of allowing completion.

- Risk: Process docs and templates can drift because the workflow is repeated in several files.
- Mitigation: Require text-search evidence and manual consistency review across agent docs, devops docs, templates, PR template, and `specs/README.md`.
