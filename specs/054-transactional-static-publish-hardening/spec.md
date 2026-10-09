# Specification: Transactional static-publish and legacy-handoff hardening

## Cycle Context

- Feature: `054-transactional-static-publish-hardening`.
- Stacked base: PR #217 head `5e5f4ef40336fc7bff2c400b6301d99fbc9479c1`.
- Branch/worktree: `codex/051-asset-retention` / `/Users/chap/devel/cabadrive-worktrees/051-asset-retention`.
- Delivery: one bounded feature-054 slice contributing to existing PR #217.
- Fallback: Orchestrator explicitly retained the existing PR-only dependency worktree because the affected export/handoff implementation is not on `main`. This exception is limited to feature 054 and does not weaken latest-main startup for independent work.
- Feature 052 remains at its maximum Architect return count `10 / 10`; these findings are a new cycle, never return #11. Preserve its post-limit disposition and all parallel state.

## Goal

Make static publish/export one fail-closed transaction whose externally visible output becomes durable before candidate B can become `current`, while treating the legacy marker and handoff `current` as no-follow authority-bearing filesystem objects with exact type and identity semantics.

## Scope

### In scope

- Correct only `r4173773102`, `r4173773104`, and `r4173872733`.
- Refactor the existing static publish/export coordinator and journal only as required to delay B activation until the serving output and requested physical export are complete and durable.
- Bind retries to candidate, output, destination, retained state, prior current A, legacy request, inventory, and transaction identity.
- Read the legacy marker through a no-follow regular-file descriptor, rejecting unsafe type or identity substitution before mutation.
- Distinguish handoff `current` as genuinely absent, present symlink, or present non-symlink; pin a stable validated symlink target for downstream use.
- Add deterministic fault, type, identity-substitution, and retry regressions plus the required docs and process memory.

### Out of scope

- Unrelated staging, Compose discovery, dependency, learner, service-worker UX, content, backend, garbage collection, or PR #215 work.
- Broad historical audit, new deployment providers, security suppression, or weakening review/check/final-validation gates.
- A feature-052 return, task, or implementation disposition.

## Transaction State Machine

The static export operation runs under one project-scoped release-state lock and one exact durable transaction journal.

1. **Prior authority validated.** Capture prior current A (or verified empty initial state), its committed tuple, retained inventory, candidate B manifest, legacy request, serving-output path, physical destination, and transaction ID. Any existing pending transaction must match all fields exactly.
2. **B prepared, not activated.** Prepare immutable B release/asset evidence needed to construct output without changing `current` or advertising a new retained ledger. Any recovery artifact remains journal-owned and unreferenced.
3. **Serving output durable.** Copy and digest-verify the exact cumulative B tree in a unique sibling, sync every file/tree boundary, publish it with no-replace semantics, sync the output parent, and durably advance the journal. A complete directory alone is never authority.
4. **Physical export durable.** Copy from the exact journal-bound serving output into a unique destination sibling, verify the complete inventory, sync it, publish destination no-replace, sync its parent, and durably record `export-durable`.
5. **B committed and activated.** Only after both output durability barriers succeed may retained state/release metadata become authoritative and `makeCurrent` select B. Activation retains its existing atomic rollback behavior; any activation failure restores A.
6. **Transaction cleared.** Clear the journal only after B's full committed tuple and both outputs revalidate. Repeat the corresponding durability barrier before accepting any already-visible artifact during recovery.

### Transaction invariants

- A remains selected through phases 1–4.
- A's committed tuple remains valid; pre-activation additions are unreferenced, journal-owned recovery evidence and cannot be treated as current authority.
- Every copy, digest, sync, phase publication, output rename/no-replace, output-parent sync, destination rename/no-replace, destination-parent sync, and pre-activation boundary is fault-injectable.
- An exact retry may continue only if A/current, candidate, legacy request, retained state, journal, serving output, destination, and inventories still match. Drift, missing/extra entries, foreign occupancy, path escape, symlink, or request mismatch fails unchanged.
- A complete output or destination without the exact durable journal phase cannot activate B.
- No failure exposes a partial serving output, partial physical destination, or partial B activation.

## Authority Interfaces

### Legacy marker

- Open the marker with no-follow and nonblocking semantics supported by the Docker/Linux runtime.
- Use descriptor metadata to require a regular file before reading; read bytes from that same descriptor and optionally recheck descriptor identity/metadata before accepting them.
- Never perform a pathname read after classification. Symlink, dangling symlink, FIFO, directory, socket, device, unreadable object, or substituted identity fails before retained-state, output, destination, or current mutation.
- FIFO rejection must terminate promptly without waiting for a writer.

### Handoff `current`

- Use no-follow metadata; followed-path existence is not classification.
- Genuinely absent means the verified clean/post-feature no-legacy path.
- A present symlink is read and identity-revalidated, and its exact target is pinned for downstream validation/use. A valid contained target may authorize legacy input; a dangling or invalid target remains present and is rejected strictly, never converted to absence.
- A present regular file, directory, FIFO, socket, device, or other non-symlink is fatal before a mutating Docker/stager path.
- Replacement between classification and use must either leave the exact pinned object in use or fail closed. External targets and sibling state remain unchanged.

