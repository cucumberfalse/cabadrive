# Spec: Study Guide Language Review

## Analyst Intake

- Source request: `feature-request.md`
- Feature folder: `specs/015-study-guide-language-review/`
- Role boundary for this planning work: Architect only.
- Current guide content inspected read-only: `content/guide/topic-study-guide.ru.json`
- Current rendered surface inspected read-only: `src/App.tsx` `TopicGuideView`
- Current baseline observed during Architect orientation:
  - 38 topics
  - 38 topic summaries
  - 267 `learningMaterialRu` paragraphs
  - 109 `practicalReasoningRu` paragraphs
  - 731 Spanish term Russian translations
  - 639 rendered ticket placements over 460 unique question IDs
  - 1,831 answer explanations
  - 225 trap notes
  - 4 source-conflict notes
  - 170 non-rendered `claims[].textRu` metadata entries
  - 179 question IDs appear in two topic blocks

## Goal

Review and rewrite the Russian learner-facing prose in the topic study guide so it becomes clear, direct, and useful for a Russian-speaking experienced driver preparing for the CABA theory exam, without changing legal meaning, source boundaries, ticket placement, metadata shape, or active translation/explanation/image-metadata work from PR #63 / feature 009.

## Scope

In scope:

- Define and apply a shared Russian style rubric for the topic study guide.
- Review every rendered Russian learner-facing text field in `content/guide/topic-study-guide.ru.json`.
- Rewrite prose to be easier to read, less bureaucratic, and more exam-useful.
- Preserve the adult experienced-driver context while making text simple enough for a teenager to read comfortably.
- Keep useful Spanish exam terms, with Russian support that explains why the term matters.
- Add or strengthen CABA-vs-RF framing where it clarifies a likely Russian learner assumption.
- Keep basic reminders where they help answer tickets, even when the rule matches common RF practice.
- Preserve existing source-conflict and stale-ticket warnings, making them clearer when they already exist.
- Preserve guide status, fallback-bank clarity, unofficial-learning-aid labeling, source-trace semantics, validator shape, and ticket coverage.
- Record per-slice process memory in `tasks.md`, including field counts, source-sensitive unchanged text, duplicated-ticket handling, validation evidence, and PR #63 conflict guards.

Later Architect scope update for PR #70:

- After `baseline-checks` failed on PR #70, the old Playwright e2e fixture in `tests/e2e/app.spec.ts` was found to assert English/process markers (`trap|falso|wrong`) against text that had intentionally been rewritten as Russian learner-facing guidance.
- Architect disposition: a narrow update to `tests/e2e/app.spec.ts` is in scope solely to keep the fixture aligned with the reviewed Russian guide text and to avoid reintroducing English/process words into `content/guide/topic-study-guide.ru.json`.
- This scope expansion is limited to the existing materials-view assertion for the institution-distance trap note. Other tests, validators, package files, product code, durable docs outside this feature folder, content manifests, translation/explanation/image metadata, and guide content changes remain out of scope for this CI fixture follow-up.
- Traceability: this disposition was recorded after the Codex AI Review P2 finding on PR #70 that the feature memory did not yet explain why `tests/e2e/app.spec.ts` appeared in the final PR diff.

## Exact Field Scope

Rendered learner-facing fields in scope:

- root `titleRu`
- root `disclaimer`
- topic `titleRu`
- topic `summaryRu`
- topic `learningMaterialRu[]`
- topic `practicalReasoningRu[]`
- topic `spanishTerms[].translationRu`
- topic `tickets[].sourceConflictNoteRu`
- topic `tickets[].answerExplanations[].explanationRu`
- topic `trapNotes[].textRu`

Russian but not rendered today:

- `topics[].claims[].textRu` is source/validation metadata. Preserve it by default. A slice may plan a narrow metadata wording cleanup only if it records why the wording change is needed, preserves source-trace meaning, and shows no new factual claim was introduced.

## Preserve List

Implementation must preserve by default:

- all guide, topic, term, ticket, answer, trap, claim, and source-trace IDs;
- topic `slug` values and the absence/presence of `slug` values;
- `status`, `contentStatus`, and other machine-readable status fields;
- `termEs`;
- `sourceQuestionIds`;
- `questionId`;
- `imageLocalPath`;
- `answerId`;
- `verdict`;
- trap note `id` and `sourceQuestionIds`;
- `sourceTraceId` and source-trace relationships;
- coverage topic assignment shape and count;
- canonical Spanish question text and answer text, which come from question data and are not guide prose;
- `content/guide/topic-study-guide.coverage.json`;
- `content/guide/topic-study-guide.source-trace.json`;
- `content/questions/*`;
- `content/translations/*`;
- `content/explanations/*`;
- `content/image-metadata/*`;
- `content/validation/*`;
- validators, tests, package files, runtime files, and durable docs unless a later Architect update explicitly creates a separate task.

