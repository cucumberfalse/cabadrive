# Spec: Manual Glossary Term Translations

## Architect Scope

This Architect assignment plans feature `032-term-translations` only. Architect writes only `spec.md`, `plan.md`, and `tasks.md` under `specs/032-term-translations/`.

- Assigned worktree: `/Users/chap/devel/cabadrive-worktrees/032-term-translations`.
- Assigned branch: `codex/032-term-translations`.
- Verified latest-main base: `origin/main` at `51e42f657d867fb802bbe3a68591b6008b45a60f`.
- Starting state: `feature-request.md` exists and the current manual glossary stores list rows as plain `itemsRu` strings.
- Parallel work may exist. Preserve sibling worktrees, branches, commits, PRs, dirty diffs, and process memory.

## Goal

Update the interactive `Руководство` glossary so each Spanish glossary term remains a visible source anchor, receives a concise Russian translation in parentheses immediately after the term, and is visually distinguished like a term label rather than blending into the definition text.

The result must stay native, selectable, accessible, responsive, local-first, and consistent across all current front-glossary blocks.

## User Story

As a Russian-speaking learner with low Spanish, I want glossary rows to show the Spanish term, a short Russian translation in parentheses, and the definition, so I can recognize exam/source terms quickly while still reading the full Russian explanation.

## Scope

In scope:

- `Руководство` -> `Глоссарий` / source `Glosario`.
- Current front-glossary blocks:
  - `glossary-a-b`
  - `glossary-b-c`
  - `glossary-d-i`
  - `glossary-m-p`
  - `glossary-r-v`
- All current front-glossary term rows, currently 75 rows.
- Structured glossary row data with separate Spanish term, Russian parenthesized translation, and Russian definition fields.
- Rendering and styling that emphasize the Spanish term label while keeping normal wrapping and text selection.
- Focused tests and visual/verification evidence for content, semantic emphasis, accessibility, responsive behavior, and local-first/manual-guide contracts.
- Durable documentation updates if implementation changes the manual guide content model or introduces a durable glossary style token.

Out of scope:

- Retyping or retranslating the full manual outside the front glossary.
- Changing practice questions, `Словарь`, `Материалы`, `Источники`, exam flow, storage, backend, or Docker runtime behavior.
- Adding runtime PDF viewing, remote assets/fonts, network fetches, analytics, backend endpoints, or live AI.
- Hiding or replacing Spanish source terms with Russian-only labels.

## Architecture Decision

Implementation must prefer an explicit structured glossary item model over ad hoc string parsing.

Recommended model:

```ts
export type ManualGuideGlossaryItem = {
  id: string;
  termEs: string;
  translationRu: string;
  definitionRu: string;
};
```

Recommended block shape:

```ts
{
  id: "glossary-a-b",
  kind: "glossary-list",
  titleRu: "A-B",
  sourceTextEs: "...",
  items: ManualGuideGlossaryItem[]
}
```

The renderer should have a dedicated branch for `kind === "glossary-list"` and must not infer term/definition boundaries by splitting strings on `:` at render time.

## Rendering Requirements

- Render each glossary row as one list item in the existing manual document flow.
- Render the Spanish term in a semantic emphasis element, preferably `<strong className="manual-glossary-term" lang="es">`.
- Render the Russian translation immediately after the term in parentheses, with `lang="ru"` where feasible.
- Render the definition after a colon or equivalent separator, with `lang="ru"` where feasible.
- Keep all visible learner text selectable/copyable DOM text.
- Do not use image text, `user-select: none`, `pointer-events: none`, fixed no-wrap labels, or layout that clips/overlaps text.
- Preserve current source order, block headings, Spanish accents, Spanish source terms, and exam-useful legal/numeric details.
- Use a calm source-like visual treatment: strong term weight and/or source/translation blue accent is acceptable; decorative chips/cards or oversized styling are not.
- Avoid awkward duplication when the existing definition begins with the same Russian word. Example: use `Acera (тротуар): сектор общественной дороги...`, not `Acera (тротуар): тротуар, сектор...`.

