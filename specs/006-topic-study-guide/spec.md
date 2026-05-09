# Spec: Topic-Based Preparation Guide

## Analyst Intake

- Source request: `feature-request.md`
- Current ticket baseline observed during intake and Architect orientation: `content/questions/caba-b.unofficial-fallback.questions.json` contains 460 category B fallback questions.
- This feature is for designing and planning a web-facing topic study guide. This planning PR must not write the full guide prose, download official sources, create the governed official-documents area, or edit product/runtime files.

## Architect Assumptions

- The current ticket set means the 460 IDs in `content/questions/caba-b.unofficial-fallback.questions.json` at the time of implementation, not a future official GCBA bank.
- The guide taxonomy must be derived from the current ticket corpus, but taxonomy discovery may use scripts or structured analysis in a future implementation PR rather than being hand-authored inside this planning PR.
- The current `topics` field on questions may be used as a hint during analysis, but it is not the guide taxonomy source of truth because guide categories must be compact pedagogical pages and every ticket may appear in at most two guide categories.
- The existing `content/sources/originals/` source snapshots remain valid for current MVP source registry purposes, but this feature requires a stricter future governed official-document Markdown archive for laws, rules, manuals, licensing requirements, and other official source text used by guide claims.
- For atomized implementation, intermediate PRs may carry draft guide content and partial coverage evidence. The guide becomes publishable only when the final strict coverage, source-trace, official-document, render, and preflight gates pass.

## Goal

Design a separate web-facing Russian topic guide that organizes the current local tickets into compact exam-relevant topics, teaches only the material needed to answer those tickets correctly, and preserves official-source traceability for every rule/procedure/legal/numeric/licensing/road-safety/traffic-sign claim.

## Scope

In scope:

- Define a guide content model for compact Russian topic pages.
- Define a guide taxonomy workflow derived from all current 460 local tickets.
- Require every current ticket ID to appear in at least one guide category.
- Require every ticket ID to appear in no more than two guide categories.
- Require tickets assigned to two categories to physically render inside both topic sections, not only as cross-references.
- Require each topic page to include:
  - concise Russian material;
  - practical reasoning when it helps answer the tickets;
  - useful Spanish words and constructions taken from ticket wording;
  - ticket cards with original Spanish text, answer options, correct answer, local image when present, and Russian explanations for why the correct answer is correct and why each incorrect answer is wrong;
  - compact trap notes for misleading wording, negations, exceptions, similar answers, and mistranslations.
- Define validation and evidence requirements for full coverage, category duplication, topic-page structure, source traceability, and physical repeated rendering.
- Define a governed official-documents archive to be created in future implementation work.
- Require exact-text preservation, currentness validation, source metadata, integrity metadata, durable docs, and local agent instructions for every document in the official-documents archive, including future additions.
- Preserve current content mode clarity: the ticket set remains `unofficial_b_fallback`, and the guide must not imply official or complete GCBA question-bank coverage.
- Decompose future implementation into small task slices so no agent must author the full guide prose, all 460 explanations, UI integration, official-document conversion, and validation in one PR.

Out of scope for this planning feature:

- Writing complete guide content for all 460 tickets.
- Downloading or converting official source documents.
- Creating the official-documents directory or its local `AGENTS.md`.
- Editing `docs_project/`, product code, scripts, content files, package files, or runtime configuration.
- Replacing the fallback question bank or claiming it is official.
- Introducing a backend, online service, runtime network dependency, or PDF viewer as the guide UX.
- Making Russian text official or primary over Spanish source ticket text.

## Non-Goals

- Cabadrive will not become a full Spanish course, a full driving-school manual, or a legal encyclopedia.
- The topic guide will not publish unsupported interpretations of Argentina or CABA traffic rules.
- The official-document archive will not be editable prose. It is a governed verbatim source-of-truth archive with strict metadata and validation.
- The guide implementation will not bundle unrelated UI redesign, content-bank replacement, official-bank research completion, or runtime architecture changes.

## Content Model Requirements

