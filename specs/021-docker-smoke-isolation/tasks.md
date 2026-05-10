# Tasks: Docker Smoke Isolation For Parallel Worktrees

## Architect Planning Setup

- [x] T001 Confirm assigned worktree is `/Users/chap/devel/cabadrive-021-docker-smoke-isolation`.
- [x] T002 Confirm active branch is `codex/021-docker-smoke-isolation`.
- [x] T003 Read `.specify/memory/constitution.md`.
- [x] T004 Read `docs_project/README.md`.
- [x] T005 Read `docs_project/project-idea.md`.
- [x] T006 Read `docs_project/project/frontend/frontend-docs.md`.
- [x] T007 Read `docs_project/project/backend/backend-docs.md`.
- [x] T008 Read `docs_project/project/feature-inventory.md`.
- [x] T009 Read `docs_project/screens/learning-and-exam-flows.md`.
- [x] T010 Read `docs/specify/README.md`.
- [x] T011 Read active `specs/021-docker-smoke-isolation/feature-request.md`.
- [x] T012 Inspect relevant runtime files read-only: `docker-compose.yml`, `Makefile`, `.github/workflows/ci.yml`, and `docs_project/project/devops/docker-runtime.md`.

## Architect Artifacts

- [x] T013 Create `spec.md` with goal, scope, requirements, acceptance criteria, negative scenarios, verification requirements, review requirements, and architectural decisions.
- [x] T014 Create `plan.md` with implementation strategy, expected changed files, verification plan, review plan, risks, rollback, and handoff.
- [x] T015 Create this `tasks.md` with implementation tasks, review tasks, process memory, evidence placeholders, and feedback-disposition sections.

## Required Slice A: Implementation Setup

- [x] T016 Confirm Implementation Agent starts from complete feature memory: `feature-request.md`, `spec.md`, `plan.md`, and `tasks.md`.
- [x] T017 Confirm Implementation Agent uses the Orchestrator-assigned isolated worktree and branch.
- [x] T018 Run `git status --short --branch` before editing and record any pre-existing dirty or untracked files.
- [x] T019 Inspect current `docker-compose.yml`, `Makefile`, `.github/workflows/ci.yml`, and Docker runtime docs before editing.
- [x] T020 Record any already-running Cabadrive Docker projects/containers read-only, if needed for sibling-preservation evidence.
- [x] T021 Confirm no sibling worktree, sibling branch, sibling PR, or sibling Docker container will be stopped, removed, renamed, or otherwise mutated.

## Required Slice B: Compose Runtime Isolation

- [x] T022 Remove the fixed `container_name: cabadrive` from `docker-compose.yml`, or replace it only with a project-scoped alternative justified in process memory.
- [x] T023 Make the host port configurable with default `5173`, preferably `${CABADRIVE_HOST_PORT:-5173}:8080`.
- [x] T024 Preserve the service name `cabadrive` and container port `8080` unless a concrete runtime reason is recorded.
- [x] T025 Remove mandatory `image: cabadrive:local` tagging so isolated smoke uses Compose project-scoped build images.
- [x] T026 Validate rendered compose config and record evidence that no fixed `container_name: cabadrive` remains.

## Required Slice C: Makefile And Smoke Guidance

- [x] T027 Update `Makefile` so `make up` prints a URL matching `CABADRIVE_HOST_PORT` with default `5173`.
- [x] T028 Confirm `make build`, `make up`, `make down`, and `make logs` remain the primary Docker targets.
- [x] T029 Confirm `make down` remains project-scoped through `docker compose down` and does not target a hardcoded container.
- [x] T030 Confirm `make logs` follows the `cabadrive` service rather than a hardcoded container name.
- [x] T031 Add a small smoke target only if it consumes the same port variable and clearly reduces validation duplication; otherwise record that no new target was needed.

## Required Slice D: Docs And CI Alignment

