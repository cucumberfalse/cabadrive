# AGENTS.md - Learner Primary Sources

This directory is the governed learner-facing layer for official primary sources.

## Mandatory Rules

- Store Russian full translations and simple Russian rewrites here, outside `content/official-documents/`.
- Treat `content/official-documents/` as the read-only Spanish official archive. Do not edit archive documents while authoring learner text here.
- Derive original Spanish chunks from the official archive and keep archive paths, spans, and fingerprints current.
- Mark Russian text as unofficial Cabadrive learning support. It is not the official legal source.
- Provide both full Russian translation and simple Russian rewrite for each final chunk.
- Do not create simplified Spanish fields, files, views, or search projections.
- Keep draft placeholders plainly marked as draft/preparatory until the content batch is translated, reviewed, and approved.
- Before final release, every manifest document and every generated source chunk must have approved translation QA and approved simplification QA.

## Sharding Contract

Root files are content manifests, not the preferred editing surface for translation batches:

```text
content/primary-sources/primary-sources.ru.json
content/primary-sources/primary-sources.qa.json
content/primary-sources/primary-sources.search.json
```

They may keep small inline arrays and explicit shard lists for compatibility, but normal D-H content work must add or edit one document's shards at a time:

```text
content/primary-sources/documents/<officialDocumentId>.ru.json
content/primary-sources/qa/<officialDocumentId>.qa.json
content/primary-sources/search/<officialDocumentId>.search.json
```

The root learner corpus uses `documentShardDirectories`, the root QA file uses `qaShardDirectories`, and the root search file uses `searchShardDirectories`. These stable directory references are committed once. Future translation batches must not edit the root JSON files just to add a document; add the document, QA, and search shard files in the directories above and record evidence in process memory.

Validators auto-discover flat shard files by suffix from those directories:

```text
documents/*.ru.json
qa/*.qa.json
search/*.search.json
```

Validators combine inline root data plus discovered shards before applying draft, coverage, strict, final, or release validation rules.

Document shards use `schema: "primary-sources-document-shard.v1"` and contain either `document` or `documents`. QA shards use `schema: "primary-sources-qa-shard.v1"` and contain either `document` or `documents`. Search shards use `schema: "primary-sources-search-shard.v1"` and contain `entries`.

Large documents may be split into recomposable range shards by generated coverage order. Use inclusive range suffixes that match the assigned task range:

```text
content/primary-sources/documents/<officialDocumentId>--001-086.ru.json
content/primary-sources/qa/<officialDocumentId>--001-086.qa.json
content/primary-sources/search/<officialDocumentId>--001-086.search.json
```

For four-digit generated coverage IDs, use four digits in the range suffix, for example `--0001-0182`.

Range shards for the same `officialDocumentId` must use identical document metadata and non-overlapping generated chunk ranges. Validators recompose document and QA shards by `officialDocumentId`, fail mismatched metadata, and fail duplicate learner or QA chunk IDs. Search shards remain flat, but duplicate search entry IDs or duplicate `officialDocumentId`/`chunkId` search references are validation failures.

No partial range shard is a complete learner document by itself. A large document is release-complete only after its recomposition gate proves all generated chunks for the document are present exactly once, archive-aligned, searchable, terminology-consistent, and approved in both translation and simplification QA.

Each shard path or shard directory must stay under `content/primary-sources/`, must use JSON shard files, and must not point into `content/official-documents/`. Future translation batches should keep one PR focused on one source document or a clearly assigned source group so agents do not edit one giant JSON file or the root shard manifests at the same time.

## Content Quality Rules

- Use `content/primary-sources/terminology.ru.md` before translating or simplifying primary-source chunks.
- Full Russian translation must preserve legal meaning, conditions, exceptions, numbers, dates, article references, and institutional names.
- Simple Russian must use short, schoolchild-friendly wording while preserving obligations, exceptions, penalties, and scope limits.
- Simple Russian may clarify vocabulary, but must not add legal advice unsupported by the official Spanish source.
- QA notes must record method, reviewer status, checked-at date when reviewed, and any known limitations.

## Validation

- Draft validation may pass with partial, clearly marked placeholder content.
- Strict validation must fail partial manifest coverage, missing chunk coverage, missing Russian fields, placeholder text, and non-approved QA.
- Strict validation runs after root files and shards are combined, so missing document shards, QA shards, search projections, or shard/chunk mismatches block final release.
- Any learner Russian content under `content/official-documents/` is a governance violation.
