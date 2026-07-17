# Tasks: Typecheck, ESLint и Prettier quality gates

## Task List

- [x] T001 Implementation Agent confirm assigned worktree/branch/base/scope,
  preserve the untracked Analyst/Architect memory and all sibling state, run
  frozen install plus current typecheck/test baselines, and record exact outputs,
  timings and initial inventory before product/tooling edits.
- [x] T002 Add failing-first focused quality-tooling tests for required package
  scripts/dependencies, ESLint flat profiles/rule severity, exact formatter and
  lint allowlists, protected ignores, CI/preflight order, required job identity
  and the 60-second budget. Record the expected initial failures.
- [x] T003 Select mutually compatible exact versions of ESLint 9, `@eslint/js`,
  `typescript-eslint`, React hooks/refresh plugins, `globals` and Prettier from
  primary package metadata; update only devDependencies/lockfile and prove
  frozen install plus peer-dependency compatibility.
- [x] T004 Add `typecheck: tsc --noEmit` without weakening `tsconfig.json`; add
  `tsconfig.eslint.json` only for typed lint coverage of source/root/E2E TS and
  prove the production typecheck still covers all intended `src` files.
- [x] T005 Add ESLint 9 flat config with type-aware browser React profile for
  `src/**/*.{ts,tsx}`, error-level hooks/refresh rules, Node JS profile for all
  `scripts/**/*.mjs`, `tests/**/*.mjs` and the flat config, and typed Node/
  Playwright profile for root configs and `tests/e2e/**/*.ts`.
- [x] T006 Add `lint --max-warnings 0` over the exact allowlist and automated
  `--print-config`/equivalent assertions for `src/App.tsx`, `src/domain.ts`,
  `scripts/shared.mjs`, a Node test, E2E test and Vite config; prove governed
  content/docs/licenses/screenshots are outside the lint target.
- [x] T007 Add Prettier default config with `printWidth: 100`, exact allowlisted
  `format`/`format:check` scripts and defense-in-depth `.prettierignore` for all
  protected/generated/content/license/docs/spec/image/archive paths. Neither
  script may target repository `.`.
- [x] T008 Implement the bounded negative quality helper and tests: temporary
  unique source type error fails real typecheck, temporary conditional-hook TSX
  fails the expected lint rule, malformed allowed code fails format check then
  passes after write, and every sentinel is removed in `finally`. Rerun positive
  gates after cleanup.
- [x] T009 Run initial positive type/lint discovery and fix actual defects
  minimally in semantic commits with focused tests. Do not change hook arrays
  automatically; record every ambiguous item/suppression as Implementation
  feedback for Architect disposition.
- [x] T010 Audit all tests that read `src`/`scripts` source text. Before bulk
  format, make only necessary whitespace-tolerant repairs while preserving the
  original assertions; run focused tests for manual/App/domain/source/screenshot
  workflow contracts and keep changes outside the ignored format revision.
- [ ] T011 Capture a SHA-256 manifest for tracked `content`, `public/content`,
  `LICENSE`, `NOTICE`, `licenses` and README screenshots plus pre-format status;
  run the exact allowlisted formatter, inspect every path, run it a second time
  and prove idempotence and protected-hash identity.
- [ ] T012 Create exactly one format-only commit containing only mechanical
  Prettier changes in the approved code allowlist. Run relevant positives before
  commit and report the immutable full commit SHA; no config/docs/test-contract/
  semantic/process-memory change may be included.
- [ ] T013 In a later normal commit, add the exact T012 SHA to
  `.git-blame-ignore-revs`, document `git blame --ignore-revs-file`, prove the
  commit exists and is format-only, and do not amend/rebase/force-push it.
- [x] T014 Wire `quality:fast` and `baseline-checks` so observed order is
  repository baseline → timed typecheck → lint → format check → negative
  contract → unit → build → E2E; preserve required job name and fail the timed
  combined step above 60 seconds.
