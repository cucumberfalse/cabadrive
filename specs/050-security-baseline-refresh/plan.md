# Implementation Plan: Minimal dependency security baseline refresh

## Delivery Shape

Use the Analyst-created latest-main handoff as one implementation PR:

- branch: `codex/050-security-baseline-refresh`
- worktree: `/Users/chap/devel/cabadrive-worktrees/050-security-baseline-refresh`
- verified base: `c5520b31922c0e45afd96b2e5877136c1848a541`
- expected product diff: `pnpm-lock.yaml` only
- allowed workflow diff: `specs/050-security-baseline-refresh/*`
- conditional exception: smallest approved `package.json` change only if ordinary compatible resolution is proven unable to meet a threshold

PR #214 and feature 049 / PR #215 remain external sibling cycles. Implementation does not merge, synchronize, rebase, or edit them.

## Phase 1 — Baseline And Negative Proof

1. Confirm worktree, branch, expected feature-memory changes, HEAD, and supplied base; record preservation of parallel work.
2. Run `corepack pnpm@10.33.0 --version`; require exactly `10.33.0` before generating the lockfile.
3. Record hashes of `package.json` and `pnpm-lock.yaml`, `packageManager`, the existing `@babel/core` override, and baseline occurrences for all seven vulnerable version lines.
4. Record the negative baseline: all seven old vulnerable lines are present before the fix. This is the test-first analogue for dependency maintenance.

## Phase 2 — Ordinary Compatible Resolution First

The first mutation attempt is a targeted ordinary resolver operation using pnpm 10.33.0, existing manifest ranges, and lockfile-only mode. Preferred command shape:

```bash
corepack pnpm@10.33.0 update --lockfile-only --depth Infinity \
  baseline-browser-mapping brace-expansion browserslist js-yaml nanoid postcss
```

Record the exact command/output. Do not use `--latest`, `--force`, manual YAML editing, or add an override. If pnpm's package-selection behavior requires a narrower equivalent, record why and preserve the same constraints: ordinary resolver, existing ranges, lockfile-only, only the six affected names.

Immediately inspect:

- `git diff -- package.json pnpm-lock.yaml`;
- all affected package and dependency snapshots;
- added/removed keys, importer changes, peer suffixes, integrity values, and any changed package outside the six names;
- `package.json` stability, especially package manager, scripts, ranges, `onlyBuiltDependencies`, and the existing override.

If ordinary resolution meets all thresholds, continue without a manifest change. If it creates unexplained churn, narrow the ordinary attempt and repeat the audit. If a threshold is unreachable, stop before adding an override and return evidence for Architect disposition.

## Phase 3 — Exceptional Override Protocol

No override is currently planned. An exception may proceed only after all of the following are recorded and Architect accepts it:

1. exact threshold still failing after ordinary compatible resolution;
2. exact attempted command and resolver output;
3. `pnpm why` owner path and parent semver constraint;
4. evidence that the fixed version is compatible with that major line;
5. narrowest selector targeting only the necessary version line;
6. proof existing `@babel/core: 7.29.6` remains intact;
7. updated Architect-owned disposition before implementation.

A blanket override, direct major upgrade, or toolchain migration is outside scope and returns to Orchestrator.

## Phase 4 — Graph, Diff, And Reproducibility Proof

1. Prove these independent bounds: `baseline-browser-mapping >=2.11.0`; `brace-expansion` 1.x `>=1.1.18`; `brace-expansion` 5.x `>=5.0.9`; `browserslist >=4.28.7`; `js-yaml >=4.3.2`; `nanoid >=3.3.18`; `postcss >=8.5.23`.
2. Search all package and dependency snapshots for every old vulnerable version; none may remain.
3. Run final pnpm 10.33 ownership queries for all six names. Record each resolved version and complete owner path; list both `brace-expansion` lines separately.
4. Produce a complete diff inventory. For each changed package outside the six names, record the necessary relationship or remove the drift.
5. Hash `package.json` and `pnpm-lock.yaml`, run `corepack pnpm@10.33.0 install --frozen-lockfile`, then compare hashes and diff. Neither file may change.
6. Verify the changed-file list contains only allowed product/workflow files and no sibling artifacts.

## Phase 5 — Local Verification And PR

1. Run `git diff --check`.
2. Run complete `pnpm run preflight` on the final graph.
3. Update `tasks.md` with exact commands/results, full lock-diff audit, decisions, dead ends, known issues, and Implementation Agent feedback.
4. Under Implementation Agent authority, commit, push, and open exactly one ready PR. Record PR number/URL, branch, full head SHA, and purpose. Do not merge.

## Verification Matrix

| Requirement | Evidence | Pass condition |
|---|---|---|
| Exact tool | `corepack pnpm@10.33.0 --version` | Exactly `10.33.0` |
| Negative baseline | lockfile search before update | Seven vulnerable lines observed |
| Thresholds | final full lockfile audit | Every line meets its bound; old versions absent everywhere |
| Both brace majors | lock entries + ownership query | 1.x and 5.x independently fixed and owned |
| Ownership | final `pnpm why` for all six names | Versions and complete paths recorded |
| Manifest stability | before/after hash and diff | Unchanged absent approved exception |
| Lock accountability | complete lock diff inventory | Every changed snapshot/importer/package explained |
| Determinism | frozen install + hashes/diff | Success with no rewrite |
| Scope | changed-file list against base | Lockfile and feature-050 memory only, plus approved exception if any |
| Repository | `pnpm run preflight` | Full suite green on implementation head |
| Security | GitHub `osv-scan` | Green on exact current PR head |
| Merge readiness | checks/review/current-head guard | Green, resolved, current, conflict-free |

## Review Gates

Review Agent inspects the complete manifest/lock diff, not only headline versions. Review verifies ordinary resolution preceded any exception; both brace lines and all duplicate snapshots are fixed; no lower-than-threshold occurrence remains; every outside package change is necessary; manifest and override stability; frozen-install and ownership evidence; no product/workflow/sibling/security-policy drift; complete feature memory and exact-head evidence. Review Agent reports through the configured contract and edits no files.

Every implementation/review feedback item is routed by Orchestrator to Architect for task, ticket, or explicit not-needed disposition.

## Final Validation And Merge Sequence

1. Orchestrator records the independent cycle PR set and current PR head, required checks, review threads, conflicts, acceptance evidence, feedback dispositions, and effective content head.
2. Architect validates the effective content head, full PR slice, tasks/dispositions, process memory, guidance, and security-baseline intent.
3. Analyst validates customer intent only after Architect passes and records matching effective-content-head evidence in `feature-request.md`.
4. If a later commit is evidence-only, Orchestrator proves no dependency/non-evidence content changed. Any graph/content change invalidates both validations.
5. Orchestrator verifies exact-head green `baseline-checks`, `docker-validation`, `guard`, `AI Review`, and `osv-scan`, no unresolved findings/conflicts, current process memory, cleanup evidence/disposition, then finalizes and merges.
6. Only after merge may Orchestrator synchronize PR #215 and independently PR #214 with updated `main`; those actions are outside this implementation slice.

## Risks And Stop Conditions

- Broad lock churn: narrow the ordinary attempt; do not accept unexplained upgrades.
- Unreachable threshold: stop for Architect disposition; do not silently override or change a direct major.
- Peer/toolchain conflict: return evidence to Orchestrator; do not expand scope.
- Frozen-install rewrite: determinism failed; fix before PR.
- Stale exact-head checks: do not validate or merge.
- Sibling ambiguity: preserve sibling work and stop rather than mutate it.
