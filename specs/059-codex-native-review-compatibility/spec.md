# Spec: Native Codex review compatibility

## Goal and routing

Restore the real required AI Review gate for observed native Codex receipts and edited review signals without approving an unreviewed or superseded head. This is feature `059`, assigned by Orchestrator after Analyst intake. Architect owns this spec, `plan.md`, `tasks.md`, and dispositions; implementation and GitHub coordination remain separate roles.

The single planned slice is `codex/native-review-compatibility` in `.claude/worktrees/codex-native-review-compatibility`, based on verified main `9e17a059536586d8c2319f8cabcea9bcd288385d`. Preserve every sibling dirty diff, worktree, branch, commit, PR, and process record. PR #220 / feature `058` remains an independent CI-efficiency cycle; its limited parser fix is reference material, not permission to import its policy changes or alter its state.

## Scope

In scope: supported native evidence classification and selection; strict author and commit attribution; unresolved findings; event resolution and head-race guards; actual created/edited workflow routing; completed and active gate requeue; regression tests; relevant durable workflow documentation; genuine native review; safe trusted-main rollout; complete role validation and protected merge when objectively possible.

F-32 additionally permits the minimal Vite 6.4.3 to 6.4.4 security patch in `package.json` and `pnpm-lock.yaml` to resolve the actual required OSV blocker on this same PR. Retain the Vite 6 major and existing configuration, require renewed independent review/full preflight and genuine new-head remote/native acceptance, and reject unrelated dependency refreshes or scanner exemptions. The bounded disposition and verification requirements are in `plan.md` and T-18.

Out of scope: CI-efficiency policy from #220, learner/runtime changes, alternate review-provider policy changes, branch protection relaxation, impersonation, direct main push, unrelated cleanup, and automation changes.

## Evidence contract

- FR-001 Preserve trusted legacy `Codex Review:` no-findings comments and genuine native formal reviews. Add precisely one optional leading `<!-- codex-review-receipt:v1 -->` marker to the observed receipt format. Accept only the configured trusted Codex identities, including the existing connector login forms. Copied native text from another author is never evidence.
- FR-002 A positive comment needs an explicit supported no-findings verdict and an explicit matching reviewed-commit marker. A comment timestamp alone cannot establish a reviewed commit. Reject missing, malformed, conflicting, duplicated, stale, or wrong commit markers and invalid receipt prefixes. A supported short native SHA must identify the full current head unambiguously; the gate must retain that full head as its immutable expected head. Preserve the observed optional About Codex details block without accepting arbitrary contradictory content.
- FR-003 Negative, incomplete, ambiguous, or internally conflicting native results never produce a pass. Do not treat marker presence, an eyes/thumbs-up reaction, `Completed`, an advertisement, or a review request as a verdict. Select current applicable native evidence by actual review/update time with deterministic tie handling; an older positive must not win over a newer relevant negative or conflicting result.
- FR-004 Structured `codex-pull-request-review-summary` / `codex-review-state:v1` comments trigger wakeup and never satisfy positive review evidence, regardless of status or JSON booleans. Strictly validated current-full-head negative or unfinished state must veto an older otherwise positive receipt, as specified in D-08; explicit unresolved findings cannot be erased by a later request or receipt. Their edited timestamp may postdate a request even when their creation predates it. Malformed/duplicate/conflicting newest trusted native signals fail closed rather than falling back to an older pass. Any structured interpretation validates the complete schema, types, current full commit identity, status, verdict coherence, and conflicts. A future change granting positive approval from these summaries needs a separate explicit disposition.
- FR-005 Every unresolved trusted Codex finding remains a blocker across requests, receipt edits, later positive comments, and pushes until its actual review thread is resolved. Preserve blocking severity behavior and native review state handling; do not let filtering to a new request or the newest review erase unresolved findings from another review or an earlier head. Unknown-priority unresolved inline findings fail closed. Final merge additionally requires all GitHub review threads resolved.
- FR-006 Native formal review evidence requires an explicit full matching `commit_id`; missing commit identity cannot pass. Preserve supported approval and COMMENTED-review behavior after finding checks, and rejection of CHANGES_REQUESTED/blocking content. Claude/Gemini behavior is preserved except shared exact-head safety where applicable.

## Workflow and race contract

