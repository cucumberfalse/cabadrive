# Feature Request: Orchestrator First Enforcement

## Analyst Artifact Status

Created by Analyst intake in worktree `/Users/chap/devel/cabadrive-013-learning-content-ui-polish` on branch `codex/013-learning-content-ui-polish`.

This artifact records request intake only. It intentionally does not include technical architecture, implementation planning, task breakdown, source edits, tests, commits, pushes, PR state, or files outside this assigned `feature-request.md`.

## Orchestrator Routing Context

- Orchestrator entry: the parent Orchestrator restarted the work after an improper direct-edit attempt and delegated intake to Analyst.
- Assigned intake worktree/branch for this intake pass: `/Users/chap/devel/cabadrive-013-learning-content-ui-polish`, `codex/013-learning-content-ui-polish`.
- Base context: current worktree was reset clean from `origin/main` before this Analyst pass.
- Parallel-work note: sibling worktrees exist at `/Users/chap/devel/cabadrive-010-ui-ux-learning-intake` and `/Users/chap/devel/cabadrive-012-orchestrator-final-validation-loop`; their branches, diffs, PR state, and feature memory must be preserved.

## Numbering Decision

The current worktree's local `specs/` tree contains feature folders through numeric prefix `011`. A sibling worktree already contains `specs/012-orchestrator-final-validation-loop/`, and learner-facing intake for this restarted request is captured as `specs/013-learning-content-ui-polish/`.

Because this protocol-hardening goal is independent from the learner-facing feature, it receives the next non-colliding prefix: `specs/014-orchestrator-first-enforcement/`.

## Scope Split Decision

This request was split from the learner-facing polish request because protocol hardening changes repository workflow rules, not product behavior. Keeping it separate gives Architect, Implementation Agent, and Review Agent a clean process-only scope with different acceptance evidence.

Related learner-facing intake is `specs/013-learning-content-ui-polish/feature-request.md`. This `014` feature should not implement the content/UI fixes from `013`.

## User Request

After an improper direct-edit attempt, the user interrupted and corrected process. They asked to:

1. Cancel everything and restart by protocol with the parent as strict Orchestrator.
2. Add to the learner-facing request a task to update and harden the protocol so the Orchestrator-first rule is stricter and this mistake does not recur.

The specific protocol expectation is that every new repository-changing user request must go through Orchestrator first. The active model should not directly implement repository changes merely because the user asks for a feature, bug fix, docs change, or similar repository-changing work.

## Clarified Answers And Assumptions

- No clarification questions were asked because the process failure and desired hardening are clear enough for Architect planning.
- This is a process/workflow feature, not learner-facing product work.
- "This mistake" refers to an active model beginning direct edits for a repository-changing request before Orchestrator had performed the required intake/delegation flow.
- "Orchestrator-first rule" means repository-changing requests default to Orchestrator entry before Analyst, Architect, Implementation Agent, or Review Agent action.
- Existing guidance already contains Orchestrator-first language, but the user wants stricter enforcement so it is harder for future agents to bypass in practice.
- "New repository-changing user request" includes feature work, bug fixes, product/content changes, docs/process changes, workflow changes, tests, scripts, and any request that implies writing repository files.
- Read-only questions, summaries, and inspections can remain outside implementation flow until they become repository-changing.
- This feature may need to update durable role instructions, workflow docs, templates, and review/completion gates, but Architect should decide exact files and enforcement mechanism.
- This intake does not decide whether enforcement is purely documented, template-based, CI/validation-based, or a combination.

## Project Context Reviewed

- User-supplied `AGENTS.md` instructions in the prompt: Analyst, Architect, Orchestrator, Implementation Agent, Review Agent boundaries; Orchestrator-first routing; feature-memory requirements; one worktree/branch/PR rules.
- `.specify/memory/constitution.md`: current spec-first development principle already says every repository-changing request defaults to Orchestrator entry and must have feature memory before implementation.
- `docs_project/README.md`: durable documentation baseline and read order.
- `docs_project/project-idea.md`, `docs_project/project/frontend/frontend-docs.md`, `docs_project/project/backend/backend-docs.md`, `docs_project/project/feature-inventory.md`, and `docs_project/screens/learning-and-exam-flows.md`: reviewed to confirm this is process-only and not product/runtime work.
- `docs/specify/README.md`: original constraints and canonical terms.
- `specs/003-analyst-role-intake/*`: Analyst intake role, handoff, and artifact expectations.
- `specs/007-agent-workflow-autonomy/*`: Orchestrator autonomy, role-boundary hardening, PR slicing, and merge-readiness context.
- `specs/011-orchestrator-analyst-routing/*`: prior Orchestrator-first repository-changing routing and Analyst-through-Orchestrator clarification loop.
- `specs/012-orchestrator-final-validation-loop/feature-request.md` in sibling worktree: parallel final-validation-loop process work that may overlap with completion enforcement and must be preserved/coordinated.

## External Research

