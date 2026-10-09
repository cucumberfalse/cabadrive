# Feature Request: Preserve discovered Compose project provenance across Make lifecycle commands

## Intake metadata

- Feature ID: `052-compose-project-provenance`
- Intake role: Analyst
- Assigned worktree: `/Users/chap/devel/cabadrive-worktrees/051-asset-retention`
- Assigned branch and PR slice: `codex/051-asset-retention`, PR #217
- Verified latest `origin/main` supplied by Orchestrator:
  `2a92bcfcb7638d1094f33b28e4c2932fb2e4121e`.
- Current clean PR head supplied by Orchestrator and locally confirmed:
  `80d212ae76e84c1ad1ce8191a1609362a4c48eb8`; it descends from the verified
  latest-main SHA.
- Numbering context: the maximum existing feature prefix is `051`, so the next
  feature prefix is `052`.
- Parallel-work warning: other worktrees, branches, commits, PRs, dirty diffs,
  and process memory may exist. They must be preserved; this intake does not
  reset, rebase, overwrite, close, delete, or otherwise mutate sibling work.
- Analyst scope: this folder and this one `feature-request.md` only. No code,
  tests, durable product docs, Architect artifacts, commits, pushes, reviews,
  or merge actions are part of intake.

## Startup fallback and PR context

The normal fresh-worktree rule cannot represent this follow-up faithfully yet:
the defect is in the unmerged implementation of feature 051 on PR #217, while
the latest verified `main` is the known ancestor of that PR and does not contain
the affected code. A separate latest-main branch or PR could not test or fix the
defect without duplicating the entire unmerged prerequisite.

Orchestrator therefore explicitly assigned this intake to the existing clean
PR #217 worktree and branch as a documented startup fallback. Feature 052 must
remain a narrow follow-up within that PR slice. The fallback does not authorize
unrelated changes, history rewriting, or loss of the existing feature-051
evidence. Architect and Implementation Agent must preserve both feature
memories and record the effective head used for renewed final validation.

## Authority and originating intent

The user has repeatedly instructed the Orchestrator to continue through merge,
to do everything necessary, and to avoid repeated token-burning cycles without
reducing result quality. During the current-head required review of PR #217,
review thread `r4121580555` found a genuine deployment defect after feature 051
had reached its maximum Architect return count (`10 / 10`). Repository process
therefore requires a new feature request rather than an eleventh return inside
feature 051.

The user-facing intent remains safe updates: an existing installation must keep
using the same discovered historical Docker Compose project and retained assets
through `make build`, `make up`, and later lifecycle commands. A successful
build must not silently cause the next command to select a different project,
volume, image, or retained-asset history.

## Product and technical context

Cabadrive is a local-first static PWA served through the Docker-only lifecycle
`make build`, `make up`, and `make down`. Feature 051 adds retained immutable
assets and first-upgrade adoption of one uniquely provable pre-feature Compose
project. A discovered non-default project must be persisted in the
repository-owned `.cabadrive-release-handoff/.adopted-project` record so later
commands resolve the same deployment identity after the historical image has
been replaced by a post-feature image.

The current Make recipe performs these steps:

1. `capture-legacy-assets.sh --resolve-project` discovers a historical project;
2. Make exports that result as `COMPOSE_PROJECT_NAME`;
3. Make invokes `capture-legacy-assets.sh`;
4. the capture script sees `COMPOSE_PROJECT_NAME` already set and classifies it
   as caller-explicit;
5. because it appears explicit, capture skips persistence of
   `.adopted-project`;
6. `docker compose build` replaces or labels the historical runtime image;
7. a later `make up` can no longer rediscover the historical identity and falls
   back to `cabadrive`.

The selected project value is correct during the build, but its provenance has
been flattened. The system can no longer distinguish a value explicitly chosen
by the caller from one discovered by the repository resolver. That distinction
is required to decide whether adoption must be persisted.

Relevant durable context read during intake includes the constitution,
project overview, frontend/backend/runtime documentation, feature inventory,
learning/exam flows, specification archive guidance, and feature-051 memory.
No external research is needed because the defect is fully evidenced by the
repository lifecycle and current-head review.

## Problem statement

When `COMPOSE_PROJECT_NAME` is initially unset and `make build` discovers a
valid non-default historical Compose project, the Make wrapper exports only the
resolved value before invoking capture. Capture consequently mistakes a
resolver-discovered identity for a caller-explicit identity and does not write
the durable adoption record. Once the build replaces the evidence used for
historical discovery, `make up` may resolve the default `cabadrive` project
instead of the project used for the build.

This splits a single update across different Compose projects and therefore
different retained-state volumes, images, containers, and handoff paths. It can
make the just-built release unavailable to the next lifecycle command and can
break the retained-origin guarantee that feature 051 exists to provide.

## Desired outcome

The Make/capture boundary preserves both the selected Compose project and its
origin. A project explicitly supplied by the caller remains authoritative and
is never silently persisted as an adopted discovery. A unique historical
project discovered while the caller left `COMPOSE_PROJECT_NAME` unset is used
for the current build and durably adopted before the historical discovery
evidence can be replaced. Every later lifecycle command resolves that same
project. Failure to persist a required adoption aborts before image replacement
or any action that could strand the deployment between identities.

## Scope

### In scope

- Preserve explicit-versus-discovered project provenance across the Make
  resolver-to-capture boundary.
- Persist a validated discovered non-default project exactly when adoption is
  required, before `docker compose build` can replace historical evidence.
- Keep explicit `COMPOSE_PROJECT_NAME` authoritative without creating or
  overwriting an adoption record merely because the explicit value is
  non-default.
- Ensure `make build`, followed by `make up`, `make down`, `make logs`, or
  `make stage`, resolves one consistent Compose project after first-upgrade
  discovery.
- Fail closed before build/replacement when required adoption persistence is
  unsafe or fails.
- Add focused executable regression coverage for the actual Make wrapper and
  the post-build loss of historical discovery evidence.
- Re-run the relevant feature-051 focused, preflight, and Docker lifecycle
  checks required by Architect before PR #217 can return to final validation.
- Reconcile the current process-memory contradiction identified by review
  thread `r4121580548` through role-owned edits: passing final Analyst evidence
  already exists in `feature-request.md`, while stale feature-051 memory still
  says final Analyst validation was not invoked or remains pending. Architect
  must identify the exact role-owned correction; Implementation must not
  rewrite Analyst-owned validation evidence.

### Out of scope

- Changing the retained-asset staging, atomic publication, collision,
  durability, or static-export algorithms except where directly required by
  the project-provenance fix.
- Adding a new Compose project naming policy or changing the default
  `cabadrive` identity for genuinely clean installs.
- Adopting ambiguous, unsafe, unvalidated, or unrelated Docker resources.
- Overwriting a caller's explicit `COMPOSE_PROJECT_NAME` choice.
- Automatic migration, deletion, or garbage collection of unrelated Compose
  projects, volumes, images, containers, or handoff state.
- Reopening already resolved feature-051 findings or initiating a new broad
  exploratory audit.
- Changes to learner scheduling, service-worker UX, or PR #215 beyond its
  already recorded post-prerequisite synchronization and validation.

## Acceptance expectations

### R052-1: provenance survives the Make boundary