- [x] T015 Update `preflight` with equivalent quality gates before unit/build/
  E2E while preserving feature-memory, repository, content/attribution and all
  existing validation. Do not implement general ТЗ-18 deduplication.
- [ ] T016 Update only relevant durable contributor/agent/developer docs with
  the new commands, safe formatter scope, ignore-revs usage and pre-push rule;
  preserve README Docker quick start and end-user host-tool independence.
- [ ] T017 Run focused quality tests and negative contracts; record exact
  command outputs, full candidate SHA, config profile/rule evidence, suppression
  audit, temporary-file cleanup and positive reruns.
- [ ] T018 Run protected-byte/idempotence/format-commit verification and record
  both hash manifests, allowlist-only diff, exact ignored SHA inspection and
  representative blame result. Any protected drift blocks completion.
- [ ] T019 Run `validate:attribution`, `validate:content`,
  `validate:content:quality`, full Node suite, build/service-worker checks, full
  E2E and `preflight`; record exact outcomes/full candidate SHA and do not weaken
  repeated validation as an optimization.
- [ ] T020 Run focused feature-043 regressions for license/About/README image and
  screenshot capture/current-source/recovery/no-recursion contracts; confirm
  public meaning, version, attribution and committed PNG identity are unchanged.
- [ ] T021 Run isolated Docker `make build`, `make up`, HTTP `/` and `/sw.js`
  smoke, and `make down` in `finally` using a free port/project; preserve sibling
  compose projects and record commands/outcomes.
- [ ] T022 Update this feature memory with decisions, dead ends, known issues,
  exact verification evidence and every Implementation Agent feedback item;
  hand each feedback item to Orchestrator for Architect disposition before
  implementation can be considered complete.
- [ ] T023 Commit/push/open one ready PR only under Orchestrator assignment,
  update the cycle PR set with branch/PR/current head/status, and run
  `git diff --check` plus base/head scope guards. Implementation Agent does not
  merge or coordinate required-check reruns unless separately assigned.
- [ ] T024 Review Agent perform thread-aware review of dependency/config
  correctness, target coverage, dangerous ignores/suppressions, source-test
  strength, protected bytes, hidden semantics in the format-only SHA, CI timing/
  order, feature-043/Docker regressions and complete role/process memory.
- [ ] T025 Orchestrator route every review finding and Implementation feedback
  to Architect; Architect records each as a current task, later ticket or
  explicit not-needed disposition. Implementation fixes accepted current tasks
  in the assigned slice and Review Agent rechecks the new head.
- [ ] T026 On the final current PR head, record all five required GitHub checks
  green, measured `quality:fast` ≤60 s on the named GitHub runner/head, no
  unresolved blocking review conversations, no conflicts, current acceptance
  evidence and complete cycle PR set.
- [x] T030 Resolve IF-044-001 as a bounded current task: derive one stable scalar
  `questionId = question?.id` in `LearnView`, use it inside both learning-timer
  effects and their dependency lists, and do not add the mutable `question`
  object or a suppression. Preserve timer initialization, pause/resume,
  expiration and ticket-switch behavior; run the existing focused learning-
  timer E2E regressions and keep this semantic change outside T012.
- [x] T031 Resolve IF-044-002 as a bounded current task: make exam `finish`
  referentially stable across countdown-only renders with `useCallback` or an
  equivalently narrow callback, include its complete closure dependencies and
  list it in the interval effect. Preserve the existing answer-change lifecycle,
  timeout scoring/progress update and manual final-answer completion. Add an
  accelerated/fake-clock E2E proving timeout completes exactly once, persists
  one attempt and does not duplicate progress; use no suppression and keep this
  semantic change outside T012.
- [x] T032 Replace the broad React hooks recommended preset with explicit
  error-level `react-hooks/rules-of-hooks` and
  `react-hooks/exhaustive-deps`, while retaining the separately required React
  refresh rule. Automated config inspection must prove both rules are errors
  and must prove compiler-oriented rules such as `set-state-in-effect` and
  `immutability` are not silently enabled in this cycle.
