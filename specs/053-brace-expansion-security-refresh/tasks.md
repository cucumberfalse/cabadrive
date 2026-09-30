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
- Effective content head: pending implementation and follow-up completion.

## Implementation Tasks

- [ ] **T001 — Confirm assignment and preserve parallel state.** Record branch, worktree, exact starting head, verified-base ancestry, dirty-file ownership, and feature-053 allowed files before mutation. Do not stage, restore, clean, or overwrite feature-051/052 or sibling work.
- [ ] **T002 — Capture exact-tool and negative-baseline evidence.** Require pnpm `10.33.0`; record manifest/lock hashes, package-manager/override policy, supplied exact-head OSV failure, both vulnerable/fixed pairs, all `1.1.18`/`5.0.9` lock occurrences, and current recursive ownership.
- [ ] **T003 — Run the ordinary targeted lockfile-only resolution.** First mutation is `corepack pnpm@10.33.0 update --lockfile-only --depth Infinity brace-expansion`. Use no override, owner update, manual lock edit, `--latest`, `--force`, or workflow/security change.
- [ ] **T004 — Audit and narrow the complete diff.** Account for every changed package key, snapshot, integrity value, engine, peer suffix, importer, owner edge, addition, and removal. Require byte-identical `package.json`, stable `minimatch`/toolchain owners, and no unexplained churn.
- [ ] **T005 — Handle exceptional resolution safely.** If either floor is unreachable or any manifest/owner change appears necessary, stop and record failed ordinary evidence, constraints, compatibility, and smallest candidates for Architect disposition. Do not independently add an override or update a parent.
- [ ] **T006 — Prove thresholds and duplicate absence.** Full-lock inspection must show every 1.x occurrence `>=1.1.21`, every 5.x occurrence `>=5.0.12`, and zero lower package keys, snapshots, or dependency edges.
- [ ] **T007 — Prove final ownership and compatibility.** Record recursive `pnpm why` for both lines through their expected owners; inspect engines/peers against Node 20 and Docker; record any mechanically changed metadata.
- [ ] **T008 — Prove frozen determinism.** Hash manifest/lock before and after `corepack pnpm@10.33.0 install --frozen-lockfile`; require success and no rewrite.
- [ ] **T009 — Run focused and full local checks.** Record `git diff --check`, feature-memory check, typecheck, lint, format check, quality-fast, and full `pnpm run preflight` on the final implementation content.
- [ ] **T010 — Run Docker compatibility validation.** Record real build/start/smoke/retained-asset/teardown evidence equivalent to the required `docker-validation` job.
- [ ] **T011 — Record implementation evidence.** Complete the lock audit, changed-file boundary, decisions, dead ends, known issues, Implementation Agent feedback, and exact implementation head. Stage/commit/push only assigned files under Implementation Agent authority; never merge.

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

- Negative baseline: pending implementation.
- Exact pnpm version and resolver command: pending implementation.
- Final thresholds and duplicate search: pending implementation.
- Ownership and compatibility: pending implementation.
- Complete lock diff audit: pending implementation.
- Frozen install and hashes: pending implementation.
- Focused checks and full preflight: pending implementation.
- Docker validation: pending implementation.
- Exact-head GitHub checks/review/conflicts: pending Orchestrator coordination.
- Current-head guard/finalizer: pending after final validations.

## Cycle PR Set

| Purpose | Branch | PR | Starting head | Current/final head | Status | Final-validation inclusion |
|---|---|---|---|---|---|---|
| Feature-053 security refresh contributing to combined feature-051/052/053 delivery | `codex/051-asset-retention` | #217 | `0ab100ebcb4cdb4f19f4bb148675184b7a10b8a5` | Pending | Open; implementation not started | Required |

## Decisions And Dead Ends

- **Decision — ordinary lock-only resolution is the planned mechanism.** The existing graph already has compatible separate major lines and feature 050 proved targeted pnpm resolution can advance them without manifest changes. A new override would add durable policy without evidence of need; parent movement would enlarge the reviewed toolchain surface.
- **Decision — overrides and parent updates are stop-and-disposition exceptions.** If ordinary resolution fails, Implementation Agent records comparative evidence and Architect chooses the smallest compatible exception before further mutation.
- **Decision — no security-policy change.** The failing OSV gate is correct and remains mandatory; only the vulnerable graph is changed.
- **Dead ends:** none at planning time.

## Implementation Agent Feedback

Pending implementation. Every feedback item requires Architect disposition before scope expansion or completion.

## Known Issues

None at planning time.

## Final Validation Evidence

- Architect validation: pending Orchestrator invocation after implementation, review, checks, and dispositions are complete.
- Architect return count: 0.
- Analyst validation: pending and must follow a passing Architect validation.
- Analyst return count: 0.
- Effective content head: pending.
- Final-validation evidence-only delta: pending.
- Current-PR-head read-only guard: pending.
- Limit escalation: none.

## Final Architect Validation Notes

Populate only when Orchestrator explicitly invokes final Architect validation after implementation, review, required checks, feedback disposition, cycle evidence, and combined current-head evidence are complete.
