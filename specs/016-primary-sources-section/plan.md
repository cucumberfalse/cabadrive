# Plan: Primary Sources Section

## Summary

Implement feature 016 as a corpus-wide source-reader program, not a small tab. The final product must expose every current official source document through a local, searchable, adaptive reader that defaults to simple Russian and provides full Russian translation plus original Spanish for every chunk.

Because the corpus is large and exact-text validation is currently pending, implementation should be decomposed into several PR-sized slices. Intermediate slices may create schemas, validators, chunk inventories, content batches, and UI behind incomplete data, but the final release gate must prove whole-manifest and whole-chunk coverage before the section is declared complete.

This Architect pass only creates feature memory. It does not edit product code, tests, content, durable docs, official archive files, commits, pushes, or PRs.

## Technical Context

- Frontend: static React + TypeScript + Vite SPA.
- Runtime: Docker-served static build; no backend in MVP.
- Current app data is bundled locally and validated by Node scripts.
- Current `Материалы` section renders the topic study guide as unofficial support.
- Official source documents are archived verbatim under `content/official-documents/`.
- `content/official-documents/AGENTS.md` forbids translation, simplification, paraphrase, or editorial rewriting inside the archive.
- Current manifest observation during Architect pass:
  - 19 entries.
  - all `currentness.validationStatus` values are `passed`.
  - all `exactTextValidation.status` values are `pending`.
  - archived Markdown totals about 37k lines.
- Large documents include Ley 24.449, CABA Ley 2148, Anexo L signage, the GCBA four-wheel manual, Código Penal, Código Civil y Comercial, and Ley de Seguros.
- Feature 010 UI rules emphasize visible source/status boundaries, local assets, mobile-first dense study surfaces, keyboard/focus behavior, and no runtime network dependencies.

## Constitution Check

- Spec-first: yes. `feature-request.md` exists, and this pass creates `spec.md`, `plan.md`, and `tasks.md` before implementation.
- Testable boundaries: yes. Manifest coverage, chunk coverage, source fingerprints, QA metadata, search index integrity, and UI mode behavior can be tested without external services.
- Test-first bias: yes. Each implementation slice should add validators/tests before or alongside content/UI changes.
- Supervised verification: yes. Final release requires evidence for every acceptance criterion, not only a summary.
- PR-only workflow: yes. Orchestrator must assign isolated implementation worktrees/branches and one PR per slice.
- One worktree per task: yes. Parallel content/UI slices must not share mutable working directories.
- Deployability: yes. The app remains static/local-first and Docker-only.
- Simplicity: yes. Prefer structured JSON plus local validators and existing React patterns before adding routing, databases, or heavy search dependencies.
- Process memory: yes. `tasks.md` must record decisions, blockers, QA evidence, and implementation feedback.

## Architect Decisions

### Source Section Is Distinct From Topic Materials

Use a distinct navigation concept, preferred label `Источники`. The existing `Материалы` section is the topic study guide and should not become a legal archive browser. If compact navigation becomes crowded, implementation may group both under a broader materials area only if the source section remains a clearly labeled sub-destination such as `Официальные источники` and e2e tests prove direct reachability.

### Final Release Requires Whole-Corpus Coverage

The user's request explicitly rejects an MVP/partial subset. Intermediate PRs may be partial only as preparation and must not present the feature as complete. The final release gate must validate all manifest documents and all generated chunks.

### Exact-Text Readiness Is A Release Gate

The observed manifest has exact-text validation pending for all entries. The implementation plan must include a source-readiness slice. A finished release should require `exactTextValidation.status: "passed"` and currentness/effective-status validation passed for every included manifest entry. If this cannot be achieved, Orchestrator must route a blocker/disposition before final release.

### Learner Russian Content Lives Outside The Archive

Preferred path is `content/primary-sources/`. Add a local `AGENTS.md` there during implementation to define translation/simplification rules and to point back to the official archive as read-only/verbatim source. Do not store learner Russian text in `content/official-documents/`.

### Chunking Is Structural, Not Arbitrary

Chunk by official structure where possible:

- laws/codes: titles, chapters, sections, articles, annex headings;
- signage annex/manuals: chapters, signal groups, sign codes, figures/captions, page/section headings;
- service/procedure pages: headings, requirement blocks, steps, fee/status sections;
- PDF-derived guides/manuals: page/section headings and stable paragraph groups.

If a source lacks stable headings, use generated paragraph groups with source line spans and fingerprints, and record the decision.

### Translation Quality Needs QA Metadata

High quality cannot be inferred from text existence. Each chunk needs QA status for full translation and simple rewrite. Final release requires approved status, method notes, and reviewer notes sufficient for review. Automated lint can catch placeholders and missing fields, but review/QA evidence is required for semantic quality.

### Original Spanish Access Should Be Archive-Derived

The UI can display original Spanish from generated chunk data, but those chunks must be generated from archive Markdown and fingerprinted. Manual duplicate Spanish learner files are a drift risk and should fail validation unless generated evidence proves alignment.

