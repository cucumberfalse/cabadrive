# Tasks: Auto Merge Finalization

## Task List

- [x] Update implementation branch from latest `origin/main` before final PR readiness, preserving sibling `specs/018-learning-ticket-timer` and duplicate-prefix context.
- [x] Update `AGENTS.md` completion and delivery wording for automatic Orchestrator finalization after gates pass, with narrow exceptional human blockers.
- [x] Update `docs_project/project/devops/ai-pr-workflow.md` to replace authorization-only merge mechanics with the new conservative finalization flow.
- [x] Update `docs_project/project/devops/review-contract.md` so review expectations align with automatic finalization and preserved gates.
- [x] Update `.github/pull_request_template.md` so the SENAR and merge-readiness checklists no longer require routine human merge-owner acceptance after objective gates pass.
- [x] Implement `scripts/finalize-pr.mjs` with pure gate evaluation separated from GitHub mutation.
- [x] Add a package script for the finalization helper.
- [x] Add focused tests covering successful readiness and blocker scenarios.
- [x] Run verification and record evidence below.
- [x] Record implementation decisions, dead ends, known issues, and any Implementation Agent feedback in this file.

## Required Helper Scenarios

- [x] Refuses to run without PR context or explicit PR identifier.
- [x] Refuses stale head state.
- [x] Refuses draft PRs.
- [x] Refuses conflicts or unclear mergeability.
- [x] Refuses red, missing, queued, pending, or running required checks by default.
- [x] Uses `.unicorn-hub/config.json` `requiredChecks`.
- [x] Refuses unresolved review threads or blocking findings.
- [x] Refuses missing final Architect validation, final Analyst validation, process evidence, feedback disposition, acceptance evidence, or current-head guard evidence.
- [x] Squash merges by default only after all gates pass.
- [x] Enables GitHub auto-merge for pending checks only behind an explicit flag.
- [x] Provides no direct-push, force, or branch-protection bypass path.

## Process Context

- Intake branch/worktree started at `a26a124...`.
- `origin/main` advanced to `995905b...` after intake and added sibling `specs/018-learning-ticket-timer`.
- Implementation Agent must update/rebase/merge latest main before final PR readiness and preserve both `018` feature folders.
- Implementation update evidence: on 2026-05-10, Implementation Agent ran `git fetch origin && git merge --no-edit origin/main` in `/Users/chap/devel/cabadrive-018-auto-merge-finalization`; the branch fast-forwarded from `a26a124` to `995905b`, preserving `specs/018-auto-merge-finalization/` and adding sibling `specs/018-learning-ticket-timer/`.
- Second implementation update evidence: after `origin/main` advanced again to `b26a37d`, Implementation Agent ran `git merge --autostash --no-edit origin/main` on 2026-05-10. The branch fast-forwarded from `995905b` to `b26a37d`; an autostash conflict in `docs_project/project/devops/review-contract.md` was resolved by preserving new #66 Orchestrator-first enforcement blockers and this feature's finalization/merge wording. The temporary autostash was dropped after its tracked changes were restored into the worktree.
- Third implementation update evidence: after `origin/main` advanced to `578c618`, follow-up Implementation Agent ran `git fetch origin && git stash push --include-untracked -m codex-preserve-018-auto-merge-finalization-followup && git merge --ff-only origin/main && git stash pop` on 2026-05-10. The branch fast-forwarded from `b26a37d` to `578c618`; the scoped implementation patch was restored unstaged with no conflicts, preserving sibling feature work and the new `specs/012-caba-exam-process/` mainline content.

## Decisions

