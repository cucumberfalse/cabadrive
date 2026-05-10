# Feature Request: Orchestrator-First Analyst Routing

## Analyst Artifact Status

Created by Analyst intake in isolated worktree `/Users/chap/devel/cabadrive-011-orchestrator-analyst-routing-intake` on branch `codex/011-orchestrator-analyst-routing-intake`.

## User Request

Original request, in Russian:

```text
нужно чуть допилить флоу, чтоб аналитика тоже вызывал оркестратор
т.е по дефолту любой запрос в духе "давай сделаем фичу", "новая фича", "есть баг", "надо сделать", и вообще что угодно, что предполагает любые изменения в репозитории должны вызвать оркестратора, который строго остается в роли оркестратора, если нужно что-то изменить - вызывает соответствуюего субагента
он обязательно должен учитывать, что с параллельно работают другие оркестраторы и агенты, поэтому использует отдельное окружение, и всем агентом говорит об этом

изначально запрос от юзера орестратор дает субагенту аналитику. Аналитик имеет право задавать уточняющие вопросы юзеру, если нет иных иструкций, делает это через оркестратора, т.е если есть вопросы - передает оркестратору, оркестратор задает из юзеру, и ответы пробрасываются аналитику
Аналитик это единственная роль, которой позволено уточнять у юзера, когда шаг аналитика зваершается, потот оркестратор берет в работу созданным аналитиком бранч и доводит до финальной реализации, включая мерж, не задавая никаких доп вопросов и не прерывая работу, пока все не будет завершено
```

Additional instruction for this intake:

```text
ты аналитик, праллельно с тобой работают другие агенты, создай для себя отдельное окружение и работай в нем
задача, оставаясь строго в роли аналитика сделай работу
по итогу напиши только название бранча
```

## Clarified Answers And Assumptions

- No clarification questions were asked because the requested process change is specific enough for Architect planning.
- This is a repository process/workflow feature, not a learner-facing Cabadrive product feature.
- The request should be treated as one feature because all requirements concern the same Orchestrator-first repository-changing request flow.
- "Any request that implies repository changes" includes feature requests, bug reports, documentation/process changes, implementation requests, and similarly phrased work requests, while read-only questions can stay outside this flow until they become repository-changing.
- "Orchestrator invokes Analyst too" means Orchestrator becomes the default entrypoint for repository-changing user requests and must delegate initial intake to an Analyst subagent instead of acting as Analyst directly.
- "Analyst asks questions through Orchestrator" means Analyst may produce clarification questions, but the Orchestrator is the only actor that presents those questions to the user and returns answers to the Analyst.
- "Analyst is the only role allowed to clarify with the user" means Architect, Implementation Agent, Review Agent, and Orchestrator should not ask scope or requirement clarification questions after Analyst handoff, except for explicit blockers that current governance reserves for the human or that Architect scopes as exceptions.
- "Created Analyst branch" is interpreted as the isolated branch/worktree created for intake and then handed to Orchestrator for the rest of the workflow, unless Architect finds a safer branch-slicing model that preserves the user's intent.
- The user explicitly asks for merge completion. Current durable guidance says a human remains the default final merge authority unless current user instructions explicitly authorize Orchestrator merge authority. Architect should decide how to encode this interaction without weakening merge-readiness gates.
- The Analyst selected feature prefix `011` after observing active sibling Cabadrive worktrees with `008`, `009`, and `010` intake folders, even though this branch's `specs/` tree currently contains up to `007`. This avoids colliding with parallel agents.

## Project Context Reviewed

- `.specify/memory/constitution.md`: spec-first development, Analyst intake, Orchestrator coordination, one worktree per task, PR-only workflow, process memory, and merge gates.
- `docs_project/README.md`: durable documentation baseline and read order.
- `docs_project/project-idea.md`: Cabadrive product purpose and local-first exam-prep scope.
- `docs_project/project/frontend/frontend-docs.md`: current static React/Vite/PWA shape and Docker-only runtime contract.
- `docs_project/project/backend/backend-docs.md`: no-backend MVP and local tooling boundaries.
- `docs_project/project/feature-inventory.md`: current MVP features and out-of-scope areas.
- `docs_project/screens/learning-and-exam-flows.md`: current learner-facing flows, confirming this request is process-only.
- `docs/specify/README.md`: original specify archive, constraints, canonical terms, and definition of success.
- `specs/README.md`: feature-memory artifact and numbering rules.
- `AGENTS.md`: current role boundaries, Orchestrator autonomy, Analyst intake, worktree/branch/PR rules, and merge authority wording.
- `docs_project/project/devops/ai-pr-workflow.md`: current Orchestrator, Analyst, role boundary, autonomous orchestration, PR slicing, and merge-readiness guidance.
- `specs/002-orchestrator-role-boundary/*`: prior Orchestrator boundary feature memory.
- `specs/003-analyst-role-intake/*`: prior Analyst role intake feature memory.
- `specs/007-agent-workflow-autonomy/*`: prior Orchestrator autonomy and role-boundary hardening feature memory.

## External Research

External research was not used. The request is an internal repository workflow change, and the existing Cabadrive process memory already defines the relevant role model, branch/worktree rules, and merge gates.

## Problem Statement

Current durable guidance already defines Analyst and Orchestrator roles, but the default trigger path can still be read as allowing non-Orchestrator agents or the acting assistant to begin repository-changing work directly. This leaves ambiguity around who invokes Analyst, how clarification questions flow, how parallel work isolation is communicated, and when Orchestrator may continue through implementation and merge without further user interruption.

