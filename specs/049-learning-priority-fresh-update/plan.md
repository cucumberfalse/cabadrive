# Implementation Plan: Fresh Updates And Learn Priority

## Delivery Shape

Use the Analyst-created latest-main worktree as one implementation branch and one PR. This is justified because progress v3, exposure recording, ordering, reset/import, and their UI integration must land atomically, while the SW change is a bounded second section of the same user-visible guarantee with disjoint files and evidence. A split would expose a partially completed original request and duplicate feature-memory/final-validation coordination. Review remains manageable through separate commits/test groups and a strict file/scope matrix. No nginx, Docker, CI, or PR #214 file is touched.

The implementation slice must re-fetch/verify latest `origin/main` immediately before assignment. Any changed base, dirty ambiguity, or fetch failure is a documented Orchestrator blocker/fallback, not permission to rebase or overwrite this handoff silently.

## Technical Context And Files

- Runtime: React 19, TypeScript, Vite, generated native service worker, localStorage progress store, Node tests, Playwright.
- No new runtime dependency and no Workbox.
- Expected product files: `src/progressStoreCore.ts`, `src/progressStore.ts`, `src/domain.ts` or a narrow Learn helper, `src/App.tsx`, `src/main.tsx`, a narrow `src/serviceWorkerUpdates.ts`, `scripts/generate-service-worker.mjs`.
- Expected tests: progress-store/domain or focused Learn tests, service-worker generation/lifecycle tests, `tests/e2e/app.spec.ts`, and a dedicated two-build SW browser harness/spec.
- Expected docs: relevant sections of frontend/backend docs, feature inventory, learning flow, and ТЗ-13 status/decision notes. Do not edit `feature-request.md` during implementation.
- Excluded: `nginx.conf`, Dockerfiles/compose, workflows, CI config, sibling specs/branches/worktrees.

## Implementation Sequence

1. **Baseline and failing tests**
   - Confirm assignment, complete feature memory, exact base/status, and sibling warning.
   - Add failing pure fixtures for v3 validation/migration, conservative pruned derivation, streak table, cap/quota exact-once behavior, export/import/reset, unknown IDs, and lexicographic ordering.
   - Add failing browser cases for StrictMode exposure/navigation/search stability.
   - Add failing generated-SW/lifecycle tests and a real A/B same-origin harness covering online reload, offline fallback, failed install, old lazy chunk, and one-shot controller change.

2. **Progress v3 core**
   - Add v3 types, canonical sorting/serialization, strict import, safe local recovery, v2 exact-backup/in-place migration, history-derived conservative statistics, and `recordQuestionExposure`.
   - Centralize the pure per-answer transition and apply it once in `recordAnswer`/`finishExam` before pruning. Quota folding must never reapply it.
   - Preserve the existing key, v1 backup, answer cap, aggregate mistake selector, recovery API, and no-component-storage-write invariant. Extend reset key cleanup and canonical undo/import behavior.

3. **Learn ordering and exposure**
   - Add one pure session-order function with injected randomness and explicit canonical fallback.
   - Initialize the Learn session once from the progress snapshot; filter this snapshot for search.
   - Add the active-card transition ref/effect and dispatch the named exposure action only after a real card is committed. Do not rebuild order after progress notifications.

4. **Fresh-online/offline-safe SW**
   - Change generated navigation to network-first/no-store without writing live navigation into the old cache; use the fully installed current cache only for offline shell fallback.
   - Scope subresource cache reads current-first, retained Cabadrive caches second, then network. Remove automatic old Cabadrive cache deletion; never inspect/delete unrelated caches.
   - Remove unconditional install `skipWaiting`, add explicit message activation, preserve atomic install and feature-048 catch behavior.
   - Add a small testable registration/update external store: immediate and hourly update checks, waiting detection, compact banner state/actions, explicit apply, one-shot initiating-tab reload.

