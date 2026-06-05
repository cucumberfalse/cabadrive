# Tasks: Manual Glossary Term Translations

## Status Legend

- `[x]` Complete
- `[ ]` Pending

## Architect Planning Tasks

- [x] T001 Confirm Architect assignment, worktree `/Users/chap/devel/cabadrive-worktrees/032-term-translations`, branch `codex/032-term-translations`, and verified base `origin/main` at `51e42f657d867fb802bbe3a68591b6008b45a60f`.
- [x] T002 Preserve role boundary: Architect edits only `spec.md`, `plan.md`, and `tasks.md` in `specs/032-term-translations/`.
- [x] T003 Read `specs/032-term-translations/feature-request.md`.
- [x] T004 Read repository/project memory relevant to local-first frontend, manual conversion, design system, feature inventory, and learning/manual flows.
- [x] T005 Inspect current glossary source in `src/data/manual-sections/front-glossary.ts`.
- [x] T006 Inspect manual guide types in `src/data/manualGuide.ts`.
- [x] T007 Inspect manual guide rendering in `src/App.tsx`.
- [x] T008 Inspect relevant manual styles in `src/styles.css`.
- [x] T009 Inspect current manual guide validation/test surfaces.
- [x] T010 Record implementation direction: structured glossary item model and dedicated renderer branch, not ad hoc string parsing.
- [x] T011 Record scope decision: all current front-glossary rows across five blocks, not only screenshot-visible A-B.
- [x] T012 Define acceptance, negative scenarios, implementation requirements, review requirements, and verification requirements.

## Implementation Tasks

- [x] T013 Confirm Orchestrator assignment, implementation worktree/branch/PR slice, latest-main base SHA, and parallel-work preservation warning before editing product files.
- [x] T014 Read `feature-request.md`, `spec.md`, `plan.md`, and `tasks.md` before implementation edits.
- [x] T015 Record baseline `git status --short --branch` in the assigned implementation worktree.
- [x] T016 Add a structured glossary item model to `src/data/manualGuide.ts`, with explicit `termEs`, `translationRu`, and `definitionRu` fields.
- [x] T017 Add a dedicated `glossary-list` block shape or equivalent explicit glossary block model to `ManualGuideContentBlock`.
- [x] T018 Convert `front-glossary.ts` block `glossary-a-b` from plain `itemsRu` strings to structured glossary items.
- [x] T019 Convert `front-glossary.ts` block `glossary-b-c` from plain `itemsRu` strings to structured glossary items.
- [x] T020 Convert `front-glossary.ts` block `glossary-d-i` from plain `itemsRu` strings to structured glossary items.
- [x] T021 Convert `front-glossary.ts` block `glossary-m-p` from plain `itemsRu` strings to structured glossary items.
- [x] T022 Convert `front-glossary.ts` block `glossary-r-v` from plain `itemsRu` strings to structured glossary items.
- [x] T023 Review every `translationRu` for natural concise Russian wording; record any uncertain term in Implementation Agent feedback instead of guessing silently.
- [x] T024 Edit `definitionRu` values only as needed to avoid duplicate translation wording while preserving legal, numeric, source, and exam-useful details.
- [x] T025 Update `ManualGuideSectionContentView` in `src/App.tsx` with a dedicated glossary renderer.
- [x] T026 Render Spanish terms with semantic/source-like emphasis, selectable DOM text, and `lang="es"` where feasible.
- [x] T027 Render Russian parenthesized translations and definitions with `lang="ru"` where feasible.
- [x] T028 Add focused glossary styles in `src/styles.css` that preserve wrapping, selection, and the existing manual document rhythm.
- [x] T029 Update manual guide style token registry and `frontGlossarySection.styleTokenFamilies` if a durable glossary style token is introduced.
- [x] T030 Update durable docs if the structured glossary row model or style treatment changes future manual-conversion guidance.
- [x] T031 Refresh or supersede front-glossary visual evidence notes/screenshots so evidence reflects the new term/translation treatment.
- [x] T032 Preserve generic manual `kind: "list"` rendering for non-glossary lists.
- [x] T033 Ensure no runtime PDF viewer, remote asset/font, runtime fetch, backend endpoint, analytics, live AI, or image-only text is introduced.

## Test Tasks

