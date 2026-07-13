# Tasks: Improvement Backlog Audit Memory

## Work Items

- [x] T001 Analyst intake created for legacy continuation of PR #207.
- [x] T002 Architect defined the documentation-only specification, focused
  plan, acceptance/negative cases, and exact verification commands.
- [x] T003 Implementation Agent verified the exact 24-file inventory: README,
  overview, three priority specs, and unique numbered specs `04..22`.
- [x] T004 Implementation Agent ran the local-link and README unique-coverage
  commands from `plan.md`; all links/coverage passed and no link correction was
  needed.
- [x] T005 Implementation Agent performed and recorded the semantic index↔detail
  check for titles, priority, effort, category, dependencies, sequence, and
  minimum future-intake fields across all 22 details.
- [x] T006 Implementation Agent added central snapshot qualification naming the
  2026-07-11 audit and audited revision
  `bd0ce1dd3e367f07db8528248f9cb00e2b296441`, explicitly applying it to
  repository observations/measurements and distinguishing future targets and
  estimates from measured current facts.
- [x] T007 Implementation Agent ran all exact verification commands, recorded
  results and checked-out SHA, and proved the candidate/base scope contains
  only `docs/improvements/**` and `specs/042-improvement-backlog/**`.
- [x] T008 Implementation Agent updated all required log sections below,
  including feedback. Commit/push only as assigned by Orchestrator; do not
  resolve review threads, rerun GitHub checks, review, or merge.
- [x] T009 Review Agent independently reviewed current PR head
  `221885b7334746445e873427c884c73e108aa471` and evidence,
  with explicit disposition of the existing P1 and all acceptance/negative
  cases. The outcome was changes required for the factual/count/acceptance
  contradictions captured in T016--T022; Review Agent did not edit files or
  resolve its own findings.
- [ ] T010 Orchestrator route each review finding to the proper role, obtain a
  fresh current-head review after fixes, and resolve/outdate the P1 only after
  complete memory is independently verified.
- [ ] T011 Architect dispose every Implementation Agent feedback item as an
  implementation task, later feature/ticket, or explicit not-needed decision.
- [ ] T012 Orchestrator verify required checks, conflicts, review conversations,
  current memory, acceptance evidence, and the complete cycle PR set.
- [ ] T013 Architect perform final validation first and record pass, timestamp,
  return count, and validated effective content head.
- [ ] T014 Analyst, only after T013, perform final validation for the same
  effective content head and record pass, timestamp, and return count in the
  Analyst-owned intake artifact.
- [ ] T015 Orchestrator run the current-head/effective-content-head evidence-only
  guard, finalization helper, and merge PR #207 when every gate is green.
- [ ] T016 Implementation Agent update `Cycle PR Set`, `Verification Evidence`,
  and review context to identify reviewed current head
  `221885b7334746445e873427c884c73e108aa471`; after the fixes are committed and
  pushed, replace candidate/current-head wording with the new full pushed head
  SHA and record that older checks/review are historical only.
- [ ] T017 Implementation Agent correct the ticket-photo inventory in
  `00-analysis-overview.md` and `priority/03-image-quality.md` from the erroneous
  322-photo/JPG claim to the verified distinction: 275 unique local JPG files
  and 276 content references. Update every dependent problem statement, table,
  batch/QA step, target, and acceptance criterion (including AC-3) so neither
  unique assets nor references are called 322. Preserve the separately measured
  `322 PNG` format-inventory value unless new evidence specifically disproves it.
- [ ] T018 Implementation Agent correct the E2E baseline in
  `00-analysis-overview.md` and `priority/01-usability.md` from 55 tests per
  project / `51+4` ambiguity to exactly 51 tests per project and 102 executions
  across the two configured projects. Update the dependent acceptance criterion
  (including AC-9) so all overview, proposal, evidence, and total counts agree.
- [ ] T019 Implementation Agent remove the Path A DPI contradiction in
  `priority/03-image-quality.md`: raise its render scale/target from the stated
  ~288 DPI output to a conforming value of at least 300 DPI and update dependent
  pixel dimensions/commands. Path A must not be described as satisfying FR-1 or
  the acceptance criteria unless its documented output actually meets `>=300
  DPI`; if the implementation evidence cannot support the raised parameters,
  label only a verified >=300-DPI path as conforming and make Path A explicitly
  non-conforming/exploratory.
