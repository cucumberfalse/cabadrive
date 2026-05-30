# Feature Request: Interactive Russian Manual Chapters 1 and 2

## Intake Metadata

- Feature ID: `030-manual-chapters-1-2`
- Intake role: Analyst
- Assigned worktree: `/Users/chap/devel/cabadrive-worktrees/030-manual-chapters-1-2`
- Assigned branch: `codex/030-manual-chapters-1-2`
- Verified base provided by Orchestrator: `origin/main` at `b82794b42c6661af8ff40e361a138e0ef074fc6c`
- Parallel-work warning: parallel work may exist; sibling worktrees, branches, commits, PRs, dirty diffs, and process memory must be preserved.
- Intake artifact scope: this Analyst intake creates only this `feature-request.md`; Architect-owned `spec.md`, `plan.md`, and `tasks.md` are intentionally not created by Analyst.
- Existing prefix check: the maximum existing numeric prefix under `specs/` was verified as `029`; `030-manual-chapters-1-2` was available.

## Original User Request

The original request was given in Russian:

> ты строго оркестратор
> продолжи руквоводство, главы 1 и 2
> следуй гайдлайнам и принципам, которые были использованы ранее
> каждую страницу мержи отдельным пр
> удели особое внимание инфографике и ее качеству

## Request Classification

This is a new repository-changing work cycle to continue the interactive Russian `Руководство` beyond the completed Introduction slice into Chapter 1 and Chapter 2 of the official GCBA 4-wheel manual.

The request should remain one coherent feature memory because the chapters share one source document, one established conversion contract, and one user intent: continue the same section-by-section Russian interactive manual conversion. Implementation must still be sliced into separate PRs so each source page/content page is delivered and merged independently.

## Source Material and Existing Context

- Canonical source PDF: `content/official-documents/originals/gcba-manual-vehiculo-4-ruedas-2023.pdf`.
- Canonical PDF SHA-256 inherited from prior manual work: `69c6e1c582db4f96337fc13db09fffab26f9ce6364279c6beb2abc21d9ad3e8e`.
- Existing manual manifests:
  - `content/manuals/gcba-manual-vehiculo-4-ruedas-2023/manual.ru.json`
  - `content/manuals/gcba-manual-vehiculo-4-ruedas-2023/layout.ru.json`
  - `content/manuals/gcba-manual-vehiculo-4-ruedas-2023/navigation.ru.json`
- Existing durable conversion guide: `docs_project/project/frontend/manual-conversion-guidelines.md`.
- Current user-facing destination is `Руководство`, not a duplicate `Руководство 4R` surface.
- Existing implemented `Руководство` content covers the Introduction children:
  - `#pandemia-vial`
  - `#intro-enfoque-etico`
  - `#intro-accidente-incidente`
  - `#intro-plan-seguridad-vial`
- `navigation.ru.json` currently maps the requested chapter range as:
  - `chapter-1-sustainable-mobility`, `Глава 1: К устойчивой мобильности`, source `Capitulo 1: Hacia una movilidad sustentable`, pages `21-42`.
  - `chapter-2-responsibility`, `Глава 2: Управление транспортным средством - акт ответственности`, source `Capitulo 2: Conducir un vehiculo - un acto de responsabilidad`, pages `43-56`.
- Chapter 1 child topics currently recorded in source-`Índice` navigation:
  - `ch1-cities-for-people`, `Города для людей`, page `22`.
  - `ch1-sustainable-mobility`, `Что такое устойчивая мобильность?`, page `23`.
  - `ch1-pedestrian-priority`, `Пешеходный приоритет`, pages `24-29`.
  - `ch1-bicycle`, `Велосипед`, pages `30-38`.
  - `ch1-public-transport-system`, `Система общественного транспорта`, pages `39-40`.
  - `ch1-shared-trip`, `Совместная поездка`, pages `41-42`.
- Chapter 2 child topics currently recorded in source-`Índice` navigation:
  - `ch2-legal-responsibility`, `Юридическая ответственность`, pages `44-45`.
  - `ch2-required-documents`, `Обязательные документы`, pages `46-50`.
  - `ch2-incident-obligations`, `Обязанности в случае дорожных инцидентов`, pages `51-55`.
  - `ch2-scoring`, `Система баллов Scoring`, page `56`.

## Prior Guidelines and Principles to Reuse

The work must follow the durable manual conversion guide and the accepted principles from features `027`, `028`, and especially `029`:

- The source PDF is a mockup/reference and official source of content, layout, artwork, visual hierarchy, proportions, and order. It must not be rendered as a runtime PDF viewer, PDF.js canvas, iframe/object/embed, full-page raster background, side-by-side Spanish preview, or image-only transcript.
- Routes and delivery boundaries come from source `Índice` hierarchy, then page/content-page implementation slices; raw page access is secondary metadata, not the primary UX model.
- The visible app destination remains `Руководство`, with full hierarchy navigation that can scale to the entire source manual.
- Russian prose, headings, lists, callouts, statistic labels, and meaningful infographic labels must be selectable/copyable DOM or SVG text.
- Russian text should be natural and simple for the learner, while preserving source order, named entities, numbers, years, definitions, obligations, conditions, lists, exceptions, safety principles, local legal terms, and ticket-relevant details.
- Normal prose must flow responsively and must not be forced into PDF-style manual line breaks; horizontal scrolling is allowed only for fixed infographic/image blocks when preserving source layout requires it.
- Source artwork, images, infographics, pictograms, diagrams, panel shapes, colors, spacing, borders, connector lines, proportions, and geometry must be preserved from the source. Generic icons, redesigned diagrams, approximate redraws, altered colors, cropped-away source components, blurred/stretched assets, and text-only substitutes fail acceptance.
- Russian labels may replace source text only through source-faithful local cleanup/inpainting and selectable text layers. Broad masks, square patches, color-matched plates, DOM backing rectangles, and visible cleanup artifacts are rejected.
- Vectorization is acceptable only when visually indistinguishable from the source and backed by comparison evidence.
- Reusable style tokens are required for recurring block types, including typography, colors, spacing, padding, borders/radii, alignment, image positioning, callouts, labels, and responsive behavior.
- Typography should start from source font diagnosis, but final web typography should prioritize readable Russian and local/offline runtime constraints. Remote fonts remain forbidden.
- Visible source/provenance clutter, page markers, footnotes, and book-only decoration should be omitted when not useful for exam learning, while internal traceability remains in data/tests/process memory.
- Every accepted visual issue found by user, reviewer, Orchestrator, browser QA, or Implementation Agent must become a reusable checklist item and validation expectation for later pages.

## Requested Outcome

Continue `Руководство` by converting Chapter 1 and Chapter 2 into native interactive Russian manual pages/sections that follow the previously accepted Introduction conversion model and durable manual conversion guidelines.

The converted result must feel like the same high-quality Russian interactive manual, not a return to the older page-layout reader or side-by-side PDF/translation model. Each source page/content page in the Chapter 1 and Chapter 2 scope must be delivered as its own implementation PR slice and merged separately, while the full cycle remains coordinated through this feature memory.

## Scope

- Convert Chapter 1 and Chapter 2 content from the official GCBA 4-wheel manual into `Руководство`.
- Preserve source-`Índice` hierarchy and existing navigation IDs/ranges unless Architect verifies a source-backed correction.
- Treat pages `21-56` as the initial expected implementation scope:
  - Chapter 1: pages `21-42`.
  - Chapter 2: pages `43-56`.
- Include chapter divider/title pages as source pages/content pages unless Architect explicitly records a source-backed reason to merge or handle them differently.
- Deliver each source page/content page as a separate implementation PR slice and merge each page PR separately.
- Keep one coherent feature memory for the Chapter 1 and Chapter 2 continuation unless Architect determines a split is necessary for an independent goal or process-risk reason.
- Use existing manual source manifests and local PDF renders as source/reference inputs, but produce native, learner-facing Russian HTML/CSS/SVG and local assets for the new `Руководство` pages.
- Preserve and improve source-faithful local artwork/crops for every visual block, with special attention to infographics, diagrams, pictograms, and source image quality.
- Keep Russian text selectable/copyable and accessible.
- Keep all content local-first/offline after build; no runtime backend, remote assets, runtime AI, runtime PDF rendering, or live network fetches.
- Update durable docs only if Architect determines implementation changes the manual conversion contract, style tokens, validation workflow, navigation behavior, or runtime expectations.

## Out of Scope for This Intake

- Analyst does not choose the technical architecture, page implementation order, exact component/data structure, crop extraction method, visual checker thresholds, or PR numbering plan.
- Analyst does not implement Chapter 1 or Chapter 2 pages.
- Analyst does not create `spec.md`, `plan.md`, `tasks.md`, code, tests, assets, durable docs, commits, pushes, reviews, PRs, or merge actions.
- This intake does not request converting Chapters 3-5, appendices, unrelated manual sections, practice questions, official-source reader content, or exam-mode behavior.
- This intake does not make the current fallback practice-question bank official or complete.

