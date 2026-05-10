# Spec: Russian CABA License Exam Process Guide

## Analyst Intake

- Source request: `feature-request.md`.
- Assigned feature: `012-caba-exam-process`.
- Assigned worktree: `/Users/chap/devel/cabadrive-012-exam-process-intake`.
- Assigned branch: `codex/012-exam-process-intake`.
- Architect scope: feature memory only. Product code, tests, runtime files, durable docs outside the assigned feature memory, commits, pushes, PRs, and reviews are out of scope for this Architect pass.

## Goal

Add a Russian-language learner-facing web section that explains the current official CABA driver's license exam process beyond theory preparation, so a low-Spanish Russian-speaking driver can understand what to book, pay, bring, expect, and verify through official GCBA/ANSV links before starting the real procedure.

The first implementation slice should be conservative: focus on CABA `Otorgamiento de Licencia de Conducir` for B1/private car users, and include adjacent-path callouts only when directly source-backed and clearly marked as not fully covered by this slice.

## Scope

In scope for the first implementation slice:

- A bundled local-first Russian process guide section inside the existing React/Vite app.
- Primary procedure: CABA `Otorgamiento de Licencia de Conducir` for B1/private car / non-professional car users.
- Clear user-facing distinction between:
  - official required steps;
  - optional preparation resources;
  - unofficial Russian explanations and community-derived cautions.
- Official links and checked dates for every major claim group.
- Source-backed step flow:
  - decide whether `otorgamiento` is the relevant procedure;
  - check DNI/CABA domicile and foreigner-documentation caveats;
  - use official miBA/Boti/GCBA entry points where source-backed;
  - generate/pay CENAT;
  - complete personal data and `Declaración Jurada` / `DDJJ` where official sources say so;
  - complete required `Curso de Educación Vial`;
  - choose `turno`/`sede` and pay BUI where current official source supports it;
  - attend in person with required documentation;
  - complete psychophysical evaluation;
  - complete theory exam;
  - complete practical car exam;
  - understand pass/fail and reattempt rules.
- Source-backed "where" content for official exam/practice locations, including Sede Central Roca, enabled sedes/subsedes only if official current source supports them, and Pista de Aprendizaje as optional preparation only.
- Psychophysical section limited to source-backed procedural expectations, without medical interpretation or advice.
- Practical car exam section covering the official street-exam format, approximate duration, same-day license outcome when approved, and reattempt rule if failed.
- Spanish administrative terms and phrases with Russian explanations, including at minimum:
  - `Otorgamiento de Licencia de Conducir`;
  - `Renovación`;
  - `Renovación por cambio de jurisdicción`;
  - `Ampliación`;
  - `CENAT`;
  - `BUI`;
  - `miBA`;
  - `Boti`;
  - `turno`;
  - `sede` / `subsede comunal`;
  - `Declaración Jurada` / `DDJJ`;
  - `aptitud psicofísica`;
  - `curso de educación vial`;
  - `examen teórico`;
  - `examen práctico`;
  - `principiante`;
  - `certificado de legalidad`;
  - `recorrido`;
  - `siniestro vial`, `incidente vial`, `accidente vial`.
- Official links grouped by task/action, not only embedded in prose.
- Volatile-information handling for fees, sedes, appointment availability, Boti/miBA screens, and CENAT amount.
- Optional images only after license, attribution, privacy, currentness, and offline asset checks pass.
- Tests and verification proving local rendering, source labels, visible checked dates, official links, offline behavior, and no external runtime requests.
- Process memory updates in `tasks.md`.
- Durable docs updates if the implementation changes navigation, content-source behavior, image-source policy, or official-source maintenance expectations.

Out of scope for the first implementation slice:

- Implementing every CABA license procedure or every license class.
- Full renewal, change-of-jurisdiction, canje/exchange, professional, motorcycle, truck, passenger, or interjurisdictional guidance beyond compact source-backed adjacent-path callouts.
- Filling out forms, booking appointments, checking appointment availability, monitoring prices, or notifying users.
- Runtime scraping or fetching from GCBA, ANSV, Boti, miBA, Telegram, or any other external source.
- Backend services, online APIs, analytics, cloud sync, or remote content delivery.
- Legal, immigration, medical, or driving-school advice.
- Replacing official GCBA/ANSV pages, official study material, or the existing theory trainer.
- Publishing private/community screenshots, chat screenshots, user reports, or personal data.
- Raw PDF viewer integration.
- Claiming Cabadrive is official, that the current fallback question bank is official/complete, or that the guide guarantees a particular official outcome.

