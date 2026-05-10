# Feature Request: Orchestrator Cleanup Governance

## Analyst Artifact Status

Created by Analyst intake in isolated worktree `/Users/chap/devel/cabadrive-014-orchestrator-cleanup-governance` on branch `codex/014-orchestrator-cleanup-governance`.

## Orchestrator Routing Context

- Orchestrator entry: The user explicitly assigned this task to Cabadrive Analyst for the current repository-changing request on 2026-05-09.
- Assigned intake worktree/branch: `/Users/chap/devel/cabadrive-014-orchestrator-cleanup-governance` / `codex/014-orchestrator-cleanup-governance`.
- Parallel-work note: Parallel Orchestrators and agents may be active. Existing dirty diffs, branches, commits, PRs, process memory, and active worktrees must be preserved. This intake does not remove disk artifacts or modify any repository files outside this `feature-request.md`.

## User Request

Original request, in Russian:

```text
переключить в новом окружении в main последней версии и работай там

агенты оставляют за собой артефакты
drwxr-xr-x@  33 chap  staff      1056 May  9 22:02 cabadrive-009-content-093-184
drwxr-xr-x@  33 chap  staff      1056 May  9 22:03 cabadrive-009-content-185-276
drwxr-xr-x@  33 chap  staff      1056 May  9 22:02 cabadrive-009-content-277-368
drwxr-xr-x@  33 chap  staff      1056 May  9 22:02 cabadrive-009-content-369-460
нужно
1. научить оркестратор по завершении работы чистить артефакты на диске, кмк имеет смысл добавить роль клинап агент. Важно, чтоб чистил только строо окружения, созданные агентами, это обязательно валидировать
2. в рамках тикета разово почистить все за агентами, которые завершили работу, важно не затронуть то, где сейчас ведется работа
3. переключить в новом окружении в main последней версии и работай там - это должно быть дефольное правило при начале работы оркестратора
```

Continuation instruction:

```text
продолжи работу, актуализируй состояние себя и всех агентов, продолжай пока полностью не завершишь следуя прошлым инструкциям
```

Current Analyst assignment:

```text
You are acting strictly as the Cabadrive Analyst for the current repository-changing request. Work in the existing isolated worktree `/Users/chap/devel/cabadrive-014-orchestrator-cleanup-governance` on branch `codex/014-orchestrator-cleanup-governance`. Parallel agents may be active; preserve all existing dirty diffs, branches, commits, PRs, and process memory.

Read the required repository memory enough to follow AGENTS.md. Create exactly one intake artifact and no other files: the next specs folder under `/Users/chap/devel/cabadrive-014-orchestrator-cleanup-governance/specs/` using the max existing numeric prefix plus one, zero-padded, with a short slug for this request. The user's request is in Russian: teach the Orchestrator to clean up agent-created disk artifacts at completion, likely by adding a Cleanup Agent role; validate cleanup only touches old agent-created environments; one-time clean up finished agent artifacts without touching active work; and make starting from a new environment on latest main the default Orchestrator rule.

Do not ask the user for clarification unless absolutely required; record assumptions and open questions instead. Write only `feature-request.md` with original request, project context, assumptions, risks, acceptance expectations, and note that no external research was needed unless you actually use it. Do not write spec.md, plan.md, tasks.md, code, docs, commits, reviews, or files outside that one intake artifact. Final response: name the created folder and file path, and summarize assumptions/open questions.
```

## Clarified Answers And Assumptions

- No clarification questions were asked because the request is specific enough for Architect planning and the current assignment says to record assumptions and open questions instead.
- This is one repository workflow/governance feature because all requested changes concern Orchestrator startup, agent environment lifecycle, and safe cleanup of agent-created local artifacts.
- "Latest main" means Orchestrator should start new repository-changing work from a freshly created isolated environment based on the newest verified default branch state, normally `origin/main` after fetch, while preserving the PR-only workflow.
- "New environment" means a separate worktree or equivalent isolated checkout, not reusing a stale or dirty working directory.
- "Artifacts on disk" means completed agent-created local work environments such as sibling worktrees or generated agent working directories, not durable repository memory, checked-in content, user-created directories, caches needed by active work, or production resources.
- Cleanup must be conservative: if an environment cannot be positively identified as agent-created, inactive, complete, safe to remove, and not needed for current work, it must not be removed.
- The examples `cabadrive-009-content-093-184`, `cabadrive-009-content-185-276`, `cabadrive-009-content-277-368`, and `cabadrive-009-content-369-460` should be treated as candidate cleanup targets only after validation, not as automatically safe deletion targets.
- The current worktree `/Users/chap/devel/cabadrive-014-orchestrator-cleanup-governance` and any other active or ambiguous worktree must not be touched by one-time cleanup.
- The requested "Cleanup Agent" is recorded as a likely role addition, but Architect should decide whether to add a distinct role, a delegated Implementation Agent task type, or another governance mechanism.
- This Analyst intake does not perform the one-time cleanup; that must be planned and executed later by the proper role under the feature memory and validation rules.

## Project Context Reviewed

