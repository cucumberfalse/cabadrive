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

## Verification Matrix

| Boundary | Evidence | Pass condition |
|---|---|---|
| Discovered Make build | actual Make fixture | adoption exists before build; build uses discovered project |
| Post-build continuity | consecutive actual Make targets | later Compose action uses adopted project after discovery evidence disappears |
| Regression strength | red-before-green record + no-adoption control | intake head fails; absent record after evidence loss resolves `cabadrive` |
| Explicit override | actual Make fixture | exact explicit project used; adoption absent/unchanged |
| Adoption failure | failure injection + build sentinel | Make fails and image build never starts |
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
