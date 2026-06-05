# Feature Request: Manual Glossary Term Translations

## Intake Metadata

- Feature ID: `032-term-translations`
- Intake role: Analyst
- Assigned worktree: `/Users/chap/devel/cabadrive-worktrees/032-term-translations`
- Assigned branch: `codex/032-term-translations`
- Verified base provided by Orchestrator: `origin/main` at `51e42f657d867fb802bbe3a68591b6008b45a60f`
- Local head observed during intake: `51e42f657d867fb802bbe3a68591b6008b45a60f`
- Parallel-work warning: parallel work may exist; sibling worktrees, branches, commits, PRs, dirty diffs, and process memory must be preserved.
- Intake artifact scope: this Analyst intake creates only this `feature-request.md`; Architect-owned `spec.md`, `plan.md`, and `tasks.md` are intentionally not created by Analyst.
- Existing prefix check: the maximum existing numeric prefix under `specs/` was verified as `031`; `032-term-translations` was available.

## Original User Request

The original request was given in Russian:

> ты оркестратор
> в скобках к терминам добавь перевод
> термины как-то выделить надо, как в оригинале

The user also provided a screenshot of the `Руководство` glossary section `A-B`. In the screenshot, glossary rows render Spanish source terms such as `Accidente de tránsito`, `Acera`, `Adelantamiento`, `Arteria`, `Arterias multicarriles`, `Automotor`, `Automóvil`, `Autopista`, `Avenida`, `Baliza`, `Banquina`, and `Bicicleta` followed by Russian definitions. The terms currently appear as leading plain text before a colon.

Normalized intake reading:

- Add a Russian translation in parentheses next to each Spanish glossary term.
- Visually distinguish the Spanish glossary term itself in a way that resembles the original/source styling.
- Preserve the current Russian explanatory definitions after the term label.
- Keep the result useful for a Russian-speaking learner with low Spanish while retaining Spanish source terms as visible primary anchors.

## Request Classification

This is a repository-changing content and presentation polish request for the interactive Russian manual glossary. It should be represented by a new feature memory because it changes user-visible content/rendering in `Руководство`.

The request is small enough to remain one coherent work cycle. It does not need external research for intake because the target surface and current source data are present in the repository and the user provided the desired visual/content change.

## Project Context

- Cabadrive is a local-first React/TypeScript/Vite web trainer for Russian-speaking drivers preparing for the CABA theory exam.
- There is no runtime backend. Manual content and assets must remain local/offline after build.
- Official Spanish terms stay visible and primary; Russian translations and explanations are unofficial learning support.
- The current user-facing manual destination is `Руководство`, a native interactive Russian web document surface organized by the official source `Índice`.
- The PDF/source material is a source/reference/mockup only. Runtime output must remain native HTML/CSS/SVG/local assets, not a PDF viewer, iframe/object/embed, full-page raster background, image-only page, remote fetch, backend endpoint, or live AI output.
- Manual conversion guidance requires Russian learner text to remain selectable/copyable DOM or SVG text, with natural Russian wording and preserved ticket-critical legal/numeric/source details.
- The current glossary implementation lives in `src/data/manual-sections/front-glossary.ts`; glossary list blocks currently store `itemsRu` as strings like `Acera: тротуар, ...`.
- The current manual list renderer in `src/App.tsx` maps each `itemsRu` string to a plain `<li>`, so the leading Spanish term has no separate semantic/style hook today.
- Existing style tokens include `manual-prose`, `manual-section-heading`, `manual-legal-detail`, and `manual-front-matter`. The glossary currently uses front-matter/list styling inside the manual guide section shell.

## Target Surface

Primary target:

- `Руководство` -> `Глоссарий` / source title `Glosario`, especially the `A-B` glossary block shown by the user.

Likely source files and checks for Architect/Implementation consideration:

- `src/data/manual-sections/front-glossary.ts`
- `src/data/manualGuide.ts`
- `src/App.tsx`
- `src/styles.css`
- `tests/content-manual-guide-chapters.test.mjs`
- `tests/e2e/app.spec.ts`
- `scripts/manual-guide-source-fidelity.mjs`

Analyst does not prescribe whether implementation should use a new structured data shape, parser helper, rich text renderer, or another local pattern; Architect should choose the safest approach.

## Requested Outcome

The manual glossary should present each Spanish glossary term as a visually distinct term label, with a concise Russian translation in parentheses immediately after it, followed by the existing definition/explanation.

