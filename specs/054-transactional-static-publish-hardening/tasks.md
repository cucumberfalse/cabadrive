# Tasks: Transactional static-publish and legacy-handoff hardening

## Cycle State

- Feature: `054-transactional-static-publish-hardening`.
- Stacked base: `5e5f4ef40336fc7bff2c400b6301d99fbc9479c1`.
- Branch/worktree: `codex/051-asset-retention` / `/Users/chap/devel/cabadrive-worktrees/051-asset-retention`.
- Contributing PR: #217.
- Delivery: one bounded stacked implementation slice under the documented PR-only fallback.
- Parallel preservation: F052 post-limit evidence, Analyst-owned intake, sibling work, and external PR/branch state must remain untouched outside explicit assignment.
- F054 Architect return count: `6 / 10`.
- F054 Analyst return count: `0 / 5`.
- Effective content head: pending return #6 implementation, exact-head review,
  and renewed ordered role validation. Current head
  `07ccfbaf098fdf04bfb4d1f83f7464038e8a9cb8` and the previously validated
  `4a687f788d1eed2e5dae8f3f7397e8ef8c765064` are historical only.

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

## Architect Return #2 — Consolidated Authority And Transaction Recovery

- Disposition recorded at `2026-10-05T02:05:58Z` after one comprehensive
  subsystem audit. All 13 threads below are accepted as one cohesive package;
  no thread is deferred into a serial Architect return and no unrelated scope
  is authorized.
- `r4177084455`: accept. A newly occupied serving output must be rejected by a
  read-only admission pass before `ensureStateLayout`, lock publication,
  journal creation, retained-state mutation, or other new state.
- `r4177084461`: accept. The retained ledger is authority and must use the same
  no-follow, nonblocking, descriptor-bound regular-file read as other authority
  records.
- `r4177177765`: accept. Standalone publish with legacy input must pass the
  already pinned legacy authority into activation and exact recovery instead
  of silently switching to candidate-only authority.
- `r4177177768`: accept with an explicit execution-policy check. Root-readable
  mode `000` is not application-readable authority; the descriptor metadata
  must require permitted read bits in addition to successful open/type checks.
- `r4180164996`: accept. Transaction scratch and the serving output must live on
  one project-scoped persistent filesystem that survives separate Compose
  `run --rm` invocations; container `/tmp` cannot carry retry authority.
- `r4180164999`: accept. A visible existing physical destination may be resumed
  only when the durable coordinator journal owns that exact path, candidate,
  inventory, legacy request, and phase; otherwise admission rejects it without
  mutation.
- `r4180187493`: accept. Both promotion and publish transaction journals are
  authority files and require stable descriptor-bound reads, not
  `existsSync` followed by pathname JSON reads.
- `r4180187390`: accept. Release marker reads must reject symlink, FIFO, and all
  non-regular types promptly through the shared authority reader.
- `r4180187446`: accept. A missing/invalid destination argument or parent is an
  admission failure before state layout, lock, output, journal, or retained
  mutation.
- `r4180187435`: accept. Immediately before activation and again before journal
  clear, re-read and digest-verify the exact journal-owned serving output and
  physical destination; drift fails while A remains current or while the
  committed terminal tuple remains recoverable, respectively.
- `r4180187644`: accept. Execution-domain authority must be read no-follow,
  nonblocking, regular, stable, and policy-readable before lock acquisition.
- `r4180189586`: accept. If publish-journal unlink becomes visible but its
  directory durability barrier fails, an identical coordinator retry must
  recognize only the exact fully committed output/destination/current/ledger
  tuple, repeat durability, and finish idempotently without adopting foreign
  state.
- `r4180191392`: accept. Journal ownership must distinguish standalone publish
  from coordinated publish-export independently of whether legacy authority is
  present; a standalone legacy journal resumes only through the same standalone
  operation with the same pinned legacy identity.

### Shared primitives and state machine

- One `readAuthorityFile` family is the only reader for the retained ledger,
  release marker, execution-domain record, asset-promotion journal, and static-
  publish journal. It performs no-follow/nonblocking open, descriptor `fstat`,
  regular-file and policy-readable-mode checks, bounded descriptor read,
  descriptor stability check, post-read path identity check, then text/JSON
  parsing. Missing is allowed only where the caller's state machine explicitly
  permits absence; malformed, unreadable, replaced, symlinked, FIFO, directory,
  socket, device, or oversized authority fails closed.
- State `A0 admission` is read-only: validate all required arguments, canonical
  non-overlap, persistent execution domain, legacy authority, destination
  parent, and output/destination occupancy. An occupied visible object is only
  a retry candidate when a stable existing journal plausibly owns its exact
  operation/path; otherwise stop before creating state or a lock.
- State `A1 locked admission` acquires the project lock only after A0, rereads
  every authority with the shared primitive, and requires the exact operation
  kind (`publish` or `publish-export`), candidate, legacy identity, prior state,
  output, destination, inventories, and phase. Any race from A0 fails closed.
- State `A2 prepared` creates the journal and unique temporary tree on the same
  persistent project-scoped filesystem as the serving output. Both survive a
  stopped/removed one-shot container and remain unreferenced until publication.