- [ ] T027 Architect final validation, invoked only by Orchestrator after T001–
  T026 and T030–T032 appear complete, must inspect the full cycle PR set,
  format-only commit,
  feedback dispositions, open tasks, architecture, process memory, checks and
  customer intent. Record pass timestamp/effective content head or gap/return
  count (maximum 10) only in Architect-owned memory.
- [ ] T028 Analyst final validation may run only after T027 passes and must
  validate the original request/acceptance against the same effective content
  head. Any Analyst gap returns to Architect disposition before follow-up.
- [ ] T029 Orchestrator run the current-PR-head/effective-content-head read-only
  guard, prove every later commit is validation-evidence-only, recheck checks,
  review threads, conflicts, acceptance, process memory and blocker exceptions,
  then finalize/merge only when the completion contract is satisfied.

## Decisions

- Delivery is one PR in the Analyst-created handoff; commit separation provides
  an atomic landing and reviewable mechanical migration.
- Production typecheck remains exactly `tsc --noEmit` over strict `src`.
  `tsconfig.eslint.json` is allowed only to extend typed lint coverage to root
  configs/E2E and does not replace production compilation.
- Lint scope intentionally includes all source TS/TSX, all Node scripts/tests,
  E2E TS and root TS configs. This resolves the stale ТЗ estimate rather than
  silently omitting the current 52-script/32-test reality.
- Formatter write/check scope is explicit code only: source TS/TSX/CSS, Node
  scripts/tests, E2E TS and root code configs. Markdown, JSON content/docs/specs,
  licenses, images and generated artifacts remain excluded.
- Exact package versions are selected during Implementation from compatible
  official peer metadata; ESLint must remain major 9 and unrelated runtime
  dependencies cannot be upgraded.
- Failure behavior uses temporary sentinels with mandatory cleanup rather than
  committing invalid fixtures outside the real gate.
- CI enforces and measures the combined positive typecheck+lint budget; a local
  fast run cannot replace GitHub runner evidence.
- `.git-blame-ignore-revs` is necessarily a later metadata commit because a
  commit cannot contain its own final SHA. No history rewrite is needed.
- General CI deduplication remains owned by future ТЗ-18; this cycle preserves
  existing validation even when nested commands repeat work.
- React hooks scope is intentionally explicit: error-level `rules-of-hooks` and
  `exhaustive-deps` satisfy ТЗ-16; the plugin's evolving compiler-style
  `set-state-in-effect`/`immutability` preset is not enabled because it would
  force unrelated ТЗ-04/11 refactoring without an owner requirement.

## Blockers And Known Issues

- No blocking type error at Architect handoff: after frozen install on base,
  `pnpm exec tsc --noEmit` passed in 5.42 s wall time. Final dependencies/config
  and current-head positive/negative runs still require Implementation evidence.
- Actual ESLint findings remain unknown until compatible packages/config are
  installed. Behaviorally ambiguous hooks results are mandatory feedback, not
  permission for an automatic dependency-array edit or blanket suppression.
- Bulk formatting has high conflict risk because `App.tsx`, 52 scripts and
  source-shape tests are large. Orchestrator must coordinate landing order;
  Implementation must not mutate or rebase sibling work.
- The existing build may continue to report the known large-chunk warning from
  feature 043. It is not a ТЗ-16 fix unless evidence shows this slice caused a
  new failure or material regression; route any new observation as feedback.
- Cleanup is not assigned in this task list. The active worktree remains
  protected; any later cleanup requires a separately assigned Cleanup Agent and
  positive-proof evidence/refusal record.

## Implementation Agent Feedback

Implementation Agent appends every divergence, ambiguous lint/type finding,
out-of-scope improvement or known issue here with an ID, evidence and proposed
disposition. It must not implement unplanned work silently.

- IF-044-001: `react-hooks/exhaustive-deps` reports two learning timer effects
  that read `question.id` while depending on `question?.id`; adding the whole
  object could change timer lifecycle. Implementation correctly made no array
  change and added no suppression before disposition.
