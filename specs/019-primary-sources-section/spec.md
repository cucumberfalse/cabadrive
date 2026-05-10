# Spec: Primary Sources Section

## Analyst Intake

- Source request: `feature-request.md`.
- Assigned feature: `019-primary-sources-section`.
- Assigned worktree: `/Users/chap/devel/cabadrive-016-primary-sources-section` (historical implementation label retained after feature-memory rename).
- Assigned branch: `codex/016-primary-sources-section-intake` (historical implementation label retained after feature-memory rename).
- Architect scope: feature memory only. This pass may create or update only `spec.md`, `plan.md`, and `tasks.md` in this feature folder. Product code, tests, content, durable docs, official archive files, commits, pushes, PRs, and review output are out of scope for this Architect pass.

## Context Reviewed

- Cabadrive constitution and durable project docs.
- Existing `Материалы` topic-study-guide behavior from feature 008 context.
- Official archive governance in `content/official-documents/AGENTS.md`.
- Current official manifest shape in `content/official-documents/manifest.json`.
- Feature 010 UI/learning source-of-truth materials from `/Users/chap/devel/cabadrive-010-ui-ux-learning-intake`.
- Official Apple and Google guidance:
  - Apple Human Interface Guidelines, Layout and Accessibility.
  - Google Android Developers Material Components, window size classes, responsive navigation, and search interface guidance.

## Goal

Add a finished learner-facing `Источники` / official primary-sources section that covers every official source document in the implementation-time `content/official-documents/manifest.json`, defaults to a schoolchild-friendly Russian rewrite, and lets the learner inspect the full Russian translation and original Spanish text for each document, section, and chunk.

The feature must preserve Cabadrive's source-governance boundary: the Spanish archive remains the official/verbatim source layer, while Russian translations and simplified Russian explanations are unofficial learning support stored outside `content/official-documents/`.

## Scope

In scope for implementation:

- Build a distinct source-reader section separate from the existing topic `Материалы` guide, with a clear navigation label such as `Источники`.
- Cover every manifest entry present when implementation begins and every entry present at final validation time.
- Chunk each official document by stable official structure: articles, chapters, annex sections, headings, pages, or service-page sections as applicable.
- Provide for every chunk:
  - original Spanish official text;
  - high-quality full Russian translation;
  - schoolchild-friendly simple Russian rewrite;
  - stable mapping back to the official source document and source chunk.
- Default the UI to simple Russian.
- Provide explicit view controls for `Просто`, `Полный перевод`, and `Оригинал ES`.
- Omit simplified Spanish entirely.
- Add source metadata and trust/status information in compact learner language.
- Add search and filters across source titles, metadata, simple Russian, full Russian translation, and original Spanish.
- Handle long laws/codes/manuals through chunked navigation, progressive disclosure, and responsive list-detail layout.
- Preserve local-first/offline behavior: bundled content only, no runtime network fetch, backend API, live AI, analytics, or raw PDF viewer.
- Add validation proving whole-manifest and whole-chunk coverage.
- Add validation proving Russian content is outside `content/official-documents/`.
- Add translation and simplification QA evidence strong enough for a finished section, not a machine-only draft.
- Add durable docs updates for source behavior, content governance, UI/navigation, and validation gates.
- Record implementation decisions, dead ends, known issues, and verification evidence in this feature memory.

## Non-Goals

- Do not edit official archived documents while implementing translation or simplification.
- Do not put Russian translation, simplification, summaries, or learner notes inside `content/official-documents/`.
- Do not create simplified Spanish.
- Do not turn Cabadrive into a general legal encyclopedia or broad Spanish course.
- Do not replace the current topic `Материалы` section or the compact `CABA/RF` guide.
- Do not claim the current practice questions are a complete official GCBA category B question bank.
- Do not rely on runtime PDF viewing, remote pages, cloud services, or a backend.
- Do not publish a partial/MVP source section as complete.

## Assumptions

