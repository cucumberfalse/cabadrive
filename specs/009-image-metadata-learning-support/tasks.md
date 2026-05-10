# Tasks: Image Metadata And Learning Support Completion

## Architect Planning Setup

- [x] T001 Confirm active feature folder is `specs/009-image-metadata-learning-support/`.
- [x] T002 Confirm current worktree is `/Users/chap/devel/cabadrive-009-ticket-image-metadata-intake`.
- [x] T003 Confirm current branch context is `codex/009-ticket-image-metadata-intake`.
- [x] T004 Read `.specify/memory/constitution.md`.
- [x] T005 Read `docs_project/README.md`.
- [x] T006 Read `docs_project/project-idea.md`.
- [x] T007 Read `docs_project/project/frontend/frontend-docs.md`.
- [x] T008 Read `docs_project/project/backend/backend-docs.md`.
- [x] T009 Read `docs_project/project/feature-inventory.md`.
- [x] T010 Read `docs_project/screens/learning-and-exam-flows.md`.
- [x] T011 Read `docs/specify/README.md`.
- [x] T012 Read `specs/009-image-metadata-learning-support/feature-request.md`.
- [x] T013 Confirm `spec.md`, `plan.md`, and `tasks.md` were missing before Architect creation.
- [x] T014 Inspect relevant source/content/validation shapes without editing product files.
- [x] T015 Inspect existing feature-memory style from prior specs.

## Architect Artifacts

- [x] T016 Create `spec.md` with goal, scope, out-of-scope, assumptions, risks, negative scenarios, JSON schema requirements, validation/evidence requirements, acceptance criteria, and review instructions.
- [x] T017 Create `plan.md` with technical context, shared-image/per-question-critical-detail approach, deterministic evidence design, implementation slices, verification matrix, risks, and PR workflow.
- [x] T018 Create this `tasks.md` with future backlog, process memory sections, and agent/worktree instructions.

## Future Slice A: Schema And Validator Foundation

- [x] T019 Create draft-safe structured image metadata manifest/shard files, preferred path `content/image-metadata/`.
- [x] T020 Define one shared schema for image metadata entries and question usage mappings.
- [x] T021 Add a no-file-I/O image metadata validation helper.
- [x] T022 Add a no-file-I/O explanation alignment validation helper.
- [x] T023 Extend or parameterize translation alignment validation so strict full coverage can be enabled later.
- [x] T024 Add deterministic canonical fingerprint helpers for source question tuples, image metadata tuples, usage tuples, translation tuples, and explanation tuples.
- [x] T025 Add synthetic tests for missing metadata fields, duplicate IDs, invalid references, missing critical details, stale fingerprints, and missing evidence.
- [x] T026 Integrate draft-safe validation into `scripts/validate-content.mjs`.
- [x] T027 Update durable docs if new content paths or validation gates are introduced.
- [x] T028 Record command evidence and decisions in Process Memory.

## Future Slice B: `b-fallback-001` Bug Proof

- [x] T029 Add approved image metadata for `content/assets/questions/source-bandinopla-testdeconducir-b/b13.jpg`.
- [x] T030 Add approved `b-fallback-001` image usage mapping.
- [x] T031 Ensure metadata records urban street photo context, foreground cyclist, helmet, straight horizontal right-arm gesture, viewer/actor right-side distinction, and red oval annotation.
- [x] T032 Mark cyclist and straight right-arm gesture as answer-critical for `b-fallback-001`.
- [x] T033 Link the critical gesture to correct answer `b-fallback-001-a2`.
- [x] T034 Correct the `b-fallback-001` Russian explanation so it no longer says driver/left-arm/bent-up.
- [x] T035 Add image/explanation alignment evidence for the corrected `b-fallback-001` explanation.
- [x] T036 Add a regression fixture or unit test proving the old explanation text fails validation.
- [x] T037 Verify correct answer remains `b-fallback-001-a2`.
- [x] T038 Run targeted validation/tests, `pnpm run validate:content`, and `git diff --check`.
- [x] T039 Record exact before/after evidence in Process Memory.

## Future Slice C: Complete Image Metadata Coverage

- [x] T040 Partition the 275 unique image paths into reviewable non-overlapping shards.
- [x] T041 For each shard, add shared visual metadata with scene context, camera/framing, road layout, markings, signs/signals, vehicles, road users, gestures, annotations, visible text, relationships, and uncertainties.
- [x] T042 For each assigned image-backed question, add a question usage mapping.
- [x] T043 For every image-backed question usage, mark at least one answer-critical detail.
- [x] T044 Link answer-critical details to correct answer IDs or wrong-answer traps where applicable.
- [x] T045 Add review evidence for every image metadata entry.
- [x] T046 Add review evidence for every question usage mapping.
- [x] T047 Handle duplicate image `b2.jpg` once as shared metadata and cover both `b-fallback-256` and `b-fallback-303` usages.
- [x] T048 Enable strict image coverage validation after all shards are merged.
- [x] T049 Prove validation sees 276 current image references and 275 current unique image metadata entries.
- [x] T050 Prove stale image hash/path and stale question fingerprint failures with tests.
- [x] T051 Record shard ownership, evidence, and any ambiguous images in Process Memory.

## Future Slice D: Complete Russian Translation Coverage

- [x] T052 Decide whether translations remain monolithic or become validated/imported shards; record the decision before content edits.
- [x] T053 Add Russian question translations for all current 460 questions.
- [x] T054 Add Russian answer translations for exactly every current answer ID and no extra answer IDs.
- [x] T055 Add or refresh deterministic translation alignment evidence for every current question.
- [x] T056 Enable strict validation that fails when any current question lacks translation coverage.
- [x] T057 Add tests for full-coverage enforcement, missing/extra/empty answer translations, stale source fingerprints, and stale translation fingerprints.
- [x] T058 Run translation validation, `pnpm run validate:content`, targeted tests, and `git diff --check`.
- [x] T059 Record evidence by shard/range in Process Memory.

## Future Slice E: Complete Russian Explanation Coverage

- [x] T060 Decide whether explanations remain monolithic or become validated/imported shards; record the decision before content edits.
- [x] T061 Add Russian explanations for all current 460 questions.
- [x] T062 Add structured correct-answer rationale tied to each current `correctAnswerId`.
- [x] T063 Add wrong-answer rationales for every incorrect answer ID, or record an Architect-approved controlled exception.
- [x] T064 Add related source IDs or ticket-specific fallback scoping for claims beyond direct ticket/image facts.
- [x] T065 For every image-backed question, reference required image-critical details in explanation alignment evidence.
- [x] T066 Add or refresh deterministic explanation alignment evidence for every current question.
- [x] T067 Enable strict validation that fails when any current question lacks explanation coverage.
- [x] T068 Add tests for missing explanations, missing correct-answer rationale, missing wrong-answer rationale, stale explanation fingerprints, stale metadata fingerprints, and contradicted structured visual claims.
- [x] T069 Run explanation validation, `pnpm run validate:content`, targeted tests, and `git diff --check`.
- [x] T070 Record evidence by shard/range/topic in Process Memory.

## Future Slice F: Docs, Imports, And User-Facing Consistency

