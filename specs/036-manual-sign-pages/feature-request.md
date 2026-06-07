# Feature Request: Manual Sign Pages As Individual High-Quality Sign Entries

## Intake Context

- Analyst role: assigned by Orchestrator for feature intake only.
- Assigned worktree: `/Users/chap/devel/cabadrive-worktrees/036-manual-sign-pages`.
- Assigned branch: `codex/036-manual-sign-pages`.
- Verified base: `origin/main` at `667f02f1a0895de63caa9ef7d4c33625fce6528c`.
- Feature folder: `specs/036-manual-sign-pages/`.
- Existing maximum numeric prefix observed under `specs/`: `035`; this feature uses `036`.
- Parallel-work warning from Orchestrator: parallel Orchestrators/agents may be active; preserve all existing dirty diffs, branches, commits, PRs, sibling worktrees, and process memory.
- User constraint: the user explicitly appointed Orchestrator and asked to continue to full completion without follow-up questions. Analyst did not ask clarifying questions; assumptions, risks, and open questions are recorded below.

## Original User Request

Russian original:

> нужно переделать страницы со знаками, вот так
> 1. вырезаем отдельно каждый знак, в максимально высоком качестве, как в примере
> 2. пишем к нему подпись текстом, оргинальную на испанском и перевод, NO AVANZAR 
> Проезд запрещен для примера
>
> обрати внимание на качество, оно должно быть максимально хорошим
> каждый знак обрабатывается отдельно
> важно сохрагить порядок знаков
> важно, чтоб были обработаны все знаки
> важно, что сами знаки, включая их части, ттабоички и напдписи непосредственно на знаках нельзя никак менять и модифицировать, можно исползовать только оригинальное изображение
>
> доведи до мержа

Plain-language interpretation:

The user wants the manual road-sign pages rebuilt so that every sign is presented as its own high-quality original-image crop, with a text caption below/near it containing the original Spanish label and a Russian translation. The example is Spanish `NO AVANZAR` with Russian `Проезд запрещен`. The order of signs must match the source order, all signs must be covered, and the sign image itself, including any embedded plates, tablets, pictograms, or text directly on the sign, must remain unchanged original source imagery.

## Project Context Read

Analyst read the repository and product memory in the required order where relevant:

- `.specify/memory/constitution.md`
- `docs_project/README.md`
- `docs_project/project-idea.md`
- `docs_project/project/frontend/frontend-docs.md`
- `docs_project/project/backend/backend-docs.md`
- `docs_project/project/feature-inventory.md`
- `docs_project/screens/learning-and-exam-flows.md`
- `docs/specify/README.md`
- Relevant existing sign/manual guidance and source files:
  - `docs_project/project/frontend/manual-conversion-guidelines.md`
  - `src/data/manual-sections/app4-signs-regulatory.ts`
  - `src/data/manual-sections/app4-signs-warning.ts`
  - `src/data/manual-sections/app4-signs-informational.ts`
  - `src/data/manual-sections/app4-signs-temporary.ts`
  - `src/data/manual-sections/app4-signs-horizontal.ts`
  - `src/data/manual-sections/app4-signs-traffic-lights.ts`
  - `content/official-documents/manifest.json`
  - `content/manuals/gcba-manual-vehiculo-4-ruedas-2023/navigation.ru.json`
  - `content/manuals/gcba-manual-vehiculo-4-ruedas-2023/interactive-guide/section-registry.chapters-1-2.json`

Current product context:

- Cabadrive is a static local-first React/TypeScript/Vite app with no runtime backend.
- The user-facing `Руководство` surface is an interactive Russian manual reader for the official GCBA four-wheel vehicle manual.
- The manual conversion contract forbids runtime PDF viewers, remote images, generated replacements for protected source visuals, and image-only page rendering.
- Photos, traffic-sign images, signal images, and road-marking images are protected source-as-is assets. They must not be translated, relabeled, redrawn, recolored, cleaned, reconstructed, retouched, masked, inpainted, or otherwise modified. Russian explanation must live outside the protected image.
- New source images/crops should use high-resolution extraction: x5/source export, direct high-DPI PDF export, source-native raster dimensions, or documented equivalent/better method, with evidence for method, dimensions, hashes where practical, runtime display size, and no-upscale behavior.
- Current Appendix IV navigation is:
  - `app4-signs-regulatory`, source pages 185-186
  - `app4-signs-warning`, source pages 187-188
  - `app4-signs-informational`, source pages 189-192
  - `app4-signs-temporary`, source pages 193-194
  - `app4-signs-horizontal`, source pages 195-196
  - `app4-signs-traffic-lights`, source pages 197-200
