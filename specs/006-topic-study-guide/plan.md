# Plan: Topic-Based Preparation Guide

## Summary

Build the topic study guide through staged, reviewable PRs. First establish schemas, validation, and official-source governance. Then derive the taxonomy from the current 460 fallback ticket IDs. Then fill guide content in small topic slices. Finish with strict global coverage, whole-archive official-document exact-text/currentness validation, source-traced current-claim source validity, physical render evidence, UI reachability, and preflight.

This planning PR only creates Architect artifacts. It intentionally does not create the official-documents archive, download sources, write guide prose, or edit product/runtime files.

## Technical Context

- Runtime: static React/Vite app; no backend.
- Current content mode: `unofficial_b_fallback`.
- Current ticket source: `content/questions/caba-b.unofficial-fallback.questions.json`.
- Current ticket baseline: 460 IDs.
- Existing guide surface: `content/guide/ru.condensed-guide.json` rendered by `GuideView`.
- Existing source registry: `content/sources/sources.json` and `content/sources/originals/`.
- Existing validation entry point: `scripts/validate-content.mjs`.
- Existing verification commands:
  - `pnpm run validate:content`
  - `pnpm run test`
  - `pnpm run build`
  - `pnpm run test:e2e`
  - `pnpm run preflight`
  - `git diff --check`

Likely future paths:

```text
content/guide/topic-study-guide.ru.json
content/guide/topic-study-guide.coverage.json
content/guide/topic-study-guide.source-trace.json
content/official-documents/AGENTS.md
content/official-documents/manifest.json
content/official-documents/documents/
content/official-documents/originals/
content/official-documents/validation/
scripts/content-topic-guide.mjs
scripts/official-documents-validation.mjs
tests/content-topic-guide.test.mjs
tests/official-documents-validation.test.mjs
docs_project/project/content-sources.md
docs_project/project/frontend/frontend-docs.md
docs_project/project/feature-inventory.md
docs_project/screens/learning-and-exam-flows.md
src/data/content.ts
src/App.tsx
tests/e2e/app.spec.ts
```

The final exact filenames may differ if implementation records a better local fit in `tasks.md` and Architect disposes it before merge.

## Scope Boundaries

In scope for future implementation:

- topic guide schema and validation;
- official-documents governance and validation;
- derived taxonomy;
- per-topic Russian guide content;
- answer explanations for assigned tickets;
- source traceability;
- UI integration;
- durable docs;
- process memory updates;
- final strict verification.

Out of scope:

- backend services;
- live network checks in runtime, build, tests, or normal preflight;
- replacing fallback practice source;
- official-bank completeness claims;
- broad Spanish curriculum;
- broad legal manual unrelated to answering assigned tickets;
- raw PDF viewer as the guide UX;
- all-in-one implementation PR.

## Constitution Check

- Spec-first: yes; Analyst intake exists and this Architect plan defines implementation before product edits.
- Testable boundaries: yes; guide coverage, source trace, and official-document validation must live behind testable helper boundaries.
- Test-first bias: yes; each implementation slice must add failing or targeted tests for its validator/UI/content surface before or alongside changes.
- Supervised verification: yes; every acceptance criterion needs recorded command/render/evidence.
- PR-only workflow: yes; future repository-changing work must land through branches and PRs.
- One worktree per task: yes; each implementation slice gets its own isolated worktree and branch.
- Deployability: yes; intermediate PRs must keep the default branch deployable and must not publish incomplete guide claims as final.
- Simplicity: yes; use structured JSON plus small validation helpers before considering new dependencies or a content framework.
- Process memory: yes; `tasks.md` must record decisions, dead ends, known issues, verification evidence, and Implementation Agent feedback.

## Architect Decisions

### Staged Completion

The feature is too large for one implementation PR. Future work must use staged completion:

1. Governance/schema foundation.
2. Taxonomy and coverage planning.
3. Official-document archive seed and reusable manifest validation.
4. Small topic content slices.
5. UI integration for draft/available topic guide pages.
6. Final strict release gate.

