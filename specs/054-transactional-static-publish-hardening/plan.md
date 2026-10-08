# Implementation Plan: Transactional static-publish and legacy-handoff hardening

## Delivery Shape

- Existing stacked slice: branch `codex/051-asset-retention`, PR #217, worktree `/Users/chap/devel/cabadrive-worktrees/051-asset-retention`.
- Recorded stacked base: `5e5f4ef40336fc7bff2c400b6301d99fbc9479c1`.
- Expected implementation surface: `scripts/stage-static-release.mjs`, `scripts/export-static-release.sh` only if host triage remains necessary, focused staging/export/Docker tests, narrowly affected deployment docs, and feature-054 memory.
- Preserve the uncommitted F052 post-limit disposition, Analyst intake, sibling changes, and all external branch/PR state. Stage only assigned files.

## Phase 1 — Test-First Baselines

1. Confirm branch/worktree/head, dirty-file ownership, stacked-base relation, and allowed file boundary.
2. Archive or otherwise isolate the assigned pre-fix behavior for negative-baseline runs without touching sibling work.
3. Add a transaction-order test with current A, candidate B, serving output, and physical destination. Assert the existing path selects B before a later destination-publication fault.
4. Add marker controls proving the existing pathname read follows a readable symlink and can block on a FIFO; use bounded subprocess/injected adapters so the suite cannot hang.
5. Add current controls proving regular directory/file acceptance and dangling-symlink classification behavior, plus deterministic substitution between classification and use.
6. Record exact failing commands/results before implementation.

## Phase 2 — One Transaction Coordinator

1. Refactor the existing stage/publish/export internals into preparation, publication, and activation operations callable while one project-scoped lock remains held. Avoid nested independent commits.
2. Extend the existing publish journal rather than adding a parallel journal. Bind it to:
   - schema/transaction ID and exact request paths;
   - prior current A or verified empty state;
   - candidate B manifest/release ID and legacy request;
   - prior and expected retained inventories;
   - serving-output inventory/path and physical destination inventory/path; and
   - explicit durable phases through `prepared`, `output-durable`, `export-durable`, and activation/clear.
3. Prepare B and journal-owned immutable evidence without changing `current` or publishing a new authoritative retained tuple.
4. Publish and durably sync the serving output, then publish and durably sync the physical destination. Revalidate exact journal relations after every already-visible crash boundary.
5. Only after `export-durable`, commit the retained/release tuple and invoke rollback-capable `makeCurrent` for B. Clear the journal after the complete committed tuple and outputs revalidate.
6. Keep idempotent completed-output behavior, no-replace destination semantics, and clean/legacy export success.

## Phase 3 — Fault And Recovery Matrix

Inject deterministic faults at every directly relevant boundary:

- serving/destination copy and digest verification;
- nested file/tree sync and close;
- transaction journal write/rename/directory sync;
- serving-output and physical-destination reservation/rename/no-replace;
- serving-output and destination parent sync;
- phase transition before/after durability; and
- immediately before and during current activation.

For every pre-activation failure prove nonzero exit, A still current, prior tuple valid, no partial public tree/destination, no B activation, and only exact contained journal-owned recovery evidence. Then prove unchanged retry succeeds and changed A/B/C/request/output/destination/journal/inventory fails unchanged.

## Phase 4 — Marker And Current Authority

1. Add a reusable descriptor-bound JSON reader for authority files. Open the marker no-follow/nonblocking, require descriptor `fstat` regular-file type, read from that descriptor, and reject read/metadata/identity failures.
2. Replace marker pathname read in `verifyLegacyHandoff`; preserve canonical manifest comparison and strict invalid-handoff result.
3. Add an authoritative `current` classifier at the stager boundary:
   - no entry: verified clean/no-legacy result;
   - symlink: capture and identity-revalidate its link target, then resolve/validate that pinned target;
   - any non-symlink: fail before mutation.
4. Keep lightweight host-shell triage only if needed for argument construction; stager classification remains authoritative. Never use followed-path `-e` alone to decide absence.
5. Exercise stable and substitution-race matrices for marker/current. Verify FIFO prompt termination, dangling strict rejection, and untouched external/sibling sentinels.

## Phase 5 — Documentation And Local Verification