## PR Slicing Expectation

The user's instruction `каждую страницу мержи отдельным пр` is a binding delivery constraint for implementation planning:

- Orchestrator should assign one isolated worktree/branch/PR slice per source page/content page.
- Each page PR must carry that page's source-span evidence, Russian content, assets/crops, style-token reuse or additions, tests/checker evidence, process-memory updates, and merge-readiness evidence.
- A page PR must not silently bundle unrelated pages. If a source `Índice` topic spans multiple pages, each page still needs its own PR slice unless Architect records an explicit source-backed exception and Orchestrator accepts it.
- Chapter-level navigation may require shared setup before or across page slices; Architect should decide whether that setup is its own prerequisite PR or belongs to the first page PR. Any shared setup must preserve the separate-per-page merge rule for content pages.
- Final validation must cover the full cycle PR set for all Chapter 1 and Chapter 2 page slices that contribute to this feature.

## Acceptance Expectations

- `Руководство` exposes Chapter 1 and Chapter 2 entries within the full source-`Índice` hierarchy, with implemented pages replacing pending placeholders as their page PRs merge.
- Each converted source page/content page in pages `21-56` has its own implementation PR slice and merge evidence.
- Chapter and topic navigation remains source-derived, accessible, keyboard/touch usable, and compatible with existing Introduction hashes/routes.
- Russian text is selectable/copyable DOM or SVG text, including headings, body text, lists, callouts, captions, labels, and meaningful infographic/statistic text.
- Russian wording is clear, natural, and learner-facing while preserving source meaning, source order, numbers, legal/document terms, obligations, exceptions, lists, and ticket-relevant details.
- All source images, diagrams, pictograms, infographics, callout visuals, tables, icons, and layout relationships are preserved with local source-faithful assets/crops or visually indistinguishable reconstruction.
- Infographics receive explicit high-quality validation: source-region/crop metadata, no visible Spanish text, no generic replacements, no distorted reassembly, no broad masks or backing plates, no clipped/cropped pictograms, no misaligned labels/connectors, no unreadable scaling, and screenshot/bounding-box comparison evidence.
- Recurring styles reuse the accepted Introduction article shell/style tokens where appropriate and add only source-backed variants with documented tokens and validation.
- Normal prose has no horizontal clipping or forced PDF line breaks across desktop, narrow, and mobile viewports.
- Fixed infographic/image blocks may use contained horizontal scrolling only when needed for source fidelity; ordinary prose must remain outside those scrollers.
- No runtime PDF viewer, PDF.js rendering, iframe/object/embed PDF display, full-page raster/page-image transcript, remote image, runtime fetch, backend endpoint, analytics call, live AI call, or remote font dependency is introduced.
- Local verification evidence covers content tests, visual/source-fidelity checker output, Playwright screenshots/assertions for desktop and mobile, TypeScript/build/preflight as required by Architect, and page-specific checks before each PR is considered merge-ready.
- Process memory records decisions, dead ends, known issues, page-level evidence, Implementation Agent feedback, Architect dispositions, final Architect validation, and final Analyst validation before completion.

## Negative Scenarios

- Converting Chapters 1 and 2 in one large PR or bundling multiple source pages into a single content PR without an explicit Architect/Orchestrator exception.
- Returning to the old `Руководство 4R` page-layout reader, side-by-side Spanish page plus Russian transcript, or source PDF/page screenshot as the primary experience.
- Rendering a runtime PDF viewer, full-page raster, or image-only Russian page and calling it interactive.
- Flattening Russian text into images so it cannot be selected/copied.
- Treating source `Índice` navigation as optional or replacing it with raw page-number-only navigation.
- Replacing source pictograms, infographics, diagrams, or images with generic icon sets, redesigned SVGs, approximate cards, recolored artwork, cropped fragments, or text-only substitutes.
- Leaving Spanish source text visible inside learner-facing diagrams or using broad masks/plates that visibly alter source artwork.
- Sacrificing infographic quality to pass only structural tests: distorted source pieces, broken seams, clipped icons, bad label alignment, unreadable text, or missing source components remain blockers.
- Removing, simplifying away, or editorially rewriting ticket-relevant details, legal terms, numbers, document names, restrictions, exceptions, obligations, or ordered lists.
- Adding remote fonts/assets, runtime network calls, runtime AI, backend dependencies, analytics, or unrelated product behavior.

