# Spec: Learning Materials UI

## Analyst Intake

- Source request: `feature-request.md`.
- Assigned feature: `008-learning-materials-ui`.
- Assigned worktree: `/Users/chap/devel/cabadrive-008-learning-materials-intake`.
- Assigned branch: `codex/008-learning-materials-intake`.
- Architect scope: feature memory only. Product code, tests, runtime files, durable `docs_project/` docs, `006` feature memory, commits, pushes, and PRs are out of scope for this Architect pass.

## Goal

Add a learner-facing web UI section that exposes the existing topic study guide materials created by request `006` as a separate in-app learning materials area, reachable from top navigation and organized by the existing topic sections.

## Scope

In scope for the future implementation slice:

- Import the existing structured topic guide artifacts:
  - `content/guide/topic-study-guide.ru.json`;
  - `content/guide/topic-study-guide.coverage.json` where needed for topic/placement status;
  - `content/guide/topic-study-guide.source-trace.json` only if compact learner-facing source/status context is needed.
- Add a new top navigation control for the topic learning materials section.
- Add a dedicated topic guide view or equivalent separate UI surface without replacing the current CABA/RF guide.
- Render a topic list from the `006` topic guide data.
- Let the user open a topic detail view from the list.
- Render topic detail content in the `006` sequence:
  - concise Russian learning material;
  - practical reasoning where present;
  - Spanish terms and Russian meanings;
  - canonical ticket blocks;
  - trap notes where present.
- Join each guide ticket block to canonical question data so Spanish question text, answer options, correct answer, source status, and local image paths come from the canonical question records.
- Render answer explanations from the topic guide ticket block, including correct and incorrect answer explanations where present in existing data.
- Preserve local-first/offline behavior: no backend, no runtime network fetch, no raw PDF viewer.
- Preserve status clarity:
  - topic guide material is unofficial Russian learning support;
  - current practice questions are `unofficial_b_fallback`;
  - draft/incomplete guide state is visible if the guide remains `draft`.
- Add focused unit and/or e2e coverage proving navigation, rendering, canonical question joins, local image rendering, and offline-safe behavior.
- Update durable behavior documentation only if the UI navigation or learning-flow documentation changes.
- Keep process memory current in this `008` feature memory during implementation.
- Close or explicitly cross-reference `006` Slice F tasks T061-T067 from this `008` UI implementation without editing `specs/006-topic-study-guide/*`.

Out of scope:

- Creating, rewriting, researching, or validating new topic guide content.
- Editing `specs/006-topic-study-guide/*`.
- Changing the 006 taxonomy, coverage baseline, source trace model, official-documents archive, or validators except where a narrow typed import/render contract exposes an already-valid field.
- Replacing the existing condensed CABA/RF guide.
- Claiming the fallback question set is official or complete.
- Adding raw PDF viewing, server rendering, a runtime backend, runtime network calls, cloud sync, analytics, or remote content delivery.
- Reworking existing learning, exam, mistakes, vocabulary, search, storage, or progress behavior outside what is needed for navigation coexistence.

## Non-Goals

- This feature is not a full content publication gate for the entire `006` topic guide.
- This feature is not a legal/source research pass.
- This feature is not a redesign of Cabadrive navigation beyond one additional top-level section.
- This feature is not a Spanish course, broad driving manual, or replacement for official source material.

## Assumptions

- The `006` topic guide artifacts are the source of truth for the new materials UI.
- The guide currently has `status: "draft"` and `contentStatus: "unofficial_learning_aid"`; the UI must not present it as final or official while those metadata values remain.
- The current app uses React state-based views rather than routing; a new view value is the conservative default unless implementation finds an established local routing pattern.
- The new top navigation label should be short Russian UI text, preferably `Материалы`, because it distinguishes this topic guide from `Учить` practice mode and the existing `CABA/RF` guide.
- The existing CABA/RF condensed guide remains a separate tab for this slice.
- Source-trace and official-document archive details are validation/maintainer data by default. The learner UI may show compact source/status wording, but should not become an archive browser.
- Large topics may be rendered as a single detail page initially if the layout remains scan-friendly on mobile; pagination or virtualization is not required unless implementation evidence shows performance or usability issues.

## User Stories

### User Story 1

As a Russian-speaking learner, I want a top navigation button for topic materials, so that I can open the structured guide without leaving the trainer.

### User Story 2

As a learner preparing quickly, I want to browse the topic list created by the guide work, so that I can choose one exam-relevant topic at a time.

### User Story 3

As a learner inside a topic, I want Russian material, practical reasoning, ticket Spanish terms, and trap notes together, so that I can study the pattern behind a group of questions.

### User Story 4

As a learner checking a ticket block, I want to see the canonical Spanish question text, answer options, correct answer, local image when available, and Russian answer explanations, so that guide study stays aligned with the actual practice question.

### User Story 5

As a maintainer, I want the UI to import existing structured data rather than duplicate question text, so that future content fixes do not drift between guide and practice modes.

## Acceptance Criteria

