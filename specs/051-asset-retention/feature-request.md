# Feature Request: Retained static assets for safe service-worker deployments

## Intake Metadata

- Feature ID: `051-asset-retention`
- Intake role: Analyst
- Assigned worktree: `/Users/chap/devel/cabadrive-worktrees/051-asset-retention`
- Assigned branch: `codex/051-asset-retention`
- Verified base supplied by Orchestrator: `origin/main` = `2a92bcfcb7638d1094f33b28e4c2932fb2e4121e`.
- Local verification: this worktree was created directly from that SHA; `HEAD` is `2a92bcfcb7638d1094f33b28e4c2932fb2e4121e` and was clean before this intake artifact.
- Numbering context: checked all registered Cabadrive worktrees as well as the base `specs/`; existing active feature folders include `049` and `050`, so the next unambiguous feature number is `051`.
- Parallel-work warning: branches, worktrees, dirty diffs, commits, process memory and PRs may be active, including PR #214 and PR #215. They must be preserved. Do not reset, rebase, merge, close, delete or otherwise mutate sibling work.
- Analyst scope: this folder and this one `feature-request.md` only. No `spec.md`, `plan.md`, `tasks.md`, code, tests, docs, commits, pushes, PRs, reviews or merge action.

## Authority and originating user intent

The user asked for the site to use updated code rather than stale cache after a page refresh, and subsequently authorised the normal work needed to finish it with: «да, делай все необходимое» and repeatedly «продолжай до мержа».

Feature `049-learning-priority-fresh-update` implements the application-side update lifecycle and learning-priority behavior. Review of that PR identified a deployment-level gap: an old controlled tab can request a lazy hashed asset from release A for the first time after release B has replaced the origin build. A service worker cannot serve an asset it did not precache, and a destructive static deployment removes A's asset from origin; the request then fails with 404.

This separate prerequisite feature closes the deployment contract needed for safe A-to-B releases. It is intentionally distinct from PR #215: this feature must merge first, then PR #215 must be synchronized with the resulting `main` and retested before its final validation and merge. It does not reopen the learner-facing scheduling work.

## Product and technical context

Cabadrive is a static, local-first React/Vite application with no runtime backend. It is delivered primarily by Docker/Nginx and may also be placed on static hosting. Offline use after installation remains a product contract. The production build uses hashed Vite asset URLs (including lazy/manual chunks) and a generated service worker. A service worker update can preserve a currently controlled release A until the user accepts the transition to B, but that is safe only when every request that A can still make can be satisfied either from A's cache or from the static origin.

The required origin-side guarantee is therefore historical, append-only retention below `/assets/` across compatible releases. Before the shell for B is made live, the deploy process must first stage B's immutable hashed assets while retaining all existing immutable assets. The switch to B's HTML and service worker is last. Retention is not a substitute for service-worker cache correctness: it makes the cache-miss path safe for a still-active A client.

Relevant durable context read during intake:

- `.specify/memory/constitution.md` — spec-first, testable boundaries, Docker-first deployability, isolated worktrees and PR-only finalization.
- `docs_project/README.md`, `project-idea.md`, frontend/backend docs, feature inventory and learning/exam flows — static local-first SPA/PWA, no runtime backend, Docker-only local contract and offline continuity.
- `docs/specify/README.md` — static local implementation and deployment constraints.
- Active feature-049 memory on its isolated branch — the update lifecycle is separately implemented and its current review findings exposed the old lazy-chunk origin failure.

No external research was needed: the requirement derives from the observed review scenario and the repository's local Docker/static-host delivery contract.

## Problem statement

With destructive deployment semantics, a release B deployment replaces the served build directory. An existing A-controlled tab that has not yet fetched a lazily imported module can request `/assets/<A-hash>.js` after B is live. The A service worker has no cached copy, and the B origin no longer has the A-hashed file. The resulting 404 breaks that tab despite the intended update lifecycle preserving it until a safe transition.

Precache-only tests can hide this failure if a fixture manually includes every old lazy file. The required behavior must instead be demonstrated through the real origin fallback: A intentionally misses the lazy asset cache, B is deployed, and the old path is served from the retained origin bytes.

## Desired outcome

The repository provides an explicit, fail-closed static deployment staging mechanism with these properties:

1. A deployment preserves already-published immutable `/assets/` files and adds every immutable `/assets/` file produced by the candidate build before making its shell live.
2. For any retained path, bytes are immutable. A candidate file whose path already exists but whose bytes differ is a collision and aborts the deployment before a shell switch. Identical path and identical bytes are idempotent and allowed.
3. Staging is complete and validated before activation. Missing build assets, missing retained assets, unreadable files, malformed paths, or incomplete copy/verification abort without exposing a partially staged candidate shell.
4. The activation step makes B's shell/service worker available only after the successful assets stage. The exact atomic switch mechanism is for Architect to choose, but its externally observable ordering is mandatory.
5. A legacy A client whose service-worker cache intentionally lacks a deferred A chunk can request that chunk after B deployment and receive the exact retained A bytes from origin. It must not receive B bytes, HTML fallback, or 404.
6. A deliberately destructive deployment/setup that removes A assets fails the same regression; the test must prove why append-only retention is necessary rather than merely asserting a copy helper.
7. Docker-first local delivery and the documented optional static-host deployment contract express the same safety invariant. A static host that cannot retain historical immutable assets must be treated as incompatible with this safe update lifecycle, not silently accepted.

## Scope

### In scope

