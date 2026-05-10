# Spec: Difficulty Labeling For Materials And Tickets

## Analyst Intake

- Source request: `feature-request.md`.
- Active feature folder: `specs/017-difficulty-labeling/`.
- Assigned worktree: `/Users/chap/devel/cabadrive-017-difficulty-labeling-orchestrator`.
- Assigned branch: `codex/017-difficulty-labeling-orchestrator`.
- Architect scope: create and maintain only `spec.md`, `plan.md`, and `tasks.md` in this feature folder. Product code, tests, content JSON, durable docs outside this folder, commits, PRs, and review are out of scope for this Architect pass.

## Goal

Add a validated four-level learner difficulty layer for every current Cabadrive question/ticket and every current topic material, then expose it in the UI as a subtle orientation signal for the target learner: an experienced Russian-speaking driver with Russian driving habits and A1-or-below Spanish.

The feature must help the learner understand expected study friction before and during review without confusing difficulty with answer correctness, official source status, user progress, or the existing user-marked `Сложный` action.

## Scope

In scope for future implementation:

- Define the Cabadrive difficulty rubric for the requested color order: green, blue, yellow, red.
- Replace the current three-value `Question.difficulty: low | medium | high` source with one canonical four-value machine enum: `green | blue | yellow | red`.
- Add required review metadata for every difficulty label: dimensions, Russian rationale, rubric/provenance, and stale-content guard data.
- Label all 460 current canonical questions in `content/questions/caba-b.unofficial-fallback.questions.json`.
- Label all 38 current topic guide topics/materials in `content/guide/topic-study-guide.ru.json`.
- Render material ticket block difficulty from the canonical question record, not as a second per-topic-ticket label.
- Add content validation integrated into `pnpm run validate:content`.
- Add TypeScript/data-boundary updates so runtime code consumes the four-level difficulty model without network calls or backend services.
- Add subtle, accessible UI indicators in learning question cards, mistake review, materials topic list/detail, material ticket blocks, search/list contexts where they exist, and post-exam/review surfaces where support is allowed.
- Keep active exam-attempt scaffolding boundaries from feature `010`.
- Update durable `docs_project/` documentation during implementation if schema, learner-facing behavior, or UI source-of-truth changes.
- Keep `tasks.md` process memory current during implementation.

Out of scope:

- Replacing the question bank, claiming official/full GCBA coverage, or changing `unofficial_b_fallback` status.
- Creating a backend, remote content service, analytics, live AI classifier, runtime network fetch, or PDF viewer.
- Adding a full adaptive scheduling system or spaced repetition engine. Difficulty may prepare for future scheduling but does not implement it.
- Relabeling the compact `CABA/RF` guide as a material difficulty surface in this feature. `CABA/RF` remains a separate contrast guide unless a later feature gives it structured difficulty.
- Changing the meaning of user progress, correctness, mistake counts, or the user-controlled `Сложный` mark.
- Editing feature `008`, `010`, or other feature memory folders.

## Assumptions

- The requested order is easiest to hardest: green, blue, yellow, red.
- "Tickets/questions" means every canonical current question in the category B fallback question file.
- "Materials" means the topic study guide rendered by `Материалы`, currently 38 topics from `content/guide/topic-study-guide.ru.json`.
- Current count context is 460 questions and 38 topics. Validation must compute the count from current files rather than hard-code it, but implementation evidence should name the observed count.
- Difficulty is authored/reviewed content metadata, not purely computed at render time.
- A topic/material can be harder than the median of its tickets if the Russian study material, Spanish terminology, CABA/RF divergence, or trap pattern creates extra learner friction.
- A ticket physically rendered in more than one material topic still has exactly one canonical question difficulty. Topic-specific extra difficulty belongs in the topic difficulty rationale.
- Active exam attempts should not show full rationale, dimension details, or difficulty-driven study hints. If feature `010` remains unmerged, implementation must coordinate before touching overlapping UI.

## Difficulty Scale

Canonical machine enum values:

- `green`
- `blue`
- `yellow`
- `red`

These enum values are the only source of truth for level. UI labels and colors are derived from a single mapping.

