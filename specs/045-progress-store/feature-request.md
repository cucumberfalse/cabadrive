# Feature Request: Versioned Progress Store With Safe History Capping

## Intake Metadata

- Feature ID: `045-progress-store`
- Intake role: Analyst
- Assigned worktree: `/Users/chap/devel/cabadrive-worktrees/045-progress-store`
- Assigned branch: `codex/045-progress-store`
- Verified base supplied by Orchestrator: `origin/main` at `830a4336e9d5adc1d1c65517e71084b928e0e914`
- Base confirmation at intake: local `HEAD` and `origin/main` both resolve to `830a4336e9d5adc1d1c65517e71084b928e0e914`; worktree is clean before this Analyst artifact.
- Numbering context: feature `044-quality-tooling` is an active parallel work cycle outside this base; this is the next Orchestrator-assigned feature ID and uses `specs/045-progress-store/`.
- Parallel-work warning: other worktrees, branches, commits, PRs, dirty diffs, and durable process memory may exist. Preserve all of them; do not overwrite, rebase, merge, close, delete, or otherwise mutate sibling work.
- Analyst scope: create only this intake artifact. Do not create `spec.md`, `plan.md`, `tasks.md`, product code, tests, commits, pushes, PRs, reviews, check reruns, or merges.

## Original Request And Prioritization

The owner asked to implement all improvements from `docs/improvements/` in priority order. The first two P0 work cycles are independently in flight/completed under their own feature memory: license/attribution documentation (TZ-22) and quality tooling (TZ-16). The next user-authorized P1 reliability slice is **TZ-06: centralized progress store with migrations and a history cap**.

This intake turns only TZ-06 into a standalone work cycle. It must not opportunistically implement other P1 items such as App decomposition (TZ-04), routing (TZ-05), search (TZ-09), timers (TZ-11), iOS persistence/IndexedDB (TZ-15), or the UI export/import work delegated by TZ-P1.

## Product Context And Problem

Cabadrive is a static, local-first React/Vite trainer for Russian-speaking drivers preparing for the CABA theory exam. It has no runtime backend and must remain usable offline after build. User learning history is currently held in `App.tsx` and persisted through `src/storage.ts` with localStorage key `cabadrive.progress.v1`.

The current code repeats the unsafe pattern `next progress -> setProgress(next) -> saveProgress(next)` at the learning answer path, difficult-question toggle, completed exam, and mistake-review answer path. A later feature can omit the second operation and silently lose user data. The persisted object has no schema version or migration path, validates only top-level arrays, and appends every answer forever. Active use can exhaust browser localStorage quota; malformed nested entries can reach the runtime.

The learner must retain useful mistake statistics even when answer history is capped. The current `mistakesFromHistory` output drives the mistake-review view and has an observable contract: `{ questionId, wrong, last }`, descending by wrong count with stable historical ordering for ties.

## Desired Outcome

Replace scattered progress writes with a single local progress-store boundary. It exposes a reducer/action API and `useSyncExternalStore` hook, automatically persists consistent state, uses an explicit version-2 serialized schema, safely migrates existing v1 data, caps retained answer records, and preserves exact mistake-review semantics through a durable aggregate of pruned history.

The product remains local-first: no Redux/Zustand dependency, backend, cloud synchronization, or IndexedDB migration is introduced in this slice. Existing view behavior and the displayed mistake item shape remain unchanged.

## Scope

In scope:

- A `src/progressStore.ts` boundary with reducer actions `recordAnswer`, `toggleDifficult`, `finishExam`, `reset`, and `importProgress`, automatic persistence from its sole update path, and a `useProgress()` subscription based on `useSyncExternalStore`.
- Versioned persisted schema `version: 2`, including `answers`, `difficultQuestionIds`, `examAttempts`, and ordered `prunedAnswerStats` records `{ questionId, wrong, lastPrunedAnswer, firstSeenOrder }`.
- Safe v1-to-v2 migration: strictly validate usable legacy data, preserve valid legacy arrays before capping, create an initially empty aggregate, back up the raw v1 string before first v2 write, then apply the common cap/pruning operation if necessary.
- Strict nested validation and recovery behavior for local data; invalid aggregate fragments do not manufacture mistake statistics, are retained in diagnostic backup/evidence, and produce a visible development diagnostic (`console.warn` and/or recovery event) while a valid retained suffix can remain usable.
- A single, pure pruning helper that limits retained `answers` to `N = 5000`, folds only the newly removed prefix exactly once, keeps aggregate insertion order, preserves each question's latest pruned `ProgressAnswer`, and never re-aggregates already folded data.
- A selector that combines pruned aggregate and retained suffix while preserving the current `mistakesFromHistory` behavior for `{ questionId, wrong, last }`, including pruned-only mistakes and stable ties.
- Quota-safe persistence: catch localStorage quota failures, prune a new oldest retained segment (first retry begins with half the retained history), retry without double counting, and leave a consistent in-memory state plus UI-consumable recovery/export event if history is exhausted.
- Store-level canonical JSON export/import. Import validates the complete v2 object atomically, rejects unknown versions and invalid/duplicate/inconsistent aggregate data, applies the same cap only after validation, and only then replaces store state. UI controls for export/import remain out of scope for TZ-P1.
- Translation of the four current write paths and reset to the store API; removal of manual persistence from views; focused unit tests and regression coverage, then applicable repository verification.
- Updates to durable project docs only where the implemented storage contract changes them.