- States `A3 output-durable` and `A4 export-durable` publish no-replace, verify
  exact inventories, sync each tree and parent, and durably advance the journal.
  Journal-owned existing objects resume these same barriers; foreign objects
  never become authority.
- State `A5 activation-ready` revalidates the serving output, physical
  destination for coordinator operations, journals, pinned legacy, and prior
  current immediately before activation. Only then may B become current.
- State `A6 committed` revalidates the complete output/destination/current/
  ledger/release tuple immediately before journal clear. A visible unlink plus
  failed directory sync is an exact terminal-recovery case: retry proves that
  entire tuple, repeats directory durability, and succeeds idempotently.
- Standalone publish uses the same states without A4, but its explicit journal
  operation kind and legacy identity prevent it from being misclassified as a
  coordinator transaction or candidate-only request.

### Single cohesive implementation package

- [x] **T054-021 — Install shared stable authority readers.** Route retained
  ledger, release marker, execution-domain record, promotion journal, and
  publish journal through the descriptor-bound primitive above. Preserve exact
  caller-specific absence semantics and reject mode `000` even under root.
- [x] **T054-022 — Make admission read-only and exact.** Before state layout or
  lock mutation, require destination and persistent execution-domain arguments,
  parents, non-overlap, authority types, and empty-or-journal-owned output and
  destination. Revalidate the complete admission tuple under the lock.
- [x] **T054-023 — Persist the transaction across `run --rm`.** Put temporary
  serving trees and the serving output on one dedicated project-scoped durable
  mount/filesystem shared by every retry invocation; keep no-replace rename and
  parent-fsync semantics and do not weaken state/output overlap protections.
- [x] **T054-024 — Encode operation and legacy ownership once.** Add an explicit
  journal operation kind and exact pinned legacy identity, and thread them
  through standalone/coordinator build, activation, promotion, export, and
  recovery. Standalone legacy resumes as standalone; coordinator resumes only
  as coordinator.
- [x] **T054-025 — Complete visible-artifact and terminal recovery.** Permit an
  existing destination only as the exact journal-owned coordinator artifact;
  revalidate both published trees before activation and clear; and make visible
  publish-journal unlink failure recover through the exact committed tuple and
  repeated durability barrier.
- [x] **T054-026 — Run one deterministic admission/type/crash/retry matrix.** Use
  shared fixtures and fault hooks to exercise every thread and every operation
  kind as specified below. Each negative case proves no unauthorized state,
  lock, journal, retained asset, current change, output, destination, or
  external/sibling mutation; each exact retry proves convergence.
- [ ] **T054-027 — Renew all gates once after return #6.** Run focused authority/
  admission/transaction/wrapper/ownership tests, complete staging and combined
  contracts, full preflight, isolated sequential-release Docker lifecycle,
  root/unprivileged cleanup control, scope/memory guards, and one exact-head
  bounded Review covering returns #2–#5 plus return #6. Resolve
  the paginated thread set, establish a new effective head, then repeat final
  Architect followed by Analyst validation before current-head finalization.
  The completed review/validation evidence on
  `4a687f788d1eed2e5dae8f3f7397e8ef8c765064` is historical after return #6 and
  must not be reused as current merge authority.

### Deterministic return-#2 matrix

- Admission: missing destination, missing/non-directory/symlinked parent,
  occupied foreign output, occupied foreign destination, exact journal-owned
  output, exact journal-owned destination, path overlap, and replacement
  between read-only and locked admission. New/invalid admission must leave a
  byte-for-byte absent or unchanged state root and publish no lock.
- Authority types for every applicable ledger/marker/domain/journal path:
  regular readable control, mode `000`, readable symlink, dangling symlink,
  FIFO with prompt bounded rejection, directory, socket/device/other type,
  malformed/oversized content, inode replacement during read, and path
  replacement after descriptor read.
- Operation ownership: standalone clean, standalone valid legacy, coordinator
  clean, coordinator valid legacy, and every cross-operation or changed-legacy
  retry. Only exact operation + legacy identity resumes.
- Persistent lifecycle: first `docker compose run --rm` faults in prepared,
  output-visible, output-durable, destination-visible, and export-durable
  phases; a second fresh container observes the same durable scratch/output/
  journal and either resumes exactly or rejects injected drift.
- Visible-artifact drift: mutate/add/remove/symlink serving-output or destination
  entries after publication and at deterministic pre-activation/pre-clear
  hooks. B must not activate on pre-activation drift; committed terminal retry
  must not clear authority on post-activation drift.
- Journal crash points: journal write/rename/parent sync, output/destination
  rename/parent sync, activation/promotion, publish-journal unlink, and
  post-unlink state-directory sync. Exact unchanged retries converge; missing,
  malformed, wrong-type, wrong-operation, wrong-legacy, wrong-candidate, wrong-
  prior-current, or inventory-drift journals reject without mutation.
- Preservation: existing clean/legacy export, standalone publish, append-only
  assets, collision rejection, Compose provenance, security lock graph,
  service-worker/cache behavior, and external/sibling sentinels remain green.

