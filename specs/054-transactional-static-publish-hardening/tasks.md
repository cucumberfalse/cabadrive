# Tasks: Transactional static-publish and legacy-handoff hardening

## Cycle State

- Feature: `054-transactional-static-publish-hardening`.
- Stacked base: `5e5f4ef40336fc7bff2c400b6301d99fbc9479c1`.
- Branch/worktree: `codex/051-asset-retention` / `/Users/chap/devel/cabadrive-worktrees/051-asset-retention`.
- Contributing PR: #217.
- Delivery: one bounded stacked implementation slice under the documented PR-only fallback.
- Parallel preservation: F052 post-limit evidence, Analyst-owned intake, sibling work, and external PR/branch state must remain untouched outside explicit assignment.
- F054 Architect return count: `1 / 10`.
- F054 Analyst return count: `0 / 5`.
- Effective content head: pending implementation and follow-up completion.

## Setup And Test-First Tasks

- [x] **T054-001 — Confirm assignment and preserve state.** Exact stacked base `5e5f4ef40336fc7bff2c400b6301d99fbc9479c1`, assigned branch/worktree and PR #217 were confirmed. The pre-existing F052 post-limit disposition and all four untracked F054 planning files were preserved.
- [x] **T054-002 — Capture transaction negative baseline.** Parent-head inspection proves old `publishAndExportStaticRelease` called `stageStaticRelease` first, before serving-output build and physical export; accepted finding `r4173773102` records the resulting post-activation export-fault violation. The deterministic A/B fault regression now covers every ordered phase and would observe that old ordering.
- [x] **T054-003 — Capture marker/current negative baseline.** Parent-head inspection proves marker authority used pathname `readJson` and shell current triage used followed `-e || -L`; accepted findings `r4173773104` and `r4173872733` record the symlink/FIFO and non-symlink/dangling gaps. Bounded descriptor/type/substitution regressions are now executable.

## Implementation Tasks

- [x] **T054-004 — Coordinate prepare, publish, export, activate.** `publish-export` now holds one project lock, durably publishes the serving output and physical destination, records `export-durable`, then runs the rollback-capable state activation and clears the journal last.
- [x] **T054-005 — Bind exact recovery.** The existing publish journal now binds prior current/assets, candidate manifest/release, cumulative inventory, legacy-manifest digest, output transaction/path, and physical destination. Coordinator phases accept exact retry only; standalone publish cannot consume a coordinator-owned journal.
- [x] **T054-006 — Complete the publication fault matrix.** New ordered faults plus the existing copy/digest/sync/no-replace/durability suite prove A remains selected until activation, visible recovery artifacts are complete and journal-bound, and exact retry converges.
- [x] **T054-007 — Make marker reading descriptor-bound.** Marker JSON now uses the existing `O_NOFOLLOW | O_NONBLOCK` descriptor helper, `fstat` regular-file/type and inode validation, descriptor read, and post-read path-identity revalidation.
- [x] **T054-008 — Enforce exact current semantics.** Host triage rejects every present non-symlink before Docker. The stager requires a symlink, pins its contained target, validates that target, and revalidates symlink inode/target before use; absence remains the clean no-legacy path and dangling links reject.
- [x] **T054-009 — Update bounded durable docs.** README and backend deployment docs now describe activation-last ordering, exact journal retry, descriptor-bound marker reads, and absent/symlink/non-symlink current semantics.

## Architect Return #1 — Legacy-Aware Promotion Recovery

- Disposition: accepted P1 `r4177166714` as a narrow exact-retry defect on
  reviewed head `3e68f07e22a00db253ad96eca592dcc52c47824e`.
- Evidence: coordinator recovery calls
  `pendingRetainedAssetsMatchCurrentState` without the already pinned
  `legacyValidation`; that helper consequently compares a legacy-aware asset
  promotion journal against an undefined legacy request. An activation-stage
  asset/promotion fault can therefore leave A current, the outer publish
  journal and durable output/export intact, but make the exact retry reject its
  own promotion journal.
- [x] **T054-020 — Preserve pinned legacy identity through promotion retry.**
  Thread the coordinator's already pinned `legacyValidation` through
  `pendingRetainedAssetsMatchCurrentState` and every build/export caller that
  validates a coordinator-owned promotion journal. Add one deterministic
  coordinator regression using a real valid legacy handoff: inject an
  activation-stage retained-asset/promotion fault, prove A remains current and
  both journals/output/export retain the exact recoverable relation, then retry
  the identical request and prove it completes with B current. Keep the change
  limited to this argument plumbing and direct regression; do not alter the
  transaction protocol, authority rules, or unrelated behavior.
  Implementation passes the pinned legacy validation into both build and
  export pending-state checks. The deterministic `after-asset-rename` control
  leaves A current with both exact journals and durable output/export, then the
  identical request recovers the legacy-aware promotion and selects B.

## Verification And Review Tasks

- [x] **T054-010 — Run focused verification.** Focused authority/transaction/wrapper controls and combined export/capture/staging/static-host contracts passed; exact counts are recorded below.
- [x] **T054-011 — Run repository guards and full preflight.** Shell syntax, format, quality-fast, feature-memory/repository gates, `git diff --check`, and the renewed full `pnpm run preflight` passed on return #1 content; preflight completed 655/655 Node tests, the production/service-worker build, and 158/158 Playwright tests.
- [x] **T054-012 — Run isolated real Docker validation.** `pnpm run test:docker-retention` passed the renewed clean and legacy update/export lifecycle with unique project `cabadrive-retention-10658-1791164306953` and scoped teardown.
- [x] **T054-013 — Audit scope and evidence.** The diff is limited to the assigned coordinator/authority code, direct tests, two deployment-doc sections, F052 disposition, and complete F054 memory; no unrelated product or sibling state changed.
- [ ] **T054-014 — Obtain exact-head bounded review.** Review transaction atomicity/recovery, marker descriptor binding, current pointer identity, tests/docs, stacked-scope preservation, and role compliance. Enumerate all native review pages and dispose every finding role-appropriately.