## Non-Goals

- This feature is not a government-service automation layer.
- This feature is not a live procedural-status monitor.
- This feature is not an immigration status guide.
- This feature is not a medical eligibility guide.
- This feature is not a complete driving-school or practical-driving curriculum.
- This feature is not a new official-source archive browser for end users.

## Source Priority And Currentness Rules

- Official GCBA and ANSV/Gobierno Argentino sources are the source of truth for requirements, steps, payments, validity, sedes, attempts, practical exam rules, course validity, foreigner documentation, and beginner status.
- Community sources may influence UX structure and warnings only when clearly labeled as unofficial, anecdotal, and potentially stale.
- Community sources must never override official sources. When community reports and official sources differ, the product must follow official sources and may optionally warn that older community reports can be stale.
- Every major claim group must show:
  - official source title;
  - official URL;
  - checked date;
  - source status/currentness wording.
- Implementation must recheck official sources after the Analyst's 2026-05-10 research and as close to release as practical. Recheck evidence must be recorded in `tasks.md`.
- Fees, sedes, turn availability, CENAT payment UX, BUI amount, Boti/miBA screens, and document checklists are volatile. Either omit exact values and point to official links, or show values only as dated values with explicit currentness warning.
- If a source URL includes `gcaba_historico` but is still the current official GCBA page surfaced by GCBA, implementation may use it only with a recorded currentness check and visible official-link attribution.
- Official archive reuse should align with `content/official-documents/` governance when exact official documents are committed locally. Russian learning prose must not be placed inside the official archive.

## Assumptions

- First implementation should be one content-and-UI slice, not a multi-procedure licensing portal.
- `Otorgamiento` for B1/private car is the most useful first path for the target Russian-speaking learner.
- Adjacent paths matter to users with prior Russian or other jurisdiction licenses, but only compact source-backed callouts should ship in this slice.
- Russian text is the main learner language; official Spanish terms remain visible and searchable/scannable.
- Official external links may require internet when clicked, but the guide content itself must work from bundled local assets after build.
- Images are optional and should be omitted unless the implementation can prove licensing, attribution, privacy, currentness, and offline storage are clean.
- A structured JSON content model is likely preferable to hard-coded JSX if the guide has steps, source metadata, glossary terms, callouts, volatile fields, and optional images.

## Open Questions With Architect Disposition

- Should this be top-level navigation or inside `Материалы`?
  - Disposition: choose an additive top-level or clearly reachable guide entry only if navigation remains scan-friendly. Preferred implementation is a distinct `Процесс`/`Права в CABA` view because the content is procedural and broader than theory topic materials. If existing navigation is crowded, a `Материалы` subsection with visible entry is acceptable if Playwright proves reachability.
- Should renewal/change-of-jurisdiction/canje be fully covered?
  - Disposition: no for first slice. Add only short source-backed "not this path" callouts with official links.
- How should prior Russian license seniority and beginner status be handled?
  - Disposition: include only official general statements about `principiante`, prior license seniority, and `certificado de legalidad` where current official sources support them. Do not publish Russia-specific consular instructions without a dedicated source-verification slice.
- Should volatile fees be shown?
  - Disposition: prefer no exact fee values in evergreen prose. If shown, render them as dated values with source checked date and "verify before paying" wording.
- Should community observations be visible?
  - Disposition: use community context mostly to shape glossary and warnings. If visible, keep it in a small unofficial "what may confuse Russian speakers" block that never states procedural requirements.
- Should images ship?
  - Disposition: optional. Ship zero images if licensing/currentness/privacy review is not crisp. If images ship, they must be locally bundled, attributed, license-safe, and tested offline.
- Should official-source metadata reuse existing source-trace patterns?
  - Disposition: yes where practical. If a new process-guide content model is introduced, include source IDs/URLs/checked dates in structured data and consider a validator rather than embedding untraceable prose in components.

## User Stories

### User Story 1

As a Russian-speaking learner, I want to see the CABA license process in Russian with Spanish official terms, so I can recognize what official forms and pages are asking me to do.

