# Specification: Fresh Updates And Learn Priority

## Analyst Intake And Cycle Context

- Source: `feature-request.md`; its assumptions A1-A8 are accepted without change.
- Role: Architect only. This document, `plan.md`, and `tasks.md` are the only files Architect creates.
- Verified startup base: `origin/main` / worktree `HEAD` = `c5520b31922c0e45afd96b2e5877136c1848a541`.
- Assigned handoff: `/Users/chap/devel/cabadrive-worktrees/049-learning-priority-fresh-update`, branch `codex/049-learning-priority-fresh-update`.
- Parallel work exists. PR #214 (`claude/049-nginx-caching-security`) owns nginx/Docker/CI work; this feature must not edit, merge, rebase, or otherwise mutate it or any sibling work.
- Work cycle: this one user request, feature folder `049`, its single implementation PR, review/follow-ups, final Architect validation, final Analyst validation, final guards, and Orchestrator finalization.
- Cleanup is not part of implementation. Any later cleanup requires a separately assigned Cleanup Agent and positive-proof validation.

## Goal

On the same origin, an ordinary online reload must show the currently deployed Cabadrive build while an offline reload uses the last completely installed build. In `Учить`, each actual active-card exposure must be counted durably and every new Learn session must use the stable lexicographic order `showCount ascending` -> `active mistake priority first` -> new session-random tie order. A mistake remains priority-active until four consecutive canonical correct answers to that question after the latest wrong answer.

## Scope

In scope:

- Generated service-worker navigation/update lifecycle, a compact update banner, safe activation, retained old-build cache fallback for already-open tabs, and two-build browser evidence.
- Progress payload v3, deterministic v1/v2 migration, learning statistics, canonical export/import, reset/undo compatibility, quota/pruning safety, and unknown-question retention.
- Pure Learn ordering/streak helpers, a store action for exposure, and a StrictMode-safe active-card exposure boundary.
- Focused unit/integration/E2E tests and affected durable docs.

Out of scope:

- `nginx.conf`, Docker/CI/branch-protection work, and PR #214's scope.
- Backend/cloud/account/cross-device sync, IndexedDB, analytics, time decay, spaced repetition, difficulty as an ordering key, exam selection changes, or a new statistics screen.
- FR-1/FR-2/FR-5/FR-6 of `docs/improvements/13-service-worker-reliability.md` except the minimum lifecycle/cache changes required here; broad same-path immutable-content policy remains TZ-14/PR #214 territory.
- Content/source-mode changes and deletion of cumulative mistake-review history.

## Stored Data Contract

The localStorage key remains `cabadrive.progress.v1`; the payload becomes version 3:

```ts
type LearningQuestionStat = {
  questionId: string;
  showCount: number;
  activeMistakePriority: boolean;
  correctStreakAfterLastError: 0 | 1 | 2 | 3 | 4;
};

type ProgressV3 = {
  version: 3;
  answers: ProgressAnswer[];
  difficultQuestionIds: string[];
  examAttempts: ExamAttempt[];
  prunedAnswerStats: PrunedAnswerStat[];
  learningQuestionStats: LearningQuestionStat[];
};
```

Invariants:

- Statistics are unique by non-empty `questionId` and serialize in ascending `questionId` order. `showCount` is a non-negative safe integer.
- `activeMistakePriority=true` permits streak `0..3`; an inactive recovered record may carry saturated streak `4`; an inactive never-wrong/exposure-only record carries streak `0`.
- Missing current-bank records mean `{showCount: 0, activeMistakePriority: false}`.
- Valid unknown question IDs are retained unchanged across load/export/import/content updates and ignored by current-bank ordering. Only reset removes them; there is no opportunistic garbage collection.
- `recordQuestionExposure(questionId)` increments exactly one count through the store boundary. Views never write localStorage.
- `recordAnswer` and every answer in `finishExam` update learning statistics in chronological order before answer pruning. Wrong sets active=true/streak=0. Correct increments only an active streak; the fourth sets active=false/streak=4. Later correct answers do not change an inactive record; a later wrong reactivates/reset it.
- Answer modes `learning`, `exam`, and `mistakes` all participate; exam skip remains a wrong answer. Exposure/timer expiry does not affect the streak. Cumulative `prunedAnswerStats.wrong` and Mistake Review are unchanged.

