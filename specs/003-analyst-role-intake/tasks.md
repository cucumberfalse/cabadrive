# Tasks: Analyst Role Intake

## Setup

- [x] T001 Confirm active branch is `codex/003-analyst-role-intake`.
- [x] T002 Read repository constitution, durable project docs index, existing role guidance, relevant process docs, and local templates.
- [x] T003 Create `specs/003-analyst-role-intake/` for this process feature.
- [x] T004 Create Analyst-style `feature-request.md` for this feature.
- [x] T005 Create Architect-owned `spec.md`, `plan.md`, and `tasks.md` for implementation handoff.

## Implementation

- [x] T006 Confirm assigned implementation worktree and branch before editing durable process files.
- [x] T007 Search durable docs/templates for existing role, feature-memory, PR, and review-contract language.
- [x] T008 Update `AGENTS.md` to introduce Analyst and clarify Analyst, Architect, Orchestrator, Implementation Agent, and Review Agent boundaries.
- [x] T009 Update `specs/README.md` to include `feature-request.md` in the feature-memory lifecycle.
- [x] T010 Update `.specify/memory/constitution.md` if needed so governance reflects Analyst intake and the added artifact.
- [x] T011 Add `.specify/templates/feature-request-template.md`.
- [x] T012 Update `.specify/templates/spec-template.md` and/or `.specify/templates/tasks-template.md` if needed to reference Analyst intake, Implementation Agent feedback, and Architect dispositions.
- [x] T013 Update `.github/pull_request_template.md` if needed so the done gate accounts for Analyst intake and feedback disposition.
- [x] T014 Update `docs_project/project/devops/ai-pr-workflow.md` if needed to describe Orchestrator control and feature-memory expectations.
- [x] T015 Update `docs_project/project/devops/review-contract.md` so Review Agent cannot change code and code review findings are GitHub inline review threads.
- [x] T016 Record any adjusted implementation file list and reason in Process Memory.
- [x] T017 Record any Implementation Agent feedback in the feedback section below.
- [x] T018 Obtain Architect disposition for each feedback item before completion.

## Verification

- [x] T019 Verify Analyst guidance exists with text-search evidence.
- [x] T020 Verify `feature-request.md` artifact guidance and template exist with text-search evidence.
- [x] T021 Verify numbering/split guidance exists with text-search evidence.
- [x] T022 Verify Architect, Orchestrator, Implementation Agent, and Review Agent boundaries exist with text-search evidence.
- [x] T023 Verify Implementation Agent feedback and Architect disposition guidance exists with text-search evidence.
- [x] T024 Verify Review Agent inline-thread rule exists with text-search evidence.
- [x] T025 Run `git diff --check`.
- [x] T026 Run `git diff --name-only` and confirm changes are limited to process docs/templates and `specs/003-analyst-role-intake/`.
- [x] T027 Run `pnpm run preflight` if available, or record why it could not run.
- [x] T028 Update this task checklist and process memory with final verification evidence.

## Process Memory

### Dead Ends

- None yet.

### Decisions

- Treat this feature as process documentation/template work only.
- Use `003-analyst-role-intake` because the existing highest numeric prefix under `specs/` is `002`, even though multiple `002-*` folders exist.
- Keep executable enforcement, CI workflow changes, branch-protection changes, product code, runtime files, and app tests out of scope.
- Add `feature-request.md` as an Analyst intake artifact while preserving `spec.md`, `plan.md`, and `tasks.md` as required repository-changing PR feature memory.
- Apply the requested inline-thread rule specifically to code review findings so no-finding backend summaries are not accidentally banned.
- The expected implementation file list matched repository search. No extra durable process files beyond the planned list were needed.

### Known Issues

- Before this implementation, the Analyst role did not exist in durable repository guidance; this change adds it in process docs/templates.
- The repository currently has duplicate `002-*` numeric prefixes, so the implementation must document a deterministic next-number rule.
- The current feature-memory guard may not know about `feature-request.md`; changing guard scripts is out of scope for this feature.
- Review residual risk: `feature-request.md` is documented but not automatically enforced by guard scripts; this is already known and out of scope.

### Verification Evidence