### User Story 2

As a B1/private car applicant, I want a clear `Otorgamiento` step sequence, so I know what normally happens before and during exam day without relying on stale community posts.

### User Story 3

As a foreign resident or person with non-standard documents, I want conditional caveats and official links, so I do not mistake a simplified Russian checklist for my exact legal path.

### User Story 4

As a learner with low Spanish, I want a glossary of administrative and exam-day phrases, so I can understand terms like `turno`, `sede`, `DDJJ`, `aptitud psicofísica`, and `recorrido`.

### User Story 5

As a maintainer, I want source metadata and checked dates stored with the guide content, so stale claims and community-sourced errors can be reviewed before release.

## Acceptance Criteria

1. Given the app loads, the Russian CABA exam-process guide is reachable through the navigation approach chosen in `plan.md`.
2. Given the guide opens, it clearly states that the Russian guide is unofficial support and that users must use official GCBA/ANSV pages for real applications, payments, booking, and requirements.
3. Given the guide renders, the primary path is CABA `Otorgamiento de Licencia de Conducir` for B1/private car users.
4. Given adjacent paths are mentioned, renewal, change of jurisdiction, beginner-status, foreign-license, motorcycle, or other-class notes are compact, source-backed, and not presented as fully covered.
5. Given a procedural claim is shown, the same claim group has an official source title, official link, and checked date visible or directly associated in the UI.
6. Given fees, sedes, turn availability, Boti/miBA screens, document checklists, or CENAT amount are mentioned, the UI labels them volatile and directs users to official sources for current values.
7. Given community context appears, it is labeled unofficial/anecdotal and never overrides official instructions.
8. Given old community prices are known to be stale, those stale prices are not published as current values.
9. Given foreigner documentation is described, it is conditional by migration/document status and links to the official GCBA foreigner source rather than flattening all cases into one checklist.
10. Given the course section renders, it states only source-backed details such as current modality/duration/validity/CABA-validity caveats and links the official course page.
11. Given the theory section renders, it explains exam-day relation at high level, links official study material, and does not duplicate or contradict the existing Cabadrive theory trainer.
12. Given the psychophysical section renders, it describes source-backed procedural expectations without medical diagnosis, eligibility advice, or treatment guidance.
13. Given the practical car exam section renders, it states source-backed street-exam format, approximate duration, same-day license outcome when approved, and official reattempt rule.
14. Given the terms/phrases section renders, it includes Spanish terms and Russian explanations useful to low-Spanish users.
15. Given official links are displayed, links include at minimum the current checked official pages for `Otorgamiento`, `Extranjeros`, `Curso de Educación Vial`, `Material de estudio`, `Examen práctico`, `Pista de aprendizaje`, `CENAT`, CENAT payment, `Principiantes`, and the April 2025 procedure manual if any manual-backed claim ships.
16. Given images are included, each image is local, license-safe, attributed, source-linked, free of private/personal data, and covered by rendering/offline tests.
17. Given no image passes review, the feature still satisfies acceptance without images.
18. Given the app is used after build, no runtime network fetch, backend, remote image, raw PDF viewer, or external API is required to read the guide.
19. Given implementation introduces a new content model or structured guide data, validation or unit tests cover required fields, source metadata, volatile labels, official links, image metadata, and no missing source IDs.
20. Given implementation is complete, Playwright evidence proves the guide renders, source/date labels and links are visible, offline/no-external-request behavior is preserved, and no raw PDF viewer is present.
21. Given local verification runs, required commands pass or exact unrelated blockers are recorded in `tasks.md`.
22. Given process memory is inspected, `tasks.md` records decisions, dead ends, known issues, source recheck evidence, image licensing decisions, verification evidence, and Implementation Agent feedback.

## Negative Scenarios

