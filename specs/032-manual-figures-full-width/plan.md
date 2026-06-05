# Plan: Full-Width Manual Source Figures

## Technical Approach

Implement a reusable manual source-visual layout contract instead of adding more card-specific CSS exceptions.

Preferred shape:

- Add an explicit per-card layout/display field to the `source-image-cards` data model, for example `displayMode: "full-width" | "compact"` or a similarly clear repository-consistent name.
- Render that field as a stable data attribute, for example `data-display-mode="full-width"`, so tests and Playwright can assert behavior without relying on CSS internals.
- Update `SourceImageCardsBlockView` so full-width cards span the full source-image-card grid and render image plus explanatory text in vertical flow.
- Update CSS so full-width cards use the available manual content width, preserve aspect ratio, and use natural-width/no-upscale constraints where required.
- Migrate existing one-off selectors for cards such as `app2-hospital-map-source-card` and `app2-mirror-orientation-source-card` to the reusable classification where feasible.

Do not implement full-width behavior by adding more `data-card-id="..."` CSS selectors.

## Layout Requirements

For full-width cards:

- Card spans the full grid width.
- Figure is centered and uses `width: 100%` within the manual content/container.
- Image uses `width: 100%`, `height: auto`, and `max-width`/CSS variables or metadata to prevent inappropriate upscaling beyond natural asset dimensions.
- Text appears below or after the visual, not in a narrow side column.
- Portrait pages such as sign sheets may become tall; this is acceptable if they remain readable, lazy-loaded, and do not overflow horizontally.
- On mobile, the visual uses the available viewport/content width and remains contained; horizontal scrolling is allowed only inside a fixed visual block when required for source fidelity and must be verified.

For compact cards:

- Existing compact behavior may remain only when the inventory records that the source visual is genuinely compact and passes readability/no-upscale checks.
- Compact cards must not inherit full-width behavior accidentally.

## Inventory Requirement

Implementation must create a systematic inventory before finalizing the layout change. The inventory must cover:

- All `source-image-cards` cards in `src/data/manual-sections/`.
- All `source-artwork` blocks.
- Any other manual guide image blocks discovered during implementation whose runtime behavior could match the user's complaint.

For each item, record at least:

- section file/id
- block id
- card/block id
- source page
- asset path
- natural dimensions or known sourceRegion dimensions
- current/old display risk if known
- disposition: `full-width`, `compact`, or explicit exception
- reason
- whether source-as-is/protected exception metadata applies
- whether no-upscale evidence is needed

The inventory can live in process memory (`tasks.md`) and/or structured validation evidence. If structured evidence is added, tests should validate it is complete and fresh enough to prevent forgotten cards.

Initial candidates from Architect inspection:

| Candidate | Expected disposition | Reason |
| --- | --- | --- |
| `app4-regulatory-page-185-source-card` | full-width | reported, full page sign sheet |
| `app4-regulatory-page-186-source-card` | full-width | reported, full page sign sheet |
| Appendix IV pages `187-200` source cards | full-width | same full-page sign/marking/signal sheet pattern |
| `app3-body-posture-source-card` | full-width | reported, major source visual |
| `app2-hospital-map-source-card` | full-width with no-upscale/quality evidence | reported, map quality concern |
| `app3-seatbelt-source-card` | likely full-width | large source-as-is photo visual |
| `driving-culture-photo-source-card` | likely full-width or explicitly dispositioned | large portrait source-as-is photo |
| small DNI/license/RVA/headrest cards | likely compact or disposition-needed | source role may be compact; avoid blind enlargement |

## Data And Evidence Requirements

- Preserve existing `officialSignException` and `sourceImageException` metadata paths.
- Preserve `data-official-sign-exception`, `data-source-image-exception`, `data-visible-spanish-scope`, and `data-source-as-is` attributes.
- Do not alter protected image bytes unless replacing an asset with a source-faithful higher-resolution extraction from the same official source and recording evidence.
- If an asset is re-exported, evidence must include source page/region, method, dimensions, SHA-256, and no-upscale proof.
- Use the Orchestrator-provided natural dimension evidence as the planning baseline for the reported examples: page `185` and `186` sign sheets are `2976x4209`, the body-posture visual is `1350x430`, and the hospital map is `780x335`.
- For the hospital map, record whether the existing `780x335` source-as-is asset is the best available faithful crop. If a larger faithful extraction is not possible, cap display at natural width and record why "full width" is bounded by no-upscale quality.

