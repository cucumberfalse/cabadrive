# Feature Request: Manual Visual Content Crop

## Intake Metadata

- Feature ID: `034-manual-visual-content-crop`
- Intake role: Analyst
- Assigned worktree: `/Users/chap/devel/cabadrive-worktrees/034-manual-visual-content-crop`
- Assigned branch: `codex/034-manual-visual-content-crop`
- Verified base provided by Orchestrator: `origin/main` at `7b410e6c55be177e860cf28641c5181d67890862`
- Base verification: Orchestrator reported this worktree was created from verified `origin/main`.
- Local branch observed during intake: `codex/034-manual-visual-content-crop...origin/main`
- Local HEAD observed during intake: `7b410e6c55be177e860cf28641c5181d67890862`
- Parallel-work warning: parallel agents/worktrees may be active. Preserve all existing dirty diffs, branches, commits, PRs, and process memory. Do not touch sibling worktrees or unrelated files.
- Existing prefix check: the maximum existing numeric prefix under `specs/` is `033`; this feature uses the next assigned prefix `034`.
- Intake artifact scope: this Analyst intake creates only `specs/034-manual-visual-content-crop/feature-request.md`. Analyst does not create `spec.md`, `plan.md`, `tasks.md`, code, tests, runtime assets, durable docs, commits, pushes, PRs, or merge actions.

## Original User Request

The original request was given in Russian:

> ты оркестратор
> очень маленькое изображение с большими белыми полями, увеличить на всю страницу именно изображение
> проверитьб весь документ и пофиксить все подобные кейсы

The attached screenshot shows the interactive manual section titled `Официальные листы регулирующих знаков`. The card/page area is large, but the useful sign-sheet content is a tiny island near the lower center of a mostly white page image. The learner sees a large white canvas instead of a readable official sign sheet.

Latest user clarification:

> увеличить - не просто растянуть картинку, а достать из исходного документа в лучшем качестве, потому если просто увеличить - будет пиксельнго

Normalized intake reading:

- The user is not asking for a CSS-only browser upscale and not asking to stretch the existing raster.
- The requested fix is to go back to the original official source document/pages, extract or crop the meaningful visual content region at the best faithful quality available, remove or avoid excessive empty page margins, and render that extracted visual large enough to inspect without pixelation.
- The whole interactive manual/document must be checked for similar cases where the displayed asset contains large white/empty margins or where the useful artwork/sheet is too small inside the image.
- The user expects the image content itself to become large and clear, not merely the outer page/card box.
- This is an Orchestrator-routed repository-changing request; this Analyst artifact exists because Orchestrator assigned Analyst intake.

## Request Classification

This is a repository-changing corrective content/asset-quality request for the current interactive Russian `Руководство` manual surface.

The request is a follow-up defect to feature `032-manual-figures-full-width`: feature `032` corrected thumbnail-like card layout by making source-image cards full-width and preserving no-upscale metadata, but some Appendix IV sign-sheet assets can still be visually unusable because the raster itself is a full-page source-as-is image with huge empty margins and a tiny useful sheet inside it. The current request targets the useful-content crop/source-extraction problem, not just the component layout width problem.

This feature should remain one intake because the user asked for one whole-document defect class: high-quality source extraction/cropping for manual visuals whose useful content is too small because of excessive empty margins or poor source asset preparation.

## Project Context

