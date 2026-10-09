# Implementation Plan: Append-Only Static Asset Retention

## Delivery Shape

Use the Analyst-created latest-main handoff as one branch and one PR after
explicit Orchestrator assignment. Staging core, Docker wiring, tests, and docs
must land atomically because any partial adoption would claim safe deployment
without enforcing shell-last retention. Before implementation, Orchestrator
re-verifies `origin/main`; if PR #214 has merged, integrate its main result
role-appropriately and preserve its cache/security choices. Never modify PR #214
or PR #215 directly from this worktree.

## Expected Files

- Staging/inventory: narrow modules under `scripts/`, with a Docker-facing CLI
  and test-only fault-injection seams that are unavailable from normal flags.
- Runtime: `Dockerfile`, `docker-compose.yml`, `Makefile`, `nginx.conf`, a narrow
  container entrypoint/config if required, and a narrowly scoped ignored local
  handoff path.
- Tests: focused staging tests, Docker contract tests, a real A/B retained-origin
  browser test, and a destructive-deploy control.
- Docs: Docker runtime, frontend/backend deployment notes, feature inventory,
  and relevant service-worker reliability status. Do not edit feature 049 memory
  or sibling feature folders.
- No new production dependency, backend, cloud provider SDK, or remote service.

## Implementation Sequence

1. **Baseline and red tests**
   - Confirm exact branch/base/status, complete feature memory, single PR slice,
     and parallel-work warning.
   - Add failing inventory/path/collision/idempotence/lock/fault-boundary tests.
   - Add failing browser fixture where legacy A Cache Storage lacks the lazy
     hash and destructive B returns 404.
   - Add failing Docker-contract tests for project-scoped retained state,
     outgoing capture-before-build, stage-before-nginx, and preserved volume.

2. **Canonical inventory and safe path boundary**
   - Implement ordinal normalized manifests with size/SHA-256 and exact walks.
   - Reject symlinks, non-regular files, escape/alias/duplicate paths, mutations
     during hashing, missing/extra files, and unsafe roots.
   - Expose pure/testable functions plus one CLI; avoid shell parsing of
     untrusted paths.

3. **Transactional release staging**
   - Implement the exact state layout and exclusive lock from `spec.md`.
   - Make one stable no-follow lock inode plus a whole-transaction Linux kernel
     advisory lock the production exclusion/liveness mechanism. Keep the owner
     record for durable project/domain diagnostics, not PID-namespace liveness;
     never rename or unlink the canonical inode. Unsupported semantics fail
     closed. Exercise two overlapping stager containers, kill/retry recovery,
     and aliased/uninspectable namespace-local PID identities.
   - Migrate any pre-existing `stage.lock.reclaim` only under acquired kernel
     exclusion and exact no-follow device/inode/generation binding to the stale
     acquisition. Fault quarantine/removal and reject foreign, newer, live-held,
     malformed, unreadable, or symlinked sidecars unchanged.
   - Validate outgoing/current/candidate immutable unions and fail on byte
     collisions before promotion.
   - Stage and rehash transaction bytes, atomically promote new immutable files,
     atomically promote the complete release, then atomically replace `current`.
   - Embed the committed-state marker in the release transaction, publish and
     verify release/metadata/assets first, and keep `current` as the only and
     final atomic activation point.
   - Reconcile exact partial states, including a release promoted before its
     metadata; add a fault point at that boundary and prove retry cannot fail on
     `EEXIST`. A mismatched partial state fails closed and leaves A selected.
   - Validate and promote newly authoritative legacy assets before the
     complete-release/idempotent shortcut; test late handoff append and collision.
   - Maintain a canonical cumulative retained inventory and compare it against
     the exact full `/assets` walk before activation and during authority checks;
     historical corruption/deletion/extra files fail closed.
   - Before the first immutable promotion, persist a durable exact
     asset-promotion journal covering the request inputs, prior ledger, expected
     full inventory and additions. Resume an interrupted first ledger write only
     when the journal and a fresh exact asset walk agree; otherwise fail closed
     without deleting retained bytes or moving `current`.
   - Add an explicit durability barrier: fsync promoted files and every changed
     directory ancestor, innermost-first through the state/transaction root,
     before `current`, then fsync the state directory after pointer rename.
     Injected file, leaf-parent, `/assets`-parent and root sync/close failures
     must preserve the old pointer.
   - Preserve A on every failure. Make retries idempotent; never add asset GC.

4. **Docker-only migration and serving**
   - Add a dedicated stager target/service with Node and candidate `dist`; nginx
     remains the runtime server.
   - Add a project-scoped release-state volume. Resolve the exact Compose project
     and only its `cabadrive` container/image.
   - Define one cwd-independent project key for Compose, capture, volume/image/
     container lookup, handoff, and stager bind. Test unset default and explicit
     isolated values; declare the same default/override as Compose project name.
   - Before choosing that new default, resolve a unique pre-F051 deployment key
     from explicit input or exact checkout-bound Compose labels/historical-name
     resources. Adopt it for capture and B; ambiguity or sibling-only evidence
     fails closed.
   - Before Compose build replaces an existing legacy image, export its
     `/assets/` to the exact project handoff. Support running container and
     stopped-container/prior-image paths; fail if a detected prior release cannot
     be captured. Record source identity.
   - Skip legacy capture only after validating the committed-state marker and
     its complete current/release/metadata/assets tuple. Mere volume or directory
     existence, including an empty/incomplete state, is never authoritative.
   - After verifier rejection, forbid `/state/assets` fallback through a
     container attached to that volume. Preserve a validated handoff, capture an
     independent baked legacy root into a temporary replacement, or fail closed.
     Bind handoff authority to canonical asset inventory, source ID, and source
     kind, all revalidated before reuse.
   - Treat a supplied legacy handoff as mandatory input, not a probe. Validate
     its root, required `assets/` directory, marker/source fields and exact walk
     even when `assets/` is missing or malformed; only omission of the argument
     denotes a clean-install/no-legacy invocation.
   - Publish a newly captured handoff only through a repository-owned no-follow
     atomic rename of a temporary `current` link. Do not use shell `mv` against
     an existing symlink/directory target. Explicitly check every copy, marker,
     link, and rename result so POSIX `set -e`/conditional behavior cannot turn
     a failed marker write into a usable handoff.
   - Before pointer publication, close/fsync every captured file and marker and
     fsync every changed handoff directory bottom-up through the handoff root.
     Fsync the root again after the atomic pointer rename; any unsupported or
     failed barrier leaves the prior handoff authoritative.
   - Make capture and image build distinct fail-fast steps. A nonzero capture
     result must short-circuit the build/replacement command rather than being
     hidden by a shell command list.
   - `make up` runs the stager successfully before replacing/starting nginx.
     Nginx serves shared retained `/assets/` and atomic current shell. `make down`
     preserves the volume. Never inspect/stop/remove another project.

