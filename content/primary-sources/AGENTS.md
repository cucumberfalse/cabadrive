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

They may keep small inline arrays for compatibility, but normal D-H content work must edit one document's shards at a time:

```text
content/primary-sources/documents/<officialDocumentId>.ru.json
content/primary-sources/qa/<officialDocumentId>.qa.json
content/primary-sources/search/<officialDocumentId>.search.json
```

The root learner corpus uses `documentShards`, the root QA file uses `qaShards`, and the root search file uses `searchShards`. Validators combine inline root data plus all referenced shards before applying draft, coverage, strict, final, or release validation rules.

Document shards use `schema: "primary-sources-document-shard.v1"` and contain either `document` or `documents`. QA shards use `schema: "primary-sources-qa-shard.v1"` and contain either `document` or `documents`. Search shards use `schema: "primary-sources-search-shard.v1"` and contain `entries`.

Each shard path must stay under `content/primary-sources/`, must be JSON, and must not point into `content/official-documents/`. Future translation batches should keep one PR focused on one source document or a clearly assigned source group so agents do not edit one giant JSON file at the same time.

## Content Quality Rules

- Full Russian translation must preserve legal meaning, conditions, exceptions, numbers, dates, article references, and institutional names.
- Simple Russian must use short, schoolchild-friendly wording while preserving obligations, exceptions, penalties, and scope limits.
- Simple Russian may clarify vocabulary, but must not add legal advice unsupported by the official Spanish source.
- QA notes must record method, reviewer status, checked-at date when reviewed, and any known limitations.

## Validation

- Draft validation may pass with partial, clearly marked placeholder content.
- Strict validation must fail partial manifest coverage, missing chunk coverage, missing Russian fields, placeholder text, and non-approved QA.
- Strict validation runs after root files and shards are combined, so missing document shards, QA shards, search projections, or shard/chunk mismatches block final release.
- Any learner Russian content under `content/official-documents/` is a governance violation.
