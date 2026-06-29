# Feature Request: Surface Existing Conflict Notes In Manual Ticket Appendices

## Intake Context

- Analyst role: explicitly assigned by Orchestrator for this repository-changing follow-up intake only.
- Assigned repository/worktree: `/Users/chap/devel/cabadrive-worktrees/038-manual-ticket-placement`.
- Assigned branch: `codex/038-manual-ticket-placement`.
- Active PR: `#204`.
- Current PR/head supplied by Orchestrator and verified locally: `944f7e1799ba1d925bcac6983a912abb00b74eb1`.
- Latest `origin/main` verified by Orchestrator and local read-only check: `4247b0e90ae5799a0875cc3751c96589fef96ef2`.
- Existing maximum numeric prefix observed under `specs/`: `038`; this intake creates `specs/039-manual-ticket-conflict-notes/`.
- Parallel-work warning: other Orchestrators, agents, branches, worktrees, commits, PRs, dirty diffs, and process-memory updates may exist. Preserve all sibling work and do not mutate anything outside this Analyst artifact.
- Analyst artifact boundary: create exactly this `feature-request.md`; do not create `spec.md`, `plan.md`, `tasks.md`, code, tests, durable docs, commits, pushes, reviews, PR-state changes, or merge actions.

## Base And Fallback Evidence

Normal repository-changing work starts from latest verified `main`, normally `origin/main` after fetch/base verification. That latest-main base is verified as:

- `origin/main`: `4247b0e90ae5799a0875cc3751c96589fef96ef2`.

This follow-up is intentionally recorded as a dependent PR-head follow-up instead of a direct latest-main implementation because the target code path exists in unmerged PR `#204`, not in latest `origin/main`. The behavior under review depends on the current PR implementation of:

- `CanonicalStudyTicketBlock`;
- `TopicGuideTicketBlock`;
- `ManualTicketAppendix`;
- route-end manual appendices introduced by feature `038`.

The dependent PR head for this intake is:

- PR `#204` current head: `944f7e1799ba1d925bcac6983a912abb00b74eb1`.

This fallback must be preserved by Architect and Implementation Agent planning: implementation must target the PR `#204` code path and must not silently pretend that latest `origin/main` alone contains the manual ticket appendix runtime being fixed.

## Original / Current Request

Continue PR `#204` to full completion by addressing the remaining AI Review blocker after feature `038-manual-ticket-placement` reached the Architect return limit.

The active feature `038` task memory records `F038-RA-010` as `blocked-escalation` because Architect return count is already `10 / 10`. The trusted connector finding is valid on the merits, but accepting another implementation return inside feature `038` would exceed the configured return limit. This new intake exists to authorize a separate follow-up cycle for that narrow blocker.

Current unresolved trusted connector threads on PR `#204`:

1. `PRRT_kwDOSX65IM6MtZ8i` / `discussion_r3485853526`, `src/App.tsx` line `1173`: manual appendices call `CanonicalStudyTicketBlock` with only `questionId`, so `sourceConflictNoteRu` warnings from `Материалы` are suppressed in `Руководство` manual cards.
2. `PRRT_kwDOSX65IM6MtmnZ` / `discussion_r3485901148`, `src/App.tsx` line `1128`: duplicate/current-head version of the same issue. Cited examples include `b-fallback-024`, `b-fallback-135`, `b-fallback-309`, and `b-fallback-456`.

No normal-flow user clarification is needed. Orchestrator supplied enough context; remaining uncertainties are implementation-design choices for Architect disposition.

## Problem

The shared ticket card currently renders source-conflict warnings only when it receives a `TopicGuideTicket` object through `topicTicket`.

Observed current PR behavior:

- `TopicGuideTicketBlock` calls `CanonicalStudyTicketBlock` with `questionId` and `topicTicket={ticket}`.
- `CanonicalStudyTicketBlock` renders the warning block only when `topicTicket?.sourceConflictNoteRu` is present.
- `ManualTicketAppendix` maps manual appendix records by `questionId` and calls `CanonicalStudyTicketBlock` with only `questionId`.
- Therefore, the same canonical ticket can show an existing stale-source/canonical-answer caveat in `Материалы` but omit that caveat in `Руководство`.

This is a learner-facing correctness and trust issue. Manual appendix cards are appended under official-looking manual content, so suppressing an existing warning can make outdated or source-conflicted canonical answer context look cleaner and more authoritative than it is.

## Source Examples

`content/guide/topic-study-guide.ru.json` already carries `sourceConflictNoteRu` for note-bearing tickets, including:

- `b-fallback-024`: old `cédula azul` wording; current sources say `cédula azul no es exigible`, and third-party vehicle use can rely on physical Cédula de Identificación and/or digital Mi Argentina authorization.
- `b-fallback-135`: old VTV timing question; the ticket answer uses `36 meses / 60.000 km`, while current CABA sources use the fourth year or `64.000 km`.
- `b-fallback-309`: old question about number of `cédula azul`; current logic says `cédula azul no es exigible`, with physical Cédula de Identificación and/or Mi Argentina authorization.
- `b-fallback-456`: old image-backed cédula question; current learning logic teaches physical Cédula de Identificación and/or Mi Argentina authorization, not automatic right based on surname.

These examples are not a complete source list. Implementation should use the governed topic-guide data as the current source of note-bearing `questionId` records rather than hard-coding only these four IDs.

## Request Classification

This is one narrow repository-changing follow-up for PR `#204`:

- make manual appendix cards surface existing source-conflict notes already available to `Материалы`;
- keep feature `038` ticket placement, mapping semantics, canonical ticket content, and manual content unchanged.

It should not be split into multiple feature folders because the customer outcome is one specific review-blocker fix: the same warning context that already exists for a canonical ticket must be visible when that ticket appears in the manual appendix.

## Project And Repository Context

- Cabadrive is a static local-first React/TypeScript/Vite trainer for Russian-speaking drivers preparing for the CABA theory exam.
- There is no runtime backend; all ticket, manual, and guide data must remain bundled local content.
- The current practice bank remains `unofficial_b_fallback`, not a complete official GCBA question bank.
- `Материалы` renders topic-study tickets from `content/guide/topic-study-guide.ru.json` and already carries per-ticket warning notes through `sourceConflictNoteRu`.
- Feature `038` adds ticket appendices to `Руководство`, joining manual placement records to canonical question IDs.
- Feature `038` intentionally keeps manual appendices read-only and canonical; manual placement data must not override canonical question text, answers, translations, explanations, images, or correct-answer identity.

## Goal

When a ticket appears in a `Руководство` manual appendix and the existing Materials topic-guide data has a `sourceConflictNoteRu` warning for the same canonical `questionId`, the manual card should surface that same warning note.

The learner should receive consistent warning context across `Материалы` and `Руководство` without changing the ticket, the manual, the placement mapping, or the source-conflict note text.

## Scope

In scope:

- Identify the existing governed `sourceConflictNoteRu` notes by canonical `questionId` from the topic-guide data.
- Pass those notes, or an equivalent adapter object, into manual appendix card rendering.
- Keep `Материалы` behavior unchanged.
- Render the same warning note on manual appendix cards for note-bearing question IDs.
- Ensure no-note manual cards do not render empty, placeholder, duplicated, or stale warning blocks.
- Add focused tests or equivalent verification for at least one note-bearing manual appendix question and at least one no-note manual appendix question.
- Preserve the shared renderer contract and manual appendix read-only behavior.
- Keep process memory current through the Architect/Implementation/Review/final-validation flow.

Out of scope:

- Changing canonical Spanish ticket text, answer options, answer order, correct answer, Russian translations, explanations, difficulty, source metadata, or image paths.
- Changing protected manual prose, manual images, manual section ordering, route eligibility, or ticket placement records.
- Editing `content/guide/topic-study-guide.ru.json` warning text or adding new conflict notes as part of this fix.
- Reclassifying or re-auditing manual ticket placements from feature `038`.
- Changing appendix density/disclosure behavior, route placement, unofficial-practice status labeling, or unrelated UI behavior except as strictly necessary to show the existing warning note.
- Introducing runtime AI, network fetches, backend services, remote content, or runtime semantic matching.
- Resolving unrelated PR review threads or bypassing required checks/final validation.

## Acceptance Expectations

The follow-up is successful only when all of the following are true:

1. Manual appendix cards for note-bearing question IDs render the same `sourceConflictNoteRu` warning note available in `Материалы`.
2. The examples `b-fallback-024`, `b-fallback-135`, `b-fallback-309`, and `b-fallback-456` are covered by the implementation design or focused verification when those IDs are present on manual appendix destinations.
3. Manual appendix cards for question IDs without `sourceConflictNoteRu` do not render an empty, placeholder, duplicated, or stale warning area.
4. `Материалы` ticket rendering remains unchanged, including existing warning-note behavior.
5. Manual appendices remain read-only and keep canonical ticket joins.
6. No canonical ticket/manual/placement content is changed.
7. No protected manual text, image, route, or placement evidence is changed.
8. The source-conflict note is sourced from existing governed topic-guide data or an explicit deterministic projection of that data, not from manual placement records or hard-coded test fixtures.
9. Runtime remains local-first and uses only bundled local data/assets.
10. Required checks and AI Review pass on the current PR head after implementation.
11. Process memory is current, including the dependent PR-head fallback evidence and the fact that feature `038` escalated because accepting another Architect return there would exceed `10 / 10`.

## Negative Scenarios

