# Feature Request: Improvement Backlog Audit Memory

## Intake Metadata

- Feature ID: `042-improvement-backlog`
- Intake role: Analyst
- Assigned worktree: `/Users/chap/Documents/Codex/2026-07-13/cucumberfalse-cabadrive-207-https-github-com-2/work/pr207`
- Assigned branch: `docs/improvement-specs`
- Existing PR: [cucumberfalse/cabadrive#207](https://github.com/cucumberfalse/cabadrive/pull/207), `Add improvement backlog: full audit with detailed specs`
- Verified base provided by Orchestrator: `origin/main` at `bd0ce1dd3e367f07db8528248f9cb00e2b296441`
- PR head observed during intake: `8d2030d646c39b808f3e0ff2ed3f51ac71b7837c`
- Base relationship provided by Orchestrator: merge base equals the verified `origin/main`; the PR branch is 2 commits ahead and 0 commits behind.
- Parallel-work warning: parallel agents/worktrees may be active. Preserve all existing dirty diffs, branches, commits, PR state, and process memory. Do not revert, overwrite, rebase, merge, close, delete, or otherwise mutate sibling work.
- Existing prefix check: the maximum existing numeric prefix under `specs/` is `041`, so this intake uses `specs/042-improvement-backlog/`.
- Intake artifact scope: this Analyst intake creates only `specs/042-improvement-backlog/feature-request.md`. Analyst does not create `spec.md`, `plan.md`, `tasks.md`, implementation or review changes, commits, pushes, PR mutations, review replies, check reruns, or merge actions.

## Original Intent And Continuation Request

The existing PR's recorded intent is to add a documentation-only, repository-wide audit and a self-contained improvement backlog under `docs/improvements/`. Its PR description defines the work as a multi-dimensional audit of architecture, UX, PWA/offline behavior, content, images, testing, CI, infrastructure, legal/documentation concerns, with code-backed observations and targeted measurements.

The current user request is:

> [cucumberfalse/cabadrive#207] продолжи до полного завершения и мержа

Normalized intake reading:

- Continue the already-open PR #207 rather than create a replacement PR for the same backlog.
- Preserve the existing audit/backlog content and complete the repository-required process memory that the current review identified as missing.
- Carry the existing PR through role-appropriate planning, implementation, review, checks, final validation, and Orchestrator-controlled merge once every objective merge-readiness gate passes.
- Do not interpret “до полного завершения и мержа” as permission to bypass checks, unresolved review findings, feature-memory requirements, branch protection, or role boundaries.

## Legacy Continuation Classification

This is a continuation/fix of an existing legacy PR that was opened before feature memory for this work cycle was present in the diff. The correct recovery is to document the existing PR context in a new feature folder and complete the missing role-owned memory on the same PR branch under Orchestrator coordination.

This feature request does not re-authorize or recreate the already completed audit. It supplies the missing Analyst intake anchor so Architect can define the specification, plan, tasks, acceptance evidence, review disposition, final-validation evidence, and cycle closure required for PR #207.

The PR itself remains the single currently known contributing PR slice for this work cycle. If follow-up implementation requires a separate PR slice, Orchestrator must add it to the cycle PR set and preserve the existing PR and branch state.

## Project And PR Context

Cabadrive is a local-first React/TypeScript/Vite trainer for Russian-speaking drivers preparing for the CABA theory exam. The product has no runtime backend and must remain offline-capable after build. The backlog is durable engineering documentation; it proposes future work but does not itself implement the proposed product, infrastructure, content, or legal changes.

At the observed PR head, the diff against the verified base adds 24 Markdown files and 1,862 lines under `docs/improvements/**` only:

- `docs/improvements/README.md` provides the backlog index, priorities, dependencies, and a four-stage recommended sequence.
- `docs/improvements/00-analysis-overview.md` summarizes the repository audit, strengths, problem areas, and measured baseline.
- `docs/improvements/priority/01-usability.md`, `02-document-quality.md`, and `03-image-quality.md` are the three detailed owner-priority specifications.
- `docs/improvements/04-*.md` through `22-*.md` contain 19 numbered improvement specifications covering architecture, routing, progress storage, content rendering, performance, timers, PWA/offline behavior, nginx, iOS persistence, code quality, component tests, CI, repository size/LFS, cross-platform asset generation, content-script refactoring, and license/attribution documentation.

The backlog identifies five especially urgent areas: user-data loss, missing license/attribution, absent TypeScript/lint/format gates, image quality, and service-worker reliability. These are proposals for future independently scoped implementation cycles, not changes to be implemented opportunistically in PR #207.

## Current Review Blocker

The current blocking inline review finding is a P1 on `docs/improvements/README.md` for missing required feature memory. The review states that the PR adds durable improvement documentation but no `specs/<feature-id>/feature-request.md`, `spec.md`, `plan.md`, or `tasks.md`, so final validation and merge gates cannot identify the work cycle, acceptance evidence, or role-owned dispositions.

Observed GitHub state during intake:

- PR #207 is open and not a draft.
- PR head is `8d2030d646c39b808f3e0ff2ed3f51ac71b7837c` on `docs/improvement-specs` targeting `main`.
- Merge state is `BLOCKED`.
- `baseline-checks`, `docker-validation`, `guard`, and `osv-scan` succeeded on the observed head.
- `AI Review` failed because the current-head review contained a blocking P1 finding rather than an acceptable no-findings result.
- The review discussion must remain open until the complete feature-memory gap is fixed, reviewed on the new current head, and resolved or made outdated through the normal GitHub review flow.

Creating this Analyst artifact addresses only the first missing role-owned file. It does not, by itself, satisfy the blocker: Architect must still create `spec.md`, `plan.md`, and `tasks.md`; role-appropriate implementation must keep those artifacts current; review and required checks must pass on the resulting current head; final Architect validation must precede final Analyst validation; and Orchestrator must perform the final current-head guards before merge.

## Requested Outcome

PR #207 should retain a coherent, evidence-backed, navigable improvement backlog and gain complete process memory for its work cycle, without expanding into implementation of the backlog items. After the current review finding is addressed and all repository merge gates pass on the current head, Orchestrator should finalize and merge the PR.

The durable result should let a future maintainer understand:

- what was audited and when;
- which observations and measurements underpin the backlog;
- which improvements are proposed, their priorities and dependencies;
- which items are deliberately future work rather than behavior delivered by this PR;
- how PR #207 was verified, reviewed, dispositioned, and finalized.

## Scope

In scope for this work cycle:

- Preserve and validate the existing `docs/improvements/**` audit and backlog added by PR #207.
- Complete the required feature memory under `specs/042-improvement-backlog/` through role-appropriate Analyst, Architect, Implementation Agent, Review Agent, and Orchestrator steps.
- Verify that the index accurately and unambiguously links the analysis overview, three priority specifications, and nineteen numbered backlog specifications.
- Verify that documents consistently communicate priority, effort, scope, dependencies, risks, affected areas, and acceptance expectations at the level claimed by the PR.
- Check that factual repository measurements and implementation claims are traceable to the audited base/head context or explicitly qualified as time-bound observations.
- Preserve the documentation-only nature of PR #207 except for the feature memory and narrowly necessary documentation corrections identified by role-appropriate review.
- Record the single existing PR slice and any later contributing slice in the cycle PR set, with purpose, branch, PR metadata, head SHA, status, and final-validation inclusion.
- Resolve the current feature-memory review finding through normal role ownership and GitHub review flow.
- Re-run required checks and final validation on the correct current/effective content head before Orchestrator-controlled merge.

Out of scope:

- Implementing any proposed backlog item in product code, content, runtime, CI, infrastructure, license policy, asset pipelines, or repository history as part of PR #207.
- Treating backlog priority labels as authorization to make unrelated high-priority fixes in this work cycle.
- Re-auditing the repository from scratch unless Architect identifies a specific stale or unsupported claim that must be corrected for this PR to be accurate.
- Replacing, closing, or abandoning PR #207 solely because it began without feature memory.
- Rewriting Git history, rebasing, force-pushing, discarding existing commits, or mutating sibling work without explicit Orchestrator coordination.
- Bypassing the blocking review, required checks, feature-memory completion, final Architect/Analyst validation order, or current-head guard.

## Acceptance Expectations

- `specs/042-improvement-backlog/feature-request.md`, `spec.md`, `plan.md`, and `tasks.md` are present and current in the final PR diff, with role ownership preserved.
- Feature memory names the goal, scope, acceptance criteria, negative scenarios, verification evidence, decisions, known issues, dead ends, cycle PR set, and every Implementation Agent feedback disposition required by repository rules.
- The final diff retains the complete backlog structure: one index, one audit overview, three priority specifications, and nineteen numbered specifications (`04` through `22`).
- All internal Markdown links within `docs/improvements/**`, and all index targets, resolve to committed files.
- The index count, titles, priority/effort labels, category labels, dependencies, and recommended sequence agree with the linked specifications or are corrected with recorded rationale.
- Statements presented as measured facts are reproducible from repository evidence or clearly labeled as observations tied to the audit date and revision; unsupported precision is corrected or dispositioned.
- Each improvement specification remains sufficiently self-contained for later intake: context/problem, goals and relevant non-goals, actionable requirements or design direction, acceptance criteria, risks, affected files/areas, and dependencies where applicable.
- PR #207 stays documentation/process-memory only; no backlog implementation is silently bundled into it.
- The current P1 feature-memory review finding is addressed and its conversation is resolved or outdated according to the repository review contract.
- Every required check from `.unicorn-hub/config.json` is green on the final current PR head; queued, running, missing, or failed checks remain blockers.
- The PR has no unresolved blocking review findings or merge conflicts, acceptance evidence is recorded, process memory is current, and no Implementation Agent feedback lacks Architect disposition.
- Final Architect validation passes before final Analyst validation for the same effective content head. Any later commit is limited to allowed final-validation evidence and is proven evidence-only by the Orchestrator current-head guard.
- Orchestrator verifies the final GitHub state and local read-only guards, then finalizes and merges PR #207 unless a narrow documented human blocker applies.

## Negative Scenarios

- Adding only `feature-request.md` and declaring the P1 review fixed while `spec.md`, `plan.md`, or `tasks.md` remains absent or stale.
- Resolving the review conversation before the complete memory and verification gap is actually addressed.
- Treating green checks from `8d2030d646c39b808f3e0ff2ed3f51ac71b7837c` as sufficient after a newer head is pushed.
- Merging because the change is “docs only” while required review, checks, final validations, conflicts, or process-memory gates remain unresolved.
- Expanding PR #207 into implementation of usability, image, PWA, license, CI, architecture, or other backlog proposals.
- Presenting time-bound audit measurements as permanent guarantees without recording the audit date or revision context.
- Leaving broken links, count mismatches, contradictory priorities, duplicate identities, or dependency inconsistencies between the index and detail documents.
- Replacing the existing PR with a new PR and losing the original commits, review history, or continuation context without an explicit blocker and Orchestrator decision.
- Force-pushing, rebasing, deleting, or overwriting existing or sibling work to simplify continuation.
- Recording final validation against one effective content head and then adding non-evidence changes without rerunning the role-appropriate validation loop.

## Assumptions

- The existing PR description and committed backlog accurately represent the original owner intent; no separate original prompt is available in repository memory.
- The user's current request authorizes normal Orchestrator finalization and merge after objective gates pass, but does not override repository safety or branch-protection rules.
- The existing two commits and all current `docs/improvements/**` content are to be preserved unless later role-appropriate review finds a specific defect.
- This is one documentation work cycle represented by `specs/042-improvement-backlog/`, even though the audit proposes many future independent implementation cycles.
- The nineteen numbered backlog specifications are `04` through `22`; the three `priority/` specifications are additional flagship documents, not part of that nineteen-file numeric count.
- No normal-flow user clarification is required. The existing PR, review finding, project memory, and continuation request are sufficient for Architect planning.
- External research is unnecessary for intake. Any time-sensitive technical recommendation or legal claim in the backlog should be treated by Architect as a verification concern and either evidence-backed, qualified, or scoped as a future discovery task.

## Risks

- The audit is dated 2026-07-11 and may contain line counts, asset sizes, dependency versions, or architectural observations that become stale as `main` changes.
- A documentation-only PR can still create durable misinformation if measurements, priorities, tool recommendations, or dependency relationships are inconsistent or unsupported.
- The backlog spans product, architecture, operations, content, legal, and image-processing concerns; future implementers may mistake a proposed design for an approved implementation contract unless status boundaries are explicit.
- Some proposals, especially license/attribution, security headers, storage persistence, AI upscaling, PWA update behavior, and LFS migration, require later owner, legal, compatibility, or operational decisions and should not be silently treated as settled here.
- Large self-contained specifications can duplicate or contradict existing durable source-of-truth documentation; Architect should define a focused consistency check without turning this cycle into a rewrite of unrelated memory.
- Adding feature memory changes the PR head and requires fresh checks and review; prior green results cannot be reused as final current-head evidence.
- The original P1 comment remains an unresolved merge blocker until the full feature memory exists and the review backend accepts the updated head.

## Open Questions For Architect

- What focused verification is sufficient to substantiate the audit's measured claims without repeating the entire original audit?
- Which fields must be normalized across all twenty-two detailed backlog documents and the index, and which variations are intentional?
- Should the audit date and base/head revision be added to individual specifications or centrally governed by the overview/index?
- What is the minimal automated validation for Markdown links, inventory counts, naming, and feature-memory completeness?
- How should time-sensitive tool, version, licensing, security, or platform recommendations be qualified so they remain useful without being mistaken for current guaranteed facts?
- What exact evidence will demonstrate that the final post-memory diff remains documentation/process-only and contains no implementation side effects?

## Cycle PR Set Context

The cycle PR set currently contains one PR:

| Purpose | Branch | PR | Base | Observed head | Status | Included in final validation |
|---|---|---|---|---|---|---|
| Repository audit, improvement backlog, and recovery of required feature memory | `docs/improvement-specs` | [#207](https://github.com/cucumberfalse/cabadrive/pull/207) | `main` / verified `origin/main` `bd0ce1dd3e367f07db8528248f9cb00e2b296441` | `8d2030d646c39b808f3e0ff2ed3f51ac71b7837c` | Open; blocked by P1 feature-memory finding and failed AI Review gate | Yes; final head/effective content head to be updated by Orchestrator |

Architect and Orchestrator must keep this table or equivalent cycle memory current if the head changes or another PR slice contributes to the same work cycle. The observed head is intake evidence, not the expected final validated head.

## Sources And Research

No public external research was used for intake. The request concerns an existing repository diff, its GitHub review state, and repository process rules.

Local and PR sources read for intake:

- `AGENTS.md`
- `.specify/memory/constitution.md`
- `docs_project/README.md`
- `docs_project/project-idea.md`
- `docs_project/project/frontend/frontend-docs.md`
- `docs_project/project/backend/backend-docs.md`
- `docs_project/project/feature-inventory.md`
- `docs_project/screens/learning-and-exam-flows.md`
- `docs/specify/README.md`
- `docs/improvements/README.md`
- `docs/improvements/00-analysis-overview.md`
- headings and inventory of all Markdown files under `docs/improvements/**`
- PR #207 description, commits, current head/base metadata, reviews, inline review comment, and check state observed through GitHub

## Analyst Handoff

This intake is ready for Orchestrator handoff to Architect.

Architect should create `spec.md`, `plan.md`, and `tasks.md` for continuation of PR #207, with a narrow documentation/process-memory scope. The plan should validate the existing audit/backlog, complete all merge-required memory and evidence, explicitly dispose the current P1 finding, keep the cycle PR set current, and preserve final Architect-before-Analyst validation ordering. Implementation of any backlog proposal belongs in a later independently routed feature cycle.
