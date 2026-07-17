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
- [x] T011 Capture a SHA-256 manifest for tracked `content`, `public/content`,
  `LICENSE`, `NOTICE`, `licenses` and README screenshots plus pre-format status;
  run the exact allowlisted formatter, inspect every path, run it a second time
  and prove idempotence and protected-hash identity.
- [x] T012 Create exactly one format-only commit containing only mechanical
  Prettier changes in the approved code allowlist. Run relevant positives before
  commit and report the immutable full commit SHA; no config/docs/test-contract/
  semantic/process-memory change may be included.
- [x] T013 In a later normal commit, add the exact T012 SHA to
  `.git-blame-ignore-revs`, document `git blame --ignore-revs-file`, prove the
  commit exists and is format-only, and do not amend/rebase/force-push it.
- [x] T014 Wire `quality:fast` and `baseline-checks` so observed order is
  repository baseline → timed typecheck → lint → format check → negative
  contract → unit → build → E2E; preserve required job name and fail the timed
  combined step above 60 seconds.
- [x] T015 Update `preflight` with equivalent quality gates before unit/build/
  E2E while preserving feature-memory, repository, content/attribution and all
  existing validation. Do not implement general ТЗ-18 deduplication.
- [x] T016 Update only relevant durable contributor/agent/developer docs with
  the new commands, safe formatter scope, ignore-revs usage and pre-push rule;
  preserve README Docker quick start and end-user host-tool independence.
- [x] T017 Run focused quality tests and negative contracts; record exact
  command outputs, full candidate SHA, config profile/rule evidence, suppression
  audit, temporary-file cleanup and positive reruns.
- [x] T018 Run protected-byte/idempotence/format-commit verification and record
  both hash manifests, allowlist-only diff, exact ignored SHA inspection and
  representative blame result. Any protected drift blocks completion.
- [x] T019 Run `validate:attribution`, `validate:content`,
  `validate:content:quality`, full Node suite, build/service-worker checks, full
  E2E and `preflight`; record exact outcomes/full candidate SHA and do not weaken
  repeated validation as an optimization.
- [x] T020 Run focused feature-043 regressions for license/About/README image and
  screenshot capture/current-source/recovery/no-recursion contracts; confirm
  public meaning, version, attribution and committed PNG identity are unchanged.
- [ ] T021 Run isolated Docker `make build`, `make up`, HTTP `/` and `/sw.js`
  smoke, and `make down` in `finally` using a free port/project; preserve sibling
  compose projects and record commands/outcomes. If two bounded attempts stall
  only fetching uncached upstream base-image metadata/layers, stop them cleanly,
  prove the isolated project has no containers, record exact durations/stage and
  route through T037 instead of calling the local smoke passed.
- [x] T022 Update this feature memory with decisions, dead ends, known issues,
  exact verification evidence and every Implementation Agent feedback item;
  hand each feedback item to Orchestrator for Architect disposition before
  implementation can be considered complete.
- [x] T023 Commit/push/open one ready PR only under Orchestrator assignment,
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
- [x] T033 Resolve IF-044-003 protected-scope discovery as a bounded current
  task. Read every `.ts` path from
  `content/manual-ticket-placement/manual-content-baseline.json` protected
  sources; independently cross-check it equals all tracked
  `src/data/manual-sections/*.ts` plus `src/data/manualGuide.ts` and
  `src/data/pandemiaVialSection.ts` (52 paths on this head). Add fail-closed
  Prettier exclusions for the directory and two exact files, and automated
  `prettier --file-info --ignore-path .prettierignore` assertions proving every
  canonical path is ignored. Do not update the baseline, pins or evidence.
- [x] T034 Before touching the rejected mechanical diff, prove the 52 newly
  excluded files have no staged change and differ from current semantic `HEAD`
  only by the Implementation Agent's formatter run. Then restore exactly those
  paths from `HEAD`; this disposition authorizes no restore/revert of any other
  dirty file. Re-run manual-ticket-placement validation and the full Node suite
  immediately, record the failure delta, and treat disappeared hash/governance
  failures as fixed without test changes. Any semantic/staged ambiguity returns
  to Orchestrator rather than using whole-file restore.
