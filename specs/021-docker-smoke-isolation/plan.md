# Plan: Docker Smoke Isolation For Parallel Worktrees

## Summary

Implement one narrow runtime-contract PR. Remove the fixed compose container name and shared local image tag, make the host port configurable with default `5173`, update Makefile/docs guidance so the smoke URL follows the configured port, and prove both default and isolated parallel-agent Docker flows.

This Architect pass creates only feature memory. Product code, tests, runtime files, docs outside this feature folder, commits, pushes, PRs, and review are assigned to later roles.

## Technical Context

- App shape: static React/TypeScript/Vite SPA served by nginx in Docker.
- End-user runtime contract: Docker-only `make build`, `make up`, `make down`.
- Default URL: `http://localhost:5173`.
- Container port: nginx serves on `8080`.
- Current Compose service: `cabadrive`.
- Current runtime bug: `docker-compose.yml` hardcodes `container_name: cabadrive` and `"5173:8080"`, so a second worktree collides on both container name and host port.
- Current CI `docker-validation`: builds image, runs `make up`, curls `http://localhost:5173/` and `/sw.js`, then `make down`.

## Constitution Check

- Spec-first: yes; Analyst intake exists and this plan creates `spec.md`, `plan.md`, and `tasks.md` before implementation.
- Testable boundaries: yes; compose config, default Docker smoke, isolated alternate-port Docker smoke, and sibling-preservation checks are concrete.
- Test-first bias: yes; implementation should add focused tests if a practical Makefile/compose validation path exists; otherwise command evidence is required.
- Supervised verification: yes; acceptance criteria require evidence for the default path and the parallel-agent path.
- PR-only workflow: yes; implementation must land through an isolated branch and PR.
- One worktree per task: yes; Implementation Agent must work only in the assigned worktree and preserve sibling containers/worktrees.
- Deployability: yes; default Docker runtime must remain working.
- Simplicity: yes; prefer Compose defaults and environment substitution over custom orchestration.
- Process memory: yes; `tasks.md` includes decisions, evidence, known issues, and feedback/disposition sections.

## Implementation Strategy

### Slice 1: Compose Isolation

Update `docker-compose.yml` so:

- `container_name: cabadrive` is removed.
- service name remains `cabadrive`.
- omit a fixed `image:` tag so Compose auto-tags the build with the compose project and service name.
- host port uses an environment default:

```yaml
ports:
  - "${CABADRIVE_HOST_PORT:-5173}:8080"
```

Rationale: Compose default naming already scopes containers by project. `COMPOSE_PROJECT_NAME` can be supplied by agents for explicit isolation without inventing a repository-specific wrapper. Compose also auto-tags build images by project and service when no explicit `image:` tag is declared, avoiding `cabadrive:local` retag races between parallel worktrees.

### Slice 2: Makefile And Smoke Guidance

Update `Makefile` so:

- `make build`, `make up`, `make down`, and `make logs` remain the primary targets.
- `make up` prints `http://localhost:${CABADRIVE_HOST_PORT:-5173}` or the Make equivalent.
- no target stops/removes a hardcoded container name.
- `make logs` still follows service logs, for example `docker compose logs -f cabadrive`.

Implementation may add a small `smoke` or `docker-smoke` target only if it reduces duplication and consumes the same `CABADRIVE_HOST_PORT` variable. Do not add it merely for polish.

### Slice 3: Docs And CI Alignment

Update durable runtime docs, likely:

```text
docs_project/project/devops/docker-runtime.md
docs_project/project/frontend/frontend-docs.md
docs_project/project/feature-inventory.md
```

Minimum doc change:

- default single-worktree flow still uses `make build`, `make up`, `make down`, URL `http://localhost:5173`;
- parallel-agent flow uses both:

```bash
COMPOSE_PROJECT_NAME=cabadrive-021-isolation CABADRIVE_HOST_PORT=5174 make build
COMPOSE_PROJECT_NAME=cabadrive-021-isolation CABADRIVE_HOST_PORT=5174 make up
curl --fail http://localhost:5174/
COMPOSE_PROJECT_NAME=cabadrive-021-isolation CABADRIVE_HOST_PORT=5174 make down
```

- agents get a project-scoped build image from Compose and do not need to set a custom image tag for isolated smoke;
- agents must not stop or remove containers from other compose projects to clear conflicts.

