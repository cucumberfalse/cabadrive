# Feature Request: Preserve discovered Compose project provenance across Make lifecycle commands

## Intake metadata

- Feature ID: `052-compose-project-provenance`
- Intake role: Analyst
- Assigned worktree: `/Users/chap/devel/cabadrive-worktrees/051-asset-retention`
- Assigned branch and PR slice: `codex/051-asset-retention`, PR #217
- Verified latest `origin/main` supplied by Orchestrator:
  `2a92bcfcb7638d1094f33b28e4c2932fb2e4121e`.
- Current clean PR head supplied by Orchestrator and locally confirmed:
  `80d212ae76e84c1ad1ce8191a1609362a4c48eb8`; it descends from the verified
  latest-main SHA.
- Numbering context: the maximum existing feature prefix is `051`, so the next
  feature prefix is `052`.
- Parallel-work warning: other worktrees, branches, commits, PRs, dirty diffs,
  and process memory may exist. They must be preserved; this intake does not
  reset, rebase, overwrite, close, delete, or otherwise mutate sibling work.
- Analyst scope: this folder and this one `feature-request.md` only. No code,
  tests, durable product docs, Architect artifacts, commits, pushes, reviews,
  or merge actions are part of intake.

## Startup fallback and PR context

The normal fresh-worktree rule cannot represent this follow-up faithfully yet:
the defect is in the unmerged implementation of feature 051 on PR #217, while
the latest verified `main` is the known ancestor of that PR and does not contain
the affected code. A separate latest-main branch or PR could not test or fix the
defect without duplicating the entire unmerged prerequisite.

Orchestrator therefore explicitly assigned this intake to the existing clean
PR #217 worktree and branch as a documented startup fallback. Feature 052 must
remain a narrow follow-up within that PR slice. The fallback does not authorize
unrelated changes, history rewriting, or loss of the existing feature-051
evidence. Architect and Implementation Agent must preserve both feature
memories and record the effective head used for renewed final validation.

## Authority and originating intent

The user has repeatedly instructed the Orchestrator to continue through merge,
to do everything necessary, and to avoid repeated token-burning cycles without
reducing result quality. During the current-head required review of PR #217,
review thread `r4121580555` found a genuine deployment defect after feature 051
had reached its maximum Architect return count (`10 / 10`). Repository process
therefore requires a new feature request rather than an eleventh return inside
feature 051.

The user-facing intent remains safe updates: an existing installation must keep
using the same discovered historical Docker Compose project and retained assets
through `make build`, `make up`, and later lifecycle commands. A successful
build must not silently cause the next command to select a different project,
volume, image, or retained-asset history.

## Product and technical context

Cabadrive is a local-first static PWA served through the Docker-only lifecycle
`make build`, `make up`, and `make down`. Feature 051 adds retained immutable
assets and first-upgrade adoption of one uniquely provable pre-feature Compose
project. A discovered non-default project must be persisted in the
repository-owned `.cabadrive-release-handoff/.adopted-project` record so later
commands resolve the same deployment identity after the historical image has
been replaced by a post-feature image.

The current Make recipe performs these steps:

1. `capture-legacy-assets.sh --resolve-project` discovers a historical project;
2. Make exports that result as `COMPOSE_PROJECT_NAME`;
3. Make invokes `capture-legacy-assets.sh`;
4. the capture script sees `COMPOSE_PROJECT_NAME` already set and classifies it
   as caller-explicit;
5. because it appears explicit, capture skips persistence of
   `.adopted-project`;
6. `docker compose build` replaces or labels the historical runtime image;
7. a later `make up` can no longer rediscover the historical identity and falls
   back to `cabadrive`.

The selected project value is correct during the build, but its provenance has
been flattened. The system can no longer distinguish a value explicitly chosen
by the caller from one discovered by the repository resolver. That distinction
is required to decide whether adoption must be persisted.

Relevant durable context read during intake includes the constitution,
project overview, frontend/backend/runtime documentation, feature inventory,
learning/exam flows, specification archive guidance, and feature-051 memory.
No external research is needed because the defect is fully evidenced by the
repository lifecycle and current-head review.

## Problem statement

When `COMPOSE_PROJECT_NAME` is initially unset and `make build` discovers a
valid non-default historical Compose project, the Make wrapper exports only the
resolved value before invoking capture. Capture consequently mistakes a
resolver-discovered identity for a caller-explicit identity and does not write
the durable adoption record. Once the build replaces the evidence used for
historical discovery, `make up` may resolve the default `cabadrive` project
instead of the project used for the build.

This splits a single update across different Compose projects and therefore
different retained-state volumes, images, containers, and handoff paths. It can
make the just-built release unavailable to the next lifecycle command and can
break the retained-origin guarantee that feature 051 exists to provide.

## Desired outcome

The Make/capture boundary preserves both the selected Compose project and its
origin. A project explicitly supplied by the caller remains authoritative and
is never silently persisted as an adopted discovery. A unique historical
project discovered while the caller left `COMPOSE_PROJECT_NAME` unset is used
for the current build and durably adopted before the historical discovery
evidence can be replaced. Every later lifecycle command resolves that same
project. Failure to persist a required adoption aborts before image replacement
or any action that could strand the deployment between identities.