## Proposed Outcome Or Workflow

1. Durable guidance should state that any user request implying repository changes enters the Orchestrator flow by default.
2. Orchestrator must remain strictly in the Orchestrator role and delegate every repository file change or role-owned task to the appropriate subagent.
3. Orchestrator must account for parallel Orchestrators and agents by creating or requiring isolated worktrees/branches and telling assigned subagents that parallel work exists and must be preserved.
4. Orchestrator must initially pass the user's repository-changing request to an Analyst subagent.
5. Analyst performs intake, creates the feature folder and `feature-request.md`, and may identify clarification questions.
6. If Analyst has clarification questions and no user instruction forbids questions, Analyst passes those questions to Orchestrator; Orchestrator asks the user; Orchestrator forwards the user's answers back to Analyst.
7. Analyst is the only role that may initiate requirement clarification with the user during normal flow.
8. After Analyst handoff, Orchestrator continues from the Analyst-created branch/worktree and invokes Architect, Implementation Agent, and Review Agent as needed.
9. After Analyst handoff, Orchestrator should not stop to ask additional requirement questions unless required by a documented safety, permission, or governance blocker.
10. If the user has explicitly authorized completion through merge, Orchestrator should drive the work through implementation, review, required checks, merge-readiness gates, and merge without asking again.

## Role Boundaries Or Affected Actors

- User: Provides the initial repository-changing request and answers Analyst clarification questions only when Orchestrator relays them.
- Orchestrator: Default entrypoint for repository-changing requests; creates or requires isolated environments; invokes Analyst first; routes all later file changes to role-appropriate subagents; preserves parallel work; coordinates through merge readiness and authorized merge.
- Analyst: Owns intake only; may generate clarification questions, but communicates them through Orchestrator; writes only `feature-request.md`; hands off and shuts down.
- Architect: Starts only after Analyst handoff; writes `spec.md`, `plan.md`, and `tasks.md`; should not ask the user for new requirement clarification in normal flow.
- Implementation Agent: Works only from complete feature memory in an assigned isolated worktree/branch/PR; receives explicit warning about parallel work and preservation boundaries.
- Review Agent: Reviews PR diffs and workflow compliance; receives explicit warning about parallel work and should not mutate repository files while reviewing.

## Artifact And Handoff Expectations

- Analyst writes only this `feature-request.md` intake artifact.
- Analyst hands off to Orchestrator and shuts down after intake is ready.
- Architect starts from this artifact and writes `spec.md`, `plan.md`, and `tasks.md`.
- The branch to hand off is `codex/011-orchestrator-analyst-routing-intake`.
- The feature folder to continue is `specs/011-orchestrator-analyst-routing/`.

## Open Questions And Risks

- Current `AGENTS.md` says Orchestrator asks the human when "a decision belongs to the human merge owner" and that a human remains default final merge authority unless user instructions authorize merge authority. The new request explicitly says Orchestrator should include merge and not ask again. Architect must preserve merge gates while clarifying how explicit user authorization overrides the default.
- Current guidance already says Orchestrator invokes Analyst when no `feature-request.md` exists, but the new request wants a stronger default trigger for any repository-changing phrasing. Architect should identify all durable docs/templates where the trigger language must be tightened.
- If Analyst-created branches become the continuing implementation branch, Architect should ensure this does not conflict with one task slice, one branch, one PR, and the separation between intake, planning, implementation, and review.
- If the Analyst is the only role allowed to ask clarification questions, there is a risk that later blockers become hidden assumptions. Architect should distinguish requirement clarification from safety, permission, credential, merge-owner, or data-loss blockers.
- Parallel work can create numeric-prefix collisions before other branches merge. Architect should decide whether durable numbering guidance should explicitly account for observed sibling worktrees or remote branches, not only the current branch's `specs/` directory.
- The requested "do not interrupt until everything is complete" must not weaken required checks, blocking review findings, conflict handling, process memory, evidence, or branch-protection constraints.

## Acceptance Expectations

- Durable workflow guidance states that repository-changing user requests default to Orchestrator entry, not direct Analyst, Architect, Implementation Agent, or Review Agent work.
- Durable Orchestrator guidance states that Orchestrator invokes Analyst first for intake and stays strictly in the Orchestrator role.
- Durable guidance documents the Analyst clarification loop through Orchestrator and says Analyst is the only normal-flow role allowed to ask user requirement clarification questions.
- Durable guidance requires Orchestrator to create or require isolated worktrees/branches for parallel work and to tell subagents that parallel agents may be active and existing work must be preserved.
- Durable guidance explains how the Analyst-created branch/worktree is handed to Orchestrator after intake.
- Durable guidance explains when Orchestrator may proceed without more user questions after Analyst handoff, including user-authorized merge behavior, while preserving all merge-readiness gates.
- Architect planning covers any needed updates to `AGENTS.md`, `CLAUDE.md`, `docs_project/project/devops/ai-pr-workflow.md`, `docs_project/project/devops/review-contract.md`, `.github/pull_request_template.md`, `.specify/memory/constitution.md`, `.specify/templates/*`, and `specs/README.md` if those files contain related workflow language.
- Implementation scope remains process documentation/templates and feature memory only; no learner-facing app, content, runtime, CI, branch-protection, secrets, or production-resource changes are expected unless Architect explicitly scopes them.
- Verification should include text-search evidence for Orchestrator-first trigger language, Analyst-through-Orchestrator clarification language, parallel-work isolation language, no-direct-edit role boundaries, post-Analyst autonomous continuation language, and merge-readiness preservation.