Given an unset caller environment and one uniquely valid historical project,
when a Make lifecycle recipe resolves the project and invokes capture, capture
must retain authoritative evidence that the value was discovered rather than
caller-explicit. Passing the resolved value for consistent Compose execution
must not erase its provenance.

### R052-2: discovered adoption is durable before replacement

Given a discovered validated non-default historical project, `make build` must
persist the validated adoption record before the Docker build can replace or
relabel the historical image used for discovery. If the record cannot be
written and durably published under the established feature-051 safety
contract, capture and build must stop; no image replacement starts.

### R052-3: post-build lifecycle continuity

After the historical discovery evidence is deliberately made unavailable in
the same way a successful post-feature build makes it unavailable, a subsequent
resolver call and `make up` must still select the adopted historical project,
not `cabadrive`. The same durable identity must govern its release-state volume,
runtime image/container, handoff path, and stager.

### R052-4: explicit caller choice remains explicit

Given a valid caller-supplied `COMPOSE_PROJECT_NAME`, Make and capture use that
exact project. The workflow must not misclassify it as discovered, must not
create an adoption record solely because it is non-default, and must not
replace an existing adoption record with the explicit one.

### R052-5: clean install remains stable

Given no explicit project, no adopted record, and no valid historical project,
the resolver still selects `cabadrive`. The fix must not create a spurious
adoption record or require historical state for a clean install.

### R052-6: ambiguity and unsafe state remain fail-closed

Ambiguous historical candidates, invalid project names, unsafe adoption paths,
unreadable Docker discovery, and failed adoption publication continue to abort
before capture/build mutation. No fallback to `cabadrive` may conceal a failed
or ambiguous migration.

### R052-7: executable regression proves the complete sequence

An automated test must exercise the real Make-to-capture contract, not only an
isolated helper. It must prove at minimum:

1. `COMPOSE_PROJECT_NAME` starts unset;
2. a non-default historical project is uniquely discovered;
3. the build path invokes capture and records the adoption;
4. historical discovery evidence is then removed or converted to post-feature
   evidence;
5. the next lifecycle resolution/action still uses the same adopted project;
6. a negative control demonstrates the old flattened-provenance behavior would
   fall back to `cabadrive` when the adoption record is absent.

### R052-8: merge-readiness evidence is coherent

Feature 052 receives Architect-owned `spec.md`, `plan.md`, and `tasks.md`,
focused verification, review disposition, final Architect validation, and then
final Analyst validation on the renewed effective content head. Feature-051
process memory must no longer contradict its already recorded final Analyst
pass. The current PR head must have green required checks and no unresolved
blocking review threads before Orchestrator finalizes PR #217.

## Required negative scenarios

- Explicit non-default project: it is used but not persisted as a newly
  discovered adoption.
- Discovered non-default project with adoption write/publication failure: build
  replacement does not start.
- Discovered project with missing adoption after historical evidence disappears:
  the regression control falls back to `cabadrive`, proving the original bug.
- Multiple historical candidates: fail without choosing or persisting one.
- Unsafe or malformed `.adopted-project` state: fail without Docker lifecycle
  mutation.
- Docker discovery or inspection failure: fail rather than treating it as a
  clean install.
- Genuine clean install: use `cabadrive` without a false adoption record.

## Assumptions and Architect decisions

- **A1 — no user clarification required.** The required behavior is determined
  by the current review finding, the documented Docker contract, and the user's
  existing authorization to continue through merge.
- **A2 — provenance mechanism.** Architect chooses the smallest explicit
  interface that cannot confuse caller input with resolver output. A separate
  flag/mode or a single combined capture-and-resolve operation are possible;
  ambient-value guessing is not sufficient.
- **A3 — ordering.** Required adoption must become authoritative before any
  build action can destroy the evidence needed to rediscover it.
- **A4 — existing safety rules remain binding.** Project-name validation,
  repository-owned handoff containment, exact discovery, ambiguity rejection,
  Docker failure handling, and capture short-circuit behavior from feature 051
  must not be weakened.
- **A5 — one PR slice.** Because the affected code is unmerged and exists only
  on PR #217, feature 052 is planned and implemented in that existing clean
  branch/worktree under Orchestrator control. This is the recorded exception to
  a fresh latest-main branch, not a general workflow change.
- **A6 — bounded review.** Verification should target this exact provenance
  defect and affected lifecycle contracts. It must not manufacture another
  unbounded exploratory loop after feature 051 exhausted its return budget.
- **A7 — role ownership.** Analyst-owned pass evidence remains Analyst-owned.
  Architect may correct Architect-owned status/disposition text and assign any
  necessary task; Implementation may update only its assigned implementation
  and task evidence.

## Risks and mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Resolver output is still treated as caller input | Adoption is skipped; later commands split projects | Carry explicit provenance through one tested interface |
| Adoption is written after image build | Historical evidence can disappear before durable continuity exists | Persist and verify adoption before build starts |
| Explicit user choice is persisted | Later unset commands unexpectedly inherit a one-off override | Preserve caller-explicit status and negative-test no adoption write |
| Fix bypasses existing path/name checks | Unsafe state or unrelated Docker resources could be adopted | Reuse feature-051 validators and fail-closed discovery contract |
| Test mocks only the resolver | Make wrapper regression survives | Exercise the actual Make recipe boundary and consecutive lifecycle sequence |
| Process contradiction remains | Finalizer/reviewer cannot trust validation state | Role-owned reconciliation plus exact-head final validation |
| Follow-up becomes another broad audit cycle | Merge is delayed without improving the reported behavior | Limit work and review to R052 acceptance plus affected regression gates |

## Verification evidence required before merge

- Focused automated tests for discovered, explicit, clean-install, ambiguous,
  unsafe-state, and persistence-failure paths.
- An executable Make-level regression proving discovered non-default identity is
  persisted before build and reused after historical evidence disappears.
- Evidence that no Docker build/action begins when required adoption
  persistence fails.
- Relevant feature-051 capture and Docker-contract tests green on the renewed
  effective content head.
- Full repository preflight and the Architect-required isolated real Docker
  lifecycle on the renewed effective content head.
- Review disposition for `r4121580555` and role-correct reconciliation of
  `r4121580548`.
- Final Architect validation followed by final Analyst validation, both naming
  the same renewed effective content head, followed by current-head guards and
  green required GitHub checks.

## Role boundaries and handoff

- Analyst has written only this intake artifact and now returns control to
  Orchestrator.
- Architect must create feature-052 `spec.md`, `plan.md`, and `tasks.md`, define
  the provenance interface and command ordering, assign exact tests and
  process-memory reconciliation, and preserve the existing feature-051 safety
  contract.
- Implementation Agent may edit only after full feature-052 planning exists and
  Orchestrator assigns the existing PR #217 worktree/branch as the implementation
  slice. It must update feature-052 tasks and record verification evidence.
- Review Agent reviews the narrow resulting diff and acceptance evidence without
  editing files or starting an unrelated discovery audit.
- Orchestrator coordinates renewed final validation and may merge PR #217 only
  after the current head satisfies all required gates; afterward it continues
  the already required synchronization and validation of PR #215.

## Initial cycle context

