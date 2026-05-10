# Feature Request: Primary Sources Section

## Analyst Artifact Status

Created by Analyst intake on 2026-05-10 for a repository-changing feature request.

This is the only file written by this Analyst pass. Code, tests, durable docs, specs, plans, tasks, commits, pushes, PRs, and review output are for later roles.

## Numbering Note

PR #68 review identified that the feature memory must use the next available numeric prefix after the feature folders already present on the base branch. The current feature memory path is:

```text
specs/019-primary-sources-section/
```

## Original User Request

The user request was in Russian and asked for a finished primary-sources section containing all official source texts already expected to be in the project, especially rules and laws.

The requested section must:

- cover all texts from all primary sources, not an MVP subset;
- include high-quality Russian translations for every item;
- include a simple schoolchild-friendly Russian rewrite for every item;
- default the UI to the simple Russian text;
- let the user view the full Russian text for each item;
- let the user view the full original Spanish text for each item;
- omit simplified Spanish;
- use project material and Apple/Google industry guidance to analyze the best UI approach;
- ask questions immediately if any blocking questions exist.

No blocking clarification is required for Analyst intake. Ambiguities are recorded below as assumptions and open questions for Architect.

## Project Context Reviewed

Required memory read:

- `.specify/memory/constitution.md`
- `docs_project/README.md`
- `docs_project/project-idea.md`
- `docs_project/project/frontend/frontend-docs.md`
- `docs_project/project/backend/backend-docs.md`
- `docs_project/project/feature-inventory.md`
- `docs_project/screens/learning-and-exam-flows.md`
- `docs/specify/README.md`

Additional relevant project material read:

- `docs_project/project/content-sources.md`
- `content/official-documents/AGENTS.md`
- `content/official-documents/manifest.json`
- `content/guide/topic-study-guide.ru.json`
- `content/guide/topic-study-guide.coverage.json`
- `content/guide/topic-study-guide.source-trace.json`
- `specs/004-source-scope-guard/feature-request.md`
- `specs/004-source-scope-guard/spec.md`
- `specs/006-topic-study-guide/feature-request.md`
- `specs/006-topic-study-guide/spec.md`
- `specs/006-topic-study-guide/tasks.md`
- `specs/008-learning-materials-ui/feature-request.md`
- `specs/008-learning-materials-ui/spec.md`
- `src/App.tsx`
- `src/data/content.ts`
- `src/styles.css`
- `tests/e2e/app.spec.ts`
- `scripts/official-documents-validation.mjs`

No active `specs/<feature-id>/spec.md`, `plan.md`, or `tasks.md` exists yet for this new request. Analyst must create only this intake artifact; Architect owns those files next.

## Current Repository State Observed

Cabadrive is a local-first static React/TypeScript/Vite web trainer for Russian-speaking drivers preparing for the CABA category B theory exam.

Relevant current behavior and constraints:

- The app is a static SPA/PWA with no backend in MVP.
- Runtime contract remains Docker-only: `make build`, `make up`, `make down`.
- Current question content mode is `unofficial_b_fallback`, not an official full GCBA category B question bank.
- Existing practice UI keeps Spanish question text primary and treats Russian translations/explanations as unofficial learning aids.
- Active exam attempts hide translation and explanation support.
- A `Материалы` section already renders the `006` topic study guide from structured JSON.
- The `Материалы` topic guide is currently `draft` and `unofficial_learning_aid`.
- Official source documents live in `content/official-documents/`.
- `content/official-documents/AGENTS.md` forbids translation, simplification, paraphrase, or editorial rewriting inside the archive itself.
- Russian translations, simplified rewrites, and learner-facing explanations derived from official sources must live outside `content/official-documents/`.
- The official-documents manifest remains `draft`.
- Currentness/effective-status checks in the manifest are `passed`, but exact-text validation is still `pending` for all observed entries.
- `specs/006-topic-study-guide/tasks.md` still has final whole-archive exact-text/currentness tasks open (`T074`, `T075`, `T077`).

