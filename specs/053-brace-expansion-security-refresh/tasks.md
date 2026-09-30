# Tasks: Brace-expansion security refresh

## Cycle State

- Feature: `053-brace-expansion-security-refresh`.
- Verified base: `2a92bcfcb7638d1094f33b28e4c2932fb2e4121e`.
- Assigned starting head: `0ab100ebcb4cdb4f19f4bb148675184b7a10b8a5`.
- Branch/worktree: `codex/051-asset-retention` / `/Users/chap/devel/cabadrive-worktrees/051-asset-retention`.
- Delivery: one Orchestrator-approved fallback slice in existing PR #217.
- Expected dependency diff: `pnpm-lock.yaml` only.
- Parallel preservation: all pre-existing feature-051/052 changes and sibling state remain outside feature-053 ownership.
- Architect return count: `0 / 10`.
- Analyst return count: `0 / 5`.
- Effective content head: `8f785ed08c16d2202867310f9ad4afab4f40dbdb`.

## Implementation Tasks

- [x] **T001 — Confirm assignment and preserve parallel state.** Record branch, worktree, exact starting head, verified-base ancestry, dirty-file ownership, and feature-053 allowed files before mutation. Do not stage, restore, clean, or overwrite feature-051/052 or sibling work.
- [x] **T002 — Capture exact-tool and negative-baseline evidence.** Require pnpm `10.33.0`; record manifest/lock hashes, package-manager/override policy, supplied exact-head OSV failure, both vulnerable/fixed pairs, all `1.1.18`/`5.0.9` lock occurrences, and current recursive ownership.
- [x] **T003 — Run the ordinary targeted lockfile-only resolution.** First mutation is `corepack pnpm@10.33.0 update --lockfile-only --depth Infinity brace-expansion`. Use no override, owner update, manual lock edit, `--latest`, `--force`, or workflow/security change.
- [x] **T004 — Audit and narrow the complete diff.** Account for every changed package key, snapshot, integrity value, engine, peer suffix, importer, owner edge, addition, and removal. Require byte-identical `package.json`, stable `minimatch`/toolchain owners, and no unexplained churn.
- [x] **T005 — Handle exceptional resolution safely.** Ordinary resolution succeeded without an exception; no manifest, owner, override, or fallback change was needed.
- [x] **T006 — Prove thresholds and duplicate absence.** Full-lock inspection shows only `1.1.21` and `5.0.12`, with no lower package key, snapshot, or owner edge.
- [x] **T007 — Prove final ownership and compatibility.** Recursive ownership and installed metadata confirm the unchanged owner lines and Node 20 compatibility.
- [x] **T008 — Prove frozen determinism.** Manifest and lock hashes remained unchanged across `corepack pnpm@10.33.0 install --frozen-lockfile`.
- [x] **T009 — Run focused and full local checks.** Diff/memory/repository/focused gates and the complete preflight passed on the final implementation content.
- [x] **T010 — Run Docker compatibility validation.** The isolated real Docker retained-asset lifecycle passed and self-cleaned.
- [x] **T011 — Record implementation evidence.** The exact audit, decisions, known issues, feedback, and implementation head are recorded below; implementation commits are ready for the single assigned push and no merge was performed.

## Review And Follow-Up Tasks

- [ ] **T012 — Perform exact-head review.** Review both major lines, duplicate absence, owners, diff accountability, engine/peer compatibility, frozen install, OSV-policy integrity, scope, feature memory, and role boundaries.
- [ ] **T013 — Dispose all findings and feedback.** Orchestrator routes each item to Architect. Record task, follow-up ticket, duplicate, or explicit not-needed rationale; implementation fixes only accepted in-scope tasks and reruns proportional checks.
- [ ] **T014 — Verify exact-head GitHub state.** Require all five checks (`baseline-checks`, `docker-validation`, `guard`, `AI Review`, `osv-scan`) green, complete paginated review/thread inspection blocker-free, PR #217 conflict-free, and process memory current on the exact head.

## Final Validation Tasks

- [ ] **T015 — Establish the renewed effective content head.** Include dependency content, feature-053 process memory, all fixes/dispositions, cycle PR set, acceptance evidence, and combined PR #217 state before role validation.
- [ ] **T016 — Complete final Architect validation.** When explicitly invoked, validate the full feature-053 cycle, all tasks/dispositions/guidance, exact-head dependency and OSV evidence, combined feature-051/052/053 PR state, open task state, process memory, and customer intent. Record pass/timestamp/effective-head markers or increment the return count and return concrete gaps.
- [ ] **T017 — Complete later Analyst validation.** Only after Architect passes, Analyst validates the original security/merge outcome against the same effective content head and records role-owned evidence in `feature-request.md`.
- [ ] **T018 — Run the final current-head guard and finalize.** Prove any post-effective-head delta is evidence-only, recheck all five checks/review/threads/conflicts/feedback/process memory, run expected-head finalizer dry-run, and use conservative protected finalization. Complete paginated guards remain mandatory if helper pagination requires authorized manual squash merge.

## Planned Diff Audit