5. **Two-build evidence and docs**
   - Build A and B into disposable temp directories with distinct visible test-only markers; serve them from one controllable origin. Do not commit generated build artifacts.
   - Exercise both update paths in Chromium: network publication swap/reload and explicit waiting-worker activation/open-tab safety. Persist progress across A->B in the same profile/context.
   - Update durable docs for actual v3, Learn, banner, online/offline behavior, retained-version-cache decision, and remaining ТЗ-13 follow-ups.

6. **Verification and handoff**
   - Run focused tests, full gates, real browser matrix, and isolated Docker smoke without disturbing siblings. Record exact commands/results and candidate SHA in `tasks.md`.
   - Commit/push/open one ready PR only under Implementation Agent assignment. Review/follow-ups/final validations follow repository role boundaries.

7. **Accepted review follow-up implementation**
   - Replace default-cache install precaching with an atomic request set that
     explicitly bypasses/revalidates the browser HTTP cache. Update the A/B
     fixture to cache shell A at the HTTP layer and prove activated B serves B
     offline; keep failed-install preservation evidence.
   - Isolate runtime `currentCache.put` failure from the successful network
     fetch path and add an executable rejection regression that still returns
     the fetched response.
   - Make the update manager observe both an already-present
     `registration.installing` worker and later `updatefound` workers. Add a
     deterministic state-transition test.
   - On every `controllerchange`, clear/reinspect availability in
     non-initiating tabs without reloading them; preserve exactly-one reload for
     the initiator. Add a multi-manager/shared-registration regression. Treat
     review thread `r4037167293` as a duplicate of primary thread
     `r4037166445`, not a fifth task.
   - Run focused SW/update-manager tests, the A/B Chromium matrix, full
     preflight, and scope checks. Record the new implementation head and review
     evidence in `tasks.md`; only then may Orchestrator resolve the five review
     threads and request fresh exact-head review.

8. **Security prerequisite and final-validation ordering**
   - Preserve feature 050 as a separate latest-main work cycle and PR. Do not
     copy its dependency edits into feature 049 manually.
   - After feature 050 merges, Orchestrator assigns role-appropriate sync of PR
     #215 to verified updated `origin/main`. The synchronized head must rerun all
     required checks, including `osv-scan`, and receive fresh review before
     final Architect validation. Any product/process change after validation
     makes that validation stale under the existing contract.

9. **Subsequent exact-head review follow-up**
   - Add a failing progress-store regression proving that canonical v3
     `learningQuestionStats` order cannot change when export and import run under
     contrasting locale-collation behavior. Include non-ASCII valid unknown IDs
     such as `z` and `ä`, an ordinal byte-order assertion, a lossless round trip,
     and atomic rejection of the reverse/noncanonical order.
   - Introduce one narrow locale-independent ordinal string comparator using
     direct relational comparison and reuse it in both learning-stat sorting and
     strict sorted-order validation. Do not use an implicit or explicit
     human-language collator for persisted identifiers.
   - Keep `cabadrive.progress.v1`, payload version 3, all fields, backups,
     migration and recovery policy unchanged. Re-run the complete focused
     progress-store suite so existing ASCII v3, v1/v2 migration/backup,
     corrupt-local recovery, unknown-ID retention, reset/undo, cap/quota, and
     pruning cases prove compatibility.
   - Run typecheck, lint/format and repository guards, full preflight, all
     configured GitHub checks, and a fresh exact-head Review Agent pass. Only
     after green evidence may Orchestrator resolve `r4039940004` and the
     already-fixed R049-001 duplicate `r4053153086`, then return to final
     validation.

## Key Design Decisions

- **Schema bump to v3:** new canonical durable data is not optional v2 decoration. Explicit v2 migration avoids treating existing payloads as corrupt and makes import/export version semantics honest.
- **Derived state, not capped-history queries:** priority/streak changes at canonical answer mutation time and survives pruning; migration alone replays available history conservatively.
- **Session snapshot:** recording exposure immediately changes storage but never the current order. New priority applies on the next Learn mount, matching A6 and preventing card jumps.
- **Effect/ref exposure boundary:** React controls actual committed visibility; a ref suppresses StrictMode replay and same-ID rerenders while allowing genuine leave/return transitions.
- **Native SW retained:** feature 048 already established a small tested generator. Workbox would be unjustified dependency/rewriting for this scope.
- **Network-first navigation, immutable offline shell:** live B HTML is never persisted into A cache. This is the key to both first ordinary online reload freshness and failed-update offline safety.
- **Retain version caches:** activation cannot safely know which old tab may later request an excluded lazy chunk. This feature retains Cabadrive version caches and uses current-first matching; reuse/bounded cleanup is explicitly left to ТЗ-13 FR-1/FR-2.
- **Single PR:** separate test/commit sections maintain reviewability; no cross-PR schema intermediate state or partial user outcome is created.