- A deterministic, repository-owned release-staging mechanism for static build output with append-only historical `/assets/` retention.
- Candidate-build asset inventory and byte comparison for same-path idempotence versus collision.
- Fail-closed validation of staging completeness and ordering before the live shell switch.
- Atomic or equivalently no-partial-observability shell/service-worker activation after successful asset staging; Architect documents the exact mechanism and its platform assumptions.
- Docker image/build/runtime changes needed to make the local serving contract use the safe staging model.
- Documentation of the static-host contract: immutable historical asset retention, correct cache semantics, candidate assets first, shell last, and explicit incompatibility when an operator only supports destructive replacement.
- Automated tests covering two releases A and B, real legacy cache miss to retained-origin hit, exact byte identity, collision and incomplete-stage rejection, and the destructive-deploy negative.
- Targeted durable documentation updates where the Docker/static deployment behavior changes.
- Process memory recording the dependency on PR #215 and the required merge order.

### Out of scope

- Changes to feature 049's learner behavior, progress storage, priority ordering, update banner UX or service-worker registration protocol, except for synchronization/retesting once this prerequisite has merged.
- Accounts, backend, CDN vendor selection, remote storage service, cross-origin asset hosting, cloud sync or analytics.
- Retaining unbounded historical HTML, service-worker scripts, source maps, or arbitrary files outside the defined immutable `/assets/` policy unless Architect demonstrates they are required for the A-to-B guarantee.
- Retroactively recovering assets already deleted by an external deployment outside the validated staging flow.
- Guaranteeing continuity after manual browser-site-data deletion, private-mode eviction, an origin change, or an operator bypassing the documented deploy contract.

## Acceptance expectations

### R051-1: append-only immutable asset stage

Given a release target that already contains A's `/assets/`, when B is staged, the target retains every existing valid A asset and contains every B asset before B's shell can be selected. Candidate paths are normalized and confined to `/assets/`; no traversal, symlink escape or unrelated live-shell overwrite is permitted.

### R051-2: byte-safe idempotence and collision handling

Given an existing target path and a candidate asset with the same path, equal bytes allow an idempotent stage. Different bytes are a fatal collision. The operation must leave the previously active shell and its previously valid asset set intact on failure; it must not silently overwrite an immutable path.

### R051-3: complete and fail-closed stage

The stage verifies an authoritative candidate asset inventory and the actually staged files. A missing/corrupt/unreadable candidate asset or verification mismatch aborts prior to activation. A partially copied candidate must never become the live shell.

### R051-4: shell-last activation

For an A-to-B transition, the observable activation ordering is:

1. validate candidate build and inventory;
2. append and verify B assets alongside retained A assets;
3. switch B HTML/service-worker entry points only after step 2 succeeds.

If step 1 or 2 fails, A remains the live release. Architect must state how the Docker-served layout achieves this and what an optional static host must provide to be considered equivalent.

### R051-5: real legacy lazy-asset regression

An executable A/B test must build or otherwise create genuinely distinct release artifacts with hashed lazy assets. It must ensure the old client cache does **not** contain the deferred A asset, deploy B through the safe staging mechanism, request the A asset path from the old client/origin and assert an HTTP success with exactly A's bytes. The fixture must not manually precache the disputed A lazy file, because that would avoid the origin fallback being tested.

### R051-6: destructive-deploy negative

The same scenario with destructive replacement/removal of A assets must fail to retrieve the old lazy asset (normally 404). This is a required negative proof, isolated from the safe deploy path, and must not be the production deployment behavior.

### R051-7: Docker and static-host contract

`make build`, `make up` and the Docker-served app continue to work. The shipping/runtime docs explain the retained-assets invariant and shell-last order. Any optional static host must use a deployment method with the same atomic and historical-asset guarantees; an operator cannot claim safe update continuity when configuring destructive overwrite.

### R051-8: integration sequencing with feature 049

This prerequisite receives its own branch/PR and complete feature memory. After it merges, Orchestrator synchronizes PR #215 to the new `main`, runs applicable tests and review again, resolves new findings by the normal Architect/Implementation/Review route, and repeats final Architect then Analyst validation on the effective content head. PR #215 must not be final-merged before this prerequisite is merged and verified.

## Required negative scenarios

- Same immutable asset path with different bytes: reject before a shell switch; old release remains served.
- Candidate manifest lists an asset that did not stage or whose staged digest differs: reject before a shell switch.
- Candidate stage fails part-way through: no B HTML/service-worker becomes live and old retained assets remain available.
- Old A client requests first-use lazy chunk after B: safe staging returns exact A bytes, never B bytes/HTML/404.
- The deliberately destructive fixture fails that old request, demonstrating the regression would recur without retention.
- Static-host configuration that lacks append-only/atomic semantics is documented as unsupported for this guarantee; no fallback claim of safe update behavior.
- Asset paths outside the allowed immutable namespace, path traversal or symlink-based escape: reject.

## Assumptions and open decisions