Feature 052 begins because the current-head review of PR #217 found a product
defect after feature 051 exhausted its permitted Architect returns. It is a new
work cycle and new feature memory, but intentionally shares PR #217's existing
clean branch/worktree due to the documented unmerged-code startup fallback.
The immediate target is review thread `r4121580555`; thread `r4121580548` is the
adjacent process-memory reconciliation needed for trustworthy finalization.

No implementation or validation pass is claimed by this intake. Architect
planning, implementation, review, final Architect validation, final Analyst
validation, current-head guards, and merge remain pending.

## Final Analyst Validation

### Renewed combined validation after F054 return #6 — 2026-10-06

- Analyst validation pass: passed
- Final Analyst validation completed at: 2026-10-06T01:06:26Z
- Analyst validated effective content head: 7b0c355a6d24b260523011a5ac10b3c2621b457c
- Analyst return count: 0 / 5.
- Combined PR-set coverage: PR #217 contains F051 retention, this closed F052
  provenance cycle, F053 security refresh, and F054 through return #6. The
  effective head above contains all behaviorally meaningful content; later
  uncommitted changes are role-owned final-validation evidence only.
- Customer-intent validation: R052-1 through R052-8 and all required negatives
  remain satisfied in spirit and letter. Project provenance, durable adoption,
  lifecycle continuity, explicit caller choice, clean install, ambiguity
  rejection, and project isolation remain preserved. F054 remains the proper
  post-limit feature and does not become an invalid F052 return #11.
- Return-#6 validation: pinned legacy reuse now reruns the complete canonical
  marker/source/inventory/asset/no-extra tuple at every locked admission,
  recovery, durability, activation, and clear boundary and compares it with the
  originally pinned tuple. Pointer stability alone can no longer hide asset or
  metadata drift; exact restoration/retry remains supported.
- Evidence: return-#6 controls passed 2/2, combined contracts passed 82/82,
  full preflight passed 675/675 Node tests plus production/service-worker builds
  and 158/158 Playwright tests, and isolated Docker lifecycle
  `cabadrive-retention-8328-1791248030088` passed. Guards and exact-head Review
  passed, and all technical threads are resolved.
- Process validation: F052 remains complete at 10/10, F054 passes at 6/10, and
  Analyst return count is 0/5. No unresolved task, feedback, technical finding,
  architecture gap, or customer-intent mismatch remains. Exact-current-head
  checks, thread/conflict state, process memory, and the evidence-only guard
  remain Orchestrator merge gates.

The F054 return-#5 Analyst validation on
`4a687f788d1eed2e5dae8f3f7397e8ef8c765064`, and all earlier Analyst markers,
is historical and superseded for merge authority by this return-#6 validation.

### Renewed combined validation after F054 return #5 — 2026-10-06

- Analyst validation pass: passed
- Final Analyst validation completed at: 2026-10-06T00:41:13Z
- Analyst validated effective content head: 4a687f788d1eed2e5dae8f3f7397e8ef8c765064
- Analyst return count: 0 / 5.
- Combined PR-set coverage: PR #217 on branch `codex/051-asset-retention`
  contains F051 asset retention, this closed F052 provenance cycle, F053
  security refresh, and F054 through return #5. All behaviorally meaningful
  content is contained in the effective head above; later uncommitted changes
  present during validation are role-owned final-validation evidence only.
- Customer-intent validation: R052-1 through R052-8 and all required negative
  scenarios remain satisfied in spirit and letter. Durable project adoption,
  lifecycle continuity, explicit caller choice, clean-install behavior,
  ambiguity rejection, and project isolation remain intact. The post-limit
  defects continue to be owned by F054 rather than an invalid F052 return #11.
- Transaction and authority validation: read-only admission now precedes state
  mutation; shared bounded descriptor readers protect every authority record;
  operation and pinned legacy identities remain journal-bound; immutable
  project-scoped generations survive separate `run --rm` invocations; and
  visible output/destination recovery requires exact transaction ownership,
  nonce, device/inode, inventories, and locked terminal revalidation. Foreign
  byte-identical trees, changed authorities, wrong operation, or stale retries
  cannot become trusted state.
- Evidence: final preflight passed 673/673 Node tests plus production/service-
  worker builds and 158/158 Playwright tests. Return-#5 combined focused
  contracts passed 80/80, and isolated Docker lifecycle
  `cabadrive-retention-97105-1791246610556` passed five crash retries,
  sequential releases in one Compose project, rootful/rootless-safe ownership,
  unprivileged cleanup, and scoped teardown. Exact-head Review passed and all
  technical threads are resolved.
- Process validation: F052 is complete and closed at Architect return count
  10/10; F054 passes at 5/10; Analyst return count is 0/5. No unresolved task,
  feedback, finding, accepted known issue, architecture gap, or customer-intent
  mismatch remains. Exact-current-head checks, thread/conflict verification,
  process-memory confirmation, and the evidence-only guard remain Orchestrator
  merge gates rather than Analyst gaps.

The F054 return-#1 Analyst validation for effective head
`f3f925c883b94327876a9f7c053917afdb56f777`, and every earlier Analyst marker,
is historical and superseded for merge authority by this return-#5 validation.

### Renewed combined validation after feature 054 — 2026-10-05

- Analyst validation pass: passed
- Final Analyst validation completed at: 2026-10-05T01:46:00Z
- Analyst validated effective content head: f3f925c883b94327876a9f7c053917afdb56f777
- Analyst return count: 0 / 5.
- Combined PR-set coverage: PR #217 on branch `codex/051-asset-retention`
  contains F051 asset retention, this closed F052 provenance cycle, F053
  security refresh, and the required F054 post-limit hardening cycle. All
  behaviorally meaningful content is present in the effective head above; the
  later uncommitted changes present during this validation are role-owned
  final-validation evidence only.
- Customer-intent validation: R052-1 through R052-8 and their required negative
  scenarios remain satisfied in spirit and letter. Durable Compose-project
  adoption, lifecycle continuity, explicit caller choice, clean-install
  behavior, ambiguity rejection, and fail-closed project isolation are
  preserved. The three findings discovered after F052's 10/10 return limit were
  correctly moved into F054 rather than becoming an invalid return #11.
- F054 boundary validation: output and export durability now precede B current
  activation; descriptor-bound marker reads reject symlink, FIFO, wrong-type,
  unreadable, and substituted objects; and a no-follow `current` classification
  permits genuine absence, forwards a present symlink to strict validation, and
  rejects present non-symlinks before mutation. The legacy-aware promotion
  exact-retry regression proves a recoverable fault preserves A and both bound
  journals, while the identical request later converges to B and clears them.
- Evidence: F054 direct controls passed 4/4, return #1 control passed 1/1,
  staging passed 58/58, combined contracts passed 105/105, full preflight
  passed 655/655 Node tests plus build/service-worker generation and 158/158
  Playwright tests, and isolated Docker lifecycle
  `cabadrive-retention-10658-1791164306953` passed. Exact-head bounded Review
  passed without findings and all originating/follow-up threads are resolved.
- Process validation: F052 remains complete and closed at Architect return
  count 10/10; F054 owns the escalated work and passes at 1/10. Analyst return
  count is 0/5. No unresolved task, feedback, technical finding, accepted known
  issue, or customer-intent gap remains. Exact-current-head checks,
  thread/conflict verification, and the evidence-only guard remain Orchestrator
  merge gates rather than Analyst gaps.

