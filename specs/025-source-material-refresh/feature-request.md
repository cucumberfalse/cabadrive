# Feature Request: Source Material Refresh

## Analyst Intake

Analyst role: replacement Cabadrive Analyst only, assigned by Orchestrator.

Repository/worktree: `<worktree>`

Branch: `codex/025-source-material-refresh`

Verified base: `origin/main = 04d2a3279cb3512dbc52625a687e7ba44a3d339b`

Parallel-work warning: preserve all existing dirty diffs, branches, commits, PRs, process memory, and sibling work. This intake owns only this file.

Created feature folder: `specs/025-source-material-refresh/`

## Original Request

The user requests a careful source-material refresh using the listed local PDFs:

- `<user-downloads>/categoriab.pdf`
- `<user-downloads>/MANUAL_Vehiculo_4Ruedas_2023 SA.pdf`
- `<user-downloads>/PREGUNTAS-CATEGORIA-B LIC-AUTOS.pdf`
- `<user-downloads>/agent_roadmap_ru.pdf`
- `<user-downloads>/трудные билеты.pdf`
- `<user-downloads>/ПДД Аргентины.pdf`
- `<user-downloads>/Первое_получение_прав_и_обновление.pdf`

Requested outcomes:

- Process the listed PDFs carefully.
- Verify every fact for current accuracy.
- Update project materials with current facts.
- Compare every ticket from ticket PDFs to existing bundled tickets.
- If a ticket is absent, verify it against current project legal sources/laws and, if still current, include it with cropped image, question/answers text, and image analysis according to project standards.
- Update the existing license acquisition/renewal material using the better PDF as a model while verifying current accuracy.

All listed PDF paths were present during intake path-existence inspection. No exhaustive PDF extraction or content comparison was performed during Analyst intake.

## Relevant Project Context

Cabadrive is a local-first, offline-capable web trainer for experienced Russian-speaking drivers preparing for the CABA theory exam. Official Spanish text remains primary, while Russian translations, explanations, simplified learner text, and image analysis are unofficial learning support.

The current app uses `unofficial_b_fallback` practice-question content because a complete public official CABA category B question bank has not been confirmed. Current practice questions come from a non-official category B/CABA simulator source, with local offline images and complete reviewed Russian translations, explanations, learner difficulty metadata, and image metadata for the existing 460-ticket fallback bank.

Official source documents are governed under `content/official-documents/`. Verbatim Spanish official source archives must not be paraphrased, translated, simplified, or mixed with learner notes. Russian learning material derived from official sources belongs outside the official archive, including `content/primary-sources/` for the source reader and `content/guide/` for learning/process guides.

Ticket learning support is sharded under:

- `content/translations/ru/<range>.json`
- `content/explanations/ru/<range>.json`
- `content/image-metadata/question-images/<range>.json`

Generated compatibility indexes should not be edited by hand. Adding or materially changing tickets requires refreshed translations, explanations, image metadata/usage mappings, generated indexes, deterministic evidence, and validation.

The existing process guide lives under `content/guide/caba-exam-process.ru.json` and presents unofficial Russian support for CABA B1/private-car license acquisition. It stores official GCBA/ANSV URLs, checked dates, currentness labels, official-action links, volatile-information warnings, and Russian explanatory prose. Fees, sedes, turn availability, document lists, Boti/miBA screens, and similar administrative details are volatile and must be verified against official sources before release.

## Scope

In scope for the planned feature:

- Inventory and classify the supplied PDFs by role: ticket source, official/manual source, Russian learning aid, roadmap/instructions, and license process material.
- Extract ticket candidates from the relevant ticket PDFs after Architect planning defines the exact pipeline and evidence expectations.
- Compare extracted ticket candidates against existing bundled tickets by stable Spanish question/answer/correct-answer/image identity, not only by loose text similarity.
- For absent ticket candidates, determine whether they are in scope for Cabadrive category B/CABA practice and whether they remain current under official legal/project source evidence.
- Add only current, in-scope absent tickets with required local cropped image assets when applicable, Spanish question/answer text, correct-answer data, source trace, Russian translations, explanations, learner difficulty, image metadata, and per-question image usage analysis according to current project standards.
- Refresh source archive, primary-source reader, topic materials, vocabulary/process guide, or related docs only where current verified facts require it.
- Update license acquisition/renewal learning material using the best supplied PDF as a model, while independently validating every current claim against official sources.
- Record evidence for extraction, comparison, legal/currentness validation, image cropping/analysis, and content validation.

Out of scope unless Architect explicitly scopes it later:

- Treating any supplied non-official PDF as an official complete CABA category B bank without independent validation.
- Runtime backend, cloud sync, or network-dependent user-facing behavior.
- Raw PDF viewer support in the app.
- Broad UI redesign unrelated to rendering newly verified content.
- Exhaustive PDF extraction/comparison during Analyst intake.

## Constraints

- Repository workflow requires Orchestrator-first routing, Analyst intake, Architect planning, and Implementation Agent execution before repository content changes beyond this intake.
- Implementation must preserve sibling work and use the assigned isolated worktree/branch/PR slice.
- Official Spanish source archive content must remain verbatim and Spanish-only.
- Russian translations, explanations, simplifications, and learner notes must remain clearly labeled unofficial learning support and stored outside the official archive.
- Current-content claims must cite current/currently valid official sources; stale, repealed, superseded, or unknown-currentness documents must not support live guide claims.
- The app remains local-first and offline after build; all rendered ticket images must be local committed assets with validation evidence.
- Existing generated compatibility indexes should be regenerated through project tooling rather than edited manually.
- Runtime verification should follow the repository validation contract, including content validation and quality validation where ticket support or image metadata changes.

## Assumptions

