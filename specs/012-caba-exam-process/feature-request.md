# Feature Request: Russian CABA License Exam Process Guide

## Request Intake

Add a Russian-language web section that explains the CABA driver's license process beyond theory preparation: how to book and complete the procedure, required forms and payments, where to take the exams, medical/psychophysical evaluation, practical driving exam, official links, Spanish administrative terms and phrases, and relevant images when safe and appropriately licensed.

The section must use current official GCBA/ANSV sources as the source of truth. Russian-language Telegram/chat/community reports may inform UX priorities and common pain points, but they must never override current official sources, especially because parts of the process and pricing changed recently.

This Analyst pass writes only this intake artifact. Product code, content files, tests, durable docs, technical specs, implementation tasks, commits, and PR work are for later roles.

## Original User Request

The user asked for a new Russian-language section explaining how to get or sit the CABA driver's license exam beyond theory, including:

- how to book the process;
- forms and administrative steps;
- where the exam can be taken;
- medical/psychophysical exam;
- practical exam;
- official links;
- Spanish terms and phrases;
- relevant images if safe and appropriate;
- current verified information from official sources;
- Russian Telegram/chats/community context;
- explicit priority for official sources over community reports.

The Orchestrator specified this intake work:

- act strictly as Analyst;
- preserve parallel agents' dirty diffs, branches, commits, PRs, and process memory;
- work only in `/Users/chap/devel/cabadrive-012-exam-process-intake` on branch `codex/012-exam-process-intake`;
- create `specs/012-caba-exam-process/feature-request.md`;
- do not write code, `spec.md`, `plan.md`, `tasks.md`, commits, or PRs.

## Clarifying Answers

No direct user clarification was requested during this Analyst pass. The request is clear enough for Architect handoff with assumptions and open questions below.

If clarification is needed before architecture, route questions through the Orchestrator rather than asking the end user directly.

## Project Context

Cabadrive is a static local-first React/TypeScript/Vite web trainer for Russian-speaking drivers preparing for the CABA theory exam.

Relevant repository constraints:

- MVP has no backend and no runtime network API.
- End-user runtime is Docker-only: `make build`, `make up`, `make down`.
- The app must remain local-first and offline-capable after build.
- Official Spanish text and official source traceability are primary.
- Russian translations, explanations, guide material, Spanish phrase help, and process notes are unofficial learning/support content.
- Current question content mode is `unofficial_b_fallback`, not an official complete GCBA category B question bank.
- The existing app already has study, exam, mistakes, vocabulary, `Материалы`, and `CABA/RF` learning surfaces; Architect should decide whether this process guide becomes a new top-level section, a subsection under `Материалы`, or a linked guide surface.
- Existing official-document archive rules require official source materials to be traceable and currentness-aware when they support durable guide claims.

## Internal Source Review

Repository memory read for this intake:

- `.specify/memory/constitution.md`
- `docs_project/README.md`
- `docs_project/project-idea.md`
- `docs_project/project/frontend/frontend-docs.md`
- `docs_project/project/backend/backend-docs.md`
- `docs_project/project/feature-inventory.md`
- `docs_project/screens/learning-and-exam-flows.md`
- `docs/specify/README.md`
- `docs_project/project/content-sources.md`
- `specs/006-topic-study-guide/feature-request.md`
- `specs/008-learning-materials-ui/feature-request.md`

No active `012` `spec.md`, `plan.md`, or `tasks.md` existed before this intake. Existing max feature numeric prefix observed in `specs/` is `011`; `specs/012-caba-exam-process/` had no collision before creation.

## Official External Research

Official sources checked on 2026-05-10:

- GCBA, Otorgamiento de Licencia de Conducir: https://buenosaires.gob.ar/tramites/otorgamiento-de-licencia-de-conducir
  - Current official flow for first license or license expired more than one year.
  - Key points found: miBA required; DNI with CABA address or identity alternative for DNI in process; foreigners must meet specific requirements; CENAT is required; online start includes personal data and psychophysical affidavit; course is required where applicable; agenda lets the user choose among enabled seats; BUI must be paid; final in-person day includes documentation and exams.
  - Current cost shown during intake: BUI `Otorgamiento de Licencia` ARS 34,200 and CENAT ARS 8,840. These are volatile and must be rechecked at implementation/release.
  - The page states the procedure must be finished within 180 calendar days.

