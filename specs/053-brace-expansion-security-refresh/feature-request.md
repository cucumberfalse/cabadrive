# Feature Request: Обновление brace-expansion после нового security advisory

## Intake Metadata

- Feature ID: `053-brace-expansion-security-refresh`
- Intake role: Analyst
- Assigned worktree: `/Users/chap/devel/cabadrive-worktrees/051-asset-retention`
- Assigned branch: `codex/051-asset-retention`
- Existing PR: `#217`
- Verified latest base supplied by Orchestrator: `origin/main` at `2a92bcfcb7638d1094f33b28e4c2932fb2e4121e`
- Assigned branch head at intake: `0ab100ebcb4cdb4f19f4bb148675184b7a10b8a5`
- Base relationship at intake: verified `origin/main` is an ancestor of the assigned clean PR head.
- Intake date: 2026-09-30
- Parallel-work warning: parallel branches, worktrees, commits, PRs, and process memory exist. Preserve all sibling state and do not overwrite, revert, rebase, merge, close, delete, or otherwise mutate it outside explicit Orchestrator coordination.
- Analyst scope: create exactly this `feature-request.md`. Do not edit dependencies, lockfiles, code, tests, docs, workflows, feature-051/052 artifacts, or other files; do not commit, push, review, rerun checks, or merge.

## Original Request And Trigger

The user repeatedly authorized the Orchestrator to do the work needed to merge all in-scope PRs without reducing quality. PR #217 is currently blocked by a newly published OSV finding against the dependency graph inherited by both latest `origin/main` and the PR branch.

The supplied exact-head OSV evidence reports two newly vulnerable `brace-expansion` versions:

| Dependency line | Current locked version | Minimum fixed version | Observed owner path |
| --- | --- | --- | --- |
| 1.x | `1.1.18` | `1.1.21` | `minimatch@3.1.5` in the ESLint toolchain |
| 5.x | `5.0.9` | `5.0.12` | `minimatch@10.2.5` in the `@typescript-eslint` toolchain |

This is a new independent security-gate follow-up. It is not a request to suppress the finding, weaken the workflow, or reopen unrelated implementation design. The required outcome is the smallest compatible dependency/lock resolution that removes both vulnerable lines and restores a truthful green OSV gate on the exact PR head.

## Startup Fallback And Repository Context

Normal new-work startup uses a fresh worktree from latest verified `main`. Orchestrator explicitly assigned a documented fallback to the existing clean PR #217 branch/worktree because:

1. the newly published advisory directly blocks that already-open PR;
2. verified `origin/main` shares the same vulnerable locked versions, so merely restarting from `main` would not avoid the security failure;
3. the assigned PR head contains the unmerged feature-051/052 work that must pass the corrected gate before it can merge; and
4. `origin/main` at `2a92bcfcb7638d1094f33b28e4c2932fb2e4121e` is a verified ancestor of clean assigned head `0ab100ebcb4cdb4f19f4bb148675184b7a10b8a5`.

This fallback is limited to feature 053 and PR #217. It is not a general workflow relaxation. Feature 053 remains its own work cycle and feature memory even though its single implementation slice will contribute to existing PR #217 under Orchestrator control.

Relevant project constraints:

- Cabadrive is a static local-first React/TypeScript application with no runtime backend.
- End-user runtime is Docker-only, while repository quality and dependency verification use the pinned package manager.
- `package.json` declares `packageManager: pnpm@10.33.0` and an existing unrelated `@babel/core` override that must be preserved unless an evidenced incompatibility requires Architect disposition.
- Required checks, including `osv-scan`, must be green on the exact current PR head before merge.
- The default branch must remain deployable, and security findings may not be hidden through allowlists or workflow weakening.

## Observed Local Facts

Read-only inspection of assigned head `0ab100ebcb4cdb4f19f4bb148675184b7a10b8a5` confirmed:

- `pnpm-lock.yaml` contains package and snapshot entries for `brace-expansion@1.1.18` and `brace-expansion@5.0.9`.
- `minimatch@3.1.5` resolves `brace-expansion: 1.1.18`.
- `minimatch@10.2.5` resolves `brace-expansion: 5.0.9`.
- Both lines were valid outcomes of the earlier feature-050 security refresh, but the new advisory raises the fixed floors to `1.1.21` and `5.0.12`; previous OSV evidence therefore cannot establish current merge readiness.
- The worktree was clean before this intake artifact was created.

The advisory versions and fixed thresholds are supplied by Orchestrator from the current required-check failure. No CVE/GHSA identifier is inferred or invented by this intake.

## Problem Statement

PR #217 cannot be merged while its exact-head dependency graph contains two versions now reported as vulnerable by the mandatory OSV check. Updating only one major line would leave the other finding active. Bypassing or suppressing the scanner would reduce release quality and violate the repository completion contract.

A narrow compatible refresh must update both transitive `brace-expansion` lines, prove their actual owners and resolved versions, retain the surrounding toolchains unless resolver compatibility genuinely requires a minimal related change, and run the complete quality/security gates on the resulting head.

## Goal

Restore merge readiness for PR #217 by resolving every locked `brace-expansion` occurrence to a non-vulnerable compatible version—1.x at or above `1.1.21` and 5.x at or above `5.0.12`—without changing product behavior, weakening OSV enforcement, or introducing unrelated dependency modernization.

## Scope

### In scope

- Update the `brace-expansion` 1.x line from `1.1.18` to at least `1.1.21`.
- Update the `brace-expansion` 5.x line from `5.0.9` to at least `5.0.12`.
- Use exactly `pnpm 10.33.0` for dependency resolution and install verification.
- Prefer ordinary compatible lockfile resolution under the existing manifest and owner ranges.
- Change `pnpm-lock.yaml` and, only if strictly necessary for deterministic compatible resolution, the smallest dependency metadata in `package.json`.
- Audit every changed package key, snapshot, integrity value, dependency edge, peer suffix, engine declaration, and importer entry.
- Prove both final owner paths and the absence of any vulnerable duplicate occurrence.
- Run frozen-install determinism, focused dependency checks, full repository quality/preflight, and exact-head GitHub OSV/required-check verification.
- Record feature-053 implementation, review, validation, and current-head evidence in feature-053 process memory owned by the appropriate roles.

### Out of scope

- Application behavior, UI, content, tests unrelated to dependency verification, service-worker behavior, Docker runtime design, asset-retention behavior, compose-project provenance behavior, or product documentation.
- Broad dependency refreshes, `--latest`, forced resolution, major toolchain migration, opportunistic upgrades, or cleanup of unrelated dependencies.
- Changing `eslint`, `typescript-eslint`, either `minimatch` owner line, or another package unless ordinary compatible resolution cannot select the fixed `brace-expansion` release and Architect records why the smallest related movement is required.
- Blanket overrides. A targeted override is exceptional and requires evidence that ordinary compatible resolution cannot reach a fixed version, plus compatibility proof and Architect justification.
- OSV suppression, ignore entries, allowlists, scanner exclusions, workflow weakening, renaming/removing the required check, or marking a known finding as accepted.
- Revisiting already completed feature-051/052 design outside an actual compatibility regression caused by this dependency update.
- Mutating sibling PRs or their branches/worktrees.

## Functional Requirements