## Scope

### In scope

- Preserve explicit-versus-discovered project provenance across the Make
  resolver-to-capture boundary.
- Persist a validated discovered non-default project exactly when adoption is
  required, before `docker compose build` can replace historical evidence.
- Keep explicit `COMPOSE_PROJECT_NAME` authoritative without creating or
  overwriting an adoption record merely because the explicit value is
  non-default.
- Ensure `make build`, followed by `make up`, `make down`, `make logs`, or
  `make stage`, resolves one consistent Compose project after first-upgrade
  discovery.
- Fail closed before build/replacement when required adoption persistence is
  unsafe or fails.
- Add focused executable regression coverage for the actual Make wrapper and
  the post-build loss of historical discovery evidence.
- Re-run the relevant feature-051 focused, preflight, and Docker lifecycle
  checks required by Architect before PR #217 can return to final validation.
- Reconcile the current process-memory contradiction identified by review
  thread `r4121580548` through role-owned edits: passing final Analyst evidence
  already exists in `feature-request.md`, while stale feature-051 memory still
  says final Analyst validation was not invoked or remains pending. Architect
  must identify the exact role-owned correction; Implementation must not
  rewrite Analyst-owned validation evidence.

### Out of scope

- Changing the retained-asset staging, atomic publication, collision,
  durability, or static-export algorithms except where directly required by
  the project-provenance fix.
- Adding a new Compose project naming policy or changing the default
  `cabadrive` identity for genuinely clean installs.
- Adopting ambiguous, unsafe, unvalidated, or unrelated Docker resources.
- Overwriting a caller's explicit `COMPOSE_PROJECT_NAME` choice.
- Automatic migration, deletion, or garbage collection of unrelated Compose
  projects, volumes, images, containers, or handoff state.
- Reopening already resolved feature-051 findings or initiating a new broad
  exploratory audit.
- Changes to learner scheduling, service-worker UX, or PR #215 beyond its
  already recorded post-prerequisite synchronization and validation.

## Acceptance expectations

### R052-1: provenance survives the Make boundary

Given an unset caller environment and one uniquely valid historical project,
when a Make lifecycle recipe resolves the project and invokes capture, capture
must retain authoritative evidence that the value was discovered rather than
caller-explicit. Passing the resolved value for consistent Compose execution
must not erase its provenance.

### R052-2: discovered adoption is durable before replacement

Given a discovered validated non-default historical project, `make build` must
persist the validated adoption record before the Docker build can replace or
relabel the historical image used for discovery. If the record cannot be
written and durably published under the established feature-051 safety
contract, capture and build must stop; no image replacement starts.

### R052-3: post-build lifecycle continuity

After the historical discovery evidence is deliberately made unavailable in
the same way a successful post-feature build makes it unavailable, a subsequent
resolver call and `make up` must still select the adopted historical project,
not `cabadrive`. The same durable identity must govern its release-state volume,
runtime image/container, handoff path, and stager.

### R052-4: explicit caller choice remains explicit

Given a valid caller-supplied `COMPOSE_PROJECT_NAME`, Make and capture use that
exact project. The workflow must not misclassify it as discovered, must not
create an adoption record solely because it is non-default, and must not
replace an existing adoption record with the explicit one.

### R052-5: clean install remains stable

Given no explicit project, no adopted record, and no valid historical project,
the resolver still selects `cabadrive`. The fix must not create a spurious
adoption record or require historical state for a clean install.

### R052-6: ambiguity and unsafe state remain fail-closed

Ambiguous historical candidates, invalid project names, unsafe adoption paths,
unreadable Docker discovery, and failed adoption publication continue to abort
before capture/build mutation. No fallback to `cabadrive` may conceal a failed
or ambiguous migration.

### R052-7: executable regression proves the complete sequence

An automated test must exercise the real Make-to-capture contract, not only an
isolated helper. It must prove at minimum:

1. `COMPOSE_PROJECT_NAME` starts unset;
2. a non-default historical project is uniquely discovered;
3. the build path invokes capture and records the adoption;
4. historical discovery evidence is then removed or converted to post-feature
   evidence;
5. the next lifecycle resolution/action still uses the same adopted project;
6. a negative control demonstrates the old flattened-provenance behavior would
   fall back to `cabadrive` when the adoption record is absent.

### R052-8: merge-readiness evidence is coherent

Feature 052 receives Architect-owned `spec.md`, `plan.md`, and `tasks.md`,
focused verification, review disposition, final Architect validation, and then
final Analyst validation on the renewed effective content head. Feature-051
process memory must no longer contradict its already recorded final Analyst
pass. The current PR head must have green required checks and no unresolved
blocking review threads before Orchestrator finalizes PR #217.

## Required negative scenarios

- Explicit non-default project: it is used but not persisted as a newly
  discovered adoption.
