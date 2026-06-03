# Tasks: Complete The Interactive Russian Manual

## Status Legend

- `[x]` Complete
- `[ ]` Pending

## Architect Planning Tasks

- [x] T001 Confirm Architect assignment, worktree `/Users/chap/devel/cabadrive-worktrees/031-manual-document-completion`, branch `codex/031-manual-document-completion`, and verified base `origin/main` at `b07d5c72bf1689e7dac480e937c366a528d20299`.
- [x] T002 Preserve role boundary: Architect edits only `spec.md`, `plan.md`, and `tasks.md` in `specs/031-manual-document-completion/`.
- [x] T003 Read required repository memory and project docs.
- [x] T004 Read prior feature `030` feature request, spec, plan, and tasks.
- [x] T005 Read current Analyst artifact `feature-request.md`.
- [x] T006 Inspect current manual navigation and Chapter 1/2 interactive registry as read-only inputs.
- [x] T007 Record Chapter 1 as already merged through PR #184 and Chapter 2 as the next likely chapter-level PR.
- [x] T008 Define full manual source unit inventory, including Chapters 2-5, Appendices I-IV, and front matter pages `1-13`.
- [x] T009 Preserve active user requirement: one source manual chapter equals one PR from now on.
- [x] T010 Treat appendices as chapter-equivalent PR units.
- [x] T011 Record front-matter disposition as a separate support PR with include/omit evidence.
- [x] T012 Add explicit high-resolution x5/equivalent export evidence requirements.
- [x] T013 Add source-as-is requirements for photos, traffic signs, and road-marking images.
- [x] T014 Add infographic source-image transfer and glyph/letter-level cleanup requirements.
- [x] T015 Plan audit/correction handling for already merged Introduction and Chapter 1 under stricter visual rules.
- [x] T016 Define cycle PR-set tracking, review, final validation, required checks, visual/source-fidelity evidence, and local/Docker verification expectations.

## Planned Shared / Prerequisite Slices

- [x] T017 Orchestrator assigns visual-rule prerequisite PR from latest verified `main` in a fresh isolated worktree/branch; warn about parallel work and preserve sibling state.
- [x] T018 Implementation Agent updates durable manual conversion guidelines if needed so x5/equivalent high-resolution export, source-as-is photo/sign/marking handling, and source-image/glyph-level infographic cleanup become repository-wide policy.
- [x] T019 Implementation Agent updates manual guide checker/evidence schema to record extraction method, dimensions/hash, source-as-is exception kinds, cleanup scope, runtime display-size/no-upscale evidence, screenshots, and pass/fail output.
- [x] T020 Implementation Agent adds or updates tests that reject approximate infographic redraws, broad masks/plates/patches, translated or reconstructed signs/markings/photos, low-resolution/upscaled assets, and missing visual metadata.
- [x] T021 Visual-rule prerequisite PR records focused verification, preflight, Docker evidence if runtime-affecting, Review Agent findings, final validation if applicable, and PR-set row.

## Existing Content Audit / Correction Slices

- [x] T022 Orchestrator assigns Introduction and Chapter 1 visual-rule audit PR/task slice from latest verified `main`; no unrelated Chapter 2+ content is included.
- [x] T023 Audit Introduction pages `14-20`, including named guideline fixtures for pages `15`, `17`, `18`, and `19`.
- [x] T024 Audit Chapter 1 pages `21-42`, including all six merged Chapter 1 sections and their runtime assets/evidence.
- [x] T025 Audit records no-fix evidence or creates explicit correction tasks for every stricter-rule gap.
- [ ] T026 If Introduction correction is needed, Orchestrator assigns scoped correction PR(s) and preserves existing routes/hashes.
- [ ] T027 If Chapter 1 correction is needed, Orchestrator assigns scoped correction PR(s) by affected section/chapter; do not mix fixes into unrelated future chapter content.
- [ ] T028 Correction PRs replace noncompliant visuals with high-resolution source transfers, keep photos/signs/markings source-as-is, use glyph-level infographic cleanup only, keep Russian explanation outside protected images, and record evidence.

## Chapter / Appendix Content Slices

- [ ] T029 Orchestrator assigns Chapter 2 PR from fresh latest `main`; scope is pages `43-56` and sections `ch2-legal-responsibility`, `ch2-required-documents`, `ch2-incident-obligations`, `ch2-scoring` only.
- [ ] T030 Chapter 2 implementation preserves page `55` boundary between incident obligations and Scoring and records page `56` closing-slogan disposition.
- [ ] T031 Chapter 2 PR records legal/document/scoring detail-retention evidence and visual evidence under the stricter rules.
- [ ] T032 Orchestrator assigns Chapter 3 PR from fresh latest `main`; scope is pages `57-88` only.
- [ ] T033 Chapter 3 implementation covers priority, right-of-way, lights, speed, turns, overtaking, highways, adverse conditions, and stopping/parking sections in source order.
- [ ] T034 Orchestrator assigns Chapter 4 PR from fresh latest `main`; scope is pages `89-97` only.
- [ ] T035 Chapter 4 implementation preserves page `94` sleep/fatigue and stress boundary and page `95` distractions direct navigation behavior.
- [ ] T036 Orchestrator assigns Chapter 5 PR from fresh latest `main`; scope is pages `98-103` only.
- [ ] T037 Chapter 5 implementation preserves page `100` boundary between equality and gender-violence support topics.
- [ ] T038 Orchestrator assigns Appendix I PR from fresh latest `main`; scope is pages `104-122` only.
- [ ] T039 Appendix I implementation covers private-car safety element sections with high-resolution source visual evidence.
- [ ] T040 Orchestrator assigns Appendix II PR from fresh latest `main`; scope is pages `123-151` only.
- [ ] T041 Appendix II implementation covers passenger-transport sections and professional-driver details.
- [ ] T042 Orchestrator assigns Appendix III PR from fresh latest `main`; scope is pages `152-183` only.
- [ ] T043 Appendix III implementation covers cargo-driver, cargo safety, and highway sections with legal/equipment detail retention.
- [ ] T044 Orchestrator assigns Appendix IV PR from fresh latest `main`; scope is pages `184-200` only.
- [ ] T045 Appendix IV implementation keeps all traffic signs and road-marking images source-as-is, with Russian explanation outside images.
- [ ] T046 Orchestrator assigns front-matter support PR from fresh latest `main`; scope is pages `1-13` only.
- [ ] T047 Front-matter PR implements learner-useful `front-presentation` and `front-glossary` unless source-backed omission is recorded.
- [ ] T048 Front-matter PR records explicit omit/navigation-only evidence for title, categories, and index pages when they are book-only/source-structure material.

## Per-Chapter Implementation Checklist

For each chapter-equivalent content PR:

- [ ] T049 Confirm Orchestrator assignment, isolated worktree, branch, PR slice, latest-main base SHA, and parallel-work warning.
- [ ] T050 Read `feature-request.md`, `spec.md`, `plan.md`, and `tasks.md` before editing.
- [ ] T051 Record baseline `git status --short --branch` and verify no sibling work is touched.
- [ ] T052 Inspect `navigation.ru.json`, `manual.ru.json`, `layout.ru.json`, local source page renders, and official PDF when region/crop fidelity requires it.
- [ ] T053 Record source child sections, source ranges, shared-page boundaries, omitted book artifacts, visual inventory, legal/numeric/detail risks, and route ids.
- [ ] T054 Implement only the assigned source chapter/appendix/front-matter scope.
- [ ] T055 Keep Russian headings, prose, lists, captions, callouts, labels, and meaningful overlay text selectable/copyable DOM/SVG where feasible.
- [ ] T056 Preserve source order and all ticket-critical legal, numeric, safety, document, sign, marking, scoring, exception, phone/contact, and ordered-list details.
- [ ] T057 Extract new images/crops at x5 zoom/source export target or document equivalent/better method with dimensions/hash/runtime-size evidence.
- [ ] T058 Keep photos, traffic signs, and road-marking images unmodified source-as-is; put Russian explanation outside the image.
- [ ] T059 Transfer infographics as high-quality source images; remove Spanish only at glyph/letter level; preserve connectors/shapes/pictograms; overlay selectable Russian text where feasible.
- [ ] T060 Avoid runtime PDF viewer, PDF.js, iframe/object/embed PDF, full-page raster, side-by-side source reader, remote assets/fonts, runtime fetch, backend call, analytics, or live AI.
- [ ] T061 Add/update route, content coverage, source inventory, visual metadata, source-as-is, infographic cleanup, forbidden-pattern, selectable-text, responsive, and Playwright tests.
- [ ] T062 Run focused checks, local preflight, Docker runtime validation where applicable, and `git diff --check`; record exact commands/results.
- [ ] T063 Update this `tasks.md` with decisions, dead ends, known issues, evidence, Implementation Agent feedback, and cycle PR-set row.

## Cycle PR Set

| Purpose | Source unit/pages | Branch / PR | Base SHA | Head SHA | Status | Included in final validation |
| --- | --- | --- | --- | --- | --- | --- |
| Merged baseline: Chapter 1 completion | Chapter 1 pages `21-42` | PR #184, merged | `501199aa6c35f46bcb4d363918da5a99a2329304` for PR #184; current cycle base `b07d5c72bf1689e7dac480e937c366a528d20299` | merge commit `b07d5c72bf1689e7dac480e937c366a528d20299` | merged into `main`; Chapter 1 complete baseline | yes, as existing baseline/audit subject |
| Visual-rule prerequisite | Shared docs/checker/evidence/tests/process memory; no chapter content implementation | branch `codex/031-manual-document-completion`; PR #185, merged | `b07d5c72bf1689e7dac480e937c366a528d20299` | merge commit `3b7fb9f2930dc5986cf54175556e9b9ab9ab4b5c` | merged into `main`; strict visual-rule prerequisite available for audit and future chapter PRs | yes |
| Introduction and Chapter 1 visual audit | Introduction `14-20`, Chapter 1 `21-42` | branch `codex/031-intro-ch1-visual-audit`; PR #186, https://github.com/cucumberfalse/cabadrive/pull/186 | `3b7fb9f2930dc5986cf54175556e9b9ab9ab4b5c` | audit effective content/evidence head `3adff758f3c71679ac8dbb2572779c5a16344111`; original audit evidence commit `7058d2760e0aff32035c15e75a18e0f4dd7defda`; branch head before this process-only explanatory repair `055b001d5f06f3f2b4a17fa7f7d59b0ee1164250`; process-memory-only repair commits after the audit effective head are not audit content heads; exact current/final PR branch head is verified from GitHub PR metadata and recorded by final validation/current-head guard before merge | audit-only PR opened ready; no runtime content/assets/docs changed; no correction tasks needed from this audit | yes |
| Introduction/Chapter 1 corrections | scoped affected sections only if audit finds gaps | not needed after audit | `3b7fb9f2930dc5986cf54175556e9b9ab9ab4b5c` | not applicable | audit found no stricter-rule gaps requiring correction PRs | yes if created |
| Chapter 2 content | pages `43-56` | pending | pending | pending | next likely chapter-level PR | yes |
| Chapter 3 content | pages `57-88` | pending | pending | pending | pending | yes |
| Chapter 4 content | pages `89-97` | pending | pending | pending | pending | yes |
| Chapter 5 content | pages `98-103` | pending | pending | pending | pending | yes |
| Appendix I content | pages `104-122` | pending | pending | pending | pending | yes |
| Appendix II content | pages `123-151` | pending | pending | pending | pending | yes |
| Appendix III content | pages `152-183` | pending | pending | pending | pending | yes |
| Appendix IV content | pages `184-200` | pending | pending | pending | pending | yes |
| Front-matter support | pages `1-13` | pending | pending | pending | pending | yes |

## Source Unit Inventory

| Unit | Source pages | Disposition | Status |
| --- | ---: | --- | --- |
| Front matter | `1-13` | Separate support PR; include learner-useful presentation/glossary; omit book-only title/index/category pages with evidence | pending |
| Introduction | `14-20` | Already implemented; stricter visual audit completed in branch `codex/031-intro-ch1-visual-audit` | audit complete; no correction needed |
| Chapter 1 | `21-42` | Already merged through PR #184; stricter visual audit completed in branch `codex/031-intro-ch1-visual-audit` | merged and audited; no correction needed |
| Chapter 2 | `43-56` | One chapter PR, next likely | pending |
| Chapter 3 | `57-88` | One chapter PR | pending |
| Chapter 4 | `89-97` | One chapter PR | pending |
| Chapter 5 | `98-103` | One chapter PR | pending |
| Appendix I | `104-122` | One chapter-equivalent PR | pending |
| Appendix II | `123-151` | One chapter-equivalent PR | pending |
| Appendix III | `152-183` | One chapter-equivalent PR | pending |
| Appendix IV | `184-200` | One chapter-equivalent PR; source-as-is signs/markings | pending |

## Verification Evidence To Record Per PR

- Exact base SHA and branch/worktree path.
- Source pages and section ids implemented or audited.
- Visual extraction/export method and x5/equivalent evidence.
- Runtime asset dimensions/hash and no-upscale evidence.
- Source-as-is exception records for photos, signs, and road markings.
- Glyph/letter-level cleanup evidence for infographics where Spanish text is removed.
- Desktop/mobile/narrow screenshots for high-risk visual blocks.
- Playwright no-overflow/no-overlap/selectable-text checks.
- Content/detail-retention checks.
- Forbidden-pattern scans.
- Required local commands and results.
- Docker build/runtime smoke evidence.
- Review findings and dispositions.
- Final validation markers and effective content head where applicable.

## Decisions