Migration and recovery:

- Versionless v1 follows the existing exact-backup contract. Valid local v2 is migrated to v3 in place and preserved exactly for the four existing fields; before overwriting the primary raw v2, write an exact `cabadrive.progress.v2.backup`. Backup failure blocks the overwrite and emits typed recovery evidence.
- v1/v2 show counts start at zero; answers are not evidence of exposure.
- For each v2 `prunedAnswerStats` record with `wrong > 0`, migration starts conservatively active with streak 0, then replays retained answers chronologically. This lets four trustworthy retained/new correct answers deactivate priority while never guessing an unknown pruned streak. Retained-only histories are replayed exactly.
- A successfully migrated local payload is persisted as v3 so the next load is idempotent. Strict import accepts canonical v3 and supported strict v2; v2 import migrates deterministically. Invalid import is atomic. Invalid local v3 learning statistics are not trusted: discard that statistical set, reconstruct conservative mistake state from valid pruned/retained history, use zero show counts, and emit recovery evidence.
- Quota trimming folds answer prefixes only; it never replays them into `learningQuestionStats`. Thus repeated prune/retry cannot double-count streak transitions. If statistics themselves cannot persist, existing memory-preserving recovery semantics apply.
- Reset clears v3 statistics and v2 backup along with current progress keys. Existing session undo uses canonical v3 export/import and therefore restores them.

## Learn Session And Exposure Contract

- A pure `orderLearningQuestions(questions, stats, random)` constructs a copied full-bank order once per `LearnView` mount. It assigns one injected random rank/order per question, then performs a deterministic lexicographic comparison: show count ascending, active priority before inactive, random rank, canonical ID fallback. It never mutates source questions.
- The session order is a snapshot. Store updates caused by exposure or answers do not reorder the mounted session. Search only filters that snapshot while preserving relative order; clearing search restores it.
- A committed active-card effect/hook tracks the immediately active `questionId` in a component ref. It dispatches exposure only when the visible identity transitions from none/different to that ID. It clears the ref for an empty state. This makes `q1 -> q2 -> q1` count `q1` twice, while StrictMode effect replay, timer ticks, answer/store rerenders, translation/explanation/difficult toggles, and a query that leaves the same active ID count zero extra exposures.
- Unmount/re-enter, refresh, and reopen create a new session/ref and count the first visible card once. Precomputed/sorted/searched/hidden questions never dispatch exposure.

## Service Worker And Update Contract

- Keep feature 048's navigate/subresource error distinction. Navigation becomes network-first with an explicit no-store/revalidation request. A successful online navigation response is returned but is not written into the controlling old build's app-shell cache; this prevents build-B HTML from corrupting build A's last-known-good offline shell. On network failure/non-success, fall back only to the controlling worker's fully installed current cache (`/` then `/index.html`, `ignoreSearch` semantics preserved).
- Subresources remain current-cache-first, then retained Cabadrive-version-cache fallback (needed by an old open tab requesting an old hashed lazy chunk), then network with successful responses written only to the current cache. Unrelated origin caches are never searched or deleted.
- Install remains atomic for the current precache. Remove unconditional install-time `skipWaiting`; a failed/partial B install cannot activate or delete A. Add only an explicit `{type: "SKIP_WAITING"}` message handler.
- Activation may claim clients but must not delete prior `cabadrive-static-*` caches. Retaining old version caches is the deliberate safety choice for old tabs in this feature; bounded/reuse cleanup remains FR-1/FR-2 follow-up. Current-cache-first prevents retained same-path entries from superseding the installed build.
- A testable `serviceWorkerUpdates` browser boundary registers `/sw.js` with `updateViaCache: "none"`, checks immediately, checks at most hourly for a long-lived SPA, observes `updatefound`/waiting state, and exposes `available/applying` state plus `apply/dismiss` actions to React. Registration/update failure remains non-fatal and must not block study.
- The compact banner offers `Обновить` and `Позже`. Apply posts `SKIP_WAITING`; exactly the initiating tab reloads once on `controllerchange`, guarded against loops. Other old tabs are not forcibly reloaded and continue through retained-cache fallback.
- The banner is not the online-reload freshness mechanism: build A's network-first navigation makes an ordinary online reload render deployed build B. Offline reload continues to render the last fully installed current cache.
- Service-worker/cache code never reads, writes, clears, or migrates localStorage.

