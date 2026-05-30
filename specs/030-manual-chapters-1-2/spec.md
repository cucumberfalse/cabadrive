# Spec: Interactive Russian Manual Chapters 1 And 2

## Architect Correction

- Source request: `feature-request.md`, including the Analyst-recorded correction that one website page means one source manual section/topic, not one source PDF page.
- Corrected delivery unit: one website section page per PR.
- Superseded delivery unit: raw source PDF pages as PR delivery units. All prior requirements that treated source PDF pages `21-56` as implementation PR slices are replaced by this spec.
- Assigned correction worktree: `/Users/chap/devel/cabadrive-worktrees/030-section-requirement-correction`.
- Assigned correction branch: `codex/030-section-requirement-correction`.
- Verified base provided by Orchestrator: `origin/main` at `7a07034d8a9380cbe83b9403a6a9aa7bc73dfa50`.
- Role boundary: Architect edits only `spec.md`, `plan.md`, and `tasks.md`. No code, tests, runtime files, assets, Analyst-owned text, commits, pushes, PR actions, or merge actions are authorized here.
- Parallel-work constraint: preserve sibling worktrees, branches, commits, PRs, dirty diffs, process memory, and the root repo's unrelated untracked `tmp_repair_page18_center.swift`.

## Section And PR Definition

A website section page is one source `Índice` child topic under Chapter 1 or Chapter 2, regardless of how many source PDF pages the topic spans.

For this cycle:

- Source PDF page numbers are source mapping, crop, screenshot, and QA metadata only.
- Source PDF page numbers are not website routes and are not implementation PR slice boundaries.
- Chapter divider-only source PDF pages are skipped entirely. Source PDF pages `21` and `43` do not receive separate site pages, placeholders, content modules, or PRs.
- Chapter titles remain represented by chapter navigation/group headings and section context, not standalone divider-page routes.
- One implementation PR may contain exactly one website section page's learner-facing content, covering that section's full source range.
- A section PR must not split one section across multiple PRs and must not bundle multiple sections into one PR unless Architect records a source-backed exception and Orchestrator explicitly accepts it.

## Goal

Continue the native Russian interactive `Руководство` into official manual Chapters 1 and 2 as source-faithful, selectable, responsive website section pages, delivered one source-`Índice` topic per merged PR.

## Source Scope

Chapter 1 source range remains `21-42`, but implementation starts with the first substantive section on source PDF page `22`.

Chapter 2 source range remains `43-56`, but implementation starts with the first substantive section on source PDF page `44`.

Expected section PR inventory from current `navigation.ru.json`:

| Section PR key | Website section page | Source `Índice` id | Source range metadata | Disposition |
| --- | --- | --- | --- | --- |
| `ch1-cities-for-people` | `Ciudades para las personas` / `Города для людей` | `ch1-cities-for-people` | `22` | implement as one section PR |
| `ch1-sustainable-mobility` | `¿Qué es la movilidad sustentable?` / `Что такое устойчивая мобильность?` | `ch1-sustainable-mobility` | `23` | implement as one section PR |
| `ch1-pedestrian-priority` | `Prioridad peatonal` / `Пешеходный приоритет` | `ch1-pedestrian-priority` | `24-29` | implement as one section PR |
| `ch1-bicycle` | `Bicicleta` / `Велосипед` | `ch1-bicycle` | `30-38` | implement as one section PR |
| `ch1-public-transport-system` | `Sistema de transporte público` / `Система общественного транспорта` | `ch1-public-transport-system` | `39-40` | implement as one section PR |
| `ch1-shared-trip` | `Viaje compartido` / `Совместная поездка` | `ch1-shared-trip` | `41-42` | implement as one section PR |
| `ch2-legal-responsibility` | `Responsabilidades legales` / `Юридическая ответственность` | `ch2-legal-responsibility` | `44-45` | implement as one section PR |
| `ch2-required-documents` | `Documentación obligatoria` / `Обязательные документы` | `ch2-required-documents` | `46-50` | implement as one section PR |
| `ch2-incident-obligations` | `Obligaciones en caso de incidentes viales` / `Обязанности в случае дорожных инцидентов` | `ch2-incident-obligations` | `51-55` | implement as one section PR |
| `ch2-scoring` | `Scoring` / `Система баллов Scoring` | `ch2-scoring` | `56` | implement as one section PR after source-boundary verification |

If source inspection proves that a current navigation range is wrong, Implementation Agent records feedback and stops for Architect/Orchestrator disposition before changing the section count, combining sections, splitting sections, or moving content between section PRs.

## Scope

In scope:

- Convert the ten Chapter 1/2 source-`Índice` child topics listed above into native Russian website section pages.
- Preserve the full source-`Índice` hierarchy: Chapter 1 and Chapter 2 are navigation groups; each section page lives under its source chapter.
- Preserve existing Introduction routes and the visible destination `Руководство`.
- Use existing manual manifests, local page renders, and official PDF as source/reference inputs only.
- Produce native learner-facing Russian HTML/CSS/SVG/local assets, not a PDF/page-image reader.
- Preserve source-faithful local artwork/crops, source-region metadata, cleaned originals, selectable Russian labels, responsive prose, style-token consistency, and visual checker evidence.
- Keep all runtime behavior local-first/offline after build.
- Add or correct shared infrastructure only when needed to support section-based registry, routes, checker evidence, and future section PRs.