- GCBA, Extranjeros: https://buenosaires.gob.ar/licenciasdeconducir/casosespeciales/extranjeros
  - Key points found: foreigners with CABA domicile can process authorization depending on migration status; printed requirements are requested; documentation varies for permanent residence, temporary residence, expired DNI plus active residence disposition, precaria, and cases without DNI.
  - Important user-facing caveat: the guide must not collapse all foreigner cases into one simple checklist.

- GCBA, Curso de Educación Vial para Otorgamiento de Licencia: https://buenosaires.gob.ar/gcaba_historico/infraestructura/movilidad/curso-de-educacion-vial-para-otorgamiento-de-licencia
  - Key points found: the course is a formal mandatory instance for safety and road coexistence knowledge; after data verification, GCBA says the applicant receives email within 48 hours with course links; the course can be virtual with instructor or in person at Sede Roca, is available Monday to Monday, lasts 3 hours, and is valid for one year.
  - The page says GCBA-authorized courses or authorized driving academies are valid; other courses are not valid in CABA.

- GCBA, Material de estudio para examen teórico: https://buenosaires.gob.ar/licenciasdeconducir/curso-de-educacion-vial-para-otorgamiento-de-licencia/material-de-estudio-para
  - Key points found: the theoretical exam is multiple choice and lasts 45 minutes; for cars, cargo/passenger transport, trucks, and non-agricultural special machinery, the mandatory reading is the `manual de conducción de vehículos urbanos de cuatro ruedas`; motos and cuatriciclos have separate materials.
  - This page is useful for linking process guide users back to Cabadrive's theory-prep scope while clearly stating that the new guide is not a replacement for official material.

- GCBA, Examen práctico: https://buenosaires.gob.ar/gcaba_historico/gobierno/licencias-de-conducir/examen-practico
  - Key points found: car practical exams are in street with dual-control cars, on a monitored route controlled by traffic agents, within about 200/300 meters around the communal seat, and last approximately 15 minutes.
  - If approved, the user takes the license the same day. If failed, the user has two more attempts; the next turn is assigned at the same seat with five days between failed attempt and new turn. After all attempts are failed, the whole procedure must start again with a new paid turn.
  - Moto practical exams are at Pista de Roca and have three stages.
  - The page contains official images and downloadable practical-exam materials; any use of images must respect licensing/attribution and offline asset constraints.

- GCBA, Pista de aprendizaje para conductores: https://buenosaires.gob.ar/infraestructura/movilidad/pistadeaprendizaje
  - Key points found: the learning track is for CABA residents who want to practice with car or moto; DNI is requested from driver and learner to prove CABA domicile; prior turn is required; each turn lasts 45 minutes; agenda visibility is 15 days; open every day; address is Av. Cnel. Roca 5050/5500 area, with access from Av. Roca coming from Av. Gral. Paz toward Centro.
  - This is useful as an optional preparation/practice subsection, not as a required exam step unless official pages say so.

- GCBA, Certificado Nacional de Antecedentes de Tránsito (CENAT): https://buenosaires.gob.ar/certificado-nacional-de-antecedentes-de-transito-cenat
  - Key points found: CENAT is required for all procedures within the Dirección General Habilitación de Conductores; the form is required to start the license request; it is mandatory and not part of the fee for each class processed.

- ANSV / Gobierno Argentino, Boleta de Pago CENAT: https://boletadepago.seguridadvial.gob.ar/
  - Key points found: official GCBA CENAT page points payment generation to this `.gob.ar` endpoint; form asks location/province, interjurisdictional professional license status, emission center, personal data, document type, document number, email, and reCAPTCHA. A previously observed non-.gob.ar payment URL was superseded by the PR #72 review fix and must not be used for user-facing payment actions.
  - Current amount shown during intake: ARS 8,840. This is volatile and must be rechecked before publication.

