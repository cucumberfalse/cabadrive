# Tasks: Primary Sources Section

## Architect Planning Setup

- [x] T001 Confirm assigned worktree is `/Users/chap/devel/cabadrive-016-primary-sources-section` (historical implementation label retained after feature-memory rename).
- [x] T002 Confirm active branch is `codex/016-primary-sources-section-intake` (historical implementation label retained after feature-memory rename).
- [x] T003 Read `.specify/memory/constitution.md`.
- [x] T004 Read `docs_project/README.md`.
- [x] T005 Read `docs_project/project-idea.md`.
- [x] T006 Read `docs_project/project/frontend/frontend-docs.md`.
- [x] T007 Read `docs_project/project/backend/backend-docs.md`.
- [x] T008 Read `docs_project/project/feature-inventory.md`.
- [x] T009 Read `docs_project/screens/learning-and-exam-flows.md`.
- [x] T010 Read `docs/specify/README.md`.
- [x] T011 Read `specs/019-primary-sources-section/feature-request.md`.
- [x] T012 Read `content/official-documents/AGENTS.md`.
- [x] T013 Inspect `content/official-documents/manifest.json` for current count/status context.
- [x] T014 Read feature 010 UI/UX source-of-truth material from the parallel worktree as context only.
- [x] T015 Check official Apple/Google UI guidance as context.

## Architect Artifacts

- [x] T016 Create `spec.md` with goal, scope, non-goals, assumptions, user stories, acceptance criteria, negative scenarios, functional requirements, data/content model requirements, validation requirements, UI/UX requirements, review requirements, and industry-guidance implications.
- [x] T017 Create `plan.md` with implementation strategy, slice decomposition, data/content architecture, UI architecture, validation approach, QA gates, risks, and handoff.
- [x] T018 Create this `tasks.md` with atomic implementation tasks, process memory sections, release gates, and verification expectations.

## Implementation Prerequisites

- [x] T019 Confirm implementation starts only after `feature-request.md`, `spec.md`, `plan.md`, and `tasks.md` exist.
- [x] T020 Confirm implementation uses an assigned isolated worktree and branch per PR slice.
- [x] T021 Re-read feature memory before editing repository files.
- [x] T022 Warn assigned agents that parallel orchestrators/agents may have dirty worktrees and that unrelated changes must not be reverted.
- [x] T023 Record the implementation-time manifest entry count and IDs in Process Memory.
- [x] T024 Record the implementation-time official archive line/chunk inventory baseline in Process Memory.

## Slice A: Source Readiness And Durable Docs

- [x] T025 Re-run or inspect official-documents validation for the implementation-time manifest.
- [x] T026 Record currentness/effective-status validation state for every manifest entry.
- [x] T027 Record exact-text validation state for every manifest entry.
- [x] T028 Decide whether exact-text validation is completed before UI exposure or before final release; record the decision and rationale.
- [ ] T029 Complete whole-archive exact-text validation for every manifest entry before final release, or record an explicit Architect/user blocker disposition.
- [ ] T030 Confirm every final-release manifest entry has currentness/effective-status validation passed or an explicit blocker disposition.
- [x] T031 Refresh `docs_project/project/content-sources.md` so it no longer describes the archive as only a small three-source seed.
- [x] T032 Refresh frontend/feature-inventory/learning-flow docs to describe the new `Источники` source reader and its relationship to `Материалы`.
- [x] T033 Document that learner Russian translation/simplification lives outside `content/official-documents/`.
- [x] T034 Record source-readiness decisions and durable-doc updates in Process Memory.

## Slice B: Learner Source Schema And Validators

- [ ] T035 Create a governed learner-source content area outside `content/official-documents/`, preferred `content/primary-sources/`.
- [ ] T036 Add local instructions for learner-source content governance, translation QA, simplification QA, and archive boundary rules.
- [ ] T037 Define document, chunk, QA, coverage, and search-index schemas/types.
- [ ] T038 Add validator support for manifest-entry coverage.
- [ ] T039 Add validator support for generated chunk coverage.
- [ ] T040 Add validator support for source fingerprint/span alignment against archive Markdown.
- [ ] T041 Add validator support for required full Russian translation per chunk.
- [ ] T042 Add validator support for required simple Russian rewrite per chunk.
- [ ] T043 Add validator support for translation QA status.
- [ ] T044 Add validator support for simplification QA status.
- [ ] T045 Add validator support that forbids learner Russian content under `content/official-documents/`.
- [ ] T046 Add validator support that rejects simplified Spanish fields/content paths.
- [ ] T047 Add validator support that rejects orphan learner documents/chunks not tied to manifest/chunk inventory.
- [ ] T048 Add strict final mode that fails partial coverage or non-approved QA.
- [ ] T049 Integrate source-section validation with `pnpm run validate:content` before final release.
- [ ] T050 Add unit tests for validator pass/fail cases.