## Architect Return #3 — Ownership, Generation, And Terminal Revalidation

- Disposition recorded at `2026-10-05T16:17:33Z` after terminal review and
  native CI on head `25bc5e7b56ac3bbf19643538103b8bc339d497be`.
  The six technical items below are accepted as one cohesive package layered
  onto the shared return-#2 state machine; no serial per-thread return is
  authorized.
- `r4185040287`: accept. Byte-identical destination contents do not prove that
  the transaction created the visible directory. Exact destination retry must
  require a journal-bound unpredictable ownership nonce/proof written and made
  durable before publication; a foreign identical directory remains foreign.
- `r4185040118` and duplicate `r4184197126`: accept as one finding. A fixed
  persistent `/publish/cabadrive-static-publish` path is valid for only one
  generation and blocks B-after-A export in the same Compose project. Use an
  immutable release/transaction generation path under the persistent publish
  root, bind it in the journal, and retire old generations only after the new
  committed tuple is authoritative.
- `r4186166731`: accept. Read-only A0 checks cannot authorize terminal success.
  The committed-terminal retry must reread/revalidate candidate, pinned legacy,
  serving output, physical destination, current, retained ledger, release tuple,
  ownership proof, and operation identity under the acquired A1 lock before
  repeating durability or reporting success.
- `r4186166813`: accept. An initial `fstat.size` plus unbounded `readFileSync`
  does not impose a hard limit when the inode grows concurrently. Authority
  content must be read in bounded chunks with an absolute `maxBytes + 1` stop,
  followed by the existing stability/path-identity checks.
- `r4180198863`: accept. The host wrapper must resolve the project and classify
  the existing handoff `current` with no-follow semantics before capture can
  replace it. A present wrong-type entry fails unchanged; an absent/symlink
  case may proceed, and capture plus the stager must revalidate authoritative
  state against races.
- Docker CI cleanup failure: accept as a delivery blocker. Root-created files
  in a bind-mounted export must be deterministically handed back to the invoking
  host UID/GID, or cleaned by an equivalently bounded container-owned cleanup,
  while preserving production file modes, no-follow rules, durability, and
  fail-closed behavior.
- `r4184197134`: process-only. It adds no implementation task; reply/resolve it
  only after the renewed exact-head review and ordered Architect/Analyst
  validation evidence exists.

### Return-#3 protocol refinements

- The journal generates and binds a cryptographically unpredictable export
  ownership nonce before destination publication. The temporary destination
  carries a reserved, regular, no-follow ownership record containing that nonce
  and exact operation/candidate/destination identity; it is fsynced with the
  tree. After no-replace publication, a durable state-side receipt binds the
  nonce, destination path/device/inode, and inventory before the internal record
  is removed and the destination is resynced. Recovery accepts either the exact
  pre-receipt internal proof or the exact post-receipt identity, never inventory
  equality alone. User content may not collide with the reserved record, and
  the final exported site does not retain internal transaction metadata.
- The persistent publish mount is a namespace, not one output directory. Each
  candidate/transaction uses an immutable contained generation path bound by
  the journal. Exact retry reuses only that generation; a later release uses a
  different generation even in the same Compose project. Cleanup is
  post-commit, contained, no-follow, and cannot delete the active, journal-
  referenced, or prior rollback generation.
- A0 remains read-only screening. Every path that can return committed-terminal
  success enters A1, holds the project lock, then performs the same full
  candidate/legacy/output/destination/current/ledger/release/proof revalidation
  as activation/clear. Drift between A0 and A1 fails without durability claims
  or mutation.
- `readAuthorityFile` uses fixed-size descriptor reads and stops as soon as
  cumulative bytes exceed the configured maximum. It never allocates or reads
  the remainder of a growing inode; close and stability checks remain mandatory
  on success and failure.
- Wrapper order is: resolve project read-only; no-follow classify `current` as
  absent or symlink and reject every present non-symlink unchanged; capture;
  rebuild/pin legacy arguments; then rely on the stager's authoritative locked
  revalidation. The wrapper classification is an early mutation barrier, not a
  replacement for stager authority.
- For a host bind export, the wrapper supplies validated numeric host UID/GID.
  The stager applies ownership to the completed temporary export without
  following links, preserves declared modes, verifies ownership, and syncs the
  metadata before no-replace publication. If safe ownership handoff is
  unavailable, publication fails before activation. Test teardown remains
  scoped and must succeed for both unprivileged-host and root-container paths.

### Single cohesive return-#3 implementation package

- [x] **T054-028 — Bind destination ownership proof.** Add the reserved durable
  nonce record, state-side identity receipt, and journal fields; require exact
  proof for visible destination retry and committed-terminal recovery, then
  remove internal metadata only after the receipt is durable. Reject foreign
  byte-identical trees, proof collision, missing/malformed/wrong-type proof,
  changed nonce/inode, and proof replacement without mutating A/state/output/
  destination.
- [x] **T054-029 — Use immutable persistent generations.** Derive a contained
  release/transaction generation path under `/publish`, journal it, update the
  wrapper/coordinator interfaces, and perform safe post-commit generation
  retirement. Prove two different releases export sequentially in the same
  Compose project and exact retry still selects its original generation.
