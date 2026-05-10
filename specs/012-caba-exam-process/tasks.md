# Tasks: Russian CABA License Exam Process Guide

## Architect Planning Setup

- [x] T001 Confirm assigned worktree is `/Users/chap/devel/cabadrive-012-exam-process-intake`.
- [x] T002 Confirm active branch is `codex/012-exam-process-intake`.
- [x] T003 Read `.specify/memory/constitution.md`.
- [x] T004 Read `docs_project/README.md`.
- [x] T005 Read `docs_project/project-idea.md`.
- [x] T006 Read `docs_project/project/frontend/frontend-docs.md`.
- [x] T007 Read `docs_project/project/backend/backend-docs.md`.
- [x] T008 Read `docs_project/project/feature-inventory.md`.
- [x] T009 Read `docs_project/screens/learning-and-exam-flows.md`.
- [x] T010 Read `docs/specify/README.md`.
- [x] T011 Read `specs/012-caba-exam-process/feature-request.md`.
- [x] T012 Inspect relevant source/data context only: `src/data/content.ts`, `src/App.tsx`, and `docs_project/project/content-sources.md`.
- [x] T013 Inspect recent feature-memory examples for local planning style.

## Architect Artifacts

- [x] T014 Create `spec.md` with goal, scope, non-goals, assumptions, open-question dispositions, user stories, acceptance criteria, negative scenarios, functional requirements, verification requirements, and review requirements.
- [x] T015 Create `plan.md` with source-currentness rules, first-slice architecture, bundled content strategy, implementation guidance, test matrix, docs requirements, risks, and handoff.
- [x] T016 Create this `tasks.md` with implementation checklist, review checklist, verification requirements, and process memory sections.

## Implementation Prerequisites

- [x] T017 Confirm implementation starts from complete feature memory: `feature-request.md`, `spec.md`, `plan.md`, and `tasks.md`.
- [x] T018 Confirm implementation uses an Orchestrator-assigned isolated worktree and branch for product changes.
- [x] T019 Re-read `spec.md`, `plan.md`, and this `tasks.md` before editing product files.
- [x] T020 Confirm no parallel dirty diffs, branches, commits, PRs, or process memory are overwritten.

## Source Recheck And Content Decisions

- [x] T021 Recheck current official GCBA `Otorgamiento de Licencia de Conducir` page and record checked date/result.
- [x] T022 Recheck current official GCBA `Extranjeros` page and record checked date/result.
- [x] T023 Recheck current official GCBA `Curso de Educación Vial para Otorgamiento de Licencia` page and record checked date/result.
- [x] T024 Recheck current official GCBA `Material de estudio para examen teórico` page and record checked date/result.
- [x] T025 Recheck current official GCBA `Examen práctico` page and record checked date/result.
- [x] T026 Recheck current official GCBA `Pista de aprendizaje para conductores` page and record checked date/result.
- [x] T027 Recheck current official GCBA `CENAT` page and record checked date/result.
- [x] T028 Recheck current official ANSV/Gobierno Argentino CENAT payment page and record checked date/result.
- [x] T029 Recheck current official GCBA `Principiantes` page and record checked date/result.
- [x] T030 Recheck the April 2025 GCBA `Manual de Procedimientos` only if manual-backed psychophysical, validity, exception, or deep procedural claims are included.
- [x] T031 Record any official-source changes from the 2026-05-10 Analyst intake and update content or record blocker/disposition.
- [x] T032 Decide whether exact volatile fee values will be omitted or shown as dated values with warnings; record decision.
- [x] T033 Decide whether community observations are visible or only used to shape glossary/warnings; record decision.
- [x] T034 Decide whether images are included. If included, complete license, attribution, privacy, currentness, and local-asset review for each image. If omitted, record why.

## Content Model And Validation

