# Tasks: Orchestrator Cleanup Governance

## Setup

- [x] T001 Confirm active implementation worktree is `/Users/chap/devel/cabadrive-014-orchestrator-cleanup-governance`, active branch is `codex/014-orchestrator-cleanup-governance`, and feature folder is `specs/012-orchestrator-cleanup-governance/`.
- [x] T002 Read `.specify/memory/constitution.md`, `AGENTS.md`, `CLAUDE.md`, durable project docs, `docs/specify/README.md`, and `specs/012-orchestrator-cleanup-governance/{feature-request.md,spec.md,plan.md,tasks.md}` before editing.
- [x] T003 Record baseline `git status --short --branch`, `git branch --show-current`, and current HEAD/base state before editing.
- [x] T004 Search scoped workflow docs/templates and `scripts/new-worktree.mjs` for existing Orchestrator startup, `origin/main`, worktree, cleanup, artifact, parallel-work, role-boundary, and completion language.
- [x] T005 Confirm Orchestrator provided a parallel-work warning and preserve existing dirty diffs, branches, commits, PRs, process memory, active worktrees, and ambiguous local paths.
- [x] T006 Record the PR #65 coordination check plan before implementation proceeds; do not touch PR #65 work or artifacts.

## Implementation

- [x] T007 Update `AGENTS.md` so Orchestrator startup defaults to a fresh isolated environment based on latest verified `main`, normally `origin/main` after fetch.
- [x] T008 Update `AGENTS.md` with latest-main fetch failure or unverified-base fallback/blocker behavior.
- [x] T009 Update `AGENTS.md` to add a first-class `Cleanup Agent` role with allowed actions, forbidden actions, validation requirements, refusal rules, evidence requirements, and handoff behavior.
- [x] T010 Update `AGENTS.md` so Orchestrator coordinates completion-time cleanup through Cleanup Agent and does not directly delete local repository environments.
- [x] T011 Update `CLAUDE.md` to align implementation-agent operating rules with latest-main startup, cleanup handoff, Cleanup Agent boundaries, and active/ambiguous work preservation.
- [x] T012 Update `.specify/memory/constitution.md` only as needed so startup isolation and cleanup governance become canonical without weakening spec-first, PR-only, one-worktree, and role-boundary rules.
- [x] T013 Update `.specify/templates/feature-request-template.md` so future intake records startup base, worktree/branch handoff context, cleanup assumptions, candidate artifacts, and parallel-work warnings where relevant.
- [x] T014 Update `.specify/templates/spec-template.md` so future specs capture cleanup applicability, negative scenarios, refusal conditions, evidence expectations, and blocker exceptions.
- [x] T015 Update `.specify/templates/tasks-template.md` so future tasks include cleanup evidence, active-work preservation, and Implementation Agent feedback/Architect disposition for cleanup uncertainty.
- [x] T016 Update `docs_project/project/devops/ai-pr-workflow.md` as the primary workflow narrative for latest-main startup, Cleanup Agent assignment, completion-time cleanup, validation, refusal, evidence, and handoff.
- [x] T017 Update `docs_project/project/devops/review-contract.md` so Review Agent blocks unsafe cleanup wording, missing cleanup evidence, deletion of active/ambiguous work, and role-boundary violations.
- [x] T018 Update `specs/README.md` if needed to align feature-memory lifecycle, numbering/collision guidance, cleanup evidence, and parallel-work coordination with this feature.
- [x] T019 Update `.github/pull_request_template.md` if needed so PR authors/reviewers confirm latest-main startup evidence, cleanup evidence, role boundaries, and active-work preservation.
- [x] T020 Keep implementation limited to scoped process docs/templates and this feature memory unless an Architect-disposed feedback item explicitly scopes a narrow supporting change.
- [x] T021 Do not add automatic deletion tooling in this feature unless implementation records a concrete blocker and receives Architect disposition.
- [x] T022 Record any scope tension, proposed automation, unclear candidate ownership, PR #65 overlap, or missing validation capability as Implementation Agent feedback instead of expanding scope directly.

## One-Time Cleanup