- [x] **T054-030 — Revalidate every terminal authority under lock.** Consolidate
  committed-terminal, activation-ready, and pre-clear validation on one locked
  helper covering candidate, legacy, output generation, destination/proof,
  current, ledger, release tuple, operation, and journal. Inject A0-to-A1 drift
  independently for each authority and require fail-closed behavior.
- [x] **T054-031 — Enforce a hard streaming authority bound.** Replace unbounded
  descriptor reads with a capped chunk loop. Deterministically grow the same
  inode beyond the limit after initial `fstat`; prove prompt bounded rejection,
  bounded allocation/read count, stable close, and no downstream mutation.
- [x] **T054-032 — Guard handoff current before capture.** Reorder the wrapper to
  resolve/classify before capture, add regular-file/directory/FIFO/symlink and
  replacement controls, and prove a wrong-type `current` is byte-for-byte
  unchanged with capture/Docker never invoked while valid absence/symlink flows
  retain later stager revalidation.
- [x] **T054-033 — Make export ownership and cleanup deterministic.** Carry
  validated host UID/GID through the Docker wrapper, normalize the complete
  temporary export no-follow before publication, preserve modes/durability, and
  add unprivileged-host deletion plus root-container cleanup regressions. Do not
  broaden permissions or use recursive host deletion as a workaround.
- [x] **T054-034 — Run the unified return-#3 regression matrix.** Cover foreign-
  identical destination rejection and exact nonce retry; sequential A/B
  releases in one Compose project; committed-terminal candidate/legacy/output/
  destination/proof drift under lock; concurrent authority growth beyond the
  hard limit; pre-capture wrong-type `current`; unprivileged and root cleanup;
  and all unchanged return-#2 admission/crash/retry/preservation controls. Then
  hand the complete package to T054-027 for one review/validation cycle.

## Architect Return #4 — Rename-Bound Ownership And Post-Durability Validation

- Disposition recorded at `2026-10-05T18:57:40Z` for exact-head findings on
  `4e4992f6ad760efcd1a17f8e78a335ea8b7cc7bb`. Both P1 findings are accepted as
  one narrow package; they refine return #3 rather than opening serial returns.
- `r4187632471`: accepted. A nonce copied with a recursively cloned foreign
  directory proves only copied bytes, not that the transaction's no-replace
  rename published that directory. Before rename, durably bind the temporary
  root's no-follow device/inode identity to the journal and nonce. Atomic rename
  must preserve that identity at the destination; pre-receipt recovery and
  receipt creation accept only the exact bound inode. A recursive copy has a
  different inode and can never be adopted even when every byte and proof file
  matches.
- `r4187634578`: accepted. A1 validation before `syncTree`/directory fsync does
  not authorize activation or journal clear because the tree can mutate during
  those durability walks. After every output/destination/proof/receipt durability
  operation completes, perform one final exact locked revalidation of candidate,
  pinned legacy, output generation, destination, current, ledger, release tuple,
  operation, nonce proof, and receipt immediately before activation or clear.
  Any drift preserves the journal and fails closed.

### Single cohesive return-#4 package

- [x] **T054-035 — Bind proof to the renamed inode.** Record the temporary
  destination root's no-follow device/inode and ownership nonce durably before
  no-replace rename; require the visible destination to be that same inode
  before accepting the pre-receipt proof or creating the state-side receipt.
  Receipt identity must remain bound to that inode. Reject recursive copy,
  rename-away/replacement, hard-link/type substitution, missing identity, and
  mismatched receipt without adopting or rewriting the foreign destination.
- [x] **T054-036 — Revalidate after all durability walks.** Add one shared final
  locked validation call after output/destination/proof/receipt syncs and
  immediately before `makeCurrent` or journal clear. It must rewalk/digest the
  candidate, output, and destination and revalidate legacy/current/ledger/
  release/operation/proof/receipt identity; it cannot reuse pre-fsync results.
- [x] **T054-037 — Add both deterministic race regressions.** At
  `durability:export-rename`, recursively replace the destination with a foreign
  byte-identical copy including the nonce proof; require rejection because the
  inode differs, A remains current, journals/recovery evidence remain, and an
  exact restored retry succeeds. At deterministic file/directory fsync hooks,
  mutate output and destination after their earlier validation; require the
  post-durability check to fail before activation/clear, preserve A for the
  activation case (and the already committed tuple for clear recovery), retain
  journals, reject drift, and allow exact restoration/retry to converge. Run
  these with all return-#3 ownership/generation/terminal controls before T054-027.

## Architect Return #5 — Rootful/Rootless Ownership Mapping

- Disposition recorded at `2026-10-05T19:28:30Z` for P1 `r4187662928` on
  `7adad3f5f2ec338ffe353e06eb9a1d6f1e6ce1e4`. Accepted as one narrow ownership-
  mapping correction; no permission broadening or unrelated Docker change is
  authorized.
- Root cause: numeric host UID/GID is not necessarily the same numeric identity
  inside the container. In rootless/userns Docker, container UID 0 already maps
  to the invoking host user; `lchown(..., 1000, 1000)` can map the export to a
  subordinate host identity and make cleanup impossible. Rootful Docker still
  needs explicit ownership handback.