## Style Rubric

Target voice:

- Simple teenage-readable Russian, but not childish.
- Respect the learner as an adult driver with real road experience.
- Write for quick exam understanding, not for a legal textbook or a driving-school encyclopedia.

Sentence and paragraph rules:

- Prefer short sentences.
- Use clear verbs and concrete nouns.
- Put the first principle before exceptions.
- Split long legalistic paragraphs when one paragraph contains several ideas.
- Keep warnings and traps easy to scan.
- Avoid filler, inflated textbook phrases, and bureaucratic constructions.

Spanish and terminology rules:

- Keep Spanish exam terms when learners need to recognize them in tickets.
- Add a Russian anchor near the Spanish term, especially when the term is not transparent.
- Do not leave English workflow words in learner text. Replace words such as `fallback`, `ticket-specific`, `source-backed`, `canonical answer`, and `taxonomy-mixed` with plain Russian wording such as "старый билет", "именно в этом билете", "подтверждено источником", "правильный вариант", or "тема смешанная", as appropriate.
- Do not translate away Spanish labels that are essential for exam recognition, such as `cédula`, `VTV`, `seguro`, `licencia`, `bicisenda`, `ciclovía`, `PARE`, and similar terms.

CABA/RF framing:

- Add explicit CABA-vs-RF notes where a Russian driver is likely to assume the RF rule, habit, or document model.
- Keep CABA/RF notes practical and short. This feature must not become comparative law.
- Basic reminders are allowed when they help answer tickets, even if the learner likely knows the rule from RF driving practice.

Meaning preservation:

- Do not change numeric limits, legal duties, priority rules, current-source caveats, stale-ticket caveats, answer verdicts, or ticket placement.
- Do not generalize a ticket-specific or stale-answer explanation into a current rule.
- Do not add a new legal, factual, numeric, procedural, safety, or source-currentness claim without existing source-trace support or an Architect-disposed process-memory note.
- If a sentence cannot be simplified safely, leave it unchanged and record it as source-sensitive unchanged text in `tasks.md`.

## Non-Goals

- Do not rewrite `content/translations/*` or `content/explanations/*`.
- Do not edit `content/image-metadata/*`, `content/validation/*`, validators, tests, package files, source-trace files, coverage files, product code, or docs outside this feature folder.
- Exception: the later PR #70 Architect scope update permits only the narrow `tests/e2e/app.spec.ts` fixture assertion update described above.
- Do not add official sources or expand the official-documents archive.
- Do not reclassify topics or move tickets.
- Do not fix image metadata, translation quality, or explanation shard alignment from PR #63 / feature 009.
- Do not change UI navigation, layout, or feature 006 final release gates.
- Do not claim the current fallback question set is official or complete.
- Do not repair the `fatigue-distraction-and-attention` missing `slug` metadata oddity in this feature unless a later Architect task explicitly scopes it.

## User Stories

### User Story 1

As a Russian-speaking learner, I want the topic guide to explain each topic in plain Russian, so that I can study quickly without decoding bureaucratic or machine-like wording.

### User Story 2

As an experienced driver from Russia, I want the guide to call out important CABA/RF differences, so that I do not answer from Russian driving habits when the CABA exam expects another framing.

### User Story 3

As a learner with low Spanish proficiency, I want Spanish terms to stay visible but be explained in Russian, so that I recognize exam wording without turning the guide into a Spanish course.

### User Story 4

As a maintainer, I want each rewrite slice to prove what text it reviewed and preserved, so that a readability pass does not accidentally change legal meaning, coverage, or source boundaries.

## Functional Requirements

- FR-001: Implementation must review all in-scope rendered guide fields listed in this spec.
- FR-002: Implementation must preserve all machine-readable fields and paths in the preserve list unless a later Architect task explicitly scopes a metadata cleanup.
- FR-003: Implementation must follow the style rubric before bulk rewriting begins.
- FR-004: Implementation must proceed sequentially through assigned slices because `content/guide/topic-study-guide.ru.json` is one large shared file.
- FR-005: Each implementation PR must update `specs/015-study-guide-language-review/tasks.md` with topic IDs, field counts reviewed, field counts changed, validation evidence, source-sensitive unchanged sentences, duplicate-ticket handling, and PR #63 conflict guard evidence.
- FR-006: Each rewrite slice must preserve all 460 unique question IDs and 639 rendered ticket placements unless a later Architect task explicitly scopes and validates a placement change.
- FR-007: Each rewrite slice must preserve answer explanation `answerId` and `verdict` values.
- FR-008: Duplicated question IDs that appear in two topic blocks must be checked deliberately so explanations do not drift accidentally between contexts.
- FR-009: Rendered learner text should avoid process/meta English words unless they are Spanish exam terms or unavoidable IDs outside rendered prose.
- FR-010: Source-conflict notes and stale-ticket notes must remain visible and clearer after rewrite.
- FR-011: No implementation slice may touch PR #63 / feature 009 files or related validators/tests/docs while that work is active.
- FR-012: Final verification must prove all 38 topics and all in-scope root fields were reviewed.
- FR-013: Final verification must prove no new source claims were added without source trace or Architect disposition.

