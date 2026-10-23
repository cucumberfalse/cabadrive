# Review Contract

Reviewers check the pull request against the active feature spec, not only
against the implementation diff. Acceptance criteria, negative scenarios, and
known issues are the source of truth for expected behavior.

Review Agent must not change code, docs, tests, specs, templates, workflow
files, or scripts while acting as reviewer. It reports code review findings as
GitHub inline review threads so each finding is anchored to the changed line.
Backend-specific no-finding summary behavior remains allowed where documented
below.

## Role And Process Review

Reviewers check role boundaries in addition to code behavior:

- Repository-changing work must enter through Orchestrator by default, and
  Orchestrator must invoke Analyst first when no current `feature-request.md`
  exists.
- Read-only work may proceed without feature memory only while it remains
  non-mutating. Reviewers should flag repository mutations that began from a
  read-only interaction without an Orchestrator-first stop and handoff.
- A non-Orchestrator active model must not directly implement a new
  repository-changing request or self-promote into another role. Reviewers
  should flag any bypass even when the resulting diff is otherwise correct.
- New repository-changing work and each new task slice must have latest
  verified `main` startup/base evidence, normally `origin/main` after fetch,
  with a fresh isolated worktree/branch. If fetch/base verification is
  unavailable, reviewers require a documented fallback or blocker; silent stale
  base reuse is a process violation. The exception remains when Orchestrator
  explicitly assigns the Analyst-created latest-main handoff branch as the
  single implementation PR slice.
- Orchestrator must not directly edit repository files. File changes must come
  from the role-appropriate subagent.
- Analyst requirement clarification must be relayed through Orchestrator.
  Analyst is the only normal-flow role that may initiate user requirement
  clarification; after Analyst handoff, later roles use recorded assumptions,
  Implementation Agent feedback, or documented blocker exceptions.
- Agents must not switch roles mid-task. Work outside the current role must be
  rerouted by Orchestrator.
- Accidental direct-edit recovery must be visible in process memory when it
  occurs: stop/report/preserve/restart through Orchestrator or user
  disposition, with no hidden continuation, silent role switching, destructive
  cleanup, or unauthorized revert of user/sibling work.
- One task slice must map to one isolated worktree, one branch, and one PR.
- New repository-changing work should show latest verified `main` startup
  evidence, normally `origin/main` after fetch, or a documented fallback/blocker
  when fetch/base verification was unavailable.
- Orchestrator assignment should warn subagents that parallel agents may be
  active and require preservation of existing dirty diffs, branches, commits,
  PRs, and process memory.
- Sibling worktrees, branches, dirty diffs, commits, PR state, feature folders,
  and process memory must not be mutated without explicit Orchestrator
  coordination.
- When a feature has multiple contributing slices, reviewers should verify that
  the cycle PR set records each PR slice's purpose, branch, PR metadata, head
  SHA, status, and inclusion in final validation.
- Completion-time cleanup must be coordinated by Orchestrator and executed only
  by an assigned Cleanup Agent.
- Non-cleanup roles may coordinate cleanup, request Cleanup Agent assignment, or
  record evidence only; they must not delete local repository environments.
- Orchestrator must not directly delete local repository environments.
- Implementation PRs must stay inside the assigned feature memory and must not
  mix unrelated changes.
- Implementation must not start without complete feature memory:
  `feature-request.md`, `spec.md`, `plan.md`, and `tasks.md`, except documented
  legacy/no-intake exceptions.
- Blocking Implementation Agent feedback must be either resolved in scope or
  have Architect disposition before completion.
- Process changes must not contradict the existing `011` Orchestrator-Analyst
  routing baseline or sibling `012` final-validation-loop guidance when that
  guidance is present or in flight.
- Initial Review Agent review may proceed before final Architect or Analyst
  validation evidence exists. Reviewers may still review whether the PR text,
  docs, specs, and templates require the planned final-validation steps at the
  right phase.
- Final Architect validation must occur before final Analyst validation,
  completion, or Orchestrator finalization/merge, after implementation, review,
  checks, and follow-up development appear complete. Reviewers should check
  that Architect validation covers all PR slices, Architect-assigned tasks and
  dispositions, architectural guidance, open task state, process memory, and
  customer intent in spirit.
- Final Analyst validation must occur after Architect passes and before final
  completion or Orchestrator finalization/merge. It must check the customer's desired
  outcome in spirit and letter. Analyst gap notes must be Analyst-owned, return
  counts must stay within the limit of 5, and Analyst feedback must receive
  Architect accept/task/ticket/dispose disposition before follow-up development.
