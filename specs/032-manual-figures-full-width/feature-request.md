# Feature Request: Full-Width Manual Figures

## Intake Metadata

- Feature ID: `032-manual-figures-full-width`
- Intake role: Analyst
- Assigned worktree: `/Users/chap/devel/cabadrive-worktrees/032-manual-figures-full-width`
- Assigned branch: `codex/032-manual-figures-full-width`
- Verified base provided by Orchestrator: `origin/main` at `51e42f657d867fb802bbe3a68591b6008b45a60f`
- Base verification: Orchestrator reported `origin/main` was fetched successfully before worktree creation.
- Local branch observed during intake: `codex/032-manual-figures-full-width...origin/main`
- Parallel-work warning: parallel agents/worktrees may be active. Preserve all existing dirty diffs, branches, commits, PRs, and process memory. Do not touch sibling worktrees or unrelated files.
- Existing prefix check: the maximum existing numeric prefix under `specs/` is `031`; this feature uses the next assigned prefix `032`.
- Intake artifact scope: this Analyst intake creates only `specs/032-manual-figures-full-width/feature-request.md`. Analyst does not create `spec.md`, `plan.md`, `tasks.md`, code, tests, runtime assets, durable docs, commits, pushes, PRs, or merge actions.

## Original User Request

The original request was given in Russian:

> сделай эти и подобные рисунки нормального размера, чтоб он был на всю страницу по ширине как в оригинале
> ты строго оркестратор

The user attached a screenshot showing the interactive Russian manual section for pages `185` and `186`. Each official sign sheet is rendered as a very small image centered inside a large white page area, next to Russian explanatory text. The visible result makes the official sign sheets difficult to inspect and unlike the original manual page width.

Additional user clarification/examples:

> вот еще пример; проверь по всему документу

The additional screenshot shows the manual section title `Исходная схема посадки водителя`, where the source seating diagram/photo is tiny inside a wide white image box next to Russian text. The Orchestrator also relayed that section `Исходная карта больниц` shows a low-quality map that should be inserted full width like the original.

Normalized intake reading:

- Fix these manual images and similar manual figure/sheet/artwork blocks so they render at a normal readable size.
- The official figure, diagram, map, or sign sheet should occupy the full available page/content width when the original visual is a page-width or major source visual, matching the original manual's intent instead of appearing as a small thumbnail.
- Pages `185` and `186` are the concrete reported examples.
- `Исходная схема посадки водителя` is a concrete reported example of a too-small source seating diagram/photo.
- `Исходная карта больниц` is a concrete reported example of a low-quality/undersized source map that should be inserted full width like the original.
- The whole interactive manual/document must be checked for similar affected images, diagrams, maps, source artwork, sign sheets, or other official visual blocks that are rendered too small or at visibly poor quality.
- Russian explanation should remain outside protected official sign/marking images and must not be applied over those images.
- The user explicitly asked the active coordinator to be strict Orchestrator; this Analyst intake is created only because Orchestrator assigned Analyst for repository-changing intake.

## Request Classification

This is a repository-changing corrective UX request for the current interactive Russian `Руководство` manual surface. It is not a new content-writing request and does not ask to translate, redraw, relabel, or modify official source artwork.

The request is narrow enough to remain one feature memory: correct the sizing/layout and quality treatment of official manual source visuals that are currently rendered too small or poorly, starting with Appendix IV pages `185-186`, `Исходная схема посадки водителя`, and `Исходная карта больниц`, and covering all similar source images/diagrams/maps/artwork across the interactive manual.

## Project Context

