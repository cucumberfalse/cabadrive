# Specification: Typecheck, ESLint и Prettier как обязательные quality gates

## Goal

Реализовать P0 ТЗ-16 как фундаментальный quality-tooling slice: strict TypeScript,
ESLint 9 и Prettier должны обнаруживать дефекты до дорогих build/E2E шагов,
оставаться воспроизводимыми через pinned lockfile и не менять governed content,
лицензионные материалы, generated evidence или Docker-only runtime contract.

Цикл стартует из verified `origin/main`
`830a4336e9d5adc1d1c65517e71084b928e0e914` в Analyst-created worktree
`/Users/chap/devel/cabadrive-worktrees/044-quality-tooling`, branch
`codex/044-quality-tooling`. Параллельные агенты и ветки возможны; sibling state,
dirty diffs, commits, PR и process memory нельзя переписывать, rebase/merge/delete
без отдельной Orchestrator coordination.

## Current Baseline

- `tsconfig.json` уже задаёт `strict: true`, `noEmit: true`,
  `moduleResolution: "Bundler"` и `include: ["src"]`, но `package.json` и CI не
  вызывают typecheck.
- На base нет ESLint/Prettier dependencies, flat config, Prettier config/ignore
  и `.git-blame-ignore-revs`.
- `baseline-checks` выполняет `check:repo → unit → build → e2e`; required job
  identity `baseline-checks` должна сохраниться.
- Реальный inventory на base: `src/App.tsx` — 4172 строки, `src/` — 67 файлов,
  `scripts/` — 52 файла, top-level `tests/` — 32 `.mjs` файла плюс E2E.
- После `pnpm install --frozen-lockfile` read-only Architect baseline
  `pnpm exec tsc --noEmit` прошёл за 5.42 s wall time. Это discovery evidence,
  а не final acceptance evidence.
- Source-shape tests читают и сопоставляют форматируемые файлы, в частности
  `tests/content-manual-guide-chapters.test.mjs`,
  `tests/manual-ticket-placement.test.mjs`,
  `tests/content-manual-vehiculo-4ruedas.test.mjs`, `tests/domain.test.mjs`,
  `tests/primary-source-status.test.mjs`,
  `tests/primary-sources-runtime-loader.test.mjs`,
  `tests/content-validation.test.mjs` и screenshot/workflow tests. Их смысл
  нельзя удалять или ослаблять для прохождения format migration.

## Scope

### In scope

- Exact-pinned compatible development dependencies for ESLint 9,
  `typescript-eslint`, React hooks/refresh rules, Node globals and Prettier,
  plus deterministic `pnpm-lock.yaml` update.
- `typecheck`, `lint`, `format`, `format:check`, combined fast-gate and safe
  negative-verification scripts in `package.json`.
- ESLint 9 flat config with type-aware TS/React profiles and a separate Node
  `.mjs` profile; explicit policy for tests and root TypeScript configs.
- Prettier default behavior with `printWidth: 100`, allowlisted write/check
  paths and defense-in-depth exclusions for governed/non-code artifacts.
- Minimal, behavior-preserving type/lint fixes; test-first configuration and
  failure-contract guards; format-tolerant repairs for source-shape tests where
  needed without reducing their semantic assertions.
- One reviewable mechanical format-only commit, later recorded by exact SHA in
  `.git-blame-ignore-revs`, with no history rewrite.
- Fast-fail CI/preflight order, 60-second GitHub-runner budget evidence,
  contributor/agent documentation, full regression verification and process
  memory.

### Out of scope

- App decomposition, timer/session changes, component-test framework, router,
  UI redesign, content splitting or other improvements ТЗ-04/11/17/18.
- General CI deduplication or removal of repeated content/build/E2E checks.
- Formatting or autofixing `content/**`, `public/content/**`, official archives,
  canonical/generated JSON/evidence, images/screenshots, root `LICENSE` or
  `NOTICE`, `licenses/**`, docs, specs, vendored/source snapshots or PWA output.