- [x] T032 Update durable Docker runtime docs with default single-worktree flow and parallel-agent override flow.
- [x] T033 Update `docs_project/project/frontend/frontend-docs.md` if needed so the runtime contract mentions configurable isolation without obscuring the default URL.
- [x] T034 Update `docs_project/project/feature-inventory.md` if needed to reflect isolated Docker runtime support.
- [x] T035 Update `.github/workflows/ci.yml` only if needed to keep `docker-validation` aligned with the port variable; otherwise record why default CI remains unchanged.
- [x] T036 Ensure docs explicitly say agents must not stop/remove sibling containers to clear conflicts.

## Required Slice E: Default Docker Verification

- [x] T037 Run `make down` with default environment before default smoke and record outcome.
- [x] T038 Run `make build` with default environment and record outcome.
- [x] T039 Run `make up` with default environment and record emitted URL, or record occupied-default-port blocker.
- [x] T040 Smoke `http://localhost:5173/` and record outcome, or record occupied-default-port blocker.
- [x] T041 Smoke `http://localhost:5173/sw.js` and record outcome, or record occupied-default-port blocker.
- [x] T042 Run `make down` with default environment and record outcome, or record why no default stack was started.

## Required Slice F: Isolated Parallel Docker Verification

- [x] T043 Choose and record a free alternate host port for isolated smoke.
- [x] T044 Choose and record a unique compose project name, for example `cabadrive-021-isolation`.
- [x] T045 If a sibling Cabadrive stack is already running, record read-only before evidence for it; if none is available, optionally create two implementation-owned isolated projects for the preservation test.
- [x] T046 Run `COMPOSE_PROJECT_NAME=<unique> CABADRIVE_HOST_PORT=<free-port> make build`.
- [x] T047 Run `COMPOSE_PROJECT_NAME=<unique> CABADRIVE_HOST_PORT=<free-port> make up`.
- [x] T048 Smoke `http://localhost:<free-port>/`.
- [x] T049 Smoke `http://localhost:<free-port>/sw.js`.
- [x] T050 Run `COMPOSE_PROJECT_NAME=<unique> CABADRIVE_HOST_PORT=<free-port> make down`.
- [x] T051 Record evidence that the sibling or first implementation-owned stack remained running after the isolated `make down`.
- [x] T052 Clean up only containers/projects created by this implementation, and record cleanup.

## Required Slice G: Repository Verification

- [x] T053 Run `git diff --check`.
- [x] T054 Run `node scripts/check-feature-memory.mjs origin/main HEAD` or the repository's current equivalent.
- [x] T055 Run `pnpm run check:repo`.
- [x] T056 Run `pnpm run preflight`, or record exact environment blocker and Orchestrator disposition.
- [x] T057 Run `git diff --name-only origin/main...HEAD` and confirm changed files are limited to scoped runtime/docs/CI-if-needed/tests-if-added and feature `021` process memory.
- [x] T058 Confirm no learner-facing product behavior, content data, translations, explanations, image metadata, overlays, service-worker semantics, or unrelated feature memory changed.
- [x] T059 Confirm no unresolved merge conflicts.
- [x] T060 Record all verification evidence in Process Memory before review.

## Review Requirements

- [x] T061 Review Agent verifies complete feature `021` memory exists and role boundaries were followed.
- [x] T062 Review Agent verifies `docker-compose.yml` no longer declares a fixed global `container_name`.
- [x] T063 Review Agent verifies host port configurability preserves default `5173`.
- [x] T064 Review Agent verifies Makefile targets use project-scoped Compose behavior and do not mutate hardcoded containers.
- [x] T065 Review Agent verifies docs explain both default and parallel-agent override flows.
- [x] T066 Review Agent verifies verification evidence includes default and isolated alternate-port Docker smoke, or exact blockers.
- [x] T067 Review Agent verifies isolated `make down` did not stop a sibling/first stack.
- [x] T068 Review Agent verifies no learner-facing product/content changes were included.
- [x] T069 Review Agent verifies no unresolved Implementation Agent feedback remains before merge readiness.
- [x] T070 Review Agent verifies Docker compose does not require a fixed shared `cabadrive:local` image tag and isolated smoke uses project-scoped image identity.

