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

`content/official-documents/manifest.json` is the machine-readable manifest for the archive. The initial Slice B manifest is draft and intentionally has an empty `entries` array; no broad official sources have been downloaded or converted in this foundation slice.

Each future manifest entry must record:

- exact official title;
- official source type;
- official source URL;
- retrieval date;
- local Markdown path under `content/official-documents/documents/`;
- source format;
- conversion method and conversion notes;
- `sha256` hash metadata for the archived Markdown;
- raw/original evidence path under `content/official-documents/originals/` when the source is PDF, scanned, image-based, office-document, or otherwise lossy;
- currentness/effective-status evidence, including checked-at date, status, validation status, amendment/repeal/supersession evidence, and official evidence URLs;
- exact-text validation status.

## Preservation Rules

Official archive Markdown must preserve the source title, wording, numbering, headings, article/rule/section/page structure, bullet structure, and formal terminology as exactly as Markdown reasonably allows.

Agents must not paraphrase, translate, simplify, summarize, or otherwise rewrite official text inside `content/official-documents/`. Any Russian learning material derived from official sources belongs in guide content outside this archive and remains unofficial learning support.

## Currentness Rules

Every official document entry must carry currentness/effective-status evidence. Current guide claims may cite only manifest entries verified as current, in force, or otherwise currently valid for the relevant source type at validation time.

Stale, repealed, superseded, not-current, or historical documents may remain archived only as historical context. They must not support current guide claims unless a future Architect disposition explicitly allows and scopes that use.

## Validation

`scripts/official-documents-validation.mjs` owns no-file-I/O manifest validation. It validates supplied manifest data against an injectable file metadata/existence map or callback, so unit tests can run without real archive files.

`scripts/validate-content.mjs` integrates the official-documents manifest validator with real local file existence checks. An empty draft manifest passes validation. Entries, when present, must have required metadata, local paths inside the archive section, SHA-256-shaped hash metadata, conversion notes, currentness fields, exact-text validation status, and raw/original evidence for lossy formats.

The final topic-study-guide release still requires later dedicated whole-archive exact-text and currentness validation slices. This foundation establishes the local governance and draft-safe validation boundary only.

## Related Guide Files

The topic-study-guide source trace is separate from the official archive:

```text
content/guide/topic-study-guide.source-trace.json
```

Source-trace entries for current guide claims must reference official-document IDs that exist in the official-documents manifest and are verified as current/currently valid. The guide content itself remains structured learning content under `content/guide/` and must not duplicate or rewrite the official archive as prose.