## Assumptions

- `главы 1 и 2` means the source manual's Chapter 1 and Chapter 2 as currently mapped in `navigation.ru.json`: pages `21-42` and `43-56`, inclusive.
- `каждую страницу` means each source page/content page in that range should be an independent implementation PR slice and merged separately.
- Chapter divider/title pages (`21` and `43`) are included in the per-page delivery model unless Architect records a better source-backed treatment.
- Existing `manual.ru.json`, `layout.ru.json`, `navigation.ru.json`, and local page renders are source/reference inputs, but they are not by themselves the final interactive `Руководство` page implementation.
- Existing Introduction style and conversion contracts are the baseline. New chapter pages should not invent a separate visual language unless the source page requires a documented variant.
- Some Chapter 1 and Chapter 2 pages may be mostly prose, but every page still needs visual inspection because source sidebars, diagrams, callouts, legal/document lists, images, or layout-sensitive blocks may require page-specific treatment.
- No blocking user clarification is required for intake; Architect can record any implementation-time source-boundary exceptions or PR-slicing refinements for Orchestrator disposition.

## Risks

- The requested per-page PR model creates many small PRs and requires careful Orchestrator tracking of the cycle PR set, dependencies, shared setup, and final validation.
- Shared navigation/style/data setup may be needed before individual page PRs can remain small and mergeable.
- Chapter 1 contains many mobility and infrastructure visuals where low-quality crops, generic replacements, or distorted reconstructions would violate the accepted Introduction standard.
- Chapter 2 contains legal/document/incident-obligation details where over-simplification or mistranslation could change exam-critical meaning.
- Russian text length may pressure source-like layouts, especially in labels, callouts, tables, and infographics.
- Infographic/artwork cleanup can accidentally leave Spanish residue, create visible patches, damage source connectors/edges, or make labels unselectable.
- Repeated per-page merges may make final validation stale if later shared changes alter previously validated pages.
- Existing page-layout manifests may tempt implementation to reuse full-page raster/mask patterns that are explicitly not acceptable for the interactive `Руководство` continuation.

## Open Questions

- No blocking user clarification is required for intake.
- Architect should decide the exact page-slice order and whether any shared prerequisite PR is required before the first page/content PR.
- Architect should define page-level acceptance gates and visual-checker thresholds for Chapter 1 and Chapter 2, using the durable manual conversion guide as the minimum bar.
- Architect should decide how to record and validate page-specific source spans, source crops, style tokens, and screenshot evidence so every separate page PR remains independently reviewable.
- Architect should define how final validation will handle the large page-slice PR set and any evidence-only validation commits.

## Analyst Handoff

This intake is ready for Orchestrator handoff to Architect. The request is to continue the existing interactive Russian `Руководство` into Chapter 1 and Chapter 2, preserving the prior conversion principles and durable guidelines, delivering each source page/content page as a separate PR and merge, and treating infographic/source-artwork quality as a central acceptance gate rather than a cosmetic follow-up.

## Final Analyst Validation Notes - Shared Prerequisite PR #174

Analyst validation pass: passed

Final Analyst validation completed at: 2026-05-29T20:31:34Z

Analyst validated effective content head: 88cb0b4e91993c27b363f19f34926d25e94b67a4

Analyst return count for this work cycle: 0

Validation scope: shared-prerequisite PR #174 only. This validation does not claim full feature completion and does not validate pages `021-056` as implemented learner content.

Customer intent check: passed for the shared-prerequisite slice. The original customer intent is to continue `Руководство` into Chapters 1 and 2 using the prior manual-conversion guidelines, one source page per separate PR, with special attention to infographic/artwork quality. PR #174 supports that intent as a necessary prerequisite: it establishes the Chapter 1/2 pending hierarchy inside `Руководство`, shared route/schema/checker/style infrastructure, forbidden-pattern and pending-page validation, and cycle PR-set tracking while intentionally adding no converted Chapter 1/2 page content. The requested pages `021-056` remain pending and must still be implemented and merged one source page per PR before full feature completion can pass.

Gaps, if any: none for shared-prerequisite acceptance. Full user-request completion remains pending because pages `021-056` are not yet converted; this is expected and explicitly outside this intermediate validation scope.

Architect disposition routing: no customer-intent gaps require Architect disposition for PR #174. Architect final validation for this same effective content head passed at `2026-05-29T20:28:37Z`; Architect-owned process memory records unresolved page/content work as future page PRs and records no unresolved Implementation Agent feedback for the shared-prerequisite slice.

