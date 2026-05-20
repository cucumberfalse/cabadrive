# Tasks: Source Material Refresh

## Architect Planning

- [x] T001 Confirm assigned worktree, branch, and verified base from Orchestrator.
- [x] T002 Read the active Analyst artifact `feature-request.md`.
- [x] T003 Review governing project docs and relevant content/tooling contracts.
- [x] T004 Create `spec.md`.
- [x] T005 Create `plan.md`.
- [x] T006 Create this `tasks.md`.

## Slice 1: Inventory And Candidate Disposition

- [x] T007 Confirm Implementation Agent starts from complete feature memory.
- [x] T008 Run `git status --short --branch` and record pre-existing dirty/untracked state.
- [x] T009 Confirm current content mode remains `unofficial_b_fallback`.
- [x] T010 Inventory all seven supplied PDFs with path, existence, hash, apparent source/date, role, source authority, currentness, licensing/provenance concerns, and disposition.
- [x] T011 Verify usable PDF text/image extraction tooling or record exact blocker.
- [x] T012 Classify PDFs as ticket source, official/manual candidate, Russian learning aid, process-guide candidate, roadmap/reference, rejected, or ambiguous.
- [x] T013 Extract ticket candidates from ticket-source PDFs or record blocker.
- [x] T014 Compare every extracted candidate against the existing bundled bank by structured Spanish tuple, correct answer, category, and image evidence where applicable.
- [x] T015 Disposition every candidate as duplicate, accepted-current, out-of-scope, outdated, unsupported, ambiguous, or deferred.
- [x] T016 Record candidate counts, disposition counts, evidence paths, and blockers in Process Memory.
- [x] T017 Recommend ticket batch grouping and whether separate process-guide/official-source slices are needed.
- [x] T018 Run Slice 1 verification gates.

## Conditional Slice 2+: Ticket Batches

Complete only for Orchestrator-assigned accepted-current ticket batches.

Architect scope note after Slice 1: no Slice 2 ticket-import batch is currently ready. These tasks remain gated until a separate official/currentness investigation proves one or more candidates are `accepted-current` and identifies a small reviewable batch with full support evidence.

- [ ] T019 Assign stable IDs without renumbering existing tickets.
- [ ] T020 Add or update source records with truthful authority, license/provenance, and category B practice scope.
- [ ] T021 Add accepted question records with Spanish question/answers, correct answer, source trace, validation notes, topics, flags, and difficulty metadata.
- [ ] T022 Add local image crops/assets with source page/region, hash, dimensions, crop method, and visual review when needed.
- [ ] T023 Add Russian translations and answer translations in range shards.
- [ ] T024 Add Russian explanations with correct-answer and wrong-answer rationales.
- [ ] T025 Add/update image metadata and question-specific usage mappings for image-backed tickets.
- [ ] T026 Update affected topic, vocabulary, overlay, or primary-source references only when required.
- [ ] T027 Regenerate indexes and refresh deterministic evidence through project tooling.
- [ ] T028 Run ticket-slice verification gates including `validate:content:quality`.
- [ ] T029 Record accepted IDs, changed files, evidence, validation, and known issues.

## Conditional Slice: Process Guide Refresh

Architect scope note after Slice 1: this should be the next recommended separate implementation slice if Orchestrator continues this feature. Use `Первое_получение_прав_и_обновление.pdf` only as a structure/reference model; every retained fact must be independently verified against current official GCBA/ANSV sources before content changes.

- [ ] T030 Identify the best supplied process PDF as a structure/reference model.
- [ ] T031 Independently verify every retained acquisition/renewal claim against current official sources.
- [ ] T032 Update `content/guide/caba-exam-process.ru.json` only for verified current claims.
- [ ] T033 Preserve unofficial status, B1/private-car scope, official links, checked dates, and volatility warnings.
- [ ] T034 Keep renewal/jurisdiction-change/foreigner/beginner material as concise adjacent-path support unless separately scoped.
- [ ] T035 Run process-guide validation through `pnpm run validate:content`.
- [ ] T036 Record official-source evidence and verification outcome.

## Conditional Slice: Official Archive / Primary Sources

- [ ] T037 Add or refresh official archive entries only from independently verified official sources.
- [ ] T038 Preserve exact Spanish text and raw/original evidence for lossy formats.
- [ ] T039 Update manifest metadata, hashes, currentness, and exact-text evidence.
- [ ] T040 Keep Russian learner content outside `content/official-documents/`.
- [ ] T041 Update primary-source learner corpus only if archive coverage changes.
- [ ] T042 Run relevant official-source validation.

## Conditional Slice: Durable Docs

- [ ] T043 Update durable docs only when behavior, source governance, workflow, validation, content counts, or visible status semantics change.
- [ ] T044 Record why docs were or were not changed.

