# Spec: Spec History Audit And Completion Hardening

## Analyst Intake

- Source request: `feature-request.md`
- Intake assumptions or open questions carried into this spec:
  - Audit every tracked prior `specs/[0-9][0-9][0-9]-*/` feature folder and the current repository state those specs produced.
  - Treat "nothing temporary, test-only, unfinished, incomplete, or MVP-quality" as a current-state quality bar, not a license to erase truthful limitations such as the unresolved official full CABA category B question bank.
  - Historical planning archives may keep historical wording when clearly archival. Current durable docs, current UI, current content metadata, validation gates, and release/readiness claims must be made truthful and production-quality.
  - No clarification is needed before architecture because the user explicitly assigned Orchestrator, fresh-main workflow, end-to-end completion, and merge target.
- Orchestrator routing context: Orchestrator assigned Analyst intake for `specs/024-spec-history-audit` in `/Users/chap/devel/cabadrive-worktrees/024-spec-history-audit` on branch `codex/024-spec-history-audit`, then assigned Architect from the Analyst handoff.
- Active-model stop condition: satisfied. This Architect instance is acting only after Orchestrator assignment and will not implement product changes.
- Read-only transition: not applicable. The original request was repository-changing because it asks to fix discovered problems.
- Parallel-work constraints: parallel Orchestrators and agents may be active. Preserve all existing dirty diffs, branches, commits, PRs, sibling feature folders, process memory, active worktrees, and ambiguous local paths.
- Startup base evidence: Analyst recorded `origin/main` at `5f7ee7d8d301a27371a17a96d370d1ceec2629e8`; this worktree `HEAD`, `origin/main`, and merge-base matched that SHA at intake.
- Cleanup applicability: local cleanup is not part of this feature unless Orchestrator separately assigns Cleanup Agent with approved roots, exclusions, and evidence destination.

## Cycle Definition

- Work cycle: one repository-changing user request represented by `specs/024-spec-history-audit`, from latest-main intake through Architect planning, implementation PR slice or slices, review, final Architect validation, final Analyst validation, completion, and Orchestrator finalization/merge.
- Cycle PR set expectations: `tasks.md` must record every contributing PR slice by purpose, branch, PR metadata or number, head SHA, status, and final-validation inclusion.
- Latest-main startup rule: the Analyst handoff branch may become the single implementation PR slice only if Orchestrator explicitly assigns it. Additional implementation slices must start from freshly verified `origin/main` in separate isolated worktrees/branches/PRs. Fetch/base verification failure is a blocker or documented fallback, never silent reuse of stale state.

## Goal

Produce an evidence-backed audit and remediation of all prior Cabadrive spec work so the current repository state is complete, consistent, production-quality, and free of current temporary, test-only, unfinished, incomplete, placeholder, or MVP-quality claims, except for explicitly dispositioned truthful source-status limitations.

## Scope

In scope:

- Every tracked prior spec folder present on the verified base, including legacy/no-intake and duplicate-prefix folders.
- Current durable docs under `.specify/`, `docs_project/`, `docs/specify/`, and `specs/README.md` where they describe current product, workflow, validation, source, or release truth.
- Current app/source/content/test/script/CI surfaces connected to prior specs, including `src/`, `content/`, `scripts/`, `tests/`, Docker runtime files, `.unicorn-hub/config.json`, and GitHub workflow/helper behavior.
- Visible learner status/copy for official Spanish primacy, unofficial Russian support, fallback question-bank status, topic materials, process guide, CABA/RF guide, primary-source reader, learn/exam/mistake/vocabulary flows, Docker runtime, and validation gates.
- Source and content governance for official documents, primary-source reader corpus, topic-study guide, generated compatibility indexes, validation evidence, local images, overlays, translations, explanations, and learner-difficulty metadata.
- Process-memory consistency when stale unchecked tasks or historical blockers are now contradicted by current merged state.

Out of scope:

- Deleting, moving, renumbering, or rewriting historical spec folders merely because historical process rules changed.
- Falsely claiming official full-bank coverage or exact exam equivalence when the current content mode remains `unofficial_b_fallback`.
- Introducing a backend, accounts, remote analytics, runtime network dependencies, live AI, or remote source fetching.
- Broad new product features unrelated to completing or hardening already specified work.
- Local disk cleanup of old worktrees or generated environments without a separate Cleanup Agent assignment.
- Direct edits by Architect outside this feature's `spec.md`, `plan.md`, and `tasks.md`.

## User Stories

### User Story 1

As a Cabadrive owner, I want a complete audit of every prior spec and current artifact it produced, so that no unfinished or inconsistent work is hidden behind scattered process memory.