CI can remain on default `5173` if unchanged default behavior keeps `docker-validation` green. If implementation updates CI for consistency, it should set or reuse `CABADRIVE_HOST_PORT` in one place and avoid hardcoded drift.

### Slice 4: Verification And Process Memory

Run compose config and Docker smoke commands, then record exact evidence in `specs/021-docker-smoke-isolation/tasks.md`.

The isolated smoke should use a free alternate port, preferably `5174` if available. If `5174` is occupied, choose another free local port and record it.

When another Cabadrive stack is already running, record before/after evidence that it remained running. If no sibling stack is available, Implementation should create two isolated projects itself where safe:

1. Start default or first isolated project on one free port.
2. Start second isolated project with a different `COMPOSE_PROJECT_NAME` and port.
3. Run `make down` only for the second project.
4. Prove the first project still responds.
5. Clean up only projects created by the Implementation Agent.

Do not stop any pre-existing sibling project unless the user/Orchestrator explicitly authorizes it.

## Likely Changed Files

Expected implementation files:

```text
docker-compose.yml
Makefile
docs_project/project/devops/docker-runtime.md
docs_project/project/frontend/frontend-docs.md
docs_project/project/feature-inventory.md
.github/workflows/ci.yml
specs/021-docker-smoke-isolation/tasks.md
```

CI workflow changes are optional and should be made only if necessary to keep smoke configuration coherent.

Tests or scripts may be added only if they are small and directly validate the runtime contract. A broad Docker test harness is not required.

## Verification Plan

Required local checks for implementation:

```bash
git status --short --branch
docker compose config
make down
make build
make up
curl --fail --silent --show-error http://localhost:5173/
curl --fail --silent --show-error http://localhost:5173/sw.js
make down
COMPOSE_PROJECT_NAME=cabadrive-021-isolation CABADRIVE_HOST_PORT=<free-port> make build
COMPOSE_PROJECT_NAME=cabadrive-021-isolation CABADRIVE_HOST_PORT=<free-port> make up
curl --fail --silent --show-error http://localhost:<free-port>/
curl --fail --silent --show-error http://localhost:<free-port>/sw.js
COMPOSE_PROJECT_NAME=cabadrive-021-isolation CABADRIVE_HOST_PORT=<free-port> make down
git diff --check
node scripts/check-feature-memory.mjs origin/main HEAD
pnpm run check:repo
```

`pnpm run preflight` is recommended for runtime-contract PR readiness unless Orchestrator scopes it differently or records a precise environment blocker.

Required CI evidence after PR:

- `docker-validation` green with default settings.
- Other repository required checks green per `.unicorn-hub/config.json`.

## Review Plan

Review Agent should review as a runtime-contract fix:

- inspect `docker-compose.yml` for absence of `container_name`;
- inspect port interpolation/default;
- inspect Makefile targets for project-scoped Compose usage;
- inspect docs for default and parallel-agent paths;
- inspect verification evidence for both default and isolated smoke;
- confirm no sibling-container mutation was used as validation cleanup;
- confirm no learner-facing product/content behavior changed.

## Risks And Mitigations

- Risk: default URL breaks.
  - Mitigation: preserve `${CABADRIVE_HOST_PORT:-5173}` and require default smoke evidence.
- Risk: port collision remains for parallel worktrees.
  - Mitigation: document and verify `CABADRIVE_HOST_PORT=<free-port>`.
- Risk: project collision remains when two agents run from same basename or project.
  - Mitigation: document `COMPOSE_PROJECT_NAME=<unique>` for isolated agent runs.
- Risk: `make down` stops a sibling stack.
  - Mitigation: avoid hardcoded container operations; require before/after sibling-preservation evidence.
- Risk: shared image tag lets one worktree retag another worktree's smoke image.
  - Mitigation: omit the explicit tag and rely on Compose's project-scoped build image name.

## Rollback

If the change breaks default Docker runtime, revert only this feature's runtime/docs/process-memory changes on the feature branch. Do not stop or remove unrelated running containers while rolling back.

## Handoff To Orchestrator

Orchestrator may assign one Implementation Agent to the same isolated worktree/branch or a fresh isolated worktree/branch for the single runtime-contract PR slice. Implementation must start from complete feature memory and keep `tasks.md` current.