- Discovered non-default project with adoption write/publication failure: build
  replacement does not start.
- Discovered project with missing adoption after historical evidence disappears:
  the regression control falls back to `cabadrive`, proving the original bug.
- Multiple historical candidates: fail without choosing or persisting one.
- Unsafe or malformed `.adopted-project` state: fail without Docker lifecycle
  mutation.
- Docker discovery or inspection failure: fail rather than treating it as a
  clean install.
- Genuine clean install: use `cabadrive` without a false adoption record.

## Assumptions and Architect decisions

- **A1 — no user clarification required.** The required behavior is determined
  by the current review finding, the documented Docker contract, and the user's
  existing authorization to continue through merge.
- **A2 — provenance mechanism.** Architect chooses the smallest explicit
  interface that cannot confuse caller input with resolver output. A separate
  flag/mode or a single combined capture-and-resolve operation are possible;
  ambient-value guessing is not sufficient.
- **A3 — ordering.** Required adoption must become authoritative before any
  build action can destroy the evidence needed to rediscover it.
- **A4 — existing safety rules remain binding.** Project-name validation,
  repository-owned handoff containment, exact discovery, ambiguity rejection,
  Docker failure handling, and capture short-circuit behavior from feature 051
  must not be weakened.
- **A5 — one PR slice.** Because the affected code is unmerged and exists only
  on PR #217, feature 052 is planned and implemented in that existing clean
  branch/worktree under Orchestrator control. This is the recorded exception to
  a fresh latest-main branch, not a general workflow change.
- **A6 — bounded review.** Verification should target this exact provenance
  defect and affected lifecycle contracts. It must not manufacture another
  unbounded exploratory loop after feature 051 exhausted its return budget.
- **A7 — role ownership.** Analyst-owned pass evidence remains Analyst-owned.
  Architect may correct Architect-owned status/disposition text and assign any
  necessary task; Implementation may update only its assigned implementation
  and task evidence.

## Risks and mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Resolver output is still treated as caller input | Adoption is skipped; later commands split projects | Carry explicit provenance through one tested interface |
| Adoption is written after image build | Historical evidence can disappear before durable continuity exists | Persist and verify adoption before build starts |
| Explicit user choice is persisted | Later unset commands unexpectedly inherit a one-off override | Preserve caller-explicit status and negative-test no adoption write |
| Fix bypasses existing path/name checks | Unsafe state or unrelated Docker resources could be adopted | Reuse feature-051 validators and fail-closed discovery contract |
| Test mocks only the resolver | Make wrapper regression survives | Exercise the actual Make recipe boundary and consecutive lifecycle sequence |
| Process contradiction remains | Finalizer/reviewer cannot trust validation state | Role-owned reconciliation plus exact-head final validation |
| Follow-up becomes another broad audit cycle | Merge is delayed without improving the reported behavior | Limit work and review to R052 acceptance plus affected regression gates |

## Verification evidence required before merge

- Focused automated tests for discovered, explicit, clean-install, ambiguous,
  unsafe-state, and persistence-failure paths.
- An executable Make-level regression proving discovered non-default identity is
  persisted before build and reused after historical evidence disappears.
- Evidence that no Docker build/action begins when required adoption
  persistence fails.
- Relevant feature-051 capture and Docker-contract tests green on the renewed
  effective content head.
- Full repository preflight and the Architect-required isolated real Docker
  lifecycle on the renewed effective content head.
- Review disposition for `r4121580555` and role-correct reconciliation of
  `r4121580548`.
- Final Architect validation followed by final Analyst validation, both naming
  the same renewed effective content head, followed by current-head guards and
  green required GitHub checks.

## Role boundaries and handoff

- Analyst has written only this intake artifact and now returns control to
  Orchestrator.
- Architect must create feature-052 `spec.md`, `plan.md`, and `tasks.md`, define
  the provenance interface and command ordering, assign exact tests and
  process-memory reconciliation, and preserve the existing feature-051 safety
  contract.
- Implementation Agent may edit only after full feature-052 planning exists and
  Orchestrator assigns the existing PR #217 worktree/branch as the implementation
  slice. It must update feature-052 tasks and record verification evidence.
- Review Agent reviews the narrow resulting diff and acceptance evidence without
  editing files or starting an unrelated discovery audit.
- Orchestrator coordinates renewed final validation and may merge PR #217 only
  after the current head satisfies all required gates; afterward it continues
  the already required synchronization and validation of PR #215.

## Initial cycle context

Feature 052 begins because the current-head review of PR #217 found a product
defect after feature 051 exhausted its permitted Architect returns. It is a new
work cycle and new feature memory, but intentionally shares PR #217's existing
clean branch/worktree due to the documented unmerged-code startup fallback.
The immediate target is review thread `r4121580555`; thread `r4121580548` is the
adjacent process-memory reconciliation needed for trustworthy finalization.

No implementation or validation pass is claimed by this intake. Architect
planning, implementation, review, final Architect validation, final Analyst
validation, current-head guards, and merge remain pending.