1. **Both vulnerable lines are removed independently.** The final lock graph contains no `brace-expansion` 1.x version below `1.1.21` and no 5.x version below `5.0.12`.
2. **All occurrences are covered.** Updating one package key or one owner edge is insufficient if any vulnerable package or snapshot occurrence remains.
3. **Compatible resolution comes first.** Implementation must first attempt the narrowest ordinary pnpm-compatible resolution under current manifest/owner ranges.
4. **Manifest stability is preferred.** If lockfile-only resolution is sufficient, `package.json` remains byte-identical. Any manifest edit must be the smallest deterministic necessity and explicitly evidenced.
5. **Owner/toolchain stability is preferred.** `minimatch@3.1.5`, `minimatch@10.2.5`, ESLint, and `@typescript-eslint` remain unchanged unless the resolver proves a fixed brace line is incompatible; any necessary related change requires Architect disposition before scope expansion.
6. **No unrelated resolver drift.** Every changed package outside the two `brace-expansion` versions must be a required consequence of the minimal resolution and explicitly explained. Unexplained churn is removed.
7. **Existing package-manager contract is preserved.** `pnpm@10.33.0`, scripts, unrelated direct ranges, `onlyBuiltDependencies`, and the existing `@babel/core` override stay unchanged unless an evidenced direct conflict is dispositioned.
8. **Security enforcement remains intact.** The OSV workflow/configuration and required-check policy are not weakened or bypassed.
9. **Product behavior remains unchanged.** No product/runtime/content change is part of this maintenance slice.

## Acceptance Expectations

Architect must convert these expectations into explicit tasks and evidence locations. Minimum acceptance evidence is:

- **Negative baseline:** record the supplied failing exact-head OSV result and both reported vulnerable/fixed version pairs before mutation.
- **Threshold and duplicate proof:** final lock inspection shows 1.x `>=1.1.21` and 5.x `>=5.0.12`, with zero remaining occurrences below those floors in package keys, snapshots, and dependency edges.
- **Ownership proof:** final `pnpm why brace-expansion --recursive` (or equivalently precise pnpm evidence) records both installed major lines and their paths through `minimatch@3.1.5`/ESLint and `minimatch@10.2.5`/`@typescript-eslint`, or explains any Architect-approved minimal owner movement.
- **Complete diff audit:** the manifest/lock diff names and explains every changed entry. If anything besides the two brace version lines and mechanically corresponding lock metadata changes, the evidence explains why it is resolver-required.
- **Compatibility proof:** the resolved packages install under the repository's supported Node/Docker environments and do not introduce an incompatible engine or peer requirement. Any changed engine declaration is explicitly reviewed.
- **Deterministic install:** a clean/frozen install with `pnpm 10.33.0` succeeds and leaves `package.json` and `pnpm-lock.yaml` unchanged afterward.
- **Focused quality:** typecheck, lint, format check, and fast quality tests pass on the implementation head.
- **Full quality:** `pnpm run preflight` passes on the implementation head, including unit/content/build/e2e coverage required by the repository.
- **Docker compatibility:** the applicable real Docker build/runtime validation for PR #217 remains green; the transitive tooling refresh must not break the Docker-only contract.
- **Exact-head security:** GitHub's required `osv-scan` check passes on the exact current PR head after the update. A local scan or an earlier-head green run is not sufficient.
- **Required gates:** every required check from `.unicorn-hub/config.json` is green on the exact current head, review has no unresolved blocking thread, and the PR remains conflict-free.
- **Diff boundary:** no app, content, runtime, service-worker, Docker design, workflow, scanner configuration, or sibling-feature file changes appear except feature-053 process memory and any narrowly justified dependency files.
- **Renewed final validation:** because dependency content changes after earlier validations, Orchestrator obtains final Architect validation and then final Analyst validation for feature 053 on the renewed effective content head and performs the current-head evidence-only guard before merge.

## Negative Scenarios

- Only `brace-expansion` 1.x or only 5.x is fixed: reject.
- A vulnerable duplicate remains in a package entry, snapshot, or owner edge: reject.
- `package.json` receives an override even though ordinary compatible lockfile resolution works: reject.
- A blanket override, OSV ignore, allowlist, path exclusion, workflow edit, or branch-protection weakening makes the check green without removing the vulnerable graph: reject.
- The resolver upgrades ESLint, TypeScript tooling, `minimatch`, direct dependencies, or unrelated transitive packages without proven necessity: narrow or reject the diff.
- The fixed 5.x release introduces an engine constraint incompatible with repository CI/Docker Node versions: stop and return evidence for Architect disposition rather than forcing the install or weakening engines.
- A frozen install rewrites either manifest or lockfile: determinism failed.
- Local tests pass but the exact current PR head has a red, missing, queued, stale, or skipped OSV check: merge remains blocked.
- Earlier feature-051/052 validation evidence is reused as if it covered the new dependency graph: reject; renew role validation for the effective content head.
- Sibling PR or worktree state is altered while resolving PR #217: process violation.