5. **Static publish output**
   - Resolve and reject an existing output destination before staging can mutate
     retained assets, metadata, releases, or `current`; snapshot the full state
     in the negative regression.
   - Reuse the same core to create a complete next publish tree from current +
     candidate. It contains retained A+B immutable assets and only B mutable
     files.
   - Split state preparation from pointer commit. Build, rehash, fsync, and
     atomically rename a temporary sibling output first; only then activate B.
     Pre-output failures keep A/no final output. Exact complete output may resume
     a post-output/pre-current fault only with a matching durable state journal
     whose retained-assets digest still equals both the canonical ledger and a
     fresh exact retained-assets walk; arbitrary/mismatched/stale existing output
     never resumes. A C promotion after B output invalidates B's retry rather
     than selecting a stale A+B output.
   - Make the pre-output durable journal recoverable as a two-state protocol.
     Before rename it must bind one contained canonical temporary sibling and
     exact pre-stage state; after rename it binds the exact final output. On a
     pre-rename retry, require absent destination, exact temporary inventory and
     unchanged candidate/current/ledger/store, repeat durability synchronization,
     then rename once. Any ambiguous or hostile relation fails unchanged.
   - Split the post-rename relation into `renamed-uncommitted` and
     `output-durable`. After rename, fsync the output parent before durably
     advancing the journal. Recovery from the former phase revalidates/re-syncs
     the tree and repeats parent fsync before any stage or `current` operation;
     fault before/at/after that barrier and assert operation ordering.
   - Apply the same recursive ancestor sync barrier to newly created temporary
     and final publish directories; publishing a nested retained hash may not
     treat a synced leaf directory as durable while its parents are unsynced.
   - Document atomic deploy/no-delete requirements and unsupported destructive
     hosts. Do not add a provider-specific adapter.

6. **Executable migration evidence**
   - Build deterministic A/B fixture files with distinct markers and bytes.
   - A uses the historical exclusion and never application-loads the disputed
     hash before deploy. Register the generated historical A worker, reload until
     it controls the document, and assert its Cache Storage miss.
   - Stage B safely and prove the old A request hits retained origin with exact
     bytes/MIME. Run the candidate-only destructive control and prove 404.
   - Exercise collision, interrupted stage, retry, Docker running/stopped legacy
     capture, restart persistence, project isolation, and HTTP smoke.
   - Add an executable isolated Docker lifecycle runner to the normal Docker
     validation command: deploy legacy A, capture/stage B, prove the never-loaded
     A hash, restart, perform `down/up`, exercise the stopped-image path, verify a
     sibling sentinel, and clean up only its unique project/volume/port.
   - Capture candidate B shell/SW identities before deployment; in the Docker
     lifecycle prove exact B files are active and a headless browser reports B's
     worker activated/controlling after deploy, restart, and `down/up`.

7. **Documentation and full verification**
   - Update durable runtime/deployment docs and status without claiming asset
     pruning or provider guarantees.
   - Run focused tests, typecheck/lint/format, complete Node/browser suites,
     production build, isolated Docker A->B/restart smoke, repository/feature
     guards, full preflight, and all required GitHub checks.
   - Record exact commands/results, effective content head, known limitations,
     feedback, cycle PR metadata, and cleanup applicability in `tasks.md`.
   - Resolve every fixture/tool path relative to the checked-out module or
     repository root, execute focused coverage from a temporary unrelated
     working directory, and reject committed checkout-specific absolute paths.

8. **Review, final validation, merge, and dependent handoff**
   - Obtain independent exact-head review and resolve every blocking finding
     through role-appropriate follow-up.
   - Orchestrator invokes final Architect validation, then final Analyst
     validation, then current-head guard and conservative merge.
   - Only after verified merge does Orchestrator synchronize PR #215 with the
     new main and require its corrected faithful fixture, checks, review, and
     fresh final validations.

## Key Decisions

- The entire real `/assets/` namespace is immutable; filename shape is not an
  integrity primitive.
- SHA-256 plus byte length is canonical; same path with different bytes fails.
- Candidate shell selection is an atomic same-filesystem symlink rename after
  asset/release verification. Appending unreferenced B hashes before activation
  is safe; publishing B shell early is not.
- A project-scoped persistent state volume preserves assets across container
  replacement and `make down/up`. Normal workflows never remove it.
- Authority requires `current` to resolve to a verified per-release marker plus
  matching release tree, metadata, cumulative retained inventory, and immutable
  assets; volume existence is never proof and `current` remains the only
  activation commit point.
- Exact partial transaction state is resumable. Byte/manifest disagreement in
  partial state fails closed without selecting B or recapturing over known data.
- Idempotence is evaluated only after this invocation's candidate plus legacy
  union has been collision-checked and promoted.
- Rejected state is not an alternate legacy source through an attached container;
  recovery authority must be independent and handoff replacement is atomic.
- Compose identity is one explicit/default key shared by every migration path,
  never a mixture of cwd basename and configuration fallback.
- The new default applies only after unique legacy-project discovery. Exact
  checkout/config labels or historical-name owned resources establish ancestry;
  ambiguous or sibling-only discovery is a blocker, not an initial install.
- `retained-assets.json` is the canonical cumulative ledger; candidate-only
  membership checks cannot establish historical-store integrity.
- `current` is a crash-durable commit only after file and directory fsync ordering
  completes; unsupported/failed durability operations abort the activation.
- Browser evidence uses real service-worker lifecycle/control from the historical
  generator and current candidate, not a synthetic cache/request approximation.
- Static output publication precedes state activation. Prepared append-only state
  can survive failure, but B `current` cannot precede a complete durable output.
- A pre-build capture bridges the first upgrade from a legacy image that had no
  state volume. Detectable-but-unreadable prior state fails closed.
- A Docker staging service preserves the host Docker-only contract; host Node or
  pnpm is not required.
- Static hosting consumes a complete merged publish tree and atomic/equivalent
  shell switch. Candidate-only destructive upload is unsupported.
- Retention is indefinite in this feature. Storage reclamation is a separate
  correctness problem.
- A static-publish journal binds both the prior A and expected A+B retained
  snapshots plus the prior current release. That makes an interrupted
  publisher's own B additions resumable without admitting foreign state or a
  later shell.
- Publish destination admission is no-follow. `lstat` rather than `exists` is
  the authority, so a dangling symlink is protected user state.
- Cross-container lock exclusion is a kernel lock held on one stable inode for
  the complete transaction. Namespace-local PID/start inspection is not live-
  owner authority. The durable owner record remains project/domain evidence;
  unsupported lock/filesystem semantics fail closed. Legacy compare-and-reclaim
  sidecars are migration evidence and are removed only under kernel exclusion
  with exact no-follow inode/generation binding; ambiguity remains blocked.
- Recovered byte-identical promoted assets still need their file and full
  ancestor durability barriers rerun. Existence is integrity evidence, not
  evidence that directory entries survived a crash.

## Verification Matrix