- Required mapping contract: the wrapper creates a unique no-follow regular
  mode-`0600` probe owned by the invoking user in the exact bind-mounted export
  parent and passes its nonce/name plus the claimed host UID/GID. Under the same
  mount, the stager stably validates that probe and observes its container-side
  UID/GID. That observed identity is the only ownership target: typically the
  host numeric UID/GID under rootful direct mapping and container effective
  UID/GID under rootless/userns mapping. Unsupported, replaced, wrong-type, or
  contradictory mapping fails before destination publication/activation.
- The wrapper removes only its exact probe through a trap after the container
  returns. Export ownership normalization remains no-follow, preserves all
  production modes, verifies the observed target, and syncs metadata before
  publication. It must never use chmod/world-writable fallback or recursive
  host deletion.
- [x] **T054-038 — Implement and verify mapping-aware ownership handback.** Add
  the exact probe protocol and translate host ownership to the observed
  container identity. Deterministically model rootful (`probe uid/gid == host
  uid/gid`) and rootless/userns (`probe uid/gid == container effective uid/gid`)
  cases, proving rootful handback still occurs and rootless skips an erroneous
  numeric host-ID chown. Cover replaced/symlink/FIFO/wrong-owner probe, invalid
  numeric claims, chown/verification/sync failure, and trap cleanup. Where the
  environment supports each mode, perform an actual export and prove the
  invoking unprivileged host user can delete it; retain the existing bounded
  root-container cleanup control. Run unchanged inode-bound ownership and
  post-durability return-#4 races before T054-027.
- `r4187662934`: process-only. It creates no implementation task and waits for
  renewed exact-head review plus final Architect/Analyst validation evidence.

## Architect Return #6 — Full Pinned Legacy Tuple Revalidation

- Disposition recorded at `2026-10-06T00:44:46Z` for P2 `r4190341948` on
  `07ccfbaf098fdf04bfb4d1f83f7464038e8a9cb8`. Accepted as one narrow authority-
  reuse correction.
- Pointer inode/link target and target-directory identity are necessary but not
  sufficient. Every reuse of pinned legacy authority must rerun the complete
  `verifyLegacyHandoff` contract over the same pinned root: no-follow marker,
  source identity/kind, canonical manifest/inventory, every listed asset's
  regular-file identity/size/digest, absence of added/unlisted assets, and the
  pinned pointer/target identity. The newly verified tuple must exactly equal
  the originally pinned manifest/source tuple.
- Full tuple revalidation is mandatory at locked A1 admission, recovery entry,
  before and after output/destination durability walks, immediately before
  activation, and immediately before journal clear. It may share one helper,
  but no boundary may downgrade to pointer-only revalidation or reuse cached
  inventory/digests. Drift fails closed while preserving the exact journaled
  recovery relation.
- [x] **T054-039 — Revalidate the complete pinned handoff tuple everywhere.**
  Upgrade the pinned authority's revalidation callback/helper and route every
  A1, recovery, pre/post-durability, pre-activation, and pre-clear call through
  it. Add deterministic hooks after read-only admission and during durability
  to add an unlisted legacy asset, remove a listed asset, modify listed bytes,
  and mutate marker/inventory/source metadata while pointer and directory inode
  remain unchanged. Each case must prove fail-closed behavior, A remains current
  before activation, no partial output/destination becomes authoritative,
  journals and external/sibling state remain exact, and restoring the original
  tuple permits an unchanged retry to converge. Run the unchanged returns #1–#5
  regression set, then complete T054-027 once for review and renewed validation.
- Process/validation-only threads remain non-product work and wait for renewed
  final Architect then Analyst evidence on the new effective head.

## Verification And Review Tasks

- [x] **T054-010 — Run focused verification.** Focused authority/transaction/wrapper controls and combined export/capture/staging/static-host contracts passed; exact counts are recorded below.
- [x] **T054-011 — Run repository guards and full preflight.** Shell syntax, format, quality-fast, feature-memory/repository gates, `git diff --check`, and the renewed full `pnpm run preflight` passed on return #1 content; preflight completed 655/655 Node tests, the production/service-worker build, and 158/158 Playwright tests.
- [x] **T054-012 — Run isolated real Docker validation.** `pnpm run test:docker-retention` passed the renewed clean and legacy update/export lifecycle with unique project `cabadrive-retention-10658-1791164306953` and scoped teardown.
- [x] **T054-013 — Audit scope and evidence.** The diff is limited to the assigned coordinator/authority code, direct tests, two deployment-doc sections, F052 disposition, and complete F054 memory; no unrelated product or sibling state changed.
- [x] **T054-014 — Obtain exact-head bounded review.** Exact-head bounded Review passed on `f3f925c883b94327876a9f7c053917afdb56f777` with no finding; this completed evidence is historical after returns #2/#3/#4/#5, whose one renewed review is T054-027.

## Final Validation And Merge Tasks