The final-return-#10 Analyst validation for effective head
`d4fd6d9ffb5c5c7442d6e728410abc3d91062472`, and all earlier Analyst markers,
is historical and superseded for merge authority by this combined F054
validation.

### Renewed validation after final Architect return #10 — 2026-10-04

- Analyst validation pass: passed
- Final Analyst validation completed at: 2026-10-04T10:10:23Z
- Analyst validated effective content head: d4fd6d9ffb5c5c7442d6e728410abc3d91062472
- Analyst return count: 0 / 5.
- Combined PR-set coverage: PR #217 on branch `codex/051-asset-retention`
  covers feature 051 asset retention, this feature 052 Compose-project
  provenance cycle, and feature 053 brace-expansion security refresh. The
  effective head above contains all product, test, documentation, dependency,
  and disposition content; the later uncommitted changes present during this
  validation are role-owned final-validation evidence only.
- Customer-intent validation: R052-1 through R052-8 and all required negative
  scenarios are satisfied in spirit and letter. Provenance, durable adoption,
  lifecycle continuity, explicit caller choice, clean-install behavior,
  ambiguity rejection, and fail-closed safety remain intact. R052-021 correctly
  distinguishes an authoritatively confirmed absence of legacy state from a
  present but invalid legacy entry: the former permits a complete candidate
  publish/export, while every present entry is forwarded for strict validation
  and cannot degrade into a candidate-only success.
- Evidence coverage: the direct clean-no-pointer regression passed 1/1 and
  proves candidate bytes reach both committed retained state and the exported
  destination. Existing legacy-byte coverage remains exact, while supplied
  missing/incomplete legacy inputs fail before state, publish output, or
  destination creation. Combined focused contracts passed 101/101; full
  preflight passed 651/651 Node tests plus build/service-worker generation and
  158/158 Playwright tests; isolated Docker lifecycle
  `cabadrive-retention-46613-1791042391648` passed.
- Review and process validation: exact-head bounded Review Agent inspection
  passed without findings and `r4173723121` is resolved. Feature 051's
  append-only/shell-last contract and feature 053's narrow audited security
  resolution remain preserved. R052-001 through R052-021 are complete at the
  maximum Architect return count 10/10; Analyst return count remains 0/5. No
  new-feature escalation is required because no customer or architecture gap
  remains. Exact-current-head checks, complete thread/conflict inspection, and
  the evidence-only guard remain Orchestrator merge gates.

The return-#9 Analyst validation for effective head
`dbe850e8979a2595fa065a04a28c32661f8f4250`, and all earlier Analyst markers,
is stale and explicitly superseded by this final return-#10 validation.

### Renewed validation after Architect return #9 — 2026-10-03

- Analyst validation pass: passed
- Final Analyst validation completed at: 2026-10-03T15:29:53Z
- Analyst validated effective content head: dbe850e8979a2595fa065a04a28c32661f8f4250
- Analyst return count: 0 / 5.
- Combined PR-set coverage: PR #217 on branch `codex/051-asset-retention`
  covers feature 051 asset retention, this feature 052 Compose-project
  provenance cycle, and feature 053 brace-expansion security refresh. The
  effective head above contains all product, test, documentation, dependency,
  and disposition content; the later uncommitted changes present during this
  validation are role-owned final-validation evidence only.
- Customer-intent validation: R052-1 through R052-8 and all required negative
  scenarios are satisfied in spirit and letter. The provenance, adoption,
  lifecycle-continuity, explicit-choice, clean-install, ambiguity, and
  fail-closed guarantees remain intact. Return #9 additionally ensures the
  documented fresh static-export entry point cannot bypass the established
  outgoing-runtime capture boundary: `publish-export` requires the validated
  legacy handoff and stages it before publish/export, preserving legacy assets
  in both release state and the exported artifact. Missing or invalid authority
  creates neither publication output nor destination.
- Evidence coverage: the direct R052-020 control passed 1/1, combined focused
  contracts passed 101/101, full preflight passed 651/651 Node tests plus
  production build/service-worker generation and 158/158 Playwright tests, and
  isolated Docker lifecycle `cabadrive-retention-33337-1791040747514` passed.
  Exact-head bounded Review Agent inspection passed without findings and the
  prior export-bootstrap P1 is resolved.
- Cross-feature and process validation: feature 051's append-only/shell-last
  safety and feature 053's narrow audited dependency resolution remain
  preserved. R052-001 through R052-020 are complete at Architect return count
  9/10; Analyst return count remains 0/5; no unresolved task, feedback,
  technical finding, accepted known issue, or customer-intent gap remains.
  Current-head required checks, complete thread/conflict inspection, and the
  evidence-only guard remain Orchestrator merge gates rather than Analyst gaps.

The return-#7 Analyst validation for effective head
`efaa9fe3d74f8d13d029286e6689fc46591f78b5`, and all earlier Analyst markers,
is stale and explicitly superseded by this return-#9 validation.

### Renewed validation after Architect return #7 — 2026-10-01

- Analyst validation pass: passed
- Final Analyst validation completed at: 2026-10-01T17:07:24Z
- Analyst validated effective content head: efaa9fe3d74f8d13d029286e6689fc46591f78b5
- Analyst return count: 0 / 5.
- Combined PR-set coverage: PR #217 on branch `codex/051-asset-retention`,
  covering feature 051 asset retention, this feature 052 Compose-project
  provenance cycle, and feature 053 brace-expansion security refresh. Current
  PR head and effective content head are the same commit with no later delta.
- Customer-intent validation: R052-1 through R052-8 and all required negative
  scenarios are satisfied in spirit and letter. R052-014 pins the canonical
  release root returned by handoff validation so a concurrent `current` repoint
  cannot redirect inventory copy. R052-016 opens release metadata with
  no-follow/nonblocking semantics and accepts it only when descriptor and path
  identify the same regular file. R052-017 publishes `source-id` and
  `source-kind` through exclusive temporary regular files and a no-replace
  hard-link claim, allowing idempotent/same-value convergence while refusing
  symlink, substitution, truncation, and conflicting-writer races.
- Evidence coverage: the four direct regressions passed 4/4, full staging
  passed 55/55, combined capture/staging passed 89/89, full preflight passed
  647/647 Node tests plus build/service-worker generation and 158/158
  Playwright tests, and the isolated real Docker lifecycle passed. Exact-head
  Review Agent passed without findings; full two-page thread enumeration shows
  every return #7 thread resolved and no new thread.
- Cross-feature and process validation: the changes preserve feature 051's
  retained-assets/shell-last safety contract and feature 053's narrow audited
  security refresh. R052-001 through R052-017 are complete at Architect return
  count 7/10; Analyst return count remains 0/5; no unresolved task, feedback,
  finding, accepted known issue, or customer-intent gap remains.

The Analyst validation for effective head
`5da4cc28a9a722c0b2880f98c07afaf03d5e9600`, and every earlier Analyst marker,
is stale and explicitly superseded by this return-#7 validation.

### Renewed validation after Architect return #6 — 2026-10-01

- Analyst validation pass: passed
- Final Analyst validation completed at: 2026-10-01T16:31:06Z
- Analyst validated effective content head: 5da4cc28a9a722c0b2880f98c07afaf03d5e9600
- Analyst return count: 0 / 5.
- Combined PR-set coverage: PR #217 on branch `codex/051-asset-retention`,
  covering feature 051 asset retention, this feature 052 Compose-project
  provenance cycle, and feature 053 brace-expansion security refresh. Current
  PR head equals the effective content head exactly, with no later delta.
