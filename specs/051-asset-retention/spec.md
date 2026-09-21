# Specification: Append-Only Static Asset Retention

## Cycle Context

- Source: Analyst-owned `feature-request.md`; assumptions A1-A7 are accepted.
- Role: Architect. Only this file, `plan.md`, and `tasks.md` are Architect-owned.
- Verified base: `origin/main` and handoff `HEAD`
  `2a92bcfcb7638d1094f33b28e4c2932fb2e4121e`.
- Assigned worktree/branch:
  `/Users/chap/devel/cabadrive-worktrees/051-asset-retention`,
  `codex/051-asset-retention`.
- Parallel work exists. PR #214 and dependent PR #215, their branches,
  worktrees, diffs, commits, process memory, and GitHub state must not be
  mutated. Any overlapping main change is integrated only through Orchestrator
  coordination after it lands.
- Delivery is one implementation branch and one PR continuing this latest-main
  Analyst handoff after explicit Orchestrator assignment.

## Goal

Publish a new static release without deleting any previously served immutable
`/assets/` bytes. Candidate immutable assets are staged and verified first; the
new HTML and service worker become live only through an atomic release-pointer
switch. A genuinely cache-missing legacy tab can therefore request its old hash
after deployment and receive the exact old bytes from origin.

## Scope

In scope:

- A repository-owned deterministic release inventory and staging command.
- A project-scoped persistent Docker release store and Docker-only staging
  runner; host Node/pnpm remain unnecessary.
- A one-time outgoing legacy container/image capture before its image is
  replaced, including the case where the old container is stopped.
- Atomic/equivalent shell-last activation, immutable collision checks, safe
  retry, path/symlink confinement, and indefinite asset retention.
- A portable merged publish directory and documented capability contract for
  optional static hosts.
- Unit/integration/browser/Docker tests and directly affected durable docs.

Out of scope:

- Feature 049 service-worker, progress, Learn, or UI changes; PR #215 consumes
  this feature only after merge/synchronization.
- Editing or rebasing PR #214, provider-specific cloud adapters, a backend,
  cross-origin storage, analytics, historical HTML/SW retention, and automatic
  asset garbage collection.
- Recovery of an old artifact after both the origin and every available
  container/image/build artifact have already deleted it.

## Release Inventory Contract

The implementation exposes a no-network Node module plus CLI, tentatively
`scripts/stage-static-release.mjs`, and a deterministic manifest helper.

- The candidate root is a completed Vite `dist/`. Every regular file below its
  real `/assets/` directory is immutable for this contract, regardless of file
  extension. No filename-regex is trusted as integrity evidence.
- The canonical candidate manifest is sorted by ordinal POSIX-relative path and
  records schema version, path, byte length, and lowercase SHA-256. It also
  records all candidate mutable files outside `/assets/` so incomplete shell
  copies are detectable. The manifest is deployment metadata and is not used as
  a runtime API.
- Manifest generation and staging reject absolute paths, `..`, empty/duplicate
  normalized paths, backslash aliases, NUL, symlinks, non-regular files, and
  realpath escape from the supplied root. The staging root itself must not be a
  symlink.
- Existing and candidate files at the same immutable path are compared by
  length and SHA-256. Equal bytes are idempotent. Different bytes are a fatal
  collision; no overwrite is attempted.
- Candidate manifest entries must match an exact filesystem walk. Missing,
  extra, unreadable, changed-during-read, or digest-mismatched files abort.
- Historical `/assets/` files are retained indefinitely. No deletion, TTL,
  count cap, size cap, LRU, or cleanup command is introduced. Future pruning
  requires a separate feature proving a safe client lifecycle.

## Staging State And Transaction

The canonical release state is project-scoped and contains:

```text
state/
  assets/                       # append-only immutable namespace
  retained-assets.json          # canonical complete retained inventory
  releases/<release-id>/        # candidate tree plus .release-state.json
  current -> releases/<release-id>
  metadata/<release-id>.json    # canonical inventory/evidence
  transactions/<transaction-id>/
  stage.lock
```

`release-id` is the SHA-256 of the canonical complete candidate manifest, not a
timestamp or user-provided path. Staging requires all paths and atomic renames
to remain on one filesystem.

Transaction order:

1. Acquire an exclusive `stage.lock`. Concurrent or ambiguous lock state fails
   closed; the normal command never guesses that a lock is stale or removes it.
2. Validate the candidate and its canonical inventory without touching
   `current`.
3. If this is the first migration from a pre-feature Docker release, validate
   and copy every regular outgoing `/assets/` file into transaction storage.
