# Plan: Spec History Audit And Completion Hardening

## Summary

Use one Orchestrator-managed implementation PR slice from the Analyst handoff worktree by default. The Implementation Agent must audit every prior spec, reconcile the audit against current repository state, fix current-state quality/consistency defects, update durable docs and governed content through the owning scripts, record evidence in `tasks.md`, and hand back for Review Agent and final validation. Split into additional latest-main PR slices only if implementation discovers a large independent source/content batch, protected-branch conflict, or blocker that cannot be safely reviewed in one PR.

## Technical Context

- runtime: static React/TypeScript/Vite app, Docker-served with `make build`, `make up`, and `make down`.
- dependencies: Node/pnpm tooling for validation, tests, Vite build, Playwright e2e, content validators, official-documents validators, and PR finalization helpers.
- product paths: `src/`, `content/`, `scripts/`, `tests/`, `docs_project/`, `.specify/`, `docs/specify/`, `specs/`, `.unicorn-hub/config.json`, Docker/runtime files.
- data changes: possible updates to topic-guide status/content/source trace/coverage, official-source docs, primary-source status docs, generated content indexes/evidence, tests, and durable docs. Product source changes are allowed only after Orchestrator assigns Implementation Agent.
- latest-main base evidence: Analyst recorded `origin/main` / `5f7ee7d8d301a27371a17a96d370d1ceec2629e8` and matching worktree `HEAD`.
- assigned isolated worktree/branch: `/Users/chap/devel/cabadrive-worktrees/024-spec-history-audit` on `codex/024-spec-history-audit`.
- cleanup applicability: not applicable for this feature unless Orchestrator separately assigns Cleanup Agent.

## Scope Boundaries

- in scope: full spec-history audit, current-state product/docs/content/workflow consistency fixes, validation/test hardening needed to prevent regression of the audited defects, and process-memory evidence for this cycle.
- out of scope: historical renumbering, deleting old specs, inventing official bank coverage, backend introduction, unrelated new product features, and local environment cleanup.
- role-routing constraints: Orchestrator remains coordinator; Architect owns only these three files; Implementation Agent performs repository file changes after assignment; Review Agent reviews only; Analyst validates only when Orchestrator invokes final Analyst validation.
- recovery constraints: accidental direct edits before routing/prerequisites are a stop/report/preserve condition and must receive Orchestrator/user disposition before adoption.
- sibling-process coordination: preserve process rules from features 011, 012, 014, 018, and 022; preserve feature 009/019 source and learning-support governance; do not mutate sibling worktrees/branches/PRs.

## Constitution Check

- Spec-first: satisfied by Analyst `feature-request.md` and this Architect-owned feature memory before implementation.
- Testable boundaries: audit and remediation must map each changed current-state claim to deterministic local validation, tests, marker scans, or manual evidence.
- PR-only: all repository changes land through PR, not direct `main`.
- Latest-main isolation: current branch starts from verified `origin/main`; additional slices require fresh verified `origin/main`.
- Final validation loop: Orchestrator invokes final Architect validation before final Analyst validation and verifies effective content head/current head before merge.
- Simplicity: prefer existing validators and docs over new abstractions; add scripts only if current checks cannot prevent the defect.
- Deployability: default branch must remain buildable and Docker-valid; runtime-affecting changes need local build/e2e/preflight evidence and Docker smoke if relevant.
- Active-model stop condition: non-Orchestrator roles do not self-promote or implement outside assignment.
- Complete feature-memory prerequisite: Implementation must start only after `feature-request.md`, `spec.md`, `plan.md`, and `tasks.md` exist.
- Sibling-work preservation: no reset, rebase, cleanup, branch deletion, PR mutation, or process-memory edits outside assigned scope without Orchestrator coordination.

## Implementation Slice Decision

Decision: one implementation PR slice is acceptable from the Analyst handoff worktree if Orchestrator explicitly assigns it.

Rationale:

- The user requested one cross-cutting quality audit and remediation, not independent new feature delivery.
- The likely defects are consistency and completion hardening across current docs/content/status/validation, which are easier to review with one complete audit matrix and one final evidence set.
- The Analyst-created worktree is fresh from verified `origin/main` and may continue as a single implementation PR slice under repository rules.
- Splitting before the audit risks losing the global consistency view. Split only after evidence proves a remediation area is independently large or risky, such as a mass official-source refresh, a full topic-guide content rewrite, or a workflow/CI change requiring isolated review.

Split triggers:

- Topic-guide remediation requires broad content authoring beyond status/language/validation hardening.
- Official-source currentness/exact-text validation requires live-source research or archive regeneration beyond stale-doc cleanup.
- CI/finalization workflow changes are needed and would mix process tooling risk with learner-content edits.
- Review Agent or Orchestrator identifies reviewability risk in the current PR size.

## Audit Matrix Seed

Implementation must expand this seed into the final audit matrix in `tasks.md`, preserving one row per prior feature.

| Feature | Domain | Required audit focus |
| --- | --- | --- |
| `001-unicorn-bootstrap-docs-foundation` | docs/process foundation | Legacy/no-intake classification, durable docs still accurate, no template placeholders or bootstrap-only claims in current docs. |
| `002-main-branch-protection` | branch protection/checks | Required checks align with `.unicorn-hub/config.json`, branch-protection helper docs remain current, no stale human-only completion language. |
| `002-mvp-runtime` | app/runtime baseline | Docker-only contract, local-first/no-backend truth, fallback-bank status, current "MVP" wording disposition. |
| `002-orchestrator-role-boundary` | workflow roles | Superseded-by-later-role-rules classification, no contradictory current guidance. |
| `003-analyst-role-intake` | Analyst workflow | Current Analyst intake rules in AGENTS/constitution/specs docs align with implementation and guard limitations. |
| `004-source-scope-guard` | source eligibility | Practice-source scope still rejects non-B banks while allowing valid B material with shared-road mentions. |
| `005-translation-validation-toggle` | translation UX/validation | Translation reveal behavior, deterministic translation evidence, no stale mismatch claims. |
| `006-topic-study-guide` | topic materials/content/source trace | Draft/published status, 38 topics, 460-ticket coverage, source trace, mixed-language prose, final strict release gates, stale open tasks. |
| `007-agent-workflow-autonomy` | workflow autonomy | Current Orchestrator autonomy/merge-readiness rules not contradicted by older wording. |
| `008-learning-materials-ui` | `Материалы` UI | Current visible materials section consistency with topic-guide state; no draft/incomplete current surface unless dispositioned. |
| `009-image-metadata-learning-support` | image metadata/translations/explanations | Feature 009 completion evidence, generated indexes/evidence freshness, no approved placeholder/generic learning support. |
| `010-ui-ux-learning-source-of-truth` | UI/UX docs/audit | Durable UI/learning source-of-truth stale/future task classification and current app consistency. |
| `011-orchestrator-analyst-routing` | workflow routing | Orchestrator-first and Analyst relay rules align across AGENTS, constitution, specs docs, scripts, and review contract. |
| `012-caba-exam-process` | process guide | Process guide currentness warnings, official links, volatile info boundaries, UI/docs/tests consistency. |
| `012-orchestrator-final-validation-loop` | final validation workflow | Final validation loop rules align with AGENTS, constitution, specs docs, finalization helper, review contract. |
| `013-learning-content-ui-polish` | learning UI/content polish | Closed process-memory state, remaining future UI audit items, current UI behavior and docs consistency. |
| `014-orchestrator-first-enforcement` | workflow enforcement | Guard/review docs still enforce bypass prevention and complete feature memory without stale workaround text. |
| `015-study-guide-language-review` | topic-guide language | Whether Russian guide prose actually passed language review; identify residual accidental English/Spanish residue. |
| `017-difficulty-labeling` | difficulty metadata/UI | Difficulty data and UI labels complete for 460 questions/38 topics; stale unchecked runtime/review tasks classified. |
| `018-auto-merge-finalization` | finalization automation | `pr:finalize` docs/helper/checks align with current merge authority and effective-head rules. |
| `018-learning-ticket-timer` | learning timer | Timer behavior, docs/tests, runtime smoke task disposition. |
| `019-feature-009-memory-closure` | process memory closure | Feature 009 stale readiness markers closed and not contradicted by current tasks. |
| `019-learning-polish-process-memory-closure` | process memory closure | Feature 013 process-memory mismatch truly closed. |
| `019-primary-sources-section` | primary-source reader | 19-entry corpus, 19/19 exact-text/currentness, stale blocked wording, UI status notes, strict validation, docs consistency. |
| `020-institution-entrance-timing-contrast` | CABA/RF guide | Institution entrance timing contrast visible and source-consistent; no stale hidden/unpublished state. |
| `021-docker-smoke-isolation` | Docker parallel safety | Compose project/port isolation docs and runtime files current; no shared-image collision regression. |
| `022-feature-009-memory-consistency` | process memory consistency | Feature 009 tasks no longer contain stale impossible/open state for completed work. |
| `022-orchestrator-cleanup-governance` | cleanup governance | Cleanup role rules align across AGENTS/constitution/specs docs and no cleanup is accidentally performed here. |
| `023-learn-all-questions` | learn mode | Default Learn exposes all 460, session shuffle/search behavior is tested, open review tasks are historical/PR-state not current product gaps. |