- [x] T034 Add/update content tests proving all five front-glossary blocks use structured glossary rows.
- [x] T035 Add/update content tests proving all 75 current rows have non-empty `termEs`, `translationRu`, and `definitionRu`.
- [x] T036 Add/update tests proving the screenshot-visible A-B terms have parenthesized Russian translations in the data/rendered output.
- [x] T037 Add/update source/renderer tests proving glossary rendering uses a dedicated structured branch and not string splitting on `:`.
- [x] T038 Add/update E2E tests for `/#manual-section-front-glossary` on desktop and mobile.
- [x] T039 E2E verifies examples such as `Acera (тротуар):`, a long term, and `Vía rápida (...)`.
- [x] T040 E2E verifies term emphasis DOM/class, `lang="es"` terms, `lang="ru"` Russian support, selectable text, and no horizontal overflow/clipping.
- [x] T041 Run `node --test tests/content-manual-guide-chapters.test.mjs`.
- [x] T042 Run `pnpm run validate:manual-guide`.
- [x] T043 Run `pnpm run validate:content`.
- [x] T044 Run `pnpm run test`.
- [x] T045 Run `pnpm run build`.
- [x] T046 Run focused Playwright or `pnpm run test:e2e`; record exact command and result.
- [x] T047 Run `node scripts/check-feature-memory.mjs --worktree`.
- [x] T048 Run `git diff --check`.

## Review And PR Tasks

- [x] T049 Update this `tasks.md` with implementation decisions, verification evidence, known issues, dead ends, and Implementation Agent feedback.
- [x] T050 Stage, commit, push, and open a ready PR only if assigned to Implementation Agent by Orchestrator.
- [x] T051 Review Agent checks complete feature memory and role-boundary compliance.
- [x] T052 Review Agent checks coverage, semantics, translation quality, styling/accessibility, local-first constraints, and evidence freshness.
- [x] T053 No routed review findings remain for Implementation Agent to address.

## Cycle PR Set