- **A1 — asset namespace.** Vite production chunks and other immutable hashed public assets live below `/assets/`; Architect must verify the actual output and explicitly decide whether any additional immutable paths are needed. HTML, `sw.js`, and other mutable entry points are not blindly retained as historical assets.
- **A2 — integrity primitive.** SHA-256 (or an equally deterministic existing repository primitive) is the preferred byte-equivalence check. Byte equality, not filename equality alone, defines safe idempotence.
- **A3 — filesystem atomicity.** Docker/local staging may use a release directory plus atomic rename/symlink swap or another method that provides the specified externally observable all-or-nothing behavior. Architect must document the exact supported filesystem assumptions and include a safe failure path.
- **A4 — static hosts.** Provider-specific adapters are not mandated. The durable contract must name the required capabilities. If a host only deploys by deleting/replacing the whole build, it is not a safe target for the update guarantee until it adds retained immutable asset support.
- **A5 — retention lifecycle.** Automatic garbage collection of old assets is out of scope for this emergency compatibility feature. Any future pruning needs a separate spec proving it cannot break live old clients; no unverified deletion mechanism may be introduced here.
- **A6 — tests.** The implementation may use a deterministic small fixture or generated builds, provided it exercises a truly cache-missing old lazy path and actual served bytes. Architect chooses the least brittle test level, but a pure source-text assertion is insufficient.
- **A7 — scope split.** This is a new prerequisite feature, not a mutable extension of feature 049. Its merge supports feature 049 but its own acceptance and final validation are independently required.

## Risks and mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| A destructive copy implementation exposes B shell before all B assets exist | New clients receive broken application | Stage and verify assets first; make shell switch atomic/equivalent; test incomplete-stage rejection |
| Same hash-like name is reused with changed bytes | Legacy client receives incompatible code | Treat byte mismatch as fatal immutable-path collision; no overwrite |
| Test masks real failure by precaching A lazy chunk | False confidence; production 404 persists | Explicitly assert old deferred chunk is absent from cache and is fetched from retained origin |
| Historical assets grow over time | Storage cost | Retention-first scope; future GC requires its own safe lifecycle spec |
| Docker behavior diverges from static host | Contract works only locally | Write shared deploy invariant; mark non-conforming hosts unsupported |
| Merge ordering with #215 is skipped | Its final update proof is stale | Record prerequisite/cycle ordering and require synchronization/retest before #215 final validation |

## Verification evidence required before merge

- Automated staging tests for equal-byte idempotence, byte-different collision, incomplete/missing asset rejection, path safety and shell-last failure preservation.
- Executable two-release A/B test proving old cache-miss lazy request resolves from retained origin to exact A bytes after B deployment.
- Executable destructive-deploy control test proving the old request fails without retention.
- Docker build/up smoke evidence on the current feature branch, using an isolated compose project/port so sibling services are untouched.
- Existing focused service-worker/build tests and appropriate `pnpm` quality preflight as specified by Architect; all required CI checks green on the PR head.
- Review evidence confirming no fixture cheats by prepopulating A's disputed lazy asset cache and no unsafe deletion/overwrite path exists.
- Docs evidence for the static-host and Docker deployment contract, including unsupported destructive hosting.
- After this PR merges: evidence that #215 was synchronized to the resulting main and had its affected update tests/review/final validation rerun.

## Role boundaries and handoff

- Analyst has created only this intake artifact and now returns control to Orchestrator.
- Architect must create `spec.md`, `plan.md`, and `tasks.md`; select the release-layout/staging API, define the authoritative inventory and digest model, formalize activation atomicity, list Docker/docs changes, assign test-first tasks, and record PR/cycle sequencing with #215.
- Implementation Agent may act only after full feature memory exists, in an Orchestrator-assigned isolated branch/worktree/PR. It must preserve sibling work and record test evidence, decisions, dead ends and feedback.
- Review Agent must independently inspect failure atomicity, immutable collision handling, real cache-miss semantics, destructive negative validity, Docker/static-host contract and feature-memory compliance. It does not edit files.
- Orchestrator must merge this prerequisite only after its own checks and Architect→Analyst final validation. It then synchronizes and reruns the necessary gates for PR #215 before considering #215 merge-ready.

## Initial cycle context

No PR exists yet for feature `051-asset-retention`. This Analyst handoff is the fresh isolated worktree and branch named above, from verified `origin/main` `2a92bcfcb7638d1094f33b28e4c2932fb2e4121e`. It may continue as the single feature-051 implementation slice only if Orchestrator explicitly assigns it after Architect planning; otherwise each new slice must start from a fresh verified-main worktree.

The known dependent PR is #215 (`codex/049-learning-priority-fresh-update`). It remains separate and must be preserved. Feature 051 is a merge prerequisite due to the retained-origin compatibility gap, after which #215 must be synchronized and revalidated rather than assumed still ready.

## Final Analyst Validation Notes

### Renewed combined-cycle validation after F054 return #6 — 2026-10-06

- Analyst validation pass: passed
- Final Analyst validation completed at: 2026-10-06T01:06:26Z
- Analyst validated effective content head: 7b0c355a6d24b260523011a5ac10b3c2621b457c
- Analyst return count: 0 / 5.
- Combined PR-set coverage: PR #217 contains the complete F051/F052/F053/F054
  delivery through F054 return #6. All behaviorally meaningful code, tests,
  docs, memory, review fixes, and dispositions are in the effective head above;
  later uncommitted changes are role-owned final-validation evidence only.
- Customer-intent validation: R051-1 through R051-8 remain satisfied in spirit
  and letter. Retained assets, byte immutability, shell-last activation, clean
  and legacy exports, real old-cache-miss continuity, destructive negative
  proof, Docker persistence, and static-host safety remain intact. Return #6
  strengthens rather than changes that contract: every reuse of pinned legacy
  authority revalidates its full root, marker, source identity/kind, canonical
  inventory, every listed asset identity/size/digest, absence of unlisted
  assets, and pointer/target identity.