1. Update only the static-export/Docker runtime docs needed to state output-before-activation ordering, exact retry behavior, and absent/symlink/non-symlink handoff semantics.
2. Run shell syntax and focused staging/export/capture/static-host tests.
3. Run typecheck, lint, format check, quality-fast, feature-memory/repository guards, and `git diff --check`.
4. Run full `pnpm run preflight` on the final implementation content.
5. Run the isolated real Docker lifecycle with a unique project/port and scoped teardown.
6. Record exact operation traces, fault/type matrices, changed-file/diff audit, dead ends, decisions, known issues, and Implementation Agent feedback in `tasks.md`.

## Phase 6 — Review, Validation, And Merge Gates

1. Review Agent inspects only the bounded feature-054 diff: transaction order/recovery, no-follow descriptor binding, current identity pinning, regressions, docs, and process compliance.
2. Orchestrator enumerates all native review pages/threads and routes each finding or Implementation Agent feedback item for Architect disposition.
3. Establish one renewed effective content head containing implementation, tests, docs, feature memory, and all follow-up fixes/dispositions.
4. Require all configured checks green, complete no-blocker review/thread state, conflict-free PR #217, and current acceptance evidence.
5. Orchestrator invokes final Architect validation across the combined F051/F052/F053/F054 cycle, then final Analyst validation on the same effective head.
6. Perform the evidence-only current-head guard and conservative expected-head finalization. If a helper cannot enumerate the long review history, complete paginated read-only guards remain mandatory before the authorized manual squash path.

## Verification Matrix

| Boundary | Evidence | Pass condition |
|---|---|---|
| Ordering | exact operation trace | output durable < export durable < B current |
| Fault rollback | per-boundary injection matrix | A valid/current; no partial public artifact or B activation |
| Recovery | exact retry and drift matrix | unchanged resumes; any relation drift fails unchanged |
| Marker | descriptor/type/race matrix | same no-follow regular file read; unsafe types reject promptly |
| Current | absent/symlink/non-symlink/race matrix | exact three-way result; dangling rejects downstream |
| Preservation | clean + valid/invalid legacy controls | existing retention/provenance/export contracts remain green |
| Focused quality | targeted and combined suites | all green on implementation head |
| Full quality | `pnpm run preflight` | all phases green |
| Docker | isolated lifecycle | pass with scoped cleanup |
| Review/GitHub | exact-head review and required checks | blocker-free, green, conflict-free |
| Validation | role markers/current-head guard | Architect then Analyst same head; later delta evidence-only |

## Stop Conditions

- A proposed fix activates B before both durability barriers, trusts a complete output without exact journal authority, or weakens A rollback.
- Marker validation uses a pathname read after classification or may block on special files.
- `current` classification collapses dangling symlink into absence or accepts a non-symlink.
- A race test can cause a replacement object to be consumed.
- Implementation requires unrelated behavior or mutating sibling state; return evidence to Orchestrator/Architect instead of broadening scope.

## Architect disposition: paginated completion-cycle055 findings (2026-10-08)

Complete pagination is authoritative: PR #217 has160 review threads, with8 unresolved at discovery (5 ordered-validation conversations and3 current technical findings). The earlier100-thread checkpoint is partial historical evidence. No historical role pass authorizes these new fixes. New055 owns this bounded combined follow-up; retain F052 at10/10 and F054's historical6/10 rather than creating an implicit old-cycle return.

- C055-217-R1 / r4190414768: accepted task. Classify an existing selected container by its immutable runtime image's exact release-state-runtime label, using inspected image identity rather than a mutable image tag or container ID. An unlabeled genuine legacy container retains exact expected source-id/source-kind matching and baked-root capture. A labeled post-feature container is not a legacy source: after release-state rejection, permit only an independently descriptor-validated complete legacy handoff with its original pre-feature identity; never compare that identity to the post-feature container ID, copy absent baked assets, re-import rejected `/state`, or convert failed classification/verification into clean install. Prove valid handoff recovery and rejection of absent, incomplete, wrong-type, corrupt and substituted handoffs; unchanged foreign/state sentinels and no Docker build/capture on rejected authority.
- C055-217-R2 / r4190542902: accepted task. Retirement requires durable, exact authority before unlinking an old generation output. Extend current transaction journal/primitives with one bounded retirement record binding generation root, logical output, exact output-link identity/target, exact contained target tree identity/inventory, and protected active/rollback selection. Persist/fsync that record before unlink; retain it across unlink, parent-sync, tree deletion and final parent-sync failures. On retry, revalidate authority and protected paths, finish only that exact journal-known target, repeat durability barriers and clear the record durably only after safe completion. Never scan unreferenced trees for pruning or delete a substituted/foreign/active/rollback target. Test failures before/after each journal, unlink, sync and removal boundary, partial removal retry, substitution and sibling preservation. Active and immediate rollback generations always survive.
- C055-217-R3 / r4190564538: accepted task. Move expected source-id/source-kind comparison into the no-follow descriptor-bound Node handoff verifier/pinned-current boundary. Successful verification and identity comparison must use the same validated manifest/authority; remove shell pathname `cat` rereads. Preserve exact expected identity for genuine legacy capture, and full independent authority for the labeled post-feature recovery branch. Test source-id and source-kind symlink, dangling link, FIFO, wrong type and substitutions between classification/verification/use; negatives terminate promptly, make no mutation and preserve external sentinels.