- [x] T071 Update `src/data/content.ts` if content paths or data shapes change.
- [x] T072 Update app behavior only if needed to consume complete translations/explanations or sharded content.
- [x] T073 Preserve Spanish source text as primary and Russian support as unofficial learning support.
- [x] T074 Remove or narrow fallback UI messages for missing current translations/explanations only after strict coverage proves none are missing.
- [x] T075 Update `docs_project/project/backend/backend-docs.md` for offline validation tooling.
- [x] T076 Update `docs_project/project/frontend/frontend-docs.md` for complete learning-support coverage if UI/data behavior changes.
- [x] T077 Update `docs_project/project/feature-inventory.md` for image metadata and full learning-support validation.
- [x] T078 Update `docs_project/project/content-sources.md` if source-trace or official-claim scoping changes.
- [x] T079 Update `docs_project/screens/learning-and-exam-flows.md` if question-card behavior changes.
- [x] T080 Update `docs/specify/04_data_model.md` and `docs/specify/05_content_pipeline.md` if canonical schema/pipeline terms change.
- [x] T081 Run docs-related validation, `pnpm run build`, `pnpm run test:e2e` if runtime behavior changes, and `git diff --check`.
- [x] T082 Record docs/spec evidence in Process Memory.

## Future Slice G: Final Strict Gate And PR Readiness

- [x] T083 Enable strict global image metadata coverage validation.
- [x] T084 Enable strict global translation coverage validation.
- [x] T085 Enable strict global explanation coverage validation.
- [x] T086 Prove all 460 current questions have translations.
- [x] T087 Prove all 460 current questions have explanations.
- [x] T088 Prove all 276 current image-backed question references have usage mappings.
- [x] T089 Prove all 275 current unique image paths have shared metadata.
- [x] T090 Prove every image-backed question usage has answer-critical detail coverage.
- [x] T091 Prove the old `b-fallback-001` explanation fails and the corrected explanation passes.
- [x] T092 Run `pnpm run validate:content`.
- [x] T093 Run `pnpm run test`.
- [x] T094 Run `pnpm run build`.
- [x] T095 Run `pnpm run test:e2e`.
- [x] T096 Run `pnpm run preflight`.
- [x] T097 Run `git diff --check`.
- [ ] T098 If runtime-affecting changes exist, run `make down`, `make build`, `make up`, HTTP/browser smoke test against `http://localhost:5173`, and `make down`. Feature 019 closure disposition: not closed because no explicit local `make down`/`make build`/`make up` plus HTTP/browser smoke evidence was found in PR #63 memory. PR #63 did have a green `docker-validation` check, but this post-merge process-memory-only closure does not change runtime files and did not execute a new Docker smoke.
- [x] T099 Confirm required checks are green after PR push and AI Review completed on the current head without being skipped: `baseline-checks`, `docker-validation`, `guard`, `AI Review`, `osv-scan`. Feature 019 closure audit verified `gh pr checks 63 --repo cucumberfalse/cabadrive` reported all five checks as `pass` on final PR head `3d49a66b1972ef4950a70b41a35e17fc4a03f215`.
- [x] T100 Confirm no unresolved merge conflicts. Feature 019 closure audit verified PR #63 merged into `main` at `2026-05-10T14:10:41Z` with merge commit `78e0176e361eeea583dd797296bfa994b3f1f695`.
- [x] T101 Confirm no blocking review findings remain. Feature 019 closure audit verified all 7 PR #63 review threads were `isResolved: true`, the final AI Review check passed, and final Codex Review comments reported no major issues.
- [x] T102 Confirm the PR is not draft and only final human approval or merge mechanics remain after T099-T101, T109-T111, T114-T120, and T163-T166 are complete. Feature 019 closure audit verified `isDraft: false`, final head `3d49a66b1972ef4950a70b41a35e17fc4a03f215`, green checks, resolved threads, and merge commit `78e0176e361eeea583dd797296bfa994b3f1f695`.

## Agent Boundaries For Future Work

- [x] T103 Implementation Agent confirms complete feature memory before product edits.
- [x] T104 Implementation Agent uses only the assigned isolated worktree and branch.
- [x] T105 Implementation Agent does not touch other agents' worktrees, branches, or unrelated changes.
- [x] T106 Implementation Agent keeps each PR within the Orchestrator-assigned slice.
- [x] T107 Implementation Agent updates this `tasks.md` with verification evidence and process memory in the same PR.
- [x] T108 Implementation Agent records divergence or improvement feedback here for Architect disposition instead of implementing out-of-scope changes silently.
- [x] T109 Review Agent reviews against this feature memory, PR diff, and the hard quality gates for full image metadata, translations, and explanations. Feature 019 closure audit verified PR #63 review comments and AI Review runs against commits `845eb6b8bba502333fa673b4738e8a962beeb2e2`, `27ac08664f3f051a3aebf4c3fd1fa14569234038`, `9437d70a3728c6f4ff566c574eab477ebf76e0df`, `5c971b601d64ac0006c895d92f53e6ef3bae3d1d`, and final head `3d49a66b1972ef4950a70b41a35e17fc4a03f215`.
- [x] T110 Review Agent does not edit code, content, docs, tests, scripts, templates, specs, or workflow files while acting as reviewer. Feature 019 closure audit found PR #63 Review Agent artifacts were GitHub review comments/check output only; implementation fixes were recorded separately in this process memory.
- [x] T111 Review Agent reports blocking code/content findings as GitHub inline review threads under the repository review contract and records/links content-quality sampling evidence. Feature 019 closure audit verified blocking review comment IDs `3214096541`, `3214096542`, `3214912010`, and `3214912012`, bot review comments `3214909890`, `3214926746`, and `3214937285`, plus final no-major-issues comments `4415464585` and `4415485365`.

## Architect Hard-Gate Update After Review Blockers

- [x] T112 Record current Review Agent P1 blockers as accepted architecture blockers, not optional polish.
- [x] T113 Update `spec.md`, `plan.md`, and this `tasks.md` to state this is not an MVP/placeholder task.
- [x] T114 Implementation Agent verifies or replaces every approved image metadata entry from actual visual review so it is complete enough for close image recreation and contains no generic/question-derived/source-image-frame/low-confidence-baseline content.
- [x] T115 Implementation Agent verifies or replaces every question image usage mapping so answer-critical details name actual visible facts and link to current answer reasoning, with no generic source-image or answer-cue placeholders.
- [x] T116 Implementation Agent verifies or replaces all 460 Russian translations and all answer translations as idiomatic Russian with no untranslated Spanish residue, transliteration, wrappers, glossary drafts, or dropped answer-critical meaning.
- [x] T117 Implementation Agent verifies or replaces all 460 Russian explanations as complete ticket-specific learning explanations with correct-answer rationale, wrong-answer rationales, and image-specific rationale where applicable.
- [x] T118 Implementation Agent adds or tightens validators/tests to reject low-confidence baseline metadata, generic answer-cue usage, question-derived-only metadata, approved metadata without full visual-review evidence, Spanish residue, transliteration, wrapper translations, and generic explanation filler.
- [x] T119 Implementation Agent records hard-gate verification evidence by image/translation/explanation range, including reviewer evidence beyond counts and hashes.
- [x] T120 Review Agent manually samples and inspects content quality for images, translations, explanations, all prior blockers, and generated-pattern risk areas before passing review. Feature 019 closure audit verified Orchestrator comment `4415464185` recorded independent Review Agent no-blocker sampling after reviewed image metadata, Russian translations, and Russian explanations across all 460 tickets, plus final Codex Review no-major-issues comments on PR #63.
- [x] T121 Orchestrator keeps PR blocked from ready/merge state while it is draft, AI Review is skipped, any T099-T102/T109-T111/T114-T120/T163-T166 item is pending, or any blocking Review Agent finding remains. Feature 019 review-fix audit verified PR #63 merged only after final head `3d49a66b1972ef4950a70b41a35e17fc4a03f215` was non-draft, AI Review passed, required checks `baseline-checks`, `docker-validation`, `guard`, and `osv-scan` passed, all 7 review threads were resolved, no conflicts remained, and T099-T102/T109-T111/T114-T120/T163-T166 had PR #63 evidence recorded. T098 is not part of the T121 blocking condition and remains open with explicit Docker-smoke disposition.
- [x] T122 Implementation Agent shards translation, explanation, and question-image metadata sources into the five assigned ticket ranges so parallel content workers can edit non-overlapping files.
- [x] T123 Implementation Agent updates app imports, validation, and generated compatibility indexes to consume shards deterministically.