- The guide content should live separately from the existing condensed CABA/RF guide so future agents can build the topic guide without breaking the current MVP surface.
- The preferred future path is `content/guide/topic-study-guide.ru.json` for structured topic content.
- A separate machine-readable coverage artifact should track ticket placement, preferred future path `content/guide/topic-study-guide.coverage.json`.
- A separate machine-readable source-trace artifact should track official-source-backed claims, preferred future path `content/guide/topic-study-guide.source-trace.json`.
- The guide must reuse canonical ticket text, answer options, correct answer IDs, images, and source status from `content/questions/caba-b.unofficial-fallback.questions.json` instead of duplicating Spanish ticket source text.
- A ticket placement is physical for rendering when the guide topic data contains the ticket ID inside each topic's ticket list and the renderer emits the full ticket block in each listed topic.
- Ticket explanations may be duplicated per topic when the emphasis differs, but each rendered ticket block must explain every answer option in that topic context.
- Spanish words for a topic must be extracted from the ticket wording and answer wording assigned to that topic, not invented as a general vocabulary lesson.
- Topic pages must remain short enough for exam preparation. Large categories should be split when they become too broad to read or review as one focused block.

## Official Documents Archive Requirements

Future implementation must introduce a dedicated governed official-documents section. Preferred path:

```text
content/official-documents/
  AGENTS.md
  manifest.json
  documents/
  originals/
  validation/
```

The exact path may change only if the Implementation Agent records the reason in process memory and Architect disposes it before merge.

Section-wide rules:

- Every official document or official material used for guide claims must be downloaded from the official internet source in full and saved locally as Markdown.
- The Markdown official document or material must preserve the official title, wording, numbering, headings, article/rule/page/section structure, bullet structure, and formal terminology as exactly as Markdown reasonably allows.
- The official document/material Markdown must not translate, summarize, rewrite, simplify, or paraphrase official text.
- Each archived document/material must record exact document/material title, official source type, source URL, retrieval date, retrieval timestamp/time zone when available, local Markdown path, hash algorithm, Markdown hash, original/raw evidence path when applicable, source format, conversion method, and conversion limitations.
- Each archived document/material must record currentness/effective-status evidence: checked-at date, status, whether the source is current consolidated text or otherwise currently valid for its source type, amendment/repeal/supersession evidence when applicable, and URLs or official metadata used for the check.
- Official documents and materials may support current guide claims only when currentness/effective-status is verified as current, in force, or otherwise currently valid for the specific source type at the time of validation. This includes laws, rules, formal requirements, manuals/study materials, licensing requirements/pages, road-safety/procedure materials, traffic-sign materials, and any other official source type cited by source trace.
- A non-current source may remain archived only as historical context and must be excluded from current guide claims unless clearly marked and Architect-disposed.
- PDF or non-HTML sources require raw/original evidence beside Markdown or another documented proof method so final validation can compare the Markdown against the primary source.
- A final dedicated archive exact-text validation task must prove every official-documents manifest entry, including entries not currently cited by published guide claims, matches the official primary source for title, wording, numbering when present, headings, and article/rule/page/section structure as applicable to that source type.
- A final dedicated archive currentness/effective-status validation task must prove every official-documents manifest entry, including entries not currently cited by published guide claims, has checked-at status evidence and official metadata appropriate to its source type at validation time.
- A final dedicated current-claim source-trace validation task must prove every source-traced current guide claim cites only manifest entries whose status is current, in force, or otherwise currently valid for the relevant source type at validation time.
- The section must contain local agent instructions, preferably `content/official-documents/AGENTS.md`, requiring future agents to preserve exact text, metadata, integrity hashes, currentness evidence, and validation rules.
- Durable `docs_project/` documentation must describe the archive purpose, location, manifest, validation expectations, and the rule that exact-text/currentness governance applies to all future documents in the section.

## Source Trace Requirements

- Every topic must list the official source documents/materials checked for claims that go beyond directly restating fallback ticket wording.
- Every rule/procedure/legal/numeric/licensing/road-safety/traffic-sign claim in guide prose must map to one or more source-trace entries.
- A source-trace entry must identify the topic, claim ID, claim summary, official document IDs, relevant official sections/articles/pages when available, checked-at date, currentness status used, and reviewer/agent notes.
- A source-traced current guide claim may cite only official-documents manifest entries whose effective status is current, in force, or otherwise currently valid for the relevant source type at validation time.
- If a fallback ticket's expected answer appears inconsistent with current official sources, the guide must not silently teach a doubtful claim. The item must be omitted from generalized prose, rewritten as ticket-specific wording, or recorded as an issue for Architect disposition.
- Official-source enrichment must be compact and must directly help answer assigned tickets.

