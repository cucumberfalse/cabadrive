# Implementation Plan: Brace-expansion security refresh

## Delivery Shape

- Use the Orchestrator-approved existing PR #217 fallback: branch `codex/051-asset-retention`, worktree `/Users/chap/devel/cabadrive-worktrees/051-asset-retention`.
- Verified base is `origin/main` `2a92bcfcb7638d1094f33b28e4c2932fb2e4121e`; assigned starting head is `0ab100ebcb4cdb4f19f4bb148675184b7a10b8a5`.
- Expected dependency diff is `pnpm-lock.yaml` only; allowed process diff is `specs/053-brace-expansion-security-refresh/*`.
- Preserve all pre-existing feature-051/052 and parallel dirty state. Implementation stages only its assigned files and does not rewrite, clean, restore, rebase, or merge sibling work.

## Phase 1 — Test-First Baseline

1. Reconfirm assignment, branch, head, dirty-file ownership, verified-base ancestry, and the exact feature-053 file boundary.
2. Require `corepack pnpm@10.33.0 --version` to return exactly `10.33.0`.
3. Record manifest and lockfile hashes, existing package-manager/override/build policy, and the supplied failing exact-head OSV evidence.
4. Search the complete lockfile and record the negative baseline: package keys, snapshots, and owner edges contain `1.1.18` and `5.0.9`.
5. Record current ownership with `corepack pnpm@10.33.0 why brace-expansion --recursive`: 1.x via `minimatch@3.1.5` and ESLint, 5.x via `minimatch@10.2.5` and `@typescript-eslint`.

## Phase 2 — Minimal Ordinary Resolution

The first and expected mutation is:

```bash
corepack pnpm@10.33.0 update --lockfile-only --depth Infinity brace-expansion
```

This reuses the proven feature-050 resolver contract: existing manifest ranges, exact package-manager version, transitive-depth traversal, and lockfile-only output. Do not use `--latest`, `--force`, manual YAML edits, an override, or an owner-package update.

Immediately inspect the complete `package.json`/`pnpm-lock.yaml` diff. Require both floors, no vulnerable duplicate, unchanged importers/manifest/owners, and no unexplained package movement. If the targeted command produces broader churn, restore only feature-053-owned dependency changes through a safe, scoped method and retry a narrower ordinary resolver operation; never discard parallel edits.

If either floor is unreachable or the resolver requires owner/manifest movement, stop without making that exception. Record exact command/output, owner constraint, candidate fixed package metadata, engine/peer compatibility, and comparative diff size. Return to Architect for a choice between the smallest compatible parent patch and a version-line-specific override; blanket override, major movement, and security suppression remain forbidden.

## Phase 3 — Graph, Compatibility, And Determinism

1. Inspect every package key, dependency snapshot, owner edge, integrity value, engine, peer suffix, importer, addition, and removal in the complete dependency diff.
2. Prove all 1.x occurrences are `>=1.1.21`, all 5.x occurrences are `>=5.0.12`, and no lower version survives anywhere.
3. Run final recursive ownership evidence and record both major lines and their complete owners independently.
4. Inspect final package engine/peer metadata against package `engines.node >=20`, CI Node 20, and the Docker build/runtime contract. Stop on incompatibility.
5. Hash `package.json` and `pnpm-lock.yaml`, run `corepack pnpm@10.33.0 install --frozen-lockfile`, then compare hashes and diff. Both dependency files must remain unchanged.
6. Verify `package.json`, `.github/workflows/osv-scan.yml`, `.unicorn-hub/config.json`, and unrelated source/runtime/workflow files are unchanged.

## Phase 4 — Local Verification

On the final implementation content head, run and record:

1. `git diff --check` and the repository feature-memory gate.
2. `pnpm run typecheck`.
3. `pnpm run lint`.
4. `pnpm run format:check`.
5. `pnpm run quality:fast`.
6. `pnpm run preflight`.
7. Applicable real Docker validation: `make build`, `make up`, smoke/retained-asset validation equivalent to the `docker-validation` job, and `make down` even on failure.

Implementation updates `tasks.md` with exact results, diff audit, decisions, dead ends, known issues, and feedback; then commits/pushes only under its assigned authority. It does not merge or coordinate required checks unless Orchestrator separately assigns that action.

## Phase 5 — Exact-Head Review And GitHub Gates

