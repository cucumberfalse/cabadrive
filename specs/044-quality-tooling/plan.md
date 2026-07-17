# Implementation Plan: Typecheck, ESLint и Prettier quality gates

## Delivery Shape

Использовать Analyst-created latest-main context как один implementation branch
и один PR. Конфигурация, механическая migration и обязательные gates должны
попасть в `main` атомарно. Reviewability обеспечивается отдельными commits, а не
временными PR с незавершённым quality contract. Дополнительный slice допустим
только если Orchestrator обнаружит реальный parallel-conflict/blocker; тогда он
требует нового latest-main worktree и добавления всех slices в cycle PR set.

Runtime abstraction не добавляется. Один узкий negative-verification helper
оправдан повторяемым доказательством failure behavior и cleanup; ESLint lint
project оправдан необходимостью type-aware coverage root/E2E TypeScript без
изменения production `tsc --noEmit` scope.

## Implementation Sequence

1. **Confirm context and establish reproducible baseline**
   - Confirm exact branch/worktree/base and preserve untracked
     `feature-request.md` plus sibling work.
   - Run `pnpm install --frozen-lockfile`, current `pnpm exec tsc --noEmit`,
     existing focused/full tests as proportionate, and inventory actual source,
     Node tooling, tests and source-shape assertions.
   - Record baseline outputs/timing; classify later findings as type/lint defect,
     format-only change, source-test compatibility or out-of-scope debt.

2. **Write failing contract tests first**
   - Add a focused `tests/quality-tooling.test.mjs` (or equivalently narrow
     tests) that initially fails because scripts/config/dependencies/CI order,
     exact scopes, ignores and requested rule profiles do not exist.
   - Test required job identity, typecheck→lint→format→unit→build→E2E ordering,
     60-second CI budget code, preflight placement and preservation of content/
     attribution gates.
   - Test allowlists/protected exclusions and representative ESLint config;
     record expected failures before implementation.

3. **Pin dependencies and establish positive gates**
   - Select mutually compatible exact versions from official package peer
     metadata: ESLint major 9, `@eslint/js`, `typescript-eslint`, hooks/refresh,
     `globals`, Prettier. Update only devDependencies and lockfile.
   - Add package scripts and `tsconfig.eslint.json`; create flat config with the
     three exact profiles from the specification.
   - Configure only error-level `react-hooks/rules-of-hooks` and
     `react-hooks/exhaustive-deps` for current hooks coverage; do not inherit the
     plugin's broader compiler-oriented recommended preset.
   - Add Prettier config and ignore. Keep formatter CLI allowlisted rather than
     repository-wide.
   - Run positive typecheck/lint/config inspection; fix real defects minimally.
     Do not auto-apply hook dependency changes without focused behavior tests.

4. **Resolve the two bounded timer dependency findings**
   - In learning mode, replace effect access to the `question` object with one
     stable scalar `questionId` used in state keys and dependency arrays. Do not
     add the object itself as a dependency or change timer state transitions.
   - In exam mode, make `finish` stable across countdown-only renders with
     `useCallback` (or an equivalently narrow stable callback), include every
     actual closure dependency, and include the callback in the interval effect.
     Preserve the existing answer-change interval lifecycle and exactly-once
     completion guard.
   - Run the existing pause/resume/switch/answered-ticket learning-timer E2E and
     add an accelerated/fake-clock exam-timeout regression proving exactly one
     persisted attempt and no duplicate finish. Commit these semantic changes
     outside the format-only revision; use no lint suppression.

5. **Implement repeatable negative contracts**
   - Add one narrow Node helper which creates unique temporary type, TSX hooks
     and malformed-format sentinels only in approved code paths.
   - Prove the real typecheck rejects the type sentinel, ESLint reports the
     expected hooks rule, Prettier check rejects malformed code and passes after
     write. Always remove sentinels in `finally`; assert cleanup and rerun
     positive gates.
   - Cover early subprocess failure and cleanup behavior in focused tests; do
     not leave intentionally invalid committed source or permanently exclude a
     fixture from the real gate.

6. **Repair format-sensitive tests before migration**
   - Treat the first 148-file formatter run as rejected discovery: it changed
     52 governed manual TS paths and cannot be partially staged as the
     format-only commit.
   - Read the exact governed TS inventory from the committed manual-content
     baseline, cross-check it against tracked manual-section files plus
     `manualGuide.ts`/`pandemiaVialSection.ts`, and add the directory/two exact
     paths to Prettier ignores. Automated `--file-info` checks must prove every
     baseline TS entry is ignored; do not update the baseline or hashes.
   - After verifying the excluded paths contain only this agent's uncommitted
     formatter output and no staged/pre-format semantic hunk, restore exactly
     those paths from current semantic `HEAD`. Preserve every other dirty path.
   - Rerun the full Node suite before editing tests. Classify failures that
     vanish as protected-byte failures requiring no test change. Repair only
     remaining source-regex assertions in the five named test files.
   - Make only the minimal format-tolerant change that preserves each semantic
     assertion. Prefer parsing/balanced-source helpers or whitespace-tolerant
     regex over deleting assertions or matching weaker facts.
   - Commit these test-contract repairs and any semantic lint/type fixes outside
     the later ignored revision, with focused tests.

