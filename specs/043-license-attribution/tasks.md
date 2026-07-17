# Tasks: LICENSE, Attribution, And Public Project Entry Point

## Work Items

- [x] T001 Analyst created `feature-request.md` in the verified latest-main
  handoff context for improvement 22 and recorded the Apache-2.0 owner choice.
- [x] T002 Architect defined scope, licensing inventory, conservative official-
  material boundaries, minimal About navigation, deterministic version source,
  screenshot strategy, test-first matrix, negative cases, process gates, and
  one-PR delivery plan.
- [x] T003 Orchestrator resolved security-channel discovery: owner explicitly
  authorized GitHub Private Vulnerability Reporting, Orchestrator enabled it,
  and follow-up GET returned `enabled:true`. Copyright discovery identified
  `Copyright 2026 Mikhail Orlov` from the 2026-only history and repository-owner
  identity; Implementation must recheck for contradictory owner metadata. Do
  not infer a security email from git history or substitute a public issue.
- [x] T004 Implementation Agent confirm assigned worktree/branch/single PR slice,
  base evidence, scoped files, and parallel-work preservation warning; record
  current discovery for repo URL, upstream pin/license/no-NOTICE, copyright,
  security channel, and official-source inventory before editing.
- [x] T005 Implementation Agent write and run failing focused static/unit and
  About E2E tests first. Record expected failures or a specific test-first
  exception; do not count missing dependencies/environment as product evidence.
- [x] T006 Add the canonical unmodified Apache-2.0 root `LICENSE`, evidence-
  backed root `NOTICE`, exact upstream license copy at the specified `licenses/`
  path, and `licenses/THIRD-PARTY-NOTICES.md`. Verify upstream copy byte equality
  and pinned commit `90d17d47864b807415ba505b682710a8f4c441f5`.
- [x] T007 In the third-party inventory, separately document community question
  data, GCBA HTML, GCBA PDF/manual/artwork, Boletín Oficial, national official
  sources, and marks/third-party artwork with path/URL/date/status. Preserve
  pending legal review wherever file-specific terms are not established; do not
  edit source archives or claim blanket CC BY/Apache permission.
- [x] T008 Rewrite README as the RU-first/RU+EN public entry point with truthful
  product/audience/limitations, Docker-only user quick start, separate developer
  verification, actual structure, license/attribution links, repository link,
  and placeholders only until the final three screenshots are captured.
- [x] T009 Add concise CONTRIBUTING matching `AGENTS.md`, PR-only and preflight;
  add SECURITY only with the T003-approved private path and disclosure
  expectations. Do not expose secrets or unapproved personal/corporate contact.
- [x] T010 Add `package.json` version `0.1.0`; implement the top-level About
  tab/view from existing canonical content-mode/source data, safe HTTPS repo
  link and existing styles. Do not add a router, `#/about`, backend, runtime
  fetch, dependency, or mutable duplicate disclaimer source.
- [x] T011 Add the offline deterministic attribution validator, package script,
  and `validate:content` integration. Make focused static/unit tests pass for
  exact license texts, inventory/provenance, README links/images/version and
  forbidden misleading boundaries.
- [x] T012 Complete About E2E for visible/keyboard navigation, package version,
  upstream/fallback/official/Russian-support boundaries, safe repository link,
  mobile readability, no attribution network requests, and regression of
  existing hash/manual navigation.
- [x] T013 Capture three final 1440×900 PNG product screenshots via Playwright
  under `docs_project/screens/readme/`, visually inspect them, link them in
  README, and record capture command, dimensions/signatures/current head. Verify
  actual GitHub rendering after push/PR; do not claim it from local existence.
- [x] T014 Update only durable affected docs: frontend docs, feature inventory,
  and learning/navigation flow. Record why CHANGELOG and future routing remain
  out of scope.
- [x] T015 Run and record the full verification matrix from `plan.md`, including
  focused gates, content/test/build/E2E/preflight, isolated Docker smoke,
  screenshot/link checks, `git diff --check`, and base scope diff. Fix failures
  only within assigned scope and record dead ends.