- The implementation-time manifest is the source of truth for which primary sources must be included.
- The manifest currently has 19 entries and about 37k Markdown lines; final validation must not hard-code that count.
- Current observed manifest entries all have `currentness.validationStatus: "passed"` and `exactTextValidation.status: "pending"`.
- A finished release requires an explicit source-readiness decision. The preferred gate is that every included manifest entry has currentness/effective-status validation passed and exact-text validation passed before the source section is declared complete.
- If exact-text validation remains pending or failed for any included entry, the implementation may land preparatory slices but the final whole-corpus release gate must block unless the Orchestrator obtains an explicit Architect/user disposition for a narrower non-final status. The user's request is for a finished section, so a partial release exception is not the default.
- Russian translations and simplified rewrites should live under a new governed learner-content area outside the official archive, with a preferred path such as `content/primary-sources/`.
- Original Spanish shown in the UI may be generated from archived Markdown into UI-ready chunks, but any duplication must be generated and fingerprint-validated against the official archive, not hand-maintained.
- The source reader is passive/reference learning support, not an active exam attempt, so default simple Russian does not contradict the exam-mode rule that active exams hide support.
- Feature 010 materials are context only in this Architect pass; this feature must not modify the feature 010 worktree.

## User Stories

### User Story 1

As a Russian-speaking learner with low Spanish proficiency, I want to open a dedicated `Источники` section and read the rules in simple Russian first, so that I can understand the official material without starting from legal Spanish.

### User Story 2

As a learner who wants accuracy, I want to switch any source chunk from simple Russian to the full Russian translation, so that I can see the exact meaning behind the simplified explanation.

### User Story 3

As a learner checking the official wording, I want to switch any source chunk to the original Spanish, so that I can confirm the source text and learn exam/legal vocabulary.

### User Story 4

As a learner studying long laws and manuals, I want search, filters, and a chunked table of contents, so that I can find a relevant article or section without scrolling through thousands of lines.

### User Story 5

As a maintainer, I want validators that prove every manifest document and every source chunk has original Spanish, full Russian translation, and simple Russian rewrite coverage, so that a partial corpus cannot accidentally ship as finished.

### User Story 6

As a reviewer, I want QA metadata and source alignment evidence for translation and simplification, so that the Russian text is not treated as trustworthy merely because it exists.

## Acceptance Criteria

1. Given implementation starts, the implementation records the current manifest entry count and IDs from `content/official-documents/manifest.json`.
2. Given final validation runs, the source-section validator fails if any implementation-time manifest entry is missing from the learner source corpus.
3. Given final validation runs after new manifest entries are added, the validator fails until the learner source corpus covers the new entries too or the feature memory records an explicit Architect disposition.
4. Given any included official document, every generated source chunk has a stable chunk ID, source document ID, source order, source structure label where available, original Spanish text reference, full Russian translation, and simple Russian rewrite.
5. Given any generated source chunk, validation fails if the full Russian translation is missing, empty, placeholder text, or marked below approved/release-ready QA status.
6. Given any generated source chunk, validation fails if the simple Russian rewrite is missing, empty, placeholder text, or marked below approved/release-ready QA status.
7. Given any learner source corpus file, validation fails if translation or simplification content is stored under `content/official-documents/`.
8. Given the app opens the source section, the default visible chunk text is simple Russian.
9. Given a learner opens a document, document-level and chunk-level controls allow switching to full Russian translation.
10. Given a learner opens a document, document-level and chunk-level controls allow switching to original Spanish.
11. Given a learner switches view modes, the UI does not offer or render simplified Spanish.
12. Given source metadata is visible, the UI identifies the original Spanish archive as the official source layer and Russian text as unofficial learning support.
13. Given manifest currentness or exact-text status is not release-ready, the UI and process memory do not hide that state; final release is blocked unless explicitly disposed.
14. Given a long document such as the civil/commercial code, CABA traffic code, Anexo L, or the GCBA manual is opened, the UI exposes chunk navigation and avoids rendering an unusable monolithic page.
15. Given the source list is visible, search can find matches in document title/metadata, simple Russian, full Russian translation, and original Spanish.
16. Given filters are used, the learner can narrow by at least practical category and jurisdiction/source type.
17. Given search or filtering returns no results, the UI shows a local, truthful empty state without implying missing network data.
18. Given the app is built and served locally, the source section works without runtime network requests, backend endpoints, remote images, live AI, or raw PDF viewer.
19. Given durable docs are reviewed, they describe the new source-reader behavior, the Russian-content location, validation expectations, and the rule that the official archive remains verbatim-only.
20. Given implementation is complete, tests cover default simple-Russian rendering, view-mode switching, original Spanish access, search/filtering, responsive behavior, accessibility-critical controls, and no runtime network/PDF dependency.
21. Given local verification runs, `pnpm run validate:content`, `pnpm run test`, `pnpm run build`, `pnpm run test:e2e`, `pnpm run preflight`, and `git diff --check` pass or exact unrelated blockers are recorded.
22. Given process memory is inspected, `tasks.md` records corpus inventory, chunking decisions, translation QA, simplification QA, validation evidence, UI evidence, known issues, and final release-gate status.

