# Docker Runtime

## Contract

Cabadrive runtime is Docker-only for end users:

```bash
make build
make up
make down
```

Each update uses an append-only, project-scoped `release-state` Docker volume.
Before a new shell becomes live, the `stager` verifies the candidate build and
adds its `/assets/` files beside every retained historical asset. It switches
the HTML and `sw.js` release pointer only after that stage succeeds. `make
build` captures `/assets/` from the prior container (or its prior Compose image
when stopped) before replacement; a detected release that cannot be captured
fails instead of being treated as a first install. `make down` intentionally
keeps the release-state volume, so a later `make up` retains old hashes.

The default Compose project is always `cabadrive`, even when the command is run
from a differently named checkout. Supplying `COMPOSE_PROJECT_NAME` changes the
same single identity for Compose, its volume/image/container discovery, the
handoff bind, and the stager. During a migration, a rejected release-state
volume is never copied back through an attached container: only a separately
validated handoff (canonical path/size/SHA-256 inventory plus source identity)
or the pre-feature image's baked asset root may seed retained assets. The
handoff publishes its `current` pointer atomically and remains local deployment
state. Capture failure stops `make build` before any image build starts. A
handoff is eligible for that pointer switch only after all captured files and
the complete directory ancestry have crossed their durability barriers.
The stager omits its legacy argument only when `current` is genuinely absent on
a clean install. Any supplied, dangling, incomplete, or inventory-mismatched
handoff is mandatory input and fails before release-state mutation.

The stager's exclusive publication lock is also project-scoped. Its durable
execution domain lives in `release-state`, so recreating the disposable stager
container does not change lock authority. Production staging holds a Linux
kernel advisory lock on one stable, no-follow `stage.lock` inode for the entire
transaction; namespace-local PIDs are diagnostic only. Container death releases
the lock in the kernel, while unsupported lock/filesystem semantics fail closed.
The stager image supplies the required `flock` utility. A legacy
`stage.lock.reclaim` hard link is removed only while that lock is held and only
when its device, inode, and complete recorded generation exactly match the
canonical lock; ambiguous evidence remains untouched and blocks staging.

No host Node.js or pnpm is required: the candidate build and staging command
run in Docker. The scoped handoff under `.cabadrive-release-handoff/` is local
deployment state and is not committed. Historical `/assets/` retention is
indefinite in this release; do not use `docker compose down -v` for a safe
upgrade path.

Optional static hosts must publish the complete merged tree atomically (or
upload and verify immutable assets without deletion, then switch HTML and
`sw.js` last). A candidate-only replacement or destructive sync is unsupported
for safe update continuity because an older open tab may request a lazy hash
that its cache has never loaded.
The target publish path must be new: an existing destination is rejected before
any release-state staging or pointer change, except that an exact already-
committed output/current/retained-ledger tuple is an idempotent recovery after a
journal-cleanup interruption. That recovery re-syncs the output tree and parent;
any byte, release, or ledger mismatch remains rejected without mutation.
A static output path that is the candidate path, contains it, or is contained by
it is rejected before release-state creation or transaction work; publication
may never mutate the candidate tree it inventories.
The same pre-mutation rejection applies when static output equals, contains, or
is contained by the release-state path, so publication cannot enter the retained
asset namespace.
A crash after the durable output journal but before its final rename resumes
only the exact journal-bound temporary sibling with unchanged prior state; an
ambiguous, hostile, drifted, or simultaneous temporary/final relation fails
closed.
After output rename, the journal remains `renamed-uncommitted` until the output
parent directory is fsynced. Recovery from that phase revalidates and re-syncs
the complete output and repeats the parent barrier before any retained release
or `current` activation; only then is the journal advanced to `output-durable`.
Recovery that observes both a verified release directory and metadata also
repeats the release-tree, metadata-file, and parent-directory durability
barriers before publishing `current`; visible bytes alone are not durability
evidence.
Legacy-handoff pointer publication also preserves the prior authoritative
target until the new pointer's root-directory barrier succeeds. If that barrier
fails, the prior pointer is restored and re-synced before capture cleanup may
remove the rejected release.

Every `make build`, `make up`, `make down`, `make logs`, and `make stage`
operation stops if the Compose project resolver reports ambiguity. No capture,
build, or Compose action may run with an empty fallback project identity.

After `make up`, the app is available at:

```text
http://localhost:5173
```

Agents validating parallel worktrees must isolate their compose project and host
port without changing the normal user default:

```bash
COMPOSE_PROJECT_NAME=cabadrive-021-isolation CABADRIVE_HOST_PORT=5175 make build
COMPOSE_PROJECT_NAME=cabadrive-021-isolation CABADRIVE_HOST_PORT=5175 make up
curl --fail --silent --show-error http://localhost:5175/
curl --fail --silent --show-error http://localhost:5175/sw.js
COMPOSE_PROJECT_NAME=cabadrive-021-isolation CABADRIVE_HOST_PORT=5175 make down
```

Agents must not stop, remove, rename, or otherwise mutate containers from
another compose project to clear a local conflict. Pick a free
`CABADRIVE_HOST_PORT` and a unique `COMPOSE_PROJECT_NAME` instead. The compose
file does not declare a fixed `image:` tag; Compose auto-tags the built image
from the compose project and service name, so isolated projects do not retag a
shared `cabadrive:local` image.

## Implementation

- `Dockerfile` builds the Vite app in a Node 22 Alpine stage.
- Runtime is nginx on port `8080` inside the container.
- `docker-compose.yml` maps host `${CABADRIVE_HOST_PORT:-5173}` to container
  `8080`.
- Compose owns container naming so container identity is scoped by the compose
  project instead of a fixed global `/cabadrive` name.
- Compose owns the local image tag for builds, so image identity is scoped by
  the compose project instead of a fixed shared `cabadrive:local` tag.
- `make down` stops only the current compose project stack and is safe to run
  repeatedly.

## Validation

Runtime-affecting changes require:

```bash
make down
make build
make up
# browser or HTTP smoke test against http://localhost:5173
make down
```

For isolated agent validation, run the same flow with both `COMPOSE_PROJECT_NAME`
and `CABADRIVE_HOST_PORT` set, then smoke the matching port. No extra image tag
override is required because the compose project name scopes the auto-generated
build image name.

CI includes a `docker-validation` job that runs this flow and checks the home page plus `sw.js`.