Example shape for the visible learner text:

- `Acera (тротуар): ...`
- `Adelantamiento (опережение): ...`
- `Baliza (аварийный маячок / аварийная сигнализация): ...`

The exact Russian translation for each term should be natural, learner-facing, and consistent with the existing definition. When the definition already starts with the translation, implementation may adjust wording to avoid awkward duplication while preserving the full legal/exam-relevant meaning.

## Scope

In scope:

- Add parenthesized Russian translations next to Spanish glossary terms in the manual glossary.
- Emphasize the Spanish term label itself with a source-like visual treatment, such as bold/strong term styling or a reusable glossary-term class, while keeping the text selectable.
- Apply the treatment consistently to the front-matter glossary entries. At minimum this must cover the `A-B` block shown by the user; by default it should cover all current `front-glossary` list blocks (`A-B`, `B-C`, `D-I`, `M-P`, and `R-V`) so the glossary does not become inconsistent.
- Preserve Spanish terms, accents, punctuation, source order, section headings, and existing Russian definitions unless a wording adjustment is needed to place the parenthesized translation cleanly.
- Preserve local-first behavior and the existing `Руководство` native document model.
- Add or update focused tests/evidence so the new term/translation presentation is verifiable.
- Update durable docs only if the implementation changes the manual glossary content model, conversion guidance, style tokens, or validation expectations in a durable way.

Out of scope:

- Analyst does not write `spec.md`, `plan.md`, `tasks.md`, implementation code, tests, assets, commits, pushes, PRs, reviews, or merge actions.
- This request does not ask to retranslate the full manual, change unrelated manual sections, change practice questions, change vocabulary/topic materials, change the official-source reader, introduce a backend, or change Docker/runtime behavior.
- This request does not require external-source research unless Architect or Implementation finds a content-quality blocker for a specific translation.

## Acceptance Expectations

- In `Руководство` -> `Глоссарий`, Spanish glossary terms render with visible emphasis/source-like distinction rather than as indistinguishable plain leading text.
- Each Spanish glossary term has a Russian translation in parentheses immediately next to the term before the definition separator.
- The `A-B` terms visible in the user's screenshot include parenthesized Russian translations: `Accidente de tránsito`, `Acera`, `Adelantamiento`, `Arteria`, `Arterias multicarriles`, `Automotor`, `Automóvil`, `Autopista`, `Avenida`, `Baliza`, `Banquina`, and `Bicicleta`.
- By default, every current `front-glossary` term row across `A-B`, `B-C`, `D-I`, `M-P`, and `R-V` receives the same term-label and parenthesized-translation treatment unless Architect records a narrower justified scope.
- Existing Russian definitions remain present, readable, and exam-useful; legal/numeric details such as avenue widths, detención duration, vehicle capacities, and named fast roads are not removed.
- Spanish source terms remain visible and correctly accented where currently available.
- Russian translations are concise and natural, not draft wrappers, transliterations, or Spanish-with-Russian framing.
- The emphasized term treatment is accessible and responsive: no overlapping text, no horizontal clipping in normal prose, no `user-select: none` on learner text, and no reliance on image-only text.
- The change remains local-first/offline and does not add runtime PDF viewing, remote assets, runtime network fetches, backend endpoints, analytics, live AI, or remote fonts.
- Focused verification covers at least content/rendering for parenthesized term translations and visual/semantic emphasis, plus the relevant manual-guide/local-first regressions selected by Architect.

## Negative Scenarios

- Adding translations only in source metadata but not rendering them to the learner.
- Adding translations to `A-B` while leaving the rest of the visible glossary in a conflicting format without Architect disposition.
- Hiding or replacing Spanish terms with Russian-only labels.
- Leaving terms as plain indistinguishable text when the user asked to highlight them like the original.
- Duplicating translations awkwardly, for example `Acera (тротуар): тротуар, ...`, without a deliberate wording decision.
- Removing existing definitions, legal details, source terms, accents, list order, or section headings.
- Styling the term with image text, unselectable text, nonresponsive fixed layout, or a treatment that causes mobile/desktop overlap or clipping.
- Introducing a runtime PDF viewer, remote image/font, network request, backend endpoint, live AI call, or unrelated product behavior.

## Assumptions

