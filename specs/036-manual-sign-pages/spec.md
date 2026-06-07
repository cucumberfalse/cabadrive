# Specification: Manual Sign Pages As Individual High-Quality Sign Entries

## Role And Scope

Architect owns this specification for feature `036-manual-sign-pages`. Implementation must preserve parallel work and work only in the Orchestrator-assigned isolated worktree and branch.

This feature rebuilds the Appendix IV sign pages in the interactive manual so every in-scope sign/sign-like catalog item is represented as its own source-faithful visual entry with Spanish and Russian text captions.

## User Outcome

Russian-speaking learners can inspect each official sign one by one, in original source order, with:

- the original sign image preserved exactly as official source imagery;
- the original Spanish label shown as selectable text outside the image;
- the Russian translation shown as selectable text outside the image;
- enough image quality for practical study on desktop and mobile.

The example expectation is `NO AVANZAR` with Russian `Проезд запрещен`.

## In-Scope Source Boundary

Pages `185-197` of the official GCBA four-wheel vehicle manual are in scope as Appendix IV catalog entries:

- regulatory signs, source pages `185-186`;
- warning signs, source pages `187-188`;
- informational signs, source pages `189-192`;
- temporary signs, source pages `193-194`;
- horizontal markings, source pages `195-196`;
- traffic lights/signals catalog material on source page `197`.

Pages `198-200` are treated as contextual closing visuals by default and are not required for individual catalog-entry coverage unless Implementation discovers actual catalog sign/sign-like entries there. If discovered, Implementation must record a disposition in `tasks.md` before proceeding:

- included as in-scope catalog entries, with inventory rows and evidence; or
- excluded as contextual visual material, with source-page evidence and reason.

Existing whole-sheet or broad-panel visuals may remain only as supplemental context. They must not be the sole learner-facing representation for any in-scope catalog item.

## Protected Visual Rule

Every sign, marking, traffic light, plate/tablet, pictogram, arrow, border, color, and any text directly inside the source visual is protected source imagery.

Implementation must not:

- redraw, vectorize, regenerate, stylize, recolor, denoise, sharpen, clean, translate, mask, inpaint, expand, or retouch protected visuals;
- remove, replace, cover, or translate Spanish text that is inside a sign, plate, tablet, marking, or signal image;
- crop out official parts of an entry, including attached plates/tablets or embedded labels that belong to that source entry;
- upscale source assets for display beyond their natural pixel dimensions.

Allowed processing is limited to source-faithful extraction/cropping from official source imagery, retaining the original pixels inside the crop. Background outside the protected entry may be transparent or plain only if the crop process does not alter the protected pixels themselves and evidence records the method.

## Data And Evidence Requirements

Implementation must create or update a governed inventory/evidence model that makes the final set auditable. The model must be committed with the implementation and must include one row/object per in-scope entry.

Each inventory entry must include at least:

- stable entry id;
- section id matching the manual section where it appears;
- source page number;
- source-order index, preserving page order and visual reading order;
- Spanish label;
- Russian translation;
- source visual reference, such as PDF page crop coordinates or official retained source asset id/path;
- output asset path;
- output natural width and height;
- cryptographic hash of the output asset;
- extraction/export method and source document identity;
- explicit no-upscale display constraint;
- preservation note for signs with plates/tablets, embedded text, or multi-part visuals.

The evidence model may be JSON, TypeScript data with generated evidence, Markdown plus machine-readable JSON, or another repository-consistent format. It must support automated validation for count, order, captions, assets, hashes, source identity, and no-upscale constraints.

## Asset Requirements

Individual assets must be extracted from official source material in the highest practical original-source quality.

Preferred source order:

1. official retained source assets already in the repository, when they are demonstrably official and higher quality;
2. direct high-DPI export/crop from `content/official-documents/originals/gcba-manual-vehiculo-4-ruedas-2023.pdf`;
3. an equivalent or better documented official-source extraction method.

Generated or unofficial substitute artwork is forbidden.

Assets must be local and bundled with the static app. Runtime PDF rendering, remote images, live network fetches, and backend processing are forbidden.

## UI Requirements

The manual sign sections must present in-scope entries as individual source-order cards/rows. Each entry must show:

- the individual source-as-is crop;
- Spanish label text;
- Russian translation text;
- enough spacing for visual inspection and caption readability.

The UI must preserve source order within and across the existing Appendix IV sections. Group headers may remain, but they must not reorder entries alphabetically, by Russian meaning, or by UI convenience.

Desktop and mobile layouts must avoid:

- tiny unreadable sign islands;
- clipped sign content;
- clipped or overlapping captions;
- document-level horizontal overflow;
- nested card-heavy layouts that obscure the sign study task;
- browser upscaling beyond the asset natural dimensions.

## Validation Requirements

Implementation must add or update automated checks so regressions are caught where feasible:

- every inventory entry has Spanish and Russian captions;
- source-order indexes are contiguous and stable within the defined source boundary;
- every referenced output asset exists;
- every output asset hash matches the inventory;
- every output asset has recorded dimensions;
- UI data references only governed inventory entries or generated data derived from that inventory;
- no entry is represented only by a whole-sheet/broad-panel visual;
- runtime display constraints do not upscale assets beyond natural dimensions;
- forbidden generated/replacement/sign-edit patterns are absent from the implementation path.

Implementation must record evidence for pages `198-200` disposition and for total covered count by section.

## Acceptance Criteria

1. Every catalog entry on source pages `185-197` is represented as an individual learner-facing entry.
2. Pages `198-200` have an explicit included/excluded disposition if inspected during implementation.
3. Entries preserve official source order by page and visual reading order.
4. Each entry includes a source-as-is visual asset produced from official material.
5. Each entry includes Spanish and Russian caption text outside the protected image.
6. Protected sign pixels and sign parts are not modified, translated, covered, or omitted.
7. Whole-sheet or broad-panel visuals are supplemental only and do not count as coverage.
8. The app remains static, local-first, offline-capable, and uses bundled local assets only.
9. Desktop and mobile screenshots show readable individual entries without layout overflow or overlap.
10. Automated validation covers inventory completeness, captions, order, assets, hashes, dimensions, and no-upscale constraints.
11. Local preflight/build/test evidence is recorded before PR completion.
12. Review, final Architect validation, final Analyst validation, merge-readiness gates, and merge are coordinated by Orchestrator.

## Negative Scenarios

- Only `NO AVANZAR` or a representative subset is rebuilt.
- A whole page sheet remains the only representation for any in-scope sign.
- Entries are sorted alphabetically or regrouped in a way that loses source order.
- The image is redrawn, cleaned, translated, vectorized, generated, or otherwise edited.
- Plates/tablets or embedded sign text are cropped away or replaced.
- Captions omit Spanish or Russian text.
- The final surface requires network access, a backend, or runtime PDF viewing.