- [x] T035 Choose structured bundled content location, likely `content/guide/caba-exam-process.ru.json`, or record an alternate local content decision.
- [x] T036 Model guide metadata: id, version, locale, status, content status, primary B1/private car `Otorgamiento` scope, last reviewed date, disclaimer, and official-action warning.
- [x] T037 Model official source references with title, URL, checked date, owner, and currentness/status.
- [x] T038 Model process sections with Russian prose, Spanish terms, source IDs, callout type, and volatility fields where applicable.
- [x] T039 Model official link groups by user task/action.
- [x] T040 Model glossary terms with Spanish term, Russian translation, Russian explanation, and source IDs where relevant.
- [x] T041 Model adjacent-path callouts for renewal/change of jurisdiction/beginner/foreigner/prior-license topics only where source-backed.
- [x] T042 If images are included, model local path, alt text, caption, source URL, license, attribution, checked date, and privacy review status.
- [x] T043 Import the guide content through `src/data/content.ts` or another established local data boundary.
- [x] T044 Add TypeScript types for the UI-facing guide content.
- [x] T045 Add unit/data validation for required guide fields if a new content model is introduced.
- [x] T046 Validate that source IDs referenced by sections/glossary/images exist.
- [x] T047 Validate that major claim sections include source IDs and checked dates.
- [x] T048 Validate that volatile sections cannot appear without volatility warning/status or official-link pointer.
- [x] T049 Validate optional image metadata if images are included.

## UI Implementation Slice

- [x] T050 Decide navigation placement: distinct `Процесс`/`Права в CABA` view or a clearly reachable `Материалы` subsection; record decision.
- [x] T051 Add the guide navigation entry without removing existing learning, exam, mistakes, vocabulary, materials, or CABA/RF flows.
- [x] T052 Render the process guide as the first useful screen, not a marketing landing page.
- [x] T053 Show the guide's B1/private car `Otorgamiento` scope near the top.
- [x] T054 Show visible Russian unofficial-support disclaimer and official-action warning near the top.
- [x] T055 Show guide last-reviewed/check date.
- [x] T056 Render the primary official step flow in Russian with Spanish terms visible.
- [x] T057 Render official source title/link/checked-date labels for major claim groups.
- [x] T058 Render volatile warnings for fees, sedes, turn availability, Boti/miBA screens, CENAT amount, BUI amount, and document-list details when mentioned.
- [x] T059 Render foreigner documentation as conditional caveats with official links, not a universal checklist.
- [x] T060 Render the required course section with only current source-backed duration, modality, validity, and CABA-validity caveats.
- [x] T061 Render theory-exam relation at high level and link official study material without duplicating the theory trainer.
- [x] T062 Render psychophysical section as procedural expectation only, with no medical advice.
- [x] T063 Render practical car exam section with source-backed street format, approximate duration, same-day license outcome when approved, and reattempt rule.
- [x] T064 Render "where" section for official locations/practice resources only where source-backed.
- [x] T065 Render adjacent-path callouts compactly and with direct official links.
- [x] T066 Render official links grouped by task/action.
- [x] T067 Render Spanish terms/phrases glossary with Russian explanations.
- [x] T068 Render community-derived cautions only if explicitly labeled unofficial/anecdotal/stale-risk.
- [x] T069 If images are included, render only local assets with attribution and source/caption metadata.
- [x] T070 Ensure no raw PDF viewer, runtime network fetch, remote image, backend endpoint, or online API is introduced.
- [x] T071 Preserve active exam mode behavior and current study/exam/mistakes/vocabulary/materials/CABA-RF flows.
- [x] T072 Update CSS only as needed for the guide, keeping mobile text wrapping and no overflow.

## Durable Docs

- [x] T073 Update `docs_project/screens/learning-and-exam-flows.md` if navigation or learner flow changes.
- [x] T074 Update `docs_project/project/frontend/frontend-docs.md` if the new process-guide data/UI surface becomes part of the frontend baseline.
- [x] T075 Update `docs_project/project/feature-inventory.md` if the guide becomes an implemented feature.
- [x] T076 Update `docs_project/project/content-sources.md` if source/archive/image governance or maintenance expectations change.
- [x] T077 Record if no durable docs update is needed and why.

## Tests And Evidence