- FR-007 Test and fix the path actually executed by `.github/workflows/ai-review.yml`, its resolver, and its gate. A helper-only patch or a new router unreferenced by a workflow is insufficient. Both initial event resolution and each polling cycle verify that the PR is still open, non-draft as applicable, and on the immutable expected full head. Recheck immediately before successful exit and before any requeue mutation. Superseded runs fail/stop without claiming success for a newer push.
- FR-008 Add a trusted-default-branch wakeup path for issue-comment `created` and `edited` signals covering legacy, receipt, and structured summary; support native formal-review events and relevant inline-finding changes. The workflow filter is a coarse optimization; the runtime router repeats author, event kind, PR identity, repository, selected-backend, and head validation. Untrusted event fields never become shell commands or executable code.
- FR-009 Requeue an existing AI Review pull-request workflow run that is explicitly associated with the same PR and exact current head. Preserve the required check name and its association with the PR head. A default-branch workflow_dispatch run is not assumed to publish the required check on the PR head. Reject absent, ambiguous, wrong-workflow, wrong-repository, stale-head, closed/draft, or superseded candidate runs.
- FR-010 A signal after a terminal gate must cause a fresh evaluation when needed. A signal while the gate is active must not be lost at its final poll/completion boundary. Use serialized event handling with bounded waiting or a terminal-workflow completion backstop, and a monotonic signal/attempt guard. Cover queued runs, API state lag, and equal-second timestamps explicitly. Never blindly skip an active run, rerun every completion, or create an unbounded rerun chain. Duplicate unchanged signals and the rerun's own completion must not create another rerun. A new push invalidates the candidate before mutation.
- FR-011 Gate and wakeup scripts/configuration execute from the trusted default branch with minimal permissions. No PR checkout or unreviewed PR script runs with elevated credentials. Rerun is a scheduling action, never a replacement verdict; only the real gate evaluating genuine native evidence can publish its result.

## Safe rollout and authority

The current main gate recognizes legacy/formal review but rejects the leading receipt marker. Its existing default-branch checkout means changing only PR scripts cannot repair that PR's own gate. Safe bootstrap is conditional on genuine current-head native evidence already accepted by trusted main, or another independently reviewed and protected trusted rollout authorized by the repository. Do not request duplicate old-format responses already tried on #220, mutate bot text, manufacture a formal review/status, skip the gate, execute unmerged scripts with privileges, or use an owner identity.

Orchestrator reports `kiaquila` has upstream READ / `push=false` and its own fork has push permission through existing SSH. Publishing a fork PR is a valid deliverable path; fork authority does not grant upstream workflow, secret, rerun, or merge authority. Preserve a reviewable PR if verified permissions or receipt-only trusted-main bootstrap remain blockers after safe available attempts. Such a handoff is explicitly incomplete delivery and does not pass final completion criteria.

## Acceptance and evidence

| ID | Required result | Evidence |
| --- | --- | --- |
| AC-01 | Actual receipt regression first fails on fresh main; legacy/native review remain supported | Failing-then-passing focused tests and preserved real native fixtures |
| AC-02 | Strict author/verdict/commit/marker/conflict/finding checks | Positive and adversarial classifier/selection tests, including missing SHA and request-does-not-clear-findings |
| AC-03 | Structured summaries wake evaluation and veto strict current-head negative/unfinished state, including updates to old comments | Runtime, selection, and workflow created/edited tests; summary-only cannot pass gate |
| AC-04 | Real exact-head gate and safe, bounded requeue work after terminal and active runs | Mock-API/process integration tests of actual scripts; race, duplicate, attempt, and same-second fixtures; native upstream run evidence when available |
| AC-05 | Required check is genuinely evaluated on the reviewed full head; trust boundary holds | Actual GitHub run/check association and default-branch checkout review; no synthetic status |
| AC-06 | Relevant checks and mandatory local preflight pass before each push | Commands/results; any native image-QA/environment failure recorded accurately and resolved without rewriting unrelated evidence |
| AC-07 | Narrow ready PR and genuine user-account exact-head native review; all actionable findings resolved | Attached PR, `kiaquila` request URL, trusted reply, fix links and resolved thread state |
| AC-08 | Complete cycle memory, ordered final role validation, full stable 120-second hold, protected expected-head squash merge | Final Architect then Analyst markers on one effective content head, current-head guard, remote checks/rules/threads, timer evidence, GitHub merged state and merge commit |

Negative scenarios include spoofed native text, unsupported/duplicate markers, conflicting positive/negative text, missing/stale/full-or-short wrong SHA, incomplete reviews, unresolved P0-P3/unknown-priority findings, edited summary created before a new request, wrong PR/head run, event duplication, active completion/push races, unavailable API permissions, missing image-QA tooling, and receipt-only trusted-main bootstrap. They fail or block honestly; none is turned into success by a request marker or manual status.

## Review and final validation

Review Agent checks actual code and workflow execution, adversarial evidence, safe rerun convergence, all head guards, trusted execution, complete feature memory, sibling preservation, and real validation evidence. Orchestrator owns native review requests and gate coordination. After implementation, checks, review, and dispositions appear complete, Architect validates the complete cycle PR set, tasks, feedback, architectural guidance, process memory, and customer intent; Analyst follows only after Architect passes. Return limits are 10 Architect / 5 Analyst. Any post-validation non-evidence change invalidates the prior validation. Cleanup is unassigned and the active worktree is preserved.