Out of scope:

- Standalone implementation of chapter divider-only source PDF pages `21` or `43`.
- Source-PDF-page routes or PR slices for pages inside a section span.
- Chapters 3-5, appendices, practice-question changes, exam mode, backend work, analytics, remote assets, remote fonts, runtime AI, or runtime PDF rendering.
- Architect implementation, review, staging, commits, pushes, PR actions, merges, or cleanup.

## User Stories

### User Story 1

As a Russian-speaking learner preparing for the CABA theory exam, I want Chapter 1 topics to be complete website section pages, so that I can read each topic naturally without jumping between artificial PDF page fragments.

### User Story 2

As a Russian-speaking learner, I want Chapter 2 legal, document, incident, and scoring sections to preserve exam-critical detail across their whole source ranges, so that simplified Russian wording does not change obligations, numbers, legal terms, or exceptions.

### User Story 3

As the project owner, I want one PR per website section page, so that source fidelity, infographic quality, and wording can be reviewed topic by topic.

## Acceptance Criteria

1. Given the user opens `Руководство`, when Chapter 1 or Chapter 2 is expanded, then the navigation shows chapter groups and substantive section topics, not standalone divider-only source PDF pages.
2. Given a section spans multiple source PDF pages, when implemented, then one website section page contains the full section in source order with all required text, visuals, callouts, tables, and legal details from that source range.
3. Given a section PR is reviewed, then its learner-facing content covers exactly one website section page and does not silently include another source-`Índice` topic.
4. Given source PDF page `21` or `43`, when section planning is checked, then there is no standalone site page/PR for that divider-only page.
5. Given PR #175 / `page-021`, when merge readiness is considered, then it is not merge-ready in its divider-page form and must be closed, superseded, or fully replaced by a section-based implementation before any merge.
6. Given ordinary prose, lists, legal text, and callouts are rendered, then Russian text is selectable/copyable DOM or SVG text, responsive, accessible, and free of forced PDF line breaks.
7. Given a section contains source artwork, pictograms, signs, diagrams, tables, maps, or infographics, then source geometry, colors, panels, connectors, borders, proportions, and meaningful visual relationships are preserved from local source crops or visually indistinguishable reconstruction.
8. Given source text exists inside artwork, then visible Spanish is absent from the learner view, cleanup is local and source-faithful, and Russian labels are selectable text where feasible.
9. Given visual checker evidence is produced, then it includes source-region/crop metadata, source/Russian screenshots, bounding-box checks, visible-Spanish checks, responsive checks, selectable-text checks, and explicit pass/fail output for the whole section.
10. Given final validation starts, then the cycle PR set records every contributing shared prerequisite/correction PR and every implemented section PR, with final Architect validation before final Analyst validation.

## Negative Scenarios

1. Splitting `Prioridad peatonal`, `Bicicleta`, `Documentación obligatoria`, or any other multi-page source topic into several source-PDF-page PRs.
2. Merging a divider-only source PDF page such as page `21` as its own website page.
3. Bundling two or more source-`Índice` topics into one implementation PR without recorded Architect/Orchestrator exception.
4. Returning to the old `Руководство 4R` page-layout reader, side-by-side Spanish/Russian transcript, runtime PDF viewer, full-page raster base, or image-only Russian page.
5. Flattening Russian learning text into images or blocking text selection.
6. Replacing source pictograms, infographics, diagrams, tables, signs, or photos with generic icon sets, approximate redesigns, broad masks, backing plates, or text-only substitutes.
7. Leaving Spanish source text visible in learner-facing artwork.
8. Removing ticket-critical detail, ordered steps, legal terms, document names, phone numbers, thresholds, conditions, restrictions, exceptions, or scoring rules without Architect disposition.
9. Claiming visual quality from structural tests alone, without source-vs-Russian screenshots and bounding-box/artifact evidence.
10. Adding remote fonts/assets, runtime network calls, backend endpoints, analytics, or live AI behavior.

## Requirements

