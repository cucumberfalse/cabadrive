# Plan: Orchestrator Cleanup Governance

## Summary

Update Cabadrive's process guidance so Orchestrator starts repository-changing work from a fresh latest-main isolated environment, adds a narrowly scoped Cleanup Agent for completion-time disk cleanup, and requires one-time cleanup evidence for completed agent-created environments. This is governance and process work plus an operational one-time cleanup evidence step; it must not change learner-facing product behavior or runtime contracts.

## Technical Context

- runtime: none for product runtime; process documentation, templates, feature memory, and local cleanup evidence only.
- dependencies: existing Git, GitHub CLI or equivalent PR lookup, shell read-only inspection commands, and existing package tooling for repository verification.
- product paths: none expected.
- data changes: none expected.
- feature memory path: `specs/019-orchestrator-cleanup-governance/`.
- implementation branch/worktree context: `/Users/chap/devel/cabadrive-014-orchestrator-cleanup-governance` on `codex/014-orchestrator-cleanup-governance`.
- likely documentation targets:
  - `AGENTS.md`
  - `CLAUDE.md`
  - `.specify/memory/constitution.md`
  - `.specify/templates/feature-request-template.md`
  - `.specify/templates/spec-template.md`
  - `.specify/templates/tasks-template.md`
  - `.github/pull_request_template.md`
  - `docs_project/project/devops/ai-pr-workflow.md`
  - `docs_project/project/devops/review-contract.md`
  - `specs/README.md`
  - `specs/019-orchestrator-cleanup-governance/tasks.md`
- likely technical inspection targets:
  - `scripts/new-worktree.mjs` as evidence for the existing latest-main helper behavior; edit only if implementation finds a direct mismatch with the spec and records why.
  - `scripts/check-feature-memory.mjs` and `scripts/check-repo-baseline.mjs` for verification, not cleanup.

## Scope Boundaries

- in scope: latest-main Orchestrator startup rule, fresh isolated worktree/branch/PR slice rule, fetch failure handling, Cleanup Agent role and boundaries, completion-time cleanup coordination, validation/refusal checklist, one-time cleanup evidence, review gates for unsafe cleanup, PR #65 coordination mitigation, and this feature memory.
- out of scope: product code, content, translations, assets, Docker/runtime behavior, service worker behavior, package dependency changes, CI workflow changes, branch-protection changes, secrets, production resources, broad cleanup automation, and deletion of any active or ambiguous work.

## Constitution Check

- Spec-first: yes; Analyst intake exists as `feature-request.md`, and this Architect plan precedes implementation.
- Testable boundaries: yes; process behavior maps to text search, manual diff review, feature-memory checks, and cleanup inventory evidence.
- PR-only: yes; repository changes must land through a PR and must not be pushed directly to `main`.
- One worktree per task: yes; implementation must use the assigned isolated worktree/branch/PR slice and preserve parallel work.
- Simplicity: yes; prefer durable guidance and explicit validation evidence over automatic deletion tooling. Any new automation needs a current need documented before implementation.
- Deployability: neutral; no runtime behavior changes are expected.
- Process memory: yes; `tasks.md` must record decisions, dead ends, known issues, cleanup evidence, verification evidence, and Implementation Agent feedback.

## Implementation Approach

1. Confirm the assigned worktree, branch, feature folder, and baseline status before editing:
   - `pwd`
   - `git status --short --branch`
   - `git branch --show-current`
   - `test -f specs/019-orchestrator-cleanup-governance/feature-request.md`
2. Read active feature memory and scoped durable process docs/templates before editing.
3. Search existing workflow language to avoid contradictions:
   - `rg -n "Orchestrator|Analyst|Implementation Agent|Review Agent|worktree|main|origin/main|cleanup|artifact|parallel|merge|feature-request|tasks.md" AGENTS.md CLAUDE.md docs_project/project/devops .github/pull_request_template.md .specify/memory/constitution.md .specify/templates specs/README.md scripts/new-worktree.mjs`
4. Update `AGENTS.md` so it clearly states:
   - Orchestrator starts every new repository-changing task from a fresh isolated environment based on latest verified `main`.
   - Normal startup fetches `origin/main`, records the base, creates or assigns a new isolated worktree and branch, and warns subagents about parallel work.
   - Fetch failure or unverified base state is a blocker or documented fallback, not permission to reuse stale work silently.
   - Cleanup Agent is a first-class role with narrow cleanup authority and explicit forbidden actions.
   - Orchestrator coordinates cleanup at completion but does not directly delete local repository environments.