## Slice C: Corpus Inventory And Chunking

- [ ] T051 Generate or author a complete document inventory for every implementation-time manifest entry.
- [ ] T052 Generate or author stable chunk IDs for every official document.
- [ ] T053 Preserve official ordering and heading/article/section labels where available.
- [ ] T054 Record line spans, heading paths, hashes, or structural fingerprints for each chunk.
- [ ] T055 Record special chunking decisions for weakly structured pages or lossy PDF/manual conversions.
- [ ] T056 Validate every manifest entry produces at least one source chunk.
- [ ] T057 Validate every chunk maps back to an archived Markdown document.
- [ ] T058 Record total chunk count and per-document chunk counts in Process Memory.
- [ ] T059 Confirm no chunking step edits or rewrites official archive text.

## Slices D-H: Translation And Simplification Content Batches

- [ ] T060 Create or update the shared terminology/glossary approach for consistent Russian legal/traffic terms.
- [ ] T061 For each batch, translate every assigned chunk into full Russian.
- [ ] T062 For each batch, rewrite every assigned chunk into simple schoolchild-friendly Russian.
- [ ] T063 For each batch, preserve numbers, dates, legal obligations, exceptions, penalties, source names, and article references in both Russian layers.
- [ ] T064 For each batch, mark source conflicts or stale-ticket/source differences plainly instead of smoothing them over.
- [ ] T065 For each batch, run completeness and placeholder validation.
- [ ] T066 For each batch, run translation QA and mark every chunk `approved` only after review.
- [ ] T067 For each batch, run simplification QA and mark every chunk `approved` only after review.
- [ ] T068 For each batch, record QA method notes, reviewer notes, checked-at dates, and known limitations.
- [ ] T069 Batch core traffic law and CABA code sources: Ley 24.449, Decreto 779 main text, Ley 2148.
- [ ] T070 Batch signage and driving study material sources: Anexo L, GCBA four-wheel manual, GCBA study-material page.
- [ ] T071 Batch vehicle/document/admin sources: VTV, Ley 6631, vehicle/cédula/chapa/DNRPA/ANSV materials.
- [ ] T072 Batch incident, road-safety, insurance, and legal-duty sources: siniestros guide, Estrellas Amarillas, Código Penal, Código Civil y Comercial, Ley de Seguros.
- [ ] T073 Add any new manifest entries discovered before final validation to an explicit content batch.
- [ ] T074 Record per-batch coverage progress and blockers in Process Memory.

## Slice I: Source Reader UI Shell

- [ ] T075 Import learner-source corpus through the existing data boundary.
- [ ] T076 Add typed UI-facing models for source documents, chunks, QA/status metadata, and categories.
- [ ] T077 Add a distinct app view for primary sources.
- [ ] T078 Add navigation label `Источники` or an explicitly justified visible equivalent.
- [ ] T079 Preserve existing `Учить`, `Экзамен`, `Ошибки`, `Словарь`, `Материалы`, and `CABA/RF` flows.
- [ ] T080 Keep active exam attempt behavior unchanged.
- [ ] T081 Render source list rows with title, short label, category, jurisdiction/source type, and compact status.
- [ ] T082 Render selected document detail with metadata and trust boundary labels.
- [ ] T083 Render the first/opened document in simple Russian by default.
- [ ] T084 Render source chunk headings/labels and selected chunk text.
- [ ] T085 Render local fallback/missing-content states without crashing.
- [ ] T086 Ensure no runtime network fetch, backend endpoint, live AI, remote asset, analytics, or PDF viewer is introduced.

## Slice J: Search, Filters, Chunk Navigation, And View Controls