- Passing final validation must include explicit role-owned completion markers:
  `Final Architect validation completed at: <ISO 8601 timestamp>` and
  `Architect validated effective content head: <40-hex-sha>` in
  Architect-owned memory, plus
  `Final Analyst validation completed at: <ISO 8601 timestamp>` and
  `Analyst validated effective content head: <40-hex-sha>` in
  `feature-request.md`. The Analyst timestamp must be later than the Architect
  timestamp; file concatenation order is not valid chronology evidence. The
  role-owned effective-head markers must match the recorded
  `Effective content head: <40-hex-sha>`.
- Architect gap returns must stay within the limit of 10 per work cycle. If the
  limit is exceeded, reviewers should expect a recorded Architect breach and
  Orchestrator request for Analyst to create a new feature request; if the
  Analyst limit is exceeded, reviewers should expect a new feature request in a
  separate latest-main branch/worktree.
- When final Architect and Analyst validation target an effective content head,
  role/process evidence must record `Effective content head: <40-hex-sha>`,
  `Architect validated effective content head: <40-hex-sha>`, and
  `Analyst validated effective content head: <40-hex-sha>` for the same SHA.
  Any later commit may be treated as valid only if it is final-validation
  evidence-only process memory and Orchestrator's read-only current-PR-head
  guard explicitly references that effective content head by full SHA or
  unambiguous short prefix and proves no non-evidence content changed.
  Non-evidence changes after role validation make prior validation stale and
  must be routed back through role-appropriate follow-up or final validation
  before completion or merge.

Reviewers should block merge when the PR text, docs, specs, or implementation
permit unsafe completion. Blocking conditions include red, missing, queued, or
running required checks; unresolved `P0`, `P1`, or `P2` review findings;
unresolved conflicts; stale process memory; missing acceptance evidence; missing
negative-scenario coverage; Orchestrator-first bypasses; missing feature
memory; role-boundary violations; unsafe accidental-start recovery; sibling-work
mutation; contradictions with required `011`/`012` process guidance; or
unresolved Implementation Agent feedback without Architect disposition. During
initial PR review, absence of final Architect or Analyst validation evidence is
not itself blocking because the final-validation loop is invoked only after
implementation, review, checks, and follow-up development appear complete.
During Orchestrator's final completion or finalization/merge-readiness evaluation, missing
final-validation evidence, incomplete cycle PR set coverage, Analyst feedback
without Architect disposition, or exhausted return limits without
new-feature-request escalation are blocking process findings. So are missing
current-PR-head guard evidence after a post-validation evidence commit, or any
non-evidence post-validation change that still relies on prior Architect or
Analyst validation.

For cleanup-related changes or cleanup evidence, reviewers must block merge when
the rules or evidence permit deletion based only on name, timestamp, or memory;
when cleanup can touch current, active, dirty, untracked, unpushed, open-PR,
locked, running-process, ambiguous, user-owned, out-of-root, non-Cabadrive, or
process-memory-referenced targets; when PR lookup failure is treated as safe;
when registered worktrees can be removed with raw recursive deletion; when
cleanup evidence omits inventory, validation, action/refusal reason, or
post-cleanup confirmation; or when a non-cleanup role performs destructive
local-environment cleanup.

Review findings that require code, docs, tests, content, specs, metadata, or
process-memory edits are routed by Orchestrator to the proper role. Source
currentness or archive-evidence findings block merge until fixed by the
appropriate role or explicitly disposed by Architect when the spec allows it.
After a fix, Orchestrator verifies whether each blocking thread is resolved,
outdated, or still blocking before merge.

No-finding summaries satisfy the review gate only for the current PR head and do
not replace required checks, merge-conflict checks, feature-memory evidence,
local guard evidence, Orchestrator-first routing evidence, Analyst
clarification-relay evidence, latest-main startup evidence, parallel-work
isolation evidence, cycle PR-set evidence, final Architect validation, final
Analyst validation, effective content head evidence, current-PR-head guard
evidence, return-limit state, cleanup evidence/refusal records when relevant,
or manual review of the SENAR done gate.
For Orchestrator-managed PRs, routine human final approval is not a terminal
blocker after objective gates pass. Reviewers should instead block unsafe
finalization when the PR permits merge without current-head verification, green
required checks from `.unicorn-hub/config.json`, resolved review threads,
resolved or outdated blocking findings, clean mergeability, final validation
evidence, current process memory, feedback disposition, and local guard
evidence. Mutating helper usage must require an explicit expected head for the
reviewed and validated PR head, while dry-run inspection may remain read-only
without it. Helper process-evidence parsing must require an `Effective content
head: <40-hex-sha>` marker and current-head guard text that explicitly
references that effective content head; if the current PR head differs from the
effective content head, local git must prove all later changed files are limited
to the active feature memory evidence files before merge can proceed. Human
intervention remains a blocker only for exceptional cases:
missing credentials or permissions, explicit instruction not to merge,
ambiguous repository or PR state, pending owner decision for an accepted known
issue, or protected-branch/ruleset policy blockers.