| Boundary | Evidence | Pass condition |
|---|---|---|
| Manifest/path | focused Node tests | ordinal exact inventory; SHA/size stable; traversal, alias, symlink, duplicate, mutation, missing/extra rejected |
| Collision/idempotence | focused Node tests | equal bytes retry; unequal bytes abort; retained bytes unchanged |
| Transaction | fault-injected tests | every boundary before pointer rename leaves A current; retry succeeds; no retained deletion |
| Durable activation | injected filesystem-operation trace | every new file and each changed directory ancestor (nested leaf, `/assets`, state/transaction root) is fsynced in order before `current`; state dir fsynced after; sync/close failure preserves old pointer |
| Asset-promotion recovery | fault-injected staging tests | durable pre-promotion journal permits only matching subset-to-complete retry after asset rename/ledger-write failure; absent, corrupt, stale, request-mismatched or extra-asset state fails unchanged |
| Cumulative retained integrity | focused staging/verifier tests | every A+B retained entry exactly matches canonical ledger; corrupt/missing/extra old A blocks B and authority |
| State authority | focused capture/staging tests | empty/incomplete volume does not suppress legacy capture; corrupt or mismatched committed state fails closed |
| Late legacy union | focused staging tests | identical candidate plus newly available legacy asset appends before idempotent return; collision changes nothing |
| Project identity | contract + isolated Docker tests | unset and explicit keys agree across Compose, capture, volume, image, handoff, and stager; sibling untouched |
| Legacy project discovery | resolver unit + Docker migration | non-default pre-F051 project is uniquely adopted for A capture and B; ambiguity/mismatched labels/service-only sibling fail untouched |
| Rejected-state source | focused capture + Docker negative | rejected volume is never copied through attached `/state`; preserved handoff/baked root works, no independent source fails unchanged |
| Supplied handoff authority | focused staging negatives | every supplied handoff is validated even when `assets/` is missing/wrong-type/incomplete; failure precedes mutation and omission alone means no legacy input |
| Partial release resume | fault-injected tests | crash after release rename and before metadata resumes without `EEXIST`; exact bytes become one committed tuple |
| Legacy browser | real Chromium A/B | A cache miss proven; safe B stage; old path 200 JS with exact A bytes from origin |
| Legacy worker fidelity | real Chromium + generated A worker | A worker controls page, lazy hash absent from its real precache, controlled safe fetch hits origin, controlled destructive fetch is 404 |
| Destructive negative | isolated browser/server | candidate-only B yields old-path 404 and production staging rejects switch |
| Docker first migration | isolated Compose project | running and stopped legacy A captured before build replacement; B staged before nginx replacement |
| Docker persistence | isolated Compose project | A URL survives B, restart, and `make down/up`; project-scoped sibling untouched |
| Docker lifecycle gate | executable Docker validation | real legacy A -> B capture, cache-miss origin fetch, restart/down-up, stopped-image path, sibling sentinel, exact cleanup all pass |
| Docker B activation | Docker + headless browser | exact candidate B shell/SW served and B worker activated/controlling after deploy, restart, and down/up |
| Portability | temporary-CWD focused/CI test | no checkout-specific absolute paths; capture fixture locates scripts from module/repository root |
| Static publish | focused integration | output contains A+B assets/B shell; collision and incomplete stage fail |
| Existing publish destination | state snapshot integration | pre-existing output fails before stage and leaves pointer/releases/metadata/assets/output byte-identical |
| Static output transaction | fault-injected integration | copy/hash/fsync/rename failure leaves A and no final output; complete-output/pre-current fault resumes only with matching journal and exact output |
| Pre-rename output recovery | crash-style fault integration | exact journal + contained temporary tree + unchanged pre-stage state re-syncs/renames once; missing, hostile, ambiguous, byte/state-drifted relations fail unchanged |
| Post-rename parent durability | ordered crash-style trace | `renamed-uncommitted` retry revalidates output and fsyncs its parent before stage/current; parent-sync failure preserves A and retry repeats the barrier |
| Pending-journal freshness | fault-injected A/B/C integration | B output journal resumes only against the identical retained ledger/assets; a later C asset blocks stale B activation unchanged |
| Pending own-promotion recovery | fault-injected A/B integration | exact journal-known A+B state and prior current resume after B pre-current failure; foreign asset/current/request drift stays unchanged |
| No-follow publish destination | focused static-publish tests | dangling/live symlink, file, and directory are rejected before stage; external sentinel is untouched |
| Crash-stale lock recovery | owner-identity tests | proven-dead/reused-PID-start-mismatch owner is reclaimed only by exact-generation atomic transfer; live matching, malformed, inaccessible, or unsupported owner fails closed |
| Lock identity across recreation | isolated Compose + owner tests | same project keeps its durable execution domain across stager hostnames; acquisition/start identities remain unique; sibling project is foreign |
| Concurrent stale reclaim | adversarial deterministic interleaving | exact-generation CAS admits one reclaimer; stale observer cannot move a replacement lock; maximum critical-section concurrency is one |
| Cross-container exclusion | overlapping real stager containers | a kernel lock on the shared stable inode excludes a second PID namespace; killing the holder releases it; unsupported semantics fail closed without record mutation |
| Orphan reclaim migration | crash/fault + inode-generation tests | exact stale sidecar is durably recovered only under exclusive locks and exact binding; foreign/newer/live/symlinked/malformed evidence stays untouched and blocks |
| Recovery durability barrier | nested fault/retry trace | existing journal-known promoted file is fsynced and `assets/x` → `assets` → `state` is repeated before ledger/release/current |
| Handoff pointer safety | focused capture failure/symlink tests | external `current` symlink target is never traversed; marker/copy/link/rename failures publish no incomplete handoff |
| Handoff durability | ordered capture trace + injected failures | every file/marker and directory through handoff root is fsynced before pointer publication; any close/sync failure leaves old authority |
| Build short-circuit | Make wrapper integration | capture nonzero prevents any image build/replacement invocation and propagates failure |
| HTTP policy | curl/tests | `/assets/` immutable and exact; `sw.js`/HTML current; no HTML fallback for missing hashed asset |
| Quality | repo commands | focused tests, full preflight, build/e2e, Docker smoke, and all required GitHub checks green |
| Process | diff/feature-memory/review | one PR; no sibling memory/state mutation; evidence/docs/current cycle set complete |

## Risks And Mitigations

- Crash during append: stage and hash in transaction, atomic file rename, old
  pointer unchanged, safe idempotent retry.
- Empty/failed-created volume masks legacy A: do not treat storage existence as
  authority; require the validated committed-state tuple before skipping capture.
- Mixed Compose defaults split handoff from the actual volume: use one effective
  project key and cover unset/custom execution outside the canonical directory.
- Applying the new default hides an old basename-derived deployment: resolve and
  adopt one exact legacy project before defaulting; reject multiple candidates.
- Rejected volume is re-imported through its attached container: forbid `/state`
  fallback after verifier rejection and preserve only independent authority.
- Idempotent shortcut skips late legacy input: promote the validated full union
  before returning unchanged.
- Existing publish output is discovered after activation: validate it before any
  staging mutation and snapshot the negative result.
- Buffered writes survive process tests but not host crash: require file and
  directory fsync ordering before/after the atomic pointer and fail on sync error.
- A crash after immutable rename but before the first retained ledger can strand
  valid bytes that an ordinary retry rejects: commit an exact pre-promotion
  recovery journal first, accept only its verified partial subset, and otherwise
  fail closed without deleting retained history.
- Fsyncing `assets/x` does not durably record its entry in `/assets`: traverse
  all changed directory ancestors through the declared transaction root and
  fault-test every barrier before the pointer change.
- Current-candidate-only verification misses corrupt older A: bind authority to
  an exact cumulative ledger and negatively mutate an unreferenced historical file.
- Synthetic fetch/cache fixture bypasses legacy worker semantics: install and
  control the generated historical worker for both safe and destructive cases.
- Retained A success can hide failed B activation: assert exact B shell/SW plus
  B worker control throughout the real Docker lifecycle.
- Static output copy can fail after state activation: prepare without pointer
  commit, atomically publish verified output first, then activate B with an exact
  resume rule for the intervening crash window.
- Output rename can precede its parent-directory durability barrier: persist a
  separate renamed phase and require exact retry to repeat output and parent
  fsync before staging or activation.
- A later stage changes retained assets while an older output journal remains:
  require fresh ledger plus exact-store equality at retry and fail closed rather
  than publishing an output that lacks the later asset.
- A supplied handoff loses `assets/` and is mistaken for optional absence:
  validate any supplied handoff unconditionally and reserve no-legacy behavior
  for an omitted argument.
- A crash persists the publish journal before output rename and leaves a valid
  temporary tree that ordinary retry rejects forever: bind both pre/post-rename
  relations, resume only the exact contained temporary transaction, and fail
  closed on ambiguity or state drift.
