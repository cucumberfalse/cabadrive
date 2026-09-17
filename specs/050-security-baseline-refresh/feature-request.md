# Feature Request: Минимальное обновление dependency security baseline

## Intake Metadata

- Feature ID: `050-security-baseline-refresh`
- Intake role: Analyst
- Assigned worktree: `/Users/chap/devel/cabadrive-worktrees/050-security-baseline-refresh`
- Assigned branch: `codex/050-security-baseline-refresh`
- Verified base supplied by Orchestrator: `origin/main` at `c5520b31922c0e45afd96b2e5877136c1848a541`
- Base confirmation at intake: local `HEAD` and `origin/main` both resolve to `c5520b31922c0e45afd96b2e5877136c1848a541`; worktree was clean before this artifact.
- Intake date: 2026-09-17
- Parallel-work warning: PR #214 and feature-049 PR #215 are active sibling work. Preserve their worktrees, branches, commits, dirty diffs, PR state, and process memory; do not mutate or reuse them.
- Analyst scope: create exactly this `feature-request.md`. Do not create `spec.md`, `plan.md`, `tasks.md`; do not edit packages, lockfiles, code, tests, docs, workflows, or sibling state; do not commit, push, open a PR, review, rerun checks, or merge.

## Original Request And Trigger

Orchestrator assigned a new, independent prerequisite work cycle because the required `osv-scan` check blocks both PR #215 and, independently, PR #214. The failures originate from the unchanged dependency baseline on current `main`, not from the product changes in either blocked PR.

The current `pnpm-lock.yaml` contains 13 fixable vulnerabilities affecting seven package names. The supplied OSV evidence identifies these vulnerable locked versions and minimum fixed versions:

| Package | Vulnerable locked version(s) | Minimum fixed version(s) |
|---|---|---|
| `baseline-browser-mapping` | `2.10.25` | `>=2.11.0` |
| `brace-expansion` | `1.1.16`, `5.0.7` | `>=1.1.18`, `>=5.0.9` respectively |
| `browserslist` | `4.28.2` | `>=4.28.7` |
| `js-yaml` | `4.3.0` | `>=4.3.2` |
| `nanoid` | `3.3.12` | `>=3.3.18` |
| `postcss` | `8.5.15` | `>=8.5.23` |

The requested outcome is a minimal, deterministic dependency-baseline refresh from latest verified `main`, merged before feature 049 so PR #215 can synchronize onto a green security baseline.

## Project Context

The mandatory repository memory was already read on the same verified base during the immediately preceding Analyst cycle. Relevant rules remain:

- repository changes land through the Orchestrator-managed spec/PR workflow;
- the default branch must remain deployable;
- changes need testable acceptance evidence, not only an AI summary;
- package management is pinned to `pnpm@10.33.0` in `package.json`;
- required checks include the security check that currently blocks unrelated PRs;
- parallel work must be preserved and updated only through explicit Orchestrator coordination.

This cycle is dependency maintenance only. It must not alter learner-visible behavior, content, runtime contracts, source policy, progress data, service-worker behavior, or feature-049 implementation.

## Observed Local Facts

Read-only inspection on base `c5520b31922c0e45afd96b2e5877136c1848a541` confirmed:

- `package.json` declares `packageManager: pnpm@10.33.0`.
- The existing manifest-level override is only `@babel/core: 7.29.6`; it must be preserved unless Architect records a specific compatibility reason to change it.
- `pnpm-lock.yaml` uses lockfile version `9.0` and repeats each affected package in package snapshots and resolved dependency snapshots.
- The exact vulnerable versions supplied by Orchestrator are present in the current lockfile:
  - `baseline-browser-mapping@2.10.25`
  - `brace-expansion@1.1.16`
  - `brace-expansion@5.0.7`
  - `browserslist@4.28.2`
  - `js-yaml@4.3.0`
  - `nanoid@3.3.12`
  - `postcss@8.5.15`
- The inspected snapshot relationships include `browserslist -> baseline-browser-mapping`, `minimatch@3.1.5 -> brace-expansion@1.1.16`, `minimatch@10.2.5 -> brace-expansion@5.0.7`, and `postcss -> nanoid`. Full ownership paths must be proven with `pnpm why` during implementation rather than inferred from this abbreviated inspection.
- The lockfile already reflects compatible patch/minor movement for several top-level ranges, so the security fix must audit the complete manifest/lock diff and avoid treating all resolver churn as automatically acceptable.

## Problem Statement

The default branch dependency graph has known fixable vulnerabilities. Because every feature PR inherits the same unchanged lockfile, required security checks fail even when a PR does not touch dependencies. Fixing each feature branch separately would duplicate lockfile churn, create avoidable conflicts, and obscure ownership of the security baseline.

A dedicated prerequisite PR should refresh only the affected compatible dependency graph, prove that all known vulnerable occurrences are gone, and merge first. Sibling PRs can then synchronize with the corrected main baseline without bundling unrelated dependency changes into their feature cycles.

