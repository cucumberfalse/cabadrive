# Plan: Orchestrator-First Enforcement

## Summary

Update Cabadrive's durable process guidance and templates so a non-Orchestrator active model must stop instead of directly implementing any new repository-changing user request, while read-only work remains allowed. The implementation should add operational stop/recovery/review checks around the existing `011` Orchestrator-first routing and coordinate with sibling `012` final-validation work. This is a bounded documentation/template change with no product, runtime, CI, branch-protection, or executable guard implementation.

## Technical Context

- runtime: none; process documentation and templates only.
- dependencies: none.
- product paths: none.
- data changes: none.
- feature memory path: `specs/014-orchestrator-first-enforcement/`.
- implementation branch/worktree context: `codex/013-learning-content-ui-polish` in `/Users/chap/devel/cabadrive-013-learning-content-ui-polish`, unless Orchestrator assigns a different isolated implementation slice.
- sibling context to preserve:
  - `specs/011-orchestrator-analyst-routing/*` on current/relevant branches.
  - `specs/012-orchestrator-final-validation-loop/*` in `/Users/chap/devel/cabadrive-012-orchestrator-final-validation-loop` and any related PR state.
  - `specs/013-learning-content-ui-polish/*` in the current worktree.
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
  - `specs/014-orchestrator-first-enforcement/tasks.md`

## Scope Boundaries

- in scope: active-model stop condition, read-only versus repository-changing distinction, repository-changing transition rule, no self-promotion across roles, Orchestrator-first delegation preservation, Architect artifact boundary, Implementation Agent prerequisites, accidental-direct-edit recovery, sibling-work preservation, Review Agent bypass enforcement, PR/template checklist alignment, and this feature memory.
- out of scope: learner-facing behavior, content, translations, assets, Docker/runtime changes, service worker changes, package or lockfile changes, CI workflow changes, branch-protection changes, required-check configuration, executable guard-script changes, GitHub repository settings, secrets, production resources, or edits to sibling feature memory outside `014`.

## Constitution Check

- Spec-first: yes; Analyst intake exists as `feature-request.md`, and this Architect plan precedes implementation.
- Testable boundaries: yes; requirements map to text search, diff scope review, feature-memory validation, repo checks, and preflight.
- PR-only: yes; implementation must land through a PR and not direct push to `main`.
- One worktree per task: yes; implementation must use Orchestrator-assigned isolated worktree/branch/PR context and preserve active sibling work.
- Simplicity: yes; update existing process docs/templates only, with no new automation or abstraction.
- Deployability: neutral; no runtime behavior changes.
- Process memory: yes; `tasks.md` must record decisions, risks, known issues, verification evidence, and Implementation Agent feedback.

## Implementation Approach

1. Confirm Orchestrator assignment, active worktree, branch, and feature folder before editing:
   - `pwd`
   - `git status --short --branch`
   - `test -f specs/014-orchestrator-first-enforcement/feature-request.md`
   - `test -f specs/014-orchestrator-first-enforcement/spec.md`
   - `test -f specs/014-orchestrator-first-enforcement/plan.md`
   - `test -f specs/014-orchestrator-first-enforcement/tasks.md`
2. Read active feature memory and scoped durable docs before editing.
3. Search existing workflow language to avoid contradictions with prior process work:
   - `rg -n "repository-changing|read-only|Orchestrator|Analyst|Architect|Implementation Agent|Review Agent|feature-request|stop|recover|revert|destructive|worktree|parallel|final validation|merge" AGENTS.md CLAUDE.md docs_project/project/devops .github/pull_request_template.md .specify/memory/constitution.md .specify/templates specs/README.md`
4. Compare intended wording with `specs/011-orchestrator-analyst-routing/*` and, if available, sibling `specs/012-orchestrator-final-validation-loop/*`. Use 011 for routing baseline and 012 for final-validation/completion gates.
5. Update `AGENTS.md` so it clearly states:
   - new repository-changing requests are Orchestrator-first;
   - a non-Orchestrator active model must stop and must not self-promote or directly implement;
   - read-only requests can be answered without feature memory until they become repository-changing;
   - Orchestrator remains in role and delegates;
   - Architect writes only assigned `spec.md`, `plan.md`, and `tasks.md`;
   - Implementation Agent edits only after complete feature memory and isolated assignment;
   - accidental direct edits require stop/report/preserve/restart through Orchestrator disposition;
   - recovery does not authorize destructive cleanup or reverting user/sibling work;
   - Review Agent must flag bypasses and missing prerequisites.
6. Update `CLAUDE.md` with the same active-model operating rules, especially because it is likely to influence direct local agent behavior.
7. Update `.specify/memory/constitution.md` only as needed to add the stop condition, read-only distinction, and recovery rule without expanding the constitution into implementation detail.
8. Update `.specify/templates/feature-request-template.md` to capture Orchestrator routing context, whether the request was read-only before becoming repository-changing, and any recovery context from accidental starts.
9. Update `.specify/templates/spec-template.md` and `.specify/templates/plan-template.md` so future Architect planning explicitly names active-model stop conditions, implementation prerequisites, recovery requirements, coordination with sibling process work, and out-of-scope executable enforcement when applicable.
10. Update `.specify/templates/tasks-template.md` so future task memory includes setup checks for Orchestrator assignment, complete feature memory, isolated worktree/branch/PR slice, sibling-work preservation, recovery notes, and review enforcement evidence.
11. Update `docs_project/project/devops/ai-pr-workflow.md` as the durable process narrative for active-model routing, read-only exceptions, repository-changing transition, accidental-direct-edit recovery, and coordination with existing `011`/`012` rules.
12. Update `docs_project/project/devops/review-contract.md` so Review Agent checks for Orchestrator-first bypasses, role self-promotion, missing feature memory, unsafe recovery, sibling-work mutation, and contradictions with 011/012.
13. Update `.github/pull_request_template.md` only if the checklist needs explicit confirmation of Orchestrator-first routing, complete feature memory, no bypass/recovery issue, and preservation of sibling work.
14. Update `specs/README.md` where feature-memory lifecycle guidance needs the active-model stop condition, read-only distinction, or recovery path.
15. Keep `specs/014-orchestrator-first-enforcement/tasks.md` current during implementation, including task status, decisions, known issues, verification evidence, Implementation Agent feedback, and Architect dispositions.
16. Do not implement executable enforcement, CI automation, branch-protection changes, product code, runtime changes, or sibling feature edits in this feature.