- Cabadrive is a local-first React/TypeScript/Vite web trainer for Russian-speaking drivers preparing for the CABA theory exam.
- There is no runtime backend. Manual content and assets must remain bundled local/static content after build.
- The user-facing manual destination is `Руководство`, a native interactive Russian document surface derived from the official GCBA 4-wheel manual and organized by the source `Índice`.
- The manual must not be rendered through a runtime PDF viewer, PDF.js, iframe/object/embed PDF, full-page raster-only document, remote image, runtime fetch, backend endpoint, live AI, or remote font.
- Manual conversion rules require source-faithful local artwork, high-resolution x5/equivalent visual extraction evidence, selectable Russian DOM/SVG learning text where feasible, and no low-resolution or runtime-upscaled source assets.
- Manual conversion guidance says crops should use original PDF/source artwork fragments or complete infographics as needed and should never use the full PDF page as the visible base.
- Photos, traffic-sign images, and road-marking images are protected source-as-is assets: they must not be translated, relabeled, redrawn, recolored, cleaned, reconstructed, retouched, masked, inpainted, or otherwise visually modified. Russian explanation belongs outside the protected image.
- Cropping away empty page margins around a protected source visual is expected only when it is source-faithful and non-destructive: meaningful sign, marking, label, photo, map, diagram, or source-document pixels must remain unchanged.

## Relevant Prior Feature Memory

Feature `032-manual-figures-full-width` established a reusable full-width source-image-card display contract and inventoried `38` current `source-image-cards` cards. It corrected the old `~180px` thumbnail layout for major source visuals, including Appendix IV pages `185-200`, `app3-body-posture-source-card`, and `app2-hospital-map-source-card`.

Important distinction for this new feature:

- Feature `032` treated Appendix IV sign sheets such as pages `185` and `186` as high-quality full-page source-as-is images, with natural dimensions recorded for pages `185` and `186` as `2976x4209`.
- The new user screenshot shows that even a large/full-width card can fail if the useful sign sheet content occupies only a small part of the image because the raster includes most of the original page whitespace.
- The desired outcome is not more browser zoom on `sign-sheet-185-source-as-is.jpg` or similar assets. The desired outcome is a better faithful extraction/crop from the official source page so the sign sheet itself, not the blank page around it, fills the available manual reading area.
- The existing no-upscale and source-as-is protections remain valid; this feature should strengthen them by requiring useful-content crop/source-page evidence.

## Requested Outcome

Manual visuals whose useful source content is tiny inside a large blank raster must be replaced or regenerated from the official source document at the best faithful quality available, with excessive empty margins removed or avoided. The rendered result should make the official image/sheet/artwork itself occupy the manual reading content width where appropriate, without pixelated upscaling.

For the reported `Официальные листы регулирующих знаков` case, the official regulatory sign sheet content should be extracted/cropped from the source page so the signs and their source labels are readable at normal manual size. The learner should not see a huge white page with a tiny sign sheet near the bottom center.

The same standard should apply across the whole interactive manual/document to sign sheets, marking/signal sheets, maps, diagrams, large source photos, source-document examples, and other manual visuals where excessive empty margins or weak extraction make the useful content too small.

## Scope

In scope:

- Correct the reported regulatory sign-sheet case shown in the screenshot, likely including Appendix IV pages `185` and `186`.
- Inspect the whole interactive manual/document for assets where useful visual content occupies an unacceptably small region of the displayed image because of excessive white/empty margins.
- Include Appendix IV sign, warning, informational, temporary, horizontal-marking, and traffic-light sheets as likely high-risk siblings because feature `032` identified pages `185-200` as full-width source-sheet visuals.
- Include non-Appendix source-image-card and source-artwork candidates where useful content is similarly tiny inside the asset, not only the reported section.
- Re-extract, re-export, or crop affected visuals from the official source document/pages at x5/equivalent/better faithful quality where possible.
- Record source page, crop/bounding region, extraction method, natural output dimensions, hashes where practical, and no-upscale/runtime display evidence for corrected assets.
- Preserve source-as-is official signs, markings, signals, photos, maps, and source-document examples. Cropping empty margins is allowed only as a source-faithful extraction step; protected content pixels must not be altered.
- Keep Russian explanatory text selectable and outside protected images.
- Add tests/evidence so this defect cannot regress to either tiny useful-content islands or blurry browser-upscaled assets.
- Update durable manual conversion documentation only if the implementation changes or clarifies the reusable extraction/crop/evidence contract for future manual visuals.

Out of scope for this intake:

- Analyst does not choose the exact extraction tool, crop algorithm, asset naming scheme, renderer implementation, or test architecture.
- Analyst does not edit code, tests, assets, durable docs outside this intake artifact, existing feature memories, commits, pushes, PRs, or merge actions.
- Do not simply increase CSS width, zoom, transform, or image-rendering settings on the existing low-useful-content raster and call the issue fixed.
- Do not stretch images, distort aspect ratios, crop meaningful sign/label/diagram/map content, or upscale beyond source/native quality.
- Do not translate, relabel, redraw, recolor, clean, mask, retouch, inpaint, reconstruct, vector-recreate, or otherwise modify protected official sign/marking/photo/map/source-image pixels.
- Do not replace the interactive manual with a runtime PDF viewer, PDF.js canvas, iframe/object/embed PDF, remote images, runtime fetches, or full-page raster-only manual reading.
- Do not change practice questions, exam mode, content availability mode, source archive policy, Docker runtime contract, or unrelated product surfaces.

## Acceptance Expectations

- Pages/sign sheets like Appendix IV pages `185` and `186` are corrected by high-quality source extraction/cropping from the official document, not by browser upscaling of the existing full-page raster.
- In the reported `Официальные листы регулирующих знаков` section, the useful regulatory sign-sheet artwork occupies a meaningful share of the manual reading content area on desktop and mobile.
- The corrected visuals do not look blurry, pixelated, or stretched at their intended runtime display size.
- The whole interactive manual/document has an inventory of similar assets with excessive white/empty margins or too-small useful content, with each candidate corrected or explicitly dispositioned as not affected/acceptable.
- Appendix IV pages `185-200` are checked as a group because they share the same source-sheet pattern.
- Protected official signs, markings, signals, photos, maps, and source-document images remain source-faithful. Russian text remains outside protected images as selectable DOM/SVG text and is not overlaid on protected pixels.
- Existing full-width layout behavior from feature `032` remains intact: corrected visuals still use the appropriate manual content width, preserve aspect ratio, avoid document-level horizontal overflow, and respect no-upscale caps.
- Existing compact visuals that are genuinely small and do not have the excessive-margin defect do not have to be enlarged or recropped.
- Existing manual navigation, section order, route hashes, source page metadata, local-first behavior, lazy loading where present, and forbidden-pattern gates remain stable.
- Tests/evidence include natural/source extraction dimensions, crop/source page evidence, before/after or bounding-box useful-content ratios, desktop/mobile visual verification, and no-upscale runtime display proof.

## Negative Scenarios

- Enlarging the existing image element while leaving the tiny useful sign sheet inside a huge white page.
- Treating the issue as solved because the outer card/page area is full-width even though the useful artwork remains a small island.
- Fixing only page `185` while leaving page `186` or sibling Appendix IV sign/marking/signal sheets with the same excessive-margin defect.
- Checking only the reported screenshot and not inventorying the whole manual/document for similar visual-content crop problems.
- Browser-upscaling a low-resolution or margin-heavy raster until it becomes pixelated.
- Cropping away meaningful official sign, label, marking, map, diagram, or photo content.
- Redrawing, relabeling, recoloring, retouching, masking, cleaning, inpainting, translating, or reconstructing protected source imagery while trying to improve quality.
- Moving Russian text into protected images or overlaying Russian labels on official sign/map/photo pixels.
- Reintroducing runtime PDF viewer behavior, remote/manual network assets, or full-page raster-only document rendering.
- Breaking mobile layout with incoherent document-level horizontal overflow.
- Removing or weakening source-fidelity, no-upscale, hash, source-page, or exception metadata from the prior manual visual work.

## Assumptions

