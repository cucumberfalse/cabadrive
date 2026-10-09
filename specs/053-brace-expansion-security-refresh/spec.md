# Spec: Brace-expansion security refresh

## Cycle Context

- Feature: `053-brace-expansion-security-refresh`.
- Verified base: `origin/main` `2a92bcfcb7638d1094f33b28e4c2932fb2e4121e`.
- Assigned starting head: `0ab100ebcb4cdb4f19f4bb148675184b7a10b8a5`.
- Branch/worktree: `codex/051-asset-retention` / `/Users/chap/devel/cabadrive-worktrees/051-asset-retention`.
- Delivery: one Orchestrator-approved fallback slice in existing PR #217 because the newly published advisory blocks that PR and the same vulnerable graph exists on verified `origin/main`.
- Parallel preservation: feature-051/052 changes and every sibling branch, worktree, commit, PR, dirty diff, and process-memory record are outside feature-053 ownership and must be preserved.

## Goal

Restore a truthful exact-head OSV pass for PR #217 with the smallest deterministic pnpm resolution that moves `brace-expansion` 1.x to at least `1.1.21` and 5.x to at least `5.0.12`, without changing product behavior, upgrading their owners unnecessarily, or weakening security enforcement.

## Scope

### In scope

- Resolve both transitive `brace-expansion` major lines under their existing owners using exactly pnpm `10.33.0`.
- Prefer an ordinary targeted lockfile-only update under the existing manifest and owner ranges.
- Audit all package keys, dependency snapshots, integrity values, engine metadata, peer suffixes, importers, additions, removals, and owner edges changed by the resolver.
- Prove final versions and ownership paths, deterministic frozen installation, repository quality, Docker compatibility, exact-head OSV success, and all required PR gates.
- Keep feature-053 implementation, review, validation, and cycle evidence current.

### Out of scope

- App, content, UI, runtime, service-worker, Docker design, asset-retention, or compose-project-provenance changes.
- Broad dependency modernization, `--latest`, `--force`, manual lockfile editing, major toolchain movement, or unrelated cleanup.
- OSV ignores, allowlists, suppressions, path exclusions, workflow/check changes, or branch-protection weakening.
- Changes to ESLint, `@typescript-eslint`, `minimatch@3.1.5`, `minimatch@10.2.5`, other owners, direct ranges, or `package.json` unless ordinary compatible resolution is proven insufficient and Architect first dispositions the exact minimal exception.

## Functional Requirements

1. **FR-1 — independent safe floors.** The final lock graph contains no `brace-expansion` 1.x below `1.1.21` and no 5.x below `5.0.12`. A safe line cannot compensate for a vulnerable duplicate in any package key, dependency snapshot, or owner edge.
2. **FR-2 — ordinary resolution first.** The first mutation is a targeted pnpm 10.33.0 lockfile-only update of `brace-expansion` under existing ranges. No override, direct-owner update, manual YAML edit, `--latest`, or forced resolution is pre-authorized.
3. **FR-3 — lockfile-only expected shape.** Current evidence shows the two existing major lines are already independently owned by `minimatch@3.1.5` and `minimatch@10.2.5`, and the preceding feature-050 refresh successfully advanced them by ordinary compatible resolution. Therefore the planned implementation changes `pnpm-lock.yaml` only, plus feature-053 process memory. `package.json` remains byte-identical.
4. **FR-4 — exceptional mechanism stop.** If ordinary resolution cannot reach either floor, creates an owner conflict, or requires manifest metadata, implementation stops and records the command, resolver output, owner constraint, compatibility evidence, and smallest candidate. An override or parent update requires a new Architect disposition before mutation. Of those exceptional choices, prefer a compatible transitive-parent patch only when it is demonstrably narrower than a version-line override; never use a blanket override or collapse the two major lines.
5. **FR-5 — stable contracts.** Preserve `packageManager: pnpm@10.33.0`, scripts, direct ranges, `onlyBuiltDependencies`, and the existing unrelated `@babel/core: 7.29.6` override. Preserve both `minimatch` owners unless the stop protocol is invoked.
6. **FR-6 — complete diff accountability.** Every changed lock entry is explained as either one of the two target lines or mechanically required metadata. Unexplained package, importer, peer, or owner drift is rejected and the resolver attempt is narrowed.
7. **FR-7 — compatibility and determinism.** Final packages satisfy repository Node 20/Docker environments and introduce no incompatible engine or peer requirement. A pnpm 10.33.0 frozen install succeeds without changing manifest or lockfile hashes.
8. **FR-8 — security integrity.** `.github/workflows/osv-scan.yml`, `.unicorn-hub/config.json`, and security policy remain unchanged. The required GitHub `osv-scan` must pass on the exact current PR head; local inspection alone is supplemental.
9. **FR-9 — regression boundary.** Focused typecheck, lint, format, fast-quality, full preflight, and the real Docker validation applicable to PR #217 pass without modifying feature-051/052 behavior.
10. **FR-10 — review and completion.** Exact-head review covers both lines, full lock diff, compatibility, security-gate integrity, process memory, and scope. All blocking threads are resolved or outdated, PR #217 is conflict-free, and all five required checks are green on the exact head.
11. **FR-11 — renewed final validation.** The dependency mutation supersedes earlier final-validation evidence. Architect validates the full feature-053 cycle and combined PR #217 state first; Analyst validates customer intent second, both against the same effective content head. Any later non-evidence change restarts validation.
12. **FR-12 — current-head guard.** Before merge, Orchestrator proves the current PR head equals the validated effective content head or differs only by parser-accepted final-validation evidence, rechecks checks/review/conflicts/process memory, and runs the conservative expected-head finalizer.

