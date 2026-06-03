# Feature Request: Complete The Interactive Russian Manual

## Intake Metadata

- Feature ID: `031-manual-document-completion`
- Intake role: Analyst
- Assigned worktree: `/Users/chap/devel/cabadrive-worktrees/031-manual-document-completion`
- Assigned branch: `codex/031-manual-document-completion`
- Verified base provided by Orchestrator: `origin/main` at `b07d5c72bf1689e7dac480e937c366a528d20299`
- Local head observed during intake: `b07d5c72bf1689e7dac480e937c366a528d20299`
- Parallel-work warning: parallel work may exist; sibling worktrees, branches, commits, PRs, dirty diffs, and process memory must be preserved. Do not touch `/Users/chap/devel/cabadrive` root untracked `tmp_repair_page18_center.swift` or any sibling worktree.
- Intake artifact scope: this Analyst intake creates only this `feature-request.md`; Architect-owned `spec.md`, `plan.md`, and `tasks.md` are intentionally not created by Analyst.
- Existing prefix check: the maximum existing numeric prefix under `specs/` was verified as `030`; `031-manual-document-completion` was available.

## Original User Request

The original request was given in Russian:

> ты строго оркестратор
> продолжай до полного завершения документа, одна глава - один пр
> подвечу требования, которые уже были озвучены ранее
> 1. избражения брать в высоком разрешении (делай экспорт с зумом х5)
> 2. нельзя изменять фотографии, изображегния дорожных знаков, разметки - вообще никак, в том числе переводить
> 3. При переносе инфографики не рисовать ее, а переносить как изображенияе в выском качестве. После убрать испанский текст (только буквы, заменить кажду букву цветом фона, не большим квадратом, а кажду букву отдельно, восстановив фон). После наложить русский текст.

Normalized intake reading:

- Continue the interactive Russian `Руководство` until the full manual/document is complete.
- From this point forward, one implementation PR means one source manual chapter.
- Preserve and strengthen the visual-quality rules already discussed earlier.
- Use high-resolution visual extraction/export for images, targeting x5 zoom/source export for new section/visual assets.
- Do not modify photos, traffic-sign images, or road-marking images in any way, including translation, relabeling, redraw, recolor, cleanup, reconstruction, or other visual edits.
- Infographics must be transferred as high-quality source images, not redrawn. Spanish text inside infographics may be removed only at glyph/letter level by restoring each letter area with background pixels/colors, not by using broad boxes, plates, or large patches. Russian text is then overlaid, preferably as selectable DOM/SVG text where feasible without modifying the source image.

## Request Classification

This is a new repository-changing work cycle to complete the existing native Russian interactive manual surface. It expands beyond feature `030`, which covered Chapters 1 and 2 only, into the rest of the manual/document and records stricter visual rules that must govern all future manual conversion and any needed correction PRs.

The request should remain one coherent feature memory because it has one user goal: finish the full official GCBA 4-wheel manual conversion in `Руководство` with consistent source-faithful visual handling. Implementation must still be sliced into separate PRs by source manual chapter or chapter-equivalent unit.

## Project Context

- Cabadrive is a local-first React/TypeScript/Vite web trainer for Russian-speaking drivers preparing for the CABA theory exam.
- There is no runtime backend. Manual content and assets must remain local/offline after build.
- The user-facing manual destination is `Руководство`, a native interactive Russian web document surface organized by the official source `Índice`.
- The PDF is a source/reference/mockup only. The runtime surface must not be a PDF viewer, PDF.js render, iframe/object/embed, full-page raster background, image-only page, side-by-side Spanish screenshot plus transcript, remote image, runtime fetch, backend endpoint, or live AI output.
- Durable conversion rules already live in `docs_project/project/frontend/manual-conversion-guidelines.md` and remain the baseline unless Architect updates them through role-appropriate work.
- The existing implementation and validators already distinguish the interactive `Руководство` conversion from the older manifest/page-layout manual reader.

## Prior Feature 030 State

Feature `030-manual-chapters-1-2` is the immediate predecessor for this request.

Current state provided by Orchestrator and checked against feature memory:

- Existing feature `030` covered Chapters 1 and 2 only.
- PR #184, `[codex] Complete Chapter 1 manual guide`, is merged into `main` at merge commit `b07d5c72bf1689e7dac480e937c366a528d20299`.
- There are no open PRs right now.
- Feature `030` corrected the delivery model to one PR per source manual chapter for Chapter 1/2.
- Chapter 1 pages `21-42` are now merged.
- Chapter 2 pages `43-56` were planned as a future chapter-level PR and remain pending for the broader completion work.
- Feature `030` process memory already records that source PDF pages are source/crop/QA metadata, not user-facing route boundaries, and that divider-only pages such as `21` and `43` are skipped as standalone site pages.
- The stricter visual rules in the current request may require future correction PRs for already merged sections if their infographic, sign, photo, or road-marking handling used redraw/reconstruction or insufficient source-image transfer.

## Manual Coverage Context

The manual navigation currently contains:

| Manual unit | Source pages | Current intake disposition |
| --- | ---: | --- |
| Front matter | `1-13` | Existing navigation unit; completion handling needs Architect disposition because it is not a chapter. |
| Introduction | `14-20` | Already implemented. |
| Chapter 1 | `21-42` | Already merged through PR #184. |
| Chapter 2 | `43-56` | Pending; expected next chapter-level PR. |
| Chapter 3 | `57-88` | Pending; expected chapter-level PR. |
| Chapter 4 | `89-97` | Pending; expected chapter-level PR. |
| Chapter 5 | `98-103` | Pending; expected chapter-level PR. |
| Appendix I | `104-122` | Pending; assumed chapter-equivalent PR unit unless Architect records a different source-backed disposition. |
| Appendix II | `123-151` | Pending; assumed chapter-equivalent PR unit unless Architect records a different source-backed disposition. |
| Appendix III | `152-183` | Pending; assumed chapter-equivalent PR unit unless Architect records a different source-backed disposition. |
| Appendix IV | `184-200` | Pending; assumed chapter-equivalent PR unit unless Architect records a different source-backed disposition. |

## Requested Outcome

Complete the full interactive Russian `Руководство` document after the already merged Introduction and Chapter 1 work, using one PR per source manual chapter from this point forward. The final result should feel like one coherent high-quality Russian interactive manual, not a collection of PDF page screenshots, approximate redraws, or text-only summaries.

Each remaining chapter or chapter-equivalent unit must preserve source structure, source order, learner-relevant details, and visual fidelity while rendering Russian learning text as native selectable DOM/SVG text where feasible.

## Scope

In scope:

- Continue manual conversion from the current merged state through full document completion.
- Implement Chapter 2, Chapter 3, Chapter 4, Chapter 5, and the appendices as separate chapter-level or chapter-equivalent PR slices.
- Decide the front-matter handling in architecture: omit as book-only/source clutter, implement as one chapter-equivalent PR, or record another explicit source-backed disposition.
- Preserve existing Introduction routes and merged Chapter 1 behavior unless a correction PR is required by the stricter visual rules.
- Keep `Руководство` as the single user-facing manual destination.
- Use the official source PDF, existing manual manifests, local page renders, and prior conversion artifacts as source/reference inputs only.
- Produce native learner-facing Russian HTML/CSS/SVG/local assets with local source-faithful images/crops.
- Update durable docs only if implementation changes the manual conversion contract, visual rules, validation workflow, style tokens, routing, or runtime expectations.
- Record correction needs for already merged Introduction or Chapter 1 sections if they violate the stricter source-image, sign, road-marking, photo, or infographic rules.

Out of scope for Analyst intake:

- Analyst does not design the technical architecture, exact chapter order, component/data structure, crop tooling, checker thresholds, or PR sequencing beyond recording the user's chapter-level rule.
- Analyst does not implement pages, chapters, assets, tests, visual checkers, durable docs, commits, pushes, PRs, reviews, or merges.
- This intake does not change practice questions, exam mode, the official-source reader, backend policy, Docker runtime contract, or content availability mode.

## Controlling Visual Requirements

The following requirements are explicit user requirements and should be treated as controlling for future manual work:

1. Image extraction/export must use high resolution for new section/visual assets. Target x5 zoom/source export when extracting from the source PDF or other source render, unless Architect records a source-backed equivalent or better method.
2. Photos, road-sign images, and road-marking images must remain unmodified source-as-is. They must not be translated, relabeled, redrawn, recolored, cleaned, reconstructed, simplified, retouched, masked, inpainted, cropped in a way that removes meaningful content, or otherwise altered. Russian explanation may be provided outside the image.
3. Infographics must be transferred as high-quality source images, not redrawn or reconstructed as approximate SVG/CSS diagrams. Spanish text inside an infographic may be removed only at glyph/letter level: each letter area is individually restored with surrounding background pixels/colors. Broad boxes, color plates, opaque rectangles, DOM label backgrounds, large square patches, or other visible coverage artifacts are forbidden. Russian text is overlaid afterward, preferably as selectable DOM/SVG text where feasible without modifying the source image.

These stricter rules apply to future chapters and to any correction PRs for already merged manual sections. They do not weaken existing rules against runtime PDF viewers, full-page raster pages, generic icon substitution, visible Spanish residue outside allowed source-as-is images, or unselectable Russian learning text.

## PR Slicing Expectation

The user's instruction `одна глава - один пр` supersedes any older page-per-PR or section-per-PR interpretations for work from this point forward.

- One PR means one source manual chapter.
- Chapter 2 is expected to be one PR.
- Chapter 3 is expected to be one PR.
- Chapter 4 is expected to be one PR.
- Chapter 5 is expected to be one PR.
- Appendices are assumed to be chapter-equivalent PR units: Appendix I, Appendix II, Appendix III, and Appendix IV each get one PR unless Architect records a different disposition and Orchestrator accepts it.
- Front matter is not a normal chapter; Architect should decide whether it is omitted as book-only material, implemented as one chapter-equivalent PR, or handled by another explicit disposition.
- A chapter PR may include multiple website section pages within that chapter, but must not bundle separate source chapters together.
- Shared prerequisite or correction PRs are allowed only when Architect/Orchestrator determine they are needed for shared infrastructure, durable visual-rule updates, or correction work; they should not silently bundle unrelated chapter content.
- Already merged sections that need visual-rule corrections should be handled by separate correction PRs scoped to the affected section/chapter, not opportunistically mixed into unrelated future chapter PRs unless Architect records a clear dependency and Orchestrator assigns that scope.

## Acceptance Expectations

- `Руководство` eventually exposes the full manual/document in the source-derived hierarchy, with all implemented content available locally/offline after build.
- Remaining chapters and chapter-equivalent units are implemented through separate PRs according to the one-source-chapter-one-PR rule.
- Chapter 2 is implemented as the next pending chapter-level unit unless Orchestrator/Architect record a different safe order.
- Appendices are treated as chapter-equivalent PR units by default until Architect records a better source-backed plan.
- Front matter receives explicit Architect disposition rather than being silently ignored or accidentally implemented as unrelated content.
- Existing Introduction and Chapter 1 content remains stable unless correction PRs are needed for stricter visual-rule compliance.
- Russian headings, body text, lists, callouts, captions, labels, and meaningful infographic labels are selectable/copyable DOM or SVG text where feasible.
- Russian wording is natural and learner-facing while preserving source order, numbers, named entities, legal terms, obligations, conditions, exceptions, lists, safety principles, and ticket-relevant details.
- High-resolution source images/crops are used for all visual assets, with x5 export/source zoom target or documented equivalent evidence.
- Photos, road-sign images, and road-marking images remain source-as-is and unmodified, including no translation or cleanup.
- Infographics are high-quality source-image transfers, not approximate redraws. Spanish text cleanup is glyph/letter-level only, with Russian text overlaid afterward and no broad masks/plates/patches.
- Visual evidence records source regions, crop/export method, dimensions/hash where practical, cleanup scope, visible-Spanish status or explicit source-as-is exception, screenshots, and checker pass/fail output.
- Normal prose remains responsive across desktop and mobile; fixed visual blocks may use horizontal scrolling only when source fidelity requires it.
- No runtime PDF viewer, PDF.js rendering, iframe/object/embed PDF display, full-page raster/page-image transcript, remote image, runtime fetch, backend endpoint, analytics call, live AI call, or remote font dependency is introduced.
- Process memory records decisions, dead ends, known issues, per-chapter evidence, Implementation Agent feedback, Architect dispositions, final Architect validation, and final Analyst validation before completion.