- [ ] T087 Build local search over title/metadata, simple Russian, full Russian, and original Spanish.
- [ ] T088 Add useful search hint text in learner language.
- [ ] T089 Add filters for practical category.
- [ ] T090 Add filters for jurisdiction/source type.
- [ ] T091 Add no-results state for search/filter combinations.
- [ ] T092 Add document table of contents or chunk navigation.
- [ ] T093 Add view controls for `Просто`, `Полный перевод`, and `Оригинал ES`.
- [ ] T094 Confirm `Просто` remains the default when opening a new source or resetting filters.
- [ ] T095 Confirm full Russian translation can be viewed for every document and chunk.
- [ ] T096 Confirm original Spanish can be viewed for every document and chunk.
- [ ] T097 Confirm no simplified Spanish control, data field, route, or rendered text exists.
- [ ] T098 Avoid rendering very long documents as one unchunked page.
- [ ] T099 Preserve selected document/chunk/search context when switching view modes.

## Slice K: Responsive, Accessibility, And Visual Polish

- [ ] T100 Implement compact/mobile list-to-detail behavior with a clear back/list affordance.
- [ ] T101 Implement expanded/desktop side-by-side list-detail behavior.
- [ ] T102 Ensure long source titles and Russian/Spanish paragraphs wrap without overflow.
- [ ] T103 Ensure controls have stable dimensions and do not shift layout unexpectedly.
- [ ] T104 Ensure all source controls are keyboard reachable.
- [ ] T105 Ensure focus states are visible and focus order is predictable.
- [ ] T106 Ensure status is conveyed by text and not only color.
- [ ] T107 Ensure touch targets and spacing are comfortable for repeated mobile use.
- [ ] T108 Avoid nested cards, decorative hero layouts, raw JSON labels, and landing-page copy.
- [ ] T109 Use existing UI patterns and icons where available.

## Tests And Verification

- [ ] T110 Add validator tests for missing manifest document coverage.
- [ ] T111 Add validator tests for missing chunk coverage.
- [ ] T112 Add validator tests for missing full Russian translation.
- [ ] T113 Add validator tests for missing simple Russian rewrite.
- [ ] T114 Add validator tests for non-approved translation/simplification QA in strict mode.
- [ ] T115 Add validator tests for Russian learner content under `content/official-documents/`.
- [ ] T116 Add validator tests for forbidden simplified Spanish.
- [ ] T117 Add validator tests for stale source fingerprints or missing archive mappings.
- [ ] T118 Add e2e coverage that `Источники` opens the source section.
- [ ] T119 Add e2e coverage that existing primary flows remain reachable.
- [ ] T120 Add e2e coverage that a source detail defaults to simple Russian.
- [ ] T121 Add e2e coverage for switching to full Russian translation.
- [ ] T122 Add e2e coverage for switching to original Spanish.
- [ ] T123 Add e2e coverage that simplified Spanish is not available.
- [ ] T124 Add e2e coverage for source search.
- [ ] T125 Add e2e coverage for category and jurisdiction/source-type filtering.
- [ ] T126 Add e2e coverage for a long document's chunk/table-of-contents navigation.
- [ ] T127 Add responsive e2e coverage for compact and expanded widths.
- [ ] T128 Add keyboard/focus e2e coverage for search, filters, source selection, chunk navigation, and view controls.
- [ ] T129 Add request-monitoring/code-review evidence that no runtime network/PDF/backend/live-AI dependency exists.
- [ ] T130 Run final-head `pnpm run validate:content`.
- [ ] T131 Run final-head `pnpm run test`.
- [ ] T132 Run `pnpm run build`.
- [ ] T133 Run `pnpm run test:e2e`.
- [ ] T134 Run `pnpm run preflight`.
- [ ] T135 Run final-head `git diff --check`.
- [ ] T136 Record final-head command output summaries and exact unrelated blockers in Process Memory.

## Final Whole-Corpus Release Gate

- [ ] T137 Re-read final-head `content/official-documents/manifest.json`.
- [ ] T138 Confirm every final-head manifest entry has learner-source document coverage.
- [ ] T139 Confirm every final-head generated source chunk has approved full Russian translation.
- [ ] T140 Confirm every final-head generated source chunk has approved simple Russian rewrite.
- [ ] T141 Confirm every final-head source chunk can display original Spanish offline.
- [ ] T142 Confirm exact-text validation is passed for every included manifest entry or final release is blocked by explicit disposition.
- [ ] T143 Confirm currentness/effective-status validation is passed for every included manifest entry or final release is blocked by explicit disposition.
- [ ] T144 Confirm no learner Russian files are under `content/official-documents/`.
- [ ] T145 Confirm no simplified Spanish is present in data, validators, UI, tests, or docs.
- [ ] T146 Confirm durable docs are current.
- [ ] T147 Confirm Process Memory contains final corpus counts, chunk counts, QA evidence, validation evidence, UI evidence, known issues, and release decision.
- [ ] T148 Confirm the implementation PR has no unresolved merge conflicts.
- [ ] T149 Confirm required checks are green after push/PR.
- [ ] T150 Confirm no blocking review findings remain.
- [ ] T151 Leave only final human approval or merge mechanics remaining.