Intermediate content PRs may validate only the assigned slice plus manifest consistency. The final release PR must enable strict global validation proving all current 460 IDs are covered, no ID exceeds two categories, and repeated tickets physically render in every assigned topic.

### Draft Versus Publishable Guide State

To keep small PRs mergeable, implementation should support a draft state. Draft topic content may exist in repository before full 460-ticket coverage is complete, but the app must not present draft content as a complete guide. A final task flips the guide to publishable only after strict validation and render evidence pass.

Acceptable patterns:

- a `status: "draft" | "published"` field in the guide metadata;
- validator options that enforce slice-level checks for draft content and strict global checks for published content;
- UI that either hides draft topics from the main navigation or labels them clearly as incomplete internal/draft content until final release.

Implementation must choose one simple pattern and record it in `tasks.md`.

### Structured JSON Before Markdown Rendering

Use structured JSON for the first implementation because the app already imports JSON content and validation is easiest against structured fields. Markdown may be used later for long prose if a future spec justifies it, but this feature needs reliable per-ticket answer explanations, coverage IDs, source trace IDs, and renderable ticket placement.

### Single Source Of Truth For Tickets

Guide content should reference `questionId` and `answerId` instead of copying Spanish source text. The renderer should join guide placements to the canonical question records. This prevents drift while still allowing a ticket to render physically in two topic sections.

### Coverage Manifest

The coverage artifact should record:

- baseline question file path;
- expected question count, currently 460;
- baseline ID set hash or equivalent stable fingerprint;
- topic IDs;
- placement list mapping each question ID to one or two topic IDs;
- per-slice ownership/status fields if needed.

Validation must compare the coverage artifact and guide topic content. They must not diverge.

### Topic Size

Topic pages should stay compact. A future taxonomy PR must propose size thresholds based on observed ticket distribution, but the default guardrail is:

- split a topic when it becomes too broad to explain in one concise page;
- split a topic when ticket explanations become too numerous for reliable review in one PR;
- prefer one small category per content PR, or at most two closely related categories when both are small and share the same official sources.

### Official Source Workflow

Official research should be scoped by topic slice. A content-writing slice must verify and archive only the official sources required for that slice's claims, unless a prior archive task already added the same document.

Do not make every content agent rediscover and reconvert common official documents. Create reusable official-document archive entries early for common sources, then let topic slices cite them.

### Official Documents Path

Use `content/official-documents/` unless implementation finds a concrete repository reason to choose another path. This path separates governed verbatim official text from existing source originals and from unofficial Russian learning content.

### Exact-Text And Currentness Validation

Exact-text validation and currentness validation are separate final work items and must not be bundled with topic writing. Topic-writing agents may add source documents and preliminary checks, but final completion requires dedicated whole-archive verification passes for every official-documents manifest entry, including entries not currently cited by published guide claims. Current guide claims have an additional citation-validity gate:

- exact-text archive pass: compare every official-documents manifest entry's Markdown archive against its official primary source for title, wording, numbering when present, headings, and article/rule/page/section structure as applicable to the source type;
- currentness/effective-status archive pass: confirm every official-documents manifest entry has source-type-appropriate checked-at evidence, status, and official metadata at validation time, including entries marked historical, superseded, or otherwise not usable for current guidance;
- current-claim source-trace pass: confirm each source-traced current guide claim cites only official document/material entries that are current, in force, or otherwise currently valid for the relevant source type at validation time, including laws, rules, formal requirements, manuals/study materials, licensing requirements/pages, road-safety/procedure materials, traffic-sign materials, and any other cited official source type.

### Conflict Handling

If a ticket's expected answer conflicts with current official sources, implementation must not smooth over the conflict. The Implementation Agent records the issue in `tasks.md`; Architect disposes it as one of:

- keep ticket-specific explanation without generalized official claim;
- revise the guide claim to match current official source;
- exclude the unsupported claim from published prose;
- create a follow-up task;
- block final guide publication until resolved.

## Future Implementation Slices