## User Stories

### User Story 1

As a Russian-speaking learner, I want to browse compact topic pages instead of a monolithic manual, so that I can study one exam-relevant concept at a time.

### User Story 2

As a learner with low Spanish proficiency, I want each topic to show useful Spanish words from the actual tickets, so that I recognize exam wording without studying a broad language course.

### User Story 3

As a learner reviewing a topic, I want each included ticket to show the correct answer and why each wrong option is wrong, so that I learn the trap patterns rather than memorizing only answer letters.

### User Story 4

As a maintainer, I want machine-readable coverage and source trace manifests, so that small content slices can be reviewed independently and final release can prove all 460 current tickets are covered.

### User Story 5

As a maintainer, I want official sources archived verbatim with currentness evidence, so that guide claims can be checked against durable official text instead of transient links or memory.

## Acceptance Criteria

1. Given the current question file has 460 IDs, final guide validation fails unless all 460 IDs appear in the guide coverage map.
2. Given the current question file changes count or IDs, final guide validation fails until the coverage baseline and assignments are updated in the same implementation slice.
3. Given any current ticket ID, final guide validation fails if it has zero category assignments.
4. Given any current ticket ID, final guide validation fails if it has more than two category assignments.
5. Given a ticket assigned to two categories, final render/e2e evidence shows the full ticket block physically appears in both category sections.
6. Given a ticket assigned to two categories, the guide does not satisfy physical repetition by showing only a link, reference, or "see also" entry in the second category.
7. Given a topic page, validation fails if it lacks concise Russian material, Spanish words from assigned ticket wording, assigned tickets with answer explanations, or trap notes.
8. Given an included ticket block, validation fails if it lacks the original Spanish question text, answer options, correct answer, and explanations for why the correct answer is correct and why each incorrect answer is wrong.
9. Given a ticket with a local image in the question source, the rendered guide ticket block shows that local image.
10. Given guide prose includes a rule/procedure/legal/numeric/licensing/road-safety/traffic-sign claim beyond direct ticket restatement, validation fails if no source-trace entry maps the claim to archived official documents/materials.
11. Given a source-trace entry points to an official document/material, validation fails if that document/material is missing from the official-documents manifest.
12. Given an archived official document/material, validation fails if title, official source type, source URL, retrieval date, local Markdown path, hash metadata, currentness status, checked-at date, or conversion notes are missing.
13. Given any official-documents manifest entry exists, including entries not currently cited by published guide claims, final archive validation fails if exact-text comparison against the official primary source has not passed.
14. Given any official-documents manifest entry exists, including entries not currently cited by published guide claims, final archive validation fails if currentness/effective-status validation evidence has not been checked and recorded at validation time.
15. Given a source-traced current guide claim cites an official document/material, final validation fails if the cited manifest entry is not current, in force, or otherwise currently valid for the relevant source type at validation time.
16. Given a source is repealed, superseded, stale, or materially amended, current guide claims depending on it are removed, replaced with a current source, or blocked pending Architect disposition.
17. Given durable docs are inspected after implementation, they explain where official documents, official-document manifest, guide source trace, and guide content live.
18. Given the official-documents section is inspected after implementation, it contains local agent instructions that enforce exact-text preservation, metadata, currentness, and validation rules for future additions.
19. Given the guide UI is complete, the guide is reachable as a separate app section and does not require embedding raw PDFs or live network access.
20. Given published guide pages render, Russian guide prose, explanations, vocabulary, and trap notes remain visibly or contextually unofficial learning aids consistent with existing product rules.
21. Given local preflight runs after final implementation, it passes or records only unrelated blockers with exact evidence.

## Negative Scenarios