## Translation Requirements

- Every current glossary item must have a non-empty `translationRu`.
- Translation text must be concise, natural Russian, and learner-facing.
- Translation text must not be a placeholder, draft wrapper, transliteration-only value, or Spanish term repeated in Russian field.
- Translation text may use a slash only when two common Russian equivalents are genuinely useful for the learner.
- Existing definitions may be lightly edited to avoid duplicate leading translations, but must preserve the original meaning and ticket-critical details.
- The A-B rows visible in the user screenshot must include parenthesized translations for:
  - `Accidente de tránsito`
  - `Acera`
  - `Adelantamiento`
  - `Arteria`
  - `Arterias multicarriles`
  - `Automotor`
  - `Automóvil`
  - `Autopista`
  - `Avenida`
  - `Baliza`
  - `Banquina`
  - `Bicicleta`

## Acceptance Criteria

1. Given the learner opens `Руководство` -> `Глоссарий`, every current front-glossary row shows `Spanish term (Russian translation): Russian definition`.
2. Given a row is rendered, the Spanish term is visually emphasized and selectable, not plain indistinguishable leading text.
3. Given the A-B screenshot terms are inspected, all listed A-B terms have parenthesized Russian translations immediately after the Spanish term.
4. Given all front-glossary blocks are inspected, the same structured term/translation/definition treatment is applied to `A-B`, `B-C`, `D-I`, `M-P`, and `R-V`.
5. Given existing definitions include legal or numeric details, those details remain present, including avenue widths, stop/detention duration, vehicle capacity, speed/engine thresholds, and named fast roads.
6. Given the glossary data is inspected, current front-glossary term rows are explicit structured records, not opaque colon-delimited strings used by the renderer.
7. Given the renderer is inspected, it does not parse terms from strings by splitting on `:`.
8. Given the DOM is inspected, Spanish terms have `lang="es"` where feasible and Russian translations/definitions have `lang="ru"` where feasible.
9. Given mobile and desktop layouts are checked, glossary rows wrap naturally with no horizontal document overflow, clipping, overlap, or unselectable text.
10. Given local-first/manual-guide validation runs, no runtime PDF viewer, remote assets/fonts, runtime fetch, backend endpoint, analytics, live AI, or image-only text is introduced.
11. Given visual/manual-guide evidence is current, front-glossary screenshots or equivalent focused evidence reflect the new term/translation treatment.

## Negative Scenarios

- Adding translations only to metadata without rendering them.
- Updating only `A-B` while leaving the rest of the current glossary in the old plain format.
- Rendering `Acera (тротуар): тротуар, ...` style duplication without a deliberate wording reason.
- Hiding, replacing, or de-emphasizing Spanish terms.
- Styling terms as unselectable images, badges that clip text, or fixed-width labels.
- Runtime parsing that breaks on terms or definitions containing colons, slashes, commas, accents, or parenthetical text.
- Removing source order, Spanish accents, legal/numeric details, or source headings.
- Adding unrelated product behavior, remote/runtime services, or PDF/manual viewer behavior.

## Implementation Requirements

- Update `src/data/manualGuide.ts` types to include a structured glossary list block and glossary item type.
- Update `src/data/manual-sections/front-glossary.ts` to convert all five glossary blocks from `itemsRu` strings to structured records.
- Use stable item IDs, preferably derived from the existing block and normalized term, for test keys and future maintainability.
- Update `src/App.tsx` manual guide renderer with a dedicated glossary-list branch.
- Update `src/styles.css` with focused classes for glossary row, term, translation, and definition styling.
- Update `src/data/manualGuide.ts` style token registry and `frontGlossarySection.styleTokenFamilies` if a durable glossary token family is introduced.
- Update `docs_project/project/frontend/manual-conversion-guidelines.md` and/or `docs_project/project/frontend/design-system.md` if the structured glossary model or style pattern becomes durable guidance for future manual sections.
- Update front-glossary visual evidence notes/screenshots in `src/data/manual-sections/front-glossary.ts` and the section registry if implementation changes the evidence meaning.
- Preserve all sibling work and do not touch root/sibling worktrees.

