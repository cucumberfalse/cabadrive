# Spec: Manual Visual Content Crop

## Architect Scope

This Architect assignment plans feature `034-manual-visual-content-crop` only.
Architect writes only `spec.md`, `plan.md`, and `tasks.md` under
`specs/034-manual-visual-content-crop/`.

- Assigned worktree:
  `/Users/chap/devel/cabadrive-worktrees/034-manual-visual-content-crop`.
- Assigned branch: `codex/034-manual-visual-content-crop`.
- Verified latest-main base: `origin/main` at
  `7b410e6c55be177e860cf28641c5181d67890862`.
- Intake artifact:
  `specs/034-manual-visual-content-crop/feature-request.md`.
- Parallel work may exist. Preserve all sibling worktrees, branches, commits,
  PRs, dirty diffs, and process memory.
- Background: Analyst reported an earlier accidental intake write in the main
  worktree. This Architect assignment uses the Orchestrator-assigned worktree
  and does not edit `feature-request.md`.

## Goal

Correct interactive manual visuals whose useful official content is tiny inside
large white or empty page margins. The fix must return to the official source
PDF or best retained official source material, extract or crop the meaningful
visual content at faithful high quality, and render that visual large enough to
inspect without pixelated browser upscaling.

The reported defect is in the interactive `Руководство` section titled
`Официальные листы регулирующих знаков`: the image element/card is large, but
the official regulatory sign sheet is a small island near the lower center of a
mostly white page image.

## User Outcome

As a Russian-speaking learner, I can inspect official sign sheets, marking
sheets, signal sheets, maps, diagrams, photos, and source-document examples in
`Руководство` at readable manual size. I do not see a huge blank page with a
tiny source visual inside it, and the app does not blur the visual by stretching
an insufficient raster.

## Relationship To Feature `032`

Feature `032-manual-figures-full-width` corrected the layout defect where
major `source-image-cards` were constrained to thumbnail-like columns. It added
explicit `displayMode`, no-upscale metadata, and full-width card rendering.

This feature is a follow-up, not a repeat of `032`. A card can now be
full-width while still failing the user because the underlying image is a
full-page raster with excessive blank margins. Feature `034` targets the source
asset/crop quality and useful-content ratio of the visual itself.

## Scope

In scope:

- Correct the reported regulatory sign-sheet case, including Appendix IV pages
  `185` and `186` unless implementation proves a narrower mapping.
- Inspect the whole interactive manual/document for similar excessive-margin
  visual assets, not only the reported section.
- Treat Appendix IV page-sheet assets `185-200` as a high-risk group because
  they share the same sign/marking/signal sheet pattern.
- Include all current `source-image-cards`, `source-artwork` blocks, bespoke
  manual visual assets, and any other interactive manual images that could show
  useful content as a tiny island inside a larger raster.
- Re-extract, re-export, or crop affected visuals from
  `content/official-documents/originals/gcba-manual-vehiculo-4-ruedas-2023.pdf`
  or a better retained official source asset.
- Preserve official signs, road markings, signals, photos, maps, and
  source-document examples as source-faithful protected imagery. Cropping empty
  margin is allowed; editing meaningful pixels is not.
- Keep Russian explanation as selectable DOM/SVG text outside protected images.
- Add inventory, extraction/crop provenance, natural-dimension, hash,
  useful-content ratio, runtime display, and no-upscale evidence.
- Preserve the full-width/no-upscale layout contract from feature `032`.
- Update durable manual conversion documentation only if implementation changes
  reusable crop/inventory/evidence rules.

Out of scope:

- CSS-only zoom, transform, object-fit/object-position, or browser scaling of
  the existing margin-heavy raster as the primary fix.
- Stretching or distorting aspect ratios.
- Cropping meaningful official sign, label, road-marking, map, diagram, photo,
  caption, or source-document pixels.
- Translating, relabeling, redrawing, recoloring, cleaning, retouching,
  masking, inpainting, reconstructing, vector-recreating, or replacing
  protected official source imagery.
- Moving Russian text into protected images or overlaying Russian labels on
  protected sign/map/photo pixels.
- Replacing `Руководство` with a runtime PDF viewer, PDF.js canvas,
  iframe/object/embed PDF, remote image, network fetch, backend endpoint, or
  full-page raster-only reader.
- Changing practice questions, exam mode, content availability mode, source
  archive policy, Docker runtime contract, or unrelated product surfaces.

## Excessive-Margin Criteria

Implementation must produce a whole-manual inventory that records both
automatic measurements where feasible and manual reviewer dispositions.

Use the Orchestrator-provided one-off evidence as the baseline:

