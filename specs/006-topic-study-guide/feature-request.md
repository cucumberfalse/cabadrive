# Feature Request: Topic-Based Preparation Guide From Existing Tickets

## Request Intake

Create a new web section for a Russian-language preparation guide based on the exam tickets already present in the project materials.

The guide should organize the existing tickets into small, practical topic blocks rather than one large monolithic manual. Example topic directions from the requester include signs, hand gestures, intersection passing/order of movement, driving outside the city, and similar compact exam-relevant categories.

The final guide must include every ticket from the current local ticket set. A ticket may appear in two categories when genuinely useful, but not in more than two. If a ticket belongs to two topics, it should physically appear in both guide sections rather than only as a cross-reference.

## Original User Request

The user asked, in Russian, to add preparation materials based on the existing tickets:

- structure the materials by categories such as signs, gestures, intersection passing, driving outside the city, etc.;
- keep the blocks not too large;
- ensure all questions eventually appear in the guide;
- for each topic, use the structure:
  - clear simple Russian-language material;
  - useful Spanish words;
  - tickets from the topic with the correct answer and an explanation of why it is correct and why the other answers are wrong;
  - final notes about traps and misleading patterns found in tickets from the topic;
- explain, where possible, why rules are shaped that way and how they make traffic more understandable and safe;
- avoid excess material: include only what is needed to answer the tickets correctly;
- instruct the Architect to decompose the work as atomically as possible so each agent's context stays small;
- validate that absolutely all tickets are included in one of the categories;
- allow a ticket to appear in two categories, but not more than two;
- first ask clarifying questions, then create a branch and add the Analyst artifact.

## Clarifying Answers

The user answered:

1. The tickets are the ones already in the project materials.
2. This request is for designing the feature, not immediately writing all guide content.
3. Useful Spanish words should be taken from the ticket wording.
4. The category list should be derived from analysis of all tickets, not fixed upfront.
5. If a ticket belongs to two categories, it should physically repeat in both categories.
6. The final guide should be web-facing, like a wiki or simple HTML section, added to the app as a separate section.

Additional user clarification:

- During preparation of the materials, the content must be checked against official sources of truth on the internet, including Argentina traffic rules, CABA traffic rules, official preparation materials, and licensing requirements.
- The guide must not contain incorrect information.
- When it does not make the material harder to understand, topic explanations may slightly expand beyond the ticket text using official sources.
- Official source materials used for these requirements must be downloaded from the internet in full and saved inside the repository in a separate "official documents" area.
- Official documents should be stored as Markdown, with no rewriting or paraphrasing of the source text. For laws, rules, and formal requirements, the wording, structure, numbering, headings, and document title must be preserved as exactly as possible.
- Each saved official document must record its exact document title, source URL, retrieval date, and local path.
- Project documentation must explain where the official documents and their metadata/manifest live.
- After the official-document archive and guide work are complete, final implementation tickets must include a separate validation step proving that archived law/rule texts match the original official sources exactly. This is mandatory because these are official laws and rules.
- Official source validation must also prove that each law, rule, manual, or formal requirement used by the guide is current and in force at the time of validation, and has not been repealed, superseded, or amended in a way that makes the archived text stale.
- Because this creates a durable official-sources-of-truth section, exact-text and currentness requirements must apply to the entire section, including any official documents added in future work.
- These section-wide rules must be documented in durable project documentation and in section-local agent/system instructions for future agents, such as an `AGENTS.md` or equivalent file inside the official-documents area.

## Project Context

Cabadrive is a local-first, static React/TypeScript/Vite web trainer for Russian-speaking drivers preparing for the CABA theory exam.

Relevant repository constraints:

- The current app is a static SPA/PWA with no backend in MVP.
- Runtime-affecting behavior must respect the Docker-only local runtime contract: `make build`, `make up`, `make down`.
- Official Spanish text remains primary.
- Russian translations, explanations, guide content, and trap notes are unofficial learning aids and must keep that status clear.
- The current question content mode is `unofficial_b_fallback`, not an official complete GCBA question bank.
- Current practice questions come from `bandinopla/simulador-test-de-conducir`, category B/CABA fallback data.
- Existing content layers include questions, Russian translations, Russian explanations, vocabulary, and a condensed guide, but coverage is currently partial for translations/explanations and not yet organized as the requested complete topic guide.
- The requested guide must use the existing tickets as its coverage driver, but rule/procedure explanations should be verified against current official sources before publication.
- Official-source enrichment is allowed only when it supports correct ticket answering without turning the guide into a broad textbook.
- Official source documents used for guide verification should become durable local project materials, not only transient browser links.
- The official-documents area is expected to become a governed repository section, not a one-off feature folder. Its rules should survive this feature and guide future agents adding or updating official source documents.

