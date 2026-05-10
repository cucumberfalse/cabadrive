# Spec: Docker Smoke Isolation For Parallel Worktrees

## Analyst Intake

- Source request: `feature-request.md`.
- Active feature folder: `specs/021-docker-smoke-isolation/`.
- Assigned Architect worktree: `/Users/chap/devel/cabadrive-021-docker-smoke-isolation`.
- Assigned branch: `codex/021-docker-smoke-isolation`.
- This Architect pass may create or update only `spec.md`, `plan.md`, and `tasks.md` in this feature folder.

## Goal

Make Cabadrive's Docker runtime contract safe for isolated worktrees and parallel agents while preserving the ordinary single-worktree default:

```text
make build
make up
http://localhost:5173
make down
```

The implementation must remove the global `/cabadrive` container-name collision, make the host port configurable for local smoke runs, and document how Orchestrator/Implementation agents can validate Docker without stopping or mutating another worktree's running Cabadrive container.

## Scope

In scope:

- Update Docker Compose service configuration so the runtime no longer creates a fixed global container named `/cabadrive`.
- Prefer Docker Compose default project-scoped container naming. If implementation keeps an explicit name, it must be project-scoped and justified in `tasks.md`.
- Make the host port configurable with a default that preserves `5173`, for example:

```yaml
ports:
  - "${CABADRIVE_HOST_PORT:-5173}:8080"
```

- Update `Makefile` output and any smoke guidance so the displayed URL matches the configured host port.
- Preserve default `make build`, `make up`, `make down`, and `make logs` behavior for ordinary single-worktree use.
- Add or update durable Docker runtime docs so agents know the default path and the parallel-agent override path.
- Update CI only if needed to keep `docker-validation` aligned with the configurable port and image-isolation contract.
- Add focused validation or tests if the repository has a practical place for them; otherwise require command evidence for compose config and Docker smoke.
- Keep active feature `021` process memory current during implementation.

Out of scope:

- Learner-facing UI, content, translations, explanations, image metadata, overlays, service-worker semantics, study flow, or exam flow changes.
- Adding a backend, remote runtime service, non-Docker end-user runtime, or host Node/pnpm requirement for end users.
- Removing or changing the default app URL when no override is supplied.
- Deleting, stopping, renaming, or otherwise mutating sibling agents' Docker containers to make validation pass.
- Closing historical feature `009` T098 directly in this feature. This feature may produce infrastructure evidence that a later Orchestrator/role-owned closure can cite.
- Changing branch protection, secrets, production resources, or unrelated feature memory.

## User Stories

### User Story 1

As a normal local user, I want `make up` to keep serving Cabadrive at `http://localhost:5173`, so the documented Docker-only workflow stays simple.

### User Story 2

As an Implementation Agent in an isolated worktree, I want to choose a non-default host port and project name for Docker smoke, so I can validate my branch while another Cabadrive stack remains running.

### User Story 3

As an Orchestrator, I want `make down` to affect only the current compose project, so validation never requires stopping a sibling worktree's container.

### User Story 4

As a reviewer, I want concrete evidence for default and isolated Docker smoke paths, so the fix is proven against both the old user path and the parallel-agent failure mode.

## Functional Requirements

- FR-001: `docker-compose.yml` must not create a fixed global container named `cabadrive` or `/cabadrive`.
- FR-002: Compose container identity must be scoped by the compose project, preferably through Compose's default naming.
- FR-003: Host port must be configurable through an environment variable with default `5173`.
- FR-004: Container port must remain `8080` unless implementation records a concrete nginx/runtime reason to change it.
- FR-005: With no environment overrides, `make build`, `make up`, HTTP smoke at `http://localhost:5173/`, HTTP smoke at `http://localhost:5173/sw.js`, and `make down` must pass.
- FR-006: With `CABADRIVE_HOST_PORT=<alternate>` set, `make up` must bind that alternate host port and print or document the matching `http://localhost:<alternate>` smoke URL.
- FR-007: The implementation must support explicit compose project isolation for agents, using the standard `COMPOSE_PROJECT_NAME=<unique-name>` environment variable unless a better repository-local variable is justified.
- FR-008: `make down` must continue to run `docker compose down` for the current project context and must not target a hardcoded container name.
- FR-009: `make logs` must continue to work for the `cabadrive` service without requiring a fixed container name.
- FR-010: CI `docker-validation` must remain green with default settings and may continue smoking `http://localhost:5173` unless the workflow is updated to consume the same port variable.
- FR-011: Durable docs must describe:
  - default normal use;
  - isolated parallel-agent use with `COMPOSE_PROJECT_NAME` and `CABADRIVE_HOST_PORT`;
  - isolated build image behavior;
  - the rule that agents must not stop/remove sibling containers to clear conflicts.
- FR-012: Feature `021` `tasks.md` must record implementation decisions, dead ends, known issues, verification evidence, and Implementation Agent feedback.
- FR-013: Docker compose must not require all worktrees to build or run through a fixed shared `cabadrive:local` image tag; image identity must be either project-scoped by Compose or explicitly configurable for isolated smoke.