| Asset | Natural size | Approx useful bbox | Bbox area ratio | Ink ratio |
| --- | ---: | ---: | ---: | ---: |
| `sign-sheet-185-source-as-is.jpg` | `2976x4209` | `1190,1682,503x821` | `0.0330` | `0.0040` |
| `sign-sheet-186-source-as-is.jpg` | `2976x4209` | `1242,1682,544x821` | `0.0357` | `0.0043` |
| `sign-sheet-187-source-as-is.jpg` | `2976x4209` | `1190,1682,511x821` | `0.0335` | not recorded |
| `marking-sheet-195-source-as-is.jpg` | `2976x4209` | `1190,1682,513x821` | `0.0336` | not recorded |
| `hospital-map-source-as-is.png` | current crop | not recorded | `0.4205` | not recorded |
| `body-posture-source-as-is.png` | current crop | not recorded | `0.3652` | not recorded |

Initial detector threshold may use non-white pixels where each RGB channel is
less than `245`, but implementation may refine it if evidence shows a safer
threshold for anti-aliased source artwork. The threshold and any false-positive
handling must be recorded.

A visual must be flagged for correction or explicit exception when one or more
of these apply:

- useful-content bbox area ratio is below `0.20`;
- useful-content bbox width or height ratio is below `0.60` for a major manual
  visual;
- the rendered useful-content bbox, not merely the outer image element, occupies
  less than `65%` of the manual content width on desktop or mobile when source
  quality should allow a larger display;
- the asset is a full-width/page-sheet visual but `sourceRegion` still records
  the whole PDF page/render rather than the meaningful source content;
- a reviewer can reproduce the user symptom: a huge white or empty image area
  with a tiny official visual island.

A visual may be dispositioned as acceptable when evidence shows it is already a
tight crop, intentionally sparse source material, a genuinely compact snippet,
or a source-limited case where higher-quality extraction cannot improve the
user outcome without altering official pixels.

## Extraction And Crop Requirements

- Corrected affected assets must come from the official PDF or best retained
  official source material, not from AI generation, redraws, generic icons, or
  browser magnification.
- Do not enlarge a cropped low-resolution raster with a bitmap scaler and call
  it a source-quality fix.
- If the current x5 page render yields an insufficient crop width for runtime
  display, re-render the relevant source region/page at higher DPI or use a
  source-native extraction so the final crop has enough natural pixels.
- The crop should remove only excessive outer blank/empty margins. Preserve
  all meaningful signs, labels, captions, map details, diagram lines, and other
  exam-relevant source pixels.
- Add modest safety padding around the useful bbox so anti-aliased edges,
  captions, and tiny labels are not clipped. The padding amount or rule must be
  recorded.
- Prefer crop-specific asset names that make provenance clear, for example
  `sign-sheet-185-source-crop-as-is.jpg`, unless implementation records why
  replacing the existing path is safer and updates all provenance/tests.
- For corrected crops, `sourceRegion` must describe the meaningful crop region
  in the chosen source coordinate system. It must not remain the old full-page
  `0,0,2976,4209` unless an explicit exception proves the page itself is the
  meaningful visual.
- Evidence must record source page, source PDF or source asset path, crop
  bounds, extraction method, output dimensions, SHA-256 where practical,
  before/after useful-content ratio, runtime display size, and no-upscale proof.
- New corrected crops should have useful-content bbox width and height ratios
  of at least `0.75` where the source shape allows it, or a documented exception
  for intentionally sparse visuals. For page-sheet assets, target bbox area
  ratio after crop should be at least `0.55`.
- For reported sign-sheet crops, natural crop width must meet or exceed the
  intended maximum CSS display width. Prefer enough source pixels for common
  high-DPI screens when feasible; if the official source cannot provide that,
  record the source limitation and cap display rather than upscaling.

## Functional Requirements

- FR-001: The whole interactive manual must have an inventory for
  excessive-margin/useful-content-ratio risk across source-image cards,
  source-artwork, and bespoke visual assets.
- FR-002: Appendix IV page-sheet assets `185-200` must be scanned and
  dispositioned as a group.
- FR-003: Page `185` and page `186` regulatory sign sheets must be replaced or
  regenerated as high-quality meaningful-content crops unless implementation
  records a blocker approved by Architect/Orchestrator.
- FR-004: Any inventory item with bbox area ratio below `0.20`, or an
  equivalent manual-review tiny-content symptom, must be corrected or receive
  a specific recorded exception.
- FR-005: Corrected assets must be extracted from the official source at
  sufficient DPI/source-native quality so runtime display does not browser
  upscale beyond natural asset dimensions.
- FR-006: The useful official content, not just the outer `<img>` box, must
  occupy a meaningful share of the manual content width after correction.
- FR-007: Protected source-as-is imagery remains unedited except for removing
  empty outer margin by source-faithful cropping.
- FR-008: Existing feature `032` full-width behavior remains intact, including
  `displayMode`, no-upscale caps, panoramic contained scrolling where present,
  local assets, lazy loading, source exception attributes, and no document-level
  horizontal overflow.