- A guide that covers many procedures broadly but does not give a reliable B1/private car `Otorgamiento` path fails the first-slice goal.
- A guide that copies Telegram/community advice as procedural truth is unacceptable.
- A guide that publishes stale community prices or undated volatile fee values as current is unacceptable.
- A guide that lacks checked dates or official source links for process claims is unacceptable.
- A guide that gives medical, legal, immigration, or application-specific advice instead of source-backed procedural explanation is unacceptable.
- A guide that tells all foreigners to follow one universal document checklist is unacceptable.
- A guide that embeds or opens a raw PDF viewer is unacceptable.
- A guide that requires runtime network access to render its core content violates the local-first contract.
- A guide that uses remote images, private screenshots, or unattributed images is unacceptable.
- A guide that implies Cabadrive is official or that the current practice question set is a complete official GCBA bank is unacceptable.
- A guide that changes active exam mode behavior or hides existing study/exam/mistakes/vocabulary/materials/CABA-RF flows is out of scope.

## Functional Requirements

- FR-001: Add a learner-facing guide entry for the CABA license exam process using Russian UI labels.
- FR-002: Store process-guide content as bundled local content or otherwise import it through the existing static data boundary; do not fetch it at runtime.
- FR-003: Model each major process section with source metadata, including official title, URL, checked date, and currentness/status wording.
- FR-004: Model volatile content explicitly so fees, sedes, turn availability, CENAT amount, and form-screen details cannot appear without a volatility warning or direct official-source pointer.
- FR-005: Preserve official Spanish terms in the guide and glossary while Russian explanations remain clearly unofficial learning support.
- FR-006: Include a primary `Otorgamiento` B1/private car step sequence.
- FR-007: Include compact, source-backed adjacent-path callouts for `Renovación`, `Renovación por cambio de jurisdicción`, `principiante`, `certificado de legalidad`, and foreigner documentation where current official sources support them.
- FR-008: Include official links grouped by user task/action.
- FR-009: Include psychophysical and practical-exam sections only at source-backed procedural detail level.
- FR-010: Include a Spanish terms/phrases section with Russian explanations.
- FR-011: If images are used, store them as local assets with license/attribution/source metadata and render them with local asset semantics.
- FR-012: If no image is license-safe, omit images without blocking the core feature.
- FR-013: Do not add a backend, router dependency, scraping job, online price monitor, raw PDF viewer, or runtime external request.
- FR-014: Update durable docs only if navigation, content-source policy, image-source policy, local-first behavior, or source-maintenance behavior changes.
- FR-015: Keep feature process memory current in `tasks.md`.

## Verification Requirements

- Implementation must run and record:
  - `pnpm run validate:content`;
  - `pnpm run test`;
  - `pnpm run build`;
  - `pnpm run test:e2e`;
  - `pnpm run preflight`;
  - `git diff --check`.
- Add unit or data-validation coverage if a new content model is introduced. Coverage should check required section fields, official source links, checked dates, volatile flags, glossary shape, optional image metadata, and no missing referenced source IDs.
- Add Playwright coverage that:
  - the process guide is reachable from navigation;
  - the B1/private car `Otorgamiento` path renders;
  - unofficial/Russian-support status is visible;
  - official source titles, checked dates, and links are visible;
  - volatile fields are labeled or omitted;
  - Spanish terms/phrases render;
  - psychophysical/practical sections render without legal/medical advice wording;
  - no raw PDF viewer is present;
  - no runtime external requests are made while loading and browsing the guide;
  - included images, if any, render from local assets.
- If source-currentness verification requires manual web checks, record checked date, URLs, and summarized result in `tasks.md`.
- If official pages changed from Analyst intake, implementation must update content to current source-backed behavior or record a blocker for Architect/Orchestrator disposition.

## Review Requirements

- Review Agent must verify the PR stays within the `012` implementation slice and does not implement unrelated licensing procedures broadly.
- Review Agent must verify official sources outrank community sources in copy, structure, and metadata.
- Review Agent must verify all major process claims have official links and checked dates.
- Review Agent must verify volatile fees/sedes/turns/forms are dated/labeled or omitted.
- Review Agent must verify the guide does not provide legal, immigration, medical, or individualized procedural advice.
- Review Agent must verify foreigner documentation and prior-license/beginner-status notes are conditional and source-backed.
- Review Agent must verify no runtime network fetch, remote images, raw PDF viewer, backend endpoint, or scraping/monitoring behavior was introduced.
- Review Agent must verify images, if included, are local, attributed, license-safe, and free of private/personal data.
- Review Agent must verify required tests and command evidence are recorded in `tasks.md`.
- Review Agent must verify durable docs are updated if navigation, content-source behavior, image-source policy, or source-maintenance expectations changed.