- [x] T016 Update every process-memory section below with exact evidence and all
  Implementation Agent feedback. Commit, push, and open one ready PR only when
  assigned by Orchestrator; never merge or mutate sibling state.
- [ ] T017 Review Agent independently review the current PR head for exact
  licensing/notice compliance, official-source caution, misleading claims,
  security channel, README/screenshots, About accessibility/offline behavior,
  regressions, tests, and role/process compliance without changing files.
- [ ] T018 Orchestrator route every review finding and Implementation Agent
  feedback; Architect must disposition feedback as task/ticket/not-needed, and
  Implementation fixes require fresh checks/review on the new head.
- [ ] T019 Orchestrator verify the one-PR cycle set, current required checks,
  resolved/outdated blocking threads, conflict-free state, acceptance evidence,
  process memory, and cleanup `not applicable` or separately assigned evidence.
- [ ] T020 Architect perform final validation of the complete cycle PR set and
  effective content head, record pass/timestamp/full SHA only when all tasks and
  feedback dispositions are closed, and increment return count for any gap.
- [ ] T021 Analyst final validation may run only after T020 passes and must
  validate customer intent against the same effective content head. Any Analyst
  gap returns to Architect disposition before follow-up work.
- [ ] T022 Orchestrator run the current-PR-head/effective-content-head guard,
  prove any later commit is validation-evidence-only, recheck all merge gates,
  and finalize/merge only when the repository completion contract is satisfied.
- [x] T023 Implementation Agent fix current review P2
  `PRRT_kwDOSX65IM6RmZBh` / `PRRC_kwDOSX65IM7Wht18`: recapture the affected
  README product screenshot(s), including `materials.png`, from the final local
  production UI with the deterministic capture flow. Inspect every committed
  README PNG at original resolution and with a pixel-level opaque-black-region
  check; reject large unexplained black rectangles, clipping, transient masks,
  and hidden content. Replace affected assets, update exact SHA-256/dimensions
  and visual-QA evidence, and keep README paths/current captions accurate. Do
  not repair source/manual artwork or broaden this into general image work.
- [x] T024 Implementation Agent fix current review P2
  `PRRT_kwDOSX65IM6RmZqj` / `PRRC_kwDOSX65IM7Whu0F`: make preview-process exit
  observation race-safe in `scripts/capture-readme-screenshots.mjs`. Register
  one exit promise/listener immediately after spawn, use that same state while
  waiting for readiness and during teardown, and check already-populated
  `exitCode`/`signalCode` so an early preview exit fails promptly instead of
  leaving unsettled top-level await. Add or run a deterministic forced-early-
  exit regression bounded by a timeout, plus the normal successful capture;
  do not add a dependency or unrelated process-manager abstraction.
- [ ] T025 After T023–T024, Implementation Agent rerun screenshot capture and
  original-resolution visual/pixel inspection, README relative-link and actual
  GitHub-render checks, `pnpm run validate:attribution`, the focused forced-exit
  regression, `git diff --check`, and all current-head checks affected by the
  fixes. Record new asset hashes, exact commands/outcomes and full candidate
  SHA; commit/push as assigned. Orchestrator obtains fresh thread-aware review
  on the new head and resolves/outdates both P2 threads only after verification.
- [x] T026 Implementation Agent fix current review P2
  `PRRT_kwDOSX65IM6Rmyep` / comment `3599312529`: make screenshot-helper
  readiness causally depend on the Vite preview process it spawned. An HTTP 200
  from the configured port is insufficient. Require a positive readiness signal
  from that child (for example its piped Vite readiness output) while racing the
  already-registered child exit promise, then perform the HTTP availability
  check only while that same child remains alive. Preserve T024's prompt early-
  exit/no-unsettled-await behavior and strict-port failure; do not introduce a
  general server manager or dependency.