- The screenshot corresponds to `src/data/manual-sections/front-glossary.ts`, block `glossary-a-b`, rendered inside the `Руководство` manual guide section.
- `к терминам` means the Spanish glossary terms at the beginning of each glossary row, not every Spanish phrase that appears inside a definition.
- `в скобках ... перевод` means a concise Russian term translation immediately after the Spanish term, before the colon/definition.
- `как в оригинале` means the Spanish term label should be visually emphasized/source-like. The exact styling should be chosen by Architect/Implementation based on the existing design system and source evidence.
- Applying the change across all current front-glossary term rows is assumed to better satisfy the user's intent than changing only the screenshot-visible `A-B` rows.
- No blocking user clarification is required for intake. Architect can record implementation-specific assumptions or dispositions if exact translation wording or style details need constraint.

## Risks

- The current data shape stores list items as plain strings, so adding semantic styling may require a data model or renderer adjustment rather than only text edits.
- Several definitions already start with the obvious Russian translation; implementation must avoid awkward duplication while preserving meaning.
- Some Spanish terms have context-dependent Russian equivalents, for example `Baliza`, `Arteria`, `Ciclorodado`, `Detención`, `Estacionamiento`, `Sobrepaso`, `Tránsito`, and `Vía rápida`.
- If only visible text is edited without tests, future glossary additions may regress to unstructured plain terms.
- A visually stronger term treatment could affect line wrapping on mobile because many terms are long.
- Overly decorative styling could conflict with the quiet manual-document visual system or make dense legal glossary content harder to scan.

## Open Questions

- What exact source-like emphasis should the implementation use for glossary terms: semantic `<strong>`, a dedicated class, a structured term component, or another established local style?
- Should the glossary data model be changed from plain `itemsRu` strings to structured term/translation/definition records for this section, or should a narrower rendering helper parse existing strings safely?
- Should every current front-glossary term receive a separately reviewed Russian translation in this feature, or should Architect intentionally scope implementation to the screenshot-visible `A-B` rows first?
- Are there specific source styling details from the original glossary PDF that should be copied exactly, or is a source-inspired local emphasis sufficient?

## Sources And Research

- No external research was used for intake.
- Repository context was read from `.specify/memory/constitution.md`, `docs_project/README.md`, `docs_project/project-idea.md`, `docs_project/project/frontend/frontend-docs.md`, `docs_project/project/backend/backend-docs.md`, `docs_project/project/feature-inventory.md`, `docs_project/screens/learning-and-exam-flows.md`, `docs/specify/README.md`, `docs_project/project/frontend/manual-conversion-guidelines.md`, and relevant source/test files.
- User-provided screenshot and original Russian request supplied the requested visible behavior.

## Analyst Handoff

This intake is ready for Orchestrator handoff to Architect. The request is to update the interactive manual glossary so Spanish terms remain visible and source-like/emphasized, Russian translations appear in parentheses immediately next to those terms, and existing Russian definitions remain readable, selectable, responsive, local-first, and exam-useful.

## Final Analyst Validation

- Analyst validation pass: passed
- Final Analyst validation completed at: 2026-06-05T00:39:21-03:00
- Analyst validated effective content head: a3302746b4ffb6eb8fb642ed60a49ab79b79bde6
- Analyst return count: 0, within the 5-return limit.
- Analyst final validation gaps: none.
- Validation scope: the final result satisfies the original Russian request in spirit and letter. The visible glossary treatment keeps Spanish terms as emphasized source-like labels, adds concise Russian translations in parentheses immediately after the terms, preserves Russian definitions and legal/numeric/source details, covers the screenshot-visible `A-B` terms, and applies the same structured treatment consistently across all five current front-glossary blocks.
- Evidence considered: required Architect final validation markers were present in `spec.md`; the current source contains 75 structured glossary rows with `termEs`, `translationRu`, and `definitionRu`; the renderer emits the term as `<strong lang="es">`, the translation and definition as Russian DOM text with `lang="ru"`, and the tests/browser evidence cover `Acera (тротуар):`, `Vía rápida (скоростная дорога):`, all five blocks, selectable text, and no overflow.

## Final Analyst Validation Notes

- Analyst validation pass: passed
- Final Analyst validation completed at: 2026-06-05T01:07:41-03:00
- Analyst validated effective content head: 6ac3e5889327f02bafd07ee479bab3eccfa1495f
- Analyst return count: 0
- Analyst validation evidence: original Russian request satisfied with emphasized Spanish glossary terms and Russian translations in parentheses across the front glossary.