## Architect Update After Content-Agent And Lifecycle Clarification

- [x] T124 Architect reads updated Analyst clarification that image metadata, translations, and explanations must all be completed by one-time parallel content agents.
- [x] T125 Architect updates `spec.md` with one-time parallel content-agent workflow, range ownership, direct local image inspection, translation/explanation content-agent review, durable ticket lifecycle requirements, acceptance criteria, and negative scenarios.
- [x] T126 Architect updates `plan.md` with content-agent production model, current shard paths, exact range-owned implementation slices, durable docs lifecycle requirements, validation matrix updates, and PR readiness gates.
- [x] T127 Architect updates this `tasks.md` with follow-up implementation tasks for range agents and durable docs.
- [x] T128 Architect keeps this pass limited to `spec.md`, `plan.md`, and `tasks.md`; no product code, content, scripts, tests, durable docs, commits, pushes, or PR state changes.

## Future Content-Agent Range Execution

- [x] T129 Orchestrator assigns explicit isolated worktrees/branches for each content-agent slice and tells every agent that parallel orchestrators/agents are active.
- [x] T130 Orchestrator assigns non-overlapping range ownership for image metadata shards: `001-092`, `093-184`, `185-276`, `277-368`, and `369-460`.
- [x] T131 Orchestrator assigns non-overlapping range ownership for translation shards: `001-092`, `093-184`, `185-276`, `277-368`, and `369-460`.
- [x] T132 Orchestrator assigns non-overlapping range ownership for explanation shards: `001-092`, `093-184`, `185-276`, `277-368`, and `369-460`.
- [x] T133 Each image metadata content agent edits only `content/image-metadata/question-images/<assigned-range>.json`.
- [x] T134 Each translation content agent edits only `content/translations/ru/<assigned-range>.json`.
- [x] T135 Each explanation content agent edits only `content/explanations/ru/<assigned-range>.json`.
- [x] T136 Image metadata content agents inspect every assigned actual local image file and replace or approve visible scene/object/road/sign/marking/road-user/annotation/relationship details from direct visual review.
- [x] T137 Image metadata content agents capture stable object/detail/region IDs and semantic localization for referenced visible details, with optional approximate boxes/polygons when reliable.
- [x] T138 Usage/relevance content agents verify assigned question usage mappings so answer-critical/highlight, supporting, distractor/trap, and background/irrelevant/dim details name actual visible facts and link to current answer reasoning.
- [x] T139 Usage/relevance content agents ensure every image-backed question has at least one highlight/answer-critical detail and enough non-critical or background context to support future dimming without marking everything critical.
- [x] T140 Translation content agents prepare or review idiomatic Russian question and answer translations for every assigned ticket, removing Spanish residue, transliteration, wrappers, glossary scaffolding, and dropped answer-critical meaning.
- [x] T141 Explanation content agents prepare or review complete Russian explanations for every assigned ticket, including correct-answer rationale, wrong-answer rationales, source/ticket scoping, and image-critical/relevance reasoning where applicable.
- [x] T142 Every content agent records range-level evidence: content family, assigned range, files touched, question/image IDs covered, reviewer/agent, review timestamp, validation commands, ambiguities, dependencies, controlled exceptions, and relevance/region review status for image-backed ranges.
- [x] T143 Every content agent regenerates compatibility indexes with `node scripts/content-shards.mjs --write-indexes` after shard edits.
- [x] T144 Every content agent runs the slice-appropriate structural and quality validators, records exact outputs in Process Memory, and leaves `pnpm run validate:content:quality` failures only for unrelated unfinished ranges.
- [x] T145 Final content-quality pass proves all 15 content-family range shards are `qualityStatus: "complete"` with full content-agent evidence.

## Future Durable Docs Lifecycle Update

- [x] T146 Implementation Agent updates `docs_project/project/content-sources.md` with the ticket lifecycle for adding, changing, and deleting tickets.
- [x] T147 Durable docs state that adding a ticket requires source tuple validation, local image/hash when present, image metadata and question usage when an image exists, Russian translation, Russian explanation, evidence refresh, generated-index refresh, validation, and process-memory evidence.
- [x] T148 Durable docs state that adding a ticket with an image requires stable object/detail/region IDs and question-specific relevance mappings for highlight/dim semantics.
- [x] T149 Durable docs state that materially changing ticket text, answer IDs/text, correct answer, image path, image hash, or image content requires refreshing affected translations, explanations, image metadata/usages, overlay/relevance mappings where relevant, evidence fingerprints, generated indexes, validation, and process memory.
- [x] T150 Durable docs state that deleting a ticket requires removing or refreshing linked translations, explanations, question image usages, overlay/relevance mappings, explanation alignment evidence, translation evidence, usage evidence, generated indexes, and validation records.
- [x] T151 Durable docs state that shared image metadata is removed only when no remaining question usage references that image; otherwise only the deleted/changed ticket's usage and related evidence are removed or refreshed.
- [x] T152 Implementation Agent updates `docs_project/project/backend/backend-docs.md` for offline validators, shard writer/index generation, evidence files, and quality gates if not already current.
- [x] T153 Implementation Agent updates `docs_project/project/frontend/frontend-docs.md` only if shard imports, runtime data behavior, missing-support UI behavior, or the feature `009`/`010` overlay semantics boundary changed.
- [x] T154 Implementation Agent updates `docs/specify/04_data_model.md` and `docs/specify/05_content_pipeline.md` when canonical schema, source-of-truth paths, evidence model, generated-index flow, relevance schema, or lifecycle pipeline terms changed.
- [x] T155 Review Agent verifies durable docs lifecycle coverage before final readiness and blocks the PR if add/change/delete cleanup rules or overlay/relevance refresh rules are absent or incomplete. Feature 019 closure audit verified PR #63 docs lifecycle coverage in `docs_project/project/content-sources.md`, `docs_project/project/backend/backend-docs.md`, `docs_project/project/frontend/frontend-docs.md`, `docs/specify/04_data_model.md`, and `docs/specify/05_content_pipeline.md`, and PR #63 final review/check evidence found no remaining blockers.

## Architect Update After Branch 010 Highlight/Dim Clarification