## Final Validation And Merge Tasks

- [ ] **T054-015 — Establish renewed effective content head.** Include all product/test/docs/memory content, follow-up fixes, dispositions, acceptance evidence, and the complete F051/F052/F053/F054 PR #217 cycle set.
- [ ] **T054-016 — Complete final Architect validation.** After implementation, checks, review, and dispositions are complete, validate the full combined cycle, customer intent, task state, process memory, and exact effective head. Return limit: `10`; current count: `1`.
- [ ] **T054-017 — Complete later Analyst validation.** Only after Architect passes, Analyst validates the same effective head against this intake; return limit: `5`; current count: `0`.
- [ ] **T054-018 — Run current-head guard and finalize PR #217.** Prove every later commit evidence-only, recheck all required checks/review threads/conflicts/feedback/process memory, run expected-head conservative finalization, and merge only when blocker-free.
- [ ] **T054-019 — Preserve downstream order.** Only after verified PR #217 merge may Orchestrator synchronize PR #215 to resulting `main`, rerun affected tests/review, and repeat its required validations.

## Planned Fault And Type Matrix

- Serving output: copy, digest, file sync/close, tree/directory sync, reservation/no-replace, rename visibility, parent sync, and journal phase barriers.
- Physical destination: copy, digest, file/tree sync, no-replace rename, parent sync, and post-rename/pre-phase crash.
- Activation: before current, rename/current durability, rollback durability, and journal clear.
- Recovery drift: A/current, B/C candidate, legacy request, retained ledger/walk, output, destination, transaction ID, inventories, missing/extra/foreign/symlinked paths.
- Marker: regular success; readable symlink, dangling symlink, FIFO prompt rejection, directory, socket/device/other type, unreadable, and inode substitution.
- Current: absent clean success; valid symlink; dangling strict rejection; regular file/directory/other non-symlink; symlink/target substitution.

## Decisions And Dead Ends

- **D054-001 — one cycle.** All three findings share one static-export/handoff transaction boundary and remain one feature.
- **D054-002 — activation is final commit.** B preparation may precede publication, but `current` changes only after serving output and physical export are durable.
- **D054-003 — extend, do not replace.** Reuse the existing lock, journal, unique siblings, no-replace publication, sync, and rollback primitives.
- **D054-004 — descriptor-bound marker.** Path classification followed by pathname read is insufficient; the same no-follow descriptor is typed and read.
- **D054-005 — stager owns authoritative current classification.** Shell triage may construct arguments, but the mutating boundary pins and validates the exact symlink target.
- **Dead ends:** none at planning time.

## Implementation Agent Feedback

No unresolved Implementation Agent feedback. The implementation follows the
Architect-defined one-lock/existing-journal design without scope divergence.

## Known Issues

Accepted P1 `r4177166714` is implemented and locally verified as T054-020;
exact-head re-review and originating-thread resolution remain. No unrelated
accepted known issue is recorded.

## Cycle PR Set

| Purpose | Branch | PR | Stacked base | Current/final head | Status | Final-validation inclusion |
|---|---|---|---|---|---|---|
| F054 transactional publish/handoff hardening within combined F051/F052/F053/F054 delivery | `codex/051-asset-retention` | #217 | `5e5f4ef40336fc7bff2c400b6301d99fbc9479c1` | Pending implementation commit | Implementation and local verification complete; exact-head review pending | Required |

## Verification Evidence

- Negative baselines: parent `5e5f4ef4` shows activation first at old
  `publishAndExportStaticRelease`, pathname marker `readJson`, and followed
  `-e || -L` current triage; originating findings are recorded above.
- Transaction trace/fault matrix: the direct control passes across eight
  journal/publication/activation fault points. Every injected failure keeps A
  current; exact retry reaches B only after durable output/export, with ordered
  `export-rename < rename-current` trace when publication occurs on that run.
- Marker/current type and race matrices: valid regular marker/current succeed;
  readable/dangling symlink marker, FIFO (promptly), directory, unreadable mode,
  and inode substitution reject. Current absent/valid symlink succeed; dangling,
  file, directory, deterministic symlink substitution, and deterministic target
  directory replacement reject. External marker sentinel bytes remain unchanged.
- Focused/combined contracts: direct F054 controls passed 4/4, the complete
  staging suite passed 58/58, and combined shell,
  capture, staging, publish/export, docs-command, and Docker runtime contracts
  passed 105/105.
- Return #1 legacy-aware retry: a real authoritative handoff plus injected
  `after-asset-rename` fault preserves A, `publish-pending.json`,
  `retained-assets-pending.json`, and the exact durable output/export; identical
  retry recovers legacy + candidate assets, selects B, and clears both journals.
- Full preflight: passed with 655/655 Node tests, successful production and
  service-worker build, and 158/158 Playwright tests.
- Isolated Docker lifecycle: `pnpm run test:docker-retention` passed with unique
  project `cabadrive-retention-10658-1791164306953` and scoped teardown.
- Exact-head review and required checks: pending Orchestrator coordination.
- Final Architect then Analyst validation: pending.
- Current-head guard/finalizer: pending.

## Final Architect Validation Notes

Populate only when Orchestrator explicitly invokes final Architect validation after implementation, verification, exact-head review, feedback disposition, and combined-cycle evidence are complete.
