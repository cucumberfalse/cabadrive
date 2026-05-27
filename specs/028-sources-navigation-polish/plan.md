# Implementation Plan: Sources Fragment Navigation Polish

## Summary

Implement a narrow layout polish for the `Источники` fragment table-of-contents list so long labels and subtitles render as stable, readable rows on desktop and mobile. The expected implementation is a small CSS-only fix around `.source-toc` selectors, with e2e/visual verification proving no overlap or clipping and no behavior regression.

## Architecture

### 1. Preserve Existing Source Reader Behavior

- Keep `PrimarySourcesView` state and data flow unchanged unless a test hook or accessibility-neutral markup adjustment is required.
- Keep existing local corpus loading and bundled content boundaries.
- Keep existing `source-mode-simple`, `source-mode-full`, and `source-mode-spanish` controls and behavior.
- Keep existing document and chunk selection semantics.

### 2. Stabilize TOC Item Layout

- Inspect `.source-toc-list`, `.source-toc button`, `.source-toc span`, and `.source-toc small` in `src/styles.css`.
- Ensure list rows cannot shrink into vertical collisions. The likely minimal fix is to make TOC buttons non-shrinking flex/grid items with stable internal line layout and wrapping behavior.
- Keep row width constrained by the existing grid column and mobile one-column layout.
- Use stable line-height and child spacing so multi-line labels and subtitles have predictable vertical rhythm.
- Use deliberate text wrapping or line-clamp/truncation if needed; do not hide orientation-critical article numbers.

### 3. Maintain Interaction States

- Preserve active styling for the selected fragment.
- Preserve visible focus rings and ensure focus does not create overlap or layout jump.
- Preserve touch target minimum height while allowing taller rows for longer text.
- Preserve scroll behavior for long source documents.

### 4. Verification and Regression Coverage

- Extend existing Playwright coverage in `tests/e2e/app.spec.ts` or add an equivalent focused test around the existing primary-source reader tests.
- Use DOM geometry assertions to detect row overlap/clipping where practical:
  - each visible `.source-toc button` has a positive height large enough to contain its visible child text;
  - adjacent visible buttons do not overlap vertically;
  - the primary `span` and secondary `small` inside a button do not overlap;
  - TOC rows do not exceed the reader/container viewport horizontally on mobile.
- Cover both desktop and mobile viewport sizes.
- Reuse existing request interception coverage for no external/PDF/backend requests where possible.

### 5. Documentation

- No durable project docs are expected for a pure UI polish that does not change behavior, architecture, content, runtime, or workflow contracts.
- If implementation changes source-reader behavior, runtime boundaries, or durable design rules, update the appropriate `docs_project/` file and record why in `tasks.md`.

## Implementation Guidance

Recommended first pass:

1. Reproduce or inspect the defect in the current `Источники` reader using a long document such as the traffic law source already referenced by e2e fixtures.
2. Try a scoped CSS fix for `.source-toc-list > button` and child text layout.
3. Confirm active and focus states still look correct.
4. Add/adjust focused Playwright assertions for no overlap/clipping on desktop and mobile.
5. Run focused e2e, then repository checks.

Implementation may choose a different minimal approach if code inspection shows the defect comes from another source-reader layout constraint. Any broader change must be recorded as Implementation Agent feedback for Architect disposition before expanding scope.

## Testing Plan

- Focused Playwright:
  - desktop `1240x900` source reader with long-document TOC open;
  - mobile `390x900` source reader after opening a document;
  - geometry checks for visible TOC items;
  - fragment selection still updates the chunk reader;
  - language modes still switch selected chunk content.
- Existing e2e:
  - primary source reader opens and switches Russian/Spanish modes;
  - primary source search, filters, long-document TOC, and keyboard focus work locally;
  - primary source reader adapts between compact and expanded widths without runtime network or PDF dependencies.
- Local command evidence:
  - `pnpm run test`
  - `pnpm run build`
  - focused `pnpm exec playwright test tests/e2e/app.spec.ts -g "primary source"`
  - `node scripts/check-feature-memory.mjs --worktree`
  - `git diff --check`
  - `pnpm run preflight` before PR readiness unless Orchestrator narrows the verification assignment.

## Risks and Mitigations

- Risk: fixed-height rows hide content. Mitigation: prefer content-sized rows or explicit line clamp with enough visible context.
- Risk: desktop fix leaves mobile overflow. Mitigation: require mobile viewport checks and horizontal overflow assertions.
- Risk: shared button styles regress other surfaces. Mitigation: scope selectors to `.source-toc` unless broader change is proven necessary.
- Risk: visual issue is not caught by text assertions. Mitigation: add bounding-box/geometry checks and, where useful, screenshot evidence.

## Architect Guidance to Implementation Agent

- Work only from the Orchestrator-assigned implementation worktree, branch, and PR slice.
- Confirm complete feature memory exists before editing: `feature-request.md`, `spec.md`, `plan.md`, and `tasks.md`.
- Preserve parallel work: do not overwrite, reset, rebase, delete, or mutate sibling worktrees, branches, dirty diffs, commits, PRs, or process memory.
- Keep the change narrow and source-reader-focused.
- Do not change source content, official document archive records, translation data, content validation, runtime network behavior, PDF handling, or unrelated app surfaces.
- Keep `tasks.md` current with decisions, evidence, dead ends, known issues, and any Implementation Agent feedback.

## Handoff Readiness

This plan is ready for Orchestrator to assign to an Implementation Agent as a single narrow UI-fix PR slice from the latest verified base or the approved Analyst/Architect handoff context.