Analyst limit escalation: none / not applicable.

Analyst boundary reminder: this validation edits only this Analyst-owned notes section in `specs/030-manual-chapters-1-2/feature-request.md`; no code, tests, assets, runtime files, Architect artifacts, staging, commits, pushes, reviews, PR state, merges, or sibling work were changed.

## Final Analyst Validation Notes - Shared Prerequisite PR #174 Rerun

Analyst validation pass: passed

Final Analyst validation completed at: 2026-05-29T21:19:48Z

Analyst validated effective content head: 95222394f2dbad940223d0d2a38163128c9c36f7

Analyst return count for this work cycle: 0

Superseded validation note: the prior shared-prerequisite Analyst validation for `88cb0b4e91993c27b363f19f34926d25e94b67a4` is stale and superseded by this rerun because non-evidence code/test fixes landed afterward.

Validation scope: shared-prerequisite PR #174 only. This validation does not claim full feature completion and does not validate pages `021-056` as implemented learner content.

Customer intent check: passed for the current shared-prerequisite slice. The original customer intent remains to continue `Руководство` into Chapters 1 and 2, follow the prior manual-conversion guidelines, merge each source page as a separate PR, and treat infographic/artwork quality as a first-class gate. Current head `95222394f2dbad940223d0d2a38163128c9c36f7` supports that intent as prerequisite infrastructure: it keeps Chapter 1/2 content pages pending, provides the route/schema/checker/style/pending-registry foundation, strengthens future implemented-page validation, and records process evidence needed before the separate page PRs begin. The requested pages `021-056` remain pending by design and must still be implemented and merged one source page per PR before full feature completion can pass.

Gaps, if any: none for shared-prerequisite acceptance. Full user-request completion remains pending because pages `021-056` are not yet converted; this is expected and explicitly outside this intermediate validation scope.

Architect disposition routing: no customer-intent gaps require Architect disposition for PR #174. Architect rerun passed at `2026-05-29T21:16:33Z` for the same effective content head `95222394f2dbad940223d0d2a38163128c9c36f7`; Architect-owned process memory records the current AI Review P1 `3326928165` as a rerun-validation evidence request, no unresolved Implementation Agent feedback for the shared-prereq slice, and page `021-056` work as future page PRs.

Analyst limit escalation: none / not applicable.

Analyst boundary reminder: this rerun edits only this Analyst-owned notes section in `specs/030-manual-chapters-1-2/feature-request.md`; no code, tests, assets, runtime files, Architect artifacts, staging, commits, pushes, reviews, PR state, merges, or sibling work were changed.

## Final Analyst Validation Notes

Analyst validation pass: passed

Final Analyst validation completed at: 2026-05-29T21:59:18Z

Analyst validated effective content head: 20a04b05d4db29830d645419c90ce09d4f710988

Analyst return count for this work cycle: 0

Customer intent check: passed for shared-prerequisite PR #174 only. The slice supports the user's request to continue `Руководство` into Chapters 1 and 2 by providing the route/schema/checker/style/page-registry foundation, preserving the earlier manual-conversion principles, keeping one-source-page-per-PR delivery as the required next step, and making infographic/artwork quality a first-class gate. Pages 021-056 remain future page PRs and are not approved here as implemented content.

Gaps, if any: none for shared-prerequisite PR #174. Full feature completion still requires pages 021-056 to be implemented and merged one source page per PR.

Architect disposition routing: no customer-intent gaps require Architect disposition. Architect validation passed at 2026-05-29T21:56:39Z for effective content head 20a04b05d4db29830d645419c90ce09d4f710988, with page work carried forward as future page PRs.

Analyst limit escalation: none

Analyst boundary reminder: no code, plan, task, commit, push, PR, or merge actions were performed by Analyst.

## Final Analyst Validation Notes

Analyst validation pass: passed

Final Analyst validation completed at: 2026-05-29T22:07:21Z

Analyst validated effective content head: 969b9875c36c3671cef96bb7f62bd3051b09acdf

Analyst return count for this work cycle: 0

Customer intent check: passed for shared-prerequisite PR #174 only. The slice supports the user's request to continue `Руководство` into Chapters 1 and 2 by providing the route/schema/checker/style/page-registry foundation, preserving prior manual-conversion principles, keeping one-source-page-per-PR delivery as the required next step, and making infographic/artwork quality a first-class gate. Pages 021-056 remain future page PRs and are not approved here as implemented content.