- Target package keys and snapshots: `brace-expansion` 1.x and 5.x only.
- Expected owner-edge updates: `minimatch@3.1.5 -> brace-expansion` and `minimatch@10.2.5 -> brace-expansion` to the newly resolved compatible patch versions.
- Expected mechanical metadata: new target integrity values and any target package engine/dependency metadata supplied by the resolved releases.
- Importer, manifest, override, direct dependency, owner, workflow, scanner, and unrelated package changes: none expected.
- Any deviation: stop for Architect disposition before scope expansion.

## Verification Evidence

- Negative baseline: assigned head contained package/snapshot/owner references to
  `brace-expansion@1.1.18` and `brace-expansion@5.0.9`; the supplied exact-head
  OSV gate required minimum fixed versions `1.1.21` and `5.0.12`.
- Exact pnpm version and resolver command: `corepack pnpm@10.33.0 --version`
  returned `10.33.0`; the first dependency mutation was exactly `corepack
  pnpm@10.33.0 update --lockfile-only --depth Infinity brace-expansion` and
  completed successfully.
- Final thresholds and duplicate search: complete lock search contains only
  `brace-expansion@1.1.21` and `brace-expansion@5.0.12`, each in its package and
  snapshot key plus one expected owner edge. No vulnerable duplicate survives.
- Ownership and compatibility: recursive `pnpm why` reports 1.1.21 through
  unchanged `minimatch@3.1.5`/ESLint and 5.0.12 through unchanged
  `minimatch@10.2.5`/`@typescript-eslint`. Installed 1.1.21 declares no engine
  or peer constraint; 5.0.12 declares `node: 20 || >=22` and no peer constraint,
  compatible with repository CI and Docker build Node 20.
- Complete lock diff audit: only the two package keys/integrities, two snapshot
  keys, and two owner edges changed. Importers, peer suffixes, owners, other
  packages, and `package.json` are unchanged; no override or workflow/scanner
  change exists.
- Frozen install and hashes: `package.json` remained
  `d3f93e3aa38596e10798866cbcc06f80169a98b549098aecae5e4d83f029ba21`;
  the resolved lock remained
  `9250764a4862dea2f1d9da1c4d601ec224e7e3c0fa36fcacb7dcc52a69d1ea53`
  before and after the frozen install.
- Focused checks and full preflight: F052 capture/staging passed 85/85; shell,
  format, diff, feature-memory and repository gates passed. The permitted full
  preflight rerun passed 643/643 Node tests, build/service-worker generation,
  and 158/158 Playwright tests. An initial sandboxed attempt stopped only on a
  Vite temporary-file `EPERM`, before any product failure.
- Docker validation: `pnpm run test:docker-retention` passed for isolated
  project `cabadrive-retention-72988-1790786393203` and completed teardown.
- Exact-head GitHub checks/review/conflicts: pending Orchestrator coordination.
- Current-head guard/finalizer: pending after final validations.

## Cycle PR Set

| Purpose | Branch | PR | Starting head | Current/final head | Status | Final-validation inclusion |
|---|---|---|---|---|---|---|
| Feature-053 security refresh contributing to combined feature-051/052/053 delivery | `codex/051-asset-retention` | #217 | `0ab100ebcb4cdb4f19f4bb148675184b7a10b8a5` | `8f785ed08c16d2202867310f9ad4afab4f40dbdb` effective content | Open; implementation complete, review/checks pending | Required |

## Decisions And Dead Ends

- **Decision — ordinary lock-only resolution is the planned mechanism.** The existing graph already has compatible separate major lines and feature 050 proved targeted pnpm resolution can advance them without manifest changes. A new override would add durable policy without evidence of need; parent movement would enlarge the reviewed toolchain surface.
- **Decision — overrides and parent updates are stop-and-disposition exceptions.** If ordinary resolution fails, Implementation Agent records comparative evidence and Architect chooses the smallest compatible exception before further mutation.
- **Decision — no security-policy change.** The failing OSV gate is correct and remains mandatory; only the vulnerable graph is changed.
- **Decision — the ordinary resolver is sufficient.** It selected exactly the
  minimum safe patches on both existing major lines with no owner, manifest,
  importer, peer, or unrelated package churn.
- **Dead end — sandbox-only preflight launch.** The first non-permitted
  preflight attempt could not create Vite's worktree-local temporary file. The
  permitted rerun passed completely; no source or configuration change was
  needed.

## Implementation Agent Feedback

No unresolved Implementation Agent feedback. Ordinary resolution stayed inside
the Architect-defined boundary and required no scope expansion.

## Known Issues

No accepted known issue. Exact-head review, GitHub checks, role validation, and
finalization remain required gates rather than implementation defects.

## Final Validation Evidence

- Architect validation: pending Orchestrator invocation after implementation, review, checks, and dispositions are complete.
- Architect return count: 0.
- Analyst validation: pending and must follow a passing Architect validation.
- Analyst return count: 0.
- Effective content head: `8f785ed08c16d2202867310f9ad4afab4f40dbdb`.
- Final-validation evidence-only delta: pending.
- Current-PR-head read-only guard: pending.
- Limit escalation: none.

## Final Architect Validation Notes

Populate only when Orchestrator explicitly invokes final Architect validation after implementation, review, required checks, feedback disposition, cycle evidence, and combined current-head evidence are complete.
