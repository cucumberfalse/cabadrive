# Spec: Full-Width Manual Source Figures

## Architect Scope

This Architect assignment plans feature `032-manual-figures-full-width` only. Architect writes only `spec.md`, `plan.md`, and `tasks.md` under `specs/032-manual-figures-full-width/`.

- Assigned worktree: `/Users/chap/devel/cabadrive-worktrees/032-manual-figures-full-width`.
- Assigned branch: `codex/032-manual-figures-full-width`.
- Verified latest-main base: `origin/main` at `51e42f657d867fb802bbe3a68591b6008b45a60f`.
- Intake artifact: `specs/032-manual-figures-full-width/feature-request.md`.
- Parallel work may exist. Preserve all sibling worktrees, branches, commits, PRs, dirty diffs, and process memory.

## Goal

Correct the interactive Russian `Руководство` so official manual figures that are page-wide, sheet-like, map-like, or otherwise major source visuals render at a normal readable size instead of as tiny thumbnails. The fix must cover the reported examples and all similar cases across the whole interactive manual/document.

Reported examples:

- Appendix IV page `185`, official regulatory sign sheet.
- Appendix IV page `186`, official regulatory sign sheet.
- `Исходная схема посадки водителя`, source page `161`, body-posture source visual.
- `Исходная карта больниц`, source page `150`, hospital map.

## User Outcome

As a Russian-speaking learner, I can inspect official source sheets, diagrams, and maps in `Руководство` at the same visual prominence they have in the original manual, while Russian explanation remains readable outside protected images.

## Scope

In scope:

- Replace thumbnail-sized rendering for page-wide or major official source visuals in the interactive manual.
- Systematically inventory all manual guide images/source visuals, not only the reported examples.
- Add an explicit, reusable layout classification for large/manual-source visuals instead of relying on hard-coded card id exceptions.
- Correct the reported examples and any inventory items that meet the large-visual criteria.
- Preserve source-as-is handling for official traffic signs, road markings, photos, maps with approved source-image exceptions, and source-document examples.
- Keep Russian learner text selectable DOM/SVG text outside protected images.
- Add automated content/schema tests plus Playwright desktop/mobile visual assertions and screenshot evidence.
- Update durable manual conversion documentation if the implementation adds or changes the reusable source-visual display contract.

Out of scope:

- Translating, relabeling, redrawing, recoloring, cleaning, retouching, masking, inpainting, or reconstructing protected source images.
- Replacing the interactive manual with a runtime PDF viewer, PDF.js canvas, iframe/object/embed PDF, remote images, or full-page raster-only reader.
- Changing practice questions, exam mode, non-manual product surfaces, source archive policy, Docker runtime contract, or unrelated guide content.
- Treating compact supporting icons/document snippets as full-width unless the inventory proves they are intended to be inspected as major source visuals.

## Full-Width Decision Criteria

Implementation must classify every current `source-image-cards` card and any similar manual visual block with an explicit disposition.

A visual should become full-width/large when one or more of these apply:

- It is a complete or near-complete official source page, sheet, sign page, marking page, signal page, table page, or source-document example intended for inspection.
- It is a major map, diagram, photo, infographic, or source artwork that carries primary meaning and becomes illegible or visually unlike the source when constrained to the current thumbnail column.
- Its source region or natural asset dimensions are large enough that the old `max-width: 180px` treatment hides meaningful details.
- It has an official sign, road-marking, signal, source-as-is map, source-image-original-visible-text, or source-document exception and the Russian explanation is already outside the image.
- It is one of the reported examples, regardless of whether a prior one-off CSS exception exists.

A visual may remain compact when all of these apply:

- It is a small source snippet, icon, license/document sample, or supporting illustration whose original role is compact.
- Enlarging it would produce inappropriate upscaling, excessive empty canvas, or worse readability.
- The inventory records the reason and any no-upscale limitation.
- The existing compact rendering passes desktop/mobile readability checks.

Mixed blocks are allowed: a `source-image-cards` block may contain both compact and full-width cards if the metadata and tests make that explicit.

## Functional Requirements