4. Validate the union of existing retained assets, outgoing legacy assets, and
   candidate assets. Same-path/different-byte collisions abort.
5. Copy every new immutable file and every candidate mutable file into the
   transaction directory, fsync/close, hash the staged bytes again, and verify
   exact inventory completeness. Test-only fault injection may stop at each
   boundary.
6. Atomically rename verified new immutable files into `state/assets/`. A crash
   may leave unreferenced B hashes, which is safe; it must never overwrite an A
   hash or change `current`, and a retry is idempotent.
7. Re-inventory the complete retained namespace and require exact equality with
   the prior canonical retained inventory plus validated outgoing/candidate
   additions. Atomically publish `retained-assets.json`; missing, corrupt, or
   unexpected historical files fail before activation.
8. Write `.release-state.json` containing schema version, `release-id`, and
   manifest digest inside the verified transaction release. Atomically rename
   the release directory and metadata into their final paths, then read back and
   verify the marker, release tree, metadata, and retained inventory.
9. Establish a durability barrier before activation: fsync every newly written
   asset, mutable file, marker, cumulative inventory and metadata file, then
   fsync every affected parent directory after file/directory renames. Any fsync
   or close failure aborts without changing `current`; the Docker/Linux state
   filesystem must support these durability operations.
10. Create `current.next` pointing only to that fully verified final release,
   then atomically rename the symlink over `current`. This symlink rename is the
   sole commit point and last publication step. Fsync the state directory after
   the rename before reporting success. Only the resolved complete tuple is
   authoritative for future capture skipping.
11. Release the lock. Failed transactions retain the previously selected shell
   and valid assets; cleanup is limited to the exact transaction directory and
   may never delete retained assets or an active release.

Resumption is part of the transaction contract, not an error shortcut:

- Merely existing state volume/directories or retained `assets/` are never
  authoritative. Empty state, a missing/invalid marker, marker/current mismatch,
  missing metadata, or incomplete release is non-authoritative and must not make
  legacy capture return early.
- Retry classifies release/metadata state before creating final paths. Exact
  release-only state reconstructs metadata atomically; exact metadata-only state
  rebuilds and promotes the release; exact complete state proceeds to current
  and marker verification. Any mismatch is ambiguous and fails closed without
  deleting or overwriting the partial state.
- A dedicated fault boundary after final release-directory rename and before
  metadata publication must be executable. Retrying it must complete safely
  rather than raising `EEXIST`; the same requirement applies to every boundary
  before the final `current` rename. A selected release can therefore never lack
  its verified marker or metadata under the defined publisher.
- Legacy handoff inventory participates in collision validation and append-only
  promotion before every complete-release/idempotent shortcut. Re-staging an
  already-current candidate with newly available legacy assets must append those
  exact assets before returning `changed: false`; the shortcut may not omit a
  later authoritative handoff.
- Activation and committed-state verification compare the exact complete
  `state/assets` walk against `retained-assets.json`, not only the new/current
  candidate manifest. Corruption, deletion, or an untracked extra in any older A
  asset blocks B activation and makes committed-state verification fail closed.

The current release directory contains mutable entry points and a stable
`assets` symlink to `state/assets`, or nginx serves `state/assets` via an exact
`/assets/` alias. In either layout, B shell cannot be selected before the shared
asset union is verified.

## Docker-First Contract

- `docker-compose.yml` owns a named release-state volume without an explicit
  global name, so Compose scopes it by project. `make down` must continue to
  preserve it; no normal target uses `down -v` or deletes it.
- The Dockerfile provides a candidate runtime image and a dedicated staging
  target/service that includes the candidate `dist`, staging CLI, and Node
  runtime. `make build` and `make up` use Docker only.
- Before `make build` can replace the Compose image, a repository-owned Docker
  wrapper identifies the current project-scoped `cabadrive` container, or its
  previous Compose image when the container is stopped, and exports that
  release's `/assets/` into a narrowly scoped handoff directory. It records the
  source container/image ID. If an old release exists but cannot be exported,
  build/update aborts; it must not silently proceed as a first install.
- Capture may skip outgoing export only after executable read-only validation of
  `current`, the resolved release's `.release-state.json`, matching metadata,
  release tree, canonical cumulative inventory, and exact retained assets in the
  project volume. Successful
  `docker volume inspect` alone is insufficient. Empty/incomplete state falls
  through to running-container or prior-image capture; if that fallback cannot
  be read, update aborts.
