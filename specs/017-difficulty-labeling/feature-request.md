# Feature Request: Difficulty Labeling For Materials And Tickets

## Analyst Artifact Status

This is the Analyst intake artifact for a repository-changing request. Per the Cabadrive role boundary, this pass creates only this `feature-request.md` file.

This artifact intentionally does not include product code, data edits, validation scripts, tests, durable docs, `spec.md`, `plan.md`, `tasks.md`, commits, pushes, PR state, or changes outside this assigned intake artifact.

## Orchestrator Routing Context

- Orchestrator entry: the user first addressed the Orchestrator, then routed this repository-changing request to Analyst with explicit instructions to create only the intake artifact.
- Assigned intake worktree: `/Users/chap/devel/cabadrive-017-difficulty-labeling-orchestrator`
- Assigned branch: `codex/017-difficulty-labeling-orchestrator`
- Feature folder: `specs/017-difficulty-labeling/`
- Prefix decision: the checkout from `origin/main` shows feature folders through `011`, while local parallel worktrees already use prefixes `012` through `016`. The Orchestrator assigned `017`; `specs/017-difficulty-labeling/` was free at intake time, so this Analyst used it to avoid collisions.
- Parallel-work note: other Orchestrators/agents are active in separate worktrees. Implementation must preserve parallel branches and should expect possible conflicts around `src/App.tsx`, `src/styles.css`, `src/data/content.ts`, `docs_project/`, and content JSON touched by features `010`, `013`, `015`, and `016`.

## User Request

The original user request, in Russian, asked:

```text
ты строго оркестратор
с тобой параллельно работают другие орекстраторы и агенты, переключись в мейн в отдельном окружении

задача разметить сложность для материалов и билетов
оценивать по шкале зеленый - синий - желый - красный
критерии придумай сам исходя из всего, что есть, надо понять ожидаемую сложность для пользователя.
не забывай, кто твой юзер - опытный водитель из рф, который почти не знает испанский, т.е как минимум сложность добавляют сложные термины на испанском, сложная лексика, отличие от правили правктик в рф, ну и плюс не забывай про сложнось в цлом (само по себе правило не очевидное, наличие подвоха в вопросе и тд),
в рамках тикета придумать критерии разметки, разметить все, придумать как добавить в ui, добавить везде, оно не дожно бросаться в галза, но при этом быть видно, учитывай работу в 10 чтоб не было конфликов
```

The routing prompt further clarified that this Analyst must create `specs/017-difficulty-labeling/feature-request.md`, must not ask questions if reasonable assumptions can be recorded, and must explicitly require the future feature to:

- define the difficulty scale and criteria;
- label all learning materials/topics and all tickets/questions;
- add data validation;
- add subtle but visible UI display across all relevant surfaces;
- stay compatible with feature `010` UI/UX source-of-truth and behavior.

## Clarified Answers And Assumptions

No clarification was requested because the intake is clear enough for Architect planning. The following assumptions should guide the next role:

- "Difficulty" means expected learner difficulty for Cabadrive's primary user: an experienced Russian-speaking driver from Russia with very low Spanish proficiency preparing for the CABA category B theory exam.
- Difficulty is not legal severity, source confidence, officialness, correctness probability, progress status, or the existing "marked difficult by user" state. Those concepts must stay visually and semantically separate.
- The requested order is easiest to hardest: green, blue, yellow, red. The user typo `желый` is interpreted as `желтый`.
- Canonical machine values should be stable English enum values chosen by Architect/Implementation, while learner-facing labels may use Russian and color names. The UI must not rely on color alone.
- The current canonical question file already has a three-value field `difficulty: "low" | "medium" | "high"` on the 460 observed fallback questions. That field is insufficient for the requested four-color scale and must be migrated, replaced, or clearly superseded without leaving two conflicting sources of truth.
- "Tickets/questions" means every canonical question in `content/questions/caba-b.unofficial-fallback.questions.json`, not only questions referenced from topic materials.
- "Materials" means the current topic study guide exposed by `Материалы`: all observed topics in `content/guide/topic-study-guide.ru.json` and their rendered ticket blocks. Architect should explicitly decide whether the compact `CABA/RF` guide also gets material-level difficulty now or is recorded as a follow-up.
- Difficulty should be authored or reviewable content metadata, not a purely implicit UI calculation, because the criteria include learner context and CABA/RF expectations that need human-readable rationale.
- Topic/material difficulty may be authored directly, derived from child tickets plus topic-specific language/trap load, or both, but there must be one validated learner-facing level per material/topic.
- Ticket difficulty should include compact rationale or dimension flags so future editors can understand why a ticket is yellow or red rather than treating color as arbitrary decoration.
- Active exam attempts must not gain translation/explanation support from this feature. A compact difficulty marker may be allowed if Architect decides it does not reveal answer-specific help or conflict with `010`; otherwise active exam can defer full difficulty text to review/results.
- The UI display should be subtle: small dot/chip/legend-style treatment near existing metadata, filters, lists, cards, and material headings, not large banners or attention-grabbing warnings.