- Architect decision: implement docs/templates plus an executable conservative helper, tentatively `scripts/finalize-pr.mjs`, because docs-only changes would not ensure automatic finalization.
- Architect decision: helper defaults to squash merge because the active ruleset allows only squash.
- Architect decision: pending checks are blockers unless an explicit flag asks GitHub to enable protected auto-merge.
- Implementation decision: the helper uses pure `evaluateFinalizationGates()` plus CLI GitHub behavior. Tests exercise the pure gate layer without real GitHub mutation; the CLI uses `gh api graphql` and `gh pr merge`.
- Implementation decision: the helper reads required checks from `.unicorn-hub/config.json` through `readConfig()` and treats skipped, neutral, missing, red, queued, pending, or running required checks as not merge-ready.
- Implementation decision: immediate merge uses `gh pr merge --squash --match-head-commit <current-head>`. The only pending-check path is `--auto-merge-pending`, which adds `--auto` and still uses GitHub protected merge behavior.
- Implementation decision: unknown or paginated status/review-thread data is converted into a blocker rather than assumed safe.
- Follow-up implementation decision: `readProcessEvidence()` treats `None yet` as valid Implementation Agent feedback disposition only when it is the sole recorded feedback value; if substantive feedback is recorded beside it, the helper requires explicit `Architect disposition`, `disposed`, or `No unresolved` evidence.
- Follow-up implementation decision: `readProcessEvidence()` requires clear current-head guard text in `tasks.md` but does not require the process-memory file to contain the current commit SHA. Current PR head freshness remains enforced by the helper's `gh pr merge --match-head-commit <current-head>` call, avoiding impossible self-reference in committed process memory.
- Bugfix implementation decision: GitHub check-run `COMPLETED` with conclusion `ACTION_REQUIRED` is terminal non-success, so `normalizeCheckState()` must classify it as `failed`; it is not eligible for `--auto-merge-pending`.

## Dead Ends

- First full `pnpm run test` failed because this isolated worktree had no `node_modules`; `tests/domain.test.mjs` could not import `typescript`. Resolved by running `pnpm install --frozen-lockfile`, then rerunning tests successfully.
- Updating from `origin/main` after #66 produced an autostash conflict in `docs_project/project/devops/review-contract.md`; resolved by combining upstream process-enforcement blockers with this feature's finalization wording.
- Previous Implementation Agent produced the main patch but did not provide a complete final report or fully refresh process-memory evidence after the second main update; Orchestrator preserved the patch and rerouted this follow-up Implementation Agent to finish helper quality, tasks evidence, and verification without discarding sibling work.
- Orchestrator read-only review found that requiring `tasks.md` to contain `currentHead.slice(0, 12)` made finalization self-blocking: a committed process-memory update cannot reliably contain the SHA of the commit that contains it. Resolved by keeping current-head guard evidence mandatory as a textual marker while leaving exact current-head enforcement to `--match-head-commit`.

## Known Issues

- Final Architect validation and final Analyst validation are intentionally still marked "not yet invoked" in feature memory; this Implementation Agent does not perform those roles.
- No PR was merged by this Implementation Agent. Merge/finalization remains Orchestrator-owned after review, final validation, current-head guard, and required GitHub gates.

## Implementation Agent Feedback

- None yet.

## Verification Evidence