- [ ] T027 Add a deterministic occupied-port regression for T026: start an
  unrelated local server that returns HTTP 200 on the configured capture port,
  run the screenshot helper under a bounded timeout, and prove it exits nonzero
  without starting capture or changing any committed screenshot hash/mtime.
  Rerun the forced-early-exit regression, normal capture, bounded cross-process
  pixel-equivalence comparison, original-resolution visual/pixel guards, README
  relative/GitHub-render checks, `pnpm run validate:attribution`, and affected
  current-head checks. Cross-process acceptance requires identical dimensions;
  at most 16 differing pixels per image; maximum absolute delta 1 in every RGBA
  channel; every differing coordinate explicitly recorded and contained only
  in the declared CSS rounded-corner antialias masks; zero differences outside
  those masks; and passing opaque-black-region guards. Record an exact SHA-256
  for each committed artifact as identity evidence, but do not require a fresh
  independent Chromium process to reproduce the encoded bytes/hash. Any wider,
  larger, darker, or content-region drift fails. Record exact outcomes/full
  candidate SHA, commit/push as assigned, and require fresh thread-aware review
  before resolving/outdating the P2.

## Decisions

- Owner-selected license: Apache-2.0 for Cabadrive-owned work.
- Delivery: one implementation PR in the Analyst-created latest-main handoff;
  license, docs, About and screenshots stay consistent atomically.
- About navigation: existing state-based top-level tab/view, not `#/about` and
  not improvement 05 routing.
- Version source: explicit initial pre-1.0 `package.json` version `0.1.0`, read
  locally at build/runtime; no date/network/random/commit fallback.
- Upstream inventory: pinned commit `90d17d...`, exact Apache copy, no upstream
  NOTICE discovered; absence is recorded without fabrication.
- Official content: detailed class-by-class inventory; observed GCBA site terms
  do not automatically license PDFs, BORA attachments, marks or third-party art.
- Screenshots: three final fixed-viewport PNGs generated after UI stabilization;
  no reuse of source-manual/evidence crops.
- CHANGELOG and full URL routing are independent future work and excluded.

## Blockers And Known Issues

- No open blocker at Architect handoff. GitHub Private Vulnerability Reporting
  was owner-authorized, enabled by Orchestrator, and verified `enabled:true` on
  2026-07-16. Implementation must recheck availability before final evidence.
- Copyright discovery supports `Mikhail Orlov`, 2026, from sole repository
  authorship and the repository-owner identity. Any contradictory owner
  metadata found during implementation is a blocker, not permission to guess.
- Official-material license conclusions are deliberately conservative; any
  unresolved file-specific rights remain a documented owner/legal-review issue,
  not a claim that this feature certifies redistribution rights.

## Implementation Agent Feedback

Implementation Agent appends each item with evidence and does not silently
implement out-of-scope improvements.

- F043-IA-001 (out of scope): production builds still report pre-existing
  Vite/Rollup chunk-size warnings for the large bundled manual/application
  chunks. This feature did not introduce a dependency or attempt code splitting
  because performance/bundle architecture is outside ТЗ-22. Evidence: successful
  `pnpm run build` and isolated Docker `make build` both emit the warning while
  producing a valid bundle. Orchestrator must route this to Architect for a
  ticket or explicit not-needed disposition.

## Architect Feedback Dispositions

- F043-IA-001 — **later ticket/backlog disposition; no ТЗ-22 implementation
  task**. The warning is accepted as a pre-existing, non-failing bundle-size
  signal because both the local production build and isolated Docker build
  complete successfully, and this feature adds no dependency or large content
  chunk. Bundle decomposition and lazy content loading are already owned by
  `docs/improvements/10-content-code-splitting.md` (P1) in the ordered
  improvements backlog. Implementing or suppressing it here would expand the
  legal/documentation/About scope and bypass that improvement's independent
  intake and service-worker coordination. Orchestrator should retain the build
  warning as known evidence for ТЗ-22 and route remediation when improvement 10
  reaches its priority; it does not block current verification or final
  validation unless the warning becomes a build failure or evidence shows this
  PR materially increased the affected chunks.