- Customer-intent validation: R052-1 through R052-8 and every required negative
  scenario are satisfied in spirit and letter. All R052-001 through R052-013
  findings have role-correct dispositions and implementation. In particular,
  return #6 closes the metadata-only/not-current retry gap: pre-existing
  candidate metadata is verified and the metadata file, metadata directory,
  and complete directory chain to state are durably synchronized before
  `makeCurrent`; an injected failure at each barrier leaves A selected, and a
  clean retry orders every barrier before activation and selects verified B.
- Earlier provenance guarantees remain intact: uniquely discovered non-default
  identity is durably adopted before replacement and survives loss of discovery
  evidence; explicit caller choice is not spuriously persisted; genuine clean
  install remains `cabadrive`; ambiguity, invalid state, unsafe selected
  children, token parsing, concurrent first-writer, rename, and durability
  failures all remain fail-closed before unintended Docker lifecycle mutation.
- Verification evidence: focused staging passed 52/52; full preflight passed
  644/644 Node tests, production build/service-worker generation, and 158/158
  Playwright tests; the isolated real Docker lifecycle passed and self-cleaned.
  Exact-head Review Agent passed with no finding, all five required GitHub
  checks are green, and complete paginated review-thread inspection confirms
  all threads resolved with no new thread.
- Cross-feature and process validation: the correction preserves feature 051's
  retained-assets/shell-last contract and feature 053's narrow truthful
  security refresh. Architect return count is 6/10, Analyst return count is
  0/5, and no unresolved feedback, accepted known issue, conflict, open task,
  or further customer-intent gap remains.

The 2026-09-30 Analyst validation for effective head
`8f785ed08c16d2202867310f9ad4afab4f40dbdb` is stale and explicitly
superseded by this validation because R052-013 changed durability behavior.

- Analyst validation pass: passed
- Final Analyst validation completed at: 2026-09-30T17:05:35Z
- Analyst validated effective content head: 8f785ed08c16d2202867310f9ad4afab4f40dbdb
- Analyst return count: 0 / 5.
- Combined PR-set coverage: PR #217 on branch `codex/051-asset-retention`,
  covering feature 051 asset retention, this feature 052 Compose-project
  provenance cycle, and feature 053 brace-expansion security refresh. Current
  pre-validation-evidence head
  `19b0c9f8ab255dac9ba3c8f3a988e5626d184e27` adds only feature-052/053
  verification/process evidence beyond the effective content head, with the
  final Architect PASS recorded in Architect-owned task memory.
- Customer-intent validation: R052-1 through R052-8 and all required negative
  scenarios are satisfied in spirit and letter. The recorded Make-level and
  resolver regressions prove that a uniquely discovered non-default project is
  identified with explicit provenance, durably adopted before replacement,
  and reused after historical evidence disappears. Explicit caller choice is
  not falsely adopted, genuine clean install remains `cabadrive`, invalid or
  ambiguous discovery fails before Docker mutation, and unsafe selected-child,
  token parsing, concurrent first-writer, rename, and durability paths remain
  fail-closed.
- Evidence coverage: all bounded R052-001 through R052-012 findings were
  implemented and dispositioned. The final focused capture/staging suites
  passed 85/85; full preflight passed 643/643 Node tests, production build and
  service-worker generation, and 158/158 Playwright tests; the isolated real
  Docker lifecycle passed and self-cleaned. Exact-head Review Agent and native
  Codex review found no technical defect. There is no unresolved Implementation
  Agent feedback, accepted known issue, or further customer-intent gap.
- Cross-feature consistency: this provenance correction preserves feature
  051's retained-asset and shell-last safety contract and feature 053 changes
  only the vulnerable transitive dependency graph. The combined PR has one
  renewed effective content head and no contradictory claim that the older
  feature-051 validation alone authorizes merge.
- Merge-gate boundary: the required `AI Review`, validation-only thread
  resolution, current-head required-check/conflict verification, and
  Orchestrator evidence-only guard/finalizer remain mandatory and are not
  waived by this PASS.


## Final Analyst Validation Notes

Analyst validation pass: passed
Final Analyst validation completed at: 2026-10-08T18:32:41Z
Analyst return count: 0 / 5
Analyst validated effective content head: 0a378d4e6be1d549dcc8a1fcd3dfe5c3d3c9f662
Analyst validation evidence: Orchestrator explicitly invoked renewed 052-compose-project-provenance final acceptance after the same-head Architect pass at2026-10-08T18:30:22Z. Analyst inspected original customer intent/acceptance, integrated code/test/docs/dispositions, current canonical process records and actual raw finalpreflight/Docker evidence on committed effective0a378d4e6be1d549dcc8a1fcd3dfe5c3d3c9f662. This is a fresh integrated validation; prior dated originalfeature passes remain historical and do not authorize the new content.
Customer intent check: passed. OriginalR052-1–R052-8 are satisfied: the actual Make-to-capture boundary preserves caller-explicit versus discovered provenance; unique historical project adoption is durable before replacement; later build/up/down/stage retain one project and state volume after historical discovery disappears. Explicit choices remain authoritative without accidental adoption; clean installs remaincabadrive; ambiguous, unsafe, unreadable and failed-adoption controls fail closed before replacement. Current process memory supersedes dated contradictory validation claims.
Analyst validation evidence: Integrated full preflight passes688/688 unit and164/164 desktop/mobile browser cases, including11hostile source-identity/retirement/fault/substitution/retry/protected-state controls, inherited six realHTTPfreshA/originB/defaultnegative/503atomic-offline controls, retained-origin and destructive-deploy negatives. Raw finalpreflight log SHA256f117e96bbf79052c07d241fdc568459c9601e96b02a1b8450e9fcfa0cb7e6f46 and actualDocker log SHA25629ebc263b5d904b9da9a88c7a2ea2d6a5c8f652e0cc80a040d4b4b55fe0c68e1 independently recomputed; no incomplete preliminary run is counted.
Analyst validation evidence: Actual DockerNode22 lifecycle on isolated5197 projectcabadrive-retention-15496-1791483535389 and derived running/stopped/initial projects proves exact legacyA bytes, current shell/worker, persistence and sibling sentinel preservation. Real kernel-lock/killed-publisher/new-process retry and A/B/C/D publication exerciseC-retirement-unlink fault thenD convergence with exactly two protected generation links/two trees/no retirement journal. Twenty-seven inspected HTTP responses across three installations have all five exact security headers including200/404, current+retained immutable assets, stable86400/SWR604800 content, SWno-cache, no long-lived shell/error cache, gzip and actual nginxmaster/runtimeUID101. Host exports are removable without privilege and own runner resources are cleaned while siblings survive.
Analyst validation evidence: Frozen lock is byte-identical to verified214 mergedmain1e3507e2363314340eed43c0d77dd3d0acbc92cf, SHA256100de609ab9ff12d49d738a8f99e62ea57c09f12502721be38f2f1267d496db3. Thus the independently verified fullOSVv2.3.5 graph241packages/zero findings applies to exactly the same dependency bytes, including both safe brace lines and source-map-js1.2.2. This supports acceptance without replacing217's mandatory exact-current-head remoteOSV gate.
Gaps, if any: none remaining in the scoped originalfeature engineering/customer outcome. Preserve authentic Architect counts05110/10,05210/10,0530/10,0546/10 and this feature's Analyst0/5. Historical original051/052 exhausted budgets remain exhausted; later052/054/055 ownership does not reset them or invent an extra old-cycle return. Current055R1/R2/R3/R2a/R2b findings are explicitly resolved without accepted defective behavior.
Architect disposition routing: Latest same-head Architect pass for 052-compose-project-provenance retains return10 / 10 and no open engineering dispositions. Current canonical acceptance/currentmemory/feedback are true and accepted-known-issue-decision-pending false; all scoped feedback is disposed.
Analyst validation evidence: This pass covers sole combined original051/052/053/054 PR217 implementation on effective0a378d4e6be1d549dcc8a1fcd3dfe5c3d3c9f662. Actual214 merge is a verified prerequisite, not a claimed217 result.055 cumulative final validation and downstream215 remain excluded until terminal215 integration following verified217 merge. Orchestrator must still validate the exact published head and allowed eight-role-file evidence union, all five required checks, complete paginated native/independent review, resolved conversations, conflicts/current-head guard, finalizer dry run and actual GitHub squash merge. No current remote-green,217 merge,215 completion or055 cumulative pass is asserted here.


