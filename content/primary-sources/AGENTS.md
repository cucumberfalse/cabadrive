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

## Content Quality Rules

- Full Russian translation must preserve legal meaning, conditions, exceptions, numbers, dates, article references, and institutional names.
- Simple Russian must use short, schoolchild-friendly wording while preserving obligations, exceptions, penalties, and scope limits.
- Simple Russian may clarify vocabulary, but must not add legal advice unsupported by the official Spanish source.
- QA notes must record method, reviewer status, checked-at date when reviewed, and any known limitations.

## Validation

- Draft validation may pass with partial, clearly marked placeholder content.
- Strict validation must fail partial manifest coverage, missing chunk coverage, missing Russian fields, placeholder text, and non-approved QA.
- Any learner Russian content under `content/official-documents/` is a governance violation.