## Project Context Reviewed

Mandatory repository memory and durable docs reviewed:

- `.specify/memory/constitution.md`
- `docs_project/README.md`
- `docs_project/project-idea.md`
- `docs_project/project/frontend/frontend-docs.md`
- `docs_project/project/backend/backend-docs.md`
- `docs_project/project/feature-inventory.md`
- `docs_project/screens/learning-and-exam-flows.md`
- `docs/specify/README.md`

Relevant feature memory and adjacent work reviewed:

- `specs/008-learning-materials-ui/feature-request.md`
- `specs/008-learning-materials-ui/spec.md`
- `specs/008-learning-materials-ui/plan.md`
- `specs/008-learning-materials-ui/tasks.md`
- `specs/010-ui-ux-learning-source-of-truth/feature-request.md` from `/Users/chap/devel/cabadrive-010-ui-ux-learning-intake`
- `specs/010-ui-ux-learning-source-of-truth/spec.md` from the `010` worktree
- `specs/010-ui-ux-learning-source-of-truth/plan.md` from the `010` worktree
- `specs/010-ui-ux-learning-source-of-truth/tasks.md` from the `010` worktree
- `docs_project/project/frontend/ui-ux-source-of-truth.md` from the `010` worktree
- `docs_project/project/learning/learning-experience-source-of-truth.md` from the `010` worktree
- `docs_project/project/frontend/ui-ux-product-audit.md` from the `010` worktree

Relevant source/data inspected for context only:

- `src/data/content.ts`
- `src/App.tsx`
- `scripts/validate-content.mjs`
- `scripts/content-topic-guide.mjs`
- `content/questions/caba-b.unofficial-fallback.questions.json`
- `content/guide/topic-study-guide.ru.json`

Observed current state:

- Current content mode is `unofficial_b_fallback`.
- Current canonical question count is 460.
- Current question difficulty values are only `medium` and `high`; observed counts were 426 `medium`, 34 `high`, and 0 `low`.
- Current question metadata includes `flags.hasImage` and `flags.hasNegationOrException`; observed counts were 276 image-backed questions and 34 negation/exception questions.
- Current topic study guide has 38 topics, `status: "draft"`, and `contentStatus: "unofficial_learning_aid"`.
- Feature `008` already adds `Материалы` from the topic study guide and joins ticket blocks back to canonical questions.
- Feature `010` establishes source-of-truth rules for status visibility, Spanish-primary/Russian-support presentation, mode boundaries, bottom navigation, support after attempts, and local/offline UI behavior. It may not yet be merged into `origin/main` in this checkout, so implementation must coordinate before editing overlapping UI files.

## External Research

No new external research was performed during this intake. The request is primarily a product/content classification and UI integration task inside existing Cabadrive source material, and feature `010` has already gathered current UI/UX, accessibility, and learning-practice research for the exact adjacent surface.

Relevant inherited research context from feature `010` that Architect should reuse rather than re-research unless needed:

- Nielsen Norman Group, "10 Usability Heuristics for User Interface Design" (updated 2024-01-30): status visibility, learner-language wording, consistency, user control, recognition over recall, focused design, and contextual help.
- W3C WCAG 2.2: focus visibility, keyboard operation, target sizing, predictable interaction, contrast, and non-color-only communication.
- Dunlosky et al., "Improving Students' Learning With Effective Learning Techniques" (2013): practice testing and distributed practice as high-utility learning techniques.
- Multimedia learning research summarized in feature `010`: reduce extraneous cognitive load and signal relevant information without decorative noise.
- Duolingo product/research writing summarized in feature `010`: guide learners toward useful next steps and review harder material sooner, while prioritizing long-term learning over superficial engagement.

## Problem Statement