- `AGENTS.md`: repository-changing requests enter through Orchestrator, role boundaries, isolated worktree/branch/PR rules, parallel-work preservation, Orchestrator no-direct-edit boundary, and completion gates.
- `.specify/memory/constitution.md`: spec-first development, one worktree per task, PR-only workflow, process memory, and supervised verification.
- `docs_project/README.md`: durable documentation baseline and read order.
- `docs_project/project-idea.md`: Cabadrive product purpose, confirming this request is process/workflow scoped rather than learner-facing product scope.
- `docs_project/project/frontend/frontend-docs.md`: current local-first static app and Docker-only runtime contract.
- `docs_project/project/backend/backend-docs.md`: no-backend MVP and local tooling boundaries.
- `docs_project/project/feature-inventory.md`: current MVP features and explicit out-of-scope product areas.
- `docs_project/screens/learning-and-exam-flows.md`: learner-facing flows, confirming no UI behavior is requested.
- `docs/specify/README.md`: original planning archive, local-first constraints, canonical terms, and definition of success.
- `docs_project/project/devops/ai-pr-workflow.md`: current Orchestrator workflow, role permissions, autonomous orchestration, stuck-subagent preservation, PR slicing, and merge-readiness evidence.
- `docs_project/project/devops/review-contract.md`: review expectations for role/process compliance and blocking conditions.
- `specs/README.md`: feature-memory artifact expectations and numbering rule.
- `.specify/templates/feature-request-template.md`: expected intake artifact shape.
- `specs/007-agent-workflow-autonomy/feature-request.md`: prior Orchestrator autonomy and role-boundary context.
- `specs/011-orchestrator-analyst-routing/feature-request.md`: prior Orchestrator-first Analyst routing and parallel-work context.

## External Research

External research was not used. The request is an internal Cabadrive workflow/governance change, and existing repository memory already defines the relevant role model, worktree isolation, preservation requirements, and PR workflow.

## Problem Statement

Cabadrive's current multi-agent workflow requires isolated worktrees and preservation of parallel work, but it does not yet define a safe lifecycle for cleaning up completed agent-created local environments. As a result, completed agents can leave disk artifacts behind, while cleanup done without strict validation could delete active work, dirty diffs, unpushed commits, open PR work, process memory, or user-created directories. Current Orchestrator startup guidance also does not yet make "create a fresh environment from latest main" an explicit default rule.

## Proposed Outcome Or Workflow

1. Durable Orchestrator startup guidance should state that every new repository-changing Orchestrator run starts from a newly created isolated environment based on the latest verified `main` state, normally after fetching `origin/main`.
2. Durable completion guidance should require Orchestrator to coordinate cleanup of completed agent-created disk environments after work is complete and merge-readiness or handoff state is verified.
3. A Cleanup Agent role, or an explicitly equivalent delegated cleanup responsibility, should be defined with strict boundaries and no permission to remove anything unless validation proves it is an old agent-created environment.
4. Cleanup validation should identify candidate directories by repository/worktree metadata, naming/path conventions, branch/PR state, git cleanliness, unpushed commit checks, active process/worktree checks, and any durable process-memory references.
5. Cleanup must refuse ambiguous targets, active current worktrees, dirty worktrees, worktrees with unpushed commits, open or unresolved PRs, missing/unfinished process memory, or paths outside the allowed agent-environment roots.
6. The one-time cleanup requested in this ticket should inventory candidate agent-created environments, validate which completed ones are safe, remove only those safe targets, and record evidence for every removed and preserved path.
7. Durable docs/templates should make cleanup evidence part of completion where relevant, without weakening existing role boundaries, PR-only workflow, or human merge authority.

## Role Boundaries Or Affected Actors

- Orchestrator: Starts new work from latest main in a fresh isolated environment; coordinates cleanup through the proper role; does not directly edit repository files; must preserve active and ambiguous work.
- Cleanup Agent: If added, owns local disk cleanup only after assignment; validates every candidate before removal; removes only old agent-created environments that pass all safety checks; records evidence; does not change product code, docs, specs, tests, PR state, or production resources unless Architect explicitly scopes otherwise.
- Analyst: Records this intake only and does not perform cleanup, write plans, edit docs/code, commit, push, open PRs, or review.
- Architect: Converts this intake into `spec.md`, `plan.md`, and `tasks.md`; decides exact role model, validation checklist, documentation targets, and one-time cleanup task boundaries.
- Implementation Agent: May update durable guidance, templates, scripts, feature memory, or cleanup evidence only after Architect planning assigns that implementation slice.
- Review Agent: Verifies role/process compliance, cleanup safety boundaries, evidence quality, and that cleanup-related text cannot be read as permission to delete active or user-owned work.
- User/Human merge owner: Remains final authority for merge unless explicit authorization says otherwise; should not be asked for normal-flow requirement clarification after this intake unless a documented blocker arises.

## Artifact And Handoff Expectations

