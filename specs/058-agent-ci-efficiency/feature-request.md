# Feature Request: Agent and CI Efficiency

## Analyst Artifact Status

Created by Analyst intake after explicit Orchestrator assignment. This is requirements evidence, not an implementation plan or a claim that validation has passed.

## Orchestrator Routing Context

- Original interaction was a read-only analysis of recent sessions, commits, and PRs. It became repository-changing when the user asked to implement recommendations 1–2.
- Orchestrator assigned Analyst to this intake in `/Users/kristina.kurashova/projects/caba-drive/cabadrive/.claude/worktrees/agent-ci-efficiency`, branch `codex/058-agent-ci-efficiency`, based on verified `origin/main` `9e17a059536586d8c2319f8cabcea9bcd288385d`.
- Parallel agents may be active. Preserve all sibling dirty diffs, branches, commits, PRs, worktrees, and process memory. No accidental direct implementation start or cleanup is part of this intake.
- This active worktree may be the single implementation PR slice only if Orchestrator explicitly assigns it. No cleanup is assigned.

## User Request

«Давай внедрим пункты 1–2: обнови правила работы агентов и CI, чтобы убрать лишние опросы и полные прогоны для отчётных правок, не ослабляя проверки качества. Если понадобятся изменения в репо, сразу создавай pr, прогоняй проверки, доведи до merge ready, включая AI Review, все треды резолвлены. Затем выжди 2 минуты и смержи.»

The referenced recommendations were: replace frequent agent/CI status polling and unnecessary handoffs with completion-triggered or bounded waits, keeping a proportionate independent review; and avoid repeating the expensive full CI suite when a later change adds only validation/reporting evidence, while retaining the full suite for code, data, build, runtime, dependencies, and similarly material changes.

## Clarified Answers And Assumptions

- No clarification is needed: the user named both changes, preserved quality, explicitly required a ready PR, AI Review, resolved threads, a two-minute wait after merge readiness, and merge.
- “Report-only” is a narrow, positively proven class of append-only validation or evidence text in governed feature memory. It does **not** mean all Markdown, documentation, `specs/`, or `tasks.md` changes. New/changed requirements, acceptance criteria, dispositions, plans, procedures, or implementation tasks are substantive.
- The historical PR #219 repeated full checks after a final feature-memory evidence edit. That is motivation, not permission to trust file extensions, commit messages, labels, or author assertions as the classifier.
- Agent waits should be event-driven where a completion signal exists, otherwise bounded and backed off; a substantive state change or deadline justifies another status check. This must not suppress required review, validation, or current-head guard decisions.
- The user's two-minute delay starts only after every merge-readiness gate is true for the exact current PR head. Any head, check, review, or conflict change during the delay requires revalidation and a fresh two-minute period after readiness is restored.

## Project Context Reviewed

- `AGENTS.md`, `CLAUDE.md`, `.specify/memory/constitution.md`, `.specify/templates/feature-request-template.md`: role ownership, complete feature memory, ordered final validations, effective content head, required checks, review and merge boundaries.
- `.github/workflows/ci.yml`: expensive `baseline-checks` and `docker-validation` jobs currently run on every PR update; baseline includes pinned native image QA, repository checks, type/lint, negative quality contracts, tests, build, and browser tests; Docker performs production and resource proof.
- `.github/workflows/pr-guard.yml`, `.github/workflows/ai-review.yml`, `.github/workflows/osv-scan.yml`, `.unicorn-hub/config.json`: required names are `baseline-checks`, `docker-validation`, `guard`, `AI Review`, `osv-scan`. The PR guard already checks out trusted gate scripts from the default branch. AI Review is an independent required gate.

## External Research

No external research is needed for intake. Architect and Implementation Agent should verify current GitHub Actions behavior and security recommendations against primary documentation before designing job-level skip/summary behavior; path-filtered workflows can leave required checks pending, so the required named checks must run on every current head.

## Problem Statement