Durable docs note: `docs_project/project/content-sources.md` is partially stale. It says the archive seeds a small bundle of three official sources, but the actual manifest now contains 19 entries. This feature should refresh durable docs before or with implementation planning where behavior/source coverage changes.

## Official Source Corpus Observed

The current `content/official-documents/manifest.json` contains 19 entries. For this request, "all official source texts already expected to be in the project" should mean every manifest entry present when implementation starts, not only entries cited by the topic guide and not only the three sources listed in older durable docs.

Observed entries:

1. `ley-24449-transito-seguridad-vial` — Ley 24449
2. `decreto-779-1995-reglamentario-ley-24449` — Decreto Reglamentario 779 / 1995
3. `decreto-779-1995-anexo-l-senalizacion-vial-uniforme` — DECRETO 779-95 ANEXO L - SISTEMA DE SENALIZACION VIAL UNIFORME
4. `ley-2148-caba-codigo-transito-transporte` — Ley 2148 - Codigo de Transito y Transporte de la CABA
5. `ley-6631-caba-vtv-modificatoria-ley-2265` — LEY 6631 2023
6. `gcba-vtv-tramite-current` — Verificacion Tecnica Vehicular Obligatoria
7. `argentina-vehiculos-automotor-cedulas` — Vehiculos
8. `dnrpa-registros-propiedad-automotor` — Registros de la Propiedad Automotor
9. `ansv-cedula-azul-no-exigible` — La cedula azul ya no es documento exigible para la circulacion de vehiculos en el pais
10. `disposicion-29-2024-cedulas-identificacion` — Disposicion 29 / 2024
11. `disposicion-343-2024-autorizacion-cedula-digital` — Disposicion 343 / 2024
12. `argentina-duplicado-chapa-patente-automotor` — Obtener un duplicado de la chapa patente del automotor
13. `gcba-guia-practica-siniestros-viales` — Guia practica de actuacion ante siniestros viales
14. `gcba-material-estudio-examen-teorico` — Material de estudio para examen teorico
15. `gcba-manual-vehiculo-4-ruedas-2023` — Manual de conduccion vehicular - Categoria B / Automoviles
16. `gcba-mapa-estrellas-amarillas` — Mapa de Estrellas Amarillas en la Ciudad
17. `ley-11179-codigo-penal` — CODIGO PENAL DE LA NACION ARGENTINA
18. `ley-26994-codigo-civil-comercial` — CODIGO CIVIL Y COMERCIAL DE LA NACION
19. `ley-17418-seguros` — LEY No. 17.418 - LEY DE SEGUROS

All observed entries have `currentness.validationStatus: "passed"` and `exactTextValidation.status: "pending"`. Some source titles include Spanish diacritics in the manifest; this artifact uses ASCII-safe transliteration where needed, but implementation should preserve exact manifest titles in data and UI.

The archive currently holds about 37k lines of Markdown official-document text. Large entries include the civil/commercial code, CABA traffic code, the four-wheel GCBA manual, Anexo L signage, the national penal code, and Ley 24.449. This feature is therefore a significant content/product feature, not a small UI tab.

## External Research Sources Used

Official Apple and Google guidance checked on 2026-05-10:

- Apple Human Interface Guidelines, Layout: https://developer.apple.com/design/human-interface-guidelines/layout
  - Relevant guidance: group related items, make essential information easy to find, use visual hierarchy and alignment for scanning, use progressive disclosure for hidden content, design adaptive layouts, support text-size changes, and preview across device sizes.
- Android Developers, Material Components overview: https://developer.android.com/design/ui/mobile/guides/components/material-overview?hl=en
  - Relevant guidance: Material is a design system with reusable decisions; components group by action, containment, navigation, selection, and text input; lists are common grouping surfaces; navigation components help users move through destinations.
- Android Developers, Use window size classes: https://developer.android.com/develop/ui/views/layout/use-window-size-classes
  - Relevant guidance: use viewport breakpoints for responsive/adaptive layout; width is usually more relevant because vertical scrolling is common; compact/medium/expanded/large/extra-large classes guide high-level layout decisions.