- [x] **T054-015 — Establish renewed effective content head.** Historical head `4a687f788d1eed2e5dae8f3f7397e8ef8c765064` contained returns #1–#5; return #6 requires a new effective head through T054-027.
- [x] **T054-016 — Complete final Architect validation.** Architect passed the historical head at `2026-10-06T00:38:23Z`; return #6 makes that pass stale. F054 is now at `6 / 10` and F052 remains closed/escalated at `10 / 10`.
- [x] **T054-017 — Complete later Analyst validation.** Analyst passed the historical head at `2026-10-06T00:41:13Z`, return count `0 / 5`; return #6 makes that pass stale and requires renewed ordered role validation through T054-027.
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
- **D054-006 — verify ownership according to the filesystem contract.** The
  exact bind parent carries a unique host-owned mode-0600 probe. Its stable
  no-follow container-side UID/GID must match either the claimed direct host
  mapping or the container effective namespaced mapping, and that observed
  pair alone is the verified handback target. This replaces runtime-name
  inference and works for native, LinuxKit, rootless, and userns mappings.
- **D054-007 — preserve a bound pre-rename temporary.** The coordinator derives
  its export temporary name from the unpredictable journal nonce. Once its
  device/inode is durably journal-bound, a pre-rename fault preserves that
  exact directory for deterministic recovery; retry never recreates or adopts
  a missing or different inode.
- **Dead ends:** the first return-#3 Docker lifecycle correctly failed closed on
  LinuxKit's opaque bind ownership reporting. Treating that report as native
  Linux ownership was rejected; the runtime-scoped fallback above preserves
  strict native behavior and supplies host-side cleanup evidence.

## Implementation Agent Feedback

No unresolved Implementation Agent feedback. The implementation follows the
Architect-defined one-lock/existing-journal design without scope divergence.

## Known Issues

Accepted P2 `r4190341948` is implemented and locally verified through T054-039;
T054-027 exact-head review and renewed validation remain. Returns #1–#5 remain
implemented regression baselines. Process-only threads add no product task and
wait renewed ordered validation evidence.

## Cycle PR Set

| Purpose | Branch | PR | Stacked base | Current/final head | Status | Final-validation inclusion |
|---|---|---|---|---|---|---|
| F054 transactional publish/handoff hardening within combined F051/F052/F053/F054 delivery | `codex/051-asset-retention` | #217 | `5e5f4ef40336fc7bff2c400b6301d99fbc9479c1` | Pending return #6 head; `07ccfbaf098fdf04bfb4d1f83f7464038e8a9cb8` under disposition and `4a687f788d1eed2e5dae8f3f7397e8ef8c765064` historical | Returns #1–#5 complete; full pinned legacy tuple return #6 implementation, exact-head review, and renewed role validation pending | Required |

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
- Exact-head review and required checks: bounded Review passed with no finding;
  all review threads are resolved and supplied guards are green on
  `f3f925c883b94327876a9f7c053917afdb56f777`.
- Final Architect then Analyst validation: Architect passed at
  `2026-10-05T01:43:29Z`; Analyst passed afterward at
  `2026-10-05T01:46:00Z`, return count `0 / 5`, on the same effective head.
- Current-head guard/finalizer: pending.

### Return #2 evidence status

- The prior focused/full/Docker/review/role-validation evidence above remains
  historical evidence for the content it covered, but is not merge authority
  after the accepted return-#2 behavior and durability gaps.
- Shared authority controls passed for readable regular files plus mode `000`,
  readable/dangling symlink, FIFO prompt rejection, directory, Unix socket,
  device, malformed/oversized content, open-time inode replacement, and
  post-read path replacement. Routed ledger, release-marker, execution-domain,
  asset-promotion-journal, and publish-journal controls also passed.
- Admission/ownership/drift controls passed for missing or unsafe destination,
  occupied foreign output/destination, A0-to-A1 replacement, standalone versus
  coordinator kind, changed pinned legacy identity, pre-activation output
  drift, pre-clear destination drift, and visible journal-unlink recovery.
- Focused staging passed `63 / 63`; the combined capture/staging/static-host
  contract passed `104 / 104`. Shell syntax, format, typecheck, lint, diff,
  feature-memory, and repository guards passed.
- Full `pnpm run preflight` passed `660 / 660` Node tests, the production and
  service-worker builds, and `158 / 158` Playwright tests.
- The isolated real Docker lifecycle passed as
  `cabadrive-retention-30621-1791203949262`, including separate first-container
  faults at prepared, output-visible, output-durable, destination-visible, and
  export-durable boundaries, fresh second-container exact retries over
  persistent state and `/publish` volumes, and scoped teardown.
- T054-021 through T054-026 are complete. T054-027 exact-head bounded Review,
  thread resolution, effective-head recording, and renewed Architect-then-
  Analyst validation were not reached because terminal review/native CI
  produced the consolidated return #3 package. Their results are historical
  and T054-027 now follows T054-028 through T054-034.

### Return #3 evidence status

- Terminal review/native CI produced exactly the six technical/CI items in the
  return-#3 disposition; duplicate `r4184197126` is grouped with
  `r4185040118`, and process-only `r4184197134` creates no implementation work.