## Negative Scenarios

- Completing the remaining manual in one giant PR.
- Returning to page-per-PR or section-per-PR slicing after the user explicitly requested one chapter per PR.
- Bundling Chapter 2 with Chapter 3, or any other separate source chapters, in one content PR.
- Silently omitting appendices or front matter without Architect disposition.
- Treating source PDF page numbers as user-facing route boundaries or PR boundaries.
- Rendering the manual as a runtime PDF viewer, full-page raster, side-by-side Spanish/Russian page, or image-only Russian document.
- Flattening Russian learning text into images when DOM/SVG selectable text is feasible.
- Modifying photos, road-sign images, or road-marking images in any way, including translation, relabeling, redraw, recolor, cleanup, reconstruction, or retouching.
- Redrawing infographics or rebuilding them from approximate CSS/SVG/icon components instead of transferring high-quality source images.
- Removing Spanish infographic text with broad masks, boxes, plates, large patches, or visible cleanup artifacts.
- Leaving Spanish text visible inside non-exempt learner-facing infographic artwork after cleanup.
- Replacing source pictograms, diagrams, photos, signs, road markings, or infographics with generic icon sets, redesigned visuals, cropped fragments, low-resolution exports, or text-only substitutes.
- Removing ticket-critical legal, numeric, safety, document, restriction, exception, or ordered-list details without Architect disposition.
- Adding remote assets/fonts, runtime network calls, backend behavior, analytics, live AI, or unrelated product behavior.

## Assumptions

- The current request starts from merged `main` at `b07d5c72bf1689e7dac480e937c366a528d20299`, where Introduction and Chapter 1 are already implemented and Chapter 2 remains pending.
- `полного завершения документа` means completing all remaining substantive units in the current manual navigation, including Chapters 2-5 and Appendices I-IV.
- `одна глава - один пр` means source manual chapter-level PR slicing from this point forward.
- Appendices are chapter-equivalent PR units for slicing purposes unless Architect records a source-backed reason to split or combine them.
- Front matter pages `1-13` may include book-only or source-index material that is not necessarily useful as learner content; it still needs explicit Architect disposition so full-document completion is auditable.
- High-resolution x5 export is a target requirement for newly extracted visual assets; if implementation uses another method, it must provide evidence that the result is equivalent or better.
- Correction PRs may be required for already merged Introduction or Chapter 1 sections if they used redraw/reconstruction, translated signs, altered markings/photos, or non-glyph-level infographic cleanup.
- No blocking user clarification is required for intake; Architect can record assumptions, dispositions, or follow-up questions if a later source-boundary decision cannot be made safely.

## Risks

- The full manual is large; one chapter per PR is less granular than one section per PR and requires strong per-section evidence inside each chapter PR.
- Appendices, especially sign-heavy Appendix IV, may be visually dense and may need special source-as-is evidence for signs, markings, and official diagrams.
- The stricter infographic rule may invalidate earlier accepted reconstructed visuals and require correction work before final full-document completion.
- High-resolution x5 export may require updates to extraction tooling, asset conventions, validation metadata, or visual checker thresholds.
- Glyph/letter-level Spanish cleanup is painstaking and can still leave artifacts, damage connector lines, or reduce source fidelity if not verified carefully.
- Russian text length may pressure source layouts, especially labels, tables, diagrams, and infographics.
- Legal/document/scoring sections and appendices may contain exam-critical details where simplification or omission would change meaning.
- Repeated chapter PRs and possible correction PRs increase final-validation complexity and require precise cycle PR-set tracking.

## Open Questions