## Codex

Native GitHub PR review. Blocking findings use `P0`, `P1`, or `P2`.
Advisory findings use `P3`. Code review findings must be GitHub inline
review threads.

Codex review evidence is trusted by login, not by GitHub author association.
By default, the trusted Codex logins are `chatgpt-codex-connector[bot]` and
`chatgpt-codex-connector`. Repository configuration may add shared trusted
review logins with `trustedReviewLogins` or Codex-specific logins with
`trustedReviewLoginsByAgent.codex`, but trusted associations such as `OWNER`,
`MEMBER`, or `COLLABORATOR` do not satisfy AI review login trust. Unknown
logins remain rejected.

Positive Codex evidence must identify the immutable current PR head. Formal
reviews require a full matching `commit_id`; the existing `APPROVED` and
`COMMENTED` classifications remain subject to blocking severity and findings.
A current formal `CHANGES_REQUESTED`, or a formal review with blocking `P0`,
`P1`, or `P2` content, vetoes issue receipts until the formal review is actually
corrected or dismissed. Formal `P3` content alone does not introduce a new veto.
The `COMMENTED` advisory exception requires the entire body to consist of one
or more complete `[P3] Found an issue` lines (or the same bounded `Found` phrase
with a numeric count or `finding(s)`, and optional terminal period/exclamation
mark), plus layout whitespace. Multiple supported lines, case and CRLF
normalization are supported. Any residual non-whitespace prose keeps the
original complete body under existing vetoes; supported lines are never
partially exempted from a mixed body. A P3 token elsewhere cannot hide unlabelled
or unknown-priority findings. Explicit negative, unfinished or unresolved review
state and mixed P0–P2 content still veto; actual unresolved P3 roots still block.

A trusted issue comment can approve only with an explicit supported no-findings
verdict and matching reviewed commit. Supported forms are the legacy
`Codex Review:` header and exactly one leading
`<!-- codex-review-receipt:v1 -->` marker. The bounded v1
`**Reviewed commit:**` form accepts the observed ASCII `. Chef's kiss.` and
`. More of your lovely PRs please.` endings as explicit alternatives to the
existing base/rocket endings. The v1 Reviewed-commit form also permits one
observed `:tada:` or `:+1:` decoration, never combined with another ending or added to
legacy forms. Legacy `in head <sha>`
and `Reviewed [<sha>]` forms remain supported. Case and CRLF normalization are
preserved. Only the canonical observed About Codex in GitHub details footer is
permitted, with whitespace and at most one optional information icon only at the
opening About summary heading. An absent heading icon is supported; repeated
heading icons or icons elsewhere are modified footer content. Repeated,
combined or modified endings, arbitrary additional prose, malformed/mixed or
duplicate markers, conflicting commit markers, and negative or unfinished
results cannot approve.

Every reviewed SHA must match the full current head. Abbreviated commit markers
must resolve uniquely through GitHub's commit API to that exact full head;
missing, foreign or ambiguous identity fails closed. Timestamps order results
only: issue comments use `updated_at`, formal reviews use `submitted_at`, and a
tied positive/negative result fails closed. A timestamp never substitutes for
commit identity.