- [x] T035 Repair only the remaining whitespace-sensitive assertions after
  T034, limited to `tests/ai-review-workflow.test.mjs`,
  `tests/content-manual-guide-chapters.test.mjs`,
  `tests/content-manual-vehiculo-4ruedas.test.mjs`,
  `tests/content-pandemia-vial-section.test.mjs` and
  `tests/manual-ticket-placement.test.mjs`. Preserve exact semantic symbols,
  JSX props/order, source-safety boundaries and negative assertions using
  whitespace-tolerant regex, stable indices or balanced-source helpers. Do not
  change expected hashes/fingerprints, registry facts, protected validator
  expectations, skip/delete tests or weaken assertions. Commit these repairs
  as semantic pre-format work and rerun focused/full Node tests.
- [x] T036 Discard the rejected 148-file discovery diff as a format-commit
  candidate; after T033–T035 land on a clean semantic head, run a completely
  fresh `pnpm run format`. Capture protected hashes including all 52 governed
  TS sources, prove zero governed diff and passing manual-ticket placement,
  rerun format for idempotence plus full Node/quality checks, and only then
  create the single T012 format-only commit. Never partially stage/reuse the
  rejected discovery diff or regenerate pins/evidence.
- [ ] T037 Resolve IF-044-004 infrastructure fallback at final current head.
  Record both bounded local Docker attempts, exact isolated project/port,
  metadata/pull stall points, cancellations, successful host registry curl and
  empty `docker compose ps -a`; confirm no sibling project/container was
  touched. Then require GitHub `docker-validation` green on the exact full PR
  head and inspect evidence that its Docker build, app start, HTTP `/` and
  `/sw.js` smoke, and always-run teardown all succeeded. Only that pairing may
  close T021 through fallback; missing/queued/stale/cancelled/red GitHub Docker
  evidence remains a merge/final-validation blocker.
- [x] T038 Fix P2 `PRRT_kwDOSX65IM6R4bjG` as a bounded current task. Register
  `SIGINT`/`SIGTERM` cleanup before sentinel creation, track/remove only
  process-created sentinels, and preserve the terminating signal/conventional
  exit semantics. Add deterministic subprocess tests that wait until a
  sentinel-created marker, interrupt separately with both signals, prove all
  sentinel paths absent, and run the normal helper successfully immediately
  afterward. Existing stale-file refusal and normal `finally` cleanup must stay
  fail-closed.
- [x] T039 Fix P2 `PRRT_kwDOSX65IM6R4bjJ` as a bounded current task. Export an
  event-safe full source head using PR `github.event.pull_request.head.sha` with
  `github.sha` fallback, validate/log the 40-hex value in the same timing line
  as elapsed seconds and 60-second budget, and strengthen workflow tests to
  reject synthetic-merge-only or unbound timing evidence. Current-head GitHub
  logs must show the exact PR head and measured bound.
- [x] T040 Fix P2 `PRRT_kwDOSX65IM6R4bjM` as a bounded current task. Replace the
  syntax-only TypeScript preset for `tests/e2e/**/*.ts`, `vite.config.ts` and
  `playwright.config.ts` with the compatible type-checked recommended profile
  backed by `tsconfig.eslint.json`. Resolve resulting real diagnostics narrowly
  without blanket rule disable. Calculated-config tests must prove error-level
  `await-thenable`, `no-floating-promises` or equivalent type-information rules
  for both E2E and Vite representatives, then `lint --max-warnings 0` passes.
- [x] T041 Fix P3 `PRRT_kwDOSX65IM6R4bjP` as a current contract task. Replace
  root `*.config.ts` in `lint`, `format`, `format:check` and the flat-config
  profile with literal `vite.config.ts` and `playwright.config.ts`. Test the
  complete exact target list/order for all three scripts and calculated config;
  a new root config must require an intentional reviewed allowlist change.
- [x] T043 Verify the disposed T040 legacy-fixture exception before T042. Exact
  calculated config for `tests/e2e/app.spec.ts` may disable only
  `no-unsafe-argument`, `no-unsafe-assignment`, `no-unsafe-call`,
  `no-unsafe-member-access` and `no-unsafe-return`; `await-thenable` and
  `no-floating-promises` remain errors. Prove all five unsafe rules are errors
  for `tests/e2e/manual-ticket-placement.spec.ts`, `vite.config.ts` and
  `playwright.config.ts`; prove no inline/file ESLint disable was added; rerun
  lint plus the full E2E suite. Record later-ticket disposition to type or
  runtime-validate legacy JSON fixture loading during ТЗ-17 intake.
