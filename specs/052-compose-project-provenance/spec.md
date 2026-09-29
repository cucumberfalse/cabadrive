# Specification: Preserve Compose Project Provenance Across Make

## Cycle Context

- Feature: `052-compose-project-provenance`.
- Source: Analyst-owned `feature-request.md`; assumptions A1-A7 are accepted.
- Role: Architect. This feature's `spec.md`, `plan.md`, and `tasks.md` are
  Architect-owned.
- Verified latest `origin/main` supplied by Orchestrator:
  `2a92bcfcb7638d1094f33b28e4c2932fb2e4121e`.
- Assigned fallback worktree/branch/PR:
  `/Users/chap/devel/cabadrive-worktrees/051-asset-retention`,
  `codex/051-asset-retention`, PR #217 at intake head
  `80d212ae76e84c1ad1ce8191a1609362a4c48eb8`.
- This is a new work cycle because feature 051 exhausted its Architect return
  count. It intentionally shares PR #217 because the affected implementation is
  unmerged and absent from `main`; this is a documented one-PR fallback, not a
  general workflow change.
- Parallel work exists. Preserve every sibling worktree, branch, commit, diff,
  PR, Docker project, and process-memory record. Do not mutate PR #214 or #215.

## Goal

Keep one uniquely discovered historical Docker Compose project authoritative
across `make build` and every later lifecycle command. The adoption record must
be durable before Docker build can replace the historical discovery evidence,
while a caller-explicit project remains a non-persisted one-command override.

## Scope

In scope:

- The Make-to-capture boundary for `make build`.
- Focused capture/Make regression coverage for discovered, explicit, default,
  ambiguous, unsafe, Docker-failure, and adoption-publication-failure paths.
- Feature-052 process memory and the narrow Architect-owned reconciliation of
  feature-051's already completed final Analyst validation.
- Renewed exact-head review, required checks, final Architect validation, final
  Analyst validation, and current-head guards for PR #217.

Out of scope:

- Retained-asset staging, static export, publication, lock, collision,
  durability, service-worker, or learner behavior changes.
- A new project naming policy, a change to the clean-install `cabadrive`
  default, or adoption of ambiguous/unvalidated Docker state.
- Persistence of a caller-explicit project, Docker resource migration/deletion,
  edits to sibling PRs, or a broad new audit of resolved feature-051 findings.
- Weakening any merge, review, path-containment, or required-check gate.

## Provenance Contract

### Caller-explicit identity

At capture-process entry, a nonempty `COMPOSE_PROJECT_NAME` is caller-explicit.
Capture validates and uses it exactly. It must not create or replace
`.cabadrive-release-handoff/.adopted-project` solely because the explicit value
is non-default.

### Resolver-discovered identity

At capture-process entry, an unset `COMPOSE_PROJECT_NAME` lets capture own
resolution. If resolution finds one validated non-default historical project,
capture must persist that project through the existing repository-contained
adoption path before it returns success. Capture then uses the same project for
its project-scoped container/image/volume and handoff work.

### Clean-install identity

At capture-process entry, an unset `COMPOSE_PROJECT_NAME`, no safe adopted
record, and no historical candidate resolves to `cabadrive`. No adoption record
is created for this default.

### Make boundary

`make build` must not resolve a project and then export that value into capture,
because that flattens discovered provenance into caller-explicit state. The
minimal required sequence is:

1. invoke `./scripts/capture-legacy-assets.sh` with the caller's original
   environment unchanged;
2. let capture classify explicitness before its internal resolver exports the
   selected value;
3. require capture, including any necessary adoption publication, to exit zero;
4. only in the next fail-fast recipe resolve the now-authoritative project,
   export it as `COMPOSE_PROJECT_NAME`, and invoke `docker compose build`.

No new ambient provenance variable, duplicate resolver, or guessed comparison
is introduced. The existing combined capture-and-resolve operation is the
single provenance-preserving interface. `make up`, `down`, `logs`, and `stage`
continue using the resolver; after a discovered build they read the adoption
record and therefore select the same project.

## Ordering And Failure Semantics

- Discovery, project-name validation, repository-root containment, and adoption
  publication all precede `docker compose build`.
