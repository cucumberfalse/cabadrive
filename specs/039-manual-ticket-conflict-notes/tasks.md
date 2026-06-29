# Tasks: Manual Ticket Source-Conflict Notes

## Status

- Current role: Implementation Agent execution.
- This task file is updated with Implementation Agent execution and evidence.
- Final Architect validation: not performed.
- Active PR: `#204`.
- Branch/worktree: `codex/038-manual-ticket-placement` / `/Users/chap/devel/cabadrive-worktrees/038-manual-ticket-placement`.
- Current PR head supplied by Orchestrator: `944f7e1799ba1d925bcac6983a912abb00b74eb1`.
- Implementation started from local HEAD: `944f7e1799ba1d925bcac6983a912abb00b74eb1`.
- Verified `origin/main`: `4247b0e90ae5799a0875cc3751c96589fef96ef2`.
- Dependent follow-up reason: target runtime code exists only in unmerged PR `#204`.
- Feature `038` escalation: `F038-RA-010` resolved as a process-memory correction by dependent feature `039` at effective content head `a9d480ea8192267b892f6d93ce78aa66ba9b47aa` and evidence head `0a698aedc0814b218fc670afe1a33e4e958b5947`; Architect return count remains `10 / 10`.
- Trusted duplicate threads in scope:
  - `PRRT_kwDOSX65IM6MtZ8i` / `discussion_r3485853526`
  - `PRRT_kwDOSX65IM6MtmnZ` / `discussion_r3485901148`

## Architect Checklist

- [x] Read required repository memory and feature `039` intake.
- [x] Read relevant feature `038` records for shared renderer/manual appendix status and `F038-RA-010`.
- [x] Inspect current `src/App.tsx` source-conflict-note, Materials adapter, and manual appendix paths.
- [x] Identify browser fixtures for the four cited note-bearing IDs.
- [x] Create `spec.md`.
- [x] Create `plan.md`.
- [x] Create this `tasks.md`.
- [x] Run lightweight Architect checks after writing artifacts.
- [x] Hand off to Orchestrator / Implementation Agent.

Lightweight Architect check evidence:

- Path-limited `git diff --check -- specs/039-manual-ticket-conflict-notes/spec.md specs/039-manual-ticket-conflict-notes/plan.md specs/039-manual-ticket-conflict-notes/tasks.md` produced no output, but the files were untracked, so Architect also checked each new artifact with `git diff --check --no-index /dev/null <file>`.
- `git diff --check --no-index /dev/null` passed with no whitespace output for `spec.md`, `plan.md`, and `tasks.md`.
- `rg -n "sourceConflictNoteRu|manualTicketSourceConflictNoteByQuestionId|b-fallback-024|b-fallback-135|b-fallback-309|b-fallback-456|b-fallback-027|F038-RA-010|blocked-escalation|PRRT_kwDOSX65IM6MtZ8i|PRRT_kwDOSX65IM6MtmnZ|final Architect validation" specs/039-manual-ticket-conflict-notes` found `54` required planning-anchor matches.

## Implementation Tasks

### T001 — Add deterministic note lookup

- [x] In `src/App.tsx`, add a helper that derives `Map<questionId, sourceConflictNoteRu>` from `data.topicStudyGuide.topics[*].tickets`.
- [x] Preserve note text exactly from the topic guide.
- [x] Allow repeated identical notes for the same question ID.
- [x] Throw a deterministic error for divergent duplicate notes on the same question ID.
- [x] Do not source notes from manual placement data, manual content, hard-coded fixtures, or canonical question records.

Evidence:

- `src/App.tsx` now defines `buildSourceConflictNoteByQuestionId(data.topicStudyGuide.topics)` and stores `manualTicketSourceConflictNoteByQuestionId`.
- The helper ignores tickets without `sourceConflictNoteRu`, keeps the bundled note string unchanged, permits repeated identical note strings, and throws `Divergent sourceConflictNoteRu for ticket ${ticket.questionId}` for conflicting duplicate note strings.
- No manual placement data, manual content, canonical question records, or hard-coded runtime ID map is used as the warning-note source.