## Process Memory

### Architect Decisions

- Use Docker Compose project scoping as the container isolation boundary by removing fixed `container_name`.
- Use `CABADRIVE_HOST_PORT` for the configurable host port and preserve default `5173`.
- Use standard `COMPOSE_PROJECT_NAME` for explicit worktree/agent isolation rather than inventing a wrapper variable.
- Review fix decision: remove the fixed `image: cabadrive:local` tag because review found that parallel worktrees can retag the same local image and smoke a sibling branch. With no explicit image tag, Compose auto-tags local builds using the compose project and service name.
- Do not add a new smoke target unless it materially simplifies reuse of the same configured port.
- This feature does not close historical feature `009` T098 directly; it supplies an infrastructure fix and evidence path for later role-owned disposition.

### Context Evidence

- Architect branch/status check reported worktree `/Users/chap/devel/cabadrive-021-docker-smoke-isolation` on `codex/021-docker-smoke-isolation...origin/main` with untracked `specs/021-docker-smoke-isolation/` from intake/planning.
- Architect read `feature-request.md`, which records the original failure: `make up` failed because global container `/cabadrive` was already owned by another compose project, and fixed host port `5173` would remain a second collision point.
- Architect inspected current `docker-compose.yml`: service `cabadrive`, image `cabadrive:local`, fixed `container_name: cabadrive`, fixed port `"5173:8080"`.
- Architect inspected current `Makefile`: plain `docker compose build/up/down/logs` and fixed echo `Cabadrive is available at http://localhost:5173`.
- Architect inspected current `docs_project/project/devops/docker-runtime.md`: default Docker-only runtime documented at `http://localhost:5173` with smoke against that URL.
- Architect inspected current `.github/workflows/ci.yml`: `docker-validation` uses default `make build`, `make up`, curls `/` and `/sw.js` at `http://localhost:5173`, then `make down`.
- Review fix context: AI Review P2 thread `PRRT_kwDOSX65IM6A7Nop` reported that the first isolation change still shared `image: cabadrive:local`, allowing parallel worktrees to retag the same image and smoke a sibling branch.

### Dead Ends

- None during Architect planning.
- Implementation Agent first `pnpm run test` attempt failed because this isolated worktree did not have `node_modules`; `tests/domain.test.mjs` could not import `typescript`. `pnpm install --frozen-lockfile` completed from the lockfile, then `pnpm run test` passed.
- Review-fix `pnpm run test` first failed only because a new docs assertion expected an unwrapped Markdown sentence; the docs wrapped the sentence across lines. The assertion was changed to allow whitespace across the line break, then the full test suite passed.

### Known Issues

- Default-port Docker smoke was intentionally not started with `make up` because protected sibling container `/cabadrive` from compose project `cabadrive-main-final-validation` was already running on host port `5173`. This matched the user-provided safety condition for running isolated smoke instead of touching the sibling stack.
- Final T098 closure for feature `009` remains outside this feature and must be handled by a later role-owned process-memory disposition if desired.

### Verification Evidence