- [x] T023 Assign one-time cleanup to Cleanup Agent or an explicitly scoped equivalent cleanup role after durable cleanup rules are updated.
- [x] T024 Record approved cleanup roots for this run before candidate discovery.
- [x] T025 Record current active worktree, active branch, and paths that are excluded from cleanup, including `/Users/chap/devel/cabadrive`, `/Users/chap/devel/cabadrive-014-orchestrator-cleanup-governance`, PR #65 work, and any active/ambiguous work.
- [x] T026 Run read-only dry-run candidate discovery for the current worktree list and the user-listed `cabadrive-009-content-093-184`, `cabadrive-009-content-185-276`, `cabadrive-009-content-277-368`, and `cabadrive-009-content-369-460` paths if present.
- [x] T027 Validate each candidate against the full cleanup safety checklist in `plan.md`; preserve candidates on any failed or unavailable check.
- [x] T028 Remove only candidates that pass every required validation check, using `git worktree remove <path>` for registered worktrees.
- [x] T029 Record exact deletion commands and post-cleanup confirmations for removed candidates.
- [x] T030 Record explicit refusal reasons for preserved candidates.
- [x] T031 Confirm no active, current, dirty, unpushed, open-PR, ambiguous, user-owned, out-of-root, or PR #65-related path was removed.

## Verification

- [x] T032 Run `git diff --check`.
- [x] T033 Run `node scripts/check-feature-memory.mjs --worktree`.
- [x] T034 Run `pnpm run check:repo`.
- [x] T035 Run `pnpm run preflight`.
- [x] T036 Verify latest-main fresh isolated environment startup language with the AC-001 text-search command from `plan.md`.
- [x] T037 Verify fetch/base verification and stale/fetch-failure fallback language with the AC-002 text-search command from `plan.md`.
- [x] T038 Verify Cleanup Agent role boundaries and Orchestrator cleanup coordination language with the AC-003 text-search command from `plan.md`.
- [x] T039 Verify cleanup refusal conditions with the AC-005 text-search command from `plan.md`.
- [x] T040 Verify cleanup evidence includes inventory, validation/removal actions, refusal reasons, reconciliation note, and post-cleanup confirmation.
- [x] T041 Verify PR #65/current-main coordination evidence is recorded before PR publication or merge.
- [x] T042 Run `git diff --name-only` and manually confirm changed files are limited to scoped process docs/templates, this feature memory, and explicitly scoped cleanup evidence.
- [x] T043 Record verification evidence, cleanup evidence, dead ends, decisions, known issues, and Implementation Agent feedback in this file before completion.
- [x] T044 Confirm every Implementation Agent feedback item has Architect disposition before completion.

## Process Memory

### Dead Ends

- Architect verification note: an initial ad hoc `rg` command used unescaped backticks in the shell pattern, so zsh attempted command substitution for `main`. The command made no file changes; it was rerun with single-quoted pattern successfully.
- Implementation dry-run note: an initial shell inventory command used `status` as a zsh variable name and failed because `status` is read-only in zsh. The command made no file changes and was rerun successfully with `git_status`.
- Cleanup evidence mismatch: the first Cleanup Agent report incorrectly listed `/Users/chap/devel/cabadrive-009-content-277-368` as deleted, but Orchestrator post-check found it still present. The mismatch was treated as a reconciliation dead end; a focused Cleanup Agent reran positive-proof validation for only that candidate before removing it with `git worktree remove`.

### Decisions

- Architect decision: Add `Cleanup Agent` as a first-class role. Cleanup is destructive local-disk work and should be separate from Orchestrator coordination and Implementation Agent repository edits.
- Architect decision: Cleanup must be positive-proof. Directory names, timestamps, and intuition can identify candidates, but deletion requires repository, worktree, branch, PR, process, cleanliness, completion, and approved-root evidence.
- Architect decision: Orchestrator startup defaults to a fresh isolated environment from latest verified `main`, normally `origin/main` after fetch. Fetch failure or unverified base state is a blocker or documented fallback, not permission to reuse stale work silently.
- Architect decision: The one-time cleanup belongs in this ticket as an operational cleanup step with evidence, but Architect does not perform it. Cleanup Agent validates/removes, and process memory records the result.
- Architect decision: Keep `specs/012-orchestrator-cleanup-governance/` as-is despite the reported parallel PR #65 on a `codex/012-...` branch. Mitigation is to inspect PR #65/current `main` before publication or merge and stop for Architect coordination on any same-path or overlapping conflict.
- Architect decision: Broad automatic cleanup tooling is out of scope for this feature. If implementation finds a narrow tool is necessary, it must be recorded as feedback and receive Architect disposition before being implemented.
- Implementation decision: No cleanup automation or deletion tooling was added. The durable rules define the role, validation, refusal, and evidence contract; actual one-time deletion remains for a separately assigned Cleanup Agent per the current Implementation Agent assignment.
- Architect disposition, 2026-05-10: choose path A for PR #65 coordination. This feature may be published now as a draft or ready PR with an explicit dependency/coordination note naming PR #65, because the feature-memory path is distinct and publication does not mutate `main`. Merge remains gated: if PR #65 merges first, this branch must rebase onto latest verified `main`, reconcile the overlapping governance/template files, rerun required verification, and update evidence before merge. If PR #65 remains open when this feature is otherwise ready to merge, Orchestrator must obtain an explicit sequencing decision instead of merging both overlapping PRs opportunistically.