Learner-facing Russian semantics:

| Level | Russian label | Meaning for the learner |
| --- | --- | --- |
| `green` | `Зеленый - легко` | Быстрый билет или тема. Логика знакома опытному водителю, испанский простой, нет заметного CABA/RF расхождения или подвоха. |
| `blue` | `Синий - обычная сложность` | Есть один заметный источник трения: термин, картинка, маленькая местная деталь или непривычная формулировка, но правило быстро становится понятным. |
| `yellow` | `Желтый - разбирать внимательно` | Высокая ожидаемая сложность: специфическое правило CABA, точное число, юридико-административная лексика, сильный визуальный cue или типичный экзаменационный подвох. |
| `red` | `Красный - целевой повтор` | Самые рискованные билеты/темы. Несколько факторов одновременно, сильное отличие от привычек РФ, редкие испанские/legal terms, отрицания/исключения или неочевидная логика ответа. |

## Difficulty Criteria

Implementation must apply the rubric against these dimensions. Dimension enum values should use stable English `snake_case` strings:

- `simple_common_spanish`: common wording and familiar practical driving logic; usually supports `green`.
- `spanish_lexical_load`: uncommon Spanish words, dense syntax, false friends, synonyms, or terms difficult for an A1 learner.
- `legal_admin_terms`: legal, licensing, administrative, insurance, sanctions, documentation, or institutional vocabulary.
- `caba_rf_divergence`: CABA rule/practice differs from likely Russian driving expectations.
- `rule_complexity`: exception-heavy, conditional, multi-step, counterintuitive, or non-obvious rule.
- `numbers_thresholds`: distances, speeds, time windows, percentages, ages, blood-alcohol values, or other exact memorized numbers.
- `trap_negation`: negation, exception, `verdadero/falso`, "except", near-identical options, plausible distractors, or wording trap.
- `visual_cue_load`: answer depends on identifying a sign, mark, gesture, lane, vehicle position, color, small image detail, or spatial relation.
- `cross_topic_dependence`: apparent topic differs from the decisive topic, or the ticket combines several concepts.

Level guidance:

- `green`: zero major difficulty drivers, or only `simple_common_spanish` with familiar driving logic.
- `blue`: one minor driver or one image/term detail where the correct concept remains familiar.
- `yellow`: one major driver or two minor drivers, especially exact numbers, CABA/RF mismatch, legal/admin terms, image-dependent interpretation, or a trap.
- `red`: multiple major drivers, severe CABA/RF mismatch, rare Spanish/legal wording plus a trap, non-obvious exception, or cross-topic reasoning that is likely to mislead the target learner.

## Data Model Requirements

- `Question.difficulty` must be migrated from `low | medium | high` to `green | blue | yellow | red`.
- The old `low | medium | high` values must be removed from content, TypeScript types, tests, and validation. They must not remain as a hidden fallback or parallel field.
- Each question must add a supplemental metadata object, recommended name `difficultyMeta`, with no duplicate `level` field:

```ts
type DifficultyLevel = "green" | "blue" | "yellow" | "red";

type DifficultyMeta = {
  rubricVersion: "cabadrive-difficulty-v1";
  dimensions: DifficultyDimension[];
  rationaleRu: string;
  provenance: {
    method: "manual_rubric_review";
    reviewer: string;
    reviewedAt: string; // YYYY-MM-DD
  };
  sourceFingerprint: string;
};
```

- `sourceFingerprint` for questions should be a deterministic SHA-256 over the source fields that affect difficulty: `id`, `officialTextEs`, answers, `correctAnswerId`, `topics`, `flags`, image hash/local path where present, and current validation/status fields if implementation uses them in the rubric.
- Each topic guide topic must add the same canonical `difficulty` enum and supplemental `difficultyMeta`.
- Topic `difficultyMeta.sourceFingerprint` should be a deterministic SHA-256 over topic fields that affect topic difficulty: topic id/slug/title/summary, learning material, practical reasoning, Spanish terms, ticket question IDs, trap notes, and claims.
- Topic `difficultyMeta` should also include or be paired with a validated basis summary for reviewer usability, recommended shape:

```ts
type TopicDifficultyBasis = {
  questionLevelCounts: Record<DifficultyLevel, number>;
  ticketQuestionIdsSha256: string;
  dominantDimensions: DifficultyDimension[];
};
```

- If implementation chooses a separate difficulty manifest instead of inline fields, it must still remove or fail legacy `Question.difficulty: low | medium | high`, provide exactly one source of truth for each question/topic, and justify the different layout in `tasks.md` before editing product files.
- No per-placement material-ticket difficulty may be authored. Material ticket blocks display canonical question difficulty. This avoids conflicts for dual-topic tickets.

## User Stories

### User Story 1

As a Russian-speaking experienced driver, I want to know whether a ticket is easy, normal, hard, or high-risk before spending time on it, so that I can choose between quick practice and careful review.

### User Story 2

As a learner with low Spanish, I want difficulty to reflect Spanish wording and legal/admin terms, not only traffic-rule complexity, so that I am not surprised by questions I understand as a driver but not as a Spanish reader.

### User Story 3

As a learner coming from Russian rules, I want the app to flag topics where CABA expectations diverge from my habits, so that I can avoid answering from Russian intuition.

### User Story 4

As a learner using `Материалы`, I want topic difficulty and ticket difficulty to be visible but calm, so that I can scan materials without the page becoming noisy.

### User Story 5

As a maintainer/reviewer, I want every difficulty label to have dimensions, rationale, provenance, and stale-content guards, so that bulk labels can be reviewed and kept current.

## Acceptance Criteria

1. Given the feature is implemented, every current canonical question has exactly one `difficulty` value from `green`, `blue`, `yellow`, or `red`.
2. Given the feature is implemented, every current topic guide topic/material has exactly one `difficulty` value from `green`, `blue`, `yellow`, or `red`.
3. Given any question still has `difficulty: "low"`, `"medium"`, or `"high"`, content validation fails.
4. Given a question or topic has missing, empty, duplicate, or invalid difficulty dimensions, content validation fails.
5. Given a question or topic lacks Russian rationale, provenance, or source fingerprint, content validation fails.
6. Given a question/topic source field affecting difficulty changes without updating the difficulty fingerprint, content validation fails.
7. Given a material ticket block renders a question, its difficulty comes from the canonical question record.
8. Given a ticket is assigned to two material topics, both material ticket blocks show the same canonical ticket difficulty.
9. Given a topic guide topic changes its ticket set, material text, terms, trap notes, or claims, validation catches stale topic difficulty metadata.
10. Given `pnpm run validate:content` runs, it verifies allowed values, current question/topic coverage, metadata completeness, stale fingerprints, and no orphan/stale difficulty references.
11. Given TypeScript imports content, the `Question` and topic types expose the four-level difficulty model and no longer expose `low | medium | high`.
12. Given learning mode renders a question card, a subtle non-color-only difficulty indicator is visible near existing metadata.
13. Given mistake review renders a question card or mistake list item, difficulty is visible without being confused with wrong-counts or the user-marked `Сложный` state.
14. Given `Материалы` renders the topic list, each topic list item includes a compact difficulty indicator.
15. Given a material topic detail renders, the topic heading includes the topic difficulty and the ticket blocks include their canonical ticket difficulty.
16. Given question/search/list contexts exist or are added by adjacent work, listed questions/topics expose compact difficulty labels.
17. Given active exam attempt mode is in progress, full difficulty rationale/dimensions and study hints remain hidden. A compact level chip may be added only if it is proven non-scaffolding and compatible with feature `010`; otherwise active exam omits difficulty until review/results.
18. Given post-exam or review surfaces show individual tickets, difficulty may be shown as review metadata after the active attempt is complete.
19. Given UI difficulty is rendered, it uses text/ARIA plus color or shape, never color alone.
20. Given correctness, source status, and user-marked `Сложный` controls are present, difficulty styling and copy remain visually and semantically distinct.
21. Given current content mode remains `unofficial_b_fallback`, difficulty copy does not imply officialness, completeness, legal severity, or source confidence.
22. Given feature `010` is unmerged when implementation begins, the implementation either waits/syncs after `010` lands or patches compatibly without overwriting `010` source-of-truth behavior, and records the conflict strategy in `tasks.md`.
23. Given local verification runs, `pnpm run validate:content`, `pnpm run test`, `pnpm run build`, `pnpm run test:e2e`, `pnpm run preflight`, and `git diff --check` pass or exact unrelated blockers are recorded.
24. Given runtime-affecting changes are included, Docker contract evidence is recorded with `make build`, `make up`, a smoke check at `http://localhost:5173`, and `make down`, unless Orchestrator scopes a slice as content/validation-only.
25. Given implementation is complete, `tasks.md` records decisions, dead ends, known issues, Implementation Agent feedback/disposition, and verification evidence for every acceptance criterion.