- PR #185 remains a visual-rule prerequisite only: no Chapter 2+ content, no runtime manual pages, no new chapter assets, and no Introduction/Chapter 1 audit or correction implementation are included.
- Strict future manual units must require x5/equivalent high-resolution image/crop export evidence, byte-verified local asset and source crop hashes, actual image-byte dimensions for strict image categories, and runtime no-upscale evidence.
- Photos, traffic-sign images, and road-marking images must remain source-as-is with no translation, relabeling, redraw, recolor, cleanup, reconstruction, retouching, masking, inpainting, or meaningful-content removal; Russian explanation belongs outside protected images.
- Infographics and diagrams must be transferred as high-quality source images rather than approximate redraws; Spanish cleanup is glyph/letter-level only, with broad patches/masks/plates forbidden and Russian overlay text selectable where feasible.
- Legacy Chapter 1 baseline evidence remains allowed only for unchanged merged baseline state until the planned audit/correction slice; new or changed future manual units require strict v3 evidence.
- Implementation decision, Introduction/Chapter 1 visual audit `2026-06-03T07:32:00Z`: audit-only slice assigned in worktree `/Users/chap/devel/cabadrive-worktrees/031-intro-ch1-visual-audit`, branch `codex/031-intro-ch1-visual-audit`, latest-main base `3b7fb9f2930dc5986cf54175556e9b9ab9ab4b5c` from merged PR #185. Scope remained process-memory audit evidence only: no Chapter 2+ content, front matter, runtime manual content, source assets, durable docs, tests, or checker code changed.
- Audit decision: Introduction pages `14-20` and Chapter 1 pages `21-42` satisfy the stricter visual-rule requirements from PR #185 based on existing source-fidelity evidence, focused tests, and read-only asset/hash/dimension inspection. No Introduction or Chapter 1 correction PR is needed from this audit.
- Process-memory repair decision, PR #186: the reusable per-chapter implementation checklist remains pending because this PR is audit-only; audit completion is recorded in T022-T025 and audit evidence sections.

## Dead Ends

- Resolved: strict fixture failures exposed legacy visible-Spanish ordering, source-integrity isolation, Chapter 2 strict fixture category setup, and temp-path false positives during forbidden-term matching; the checker/tests now cover those cases.
- Resolved: review repairs closed legacy-registry exemption, strict diagram transfer proof, strict hash/provenance byte verification, legacy baseline-state fingerprinting, forbidden-term/asset-kind scanning, visible-Spanish exception gating, transferred-artwork Spanish rejection, and strict image byte-dimension validation.
- No unresolved dead ends remain for PR #185 process-memory finalization repair.
- No audit dead ends: the Introduction/Chapter 1 audit did not require PDF re-export or runtime changes because existing local source-region artifacts, source page renders, evidence metadata, and focused fixture tests were sufficient to verify source-fidelity status.
- Resolved audit verification setup: first `pnpm run validate:content` attempt failed because this fresh worktree lacked `node_modules` and `pdf-parse`; `pnpm install --frozen-lockfile` installed the lockfile-pinned dependencies, and all verification commands passed on rerun.

## Known Issues

- No unresolved known issues.
- Existing Vite large chunk warning is pre-existing and non-fatal for this prerequisite scope; known issue not applicable to PR #185 merge readiness. Disposition: not applicable.
- Audit known issues: none. Introduction and Chapter 1 audit found no stricter-rule gaps requiring correction tasks; the Vite large chunk warning remains pre-existing, non-fatal, and unrelated to this audit-only process-memory PR.

## Final Validation Evidence

- Effective content head: ae5db4936c77f759e337c07e84c95924eee0db74
- Final-validation evidence-only commit: `98572bf79fc463700e07fd2b6c245bcdcd396511` recorded Architect validation for `ae5db4936c77f759e337c07e84c95924eee0db74`.
- Final-validation evidence-only commit: `a9a7a6b0cccc0e0840439b0a4cb62382861490fa` recorded Analyst validation for `ae5db4936c77f759e337c07e84c95924eee0db74`.
- Architect return count: 0
- Analyst return count: 0
- Analyst feedback Architect disposition: none; no unresolved Analyst feedback required Architect action for PR #185 prerequisite scope.
- Limit escalation: none
- Effective content head: 1a45d342637feae88f2c102cbb9cf815079eaefb
- Architect validation: passed at 2026-06-03T06:06:15Z for effective content head 1a45d342637feae88f2c102cbb9cf815079eaefb.
- Architect validated effective content head: 1a45d342637feae88f2c102cbb9cf815079eaefb
- Architect return count: 0
- Architect validation evidence: PR #185 prerequisite scope validated after strict crop/extraction dimension repair and follow-up process-memory wording fix.
- Architect disposition: no unresolved Implementation Agent feedback remains for PR #185 at 1a45d342637feae88f2c102cbb9cf815079eaefb.
- Limit escalation: none
- Effective content head: bc71004c284984f682745ce0337bf2e154fef143
- Architect validation: passed at 2026-06-03T06:31:34Z for effective content head bc71004c284984f682745ce0337bf2e154fef143.
- Architect validated effective content head: bc71004c284984f682745ce0337bf2e154fef143
- Architect return count: 0
- Architect validation evidence: PR #185 prerequisite scope validated after source-as-is provenance byte/dimension/hash repair and broad cleanup forbidden-term repair.
- Architect disposition: no unresolved Implementation Agent feedback remains for PR #185 at bc71004c284984f682745ce0337bf2e154fef143.
- Limit escalation: none
- Effective content head: 8d1b217b79e322a03f29b2ebda1e83c3a0ac7a82
- Architect validation: passed at 2026-06-03T06:55:33Z for effective content head 8d1b217b79e322a03f29b2ebda1e83c3a0ac7a82
- Required checks before Architect validation: baseline-checks pass, docker-validation pass after rerun for Docker Hub timeout, guard pass, osv-scan pass, AI Review pass on 8d1b217b79e322a03f29b2ebda1e83c3a0ac7a82
- Review Agent before Architect validation: no actionable findings at 8d1b217b79e322a03f29b2ebda1e83c3a0ac7a82
- Architect validation: prior Architect/Analyst validations for older heads are stale after non-evidence repairs; this validation supersedes them for effective content head 8d1b217b79e322a03f29b2ebda1e83c3a0ac7a82.
- Architect validated effective content head: 8d1b217b79e322a03f29b2ebda1e83c3a0ac7a82
- Architect return count: 0
- Architect validation: PR #185 prerequisite scope validated after transferred infographic/diagram source-crop linkage repair with required checks and Review Agent no-findings at the effective content head.
- Architect validation: no unresolved Implementation Agent feedback remains for PR #185 at 8d1b217b79e322a03f29b2ebda1e83c3a0ac7a82.
- Limit escalation: none
- Final-validation evidence-only commit: ac4a5fd87ea4b3161b35a7fa4d0a0e1a90b9eac2 recorded Architect validation evidence for effective content head 8d1b217b79e322a03f29b2ebda1e83c3a0ac7a82 in tasks.md.
- Final-validation evidence-only commit: f2a4047e3344e14b21bc740a015971079869b6ad recorded Analyst validation evidence for effective content head 8d1b217b79e322a03f29b2ebda1e83c3a0ac7a82 in feature-request.md.
- Current-PR-head read-only guard: Orchestrator verified current PR head f2a4047e3344e14b21bc740a015971079869b6ad against effective content head 8d1b217b79e322a03f29b2ebda1e83c3a0ac7a82; post-effective changes were final-validation evidence only in tasks.md and feature-request.md, required checks passed, mergeability was CLEAN/MERGEABLE, and review threads were resolved.
- Effective content head: ed7c9fe9db2bbb8b31e7fa67e8166c88e53cfd57
- Architect validation: passed at 2026-06-03T08:12:17Z for effective content head ed7c9fe9db2bbb8b31e7fa67e8166c88e53cfd57
- Architect validated effective content head: ed7c9fe9db2bbb8b31e7fa67e8166c88e53cfd57
- Architect return count: 0
- Architect validation: PR #186 audit-only no-fix scope validated with no Chapter 2+ content or runtime/content/assets changes.
- Architect validation: required checks passed on ed7c9fe9db2bbb8b31e7fa67e8166c88e53cfd57: baseline-checks, docker-validation, guard, AI Review, and osv-scan.
- Architect validation: Review Agent no-findings review 4416640043 and AI Review no-major-issues summary apply to ed7c9fe9db2bbb8b31e7fa67e8166c88e53cfd57.
- Analyst feedback Architect disposition: none for PR #186 audit-only scope.
- Limit escalation: none
- Final-validation evidence-only commit: 225b2db7d5938a57cd860f3f4a3bc5b3fcdd7d52 recorded Architect validation evidence for effective content head ed7c9fe9db2bbb8b31e7fa67e8166c88e53cfd57 in tasks.md.
- Final-validation evidence-only commit: 59ebb2b1de23a518c7589f3e2bcb8a6c3083c55b recorded Analyst validation evidence for effective content head ed7c9fe9db2bbb8b31e7fa67e8166c88e53cfd57 in feature-request.md.
- Current-PR-head read-only guard: Orchestrator verified current PR head 59ebb2b1de23a518c7589f3e2bcb8a6c3083c55b against effective content head ed7c9fe9db2bbb8b31e7fa67e8166c88e53cfd57; post-effective changes were final-validation evidence only in tasks.md and feature-request.md, and this guard-evidence commit remains final-validation process evidence for the same effective content head.

## Known Issues / Architect Dispositions