## Final Analyst Validation Notes

Analyst validation pass: passed
Final Analyst validation completed at: 2026-10-08T19:07:38Z
Analyst return count: 0 / 5
Analyst validated effective content head: 356c9c03b0d46cf5e8215d397d8b5a5d57624b96
Analyst validation evidence: Explicit Orchestrator invocation follows exact-current-content independent Review PASS and all-four Architect PASS at2026-10-08T19:05:42Z on the same committed effective content head. Analyst inspected current original 052-compose-project-provenance acceptance and the full0a..356 substantive runtime/test/docs/process delta, raw before/afterLinux telemetry and renewed verification. Earlier0a/aca role/CI passes remain historical and superseded for this merge authority.
Customer intent check: passed. OriginalR052-1–R052-8 remain satisfied: real Make/capture provenance retains explicit versus discovered choices, durable unique adoption precedes replacement, later lifecycle commands retain the same project/state, clean installs remain stable and ambiguous/unsafe/adoption-failure cases fail closed. Current process evidence correctly supersedes historical validation claims.
Analyst validation evidence: C055-217-R2c repairs an actual production authority gap. LinuxNode20 telemetry shows active/rollback symlinks recreated with the same reused inode but changedctimeNs/birthtimeNs were accepted by oldschema1; the fixed production verifier rejects those exact same-inode replacements. Schema2 requires canonical exact bigint generation strings on current/protected/retiring symlinks plus device/inode/target and rechecks them at destructive/callback/journal-clear boundaries. Missing/malformed fields and oldschema1 fail closed without mutation; mutable tree-directory timestamps remain unpinned for legitimate partial cleanup. Documented platform-dependent timestamp precision is not falsely described as universally unique.
Analyst validation evidence: Original immediate ABA controls remain, deterministic retained-original-inode controls supplement them,64bad-generation/schema controls and12callback/partial/clear substitutions fail closed; untouched/partial retry and interruptedC-beforeD convergence still succeed. Full hostile safety13/13 passes independently on actualLinuxNode20 and bundledNode24 with zero skips, and final fullpreflight passes690/690unit plus164/164browser scenarios. Raw logs SHA256Linux1fe53949e94815138a86f4465a8ef7e1e7ddb07559d9e6cdebabcddeeca3fc30, hostb2d5bd1e65dc644933fcc10f7dea85ee31edd39dd12ec0104a34499ef3b52c38 and preflighta349a93a72ac4af94de9d4acd5ced3c227db9ced903d0e13dee1735b7c11165a independently recomputed. No sleep, skip, relaxed test or test-only dismissal substitutes for the production repair.
Analyst validation evidence: Rebuilt actualDockerNode22 projectcabadrive-retention-21212-1791485551007 on5197 verifies running/stopped/initial migration, exact retainedA/currentBworker, restart/down-up, clean404 and sibling isolation, real kernel lock/killed-publisher/new-container retry, schema2 interruptedC→D exactlytwo protectedlinks/twotrees/nojournal and removable host export. Twenty-seven actual responses preserve exact five security headers on200/404, correct current+retained/stable/SW/shell/error caching, gzip and nginxmaster/runtimeUID101. Raw Docker log SHA25607a31d529bb4ac98e9f743d9685019d4d92e47e363a7fa782353aaf0f2f20ed8 recomputed; lock remains identical214main SHA256100de609ab9ff12d49d738a8f99e62ea57c09f12502721be38f2f1267d496db3, supporting241/0OSV without replacing exact-new-head remote scan.
Gaps, if any: none in current scoped customer/engineering acceptance. Preserve originalArchitect05110/10,05210/10,0530/10,0546/10 and eachAnalyst0/5. New055 owns the authentic R2c Architectreturn1/10; this validation does not reset budgets or invent an extra originalfeature return. Latest same-head Architect notes have no open engineering dispositions, and current canonical acceptance/memory/feedback remain true with no undisposed accepted known issue.
Architect disposition routing: C055-217-R2c production fix and renewed Linux/host/Docker evidence are explicitly resolved. ExistingR1/R2/R3/R2a/R2b and originalfeature dispositions remain closed; no accepted defective behavior or unresolved owner-risk decision remains.
Analyst validation evidence: Scope remains sole combined original051–054 PR217 on effective356c9c03b0d46cf5e8215d397d8b5a5d57624b96. Verified214 merge is its prerequisite;215 and cumulative055 terminal validation remain downstream. Orchestrator must still prove the exact published-head/eight-role-file evidence union, all five required remote gates, complete paginated native/independent review, resolved conversations, conflicts/current-head guard, finalizer dry run and actual GitHub squash merge. No217merged/current-remote-green/215complete/055cumulativePASS is claimed by this role note.


## Final Analyst Validation Notes