Frequent status polling and repeated process handoffs consume agent turns and tokens while work is merely pending. A later evidence-only PR update currently reruns the same expensive full baseline and Docker proof even when the validated product content has not changed. Broad CI skipping would create a quality and branch-protection blind spot, so the saving depends on a trustworthy, fail-closed proof of unchanged effective content.

## Proposed Outcome Or Workflow

1. Agent instructions define a single owner for GitHub/CI monitoring, prefer completion notification or one bounded wait with backoff, and call for rechecking only after a meaningful transition, timeout, or planned readiness decision. Avoid duplicate status narration and handoffs while preserving independent review, ordered final Architect/Analyst validation, and Orchestrator's exact-head final guard.
2. CI classifies the current PR update using a trusted implementation and complete Git diff. It uses the short path only when it positively proves the changed content is solely permitted validation/evidence additions and that a prior full validation applies to the unchanged effective content. It otherwise runs the full existing baseline and Docker suites.
3. All five required checks remain present, green only on valid evidence, and tied to the exact current PR head. `guard`, `AI Review`, and `osv-scan` retain their independent required behavior. There is no reduction in the tests for material changes, no change to branch protection, and no acceptance of a missing, skipped, pending, or stale required status as success.

## Role Boundaries And Handoff

- Analyst owns only this intake and later Analyst-owned validation notes if explicitly invoked after Architect passes.
- Architect owns `spec.md`, `plan.md`, `tasks.md`, the precise evidence classifier and trust model, required test matrix, and any rule/template changes.
- Implementation Agent alone edits assigned rules, workflows, scripts, tests, and process evidence after complete feature memory exists; Review Agent reviews the resulting diff and feature-memory compliance independently.
- Orchestrator owns PR/check/review coordination, exact-head readiness checks, the user's two-minute readiness delay, and authorized merge. Preserve parallel work.

## Open Questions And Risks

- Architect must define the exact allowlisted evidence locations and semantic checks. A changed `tasks.md` may be evidence-only in one append but substantive in another; pathname alone is insufficient.
- A trusted base or last successful full run must be cryptographically and temporally linked to the unchanged effective content. If that evidence is absent, incomplete, ambiguous, or stale, CI must take the full path.
- A PR updating CI, the classifier itself, agent rules, runtime/build/asset/lock files, or any mixed/unknown path must run full checks, even if it also contains evidence text. The first PR implementing this feature therefore takes the full path.
- A failed classifier, shallow/incomplete diff, rename/deletion, changed base, fork permission limitation, or unexpected event must fail closed to full verification or a red required check. A skipped workflow/job status cannot masquerade as validation.

## Acceptance Expectations

1. Agent rules and any relevant template mirror the same completion-based monitoring guidance without weakening role boundaries, review, exact-head check requirements, final validation, or merge gates. A documented, bounded response to a stuck check remains available.
2. An automated test matrix proves evidence-only addition after a verified full run takes the short path and still produces successful `baseline-checks` and `docker-validation` for the exact new head with machine-readable proof of the covered effective content. It also proves that changed requirements/task semantics, non-append edits, code, tests, assets, locks, workflow/classifier changes, mixed/unknown paths, missing provenance, base drift, and malformed/failed classification take the full path or fail red.
3. Full-path validation retains the existing baseline, Docker, guard, AI Review, and OSV behavior. The short path retains all five required named statuses, independent review/security/feature-memory checks, and strong proof that previously full-tested effective content is unchanged. No broad path filter or permissive `continue-on-error` weakens the gate.
4. Publish a ready-for-review PR with the required Codex attribution. Run applicable local and remote checks, obtain passing AI Review on the exact current head, substantively address or dispose findings, and resolve every required review thread. Record current process memory, final Architect then Analyst validation, and read-only exact-head merge guard.
5. After all objective gates are green and the PR is conflict-free, wait at least two minutes. Recheck the exact current head, required checks, AI Review, review conversations, conflicts, and process evidence immediately before merge. If anything changes, restore readiness and restart the delay. Squash-merge through GitHub and verify merged state there.

## Final Analyst Validation Notes

Append-only Analyst-owned section. Populate only after Orchestrator invokes final Analyst validation following passing final Architect validation.