- The screenshot corresponds to the current interactive `Руководство` manual surface, not the legacy page-canvas reader.
- The reported case is likely one or both regulatory sign-sheet assets for Appendix IV pages `185` and `186`, but Architect/Implementation Agent should confirm exact asset/card IDs from the current code and runtime.
- "Увеличить на всю страницу именно изображение" means the useful official visual content should fill the available manual reading/content width, not necessarily the entire browser viewport.
- "Достать из исходного документа в лучшем качестве" means use the canonical archived official manual/PDF or the best available official source asset already retained in the repository, with faithful high-resolution extraction/cropping.
- Removing empty margins around a source image is acceptable when it is a faithful crop of the official source and does not alter protected content pixels.
- Some assets may already have enough natural pixel dimensions but poor useful-content ratio; others may need higher-resolution source re-export. The implementation should distinguish these cases with evidence.
- No normal-flow user clarification is required before architecture work. If Architect finds ambiguous candidates, it can define objective inventory criteria and require implementation evidence.

## Risks

- A naive automatic crop could remove meaningful labels, tiny signs, page captions, or other exam-relevant details.
- Some official pages may have intentionally sparse layout; the inventory needs a useful-content criterion rather than "remove every white margin everywhere."
- Re-exporting many source visuals can create large asset diffs and performance impact if not scoped and compressed carefully.
- Cropping protected source images improves visibility but may be confused with visual editing; process memory and evidence must prove source pixels are preserved except for omitted empty margins.
- If prior tests assert exact dimensions/hashes for full-page assets, they may need deliberate updates to reflect the new crop/source extraction while preserving source-fidelity expectations.
- Mobile display can regress if tall portrait sign sheets become readable but awkward; verification should check inspectability without incoherent overflow.

## Open Questions

- No user clarification is needed for intake.
- Architect should define the inventory threshold for "useful content too small inside the asset", such as a useful-content bounding-box ratio, excessive-margin ratio, runtime inspectability threshold, or manual reviewer evidence.
- Architect should decide whether to require a scripted detector for excessive white/empty margins, a manual inventory table, or both.
- Architect should decide whether corrected assets should replace existing asset paths or use new crop-specific asset names with preserved provenance.
- Architect should decide how to handle assets where the official source cannot provide better quality than the current crop: record a no-upscale/source-quality limitation rather than stretching or retouching.

## Acceptance Evidence Expected

- A whole-manual inventory of source-image-card/source-artwork/manual visual assets that records affected/not-affected disposition, source page, asset path, natural dimensions, useful-content or crop bounds, margin/useful-content ratio where practical, protected/source-as-is status, and reason.
- Specific correction evidence for regulatory sign-sheet pages like `185` and `186`, including source page/crop region, extraction method, output dimensions, and hash where practical.
- Before/after screenshot or bounding-box evidence showing that the useful sign-sheet content, not merely the outer image element, occupies a meaningful share of the manual content area.
- Desktop and mobile screenshots or Playwright assertions for the reported regulatory sign-sheet section.
- Representative desktop/mobile evidence for other corrected similar Appendix IV sheets and at least one non-Appendix visual if the inventory finds one.
- Natural-dimension and runtime-display evidence proving the browser does not enlarge corrected assets beyond faithful source quality.
- Verification that protected official signs, markings, signals, photos, maps, and source-document pixels remain unmodified aside from source-faithful empty-margin cropping.
- Focused automated tests for the inventory/disposition and useful-content sizing behavior, plus standard local verification appropriate to touched code/assets, including manual-guide/content tests, TypeScript/build, Playwright or equivalent browser checks, `git diff --check`, and preflight where required by Architect tasks.

## Sources Read During Intake

- `.specify/memory/constitution.md`
- `docs_project/README.md`
- `docs_project/project-idea.md`
- `docs_project/project/frontend/frontend-docs.md`
- `docs_project/project/frontend/manual-conversion-guidelines.md`
- `docs_project/project/backend/backend-docs.md`
- `docs_project/project/feature-inventory.md`
- `docs_project/screens/learning-and-exam-flows.md`
- `docs/specify/README.md`
- `specs/032-manual-figures-full-width/feature-request.md`
- `specs/032-manual-figures-full-width/spec.md`
- `specs/032-manual-figures-full-width/plan.md`
- `specs/032-manual-figures-full-width/tasks.md`