Analyst validation pass: passed
Final Analyst validation completed at: 2026-10-08T19:48:19Z
Analyst return count: 0 / 5
Analyst validated effective content head: 98ea11276ec10d9f325331c339b2ffd9e8b6e0e2
Analyst validation evidence: Orchestrator explicitly invoked this renewed 052-compose-project-provenance acceptance after exact98ea independent Review PASS and all-four same-head Architect PASS at2026-10-08T19:45:59Z. Analyst inspected original intake/acceptance, complete8c5aee07..98ea substantive production/test/docs/disposition delta, actualoldbug reproductions and final rawverification; older356/8c5 passes and CI remain historical and superseded for current merge authority.
Customer intent check: passed. R052 real Make/capture explicit-versus-discovered provenance, durable adopted identity before replacement, consistent later lifecycle, clean-default and unsafe/ambiguous/adoption-failure controls remain satisfied; both visible adopted records and temporary claims now retain exact descriptor/root authority. Original217-before215 sequencing is preserved; completing actual review defects strengthens safe deployment and does not waive the user's quality requirement.
Analyst validation evidence: Actualred controls demonstrate oldwrong-descriptor hashing, adopted-read/temporary-claim foreign authority, root-capable externalsentinel ownership mutation and unsafe next-sourceFIFO copy blocking. Consolidated production fixes bind regular read/hash/copy/fsync to one O_NOFOLLOW|O_NONBLOCK descriptor with exact bigint identity and repeated pathname checks; adoption retains root/record/temp-claim identity across barriers and admits only deliberate own link-count/ctime transitions. Source bytes/digest are checked before destination admission; ownednlink1 equal overlap succeeds while collision/foreign-hardlink aliases reject before pinnedfchown. Directory sync uses O_DIRECTORY|O_NOFOLLOW|O_NONBLOCK and descriptor/path device/inode, without invalid mutable-directory-time coupling. No test-only dismissal, sleep, skip or public test hook substitutes for these repairs.
Analyst validation evidence: LinuxNode20 root23/23 combines descriptor10 with prior retirement13; bundledNode24 descriptor10/10 independently passes, both with zero skips. Fullpreflight700/700unit and164/164browser passes all quality/content/memory/build guards. Raw hashes recomputed: preflightba5c9e845ed68451292a9f2fbecd3a7db190e08bc6dd7e007e2819ba2c5dbb00, Linux6a1c9253ddba8aad3977d713a341629f4ab0043350b83785bba50714997dd533 and host7149a71abcc5f432564afaddb9285e6d4b46360070494aaba7461a4100d72590. Hostile type/substitution/inline-restoredmtime/adoptionclaim/root/hardlink/directory controls preserve external bytes/uid/gid/mode and prompt-reject unsafe source types; positive equal-overlap/adoption/retry/inventory behavior remains passing.
Analyst validation evidence: Rebuilt actualDockerNode22 projectcabadrive-retention-36884-1791488043673 on5197 passes running/stopped/initial migration, exactretainedA/currentworker, restart/down-up, sibling isolation, real kernel-lock/killed-publisher/new-container retry and interruptedC→D boundedtwo protectedlinks/twotrees/nojournal with host-removable owned exports. All27live responses retain five security headers200/404, correct cache policies/gzip and actual nginxmaster/runtimeUID101; raw Dockerhash78593d06ccf9c0d26268493f137f895ceb49c1689201aacaa54a9a2718a01fe8 matches. Safe frozen lock is unchanged214-main; exact new-head remoteOSV and all five gates remain independent required checks.
Gaps, if any: none in scoped customer/engineering acceptance. Preserve originalArchitect05110/10,05210/10,0530/10,0546/10 and eachAnalyst0/5 without resets. New055 owns authentic R2d consolidation return2/10 and all bounded accepted extensions, including confirmed unsafe source-open and directory/ownership/overlap refinements; no extra originalfeature return or accepted defective behavior is invented.
Architect disposition routing: Latest same98ea Architect notes close all engineering dispositions and report canonical acceptance/currentmemory/feedbacktrue with undisposed knownissuefalse. Earlier provisional broadercopy not-needed assumption was truthfully superseded by measured unsafe-open repair; no pending scope decision remains.
Analyst validation evidence: This covers only combinedoriginal051–054 PR217 on effective98ea11276ec10d9f325331c339b2ffd9e8b6e0e2; verified214merge is its prerequisite. Orchestrator still must verify exact published head/eight-role-file evidence union, allfive remotechecks, complete paginated native/independent review, resolved conversations, conflict/current-head guards, finalizer dryrun and actualGitHub squash merge. No currentremote-green/217merge/215completion/cumulative055PASS is claimed; downstream215 and terminal055 remain separately ordered.


## Final Analyst Validation Notes

Analyst validation pass: passed
Final Analyst validation completed at: 2026-10-08T20:51:12Z
Analyst return count: 0 / 5.
Analyst validated effective content head: 28c618eff7229b6b0750609f0e9e76c0df5eb2bc
Customer intent check: Passed. Discovered versus explicit project provenance remains authoritative through Make/capture. Valid discovery is durably adopted before image replacement and reused by later lifecycle commands; explicit choice does not become adoption, clean install retains cabadrive, and ambiguity/unsafe discovery or failed adoption abort before mutation. Exact label/path transport now also preserves supported pipe/comma/quote checkout identity and prevents LF sibling substitution.
Analyst validation evidence: Renewed validation follows exact-content independent Review PASS and allfour Architect PASS at2026-10-08T20:48:32Z on the same effective content SHA. Read original intake expectations, current accepted dispositions/first verification evidence, changed capture/export authority and actual raw logs; earlier98ea/62e role passes are historical after R2e content changes. Original Architect budgets05110/05210/0530/0546 and all Analyst0/5 are preserved; new055 owns the authentic R2e integration return3/10.
Analyst validation evidence: Fresh quality/frozen-install/typecheck/lint/format/content/negative contracts/fullunits712/712 and production build pass in /tmp/cabadrive-217-r2e-quality-final.log (SHA2569f02d012e9cb712534c80d894276d153659928c4b438a8381f8c3667bd2aadbe). Actual Linux20 affected54/54, zero failures/skips, pass in /tmp/cabadrive-217-r2e-linux20-guard-final.log (SHA25654cfe370dac1c09c820530b0327e26f80ab07b7cf4a01b0e53d0afd8d6f16358). Real final Docker73083 proves supported pathological running/stopped adoption, exact retainedA/currentB worker, restart/down-up, external LF export and measured unsupported-LF checkout ZERO Docker calls/no handoff with historical container ID/image/state/A plus sibling bytes/metadata preserved; all27HTTP responses have required cache/security/gzip and UID101. Raw /tmp/cabadrive-217-r2e-runtime-guard-final.log SHA256364cd1ad9c27b9d0f2b89a710c92410c4a07ea4d3de0eaa38e5b7fdbbfb180e4.
Analyst validation evidence: Proportional browser evidence is explicit:3008 critical tracked blobs unchanged against98ea (manifest16c6312168d3ef61346387530b2a8fc3037ff5dd133552be6cbb4f7929008fd9) and2357 served files equivalent after ONLY unchanged-generator CACHE_NAME timestamp normalization (manifestfb5b4027223061fe03fc3856350b877da871a2f6733ae44e6b1a73e4ddf479f8), raw /tmp/cabadrive-217-r2e-identity-final.log SHA2560e16f3d7e2d90d40956ab5be264601e32031a07966519628cb9e1d1e6fd8f719. Prior actual164/164 browser scenarios carry through this bounded equivalence; no fresh local164 run or raw whole-tree identity is claimed. Prior corrected68896 cross-container lock/killed-publisher retry/C-to-D controls remain separately preserved, not a false overall pass of its subsequent exploratory LF failure. Focused final Docker omitted only those unchanged subcalls under accepted disposition; committed/default CI runner retains them.
Gaps, if any: None in validated original customer scope and engineering evidence. Live exact-published-head five required checks, full review pagination/resolved conversations, conflicts and strict expected-head finalizer remain Orchestrator gates; this validation does not claim remote green,217 merge,215 completion or cumulative055 PASS.
Architect disposition routing: All scoped engineering feedback is disposed and canonical current-memory/acceptance/feedback readiness is recorded; no pending owner-risk decision or new Analyst return.
Analyst boundary reminder: Addition-only original intake final notes; no055, canonical tasks, spec, plan, product or sibling changes.


## Final Analyst Validation Notes

