# Feature Request: Spec History Audit And Completion Hardening

## Analyst Artifact Status

Created by Analyst intake for a repository-changing Orchestrator-routed request. This intake artifact is the only file written by Analyst before Architect planning.

## Orchestrator Routing Context

- Orchestrator entry: User explicitly assigned Orchestrator to run the task end-to-end from a fresh-main isolated workflow and merge to `main`; Orchestrator then assigned Analyst intake for feature `024-spec-history-audit`.
- Active-model stop condition: Not applicable. This Analyst instance started only after explicit Orchestrator assignment.
- Read-only transition context: Not applicable. The original request is repository-changing because it asks to review all prior specs and fix any discovered problems.
- Assigned intake worktree/branch: `/Users/chap/devel/cabadrive-worktrees/024-spec-history-audit` on branch `codex/024-spec-history-audit`.
- Latest-main base evidence: Orchestrator reported `origin/main` at `5f7ee7d8d301a27371a17a96d370d1ceec2629e8`, fetched 2026-05-20. Analyst verified the assigned worktree `HEAD`, `origin/main`, and `merge-base HEAD origin/main` all resolve to the same SHA.
- Parallel-work note: Parallel Orchestrators and agents may be active. Preserve all existing dirty diffs, branches, commits, PRs, worktrees, process memory, and unmerged feature artifacts. Do not overwrite, revert, rebase, close, delete, or clean up sibling work without Orchestrator coordination.
- Accidental-start recovery context: None observed by Analyst. Worktree was clean at intake start before this feature folder was created.
- Cleanup context: Cleanup is not part of Analyst intake. If Orchestrator later assigns cleanup, candidate path names, timestamps, branch names, and feature numbers are only discovery hints and not deletion proof.

## User Request

Original request, preserving intent and constraints:

> ты оркертратор, работай строго как оркестратор, начинай работатать в отлельном форкфлоу от свежего main, по итогу вся работа должна быть доведена до конца и смержена в main
>
> задача
> проведи полное ревью всех прошлых задач из spec, оцени, все завершено, все ли сделано качественно, все ли конистентно
> в проекте не должно быть ничего временного, тестового, незаконченного, неплного, mvp
> если найдутся проблемы - нужно их сформулировать, описать, исследовать и решить наиболее оптимально и качественно в рамках этой задачи

English working interpretation: perform a full audit of all previous `specs/` work and the current repository state those specs produced; determine whether the work is complete, high-quality, and internally consistent; remove or resolve temporary, test-only, unfinished, incomplete, and MVP-quality remnants; if problems are found, formulate them, research them where needed, and implement the most optimal high-quality fixes within this work cycle.

## Clarified Answers And Assumptions

- No clarification was requested because the user supplied the desired role, fresh-main workflow, completion target, and quality bar clearly enough for Architect planning.
- "All previous tasks from spec" means every tracked `specs/[0-9][0-9][0-9]-*/` feature memory folder present on the verified `origin/main` base, including duplicate numeric prefixes and legacy folders.
- Audit scope includes feature memory, durable docs, source/content/runtime files, validation scripts, tests, CI/workflow helper scripts, and visible product surfaces when they are connected to prior specs.
- The request should stay one feature request because the user asks for one cross-cutting completion audit. Architect and Orchestrator may split implementation into multiple latest-main PR slices only if discovered issues are independent or risky enough to need separate review gates.
- "Nothing MVP" is treated as a quality bar against unfinished/demo/scaffold shortcuts, not permission to make false product claims. If official CABA full-bank availability remains unresolved, the app must not claim official full coverage merely to remove "MVP" wording; instead the work must either complete the underlying gap or record an explicit truthful, user-facing, non-temporary disposition.
- Historical references in archived planning docs may remain when they are clearly historical and not current product/process truth. Current docs, current UI, validation modes, scripts, and release/readiness statements should not present stale "pending", "draft", "incomplete", "temporary", "test", or "MVP" states unless Architect explicitly accepts and justifies a truthful exception.
- The user asked Orchestrator to carry the work through merge. Analyst does not perform implementation, PR, check, review, finalization, or merge actions.

## Scope Split Decision

Do not split intake at this stage. The audit must first build one complete inventory of prior specs, current implementation state, and consistency gaps. Architect should decide whether remediation stays in one implementation PR slice or becomes multiple PR slices by domain, for example process-memory cleanup, content-quality fixes, UI/source-label consistency, validation hardening, or docs/runtime consistency.

## Project Context Reviewed

