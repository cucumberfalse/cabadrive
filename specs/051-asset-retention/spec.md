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
  releases/<release-id>/        # complete mutable candidate tree, no /assets copy
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
7. Atomically rename the verified candidate release directory and metadata into
   their final paths. Create `current.next` pointing only to that final release,
   then atomically rename the symlink over `current`.
8. Release the lock. Failed transactions retain the previously selected shell
   and valid assets; cleanup is limited to the exact transaction directory and
   may never delete retained assets or an active release.

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