- `git fetch origin && git merge --no-edit origin/main`: passed; fast-forwarded from `a26a124` to `995905b` and preserved sibling `specs/018-learning-ticket-timer/`.
- `git merge --autostash --no-edit origin/main`: passed after resolving one scoped autostash conflict; branch now based on `b26a37d`.
- `git fetch origin && git stash push --include-untracked -m codex-preserve-018-auto-merge-finalization-followup && git merge --ff-only origin/main && git stash pop`: passed; fast-forwarded from `b26a37d` to `578c618`, restored the scoped patch unstaged, and produced no conflicts.
- `node --test tests/finalize-pr.test.mjs`: passed after follow-up helper-quality fix; 10 tests passed, including conservative `None yet` feedback disposition handling.
- `node --check scripts/finalize-pr.mjs`: passed.
- `pnpm run test`: initially failed because `node_modules` was absent and `typescript` could not be imported by existing `tests/domain.test.mjs`; after `pnpm install --frozen-lockfile`, passed with 91 tests.
- `pnpm run check:repo`: passed; "Repository baseline check passed."
- `pnpm run preflight`: passed before the second main update; feature-memory gate, repo baseline, content validation, 91 tests, build, service-worker generation, and 18 Playwright e2e tests passed.
- `pnpm run check:repo`: passed after follow-up helper-quality fix; "Repository baseline check passed."
- `pnpm run preflight`: passed after follow-up helper-quality fix; feature-memory gate, repo baseline, content validation, 92 tests, build, service-worker generation, and 18 Playwright e2e tests passed. Vite reported the existing large chunk warning for `dist/assets/index-Cj7KEjf5.js` but completed successfully.
- `node --test tests/finalize-pr.test.mjs`: passed after the third `origin/main` update; 10 tests passed.
- `pnpm run check:repo`: passed after the third `origin/main` update; "Repository baseline check passed."
- `node scripts/check-feature-memory.mjs --worktree`: passed after the third `origin/main` update; feature-memory gate passed via `specs/018-auto-merge-finalization/{spec,plan,tasks}.md`.
- `pnpm run preflight`: passed after the third `origin/main` update; feature-memory gate, repo baseline, content validation, 96 node tests, build, service-worker generation with 280 cached assets, and 22 Playwright e2e tests passed. Vite reported the existing large chunk warning for `dist/assets/index-B1Qf2Lhx.js` but completed successfully.
- `node --test tests/finalize-pr.test.mjs`: passed after current-head guard evidence fix; 10 tests passed, including guard text without current SHA passing and absent guard text failing.
- `pnpm run check:repo`: passed after current-head guard evidence fix; "Repository baseline check passed."
- `node scripts/check-feature-memory.mjs --worktree`: passed after current-head guard evidence fix; feature-memory gate passed via `specs/018-auto-merge-finalization/{spec,plan,tasks}.md`.
- `pnpm run preflight`: passed after current-head guard evidence fix; feature-memory gate, repo baseline, content validation, 96 node tests, build, service-worker generation with 280 cached assets, and 22 Playwright e2e tests passed. Vite reported the existing large chunk warning for `dist/assets/index-B1Qf2Lhx.js` but completed successfully.
- `node --test tests/finalize-pr.test.mjs`: passed after `ACTION_REQUIRED` classification bugfix; 10 tests passed, including `COMPLETED` + `ACTION_REQUIRED` normalizing to `failed`.
- `pnpm run check:repo`: passed after `ACTION_REQUIRED` classification bugfix; "Repository baseline check passed."
- `node scripts/check-feature-memory.mjs --worktree`: passed after `ACTION_REQUIRED` classification bugfix; feature-memory gate passed via `specs/018-auto-merge-finalization/{spec,plan,tasks}.md`.
- `pnpm run preflight`: passed after `ACTION_REQUIRED` classification bugfix; feature-memory gate, repo baseline, content validation, 96 node tests, build, service-worker generation with 280 cached assets, and 22 Playwright e2e tests passed. Vite reported the existing large chunk warning for `dist/assets/index-B1Qf2Lhx.js` but completed successfully.
- `git status --short --branch && git diff --cached --name-only`: branch remained `codex/018-auto-merge-finalization...origin/main`; scoped patch and sibling work remained unstaged, and no staged files were reported.
- `git status --short --branch`: after the third `origin/main` update and verification, reported `codex/018-auto-merge-finalization...origin/main` with no ahead/behind marker; scoped files remain unstaged as requested.
- Text-search evidence after docs/template updates: `rg -n "authorized merge mechanics|human remains the default|human merge owner|user has already authorized|auto-merge or Orchestrator merge" AGENTS.md docs_project/project/devops/ai-pr-workflow.md docs_project/project/devops/review-contract.md .github/pull_request_template.md` returned no active terminal human-merge-owner wording; the only remaining "only final human approval or merge mechanics" phrase is in `ai-pr-workflow.md` root-cause explanation.
- Gate-preservation evidence: `AGENTS.md` and `ai-pr-workflow.md` now name `.unicorn-hub/config.json` as the required-check source, require current-head green checks, resolved/outdated blocking findings, resolved required review conversations, no conflicts, current process memory, acceptance evidence, Implementation Agent feedback disposition, final Architect validation before final Analyst validation, and current-head guard evidence.
- Helper source-review evidence: `scripts/finalize-pr.mjs` exposes no direct-push, force, admin-bypass, or protected-branch bypass path; merge behavior is limited to `gh pr merge --squash --match-head-commit <current-head>`, with optional `--auto` only behind `--auto-merge-pending`.

## Final Architect Validation Notes

Append-only Architect-owned section used only when Orchestrator invokes final Architect validation.

- Architect validation pass: not yet invoked.
- Architect return count for this work cycle: 0.