- Lowering TypeScript strictness, disabling requested lint rules globally,
  converting errors to warnings, blanket suppressions, mass semantic refactors,
  force-push/rebase/history rewriting or mutation of sibling work.
- Changing Docker/nginx/service-worker behavior, About/version/license/source
  claims or the current `unofficial_b_fallback` product contract.

## Dependency And Script Contract

- Add exact versions (no `latest`, `*` or caret ranges) for `eslint` major 9,
  `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks`,
  `eslint-plugin-react-refresh`, `globals` and `prettier`. Implementation must
  resolve a mutually compatible set from primary package metadata, verify peer
  dependencies, and commit the resulting lockfile. Do not upgrade unrelated
  runtime dependencies.
- `pnpm install --frozen-lockfile` must succeed after the lockfile is committed;
  `osv-scan` and ordinary dependency review remain required.
- Required public scripts:
  - `typecheck`: actual `tsc --noEmit` using the existing `tsconfig.json`;
  - `lint`: ESLint over the exact allowlist below, with zero warnings accepted
    (`--max-warnings 0`);
  - `format` / `format:check`: the same exact Prettier allowlist, using
    `--write` / `--check` respectively; neither command may target `.`;
  - `quality:fast`: `typecheck` followed by `lint` with fail-fast semantics;
  - a dedicated negative-contract command that safely proves typecheck, lint
    and formatting failures and always removes temporary files in `finally`.
- `preflight` retains feature-memory, repository, content/attribution, unit,
  build and E2E coverage and inserts quality gates before unit/build/E2E.

## TypeScript Contract

- The committed positive gate is `tsc --noEmit`; existing `strict`, `noEmit`,
  `allowJs: false`, `moduleResolution: Bundler` and complete `src` include must
  not be weakened or narrowed.
- A separate `tsconfig.eslint.json` may extend the compiler config to give
  typed linting a project that includes `src/**/*.{ts,tsx}` plus
  `vite.config.ts`, `playwright.config.ts` and `tests/e2e/**/*.ts`. It is a lint
  project only and must not silently replace or narrow production typecheck.
- Negative verification creates a uniquely named temporary `.ts` sentinel
  inside `src/`, containing an unmistakable type error, invokes the real
  `pnpm run typecheck`, requires nonzero exit and the sentinel diagnostic, and
  removes the file on success, failure and signal paths. Final status proves no
  sentinel remains and the positive typecheck passes.
- Signal cleanup is an executable contract, not an implication of `finally`.
  Register `SIGINT` and `SIGTERM` handlers before the first sentinel can be
  created, track only files created by this process, remove them synchronously,
  detach the active handler and preserve normal terminating-signal semantics
  rather than converting cancellation into success. Subprocess regressions must
  wait for a deterministic post-creation readiness marker, send each signal,
  assert the child terminated by/with the conventional status for that signal,
  assert every sentinel is absent, and immediately run the helper successfully
  again to prove cancellation cannot poison the next run.
- Any discovered type defect receives a minimal tested fix. `strict: false`,
  exclusion globs, `@ts-ignore` and unexplained `@ts-expect-error` are forbidden.
  A truly unavoidable narrow `@ts-expect-error` requires an adjacent reason and
  explicit Architect disposition/follow-up before acceptance.

## ESLint Contract

`eslint.config.mjs` must use flat config and explicit file profiles:

1. `src/**/*.{ts,tsx}`: `typescript-eslint` type-aware recommended rules using
   the lint project/service; browser globals; exactly the current-scope React
   hooks rules `react-hooks/rules-of-hooks` and
   `react-hooks/exhaustive-deps` as errors; and
   `react-refresh/only-export-components` as an error with only a narrowly
   justified option such as `allowConstantExport` if current Vite module
   boundaries require it. Do not spread the plugin's evolving broad
   `recommended` preset: its compiler-oriented rules such as
   `set-state-in-effect` and `immutability` are not requested by ТЗ-16 and can
   force the ТЗ-04/11 refactors explicitly excluded from this cycle.