- `.specify/memory/constitution.md`: Spec-first workflow, role boundaries, latest-main worktree requirement, process memory, final validation loop, cleanup governance, and PR-only delivery.
- `docs_project/README.md`: Durable documentation layout and read order.
- `docs_project/project-idea.md`: Cabadrive product problem, solution, target audience, and local-first exam-prep value.
- `docs_project/project/frontend/frontend-docs.md`: Current SPA/PWA stack, Docker-only runtime, content mode, UI rules, primary-source reader status, and current validation commands.
- `docs_project/project/backend/backend-docs.md`: No-backend MVP decision, static content/storage model, validation-tool inventory, official-documents archive, and future backend triggers.
- `docs_project/project/feature-inventory.md`: Current feature inventory, unofficial fallback question mode, image metadata coverage, source-reader status, and explicit out-of-scope areas.
- `docs_project/screens/learning-and-exam-flows.md`: Current learning/exam/materials/process/source-reader flows and status-label requirements.
- `docs/specify/README.md`: Original specify-phase intent, constraints, canonical terms, and success definition.
- `specs/README.md`: Feature-memory contract, Analyst/Architect artifacts, numbering rule, work cycle, final validation, and cleanup evidence expectations.
- Existing `specs/[0-9][0-9][0-9]-*/` folders: Analyst listed all tracked feature memories and artifact presence.
- Current repository scripts/config snapshot: `package.json`, `.unicorn-hub/config.json`, top-level source/test/script inventory, and quick marker scans for unfinished/draft/placeholder/MVP/pending language.
- Current content status spot checks: `content/guide/topic-study-guide.ru.json`, `content/guide/topic-study-guide.coverage.json`, `content/guide/topic-study-guide.source-trace.json`, and `content/official-documents/manifest.json`.

## Intake Evidence From Current Repository

- Numbering: existing max numeric prefix under `specs/` is `023`, so the next feature folder is `specs/024-spec-history-audit`.
- Existing duplicate numeric prefixes include `002`, `012`, `018`, `019`, and `022`. This is allowed by the current numbering rule for historical folders but should be considered in the audit inventory.
- Legacy feature folders `001-unicorn-bootstrap-docs-foundation`, `002-main-branch-protection`, `002-mvp-runtime`, and `002-orchestrator-role-boundary` do not have `feature-request.md`; this may be valid legacy state but must be explicitly classified.
- Current required checks in `.unicorn-hub/config.json`: `baseline-checks`, `docker-validation`, `guard`, `AI Review`, and `osv-scan`.
- Current local verification scripts include `pnpm run validate:content`, `pnpm run validate:content:quality`, `pnpm run validate:overlays`, `pnpm run test`, `pnpm run build`, `pnpm run test:e2e`, and `pnpm run preflight`.
- The current topic study guide files report `status: "draft"` and all 38 topic records in `content/guide/topic-study-guide.ru.json` report `status: "draft"`.
- Durable docs still describe `Материалы` as "draft/incomplete" in current surfaces, including `docs_project/project/frontend/frontend-docs.md`, `docs_project/project/feature-inventory.md`, `docs_project/project/learning/learning-experience-source-of-truth.md`, and `docs_project/screens/learning-and-exam-flows.md`.
- Quick text scan found learner-facing guide strings with mixed Russian plus English/Spanish residue, for example `Señales transitorias предупреждают о construction and maintenance works...` and `При temporary narrowing/obra same-direction sobrepaso is prohibited...` in `content/guide/topic-study-guide.ru.json`.
- `content/official-documents/manifest.json` currently has 19 entries, with currentness validation and exact-text validation both passing for all 19 entries, while some durable docs and historical QA notes may still mention older pending/exact-text caveats. The audit must distinguish stale historical notes from current blockers.
- A quick final-validation-marker search found limited explicit final Architect/Analyst validation markers in prior specs; because final-validation requirements evolved over time, Architect must classify which missing markers are valid historical state and which current process memories are stale or inconsistent.

## External Research

External research was not used during intake. The request is primarily an internal repository/spec-history audit, and the immediate intake question can be framed from current Cabadrive durable memory. Architect may require targeted public-safe research later for official CABA/ANSV source currentness, licensing, or best-practice decisions discovered during the audit.

## Problem Statement

Cabadrive has accumulated many feature memories and implementation slices across product, content, validation, workflow, and release automation. Some current docs and content still describe surfaces as draft, incomplete, MVP, pending, or historically blocked, while other files claim later completion. The project needs a full, evidence-backed audit of prior spec work to determine whether every accepted feature is complete, high-quality, consistent, and production-ready under the user's current bar, then remediate the highest-quality path for any real gaps without erasing truthful source limitations or sibling work.