- A guide with 459 covered tickets is not complete.
- A guide with all 460 tickets but one ticket assigned to three categories is not complete.
- A guide that stores two-category tickets only once and links from the second topic is not complete.
- A topic that lists tickets but lacks explanations for wrong answers is not complete.
- A topic that uses broad current question `topics` without deriving compact guide categories is not complete.
- A topic that adds Spanish words not found in assigned ticket wording as if they came from tickets is not complete.
- A guide that teaches current legal/procedure claims from unarchived links is not complete.
- A guide that archives official documents as paraphrased Russian or simplified summaries is not complete.
- An official-document archive without local `AGENTS.md` or equivalent future-agent instructions is not complete.
- An official document with exact copied wording but stale/repealed status is not valid for current guide claims.
- A future PR that combines taxonomy, all guide prose, all 460 answer explanations, UI integration, official-document conversion, exact-text validation, currentness validation, and final preflight in one slice violates this feature plan.
- The guide must not imply the current fallback question set is an official or complete GCBA category B bank.

## Functional Requirements

- FR-001: Define a structured topic-guide content format separate from the current condensed guide.
- FR-002: Define a machine-readable guide coverage artifact that uses the current 460 ticket IDs as its baseline.
- FR-003: Define a machine-readable source-trace artifact for topic claims.
- FR-004: Define a governed official-documents archive with manifest and local agent instructions.
- FR-005: Add future validation that proves every current ticket appears in at least one and no more than two guide categories.
- FR-006: Add future validation that proves the coverage baseline matches the current question file count and IDs.
- FR-007: Add future validation that proves every topic page has the required internal structure.
- FR-008: Add future validation that proves every included ticket explains the correct answer and each incorrect answer.
- FR-009: Add future render/e2e evidence that two-category tickets physically render in both topic sections.
- FR-010: Add future validation that topic vocabulary comes from assigned ticket text or answer text.
- FR-011: Add future validation that guide claims reference source-trace entries where official-source verification is required.
- FR-012: Add future validation that source-trace entries reference archived official documents/materials with complete manifest metadata.
- FR-013: Add future exact-text validation for every official-documents manifest entry, including entries not currently cited by published guide claims, across laws, rules, formal requirements, manuals/study materials, licensing requirements/pages, road-safety/procedure materials, traffic-sign materials, and any other official source type archived in the section.
- FR-014: Add future currentness/effective-status validation for every official-documents manifest entry, including entries not currently cited by published guide claims, with checked-at evidence and source-type-appropriate status metadata.
- FR-015: Add future validation that source-traced current guide claims cite only official-documents manifest entries whose status is current, in force, or otherwise currently valid for the relevant source type.
- FR-016: Update future durable docs for guide content paths, official-document archive paths, manifests, validation, and section-wide governance.
- FR-017: Update future UI navigation so the completed topic guide is reachable as a separate app section.
- FR-018: Keep future task slices small and record Implementation Agent feedback, decisions, known issues, dead ends, and evidence in `tasks.md`.

## Success Criteria

- SC-001: Planning artifacts exist: `feature-request.md`, `spec.md`, `plan.md`, and `tasks.md`.
- SC-002: Future implementation is decomposed into independent PR-sized slices, with no all-in-one guide-authoring task.
- SC-003: Future final implementation can prove complete 460-ticket coverage, one-or-two category assignment, and physical repeated rendering.
- SC-004: Future final implementation can prove source traceability, whole-archive official-document exact-text preservation, whole-archive official-document currentness/effective-status evidence, and current-claim citations only to current/in-force/currently valid sources.
- SC-005: Future final implementation can prove local-first static app behavior, Docker runtime compatibility, and passing preflight.

## Review And Verification Requirements

- Review Agent must check that any implementation PR for this feature reads this feature memory and updates `tasks.md` process memory.
- Review Agent must reject product/content PRs that lack complete feature memory or skip the official-document governance tasks needed by their claims.
- Review Agent must check that no implementation slice exceeds the assigned scope or bundles unrelated full-guide work.
- Review Agent must verify guide coverage and source-trace evidence with commands or committed validation output, not only prose summaries.
- Review Agent must verify official-source archive changes preserve exact official text and currentness metadata for every official document/material touched by that slice.
- Final feature review must verify exact-text and currentness/effective-status evidence for every official-documents manifest entry, plus current/in-force/currently valid source status for every source-traced current guide claim.
- Final feature review must include evidence for all acceptance criteria, no blocking findings, green required checks, no merge conflicts, and only final human approval or merge mechanics remaining.