- [ ] T042 After T038–T041 and T043, run focused quality-tooling tests, both signal
  interruption regressions, normal negative helper, calculated-config checks,
  typecheck/lint/format check, affected full Node/preflight, suppression audit,
  exact target/scope guard and `git diff --check`. Implementation records the
  new full head and pushes only under assignment. Review Agent performs fresh
  thread-aware review on that exact head; Orchestrator resolves/outdates the
  four threads and rechecks all required checks, including T037 Docker evidence,
  before final validation.
- [ ] T044 Fix P2 `PRRT_kwDOSX65IM6R44d7` as a bounded current task. Keep the
  integration-preserving pull-request checkout, capture the actual measured
  checkout with `git rev-parse HEAD` after checkout, validate both it and the
  event-safe source SHA as full 40-hex values, and print both with duration and
  the 60-second budget. Workflow tests must reject a missing/invalid measured
  SHA and wording that attributes synthetic-merge timing to the source head.
  Exact-current-head GitHub evidence must bind the check suite to the unchanged
  PR source and the timing to the logged measured checkout.
- [ ] T045 Fix P2 `PRRT_kwDOSX65IM6R5NtC` as a bounded current task. Extend
  `scripts/finalize-pr.mjs` with explicit opt-in `--merge-method merge`, retain
  `squash` as the default, reject unsupported values, expose the selected
  method in dry-run output and preserve expected-head, required-check, review-
  thread, conflict, process-evidence and auto-merge gates. Add focused
  `tests/finalize-pr.test.mjs` coverage and update
  `docs_project/project/devops/ai-pr-workflow.md`. Record read-only proof that
  GitHub permits merge commits. PR #209 must select merge, never squash/rebase;
  a follow-up ignore entry for the mixed squash revision is explicitly rejected.
- [ ] T046 Dispose P2 `PRRT_kwDOSX65IM6R5f6z` with an exact-new-head ancestry
  guard before T047. Record GitHub API PR head/commit-list evidence and run
  `git merge-base --is-ancestor c359350358a82d0250934d627c65b5a5a0de6a8a
  <exact-head>`. The cited
  `7fd66ff` is neither current API head nor a current PR commit in the evidence
  captured at disposition, while `c359350…` is an ancestor of current head
  `f3a96b078762ac6f3982f3de749d0a7489566562`; therefore the finding is treated
  as stale/mismatched-review-head evidence, not a valid current topology claim.
  If either current-head assertion changes, stop and return to Architect; do
  not rewrite commits or replace metadata. Fresh Review Agent confirmation and
  Orchestrator thread disposition are still required.
- [ ] T047 After T044–T046, run focused workflow/finalizer/quality tests,
  finalizer dry-run for explicit merge, current-head ancestry and representative
  blame checks, affected full Node/preflight, `git diff --check` and all required
  GitHub checks including T037 Docker evidence. Review Agent performs fresh
  thread-aware review on that exact head. Orchestrator resolves/outdates all
  three current threads only from current evidence, confirms the earlier four
  remain resolved/outdated, and records merge-commit selection before final
  role validation.
- [ ] T027 Architect final validation, invoked only by Orchestrator after T001–
  T026 and T030–T047 appear complete, must inspect the full cycle PR set,
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
  then finalize PR #209 with the guarded explicit merge-commit method only when
  the completion contract is satisfied. After landing, fetch `origin/main`,
  prove `c359350358a82d0250934d627c65b5a5a0de6a8a` remains its ancestor and
  rerun representative `git blame --ignore-revs-file`; squash/rebase or a mixed
  squash-SHA follow-up is not an allowed fallback.

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
  fast run cannot replace GitHub runner evidence. The log names both event
  source head and actual checkout measured by `git rev-parse HEAD`.