Current local content observed during intake:

- `content/questions/caba-b.unofficial-fallback.questions.json` contains 460 questions.
- `content/translations/ru.translations.json` currently contains 10 translation entries.
- `content/explanations/ru.explanations.json` currently contains 5 explanation entries.
- `content/vocabulary/ru.vocabulary.json` currently contains 5 vocabulary entries.
- `content/guide/ru.condensed-guide.json` currently contains 3 guide entries.

The existing question records already have technical `topics`, but these are not sufficient as the final guide taxonomy because:

- categories must be derived specifically for the new pedagogical guide;
- current topics are broad and may not match compact wiki-like learning blocks;
- some current questions have more than two topic tags, while the requested guide placement allows at most two categories per ticket.

## Source Review

Internal sources read for intake:

- `.specify/memory/constitution.md`
- `docs_project/README.md`
- `docs_project/project-idea.md`
- `docs_project/project/frontend/frontend-docs.md`
- `docs_project/project/backend/backend-docs.md`
- `docs_project/project/feature-inventory.md`
- `docs_project/screens/learning-and-exam-flows.md`
- `docs/specify/README.md`
- `docs/specify/03_content_strategy.md`
- `docs/specify/04_data_model.md`
- `content/questions/caba-b.unofficial-fallback.questions.json`
- `content/translations/ru.translations.json`
- `content/explanations/ru.explanations.json`
- `content/vocabulary/ru.vocabulary.json`
- `content/guide/ru.condensed-guide.json`

Official external source candidates checked during intake on 2026-05-09:

- Argentina national traffic law, Ley 24.449: https://www.argentina.gob.ar/normativa/nacional/ley-24449-818/texto
- Updated national regulatory decree, Decreto 779/1995: https://www.argentina.gob.ar/normativa/nacional/30389/actualizacion
- 2025 national regulatory update touching Ley 24.449 / Decreto 779/95: https://www.argentina.gob.ar/normativa/nacional/decreto-196-2025-410682/texto
- CABA Ley 2148 / Código de Tránsito y Transporte: https://buenosaires.gob.ar/gcaba_historico/normativa-general/ley-2148
- GCBA material page for the theoretical exam, including the mandatory four-wheel urban driving manual: https://buenosaires.gob.ar/licenciasdeconducir/curso-de-educacion-vial-para-otorgamiento-de-licencia/material-de-estudio-para
- GCBA road-safety course page for license granting: https://buenosaires.gob.ar/gcaba_historico/infraestructura/movilidad/curso-de-educacion-vial-para-otorgamiento-de-licencia
- GCBA license overview and requirements entry point: https://buenosaires.gob.ar/gobierno/licencias-de-conducir
- GCBA beginner-driver rules page: https://buenosaires.gob.ar/tramites/otorgamiento-de-licencia-de-conducir/casos-especiales/casosespeciales/principiantes
- GCBA practical guide for road incidents: https://buenosaires.gob.ar/sites/default/files/2023-02/Gu%C3%ADa%20pr%C3%A1ctica%20siniestros%20viales.pdf

These sources should be treated as intake-time candidates, not a frozen final legal research bundle. Architect and implementation tasks should require current-source verification at the time each topic's material is produced.

## Official Document Archive Requirement

The feature should introduce or use a dedicated repository area for official documents, conceptually "official documents." The Architect should choose the exact path and schema, but the area must be easy to discover and documented in `docs_project/`.

Official source materials that support guide requirements or topic explanations must be downloaded in full from their official internet source and saved locally in Markdown form.

Section-wide governance:

- exact-text preservation applies to every official document in the official-documents area, not only the initial documents needed for this guide feature;
- currentness/effective-status validation applies to every official document in the official-documents area, including documents added later by future agents;
- future additions to the section must not bypass exact-text, source metadata, retrieval date, integrity metadata, currentness, amendment/repeal, and final validation requirements;
- the section must contain local agent instructions, such as `AGENTS.md` or an equivalent file, that tell future agents these rules are mandatory for any document added or edited in the section;
- durable `docs_project/` documentation must describe the section purpose, location, manifest, validation expectations, and future-document rules.

Archive rules:

- preserve the exact official document title;
- preserve official wording without translation, rewriting, summarization, or paraphrase;
- preserve legal/rule numbering, section headings, article numbers, bullet structure, and formal terminology as closely as Markdown allows;
- include source URL, retrieval date, and preferably retrieval timestamp/time zone;
- include local path and a stable content hash or equivalent integrity metadata;
- record currentness/effective-status evidence: whether the source is the current updated text, whether the source has repeal/supersession/amendment notices, and the date this was checked;
- when a law or rule has amendments, archive and cite the current/consolidated/updated text when available, or explicitly record how amendments were applied or why the source cannot be treated as current production guidance;
- distinguish between the local verbatim official document and any Russian learning explanation derived from it;
- record any conversion limitations, such as PDF extraction artifacts, tables, images, annexes, or formatting that could not be represented cleanly in Markdown;
- if the source is a PDF or other non-HTML file, require a verification approach that proves the Markdown text has not been meaningfully altered from the source.
- require a final, separate validation pass before completion that compares archived law/rule Markdown text against the official primary source and confirms exact textual correspondence for titles, wording, numbering, headings, and rule/article structure.
- require a final, separate currentness validation pass before completion that confirms each archived law/rule source is still in force or clearly marks it as not valid for current guide claims.

The local Markdown archive is for traceability and review. The Russian guide may cite or derive from it, but must not replace official wording with unofficial interpretations in the official document area.

## Desired User Experience

The user should be able to open a separate preparation-guide section in the web app and browse concise topic pages.

Each topic page should include:

1. A short, clear Russian explanation of the rule or concept.
2. Practical reasoning for the rule where useful: why it makes traffic safer, more predictable, or easier to coordinate.
3. Useful Spanish words and constructions taken from the tickets in that topic.
4. The tickets assigned to that topic, with:
   - original Spanish question text;
   - answer options;
   - correct answer;
   - Russian explanation of why the correct answer is correct;
   - Russian explanation of why each other answer is wrong;
   - local image when the source ticket has one.
5. A compact trap section for patterns that can mislead users in that topic, especially:
   - negations;
   - exceptions;
   - similar-looking answers;
   - terms that are easy to mistranslate;
   - questions asking what is prohibited rather than what is allowed.

The guide should not become a full driving-school textbook or a general Spanish course. It should contain exactly enough material to answer the included tickets correctly.

When official sources clarify the reason behind a rule, the topic prose should briefly explain that reason in plain Russian if it helps understanding. This enrichment must stay compact and must not introduce unsupported, outdated, or speculative claims.

## Scope Expectations

In scope:

- Design a web-facing topic guide section.
- Derive guide categories from analysis of the current 460 local tickets.
- Define a content structure that supports compact topic pages.
- Define how a ticket is assigned to one or two guide categories.
- Require all 460 current tickets to appear in at least one guide category.
- Require no ticket to appear in more than two guide categories.
- Require the Spanish vocabulary for each topic to come from ticket wording.
- Require every included ticket explanation to explain both the correct answer and the incorrect alternatives.
- Preserve clear unofficial-learning-aid labeling for Russian explanations, vocabulary, and trap commentary.
- Define validation expectations proving full ticket coverage and maximum category duplication.
- Require official-source verification for rule, procedure, number, document, licensing, road-safety, and traffic-sign claims that go beyond directly restating a ticket.
- Allow modest official-source-based enrichment when it improves understanding and does not make the topic harder to study.
- Require citation/traceability metadata for official sources used by each guide topic.
- Require a local Markdown archive of official sources used for guide verification.
- Require official document archive entries to preserve exact titles, wording, numbering, source URLs, retrieval dates, local paths, and integrity metadata.
- Require official document archive entries to record current/effective status, amendment/repeal checks, and checked-at dates.
- Require guide claims to use only sources validated as current and in force, unless a non-current source is included only as historical context and is clearly excluded from current rule guidance.
- Require durable `docs_project/` documentation that explains where official documents, archive metadata, source trace data, and guide content live.
- Require durable `docs_project/` documentation to state that exact-text and currentness rules apply to all documents in the official-documents section, including future additions.
- Require section-local agent/system instructions for the official-documents area so future agents cannot treat the archive as ordinary editable prose.

