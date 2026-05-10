# Plan: Difficulty Labeling For Materials And Tickets

## Summary

Implement a reviewable learner-difficulty layer in sequential PR slices. The feature should first establish the rubric, schema, and validation path; then bulk-label all current questions and topic materials; then integrate subtle UI indicators after syncing with feature `010`; then run final verification and documentation cleanup.

This Architect pass creates only feature memory. Product code, tests, content JSON, durable docs, commits, pushes, PRs, and reviews are assigned to later roles.

## Technical Context

- Frontend: static React/TypeScript/Vite SPA.
- Runtime: local-first, offline-capable static build; no backend in MVP.
- Content mode: `unofficial_b_fallback`.
- Current question data: `content/questions/caba-b.unofficial-fallback.questions.json`.
- Current topic materials data: `content/guide/topic-study-guide.ru.json`.
- Current data boundary: `src/data/content.ts`.
- Current content validator entry point: `scripts/validate-content.mjs`.
- Current topic guide validator: `scripts/content-topic-guide.mjs`.
- Current e2e coverage: `tests/e2e/app.spec.ts`.
- Observed current counts: 460 questions, 38 topic guide topics.
- Observed legacy question difficulty distribution: 426 `medium`, 34 `high`, 0 `low`.
- Observed image-backed question count: 276.
- Current UI already has `Материалы` from feature `008` in this worktree. Feature `010` source-of-truth and product changes are in a separate worktree and may be unmerged.

## Constitution Check

- Spec-first: yes; `feature-request.md` exists and this pass creates `spec.md`, `plan.md`, and `tasks.md`.
- Testable boundaries: yes; schema validation, fingerprinting, enum mapping, UI labels, and mode visibility can be tested locally.
- Test-first bias: yes; each implementation PR must add focused tests or record why a slice is content-only.
- Supervised verification: yes; acceptance criteria require command evidence and content/UI evidence.
- PR-only workflow: yes; implementation must use isolated worktrees/branches and PRs.
- One worktree per task: yes; Orchestrator should assign separate worktrees for each implementation slice.
- Deployability: yes; no backend or runtime network dependency is introduced.
- Simplicity: yes; reuse existing JSON content, validation scripts, React state, and CSS patterns before adding frameworks.
- Process memory: yes; `tasks.md` includes decisions, known issues, verification evidence, and Implementation Agent feedback/disposition placeholders.

## Architect Decisions

### Use Color Enum As Canonical Machine Value

Use lower-case English enum values `green`, `blue`, `yellow`, and `red`. Russian labels, color tokens, and accessibility labels are derived from these values in a single helper/mapping.

### Migrate The Existing Field

The existing `Question.difficulty: "low" | "medium" | "high"` is superseded by migration of the same canonical field to the four-color enum. Do not add a second `learnerDifficulty`, `difficultyColor`, or `legacyDifficulty` source. Supplemental metadata must not include another level field.

Recommended content shape:

```json
{
  "difficulty": "yellow",
  "difficultyMeta": {
    "rubricVersion": "cabadrive-difficulty-v1",
    "dimensions": ["spanish_lexical_load", "numbers_thresholds", "trap_negation"],
    "rationaleRu": "Проверяет точное число и формулировку с ловушкой; A1-learner может спутать похожие варианты.",
    "provenance": {
      "method": "manual_rubric_review",
      "reviewer": "cabadrive-017",
      "reviewedAt": "2026-05-10"
    },
    "sourceFingerprint": "<sha256>"
  }
}
```

The exact date/reviewer string may differ in implementation, but it must be stable and reviewable.

### Topic Difficulty Is Authored, Not Only Derived

Topic difficulty must be authored using the same enum and dimensions because a material topic includes Russian material, Spanish term density, trap notes, claims, and cross-topic explanation load. It may use child ticket difficulty counts as evidence, but the topic level is not mechanically equal to max or average ticket level.

### Material Ticket Difficulty Comes From Canonical Questions

