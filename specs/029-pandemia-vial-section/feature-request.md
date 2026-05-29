# Feature Request: Pandemia Vial Interactive Russian Section Prototype

## Intake Metadata

- Feature ID: `029-pandemia-vial-section`
- Intake role: Analyst
- Assigned worktree: `/Users/chap/devel/cabadrive-worktrees/029-pandemia-vial-section`
- Assigned branch: `codex/029-pandemia-vial-section`
- Verified base provided by Orchestrator: `origin/main` at `afb0d2b8d00cb9d823266d661bab85fbe18043e8`
- Parallel-work warning: parallel work may exist; sibling worktrees, branches, commits, PRs, dirty diffs, and process memory must be preserved.
- Intake artifact scope: this Analyst intake creates only this `feature-request.md`; Architect-owned `spec.md`, `plan.md`, and `tasks.md` are intentionally not created by Analyst.

## Original User Request

The original request was given in Russian. Summary:

> The previous full-manual implementation is very poor/worse. The correct required model is:
> 1. Input is a PDF document.
> 2. Output must be an interactive document whose content is identical to the source document. Page-by-page splitting is not required; splitting should be by sections. At the same time, the external appearance must be fully preserved: design, layout, images.
> 3. Everything must be translated into Russian.
>
> Current scope: implement separately only the `Pandemia vial` page/section according to these requirements, show the result for user approval, then later do several more blocks, and only after that the whole document.

## Request Classification

This is a new corrective/prototype feature, not a continuation of trying to ship or replace the whole manual in one step.

The user's requested delivery model is intentionally incremental:

- first, implement only the `Pandemia vial` section/page as a high-fidelity Russian interactive document section;
- show that single block in the app or preview for user approval;
- later, repeat the approach for several more blocks;
- only after those approvals, consider a full-document conversion.

## Source Material and Existing Context

- The source input is a PDF document, likely the GCBA 4-wheel vehicle manual already represented in the repository as `content/official-documents/originals/gcba-manual-vehiculo-4-ruedas-2023.pdf`.
- The target section is likely the source manual page/section whose title is `Pandemia vial`.
- Analyst does not decide the exact page, asset, route, data, or component architecture.
- Architect and Implementation Agent must verify the exact source location, content span, images, captions, layout, and existing asset/manifest coverage from the canonical PDF and repository assets/manifests before implementation.
- Existing project constraints still apply:
  - local-first static web app;
  - Docker-only local runtime;
  - no runtime backend;
  - no runtime PDF iframe/embed/object/PDF.js viewer;
  - no runtime network fetch, live AI dependency, or remote manual asset dependency for this section;
  - official Spanish source traceability remains required;
  - Russian text remains learning support derived from official Spanish source unless an official Russian source is later proven.

## Requested Outcome

Create one interactive Russian web document section for `Pandemia vial` whose content is identical in meaning and coverage to the source PDF section and whose visual presentation preserves the source document's external appearance: design, layout, images, visual hierarchy, and section reading experience.

The result must be site-native and interactive. It must not be a PDF viewer, not a flattened full-page screenshot with tiny Russian overlay text, not a side-by-side Spanish original plus Russian transcript, and not a full-document conversion.

The page boundary from the PDF may be ignored if needed. The content should be represented faithfully as a coherent section-level reading experience rather than as an obligation to preserve the original PDF's page split.

## Scope

- Implement only the `Pandemia vial` page/section.
- Translate all content in that source section into Russian.
- Preserve the section's source content, visual design, layout relationships, images, captions, and hierarchy in an interactive web document form.
- Use local/static assets and repository-managed content only.
- Expose the result in the app or a preview path so the user can review and approve this single block.
- Record enough source and verification evidence for Architect/Orchestrator to judge whether this prototype matches the requested model before additional sections are attempted.
- Update durable project documentation only if Architect determines this prototype changes documented manual/reader behavior, content strategy, validation strategy, or local runtime expectations.

## Out of Scope for This Intake