- [ ] T020 Implementation Agent reconcile the usability issue inventory to the
  verified arithmetic `7 + 11 = 18`: update the README P1 summary, the
  `priority/01-usability.md` headline/problem lists and count language, and the
  corresponding acceptance criterion so all references say 18 and the detailed
  enumeration contains exactly seven higher-severity plus eleven medium/low
  issues. Do not solve any usability issue in this PR.
- [ ] T021 Implementation Agent refresh the 22-detail semantic evidence after
  T017--T020, explicitly recording the corrected P1/P3 counts and AC agreement;
  rerun the scoped inventory, link, README coverage, snapshot, feature-memory,
  scope-only, and `git diff --check` commands from `plan.md`, then run one full
  `pnpm run preflight`. Record exact outcomes and the checked full SHA in
  `Verification Evidence`; a failed first attempt belongs in `Dead Ends`.
- [ ] T022 Orchestrator obtain a fresh independent Review Agent review on the
  new pushed head after T016--T021. The review must verify all six dispositions,
  current cycle/evidence memory, corrected semantic evidence, docs-only scope,
  and preflight evidence. The reviewed-head findings and original P1 remain
  blockers until normal GitHub review disposition on the new current head.

T016--T022 are mandatory review-fix work and block T012--T015. They do not
constitute final Architect validation; final validation must be invoked anew
only after the new head has fresh checks and a passing independent review.

## Decisions

- D001: Continue the existing branch and PR #207 as the single known cycle PR;
  feature memory is recovery for the legacy PR, not a replacement audit/PR.
- D002: The PR is documentation/process-memory only. Backlog proposals are
  future independently routed features, even when labeled P0.
- D003: Focused inventory, link, index/detail, semantic, and snapshot checks are
  sufficient; no full re-audit is required absent a concrete unsupported claim.
- D004: Snapshot qualification can be central in README/overview when it clearly
  governs all repository measurements and names the date and audited revision.
- D005: Detail heading variations are allowed when the required meaning is
  present; mechanical template normalization is not required.
- D006: The P1 feature-memory finding is valid. It is not closed by
  `feature-request.md` alone and remains a blocker until all memory, evidence,
  current-head independent review, and normal thread disposition are complete.
- D007: The semantic review found two concrete count contradictions and fixed
  only their metadata rows: TЗ-P1 has six themes distributed across eight
  slices, and TЗ-P3 has five implementation stages. No proposal requirements
  or implementation behavior changed.
- D008: Shorter category/title wording in the README is an intentional index
  summary where it remains semantically equivalent to detail metadata. Detail
  documents retain the authoritative proposal wording.
- D009: Independent Review Agent outcome for head
  `221885b7334746445e873427c884c73e108aa471` is changes required, not a final
  validation pass. Architect accepts all review findings as in-scope factual and
  internal-consistency defects and assigns exact remediation in T016--T022.
- D010: Ticket-photo counts must distinguish filesystem identity from content
  usage: 275 unique local JPG files and 276 references. The 322 PNG repository
  format count is a separate metric and is not changed by this finding.
- D011: The E2E baseline is 51 tests in each of two projects, totaling 102 test
  executions; the prior `55 per project` and `51+4` formulations are rejected.
- D012: A path below 300 DPI cannot satisfy a `>=300 DPI` requirement. The
  preferred disposition is to raise Path A parameters and dependent dimensions;
  only a demonstrably conforming path may retain conformance language.
- D013: The usability inventory is 18 issues because its supported groups are
  seven plus eleven. README, detail prose, enumeration, and acceptance criteria
  must use that same identity/count.

## Dead Ends

- DE001: The first `pnpm run preflight` attempt stopped during
  `validate:content` because this isolated worktree had no `node_modules` and
  could not load `pdf-parse/lib/pdf-parse.js`. This was an environment-only
  dead end, not a content failure. `pnpm install --frozen-lockfile` installed
  the already locked dependencies without changing dependency manifests; the
  single repeated full preflight passed.

## Known Issues

- KI001: PR #207 was observed at pre-memory head
  `8d2030d646c39b808f3e0ff2ed3f51ac71b7837c`; its green checks are historical
  and cannot satisfy a later current head.
- KI002: Existing exact audit measurements are time-bound and can drift after
  `bd0ce1dd3e367f07db8528248f9cb00e2b296441`; snapshot qualification is required.
- KI003: The current P1 review discussion/failed AI Review remains a blocker
  until the new head receives independent review and GitHub disposition.
- KI004: Head `221885b7334746445e873427c884c73e108aa471` has an independent
  changes-required review covering stale cycle/evidence memory and five
  documentation consistency defects (photo inventory, E2E count, DPI path,
  usability count, and resulting semantic evidence). It is not eligible for
  final validation or merge.
