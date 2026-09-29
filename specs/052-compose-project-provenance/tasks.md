# Tasks: Preserve Compose Project Provenance Across Make

## Cycle Context

- Feature: `052-compose-project-provenance`.
- Verified latest `origin/main` supplied by Orchestrator:
  `2a92bcfcb7638d1094f33b28e4c2932fb2e4121e`.
- Assigned fallback slice: PR #217, `codex/051-asset-retention`,
  `/Users/chap/devel/cabadrive-worktrees/051-asset-retention`.
- Intake head: `80d212ae76e84c1ad1ce8191a1609362a4c48eb8`.
- Reason for fallback: the defect is in unmerged feature-051 code absent from
  `main`; this new cycle must remain a narrow addition to PR #217.
- Parallel work exists. Preserve sibling worktrees, branches, commits, diffs,
  PRs, process memory, and Docker projects. Do not mutate PR #214 or #215.
- Cycle PR set: PR #217 only; renewed effective content head is pending.

## Setup And Test-First

- [x] T052-001 Implementation Agent confirms explicit Orchestrator assignment,
  exact worktree/branch/PR/head, known dirty state containing only feature-052
  planning, complete four-file feature memory, and parallel-work preservation.
- [x] T052-002 Inspect the Make/capture implementation and affected tests/docs;
  record the pre-edit diff and ensure no runtime handoff artifacts are tracked.
- [x] T052-003 Add an isolated executable regression using the actual Makefile
  and capture script: caller project unset, unique non-default historical
  project discovered, `make build` transitions its evidence to post-feature,
  and a later Make lifecycle target still uses the adopted project.
- [x] T052-004 Run T052-003 against the intake behavior and record the expected
  failure: no adoption is written because Make pre-exports resolver output.
- [x] T052-005 Add negative controls for absent adoption after evidence loss,
  caller-explicit non-default identity/no adoption overwrite, adoption
  publication failure/no build sentinel, and genuine clean install.

## Implementation

- [x] T052-006 Change the first `make build` recipe to invoke capture with the
  caller's original environment. Keep capture and image build as separate
  fail-fast recipes; retain the resolver/export boundary for the build command
  and all other lifecycle targets.
- [x] T052-007 Keep feature-051 project validation, discovery, adopted-record
  containment, ambiguity, Docker-error, and default-project behavior unchanged.
  No new provenance environment variable, CLI mode, or duplicated resolver.
- [x] T052-008 Inspect directly affected durable runtime documentation and
  update it only if it states the old Make/capture boundary.
- [x] T052-009 Keep this file current with test-first evidence, decisions, dead
  ends, known issues, Implementation Agent feedback, exact results, cycle PR
  metadata, and the renewed effective content head.

## Verification

- [x] T052-010 Run focused capture/Make regression and affected Docker/runtime
  contract tests; all discovered/explicit/default/ambiguous/unsafe/failure paths
  pass.
- [x] T052-011 Run `git diff --check`, feature-memory/repository guards, and
  full `pnpm run preflight` on the implementation content head.
- [x] T052-012 Run the established isolated real Docker asset-retention
  lifecycle with a unique project/port; prove project-scoped image, volume,
  handoff, stager, restart, and down/up continuity without sibling mutation.
- [x] T052-013 Inspect final scope: only allowed Make/test/direct-doc/process
  files changed; no handoff/runtime artifact, dependency, sibling-memory edit,
  broad workflow change, or weakened gate exists.

## Review And Final Validation

- [x] T052-014 Review Agent inspected exact head
  `f679ee25ab3cbcc5f966a8ab49d70d992e748757` for
  R052-001/R052-002, actual-boundary regression strength, failure ordering,
  explicit/default behavior, scope, and role/process compliance. It opened
  R052-003 (`r4134154337`) for the status-collapsing runtime-label pipeline and
  R052-004 (`r4134154325`) for expected final role-validation evidence.
- [x] T052-014a Implement R052-003 test-first: replace the runtime-label
  `docker image inspect | grep` classifier with a status-preserving probe that
  distinguishes exact post-feature `true`, successfully verified absence, and
  inspect failure/unexpected state. Only verified absence may add the historical
  basename; failure must precede adoption, capture, and lifecycle mutation.