5. Update `CLAUDE.md` with implementation-agent operating rules for latest-main startup expectations, cleanup handoff, and preserving active/ambiguous work.
6. Update `.specify/memory/constitution.md` only as needed to make startup isolation and cleanup governance canonical without weakening existing role boundaries.
7. Update `.specify/templates/*` so future feature memory captures startup base, worktree/branch context, cleanup applicability, cleanup evidence, and feedback disposition.
8. Update `docs_project/project/devops/ai-pr-workflow.md` as the main durable workflow narrative for latest-main startup, completion-time cleanup coordination, Cleanup Agent assignment, validation, refusal, evidence, and handoff.
9. Update `docs_project/project/devops/review-contract.md` so reviewers block unsafe cleanup rules, missing cleanup evidence, and role-boundary violations.
10. Update `specs/README.md` and `.github/pull_request_template.md` only where feature-memory lifecycle, cleanup evidence, parallel-work preservation, or completion gates need alignment.
11. Do not add automatic deletion tooling in this feature unless implementation records a concrete mismatch that cannot be solved with guidance and Architect disposition. If tooling is proposed, record it as Implementation Agent feedback first.
12. Perform the one-time cleanup only after the durable validation rules are in place. Cleanup must be assigned to a Cleanup Agent or an explicitly scoped equivalent operational role, must start with dry-run inventory, and must return evidence for recording in `tasks.md`.
13. Keep `tasks.md` current throughout implementation, including decisions, known issues, one-time cleanup evidence, verification evidence, and any feedback.

## Cleanup Safety Validation Checklist

Every candidate must pass all required checks before deletion. Failure, inability to run a check, or ambiguous output means preserve the candidate.

1. Approved root: Candidate path is under an explicitly documented Cabadrive agent-environment root, expected to be a managed worktree root under the repository or a Cabadrive sibling worktree root under `/Users/chap/devel/`.
2. Current-work exclusion: Candidate is not the current Orchestrator, Architect, Implementation Agent, Review Agent, or Cleanup Agent worktree.
3. Path ownership: Candidate is not the canonical user repository `/Users/chap/devel/cabadrive`, not a user-created directory, and not a durable memory or production resource path.
4. Repository identity: `git -C <candidate> rev-parse --show-toplevel` succeeds and the remote URL matches the Cabadrive repository remote, or the candidate has an Architect-approved equivalent marker proving Cabadrive agent ownership.
5. Worktree metadata: Candidate appears in `git worktree list --porcelain` for the Cabadrive repository or has equivalent metadata proving it was created as an agent work environment.
6. Agent-created proof: Candidate has a branch, path convention, process memory reference, or helper-created metadata tying it to an agent task. Name pattern alone is insufficient.
7. Activity check: Candidate is not referenced by active feature memory, active branch assignments, current PR work, running Orchestrator/agent instructions, or known active process memory.
8. Lock/process check: Candidate is not a locked worktree and has no running process using it as a working directory or open project root. If this cannot be checked, preserve it.
9. Git cleanliness: `git -C <candidate> status --short` has no output.
10. Upstream state: Candidate branch has an upstream or documented merge/closure evidence. Missing upstream without merge evidence blocks deletion.
11. Unpushed commits: `git -C <candidate> rev-list --left-right --count @{u}...HEAD` or an equivalent command shows no local-only commits requiring preservation. If no upstream exists, preserve unless merge evidence proves all commits are reachable from `origin/main`.
12. PR state: GitHub lookup by branch/head SHA shows no open PR and no unresolved review/check state. Lookup failure blocks deletion.
13. Completion evidence: Candidate has final agent report, merged/closed PR evidence, explicit Orchestrator completion state, or another durable completion signal. Absence blocks deletion.
14. Deletion method: Registered worktrees are removed with `git worktree remove <candidate>` from the managing repository. Raw `rm -rf` is forbidden for registered worktrees and allowed only for non-worktree generated artifacts with explicit Architect-scoped evidence.
15. Post-cleanup confirmation: After deletion, evidence confirms the path no longer exists or the worktree list no longer references it, and no unrelated worktree was affected.

## One-Time Cleanup Evidence Requirements

Record evidence in `tasks.md` or a scoped feature-memory section before completion. The evidence must include:

- Timestamp and role that performed cleanup.
- Candidate discovery command and full candidate list.
- Approved cleanup roots used for this run.
- Current active worktree and branch that were excluded.
- For each candidate: path, branch, HEAD SHA, remote URL, worktree registration status, git status result, upstream/unpushed result, PR state, lock/process result, active-process-memory check, completion signal, final action, and reason.
- For each removed candidate: exact deletion command, command result, and post-cleanup confirmation.
- For each preserved candidate: explicit refusal reason.
- Confirmation that `/Users/chap/devel/cabadrive-014-orchestrator-cleanup-governance`, `/Users/chap/devel/cabadrive`, PR #65 work, and any active or ambiguous work were not touched.
- Any unavailable check and its conservative outcome.

## Prefix Rename Resolution

After clean rebase onto `origin/main` `78e0176e361eeea583dd797296bfa994b3f1f695` from PR #63, this branch is based on the latest verified main state without conflicts. PR #63 adds product/content learning support and feature memory `specs/009`; current main's max feature-memory prefix remains `018`, so the cleanup feature memory remains valid at `specs/019-orchestrator-cleanup-governance/`. Prior PR #66/PR #72 and PR #69/P2 rebase notes are historical/superseded latest-base evidence only, and prior final Architect/Analyst validations are stale pending fresh rerun after this PR #63 rebase.

## Complexity Tracking

The only new abstraction planned is the Cleanup Agent role. It is justified because cleanup is destructive local-disk work and should not be folded into Orchestrator's coordination role or Implementation Agent's code/docs role. The role must stay narrow: assigned cleanup, validation, evidence, and refusal. Broader automation or unattended deletion is intentionally out of scope.

## Verification

| Acceptance criterion | Evidence |
| --- | --- |
| AC-001 | `rg -n "latest.*main|origin/main|fresh.*isolated|new.*worktree|repository-changing.*start" AGENTS.md CLAUDE.md docs_project/project/devops .specify/memory/constitution.md .specify/templates specs/README.md` |
| AC-002 | `rg -n "fetch.*origin.*main|fetch.*fail|unverified|stale|fallback|blocker" AGENTS.md CLAUDE.md docs_project/project/devops .specify/templates specs/019-orchestrator-cleanup-governance` |
| AC-003 | `rg -n "Cleanup Agent|cleanup.*role|Orchestrator.*coordinat.*cleanup|must not.*delete" AGENTS.md CLAUDE.md docs_project/project/devops .specify/memory/constitution.md docs_project/project/devops/review-contract.md` |
| AC-004 | Cleanup evidence table in `tasks.md` shows every removed path passed the full validation checklist. |
| AC-005 | `rg -n "active|current|dirty|untracked|unpushed|open PR|ambiguous|user-owned|outside.*root|locked|running process|refuse|preserve" AGENTS.md CLAUDE.md docs_project/project/devops .specify/templates docs_project/project/devops/review-contract.md specs/019-orchestrator-cleanup-governance` |
| AC-006 | One-time cleanup evidence in `tasks.md` includes inventory, per-target validation, action, reason, and post-cleanup confirmation. |
| AC-007 | One-time cleanup evidence explicitly names active/preserved worktrees and confirms the current worktree and PR #65 work were not touched. |
| AC-008 | Manual diff review plus text search shows scoped process docs/templates align on startup, Cleanup Agent, cleanup validation, and cleanup evidence. |
| AC-009 | `tasks.md` records PR #65/current-main coordination check before implementation PR publication or merge. |
| AC-010 | `git diff --name-only` and manual review show no product code, content behavior, runtime configuration, secrets, branch protection, or unrelated automation changes. |

Negative scenario evidence:

- Name-pattern-only deletion is forbidden by durable text and no cleanup evidence relies only on names.
- Dirty/untracked candidates are preserved with recorded `git status --short` output.
- Unpushed or no-upstream candidates are preserved unless merge evidence proves all commits are reachable from `origin/main`.
- Open-PR or PR-lookup-failure candidates are preserved.
- Current, active, locked, running-process, out-of-root, user-owned, and ambiguous candidates are preserved.
- Fetch failure or unverified latest-main startup is documented as blocker/fallback, not silent stale reuse.
- PR #65 overlap or same-path conflict triggers Orchestrator/Architect coordination.

Required command evidence:

- `git diff --check`
- `node scripts/check-feature-memory.mjs --worktree`
- `pnpm run check:repo`
- `pnpm run preflight`
- `git status --short --branch`
- `git diff --name-only`
- cleanup inventory command, expected to include `git worktree list --porcelain` and a candidate directory listing under approved roots
- per-candidate cleanup validation commands, recorded in `tasks.md`