- Chapter 1 is already merged through PR #184. Architect disposition: do not reimplement it in future chapter PRs; audit and correction only through explicit scoped PRs.
- Chapter 2 Scoring source boundary from feature `030`: Architect disposition remains active; Scoring content starts on source page `55`, and source page `56` is a closing slogan, not a standalone Scoring section.
- Front matter is not a source chapter. Architect disposition: handle as one front-matter support PR with include/omit evidence for pages `1-13`.
- Appendices are large and visual-heavy. Architect disposition: keep one PR per appendix unless implementation evidence proves an exception is necessary; route such feedback to Architect before splitting.
- Existing durable guidelines do not yet fully spell out the newest x5/source-as-is/glyph-cleanup wording. Architect disposition: plan a prerequisite docs/checker update slice; Architect does not edit durable docs in this assignment.
- Implementation evidence, `2026-06-03T01:23:12Z`: prerequisite slice updated `docs_project/project/frontend/manual-conversion-guidelines.md`, `content/validation/manual-guide-source-fidelity.evidence.json`, `scripts/manual-guide-source-fidelity.mjs`, and `tests/content-manual-guide-chapters.test.mjs`; no runtime manual pages, section modules, Chapter 2+ content, new chapter assets, or Introduction/Chapter 1 audit/correction implementation were added.
- Implementation decision: feature `030-manual-chapters-1-2` remains a legacy visual-evidence baseline and is not silently rewritten in this prerequisite slice. Review fix updated this decision: only the already-merged Chapter 1 section IDs may remain legacy-allowed until the planned audit/correction slice; newly implemented sections outside that explicit set, including pending Chapter 2 entries in the same registry, require strict v3 evidence.
- Implementation decision: strict visual evidence vocabulary is whole-manual ready and uses `source-as-is-photo`, `source-as-is-traffic-sign`, `source-as-is-road-marking`, `source-transferred-infographic`, `source-transferred-diagram`, `native-dom-text-only`, and `reference-only-not-runtime` categories instead of Chapter 1/2-only terminology.
- Implementation decision, review fix `2026-06-03T01:33:57Z`: P1 Review Agent finding was accepted and fixed. The checker now scopes the legacy allowance by explicit `legacyBaselineSectionIds` / hardcoded Chapter 1 allowlist instead of whole-registry `featureId`, so a fixture that marks `ch2-legal-responsibility` implemented with legacy evidence fails unless strict v3 evidence is present.
- Implementation decision, review fix `2026-06-03T01:33:57Z`: automated Codex P2 was valid and in scope. Strict `native-dom-text-only` and `reference-only-not-runtime` local asset records no longer require image-only fields such as `width`, `height`, `runtimeDisplaySize`, or `extractionScaleEvidence`; strict image categories still require dimensions, hash, extraction, and no-upscale evidence.
- Implementation decision, review fix `2026-06-03T01:50:45Z`: current-head automated Codex P2 about `source-transferred-diagram` was valid and in scope. Strict diagram assets now require dedicated `diagramTransfer` proof for source-diagram transfer, no approximate redraw, no reconstruction, no generic icon replacement, and no broad mask/plate/patch cleanup. The strict evidence policy JSON and durable guidelines now name this diagram-transfer requirement.
- Implementation decision, review fix `2026-06-03T01:59:34Z`: current-head automated Codex P2 about strict image asset hashes was valid and in scope. Strict image `localAssetMetadata[].sha256` now must be a valid 64-hex SHA-256 string; passing strict fixtures use valid hash strings, and `cropSha256` remains unchanged because the finding and regression path are about required strict local image asset hashes.
- Implementation decision, review fix `2026-06-03T02:07:34Z`: current-head automated Codex P2 about strict source crop provenance hashes was valid and in scope. This supersedes the previous local-asset-only hash decision for strict source-region metadata: strict `sourceRegionMetadata[].cropSha256` now must be a valid 64-hex SHA-256 string, and strict fixtures use valid crop hash strings while legacy non-strict fixture placeholders remain outside strict validation.
- Implementation decision, review fix `2026-06-03T02:23:22Z`: current-head automated Codex P2 about section-ID-only legacy exemption was valid and in scope. Legacy exemption now requires both the explicit Chapter 1 legacy section allowlist and a stable SHA-256 fingerprint match for the already-merged baseline `implementationEvidence`; future audit/correction/reimplementation evidence changes for those same section IDs require strict v3 evidence.
- Implementation decision, review fix `2026-06-03T02:35:27Z`: current-head automated Codex P2 about syntactic-only strict hashes was valid and in scope. Strict image `localAssetMetadata[].sha256` now hashes the referenced `assetPath` bytes and strict source crop `sourceRegionMetadata[].cropSha256` now hashes the referenced `sourceAssetPath` crop artifact bytes; the existing merged Chapter 1 baseline still passes through the baseline legacy exemption.
- Implementation decision, review fix `2026-06-03T02:47:01Z`: current-head automated Codex P2 about baseline legacy exemption fingerprinting was valid and in scope. The legacy exemption now requires both the existing baseline `implementationEvidence` fingerprint and a `legacyBaselineStateFingerprints` match that hashes the section module bytes plus referenced source crop/runtime visual asset bytes; changing a legacy Chapter 1 module or referenced visual asset without strict v3 evidence now fails and requires strict visual evidence.
- Implementation decision, review fix `2026-06-03T02:56:38Z`: current-head automated Codex P2 about exact-literal forbidden visual-edit term matching was valid and in scope. Strict metadata now rejects canonical forbidden terms across case-insensitive hyphen, space, and underscore separators while skipping path/hash/id fields to avoid broad false positives; strict `visualReviewNotes` are scanned for the same forbidden terms.
- Implementation decision, review fix `2026-06-03T03:09:44Z`: current-head automated Codex P2 about forbidden `assetKind` values was valid and in scope. Strict forbidden-term scanning now includes semantic kind/category/approach metadata such as `assetKind` and `assetCategory` while continuing to skip path/hash/id fields, so strict evidence cannot describe runtime visuals as generic icon replacements or redrawn diagrams while passing under favorable category booleans.
- Implementation decision, repair fix `2026-06-03T03:29:11Z`: AI Review P2 comment `3345717864` about strict protected source-as-is assets hiding visible Spanish behind top-level `visibleSpanishStatus: "none"` was valid and in scope. Strict protected source-as-is assets with `visibleSpanish: true` now require a matching `visibleSpanishStatus.exceptions[].assetPath` entry, so sourceIntegrity alone is insufficient. This is a non-evidence checker/test/evidence-policy repair, so prior final Architect and Analyst validation for effective content head `36316f3781b9b04f305725018522b0f55407f900` is stale and must be rerun after the repair.
- Implementation decision, repair fix `2026-06-03T03:36:19Z`: Review Agent P2 comment `3345744974` about accepting `visibleSpanishStatus: { status: "none", exceptions: [...] }` was valid and in scope. Strict protected source-as-is visible-Spanish assets now accept exception paths only when `visibleSpanishStatus.status` is exception-bearing for the asset type: `source_image_exceptions_only` for source-image photo/marking exceptions and `official_traffic_sign_exception_only` for traffic-sign exceptions. The prior final Architect and Analyst validation remains stale pending revalidation after this non-evidence repair.
- Implementation decision, repair fix `2026-06-03T03:45:44Z`: AI Review P2 comment `3345769598` about impossible strict mixed source-image and official traffic-sign visible-Spanish exceptions was valid and in scope. Strict protected traffic-sign assets now accept matching exception paths from either `official_traffic_sign_exception_only` sign-only evidence or `source_image_exceptions_only` mixed-capable evidence, while non-sign source-as-is assets still require `source_image_exceptions_only`; exception path matching is also filtered by exception kind. The prior final Architect and Analyst validation remains stale pending revalidation after this non-evidence repair.
- Implementation decision, repair fix `2026-06-03T04:09:57Z`: AI Review P2 comment `3345857423` about strict source-transferred infographics/diagrams allowing visible Spanish through legacy source-image exception metadata was valid and in scope. Strict `source-transferred-infographic` and `source-transferred-diagram` local assets now require `visibleSpanish: false`; only protected source-as-is photo/sign/road-marking assets may retain Spanish inside the image under explicit exception evidence. The final Architect and Analyst validation rerun notes for effective content head `c0b08aa2b23fefdb4eef1425035e94d5d6f8236c` are now stale because this non-evidence repair changes checker/test/evidence behavior.
- Implementation decision, repair fix `2026-06-03T04:16:27Z`: Review Agent P2 comment `3345889680` about strict non-protected categories using the legacy `sourceImageException` visible-Spanish path was valid and in scope. For strict v3 evidence, the post-strict local-asset visible-Spanish allowance now accepts only protected source-as-is categories through `sourceIntegrity`; legacy `officialSignException` and `sourceImageException` allowances remain available only for non-strict legacy evidence. The final Architect and Analyst validation rerun notes for effective content head `c0b08aa2b23fefdb4eef1425035e94d5d6f8236c` remain stale pending revalidation after this non-evidence repair.
- Implementation decision, repair fix `2026-06-03T04:39:25Z`: AI Review P2 comment `3345941925` about strict no-upscale checks trusting self-reported image dimensions was valid and in scope. Strict image assets now derive PNG/GIF/JPEG dimensions from referenced `assetPath` bytes, require `localAssetMetadata.width` / `height` to match those actual dimensions, reject unknown or non-image bytes for strict image categories, and use actual dimensions for runtime no-upscale checks. Strict non-image categories remain exempt from image byte dimension parsing. The latest Architect and Analyst validation evidence for effective content head `bcc377a154c936374715f6ca4ce2d5714af4a722` is stale pending revalidation after this non-evidence checker/test/evidence-policy repair.
- Implementation decision, repair fix `2026-06-03T05:49:53Z`: AI Review P2 comments `3346157020` and `3346088241` about strict source crop/extraction artifacts trusting self-reported dimensions were valid and in scope. Strict `sourceRegionMetadata[].sourceAssetPath` crop artifacts now must decode as supported PNG/GIF/JPEG image bytes, `cropDimensions` must match decoded crop bytes, and `extractionScaleEvidence.outputDimensions` must match decoded artifact dimensions for strict source crops and strict runtime image assets. Strict non-image local asset categories remain valid without image sizing metadata. The latest Architect and Analyst validation evidence for the prior effective content head is stale pending revalidation after this non-evidence checker/test/evidence-policy repair.
- Implementation decision, repair fix `2026-06-03T06:22:15Z`: Codex bot P1 comment `3346333846` about strict protected source-as-is assets self-certifying source integrity was valid and in scope. Strict `source-as-is-photo`, `source-as-is-traffic-sign`, and `source-as-is-road-marking` local assets now require `sourceIntegrity.sourceAssetPath` to reference strict `sourceRegionMetadata`, and the local asset SHA-256 plus decoded dimensions must match the referenced source crop bytes/dimensions. Codex bot P2 comment `3346315639` about missing broad cleanup term aliases was also valid and in scope; strict forbidden-term scanning now rejects `square patch`, `color-matched plate`, `opaque rectangle`, and `broad box` across case/separator variants. The Architect and Analyst validation evidence for effective content head `1a45d342637feae88f2c102cbb9cf815079eaefb` and later validation-evidence-only commits is stale pending revalidation after this non-evidence checker/test/evidence-policy repair.
- Implementation decision, repair fix `2026-06-03T06:46:07Z`: Codex bot P2 comment `3346422482` about strict `source-transferred-infographic` / `source-transferred-diagram` assets self-certifying source transfer was valid and in scope. Strict transferred infographics now require `infographicTransfer.sourceAssetPath`, `sourceCropSha256`, and `sourceCropDimensions` to match existing strict `sourceRegionMetadata`; strict transferred diagrams require the analogous `diagramTransfer` fields. Runtime transferred artwork may still differ from the source crop for glyph-level Spanish cleanup and Russian overlay, but it can no longer pass without source-crop provenance. The Architect and Analyst validation evidence for effective content head `bc71004c284984f682745ce0337bf2e154fef143` and later validation-evidence-only commits is stale pending revalidation after this non-evidence checker/test/evidence-policy repair.
- Implementation decision: Docker runtime smoke was not run for this prerequisite slice because no runtime app behavior, manual route content, source assets, Docker files, or build/runtime contract files changed. `pnpm run preflight` did run and included production build plus Playwright e2e.
- Known issue: production build continues to emit Vite's existing large chunk warning for large app/manual/source chunks. The warning is non-fatal and not introduced by this docs/checker/test prerequisite.
- Dead end resolved: first strict-fixture focused test run failed because the legacy visible-Spanish exception check ran before the new strict source-as-is category path; checker now recognizes strict protected source-as-is evidence before running v3 validation.
- Dead end resolved: one strict source-as-is negative test initially triggered the legacy visible-Spanish failure instead of the intended source-integrity failure; the fixture now isolates source-integrity validation.
- Dead end resolved, review fix: first Chapter 2 strict-pass fixture reused the future-unit helper and accidentally rewrote a DOM-only record into an image category without dimensions. The fixture now uses explicit Chapter 2 strict evidence with separate DOM-only and source-transferred-diagram records.
- Dead end resolved, review fix `2026-06-03T02:56:38Z`: the first alternate-separator regression run caught `broad-mask` in a temporary fixture directory path before the intended metadata value. The checker now scans string metadata values while ignoring path/hash/id fields so artifact path names do not create false positives.
- Repair verification, `2026-06-03T04:39:25Z`: addressed AI Review P2 comment `3345941925` for byte-derived strict image dimensions in `scripts/manual-guide-source-fidelity.mjs`, `content/validation/manual-guide-source-fidelity.evidence.json`, and `tests/content-manual-guide-chapters.test.mjs`.
- `node scripts/manual-guide-source-fidelity.mjs` after strict image-dimension repair: passed; output reported `status: pass`, `sectionsChecked: 10`, `pendingSections: 4`, `implementedSections: 6`, and `strictVisualRulePolicy: 031-strict-source-fidelity`.
- `node --test tests/content-manual-guide-chapters.test.mjs` after strict image-dimension repair: passed; `56` tests passed, `0` failed. Added regression coverage for overclaimed strict image metadata dimensions failing and strict image categories referencing non-image bytes failing, while strict non-image categories remain accepted without image sizing metadata.
- `pnpm run validate:content` after strict image-dimension repair: passed; validated difficulty labels, learning images, complete 4-wheel manual manifests/assets/translations, 460 category B fallback questions, and the manual guide checker with `strictVisualRulePolicy: 031-strict-source-fidelity`.
- `pnpm run test` after strict image-dimension repair: passed; `365` tests passed, `0` failed.
- `pnpm run build` after strict image-dimension repair: passed; production build, asset sync, and service-worker generation completed. Non-fatal Vite large chunk warning remained.
- `pnpm run preflight` after strict image-dimension repair: passed, including `check-feature-memory`, `check:repo`, `validate:content`, `test` (`365` passed), `build`, and Playwright e2e (`74` passed).
- `node scripts/check-feature-memory.mjs --worktree` after strict image-dimension repair: passed; feature-memory gate passed via `specs/031-manual-document-completion/{spec,plan,tasks}.md`.
- `git diff --check` after strict image-dimension repair: passed.
- Repair verification, `2026-06-03T05:49:53Z`: addressed AI Review P2 comments `3346157020` and `3346088241` for decoded strict source crop/extraction dimensions in `scripts/manual-guide-source-fidelity.mjs`, `content/validation/manual-guide-source-fidelity.evidence.json`, and `tests/content-manual-guide-chapters.test.mjs`.
- `node scripts/manual-guide-source-fidelity.mjs` after strict crop/extraction dimension repair: passed; output reported `status: pass`, `sectionsChecked: 10`, `pendingSections: 4`, `implementedSections: 6`, and `strictVisualRulePolicy: 031-strict-source-fidelity`.
- `node --test tests/content-manual-guide-chapters.test.mjs` after strict crop/extraction dimension repair: passed; `60` tests passed, `0` failed. Added regression coverage for overclaimed local image extraction dimensions, non-image source crop bytes, mismatched strict `cropDimensions`, and overclaimed source crop extraction dimensions.
- `pnpm run validate:content` after strict crop/extraction dimension repair: passed; validated difficulty labels, learning images, complete 4-wheel manual manifests/assets/translations, 460 category B fallback questions, and the manual guide checker with `strictVisualRulePolicy: 031-strict-source-fidelity`.
- `pnpm run test` after strict crop/extraction dimension repair: passed; `369` tests passed, `0` failed.
- `pnpm run build` after strict crop/extraction dimension repair: passed; production build, asset sync, and service-worker generation completed. Non-fatal Vite large chunk warning remained.
- `pnpm run preflight` after strict crop/extraction dimension repair: passed, including `check-feature-memory`, `check:repo`, `validate:content`, `test` (`369` passed), `build`, and Playwright e2e (`74` passed).
- `node scripts/check-feature-memory.mjs --worktree` after strict crop/extraction dimension repair: passed; feature-memory gate passed via `specs/031-manual-document-completion/{spec,plan,tasks}.md`.
- `git diff --check` after strict crop/extraction dimension repair: passed.
- Repair verification, `2026-06-03T06:22:15Z`: addressed Codex bot P1 comment `3346333846` and P2 comment `3346315639` for strict source-as-is crop/asset byte provenance and documented broad cleanup forbidden terms in `scripts/manual-guide-source-fidelity.mjs`, `content/validation/manual-guide-source-fidelity.evidence.json`, and `tests/content-manual-guide-chapters.test.mjs`.
- `node scripts/manual-guide-source-fidelity.mjs` after source-as-is provenance/broad-term repair: passed; output reported `status: pass`, `sectionsChecked: 10`, `pendingSections: 4`, `implementedSections: 6`, and `strictVisualRulePolicy: 031-strict-source-fidelity`.
- `node --test tests/content-manual-guide-chapters.test.mjs` after source-as-is provenance/broad-term repair: passed; `61` tests passed, `0` failed. Added regression coverage for same-dimension source-as-is runtime asset bytes differing from the referenced source crop failing, and for `square patch`, `color_matched_plate`, `Opaque Rectangle`, and `broad box` strict metadata failing under separator/case-insensitive forbidden-term matching.
- `pnpm run validate:content` after source-as-is provenance/broad-term repair: passed; validated difficulty labels, learning images, complete 4-wheel manual manifests/assets/translations, 460 category B fallback questions, and the manual guide checker with `strictVisualRulePolicy: 031-strict-source-fidelity`.
- `pnpm run test` after source-as-is provenance/broad-term repair: passed; `370` tests passed, `0` failed.
- `pnpm run build` after source-as-is provenance/broad-term repair: passed; production build, asset sync, and service-worker generation completed. Non-fatal Vite large chunk warning remained.
- `pnpm run preflight` after source-as-is provenance/broad-term repair: passed, including `check-feature-memory`, `check:repo`, `validate:content`, `test` (`370` passed), `build`, and Playwright e2e (`74` passed).
- Repair verification, `2026-06-03T06:46:07Z`: addressed Codex bot P2 comment `3346422482` for strict transferred infographic/diagram source-crop linkage in `scripts/manual-guide-source-fidelity.mjs`, `content/validation/manual-guide-source-fidelity.evidence.json`, and `tests/content-manual-guide-chapters.test.mjs`.
- `node scripts/manual-guide-source-fidelity.mjs` after transferred-artwork source-linkage repair: passed; output reported `status: pass`, `sectionsChecked: 10`, `pendingSections: 4`, `implementedSections: 6`, and `strictVisualRulePolicy: 031-strict-source-fidelity`.
- `node --test tests/content-manual-guide-chapters.test.mjs` after transferred-artwork source-linkage repair: passed; `64` tests passed, `0` failed. Added regression coverage for strict transferred infographic and diagram source-linkage passing, missing transfer source-linkage failing for both categories, and self-certified/generated transferred artwork failing when it points only to its own runtime asset instead of a source crop.
- `pnpm run validate:content` after transferred-artwork source-linkage repair: passed; validated difficulty labels, learning images, complete 4-wheel manual manifests/assets/translations, 460 category B fallback questions, and the manual guide checker with `strictVisualRulePolicy: 031-strict-source-fidelity`.
- `pnpm run test` after transferred-artwork source-linkage repair: passed; `373` tests passed, `0` failed.
- `pnpm run build` after transferred-artwork source-linkage repair: passed; production build, asset sync, and service-worker generation completed. Non-fatal Vite large chunk warning remained.
- `pnpm run preflight` after transferred-artwork source-linkage repair: passed, including `check-feature-memory`, `check:repo`, `validate:content`, `test` (`373` passed), `build`, and Playwright e2e (`74` passed).