## Review Checklist

- [ ] R001 Review verifies complete feature memory exists.
- [ ] R002 Review verifies scope boundaries and one-PR slice boundaries.
- [ ] R003 Review verifies translation/simplification content is outside `content/official-documents/`.
- [ ] R004 Review verifies official archive text is not paraphrased for learner prose.
- [ ] R005 Review verifies validators catch missing manifest/chunk/translation/simplification coverage.
- [ ] R006 Review verifies final release does not pass with unresolved exact-text/currentness blockers.
- [ ] R007 Review verifies UI defaults to simple Russian and can show full Russian and Spanish original.
- [ ] R008 Review verifies no simplified Spanish path exists.
- [ ] R009 Review verifies search/filter/detail/responsive/accessibility tests exist.
- [ ] R010 Review verifies no runtime network, backend, live AI, analytics, remote asset, or raw PDF viewer exists.
- [ ] R011 Review verifies durable docs and process memory are current.

## Process Memory

### Architect Decisions

- The source section should be distinct from the existing topic `Материалы` guide; preferred navigation label is `Источники`.
- The final feature is corpus-wide, not an MVP. Intermediate PR slices may be partial only as preparation and must not claim completion.
- Exact-text validation is a release-readiness blocker. Observed current state is all manifest entries pending exact-text validation.
- Learner Russian translation and simplification must live outside `content/official-documents/`, preferred under `content/primary-sources/`.
- Simple Russian is the default source-reader view because this is passive learning/reference support, not an active exam attempt.
- Full Russian translation and original Spanish must be available per document and per chunk.
- Simplified Spanish is explicitly out of scope and should be rejected by data/UI validation.
- Original Spanish shown in UI should be archive-derived and fingerprint-validated.
- UI architecture should be adaptive list-detail with search/filter, compact metadata, chunk navigation, and progressive disclosure for long documents.

### Architect Context Evidence

- Worktree check showed `/Users/chap/devel/cabadrive-016-primary-sources-section` on `codex/016-primary-sources-section-intake`.
- Feature folder initially contained only `feature-request.md`.
- Current observed manifest count: 19 entries.
- Current observed manifest status summary: 19 `currentness.validationStatus: "passed"`; 19 `exactTextValidation.status: "pending"`.
- Current observed archived Markdown line total: about 37,167 lines.
- Largest observed documents are `ley-26994-codigo-civil-comercial`, `ley-2148-caba-codigo-transito-transporte`, `gcba-manual-vehiculo-4-ruedas-2023`, `decreto-779-1995-anexo-l-senalizacion-vial-uniforme`, `ley-24449-transito-seguridad-vial`, `ley-11179-codigo-penal`, and `ley-17418-seguros`.
- `content/official-documents/AGENTS.md` forbids translation, simplification, paraphrase, and editorial rewriting inside the official archive.
- `docs_project/project/content-sources.md` is stale about the archive seed size and needs durable-doc refresh during implementation.
- Feature 010 source-of-truth rules support visible status boundaries, mobile-first dense study layout, keyboard/focus requirements, local assets only, and review evidence.
- Apple/Google guidance supports adaptive layout, progressive disclosure, accessible controls, Material-style navigation/selection/search components, list-detail responsive behavior, and search suggestions from actual app data.

### Known Issues

- Exact-text validation is pending for all observed manifest entries; final feature release should block until resolved or explicitly disposed.
- The corpus is large enough that translation/simplification should be batched across multiple PRs.
- Translation quality and simplification fidelity are the highest content risks; validators alone cannot prove semantic quality.
- If new manifest entries land during implementation, coverage must expand before final release.
- Navigation may become crowded; any grouping must keep the source reader visibly distinct from topic `Материалы`.
- Bundle size/performance must be measured once full Russian and Spanish chunk data are imported.

### Slice A Implementation Notes

