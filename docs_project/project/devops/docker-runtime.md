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

## Implementation

- `Dockerfile` builds the Vite app in a Node 22 Alpine stage.
- Runtime is nginx on port `8080` inside the container.
- `docker-compose.yml` maps host `5173` to container `8080`.
- `make down` stops the compose stack and is safe to run repeatedly.

## Validation

Runtime-affecting changes require:

```bash
make down
make build
make up
# browser or HTTP smoke test against http://localhost:5173
make down
```

CI includes a `docker-validation` job that runs this flow and checks the home page plus `sw.js`.