Do not author difficulty on `TopicGuideTicket`. The same ticket may appear in two topics; per-placement labels would create conflicts. Material ticket blocks render canonical `question.difficulty`.

### Active Exam Attempts Stay Minimal

Default implementation should not show difficulty on active exam question cards unless Orchestrator confirms feature `010` compatibility and tests prove it is not support scaffolding. Post-exam review/results surfaces can show difficulty after the attempt is complete. If no per-question post-exam review surface exists, record that active exam UI is intentionally unchanged.

## Rubric Application Guidance

Label questions and topics from the target learner's perspective:

- Experienced Russian driver: practical vehicle-control basics may be easier than for a novice.
- Russian traffic habits: local CABA divergences, administrative processes, parking specifics, priority edge cases, and urban mobility topics can be harder.
- A1/below Spanish: short text can still be hard if it contains legal/admin terms, false friends, uncommon verbs, or dense phrasing.
- Image-heavy tickets: image presence alone is not hard; mark higher only when the answer depends on noticing a specific sign, color, position, lane, marking, or gesture.
- Trap wording: negation, `verdadero/falso`, exact-number distractors, and plausible near-miss options should usually push at least to `yellow`.
- Multi-factor items: a question with legal terms plus CABA/RF mismatch plus negation is usually `red`.

Suggested reviewer workflow:

1. Read Spanish question and answer options first.
2. Check existing flags, topics, image, translation, explanations, material ticket notes, and trap notes.
3. Assign dimensions.
4. Assign level using the level guidance in `spec.md`.
5. Write one concise Russian rationale naming the decisive source of difficulty.
6. Generate/update source fingerprint.

## Validation Architecture

Preferred implementation:

- Add `scripts/content-difficulty.mjs` with pure validation helpers:
  - `difficultyQuestionFingerprint(question)`;
  - `difficultyTopicFingerprint(topic)`;
  - `validateQuestionDifficulty(question)`;
  - `validateTopicDifficulty(topic, canonicalQuestions)`;
  - optional `summarizeDifficultyCoverage`.
- Call these helpers from `scripts/validate-content.mjs`.
- Add focused Node tests under `tests/` for difficulty validation helpers.

Validation should reuse existing local script style: no runtime services, no network, no external schema dependency unless a current project pattern already exists.

Validation pass summary should include:

```text
Difficulty labels validated: 460 questions, 38 topics.
```

## Data And Type Updates

Likely implementation files:

```text
content/questions/caba-b.unofficial-fallback.questions.json
content/guide/topic-study-guide.ru.json
scripts/validate-content.mjs
scripts/content-difficulty.mjs
src/data/content.ts
src/App.tsx
src/styles.css
tests/*.test.mjs
tests/e2e/app.spec.ts
docs_project/project/frontend/frontend-docs.md
docs_project/screens/learning-and-exam-flows.md
docs_project/project/feature-inventory.md
specs/017-difficulty-labeling/tasks.md
```

Durable docs should be updated only by an Implementation Agent and only if behavior/schema changes require it. This Architect pass does not edit them.

## UI Integration Guidance

Create a small centralized renderer or mapping, for example:

```ts
const difficultyUi = {
  green: { shortLabel: "Зеленый", label: "Зеленый - легко", aria: "Сложность: зеленый, легко" },
  blue: { shortLabel: "Синий", label: "Синий - обычная сложность", aria: "Сложность: синий, обычная" },
  yellow: { shortLabel: "Желтый", label: "Желтый - разбирать внимательно", aria: "Сложность: желтый, разбирать внимательно" },
  red: { shortLabel: "Красный", label: "Красный - целевой повтор", aria: "Сложность: красный, целевой повтор" }
};
```

Suggested surfaces:

- Learning question card: compact chip in `question-meta`, before or after topic labels.
- Mistake review selected question card: same question-card chip; side list rows can show a compact dot+label next to question ID if space allows.
- Search/list contexts: show difficulty wherever question rows or topic rows are listed. Do not create a large new search UI solely for difficulty unless another slice already introduces one.
- Materials topic list: compact dot+short label on each topic button.
- Materials detail heading: topic difficulty in the status/metadata cluster.
- Materials ticket blocks: canonical question difficulty in ticket metadata.
- Exam active attempt: omit by default. If added, only compact chip, no rationale, no filtering/sorting, and tests proving no support reveal.
- Exam result/review: show difficulty after completion if per-question review is present or added by another feature.

Styling rules:

- Use muted tokens and small metadata treatment.
- Include readable text or accessible labels; color alone is forbidden.
- Avoid using red/green styles that resemble correctness.
- Avoid the primary label `Сложный`; reserve `Сложный` for the user-controlled difficult mark.
- Keep source/fallback/draft labels visible and separate.

## Dependency And Conflict Strategy

### Feature 008

This branch already includes the feature `008` materials UI. Implementation should preserve:

- `Материалы` top-level navigation.
- Topic list/detail structure from `topic-study-guide.ru.json`.
- Canonical question joins for material ticket blocks.
- Draft/unofficial/fallback labels.
- No raw PDF viewer or network fetch.

Difficulty should layer onto these surfaces without rewriting the materials architecture.

### Feature 010

Feature `010` owns UI/UX source-of-truth and mandatory UX changes around support reveal, bottom navigation, and active exam restrictions. Implementation must:

- read `010` feature memory and durable docs before touching overlapping UI;
- prefer rebasing/syncing after `010` lands;
- if `010` is unmerged, patch only in a way that can be mechanically reconciled and record the exact strategy in `tasks.md`;
- avoid replacing `010` bottom navigation, support reveal, status visibility, or accessibility behavior;
- keep active exam support restrictions intact.

### Other Parallel Work

Features `013`, `015`, and `016` may edit content, docs, or UI. Because bulk labeling touches 460 question records and 38 topics, implementation should:

- coordinate with Orchestrator before starting the bulk content slice;
- inspect `git status` and preserve dirty diffs;
- avoid formatting churn outside changed fields;
- use deterministic tooling for bulk edits if practical and record it;
- re-run validation after every rebase.

## Implementation Slices

### Slice A: Rubric, Schema, And Validation Scaffold

Goal: introduce the model and validator helpers without forcing incomplete bulk content into `main`.

Recommended scope:

- Add difficulty enum and dimension definitions in validation/helper code.
- Add tests against local fixtures or small inline objects for allowed values, invalid values, legacy values, missing metadata, and stale fingerprints.
- Add documented migration plan in `tasks.md`.
- If integrating with `validate:content` before full labeling, keep strict coverage gated off until Slice B or make Slice A include enough sample migration to keep `main` green. Do not merge a default branch that fails preflight.

Exit criteria:

- Tests prove validator logic.
- No product UI claims full difficulty coverage yet.
- `tasks.md` records that strict full-content validation is pending Slice B.

### Slice B: Bulk Labeling And Strict Content Validation

Goal: label all current questions/topics and enable strict validation in `pnpm run validate:content`.

Recommended scope:

- Migrate all current `Question.difficulty` values to the four-color enum.
- Add `difficultyMeta` to every current question.
- Add `difficulty` and `difficultyMeta` to every current topic guide topic.
- Generate/update source fingerprints.
- Enable strict validation from `validate-content.mjs`.
- Add validation pass summary.
- Update `src/data/content.ts` types enough for build.
- Update durable docs if schema/source behavior changes.

Exit criteria:

- `pnpm run validate:content` passes and reports all current questions/topics covered.
- Validator tests pass.
- No old `low | medium | high` values remain.
- `tasks.md` records labeling method, known judgment calls, and evidence.

### Slice C: UI Integration

Goal: render difficulty subtly and accessibly across learner surfaces after syncing with `010`.

Recommended scope:

- Add centralized difficulty UI mapping/component.
- Render difficulty in learning/mistake question cards.
- Render difficulty in materials topic list/detail and ticket blocks.
- Render difficulty in existing question/topic list contexts.
- Preserve active exam restrictions.
- Add/adjust Playwright tests.
- Update durable frontend/screen docs if behavior changed.

Exit criteria:

- UI tests prove representative surfaces.
- No color-only communication.
- No visual/semantic conflict with correctness, source status, or user `Сложный`.
- `010` behavior is preserved or conflict strategy is recorded.

### Slice D: Final Verification, Docs, And Release Readiness

Goal: prove the combined feature satisfies acceptance criteria and is merge-ready.

Recommended scope:

- Full local preflight.
- Docker smoke if runtime-affecting changes landed in the current PR.
- Manual review spot-check across all four levels and topic/material surfaces.
- Update process memory with evidence, dead ends, known issues, and Implementation Agent feedback.
- Resolve or explicitly disposition any implementation feedback through Architect.

Exit criteria:

- All required commands pass or exact unrelated blockers are recorded.
- Review requirements have evidence.
- Only final human approval/merge mechanics remain.

## Test And Verification Matrix

| Area | Evidence |
| --- | --- |
| Feature memory | `feature-request.md`, `spec.md`, `plan.md`, and `tasks.md` exist before implementation. |
| Enum migration | Tests/rg evidence show no `low | medium | high` question difficulty remains. |
| Content coverage | `pnpm run validate:content` validates all current questions and topics. |
| Metadata quality | Validator tests cover missing rationale, dimensions, provenance, and stale fingerprints. |
| Topic basis | Validation catches stale topic ticket hash/basis. |
| Type safety | `pnpm run build` passes with new `DifficultyLevel` types. |
| Learning UI | E2E/component evidence shows question-card difficulty in learning mode. |
| Mistake review | E2E/component evidence shows difficulty in mistake review without confusing wrong counts or `Сложный`. |
| Materials UI | E2E/component evidence shows topic and ticket difficulty in `Материалы`. |
| Search/list | Evidence shows compact labels in existing question/topic list contexts. |
| Active exam | E2E evidence shows no rationale/support-scaffolding during active exam. |
| Accessibility | Tests or review evidence show non-color-only labels and accessible names. |
| Regression safety | `pnpm run test`, `pnpm run test:e2e`, and `pnpm run preflight` pass. |
| Formatting | `git diff --check` passes. |
| Runtime | Docker smoke flow for runtime-affecting implementation PRs. |

## Risks And Mitigations

- Risk: Difficulty labels are subjective.
  - Mitigation: require explicit dimensions, rationale, provenance, and review spot checks.
- Risk: Large content edit conflicts with parallel content work.
  - Mitigation: isolate bulk labeling PR, coordinate with Orchestrator, use deterministic fingerprints, and rebase carefully.
- Risk: Legacy `low | medium | high` remains in type or data.
  - Mitigation: validation fails legacy values and tests assert old values are unsupported.
- Risk: Green/red looks like correctness.
  - Mitigation: muted metadata treatment, explicit `Уровень` copy, no pass/fail badge styling.
- Risk: Difficulty duplicates user `Сложный`.
  - Mitigation: difficulty is static content metadata; user `Сложный` remains an interactive flag with separate label/location/icon.
- Risk: Active exam becomes scaffolded.
  - Mitigation: omit active exam difficulty by default or allow only compact non-rationale chip after explicit `010` compatibility proof.
- Risk: Topic difficulty goes stale as guide content changes.
  - Mitigation: source fingerprint and ticket-id hash validation.
- Risk: UI churn conflicts with `010`.
  - Mitigation: wait/sync or patch compatibly and record conflict strategy before UI edits.

## Handoff To Implementation

Implementation must start only after all four feature memory artifacts exist. Each implementation slice should use an assigned isolated worktree and branch, keep this `tasks.md` current, avoid out-of-scope edits, and stop for Architect disposition if a required divergence or broader content/schema change is discovered.