## Proposed Outcome Or Workflow

1. Build a complete inventory of every tracked spec folder, its requested outcome, expected artifacts, implementation status, verification evidence, known issues, review/final-validation state where applicable, and current product/docs/source files it affected.
2. Compare that inventory against current repository state, durable docs, UI behavior, content data, validation gates, tests, Docker runtime contract, CI/finalization helpers, and source/status claims.
3. Identify all real inconsistencies, incompletions, temporary/test/demo/scaffold remnants, stale process-memory blockers, stale docs, missing validation gates, missing tests, and content-quality defects.
4. Classify each finding as fix-now, explicit no-op because it is historical or truthful, follow-up only if out of scope, or blocker requiring Orchestrator/human escalation under repository rules.
5. Implement fix-now items through Orchestrator-assigned Implementation Agent slice(s) after Architect planning, preserving role boundaries and sibling work.
6. Update durable docs and specs where current behavior, source status, workflow, or deploy/test rules change.
7. Run local verification appropriate to the final scope, at minimum feature-memory checks, content validation, tests, build, e2e/preflight as applicable, and any targeted strict/quality validation required by found content issues.
8. Open PR(s), obtain Review Agent review, resolve findings, pass required GitHub checks, run final Architect validation before final Analyst validation, and let Orchestrator finalize/merge only when the completion contract is satisfied.

## Role Boundaries Or Affected Actors

- Orchestrator: owns coordination from this intake through planning, implementation assignment, PR/review/check coordination, final validation, merge readiness, and finalization/merge. Orchestrator must not directly edit repository files.
- Analyst: owns this intake artifact only, and later final Analyst validation notes only if Orchestrator invokes Analyst after Architect validation passes.
- Architect: owns `spec.md`, `plan.md`, and `tasks.md`; defines the audit method, acceptance criteria, remediation tasks, split decisions, verification matrix, and dispositions for implementation feedback or accepted historical states.
- Implementation Agent: works only after complete feature memory exists and Orchestrator assigns an isolated worktree/branch/PR slice; implements scoped fixes, keeps `tasks.md` current, records evidence, dead ends, known issues, and feedback.
- Review Agent: reviews PR diffs and process compliance for bugs, regressions, missing tests, incomplete audit coverage, role-boundary violations, and unsupported "complete" claims; does not edit files.
- Cleanup Agent: only if Orchestrator explicitly assigns cleanup. It must use positive-proof validation, preserve active/dirty/unpushed/open/ambiguous/user-owned targets, and record inventory/action/refusal evidence.

## Artifact And Handoff Expectations

- Analyst writes only this `feature-request.md` intake artifact during intake.
- Non-Orchestrator active models do not create implementation changes for this request before Orchestrator routing.
- Requirement clarification, when needed, is initiated only by Analyst and relayed through Orchestrator.
- Analyst hands off to Orchestrator and shuts down after intake is ready, until Orchestrator explicitly invokes final Analyst validation after Architect passes or assigns a new intake request.
- Architect starts from this artifact and writes `spec.md`, `plan.md`, and `tasks.md`.
- Implementation starts only after complete feature memory exists and Orchestrator assigns an isolated worktree, branch, and PR slice.
- Handoff context for Orchestrator: continue from `/Users/chap/devel/cabadrive-worktrees/024-spec-history-audit`, branch `codex/024-spec-history-audit`, feature folder `specs/024-spec-history-audit`, base `5f7ee7d8d301a27371a17a96d370d1ceec2629e8`, while preserving parallel work.
- The Analyst-created latest-main handoff context may continue through Architect planning and may become the single implementation PR slice only if Orchestrator explicitly assigns it that way; additional task slices require separate latest-main isolated worktrees/branches/PRs.
- If cleanup becomes relevant, Orchestrator must name approved cleanup roots, active/current exclusions, evidence destination, and candidate rules before assigning Cleanup Agent.

## Open Questions And Risks

