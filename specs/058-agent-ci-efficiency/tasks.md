# Tasks: Agent and CI efficiency

## Setup

- [x] T001 Confirm Orchestrator assignment, feature memory, one worktree/branch/PR slice, verified `origin/main` base `9e17a059536586d8c2319f8cabcea9bcd288385d`, and parallel-work preservation warning; record status before editing.
- [x] T002 Read intake, spec, plan, relevant agent rules, CI, required-check config, and finalizer; preserve all sibling work and process memory.

## Implementation

- [x] T003 Update agent rules and relevant templates with single-owner completion-driven/bounded monitoring, backoff, stuck-run handling, and exact-head recheck. Preserve role boundaries, AI Review, independent review, ordered validation, and merge gates.
- [x] T004 Implement strict evidence-section and commit-by-commit classifier with full as default; pin/trust the policy, verify markers, ancestry, exact path/section/line schema, and reject semantic or ambiguous edits.
- [x] T005 Add full-run provenance and GitHub API verification of same PR/repo/branch/effective head, base SHA, workflow identity, successful required jobs, and actually successful heavy steps; missing proof routes full or red.
- [x] T006 Keep `baseline-checks` and `docker-validation` present on every current head. Route only expensive steps within jobs; preserve all existing full-path steps and unchanged independent `guard`, `AI Review`, and `osv-scan` behavior. Ensure this PR itself always selects full.
- [x] T007 Add focused positive/negative matrix tests from the plan, including base drift, missing/failed/skipped provenance, malformed evidence, changed workflow/classifier, and current-head output.
- [x] T008 Update durable process/CI documentation where behavior changes; record decisions, dead ends, known issues, and any Implementation Agent feedback for Architect disposition. Do not expand scope without disposition.

## Verification and PR

- [x] T009 Run focused local tests and applicable preflight, record commands/results; do not infer a local full Docker pass from remote results.
- [x] T010 Publish ready-for-review PR with `Co-authored-by: Codex <codex@openai.com>` at end of description and commit trailer `Co-authored-by: OpenAI Codex <codex@openai.com>` for Codex-assisted commits.

## Finalization Protocol

T011–T015 are future published-head and final-role duties, not completed implementation tasks. Freeze these definitions before final validation; record actual outcomes as append-only evidence in the existing role and process sections, without later checkbox edits or premature success claims.

- T011: Prove the current PR head takes full baseline/Docker steps and all five required checks conclude literal `SUCCESS`; inspect AI Review and resolve required conversations and blocking findings. Record factual results in `Verification Evidence` and `Cycle PR Set` before the effective-content freeze. A new substantive fix creates a new content head and repeats these gates.
- T012: Reconcile the cycle PR set, task evidence, and any feedback dispositions before freezing the effective content head. Append the exact effective SHA as role-owned validation evidence after the freeze; record any later current-head process evidence under `Final Validation Evidence` only when actually observed.
- T013: On Orchestrator request, Architect validates the full cycle and appends pass, UTC time, effective-head marker, and return count under `Final Architect Validation Notes`; Analyst follows only after Architect passes and appends its corresponding lines in `feature-request.md`. A gap requiring substantive changes resets the effective head and ordered validation.
- T014: Prove post-validation commits contain only permitted evidence, or repeat role-appropriate work and validation. Orchestrator runs the read-only current-head guard and rechecks checks, review, threads, conflicts, and process memory; record factual process evidence under `Final Validation Evidence` when appropriate.
- T015: Once exact-head merge readiness is true, wait at least two minutes, recheck every gate, restart the wait if state changed, merge through Orchestrator, and verify GitHub merged state. Report actual merge proof only after GitHub confirms it.

## Process Memory

### Dead Ends

- Local `pnpm run preflight` stopped in `validate:images` because this new worktree has no `.cache/image-qa/install-receipt.json` or native QA binaries. The host had about 3.2 GiB free and no `rustup`; remote Linux CI installs pinned Rust/image QA before the full validation. No local Docker result is claimed.
- Full local `pnpm run test` encountered unrelated macOS/Linux-resource and screenshot-port fixture failures and a long-running retention fixture; it was interrupted after about three minutes. The targeted classifier suite passed, and the full remote Linux test suite remains required.
- Review found the initial classifier would allow Architect completion bullets under `Final Validation Evidence`, while the existing finalizer rejected the completion timestamp there. The role-owned heading and cross-check test now require a common accepted schema.

### Decisions

- Full CI is the safe default; short CI requires positive content and prior-run proof.
- Required jobs run on every PR head; only heavy steps may be omitted on a proven evidence-only head.
- The classifier executes from the trusted PR base, records a full-run artifact after the expensive baseline steps, and verifies GitHub run/job/step/artifact metadata before selecting a short route. This workflow-changing PR itself takes full CI.
- Architect bullets are append-only under the existing `Final Architect Validation Notes` heading; `Final Validation Evidence` remains for other factual process evidence and does not select short CI.

### Known Issues

- None accepted yet.

### Verification Evidence

- `node --test tests/ci-evidence-route.test.mjs tests/quality-tooling.test.mjs`: 12 tests passed, including strict appended-line parsing, full-run provenance, active required jobs, and real Git commit-history classification.
- Ruby YAML parse of `.github/workflows/ci.yml` found both required jobs. `git diff --check`, `node --check` for the new script/test, `pnpm run quality:fast`, `pnpm run format:check`, and `pnpm run verify:quality-negative` passed. `pnpm run build:app` passed and generated the service worker.
- `pnpm run preflight` and `pnpm run build` reached `validate:images` then stopped on the missing local native QA receipt. Full remote baseline/Docker checks are mandatory acceptance evidence. No local Docker claim.
- Initial independent review reported no findings at implementation head `eb3a8635524493b715d711451752c5e462c34cd4`; a later review found the finalizer/classifier heading mismatch, fixed in this follow-up. The focused classifier/finalizer/quality suite passed 73 tests; `pnpm run quality:fast`, `pnpm run format:check`, syntax checks, and `git diff --check` passed. Remote CI, AI Review, and final role validation are pending.

### Cycle PR Set

- One slice: ready-for-review PR #220 (`codex/058-agent-ci-efficiency`), published at implementation head `eb3a8635524493b715d711451752c5e462c34cd4`; final-validation inclusion pending.

### Final Validation Evidence

Record other factual final process evidence here. The strict CI short route accepts only Architect and Analyst validation bullets under their role-owned headings; added prose or other process evidence takes full CI.

### Cleanup Evidence

- No cleanup assigned. Preserve this and sibling worktrees until Orchestrator disposition.

## Implementation Agent Feedback

- None.

## Architect Dispositions

- None.

## Final Architect Validation Notes

Append only the schema-valid Architect validation bullets after the effective content head is frozen. Record substantive explanations before that freeze.
