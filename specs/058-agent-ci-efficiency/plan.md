# Plan: Agent and CI efficiency

## Design

Keep the current five required check names and branch protection. Add a small deterministic route evaluator used by both existing CI jobs. The evaluator defaults to `full` and emits a bounded JSON decision with an explicit reason. It reads exact PR head/base identities, full Git commit/tree data, strict final-validation evidence sections, and GitHub's read-only workflow-run/job metadata. A prior full run emits a provenance record after the heavy steps; API run/job success and actual successful expensive steps are mandatory, while the record binds the base and workflow identity that the run tested. The short route executes a proof step in each required job and skips only the expensive steps inside those jobs. `guard`, `AI Review`, and `osv-scan` continue as independent workflows. This PR changes the workflow/control path, so its own route must be `full` on every head.

Do not let source content from the PR define the classifier's trust policy. Pin classifier/control identity to the trusted base or compare those files to the trusted base and force `full` for the entire PR if they differ. Use the GitHub API as the authority for run, attempt, job, step, and artifact association. Reject incomplete pagination or data. The implementation may choose a simpler conservative rule than the candidate format if it keeps the stated positive proof and fallbacks; it must not expand the short class without Architect disposition.

The route evaluator should not execute arbitrary PR code while deciding whether to skip checks. Its allowed evidence parser uses a fixed set of final-validation headings and machine-readable keys, validates SHA/time/count syntax and marker agreement, and compares every commit from `E` to current head. Require an existing final-validation heading in each edited file at `E`; no broad `docs/**` or `specs/**` shortcut. The full branch runs the existing steps unchanged. A failure to query historical runs or to prove base identity chooses full. If full cannot execute due to a hard error, leave the required job red.

Evidence schema: `feature-request.md` permits only Analyst pass/time/validated-effective-head/return-count bullets under its existing `## Final Analyst Validation Notes`; `tasks.md` permits only effective-head and Architect pass/time/validated-effective-head/return-count bullets under `## Final Architect Validation Notes`. Finalizer-compatible process proof permits one strictly parsed guard bullet under existing `### Final Validation Evidence`: effective SHA `E`, observed head SHA, UTC observation time, actual pass result, and immutable proof identifier. It may also permit a strictly parsed, timestamped `### Cycle PR Set` bullet naming PR number, branch, observed head, factual status, and final-validation inclusion. Each addition must be section-local append-only; all prior bytes and other sections remain identical at each commit. Reject unverifiable free text or future-success claims. A guard entry necessarily describes the head observed before its evidence commit, so Orchestrator rechecks the latest head outside the commit immediately before merge. Role values are constrained to literal `passed`, UTC ISO time, full SHA, and bounded decimal count. Keep role-owned sections free of placeholder key/value lines before `E`.

Architect disposition of P1 finalizer integration findings: accepted. Before `E`, Implementation Agent must record a truthful sole-PR cycle entry with literal `branch`, `status`, and `final-validation inclusion`, and `Limit escalation: none` in `### Final Validation Evidence` only while no limit has breached. These are required by `parseProcessEvidence.currentProcessMemory`; role return counts arrive with final validation. After `E`, the exact guard bullet above supplies `currentHeadGuardEvidence` without replacing earlier text. Extend the classifier's section-local append proof for that bullet and optional factual cycle snapshot, then cross-test the same fixture against `readProcessEvidence`, `verifyPostEffectiveHeadChanges`, and short-route classification. This resolves the P1 mismatch without loosening finalizer gates. A later limit breach or substantive process correction selects full CI and role revalidation as appropriate.

## Agent guidance

Update `AGENTS.md`, `CLAUDE.md`, and a relevant task/plan template only where monitoring instructions are mirrored. Orchestrator owns one status watch per PR/check group. Prefer `wait_threads` or a completion event for agents; use a bounded wait with a clear deadline for CI and check once when it expires, then back off. A failed/stuck check gets a reasoned rerun/escalation decision; a changed head, completed run, review event, or planned merge decision gets a fresh current-state check. Do not suppress the final exact-head checks or narrate unchanged polls.

## Verification matrix

| Fixture or scenario | Expected route/result |
| --- | --- |
| Valid role evidence additions after one successful full run on same PR, `E`, base, and workflow | Short; both named jobs actually succeed on current head with JSON provenance |
| Structured observed guard and optional factual cycle status added to existing sections; finalizer parses current process/guard evidence | Short only with exact `E`, observation/proof data, successful prior full run, and external latest-head recheck |
| This PR, changed workflow/rules/classifier, or any code/test/content/asset/lock/build change | Full; unchanged baseline and Docker proof steps run |
| Semantic requirements/tasks/dispositions, free text, new heading, modified/deleted/renamed lines, mixed paths | Full |
| Missing/mismatched markers, non-ancestor `E`, shallow diff, fork/API failure, missing prior run/record, failed/skipped prior job step, wrong PR/branch/base/workflow | Full or red required job; never short |
| Main push or manual dispatch | Full |
| Short-route runtime proof error | Full if safe, otherwise red required job |
| Required check/review/merge readiness change during two-minute delay | Revalidate and restart delay |

Local verification should run focused evaluator tests, YAML/static checks, and normal preflight where practical. The host has limited free disk space; remote CI is the required full Docker proof for this workflow-changing PR. Do not claim local Docker passed unless actually run. Review Agent checks trust boundaries, ordinary change routing, and no job-level skips; Orchestrator verifies GitHub current-head conclusions and review threads.

## Handoff and boundaries

Architect owns this plan, spec, tasks, and later Architect dispositions/validation. Implementation Agent owns assigned rule, workflow, script, test, and process-evidence edits and PR publication. Review Agent performs independent review without editing. Orchestrator owns CI/review coordination, ordered final validation, two-minute readiness delay, merge, and merged-state verification. No cleanup of sibling environments is assigned.