- [x] T052-014b Add a focused regression where image-ID inspection succeeds but
  runtime-label inspection fails. Prove resolver/actual Make returns nonzero,
  `.adopted-project` remains absent, and capture/build/lifecycle sentinels remain
  untouched. Preserve exact-`true`, unlabeled, clean, and explicit cases.
- [x] T052-014c Rerun the complete focused capture/runtime tests, `git diff
  --check`, feature/repository guards, full `pnpm run preflight`, and the
  isolated real Docker asset-retention lifecycle on the renewed content head.
- [x] T052-014d Obtained renewed exact-head review and resolved `r4134154337` with
  implementation/test evidence. Keep `r4134154325` open until final Architect
  validation and later final Analyst validation both name the same renewed
  effective content head; then reply with both role markers before resolution.
- [ ] T052-015 Orchestrator routes any actionable finding role-appropriately;
  every Implementation Agent feedback item receives Architect disposition.
- [x] T052-016 Resolve `r4121580555` with the passing Make-level regression and
  `r4121580548` with coherent role-owned process memory.
- [ ] T052-017 Orchestrator records the exact cycle PR set/head, acceptance
  evidence, green required checks, conflict state, cleanup applicability, and a
  complete paginated read-only review/thread guard for PR #217.
- [ ] T052-018 Orchestrator invokes final Architect validation after T052-017.
  Architect return limit: 10; current count: 0.
- [ ] T052-019 After Architect pass, Orchestrator invokes final Analyst
  validation on the same effective content head. Analyst return limit: 5;
  current count: 0.
- [ ] T052-020 Orchestrator runs the current-head guard, proves any later commit
  evidence-only, reruns exact-head required checks, and finalizes PR #217. If
  the helper refuses solely due its bounded review pagination, manual squash is
  permitted only after complete paginated guards prove every ordinary gate.
- [ ] T052-021 After verified PR #217 merge, Orchestrator continues the already
  required synchronization, testing, review, renewed validations, and merge of
  PR #215.

## Decisions

- D052-001: the existing full capture invocation is the combined
  resolve/classify/persist/capture interface.
- D052-002: Make must not pre-resolve/export the project into capture.
- D052-003: the separate capture recipe remains the fail-fast barrier before
  image replacement.
- D052-004: explicit caller values are authoritative but non-persistent.
- D052-005: feature-051 validation on `953709f...` remains historical evidence;
  feature-052 non-evidence changes require a renewed effective head and new
  Architect then Analyst passes.
- D052-006: PR pagination is handled by complete read-only enumeration, never by
  weakening review or merge gates.

## Review Finding Dispositions

- R052-001 (`r4121580555`): accepted; T052-003 through T052-007.
- R052-002 (`r4121580548`): accepted; Architect-owned feature-051 plan/task
  status corrected during planning without altering Analyst-owned evidence.
- R052-003 (`r4134154337`): accepted in Architect return #1; T052-014a through
  T052-014c implement and verify the fail-closed status-preserving label probe.
- R052-004 (`r4134154325`): expected process gate, not a product change;
  T052-014d and T052-018/T052-019 enforce Architect-before-Analyst evidence and
  resolution ordering.

## Verification Evidence

- Test-first FAIL: at `2026-09-29T13:26:59Z`, the new actual-Make regression
  was executed against an isolated `git archive`
  `80d212ae76e84c1ad1ce8191a1609362a4c48eb8` intake copy. Its first `make
  build` captured the assets but exited with mock build status 88 because the
  pre-exported resolver value suppressed `.adopted-project`; this reproduces
  R052-001 without mutating this worktree.
- Focused PASS: `node --test tests/capture-legacy-assets.test.mjs` passed
  27/27 after the Make correction. The actual-Make fixture proves a discovered
  project is adopted before build, a later `make up` retains it after the mock
  build marks the historical image post-feature, and the missing-adoption
  control falls back to `cabadrive`. It also covers explicit non-overwrite,
  clean default, and failed adoption publication before the build sentinel.