## Assumptions

- The required-check output supplied by Orchestrator is authoritative intake evidence for the newly published advisory; no external lookup is needed to define the two fixed thresholds.
- `1.1.21` and `5.0.12` are minimum safe floors, not mandatory exact pins. A higher compatible patch release is acceptable only if selected by the narrow ordinary resolver and fully audited.
- Both affected packages are development-toolchain transitives and should not change shipped learner-visible runtime behavior; final graph inspection must confirm this rather than relying only on the assumption.
- Current `minimatch` ranges can accept the fixed releases. If this is false, Implementation Agent records the conflict and returns it for Architect disposition instead of broadening scope independently.
- No workflow change is expected. The existing required OSV gate is correctly preventing merge and must remain intact.
- No user clarification is required: the vulnerability, fixed floors, merge objective, and prohibition on quality reduction determine the requested outcome.

## Risks And Mitigations

| Risk | Impact | Required mitigation |
| --- | --- | --- |
| Only one major line is refreshed | OSV remains red; known exposure remains | Inspect and evidence both lines independently |
| Resolver creates broad lock churn | Regression and review risk | Use narrow compatible resolution; audit every changed entry |
| New engine/peer constraint is incompatible | CI or Docker breakage | Inspect metadata and test supported environments before acceptance |
| Override hides an ownership incompatibility | Fragile future installs | Ordinary resolution first; override only with failed-attempt and compatibility evidence |
| Exact-head OSV result is stale | False merge readiness | Match the check run to current PR head SHA |
| Earlier validation is treated as current | New dependency content escapes final validation | Renew Architect then Analyst validation on the new effective content head |
| Existing PR fallback leaks into normal workflow | Future tasks reuse stale branches | Record this exception as advisory-specific and PR-#217-only |
| Parallel work is overwritten | Loss of sibling changes | Preserve all external branches/worktrees and limit edits to assigned scope |

## Relationship To Features 050, 051, 052 And PR #217

- Feature 050 previously moved `brace-expansion` to versions that were safe under the advisory baseline at that time. Feature 053 exists because a newer advisory now reports those exact versions as vulnerable; this does not invalidate the correctness of feature 050's historical evidence.
- Features 051 and 052 are already present on PR #217. Feature 053 is a separate security follow-up cycle but, under the documented Orchestrator fallback, its single implementation slice contributes to the same PR so the blocked exact head can become merge-ready.
- Feature 053 does not reopen asset-retention or compose-provenance scope. Those behaviors receive regression verification only to ensure the dependency refresh did not break them.
- Any prior final-validation claim tied to an older effective content head cannot cover the new dependency mutation. Orchestrator must establish a renewed effective content head and complete final Architect-before-Analyst validation before finalizing PR #217.

## Research

No external research was used. Intake evidence consists of the required OSV check details supplied by Orchestrator plus read-only inspection of the assigned manifest/lock graph and repository process documentation. This avoids inventing an advisory identifier not present in the supplied evidence.

## Role Handoff

- Analyst created only this intake artifact and hands control back to Orchestrator.
- Architect owns `spec.md`, `plan.md`, and `tasks.md`, including the exact narrow resolution command/strategy, compatibility and negative checks, allowed diff, cycle PR-set record, and any exceptional override or owner-movement disposition.
- Implementation Agent begins only after complete feature memory and explicit assignment in this worktree. It uses `pnpm 10.33.0`, preserves parallel work, records complete evidence, and stops on genuine scope expansion.
- Review Agent reviews the exact dependency/process-memory diff, both major lines, compatibility evidence, scanner integrity, and role/process boundaries without editing files.
- Orchestrator coordinates commit/push, exact-head required checks, review-thread resolution, final Architect then Analyst validation, current-head guard, and conservative merge of PR #217.