- Implementation completed at `2026-10-05T18:53:20Z`: unpredictable
  journal-bound destination proofs and durable inode receipts, immutable
  release generations with safe post-commit retirement, locked terminal
  revalidation, hard chunked authority reads, pre-capture current
  classification, and no-follow host ownership handback are present.
- Focused proof collision/type/nonce, inode/candidate/legacy/output/destination/
  current/ledger/release/receipt drift, concurrent growth, wrapper capture-race,
  sequential generation, and cleanup controls passed. The final combined
  capture/staging/static-host contract passed `113 / 113`; `quality:fast`, shell
  syntax, and formatting passed.
- Full `pnpm run preflight` passed `669 / 669` Node tests, production and
  service-worker builds, and `158 / 158` Playwright tests.
- Isolated real Docker lifecycle passed as
  `cabadrive-retention-55908-1791225949317`: all five separate first-container
  crash boundaries recovered in fresh containers over persistent state and
  `/publish`, two different releases published sequentially in the same
  project, and both host exports were removed unprivileged before scoped volume
  teardown.
- All return-#2 and earlier check results remain useful regression baselines but
  cannot authorize merge until the return-#3 commit receives exact-head review,
  thread resolution, and renewed ordered role validation through T054-027.

### Return #6 evidence status

- T054-039 completed on `2026-10-06`: pinned legacy revalidation now reruns the
  entire original root/marker/source/inventory/listed-assets/no-added-assets
  tuple and compares it with the originally pinned manifest at every existing
  A1, recovery, durability, activation, and journal-clear boundary.
- Deterministic A1 controls covered added and removed assets, modified bytes,
  marker inventory, source-id, and source-kind while pointer/root inode stayed
  fixed. Recovery-entry and post-durability mutations preserved A and the exact
  journal; restoring the original tuple allowed the unchanged retry to commit.
  External/sibling sentinels and non-authoritative destinations stayed intact.
- Focused return-#6 controls passed `2 / 2`; the combined staging/static-host
  suite passed `82 / 82`; shell/format/diff/feature-memory/repository guards
  passed.
- Full `pnpm run preflight` passed `675 / 675` Node tests, production and
  service-worker builds, and `158 / 158` Playwright tests.
- Isolated Docker lifecycle passed as
  `cabadrive-retention-8328-1791248030088`, including five fresh-container
  crash retries, sequential releases, ownership handoff, unprivileged cleanup,
  and scoped teardown.
- Returns #1–#5 remain regression baselines only. Merge authority requires
  T054-027 exact-head review/thread resolution and renewed ordered validation.

### Return #5 evidence status

- T054-038 completed at `2026-10-06T00:32:36Z`. The wrapper creates a unique
  host-owned mode-0600 probe in the exact bind parent, holds its inode through
  the container run, and removes only that exact entry. The stager performs
  stable no-follow validation and uses only the observed direct or namespaced
  container identity as the ownership target before no-replace publication.
- Deterministic direct/rootful and effective-identity/rootless mapping models,
  contradictory claims, invalid IDs, symlink/directory/mode/substitution
  tampering, and wrapper trap cleanup passed. The combined staging and static-
  host contract passed `80 / 80`; shell syntax, formatting, diff, feature-memory,
  and repository guards passed.
- Full `pnpm run preflight` passed `673 / 673` Node tests, production and
  service-worker builds, and `158 / 158` Playwright tests.
- Isolated real Docker lifecycle passed as
  `cabadrive-retention-97105-1791246610556`, including five fresh-container
  crash retries, persistent sequential releases, unprivileged host deletion of
  both exports, bounded root cleanup, and scoped teardown.
- Return-#4 and earlier results remain regression baselines only. Merge
  authority requires T054-027 exact-head review/thread resolution and renewed
  ordered role validation on the return-#5 implementation head.

### Return #4 evidence status

- Exact-head findings `r4187632471` and `r4187634578` are accepted together;
  T054-035 through T054-037 completed at `2026-10-05T19:16:27Z`.
- The journal now durably binds nonce plus temporary device/inode before
  no-replace rename. Pre-receipt proof and receipt creation require that same
  visible inode; missing identity, a recursively copied byte-identical proof,
  and foreign replacement reject without adoption. Restoring the exact renamed
  inode converges; an injected post-bind/pre-rename fault also preserves and
  resumes only the nonce-derived journal-bound temporary.
- Shared locked final validation rewalks candidate, pinned legacy, serving
  output, destination, current, ledger, release tuple, operation, proof, and
  receipt after durability walks and immediately before activation or journal
  clear. Deterministic file-fsync output drift preserves A and the journal;
  directory-fsync destination drift preserves the committed tuple and journal;
  exact restoration/retry converges in both cases.
- Focused return-#4 races passed `2 / 2`; the combined capture/staging/wrapper
  suite passed `115 / 115`; `quality:fast`, syntax, format, diff, feature-memory,
  and repository guards passed.
- Full `pnpm run preflight` passed `671 / 671` Node tests, production and
  service-worker builds, and `158 / 158` Playwright tests.
- Isolated real Docker lifecycle passed as
  `cabadrive-retention-85780-1791228206423`, including all five fresh-container
  crash retries, persistent sequential releases, unprivileged host cleanup, and
  scoped teardown.