### T002 — Add narrow shared-renderer prop

- [x] Add optional `sourceConflictNoteRu?: string` to `CanonicalStudyTicketBlock`.
- [x] Render the existing warning block from `sourceConflictNoteRu ?? topicTicket?.sourceConflictNoteRu`.
- [x] Keep `TopicGuideTicketBlock` passing `topicTicket={ticket}` for Materials.
- [x] Keep answer explanations, canonical explanations, image path fallback, translations, difficulty, answer order, correct-answer badge, and source footer unchanged.

Evidence:

- `CanonicalStudyTicketBlock` now accepts `sourceConflictNoteRu?: string` and resolves `resolvedSourceConflictNoteRu = sourceConflictNoteRu ?? topicTicket?.sourceConflictNoteRu`.
- The existing `Заметка о старой формулировке` support block renders from `resolvedSourceConflictNoteRu`.
- `TopicGuideTicketBlock` still passes `topicTicket={ticket}` with `testIdPrefix="materials-ticket"`.

### T003 — Wire manual appendix cards

- [x] Update `ManualTicketAppendix` so manual cards pass `sourceConflictNoteRu={manualTicketSourceConflictNoteByQuestionId.get(questionId)}` or an equivalent note-only lookup.
- [x] Do not pass `topicTicket` into manual cards.
- [x] Preserve current manual appendix ordering, density threshold, native disclosure behavior, keying, status label, and lazy local image behavior.

Evidence:

- `ManualTicketAppendix` now passes `sourceConflictNoteRu={manualTicketSourceConflictNoteByQuestionId.get(questionId)}` to each manual card.
- Manual card creation does not pass `topicTicket`.
- The direct-render threshold, disclosure/lazy mounting behavior, route ordering source, keys, status label, and local image behavior were not changed.

### T004 — Add focused unit/source tests

- [x] Cover all currently note-bearing IDs from topic-guide data:
  - `b-fallback-024`
  - `b-fallback-135`
  - `b-fallback-309`
  - `b-fallback-456`
- [x] Cover a no-note manual card fixture: `b-fallback-027`.
- [x] Cover divergent duplicate-note guard.
- [x] Assert manual card source contract passes `sourceConflictNoteRu` and does not pass `topicTicket`.
- [x] Assert Materials source contract still passes `topicTicket={ticket}`.

Evidence:

- `tests/manual-ticket-placement.test.mjs` adds source/unit coverage:
  - `source-conflict notes derive from topic guide and reject divergent duplicate notes`;
  - `manual source contract passes note-only prop while Materials keeps topicTicket`.
- The tests cover `b-fallback-024`, `b-fallback-135`, `b-fallback-309`, `b-fallback-456`, no-note `b-fallback-027`, repeated identical duplicate notes, divergent duplicate note failure, manual `sourceConflictNoteRu` without `topicTicket`, and Materials `topicTicket={ticket}`.

### T005 — Add focused browser regression

- [x] Use route `/#manual-section-ch2-required-documents`.
- [x] Open the collapsed manual-ticket disclosure.
- [x] Assert `manual-ticket-b-fallback-024`, `manual-ticket-b-fallback-135`, `manual-ticket-b-fallback-309`, and `manual-ticket-b-fallback-456` show the source-conflict warning label/text.
- [x] Assert `manual-ticket-b-fallback-027` does not show a warning block.
- [x] Assert Materials remains reachable and renders Materials ticket cards.

Evidence:

- `tests/e2e/manual-ticket-placement.spec.ts` adds `manual required-documents tickets surface topic-guide conflict notes`.
- Browser regression opens `/#manual-section-ch2-required-documents`, verifies the disclosure starts closed, opens it, checks the four note-bearing manual ticket cards for the warning label and distinctive note text, checks no-note `manual-ticket-b-fallback-027` has no warning block, then navigates to `Материалы` and verifies Materials ticket cards still render.

