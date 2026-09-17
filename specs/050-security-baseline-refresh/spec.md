# Spec: Minimal dependency security baseline refresh

## Cycle Context

- Feature: `050-security-baseline-refresh`.
- Base: verified `origin/main` `c5520b31922c0e45afd96b2e5877136c1848a541`.
- Branch/worktree: `codex/050-security-baseline-refresh` / `/Users/chap/devel/cabadrive-worktrees/050-security-baseline-refresh`.
- Delivery: one independent prerequisite PR, explicitly authorized by the user.
- PR #214 and feature 049 / PR #215 are sibling cycles. Their worktrees, branches, commits, diffs, PR state, and process memory must not be mutated.

The intake wording says “seven package names”, while its table and the base lockfile contain six names and **seven vulnerable version lines** because `brace-expansion` has separate 1.x and 5.x lines. All seven lines below are independently mandatory.

## Goal

Produce the smallest deterministic pnpm lock-graph refresh that removes every reported vulnerable version while preserving application behavior, dependency architecture, direct dependency ranges, and unrelated metadata. Merge this prerequisite on its own green exact head before Orchestrator synchronizes sibling PRs.

## Scope

### In scope

- Refresh `pnpm-lock.yaml` through ordinary compatible resolution using exactly `pnpm 10.33.0`.
- Keep `package.json` unchanged when ordinary resolution is sufficient.
- If ordinary resolution cannot reach a fixed compatible graph, use only the narrowest evidence-backed manifest range or version-line override after an Architect disposition.
- Audit every importer, package/dependency snapshot, integrity value, peer suffix, addition, removal, and changed transitive package in the complete manifest/lock diff.
- Record final ownership with `pnpm why`, reproducibility with a frozen install, full local preflight, and required exact-head GitHub checks.
- Maintain feature memory and process evidence for this independent cycle.

### Out of scope

- Source, tests, content, UI, styles, service workers, runtime behavior, Docker files, workflow logic, security suppressions, or feature-049 files.
- Major upgrades, `--latest`, broad modernization, forced resolution, framework/toolchain migration, or unrelated dependency cleanup.
- Rewriting, rebasing, merging, or otherwise mutating PR #214, PR #215, or their branches/worktrees.
- Weakening, bypassing, allowlisting, or ignoring `osv-scan` findings.

## Functional Requirements

1. **FR-1 — seven thresholds.** The final graph has no occurrence below:

   | Version line | Minimum |
   |---|---|
   | `baseline-browser-mapping` 2.x | `2.11.0` |
   | `brace-expansion` 1.x | `1.1.18` |
   | `brace-expansion` 5.x | `5.0.9` |
   | `browserslist` 4.x | `4.28.7` |
   | `js-yaml` 4.x | `4.3.2` |
   | `nanoid` 3.x | `3.3.18` |
   | `postcss` 8.x | `8.5.23` |

   A higher compatible patch/minor selected by the ordinary graph is accepted only after diff audit. A fixed occurrence never compensates for a vulnerable duplicate.

2. **FR-2 — both brace lines.** `brace-expansion` 1.x and 5.x are resolved, inspected, owned, and evidenced independently.
3. **FR-3 — compatible resolution first.** The first mutation attempt uses the narrowest ordinary pnpm 10.33 resolver operation against existing ranges and is lockfile-only. No preemptive override, forced major, manual lock editing, or `--latest`.
4. **FR-4 — manifest stability.** `package.json`, including `packageManager: pnpm@10.33.0`, scripts/ranges, `onlyBuiltDependencies`, and existing `@babel/core: 7.29.6` override, remains unchanged unless ordinary resolution is proven insufficient and Architect approves the exact minimal exception.
5. **FR-5 — narrow override exception.** Any override targets only the necessary package/version line and requires recorded ordinary-attempt failure, ownership path, parent constraint, compatibility proof, and Architect disposition before implementation. Blanket overrides are forbidden.
6. **FR-6 — complete diff accountability.** Every changed lock importer, snapshot, checksum, peer suffix, addition, and removal is named. A changed package outside the six affected names must be a proven necessary transitive consequence or be removed.
7. **FR-7 — deterministic graph.** A pnpm 10.33 frozen install succeeds and leaves `package.json` and `pnpm-lock.yaml` unchanged.
8. **FR-8 — ownership proof.** Final `pnpm why` evidence covers all six names and both installed `brace-expansion` major lines, with resolved versions and owning paths.
9. **FR-9 — diff boundary.** No application, test, content, service-worker, Docker, workflow, or sibling feature changes. Only `pnpm-lock.yaml`, an approved minimal `package.json` exception if necessary, and feature-050 process memory may change.
10. **FR-10 — gates.** Full `pnpm run preflight` passes locally. GitHub `baseline-checks`, `docker-validation`, `guard`, `AI Review`, and `osv-scan` are green on the exact current PR head.

## Acceptance Criteria

- **AC-1:** Lock inspection proves all seven thresholds and absence of the seven vulnerable base versions from every lockfile section and duplicate snapshot.
- **AC-2:** `pnpm why` proves final versions and owners for all six package names, reporting both `brace-expansion` major lines separately.
- **AC-3:** Complete manifest/lock diff audit accounts for all churn; `package.json` is unchanged unless an approved exception is recorded.
- **AC-4:** A frozen install with pnpm 10.33 succeeds and before/after hashes or a clean diff prove the manifest and lockfile were not rewritten.
- **AC-5:** `pnpm run preflight` passes on the implementation content head.
- **AC-6:** Required `osv-scan` and all other required checks are green for the exact current PR head; a local scan alone is insufficient.
- **AC-7:** No out-of-scope or sibling-cycle file appears in the implementation diff.
- **AC-8:** Review, feedback dispositions, cycle PR set, effective content head, final Architect validation, later final Analyst validation, and current-head guard are recorded before merge.

## Negative Scenarios

- One `brace-expansion` line is fixed while the other remains vulnerable.
- An old version disappears from one lock section but remains in another snapshot.
- A broad refresh changes unrelated packages without a demonstrated resolver requirement.
- An override is added even though ordinary compatible resolution works.
- Frozen install rewrites the final manifest or lockfile.
- Local preflight is green but exact-head `osv-scan` is red, missing, pending, or stale.
- A non-evidence change lands after final validation without restarting validation.
- This cycle mutates feature 049 or PR #214/#215 state.

## Architectural Decisions

- **One PR:** the graph change and its evidence are one atomic security-baseline update.
- **Lockfile-first:** current direct ranges are presumed compatible; manifest edits are exceptional and evidence-gated.
- **No new test code:** behavior is unchanged. Negative baseline, graph/diff audit, frozen install, full preflight, exact-head OSV, and review are the proportional verification boundaries.
- **Six names / seven lines:** resolves the intake wording mismatch without dropping a threshold.

## Evidence Locations

- Commands, diff inventory, decisions, dead ends, known issues, feedback, cycle PR set, and verification: `tasks.md`.
- Final Architect validation: Architect-owned section in `tasks.md`.
- Final customer-intent validation: Analyst-owned section in `feature-request.md`, only after Architect passes.