- FR-001: `Руководство` remains the only user-facing interactive manual destination for this conversion.
- FR-002: Route boundaries come from source `Índice` section/topic entries, not raw PDF page numbers.
- FR-003: The current Chapter 1/2 implementation cycle contains ten expected website section page PRs, one per section listed in this spec.
- FR-004: Source PDF pages `21` and `43` are skipped as standalone implementation units because they are chapter divider-only pages.
- FR-005: A shared prerequisite/correction PR is allowed when needed to replace page-based registry/routes/checkers with section-based registry/routes/checkers; it must contain no converted section content.
- FR-006: Every implementation slice after planning must use a fresh isolated worktree/branch from latest verified `main`.
- FR-007: Every section PR must update `tasks.md` process memory with source range metadata, decisions, evidence, known issues, Implementation Agent feedback, and cycle PR set details.
- FR-008: Every section must use native HTML/CSS/SVG/local assets; runtime PDF viewer, PDF.js, iframe/object/embed PDF display, remote assets, runtime fetches, backend endpoints, live AI calls, and remote fonts are forbidden.
- FR-009: Russian learning text must be selectable/copyable DOM or SVG text and must not be rasterized into page images.
- FR-010: Normal prose must wrap responsively; horizontal scrolling is allowed only inside fixed visual blocks whose source layout requires it.
- FR-011: Source artwork and infographics must be local, source-faithful, and backed by metadata: section id, source PDF page(s), source region(s), asset path, crop dimensions/hash when practical, cleanup scope, visible-Spanish status, and quality notes.
- FR-012: Generic icon sets, redesigned pictograms, approximate SVG redraws, altered colors, missing components, distorted source-piece assembly, broad masks, DOM label plates, and visible cleanup artifacts are forbidden.
- FR-013: Russian wording may be simplified for learner clarity only when source order, meaning, and ticket-critical details remain intact across the full section span.
- FR-014: Recurring style tokens for document shell, section headings, body, callouts, legal cards, figure captions, tables, sign/image blocks, infographic labels, document lists, emergency checklists, and contact/resource lists must be reused or extended with source-backed variants.
- FR-015: Section-specific tests must cover route availability, section coverage, forbidden patterns, local assets, source-region metadata, selectable text, responsive prose, visible-Spanish absence, and visual checker output.
- FR-016: Review Agent must verify role boundaries, Orchestrator-first routing, complete feature memory, latest-main startup evidence, sibling-work preservation, one-section PR scope, and visual-quality evidence.
- FR-017: The work cycle requires cycle PR-set tracking and final Architect validation before final Analyst validation, completion, conservative Orchestrator finalization, or merge.
- FR-018: If Analyst final validation finds gaps, Analyst-owned validation notes require Architect accept/task/ticket/dispose disposition before follow-up development.
- FR-019: If final validation targets an effective content head, record matching markers for effective content head, Architect validated effective content head, and Analyst validated effective content head.
- FR-020: Architect return limit is 10 and Analyst return limit is 5 per work cycle; exceeding either limit requires new-feature-request escalation.
- FR-021: Cleanup is out of scope unless Orchestrator explicitly assigns Cleanup Agent work with approved roots and positive-proof validation.

## Success Criteria

- SC-001: Chapter 1 and Chapter 2 are represented by ten separate merged website section page PRs, plus only explicitly needed shared prerequisite/correction PRs.
- SC-002: `Руководство` exposes Chapter 1 and Chapter 2 in the full source `Índice` hierarchy with section content replacing section placeholders as PRs merge.
- SC-003: Divider-only source PDF pages `21` and `43` do not appear as standalone learner pages.
- SC-004: Every section PR records passing focused tests, visual checker output, screenshot evidence, source-region metadata, and local preflight evidence before merge readiness.
- SC-005: PR #175 / `page-021` is not merged as-is; it is closed, superseded, or fully replaced by a section-based PR before any merge.
- SC-006: No duplicate visible manual destination, runtime PDF/page-raster reader, remote dependency, or old side-by-side translation flow is introduced.

## Assumptions

- Existing `manual.ru.json`, `layout.ru.json`, `navigation.ru.json`, and local page renders are trusted source/reference inputs but not the final runtime content model.
- Existing Introduction style and `docs_project/project/frontend/manual-conversion-guidelines.md` are the baseline for new section pages.
- Current `navigation.ru.json` section ranges are accepted until source inspection proves a correction is needed.
- Source PDF page spans inside a section may be used for crop/evidence granularity, but not for PR slicing.
- Parallel section PRs are allowed only if Orchestrator verifies latest-main base, non-overlapping files, and conflict safety.

## Review And Verification Requirements

- Implementation requirements: Implementation Agent starts only after Orchestrator assigns an isolated worktree, branch, website section key, PR slice, and complete feature memory. Implementation Agent edits exactly the assigned section plus necessary section-local tests/assets/process-memory entries, unless assigned a shared prerequisite/correction PR.
- Review requirements: Review Agent checks Orchestrator-first compliance, role boundaries, latest-main startup, one-section scope, no sibling mutation, complete process memory, visual-source-fidelity gates, no forbidden manual rendering patterns, and final-validation compliance where applicable.
- Test/verification requirements: section PRs run focused content tests, visual/source-fidelity checker, Playwright route tests with desktop/mobile screenshots, `pnpm run validate:content`, `pnpm run test` or focused equivalent, `pnpm run build`, `pnpm run preflight`, and Docker runtime validation unless Orchestrator records a specific fallback.
- Handoff and blocker requirements: Implementation Agent feedback is recorded in process memory and routed to Architect. Ambiguous section boundaries, unsafe cleanup, credentials/permissions, data-loss risk, conflicting requirements, or PR state ambiguity stop the role for Orchestrator/user disposition.
- Final validation requirements: Architect validates all included PR slices, Architect-assigned tasks/dispositions, architectural guidance, open task state, process memory, and customer intent in spirit. Analyst validates customer intent in spirit and letter only after Architect passes. Any non-evidence post-validation change makes validation stale.