## Acceptance Criteria

- **AC-1:** Negative baseline records `brace-expansion@1.1.18` and `brace-expansion@5.0.9` plus the required floors before mutation.
- **AC-2:** Full-lock inspection proves 1.x `>=1.1.21`, 5.x `>=5.0.12`, and zero lower duplicate package/snapshot/edge occurrences.
- **AC-3:** `corepack pnpm@10.33.0 why brace-expansion --recursive` proves both final versions and paths through `minimatch@3.1.5`/ESLint and `minimatch@10.2.5`/`@typescript-eslint`, unless an approved exception records the new minimal owner.
- **AC-4:** Complete manifest/lock audit explains every changed line; `package.json` is byte-identical and no package outside target/mechanical metadata moves without Architect-approved necessity.
- **AC-5:** Package metadata inspection plus Node 20 and Docker verification establish engine/peer compatibility.
- **AC-6:** Frozen install under pnpm 10.33.0 succeeds and before/after hashes prove no manifest or lock rewrite.
- **AC-7:** `pnpm run typecheck`, `pnpm run lint`, `pnpm run format:check`, `pnpm run quality:fast`, and `pnpm run preflight` pass on the implementation content head.
- **AC-8:** The real Docker lifecycle validation for PR #217 passes, including retained-asset regression coverage already required by `docker-validation`.
- **AC-9:** `baseline-checks`, `docker-validation`, `guard`, `AI Review`, and `osv-scan` are green on the exact current head; review has no unresolved blocking finding and PR #217 is mergeable.
- **AC-10:** The changed-file boundary is limited to `pnpm-lock.yaml` and `specs/053-brace-expansion-security-refresh/*`; any exception is stopped for disposition before implementation.
- **AC-11:** Cycle PR set, implementation feedback/dispositions, known issues, effective content head, final Architect then Analyst validation, return counts, and final current-head guard are recorded before merge.

## Negative Scenarios

- Only one major line is fixed, or a lower duplicate remains anywhere in the lock graph.
- An override or owner upgrade is added although ordinary compatible lock-only resolution works.
- Resolver churn changes unrelated direct/transitive packages, importers, peer suffixes, or owners without a necessary audited relationship.
- The fixed release has a Node/peer constraint incompatible with CI or Docker, or frozen install rewrites dependency files.
- An OSV ignore or workflow/configuration change hides the finding instead of fixing the graph.
- Local quality is green while exact-current-head `osv-scan` is red, missing, queued, skipped, or stale.
- Feature-051/052 or sibling state is overwritten, or earlier validation is reused across the new dependency content.
- A non-evidence commit lands after role validation without renewed validation.

## Architectural Decision

Use a targeted ordinary pnpm 10.33.0 lockfile-only refresh, not an override or transitive-parent update. The current graph already carries distinct compatible 1.x and 5.x lines, and the repository's successful feature-050 precedent demonstrates that the same narrow resolver mechanism updates those transitives without manifest changes. Overrides and owner movement remain stop-and-disposition fallbacks only; choosing either preemptively would add durable manifest policy or toolchain churn without evidence of necessity.

## Evidence Locations

- Implementation commands, graph/diff audit, compatibility, checks, feedback, known issues, cycle PR set, and current-head evidence: `tasks.md`.
- Final Architect validation: Architect-owned section in `tasks.md`.
- Final customer-intent validation: Analyst-owned append-only section in `feature-request.md`, only after Architect passes.