- Any capture, ambiguity, Docker discovery/inspection, adopted-record, path,
  or adoption-publication failure makes the first Make recipe fail. Make must
  not invoke the image build or any later mutation.
- The established feature-051 rules remain authoritative: exact ancestry only,
  explicit choice wins, unsafe names/paths fail, symlinks are not followed,
  unrelated projects are ignored, and Docker errors never masquerade as a
  clean install.
- A subsequent lifecycle command must fail on an unsafe/malformed adoption
  record rather than fall back to `cabadrive`.

## Functional Requirements

- **FR-052-1 — preserve provenance:** `make build` passes the caller's original
  explicit/unset state to capture; it never pre-exports resolver output into
  capture.
- **FR-052-2 — durable adoption first:** a validated discovered non-default
  project is persisted before any image-build command starts.
- **FR-052-3 — lifecycle continuity:** after historical evidence becomes
  post-feature/non-discoverable, resolve and `make up`, `down`, `logs`, and
  `stage` continue to select the adopted project.
- **FR-052-4 — explicit override:** caller-explicit identity remains exact and
  does not create/overwrite the adoption record.
- **FR-052-5 — stable clean install:** no candidate still selects `cabadrive`
  without a spurious record.
- **FR-052-6 — fail closed:** ambiguous/invalid/unsafe/unreadable state and
  failed adoption publication abort before build mutation.
- **FR-052-7 — real boundary regression:** an executable test drives the actual
  Makefile and capture script through build and a later lifecycle command. A
  helper-only test is insufficient.
- **FR-052-8 — coherent process state:** feature 051 truthfully records its
  prior Architect and Analyst passes on effective head
  `953709f0f12e3ac839c65c074908aef674b74bbd`; feature 052 then records renewed
  validation for the new effective content head after this non-evidence fix.
- **FR-052-9 — status-preserving runtime-label probe:** historical-basename
  discovery must distinguish an exact post-feature runtime label, a successful
  inspection proving the label absent, and a failed/unreadable image inspection.
  A pipeline or boolean helper must not collapse Docker failure into label
  absence. Exact `true` excludes the basename candidate; a verified absent label
  permits the existing pre-feature path; command failure or unexpected label
  state fails closed before candidate selection, adoption, capture, or lifecycle
  mutation.
- **FR-052-10 — validate every existing handoff root before resolution:** at
  resolver entry, before an explicit-project return, adopted-record lookup, or
  Docker metadata/image discovery, classify
  `.cabadrive-release-handoff` without following links. Absence is allowed;
  every existing entry must be the canonical repository-owned directory.
  Symlink, non-directory, inaccessible, or escaped state fails before any
  Docker query, bind mount, adoption, capture, or lifecycle action, even when
  `.adopted-project` is absent.
- **FR-052-11 — crash-durable adoption publication:** a discovered adoption is
  authoritative for Docker build only after the completed temporary regular
  file is flushed, atomically renamed to `.adopted-project`, and the handoff
  parent directory is flushed. Every close/fsync/rename/parent-fsync failure
  returns nonzero before build. If failure occurs after rename made the record
  visible, later resolution must validate and repeat the record plus parent
  durability barrier before using it; visible bytes alone are not durability
  evidence. The helper must preserve the Docker-only host contract and the
  existing no-follow/repository-containment rules.
- **FR-052-12 — invalid checkout basename is not a Docker probe:** the optional
  pre-feature `${historical_basename}-cabadrive` image fallback may run only
  when the raw checkout basename already satisfies the safe Compose project
  grammar used by this feature. An uppercase, spaced, dotted, empty, or otherwise
  invalid basename is not normalized or passed to Docker; container-label
  discovery still runs, and zero authoritative candidates selects the documented
  `cabadrive` clean-install default. Skipping an invalid optional basename is not
  equivalent to suppressing Docker errors for a valid probe.

## Acceptance Criteria

1. With caller `COMPOSE_PROJECT_NAME` unset and exactly one valid non-default
   historical project, actual `make build` writes `.adopted-project` before the
   mocked/real image build begins.
2. The test changes discovery evidence to the post-feature state during build;
   a later actual Make lifecycle target still invokes Compose with the adopted
   project.
3. Removing the adoption record in an isolated negative control after the same
   evidence transition makes resolve select `cabadrive`, proving the regression
   would catch the original flattened-provenance bug.