- GCBA, Manual de Procedimientos Abril 2025: https://documentosboletinoficial.buenosaires.gob.ar/publico/PE-DIS-SECGVC-DGHC-562-25-ANX.pdf
  - Key points found: official procedure manual for Dirección General Habilitación a Conductores; it states Cuerpo II covers psychophysical aptitude requirements and Cuerpo III covers training and theoretical/practical evaluation. It also states foreign applicants without definitive residence may have license validity limited to migration residence validity, and medical authority may reduce validity.
  - Use as deep source for Architect/implementation when exact claims about psychophysical evaluation, validity reductions, exceptions, or edge cases are needed.

- GCBA, Principiantes: https://buenosaires.gob.ar/tramites/otorgamiento-de-licencia-de-conducir/casos-especiales/casosespeciales/principiantes
  - Key points found: first-time A, A4, and B1 applicants are beginners; the beginner condition lasts six months, with total habilitation maximum two years subject to psychophysical exam results; during the first six months, circulation on roads where maximum speed exceeds 70 km/h is prohibited; during the first two years in CABA, blood alcohol level must be zero; those who prove prior license seniority from another municipality or country are not beginners.
  - Relevant because community reports mention Russian license seniority and beginner restrictions; official page should win.

- GCBA, Renovación por Cambio de Jurisdicción: https://buenosaires.gob.ar/tramites/renovacion-por-cambio-de-jurisdiccion
  - Key points found: useful context for users who already hold a license from another jurisdiction or eligible foreign countries; certificate of legality may be required to avoid beginner condition. This may be adjacent rather than core if the feature focuses on first `otorgamiento`, but Russian users often ask about prior foreign licenses and beginner status.

Official-source notes:

- The current official GCBA pages route many URLs through `gcaba_historico`; despite the URL segment, they are the pages surfaced by current GCBA search and contain current fees/checklists during intake. Architect should require rechecking active canonical URLs before implementation.
- GCBA pages state site contents are licensed under Creative Commons Reconocimiento 2.5 Argentina License. This supports possible reuse of official page images only with attribution, but each selected image still needs asset-specific review, local storage, and offline rendering.
- Costs, seat availability, Boti/miBA screens, enabled sedes, and CENAT payment details are volatile and must not be hard-coded without checked date and update path.

## Russian Community Research

Public Russian-language community sources checked on 2026-05-10:

- Telemetrio mirror of `@lacabanadeltiovolodia`, repost from `Che Даша: локал в Аргентине`: https://telemetr.io/es/channels/1887754476-lacabanadeltiovolodia/posts
  - Found the lead described by the Orchestrator. The repost says it is "not a guide, just advice" about getting a license in Argentina/CABA.
  - Useful community observations:
    - Russian speakers think in terms of `Bot Caba`, `miBA`, `CENAT`, `Curso de Educación Vial`, choosing manual vs automatic, choosing a comuna/sede, medical checks, theory, practical exam, same-day license if passed, and rerouting after failure.
    - It highlights Spanish level as a real barrier throughout all exam stages.
    - It calls out terms like `recorrido`, `accidente vial`, `incidente vial`, and `siniestro vial` as confusing.
    - It suggests learners may care about choosing a familiar route/sede and practicing the route with an instructor/school.
  - Stale or unofficial details:
    - The CENAT amount mentioned in the repost was approximately ARS 4,000; current official sources checked during intake show ARS 8,840.
    - The BUI/payment amount mentioned in the repost was approximately ARS 16,800; current official GCBA page checked during intake shows ARS 34,200 for `Otorgamiento`.
    - The post does not replace official requirements for foreigner documentation, beginner status, course validity, exam attempts, or seats.
  - Verification status: public mirror, community anecdote, not authoritative; use only as UX/context evidence and stale-price warning.

- Telemetrio mirror of `@pereezd_v_argentinu`, post mentioning Russian licenses, CABA, beginner status, and license replacement after new documents: https://telemetr.io/ru/channels/2341497931-pereezd_v_argentinu/posts
  - Useful community observations:
    - Russian users may currently feel low urgency to get an Argentine license if rental companies accept Russian licenses, but they still ask what changes after residence/DNI.
    - The post claims getting the license can be a one-day matter once theory is understood and notes beginner restrictions and a consular certificate to prove Russian license seniority.
  - Official cross-check:
    - GCBA official `Principiantes` page supports the broad point that prior license seniority can avoid beginner status, but the exact document path for Russian licenses and consular certification needs official verification before publication.
    - Claims about replacing the license after every new document or changed status need official verification before any product guidance.
  - Verification status: public mirror, community anecdote, not authoritative; useful for identifying Russian-user questions around prior licenses, beginner status, and document changes.