## Verification Matrix

| Boundary | Evidence | Pass condition |
|---|---|---|
| Ordering | focused Node tests | Exact tuple order; lower count wins; active wins only at equal count; controlled random ties; 460 unique IDs; no mutation |
| Streak | progress-store tests | Complete wrong/correct/interleaving/exam-skip table; fourth correct deactivates; later wrong resets |
| Migration | progress-store tests | v1/v2/v3 fixtures; exact existing fields; v2 backup-before-write; conservative pruned state; idempotent reload |
| Cap/quota | progress-store fault injection | >5,000 answers and multiple retries never double-transition derived state; stats remain after answer pruning |
| Import/reset | store + E2E | canonical v3 round trip; strict v2 import; invalid atomic rejection; reset/undo clears/restores all stats; unknown IDs retained |
| Exposure | Playwright under StrictMode | first visible +1 only; timer/answer/support/rerender +0; q1->q2->q1; search/no-result transitions; persistent reload/context |
| Session UX | unit + Playwright | 460 coverage, stable mount/search order, no current-card jump, new mount uses updated priorities/new tie order |
| SW text/core | `node --test tests/service-worker-generation.test.mjs` plus focused lifecycle tests | no unconditional install skip; navigation network-first/current-cache fallback; subresource current/retained/network; feature-048 errors preserved; unrelated caches untouched |
| Two-build online | real browser A/B same origin | ordinary reload shows visible B marker and persisted stats without hard reload/clear |
| Offline/failed update | real browser | offline reload uses last ready build; aborted B install keeps A; retry succeeds |
| Open tab/update UI | real browser | A-only lazy chunk loads after B activation; compact banner applies once; no reload loop; B opens correctly |
| Full quality | `pnpm run typecheck`, `lint`, `format:check`, `test`, `build`, `test:e2e`, `preflight` | all pass on candidate head or exact unrelated blocker recorded |
| Runtime | isolated `make build/up/down` on free project/port | HTTP smoke, offline-capable app, no sibling compose mutation |
| Scope/process | `git diff --check`, scoped diff, feature-memory check, PR/review evidence | no nginx/Docker/CI/sibling mutation; docs/tasks/evidence current |

## Risks And Mitigations

- StrictMode double effect: transition ref plus browser assertion against persisted count.
- Migration invents confidence: pruned wrong begins active/streak 0; only observed retained/new answers advance it.
- Store notification reorders Learn: initialize order once, never derive it on render from live progress.
- Fresh navigation damages A offline: do not runtime-cache navigation response into A; install B atomically in its own cache.
- Old tab loses chunk: no old-cache deletion; current-first then retained version lookup.
- Retained cache growth: documented accepted limitation, owned by later ТЗ-13 reuse/cleanup work; correctness wins in this feature.
- SW browser tests are flaky: use deterministic local same-origin server, explicit worker states, unique temporary build IDs, bounded waits, and clean test-owned browser context/cache only.
- PR #214 conflict: never edit its files; if merged main moves, Orchestrator decides fresh-base/update handling before implementation.

## Finalization

The cycle PR set is recorded in `tasks.md` with purpose, branch, PR metadata, current/final head, status, and final-validation inclusion. Orchestrator invokes Architect final validation over implementation, evidence, open tasks, dispositions, docs, and customer intent; only after pass does Analyst validate. Matching effective-head markers and the current-head guard are mandatory before merge. Any non-evidence post-validation change invalidates both passes.