## Implementation Agent Feedback

- No unresolved Implementation Agent feedback. Architect disposition: disposed; no action needed for PR #185 at `ae5db4936c77f759e337c07e84c95924eee0db74`.
- No unresolved Implementation Agent feedback for the Introduction/Chapter 1 visual audit slice. Audit found no correction scope that requires Architect disposition.

## Introduction And Chapter 1 Visual Audit Evidence

- Assignment evidence: Implementation Agent audit-only slice, worktree `/Users/chap/devel/cabadrive-worktrees/031-intro-ch1-visual-audit`, branch `codex/031-intro-ch1-visual-audit`, base `origin/main` at `3b7fb9f2930dc5986cf54175556e9b9ab9ab4b5c`, PR pending until opened.
- PR evidence: ready PR #186 opened at https://github.com/cucumberfalse/cabadrive/pull/186 from branch `codex/031-intro-ch1-visual-audit` to `main` after audit evidence commit `7058d2760e0aff32035c15e75a18e0f4dd7defda`; this follow-up process-memory update records the PR URL.
- Baseline status: `git status --short --branch` returned `## codex/031-intro-ch1-visual-audit...origin/main`; no dirty files before audit evidence edits.
- Source inputs inspected: `content/manuals/gcba-manual-vehiculo-4-ruedas-2023/navigation.ru.json`, `manual.ru.json`, `layout.ru.json`, `interactive-guide/section-registry.chapters-1-2.json`, local source page renders under `content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/pages/`, `src/data/pandemiaVialSection.ts`, `src/data/manualGuide.ts`, `src/data/manual-sections/*.ts`, and `docs_project/project/frontend/manual-conversion-guidelines.md`.
- Introduction audit scope: pages `14-20`, covering route fixtures `#pandemia-vial`, `#intro-enfoque-etico`, `#intro-accidente-incidente`, and `#intro-plan-seguridad-vial`; named fixture pages `15`, `17`, `18`, and `19` were checked against durable guideline anchors.
- Introduction audit outcome: no correction needed. Existing focused evidence records page 15 as a native Russian article shell with fixed source-faithful infographic artwork and original crops; page 17 risk-factor pictograms are high-DPI padded source crops and the decorative recommendation icon is omitted; page 18 uses the complete 3720x1560 high-DPI cleaned source crop with transparent DOM Russian labels and no broad masks/plates/patches; page 19 uses high-DPI padded source pictogram crops with aligned/selectable Russian DOM text; the page 20 child-seat photo uses a source crop with Russian quote/explanation outside the image.
- Chapter 1 audit scope: pages `21-42`, including all six merged sections `ch1-cities-for-people`, `ch1-sustainable-mobility`, `ch1-pedestrian-priority`, `ch1-bicycle`, `ch1-public-transport-system`, and `ch1-shared-trip`.
- Chapter 1 audit outcome: no correction needed. Read-only metadata review checked 34 source-region artifacts and 38 runtime image assets for Chapter 1 with no missing files, hash mismatches, or dimension mismatches. The 15 visible-Spanish runtime cases are all recorded as source-image or official-sign source-as-is exceptions with Russian explanation outside protected images.
- Protected visual audit result: no translated, relabeled, redrawn, recolored, cleaned, reconstructed, retouched, masked, inpainted, or meaningfully-content-removed photo, traffic-sign, or road-marking runtime asset was found in the audited Introduction/Chapter 1 evidence.
- Infographic/diagram audit result: no correction needed. Audited infographics/diagrams use source crops, high-DPI source artwork, or source-derived non-text crops with selectable Russian DOM/SVG labels; focused tests reject generic replacements, broad masks, old partial page 18 reconstructions, source-mask overlays, full-page rasters, and visible Spanish outside explicit source-as-is exceptions.
- Audit read-only asset verification: a Node metadata audit reported Chapter 1 implemented sections `ch1-cities-for-people`, `ch1-sustainable-mobility`, `ch1-pedestrian-priority`, `ch1-bicycle`, `ch1-public-transport-system`, and `ch1-shared-trip`; `sourceRegionArtifactsChecked: 34`; `runtimeImageAssetsChecked: 38`; `visibleSpanishSourceImageExceptions: 15`; `mismatches: []`. The same audit reported `localImageAssetsChecked: 17` for Introduction and high-DPI fixture assets including three page 17 risk icons at `512x512`, the page 18 consequence diagram at `3720x1560`, and four page 19 axis icons at `192x192`, with `mismatches: []`.
- Focused verification, `node scripts/manual-guide-source-fidelity.mjs`: passed; output reported `status: pass`, `sectionsChecked: 10`, `pendingSections: 4`, `implementedSections: 6`, skipped divider pages `21` and `43`, omitted book-only page `56`, and `strictVisualRulePolicy: 031-strict-source-fidelity`.
- Focused verification, `node --test tests/content-manual-guide-chapters.test.mjs`: passed; `64` tests passed, `0` failed. Coverage includes all six Chapter 1 sections, source-fidelity checker pass, unchanged legacy baseline allowance, strict future-unit requirements, source-as-is exceptions, transferred artwork source linkage, forbidden visual-edit terms, and forbidden full-page assets.
- Focused verification, `node --test tests/content-pandemia-vial-section.test.mjs`: passed; `14` tests passed, `0` failed. Coverage includes Introduction routes, pages 15/17/18/19 named fixture guards, local cleaned visual assets, source-fidelity data rejecting generic replacements, no full-page raster/source mask, no runtime PDF/PDF.js/iframe/object/embed, selectable/adaptive Russian DOM text, and responsive page 19 work-axis behavior.
- `pnpm install --frozen-lockfile`: passed after the first content-validation attempt reported missing `node_modules`; lockfile was up to date and 77 packages were installed into this assigned worktree.
- `pnpm run validate:content`: first attempt failed due missing worktree dependencies (`pdf-parse` not installed); rerun after `pnpm install --frozen-lockfile` passed, including difficulty labels, learning images, 200/200 manual pages, 460 category B fallback questions, 276 local image references, and manual-guide checker `strictVisualRulePolicy: 031-strict-source-fidelity`.
- `pnpm run test`: passed; `373` tests passed, `0` failed.
- `pnpm run build`: passed; content validation, asset sync, Vite production build, and service-worker generation completed. The existing non-fatal Vite large chunk warning remained.
- `pnpm run preflight`: passed; included `check-feature-memory`, `check:repo`, `validate:content`, `test` (`373` passed), `build`, and Playwright e2e (`74` passed).
- Docker local runtime validation: not applicable for this audit-only PR because only process-memory audit evidence changed; no runtime behavior, source assets, Docker files, or build/runtime contract files changed. CI docker-validation remains a later PR gate.

## Final Architect Validation - PR #185 Visual-Rule Prerequisite

Architect validation pass: passed

Final Architect validation completed at: 2026-06-03T03:19:05Z

Architect validated effective content head: 36316f3781b9b04f305725018522b0f55407f900

Architect return count for this prerequisite validation: 0

Validation scope: PR #185 visual-rule prerequisite only. This validation covers durable manual conversion guideline updates, manual-guide source-fidelity checker/evidence updates, focused tests, and feature process memory. It does not validate any Chapter 2+ content implementation, Introduction/Chapter 1 audit or correction implementation, front-matter implementation, or full manual completion.

Cycle PR-set coverage: PR #185 is recorded in the cycle PR set as the visual-rule prerequisite row with branch `codex/031-manual-document-completion`, PR URL `https://github.com/cucumberfalse/cabadrive/pull/185`, base `b07d5c72bf1689e7dac480e937c366a528d20299`, and effective content head `36316f3781b9b04f305725018522b0f55407f900`. The later audit, correction, chapter, appendix, and front-matter rows remain pending by design and are outside this prerequisite validation pass.

Architect validation evidence: local `HEAD` matched `36316f3781b9b04f305725018522b0f55407f900` on branch `codex/031-manual-document-completion`; the working tree was clean before this Architect-owned validation note; the PR diff from base is scoped to `docs_project/project/frontend/manual-conversion-guidelines.md`, `content/validation/manual-guide-source-fidelity.evidence.json`, `scripts/manual-guide-source-fidelity.mjs`, `tests/content-manual-guide-chapters.test.mjs`, and `specs/031-manual-document-completion/` feature memory.

Architect validation evidence: PR #185 satisfies the planned prerequisite acceptance. The durable guidelines now record x5/equivalent high-resolution export evidence, protected source-as-is handling for photos/traffic signs/road markings, transferred-source infographic/diagram requirements, glyph/letter-level Spanish cleanup, no broad masks/plates/patches, and selectable Russian overlay guidance where feasible. The checker/evidence policy records `031-strict-source-fidelity`, strict future-unit asset categories, byte-verified hashes for strict images/crops, no-upscale/runtime-size requirements, source-as-is integrity fields, infographic/diagram transfer proof, forbidden visual-edit term scanning, and a fingerprint-locked legacy allowance only for unchanged merged Chapter 1 baseline sections until the planned audit/correction slice.

Architect validation evidence: GitHub PR state for current head `36316f3781b9b04f305725018522b0f55407f900` reported required checks green: `baseline-checks`, `docker-validation`, `guard`, `AI Review`, and `osv-scan`. Review Agent recorded no actionable findings for the same current head, and prior review findings were addressed in the current head.

Architect disposition: no unresolved Implementation Agent feedback remains for PR #185. Docker runtime smoke was not run locally for this prerequisite slice because no runtime app behavior, manual route content, source assets, Docker files, or build/runtime contract files changed; GitHub `docker-validation` is green for the validated head and local/process evidence records passing `pnpm run preflight`.

Remaining work after this prerequisite validation: Introduction/Chapter 1 visual-rule audit, any scoped corrections from that audit, Chapter 2, Chapters 3-5, Appendices I-IV, front matter, final full-cycle Architect validation, and final Analyst validation remain pending in the cycle.

## Final Architect Validation Rerun - PR #185 Repaired Visual-Rule Prerequisite

Superseded validation notice: the prior final Architect validation for `36316f3781b9b04f305725018522b0f55407f900` and the prior final Analyst validation for the same head are stale because later non-evidence checker/test/evidence repairs changed strict visible-Spanish source-as-is validation behavior. The current effective content head for this prerequisite slice is `c0b08aa2b23fefdb4eef1425035e94d5d6f8236c`.

Architect validation pass: passed

Final Architect validation completed at: 2026-06-03T03:58:12Z

Architect validated effective content head: c0b08aa2b23fefdb4eef1425035e94d5d6f8236c

Architect return count for this prerequisite validation rerun: 0

Validation scope: PR #185 visual-rule prerequisite only. This rerun covers durable manual conversion guideline updates, manual-guide source-fidelity checker/evidence updates, focused tests, process memory, and the post-validation visible-Spanish strict exception repairs. It does not validate any Chapter 2+ content implementation, Introduction/Chapter 1 audit or correction implementation, front-matter implementation, or full manual completion.

Cycle PR-set coverage: PR #185 is recorded in the cycle PR set as the visual-rule prerequisite row with branch `codex/031-manual-document-completion`, PR URL `https://github.com/cucumberfalse/cabadrive/pull/185`, base `b07d5c72bf1689e7dac480e937c366a528d20299`, and repaired effective content head `c0b08aa2b23fefdb4eef1425035e94d5d6f8236c`. The later audit, correction, chapter, appendix, and front-matter rows remain pending by design and are outside this prerequisite validation pass.

Architect validation evidence: local `HEAD` matched `c0b08aa2b23fefdb4eef1425035e94d5d6f8236c` on branch `codex/031-manual-document-completion`; the working tree was clean before this Architect-owned validation note; the PR diff from base remains scoped to `docs_project/project/frontend/manual-conversion-guidelines.md`, `content/validation/manual-guide-source-fidelity.evidence.json`, `scripts/manual-guide-source-fidelity.mjs`, `tests/content-manual-guide-chapters.test.mjs`, and `specs/031-manual-document-completion/` feature memory, with no chapter content implementation, no runtime manual page implementation, no Introduction/Chapter 1 audit implementation, and no unrelated assets.

