# Feature Request: Complete and merge every open pull request

## Intake metadata

- Feature ID: `055-open-pr-finalization`.
- Assigned role: Analyst, explicitly routed by Orchestrator.
- Intake date: 2026-10-08.
- Repository: `cucumberfalse/cabadrive`.
- Latest verified main supplied by Orchestrator: `2a92bcfcb7638d1094f33b28e4c2932fb2e4121e`.
- Intake worktree: `/Users/kristina.kurashova/projects/caba-drive/cabadrive/.claude/worktrees/open-pr-finalization`.
- Intake branch: `codex/053-open-pr-finalization`.
- Local confirmation: before this artifact, worktree HEAD and `origin/main` both equaled the supplied SHA and `git status --short` was empty.
- Numbering: latest-main memory ends at 050; Orchestrator verified the full remote PR #217 diff also contains `053-brace-expansion-security-refresh` and `054-static-publish-hardening`. The maximum active feature prefix is 054, so this intake uses 055. The already-created branch label remains `codex/053-open-pr-finalization` and does not determine feature numbering.
- Parallel work may exist. Preserve all existing dirty diffs, branches, commits, PRs, process memory, worktrees, and ambiguous local paths. No destructive cleanup or history rewriting is authorized by this intake.
- Analyst intake scope: this one `feature-request.md` only. No other file changes, commits, pushes, reviews, PR mutations, or merge actions.

## Original user request and authority

The user linked https://github.com/cucumberfalse/cabadrive and instructed:

> доведи все открытые pr до мержа, после мержи без дозапросов
> ничего не спрашивай, приложи эффорт, чтоб выполнить задачу без циклов испавлений и уточнений

The desired result is that every PR open at this request reaches a correct, verified, merged state. The user explicitly authorizes the required completion work and the final GitHub merges without another confirmation. They require autonomous execution, thoughtful diagnosis, and consolidated fixes rather than repeated clarification or avoidable correction cycles.

No user clarification is needed or allowed in normal flow. The request has a clear repository, a finite discovered open-PR set, and an explicit terminal outcome. Recorded assumptions below resolve routine implementation and sequencing decisions. Necessary review/check remediation remains mandatory; the request for fewer correction cycles does not authorize ignoring a real defect, weakening a gate, fabricating validation, or merging a failing PR. A genuinely unavailable permission, credential, or protected-branch capability must be reported precisely after unaffected work is completed; elapsed time is not permission to bypass it.

## Project and current evidence

Cabadrive is a static, local-first React/TypeScript/Vite driving-theory trainer delivered through Docker/nginx. Its offline continuity, retained immutable deployment assets, governed content, and PR-only workflow remain in force.

Analyst read the repository constitution, AGENTS role contract, durable project docs, frontend/backend contracts, feature inventory, learning/exam flows, source planning archive, AI PR workflow, and existing intake context for the assigned open PRs. `.unicorn-hub/config.json` declares five required checks: `baseline-checks`, `docker-validation`, `guard`, `AI Review`, and `osv-scan`.

Orchestrator's fresh GitHub discovery identifies exactly three open target PRs:

| PR | Existing purpose / process memory | Continuation worktree | Initial local HEAD |
|---|---|---|---|
| #214 | nginx caching/security, `049-nginx-caching-security`; selected carrier for shared remediation and cycle055 memory | `.claude/worktrees/finalize-pr-214` | `f80deaa27339b8b2a28af6218aaadf723482ce7a` |
| #217 | retained static assets, `051-asset-retention`, and Compose provenance follow-up, `052-compose-project-provenance` | `.claude/worktrees/finalize-pr-217` | `a53a2a0c3ec6068f1b0ca58cc95efa3307e7fe5f` |
| #215 | learning priority and safe fresh update, `049-learning-priority-fresh-update` | `.claude/worktrees/finalize-pr-215` | `31c2507fd6a0e0ac4eaaeac1d9f6d49de251446e` |

Continuation paths are relative to repository root `/Users/kristina.kurashova/projects/caba-drive/cabadrive`; these are local tracking contexts, not inferred GitHub branch names. Initial local HEADs are recorded for preservation and handoff, not claimed as final/current GitHub readiness evidence. Orchestrator must record each real PR branch and current remote head in Architect-owned cycle tracking before finalization.

