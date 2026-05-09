# Tasks: Topic-Based Preparation Guide

## Architect Planning Setup

- [x] T001 Confirm active feature folder is `specs/006-topic-study-guide/`.
- [x] T002 Read `.specify/memory/constitution.md`.
- [x] T003 Read `docs_project/README.md`.
- [x] T004 Read `docs_project/project-idea.md`.
- [x] T005 Read `docs_project/project/frontend/frontend-docs.md`.
- [x] T006 Read `docs_project/project/backend/backend-docs.md`.
- [x] T007 Read `docs_project/project/feature-inventory.md`.
- [x] T008 Read `docs_project/screens/learning-and-exam-flows.md`.
- [x] T009 Read `docs/specify/README.md`.
- [x] T010 Read `specs/006-topic-study-guide/feature-request.md`.
- [x] T011 Inspect existing feature-memory style from prior specs.
- [x] T012 Inspect current question, guide, vocabulary, explanation, source, validation, and guide-rendering shapes without editing product files.

## Architect Artifacts

- [x] T013 Create `spec.md` with goal, scope, non-goals, acceptance criteria, negative scenarios, official-document requirements, source trace requirements, and verification requirements.
- [x] T014 Create `plan.md` with staged implementation strategy, future paths, validation design, implementation slices, and risk mitigations.
- [x] T015 Create this `tasks.md` with planning completion, future implementation backlog, process memory, known issues, and Implementation Agent feedback handling.

## Future Slice A: Guide Schema And Validator Foundation

- [x] T016 Create a structured topic-guide content placeholder, tentatively `content/guide/topic-study-guide.ru.json`.
- [x] T017 Create a guide coverage manifest, tentatively `content/guide/topic-study-guide.coverage.json`.
- [x] T018 Create a guide source-trace manifest, tentatively `content/guide/topic-study-guide.source-trace.json`.
- [x] T019 Add a no-file-I/O topic-guide validation helper.
- [x] T020 Add unit tests for missing/duplicate topic IDs, invalid question IDs, missing required sections, missing answer explanations, and draft/published status behavior.
- [x] T021 Integrate draft-safe guide validation into `scripts/validate-content.mjs`.
- [x] T022 Record baseline command evidence and update process memory in this file.

## Future Slice B: Official Documents Governance Foundation

- [x] T023 Create the governed official-documents area, preferred path `content/official-documents/`.
- [x] T024 Add section-local `AGENTS.md` or equivalent instructions requiring exact-text preservation, metadata, hashes, currentness, and validation rules for every current and future official document/material.
- [x] T025 Add `content/official-documents/manifest.json` with schema fields for title, official source type, source URL, retrieval date, local Markdown path, hashes, raw evidence path, conversion notes, currentness status, amendment/repeal evidence, exact-text validation status, and checked-at dates.
- [x] T026 Add a no-file-I/O official-documents manifest validation helper.
- [x] T027 Add unit tests for missing metadata, invalid local paths, missing hashes, missing conversion notes, missing currentness fields, and stale/not-current source use.
- [x] T028 Update durable `docs_project/` documentation for the official-documents area, manifest, exact-text validation, currentness validation, and future-document rules.
- [x] T029 Record validation evidence and process memory.

## Future Slice C: Taxonomy Discovery And Coverage Baseline

- [ ] T030 Analyze all current 460 ticket IDs from `content/questions/caba-b.unofficial-fallback.questions.json`.
- [ ] T031 Propose compact guide categories from ticket wording, answer patterns, images, and practical exam concepts rather than copying broad existing question `topics`.
- [ ] T032 Set category split criteria and record why categories are neither too broad nor too tiny.
- [ ] T033 Assign every current ticket ID to at least one and at most two guide categories.
- [ ] T034 Create/update coverage baseline with expected count 460 and a stable ID-set fingerprint.
- [ ] T035 Add validation evidence that every current ticket ID is assigned and no ticket has more than two assignments.
- [ ] T036 Record any ambiguous or conflicting placements for Architect disposition.