- [x] T078 Add unit/data validation coverage if a new content model is introduced.
- [x] T079 Add Playwright coverage that the process guide is reachable from navigation.
- [x] T080 Add Playwright coverage that existing learning, exam, mistakes, vocabulary, materials, and CABA/RF navigation remain reachable as applicable.
- [x] T081 Add Playwright coverage that B1/private car `Otorgamiento` scope and unofficial-support labels are visible.
- [x] T082 Add Playwright coverage that official source titles, checked dates, and links are visible for major claim groups.
- [x] T083 Add Playwright or unit/data coverage that volatile details are labeled or omitted according to the content decision.
- [x] T084 Add coverage that Spanish glossary terms and Russian explanations render.
- [x] T085 Add coverage that psychophysical and practical-exam sections render.
- [x] T086 Add request-monitoring evidence that browsing the guide makes no external runtime requests.
- [x] T087 Add coverage that no raw PDF viewer is present.
- [x] T088 If images are included, add coverage that local image assets render with attribution and without external image requests.
- [x] T089 Run `pnpm run validate:content`.
- [x] T090 Run `pnpm run test`.
- [x] T091 Run `pnpm run build`.
- [x] T092 Run `pnpm run test:e2e`.
- [x] T093 Run `pnpm run preflight`.
- [x] T094 Run `git diff --check`.
- [x] T095 Record command evidence, source-currentness evidence, screenshots if useful, and exact unrelated blockers in Process Memory below.

## Review Agent Checklist

- [x] T096 Review Agent confirms the implementation stays within the conservative `012` slice.
- [x] T097 Review Agent confirms official sources outrank community context in copy and metadata.
- [x] T098 Review Agent confirms major process claims have official links and checked dates.
- [x] T099 Review Agent confirms volatile fees/sedes/turns/forms are dated/labeled or omitted.
- [x] T100 Review Agent confirms no legal, immigration, medical, or individualized procedural advice is introduced.
- [x] T101 Review Agent confirms foreigner/prior-license/beginner notes are conditional and source-backed.
- [x] T102 Review Agent confirms no runtime network fetch, remote image, raw PDF viewer, backend, scraping, or monitor was introduced.
- [x] T103 Review Agent confirms images, if included, are local, attributed, license-safe, and free of private/personal data.
- [x] T104 Review Agent confirms tests and verification evidence are recorded.
- [x] T105 Review Agent confirms durable docs were updated where behavior or source policy changed.

## PR Readiness

- [x] T106 Confirm implementation PR has a single assigned slice.
- [x] T107 Confirm `tasks.md` process memory is current before review.
- [x] T108 Confirm any Implementation Agent feedback items are recorded for Architect disposition.
- [x] T109 Confirm no out-of-scope product/content/source changes are included.
- [x] T110 Confirm no blocking review findings remain.
- [ ] T111 Confirm required checks are green after push/PR.
- [x] T112 Confirm the PR has no unresolved merge conflicts.
- [ ] T113 Leave only final human approval or merge mechanics remaining.

## Process Memory

### Architect Decisions

- First implementation slice is limited to CABA B1/private car `Otorgamiento de Licencia de Conducir`.
- Adjacent paths may appear only as compact, source-backed callouts with official links.
- Official GCBA/ANSV/Gobierno Argentino sources outrank community reports for every requirement, price, step, location, and exam rule.
- Community context may shape glossary/warnings but must remain unofficial/anecdotal if shown.
- Bundled structured content is preferred over hard-coded prose because source metadata, checked dates, volatile fields, and glossary terms need validation.
- Exact volatile values should be omitted or shown only as dated values with direct official verification links.
- Psychophysical content must stay procedural and must not provide medical advice.
- Foreigner/prior-license/beginner content must stay conditional and source-backed.
- Images are optional; no images is acceptable if licensing/attribution/privacy/currentness review is not clean.
- Durable docs should be updated only if implemented navigation, content-source behavior, image governance, or source-maintenance expectations change.

### Architect Context Evidence

- Worktree check showed `/Users/chap/devel/cabadrive-012-exam-process-intake` on `codex/012-exam-process-intake`.
- Initial status showed `specs/012-caba-exam-process/` as untracked with existing Analyst intake.
- Required repository memory and `specs/012-caba-exam-process/feature-request.md` were read before writing Architect artifacts.
- `src/data/content.ts` currently serves as the app's bundled content import boundary.
- `src/App.tsx` currently uses local React view state and local bundled content, matching a conservative additive guide view.
- `docs_project/project/content-sources.md` requires official archive content to remain separate from Russian learning prose and includes currentness/effective-status expectations.

### Source Recheck Evidence