## Goal

Produce the smallest deterministic manifest/lock update that resolves all 13 reported vulnerabilities by moving every affected locked occurrence to a non-vulnerable compatible version at or above its supplied fixed threshold, while preserving the existing application behavior and dependency architecture.

## Scope

### In scope

- Resolve the seven affected package names and every vulnerable occurrence listed above.
- Use `pnpm 10.33.0` for all resolution/install operations.
- Prefer ordinary compatible dependency resolution from the existing manifest ranges.
- Change `pnpm-lock.yaml` and, only when necessary for deterministic compatible resolution, the dependency metadata in `package.json`.
- Add a narrowly scoped override only if ordinary compatible resolution cannot reach a fixed version; every override requires exact ownership/compatibility evidence and Architect justification.
- Audit the complete manifest/lock diff for unrelated upgrades, duplicate vulnerable snapshots, peer-resolution changes, and unexpected package additions/removals.
- Verify install reproducibility, dependency ownership/current versions, complete repository preflight, and an exact-head green `osv-scan` required check.
- Update exact quality/security metadata documentation only if an existing governed record is mechanically required to remain truthful; no speculative documentation work.

### Out of scope

- Application code, tests, content, UI, CSS, service worker, runtime behavior, Docker contract, CI workflow logic, or feature-049 files.
- Major upgrades, forced resolutions, broad dependency refreshes, `pnpm update --latest`, framework/toolchain migrations, or unrelated package modernization.
- Adding/removing product dependencies for cleanup or convenience.
- Suppressing, allowlisting, ignoring, or weakening OSV findings/checks.
- Editing generated content, validation evidence unrelated to dependencies, licenses, or attribution unless the actual resolved package set legally requires an exact metadata update.
- Mutating PR #214, PR #215, their branches/worktrees, or treating this prerequisite as part of feature 049's cycle PR set.
- Merging or synchronizing sibling PRs from the Implementation Agent role; Orchestrator coordinates those steps after this prerequisite is merge-ready.

## Functional Requirements

1. **All reported vulnerable occurrences are removed.** The final lock graph contains no occurrence of the seven affected package versions below their corresponding supplied fixed thresholds.
2. **Both brace-expansion lines are fixed independently.** The `1.x` occurrence resolves to at least `1.1.18`; the `5.x` occurrence resolves to at least `5.0.9`. One fixed line does not compensate for leaving the other vulnerable.
3. **Compatible resolution first.** Implementation first attempts the narrowest ordinary pnpm resolution compatible with current direct dependency ranges. It must not introduce an override preemptively.
4. **Overrides are exceptional and narrow.** If a transitive owner cannot select a fixed compatible release, an override may target only the necessary package/version line. The reason, ownership path, failed ordinary approach, and compatibility evidence must be recorded in Architect-owned process memory.
5. **No unrelated upgrade drift.** Any changed package outside the seven names must be a resolver-required transitive consequence of the minimal fix and explicitly audited. Unexplained opportunistic changes are removed from the slice.
6. **Manifest stability.** If lockfile-only compatible resolution is sufficient, `package.json` remains unchanged. If a manifest edit is required, it is limited to the smallest direct range/override change that makes the fixed graph deterministic.
7. **Existing metadata is preserved.** `packageManager: pnpm@10.33.0`, the current package scripts, and unrelated overrides/ranges remain unchanged unless the security resolution proves a conflict.
8. **Behavior remains unchanged.** No application/runtime/content file changes are allowed in the implementation diff, except an exact governed dependency/quality metadata file if Architect demonstrates it is required by the actual resolved graph.

## Acceptance Expectations

Architect must convert these expectations into explicit tasks and evidence locations. Minimum acceptance evidence:

- **Manifest/lock audit:** a complete diff review names every changed package snapshot/importer/override and explains any changed package outside the seven affected names.
- **Threshold proof:** lockfile inspection shows:
  - `baseline-browser-mapping >=2.11.0`
  - `brace-expansion` 1.x `>=1.1.18`
  - `brace-expansion` 5.x `>=5.0.9`
  - `browserslist >=4.28.7`
  - `js-yaml >=4.3.2`
  - `nanoid >=3.3.18`
  - `postcss >=8.5.23`
  and no vulnerable duplicate snapshot remains.
- **Ownership proof:** `pnpm why` output for all seven package names records the resolved versions and owning paths on the final graph. Multiple installed major lines are reported separately where applicable.
- **Deterministic install:** a clean/frozen install using `pnpm 10.33.0` succeeds without modifying `package.json` or `pnpm-lock.yaml` afterward.
- **Repository verification:** full `pnpm run preflight` passes on the implementation head, including content, quality, unit, build, and e2e gates.
- **Security gate:** the required GitHub `osv-scan` check is green on the exact current PR head; a local scan alone is not sufficient completion evidence.
- **Diff boundary:** no app code, tests, content, service worker, workflow logic, or feature-049 files appear in the implementation diff. Feature memory/process evidence remains the expected workflow exception to package/lock-only product changes.
- **Current-head guard:** before merge, Orchestrator confirms the green OSV result and all required checks correspond to the current expected head, not an earlier dependency graph.