- [x] T156 Architect reads updated Analyst clarification informed by branch `codex/010-ui-ux-learning-intake`.
- [x] T157 Architect records that feature `009` owns image semantics and question-specific relevance, while feature `010` owns overlay presentation/rendering.
- [x] T158 Architect updates `spec.md` so shared image metadata requires stable object/detail/region IDs, semantic localization, and optional boxes/polygons when feasible.
- [x] T159 Architect updates `spec.md` so per-question usage requires answer-critical/highlight, supporting, distractor/trap, and background/irrelevant/dim relevance roles.
- [x] T160 Architect updates `plan.md` so content agents produce relevance mappings and region references, not only prose descriptions.
- [x] T161 Architect updates `tasks.md` with paused content-agent follow-up work for region IDs, relevance mappings, and overlay/relevance lifecycle docs.
- [x] T162 Architect keeps this pass limited to `spec.md`, `plan.md`, and `tasks.md`; no product code, content, scripts, tests, durable docs, commits, pushes, or PR state changes.
- [x] T163 Implementation Agent updates validators/tests so approved image-backed usages fail when they lack stable object/detail/region references, answer-critical/highlight details, non-critical/background context, or contain mark-everything-critical mappings.
- [x] T164 Implementation Agent updates image metadata shards so referenced details have stable IDs and semantic localization, with optional approximate boxes/polygons where reliable.
- [x] T165 Implementation Agent updates question usage mappings so every image-backed question classifies referenced details/regions by question-specific relevance role and answer rationale.
- [x] T166 Review Agent samples reused-image cases to verify relevance roles are question-specific and not copied blindly across questions. Feature 019 closure audit verified the sole reused image `question-image-b2` has separate usages for `b-fallback-256` and `b-fallback-303`; Orchestrator comment `4415464185` recorded independent Review Agent confirmation of 276 image usages, 972 relevance entries, and zero missing relevance IDs/confidence.

## Architect Update After Question-Scoped Relevance Clarification

- [x] T167 Architect reads the new clarification that image importance/unimportance is evaluated only in the concrete question where an image is used.
- [x] T168 Architect updates `spec.md` to forbid global important/unimportant/critical/relevance flags in shared image metadata and to keep all relevance roles in per-question usage.
- [x] T169 Architect updates `plan.md` so content-agent, validator, evidence, lifecycle, and review guidance ground relevance in question text, ordered answers, correct answer, and explanation rationale.
- [x] T170 Architect updates this `tasks.md` with follow-up implementation/review tasks while preserving existing task history.
- [x] T171 Architect keeps this pass limited to `spec.md`, `plan.md`, and `tasks.md`; no product code, content, scripts, tests, durable docs, commits, pushes, or PR state changes.
- [x] T172 Implementation Agent updates validators/tests so shared image metadata, shared object/detail/region records, generated indexes, and evidence fail if they contain global importance, unimportance, criticality, distractor, highlight, dim, or relevance-role fields.
- [x] T173 Implementation Agent updates image metadata shards to remove any global importance/relevance semantics from shared metadata while preserving visible object/detail/region descriptions and stable IDs.
- [x] T174 Implementation Agent updates question usage mappings so `answer_critical_highlight`, `supporting`, `distractor_trap`, and `background_irrelevant_dim` roles are justified by the concrete question text, ordered answer choices, correct answer, and explanation rationale.
- [x] T175 Review Agent verifies that no image without a current question usage is forced through importance/relevance evaluation and that reused images receive separate per-question relevance review. Feature 019 closure audit verified 275 images, 275 used images, 0 unused images, 0 unused shared images with relevance-like keys, and separate per-question usages for the reused `question-image-b2`.
- [x] T176 Review Agent verifies feature `010` handoff data can consume question-specific usage/relevance only, not global shared-image importance. Feature 019 closure audit verified 972 question-usage relevance entries, 0 missing `relevanceId`, 0 missing confidence, 0 shared image metadata relevance-like keys, and frontend/spec docs stating feature `010` consumes question-specific usage relevance rather than shared-image importance.

## Process Memory

### Decisions