## Docs Requirement

Update `docs_project/project/frontend/manual-conversion-guidelines.md` if implementation introduces a reusable large-source-visual display contract, no-upscale display rule, or inventory/evidence rule not already documented there.

Do not update durable docs merely to restate process notes; update them only for reusable manual conversion behavior.

## Testing Strategy

Content/unit tests:

- Require an explicit display disposition for every current `source-image-cards` card.
- Assert reported examples are marked full-width.
- Assert Appendix IV page/sheet cards `185-200` are full-width.
- Assert protected source-as-is metadata remains present for traffic sign/road-marking/signal pages and source-image exceptions.
- Assert compact cards remain compact only with an inventory disposition.
- Assert no new hard-coded card id selector is required for corrected full-width behavior, or that legacy selectors are removed/migrated where feasible.

Playwright tests:

- Navigate to `#manual-section-app4-signs-regulatory`, `#manual-section-app3-driving-factors`, and `#manual-section-app2-highways-hospitals`.
- At desktop and mobile widths, capture screenshots and compute bounding boxes for the reported images.
- Assert full-width images occupy a meaningful share of the manual content container. Use ratios rather than fixed pixels so tests survive responsive layout, for example image width at least `70%` of the containing block when natural width permits.
- Assert full-page sign sheet display width is far above the old thumbnail cap, for example greater than `480px` on desktop and near viewport/content width on mobile.
- Assert hospital map display width does not exceed natural width when natural width is smaller than the container.
- Assert no document-level incoherent horizontal overflow.

Standard checks:

- Run focused content tests first.
- Run `pnpm run validate:manual-guide`, `pnpm run validate:content`, `pnpm run test`, `pnpm run build`, focused Playwright, and `git diff --check`.
- Run full `pnpm run preflight` if time and environment allow before PR readiness; otherwise record the blocker or reason.

## PR Slice

Use one PR slice on `codex/032-manual-figures-full-width` from the assigned worktree. The feature is cohesive and should not be split unless implementation discovers a substantial asset-generation or repository-state blocker.

Expected file areas for Implementation Agent:

- `src/data/manualGuide.ts` and/or section data files for display metadata.
- `src/App.tsx` for renderer data attributes/layout selection.
- `src/styles.css` for full-width responsive layout.
- `tests/content-manual-guide-chapters.test.mjs` and `tests/e2e/app.spec.ts` for regression coverage.
- `content/validation/manual-guide/...` screenshots/evidence if Playwright captures are committed.
- `docs_project/project/frontend/manual-conversion-guidelines.md` only if the reusable contract changes durable guidance.
- `specs/032-manual-figures-full-width/tasks.md` for inventory, decisions, verification evidence, and feedback.

## Review Focus

Review Agent should especially check:

- Whole-document inventory completeness.
- No reported example remains thumbnail-sized.
- Appendix IV siblings were not missed.
- No protected image pixels were modified improperly.
- No inappropriate browser upscaling, especially on the hospital map.
- No hard-coded card-id workaround became the main architecture.
- Mobile layout remains contained and readable.
- Feature memory is current and evidence-backed.

## Risks And Mitigations

- Risk: A broad CSS rule enlarges genuinely compact snippets.
  Mitigation: Per-card display metadata and inventory dispositions.

- Risk: Full-width hospital map looks blurry if upscaled.
  Mitigation: Natural-dimension/runtime-size assertion and source-faithful re-export or no-upscale cap.

- Risk: Full-page portrait sign sheets become very tall.
  Mitigation: Accept height as source-faithful; lazy-load and verify mobile flow rather than shrinking to unreadability.

- Risk: Tests become brittle to exact layout pixels.
  Mitigation: Assert container-relative ratios, old-thumbnail avoidance, no-upscale, and no overflow.

- Risk: Implementation changes protected source visuals while trying to improve quality.
  Mitigation: Preserve source-as-is hashes/exception metadata and use source-faithful re-export only when required.

## Architect Disposition

No additional user clarification is required. No implementation blocker is known. The only implementation feedback to watch is the hospital map: if the official source cannot provide a larger faithful crop, record a no-upscale quality limitation rather than editing the map pixels.