- Full-document manual conversion or replacement.
- Converting multiple manual sections in this slice.
- Deciding the exact technical implementation strategy, page architecture, data model, visual extraction approach, or validation thresholds.
- Analyst inspecting, translating, or reconstructing the source PDF content.
- Analyst writing code, tests, runtime assets, durable docs, Architect artifacts, commits, pushes, PRs, reviews, or merge actions.

## Acceptance Expectations

- The app or preview shows one interactive Russian `Pandemia vial` section for user approval.
- The section content matches the source PDF section faithfully and completely for that section.
- The Russian text is a complete translation of the section content, with no summary, omission, simplification, editorial replacement, placeholder, or intentionally untranslated source text.
- The visual presentation preserves the source design, layout, image placement, relative hierarchy, and section-level reading experience as closely as required by the requested model.
- Source images and visual elements used by the section are preserved as local/static assets and render clearly.
- The implementation may ignore original PDF page boundaries, but the resulting section must remain faithful to the source section's content order and visual relationships.
- The result is an interactive web document section, not a runtime PDF viewer, not an iframe/object/embed/PDF.js render, not a side-by-side Spanish screenshot plus Russian transcript, and not a screenshot-only page with unreadably small overlay text.
- The slice does not attempt to replace the whole manual or present itself as a completed whole-document conversion.
- The user can inspect this single block before the project proceeds to more blocks.
- Verification evidence should demonstrate:
  - exact source location and content span for `Pandemia vial`;
  - translation coverage for every source text/caption/label in the section;
  - local image/visual asset coverage for the section;
  - layout/design fidelity relative to the source section;
  - absence of runtime PDF viewer/backend/network/live-AI dependencies;
  - app or preview accessibility for user approval.

## Negative Scenarios

- Shipping another whole-manual attempt before the single `Pandemia vial` block is approved.
- Showing the source PDF or PDF-rendered page at runtime and calling it an interactive document.
- Using only a flat screenshot of the source page with tiny Russian overlay text.
- Displaying a Spanish original image beside a separate Russian transcript.
- Providing a text-only Russian article that loses the source design, layout, images, captions, tables, or visual hierarchy.
- Summarizing, simplifying, shortening, or editorially rewriting the source section instead of preserving identical content in Russian.
- Depending on a backend, remote images, live AI, runtime PDF rendering, or network fetches to display the section.

## Assumptions

- `Pandemia vial` refers to a distinct section/page in the GCBA 4-wheel manual, but the exact page number and content boundaries must be verified from the source PDF and existing manifests.
- The user's phrase "interactive document" means a site-native web document section with meaningful web affordances, not a static PDF embed and not a non-interactive image-only export.
- Section-level splitting is acceptable and preferred for this prototype, even if the source section crosses or sits within PDF page boundaries.
- The prototype is meant to validate the conversion model and visual/content fidelity with the user before broader manual conversion work proceeds.
- Existing manual assets, translation material, or layout manifests may be reused only if they satisfy the corrected section-level fidelity requirement.

## Risks

- The exact `Pandemia vial` source span may not align cleanly with one PDF page, requiring careful boundary verification.
- Preserving source visual design while translating to Russian may create text-length and layout pressure.
- A screenshot-overlay approach could appear visually similar at first glance but fail readability and interactivity expectations.
- Reusing current manual layout data without checking the section could repeat the defects the user is correcting.
- Evidence for "fully preserved" appearance needs a practical threshold from Architect so Review Agent and Orchestrator can judge the prototype consistently.

## Open Questions

- No blocking user clarification is required for intake.
- Architect should define the exact implementation strategy and evidence threshold for "content identical" and "external appearance fully preserved" for this one section.
- Architect and Implementation Agent must verify the exact `Pandemia vial` source location, content boundaries, and asset requirements from the PDF/assets/manifests.
- The user wants to approve this single block before additional sections or whole-document replacement proceed.

## Analyst Handoff

This intake is ready for Orchestrator handoff to Architect. The scope is one corrective prototype section: build only the `Pandemia vial` interactive Russian web document section, preserve source content and visual appearance, keep the implementation local-first and site-native, and show the result for user approval before expanding to more manual blocks.

## Final Analyst Validation Notes

Analyst validation pass: passed

