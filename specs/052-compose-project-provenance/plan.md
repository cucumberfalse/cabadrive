# Implementation Plan: Preserve Compose Project Provenance Across Make

## Delivery Shape

Continue in the explicitly assigned fallback slice: PR #217, branch
`codex/051-asset-retention`, worktree
`/Users/chap/devel/cabadrive-worktrees/051-asset-retention`. The affected code is
not on `main`; creating a separate latest-main PR would duplicate the unmerged
feature-051 prerequisite. Preserve sibling work and keep this follow-up narrow.

## Expected Files

- `Makefile`: one-line semantic correction to the capture step in `build`.
- `tests/capture-legacy-assets.test.mjs`: executable test-first Make lifecycle
  regression and focused negative controls.
- Existing Docker/runtime contract tests only if a directly affected assertion
  must be aligned; do not broaden runtime behavior.
- `specs/052-compose-project-provenance/{spec,plan,tasks}.md` plus its Analyst
  intake.
- Narrow Architect-owned feature-051 `plan.md`/`tasks.md` reconciliation for
  the prior Analyst pass; never rewrite feature-051 `feature-request.md`.
- Directly affected durable runtime docs only if inspection finds they state the
  incorrect pre-resolve/export boundary.

No new dependency, production module, environment variable, CLI mode, backend,
or Docker resource is planned.

## Implementation Sequence

1. **Baseline and failing regression**
   - Confirm exact assigned branch/head/status and preserve the Analyst's
     untracked intake plus all sibling state.
   - Build an isolated fixture containing the real repository Makefile and
     capture script, with a deterministic Docker shim and action log.
   - Start with caller `COMPOSE_PROJECT_NAME` absent and expose one exact
     historical project.
   - Run actual `make build`; make the shim turn the historical image into
     post-feature evidence when `docker compose build` starts.
   - Run a later actual lifecycle target and assert it still uses the historical
     project from `.adopted-project`.
   - Prove the test fails on the intake Makefile because capture receives the
     pre-exported project and skips adoption.

2. **Minimal Make correction**
   - Change only the first `build` recipe so it invokes
     `./scripts/capture-legacy-assets.sh` without Make pre-resolving/exporting a
     project.
   - Keep capture and Docker build in separate recipes. The first failure must
     prevent the second recipe from starting.
   - Leave the second build recipe and other lifecycle targets on the existing
     validated resolver/export pattern.

3. **Focused negative coverage**
   - In the Make-level fixture, verify adoption exists before the build action,
     later lifecycle selection is identical, and an isolated missing-adoption
     control falls back to `cabadrive` after evidence disappears.
   - Verify an explicit non-default caller value stays exact and does not create
     or overwrite adoption.
   - Inject adoption publication failure and prove the build sentinel remains
     absent.
   - Retain existing ambiguity, clean-install, unsafe path/record, invalid name,
     Docker failure, and capture short-circuit coverage.

4. **Documentation and process-memory alignment**
   - Inspect durable Docker/deployment docs for a statement of the Make/capture
     call boundary; update only if the corrected behavior changes that text.
   - Keep feature-051's prior validation evidence intact but reconcile its
     Architect-owned status: prior Architect and Analyst passes both completed
     on `953709f...`; feature 052 now requires renewed validations for the new
     effective head.
   - Keep feature-052 task state, decisions, dead ends, feedback, known issues,
     exact commands/results, and PR cycle metadata current in the implementation
     content commit.

5. **Verification**
   - Run focused capture/Make and Docker/runtime contract tests.
   - Run `git diff --check`, feature-memory/repository guards, and full
     `pnpm run preflight`.
   - Run the established isolated real Docker asset-retention lifecycle on a
     unique project/port without touching sibling resources.
   - Inspect the final scope for only the allowed Make/test/docs/process-memory
     files and no runtime handoff artifacts.

6. **Review and finalization handoff**
   - Obtain exact-head review focused on R052-001/R052-002 and the affected
     lifecycle contracts; do not reopen a broad exploratory audit.
   - Resolve both originating threads with executable/process evidence.
   - Orchestrator uses complete paginated read-only review guards because PR
     #217 has more than 100 native reviews, verifies required checks and no
     conflicts, then invokes final Architect validation followed by final
     Analyst validation on one renewed effective content head.
   - If the conservative helper cannot prove review completeness due only to
     bounded pagination, use manual squash merge only after the complete
     paginated guard proves all unchanged merge gates. Never bypass a red,
     pending, missing, conflicting, stale, or unresolved gate.