## Verification Gates

- [x] T045 Run `pnpm run validate:content`.
- [x] T046 Run `node scripts/check-feature-memory.mjs --worktree`.
- [x] T047 Run `git diff --check`.
- [x] T048 Run helper tests if helper tooling was added. Not applicable: no helper tooling was committed.
- [ ] T049 For ticket/support/image changes, run `pnpm run generate:content-indexes`.
- [ ] T050 For ticket/support/image changes, run `pnpm run refresh:content-evidence`.
- [ ] T051 For ticket/support/image changes, run `pnpm run validate:content:quality`.
- [ ] T052 For learner-visible or tooling changes, run `pnpm run test`.
- [ ] T053 For learner-visible or content bundle changes, run `pnpm run build`.
- [ ] T054 For learner-visible behavior changes, run `pnpm run test:e2e`.
- [ ] T055 Before final handoff, run `pnpm run preflight` or record exact unrelated blocker.

## Review Requirements

- [ ] T056 Review Agent verifies role boundaries and complete feature memory.
- [ ] T057 Review Agent verifies PDF inventory and source dispositions.
- [ ] T058 Review Agent verifies candidate comparison/dispositions.
- [ ] T059 Review Agent verifies accepted tickets, if any, have full support/evidence and no stale generated files.
- [ ] T060 Review Agent verifies image crop/metadata evidence for image-backed accepted tickets.
- [ ] T061 Review Agent verifies process-guide changes use current official sources.
- [ ] T062 Review Agent verifies official archive separation and exact-text governance.
- [ ] T063 Review Agent verifies no official-full-bank claim or content-mode drift.
- [ ] T064 Review Agent verifies validation evidence and unresolved feedback disposition.

## Process Memory

### Architect Decisions

- Full ticket addition/update is too large for one implementation PR unless Slice 1 proves the accepted delta is tiny.
- First recommended slice is Inventory And Candidate Disposition.
- Later ticket batches must be small enough to review complete Spanish/source/support/image/evidence changes.
- Process-guide refresh should normally be separate from ticket batches.
- Current mode remains `unofficial_b_fallback`; official full-bank claims require separate scope.
- User PDFs are candidates, not release authority.
- Official Spanish archive stays exact and Spanish-only; Russian learner support stays outside it.

### Context Evidence

- Architect worked only in `specs/025-source-material-refresh/`.
- Current project docs identify the active practice mode as `unofficial_b_fallback`.
- Existing ticket support layers are sharded and generated indexes are tooling-owned.
- Process guide validates through `scripts/content-caba-exam-process.mjs`.
- System PDF tools are documented as absent; implementation must refine extraction within bundled/project tooling constraints.
- Implementation Agent started in `/Users/chap/devel/cabadrive-worktrees/025-source-material-refresh` on branch `codex/025-source-material-refresh`; `HEAD` and merge-base matched `04d2a3279cb3512dbc52625a687e7ba44a3d339b`.
- Pre-implementation `git status --short --branch` was `## codex/025-source-material-refresh...origin/main` plus the expected untracked `specs/025-source-material-refresh/` feature folder.
- Feature memory was complete before Slice 1 implementation: `feature-request.md`, `spec.md`, `plan.md`, and `tasks.md` existed.
- Current content mode remains `unofficial_b_fallback` in `content/meta/content-mode.json`.
- Slice 1 used existing project official-source evidence only for currentness notes; no internet/currentness browsing was performed.
- The supplied `MANUAL_Vehiculo_4Ruedas_2023 SA.pdf` is byte-for-byte identical to the governed archive raw original at `content/official-documents/originals/gcba-manual-vehiculo-4-ruedas-2023.pdf`.

### Dead Ends

- Architect planning: none.
- Slice 1 did not extract page-rendered image crops because `pdftoppm`, `mutool`, PyMuPDF/`fitz`, and `pdfplumber` were unavailable. `pypdf` can enumerate embedded image objects, but that is not sufficient for project ticket crop/import evidence.
- Slice 1 did not OCR `трудные билеты.pdf`; pypdf text extraction exposed Russian notes and correct-answer prose, not the Spanish question/answer tuple required for ticket comparison.
- Slice 1 did not treat PDF answer styling as correct-answer evidence because `pypdf` text extraction did not expose reliable correct-answer marks.

### Known Issues

