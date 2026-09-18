# Tasks: Minimal dependency security baseline refresh

## Cycle State

- Feature: `050-security-baseline-refresh`
- Base: `c5520b31922c0e45afd96b2e5877136c1848a541`
- Branch/worktree: `codex/050-security-baseline-refresh` / `/Users/chap/devel/cabadrive-worktrees/050-security-baseline-refresh`
- Delivery: one independent prerequisite PR
- Parallel preservation: PR #214 and feature 049 / PR #215 are external sibling cycles and must not be mutated.
- Previous effective content head before review follow-up: `44189024867c12267b264bcaf0cec8ceadf52a5e`; its Architect and Analyst passes are stale.
Effective content head: e7cd034ff6826a39be50547a2c4f4cacee3a27b1
- Current PR head at final Architect validation: `e8b788aa797909e8ff0ffee63af63a736c199d7a` (`tasks.md` process-evidence-only commit relative to the effective content head)
- Architect return count: `1 / 10`
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

- [x] **T014 — Initial feedback disposition.** No Implementation Agent feedback existed. The later native AI Review on head `03a865683f8dfbad63e0dbb8a4db7002960fc2bf` opened four process-memory/finalizer findings; all four are accepted as R050-001 through R050-004 below.

- [x] **T015 — Implement accepted review corrections.** Commit `e7cd034ff6826a39be50547a2c4f4cacee3a27b1` applies R050-001 through R050-004 only in Architect-owned `spec.md`, `plan.md`, and `tasks.md`; it is the new effective content head because the corrections change durable review disposition and completion semantics. This later additive evidence commit changes only `tasks.md` to record the bare effective-head marker and exact correction classification. The lockfile, manifest, product, tests, workflows, and sibling cycles are unchanged. Thread replies/resolution follow after parser verification confirms the fixes are present.
- [ ] **T015a — Verify parser compatibility.** Run focused finalizer/parser tests if available, `git diff --check`, the repository feature-memory checks, and `pnpm run pr:finalize -- --pr 216 --expected-head <exact-current-head> --feature specs/050-security-baseline-refresh --dry-run`. Record exact output; remaining process-evidence blockers are failures, not accepted limitations.
- [ ] **T015b — Refresh exact-head review and checks.** Obtain fresh Review Agent/native review evidence and green `baseline-checks`, `docker-validation`, `guard`, `AI Review`, and `osv-scan` for the follow-up head before fresh final validation.

## Final Validation And Completion Tasks

- [ ] **T016 — Re-freeze cycle evidence.** PR #216 remains the only cycle PR. After T015, record the new effective content head, exact current head, acceptance/check/review/conflict evidence, all four resolved review threads, feedback disposition, process-memory currency, and cleanup disposition. The earlier freeze at `e8b788aa797909e8ff0ffee63af63a736c199d7a` is historical and cannot support fresh validation.

- [ ] **T017 — Fresh final Architect validation.** The pass for `44189024867c12267b264bcaf0cec8ceadf52a5e` is stale because native review exposed missing machine-readable dispositions/guards after both role validations. After T015–T016 are current, Architect validates the new effective content head and appends a later pass under `## Final Architect Validation Notes`; maximum 10 returns.

- [ ] **T018 — Fresh final Analyst validation after T017.** The prior Analyst pass is stale. Analyst validates customer intent only after the fresh Architect pass, then appends matching effective-head markers in `feature-request.md`. Gaps return to Architect disposition; maximum 5 returns.

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
- Historical exact-head required checks: all five required checks passed on head `e8b788aa797909e8ff0ffee63af63a736c199d7a`; T015b requires a fresh result after follow-up.
- Historical review: independent Codex review passed on `e8b788aa797909e8ff0ffee63af63a736c199d7a`; native AI Review later opened R050-001 through R050-004 on `03a865683f8dfbad63e0dbb8a4db7002960fc2bf`, so fresh review is required.

## Cycle PR Set

| Purpose | Branch | PR | Head SHA | Status | Included in final validation |
|---|---|---|---|---|---|
| Security baseline refresh | `codex/050-security-baseline-refresh` | [#216](https://github.com/cucumberfalse/cabadrive/pull/216) | new effective content `e7cd034ff6826a39be50547a2c4f4cacee3a27b1`; later current head is evidence-only from this marker commit onward | open; four accepted corrections pushed; parser verification, thread resolution, and fresh exact-head gates pending | yes, after fresh validation |

PR #214 and PR #215 are sequencing dependencies only and are not part of this cycle PR set.

## Decisions

- **One PR:** accepted; lock graph and evidence are one atomic change.
- **Lockfile-only ordinary resolution first:** accepted; no override is planned.
- **Six names / seven version lines:** accepted; every threshold is independently mandatory, including both brace majors.
- **No test-code change:** accepted; proportional verification is negative baseline, graph/diff audit, frozen install, full preflight, exact-head OSV, and review.

## Dead Ends

- Initial sandboxed resolver execution could not create pnpm's temporary file and exited with `EPERM` before modifying the lock. The exact same Architect-approved command succeeded after approved access; this was an environment permission failure, not a resolver or dependency dead end.

## Known Issues

- None.

## Implementation Agent Feedback

- No Implementation Agent feedback.

## Architect Dispositions

- **R050-001 / thread r4040207480 — accepted.** The backtick-wrapped effective-head marker is not parsed. T015 must make the reviewed line no longer claim to be the active marker; after the correction commit exists, add a standalone bare `Effective content head: <40-hex-sha>` line for that new correction head. The matching Architect and Analyst markers must use the same bare SHA.
- **R050-002 / thread r4040207488 — accepted.** T019 remains open until after the fresh Analyst evidence commit. Re-run exact-head checks/review and record a `Current-PR-head read-only guard:` line that explicitly references the new effective content head, identifies the exact checked PR head, confirms the intervening diff is final-validation evidence only, and states mergeability/thread/check status. Then require a no-blocker exact-head finalizer dry run.
- **R050-003 / thread r4040207495 — accepted.** The empty known-issues section uses the exact recognized marker `None`; explanatory workflow text belongs in tasks/decisions, not in the marker.
- **R050-004 / thread r4040207504 — accepted.** Use the exact heading `## Implementation Agent Feedback` and the exact recognized marker `No Implementation Agent feedback.` Keep review dispositions in this separate Architect-owned section.

## Final Validation Evidence

- Architect validation: stale after accepted review/process-memory corrections; fresh validation required for the new effective content head.
- Architect return count: 1
- Analyst validation: stale after accepted review/process-memory corrections; fresh validation required after Architect passes.
- Analyst return count: 0
- Final-validation evidence-only commit: relative to `e7cd034ff6826a39be50547a2c4f4cacee3a27b1`, this later commit adds only `tasks.md` evidence for the bare effective-head marker and correction classification; it changes no dependency graph, product behavior, validation disposition, or acceptance requirement.
- Current-PR-head read-only guard: not satisfied for the post-review current head; T019 remains open.
- Analyst feedback Architect disposition: none.
- Limit escalation: none.

## Final Architect Validation Notes

The prior pass below is superseded. Populate a later pass only when Orchestrator explicitly re-invokes final Architect validation after T015–T016, review, checks, and feedback dispositions are current.

- Architect validation pass: failed
- Architect return count: 1
- Final Architect validation completed at: 2026-09-18T19:05:50Z
- Architect gaps: R050-001 through R050-004 require implementation and fresh exact-head evidence before revalidation.
