# Feature Request: Manual Image Readability And Russian Translations

## Intake Metadata

- Feature ID: `035-manual-image-readability-translations`
- Intake role: Analyst
- Assigned worktree: `/Users/chap/devel/cabadrive-worktrees/035-manual-image-readability-translations`
- Assigned branch: `codex/035-manual-image-readability-translations`
- Verified base provided by Orchestrator: `origin/main` at `74c104f6d3c73a2586000dddd85953ca31586fb7`
- Base verification: Orchestrator reported this worktree was created from verified `origin/main`.
- Local branch observed during intake: `codex/035-manual-image-readability-translations`
- Local HEAD observed during intake: `74c104f6d3c73a2586000dddd85953ca31586fb7`
- Parallel-work warning: parallel agents/worktrees may be active. Preserve all existing dirty diffs, branches, commits, PRs, and process memory. Do not touch sibling worktrees or unrelated files.
- Existing prefix check: the maximum existing numeric prefix under `specs/` is `034`; this feature uses the next assigned prefix `035`.
- Intake artifact scope: this Analyst intake creates only `specs/035-manual-image-readability-translations/feature-request.md`. Analyst does not create `spec.md`, `plan.md`, `tasks.md`, code, tests, runtime assets, durable docs, commits, pushes, PRs, reviews, or merge actions.

## Original User Request

The original request was given in Russian:

> выполни это как оркестратор до полного завершения
>
> Проверил read-only по всему manual-guide: 50 разделов, 82 image references. Нашел 54 изображения с испанским текстом внутри, из них 33 выглядят проблемными по читаемости или отсутствию нормальной русской расшифровки. pnpm run validate:manual-guide проходит, но этот валидатор проверяет source fidelity, а не реальную читаемость.
> Главное подтверждение: проблема не единичная. В app4-signs-horizontal.ts (line 64), app4-signs-informational.ts (line 66), app4-signs-traffic-lights.ts (line 66) и аналогичных app4-signs-warning/temporary/regulatory карточках стоят целые листы шириной примерно 664-757px; под ними в основном только общий bodyRu, а не перевод каждой подписи. То есть ваше "переводов нет под изображением" для этих листов подтверждается.
> Новый пример тоже подтверждается: в app3-driving-factors.ts (line 74) body-posture-source-as-is.png оставлен как source-as-is с испанскими подписями; русский текст есть, но это общий пересказ в bodyRu, а не читаемые подписи сопоставимого размера.
> Еще группы, которые стоит включить в исправление: app1/app2/app3-safety-elements шинa/слепая зона/подголовник/ремень, app2-highways-hospitals карта 440x380, ch2-required-documents маленькие DNI/license/RVA/VTV карточки, ch1-bicycle маленькие sign/distance картинки, ch4-distractions и ch5-anticipatory-efficient-driving фото с цитатами. Рендер устроен так, что сначала показывается <img>, потом текст карточки: App.tsx (line 2501); CSS сохраняет натуральную ширину/скролл, но не решает качество исходного растра: styles.css (line 2812).
> Для исправления нужен repository-changing flow через Orchestrator. По сути задача должна требовать: заменить/разбить нечитаемые листы на читаемые учебные карточки или high-res crops, добавить русские DOM-подписи/переводы под каждым таким изображением, и добавить валидатор/визуальный аудит именно на читаемость и наличие переводов.

Normalized intake reading:

- The learner problem is not isolated to one image or one section.
- The current `pnpm run validate:manual-guide` gate passes because it validates source fidelity and visual completeness, but it does not prove real learner readability or Russian translation coverage for Spanish text embedded inside images.
- Images that remain official/protected source pixels may keep Spanish text inside the image, but the learner must get readable, selectable Russian support under or near the image for each relevant embedded label/caption/term, rather than only a broad `bodyRu` paragraph.
- Some image sheets should be split into readable source-faithful cards, panels, high-resolution crops, or equivalent official-source fragments so individual labels can be inspected without pixelated browser upscaling.
- This is an Orchestrator-routed repository-changing request; this Analyst artifact exists because Orchestrator assigned Analyst intake.

## Request Classification

This is a repository-changing corrective content/readability/validation request for the current interactive Russian `Руководство` manual surface.

