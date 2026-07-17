# Specification: Versioned Progress Store With Safe History Capping

## Goal

Deliver `ТЗ-06` as one P1 reliability PR: replace the view-owned, manually
persisted v1 progress object with a local-first version-2 progress-store
boundary. The boundary must migrate usable v1 data without silent loss, retain
at most 5,000 answer records, preserve Mistake Review semantics after pruning,
and surface storage recovery to a later UI without adding a backend, cloud
sync, IndexedDB, or import/export controls.

The cycle starts from verified `origin/main`
`830a4336e9d5adc1d1c65517e71084b928e0e914` in the Analyst-created worktree
`/Users/chap/devel/cabadrive-worktrees/045-progress-store` on
`codex/045-progress-store`. Parallel work may exist; preserve every sibling
worktree, branch, dirty diff, commit, PR and process-memory record.

## Scope

### In scope

- A public `src/progressStore.ts` boundary exposing the singleton browser store,
  reducer/dispatch actions `recordAnswer`, `toggleDifficult`, `finishExam`,
  `reset`, `importProgress`, canonical export, recovery subscription/read API,
  and `useProgress()` implemented with `useSyncExternalStore`.
- A small pure implementation module is permitted only to keep the reducer,
  validators, migration, pruning, selectors and injected storage adapter
  deterministic under Node tests. `progressStore.ts` remains the sole public
  application boundary and owns the React/browser wiring.
- Version-2 serialized progress with `version: 2`, retained chronological
  `answers`, `difficultQuestionIds`, `examAttempts`, and ordered
  `prunedAnswerStats` entries.
- Strict v1 loading/migration, v2 import validation, diagnostic preservation of
  malformed local data, an exact-once pruning operation, quota recovery, and
  translation of all four existing mutations plus reset in `App.tsx`.
- A combined selector used by status and Mistake Review that returns the exact
  existing public item shape `{ questionId, wrong, last }`.
- Focused tests, existing tests/E2E, durable frontend/storage documentation
  updates where the implemented contract changes documentation, and feature
  process evidence.

### Out of scope

- Redux, Zustand, another runtime state package, a backend, remote sync,
  accounts, analytics, network calls, IndexedDB, or iOS persistence work.
- UI buttons/files for export/import; this slice supplies only the canonical
  store API and recovery signal for the later TZ-P1 UI work.
- URL routing, App decomposition beyond replacing progress wiring, timer
  redesign, question/content/source changes, or changed learner-facing progress
  semantics.

## Stored Data Contract

### Keys and ownership

- The primary key remains `cabadrive.progress.v1` for in-place compatibility;
  its *payload* is versioned and becomes v2. Keeping the key prevents a split
  between legacy users and new users.
- Before the first successful v2 overwrite of a detected v1 raw payload, the
  exact raw string is written to `cabadrive.progress.v1.backup`. An inability to
  write this backup blocks overwriting the legacy primary payload and produces
  a recovery event; it never silently destroys the only v1 copy.
- A malformed local primary raw payload is copied best-effort to
  `cabadrive.progress.v1.recovery` with a reason code before recovery. This is
  diagnostic local evidence only: it is not rendered as user text, exported, or
  sent over the network. Failure to create a diagnostic copy is itself included
  in the recovery event and never prevents a safe empty/salvaged in-memory
  state.
- The public serialized/export form contains exactly the v2 progress fields,
  in canonical property order: `version`, `answers`, `difficultQuestionIds`,
  `examAttempts`, `prunedAnswerStats`. Recovery state and raw backups are never
  part of it.

### Version-2 shape and invariants

```ts
type PrunedAnswerStat = {
  questionId: string;
  wrong: number;
  lastPrunedAnswer: ProgressAnswer;
  firstSeenOrder: number;
};

type ProgressV2 = {
  version: 2;
  answers: ProgressAnswer[];
  difficultQuestionIds: string[];
  examAttempts: ExamAttempt[];
  prunedAnswerStats: PrunedAnswerStat[];
};
```

- A `ProgressAnswer` has the current exact fields: non-empty `questionId`,
  non-empty `selectedAnswerId` (the existing exam skip value `""` is allowed),
  boolean `isCorrect`, non-empty `answeredAt`, and mode `learning|exam|mistakes`.
  No question-bank lookup is required during recovery, so retained historical
  records remain compatible with a later content update.
- `ExamAttempt` keeps its existing five fields: non-empty `id` and
  `finishedAt`, finite `score` in `0..100`, boolean `passed`, and finite
  non-negative integer `total`.
- Difficult IDs are non-empty, unique strings. Import rejects duplicates;
  local recovery retains first occurrences and reports dropped duplicates.
- Each aggregate record has a non-empty unique `questionId`, a positive integer
  `wrong`, an integer `firstSeenOrder >= 0` unique across aggregate records,
  and a structurally valid `lastPrunedAnswer` whose `questionId` equals its
  record. Canonical output sorts aggregate records by `firstSeenOrder`; newly
  aggregated questions receive the next monotonically increasing order.
- `answers` is chronological insertion order and is always at most `5000` in
  any state accepted by the reducer, loader, importer or persistence path.

### Local load, migration, and corruption recovery

- Parse failure, wrong top-level type, unknown version, or malformed v1 fields
  yields an empty/salvaged v2 memory state plus a recovery event and diagnostic
  backup; it does not throw from app startup.
- A usable v1 payload is structurally validated per nested entry. Valid answer,
  difficult-ID and exam-attempt entries are retained in their original order;
  malformed fragments are omitted and reported. A v1 aggregate does not exist.
  The result starts with an empty `prunedAnswerStats`, then runs the ordinary
  cap helper before persistence.
