# Plan: Manual Glossary Term Translations

## Summary

Implement a small structured-data and renderer update for the `Руководство` front glossary. The user-visible result is a glossary row pattern like:

```text
Acera (тротуар): сектор общественной дороги рядом с проезжей частью...
```

The Spanish term is emphasized and marked as Spanish; the Russian translation and definition remain close, selectable, and marked as Russian where feasible.

## Technical Context

- App stack: React + TypeScript + Vite, static local-first SPA.
- Runtime backend: none.
- Manual destination: `Руководство`, native interactive web document.
- Target data: `src/data/manual-sections/front-glossary.ts`.
- Target renderer: `ManualGuideSectionContentView` in `src/App.tsx`.
- Target type registry: `src/data/manualGuide.ts`.
- Target styles: `src/styles.css`.
- Current glossary state: all five glossary blocks use plain `itemsRu: string[]` values containing `Spanish term: Russian definition`.
- Current verification: manual guide tests under `tests/content-manual-guide-chapters.test.mjs`, e2e manual tests in `tests/e2e/app.spec.ts`, and `pnpm run validate:manual-guide`.

## Constitution Check

- Spec-first: implementation starts only after `feature-request.md`, `spec.md`, `plan.md`, and `tasks.md` exist.
- Testable boundaries: content shape, renderer semantics, layout behavior, and local-first/manual-guide contracts are testable.
- PR-only workflow: implementation lands through a PR, not direct `main`.
- One worktree per task: implementation uses the assigned isolated worktree/branch or a fresh Orchestrator-assigned implementation slice.
- Process memory: Implementation Agent updates `tasks.md` with evidence, decisions, known issues, and feedback.
- Final validation: Orchestrator invokes final Architect validation before final Analyst validation.

## Implementation Direction

Use a dedicated structured glossary list block.

Recommended type additions:

- `ManualGuideGlossaryItem`
- `ManualGuideContentBlock` union member with `kind: "glossary-list"`

Recommended renderer:

- Add a branch in `ManualGuideSectionContentView` for `block.kind === "glossary-list"`.
- Keep generic `kind: "list"` behavior unchanged for non-glossary manual lists.
- Render each item with semantic pieces:
  - Spanish term: `strong.manual-glossary-term`, `lang="es"`.
  - Russian parenthesized translation: `span.manual-glossary-translation`, `lang="ru"`.
  - Russian definition: `span.manual-glossary-definition`, `lang="ru"`.
- Add test-friendly attributes if helpful, for example `data-testid="manual-glossary-term"` or `data-term-es`.

Avoid these approaches:

- Splitting `itemsRu` strings on `:` in React.
- Global rich-text parsing for all manual list rows.
- Inserting styled HTML strings into content.
- Badge/chip UI that makes long terms wrap poorly.

## Data Migration Plan

1. Convert each front glossary list block to `kind: "glossary-list"`.
2. Replace every current string row with:
   - stable `id`
   - exact `termEs`
   - concise `translationRu`
   - Russian `definitionRu`
3. Preserve current Spanish term spelling and accents as visible `termEs`.
4. Review definitions that currently start with the obvious translation and remove duplicate wording only when the meaning stays intact.
5. Keep all legal/numeric details.
6. Update `sourceTextEs` only if implementation discovers accent/source mismatches that should be corrected; otherwise preserve source metadata.

Planning count from current source:

- `glossary-a-b`: 12 rows
- `glossary-b-c`: 21 rows
- `glossary-d-i`: 12 rows
- `glossary-m-p`: 12 rows
- `glossary-r-v`: 18 rows
- Total: 75 rows

## Styling Plan

Use the existing manual document visual system:

- Preserve `intro-doc-list` density and wrapping.
- Add small targeted classes instead of a broad redesign:
  - `.manual-glossary-list`
  - `.manual-glossary-item`
  - `.manual-glossary-term`
  - `.manual-glossary-translation`
  - `.manual-glossary-definition`
- Use strong weight and possibly the existing source/translation blue for the Spanish term.
- Keep translation visually close but not more prominent than the Spanish term.
- Ensure `overflow-wrap`/normal wrapping handles long terms such as `Ciclorodado con pedaleo asistido eléctricamente`.

## Documentation And Evidence Plan

Because this introduces a reusable manual glossary row model, Implementation Agent should update durable docs if the model is intended for future manual sections:

- `docs_project/project/frontend/manual-conversion-guidelines.md`: add a short glossary/list-row guidance note.
- `docs_project/project/frontend/design-system.md`: add a brief manual glossary term-row pattern only if a durable style token is introduced.

Implementation Agent should refresh or supersede front-glossary evidence:

- Update `frontGlossarySection.visualEvidence.notes` to mention structured term/translation rows.
- Update registry `implementationEvidence` notes if current wording becomes stale.
- Regenerate or replace `content/validation/manual-guide/front-glossary/front-glossary-desktop.png` and `front-glossary-mobile.png` if the PR continues to use those as current screenshot evidence.
- Record any alternate focused Playwright screenshot evidence in `tasks.md`.

## Verification Matrix

| Gate | Evidence |
| --- | --- |
| All rows have translations | Content test over `frontGlossarySection` structured blocks |
| Structured model, no parsing | Type/source test plus renderer inspection |
| A-B screenshot request satisfied | E2E/content assertions for screenshot-visible terms |
| Term emphasis/source-like style | DOM assertions for `.manual-glossary-term`, semantic `<strong>`, and computed style or class evidence |
| Language boundaries | DOM assertions for `lang="es"` on terms and `lang="ru"` on translation/definition |
| Selectable text | Playwright selection or CSS assertions preventing `user-select: none` |
| Responsive wrapping | Mobile Playwright no-overflow/no-clipping assertion |
| Manual local-first contract | `pnpm run validate:manual-guide`, `pnpm run validate:content`, forbidden pattern checks |
| Build/runtime health | `pnpm run build`, focused or full e2e |
| Feature memory | `node scripts/check-feature-memory.mjs --worktree` |

## Review Plan

Review Agent should focus on:

- Full row coverage across all five blocks.
- Natural translation quality and no awkward duplicated definitions.
- Strong/semantic accessible term emphasis.
- No brittle split/parsing logic.
- No regression to existing generic list rendering.
- Updated docs/evidence when model/style tokens changed.
- Local-first/manual-guide contract preservation.

## Risk Plan

- Risk: translation choices are context-sensitive.
  - Mitigation: use current definitions as the source of meaning, keep translations concise, and record any unresolved term in `tasks.md` for Architect disposition.
- Risk: long terms overflow on mobile.
  - Mitigation: dedicated e2e mobile no-overflow check and normal wrapping styles.
- Risk: existing visual evidence becomes stale.
  - Mitigation: refresh screenshot evidence or record replacement focused evidence.
- Risk: structured union affects many manual block render paths.
  - Mitigation: add a narrow union member and keep existing `kind: "list"` unchanged.

## Handoff

Implementation Agent should implement this as one focused PR slice unless Orchestrator assigns otherwise. The slice should modify only the glossary data/model/renderer/styles/tests/docs/evidence necessary to satisfy this feature.