## Initial Cycle Context

At intake, feature 053 has no separate PR. Its Orchestrator-approved single slice is assigned to existing PR #217 (`codex/051-asset-retention`) at clean starting head `0ab100ebcb4cdb4f19f4bb148675184b7a10b8a5`, with verified `origin/main` `2a92bcfcb7638d1094f33b28e4c2932fb2e4121e` as an ancestor. This is an explicit fallback because the newly published advisory blocks the existing PR and is also present on latest main. Orchestrator must record the final contributing head/status in feature-053 process memory.

## Final Analyst Validation Notes

### Renewed combined-cycle validation after F054 return #5 — 2026-10-06

- Analyst validation pass: passed
- Final Analyst validation completed at: 2026-10-06T00:41:13Z
- Analyst validated effective content head: 4a687f788d1eed2e5dae8f3f7397e8ef8c765064
- Analyst return count: 0 / 5.
- Combined PR-set coverage: PR #217 on branch `codex/051-asset-retention`
  contains the complete F051/F052/F053/F054 result through F054 return #5. All
  behaviorally meaningful content is in the effective head above; later
  uncommitted changes present during validation are role-owned final-validation
  evidence only.
- Customer-intent validation: feature 053 remains satisfied in spirit and
  letter. Both vulnerable dependency lines remain resolved at
  `brace-expansion@1.1.21` and `brace-expansion@5.0.12`, without a vulnerable
  duplicate, manifest override, owner/toolchain movement, unrelated dependency
  churn, scanner suppression, or workflow weakening. F054 returns #2–#5 remain
  within the bounded static publish/handoff transaction, recovery, ownership,
  Docker, direct-test, documentation, and process-memory surfaces.
- Combined safety evidence: F054 maintains activation-last ordering,
  no-follow bounded authority reads, exact journal/legacy recovery, inode-bound
  destination ownership, immutable publish generations, post-durability locked
  validation, and safe rootful/rootless ownership mapping. Final preflight
  passed 673/673 Node tests plus production/service-worker builds and 158/158
  Playwright tests; focused return-#5 contracts passed 80/80; isolated Docker
  lifecycle `cabadrive-retention-97105-1791246610556` passed; exact-head Review
  passed and every technical thread is resolved.
- Process validation: F052 remains closed/escalated at 10/10, F053 remains at
  Architect return count 0/10, and F054 passes at 5/10; Analyst return count is
  0/5. No unresolved feedback, finding, accepted known issue, security
  exception, or customer-intent gap remains. Exact-current-head security and
  required-check confirmation, thread/conflict inspection, and the
  evidence-only guard remain mandatory Orchestrator merge gates.

The F054 return-#1 Analyst validation for effective head
`f3f925c883b94327876a9f7c053917afdb56f777`, and every earlier Analyst marker,
is historical and superseded for merge authority by this return-#5 validation.

### Renewed combined-cycle validation after feature 054 — 2026-10-05

- Analyst validation pass: passed
- Final Analyst validation completed at: 2026-10-05T01:46:00Z
- Analyst validated effective content head: f3f925c883b94327876a9f7c053917afdb56f777
- Analyst return count: 0 / 5.
- Combined PR-set coverage: PR #217 on branch `codex/051-asset-retention`
  contains the complete F051/F052/F053/F054 result. All behaviorally meaningful
  content is contained in the effective head above; the later uncommitted
  changes present during this validation are role-owned final-validation
  evidence only.
