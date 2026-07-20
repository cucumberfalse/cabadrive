# Implementation Plan: Versioned Progress Store With Safe History Capping

## Delivery Shape

Use the Analyst-created latest-main handoff as one implementation branch and
one PR slice. The pure storage contract, App integration, migration and tests
are inseparable: splitting them would temporarily create a path that reads one
schema and writes another. No new state package is justified. A pure core under
the public `progressStore.ts` facade is justified solely to make destructive
storage scenarios executable under deterministic Node tests while the facade
provides the required React `useSyncExternalStore` hook.

## Implementation Sequence

1. **Confirm current integration and write failing tests**
   - Reconfirm assigned branch/worktree/base and preserve the untracked Analyst
     and Architect feature memory plus all siblings.
   - Capture current `ProgressAnswer`, `ExamAttempt`, `StoredProgress`, App
     write-path and E2E localStorage assumptions. Do not infer alternate field
     shapes.
   - Add focused failing fixtures first for v1 migration/backup/idempotence,
     strict local recovery, strict atomic import, cap equivalence/ties,
     repeated trim, quota retries/exhaustion, reducer actions and reset.

2. **Build the pure v2 core**
   - Introduce typed v2 data/recovery/action contracts and a `StorageLike`
     injected factory. Keep reducer transitions, canonical serialization,
     validators, v1 loader, aggregate selector and pruning side-effect-free.
   - Retain legacy primary key, reserve exact backup/recovery keys, and write
     the v1 backup before the first v2 overwrite. Validate per field/entry;
     preserve safe retained fragments but fail closed for a corrupt aggregate.
   - Implement cap and quota trimming as one exact-once helper, not duplicate
     loops in actions/import/persistence.

3. **Wire browser boundary and persistence**
   - Implement browser singleton, subscriber lifecycle, typed recovery event,
     action dispatch and `useProgress()` in `src/progressStore.ts` using
     `useSyncExternalStore`. Keep localStorage access behind the adapter so
     Node tests use a fault-injecting fake.
   - Serialize only in this boundary. Handle backup/write/quota/security errors
     without React exceptions; notify a future UI/export consumer while retaining
     an internally consistent snapshot.
   - Export only canonical v2 JSON; validate import completely before cap,
     replacement, notification and persistence.

4. **Integrate without altering learner flow**
   - Replace App's root `useState(loadProgress)` with store subscription.
   - Replace Learn record/toggle, Exam finish, Mistakes record and header reset
     with named dispatch actions. Do not alter timer/session state or question
     rendering.
   - Route StatusStrip and MistakesView through the combined selector. Remove
     manual persistence imports and ensure no component makes a localStorage
     write or accepts `setProgress` for durable state.

5. **Protect and document the contract**
   - Add a focused static regression over `src/` proving the only storage write
     implementation belongs to the progress-store boundary and old view
     save/set composition is absent.
   - Update only relevant frontend/backend/project inventory docs to state v2
     localStorage migration/cap/recovery and no backend/IndexedDB/UI controls.
   - Keep recovery signal's future UI ownership explicit; no notification UI is
     introduced now.

6. **Verify and hand off**
   - Execute the matrix below in a clean-enough isolated runtime. Record actual
     output, limitations and full candidate SHA in `tasks.md`; record every
     out-of-scope discovery for Architect disposition rather than implementing
     it.
   - Commit/push/open one ready PR only under the Implementation Agent's
     assignment. Review checks data loss, exact-once folding, selector ordering,
     App integration, no dependency/scope expansion and process compliance.

## Verification Matrix

| Boundary | Command/evidence | Pass condition |
|---|---|---|
| Store core | `node --test tests/progress-store.test.mjs` | Migration/backup, validation/recovery, all actions, cap, selector, repeated trim, quota retry/exhaustion, import/export and reset assertions pass deterministically |
| Existing selector | `node --test tests/domain.test.mjs` | Legacy history selector contract remains green |
| Storage-write boundary | focused static test plus `rg -n 'localStorage\\.(setItem|removeItem)|saveProgress\\(' src` | No view write/manual save remains; any write implementation is confined to progress-store adapter/boundary |
| Full Node suite | `pnpm run test` | All test files pass, including new regressions |
| Type/build | `pnpm run build` | Production bundle/service worker succeeds; no new runtime network/dependency |
| E2E | `pnpm run test:e2e` | Existing learner/exam/mistake flows work with v2 store; add minimal migration/localStorage assertion if coverage needs it |
| Repository gate | `pnpm run preflight` | Feature memory, validation, tests, build and E2E pass on candidate head |
| Docker | isolated free port/project: `make build`, `make up`, smoke at that port, `make down` | Docker-only contract and local persisted app startup work without disturbing siblings |
| Diff/process | `git diff --check`, scoped diff and tasks evidence | No whitespace/scope issue; decisions/dead ends/known issues/feedback are current |

## Review And Finalization Gates

- Review Agent reports data-loss, validation, ordering, migration-backup, quota,
  race/snapshot, import atomicity, regression and workflow findings as PR review
  threads without editing files.
- Implementation feedback must receive an Architect task/ticket/not-needed
  disposition. The cycle PR set records this single branch/PR and all later
  evidence-only heads.
- After checks, review resolution and acceptance evidence, Orchestrator invokes
  final Architect validation, then final Analyst validation, against the same
  effective content head. Any later non-evidence change invalidates both.
- Orchestrator runs the required current-head guard, merges only after all
  configured checks are green/no conflicts/no blocking threads, and assigns
  cleanup separately if applicable.

## Risks, Decisions, and Boundaries

- **Backup failure is data-loss-sensitive:** never overwrite v1 until its exact
  raw backup is written. A memory-only recovered state/event is safer than
  destructive migration.
- **Aggregate corruption is untrustworthy:** discard the entire aggregate for
  statistics while retaining safe suffix fields. This loses no trusted retained
  data and cannot manufacture wrong counts.
- **Quota is not transactional:** each retry uses a newly pruned state; the
  in-memory snapshot is the source of truth for that session if persistence
  cannot finish. An export API makes later recovery possible without inventing
  UI in this feature.
- **No future UI coupling:** recovery events are typed and consumable but do
  not dictate an alert design. TZ-P1 owns controls/notification affordances.
- **No cleanup or GitHub mutation by Architect:** only Implementation changes
  files beyond Architect-owned memory; Orchestrator controls PR/check/merge.