- FR-001: `SourceImageCardsBlockView` or its successor must support an explicit large/full-width visual layout that makes the image span the available manual reading content width.
- FR-002: Full-width source visuals must put image and explanatory text in vertical flow. The image must not share a narrow side-by-side column with text.
- FR-003: The implementation must not rely on newly added hard-coded card id CSS selectors for the corrected full-width behavior. Existing one-off selectors should be migrated to the reusable classification when feasible.
- FR-004: Every current `source-image-cards` card must have an inventory disposition: `full-width`, `compact`, or another Architect-equivalent explicit category with a recorded reason.
- FR-005: The reported pages `185`, `186`, body-posture source visual, and hospital map must be classified and verified as corrected large visuals unless a no-upscale/source-quality exception is explicitly recorded for the hospital map.
- FR-006: Appendix IV source sheets/pages `185-200` must be inspected as a group because the user reported page `185-186` and the same source-sheet pattern continues across warning, informational, temporary, horizontal marking, and traffic-light sheets.
- FR-007: Other major current candidates must be inspected, including large source-as-is photos/diagrams/maps and transferred infographics in Chapters 4-5 and Appendices I-III.
- FR-008: Full-width images preserve aspect ratio, do not crop meaningful content, and do not create incoherent horizontal overflow.
- FR-009: Full-width display must avoid browser upscaling beyond available source asset quality. If the desired display width exceeds natural asset width, Implementation Agent must either re-export from source at x5/equivalent/better quality or record a no-upscale disposition that caps display width.
- FR-010: The hospital map must receive asset natural-dimension and runtime-display evidence proving source quality and no inappropriate upscaling. If a better faithful extraction is possible, replace/re-export it without altering source details; if not, cap display at natural width and record the source limitation.
- FR-011: Protected traffic signs, road markings, photos, source-as-is map pixels, and approved source-image exceptions remain unmodified source-as-is.
- FR-012: Russian explanation remains selectable DOM text outside protected images; no Russian text may be overlaid on protected sign/marking/photo/map images to save width.
- FR-013: Existing manual navigation, hashes, source page metadata, local-first assets, lazy loading where present, and forbidden-pattern gates remain stable.
- FR-014: Content/evidence tooling must be able to catch regressions back to thumbnail rendering for the corrected large visuals.

## Initial Read-Only Inventory

Architect read-only inspection found `38` current `source-image-cards` cards in `src/data/manual-sections/`.

Additional Orchestrator read-only `sips` evidence in the assigned worktree confirms natural asset dimensions for the reported examples:

- `sign-sheet-185-source-as-is.jpg`: `2976x4209`.
- `sign-sheet-186-source-as-is.jpg`: `2976x4209`.
- `body-posture-source-as-is.png`: `1350x430`.
- `hospital-map-source-as-is.png`: `780x335`.

This evidence supports an implementation split between pure layout undersizing for the sign sheets/body-posture visual and a stricter source-quality/no-upscale check for the hospital map.

Must-correct reported/obvious large candidates:

- `app4-regulatory-page-185-source-card`, source page `185`, `2976x4209`.
- `app4-regulatory-page-186-source-card`, source page `186`, `2976x4209`.
- `app3-body-posture-source-card`, source page `161`, source card region recorded as `1275x725`, runtime asset observed as `1350x430`.
- `app2-hospital-map-source-card`, source page `150`, `780x335`; quality/no-upscale must be verified carefully.

Likely full-width group candidates:

- Appendix IV `app4-warning-page-187-source-card` and `app4-warning-page-188-source-card`.
- Appendix IV `app4-informational-page-189-source-card` through `app4-informational-page-192-source-card`.
- Appendix IV `app4-temporary-page-193-source-card` and `app4-temporary-page-194-source-card`.
- Appendix IV `app4-horizontal-page-195-source-card` and `app4-horizontal-page-196-source-card`.
- Appendix IV `app4-traffic-lights-page-197-source-card` through `app4-traffic-lights-page-200-source-card`.
- `app3-seatbelt-source-card`, source page `176`, `1175x1125`.
- `driving-culture-photo-source-card`, source page `103`, `1500x2200`.
- Other large transferred/source visuals identified by the implementation inventory when runtime display evidence shows thumbnail-like rendering.

Likely compact or disposition-needed candidates:

- Small document/license examples in `ch2-required-documents`.
- Small headrest diagrams in `app2-safety-elements`.
- Other narrow visual strips where natural height/width and source intent support compact display.

The final inventory may refine these dispositions, but it must explicitly account for all current manual guide image cards and similar `source-artwork` blocks.

## Acceptance Criteria

