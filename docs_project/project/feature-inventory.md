# Feature Inventory

## MVP Features

- Official source registry with source ownership, jurisdiction, verification date, and hashes.
- Governed official-documents archive at `content/official-documents/` for verbatim official source materials, manifest metadata, exact-text/currentness validation expectations, and future source-document rules. The archive currently has a broader manifest than the original three-source seed; implementation-time inventory for feature `016` observed 19 entries.
- Content validation pipeline for source records, exam config, fallback question data, local images, and unofficial support layers.
- Category B practice question presentation in Spanish with source traceability, ticket IDs in learning mode, and non-official fallback labeling.
- Unofficial Russian translation and explanation layers, clarified at product/status level and revealed intentionally inside question practice instead of shown by default.
- Learning mode with answer feedback and linked weak-topic hints.
- Exam mode driven by `content/config/caba-exam-format.json` with approximate/exact status labeling.
- Mistake tracking and repeated-error review loop.
- Exam-oriented vocabulary module with topic grouping and search.
- Topic materials module that renders the draft `006` topic study guide with topic list/detail, Russian learning material, Spanish terms, trap notes, canonical ticket blocks, governed Russian translations where available, concise missing-translation fallback, learner difficulty, and local images.
- Process guide module that renders the bundled Russian CABA B1/private-car `Otorgamiento` guide with official GCBA/ANSV links, checked dates, volatile-info warnings, adjacent-path callouts, and Spanish administrative glossary.
- Validated learner-difficulty layer for all current questions and topic materials using `green`, `blue`, `yellow`, and `red` levels with dimensions, Russian rationale, provenance, and stale-source fingerprints.
- Planned `Источники` / official primary-source reader from feature `016`, not implemented in the current product yet: it should expose every official manifest entry as a local reference surface, default to simple Russian, allow full Russian translation and original Spanish views, and keep all Russian source-reader content outside `content/official-documents/`.
- Guide module focused on CABA-vs-RF differences that matter for exam outcomes, including compact parking-clearance contrast notes where source-supported by the current fallback practice set.
- Offline-capable local-first behavior after build.
- Docker-only local runtime with `make build`, `make up`, and `make down`.

## Current Content Mode

- Current question content mode: `unofficial_b_fallback`.
- Reason: no complete public official CABA category B question bank has been confirmed.
- Source used for practice questions: `bandinopla/simulador-test-de-conducir`, category B/CABA, Apache-2.0, explicitly non-official upstream.
- Important boundary: A/A4, motorcycle, and other non-B question sources are not used for practice questions.
- Source guard behavior: this is a source-level eligibility rule, not a text-level topic filter. Valid category B practice material may mention motorcycles, motovehicles, ciclomotors, parking areas, lanes, signs, or other shared-road topics when the source `practiceQuestionScope` explicitly allows category B.
- Question images are part of the learning surface and are stored locally in the repository for offline use.
- Official primary-source documents are separate from practice-question availability. They support source traceability and future reader behavior, but their presence does not make the current practice set an official full GCBA question bank.

## Post-MVP Candidates

- Spaced-repetition scheduling.
- Progress import/export.
- Additional jurisdictions outside CABA.
- Additional translation languages.
- Alternative frontend framework evaluation.

## Explicit Out Of Scope (Current)

- Full Spanish-language learning curriculum.
- Practical driving instruction workflows.
- User accounts and cloud sync.
- Always-on backend services.