- One effective Compose project key governs Compose itself, container/image and
  volume discovery, handoff path, and the stager bind. With no explicit
  `COMPOSE_PROJECT_NAME`, both Compose and capture use the same repository
  default (`cabadrive`), independent of checkout basename; with an explicit
  value, every consumer uses that exact value. Compose declares that same
  default/override as its project `name`; the wrapper must not derive a second
  fallback from `$PWD`.
- A verifier-rejected project volume is never an outgoing source indirectly via
  `/state/assets` on a container attached to that volume. Capture preserves any
  independently validated existing handoff, captures a replacement into a
  temporary sibling, and atomically replaces the handoff only after validation.
  An authoritative handoff contains a canonical path/size/SHA-256 inventory,
  nonempty source identity and independent source kind; reuse recomputes and
  exactly matches that inventory.
  After state rejection, allowed recovery sources are the preserved handoff or
  independently baked pre-feature `/usr/share/nginx/html/assets`; absence of
  either fails closed.
- `make up` runs the staging service against the project-scoped volume and the
  exact captured handoff, then starts/replaces nginx only after staging exits
  zero. Initial install without any prior project container/image is allowed and
  records that no legacy seed existed.
- Nginx serves immutable `/assets/` from the retained store with immutable cache
  headers and serves `/`, `index.html`, and `sw.js` from the atomic `current`
  release. Existing content/security/cache policy outside `/assets/` is
  preserved from the implementation branch's verified main; feature 051 does
  not copy or mutate PR #214 directly.
- A missing volume, mismatched handoff identity, unreadable outgoing image,
  failed stager, or absent `current` target keeps/reports the prior live release
  when one exists and prevents nginx from selecting B.
- Project/port isolation remains mandatory for agent smoke. The capture,
  handoff, volume, containers, and images of another Compose project are never
  inspected or changed.

## Static-Host Contract

The same CLI can stage `current publish root + candidate dist -> next publish
root`. The output is self-contained: it includes the union of all retained and
candidate `/assets/` plus only B's mutable shell files.

A compatible host must either atomically publish that complete merged output or
provide equivalent ordered operations: upload/verify immutable assets without
delete, then switch the mutable shell last. Same-path byte collisions and
partial uploads must block shell activation. A deploy command using destructive
sync (`--delete`, replacement of the whole build with candidate-only assets) or
without an atomic/equivalent final switch is documented as unsupported for the
safe-update guarantee.

The publish destination is resolved and rejected if it already exists before
candidate staging, asset promotion, metadata creation, or `current` switching.
This fail-fast path leaves release state and the destination byte-for-byte and
pointer-for-pointer unchanged.

## Functional Requirements

- FR-001: A->B staging preserves every valid A `/assets/` byte and adds every B
  `/assets/` byte before B shell/SW can be selected.
- FR-002: Equal path/equal bytes are idempotent; equal path/different bytes fail
  before activation and preserve A.
- FR-003: Missing/corrupt/unreadable/extra candidate inventory entries,
  interrupted copies, unsafe paths, symlinks, or concurrent staging fail closed.
- FR-004: The active shell changes by one same-filesystem atomic pointer rename
  only after complete asset and release verification.
- FR-005: Docker `make build/up/down` remains host-Node-free, project-scoped,
  restart-safe, and able to seed the outgoing pre-feature release before image
  replacement.
- FR-006: A static-host publish artifact carries the retained asset union and B
  shell; destructive hosts are explicitly unsupported.
- FR-007: No normal flow deletes historical immutable assets.
- FR-008: Feature 051 merges and passes its own final validation before PR #215
  synchronizes the resulting main, replaces its false-positive legacy fixture,
  reruns affected/full checks and review, and repeats final validation.
- FR-009: Interrupted state creation is safely resumable. Volume existence is
  not authority; only a verified marker/current/release/metadata/cumulative-
  inventory/assets tuple permits legacy capture to be skipped.
- FR-010: Tests and scripts are checkout-independent. They resolve repository
  files from `import.meta.url` or their script directory and contain no
  developer/worktree absolute path.
- FR-011: Compose and every migration component derive one identical effective
  project key. Default operation is cwd-independent and explicit project names
  remain isolated.
- FR-012: Newly supplied authoritative legacy assets are collision-checked and
  promoted before an existing-candidate idempotent return.
- FR-013: Rejected release-state cannot be laundered into an authoritative
  legacy handoff through a container mount. Only an independently validated
  preserved handoff or baked pre-feature source may recover it.
- FR-014: A pre-existing static publish destination is rejected before any
  release-state mutation.