- Should front matter pages `1-13` be implemented in `Руководство`, omitted as book-only/source/navigation material, or handled as a single chapter-equivalent PR?
- Should appendices always remain one PR each, or should Architect allow a documented exception for unusually large/sign-heavy appendix work while preserving the user's chapter-level intent?
- Which already merged Introduction or Chapter 1 visuals, if any, require correction under the stricter no-modification and no-redraw rules?
- What exact validation evidence should prove x5/high-resolution extraction and glyph-level infographic cleanup for each future PR?
- Should durable `manual-conversion-guidelines.md` be updated before implementation so the stricter visual rules become repository-wide conversion policy?

## Analyst Handoff

This intake is ready for Orchestrator handoff to Architect. The request is to continue the existing interactive Russian `Руководство` through full manual/document completion, using one PR per source manual chapter from this point forward, treating appendices as chapter-equivalent PR units by assumption, and applying stricter high-resolution/source-as-is/glyph-level visual rules to all future manual work and any needed correction PRs.

## Final Analyst Validation - PR #185 Visual-Rule Prerequisite

Analyst validation pass: passed

Final Analyst validation completed at: 2026-06-03T03:21:43Z

Analyst validated effective content head: 36316f3781b9b04f305725018522b0f55407f900

Analyst return count for this prerequisite validation: 0

Validation scope: PR #185 visual-rule prerequisite only. This Analyst validation covers whether the prerequisite supports the original user intent to continue until the whole document is complete, use one source manual chapter per PR from this point forward, require high-resolution x5/equivalent visual export, keep photos/signs/road markings unmodified including no translation, and require infographics to be transferred as source images with glyph/letter-level Spanish cleanup and Russian overlay text.

Customer intent check: passed for the prerequisite scope. The validated effective content head records the stricter visual rules in durable manual-conversion guidance, checker/evidence policy, tests, and process memory. It supports the user's request by making future chapter, appendix, audit, and correction PRs accountable to the requested high-resolution/source-as-is/source-transferred visual standard and the one-chapter/one-PR continuation model.

Completion boundary: this prerequisite supports but does not itself complete Chapter 2, Chapters 3-5, Appendices I-IV, front matter, Introduction/Chapter 1 visual audit, or any correction PRs. One-chapter/one-PR continuation remains required for remaining source manual chapters and chapter-equivalent appendices before full-document completion can pass.

Architect prerequisite: final Architect validation passed before this Analyst validation at `2026-06-03T03:19:05Z` for the same effective content head `36316f3781b9b04f305725018522b0f55407f900`. The later commit `b589407488a7fc4c7f1d00426a74b71644597ad5` is treated as Architect-owned validation evidence only; it records the Architect pass in `tasks.md` and does not intend product/code/test/runtime/manual-content behavior changes.

Gaps: none for the PR #185 prerequisite scope. Remaining full-document work stays pending by design and is not a gap in this prerequisite validation.

Analyst boundary reminder: this validation edits only Analyst-owned notes in `specs/031-manual-document-completion/feature-request.md`; no code, tests, runtime files, durable docs, Architect artifacts, staging, commits, pushes, reviews, PR state, merges, cleanup, root worktree files, or sibling worktrees were changed.

## Final Analyst Validation Rerun - PR #185 Repaired Visual-Rule Prerequisite

Superseded validation notice: the earlier Analyst validation for `36316f3781b9b04f305725018522b0f55407f900` is superseded and stale because later non-evidence repair commits changed strict visible-Spanish source-as-is validation behavior. The repaired effective content head for this prerequisite validation rerun is `c0b08aa2b23fefdb4eef1425035e94d5d6f8236c`.

Analyst validation pass: passed

Final Analyst validation completed at: 2026-06-03T04:00:31Z

Analyst validated effective content head: c0b08aa2b23fefdb4eef1425035e94d5d6f8236c

Analyst return count for this prerequisite validation rerun: 0

Validation scope: PR #185 visual-rule prerequisite only. This Analyst rerun validates the repaired prerequisite against the original user intent: continue until the whole document is complete, keep one source manual chapter per PR from this point forward, require high-resolution x5/equivalent visual export, prohibit alteration or translation of photos/signs/road markings, and require infographics to be source-image transfers with glyph/letter-level Spanish cleanup and Russian overlay text.

Customer intent check: passed for the repaired prerequisite scope. The repaired effective content head preserves the prerequisite support for future full-manual work and strengthens the strict source-as-is evidence around visible-Spanish exceptions so future chapter, appendix, audit, and correction PRs remain accountable to the user's visual requirements.