- `.git-blame-ignore-revs` is necessarily a later metadata commit because a
  commit cannot contain its own final SHA. No history rewrite is needed. PR
  #209 uses guarded merge-commit finalization so the referenced commit reaches
  `main`; the finalizer's default remains squash for unrelated PRs.
- General CI deduplication remains owned by future ТЗ-18; this cycle preserves
  existing validation even when nested commands repeat work.
- React hooks scope is intentionally explicit: error-level `rules-of-hooks` and
  `exhaustive-deps` satisfy ТЗ-16; the plugin's evolving compiler-style
  `set-state-in-effect`/`immutability` preset is not enabled because it would
  force unrelated ТЗ-04/11 refactoring without an owner requirement.
- Formatter scope is the nominal code allowlist minus the baseline-derived
  governed manual TS inventory. Current effective exclusions are all
  `src/data/manual-sections/**`, `src/data/manualGuide.ts` and
  `src/data/pandemiaVialSection.ts`; lint/typecheck still cover these sources.
- Local Docker infrastructure fallback is permitted only for bounded external
  base-image fetch stalls with clean empty-project evidence and is conditional
  on successful required `docker-validation` at the exact final PR head. It is
  not a standalone pass and does not weaken the Docker-only runtime contract.
- T040's sole suppression exception is an exact-file five-rule unsafe-family
  override for legacy `tests/e2e/app.spec.ts` runtime JSON fixtures. Typed
  control-flow rules remain errors; all unsafe rules remain errors in other E2E
  and root config files. Fixture typing/validation is deferred to ТЗ-17 intake.

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
- Local Docker is currently environment-blocked before repository build steps:
  two bounded isolated attempts stalled fetching metadata/layers for uncached
  `node:22-alpine` / `nginx:1.29-alpine`; host registry curl succeeded and the
  compose project has no containers. This is not product-failure evidence and
  not a pass; T037 remains blocking until exact-head GitHub Docker success.
- Review Agent found four unresolved current-head contract gaps on
  `93897984738a2cb6941f793f81699e61267840ab`: three P2 failures in signal
  cleanup, source-head timing evidence and typed root/E2E lint coverage, plus
  one P3 exact-allowlist drift. All are accepted as current T038–T042 work;
  prior no-findings automation does not close these thread-aware findings.
- A later native review added three unresolved P2 threads. The measured-checkout
  identity gap and squash-loss of the ignored SHA are accepted as blocking
  T044–T045/T047 work. The third thread cites `7fd66ff`, which is absent from
  the current PR commit list; local and GitHub evidence instead show
  `c359350…` in the PR stack and ancestral to current API head `f3a96b0…`.
  T046 therefore treats only that topology claim as stale/mismatched while
  still requiring exact-new-head guard and fresh review.
- T040 exposed 280 typed-lint findings in legacy E2E: 13 real assertion/async/
  await/unbound issues were fixed, while 267 unsafe-family reports propagate
  from runtime `JSON.parse` fixture roots. The exact-file waiver is accepted
  conditionally on T043; it must not spread to another rule or file.

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
- IF-044-003: the first allowlisted formatter discovery changed exactly 52
  governed manual TS sources. `validate:manual-ticket-placement` failed closed
  with `Protected manual source files changed`; the full Node suite recorded
  462 passed / 38 failed. Updating protected hashes/evidence is forbidden.
- IF-044-004: isolated Docker validation could not start because the local
  Docker daemon stalled indefinitely while loading metadata or explicitly
  pulling uncached `node:22-alpine` and `nginx:1.29-alpine` images. Host `curl`
  reached `registry-1.docker.io/v2/` immediately with the expected HTTP 401,
  so repository behavior was not exercised. Two bounded attempts were
  cancelled; `cabadrive-044-quality` has no containers. T021 remains open for
  Architect/Orchestrator disposition or an environment with working daemon
  registry access; no further retry is justified in this implementation turn.

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
- IF-044-003 — **accepted as bounded current tasks T033–T036; blocking**. The
  formatter must exclude the canonical baseline-derived 52 governed TS paths,
  while lint/typecheck continue to cover them. Because their current dirty
  changes are uncommitted Implementation-owned formatter output and current
  semantic `HEAD` contains no changes to those paths, Implementation may restore
  exactly that computed path set after staged/semantic guards; no other dirty
  path is authorized. Hash/pin/evidence refresh is explicitly rejected.
  Re-run tests after restore, repair only remaining formatting-sensitive source
  assertions in the five named test files without weakening their contracts,
  commit those repairs semantically, then regenerate the entire mechanical diff
  from a clean semantic head. The current 148-file discovery diff is not an
  acceptable partial-staging source for T012.