## Negative Scenarios

- A source section covering only selected popular documents fails this feature.
- A source section that exposes documents but omits chunk-level Russian translation or simple Russian rewrite fails this feature.
- A source section that defaults to Spanish or full legal translation instead of simple Russian fails the default-UI requirement.
- A UI that shows only document-level source text but cannot inspect individual chunks/articles/sections fails for long documents.
- A corpus that stores Russian translation or simplification inside `content/official-documents/` violates archive governance.
- A solution that copies original Spanish by hand into a learner file without fingerprint/source alignment validation is not acceptable.
- A machine-only translation pass without review/QA metadata is not acceptable for the requested finished quality level.
- A simplified rewrite that adds unsupported legal advice, changes legal meaning, or hides exceptions is not acceptable.
- A source reader that looks official for Russian text without clearly labeling it as unofficial support is not acceptable.
- A UI that requires internet access, runtime PDF loading, live translation, or a backend violates the local-first contract.
- A partial source UI hidden behind "coming soon" cards does not satisfy the user's request.
- A PR that changes unrelated learning/exam behavior or claims official full question-bank coverage is out of scope.

## Functional Requirements

- FR-001: Introduce a learner-source content layer outside `content/official-documents/`.
- FR-002: Add a machine-readable corpus artifact mapping every official manifest entry to learner-facing source data.
- FR-003: Add a machine-readable chunk inventory derived from official archive Markdown.
- FR-004: Generate or maintain stable chunk IDs that survive ordinary text edits when the source structure remains stable.
- FR-005: Preserve official document ordering and chunk ordering in the learner source corpus.
- FR-006: Store or generate full Russian translation for every chunk.
- FR-007: Store or generate simple Russian rewrite for every chunk.
- FR-008: Store QA metadata for translation and simplification, including status, reviewer/method notes, and checked-at date.
- FR-009: Store source alignment metadata for every chunk, such as source path, source hash/fingerprint, heading path, and line/span evidence where practical.
- FR-010: Add validators for manifest coverage, chunk coverage, source alignment, QA status, and forbidden archive placement.
- FR-011: Integrate source-section validation into the existing content/preflight validation path before final release.
- FR-012: Add a distinct app view for official primary sources.
- FR-013: Add navigation for the source view, preferred label `Источники`; if navigation crowding requires grouping, the source section must remain visibly distinct from topic `Материалы`.
- FR-014: Render an adaptive source list/detail layout.
- FR-015: Render source list entries with title, short label, category, jurisdiction/source type, and compact validation/source status.
- FR-016: Render document detail with metadata, table of contents/chunk navigation, and selected chunk text.
- FR-017: Default document and chunk text to simple Russian.
- FR-018: Provide explicit view controls for simple Russian, full Russian translation, and original Spanish.
- FR-019: Preserve selected document/chunk/search context when switching view modes.
- FR-020: Provide local search over source title, metadata, simple Russian, full Russian translation, and original Spanish.
- FR-021: Provide filters for practical category and jurisdiction/source type at minimum.
- FR-022: Avoid rendering very large documents as a single unchunked DOM surface.
- FR-023: Use local bundled data and assets only.
- FR-024: Keep active exam attempt behavior unchanged.
- FR-025: Update durable docs for the new source section and content governance.
- FR-026: Keep process memory current in `tasks.md`.