## Functional Requirements

1. **FR-054-1 — activation last.** B cannot become current until both the exact serving output and requested physical export are completely published and durable.
2. **FR-054-2 — A preserved on fault.** Every pre-activation fault returns nonzero with A selected, its committed tuple valid, no partial destination, and no B activation.
3. **FR-054-3 — exact recovery.** Journal phases bind prior A, candidate B, legacy request, state/inventories, paths, outputs, and transaction identity. Recovery repeats durability barriers and rejects all drift.
4. **FR-054-4 — marker descriptor binding.** Marker classification and read use one no-follow regular-file descriptor or an equally strong primitive; no pathname check/read race remains.
5. **FR-054-5 — current three-way boundary.** Absent, symlink, and non-symlink are distinct outcomes. Dangling symlink is present and rejected downstream.
6. **FR-054-6 — race safety.** Deterministic marker/current substitutions never cause the replacement to be followed or trusted.
7. **FR-054-7 — preservation.** Clean export, valid-legacy export, append-only assets, collision rejection, Compose provenance, Docker lifecycle, feature-053 lock graph, and PR #217-before-#215 sequencing remain intact.
8. **FR-054-8 — exact-head completion.** Focused/full/Docker checks, bounded review, complete thread disposition, final Architect then Analyst validation, and current-head guard are renewed for the combined PR.

## Acceptance Criteria

- **AC-1:** Operation trace proves serving-output rename and parent durability, then physical-export rename and parent durability, then B current activation.
- **AC-2:** Fault matrix covers copy, verification, file/tree sync, journal phase, no-replace publication, parent sync, and pre-activation boundaries; each failure preserves A and exposes no partial artifact/activation.
- **AC-3:** Exact recovery accepts only unchanged journal-bound state/output/destination and rejects B/C drift, foreign entries, changed A, changed request, and altered artifacts without mutation.
- **AC-4:** Marker matrix proves regular-file success and prompt fail-closed rejection for symlink, dangling symlink, FIFO, directory, special/wrong type, unreadable object, and identity substitution.
- **AC-5:** Current matrix proves absent clean success, valid symlink success, dangling strict rejection, regular file/directory/other-type rejection, and substitution safety.
- **AC-6:** External and sibling sentinels remain byte-identical in every negative case.
- **AC-7:** Relevant focused and combined contracts, `pnpm run preflight`, and isolated real Docker lifecycle pass on the implementation head.
- **AC-8:** Exact-head review has no unresolved blocking finding; all required GitHub checks are green, PR #217 is conflict-free, and feature memory is current.
- **AC-9:** Renewed Architect validation precedes renewed Analyst validation on one effective content head; any later commit is proven evidence-only before merge.

## Architectural Decisions

- **AD-054-1 — one coordinator and lock.** `publish-export` must not compose independently committing stage/publish/export calls. It coordinates preparation, two durable publications, and activation under one lock/journal.
- **AD-054-2 — extend existing primitives.** Reuse current unique siblings, no-replace publication, sync helpers, rollback-capable `makeCurrent`, and journal validation. Do not introduce a second transaction system.
- **AD-054-3 — activation is the commit point.** Visible complete outputs may exist as exact journal-owned recovery evidence, but B authority begins only at final current activation.
- **AD-054-4 — descriptor read for marker.** On Docker/Linux use `O_NOFOLLOW | O_NONBLOCK`, `fstat`, and descriptor read. Tests may inject equivalent adapters where the host differs.
- **AD-054-5 — pin the symlink target.** Perform authoritative no-follow symlink classification and identity-stable target capture inside the stager boundary, then validate/use the pinned target rather than re-resolving mutable `current`.
- **AD-054-6 — bounded documentation.** Update only static-export/runtime documentation whose command or transaction description changes.

## Evidence Locations

- Implementation decisions, test-first results, fault/type matrices, cycle PR set, feedback, known issues, checks, and final Architect evidence: `tasks.md`.
- Final Analyst validation: Analyst-owned `feature-request.md`, only after Architect passes.


## Current055 R2j publication authority clarification

Release content identity is distinct from publication transaction identity. Durable created-generation lineage, not filesystem timestamp or prefix, selects the active/immediately previous publication and only owned retirement candidates. Exact same-request retry is idempotent; repeated content/new destination creates a fresh transaction. Unknown artifacts and protection-only legacy bootstrap remain outside destructive ownership. Valid ordinary runtime staging and fresh export compose through independent published/current authority; outstanding coordinator/retirement/tombstone work blocks direct-stage mutation while valid standalone-publish FR021 controls remain intact. Current engineering evidence and future ordered-role gates are recorded in055 and the original tasks without resetting historical budgets.