It is not the same defect as feature `034-manual-visual-content-crop`, which was merged to `main` as PR `#200` at `74c104f` and handled crop/scale/high-quality extraction for many manual visuals. Feature `034` made many source visuals larger, tighter, and source-faithful, and it introduced Russian term translations for some examples. This new request focuses on the remaining embedded-Spanish-text problem: images can now be source-faithful and reasonably cropped, yet still fail a Russian-speaking learner because Spanish labels/captions are too small to read or are not translated in structured DOM text.

This feature should remain one intake because the user described one whole-manual defect class: every visible Spanish text image in the interactive manual must be inventoried for readability and Russian support coverage, then corrected or explicitly dispositioned.

## Project Context

- Cabadrive is a local-first React/TypeScript/Vite web trainer for Russian-speaking drivers preparing for the CABA theory exam.
- There is no runtime backend. Manual content and assets must remain bundled local/static content after build.
- The user-facing manual destination is `Руководство`, a native interactive Russian document surface derived from the official GCBA 4-wheel manual and organized by the source `Índice`.
- Manual conversion rules require native HTML/CSS/SVG or local image assets, selectable Russian text, source-faithful local artwork crops, no runtime PDF viewer, no remote images, no network fetches, no backend endpoint, and no live AI dependency.
- Manual conversion rules already say intended-readable embedded text inside source images should be visually comparable to nearby manual body text. If source-faithful extraction, tighter crop, split/sub-crop presentation, or contained figure scrolling cannot make text readable without upscaling or protected-pixel edits, the limitation must be recorded as a source-limited exception for owner disposition.
- Photos, traffic-sign images, road-marking images, maps, and source-document examples may be protected source-as-is assets. They must not be translated inside the pixels, relabeled, redrawn, recolored, cleaned, reconstructed, retouched, masked, inpainted, or otherwise visually modified. Russian explanation, glossary, caption, or translation belongs outside the protected image.
- The current `SourceImageCardsBlockView` renders the image first, then title/body text and optional `termTranslations`. A generic `bodyRu` paragraph can exist while the actual embedded Spanish captions still have no per-label Russian counterpart.
- The current `manual-guide` validation commands include source-fidelity and visual-completeness audits, but the user's read-only audit indicates those checks are not sufficient for readability or translation coverage.

## User Audit Baseline

The user reported a whole-guide read-only audit with these baseline numbers:

- `50` manual-guide sections inspected.
- `82` image references found.
- `54` images contain Spanish text inside the image.
- `33` images look problematic because the embedded Spanish text is hard to read, lacks a normal Russian transcription/translation, or both.
- `pnpm run validate:manual-guide` passes despite these learner-readability gaps.

Architect/Implementation Agent should verify or refresh these counts during planning/implementation, but intake treats them as credible problem evidence rather than a blocker requiring user clarification.

## User-Reported Examples

High-priority examples from the request:

- Appendix IV sign and signal sheets:
  - `src/data/manual-sections/app4-signs-horizontal.ts`
  - `src/data/manual-sections/app4-signs-informational.ts`
  - `src/data/manual-sections/app4-signs-traffic-lights.ts`
  - analogous `app4-signs-warning`, `app4-signs-temporary`, and `app4-signs-regulatory` cards
- These sections include whole sheets around `664-757px` wide, with mostly a general `bodyRu` paragraph rather than translations for every visible Spanish caption/label.
- `src/data/manual-sections/app3-driving-factors.ts`, especially `body-posture-source-as-is.png`: the image keeps Spanish labels source-as-is, and the Russian text is a broad explanation rather than label-by-label readable support.
- Safety-element sections across `app1`, `app2`, and `app3`, including tire, blind spot, headrest, and belt/seatbelt visuals.
- `src/data/manual-sections/app2-highways-hospitals.ts`, especially the hospital map around `440x380`.
- `src/data/manual-sections/ch2-required-documents.ts`, including small DNI, license, RVA, and VTV document/example cards.
- `src/data/manual-sections/ch1-bicycle.ts`, including small sign and distance visuals.
- `src/data/manual-sections/ch4-distractions.ts` and `src/data/manual-sections/ch5-anticipatory-efficient-driving.ts`, including photos with quotes or source text.
- Runtime/rendering context: `SourceImageCardsBlockView` in `src/App.tsx` renders `<img>` before card text; `src/styles.css` preserves natural width and contained scrolling, but cannot make low-readable source text or absent translations acceptable by itself.