7. **Architect return #1: status-preserving runtime-label probe**
   - Replace the `docker image inspect | grep` classification used for the
     historical-basename runtime marker with an explicit command-status capture.
     Preserve stderr/status long enough to distinguish exact `true`, verified
     absence, and inspection failure; reject unexpected nonempty marker values
     rather than treating them as legacy.
   - Keep the existing successful image-ID probe as a separate prerequisite.
     Only a confirmed existing image whose label inspection succeeds and proves
     the marker absent may add the historical basename candidate.
   - Add a focused fail-closed regression where ID inspection succeeds but label
     inspection exits nonzero. Assert resolver/actual Make fails, no
     `.adopted-project` is written, and no capture/build/lifecycle sentinel runs.
   - Retain the existing verified-unlabeled and exact-`true` regressions, then
     rerun the complete focused capture suite, repository preflight, and isolated
     real Docker retention lifecycle.
   - Obtain renewed exact-head review and resolve `r4134154337` only with passing
     fix evidence. Keep final-validation thread `r4134154325` open until final
     Architect validation and later final Analyst validation both name the same
     renewed effective content head; reply with that evidence before resolution.

8. **Architect return #2: root containment and durable adoption**
   - At the beginning of resolution, classify the handoff root with no-follow
     semantics. If absent, continue without creating it; if present, require the
     canonical repository-owned directory. Perform this before explicit-project
     return, adopted-record lookup, or any Docker metadata/image query so every
     later bind-mount consumer inherits a validated root.
   - Replace shell-only adoption publication with the narrowest repository-owned
     Docker-executed durability helper, reusing the existing staging durability
     primitives where practical so host Node remains unnecessary. Require a
     contained no-follow temporary regular file, checked write/close and exact
     content, file fsync, atomic same-directory rename, then parent-directory
     fsync before capture/build may proceed.
   - On every existing adopted-record read, retain no-follow/content/name checks
     and repeat file plus parent fsync before returning its project. This is the
     recovery path for a crash or injected failure after visible rename but
     before a durable parent barrier; any durability failure remains blocking.
   - Add a symlinked-empty-root fixture with no adoption record. Assert resolver
     and actual Make fail before Docker discovery/action and the external target
     is untouched. Cover unset and explicit resolution if the shared entry
     validation applies to both.
   - Add deterministic operation tracing and faults for adoption file sync,
     rename, and parent sync. Assert `file fsync < rename < parent fsync < Docker
     build`; each failure suppresses build. For post-rename parent failure, keep
     the visible exact record fail-closed and prove retry repeats durability
     barriers before project use.
   - Rerun all focused capture/runtime tests, feature/repository guards, full
     preflight, and isolated real Docker retention lifecycle. Obtain renewed
     exact-head review and resolve `r4134532193`/`r4134532208` with evidence.
     Keep `r4134154325` open through final Architect and later Analyst validation,
     then reply with both exact-head markers before resolving it.

9. **Final-validation return #3: safe optional basename probe**
   - Before constructing `${historical_basename}-cabadrive`, classify the raw
     basename with the existing safe Compose project grammar. Probe Docker only
     when it is already valid; do not lowercase, sanitize, or otherwise map an
     invalid path name to an unproven historical identity.
   - Invalid basename skips only the optional legacy-image fallback. Exact
     Compose container-label discovery remains authoritative; zero candidates
     still yields the stable `cabadrive` clean-install default.
   - Add temporary repository-root fixtures with uppercase, space, and dot
     basenames. Make Docker fail/sentinel on any invalid historical image-inspect
     call and prove resolver plus an actual Make lifecycle succeed with
     `cabadrive`. Retain the valid lowercase historical-image adoption regression.
   - Rerun the complete focused capture/runtime tests, guards, full preflight,
     and isolated real Docker retention lifecycle. Obtain renewed exact-head
     review and resolve `r4137130912` only with evidence.
   - Treat `a7c5f617dbd210a705aecc9fac78277609eb13de` as the superseded attempted
     validation head: its formatting-only runtime change is non-evidence under
     policy, and R052-007 requires a later effective content head. Keep
     `r4137191315` and `r4134154325` open until final Architect then Analyst
     validation both name that later head.