### UI Uses Adaptive List-Detail Source Reader

Adopt a list-detail reader:

- compact/mobile: searchable source list; selecting a source opens detail with a back/list control;
- desktop/expanded: source list/filter pane and detail reader side by side;
- long documents: in-detail table of contents and chunk navigation.

This aligns with Apple adaptive/progressive-disclosure guidance and Google list-detail/window-size guidance.

### View Controls Are Simple And Explicit

Use segmented controls/tabs for `Просто`, `Полный перевод`, and `Оригинал ES`. Default to `Просто` whenever opening a new document/chunk. Allow per-chunk expansion or local view override when useful, but the global reader mode must remain understandable.

## Implementation Strategy

### Slice A: Source Readiness And Docs Refresh

1. Re-read the implementation-time manifest and official archive rules.
2. Refresh durable docs that are already stale about official source count and source-reader behavior.
3. Decide and record whether exact-text validation must be completed before any UI exposure or only before final release.
4. Complete or schedule exact-text validation/currentness readiness work for every manifest entry.
5. Add/update source archive process memory with blockers, without translating inside the archive.

### Slice B: Learner Source Schema And Validators

1. Create the new learner source content area outside `content/official-documents/`.
2. Add local instructions for translation/simplification governance.
3. Define JSON schema/types for source corpus, documents, chunks, QA metadata, coverage, and search index.
4. Add validators for manifest coverage, chunk coverage, source alignment, QA status, forbidden path placement, and no simplified Spanish fields.
5. Integrate validators with `pnpm run validate:content` in draft/strict modes:
   - draft mode may allow partial content for content-authoring PRs;
   - strict/final mode fails partial coverage and non-approved QA.

### Slice C: Corpus Inventory And Chunking

1. Generate or author a complete chunk inventory for every manifest entry.
2. Preserve document order and heading structure.
3. Add source fingerprints/line spans or equivalent evidence for every chunk.
4. Validate the chunk inventory against current archive Markdown.
5. Record chunking decisions for documents with weak structure or PDF conversion limitations.

### Slices D-H: Translation And Simplification Content Batches

Author content in reviewable batches while keeping final release blocked until every batch is complete. Suggested batching:

- Core traffic law and CABA code: Ley 24.449, Decreto 779 main text, Ley 2148.
- Signage and driving study materials: Anexo L, GCBA manual, GCBA study-material page.
- Vehicle/document/administrative procedures: VTV, Ley 6631, vehicle/cédula/chapa/DNRPA/ANSV materials.
- Incident, road-safety, and insurance/legal duties: siniestros guide, Estrellas Amarillas, Código Penal, Código Civil y Comercial, Ley de Seguros.
- Any new manifest entries added before final validation.

Each content batch must:

1. Translate every chunk in the batch into full Russian.
2. Rewrite every chunk in simple Russian.
3. Run placeholder/completeness/source-fingerprint validation.
4. Run translation QA and simplification QA to approved status for the batch.
5. Record terminology decisions and source conflicts in process memory.
6. Avoid editing the official archive except for separately assigned source-validation work.

### Slice I: Source Reader UI Shell

1. Import validated learner-source data through the existing app data boundary.
2. Add a distinct app view and navigation label.
3. Render source list, compact metadata, status labels, and selected document detail.
4. Default detail text to simple Russian.
5. Preserve existing learn/exam/mistakes/vocabulary/materials/CABA-RF flows.
6. Keep active exam behavior unchanged.

### Slice J: Search, Filters, Detail Controls

1. Build local search over titles, metadata, simple Russian, full Russian, and Spanish.
2. Add filters by category and jurisdiction/source type.
3. Add document/chunk table of contents.
4. Add view controls for simple Russian, full Russian, and Spanish original.
5. Ensure long documents do not render tens of thousands of lines at once.
6. Add no-results and missing-content states that are truthful and local.

### Slice K: Responsive, Accessibility, And E2E Hardening

1. Add responsive layout tests for compact and desktop widths.
2. Add keyboard/focus tests for search, filters, source selection, table of contents, and view controls.
3. Add accessibility checks for labels, focus states, and status text not relying only on color.
4. Add Playwright request monitoring to prove no runtime network/PDF dependency.
5. Add tests for default simple Russian and switching to full Russian/original Spanish.

### Slice L: Final Whole-Corpus Release Gate

1. Re-run manifest inventory at final head.
2. Re-run exact-text/currentness validators.
3. Re-run whole-corpus translation/simplification validators in strict mode.
4. Re-run search index and UI tests.
5. Re-run full preflight.
6. Confirm durable docs and process memory are current.
7. Block merge readiness unless every manifest entry and every chunk is covered with approved QA and release-ready source status.

## Suggested File Areas For Implementation

Implementation will likely touch:

```text
content/primary-sources/
scripts/primary-sources-*.mjs
scripts/validate-content.mjs
src/data/content.ts
src/App.tsx
src/styles.css
tests/*primary-source*.test.mjs
tests/e2e/app.spec.ts
docs_project/project/content-sources.md
docs_project/project/frontend/frontend-docs.md
docs_project/project/feature-inventory.md
docs_project/screens/learning-and-exam-flows.md
specs/016-primary-sources-section/tasks.md
```