- The official source archive records `gcba-manual-vehiculo-4-ruedas-2023` as the official GCBA manual PDF, retrieved 2026-05-09, with local raw original `content/official-documents/originals/gcba-manual-vehiculo-4-ruedas-2023.pdf`.
- Current implementation mostly uses whole-sheet source crops for Appendix IV. `app4-signs-regulatory` also has a focused `NO AVANZAR` example and several Anexo L regulatory panels. The new request raises the bar from whole sheets/panels to every sign handled separately.

## Goal

Rework the manual sign pages so that the learner can inspect each official sign individually at the highest practical quality, in the original source order, with a nearby text caption that shows the original Spanish label and Russian translation while preserving the original sign image pixels exactly.

## Scope

In scope:

- Appendix IV sign/signal/marking material currently represented by the manual sign sections listed above, unless Architect determines a narrower or broader sign-surface boundary is required to satisfy "all signs."
- Individual handling for every sign or sign-like catalog item on the affected pages, including regulatory, warning, informational, temporary, horizontal marking, and light/signal entries where they function as catalog signs/signals/markings.
- High-quality original-image crops or source-faithful individual sign assets produced from the official source material, not approximate redraws or generated replacements.
- Captions as selectable text outside protected image pixels:
  - original Spanish label, preserving source wording where available;
  - Russian translation, e.g. `NO AVANZAR` -> `Проезд запрещен`.
- Preservation of source order across pages and within each page/group.
- Verification evidence proving completeness, source order, image quality, no-upscale behavior, and protected-pixel preservation.
- Updates to durable docs/process memory only if behavior, validation, or conversion rules change.
- Full PR workflow through merge, coordinated by Orchestrator after role-appropriate planning, implementation, review, checks, final validation, and merge gates.

Out of scope unless Architect explicitly expands it:

- Replacing official signs with generated, redrawn, vectorized, stylized, translated, or cleaned versions.
- Translating, modifying, masking, retouching, recoloring, removing, or overlaying anything inside sign bodies, supplementary plates/tablets, pictograms, road markings, traffic-light/signal artwork, or other protected visual source material.
- Changing the official source archive content itself except for process-approved evidence updates if needed.
- Changing question-bank practice content, exam mode behavior, or unrelated manual chapters.
- Adding a runtime backend or network dependency.
- Asking the user for further requirement clarification in the normal flow, because the user requested no follow-up.

## Assumptions

- "Pages with signs" refers primarily to Appendix IV in the interactive `Руководство`, source pages 185-200, because those are the current manual road-sign sections and existing memory identifies them as the sign-sheet surface.
- "All signs" means every learner-meaningful catalog item shown in the affected sign/signal/marking pages, not only a representative subset and not only page 185.
- "Each sign is processed separately" means the final user-facing layout should expose each item as an individual entry/card/row with its own source image and Spanish/Russian caption. Group panels or overview sheets may remain only as supplementary context if they do not replace individual entries.
- Sign order should follow official source order: page order first, then the visual reading order inside each page/group.
- If a source item consists of a sign plus an attached plate/tablet or embedded words, the entire sign-plus-plate visual is protected original imagery. The Russian translation must be outside the image.
- Spanish text that is a source catalog caption outside the protected sign image can be repeated as external selectable text; the source-image copy of that caption remains unchanged if included in the crop.
- The highest practical quality may require using the official PDF at high DPI, existing retained official source assets, or another original official source asset already in the repository; any non-PDF original source must be evidence-backed and source-faithful.
- The user's "доведи до мержа" is an instruction for Orchestrator-managed completion, not an Analyst permission to implement, review, push, open PRs, or merge.

## Open Questions Recorded Without Follow-Up