| Purpose | Branch / PR | Base SHA | Head SHA | Status | Included in final validation |
| --- | --- | --- | --- | --- | --- |
| Analyst intake and Architect planning | `codex/032-term-translations` / PR [#197](https://github.com/cucumberfalse/cabadrive/pull/197) | `51e42f657d867fb802bbe3a68591b6008b45a60f` | current PR head `e8b2df62f0a2991d1f8092ac0708bfe07f1640bd` | intake/planning included in ready PR and covered by final Architect validation; later commits are process-evidence-only | yes |
| Implementation slice | `codex/032-term-translations` / PR [#197](https://github.com/cucumberfalse/cabadrive/pull/197) | `51e42f657d867fb802bbe3a68591b6008b45a60f` | effective content head `a3302746b4ffb6eb8fb642ed60a49ab79b79bde6`; current PR head `e8b2df62f0a2991d1f8092ac0708bfe07f1640bd` includes later process-evidence-only commits | ready PR open; required checks green at prior review/final-validation observations; Review Agent reported no findings | yes |

## Decisions

- Decision: Apply the translation/emphasis treatment to all current front-glossary rows across `A-B`, `B-C`, `D-I`, `M-P`, and `R-V`.
- Decision: Use an explicit structured glossary item model rather than parsing colon-delimited strings.
- Decision: Emphasize the Spanish term itself and render the Russian translation in parentheses immediately after it.
- Decision: Keep generic manual list rendering unchanged for non-glossary blocks.
- Decision: Definitions may be lightly adjusted to avoid duplicated translation words, but ticket-critical legal/numeric details must remain.
- Decision: Add durable `manual-glossary` style family guidance because the structured glossary row model is reusable for future manual glossary/list conversions.
- Decision: Supersede the old front-glossary screenshot wording with focused DOM/Playwright evidence for structured term/translation rows; existing source/runtime screenshot paths remain recorded as manual visual evidence.

## Dead Ends

- None during Architect planning.
- Implementation retry: initial `pnpm run validate:content` failed before dependency install because `node_modules` was missing and `pdf-parse/lib/pdf-parse.js` could not be resolved. `pnpm install --frozen-lockfile` restored locked dependencies, and the rerun passed.
- Browser visual retry: in-app Browser screenshot capture timed out, so the focused browser check recorded DOM/layout proof instead. The automated Playwright desktop/mobile run captured the route successfully.

## Known Issues

- No unresolved known issues.
- Context-sensitive translation review evidence: `Baliza`, `Ciclorodado`, `Detención`, `Estacionamiento`, `Sobrepaso`, `Tránsito`, and `Vía rápida` now have concise learner-facing `translationRu` values and are covered by content/E2E assertions where high risk. Resolution: resolved by implementation evidence; no further Architect disposition needed.
- Front-glossary visual evidence compatibility: existing screenshot paths remain in `visualEvidence`, and focused Playwright plus in-app Browser DOM evidence supersede old wording for the new structured term/translation treatment. Resolution: superseded by current verification evidence.

## Implementation Agent Feedback

- No unresolved Implementation Agent feedback.

## Verification Evidence

- Effective content head: a3302746b4ffb6eb8fb642ed60a49ab79b79bde6
- Current-PR-head read-only guard: effective content head a3302746b4ffb6eb8fb642ed60a49ab79b79bde6; current PR head e8b2df62f0a2991d1f8092ac0708bfe07f1640bd; post-effective-head diff paths are specs/032-term-translations/feature-request.md, specs/032-term-translations/spec.md, and specs/032-term-translations/tasks.md; the diff after the effective content head is evidence-only final-validation process memory and no non-evidence content changed.
- Architect read-only context gathered on `2026-06-05`:
  - `git rev-parse HEAD` returned `51e42f657d867fb802bbe3a68591b6008b45a60f`.
  - Branch is `codex/032-term-translations`.
  - Current source uses plain `itemsRu` strings in `src/data/manual-sections/front-glossary.ts`.
  - Manual guide renderer maps generic list rows to plain `<li>{item}</li>`.
  - Current front-glossary section source pages are `5-11`; screenshot evidence paths exist under `content/validation/manual-guide/front-glossary/`.
- Implementation Agent startup evidence on `2026-06-05` before product-file edits:
  - `pwd` returned `/Users/chap/devel/cabadrive-worktrees/032-term-translations`.
  - `git status --short --branch` returned `## codex/032-term-translations...origin/main` and untracked `specs/032-term-translations/`.
  - `git rev-parse HEAD` returned `51e42f657d867fb802bbe3a68591b6008b45a60f`.
  - Orchestrator assignment confirmed the Analyst-created handoff worktree/branch as the single implementation PR slice and warned that parallel work may exist.
- Implementation evidence on `2026-06-05`:
  - Added `ManualGuideGlossaryItem` and `kind: "glossary-list"` in `src/data/manualGuide.ts`.
  - Converted all five front-glossary blocks (`glossary-a-b`, `glossary-b-c`, `glossary-d-i`, `glossary-m-p`, `glossary-r-v`) to 75 structured rows with stable IDs, `termEs`, `translationRu`, and `definitionRu`.
  - Added dedicated `ManualGuideSectionContentView` renderer branch for `glossary-list`; no renderer colon-splitting is used.
  - Added `.manual-glossary-*` styles with selectable DOM text, semantic term emphasis, and wrapping protection.
  - Added durable manual conversion guidance for structured glossary rows.
  - Updated `frontGlossarySection.visualEvidence.notes` and style token families for the new structured treatment.
- Verification evidence on `2026-06-05`:
  - `node --test tests/content-manual-guide-chapters.test.mjs` passed: 93/93 tests.
  - `pnpm run validate:manual-guide` passed: checker status `pass`, 50 implemented sections checked.
  - `pnpm run validate:content` initially failed before dependency install due missing `node_modules`/`pdf-parse`; after `pnpm install --frozen-lockfile`, `pnpm run validate:content` passed.
  - `pnpm run test` passed: 403/403 tests.
  - `pnpm run build` passed; Vite emitted the existing large chunk warning and service worker generation cached 1844 assets.
  - `pnpm exec tsc --noEmit` passed.
  - `pnpm exec playwright test tests/e2e/app.spec.ts -g "Manual guide front glossary renders structured term translations responsively" --project=chromium --project=mobile` passed: 2/2 tests.
  - In-app Browser DOM check against `http://127.0.0.1:4399/#manual-section-front-glossary` passed: 5 glossary blocks, 75 glossary rows, `Acera (тротуар): ...`, `Vía rápida (скоростная дорога): ...`, `STRONG` term tag with `lang="es"`, Russian translation/definition `lang="ru"`, `overflow-wrap: anywhere`, and no section/document overflow.
  - `node scripts/check-feature-memory.mjs --worktree` passed.
  - `git diff --check` passed.
- PR evidence on `2026-06-05`:
  - Commit `a3302746b4ffb6eb8fb642ed60a49ab79b79bde6` pushed to `origin/codex/032-term-translations`.
  - Ready PR opened against `main`: https://github.com/cucumberfalse/cabadrive/pull/197.
  - Post-PR branch updates are process-memory evidence only.
  - Final-validation evidence-only commit `e8b2df62f0a2991d1f8092ac0708bfe07f1640bd` changed only `specs/032-term-translations/feature-request.md`, `specs/032-term-translations/spec.md`, and `specs/032-term-translations/tasks.md`.
  - Review Agent reported no findings for PR #197 at head `06f1d38cf5cd9d07420deb4404ba323032142cad` and posted the no-findings comment: https://github.com/cucumberfalse/cabadrive/pull/197#issuecomment-4627831171.
  - Final Architect validation read-only `gh pr checks 197 --repo cucumberfalse/cabadrive` observed all required checks passing: `baseline-checks`, `docker-validation`, `guard`, `AI Review`, and `osv-scan`.
- Final Architect validation evidence on `2026-06-05T00:34:48-03:00`:
  - Startup guard in `/Users/chap/devel/cabadrive-worktrees/032-term-translations`: `pwd` returned the assigned worktree, `git status --short --branch` returned `## codex/032-term-translations...origin/codex/032-term-translations`, and `git rev-parse HEAD` returned current PR head `06f1d38cf5cd9d07420deb4404ba323032142cad`.
  - `git diff --name-status a3302746b4ffb6eb8fb642ed60a49ab79b79bde6..HEAD` showed only `M specs/032-term-translations/tasks.md`; the post-effective-head diff is process-evidence-only.
  - Architect inspected the structured glossary model, all-five-block source conversion, dedicated renderer branch, glossary styles, focused content/E2E assertions, durable manual conversion guidance, Review Agent result, required check state, open task state, process memory, and implementation evidence.

## Final Validation Evidence

- Effective content head: a3302746b4ffb6eb8fb642ed60a49ab79b79bde6
- Architect validation: passed at 2026-06-05T00:34:48-03:00 for effective content head a3302746b4ffb6eb8fb642ed60a49ab79b79bde6
- Architect validated effective content head: a3302746b4ffb6eb8fb642ed60a49ab79b79bde6
- Architect return count: 0
- Analyst validation: passed at 2026-06-05T00:39:21-03:00 for effective content head a3302746b4ffb6eb8fb642ed60a49ab79b79bde6
- Analyst validated effective content head: a3302746b4ffb6eb8fb642ed60a49ab79b79bde6
- Analyst return count: 0
- Current-PR-head read-only guard: effective content head a3302746b4ffb6eb8fb642ed60a49ab79b79bde6; current PR head e8b2df62f0a2991d1f8092ac0708bfe07f1640bd; post-effective-head diff paths are specs/032-term-translations/feature-request.md, specs/032-term-translations/spec.md, and specs/032-term-translations/tasks.md; diff after the effective content head is evidence-only final-validation process memory and no non-evidence content changed.
- Final-validation evidence-only commit: e8b2df62f0a2991d1f8092ac0708bfe07f1640bd records role/process evidence only in specs/032-term-translations/feature-request.md, specs/032-term-translations/spec.md, and specs/032-term-translations/tasks.md
- Limit escalation: none
- Analyst feedback Architect disposition: no unresolved Implementation Agent feedback; no Architect follow-up required

## Final Architect Validation

- Effective content head: a3302746b4ffb6eb8fb642ed60a49ab79b79bde6
- Architect validation pass: passed
- Final Architect validation completed at: 2026-06-05T00:34:48-03:00
- Architect validated effective content head: a3302746b4ffb6eb8fb642ed60a49ab79b79bde6
- Architect return count: 0.
- Architect final validation gaps: none.
- No unresolved Implementation Agent feedback remains.
- No Architect return was needed.

## Final Analyst Validation

- Analyst validation pass: passed
- Final Analyst validation completed at: 2026-06-05T00:39:21-03:00
- Analyst validated effective content head: a3302746b4ffb6eb8fb642ed60a49ab79b79bde6
- Analyst return count: 0.
- Analyst final validation gaps: none.
- Final Analyst validation passed after final Architect validation against the same effective content head.
- This update records final-validation evidence only in process memory; no non-evidence content changed.
