# Tasks: Append-Only Static Asset Retention

## Cycle Context

- Feature: `051-asset-retention`.
- Verified planning base: `origin/main`
  `2a92bcfcb7638d1094f33b28e4c2932fb2e4121e`.
- Handoff worktree/branch:
  `/Users/chap/devel/cabadrive-worktrees/051-asset-retention`,
  `codex/051-asset-retention`.
- Delivery: one implementation PR continuing this handoff only after explicit
  Orchestrator assignment and latest-main re-verification.
- Parallel work: preserve all sibling state. Never mutate PR #214 or PR #215.
- Cycle PR set: PR #217, `codex/051-asset-retention`, purpose `append-only
  static asset retention and shell-last Docker/static deployment`; initial
  product head `c55dee242989b222e0092953721915ea8784275b`; reviewed current head
  `4f620d8a9c9909b77b841de1f3f24a018f7deade` contains all earlier accepted
  fixes but has accepted follow-up work R051-028 and R051-029 and is not a
  final-validation candidate.
  It is included only after implementation, verification, resolution of all
  open threads, and fresh exact-head review.
- Dependency: feature 051 must merge first. PR #215 is then synchronized to the
  merged main and independently retested/reviewed/revalidated.

## Setup And Test-First

- [x] T001 Orchestrator/Implementation Agent verify latest `origin/main`, exact
  branch/worktree, clean/known status, complete four-file feature memory, one-PR
  assignment, and parallel-work preservation. If PR #214 has merged, integrate
  only its main result role-appropriately; stop on ambiguous base/conflicts.
- [x] T002 Inspect current Vite output, Docker/Compose/Make/nginx lifecycle,
  required checks, and existing tests/docs. Record pre-edit diff and baseline.
- [x] T003 Add failing manifest/path tests: ordinal inventory, SHA/size, exact
  walk, missing/extra/mutated file, traversal, absolute/backslash alias,
  duplicate, symlink, non-regular file, and root escape.
- [x] T004 Add failing stage tests: equal-byte idempotence, unequal-byte
  collision, lock contention, partial-copy fault points, immutable preservation,
  atomic current pointer, and retry.
- [x] T005 Add failing real-browser A/B fixture where faithful legacy A excludes
  and never loads its lazy hash, Cache Storage miss is explicit, destructive B
  returns 404, and safe retained-origin behavior is initially absent.
- [x] T006 Add failing executable Docker integration cases for pre-build running
  and stopped legacy capture, project-scoped volume, stage-before-nginx,
  restart/down-up persistence, initial install, and sibling isolation. Config
  assertions or recorded manual commands alone do not complete this task.

## Implementation

- [x] T007 Implement canonical complete candidate manifest and safe filesystem
  walk with schema/path/size/SHA-256 validation and no symlink/escape surface.
- [x] T008 Implement exclusive locking and transactional state layout. Stage and
  rehash outgoing/candidate bytes; fail on collision; atomically promote new
  immutable files, release metadata/tree, and finally `current`. Preserve A and
  support idempotent retry at every fault boundary, including after release-tree
  promotion and before metadata promotion; promote any late authoritative legacy
  union before an idempotent return; require exact cumulative retained inventory
  and crash-durable file/directory sync ordering before activation; add no GC.
- [x] T009 Implement a static publish command that consumes current + candidate
  roots and emits a complete A+B `/assets/`, B-only mutable shell tree suitable
  for one atomic host publication. Reject candidate-only/destructive semantics
  and pre-existing output before any staging mutation. Prepare state without
  activation, atomically complete output, and only then commit `current`.
- [x] T010 Add Docker candidate/stager targets and project-scoped persistent
  release-state volume. Keep runtime nginx-only and end-user host Node-free.
- [x] T011 Add safe pre-build legacy capture for the exact Compose project. Use
  the running container when present or the prior Compose image when stopped;
  record source identity and fail if detected prior assets cannot be exported.
  Skip only for a validated committed-state tuple, never merely because its
  volume/directories exist. Never inspect/mutate another project or broad host
  directory. A verifier-rejected volume may not be copied through an attached
  container; preserve only independently validated handoff/baked legacy sources.
  Discover and adopt the unique exact pre-F051 project before using a new default.
- [x] T012 Make `make build` capture before image replacement and `make up` run
  the stager before replacing/starting nginx. Preserve volume on `make down` and
  keep default URL plus isolated project/port behavior. Compose, capture, lookup,
  handoff, and bind mount must share one effective project key, including a
  uniquely discovered legacy key for first upgrade.
- [x] T013 Serve retained `/assets/` from shared state and HTML/SW from atomic
  `current`; keep `/assets/` immutable, `sw.js`/HTML current, and missing hashed
  assets as 404 rather than SPA HTML. Preserve any merged-main PR #214 policy.
- [x] T014 Update the real browser fixture: install/control the generated legacy
  A worker and prove safe B staging gives the old A tab exact retained-origin
  bytes/MIME while its real precache remains missing;
  destructive control remains a demonstrated 404 and production gate failure.
- [x] T015 Update Docker/static-host/runtime/frontend/backend/feature-inventory
  and service-worker reliability docs for append-only retention, shell-last
  ordering, first legacy capture, indefinite storage, unsupported destructive
  hosting, and recovery limitations.

## Verification And Publication

- [x] T016 Run focused manifest/staging/fault/path/static-publish tests and
  record test-first FAIL->PASS evidence.
- [x] T017 Run the real-worker Chromium safe A->B origin-hit test and destructive
  control; record cache-miss proof, request source, status, MIME, exact bytes/SHA,
  and absence of HTML fallback.
- [x] T018 Run an executable isolated Docker running-legacy and stopped-legacy
  A->B regression in the normal Docker validation gate, plus
  initial install, restart and `make down/up`; smoke current HTML/SW and retained
  A hash. Also prove exact B shell/SW selection and B worker activation/control.
  Use unique Compose project/port and leave sibling projects untouched.
- [x] T019 Run `pnpm run typecheck`, `pnpm run lint`, `pnpm run format:check`,
  `pnpm run test`, `pnpm run build`, `pnpm run test:e2e`, full `pnpm run
  preflight`, `node scripts/check-feature-memory.mjs --worktree`, `pnpm run
  check:repo`, and `git diff --check`.
- [x] T020 Inspect final scope: no feature-049 product behavior or sibling
  feature-memory edits, no PR #214/#215 mutation, no host Node requirement, no
  unsafe deletion/overwrite, no broad path, and no committed runtime state/temp
  artifacts.
- [x] T021 Record exact results, release-state decisions, dead ends, known
  issues, all Implementation Agent feedback, effective content head, and cycle
  PR metadata. Commit/push/open exactly one ready PR under assignment; never
  merge as Implementation Agent.

## Review, Final Validation, And Merge

- [x] T022 Review Agent inspect exact PR head for transaction atomicity,
  path/symlink/race safety, byte collision, first legacy capture, project
  isolation, browser origin proof, destructive negative, Docker/static contract,
  docs, tests, sibling preservation, and role/process compliance.
- [x] T022a Implement R051-001: add a durable per-release marker and validate
  `current`/marker/release/metadata/assets as one tuple before suppressing legacy
  capture, with `current` still the final commit point. Prove an empty or
  incomplete release-state volume still captures a running/stopped A; corrupt or
  contradictory state fails closed without unsafe fallback or mutation.
- [x] T022b Implement R051-002: classify release-only, metadata-only,
  complete-inactive, and committed states; resume only exact partial state. Add a
  fault immediately after release-tree rename and before metadata publication,
  then prove retry succeeds without `EEXIST`, preserves A until commit, and
  rejects byte/manifest mismatch unchanged.
- [x] T022c Implement R051-003: make the normal Docker validation command execute
  a real isolated lifecycle using a unique project and port: legacy A, B capture
  and stage, never-loaded retained A request, restart, `down/up`, stopped-image
  capture, sibling sentinel verification, and exact scoped cleanup.
- [x] T022d Implement R051-004: replace the checkout-specific absolute fixture
  path with module/repository-relative resolution (for example `import.meta.url`),
  execute the focused test from an unrelated temporary working directory, scan
  governed fixtures for checkout paths, and rerun the exact failing CI baseline.
- [x] T022e Implement R051-005: establish one effective Compose project key used
  by Compose itself, capture, volume/image/container discovery, handoff path, and
  stager bind. Add contract and executable tests with the variable unset from a
  non-`cabadrive` cwd and with an explicit sibling-isolated value.
- [x] T022f Implement R051-006: collision-check and promote newly supplied legacy
  assets before the existing complete-release shortcut. Test B staged without a
  handoff then identical B with legacy A appended; test legacy collision leaves
  assets/releases/metadata/current unchanged.
- [x] T022g Implement R051-007: when project state verification fails, never use
  `/state/assets` from a container attached to that state as legacy authority.
  Preserve an existing handoff only when its canonical asset manifest, source ID,
  and independent source kind revalidate; atomically replace it only from an
  independently baked legacy root, and fail closed unchanged without either.
  Include readable rejected `/state` and corrupt-handoff negatives.
- [x] T022h Implement R051-008: validate an existing static-publish destination
  before calling stage. Snapshot `current`, releases, metadata, retained assets,
  and output; prove the negative leaves all of them byte-identical.
- [x] T022i Implement R051-009: add crash-durable activation ordering. Fsync all
  newly written/promoted assets, mutable files, release marker, cumulative ledger,
  and metadata; fsync affected directories after renames; fsync state after the
  `current` rename. Add ordered operation tracing and injected fsync/close-failure
  tests proving the old pointer remains selected and retry succeeds.
- [x] T022j Implement R051-010: add canonical `retained-assets.json` for the exact
  cumulative namespace. Stage/authority checks compare the complete filesystem
  walk, not only B's manifest. Test corrupt, deleted, and unexpected old A assets
  that B does not reference; each must block B before `current` changes.
- [x] T022k Implement R051-011: replace the synthetic-only browser proof with a
  worker generated from the historical A policy. Register/reload until it controls
  the page, prove its real precache excludes the lazy A hash, keep that A-controlled
  tab through B deploy, and run safe-origin plus destructive-404 fetches through it.
- [x] T022l Implement R051-012: strengthen the real Docker lifecycle by recording
  candidate B `index.html`/`sw.js` identities, proving their exact served bytes and
  committed B release, and using a headless browser to prove B's worker is
  activated/controlling after deploy, restart, and `down/up` for running/stopped A.
- [x] T022m Implement R051-013: add a single project resolver used before capture
  and all B Compose commands. Explicit `COMPOSE_PROJECT_NAME` wins; otherwise
  discover exactly one pre-F051 project from canonical checkout/config Compose
  labels or an exact historical-basename-owned container/image, then adopt it.
  Test non-`cabadrive` legacy running/stopped deployments, zero-match default,
  explicit selection, two-candidate ambiguity, mismatched labels, and a service-
  name-only sibling; ambiguous/foreign cases must fail without mutation.
- [x] T022n Implement R051-014: split static staging into prepare and commit while
  holding the release lock. Build/reverify/fsync output in a unique destination-
  sibling transaction, atomically rename and fsync its parent, then commit
  `current`. Inject copy/hash/file-fsync/dir-fsync/output-rename failures and prove
  A remains current with no final output. Persist a state-side pending journal
  binding destination/transaction/release/digests/exact output inventory before
  publication; inject after-output/before-current and prove only a matching
  journal plus exact bytes resume B. Missing/stale/mismatched journal,
  destination, transaction, or output fails unchanged. Also inject after-current/
  before-journal-clear and prove exact retry performs cleanup only.
- [x] T022o Implement R051-015: treat a static-publish pending journal as valid
  only when its retained-assets digest equals both the current canonical ledger
  and a fresh exact retained `/assets/` inventory. Add an A/B/C fault regression:
  leave B output/journal after `after-output`, promote C with a new asset, then
  prove B retry fails unchanged and cannot select A+B output; retain a no-C
  exact-retry control that succeeds.
- [x] T022p Implement R051-016: replace handoff pointer publication with a
  repository-owned no-follow atomic rename, not shell `mv`. Validate/constrain
  the handoff root and test a malicious existing `current` link to an external
  directory leaves its sentinel untouched while the handoff pointer is safely
  replaced.
- [x] T022q Implement R051-017: explicitly check every `publish_handoff`
  prerequisite and fail/cleanup before pointer publication on copy, marker,
  link, or rename failure. Add executable marker-writer failure injection proving
  the capture exits nonzero with no new authoritative `current` handoff.
- [x] T022r Implement R051-018: before the first immutable asset rename,
  durably publish a canonical asset-promotion recovery journal that binds the
  release/candidate/legacy inputs, prior ledger/store digest, additions, and
  exact expected cumulative inventory. After a fault following any asset rename
  and before `retained-assets.json` publication, resume only the exact same
  request when the fresh store is the verified prior inventory plus a
  byte-identical subset of additions; complete the ledger before any release or
  `current` operation. Test empty first-stage and A->B cases, missing/corrupt/
  stale/request-mismatched journals, unexpected partial assets, ledger-write and
  journal-clear failures. Every mismatch must leave retained bytes and the prior
  pointer unchanged; no retry may infer, delete, or overwrite assets.
- [x] T022s Implement R051-019: make durability synchronization recursive and
  ordered for every newly created/renamed directory entry through the state or
  static-publish transaction root. Add operation-trace and fault coverage for a
  nested `assets/x/y.js` proving `assets/x`, `assets`, and `state` are synced in
  order before `current`; cover nested release/output paths and failures at each
  ancestor. Each failure leaves A current and exact retry succeeds without
  destructive cleanup.
- [x] T022t Implement R051-020: extend `publish-pending.json` to bind the
  prior current release and both complete retained snapshots (pre-stage A and
  expected A+B). After `after-output`, fault B promotion before `current`, then
  retry using the exact journal-known A+B state: it must complete B and clear
  the journal. Foreign/extra assets, ledger drift, a changed current release,
  stale A+B after C, or a changed candidate/legacy request must fail unchanged.
  Do not loosen the existing A/B/C stale-output guard.
- [x] T022u Implement R051-021: use a no-follow `lstat` destination classifier
  before every static publish transaction. A dangling output-root symlink, live
  symlink, regular file, or directory is pre-existing state and is rejected
  before stage; only the exact journal-bound completed regular-directory output
  is recoverable. Test that the link and an external sentinel remain untouched.
- [x] T022v Implement R051-022: replace the permanent PID-only `stage.lock`
  with a durably fsynced owner record carrying a non-reusable host-local process
  identity. Prove dead-owner recovery atomically quarantines then replaces the
  stale record; a live matching identity, malformed, or inaccessible/
  cross-host/unsupported case fails closed, while a reused PID with a different
  start identity proves the recorded owner stale. Keep an injectable
  owner-inspection seam for deterministic tests and never blindly unlink a lock.
- [x] T022w Implement R051-023: on journaled recovery, re-fsync every exact
  promoted destination and rerun its ordered destination ancestor barrier even
  when that path already exists. Add nested `assets/x/y.js` faults immediately
  after rename/before each ancestor sync and trace that retry performs file,
  `assets/x`, `assets`, and `state` syncs before ledger/release/current. Foreign
  or non-journaled existing bytes remain collisions/fail-closed, not candidates
  for recovery.
- [x] T022x Implement R051-024: make the real `make build` path stop immediately
  when legacy capture fails. Remove status-masking command sequencing and add a
  wrapper integration test that forces capture nonzero, asserts the same failure
  propagates, and proves a build/replacement sentinel is never created.
- [x] T022y Implement R051-025: replace container-hostname lock authority with
  the effective Compose project key plus a durable project-scoped execution
  domain stored in retained state. Preserve unique per-acquisition token and
  non-reusable owner-start identity. Test default/explicit project stager
  recreation, changed hostname, stable domain, and sibling-project rejection.
- [x] T022z Implement R051-026: make capture handoff publication crash-durable.
  Close/fsync every copied file and marker, fsync every changed directory
  bottom-up through the handoff transaction root, then atomically replace
  `current` and fsync its parent. Add ordered trace and injected close/file/
  leaf/ancestor/root sync failures; each must retain the prior authority and an
  exact retry must repeat the full barrier.
- [x] T022aa Implement R051-027: replace stale-record read then quarantine with
  exact-generation atomic compare-and-reclaim. A contender may enter only after
  it atomically proves the canonical generation is the inspected dead one and
  transfers ownership; a loser restarts from a fresh read without touching the
  winner. Add deterministic adversarial tests for two paused reclaimers and for
  release/reacquire between inspection and transfer, asserting no live
  replacement is quarantined and maximum critical-section concurrency is one.
- [ ] T022ab Implement R051-028: validate every supplied legacy handoff before
  state mutation, whether or not `assets/` exists. Require a regular contained
  handoff root, required regular-directory `assets/`, complete marker/source
  fields and an exact inventory; missing, wrong-type, unreadable, incomplete or
  mismatched state fails closed. Add byte/pointer snapshots proving no retained
  assets, journal, release, metadata or `current` changes, plus an omitted-
  handoff clean-install control.
- [ ] T022ac Implement R051-029: make `publish-pending.json` recover the exact
  pre-output-rename state as well as the existing post-rename state. Constrain
  the transaction ID to one basename under the exact output parent; with output
  absent, require one no-follow regular-directory temporary tree whose complete
  inventory/candidate and journal-bound prior current/ledger/store all match,
  re-sync its full durability barrier, rename once, then use the existing stage
  and clear path. Add crash-style recovery and missing/extra/mutated/symlinked/
  escaped transaction, occupied/both-present destination, changed request and
  A/B/C state-drift negatives. Preserve the post-output and post-current retry
  regressions.
- [ ] T023 Orchestrator route every finding/feedback to the proper role; all
  blocking threads are fixed/resolved or explicitly disposed, checks rerun, and
  process memory refreshed.
- [ ] T024 Orchestrator record full cycle PR set, exact head, green required
  checks, conflicts, review state, acceptance evidence, feedback dispositions,
  cleanup applicability, and effective content head.
- [ ] T025 Architect final validation when invoked after T024; inspect the full
  PR, tasks, architecture, evidence, docs, findings, and user outcome. Maximum
  return count: 10.
- [ ] T026 Analyst final validation only after T025 passes; maximum return count:
  5. Any Analyst gap returns to Architect disposition.
- [ ] T027 Orchestrator run current-head guard, prove any post-validation commit
  evidence-only, recheck all gates, and conservatively merge feature 051.
- [ ] T028 After verified merge, Orchestrator assign synchronization of PR #215
  from updated main. Require its faithful legacy cache-miss/retained-origin test,
  affected/full checks, fresh exact-head review, updated feature-049 evidence,
  final Architect then Analyst validation, current-head guard, and only then
  finalization of PR #215.

## Decisions

- D051-001: all regular candidate `/assets/` files are immutable; names alone
  never establish integrity.
- D051-002: canonical equality is path + byte length + SHA-256; byte-different
  collision aborts without overwrite.
- D051-003: release state is project-scoped and persistent; `current` changes by
  same-filesystem atomic symlink rename only after complete verification.
- D051-004: safe partial progress may append unreferenced hashes, but may never
  select B shell early or delete/overwrite A; retry is idempotent.
- D051-005: the first legacy upgrade captures outgoing assets before Compose
  image replacement, from the current container or prior image. Detected but
  unreadable prior state fails closed.
- D051-006: a Docker stager preserves the Docker-only end-user contract; host
  Node/pnpm are not required.
- D051-007: static hosting publishes a complete merged tree atomically or is
  unsupported for this guarantee.
- D051-008: retention is indefinite; cleanup is a separate future feature.
- D051-009: feature 051 is a prerequisite PR. It never mutates PR #214/#215;
  #215 synchronizes/retests/revalidates only after 051 merges.
- D051-010: the effective Compose project identity has one default/override
  derivation shared by every lifecycle component; cwd basename is not a second
  source of truth.
- D051-011: verifier-rejected state has no recovery authority through an attached
  mount. Only an independently validated handoff or baked pre-feature root may
  seed recovery, and handoff replacement is atomic.
- D051-012: candidate idempotence follows full invocation-union promotion, and a
  pre-existing publish output fails before any release-state mutation.
- D051-013: `retained-assets.json` is the cumulative integrity authority for the
  entire append-only namespace; current-candidate membership is insufficient.
- D051-014: atomic rename becomes a durable activation only after required file
  and directory fsync ordering; sync/close failure blocks the pointer change.
- D051-015: acceptance evidence exercises actual A and B service-worker
  lifecycle/control and exact B shell/SW activation, not synthetic handlers or a
  retained-A-only Docker smoke.
- D051-016: first-upgrade identity resolution precedes the new default. Explicit
  identity or one exact checkout-bound legacy project is adopted end-to-end;
  ambiguity/foreign evidence fails closed.
- D051-017: static publication is prepare-output-commit. Complete durable output
  precedes `current`; only an exact artifact bound to the same durable pending
  journal can resume the post-output/pre-current window.
- D051-018: a pending static-publish journal is a snapshot of the complete
  retained namespace, not merely B's candidate manifest. It expires when the
  canonical ledger or exact retained walk changes; an older output is never
  selected after a later C asset promotion.
- D051-019: handoff `current` is an atomic link replacement performed with a
  no-follow rename; an existing link is never interpreted as a directory
  destination. Publication commands are explicitly checked rather than relying
  on shell `errexit` semantics in conditional invocation.
- D051-020: a pre-promotion asset journal is the sole recovery authority for an
  unledgered immutable partial store. It binds one exact requested union and
  permits only verified subset-to-complete resumption; it is never a substitute
  for the canonical ledger or an authority to discard existing retained bytes.
- D051-021: directory fsync is transitive to the declared transaction root for
  every new/renamed entry. A leaf directory sync alone does not make a nested
  asset's ancestor name durable.

## Evidence And Feedback

- R051-009 through R051-012 implementation evidence (2026-09-21):
  `node --test tests/static-release-staging.test.mjs` passed 12/12, including
  canonical retained-ledger corruption/missing/extra negatives and ordered
  fsync/close fault recovery. `pnpm exec playwright test
  tests/e2e/asset-retention.spec.ts --project=chromium --reporter=list` passed
  2/2: a generated historical A worker controls the page, its excluded deferred
  manual hash is absent from Cache Storage, then after B staging the first
  controlled fetch is an origin hit with exact A bytes; the matched destructive
  case is 404. `node scripts/test-docker-asset-retention.mjs` completed the
  isolated running/stopped-A lifecycle, exact B shell/SW comparisons, worker
  activation/control, restart and down/up persistence, and scoped cleanup.
- Implementation feedback: no scope divergence. R051-009 recovery permits only
  the exact pending candidate/legacy immutable union after a pre-pointer
  durability failure; all other historical drift remains fail-closed against
  `retained-assets.json`.
- Exact-head review at `3ea6fec3e20466f933e0fb87ffec0d4556b6519f`
  confirmed those older fixes but found two additional gaps: the new default can
  miss a pre-F051 basename-derived Compose deployment (R051-013), and static
  publish activates state before output copy/verification can fail (R051-014).
- R051-013/R051-014 implementation evidence (2026-09-21): capture now resolves
  an explicit project first; otherwise it adopts one checkout/config-labelled
  project or one exact historical-basename image, defaults to `cabadrive` only
  when no candidate exists, and rejects ambiguity. Every Make lifecycle command
  resolves then exports that same key. Static publish holds the release lock
  through a temporary sibling output, exact rehash/fsync, durable pending
  journal, atomic output rename, and only then the `current` commit. A matching
  post-output journal (destination, transaction, release/manifest and retained
  inventory digests, exact output inventory) is the sole resumable state. `node --test
  tests/static-release-staging.test.mjs tests/capture-legacy-assets.test.mjs
  tests/static-release-docker-contract.test.mjs tests/docker-runtime.test.mjs`
  passed 25/25; it includes output-before-current, pre-rename failure, and
  journal retry. Prettier and `git diff --check` passed. No scope divergence.

- Startup evidence: verified base and assigned worktree/branch are recorded
  above; only Analyst `feature-request.md` existed before Architect planning;
  parallel-work preservation acknowledged.
- Implementation evidence: `node --test tests/capture-legacy-assets.test.mjs
  tests/static-release-staging.test.mjs tests/static-release-docker-contract.test.mjs
  tests/docker-runtime.test.mjs` passed 13/13. `pnpm exec playwright test
  tests/e2e/asset-retention.spec.ts` passed 4/4 (Chromium and mobile): the A
  Cache Storage miss was explicit, the first post-B request was an origin hit
  returning JavaScript MIME and exact A SHA/body; the candidate-only control
  returned 404. Final `pnpm run preflight` and `git diff --check` passed.
- Docker evidence: isolated `cabadrive-051-retention` on port 5181 passed
  initial build/stage/start, live retained-asset request, running-container
  capture, `make down/up` persistence, and follow-up build/start. The stopped
  prior-image path is exercised deterministically by
  `tests/capture-legacy-assets.test.mjs`; it verifies the first `/state/assets`
  attempt falls back to the stopped legacy image's original
  `/usr/share/nginx/html/assets`, retaining exact bytes and source identity.
- Review at head `4835f66` invalidated that evidence as merge-ready proof: the
  Docker lifecycle is not an executable regression, an empty/failed-created
  volume can suppress required legacy capture, and a crash after release rename
  makes retry fail on an existing destination.
- CI baseline at head `4835f66` failed because
  `tests/capture-legacy-assets.test.mjs` invoked a checkout-specific absolute
  script path. The earlier local pass is not portable evidence.
- Dead end fixed: nginx initially returned 500 because staged directories were
  mode 0700. The stager now creates/traverses serving directories at 0755;
  isolated Docker smoke then passed. The implementation then treated any
  preserved state volume as authoritative; R051-001 records why that shortcut
  is unsafe and replaces it with complete-tuple validation.
- Follow-up implementation: a `.release-state.json` marker now binds every
  release ID to its canonical manifest. `verifyCommittedState` accepts only a
  complete current/marker/release/metadata/assets tuple. The capture wrapper
  invokes that read-only verifier inside a throwaway Node Docker container;
  empty/corrupt state continues to running/stopped legacy capture and no-source
  state fails closed. The new `after-release` fault leaves A current and an
  exact retry reconstructs metadata without `EEXIST` before the final pointer
  rename.
- Follow-up focused evidence: typecheck and lint passed; 17 focused tests
  passed (staging marker/retry, capture incomplete/running and stopped-image
  paths, Docker contract). `pnpm run test:docker-retention` passed: it runs an
  isolated, test-owned running legacy A -> candidate B capture, exact old lazy
  asset fetch, restart, `down/up`, stopped-image capture and untouched sibling
  volume sentinel. The lifecycle script is called from the `docker-validation`
  CI job. Final `pnpm run preflight`, final lifecycle run and `git diff --check`
  passed after this process-memory update.
- Fresh exact-head review at
  `f032d80b8cf59eb562b28cc30d5c7c96f57d26cf` accepted four additional gaps:
  Compose and capture disagree on the unset project key (R051-005); the complete
  candidate shortcut can omit newly available legacy bytes (R051-006); rejected
  state can be laundered through attached-container `/state/assets` (R051-007);
  and static publish mutates release state before rejecting existing output
  (R051-008). Those review threads remained unresolved pending evidence; the
  authoritative current inventory is the eighteen-thread ledger below.
- Historical Implementation Agent feedback through R051-004: none; no
  out-of-spec product decision was required.
- Publication: PR #217 is open; the exact head reviewed for this disposition is
  `3ea6fec3e20466f933e0fb87ffec0d4556b6519f`.
- Review evidence: GitHub inventory contains exactly eighteen unresolved review
  threads. Sixteen prior threads have accepted fixes implemented through
  R051-001—R051-012 but remain open pending evidence. Two new actionable threads
  (`r4062513742`, `r4062513748`) are disposed as R051-013 and R051-014. No thread
  was resolved by this Architect pass.
- Follow-up Implementation Agent feedback/evidence for T022e through T022h:
  the Compose file and Makefile now declare/export the same `cabadrive`
  default while an explicit `COMPOSE_PROJECT_NAME` overrides every consumer;
  the capture wrapper uses repository-relative handoff state and a single
  project key. A canonical handoff has immutable path/size/SHA-256 inventory,
  source ID, and `baked-legacy-root` kind; capture preserves a revalidated
  pointer or atomically publishes a new pointer only after copying the baked
  root, never `/state/assets`. Stage validates and promotes the full legacy plus
  candidate union before returning an existing candidate as idempotent. Static
  publish rejects an existing destination before calling stage. No additional
  out-of-scope feedback or owner decision was required.
- Follow-up focused verification: `node --test
  tests/static-release-staging.test.mjs tests/capture-legacy-assets.test.mjs
  tests/static-release-docker-contract.test.mjs tests/docker-runtime.test.mjs`
  passed 22/22; it includes unset-cwd/default-project, explicit fixture,
  rejected-state no-`/state` copy, malformed handoff, late legacy append,
  collision/no-mutation, and pre-existing-output snapshot negatives.
  `pnpm run typecheck`, `pnpm run lint`, `pnpm run format:check`, and `git diff
  --check` passed. `pnpm run test:docker-retention` passed the real isolated
  running-A capture, old-hash request, restart, down/up, stopped-image capture,
  sibling sentinel, and scoped cleanup lifecycle.
- Exact-head implementation evidence at
  `a7cc88320c24b051bc28b01122e5c9c0e032abaa`: focused tests passed 22/22, the
  real Docker lifecycle passed, and full preflight passed. This confirms the
  older accepted fixes but does not close the four new gaps: durable sync
  ordering, cumulative historical integrity, a controlling legacy A worker, and
  positive B shell/SW/worker activation.
- CI portability follow-up (2026-09-21): the required baseline failed only
  because `tests/static-release-staging.test.mjs` was not Prettier-formatted.
  The required `docker-validation` lifecycle runs a real Chromium service-worker
  controller assertion, but its isolated runner had neither the package nor a
  browser installed. The job now installs the locked pnpm dependencies and
  Chromium before running the unchanged executable lifecycle command; this is
  CI-only test setup, not a host runtime requirement. `pnpm run preflight`,
  `pnpm run test:docker-retention`, explicit Prettier checks for the workflow and
  corrected test, and `git diff --check` passed after the update.
- Exact-head review at `a921eeac5dc70a0f0f71c4d84968dd3ebaee6b88` found three
  new actionable gaps: a P1 permits an old B pending journal to resume after C
  changed the retained ledger, selecting A+B output that omits C; one P2 uses
  shell `mv` against a potentially directory-valued handoff link; and another
  P2 relies on POSIX `set -e` inside a function invoked through `||`, allowing a
  failed marker write to continue. Architect accepts them as R051-015,
  R051-016, and R051-017 respectively. No owner decision or scope expansion is
  required; implementation must add the stated fail-closed A/B/C,
  external-symlink, and marker-write failure tests.
- R051-015 through R051-017 implementation: a pending static output journal
  now records the pre-activation retained namespace and may resume only while
  both the current canonical ledger and fresh retained-assets walk still digest
  to that snapshot. The focused A/B/C fault test proves C makes B's output
  non-resumable without altering C state, while the no-C retry remains valid.
  Legacy capture now delegates pointer publication to a Node no-follow atomic
  rename helper; an external-directory `current` link is replaced as a link,
  never traversed. Every capture copy/source/marker/pointer step is explicitly
  checked and cleans its unselected temporary handoff on failure. Focused
  `node --test tests/static-release-staging.test.mjs
  tests/capture-legacy-assets.test.mjs` passed 22/22, followed by Prettier and
  `git diff --check`; the first real lifecycle replay exposed an empty optional
  `--fault` argument, which made the CLI reject normal capture before pointer
  publication. Capture now omits that option outside injected-fault cases; an
  isolated real handoff replay and `pnpm run test:docker-retention` both passed,
  including running and stopped A migration. Full preflight was green before
  this correction and is rerun for the final commit before review/final
  validation.
- Exact-head review at `e83654a8879a724cdb2eda85fd37de252eba5ded` found two
  additional P2 gaps. R051-018: an asset rename may succeed before
  `retained-assets.json` is written, leaving a nonempty unledgered store that
  the existing retry rejects. R051-019: a nested `assets/x/y.js` syncs only
  `assets/x`, omitting `/assets` and its ancestor durability barrier. Both are
  accepted; implementation must add the exact journaled recovery and ordered
  ancestor-sync contracts in T022r/T022s. No owner decision or scope expansion
  is required. Review threads remain unresolved pending implementation evidence.
- R051-018/R051-019 implementation: before any immutable asset rename, the
  stager writes and fsyncs `retained-assets-pending.json` binding the exact
  release, authoritative legacy source, prior inventory, additions and expected
  cumulative inventory. An exact prior-plus-subset retry alone may finish the
  ledger and remove the journal; missing, corrupt, unexpected, or request-stale
  state remains unchanged and fails closed. Every copied or renamed nested entry
  now syncs directory ancestors innermost-first through its transaction/state
  root before `current`. Focused Node suites passed 31/31
  (`static-release-staging`, `capture-legacy-assets`, static Docker contract,
  Docker runtime); `pnpm run test:docker-retention` passed with the isolated
  real Docker A/B retained-asset lifecycle; `pnpm run preflight` passed. No
  scope divergence or new implementation feedback.
- Exact-head review at `bb1b51e8b4668c7da861059c9750b2e5f1a4c6d6` found four
  additional P2 gaps. R051-020 (`r4072969602`) rejects a journal's own B
  additions after a pre-current fault; R051-021 (`r4072969623`) treats a
  dangling publish-output symlink as absent and overwrites it; R051-022
  (`r4072969633`) leaves a crash-stale stage lock unrecoverable; R051-023 lets
  a retry skip the file/ancestor durability barrier after a matching destination
  already exists. Architect accepts all four bounded follow-ups above. They
  require test-first executable recovery/negative evidence, fresh full
  verification and review; no owner decision or scope expansion is required.
- R051-020 through R051-023 implementation evidence (2026-09-22): `node
  --test tests/static-release-staging.test.mjs
  tests/capture-legacy-assets.test.mjs tests/static-release-docker-contract.test.mjs
  tests/docker-runtime.test.mjs` passed 35/35. It covers B's exact own A+B
  recovery after a pre-current fault, candidate/C drift rejection, no-follow
  live/dangling output symlink protection, owner-record quarantine/reclaim and
  fail-closed live/ambiguous/malformed locks, plus nested existing-promotion
  file/ancestor re-fsync faults and retry ordering. `pnpm run typecheck`,
  `pnpm run lint`, `pnpm run format:check`, and `pnpm run preflight` passed.
  `pnpm run test:docker-retention` passed the isolated real Docker lifecycle.
  Fresh exact-head review and required GitHub checks remain required before
  final validation. No scope divergence or new implementation feedback.
- Integrated implementation audit evidence (2026-09-22): the complete existing
  F051 state-machine contract was rechecked in one pass across clean initial
  publication, A->B, A->B->C stale rejection, exact own-pending retry,
  corrupt/foreign current state, partial asset/ledger/release/output journals,
  nested durability barriers, hostile/dangling symlinks, live/dead/ambiguous
  lock ownership, running/stopped/nondefault legacy projects, static output,
  restart, and down/up. Three concrete defects were fixed inside the existing
  R051-018/R051-020/R051-023 and acceptance-24 contracts: an initial
  post-output retry now records a canonical null prior release; pending recovery
  requires the full committed current tuple rather than trusting its ID; and an
  expected ledger surviving a failed directory barrier is atomically
  re-published before activation. The previously specified
  post-current/pre-journal-clear boundary now has an explicit resumable fault
  point and regression. No architecture decision, new product scope, or owner
  decision was required.
- Final integrated focused evidence: `node --test
  tests/static-release-staging.test.mjs tests/capture-legacy-assets.test.mjs
  tests/static-release-docker-contract.test.mjs tests/docker-runtime.test.mjs`
  passed 38/38; the state-machine suite itself passed 25/25. `pnpm exec
  playwright test tests/e2e/asset-retention.spec.ts` passed 4/4. `pnpm run
  preflight` passed with 588/588 Node tests and 158/158 Playwright tests, plus
  feature-memory, repository, content, typecheck, lint, format, negative-quality
  and production-build gates. `pnpm run test:docker-retention` passed a real,
  isolated lifecycle covering running legacy A, restart, down/up, stopped-image
  A, candidate shell/worker control, sibling isolation, and a clean initial
  install with no inherited legacy asset. `git diff --check` passed; PR #214 and
  PR #215 were not mutated.
- Effective content head: pending final process-memory and validation guards.
- Cleanup: not assigned; any later environment cleanup requires separate
  Cleanup Agent scope/evidence.
- Historical exact-head review at
  `b8cac66c10826bc5f36ee934c6c67641987bd254` reported ten threads. All ten
  prior threads are fixed and resolved on the current PR. Exact-head review at
  `4f620d8a9c9909b77b841de1f3f24a018f7deade` reports exactly two current
  unresolved findings: R051-028 (`r4076551228`, P1) and R051-029
  (`r4076551237`, P2). They are accepted together as the final bounded
  T022ab–T022ac implementation batch; no owner decision, product-scope expansion,
  or workflow relaxation is required.
- R051-024 through R051-027 implementation evidence (2026-09-22): `make build`
  now runs capture and image build as separate fail-fast recipes, with a real
  wrapper test proving a failed capture never reaches the build sentinel. The
  retained state stores one Compose-project-bound execution domain while every
  stager incarnation and acquisition keeps distinct diagnostic/start/token
  identity. Stale recovery pins the exact canonical lock inode with an exclusive
  hard-link guard, rechecks its complete generation, and atomically renames a
  durable replacement over it without an unlocked name gap; deterministic
  release/reacquire and nested two-reclaimer interleavings leave the live
  replacement untouched and observe maximum critical-section concurrency one.
  Legacy capture now fsyncs/closes every captured file and marker, then syncs
  directories bottom-up through the release, `releases`, and handoff roots
  before the independent pointer commit. Focused staging/capture/Docker contract
  tests pass `43/43`. An integrated adjacent-regression audit also replaced the
  quarantine filename's untrusted acquisition component with a digest plus UUID
  and confirmed no sibling project, external symlink target, or newer lock
  generation can be mutated. Implementation feedback: no scope divergence or
  further Architect disposition is required.
- Integrated verification at product head
  `a2e538a79e1da61966b060220f42c5a0812e185a`: `pnpm run preflight` passed
  repository/content/type/lint/format/negative gates, `593/593` Node tests, two
  production builds, and `158/158` Playwright tests. The executable
  `pnpm run test:docker-retention` A→B lifecycle also passed for isolated project
  `cabadrive-retention-43496-1790112058866`, including running-container and
  stopped-image migration, recreated stager/runtime use of retained state,
  exact old asset/current shell/service-worker bytes, sibling-volume isolation,
  and clean initial install. Deterministic concurrent exact-generation coverage
  is included in the 593-test suite because its forced paused interleaving is
  stronger and repeatable compared with scheduler-dependent Docker overlap.
- Architect disposition at exact head
  `4f620d8a9c9909b77b841de1f3f24a018f7deade`: the ten earlier fixed review
  threads are resolved; two fresh threads remain open. R051-028 requires
  fail-closed validation of any supplied legacy handoff even when its assets
  directory is missing/incomplete. R051-029 requires exact crash recovery from
  the durable-journal/pre-output-rename window, with the temporary and final
  output relations mutually exclusive and fully bound. T022ab–T022ac capture
  all identified implications in one last implementation return. Fresh focused
  and full evidence, thread resolution, required checks and exact-head review
  remain mandatory before final validation.

## Final Architect Validation

- Architect validation pass: not ready; final validation was not invoked.
- Final Architect validation completed at: pending.
- Architect return reason: R051-028 and R051-029 require the final bounded
  T022ab–T022ac implementation batch, focused/full verification, resolution of
  the two current review threads, required checks, and fresh exact-head review.
- Architect return count: 9 / 10.
- Architect validated effective content head: pending.

## Final Analyst Validation

- Analyst validation: not invoked; must follow Architect pass.
- Analyst return count: 0 / 5.
- Analyst validated effective content head: pending.