Completion boundary: PR #185 remains prerequisite-only. It supports but does not itself complete Chapter 2, Chapters 3-5, Appendices I-IV, front matter, Introduction/Chapter 1 visual audit, or any correction PRs. One-chapter/one-PR continuation remains required for remaining source manual chapters and chapter-equivalent appendices before full-document completion can pass.

Architect prerequisite: final Architect validation rerun passed before this Analyst rerun at `2026-06-03T03:58:12Z` for the same repaired effective content head `c0b08aa2b23fefdb4eef1425035e94d5d6f8236c`. The later commit `b95826fbcb539646ab647073ec61ab1493000010` is treated as Architect-owned validation evidence only; it records the Architect rerun in `tasks.md` and does not intend product/code/test/runtime/manual-content behavior changes.

Gaps: none for the PR #185 repaired prerequisite scope. Remaining full-document work stays pending by design and is not a gap in this prerequisite validation rerun.

Analyst boundary reminder: this rerun edits only Analyst-owned notes in `specs/031-manual-document-completion/feature-request.md`; no code, tests, runtime files, durable docs, Architect artifacts, staging, commits, pushes, reviews, PR state, merges, cleanup, root worktree files, or sibling worktrees were changed.

## Final Analyst Validation Rerun - PR #185 Latest Repaired Visual-Rule Prerequisite

Superseded validation notice: the earlier Analyst validations for `36316f3781b9b04f305725018522b0f55407f900` and `c0b08aa2b23fefdb4eef1425035e94d5d6f8236c` are superseded and stale because later non-evidence repair commits changed strict visible-Spanish validation behavior, including transferred infographic/diagram visible-Spanish rejection and strict source-as-is exceptions only for protected photos/signs/road markings. The latest repaired effective content head for this prerequisite validation is `bcc377a154c936374715f6ca4ce2d5714af4a722`.

Analyst validation pass: passed

Final Analyst validation completed at: 2026-06-03T04:29:32Z

Analyst validated effective content head: bcc377a154c936374715f6ca4ce2d5714af4a722

Analyst return count for this prerequisite validation rerun: 0

Validation scope: PR #185 visual-rule prerequisite only. This Analyst validation validates the latest repaired prerequisite against the original user intent: continue until the whole document is complete, keep one source manual chapter per PR from this point forward, require high-resolution x5/equivalent visual export, prohibit alteration or translation of photos/signs/road markings, and require infographics to be source-image transfers with glyph/letter-level Spanish cleanup and Russian overlay text.

Customer intent check: passed for the latest repaired prerequisite scope. The latest effective content head preserves the prerequisite support for future full-manual work and strengthens the strict evidence model so transferred infographics/diagrams cannot retain visible Spanish through protected-image exception paths, while protected source-as-is exceptions remain limited to photos, traffic signs, and road markings as required by the user's visual rules.

Completion boundary: PR #185 remains prerequisite-only. It supports but does not itself complete Chapter 2, Chapters 3-5, Appendices I-IV, front matter, Introduction/Chapter 1 visual audit, or any correction PRs. One-chapter/one-PR continuation remains required for remaining source manual chapters and chapter-equivalent appendices before full-document completion can pass.

Architect prerequisite: final Architect validation passed before this Analyst validation at `2026-06-03T04:26:07Z` for the same latest repaired effective content head `bcc377a154c936374715f6ca4ce2d5714af4a722`. The later commit `7447f0a0bf4666986351350ea61265ec68778dfe` is treated as Architect-owned validation evidence only; it records the Architect pass in `tasks.md` and does not intend product/code/test/runtime/manual-content behavior changes.

Gaps: none for the PR #185 latest repaired prerequisite scope. Remaining full-document work stays pending by design and is not a gap in this prerequisite validation.

Analyst boundary reminder: this validation edits only Analyst-owned notes in `specs/031-manual-document-completion/feature-request.md`; no code, tests, runtime files, durable docs, Architect artifacts, staging, commits, pushes, reviews, PR state, merges, cleanup, root worktree files, or sibling worktrees were changed.