- Customer-intent validation: feature 053 remains satisfied in spirit and
  letter after feature 054. Both vulnerable dependency lines remain resolved
  at `brace-expansion@1.1.21` and `brace-expansion@5.0.12`, with no vulnerable
  duplicate, manifest override, owner/toolchain movement, unrelated dependency
  churn, scanner suppression, or workflow weakening. F054 changes only the
  assigned static publish/handoff transaction and its direct tests/docs/memory;
  the audited dependency graph and product behavior remain preserved.
- Combined behavior and recovery evidence: all three F054 blockers are closed,
  activation is last after durable output/export, marker/current authority is
  no-follow and fail-closed, and the legacy-aware exact retry converges only
  for the unchanged bound request. F054 controls passed 4/4, return #1 passed
  1/1, staging passed 58/58, combined contracts passed 105/105, full preflight
  passed 655/655 Node tests plus build/service-worker generation and 158/158
  Playwright tests, and isolated Docker lifecycle
  `cabadrive-retention-10658-1791164306953` passed. Exact-head bounded Review
  passed without findings and all technical threads are resolved.
- Process validation: F052 is closed/escalated at 10/10, F053 remains at
  Architect return count 0/10, and F054 passes at 1/10; Analyst return count is
  0/5. No unresolved feedback, finding, accepted known issue, security
  exception, or customer-intent gap remains. Exact-current-head security and
  required-check confirmation, thread/conflict inspection, and the
  evidence-only guard remain mandatory Orchestrator merge gates.

The final-return-#10 Analyst validation for effective head
`d4fd6d9ffb5c5c7442d6e728410abc3d91062472`, and every earlier Analyst marker,
is historical and superseded for merge authority by this combined F054
validation.

### Renewed combined-cycle validation — 2026-10-04 final return #10

- Analyst validation pass: passed
- Final Analyst validation completed at: 2026-10-04T10:10:23Z
- Analyst validated effective content head: d4fd6d9ffb5c5c7442d6e728410abc3d91062472
- Analyst return count: 0 / 5.
- Combined PR-set coverage: PR #217 on branch `codex/051-asset-retention`
  covers feature 051 asset retention, feature 052 Compose-project provenance,
  and this feature 053 security refresh. All behaviorally meaningful content is
  contained in the effective head above; the later uncommitted changes present
  during this validation are role-owned final-validation evidence only.
- Customer-intent validation: feature 053 remains satisfied in spirit and
  letter after final F052 return #10. Both vulnerable dependency lines remain
  resolved at `brace-expansion@1.1.21` and
  `brace-expansion@5.0.12`, with no vulnerable duplicate, manifest edit,
  override, owner/toolchain movement, unrelated dependency churn, scanner
  suppression, or workflow weakening. The conditional clean-no-legacy export
  correction does not alter the audited dependency graph or product behavior
  outside its assigned deployment-safety scope.
- Compatibility and combined evidence: the direct R052-021 control passed 1/1,
  combined focused contracts passed 101/101, full preflight passed 651/651 Node
  tests plus production build/service-worker generation and 158/158 Playwright
  tests, and isolated Docker lifecycle
  `cabadrive-retention-46613-1791042391648` passed. Exact-head bounded Review
  Agent inspection passed without findings and `r4173723121` is resolved.
- Process validation: F052 completes R052-001 through R052-021 at its maximum
  Architect return count 10/10; F053 remains at Architect return count 0/10
  and Analyst return count 0/5. No unresolved feedback, finding, accepted known
  issue, security exception, escalation condition, or customer-intent gap
  remains. Exact-current-head security and required-check confirmation,
  thread/conflict inspection, and the evidence-only guard remain mandatory
  Orchestrator merge gates.

The return-#9 Analyst validation for effective head
`dbe850e8979a2595fa065a04a28c32661f8f4250`, and every earlier Analyst marker,
is stale and explicitly superseded by this final return-#10 validation.

### Renewed combined-cycle validation — 2026-10-03 return #9