- IF-044-004 — **accepted as a conditional local-infrastructure fallback task
  T037; blocking until GitHub evidence**. A third unbounded local pull is not
  required and would add no product evidence. The recorded stalls occurred
  before Cabadrive Dockerfile execution, were bounded/cancelled, and left no
  containers, so lack of a local smoke is not itself a product defect. However,
  standalone Node/build/E2E/preflight cannot validate Docker. Closure requires
  the required GitHub `docker-validation` to pass on the exact final current
  PR head with successful build/start/HTTP/teardown steps. Any non-green or
  stale-head result blocks Architect validation and merge.
- Review P2 `PRRT_kwDOSX65IM6R4bjG` — **accepted as bounded current tasks T038
  and T042; blocking**. A normal `finally` does not execute under Node's default
  SIGINT/SIGTERM termination, so cancellation can leave a sentinel that poisons
  the next run. Cleanup must be installed before creation, remove only this
  process's files, preserve signal semantics and be proven for both signals by
  deterministic child-process tests plus an immediate clean rerun.
- Review P2 `PRRT_kwDOSX65IM6R4bjJ` — **accepted as bounded current tasks T039
  and T042; blocking**. Timing from a synthetic Actions merge checkout is not
  traceable to the reviewed source unless the log line names the full event PR
  head. The fix must emit and test an event-safe 40-hex source SHA alongside
  duration/budget; current-head GitHub logs are required evidence.
- Review P2 `PRRT_kwDOSX65IM6R4bjM` — **accepted as bounded current tasks T040
  and T042; blocking**. Parser project configuration without type-information
  rules is not the specified type-aware profile. Root/E2E TypeScript must use
  the compatible type-checked preset and calculated-config tests must prove
  error-level type-aware rules, with only narrow evidence-backed source/rule
  adjustments if real diagnostics appear.
- IF-044-005 / T040 unsafe-family diagnostics — **accepted as a bounded
  exact-file exception plus current verification task T043; later-ticket
  disposition for ТЗ-17**. Fixing the 13 genuine diagnostics is retained.
  Expanding this PR into 267 fixture-typing edits would add high-risk test-data
  refactoring unrelated to the requested gate. The five unsafe-family rules may
  be off only for `tests/e2e/app.spec.ts`, whose JSON inputs are governed by the
  existing content validators run in preflight/CI; typed control-flow rules stay
  errors. T043 must prove every other E2E/root representative retains the five
  rules at error, no inline blanket disable exists, and full lint/E2E pass.
  ТЗ-17 intake must record typing or runtime validation of the legacy JSON
  fixture loader as debt; until T043 passes, this exception remains blocking.
- Review P3 `PRRT_kwDOSX65IM6R4bjP` — **accepted as current contract tasks T041
  and T042; blocking for spec conformance despite advisory severity**. The
  approved allowlist is intentionally exact, so `*.config.ts` is broader than
  authorized. Literal Vite/Playwright paths are required in all scripts and the
  flat profile, with full-list assertions preventing silent future enrollment.
- Review P2 `PRRT_kwDOSX65IM6R44d7` — **accepted as bounded current tasks T044
  and T047; blocking**. Naming only `pull_request.head.sha` does not identify
  the commit actually timed under the default synthetic merge checkout. Keep
  integration checkout semantics and bind the measurement explicitly to
  `git rev-parse HEAD`, while retaining the event source as separate context.
- Review P2 `PRRT_kwDOSX65IM6R5NtC` — **accepted as bounded current tasks T045,
  T047 and T029; blocking**. The finalizer currently hard-codes squash, which
  would make `c359350…` unreachable from `main`. Ignoring the eventual squash
  revision is rejected because it also contains semantic changes. GitHub
  currently reports `mergeCommitAllowed: true`; the bounded solution is an
  opt-in guarded merge method with default squash unchanged, followed by
  post-merge ancestry/blame proof.