## Remediation Policy

- Fix-now: current product/docs/content/workflow truth is wrong, user-facing current state is draft/incomplete, validators miss a real current defect, or process memory blocks current completion without truthful reason.
- Accept historical/truthful: archived planning language, legacy missing intake, duplicate old prefixes, old pending source status superseded by later evidence, or truthful source limitations such as `unofficial_b_fallback`.
- Follow-up only: future product improvements not required to remove current incompletion, such as optional weak-topic shortcuts or vocabulary-to-question links, if they are not described as current.
- Blocker: source/legal/currentness ambiguity, credential/permission issue, merge/PR ambiguity, protected-branch blocker, or owner decision for accepted known issue.

## Topic Guide Disposition Guidance

Implementation must treat the topic guide as the most likely product-quality gap:

- Read `content/guide/topic-study-guide.ru.json`, coverage, source trace, `scripts/content-topic-guide.mjs`, topic-guide tests, UI rendering, and docs.
- Distinguish intentional Spanish source terms from accidental learner-prose residue. Spanish terms can remain in dedicated Spanish-term fields or when quoted as exam wording; English residue or Spanish scaffolding inside Russian explanatory prose needs correction.
- If the guide remains visible as `Материалы`, preferred outcome is to make it current release-quality: status fields and docs move away from draft/incomplete only after strict coverage, rendered placement, source trace, language quality, and local tests pass.
- If release-quality completion is unexpectedly too large, Implementation Agent must stop short of cosmetic relabeling, record feedback, and ask Orchestrator for Architect disposition or a split slice.
- Do not claim official full-bank coverage. The guide can be complete for the current 460-question fallback bank while still disclosing that the question bank is unofficial.

## Primary-Source Disposition Guidance

- Current repository evidence shows `content/official-documents/manifest.json` has 19 entries with `currentness.validationStatus: "passed"` and `exactTextValidation.status: "passed"` for all 19.
- Current docs that still say source-reader release is blocked by exact-text validation must be updated.
- Historical notes in `specs/006` or `specs/019` may remain when clearly superseded, but the final audit matrix must say they are historical and identify current authoritative evidence.
- If implementation-time validation contradicts the 19/19 state, record a blocker rather than editing copy around it.

## Generated And Evidence File Discipline