- Analyst validation pass: passed
- Final Analyst validation completed at: 2026-10-03T15:29:53Z
- Analyst validated effective content head: dbe850e8979a2595fa065a04a28c32661f8f4250
- Analyst return count: 0 / 5.
- Combined PR-set coverage: PR #217 on branch `codex/051-asset-retention`
  covers feature 051 asset retention, feature 052 Compose-project provenance,
  and this feature 053 security refresh. All behaviorally meaningful content is
  contained in the effective head above; the later uncommitted changes present
  during this validation are role-owned final-validation evidence only.
- Customer-intent validation: feature 053 remains satisfied in spirit and
  letter after feature-052 returns #8/#9. Both vulnerable dependency lines
  remain resolved at `brace-expansion@1.1.21` and
  `brace-expansion@5.0.12`, with no vulnerable duplicate, manifest edit,
  override, owner/toolchain movement, unrelated dependency churn, scanner
  suppression, or workflow weakening. The static-export correction does not
  alter the audited dependency graph or product behavior outside its assigned
  deployment-safety scope.
- Compatibility and combined evidence: the return-#9 control passed 1/1,
  combined focused contracts passed 101/101, full preflight passed 651/651 Node
  tests plus production build/service-worker generation and 158/158 Playwright
  tests, and isolated Docker lifecycle
  `cabadrive-retention-33337-1791040747514` passed. Exact-head bounded Review
  Agent inspection passed without findings and the prior P1 is resolved.
- Process validation: F052 is complete at Architect return count 9/10 and F053
  remains at Architect return count 0/10 and Analyst return count 0/5. No
  unresolved feedback, technical finding, accepted known issue, security
  exception, or customer-intent gap remains. Exact-current-head security and
  required-check confirmation, thread/conflict inspection, and the
  evidence-only guard remain mandatory Orchestrator merge gates.

The return-#7 Analyst validation for effective head
`efaa9fe3d74f8d13d029286e6689fc46591f78b5`, and every earlier Analyst marker,
is stale and explicitly superseded by this return-#9 validation.

### Renewed combined-cycle validation — 2026-10-01 return #7

- Analyst validation pass: passed
- Final Analyst validation completed at: 2026-10-01T17:07:24Z
- Analyst validated effective content head: efaa9fe3d74f8d13d029286e6689fc46591f78b5
- Analyst return count: 0 / 5.
- Combined PR-set coverage: PR #217 on branch `codex/051-asset-retention`,
  covering feature 051 asset retention, feature 052 Compose-project provenance,
  and this feature 053 security refresh. Current head equals the effective
  content head exactly and has no later delta.
- Customer-intent validation: feature 053 remains satisfied in spirit and
  letter after the bounded feature-052 return #7 safety changes. Both
  vulnerable dependency lines remain resolved at `brace-expansion@1.1.21` and
  `brace-expansion@5.0.12`, with no vulnerable duplicate, manifest edit,
  override, owner/toolchain movement, unrelated dependency churn, OSV
  suppression, or workflow weakening.
- Compatibility and combined evidence remain current: unchanged ownership and
  Node 20 compatibility are preserved; the refreshed combined full preflight
  passed 647/647 Node tests, build/service-worker generation, and 158/158
  Playwright tests; isolated Docker validation passed. Exact-head Review Agent
  passed without findings and the complete two-page thread guard is clean after
  resolving every return #7 thread.
- Process validation: the combined cycle covers all feature-051 evidence,
  R052-001 through R052-017 at Architect return count 7/10, and feature 053 at
  Architect return count 0/10. No unresolved feedback, accepted known issue,
  security exception, conflict, or customer-intent gap remains.

The Analyst validation for effective head
`5da4cc28a9a722c0b2880f98c07afaf03d5e9600`, and every earlier Analyst marker,
is stale and explicitly superseded because return #7 added behaviorally
meaningful handoff/symlink safety changes.

### Renewed combined-cycle validation — 2026-10-01