- Drift and recovery validation: full tuple revalidation runs at locked
  admission, recovery entry, before and after durability, before activation,
  and before journal clear. Added/removed assets, changed bytes, marker,
  inventory, source-id, or source-kind fail closed while preserving A and the
  exact journal; restoring the original tuple permits unchanged retry to
  converge.
- Evidence: return-#6 controls passed 2/2, combined contracts passed 82/82,
  full preflight passed 675/675 Node tests plus production/service-worker builds
  and 158/158 Playwright tests, and isolated Docker lifecycle
  `cabadrive-retention-8328-1791248030088` passed. Guards and exact-head Review
  passed, and all technical threads are resolved.
- Process and sequencing: F052 remains closed at 10/10, F053 remains 0/10, and
  F054 passes within its limit at 6/10; Analyst return count remains 0/5. No
  unresolved task, feedback, finding, known issue, or customer-intent gap
  remains. Orchestrator must still guard and merge #217 before synchronizing,
  retesting, reviewing, revalidating, and merging #215.

The F054 return-#5 Analyst validation on
`4a687f788d1eed2e5dae8f3f7397e8ef8c765064`, and all earlier Analyst markers,
is historical and superseded for merge authority by this return-#6 validation.

### Renewed combined-cycle validation after F054 return #5 — 2026-10-06

- Analyst validation pass: passed
- Final Analyst validation completed at: 2026-10-06T00:41:13Z
- Analyst validated effective content head: 4a687f788d1eed2e5dae8f3f7397e8ef8c765064
- Analyst return count: 0 / 5.
- Combined PR-set coverage: PR #217 on branch `codex/051-asset-retention`
  contains the complete F051/F052/F053/F054 delivery through F054 returns
  #1–#5. All behaviorally meaningful code, tests, documentation, feature
  memory, review fixes, and dispositions are contained in the effective head
  above; later uncommitted changes present during this validation are
  role-owned final-validation evidence only.
- Customer-intent validation: R051-1 through R051-8 remain satisfied in spirit
  and letter. B activates only after exact serving output and physical export
  authority are durable; every authority read, recovery path, destination
  ownership proof, release generation, and terminal check fails closed on
  drift. Immutable A assets, byte collisions, real old-cache-miss continuity,
  clean and valid-legacy exports, invalid-legacy rejection, destructive
  negative proof, Docker persistence, and the static-host contract remain
  preserved.
- Final F054 hardening validation: transaction scratch/output survives fresh
  one-shot containers; exact retry is bound to operation, legacy identity,
  candidate, prior current, retained state, output, destination, journal,
  ownership nonce, and the actual no-replace-renamed inode. Candidate and all
  terminal authorities are revalidated under lock after durability work and
  immediately before activation or journal clear. Immutable generations allow
  sequential releases, while rootful/rootless ownership mapping uses a stable
  no-follow probe and preserves unprivileged cleanup without widening modes.
- Evidence: final preflight passed 673/673 Node tests plus production/service-
  worker builds and 158/158 Playwright tests. The return-#5 combined focused
  staging/static-host contract passed 80/80, and isolated Docker lifecycle
  `cabadrive-retention-97105-1791246610556` passed five fresh-container crash
  retries, sequential releases, ownership handoff, unprivileged cleanup, and
  scoped teardown. Exact-head Review passed and all technical threads are
  resolved.
- Process and sequencing: F052 remains closed/escalated at Architect return
  count 10/10, F053 remains 0/10, and F054 passes within its limit at 5/10;
  Analyst return count remains 0/5. No unresolved task, feedback, finding,
  accepted known issue, security exception, or customer-intent gap remains.
  PR #217 still requires the Orchestrator current-head evidence-only guard and
  merge before PR #215 is synchronized to resulting `main`, retested, reviewed,
  and independently revalidated as required by R051-8.

The F054 return-#1 Analyst validation for effective head
`f3f925c883b94327876a9f7c053917afdb56f777`, and every earlier Analyst marker,
is historical and superseded for merge authority by this return-#5 validation.

### Renewed combined-cycle validation after feature 054 — 2026-10-05

- Analyst validation pass: passed
- Final Analyst validation completed at: 2026-10-05T01:46:00Z
- Analyst validated effective content head: f3f925c883b94327876a9f7c053917afdb56f777
- Analyst return count: 0 / 5.
- Combined PR-set coverage: PR #217 on branch `codex/051-asset-retention`
  contains the complete F051/F052/F053/F054 delivery. All behaviorally
  meaningful code, tests, documentation, feature memory, review fixes, and
  dispositions are contained in the effective head above; later uncommitted
  changes present during this validation are role-owned final-validation
  evidence only.
- Customer-intent validation: R051-1 through R051-8 are satisfied in spirit and
  letter. Feature 054 closes all three post-limit blockers without weakening
  append-only asset retention, byte-collision safety, clean or valid-legacy
  export, real old-cache-miss continuity, destructive negative proof, or the
  Docker/static-host contract. A remains current until serving output and the
  physical export are durable; every injected pre-activation fault preserves A
  with no partial B activation. Marker reads are descriptor-bound, no-follow,
  nonblocking regular-file reads, and handoff `current` now distinguishes
  genuine absence, valid/present symlink, and forbidden non-symlink input.
- Recovery validation: the feature-054 return #1 regression uses a real valid
  legacy handoff and an `after-asset-rename` fault. It proves A remains current
  with both exact journals and durable output/export, then an identical request
  recovers the legacy-plus-candidate promotion, selects B, and clears both
  journals. Drifted or mismatched recovery cannot authorize activation.