## Negative Scenarios

- Updating only the direct/top-level package while a vulnerable duplicate remains elsewhere in `pnpm-lock.yaml` is a failure.
- Fixing only one `brace-expansion` major line is a failure.
- `pnpm install` rewriting the supposedly final frozen lockfile is a failure of determinism.
- A broad resolver command that upgrades unrelated direct dependencies, changes major versions, or produces unexplained lock churn is rejected and must be narrowed without destructive cleanup of sibling work.
- Adding a blanket override when ordinary compatible resolution works is rejected.
- A green local test suite with a red/missing/pending exact-head `osv-scan` does not satisfy completion.
- Editing feature 049 or merging this PR into its cycle PR set is a process violation; this prerequisite remains an independent cycle.

## Assumptions

- The OSV log supplied by Orchestrator is the authoritative vulnerability intake for this cycle; no external research is required.
- Minimum fixed versions are lower bounds, not exact pins. A higher patch/minor release is acceptable only when selected by the narrow compatible graph and audited for scope.
- The affected packages are currently transitive unless final `pnpm why` proves otherwise; implementation decisions must follow the actual graph, not this assumption.
- `pnpm 10.33.0` is available in the implementation environment through the repository's declared package-manager contract.
- Security metadata/doc changes are unnecessary unless an existing exact package inventory or governed check fails after the real resolution. Normal narrative docs do not need an update for a behavior-neutral transitive refresh.
- If ordinary compatible resolution encounters a genuine peer/dependency conflict that would require a major/direct/toolchain change, Implementation Agent stops and returns evidence to Orchestrator for Architect disposition instead of expanding scope.

## Risks And Mitigations

| Risk | Impact | Required mitigation |
|---|---|---|
| Resolver upgrades unrelated transitive packages | Noisy review, regression risk | Audit full lock diff; retain only necessary compatible consequences |
| Vulnerable duplicate remains | OSV stays red | Inspect all snapshots and `pnpm why` every affected name/line |
| Override hides owner incompatibility | Fragile graph | Ordinary resolution first; narrow override with recorded evidence only |
| Lock generated by wrong pnpm version | Non-deterministic CI diff | Use exact `pnpm 10.33.0`; frozen clean install |
| Feature PRs independently carry lock fixes | Conflicts and duplicated ownership | Merge prerequisite first; Orchestrator synchronizes siblings afterward |
| Preflight passes but OSV exact head is stale | False merge readiness | Verify required check SHA against current PR head |

## Relationship To PR #214 And Feature 049 / PR #215

- This is an independent prerequisite work cycle with its own feature memory, branch, PR, checks, final Architect validation, and final Analyst validation.
- It is **not** a contributing PR in feature 049's cycle PR set and must not be counted as feature-049 implementation or acceptance evidence.
- The shared relationship is sequencing only: merge the security-baseline prerequisite first, then Orchestrator synchronizes PR #215 with updated `main` and reruns its exact-head gates. PR #214 may likewise synchronize independently.
- Existing PR #214/#215 commits and state are preserved; no rewrite/rebase/merge action is authorized to Analyst or Implementation Agent by this intake.

## Research

No external research was used. Intake evidence consists of the OSV findings supplied by Orchestrator and read-only inspection of the current manifest/lock graph.

## Role Handoff

- Analyst created only this intake artifact and hands control back to Orchestrator.
- Architect owns `spec.md`, `plan.md`, and `tasks.md`, including the exact narrow resolution strategy, test-first/negative verification, allowed diff, PR cycle record, and any override disposition.
- Implementation Agent works only after full feature memory and explicit isolated worktree/branch/PR assignment. It uses `pnpm 10.33.0`, records commands/evidence and stops on a genuine scope-expanding conflict.
- Review Agent checks the entire manifest/lock diff, all affected occurrences, determinism evidence, and scope boundaries without modifying files.
- Orchestrator coordinates required checks, exact-head OSV proof, final Architect→Analyst validation, merge, sibling synchronization, and cleanup assignment.

## Initial Cycle Context

At intake, no PR exists for feature 050. The Analyst handoff context is branch `codex/050-security-baseline-refresh` in `/Users/chap/devel/cabadrive-worktrees/050-security-baseline-refresh`, based on verified `origin/main` `c5520b31922c0e45afd96b2e5877136c1848a541`. Orchestrator may explicitly continue this latest-main context through Architect planning and assign it as the single implementation PR slice. PR #214 and PR #215 remain external sibling cycles.

## Final Analyst Validation Notes

Append-only Analyst section. Populate only when Orchestrator explicitly invokes final Analyst validation after final Architect validation passes.
