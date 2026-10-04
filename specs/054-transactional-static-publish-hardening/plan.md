# Implementation Plan: Transactional static-publish and legacy-handoff hardening

## Delivery Shape

- Existing stacked slice: branch `codex/051-asset-retention`, PR #217, worktree `/Users/chap/devel/cabadrive-worktrees/051-asset-retention`.
- Recorded stacked base: `5e5f4ef40336fc7bff2c400b6301d99fbc9479c1`.
- Expected implementation surface: `scripts/stage-static-release.mjs`, `scripts/export-static-release.sh` only if host triage remains necessary, focused staging/export/Docker tests, narrowly affected deployment docs, and feature-054 memory.
- Preserve the uncommitted F052 post-limit disposition, Analyst intake, sibling changes, and all external branch/PR state. Stage only assigned files.

## Phase 1 — Test-First Baselines

1. Confirm branch/worktree/head, dirty-file ownership, stacked-base relation, and allowed file boundary.
2. Archive or otherwise isolate the assigned pre-fix behavior for negative-baseline runs without touching sibling work.
3. Add a transaction-order test with current A, candidate B, serving output, and physical destination. Assert the existing path selects B before a later destination-publication fault.
4. Add marker controls proving the existing pathname read follows a readable symlink and can block on a FIFO; use bounded subprocess/injected adapters so the suite cannot hang.
5. Add current controls proving regular directory/file acceptance and dangling-symlink classification behavior, plus deterministic substitution between classification and use.
6. Record exact failing commands/results before implementation.

## Phase 2 — One Transaction Coordinator

1. Refactor the existing stage/publish/export internals into preparation, publication, and activation operations callable while one project-scoped lock remains held. Avoid nested independent commits.
2. Extend the existing publish journal rather than adding a parallel journal. Bind it to:
   - schema/transaction ID and exact request paths;
   - prior current A or verified empty state;
   - candidate B manifest/release ID and legacy request;
   - prior and expected retained inventories;
   - serving-output inventory/path and physical destination inventory/path; and
   - explicit durable phases through `prepared`, `output-durable`, `export-durable`, and activation/clear.
3. Prepare B and journal-owned immutable evidence without changing `current` or publishing a new authoritative retained tuple.
4. Publish and durably sync the serving output, then publish and durably sync the physical destination. Revalidate exact journal relations after every already-visible crash boundary.
5. Only after `export-durable`, commit the retained/release tuple and invoke rollback-capable `makeCurrent` for B. Clear the journal after the complete committed tuple and outputs revalidate.
6. Keep idempotent completed-output behavior, no-replace destination semantics, and clean/legacy export success.

## Phase 3 — Fault And Recovery Matrix

Inject deterministic faults at every directly relevant boundary:

- serving/destination copy and digest verification;
- nested file/tree sync and close;
- transaction journal write/rename/directory sync;
- serving-output and physical-destination reservation/rename/no-replace;
- serving-output and destination parent sync;
- phase transition before/after durability; and
- immediately before and during current activation.

For every pre-activation failure prove nonzero exit, A still current, prior tuple valid, no partial public tree/destination, no B activation, and only exact contained journal-owned recovery evidence. Then prove unchanged retry succeeds and changed A/B/C/request/output/destination/journal/inventory fails unchanged.

## Phase 4 — Marker And Current Authority

1. Add a reusable descriptor-bound JSON reader for authority files. Open the marker no-follow/nonblocking, require descriptor `fstat` regular-file type, read from that descriptor, and reject read/metadata/identity failures.
2. Replace marker pathname read in `verifyLegacyHandoff`; preserve canonical manifest comparison and strict invalid-handoff result.
3. Add an authoritative `current` classifier at the stager boundary:
   - no entry: verified clean/no-legacy result;
   - symlink: capture and identity-revalidate its link target, then resolve/validate that pinned target;
   - any non-symlink: fail before mutation.
4. Keep lightweight host-shell triage only if needed for argument construction; stager classification remains authoritative. Never use followed-path `-e` alone to decide absence.
5. Exercise stable and substitution-race matrices for marker/current. Verify FIFO prompt termination, dangling strict rejection, and untouched external/sibling sentinels.

## Phase 5 — Documentation And Local Verification

1. Update only the static-export/Docker runtime docs needed to state output-before-activation ordering, exact retry behavior, and absent/symlink/non-symlink handoff semantics.
2. Run shell syntax and focused staging/export/capture/static-host tests.
3. Run typecheck, lint, format check, quality-fast, feature-memory/repository guards, and `git diff --check`.
4. Run full `pnpm run preflight` on the final implementation content.
5. Run the isolated real Docker lifecycle with a unique project/port and scoped teardown.
6. Record exact operation traces, fault/type matrices, changed-file/diff audit, dead ends, decisions, known issues, and Implementation Agent feedback in `tasks.md`.

## Phase 6 — Review, Validation, And Merge Gates

1. Review Agent inspects only the bounded feature-054 diff: transaction order/recovery, no-follow descriptor binding, current identity pinning, regressions, docs, and process compliance.
2. Orchestrator enumerates all native review pages/threads and routes each finding or Implementation Agent feedback item for Architect disposition.
3. Establish one renewed effective content head containing implementation, tests, docs, feature memory, and all follow-up fixes/dispositions.
4. Require all configured checks green, complete no-blocker review/thread state, conflict-free PR #217, and current acceptance evidence.
5. Orchestrator invokes final Architect validation across the combined F051/F052/F053/F054 cycle, then final Analyst validation on the same effective head.
6. Perform the evidence-only current-head guard and conservative expected-head finalization. If a helper cannot enumerate the long review history, complete paginated read-only guards remain mandatory before the authorized manual squash path.

## Verification Matrix

| Boundary | Evidence | Pass condition |
|---|---|---|
| Ordering | exact operation trace | output durable < export durable < B current |
| Fault rollback | per-boundary injection matrix | A valid/current; no partial public artifact or B activation |
| Recovery | exact retry and drift matrix | unchanged resumes; any relation drift fails unchanged |
| Marker | descriptor/type/race matrix | same no-follow regular file read; unsafe types reject promptly |
| Current | absent/symlink/non-symlink/race matrix | exact three-way result; dangling rejects downstream |
| Preservation | clean + valid/invalid legacy controls | existing retention/provenance/export contracts remain green |
| Focused quality | targeted and combined suites | all green on implementation head |
| Full quality | `pnpm run preflight` | all phases green |
| Docker | isolated lifecycle | pass with scoped cleanup |
| Review/GitHub | exact-head review and required checks | blocker-free, green, conflict-free |
| Validation | role markers/current-head guard | Architect then Analyst same head; later delta evidence-only |

## Stop Conditions

- A proposed fix activates B before both durability barriers, trusts a complete output without exact journal authority, or weakens A rollback.
- Marker validation uses a pathname read after classification or may block on special files.
- `current` classification collapses dangling symlink into absence or accepts a non-symlink.
- A race test can cause a replacement object to be consumed.
- Implementation requires unrelated behavior or mutating sibling state; return evidence to Orchestrator/Architect instead of broadening scope.