Search attempts that did not produce sufficiently reliable process evidence:

- General web searches for Russian Telegram/community discussions around `права`, `CABA`, `DNI`, `прекария`, `CENAT`, `Bot Caba`, and `Curso de Educación Vial`.
- Results included broad immigration/life-in-Argentina forum content and unrelated Telegram mirrors. These should not be treated as reliable licensing guidance.

Community-research conclusion:

- Community context strongly supports adding a practical Russian "what happens in what order" guide, a Spanish terms/phrases aid, and warnings that old prices/process screenshots may be stale.
- Official GCBA/ANSV sources must be the only source of truth for requirements, payments, validity, sedes, exam attempts, beginner restrictions, and foreigner/document rules.

## Desired User Experience

The eventual learner-facing section should help a Russian-speaking driver understand the end-to-end CABA license process without pretending to be an official government service.

Expected shape:

- Russian overview of the current official process with a checked date.
- Clear separation between:
  - official required steps;
  - optional preparation/practice resources;
  - unofficial Russian explanations and community-derived cautions.
- Step-by-step flow for `Otorgamiento` focused on category B/private car users unless Architect expands scope:
  - confirm whether `otorgamiento` is the right procedure;
  - check DNI/CABA domicile or foreigner documentation path;
  - use miBA/Boti/official web entry point;
  - check/resolve traffic infractions where required;
  - generate/pay CENAT;
  - complete personal data and psychophysical DDJJ;
  - complete required course;
  - select turn/sede and pay BUI;
  - attend in person with documents;
  - complete psychophysical evaluation;
  - complete theory;
  - complete practical exam;
  - understand pass/fail outcomes and reattempt rules.
- A "where" section for Sede Central Roca, participating communal sedes/subsedes when official page data supports it, and Pista de Aprendizaje as optional practice.
- A psychophysical section explaining what the user should expect at high level without overclaiming medical details.
- A practical exam section for cars that reflects current official street-exam format and reattempt rules.
- A terms/phrases section mapping Spanish administrative words to Russian explanations, for example:
  - `Otorgamiento de Licencia de Conducir`
  - `Renovación`
  - `Renovación por cambio de jurisdicción`
  - `Ampliación`
  - `CENAT`
  - `BUI`
  - `miBA`
  - `Boti`
  - `turno`
  - `sede` / `subsede comunal`
  - `Declaración Jurada` / `DDJJ`
  - `aptitud psicofísica`
  - `curso de educación vial`
  - `examen teórico`
  - `examen práctico`
  - `principiante`
  - `certificado de legalidad`
  - `recorrido`
  - `siniestro vial`, `incidente vial`, `accidente vial`
- Official links grouped by task, not buried in prose.
- Optional images such as official practical exam/street exam, Pista de Aprendizaje, Sede Roca, or process screenshots only when licensing, attribution, privacy, and offline storage are safe.

The section should be useful before the user opens official forms, but it must direct users back to official GCBA/ANSV pages for the actual application, payment, and booking.

## Scope Expectations

In scope for the eventual feature:

- Add a Russian-language process guide section in the web app.
- Explain the CABA license process beyond theory preparation using current official sources.
- Focus on CABA and likely category B/private car users unless Architect explicitly scopes other classes.
- Include official-source checked dates and source links for each major claim group.
- Include a volatile-information warning for prices, sedes/turnos, and Boti/miBA screens.
- Include a currentness workflow expectation so implementation rechecks official pages near release.
- Include Russian UX explanations for foreigner/DNI/precaria scenarios without flattening official requirements.
- Include a Spanish terms/phrases glossary for the administrative process and exam day.
- Include practical exam summary and pass/fail/reattempt expectations from official GCBA sources.
- Include psychophysical evaluation expectations at a careful high level, supported by official pages and the April 2025 Manual de Procedimientos where needed.
- Include links to official CENAT, GCBA `Otorgamiento`, `Extranjeros`, course, study material, practical exam, Pista de Aprendizaje, and beginner-driver pages.
- Include community-context notes only if clearly labeled as unofficial, anecdotal, and potentially stale.
- Include relevant images only if license/attribution/privacy review passes and assets are bundled locally for offline use.
- Preserve existing Cabadrive clarity that Russian material is unofficial support.
- Update durable docs if user-facing navigation, content-source policy, image-source policy, or official-source maintenance expectations change.