## Acceptance Criteria

1. Given no Docker overrides are supplied, `make build`, `make up`, HTTP smoke for `/` and `/sw.js` at `http://localhost:5173`, and `make down` succeed.
2. Given `docker compose config` is inspected after implementation, the compose model contains no `container_name: cabadrive`.
3. Given an existing Cabadrive compose stack from another project is already running, a second worktree can run `COMPOSE_PROJECT_NAME=<unique> CABADRIVE_HOST_PORT=<free-port> make build`, `make up`, HTTP smoke for `/` and `/sw.js`, and `make down` without container-name conflict.
4. Given a sibling Cabadrive stack is running before the isolated smoke, it remains running after the isolated worktree's `make down`.
5. Given `CABADRIVE_HOST_PORT=<alternate>` is used, the emitted or documented smoke URL uses that alternate port.
6. Given no override is supplied, all docs and Makefile output still point ordinary users to `http://localhost:5173`.
7. Given isolated compose config is rendered, it does not contain a mandatory fixed `cabadrive:local` image tag.
8. Given CI runs `docker-validation`, the Docker image builds, app starts, smoke checks pass, and cleanup runs with default settings.
9. Given local verification runs, `git diff --check`, feature-memory validation, repository baseline/preflight as appropriate, compose config validation, default Docker smoke, and isolated alternate-port Docker smoke pass or exact unrelated blockers are recorded.

## Negative Scenarios

- A remaining fixed `container_name: cabadrive` is not acceptable.
- A fix that only changes the container name while leaving host port `5173` unconfigurable is not acceptable.
- A fix that only changes the host port while leaving a global container name collision is not acceptable.
- A default `make up` path that no longer serves `http://localhost:5173` is not acceptable.
- A build flow that always retags the shared `cabadrive:local` image during isolated smoke is not acceptable.
- A validation flow that requires `docker rm`, `docker stop`, `docker compose down` against another worktree's project, or any mutation of sibling containers is not acceptable.
- A hardcoded alternate port in CI or docs that drifts from `CABADRIVE_HOST_PORT` is not acceptable.
- A new runtime dependency on host Node.js or pnpm for end users is not acceptable.

## Verification Requirements

Implementation must record command evidence for:

- `git status --short --branch`
- `docker compose config` or equivalent compose-render command proving no fixed `container_name`
- default Docker flow:

```bash
make down
make build
make up
curl --fail --silent --show-error http://localhost:5173/
curl --fail --silent --show-error http://localhost:5173/sw.js
make down
```

- isolated Docker flow while preserving any sibling stack:

```bash
COMPOSE_PROJECT_NAME=cabadrive-021-isolation CABADRIVE_HOST_PORT=<free-port> make build
COMPOSE_PROJECT_NAME=cabadrive-021-isolation CABADRIVE_HOST_PORT=<free-port> make up
curl --fail --silent --show-error http://localhost:<free-port>/
curl --fail --silent --show-error http://localhost:<free-port>/sw.js
COMPOSE_PROJECT_NAME=cabadrive-021-isolation CABADRIVE_HOST_PORT=<free-port> make down
```

- evidence that an already-running sibling project/container remains running after isolated `make down`, when a sibling stack is available in the environment;
- `git diff --check`;
- `node scripts/check-feature-memory.mjs origin/main HEAD` for the implementation PR, or the repository's current equivalent;
- `pnpm run check:repo` or `pnpm run preflight` as Orchestrator requires for the runtime change.

If Docker is unavailable, the Implementation Agent must record the exact Docker daemon/environment blocker and still provide `docker compose config` evidence if possible.

## Review Requirements

Review Agent must verify:

- Complete feature `021` memory exists before implementation changes.
- The diff is limited to Docker runtime contract, Makefile/smoke guidance, CI if justified, durable Docker docs, tests if added, and feature `021` tasks.
- No product UI/content behavior changed.
- Compose no longer declares the fixed container name.
- Host port configurability preserves the `5173` default.
- `make down` remains project-scoped and does not include hardcoded container operations.
- Verification evidence includes both default and isolated alternate-port Docker smoke, or exact environment blockers.
- Process memory records any Implementation Agent feedback and Architect disposition before merge readiness.

## Architectural Decisions

- Use Docker Compose project scoping as the isolation boundary. Removing `container_name` lets Compose name containers from project, service, and index, avoiding a global `/cabadrive` collision.
- Use `CABADRIVE_HOST_PORT` for the user-facing host port because the name is project-specific and clear in shell examples. Keep `COMPOSE_PROJECT_NAME` as the standard Compose mechanism for project isolation rather than wrapping it with a second custom variable.
- Do not declare a fixed `cabadrive:local` image tag. Let Compose auto-tag the build from the project and service name so isolated smoke does not retag a sibling worktree's image.
- Do not add a new abstraction or Docker wrapper script unless Makefile/env substitution cannot keep the contract simple.