10. **Architect return #4: exact ancestry, no-replace adoption, safe child**
   - Parse each successful container `config_files` label as the documented
     comma-separated path list and compare each token exactly with the canonical
     checkout compose path. Preserve exact `working_dir` equality as a separate
     authority; never use substring matching.
   - Change adoption publication to an atomic same-directory no-replace claim,
     using the narrow repository-owned primitive compatible with the Docker-only
     helper. Preserve completed temporary-file fsync before publication and
     parent fsync afterward. When the target already exists, validate it no-
     follow and repeat durability barriers; return idempotent success only for
     the same project, otherwise fail without overwrite or Docker build.
   - Add deterministic concurrent-writer interleavings for same and different
     projects. Prove one target publication, no replacement, exact loser
     validation, cleaned attempt-owned temporaries, preserved file/no-replace/
     parent ordering, and fail-closed injected retry paths.
   - Refactor resolver control flow only enough to funnel every selected
     explicit/adopted/default/discovered project through one child validator.
     If the handoff root exists and its project child exists, require a no-follow
     canonical directory directly beneath that root before printing/returning
     or publishing an adoption. Absence remains allowed for later capture.
   - Add one config-label table covering an exact target in a multi-file list
     and `.backup`, prefix/suffix, sibling, and substring-only negatives. Add
     actual-Make symlink-child controls for all four identity sources; assert no
     lifecycle/bind/adoption action and no external mutation.
   - Execute one combined focused suite, syntax/format/diff/feature/repository
     guards, full preflight, and isolated real Docker retention lifecycle. Then
     obtain one renewed exact-head review. Resolve both duplicate config threads
     from the same evidence plus the adoption/child threads; keep validation-only
     `r4134154325`/`r4137191315` open through final Architect then Analyst
     validation on the final effective content head.

11. **Architect return #5: literal config-file tokenization**
   - Replace unquoted `for ... in $config_files` iteration with a literal
     comma-slicing loop using quoted assignments and parameter expansion. Do not
     let any token undergo pathname expansion; avoid global shell-option changes.
   - Preserve exact token equality, empty/malformed-token behavior, the positive
     multi-file list, and independent exact `working_dir` authority.
   - Add negative fixtures whose label tokens contain `?`, `*`, and bracket
     expressions and whose repository filesystem makes those patterns match the
     canonical compose file. Assert none authorizes a candidate or adoption.
   - Run the focused capture/runtime suite, shell syntax, format/diff/feature/
     repository guards, full preflight, and isolated real Docker lifecycle once.
     Obtain one renewed exact-head review, resolve `r4144203150` with evidence,
     and keep validation-only `r4134154325`/`r4137191315` open for final
     Architect then Analyst validation. Do not reopen the other return #4 fixes
     absent new concrete evidence.

## Key Decisions

- **D052-001:** reuse the capture script's existing combined
  resolve/classify/persist/capture operation; do not invent a second provenance
  channel.
- **D052-002:** the original caller environment is the authority for
  explicitness. A value exported by Make after resolution is not equivalent.
- **D052-003:** persistence is complete before capture returns and therefore
  before the separate Docker build recipe can begin.
- **D052-004:** caller-explicit projects remain ephemeral overrides and are not
  persisted by this workflow.
- **D052-005:** only the first build recipe changes. Resolver behavior and all
  feature-051 safety checks remain unchanged.
- **D052-006:** actual Make execution is required evidence; source-pattern tests
  alone cannot protect this shell/environment boundary.
- **D052-007:** feature-051's old validation markers remain historical truth,
  not authority for the post-feature-052 head.
- **D052-008:** Docker command status is part of provenance evidence. The label
  probe exposes three outcomes—post-feature, verified pre-feature/unlabeled, and
  failure—and only the verified-unlabeled outcome authorizes basename adoption.
- **D052-009:** an unexpected nonempty runtime-marker value is ambiguous and
  fails closed; it is not silently equivalent to an absent marker.
- **D052-010:** handoff-root containment is a prerequisite to project
  resolution, including explicit resolution; the presence of an adopted record
  is not what activates the safety boundary.
- **D052-011:** adoption visibility and adoption durability are distinct.
  Authority requires file fsync before same-directory rename and parent fsync
  after rename; a later read repeats the barriers before returning authority.
- **D052-012:** the durability operation runs through repository-owned tooling
  in Docker so the end-user host remains Docker-only; no host Node/Python
  dependency is introduced.
- **D052-013:** the historical basename image is optional evidence, not a value
  to normalize. Invalid raw basenames are skipped; only already-safe exact names
  may authorize the fallback probe.
- **D052-014:** Compose config ancestry is token equality, not text containment;
  the canonical compose path must be one complete comma-separated entry.
- **D052-015:** `.adopted-project` is a first-writer-wins durable claim. A loser
  never overwrites and may converge only on an exact same-project winner after
  revalidation and durability barriers.
- **D052-016:** root safety and project-child safety are separate invariants.
  Every selected identity passes the child invariant before it leaves resolver
  authority or triggers adoption.
- **D052-017:** config label parsing is literal data parsing, not shell word
  generation. Quoted comma slicing is preferred over toggling process-wide
  noglob state.