- The user wants no temporary, unfinished, incomplete, or MVP-quality state. This may conflict with truthful product limitations such as no confirmed official full CABA category B question bank. Architect must avoid "completion by relabeling" that hides real source limitations.
- Current docs still use `MVP`, `draft`, and `incomplete` language. Some may be stale and should be removed; some may be historical or truthful. The audit must separate current product truth from historical planning archive.
- Topic-study-guide data currently appears draft across all topics and contains visible mixed-language learner text. This is a likely fix-now area but requires Architect scoping and content-quality verification.
- Official source reader docs may contain stale "final release blocked" language even though the current manifest reports 19/19 exact-text and currentness validation passed. The audit must verify current state before editing.
- Prior specs were created under changing process rules. Missing final validation markers or missing Analyst intake may be valid legacy state for early features; current completion claims must not retroactively falsify history, but stale current gates should be corrected.
- The project contains generated indexes and evidence files. Implementation must use structured scripts and validators rather than ad hoc edits when modifying generated or governed content.
- Full audit may uncover independent problems large enough to require multiple PR slices. Orchestrator must preserve the cycle PR set and final-validation coverage across all slices.
- Cleanup of old worktrees or local artifacts is not implied by this intake and must not happen without explicit Cleanup Agent assignment.

## Acceptance Expectations

- Architect creates complete feature memory with a spec-history audit matrix that covers every tracked `specs/[0-9][0-9][0-9]-*/` folder, including legacy/no-intake and duplicate-prefix cases.
- The audit matrix links each prior spec to current durable docs/source/content/tests or records why no current artifact exists.
- Every discovered current problem is documented with evidence, severity, affected files/surfaces, and disposition: fixed in this cycle, explicitly accepted as historical/truthful, routed to a follow-up only if outside the user request, or blocked with a narrow Orchestrator/human blocker.
- The final project state contains no current user-facing or durable-source claims that something is temporary, test-only, draft, incomplete, pending, MVP-quality, placeholder, or unfinished unless the claim is deliberately retained as truthful source-status disclosure with an Architect disposition and acceptance evidence.
- If the topic guide remains user-facing, its status, content quality, language consistency, validation mode, and docs must be made consistent with the user's quality bar or explicitly dispositioned as not release-ready.
- Current docs must not contradict current validation/source status for official documents, primary sources, learning materials, runtime contract, or process workflow.
- Product/source changes must preserve official Spanish source primacy and unofficial Russian-support labeling without inventing official-bank coverage.
- Validation should include relevant local gates such as `pnpm run validate:content`, `pnpm run validate:content:quality`, `pnpm run validate:overlays` if overlays or image metadata are in scope, `pnpm run test`, `pnpm run build`, `pnpm run test:e2e`, `pnpm run preflight`, `git diff --check`, and `node scripts/check-feature-memory.mjs --worktree`, with scope-based rationale for any omitted command.
- Review requirements must include process-boundary compliance, complete feature memory, audit coverage, stale-doc detection, current-status truthfulness, content quality, generated-file discipline, and regression/missing-test risks.
- Before completion or merge, Orchestrator must verify cycle PR set coverage, required GitHub checks, conflict status, review findings, acceptance evidence, Implementation Agent feedback disposition, final Architect validation before final Analyst validation, current-PR-head guard, and cleanup not-applicable/refusal evidence if no cleanup is assigned.

## Final Analyst Validation Notes

Append-only Analyst-owned section used only when Orchestrator invokes final Analyst validation after final Architect validation passes.

- Analyst validation pass: passed
- Final Analyst validation completed at: 2026-05-20T20:00:51Z
- Analyst validated effective content head: dd9b68dc826467db61094dfd7d9c13487429704c
- Analyst return count for this work cycle: unchanged/0
- Customer intent validation summary: passed. The final result satisfies the original request in spirit and letter: all 29 prior tracked spec folders are represented in the audit matrix; legacy/no-intake and duplicate-prefix history is classified without rewriting history; current completion, quality, and consistency gaps found by the audit were formulated, reviewed, fixed, and guarded; current learner/product/docs/source surfaces no longer present accidental draft, incomplete, MVP, pending, blocked, placeholder, test-only, or temporary-work state as current project truth; remaining limitations are truthful source-status boundaries such as `unofficial_b_fallback`, future-scope UX candidates, schema/status enums, validator/test fixtures, official-source HTML chrome, or traffic-safety terminology rather than hidden unfinished work.
- Validation evidence: Architect final validation passed earlier at `2026-05-20T19:55:44Z` for the same effective content head; local `HEAD`, `origin/codex/024-spec-history-audit`, and GitHub PR #166 `headRefOid` match `dd9b68dc826467db61094dfd7d9c13487429704c`; PR #166 is open, ready, mergeable, and clean against `main`; required checks `AI Review`, `baseline-checks`, `docker-validation`, `guard`, and `osv-scan` are green; Review Agent final result is pass/no blocking findings and all review threads are resolved.
- Additional Analyst spot checks: the audit matrix has 29 rows for 29 prior spec folders with no missing or extra rows; topic guide data is `published` with 38/38 guide topics, 38/38 coverage topics, 460/460 assignments, 639/639 effective placements, and source trace `published` with 170 entries; official-documents manifest is `published` with 19 entries, 19 currentness validations passed, 19 exact-text validations passed, and `node scripts/official-documents-exact-text-validation.mjs` returned `total: 19`, `passed: 19`, `blocked: 0`, `failed: 0`; `node scripts/content-topic-guide.mjs --check --strict`, `node scripts/check-feature-memory.mjs --worktree`, and `git diff --check origin/main...HEAD` passed.
- Gaps, if any: none found.
- Architect disposition routing: not needed because final Analyst validation found no gaps.
- Analyst limit escalation: not applicable; return count remains 0 and no new feature request is required.
- Analyst boundary reminder: Analyst edited only this Analyst-owned final-validation notes section and did not edit Architect artifacts, code, reviews, commits, pushes, PRs, merge state, or files outside Analyst-owned notes.

