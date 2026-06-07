# Plan: Manual Sign Pages As Individual High-Quality Sign Entries

## Architecture Direction

Replace the current whole-sheet-first Appendix IV sign presentation with an inventory-driven sign catalog. The inventory is the source of truth for coverage, order, captions, source references, output assets, dimensions, hashes, and no-upscale evidence. UI data should be generated from or directly reference this governed inventory so validation can prove completeness instead of relying on visual inspection alone.

Implementation should inspect existing manual-section data and component patterns before editing, then adapt the smallest local surface that supports individual entries across the existing Appendix IV sections.

## Proposed Content Model

Introduce a stable data shape equivalent to:

```ts
type ManualSignEntry = {
  id: string;
  sectionId: string;
  sourcePage: number;
  sourceOrder: number;
  spanishLabel: string;
  russianTranslation: string;
  assetPath: string;
  naturalWidth: number;
  naturalHeight: number;
  assetHash: string;
  sourceRef: string;
  extractionMethod: string;
  noUpscale: true;
  preservationNote?: string;
};
```

The exact format may follow repository conventions, but it must be machine-checkable. Prefer one inventory file plus section-specific imports or generated section arrays over hand-duplicating the same facts in many files.

## Asset Production Approach

Implementation must extract one asset per in-scope catalog item from official source imagery.

Recommended workflow:

1. Build a source inventory for pages `185-197` in page/visual reading order.
2. Identify whether existing official retained assets can provide better source-faithful quality for specific entries.
3. For remaining entries, export/crop from the official GCBA PDF at high DPI or source-native quality.
4. Preserve original protected pixels inside each crop. Do not enhance or clean the image.
5. Record output dimensions and hash after extraction.
6. Store assets in a repository-consistent local static asset location.
7. Run validation to ensure all inventory rows have corresponding files and matching hashes.

PR `#202` follow-up direction: deterministic equal-grid regions are not acceptable unless
each resulting region is individually verified against the source sheet. Implementation must
replace or refine the generated `cropRegion` data with per-page/per-entry coordinates for all
pages `185-197`, with special attention to non-uniform layouts in warning, informational,
temporary, horizontal-marking, and traffic-light/signal sheets.

The implementation may use scripts to generate assets and evidence, but generated scripts/data must be committed only if they are needed for repeatability or validation.

## UI Approach

Update Appendix IV manual sections so each in-scope entry is rendered as an individual card/row with:

- image area constrained by natural dimensions;
- Spanish label;
- Russian translation;
- accessible alt text derived from both labels;
- responsive grid/list behavior that keeps order intact.

Use the existing manual reader visual language. Keep the surface utilitarian and study-focused. Avoid placing cards inside larger decorative cards.

Whole-sheet panels may remain after the individual entries only as supplemental context, clearly not needed for coverage. If they cause confusion or duplicate clutter, Implementation may remove them from the primary learner path while preserving any durable source/evidence references.

## Validation And Tests

Add focused automated validation. The preferred shape is a repository script/test that reads the inventory and asserts:

- expected section ids exist for Appendix IV pages `185-197`;
- source-order keys are contiguous and monotonic;
- every entry has non-empty `spanishLabel` and `russianTranslation`;
- every asset exists locally;
- every asset hash matches;
- every asset has positive natural dimensions matching the inventory;
- no UI entry references a missing or non-inventory asset;
- no display metadata allows upscaling beyond natural dimensions;
- page `198-200` disposition is recorded.

If image dimensions or hashes need helper libraries, use existing project tooling where possible and keep dependencies consistent with the repo.

Manual verification for this feature must prove every inventory entry, not only representative
sections. Required visual evidence should include desktop and mobile coverage for all six
Appendix IV sign sections plus per-entry crop audit evidence or contact sheets that make all
`244` crop regions inspectable. A spot-check-only result remains merge-blocking unless
Architect explicitly records a narrowed non-blocking residual risk after reviewing objective
evidence.

## Documentation And Process Memory

Update durable docs only if Implementation changes conversion rules, validation commands, asset conventions, or the sign-section content contract. If the existing manual conversion guidelines already state the protected-image rule sufficiently, do not duplicate broad documentation.

`tasks.md` must be kept current by Implementation with:

- inventory count by section;
- pages `198-200` disposition;
- extraction method summary;
- validation commands and outcomes;
- screenshot evidence paths or descriptions;
- implementation feedback for Architect disposition, if any.

## Local Preflight

Implementation must run the relevant local preflight before pushing. At minimum:

- inventory/asset validation script or test;
- TypeScript/build checks used by the repository;
- static build;
- Docker contract commands if runtime scaffolding requires them for this repo state.

If a required command is unavailable or blocked, record the exact reason and fallback evidence in `tasks.md`.

## Review And Merge Path

Orchestrator will coordinate implementation, review, required checks, final Architect validation, final Analyst validation, merge readiness, and merge. Implementation Agent must not merge.

Review must specifically inspect:

- completeness of the source inventory;
- source-order preservation;
- protected-pixel compliance;
- asset quality and no-upscale behavior;
- caption correctness and placement outside protected images;
- validation coverage.

Final validation must compare the implemented result against the original user request and this feature memory, with special attention to "all signs," source order, and unmodified sign imagery.