Implementation must not store learner Russian content in:

```text
content/official-documents/
```

Official archive updates are allowed only in separately assigned source-validation slices and must preserve the archive's verbatim rules.

## Data Model Plan

Use three conceptual layers:

1. Official archive layer: `content/official-documents/manifest.json` plus archived Markdown/original evidence. Verbatim Spanish source of truth.
2. Learner source corpus: Russian translation, simple Russian rewrite, chunk mapping, QA metadata, and learner categories.
3. UI/search projection: compact data imported by Vite for list/detail/search rendering.

Validators should compare all three:

- manifest entry IDs versus learner document IDs;
- archive-derived chunks versus learner chunk records;
- learner chunk IDs versus search index entries;
- QA status versus final release mode.

## UI Plan

Source list:

- search field with hint such as `Искать по источникам, правилам, статьям`;
- filter controls for category and jurisdiction/source type;
- source rows with short title, category, status, and matched result count when searching.

Document detail:

- compact source metadata header;
- visible trust label: original Spanish is official, Russian is unofficial learning support;
- view selector: `Просто`, `Полный перевод`, `Оригинал ES`;
- table of contents/chunk navigation;
- chunk reader with heading path, source label/article number, and selected text;
- optional per-chunk controls to compare translation/original without changing the whole reader;
- local empty/missing states that point to validation blockers, not network retries.

Responsive behavior:

- mobile: list and detail are sequential states with back/list affordance;
- tablet/desktop: list/filter pane and detail pane side by side;
- long documents: table of contents remains usable without sticky elements overlapping text.

Accessibility behavior:

- all controls reachable by keyboard;
- focus order follows list/search/detail reading order;
- view controls have clear accessible names;
- status is conveyed by text plus visual treatment;
- touch targets are sized and spaced for repeated use.

## Test And Verification Matrix

| Area | Evidence |
| --- | --- |
| Feature memory | `feature-request.md`, `spec.md`, `plan.md`, and `tasks.md` exist before implementation. |
| Manifest coverage | Validator proves every final manifest entry has a learner document. |
| Chunk coverage | Validator proves every generated chunk has Spanish access, full Russian, and simple Russian. |
| QA | Validator proves translation/simplification QA status is approved for final release. |
| Archive boundary | Validator and review prove no Russian learner text lives under `content/official-documents/`. |
| Source readiness | Exact-text/currentness readiness evidence is recorded and final blocker state is resolved. |
| UI default | E2E proves source detail opens in simple Russian by default. |
| View switching | E2E proves full Russian and original Spanish are available for selected chunks/documents. |
| No simplified Spanish | Validator and UI tests prove no simplified Spanish path exists. |
| Search/filter | E2E or unit tests prove search and filters narrow the local corpus. |
| Long docs | E2E/DOM evidence proves long documents use chunk navigation and do not render as one huge page. |
| Responsive | Playwright desktop/mobile evidence covers list/detail behavior. |
| Accessibility | Keyboard/focus and accessible-label evidence covers source controls. |
| Local-first | Playwright request monitoring/code review proves no runtime network, backend, live AI, or PDF viewer. |
| Preflight | `pnpm run preflight` and `git diff --check` pass or exact unrelated blockers are recorded. |

## Risks And Mitigations

- Risk: Exact-text validation remains pending and blocks final release.
  - Mitigation: handle source readiness as an early slice and stop final release until resolved.
- Risk: Corpus size makes one PR unreviewable.
  - Mitigation: batch content by source family while keeping validators aware of draft versus strict final mode.
- Risk: Translation quality is uneven.
  - Mitigation: require QA metadata, terminology consistency checks, and reviewer notes before strict final mode passes.
- Risk: Simple rewrites change legal meaning.
  - Mitigation: simplification QA must check fidelity, exceptions, numbers, and obligations against the full translation/original.
- Risk: Original Spanish drifts from the archive.
  - Mitigation: generate/fingerprint Spanish chunks from archive Markdown and validate them on every preflight.
- Risk: UI becomes a raw legal dump.
  - Mitigation: default to simple Russian, chunk long docs, use search/filter, compact metadata, and progressive disclosure.
- Risk: New navigation crowds the app.
  - Mitigation: prefer short `Источники` label; if grouping is necessary, preserve direct distinct source destination and test it.
- Risk: Content bundle becomes large.
  - Mitigation: measure build size, consider generated search summaries and lazy in-app chunk loading from local static assets only if needed; do not introduce a backend.

## Handoff To Implementation

Implementation Agents must not begin product/content work until all four feature memory files exist. Each implementation slice must use an assigned isolated worktree and branch, keep `tasks.md` current, and stop for Orchestrator/Architect disposition if it needs to weaken whole-corpus coverage, release with pending exact-text validation, store Russian text in the official archive, or introduce runtime network/backend behavior.
