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

Append-only Analyst-owned section. It is intentionally empty until Orchestrator requests final Analyst validation after final Architect validation passes.