Out of scope:

- Redux, Zustand, or another external state library.
- Cross-device synchronization, accounts, server APIs, cloud backups, or runtime network calls.
- IndexedDB or iOS-specific persistence changes (TZ-15).
- New UI export/import controls, theme/usability work, routing, timer redesign, or App decomposition.
- Changing canonical question content, source status, the fallback-bank disclaimer, or normal learning/exam/mistake-review UX semantics.

## Functional Requirements

1. **Single write boundary.** Every progress mutation goes through the store reducer/dispatch API. `saveProgress` or its replacement is invoked only by the store persistence path; components do not compose and save next state manually.
2. **Schema and migration.** The canonical serialized form is v2. Migration of valid legacy v1 storage preserves `answers`, `difficultQuestionIds`, and `examAttempts`, backs up the original raw v1 payload before v2 persistence, and is idempotent on subsequent v2 loads.
3. **Retention semantics.** Retained answer history is chronological and capped at 5,000 records. Folding a prefix adds each removed incorrect answer once to that question's aggregate `wrong`, updates `lastPrunedAnswer` on every removed answer, and assigns `firstSeenOrder` only on first aggregation.
4. **Mistake selector compatibility.** Build the combined result by initializing aggregate records in `firstSeenOrder` and then applying retained answers chronologically. The last retained answer wins when present; otherwise `lastPrunedAnswer` is used. Include only positive wrong counts, sort descending by count, and retain stable first-seen ordering for equal counts.
5. **Quota behavior.** Apply normal cap before initial write. On `QuotaExceededError`, fold a distinct additional oldest prefix and retry; all retries must operate on the then-current retained suffix. If no retained history remains and storage still cannot be written, do not crash or silently discard in-memory progress; issue a recoverable event suitable for a later UI notification/export.
6. **Export/import/reset.** Export produces canonical complete v2 JSON. Import is all-or-nothing and validates version, all nested entries, unique `questionId` and `firstSeenOrder`, and `lastPrunedAnswer.questionId` consistency before applying cap and replacing state. Reset clears both retained answers and aggregate along with the existing progress fields.
7. **Compatibility.** Learn, Exam, and Mistake Review retain their observable behavior; view consumers receive the existing mistake record shape and e2e flows remain valid.

## Acceptance Expectations

- `rg 'saveProgress\\(' src` identifies exactly one persistence invocation, inside the progress-store boundary.
- A production-shaped v1 fixture migrates with valid answer, difficult-ID, and exam-attempt values unchanged before cap; its v2 reload is idempotent and its original raw value is backed up before overwrite.
- A 6,000-answer full history and its capped v2 representation produce deep-equal mistake results: cumulative wrong counts, tie order, and all `last` fields match; a wrong answer existing only in the pruned prefix remains visible through `lastPrunedAnswer`.
- Sequential cap invocations and multiple simulated quota retries fold distinct prefixes only once; combined aggregate plus retained wrong counts never double count and last retained answers override pruned last answers.
- Simulated `QuotaExceededError` recovery performs multiple trims without crashing. If retained history is exhausted, the application holds consistent in-memory state and emits the documented recovery signal rather than silently losing data.
- Valid export-import-export is canonically equivalent and has the same selector output. Unknown versions, malformed nested records, duplicate aggregate keys/order, or mismatched `lastPrunedAnswer.questionId` reject import without changing current state.
- Corrupt local aggregate content neither crashes the app nor creates fabricated mistakes; valid retained suffix data remains usable and diagnostic backup/warning evidence is produced.
- Reset clears `answers` and `prunedAnswerStats`. Existing views preserve user-facing flow and their `{ questionId, wrong, last }` mistake shape.
- Tests cover reducer actions, migration, validation/recovery, pruning, quota retries, selector equivalence/order, import/export, and reset. Relevant unit tests, typecheck/lint/format/build/e2e/preflight gates are executed according to Architect's validation matrix and record actual evidence.

## Negative Scenarios