Architect validation evidence: the repaired head preserves the prerequisite intent and closes the post-validation repair gaps. Strict protected source-as-is assets with visible Spanish now require matching visible-Spanish exception evidence; exception-bearing status must not be hidden behind `status: "none"`; mixed source-image and official traffic-sign visible-Spanish exceptions are allowed only through kind-filtered matching paths. The strict visual-rule policy still covers x5/equivalent export evidence, source-as-is photo/sign/marking handling, infographic/diagram source transfer, glyph/letter-level cleanup, byte-verified hashes, no-upscale/runtime-size evidence, forbidden visual-edit term scanning, and fingerprint-locked legacy allowance only for unchanged merged Chapter 1 baseline sections until the planned audit/correction slice.

Architect validation evidence: Implementation Agent recorded full local verification for `c0b08aa2b23fefdb4eef1425035e94d5d6f8236c`: `node scripts/manual-guide-source-fidelity.mjs` passed; focused `node --test tests/content-manual-guide-chapters.test.mjs` passed with `51` tests; `pnpm run validate:content` passed; `pnpm run test` passed with `360` tests; `pnpm run build` passed; `pnpm run preflight` passed including `74` Playwright tests; feature-memory check and diff check passed.

Architect validation evidence: Review Agent posted no actionable findings for `c0b08aa2b23fefdb4eef1425035e94d5d6f8236c` (review id `4415281531`). GitHub PR state for current head `c0b08aa2b23fefdb4eef1425035e94d5d6f8236c` reported non-AI required checks green: `baseline-checks`, `docker-validation`, `guard`, and `osv-scan`. The current AI Review blocker is process-only and asks for final Architect/Analyst validation to be rerun for this repaired head; this Architect validation rerun addresses the Architect half of that process gap.

Architect disposition: no unresolved Implementation Agent feedback remains for PR #185 at `c0b08aa2b23fefdb4eef1425035e94d5d6f8236c`. PR #185 is ready for Analyst final validation once this Architect validation evidence is transported. AI Review should be re-evaluated after Analyst final validation records the same repaired effective content head.

Remaining work after this prerequisite validation rerun: final Analyst validation for PR #185 prerequisite scope, then Orchestrator current-head/readiness guards. The broader feature remains pending for Introduction/Chapter 1 visual-rule audit, any scoped corrections from that audit, Chapter 2, Chapters 3-5, Appendices I-IV, front matter, final full-cycle Architect validation, and final Analyst validation.

## Final Architect Validation Rerun - PR #185 Latest Visible-Spanish Repairs

Superseded validation notice: the prior final Architect and Analyst validations for `36316f3781b9b04f305725018522b0f55407f900` and `c0b08aa2b23fefdb4eef1425035e94d5d6f8236c` are stale because later non-evidence checker/test/evidence repairs changed strict visible-Spanish validation behavior. The current effective content head for this prerequisite slice is `bcc377a154c936374715f6ca4ce2d5714af4a722`.

Architect validation pass: passed

Final Architect validation completed at: 2026-06-03T04:26:07Z

Architect validated effective content head: bcc377a154c936374715f6ca4ce2d5714af4a722

Architect return count for this prerequisite validation rerun: 0

Validation scope: PR #185 visual-rule prerequisite only. This latest rerun covers durable manual conversion guideline updates, manual-guide source-fidelity checker/evidence updates, focused tests, process memory, and the post-validation strict visible-Spanish repairs through `bcc377a154c936374715f6ca4ce2d5714af4a722`. It does not validate any Chapter 2+ content implementation, Introduction/Chapter 1 audit or correction implementation, front-matter implementation, or full manual completion.

Cycle PR-set coverage: PR #185 is recorded in the cycle PR set as the visual-rule prerequisite row with branch `codex/031-manual-document-completion`, PR URL `https://github.com/cucumberfalse/cabadrive/pull/185`, base `b07d5c72bf1689e7dac480e937c366a528d20299`, and latest repaired effective content head `bcc377a154c936374715f6ca4ce2d5714af4a722`. The later audit, correction, chapter, appendix, and front-matter rows remain pending by design and are outside this prerequisite validation pass.

Architect validation evidence: local `HEAD` matched `bcc377a154c936374715f6ca4ce2d5714af4a722` on branch `codex/031-manual-document-completion`; the working tree was clean before this Architect-owned validation note; the PR diff from base remains scoped to `docs_project/project/frontend/manual-conversion-guidelines.md`, `content/validation/manual-guide-source-fidelity.evidence.json`, `scripts/manual-guide-source-fidelity.mjs`, `tests/content-manual-guide-chapters.test.mjs`, and `specs/031-manual-document-completion/` feature memory, with no chapter content implementation, no runtime manual page implementation, no Introduction/Chapter 1 audit implementation, and no unrelated assets.

Architect validation evidence: the latest repaired head preserves the prerequisite intent and closes the latest strict visible-Spanish policy holes. Strict `source-transferred-infographic` and `source-transferred-diagram` assets now require `visibleSpanish: false`; strict visible-Spanish `sourceImageException` allowance is limited to protected source-as-is photo, traffic-sign, and road-marking categories through strict source-integrity and matching exception/status evidence; legacy `officialSignException` and `sourceImageException` allowances remain limited to non-strict legacy evidence. The strict visual-rule policy still covers x5/equivalent export evidence, source-as-is photo/sign/marking handling, infographic/diagram source transfer, glyph/letter-level cleanup, byte-verified hashes, no-upscale/runtime-size evidence, forbidden visual-edit term scanning, and fingerprint-locked legacy allowance only for unchanged merged Chapter 1 baseline sections until the planned audit/correction slice.

Architect validation evidence: Implementation Agent recorded full local verification for `bcc377a154c936374715f6ca4ce2d5714af4a722`: `node scripts/manual-guide-source-fidelity.mjs` passed; focused `node --test tests/content-manual-guide-chapters.test.mjs` passed with `54` tests; `pnpm run validate:content` passed; `pnpm run test` passed with `363` tests; `pnpm run build` passed; `pnpm run preflight` passed including `74` Playwright tests; feature-memory check and diff check passed.

Architect validation evidence: Review Agent posted no actionable findings for `bcc377a154c936374715f6ca4ce2d5714af4a722` (review id `4415418564`). GitHub PR state for current head `bcc377a154c936374715f6ca4ce2d5714af4a722` reported all required checks green: `baseline-checks`, `docker-validation`, `guard`, `AI Review`, and `osv-scan`.

Architect disposition: no unresolved Implementation Agent feedback remains for PR #185 at `bcc377a154c936374715f6ca4ce2d5714af4a722`. PR #185 is ready for Analyst final validation once this Architect validation evidence is transported.

Remaining work after this prerequisite validation rerun: final Analyst validation for PR #185 prerequisite scope, then Orchestrator current-head/readiness guards. The broader feature remains pending for Introduction/Chapter 1 visual-rule audit, any scoped corrections from that audit, Chapter 2, Chapters 3-5, Appendices I-IV, front matter, final full-cycle Architect validation, and final Analyst validation.

## Final Architect Validation Rerun - PR #185 Strict Image Dimension Repair

Superseded validation notice: the prior final Architect and Analyst validations for `36316f3781b9b04f305725018522b0f55407f900`, `c0b08aa2b23fefdb4eef1425035e94d5d6f8236c`, and `bcc377a154c936374715f6ca4ce2d5714af4a722` are stale because later non-evidence checker/test/evidence-policy repairs changed strict image dimension validation behavior. The current effective content head for this prerequisite slice is `ae5db4936c77f759e337c07e84c95924eee0db74`.

Architect validation pass: passed

Final Architect validation completed at: 2026-06-03T04:51:01Z

Architect validated effective content head: ae5db4936c77f759e337c07e84c95924eee0db74

Architect return count for this prerequisite validation rerun: 0

Validation scope: PR #185 visual-rule prerequisite only. This latest rerun covers durable manual conversion guideline updates, manual-guide source-fidelity checker/evidence updates, focused tests, process memory, and the post-validation strict image byte-dimension repair through `ae5db4936c77f759e337c07e84c95924eee0db74`. It does not validate any Chapter 2+ content implementation, Introduction/Chapter 1 audit or correction implementation, front-matter implementation, or full manual completion.

Cycle PR-set coverage: PR #185 is recorded in the cycle PR set as the visual-rule prerequisite row with branch `codex/031-manual-document-completion`, PR URL `https://github.com/cucumberfalse/cabadrive/pull/185`, base `b07d5c72bf1689e7dac480e937c366a528d20299`, and latest repaired effective content head `ae5db4936c77f759e337c07e84c95924eee0db74`. The later audit, correction, chapter, appendix, and front-matter rows remain pending by design and are outside this prerequisite validation pass.

Architect validation evidence: local `HEAD` matched `ae5db4936c77f759e337c07e84c95924eee0db74` on branch `codex/031-manual-document-completion`; the working tree was clean before this Architect-owned validation note; the PR diff from base remains scoped to `docs_project/project/frontend/manual-conversion-guidelines.md`, `content/validation/manual-guide-source-fidelity.evidence.json`, `scripts/manual-guide-source-fidelity.mjs`, `tests/content-manual-guide-chapters.test.mjs`, and `specs/031-manual-document-completion/` feature memory, with no chapter content implementation, no runtime manual page implementation, no Introduction/Chapter 1 audit implementation, and no unrelated assets.

Architect validation evidence: the latest repaired head preserves the prerequisite intent and closes the strict actual image-dimension gap. Strict image-category assets now validate hashes against referenced bytes, derive actual PNG/GIF/JPEG dimensions from `assetPath` bytes, require `localAssetMetadata.width` / `height` to match actual parsed dimensions, reject unsupported or non-image bytes for strict image categories, and use actual dimensions for runtime no-upscale checks. Strict non-image categories remain exempt from image byte dimension parsing. The strict visual-rule policy still covers x5/equivalent export evidence, source-as-is photo/sign/marking handling, infographic/diagram source transfer, glyph/letter-level cleanup, byte-verified source crops/runtime assets, forbidden visual-edit term scanning, visible-Spanish exception gating for protected source-as-is categories only, transferred infographic/diagram visible-Spanish rejection, and fingerprint-locked legacy allowance only for unchanged merged Chapter 1 baseline sections until the planned audit/correction slice.

Architect validation evidence: Implementation Agent recorded full local verification for `ae5db4936c77f759e337c07e84c95924eee0db74`: `node scripts/manual-guide-source-fidelity.mjs` passed; focused `node --test tests/content-manual-guide-chapters.test.mjs` passed with `56` tests; `pnpm run validate:content` passed; `pnpm run test` passed with `365` tests; `pnpm run build` passed; `pnpm run preflight` passed including `74` Playwright tests; feature-memory check and diff check passed.

Architect validation evidence: Review Agent posted no actionable findings for `ae5db4936c77f759e337c07e84c95924eee0db74` (review id `4415505227`). GitHub PR state for current head `ae5db4936c77f759e337c07e84c95924eee0db74` reported all required checks green: `baseline-checks`, `docker-validation`, `guard`, `AI Review`, and `osv-scan`.

Architect disposition: no unresolved Implementation Agent feedback remains for PR #185 at `ae5db4936c77f759e337c07e84c95924eee0db74`. PR #185 is ready for Analyst final validation once this Architect validation evidence is transported.

Remaining work after this prerequisite validation rerun: final Analyst validation for PR #185 prerequisite scope, then Orchestrator current-head/readiness guards. The broader feature remains pending for Introduction/Chapter 1 visual-rule audit, any scoped corrections from that audit, Chapter 2, Chapters 3-5, Appendices I-IV, front matter, final full-cycle Architect validation, and final Analyst validation.

## Final Architect Validation Rerun - PR #185 Strict Crop Extraction Dimension Repair

Architect validation pass: passed

Final Architect validation completed at: 2026-06-03T06:06:15Z

Architect validated effective content head: 1a45d342637feae88f2c102cbb9cf815079eaefb

Architect return count for this work cycle: 0

Open Architect dispositions: none for PR #185 prerequisite scope at 1a45d342637feae88f2c102cbb9cf815079eaefb.

Architect validation evidence: PR #185 remains prerequisite-only visual-rule work covering docs/checker/evidence/tests/process memory; no chapter content, runtime manual pages, source assets, Introduction/Chapter 1 audit implementation, or unrelated product implementation are bundled.

Architect validation evidence: Prior final validations for earlier effective content heads are stale because non-evidence checker/test/evidence-policy repairs followed; this validation covers the current PR head and effective content head 1a45d342637feae88f2c102cbb9cf815079eaefb, including the 30e123420e97438a419e7eeccaa90f4e37f70d1c strict crop/extraction dimension repair and the 1a45d342637feae88f2c102cbb9cf815079eaefb process-memory wording fix.

Architect validation evidence: The strict crop/extraction repair satisfies the visual-source-fidelity intent by requiring strict source crop artifacts to decode as supported PNG/GIF/JPEG images, tying cropDimensions to decoded crop bytes, tying extractionScaleEvidence.outputDimensions to decoded artifact dimensions for strict source crops and strict runtime image assets, and preserving strict non-image category behavior.

Architect validation evidence: The repaired prerequisite still enforces x5/equivalent high-resolution export evidence, source-as-is protected handling for photos, traffic signs, and road markings, transferred-source infographic/diagram requirements, glyph/letter-level Spanish cleanup only, no broad masks/plates/patches, selectable Russian overlay guidance where feasible, byte-verified asset/crop hashes, no-upscale/runtime-size evidence, forbidden visual-edit term scanning, protected visible-Spanish exception gating, and fingerprint-locked legacy allowance only for unchanged merged Chapter 1 baseline sections until the planned audit/correction slice.

