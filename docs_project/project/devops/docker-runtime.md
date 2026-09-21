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