- Analyst validation pass: passed
- Final Analyst validation completed at: 2026-10-01T16:31:06Z
- Analyst validated effective content head: 5da4cc28a9a722c0b2880f98c07afaf03d5e9600
- Analyst return count: 0 / 5.
- Combined PR-set coverage: PR #217 on branch `codex/051-asset-retention`,
  covering feature 051 asset retention, feature 052 Compose-project provenance,
  and this feature 053 security refresh. Current PR head equals effective
  content head exactly, with no post-effective change.
- Customer-intent validation: feature 053 remains satisfied in spirit and
  letter after the feature-052 return #6 durability correction. The audited
  lock-only update still resolves both vulnerable lines to
  `brace-expansion@1.1.21` and `brace-expansion@5.0.12`, leaves no vulnerable
  duplicate, and introduces no manifest edit, override, owner/toolchain
  movement, unrelated dependency churn, OSV suppression, or workflow
  weakening.
- Compatibility and combined regression evidence remains current: unchanged
  owners are recorded through `minimatch@3.1.5`/ESLint and
  `minimatch@10.2.5`/`@typescript-eslint`; fixed releases remain compatible
  with Node 20; frozen installation preserved manifest/lock determinism. The
  renewed combined preflight passed 644/644 Node tests, production build and
  service-worker generation, and 158/158 Playwright tests; isolated Docker
  validation passed and self-cleaned.
- Exact-head completion evidence: Review Agent passed with no finding, all five
  required GitHub checks including OSV are green, and the complete paginated
  thread guard has every thread resolved with no new thread. No unresolved
  Implementation Agent feedback, accepted known issue, security exception,
  conflict, or customer-intent gap remains.

The 2026-09-30 Analyst validation for effective head
`8f785ed08c16d2202867310f9ad4afab4f40dbdb` is stale and explicitly
superseded because R052-013 was a later behaviorally meaningful change in the
combined PR. This 2026-10-01 validation is the current Analyst authority.

### Final Analyst validation — 2026-09-30

- Analyst validation pass: passed
- Final Analyst validation completed at: 2026-09-30T17:05:35Z
- Analyst validated effective content head: 8f785ed08c16d2202867310f9ad4afab4f40dbdb
- Analyst return count: 0 / 5.
- Combined PR-set coverage: PR #217 on branch `codex/051-asset-retention`,
  covering feature 051 asset retention, feature 052 Compose-project provenance,
  and this feature 053 security refresh. Current pre-validation-evidence head
  `19b0c9f8ab255dac9ba3c8f3a988e5626d184e27` differs from the effective
  content head only in feature-052/053 verification/process evidence and the
  final Architect PASS additions in Architect-owned task memory.
- Customer-intent validation: the security refresh satisfies the original
  merge-without-quality-loss outcome in spirit and letter. Ordinary pnpm
  lockfile-only resolution moved both independent vulnerable lines to the
  required fixed floors, `brace-expansion@1.1.21` and
  `brace-expansion@5.0.12`, with no vulnerable duplicate, manifest change,
  override, owner/toolchain movement, unrelated package churn, or OSV-policy
  weakening.
- Compatibility and determinism evidence: both unchanged ownership paths are
  recorded through `minimatch@3.1.5`/ESLint and
  `minimatch@10.2.5`/`@typescript-eslint`; the fixed releases are compatible
  with the Node 20 CI/Docker environment; frozen installation preserved the
  manifest and lock hashes. Full preflight passed 643/643 Node tests, production
  build/service-worker generation, and 158/158 Playwright tests, while the
  isolated real Docker retained-asset lifecycle passed and self-cleaned.
- Review and process evidence: exact-head Review Agent and native Codex review
  found no technical issue; no unresolved Implementation Agent feedback,
  accepted known issue, scope expansion, or security exception remains. The
  combined PR fallback is recorded and does not weaken normal latest-main
  startup rules.
- Merge-gate boundary: a green exact-current-head `AI Review`, validation-only
  thread resolution, all required-check/conflict verification, and the
  Orchestrator evidence-only current-head guard/finalizer remain mandatory.
  This PASS does not waive those gates.