External research was not used. The request concerns internal Cabadrive agent workflow, and the relevant context is already in repository memory and user-supplied role instructions.

## Problem Statement

Cabadrive already has durable language saying repository-changing requests should default to Orchestrator entry and feature memory before implementation. However, the recent mistake shows the guidance is still not operationally strict enough: an active model can begin direct implementation after receiving a repository-changing request instead of stopping, recognizing that Orchestrator must own intake/delegation, and routing the work through the proper role sequence.

This creates risk of unplanned repository edits, missing feature memory, skipped role boundaries, collisions with parallel worktrees, and PRs that are invalid under the repository workflow even if the code changes look useful.

## Desired Process Outcome

The repository protocol should be hardened so future agents have an unmistakable rule:

- when a new user request implies repository changes and the active model is not explicitly operating as Orchestrator, it must not start implementation;
- if the active model is Orchestrator, it must stay strictly in that role and delegate intake/planning/implementation/review to the appropriate agents;
- if the user explicitly assigns a non-Orchestrator role, that role must stay inside its boundaries and create only its allowed artifacts;
- repository-changing implementation must not begin until the request has an assigned feature folder and complete required feature memory for the implementation phase;
- guidance should include a recovery path for accidental direct-edit starts: stop, preserve/revert only as authorized by Orchestrator/user, restart by protocol, and record the process gap through Orchestrator.

## Role Boundaries Or Affected Actors

- Orchestrator: default entrypoint for repository-changing work, strict coordinator, no direct repository edits, invokes Analyst first when needed, then Architect, Implementation Agent, and Review Agent.
- Analyst: owns intake only and writes `feature-request.md`; does not implement process changes.
- Architect: owns `spec.md`, `plan.md`, and `tasks.md`; defines the hardening strategy and verification requirements.
- Implementation Agent: implements only after complete feature memory exists in an assigned isolated worktree/branch/PR slice.
- Review Agent: checks that protocol-hardening changes preserve role boundaries and that future direct implementation bypasses are harder to repeat.
- Active model/session: must recognize role assignment and route repository-changing requests accordingly rather than silently switching into Implementation Agent behavior.

## Open Questions And Risks

- Existing feature `011` already strengthened Orchestrator-first Analyst routing. Architect should identify what remains ambiguous and avoid duplicating wording without adding practical enforcement.
- Sibling feature `012` may update final validation/completion workflow. Architect should coordinate this feature so it does not conflict with or overwrite `012`'s process changes.
- Some system/developer instructions outside the repository may still encourage proactive implementation. Repository protocol hardening must be worded so Cabadrive-specific role boundaries are prominent when working in this repo.
- If enforcement is only documentation, future agents may still miss it. Architect should consider whether templates, checklists, validation scripts, PR review requirements, or explicit "stop conditions" are needed.
- Overly rigid wording could block harmless read-only inspection or simple terminal answers. Architect should distinguish repository-changing requests from read-only questions.
- Recovery guidance must not authorize destructive cleanup of user or sibling-agent work. It must preserve the existing rule against reverting changes the current agent did not make unless explicitly requested.

## Acceptance Expectations

- Complete feature memory exists before implementation: `feature-request.md`, `spec.md`, `plan.md`, and `tasks.md`.
- Durable protocol guidance states that every new repository-changing user request enters through Orchestrator first.
- Durable protocol guidance states that a non-Orchestrator active model must not directly implement a new repository-changing request.
- Durable Orchestrator guidance states that Orchestrator must remain strictly in the Orchestrator role and delegate file-changing work to assigned agents.
- Durable Analyst guidance remains intact: Analyst writes intake only, may clarify requirements only through Orchestrator, and does not write code/plans/tasks/reviews.
- Durable Architect guidance remains intact: Architect writes `spec.md`, `plan.md`, and `tasks.md`, but does not implement.
- Durable Implementation Agent guidance states implementation cannot start without complete feature memory and assigned isolated worktree/branch/PR slice.
- Durable Review Agent guidance states review must flag repository-changing work that skipped Orchestrator-first intake or complete feature memory.
- The protocol defines a clear stop/recovery path when an agent realizes it started direct edits improperly.
- The protocol preserves parallel-work protection, including not reverting sibling worktrees, branches, diffs, commits, PR state, or process memory.
- The protocol distinguishes read-only requests from repository-changing requests so normal inspection and answering remain possible.
- The protocol coordinates with existing `011` Orchestrator-Analyst routing guidance and sibling `012` final-validation-loop work without contradiction.
- Verification should include text-search evidence for Orchestrator-first trigger language, non-Orchestrator stop conditions, implementation prerequisites, recovery guidance, role-boundary preservation, and review enforcement.
- Implementation scope is expected to be process documentation/templates/feature memory only unless Architect explicitly scopes a minimal validation/checklist mechanism.

## Handoff

Analyst hands this process-hardening intake to Orchestrator and shuts down. Architect should create `spec.md`, `plan.md`, and `tasks.md` for `specs/014-orchestrator-first-enforcement/` before any implementation begins.