## Functional Requirements

- FR-001: Ordinary online A->B reload shows B without hard refresh or cache clearing; offline reload shows the latest completely installed build.
- FR-002: Failed B installation leaves A usable offline and retryable online.
- FR-003: Explicit update activation reloads the initiating tab once; old tabs retain access to old lazy chunks; no controllerchange loop occurs.
- FR-004: Feature 048 navigation/query fallback and non-navigation `Response.error()` behavior remain green.
- FR-005: Every actual Learn active-card transition increments only that question once and persists across reload/browser/site/same-origin build restarts.
- FR-006: Every new Learn mount orders all current questions lexicographically by show count, mistake priority, then session-random tie order; the mounted order remains stable.
- FR-007: Four, not three, consecutive correct answers after the latest wrong deactivate priority; any new wrong resets it; other-question events do not affect it.
- FR-008: v1/v2/v3 load, cap/quota, strict import, canonical export, reset, and undo preserve existing progress and the new statistics according to this contract.
- FR-009: Durable docs describe v3 browser storage, Learn ordering/exposure, and fresh-online/offline-safe update behavior.

## Acceptance Criteria And Negative Scenarios

1. Two real builds A/B on one origin expose distinct visible test markers. After A controls and B is published, one ordinary online reload shows B; no hard reload/cache clearing occurs. After a successful install, offline reload opens the latest ready build and Learn works.
2. Aborted B installation leaves A's cache/controller usable offline; restoring the server/network permits a successful retry.
3. An A tab held open across B activation can load an A-only lazy chunk from its retained cache; update/apply produces at most one initiating-tab reload and a new tab works on B.
4. New question exposure starts at 1, a later genuine return becomes 2, and reload/persistent-context/build replacement preserve it. StrictMode initial mount, timer, answer, translation, and normal rerenders remain at 1.
5. `q1 -> q2 -> q1` yields `q1=2/q2=1`; search computation is +0; unchanged active ID is +0; empty result is +0; return from empty to a visible ID is +1.
6. Unit fixtures prove `(showCount asc, active first, injected random)` including `count0/inactive` before `count1/active`; equal groups vary with controlled streams while a mounted session/search stays stable and contains 460 unique IDs.
7. Full streak table passes: wrong; wrong+1/2/3 correct; wrong+4 correct; wrong+3 correct+wrong; wrong+4 correct+wrong; interleaved IDs; exam skip.
8. Production-shaped v2 migrates without corruption or loss and reloads idempotently. Ambiguous pruned wrong stays active until four trustworthy correct answers. More than 5,000 answers and repeated quota retries do not double-apply learning state.
9. Export -> reset -> import and reset -> undo restore v3 statistics. Invalid/foreign stats reject import atomically; local corrupt stats create conservative recovery, never invented counts.
10. A lower show count is never displaced by error priority; the current card never jumps after recording its own exposure/answer; clearing search never reshuffles.

## Review And Completion Requirements

- Implementation starts only after Orchestrator explicitly assigns this complete feature memory and the single PR slice. Test-first failures must be recorded before fixes.
- Review Agent checks schema/migration loss, exact-once derived updates, StrictMode exposure, pure comparator, session stability, SW last-known-good/open-tab behavior, feature-048 invariants, scope exclusion of PR #214, docs, and workflow boundaries.
- Every Implementation Agent feedback item receives Architect task/ticket/not-needed disposition. Normal post-intake requirement questions are not reopened; only documented blocker exceptions return to Orchestrator.
- Orchestrator records the complete cycle PR set and invokes final Architect validation before final Analyst validation. Both validate the same effective content head; later non-evidence changes make validation stale. Architect return limit is 10 and Analyst return limit is 5.
- Merge still requires green configured checks, no blocking review threads/conflicts, acceptance evidence, current process memory, feedback dispositions, current-head guard, and no exceptional human blocker.