### T006 — Run verification and record evidence

- [x] `git diff --check`
- [x] `pnpm run validate:manual-ticket-placement`
- [x] focused unit/source test command and result
- [x] focused Playwright command and result
- [x] any broader Orchestrator-required commands
- [x] record changed files and why
- [x] record dead ends, decisions, and known issues

Evidence:

- `git diff --check` passed with no output.
- `pnpm run validate:manual-ticket-placement` passed: `Manual ticket placement valid: 460 questions, 460 placements, 31 destination routes, density 1/12/45, answer-bearing 85, fallbacks 375`.
- `node --test tests/manual-ticket-placement.test.mjs` passed: `18` tests passed.
- Initial `pnpm exec playwright test tests/e2e/manual-ticket-placement.spec.ts` failed because `vite preview` served the stale pre-build `dist` bundle; this did not indicate a product-code failure after the current source was built.
- `pnpm run build` passed, including `validate:content`, `validate:manual-sign-inventory`, `validate:manual-ticket-placement`, asset sync, Vite build, and service-worker generation.
- After build, `pnpm exec playwright test tests/e2e/manual-ticket-placement.spec.ts` passed: `8` tests passed across chromium and mobile projects.
- `node scripts/check-feature-memory.mjs --worktree` passed: `Feature-memory gate passed via specs/039-manual-ticket-conflict-notes/{spec,plan,tasks}.md`.
- Changed files:
  - `src/App.tsx`: added deterministic topic-guide conflict-note lookup, optional renderer prop, and manual note-only wiring.
  - `tests/manual-ticket-placement.test.mjs`: added note lookup/source contract tests.
  - `tests/e2e/manual-ticket-placement.spec.ts`: added browser regression for required-documents manual notes and Materials reachability.
  - `specs/039-manual-ticket-conflict-notes/tasks.md`: recorded implementation evidence.
- Effective content head after implementation commit: `a9d480ea8192267b892f6d93ce78aa66ba9b47aa`.
- Pushed head after implementation push: `a9d480ea8192267b892f6d93ce78aa66ba9b47aa` (`origin/codex/038-manual-ticket-placement` observed at the same SHA after push).
- This follow-up process-memory update records commit/push evidence only and does not change product behavior, tests, runtime files, content, or source contracts.

## Allowed Implementation Files

- `src/App.tsx`
- `tests/manual-ticket-placement.test.mjs`
- `tests/e2e/manual-ticket-placement.spec.ts`
- `specs/039-manual-ticket-conflict-notes/tasks.md`

Any other file requires stopping and recording Implementation Agent feedback for Architect/Orchestrator disposition before editing.

## Current Decisions

- Use a narrow `sourceConflictNoteRu` prop instead of passing a full `TopicGuideTicket` into manual cards.
- Use governed topic-study-guide data as the runtime source for notes.
- Include a duplicate-note guard to prevent silent last-write-wins behavior.
- Keep Materials behavior unchanged by retaining the existing `topicTicket` adapter.
- Do not update feature `038` files during feature `039` planning or implementation unless Orchestrator/Architect later authorizes a specific process-memory need.
- The first focused Playwright run showed that `pnpm exec playwright test ...` uses `vite preview` against existing `dist`; the command must be preceded by `pnpm run build` when source changed and `dist` is stale.

## Known Issues

- None accepted by Implementation Agent.

## Dead Ends

- Passing full `TopicGuideTicket` into manual cards is rejected because it could make manual appendices inherit Materials-specific answer explanations or image path overrides.
- Hard-coding the four cited IDs is rejected because the source of truth is the governed topic-study-guide data.
- Treating the first focused Playwright failure as product behavior was rejected after the error context showed the browser was serving stale preview output; building the current source and rerunning the same focused Playwright command passed.

## Final Validation

Final Architect validation has not been performed. Orchestrator must request it only after implementation, review, checks, and process-memory evidence are current.