- Architect selected shared image metadata per unique image plus per-question image usage mappings for answer-critical details.
- Architect update on 2026-05-09 after branch `010` clarification: shared image metadata must expose stable object/detail/region IDs and semantic localization; per-question image usage owns relevance roles for answer-critical/highlight, supporting, distractor/trap, and background/irrelevant/dim details.
- Architect update on 2026-05-09 after branch `010` clarification: feature `009` owns image semantics and question-specific relevance; feature `010` owns overlay presentation/rendering and must consume `009` rather than inventing UI-only answer-critical semantics.
- Architect update on 2026-05-10 after question-scoped relevance clarification: shared image metadata is strictly question-neutral and must not contain global important/unimportant/critical/relevance flags. All relevance roles live only in `QuestionImageUsage` for a concrete question.
- Architect update on 2026-05-10 after question-scoped relevance clarification: relevance roles must be grounded in the current question text, ordered answer choices, correct answer, and explanation rationale; images without a current question usage do not need importance/relevance evaluation.
- Architect selected deterministic local evidence and fingerprints rather than live AI/OCR/translation/network validation.
- Architect requires every image-backed question to have at least one answer-critical detail unless a future Architect disposition records a controlled exception.
- Architect requires complete 460-question translation and explanation coverage for the current fallback bank.
- Architect requires every incorrect answer to have a concise rationale unless a future Architect disposition records a controlled exception.
- Architect keeps the question-card translation/explanation layer as the source of truth for this feature; topic-guide content may be reused only with an explicit synchronization decision.
- Architect requires `b-fallback-001` to be the first content proof after validator foundation, because it is the motivating regression.
- Architect did not edit `feature-request.md`, product code, content data, tests, scripts, durable docs, commits, pushes, or PR state.
- Implementation Agent confirmed the required feature memory existed before product edits and worked only in `/Users/chap/devel/cabadrive-009-ticket-image-metadata-intake` on `codex/009-ticket-image-metadata-intake`.
- Orchestrator assignment requested end-to-end implementation in this branch rather than separate PR slices; Implementation Agent recorded this divergence and kept the scope in one branch to satisfy the latest assignment.
- Earlier implementation kept translations and explanations monolithic in `content/translations/ru.translations.json` and `content/explanations/ru.explanations.json` because the app imported those files directly. The 2026-05-09 infrastructure pass superseded this: `content/translations/ru/*.json` and `content/explanations/ru/*.json` are now the source of truth, and the monolithic files are generated compatibility indexes.
- Earlier implementation used one monolithic image metadata manifest at `content/image-metadata/question-images.manifest.json` plus a separate evidence file. The 2026-05-09 infrastructure pass superseded this: `content/image-metadata/question-images/*.json` is now the source of truth, with `questionUsages` owned by question range and shared `images` owned by the lowest-numbered image-backed question using that image.
- Implementation reused topic-study-guide answer rationales for question-card explanations where available, with deterministic fallback text only when topic-guide rationale was unavailable.
- Review-fix implementation replaced deterministic glossary wrapper translations with rule-based Russian question/answer translations and added validation that rejects draft wrappers and obvious Spanish markers.
- Review-fix implementation replaced placeholder image metadata/usage records with structured scene/object/sign/road/road-user cue metadata derived from current ticket wording, answer keys, and topic-guide rationales. Architect disposition: this may be useful as draft scaffolding, but it is not final acceptable image metadata unless each entry is visually reviewed against the actual image and made complete enough for close recreation. `b-fallback-001`/`b13.jpg` remains the manually precise high-confidence regression case.
- Review-fix implementation strengthened validators so approved metadata cannot use `source_image_frame`, `manual-review-required`, `Deterministic baseline metadata`, or generic source-image critical details. Architect disposition: validator keyword bans are necessary but insufficient; final gates must also reject question-derived-only metadata, low-confidence overall metadata, generic answer-cue usage, and approved records without full visual-review evidence.
- Architect hard-gate update on 2026-05-09: the feature is not an MVP and cannot be completed with placeholders, generated baseline coverage, wrappers, transliteration, Spanish residue, or generic explanations.
- Architect hard-gate update on 2026-05-09: Russian copy-edit/content review is not optional polish; translation and explanation quality is part of merge readiness.
- Architect hard-gate update on 2026-05-09: PR readiness requires non-draft status, completed non-skipped AI Review on the current head, green required checks, no merge conflicts, no blocking Review Agent findings, and completed T099-T102/T109-T111/T114-T120/T163-T166.
- Implementation Lead infrastructure pass on 2026-05-09 reverted the rejected uncommitted review-fix product/content/script/test/doc changes while preserving Architect updates in this feature memory, then rebuilt the work as an infrastructure/refactor slice.
- Implementation Lead infrastructure pass on 2026-05-09 introduced five shard ranges for each content area: `001-092`, `093-184`, `185-276`, `277-368`, and `369-460`.
- Implementation Lead infrastructure pass on 2026-05-09 added `scripts/content-shards.mjs` as the deterministic loader/writer. Content workers edit only their assigned shard files, then run `node scripts/content-shards.mjs --write-indexes`.
- Implementation Lead infrastructure pass on 2026-05-09 kept `pnpm run validate:content` as structural offline validation and added `pnpm run validate:content:quality` as the hard content-quality gate. The quality gate is expected to fail until every range is fully reviewed and marked complete.
- Architect clarification update on 2026-05-09: image metadata, translations, and explanations all require one-time parallel content-agent production or full review. Generator/template/transliteration/glossary output and text-inferred image metadata are draft scaffolding only.
- Architect clarification update on 2026-05-09: content agents must use isolated worktrees/branches, own non-overlapping ranges, edit only assigned shard files, regenerate indexes with `node scripts/content-shards.mjs --write-indexes`, and record range-level evidence.
- Architect clarification update on 2026-05-09: durable docs must document ticket add/change/delete lifecycle, including image analysis when an image exists, Russian translation, Russian explanation, evidence refresh, validation, generated indexes, linked artifact cleanup, and shared-image metadata reference checks.
- Architect highlight/dim update on 2026-05-09: durable docs must also require overlay/relevance metadata refresh when ticket text, answer IDs/text, correct answer, image path/hash/content, usage mappings, or explanations change or delete.
- Implementation Agent mergeability update on 2026-05-10: PR #63 was updated by merging current `origin/main` into `codex/009-ticket-image-metadata-intake`, preserving feature 009 reviewed image metadata/translation/explanation coverage and the newer mainline process-guide, learning-content UI polish, and orchestrator-workflow changes.
- Implementation Agent mergeability update on 2026-05-10: translation alignment evidence now preserves the mainline top-level `generatedAt`, `evidenceType`, and `description` metadata while retaining feature 009 full 460-entry deterministic fingerprints; `scripts/refresh-learning-support-evidence.mjs` was updated so future evidence refreshes keep those metadata fields.

### Dead Ends

- None during Architect planning.
- No live OCR/LLM/image-captioning path was used because runtime/tests/build/preflight must remain deterministic and offline.
- Finalization loop on 2026-05-10 briefly encountered stale unmerged index/worktree entries from the earlier mergeability probe against `origin/main`; the entries were restored to current `HEAD` after confirming no background git process was active, and no feature content changes were lost.
- Mergeability update on 2026-05-10 first found a stale generated translations compatibility index after merging current `origin/main`; this was resolved with `node scripts/content-shards.mjs --write-indexes`, followed by evidence refresh and `node scripts/content-shards.mjs --check-indexes`.
- Mergeability update on 2026-05-10 first reran `pnpm run preflight` and reached Playwright, where the new dual-topic materials e2e test from main expected a missing-translation fallback for `b-fallback-031`. Feature 009 now has complete Russian translations, so the test was updated to assert the current Russian question and answer translations instead.

### Known Issues

- Baseline before implementation: translation coverage was only 10 of 460 questions.
- Baseline before implementation: explanation coverage was only 5 of 460 questions.
- Baseline before implementation: explanation for `b-fallback-001` contradicted the image by describing driver/left-arm/bent-up instead of cyclist/right-arm/straight-horizontal.
- Baseline before implementation: validation proved image files existed and hashes matched, but not that explanations matched image semantics.
- Large content files may cause merge conflicts unless future implementation shards data or serializes monolithic edits.
- Some images may be ambiguous, low-resolution, annotated, or cropped; implementation records uncertainty instead of inventing visual facts.
- Count/fingerprint gate implemented: strict validation now requires 460 translations, 460 explanations, 275 unique image metadata entries, 276 question usages, answer-critical image details, and fresh deterministic evidence. Architect disposition: this is necessary but not sufficient for final quality.
- Current Review Agent blocker accepted: most image metadata must not remain placeholder/baseline/question-derived-only coverage or be marked approved without full visual review.
- Current Review Agent blocker accepted: image usage mappings must not approve generic source-image or answer-cue critical details; they must name the actual visible answer-critical facts.
- Current Review Agent blocker accepted: translations must not contain Spanish residue, transliteration, wrappers, or glossary drafts; `b-fallback-011` was cited as a concrete blocker and must be rechecked.
- Current Review Agent blocker accepted: PR #63 is not merge-ready while it is draft, AI Review is skipped, no passing Review Agent quality review exists, or T099-T102/T109-T111 remain unchecked.
- Historical issue resolved by the 2026-05-10 integration pass: all five translation, explanation, and image-metadata range shards are now `qualityStatus: "complete"` and were merged from the final content-agent heads.
- Historical issue resolved by the 2026-05-10 integration pass: `pnpm run validate:content:quality` passes after reviewed shard integration, generated-index refresh, evidence refresh, and targeted residue/terse-rationale fixes.
- Historical issue resolved by the 2026-05-10 integration pass: durable docs now document ticket add/change/delete lifecycle and linked-artifact cleanup rules.
- Historical issue resolved by the 2026-05-10 integration pass: validators now cover question-specific relevance roles, mark-everything-critical usage mappings, shared-metadata relevance-key leakage, and stale relevance fingerprints.
- AI Review blocker `PRRT_kwDOSX65IM6A5wjy` / comment `3214937690` resolved on 2026-05-10: `answerCriticalDetails[].detailId` is now checked only against detail IDs defined in shared image metadata, so a usage-level answer-critical detail can no longer legalize its own invented ID.
- AI Review blocker `PRRT_kwDOSX65IM6A5yqd` / comment `321494866` resolved on 2026-05-10: `imageMetadataTuple` now includes `regions` and `visualDetails`, so changes to inspected semantic regions or reviewed visual facts invalidate image metadata evidence and downstream image-backed explanation evidence.

### Verification Evidence