- Android Developers, Build responsive navigation: https://developer.android.com/develop/ui/views/layout/build-responsive-navigation?hl=en
  - Relevant guidance: navigation choice depends on window size and number of items; compact width can use bottom navigation or drawer, medium can use rail/drawer, expanded can use rail or persistent drawer; list-detail can show one pane on compact and two panes on expanded screens.
- Android Developers, Create a search interface: https://developer.android.com/develop/ui/views/search/search-dialog
  - Relevant guidance: search can be exposed through a search dialog or widget; search suggestions can match actual results in app data.

Research implication for Cabadrive: a primary-source corpus is dense legal/reference content, so the best learner UI is a searchable, adaptive list-detail reference section with progressive disclosure for full texts, rather than a raw-document dump, PDF viewer, or one huge scrolling page.

## Problem Statement

Cabadrive already archives official Spanish source documents for traceability and uses them to support topic-guide claims, but learners cannot browse those primary sources in a finished learner-facing section.

The current official archive is intentionally not learner prose. It preserves Spanish official text and metadata, while Russian support material belongs outside the archive. The user now wants a finished product section that turns the entire current official-source corpus into a useful Russian study/reference surface:

- simple Russian is the default because the target learner has low Spanish proficiency and wants fast comprehension;
- full Russian translation is available when the learner wants the exact meaning without reading Spanish;
- original Spanish is available for source traceability, exam vocabulary, and confidence;
- simplified Spanish is unnecessary and explicitly out of scope;
- every primary source item must be covered, so the feature cannot stop at a partial MVP.

This feature must also preserve the project boundary that official Spanish text is primary and Russian translation/simplification is unofficial learning support.

## Recommended UI Approach For Architect To Evaluate

Use a new learner-facing `Источники` / `Официальные источники` section, preferably reachable from the existing `Материалы` area or a clearly named top-level navigation entry if navigation remains usable on mobile.

Recommended information architecture:

- A searchable source index, grouped by practical category such as traffic laws, signs/signals, vehicle/documents, exam/study materials, incidents/insurance/legal duties, and administrative procedures.
- A list-detail layout:
  - compact/mobile: source list first, then selected source detail replaces or follows the list with a clear back/list affordance;
  - desktop/expanded: persistent source list/filter pane on the left and selected source detail on the right.
- Each source detail defaults to schoolchild-friendly Russian rewrite.
- Each source detail exposes explicit view controls for:
  - `Просто` / simple Russian rewrite;
  - `Полный перевод` / full Russian translation;
  - `Оригинал ES` / original Spanish official text.
- Use progressive disclosure inside each source for large legal structures:
  - document overview;
  - chapters/sections/articles as collapsible or navigable chunks;
  - "open full text" only after the learner chooses it.
- Keep source metadata visible but compact: official title, source type, jurisdiction, currentness status, exact-text validation status, retrieval date, and source URL/local archive reference.
- Provide search across source titles, simple Russian rewrites, full Russian translations, and original Spanish text.
- Provide filters by source type/jurisdiction/status and possibly "used in topic guide" versus "archive only".
- For very long codes/laws, avoid rendering tens of thousands of lines at once. Chunk by document structure and provide in-document search/section navigation.
- Preserve local-first behavior: all texts and search data must be bundled; no runtime network fetch and no raw PDF viewer.

Why this shape fits the guidance:

- Apple Layout emphasizes essential information first, grouping, scan-friendly hierarchy, progressive disclosure, and adaptive layouts.
- Google/Material guidance supports using navigation components, lists, search, and adaptive list-detail layouts for dense content.
- Cabadrive's learner is exam-focused and Russian-speaking; defaulting to simple Russian reduces cognitive load while preserving access to exact translation and official Spanish.
- The existing topic guide already uses list/detail and status labeling; the primary-sources section can reuse that mental model without turning topic materials into a legal archive browser.

## Content And Data Expectations

The eventual feature needs a new structured content layer outside `content/official-documents/`, because the archive must remain verbatim official text only.

For each official document entry, the structured learner layer should include at minimum:

- `officialDocumentId` matching the manifest entry;
- document title inherited from the manifest;
- practical category/group;
- learner-facing short label;
- schoolchild-friendly Russian rewrite, default view;
- full high-quality Russian translation;
- mapping from Russian translation/simplified chunks back to original Spanish document chunks;
- original Spanish text reference, preferably loaded from the archived Markdown rather than duplicated manually;
- translation method/reviewer/status metadata;
- simplification method/reviewer/status metadata;
- disclaimer/status that Russian layers are unofficial learning support;
- currentness/exact-text status inherited from the manifest;
- source trace/reference metadata sufficient for validation and UI display.

Chunking should preserve official structure. For laws/rules, chunks should map to articles, chapters, annex sections, or other stable headings. For manuals/procedure pages, chunks should map to sections/pages/headings. The simple Russian rewrite should stay faithful to each chunk and must not add unsupported legal advice.

## Scope Expectations

In scope for the eventual feature:

- Add a finished primary-sources section covering every current official-documents manifest entry.
- If implementation begins after new manifest entries are added, cover those entries too or explicitly block until coverage is updated.
- Preserve original Spanish source text and structure from the official archive.
- Add full Russian translations for every official-source item/chunk.
- Add schoolchild-friendly Russian rewrites for every official-source item/chunk.
- Default the learner UI to the simple Russian rewrite.
- Let the user switch per item/chunk/document to full Russian translation and full original Spanish text.
- Do not add simplified Spanish.
- Keep Russian translation and simplification outside `content/official-documents/`.
- Make clear that Russian text is unofficial learning support and original Spanish is the official source layer.
- Show source metadata and status without burying the learner in validation internals.
- Provide search and practical filtering across the corpus.
- Handle very long documents without performance or readability problems.
- Preserve local-first/offline behavior and Docker-only runtime.
- Add validation proving every manifest entry has complete translation/simplification coverage.
- Add validation proving chunk mappings remain aligned with the archived official Spanish text.
- Add tests/evidence for default simple Russian view, switching to full Russian/original Spanish, search/filtering, responsive navigation, and no runtime network/PDF dependency.
- Update durable docs because this changes learner-facing source behavior and content governance.

Out of scope for this intake:

- Writing or editing official archive documents.
- Writing translations or simplified rewrites.
- Implementing UI or tests.
- Creating Architect-owned `spec.md`, `plan.md`, or `tasks.md`.
- Committing, pushing, opening PRs, or review comments.
- Adding simplified Spanish.
- Claiming current practice questions are an official full GCBA bank.

## Role Boundaries

- Analyst: writes only this `feature-request.md`, records assumptions/open questions, and hands off.
- Orchestrator: coordinates next roles and enforces one branch/PR per task slice.
- Architect: writes `spec.md`, `plan.md`, and `tasks.md`; decomposes the feature into realistic slices; decides exact data schema and validation gates.
- Implementation Agent: works only after full feature memory exists and only in assigned worktrees/branches; updates code/content/docs/process memory according to tasks.
- Review Agent: reviews PR diffs for bugs, missing tests, source-governance violations, and role-boundary compliance without editing files.

## Assumptions

- "All official source texts already expected to be in the project" means all entries in `content/official-documents/manifest.json`, not only documents currently cited by topic-guide source trace.
- The current 19 manifest entries are the starting corpus.
- If new official documents are added before implementation starts, the feature should cover them as part of "all primary sources" unless the user explicitly scopes them out.
- Because the user explicitly said this is not an MVP, partial coverage is not acceptable for a final completed feature. Architect may still decompose implementation into many PR slices, but final acceptance must prove whole-corpus coverage.
- The source archive remains Spanish-only/verbatim; Russian translation and simplification belong in a separate learner-content area.
- The simple Russian rewrite is a faithful pedagogical rewrite, not legal advice, not a summary that drops exam-relevant rules, and not a replacement for the full translation.
- Full Russian translation quality requires review/approval evidence comparable to existing translation-alignment expectations, expanded for official-source text.
- The UI should not default to original Spanish despite the project rule that official Spanish is primary; here "primary" means available, traceable, and clearly official, while the requested learner default is simple Russian.
- The exact-text `pending` status in the manifest should remain visible/handled. Architect must decide whether final exact-text validation is a prerequisite before publishing the primary-sources section as finished.
- Existing `Материалы` topic guide and `CABA/RF` guide should remain distinct from the primary-source reference section unless Architect explicitly designs a navigation consolidation.