- 2026-05-10: Copied complete feature memory from `/Users/chap/devel/cabadrive-012-exam-process-intake/specs/012-caba-exam-process/` into this implementation worktree before product edits.
- 2026-05-10: Implementation worktree confirmed as `/Users/chap/devel/cabadrive-012-caba-exam-process` on branch `codex/012-caba-exam-process`; initial dirty status contained only the copied untracked `specs/012-caba-exam-process/` folder.
- 2026-05-10: Rechecked GCBA `Otorgamiento de Licencia de Conducir` at `https://buenosaires.gob.ar/tramites/otorgamiento-de-licencia-de-conducir`. Result: page redirects through `gcaba_historico` but is current GCBA content; confirmed first license / expired more than one year, 180-day completion window, miBA, DNI/CABA/foreigner caveats, CENAT, online personal data and DDJJ, course, turno/sede/BUI, psychophysical areas, theory, B1 practical, sedes, and volatile fee display.
- 2026-05-10: Rechecked GCBA `Extranjeros` at `https://buenosaires.gob.ar/licenciasdeconducir/casosespeciales/extranjeros`. Result: current GCBA content via `gcaba_historico`; confirmed printed requirements and distinct permanent, temporary, DNI expired with active disposition, precaria, and no-DNI/precaria cases. Content keeps this conditional and avoids a universal foreigner checklist.
- 2026-05-10: Rechecked GCBA `Curso de Educación Vial para Otorgamiento de Licencia` at `https://buenosaires.gob.ar/gcaba_historico/infraestructura/movilidad/curso-de-educacion-vial-para-otorgamiento-de-licencia`. Result: confirmed obligatory course for first license / expired more than one year, email within 48 hours after data verification, virtual with teacher or in-person at Sede Roca, Monday-to-Monday booking, 3-hour duration, one-year validity, CABA-validity caveat.
- 2026-05-10: Rechecked GCBA `Material de estudio para examen teórico` at `https://buenosaires.gob.ar/licenciasdeconducir/curso-de-educacion-vial-para-otorgamiento-de-licencia/material-de-estudio-para`. Result: current GCBA content via `gcaba_historico`; confirmed multiple choice, 45 minutes, and four-wheel urban vehicle manual for cars.
- 2026-05-10: Rechecked GCBA `Examen práctico` at `https://buenosaires.gob.ar/gcaba_historico/gobierno/licencias-de-conducir/examen-practico`. Result: confirmed B1 car practical in street with dual-control cars, monitored/controlled route, 200/300 m around communal seat, approximately 15 minutes, same-day license if approved, two more attempts with 5 days between failed attempt and new turno, restart/pay new turn after all attempts fail.
- 2026-05-10: Rechecked GCBA `Pista de aprendizaje para conductores` at `https://buenosaires.gob.ar/infraestructura/movilidad/pistadeaprendizaje`. Result: current GCBA content via `gcaba_historico`; confirmed optional practice track for CABA residents, car/moto, DNI for driver and learner, prior turno, 45 minutes, 15-day agenda visibility, daily opening, Av. Cnel. Roca 5050/5500 area.
- 2026-05-10: Rechecked GCBA `Certificado Nacional de Antecedentes de Tránsito (CENAT)` at `https://buenosaires.gob.ar/certificado-nacional-de-antecedentes-de-transito-cenat`. Result: current GCBA content via `gcaba_historico`; confirmed CENAT is mandatory for DGHC procedures, required to start the license request, and not part of each class fee.
- 2026-05-10: PR #72 review fix rechecked GCBA `Certificado Nacional de Antecedentes de Tránsito (CENAT)` and ANSV/Mi Argentina `Boleta de Pago (CENAT)`. GCBA's official `Generar la boleta de pago del CENAT` link points to `https://boletadepago.seguridadvial.gob.ar/`, whose page title is `Boleta de Pago (CENAT)` with ANSV/Mi Argentina footer. Result: corrected the guide and validator allowlist to use the `.gob.ar` endpoint for official CENAT payment; the previous non-.gob.ar intake/recheck URL is treated as stale/not used for user-facing payment actions.
- 2026-05-10: Rechecked GCBA `Principiantes` at `https://buenosaires.gob.ar/tramites/otorgamiento-de-licencia-de-conducir/casos-especiales/casosespeciales/principiantes`. Result: current GCBA content via `gcaba_historico`; confirmed first A/A4/B1 beginner condition, six months, up to two years habilitation subject to psychophysical results, >70 km/h road restriction, alcohol cero in CABA, and prior-license seniority exception.
- 2026-05-10: Rechecked GCBA `Renovación por Cambio de Jurisdicción` at `https://buenosaires.gob.ar/tramites/renovacion-por-cambio-de-jurisdiccion`. Result: current GCBA content via `gcaba_historico`; used only for adjacent-path callout.
- 2026-05-10: Rechecked GCBA `Manual de Procedimientos, abril 2025` at `https://documentosboletinoficial.buenosaires.gob.ar/publico/PE-DIS-SECGVC-DGHC-562-25-ANX.pdf`. Result: official PDF opens; included as an official link only, with no raw PDF viewer and no deep manual-backed medical/legal prose in the guide.
- 2026-05-10: No material official-source changes from Analyst intake required a blocker. Current official pages still show volatile fee values; implementation omits exact fee values from learner prose and directs users to official GCBA/ANSV pages.