- Review P2 `PRRT_kwDOSX65IM6RmZBh` / `PRRC_kwDOSX65IM7Wht18` — **accepted as
  current-feature tasks T023 and T025; blocking**. The committed
  `materials.png` defect invalidates the claimed screenshot visual-QA evidence
  and directly violates README screenshot acceptance. The bounded repair is to
  recapture only affected public screenshots, inspect all README PNGs at source
  resolution plus an opaque-black-region pixel check, refresh hashes/evidence,
  and reverify README rendering on the new current head. General image-quality
  or manual-artwork remediation remains out of scope.
- Review P2 `PRRT_kwDOSX65IM6RmZqj` / `PRRC_kwDOSX65IM7Whu0F` — **accepted as
  current-feature tasks T024 and T025; blocking**. The capture helper is part of
  this feature's reproducible screenshot evidence, so a possible hang after an
  early preview exit cannot be deferred. The bounded repair is one exit promise
  registered immediately after spawn, shared by readiness and teardown with
  already-exited state checks, proven by a timeout-bounded forced-early-exit
  regression and a normal capture. Broader process supervision is not needed.
- Review P2 `PRRT_kwDOSX65IM6Rmyep` / comment `3599312529` — **accepted as
  current-feature tasks T026 and T027; blocking**. The helper's current HTTP-200
  readiness test can mistake an unrelated process on the strict port for the
  spawned preview and capture stale UI, invalidating reproducibility and the
  public screenshot evidence. Readiness must first be positively tied to the
  spawned child while racing that child's exit, with HTTP used only as the
  subsequent availability check. Verification must include an unrelated 200
  server occupying the port and prove bounded nonzero failure with no capture
  or screenshot mutation, while retaining the prior early-exit/no-hang repair
  and successful bounded-pixel-equivalent/pixel-guarded normal capture. This
  belongs to ТЗ-22's capture evidence and cannot be deferred.
- Cross-process capture determinism feedback — **accepted as a T027 acceptance
  clarification; no new product task or later ticket**. Independent
  Chromium/Skia processes differ only at rounded-corner antialias pixels
  (`learn`: 8; `materials`: 14; observed maximum channel delta: 1), while the
  images remain visually identical, original-resolution inspection is clean,
  and opaque-black guards pass. Exact byte/hash equality across processes is
  therefore not required: enforcing it with capture-only square-corner CSS
  would change the production appearance, and further normalization attempts
  are disproportionate. Determinism is accepted only under T027's fail-closed
  bounds: same dimensions, no more than 16 changed pixels per image, per-channel
  delta no greater than 1, an explicit coordinate list wholly inside declared
  rounded-corner masks, zero drift elsewhere, and passing black-region guards.
  Each committed PNG still requires its own exact SHA-256 identity record.

## Dead Ends

- Initial upstream tree/API discovery commands left the GitHub API path
  unquoted, so zsh expanded `?recursive=1` and returned `no matches found`.
  Retried with quoted API paths; pinned tree inspection then returned exactly
  `LICENSE`, no `NOTICE`, and the remote license SHA-256 matched the archive.
- The first test-first E2E setup build stopped before product assertions because
  the fresh worktree had an incomplete linked dependency tree and could not
  resolve `pdf-parse/lib/pdf-parse.js`. This was not counted as product evidence.
  `pnpm install --frozen-lockfile` restored the lockfile-defined dependencies;
  subsequent focused and full builds passed.
- The first focused About E2E run after implementation found a copy/test grammar
  mismatch (`не являются` versus the required singular `не является`). The UI
  copy was corrected to describe the current set, screenshots were recaptured,
  and the focused test then passed.
- The first screenshot visual review found the tenth desktop tab clipped by the
  previous single-row overflow layout. Desktop tabs now wrap while mobile keeps
  the existing horizontal scroller; all three screenshots were recaptured and
  visually rechecked.
