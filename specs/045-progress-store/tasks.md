# Tasks: Versioned Progress Store With Safe History Capping

## Cycle Context

- Feature: `045-progress-store` / P1 `ТЗ-06`.
- Base: verified `origin/main` `830a4336e9d5adc1d1c65517e71084b928e0e914`.
- Handoff branch/worktree: `codex/045-progress-store` /
  `/Users/chap/devel/cabadrive-worktrees/045-progress-store`.
- Cycle PR set: [PR #210](https://github.com/cucumberfalse/cabadrive/pull/210),
  branch `codex/045-progress-store`, published evidence head
  `dc4653f29fca172e65bc2ab4f1610343d80135f0`, purpose: implementation plus
  pre-review process evidence, status: open, included in final validation. Its
  implementation content head is `f3279152b91f4725b7a2787e1c67c164b8c42705`;
  later commits before final validation contain process evidence only.
- Parallel-work rule: preserve all unrelated worktrees, branches, commits,
  PRs, dirty diffs and durable process memory.

## Implementation Tasks

- [x] T001 Confirm branch/worktree/base, inspect current storage/App/domain/E2E
  contracts, preserve existing untracked feature memory, and record the exact
  candidate start SHA. Do not start code if the assigned base/status is
  ambiguous.
- [x] T002 Add focused Node tests for v1 fixture migration, raw backup
  ordering/failure, v2 idempotence, structural validation, local corruption
  recovery, atomic invalid imports, all reducer actions and reset. Use a fake
  injected storage adapter and fault injection; no real browser quota is needed.
- [x] T003 Implement the typed pure v2 core and public browser store facade:
  canonical v2 schema/serialization, actions, immutable snapshots, subscription
  lifecycle, `useSyncExternalStore` hook, canonical export and atomic import.
  Keep browser storage writes solely behind the store boundary.
- [x] T004 Implement strict validators/migration and diagnostic recovery:
  exact legacy key, v1 raw backup before first v2 overwrite, per-entry safe
  salvage, aggregate fail-closed handling, recovery backup/event codes, and no
  raw answer values in event payloads. Record key names/behaviour in tests.
- [x] T005 Implement one pure exact-once pruning helper and combined selector.
  Cap all entry paths at 5,000, preserve aggregate first-seen order/latest
  pruned answer, preserve historical mistake results/ties, and cover a 6,000
  record deep-equality fixture plus sequential trim fixtures.
- [x] T006 Implement quota recovery with multiple injected `QuotaExceededError`
  attempts, first extra half-suffix trim, distinct retry prefixes, exhausted
  retained-history memory consistency, recovery/export event, and no silent
  aggregate deletion. Test non-quota write failures too.
- [x] T007 Translate all current durable write paths: Learn record/toggle,
  Exam finish, Mistakes record and root reset. Subscribe App through
  `useProgress`; use the v2-aware mistake selector in status/review. Remove
  manual `setProgress`/`saveProgress` composition without changing timer,
  answer, exam or mistake-view UX.
- [x] T008 Add source/static regression that durable writes occur only within
  the progress-store boundary; run `rg` evidence for old view persistence and
  inspect the final App prop surface for no lingering progress setter.
- [x] T009 Update only durable docs affected by storage behaviour (frontend,
  backend and feature inventory as appropriate): v2 in-place migration, cap,
  recovery/export API boundary, local-first/no-backend/no-IndexedDB truth.
- [x] T010 Run focused tests then the complete verification matrix. Record exact
  commands, outcomes, candidate SHA, Docker isolation/port and any pre-existing
  non-blocking warnings. Update this file with decisions, dead ends, known
  issues and every Implementation Agent feedback item before PR handoff.
- [x] T011 Commit/push/open exactly one implementation PR when explicitly
  assigned. Record its URL, branch, full head SHA and inclusion in the cycle PR
  set; do not merge, rebase siblings or mutate unrelated state.

## Review And Follow-up Tasks

- [ ] T012 Review Agent perform a thread-aware PR review of the exact current
  head: feature-memory/process compliance; v1 backup ordering; validation and
  import atomicity; aggregate invariants; exact-once quota/cap; selector order;
  React subscription integration; local-first/scope constraints; tests/evidence.
  Report findings as configured review threads, without edits.
- [ ] T013 Orchestrator route every review/Implementation feedback item to an
  Architect disposition and appropriate isolated follow-up. Record each
  disposition here; no finding is silently deferred.
- [ ] T014 Implementation Agent complete accepted follow-ups, refresh focused
  and affected full evidence on the new head, update process memory and obtain
  fresh review/check evidence as required.

## Final Validation And Completion Tasks

- [ ] T015 Orchestrator record complete cycle PR set, required-check/current
  head state, resolved/outdated review threads, conflicts, acceptance evidence,
  feedback dispositions and the effective content head.
- [ ] T016 Architect final validation: verify all assigned tasks/dispositions,
  local-first customer outcome, evidence and PR-set coverage. On pass append
  `Architect validation pass: passed`, ISO timestamp and
  `Architect validated effective content head: <40-hex-sha>` to Architect-owned
  memory. Return gaps through role-appropriate follow-up, maximum 10 times.
- [ ] T017 Analyst final validation only after T016 passes. Append the required
  Analyst pass/timestamp/effective-head markers to `feature-request.md`, or
  route gaps back to Architect disposition, maximum 5 returns.
- [ ] T018 Orchestrator run the read-only current-PR-head guard. If a later
  commit exists, prove it is role/process-evidence-only relative to the same
  effective content head; recheck all required checks, reviews, conflicts,
  process memory, acceptance evidence and feedback disposition before merge.
- [ ] T019 Orchestrator finalize/merge only when all repository completion gates
  pass; then assign Cleanup Agent separately for any completed agent-created
  environment or record explicit not-applicable/refusal evidence.

## Decisions

- Delivery is one atomic reliability PR: public store, pure testable core,
  schema/migration, quota safety and App wiring must land together.
- Primary localStorage key remains `cabadrive.progress.v1`; its payload version
  is authoritative. Exact v1 raw backup key is `cabadrive.progress.v1.backup`;
  malformed-local diagnostic key is `cabadrive.progress.v1.recovery`.
- The aggregate is preserved rather than recomputed from a capped suffix. This
  is required to retain pruned-only mistakes and historical tie/last semantics.
- Local corruption recovery favors safe retained data and no invented aggregate
  statistics; import is all-or-nothing.
- Export/import UI, IndexedDB and all other improvement slices remain deferred.

## Architect Feedback Dispositions

Implementation Agent appends feedback here. Architect adds one disposition per
item: current-feature task, later ticket/backlog, or explicit not-needed, with
reason and evidence.

- F045-001 (needs Architect disposition): the prose invariant says aggregate
  `wrong` is positive, while the required folding algorithm explicitly retains
  correct-only pruned questions so their final historical answer remains
  available. The implementation accepts `wrong: 0` only for such a
  correct-only aggregate record; otherwise a reload would discard the aggregate
  and violate the retention contract. This is a specification wording conflict,
  not an out-of-scope product change.

## Dead Ends And Known Issues

- No implementation dead ends or known product issues beyond F045-001 at this
  handoff.
- A browser cannot guarantee localStorage transactional semantics or quota size;
  deterministic fake-storage tests and a memory-preserving recovery event are
  the safe contract for this local-first slice. The feature deliberately adds no
  recovery/export UI.

## Evidence Log

Implementation content candidate starts from
`830a4336e9d5adc1d1c65517e71084b928e0e914`; exact committed content head and
PR metadata are appended after publication. Effective implementation content
head: `f3279152b91f4725b7a2787e1c67c164b8c42705`.

- `node --test tests/progress-store.test.mjs` — pass: 14 deterministic fixtures
  cover v1 backup/migration/idempotence, local recovery, strict import
  atomicity, 6,000-answer selector equivalence, repeated folding, quota retries
  and exhaustion, reset/actions, the static write boundary, answer
  canonicalization, reset key purging (including failed-rewrite safety),
  zero-wrong aggregate rejection, and mode-scoped empty-answer-ID validation.
- `pnpm exec tsc --noEmit` — pass.
- `pnpm run test` — pass: 520 tests.
- `pnpm run build` — pass; existing large-chunk warning only.
- `pnpm run test:e2e` — pass: 104 Chromium/mobile scenarios, including learning,
  exam score persistence, and mistake-review flows.
- `git diff --check` — pass; `rg -n 'saveProgress\\(|setProgress|localStorage\\.(setItem|removeItem)' src`
  returns no component-side persistence helper or browser write.
- `pnpm run preflight` — pass (feature-memory/repository/content/full Node/build
  and E2E matrix); existing large-chunk warning only.
- Isolated Docker smoke — pass with
  `COMPOSE_PROJECT_NAME=cabadrive-045-progress CABADRIVE_HOST_PORT=5185 make build`,
  `make up`, HTTP 200 at `http://localhost:5185/`, then `make down`.
