# Docker Runtime

## Contract

Cabadrive runtime is Docker-only for end users:

```bash
make build
make up
make down
```

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
- Runtime is nginx on port `8080` inside the container, served from the
  `nginxinc/nginx-unprivileged:1.29-alpine` image so the nginx master runs as a
  non-root user (uid 101) rather than root.
- `nginx.conf` applies a split cache policy (immutable, one-year
  `Cache-Control` on hashed `/assets/` bundles; `max-age=86400` plus
  `stale-while-revalidate` on non-hashed `/content/assets/` media), baseline
  security headers (including a strict `'self'` Content-Security-Policy,
  `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, and
  `Permissions-Policy`), and gzip for text responses. Cache-Control is derived
  from a single `map $uri` and emitted with the security headers via one
  server-level `add_header`, so no `location` block overrides header
  inheritance.
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