Additional current findings supplied by Orchestrator:

- Branch/ruleset policy permits squash merge, requires resolved conversations, and requires zero human approvals. This does not remove independent review or role validation.
- PR #214 has incomplete placeholder final-validation markers.
- PR #215 has three unresolved review topics: complete inventory coverage (9/9), missing role validation, and the legacy deferred-chunk case.
- PR #217's currently discovered review threads are resolved; its status must be rechecked after synchronization or evidence updates.
- PR #215's legacy A fixture artificially precaches the deferred `manual4Ruedas` chunk, hiding the authentic origin-fallback failure. Remediation must exclude that chunk from legacy A's precache and prove an actual cache miss followed by retained-origin success.
- The shared OSV dependency graph now flags `source-map-js` 1.2.1, with a fixed threshold of 1.2.2. This must be resolved through the smallest compatible dependency update, with no suppression or security-policy change.

An initial sandbox `gh pr list` read could not reach `api.github.com`; Orchestrator subsequently confirmed working owner credentials with the existing `cucumberfalse` account through its authorized escalated GitHub context. The open-PR/ruleset/finding snapshot above is explicitly attributed to Orchestrator's freshly verified GitHub evidence. Local branch state alone is not used to infer whether any PR is open, merged, current, or green.

## Goal and scope

Complete review, implementation, integration, process memory, validation, required checks, and conservative finalization for PRs #214, #217, and #215; then merge all three through GitHub without returning for routine approval.

One feature folder tracks this finite completion request because the targets share merge readiness and deployment dependency sequencing. Existing product goals remain in their own original feature memories. A split into three new features/PRs is deferred: it would duplicate existing open implementations and would not better represent the user's request. Cycle055 memory and minimal shared security remediation will be carried by existing PR #214, as Orchestrator explicitly selected, avoiding an unnecessary fourth PR.

In scope:

- Resolve every actionable review finding and actual failed/missing required gate for the three targets, with substantive tests where behavior changes.
- Complete truthful original-feature and cycle055 process memory, missing validation records, exact inventories, and Architect dispositions.
- Resolve the shared `source-map-js` finding with narrow compatible package/lock resolution, retaining pnpm 10.33.0 and auditing all changed dependency occurrences.
- Synchronize dependent PRs with verified updated main at the required merge boundaries; preserve their intended work and integration evidence.
- Fresh independent review, final Architect validation followed by final Analyst validation, current-head guards, required checks, and GitHub squash merge verification.

Out of scope:

- New unrelated product features, broad dependency modernization, gate/ruleset weakening, OSV suppressions, falsely resolving a finding, closing a target instead of merging, or direct pushes to main.
- Resetting, force-pushing, deleting, or overwriting user/sibling work for convenience.
- Routine user clarification or another request for merge permission.
- Cleanup of existing worktrees; any later cleanup requires a separately assigned Cleanup Agent and positive-proof validation.

## Continuation contexts and merge sequence

The new cycle begins from a clean latest-main intake context. Architect may plan here and Orchestrator may route the resulting cycle055 files to the assigned Implementation Agent for inclusion in PR #214.

The three existing PR worktrees are explicitly preserved continuation contexts. Their unmerged code is the subject of this completion request; starting replacement feature PRs from main would discard or duplicate the very work the user asked to finish. Orchestrator may assign narrow remediation in those contexts after confirming their actual remote branch/head, dirty state, base, existing memory, and scoped ownership. This is a documented continuation of existing PR slices, not permission to silently treat their stale bases as latest main. No rebase/history rewrite is inferred. Preserve all original feature evidence, mark stale validations honestly, and renew them on the effective content head after substantive integration changes.

Required merge order:

1. **#214 first:** finish nginx/security delivery, include the minimal shared dependency fix and cycle055 memory, then pass every gate and squash merge.
2. **#217 second:** synchronize with the resulting verified main, validate retained immutable assets and Compose project provenance against the merged infrastructure/security baseline, then pass every gate and squash merge.
3. **#215 last:** synchronize with main containing both prior merges, prove safe legacy deferred-chunk behavior using #217's real retained-origin prerequisite, then pass every gate and squash merge.