- FR-015: Before `current` activation, all promoted asset/release/metadata/
  inventory bytes and affected directories are durably synced; durability
  failure preserves the previous pointer.
- FR-016: A canonical cumulative inventory covers every retained historical and
  candidate asset. Activation and authority require exact full-store equality.
- FR-017: The legacy-origin browser regression installs and controls a real
  historical A service worker whose generated precache excludes the lazy hash;
  a handwritten cache probe or request handler alone is insufficient.
- FR-018: The executable Docker lifecycle proves candidate B activation, not
  merely A retention: B shell and `sw.js` exact bytes are selected and B's
  service worker reaches activated/controlling state.

## Acceptance Criteria And Negative Scenarios

1. Unit staging of A then B yields an ordinal canonical inventory, retains exact
   A bytes, adds exact B bytes, selects B last, and is byte-for-byte idempotent
   on repeat.
2. A same-path/different-byte candidate, missing manifest file, unexpected file,
   staged digest mismatch, unreadable file, symlink, traversal, absolute path,
   or second lock holder aborts while `current` still resolves to A.
3. Fault injection after candidate validation, during asset copy, after partial
   asset promotion, during mutable copy, and immediately before pointer swap
   never exposes B shell. Existing A assets remain exact; retry completes.
4. A real browser fixture installs a faithful legacy A worker that excludes a
   uniquely hashed lazy JS path. Before B deployment, Cache Storage explicitly
   lacks that request. Safe staging publishes B while retaining the A path only
   at origin. The still-open A document's first post-B request returns HTTP 200,
   JavaScript MIME, and exact A SHA/body; request/server evidence proves an
   origin hit rather than precache or HTML fallback.
5. The same browser/server fixture with candidate-only destructive replacement
   returns 404 for the A path. Production staging rejects that incomplete
   retained set before switching shell.
6. Docker upgrade covers both a running legacy container and a stopped legacy
   container whose prior image remains. It captures A before build replacement,
   stages B, starts B, retains the exact A URL after restart and `make down/up`,
   and leaves sibling Compose projects untouched.
7. Initial Docker install with no prior release succeeds. A prior release that
   is detected but cannot be exported fails; it is never misclassified as a
   clean install.
8. A generated static publish tree contains A+B assets and B-only mutable shell;
   collision/destructive examples fail and docs name required host capabilities.
9. Existing repository preflight and all configured GitHub checks pass on the
   exact head. Review confirms no hidden deletion, overwrite, fixture precache,
   HTML fallback, broad filesystem target, or sibling mutation.
10. After feature 051 is merged, Orchestrator verifies updated `origin/main`,
    synchronizes PR #215 through its role-appropriate agent, and obtains the
    faithful legacy-origin browser evidence plus fresh checks/review/final
    Architect then Analyst validation before PR #215 merge.
11. An empty project volume or failed first stage does not suppress capture of a
    still-running legacy A. Capture continues and preserves A bytes; incomplete
    state without a valid fallback fails closed.
12. Faulting after final release promotion but before metadata leaves A selected.
    Exact retry reuses the release, restores metadata, selects B once, and
    publishes the marker without `EEXIST`; mismatched partial state is preserved
    and rejected.
13. An executable Docker lifecycle test uses an isolated project/port to run A,
    capture/stage B, verify B plus exact A asset, restart, `make down/up`, and
    verify again. It covers stopped-image capture, touches only test-owned
    resources, and proves a sibling sentinel remains untouched.
14. Capture tests derive script paths from their module/repository and run from
    an unrelated temporary cwd. CI rejects `/Users/...`, worktree-specific, or
    other developer absolute fixture paths.
15. With `COMPOSE_PROJECT_NAME` unset from a checkout whose basename is not
    `cabadrive`, capture, Compose discovery, handoff bind, and stager all use
    `cabadrive`. With an explicit key, they all use that key and never touch the
    default or a sibling project.
16. Stage B once without a legacy handoff, then stage identical B with a newly
    available legacy A asset. The second invocation appends exact A bytes before
    its idempotent return. A same-path/different-byte legacy collision fails
    before mutation.
17. Given a verifier-rejected volume whose attached container exposes readable
    `/state/assets`, capture must not copy those bytes. It reuses an independently
    validated handoff or captures the baked pre-feature path into a temporary
    replacement; without either, it fails closed and preserves the handoff.
    A corrupt/missing handoff manifest or source identity is non-authoritative.
18. Given an existing static publish output of any filesystem type, publish
    fails before staging. `current`, releases, metadata, retained assets, and the
    pre-existing output remain exactly unchanged.
