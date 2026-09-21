# Tasks: Append-Only Static Asset Retention

## Cycle Context

- Feature: `051-asset-retention`.
- Verified planning base: `origin/main`
  `2a92bcfcb7638d1094f33b28e4c2932fb2e4121e`.
- Handoff worktree/branch:
  `/Users/chap/devel/cabadrive-worktrees/051-asset-retention`,
  `codex/051-asset-retention`.
- Delivery: one implementation PR continuing this handoff only after explicit
  Orchestrator assignment and latest-main re-verification.
- Parallel work: preserve all sibling state. Never mutate PR #214 or PR #215.
- Cycle PR set: no PR yet; planned slice purpose `append-only static asset
  retention and shell-last Docker/static deployment`, included in final
  validation after implementation/review/check completion.
- Dependency: feature 051 must merge first. PR #215 is then synchronized to the
  merged main and independently retested/reviewed/revalidated.

## Setup And Test-First

- [x] T001 Orchestrator/Implementation Agent verify latest `origin/main`, exact
  branch/worktree, clean/known status, complete four-file feature memory, one-PR
  assignment, and parallel-work preservation. If PR #214 has merged, integrate
  only its main result role-appropriately; stop on ambiguous base/conflicts.
- [x] T002 Inspect current Vite output, Docker/Compose/Make/nginx lifecycle,
  required checks, and existing tests/docs. Record pre-edit diff and baseline.
- [x] T003 Add failing manifest/path tests: ordinal inventory, SHA/size, exact
  walk, missing/extra/mutated file, traversal, absolute/backslash alias,
  duplicate, symlink, non-regular file, and root escape.
- [x] T004 Add failing stage tests: equal-byte idempotence, unequal-byte
  collision, lock contention, partial-copy fault points, immutable preservation,
  atomic current pointer, and retry.
- [x] T005 Add failing real-browser A/B fixture where faithful legacy A excludes
  and never loads its lazy hash, Cache Storage miss is explicit, destructive B
  returns 404, and safe retained-origin behavior is initially absent.
- [x] T006 Add failing Docker contract/integration cases for pre-build running
  and stopped legacy capture, project-scoped volume, stage-before-nginx,
  restart/down-up persistence, initial install, and sibling isolation.

## Implementation

- [x] T007 Implement canonical complete candidate manifest and safe filesystem
  walk with schema/path/size/SHA-256 validation and no symlink/escape surface.
- [x] T008 Implement exclusive locking and transactional state layout. Stage and
  rehash outgoing/candidate bytes; fail on collision; atomically promote new
  immutable files, release metadata/tree, and finally `current`. Preserve A and
  support idempotent retry at every fault boundary; add no GC.
- [x] T009 Implement a static publish command that consumes current + candidate
  roots and emits a complete A+B `/assets/`, B-only mutable shell tree suitable
  for one atomic host publication. Reject candidate-only/destructive semantics.
- [x] T010 Add Docker candidate/stager targets and project-scoped persistent
  release-state volume. Keep runtime nginx-only and end-user host Node-free.
- [x] T011 Add safe pre-build legacy capture for the exact Compose project. Use
  the running container when present or the prior Compose image when stopped;
  record source identity and fail if detected prior assets cannot be exported.
  Never inspect/mutate another project or broad host directory.
- [x] T012 Make `make build` capture before image replacement and `make up` run
  the stager before replacing/starting nginx. Preserve volume on `make down` and
  keep default URL plus isolated project/port behavior.
- [x] T013 Serve retained `/assets/` from shared state and HTML/SW from atomic
  `current`; keep `/assets/` immutable, `sw.js`/HTML current, and missing hashed
  assets as 404 rather than SPA HTML. Preserve any merged-main PR #214 policy.
- [x] T014 Update the real browser fixture: safe B staging gives the old A tab
  exact retained-origin bytes/MIME while A cache remains initially missing;
  destructive control remains a demonstrated 404 and production gate failure.
- [x] T015 Update Docker/static-host/runtime/frontend/backend/feature-inventory
  and service-worker reliability docs for append-only retention, shell-last
  ordering, first legacy capture, indefinite storage, unsupported destructive
  hosting, and recovery limitations.

## Verification And Publication

- [x] T016 Run focused manifest/staging/fault/path/static-publish tests and
  record test-first FAIL->PASS evidence.
- [x] T017 Run the Chromium safe A->B origin-hit test and destructive control;
  record cache-miss proof, request source, status, MIME, exact bytes/SHA, and
  absence of HTML fallback.
- [x] T018 Run isolated Docker running-legacy and stopped-legacy A->B upgrades,
  initial install, restart and `make down/up`; smoke current HTML/SW and retained
  A hash. Use unique Compose project/port and leave sibling projects untouched.
- [x] T019 Run `pnpm run typecheck`, `pnpm run lint`, `pnpm run format:check`,
  `pnpm run test`, `pnpm run build`, `pnpm run test:e2e`, full `pnpm run
  preflight`, `node scripts/check-feature-memory.mjs --worktree`, `pnpm run
  check:repo`, and `git diff --check`.
