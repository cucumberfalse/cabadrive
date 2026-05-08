# Plan: Analyst Role Intake

## Summary

Update Cabadrive's durable process guidance so a new Analyst role owns request intake before Architect planning. The implementation should add the `feature-request.md` artifact contract, define the Analyst-to-Orchestrator handoff, preserve strict role boundaries, and update templates/docs so future agents can follow the workflow.

This is a documentation/template process change only. It must not modify product code, runtime behavior, CI workflows, branch-protection automation, or production resources.

## Technical Context

- runtime: none; process documentation and templates only.
- dependencies: none.
- product paths: none expected.
- data changes: none.
- feature memory path: `specs/003-analyst-role-intake/`.
- external rationale:
  - GOV.UK discovery phase: https://www.gov.uk/service-manual/agile-delivery/how-the-discovery-phase-works
  - GitLab Product Development Flow: https://handbook.gitlab.com/handbook/product-development/how-we-work/product-development-flow/
  - Atlassian PRD guidance: https://www.atlassian.com/agile/product-management/requirements
  - GitHub issue templates/forms: https://docs.github.com/en/enterprise-cloud@latest/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository
  - Scrum Guide 2020: https://scrumguides.org/docs/scrumguide/v2020/2020-Scrum-Guide-US.pdf

## Expected Implementation Files

The Implementation Agent must verify this list with repository search before editing. Likely files:

- `AGENTS.md`
- `specs/README.md`
- `.specify/memory/constitution.md`
- `.specify/templates/feature-request-template.md`
- `.specify/templates/spec-template.md`
- `.specify/templates/tasks-template.md`
- `.github/pull_request_template.md`
- `docs_project/project/devops/ai-pr-workflow.md`
- `docs_project/project/devops/review-contract.md`
- `specs/003-analyst-role-intake/tasks.md`

The Implementation Agent may adjust the file list if search shows another durable process document repeats the affected workflow. Any addition must be recorded in `tasks.md` with the reason. Do not edit source product files, runtime files, workflow YAML, scripts, package metadata, lockfiles, generated output, secrets, or production resources.

## Scope Boundaries

- in scope: role descriptions, intake workflow, feature-memory artifact contract, templates, handoff rules, feedback disposition rules, review-output expectations, process-memory updates.
- out of scope: app UI, data/content implementation, Docker runtime, CI automation, branch protection, executable bots, GitHub Actions workflows, product tests, deployment changes.

## Constitution Check

- Spec-first: yes; this feature memory is created before implementation.
- Testable boundaries: yes; verification is text search, diff scope review, template presence, and local preflight if available.
- Test-first bias: not applicable to executable product tests because this is documentation/template only; textual verification is required.
- Supervised verification: yes; every acceptance criterion maps to concrete search or diff evidence.
- PR-only: yes; implementation should land through a PR and not direct push to `main`.
- One worktree per task: yes; implementation should use the assigned branch/worktree only.
- Deployability: neutral; no runtime behavior changes.
- Simplicity: yes; no new automation unless separately requested.
- Process memory: yes; decisions, dead ends, known issues, Implementation Agent feedback, and Architect dispositions live in `tasks.md`.

## Implementation Approach

1. Confirm branch/worktree is the assigned implementation branch stacked on `codex/002-orchestrator-role-boundary`.
2. Search durable docs/templates for role and feature-memory language:
   - `rg -n "Architect|Orchestrator|Implementation Agent|Review Agent|feature memory|feature-request|feature request|inline review|AI_REVIEW" AGENTS.md specs docs_project .specify .github`
3. Update `AGENTS.md` to add Analyst and adjust boundaries for Analyst, Architect, Orchestrator, Implementation Agent, and Review Agent.
4. Update feature-memory guidance so `feature-request.md` is the Analyst intake artifact and future repository-changing features have a clear artifact sequence.
5. Add `.specify/templates/feature-request-template.md` with sections for user request, clarified assumptions, project context, external research, proposed workflow, role boundaries, artifact contract, open questions/risks, and acceptance expectations.
6. Update existing spec/tasks templates only where needed to reference Analyst intake, Implementation Agent feedback, and Architect dispositions.
7. Update PR and devops workflow/review docs only where needed to align the done gate and review contract with the new role boundaries.
8. Record any Implementation Agent feedback in `tasks.md` under "Implementation Agent Feedback"; Orchestrator should route each item to Architect for disposition before completion.
9. Keep all edits ASCII-only.

## Verification

| Acceptance criterion | Planned evidence |
| --- | --- |
| AC-001 | `rg -n "### Analyst|Analyst.*feature-request.md|Analyst.*handoff|Analyst.*shuts? down" AGENTS.md docs_project .specify specs` shows durable Analyst guidance. |
| AC-002 | `rg -n "feature-request.md|feature request" specs/README.md .specify/templates AGENTS.md docs_project` shows required intake artifact guidance. |
| AC-003 | `rg -n "next sequential|numeric prefix|specs/<.*number|collision|split" AGENTS.md specs/README.md .specify/templates docs_project` shows numbering and split guidance. |
| AC-004 | `rg -n "Architect.*does not write code|Architect.*technical solution|implementation.*review.*test" AGENTS.md docs_project specs .specify/templates` shows Architect boundary and planning expectations. |
| AC-005 | `rg -n "Orchestrator.*invok|Orchestrator.*must not directly edit|development through production" AGENTS.md docs_project` shows Orchestrator handoff and no-edit boundary. |
| AC-006 | `rg -n "Implementation Agent.*feedback|diverge|improvement|Architect disposition" AGENTS.md .specify/templates specs docs_project` shows implementation feedback guidance. |
| AC-007 | `rg -n "feedback.*Architect|ticket|task|not needed|not-needed|disposition" AGENTS.md .specify/templates specs docs_project` shows Orchestrator tracking and Architect disposition guidance. |
| AC-008 | `rg -n "Review Agent.*does not change code|inline review thread|GitHub inline" AGENTS.md docs_project .github` shows review boundary and inline finding rule. |
| AC-009 | `test -f .specify/templates/feature-request-template.md && sed -n '1,220p' .specify/templates/feature-request-template.md` shows reproducible template sections. |
| AC-010 | `git diff --name-only` contains only process docs/templates and `specs/003-analyst-role-intake/` files. |

Negative scenario evidence:

- Search output shows vague requests, independent-goal splits, Implementation Agent divergence, and Review Agent code findings are covered by durable guidance.
- `git diff --check` passes.
- Run the repository's local preflight if available, expected command: `pnpm run preflight`.
- If preflight is unavailable due to missing dependencies or unrelated local state, record the exact failure in `tasks.md` and provide the text-search/diff evidence above.

## Risks

- Risk: Existing docs may repeat the role model in more places than expected.
- Mitigation: Search broadly before editing and record any adjusted file list in `tasks.md`.

- Risk: Adding `feature-request.md` could conflict with current feature-memory gate assumptions.
- Mitigation: Do not edit guard scripts in this feature. Keep `spec.md`, `plan.md`, and `tasks.md` as required PR artifacts and document `feature-request.md` as the Analyst intake artifact.

- Risk: The requested inline-review rule could be read as forbidding successful no-finding summary comments.
- Mitigation: Phrase the rule specifically for code review findings; leave backend-specific pass behavior unchanged unless explicitly in scope.

- Risk: Internet research may leak private context or create stale citations.
- Mitigation: Analyst guidance should require public-safe queries, source links, and clear separation between external practice and Cabadrive-specific decisions.