## Desired Outcome

The interactive manual should become usable for a Russian-speaking learner with minimal Spanish when an image contains Spanish text:

- Unreadable whole sheets should be replaced, split, or supplemented with readable source-faithful study cards, panels, high-resolution crops, source-native official images, or contained scroll layouts as appropriate.
- Protected official image pixels remain unchanged. Spanish text inside official/protected pixels is not translated inside the image.
- Every learner-relevant embedded Spanish label, caption, term, quote, document word, map label, sign caption, or diagram label should have selectable Russian DOM support under or near the image, unless explicitly classified as not learner-relevant or source-limited with evidence.
- Per-image/per-label Russian support should be structured enough to validate, for example via `termTranslations`, a richer translation/glossary data shape, captions, or another Architect-approved model. A broad `bodyRu` paragraph alone is not enough when the image contains multiple intended-readable Spanish labels.
- The manual-guide validation pipeline should include an automated or semi-automated readability/translation coverage audit so future changes cannot pass only on source fidelity while leaving visible Spanish image text unreadable or untranslated.

## Scope

In scope:

- Inventory the whole interactive `Руководство` manual-guide surface, including all current image references and all block types that render images, not only `source-image-cards`.
- Use the user's audit counts as the initial target: refresh or confirm `50` sections, `82` image references, `54` Spanish-text images, and `33` problematic images.
- Classify every image with visible Spanish text by image type, protected/source-as-is status, source page/region, asset path, card/block ID, runtime dimensions, whether the Spanish text is intended-readable, and whether Russian DOM support exists.
- Correct Appendix IV sign, warning, informational, temporary, horizontal-marking, traffic-light, and regulatory sheets where whole-sheet display leaves individual labels/captions too small or untranslated.
- Correct the body-posture image in `app3-driving-factors` so each meaningful Spanish body-part/seat/posture label has comparable Russian support outside the image, and the source image itself remains readable at runtime.
- Include the safety-element examples named by the user: tire, blind spot, headrest, and belt/seatbelt visuals across App I/App II/App III as applicable.
- Include the hospital map, required-document cards, bicycle sign/distance images, distraction photo/quote material, and anticipatory/efficient-driving quote/photo material named by the user.
- Add or update source-faithful image assets only when needed for readability, using official-source/high-quality extraction or split/crop strategies consistent with the manual conversion contract.
- Add selectable Russian DOM captions, glossaries, label translations, or nearby explanatory tables under/near each affected image. The support must be specific enough that the learner can map visible Spanish image text to Russian meaning.
- Add validation/evidence that checks both readability and translation presence. This may include deterministic data audits, required structured translation fields for `visibleSpanish` images, visual size thresholds, screenshot evidence, OCR/manual manifest records, and explicit exceptions.
- Preserve and, if necessary, update durable manual conversion documentation only if the implementation changes or clarifies the reusable readability/translation contract for future manual visuals.

Out of scope for this intake:

- Analyst does not choose the exact data schema, validator algorithm, OCR/tooling strategy, crop tool, asset naming scheme, UI component design, or test architecture.
- Analyst does not edit code, tests, assets, durable docs outside this intake artifact, existing feature memories, commits, pushes, PRs, reviews, or merge actions.
- Do not translate, relabel, redraw, recolor, clean, mask, retouch, inpaint, reconstruct, or otherwise alter official/protected sign, road-marking, photo, map, document-example, or source-image pixels.
- Do not put Russian translations inside protected image pixels or overlay opaque Russian plates over official pixels.
- Do not replace the interactive manual with a runtime PDF viewer, PDF.js canvas, iframe/object/embed PDF, remote image, runtime fetch, backend endpoint, or full-page raster-only manual reading.
- Do not change practice questions, exam mode, the source archive, backend/runtime architecture, Docker-only runtime contract, or unrelated product surfaces.
- Do not treat feature `034` crop/scale work as incomplete by default. Reopen `034`-touched assets only when they still contain unreadable/untranslated Spanish image text under this feature's criteria.

