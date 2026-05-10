# Feature Request: Docker Smoke Isolation For Parallel Worktrees

## Original Request

The user assigned Analyst intake for Cabadrive feature `021` in the isolated worktree `/Users/chap/devel/cabadrive-021-docker-smoke-isolation` on branch `codex/021-docker-smoke-isolation`.

The requested repository-changing follow-up is to make the Docker smoke/run contract work safely from isolated worktrees while parallel Orchestrators and agents are active. The immediate trigger was post-merge verification for feature `009` task T098 on `origin/main` commit `90a11d943880606586d4bc02aa7774a8d7a73f3d`: Orchestrator ran `make down`, `make build`, `make up`, HTTP smoke, and `make down` in a detached worktree. `make build` passed, but `make up` failed because Docker container name `/cabadrive` was already in use by container `0d6fc7e5f782...`. The reported Docker labels showed that existing container belonged to project `cabadrive-main-final-validation` with working directory `/Users/chap/devel/cabadrive-main-final-validation`.

The user identified the root cause as `docker-compose.yml` hardcoding `container_name: cabadrive` and a fixed host port `5173`. This violates the parallel-agent isolation instruction because one worktree's Docker smoke can block another worktree, and agents must not remove or mutate sibling containers. The desired direction is to remove the fixed container name and support configurable host ports while preserving the default normal-use URL `http://localhost:5173`.

Analyst role boundary for this intake: create exactly one artifact, `specs/021-docker-smoke-isolation/feature-request.md`; do not write `spec.md`, `plan.md`, `tasks.md`, code, tests, commits, pushes, or PRs.

## Project Context

- Cabadrive is a local-first static React/Vite trainer with no backend in the MVP.
- End-user runtime is Docker-only and documented as:
  - `make build`
  - `make up`
  - `make down`
  - default app URL `http://localhost:5173`
- The Docker image builds the static app and serves it with nginx on container port `8080`.
- Repository workflow requires isolated worktrees, one branch/PR per task slice, and preservation of sibling work. Agents must not delete or rename containers owned by another worktree merely to make their own validation pass.
- Required CI includes `docker-validation`, which currently runs `make build`, `make up`, curls `http://localhost:5173/` and `/sw.js`, then runs `make down`.

## Audit Evidence

- Worktree and branch confirmed for this intake:
  - Worktree: `/Users/chap/devel/cabadrive-021-docker-smoke-isolation`
  - Branch: `codex/021-docker-smoke-isolation`
  - HEAD: `90a11d943880606586d4bc02aa7774a8d7a73f3d`
- `.specify/memory/constitution.md` requires one worktree per task, parallel-work preservation, PR-only workflow, and deployability of the default branch.
- `docs_project/project/frontend/frontend-docs.md` and `docs_project/project/devops/docker-runtime.md` document the default Docker runtime contract as `make build`, `make up`, `make down`, serving at `http://localhost:5173`.
- `docker-compose.yml` currently hardcodes:
  - service `cabadrive`
  - image `cabadrive:local`
  - `container_name: cabadrive`
  - host-to-container port mapping `"5173:8080"`
- `Makefile` currently runs plain `docker compose build`, `docker compose up -d`, `docker compose down`, and prints `Cabadrive is available at http://localhost:5173`.
- `.github/workflows/ci.yml` `docker-validation` currently smokes only `http://localhost:5173` after `make up`.
- Feature `009` T098 remains explicitly unresolved in `specs/009-image-metadata-learning-support/tasks.md` because no exact local `make down`, `make build`, `make up`, HTTP/browser smoke, `make down` evidence was found, even though PR #63 had green CI `docker-validation`.
- Feature `019` process-memory closure preserved that T098 gap rather than pretending CI evidence was the same as local Docker smoke evidence.
- Feature `010` process memory records repeated local Docker smoke blockers caused by the same fixed `/cabadrive` container name. In those cases, agents did not remove sibling containers and instead recorded fallback Vite preview smoke evidence.
- The new user-provided T098 post-merge evidence shows the same class of blocker still exists on `origin/main` commit `90a11d943880606586d4bc02aa7774a8d7a73f3d`, with `make build` passing and `make up` failing because another worktree's `/cabadrive` container already exists.

No external research was needed for this intake because the failure mode, desired behavior, and relevant repository contracts are local repository/runtime concerns.

## Scope

This feature should update the Docker local runtime and smoke-test contract so multiple isolated worktrees can build and run Cabadrive Docker validation without colliding on a fixed container name.