2. `scripts/**/*.mjs`, `tests/**/*.mjs` and `eslint.config.mjs`: ESLint JS
   recommended rules with Node globals and no TS-only rules. This deliberately
   covers all current Node validators, workflow helpers and Node tests rather
   than only the older `scripts/*.mjs` estimate.
3. `vite.config.ts`, `playwright.config.ts` and `tests/e2e/**/*.ts`: type-aware
   TypeScript Node/Playwright profile using `tsconfig.eslint.json` and the
   `typescript-eslint` type-checked recommended preset, not the syntax-only
   `recommended` preset. React hooks and refresh rules do not apply here.
   Calculated-config tests must prove at least one genuinely type-aware rule,
   including `@typescript-eslint/await-thenable` or
   `@typescript-eslint/no-floating-promises`, is error-level for both an E2E
   file and `vite.config.ts`; parser/project presence alone is insufficient.

One bounded legacy-fixture exception is permitted for exactly
`tests/e2e/app.spec.ts`: its eleven top-level/runtime `JSON.parse` fixture
boundaries expose governed external JSON as `any`, producing 267 propagated
diagnostics after 13 genuine typed/control-flow findings were fixed. Only
`no-unsafe-argument`, `no-unsafe-assignment`, `no-unsafe-call`,
`no-unsafe-member-access` and `no-unsafe-return` may be disabled in an exact-file
flat-config block with an adjacent reason. `await-thenable`,
`no-floating-promises` and every other type-checked rule remain error-level.
Calculated-config tests must prove the five-rule exception applies to that file
only and remains error-level for `tests/e2e/manual-ticket-placement.spec.ts`,
`vite.config.ts` and `playwright.config.ts`. No inline/file comment disable is
accepted. Replacing runtime JSON fixtures with typed/validated fixture loaders
is later testing debt for ТЗ-17 intake, not a 267-edit expansion of ТЗ-16.

The config must globally ignore at least `node_modules/**`, `dist/**`,
`coverage/**`, `content/**`, `public/**`, `docs/**`, `docs_project/**`,
`specs/**`, `licenses/**`, root license/notice text and binary/image artifacts.
The `lint` CLI allowlist is the primary boundary; ignores are defense in depth.

Automated config inspection must run ESLint `--print-config` (or equivalent
flat-config API) for representative files: `src/App.tsx`, `src/domain.ts`,
`scripts/shared.mjs`, one Node test, `tests/e2e/app.spec.ts`, `vite.config.ts`.
It must prove the correct parser/profile and requested rules are enabled at
error severity, and prove governed paths are not lint targets. A temporary TSX
fixture with an invalid conditional hook must fail with the expected hooks rule.

No other file-wide/blanket disable, unexplained suppression or warning downgrade
is accepted; the exact E2E unsafe-family waiver above is the sole Architect-
disposed exception. Hook dependency fixes are behavioral changes: they require
focused tests and a semantic commit, or an Architect-routed narrow disposition;
they must never be hidden in the format-only revision.

The two current exhaustive-deps findings have bounded required resolutions:

- Learning timer effects must derive and capture the stable scalar
  `questionId = question?.id` and use that scalar both inside each effect and in
  its dependency list. Adding the whole `question` object is forbidden because
  object identity could restart timer initialization/interval behavior.
- Exam timeout completion must make `finish` referentially stable across
  `timeRemaining` renders, for example with `useCallback` and a complete narrow
  dependency list, then list that stable callback in the timer effect. It must
  preserve the current lifecycle: answer changes may replace the interval as
  they already do, ordinary one-second countdown renders may not, timeout must
  finish exactly once, and manual last-answer completion remains unchanged.

Neither item may be suppressed. The existing learning timer E2E must remain
green, and a focused fake-clock/accelerated exam-timeout regression must prove
one timeout completion, one persisted attempt and no duplicate finish effect.

## Prettier And Protected-Bytes Contract

- Use a repository Prettier config whose only intentional style override is
  `printWidth: 100`; other behavior remains the pinned Prettier default.
