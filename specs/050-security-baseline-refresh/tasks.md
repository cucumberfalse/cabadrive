# Tasks: Minimal dependency security baseline refresh

## Cycle State

- Feature: `050-security-baseline-refresh`
- Base: `c5520b31922c0e45afd96b2e5877136c1848a541`
- Branch/worktree: `codex/050-security-baseline-refresh` / `/Users/chap/devel/cabadrive-worktrees/050-security-baseline-refresh`
- Delivery: one independent prerequisite PR
- Parallel preservation: PR #214 and feature 049 / PR #215 are external sibling cycles and must not be mutated.
- Effective content head: `44189024867c12267b264bcaf0cec8ceadf52a5e`
- Current PR head at final Architect validation: `e8b788aa797909e8ff0ffee63af63a736c199d7a` (`tasks.md` process-evidence-only commit relative to the effective content head)
- Architect return count: `0 / 10`
- Analyst return count: `0 / 5`

## Implementation Tasks

- [x] **T001 — Confirm assignment and baseline.** Confirmed worktree `/Users/chap/devel/cabadrive-worktrees/050-security-baseline-refresh`, branch `codex/050-security-baseline-refresh`, and both initial `HEAD` and supplied `origin/main` at `c5520b31922c0e45afd96b2e5877136c1848a541`. Initial changes were only the untracked, complete feature-050 memory. PR #214 and feature 049 / PR #215 were preserved and never opened, edited, rebased, synchronized, or otherwise mutated.

- [x] **T002 — Capture exact-tool and negative-baseline evidence.** `corepack pnpm@10.33.0 --version` returned `10.33.0`. Pre-change SHA-256 values were `df558896acae36082c9369476a91ddc85a886320bf66ba0b39dff087c61bc7bf` for `package.json` and `226e93d47c6444712dd4df71995e0a233860ef498a70fa5428b55eea4699c23b` for `pnpm-lock.yaml`. Full-lock literal counts proved every negative-baseline key in both package and dependency snapshots: each old version appeared twice except `browserslist@4.28.2`, which appeared four times because of its package/snapshot key, dependency edge, and peer-suffixed `update-browserslist-db` key. `packageManager`, scripts, direct ranges, `onlyBuiltDependencies`, and the existing `@babel/core: 7.29.6` override were recorded from the unchanged manifest.

- [x] **T003 — Ordinary compatible lockfile-only refresh first.** The first resolver mutation was exactly `corepack pnpm@10.33.0 update --lockfile-only --depth Infinity baseline-browser-mapping brace-expansion browserslist js-yaml nanoid postcss`. The sandboxed attempt stopped before mutation with an environment `EPERM` on pnpm's temporary file; rerunning the identical command with approved filesystem/network access resolved 241 packages and completed in 1.2 seconds using pnpm 10.33.0. No `--latest`, `--force`, manual YAML edit, override, direct range change, or major/toolchain upgrade was used.

- [x] **T004 — Audit and narrow resolver churn.** The complete 93-line lock diff was reviewed (`47` insertions, `46` deletions). It changes the seven required version lines plus four packages owned only by the updated `browserslist` snapshot: `caniuse-lite`, `electron-to-chromium`, `node-releases`, and `update-browserslist-db`. Their integrity values changed with their package keys; `node-releases` gained its current `node >=18` engine declaration; `brace-expansion` 5.x moved its engine declaration from `18 || 20 || >=22` to `20 || >=22`; and the `update-browserslist-db` snapshot peer suffix follows `browserslist@4.28.9`. No importer, direct dependency, override, peer-dependency range, unrelated owner, or package outside those resolver-required edges changed.

- [x] **T005 — Handle an unreachable threshold safely.** Not needed — ordinary compatible resolution passed all seven thresholds with the existing manifest ranges. No override or Architect exception is required.

- [x] **T006 — Prove all seven thresholds and duplicate absence.** Full-lock fixed-string searches returned zero for every old version. Final package and dependency snapshot keys/edges prove `baseline-browser-mapping@2.11.22`, `brace-expansion@1.1.18`, `brace-expansion@5.0.9`, `browserslist@4.28.9`, `js-yaml@4.3.2`, `nanoid@3.3.18`, and `postcss@8.5.28`; all meet their independent minimums and no vulnerable duplicate remains.