- Cabadrive is a local-first React/TypeScript/Vite web trainer for Russian-speaking drivers preparing for the CABA theory exam.
- There is no runtime backend. Manual content and assets must remain bundled local/static content after build.
- The user-facing manual destination is `Руководство`, a native interactive Russian document surface derived from the official GCBA 4-wheel manual.
- The manual must not be rendered through a runtime PDF viewer, PDF.js, iframe/object/embed PDF, full-page raster-only document, remote image, runtime fetch, backend endpoint, live AI, or remote font.
- Manual conversion rules require source-faithful local artwork, high-resolution x5/equivalent visual extraction evidence, selectable Russian DOM/SVG learning text where feasible, and no low-resolution or runtime-upscaled source assets.
- Photos, traffic-sign images, and road-marking images are protected source-as-is assets: they must not be translated, relabeled, redrawn, recolored, cleaned, reconstructed, retouched, masked, inpainted, or otherwise visually modified. Russian explanation belongs outside the protected image.
- Appendix IV sign pages `185-200` are sign/marking/signal-heavy and were governed by feature `031-manual-document-completion`.

## Existing Implementation Context From Read-Only Inspection

Read-only inspection found that:

- `src/data/manual-sections/app4-signs-regulatory.ts` implements `app4-signs-regulatory` for source pages `185` and `186`.
- Those pages use `kind: "source-image-cards"` with x5 source-as-is assets:
  - `sign-sheet-185-source-as-is.jpg`
  - `sign-sheet-186-source-as-is.jpg`
- The data records official traffic sign source-as-is exceptions and explicitly says the signs, labels, and colors are preserved as in the source.
- `src/data/manual-sections/app3-driving-factors.ts` implements `Исходная схема посадки водителя` as `body-posture-source-visual`, a `source-image-cards` block for source page `161` using `body-posture-source-as-is.png`.
- `src/data/manual-sections/app2-highways-hospitals.ts` implements `Исходная карта больниц` as `hospital-map-source-visual`, a `source-image-cards` block for source page `150` using `hospital-map-source-as-is.png`.
- The current renderer `SourceImageCardsBlockView` in `src/App.tsx` renders such images inside `.manual-source-image-card-grid`.
- Current CSS in `src/styles.css` constrains `.manual-source-image-card img` to `max-width: 180px` by default and lays cards out in a two-column grid, with a few one-off exceptions for some cards. That matches the user's screenshot symptom: full-page sign sheets, source diagrams, and maps can become thumbnail-sized next to explanatory text unless explicitly exempted.

This context is not an implementation plan. Architect should verify the current runtime behavior and decide the correct scope and technical approach.

## Related Feature Memory

- Feature `028-manual-layout-ru` established that the manual should preserve document structure, layout, images, and meaningful navigation in Russian web form, not as a side-by-side Spanish screenshot plus Russian card.
- Feature `031-manual-document-completion` implemented and governed the remaining manual sections, including Appendix IV pages `184-200`, with strict source-fidelity rules.
- Feature `031` specifically records `app4-signs-regulatory` as pages `185-186`, where official traffic signs must remain source-as-is.
- The current request appears to be a post-completion visual/layout correction for the interactive manual guide sections, not a request to reopen translation content or manual source policy.

## Requested Outcome

Manual figure/sheet/artwork images that represent whole official pages, whole sign sheets, source diagrams, maps, or similar large source visuals must render at normal readable size in the interactive `Руководство`.

For the reported pages `185` and `186`, each official sign sheet should appear as a large, full-width visual within the reading content, preserving its aspect ratio and source-as-is pixels. It should not be squeezed into a small image column, thumbnail, or side-by-side card layout that leaves most of the available page width unused.

For `Исходная схема посадки водителя`, the seating source visual should likewise be normal readable page/content width, not a tiny picture in a wide white box. For `Исходная карта больниц`, the map should be inserted at full content width with source quality comparable to the original, not as a visibly low-quality or undersized thumbnail.

The Russian explanatory text can remain adjacent in the broader section flow, but it must not steal the visual's width in a way that makes the official sheet, diagram, or map unreadably small. For protected sign/marking/photo/source images, Russian explanation must stay outside the image.

## Scope

In scope:

- Correct the visible sizing/layout behavior for pages `185` and `186` in `app4-signs-regulatory`.
- Correct the visible sizing/layout behavior for `Исходная схема посадки водителя` in `app3-driving-factors`.
- Correct the visible sizing/layout and quality behavior for `Исходная карта больниц` in `app2-highways-hospitals`.
- Inventory the whole interactive manual/document and identify all similar full-page, near-full-page, page-width, or major official manual visuals that currently render as tiny thumbnails or visibly poor-quality images because they use a generic image-card layout or undersized/low-quality asset.
- Likely affected candidates include Appendix IV sign, marking, and signal sheets across pages `185-200`, and any other manual guide `source-image-cards` entries where the source region is a complete page or a large visual sheet.
- Similar candidates may also include source diagrams, maps, posture/seating visuals, hospital/route maps, large official illustrations, protected source-document examples, and large infographics if their intended source role is page-width inspection rather than compact decoration.
- Preserve source-as-is handling for official traffic signs, road markings, photos, protected source-document examples, and other protected visuals.
- Keep Russian explanatory text selectable and outside protected images.
- Add or update tests and visual evidence so page `185`, page `186`, `Исходная схема посадки водителя`, `Исходная карта больниц`, and representative similar images cannot regress to tiny thumbnails or visibly degraded map/diagram quality.
- Update durable docs only if implementation changes the manual visual/layout contract, evidence expectations, or reusable figure sizing pattern.

Out of scope for this intake:

- Analyst does not choose the CSS/component/data-model implementation approach.
- Analyst does not edit code, tests, assets, docs outside this feature request, or existing feature memories.
- Do not translate, redraw, relabel, recolor, clean, mask, retouch, reconstruct, or modify official sign/marking/photo/source-image pixels.
- Do not replace the interactive manual with a runtime PDF viewer or full-page PDF embed.
- Do not change practice questions, exam mode, content availability mode, source archive policy, Docker runtime contract, or unrelated product surfaces.

## Acceptance Expectations

- On desktop, the page `185` and `186` official sign sheets render as large full-width visuals within the manual reading content, not as `~180px` thumbnail images inside two-column cards.
- On desktop, `Исходная схема посадки водителя` renders as a normal readable source visual using the manual content width, not as a tiny diagram/photo inside an oversized white box.
- On desktop, `Исходная карта больниц` renders full width with acceptable source quality comparable to the original map, not as an undersized or visibly low-quality map.
- On mobile, the same sign sheets, seating diagram/photo, hospital map, and similar corrected visuals use the available viewport/content width and remain inspectable without becoming tiny centered islands.
- Full-width visual rendering preserves source aspect ratio, does not crop meaningful sign content, and avoids browser upscaling beyond the available source asset quality.
- The implementation identifies "similar" cases systematically across the whole interactive manual/document so other whole-page, page-width, or major official source visuals are not left with the same tiny-thumbnail or poor-quality defect.
- Protected official traffic sign, road-marking, photo, and source-document example images remain source-as-is. Spanish text may remain only inside the protected source image when already allowed by the existing exception records.
- Russian explanations remain outside protected images as selectable DOM text and do not overlay, cover, or visually alter the official source image.
- Generic smaller image cards that are legitimately meant to be compact do not have to become full-width unless Architect determines they meet the same full-page/sheet-like criteria.
- Existing manual navigation, section order, route hashes, source page metadata, and local-first behavior remain stable.
- Visual verification includes before/after or focused screenshot evidence for pages `185` and `186`, `Исходная схема посадки водителя`, `Исходная карта больниц`, plus representative similar affected pages found by the whole-document inventory.
- Automated or scripted checks should assert that affected full-page/sheet images occupy a meaningful portion of the content width across desktop and mobile, rather than relying only on AI-written summaries.
- Local verification should include focused component/content tests, TypeScript/build checks, and Playwright or equivalent browser evidence for the corrected manual pages.