## Review Requirements

Review Agent must check:

- The implementation follows Orchestrator/Analyst/Architect/Implementation boundaries and keeps complete feature memory.
- No brittle string parsing is used for glossary term rendering.
- All current front-glossary rows are covered, not only the screenshot rows.
- Russian translations are concise and natural, and definitions still retain legal/numeric details.
- Term emphasis is semantic/selectable and accessible, with correct language boundaries where feasible.
- Mobile/desktop layout evidence covers wrapping and no overflow.
- Durable docs/evidence were updated if the model/style changed.
- No unrelated app, source-reader, PDF, backend, or remote-runtime changes were bundled.

## Test And Verification Requirements

Minimum focused verification before PR handoff:

- `node --test tests/content-manual-guide-chapters.test.mjs`
- `pnpm run validate:manual-guide`
- `pnpm run validate:content`
- `pnpm run test`
- `pnpm run build`
- Focused Playwright coverage for `#manual-section-front-glossary` on desktop and mobile, either through `pnpm run test:e2e` or a targeted Playwright command recorded in `tasks.md`.
- `node scripts/check-feature-memory.mjs --worktree`
- `git diff --check`

Recommended focused test additions:

- Content test proves `front-glossary.ts` uses `kind: "glossary-list"` records with `termEs`, `translationRu`, and `definitionRu`.
- Content test proves all five glossary blocks contain only structured rows and all rows have non-empty translations.
- Content test proves screenshot-visible A-B terms have expected parenthesized translation rendering data.
- Renderer/source test proves the manual guide renderer contains a dedicated glossary branch and does not split glossary strings at render time.
- E2E test opens `/#manual-section-front-glossary`, checks examples such as `Acera (тротуар):`, `Automóvil (...)`, and `Vía rápida (...)`, checks `.manual-glossary-term[lang="es"]`, checks Russian translation/definition `lang="ru"`, and checks no horizontal overflow/clipping on mobile.

## Process Memory

### Decisions

- Decision: scope covers all current front-glossary term rows, not only the screenshot-visible `A-B` block.
- Decision: use structured glossary records and a dedicated renderer branch rather than parsing colon-delimited strings.
- Decision: emphasize the Spanish term itself while rendering the Russian translation close to it in parentheses.
- Decision: definitions may be lightly reworded to avoid duplicate first words, but content meaning/details must remain.

### Dead Ends

- None during Architect planning.

### Known Issues

- Resolved during implementation: context-sensitive terms `Baliza`, `Ciclorodado`, `Detención`, `Estacionamiento`, `Sobrepaso`, `Tránsito`, and `Vía rápida` received concise learner-facing translations and are covered by focused content/E2E evidence.
- Existing front-glossary screenshot paths remain recorded as visual evidence; focused Playwright and browser DOM/layout evidence supersede old wording for the new structured term/translation treatment.
- No unresolved known issues remain at final Architect validation.

### Implementation Agent Feedback

- None. Implementation Agent reported no need to diverge from the structured model, no unresolved translation uncertainty, and no evidence-refresh blocker requiring Architect disposition.

### Final Architect Validation

- Effective content head: a3302746b4ffb6eb8fb642ed60a49ab79b79bde6
- Architect validation pass: passed
- Final Architect validation completed at: 2026-06-05T00:34:48-03:00
- Architect validated effective content head: a3302746b4ffb6eb8fb642ed60a49ab79b79bde6
- Architect return count: 0.
- Architect final validation gaps: none.
- Final-validation scope confirmed PR #197 / `codex/032-term-translations` current head `06f1d38cf5cd9d07420deb4404ba323032142cad`; commits after the effective content head touch only `specs/032-term-translations/tasks.md` and are process-evidence-only.
- Required checks were observed green read-only during final validation: `baseline-checks`, `docker-validation`, `guard`, `AI Review`, and `osv-scan`.
- Review Agent result considered: no findings reported for current head `06f1d38cf5cd9d07420deb4404ba323032142cad`.