- Exact counting boundary: whether pages 198-200 closing/signage illustrations are part of "all signs" or should be treated as contextual closing source visuals rather than individual sign catalog entries.
- Source-choice boundary: whether implementation may rely on existing retained Anexo L assets for higher-quality official sign crops where the CABA Appendix IV PDF sheet is low-resolution, or must derive every individual crop directly from the GCBA manual PDF. This should be resolved by Architect with source-faithfulness evidence requirements.
- Caption granularity: whether each item needs only the source label plus Russian translation, or also a short explanatory learner note. The request explicitly asks for captions, so extra explanations should be conservative.
- How to handle items whose visible Spanish is inside the official sign face rather than an external catalog label. Assumption: repeat that Spanish as text caption only if it is the item's official label; never alter the image.

## Risks

- Completeness risk: Appendix IV has many signs and sign-like entries; missing even one item would violate the user's core requirement.
- Source-order risk: regrouping signs by learner theme could accidentally change source order. Any alternate grouping must preserve or explicitly expose the original ordering.
- Protected-image risk: automated cleanup, OCR replacement, vectorization, translated overlays, or cropping that cuts off plates/tablets could modify or omit protected sign content.
- Quality risk: whole-sheet crops and small source-limited rasters may remain unreadable on mobile or desktop if individual assets are not extracted/exported at sufficient resolution and displayed without browser upscaling.
- Evidence risk: the feature needs objective evidence for all signs, not only screenshots of representative examples.
- Layout risk: a large number of individual sign entries can become hard to scan; the UI must stay usable while preserving order and captions.
- Validation risk: existing manual validators may allow whole-sheet crops; this request may require stricter inventory/completeness checks or evidence files so future regressions fail.

## Acceptance Expectations

The feature should be considered successful only when all of the following are true:

1. Every sign/sign-like catalog item in the agreed affected manual sign pages is represented as an individual learner-facing entry, not only as part of a whole sheet or broad panel.
2. The entries preserve the official source order across pages and within pages/groups.
3. Each entry includes an original-image crop or source-faithful original visual at the highest practical quality, with no generated/redrawn/reconstructed replacement.
4. Each entry includes nearby selectable caption text with the original Spanish label and Russian translation. Example expectation: `NO AVANZAR` with `Проезд запрещен`.
5. The image pixels of each sign, including sign faces, pictograms, embedded text, arrows, borders, colors, supplementary plates/tablets, and official sign/caption pixels included in the crop, remain unchanged original source imagery.
6. Russian translations and explanations are outside protected images and do not cover, mask, clean, replace, or relabel image content.
7. The final UI remains local-first/offline-capable and uses bundled local assets only.
8. Desktop and mobile views let the learner inspect signs without tiny unreadable islands, clipped captions, layout overlap, document-level horizontal overflow, or browser upscaling beyond natural asset dimensions.
9. Evidence records the inventory/count of all covered signs, source page/region or source asset for each entry, output dimensions, hashes where practical, extraction/export method, display-size/no-upscale proof, and a protected-image preservation check.
10. Validation or test coverage catches missing entries, stale assets, order changes, forbidden image modification patterns, and caption/translation omissions where feasible.
11. Local preflight/build/test evidence is recorded according to the repository workflow before PR completion.
12. Orchestrator completes the PR workflow through review, required checks, final Architect validation, final Analyst validation when invoked, merge readiness gates, and merge unless a narrow documented blocker exists.

## Negative Scenarios

- A page-level sheet or broad panel remains the only representation for a group of signs.
- Only `NO AVANZAR` or a small sample of signs is treated individually.
- Signs are reordered alphabetically, by Russian meaning, or by UI convenience instead of source order.
- A sign image is cleaned, translated, redrawn, vectorized, recolored, masked, cropped so tightly that official parts/plates are lost, or replaced with a generated approximation.
- Spanish text directly on a sign or its plate is removed or translated inside the image.
- Captions omit either the Spanish original label or the Russian translation.
- The final presentation depends on runtime PDF rendering, remote images, live AI, network fetches, or a backend service.

## Research And Sources

No external web research was used for this intake. Sources used were repository-local project memory, source manifests, and current manual section/source files listed above.

## Handoff Notes

- Analyst created this intake only and did not write code, tests, technical plans, implementation tasks, reviews, commits, pushes, PRs, or merge actions.
- Architect should decide the precise implementation boundary for "all signs" and specify an inventory/evidence model before Implementation Agent edits content/assets/UI.
- Implementation must treat the protected-pixel rule as a hard requirement, not a visual preference.
- The user's no-follow-up instruction means unresolved product details above should be handled through assumptions, Architect disposition, or blocker exceptions only if absolutely necessary.