- [x] **T007 — Prove final ownership.** `corepack pnpm@10.33.0 why <name> --recursive` reported: `baseline-browser-mapping@2.11.22 <- browserslist@4.28.9 <- @babel/helper-compilation-targets@7.28.6 <- @babel/core@7.29.6` (also the circular `update-browserslist-db@1.3.3` owner edge); `browserslist@4.28.9` on the same Babel/plugin-react and eslint-plugin-react-hooks graph; `brace-expansion@1.1.18 <- minimatch@3.1.5 <- eslint@9.39.4` and its ESLint owners; `brace-expansion@5.0.9 <- minimatch@10.2.5 <- @typescript-eslint/typescript-estree@8.63.0`; `js-yaml@4.3.2 <- @eslint/eslintrc@3.3.5 <- eslint@9.39.4`; `nanoid@3.3.18 <- postcss@8.5.28 <- vite@6.4.3`; and `postcss@8.5.28 <- vite@6.4.3`. The command found one installed version for every name except the intentionally separate two `brace-expansion` major lines.

- [x] **T008 — Prove determinism.** Immediately before and after `corepack pnpm@10.33.0 install --frozen-lockfile`, SHA-256 remained `df558896acae36082c9369476a91ddc85a886320bf66ba0b39dff087c61bc7bf` for `package.json` and `a05c0f6b4d7d20693f42829ee234840a8c423179940ac3ff24dc0a54370ac65b` for `pnpm-lock.yaml`. Pnpm reported the lockfile up to date and skipped resolution; `git diff --exit-code -- package.json` also passed.

- [x] **T009 — Prove scope boundary.** Final intended changed files are `pnpm-lock.yaml` and `specs/050-security-baseline-refresh/{feature-request.md,spec.md,plan.md,tasks.md}` only. `package.json` is byte-identical to base. `git diff --check` passed. No app, test, content, service-worker, Docker, workflow, feature-049, PR #214, or PR #215 file is present.

- [x] **T010 — Run full local verification.** `corepack pnpm@10.33.0 run preflight` passed on the final graph: repository/feature-memory checks, attribution/content/manual validation, TypeScript, ESLint, Prettier, negative-quality sentinels, `554` Node tests, production builds/service-worker generation, and `154` Playwright tests (`1.6m`) all passed. Existing Vite large-chunk warnings remained non-blocking and unchanged in character.