## Data And Content Model Requirements

Preferred learner-content path:

```text
content/primary-sources/
  AGENTS.md
  primary-sources.ru.json
  primary-sources.coverage.json
  primary-sources.qa.json
  primary-sources.search.json
```

The exact file split may change during implementation if the Implementation Agent records the reason and Architect disposes it, but all Russian learner text must remain outside `content/official-documents/`.

Minimum document shape:

```ts
type PrimarySourceDocument = {
  officialDocumentId: string;
  title: string;
  shortTitleRu: string;
  category: string;
  jurisdiction: "caba" | "national" | "other";
  officialSourceType: string;
  sourceUrl: string;
  archiveLocalPath: string;
  retrievalDate: string;
  currentnessStatus: string;
  currentnessValidationStatus: "pending" | "passed" | "failed";
  exactTextValidationStatus: "pending" | "passed" | "failed";
  chunks: PrimarySourceChunk[];
};
```

Minimum chunk shape:

```ts
type PrimarySourceChunk = {
  chunkId: string;
  officialDocumentId: string;
  order: number;
  headingPath: string[];
  officialLabel?: string;
  originalSpanish: string;
  fullTranslationRu: string;
  simpleRu: string;
  sourceFingerprint: string;
  translationQa: QaRecord;
  simplificationQa: QaRecord;
};
```

Minimum QA shape:

```ts
type QaRecord = {
  status: "draft" | "reviewed" | "approved";
  checkedAt?: string;
  methodNotes: string;
  reviewerNotes?: string;
};
```

Validation may use generated line spans, structural fingerprints, or content hashes instead of storing full original Spanish in the learner file, but the UI must be able to display the full original Spanish for every chunk offline.

Content standards:

- Full Russian translation preserves legal meaning, conditionals, exceptions, numbers, dates, article references, and institutional names.
- Simple Russian uses short sentences and schoolchild-friendly wording while preserving meaning and not adding advice unsupported by the source.
- Simple Russian may explain vocabulary but must not remove obligations, exceptions, penalties, or scope limits.
- Russian text must mark uncertainty or source conflicts plainly rather than smoothing over them.
- Glossary/terminology decisions should be consistent with existing Cabadrive canonical wording.

## Validation Requirements

- VR-001: Validate the official manifest can be read and all required metadata exists.
- VR-002: Validate every manifest entry has a learner document entry.
- VR-003: Validate no learner document entry references a missing manifest entry.
- VR-004: Validate every archived document produces at least one chunk and every produced chunk is represented in the learner corpus.
- VR-005: Validate chunk order and source fingerprints against current archive Markdown.
- VR-006: Validate every chunk has nonempty original Spanish access, full Russian translation, and simple Russian rewrite.
- VR-007: Validate every translation and simplification QA record is `approved` for final release.
- VR-008: Validate Russian learner text files are not under `content/official-documents/`.
- VR-009: Validate no simplified Spanish field is introduced.
- VR-010: Validate final release has no included manifest entry with failed currentness/exact-text status.
- VR-011: Validate final release blocks on pending exact-text status unless process memory records explicit non-final disposition.
- VR-012: Validate source search index, if generated, references existing document/chunk IDs only.
- VR-013: Validate UI build can import bundled source content without runtime network access.
- VR-014: Integrate the final validator with `pnpm run validate:content` and `pnpm run preflight`.