- A shell `mv` may treat a `current` symlink to a directory as a destination:
  use a no-follow Node rename and test an external sentinel remains untouched.
- POSIX `set -e` is suppressed for functions used in conditional lists: make
  each handoff publication command return-checked and test marker-write failure.
- B's own partial promotion can make its pending output look stale even though
  no foreign change occurred: bind and admit only the exact journal-known A+B
  retained state and recorded prior current; reject all other drift.
- `existsSync` reports false for a dangling output symlink: use no-follow
  classification so publishing never replaces a user-owned dangling link.
- A crash can leave a stale record forever, while a clock lease or foreign PID
  lookup can steal a live publisher: hold a cross-container kernel lock on a
  stable project-volume inode for the transaction. Never infer liveness from a
  foreign PID namespace; fail closed when kernel/filesystem semantics cannot be
  established.
- A crashed legacy reclaimer can leave `stage.lock.reclaim`: under the new
  kernel exclusion, recover it only when exact no-follow inode and generation
  evidence binds the sidecar to the stale acquisition; preserve and block on
  every ambiguous relation.
- A recreated stager changes hostname even within the same project: derive the
  execution domain from durable project state and the effective Compose key;
  keep hostname non-authoritative.
- Capture can fail before `docker compose build` while a shell `;` returns the
  later build status: short-circuit and test the real Make target with a build
  sentinel.
- A handoff pointer can become durable while nested captured entries are not:
  apply the complete file/directory fsync barrier before pointer publication.
- A failed ancestor fsync followed by a matching destination on retry can skip
  durability: rerun file and ancestor sync for every journal-known promotion
  before any pointer can move.
- Crash after release rename but before metadata: classify and resume exact
  release-only state; reject mismatches and never retry a blind rename over it.
- Concurrent update: exclusive fail-closed lock; stale recovery only through
  exact-generation atomic compare-and-reclaim.
- Hash-looking collision: verify bytes, never trust the name.
- First upgrade after legacy container was removed and old image overwritten:
  impossible to recover; capture is ordered before build replacement and aborts
  when detected prior state cannot be read.
- Volume growth: accepted indefinite retention; no unsafe GC.
- PR #214 overlap: inspect only merged main, preserve sibling PR, and let
  Orchestrator coordinate any conflict.
- Fixture cheats: assert A Cache Storage miss and server-side retained-origin
  request evidence; destructive control must 404.
- Static host lacks atomic/no-delete behavior: mark unsupported, do not soften
  the guarantee.

## Handoff Status

All implementation and review follow-ups are complete at effective content head
`953709f0f12e3ac839c65c074908aef674b74bbd`. Full preflight passed with 630/630
Node tests, production build/service-worker generation, and 158/158 Playwright
tests; GitHub review on that validation head had no open technical finding.
Final Architect validation passed at return count 10/10. Final Analyst
validation subsequently passed at `2026-09-28T11:19:10Z` on the same effective
content head, with return
count 0/5. Review follow-up `r4121580555` then identified a non-evidence
Make-wrapper provenance defect after feature 051 exhausted its return budget;
new feature 052 owns that correction and renewed final validation. Review thread
`r4121580548` is accepted as this Architect-owned status reconciliation. The
prior passes remain truthful historical evidence for `953709f...`, but they are
not sufficient to finalize the post-feature-052 PR head.

## Architect disposition: completion-cycle055 integration (2026-10-08)

After #214 merges, synchronize the preserved PR #217 branch with verified updated main and retain the complete feature051/052/053/054 implementation. Resolve nginx/Docker integration by preserving #214's single cache-policy map, server-level security headers with `always`, gzip, non-cacheable error responses, and official unprivileged runtime. Keep retention's `/state/current` document root and alias-backed immutable assets, append-only ledger, project provenance, shell-last staging, no-follow authority boundaries, transaction durability and no-replace export semantics. Shared headers must remain effective on alias assets, SPA routes, worker responses and 404; `Cache-Control` must not be added on error responses.

Run real isolated Docker build/up/down and HTTP header smoke for `/`, `/sw.js`, real hashed `/assets/`, real unhashed `/content/assets/`, retained historical hash and missing asset 404, including gzip and actual non-root nginx master identity. Verify B worker/shell activation plus exact retained A-origin bytes through the full Docker retained-asset lifecycle and hostile publication tests. Full preflight and all five exact-current-head checks are mandatory. Record the integration in new055 instead of incrementing exhausted historical051/052 return budgets. Refresh Architect then Analyst evidence for every included feature051/052/053/054 on the same final integrated content head; historical passes remain historical and cannot authorize merge.


## Completion-cycle055 Integrated Validation Preparation

Verified214 main1e3507e2363314340eed43c0d77dd3d0acbc92cf is the prerequisite for current217. Preserve both runtime contracts: one server-level cache/header map and unprivileged nginx/gzip from214;217 persistent/state-current/retained-alias/provenance/transaction behavior. New055 owns R1/R2/R3 and R2a/R2b; all original return counts and post-limit histories remain intact. Consolidate fullpreflight, fullOSV/frozen graph and isolated retainedA/B Docker lifecycle plus live root/SW/current+retained assets/content/404 headers/cache/gzip/nonroot evidence. Complete exact-head Review and canonical process preparation precede final content SHA. Then all included051/052/053/054 receive chronological Architect-before-Analyst passes on that same SHA; union evidence checks reuse existing guards per feature without weakening gates. Live full-pagination checks/conversations/conflicts and expected-head finalization precede217 merge.215 and cumulative055 final closure are downstream; this preparation asserts no final pass or merge.


## Architect disposition: C055-217-R2i image-only preserved-handoff recovery

Exact pre-publication Review of8b85683 identifies a genuine FR013/051 recovery asymmetry: after legacyA capture, labeled postfeatureB image build and interrupted first staging, incomplete release-state survives while compose down removes the container. Image-only retry rejects before independently verifying the preserved A handoff, although the selected labeled-container branch already accepts that same authoritative handoff. New055 owns real Architect return6/10; original05110/05210/0530/0546 and Analyst0 remain unchanged. Prior content/roles are superseded for the new repair; no new pass or merge claim.

In the labeled postfeature image branch with invalid_state, permit continuation only when the existing descriptor-bound verify_handoff independently succeeds, using the same exact project/source-kind/source-ID/inventory authority already required for the preserved source. This is reuse of an independently validated old handoff; the newly built postfeature image ID cannot be substituted as legacy source. Keep missing, corrupt, foreign or mismatched handoffs fatal. Never docker create/cp the labeled postfeature image for legacy capture, copy rejected release-state, recapture incomplete output or weaken the verifier. Preserve immutable-ID classification and successful clean initial-install semantics; no unrelated helper/protocol/owner/parser/dependency change.

Add meaningful positive image-only + invalid-state + independently valid A handoff, with exact original source-ID/kind/inventory/bytes and no create/cp; negative missing/corrupt/foreign/sibling/source-classification controls must preserve all authorities. Reproduce old-head rejection. Extend isolated actual Docker recovery to A capture→B image build→first-stage interruption/incomplete volume→down/container removal→image-only retry, proving retained A bytes and valid new shell/worker/controller where applicable. Keep selected-container and genuine initial-install controls. Consolidate full unit/quality/build, fresh all164 browser and full DEFAULT Docker including all existing crash/retry/kernel/C→D/path/export/header/nonroot gates plus the new recovery control. Only actual successful evidence closes engineering before one new effective commit/exact Review and originalfour ordered same-SHA roles; allfive current-head/fullpagination/finalizer remain mandatory.055 cumulative remains terminal215.


