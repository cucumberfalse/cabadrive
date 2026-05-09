# Feature Request: Agent Workflow Autonomy And Role-Boundary Hardening

## Original Request Summary

Capture a new Cabadrive workflow and agent-behavior request based on the practical completion of feature `006-topic-study-guide`.

The requested future work should turn the successful operational patterns from that feature into durable repository guidance and/or enforceable workflow behavior. The main intent is to make Cabadrive's multi-agent workflow more autonomous, role-safe, evidence-driven, and reliably decomposed into small mergeable PRs.

The user explicitly asked this Analyst intake to:

- stay strictly in the Analyst role;
- create an isolated worktree and branch from fresh `origin/main`;
- create the next `specs/<feature-id>/` folder using max existing numeric prefix plus one;
- write exactly one artifact, `feature-request.md`;
- avoid `spec.md`, `plan.md`, `tasks.md`, code, tests, docs outside this assigned intake artifact, commits, pushes, PRs, review, or architecture work;
- record assumptions and open questions instead of running Q&A now.

## Project Context / Why This Matters

Cabadrive is a spec-driven local-first web trainer. The repository depends on durable process memory because product work can involve legal/source-currentness claims, Russian learning content, local-only runtime constraints, AI review, branch protection, and multi-PR feature delivery.

Feature `006-topic-study-guide` demonstrated that large, source-sensitive work is safer when the Orchestrator coordinates without editing files, delegates role-specific work to subagents, slices implementation into small PRs, verifies GitHub and local guard state directly, and keeps process memory current through final completion.

Relevant repository memory reviewed for this intake:

- `AGENTS.md`
- `.specify/memory/constitution.md`
- `docs_project/README.md`
- `docs_project/project-idea.md`
- `docs_project/project/frontend/frontend-docs.md`
- `docs_project/project/backend/backend-docs.md`
- `docs_project/project/feature-inventory.md`
- `docs_project/screens/learning-and-exam-flows.md`
- `docs/specify/README.md`
- `specs/006-topic-study-guide/feature-request.md`
- `specs/006-topic-study-guide/spec.md`
- `specs/006-topic-study-guide/plan.md`
- `specs/006-topic-study-guide/tasks.md`
- `specs/002-orchestrator-role-boundary/spec.md`
- `specs/003-analyst-role-intake/feature-request.md`

External research was not used for this intake. The request is explicitly about practices already observed inside Cabadrive's own feature workflow, and the user asked for artifact creation without a Q&A loop.

## Role-Boundary Requirements

The future feature should harden the rule that the Orchestrator remains strictly an Orchestrator.

Expected Orchestrator behavior:

- does not directly edit repository files;
- does not directly change code, docs, specs, feature memory, workflow files, scripts, runtime files, or any other repo file;
- invokes the appropriate subagent whenever repository file changes are needed;
- coordinates request sequencing, subagent assignment, PR slicing, gate/check status, reviewer feedback routing, merge readiness, and final completion verification;
- may perform GitHub-level coordination and gate/merge actions when those actions do not violate the repository role boundary.

The future feature should also harden subagent role boundaries:

- Analyst creates only the intake artifact `feature-request.md` and does not write plans, code, reviews, commits, pushes, or PRs.
- Architect creates and updates `spec.md`, `plan.md`, `tasks.md`, and disposition records, but does not write runtime/product code or content implementation.
- Implementation Agent works only on the assigned implementation slice in an isolated worktree, branch, and PR, keeps process memory current, and does not expand scope without Architect disposition.
- Review Agent reports review findings and role/process violations, preferably as GitHub inline review threads where applicable, and does not edit repository files.
- Agents must not switch roles during a task. If different work is needed, Orchestrator routes that work to another subagent with the correct role.

## Autonomy Requirements

The future feature should document and, where appropriate, enable safe autonomous unblocking.

Expected behavior:

- Orchestrator should drive a feature toward final completion without unnecessary human questions when repository memory, PR state, check state, and reviewer feedback provide enough context.
- If a PR is merge-ready, required checks are green, there are no blocking findings or conflicts, and the user has already allowed auto-merge, Orchestrator may merge without asking again.
- If a check or review is stuck or failed for a clearly understandable workflow state, Orchestrator should rerun/retry checks or route the fix to an Implementation Agent instead of pausing for human direction.
- If a subagent appears stuck or fails to return a final report, Orchestrator should inspect worktree, branch, PR, commit, and GitHub state; then continue waiting, close/replace the subagent, or continue gate handling as appropriate.
- When preserving a partially completed subagent result, Orchestrator must keep existing dirty diff or PR work intact unless explicit human direction permits discarding it.
- AI-written agent summaries are not enough for completion; Orchestrator should validate state with GitHub data and local read-only guards.

## PR Slicing / Merge Strategy Requirements

The future feature should encode the atomic PR practices that made `006-topic-study-guide` manageable.

Expected behavior:

- One task slice equals one isolated worktree, one branch, and one PR.
- Large features should be decomposed into mergeable slices, each with its own scope, acceptance expectations, and verification evidence.
- Source prerequisite work, Architect disposition, content implementation, metadata fixes, final strict gates, and review fixes should be separate PRs when that lowers risk or clarifies gates.
- Implementation PRs must not mix unrelated changes.
- Implementation PRs must not quietly broaden scope beyond the assigned slice.
- Final guard failures should produce a new minimal PR when the defect is real, including cases where post-merge validation finds metadata tail, stale process memory, incomplete placement state, or another small completion gap.

## Merge-Ready And Evidence-Driven Completion Requirements

The future feature should strengthen Cabadrive's completion contract.

Expected behavior:

- Orchestrator does not declare completion until required checks are green, blocking review threads are absent or resolved/outdated, merge conflicts are absent, process memory is current, acceptance criteria have verification evidence, and a final guard passes.
- Completion checks should use GitHub state and local read-only guards, not only an Implementation Agent or Review Agent summary.
- If final guard discovers incomplete state, such as leftover metadata tail after otherwise-ready placements, Orchestrator delegates or coordinates a minimal follow-up PR before declaring the feature complete.
- Review feedback with P2/P1/P0 severity should be routed to an Implementation Agent for a scoped fix; after the fix, Orchestrator should verify thread resolution/outdated status and rerun checks as needed.
- Source-currentness or archive-evidence review concerns must block merge until routed and fixed by the appropriate role.

## Delegated Commit / PR Workflow Requirements

The future feature should clarify what repository actions each role may perform while preserving the existing role model.

Expected behavior to consider:

- Implementation Agent may stage, commit, push, and open a ready PR without additional human confirmation when those actions are part of its assigned implementation slice.
- Orchestrator may perform GitHub-level coordination, gate checks, reruns, review routing, merge readiness checks, and merge actions when already authorized and when no file editing is involved.
- Analyst and Architect restrictions remain stricter than Implementation Agent restrictions. If current AGENTS rules do not allow Analyst or Architect to commit/push/open PRs, this future feature should record or resolve that boundary explicitly rather than letting those roles violate the current contract.
- The feature should distinguish branch/worktree isolation for role-safe file creation from commit/push/PR authority. This intake itself creates a branch/worktree as requested for isolation, but does not commit, push, or open a PR.

## Documented Edge Cases From Practice

The future feature should preserve practical edge cases observed during the `006-topic-study-guide` completion flow:

- If a PR exists but the assigned agent does not return a final report, Orchestrator may find the PR by branch/head and continue gate handling.
- If GitHub search or head listing does not show the PR, but another API path says a PR exists, Orchestrator should search recent PRs, `headRefName`, commit SHA, or other reliable metadata instead of assuming no PR exists.
- If AI Review leaves P2/P1/P0 findings, Orchestrator routes a fix to Implementation Agent and then checks whether findings are resolved, outdated, or still blocking before merging.
- If source-currentness or archive-evidence review identifies a problem, Orchestrator must not merge and should delegate a source-fix or metadata-fix slice.
- After merge, final guard may still reveal top-level metadata tail or incomplete final state; Orchestrator should create or delegate a minimal cleanup PR rather than treating the feature as complete.

## Acceptance Expectations

The Architect should convert this intake into acceptance criteria for a future process/workflow feature. Expected acceptance directions:

- Durable repository guidance states that Orchestrator never edits repo files directly and delegates file changes to role-appropriate subagents.
- Durable repository guidance states that subagents remain in their roles and cannot switch roles mid-task.
- Durable repository guidance defines when Orchestrator should proceed autonomously, retry/rerun, route fixes, replace stuck subagents, or ask the human.
- Durable repository guidance defines one task slice as one isolated worktree, one branch, and one PR.
- Durable repository guidance requires atomic PR decomposition for large features, source prerequisites, Architect dispositions, content slices, metadata fixes, final strict gates, and review fixes when separation lowers risk.
- Completion guidance requires green required checks, no blocking review findings, no unresolved conflicts, current process memory, evidence for acceptance criteria, and a final guard verified through GitHub/local state.
- Edge cases from the `006-topic-study-guide` completion are recorded so future Orchestrator behavior is reproducible.
- Role-specific commit/push/PR permissions are clarified without weakening Analyst or Architect boundaries unless explicitly designed and approved by future architecture work.
- The eventual implementation stays process/workflow scoped unless Architect explicitly identifies a minimal enforcement change.

## Assumptions

- This is a repository workflow/process feature, not a learner-facing product feature.
- The future implementation will likely update durable process documentation and possibly templates or workflow guidance, but this Analyst intake does not decide exact files.
- No user Q&A is needed now because the user explicitly provided the requirements and asked to record assumptions/open questions.
- Practices from `006-topic-study-guide` are treated as repository-specific evidence and should be preserved even when they are more specific than generic software-delivery advice.
- The current repository contract still forbids Analyst from committing, pushing, opening PRs, or writing anything except the assigned intake artifact.
- Creating the isolated worktree, branch, and feature folder is treated as allowed setup for this Analyst request because the user explicitly requested it; committing or opening a PR remains out of scope.

## Risks And Open Questions

- There is a tension between the user's request to create an isolated branch/worktree and the Analyst rule that Analyst does not create commits or PRs. This intake assumes branch/worktree creation for isolation is allowed, while commit/push/PR remains forbidden.
- Future architecture should decide whether Analyst-created intake branches should ever be committed by Analyst, handed to Orchestrator for another role to commit, or treated as local-only handoff state.
- Future architecture should decide whether Orchestrator auto-merge authority should live only in user/session instructions or be documented as a durable repository rule with explicit preconditions.
- Future architecture should decide how to express "safe autonomous unblock" without encouraging Orchestrator to make product or architecture decisions that belong to Architect.
- Future architecture should decide which checks count as the final local read-only guard for process-only features versus product/runtime features.
- Future architecture should decide whether any executable enforcement is needed, or whether updated durable guidance plus Review Agent checks are sufficient.
- GitHub API/search inconsistencies may be hard to encode as deterministic rules; the future feature should provide fallback lookup expectations without overfitting to one incident.
- Replacing or closing a stuck subagent can risk losing context; guidance should require preserving dirty diffs, branches, PRs, and process memory before reassignment.