Gaps, if any: none for shared-prerequisite PR #174. Full feature completion still requires pages 021-056 to be implemented and merged one source page per PR.

Architect disposition routing: no customer-intent gaps require Architect disposition. Architect validation passed at 2026-05-29T22:04:42Z for effective content head 969b9875c36c3671cef96bb7f62bd3051b09acdf, with page work carried forward as future page PRs.

Analyst limit escalation: none

Analyst boundary reminder: no code, plan, task, commit, push, PR, or merge actions were performed by Analyst.

## Final Analyst Validation Notes

Analyst validation pass: passed

Final Analyst validation completed at: 2026-05-29T22:28:18Z

Analyst validated effective content head: 28436a7f0c4d9e1841eb674d5ea52b71b68808c8

Analyst return count for this work cycle: 0

Customer intent check: passed for shared-prerequisite PR #174 only. The slice supports the user's request to continue `Руководство` into Chapters 1 and 2 by providing the route/schema/checker/style/page-registry foundation, preserving prior manual-conversion principles, keeping one-source-page-per-PR delivery as the required next step, and making infographic/artwork quality a first-class gate. The added Spanish-visibility and forbidden-asset guards strengthen the quality bar for future page PRs. Pages 021-056 remain future page PRs and are not approved here as implemented content.

Gaps, if any: none for shared-prerequisite PR #174. Full feature completion still requires pages 021-056 to be implemented and merged one source page per PR.

Architect disposition routing: no customer-intent gaps require Architect disposition. Architect validation passed at 2026-05-29T22:25:33Z for effective content head 28436a7f0c4d9e1841eb674d5ea52b71b68808c8, with page work carried forward as future page PRs.

Analyst limit escalation: none

Analyst boundary reminder: no code, plan, task, commit, push, PR, or merge actions were performed by Analyst.

## Final Analyst Validation Notes

Analyst validation pass: passed

Final Analyst validation completed at: 2026-05-30T01:08:08Z

Analyst validated effective content head: 66eb91ce6301ec014cc93702daae6a6208448018

Analyst return count for this work cycle: 0

Scope note: validates PR #175/page-021 only; pages 022-056/full feature remain pending.

Customer intent check: passed for PR #175/page-021 only. The slice advances the user's request to continue `Руководство` into Chapters 1 and 2 by implementing exactly the Chapter 1 divider page as a native/selectable Russian manual page, preserving the prior conversion principles, keeping one-source-page-per-PR delivery intact, and treating visual quality as a merge gate through source crop, cleaned text-free panel, desktop/mobile screenshots, and source-fidelity checker evidence.

Gaps, if any: none for PR #175/page-021. Full feature completion still requires pages 022-056 to be implemented and merged one source page per PR.

Architect disposition routing: no customer-intent gaps require Architect disposition. Architect validation passed at 2026-05-30T00:45:21Z for effective content head 66eb91ce6301ec014cc93702daae6a6208448018, with pages 022-056 carried forward as future page PRs and no open Architect dispositions for page-021.

Analyst limit escalation: none

Analyst boundary reminder: no code, plan, task, commit, push, PR, or merge actions were performed by Analyst.

## Final Analyst Validation Notes

Analyst validation pass: passed

Final Analyst validation completed at: 2026-05-30T01:23:23Z

Analyst validated effective content head: 997f76485ef0e5c313350b70d1562e5d04670dca

Analyst return count: 0

Customer intent check: passed for PR #175/page-021 only. The slice advances the user's request to continue `Руководство` into Chapters 1 and 2 by implementing exactly the Chapter 1 divider page as a native/selectable Russian manual page, preserving prior manual-conversion principles, keeping one-source-page-per-PR delivery intact, and treating visual quality as a merge gate through source crop, cleaned text-free panel, desktop/mobile screenshots, and source-fidelity checker evidence. Pages 022-056 and full feature completion remain future page PR work.

Gaps, if any: none for PR #175/page-021. Pages 022-056 still require separate implementation and merge before full feature completion.

Architect disposition routing: no customer-intent gaps require Architect disposition. Architect validation passed for effective content head 997f76485ef0e5c313350b70d1562e5d04670dca, and Architect-owned process memory records no open dispositions for PR #175/page-021.

Analyst limit escalation: none

Analyst boundary reminder: no code, plan, task, commit, push, PR, or merge actions were performed by Analyst.