## R2i consolidated source-matrix extension

Preventive Review confirms the same rejected-state recovery gap when both selected container and project image are absent: legacyA was independently captured, first staging failed, compose down removed the container and obsolete project image was removed, but exact preserved A handoff remains. Within the current uncommitted R2i return6/10, cover both labeled-postfeature-image + invalid_state and entirely absent Docker source + invalid_state. In either branch, only successful existing descriptor-bound verify_handoff permits reuse; missing/corrupt/foreign/invalid source-kind/identity/inventory remain fatal. Preserve actual pre-feature source identity comparison/recapture precedence, authoritative verified-state priority, and unchanged no-state clean initial-install behavior. No rejected-state laundering, postfeature create/cp, default source fabrication or verifier relaxation.

Add absent-source valid-handoff positive and invalid/missing negatives alongside image-only recovery. Actual Docker interrupted-first-stage/down recovery must exercise labeled B image-only retry and then absent project image retry, with preserved exact A authority and no baked-source copy. Full unit/quality/build, fresh164 browser and default full Docker requirements remain unchanged. Independent matrix audit found no further actionable gap. No additional return or budget reset; new effective Review and originalfour ordered roles remain pending.


## Architect disposition: C055-217-R2j transaction generation and predecessor authority

Native current0cf4 P1r4226505347 and P2r4226505350 are genuine. Independent old-head controls prove A→B→A fails because deterministic release-ID output A remains without the new operation's journal; A→B→C→touch-h B→D retains B and removes actual immediate C. The same deterministic identity also rejects currentB publication to a new absent export destination. New055 owns real Architect return7/10; original05110/05210/0530/0546 and Analyst0 remain unchanged. Existing0cf4/1622 roles are historical and do not authorize changed generation content.

Use a fresh transaction-specific published generation identity for a new publication operation, independent of release content hash. Bind its exact output/root/project/release/manifest/ledger/source/export destination and created inode/bytes into durable transaction authority. Interrupted same-operation/new-process or new-container retries must select the exact pending generation and export authority, not create another generation. Completed same-current/same-destination exact retry remains idempotent and byte/inode preserving; same-current/new-destination and A→B→A use a fresh transaction, preserving prior export and current/rollback safety. Unknown occupied outputs/destinations remain rejected rather than adopted merely by matching release bytes.

Persist exact immediately-prior-active published generation authority before activation, under the project lock, and retain/revalidate it through pending recovery, activation, journal clearing and retirement. Protect the newly active and its actual prior active output/link/target/tree identities, even when their release IDs are equal. Remove filesystem mtime/tie/directory ordering as rollback authority entirely. Existing no-follow/nonblocking descriptor-bound journals, mandatory symlink generation identities, protected current/rollback links, complete ledger/tree checks and durable retirement resume-before-next-publication remain mandatory. Wrong project/root/domain, substituted links/tree/journal, malformed/missing required lineage or unsupported schema must fail closed before mutation or deletion. Do not invent previous chronology from names, timestamps or equal bytes.

Define bounded old-layout admission explicitly: a fresh empty generation domain may have no prior published generation. A committed old deterministic layout may be bootstrapped only when an exact uniquely verified active output is independently bound to committed current release and complete ledger/tree/link authority; do not infer an unrecorded older rollback. Ambiguous, invalid or foreign layouts fail closed and remain unchanged. The new transaction can record the proved old active as its immediate predecessor; subsequent retirement still requires existing exact owned journal authority, never a broad prune or adoption of unknown trees. Any additional legacy-layout case requires concrete proof and Architect disposition before implementation.

Verification covers repeated currentA/same destination, currentA/new destination, A→B→A→C→D, source/export identity preservation, touched old/new links and timestamp ties, malformed/missing/foreign lineage and bounded old-layout migration; exact current plus immediate predecessor must survive while obsolete owned generations retire safely. Cover interrupted first stage/output/export/activation/journal-clear/retirement, partial removal, new process/container retry, symlink-generation ABA and journal/path substitution, preserving all earlier negative controls and two-link/two-tree convergence where applicable. Record authentic old-head red and independent complete generation/rollback/source-precedence audit before freezing the implementation. Full focused/unit/quality/build, fresh164 browser and full DEFAULT isolated Docker including all existing crash/kernel/C→D/path/export/owner/header/nonroot contracts and new repeated-release/predecessor controls are mandatory. No CI/assertion/timer/permission/dependency relaxation or unrelated refactor. Close engineering before new effective commit/exact Review, renewed originalfour ordered same-SHA roles and allfive exact current-head/fullpagination/finalizer.055 cumulative remains terminal215.


## R2j complete matrix disposition: owned generations and crash ordering

The preventive audit reproduces an adjacent destructive ownership gap: a preexisting prefix-matching site-foreign symlink to a contained .site-foreign.publish-review-foreign tree/sentinel is deleted during D retirement. A journal written after observing an arbitrary entry cannot grant creation ownership. Within the same uncommitted R2j return7/10, remove prefix/name/time-based candidate ownership entirely. Enumerate only durable generations actually created and published under exact transaction authority, with their created output/link/tree identity and complete proof persisted in pending/committed lineage. Protect durable active and immediately previous entries; eligible older owned entries remain recorded until exact pinned retirement and directory barriers complete, then remove only their completed records. Unknown foreign links/trees remain unchanged or cause premutation rejection, never gain deletion authority merely through containment, safe naming, equal bytes or a newly manufactured journal.

Legacy policy: a fresh empty domain has no prior published generation. If lineage is absent in a committed old deterministic layout, bootstrap only the uniquely exact currently active output matched independently to committed current state and complete ledger/tree/link identity. This establishes protection/prior-active mapping, not blanket destructive ownership of that tree or any older prefix candidate. Unknown older entries remain preserved unless independent original creation authority exists; ambiguity/invalid current/schema/project/domain rejects before mutation. After a new transaction, its actual protected prior active may include that proven old active, but foreign or unproved older entries cannot be retired. No inference of unrecorded chronology.

Crash ordering: under the existing project lock, resolve generation choice from exact pending authority first, exact committed same-release/same-destination terminal authority second, and otherwise a fresh transaction UUID. Persist the prior lineage exact bytes/identity and actual previous output link generation plus fresh created-output binding in pending authority before activation. Distinguish release content identity from publication transaction identity. Promote committed lineage with its exact new active/previous/owned entries durably before clearing the publish journal; a crash before/during/after activation or lineage promotion is resumed only through the exact phase-bound pending/current/output/export/lineage tuple. Do not retire under stale lineage or discard pending authority early. Revalidate pinned lineage/journal/link/tree identities around callbacks and file/parent barriers; unsupported/malformed/replaced authority is fail-closed. Resume older pinned retirement before a different transaction, and retain owned entries until unlink/tree/journal-clear durability completes.

Required matrix additionally covers equal-release/new-destination active/previous identity, repeated exact same-destination idempotent inode preservation, every lineage creation/promotion/journal-clear crash window with new process/container retry, prior lineage substitution/ABA/missing/malformed records, old-layout exact-active migration versus ambiguous/foreign layout, and prefix-matching foreign link/tree/sentinel unchanged bytes/metadata. Valid untouched, future/old timestamp and tied-link cases all protect the exact immediate previous generation. Existing safety/owner/provenance/retention guards remain unchanged. Authentic reds are /tmp/cabadrive-r2j-red.log plus independent Review probes. The bounded matrix is consolidated before source freeze/full verification; no additional return or original budget change.


## R2j creator-bound output-link publication refinement