If a command cannot run because of local environment, missing credentials, or unrelated repository state, record the exact command, failure, conservative outcome, and mitigation in `tasks.md`.

## Risks

- Risk: Cleanup guidance could be read as permission for Orchestrator to run destructive shell commands.
- Mitigation: Define Cleanup Agent as the cleanup executor and state Orchestrator coordinates but does not directly delete environments.

- Risk: A directory name or modification time could be mistaken for proof that a path is safe to delete.
- Mitigation: Require full positive-proof validation and state that name/time are candidate discovery hints only.

- Risk: One-time cleanup could remove active parallel work.
- Mitigation: Require active worktree/branch/PR/process-memory checks, PR #65 mitigation, and preservation of any ambiguous candidate.

- Risk: Fetching latest `main` can fail because of network or credentials.
- Mitigation: Treat unverified latest-main state as a blocker or documented fallback, and do not silently reuse stale environments.

- Risk: Cleanup evidence contains local filesystem paths.
- Mitigation: Record only local paths needed to prove safe cleanup in feature memory; do not include secrets, tokens, or unrelated user directory contents.

- Risk: Broad automation could create data-loss risk.
- Mitigation: Keep automatic deletion tooling out of scope unless separately planned and reviewed; use evidence-driven manual cleanup for this ticket.

## Process Memory

- PR #67 review finding, 2026-05-10: unresolved P2 found `.specify/templates/plan-template.md` still used old startup wording and lacked cleanup applicability/evidence fields, so AC-008 cross-template consistency was not satisfied.
- Implementation fix, 2026-05-10: update only `.specify/templates/plan-template.md`, this `plan.md`, and `tasks.md` to align the plan template with the already-updated feature/spec/tasks templates on latest verified main with fetch fallback/blocker language, cleanup applicability/evidence/refusal fields, Cleanup Agent review/verification expectations, and current-head/final-validation guards.
- PR #67 prefix P2 finding, 2026-05-10: base now contains `specs/012-orchestrator-final-validation-loop/`, so the cleanup feature memory needed renumbering to the next valid prefix before merge.
- Historical prefix/base update, 2026-05-10: the prior latest-main record was superseded after PR #66 merged. Latest `origin/main` at that time was `b26a37d7d2cb985d70ff8dc79a12b397cc52e271`; this branch was rebased onto it, and governance/template conflicts were resolved preserving both Orchestrator-first enforcement and cleanup/latest-verified-main governance. This PR #66 note is historical/superseded by later latest-base evidence including PR #69/P2 and PR #63.
- Historical PR #72 base update, 2026-05-10: latest `origin/main` was then `578c618d02a45adffa9f2b18a9373495cf19ed8a`; that evidence is now historical/superseded by later PR #69/P2 evidence and the PR #63 rebase.
- PRRT_kwDOSX65IM6A517A P2 finding/fix, 2026-05-10: durable docs/templates still contained hard wording that new task slices start from or verify latest `origin/main`, conflicting with the documented fetch/base fallback/blocker startup rule. The fix updates owned docs/templates to require latest verified `main`, normally `origin/main` after fetch, with no silent stale reuse; the Analyst-created latest-main handoff exception remains.
- Historical PR #69/P2 base update, 2026-05-10: the assigned branch base/merge-base was `origin/main` `65624107d856653e503e3f03fd1d51da83992984` from PR #69. That base's max feature prefix was still `018`, so `specs/019-orchestrator-cleanup-governance/` remained valid at that time. This is now historical/superseded latest-base evidence after the PR #63 rebase, while AI Review thread `PRRT_kwDOSX65IM6A517A` remains addressed by the current P2 fix.
- Prefix/base update, 2026-05-10: the assigned branch was cleanly rebased without conflicts onto `origin/main` `78e0176e361eeea583dd797296bfa994b3f1f695` from PR #63. PR #63 adds product/content learning support and feature memory `specs/009`; current main's max feature prefix remains `018`, so `specs/019-orchestrator-cleanup-governance/` remains valid. Do not change product code, unrelated docs, staging, commit, push, review, resolve threads, or merge in this implementation slice.
- Final validation state, 2026-05-10: prior Architect/Analyst validations after earlier heads, including `b4d9391`/`7557e3d` and PR #72/`7d9a09a`, are stale and superseded by the PR #69/P2 fix and the later PR #63 base update. Fresh Architect and Analyst validation must rerun after this PR #63 rebase; do not claim new final validation has passed.