- Architect orientation: `jq 'length' content/questions/caba-b.unofficial-fallback.questions.json` returned `460`.
- Architect orientation: image-backed question count query returned `276`.
- Architect orientation: unique image path count query returned `275`.
- Architect orientation: duplicate image path query returned `content/assets/questions/source-bandinopla-testdeconducir-b/b2.jpg`.
- Architect orientation: translation entry count query returned `10`.
- Architect orientation: explanation entry count query returned `5`.
- Architect did not run product tests or preflight because this pass is planning-only and must not implement product changes.
- Implementation generation: `node scripts/generate-learning-support.mjs` returned `Generated learning support: 275 images, 276 usages, 460 translations, 460 explanations.`
- Implementation count audit: local Node query returned `questions=460`, `translations=460`, `explanations=460`, `imageRefs=276`, `uniqueImages=275`, `usages=276`, `b001Correct=b-fallback-001-a2`.
- Implementation `b-fallback-001` audit: corrected explanation says the foreground subject is a helmeted cyclist and that the cyclist extends the right arm straight/horizontally; metadata gesture has `bodyPart=right_arm`, `pose=extended_straight_horizontal`, `actorPerspectiveDirection=right`, and `viewerPerspectiveDirection=left`.
- `pnpm run validate:content` passed: `Content validation passed: 460 category B fallback questions, 276 local image references.`
- `pnpm run test` passed: `80` tests, `80` pass, `0` fail.
- First `pnpm run build` attempt failed because the isolated worktree had no `node_modules` and `vite` was not installed locally; this was an environment setup issue, not a validation/code failure.
- `pnpm install` completed successfully using the existing lockfile, with packages reused from the local pnpm store.
- `pnpm run build` passed after dependency installation; Vite built successfully and `scripts/generate-service-worker.mjs` generated a service worker with `280` cached assets. Vite emitted only the pre-existing chunk-size warning for the app bundle.
- Final `pnpm run preflight` passed after rebasing onto current `origin/main` (`f6882e5`): feature-memory gate, repo baseline check, content validation, all unit tests, production build, and Playwright e2e all succeeded.
- Final `pnpm run test:e2e` passed inside preflight: `14` tests passed across chromium/mobile.
- `git diff --check` passed with no whitespace errors.
- Review-fix audit: local Node query returned `genericImages=0` and `genericUsages=0` after regenerating metadata.
- Review-fix audit: `b-fallback-011` translation is now `Что означает этот знак?` with Russian answer translations for the airport/low-flying aircraft sign.
- Review-fix tests: `pnpm run test` passed with `82` tests after adding placeholder-metadata, generic-usage, and Spanish-marker translation regressions.
- Infrastructure shard generation: `node scripts/content-shards.mjs --init-from-current` initialized range shards from the current generated indexes and regenerated compatibility indexes.
- Generated-index freshness: `node scripts/content-shards.mjs --check-indexes` passed with `Generated content indexes are fresh.`
- Structural validation after sharding: `pnpm run validate:content` passed with `Content validation passed: 460 category B fallback questions, 276 local image references.`
- Full content quality gate after sharding: `pnpm run validate:content:quality` failed as expected, starting with all 15 range shards requiring `qualityStatus: complete`, then reporting translation residue (including `b-fallback-011`), placeholder/low-quality image metadata, and generic/Spanish-residue explanation blockers.
- Infrastructure tests: `pnpm run test` passed with `87` tests, `87` pass, `0` fail.
- Infrastructure build: `pnpm run build` passed after sharding; Vite emitted only the existing large chunk-size warning and generated a service worker with `280` cached assets.
- Infrastructure preflight: `pnpm run preflight` passed, including feature-memory gate, repo baseline check, structural content validation, `87` unit tests, production build, and `14` Playwright e2e tests.
- Content integration merge evidence on 2026-05-10: final range heads verified in `codex/009-ticket-image-metadata-intake`: `origin/codex/009-content-001-092` at `ac761c449a355b79a0d78ef7850337ca7f989f1a`, `origin/codex/009-content-093-184` at `56f858fd68d81a2e5998e11cfb919cf789d683c4`, `origin/codex/009-content-185-276` at `53d1732f7784e927a735b69a708458fe5428438a`, `origin/codex/009-content-277-368` at `57eacf4246ea3f7f08364e54413b3f427d722c86`, and `origin/codex/009-content-369-460` at `f0ac31e24910640c2ecc3765d713ec8631fd8dfc`. The `093-184` and `185-276` heads were already ancestors before the final integration merge commits.
- Content integration shard audit on 2026-05-10: all five range shards for translations, explanations, and question-image metadata report `qualityStatus: "complete"`; generated indexes contain `460` translations, `460` explanations, `275` image metadata entries, and `276` question usages.
- Generated-index refresh on 2026-05-10: `node scripts/content-shards.mjs --write-indexes` followed by `node scripts/content-shards.mjs --check-indexes` passed with `Generated content indexes are fresh.`
- Evidence-only refresh on 2026-05-10: `pnpm run refresh:content-evidence` passed with `Refreshed learning-support evidence: 275 images, 276 usages, 460 translations, 460 explanations.`
- Structural validation on 2026-05-10 after integration: `pnpm run validate:content` passed with `Content validation passed: 460 category B fallback questions, 276 local image references.`
- Full content quality validation on 2026-05-10 after targeted fixes: `pnpm run validate:content:quality` passed with `Content validation passed: 460 category B fallback questions, 276 local image references, full content quality gate enabled.`
- Local check bundle on 2026-05-10: `node scripts/content-shards.mjs --check-indexes`, `pnpm run validate:content`, `pnpm run validate:content:quality`, `pnpm run test`, and `pnpm run build` passed. `pnpm run test` passed `90` tests. `pnpm run build` passed with the pre-existing Vite large chunk-size warning.
- First `pnpm run preflight` attempt on 2026-05-10 reached Playwright but failed because the command's own `vite preview --port 4903` process remained listening after the nested e2e startup conflict. The stale process was identified as `/Users/chap/devel/cabadrive-009-ticket-image-metadata-intake/node_modules/.bin/../vite/bin/vite.js preview --host 0.0.0.0 --port 4903 --strictPort` and stopped before retry.
- Final `pnpm run preflight` retry on 2026-05-10 passed: feature-memory gate, repository baseline check, structural content validation, `90` unit tests, production build, and `14` Playwright e2e tests passed.
- `git diff --check` passed on 2026-05-10 with no whitespace errors.
- Validator/test update on 2026-05-10: `scripts/content-image-metadata.mjs` now includes `relevanceMap` and `questionContext` in usage fingerprints, rejects global relevance keys in shared image metadata, validates relevance-map roles/references, and rejects mark-everything-critical mappings in the full-quality gate.
- Draft-generator guard on 2026-05-10: `scripts/generate-learning-support.mjs` now exits unless called with `--allow-draft-overwrite`; reviewed content integration uses `node scripts/content-shards.mjs --write-indexes` plus `pnpm run refresh:content-evidence` instead.
- Frontend docs boundary update on 2026-05-10: `docs_project/project/frontend/frontend-docs.md` now records that future highlight/dim overlays consume question-specific feature `009` usage relevance and must not infer importance from shared image metadata alone.
- Finalization loop on 2026-05-10 after Orchestrator ping: `node scripts/content-shards.mjs --check-indexes` passed with `Generated content indexes are fresh.`; `pnpm run validate:content` passed with `Content validation passed: 460 category B fallback questions, 276 local image references.`; `pnpm run validate:content:quality` passed with `Content validation passed: 460 category B fallback questions, 276 local image references, full content quality gate enabled.`; `pnpm run test` passed with `90` tests, `90` pass, `0` fail; `pnpm run build` passed with the existing Vite large chunk-size warning and generated a service worker with `280` cached assets; `pnpm run test:e2e` passed with `14` tests; `pnpm run preflight` passed with feature-memory gate, repository baseline check, structural content validation, `90` unit tests, production build, and `14` Playwright e2e tests.
- AI Review fix loop on 2026-05-10 for PR #63 comments `3214912010`, `3214912012`, and `3214909890`: Implementation Agent added real `relevanceId` values to all missing relevance-map entries, added `high|medium|low` confidence values to all relevance-map entries that lacked them, made the full-quality image usage gate require a real `relevanceId` and confidence instead of accepting `targetId` as a substitute, added regression tests for both failures, enforced image metadata shard ownership by the lowest-numbered question usage, added a regression test for shared-image metadata moved into a later shard, regenerated generated indexes, and refreshed deterministic learning-support evidence.
- AI Review fix verification on 2026-05-10: relevance-map audit returned `972` total entries with `0` missing `relevanceId` and `0` missing confidence after updating `185-276` and `369-460`; `node scripts/content-shards.mjs --write-indexes`, `pnpm run refresh:content-evidence`, `node scripts/content-shards.mjs --check-indexes`, `pnpm run validate:content`, `pnpm run validate:content:quality`, `pnpm run test`, `pnpm run build`, `pnpm run preflight`, and `git diff --check` passed. `pnpm run test` passed `103` tests; `pnpm run preflight` passed feature-memory gate, repository baseline check, structural content validation, `103` unit tests, production build, and `18` Playwright e2e tests. Vite emitted only the existing large chunk-size warning.
- AI Review fix loop on 2026-05-10 for PR #63 thread `PRRT_kwDOSX65IM6A5wjy` / comment `3214937690`: Implementation Agent removed usage-level answer-critical detail IDs from the validator's allowed image detail set and added a regression test proving the full-quality gate rejects `answerCriticalDetails` whose `detailId` is not present in shared image metadata.
- AI Review fix verification on 2026-05-10 for thread `PRRT_kwDOSX65IM6A5wjy`: `node --test tests/content-image-metadata.test.mjs` passed with `13` tests; `pnpm run validate:content:quality` passed with `Content validation passed: 460 category B fallback questions, 276 local image references, full content quality gate enabled.` The command `pnpm test -- tests/content-image-metadata.test.mjs` was attempted first but is not a valid repo invocation because the package script expands to `node --test tests/*.test.mjs -- tests/content-image-metadata.test.mjs` and Node treats `--` as a file path.
- AI Review fix loop on 2026-05-10 for PR #63 thread `PRRT_kwDOSX65IM6A5yqd` / comment `321494866`: Implementation Agent added `regions` and `visualDetails` to the image metadata fingerprint tuple, added a regression test proving both fields change `imageMetadataFingerprint` and generated `metadataSha256` and stale evidence mismatch detection, refreshed deterministic learning-support evidence, and confirmed no other validator-used image-level visual facts were missing from the tuple.
- AI Review fix verification on 2026-05-10 for thread `PRRT_kwDOSX65IM6A5yqd`: `pnpm run refresh:content-evidence` passed with `Refreshed learning-support evidence: 275 images, 276 usages, 460 translations, 460 explanations.`; `node scripts/content-shards.mjs --check-indexes` passed with `Generated content indexes are fresh.`; `node --test tests/content-image-metadata.test.mjs` passed with `14` tests; `pnpm run validate:content:quality` passed with `Content validation passed: 460 category B fallback questions, 276 local image references, full content quality gate enabled.`; `pnpm run validate:content` passed with `Content validation passed: 460 category B fallback questions, 276 local image references.`; `pnpm run test` passed with `106` tests; `pnpm run build` passed and generated the service worker with only the existing Vite large chunk-size warning; `pnpm run preflight` passed with feature-memory gate, repository baseline check, structural content validation, `106` unit tests, production build, and `18` Playwright e2e tests; `git diff --check` passed.
- Mergeability update on 2026-05-10 after merging `origin/main`: `node scripts/content-shards.mjs --write-indexes` regenerated stale compatibility indexes; `node scripts/refresh-learning-support-evidence.mjs` passed with `Refreshed learning-support evidence: 275 images, 276 usages, 460 translations, 460 explanations.`; `node scripts/content-shards.mjs --check-indexes` passed with `Generated content indexes are fresh.`
- Mergeability verification on 2026-05-10 after conflict resolution: `pnpm run validate:content:quality` passed with `Content validation passed: 460 category B fallback questions, 276 local image references, full content quality gate enabled.`; `pnpm run validate:content` passed with `Content validation passed: 460 category B fallback questions, 276 local image references.`; `pnpm run test` passed with `112` tests; `pnpm run build` passed and generated a service worker with `280` cached assets, with only the existing Vite large chunk-size warning.
- Mergeability preflight on 2026-05-10 after updating the dual-topic materials e2e expectation for complete 009 translations: `pnpm run preflight` passed with feature-memory gate, repository baseline check, structural content validation, `112` unit tests, production build, and `22` Playwright e2e tests across chromium/mobile; `git diff --check` passed with no whitespace errors.
- Feature 019 post-merge closure audit on 2026-05-10: `git log origin/main --oneline --decorate --max-count=20` showed `78e0176` at `origin/main`; `git show --stat --oneline --decorate --max-count=1 78e0176e361eeea583dd797296bfa994b3f1f695` confirmed PR #63 merged feature 009 content, validators, docs, tests, and process memory; `gh pr view 63 --repo cucumberfalse/cabadrive --json number,title,state,isDraft,mergeCommit,headRefName,baseRefName,mergedAt,statusCheckRollup,url,headRefOid,reviewDecision,mergeStateStatus` returned PR #63 `MERGED`, `isDraft: false`, base `main`, head `codex/009-ticket-image-metadata-intake`, final head `3d49a66b1972ef4950a70b41a35e17fc4a03f215`, merged at `2026-05-10T14:10:41Z`, merge commit `78e0176e361eeea583dd797296bfa994b3f1f695`, and successful check rollup entries for `AI Review`, `baseline-checks`, `docker-validation`, `guard`, and `osv-scan`; `gh pr checks 63 --repo cucumberfalse/cabadrive` returned `AI Review pass 4m2s`, `baseline-checks pass 1m14s`, `docker-validation pass 22s`, `guard pass 8s`, and `osv-scan pass 18s`. The same evidence closes T121 because PR #63 merged only after non-draft state, passed AI Review, passed required checks, resolved review threads, no conflicts, and recorded T099-T102/T109-T111/T114-T120/T163-T166 evidence; T098 is outside the T121 condition.
- Feature 019 PR #63 review closure audit on 2026-05-10: `gh api repos/cucumberfalse/cabadrive/pulls/63/reviews` showed earlier blocking Review Agent comments on `845eb6b8bba502333fa673b4738e8a962beeb2e2` and `27ac08664f3f051a3aebf4c3fd1fa14569234038`, followed by automated Codex Review runs on `9437d70a3728c6f4ff566c574eab477ebf76e0df` and `5c971b601d64ac0006c895d92f53e6ef3bae3d1d`; `gh api repos/cucumberfalse/cabadrive/issues/63/comments` showed Orchestrator audit comment `4415464185` for head `064cce4c6b7950c3eee05af1860722653ff23fac`, recording completed reviewed image metadata, Russian translations, and Russian explanations across all 460 tickets; real `relevanceId` plus `high|medium|low` confidence for every relevance entry; shared-image shard ownership; grounded `answerCriticalDetails`; `regions` and `visualDetails` in `metadataSha256`; fresh evidence, `node scripts/content-shards.mjs --check-indexes`, `pnpm run validate:content:quality`, targeted metadata tests, full unit tests, build, e2e, and `pnpm run preflight`; independent Review Agent confirmation of 460 translations, 460 explanations, 275 images, 276 image usages, 972 relevance entries, and zero missing relevance IDs/confidence. The same comments endpoint showed final Codex Review no-major-issues comments `4415464585` and `4415485365`, and the GraphQL `reviewThreads(first:100)` audit returned 7 review threads, all `isResolved: true`.
- Feature 019 local content/relevance audit on 2026-05-10: a Node count query returned `questions=460`, `translations=460`, `explanations=460`, `imageRefs=276`, `uniqueImages=275`, `images=275`, `questionUsages=276`, `relevanceEntries=972`, `missingRelevanceId=0`, `missingConfidence=0`, and `sharedRelevanceKeys=0`. A shard status query returned all five `content/translations/ru/*.json`, all five `content/explanations/ru/*.json`, and all five `content/image-metadata/question-images/*.json` shards as `qualityStatus: complete`. A reused-image query returned one reused image, `question-image-b2`, with separate `b-fallback-256` and `b-fallback-303` usages. An unused-image query returned `images=275`, `usedImages=275`, `unusedImages=0`, and `unusedWithRelevance=0`.
- Feature 019 durable-docs lifecycle audit on 2026-05-10: `rg -n "Adding|Changing|Deleting|add.*ticket|change.*ticket|delete.*ticket|overlay|relevance|shared image metadata|generated indexes|evidence refresh|validation" docs_project/project/content-sources.md docs_project/project/backend/backend-docs.md docs_project/project/frontend/frontend-docs.md docs/specify/04_data_model.md docs/specify/05_content_pipeline.md` found add/change/delete lifecycle coverage in `docs_project/project/content-sources.md`, overlay/relevance refresh and shared-image cleanup rules in `docs_project/project/content-sources.md` and `docs/specify/05_content_pipeline.md`, feature `010` question-specific relevance handoff in `docs_project/project/frontend/frontend-docs.md`, shared metadata question-neutrality in `docs/specify/04_data_model.md`, and full-quality backend gate coverage in `docs_project/project/backend/backend-docs.md`.
- Feature 019 T098 disposition on 2026-05-10: no direct evidence was found for the specific local runtime smoke sequence `make down`, `make build`, `make up`, HTTP/browser smoke at `http://localhost:5173`, and `make down`. PR #63 had green CI `docker-validation`, but T098 remains open because this process-memory-only closure cannot honestly claim the exact local Docker smoke was executed.

