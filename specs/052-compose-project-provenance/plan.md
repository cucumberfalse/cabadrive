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
