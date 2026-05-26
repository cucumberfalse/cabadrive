# Spec: Complete RU Manual Surface for Vehiculo 4 Ruedas 2023

## Role and Context

- Feature ID: `027-manual-vehiculo-4ruedas-ru`
- Architect assignment worktree: `/Users/chap/devel/cabadrive-worktrees/027-manual-vehiculo-4ruedas-ru`
- Branch: `codex/027-manual-vehiculo-4ruedas-ru`
- Intake source: `specs/027-manual-vehiculo-4ruedas-ru/feature-request.md`
- Canonical official PDF: `content/official-documents/originals/gcba-manual-vehiculo-4-ruedas-2023.pdf`
- Canonical source evidence from intake: SHA-256 `69c6e1c582db4f96337fc13db09fffab26f9ce6364279c6beb2abc21d9ad3e8e`, 200 pages, byte-identical to the user-provided PDF.

## Goal

Add a dedicated Russian-language site surface for the complete official Spanish 4-wheel vehicle manual. The result must be complete, exact, local-first, and source-traceable. It must not be an MVP, sample, partial import, simplified learner summary, or text-only adaptation.

## Non-Negotiable Product Decisions

1. The manual gets its own complete RU block/surface in the app, separate from existing chunk-only learner views.
2. The RU translation must be full and exact: no simplification, omission, condensation, editorial replacement, or section dropping.
3. Every source page/content unit from the 200-page official PDF must be represented.
4. All images and visual content must be preserved through local page-faithful PDF-rendered assets or an equivalent manifest-backed strategy that proves page and image fidelity.
5. Existing approved RU chunks may be reused only after coverage validation proves they match the complete source requirement; gaps must be completed.
6. The runtime must not use a PDF viewer, iframe PDF embedding, PDF.js-style reader, CDN, or network fetches for manual content or assets.
7. The official Spanish PDF must remain traceable by source ID, path, hash, page number, and visible source attribution.
8. Validators, tests, and durable docs are required before the work can be considered complete.

## User Experience Requirements

- A Russian-speaking learner can open a distinct complete manual surface from the site navigation or another obvious manual entry point.
- The surface presents the manual page-by-page or section-by-section while preserving source page traceability.
- Each displayed unit includes exact RU content and a clear relationship to the original Spanish source page(s).
- Images, icons, diagrams, tables, figure relationships, and layout-sensitive content remain available locally in study context.
- The page must label the Spanish PDF as the official source and the RU translation as derived learning support unless the repository later records evidence of an official RU translation.
- The experience must be usable offline after local build/serve; no runtime network dependency may be required to load content, visual assets, or source metadata.

## Content and Asset Requirements

- Create or extend a manifest-backed manual data model for the complete document.
- The manifest must include at minimum:
  - source document ID and SHA-256
  - source PDF path
  - source page count
  - per-page source page number
  - local rendered page asset path or equivalent visual-preservation asset references
  - asset dimensions and checksum where practical
  - RU translation content reference
  - coverage status for text, images/visuals, and page traceability
  - links to reused existing RU chunks only after validation
- Page-faithful rendered assets are the preferred visual preservation path because current Markdown/chunk conversion is known not to preserve images, icons, tables, typography, or pagination.
- An equivalent non-page-render approach is acceptable only if its manifest and validators prove that every source page and every source visual relationship is preserved locally.
- The original PDF may be archived and referenced for traceability, but the user-facing runtime must not depend on loading it as a PDF.

## Translation Requirements

- Translation must cover all visible instructional text from the manual, including headings, captions, table text, callouts, footnotes, labels, warnings, legends, and page-level contextual text.
- Existing approved RU chunks may seed the translation only after a validator maps them to source page/content ranges and flags exact coverage.
- Any reused chunk must retain provenance: chunk ID/path, mapped source page(s), validation status, and whether manual-specific normalization was required.
- Partial matches, paraphrases, summaries, or previously approved chunks that do not cover the exact source unit must not be treated as complete.
- Missing or unmatched source content must be translated rather than skipped.

## Technical Constraints

- Keep the app local-first and static-build compatible.
- Generate or store local assets before runtime; runtime code should load static JSON/TS manifests and static image assets only.
- Avoid runtime PDF parsing, PDF rendering, external image URLs, remote translation calls, or network fetches.
- Prefer deterministic content generation scripts/validators that can be rerun locally and in CI.
- Keep generated assets and manifests organized under a clear manual/source-document namespace consistent with existing repository conventions.
- Update durable project docs when the implementation changes content structure, source document handling, asset generation, validation, or UI routing.

## Acceptance Criteria

1. The site exposes a dedicated RU complete manual surface for `MANUAL_Vehiculo_4Ruedas_2023 SA.pdf`.
2. The surface represents all 200 source pages/content units.
3. The RU translation is complete and exact, with no intentional simplification or omission.
4. All source images/visual content are preserved locally through page-faithful render assets or a validated equivalent manifest.
5. Spanish source traceability is present for every page/content unit.
6. Existing RU chunks are reused only where coverage validation passes; all gaps are completed.
7. The runtime uses no PDF viewer and performs no network access for manual content/assets.
8. Validators and tests prove source coverage, translation coverage, visual asset coverage, local/offline behavior, and UI access.
9. Durable docs describe the manual surface, asset strategy, validation workflow, and local runtime implications.

## Negative Scenarios

- A text-only Markdown/chunk reader is shipped as the complete manual.
- The app exposes only selected sections, sample pages, placeholder translation, or an MVP subset.
- Images are described but not served locally in the learner surface.
- A PDF iframe, browser PDF viewer, PDF.js runtime, or remote asset URL is required to study the manual.
- Existing RU chunks are bulk-imported without page/content coverage validation.
- Spanish official source traceability is visible only globally and not at page/content-unit level.

## Verification Evidence Required

- Manifest validation output showing 200/200 source pages represented.
- Translation coverage validation output showing no missing source content units.
- Visual asset validation output showing every page has local page-faithful render assets or validated equivalent visual references.
- Tests or build checks proving no runtime PDF viewer/network dependency is introduced.
- UI test or screenshot evidence that the dedicated RU manual surface is reachable and renders representative pages.
- Documentation diff showing updated durable docs for content structure, assets, validation, and runtime behavior.