- [x] T020 Inspect final scope: no feature-049 product behavior or sibling
  feature-memory edits, no PR #214/#215 mutation, no host Node requirement, no
  unsafe deletion/overwrite, no broad path, and no committed runtime state/temp
  artifacts.
- [x] T021 Record exact results, release-state decisions, dead ends, known
  issues, all Implementation Agent feedback, effective content head, and cycle
  PR metadata. Commit/push/open exactly one ready PR under assignment; never
  merge as Implementation Agent.

## Review, Final Validation, And Merge

- [ ] T022 Review Agent inspect exact PR head for transaction atomicity,
  path/symlink/race safety, byte collision, first legacy capture, project
  isolation, browser origin proof, destructive negative, Docker/static contract,
  docs, tests, sibling preservation, and role/process compliance.
- [ ] T023 Orchestrator route every finding/feedback to the proper role; all
  blocking threads are fixed/resolved or explicitly disposed, checks rerun, and
  process memory refreshed.
- [ ] T024 Orchestrator record full cycle PR set, exact head, green required
  checks, conflicts, review state, acceptance evidence, feedback dispositions,
  cleanup applicability, and effective content head.
- [ ] T025 Architect final validation when invoked after T024; inspect the full
  PR, tasks, architecture, evidence, docs, findings, and user outcome. Maximum
  return count: 10.
- [ ] T026 Analyst final validation only after T025 passes; maximum return count:
  5. Any Analyst gap returns to Architect disposition.
- [ ] T027 Orchestrator run current-head guard, prove any post-validation commit
  evidence-only, recheck all gates, and conservatively merge feature 051.
- [ ] T028 After verified merge, Orchestrator assign synchronization of PR #215
  from updated main. Require its faithful legacy cache-miss/retained-origin test,
  affected/full checks, fresh exact-head review, updated feature-049 evidence,
  final Architect then Analyst validation, current-head guard, and only then
  finalization of PR #215.

## Decisions

- D051-001: all regular candidate `/assets/` files are immutable; names alone
  never establish integrity.
- D051-002: canonical equality is path + byte length + SHA-256; byte-different
  collision aborts without overwrite.
- D051-003: release state is project-scoped and persistent; `current` changes by
  same-filesystem atomic symlink rename only after complete verification.
- D051-004: safe partial progress may append unreferenced hashes, but may never
  select B shell early or delete/overwrite A; retry is idempotent.
- D051-005: the first legacy upgrade captures outgoing assets before Compose
  image replacement, from the current container or prior image. Detected but
  unreadable prior state fails closed.
- D051-006: a Docker stager preserves the Docker-only end-user contract; host
  Node/pnpm are not required.
- D051-007: static hosting publishes a complete merged tree atomically or is
  unsupported for this guarantee.
- D051-008: retention is indefinite; cleanup is a separate future feature.
- D051-009: feature 051 is a prerequisite PR. It never mutates PR #214/#215;
  #215 synchronizes/retests/revalidates only after 051 merges.

## Evidence And Feedback

- Startup evidence: verified base and assigned worktree/branch are recorded
  above; only Analyst `feature-request.md` existed before Architect planning;
  parallel-work preservation acknowledged.
- Implementation evidence: `node --test tests/capture-legacy-assets.test.mjs
  tests/static-release-staging.test.mjs tests/static-release-docker-contract.test.mjs
  tests/docker-runtime.test.mjs` passed 13/13. `pnpm exec playwright test
  tests/e2e/asset-retention.spec.ts` passed 4/4 (Chromium and mobile): the A
  Cache Storage miss was explicit, the first post-B request was an origin hit
  returning JavaScript MIME and exact A SHA/body; the candidate-only control
  returned 404. Final `pnpm run preflight` and `git diff --check` passed.
- Docker evidence: isolated `cabadrive-051-retention` on port 5181 passed
  initial build/stage/start, live retained-asset request, running-container
  capture, `make down/up` persistence, and follow-up build/start. The stopped
  prior-image path is exercised deterministically by
  `tests/capture-legacy-assets.test.mjs`; it verifies the first `/state/assets`
  attempt falls back to the stopped legacy image's original
  `/usr/share/nginx/html/assets`, retaining exact bytes and source identity.
- Dead end fixed: nginx initially returned 500 because staged directories were
  mode 0700. The stager now creates/traverses serving directories at 0755;
  isolated Docker smoke then passed. A preserved state volume is now recognised
  as authoritative so an already-migrated project never tries to recapture its
  intentionally empty runtime image.
- Implementation Agent feedback: none; no out-of-spec product decision was
  required.
- Review evidence: pending.
- Implementation Agent feedback: pending; every item requires Architect
  disposition.
- Effective content head: pending commit/push.
- Cleanup: not assigned; any later environment cleanup requires separate
  Cleanup Agent scope/evidence.

## Final Architect Validation

- Architect validation pass: not invoked; planning ready for implementation.
- Final Architect validation completed at: pending.
- Architect return count: 0 / 10.
- Architect validated effective content head: pending.

## Final Analyst Validation

- Analyst validation: not invoked; must follow Architect pass.
- Analyst return count: 0 / 5.
- Analyst validated effective content head: pending.