## Negative Scenarios

- A solution that leaves both `low | medium | high` and `green | blue | yellow | red` as usable difficulty values fails.
- A solution that derives difficulty only from the old three-level field without review rationale fails.
- A solution that labels only visible material tickets but not all canonical questions fails.
- A solution that labels only questions referenced in the topic guide but not all current questions fails.
- A solution that labels only tickets but not all 38 topic materials fails.
- A solution that stores topic difficulty as a duplicate of child ticket labels without topic-specific review rationale is incomplete.
- A solution that uses red/green styling in a way that looks like correctness/pass/fail fails.
- A solution that replaces or hides source/unofficial/fallback status labels fails.
- A solution that makes difficulty interactive like the user `Сложный` mark, or stores it in user progress, fails.
- A solution that exposes answer-help, explanations, or difficulty rationale during active exam attempts violates feature `010` mode boundaries.
- A solution that introduces runtime network calls, backend dependencies, or live classification violates the local-first contract.
- A bulk labeling PR without validation evidence and reviewable rationale is not merge-ready.

## Functional Requirements

- FR-001: Define `DifficultyLevel = "green" | "blue" | "yellow" | "red"` as the only canonical machine enum.
- FR-002: Define `DifficultyDimension` allowed values covering Spanish lexical load, legal/admin terms, CABA/RF divergence, rule complexity, numbers, traps/negations, visual cue load, cross-topic dependence, and straightforward/common baseline cases.
- FR-003: Migrate current question content from `low | medium | high` to the four-color enum without leaving a second source of truth.
- FR-004: Add required difficulty metadata to every question and topic.
- FR-005: Add deterministic source fingerprinting for question and topic difficulty metadata.
- FR-006: Add validation for difficulty enum values, dimensions, rationale, provenance, fingerprints, and full current coverage.
- FR-007: Integrate difficulty validation into `pnpm run validate:content`.
- FR-008: Update TypeScript content types and any helpers to expose difficulty in a single data boundary.
- FR-009: Add a centralized UI mapping from difficulty enum to Russian label, compact label, accessible label, and visual token.
- FR-010: Render compact difficulty indicators in learning question cards.
- FR-011: Render difficulty indicators in mistake review question cards and mistake list/search contexts where question IDs are listed.
- FR-012: Render topic difficulty in the materials topic list and topic detail heading.
- FR-013: Render canonical question difficulty in material ticket blocks.
- FR-014: Keep active exam attempts free of difficulty rationale/dimension details and do not alter translation/explanation restrictions.
- FR-015: Add unit/content tests and Playwright or component evidence for representative UI surfaces.
- FR-016: Update durable docs if schema or learner-facing UI behavior changes.
- FR-017: Keep `tasks.md` current with implementation feedback, Architect disposition placeholders, and verification evidence.

## Validation Requirements

Validation must fail for:

- missing `difficulty`;
- invalid difficulty enum value;
- legacy `low`, `medium`, or `high` difficulty value;
- missing `difficultyMeta`;
- missing or invalid `rubricVersion`;
- missing, duplicate, or unsupported dimensions;
- empty `rationaleRu`;
- missing or malformed provenance date/method/reviewer;
- stale or missing source fingerprint;
- missing question coverage in the current question file;
- missing topic coverage in the current topic guide;
- topic difficulty basis whose ticket ID hash no longer matches topic tickets;
- any external manifest choice that references missing question IDs or topic IDs;
- any orphan difficulty record if implementation chooses a manifest layout.

