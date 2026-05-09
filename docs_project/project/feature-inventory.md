# Feature Inventory

## MVP Features

- Official source registry with source ownership, jurisdiction, verification date, and hashes.
- Governed official-documents archive foundation at `content/official-documents/` for verbatim official source materials, manifest metadata, exact-text/currentness validation expectations, and future source-document rules.
- Content validation pipeline for source records, exam config, fallback question data, local images, and unofficial support layers.
- Structured image metadata and per-question image usage validation for the current image-backed fallback questions, including answer-critical detail mappings and stale image/question fingerprint checks.
- Category B practice question presentation in Spanish with source traceability and non-official fallback labeling.
- Complete current-bank unofficial Russian translation and explanation layers, clarified at product/status level, revealed intentionally inside question practice instead of shown by default, and protected by deterministic alignment evidence.
- Learning mode with answer feedback and linked weak-topic hints.
- Exam mode driven by `content/config/caba-exam-format.json` with approximate/exact status labeling.
- Mistake tracking and repeated-error review loop.
- Exam-oriented vocabulary module with topic grouping and search.
- Topic materials module that renders the draft `006` topic study guide with topic list/detail, Russian learning material, Spanish terms, trap notes, canonical ticket blocks, and local images.
- Guide module focused on CABA-vs-RF differences that matter for exam outcomes.
- Offline-capable local-first behavior after build.
- Docker-only local runtime with `make build`, `make up`, and `make down`.

## Current Content Mode

- Current question content mode: `unofficial_b_fallback`.
- Reason: no complete public official CABA category B question bank has been confirmed.
- Source used for practice questions: `bandinopla/simulador-test-de-conducir`, category B/CABA, Apache-2.0, explicitly non-official upstream.
- Important boundary: A/A4, motorcycle, and other non-B question sources are not used for practice questions.
- Source guard behavior: this is a source-level eligibility rule, not a text-level topic filter. Valid category B practice material may mention motorcycles, motovehicles, ciclomotors, parking areas, lanes, signs, or other shared-road topics when the source `practiceQuestionScope` explicitly allows category B.
- Question images are part of the learning surface and are stored locally in the repository for offline use.
- Current image metadata coverage is complete for 275 unique local images and 276 image-backed question references. Most image entries are deterministic low-confidence baseline records with explicit uncertainty pending manual visual review; high-risk `b-fallback-001` has precise cyclist/right-arm signal metadata and regression validation.

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