- Slice A ran in assigned worktree `/Users/chap/devel/cabadrive-016-primary-sources-section` on branch `codex/016-primary-sources-section-intake`.
- Implementation started only after confirming all feature memory files exist: `feature-request.md`, `spec.md`, `plan.md`, and `tasks.md`.
- Parallel-agent warning was part of the Slice A assignment. This slice preserved unrelated work and edited only the assigned write set.
- Implementation-time manifest inventory was computed from `content/official-documents/manifest.json` and local archived Markdown on 2026-05-10.
- Manifest entry count: 19.
- Manifest entry IDs:
  - `ley-24449-transito-seguridad-vial`
  - `decreto-779-1995-reglamentario-ley-24449`
  - `decreto-779-1995-anexo-l-senalizacion-vial-uniforme`
  - `ley-2148-caba-codigo-transito-transporte`
  - `ley-6631-caba-vtv-modificatoria-ley-2265`
  - `gcba-vtv-tramite-current`
  - `argentina-vehiculos-automotor-cedulas`
  - `dnrpa-registros-propiedad-automotor`
  - `ansv-cedula-azul-no-exigible`
  - `disposicion-29-2024-cedulas-identificacion`
  - `disposicion-343-2024-autorizacion-cedula-digital`
  - `argentina-duplicado-chapa-patente-automotor`
  - `gcba-guia-practica-siniestros-viales`
  - `gcba-material-estudio-examen-teorico`
  - `gcba-manual-vehiculo-4-ruedas-2023`
  - `gcba-mapa-estrellas-amarillas`
  - `ley-11179-codigo-penal`
  - `ley-26994-codigo-civil-comercial`
  - `ley-17418-seguros`
- Currentness/effective-status summary:
  - `currentness.validationStatus`: 19 `passed`.
  - `currentness.status`: 6 `current`, 4 `in_force`, 9 `valid_current_material`.
- Exact-text validation summary: 19 `exactTextValidation.status: "pending"`; 0 passed; 0 failed.
- Archive text baseline: 19 Markdown files under `content/official-documents/documents/`, about 37,148 `wc -l` lines, about 2,788,594 bytes / 2.7 MiB of UTF-8 text. Source-reader chunk inventory has not been generated in Slice A and remains pending for Slice C.
- Source-readiness decision: exact-text validation does not block preparatory docs/schema/chunking work, but it blocks any final or finished source-reader release claim. If a later UI shell is exposed before exact-text validation passes, it must be presented as non-final/preparatory and cannot satisfy the user's finished-section request without explicit Architect/user disposition.
- Final currentness gate remains pending for final release because future manifest entries may land before final validation, even though the Slice A implementation-time manifest has currentness validation passed for all 19 entries.
- Durable docs refreshed in Slice A:
  - `docs_project/project/content-sources.md` now describes the 19-entry archive, pending exact-text state, planned `Источники` reader, and archive/learner-content boundary.
  - `docs_project/project/frontend/frontend-docs.md` now records planned `Источники` behavior and states that it is not implemented yet.
  - `docs_project/project/feature-inventory.md` now describes the broader official archive and planned source reader without implying official full question-bank coverage.
  - `docs_project/screens/learning-and-exam-flows.md` now documents the planned `Источники` flow and its relationship to `Материалы`.
- Governance boundary recorded: original official source archive remains verbatim only; Russian full translations and simple rewrites must live outside `content/official-documents/`, preferably in a future governed `content/primary-sources/` area.

### Implementation Agent Feedback

- None yet.

### Verification Evidence

- Earlier Architect pass: no product tests were run because that pass created planning artifacts only.
- Slice A docs/process verification on 2026-05-10:
  - `pnpm run validate:content` passed. Output summary: `Content validation passed: 460 category B fallback questions, 276 local image references.`
  - `git diff --check` passed with no output.
  - `pnpm run build`, `pnpm run test:e2e`, and `pnpm run preflight` were not run for this docs/process-only slice.
- Additional Orchestrator verification after Slice A return:
  - `node scripts/check-feature-memory.mjs --worktree` passed. Output: `Feature-memory gate passed via specs/019-primary-sources-section/{spec,plan,tasks}.md`
  - `pnpm run test` passed: 72 Node tests, 72 pass, 0 fail.
  - `git diff --check` remained passed with no output.