Out of scope for this intake and likely out of scope for the first implementation slice:

- Product code changes by Analyst.
- Architect-owned `spec.md`, `plan.md`, or `tasks.md`.
- Acting as an official legal/administrative advisor.
- Filling out miBA/Boti/CENAT forms for users.
- Runtime scraping of official pages.
- A backend, online appointment checker, notification system, or price monitor.
- Claiming the Cabadrive theory trainer is an official GCBA question bank.
- Publishing community screenshots, private chat screenshots, or Telegram user content as evidence.
- Providing medical advice beyond describing official psychophysical evaluation requirements.
- Handling every professional/interjurisdictional license edge case unless Architect explicitly expands scope.

## Acceptance Expectations

The eventual feature should be accepted only when evidence shows:

- the new Russian process section is reachable in the app through the navigation approach chosen by Architect;
- the section clearly states it is unofficial Russian support and links users to official GCBA/ANSV sources for action;
- all official process claims have source links and checked dates;
- the implementation/release task rechecks official sources after this 2026-05-10 intake, especially prices, seats, required documents, Boti/miBA entry points, CENAT amount, and course rules;
- official sources take priority over community reports wherever they differ;
- stale community prices from Telegram are not published as current values;
- current fees are either rechecked and dated or presented as volatile examples with direct official links;
- the guide includes official links for `Otorgamiento`, `Extranjeros`, `Curso de Educación Vial`, `Material de estudio`, `Examen práctico`, `Pista de aprendizaje`, `CENAT`, CENAT payment, `Principiantes`, and the April 2025 Manual where used;
- foreigner documentation is explained as conditional by migration status rather than one universal checklist;
- the course section states current official duration, modality choices, validity, and CABA-validity caveat;
- the theory section does not duplicate the existing trainer unnecessarily, but links the official material and explains exam-day relation at high level;
- the practical car exam section states current official street-exam format, approximate duration, same-day license outcome when approved, and official reattempt rule;
- psychophysical evaluation content is limited to source-backed expectations and does not provide medical advice;
- Spanish terms/phrases are accurate and useful for a low-Spanish Russian speaker;
- images, if included, are from official or otherwise license-safe sources, locally bundled, attributed, and free of private/personal data;
- no runtime network fetch is required to use the section after build;
- tests/verification chosen by Architect prove the section renders offline/static, links are present, labels are clear, and no source-conflicting claim remains;
- process memory records source-check dates, volatile-currentness risks, image licensing decisions, and known open questions.

## Risks

- GCBA fees, enabled sedes, URLs, Boti/miBA flow, and CENAT payment UX can change quickly.
- GCBA current pages may redirect through `gcaba_historico`, which can confuse future agents about source currentness.
- Community reports may be persuasive but stale, especially prices and same-day flow details.
- Russian users may have varied statuses: tourist, precaria, temporary DNI, permanent DNI, citizenship, foreign license, Argentine license from another jurisdiction. A single guide can overgeneralize if Architect does not set scope.
- Prior Russian license seniority and `certificado de legalidad`/consular proof need exact official handling before publishing concrete instructions.
- Medical/psychophysical explanations can become risky if they interpret clinical criteria beyond official procedural language.
- Screenshots of Boti/miBA/community chats can expose personal data or become stale quickly.
- Images from official pages may still require attribution, asset-specific review, and local storage to satisfy offline constraints.
- Too much administrative detail could distract from Cabadrive's exam-prep focus; too little detail may fail the user's request for process clarity.
- If process-guide content is mixed with official-document archive text, future agents may accidentally paraphrase official source material inside the archive.

## Assumptions