## Verification Matrix

| Boundary | Evidence | Pass condition |
|---|---|---|
| Discovered Make build | actual Make fixture | adoption exists before build; build uses discovered project |
| Post-build continuity | consecutive actual Make targets | later Compose action uses adopted project after discovery evidence disappears |
| Regression strength | red-before-green record + no-adoption control | intake head fails; absent record after evidence loss resolves `cabadrive` |
| Explicit override | actual Make fixture | exact explicit project used; adoption absent/unchanged |
| Adoption failure | failure injection + build sentinel | Make fails and image build never starts |
| Runtime-label inspection | focused resolver + actual-Make failure fixture | ID success plus label-inspect failure aborts with no adoption/capture/build action |
| Existing handoff root | no-follow resolver/actual-Make fixture | empty symlink/non-directory fails before Docker query, bind, adoption, or action; external target unchanged |
| Adoption durability | ordered trace + injected file-sync/rename/parent-sync failures | exact file fsync precedes rename, parent fsync precedes build, failure blocks build, retry rebarriers visible exact record |
| Invalid checkout basename | uppercase/space/dot resolver + actual-Make fixtures | no invalid image probe; label discovery remains available; clean install selects `cabadrive` |
| Compose config ancestry | exact-list positive + near-match negative table | only a complete canonical list token grants ownership; working-dir exact match remains valid |
| Concurrent adoption | adversarial same/different writer tests + durability trace | first durable claim is never replaced; same converges, different fails; build waits for authority |
| Selected project child | explicit/adopted/default/discovered actual-Make symlink fixtures | child is validated before return/adoption/bind; action absent and external target unchanged |
| Literal config tokens | expandable `?`/`*`/bracket negatives + exact-list positive | wildcard text never expands; only literal canonical token grants ancestry |
| Existing safety | focused capture tests | ambiguity, unsafe state, Docker failures, and clean install retain fail-closed behavior |
| Runtime integration | isolated real Docker lifecycle | project/image/volume/handoff/stager continuity remains green |
| Repository quality | full preflight and guards | all commands pass on effective content head |
| Process | memory diff + paginated review guard | R052 threads disposed, no contradiction, no unresolved blocking review |
| Final validation | role-owned evidence | Architect then Analyst pass on the same renewed effective content head |

## Risks And Mitigations

- A wrapper-only regex test may miss environment flattening: execute the actual
  Make target and consecutive lifecycle sequence.
- Combining capture and build in one unchecked shell could reintroduce mutation
  after failure: retain separate fail-fast recipes.
- A new provenance flag could itself be spoofed or drift: use the already
  existing capture entry environment and internal resolver.
- A test may prove only selection during build: deliberately remove/convert
  historical discovery evidence before testing the next lifecycle action.
- An explicit override may become sticky: assert adoption remains absent or
  byte-identical.
- Process-memory correction may falsely reuse stale validation: state that old
  passes apply only to `953709f...` and require renewed feature-052 validation.
- PR review pagination may hide an unresolved thread: enumerate all pages before
  merge; helper refusal alone is not a bypass authorization.
- A pipeline can report `grep`'s mismatch instead of Docker's inspect failure:
  capture inspect output/status before classification and test the split failure
  directly.
- Checking the root only when `.adopted-project` exists lets an empty symlink
  escape through later bind mounts: validate every existing root before any
  project-resolution branch or Docker discovery.
- Atomic rename can be visible but lost after a crash: fsync the completed file
  before rename and the parent afterward; on a visible post-failure record,
  repeat both barriers before use.
- Passing an invalid checkout basename to Docker turns optional migration
  discovery into a clean-install outage: validate before constructing the image
  reference and skip rather than normalize invalid evidence.
- Substring config matching can adopt a container from a backup or neighboring
  file: tokenize the label and require exact canonical membership.
- Overwrite rename lets concurrent discoveries change identity after another
  writer publishes: use a no-replace claim and exact winner reconciliation.
- Validating only the parent leaves selected child symlinks available to later
  bind mounts: validate the exact project child on every resolver exit path.
- Setting `IFS` does not disable shell globbing: parse comma tokens as quoted
  literal substrings so filesystem contents cannot manufacture an exact match.

## Architect disposition: paginated completion-cycle055 findings (2026-10-08)

Complete pagination is authoritative: PR #217 has160 review threads, with8 unresolved at discovery (5 ordered-validation conversations and3 current technical findings). The earlier100-thread checkpoint is partial historical evidence. No historical role pass authorizes these new fixes. New055 owns this bounded combined follow-up; retain F052 at10/10 and F054's historical6/10 rather than creating an implicit old-cycle return.