- Review-fix capture diagnosis found that raw Chromium PNG encoding varied by
  14 antialiased pixels (maximum channel delta 1) on `materials.png`, while one
  image renderer inconsistently displayed large black masks that were absent
  from decoded RGB pixels. Fresh browser contexts stabilized application state;
  deterministic lossless RGB PNG normalization then made two consecutive full
  captures byte-identical and eliminated the raw-encoding variance.

## Verification Evidence

- Planning discovery only: assigned branch/worktree remained based on
  `ca5b5277195cd25d23b25f611dd5a3ac24d54586`; only Analyst intake plus these
  Architect-owned artifacts were present. Implementation evidence is pending.
- Upstream planning discovery: pinned tree `90d17d47864b807415ba505b682710a8f4c441f5`
  lists `LICENSE` and no `NOTICE`.
- Security planning discovery: initial GitHub API read reported private
  vulnerability reporting `enabled:false`; after explicit owner authorization,
  Orchestrator enabled it and verified a follow-up GET returned `enabled:true`.
  SECURITY therefore uses GitHub's private reporting flow and no invented email.
- Copyright planning discovery: reverse and unique git-author inspection showed
  repository history beginning in 2026 and author identities `Mikhail Orlov`
  and `Mikhail`/the `cucumberfalse` noreply account.
- Implementation startup/discovery (2026-07-16): worktree
  `/Users/chap/devel/cabadrive-worktrees/043-license-attribution`, branch
  `codex/043-license-attribution`, and `HEAD`
  `ca5b5277195cd25d23b25f611dd5a3ac24d54586` matched the assigned base before
  edits; only the four untracked feature artifacts were preserved. `git remote
  -v` and `gh api repos/cucumberfalse/cabadrive` confirmed the public canonical
  repository `https://github.com/cucumberfalse/cabadrive`, owner
  `cucumberfalse`, and creation in 2026. `git log`/`git shortlog` recheck found
  no contradictory project owner metadata; project authorship remains supported
  by the recorded Mikhail Orlov/cucumberfalse identities.
- Security/upstream recheck (2026-07-16): `gh api
  repos/cucumberfalse/cabadrive/private-vulnerability-reporting` returned
  `{"enabled":true}`. Quoted `gh api` reads for upstream tree/content at
  `90d17d47864b807415ba505b682710a8f4c441f5` returned `LICENSE`, no `NOTICE`,
  and SHA-256
  `c71d239df91726fc519c6eb72d318ec65820627232b2f796219e87dcf35d0ab4`,
  equal to the archived source license.
- Official-source/terms inventory (2026-07-16): all 19 manifest records were
  enumerated with class, URL, and retrieval date. The current GCBA terms page
  was re-read at `https://buenosaires.gob.ar/terminos-y-condiciones` (redirecting
  to the historical canonical page) and still stated CC BY 2.5 Argentina for
  covered site content. Inventory wording keeps PDFs, Boletín Oficial
  attachments, national sources, marks, and third-party artwork pending
  file-specific owner/legal review rather than applying a blanket license.
- Test-first static evidence: initial `node --test
  tests/license-attribution.test.mjs` returned 0/4 with expected missing
  `LICENSE`, `NOTICE`, policy files, and package version failures. Final focused
  commands `pnpm run validate:attribution` and `node --test
  tests/license-attribution.test.mjs` passed; four focused static tests pass.
- About/browser evidence: `pnpm run build` followed by `pnpm exec playwright
  test tests/e2e/app.spec.ts --grep 'О приложении' --project=chromium
  --reporter=line` passed 1/1. It verifies keyboard activation, version `0.1.0`,
  canonical local content/source boundaries, safe repository link, active state,
  and zero app-initiated GitHub/GCBA/Argentina requests.