### Implementation Agent Feedback

- Implementation Agent feedback said future human copy-editing of rule-based Russian translations could be optional before a broader public release.
- Review Agent blockers showed that generated/count coverage can still leave placeholder metadata, generic image usage, and non-Russian translation residue.

### Architect Disposition Of Feedback

- Disposition: Russian translation quality review is no longer optional for this feature. All 460 question translations and all answer translations must be idiomatic, complete Russian and must pass hard gates before merge readiness.
- Disposition: image metadata generated from ticket wording, answer keys, topic-guide rationales, or generic source-image cues is acceptable only as draft scaffolding. Final approved metadata must come from actual image review and be detailed enough for close recreation.
- Disposition: explanation coverage by deterministic fallback text is acceptable only as draft scaffolding. Final approved explanations must be ticket-specific, answer-specific, and image-specific where applicable.
- Disposition: the Review Agent P1 findings are accepted as blocking architecture requirements. Implementation must address them through content changes, validator/test gates, evidence updates, and a fresh Review Agent pass.
- Disposition: Orchestrator must not mark PR #63 or any successor PR ready for merge while draft, with skipped AI Review, with pending T099-T102/T109-T111/T114-T120/T163-T166, or with unresolved blocking findings.
- Disposition: Analyst clarification about one-time parallel content agents is accepted. Implementation must use range-owned content-agent review for image metadata, translations, and explanations before final quality approval.
- Disposition: Analyst clarification about ticket lifecycle docs is accepted. Durable docs update is required for final readiness and must cover add/change/delete flows plus shared-image cleanup semantics.
- Disposition: Analyst clarification about branch `010` overlay dependency is accepted. Implementation must make `009` metadata/usage rich enough for future highlight/dim overlays through stable object/detail/region references and question-specific relevance roles, while leaving rendering decisions to `010`.
- Disposition: Content agents currently paused for image metadata/usage must produce relevance mappings, not just prose descriptions or flat critical booleans.
- Disposition: The 2026-05-10 question-scoped relevance clarification is accepted. Shared image metadata may describe only visible facts, regions, relationships, annotations, and uncertainty. Implementation must move or remove any global importance/relevance semantics from shared metadata and keep roles only in per-question usage.
- Disposition: Feature `010` overlay implementation must consume completed `009` per-question usage/relevance and must not infer relevance from shared metadata alone.