- The nominal write/check allowlist is:
  - `src/**/*.{ts,tsx,css}`;
  - `scripts/**/*.mjs`;
  - `tests/**/*.mjs` and `tests/e2e/**/*.ts`;
  - `vite.config.ts`, `playwright.config.ts`, `eslint.config.mjs`.
- Package lint/format/check scripts and the ESLint root/E2E profile must name
  `vite.config.ts` and `playwright.config.ts` literally. Root `*.config.ts` is
  forbidden because it silently enrolls future files. The quality test compares
  the complete tokenized/equivalent expected target list, not merely absence of
  repository `.`.
- Its effective source scope is that nominal allowlist minus every governed TS
  path in the committed
  `content/manual-ticket-placement/manual-content-baseline.json`
  `protectedSources` array. On the current baseline this means all 50
  `src/data/manual-sections/*.ts` files plus `src/data/manualGuide.ts` and
  `src/data/pandemiaVialSection.ts`. `.prettierignore` must therefore include
  `src/data/manual-sections/**` and the two exact runtime paths. Lint and
  typecheck still cover them; only formatter write/check excludes their bytes.
- The protected list is not copied manually into test code. A quality-tooling
  test reads the committed baseline, selects every `.ts` entry, independently
  compares it with the tracked `src/data/manual-sections/*.ts` inventory plus
  the two exact runtime files, and invokes Prettier `--file-info` with the
  repository ignore file for every resulting path. Every record must report
  ignored. The existing manual-ticket-placement validator remains the
  fail-closed authority for a new/missing governed source and its exact hash.
- Do not add root Markdown/JSON/YAML, `content`, `public`, docs, specs, license
  files, images or generated build output to the formatter command. A
  `.prettierignore` repeats those exclusions explicitly, including
  `content/**`, `public/**`, `dist/**`, `docs/**`, `docs_project/**`,
  `specs/**`, `licenses/**`, `LICENSE`, `NOTICE`, `pnpm-lock.yaml`, images and
  archives.
- Automated tests inspect both package command arguments and ignores and fail
  if the formatter broadens to `.` or a protected path. A temporary malformed
  file inside an allowed code path must make `--check` fail, then pass after
  `--write`, and be removed in `finally`.
- Before and after the one-time `pnpm run format`, capture a deterministic hash
  manifest of tracked files selected by
  `git ls-files -- content public/content LICENSE NOTICE licenses docs_project/screens/readme`
  plus every governed TS path selected from the manual-content baseline.
  Manifests must be identical. Also record `git status --short` and
  `git diff --name-status` proving formatter changes only the allowlist; never
  refresh content hashes/evidence to conceal an accidental byte change.
- Run the formatter twice: the second run must create no diff, and
  `format:check` must pass.

## Migration And Git History Contract

Use one PR because the configuration, migration and CI gates must land
atomically; splitting would leave either unenforced configuration or a format
diff with no gate. Preserve reviewability through commit topology:

1. **Tooling/semantic commit(s):** failing-first quality contract tests,
   dependencies/config/scripts/CI/docs, minimal type/lint fixes and any
   formatting-tolerant source-test repairs. Behavioral fixes and suppressions
   belong here with focused evidence.
2. **One format-only commit:** run only the approved formatter write command;
   its diff may contain only mechanical changes in the allowlist. No config,
   docs, test-contract rewrite, semantic fix, generated file or process-memory
   change may be mixed into this revision.
3. **Post-format metadata/evidence commit:** after the format commit SHA exists,
   add that exact full SHA to `.git-blame-ignore-revs` with a short comment and
   document `git blame --ignore-revs-file .git-blame-ignore-revs`. Verify the
   referenced commit exists and its diff is format-only. Do not amend/rebase the
   format commit afterward; if its SHA changes before publication, update the
   metadata through a normal later commit and reverify.

Any source-regex repair discovered only after formatting must be a separate
non-ignored commit, keep the original tested contract, and receive full unit
regression; it cannot be folded into the ignored format revision.

