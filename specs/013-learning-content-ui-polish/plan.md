# Plan: Learning Content UI Polish

## Summary

Implement 013 as a narrow learner-facing polish slice over existing content and UI surfaces. The work should improve comprehension in `Материалы`, fix the hospital/health entrance parking-clearance teaching path, add targeted vocabulary/CABA-RF value, reduce repeated status noise, and expose ticket IDs in `Учить`. It must preserve the project's Spanish-primary contract and current `unofficial_b_fallback` truth.

This Architect pass creates only `spec.md`, `plan.md`, and `tasks.md`.

## Technical Context

- Frontend: React + TypeScript + Vite static SPA.
- Runtime: local-first, offline-capable static build; no backend in MVP.
- Content mode: `unofficial_b_fallback`.
- Current major surfaces:
  - `Учить` uses `QuestionCard`.
  - `Материалы` uses `TopicGuideView` and `TopicGuideTicketBlock`.
  - `CABA/RF` uses `GuideView` over `content/guide/ru.condensed-guide.json`.
  - `Словарь` uses `content/vocabulary/ru.vocabulary.json`.
- Current validation:
  - `scripts/validate-content.mjs`;
  - `scripts/content-translation-alignment.mjs`;
  - `scripts/content-topic-guide.mjs`.
- Translation evidence:
  - `content/validation/ru-translation-alignment.evidence.json` must be updated for any added or changed translation entries.
- Existing likely touched files for implementation:
  - `src/App.tsx`;
  - `src/styles.css`;
  - `src/data/content.ts` only if helper/type shape needs adjustment;
  - `content/translations/ru.translations.json`;
  - `content/validation/ru-translation-alignment.evidence.json`;
  - `content/guide/topic-study-guide.ru.json`;
  - `content/vocabulary/ru.vocabulary.json`;
  - `content/guide/ru.condensed-guide.json`;
  - `tests/e2e/app.spec.ts`;
  - relevant `tests/*.test.mjs` files if helper/content assertions are added;
  - `specs/013-learning-content-ui-polish/tasks.md`.

## Constitution Check

- Spec-first: satisfied by Analyst intake plus this Architect plan before implementation.
- Testable boundaries: satisfied through content validators, translation fingerprints, topic-guide tests, e2e UI assertions, and local build evidence.
- Test-first bias: implementation must add/update targeted tests alongside behavior changes and record any deferred test reason.
- Supervised verification: every acceptance criterion needs command, test, DOM, text-search, or screenshot evidence in `tasks.md`.
- PR-only workflow: implementation lands through a branch/PR; no direct merge to default branch.
- One worktree per task: future implementation must use the Orchestrator-assigned isolated worktree and preserve sibling worktrees.
- Deployability: no backend/runtime network dependency is introduced.
- Simplicity: use existing JSON content layers, maps, React components, and CSS patterns before introducing new abstractions.
- Process memory: `tasks.md` is the durable place for decisions, dead ends, known issues, verification, and Implementation Agent feedback.

## Architecture Decisions

### Materials Translations

Use `translationByQuestion` as the source for Russian translations in materials ticket blocks. Do not copy translation strings into JSX or topic-guide ticket blocks.

Recommended rendering order inside each materials ticket:

1. metadata row with ticket ID/category/jurisdiction, without per-ticket fallback-status chip;
2. canonical Spanish question block;
3. secondary Russian question translation block when available, or a concise missing-translation fallback;
4. image if present;
5. answers in canonical order, each with Spanish primary text, Russian answer translation when available, correct-answer marker, and guide answer explanation.

The fallback copy should be short, for example: "Русский перевод для этого билета еще не подготовлен; сверяйтесь с испанским текстом." Implementation may improve wording, but it must not look like an error or block reading.

### Translation Evidence

If implementation adds `b-fallback-028` and `b-fallback-412` to `content/translations/ru.translations.json`, it must add matching entries to `content/validation/ru-translation-alignment.evidence.json`.

Use the existing `buildTranslationAlignmentEvidenceEntry` helper or equivalent deterministic call path from `scripts/content-translation-alignment.mjs` to compute fingerprints. Reviewer/reviewedAt/notes should truthfully name the implementation review context; the date should be the actual content-review date.

Every translation entry must include:

- `questionId`;
- `questionTextRu`;
- complete `answerTranslations` for each canonical answer ID;
- disclaimer containing `Неофициальный`.

### Parking-Clearance Content

The parking-clearance topic already contains the relevant topic and tickets. Implementation should polish it rather than rewrite the whole topic.

Required target:

- teach `entrada de hospital / centro de salud -> 10 metros de cada lado de la entrada`;
- explain that `5 metros de cada lado de la entrada` is the trap/wrong value for `b-fallback-412`;
- keep `b-fallback-028` and `b-fallback-412` consistent;
- avoid overloading the hospital rule with school/bank/temple timing qualifications unless used as a brief bounded contrast and backed by existing source-trace expectations.

Recommended affected fields:

- `learningMaterialRu` paragraph that currently describes institution entrances;
- `spanishTerms` entries around `entrada`, `hospital`, `centro de salud`, `10 metros...`, and `5 metros...`;
- `tickets[].answerExplanations` for `b-fallback-028` and `b-fallback-412`;
- `trapNotes` entry about `5` vs `10`.

### Vocabulary Expansion

Use a scoped expansion rule:

- Add terms only when they are useful for the touched materials/CABA-RF polish and appear in canonical question/answer wording or affected guide content.
- Prioritize high-frequency or exam-risk terms, not generic Spanish.
- Add examples with existing `questionId` and exact Spanish snippet.
- Preserve validator compatibility.

Minimum recommended terms if not already covered:

- `entrada`;
- `centro de salud`;
- `hospital`;
- `estacionar`;
- `de cada lado`;
- any CABA/RF addition terms that are necessary to understand the added contrast.

Implementation may omit a term if it already exists with adequate wording and records that decision.

### CABA/RF Enrichment Or Repositioning

Keep `CABA/RF` compact and separate from `Материалы`.

Preferred approach:

- Audit current `content/guide/ru.condensed-guide.json`.
- Add only source-supported, exam-relevant contrasts likely to help Russian-speaking experienced drivers.
- Preserve current disclaimer semantics.
- If there is insufficient source support for meaningful enrichment within this slice, improve framing/status copy and record follow-up topics instead of adding unsupported content.

Potential contrast categories should come from existing validated guide/source material, such as local emergency/crash duties, documents/insurance/VTV, parking/clearances, pedestrian/school-zone behavior, exclusive lanes/Metrobus, or priority rules. Do not invent legal differences from memory.

### Disclaimer And Status Noise

The product should keep clear status context, but repeated chips inside every ticket block are noisy.

Implementation should:

- remove visible per-ticket `Статус: неофициальная B-практика` from `TopicGuideTicketBlock` metadata;
- keep the existing materials header/status area or equivalent section-level fallback label;
- keep source/footer context concise and non-repetitive;
- avoid removing `contentStatus`, validation fields, or machine-readable content-mode truth.

Do not remove the global/status-strip truth that the current questions are not a complete official GCBA bank.

### Ticket IDs In Learn

Add the current `question.id` to `Учить` question cards. Preferred placement is the existing question metadata row, near category/jurisdiction/topic chips, using a label such as `Билет b-fallback-028`.

If 010 changes the question card metadata or bottom navigation, adapt the ticket-ID display to the merged shape. The ID should be visible on desktop and mobile, not hidden behind a hover-only affordance.

Do not add new ticket-ID behavior to active exam unless implementation explicitly confirms it is minimal, non-supportive, and does not conflict with exam-mode focus. The acceptance requirement is `Учить`.

## Conflict Strategy With Feature 010

Feature 010 has overlapping work in `src/App.tsx`, `src/styles.css`, `tests/e2e/app.spec.ts`, and durable docs around `QuestionCard`, support reveal, and navigation.

Implementation must choose one of these routes before editing:

1. If 010 is merged into `origin/main`, sync this branch with `origin/main` and implement 013 on top of the merged UI.
2. If 010 is still unmerged, inspect it read-only, record overlap in `tasks.md`, and keep 013 patches minimal so Orchestrator can rebase/sequence safely.
3. If direct conflicts are unavoidable, pause and ask Orchestrator for ordering rather than copying sibling files.

The 013 UI work should be mechanically small:

- `TopicGuideTicketBlock`: add translation rendering and remove one repeated status chip.
- `QuestionCard` in learning mode: add ticket ID metadata.
- `tests/e2e/app.spec.ts`: add targeted assertions.
- `styles.css`: only add classes needed for translation/fallback/ticket-ID layout.

## Implementation Slices

### Slice A: Setup And Conflict Check

Goal: prove implementation starts from the right feature memory and understands sibling overlap.

Tasks:

- Confirm feature memory exists.
- Check current branch/worktree.
- Inspect 010 status and diff read-only.
- Record rebase/ordering decision in `tasks.md`.

Exit criteria:

- No product edit begins before conflict decision is recorded.

### Slice B: Translation Data And Evidence

Goal: add governed translations needed for materials tickets.

Tasks:

- Add or update translations for `b-fallback-028` and `b-fallback-412`.
- Refresh translation alignment evidence.
- Run targeted translation alignment tests.

Exit criteria:

- `pnpm run validate:content` and `node --test tests/content-translation-alignment.test.mjs` pass.