4. An actual Make invocation with an explicit non-default project uses that
   value and neither creates nor replaces the adoption record.
5. Adoption publication failure returns nonzero and a build sentinel proves
   `docker compose build` never starts.
6. Existing clean-install, ambiguity, unsafe-record/path, invalid-name, Docker
   discovery/inspection, and capture short-circuit tests remain green.
7. The implementation diff is limited to the Make boundary, focused tests,
   directly necessary durable documentation if it described the old boundary,
   and feature 051/052 process memory.
8. Focused tests, full preflight, and the isolated real Docker retention
   lifecycle pass on the renewed effective content head.
9. Review threads `r4121580555` and `r4121580548` are resolved with exact-head
   evidence; complete paginated review state shows no unresolved blocking
   thread.
10. Final Architect validation precedes final Analyst validation and both name
    the same renewed effective content head; all required current-head checks
    are green before merge.
11. When image-ID inspection succeeds but the separate runtime-label inspection
    fails, resolver/capture returns nonzero, creates no adoption record, and an
    actual Make build/lifecycle sentinel proves no Compose mutation begins.
12. An existing symlinked empty handoff root with no adopted record makes
    resolve and every actual Make lifecycle target fail before Docker discovery,
    capture, bind mounting, adoption, or lifecycle mutation; the external target
    remains unchanged.
13. An ordered operation trace proves completed adoption bytes are file-fsynced
    before atomic rename and the canonical handoff parent is fsynced after it,
    all before image build. Fault injection at file sync, rename, and parent sync
    fails closed with no build; an exact retry after a post-rename sync failure
    reestablishes both durability barriers before returning the adopted project.
14. From checkouts whose basenames contain uppercase letters, spaces, dots, or
    other characters outside the safe project grammar, clean-install resolve
    and actual Make lifecycle select `cabadrive` without issuing an invalid
    historical-image inspection. A valid lowercase historical basename keeps
    the existing exact discovery behavior.

## Required Negative Scenarios

- Explicit non-default project is used but not adopted.
- Discovered non-default project whose adoption publication fails never starts
  Docker build.
- Missing adoption after historical evidence disappears resolves to the default
  in the isolated regression control.
- Multiple valid historical candidates fail without selection or persistence.
- Unsafe/malformed adopted state fails without Docker lifecycle mutation.
- Docker discovery or inspection failure fails rather than selecting a default.
- Historical image-ID success followed by runtime-label inspection failure
  fails rather than classifying the image as an unlabeled legacy candidate.
- Existing symlinked/non-directory handoff root without `.adopted-project`
  fails before Docker discovery or bind-mounted lifecycle action.
- Adoption temporary-file close/fsync, atomic rename, or handoff-parent fsync
  failure prevents Docker build. A post-rename failure cannot make the merely
  visible record authoritative without a successful retry durability barrier.
- Invalid raw checkout basename is skipped as an optional historical image
  candidate; it must not produce an invalid-reference Docker failure or be
  normalized into an unproven project identity.
- Genuine clean install selects `cabadrive` and creates no adoption record.

## Verification Requirements

- Write the actual-Make regression failing first against the intake head, then
  make the smallest implementation change and prove it passes.
- Keep or extend the focused `tests/capture-legacy-assets.test.mjs` coverage;
  static Makefile regex assertions are supplemental, not acceptance evidence.
- Run the focused capture tests and directly affected Docker/runtime contract
  tests, then `pnpm run preflight`.
- Run the established isolated real Docker asset-retention lifecycle because
  project identity controls its image, container, volume, handoff, and stager.
- Record exact commands, results, effective content head, cycle PR metadata,
  thread dispositions, known issues, and Implementation Agent feedback in
  `tasks.md`.
- Review only this focused change and affected lifecycle contracts. PR #217 has
  more than 100 native reviews, so Orchestrator must use complete paginated
  read-only review/thread guards. If the conservative finalizer refuses solely
  because its bounded review fetch cannot prove completeness, Orchestrator may
  use manual squash merge only after the complete paginated guard independently
  proves every ordinary gate; pagination is never grounds to weaken a gate.

## Review Finding Dispositions

