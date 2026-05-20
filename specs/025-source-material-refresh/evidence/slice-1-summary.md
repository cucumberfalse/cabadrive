# Slice 1 Evidence Summary

- Generated at: `2026-05-20T19:29:28-03:00`
- Role: Implementation Agent, Slice 1 only (`T007`-`T018`).
- Internet/currentness research: none; used existing project official-source evidence only.

## PDF Inventory

| PDF | Pages | SHA-256 | Role | Disposition |
| --- | ---: | --- | --- | --- |
| `categoriab.pdf` | 153 | `35490f88bbb3197d4ee76b281078fec9cd4dbb021be7607b2d52ce7d607fe3b4` | ticket source | use for comparison evidence only; do not import tickets in Slice 1. |
| `MANUAL_Vehiculo_4Ruedas_2023 SA.pdf` | 200 | `69c6e1c582db4f96337fc13db09fffab26f9ce6364279c6beb2abc21d9ad3e8e` | official/manual candidate | defer content changes; use existing governed archive as authority, not this user-supplied copy. |
| `PREGUNTAS-CATEGORIA-B LIC-AUTOS.pdf` | 29 | `326bd63bafafe7e7767c173f46a38f3ffde859c52758e69bfee3e7376e8df940` | ticket source | use for duplicate/variant comparison evidence only; reject unmatched candidates for current production import in this slice. |
| `agent_roadmap_ru.pdf` | 29 | `6ae5d9838d87e6b574420cb493ae5727743b5e9037273829a0ec8e5f18070518` | roadmap/reference | rejected for Cabadrive source refresh. |
| `трудные билеты.pdf` | 125 | `4119b9c68dc1f249b23fb5e011d72d28515b6fbd0e8d7580ba42b09736183f4c` | Russian learning aid | defer only as optional learner-aid reference; do not use as ticket source. |
| `ПДД Аргентины.pdf` | 32 | `c31864547b1f47b845a7ba59a29963cb17d5705c36fe0744713d99bc4e5e02dd` | Russian learning aid | defer as optional topic-material inspiration; do not use as authority. |
| `Первое_получение_прав_и_обновление.pdf` | 12 | `953f1c70739b5edb721a15535994a0d9f8553b8acc81d019b510893622528eb3` | process-guide candidate | defer as process-guide structure/reference model only; no Slice 1 process-guide update. |

## Extraction Tooling

- Text extraction: feasible with bundled Python `pypdf`.
- Embedded image enumeration: feasible with `pypdf` page image objects.
- Page rendering/cropping: blocked for Slice 1 because `pdftoppm`, `mutool`, PyMuPDF/`fitz`, and `pdfplumber` are unavailable.
- OCR: not available; screenshot-only Russian ticket notes were not converted to Spanish tuples.

## Candidate Comparison

- Existing fallback bank: 460 questions, 276 image-backed records, content mode `unofficial_b_fallback`.
- Extracted structured Spanish candidates: 642.
- Counts by source: `{"PREGUNTAS-CATEGORIA-B LIC-AUTOS.pdf": 195, "categoriab.pdf": 447}`
- Counts by match type: `{"exact_spanish_tuple": 445, "fuzzy_question_text": 3, "no_structured_match": 135, "question_text_only": 59}`
- Counts by disposition: `{"ambiguous": 62, "duplicate": 445, "outdated": 135}`
- Counts by source/disposition: `{"PREGUNTAS-CATEGORIA-B LIC-AUTOS.pdf": {"ambiguous": 53, "duplicate": 7, "outdated": 135}, "categoriab.pdf": {"ambiguous": 9, "duplicate": 438}}`
- Accepted-current candidates: `0`.

## Recommendations

- No ticket additions should be made from Slice 1 evidence. accepted-current count is 0 because no absent candidate has current official/legal support, correct-answer evidence, and image/crop provenance.
- If Orchestrator/Architect want later ticket work, start with categoriab.pdf ambiguous/deferred candidates only, because it is newer and mostly aligns with the existing fallback bank; keep batches small and require official/currentness plus full learning-support evidence.
- Do not batch-import unmatched 2008 PREGUNTAS candidates; treat exact matches as duplicates and old variants/unmatched candidates as rejected unless a separate official-source investigation proves current validity.
- Run a separate process-guide slice for Первое_получение_прав_и_обновление.pdf, using it only as a structure/reference model and verifying all claims against official GCBA/ANSV pages.
- No official archive/manual update is recommended in Slice 1 because the supplied 2023 manual copy matches the governed project archive original byte-for-byte.

## Blockers

- Candidate PDFs do not expose reliable correct-answer marks through pypdf text extraction; correct-answer comparison is only available where an existing-bank duplicate/variant match exists.
- Page-rendered image crop extraction is blocked without pdftoppm/mutool/PyMuPDF/pdfplumber; image-backed absent candidates cannot satisfy project import standards in this slice.
- Currentness for absent ticket candidates was not proven from official/project legal sources; all nonduplicate absent candidates remain deferred/outdated rather than accepted-current.

## Evidence Files

- `specs/025-source-material-refresh/evidence/pdf-inventory.json`
- `specs/025-source-material-refresh/evidence/pdf-tooling-feasibility.json`
- `specs/025-source-material-refresh/evidence/ticket-candidate-dispositions.json`
- `specs/025-source-material-refresh/evidence/ticket-candidate-dispositions.csv`
- `specs/025-source-material-refresh/evidence/ticket-comparison-summary.json`