- A local v2 payload validates retained arrays independently, so a valid suffix
  remains usable after corrupt unrelated local entries. Aggregate data is
  fail-closed as one statistical set: any malformed aggregate entry, duplicate
  aggregate question/order, or answer/question mismatch discards the aggregate
  from calculation and records recovery evidence rather than guessing partial
  counts. Retained answers still drive Mistake Review.
- Import is stricter than local recovery: it validates the entire v2 object and
  every invariant atomically. Unknown versions, malformed nested records,
  duplicate difficult IDs/aggregate question IDs/orders, inconsistent
  `lastPrunedAnswer.questionId`, or non-canonical aggregate order reject with
  no state change and a recoverable import-rejected event.
- Loading a v2 payload does not create another v1 backup and is idempotent.

## Mutation, Persistence, and Quota Contract

- Components never construct and save next progress. They read one store
  snapshot and dispatch named actions. `recordAnswer` appends one answer,
  `toggleDifficult` changes membership once, `finishExam` appends the exact
  completed attempt's answers and one attempt atomically, and `reset` clears
  retained answers, aggregate, difficult IDs and attempts.
- The store is the only code path that serializes/writes progress. The former
  public view persistence helpers are removed or made private adapter detail;
  a static regression proves there is no component-side storage write.
- All action outputs and migrated/imported state first pass one pure helper
  `pruneToLimit(state, max=5000)`. It removes only the needed oldest retained
  prefix, folds every removed answer exactly once, and never reads already
  folded entries as new input.
- Folding processes removed answers chronologically. For each answer it updates
  that aggregate record's `lastPrunedAnswer`; it increments `wrong` only when
  `isCorrect === false`; and it assigns `firstSeenOrder` only when the question
  first reaches the aggregate. Correct-only pruned questions remain aggregate
  records because their last historical answer is still needed if they later
  acquire/retain mistakes.
- Persistence uses a storage adapter injected into the pure store for tests.
  On `QuotaExceededError`, it folds a *new* oldest retained segment and retries:
  the first extra trim is `max(1, ceil(currentRetainedLength / 2))`; subsequent
  retries calculate from the then-current suffix. Each retry therefore changes
  the state before retrying and cannot double count a prefix.
- If no retained answer remains and a write still fails, keep the complete
  resulting memory state, do not remove aggregate data, notify subscribers with
  `storageQuotaExhausted`, and expose canonical export. Other write/security
  failures similarly do not crash a view and produce a typed recovery event.
  Recovery events contain code and safe counts/operation metadata, never raw
  user answer values.

## Selector Compatibility Contract

- Retain `mistakesFromHistory(history)` as the existing history-only utility for
  compatibility tests. Add a v2-aware selector (for example
  `mistakesFromProgress(progress)`) and route StatusStrip/MistakesView through
  it.
- Initialize the selector's insertion-ordered map from aggregate entries in
  ascending `firstSeenOrder`, then apply retained `answers` chronologically.
  A retained answer becomes `last` when present; otherwise
  `lastPrunedAnswer` is returned. Total wrong count is aggregate `wrong` plus
  each incorrect retained answer exactly once.
- Filter zero-wrong records, stable-sort by descending wrong count, and return
  `{ questionId, wrong, last }`. Thus a pruned-only incorrect question remains
  visible and equal-count ordering agrees with the uncapped historical input.

## Acceptance Criteria

1. All progress mutations flow through the store; views contain no manual
   `setProgress`/storage composition or direct localStorage write.
2. A production-shaped valid v1 fixture migrates its three legacy arrays,
   creates empty aggregate before common cap, backs up exact raw v1 before v2
   overwrite, and reloads v2 idempotently.
3. Capping 6,000 answers yields selector output deep-equal to the uncapped
   `mistakesFromHistory`: wrong counts, all `last` records and stable ties match;
   a pruned-only wrong question remains present.
4. Repeated cap and multiple simulated quota retries fold disjoint prefixes
   only once; no wrong count doubles and retained answers win as `last`.
5. Quota exhaustion and local corruption do not crash or silently erase memory;
   they produce a safe recovery event/diagnostic while a valid retained suffix
   remains usable.
6. Canonical export → import → export is equivalent. Invalid imports do not
   change state. Reset clears retained and aggregate history.
7. Learn, Exam and Mistake Review preserve their observable behavior and the
   existing mistake item shape; full app E2E remains green.
8. No out-of-scope runtime dependency, remote storage/backend/IndexedDB, or
   export/import UI control is introduced.

## Negative Scenarios

- A future component can omit persistence because it still receives a mutable
  setter or storage helper.
- Legacy raw data is overwritten before exact backup, or malformed nested data
  is trusted as valid statistics.
- Sequential cap/quota trimming folds a previously-pruned prefix again.
- A wrong answer present only before the cap disappears, tie ordering changes,
  or a retained last answer loses to an old aggregate answer.
- A quota/security exception crashes React, silently drops aggregate counts, or
  leaves snapshots inconsistent.
- Import partially updates state, accepts an unknown v2-like version, or
  manufactures statistics from malformed aggregate data.

## Required Evidence

Record commands, outcomes, full candidate SHA and paths for focused store tests,
source-write static check, migration backup/idempotence fixture, cap/selector
equivalence fixture, multiple quota-retry/exhaustion fixtures, corrupt-local and
invalid-import atomicity fixtures, App integration/E2E, type/build/format/lint
where available, `pnpm run test`, `pnpm run build`, `pnpm run test:e2e`,
`pnpm run preflight`, isolated Docker smoke, `git diff --check`, PR checks,
review threads, cycle PR set and feedback dispositions. Final Architect and
Analyst validations apply to the same effective content head.