### Known Issues

- Some old local artifacts may not contain enough metadata to prove they were agent-created and completed. Those paths must be preserved unless the user authorizes a separate manual cleanup.
- Cleanup PR-state validation depends on GitHub lookup. If credentials or network access are unavailable, affected candidates are ambiguous and must be preserved.
- Existing helper-created and sibling worktree naming conventions may differ. The implementation must document approved cleanup roots and cannot rely on one naming pattern.
- PR #65 remains an active merge-order risk because it is open against `main` from the same base SHA and changes the same durable workflow/template files as this feature. Publication may proceed with an explicit dependency/coordination note, but merge is blocked until the latest PR #65 state is resolved by rebase-after-merge, closed-PR confirmation, or explicit Orchestrator/owner sequencing.

### Verification Evidence

- Architect planning read `.specify/memory/constitution.md`, `docs_project/README.md`, `docs_project/project-idea.md`, frontend/backend docs, feature inventory, learning/exam flows, `docs/specify/README.md`, active `feature-request.md`, devops workflow docs, review contract, `specs/README.md`, `.specify/templates/*`, `CLAUDE.md`, `scripts/new-worktree.mjs`, `scripts/publish-branch.mjs`, `scripts/shared.mjs`, `package.json`, and `.unicorn-hub/config.json`.
- Architect baseline status: `git status --short --branch` reported `## codex/014-orchestrator-cleanup-governance...origin/main` with untracked `specs/012-orchestrator-cleanup-governance/`.
- Architect worktree confirmation: `pwd` reported `/Users/chap/devel/cabadrive-014-orchestrator-cleanup-governance`; `git branch --show-current` reported `codex/014-orchestrator-cleanup-governance`.
- Architect scope check: `git ls-files --modified --others --deleted --exclude-standard` showed only `specs/012-orchestrator-cleanup-governance/{feature-request.md,plan.md,spec.md,tasks.md}`.
- Architect validation: `git diff --check` passed.
- Architect validation: `node scripts/check-feature-memory.mjs --worktree` passed with `No configured product paths changed; feature-memory gate passes.`
- Architect keyword check: `rg -n 'Cleanup Agent|latest verified \`main\`|origin/main|PR #65|One-Time Cleanup Evidence|Cleanup Safety Validation' specs/012-orchestrator-cleanup-governance` found the planned role, startup, PR #65, validation checklist, and evidence sections.
- Implementation baseline status before editing: `pwd` reported `/Users/chap/devel/cabadrive-014-orchestrator-cleanup-governance`; `git branch --show-current` reported `codex/014-orchestrator-cleanup-governance`; `git status --short --branch` reported `## codex/014-orchestrator-cleanup-governance...origin/main` with untracked `specs/012-orchestrator-cleanup-governance/`.
- Implementation latest-main check before editing: `git fetch origin main` succeeded on 2026-05-09 local time; `HEAD`, `origin/main`, and `merge-base HEAD origin/main` all resolved to `f697b538281bd5f05a248fa7d947896f4527bfb5`.
- Implementation remote check before editing: `origin` resolved to `git@github.com:cucumberfalse/cabadrive.git`.
- Implementation read-order evidence: read `.specify/memory/constitution.md`, `AGENTS.md`, `CLAUDE.md`, `docs_project/README.md`, `docs_project/project-idea.md`, frontend/backend docs, feature inventory, learning/exam flows, `docs/specify/README.md`, active feature memory, scoped devops docs, scoped templates, PR template, `specs/README.md`, and `scripts/new-worktree.mjs`.
- Implementation workflow-language search: `rg -n "Orchestrator|Analyst|Implementation Agent|Review Agent|worktree|main|origin/main|cleanup|artifact|parallel|merge|feature-request|tasks\\.md" AGENTS.md CLAUDE.md docs_project/project/devops .github/pull_request_template.md .specify/memory/constitution.md .specify/templates specs/README.md scripts/new-worktree.mjs` completed before editing.
- Implementation parallel-work inventory: `git worktree list --porcelain` showed many active sibling and managed worktrees, including `/Users/chap/devel/cabadrive`, the four user-listed `cabadrive-009-content-*` worktrees, PR #65's `/Users/chap/devel/cabadrive-012-orchestrator-final-validation-loop`, and the current `/Users/chap/devel/cabadrive-014-orchestrator-cleanup-governance`; none were modified or removed.
- Implementation PR #65 coordination check: GitHub PR #65 (`https://github.com/cucumberfalse/cabadrive/pull/65`) is open, not merged, base `main`, base SHA `f697b538281bd5f05a248fa7d947896f4527bfb5`, head `codex/012-orchestrator-final-validation-loop` at `69e6068d878cbc52df40b70c82155f005a58bca2`, and changes overlapping governance files (`AGENTS.md`, `CLAUDE.md`, `.specify/memory/constitution.md`, `.specify/templates/*`, `.github/pull_request_template.md`, devops docs, and `specs/README.md`) plus its own feature memory. Current feature path `specs/012-orchestrator-cleanup-governance/` is distinct. Orchestrator must stop for Architect coordination before PR publication or merge if overlap remains.
- Architect PR #65 coordination pass, 2026-05-10: read-only GitHub lookup confirmed PR #65 is still open, not merged, base `main`, base SHA `f697b538281bd5f05a248fa7d947896f4527bfb5`, head `codex/012-orchestrator-final-validation-loop` at `69e6068d878cbc52df40b70c82155f005a58bca2`, mergeable, and changing overlapping durable governance/template files. Changed-file lookup confirmed overlap in `.github/pull_request_template.md`, `.specify/memory/constitution.md`, `.specify/templates/feature-request-template.md`, `.specify/templates/spec-template.md`, `.specify/templates/tasks-template.md`, `AGENTS.md`, `CLAUDE.md`, `docs_project/project/devops/ai-pr-workflow.md`, `docs_project/project/devops/review-contract.md`, and `specs/README.md`; PR #65's feature memory remains under the distinct `specs/012-orchestrator-final-validation-loop/` path.
- Implementation changed files after governance edits are limited to the assigned scope: `AGENTS.md`, `CLAUDE.md`, `.specify/memory/constitution.md`, `.specify/templates/feature-request-template.md`, `.specify/templates/spec-template.md`, `.specify/templates/tasks-template.md`, `.github/pull_request_template.md`, `docs_project/project/devops/ai-pr-workflow.md`, `docs_project/project/devops/review-contract.md`, `specs/README.md`, and this `tasks.md`.
- Implementation AC text-search preview: `rg -n "latest verified|origin/main|fetch.*origin|fresh isolated|Cleanup Agent|cleanup evidence|positive proof|open-PR|running-process|out-of-root|Orchestrator.*delete|must not directly delete" ...` found latest-main startup, Cleanup Agent, cleanup evidence, positive-proof validation, refusal conditions, and Orchestrator no-direct-delete language across scoped docs/templates.
- Implementation validation: `git diff --check` passed with no output.
- Implementation validation: `node scripts/check-feature-memory.mjs --worktree` passed with `Feature-memory gate passed via specs/012-orchestrator-cleanup-governance/{spec,plan,tasks}.md`.
- Implementation validation: `pnpm run check:repo` passed with `Repository baseline check passed.`
- Implementation validation: first `pnpm run preflight` attempt failed at `vite build` with `sh: vite: command not found` and `node_modules missing`; no tracked `public/`, `dist/`, or package-file changes were produced.
- Implementation validation recovery: `pnpm install --frozen-lockfile` succeeded, installed dependencies from the unchanged lockfile, and did not modify tracked package files.
- Implementation validation: second `pnpm run preflight` passed. It included feature-memory gate, repository baseline, content validation, 72 Node tests, production build, service-worker generation, and 14 Playwright e2e tests.
- Implementation validation: final `pnpm run preflight` rerun after process-memory updates passed again with feature-memory gate, repository baseline, content validation, 72 Node tests, production build, service-worker generation, and 14 Playwright e2e tests.
- Implementation AC-001 text search: `rg -n "latest.*main|origin/main|fresh.*isolated|new.*worktree|repository-changing.*start" AGENTS.md CLAUDE.md docs_project/project/devops .specify/memory/constitution.md .specify/templates specs/README.md` found latest-main fresh isolated startup language.
- Implementation AC-002 text search: `rg -n "fetch.*origin.*main|fetch.*fail|unverified|stale|fallback|blocker" AGENTS.md CLAUDE.md docs_project/project/devops .specify/templates specs/012-orchestrator-cleanup-governance` found fetch, unverified-base, stale, fallback, and blocker language.
- Implementation AC-003 text search: `rg -n "Cleanup Agent|cleanup.*role|Orchestrator.*coordinat.*cleanup|must not.*delete" AGENTS.md CLAUDE.md docs_project/project/devops .specify/memory/constitution.md docs_project/project/devops/review-contract.md` found Cleanup Agent, cleanup role, Orchestrator cleanup coordination, and no-direct-delete language.
- Implementation AC-005 text search: `rg -n "active|current|dirty|untracked|unpushed|open PR|ambiguous|user-owned|outside.*root|locked|running process|refuse|preserve" AGENTS.md CLAUDE.md docs_project/project/devops .specify/templates docs_project/project/devops/review-contract.md specs/012-orchestrator-cleanup-governance` found refusal and preservation language for active/current/dirty/untracked/unpushed/open-PR/ambiguous/user-owned/out-of-root/locked/running-process targets.
- Implementation scope validation: `git ls-files --modified --others --deleted --exclude-standard` listed only scoped process docs/templates plus `specs/012-orchestrator-cleanup-governance/{feature-request.md,plan.md,spec.md,tasks.md}`.
- Implementation final status before handoff: `git status --short --branch` reported branch `codex/014-orchestrator-cleanup-governance...origin/main` with modified scoped docs/templates and untracked `specs/012-orchestrator-cleanup-governance/`; `git ls-files --modified --others --deleted --exclude-standard public dist node_modules` produced no output.
- Narrow evidence-recording update, 2026-05-10: edited only `specs/012-orchestrator-cleanup-governance/tasks.md` to mark T023-T031 complete, update T040 wording, record final Cleanup Agent evidence, record the `/Users/chap/devel/cabadrive-009-content-277-368` evidence mismatch and focused reconciliation, and clear unresolved Implementation Agent feedback.
- Narrow evidence-recording validation, 2026-05-10: `node scripts/check-feature-memory.mjs --worktree` passed with `Feature-memory gate passed via specs/012-orchestrator-cleanup-governance/{spec,plan,tasks}.md`.
- Narrow evidence-recording validation, 2026-05-10: `git diff --check` passed with no output.