Cabadrive currently helps the learner study official-style Spanish ticket text with Russian support, but the learner has no consistent way to estimate how hard a ticket or material will be before opening it, choosing it for review, or interpreting mistakes.

For the target user, difficulty is not simply "traffic rule is hard." It combines:

- Spanish lexical load and legal/administrative terminology;
- CABA-specific wording and local rule differences from Russian driving expectations;
- non-obvious or exception-heavy rules;
- numerical memorization such as distances, speeds, time windows, and thresholds;
- exam wording traps, negations, near-identical answer choices, or false familiar patterns;
- image interpretation burden when the answer depends on a visual cue;
- cross-topic reasoning where a ticket looks like one topic but is answered by another.

Without a visible and validated difficulty layer, the app cannot reliably prioritize hard material, explain why an item is hard, or help a learner choose between quick practice and focused review. At the same time, adding loud difficulty labels would clutter exam-focused flows and could conflict with the `010` source-of-truth rules.

## Proposed Outcome Or Workflow

1. Define a four-level difficulty taxonomy for expected learner difficulty: green, blue, yellow, red.
2. Translate the taxonomy into explicit Cabadrive-specific criteria based on the target user, Spanish comprehension, CABA/RF differences, concept complexity, and exam traps.
3. Apply the difficulty taxonomy to every canonical question/ticket in the current question bank.
4. Apply the difficulty taxonomy to every topic/material in the topic study guide, including material-level reasoning that accounts for all referenced tickets and topic-specific complexity.
5. Preserve or migrate the current three-level question `difficulty` data so there is one non-conflicting difficulty source of truth.
6. Add validation that all required items have exactly one allowed difficulty level and, where required, supporting rationale or dimension flags.
7. Add subtle learner-facing UI indicators across relevant surfaces: learning question cards, mistake review, exam/review surfaces as allowed by `010`, search/list contexts, topic materials list/detail, material ticket blocks, and any existing status/filter surfaces where difficulty helps navigation.
8. Keep difficulty visible but not visually dominant; use color plus text/accessible labels, not color alone.
9. Update durable docs if the learner-facing model, content schema, or UI source-of-truth changes.
10. Add tests and verification evidence for data validation, UI rendering, accessibility of labels, and preservation of `010` behavior.

## Suggested Difficulty Criteria For Architect To Formalize

Architect may revise the exact rubric, but this feature should start from these dimensions:

- Spanish lexical load: uncommon words, legal/administrative terms, dense sentence structure, false friends, synonyms, and phrases hard for an A1 Spanish learner.
- CABA/RF divergence: a practical Russian driver might answer from Russian habits but CABA expects a different rule, priority model, document rule, parking rule, or administrative process.
- Rule complexity: the rule itself is exception-heavy, counterintuitive, multi-step, conditional, or requires memorizing exact numbers.
- Question trap load: negation, "except" wording, `verdadero/falso`, near-identical options, distractors that sound plausible, or taxonomy-mixed tickets.
- Visual interpretation load: the answer depends on noticing a specific image detail, sign, marking, gesture, lane, object, or spatial relation.
- Cross-topic dependence: the ticket combines topics or requires identifying that an apparent topic is not the real deciding rule.
- Consequence for study planning: the level should help the learner decide whether to skim, practice normally, review carefully, or schedule targeted repetition.

Suggested level meanings:

- Green: straightforward for the target user; familiar driving logic, common Spanish, no meaningful CABA/RF mismatch, little or no trap.
- Blue: moderate friction; one notable Spanish term, local wording, image cue, or small rule detail, but the concept remains familiar after support.
- Yellow: high expected difficulty; specific CABA rule, exact number, unfamiliar legal/administrative language, CABA/RF mismatch, image cue, or trap likely to cause errors.
- Red: highest expected difficulty; multiple difficulty dimensions at once, strong Russian-practice mismatch, rare Spanish/legal terms, subtle trap, non-obvious exception, or question wording that demands deliberate review.

## Role Boundaries Or Affected Actors

- Analyst: writes only this intake artifact and stops.
- Architect: turns this intake into `spec.md`, `plan.md`, and `tasks.md`; finalizes the difficulty rubric, data model, UI scope, validation requirements, migration strategy, and review requirements.
- Implementation Agent: after complete feature memory exists, performs content/data/UI/validation/test changes in an assigned isolated worktree and keeps `tasks.md` current.
- Review Agent: verifies that all items are labeled, criteria are applied consistently, validation is meaningful, UI is accessible and subtle, and `010` behavior/source-of-truth is preserved.
- Learner: sees difficulty as a lightweight orientation aid, not a scary warning or official judgment.