- KI005: Any local or GitHub results recorded before the T016--T021 fix commit
  are historical for the next pushed head. Scoped checks, full preflight, and
  independent review must be fresh for that new SHA.

## Verification Evidence

- Verification context: checks ran in the assigned worktree on branch
  `docs/improvement-specs`, with checked-out PR head
  `8d2030d646c39b808f3e0ff2ed3f51ac71b7837c` plus the scoped candidate changes
  recorded by T003--T008. The post-commit/push head must receive fresh GitHub
  checks and independent review; no result from the checked-out pre-memory head
  is treated as final GitHub evidence.
- `git diff --check` — exit 0, no whitespace errors.
- `node scripts/check-feature-memory.mjs --worktree` — exit 0:
  `No configured product paths changed; feature-memory gate passes.`
- Exact inventory commands from `plan.md` — exit 0: 24 Markdown files total,
  three priority files, and exactly one top-level numbered file for every
  identity `04..22`.
- Exact local-link command from `plan.md` — exit 0:
  `resolved local Markdown links in 24 files`. No local anchor fragments are
  present, so there is no separate unresolved anchor target.
- Exact README coverage command from `plan.md` — exit 0:
  `README uniquely indexes 22 detail documents`.
- Exact snapshot `rg` command from `plan.md` — exit 0; both README and overview
  name 2026-07-11 and full audited revision
  `bd0ce1dd3e367f07db8528248f9cb00e2b296441`, and the README qualification
  explicitly governs measurements in the index, overview, and linked details.
- Exact committed scope commands from `plan.md` — exit 0 on the checked-out
  pre-memory head and listed only `docs/improvements/**`. Before commit, the
  candidate was additionally checked with explicit scoped staging/diff guards
  so the new memory is limited to `specs/042-improvement-backlog/**`; no
  `src/`, `content/`, `tests/`, scripts, workflows, dependency manifests, or
  runtime/configuration file is part of the candidate.
- `pnpm install --frozen-lockfile` — exit 0 after DE001; lockfile was already up
  to date and no dependency manifest changed.
- Repeated `pnpm run preflight` — exit 0: feature-memory and repository-baseline
  gates passed; content validation passed for 460 questions/276 local image
  references; 485 Node tests passed; production build passed; 102 Playwright
  tests passed across desktop Chromium and mobile projects.

### Semantic index/detail and minimum-field evidence

All 22 details retain context/problem, goals, actionable requirements/design or
plan, acceptance criteria, risks, affected areas, and dependencies where
relevant. `Не-цели` is explicit in the larger/high-risk proposals and semantic
scope boundaries are present in the smaller proposals; heading uniformity was
not imposed. Every linked dependency resolves to an existing backlog identity,
and the four-stage README sequence covers every identity without creating an
extra proposal.