- Branch check: `git status --short --branch` reported `## codex/003-analyst-role-intake`.
- Scope check: `git status --short` reported only `?? specs/003-analyst-role-intake/`.
- File check: `find specs/003-analyst-role-intake -type f -maxdepth 1 -print | sort` reported exactly `feature-request.md`, `plan.md`, `spec.md`, and `tasks.md`.
- ASCII check: `LC_ALL=C rg -n "[^[:ascii:]]" specs/003-analyst-role-intake || true` returned no matches.
- Existing templates read: `.specify/templates/spec-template.md`, `.specify/templates/plan-template.md`, and `.specify/templates/tasks-template.md`.
- Existing role guidance read: `AGENTS.md`.
- Existing process docs read: `specs/README.md`, `.specify/memory/constitution.md`, `docs_project/project/devops/ai-pr-workflow.md`, and `docs_project/project/devops/review-contract.md`.
- External rationale reviewed: GOV.UK discovery phase, GitLab Product Development Flow, Atlassian PRD guidance, GitHub issue template/forms docs, and Scrum Guide 2020.
- Implementation branch check: `pwd && git branch --show-current && git status --short` reported `/Users/chap/devel/cabadrive` on `codex/003-analyst-role-intake`.
- Durable search: `rg -n "Architect|Orchestrator|Implementation Agent|Review Agent|feature memory|feature-request|feature request|inline review|AI_REVIEW|pull request|review contract" AGENTS.md specs docs_project .specify .github` found the affected role, feature-memory, PR, and review-contract language.
- Analyst guidance search: `rg -n "### Analyst|Analyst.*feature-request\.md|Analyst.*handoff|Analyst.*shuts? down" AGENTS.md docs_project .specify specs` found `AGENTS.md`, `.specify/memory/constitution.md`, `.specify/templates/feature-request-template.md`, `docs_project/project/devops/ai-pr-workflow.md`, and this feature memory.
- Intake artifact search: `rg -n "feature-request\.md|feature request" specs/README.md .specify/templates AGENTS.md docs_project` found `specs/README.md`, `AGENTS.md`, `.specify/templates/feature-request-template.md`, `.specify/templates/spec-template.md`, `.specify/templates/tasks-template.md`, and `docs_project/project/devops/ai-pr-workflow.md`.
- Numbering and split search: `rg -n "next sequential|numeric prefix|specs/<.*number|collision|split" AGENTS.md specs/README.md .specify/templates docs_project` found the max-prefix rule, collision handling, and split guidance in `AGENTS.md`, `specs/README.md`, and `.specify/templates/feature-request-template.md`.
- Architect boundary search: `rg -n "Architect.*does not write code|Architect.*technical solution|implementation.*review.*test" AGENTS.md docs_project specs .specify/templates` found `AGENTS.md` lines for technical solution requirements and no-code boundary.
- Orchestrator boundary search: `rg -n "Orchestrator.*invok|Orchestrator.*must not directly edit|development through production" AGENTS.md docs_project` found `docs_project/project/devops/ai-pr-workflow.md` lines for invoking agents, no-direct-edit boundary, and development-through-production responsibility.
- Implementation feedback search: `rg -n "Implementation Agent.*feedback|diverge|improvement|Architect disposition" AGENTS.md .specify/templates specs docs_project` found `AGENTS.md`, `.specify/templates/tasks-template.md`, `docs_project/project/devops/ai-pr-workflow.md`, and this feature memory.
- Feedback disposition search: `rg -n "feedback.*Architect|ticket|task|not needed|not-needed|disposition" AGENTS.md .specify/templates specs docs_project` found Orchestrator tracking and Architect disposition guidance in `AGENTS.md`, `.specify/templates/tasks-template.md`, `docs_project/project/devops/ai-pr-workflow.md`, and this feature memory.
- Review boundary search: `rg -n "Review Agent.*does not change code|inline review thread|GitHub inline" AGENTS.md docs_project .github` found `AGENTS.md` and `docs_project/project/devops/review-contract.md`.
- Template check: `test -f .specify/templates/feature-request-template.md && sed -n '1,220p' .specify/templates/feature-request-template.md` printed sections for Analyst artifact status, user request, clarified assumptions, project context, external research, proposed workflow, role boundaries, artifact handoff, risks, and acceptance expectations.
- Negative scenario search: `rg -n "vague|open questions|independent goals|split|diverge|improvement|inline review thread|must not patch|does not change code" AGENTS.md specs/README.md .specify/templates docs_project specs/003-analyst-role-intake` found guidance for unclear requests, independent-goal splits, Implementation Agent divergence, and Review Agent code findings.
- Added-line ASCII check: `git diff --no-ext-diff --unified=0 | LC_ALL=C rg -n '^\+.*[^[:ascii:]]' || true` returned no matches.
- Diff whitespace check: `git diff --check` passed with no output.
- Tracked diff scope: `git diff --name-only` reported `.github/pull_request_template.md`, `.specify/memory/constitution.md`, `.specify/templates/spec-template.md`, `.specify/templates/tasks-template.md`, `AGENTS.md`, `docs_project/project/devops/ai-pr-workflow.md`, `docs_project/project/devops/review-contract.md`, and `specs/README.md`.
- Worktree scope: `git status --short --branch` showed only the tracked process docs/templates above plus untracked `.specify/templates/feature-request-template.md` and `specs/003-analyst-role-intake/`.
- Preflight: `pnpm run preflight` passed. It ran the feature-memory gate, `check:repo`, `validate:content`, `test`, `build`, and `test:e2e`; unit tests passed 18/18 and Playwright tests passed 8/8. Vite emitted the existing chunk-size warning during build.
- Final scope check after preflight: `git status --short --branch` still showed only process docs/templates plus untracked `.specify/templates/feature-request-template.md` and `specs/003-analyst-role-intake/`.
- Review Agent reported `No findings` after inspecting `git status`, tracked diff, untracked `.specify/templates/feature-request-template.md`, and all `specs/003-analyst-role-intake/` files.
- Orchestrator reran `git diff --check` and it passed.
- Orchestrator reran `pnpm run preflight` and it passed: feature-memory gate, repo baseline, content validation, unit tests 18/18, build, and Playwright 8/8. Vite emitted the existing chunk-size warning.

## Implementation Agent Feedback

None.

## Architect Dispositions

No Architect disposition required because no Implementation Agent feedback was recorded.