## UI/UX Requirements

- UXR-001: The source section must be a usable app surface as the first screen, not a landing page.
- UXR-002: Keep the source section visually and navigationally distinct from topic `Материалы`.
- UXR-003: Use an adaptive list-detail/source-reader layout:
  - compact width: list/search first, detail replaces or follows with a clear back-to-list control;
  - expanded width: persistent source list/filter pane and detail reader side by side.
- UXR-004: Use search as a primary tool, with clear hint text and actual-result suggestions if implemented.
- UXR-005: Use filters as chips/segmented controls or equivalent familiar selection controls.
- UXR-006: Use segmented controls or tabs for `Просто`, `Полный перевод`, and `Оригинал ES`.
- UXR-007: Keep simple Russian as the default selected view on first load and when opening a new document.
- UXR-008: Make source metadata visible but compact: official title, source type/jurisdiction, retrieval date, currentness status, exact-text status, and source URL/archive reference.
- UXR-009: Use progressive disclosure for long documents: document overview, table of contents, chunk sections, and optional full-text expansion.
- UXR-010: Do not place cards inside cards; use full-width bands, panes, list rows, sections, and repeated cards only where they represent individual sources/chunks.
- UXR-011: Keep cards/panels at 8px radius or less unless the existing design system changes.
- UXR-012: Text must wrap cleanly on mobile and desktop; do not scale font size with viewport width or use negative letter spacing.
- UXR-013: Controls must have stable accessible names, visible focus states, keyboard reachability, and predictable focus order.
- UXR-014: Do not rely on color alone for status; combine text/icon/shape where status matters.
- UXR-015: Preserve local-first behavior and show truthful local fallback states for missing optional content.
- UXR-016: Follow feature 010 rules UI-001, UI-007, UI-008, UI-009, UI-011, UI-012 and LEARN-014/LEARN-015.

## Industry Guidance Applied

- Apple Layout supports adaptive layouts, familiar relationships between controls and content, and progressive disclosure for hidden content. This maps to a source reader with stable list/detail navigation and chunk expansion.
- Apple Accessibility emphasizes readable text, contrast, sufficiently sized controls, simple interactions, gesture alternatives, keyboard access, and minimizing cognitive complexity. This maps to default simple Russian, explicit controls, visible focus, and no hidden gesture-only affordances.
- Google Material Components group controls by purpose: navigation, selection, text input/search, containment, and action. This maps to source list navigation, filter chips/segmented controls, search input, metadata/status containers, and explicit view actions.
- Google responsive navigation guidance names list-detail as a canonical adaptive pattern: one pane on compact screens and side-by-side panes on expanded screens. This is the primary UI architecture.
- Google search guidance supports visible search widgets, hints that explain searchable content, and suggestions from actual app data. This maps to local corpus search across Russian and Spanish source text.

## Review Requirements

- Review Agent must verify complete feature memory exists before implementation changes.
- Review Agent must verify Russian translation/simplification files are outside `content/official-documents/`.
- Review Agent must verify official archive files are not rewritten for learner prose.
- Review Agent must verify validators fail on missing manifest entries, missing chunks, missing translations, missing simplifications, and forbidden simplified Spanish.
- Review Agent must verify final release is not marked complete while exact-text/currentness blockers remain unresolved.
- Review Agent must verify source UI defaults to simple Russian and offers full Russian/original Spanish controls.
- Review Agent must verify no simplified Spanish UI/data path exists.
- Review Agent must verify search/filter/detail behavior is tested.
- Review Agent must verify responsive and keyboard/accessibility evidence exists.
- Review Agent must verify no runtime network fetch, backend dependency, raw PDF viewer, live AI, analytics, or remote asset is introduced.
- Review Agent must verify durable docs and `tasks.md` process memory are current before merge readiness.