7. **Create the protected format-only revision**
   - Start only from the clean semantic head after the protected exclusions and
     source-test repairs are committed. Do not reuse or partially stage the
     rejected discovery diff.
   - Capture tracked protected-file SHA-256 manifest, including every baseline
     governed TS source, and pre-format status.
   - Run the exact `pnpm run format` allowlist once, inspect every changed path,
     and reject/revert only formatter-caused protected changes without touching
     sibling/user work. Run it again and require zero additional diff.
   - Run positive quality/unit regressions; commit only mechanical formatter
     output as one format-only commit. No config/docs/test-contract/process
     change may be staged in it. Report full SHA to Orchestrator.

8. **Record blame metadata without rewriting history**
   - In a later commit, add the exact full format-only SHA to
     `.git-blame-ignore-revs` and document the ignore-revs command.
   - Verify `git cat-file -e <sha>^{commit}`, inspect its path/name-status and
     patch for semantic content, and run a representative blame command.
   - Never amend/rebase the format commit after recording it. If coordination
     changes its SHA, update metadata normally and repeat verification.

9. **Wire fast-fail CI and local preflight**
   - Preserve `baseline-checks`; after baseline/install, time `quality:fast`,
     fail above 60 seconds, then run format check, negative contract, unit,
     build, browser install and E2E in that order.
   - Insert equivalent quality gates in preflight before unit/build/E2E while
     retaining feature-memory/repository/content/attribution validation.
   - Do not deduplicate nested build/content runs or rename required jobs.

10. **Update durable contributor/agent documentation**
   - Update `CONTRIBUTING.md`, `CLAUDE.md`, `AGENTS.md` and relevant
     `docs_project` developer command sections only as needed: required commands,
     safe formatter allowlist, pre-push preflight and ignore-revs use.
   - Keep README Docker user quick start, About/license claims, content status
     and all product flows unchanged.

11. **Full verification and publication handoff**
    - Run the verification matrix on the candidate head, including feature-043
      regressions and isolated Docker smoke. Record outputs, exact full SHA,
      protected hashes, timing and known warnings in `tasks.md`.
    - Update decisions/dead ends/known issues and append every Implementation
      feedback item. Commit/push/open one ready PR only under Orchestrator
      assignment; Implementation Agent never merges.

12. **Review, feedback and final validation**
    - Review Agent performs thread-aware review of config coverage, suppressions,
      protected bytes, format-only SHA, hidden semantics, source-test strength,
      CI timing/order, feature-043/Docker regressions and role/process memory.
    - Orchestrator routes each finding/Implementation feedback to Architect for
      task/ticket/not-needed disposition. Fixes return to Implementation and
      fresh review/checks.
    - Architect final validation covers the complete cycle PR set/effective
      content head first; Analyst final validation follows only after passing
      Architect evidence. Orchestrator then performs the current-head guard and
      finalizes only when all merge gates pass.

13. **Bounded PR #209 review fixes**
    - For `PRRT_kwDOSX65IM6R4bjG`, add pre-creation SIGINT/SIGTERM cleanup with
      preserved signal semantics and deterministic child-process interruption
      tests for both signals, sentinel absence and immediate successful rerun.
    - For `PRRT_kwDOSX65IM6R4bjJ`, bind the CI timing line to the event-safe full
      PR source head (`pull_request.head.sha`, otherwise `github.sha`) and test
      both the expression and emitted duration/budget/head line.
    - For `PRRT_kwDOSX65IM6R4bjM`, apply the type-checked TS preset to root/E2E
      files. Resolve any real findings narrowly; prove calculated configs enable
      error-level type-information rules for E2E and Vite representatives.
    - For `PRRT_kwDOSX65IM6R4bjP`, replace every root `*.config.ts` target with
      the literal Vite and Playwright paths in scripts and flat config, then
      assert the complete exact target lists.
    - Run focused quality/negative/config/workflow tests, positive quality gates,
      full Node/preflight as affected, suppression/scope guards and
      `git diff --check`. Commit/push through Implementation Agent, obtain fresh
      thread-aware Review Agent review on the new exact head, and leave thread
      resolution/check coordination to Orchestrator.

## Verification Matrix