- Evidence: F054 direct controls passed 4/4, the return #1 control passed 1/1,
  staging passed 58/58, combined contracts passed 105/105, full preflight
  passed 655/655 Node tests plus production build/service-worker generation and
  158/158 Playwright tests, and isolated Docker lifecycle
  `cabadrive-retention-10658-1791164306953` passed. Exact-head bounded Review
  passed without findings and every routed technical thread is resolved.
- Process and sequencing: F052 remains closed/escalated at Architect return
  count 10/10, F053 remains 0/10, and F054 passes at 1/10 with Analyst return
  count 0/5. No unresolved task, feedback, accepted known issue, security
  exception, or customer-intent gap remains. PR #217 must still pass the
  Orchestrator evidence-only current-head guard and merge before PR #215 is
  synchronized to resulting `main`, retested, reviewed, and independently
  revalidated as required by R051-8.

The final-return-#10 Analyst validation for effective head
`d4fd6d9ffb5c5c7442d6e728410abc3d91062472`, and every earlier Analyst marker,
is historical and superseded for merge authority by this combined F054
validation.

### Renewed combined-cycle validation — 2026-10-04 final return #10

- Analyst validation pass: passed
- Final Analyst validation completed at: 2026-10-04T10:10:23Z
- Analyst validated effective content head: d4fd6d9ffb5c5c7442d6e728410abc3d91062472
- Analyst return count: 0 / 5.
- Combined PR-set coverage: PR #217 on branch `codex/051-asset-retention`
  covers feature 051 asset retention, feature 052 Compose-project provenance,
  and feature 053 brace-expansion security refresh. All behaviorally meaningful
  content is contained in the effective head above; the later uncommitted
  changes present during this validation are role-owned final-validation
  evidence only.
- Customer-intent validation: R051-1 through R051-8 are satisfied in spirit and
  letter. Final return #10 preserves authoritative outgoing-runtime capture and
  legacy-aware append-only staging whenever a `current` entry exists, including
  dangling, wrong-type, or otherwise invalid entries that must fail closed. It
  also restores the intended clean/post-feature path: when capture confirms
  that no legacy pointer exists, candidate assets are safely committed and
  exported without inventing legacy authority. Supplied invalid legacy input
  still creates no state, publish output, or destination.
- Verification evidence: the direct R052-021 clean-no-pointer control passed
  1/1, combined focused contracts passed 101/101, full preflight passed 651/651
  Node tests plus production build/service-worker generation and 158/158
  Playwright tests, and isolated Docker lifecycle
  `cabadrive-retention-46613-1791042391648` passed. Exact-head bounded Review
  Agent inspection passed without findings and thread `r4173723121` is
  resolved.
- Process and sequencing: the complete combined cycle has no unresolved task,
  feedback, finding, accepted known issue, security exception, or
  customer-intent gap. F052 has completed R052-001 through R052-021 at its
  maximum Architect return count 10/10; F053 remains 0/10. No escalation is
  required because validation passes. PR #217 must still pass the Orchestrator
  current-head evidence-only guard and merge before PR #215 is synchronized,
  retested, reviewed, and independently revalidated as required by R051-8.

The return-#9 Analyst validation for effective head
`dbe850e8979a2595fa065a04a28c32661f8f4250`, and every earlier Analyst marker,
is stale and explicitly superseded by this final return-#10 validation.

### Renewed combined-cycle validation — 2026-10-03 return #9

- Analyst validation pass: passed
- Final Analyst validation completed at: 2026-10-03T15:29:53Z
- Analyst validated effective content head: dbe850e8979a2595fa065a04a28c32661f8f4250
- Analyst return count: 0 / 5.
- Combined PR-set coverage: PR #217 on branch `codex/051-asset-retention`
  covers feature 051 asset retention, feature 052 Compose-project provenance,
  and feature 053 brace-expansion security refresh. All behaviorally meaningful
  content is contained in the effective head above; the later uncommitted
  changes present during this validation are role-owned final-validation
  evidence only.
- Customer-intent validation: R051-1 through R051-8 remain satisfied in spirit
  and letter. Return #9 closes the final fresh-export gap by making the public
  export wrapper perform authoritative outgoing-runtime capture, requiring a
  validated legacy handoff, and staging its immutable historical assets before
  candidate publication/export. A missing or invalid handoff fails closed
  without creating output or a destination, while the deterministic valid
  empty-state regression proves `legacy-hash.js` reaches both committed retained
  state and the exported artifact.
- Verification evidence: the direct return control passed 1/1, combined focused
  contracts passed 101/101, full preflight passed 651/651 Node tests plus
  production build/service-worker generation and 158/158 Playwright tests, and
  isolated Docker lifecycle `cabadrive-retention-33337-1791040747514` passed.
  Exact-head bounded Review Agent inspection passed without findings and the
  prior export-bootstrap P1 is resolved.
- Process and sequencing: the complete combined cycle has no unresolved
  implementation feedback, technical finding, accepted known issue, or
  customer-intent gap. F052 is within its bound at Architect return count 9/10;
  F053 remains 0/10. PR #217 must still pass the Orchestrator current-head
  evidence-only guard and merge before PR #215 is synchronized, retested,
  reviewed, and independently revalidated as required by R051-8.

The return-#7 validation for effective head
`efaa9fe3d74f8d13d029286e6689fc46591f78b5`, and every earlier Analyst marker,
is stale and explicitly superseded by this return-#9 validation.