- IF-044-002: the exam interval effect calls render-local `finish`; adding that
  function directly would restart the interval every countdown render because
  it is recreated and closes over mutable state. Implementation correctly made
  no naive dependency change and added no suppression before disposition.
- Hooks preset scope: the current broad plugin preset also enables compiler-
  oriented rules such as `set-state-in-effect` and `immutability`, which exceed
  the explicit ТЗ-16 hooks requirement and can demand unrelated refactoring.

## Architect Feedback Dispositions

- IF-044-001 — **accepted as bounded current task T030; blocking**. Replace the
  object access with a stable scalar ID in effect bodies/dependencies. This
  satisfies exhaustive-deps without object-identity timer resets. No
  suppression or broader timer refactor is accepted; existing learning timer
  E2E is required.
- IF-044-002 — **accepted as bounded current task T031; blocking**. Stabilize
  `finish` across time-only renders with a complete dependency contract and
  prove accelerated timeout completes/persists exactly once while manual exam
  completion remains green. This is the minimum correctness fix for the
  explicitly requested exhaustive-deps gate, not a ТЗ-11 redesign.
- Broad React hooks recommended preset — **explicit not-needed for this cycle;
  config correction required by T032**. ТЗ-16 explicitly needs hooks legality
  and exhaustive dependencies, so those two rules remain errors. Compiler-
  oriented rules such as `set-state-in-effect` and `immutability` were not
  requested, are version-expanding preset surface, and would pull ТЗ-04/11
  refactors into this PR. Do not open a separate ticket solely to enable the
  whole preset; later component/timer cycles may reassess individual rules with
  their own intake and tests.

## Dead Ends

- Analyst could not run typecheck in the fresh worktree because dependencies
  were not installed. Architect used `pnpm install --frozen-lockfile` (ignored
  local dependency state only) and then confirmed the base compiler passes;
  this resolved environment discovery and did not change tracked repository
  files.
- The original ТЗ inventory of “35+ scripts” is stale: current base contains 52
  script files and feature 043 adds attribution/screenshot tooling. Planning was
  based on current inventory rather than narrowing the lint scope to the old
  estimate.

## Verification Evidence

- Architect discovery only: base/worktree/branch confirmed as
  `830a4336e9d5adc1d1c65517e71084b928e0e914`,
  `/Users/chap/devel/cabadrive-worktrees/044-quality-tooling`,
  `codex/044-quality-tooling`; `pnpm install --frozen-lockfile` succeeded without
  lockfile drift; `/usr/bin/time -p pnpm exec tsc --noEmit` passed with
  `real 5.42`. These are not final-head acceptance results.
- Implementation evidence: pending T001–T023.
- Review/current-head evidence: pending T024–T026.
- Final role/current-head guard evidence: pending T027–T029.

## Cycle PR Set

| Purpose | Branch | PR | Base | Current head | Status | Included in final validation |
|---|---|---|---|---|---|---|
| ТЗ-16 tooling, mechanical migration, docs and feature memory | `codex/044-quality-tooling` | Not opened | `830a4336e9d5adc1d1c65517e71084b928e0e914` | starts at base; feature memory uncommitted | Architect planning | Yes |

Orchestrator/Implementation updates this table when a PR/head exists. Any later
slice requires its own latest-main isolated context and an additional row.

## Final Architect Validation Notes

- Architect validation pass: not yet invoked
- Final Architect validation completed at: not yet invoked
- Architect validated effective content head: not yet invoked
- Architect return count for this work cycle: 0
- Cycle PR set coverage: pending final Architect invocation
- Open-task/feedback/disposition check: pending final Architect invocation
- Gap or next task/ticket/not-needed decision: none recorded at planning
- Limit rule: if another gap would exceed 10 Architect returns, record the limit
  breach and instruct Orchestrator to ask Analyst for a new feature request.