### Image Licensing Decisions

- Decision: no images included in this first slice.
- Rationale: official GCBA page content is generally Creative Commons Reconocimiento 2.5 Argentina, and the practical-exam page exposes official images, but the guide is already complete without images. Omitting images avoids asset-specific currentness/privacy/attribution risk and avoids introducing new local assets that require additional review. Playwright verifies `.process-view img` count is zero and no external image requests occur.

### Implementation Decisions

- Structured content lives in `content/guide/caba-exam-process.ru.json` and is imported through `src/data/content.ts`.
- Added `scripts/content-caba-exam-process.mjs` and integrated it into `scripts/validate-content.mjs` so source metadata, checked dates, official URL allowlist, required source IDs, required sections, source references, volatile warning coverage, glossary terms, and optional image metadata are validated.
- PR #72 review fix updates the CENAT payment allowlist to `https://boletadepago.seguridadvial.gob.ar/` and adds a unit assertion that the shipped guide no longer contains the stale non-.gob.ar CENAT payment domain.
- Added a top-level `Процесс` view instead of hiding the guide under `Материалы`, because the content is procedural and broader than theory topic materials. Existing `Учить`, `Экзамен`, `Ошибки`, `Словарь`, `Материалы`, and `CABA/RF` views remain reachable.
- Exact BUI/CENAT fee amounts are omitted from user-facing evergreen guide sections. Source metadata records that official pages showed current volatile amounts during recheck, but users are directed to official pages before payment.
- Community context is visible only as a small caution block about stale prices/screenshots and confusing words; it is not used as a procedural source.
- Psychophysical content is limited to official procedural expectations and avoids eligibility, diagnosis, treatment, or document-specific advice.
- Durable docs updated because navigation, implemented feature inventory, frontend content behavior, and content-source expectations changed.

### Dead Ends

- Initial `pnpm run build` failed because this isolated worktree had no `node_modules` and `vite` was not found. Ran `pnpm install`; lockfile was already up to date and no package files changed. Build passed afterward.
- Initial content validator wording was too broad and flagged the official procedural mention of treatment/certificates as medical advice. Tightened the validator to block eligibility/advice phrases while allowing procedural source-backed wording.
- Initial Playwright assertion for `GCBA: Examen práctico` was too broad because the same official source appears in two relevant sections. Scoped the assertion to the practical-exam section; e2e passed afterward.

### Known Issues

- Official fees, sedes, appointment availability, Boti/miBA screens, CENAT amount, and document requirements are volatile.
- GCBA pages may use `gcaba_historico` URLs while still being surfaced as current official pages; implementation must record currentness checks.
- Russian prior-license seniority and `certificado de legalidad` handling can be user-important but should not become Russia-specific guidance without a dedicated source-verification slice.
- Psychophysical details can become medical advice if phrased too confidently.
- Images can easily become stale or unsafe if sourced from screenshots or pages containing personal data.

### Verification Evidence