1. Given the user opens the interactive `Руководство` section for page `185`, the official sign sheet renders as a large full-width manual visual, not as an approximately `180px` thumbnail.
2. Given the user opens the interactive `Руководство` section for page `186`, the official sign sheet renders as a large full-width manual visual with source-as-is pixels preserved.
3. Given the user opens `Исходная схема посадки водителя`, the source seating visual uses the manual content width and remains readable on desktop and mobile.
4. Given the user opens `Исходная карта больниц`, the map uses the largest appropriate content width without inappropriate upscaling and has recorded natural-dimension/runtime-size quality evidence.
5. Given Appendix IV pages `185-200` are inspected, all page/sheet-style sign, marking, and signal visuals receive full-width treatment or an explicit recorded exception.
6. Given the whole interactive manual/document is inventoried, every current `source-image-cards` card and similar manual image block has a recorded display disposition and reason.
7. Given a corrected full-width visual appears on desktop, its image bounding box occupies a meaningful share of the manual content width and is not constrained by the old thumbnail `max-width: 180px` behavior.
8. Given a corrected full-width visual appears on mobile, it uses the available viewport/content width without incoherent overflow or microscopic centered content.
9. Given protected official images are corrected for size, their source pixels and exception metadata remain source-as-is, and Russian explanation remains outside the image.
10. Given local verification runs, content tests, TypeScript/build checks, Playwright desktop/mobile screenshots, and bounding-box assertions provide evidence for reported examples plus representative inventory findings.

## Negative Scenarios

- Fixing only pages `185-186` while leaving page/sheet siblings in Appendix IV thumbnail-sized.
- Fixing only Appendix IV while leaving the reported seating visual or hospital map defect.
- Adding new card-id-specific CSS exceptions instead of a reusable source-visual display contract.
- Enlarging a low-resolution asset by browser upscaling beyond natural dimensions and calling that fixed.
- Cropping sign sheets, maps, or diagrams to make them fit.
- Altering protected traffic signs, road markings, photos, or the owner-approved hospital-map source image.
- Moving Russian text into protected images or overlaying Russian labels over official sign/map pixels.
- Breaking mobile layout with document-wide horizontal overflow.
- Removing current source-fidelity evidence, source exception attributes, navigation hashes, or local/offline behavior.

## Verification Requirements

Implementation must record exact commands and evidence in `tasks.md`.

Required local checks:

- `node scripts/check-feature-memory.mjs --worktree`
- focused content/manual guide tests covering source-image display classification
- `pnpm run validate:manual-guide`
- `pnpm run validate:content`
- `pnpm run test`
- `pnpm run build`
- focused Playwright desktop/mobile checks for corrected examples and representative inventory findings
- `git diff --check`

Playwright evidence must include:

- Desktop and mobile screenshots for `app4-signs-regulatory`, `app3-driving-factors`, and `app2-highways-hospitals`.
- Representative screenshots or assertions for other corrected Appendix IV sections and at least one non-Appendix large visual if the inventory corrects any.
- Bounding-box assertions comparing image width to its manual content container, proving corrected images are not thumbnail-sized.
- Natural dimension and runtime display-size capture for the hospital map and at least one full-page sign sheet.
- No-upscale assertion where natural asset width is smaller than the content container.

## Implementation Slice Guidance

Use one implementation PR slice in the assigned worktree unless implementation discovers a narrow blocker such as missing source assets, a need for substantial re-export across many assets, or a conflict with parallel work. The change is cohesive: inventory, metadata/schema, renderer/CSS, tests, screenshots/evidence, and process-memory updates all serve one user-visible defect.

If asset re-export is required for the hospital map or another large candidate, keep it in the same PR if it is limited and source-faithful. If broader asset regeneration becomes risky, Implementation Agent must record feedback for Orchestrator/Architect disposition before splitting.

## Assumptions

- "На всю страницу по ширине" means the full available manual reading/content width, not necessarily the entire browser viewport.
- Existing x5 source-as-is assets for Appendix IV are high quality; the main defect there is display layout.
- The hospital map may be limited by source crop dimensions. The correct fix is source-faithful display with no inappropriate upscaling, not visual retouching.
- No further user clarification is needed before implementation.

## Architect Handoff

This feature is ready for Implementation Agent after Orchestrator assignment. Implementation must preserve role boundaries, sibling work, source-as-is pixels, and process memory, then keep `tasks.md` current with inventory, decisions, verification evidence, known issues, and feedback.