- Architect artifact creation only: `spec.md`, `plan.md`, and `tasks.md` were created under `specs/021-docker-smoke-isolation/`.
- No code, runtime, tests, durable docs outside the feature folder, commits, pushes, or PRs were performed during Architect planning.
- Implementation setup: `git status --short --branch` before edits reported `## codex/021-docker-smoke-isolation...origin/main` and untracked `specs/021-docker-smoke-isolation/`; no other pre-existing dirty files were present.
- Read-only sibling evidence before Docker smoke: `docker ps --format ... | rg 'cabadrive'` showed protected `cabadrive` running for compose project `cabadrive-main-final-validation`, working dir `/Users/chap/devel/cabadrive-main-final-validation`, on `0.0.0.0:5173->8080/tcp`.
- A separate `cabadrive-020-smoke` container on `5174` was initially observed, so Implementation chose port `5175`; `lsof -nP -iTCP:5175 -sTCP:LISTEN` returned no listeners.
- Compose config default: `docker compose config` rendered project `cabadrive-021-docker-smoke-isolation`, service `cabadrive`, no `container_name`, container target `8080`, and published host port `"5173"`.
- Compose config isolated: `COMPOSE_PROJECT_NAME=cabadrive-021-isolation CABADRIVE_HOST_PORT=5175 docker compose config` rendered project `cabadrive-021-isolation`, no `container_name`, target `8080`, and published host port `"5175"`.
- Default pre-smoke cleanup: `make down` ran `docker compose down` in the current worktree project and exited 0.
- Earlier pre-review default `make build` exited 0 and built `cabadrive:local`; default `make up` and default curls were skipped because `lsof -nP -iTCP:5173 -sTCP:LISTEN` showed Docker listening on `*:5173` for the protected sibling container. No default stack was started by this worktree, so no final default `make down` cleanup was needed beyond the pre-smoke cleanup.
- Isolated smoke command `COMPOSE_PROJECT_NAME=cabadrive-021-isolation CABADRIVE_HOST_PORT=5175 make down build up` exited 0, created `cabadrive-021-isolation-cabadrive-1`, and printed `Cabadrive is available at http://localhost:5175`.
- Isolated HTTP smoke passed: `curl --fail --silent --show-error http://localhost:5175/` returned the HTML document head, and `curl --fail --silent --show-error http://localhost:5175/sw.js` returned the generated service worker beginning with `const CACHE_NAME = "cabadrive-static-..."`.
- During isolated smoke, `docker ps` showed both `cabadrive-021-isolation-cabadrive-1` on `5175` and the protected sibling `cabadrive` on `5173`.
- Isolated cleanup command `COMPOSE_PROJECT_NAME=cabadrive-021-isolation CABADRIVE_HOST_PORT=5175 make down` stopped/removed only `cabadrive-021-isolation-cabadrive-1` and `cabadrive-021-isolation_default`.
- Sibling preservation evidence immediately after isolated cleanup: the same command output then showed protected `cabadrive` still `Up 4 hours` on `0.0.0.0:5173->8080/tcp` for project `cabadrive-main-final-validation`, working dir `/Users/chap/devel/cabadrive-main-final-validation`.
- Later read-only status after preflight found no running or stopped containers matching `cabadrive` in `docker ps` or `docker ps -a`; this happened after the isolated safety evidence above and after only non-Docker-mutating `pnpm`, `git`, and read-only `docker ps` checks by this Implementation Agent.
- `pnpm run validate:content` passed: difficulty labels validated for 460 questions and 38 topics; content validation passed for 460 category B fallback questions and 276 local image references.
- First `pnpm run test` attempt failed due missing `node_modules`/`typescript`, then `pnpm install --frozen-lockfile` completed successfully.
- Rerun `pnpm run test` passed: 119 tests, including new Docker runtime tests for compose container naming, configurable host port, Makefile URL output, and docs guidance.
- `git diff --check` passed.
- `pnpm run check:repo` passed with `Repository baseline check passed.`
- `pnpm run preflight` passed: feature-memory worktree gate, repo baseline, content validation, 119 Node tests, production build, and 34 Playwright e2e tests passed.
- Post-commit feature-memory gate passed: `node scripts/check-feature-memory.mjs origin/main HEAD` reported `Feature-memory gate passed via specs/021-docker-smoke-isolation/{spec,plan,tasks}.md`.
- Scoped diff verification before commit showed changes limited to `.github/workflows/ci.yml`, `Makefile`, `docker-compose.yml`, `docs_project/project/devops/docker-runtime.md`, `docs_project/project/feature-inventory.md`, `docs_project/project/frontend/frontend-docs.md`, `tests/docker-runtime.test.mjs`, and `specs/021-docker-smoke-isolation/` feature memory.
- Merge-conflict guard `git diff --name-only --diff-filter=U` returned no paths.
- No learner-facing product behavior, content data, translations, explanations, image metadata, overlays, service-worker semantics, or unrelated feature memory were changed.
- Review-fix edits removed the explicit `image: cabadrive:local` tag, updated docs/tests/spec memory to treat Compose's project-scoped build image as part of the isolation contract, and did not require CI changes because the default `make build`/`make up` flow still builds and runs within one compose project.
- Review-fix compose config default: `docker compose config` rendered project `cabadrive-021-docker-smoke-isolation`, service `cabadrive`, build context only, no `container_name`, no `image`, target `8080`, and published host port `"5173"`.
- Review-fix compose config isolated: `COMPOSE_PROJECT_NAME=cabadrive-021-review-fix CABADRIVE_HOST_PORT=5176 docker compose config` rendered project `cabadrive-021-review-fix`, build context only, no `container_name`, no `image`, target `8080`, and published host port `"5176"`.
- Review-fix read-only Docker status before smoke: `docker ps ... | rg 'cabadrive' || true` showed no running Cabadrive containers, and `lsof -nP -iTCP:5176 -sTCP:LISTEN || true` showed port `5176` free. `docker images ... | rg 'cabadrive|021' || true` showed an existing old `cabadrive:local` image, which the review-fix smoke did not retag.
- Review-fix isolated smoke command `COMPOSE_PROJECT_NAME=cabadrive-021-review-fix CABADRIVE_HOST_PORT=5176 make down build up` exited 0, built image `docker.io/library/cabadrive-021-review-fix-cabadrive`, created `cabadrive-021-review-fix-cabadrive-1`, and printed `Cabadrive is available at http://localhost:5176`.
- Review-fix isolated HTTP smoke passed: `curl --fail --silent --show-error http://localhost:5176/` returned the HTML document head with `<title>Cabadrive</title>`, and `curl --fail --silent --show-error http://localhost:5176/sw.js` returned the generated service worker beginning with `const CACHE_NAME = "cabadrive-static-..."`.
- Review-fix image evidence during smoke: `docker images --format ... | rg 'cabadrive|021-review-fix'` showed `cabadrive-021-review-fix-cabadrive:latest` with the new image ID and the pre-existing `cabadrive:local` image unchanged as a separate image.
- Review-fix cleanup command `COMPOSE_PROJECT_NAME=cabadrive-021-review-fix CABADRIVE_HOST_PORT=5176 make down` stopped/removed only `cabadrive-021-review-fix-cabadrive-1` and `cabadrive-021-review-fix_default`.
- Review-fix fixed-image search: `rg -n "image:\\s*cabadrive:local|CABADRIVE_IMAGE|cabadrive:local|fixed shared|project-scoped image|auto-tags" docker-compose.yml Makefile .github docs_project tests specs/021-docker-smoke-isolation` found no `image: cabadrive:local` in `docker-compose.yml`, `Makefile`, `.github`, or durable docs/tests; remaining `cabadrive:local` hits are historical context or assertions that reject the fixed tag.
- Review-fix `pnpm run validate:content` passed: difficulty labels validated for 460 questions and 38 topics; content validation passed for 460 category B fallback questions and 276 local image references.
- Review-fix `pnpm run test` passed: 120 tests, including the Docker runtime tests for project-scoped containers, configurable host port, no shared local image tag, Makefile URL output, and docs guidance.
- Review-fix `git diff --check` passed, and `git diff --name-only --diff-filter=U` returned no paths.
- Review-fix `pnpm run check:repo` passed with `Repository baseline check passed.`
- Review-fix feature-memory worktree gate passed: `node scripts/check-feature-memory.mjs --worktree` reported `Feature-memory gate passed via specs/021-docker-smoke-isolation/{spec,plan,tasks}.md`.