- The feature folder is untracked in this worktree as expected for new feature memory.
- Architect made no code, content, docs, test, script, staging, commit, push, or PR changes.
- `categoriab.pdf` yielded 447 structured Spanish candidates: 438 duplicate dispositions and 9 ambiguous dispositions.
- `PREGUNTAS-CATEGORIA-B LIC-AUTOS.pdf` yielded 195 structured Spanish candidates: 7 duplicate, 53 ambiguous, and 135 outdated dispositions.
- No candidate was dispositioned `accepted-current`; absent/nonduplicate candidates do not yet have current official/legal support, reliable correct-answer evidence, and image/crop provenance.
- `agent_roadmap_ru.pdf` is unrelated to Cabadrive driving content and was rejected for this refresh.
- Russian learning/process PDFs are deferred as unofficial references only; they are not authority for production facts or ticket import.

### Verification Evidence

- Architect created `spec.md`, `plan.md`, and `tasks.md`.
- Slice 1 evidence files:
  - `specs/025-source-material-refresh/evidence/pdf-inventory.json`
  - `specs/025-source-material-refresh/evidence/pdf-tooling-feasibility.json`
  - `specs/025-source-material-refresh/evidence/ticket-candidate-dispositions.json`
  - `specs/025-source-material-refresh/evidence/ticket-candidate-dispositions.csv`
  - `specs/025-source-material-refresh/evidence/ticket-comparison-summary.json`
  - `specs/025-source-material-refresh/evidence/slice-1-summary.md`
- Candidate comparison summary: 642 extracted structured Spanish candidates, with 445 exact duplicate tuples, 59 question-text-only matches, 3 fuzzy question matches, and 135 no structured matches.
- Disposition summary: 445 duplicate, 62 ambiguous, 135 outdated, 0 accepted-current.
- Tooling feasibility: bundled Python `pypdf` and `PIL` are available; system `pdftotext`, `pdfinfo`, `pdftoppm`, `mutool`, PyPDF2, PyMuPDF/`fitz`, and `pdfplumber` are unavailable.
- Slice 1 verification, 2026-05-20:
  - `git status --short --branch`: `## codex/025-source-material-refresh...origin/main` plus untracked `specs/025-source-material-refresh/`.
  - `pnpm run validate:content`: passed; output reported `Difficulty labels validated: 460 questions, 38 topics.` and `Content validation passed: 460 category B fallback questions, 276 local image references.`
  - `node scripts/check-feature-memory.mjs --worktree`: passed with `No configured product paths changed; feature-memory gate passes.`
  - `git diff --check`: passed with no output.

### Implementation Agent Feedback

- For Architect disposition: no Slice 2 ticket-import batch is ready from this evidence because `accepted-current` count is 0.
- For Architect disposition: if later ticket work is desired, start with the 9 ambiguous `categoriab.pdf` candidates and require official/currentness validation plus full support evidence before any import.
- For Architect disposition: do not batch-import unmatched 2008 `PREGUNTAS-CATEGORIA-B LIC-AUTOS.pdf` candidates unless a separate official-source investigation proves current validity.
- For Architect disposition: run process-guide refresh as a separate slice using `Первое_получение_прав_и_обновление.pdf` only as a structure/reference model, with official GCBA/ANSV verification for every retained claim.
- For Architect disposition: no official archive/manual update is recommended from Slice 1 because the supplied 2023 manual copy already matches the governed archive original.

### Architect Dispositions

- Slice 1 ticket-import readiness feedback: dispositioned as not-needed for the current PR/slice. Evidence shows 642 extracted structured Spanish candidates with 0 `accepted-current`; no ticket batch may proceed from Slice 1 evidence alone.
- Later ticket work feedback for 9 ambiguous `categoriab.pdf` candidates: dispositioned as a possible future ticket/investigation slice, not an immediate import task. If Orchestrator assigns it, scope it to the 9 ambiguous `categoriab.pdf` candidates first, require official/currentness validation, reliable correct-answer evidence, image/crop provenance where applicable, and full support/evidence updates before any import.
- Unmatched 2008 `PREGUNTAS-CATEGORIA-B LIC-AUTOS.pdf` feedback: dispositioned as not-needed for batch import. The 135 unmatched candidates are outdated for this feature unless a separate official-source investigation proves current validity; exact matches remain duplicates and old variants must not be imported opportunistically.
- Process-guide refresh feedback: dispositioned as the recommended next separate implementation slice. Use `Первое_получение_прав_и_обновление.pdf` only as a structure/reference model and validate every retained acquisition/renewal claim against current official GCBA/ANSV sources.
- Official archive/manual update feedback: dispositioned as not-needed. The supplied 2023 manual matches the governed archive raw original byte-for-byte, so no official archive or manual refresh should be assigned from Slice 1 evidence.
- Recommended next Orchestrator assignment: assign an Implementation Agent a separate Process Guide Refresh slice covering T030-T036 only, preserving the same role boundaries and requiring official-source evidence plus `pnpm run validate:content`. Do not assign ticket-import work until a separate candidate-currentness investigation is explicitly scoped.