- Analyst writes only this `feature-request.md` intake artifact.
- Requirement clarification was not requested because the assignment says to record assumptions and open questions instead.
- Analyst hands off to Orchestrator and shuts down after intake is ready.
- Architect starts from this artifact and writes `spec.md`, `plan.md`, and `tasks.md`.
- Handoff context for Orchestrator: feature folder `specs/019-orchestrator-cleanup-governance/` in worktree `/Users/chap/devel/cabadrive-014-orchestrator-cleanup-governance` on branch `codex/014-orchestrator-cleanup-governance`; parallel work may exist and all existing dirty diffs, branches, commits, PRs, process memory, and active environments must be preserved.

## Open Questions And Risks

- Architect should decide whether `Cleanup Agent` becomes a new first-class role in `AGENTS.md` or whether cleanup is assigned as a narrowly scoped Implementation Agent or Orchestrator-coordinated operational task.
- Architect should define the authoritative roots and naming conventions for agent-created environments. Candidate examples under `/Users/chap/devel/` must not be deleted unless they are positively identified as agent-created and inactive.
- Architect should decide how to validate "agent-created" status when a directory was created outside `git worktree`, lacks metadata, or follows a naming convention that a human could also use.
- Architect should define "finished agent" precisely. Possible signals include merged/closed PR state, no open PR for branch, clean worktree, no unpushed commits, no running process, no recent active assignment, and process memory showing completion.
- There is a data-loss risk if cleanup relies only on directory names or modification dates. Validation must include git/worktree and PR/process state where available.
- There is a workflow risk if cleanup removes worktrees that are still referenced by active Orchestrator, Implementation Agent, Review Agent, or recovery work.
- There is a governance risk if Orchestrator cleanup guidance appears to permit direct destructive shell operations without delegation, validation, or evidence.
- Starting every Orchestrator run from latest verified `main` may need an offline or network-failure fallback rule. Architect should decide whether failure to fetch blocks startup, uses verified local `main`, or requires Orchestrator escalation.
- The one-time cleanup may require local filesystem and GitHub/PR inspection that is not itself a repository file change. Architect should define which role performs it and how evidence is recorded without touching unrelated files.
- Cleanup evidence may contain local paths. Architect should decide how much local-path detail belongs in durable process memory versus a transient final report.

## Acceptance Expectations

- Durable guidance states that Orchestrator starts each new repository-changing task in a fresh isolated environment based on the latest verified `main` state, normally `origin/main` after fetch.
- Durable guidance defines completion-time cleanup responsibility and boundaries without weakening Orchestrator's no-direct-repository-edit rule.
- If a Cleanup Agent role is added, durable role guidance defines its allowed actions, forbidden actions, validation requirements, evidence requirements, and handoff/completion behavior.
- Cleanup validation requires positive proof that a target is an old agent-created environment before deletion.
- Cleanup validation blocks deletion of active worktrees, current worktrees, dirty worktrees, worktrees with unpushed commits, branches with open or unresolved PRs, ambiguous paths, user-owned directories, durable repository memory, secrets, production resources, and anything outside approved agent-environment roots.
- The one-time cleanup inventories candidate artifacts, deletes only validated completed agent-created environments, preserves active or ambiguous environments, and records evidence for both removed and retained candidates.
- Review guidance or acceptance criteria require checking that cleanup implementation cannot remove active work or user-created environments based only on a name pattern.
- Verification includes text-search evidence for latest-main startup guidance, cleanup role or responsibility guidance, cleanup validation rules, cleanup refusal conditions, and one-time cleanup evidence.
- Implementation scope remains process/governance plus the requested one-time cleanup. No learner-facing UI, content behavior, backend runtime, Docker contract, secrets, branch protection, or production-resource changes are expected unless Architect explicitly scopes them.

## Final Analyst Validation Notes

- Status: PASS on 2026-05-10 after Architect PASS. Current content head `4bcce2a6869efaba25334a8a5dfb593f8cc3e6e7` is validated against latest verified `main` base/merge-base `870c7f9514404b36cf75954c3c39814770495342`; current evidence/process-memory head is `54a7c985384c5218d8e149142f0ea6e9170c0d22`. This supersedes prior Analyst validation notes for earlier effective/evidence heads and bases.
- Analyst return count: 0.
- Customer intent check: PASS. Whole-project/TZ coverage is complete: durable governance defines Cleanup Agent positive-proof cleanup for old completed agent-created environments only; one-time cleanup evidence records removed validated completed artifacts and preserves/refuses current, active, open-PR, dirty, untracked, unpushed, locked, running-process, ambiguous, user-owned, out-of-root, and otherwise unsafe work; Orchestrator startup defaults to a fresh isolated environment from latest verified `main`, normally `origin/main` after fetch, with documented fallback/blocker handling and no silent stale reuse; prior GAP follow-ups T045-T046 and T047-T048 are closed; no product/runtime scope drift is present.
- Validation evidence: inspected current feature memory and scoped governance/template content; `git diff --check` passed with no output; stale hard-`origin/main` search found only historical/process-memory references or acceptable fallback-contract wording, not live hard-origin rules; stale pre-019 cleanup feature-path search returned no matches.
- Gaps: none.
- Unaddressed customer task: none.
- Analyst routing gaps or new questions: none.
- Architect disposition routing: none needed.