- Analyst validation pass: passed
- Final Analyst validation completed at: 2026-05-20T20:44:26Z
- Analyst validated effective content head: 6db8534e8fe8bf551b13a166b0652b60085e0276
- Analyst return count for this work cycle: 0
- Customer intent check: passed for the current effective content head. The final result satisfies the original request in spirit and letter by auditing all 29 prior spec folders, classifying legacy and duplicate-prefix history, resolving current quality and consistency gaps, and leaving current product, content, docs, source-status, validation, and process truth free of accidental temporary, test-only, unfinished, incomplete, or MVP-quality claims while preserving truthful unofficial-source and Russian-learning-support boundaries.
- Analyst validation evidence: final Architect validation passed earlier at `2026-05-20T20:39:10Z` for the same effective content head; local `HEAD` is `6db8534e8fe8bf551b13a166b0652b60085e0276`; PR #166 is reported open, ready, clean, and current at that head; required checks `AI Review`, `baseline-checks`, `docker-validation`, `guard`, and `osv-scan` are reported green; review threads are reported resolved.
- Analyst validation evidence: active feature inventory shows 30 tracked spec folders including active `024`, so 29 prior folders are in scope; topic guide status is `published` with 38/38 topics and 38/38 coverage topics published; source trace is `published` with 170 entries; official document manifest is `published` with 19 entries, 19 currentness validations passed, and 19 exact-text validations passed; targeted stale current-state marker scan over current content, docs, source, scripts, tests, and config returned no matches.
- Gaps, if any: none found.
- Architect disposition routing: not needed because final Analyst validation found no gaps.
- Analyst limit escalation: not applicable because return count is 0 and no new feature request is required.
- Analyst boundary reminder: Analyst edited only this Analyst-owned final-validation notes section and did not edit Architect artifacts, code, product files, content files, reviews, commits, pushes, PR state, merge state, or files outside Analyst-owned notes.

- Analyst validation pass: passed
- Final Analyst validation completed at: 2026-05-20T21:02:12Z
- Analyst validated effective content head: a354e947ffe147d31ab81a91aa3f2542fbe17870
- Analyst return count for this work cycle: 0
- Customer intent check: passed for the current effective content head. The final result satisfies the original request in spirit and letter by auditing prior spec history, resolving current quality and consistency gaps, preserving truthful source-status disclosure, and keeping current product, content, docs, validation, and process truth free of accidental temporary, test-only, unfinished, incomplete, or MVP-quality claims.
- Analyst validation evidence: final Architect validation passed earlier at 2026-05-20T21:00:52Z for the same effective content head; local HEAD is a354e947ffe147d31ab81a91aa3f2542fbe17870; PR #166 is reported clean at that head; required checks are reported green; review threads are reported resolved; this Analyst pass revalidates that current PR head as the effective content head.
- Analyst validation evidence: prior Analyst evidence for the feature records complete prior-spec audit coverage, published topic guide status, published official-document source status, exact-text and currentness validation, feature-memory validation, and whitespace validation, with no new customer-intent gap identified for the refreshed effective content head.
- Gaps, if any: none found.
- Architect disposition routing: not needed because final Analyst validation found no gaps.
- Analyst limit escalation: not applicable because return count is 0 and no new feature request is required.
- Analyst boundary reminder: Analyst edited only this Analyst-owned final-validation notes section and did not edit Architect artifacts, tasks.md, code, product files, content files, reviews, commits, pushes, PR state, merge state, or files outside Analyst-owned notes.