Expected scope includes:

- Remove or avoid the hardcoded Docker container name that forces all worktrees to contend for `/cabadrive`.
- Support a configurable host port for local Docker runs and smoke checks.
- Preserve the default normal-user behavior and docs where `make up` serves `http://localhost:5173` when no override is supplied.
- Ensure `make down` stops only the compose stack for the current worktree/project and remains safe to run repeatedly.
- Update local smoke instructions and durable docs so agents know how to run an isolated Docker smoke when `5173` or a default project name is already occupied.
- Update CI or scripts only as needed to keep the existing `docker-validation` behavior green in GitHub Actions.
- Record verification expectations for both default local use and an isolated parallel-worktree run with a non-default host port or project identifier.

## Non-Goals

- Do not change learner-facing product behavior, content, translations, explanations, image metadata, overlays, service-worker semantics, or exam/study flows.
- Do not add a backend, remote runtime service, or non-Docker end-user runtime.
- Do not remove the documented default `http://localhost:5173` normal-use path.
- Do not require host Node.js or pnpm for end-user Docker runtime.
- Do not solve every possible Docker daemon or Docker Desktop availability issue; unreachable Docker daemon remains an environment blocker to record separately.
- Do not delete, stop, rename, or inspect-and-mutate sibling agents' Docker containers as part of normal validation.
- Do not close historical feature `009` T098 directly in this intake; any closure must come from later role-owned feature memory after implementation and verification evidence exists.

## Assumptions

- Docker Compose's default project naming can be made worktree-specific enough for local parallel runs when `container_name` is not fixed, or the Architect can specify an explicit project-name override if needed.
- The default host port can remain `5173` through environment-variable defaults, Makefile defaults, or equivalent local configuration.
- CI can continue using the default port because GitHub Actions jobs run in isolated environments.
- Local agents may need to run a smoke URL other than `http://localhost:5173` when another worktree already owns port `5173`.
- A configurable port must be reflected consistently in `make up` output, smoke instructions, and any CI/local validation command that curls the app.
- The Docker image tag may remain shared if it does not cause runtime isolation conflicts, but Architect should explicitly evaluate whether image naming or project naming also needs isolation.

## Risks

- Changing the Docker contract could break the simple end-user path if default `make up` no longer serves `http://localhost:5173`.
- Fixing only the container name may leave the fixed host port as the next collision point for parallel worktrees.
- Fixing only the host port may still leave `/cabadrive` container-name conflicts.
- `make down` behavior could become unsafe if it targets too broad a compose project or removes containers/networks outside the current worktree.
- CI `docker-validation` could drift from local smoke instructions if configurable ports are implemented in one path but not the other.
- Existing docs and feature-memory templates may continue telling agents to smoke only `http://localhost:5173`, causing false blockers or unsafe pressure to remove sibling containers.
- Historical feature `009` T098 evidence should not be rewritten as passed unless a later implementation produces exact evidence that satisfies the original local smoke requirement or records an honest disposition.

## Open Questions

- Should isolated local runs use only a configurable host port, or should Makefile/docs also expose a configurable Compose project name for explicit worktree isolation?
- Should the implementation add a dedicated smoke target, such as `make smoke` or `make docker-smoke`, that consumes the same configurable port as `make up`?
- Should the image tag stay `cabadrive:local`, or should isolated runs optionally tag images per project/worktree to avoid ambiguity in debugging?
- What exact evidence should later roles require to close feature `009` T098 or any follow-up process-memory gap after this infrastructure fix lands?

## Acceptance Expectations

The follow-up should be considered successful when later roles can provide evidence that:

- `make build`, `make up`, HTTP smoke, and `make down` still work with defaults and serve the app at `http://localhost:5173`.
- A second isolated worktree can run the Docker smoke flow without colliding with an already-running Cabadrive container from another worktree by using a documented non-default host port and, if needed, project identifier.
- Docker Compose no longer creates a fixed global container named `/cabadrive`.
- `make down` for one worktree does not stop or remove another worktree's running Cabadrive container.
- The emitted/local documented smoke URL matches the configured host port.
- GitHub `docker-validation` remains green with default settings.
- Durable docs and feature memory clearly explain the default path and the parallel-agent override path.
- Verification evidence includes both the default `5173` case and an isolated non-default-port case, or records an exact environment blocker if Docker itself is unavailable.