| Identity | Index metadata, dependencies, and sequence | Minimum future-intake content | Disposition |
|---|---|---|---|
| P1 | Priority/category/title agree; 18 issues reconcile as seven higher-severity plus eleven medium/low, effort is six themes across eight slices, and AC-9 agrees with 51 tests/project (102 executions); dependencies and stage 1--3 slices agree | Complete | Corrected counts and acceptance baseline |
| P2 | Priority/effort/category/title and six stages agree; dependencies and stage 2--3 placement agree | Complete | Agrees |
| P3 | Priority/category/title agree; five stages, 275 unique JPG/276 references through AC-3, and Swift Path A at scale 4.2 (~302.4 DPI) agree with requirements; dependencies and stage 2--3/4 linkage agree | Complete | Corrected counts, acceptance baseline, and DPI path |
| 04 | P1 / XL / architecture/title agree; links 05, 06, 07, 08, 11, 17, P1 and stage 3 agree | Complete | Agrees |
| 05 | P1 / M / architecture-UX/title agree; links P1, 04, 08 and stage 2 linkage agree | Complete | Agrees |
| 06 | P1 / M / data-reliability summary agrees with detailed architecture/reliability category; links P1, 11, 15 and stage 3 agree | Complete | Intentional shorter index category |
| 07 | P2 / M / extensibility/title agree; links 04, P2 and stage 3 inclusion agree | Complete | Agrees |
| 08 | P2 / M / architecture/title agree; links 04, 05, P1 and stage 3 inclusion agree | Complete | Agrees |
| 09 | P1 / S / performance/title agree; links P1, 17 and stage 2 linkage agree | Complete | Agrees |
| 10 | P1 / M / performance/title agree; links 04, 13, P3 and stage 3 agree | Complete | Agrees |
| 11 | P1 / M / correctness/title agree; links P1, 06, 04 and stage 3 agree | Complete | Agrees |
| 12 | P1 / M / PWA summary agrees with detailed PWA/offline category; links 13, 15 and stage 3 agree | Complete | Intentional shorter index category |
| 13 | P1 / M / PWA-offline/title agree; links 12, 10, 14, P3 and stage 1/3 split agree | Complete | Agrees |
| 14 | P1 / S / infrastructure/title agree; links P3, 13 and stage 1 agree | Complete | Agrees |
| 15 | P2 / M / data-reliability summary agrees with detailed PWA/data category; links 06, 12, P1 and stage 4 agree | Complete | Intentional shorter index category |
| 16 | P0 / M / code-quality/title agree; links 04, 17, 18 and stage 1 foundation agree | Complete | Agrees |
| 17 | P1 / L / testing/title agree; links 04, 06, 09, 16 and stage 3 sequencing agree | Complete | Agrees |
| 18 | P2 / M / DX-CI/title agree; links 16, 21 and stage 4 agree | Complete | Agrees |
| 19 | P2 / L / infrastructure/title agree; links P3, 18 and stage 4 agree | Complete | Agrees |
| 20 | P2 / M / pipeline/title agree; links P3, 21 and stage 4 joint wave agree | Complete | Agrees |
| 21 | P3 / M / maintainability/title agree; links 18, 20, P2 and stage 4 agree | Complete | Agrees |
| 22 | P0 / S / legal summary agrees with detailed legal/docs category; links P1, 05 and stage 1 agree | Complete | Intentional shorter index category |

- Pending GitHub evidence: current-head required checks, review-thread state,
  mergeability, and conflict state are recorded by Orchestrator after review.

### Review-fix evidence

- Review Agent inspected PR #207 at full head
  `221885b7334746445e873427c884c73e108aa471` and returned changes required.
- Accepted findings: cycle/evidence memory still described the pre-memory head;
  ticket photos incorrectly used 322 instead of 275 unique JPG/276 references;
  E2E prose conflicted between 55/project and the verified 51/project (102
  total); Path A called ~288 DPI sufficient for a >=300-DPI requirement; the
  usability inventory claimed 17 although its groups total 7+11=18; semantic
  evidence therefore requires refresh after corrections.
- Architect disposition: all findings become mandatory docs/process-memory
  tasks T016--T022. No product/runtime implementation and no final validation
  is authorized by this disposition.
- Implementation candidate applies the accepted factual corrections consistently
  through the README/overview, P1/P3 problem statements, plans, targets, and
  acceptance criteria. Exact candidate SHA and fresh check outcomes are recorded
  only after content commit A is created and verified.

## Cycle PR Set

| Purpose | Branch | PR | Verified base | Current/final head | Status | Included in final validation |
|---|---|---|---|---|---|---|
| Audit backlog, focused documentation corrections, and complete feature memory | `docs/improvement-specs` | [#207](https://github.com/cucumberfalse/cabadrive/pull/207) | `bd0ce1dd3e367f07db8528248f9cb00e2b296441` | Reviewed current head `221885b7334746445e873427c884c73e108aa471`; update to the new pushed review-fix head after T016--T021 | Open; changes required by independent review, original P1/AI Review remains blocked, T016--T022 pending | Yes |

No second cycle PR is currently authorized. If Orchestrator adds one, append it
before final validation with purpose, branch, PR, head, status, and inclusion.

## Final Validation Evidence

- Effective content head: pending.
- Architect return count: 0.
- Analyst return count: 0.
- Limit escalation: none.
- Architect validation pass: pending.
- Final Architect validation completed at: pending.
- Architect validated effective content head: pending.
- Analyst validation pass: pending; must occur after Architect.
- Final Analyst validation completed at: pending.
- Analyst validated effective content head: pending.
- Current-PR-head read-only guard: pending. It must compare the actual PR head
  with the full effective content SHA and prove every later commit, if any,
  changes only role-owned final-validation evidence. Any documentation,
  implementation, review-disposition, task-scope, or other non-evidence change
  makes both validations stale.

## Implementation Agent Feedback

- None. The two semantic contradictions were concrete in-scope documentation
  corrections recorded in D007, not new backlog proposals. No unresolved
  improvement or divergence requires Architect disposition.