## Acceptance Criteria

1. Given the guide root is inspected after final implementation, `titleRu` and `disclaimer` have been reviewed against the style rubric and still preserve unofficial-learning-aid and fallback-bank clarity.
2. Given all 38 topics are inspected, each topic has recorded review evidence for `titleRu`, `summaryRu`, `learningMaterialRu[]`, `practicalReasoningRu[]` when present, `spanishTerms[].translationRu`, `tickets[].sourceConflictNoteRu` when present, `tickets[].answerExplanations[].explanationRu`, and `trapNotes[].textRu`.
3. Given the guide is parsed before and after each rewrite slice, the count remains 38 topics, 460 unique question IDs, and 639 rendered ticket placements unless an explicit later Architect disposition scopes otherwise.
4. Given answer explanations are inspected, every existing `answerId` and `verdict` value is preserved.
5. Given duplicated question IDs are inspected, each duplicate placement is either intentionally aligned where the same explanation should remain the same or intentionally topic-specific where the context differs; the slice records which case applies.
6. Given source-conflict notes exist, all 4 notes remain present unless a later Architect disposition explicitly changes that count.
7. Given learner-facing text is sampled before and after, the rewritten text is simpler, clearer, and more direct while retaining the CABA exam and experienced Russian-driver context.
8. Given Spanish terms remain in learner-facing text, each term is accompanied by enough Russian context to understand what to do with it on the exam.
9. Given a CABA/RF difference matters for an assigned topic, the rewritten text flags it plainly without creating a broad comparative-law section.
10. Given a basic rule helps answer assigned tickets, the guide may remind it directly even if it matches common RF practice.
11. Given a sentence is legal, numeric, procedural, source-currentness, or stale-ticket sensitive, a rewrite does not change its meaning; if simplification is unsafe, the sentence is left unchanged and recorded.
12. Given `topics[].claims[].textRu` is not rendered today, it is preserved unless a narrow metadata cleanup is explicitly planned and validated.
13. Given the final branch diff is inspected, no files under `content/translations/`, `content/explanations/`, `content/image-metadata/`, or `content/validation/` were touched by this feature.
14. Given the final branch diff is inspected, no validators, tests, product code, package files, durable docs, coverage manifests, source-trace manifests, or official-document files were touched unless a later Architect update explicitly added that scope.
15. Given local validation runs for each implementation PR, JSON parsing, topic-guide tests/content validation, and diff hygiene pass or record an unrelated blocker with exact evidence.
16. Given final review occurs, every acceptance criterion has evidence in `tasks.md`, not only an AI-written summary.

## Negative Scenarios

- A rewrite that sounds friendly but changes a speed limit, document requirement, priority rule, or source-conflict caveat is not acceptable.
- A rewrite that removes Spanish exam terms needed to recognize ticket wording is not acceptable.
- A rewrite that leaves Spanish or English phrases without a Russian learner anchor is not acceptable, except for machine IDs and unavoidable Spanish exam labels.
- A rewrite that edits translation shards, explanation shards, image metadata, validation evidence, or feature 009 files is not acceptable.
- A rewrite that changes ticket placement, topic IDs, answer IDs, verdicts, image paths, source-trace IDs, or status fields is not acceptable.
- A rewrite that handles all 38 topics in one large PR is not acceptable unless Orchestrator explicitly records why a smaller sequential plan became impossible.
- Parallel implementation workers editing `content/guide/topic-study-guide.ru.json` at the same time are not acceptable.
- A final report that says "all text was reviewed" without topic-by-topic evidence and counts is not acceptable.
- Fixing the missing `slug` on `fatigue-distraction-and-attention` as part of this language pass is not acceptable unless separately planned.

## Review And Verification Requirements

- Review Agent must review meaning preservation and readability, not only tests.
- Review Agent must compare representative before/after samples from every changed topic.
- Review Agent must check that source-sensitive unchanged sentences were either preserved or rewritten without changing meaning.
- Review Agent must check duplicate ticket placements for accidental explanation drift.
- Review Agent must verify no PR #63 / feature 009 files were touched.
- Review Agent must verify field-count and topic-coverage evidence in `tasks.md`.
- Review Agent must reject slices that broaden ticket-specific or stale-ticket wording into current generalized claims without source trace or Architect disposition.
- Review Agent must verify local validation evidence, including topic-guide validation, JSON validity, and diff hygiene.