- A new view dispatches a local `setProgress` and forgets persistence because progress writes remain available outside the store.
- A migration drops v1 difficult IDs or exam attempts, overwrites raw legacy data before backup, or treats invalid nested values as trustworthy.
- Repeated capping or quota retries fold the same answer twice and inflate wrong-count statistics.
- A question answered incorrectly only in a pruned prefix disappears from Mistake Review, or stable tie ordering changes.
- A quota exception crashes the app, silently removes aggregate information, or leaves UI state inconsistent with the store.
- A malformed import partially changes progress, accepts an unknown version, or invents statistics from corrupt aggregate data.
- Implementation adds remote storage, a backend, IndexedDB, external state packages, or UI export/import controls under this reliability slice.

## Assumptions And Decisions To Validate

- Existing `ProgressAnswer` and `ExamAttempt` field shapes are the compatibility source of truth; Architect must enumerate and validate them against current content/runtime types before finalizing schemas.
- `N = 5000`, the v2 field names, and the v1 key/backup key specified in TZ-06 are the approved contract for this slice. Architect should document exact key naming and recovery-event ownership without changing the stated user-data guarantees.
- A valid retained suffix may be retained when a local aggregate fragment is corrupt, but corrupt aggregate entries must not contribute to statistics; diagnostics must not expose sensitive data.
- The store's export/import API can be implemented without UI controls, while its recovery signal must be consumable by a future UI slice rather than requiring a network service.
- No normal-flow product clarification is needed: the detailed TZ-06 requirements and the owner's broad priority authorization define the intended behavior. Any conflict with current types, browser API limits, or data-loss safety is an Architect/Orchestrator blocker, not a reason to weaken guarantees silently.

## Risks And Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Migration corrupts user data | Critical | Raw v1 backup before first v2 write; strict validation; fixture-based migration and idempotence tests. |
| Repeated pruning double counts | High | One pure helper consumes only a new retained prefix; compare full and capped selector outputs across repeated trim and quota fixtures. |
| Aggregate corruption fabricates mistakes | High | Per-entry validation, duplicate/invariant rejection, diagnostic backup/warning, and no aggregate inference from invalid values. |
| Aggregate itself cannot fit quota | Medium | Preserve consistent memory state, avoid silent counter deletion, emit recovery/export signal, and record limitation. |
| Concurrent future TZ-P1 persistence UI conflicts | Medium | Establish store API first; future UI calls its public actions and does not recreate storage logic. |
| App.tsx is large and parallel P1 refactors may overlap | Medium | Keep this slice to storage integration points; record any wider refactor need for Architect disposition rather than absorbing it. |

## Research And Evidence Sources

No external research is necessary for intake: requirements are explicitly defined in the owner-authorized durable improvement specification. Sources inspected:

- `AGENTS.md` and `.specify/memory/constitution.md` for role, worktree, PR, and validation constraints.
- `docs/improvements/README.md` for priority sequencing and dependency statement that TZ-06 precedes persistence slices in TZ-P1.
- `docs/improvements/06-progress-store.md` for the complete functional contract, cap/migration algorithm, risks, and acceptance criteria.
- `docs_project/project-idea.md`, frontend/backend docs, feature inventory, and learning/exam flows for the local-first/no-backend product boundary and current progress behavior.
- `src/storage.ts`, `src/domain.ts`, `src/App.tsx`, `tests/domain.test.mjs`, and `tests/e2e/app.spec.ts` for the current v1 key, four manual write paths, selector contract, and e2e localStorage dependency.

## Role Boundaries And Handoff

- Analyst has created only this intake artifact and now hands off to Orchestrator.
- Architect must create `spec.md`, `plan.md`, and `tasks.md`, choose testable module boundaries, specify exact validation/recovery/backup/event contracts, keep scope isolated, and record the cycle PR set and verification matrix.
- Implementation may start only after full feature memory and explicit Orchestrator assignment in an isolated latest-main worktree/branch/PR slice. It must record decisions, dead ends, known issues, actual evidence, and any feedback for Architect disposition.
- Review must assess data-loss safety, migration/selector invariants, tests, local-first constraints, scope control, and process compliance without changing repository files.
- Orchestrator owns PR state, checks, review routing, final Architect-before-Analyst validation, current-head guard, and merge; cleanup is separate and only by an explicitly assigned Cleanup Agent.

## Initial Cycle Context

At intake, no implementation PR exists for this feature. The Analyst handoff context is branch `codex/045-progress-store` in `/Users/chap/devel/cabadrive-worktrees/045-progress-store`, from verified `origin/main` `830a4336e9d5adc1d1c65517e71084b928e0e914`. Orchestrator may explicitly continue this latest-main intake context as the single implementation PR slice or assign a separate fresh latest-main implementation worktree; any additional slice must be recorded in feature memory.

## Final Analyst Validation Notes

This append-only Analyst-owned section is reserved for a later explicit Orchestrator request after final Architect validation passes.