Analyst validation pass: passed
Final Analyst validation completed at: 2026-10-08T21:44:21Z
Analyst return count: 0 / 5.
Analyst validated effective content head: f8953ea9d0868eec15d270222e307c02e769acc4
Customer intent check: Passed. Discovered versus explicit Make/capture provenance, durable adoption before replacement, later same-project/state reuse, explicit non-adoption, clean cabadrive and fail-closed unsafe/ambiguous discovery remain satisfied. Pathological pipe/comma/quote migrations and LF pre-mutation rejection still preserve exact checkout/project and sibling authority.
Analyst validation evidence: Read original customer acceptance, current full engineering/dispositions, new stager/export/probe and fixture evidence, after exact-content Review PASS and allfour Architect PASS at2026-10-08T21:42:13Z on the same content. Original05110/05210/0530/0546 and each Analyst0/5 remain intact; new055 owns genuine consolidated return4/10. Earlier28c/c970 roles are historical after runtime changes.
Analyst validation evidence: Actual fresh fullpreflight passes721/721unit and164/164desktop-mobile browser plus quality/content/frozen-install/build in /tmp/cabadrive-217-r2fg-preflight-final.log SHA25676337c1d05593c673b639a7d39892c7b8272e80c3afd19cbe175a76c9c8d670d. Final deterministic observable-generation fixture refresh passes721/721unit0failures0skips, /tmp/cabadrive-217-r2g-units-final.log SHA256062b2e0d24c44f2cd28295b4085b970c73a192e9b175461a806e5ada17c66f1f. This is fresh changed-runtime proof; prior3008 tracked-blob/normalized served identity carry is historical and is not asserted for new stager content.
Analyst validation evidence: LinuxNode20 UID1001 nine selected new authority fault groups pass;87 name-filter exclusions are explicitly unexercised, /tmp/cabadrive-217-r2g-linux-nonroot-final.log SHA256eb86e052849ef05c4fb2833700698867169212c9c070559e67e940b3f21fc48e. Actual root-stager observes UID/GID1001 mapped owner witness and proves exact export/retry, ordinary-user read/write/recursive removal, no probe orphan and readonly witness sentinel preservation, /tmp/cabadrive-217-r2g-linux-mapping.log SHA2561add21b2d341f3e58ab1bf7dc7191fa795ced35b42bccf12b006d7edb50ea285. R2f authentic host EACCES is handled by bounded readonly container inspection/scoped cleanup preserving0600/0700 and private generations; no permission waiver.
Analyst validation evidence: Full DEFAULT Docker runner6271/port5871 completes running/stopped/initial A/B/SW migrations, restart/down-up, pathological paths and LF pre-mutation negative, ALL kernel-lock/killed-publisher/C-to-D subcalls, exact host-owned removable exports,27liveHTTP five-security-header/cache/gzip/200404 controls and nginx/runtimeUID101. Raw /tmp/cabadrive-217-r2fg-docker-final-proper.log SHA25614a7e1e332e2c4af1ac9e914fb519c34491f8137e8920bb1b9ef93e5489068dd. Oldc970 symlink chmod/FIFO and rejected prototype foreign-inode deletion are real red; current single-stager randomO_EXCL/nofollow/nonblock0600/nlink1 creatorFD stays held through observed mapping/fchown, admission, durability, activation/journalclear and finally. Replacements remain untouched, partial-open descriptors close, and one bounded persistent readonly mapping witness carries owner class without creator/deletion authority.
Gaps, if any: None in the validated original engineering/customer scope. Exact published-head five live checks, review pagination/resolved conversations/conflicts and strict expected-head finalizer remain Orchestrator gates. No remote-green,217merge,215completion or cumulative055PASS claim.
Architect disposition routing: All scoped engineering feedback is resolved and current acceptance/memory/feedback is ready; no pending owner-risk decision or additional Analyst return.
Analyst boundary reminder: Only originalfour feature-request final notes appended; no055, product, task, plan, spec or canonical edits.


## Final Analyst Validation Notes

Analyst validation pass: passed
Final Analyst validation completed at: 2026-10-09T03:57:58Z
Analyst return count: 0 / 5.
Analyst validated effective content head: 1622e74c831bf57ce4c5be8e20e4803d42901c38
Customer intent check: Passed. Make/capture retains discovered versus explicit project authority, durably adopts discovery before replacement and reuses that exact project/state later. Explicit caller choices do not become adoption, clean installs select cabadrive, and unsafe/ambiguous discovery fails closed. Runtime labels are classified on captured immutable image IDs; unavailable captured images do not fallback to mutable tags. Existing independently verified handoffs are reused only in accepted recovery branches, preserving prefeature source comparison/recapture and sibling isolation.
Analyst validation evidence: Renewed original full-scope validation follows exact-content Review PASS and allfour Architect PASS at2026-10-09T03:55:52Z on the same effective content. Read current original acceptance/dispositions/canonical memory, immutable-image classification and bounded handoff-verifier reuse, new positive/negative tests and actual raw full verification. Earlierf895/dec25/8b role checkpoints remain historical after changed runtime content. Preserve original Architect10/10,10/10,0/10,6/10 and all Analyst0/5; new055 owns genuine R2h/R2i repairs and current6/10.
Analyst validation evidence: Fresh fullpreflight EXIT0 proves726/726unit0failures0skips and164/164actual desktop/mobile browser scenarios with all memory/repository/content/attribution/typecheck/lint/format/negative-quality/build gates. Raw /tmp/cabadrive-217-r2i-preflight-final.log SHA256e02147ea2e49ffaf1743020b73403e126b39415a45c6500851b90fe67b37a5d6. Focused source-matrix controls5/5 exercise both image-only and entirely absent source with independently valid A and missing/corrupt/foreign/invalid-kind rejection; prefeature identity comparison/recapture, verified-state priority and no-state clean semantics are preserved. Earlier R2h failed initial-browser attempt is historical, not a current successful proof.
Analyst validation evidence: FULL DEFAULT Docker53684/5197 EXIT0 verifies authentic firststage after-assets interruption, rejected/incomplete state, down/removal of historical source, labeled B image-only rebuild then removed-B-image absent-source rebuild. Exact original A bytes/source-ID/kind/inventory/pointer generation and sibling authority survive before valid B/A activation; no create/copy of postfeature content or rejected-state laundering occurs. All prior kernel-lock/killed-publisher/C-to-D, running/stopped/initial, literal paths, private inspection/mapped-owner/export/retry/removal and27HTTP five-security-header/cache/gzip/200404 controls pass with actual nginx/runtimeUID101. Raw /tmp/cabadrive-217-r2i-docker-final.log SHA256c77b5abd6bf2daf01bc5e88e953263ac457099e9a775eeb875a54355752166f3.
Gaps, if any: None in the validated original full customer scope and engineering. Exact published-head five live checks, complete review pagination/resolved conversations/conflicts and strict current-head expected-head finalization remain Orchestrator gates. No217merge, remote-allgreen,215completion or cumulative055PASS is claimed.
Architect disposition routing: All current scoped engineering feedback is resolved; acceptance/memory/feedback readiness and no pending owner-risk decision are recorded. No new Analyst return or budget reset.
Analyst boundary reminder: Addition-only recognized originalfour intake final notes; no055, product, task, spec, plan or canonical edits.