The first formatter discovery run is explicitly rejected as a candidate
format-only revision because it changed governed manual TS and produced
`Protected manual source files changed` with 462/500 Node tests passing. Since
those changes remain uncommitted and are known to be Implementation-owned
formatter output, Implementation may restore only the 52 newly excluded TS
paths from current semantic `HEAD`, after proving no staged or pre-format
semantic hunk exists in them. No other dirty file may be restored. Pins,
baseline and generated evidence must remain byte-identical.

After that targeted restore, rerun the full Node suite before changing tests.
Failures that disappear were governance/hash checks and require no test edit.
Only remaining whitespace-sensitive assertions in
`tests/ai-review-workflow.test.mjs`,
`tests/content-manual-guide-chapters.test.mjs`,
`tests/content-manual-vehiculo-4ruedas.test.mjs`,
`tests/content-pandemia-vial-section.test.mjs` and
`tests/manual-ticket-placement.test.mjs` may receive a semantic pre-format
repair. Repairs must use whitespace-tolerant matching, stable semantic
boundaries or an existing balanced-source helper while retaining the same
symbols, JSX props/order, safety condition and negative assertions. Do not
modify protected-source fingerprints, expected hashes, registry facts or
fail-closed validator expectations.

A fresh formatter run is mandatory from a clean semantic head after those test
repairs and protected-ignore tests are committed. The rejected 148-file dirty
discovery diff cannot become T012 by partial staging. Recreate the mechanical
diff with the corrected effective scope, rerun it twice for idempotence, pass
manual-ticket placement/full Node validation, and only then create the single
new format-only commit referenced by `.git-blame-ignore-revs`.

## CI, Timing And Runtime Contract

- Keep the required job name `baseline-checks`. After setup/install and the
  repository baseline, its observable gate order is:
  `typecheck → lint → format:check → quality negative contract → unit → build → e2e`.
- The typecheck+lint CI step measures elapsed wall time around `quality:fast`,
  prints the seconds and full source head SHA, and exits nonzero above 60
  seconds. For pull requests the source identity is
  `github.event.pull_request.head.sha`; push/workflow fallback is `github.sha`.
  The emitted value must be validated/printed as the full 40-hex SHA in the
  timing line so a synthetic Actions merge checkout cannot be mistaken for the
  reviewed PR source head. Workflow tests assert the event-safe expression and
  log binding.
  The budget applies to those two commands on GitHub `ubuntu-latest`, not
  install or full preflight. A local result alone cannot satisfy NFR-1.
- `preflight` preserves `check:feature-memory --worktree`, `check:repo`,
  `validate:content` (therefore attribution), and then runs the equivalent
  positive/negative quality gates before unit/build/E2E. Do not implement ТЗ-18
  deduplication in this cycle.
- Keep `docker-validation`, `guard`, `AI Review` and `osv-scan` identities and
  behavior. End users still need only `make build`, `make up`, `make down`;
  host Node/pnpm remains developer/CI tooling.
- A local Docker smoke may use an infrastructure fallback only when repeated
  bounded attempts cannot fetch uncached base-image metadata/layers and leave
  no project containers. The fallback is evidence, not a local pass: record the
  exact compose project/port, commands, timestamps/durations, last pull stage,
  cancellation, registry reachability check and empty `docker compose ps -a`.
  It becomes acceptance-equivalent only after the required GitHub
  `docker-validation` succeeds on the exact final current PR head, including
  image build, app start, HTTP `/` and `/sw.js` smoke, and always-run teardown.
  Missing, queued, stale-head, cancelled or failed GitHub Docker validation is a
  blocker; local standalone build/E2E success cannot replace it.

## Acceptance Criteria

1. Frozen install succeeds with exact compatible ESLint 9/type-aware React/
   Node/Prettier dependencies and no unrelated runtime upgrade.
2. Positive `typecheck`, `lint`, `format:check` pass; negative sentinel checks
   fail for intentional type, hooks and formatting defects and leave no files.
3. Typecheck keeps the full strict `src` contract. ESLint config inspection
   proves each representative path receives its intended profile/rules and
   protected paths are outside the CLI/config target.