PR #215 must not be declared complete before #217's prerequisite is merged and its integrated regression is validated. Earlier green results or role-validation stamps do not substitute for the new content head after main synchronization.

## Acceptance expectations

1. **Complete target set:** GitHub confirms PRs #214, #217, and #215 are all `MERGED`, with merge commit/time recorded. If another PR opens concurrently, record it separately rather than silently expanding this fixed discovered set; final reporting must accurately identify the three targets.
2. **All five checks green before each merge:** `baseline-checks`, `docker-validation`, `guard`, `AI Review`, and `osv-scan` pass on that PR's exact current remote head. Red, missing, pending, queued, skipped, or ambiguous checks do not count as passing. Keep all existing check and branch/ruleset policies intact.
3. **Review complete:** every review finding is substantively addressed or has a justified Architect disposition, every required conversation is resolved, and no blocking review remains. Preserve independent review and do not count a thread resolution alone as proof of a fix.
4. **Security complete:** every locked occurrence affected by the reported `source-map-js` advisory is non-vulnerable (at least 1.2.2 within the compatible graph), dependency churn is audited, reproducible installation succeeds, and exact-head OSV passes without suppressions.
5. **Original outcomes preserved:** #214's nginx cache/security/gzip/unprivileged contract passes; #217's fail-closed retained assets and discovered Compose provenance pass; #215's learning behavior, safe update protocol, and actual legacy deferred asset cache-miss-to-retained-origin regression pass in the merged integration context. Existing offline/local-first and governed-content contracts remain satisfied.
6. **Current process memory:** original feature memories and cycle055 explicitly list all contributing PRs, actual branches/heads, dispositions, integration ordering, checks, and verification evidence. Placeholder validation markers and stale head claims are replaced by real evidence.
7. **Ordered role validation:** final Architect passes before final Analyst on the same effective content head for each applicable feature/cycle. Any later commit is proven to contain only permitted validation evidence; any later substantive change invalidates the earlier pass and receives proper renewed validation.
8. **Conservative finalization:** before each merge, Orchestrator's read-only current-head guard and finalizer dry run establish correct target/head, conflict-free state, current exact-head gates, current role evidence, and no exceptional blocker. Use GitHub squash merge and verify the result from GitHub rather than local branch inference.
9. **No clarification loops:** proceed on this recorded intent and assumptions, consolidate related findings and verify before publishing fixes, then merge without another user approval. Report any real unavoidable blocker with its concrete cause and completed unaffected work.

## Assumptions and negative scenarios

- The discovered open set is #214, #217, #215. Their current remote heads and policy are always refreshed by Orchestrator before decisions.
- The user intends existing feature scope to ship correctly; review-driven remediation is authorized, unrelated scope expansion is not.
- Minimal shared dependency remediation may ride PR #214 under this new cycle's explicit scope even though original feature049 excluded new dependencies; Architect must record this cross-feature disposition rather than silently alter the older goal.
- GitHub credentials and merge permissions available to Orchestrator remain usable; lack of a required capability is a concrete blocker, not a reason to bypass policy.
- A newly green run for an old head, an unresolved inventory mismatch, placeholder role markers, an untested legacy deferred-chunk case, or a security suppression fails acceptance.
- Merging #215 before #217, closing any target without merging, weakening gates, or discarding parallel work fails the user's request.

## Research and handoff

No external research is used; intake is grounded in repository documentation and Orchestrator's fresh GitHub/OSV/ruleset evidence. Version-specific dependency resolution must follow current primary documentation through the available Context7 server where applicable and produce actual graph evidence.

Analyst hands this intake back to Orchestrator. Architect owns `spec.md`, `plan.md`, and `tasks.md`, including per-PR role/process validation, continuation assignment boundaries, minimal security-fix disposition, evidence locations, and exact merge gates. Implementation Agent alone performs assigned file/commit/push remediation. Review Agent reviews independently. Orchestrator coordinates live GitHub state, role handoffs, checks, exact-head guards, and authorized final merges.

## Final Analyst validation notes

Append-only Analyst section. Populate only after explicit Orchestrator invocation following a passing final Architect validation. No final pass is claimed at intake.

Analyst return count: 0