### Slice A: Guide Schema And Validator Foundation

- Add structured guide schema/content placeholder.
- Add coverage and source-trace manifest schemas.
- Add validation helpers with synthetic tests.
- Keep guide status draft and do not require all 460 tickets yet.
- Update `docs_project/` only for schema/location if files are introduced.

### Slice B: Official Documents Governance Foundation

- Create `content/official-documents/`.
- Add section-local `AGENTS.md`.
- Add `manifest.json` schema and validation helper.
- Add durable `docs_project/` documentation.
- Add tests for required metadata, hash fields, currentness fields, conversion notes, and no missing local paths.
- Do not convert a broad official archive unless needed for this foundation.

### Slice C: Taxonomy Discovery And Coverage Baseline

- Analyze all 460 ticket IDs.
- Propose compact topic IDs/titles and split rules.
- Create or update coverage baseline with every current question ID assigned to one or two topics.
- Record evidence proving the baseline count is 460 and all IDs are represented.
- Do not write full topic prose or all ticket explanations.

### Slice D: Shared Official Source Archive Seed

- Archive common official sources needed by multiple guide topics, if not already covered.
- Preserve Markdown exact text and raw evidence as applicable.
- Populate manifest metadata and preliminary currentness evidence.
- Add validation tests for the manifest entries touched.
- Keep final exact-text/currentness validation as separate later slices.

### Slice E: Topic Content Slices

- One PR per topic, or at most two small related topics.
- Add concise Russian material, Spanish terms from assigned tickets, ticket explanations, trap notes, and source trace for only that topic slice.
- Archive or cite only the official documents required by that slice.
- Validate assigned slice structure and update coverage/source-trace evidence.
- Record dead ends, decisions, known issues, and any source conflicts in `tasks.md`.

### Slice F: UI Integration

- Add a separate topic guide section/navigation when enough content is ready for a draft or final surface.
- Render topic list, topic page sections, ticket blocks, local images, answer explanations, vocabulary, and trap notes.
- Prove that a two-category ticket renders physically in both sections.
- Preserve local-first/no-backend behavior and unofficial-support clarity.

### Slice G: Final Strict Release Gate

- Enable strict validation for published guide status.
- Prove all current 460 ticket IDs are covered.
- Prove every ticket has at least one and at most two categories.
- Prove coverage manifest and rendered guide content match.
- Run dedicated exact-text archive validation for every official-documents manifest entry, including entries not currently cited by published guide claims.
- Run dedicated currentness/effective-status archive validation for every official-documents manifest entry, including entries not currently cited by published guide claims.
- Prove every source-traced current guide claim cites only official document/material entries that are current, in force, or otherwise currently valid for the relevant source type.
- Update durable docs and process memory.
- Run full preflight and record evidence.

## Validation Design

### Guide Coverage Helper

Add a small helper such as `scripts/content-topic-guide.mjs` with no file I/O in core functions. It should accept questions, guide content, coverage manifest, and source trace as data and return validation errors.

Required checks:

- question baseline count and IDs match the coverage manifest;
- every current question ID appears in at least one topic;
- no current question ID appears in more than two topics;
- every guide ticket placement references an existing question;
- coverage manifest and guide topic ticket lists agree;
- topic IDs are unique and stable;
- every topic has required sections;
- every ticket block has correct-answer explanation and wrong-answer explanations for every non-correct answer ID;
- every topic Spanish term maps to assigned ticket or answer text;
- source-trace references exist for required official-source claims;
- guide unofficial-support status/disclaimer metadata exists according to product rules.

### Official Documents Helper

Add a helper such as `scripts/official-documents-validation.mjs` with no file I/O in core functions. It should accept manifest entries, known local file metadata, and validation options as data.

Required checks:

- unique document IDs;
- required exact title, official source type, source URL, retrieval date, local path, hash algorithm, hash, source format, conversion method, conversion notes, and currentness fields;
- local Markdown path points inside the official-documents section;
- raw/original evidence path exists for PDF or lossy formats when required;
- currentness/effective-status fields are present for every manifest entry;
- currentness/effective-status validation status is present before final release for every manifest entry;
- exact-text validation status is present before final release for every manifest entry;
- no guide source-trace entry cites a missing, stale, or not-current document for current claims.

Network access may be used by explicit research/download/validation tasks when they are in scope, but runtime, build, normal tests, and app usage must stay offline.

### Render Evidence

Final UI/e2e evidence must include:

- topic guide is reachable as a separate app section;
- at least one topic page renders the required sequence;
- a ticket with an image renders its local image inside the guide;
- at least one ticket assigned to two categories renders as a full ticket block in both topic sections;
- guide does not rely on a raw PDF viewer or live network fetch;
- guide surfaces unofficial-learning-aid status consistently with existing app rules.

## Verification Matrix

| Area | Evidence required |
| --- | --- |
| Planning artifacts | `spec.md`, `plan.md`, and `tasks.md` exist and only planning files changed in this PR. |
| Ticket baseline | Command output showing current question count and ID fingerprint, currently 460 IDs. |
| Coverage validation | Unit tests and `pnpm run validate:content` failure/pass cases for missing ID, over-assigned ID, stale baseline, and manifest/content mismatch. |
| Topic structure | Unit tests for missing Russian material, missing Spanish terms, missing ticket explanations, and missing trap notes. |
| Wrong-answer explanations | Unit tests that every rendered/included ticket explains each non-correct answer ID. |
| Vocabulary provenance | Unit tests that topic Spanish terms come from assigned ticket or answer wording. |
| Physical repetition | Playwright or DOM evidence that a two-category ticket renders as a full ticket block in both topic sections. |
| Official-document manifest | Unit tests for required metadata, hashes, currentness fields, conversion notes, and local paths. |
| Exact-text validation | Dedicated final validation evidence comparing archived Markdown against official primary sources for every official-documents manifest entry, including entries not currently cited by published guide claims and all archived source types. |
| Currentness validation | Dedicated final validation evidence proving every official-documents manifest entry has checked currentness/effective-status evidence and source-type-appropriate status metadata at validation time. |
| Source trace | Validation output showing every official-source-backed claim maps to archived official documents/materials, and every source-traced current guide claim cites only current, in-force, or otherwise currently valid entries for the relevant source type. |
| Docs | `rg` evidence that `docs_project/` documents guide paths, official-documents paths, manifests, validation, and future-document rules. |
| Local-first runtime | Build/e2e evidence that guide uses bundled content/assets and no backend or runtime network fetch. |
| Full preflight | `pnpm run preflight` and `git diff --check` pass before final implementation handoff. |

## Risks And Mitigations

- Risk: full 460-ticket explanations are too large for one review.
  - Mitigation: split content by one small topic or at most two related small topics per PR.

- Risk: draft content merges could look complete to learners.
  - Mitigation: use draft/published state and only expose final guide as complete after strict coverage and source validation.

- Risk: existing broad question `topics` create oversized guide pages.
  - Mitigation: require taxonomy discovery from ticket content and category split criteria.

- Risk: physical repetition causes maintenance drift.
  - Mitigation: store canonical ticket text once in question data and repeat only guide placement/explanation blocks.

- Risk: official legal text is accidentally paraphrased in the archive.
  - Mitigation: local official-documents `AGENTS.md`, exact-text manifest fields, raw evidence, and final exact-text validation.

- Risk: an official source is accurately copied but no longer current, or a reusable archived source is left stale because no published guide claim currently cites it.
  - Mitigation: whole-archive currentness/effective-status validation for every manifest entry, plus a separate current-claim source-trace gate that permits current guide claims to cite only current, in-force, or otherwise currently valid entries.

- Risk: source trace becomes too heavy for topic authors.
  - Mitigation: keep source trace machine-readable but compact, and scope research per topic slice.

- Risk: fallback ticket answer conflicts with current official rules.
  - Mitigation: require explicit process-memory recording and Architect disposition before publication.