4. No blanket disable, unexplained suppression, warning downgrade or hidden
   hook behavior change is present; every exceptional narrow suppression has a
   recorded Architect disposition.
5. Prettier uses `printWidth: 100`, is idempotent, and changes only the explicit
   effective code allowlist. All 52 governed manual TS sources are ignored via
   the canonical baseline-derived guard; protected-file hash manifests match
   exactly before/after and manual-ticket placement validation passes.
6. One exact format-only SHA is present in `.git-blame-ignore-revs`; inspection
   proves the ignored revision contains no semantic/config/test-contract/docs/
   process change and no history rewrite was used.
7. CI and preflight preserve required validation while enforcing fast-fail
   ordering. Current-head GitHub timing proves combined typecheck+lint ≤60 s.
8. Full unit/build/offline/service-worker/E2E/preflight pass. Isolated local
   Docker smoke passes, or its documented external-fetch fallback is paired
   with successful required `docker-validation` on the exact final current PR
   head. Feature 043 license/attribution/About/README screenshot tests and
   capture/build contracts remain green with the same public meaning.
9. Contributor/agent docs name the new commands, safe formatter scope,
   ignore-revs use and pre-push expectation without changing Docker quick start.
10. Final diff contains only ТЗ-16 and current feature memory. Decisions, dead
    ends, known issues, exact evidence, cycle PR set and every Implementation
    feedback/disposition are current; Review Agent has no blocking findings.
11. Final Architect validation passes before final Analyst validation for one
    effective content head; a later evidence-only commit is proven by the
    Orchestrator current-head guard before finalization/merge.

## Negative Scenarios

- Vite build passes while real `pnpm run typecheck` is absent, narrowed or does
  not reject a temporary source error.
- ESLint is installed but `App.tsx`, hooks, Node scripts/tests or root tooling
  receive no intended profile; requested errors are warnings/off; broad ignores
  or disables manufacture a green run.
- `pnpm run format` targets `.`, Markdown/JSON/content/licenses/screenshots,
  or an accidental protected-byte change is hidden by regenerated hashes.
- Semantic/type/hook/test-contract changes are included in the ignored
  format-only commit, or `.git-blame-ignore-revs` contains a placeholder,
  nonexistent or later-amended SHA.
- Source-shape tests are deleted/weakened because whitespace changed, or hook
  arrays are auto-fixed without behavioral evidence.
- CI quality gates run after unit/build/E2E, combined CI timing exceeds 60 s,
  or a required job is renamed/removed.
- Existing attribution/content/build/E2E checks are removed as premature
  ТЗ-18 optimization; Docker runtime starts requiring host pnpm.
- License/NOTICE/About/version/repository attribution, screenshots or capture
  recovery behavior from feature 043 changes meaning under a “mechanical” diff.

## Required Evidence

Every recorded command must name outcome and full checked SHA. Evidence includes:

- base/current branch, worktree, verified base and clean-scope guard;
- frozen install, exact package versions and peer-dependency/lockfile check;
- initial positive baselines and failing-first quality configuration tests;
- positive and negative type/lint/format outputs with temporary-file cleanup;
- ESLint `--print-config` representative-path evidence and suppression audit;
- protected-file pre/post hash manifests, allowlist-only name-status diff,
  formatter idempotence and exact format-only commit inspection;
- `.git-blame-ignore-revs` SHA existence/content proof and blame command check;
- exact CI/preflight order test and GitHub runner ≤60 s timing on current head;
- `validate:attribution`, `validate:content`, full unit, build, E2E, preflight,
  service-worker/offline and isolated Docker results; if local Docker is
  infrastructure-blocked, two bounded-attempt records, empty-project cleanup
  evidence and exact-current-head GitHub `docker-validation` success;
- focused feature-043 license/About/screenshot/capture regressions;
- dependency security result, `git diff --check`, final scope diff, Review Agent
  thread-aware result, required checks/thread/conflict state;
- cycle PR set, feedback dispositions, final role-validation markers and the
  effective-content-head/current-head read-only guard.