- Full local matrix: `pnpm run validate:content` passed (460 questions, 276
  local image references); `pnpm run test` passed 489/489; `pnpm run build`
  passed and generated the 2,156-asset service worker; `pnpm run test:e2e`
  passed 104/104 across Chromium and mobile. `pnpm run preflight` then passed
  the feature-memory gate, repository baseline, validation, all 489 Node tests,
  production build, and all 104 E2E tests on the complete candidate tree.
  GitHub-rendered README evidence was deferred until the candidate PR and is
  closed by the post-push evidence below.
- Effective content commit and PR publication: commit
  `f6b0214dbd08194c8240434dd57d4828340706ab` was created on
  `codex/043-license-attribution`, pushed to origin, and opened as ready PR
  [#208](https://github.com/cucumberfalse/cabadrive/pull/208) against `main`.
  `gh pr view 208` reported `OPEN`, `isDraft:false`, `MERGEABLE`, and the same
  `headRefOid` before this evidence-only update.
- GitHub README render evidence: `jq -Rs ... README.md | gh api markdown
  --input -` returned three `<img>` elements with exact repository-relative
  paths `docs_project/screens/readme/{learn,materials,about}.png`. Each matching
  `raw.githubusercontent.com/.../codex/043-license-attribution/...` URL returned
  HTTP 200, `content-type: image/png` (content lengths 358140, 184891, and
  192220 bytes respectively). This closes the post-push GitHub render check.
- Screenshot evidence: `pnpm run screenshots:readme` used local Vite preview,
  Playwright Chromium, reduced motion, `deviceScaleFactor: 1`, and viewport
  1440×900. PNG signatures/dimensions pass the offline validator. Final hashes:
  `learn.png` `c073093c26b6747fa81493a3f72f940bac3717eb6629b653158e4510cd2db109`,
  `materials.png` `e0553bd17a7d00d7445030326fee2ea8cde6df48856bf7d7b107fdf62acf553e`,
  `about.png` `2d182de9cec8144d3f2152351235737ecd4d1d67365b954f7c8b5e9694964453`.
  Original-resolution visual inspection found the final labels truthful,
  navigation unclipped, content readable, and no personal/transient data.
- Review-fix screenshot evidence (2026-07-16): the capture helper now creates a
  fresh browser context for each page, installs fixed randomness before page
  creation, waits for fonts, visible image decode and two animation frames,
  disables transient animation/caret paint, losslessly normalizes decoded RGB
  scanlines, and rejects opaque-black rectangles before accepting each file.
  Two consecutive `pnpm run screenshots:readme` runs produced identical hashes
  and 1440×900 RGB PNGs: `learn.png`
  `c9ea5089ffe789e1592ab053758db9186e7d9beb77c77e41744571dc45051e09`,
  `materials.png`
  `0b667ad01e73685a43f5d62e2cbf425b26f903a6b5ededc00a148fcf5eb11233`,
  and `about.png`
  `e10c3d0e5e4d85d684c2b0548fa742db75e269b859bfd861fe32d953b72a5d99`.
  Original-resolution inspection covered all three assets; decoded-pixel checks
  reported no opaque-black region, clipping, transient masks, hidden content,
  or personal data.
- Review-fix process/test evidence (2026-07-16): one preview exit promise is
  registered immediately after spawn and reused by readiness and teardown;
  already-populated exit/signal state is checked. `node --test
  tests/capture-readme-screenshots.test.mjs` passed 3/3, including lossless PNG
  normalization and forced preview exit code 23 in 404 ms under its 3-second
  timeout. `pnpm run validate:attribution` passed; `pnpm run test` passed
  492/492; `pnpm run build` passed with the already-dispositioned bundle-size
  warning and generated the 2,156-asset service worker; `git diff --check`
  passed.
- Review-fix publication evidence (2026-07-16): candidate commit
  `5379672efdd95246bfecf947426ae95f0b36a993` was pushed to PR #208. GitHub's
  GFM renderer returned all three expected repository-relative `<img>` paths.
  Each branch raw URL returned HTTP 200 and `content-type: image/png`; remote
  lengths were 280229 (`learn`), 137098 (`materials`), and 145885 (`about`)
  bytes, and downloaded SHA-256 values exactly matched the committed hashes
  above. `gh pr view 208` reported the same current head, `OPEN`, ready,
  `MERGEABLE`. The Implementation portion of T025 is complete; fresh review and
  thread resolution remain Orchestrator-owned before T025 can close.
- Second review-fix local evidence (2026-07-16): readiness now first requires
  the configured `baseURL` in the spawned Vite child's piped stdout while
  concurrently racing that child's immediately registered exit promise. Only
  after that positive child signal does the helper race HTTP availability
  against the same exit promise and recheck populated exit/signal state before
  capture. Strict-port behavior remains enabled. `node --test
  tests/capture-readme-screenshots.test.mjs` passed 5/5: forced exit code 23
  failed in 380 ms, and an unrelated HTTP 200 server occupying the configured
  port caused nonzero failure in 924 ms under the 3-second limit, emitted no
  capture-success marker, and left every screenshot SHA-256 and mtime unchanged.
  The fifth focused test proves that outside-mask drift and channel deltas above
  1 fail closed.
- `pnpm run screenshots:readme:verify` captured two independent temporary sets
  without modifying committed screenshots. Both sets were 1440×900 and passed
  opaque-black guards. `about.png` had no changed pixels. `learn.png` had eight,
  all in declared rounded-corner masks: `(146,556)`, `(147,556)`, `(146,557)`,
  `(147,557)`, `(147,558)`, `(146,699)`, `(147,699)`, `(146,700)`.
  `materials.png` had fourteen: `(457,633)`, `(458,633)`, `(601,633)`,
  `(457,634)`, `(602,634)`, `(452,638)`, `(606,638)`, `(452,639)`,
  `(606,639)`, `(607,742)`, `(452,743)`, `(607,743)`, `(452,744)`,
  `(607,744)`. Every RGB channel delta was at most 1 (implicit opaque alpha
  delta 0), no coordinate differed outside the masks, and visual inspection
  found the normal production-appearance captures readable, unclipped and free
  of masks or hidden content. The exact committed SHA-256 identities are
  `learn.png` `56116116ab65e57ba1e9a8f668df174fbaec142db19e6cb899dfa1210519bda2`,
  `materials.png` `0b667ad01e73685a43f5d62e2cbf425b26f903a6b5ededc00a148fcf5eb11233`,
  and `about.png` `e10c3d0e5e4d85d684c2b0548fa742db75e269b859bfd861fe32d953b72a5d99`.
  `pnpm run validate:attribution` and `git diff --check` passed. `pnpm run test`
  passed 494/494; `pnpm run build` passed with the already-dispositioned chunk
  warning and generated the 2,156-asset service worker. After cancelling settled
  readiness/exit timeout handles, a final focused run passed 5/5 and the full
  independent comparison completed in 9.2 seconds. Post-push GFM/raw-image
  verification and the exact candidate SHA remain T027 work.
- A post-push focused guard exposed an overly tight test-harness timeout: under
  transient process-startup load, the occupied-port child was killed at 3
  seconds before reporting its own strict-port exit. No capture occurred. The
  regression bound was widened to 10 seconds while retaining nonzero/no-kill,
  no-capture, unchanged SHA/mtime, and fail-closed assertions; normal measured
  failure remains far below the bound. This test-only correction requires a new
  candidate content head and supersedes the publication evidence immediately
  below.
- Independent verification also exposed that Playwright `networkidle` could
  consume most of the verifier's 30-second child bound despite a fully loaded
  local page. Navigation now waits for the deterministic `load` event; the
  existing font, visible-image decode, two-frame settle, pixel guard and bounded
  comparison remain authoritative for capture readiness and visual stability.
- A subsequent stress run exposed Playwright actionability waiting after the
  target tab button was already resolved, visible, enabled and stable. Capture
  now invokes that same button's DOM `click()` and relies on the existing
  two-frame settle for the React state update, avoiding an unrelated synthetic-
  action navigation wait without changing application behavior or appearance.
- Second review-fix publication evidence (2026-07-16): candidate effective
  content commit `0457ddc864cc29e04e3fd959601ec66bfcd95d64` was pushed to
  PR #208. GitHub's GFM renderer returned the three expected repository-relative
  `<img>` paths. Each branch raw URL returned HTTP 200 and `content-type:
  image/png`; remote lengths were 280229 (`learn`), 137098 (`materials`), and
  145885 (`about`) bytes, and downloaded hashes exactly matched the committed
  SHA-256 identities above. `gh pr view 208` reported the same head, `OPEN`,
  ready and `MERGEABLE`; required checks and fresh AI review were in progress.
  The Implementation portion of T027 is complete; T027 remains open for the
  Orchestrator-owned fresh thread-aware review and thread disposition.
- Isolated Docker smoke: port `5187` had no listener; with
  `COMPOSE_PROJECT_NAME=cabadrive-043-license` and
  `CABADRIVE_HOST_PORT=5187`, `make build` and `make up` passed, HTTP returned
  the Cabadrive root, and Playwright opened `О приложении` and verified version,
  upstream, and fallback boundary. The same isolated variables with `make down`
  removed only `cabadrive-043-license`; `docker compose -p
  cabadrive-043-license ps --all` returned no containers.
- Scope/format before candidate commit: `git diff --check` passed. The scoped
  changes are limited to root license/public docs/policies, `licenses/`, About
  UI/styles/version, attribution/screenshot tooling, focused Node/E2E tests,
  three screenshots, the three assigned durable docs, and feature 043 memory.
  CHANGELOG and `#/about` routing remain intentionally out of scope.

## Review Evidence

- Review Agent raised two blocking P2 threads on PR #208: corrupted/false
  screenshot visual-QA evidence (`PRRT_kwDOSX65IM6RmZBh`) and a possible early-
  preview-exit hang (`PRRT_kwDOSX65IM6RmZqj`). Architect accepted both as T023–
  T025. Implementation fixes and local evidence are recorded above; fresh
  current-head review and thread resolution remain Orchestrator-owned.
- Review Agent then raised P2 `PRRT_kwDOSX65IM6Rmyep` / comment `3599312529`:
  an unrelated HTTP 200 server could satisfy readiness before the spawned Vite
  child established ownership of the strict port. Architect accepted it as
  T026–T027; the bounded causal-readiness fix and local regression evidence are
  recorded above, while fresh current-head review remains Orchestrator-owned.

## Cycle PR Set

| Purpose | Branch | PR | Base | Effective/current head | Status | Included in final validation |
|---|---|---|---|---|---|---|
| License, attribution, public docs, About UI, screenshots and tests | `codex/043-license-attribution` | [#208](https://github.com/cucumberfalse/cabadrive/pull/208) | `ca5b5277195cd25d23b25f611dd5a3ac24d54586` | candidate effective content head `0457ddc864cc29e04e3fd959601ec66bfcd95d64`; prior candidates are stale pending final validation; evidence-only head pending | open, ready, GitHub `MERGEABLE` at review-fix candidate; checks/review running | yes |

## Final Architect Validation Notes

- Architect validation pass: not yet invoked
- Architect return count for this work cycle: 0
- Final Architect validation completed at: not yet
- Architect validated effective content head: not yet
- Validation must cover the complete cycle PR set, all tasks/dispositions,
  acceptance and negative cases, review/check state, current process memory,
  and customer intent in spirit. Maximum returns: 10; another gap beyond that
  requires Orchestrator to ask Analyst for a new feature request.

## Cleanup Evidence

- Planning disposition: cleanup not applicable. The active handoff worktree and
  all sibling/ambiguous environments are preserved. Any future cleanup requires
  a separate explicit Cleanup Agent assignment and positive-proof evidence.