Run the focused capture/provenance/staging/export fault suites and combined tests before publication; consolidate all3 fixes then obtain full preflight, isolated real Docker lifecycle and post214 integration/header smoke. Review includes all pages and exact effective content. The5 validation conversations remain pending until renewed same-SHA Architect then Analyst evidence and current-head guard are proven; technical resolution requires substantive regression evidence.

## Architect refinement: C055-217-R2 continuation and pinned authority

- C055-217-R2a: accepted bounded task. Under the existing project transaction lock, resume an interrupted C retirement before admitting, publishing or activating a different D transaction. Validate that authoritative current state still identifies recorded C and that exact protected C/B output/target identities remain intact. Complete the journal-known C cleanup and durability, then proceed with D. A C-interruption→D regression must converge without committing D then stranding C authority. Changed current release, project/domain, output or protected topology fails unchanged before the next publication; never reinterpret an old journal after new activation.
- C055-217-R2b: accepted bounded task. Pin retirement journal authority to a no-follow/nonblocking regular-file descriptor, exact inode and exact bytes. Fsync that descriptor; do not use a following pathname sync after one-time validation. Revalidate path-to-descriptor identity and byte authority at injected durability callbacks, before each destructive output/tree-entry operation and before journal clear. Replacement or mutation fails closed, preserving the replacement authority and remaining target. Cover substitutions after journal-durable, after unlink-durable, during partial-tree removal and before clear, including wrong-type/FIFO prompt failure. A stale in-memory record never authorizes deletion or clearing a replacement.

Both refinements are within055's original bounded retirement recovery/authority contract, not a scope expansion or another historical052/054 return. Consolidate them with the existing R2 fault matrix before publishing fixes; run focused and combined verification and preserve active/rollback/sibling sentinels.


## Completion-cycle055 Integrated Validation Preparation

Verified214 main1e3507e2363314340eed43c0d77dd3d0acbc92cf is the prerequisite for current217. Preserve both runtime contracts: one server-level cache/header map and unprivileged nginx/gzip from214;217 persistent/state-current/retained-alias/provenance/transaction behavior. New055 owns R1/R2/R3 and R2a/R2b; all original return counts and post-limit histories remain intact. Consolidate fullpreflight, fullOSV/frozen graph and isolated retainedA/B Docker lifecycle plus live root/SW/current+retained assets/content/404 headers/cache/gzip/nonroot evidence. Complete exact-head Review and canonical process preparation precede final content SHA. Then all included051/052/053/054 receive chronological Architect-before-Analyst passes on that same SHA; union evidence checks reuse existing guards per feature without weakening gates. Live full-pagination checks/conversations/conflicts and expected-head finalization precede217 merge.215 and cumulative055 final closure are downstream; this preparation asserts no final pass or merge.


## Architect disposition: C055-217-R2d descriptor-bound hashing and adoption

Accepted two genuine current nativeP2 findings on published8c5: PRRT_kwDOSX65IM6qhA18 targets sha256() mixing bytes read from an opened descriptor with before/after pathname stat, allowing a replaced pathname to certify different bytes; PRRT_kwDOSX65IM6qhA2L targets adopted-project lstat→pathname read/fsync, allowing symlink/FIFO/substitution after the check. These violate existing exact committed-state and no-follow durable Compose-adoption guarantees. New055 owns bounded real Architect return2/10; original05110/05210/0530/0546 and Analyst0 remain unchanged. No historical role/check checkpoint authorizes changed content.