- **R052-001 / `r4121580555` — Make wrapper erases resolver provenance:
  accepted.** Replace the pre-resolve/export capture invocation with the
  existing combined capture-and-resolve invocation, test-first, while retaining
  the separate fail-fast build recipe.
- **R052-002 / `r4121580548` — feature-051 process memory contradicts completed
  Analyst validation: accepted.** Correct only Architect-owned feature-051
  planning/task status so it records the Analyst pass at
  `2026-09-28T11:19:10Z` for effective head
  `953709f0f12e3ac839c65c074908aef674b74bbd`. Do not alter Analyst-owned
  evidence. State explicitly that feature-052's non-evidence change makes those
  old passes insufficient for finalization and requires renewed validation.
- **R052-003 / `r4134154337` — runtime-label pipeline masks Docker inspect
  failure: accepted (Architect return #1).** Replace the pipeline/boolean
  classification with an explicit status-preserving probe. Accept a historical
  basename only after both image existence and successful inspection prove the
  post-feature marker absent. An exact `true` excludes it; inspection failure or
  unexpected nonempty marker state aborts without selection, persistence, or
  lifecycle mutation. Add a focused regression where ID inspection succeeds,
  label inspection fails, and build/adoption sentinels remain absent; rerun the
  focused suite, full preflight, isolated Docker lifecycle, exact-head review,
  and required checks.
- **R052-004 / `r4134154325` — final role-validation evidence pending: no
  product task.** Keep the thread open until R052-003 is implemented and
  reviewed, then complete final Architect validation followed by final Analyst
  validation on the same renewed effective content head. Reply with both role
  markers before resolving it; it must not be closed based on pre-return
  validation evidence.
- **R052-005 / `r4134532193` — empty symlinked handoff root bypasses resolver
  containment: accepted (Architect return #2).** Move no-follow classification
  of every existing handoff root to the start of resolution, before explicit or
  discovered project selection and before Docker metadata access. Preserve an
  absent root as the only create-later state. Add an actual resolver/Make
  regression with a symlink to an empty external directory, no adopted file,
  Docker/action sentinels untouched, and external bytes unchanged.
- **R052-006 / `r4134532208` — adopted-project rename lacks durability:
  accepted (Architect return #2).** Publish through a repository-owned
  Docker-executed durability boundary: checked write/close, exact content
  validation, file fsync, atomic rename, then handoff-parent fsync. Failure at
  any boundary blocks build. Revalidate and re-fsync a visible adopted record
  before resolver authority so an interrupted post-rename parent barrier cannot
  be mistaken for completed publication. Add ordered trace/fault/retry tests,
  then rerun focused, full-preflight, isolated-Docker, exact-head review and
  required-check gates.
- **R052-007 / `r4137130912` — invalid checkout basename breaks clean install:
  accepted (Architect final-validation return #3).** Gate the optional
  historical-basename image probe on the existing safe Compose project grammar.
  Do not normalize an invalid basename into a candidate: skip only that fallback,
  retain exact container-label discovery, and use `cabadrive` when no valid
  candidate exists. Add uppercase/space/dot actual-resolver/Make regressions
  proving no invalid image-inspect call or lifecycle failure, while a valid
  lowercase historical basename remains discoverable. Rerun focused, preflight,
  Docker, exact-head review, and required checks.
- **R052-008 / `r4137191315` — validate the actual effective content head: no
  separate product task.** The formatting-only runtime commit still makes prior
  role evidence stale under repository policy. After R052-007 lands, record the
  new full effective content head and perform final Architect validation followed
  by final Analyst validation on that same head before resolving this thread or
  `r4134154325`.

## Final Validation Protocol

- Feature-052 Architect return limit: 10. Current count: 3. Return #1 accepted
  R052-003; return #2 accepted R052-005/R052-006; final-validation return #3
  accepts R052-007. No Architect pass is recorded until its focused fix and all
  renewed gates are complete.
- Feature-052 Analyst return limit: 5. Initial count: 0.
- The effective content head contains implementation, tests, documentation,
  dispositions, and all mutable task/evidence state.
- Orchestrator invokes final Architect validation only after implementation,
  focused/full/Docker evidence, exact-head review, and thread disposition are
  complete. Final Analyst validation follows only after Architect passes.
- Any later commit may contain parser-accepted validation/process evidence only;
  any later non-evidence change invalidates both passes.
