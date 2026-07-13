# Specification: Improvement Backlog Audit Memory

## Goal

Complete PR #207 as a documentation-only work cycle: preserve its repository
audit and future-work backlog, make the backlog internally navigable and
traceable to a dated repository snapshot, add complete feature memory, and
carry the same PR through review and final validation without implementing any
of the proposed improvements.

The verified base for this cycle is
`bd0ce1dd3e367f07db8528248f9cb00e2b296441`; the observed pre-memory PR head is
`8d2030d646c39b808f3e0ff2ed3f51ac71b7837c`. These identifiers are provenance,
not permission to reuse checks from an older head.

## Scope

### In scope

- Preserve and validate the complete 24-file `docs/improvements/**` inventory:
  one `README.md` index, one `00-analysis-overview.md`, three files under
  `priority/`, and nineteen numbered specifications `04` through `22`.
- Check that every index link resolves, every expected detail file is indexed,
  no unexpected/duplicate identity is present, and index title, priority,
  effort, category, dependency, and recommended-sequence statements agree with
  the linked details or receive a recorded correction/disposition.
- Confirm each detail is useful as future intake: it states context/problem,
  goals, actionable direction, acceptance criteria, risks, affected areas, and
  dependencies where relevant. Heading wording may vary when meaning is clear.
- Qualify counts, sizes, versions, line counts, measured performance, and other
  repository observations as a snapshot of the 2026-07-11 audit tied centrally
  to the audited revision. Future targets and estimates must be distinguishable
  from measured facts. Focused correction of a demonstrably unsupported claim
  is allowed; a full repeat audit is not required.
- Complete and maintain `specs/042-improvement-backlog/` and record verification,
  review, feedback disposition, cycle PR state, and final-validation evidence.

### Out of scope

- Product, runtime, source content, test, CI, infrastructure, asset-pipeline,
  legal-policy, dependency, build, or repository-history implementation of any
  backlog proposal.
- Approval of the proposed designs as final implementation contracts; each item
  requires a later, independently routed feature cycle.
- Replacing PR #207, rewriting its history, or modifying sibling work.
- A repository-wide re-audit unless a narrow factual defect cannot otherwise be
  dispositioned accurately.

## Documentation Contract

The committed inventory must be exactly:

- `docs/improvements/README.md`
- `docs/improvements/00-analysis-overview.md`
- `docs/improvements/priority/01-usability.md`
- `docs/improvements/priority/02-document-quality.md`
- `docs/improvements/priority/03-image-quality.md`
- one file for every numeric identity `04` through `22` (nineteen files)

`README.md` is the canonical inventory and sequencing index. Detail documents
own their proposal content. Where index and detail disagree, Implementation
Agent must establish which statement is supported, make the smallest docs-only
correction, and record it in `tasks.md`; it must not infer or implement product
behavior. Cross-links and dependency references must name an existing backlog
identity and must not silently create a twenty-third numbered specification.

Snapshot qualification may be centralized in the index/overview rather than
duplicated in all 22 detail specifications, provided it unambiguously applies
to their repository measurements and names the audit date and revision. Claims
that are legal, security, platform, version, or tool recommendations must read
as proposals or later-discovery requirements when this PR does not substantiate
them as permanent/current guarantees.

## Acceptance Criteria

1. All four feature-memory files exist and are current; Architect owns
   `spec.md`, `plan.md`, and `tasks.md`, and Analyst ownership of
   `feature-request.md` is preserved.
2. The final backlog inventory contains exactly 24 Markdown files: index +
   overview + three priority specs + nineteen uniquely numbered specs `04..22`.
3. All local Markdown links under `docs/improvements/**` resolve to committed
   files or valid anchors, and the README indexes every expected detail exactly
   once without an unexpected detail identity.
4. A focused index-to-detail review records agreement or a correction for
   titles, priority/effort/category labels, dependencies, and the four-stage
   sequence. Each detail retains the minimum future-intake content described in
   this specification.
5. Repository measurements are explicitly qualified as 2026-07-11 snapshot
   observations associated with audited revision
   `bd0ce1dd3e367f07db8528248f9cb00e2b296441`; later targets/estimates are not
   presented as measured current facts.
6. The final diff against the verified base is limited to
   `docs/improvements/**` and `specs/042-improvement-backlog/**`. No proposed
   runtime/product/backlog implementation is included.
7. The existing P1 feature-memory finding is dispositioned as valid and fixed
   only after all four memory files are present and current. Its review thread
   remains unresolved until an independent Review Agent verifies the current
   head and the normal GitHub flow resolves or outdates it.
8. Exact local verification passes and its output/head SHA is recorded under
   `Verification Evidence`; required GitHub checks are green on the final
   current head and no blocking review thread or conflict remains.
9. Every Implementation Agent feedback item has an Architect task, later ticket,
   or explicit not-needed disposition. Open feedback blocks final validation.
10. Final Architect validation covers the complete cycle PR set and passes for
    the effective content head before final Analyst validation passes for that
    same SHA. A later commit may contain only role-owned final-validation
    evidence and must pass the current-head evidence-only guard before merge.

## Negative Cases

- Fewer/more than 24 backlog Markdown files, a missing `04..22` identity, a
  broken link, or a detail absent from/duplicated in the index fails acceptance.
- A label or dependency contradiction is not accepted merely because both
  files are Markdown; it needs correction or an explicit evidence-backed
  disposition.
- An exact number copied from the audit is not treated as timeless. Missing
  date/revision qualification or unsupported precision blocks acceptance.
- Adding only part of feature memory, prematurely resolving the P1, or relying
  on checks for `8d2030d...` after the head changes does not close the gap.
- Editing `src/`, `content/`, `tests/`, scripts, workflows, dependencies,
  runtime configuration, or implementing any backlog proposal violates scope.
- Any non-evidence content change after role validation makes both validations
  stale and returns the cycle to role-appropriate review and validation.

## Required Evidence

Evidence must name the command, outcome, and current SHA. It must include the
inventory result, Markdown-link result, index/detail review result, snapshot
qualification check, scope-only diff, feature-memory check, `git diff --check`,
independent Review Agent disposition, required-check state, cycle PR set, and
the final effective-content-head/current-head guard.