### Renewed combined-cycle validation — 2026-10-01 return #7

- Analyst validation pass: passed
- Final Analyst validation completed at: 2026-10-01T17:07:24Z
- Analyst validated effective content head: efaa9fe3d74f8d13d029286e6689fc46591f78b5
- Analyst return count: 0 / 5.
- Combined PR-set coverage: PR #217 on branch `codex/051-asset-retention`,
  covering feature 051 asset retention, feature 052 Compose-project provenance,
  and feature 053 brace-expansion security refresh. Current PR head equals this
  effective content head exactly; there is no post-effective delta.
- Customer-intent validation: R051-1 through R051-8 remain satisfied in spirit
  and letter. Return #7 closes the three bounded handoff/symlink gaps without
  weakening append-only immutable retention, byte/collision safety,
  fail-closed staging, shell-last activation, real old-cache-miss origin
  continuity, destructive-deploy negative proof, or Docker/static-host
  compatibility. The validated canonical release root is now pinned through
  inventory copy; release metadata is accepted only through a no-follow
  descriptor matching the same regular file; and `source-id`/`source-kind`
  publication cannot follow, truncate, or lose a no-replace race.
- Verification evidence: return controls passed 4/4, staging passed 55/55,
  combined capture/staging passed 89/89, full preflight passed 647/647 Node
  tests plus production build/service-worker generation and 158/158 Playwright
  tests, and isolated Docker validation passed. Exact-head Review Agent passed
  without findings, and the complete two-page thread guard resolved all return
  #7 threads with no new thread.
- Process and sequencing: R052-001 through R052-017 are complete at Architect
  return count 7/10; no unresolved task, finding, feedback, accepted known
  issue, or customer-intent gap remains. PR #217 must still merge before PR
  #215 is synchronized, retested, reviewed, and independently revalidated.

The 2026-10-01 validation for effective head
`5da4cc28a9a722c0b2880f98c07afaf03d5e9600`, and all earlier Analyst markers,
are stale and explicitly superseded because return #7 made later behaviorally
meaningful safety changes. This validation is current authority.

### Renewed combined-cycle validation — 2026-10-01

- Analyst validation pass: passed
- Final Analyst validation completed at: 2026-10-01T16:31:06Z
- Analyst validated effective content head: 5da4cc28a9a722c0b2880f98c07afaf03d5e9600
- Analyst return count: 0 / 5.
- Combined PR-set coverage: PR #217 on branch `codex/051-asset-retention`,
  covering feature 051 asset retention, feature 052 Compose-project provenance,
  and feature 053 brace-expansion security refresh. Current PR head and
  effective content head are the same exact commit; no post-effective delta
  exists.
- Customer-intent validation: the final combined result satisfies R051-1
  through R051-8 in spirit and letter. Existing evidence proves append-only
  immutable staging, byte-safe idempotence and collision rejection,
  path/symlink and incomplete-stage failure safety, shell-last activation, the
  real legacy cache-miss origin fallback with exact historical bytes, the
  destructive-deployment negative, and the Docker/static-host contract.
  Feature 052's final R052-013 correction also makes metadata-only retry
  durability explicit before current activation, including fail-closed
  metadata-file, metadata-directory, and state-directory barriers; this closes
  the single later gap without weakening any feature-051 invariant.
- Verification evidence: the R052-013 focused staging suite passed 52/52, full
  preflight passed 644/644 Node tests plus production build/service-worker
  generation and 158/158 Playwright tests, and the isolated Docker retention
  lifecycle passed and self-cleaned. Exact-head Review Agent passed with no
  finding, all five required GitHub checks are green, and the complete
  paginated thread guard is resolved with no new thread.
- Process and sequencing: all R052-001 through R052-013 dispositions are
  complete at Architect return count 6/10; no unresolved Implementation Agent
  feedback, accepted known issue, conflict, or customer-intent gap remains.
  PR #217 must still merge before PR #215 is synchronized to resulting `main`,
  retested, reviewed, and independently revalidated as required by R051-8.

The 2026-09-30 validation for effective head
`8f785ed08c16d2202867310f9ad4afab4f40dbdb` is stale and explicitly
superseded because R052-013 was a later behaviorally meaningful durability
fix. The validation above is the current Analyst authority.

### Renewed combined-cycle validation — 2026-09-30

- Analyst validation pass: passed
- Final Analyst validation completed at: 2026-09-30T17:05:35Z
- Analyst validated effective content head: 8f785ed08c16d2202867310f9ad4afab4f40dbdb
- Analyst return count: 0 / 5.
- Combined PR-set coverage: PR #217 on branch `codex/051-asset-retention`,
  covering feature 051 asset retention, feature 052 Compose-project provenance,
  and feature 053 brace-expansion security refresh. Current pre-validation-
  evidence head `19b0c9f8ab255dac9ba3c8f3a988e5626d184e27` differs from the effective
  content head only in feature-052/053 verification and process evidence; the
  uncommitted Architect PASS additions remain in those same Architect-owned
  `tasks.md` files.
- Customer-intent validation: the renewed combined result still satisfies
  R051-1 through R051-8 in spirit and letter. Recorded tests prove append-only
  immutable staging, equal-byte idempotence, collision/path/symlink and
  incomplete-stage fail-closed behavior, shell-last activation, a genuine old
  cache-miss lazy asset served with exact historical bytes after the new
  release, the destructive replacement negative, and the Docker/static-host
  deployment contract. Feature 052's durable discovered-project provenance
  closes the later Make-lifecycle split that could otherwise bypass that same
  retained release, without weakening explicit caller choice, clean-install
  fallback, ambiguity rejection, or safety containment.