Out of scope for this intake:

- Writing the full guide content for all 460 tickets.
- Implementing product code.
- Changing existing content files.
- Adding new official-source claims.
- Claiming the current fallback question set is a complete official GCBA bank.
- Designing a backend or online service.

Note: official-source verification is in scope; claiming the fallback ticket set itself is official remains out of scope.

## Architect Handoff Notes

The Architect should decompose this feature maximally atomically so implementation agents do not need to load the entire 460-ticket corpus in one context window.

Expected decomposition direction:

- separate taxonomy discovery from UI integration;
- separate content schema/validation from rendered guide pages;
- split guide content production by small topic groups or category slices;
- require each slice to update only its assigned guide content and coverage evidence;
- keep a machine-readable coverage manifest so slices can be validated independently and then globally;
- keep a machine-readable source-trace manifest so each topic can record official sources checked, checked date, and which claims they support;
- keep or define a machine-readable official-document manifest that maps each archived Markdown document to its exact title, source URL, retrieval date, local path, hash, conversion notes, current/effective status, amendment/repeal check evidence, and checked-at date;
- define a global validation gate that proves every question id is assigned to at least one guide category and no more than two;
- define evidence that every category page has the requested internal structure before the feature is considered complete.
- define a review path for any claim that cannot be verified from official sources; unverified claims should be omitted, rewritten as ticket-specific wording, or marked for Architect disposition rather than published as fact.
- reserve final task tickets specifically for official-document archive validation, after source download/conversion and guide-content work are otherwise complete.
- reserve final task tickets specifically for currentness validation, proving that official laws/rules/requirements used by the guide are still valid at validation time and have not been repealed or modified in a way that changes the guide claim.
- include tasks for durable project documentation and official-documents section-local agent instructions that make these rules mandatory for all current and future documents in the section.

The Architect should explicitly prevent a single implementation task from requiring all topic prose, all ticket explanations, all vocabulary, UI integration, and validation work in one PR.

The Architect should also keep official-source research scoped per topic slice. Each slice should verify only the official sources needed for its assigned ticket group, so research and writing stay small enough for reliable review.

The Architect should decide whether official-document archiving is a separate prerequisite task or a per-topic prerequisite, but should avoid making every content-writing agent rediscover and reconvert the same official documents.

The final official-document validation tickets should not be bundled with content writing. Their job is to verify that local Markdown copies of laws, rules, and formal requirements match official primary sources exactly, including document titles, wording, numbering, headings, and article/rule structure. They must also verify that the archived source is current and in force at validation time, not repealed, superseded, or materially amended after retrieval. Any mismatch or currentness failure should block completion until resolved or explicitly documented as an unavoidable conversion/status limitation with retained source evidence.

The Architect should treat the official-documents area as a governed content subsystem. It should have local instructions for agents and durable documentation that make future maintenance rules explicit: do not paraphrase official text, do not hand-edit legal/rule wording except to correct against the source, do not add a document without source/currentness metadata, and do not rely on a source until currentness is verified.

## Acceptance Expectations

The eventual feature should be accepted only when evidence shows:

- all current local ticket ids from `content/questions/caba-b.unofficial-fallback.questions.json` are present in the guide coverage map;
- current baseline count is 460 tickets, and the validation should fail if the source count changes without guide coverage being updated;
- every ticket appears in at least one category;
- no ticket appears in more than two categories;
- tickets assigned to two categories physically render in both relevant category sections;
- every category page includes the required sequence: Russian material, Spanish words from ticket wording, tickets with answers and explanations, and trap notes;
- every ticket explanation states why the correct answer is correct and why the other answers are incorrect;
- topic prose remains concise and exam-focused;
- rule/procedure/legal/numeric claims in topic prose are traceable to official sources checked during implementation;
- any official-source-based enrichment is short, relevant to answering the tickets, and does not make the topic harder to understand;
- no known unsupported or source-conflicting rule claim remains in published guide material;
- every official source used to support guide claims is archived locally as Markdown in the dedicated official-documents area;
- each archived official document preserves exact title, source URL, retrieval date, local path, and integrity metadata;
- legal and rule text in the official-document archive preserves source wording, numbering, headings, and structure without editorial rewriting;
- final dedicated validation tickets prove that archived law/rule Markdown texts match the official primary sources exactly for title, wording, numbering, headings, and article/rule structure;
- any mismatch found during final official-document validation blocks completion until fixed or explicitly dispositioned with evidence;
- final dedicated currentness validation proves each law/rule/formal requirement used for guide claims is current and in force at validation time;
- any repealed, superseded, or materially amended source is removed from current guide claims or replaced with the current official source before completion;
- conversion limits are documented for any archived source whose original format cannot be represented perfectly in Markdown;
- `docs_project/` documents where the official documents, source manifest, guide source trace, and guide content are stored;
- `docs_project/` documents that exact-text and currentness validation rules apply to the whole official-documents section and future additions;
- the official-documents section contains local agent instructions, such as an `AGENTS.md` or equivalent file, that enforce exact-text preservation, metadata, currentness, and validation rules for future agents;
- unofficial Russian guide/explanation/vocabulary status remains visible and consistent with existing product content rules;
- the guide is reachable as a separate app section;
- local preflight passes after implementation.

## Risks

- The current content set is unofficial fallback material, so guide copy must not imply official completeness.
- Deriving categories from all 460 tickets may create categories that are too broad unless Architect defines size and cohesion criteria.
- Physically repeating tickets in two categories can create duplicated content-maintenance work unless the data model separates source ticket data from category placement.
- Existing question `topics` may tempt implementation to reuse broad tags directly; this may fail the user's request for compact pedagogical blocks.
- Full ticket explanations can become large. The architecture should support incremental content completion and validation without overloading a single agent.
- Vocabulary extracted from ticket wording needs clear deduplication rules so repeated Spanish words do not make topic pages noisy.
- Official traffic rules and licensing requirements can change; topic slices need checked-at metadata and should avoid stale copied assumptions.
- Conflicts may appear between a fallback ticket, older project content, and current official sources. The feature memory should require explicit disposition rather than silently publishing a dubious explanation.
- Official-source enrichment can bloat the guide if not constrained by the "helps answer tickets" rule.
- Converting official PDFs or HTML pages into Markdown can accidentally alter numbering, tables, footnotes, or article structure; validation/review must treat the archived official text as high-risk.
- If only derived Markdown is stored without enough source metadata, future agents may be unable to prove which official version was used.
- Without a final independent validation ticket, earlier conversion mistakes in official legal/rule text could silently become trusted project memory.
- A source can be official but no longer current. Without repeal/amendment/currentness checks, the guide could accurately quote outdated law and still teach the wrong rule.
- If section-wide rules are only captured in a feature spec and not in durable docs plus local agent instructions, future agents may add official documents as ordinary Markdown and accidentally weaken the archive.

## Open Questions For Architect

- What is the best durable content format for the guide: static JSON content rendered by React, Markdown converted at build time, or simple HTML-like structured content?
- Should the guide taxonomy live separately from existing question `topics`, or should the existing topics be migrated/refined as part of this feature?
- What category-size threshold should trigger splitting a large topic into smaller guide pages?
- How should validation report tickets that are unassigned or over-assigned so small implementation slices can fix them quickly?
- How should physical repetition be rendered while keeping a single source of truth for ticket text and answer data?
- What official-source trace schema should each topic use to show which legal/manual/procedure sources were checked?
- How should the workflow handle a ticket whose expected answer appears inconsistent with current official sources?
- What repository path should own the official-document Markdown archive and its manifest?
- Should original downloaded files be kept as evidence alongside Markdown when the source format is PDF or otherwise hard to convert without loss?
- What validation is needed to detect accidental edits to archived official legal/rule text?
- What exact comparison method should final validation use for HTML and PDF sources so "matches the primary source" is provable rather than only asserted?
- Which official pages or legal metadata should be treated as authoritative for proving that a law/rule is current, in force, repealed, superseded, or amended?
- What exact local agent-instruction file should the official-documents section use: `AGENTS.md`, `README.md`, both, or another repository-standard file?