- The supplied PDFs are user-provided source candidates, not automatically trusted project sources.
- Some PDFs may contain unofficial, outdated, jurisdiction-mixed, or duplicate material; currentness and scope must be determined before content is accepted.
- Ticket PDFs may differ from existing tickets through punctuation, ordering, answer wording, image crop, or source formatting; comparison will need structured normalization plus manual review for edge cases.
- License acquisition and renewal procedures may have changed since the PDFs were created; official GCBA/ANSV pages are the release authority for current procedural claims.
- If a ticket appears in a supplied PDF but cannot be validated as current, in-scope, and legally/source supported, it should be recorded as rejected or pending rather than bundled as active practice content.
- No clarification is blocking Analyst intake.

## Risks

- Legal/currentness drift: traffic rules, administrative procedures, fees, sedes, booking paths, and required documents may have changed after the PDFs were produced.
- Source authority risk: supplied PDFs may be unofficial, copied, incomplete, or not specific to current CABA category B/B1 exam requirements.
- Duplicate detection risk: near-duplicate tickets may be incorrectly added as new if comparison relies only on raw text.
- Image rights and evidence risk: new cropped images need source/license/attribution/currentness evidence and must be stored locally in a way that satisfies project standards.
- Image-analysis risk: added image-backed tickets require actual visual inspection, stable metadata, question-specific usage mappings, answer-critical detail mapping, and contradiction checks.
- Validation blast radius: adding tickets can affect translations, explanations, image metadata, difficulty metadata, topic materials, search, exam behavior, generated indexes, and deterministic evidence.
- Russian learner-content risk: unofficial support must not be presented as official text or allowed to drift from verified Spanish/current legal facts.
- Workflow risk: this feature is content-heavy and should be planned carefully before implementation to avoid mixing extraction, legal research, asset work, and guide updates without auditable evidence.

## Open Questions

None needed for Analyst intake.

Items for Architect/Implementation to resolve without blocking intake:

- Which supplied PDF is the authoritative model for license acquisition/renewal structure after current official-source validation?
- Which PDFs qualify as ticket sources versus supporting learning/reference material?
- What exact normalization and review workflow should be used for ticket comparison?
- What official legal/source set is sufficient to accept or reject each absent ticket candidate?
- Whether implementation should be split into multiple PR slices, for example source inventory/currentness, ticket comparison/additions, image assets/metadata, and license-process guide refresh.

## Acceptance Expectations

The finished feature should provide evidence-backed project updates, not just extracted PDF text.

Expected acceptance outcomes:

- Every supplied PDF is inventoried with its role, source/status assessment, and whether it was used, rejected, or retained only as reference.
- Ticket PDFs are exhaustively extracted during Implementation after Architect planning, and every ticket candidate is compared against existing bundled tickets with recorded evidence.
- Each absent candidate has a recorded disposition: accepted as current/in-scope, duplicate, out-of-scope, outdated, unsupported, ambiguous, or deferred.
- Accepted new tickets include Spanish question and answer text, correct answer, stable IDs, source trace, local image/crop when applicable, governed Russian translation and explanation, difficulty metadata, and image metadata/usage analysis according to existing project standards.
- Rejected or deferred tickets are documented with reasons and source/currentness evidence.
- License acquisition/renewal material is updated only with claims verified against current official GCBA/ANSV or other accepted official sources, with checked dates and volatile-info warnings where appropriate.
- Official archive/source-reader/process-guide/materials/docs are updated only as needed and in their correct governed locations.
- Generated indexes and deterministic validation evidence are refreshed through project tooling.
- Required validation passes are recorded, expected to include at least content validation and quality validation when ticket learning support or image metadata changes.
- The UI continues to label official Spanish text and unofficial Russian support correctly, and it does not claim complete official B-question coverage unless that is independently proven and Architect-scoped.

## Implementation Boundary

Exhaustive PDF extraction, ticket-by-ticket comparison, currentness/legal validation, source archive updates, ticket additions, image cropping, image analysis, guide updates, generated evidence refresh, tests, commits, pushes, and PR creation belong to Implementation Agent work after Architect creates `spec.md`, `plan.md`, and `tasks.md`.

## Final Analyst Validation

- Analyst validation pass: passed
- Final Analyst validation completed at: 2026-05-20T19:43:12-03:00
- Analyst validated effective content head: f64ffa445b00279d8092f56983eb31f0dace6520
- Validation scope: PR #167 / `codex/025-source-material-refresh` first evidence/intake slice only. This slice establishes feature memory plus PDF inventory, extraction feasibility, ticket-candidate comparison, candidate dispositions, and follow-up recommendations; it does not attempt the full larger source-material refresh in one PR.
- User intent fit for this slice: passed. The PR correctly inventories all seven supplied PDFs, compares extracted ticket candidates from ticket-source PDFs against the existing bundled bank where tooling permits, records that no candidate is currently safe to import, and avoids unsupported ticket/content changes.
- Ticket import deferral: accepted for this PR, not a gap. The evidence records 642 structured Spanish candidates, 445 duplicates, 62 ambiguous, 135 outdated, and 0 `accepted-current`; absent/nonduplicate candidates lack sufficient current official/legal support, reliable correct-answer evidence, and image/crop provenance for safe import.
- Remaining user-intent work intentionally deferred by Architect disposition: a separate process-guide refresh remains the recommended next slice, using `Первое_получение_прав_и_обновление.pdf` only as a structure/reference model with every retained acquisition/renewal claim independently verified against current official GCBA/ANSV sources. Later ticket work, if assigned, should start with the 9 ambiguous `categoriab.pdf` candidates and require full currentness/support/image evidence before any import.
- Not reopened for this PR: no gap found in the first evidence/intake slice against the recorded Analyst acceptance expectations and Architect dispositions.