Architect validation evidence: Implementation Agent recorded local verification for 30e123420e97438a419e7eeccaa90f4e37f70d1c: manual-guide checker passed, focused node test passed with 60 tests, validate:content passed, pnpm test passed with 369 tests, build passed with the known nonfatal Vite large chunk warning, preflight passed including 74 Playwright tests, check-feature-memory passed, and git diff --check passed.

Architect validation evidence: Implementation Agent recorded local verification for 1a45d342637feae88f2c102cbb9cf815079eaefb: check-feature-memory passed and git diff --check passed after the process-memory wording fix.

Architect validation evidence: Review Agent posted no actionable findings for current head 1a45d342637feae88f2c102cbb9cf815079eaefb, review id 4415885493; earlier Review Agent findings for the strict crop/extraction repair and Cycle PR Set wording were addressed.

Architect validation evidence: GitHub PR state observed current head 1a45d342637feae88f2c102cbb9cf815079eaefb, mergeable, with baseline-checks, docker-validation, guard, and osv-scan green; AI Review was in the process-revalidation lane, and this Architect validation records the role-owned evidence needed for that process gap.

Architect validation evidence: Cycle PR-set coverage for PR #185 is current for this prerequisite validation: branch codex/031-manual-document-completion, PR #185, base b07d5c72bf1689e7dac480e937c366a528d20299, effective content head 1a45d342637feae88f2c102cbb9cf815079eaefb, with later audit/correction/chapter/appendix/front-matter rows still pending by design and outside this prerequisite validation pass.

Architect gaps: none.

Architect disposition: no unresolved Implementation Agent feedback remains for PR #185 at 1a45d342637feae88f2c102cbb9cf815079eaefb.

Architect disposition: PR #185 is ready for Analyst final validation once this Architect validation evidence is transported, with Orchestrator current-head/readiness guards still outside the Architect role.

## Final Architect Validation Rerun - PR #185 Source-As-Is Provenance And Broad Cleanup Repair

Architect validation pass: passed

Final Architect validation completed at: 2026-06-03T06:31:34Z

Architect validated effective content head: bc71004c284984f682745ce0337bf2e154fef143

Architect return count for this work cycle: 0

Open Architect dispositions: none for PR #185 prerequisite scope at bc71004c284984f682745ce0337bf2e154fef143.

Architect validation evidence: PR #185 remains prerequisite-only visual-rule work covering docs/checker/evidence/tests/process memory; no chapter content implementation, runtime manual pages, source assets, Introduction/Chapter 1 audit implementation, or unrelated product implementation are bundled.

Architect validation evidence: Prior final validations for earlier effective content heads are stale because non-evidence checker/test/evidence-policy repairs followed; this validation covers the current PR head and effective content head bc71004c284984f682745ce0337bf2e154fef143, including the source-as-is provenance repair and broad cleanup forbidden-term repair.

Architect validation evidence: The source-as-is provenance repair satisfies the visual-source-fidelity intent by requiring strict source-as-is-photo, source-as-is-traffic-sign, and source-as-is-road-marking runtime assets to reference strict sourceRegionMetadata through sourceIntegrity.sourceAssetPath, with local runtime asset SHA-256 and decoded dimensions matching the referenced source crop bytes and dimensions.

Architect validation evidence: The broad cleanup repair satisfies the infographic/diagram cleanup constraint by rejecting square patch, color-matched plate, opaque rectangle, broad box, and separator/case variants under strict forbidden-term scanning, alongside the existing broad mask, broad patch, broad plate, redraw, reconstruction, and generic replacement protections.

Architect validation evidence: The repaired prerequisite still enforces x5/equivalent high-resolution export evidence, unmodified source-as-is protected handling for photos, traffic signs, and road markings, transferred-source infographic/diagram requirements, glyph/letter-level Spanish cleanup only, selectable Russian overlay guidance where feasible, byte-verified asset/crop hashes, crop/extraction decoded dimensions, no-upscale/runtime-size evidence, protected visible-Spanish exception gating, and fingerprint-locked legacy allowance only for unchanged merged Chapter 1 baseline sections until the planned audit/correction slice.

Architect validation evidence: Implementation Agent recorded local verification for bc71004c284984f682745ce0337bf2e154fef143: manual-guide checker passed, focused node test passed with 61 tests, validate:content passed, pnpm test passed with 370 tests, build passed with the known nonfatal Vite large chunk warning, preflight passed including 74 Playwright tests, check-feature-memory passed, and git diff --check passed.

Architect validation evidence: Review Agent posted no actionable findings for current head bc71004c284984f682745ce0337bf2e154fef143, review id 4416063852; earlier Codex bot findings 3346333846 and 3346315639 were addressed.

Architect validation evidence: GitHub PR state observed current head bc71004c284984f682745ce0337bf2e154fef143, mergeable, with required checks green: baseline-checks, docker-validation, guard, AI Review, and osv-scan.

Architect validation evidence: Cycle PR-set coverage for PR #185 is current for this prerequisite validation: branch codex/031-manual-document-completion, PR #185, base b07d5c72bf1689e7dac480e937c366a528d20299, effective content head bc71004c284984f682745ce0337bf2e154fef143, with later audit/correction/chapter/appendix/front-matter rows still pending by design and outside this prerequisite validation pass.

Architect gaps: none.

Architect disposition: no unresolved Implementation Agent feedback remains for PR #185 at bc71004c284984f682745ce0337bf2e154fef143.

Architect disposition: PR #185 is ready for Analyst final validation once this Architect validation evidence is transported, with Orchestrator current-head/readiness guards still outside the Architect role.

## Final Architect Validation Notes

Architect validation pass: passed

Final Architect validation completed at: 2026-06-03T06:55:33Z

Architect validated effective content head: 8d1b217b79e322a03f29b2ebda1e83c3a0ac7a82

Architect return count for this work cycle: 0

Open Architect dispositions: none for PR #185 prerequisite scope at 8d1b217b79e322a03f29b2ebda1e83c3a0ac7a82.

Architect validation evidence: PR #185 remains prerequisite-only visual-rule work covering docs/checker/evidence/tests/process memory; no chapter content implementation, runtime manual pages, source assets, Introduction/Chapter 1 audit implementation, or unrelated product implementation are bundled.

Architect validation evidence: Prior Architect and Analyst validations for older effective content heads are stale because non-evidence repairs landed after them; this validation supersedes them for effective content head 8d1b217b79e322a03f29b2ebda1e83c3a0ac7a82.

Architect validation evidence: The transferred artwork source-linkage repair addresses Codex bot P2 comment 3346422482 by requiring strict source-transferred-infographic and source-transferred-diagram transfer metadata to reference existing strict sourceRegionMetadata through sourceAssetPath, with sourceCropSha256 and sourceCropDimensions matching the recorded source crop hash and decoded dimensions.

Architect validation evidence: The repair preserves the intended distinction that transferred runtime artwork may differ from the source crop for glyph-level Spanish cleanup and Russian overlay, while preventing source-transfer booleans or generated runtime artwork from passing without source-crop provenance.

Architect validation evidence: The repaired prerequisite still enforces x5/equivalent high-resolution export evidence, unmodified source-as-is protected handling for photos, traffic signs, and road markings, transferred-source infographic/diagram requirements, glyph/letter-level Spanish cleanup only, selectable Russian overlay guidance where feasible, byte-verified asset/crop hashes, crop/extraction decoded dimensions, no-upscale/runtime-size evidence, protected visible-Spanish exception gating, and fingerprint-locked legacy allowance only for unchanged merged Chapter 1 baseline sections until the planned audit/correction slice.

Architect validation evidence: Implementation Agent recorded local verification for 8d1b217b79e322a03f29b2ebda1e83c3a0ac7a82: manual-guide checker passed, focused node test passed with 64 tests, validate:content passed, pnpm test passed with 373 tests, build passed with the known nonfatal Vite large chunk warning, preflight passed including 74 Playwright tests, check-feature-memory passed, and git diff --check passed.

Architect validation evidence: Review Agent posted no actionable findings for current head 8d1b217b79e322a03f29b2ebda1e83c3a0ac7a82; AI Review passed at the same effective content head.

Architect validation evidence: GitHub PR state observed current head 8d1b217b79e322a03f29b2ebda1e83c3a0ac7a82, mergeable, with required checks green: baseline-checks, docker-validation after rerun for Docker Hub timeout, guard, osv-scan, and AI Review.

Architect validation evidence: Cycle PR-set coverage for PR #185 is current for this prerequisite validation: branch codex/031-manual-document-completion, PR #185, base b07d5c72bf1689e7dac480e937c366a528d20299, effective content head 8d1b217b79e322a03f29b2ebda1e83c3a0ac7a82, with later audit/correction/chapter/appendix/front-matter rows still pending by design and outside this prerequisite validation pass.

Architect gaps: none.

Architect disposition: no unresolved Implementation Agent feedback remains for PR #185 at 8d1b217b79e322a03f29b2ebda1e83c3a0ac7a82.

Architect disposition: PR #185 is ready for Analyst final validation once this Architect validation evidence is transported, with Orchestrator current-head/readiness guards still outside the Architect role.

## Final Architect Validation Notes

Architect validation pass: passed

Final Architect validation completed at: 2026-06-03T08:12:17Z

Architect validated effective content head: ed7c9fe9db2bbb8b31e7fa67e8166c88e53cfd57

Architect return count for this work cycle: 0

Open Architect dispositions: none for PR #186 audit-only scope at ed7c9fe9db2bbb8b31e7fa67e8166c88e53cfd57.

Architect validation evidence: PR #186 is an audit-only process-memory slice for Introduction pages 14-20 and Chapter 1 pages 21-42, and records a no-fix audit outcome with no correction PR needed from this audit.

Architect validation evidence: PR #186 scope remains limited to specs/031-manual-document-completion/tasks.md process memory; no Chapter 2+ content, runtime manual changes, assets, code, or docs outside feature memory are included.

Architect validation evidence: Audit completion is recorded in T022 through T025, while reusable per-chapter content checklist T049 through T063 remains reserved for future chapter-equivalent PR work.

Architect validation evidence: The audit validates the strict visual requirements for the already-merged Introduction and Chapter 1 baseline: x5 or equivalent high-resolution evidence, source-as-is no-modification handling for photos, traffic signs, and road markings, and source-image infographic/diagram transfer with glyph-level Spanish cleanup only and Russian overlay outside protected source imagery where applicable.

Architect validation evidence: Local process memory records Introduction pages 14-20 and Chapter 1 pages 21-42 audit coverage, including named Introduction fixtures pages 15, 17, 18, and 19, all six merged Chapter 1 sections, 34 Chapter 1 source-region artifacts, 38 Chapter 1 runtime image assets, 17 Introduction local image assets, no hash or dimension mismatches, and no stricter-rule gaps requiring correction.

Architect validation evidence: Verification evidence recorded for the audit includes manual-guide checker pass, focused node tests pass, validate:content pass, pnpm test pass, build pass with the known nonfatal Vite large chunk warning, preflight pass with 74 Playwright tests, check-feature-memory pass, and git diff --check pass.

Architect validation evidence: Required checks passed on ed7c9fe9db2bbb8b31e7fa67e8166c88e53cfd57: baseline-checks, docker-validation, guard, AI Review, and osv-scan.

Architect validation evidence: Review Agent posted no actionable findings for current head ed7c9fe9db2bbb8b31e7fa67e8166c88e53cfd57, review id 4416640043; AI Review latest bot summary reported no major issues.

Architect validation evidence: PR #186 is open, not draft, and mergeable by read-only GitHub state; old review-thread cleanup remains Orchestrator-owned and outside Architect validation.

Architect validation evidence: Cycle PR-set coverage for this validation includes merged PR #184 as baseline, merged PR #185 as strict visual-rule prerequisite, and PR #186 as the Introduction and Chapter 1 audit-only slice at base 3b7fb9f2930dc5986cf54175556e9b9ab9ab4b5c and effective content head ed7c9fe9db2bbb8b31e7fa67e8166c88e53cfd57.

Architect gaps: none.

Architect disposition: no unresolved Implementation Agent feedback remains for PR #186 audit-only scope at ed7c9fe9db2bbb8b31e7fa67e8166c88e53cfd57.

Architect disposition: no Analyst feedback requires Architect action for PR #186 audit-only scope.

## Review Requirements

- [ ] T064 Review Agent checks complete feature memory and role boundaries.
- [ ] T065 Review Agent verifies chapter-equivalent PR scope and no cross-chapter bundling.
- [ ] T066 Review Agent verifies latest-main startup evidence and sibling-work preservation.
- [ ] T067 Review Agent verifies visual-source-fidelity evidence under the stricter rules.
- [ ] T068 Review Agent verifies tests/checkers cover forbidden runtime patterns, source-as-is assets, infographic cleanup, responsive/selectable text, and detail retention.
- [ ] T069 Blocking review findings are fixed or receive Architect/Orchestrator disposition before final validation.

## Final Validation Tasks

- [ ] T070 Orchestrator confirms the complete cycle PR set, including merged baseline PR #184, all prerequisite/audit/correction/content/front-matter PRs, and their current/final heads.
- [ ] T071 Orchestrator verifies required checks are green for current PR heads: `baseline-checks`, `docker-validation`, `guard`, `AI Review`, and `osv-scan`.
- [ ] T072 Orchestrator verifies no unresolved blocking review findings, merge conflicts, stale process memory, missing evidence, or unresolved Implementation Agent feedback.
- [ ] T073 Architect performs final validation after implementation/review/checks appear complete and before Analyst final validation.
- [ ] T074 Architect records `Architect validation pass: passed`, `Final Architect validation completed at: <ISO 8601 timestamp>`, `Architect validated effective content head: <40-hex-sha>`, and return count if passing.
- [ ] T075 Analyst performs final validation only after Architect pass.
- [ ] T076 Analyst records `Analyst validation pass: passed`, `Final Analyst validation completed at: <ISO 8601 timestamp>`, `Analyst validated effective content head: <40-hex-sha>`, and return count if passing.
- [ ] T077 Orchestrator runs current-PR-head guard for any evidence-only commit after final validation.
- [ ] T078 Orchestrator records cleanup not-applicable or assigns Cleanup Agent if cleanup is needed.
- [ ] T079 Orchestrator completes merge/finalization only after every objective gate passes.