- Hash regular files through one O_NOFOLLOW|O_NONBLOCK descriptor. Validate regular descriptor type via fstat, bind no-follow pathname identity to that descriptor before reading, derive size/hash from its bytes and descriptor metadata, then prove descriptor metadata/size/generation stability plus pathname-to-descriptor identity after reading. A replacement between open and first metadata, while reading or before final admission rejects; never combine old descriptor bytes with new pathname metadata. Preserve complete-ledger/collision/current-state verification semantics and prompt nonregular/FIFO rejection.
- Adopted-project verification pins one no-follow/nonblocking regular descriptor, exact identity and validated bytes within the verified handoff-root authority. Parse/read/fsync that same descriptor; revalidate path-to-descriptor and bytes/root authority across durability callbacks and final parent barrier before returning project authority. Do not reopen a checked pathname in syncFile. Existing adoption write/claim/rename retry must preserve atomic unchanged-project selection and reject substitution without reading/writing/fsyncing foreign files or hanging.
- Preventively audit remaining equivalent lstat→pathname read/open/fsync/hash paths in staging/capture/export/provenance helpers, including adopted temporary verification and generic syncFile callers. Reuse existing pinned primitives where appropriate, harden directly equivalent authority races in this same consolidation, and map every audited authority helper to its pinning/type/identity/callback proof or a concrete not-needed disposition. Diagnostic-only /proc reads are not deployment authority. No dependencies, broad schema rewrite, unrelated runtime behavior or gate changes.
- Add deterministic open→metadata and read/fsync callback substitutions covering symlink, FIFO, wrong type and replacement regular files with different bytes; prove prompt rejection, unchanged foreign files, unchanged committed/project authority and no false hash/adoption acceptance. Preserve valid same-authority hashing, adoption interrupted-publication retry, retained generation/partial-removal/C→D and all prior fault controls. Native findings require executable regression evidence, not lstat-only inspection or relaxed tests.
- Consolidate all audit findings before verification/publication: focused affected authority/provenance/fault suites on supported host and Linux20, complete supported preflight, rebuilt real DockerNode22 retained/migration/adoption/retirement/header/UID lifecycle. The graph/app/SW are unchanged unless a concrete scoped discovery requires disposition; prior fullOSV identity carries only unchanged graph, while new exact-head remoteOSV/all five gates remain mandatory. Then new content preparation/commit, exact independent Review, allfour renewed Architect then Analyst on one effectiveSHA and strict evidence-only/current-head/full-pagination finalization. No merge until both native threads and all normal gates close.


### C055-217-R2d adopted-project claim refinement

Independent Review confirms the existing onBeforeAdoptedProjectClaim callback follows temporary validation/sync and descriptor closure. Accepted same-family task: pin the created temporary no-follow regular descriptor, exact identity and intended project bytes across that callback, hard-link claim and parent durability barrier; verify the final claimed record refers to that exact authority before returning success. A replaced temp link/FIFO/regular different-project file must not become durable adopted authority or return the original project. Preserve existing record and foreign sentinels and test the hostile callback deterministically. Merely swapping pathname readFile for a one-time readAuthorityFile does not cover claim-time substitution. Sharedsha256 correction covers candidate, legacy, retained, exported and retirement inventories without weakening their comparisons.


### C055-217-R2d export ownership refinement

Accepted independent Review's concrete handBackTreeOwnership lstat→onBeforeOwnershipChange→lchown(path) gap: a foreign replacement can receive changed uid/gid before the later identity error. This is the existing no-foreign-mutation/export-owner contract and stays within R2d preventive consolidation, without another return. For the already-required regular files/directories, bind a no-follow/nonblocking descriptor/type/root/path identity before callback, revalidate before mutation and perform ownership handback on that same descriptor (fchown), then validate descriptor ownership and path identity and fsync the pinned object. Preserve recursive order, ownerAuthority and documented Docker/userns opaque mapping; deliberate chown changes metadata, so do not compare unchanged ctime after the authorized operation. Symlink/unsafe entries remain rejected.