- FR-009: Russian explanation remains selectable DOM/SVG text outside protected
  images.
- FR-010: Manual navigation, section order, route hashes, source page metadata,
  source archive policy, and local-first behavior remain stable.
- FR-011: Tooling/tests must catch regressions where a full-width image element
  hides a tiny useful-content island inside excessive blank margins.

## Acceptance Criteria

1. Given the user opens `Официальные листы регулирующих знаков`, page `185`
   shows a high-quality source crop where the regulatory sign sheet itself
   occupies the manual reading area; the old tiny island inside a large white
   page is gone.
2. Given the user opens the same section, page `186` receives the same
   source-quality crop treatment.
3. Given Appendix IV pages `185-200` are checked, every excessive-margin
   page-sheet sibling is corrected or explicitly dispositioned with evidence.
4. Given the whole interactive manual inventory runs, every manual visual asset
   has an affected/not-affected/corrected/exception disposition with source
   page, asset path, natural dimensions, useful bbox or reviewer note, ratio
   where practical, protected status, and reason.
5. Given a corrected asset is displayed on desktop and mobile, Playwright or an
   equivalent browser check proves the useful-content bbox occupies a meaningful
   share of the manual content width and the image is not blurry from browser
   upscaling.
6. Given a corrected protected sign/marking/signal/photo/map/source-document
   image is inspected, meaningful official pixels remain source-faithful and
   Russian text remains outside the image.
7. Given already tight crops such as the hospital map/body-posture examples are
   inventoried, they are not blindly recropped or enlarged; their disposition
   explains why their ratio is acceptable or source-limited.
8. Given local verification runs, content tests, source-fidelity validation,
   TypeScript/build, Playwright desktop/mobile evidence, `git diff --check`, and
   preflight all pass or any omitted check has a documented blocker.

## Negative Scenarios

- Enlarging the current image element while the useful sign sheet remains tiny
  inside a blank page.
- Cropping the existing x5 page raster to a `~500px` useful area and then
  displaying it at manual width, causing pixelation.
- Fixing only `sign-sheet-185-source-as-is.jpg` while leaving page `186` or
  other Appendix IV page sheets with the same excessive-margin ratio.
- Recording the outer image/card width as evidence without measuring the useful
  content inside the image.
- Using CSS `transform`, `zoom`, `object-fit`, `clip-path`, `image-rendering`,
  or similar display tricks as the primary quality fix.
- Removing sign labels, tiny captions, or other official source details while
  auto-cropping.
- Retouching, repainting, inpainting, redrawing, vector-recreating, or
  translating protected source imagery.
- Moving Russian explanation into protected source images to save layout space.
- Reintroducing runtime PDF rendering, remote manual assets, or a full-page
  raster-only reader.
- Breaking mobile layout with document-level horizontal overflow.
- Weakening existing source-fidelity, hash, no-upscale, source exception, or
  feature-memory evidence.

## Verification Requirements

Implementation must record exact commands and evidence in `tasks.md`.

Required local checks:

- `node scripts/check-feature-memory.mjs --worktree`
- focused inventory/source-crop content tests
- `pnpm run validate:manual-guide`
- `pnpm run validate:content`
- `pnpm exec tsc --noEmit`
- `pnpm run test`
- `pnpm run build`
- focused Playwright desktop/mobile checks for corrected examples and
  representative inventory findings
- `git diff --check`
- `pnpm run preflight` before PR readiness when feasible

Evidence must include:

- whole-manual inventory/disposition table or structured evidence;
- before/after useful-content bbox ratios for corrected assets;
- extraction/crop method and output dimensions;
- source PDF/page/crop bounds and SHA-256 where practical;
- natural-dimension/runtime-display/no-upscale proof;
- desktop/mobile screenshots or assertions for pages `185` and `186`;
- representative Appendix IV and non-Appendix evidence when corrected;
- proof that source-as-is protected pixels are unedited except empty-margin
  cropping.

## Implementation Slice Guidance

Use one implementation PR slice unless implementation discovers a narrow
blocker such as a missing official source region, unsafe automatic crop
behavior, unexpectedly broad asset regeneration, or repository/parallel-work
conflict. The work is cohesive: inventory, source extraction/crops, metadata,
renderer/test preservation, documentation updates when needed, evidence, and
process memory all serve one user-visible defect class.

No additional user clarification is required. If an official source cannot
yield a better faithful crop for a candidate, Implementation Agent must record a
source-quality/no-upscale limitation and feedback for Architect disposition
rather than stretching or retouching the image.

## Architect Handoff

This feature is ready for Implementation Agent after Orchestrator assignment.
Implementation must preserve role boundaries and sibling work, then keep
`tasks.md` current with inventory results, extraction decisions, verification
evidence, known issues, and any feedback requiring Architect disposition.
