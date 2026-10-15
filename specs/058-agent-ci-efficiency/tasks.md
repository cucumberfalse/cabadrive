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
- [ ] T010 Publish ready-for-review PR with `Co-authored-by: Codex <codex@openai.com>` at end of description and commit trailer `Co-authored-by: OpenAI Codex <codex@openai.com>` for Codex-assisted commits.
- [ ] T011 Prove this PR takes full baseline/Docker steps remotely and all five required check names conclude literal `SUCCESS` on exact current head; inspect AI Review and resolve all required conversations and blocking findings.
- [ ] T012 Record cycle PR set, task evidence, any feedback dispositions, and exact effective content head before final role validation.
- [ ] T013 On Orchestrator request, Architect validates the full cycle and records passing time, effective-head marker, return count, and any gaps in Architect-owned memory; Analyst validation follows only after Architect passes.
- [ ] T014 For post-validation commits, prove only permitted final evidence changed; otherwise reroute to follow-up work and repeat final validation. Run read-only current-head guard and confirm checks, review, threads, conflicts, and process memory.
- [ ] T015 Once exact-head merge readiness is true, wait at least two minutes, recheck every gate, restart wait if state changed, merge through Orchestrator, and verify GitHub merged state.

## Process Memory

### Dead Ends

- Local `pnpm run preflight` stopped in `validate:images` because this new worktree has no `.cache/image-qa/install-receipt.json` or native QA binaries. The host had about 3.2 GiB free and no `rustup`; remote Linux CI installs pinned Rust/image QA before the full validation. No local Docker result is claimed.
- Full local `pnpm run test` encountered unrelated macOS/Linux-resource and screenshot-port fixture failures and a long-running retention fixture; it was interrupted after about three minutes. The targeted classifier suite passed, and the full remote Linux test suite remains required.

### Decisions

- Full CI is the safe default; short CI requires positive content and prior-run proof.
- Required jobs run on every PR head; only heavy steps may be omitted on a proven evidence-only head.
- The classifier executes from the trusted PR base, records a full-run artifact after the expensive baseline steps, and verifies GitHub run/job/step/artifact metadata before selecting a short route. This workflow-changing PR itself takes full CI.

### Known Issues

- None accepted yet.

### Verification Evidence

- `node --test tests/ci-evidence-route.test.mjs`: four focused positive/negative tests passed, including strict appended-line parsing, full-run provenance, active required jobs, and real Git commit-history classification.
- Ruby YAML parse of `.github/workflows/ci.yml` found both required jobs. `git diff --check`, `node --check` for the new script/test, `pnpm run quality:fast`, `pnpm run format:check`, and `pnpm run verify:quality-negative` passed. `pnpm run build:app` passed and generated the service worker.
- `pnpm run preflight` and `pnpm run build` reached `validate:images` then stopped on the missing local native QA receipt. Full remote baseline/Docker checks are mandatory acceptance evidence. No local Docker claim.

### Cycle PR Set

- One planned slice: `codex/058-agent-ci-efficiency`; PR not yet created; final-validation inclusion pending.

### Final Validation Evidence

Append only the schema-valid final evidence lines after the effective content head is frozen; record substantive explanations before that freeze.

### Cleanup Evidence

- No cleanup assigned. Preserve this and sibling worktrees until Orchestrator disposition.

## Implementation Agent Feedback

- None.

## Architect Dispositions

- None.
