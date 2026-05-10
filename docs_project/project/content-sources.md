# Content Sources And Official Documents

Cabadrive separates learning content from official source archives.

## Official Documents Archive

The governed official-documents area lives at:

```text
content/official-documents/
  AGENTS.md
  manifest.json
  documents/
  originals/
  validation/
```

This area is for verbatim official source documents and materials that support Cabadrive source traceability. It is not a place for Russian explanations, summaries, translations, or topic-guide prose.

`content/official-documents/manifest.json` is the machine-readable manifest for the archive. It is no longer only a three-source seed: as of the Slice A implementation-time inventory on 2026-05-10, the manifest contains 19 official-document entries covering national traffic law and regulation, CABA traffic/VTV materials, vehicle-document procedures, road-incident/study materials, and related penal, civil/commercial, and insurance sources.

Question-image semantic metadata is also outside the official archive. Current practice-image metadata lives under `content/image-metadata/` with review evidence under `content/validation/`; it describes local fallback practice images for learning-support validation and must not be treated as official GCBA source text.

## Ticket Learning-Support Lifecycle

Current question-card Russian translations, Russian explanations, and question-image metadata are maintained from reviewed range shards:

```text
content/translations/ru/<range>.json
content/explanations/ru/<range>.json
content/image-metadata/question-images/<range>.json
```

The adjacent monolithic files are generated compatibility indexes. Do not edit them by hand.

When adding a ticket:

- add or validate the Spanish source tuple, answer IDs, correct answer, source ID, and local image/hash when an image exists;
- if an image exists, inspect the actual local image and add question-neutral shared image metadata with stable object/detail/region IDs;
- add a question-specific image usage mapping that classifies referenced details as answer-critical/highlight, supporting, distractor/trap, or background/irrelevant/dim for that ticket only;
- add the Russian question translation, all answer translations, and a ticket-specific Russian explanation with correct-answer and wrong-answer rationales;
- run `node scripts/content-shards.mjs --write-indexes`, `pnpm run refresh:content-evidence`, `pnpm run validate:content`, and `pnpm run validate:content:quality`;
- record process-memory evidence in the active feature folder.

When materially changing ticket text, answer IDs/text, correct answer, image path/hash/content, image usage, or explanation text, refresh every affected translation, explanation, image usage mapping, image metadata record when the visible image facts changed, overlay/relevance roles, generated indexes, validation evidence, and process-memory evidence.

When deleting a ticket, remove or refresh linked translations, explanations, question image usages, overlay/relevance mappings, translation evidence, explanation evidence, image usage evidence, generated indexes, and validation records. Remove shared image metadata only when no remaining question usage references that image; if another ticket still uses the image, keep the shared metadata and remove only the deleted ticket's usage/evidence.

The current archive stores one Markdown document for each manifest entry under `content/official-documents/documents/`, raw/original evidence under `content/official-documents/originals/` where required, SHA-256 metadata for the Markdown, and currentness/effective-status evidence. Currentness validation is recorded as passed for all 19 entries, but `exactTextValidation.status` remains pending for all 19 entries until a dedicated whole-archive exact-text validation slice completes.

Each future manifest entry must record:

- exact official title;
- official source type;
- official source URL;
- retrieval date;
- local Markdown path under `content/official-documents/documents/`;
- source format;
- conversion method and conversion notes;
- `sha256` hash metadata for the archived Markdown, matching the local Markdown file hash when local metadata is available;
- raw/original evidence path under `content/official-documents/originals/` when the source is PDF, scanned, image-based, office-document, or otherwise lossy;
- currentness/effective-status evidence, including checked-at date, status, validation status, amendment/repeal/supersession evidence, and official evidence URLs;
- exact-text validation status.

## Preservation Rules

Official archive Markdown must preserve the source title, wording, numbering, headings, article/rule/section/page structure, bullet structure, and formal terminology as exactly as Markdown reasonably allows.

Agents must not paraphrase, translate, simplify, summarize, or otherwise rewrite official text inside `content/official-documents/`. Any Russian learning material derived from official sources belongs outside this archive and remains unofficial learning support. For the planned primary-source reader, full Russian translations and simple Russian rewrites should live in a governed learner-content area such as `content/primary-sources/`, not in `content/official-documents/`.