Final Analyst validation completed at: 2026-05-29T14:38:46Z

Analyst validated effective content head: 1128b43bcab7c5ee61217f9052c3e0140ed5766a

Analyst return count for this work cycle: 0

Customer intent check: passed. The recorded final result satisfies the user's requested direction in spirit and letter: prior section-conversion work is now captured as durable requirements/guidelines, the Russian interactive guide work is scoped through the Introduction sections inside `Руководство`, source-layout/artwork preservation and readable Russian simplification are treated as binding requirements, scalable navigation is documented and verified, visual checker/guideline evidence is recorded, and merge-readiness evidence is present for PR #173 at the effective content head.

Gaps: none found during Analyst final validation.

Architect disposition routing complete: yes. Architect final validation passed before this Analyst validation, and the feature memory records no unresolved Implementation Agent feedback or open Architect dispositions.

Analyst limit escalation: none / not applicable.

Boundary reminder: this Analyst validation edited only this Analyst-owned final validation section in `specs/029-pandemia-vial-section/feature-request.md`; no code, Architect artifacts, review artifacts, staging, commits, pushes, or PR state were changed.

Analyst validation pass: passed

Final Analyst validation completed at: 2026-05-29T16:26:21Z

Analyst validated effective content head: db03cc07a0e6193b7d4e06d6ee0d160632a0e12c

Analyst return count for this work cycle: 0

Customer intent check: passed. The refreshed effective content head preserves the user-requested outcome: prior PDF-section conversion work is documented as reusable requirements/guidelines, the Russian interactive guide remains section-based inside `Руководство`, source layout/artwork preservation and readable Russian simplification remain binding, scalable full-manual navigation is represented, visual checker/guideline evidence is recorded, and Architect-owned process-memory repair evidence supports merge readiness for PR #173.

Gaps, if any: none.

Architect disposition routing: complete. Final Architect validation passed at 2026-05-29T16:22:38Z for effective content head db03cc07a0e6193b7d4e06d6ee0d160632a0e12c, and Architect-owned process memory records no open Architect dispositions, no Architect validation gaps, no unresolved Analyst feedback, and no unresolved Implementation Agent feedback.

Analyst limit escalation: none / not applicable.

Analyst boundary reminder: this Analyst validation appended only Analyst-owned final validation evidence under `## Final Analyst Validation Notes` in `specs/029-pandemia-vial-section/feature-request.md`; no existing lines were modified or deleted, and no code, tasks, specs, docs, tests, assets, staging, commits, pushes, merges, or PR state were changed.

Analyst validation pass: passed

Final Analyst validation completed at: 2026-05-29T17:01:33Z

Analyst validated effective content head: 342c89e46d8c19f015b36390682ca57146311e9b

Analyst return count for this work cycle: 0

Customer intent check: passed. The current effective content head preserves the user-requested outcome: PDF-section conversion work remains documented as reusable requirements/guidelines, the Russian interactive guide remains section-based inside `Руководство`, source layout/artwork preservation and readable Russian simplification remain binding, scalable full-manual navigation is represented, and visual checker/guideline evidence remains recorded. The P3 legacyManual-exit follow-up does not alter the user-facing manual content requirements; it preserves the expected guide routing by removing stale `legacyManual=1` when leaving implemented Introduction guide routes while keeping the hidden bare `/?legacyManual=1` compatibility hook.

Gaps, if any: none.

Architect disposition routing: complete. Final Architect validation passed at 2026-05-29T16:57:58Z for effective content head 342c89e46d8c19f015b36390682ca57146311e9b, and Architect-owned process memory records no open Architect dispositions, no Architect validation gaps, no unresolved Analyst feedback, and no unresolved Implementation Agent feedback for the P3 legacyManual-exit follow-up.

Analyst limit escalation: none / not applicable.

Analyst boundary reminder: this Analyst validation appended only Analyst-owned final validation evidence under `## Final Analyst Validation Notes` in `specs/029-pandemia-vial-section/feature-request.md`; no existing lines were modified or deleted, and no code, tasks, specs, docs, tests, assets, staging, commits, pushes, merges, or PR state were changed.