Approve a randomized prepared output-symlink reservation within the current R2j7 consolidation. Persist its exact created inode/birth/generation/target authority in the pending journal durably before publishing it through the existing native no-replace rename helper. An interruption between output rename and journal link-binding persistence can recover only that originally known symlink at the reservation or final output path, bound to the exact journal-created tree and full bytes. Same-target or equal-byte foreign replacement is not creation authority and must be rejected/preserved. Reconcile only the deliberate successful own-rename ctime transition while inode/birth/target and all unaffected metadata remain bound; no generic refresh of first-observed replacement. Prepared reservation cleanup is exact created-identity-bound and preserves substitutes. Non-generation publication behavior remains unchanged.

Retain strict confined UUID reservation/promotion basenames, exact keys/types/schema, prior-lineage pinned-byte equality and prepared-lineage equality to prior plus journal-created/current generation. Compare the held promotion descriptor with its expected creator snapshot before rename; separately reopening a path is insufficient. Admit lineage only as private0600 single-link exact regular authority, pinned across admission/callbacks/durability. Missing lineage permits only an actually empty domain or uniquely verified legacy current output with owned:false protection; transaction-layout, ambiguous or invalid missing authority is fail-closed. No inferred previous or destructive ownership.

Timestamp verification follows the existing generation contract: touching a protected symlink changes ctimeNs, so fail-closed rejection with exact current/previous/foreign preservation is correct; do not weaken generation pinning to allow arbitrary touch. Untouched publication and genuinely tied creation times must still use recorded lineage rather than mtime ordering. Exercise rename→journal-bind interruption/new-process retry and same-target reservation/output substitution alongside prior promotion/retirement faults before source freeze. These are existing R2j malformed-authority/crash/foreign criteria, no new return or scope.


## R2j mixed runtime-stage/export authority disposition

Authentic /tmp/cabadrive-r2j-mixed-red.log confirms completed exportB→ordinary runtime stageC→fresh exportD rejects intact last-published lineage, and interrupted coordinator publishC after-output/before-export→ordinary direct stageC prematurely activates. These are coherent cross-entrypoint consequences within the existing unfrozen R2j return7/10, not another validation cycle. Runtime stage and export intentionally share Compose state/publish domains; support their valid composition.

For a fresh operation with no coordinator pending work, independently validate last published lineage against its own immutable created output/link/tree, publication manifest/ledger and recorded provenance. Separately verify the current runtime's complete canonical committed state/assets/retained ledger. Published assets must remain an exact verified subset of current retained assets, but runtime may legitimately advance release or add retained bytes and may re-stage identical content with newer independently valid legacy handoff metadata. Do not require old publication legacyAuthority to equal subsequently updated runtime metadata. New export records the actual last published generation as previous. This separation applies only to fresh admission: exact completed same-request terminal reuse and phase-bound pending recovery/current reconciliation remain strict, preserving FR021 stale-pending rejection. Corrupt/incomplete/untracked runtime or changed published bytes/identity remains fatal.

Ordinary direct stage must reject outstanding coordinator publish-export/generation work, retirement journal, or committed lineage.retiring authority including the journal-clear-before-lineage-drop window, before state/output/assets/current mutation. Check before state-layout mutation and recheck under the actual project lock. Unsupported/malformed coordinator/retirement/lineage authority also fails closed. The internal coordinator stage may proceed only with its exact journal/request/current phase, existing held lock and final-revalidation authority; lockHeld or a generic caller flag alone cannot bypass the guard. Preserve valid STANDALONE operation=publish pending scenarios: existing FR021 tests intentionally direct-stageC then reject a stale standalone publishB. Do not block that supported independent-stage behavior globally.

Verify completed exportA/B→ordinary runtime stageB/C→fresh exportB/D, repeated same-content runtime stage with later valid handoff, exact old published asset subset and untouched prior outputs/export. Negative controls cover coordinator after-output/no-export direct-stage refusal, pinned retirement/current protection and lineage.retiring final-clear/drop interruption/new-process recovery, malformed or substituted authorities, and all existing standalone-publish stale-pending tests unchanged. The actual configured retirement-unlink fault followed by direct stageD also authentically strands the pinned C retirement; all three mixed reds are confirmed in the same log. Full final focused/unit/quality/build, fresh164 browser and full DEFAULT Docker remain required. No new return/budget, semantic weakening or unrelated entrypoint change.


## R2j positive creator-generation admission for own rename

Current official Node20 stat-time documentation checked through Context7 permits unavailable birthtime to be represented by epoch0. Where exact creator recovery deliberately reconciles an own rename's ctime transition, zero birthtime cannot distinguish inode reuse plus restoredmtime/same-target replacement. Require strictly positive canonical decimal birthtimeNs for the prepared output-symlink reservation and prepared regular lineage creator authority at initial creation and every schema/snapshot/renamed admission, before publication or promotion. Zero/unavailable creator-generation evidence fails closed; do not invent a timestamp, relax identity, or use mtime/ctime fallback. Retain the exact held creator descriptor/link invariants and deliberate rename constraints.

This requirement is limited to creator authority permitting own-rename ctime reconciliation. Existing retirement schema and complete ctime/birthtime comparison remain unchanged, including canonical zero compatibility there. Verify zero-birth creation/admission/renamed-retry negatives through isolated filesystem adapters, preserving exact current/prior outputs/exports and foreign replacements with no partial publication. Actual supported host/Linux/Docker positive evidence remains necessary; no universal platform timestamp uniqueness claim. Same active R2j7 consolidation, no new return, portability dependency or unrelated runtime change.


## R2j effective project representation consistency

Authentic /tmp/cabadrive-r2j-project-red.log proves omitted API projectKey under CABADRIVE_COMPOSE_PROJECT=r2j-effective-project creates a correct execution domain but new lineage.projectKey=null; subsequent explicit identical project rejects that same logical domain. Normalize only the new generation-lineage, coordinator-pending and direct-stage guard identity construction/comparison sites through existing effectiveProjectKey: explicit argument, then CABADRIVE_COMPOSE_PROJECT, then cabadrive, with existing validation. Exact equivalent omitted/explicit representations must interoperate with the same recorded execution domain.

Keep case-sensitive exact project identity and foreign/malformed/domain rejection; no aliases, inferred ancestor, environment rewrite or change to existing standalone-publish pending schemas/FR021 controls. Add omitted-under-env→explicit-same, explicit→omitted-same and default-equivalent positives with genuinely different-project negatives preserving original output/current/export/authority. This is current unfrozen R2j7 consistency, not another return or scope. Four new identity sites reuse the existing resolver; no unrelated normalization. Zero-birth creator adapter controls remain required and have separate actual successful proof, without retirement-schema change.

## R2j engineering closure before effective content

C055-217-R2j engineering is complete. Fresh transaction-specific generation identities support repeated content and new export destinations while exact pending/terminal same-request retries preserve identity. Durable private creator-bound lineage records actual active/previous and eligible owned generations; retirement uses neither mtime nor prefix ownership, and unknown foreign artifacts remain untouched. Creator reservations precede no-replace output publication; descriptor-bound prepared lineage promotes before pending clear with exact crash recovery, positive creator birth admission and strict schema/domain/receipt proofs. Legacy bootstrap grants unique verified active owned:false protection only. Published lineage and valid advanced runtime state are independently verified for fresh operations; ordinary stage rejects coordinator/retirement/tombstone work with exact private internal permits, preserving standalone FR021. Effective project identity uses the existing resolver. Fresh full preflight EXIT0 passes739/739 unit tests with zero skips,164/164 browser cases and all quality/content/memory/build gates; full DEFAULT Docker81393/5197 EXIT0 exercises new repeated-release/new-destination/foreign/predecessor/mixed controls and seven cross-container fault retries plus every earlier lifecycle/path/owner/kernel/recovery subcall and27HTTP/security/cache/gzip/UID101. Two registered owned generations converge; preserved unowned artifacts are excluded from that count. The first Docker EXIT1 was the new fixture's omitted publish mount, resolved only by three task-container mounts and scoped checks before complete successful rerun; unchanged runtime/unit/browser blobs preserve preflight evidence. No outstanding engineering feedback or unresolved owner issue remains. Exact newcontent Review and originalfour renewed same-SHA ordered roles plus allfive published-head/fullpagination/finalizer gates remain pending. Genuine055 return7/10 and original10/10,10/10,0/10,6/10 with Analyst0 are preserved;217 is not claimed merged,215/cumulative055 remain uninvoked.


