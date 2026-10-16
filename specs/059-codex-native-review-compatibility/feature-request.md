# Feature Request: Native Codex Review Compatibility

## Analyst Artifact Status

Created by Analyst intake after explicit Orchestrator assignment on October 15, 2026. This artifact records requirements and acceptance expectations; it is not an implementation plan, a review verdict, or final validation evidence.

## Orchestrator Routing Context

- The human explicitly authorized a separate autonomous session for `cucumberfalse/cabadrive`, assigned the coordinating agent the Orchestrator role, and required the complete implementation, native review, validation, and merge cycle. Analyst received an intake-only assignment from that Orchestrator.
- Assigned worktree: `/Users/kristina.kurashova/projects/caba-drive/cabadrive/.claude/worktrees/codex-native-review-compatibility`.
- Assigned branch: `codex/native-review-compatibility`.
- Latest-main base: `9e17a059536586d8c2319f8cabcea9bcd288385d`. Orchestrator reports successful `git fetch --all --prune`, GitHub API confirmation of `main`, and local `main` versus `origin/main` comparison `0 0`; Analyst independently confirmed the recorded `origin/main` ref and created this worktree with explicit `git worktree add ... -b codex/native-review-compatibility origin/main`.
- Main currently contains numeric feature prefixes through `057`; the known in-flight PR #220 owns `058-agent-ci-efficiency`. Orchestrator explicitly coordinated use of `059` as the next globally observed feature prefix to avoid parallel-work ambiguity. No existing feature folder is renamed or overwritten.
- Parallel Orchestrators and agents may be active. Preserve every existing dirty diff, branch, commit, PR, worktree, and process-memory record. The primary checkout has existing untracked `.claude/` and `.omc/` state; this intake does not adopt or alter that state.
- This Analyst-created latest-main context may continue through Architect planning and become the single implementation PR slice only after Orchestrator explicitly assigns it. Additional independent slices need their own verified latest-main isolation.
- No accidental direct implementation start occurred in this intake. Cleanup is unassigned; current and sibling environments remain preserved.

## User Request

Autonomously fix compatibility with the new native Codex Review format in `cucumberfalse/cabadrive` and carry the result through a ready-for-review PR to verified merge. The human's explicit scope includes the parser, selection of fresh review evidence, exact-head attribution, workflow event filter, created/edited routing, wakeup and rerun behavior, and publication of the actual required review check. A helper-only change that the active workflow never executes is insufficient.

The user expressly requires the agent to publish the technical GitHub comment `@codex review <full-current-head-sha>` from the user's own account, `kiaquila`, and wait for an actual native reply. Local self-review, a reaction, an Actions bot comment, an invented status, a skipped gate, or an old review is not a substitute. A changed reviewed HEAD needs a new native review request and reply; do not duplicate an already successfully submitted request for an unchanged SHA.

The user has already authorized necessary repository changes, commits, push, ready-for-review PR creation, review comments as `kiaquila`, fixes, replies and resolution of addressed review threads, and merge after all objective gates and a full stable two-minute waiting period. Do not ask for the same permission again. This does not authorize changing global identity, using the owner's identity, bypassing branch protection, reducing required checks, accepting unreviewed privileged code, or manufacturing review evidence.

Conversation and handoffs are Russian. Code, code comments, tests, documentation, new file/branch names, commit messages, PR title/description, and technical GitHub messages are English. Commit messages end with a blank line and `Co-authored-by: OpenAI Codex <codex@openai.com>`; PR descriptions end with a blank line and `Co-authored-by: Codex <codex@openai.com>`. Attach every created or continued PR to this session.

## Clarified Answers And Assumptions

