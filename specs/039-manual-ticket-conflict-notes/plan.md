# Plan: Manual Ticket Source-Conflict Notes

## Current Cycle Status

- Feature: `039-manual-ticket-conflict-notes`.
- Role: Architect planning only; no final Architect validation is performed here.
- Active PR: `#204`.
- Branch/worktree: `codex/038-manual-ticket-placement` at `/Users/chap/devel/cabadrive-worktrees/038-manual-ticket-placement`.
- Current PR head supplied by Orchestrator: `944f7e1799ba1d925bcac6983a912abb00b74eb1`.
- Verified latest `origin/main`: `4247b0e90ae5799a0875cc3751c96589fef96ef2`.
- Feature `038` status: `F038-RA-010` is valid on the merits but blocked/escalated because the feature `038` Architect return count is already `10 / 10`.
- Feature `039` purpose: narrow dependent PR-head follow-up for the unresolved manual-card conflict-note blocker.

## Constraints

- Preserve all existing dirty diffs, branches, commits, PR memory, and sibling work.
- Work against PR `#204` head because `ManualTicketAppendix` does not exist on latest `origin/main`.
- Do not edit feature `038` process memory as part of this feature unless Orchestrator/Architect later records a specific need.
- Do not edit content, manual placement data, manual section files, or durable docs outside feature `039`.
- Do not alter Materials behavior except for the shared renderer internals needed to support the narrow note prop.

## Allowed Implementation Agent Files

Implementation Agent may edit only:

- `src/App.tsx`
- `tests/manual-ticket-placement.test.mjs`
- `tests/e2e/manual-ticket-placement.spec.ts`
- `specs/039-manual-ticket-conflict-notes/tasks.md`

Implementation Agent should avoid:

- `content/guide/topic-study-guide.ru.json`
- `content/manual-ticket-placement/**`
- `src/data/manualTicketPlacement.ts`
- `src/data/content.ts`
- `src/data/manual-sections/**`
- `docs_project/**`
- `specs/038-manual-ticket-placement/**`

If implementation evidence proves another file is required, stop and record feedback in `tasks.md` for Orchestrator/Architect disposition before editing it.

## Technical Approach

1. Add a small source-conflict-note lookup helper in `src/App.tsx`.
   - Input: `data.topicStudyGuide.topics`.
   - Output: `Map<string, string>` keyed by canonical `questionId`.
   - Include a deterministic duplicate guard: repeated identical note text is allowed; divergent note text for the same `questionId` throws an explicit error naming the ID.

2. Extend `CanonicalStudyTicketBlock` with a narrow optional `sourceConflictNoteRu` prop.
   - Resolve the displayed note from `sourceConflictNoteRu ?? topicTicket?.sourceConflictNoteRu`.
   - Render the existing "Заметка о старой формулировке" block only when the resolved note is truthy.
   - Do not change explanation, image, translation, answer, difficulty, source footer, or missing-question behavior.

3. Keep `TopicGuideTicketBlock` unchanged in intent.
   - It should still pass the full `topicTicket` because Materials owns topic-specific answer explanations and existing conflict-note behavior.

4. Update `ManualTicketAppendix`.
   - For each `questionId`, pass `sourceConflictNoteRu={manualTicketSourceConflictNoteByQuestionId.get(questionId)}`.
   - Do not pass `topicTicket` to manual cards.
   - Keep current density/disclosure behavior, card ordering, keying, lazy image loading, and status label behavior unchanged.

5. Add focused tests.
   - Source/unit coverage in `tests/manual-ticket-placement.test.mjs` should prove the source contract and duplicate guard.
   - Browser coverage in `tests/e2e/manual-ticket-placement.spec.ts` should use `#manual-section-ch2-required-documents`, which currently contains all four note-bearing IDs plus no-note fixture `b-fallback-027`.

## Test Fixture Plan

Current runtime placement evidence from `content/manual-ticket-placement/manual-ticket-placement.runtime.json`:

- `b-fallback-024` -> `ch2-required-documents`
- `b-fallback-135` -> `ch2-required-documents`
- `b-fallback-309` -> `ch2-required-documents`
- `b-fallback-456` -> `ch2-required-documents`
- no-note fixture: `b-fallback-027` -> `ch2-required-documents`

`ch2-required-documents` currently has 17 tickets, so the Playwright test must open the native disclosure before checking cards.

Recommended browser assertions:

- navigate to `/#manual-section-ch2-required-documents`;
- assert appendix page ID and collapsed state;
- open the disclosure;
- assert each cited manual ticket card contains "Заметка о старой формулировке" and a distinctive substring from its note;
- assert `manual-ticket-b-fallback-027` does not contain the warning label;
- navigate to Materials and assert the Materials adapter still renders ticket cards.

## Required Checks

Implementation Agent should run, at minimum:

```bash
git diff --check
pnpm run validate:manual-ticket-placement
pnpm run test -- tests/manual-ticket-placement.test.mjs
pnpm run test:e2e -- tests/e2e/manual-ticket-placement.spec.ts
```

If the repository test runner does not support path arguments in that exact form, use the closest existing focused commands and record the actual command/result in `tasks.md`.

Orchestrator may require broader verification before completion, including:

```bash
pnpm run validate:content
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run preflight
```

Required GitHub checks from `.unicorn-hub/config.json` remain:

- `baseline-checks`
- `docker-validation`
- `guard`
- `AI Review`
- `osv-scan`

## Review Requirements

Review Agent should verify:

- manual conflict notes are derived from topic-study-guide data;
- manual cards do not receive `topicTicket`;
- no Materials behavior regresses;
- no protected manual, placement, canonical content, or feature `038` process memory is changed;
- no last-write-wins duplicate-note behavior is introduced;
- tests cover both note-bearing and no-note manual cards.

## Handoff

After implementation, Orchestrator should obtain fresh review/current-head disposition for both duplicate connector threads, verify required checks, and only then invoke final Architect validation followed by final Analyst validation for the appropriate effective content head.