### F-33 bounded observed-format clarification

Within the same feature cycle, permit the actual single `:tada:` decoration only in the existing v1 Reviewed-commit receipt branch, and exclude only the exact whole recognized terminal native summary About advertisement from rendered contradiction scanning. Arbitrary shortcode/prose families, receipt-footer/legacy expansion, wildcard details stripping and positive approval from clean summaries remain forbidden. Original full-body schema/marker/head checks and substantive findings/unfinished/unresolved/formal vetoes remain. The actual-body fail-first, narrow tests and combined F-32/F-33 review/full-preflight requirements are specified in `plan.md` and T-19.


### F-34 optional About-heading icon boundary

The F-33 structured-summary footer exemption permits at most one optional observed information icon, strictly in the opening `About Codex in GitHub` summary heading. Whitespace/line-ending normalization remains supported. Do not globally remove icons, normalize duplicate icons into one, or erase icons anywhere else in the footer. Duplicated heading icons, injected paragraph/link/trigger icons and other modified blocks receive no exemption and retain their text for contradiction scanning. This narrows the existing exact-whole-terminal-footer rule; it changes no receipt grammar, schema/head/state validation, positive evidence, trust or scheduling policy. The genuine c8d P2 and findings/unresolved summary remain blocking until actual native resolution. Detailed same-cycle implementation and verification requirements are in the F-34 plan disposition and T-20.


### F-35/F-36 receipt-footer boundary and backend-neutral wakeup discovery

Extend the F-34 single optional About-heading icon boundary to the separate positive-receipt footer comparison: retain supported whitespace/CRLF and genuinely canonical receipts, but never remove duplicated heading icons or icons elsewhere. Modified receipt footers cannot approve. Preserve F-34 structured-summary behavior and all existing trust, marker, verdict, full/unique-short-SHA and finding controls.

The Codex-specific wakeup resolver must honor the selected backend before any source-context resolution or scheduled discovery. A selected non-Codex backend emits an empty matrix/no PR target without checking that backend's actor against Codex provenance or making wakeup API reads/mutations. Selected/default Codex retains every existing provenance, identity and head check. This is an ignored-backend path, never review approval or a change to backend policy. The actual efb native findings remain blocking; F-35/F-36 scope and fail-first/full verification are specified in the plan and T-21/T-22.


### F-37 bounded native plus-one decoration

Permit exactly one optional observed ASCII `:+1:` decoration in the existing v1 receipt plus Reviewed-commit positive-verdict alternative, at the same bounded location as existing rocket/tada decorations. This changes no legacy/unprefixed grammar, arbitrary shortcode or emoji family, combined/repeated suffix, footer, verdict, trust, marker/SHA, summary or finding policy. Preserve the actual fe808 receipt verbatim for fail-first reproduction; a clean summary remains neutral. The narrow implementation/evidence requirements and new-head verification are in the F-37 plan and T-23.


### F-38 bounded observed next-one ending

Accept the exact observed ASCII `. Can't wait for the next one!` as one alternative ending of the existing v1 receipt plus Reviewed-commit positive form, retaining the inherited case policy. Its literal wording, apostrophe, internal spaces and terminal exclamation are bounded; do not generalize closing prose or combine it with another ending/decoration. This changes no legacy/unprefixed form, verdict, footer/icon normalization, author/marker/SHA/finding/summary or backend behavior. The actual f4adee body remains a verbatim fail-first fixture, with narrow review/full/new-head requirements in the F-38 plan and T-24.


### F-39 required transitive Zod security refresh

The actual required OSV failure permits a bounded same-cycle update of the existing transitive Zod4.4.3 resolution to exactly4.6.6, the minimum advisory-fixed version, with only necessary lockfile/peer-snapshot consequences. Prefer a generated lockfile-only update within the unchanged consumer ranges. A sole parent-scoped exact override is conditionally permitted only as the documented fallback in the F-39 plan; no direct Zod dependency, parent/toolchain upgrade, broad refresh, scanner exception or trust/review-policy change is authorized. Preserve native945cec failure honestly: no same-head duplicate trigger, no clean-result claim; publication of the genuinely changed dependency requires one new-head native cycle, all gates and existing finalization requirements.


### F-40 image-readiness synchronization before geometry

The actual F-39 recovery E2E failure permits one test-only synchronization correction: call the existing rendered-image readiness helper for the current question-card `.question-image-frame img` immediately before geometry evaluation in the overlay-bounds test. The helper must still require complete loading, positive natural dimensions and nonzero rendered bounds within its existing timeout. Keep every geometry assertion and product/image/runtime behavior unchanged; missing/broken assets still fail readiness. This does not approve the failed recovery or permit another unchanged retry. New-source review/focused/full requirements are in the F-40 plan and T-26.
