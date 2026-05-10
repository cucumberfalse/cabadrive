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