- Regression and review evidence: the final combined focused suites passed
  85/85, full preflight passed 643/643 Node tests plus production build/service
  worker generation and 158/158 Playwright tests, and the isolated real Docker
  retained-asset lifecycle passed and self-cleaned. Exact-head Review Agent and
  native Codex review report no technical finding; no unresolved
  Implementation Agent feedback or accepted known issue remains.
- Sequencing remains mandatory: PR #217 must merge before dependent PR #215 is
  synchronized to the resulting `main`, retested, reviewed, and independently
  revalidated. This PASS does not authorize skipping that requirement.
- Merge-gate boundary: required `AI Review`, remaining validation-only thread
  resolution, exact-current-head required-check/conflict verification, and the
  Orchestrator current-head guard/finalizer remain mandatory. They are not
  waived by Analyst validation and do not represent a customer-intent gap in
  the validated effective content.

The earlier Analyst validation below applies only to historical effective head
`953709f0f12e3ac839c65c074908aef674b74bbd` and is superseded for merge
authority by the renewed combined-cycle validation above.

- Analyst validation pass: passed
- Final Analyst validation completed at: 2026-09-28T11:19:10Z
- Analyst validated effective content head: 953709f0f12e3ac839c65c074908aef674b74bbd
- Analyst return count: 0 / 5.
- Customer-intent validation: R051-1 through R051-8 are satisfied in spirit and
  letter by the recorded append-only staging, collision and fail-closed fault
  coverage, shell-last activation, real historical-worker cache-miss origin
  proof, destructive-deployment negative, Docker/static-host contract, and the
  preserved requirement that feature 051 merge before PR #215 is synchronized
  and independently revalidated. No customer-intent or product gap was found.


## Final Analyst Validation Notes

Analyst validation pass: passed
Final Analyst validation completed at: 2026-10-08T18:32:41Z
Analyst return count: 0 / 5
Analyst validated effective content head: 0a378d4e6be1d549dcc8a1fcd3dfe5c3d3c9f662
Analyst validation evidence: Orchestrator explicitly invoked renewed 051-asset-retention final acceptance after the same-head Architect pass at2026-10-08T18:30:22Z. Analyst inspected original customer intent/acceptance, integrated code/test/docs/dispositions, current canonical process records and actual raw finalpreflight/Docker evidence on committed effective0a378d4e6be1d549dcc8a1fcd3dfe5c3d3c9f662. This is a fresh integrated validation; prior dated originalfeature passes remain historical and do not authorize the new content.
Customer intent check: passed. OriginalR051-1–R051-8 are satisfied: immutable old/new asset union, same-path byte-collision rejection, complete fail-closed staging before shell activation, real old-worker cache-miss to exact retained-origin bytes, destructive-deploy negative, Docker/static-host retention and correct217-before215 sequencing. Running and stopped historicalA sources are migrated accurately; first install correctly lacks legacyA and never invents authority. Restart/down-up preserves current and retained bytes.
Analyst validation evidence: Integrated full preflight passes688/688 unit and164/164 desktop/mobile browser cases, including11hostile source-identity/retirement/fault/substitution/retry/protected-state controls, inherited six realHTTPfreshA/originB/defaultnegative/503atomic-offline controls, retained-origin and destructive-deploy negatives. Raw finalpreflight log SHA256f117e96bbf79052c07d241fdc568459c9601e96b02a1b8450e9fcfa0cb7e6f46 and actualDocker log SHA25629ebc263b5d904b9da9a88c7a2ea2d6a5c8f652e0cc80a040d4b4b55fe0c68e1 independently recomputed; no incomplete preliminary run is counted.
Analyst validation evidence: Actual DockerNode22 lifecycle on isolated5197 projectcabadrive-retention-15496-1791483535389 and derived running/stopped/initial projects proves exact legacyA bytes, current shell/worker, persistence and sibling sentinel preservation. Real kernel-lock/killed-publisher/new-process retry and A/B/C/D publication exerciseC-retirement-unlink fault thenD convergence with exactly two protected generation links/two trees/no retirement journal. Twenty-seven inspected HTTP responses across three installations have all five exact security headers including200/404, current+retained immutable assets, stable86400/SWR604800 content, SWno-cache, no long-lived shell/error cache, gzip and actual nginxmaster/runtimeUID101. Host exports are removable without privilege and own runner resources are cleaned while siblings survive.
Analyst validation evidence: Frozen lock is byte-identical to verified214 mergedmain1e3507e2363314340eed43c0d77dd3d0acbc92cf, SHA256100de609ab9ff12d49d738a8f99e62ea57c09f12502721be38f2f1267d496db3. Thus the independently verified fullOSVv2.3.5 graph241packages/zero findings applies to exactly the same dependency bytes, including both safe brace lines and source-map-js1.2.2. This supports acceptance without replacing217's mandatory exact-current-head remoteOSV gate.
Gaps, if any: none remaining in the scoped originalfeature engineering/customer outcome. Preserve authentic Architect counts05110/10,05210/10,0530/10,0546/10 and this feature's Analyst0/5. Historical original051/052 exhausted budgets remain exhausted; later052/054/055 ownership does not reset them or invent an extra old-cycle return. Current055R1/R2/R3/R2a/R2b findings are explicitly resolved without accepted defective behavior.
Architect disposition routing: Latest same-head Architect pass for 051-asset-retention retains return10 / 10 and no open engineering dispositions. Current canonical acceptance/currentmemory/feedback are true and accepted-known-issue-decision-pending false; all scoped feedback is disposed.
Analyst validation evidence: This pass covers sole combined original051/052/053/054 PR217 implementation on effective0a378d4e6be1d549dcc8a1fcd3dfe5c3d3c9f662. Actual214 merge is a verified prerequisite, not a claimed217 result.055 cumulative final validation and downstream215 remain excluded until terminal215 integration following verified217 merge. Orchestrator must still validate the exact published head and allowed eight-role-file evidence union, all five required checks, complete paginated native/independent review, resolved conversations, conflicts/current-head guard, finalizer dry run and actual GitHub squash merge. No current remote-green,217 merge,215 completion or055 cumulative pass is asserted here.