- Conflict resolution pass on 2026-05-10:
  - Fetched and merged `origin/main` at `578c618d02a45adffa9f2b18a9373495cf19ed8a` into `codex/016-primary-sources-section-intake`; merge commit remains pending for a human/Orchestrator to commit and push.
  - Resolved conflicts in `docs_project/project/feature-inventory.md` by preserving main's process-guide and validated-difficulty inventory entries plus PR #68's planned `Источники` reader and official-primary-source boundary note.
  - Resolved conflicts in `docs_project/screens/learning-and-exam-flows.md` by preserving main's CABA license process navigation/flow and PR #68's planned `Источники` navigation/flow.
  - No `content/official-documents/**`, Slice B/C primary-source validator/content files, or unrelated worktrees were manually edited during conflict resolution.
  - `git diff --check` passed with no output.
  - `pnpm run validate:content` passed. Output summary: `Difficulty labels validated: 460 questions, 38 topics.` and `Content validation passed: 460 category B fallback questions, 276 local image references.`
  - Initial `pnpm run test` exposed missing local dependencies (`ERR_MODULE_NOT_FOUND` for `typescript`); after `pnpm install --frozen-lockfile`, `pnpm run test` passed: 86 Node tests, 86 pass, 0 fail.
  - `pnpm run build` passed, including content validation, asset sync, Vite production build, and service-worker generation for 280 cached assets.
- PR #68 review follow-up on 2026-05-10:
  - Left final-head verification checklist tasks T130, T131, T135, and T136 open; Slice A command results remain historical process evidence only and do not satisfy final feature validation.
- PR #68 P2 rename follow-up on 2026-05-10:
  - Moved the active feature memory to `specs/019-primary-sources-section` to satisfy the current numeric-prefix rule after higher prefixes were present on the base branch.
  - Updated durable docs and feature memory references to use `019-primary-sources-section`.
  - Retained assigned worktree `/Users/chap/devel/cabadrive-016-primary-sources-section` and branch `codex/016-primary-sources-section-intake` as historical implementation labels, not feature-folder references.
  - Preserved open final-head verification tasks T130, T131, T135, and T136.
  - The requested old-id reference scan over `docs_project` and the current feature folder returned only the retained historical worktree/branch labels.
  - `pnpm run validate:content` passed. Output summary: `Difficulty labels validated: 460 questions, 38 topics.` and `Content validation passed: 460 category B fallback questions, 276 local image references.`
  - `pnpm run test` passed: 112 Node tests, 112 pass, 0 fail.
  - `pnpm run build` passed, including content validation, asset sync, Vite production build, and service-worker generation for 280 cached assets.
  - `git diff --check` passed with no output.
- Main refresh pass on 2026-05-10:
  - Fetched and merged `origin/main` at `65624107d856653e503e3f03fd1d51da83992984` into `codex/016-primary-sources-section-intake` while preserving PR #68 feature memory and open final-head verification tasks T130, T131, T135, and T136.
  - Resolved `docs_project/project/feature-inventory.md` by keeping current main learning-content polish wording and PR #68's planned `Источники` reader inventory entry plus official-primary-source boundary note.
  - `pnpm run validate:content` passed. Output summary: `Difficulty labels validated: 460 questions, 38 topics.` and `Content validation passed: 460 category B fallback questions, 276 local image references.`
  - `pnpm run test` passed: 88 Node tests, 88 pass, 0 fail.
  - `pnpm run build` passed, including content validation, asset sync, Vite production build, and service-worker generation for 280 cached assets.
  - `git diff --check` passed with no output.
- Main refresh pass on 2026-05-10 for image metadata support:
  - Fetched and merged `origin/main` at `78e0176e361eeea583dd797296bfa994b3f1f695` into `codex/016-primary-sources-section-intake` while preserving PR #68 docs/spec/process additions and open final-head verification tasks T130, T131, T135, and T136.
  - Resolved `docs_project/project/content-sources.md` by keeping current main ticket learning-support/image-metadata lifecycle guidance and PR #68's 19-entry official archive/currentness/exact-text primary-source documentation.
  - Resolved `docs_project/project/feature-inventory.md` by keeping current main image metadata coverage notes and PR #68's planned `Источники` reader inventory entry plus official-primary-source boundary note.
  - `pnpm run validate:content` passed. Output summary: `Difficulty labels validated: 460 questions, 38 topics.` and `Content validation passed: 460 category B fallback questions, 276 local image references.`
  - `pnpm run test` passed: 112 Node tests, 112 pass, 0 fail.
  - `pnpm run build` passed, including content validation, asset sync, Vite production build, and service-worker generation for 280 cached assets.
  - `git diff --check` passed with no output.