1. Given the app loads, top navigation includes a new `Материалы` or equivalent learning-materials button.
2. Given the user activates the new button, the app opens a separate topic learning materials section rather than the existing learn, exam, mistakes, vocabulary, or CABA/RF view.
3. Given the topic learning materials section is open, the existing `Учить`, `Экзамен`, `Ошибки`, `Словарь`, and `CABA/RF` flows remain reachable.
4. Given the section renders, the topic list comes from `content/guide/topic-study-guide.ru.json` and reflects the existing 006 topic sections.
5. Given the guide metadata remains `draft`, the section visibly labels the materials as draft/incomplete and unofficial learning support.
6. Given the current content mode remains `unofficial_b_fallback`, the section does not imply official or complete GCBA category B question-bank coverage.
7. Given a user opens a topic, the topic detail renders the topic title, summary, Russian learning material, practical reasoning where present, Spanish terms, ticket blocks, and trap notes where present.
8. Given a topic contains Spanish terms, each rendered term shows the Spanish text and Russian meaning from the guide data.
9. Given a topic contains a ticket block, the UI joins that block to canonical question data and renders the Spanish question text from the canonical question record.
10. Given a topic ticket block is rendered, answer options and the correct answer come from canonical question data.
11. Given answer explanations exist in the topic guide data, the UI renders the explanation for the correct answer and for incorrect alternatives.
12. Given the canonical question has a local image, the guide ticket block renders that local image with `assetUrl`/local asset semantics.
13. Given a guide ticket references a missing canonical question or answer ID, tests or validation fail or the UI renders an explicit non-crashing missing-content state that is covered by tests.
14. Given a ticket is physically present in two topic sections in existing guide data, e2e or DOM evidence proves the full ticket block can render in both topic detail pages.
15. Given the user uses the section after build, no raw PDF viewer, runtime network fetch, backend endpoint, or remote asset is required.
16. Given implementation is complete, focused tests cover new navigation reachability, topic list/detail rendering, canonical ticket joins, local image rendering, and draft/unofficial status clarity.
17. Given local verification runs, `pnpm run validate:content`, `pnpm run test`, `pnpm run build`, `pnpm run test:e2e`, `pnpm run preflight`, and `git diff --check` pass or record exact unrelated blockers.
18. Given process memory is inspected, `specs/008-learning-materials-ui/tasks.md` records implementation decisions, verification evidence, known issues, and that the `008` UI work closes/cross-references `006` Slice F tasks T061-T067.

## Negative Scenarios

- A button that opens the old `CABA/RF` guide instead of the topic study guide does not satisfy this feature.
- A topic materials section that copies Spanish question text into new UI-only data instead of joining canonical questions is not acceptable.
- A guide UI that hides the `draft`/unofficial status and looks like final official material is not acceptable.
- A guide UI that claims the current fallback question set is official or complete is not acceptable.
- A topic page that omits canonical ticket answer options or correct-answer indication is incomplete.
- A topic page that shows only links to practice questions instead of rendering the full guide ticket block is incomplete for assigned rendered tickets.
- A ticket with a canonical local image that does not render the image in the guide block fails the image requirement.
- A solution that fetches PDFs, remote URLs, or API data at runtime violates the local-first contract.
- A solution that removes or replaces existing learn/exam/mistakes/vocabulary/CABA-RF flows is out of scope.
- A solution that edits `specs/006-topic-study-guide/*` violates this assignment boundary.

## Functional Requirements

- FR-001: Add typed imports for the topic guide artifacts through the existing content data boundary.
- FR-002: Define TypeScript types for the subset of topic guide data used by the UI, including guide metadata, topics, Spanish terms, ticket blocks, answer explanations, trap notes, and status fields.
- FR-003: Add a distinct app view for learning materials/topic guide navigation.
- FR-004: Add a top navigation button for the new view while preserving existing navigation entries.
- FR-005: Render a topic list ordered according to the guide data order.
- FR-006: Support selecting/opening a topic detail view inside the app.
- FR-007: Render topic detail sections from structured guide data without parsing raw Markdown/PDF or performing runtime network requests.
- FR-008: Join guide ticket blocks to canonical `Question` records by `questionId`.
- FR-009: Join answer explanations to canonical answer options by `answerId`.
- FR-010: Render local question images from canonical `question.image.localPath` or the existing guide ticket image path only when it matches local offline asset semantics.
- FR-011: Render missing join data gracefully and test at least one missing-data path if implementation exposes fallback behavior.
- FR-012: Surface guide `status` and `contentStatus` in learner-friendly Russian wording.
- FR-013: Surface current content-mode fallback status consistently with existing product-level rules.
- FR-014: Keep active exam attempts free of translation/explanation support changes; this feature must not alter exam behavior.
- FR-015: Add automated coverage for the new UI section and update existing e2e coverage that currently assumes only vocabulary and CABA/RF guide are available.
- FR-016: Record verification evidence and decisions in `tasks.md`.

## Verification Requirements

- Use the existing local commands:
  - `pnpm run validate:content`;
  - `pnpm run test`;
  - `pnpm run build`;
  - `pnpm run test:e2e`;
  - `pnpm run preflight`;
  - `git diff --check`.
- Add e2e evidence that:
  - the new top navigation button opens the materials section;
  - at least one topic detail renders the required sequence;
  - at least one canonical ticket block renders Spanish text, answers, correct answer, and answer explanations;
  - at least one local question image renders inside the topic guide;
  - a dual-topic ticket renders as a full block in both topics when such ready data exists;
  - no runtime network/PDF viewer dependency is introduced.
- Add unit or component-level coverage where practical for join helpers, missing references, topic filtering/selection, or status-label helpers.
- Record exact command output summaries and any unrelated blockers in `tasks.md`.

## Review Requirements

- Review Agent must check that product changes stay within the `008` UI slice.
- Review Agent must check that `specs/006-topic-study-guide/*` was not edited by the implementation PR.
- Review Agent must check that the UI imports existing `006` artifacts and canonical questions rather than duplicating canonical ticket text.
- Review Agent must check that draft/unofficial/fallback clarity is visible and not contradicted by headings or empty-state copy.
- Review Agent must check that no runtime network fetch, backend dependency, raw PDF viewer, or external image URL is used.
- Review Agent must check that `tasks.md` contains implementation process memory and verification evidence before merge readiness.