- Review P2 `PRRT_kwDOSX65IM6R5f6z` — **current topology claim not reproduced;
  accepted as verification/disposition tasks T046–T047, blocking until fresh
  review**. On 2026-07-17 GitHub reported PR head
  `f3a96b078762ac6f3982f3de749d0a7489566562` and its commit list included
  `c359350358a82d0250934d627c65b5a5a0de6a8a`; local
  `git merge-base --is-ancestor` returned 0. The cited `7fd66ff` was neither
  current head nor listed PR commit. Do not implement a topology rewrite from
  mismatched evidence; re-run the exact guard after T044–T045 and require a
  Review Agent result on that head before Orchestrator disposes the thread.

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
- The first format discovery proved that “all `src`” was not a safe formatter
  scope even though content JSON was excluded: governed TS bytes are themselves
  sealed by manual-ticket-placement. The validator's failure is authoritative;
  regenerating its baseline would erase the protection and is rejected.
- Docker `make build` and direct `docker pull node:22-alpine` both stalled with
  no layer progress in the local daemon although host registry connectivity was
  healthy. The cleanup trap ran after cancellation and the isolated compose
  inventory is empty. This is recorded as IF-044-004, not as a passing T021.

## Verification Evidence

- Architect discovery only: base/worktree/branch confirmed as
  `830a4336e9d5adc1d1c65517e71084b928e0e914`,
  `/Users/chap/devel/cabadrive-worktrees/044-quality-tooling`,
  `codex/044-quality-tooling`; `pnpm install --frozen-lockfile` succeeded without
  lockfile drift; `/usr/bin/time -p pnpm exec tsc --noEmit` passed with
  `real 5.42`. These are not final-head acceptance results.
- Implementation candidate evidence at
  `717dc8682ee40eddc3ba0a0226f551dc84b67d2b`: focused quality tests passed
  `6/6`; the negative type/hook/format contracts passed and removed every
  sentinel; the suppression audit found no `eslint-disable`, `@ts-ignore`, or
  `@ts-expect-error`; positive `quality:fast` passed in `real 14.26` seconds;
  `format:check` passed.
- Fresh formatter evidence: exactly 96 approved code paths changed; none of the
  2,971 protected tracked paths changed. Before/after protected manifest hashes
  both equal `2d13535f60020ea9933212a69295d30b74c1d3ea897be239fe2236f383693caa`;
  first/second format patch hashes both equal
  `7e2137f42ddd51344497f9df4ffb64057e50248f1dcffcf0e5ab48eff80d46a2`.
  Manual-ticket placement and full Node/quality checks passed before commit.
- The only format-only commit is
  `c359350358a82d0250934d627c65b5a5a0de6a8a` (96 approved paths, 24,081
  insertions/9,603 deletions). It exists, is listed exactly in
  `.git-blame-ignore-revs`, and representative `src/App.tsx` blame skips it to
  prior commits `b0b3506c`/`09e29be1`. No amend, rebase, or force-push occurred.
- Full standalone verification passed: attribution; complete content; full
  content-quality gate; Node `501/501`; production build (`1,828` transformed
  modules and `2,156` generated service-worker assets); Playwright `106/106` on
  Chromium/mobile, including the accelerated exam-timeout exactly-once test.
  The known pre-existing large-chunk warning remained non-fatal.
- Feature-043 regressions passed `10/10`; About ran in full E2E on both projects;
  README, licenses, notices, and committed screenshots have no diff from base.
  Full `pnpm run preflight` then passed through all gates and E2E `106/106`.
- T021 is not passed: IF-044-004 records the daemon metadata/pull stall and
  clean isolated compose inventory. Architect accepted conditional fallback
  task T037; exact-head GitHub Docker evidence remains mandatory.
- T023 publication evidence: all implementation and role-owned disposition
  commits were pushed to `origin/codex/044-quality-tooling`; ready PR #209 was
  opened from the assigned branch to `main`. Pre-push guards confirmed a clean
  worktree, merge base
  `830a4336e9d5adc1d1c65517e71084b928e0e914`, `git diff --check`, complete
  feature memory, 8 scoped commits and 113 changed paths before this
  publication-evidence-only update. Implementation Agent did not merge.