### Review Notes

- Future Review Agent should verify that any implementation PR updates this process memory with exact evidence rather than only a prose summary.
- Future Review Agent should verify that any full-coverage claim is backed by validator output against the current question file, not hard-coded counts alone.
- Future Review Agent should inspect high-risk image metadata manually, including `b-fallback-001`, duplicated images, hand signals, traffic signs, and lane markings.
- Future Review Agent should inspect representative non-`b13.jpg` images for full visual metadata quality and reject records that could not recreate a close image.
- Future Review Agent should inspect representative translations, including `b-fallback-011`, for Spanish residue, transliteration, wrappers, and dropped answer-critical meaning.
- Future Review Agent should inspect representative explanations for correct-answer rationale, wrong-answer rationales, image-aware rationale where applicable, and generic filler.
- Future Review Agent should inspect content-agent range evidence for every image, translation, and explanation shard in scope and verify no agent edited outside its assigned range.
- Future Review Agent should inspect durable docs for ticket lifecycle coverage: add/change analysis requirements, delete cleanup requirements, evidence/index refresh, validation, and shared image metadata reference checks.
- Future Review Agent should inspect image-backed usage mappings for stable object/detail/region references, answer-critical/highlight details, supporting/distractor/background roles, no mark-everything-critical behavior, and enough irrelevant context to support future dimming.
- Future Review Agent should verify the `009`/`010` boundary: `009` provides question-neutral shared visible-detail IDs plus question-specific usage/relevance roles; `010` handles overlay rendering without becoming the source of answer-critical truth.
- Future Review Agent should reject any shared image metadata, generated index, evidence record, or overlay handoff that encodes global important/unimportant/critical/relevance flags outside per-question usage.