Every actual unresolved trusted inline finding blocks independently of a newer
request or positive result, including `P3`, unknown-priority and older-head
findings. All evidence and review-thread pages are read. Thread roots determine
resolution; replies are not separate findings. Structured
`codex-pull-request-review-summary` / `codex-review-state:v1` comments never
approve. Every applicable current-full-head section (`code_review` and
`security_review`) vetoes older/tied positive results when it has findings or
an unfinished state; explicit current-head unresolved flags block until cleared.
Canonically absent slots require no review. Clean completed false/false applicable
sections remain neutral only when the rendered text has no contradiction.
Bounded, case-insensitive `Found` claims veto clean JSON: singular/plural
`issue`/`finding` with `a`, `an`, `another`, `one`, `some`, `several`, `multiple`, `remaining`, or
a positive integer count (including zero-padded positive counts); `remaining`
may also follow a determiner/count; `additional` may immediately follow `a`/`an`.
Bare plural `Found issues` / `Found findings`
also veto. Tokens allow whitespace, including tabs/line wraps, and require word
boundaries; punctuation or an unknown priority label does not hide a claim.
Exact zero/negated units (`Found 0 issues/findings`, `Found no issues/findings`,
`No issues/findings found`) are neutral. Unresolved prose vetoes clean JSON for
all four case-insensitive forms: `unresolved issue`, `unresolved issues`,
`unresolved finding`, `unresolved findings`, with the same word and whitespace
boundaries. `No unresolved issue/issues/finding/findings`, with optional
`remain` or `remains`, is neutral only as a complete unit bounded by the body,
a line break, or `.`, `!`, `?`, `;` (surrounding whitespace allowed).
Each neutral unit exempts only its own wording: a separate affirmative claim,
unfinished/failed state, severity, unresolved flag/root or formal veto still
blocks. Headings, the clean status table and canonical About footer are neutral;
no such rendering supplies approval. Only the exact whole terminal native summary
About advertisement, including the security-review trigger and the fixed
"while any review is running" explanation, is excluded from contradiction
scanning after whitespace normalization and removal of at most one optional
information icon solely at the exact opening About summary heading. An absent
heading icon is supported; duplicate heading icons or icons anywhere else never
receive that exemption.
Original full-body marker, schema, state and head checks still apply. Substantive
review prose and unknown, modified, duplicate, nested, truncated or nonterminal
blocks remain visible to all contradiction vetoes. Malformed, duplicate or
conflicting newest native signals fail closed. Valid explicitly other-head
summaries are neutral; actual unresolved inline roots still block across heads.

Trusted default-branch wakeups independently fetch current evidence and requeue
the existing exact-head AI Review run when needed. Edited/deleted receipts can
withdraw the last positive even when no native marker remains. The router checks
configured original-author trust, comment/PR identity, current edit or actual API
404, and the context job's immutable PR/full-head pair. A strict trusted-bot
scheduling observation can retain proven prior Codex acceptance for that exact
run/attempt. After a rerun is strictly consumed, a genuinely successful new Codex
attempt with current passing native evidence retains its own independently
verified acceptance before the unchanged-snapshot no-op. This writes at most
one observation, never another rerun; it preserves withdrawal history when the
new attempt's logs later expire. Active, failed, skipped or unproven attempts do
not acquire acceptance merely from consumption. If transient passing evidence
disappears or a resolved root reopens, restoring an already consumed absent or
blocking hash after an actual successful attempt, the router must reconcile
that latest attempt's own native-gate proof. Valid exact-attempt retained history
or job/step/log proof permits one real re-evaluation; older history or unavailable
latest proof produces an explicit blocker with zero new scheduling mutation.
The current finding remains blocking, and an actual failed re-evaluation deduplicates.
Unconsumed negative mismatches keep their existing routing without a new log
prerequisite. Initial history requires the actual successful non-skipped Codex
gate step and a complete bounded job log with its exact full-head completion
line. This history permits one real re-evaluation of empty or neutral-only
current evidence; it never approves a review. Remaining genuine formal approval
needs no invalidation. Failed, never-accepted or bootstrap-skipped runs and
unavailable/ambiguous history cannot justify blind absence reruns. Uncertain
posting states must settle through the existing strict actual-attempt/server-time
proof before any observation or replacement. See the [workflow contract](ai-pr-workflow.md#native-codex-receipts-and-exact-head-wakeup)
for bounded log access, serialization and deduplication.

Resolve-only wakeup context selection checks the configured backend first. A
selected non-Codex backend emits no PR target and performs neither Codex source
provenance lookup nor scheduled discovery; selected/default Codex keeps the full
existing actor, workflow, PR and exact-head validation path.

## Claude

Top-level comment must start with:

```text
AI_REVIEW_AGENT: claude
AI_REVIEW_SHA: <head-sha>
AI_REVIEW_OUTCOME: pass|advisory|block
```

Only `pass` satisfies the gate.

## Gemini

Native GitHub PR review from the configured app. Critical or high-severity findings block merge.
