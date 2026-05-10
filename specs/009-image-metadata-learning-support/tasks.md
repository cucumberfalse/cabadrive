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
- [ ] T098 If runtime-affecting changes exist, run `make down`, `make build`, `make up`, HTTP/browser smoke test against `http://localhost:5173`, and `make down`.
- [ ] T099 Confirm required checks are green after PR push and AI Review completed on the current head without being skipped: `baseline-checks`, `docker-validation`, `guard`, `AI Review`, `osv-scan`.
- [ ] T100 Confirm no unresolved merge conflicts.
- [ ] T101 Confirm no blocking review findings remain.
- [ ] T102 Confirm the PR is not draft and only final human approval or merge mechanics remain after T099-T101, T109-T111, and T114-T120 are complete.

## Agent Boundaries For Future Work

- [x] T103 Implementation Agent confirms complete feature memory before product edits.
- [x] T104 Implementation Agent uses only the assigned isolated worktree and branch.
- [x] T105 Implementation Agent does not touch other agents' worktrees, branches, or unrelated changes.
- [x] T106 Implementation Agent keeps each PR within the Orchestrator-assigned slice.
- [x] T107 Implementation Agent updates this `tasks.md` with verification evidence and process memory in the same PR.
- [x] T108 Implementation Agent records divergence or improvement feedback here for Architect disposition instead of implementing out-of-scope changes silently.
- [ ] T109 Review Agent reviews against this feature memory, PR diff, and the hard quality gates for full image metadata, translations, and explanations.
- [ ] T110 Review Agent does not edit code, content, docs, tests, scripts, templates, specs, or workflow files while acting as reviewer.
- [ ] T111 Review Agent reports blocking code/content findings as GitHub inline review threads under the repository review contract and records/links content-quality sampling evidence.

## Architect Hard-Gate Update After Review Blockers

- [x] T112 Record current Review Agent P1 blockers as accepted architecture blockers, not optional polish.
- [x] T113 Update `spec.md`, `plan.md`, and this `tasks.md` to state this is not an MVP/placeholder task.
- [ ] T114 Implementation Agent verifies or replaces every approved image metadata entry from actual visual review so it is complete enough for close image recreation and contains no generic/question-derived/source-image-frame/low-confidence-baseline content.
- [ ] T115 Implementation Agent verifies or replaces every question image usage mapping so answer-critical details name actual visible facts and link to current answer reasoning, with no generic source-image or answer-cue placeholders.
- [ ] T116 Implementation Agent verifies or replaces all 460 Russian translations and all answer translations as idiomatic Russian with no untranslated Spanish residue, transliteration, wrappers, glossary drafts, or dropped answer-critical meaning.
- [ ] T117 Implementation Agent verifies or replaces all 460 Russian explanations as complete ticket-specific learning explanations with correct-answer rationale, wrong-answer rationales, and image-specific rationale where applicable.
- [x] T118 Implementation Agent adds or tightens validators/tests to reject low-confidence baseline metadata, generic answer-cue usage, question-derived-only metadata, approved metadata without full visual-review evidence, Spanish residue, transliteration, wrapper translations, and generic explanation filler.
- [ ] T119 Implementation Agent records hard-gate verification evidence by image/translation/explanation range, including reviewer evidence beyond counts and hashes.
- [ ] T120 Review Agent manually samples and inspects content quality for images, translations, explanations, all prior blockers, and generated-pattern risk areas before passing review.
- [ ] T121 Orchestrator keeps PR blocked from ready/merge state while it is draft, AI Review is skipped, any T099-T102/T109-T111/T114-T120 item is pending, or any blocking Review Agent finding remains.
- [x] T122 Implementation Agent shards translation, explanation, and question-image metadata sources into the five assigned ticket ranges so parallel content workers can edit non-overlapping files.
- [x] T123 Implementation Agent updates app imports, validation, and generated compatibility indexes to consume shards deterministically.

## Process Memory

### Decisions

- Architect selected shared image metadata per unique image plus per-question image usage mappings for answer-critical details.
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
- Architect hard-gate update on 2026-05-09: PR readiness requires non-draft status, completed non-skipped AI Review on the current head, green required checks, no merge conflicts, no blocking Review Agent findings, and completed T099-T102/T109-T111/T114-T120.
- Implementation Lead infrastructure pass on 2026-05-09 reverted the rejected uncommitted review-fix product/content/script/test/doc changes while preserving Architect updates in this feature memory, then rebuilt the work as an infrastructure/refactor slice.
- Implementation Lead infrastructure pass on 2026-05-09 introduced five shard ranges for each content area: `001-092`, `093-184`, `185-276`, `277-368`, and `369-460`.
- Implementation Lead infrastructure pass on 2026-05-09 added `scripts/content-shards.mjs` as the deterministic loader/writer. Content workers edit only their assigned shard files, then run `node scripts/content-shards.mjs --write-indexes`.
- Implementation Lead infrastructure pass on 2026-05-09 kept `pnpm run validate:content` as structural offline validation and added `pnpm run validate:content:quality` as the hard content-quality gate. The quality gate is expected to fail until every range is fully reviewed and marked complete.

### Dead Ends

- None during Architect planning.
- No live OCR/LLM/image-captioning path was used because runtime/tests/build/preflight must remain deterministic and offline.

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
- Current range shards are mechanically initialized from the existing generated indexes and are marked `qualityStatus: "needs_full_content_review"`. They are not content-complete and must not be treated as final approved quality.
- `pnpm run validate:content:quality` currently fails by design because content shards are not complete and current translations/explanations/image metadata still contain the known Spanish-residue, generic, placeholder, and review-evidence blockers.

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

### Implementation Agent Feedback

- Implementation Agent feedback said future human copy-editing of rule-based Russian translations could be optional before a broader public release.
- Review Agent blockers showed that generated/count coverage can still leave placeholder metadata, generic image usage, and non-Russian translation residue.

### Architect Disposition Of Feedback

- Disposition: Russian translation quality review is no longer optional for this feature. All 460 question translations and all answer translations must be idiomatic, complete Russian and must pass hard gates before merge readiness.
- Disposition: image metadata generated from ticket wording, answer keys, topic-guide rationales, or generic source-image cues is acceptable only as draft scaffolding. Final approved metadata must come from actual image review and be detailed enough for close recreation.
- Disposition: explanation coverage by deterministic fallback text is acceptable only as draft scaffolding. Final approved explanations must be ticket-specific, answer-specific, and image-specific where applicable.
- Disposition: the Review Agent P1 findings are accepted as blocking architecture requirements. Implementation must address them through content changes, validator/test gates, evidence updates, and a fresh Review Agent pass.
- Disposition: Orchestrator must not mark PR #63 or any successor PR ready for merge while draft, with skipped AI Review, with pending T099-T102/T109-T111/T114-T120, or with unresolved blocking findings.

### Review Notes

- Future Review Agent should verify that any implementation PR updates this process memory with exact evidence rather than only a prose summary.
- Future Review Agent should verify that any full-coverage claim is backed by validator output against the current question file, not hard-coded counts alone.
- Future Review Agent should inspect high-risk image metadata manually, including `b-fallback-001`, duplicated images, hand signals, traffic signs, and lane markings.
- Future Review Agent should inspect representative non-`b13.jpg` images for full visual metadata quality and reject records that could not recreate a close image.
- Future Review Agent should inspect representative translations, including `b-fallback-011`, for Spanish residue, transliteration, wrappers, and dropped answer-critical meaning.
- Future Review Agent should inspect representative explanations for correct-answer rationale, wrong-answer rationales, image-aware rationale where applicable, and generic filler.