Run a real root-capable Linux regression replacing the old entry with a hard link to an external sentinel during the callback and requesting different uid/gid: rejection must leave sentinel uid/gid/bytes unchanged. Cover directory, link/FIFO and regular substitution and valid handback/export removal. Consolidate the complete Review authority audit before final broad tests so directly equivalent faults close together; no product/dependency/gate scope expansion.


### C055-217-R2d preventive audit closure

Independent Review completed the reachable authoritative helper audit before final verification. Accepted consolidation covers native sharedsha256 and adopted-read/fsync families, adopted temporary claim extension, the independently concrete exportownership callback mutation, and plain-r syncFile reopen callers across metadata/markers/assets/proofs/tree recovery. Use a shared no-follow/nonblocking regular descriptor primitive where appropriate and preserve ordered barriers/final revalidation.

Disposition: not needed for broader copyAndVerify rewrite. Pathname copy is followed by exact destination digest plus complete final candidate/legacy/tree inventory revalidation, binding actual admitted bytes; preserve those assertions. Existing bounded pinned authority/retirement readers require no independent expansion. Diagnostic /proc reads are excluded from deployment authority. Legacy current target is pinned; equal-target pointer ABA without changed-byte authority consequence is not another finding. No general descriptor-only filesystem rewrite or additional original return is authorized. Complete all accepted R2d boundaries together, then consolidated focused/full/Docker evidence before content and renewed roles.


### C055-217-R2d source-copy unsafe-open diagnostic

Review subsequently identified a directly equivalent pre-admission open boundary, so the broader-copy not-needed disposition above remains provisional specifically for unsafe source open. At the first copied asset fsync callback, replace the next candidate/legacy source entry with a FIFO or symlink before copyFileSync opens that pathname. Run a timeout-bounded focused Linux20 control before broad tests: destination digest/final revalidation cannot guarantee prompt rejection if the copy blocks before them. If actual copy follows unsafe authority or hangs, harden the same-family source copy via pinned no-follow/nonblocking regular descriptor and expected digest before destination mutation; preserve exact byte/collision/final inventory controls. If it rejects promptly and admitted-byte checks fail closed, record the measured not-needed result. No general filesystem redesign, assumption of a demonstrated hang, extra original budget return or unrelated scope expansion.


### C055-217-R2d final consolidated authority refinements

- Source-copy diagnostic is confirmed: actual LinuxNode20 FIFO source blocks copyFileSync until the bounded3second timeout exits143. Accept pinned no-follow/nonblocking regular-source descriptor copy with expected digest before destination admission/mutation. This measured unsafe-open result supersedes the earlier conditional broader-copy not-needed assumption only for that boundary.
- Accept shared directory sync primitive: O_DIRECTORY|O_NOFOLLOW|O_NONBLOCK, held directory descriptor/fstat type and no-follow pathname device/inode binding before/after every durability callback/fsync. A replaced FIFO must reject promptly and a symlink cannot redirect fsync to a foreign directory. Preserve parent/tree/journal barrier ordering; legitimate child changes alter directory timestamps, so never require fixed directory mtime/ctime.
- Preserve legitimate same-path/same-byte legacy/candidate overlap: the first owned copied destination may be securely reused or deduplicated. An unconditional second O_EXCL failure is a regression. Conversely equal digest alone is not ownership: copied/exported regular destinations must have nlink1 at admission/reuse and fresh pinned-descriptor ownership handback immediately before mutation. Reject an equal-byte hardlink to a foreign inode before any uid/gid/mode change; do not impose global hardlink prohibition on all immutable sources without an existing contract. Add valid nlink1 overlap and unequal collision negatives plus root-capable Linux external hardlink injection during the preceding asset fsync callback; external sentinel bytes/uid/gid/mode remain unchanged.
- Adopted temporary identity rebinding may admit only documented own link-count/ctime transitions caused by link/unlink. Preserve mode/uid/gid/mtime/byte invariants; no wholesale authority refresh that absorbs concurrent changes. The after-link chmod000 callback must reject rather than return an adopted policy-unreadable record.

These are explicit accepted dispositions within the existing R2d no-follow/owned export/journal durability contracts, not a new cycle or another return. Consolidated Review map is complete: resolve every listed implementation note before the one final focusedLinux/host, fullpreflight and actualDocker batch/content commit. Original05110/05210/0530/0546 remain intact;055 realreturn2/10 and Analyst0/5. No gate/test weakening or general filesystem redesign.