### User Story 2

As a learner, I want current app surfaces and docs to be truthful and complete, so that I can trust what is official Spanish source material, what is unofficial Russian support, and what is limited by source availability.

### User Story 3

As a future agent, I want durable process memory to distinguish historical limitations from current blockers, so that future work starts from reliable repository truth.

## Acceptance Criteria

1. Given the verified base, when the implementation audit runs, then every prior `specs/[0-9][0-9][0-9]-*/` folder is inventoried with artifact presence, domain, intended outcome, current linked artifacts, completion evidence, quality/consistency findings, and disposition.
2. Given legacy specs without `feature-request.md`, when the audit classifies them, then they are marked as accepted legacy/no-intake state or a specific current defect is recorded; they are not retroactively rewritten as if Analyst intake existed.
3. Given duplicate numeric prefixes, when the audit records numbering state, then duplicates are classified as historical accepted state under the current numbering rule and are not renamed unless Orchestrator separately assigns a migration.
4. Given current durable docs or UI text uses `draft`, `incomplete`, `MVP`, `pending`, `blocked`, `placeholder`, `temporary`, or equivalent wording, when it describes current product truth, then the wording is either removed by completing/remediating the state, replaced with truthful source-status disclosure, or explicitly accepted with Architect disposition and evidence.
5. Given historical docs or feature memory contain stale blockers, when they are archival and clearly historical, then they may remain but current docs/process memory must not repeat them as current blockers.
6. Given the topic study guide is visible to learners, when this work completes, then its data status, UI labels, docs, validation mode, and Russian learner prose are consistent with a release-quality state, or the feature is explicitly removed/hid from current user-facing/product-readiness claims with evidence and Architect disposition.
7. Given topic guide content remains in current product scope, when it is considered release-ready, then all current 38 topics and all current 460 fallback tickets satisfy strict coverage, rendered-placement, source-trace, Russian-language quality, and generated/evidence freshness gates.
8. Given the official primary-source reader is current product scope, when this work completes, then durable docs reflect the current 19-entry manifest and 19/19 currentness/exact-text passed state, and no current source-reader docs still claim release is blocked by exact-text validation.
9. Given generated indexes or validation evidence are touched, when implementation changes them, then the owning scripts regenerate or validate them; ad hoc manual edits to generated compatibility indexes are not accepted.
10. Given any source limitation remains, such as non-official fallback questions or unavailable official full bank, when product copy or docs mention it, then the limitation is clear, user-facing when relevant, and not framed as temporary or unfinished unless there is a live blocker disposition.
11. Given implementation discovers a problem too large or independent for the assigned slice, when it cannot be safely fixed inside the current PR, then Implementation Agent records feedback in `tasks.md` and Orchestrator routes it to Architect for task/ticket/not-needed disposition before completion.
12. Given all implementation and review work appears complete, when Orchestrator invokes final validation, then Architect validation passes before Analyst validation, both validate the same effective content head, and process evidence records merge-readiness gates.

## Negative Scenarios

1. Given historical feature memory lacks new workflow markers, when the audit runs, then implementation must not fabricate old final-validation evidence or rewrite history to satisfy current rules.
2. Given the official full GCBA category B bank remains unconfirmed, when current copy is cleaned up, then implementation must not replace fallback labels with official-complete claims.
3. Given a current user-facing section is still `draft` or visibly incomplete, when this feature completes, then it must not remain visible as a current product surface without an explicit accepted limitation and evidence.
4. Given stale source-reader docs say exact-text validation is blocked, when manifest/evidence shows 19/19 passed, then current docs must be corrected instead of preserving stale release-blocker language.
5. Given a content file contains mixed Russian plus accidental English/Spanish residue, when it is learner prose rather than intentional Spanish source term usage, then it must be corrected or guarded by validation before release readiness.
6. Given a generated index, fingerprint, or evidence bundle is stale, when implementation remediates content, then the owning generation/check command must be used and evidence recorded.
7. Given cleanup candidates are identified only by path name, timestamp, or memory, when this feature completes, then no cleanup action is taken unless Orchestrator assigns Cleanup Agent and positive-proof validation succeeds.

## Requirements

