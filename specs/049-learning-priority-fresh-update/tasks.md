# Tasks: Fresh Updates And Learn Priority

## Cycle Context

- Feature: `049-learning-priority-fresh-update`.
- Planning base: verified `origin/main` `c5520b31922c0e45afd96b2e5877136c1848a541`.
- Analyst/Architect handoff: `codex/049-learning-priority-fresh-update` in `/Users/chap/devel/cabadrive-worktrees/049-learning-priority-fresh-update`.
- Delivery decision: one implementation PR slice continuing this handoff only after explicit Orchestrator assignment and latest-main re-verification.
- Parallel work: preserve all sibling state. PR #214 `claude/049-nginx-caching-security` owns nginx/Docker/CI and is excluded.
- Cycle PR set: sole implementation PR [#215](https://github.com/cucumberfalse/cabadrive/pull/215), branch `codex/049-learning-priority-fresh-update`, open and included in final validation only after all blockers close. The historical checkpoint at `7cfe29a3286f36500cae563e399e8fb9ab5023f0` had `9/9` resolved. Exact inventory after replacement review now contains 12 total threads, 9 resolved and three unresolved: `r4056768455` (R049-008 ledger), `r4056774421` (R049-009 final role validations/current-head guard), and `r4056774425` (R049-010 real deployed legacy lazy hash). Final validation is not ready.
- Effective content head: pending after R049-008/R049-010 correction and prerequisite synchronization; prior marker `51cb103e7818cbc36eeff60e4c0d15408a2e9f5b` is stale.
- Cleanup: not applicable during implementation; post-completion environment cleanup, if assigned, belongs only to Cleanup Agent.

## Setup And Test-First

- [x] T001 Orchestrator/Implementation Agent re-verify latest `origin/main`, assigned worktree/branch/one-PR slice, clean/known status, complete feature memory, and parallel-work warning. Record base/head evidence; stop on ambiguity/fetch failure rather than silently reuse/rebase.
- [x] T002 Read all four feature artifacts and recheck current store/Learn/SW/test contracts. Record baseline focused/full test results and exact pre-edit diff.
- [x] T003 Add failing tests first for v3 schema/migration, v2 backup/idempotence, conservative pruned derivation, complete streak table, cap/quota exact-once, import/reset/undo, unknown-ID retention, and lexicographic ordering.
- [x] T004 Add failing StrictMode/browser tests for exact exposures, navigation/search transitions, stable session order, persistence, and no card jump.
- [x] T005 Add failing generated-SW/update-boundary tests and deterministic two-build browser fixtures for ordinary online reload, offline fallback, failed install, open old tab/lazy chunk, banner activation, and reload-loop guard.

## Implementation

- [x] T006 Implement canonical `ProgressV3`/`LearningQuestionStat`, strict validators, ascending-ID serialization, safe local recovery, exact v2 backup-before-overwrite, deterministic v1/v2 migration, idempotent v3 reload, and supported strict v2 import.
- [x] T007 Implement pure answer-to-learning-stat transition and wire it exactly once into `recordAnswer` and chronological `finishExam`; keep mistake aggregates unchanged and prove pruning/quota retries never replay transitions.
- [x] T008 Add `recordQuestionExposure`, persistence/recovery metadata, reset cleanup including v2 backup, canonical v3 export/import, undo compatibility, and retained unknown IDs. Preserve the sole store write boundary.
- [x] T009 Implement pure full-bank session ordering (`showCount asc`, active first, injected random, canonical fallback) and focused tests for all precedence/tie/full-coverage cases.
- [x] T010 Integrate the one-time Learn session snapshot and committed active-card ref/effect. Search filters the snapshot; empty/same-ID/StrictMode/rerender semantics follow the spec. Do not add a stats screen or reorder the current mount.
- [x] T011 Update generated SW: network-first/no-store navigation without poisoning old offline shell, current-cache offline navigation fallback, current/retained/network subresource path, explicit message-driven skip waiting, atomic install, no old Cabadrive/unrelated cache deletion, and feature-048 invariants.
- [x] T012 Add the testable browser update boundary and compact `Обновить`/`Позже` banner: `updateViaCache: none`, immediate + hourly checks, waiting detection, explicit apply, initiating-tab-only guarded reload, and non-fatal failures.
- [x] T013 Implement disposable two-build A/B fixture/harness with visible markers on one origin; do not commit build artifacts. Prove progress survives A->B and cache lifecycle never touches localStorage.
- [x] T014 Update affected durable docs: frontend/backend storage contract to v3; feature inventory; Learn flow/exposure/order; fresh-online/offline/update banner/cache-retention behavior; ТЗ-13 step/status and remaining follow-ups. Do not edit nginx/Docker/CI or Analyst-owned intake.

## Verification And Handoff

- [x] T015 Run focused store/domain/SW tests and record test-first FAIL->PASS evidence for each new behavior group.
- [x] T016 Run the two-build browser matrix: A install; publish B; ordinary online reload shows B; offline latest-ready reload; interrupted B install keeps A; retry; old A tab lazy chunk; banner/controller one reload; persistent stats across build swap.
- [x] T017 Run `pnpm run typecheck`, `pnpm run lint`, `pnpm run format:check`, `pnpm run test`, `pnpm run build`, `pnpm run test:e2e`, `node scripts/check-feature-memory.mjs --worktree`, `git diff --check`, and `pnpm run preflight`. Record exact results and candidate SHA.
- [x] T018 Run isolated Docker build/up/HTTP smoke/down on a free project name/port without stopping sibling projects. Record commands/port/result. Build was attempted safely but blocked before image creation by the external registry timeout recorded below; no sibling project was stopped.
- [x] T019 Inspect final diff for scope: no `nginx.conf`, Docker/CI, sibling feature memory, content, source-mode, or dependency changes; no component-side localStorage progress writes; no committed temp A/B artifacts.
- [x] T020 Record decisions, dead ends, known issues, verification evidence, and every Implementation Agent feedback item below. Commit/push/open exactly one ready PR only under assignment; never merge.

## Review And Follow-up

- [x] T021 Review Agent review exact PR head for data loss/migration, strict import/recovery, exact-once streak/cap, StrictMode exposure, comparator precedence/session stability, SW freshness/offline/open-tab safety, feature-048 regression, two-build evidence, docs, PR #214 exclusion, and role/process compliance. Review of product head `390f6c87e1cc16c0ac01a2657732726d771df74b` produced four unique SW/update-manager findings across five open threads and no Progress/Learn findings; reviewer edited nothing.
- [x] T022 Orchestrator route every review and Implementation Agent feedback item to Architect. Architect disposition accepts all four unique review findings as tasks R049-001..R049-004; `r4037167293` duplicates primary `r4037166445`. Existing Implementation Agent and OSV-gate dispositions remain unchanged.
- [x] T023 Implementation Agent complete accepted follow-ups in the assigned PR slice, refresh affected evidence/process memory, and obtain fresh review/check results.
- [x] T023a R049-001: make install precache requests explicitly bypass/revalidate
  the browser HTTP cache while preserving all-or-nothing installation. Add a
  generated-SW regression and change the A/B server fixture so shell A is
  cacheable; prove activated B returns shell B on offline reload and a broken B
  still leaves A usable.
- [x] T023b R049-002: make `currentCache.put` best-effort after a successful
  runtime fetch. Add an executable test where `put` rejects and the original
  successful response/status/body is still returned; actual fetch rejection
  must continue to yield `Response.error()`.
- [x] T023c R049-003: immediately observe a worker already present in
  `registration.installing` as well as future `updatefound` workers. Add a test
  that starts mid-install and publishes `{available: true, applying: false}` on
  installation completion without invoking the hourly poll.
- [x] T023d R049-004: on external `controllerchange`, clear/reinspect stale
  availability in a non-initiating tab without reloading it; keep exactly-one
  reload for the initiating tab. Add a multi-tab-equivalent regression and use
  it to resolve primary thread `r4037166445` plus duplicate `r4037167293`.
- [x] T023e Run focused service-worker generation/update-manager tests, the
  two-build Chromium matrix, full preflight, feature-memory/repository/scope
  guards, and fresh exact-head Review Agent review. Record results/head and
  resolve the corresponding original review threads only after their evidence
  is green.
- [x] T023f After separate feature 050 merges, synchronize PR #215 with
  verified updated `origin/main` under Orchestrator assignment, preserve all
  parallel work, rerun every required check including `osv-scan`, and refresh
  exact-head review/evidence before T024/T025.
- [x] T023g R049-005 / thread `r4039940004`: test-first replace implicit-locale
  learning-stat ID ordering with one shared locale-independent ordinal
  comparator used by serialization and strict validation. Add contrasting-locale
  non-ASCII unknown-ID fixtures proving byte-stable `z` before `ä`, lossless
  export/import, and atomic rejection of reverse/noncanonical order. Preserve
  storage key/version/schema plus v1/v2 migration/backup, local recovery,
  reset/undo, unknown retention, cap/quota, and pruning behavior.
- [x] T023h Re-run the focused progress-store suite, typecheck, lint/format,
  repository/feature-memory/scope guards, full preflight, every required GitHub
  check, and fresh exact-head Review Agent review after T023g. Record the new
  effective content head and evidence before resolving `r4039940004`. Resolve
  `r4053153086` without a new product task as an already-fixed duplicate of
  R049-001, citing current `cache: "reload"`, atomic `addAll`, generated-worker,
  and cacheable-A/offline-B/failed-B evidence.
- [x] T023i R049-006 / thread `r4053176084`: test-first implement a fixed
  `cabadrive-update-protocol-v1` cache plus `prompted-activation-v1` sentinel.
  After and only after the complete install precache succeeds, an absent marker
  must be written and read back before the worker invokes `skipWaiting()` for
  the one legacy/fresh-install transition. Marker read/write/verification
  failure rejects install and preserves the active legacy build; an existing
  marker must never invoke automatic activation. The marker is build-independent,
  outside `cabadrive-static-*`, retained, and excluded from runtime matching.
- [x] T023j R049-007 / thread `r4053196269`: remove the special exclusion for
  deferred `manual4Ruedas-*.js` and atomically precache every emitted hashed
  `/assets/` dependency. Keep the large unhashed manual page-image corpus on the
  runtime path. Update collector/generator tests and preserve all-or-nothing
  install failure, retained version caches, current-first lookup, and feature
  048 error semantics.
- [x] T023k Replace/extend the synthetic A/B fixture with executable A/B/C
  evidence. A is the legacy cache-first/no-banner worker; complete B activates
  through the verified missing marker without a page message; marked B keeps C
  waiting until the banner applies it. Generate A's unique hashed lazy chunk via
  the production asset collector, never splice it into `ASSETS`, never load it
  in application code before B, remove it from B's server, and prove the old A
  document first-loads it from retained A cache after B controls. Cover failed
  B precache and failed marker persistence, exactly-once initiator reload,
  non-initiator behavior, offline last-known-good, and a negative omission
  regression. Update affected durable docs; run focused tests, Chromium A/B/C,
  full preflight, every required check, and fresh exact-head review before
  resolving either thread.
- [ ] T023l R049-008 / thread `r4056768455`: keep the five corrected historical
  checkpoint counts at `9/9`/nine, record the distinct current state as `9/10`
  with only this thread unresolved at that historical checkpoint, and publish
  the bounded process-evidence correction without product/test/runtime/dependency/sibling changes. Then
  enumerate the exact-head GitHub thread inventory, obtain fresh exact-head
  Review Agent evidence, resolve `r4056768455` only after the corrected evidence
  is visible, refresh the resulting live state from `9/12` to `10/12` while
  R049-009/R049-010 remain open, and rerun applicable feature-memory, repository,
  diff, and required GitHub gates before T024/T025.
- [ ] T023m R049-010 / thread `r4056774425`: Orchestrator create a separate
  latest-main Analyst intake/prerequisite PR for append-only hashed-asset release
  staging, explicitly coordinating with and preserving PR #214. Before mutable
  B shell publication, seed the outgoing legacy A `/assets/` set into the served
  retained store; add B hashes with same-path/same-byte validation; reject
  collisions, incomplete staging, or a destructive switch; retain historical
  hashes until a future bounded migration. Cover Docker-first upgrade/restart
  and equivalent static-host no-delete instructions/tests, merge the prerequisite,
  then synchronize PR #215 from verified main.
- [ ] T023n In PR #215, replace the false-positive legacy fixture: A must use the
  historical collector exclusion and its Cache Storage must lack the manual lazy
  hash. Stage B through the merged retention mechanism without injecting that
  hash into either generated precache; after B activation prove the old A
  document's first request is served from retained origin. Add the destructive
  no-retention 404/gate negative, refresh durable docs, run full preflight and all
  required checks, obtain fresh exact-head review, and resolve `r4056774425` only
  on that evidence.

## Final Validation And Completion

- [ ] T024 Under Orchestrator coordination, refresh the complete cycle PR set,
  current head/checks/reviews/conflicts, acceptance evidence, feedback
  dispositions, effective content head, and cleanup applicability/refusal
  evidence. At the terminal implementation checkpoint
  `7cfe29a3286f36500cae563e399e8fb9ab5023f0`, required checks `AI Review`,
  `baseline-checks`, `docker-validation`, `guard`, and `osv-scan` all passed;
  exact-head review reported PASS/no findings; all `9/9` review threads were
  resolved; GitHub reported the open PR mergeable without conflicts; acceptance
  evidence and all Architect dispositions were current; no Implementation Agent
  feedback remained unresolved; and cleanup was not assigned/applicable before
  final validation.
- [ ] T025 Architect final validation (only when invoked): inspect the entire cycle PR set, all tasks/dispositions/guidance/open state/process memory/evidence/docs and customer intent in spirit. On pass append exact marker lines and full effective SHA below. Architect return count maximum: 10.
- [ ] T026 Analyst final validation only after T025 passes: validate the original outcome in spirit and letter and append Analyst-owned markers to `feature-request.md`. Analyst gaps return to Architect disposition; maximum 5 returns.
- [ ] T027 Orchestrator run current-PR-head read-only guard. Any later non-evidence content change makes role validation stale; an evidence-only commit must be proven against the same effective content SHA.
- [ ] T027a R049-009 / thread `r4056774421`: after T025 then T026 pass on the
  same effective content head and T027 proves the current head/evidence-only
  delta, record the guard evidence and only then resolve this expected workflow
  thread. It requires no product implementation but blocks merge.
- [ ] T028 Orchestrator finalize/merge only with green required checks, no blocking/unresolved review, no conflicts, complete acceptance/process/feedback evidence, matching validation markers, final guards, and no exceptional human blocker. Cleanup, if any, is separately assigned.

## Decisions

- D049-001: one implementation PR; progress/Learn lands atomically and SW remains a separately reviewable file/test section within the same original user outcome.
- D049-002: payload version bumps to 3 while the localStorage key remains `cabadrive.progress.v1`; exact raw v2 backup uses `cabadrive.progress.v2.backup` before in-place overwrite.
- D049-003: unknown valid question statistics persist indefinitely until reset; current ordering ignores absent-bank IDs.
- D049-004: learning priority is durable derived state updated at canonical answer mutation time, never recomputed from a capped suffix during normal operation.
- D049-005: Learn order is a mount snapshot. Exposure/answers affect only the next Learn mount.
- D049-006: navigation is network-first and never overwrites an old build's installed shell; old Cabadrive caches are retained for active-tab chunks. Bounded reuse/cleanup remains later ТЗ-13 work.
- D049-007: no Workbox/new runtime dependency and no nginx/Docker/CI edits.
- D049-008: install keeps Cache API `addAll` as the atomic transaction, but
  supplies `Request` objects with `cache: "reload"`; this revalidates every
  same-URL build asset without exposing a partially fetched build as ready.
- D049-009: a successful runtime fetch and its optional cache write have
  separate failure boundaries. Cache quota/write failure is ignored after the
  response has been obtained; only the network fetch failure produces
  `Response.error()`.
- D049-010: `controllerchange` reload ownership stays local to the manager that
  invoked `apply()`. Every other manager clears and reinspects its waiting state
  without reloading, preventing a dead cross-tab banner.
- D049-011: persisted learning-stat IDs use one ordinal comparator based on
  direct string relational comparison for both canonical serialization and
  strict validation. Locale/ICU collation is never part of the storage contract;
  the key, v3 schema, migration, backup, recovery, and pruning contracts remain
  unchanged.
- D049-012: a fixed, non-build-specific Cache Storage protocol sentinel is the
  only compatibility signal for automatic activation. It is persisted and
  verified after complete precache; its presence permanently restores prompted
  activation for subsequent releases unless the user/browser clears site data.
- D049-013: every emitted hashed `/assets/` dependency is an atomic install
  requirement, including deferred manual JavaScript. The extra install and
  retained-cache cost is accepted for old-tab/local-first integrity; large
  unhashed manual page images remain runtime-cached.

## Dead Ends And Known Issues

- No dead ends at Architect handoff.
- Accepted limitation: prior version caches are retained to guarantee open-tab safety; unbounded cache reuse/cleanup is intentionally deferred to ТЗ-13 FR-1/FR-2 and must be documented, not silently “fixed” by deleting old caches.
- Accepted boundary: broad freshness for unhashed immutable content paths remains TZ-14/PR #214. This feature proves current app shell/code freshness and last-known-good offline behavior.
- Environment limitation: isolated Docker validation used project `cabadrive-049-validation` and free port `5199`, but `COMPOSE_PROJECT_NAME=cabadrive-049-validation CABADRIVE_HOST_PORT=5199 make build` failed while loading metadata for `node:22-alpine` and `nginx:1.29-alpine` with `DeadlineExceeded: context deadline exceeded`. Neither base image exists locally, so `make up`/HTTP smoke could not proceed. Existing `cabadrive-cabadrive-1` on port 5173 and all sibling containers were left untouched.
- Test-harness dead end: parallel six-worker browser runs intermittently timed out in unrelated pre-existing image, exam-clock, and manual-reader cases. Every initially observed unrelated timeout was isolated and passed; no feature code was changed to mask those failures. The authoritative optimized preflight rerun below passed the complete browser matrix.

## Verification Evidence

- Startup/base: assigned branch `codex/049-learning-priority-fresh-update`; pre-edit `HEAD` and `origin/main` both `c5520b31922c0e45afd96b2e5877136c1848a541`; only the four assigned untracked feature-memory files existed; parallel/sibling work warning acknowledged.
- Test-first red evidence: `pnpm exec node --test tests/progress-store.test.mjs tests/domain.test.mjs tests/service-worker-generation.test.mjs` produced 7 targeted failures for absent ordering, v3 migration/stats/exposure, and old unconditional SW lifecycle while 27 existing focused assertions passed.
- Focused green evidence: `pnpm run typecheck` passed; `pnpm exec node --test tests/progress-store.test.mjs tests/domain.test.mjs tests/service-worker-generation.test.mjs tests/service-worker-updates.test.mjs` passed all focused tests; `pnpm run quality:fast` and `pnpm run format:check` passed.
- Full Node evidence: sandboxed first run exposed only four environment `EPERM` failures from pre-existing loopback/sentinel tests; the authorized equivalent `pnpm run test` passed `565/565`.
- Learn browser evidence: focused Chromium run passed both the existing session-order case and new StrictMode-safe exposure/persistence case. The full first Playwright run passed the new Learn case on both desktop and mobile.
- Two-build evidence: isolated Chromium matrix passed ordinary online A->B reload, v3/unknown-stat persistence, explicit banner activation and exactly one navigation, retained A-only lazy chunk under B, offline B reload, failed B install preserving offline A, and later valid retry. The initial full-suite fixture precached all 2,156 production assets in both projects and timed out under parallel load; the disposable harness was tightened to the actual app shell and intentionally runs once in Chromium. It then passed `2/2` with the mobile duplicate skipped.
- Full e2e first pass: production content validation and build passed; Playwright reported `155 passed`, two heavy-harness timeouts addressed above, and one unrelated desktop `legacyManual` heading timeout whose mobile twin passed. Isolated rerun of that unrelated case passed desktop and mobile `2/2`.
- Unrelated-timeout isolation: the three old scenarios that timed out in the optimized full run passed sequentially on both desktop and mobile, `6/6` in `9.5s`.
- Authoritative final preflight (Orchestrator, 2026-09-17): authorized `pnpm run preflight` exited `0`; Node tests passed `565/565`; Playwright passed `158` with `2` intentional mobile skips. This run also covered feature-memory/repository gates, content validation, typecheck, lint, format check, negative quality contracts, production build, and the complete E2E matrix.
- Final scope inspection (2026-09-17): `git diff --check`, `node scripts/check-feature-memory.mjs --worktree`, and `pnpm run check:repo` passed; changed/untracked paths are limited to feature 049 memory, progress/Learn/SW implementation and tests, and directly affected durable docs. No `nginx.conf`, Docker/compose, workflow/CI, dependency, sibling-memory, governed content, or source-mode change exists; Learn dispatches store actions and has no direct progress `localStorage` write; disposable A/B artifacts remain outside Git tracking.
- Docker evidence: project/port and exact registry limitation are recorded under Known Issues and Implementation Agent Feedback. No sibling runtime was stopped or modified.
- Candidate/full-preflight/head SHA evidence: effective implementation content commit `55fdbc0fdf889d1dbb6062b5616581c111cc6f42`; the authoritative final preflight result recorded above validates this content state. This later tasks-only entry is process evidence and does not alter product behavior.
- Publication evidence (2026-09-17): pushed `codex/049-learning-priority-fresh-update` and opened ready PR [#215](https://github.com/cucumberfalse/cabadrive/pull/215) against `main`; GitHub reported open/non-draft creation head `376e8eff13370876131aecee0c347eccdd0f0faa`. No merge was performed.
- Review-follow-up sync evidence (2026-09-19): Architect disposition was
  committed as `044e3b0a3480ca258b1da22ee9be188ab00cff4d`, then verified
  `origin/main` `2a92bcfcb7638d1094f33b28e4c2932fb2e4121e` (merged feature
  050) was merged non-destructively without rebase as
  `1f5ea3cef936d2be9b9179842fd897fa76ed93bd`; no conflict or sibling mutation
  occurred.
- Review-follow-up test-first evidence (2026-09-19): before the fixes,
  `pnpm exec node --test tests/service-worker-generation.test.mjs
  tests/service-worker-updates.test.mjs` failed the new explicit-revalidation,
  cache-write-rejection, already-installing-worker, and cross-tab banner
  assertions while all pre-existing focused cases passed. After implementation,
  the focused suite passed `9/9`, including distinct cache-write and true
  network-failure outcomes.
- Review-follow-up browser/build evidence (2026-09-19): `pnpm run
  format:check`, `pnpm run quality:fast`, and `pnpm run build` passed; the
  cacheable-shell A/B fixture (`public, max-age=3600`) passed Chromium `2/2`,
  proving online B publication and offline B fallback, failed B preservation of
  A, later retry, retained A-only chunk, persisted progress, and exactly-one
  initiating-tab reload.
- Review-follow-up full preflight evidence (2026-09-19): authorized `pnpm run
  preflight` exited `0`. Feature-memory and repository gates, all content
  validation, typecheck, lint, format, negative quality contracts, production
  build, and the complete test matrix passed: Node `569/569`; Playwright `158`
  passed with the two intentional mobile skips for the single-run A/B harness.
  `git diff --check` also passed. The later terminal checkpoint below records
  completion of the Orchestrator-owned checks, exact-head review, and thread
  resolution required by T023e.
- Review-follow-up effective implementation content head:
  `602f80beb98bc53d354d71303a39c147c438827b`. This subsequent tasks-only
  commit records the exact SHA and does not alter product behavior, tests,
  durable runtime documentation, or review dispositions.
- R049-005 test-first evidence (2026-09-19): with the new contrasting-collation
  fixture in place, `pnpm exec node --test tests/progress-store.test.mjs` failed
  only the new non-ASCII round-trip assertion (`false !== true`) while the 22
  existing progress-store cases passed. After replacing both persisted-stat
  ordering call sites with one direct `<`/`>` ordinal comparator, the suite
  passed `23/23`. The regression proves ordinal `z` before `ä`, byte-stable
  export across opposite simulated locale order, lossless import, and atomic
  rejection of reversed input; existing migration, backup, recovery,
  reset/undo, unknown-ID retention, and quota/pruning coverage stayed green.
- R049-005 full preflight evidence (2026-09-19): authorized `pnpm run preflight`
  exited `0`; feature-memory/repository gates, content validation, typecheck,
  lint, format, negative quality contracts, production build, and full suites
  passed. Node reported `570/570`; Playwright reported `158` passed with the two
  intentional mobile skips for the single-run A/B service-worker harness.
  The later terminal checkpoint below records completion of T023h's exact-head
  GitHub checks, review, and thread resolution under Orchestrator coordination.
- R049-005 effective implementation content head:
  `24e3ddae9f04a7da22974b3e5b7cdd6be0f0822f`. This subsequent tasks-only
  commit records the exact SHA and does not alter product behavior or tests.
- R049-006/R049-007 test-first evidence (2026-09-20): after adding the marker,
  hashed-manual-asset, and negative install regressions but before product
  changes, `pnpm exec node --test tests/service-worker-generation.test.mjs`
  failed five new/updated assertions while the two unchanged executable fetch
  cases passed. After implementation the generated-worker suite passed `7/7`:
  first unmarked install writes/verifies the fixed sentinel before one
  `skipWaiting`, a marked install never auto-activates, precache failure never
  opens/marks the protocol cache, marker-write failure rejects, and the real
  deferred manual JS is part of the atomic asset list while page JPGs remain
  excluded.
- R049-006/R049-007 browser evidence (2026-09-20): production build passed and
  the rewritten Chromium fixture passed `2/2`. It invokes the production asset
  collector, asserts generated A contains a unique never-loaded lazy hash, and
  never edits the generated `ASSETS` list. Legacy cache-first A transitions to
  complete B without a page message; B writes the fixed marker; C remains
  waiting until the banner applies it with exactly one initiating navigation;
  the old A document first-loads its removed hash from retained A cache. A
  naturally generated then deleted required asset proves a failed compatibility
  install leaves A offline-ready and leaves the marker absent before valid B
  retries successfully. VM evidence separately forces marker persistence
  failure and proves no activation.
- R049-006/R049-007 full preflight evidence (2026-09-20): authorized
  `pnpm run preflight` exited `0`; feature-memory/repository guards, content
  validation, typecheck, lint, format, negative quality contracts, production
  build, and full suites passed. Node reported `572/572`; Playwright reported
  `158` passed with the two intentional mobile skips for the single-run service
  worker harness. The later terminal checkpoint below records completion of
  T023k's exact-head GitHub checks/review under Orchestrator coordination.
- R049-006/R049-007 effective implementation content head:
  `054cdca609cb57ddf3e42efc669e8105600893cf`. This subsequent tasks-only
  commit records the exact SHA and does not alter product behavior, tests, or
  durable runtime documentation.
- Terminal implementation/checkpoint evidence (2026-09-20): on exact PR head
  `7cfe29a3286f36500cae563e399e8fb9ab5023f0`, GitHub checks `AI Review`,
  `baseline-checks`, `docker-validation`, `guard`, and `osv-scan` all passed;
  exact-head Review Agent outcome was PASS with no findings; all `9/9` review
  threads were resolved; and GitHub reported PR #215 open and mergeable without
  conflicts. The full local evidence remained green (`572/572` Node; `158`
  Playwright passed with two intentional skips), every acceptance criterion has
  executable or durable evidence above, F049-IA-001 and F049-GATE-001 have
  Architect dispositions, no feedback remains unresolved, and no cleanup scope
  was assigned before final validation.
- R049-008 discovery evidence (2026-09-20): fresh exact-head review at
  `e817ab69ff61306de6815bdf3da80f059683f440` found that GitHub contained nine
  resolved threads before the new finding, while five canonical checkpoint
  statements said eight/eight. The new P1 thread `r4056768455` is now the sole
  unresolved thread, making current state `9/10`. This disposition corrects the
  five historical statements to nine/nine but does not resolve the new thread;
  T023l exact-head publication, inventory, review, resolution, and refreshed
  effective-head evidence remain pending.
- Replacement inventory evidence (2026-09-20): authoritative GitHub inspection
  found 12 total threads, 9 resolved and exactly three unresolved:
  `r4056768455`, `r4056774421`, and `r4056774425`. The latter demonstrates that
  the rewritten fixture generated A with the corrected collector and therefore
  prepopulated the lazy hash; it is not evidence for an already-deployed legacy
  A whose cache omitted that path. No client-only recovery exists after the
  origin also removes the bytes.

## Implementation Agent Feedback

- F049-IA-001: isolated Docker smoke is externally blocked because Docker could not fetch metadata for uncached `node:22-alpine` and `nginx:1.29-alpine` (`DeadlineExceeded`). Recommended disposition: no product task; accept the already-green host production build/browser evidence and let CI or an environment with registry access provide Docker confirmation. No implementation divergence is proposed.

## Architect Dispositions

- R049-001 / thread `r4037166609` — **accepted task (P1)**. Default
  `cache.addAll(ASSETS)` can reuse stale same-URL shell bytes from the browser
  HTTP cache and falsely label them as the new version cache. Implement the
  explicit fresh/revalidated atomic precache and cacheable-A/offline-B browser
  regression specified by T023a. This is required by FR-001 and the
  last-completely-installed-build guarantee; it is not covered by the current
  fixture because that fixture sends `no-store` for every non-SW response.
- R049-002 / thread `r4037167276` — **accepted task (P1)**. A failed
  `currentCache.put` must not discard a valid online response. Separate the
  best-effort cache-write failure from the fetch failure and add the executable
  regression in T023b. Do not weaken the offline error distinction from feature
  048.
- R049-003 / thread `r4037167285` — **accepted task (P2)**. Attach to
  `registration.installing` immediately after registration so a tab that joins
  an update already in progress observes its completion without an hourly
  delay. Preserve observation of future `updatefound` workers and add T023c.
- R049-004 / primary thread `r4037166445` — **accepted task (P2)**. An external
  activation must clear/reinspect stale banner state in non-initiating tabs
  without forcing their reload, while the initiating tab reloads once. Add the
  multi-tab-equivalent regression in T023d.
- Thread `r4037167293` — **not-needed as a separate task (duplicate)**. It
  describes the same stale non-initiating-tab banner defect, root cause, and
  required outcome as R049-004/`r4037166445`. Resolve it with the same code and
  T023d evidence; do not implement a second behavior path.
- R049-005 / thread `r4039940004` — **accepted task (P2)**. Implicit-locale
  `localeCompare()` can serialize valid unknown IDs in one order and reject that
  same payload under another locale. Implement the single ordinal comparator
  and the cross-locale, non-ASCII, negative-order, and compatibility evidence in
  T023g/T023h. This is required for canonical export/import and unknown-ID
  retention; it does not change the storage schema or Learn-session priority
  comparator.
- R049-006 / thread `r4053176084` — **accepted task (P1)**. The legacy
  cache-first page cannot display the new prompt or send `SKIP_WAITING`, so the
  first prompted worker may remain waiting forever in normal continued use.
  Implement T023i/T023k's durable one-time marker protocol and A/B/C regression.
  This is a compatibility exception only for an unmarked legacy/fresh install;
  a marked subsequent worker must wait for explicit activation.
- R049-007 / thread `r4053196269` — **accepted task (P2)**. The existing test
  manually precaches its synthetic `a-only.js`, while production excludes a
  real deferred JS chunk, so it masks the reported old-tab failure. Implement
  T023j/T023k: atomically precache all hashed build assets and prove a generated,
  never-application-loaded A chunk survives B deployment through retained A
  cache. Keep only the documented large unhashed page images excluded.
- R049-008 / thread `r4056768455` — **accepted task (P1 process evidence)**.
  Five canonical checkpoint statements undercounted GitHub review threads as
  eight/eight; the authoritative pre-finding state was nine/nine. Correct all
  five consistently and preserve a separate historical post-finding state of
  nine/ten where this thread was solely unresolved. Replacement review made the
  live state nine/twelve; complete bounded task T023l without product behavior
  changes and record ten/twelve after GitHub confirms this thread's resolution.
- R049-009 / thread `r4056774421` — **accepted workflow gate (P1; no code
  task)**. Keep open through T025 Architect validation, T026 Analyst validation,
  and T027 current-head/evidence-only guard; resolve only under T027a. Its
  expected open state does not block invoking the ordered role validations once
  R049-008/R049-010 and all other implementation/process work are closed, but it
  blocks merge.
- R049-010 / thread `r4056774425` — **accepted task (P2) with external
  prerequisite**. The current A fixture is generated by the new collector and
  cannot model deployed legacy A. B cannot retroactively cache an old hash absent
  from both A cache and B origin. Complete T023m/T023n's outgoing-origin
  append-only retention, faithful legacy fixture, negative destructive deploy,
  prerequisite merge/sync, full gates, and fresh review. Do not silently expand
  PR #215 into PR #214's nginx/Docker/CI scope and do not waive the defect.
- Thread `r4053153086` — **not-needed as a separate task
  (duplicate/already-fixed R049-001)**. The comment targets old commit
  `044e3b018df382b710bd1507ea13a2a9f4e1e18f`; effective product head
  `602f80beb98bc53d354d71303a39c147c438827b` already uses
  `new Request(asset, { cache: "reload" })` with atomic `cache.addAll(requests)`
  and records generated-worker plus cacheable-A/offline-B and failed-install
  regressions. Use that evidence to resolve the duplicate; do not add another
  service-worker task.

- F049-IA-001 — **not-needed (no product task or ticket)**. The recorded
  `DeadlineExceeded` occurred while Docker fetched metadata for uncached
  upstream base images, before a feature image or runtime could be built; it
  provides no evidence of a feature 049 code, Docker-contract, or architecture
  defect. The isolated attempt used the assigned project/port and preserved all
  sibling containers, while the authoritative host preflight, production build,
  Node suite, and browser matrix passed. This disposition does not waive Docker
  as a merge-readiness gate: Orchestrator must obtain a green GitHub
  `docker-validation` check (or equivalent rerun in an environment with registry
  access) before finalization. A functional failure there must be routed as a
  follow-up task; recurrence of only the same external registry outage is a
  documented external blocker, not an implementation task.
- F049-GATE-001 — **ticket: separate prerequisite security-baseline work cycle
  and PR; not a feature 049 implementation task**. Required `osv-scan` failed
  on PR #215 because the unchanged repository lockfile resolves 13 fixable
  transitive vulnerabilities: `baseline-browser-mapping` 2.10.25,
  `brace-expansion` 1.1.16 and 5.0.7, `browserslist` 4.28.2, `js-yaml` 4.3.0,
  `nanoid` 3.3.12, and `postcss` 8.5.15. Read-only dependency tracing confirms
  they arrive through the existing Vite/Babel/ESLint/TypeScript-ESLint graph;
  feature 049 changed neither `package.json` nor `pnpm-lock.yaml`, and sibling PR
  #214 fails the same baseline gate. Orchestrator must open a separate
  latest-verified-main feature intake and dependency-only prerequisite PR. Its
  safe scope is limited to resolving every named package to at least the OSV
  fixed versions (`baseline-browser-mapping >=2.11.0`, `brace-expansion` 1.x
  `>=1.1.18` and 5.x `>=5.0.9`, `browserslist >=4.28.7`, `js-yaml >=4.3.2`,
  `nanoid` 3.x `>=3.3.18`, `postcss` 8.5.x `>=8.5.23`) using pnpm 10.33.0.
  Prefer a deterministic lockfile refresh within existing parent semver ranges;
  add only narrowly targeted `pnpm.overrides` when a vulnerable transitive
  resolution cannot otherwise advance. Do not use force/major upgrades, change
  application code, or bundle unrelated dependency updates. Verification must
  include a reviewed manifest/lock diff, `pnpm install --frozen-lockfile`,
  `pnpm why` evidence for all seven package names and both brace-expansion
  lines, the repository's full preflight, and a green required `osv-scan` on
  the prerequisite PR exact head.
- F049-GATE-001 ordering — the prerequisite PR must merge to `main` first.
  Orchestrator must then assign role-appropriate synchronization of PR #215
  with verified updated `origin/main` while preserving its history and all
  sibling work, obtain a new exact head, rerun every required check including
  `osv-scan`, and refresh affected evidence before final Architect validation.
  PR #214 needs the same independent prerequisite/synchronization but is not
  part of feature 049. A functional or quality failure after the dependency
  refresh becomes a scoped follow-up; waiving the required OSV gate is not an
  allowed disposition.

- Final-validation ordering — R049-001..R049-007 are implemented and verified;
  both duplicate dispositions are complete; prerequisite feature 050 / PR #216
  merged and PR #215 synchronized it without rebase; all required checks and the
  earlier exact-head review passed; and all nine review threads then present
  were resolved. Current inventory is `9/12`: R049-008 and R049-010 require
  T023l/T023m/T023n plus refreshed exact-head/effective-head evidence. R049-009
  remains intentionally open through the subsequent ordered final validations
  and current-head guard. The PR is not ready for final validation now.

## Cycle PR Set

- Slice 1 / sole implementation PR: purpose `feature 049 complete implementation`; branch `codex/049-learning-priority-fresh-update`; PR [#215](https://github.com/cucumberfalse/cabadrive/pull/215); historical terminal implementation/checkpoint head `7cfe29a3286f36500cae563e399e8fb9ab5023f0` had `9/9` threads resolved. Current inventory is `9/12`, with R049-008/R049-009/R049-010 open; effective content head, prerequisite-sync head, checks, review, and final-validation inclusion are pending.
- External prerequisite (F049-GATE-001): dependency-security baseline PR and
  feature 050 PR #216 merged separately to `main` as
  `2a92bcfcb7638d1094f33b28e4c2932fb2e4121e` and is **not** included in feature
  049's cycle PR set. PR #215 already synchronized that verified main through
  merge commit `1f5ea3cef936d2be9b9179842fd897fa76ed93bd`; R049-005 and the
  all subsequent implementation, thread-resolution, required-check, and
  exact-head-review gates are complete.
- External prerequisite (F049-GATE-002): a new latest-main work cycle/PR must
  implement the append-only `/assets/` deployment staging contract for the first
  legacy upgrade and durable Docker/static-host publication. It is not part of
  feature 049's cycle PR set, must preserve/coordinate with PR #214, must merge
  before T023n final evidence, and requires PR #215 synchronization afterward.

## Final Architect Validation (Architect-owned)

- Architect validation pass: not ready.
- Final Architect validation completed at: pending.
- Invocation state: R049-008/T023l and R049-010/T023m-T023n remain open;
  R049-009/T027a is the later expected final-role/current-head gate. Final
  validation must not be invoked until the implementation/prerequisite work and
  corrected exact-head evidence are current.
- Architect return count: 3 / 10.
- Required pass markers when invoked:
  - `Architect validation pass: passed`
  - `Final Architect validation completed at: <ISO 8601 timestamp>`
  - `Effective content head: <40-hex-sha>`
  - `Architect validated effective content head: <40-hex-sha>`

## Final Validation Evidence

- Analyst validation: not yet invoked; must occur after Architect pass.
- Analyst return count: 0 / 5.
- Analyst validated effective content head: pending.
- Final-validation evidence-only commit/current-head guard: pending Orchestrator.
- Limit escalation: none.
- Cleanup evidence: not applicable to implementation; any later cleanup requires separate Cleanup Agent assignment/evidence.