## Acceptance Expectations

- The final inventory covers all manual-guide image references and explicitly identifies every image with embedded Spanish text, including the user's `54`/`33` problem set or a refreshed count with evidence.
- Every problematic visible-Spanish image is either corrected or explicitly dispositioned with a narrow, evidence-backed reason.
- Appendix IV whole sheets no longer rely on only a generic `bodyRu` paragraph when individual Spanish captions/labels are learner-relevant. They provide readable source-faithful cards/panels/crops and structured Russian DOM translations/glossaries close to the image.
- `body-posture-source-as-is.png` no longer leaves the learner with only a broad prose summary. Meaningful labels in the posture image have adjacent Russian support that can be mapped to the image.
- Safety-element visuals, the hospital map, document cards, bicycle images, and quote/photo examples named by the user are covered by implementation evidence as fixed or explicitly dispositioned.
- For protected official images, pixels remain source-faithful and unchanged; Russian translations live outside the image and are selectable.
- For non-protected or source-transferred diagrams/infographics, any Russian overlay strategy remains source-faithful, selectable, and covered by existing manual conversion rules.
- The runtime UI keeps image and Russian support visually connected. The learner should not have to infer many Spanish labels from a distant generic paragraph.
- Text inside intended-readable images is visually comparable to nearby manual body text at intended desktop and mobile display sizes, or a source-limited exception records why that is impossible and what alternatives were attempted.
- The new validation/readability audit fails when a visible-Spanish image lacks required structured Russian support or a recorded exception.
- The new validation/readability audit fails when an image is accepted only because source fidelity passed while intended-readable embedded text remains too small, blurry, or browser-upscaled beyond source quality.
- Existing source-fidelity, no-upscale, local-first, forbidden-runtime-pattern, navigation, and responsive layout guards remain intact.
- Standard verification for touched code/assets/docs passes, including `pnpm run validate:manual-guide`, focused tests, Playwright or equivalent browser evidence, build/preflight as assigned by Architect, and `git diff --check`.

## Negative Scenarios

- Passing `validate:manual-guide` while images with Spanish labels remain unreadable to the learner and lack Russian DOM translations.
- Treating a generic `bodyRu` paragraph as sufficient for a sheet with many visible Spanish captions.
- Fixing only one reported file while leaving analogous `app4` sign/marking/signal sheets in the same state.
- Enlarging or scrolling an image without adding translations for the Spanish labels that the learner must understand.
- Adding translations for only the card title while embedded labels, captions, quotes, map labels, or document text remain untranslated.
- Translating or editing text inside protected official sign, road-marking, map, photo, quote, or document-example pixels.
- Overlaying opaque Russian text plates on top of protected official pixels.
- Cropping or splitting images in a way that removes meaningful official signs, captions, labels, map details, quote text, or document fields.
- Browser-upscaling a low-resolution or source-limited image until it becomes pixelated.
- Creating document-level horizontal overflow or mobile clipping while trying to preserve image text size.
- Weakening the source-fidelity, high-resolution extraction, no-upscale, checksum/hash, or visual evidence contracts from feature `034`.

## Assumptions

- The user's read-only audit counts are sufficiently credible for intake. Architect/Implementation Agent should refresh them with repository evidence before final acceptance.
- "Русская расшифровка под изображением" means selectable Russian DOM support close enough to the image for a learner to map each relevant Spanish label/caption/term to Russian meaning. It may be a glossary/list/table/caption under or beside the image, depending on responsive design.
- Protected source pixels remain Spanish and unchanged; the fix is better readability and adjacent Russian support, not image translation.
- Some Spanish text inside protected images may be official sign-body or document pixels that should not be modified. The implementation still needs external Russian learner support unless Architect explicitly records the text as not learner-relevant or source-limited.
- Some already-corrected feature `034` crops may satisfy size/readability but still need structured translation coverage.
- No normal-flow user clarification is required before architecture work.

## Risks