- [x] **T011 — Publish one ready PR.** Committed and pushed the implementation as `44189024867c12267b264bcaf0cec8ceadf52a5e`, then opened the single non-draft PR [#216](https://github.com/cucumberfalse/cabadrive/pull/216) from `codex/050-security-baseline-refresh` to `main`. Initial GitHub state was open and mergeable, with all five required checks started. No merge or sibling synchronization was performed.

## Review And Follow-up Tasks

- [x] **T012 — Exact-head required checks.** GitHub status on current PR head `e8b788aa797909e8ff0ffee63af63a736c199d7a` is successful for all five required checks: `baseline-checks`, `docker-validation`, `guard`, `AI Review`, and `osv-scan`. PR #216 is open, non-draft, `MERGEABLE`, and `CLEAN`.

- [x] **T013 — Review Agent inspection.** Independent Codex review on exact head `e8b788aa797909e8ff0ffee63af63a736c199d7a` reported no findings. The review evidence covers the complete lock/memory diff, all seven thresholds, both brace lines, duplicate absence, unchanged manifest/override, coherent `browserslist` transitive set, frozen-install/ownership/preflight evidence, and sibling-preservation boundary.

- [x] **T014 — Feedback disposition.** No Implementation Agent feedback and no Review Agent finding exist. Architect disposition: `not-needed` — there is no follow-up item to task or ticket.

- [x] **T015 — Follow-up implementation if required.** Not needed: review passed without findings and all exact-head gates are green; no dependency or behavior change followed effective content head `44189024867c12267b264bcaf0cec8ceadf52a5e`.

## Final Validation And Completion Tasks

- [x] **T016 — Freeze cycle evidence.** Independent cycle PR set is PR #216 only. Effective content head is `44189024867c12267b264bcaf0cec8ceadf52a5e`; current head `e8b788aa797909e8ff0ffee63af63a736c199d7a` changes only `tasks.md` publication/check evidence relative to it. Acceptance evidence is complete, exact-head checks are green, review has no findings, PR is conflict-free/mergeable, feedback is fully disposed, and process memory is current. Cleanup remains an Orchestrator completion-time disposition and does not alter validated content.

- [x] **T017 — Final Architect validation.** Passed for effective content head `44189024867c12267b264bcaf0cec8ceadf52a5e` after validating the full cycle PR set, all tasks/dispositions, ordinary-first resolution with no override, complete lock diff, determinism/ownership/preflight evidence, exact-head review/checks, process memory, and requested security outcome. Current PR head `e8b788aa797909e8ff0ffee63af63a736c199d7a` is process-evidence-only relative to the effective content head.

- [ ] **T018 — Final Analyst validation after T017.** Analyst validates customer intent only after Architect passes, then writes matching effective-head markers in `feature-request.md`. Gaps return to Architect disposition; maximum 5 returns.

- [ ] **T019 — Current-head guard and merge.** Orchestrator proves any later commit is validation-evidence-only; rechecks all required checks on current head, review threads, conflicts, evidence, process memory, feedback, validation ordering, and cleanup evidence/refusal. Any dependency/non-evidence change invalidates validation. Merge only when all gates are current and green.

- [ ] **T020 — Post-merge sequencing.** After feature 050 merge is verified, Orchestrator may synchronize feature 049 / PR #215 and independently PR #214 with updated `main`. This does not add those PRs to this cycle set.

## Threshold Evidence

| Version line | Required | Final | Old version absent everywhere | Ownership evidence |
|---|---:|---:|---|---|
| `baseline-browser-mapping` 2.x | `>=2.11.0` | `2.11.22` | yes | `browserslist -> Babel/Vite/ESLint owners` |
| `brace-expansion` 1.x | `>=1.1.18` | `1.1.18` | yes | `minimatch@3.1.5 -> ESLint graph` |
| `brace-expansion` 5.x | `>=5.0.9` | `5.0.9` | yes | `minimatch@10.2.5 -> typescript-eslint graph` |
| `browserslist` 4.x | `>=4.28.7` | `4.28.9` | yes | `@babel/helper-compilation-targets -> @babel/core` |
| `js-yaml` 4.x | `>=4.3.2` | `4.3.2` | yes | `@eslint/eslintrc -> eslint` |
| `nanoid` 3.x | `>=3.3.18` | `3.3.18` | yes | `postcss -> vite` |
| `postcss` 8.x | `>=8.5.23` | `8.5.28` | yes | `vite` |

## Complete Lock Diff Audit

Populate before PR. Name every changed importer/package/dependency snapshot, checksum, peer suffix, addition, removal, and every package outside the six affected names. `None` is acceptable only after inspecting the complete diff.

- Affected-name changes: package and dependency snapshot keys, integrity values, and owner edges moved `baseline-browser-mapping 2.10.25 -> 2.11.22`, `brace-expansion 1.1.16 -> 1.1.18`, `brace-expansion 5.0.7 -> 5.0.9`, `browserslist 4.28.2 -> 4.28.9`, `js-yaml 4.3.0 -> 4.3.2`, `nanoid 3.3.12 -> 3.3.18`, and `postcss 8.5.15 -> 8.5.28`. The 5.x brace engine metadata changed to the package's new `node: 20 || >=22` declaration.
- Resolver-required changes outside affected names: `browserslist@4.28.9` selected its coherent current dependency set: `caniuse-lite 1.0.30001791 -> 1.0.30001810`, `electron-to-chromium 1.5.348 -> 1.5.426`, `node-releases 2.0.38 -> 2.0.55` (including the new package engine declaration), and `update-browserslist-db 1.2.3 -> 1.3.3`. No other package changed.
- Importer/manifest/override changes: none. The importer, `package.json`, package-manager declaration, scripts, direct dependency specifiers, `onlyBuiltDependencies`, and existing `@babel/core: 7.29.6` override are unchanged.
- Added/removed snapshots and peer changes: each old affected/outside package key and corresponding dependency snapshot was removed and replaced by its audited new key. The only peer-suffixed key changed from `update-browserslist-db@1.2.3(browserslist@4.28.2)` to `update-browserslist-db@1.3.3(browserslist@4.28.9)`; its declared peer range remains `browserslist >=4.21.0`.
- Audit conclusion: minimal ordinary compatible resolution met every threshold. All non-target churn is confined to the indivisible `browserslist` dependency snapshot; no unexplained or opportunistic upgrade remains.

## Verification Evidence

- Exact pnpm version: `10.33.0`.
- Negative baseline: all seven vulnerable version keys present before mutation; counts recorded in T002.
- Ordinary resolver command/result: exact targeted lockfile-only command passed; `241` packages resolved in `1.2s`; no manifest change or override.
- Manifest before/after hash: `df558896acae36082c9369476a91ddc85a886320bf66ba0b39dff087c61bc7bf` unchanged from base through frozen install.
- Lockfile before/after frozen-install hash: final `a05c0f6b4d7d20693f42829ee234840a8c423179940ac3ff24dc0a54370ac65b` unchanged by frozen install (base was `226e93d47c6444712dd4df71995e0a233860ef498a70fa5428b55eea4699c23b`).
- Frozen install: passed; pnpm skipped resolution because the lockfile was current.
- Final ownership queries: passed for all six names with `--recursive`; both brace majors reported independently.
- `git diff --check`: passed.
- Changed-file scope: lockfile plus the four feature-050 memory files only.
- `pnpm run preflight`: passed; `554` Node tests and `154` Playwright tests passed.
- Exact-head required checks: all five required checks passed on current head `e8b788aa797909e8ff0ffee63af63a736c199d7a`: `baseline-checks`, `docker-validation`, `guard`, `AI Review`, and `osv-scan`.
- Review: independent Codex review passed with no findings on exact head `e8b788aa797909e8ff0ffee63af63a736c199d7a`.

## Cycle PR Set

| Purpose | Branch | PR | Head SHA | Status | Included in final validation |
|---|---|---|---|---|---|
| Security baseline refresh | `codex/050-security-baseline-refresh` | [#216](https://github.com/cucumberfalse/cabadrive/pull/216) | effective content `44189024867c12267b264bcaf0cec8ceadf52a5e`; current evidence head `e8b788aa797909e8ff0ffee63af63a736c199d7a` | open, ready, mergeable/CLEAN; all five current-head checks green; review passed | yes |

PR #214 and PR #215 are sequencing dependencies only and are not part of this cycle PR set.

## Decisions

- **One PR:** accepted; lock graph and evidence are one atomic change.
- **Lockfile-only ordinary resolution first:** accepted; no override is planned.
- **Six names / seven version lines:** accepted; every threshold is independently mandatory, including both brace majors.
- **No test-code change:** accepted; proportional verification is negative baseline, graph/diff audit, frozen install, full preflight, exact-head OSV, and review.

## Dead Ends

- Initial sandboxed resolver execution could not create pnpm's temporary file and exited with `EPERM` before modifying the lock. The exact same Architect-approved command succeeded after approved access; this was an environment permission failure, not a resolver or dependency dead end.

## Known Issues

- None accepted. Exact-head checks and review passed; final Analyst validation and Orchestrator current-head/merge guards remain workflow steps, not known issues.

## Implementation Agent Feedback And Architect Disposition

- Implementation feedback: none. Ordinary compatible resolution met the complete scope without an exception or proposed follow-up.
- Review feedback: none. Architect disposition: `not-needed`; no follow-up task or ticket exists.

## Final Architect Validation

Populate only when Orchestrator explicitly invokes final Architect validation after implementation, review, checks, and feedback disposition are current.

- Architect validation pass: passed
- Architect return count: 0
- Final Architect validation completed at: 2026-09-17T18:16:53Z
- Architect validated effective content head: 44189024867c12267b264bcaf0cec8ceadf52a5e