## Final Analyst Validation Notes

Analyst validation pass: passed
Final Analyst validation completed at: 2026-10-08T19:07:38Z
Analyst return count: 0 / 5
Analyst validated effective content head: 356c9c03b0d46cf5e8215d397d8b5a5d57624b96
Analyst validation evidence: Explicit Orchestrator invocation follows exact-current-content independent Review PASS and all-four Architect PASS at2026-10-08T19:05:42Z on the same committed effective content head. Analyst inspected current original 051-asset-retention acceptance and the full0a..356 substantive runtime/test/docs/process delta, raw before/afterLinux telemetry and renewed verification. Earlier0a/aca role/CI passes remain historical and superseded for this merge authority.
Customer intent check: passed. OriginalR051-1–R051-8 remain satisfied: exact immutable old/new union, collision rejection, fail-closed complete staging/shell-last activation, authentic old-cache-miss to retained-origin bytes and destructive negative, persistent Docker/static-host contract, legacy running/stopped adoption and217-before215 sequencing.
Analyst validation evidence: C055-217-R2c repairs an actual production authority gap. LinuxNode20 telemetry shows active/rollback symlinks recreated with the same reused inode but changedctimeNs/birthtimeNs were accepted by oldschema1; the fixed production verifier rejects those exact same-inode replacements. Schema2 requires canonical exact bigint generation strings on current/protected/retiring symlinks plus device/inode/target and rechecks them at destructive/callback/journal-clear boundaries. Missing/malformed fields and oldschema1 fail closed without mutation; mutable tree-directory timestamps remain unpinned for legitimate partial cleanup. Documented platform-dependent timestamp precision is not falsely described as universally unique.
Analyst validation evidence: Original immediate ABA controls remain, deterministic retained-original-inode controls supplement them,64bad-generation/schema controls and12callback/partial/clear substitutions fail closed; untouched/partial retry and interruptedC-beforeD convergence still succeed. Full hostile safety13/13 passes independently on actualLinuxNode20 and bundledNode24 with zero skips, and final fullpreflight passes690/690unit plus164/164browser scenarios. Raw logs SHA256Linux1fe53949e94815138a86f4465a8ef7e1e7ddb07559d9e6cdebabcddeeca3fc30, hostb2d5bd1e65dc644933fcc10f7dea85ee31edd39dd12ec0104a34499ef3b52c38 and preflighta349a93a72ac4af94de9d4acd5ced3c227db9ced903d0e13dee1735b7c11165a independently recomputed. No sleep, skip, relaxed test or test-only dismissal substitutes for the production repair.
Analyst validation evidence: Rebuilt actualDockerNode22 projectcabadrive-retention-21212-1791485551007 on5197 verifies running/stopped/initial migration, exact retainedA/currentBworker, restart/down-up, clean404 and sibling isolation, real kernel lock/killed-publisher/new-container retry, schema2 interruptedC→D exactlytwo protectedlinks/twotrees/nojournal and removable host export. Twenty-seven actual responses preserve exact five security headers on200/404, correct current+retained/stable/SW/shell/error caching, gzip and nginxmaster/runtimeUID101. Raw Docker log SHA25607a31d529bb4ac98e9f743d9685019d4d92e47e363a7fa782353aaf0f2f20ed8 recomputed; lock remains identical214main SHA256100de609ab9ff12d49d738a8f99e62ea57c09f12502721be38f2f1267d496db3, supporting241/0OSV without replacing exact-new-head remote scan.
Gaps, if any: none in current scoped customer/engineering acceptance. Preserve originalArchitect05110/10,05210/10,0530/10,0546/10 and eachAnalyst0/5. New055 owns the authentic R2c Architectreturn1/10; this validation does not reset budgets or invent an extra originalfeature return. Latest same-head Architect notes have no open engineering dispositions, and current canonical acceptance/memory/feedback remain true with no undisposed accepted known issue.
Architect disposition routing: C055-217-R2c production fix and renewed Linux/host/Docker evidence are explicitly resolved. ExistingR1/R2/R3/R2a/R2b and originalfeature dispositions remain closed; no accepted defective behavior or unresolved owner-risk decision remains.
Analyst validation evidence: Scope remains sole combined original051–054 PR217 on effective356c9c03b0d46cf5e8215d397d8b5a5d57624b96. Verified214 merge is its prerequisite;215 and cumulative055 terminal validation remain downstream. Orchestrator must still prove the exact published-head/eight-role-file evidence union, all five required remote gates, complete paginated native/independent review, resolved conversations, conflicts/current-head guard, finalizer dry run and actual GitHub squash merge. No217merged/current-remote-green/215complete/055cumulativePASS is claimed by this role note.