- Guard PASS: `pnpm exec prettier --check tests/capture-legacy-assets.test.mjs`,
  `node scripts/check-feature-memory.mjs --worktree`, and `git diff --check`
  passed. `docs_project/project/devops/docker-runtime.md` describes failure
  ordering but not the old pre-resolve/export boundary, so no durable-doc edit
  is required.
- Full preflight PASS: `pnpm run preflight` completed successfully on the
  implementation worktree. It passed feature-memory/worktree and baseline
  guards, content validation, TypeScript, lint, format, quality-negative,
  Node tests, production build/service-worker generation, and Playwright E2E.
- Isolated real Docker lifecycle PASS: Docker Engine `29.7.2`; a clean second
  `node scripts/test-docker-asset-retention.mjs` run exited 0 and reported
  `Docker asset-retention lifecycle passed for
  cabadrive-retention-58656-1790688721862`. Its scoped cleanup completed.
- Scope PASS: implementation changes are limited to `Makefile`, the focused
  capture/Make test, feature-052 memory, and the Architect-provided
  feature-051 reconciliation. No runtime handoff artifact, dependency,
  sibling-memory, or durable-document change is present.
- Prior implementation content head:
  `7b9b7b4094ca022021bfbf3f203f4620192d5d03`; superseded by Architect return
  #1. Renewed implementation content head:
  `f187bd7ff72bc8e70953a0fad0672de14eebe055`; later task-only evidence commits
  do not alter runtime or test behavior.
- Required current-head checks: pending.
- Complete paginated review/thread guard: pending.
- Originating-thread disposition: on commit
  `7b9b7b4094ca022021bfbf3f203f4620192d5d03`, replied to and resolved only
  `r4121580555` (actual-Make provenance regression and full verification) and
  `r4121580548` (Architect-owned feature-051 reconciliation). Renewed
  feature-052 review/final-validation guards remain Orchestrator-owned work.
- R052-003 review disposition: on renewed implementation head
  `f187bd7ff72bc8e70953a0fad0672de14eebe055`, replied to and resolved only
  `r4134154337` with the status-separated classifier and actual-Make proof.
  `r4134154325` remains unresolved by design pending final Architect then
  Analyst evidence on this renewed content head.
- R052-003 test-first FAIL: the new actual `make build` fixture made image-ID
  inspection succeed and runtime-label inspection exit 42. Before the fix,
  capture proceeded (`captured legacy assets from legacy-image-id`) and build
  returned success, proving the old `inspect | grep` classifier collapsed the
  Docker failure into an unlabeled image.
- R052-003 focused PASS: `sh -n scripts/capture-legacy-assets.sh`, the two
  actual-Make label controls, and `node --test
  tests/capture-legacy-assets.test.mjs` pass 29/29. ID-success/label-failure
  and unexpected-marker controls leave adoption and build sentinels absent and
  invoke no Compose action; existing exact-`true`, verified-unlabeled, explicit,
  and clean controls remain green.
- R052-003 full preflight PASS: a renewed `pnpm run preflight` completed after
  the probe fix, including feature-memory/worktree and repository guards,
  content validation, quality, all Node tests, production build/service-worker,
  and Playwright E2E.
- R052-003 isolated real Docker lifecycle PASS: `node
  scripts/test-docker-asset-retention.mjs` exited 0 and reported `Docker
  asset-retention lifecycle passed for
  cabadrive-retention-70091-1790690943623`; its test-owned project cleanup
  completed.

## Implementation Agent Feedback

- No unresolved Implementation Agent feedback is recorded. R052-003 is an
  accepted native-review finding assigned by Architect return #1.

## Known Issues

- No accepted product issue is open. `r4134154325` remains an expected blocking
  final-validation gate and is not an accepted known issue for merge.

## Final Architect Validation

- Architect validation pass: pending.
- Architect return count: 1 / 10.
- Architect validated effective content head: pending.

## Final Analyst Validation

- Analyst validation: pending; must follow Architect pass.
- Analyst return count: 0 / 5.
- Analyst validated effective content head: pending.