- No normal-flow user clarification is necessary. The request explicitly defines outcomes, trust constraints, review identity, regression cases, authorization, preservation duties, and finalization mechanics.
- Start by inspecting PR #220, branch `codex/058-agent-ci-efficiency`, whose supplied and locally observed head is `2667f79cd7676ff331730cabf661d38dbbcddb0d`. It already contains a limited receipt parser fix and 86 focused tests alongside an independent agent/CI efficiency feature. Preserve that work and do not blindly duplicate its implementation.
- Orchestrator selected a narrow compatibility prerequisite PR from verified latest main. Its purpose is to repair the review gate independently of #220's evidence-only CI optimization. The #220 optimization remains in its existing feature/PR, and any later rebase or integration is separately coordinated. This separation avoids mixing unfinished CI policy changes into the compatibility fix.
- The historical audit's failure and in-progress checks are snapshots, not current merge-readiness evidence. Refresh GitHub state before status claims, review decisions, and finalization.
- Review requirements remain strict for severity and all unresolved findings. A fresh request marker must never erase findings. A structured summary, thumbs-up, or the word `Completed` is not by itself a positive verdict.
- Optional details advertising Codex in GitHub may follow a valid receipt; compatibility must remain bounded to observed native formats and trusted authors.
- No personal maintenance or unrelated product/configuration/automation changes are included. The human explicitly included this otherwise excluded spouse-owned repository for this task only.

## Project Context Reviewed

- `AGENTS.md`, `CLAUDE.md`, `.specify/memory/constitution.md`, and `.specify/templates/feature-request-template.md`: mandatory role separation, isolated latest-main startup, feature-memory ownership, preflight, native review, final validation order, effective/current-head guards, and conservative squash merge.
- Required onboarding context: `docs_project/README.md`, `docs_project/project-idea.md`, frontend/backend docs, feature inventory, learning/exam flows, and `docs/specify/README.md`. Cabadrive is a local-first static trainer; this request concerns repository review tooling rather than learner/runtime behavior.
- `docs_project/project/devops/ai-pr-workflow.md`: the required gate executes scripts from the default branch; all required checks, exact-head evidence, resolved conversations, ordered Architect/Analyst validation, and process-memory checks remain mandatory.
- Existing `058-agent-ci-efficiency/feature-request.md`: independent evidence-only CI optimization, required statuses, two-minute readiness window, and preservation constraints. This request must not take over or silently broaden that cycle.
- User-named implementation entry points for subsequent role-assigned inspection: `.github/workflows/ai-review.yml`, `scripts/ai-review-gate.mjs`, `scripts/ai-review-helpers.mjs`, and `scripts/switch-review-agent.mjs`.
- Orchestrator reports main has no review wakeup workflow/router. The assigned scope therefore includes adding the actual used created/edited event and requeue path where missing; modifying an unused helper alone cannot satisfy acceptance.

## Observed Native Formats And Supplied Evidence

The audit on October 15 reproduced the regression on then-current main: a legacy response starting directly with `Codex Review:` was accepted, while an otherwise identical official response with the leading receipt marker was rejected. The following are concrete observed format references, not evidence that this feature's future PR has been reviewed:

- [Cabadrive PR #220 native response](https://github.com/cucumberfalse/cabadrive/pull/220#issuecomment-6202819931).
- [Capsule Zero PR #161 native response](https://github.com/kiaquila/capsule-zero/pull/161#issuecomment-6202996463).

Observed positive receipt example:

```text
<!-- codex-review-receipt:v1 -->

Codex Review: Didn't find any major issues. :rocket:

**Reviewed commit:** `2667f79cd7`
```

The native bot also updates an existing summary comment rather than always creating a fresh one:

```text
<!-- codex-pull-request-review-summary -->
<!-- codex-review-state:v1 {"code_review":{"commit_sha":"2667f79cd7676ff331730cabf661d38dbbcddb0d","has_any_findings":false,"has_unresolved_findings":false,"status":"completed"},"security_review":{"commit_sha":null,"has_any_findings":null,"has_unresolved_findings":null,"status":null}} -->

## Codex Review Summary
```

Both `created` and `edited` events matter. An edited summary's `created_at` may predate a newer review request. Its provenance, actual current-head evidence, fresh update, completion, and explicit verdict must be established rather than inferred from creation time or marker presence. If structured summaries are used as review evidence, their schema, types, completion/status, exact full current `commit_sha`, explicit positive verdict, and conflicting data require strict validation.

## External Research

No external research was necessary to settle intake requirements: the user supplied actual native-format references and detailed acceptance constraints. Current GitHub Actions/event/API/security semantics must be verified by Architect and Implementation against primary documentation when making their technical decisions. Orchestrator reports Context7 is available but its quota is exhausted, and official GitHub event/security/REST documentation was opened as the fallback. This intake makes no new API-behavior claims from those pages.

## Problem Statement

Official native Codex responses changed format and may be edited in place. Existing parsing and routing can therefore miss a legitimate positive result or fail to rerun a completed gate. Conversely, broadening recognition without identity, schema, freshness, unresolved-finding, and exact-head checks could falsely approve unreviewed code. Default-branch script execution creates a real bootstrap constraint: a patch present only on its own PR may leave that PR evaluated by the old parser.

## Proposed Outcome Or Workflow

1. Recognize observed native receipts while preserving supported legacy summaries and native formal reviews. Accept a successful review only from the trusted Codex identity with sufficient explicit positive evidence provably bound to the current PR head.
2. Route native created and edited review signals through the actual workflow and runtime gate. Re-evaluation works whether a prior gate has finished or is still active, without endless rerun loops or redundant duplicate runs.
3. Preserve findings and trust boundaries through a new request, delayed or edited responses, concurrent runs, and a new push. A stale result never publishes success for the new head.
4. Demonstrate a safe initial rollout using the default-branch trust model and real merge gates. A working local patch is not the end state. If no authorized trusted path exists after safe attempts, retain the reviewable PR and report the precisely verified blocker; never claim merge or completed delivery.
5. Complete independent review, meaningful regression checks, mandatory project preflight, native review from the user-account trigger, remote gates, ordered final role validation, stable two-minute readiness window, exact-head squash merge, and GitHub merged-state verification.

## Role Boundaries And Handoff

- Analyst writes only this `feature-request.md` during intake and later append-only Analyst validation notes when explicitly invoked after Architect passes. No plans, code, tests, commits, push, PR mutations, or merge actions are part of this intake assignment.
- Architect owns `spec.md`, `plan.md`, `tasks.md`, trust and bootstrap dispositions, exact accepted-format rules, event/race verification requirements, and feedback dispositions. Complete feature memory precedes implementation.
- Implementation Agent owns assigned code/tests/durable docs and preflight, preserving all unrelated #220 and sibling changes. It may publish the assigned ready PR with attribution but never merge.
- Review Agent independently reviews the actual diff and process/trust contracts without implementing fixes.
- Orchestrator owns GitHub identity/permission investigation, cycle PR-set tracking, review triggers, gates and reruns, final Architect then Analyst validation, exact current/effective-head guards, the readiness timer, and authorized protected squash merge.
- Cleanup remains unassigned. No role may delete existing environments based on names, age, apparent inactivity, or this intake.

## Open Questions And Risks

- **Permissions:** Orchestrator reports both CLI and GitHub connector authenticated as `kiaquila` with upstream `push=false` and `viewerPermission=READ`. It safely created `kiaquila/cabadrive`, where that user has push/admin authority. `ssh -T git@github.com` confirms the same `kiaquila` identity; the user's OAuth token lacks workflow scope, while existing SSH can publish workflows to that user's fork using explicit `git@github.com:kiaquila/cabadrive.git` without changing `origin` or global identity. Upstream privileged workflow behavior and merge authority remain unproven; fork authority does not grant them.
- **Bootstrap:** The required gate loads trusted scripts from main, so an unmerged compatibility patch may not repair its own gate. Architect must disposition a safe trusted rollout with native evidence, protected required checks, and actual permissions. A fork cannot itself establish upstream trusted-main execution or merge permission.
- **Rules:** Orchestrator reports active upstream main ruleset ID `16148501`, squash-only merge, all code-quality severities, resolved review threads, and no bypass actors. Its visible ruleset contains no required status checks, while project configuration still mandates five checks. The separate branch-protection endpoint returned 404. Do not infer absence of other protection or merge authority from that inaccessible endpoint, and preserve every project-required gate.
- **Existing review request:** Orchestrator already published [the user-account native request on #220](https://github.com/cucumberfalse/cabadrive/pull/220#issuecomment-6203310380) for full SHA `2667f79cd7676ff331730cabf661d38dbbcddb0d`. Do not duplicate that unchanged-head request. A new compatibility PR and every later changed head need their own genuine native review cycle.
- The trusted bot named in the supplied observations is `chatgpt-codex-connector[bot]`; exact trusted-identity handling and formal-review compatibility remain implementation verification duties. Do not trust copied text or another author's marker.
- Orchestrator independently reproduced the exact official-body difference on base with standalone `node --input-type=module`, which printed `legacy=true` and `receipt=false`; no test file was added. The existing 85 focused tests passed. The #220 request has an eyes reaction; that reaction is not a completed review or passing verdict. These are Orchestrator-reported starting observations, not final acceptance evidence.
- Structured summaries may be useful only as wakeup signals or may be used as evidence if strictly validated; Architect must decide and document this boundary. Neither route may reduce positive-verdict or finding-resolution requirements.
- Requirements are settled; unresolved technical, API, permission, and rollout questions are role-assigned dispositions or exceptional blockers rather than a reason for redundant user approval.

## Acceptance Expectations

1. Reproduce the legacy-versus-receipt regression against verified main and retain a meaningful failing regression before the fix. Inspect and preserve #220's existing work, carrying forward any relevant proven behavior without importing its unrelated optimization scope.
2. Tests exercise real positive receipt and legacy forms, preserved native formal reviews, wrong/stale/missing SHA, spoofed author, malformed and duplicated markers, conflicting content, negative/incomplete verdicts, severity, and all unresolved findings. New request markers cannot clear findings.
3. If a structured summary is accepted as evidence, tests reject invalid schema/types, malformed/duplicate markers, missing or non-completed status, wrong/missing/non-full current SHA, missing explicit verdict, unresolved findings, and contradictory data. Test legitimate updates to an older existing comment whose creation predates the current request.
4. Tests cover the actual workflow event filter and runtime router for both created and edited signals, exact current HEAD, new-push races, already-completed and still-active gate runs, bounded requeue behavior, and absence of endless loops/duplicate reruns. Prove the final required check is published for the reviewed head through the real CI path.
5. Local focused checks and project-mandatory preflight pass before every push. Apply meaningful additional checks for the actual scope, including required pipelines; do not rerun unchanged successful checks without a new reason. Update only relevant durable docs/feature memory.
6. Publish one narrowly scoped ready-for-review compatibility prerequisite PR or justify an evidence-backed safe alternative. Preserve #220. Use required commit/PR attribution and session attachment. No scope is silently dropped when permissions or trust bootstrap are difficult.
7. The agent itself posts `@codex review <full-current-head-sha>` from `kiaquila`, waits for a real trusted native result for that exact head, fixes every actionable finding, replies with verifiable fix references, and resolves all review threads. Any changed reviewed head receives a fresh genuine review; unchanged successfully requested heads are not requested twice.
8. All required and applicable validation pipelines, including genuine Codex/AI Review, succeed for the current head. Missing, pending, failed, cancelled, improperly skipped, stale, or manually forged success does not qualify. Verify actual branch/ruleset requirements, no conflicts, resolved review threads, and matching HEAD through GitHub.
9. Record the cycle PR set and current process memory, disposition all feedback, complete final Architect then Analyst validation with ordered timestamps on the same effective content head, and perform the required current-head guard after evidence-only commits. Non-evidence changes invalidate earlier validation.
10. Only after complete merge readiness, record the time and exact HEAD and wait a full 120 seconds. Any HEAD, check, review, thread, or conflict change resets readiness and the full timer. Immediately afterward recheck GitHub and use the standard protected squash path with expected-SHA enforcement, never admin/bypass merge.
11. Verify GitHub reports merged and record the merge commit, review and check outcome, full two-minute hold, branch/worktree, and next step. If objective permission or trusted-rollout blockers remain after safe available attempts, preserve the PR, name the exact evidence-backed blocker and remaining actions, and state clearly that merge is incomplete.

## Final Analyst Validation Notes

Append-only Analyst-owned section used only when Orchestrator invokes final Analyst validation after final Architect validation passes.

- Analyst validation pass: not yet invoked.
- Analyst return count for this work cycle: 0 of 5.
- Customer intent check: pending delivered effective content head and complete cycle evidence.
- Gaps: no intake requirement ambiguity; permission and safe-bootstrap risks require explicit disposition and verified evidence.
- Architect disposition routing: Orchestrator must route any later Analyst gap through Architect before follow-up development.
- Analyst limit escalation: a gap beyond five returns requires a new feature request in separate latest-main isolation.
- Analyst boundary: this artifact is intake only. No implementation, tests, commits, push, PR, review, or merge are claimed by Analyst.
