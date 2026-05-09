# AGENTS.md - Official Documents Archive

This directory is a governed archive for official source documents and materials used to verify Cabadrive guide claims.

## Mandatory Rules

- Preserve official text exactly. Do not translate, summarize, simplify, rewrite, paraphrase, or editorialize archived official documents.
- Preserve document titles, headings, numbering, article/rule/section/page structure, bullet structure, and formal terminology as closely as Markdown allows.
- Store Russian explanations, learning notes, summaries, and interpretations outside this directory.
- Add or edit an official document only with complete manifest metadata in `manifest.json`.
- Record source URL, retrieval date, local Markdown path, source format, conversion method, conversion notes, hash algorithm, and SHA-256 hash metadata.
- Record currentness/effective-status evidence, including checked-at date, status, validation status, amendment/repeal/supersession evidence, and official evidence URLs or notes.
- Record exact-text validation status for every manifest entry.
- Keep raw/original evidence in `originals/` for PDF, scan, image, office-document, or otherwise lossy formats.
- Keep exact-text validation evidence in `validation/` when validation is performed.
- Current guide claims may cite only manifest entries verified as current, in force, or otherwise currently valid for the relevant source type.
- Non-current, stale, repealed, superseded, or historical entries may remain archived only as historical context and must not support current guide claims without Architect disposition.

## Future Document Checklist

1. Download the official source in full from its official URL.
2. Convert the official text to Markdown without changing wording or structure.
3. Save Markdown under `documents/`.
4. Save raw/original evidence under `originals/` when the source format is PDF or otherwise lossy.
5. Add or update the manifest entry with metadata, hashes, conversion notes, currentness evidence, and exact-text validation status.
6. Run content validation and any slice-specific official-document tests before relying on the entry.

If exact text or currentness cannot be proven, record the limitation in the manifest and feature process memory before any guide claim cites the source.