## Complexity Tracking

No new runtime or tooling abstraction is expected. The main complexity is wording priority: this feature must make the stop condition practical for a currently active model without contradicting `011` routing or sibling `012` final validation. Any uncertainty about whether to copy, modify, or supersede sibling process wording must be recorded as Implementation Agent feedback instead of broadening the diff.

## Coordination Requirements

- Treat `011-orchestrator-analyst-routing` as the authoritative baseline for Orchestrator-first request intake and Analyst-first handoff.
- Treat sibling `012-orchestrator-final-validation-loop` as authoritative for latest-main startup, cycle PR-set tracking, final Architect/Analyst validation, evidence-only commits, and completion/merge readiness if that work has landed or is being reviewed.
- Do not edit sibling worktrees or feature folders. If implementation needs to inspect sibling 012, use read-only commands only.
- If current `main` and sibling 012 contain different wording, implement only the 014 stop/recovery/review enforcement that can coexist with both, and record any unresolved mismatch in `tasks.md` for Orchestrator/Architect disposition.

## Verification

| Success criterion | Evidence |
| --- | --- |
| SC-001 | `rg -n "non-Orchestrator|active model|must stop|stop condition|must not.*implement|self-promot" AGENTS.md CLAUDE.md docs_project/project/devops .specify/memory/constitution.md specs/README.md` |
| SC-002 | `rg -n "read-only|inspection|status|summar|repository-changing|becomes repository-changing|transition" AGENTS.md CLAUDE.md docs_project/project/devops .specify/templates specs/README.md` |
| SC-003 | `rg -n "Orchestrator.*first|invoke.*Analyst|Analyst.*first|remain.*Orchestrator|does not directly edit|must not directly edit" AGENTS.md CLAUDE.md docs_project/project/devops .specify/memory/constitution.md specs/README.md` |
| SC-004 | `rg -n "Architect.*spec.md|Architect.*plan.md|Architect.*tasks.md|artifact.*boundary|complete feature memory|feature-request.md.*spec.md.*plan.md.*tasks.md|isolated worktree" AGENTS.md CLAUDE.md docs_project/project/devops .specify/templates specs/README.md` |
| SC-005 | `rg -n "accidental|direct edit|recovery|stop.*report|preserve|restart.*Orchestrator|destructive|revert.*authoriz" AGENTS.md CLAUDE.md docs_project/project/devops .specify/templates specs/README.md` |
| SC-006 | `rg -n "sibling|parallel work|worktree|dirty diff|branch|PR state|process memory|preserve" AGENTS.md CLAUDE.md docs_project/project/devops .github/pull_request_template.md .specify/templates specs/README.md` |
| SC-007 | `rg -n "Review Agent|review.*bypass|missing feature memory|role-boundary|role boundary|unsafe recovery|011|012|contradict" AGENTS.md CLAUDE.md docs_project/project/devops .github/pull_request_template.md specs/README.md` |
| SC-008 | Manual diff review plus `git diff --name-only` shows only scoped process docs/templates and `specs/014-orchestrator-first-enforcement/*` changed. |
| SC-009 | `specs/014-orchestrator-first-enforcement/tasks.md` contains verification evidence, decisions, known issues, and any Implementation Agent feedback. |

Negative scenario evidence:

- Search evidence shows non-Orchestrator roles do not directly implement new repository-changing requests.
- Search evidence shows read-only inspection can proceed without feature memory until mutation is requested.
- Search evidence shows Architect and Review Agent boundaries remain non-mutating.
- Search evidence shows Implementation Agent cannot edit without complete feature memory and Orchestrator assignment.
- Search evidence shows recovery forbids hidden continuation, silent role switching, destructive reset, and unauthorized revert.
- Manual diff review confirms no learner-facing, runtime, CI workflow, branch-protection, secret, production-resource, or sibling-feature changes.

Required command evidence:

- `git diff --check`
- `node scripts/check-feature-memory.mjs --worktree`
- `pnpm run check:repo`
- `pnpm run preflight`
- `git diff --name-only`
- `git status --short --branch`

If a command cannot run because of local environment or unrelated repository state, record the exact command, failure, and mitigation in `tasks.md`.

## Risks

- Risk: The new stop condition could be read as blocking ordinary read-only help.
- Mitigation: Define read-only requests explicitly and require Orchestrator-first routing only when mutation is requested or implied.

- Risk: Repeating `011` language could create drift.
- Mitigation: Reference 011 as the baseline and focus implementation on active-model stop, recovery, and review enforcement.

- Risk: Sibling `012` may land overlapping wording before this feature is implemented.
- Mitigation: Require read-only comparison during implementation and record any mismatch as feedback before changing scope.

- Risk: Recovery guidance could be misread as permission to clean up by force.
- Mitigation: State that agents stop, preserve, report, and wait for Orchestrator/user disposition; destructive cleanup and reverting others' work remain forbidden without explicit authorization.

- Risk: Documentation-only enforcement may still be missed.
- Mitigation: Add PR template and Review Agent checks; record executable guard automation as future feedback rather than implementing it in this scope.