Validation must report a concise pass summary that includes current question and topic counts, for example "difficulty labels validated for 460 questions and 38 topics".

## UI Requirements

- Use compact difficulty UI: small chip, dot+text, or metadata row treatment near existing status metadata.
- Do not use large banners, warning blocks, or full explanatory paragraphs in question cards.
- Do not rely on color alone; include text such as `Уровень: синий`, `Сложность: желтая`, or an accessible label.
- Use color tokens that are visually distinct from correctness green/red and source/status labels. Prefer muted outline or small dot treatment over filled pass/fail-like badges.
- Avoid the word `Сложный` as the primary difficulty control label because it conflicts with the user-marked difficult button. Use `Уровень`, `Сложность билета`, or compact color labels instead.
- Full rationale/dimensions should be available in content review artifacts and may be used in future detail UI, but the first UI implementation should show compact labels unless a surface explicitly needs a tooltip/details affordance.
- Preserve mobile wrapping and keyboard/focus behavior from `010`.
- Keep materials status labels (`draft`, `unofficial_learning_aid`, `unofficial_b_fallback`) visible alongside difficulty without merging their meanings.

## Compatibility Requirements

- Feature `008`: `Материалы` remains the topic study guide UI. Topic difficulty attaches to guide topics; material ticket difficulty attaches to canonical joined questions. Do not duplicate Spanish ticket text or author separate per-topic-ticket difficulty.
- Feature `010`: implementation must preserve Spanish-primary, Russian-support, hidden-before-answer, active-exam-no-scaffolding, bottom navigation, status visibility, accessibility, and source-of-truth docs when present.
- If `010` is not merged into `main` when implementation starts, Orchestrator should either wait for `010`, rebase/sync after it lands, or assign a narrow compatible patch that avoids overwriting `010` changes. The selected strategy must be recorded in `tasks.md`.
- Parallel work from features `013`, `015`, and `016` may touch content JSON or UI files; implementation must preserve existing dirty diffs and coordinate before bulk edits.

## Verification Requirements

- Content validation evidence:
  - `pnpm run validate:content` proves full coverage and metadata validity.
  - Validator tests cover missing values, invalid enum, legacy enum, stale fingerprint, missing rationale, duplicate dimensions, missing question/topic coverage, and stale topic basis.
- Runtime/type evidence:
  - `pnpm run test` covers mapping/helper behavior where practical.
  - `pnpm run build` proves TypeScript/Vite can import the migrated schema.
- UI evidence:
  - Playwright/component evidence proves difficulty is visible in learning question cards, mistake review, materials topic list/detail, material ticket blocks, and at least one search/list context that exists after sync.
  - Evidence proves active exam attempts do not expose rationale/support-scaffolding and preserve `010` restrictions.
  - Evidence proves difficulty is not color-only and does not conflict with correctness/source/user-marked difficult states.
- Full preflight:
  - `pnpm run test:e2e`;
  - `pnpm run preflight`;
  - `git diff --check`;
  - Docker smoke flow for runtime-affecting PRs unless explicitly scoped out by Orchestrator.

## Review Requirements

- Review Agent must verify complete feature memory exists and `tasks.md` contains current process memory.
- Review Agent must verify there is exactly one difficulty source of truth and no legacy `low | medium | high` behavior remains.
- Review Agent must spot-check labels across all four levels and across the required dimensions.
- Review Agent must inspect enough bulk content to determine whether rationale/dimensions are meaningful rather than arbitrary.
- Review Agent must verify validation fails for missing/invalid/stale difficulty metadata.
- Review Agent must verify every current question and topic is covered.
- Review Agent must verify UI indicators are subtle, accessible, non-color-only, and distinct from correctness/source/user-marked difficult status.
- Review Agent must verify active exam attempt boundaries from `010` are preserved.
- Review Agent must verify `008` materials behavior remains intact and dual-topic tickets do not gain conflicting per-placement difficulty.
- Review Agent must verify docs were updated when schema or learner-visible behavior changed.
