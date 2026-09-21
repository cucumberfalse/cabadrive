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
   - Add an explicit durability barrier: fsync promoted files and affected parent
     directories before `current`, then fsync the state directory after pointer
     rename. Injected sync/close failures must preserve the old pointer.
   - Preserve A on every failure. Make retries idempotent; never add asset GC.

4. **Docker-only migration and serving**
   - Add a dedicated stager target/service with Node and candidate `dist`; nginx
     remains the runtime server.
   - Add a project-scoped release-state volume. Resolve the exact Compose project
     and only its `cabadrive` container/image.
   - Define one cwd-independent project key for Compose, capture, volume/image/
     container lookup, handoff, and stager bind. Test unset default and explicit
     isolated values; declare the same default/override as Compose project name.
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
- `retained-assets.json` is the canonical cumulative ledger; candidate-only
  membership checks cannot establish historical-store integrity.
- `current` is a crash-durable commit only after file and directory fsync ordering
  completes; unsupported/failed durability operations abort the activation.
- Browser evidence uses real service-worker lifecycle/control from the historical
  generator and current candidate, not a synthetic cache/request approximation.
- A pre-build capture bridges the first upgrade from a legacy image that had no
  state volume. Detectable-but-unreadable prior state fails closed.
- A Docker staging service preserves the host Docker-only contract; host Node or
  pnpm is not required.
- Static hosting consumes a complete merged publish tree and atomic/equivalent
  shell switch. Candidate-only destructive upload is unsupported.
- Retention is indefinite in this feature. Storage reclamation is a separate
  correctness problem.

## Verification Matrix

| Boundary | Evidence | Pass condition |
|---|---|---|
| Manifest/path | focused Node tests | ordinal exact inventory; SHA/size stable; traversal, alias, symlink, duplicate, mutation, missing/extra rejected |
| Collision/idempotence | focused Node tests | equal bytes retry; unequal bytes abort; retained bytes unchanged |
| Transaction | fault-injected tests | every boundary before pointer rename leaves A current; retry succeeds; no retained deletion |
| Durable activation | injected filesystem-operation trace | every new file and rename parent is fsynced before `current`; state dir fsynced after; sync/close failure preserves old pointer |
| Cumulative retained integrity | focused staging/verifier tests | every A+B retained entry exactly matches canonical ledger; corrupt/missing/extra old A blocks B and authority |
| State authority | focused capture/staging tests | empty/incomplete volume does not suppress legacy capture; corrupt or mismatched committed state fails closed |
| Late legacy union | focused staging tests | identical candidate plus newly available legacy asset appends before idempotent return; collision changes nothing |
| Project identity | contract + isolated Docker tests | unset and explicit keys agree across Compose, capture, volume, image, handoff, and stager; sibling untouched |
| Rejected-state source | focused capture + Docker negative | rejected volume is never copied through attached `/state`; preserved handoff/baked root works, no independent source fails unchanged |
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
- Rejected volume is re-imported through its attached container: forbid `/state`
  fallback after verifier rejection and preserve only independent authority.
- Idempotent shortcut skips late legacy input: promote the validated full union
  before returning unchanged.
- Existing publish output is discovered after activation: validate it before any
  staging mutation and snapshot the negative result.
- Buffered writes survive process tests but not host crash: require file and
  directory fsync ordering before/after the atomic pointer and fail on sync error.
- Current-candidate-only verification misses corrupt older A: bind authority to
  an exact cumulative ledger and negatively mutate an unreferenced historical file.
- Synthetic fetch/cache fixture bypasses legacy worker semantics: install and
  control the generated historical worker for both safe and destructive cases.
- Retained A success can hide failed B activation: assert exact B shell/SW plus
  B worker control throughout the real Docker lifecycle.
- Crash after release rename but before metadata: classify and resume exact
  release-only state; reject mismatches and never retry a blind rename over it.
- Concurrent update: exclusive fail-closed lock; no implicit stale-lock removal.
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

Architect follow-up disposition is complete, but the feature is not ready for
final validation. R051-009 through R051-012 require implementation and focused/
full verification; all fourteen open review threads require current-head evidence
and resolution followed by fresh exact-head review before final validation may
be invoked.