- 2026-05-10 process-memory follow-up for PR #72: Codex Review for head `4fa9cc1177f7f12d46e6155b012fdeeeb435d68b` reported no findings. The prior CENAT P1 review thread is resolved/outdated after the `.gob.ar` CENAT payment endpoint correction, so no blocking review findings remain.
- 2026-05-10 process-memory follow-up for PR #72: `gh pr view 72 --json mergeable,mergeStateStatus,headRefOid,statusCheckRollup,reviewDecision,url` reported head `4fa9cc1177f7f12d46e6155b012fdeeeb435d68b`, `mergeable: MERGEABLE`, and `mergeStateStatus: UNSTABLE`. This confirms no unresolved merge conflicts; T111 and T113 remain open because required checks are not green.
- 2026-05-10 process-memory follow-up for PR #72: GitHub Actions required checks `baseline-checks`, `docker-validation`, `guard`, and `osv-scan` still fail before job execution with the annotation `The job was not started because recent account payments have failed or your spending limit needs to be increased...`. This is an external GitHub billing/spending-limit blocker, not a code failure; local validation evidence remains green below.
- `pnpm run validate:content` passed on 2026-05-10: `Content validation passed: 460 category B fallback questions, 276 local image references.`
- `pnpm run test` passed on 2026-05-10: 75 node tests passed, including new CABA exam process guide validation tests.
- `pnpm run build` passed on 2026-05-10: Vite production build completed and service worker generated with 280 cached assets. Vite emitted the existing large chunk warning for the bundled app.
- PR #72 review fix: `rg -n "cnatboleta" . -g '!node_modules' -g '!dist'` returned no matches on 2026-05-10 after replacing the stale non-.gob.ar CENAT payment endpoint.
- PR #72 review fix: `pnpm run validate:content` passed on 2026-05-10 after the CENAT payment endpoint correction.
- PR #72 review fix: `pnpm run test` passed on 2026-05-10 with 76 node tests, including the new assertion that the guide uses `https://boletadepago.seguridadvial.gob.ar/`.
- PR #72 review fix: `pnpm run test:e2e` passed on 2026-05-10 with 18 Playwright tests. This command also ran `pnpm run build`, which passed with the existing large chunk warning and generated a service worker with 280 cached assets.
- PR #72 review fix: `git diff --check` passed on 2026-05-10.
- `pnpm run test:e2e` passed on 2026-05-10: 18 Playwright tests passed across chromium and mobile projects, including process guide reachability, scope/status/source/link/glossary rendering, no external requests, no remote images, and no PDF viewer.
- `pnpm run preflight` passed on 2026-05-10: feature-memory gate, repo baseline, content validation, node tests, build, and e2e all passed.
- `git diff --check` passed on 2026-05-10 with no whitespace errors.
- Draft PR opened on 2026-05-10: `https://github.com/cucumberfalse/cabadrive/pull/72`.

### Implementation Agent Feedback

- Potential future slice: exact official fee display could be added only with an explicit dated-value UI pattern and maintenance workflow. For this slice, omission is safer.
- Potential future slice: official images from GCBA practical-exam or Pista pages can be reviewed asset by asset for license, attribution, privacy, currentness, and local offline storage. Not needed for this slice.
- Potential future slice: prior Russian license seniority / certificado de legalidad may deserve a dedicated official-source verification feature; this slice intentionally keeps it as a generic adjacent-path callout.

### Architect Disposition Of Implementation Feedback

- Future dated-fee display maintenance workflow: out of scope and not needed for PR #72. Current PR intentionally omits exact BUI/CENAT fee amounts from evergreen learner prose and points users to official GCBA/ANSV pages because fees are volatile. Future slice candidate: add dated fee display only if it includes an explicit source recheck cadence, owner workflow, stale-state handling, validation, and UI copy that cannot present values as evergreen.
- Future official images: out of scope and not needed for PR #72. Current PR satisfies acceptance without images and records the no-images decision to avoid asset-specific licensing, attribution, privacy, currentness, and offline-storage risk. Future slice candidate: review each proposed GCBA/official image independently before bundling it locally.
- Russian prior-license / `certificado de legalidad` source verification: out of scope and not needed for PR #72. Current PR keeps prior-license and beginner-status material as a generic adjacent-path callout backed by current official sources, and does not publish Russia-specific consular or document instructions. Future slice candidate: create a dedicated source-verification feature before adding Russia-specific guidance.