## Negative Scenarios

- Leaving pages `185` and `186` as tiny sign sheets inside a large white area.
- Fixing only one reported page while leaving the same defect on page `186` or adjacent Appendix IV sign/marking/signal sheets.
- Fixing only Appendix IV while leaving the reported `Исходная схема посадки водителя` or `Исходная карта больниц` visual defects in place.
- Treating "проверь по всему документу" as a local page-185/186 patch without a whole-manual inventory of similar undersized or poor-quality source visuals.
- Enlarging the image by distorting its aspect ratio, cropping signs, or making the user inspect a blurred/upscaled asset.
- Translating, relabeling, redrawing, recoloring, cleaning, masking, inpainting, retouching, reconstructing, or otherwise modifying official traffic sign or road-marking images.
- Placing Russian text over protected sign sheets to save space.
- Reintroducing runtime PDF viewer behavior, remote images, runtime fetches, or full-page raster-only manual reading.
- Collapsing the Russian explanatory text into an image instead of selectable DOM text.
- Breaking mobile layout by forcing the full-width image to overflow the page incoherently rather than using a controlled responsive width or visual-only scroll when needed.

## Assumptions

- "На всю страницу по ширине как в оригинале" means the official visual sheet should use the full available reading/content width in the web manual, preserving the original manual page's visual prominence, rather than literally requiring the browser viewport to show only the image.
- The reported screenshot corresponds to the interactive `Руководство` guide section for Appendix IV pages `185-186`, not the legacy `?legacyManual=1` complete page-canvas reader.
- The additional screenshots/examples correspond to interactive guide `source-image-cards` blocks, including `app3-driving-factors` page `161` and `app2-highways-hospitals` page `150`.
- Existing x5 source-as-is assets for some examples may be high enough quality; the visible defect may be layout sizing. The `Исходная карта больниц` clarification also raises a possible asset-quality issue, so Architect/Implementation Agent should verify both natural dimensions and runtime display-size evidence.
- "Эти и подобные рисунки" and "проверь по всему документу" include all full-page/near-full-page official source sheets, large manual figures, maps, diagrams, source artwork, and protected source images that are rendered with the same too-small or poor-quality treatment.
- No blocking user clarification is required before architecture work. If Architect finds ambiguity about exactly which non-Appendix images should count as "similar", it can define criteria and require implementation inventory evidence.

## Risks

- A broad CSS change to all `source-image-cards` could accidentally make small illustrations, document snippets, or maps too large. The solution may need criteria or metadata for full-page/sheet-like visuals.
- Some affected assets may be portrait-oriented full manual pages; full-width rendering can make them tall. The UX should remain readable without creating excessive layout jumps or unusable mobile overflow.
- Existing visual evidence may pass source-fidelity while still missing runtime display-size assertions, so new tests may be needed to catch the user's actual complaint.
- Full-width protected source images must still preserve local/offline performance and lazy-loading behavior.
- If similar images include non-sign infographics with Russian overlays, resizing must preserve overlay alignment and selectable text behavior.
- The hospital map may require distinguishing between layout undersizing and actual source-asset quality; replacing or re-exporting an asset must still preserve source-as-is rules and documented high-resolution evidence.

## Open Questions

- No user clarification is needed for intake.
- Architect should define the inventory rule for "similar drawings/images" across the whole interactive manual/document: for example, complete source-page regions, sign/marking/signal sheets, full-width official visual tables, major maps, large source diagrams, seating/posture visuals, and large source figures whose runtime display width or image quality falls below an acceptable ratio of the content column/source intent.
- Architect should decide whether this is best solved through a new block variant, per-card metadata, renderer rules for full-page source regions, CSS rules keyed by card/source type, or another codebase-consistent approach.

## Acceptance Evidence Expected