- The first product slice should focus on CABA `Otorgamiento de Licencia de Conducir` for private car/category B users, with callouts for adjacent paths rather than full coverage of every license class.
- The section should be in Russian and designed for low-Spanish users, but Spanish official terms should remain visible.
- Community context should appear, if at all, as "what people report / what to watch for" and not as procedural truth.
- Official pages checked during intake are sufficient to start architecture; implementation must perform a fresh source check because the user explicitly asked for current verified info.
- Images are optional and should be omitted if licensing, attribution, or stale-screenshot risk is not cleanly solved.
- No user-facing workflow should depend on online access at runtime; external official links can be present, but the guide content itself should be bundled.

## Open Questions For Architect

- Should this be a new top-level nav item, a subsection under `Материалы`, or a subsection under an expanded "Процесс" guide?
- Should the first implementation cover only `Otorgamiento` for B1/private car, or also compare renewal, change of jurisdiction, and license exchange/canje?
- How should the guide handle users with Russian licenses who want to avoid beginner status: include only official general `certificado de legalidad`/prior seniority statements, or require a dedicated source-verification slice?
- Should volatile fees be shown as dated current values, omitted in favor of official links, or both?
- Should community observations be visible to learners, or should they only influence the structure and glossary?
- Which official images, if any, are worth bundling after attribution/licensing review?
- Should official-source trace metadata reuse the existing `content/official-documents/` manifest/source-trace pattern from the topic-study-guide work?

## Analyst Handoff Notes

Architect should treat this as a content-and-UI feature with high currentness sensitivity.

Recommended architecture attention areas:

- define a small structured content model for process steps, official links, glossary terms, volatile fields, and source checked dates;
- separate learner prose from official-source metadata;
- require implementation to recheck all official pages near release;
- require any image asset to pass license/attribution/offline checks before use;
- keep community research in a clearly labeled unofficial context bucket;
- avoid turning this into a backend appointment helper or a broad immigration/legal guide;
- align any official-document archiving with the existing `content/official-documents/` governance instead of inventing a parallel source system.

## Final Analyst Validation

2026-05-10 status: pass. Analyst return count: 0.

Validation scope: PR #72 at head `3f66a1a86bd6a4c2a8240e2e11aa3984b7668910`, current `origin/main` `995905bacdcf46d1d21662c12dba01b8ecda1d36`, after final Architect validation pass.

Evidence against the original request:

- The web app adds a reachable Russian `Процесс` section for CABA B1/private-car `Otorgamiento de Licencia de Conducir`.
- The guide uses simple Russian explanations, keeps Spanish official terms visible, includes phrase/glossary support, and clearly labels itself as unofficial Russian support.
- Official GCBA/ANSV links and checked dates are bundled in `content/guide/caba-exam-process.ru.json` for `Otorgamiento`, `Extranjeros`, `Curso de Educación Vial`, `Material de estudio`, `Examen práctico`, `Pista de aprendizaje`, `CENAT`, CENAT payment, `Principiantes`, `Renovación por Cambio de Jurisdicción`, and the April 2025 procedure manual.
- The content covers booking/start flow, CENAT/payment direction, BUI/turno/sede, documents and foreigner caveats, course, psychophysical evaluation, theory, practical B1 exam, where/practice resources, pass/fail/reattempt rules, and adjacent paths without over-expanding beyond the first slice.
- Final spot-check of current official pages still supports the shipped claims: GCBA `Otorgamiento` lists miBA/DNI/CABA/foreigner requirements, CENAT, online DDJJ, course, turno/sede/BUI, psychophysical areas, theory, B1 practical, costs, sedes, and 180-day window; GCBA `Extranjeros`, course, theory-material, practical-exam, Pista, CENAT, Principiantes, and jurisdiction-change pages remain consistent with the guide; ANSV CENAT payment is the official `.gob.ar` boleta page.
- Russian community/Telegram context remains subordinate and visible only as stale-risk/confusion context; stale community prices are not published as current values.
- Images are omitted with a documented license/currentness/privacy/offline rationale, which satisfies the accepted no-images path.
- Tests and process memory record local-first/offline behavior, source metadata validation, no runtime external requests, no remote images, and no raw PDF viewer.

Residual risks: GCBA/ANSV fees, sedes, turn availability, Boti/miBA screens, document requirements, and official URLs remain volatile and must be rechecked in future source-maintenance slices.
