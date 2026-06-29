# Spec: Surface Source-Conflict Notes In Manual Ticket Appendices

## Role And Status

- Current role: Architect, explicitly assigned by Orchestrator for feature `039-manual-ticket-conflict-notes`.
- Scope boundary: Architect owns only `specs/039-manual-ticket-conflict-notes/spec.md`, `plan.md`, and `tasks.md`.
- This document is planning only. It is not final Architect validation.
- Dependent PR/worktree: PR `#204`, branch `codex/038-manual-ticket-placement`, worktree `/Users/chap/devel/cabadrive-worktrees/038-manual-ticket-placement`.
- Latest verified `origin/main`: `4247b0e90ae5799a0875cc3751c96589fef96ef2`.
- Current PR head supplied by Orchestrator: `944f7e1799ba1d925bcac6983a912abb00b74eb1`.
- Dependency note: this is intentionally a dependent PR-head follow-up because `ManualTicketAppendix` and the shared `CanonicalStudyTicketBlock` path exist only in unmerged PR `#204`.
- Parallel-work warning: other Orchestrators, agents, branches, worktrees, commits, PRs, dirty diffs, and process-memory updates may exist; preserve all sibling work.

## Problem

PR `#204` added canonical ticket appendices to `Руководство`, but the current shared renderer displays `sourceConflictNoteRu` only through `topicTicket?.sourceConflictNoteRu`.

Current behavior:

- `TopicGuideTicketBlock` renders Materials cards by passing `topicTicket={ticket}` into `CanonicalStudyTicketBlock`.
- `ManualTicketAppendix` renders manual cards by passing only `questionId`.
- Therefore Materials can show the existing stale-source/canonical-answer warning for a ticket, while the same ticket in `Руководство` omits that warning.

The unresolved trusted connector threads are duplicate reports of this same behavior:

- `PRRT_kwDOSX65IM6MtZ8i` / `discussion_r3485853526`
- `PRRT_kwDOSX65IM6MtmnZ` / `discussion_r3485901148`

Feature `038` recorded the valid issue as `F038-RA-010` but could not accept another implementation return because the Architect return count had reached `10 / 10`. Feature `039` is the narrow follow-up cycle for this blocker.

## Goal

When a canonical ticket appears in a `Руководство` manual appendix and the governed topic-study guide has a `sourceConflictNoteRu` for the same `questionId`, the manual card must render that same warning note.

The fix must preserve all existing ticket content, manual content, placement mapping, Materials behavior, and local-first runtime constraints.

## In Scope

- Derive a deterministic note-only lookup from `data.topicStudyGuide.topics[*].tickets[*].sourceConflictNoteRu`, keyed by canonical `questionId`.
- Pass the resolved note into manual appendix cards through a narrow renderer prop.
- Keep `TopicGuideTicketBlock` behavior unchanged for Materials: it continues passing `topicTicket`, and the conflict note for Materials continues resolving from `topicTicket.sourceConflictNoteRu`.
- Keep manual cards from receiving full `TopicGuideTicket` records.
- Add focused validation/test coverage for all currently note-bearing IDs:
  - `b-fallback-024`
  - `b-fallback-135`
  - `b-fallback-309`
  - `b-fallback-456`
- Add at least one no-note manual-card regression; current fixture: `b-fallback-027` on `ch2-required-documents`.
- Add a deterministic guard so duplicate `questionId` notes in the topic guide cannot silently choose a last writer if note text differs.
- Update feature `039` task memory with implementation evidence.

## Out Of Scope

- Editing canonical questions, answers, answer order, correct answer IDs, Russian translations, Russian explanations, difficulty, source metadata, or question image paths.
- Editing `content/guide/topic-study-guide.ru.json` warning text or adding new conflict notes.
- Editing manual prose, manual images, manual section modules, manual routing, or manual ticket placement records.
- Editing `content/manual-ticket-placement/**` or feature `038` process memory for this fix.
- Changing appendix density/disclosure thresholds, placement order, route eligibility, or the existing route-end appendix behavior.
- Passing a full `TopicGuideTicket` object to manual cards.
- Adding runtime network fetches, backend services, live AI, or runtime semantic matching.
- Resolving unrelated PR review threads.

## Implementation Design

### Source lookup

Build a local, deterministic note-only lookup in `src/App.tsx`, near the existing shared ticket-card helpers:

```ts
const manualTicketSourceConflictNoteByQuestionId = buildSourceConflictNoteByQuestionId(data.topicStudyGuide.topics);
```

The helper should:

1. iterate all `topic.tickets`;
2. ignore tickets without `sourceConflictNoteRu`;
3. trim nothing unless the existing UI already normalizes comparable strings elsewhere; preserve note text exactly as bundled;
4. store one note per `questionId`;
5. allow repeated identical notes for the same `questionId`;
6. fail deterministically if the same `questionId` has two different note strings.

Acceptable fail-closed behavior is throwing an `Error` during module initialization with a message naming the conflicting `questionId`. This is preferable to silent last-write-wins because conflict-note text is governed learning/support content.

### Shared renderer prop

Extend `CanonicalStudyTicketBlock` with a narrow optional prop:

```ts
sourceConflictNoteRu?: string;
```

Resolve the note inside the shared renderer as:

```ts
const resolvedSourceConflictNoteRu = sourceConflictNoteRu ?? topicTicket?.sourceConflictNoteRu;
```

Then render the existing warning block from `resolvedSourceConflictNoteRu`.

This keeps Materials unchanged because Materials still supplies `topicTicket`, while manual cards supply only the note string.

### Manual appendix adapter

Update `ManualTicketAppendix` card creation to pass only the resolved note:

```tsx
<CanonicalStudyTicketBlock
  questionId={questionId}
  sourceConflictNoteRu={manualTicketSourceConflictNoteByQuestionId.get(questionId)}
  testIdPrefix="manual-ticket"
  key={questionId}
/>
```

Manual cards must not pass `topicTicket`. That protects manual appendices from accidentally adopting topic-specific answer explanations or `imageLocalPath` values from Materials.

### Materials adapter

Keep the Materials call shape equivalent to:

```tsx
<CanonicalStudyTicketBlock questionId={ticket.questionId} topicTicket={ticket} testIdPrefix="materials-ticket" />
```

No Materials copy, topic selection, explanation, image-path, or warning-note behavior should change.

## Acceptance Criteria

1. Manual appendix cards for `b-fallback-024`, `b-fallback-135`, `b-fallback-309`, and `b-fallback-456` render their existing `sourceConflictNoteRu` text.
2. The note text comes from bundled topic-study-guide data, not from hard-coded manual fixtures, placement data, or duplicated manual content.
3. Materials cards continue to render conflict notes via `topicTicket.sourceConflictNoteRu`.
4. Manual cards do not receive full `TopicGuideTicket` records.
5. Manual cards for no-note IDs, including `b-fallback-027`, render no warning label, empty block, stale note, or placeholder note.
6. The source lookup rejects divergent duplicate notes for the same `questionId` instead of silently choosing a winner.
7. No canonical ticket content, manual content, manual placement data, or protected manual evidence changes.
8. Runtime remains local-first and uses only bundled local data/assets.
9. PR `#204` receives updated process memory and implementation evidence for feature `039`.
10. The duplicate/current-head trusted connector threads can be considered addressed after implementation, fresh review, checks, and Orchestrator verification.

## Negative Scenarios

- Hard-code only the four cited IDs in UI/runtime code.
- Copy note text into manual placement shards, manual section files, canonical question records, or tests as the source of runtime truth.
- Pass `topicTicket` from manual appendix cards.
- Let a duplicate `questionId` with divergent note text silently overwrite an earlier note.
- Render an empty warning block for no-note cards.
- Change Materials explanation selection or image-path behavior while adding the manual-note path.
- Change manual appendix density behavior or route placement while adding warning notes.
- Treat latest `origin/main` alone as containing the target code path.

## Required Verification

Implementation Agent must record evidence for:

- `git diff --check`
- `pnpm run validate:manual-ticket-placement`
- focused unit/source tests covering:
  - note lookup derivation from `data.topicStudyGuide`;
  - all four current note-bearing IDs;
  - divergent duplicate-note guard;
  - manual cards pass `sourceConflictNoteRu` and not `topicTicket`;
  - Materials still passes `topicTicket`;
- focused Playwright or equivalent runtime verification on `#manual-section-ch2-required-documents`, opening the collapsed appendix and checking:
  - four cited manual cards show the expected warning label/text;
  - `manual-ticket-b-fallback-027` has no warning block;
  - Materials remains reachable and still shows a Materials ticket card;
- any broader Orchestrator-required checks for PR `#204`, including required checks from `.unicorn-hub/config.json`: `baseline-checks`, `docker-validation`, `guard`, `AI Review`, and `osv-scan`.

## Final Architect Validation Record

- Architect validation pass: passed
- Final Architect validation completed at: 2026-06-29T18:53:31-03:00
- Architect validated effective content head: a9d480ea8192267b892f6d93ce78aa66ba9b47aa
- Pre-validation/current PR head reviewed: 389213eb71bd72dbd4d5d779bb56354cd4592929
- Evidence/process-memory-only successors over the effective content head: `0a698aedc0814b218fc670afe1a33e4e958b5947` and `389213eb71bd72dbd4d5d779bb56354cd4592929` are evidence/process-memory-only successors over `a9d480ea8192267b892f6d93ce78aa66ba9b47aa`.
- The current validation-evidence commit itself is evidence-only and must be checked by the Orchestrator current-head guard before finalization/merge.
- Required checks on the reviewed current head were green: `baseline-checks`, `docker-validation`, `guard`, `AI Review`, and `osv-scan`.
- Thread-aware review state: 0 unresolved review threads.
- Review Agent evidence on `389213eb71bd72dbd4d5d779bb56354cd4592929`: no blocking findings.
- Return counts at pass: F038 Architect `10 / 10`; F039 Architect `0 / 10`.
- No unresolved Implementation Agent feedback remains.

## Process-Memory Gates

- Implementation Agent must keep `specs/039-manual-ticket-conflict-notes/tasks.md` current with changed files, test evidence, dead ends, decisions, and known issues.
- Any desired implementation change outside the allowed file list must be recorded as Implementation Agent feedback for Architect disposition, not performed silently.
- Final Architect validation is not authorized by this planning task and must be invoked later by Orchestrator after implementation, review, and checks appear complete.