## Future Slice D: Shared Official Source Archive Seed

- [ ] T037 Identify official sources reused across many topic slices, starting from the intake candidates but rechecking currentness at implementation time.
- [ ] T038 Download required official source materials in full from official URLs.
- [ ] T039 Convert official source text to Markdown without paraphrase, translation, simplification, or editorial rewriting.
- [ ] T040 Store raw/original evidence when source format is PDF or otherwise lossy.
- [ ] T041 Add manifest entries with title, source URL, retrieval date/timestamp, local paths, hashes, conversion notes, currentness status, amendment/repeal evidence, and checked-at date.
- [ ] T042 Validate the manifest entries touched by the slice.
- [ ] T043 Record conversion limitations and source-currentness evidence in process memory.

## Future Slice E: Topic Content Slices

- [ ] T044 Implement one topic, or at most two small related topics, per PR.
- [ ] T045 Add concise Russian material for the assigned topic only.
- [ ] T046 Add practical reasoning only when it helps answer assigned tickets.
- [ ] T047 Add useful Spanish words and constructions sourced from assigned ticket question/answer wording.
- [ ] T048 Add ticket blocks for the assigned topic with correct answer explanation and wrong-answer explanations for every incorrect answer option.
- [ ] T049 Include local question images in rendered guide ticket blocks when the canonical question has an image.
- [ ] T050 Add compact trap notes for negations, exceptions, similar answers, and mistranslation risks in the assigned topic.
- [ ] T051 Add source-trace entries for official-source-backed claims in the assigned topic.
- [ ] T052 Archive or cite only the official documents/materials needed by the assigned topic slice.
- [ ] T053 Validate the assigned slice and update coverage/source-trace evidence.
- [ ] T054 Record source conflicts, dead ends, decisions, known issues, and Implementation Agent feedback.

## Future Slice F: UI Integration

- [ ] T055 Add a separate topic guide section or navigation entry without removing current learning/exam/vocabulary flows.
- [ ] T056 Render topic list and topic detail pages from structured guide content.
- [ ] T057 Render canonical Spanish question text, answer options, correct answer, local image, and Russian explanations for each guide ticket block.
- [ ] T058 Render Spanish words, concise Russian material, and trap notes in the required topic sequence.
- [ ] T059 Preserve unofficial-learning-aid clarity for Russian guide material and fallback question status.
- [ ] T060 Ensure no raw PDF viewer or runtime network fetch is required.
- [ ] T061 Add Playwright coverage for guide reachability, required topic sequence, local images, and topic-ticket rendering.

## Future Slice G: Final Strict Release Gate

- [ ] T062 Enable strict published-guide validation.
- [ ] T063 Prove all current 460 ticket IDs are covered by the guide coverage map.
- [ ] T064 Prove every ticket appears in at least one and no more than two categories.
- [ ] T065 Prove every ticket assigned to two categories physically renders as a full ticket block in both category sections.
- [ ] T066 Prove every topic page has concise Russian material, Spanish words from ticket wording, ticket explanations, and trap notes.
- [ ] T067 Prove every guide claim requiring official verification maps to source-trace entries and archived official documents/materials.
- [ ] T068 Run final exact-text archive validation comparing every official-documents manifest entry against official primary sources, including entries not currently cited by published guide claims and all archived source types.
- [ ] T069 Run final currentness/effective-status archive validation proving every official-documents manifest entry has checked status evidence and source-type-appropriate metadata at validation time, including entries not currently cited by published guide claims.
- [ ] T070 Prove every source-traced current guide claim cites only official document/material entries that are current, in force, or otherwise currently valid for the relevant source type at validation time, including laws, rules, formal requirements, manuals/study materials, licensing requirements/pages, road-safety/procedure materials, traffic-sign materials, and any other cited official source type.
- [ ] T071 Update durable docs for final paths, guide behavior, official-documents governance, and validation evidence.
- [ ] T072 Run `pnpm run validate:content`.
- [ ] T073 Run `pnpm run test`.
- [ ] T074 Run `pnpm run build`.
- [ ] T075 Run `pnpm run test:e2e`.
- [ ] T076 Run `pnpm run preflight`.
- [ ] T077 Run `git diff --check`.
- [ ] T078 Record final verification evidence for every acceptance criterion.