## Planned Primary-Source Reader

Feature `016-primary-sources-section` plans a learner-facing `Источники` / official primary-source reader. This section is not implemented in the current product at the time of this Slice A docs refresh. When implemented, it should remain distinct from the topic-study `Материалы` guide and should:

- cover every entry in the implementation-time and final manifest;
- default to schoolchild-friendly simple Russian text;
- let the learner switch to full Russian translation and original Spanish official text;
- omit simplified Spanish;
- display compact source/currentness/exact-text status;
- preserve local-first behavior without runtime network calls, live AI, or raw PDF viewing.

The original Spanish archive remains the official/verbatim source layer. Russian translation, simplification, summaries, and learner notes are unofficial support layers and must be stored and validated outside `content/official-documents/`.

## Currentness Rules

Every official document entry must carry currentness/effective-status evidence. Current guide claims may cite only manifest entries verified as current, in force, or otherwise currently valid for the relevant source type at validation time.

Stale, repealed, superseded, not-current, or historical documents may remain archived only as historical context. They must not support current guide claims unless a future Architect disposition explicitly allows and scopes that use.

Allowed `currentness.status` values are `current`, `in_force`, `currently_valid`, `valid_current_material`, `historical`, `stale`, `superseded`, `repealed`, `not_current`, and `unknown`.

Allowed `currentness.validationStatus` and `exactTextValidation.status` values are `pending`, `passed`, and `failed`.

## Validation

`scripts/official-documents-validation.mjs` owns no-file-I/O manifest validation. It validates supplied manifest data against an injectable file metadata/existence map or callback, so unit tests can run without real archive files.

`scripts/validate-content.mjs` integrates the official-documents manifest validator with real local file existence and SHA-256 checks. An empty draft manifest passes validation. Entries, when present, must have required metadata, local paths inside the archive section, SHA-256 hash metadata that matches the local archived Markdown file, conversion notes, currentness fields, exact-text validation status, and raw/original evidence for lossy formats.

The final topic-study-guide release and the final primary-source reader release still require later dedicated whole-archive exact-text and currentness validation evidence. The current manifest records currentness validation as passed, but exact-text validation remains pending and must not be described as release-ready until the dedicated validation is performed or an explicit Architect/user disposition narrows the release status.

## Related Guide Files

The topic-study-guide source trace is separate from the official archive:

```text
content/guide/topic-study-guide.source-trace.json
```

Source-trace entries for current guide claims must reference official-document IDs that exist in the official-documents manifest and are verified as current/currently valid. The guide content itself remains structured learning content under `content/guide/` and must not duplicate or rewrite the official archive as prose.

The CABA exam-process guide is also structured learning content under:

```text
content/guide/caba-exam-process.ru.json
```

It stores official GCBA/ANSV source URLs, checked dates, currentness labels, grouped official-action links, volatile-information warnings, and Russian explanatory prose. It does not archive verbatim official documents or render raw PDFs in the app. Images for this guide should remain omitted unless a future slice records asset-level license, attribution, privacy, currentness, local path, and offline-rendering evidence.

## Difficulty Metadata

Question and topic-guide content carries a local, reviewable learner-difficulty layer for study planning. The canonical machine enum is:

```text
green | blue | yellow | red
```

Each current question in `content/questions/caba-b.unofficial-fallback.questions.json` and each current topic in `content/guide/topic-study-guide.ru.json` must include:

- `difficulty`;
- `difficultyMeta.rubricVersion`;
- `difficultyMeta.dimensions`;
- `difficultyMeta.rationaleRu`;
- `difficultyMeta.provenance`;
- `difficultyMeta.sourceFingerprint`.

Topic difficulty metadata also includes `difficultyMeta.basis` with current child-ticket level counts, a SHA-256 hash of the topic ticket question IDs, and dominant dimensions.

Difficulty is unofficial learner guidance for an experienced Russian-speaking driver with very low Spanish proficiency. It is not official source status, legal severity, correctness, progress, or the user-controlled `Сложный` mark.

`scripts/content-difficulty.mjs` owns deterministic fingerprinting and validation for this layer. `pnpm run validate:content` fails when a question or topic has a missing/legacy/invalid level, empty or duplicate dimensions, missing rationale/provenance, stale source fingerprint, or stale topic basis.
