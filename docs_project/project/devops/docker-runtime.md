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

Agents validating parallel worktrees may isolate their compose project and host
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
`CABADRIVE_HOST_PORT` and a unique `COMPOSE_PROJECT_NAME` instead.

## Implementation

- `Dockerfile` builds the Vite app in a Node 22 Alpine stage.
- Runtime is nginx on port `8080` inside the container.
- `docker-compose.yml` maps host `${CABADRIVE_HOST_PORT:-5173}` to container
  `8080`.
- Compose owns container naming so container identity is scoped by the compose
  project instead of a fixed global `/cabadrive` name.
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
and `CABADRIVE_HOST_PORT` set, then smoke the matching port.

CI includes a `docker-validation` job that runs this flow and checks the home page plus `sw.js`.