- C055-217-R1 / r4190414768: accepted task. Classify an existing selected container by its immutable runtime image's exact release-state-runtime label, using inspected image identity rather than a mutable image tag or container ID. An unlabeled genuine legacy container retains exact expected source-id/source-kind matching and baked-root capture. A labeled post-feature container is not a legacy source: after release-state rejection, permit only an independently descriptor-validated complete legacy handoff with its original pre-feature identity; never compare that identity to the post-feature container ID, copy absent baked assets, re-import rejected `/state`, or convert failed classification/verification into clean install. Prove valid handoff recovery and rejection of absent, incomplete, wrong-type, corrupt and substituted handoffs; unchanged foreign/state sentinels and no Docker build/capture on rejected authority.
- C055-217-R2 / r4190542902: accepted task. Retirement requires durable, exact authority before unlinking an old generation output. Extend current transaction journal/primitives with one bounded retirement record binding generation root, logical output, exact output-link identity/target, exact contained target tree identity/inventory, and protected active/rollback selection. Persist/fsync that record before unlink; retain it across unlink, parent-sync, tree deletion and final parent-sync failures. On retry, revalidate authority and protected paths, finish only that exact journal-known target, repeat durability barriers and clear the record durably only after safe completion. Never scan unreferenced trees for pruning or delete a substituted/foreign/active/rollback target. Test failures before/after each journal, unlink, sync and removal boundary, partial removal retry, substitution and sibling preservation. Active and immediate rollback generations always survive.
- C055-217-R3 / r4190564538: accepted task. Move expected source-id/source-kind comparison into the no-follow descriptor-bound Node handoff verifier/pinned-current boundary. Successful verification and identity comparison must use the same validated manifest/authority; remove shell pathname `cat` rereads. Preserve exact expected identity for genuine legacy capture, and full independent authority for the labeled post-feature recovery branch. Test source-id and source-kind symlink, dangling link, FIFO, wrong type and substitutions between classification/verification/use; negatives terminate promptly, make no mutation and preserve external sentinels.

Run the focused capture/provenance/staging/export fault suites and combined tests before publication; consolidate all3 fixes then obtain full preflight, isolated real Docker lifecycle and post214 integration/header smoke. Review includes all pages and exact effective content. The5 validation conversations remain pending until renewed same-SHA Architect then Analyst evidence and current-head guard are proven; technical resolution requires substantive regression evidence.


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


### C055-217-R2d final consolidated authority refinements

- Source-copy diagnostic is confirmed: actual LinuxNode20 FIFO source blocks copyFileSync until the bounded3second timeout exits143. Accept pinned no-follow/nonblocking regular-source descriptor copy with expected digest before destination admission/mutation. This measured unsafe-open result supersedes the earlier conditional broader-copy not-needed assumption only for that boundary.
- Accept shared directory sync primitive: O_DIRECTORY|O_NOFOLLOW|O_NONBLOCK, held directory descriptor/fstat type and no-follow pathname device/inode binding before/after every durability callback/fsync. A replaced FIFO must reject promptly and a symlink cannot redirect fsync to a foreign directory. Preserve parent/tree/journal barrier ordering; legitimate child changes alter directory timestamps, so never require fixed directory mtime/ctime.
- Preserve legitimate same-path/same-byte legacy/candidate overlap: the first owned copied destination may be securely reused or deduplicated. An unconditional second O_EXCL failure is a regression. Conversely equal digest alone is not ownership: copied/exported regular destinations must have nlink1 at admission/reuse and fresh pinned-descriptor ownership handback immediately before mutation. Reject an equal-byte hardlink to a foreign inode before any uid/gid/mode change; do not impose global hardlink prohibition on all immutable sources without an existing contract. Add valid nlink1 overlap and unequal collision negatives plus root-capable Linux external hardlink injection during the preceding asset fsync callback; external sentinel bytes/uid/gid/mode remain unchanged.
- Adopted temporary identity rebinding may admit only documented own link-count/ctime transitions caused by link/unlink. Preserve mode/uid/gid/mtime/byte invariants; no wholesale authority refresh that absorbs concurrent changes. The after-link chmod000 callback must reject rather than return an adopted policy-unreadable record.

These are explicit accepted dispositions within the existing R2d no-follow/owned export/journal durability contracts, not a new cycle or another return. Consolidated Review map is complete: resolve every listed implementation note before the one final focusedLinux/host, fullpreflight and actualDocker batch/content commit. Original05110/05210/0530/0546 remain intact;055 realreturn2/10 and Analyst0/5. No gate/test weakening or general filesystem redesign.