- FR-001: Build and record a complete spec-history audit matrix covering every prior tracked feature folder.
- FR-002: For each feature, classify artifact completeness, linked current files, acceptance evidence, open/stale tasks, current defects, and disposition: fixed in this cycle, accepted as historical/truthful, follow-up with rationale, or blocker.
- FR-003: Audit current docs and UI/status copy for unfinished-quality language and reconcile it against current repository evidence.
- FR-004: Audit current content validation state for questions, translations, explanations, image metadata, overlays, difficulty labels, topic guide, official documents, and primary sources.
- FR-005: Topic guide disposition must be explicit: publish/complete with strict evidence, remove from current product readiness, or block/split with Orchestrator routing. Do not leave a visible draft/incomplete current surface by accident.
- FR-006: Official source-reader disposition must reflect current manifest, currentness, exact-text, learner-corpus, UI, and validation evidence, including stale-doc cleanup.
- FR-007: Legacy/no-intake specs and duplicate numeric prefixes must be documented as historical state unless a specific current defect exists.
- FR-008: Generated indexes and evidence must be updated through repository scripts and validated by deterministic local checks.
- FR-009: Durable docs must be updated when behavior, architecture, validation, runtime, source status, workflow, or release truth changes.
- FR-010: Implementation Agent must maintain `tasks.md` with audit findings, remediation evidence, dead ends, known issues, feedback, and cycle PR set.
- FR-011: Review Agent must verify audit completeness, quality of dispositions, current-status truthfulness, role boundaries, sibling-work preservation, generated-file discipline, and missing-test/regression risks.
- FR-012: If targeted public research is required for current official source status, it must be public-safe, source-linked in process memory, and limited to the affected source/status decision.
- FR-013: Preserve Orchestrator-first routing, non-Orchestrator stop conditions, read-only transition rules, Analyst-through-Orchestrator clarification, role boundaries, accidental-start recovery, and sibling-work preservation.
- FR-014: Require final Architect validation before final Analyst validation, cycle PR-set coverage, return-count tracking, effective-content-head markers when relevant, and Orchestrator current-PR-head guard before completion or merge.
- FR-015: Cleanup is out of scope unless separately assigned; if assigned, use Cleanup Agent positive-proof validation and refusal rules.

## Success Criteria

- SC-001: The final audit matrix covers all prior specs and every finding has evidence plus disposition.
- SC-002: Current product/docs/source status contains no accidental temporary, test-only, unfinished, incomplete, placeholder, pending, blocked, or MVP-quality claim.
- SC-003: Remaining limitations are truthful source-status boundaries, not hidden incompletion.
- SC-004: Topic guide and source-reader states are internally consistent across data, UI, docs, tests, and validators.
- SC-005: Local validation evidence covers content quality, tests, build, e2e, preflight, feature memory, whitespace, and any targeted scripts required by touched files.
- SC-006: Required GitHub checks, review status, conflict status, final validation, feedback disposition, and current-head guards are satisfied before Orchestrator finalization/merge.

## Assumptions

- The current 460-question fallback bank remains the active content mode unless a separate source-discovery feature proves official full-bank availability.
- The existing 19-entry official-documents manifest and primary-source corpus are current implementation-time scope unless implementation-time validation finds a real mismatch.
- The topic guide likely needs current-state remediation because the data is still marked `draft` across all 38 topics while durable docs expose it as a current learner surface.
- A single implementation PR slice is acceptable unless the audit uncovers large independent source/content batches or a blocker requiring separate latest-main slices.

## Review And Verification Requirements

- Implementation requirements: Implementation Agent starts only after complete feature memory exists and Orchestrator assigns an isolated worktree/branch/PR slice. It must read this spec, plan, and tasks before editing; record baseline status; preserve sibling work; and keep `tasks.md` current.
- Review requirements: Review Agent verifies full prior-spec coverage, correct historical/current classification, no Orchestrator-first bypass, complete feature memory, scoped edits, stale-doc cleanup, content/status truthfulness, topic guide/source reader consistency, generated-file discipline, and test coverage for any changed behavior.
- Test/verification requirements: Use scope-based evidence including `git status --short --branch`, spec inventory script/output, targeted marker scans, `pnpm run validate:content`, `pnpm run validate:content:quality`, `pnpm run validate:overlays` when overlays/image metadata are touched, `pnpm run test`, `pnpm run build`, `pnpm run test:e2e`, `pnpm run preflight`, `git diff --check`, and `node scripts/check-feature-memory.mjs --worktree`. Omitted commands require recorded rationale.
- Handoff and blocker requirements: Implementation feedback, discovered source conflicts, excessive scope, validation blockers, or accepted known issues must be recorded in `tasks.md` and routed by Orchestrator to Architect for disposition before follow-up development or completion.
- Final validation requirements: Architect validates all PR slices, assigned tasks/dispositions, architectural guidance, open task state, process memory, and customer intent in spirit. Analyst validates customer intent in spirit and letter after Architect passes. Passing effective-head validation records matching `Effective content head`, `Architect validated effective content head`, and `Analyst validated effective content head` markers when a later evidence-only commit is used.