- Use `node scripts/content-shards.mjs --write-indexes` after editing translation/explanation/image metadata shards.
- Use `pnpm run validate:content` and `pnpm run validate:content:quality` for learning-support/content changes.
- Use `pnpm run validate:overlays` when overlay metadata or overlay rendering is touched.
- Use official-documents and primary-sources validators when source archive, manifest, learner-source corpus, QA, search indexes, or source docs change.
- Record whether evidence files are generated, committed validation evidence, or historical evidence; do not manually "fix" hashes/fingerprints without owning script evidence.

## Verification

| Acceptance criterion | Evidence |
| --- | --- |
| AC-001 all prior specs inventoried | Final audit matrix in `tasks.md` with one row per prior feature plus inventory command output. |
| AC-002 legacy/no-intake classified | Matrix rows for `001-*` and `002-*` folders with accepted historical/no-intake disposition or specific defect evidence. |
| AC-003 duplicate prefixes classified | Matrix entry for duplicate prefixes `002`, `012`, `018`, `019`, and `022`; no renaming unless separately assigned. |
| AC-004 unfinished-quality language reconciled | Targeted `rg` scans before/after over current docs/UI/content plus diff showing corrected or dispositioned wording. |
| AC-005 historical stale blockers not current truth | Current docs corrected; historical spec notes classified in matrix as superseded where applicable. |
| AC-006 topic guide visible state resolved | Topic guide status/content/docs/UI/test evidence proving published-quality state, or explicit blocker/split disposition. |
| AC-007 topic guide strict readiness | Topic-guide validator/tests, content validation, language scan, and coverage/source-trace evidence for 38 topics and 460 tickets when retained as current visible surface. |
| AC-008 primary-source status current | Manifest summary, source-reader validation, docs diff removing stale blocked wording, and tests if UI status behavior changes. |
| AC-009 generated/evidence discipline | Commands showing generated indexes/evidence are fresh or untouched; `git diff --name-only` confirms scoped changes. |
| AC-010 truthful source limitations | Copy/docs review proving `unofficial_b_fallback` and unofficial Russian support boundaries remain visible and no official full-bank claim was introduced. |
| AC-011 feedback disposition | `tasks.md` Implementation Agent Feedback and Architect Dispositions sections resolved before completion. |
| AC-012 final validation | Final Architect validation before final Analyst validation, matching effective-head evidence when required, and Orchestrator current-head guard. |
| Latest-main startup | Base SHA evidence in feature memory and implementation startup status. |
| Cycle PR set | `tasks.md` cycle PR set with purpose, branch, PR metadata, head SHA, status, and final-validation inclusion. |
| Cleanup applicability | `tasks.md` records cleanup not applicable unless separately assigned. |
| Merge gates | Required GitHub checks, review status, conflict status, acceptance evidence, process memory, feedback disposition, current-head guard, and absence of exceptional human blockers. |

Negative scenario evidence:

- Marker scans proving no current user-facing/durable-source accidental incomplete language remains.
- Review evidence that historical specs were not rewritten to fabricate current process markers.
- Copy/source review proving fallback limitations remain truthful.

Process enforcement evidence:

- `node scripts/check-feature-memory.mjs --worktree`.
- Review Agent checks for Orchestrator-first routing, role boundaries, sibling-work preservation, latest-main startup, PR-set coverage, final-validation compliance, and cleanup non-applicability.

## Risks

- Topic guide may require more than status cleanup if mixed-language or source-trace defects are broad. Mitigation: split only after concrete evidence and Architect disposition.
- Historical process memory has many old unchecked review/merge tasks. Mitigation: classify as historical PR-state tasks when current merged state proves completion; do not rewrite history unless current docs/process truth are stale.
- Removing all "MVP" language mechanically could hide architectural truth. Mitigation: replace with "current local-first/static/no-backend design" or "current content mode" where appropriate, and preserve truthful future-backend triggers.
- Official-source currentness can change. Mitigation: rely on existing exact-text/currentness evidence unless touched; use targeted public-safe research only if validation or current docs reveal a real contradiction.