No external research was needed for this intake because the user request and repository manual-conversion guidance already define the relevant source-fidelity and extraction-quality expectations.

## Analyst Handoff

This intake is ready for Orchestrator handoff to Architect. The customer intent is clear: the manual must not merely stretch margin-heavy raster images. It must return to the official source document/pages, extract/crop the meaningful visual content at faithful high quality, remove excessive empty margins, and render the corrected visuals large enough to inspect across the whole manual while preserving protected official image pixels, no-upscale quality limits, local-first constraints, and selectable Russian support text outside protected images.

## Final Analyst Validation - 2026-06-05

- Analyst validation pass: passed
- Final Analyst validation completed at: 2026-06-05T18:57:14-03:00
- Analyst validated effective content head: 860a4ef4ab66a28b066625d4ffe52f526cce2d5b
- Analyst validation basis: original intake request, recorded same-cycle user examples in `spec.md`, Architect-owned final validation in `tasks.md`, current PR `#200` evidence for head `860a4ef4ab66a28b066625d4ffe52f526cce2d5b`, required-check status, and committed visual/copy evidence files.
- Outcome validation: the final result satisfies the user's desired outcome in spirit and letter for this PR. The guide no longer treats the reported issue as a CSS stretch problem; evidence records official-source extraction/cropping, no-upscale display caps, large regulatory Anexo L panels plus focused `NO AVANZAR`, corrected hospital map and blind-spot/tire/headrest/public-space visuals, restored App I `Matafuegos`/`Chaleco reflectivo` visuals, protected-image internal text preservation, separate Russian term translations outside images, and learner-facing provenance-copy cleanup.
- User-example validation: the concrete examples named in feature memory are represented in the implementation evidence as implemented or explicitly dispositioned. The one remaining visible residual, `matafuegos-chaleco-reflectivo` as App I only with App2/App3 equipment visuals not claimed complete, is accepted for this PR because the user-called-out extinguisher/vest visuals are restored from the official App I source and the residual is transparent in `remainingRequiredExamples`, not hidden as completed.
- Gate validation: Architect validation passed first at `2026-06-05T18:53:45-03:00` for the same effective content head. PR `#200` head, mergeability, and required checks were verified before this note: `AI Review`, `baseline-checks`, `docker-validation`, `guard`, and `osv-scan` are green on `860a4ef4ab66a28b066625d4ffe52f526cce2d5b`.

## Final Analyst Validation Notes

Analyst validation pass: passed
Final Analyst validation completed at: 2026-06-05T21:08:39-03:00
Analyst return count: 0
Analyst validated effective content head: 9b6300e6639e59149c2fea67df5c842a22b5b9aa
Analyst validation evidence: Customer intent is satisfied for PR #200 at effective content head 9b6300e6639e59149c2fea67df5c842a22b5b9aa: the result addresses the reported tiny official visual content problem through official-source/high-quality extraction and crop handling rather than browser stretching.
Analyst validation evidence: Concrete user examples are preserved in feature memory and represented in the final validation basis, including Appendix IV regulatory signs and NO AVANZAR, hospital map, blind spot, tire, Matafuegos, Chaleco reflectivo, headrest, public-space visual, and learner-facing Russian copy cleanup.
Analyst validation evidence: Official-source and high-quality image handling is satisfied by recorded source/crop/readability/no-upscale evidence, and protected-image translation boundaries are satisfied by keeping protected pixels unchanged with Russian support text outside protected images.
Analyst validation evidence: Architect validation passed first at 2026-06-05T21:06:53-03:00 for the same effective content head 9b6300e6639e59149c2fea67df5c842a22b5b9aa, with Architect gaps recorded as none.
Analyst validation evidence: Orchestrator guard snapshot reported PR #200 open, mergeable, not draft, required checks green on 9b6300e6639e59149c2fea67df5c842a22b5b9aa, unresolved review threads [], and feature-memory check passed.
Analyst validation evidence: No Analyst gaps remain.