## PR Readiness

- [ ] T079 Confirm each future implementation PR has a single assigned slice, branch, and isolated worktree.
- [ ] T080 Confirm each future implementation PR updates this process memory where relevant.
- [ ] T081 Confirm every Implementation Agent feedback item has Architect disposition before completion.
- [ ] T082 Confirm no blocking review findings remain.
- [ ] T083 Confirm required checks are green after push/PR.
- [ ] T084 Confirm the PR has no unresolved merge conflicts.
- [ ] T085 Leave only final human approval or merge mechanics remaining.

## Process Memory

### Dead Ends

- None during Architect planning.

### Decisions

- This planning PR creates only `spec.md`, `plan.md`, and `tasks.md`; it does not download official documents, create `content/official-documents/`, write guide content, update product code, or edit durable docs.
- Use the current local fallback question file as the guide coverage baseline. Architect orientation confirmed 460 questions in `content/questions/caba-b.unofficial-fallback.questions.json`.
- Keep the topic guide separate from the existing condensed guide so implementation can progress without breaking the current CABA/RF guide surface.
- Prefer structured JSON for guide content, coverage, and source trace because current app content and validation already use JSON.
- Require a governed official-documents section, preferably `content/official-documents/`, with local `AGENTS.md`, manifest, Markdown documents, raw originals where needed, and validation evidence.
- Treat exact-text validation and currentness/effective-status validation as final dedicated whole-archive tasks for every official-documents manifest entry, separate from topic content writing; source-traced current guide claims then have a separate final gate requiring only current, in-force, or otherwise currently valid entries for the relevant source type.
- Allow draft guide state for intermediate PRs so small topic slices can merge without falsely publishing an incomplete 460-ticket guide.
- Require final published-guide validation to prove all current 460 IDs are covered, every ID has one or two categories, and repeated tickets physically render in every assigned category.
- Slice A implemented the draft/published pattern through `status: "draft" | "published"` on both `content/guide/topic-study-guide.ru.json` and `content/guide/topic-study-guide.coverage.json`. Draft validation enforces baseline freshness, structure, assignment consistency, answer explanations, vocabulary provenance, and source-trace references for marked claims, but does not require all 460 tickets yet. Published validation requires every current question ID to be assigned.
- Slice A keeps source trace as `content/guide/topic-study-guide.source-trace.json` with an empty draft `entries` array because the placeholder topic does not introduce official-source-backed claims. Official-documents governance remains deferred to Slice B.
- Slice A added only one structured placeholder topic and one ticket placement for schema validation. Taxonomy discovery, complete coverage, official archive work, full guide prose, and UI exposure remain deferred to later slices.
- Slice A review hardening requires guide, coverage, and source-trace `guideId`/`status` fields to agree. Any `published` status in one manifest activates strict complete-coverage validation, and mismatched statuses now fail instead of silently downgrading the guide to draft behavior.
- Slice A review hardening requires every source-trace entry to include at least one non-empty `officialDocumentIds` value. Draft compatibility is preserved because draft manifests may have zero source-trace entries when no official-source-backed claims exist, but any present entry must point at a future official-document manifest ID.
- Slice B created the governed official-documents section at the preferred path `content/official-documents/` with `AGENTS.md`, `manifest.json`, and tracked placeholder directories `documents/`, `originals/`, and `validation/`.
- Slice B keeps the initial official-documents manifest in `status: "draft"` with an empty `entries` array. This preserves draft-safe validation without downloading, converting, or seeding broad official source documents in the governance foundation slice.
- Slice B uses top-level manifest entry fields for `hashAlgorithm`, `hash`, `conversionMethod`, and `conversionNotes` to stay close to the existing source-registry style while adding the stricter official-document governance fields.
- Slice B implemented `scripts/official-documents-validation.mjs` with no file I/O in core validation. The helper accepts manifest data plus injectable file metadata or an existence callback, then `scripts/validate-content.mjs` supplies a real local existence callback for normal content validation.
- Slice B treats source-trace entries as current guide claims by default. A source-trace entry may opt out only with `claimUse: "historical_context"` or `currentClaim: false`; otherwise cited manifest entries must exist and have a current/currently-valid status with `currentness.validationStatus: "passed"`.
- Slice B review hardening compares manifest `hash` values against injected local Markdown SHA-256 metadata when available. Normal `scripts/validate-content.mjs` now supplies real SHA-256 metadata for existing local official-document paths, so stale archived Markdown hashes fail content validation once manifest entries exist.
- Slice B review hardening constrains `currentness.status`, `currentness.validationStatus`, and `exactTextValidation.status` to explicit enum sets so typos do not pass as non-empty strings.