## Architect disposition: C055-217-R2k owned-tree ownership and failure cleanup

Current publisheda45e4c05 native ownership-walk P2r4227310343 and failed-export cleanup P2r4227310354 reopen completion after R2j passed and was published. Independent LinuxNode22 root controls now authentically confirm FIVE manifestations in work/r2k-review-red.mjs: replaced-parent enumeration changes foreign UID/GID0→12345 before rejection; failed-export root inode actually recycles before the first destination open and cleanup deletes the foreign sentinel; buildStaticPublish failure cleanup deletes a replacement root even with a different inode; an inserted foreign nlink1 child under the unchanged original root is first-admitted, fchowned and later deleted; interrupted bound-export retry accepts a real recycled root with changed birth and exact-byte clone, then fchowns its foreign child. All five controls completed EXIT0 using real filesystem identities. The earlier10000-attempt negative observation kept a descendant descriptor alive and is superseded by the authentic before-first-child reuse control; it is not evidence of safety. Implementation independently reproduces the ownership red on LinuxNode20 in /tmp/cabadrive-r2k-red.log. New055 owns genuine Architect return8/10; original05110/05210/0530/0546 and Analyst0 remain intact. R2j739/164/fullDocker proof and prior roles are historical; no new readiness is claimed.

Approve a portable creator-owned tree authority for only physical publish/export creation, ownership walk, failed cleanup and recovered-export retry. Hold the newly created root descriptor immediately before any child mutation and keep every created-directory ancestor descriptor through handoff/publication/finally. Register directories and files from actual creation authority: exclusive copy/proof-file descriptors and creation-bound directory generation, never a later readdir, same bytes, nlink1 or safe-looking name. Reject unknown or replaced children before ownership mutation or deletion, even when the root is unchanged. Revalidate all held ancestors and registered child type/dev/ino/generation before and after enumeration/open/callback boundaries and before same-object fchown/fsync. Own fchown refreshes only demonstrated UID/GID/ctime transitions; directory child mutations do not justify permanent mutable-directory ctime pinning. Keep direct/namespaced observed ownership, private probe/witness semantics and ordinary user read/write/removal behavior.

Both failed-export and buildStaticPublish temporary cleanup must operate only on exact creation-bound registered entries with held ancestry. Never recursively remove a pathname root on dev/ino or containment authority alone; preserve substituted roots, unknown entries and exact journal-owned retry artifacts. Validate the complete admitted cleanup scope before destructive work, revalidate boundaries through partial removal and fsync, and close descriptors on all failures. A separate path check followed by destructive pathname removal is not an atomic same-object proof: choose a supported anchored/native operation if needed, or demonstrate an equivalent primitive at the actual destructive boundary; preserve replacement entries and outside bytes/metadata. Existing Linux /proc/self/fd directory traversal works, but measured Darwin /dev/fd/N/child returns ENOTDIR and /proc is absent. Do not claim that transport is portable. Use supported Linux/Darwin APIs or the existing narrowly extended native helper contract without adding host Node/Python dependencies or a general filesystem rewrite.

Recovered exports need the same authority, not just live-process descriptor protection. Extend pending export/proof admission to persist exact creator root generation and creation-bound descendant identities, with strict schema/domain/request/nonce/inventory semantics and only narrowly recorded own write/chown/no-replace rename transitions. Match the persisted generation and registered entries before admitting recovery ownership or cleanup; an identical-byte clone with reused numeric inode and changed birth must fail closed. Do not reconstruct creator ownership by observing a replacement tree. Unsupported/missing/old authority cannot authorize mutation; preserve the uncertain artifact and fail closed unless existing independent exact authority establishes a permitted recovery. Preserve genuine interrupted export/new-process retry, terminal exact receipts, legitimate duplicate equal-copy behavior and current/output/lineage/retirement proofs. No standalone state-transaction cleanup expansion is assigned.

Before freeze, prospective Review must close all five manifestations and the bounded adjacent physical-artifact authority audit. Required meaningful controls: authentic old-head reds; changed root at enumeration/open and injected unknown child under unchanged root; regular/directory/link/FIFO/hardlink replacements; actual root reuse before first child and generation-bound exact-byte retry clone; proof-file/partial-copy/fchown/fsync/rename/finally failures; all unknown/outside bytes, mode, UID/GID and inode/generation preserved; valid registered cleanup and interrupted new-process retry remain successful. Run supported host and real Linux root/nonroot controls with no fabricated timestamp/inode claims or selected-test skips. Then fresh complete unit/quality/build and164 browser cases plus FULL DEFAULT Docker with all generation/mixed/seven-fault/legacy/path/owner/27-header contracts. Close actual FIRST evidence and canonical engineering before one new effective commit, exact Review, renewed originalfour ordered same-SHA roles and allfive live complete-pagination/finalizer gates.055 cumulative final validation remains terminal215.

Architect return count: 8 / 10.
Analyst return count: 0 / 5.

## R2k native cleanup and durable export authority policy

Use actual exclusive copy/proof creation descriptors and held directory ancestry through handback/fsync, then persist strict exact root generation and creation-bound entry snapshots before the export-identity-bind interruption boundary. New-process retry verifies already handed-back registered entries; it cannot grant ownership to newly observed clones. Root admission binds positive birth, stable device/inode/type/mode/owner; directory child changes do not permit a permanent mutable-ctime pin. Preserve narrowly proved own file metadata and no-replace rename transitions.

The existing compiled helper may be narrowly extended for inherited held-descriptor fstatat/openat/unlinkat entry checks and removal on Linux/Darwin, retaining its existing rename behavior and build/runtime contract. POSIX has no compare-inode unlink, so do not claim atomic compare-and-swap deletion. Perform the final exact registered-child and held-parent validation immediately at the native relative-removal boundary, with no intervening JavaScript callback or pathname authority transfer; revalidate remaining admitted scope and durability afterward. Unknown or substituted entries must remain unchanged; a concretely unsafe boundary must retain/reject the artifact instead of deleting it. Focused controls inject replacements at actual reachable admission/open/callback/cleanup boundaries; no fake portability or unrestricted adversarial-race guarantee. No generic filesystem/helper rewrite or new host dependency.

Architect return count: 8 / 10.
Analyst return count: 0 / 5.

## R2k concrete native cleanup interface and integration