| Boundary | Command/evidence | Pass condition |
|---|---|---|
| Frozen toolchain | `pnpm install --frozen-lockfile`; package/peer inspection | Exact compatible versions; no lock drift or unrelated runtime upgrade |
| Type positive | `pnpm run typecheck` | Strict/noEmit full `src` scope passes |
| Lint positive | `pnpm run lint` | Intended TS/React, Node and tooling paths pass with zero warnings |
| Format positive | `pnpm run format:check` | Exact allowlist conforms to pinned Prettier, `printWidth: 100` |
| Negative contracts | dedicated `pnpm run verify:quality-negative` | Intentional type/hooks/format defects fail for expected reasons; sentinels removed; positives pass afterward |
| Config/scope tests | `node --test tests/quality-tooling.test.mjs` | Scripts, exact globs, rule severity, ignores, CI/preflight ordering and budget are fail-closed |
| Protected bytes | SHA-256 manifests before/after `pnpm run format`; `git diff --name-status` | Governed content/license/screenshots byte-identical; only allowlisted code changed |
| Governed manual TS | baseline inventory cross-check; Prettier `--file-info` for all 52 TS records; `pnpm run validate:manual-ticket-placement` | Inventory complete, every path ignored, baseline hashes current |
| Idempotence | second `pnpm run format`; `git diff` comparison | No second-run changes; check passes |
| Ignore revision | `git cat-file`, `git show --stat --format=fuller <sha>`, representative `git blame --ignore-revs-file` | Exact existing commit; patch is mechanical-only; blame file works |
| Attribution/content | `pnpm run validate:attribution`; `pnpm run validate:content`; `pnpm run validate:content:quality` | Feature 043 and governed content remain valid without regenerated masking |
| Node tests | `pnpm run test` | Full suite passes, including all source-shape assertions |
| Production/offline | `pnpm run build` and service-worker tests | Bundle and offline asset generation pass; existing warning only if unchanged |
| E2E | `pnpm run test:e2e` | Desktop/mobile flows, About and manual behavior pass |
| Screenshot contracts | focused license/screenshot/capture Node tests and documented public capture validation without necessarily recapturing committed PNGs | README PNG identity/integrity, current-source build, recovery and no-recursion contracts remain green |
| Preflight | `pnpm run preflight` | Complete repository gate passes in required order |
| Docker | isolated free port/project: `make build`, `make up`, curl `/` and `/sw.js`, `make down` in `finally`; bounded pull diagnostics if unavailable | Local smoke passes, or two documented external-fetch stalls leave no containers and exact-final-head GitHub `docker-validation` proves build/start/HTTP/teardown; no sibling project touched |
| CI timing | current-head `baseline-checks` logs/step timestamps | `quality:fast` typecheck+lint ≤60 s on GitHub runner and head is named |
| Required GitHub gates | `baseline-checks`, `docker-validation`, `guard`, `AI Review`, `osv-scan`; thread/conflict inspection | All green on current head, no unresolved blocking thread/conflict |
| Final scope | `git diff --check`; base/head name-status; suppression audit | Only ТЗ-16 plus current feature memory, no hidden semantic/protected content change |

## Commit And Review Checklist

- Tooling/semantic commits are reviewable and retain focused evidence.
- Exactly one commit is declared format-only; it contains only formatter output.
- `.git-blame-ignore-revs` is added later and references the immutable full SHA.
- No force-push/rebase/amend is used after SHA publication.
- `content`, official archives, generated indexes/evidence, license texts and
  README screenshots have identical pre/post formatter hashes.
- All source-shape test changes preserve or strengthen the tested contract.
- No blanket lint/type suppression or warnings-as-success behavior exists.
- Current CI timing, required checks, review threads and cycle PR set are
  recorded before final role validation.

## Known Risk Handling

- If hooks rules reveal a behaviorally ambiguous dependency issue, record
  Implementation feedback and stop that item for Architect disposition; do not
  guess a dependency array.
- IF-044-001 and IF-044-002 now have the bounded current-cycle timer solutions
  above. Any broader hook/compiler finding remains outside those dispositions
  and must return through Orchestrator rather than expanding the preset/refactor.
- If current-head combined GitHub timing exceeds 60 seconds, treat it as an
  acceptance gap. Optimize config/cache within ТЗ-16 without dropping coverage,
  or route an explicit blocker; do not defer the measured failure silently.
- If formatting touches protected bytes, discard only the formatter-caused
  protected edit, investigate the scope bug and add a regression before retry;
  never regenerate pins/evidence as the fix.
- IF-044-003 authorizes one targeted restore of the 52 baseline-derived TS
  paths only after proof that their diff is uncommitted formatter-only output
  against current semantic `HEAD`. Any semantic/staged ambiguity blocks whole-
  file restore and must return to Orchestrator.
- If source-shape tests fail, preserve their semantic checks in a non-ignored
  commit. A broad test deletion/skip is not an option.
- If the mechanical diff conflicts with parallel work, Orchestrator coordinates
  the safe landing order. Implementation does not rebase/overwrite sibling work.
- If local Docker repeatedly stalls only while fetching uncached upstream base
  images, bound/cancel attempts and prove the isolated project is empty. This is
  a documented local-environment fallback, not a green Docker result; final
  validation remains blocked until required GitHub `docker-validation` is green
  on the exact current head and its build/start/smoke/teardown steps are visible.