19. An operation trace/fault harness proves file fsync precedes the relevant
    rename, directory fsync follows promotion/metadata/release renames, and the
    final state-directory fsync follows `current` rename. Injected sync/close
    failure at every pre-activation barrier leaves the old pointer selected and
    retry safely completes.
20. Stage A with at least two historical assets, then corrupt/delete one old A
    asset that B does not reference. B staging and committed-state verification
    fail before selecting B. An untracked retained file also fails until it is
    admitted through the validated append-only union and cumulative ledger.
21. The browser fixture registers an actual generated historical A worker,
    reloads until A controls the document, proves its precache omits the deferred
    A hash, deploys B without updating the controlled tab, and shows the first
    controlled fetch reaches retained origin with exact A bytes. The destructive
    variant under the same real controller returns 404.
22. The isolated Docker running- and stopped-A lifecycle records exact candidate
    B `index.html` and `sw.js` bytes, then after B deploy, restart and `down/up`
    proves those bytes are served from the active release. A headless browser
    additionally proves B's worker is activated and controls B; retained A alone
    cannot pass the test.

## Review And Completion Requirements

- Implementation begins only after explicit Orchestrator assignment of this
  complete memory and the single PR slice. Tests for failure atomicity and the
  legacy cache miss are written failing first.
- Review covers path confinement, symlink/race behavior, lock semantics,
  collision immutability, crash boundaries, first legacy capture, project
  isolation, exact-byte browser evidence, destructive negative, docs, and role
  boundaries.
- Every Implementation Agent feedback item receives Architect disposition.
- Orchestrator records the sole PR in the cycle set and invokes final Architect
  validation only after implementation, checks, review, thread resolution, and
  evidence are complete; Analyst validation follows on the same effective head.
- Merge requires green required checks, no conflicts/blocking threads, current
  evidence/docs, matching final-validation markers, and current-head guard.

## Review Follow-Up Dispositions

- **R051-001 (P1) — empty/incomplete state treated as authoritative: accepted.**
  Implement the committed marker/full validation above. Empty or failed-created
  state must continue capture from running legacy A or prior image; add missing-
  fallback negatives.
- **R051-002 (P1) — release published before metadata is not retryable:
  accepted.** Add the exact fault boundary and partial-state reconciliation.
  Exact partials resume; mismatched partials remain unchanged and fail closed;
  retry must not hit `EEXIST`.
- **R051-003 (P2) — Docker lifecycle evidence is textual: accepted.** Add an
  executable isolated Docker A->B capture/stage/restart/down-up test to the
  Docker validation path. Source/config regex assertions are supplemental.
- **R051-004 (CI baseline) — absolute worktree path in capture test: accepted.**
  Resolve the script module-relatively, run from temp cwd, and add an absolute-
  path negative scan. This is a portability failure, not an environment waiver.
- **R051-005 (P1) — Compose project identity mismatch: accepted.** Replace the
  cwd-basename fallback with the same effective key Compose uses and prove
  default/custom project agreement from an unrelated checkout basename.
- **R051-006 (P1) — idempotent candidate omits later legacy assets: accepted.**
  Move legacy-union validation and promotion before the complete-release
  shortcut; add exact append and collision/no-mutation regressions.
- **R051-007 (P1) — rejected state reused through attached container: accepted.**
  Rejected volume data cannot become a source under another path. Preserve and
  validate independent handoff state, use only a baked pre-feature fallback,
  and fail closed when neither is available.
- **R051-008 (P2) — static publish checks output after staging: accepted.**
  Validate/reject the destination before staging and prove the full release
  state remains unchanged on the negative path.
- **R051-009 (P2) — activation lacks a durable fsync barrier: accepted.** Fsync
  all promoted files and affected directories before the pointer swap, fsync the
  state directory after it, and fail closed on any sync/close error. Add ordered
  operation-trace and injected-failure coverage.
- **R051-010 (P1) — verification covers only current B assets: accepted.** Add a
  canonical cumulative retained inventory and require exact full-store equality
  before activation and for committed-state authority. Corrupt/missing/extra old
  A assets must block B.
- **R051-011 (P2) — browser proof has no actual legacy worker: accepted.** Use a
  registered, controlling worker produced by the historical A generator/policy,
  prove the lazy hash is excluded, and run both safe-origin and 404 controls
  through that worker.
- **R051-012 (P2) — Docker proof checks only the retained asset: accepted.** Add
  exact B shell/SW selection checks plus browser evidence that B's worker is
  activated and controlling across restart and `down/up`.