1. Review Agent inspects the exact dependency/process-memory diff, both major lines, duplicate absence, owners, engine/peer compatibility, frozen-install evidence, scope, and unchanged OSV enforcement.
2. Orchestrator routes every finding or Implementation Agent feedback item to Architect for task/ticket/not-needed disposition before follow-up development.
3. After fixes, repeat focused checks, frozen install, full preflight, Docker validation, and review in proportion to the changed head.
4. Require exact-head green `baseline-checks`, `docker-validation`, `guard`, `AI Review`, and `osv-scan`, no unresolved blocking conversation, conflict-free PR #217, and complete process memory.
5. Because PR #217 has a large native-review history, Orchestrator uses complete paginated read-only review/thread guards. A helper pagination refusal may be handled by the already-authorized conservative manual squash-merge path only after equivalent complete guards; gates are never weakened.

## Verification Matrix

| Requirement | Evidence | Pass condition |
|---|---|---|
| Exact resolver | pnpm version and command log | pnpm `10.33.0`, targeted lockfile-only ordinary update |
| Negative baseline | pre-change full-lock search and OSV failure | `1.1.18` and `5.0.9` observed with supplied fixed floors |
| Both floors | post-change full-lock audit | 1.x `>=1.1.21`, 5.x `>=5.0.12`, no lower duplicate |
| Ownership | recursive `pnpm why` | both installed majors and expected owner paths recorded |
| Narrow diff | full manifest/lock inventory | only target and mechanical metadata; manifest unchanged |
| Compatibility | engine/peer inspection, Node 20 and Docker | no incompatible constraint or runtime regression |
| Determinism | frozen install and before/after hashes | succeeds without rewrite |
| Focused quality | typecheck/lint/format/quality-fast | all green |
| Full quality | `pnpm run preflight` | green on implementation content head |
| Docker | real lifecycle validation | build, startup, smoke, retention, teardown pass |
| Security | GitHub `osv-scan` | green on exact current PR head |
| Merge readiness | required checks/review/threads/conflicts | all current and blocker-free |

## Combined Final Validation And Merge Sequence

1. Establish one renewed effective content head containing the lock refresh, feature-053 memory, all follow-up fixes/dispositions, and current combined PR #217 evidence.
2. Obtain exact-head required checks, full paginated review/thread evidence, mergeability, acceptance evidence, and confirmation that feature-051/052 behavior remains covered.
3. Orchestrator invokes final Architect validation. Architect reviews the feature-053 cycle PR set, all tasks/dispositions, architecture, dependency/OSV evidence, the combined feature-051/052/053 PR state, and customer intent; on pass it records the exact effective content head and return count.
4. Only afterward, Orchestrator invokes Analyst final validation against the same effective content head.
5. Any non-evidence change after either pass makes validation stale. Evidence-only commits must contain only recognized role/current-head evidence.
6. Orchestrator performs the current-head guard, proving the effective-to-current delta evidence-only when applicable, then rechecks all five required checks, complete review conversations, conflicts, feedback, process memory, and expected head.
7. Run the conservative finalizer dry-run for PR #217 and feature 053. Merge only when it is blocker-free; if pagination alone prevents the helper from proving a gate, use complete paginated read-only guards and the authorized manual squash merge without reducing any criterion.

## Stop Conditions

- Either safe floor cannot be reached under current ranges.
- Owner movement, manifest change, override, engine/peer incompatibility, or unexplained lock churn appears.
- Frozen install rewrites dependency files.
- Any required check or blocking review state is missing, stale, pending, or red on the exact head.
- Parallel-work ownership is ambiguous or an action would overwrite sibling state.


## Completion-cycle055 Integrated Validation Preparation

Verified214 main1e3507e2363314340eed43c0d77dd3d0acbc92cf is the prerequisite for current217. Preserve both runtime contracts: one server-level cache/header map and unprivileged nginx/gzip from214;217 persistent/state-current/retained-alias/provenance/transaction behavior. New055 owns R1/R2/R3 and R2a/R2b; all original return counts and post-limit histories remain intact. Consolidate fullpreflight, fullOSV/frozen graph and isolated retainedA/B Docker lifecycle plus live root/SW/current+retained assets/content/404 headers/cache/gzip/nonroot evidence. Complete exact-head Review and canonical process preparation precede final content SHA. Then all included051/052/053/054 receive chronological Architect-before-Analyst passes on that same SHA; union evidence checks reuse existing guards per feature without weakening gates. Live full-pagination checks/conversations/conflicts and expected-head finalization precede217 merge.215 and cumulative055 final closure are downstream; this preparation asserts no final pass or merge.