### Slice C: Parking-Clearance Material Polish

Goal: improve `parking-clearances-and-corners` readability and correctness.

Tasks:

- Polish learning prose, Spanish terms, answer explanations, and trap notes narrowly.
- Preserve Spanish phrases with Russian meanings.
- Avoid broad topic-guide rewrites.
- Run topic-guide validation/tests.

Exit criteria:

- A text check or content test proves `10 metros de cada lado de la entrada` remains visible and `5 metros` is framed as a trap/wrong value.

### Slice D: Materials UI Polish

Goal: make materials ticket blocks more useful and less noisy.

Tasks:

- Render Russian question and answer translations in materials ticket blocks.
- Render missing-translation fallback.
- Remove repeated per-ticket fallback-status chip.
- Keep section-level/materials status clarity.
- Add e2e coverage.

Exit criteria:

- e2e proves translated ticket support, fallback behavior, removed repeated chip, and retained section-level status.

### Slice E: Learn Ticket IDs

Goal: show ticket IDs in `Учить`.

Tasks:

- Add ticket ID to learning question metadata.
- Keep active exam support rules unchanged.
- Add e2e coverage for ID visibility.

Exit criteria:

- e2e or DOM assertion proves `Учить` shows the active ticket ID.

### Slice F: Vocabulary And CABA/RF

Goal: improve support content without broad unsupported expansion.

Tasks:

- Add scoped vocabulary terms with examples/provenance.
- Audit current CABA/RF guide.
- Enrich it with source-supported exam contrasts or reposition it with clearer scope and follow-up.
- Add tests or content checks as practical.

Exit criteria:

- Validation passes and process memory records why each added or deferred term/contrast belongs in 013.

### Slice G: Final Verification And Process Memory

Goal: prove acceptance evidence and leave the branch reviewable.

Tasks:

- Run full local verification.
- Run Docker smoke or record exact unrelated blocker.
- Update `tasks.md` with verification evidence, known issues, dead ends, decisions, and Implementation Agent feedback.

Exit criteria:

- Required checks pass or exact unrelated blockers are recorded.
- Review Agent can trace every behavior/content change to this feature memory.

## Test Strategy

Recommended e2e assertions:

- Open `Материалы`, select the parking-clearances topic, and assert ticket `b-fallback-028` shows:
  - Spanish question;
  - Russian question translation;
  - Spanish correct answer `10 metros de cada lado de la entrada.`;
  - Russian answer translation;
  - guide explanation.
- Assert a known untranslated materials ticket shows the missing-translation fallback.
- Assert materials header still shows draft/unofficial/fallback status.
- Assert materials ticket metadata no longer contains visible `Статус: неофициальная B-практика`.
- Open `Учить` and assert the visible question card includes its ticket ID.
- Assert `CABA/RF` remains reachable and shows enriched/repositioned content.

Recommended content/unit assertions:

- Translation alignment current-content test remains green.
- Topic-guide test or small content assertion checks `b-fallback-028`/`b-fallback-412` explanation content includes `10 metros de cada lado de la entrada` and marks `5 metros` as wrong/trap.
- Vocabulary validation already checks source question IDs; add targeted unit coverage only if helper logic changes.

## Risks And Mitigations

- Risk: translation evidence becomes stale.
  - Mitigation: compute evidence through existing helper and run translation alignment tests.
- Risk: repeated status removal hides content truth.
  - Mitigation: assert section-level fallback status remains visible.
- Risk: 010 conflicts in `QuestionCard`.
  - Mitigation: conflict check and rebase/ordering gate before UI edits.
- Risk: CABA/RF enrichment becomes a broad legal guide.
  - Mitigation: source-supported compact contrasts only, otherwise record follow-up.
- Risk: material polish creates source claims not backed by archive.
  - Mitigation: keep unsupported details ticket-specific or omit; run topic-guide/source-trace validation.
- Risk: mobile metadata row overflows after ticket ID addition.
  - Mitigation: use existing chip wrapping patterns and verify mobile e2e/screenshot if layout changes materially.

## Rollback Plan

- UI rollback: remove materials translation rendering and ticket-ID chip while leaving content entries if they are independently valid, or remove content entries and evidence together if they were introduced solely for UI.
- Content rollback: revert the narrow topic/vocabulary/CABA-RF edits and matching tests/evidence as one unit to avoid stale validation artifacts.
- Status rollback: if removal hides clarity, restore a single section-level label rather than per-ticket chips.

## Handoff To Implementation

Implementation Agent should start with Slice A, record the 010 conflict decision, then proceed through content/evidence before UI rendering. Do not claim completion until `tasks.md` records acceptance evidence and the sibling conflict handling outcome.