Implementation can start with one small extension of the existing rename-noreplace executable. Retain its existing SOURCE DESTINATION CLI; add an owned-unlink mode taking one validated basename and file/directory type, with inherited descriptor3 for the held registered parent and descriptor4 for the exact admitted registered child. Node validates the complete creator registry, generation and all held ancestors, opens the child no-follow/nonblocking with directory flag where needed, compares its exact registered snapshot, and invokes the helper through existing compiler/runtime paths with those descriptors in stdio. Basename is neither empty nor dot/dotdot and contains no slash; argument transport preserves other supported filename bytes. The native operation fstats held parent/child, fstatats the basename relative to the held parent without following links, verifies type/device/inode and regular nlink1 against the held child, calls unlinkat relative to that same held parent with directory flag only for directories, then fsyncs the parent. No callback or JavaScript pathname authority transfer occurs between native validation/removal. This is an anchored same-object boundary, not a claim that POSIX provides compare-inode unlink.

Cleanup pre-admits the complete registered scope, then processes known files and directories bottom-up. No discovered entry becomes owned, no generic recursive rm is used, and a new unknown child makes directory removal fail without deleting that child. The creator root is removed only using its held creator descriptor and actual held parent; close all held descriptors in finally while preserving valid journal retry artifacts. Recovered export first matches the persisted creator root generation and exact entry registry, pins those admitted objects and verifies their already handed-back ownership. Linux and Darwin both support descriptor-relative POSIX calls; no /proc or /dev/fd child path transport is required. Preserve current CLI/helper compilation and test fault boundaries. Prospective Review and authentic hostile/positive tests confirm the actual code before scope freeze; full fresh proof remains pending.

Architect return count: 8 / 10.
Analyst return count: 0 / 5.

## R2k registered proof removal and bounded pending capacity

Prospective actual-source/focused review confirms an induced legitimate-transition gap: exportCreatedTree contains EXPORT_OWNER_RECORD, but successful publishExportReceipt removes that proof before later registry admission, so normal coordinator/final-boundary and after-rename retry reject their own removed entry. Authorize only this exact own transition. A durable validated receipt or explicit pending transition must bind the same nonce/request/creator root generation and complete creation-bound entry registry before proof removal. Before removal, validate the full registry; afterward, admit that exact registry minus only the registered proof when the matching durable transition exists. Path absence alone cannot grant a filtered registry. Keep remaining root/entry generation, type, bytes and ownership proof unchanged; directory child removal changes do not justify a permanent mutable timestamp pin. Missing or substituted proof without exact transition fails closed. Cover normal coordinator/final callback, after-rename retry, faults before/after unlink and directory barrier, new-process recovery and exact terminal receipt; foreign/unknown entries remain untouched. No weaker assertions or fresh readdir ownership inference.

The actual2357-file dist creation registry serializes to1,142,632bytes before the pending journal's existing inventories, exceeding the generic1MiB authority ceiling. Permit a bounded8MiB maximum only for the publish-pending journal reader and its exact descriptor-bound recovery parsing. Retain all other generic authority limits at1MiB; enforce size before/full bounded read with held descriptor/type/path checks, strict schema and over8MiB rejection before mutation. Actual-dist complete publication/recovery must pass, and oversize/malformed/link/FIFO journal negatives must preserve state/current/output/export/foreign entries. An external registry file/protocol is not needed. These are current unfrozen R2k8 implementation consistency, not another return, feature or final-pass boundary.

Architect return count: 8 / 10.
Analyst return count: 0 / 5.

## R2k exact same-creator recovery restoration

Expanded focused verification exposes three existing restoration contracts: rename the exact proof inode aside and restore it, or restore changed destination-file bytes on the same created inode, then retry. Such legitimate restoration changes ctime/mtime while creation identity and expected bytes are preserved. Approve only new-process recovery reconciliation after proving the persisted creator device/inode and strictly positive unchanged birthtimeNs, exact type/mode/UID/GID/nlink/size, held admitted original creator-parent ancestry and independently exact descriptor-read expected bytes. Pending inventory governs normal entries; exact nonce/request proof bytes govern the reserved proof. Only ctime/mtime may refresh after this full proof. No recovered ownership change, new creator grant, equal-byte foreign replacement or reused-inode/changed-birth adoption is allowed; live current-process authority stays fully timestamp-pinned.

Before cleanup or any ownership operation, all unknown/replaced entries reject and the original root/creator registry remains authoritative. Positive controls retain the original proof or data inode through restoration and ordinary retry. Negatives restore equal bytes on different inode/birth, alter owner/mode/link count, insert unknown children or replace ancestry; every foreign entry and metadata remains unchanged. Renew prospective Review after the actual compatibility delta before freeze/full fresh proof. Actual full dist capacity verification has1,807,067-byte pending authority with2357served files/2358registered created files and successful new-process retry under the pending-only8MiB ceiling; no generic size or safety relaxation. Same current R2k8, no additional return or final-pass boundary.

Architect return count: 8 / 10.
Analyst return count: 0 / 5.


## Current R2k engineering completion before effective content

C055-217-R2k engineering is complete at2026-10-09T08:51:26Z. Physical publish/export trees bind held creator roots/ancestors and exact exclusive-created entry registries; unknown or replaced children cannot gain ownership or cleanup authority. The existing Linux/Darwin native helper performs descriptor-relative exact registered-child removal with no intervening JavaScript callback; POSIX provides no compare-inode unlink and no such atomic guarantee is claimed. Both physical failure-cleanup branches preserve substituted roots and foreign entries. Pending export/proof persists positive root generation and creation-bound entries; new-process recovery verifies those handed-back entries without fchown or fresh creation grants. Only unchanged creator device/inode/positive birth/type/mode/owner/nlink/size and independently exact expected descriptor bytes permit first recovery ctime/mtime reconciliation; subsequent live scope is fully pinned. Matching durable receipt permits only exact own proof omission. Pending-only8MiB parsing supports actual1,807,067-byte/2357-served-file authority; other limits remain1MiB. Allfive authentic old-head manifestations now reject/preserve correctly, supported host/Linux focused12/12 pass and full-artifact retry succeeds.

Fresh frozen complete preflight TRUE EXIT0 passes751/751 unit tests with zero failures/skips and164/164 desktop/mobile browser scenarios plus all quality/content/memory/build gates (/tmp/cabadrive-217-r2k-preflight-final.log). FULL DEFAULT rebuilt Docker85489/projectcabadrive-retention-5244-1791532291433 TRUE EXIT0 passes new12 native/recovery controls, all seven cross-container faults/retries, repeated-content/new-destination/exact retry/actual owned predecessor/foreign/timestamp/mixed-stage/retirement, running/stopped/initial/legacy/literal supported paths/LF zero-Docker rejection and27HTTP exact five security/cache/gzip headers with actual master/runtimeUID101 (/tmp/cabadrive-217-r2k-docker-final.log). FIRST implementation append at08:50:29Z records actual proof; frozen runtimef2a3d7490cfd9a9c2736f18a59828f2904d5e9bc/native287e484f28583d39236ae585ed158a7e09d6536d/newtests20b15030db760d9a9185454853f1b22f0937b98a/Docker7bb4d85ffdf376b8f392ac898dfd05c45cce1223 remain intact. Engineering feedback and known ownership/cleanup issues are closed without waiver.

New exact effective-content commit/Review and originalfour renewed ordered same-SHA Architect/Analyst roles remain pending; allfive live exact-head checks/full review pagination/conversations/conflicts/strict finalizer follow. Prior647115/a45e R2j roles/checks remain historical for changed content.055 owns genuine8/10, original05110/05210/0530/0546 and Analyst0 preserved.214 is actually mergedmain1e3507e2363314340eed43c0d77dd3d0acbc92cf at2026-10-08T18:11:24Z;217 publisheda45e4c05 remains open until new verified head,215 published31c remains downstream open. No217/215 merge or055 cumulative completion is claimed;055 final roles remain terminal215.

Architect return count: 10 / 10.
Analyst return count: 0 / 5.