- Manually duplicating warning text into manual placement shards, canonical question records, or manual section files.
- Changing canonical answers or explanations to avoid needing a conflict warning.
- Showing a warning note in `Материалы` but suppressing it in `Руководство` for the same canonical `questionId`.
- Rendering an empty warning block for tickets that have no `sourceConflictNoteRu`.
- Hard-coding only the four cited example IDs instead of deriving note-bearing records from the governed guide data.
- Moving, removing, or altering manual ticket appendix placement, density, or disclosure behavior as an incidental side effect.
- Changing protected manual content or ticket placement mappings.
- Treating this follow-up as a fresh latest-main-only implementation while ignoring that the target manual appendix code is unmerged in PR `#204`.
- Declaring completion while AI Review remains red or the duplicate/current-head connector thread remains unresolved.

## Assumptions

- The desired source of truth for warning text is the existing `sourceConflictNoteRu` field in `content/guide/topic-study-guide.ru.json`.
- If the same `questionId` appears in multiple topic-guide contexts, the implementation should choose a deterministic and validated note lookup. If note text differs for the same `questionId`, Architect should require validation to fail or require an explicit deterministic conflict disposition rather than choosing silently.
- Manual appendices should display the note because the ticket card is the learner-facing context, not because the manual page itself changes.
- The four cited IDs are representative review examples, not an exhaustive list of note-bearing tickets.
- No additional user clarification is required before architecture.

## Risks

- A naive lookup may miss note-bearing tickets if the topic-guide data is nested or repeated.
- A hard-coded map can drift as topic-guide warning notes change.
- Passing a partial `topicTicket` object could accidentally alter explanations, image path selection, or other `Материалы`-specific behavior in manual cards.
- Reusing a full `TopicGuideTicket` record could unintentionally make manual cards depend on topic-specific data beyond the warning note.
- If the same `questionId` has conflicting notes across topic-guide sections, silent last-write-wins behavior would hide a content governance issue.
- Focused tests may pass for the four cited examples while other note-bearing IDs remain uncovered unless the implementation validates the full note lookup.

## Open Questions For Architect Disposition

- Should the shared component accept a narrow `sourceConflictNoteRu` prop, a small canonical warning adapter keyed by `questionId`, or a fuller `topicTicket` object for manual cards?
- Should validation enforce that each `questionId` has at most one unique `sourceConflictNoteRu` across the topic-guide corpus?
- Which manual destination(s) should focused runtime/browser tests use for the cited note-bearing IDs currently present in PR `#204` placements?
- Is a unit/source test sufficient for this review blocker, or should focused Playwright also verify the warning in an actual manual appendix route?

## Validation Expectations

Expected verification should include:

- focused source/unit tests proving manual appendix rendering receives and displays existing notes for note-bearing IDs;
- a negative test proving no-note IDs do not render an empty warning block;
- a regression proving `Материалы` still passes `topicTicket` and shows existing notes unchanged;
- a deterministic check that the manual warning lookup is derived from bundled topic-guide data and does not duplicate canonical ticket/manual/placement content;
- `git diff --check`;
- `pnpm run validate:manual-ticket-placement`;
- the relevant focused test command chosen by Architect/Implementation Agent;
- any Orchestrator-required build, preflight, and PR required checks, including AI Review.

## Sources Read During Intake

- `AGENTS.md`
- `.specify/memory/constitution.md`
- `docs_project/README.md`
- `docs_project/project-idea.md`
- `docs_project/project/frontend/frontend-docs.md`
- `docs_project/project/backend/backend-docs.md`
- `docs_project/project/feature-inventory.md`
- `docs_project/screens/learning-and-exam-flows.md`
- `docs/specify/README.md`
- `specs/038-manual-ticket-placement/feature-request.md`
- `specs/038-manual-ticket-placement/spec.md`
- `specs/038-manual-ticket-placement/plan.md`
- `specs/038-manual-ticket-placement/tasks.md`
- `src/App.tsx` references for `CanonicalStudyTicketBlock`, `TopicGuideTicketBlock`, `ManualTicketAppendix`, and `sourceConflictNoteRu`
- `content/guide/topic-study-guide.ru.json` references for `b-fallback-024`, `b-fallback-135`, `b-fallback-309`, `b-fallback-456`, and `sourceConflictNoteRu`

No external research was needed. The review blocker, active PR code, and local repository memory provide the necessary context.

## Analyst Handoff

This intake is ready for Orchestrator handoff to Architect.

The controlling intent is narrow: unblock PR `#204` by making manual appendix ticket cards surface the same existing `sourceConflictNoteRu` warnings that `Материалы` already shows for the same canonical question IDs, while preserving all canonical content, protected manual content, placement mappings, `Материалы` behavior, local-first runtime constraints, required checks, and role/process boundaries.