### Known Issues

- The current question set remains `unofficial_b_fallback`; this feature must not imply an official or complete GCBA category B question bank.
- Official source candidates listed in `feature-request.md` are intake-time candidates, not final currentness proof. Future implementation must recheck official URLs and legal/source status at the time of source use.
- Exact Markdown preservation of PDFs, tables, annexes, images, or legal formatting may have conversion limits. Future archive tasks must record limitations and keep raw evidence.
- A ticket answer may conflict with current official sources. Such conflicts require process-memory recording and Architect disposition before publication.
- Full guide completion will require many topic content slices; no single future agent should own all prose and all 460 answer explanations.
- The topic-guide placeholder is intentionally draft-only and should not be treated as learner-ready guide content.
- Slice B did not run network research, download official documents, convert official documents, or add manifest entries. Slice D and later topic content slices remain responsible for official source acquisition and conversion.

### Verification Evidence

- Local branch/worktree orientation: `git status --short --branch` reported `## codex/006-topic-study-guide-intake` with untracked `specs/006-topic-study-guide/`.
- Required memory read: `AGENTS.md`, `.specify/memory/constitution.md`, `docs_project/README.md`, `docs_project/project-idea.md`, `docs_project/project/frontend/frontend-docs.md`, `docs_project/project/backend/backend-docs.md`, `docs_project/project/feature-inventory.md`, `docs_project/screens/learning-and-exam-flows.md`, `docs/specify/README.md`, and `specs/006-topic-study-guide/feature-request.md`.
- Current content shape inspected: question file, existing condensed guide, vocabulary, explanations, source registry, production eligibility policy, `scripts/validate-content.mjs`, `src/data/content.ts`, and current `GuideView`.
- Ticket baseline evidence: a read-only Node command loaded `content/questions/caba-b.unofficial-fallback.questions.json` and printed `count: 460`.
- Planning scope evidence: files intentionally changed by Architect are limited to `specs/006-topic-study-guide/spec.md`, `specs/006-topic-study-guide/plan.md`, and `specs/006-topic-study-guide/tasks.md`.
- Planning preflight evidence: `pnpm run preflight` passed after Architect artifact creation; feature-memory gate found no configured product paths changed, repository baseline passed, content validation passed for 460 category B fallback questions and 276 local image references, 31 unit tests passed, production build passed, service worker generation reported 280 cached assets, and 8 Playwright e2e tests passed. Vite emitted the existing non-blocking chunk-size warning and Playwright web server emitted existing `NO_COLOR`/`FORCE_COLOR` warnings.
- Markdown hygiene evidence: `rg -n "[ \\t]+$" specs/006-topic-study-guide/spec.md specs/006-topic-study-guide/plan.md specs/006-topic-study-guide/tasks.md || true` returned no matches.
- Review-finding evidence: targeted search found no remaining prior exact final-validation wording that limited archive exact-text/currentness gates to documents used by current guide claims; targeted search confirmed new official-documents manifest-entry and source-traced current-claim wording in `spec.md`, `plan.md`, and `tasks.md`; trailing whitespace search returned no matches; `git diff --check -- specs/006-topic-study-guide/spec.md specs/006-topic-study-guide/plan.md specs/006-topic-study-guide/tasks.md` passed.
- Slice A worktree orientation: `pwd && git status --short --branch` reported `/Users/chap/devel/cabadrive/.claude/worktrees/006-topic-guide-schema-validator` and `## codex/006-topic-guide-schema-validator` before implementation edits.
- Slice A baseline evidence: `node --input-type=module` loaded `content/questions/caba-b.unofficial-fallback.questions.json` and printed count `460`, question ID SHA-256 `b46707461f4ba5bd0f3eac6b0aa126764014e12ad42144df12c777200f2810ad`, first IDs `b-fallback-001, b-fallback-002, b-fallback-003`, and last IDs `b-fallback-458, b-fallback-459, b-fallback-460`.
- Slice A targeted validator evidence: `node --test tests/content-topic-guide.test.mjs` passed 11 tests covering current placeholder validity, draft partial coverage, published strict coverage, duplicate topics, invalid question IDs, missing required sections, missing answer explanations, vocabulary provenance, coverage/content mismatch, stale baseline, over-assignment, and source-trace claim references.
- Slice A content-validation smoke evidence: `pnpm run validate:content` passed with `Content validation passed: 460 category B fallback questions, 276 local image references.`
- Slice A environment note: initial `pnpm run build` failed because this isolated worktree had no `node_modules` and `vite` was not installed. `pnpm install` completed with the existing lockfile up to date and no repository file changes, then verification continued.
- Slice A final verification: `pnpm run validate:content` passed with 460 category B fallback questions and 276 local image references.
- Slice A final verification: `pnpm run test` passed 42 Node tests.
- Slice A final verification: `pnpm run build` passed; Vite emitted the existing non-blocking chunk-size warning and service worker generation reported 280 cached assets.
- Slice A final verification: `pnpm run preflight` passed; feature-memory gate, repository baseline, content validation, 42 Node tests, production build, nested e2e build, and 8 Playwright tests all passed. Playwright web server emitted the existing `NO_COLOR`/`FORCE_COLOR` warnings.
- Slice A final verification: `git diff --check` passed with no output.
- Slice A review hardening targeted evidence: `node --test tests/content-topic-guide.test.mjs` passed 14 tests after adding checks for non-empty `officialDocumentIds`, blank official document IDs, guide/source-trace `guideId` mismatch, and status disagreement that could hide strict mode.
- Slice A review hardening final verification: `pnpm run validate:content` passed with 460 category B fallback questions and 276 local image references; `pnpm run test` passed 45 Node tests; `pnpm run build` passed with the existing non-blocking Vite chunk-size warning and 280 cached service-worker assets; `pnpm run preflight` passed with 45 Node tests and 8 Playwright tests; `git diff --check` passed with no output.
- Slice B worktree orientation: `pwd && git status --short --branch` reported `/Users/chap/devel/cabadrive/.claude/worktrees/006-official-docs-governance` and `## codex/006-official-docs-governance` before implementation edits.
- Slice B required memory read: `AGENTS.md`, `.specify/memory/constitution.md`, `docs_project/README.md`, `docs_project/project-idea.md`, `docs_project/project/frontend/frontend-docs.md`, `docs_project/project/backend/backend-docs.md`, `docs_project/project/feature-inventory.md`, `docs_project/screens/learning-and-exam-flows.md`, `docs/specify/README.md`, and active feature memory `feature-request.md`, `spec.md`, `plan.md`, and `tasks.md`.
- Slice B targeted validator evidence: `node --test tests/official-documents-validation.test.mjs` passed 15 tests covering the empty draft manifest, valid injected file metadata, missing metadata, invalid local paths, path traversal, invalid hashes, missing conversion notes, missing currentness fields, missing exact-text validation status, PDF/raw evidence requirements, duplicate IDs, missing source-trace document IDs, stale/not-current source use, pending currentness validation for current claims, and historical-context source trace.
- Slice B content-validation smoke evidence: `pnpm run validate:content` passed with 460 category B fallback questions and 276 local image references after official-documents manifest integration.
- Slice B environment note: initial `pnpm run build` failed because this isolated worktree had no `node_modules` and `vite` was not installed. `pnpm install` completed with the existing lockfile up to date and no repository file changes, then verification continued.
- Slice B final verification: `node --test tests/official-documents-validation.test.mjs` passed 15 tests.
- Slice B final verification: `pnpm run validate:content` passed with 460 category B fallback questions and 276 local image references.
- Slice B final verification: `pnpm run test` passed 60 Node tests.
- Slice B final verification: `pnpm run build` passed; Vite emitted the existing non-blocking chunk-size warning and service worker generation reported 280 cached assets.
- Slice B final verification: `pnpm run preflight` passed; feature-memory gate, repository baseline, content validation, 60 Node tests, production build, nested e2e build, and 8 Playwright tests all passed. Vite emitted the existing non-blocking chunk-size warning and Playwright web server emitted the existing `NO_COLOR`/`FORCE_COLOR` warnings.
- Slice B final verification: `git diff --check` passed with no output.
- Slice B review hardening targeted evidence: `node --test tests/official-documents-validation.test.mjs` passed 19 tests after adding injected local SHA-256 comparison coverage, missing local SHA-256 compatibility, and explicit currentness/exact-text status enum typo coverage.
- Slice B review hardening content-validation evidence: `pnpm run validate:content` passed with 460 category B fallback questions and 276 local image references after `scripts/validate-content.mjs` began supplying real SHA-256 metadata for existing official-document local paths.
- Slice B review hardening final verification: `pnpm run test` passed 64 Node tests.
- Slice B review hardening final verification: `pnpm run build` passed; Vite emitted the existing non-blocking chunk-size warning and service worker generation reported 280 cached assets.
- Slice B review hardening final verification: `pnpm run preflight` passed; feature-memory gate, repository baseline, content validation, 64 Node tests, production build, nested e2e build, and 8 Playwright tests all passed. Vite emitted the existing non-blocking chunk-size warning and Playwright web server emitted the existing `NO_COLOR`/`FORCE_COLOR` warnings.
- Slice B review hardening final verification: `git diff --check` passed with no output.
- Slice B PR #12 AI Review found a P2 blocker: `sourceFormat` was lowercased but not trimmed before lossy-format checks, so `sourceFormat: "pdf "` could avoid required `rawOriginalPath`. Fix: trim before lowercasing and add regression coverage proving spaced PDF format still requires raw evidence.
- Slice B PR #12 P2 fix verification: `node --test tests/official-documents-validation.test.mjs` passed 19 tests; `pnpm run validate:content` passed with 460 category B fallback questions and 276 local image references; `pnpm run test` passed 64 Node tests; `pnpm run build` passed with the existing non-blocking Vite chunk-size warning and 280 cached service-worker assets; `pnpm run preflight` passed with 64 Node tests and 8 Playwright tests; `git diff --check` passed with no output.

### Implementation Agent Feedback

- Slice A: none requiring Architect disposition.
- Slice B: none requiring Architect disposition.

### Architect Dispositions

- Native Codex review finding `P2 Include manuals in final currentness validation` on PR #10 was accepted in a prior Architect pass. Disposition: broaden final exact-text/currentness validation requirements across `spec.md`, `plan.md`, and this backlog so they apply to every official document/material source type used by source-traced current guide claims, including manuals/study materials, licensing requirements/pages, road-safety/procedure materials, traffic-sign materials, laws, rules, formal requirements, and any other cited official source type. The later whole-archive finding below supersedes the final-gate scope.
- Native Codex review finding `P2 Validate the whole official-document archive` on PR #10 was accepted. Disposition: update `spec.md`, `plan.md`, and this backlog so final official-documents archive validation covers every manifest entry, including entries not currently cited by published guide claims, while separately requiring source-traced current guide claims to cite only entries that are current, in force, or otherwise currently valid for the relevant source type.