## Open Questions For Architect

- Should the new section be a top-level navigation entry (`Источники`) or a sub-section under `Материалы` to avoid overcrowding the current top tab row?
- What exact Russian label should be used: `Источники`, `Официальные источники`, `Законы и правила`, or another concise label?
- Should every manifest entry be shown equally, or should the UI group "rules/laws" separately from manuals, official web pages, and administrative procedure pages while still covering all entries?
- Should final publication require `exactTextValidation.status: "passed"` for all manifest entries, or may the UI expose pending exact-text status with strong labeling until the existing final archive validation tasks are completed?
- What review workflow and evidence are required for high-quality Russian translations of long legal texts?
- Should translation/simplification be chunked at article/section level only, or should very long articles be split into smaller learner chunks with stable mapping back to official sections?
- Should the section expose guide-claim/source-trace relationships to learners, or keep them maintainer-only and show only compact "used in study materials" badges?
- What is the expected behavior when an official source becomes stale/repealed after translations have been produced?

## Risks

- Whole-corpus translation is large. A single implementation PR would be too risky and likely impossible to review well.
- Full legal-source translation can introduce legal meaning errors if review evidence is weak.
- A simple rewrite can accidentally omit conditions, exceptions, or formal limits that matter for exam correctness.
- The stale durable docs around source count could mislead future agents unless updated during the feature.
- Rendering whole long documents at once could hurt mobile usability and performance.
- Showing default Russian could conflict with the existing "official Spanish text stays primary" rule unless UI copy and source metadata clearly identify Spanish as the official source layer.
- Exact-text validation is pending for all manifest entries; a "finished" primary-source section may be misleading if the official archive itself has not passed final exact-text validation.
- Some official entries are not Spanish law texts in the narrow sense; they include manuals, procedure pages, and PDFs. The feature must handle multiple source types consistently.
- If translations duplicate original Spanish text instead of referencing/chunking archived Markdown, content drift can appear between the archive and learner section.

## Acceptance Expectations

Architect should define acceptance criteria that prove:

- every official-documents manifest entry is represented in the primary-sources section;
- every source item/chunk has a schoolchild-friendly Russian rewrite;
- every source item/chunk has a high-quality full Russian translation;
- every source item/chunk can show the full original Spanish text;
- the default UI view is simple Russian;
- simplified Spanish is absent;
- source metadata clearly distinguishes original Spanish official text from unofficial Russian learning support;
- coverage validation fails if any manifest entry or chunk lacks simple Russian, full Russian, or original Spanish linkage;
- chunk mappings preserve official source structure and remain aligned with local archived Markdown;
- long documents are searchable and navigable without loading an unusable wall of text;
- the section works offline after build and performs no runtime network fetch;
- no raw PDF viewer is used as the learner interface;
- responsive UI evidence covers compact/mobile and expanded/desktop layouts;
- accessibility coverage includes semantic navigation, keyboard operation, focus states, and screen-reader labels for view controls;
- durable docs are updated for the new content layer, validation, UI behavior, source-governance boundaries, and the current manifest corpus;
- final verification includes `pnpm run validate:content`, `pnpm run test`, `pnpm run build`, `pnpm run test:e2e`, `pnpm run preflight`, and `git diff --check`, or exact unrelated blockers recorded in process memory.

## Handoff

This Analyst pass is complete. Orchestrator should invoke Architect next to write:

- `specs/019-primary-sources-section/spec.md`
- `specs/019-primary-sources-section/plan.md`
- `specs/019-primary-sources-section/tasks.md`

Architect should pay special attention to task slicing. A sensible future decomposition is likely:

- source corpus inventory and docs refresh;
- data schema and chunk mapping;
- validation gates for coverage/alignment;
- translation/simplification production in small source groups;
- UI shell and navigation;
- source detail view controls;
- search/filter/indexing;
- responsive/accessibility/e2e verification;
- final whole-corpus validation and publication readiness.