### Post-Merge Review Closure Evidence

- Final closure worktree for this process-memory-only pass: `/Users/chap/devel/cabadrive-021-final-task-closure` on branch `codex/021-final-task-closure`, created from `origin/main` at `f5fcb1602885022bb60b412f90bf290d51674c76`.
- PR #94 `[codex] Isolate Docker smoke runtime` merged into `main` at `2026-05-10T19:50:44Z`; merged head was `7627b74264acf1ff592db7be94db4d29336b49cb`.
- PR #94 required checks were green on the merged head: `AI Review`, `baseline-checks`, `docker-validation`, `guard`, and `osv-scan` all reported `SUCCESS`.
- PR #94 review thread `PRRT_kwDOSX65IM6A7Nop` for the shared `cabadrive:local` image tag was resolved; the final Codex review comment after retrigger reported no major issues.
- Complete feature `021` memory exists on `main`: `feature-request.md`, `spec.md`, `plan.md`, and this `tasks.md`. Analyst, Architect, Implementation Agent, and Review Agent work is recorded in the appropriate feature-memory sections.
- `docker-compose.yml` on `main` defines service `cabadrive` with Compose-owned project-scoped container naming, host mapping `${CABADRIVE_HOST_PORT:-5173}:8080`, container port `8080`, and no fixed global `container_name`.
- `docker-compose.yml` on `main` has no required shared `image: cabadrive:local`; Compose auto-tags local builds from the compose project and service name for isolated smoke identity.
- `Makefile` on `main` keeps `make build`, `make up`, `make down`, and `make logs` on plain `docker compose` commands. `make up` prints `http://localhost:${CABADRIVE_HOST_PORT:-5173}`, `make down` runs project-scoped `docker compose down`, and no target stops or removes a hardcoded container.
- Durable docs on `main` cover the default `http://localhost:5173` Docker flow and isolated agent smoke with unique `COMPOSE_PROJECT_NAME` plus `CABADRIVE_HOST_PORT`; docs also warn agents not to stop, remove, rename, or mutate sibling compose projects to clear conflicts.
- PR #94 verification evidence covers default compose config with host port `"5173"`, isolated compose config with host port `"5176"`, isolated Docker smoke at `http://localhost:5176/` and `/sw.js`, and project-scoped image `cabadrive-021-review-fix-cabadrive:latest`.
- PR #94 evidence records that isolated `make down` removed only the implementation-owned project (`cabadrive-021-review-fix-cabadrive-1` and `cabadrive-021-review-fix_default`). Earlier sibling-preservation evidence also recorded protected sibling `cabadrive` on `5173` still running after isolated cleanup.
- Final main preflight and Docker smoke after merge ran from `/Users/chap/devel/cabadrive-main-010-verification`: required preflight passed; Docker smoke used project-scoped container `cabadrive-main-010-verification-cabadrive-1` and image `cabadrive-main-010-verification-cabadrive`; HTTP returned `HTTP/1.1 200 OK`, HTML contained `<html lang="ru">` and `<title>Cabadrive</title>`, and `make down` removed the container/network.
- Read-only post-merge Docker status for this closure found no running Cabadrive containers after the final main smoke cleanup.
- PR #94 changed Docker runtime contract, Makefile/CI/docs/tests, and feature `021` memory only. The diff included no learner-facing product behavior, content data, translations, explanations, image metadata, overlays, or service-worker semantic changes.
- No unresolved Implementation Agent feedback remains for feature `021`; Architect disposition remains `None yet` because no feedback items were filed.

### Implementation Agent Feedback

- None yet.

### Architect Disposition Of Feedback

- None yet.