### Cleanup Evidence

- Approved cleanup roots for the one-time Cleanup Agent run were Cabadrive sibling agent worktrees under `/Users/chap/devel/cabadrive-*` and managed worktrees under `/Users/chap/devel/cabadrive/.claude/worktrees/`. Current repo `/Users/chap/devel/cabadrive`, current feature worktree `/Users/chap/devel/cabadrive-014-orchestrator-cleanup-governance`, active/open-PR/dirty/ambiguous paths, and any candidate failing validation were excluded.
- Cleanup Agent first pass dry-run: 66 candidates; 54 validated for removal; 12 preserved. Cleanup Agent used only `git worktree remove "<absolute path>"` from `/Users/chap/devel/cabadrive-014-orchestrator-cleanup-governance`; no `rm -rf`, no `--force`, and no repository-file edits, staging, commits, pushes, PRs, reviews, merges, or checks.
- First pass deleted sibling worktrees: `/Users/chap/devel/cabadrive-007-agent-workflow-intake`, `/Users/chap/devel/cabadrive-008-learning-materials-intake`, `/Users/chap/devel/cabadrive-009-content-093-184`, `/Users/chap/devel/cabadrive-009-content-185-276`, and `/Users/chap/devel/cabadrive-011-orchestrator-analyst-routing-intake`.
- First pass deleted validated merged managed worktrees under `/Users/chap/devel/cabadrive/.claude/worktrees/006-*` for merged PRs #12-#60, except the preserved `006-topic-guide-schema-validator` and `006-vehicle-condition-maintenance-loads-topic-content` paths.
- First pass evidence mismatch: the report listed `/Users/chap/devel/cabadrive-009-content-277-368` as deleted, but Orchestrator post-check found it still present. No other path was touched during reconciliation until the focused Cleanup Agent validation below completed.
- Focused Cleanup Agent reconciliation for `/Users/chap/devel/cabadrive-009-content-277-368`: approved root/basename matched sibling `/Users/chap/devel/cabadrive-*`; registered worktree; branch `codex/009-content-277-368`; HEAD `15be90560aeca271e07aa40f96869afbac262f99`; clean status; upstream `origin/codex/009-content-277-368`; ahead/behind `0 / 0`; not locked; no running process references; PR lookup returned `[]`; not current repo, current feature worktree, PR #63, or PR #65 work.
- Focused reconcile deletion command: `git worktree remove "/Users/chap/devel/cabadrive-009-content-277-368"` from `/Users/chap/devel/cabadrive-014-orchestrator-cleanup-governance`; exit code `0`; no output. Post-check confirmed `git worktree list --porcelain` no longer contained the path and filesystem check reported the path absent.
- Orchestrator post-cleanup confirmation for the original user-listed paths: `/Users/chap/devel/cabadrive-009-content-093-184` removed; `/Users/chap/devel/cabadrive-009-content-185-276` removed; `/Users/chap/devel/cabadrive-009-content-277-368` removed after focused reconciliation; `/Users/chap/devel/cabadrive-009-content-369-460` present and preserved.
- Preserved paths and reasons: `/Users/chap/devel/cabadrive-009-content-001-092` dirty tracked files; `/Users/chap/devel/cabadrive-009-content-369-460` upstream/open #63 branch relationship; `/Users/chap/devel/cabadrive-009-ticket-image-metadata-intake` mandatory PR #63 open and dirty specs; `/Users/chap/devel/cabadrive-010-ui-ux-learning-intake` active/dirty/untracked; `/Users/chap/devel/cabadrive-012-orchestrator-final-validation-loop` mandatory PR #65 open; `/Users/chap/devel/cabadrive-013-learning-content-ui-polish` active/dirty; `/Users/chap/devel/cabadrive-014-orchestrator-cleanup-governance` current worktree; `/Users/chap/devel/cabadrive-015-study-guide-language-review-intake` active/untracked spec folder; `/Users/chap/devel/cabadrive-016-primary-sources-section` active/untracked spec folder; `/Users/chap/devel/cabadrive-017-difficulty-labeling-orchestrator` appeared after dry-run and was preserved as new/ambiguous active; `/Users/chap/devel/cabadrive-orchestrator-main-content-review` detached review worktree; `/Users/chap/devel/cabadrive/.claude/worktrees/006-topic-guide-schema-validator` branch `main`, ambiguous/non-agent; `/Users/chap/devel/cabadrive/.claude/worktrees/006-vehicle-condition-maintenance-loads-topic-content` running Vite/esbuild processes referenced the path.
- Post-cleanup `git worktree list --porcelain` shows canonical repo plus preserved worktrees only. `/Users/chap/devel/cabadrive/.claude/worktrees/` contains only `006-topic-guide-schema-validator` and `006-vehicle-condition-maintenance-loads-topic-content`.
- No active, current, dirty, open-PR, ambiguous, or intentionally preserved path was intentionally removed. Registered dirty worktrees would be refused by `git worktree remove` without `--force`, and no force option was used; this evidence supports the cleanup result without claiming more than the recorded validation proves.

## Implementation Agent Feedback

- No unresolved Implementation Agent feedback remains after Architect disposition and Cleanup Agent evidence reconciliation. PR #65 remains a known merge-order risk under the existing Architect disposition, not a new unresolved implementation item.

## Architect Dispositions

- PR #65 overlap: disposition is path A. Publication may proceed now as draft or ready PR with an explicit dependency/coordination note naming PR #65 and the overlapping governance/template files. Merge must not proceed until either PR #65 merges and this branch rebases/revalidates on latest verified `main`, PR #65 closes without merge and current-main verification is rerun, or Orchestrator records an explicit owner-approved sequencing decision that this PR merges first and PR #65 will rebase afterward.
- One-time cleanup deletion: disposed as Cleanup Agent work after durable rules exist. Cleanup Agent evidence is now recorded above, including first-pass cleanup, mismatch reconciliation, preserved paths, and post-cleanup confirmation. No repository/docs/template change is needed for this feedback item.