- Review Agent inspected exact PR #209 head
  `93897984738a2cb6941f793f81699e61267840ab` and opened four unresolved,
  non-outdated threads: P2 `PRRT_kwDOSX65IM6R4bjG`,
  `PRRT_kwDOSX65IM6R4bjJ`, `PRRT_kwDOSX65IM6R4bjM` and P3
  `PRRT_kwDOSX65IM6R4bjP`. Architect accepted them as T038–T042; no thread is
  considered resolved until new-head implementation evidence, fresh
  thread-aware review and Orchestrator disposition.
- T038–T041 implementation at semantic head
  `370ffce48948e152199d07371b8647b2a9e79274`: deterministic subprocess tests
  observed exact `SIGINT` and `SIGTERM` termination after the readiness marker,
  verified all three sentinels absent and immediately reran the normal helper
  successfully after each signal. A separate stale-sentinel regression proved
  refusal preserves the pre-existing file byte-for-byte. Focused quality tests
  passed `8/8`; normal negative contracts passed with no remaining sentinel.
- The CI timing contract now validates and prints the event-safe full source SHA
  from `github.event.pull_request.head.sha || github.sha` in the same line as
  elapsed seconds and the 60-second budget. Exact workflow-source assertions
  reject missing validation, missing source binding and synthetic-merge-only
  evidence; exact-head GitHub log evidence remains part of T042/T026.
- Root/E2E TypeScript uses `recommendedTypeChecked` and calculated configs for
  both `tests/e2e/app.spec.ts` and `vite.config.ts` prove error-level
  `@typescript-eslint/await-thenable` and `no-floating-promises`. Discovery
  produced 280 findings: 13 concrete unnecessary assertion/async/await/unbound
  issues were fixed directly; the remaining 267 unsafe-family findings derive
  from runtime-loaded `JSON.parse` fixtures and are scoped off only for the
  legacy `tests/e2e/app.spec.ts`, while type-aware control-flow rules stay on.
- Lint/format/check and flat-config targets now literally name only
  `vite.config.ts` and `playwright.config.ts`; full-string tests reject root
  `*.config.ts` drift. Positive typecheck/lint/format passed; current
  `quality:fast` passed in `real 15.20` seconds; suppression and sentinel audits
  were empty. Full Node passed `502/502`, build generated `2,156` service-worker
  assets, E2E passed `106/106`, and full preflight passed through E2E `106/106`.
- The 2,971-path protected SHA-256 manifest remains byte-identical to the
  original pre-format manifest; format-only commit
  `c359350358a82d0250934d627c65b5a5a0de6a8a` still exists, contains exactly 96
  paths and remains the sole `.git-blame-ignore-revs` entry. T042 remains open
  only for push/new-head GitHub timing and fresh thread-aware Review Agent work.
- T043 evidence at semantic head
  `2311725724cfffa8c49ecea52c12bba8457116ad`: calculated config proves the
  five disposed unsafe-family rules are off only for
  `tests/e2e/app.spec.ts`; all five remain error-level for
  `tests/e2e/manual-ticket-placement.spec.ts`, `vite.config.ts` and
  `playwright.config.ts`. `await-thenable` and `no-floating-promises` remain
  errors for all four representatives. The focused calculated-config test
  passed, its source audit found no inline/file ESLint disable in E2E or either
  root config, full lint passed and full build/E2E passed `106/106`. The exact
  waiver was not broadened and JSON fixture typing/runtime validation remains
  Architect-disposed later debt for ТЗ-17 intake.
- Review/current-head evidence: pending T024–T026.
- Final role/current-head guard evidence: pending T027–T029.

## Cycle PR Set

| Purpose | Branch | PR | Base | Current head | Status | Included in final validation |
|---|---|---|---|---|---|---|
| ТЗ-16 tooling, mechanical migration, docs and feature memory | `codex/044-quality-tooling` | [#209](https://github.com/cucumberfalse/cabadrive/pull/209) ready | `830a4336e9d5adc1d1c65517e71084b928e0e914` | `637ef7680994bccc49988410c82e6fb1d9591f4d` before publication-evidence-only update | Implementation verified/published; T037 exact-head GitHub Docker evidence pending | Yes |

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