- Read-only or automated inventory of all affected manual guide image-card/source-artwork blocks and their source pages across the whole interactive manual/document, including a clear not-affected disposition for compact visuals that remain intentionally card-sized.
- Focused screenshots for pages `185` and `186` at desktop and mobile widths showing the sign sheets rendered at normal full content width.
- Focused screenshots for `Исходная схема посадки водителя` at desktop and mobile widths showing the source visual rendered at normal readable page/content width.
- Focused screenshots for `Исходная карта больниц` at desktop and mobile widths showing the map rendered full width with acceptable source quality.
- Representative screenshots or assertions for any other corrected similar sign/marking/signal/map/diagram/full-page figure sections found in the whole-document inventory.
- DOM or Playwright bounding-box evidence showing affected images are not constrained to the old thumbnail width and occupy a meaningful share of the manual content width.
- Asset natural-dimension/runtime-size evidence showing no degraded or inappropriate upscaling.
- Verification that protected images remain byte-identical/source-as-is where existing evidence requires it.
- Focused regression tests for the full-width behavior and for preserved source-as-is image exception attributes.
- Standard local verification appropriate to the code touched, including content/manual guide tests, TypeScript/build, and preflight where required by Architect tasks.

## Analyst Handoff

This intake is ready for Orchestrator handoff to Architect. The corrective intent is clear: pages `185-186`, `Исходная схема посадки водителя`, `Исходная карта больниц`, and all similar whole-document source visuals must stop rendering as tiny thumbnails or visibly poor-quality images and must instead use the available page/content width where that matches the original manual's visual role, while preserving source-as-is official imagery, selectable Russian explanatory text outside protected images, local-first constraints, and existing manual navigation/content boundaries.

## Final Analyst Validation Notes

- Analyst validation pass: passed
- Final Analyst validation completed at: 2026-06-05T07:01:59Z
- Analyst validated effective content head: 06feced225e2779ce8fd5e33578a5e4d4a43070c
- Analyst validation evidence: PR `#198` current head `06feced225e2779ce8fd5e33578a5e4d4a43070c` satisfies the user's full-document image sizing and quality intent: reported pages `185`/`186`, `app3-body-posture-source-card`, and `app2-hospital-map-source-card` are covered as full-width examples; the whole-manual source-image-card inventory records `38` cards with `31` full-width and `7` intentional compact dispositions, including Appendix IV pages `185-200`; protected source-as-is and no-upscale rules preserve official pixels and bound the `780px` hospital map instead of degrading it; the mobile panoramic follow-up for `app2-mirror-orientation-source-card` is implemented; required checks pass and duplicate review threads are resolved; the workflow preserved strict Orchestrator routing with Analyst, Architect, Implementation Agent, and Review Agent boundaries.
- Analyst return count: 0; within the limit of 5. No Analyst gaps or new Architect dispositions are required.

## Final Analyst Validation Notes

- Analyst validation pass: passed
- Final Analyst validation completed at: 2026-06-05T07:13:14Z
- Analyst validated effective content head: c2292e1fe568864c08761dde62fb6c6e03a8a14c
- Analyst validation evidence: PR `#198` current head `c2292e1fe568864c08761dde62fb6c6e03a8a14c` satisfies the user's full-document image sizing and quality intent: reported pages `185`/`186`, `app3-body-posture-source-card`, and `app2-hospital-map-source-card` are covered; the whole-manual inventory records `38` source-image cards with `31` full-width and `7` intentional compact dispositions, including Appendix IV pages `185-200`; protected source-as-is pixels and no-upscale behavior are preserved, including the bounded `780px` hospital map; the mobile panoramic follow-up keeps `app2-mirror-orientation-source-card` readable with contained visual-only scrolling; required checks pass, duplicate review threads are resolved, and strict Orchestrator role flow is preserved across Analyst, Architect, Implementation Agent, and review/finalization coordination.
- Analyst return count: 0; within the limit of 5. No Analyst gaps or new Architect dispositions are required.