## Artifact And Handoff Expectations

- Analyst writes only `specs/017-difficulty-labeling/feature-request.md`.
- Architect starts from this artifact and creates `spec.md`, `plan.md`, and `tasks.md`.
- The future feature memory must explicitly name goal, scope, acceptance criteria, negative scenarios, verification evidence, and parallel-work risks.
- Implementation must not start until `feature-request.md`, `spec.md`, `plan.md`, and `tasks.md` exist.
- Handoff context for Orchestrator: use the assigned `017` worktree/branch and coordinate with unmerged or parallel work from `010`, `013`, `015`, and `016` before assigning implementation slices.

## Open Questions And Risks

- The exact data owner for difficulty is open: Architect should decide whether difficulty belongs directly in canonical question/topic JSON, in a separate difficulty manifest, or in a derived-plus-authored hybrid.
- The existing `Question.difficulty` field may cause ambiguity. Leaving it alongside a new four-color field without migration would create a source-of-truth conflict.
- Difficulty is subjective. The risk is manageable only if criteria, rationale/dimension flags, and validation make labels reviewable.
- Manual labeling of all 460 observed questions plus 38 observed topics is a large content edit and may conflict with parallel content review/language-review branches.
- Color scale risks accessibility issues. UI must include text/ARIA labels and sufficient contrast, and must not communicate difficulty by color alone.
- Green/red colors can be confused with correctness, status, or pass/fail. Visual design must separate difficulty from answer correctness, source status, and learner progress.
- Active exam mode has strict support boundaries from `010`. Difficulty display during active exam must be explicitly allowed or deferred by Architect so it does not become answer-help scaffolding.
- UI clutter is likely if every surface uses full labels. Architect should define compact variants, such as dot-only with accessible label where context already has a legend.
- Topic/material difficulty may change when guide content changes. Validation should catch missing/stale topic labels or decide a deterministic derivation rule.
- If feature `010` is not merged when implementation begins, source-of-truth docs and UI behavior should be read from its branch/feature memory and coordinated through Orchestrator rather than overwritten.

## Acceptance Expectations

Architect should convert these into formal acceptance criteria:

- A canonical four-level difficulty scale exists with allowed values matching green, blue, yellow, red semantics.
- The difficulty criteria are documented in feature memory and, if behavior/schema becomes durable, in `docs_project/`.
- The criteria explicitly account for Spanish term difficulty, lexical complexity, CABA/RF rule differences, non-obvious rules, numerical memorization, image interpretation, negation/exception wording, and exam traps.
- Every current canonical question/ticket has exactly one validated difficulty level.
- Every current topic/material in the topic study guide has exactly one validated difficulty level.
- Existing three-level question difficulty is removed, migrated, or explicitly superseded so there is no conflicting source of truth.
- Difficulty labels include enough rationale, dimensions, or provenance for review; labels are not arbitrary colors without explanation.
- Data validation fails for missing, invalid, duplicate, stale, or orphan difficulty records.
- Validation covers topic/material difficulty as well as question/ticket difficulty.
- TypeScript/content data boundaries expose difficulty metadata without runtime network calls or backend dependencies.
- UI displays difficulty subtly but visibly in all relevant learner surfaces, including question cards, mistake review, material topic list/detail, material ticket blocks, search/list contexts, and exam/review surfaces as allowed by `010`.
- UI labels are accessible: not color-only, keyboard/screen-reader friendly where interactive, sufficient contrast, and no text overflow on mobile.
- Difficulty UI does not imply official source status, correctness, learner progress, or "marked difficult" state.
- Active exam support restrictions from `010` remain intact.
- `Материалы` from `008` remain draft/incomplete unofficial support while those statuses remain; difficulty does not make them look official or final.
- Existing `unofficial_b_fallback` status remains visible and not contradicted by difficulty wording.
- Tests or validation evidence prove all required questions and topics are labeled.
- E2E or component evidence proves difficulty renders in representative question and material surfaces without breaking existing navigation.
- Local verification commands defined by Architect pass or record exact unrelated blockers, including at minimum content validation, unit tests, build, e2e where UI changes are included, preflight, and `git diff --check`.