- Automatic extraction of embedded Spanish text may miss small labels or over-require translations for decorative/non-learner text unless the inventory has clear classification rules.
- A naive "translate every visible string" rule could conflict with protected official sign/map/photo/document boundaries if it encourages pixel edits or overlays.
- Dense sign sheets and maps may need careful grouping to stay usable without creating overwhelming glossary blocks.
- More high-resolution crops or split panels may increase asset count and bundle size if not scoped and compressed carefully.
- Validation may become noisy if it cannot distinguish official protected internals, external captions, source-limited text, and already-sufficient DOM summaries.
- Some source images may be inherently low-resolution or crowded; those cases need transparent exception evidence rather than stretching or retouching.

## Open Questions

- No user clarification is needed for intake.
- Architect should define objective readability thresholds, such as minimum rendered text height, relation to nearby body text, source/natural pixel limits, or screenshot-based reviewer criteria.
- Architect should decide whether the translation coverage source of truth is existing `termTranslations`, a richer per-image manifest, inline card data, evidence JSON, or a combination.
- Architect should decide how to classify text that is inside protected sign bodies, document examples, map labels, photo quotes, and external catalog captions.
- Architect should decide whether automated OCR is appropriate, or whether a deterministic manually reviewed manifest is safer for this corpus.
- Architect should decide how to handle source-limited exceptions and whether owner disposition is required for any remaining unreadable-but-protected official image text.

## Acceptance Evidence Expected

- A whole-manual image-text inventory with section ID, block/card ID, asset path, source page/region, image type, protected/source-as-is classification, visible-Spanish status, readability status, translation coverage status, and disposition.
- A refreshed count for total sections, image references, images with Spanish text, problematic images found, fixed images, and accepted exceptions.
- For each corrected image group, before/after or equivalent evidence showing rendered readability and the nearby Russian translation/caption/glossary.
- Specific evidence for the user's named groups: Appendix IV sign/marking/signal sheets, `app3` body posture, safety elements, hospital map, required documents, bicycle visuals, distractions, and anticipatory/efficient-driving quote/photo examples.
- Validation evidence proving that missing per-image Russian support now fails the manual-guide gate or a dedicated new gate wired into `validate:manual-guide`.
- Visual evidence on desktop and mobile for representative corrected categories, including at least one dense sign sheet, one body/diagram label image, one document/card example, one map, and one quote/photo example if affected.
- Source-fidelity evidence confirming protected image pixels are unchanged except for allowed source-faithful cropping/splitting.
- No-upscale/runtime-display evidence for new or changed image assets.
- Standard local verification evidence appropriate to the touched files, including focused content/data tests, TypeScript/build, Playwright or equivalent browser checks, `pnpm run validate:manual-guide`, `git diff --check`, and preflight where required by Architect tasks.

## Sources Read During Intake

- `AGENTS.md`
- `.specify/memory/constitution.md`
- `docs_project/README.md`
- `docs_project/project-idea.md`
- `docs_project/project/frontend/frontend-docs.md`
- `docs_project/project/frontend/manual-conversion-guidelines.md`
- `docs_project/project/backend/backend-docs.md`
- `docs_project/project/feature-inventory.md`
- `docs_project/screens/learning-and-exam-flows.md`
- `docs/specify/README.md`
- `specs/034-manual-visual-content-crop/feature-request.md`
- `src/App.tsx`
- `src/styles.css`
- `src/data/manualGuide.ts`
- Representative manual section files named by the user, including `app3-driving-factors.ts` and `app4-signs-horizontal.ts`
- `scripts/manual-guide-source-fidelity.mjs`
- `scripts/manual-guide-visual-completeness-audit.mjs`
- `content/validation/manual-guide-visual-completeness.evidence.json`

No external research was needed for this intake because the user audit and repository manual-conversion guidance already define the relevant learner-readability, source-fidelity, and Russian-support expectations.

## Analyst Handoff

This intake is ready for Orchestrator handoff to Architect. The customer intent is clear: the manual must not merely preserve source pixels and pass source-fidelity validation. For every image with learner-relevant Spanish text, the guide must make the text readable where possible and provide selectable Russian DOM translations/captions/glossaries close to the image, while preserving protected official pixels unchanged and adding validation that specifically audits readability and translation coverage.