## Verification Evidence

- Architect planning evidence: local worktree branch is `codex/031-manual-document-completion`; `HEAD` is `b07d5c72bf1689e7dac480e937c366a528d20299`, matching the Orchestrator-provided verified base.
- Architect planning evidence: `git status --short --branch` before writing showed only untracked `specs/031-manual-document-completion/`, containing the Analyst artifact and pending Architect files.
- Architect read required project memory and prior feature `030` artifacts before writing.
- Architect inspected `navigation.ru.json` and confirmed the inventory in this feature memory: front matter `1-13`, Introduction `14-20`, Chapter 1 `21-42`, Chapter 2 `43-56`, Chapter 3 `57-88`, Chapter 4 `89-97`, Chapter 5 `98-103`, Appendix I `104-122`, Appendix II `123-151`, Appendix III `152-183`, and Appendix IV `184-200`.
- Architect inspected current `section-registry.chapters-1-2.json` and confirmed Chapter 1 implemented sections and pending Chapter 2 sections, including feature `030` page-55 Scoring boundary evidence.
- Architect updated only `spec.md`, `plan.md`, and `tasks.md`.
- Implementation Agent startup evidence: assignment confirmed strict Implementation Agent role, worktree `/Users/chap/devel/cabadrive-worktrees/031-manual-document-completion`, branch `codex/031-manual-document-completion`, base `origin/main` / `HEAD` `b07d5c72bf1689e7dac480e937c366a528d20299`, and parallel-work preservation warning. Initial status showed only untracked `specs/031-manual-document-completion/`.
- `pnpm install --frozen-lockfile`: passed; lockfile was up to date and 77 packages were installed into the assigned worktree.
- `node scripts/manual-guide-source-fidelity.mjs`: passed; output reported `status: pass`, `sectionsChecked: 10`, `pendingSections: 4`, `implementedSections: 6`, and `strictVisualRulePolicy: 031-strict-source-fidelity`.
- `node --test tests/content-manual-guide-chapters.test.mjs`: passed after focused fixture corrections; final run `32` tests passed, `0` failed. New tests cover strict full-manual schema vocabulary, future-unit missing strict metadata, no-upscale rejection, protected source-as-is edit rejection, infographic broad-patch rejection, and strict pass evidence.
- `pnpm run validate:content`: passed; validated difficulty labels, learning images, complete 4-wheel manual manifests/assets/translations, 460 category B fallback questions, and the manual guide checker with `strictVisualRulePolicy: 031-strict-source-fidelity`.
- `pnpm run test`: passed; `341` tests passed, `0` failed.
- `pnpm run build`: passed; production build, asset sync, and service-worker generation completed. Non-fatal Vite large chunk warning remained.
- `pnpm run preflight`: passed; included `node scripts/check-feature-memory.mjs --worktree`, `pnpm run check:repo`, `pnpm run validate:content`, `pnpm run test`, `pnpm run build`, and `pnpm run test:e2e`; Playwright e2e reported `74 passed`.
- `git diff --check`: passed before process-memory update.
- `node scripts/check-feature-memory.mjs --worktree`: passed after process-memory update; feature-memory gate passed via `specs/031-manual-document-completion/{spec,plan,tasks}.md`.
- PR evidence: ready PR #185 opened at https://github.com/cucumberfalse/cabadrive/pull/185 from branch `codex/031-manual-document-completion` to `main`; PR opened after effective content head `3769e53baaf6100cfb5667e265e07dd027fc2539` and this subsequent process-memory update records the PR row.
- Review fix verification, `2026-06-03T01:33:57Z`: fetched PR #185 inline review comments and addressed blocking P1 plus automated Codex P2 in `scripts/manual-guide-source-fidelity.mjs`, `content/validation/manual-guide-source-fidelity.evidence.json`, and `tests/content-manual-guide-chapters.test.mjs`.
- `node scripts/manual-guide-source-fidelity.mjs` after review fix: passed; output reported `status: pass`, `sectionsChecked: 10`, `pendingSections: 4`, `implementedSections: 6`, and `strictVisualRulePolicy: 031-strict-source-fidelity`.
- `node --test tests/content-manual-guide-chapters.test.mjs` after review fix: passed; `35` tests passed, `0` failed. Added regression coverage for legacy-registry Chapter 2 implemented-with-legacy-evidence failing, Chapter 2 strict v3 evidence passing, and strict non-image asset categories passing without image sizing metadata.
- `pnpm run validate:content` after review fix: passed; validated difficulty labels, learning images, complete 4-wheel manual manifests/assets/translations, 460 category B fallback questions, and the manual guide checker.
- `pnpm run test` after review fix: passed; `344` tests passed, `0` failed.
- `pnpm run build` after review fix: passed; production build, asset sync, and service-worker generation completed. Non-fatal Vite large chunk warning remained.
- `pnpm run preflight` after review fix: first attempt failed as expected because product paths changed before this feature-memory update; rerun after process-memory update passed, including `check-feature-memory`, `check:repo`, `validate:content`, `test` (`344` passed), `build`, and Playwright e2e (`74` passed).
- Review fix verification, `2026-06-03T01:50:45Z`: fetched PR #185 inline review comment `3345446412` and addressed current-head automated Codex P2 in `scripts/manual-guide-source-fidelity.mjs`, `content/validation/manual-guide-source-fidelity.evidence.json`, `docs_project/project/frontend/manual-conversion-guidelines.md`, and `tests/content-manual-guide-chapters.test.mjs`.
- `node scripts/manual-guide-source-fidelity.mjs` after diagram review fix: passed; output reported `status: pass`, `sectionsChecked: 10`, `pendingSections: 4`, `implementedSections: 6`, and `strictVisualRulePolicy: 031-strict-source-fidelity`.
- `node --test tests/content-manual-guide-chapters.test.mjs` after diagram review fix: passed after correcting the expected missing-object assertion; final run `36` tests passed, `0` failed. Added regression coverage for strict `source-transferred-diagram` missing `diagramTransfer` failing and valid strict Chapter 2 diagram transfer proof passing.
- `node scripts/check-feature-memory.mjs --worktree` after diagram review fix: passed; feature-memory gate passed via `specs/031-manual-document-completion/{spec,plan,tasks}.md`.
- `git diff --check` after diagram review fix: passed.
- `pnpm run validate:content` after diagram review fix: passed; validated difficulty labels, learning images, complete 4-wheel manual manifests/assets/translations, 460 category B fallback questions, and the manual guide checker.
- `pnpm run test` after diagram review fix: passed; `345` tests passed, `0` failed.
- `pnpm run build` after diagram review fix: passed; production build, asset sync, and service-worker generation completed. Non-fatal Vite large chunk warning remained.
- `pnpm run preflight` after diagram review fix: passed, including `check-feature-memory`, `check:repo`, `validate:content`, `test` (`345` passed), `build`, and Playwright e2e (`74` passed).
- Review fix verification, `2026-06-03T01:59:34Z`: fetched PR #185 inline review comment `3345484057` and addressed current-head automated Codex P2 in `scripts/manual-guide-source-fidelity.mjs`, `content/validation/manual-guide-source-fidelity.evidence.json`, `docs_project/project/frontend/manual-conversion-guidelines.md`, and `tests/content-manual-guide-chapters.test.mjs`.
- `node scripts/manual-guide-source-fidelity.mjs` after strict hash review fix: passed; output reported `status: pass`, `sectionsChecked: 10`, `pendingSections: 4`, `implementedSections: 6`, and `strictVisualRulePolicy: 031-strict-source-fidelity`.
- `node --test tests/content-manual-guide-chapters.test.mjs` after strict hash review fix: passed; `37` tests passed, `0` failed. Added regression coverage for strict image asset placeholder `sha256` failing and updated strict passing fixtures to use valid 64-hex SHA-256 strings.
- `node scripts/check-feature-memory.mjs --worktree` after strict hash review fix: passed; feature-memory gate passed via `specs/031-manual-document-completion/{spec,plan,tasks}.md`.
- `git diff --check` after strict hash review fix: passed.
- `pnpm run validate:content` after strict hash review fix: passed; validated difficulty labels, learning images, complete 4-wheel manual manifests/assets/translations, 460 category B fallback questions, and the manual guide checker.
- `pnpm run test` after strict hash review fix: passed; `346` tests passed, `0` failed.
- `pnpm run build` after strict hash review fix: passed; production build, asset sync, and service-worker generation completed. Non-fatal Vite large chunk warning remained.
- `pnpm run preflight` after strict hash review fix: passed, including `check-feature-memory`, `check:repo`, `validate:content`, `test` (`346` passed), `build`, and Playwright e2e (`74` passed).
- Review fix verification, `2026-06-03T02:07:34Z`: addressed current-head automated Codex P2 for strict `sourceRegionMetadata[].cropSha256` in `scripts/manual-guide-source-fidelity.mjs`, `content/validation/manual-guide-source-fidelity.evidence.json`, and `tests/content-manual-guide-chapters.test.mjs`.
- `node scripts/manual-guide-source-fidelity.mjs` after strict crop hash review fix: passed; output reported `status: pass`, `sectionsChecked: 10`, `pendingSections: 4`, `implementedSections: 6`, and `strictVisualRulePolicy: 031-strict-source-fidelity`.
- `node --test tests/content-manual-guide-chapters.test.mjs` after strict crop hash review fix: passed; `38` tests passed, `0` failed. Added regression coverage for strict source crop placeholder `cropSha256` failing and updated strict passing fixtures to use valid 64-hex crop hashes.
- `pnpm run validate:content` after strict crop hash review fix: passed; validated difficulty labels, learning images, complete 4-wheel manual manifests/assets/translations, 460 category B fallback questions, and the manual guide checker.
- `pnpm run test` after strict crop hash review fix: passed; `347` tests passed, `0` failed.
- `pnpm run build` after strict crop hash review fix: passed; production build, asset sync, and service-worker generation completed. Non-fatal Vite large chunk warning remained.
- `pnpm run preflight` after strict crop hash review fix: passed, including `check-feature-memory`, `check:repo`, `validate:content`, `test` (`347` passed), `build`, and Playwright e2e (`74` passed).
- Review fix verification, `2026-06-03T02:23:22Z`: addressed current-head automated Codex P2 for legacy Chapter 1 exemption fingerprinting in `scripts/manual-guide-source-fidelity.mjs`, `content/validation/manual-guide-source-fidelity.evidence.json`, and `tests/content-manual-guide-chapters.test.mjs`.
- `node scripts/manual-guide-source-fidelity.mjs` after legacy fingerprint review fix: passed; output reported `status: pass`, `sectionsChecked: 10`, `pendingSections: 4`, `implementedSections: 6`, and `strictVisualRulePolicy: 031-strict-source-fidelity`.
- `node --test tests/content-manual-guide-chapters.test.mjs` after legacy fingerprint review fix: first run exposed temporary legacy-fixture fingerprints that needed test-only fixture evidence; final run passed with `40` tests passed, `0` failed. Added regression coverage for already-merged Chapter 1 baseline legacy evidence passing and a changed Chapter 1 legacy section without strict v3 evidence failing.
- `pnpm run validate:content` after legacy fingerprint review fix: passed; validated difficulty labels, learning images, complete 4-wheel manual manifests/assets/translations, 460 category B fallback questions, and the manual guide checker.
- `pnpm run test` after legacy fingerprint review fix: passed; `349` tests passed, `0` failed.
- `pnpm run build` after legacy fingerprint review fix: passed; production build, asset sync, and service-worker generation completed. Non-fatal Vite large chunk warning remained.
- `pnpm run preflight` after legacy fingerprint review fix: first attempt failed as expected because product paths changed before this feature-memory update; rerun after process-memory update passed, including `check-feature-memory`, `check:repo`, `validate:content`, `test` (`349` passed), `build`, and Playwright e2e (`74` passed).
- Review fix verification, `2026-06-03T02:35:27Z`: addressed current-head automated Codex P2 for strict byte-hash verification in `scripts/manual-guide-source-fidelity.mjs`, `content/validation/manual-guide-source-fidelity.evidence.json`, and `tests/content-manual-guide-chapters.test.mjs`.
- `node scripts/manual-guide-source-fidelity.mjs` after strict byte-hash review fix: passed; output reported `status: pass`, `sectionsChecked: 10`, `pendingSections: 4`, `implementedSections: 6`, and `strictVisualRulePolicy: 031-strict-source-fidelity`.
- `node --test tests/content-manual-guide-chapters.test.mjs` after strict byte-hash review fix: passed; `42` tests passed, `0` failed. Added regression coverage for valid-looking but stale/wrong strict image `sha256` and source crop `cropSha256` values failing against referenced artifact bytes; passing strict fixtures now compute real hashes for temp fixture files.
- `pnpm run validate:content` after strict byte-hash review fix: passed; validated difficulty labels, learning images, complete 4-wheel manual manifests/assets/translations, 460 category B fallback questions, and the manual guide checker.
- `pnpm run test` after strict byte-hash review fix: passed; `351` tests passed, `0` failed.
- `pnpm run build` after strict byte-hash review fix: passed; production build, asset sync, and service-worker generation completed. Non-fatal Vite large chunk warning remained.
- `pnpm run preflight` after strict byte-hash review fix: passed, including `check-feature-memory`, `check:repo`, `validate:content`, `test` (`351` passed), `build`, and Playwright e2e (`74` passed).
- Review fix verification, `2026-06-03T02:47:01Z`: addressed current-head automated Codex P2 for legacy baseline-state fingerprinting in `scripts/manual-guide-source-fidelity.mjs`, `content/validation/manual-guide-source-fidelity.evidence.json`, and `tests/content-manual-guide-chapters.test.mjs`.
- `node scripts/manual-guide-source-fidelity.mjs` after legacy baseline-state review fix: passed; output reported `status: pass`, `sectionsChecked: 10`, `pendingSections: 4`, `implementedSections: 6`, and `strictVisualRulePolicy: 031-strict-source-fidelity`.
- `node --test tests/content-manual-guide-chapters.test.mjs` after legacy baseline-state review fix: passed; `44` tests passed, `0` failed. Added regression coverage for unchanged Chapter 1 baseline legacy evidence/state passing, changed legacy Chapter 1 module bytes failing without strict v3 evidence, and changed legacy Chapter 1 referenced visual asset bytes failing without strict v3 evidence.
- `pnpm run validate:content` after legacy baseline-state review fix: passed; validated difficulty labels, learning images, complete 4-wheel manual manifests/assets/translations, 460 category B fallback questions, and the manual guide checker with `strictVisualRulePolicy: 031-strict-source-fidelity`.
- `pnpm run test` after legacy baseline-state review fix: passed; `353` tests passed, `0` failed.
- `pnpm run build` after legacy baseline-state review fix: passed; production build, asset sync, and service-worker generation completed. Non-fatal Vite large chunk warning remained.
- `pnpm run preflight` after legacy baseline-state review fix: passed, including `check-feature-memory`, `check:repo`, `validate:content`, `test` (`353` passed), `build`, and Playwright e2e (`74` passed).
- Review fix verification, `2026-06-03T02:56:38Z`: addressed current-head automated Codex P2 for separator-insensitive forbidden visual-edit term matching in `scripts/manual-guide-source-fidelity.mjs`, `content/validation/manual-guide-source-fidelity.evidence.json`, and `tests/content-manual-guide-chapters.test.mjs`.
- `node scripts/manual-guide-source-fidelity.mjs` after forbidden-term matching review fix: passed; output reported `status: pass`, `sectionsChecked: 10`, `pendingSections: 4`, `implementedSections: 6`, and `strictVisualRulePolicy: 031-strict-source-fidelity`.
- `node --test tests/content-manual-guide-chapters.test.mjs` after forbidden-term matching review fix: first run exposed path-based false positive risk in temp fixture names; final run passed with `45` tests passed, `0` failed. Added regression coverage for `broad mask`, `approximate redraw`, and `large_patch` alternate separator terms failing in strict visual metadata while preserving valid strict fixture pass behavior.
- `pnpm run validate:content` after forbidden-term matching review fix: passed; validated difficulty labels, learning images, complete 4-wheel manual manifests/assets/translations, 460 category B fallback questions, and the manual guide checker with `strictVisualRulePolicy: 031-strict-source-fidelity`.
- `pnpm run test` after forbidden-term matching review fix: passed; `354` tests passed, `0` failed.
- `pnpm run build` after forbidden-term matching review fix: passed; production build, asset sync, and service-worker generation completed. Non-fatal Vite large chunk warning remained.
- `pnpm run preflight` after forbidden-term matching review fix: passed, including `check-feature-memory`, `check:repo`, `validate:content`, `test` (`354` passed), `build`, and Playwright e2e (`74` passed).
- Review fix verification, `2026-06-03T03:09:44Z`: addressed current-head automated Codex P2 for semantic forbidden `assetKind` metadata in `scripts/manual-guide-source-fidelity.mjs`, `content/validation/manual-guide-source-fidelity.evidence.json`, and `tests/content-manual-guide-chapters.test.mjs`.
- `node scripts/manual-guide-source-fidelity.mjs` after forbidden `assetKind` review fix: passed; output reported `status: pass`, `sectionsChecked: 10`, `pendingSections: 4`, `implementedSections: 6`, and `strictVisualRulePolicy: 031-strict-source-fidelity`.
- `node --test tests/content-manual-guide-chapters.test.mjs` after forbidden `assetKind` review fix: passed; `46` tests passed, `0` failed. Added regression coverage for strict `assetKind` values `generic-icon-replacement` and `redrawn-diagram` failing while preserving valid strict fixture pass behavior.
- `pnpm run validate:content` after forbidden `assetKind` review fix: passed; validated difficulty labels, learning images, complete 4-wheel manual manifests/assets/translations, 460 category B fallback questions, and the manual guide checker with `strictVisualRulePolicy: 031-strict-source-fidelity`.
- `pnpm run test` after forbidden `assetKind` review fix: passed; `355` tests passed, `0` failed.
- `pnpm run build` after forbidden `assetKind` review fix: passed; production build, asset sync, and service-worker generation completed. Non-fatal Vite large chunk warning remained.
- `pnpm run preflight` after forbidden `assetKind` review fix: passed, including `check-feature-memory`, `check:repo`, `validate:content`, `test` (`355` passed), `build`, and Playwright e2e (`74` passed).
- Repair verification, `2026-06-03T03:29:11Z`: addressed AI Review P2 comment `3345717864` for strict protected source-as-is visible-Spanish exception/status cross-checking in `scripts/manual-guide-source-fidelity.mjs`, `content/validation/manual-guide-source-fidelity.evidence.json`, and `tests/content-manual-guide-chapters.test.mjs`; recorded prior final Architect/Analyst validation staleness in this process memory.
- `node scripts/manual-guide-source-fidelity.mjs` after visible-Spanish repair: passed; output reported `status: pass`, `sectionsChecked: 10`, `pendingSections: 4`, `implementedSections: 6`, and `strictVisualRulePolicy: 031-strict-source-fidelity`.
- `node --test tests/content-manual-guide-chapters.test.mjs` after visible-Spanish repair: passed; `49` tests passed, `0` failed. Added regression coverage for strict source-as-is visible Spanish hidden by `visibleSpanishStatus: "none"` failing, mismatched exception path failing, and valid matching exception evidence passing.
- `pnpm run validate:content` after visible-Spanish repair: passed; validated difficulty labels, learning images, complete 4-wheel manual manifests/assets/translations, 460 category B fallback questions, and the manual guide checker with `strictVisualRulePolicy: 031-strict-source-fidelity`.
- `pnpm run test` after visible-Spanish repair: passed; `358` tests passed, `0` failed.
- `pnpm run build` after visible-Spanish repair: passed; production build, asset sync, and service-worker generation completed. Non-fatal Vite large chunk warning remained.
- `pnpm run preflight` after visible-Spanish repair: passed, including `check-feature-memory`, `check:repo`, `validate:content`, `test` (`358` passed), `build`, and Playwright e2e (`74` passed).
- Repair verification, `2026-06-03T03:36:19Z`: addressed Review Agent P2 comment `3345744974` for strict source-as-is visible-Spanish exception paths accepting only exception-bearing `visibleSpanishStatus.status` values in `scripts/manual-guide-source-fidelity.mjs`, `content/validation/manual-guide-source-fidelity.evidence.json`, and `tests/content-manual-guide-chapters.test.mjs`. Prior final Architect/Analyst validation remains stale pending revalidation after this non-evidence repair.
- `node scripts/manual-guide-source-fidelity.mjs` after exception-status repair: passed; output reported `status: pass`, `sectionsChecked: 10`, `pendingSections: 4`, `implementedSections: 6`, and `strictVisualRulePolicy: 031-strict-source-fidelity`.
- `node --test tests/content-manual-guide-chapters.test.mjs` after exception-status repair: passed; `50` tests passed, `0` failed. Added regression coverage for `visibleSpanishStatus: { status: "none", exceptions: [...] }` failing while valid strict exception evidence continues to pass.
- `pnpm run validate:content` after exception-status repair: passed; validated difficulty labels, learning images, complete 4-wheel manual manifests/assets/translations, 460 category B fallback questions, and the manual guide checker with `strictVisualRulePolicy: 031-strict-source-fidelity`.
- `pnpm run test` after exception-status repair: passed; `359` tests passed, `0` failed.
- `pnpm run build` after exception-status repair: passed; production build, asset sync, and service-worker generation completed. Non-fatal Vite large chunk warning remained.
- `pnpm run preflight` after exception-status repair: passed, including `check-feature-memory`, `check:repo`, `validate:content`, `test` (`359` passed), `build`, and Playwright e2e (`74` passed).
- Repair verification, `2026-06-03T03:45:44Z`: addressed AI Review P2 comment `3345769598` for strict mixed source-image and official traffic-sign visible-Spanish exceptions in `scripts/manual-guide-source-fidelity.mjs`, `content/validation/manual-guide-source-fidelity.evidence.json`, and `tests/content-manual-guide-chapters.test.mjs`. Prior final Architect/Analyst validation remains stale pending revalidation after this non-evidence repair.
- `node scripts/manual-guide-source-fidelity.mjs` after mixed-exception repair: passed; output reported `status: pass`, `sectionsChecked: 10`, `pendingSections: 4`, `implementedSections: 6`, and `strictVisualRulePolicy: 031-strict-source-fidelity`.
- `node --test tests/content-manual-guide-chapters.test.mjs` after mixed-exception repair: passed; `51` tests passed, `0` failed. Added regression coverage for a strict section with both source-image and official traffic-sign visible-Spanish exceptions passing under `source_image_exceptions_only`, while the prior `status: "none"` object-with-exceptions regression still fails.
- `pnpm run validate:content` after mixed-exception repair: passed; validated difficulty labels, learning images, complete 4-wheel manual manifests/assets/translations, 460 category B fallback questions, and the manual guide checker with `strictVisualRulePolicy: 031-strict-source-fidelity`.
- `pnpm run test` after mixed-exception repair: passed; `360` tests passed, `0` failed.
- `pnpm run build` after mixed-exception repair: passed; production build, asset sync, and service-worker generation completed. Non-fatal Vite large chunk warning remained.
- `pnpm run preflight` after mixed-exception repair: passed, including `check-feature-memory`, `check:repo`, `validate:content`, `test` (`360` passed), `build`, and Playwright e2e (`74` passed).
- Repair verification, `2026-06-03T04:09:57Z`: addressed AI Review P2 comment `3345857423` for Spanish-visible strict source-transferred infographic/diagram assets in `scripts/manual-guide-source-fidelity.mjs`, `content/validation/manual-guide-source-fidelity.evidence.json`, and `tests/content-manual-guide-chapters.test.mjs`. Final Architect/Analyst validation rerun evidence for effective content head `c0b08aa2b23fefdb4eef1425035e94d5d6f8236c` is stale pending revalidation after this non-evidence repair.
- `node scripts/manual-guide-source-fidelity.mjs` after transferred-artwork visible-Spanish repair: passed; output reported `status: pass`, `sectionsChecked: 10`, `pendingSections: 4`, `implementedSections: 6`, and `strictVisualRulePolicy: 031-strict-source-fidelity`.
- `node --test tests/content-manual-guide-chapters.test.mjs` after transferred-artwork visible-Spanish repair: passed; `53` tests passed, `0` failed. Added regression coverage for strict `source-transferred-infographic` and `source-transferred-diagram` assets with `visibleSpanish: true` failing even when legacy source-image exception metadata is present, while valid transferred artwork and source-as-is exception cases continue to pass.
- `pnpm run validate:content` after transferred-artwork visible-Spanish repair: passed; validated difficulty labels, learning images, complete 4-wheel manual manifests/assets/translations, 460 category B fallback questions, and the manual guide checker with `strictVisualRulePolicy: 031-strict-source-fidelity`.
- `pnpm run test` after transferred-artwork visible-Spanish repair: passed; `362` tests passed, `0` failed.
- `pnpm run build` after transferred-artwork visible-Spanish repair: passed; production build, asset sync, and service-worker generation completed. Non-fatal Vite large chunk warning remained.
- `pnpm run preflight` after transferred-artwork visible-Spanish repair: passed, including `check-feature-memory`, `check:repo`, `validate:content`, `test` (`362` passed), `build`, and Playwright e2e (`74` passed).
- Repair verification, `2026-06-03T04:16:27Z`: addressed Review Agent P2 comment `3345889680` for strict non-protected categories attempting to retain visible Spanish through legacy `sourceImageException` metadata in `scripts/manual-guide-source-fidelity.mjs` and `tests/content-manual-guide-chapters.test.mjs`. Final Architect/Analyst validation rerun evidence for effective content head `c0b08aa2b23fefdb4eef1425035e94d5d6f8236c` remains stale pending revalidation after this non-evidence repair.
- `node scripts/manual-guide-source-fidelity.mjs` after strict non-protected visible-Spanish repair: passed; output reported `status: pass`, `sectionsChecked: 10`, `pendingSections: 4`, `implementedSections: 6`, and `strictVisualRulePolicy: 031-strict-source-fidelity`.
- `node --test tests/content-manual-guide-chapters.test.mjs` after strict non-protected visible-Spanish repair: passed; `54` tests passed, `0` failed. Added regression coverage for strict `native-dom-text-only` and `reference-only-not-runtime` assets failing when they attempt to keep visible Spanish via `sourceImageException`, while protected source-as-is exceptions and transferred-artwork visible-Spanish rejection continue to pass.
- `pnpm run validate:content` after strict non-protected visible-Spanish repair: passed; validated difficulty labels, learning images, complete 4-wheel manual manifests/assets/translations, 460 category B fallback questions, and the manual guide checker with `strictVisualRulePolicy: 031-strict-source-fidelity`.
- `pnpm run test` after strict non-protected visible-Spanish repair: passed; `363` tests passed, `0` failed.
- `pnpm run build` after strict non-protected visible-Spanish repair: passed; production build, asset sync, and service-worker generation completed. Non-fatal Vite large chunk warning remained.
- `pnpm run preflight` after strict non-protected visible-Spanish repair: passed, including `check-feature-memory`, `check:repo`, `validate:content`, `test` (`363` passed), `build`, and Playwright e2e (`74` passed).