- Return-#3 results remain regression baselines only. Merge authority still
  requires T054-027 exact-head review/thread resolution and renewed ordered role
  validation on the new implementation head.

## Final Architect Validation Notes

- Architect validation pass: passed
- Final Architect validation completed at: 2026-10-05T01:43:29Z
- Architect validated effective content head: f3f925c883b94327876a9f7c053917afdb56f777
- Architect return counts: F052 `10 / 10` closed through required new-feature
  escalation; F053 `0 / 10`; F054 `1 / 10`.
- Combined-cycle evidence: PR #217 contains the complete F051 retention/cache
  work, F052 provenance and bounded returns, F053 lock-only security refresh,
  and F054 resolution of all three post-limit blockers plus the legacy-aware
  promotion-retry P1. Direct control passed 1/1, staging passed 58/58, combined
  contracts passed 105/105, full preflight passed 655/655 Node tests plus
  build/service-worker and 158/158 Playwright tests, isolated Docker lifecycle
  `cabadrive-retention-10658-1791164306953` passed, guards are green, exact-head
  bounded Review passed, and every routed thread is resolved.
- Customer intent and architecture: activation remains last after both durable
  publications, legacy marker/current authority is fail-closed and no-follow,
  exact legacy-aware recovery now converges, and no unrelated scope or accepted
  issue remains.
- Analyst validation pass: passed
- Final Analyst validation completed at: 2026-10-05T01:46:00Z
- Analyst return count: 0 / 5
- Analyst validated effective content head: f3f925c883b94327876a9f7c053917afdb56f777
- Historical ordered role validation was complete for
  `f3f925c883b94327876a9f7c053917afdb56f777`; return #2 supersedes it for merge
  authority.

## Return #5 Validation Staleness

- Prior Architect validation status: stale due accepted returns #2/#3/#4/#5.
- Prior Analyst validation status: stale due accepted returns #2/#3/#4/#5.
- The passes at `2026-10-05T01:43:29Z` and `2026-10-05T01:46:00Z` on
  `f3f925c883b94327876a9f7c053917afdb56f777` are retained as historical
  evidence only and do not authorize merge.
- F054 Architect return count: `5 / 10`.
- Historical Architect validated effective content head before return #5:
  pending at that time; superseded by the renewed pass below.
- Final Analyst validation: passed after the renewed Architect pass below at
  `2026-10-06T00:41:13Z` on the same effective head.
- Return-#4 implementation/check evidence and reviewed technical head
  `7adad3f5f2ec338ffe353e06eb9a1d6f1e6ce1e4` are superseded for merge authority
  by return #5.
- T054-038 and the review/Architect portions of T054-027 are now complete; this
  historical staleness record no longer blocks the renewed Architect pass below.

## Renewed Final Architect Validation After Return #5

- Architect validation pass: passed
- Final Architect validation completed at: 2026-10-06T00:38:23Z
- Architect validated effective content head: 4a687f788d1eed2e5dae8f3f7397e8ef8c765064
- Architect return counts: F052 `10 / 10` closed through the required F054
  escalation; F053 `0 / 10`; F054 `5 / 10`.
- Cycle coverage: combined PR #217 F051/F052/F053/F054, all F052 dispositions,
  the post-limit feature split, and every F054 return #1–#5 task/disposition.
- Acceptance evidence: full preflight passed `673 / 673` Node tests plus
  production/service-worker builds and `158 / 158` Playwright tests. Isolated
  Docker lifecycle `cabadrive-retention-97105-1791246610556` passed five crash
  retries, sequential releases in one Compose project, rootful/rootless-safe
  ownership handoff, unprivileged cleanup, and scoped teardown. Guards are
  green, exact-head Review passed, and all technical threads are resolved.
- Architectural intent remains satisfied: B activates only after exact durable
  output/export authority; authority reads and retries fail closed; destination
  ownership is rename/inode-bound; terminal validation occurs after durability;
  generation and userns ownership paths converge without permission weakening.
- Analyst validation pass: passed
- Final Analyst validation completed at: 2026-10-06T00:41:13Z
- Analyst return count: 0 / 5
- Analyst validated effective content head: 4a687f788d1eed2e5dae8f3f7397e8ef8c765064
- The historical staleness block above is superseded by the renewed ordered
  passes. Only Orchestrator current-head/check/finalization and downstream PR
  #215 ordering remain pending.

## Return #6 Validation Staleness

- F054 Architect return count: `6 / 10`.
- The Architect pass at `2026-10-06T00:38:23Z` and Analyst pass at
  `2026-10-06T00:41:13Z` on
  `4a687f788d1eed2e5dae8f3f7397e8ef8c765064` are stale for merge authority due
  accepted P2 `r4190341948`.
- Architect validated effective content head: pending T054-039 implementation,
  exact-head Review/thread resolution, and renewed final validation.
- Final Analyst validation is pending only after renewed Architect validation.
- Current-head guard/finalization and downstream PR #215 ordering remain blocked
  until T054-039, T054-027, and renewed ordered role validation are complete.
