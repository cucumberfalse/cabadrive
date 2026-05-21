# Process Guide Refresh Evidence - 2026-05-20

## Scope

- Slice: Process Guide Refresh, tasks T030-T036.
- Learner-visible file: `content/guide/caba-exam-process.ru.json`.
- Status kept: `unofficial_learning_aid`.
- Primary scope kept: CABA / `otorgamiento` / B1 / private car.
- User PDF used only as a structure/reference model: `<user-downloads>/Первое_получение_прав_и_обновление.pdf`.

## Supplied PDF Reference

- Logical path: `<user-downloads>/Первое_получение_прав_и_обновление.pdf`
- Local availability during this slice: present at assignment path.
- SHA-256: `953f1c70739b5edb721a15535994a0d9f8553b8acc81d019b510893622528eb3`
- Size: 785036 bytes.
- Prior inventory evidence: `pdf-inventory.json` records 12 pages, Russian process-guide role, no explicit license, 2023-year signal, and deferred/not-authoritative disposition.
- Current use in this slice: structure cue for acquisition/renewal organization only. No raw PDF text, screenshots, prices, or unverified procedural facts were copied into committed content.
- Local extraction blocker: default Python in this fresh worktree could not import `pypdf`; no new raw PDF extraction artifact was created. Existing Slice 1 non-verbatim inventory metadata was sufficient for the reference-model boundary.

## Official Source Checks

All current production claims retained or changed in the process guide were checked against official URLs accepted by the current validator. Checked date: 2026-05-20.

| Source ID | Official URL | Currentness | Concise claim summary |
| --- | --- | --- | --- |
| `gcba-otorgamiento` | https://buenosaires.gob.ar/tramites/otorgamiento-de-licencia-de-conducir | Current, redirects to `gcaba_historico` | Otorgamiento covers first license or license expired more than one year; has online/presential flow, 180-day completion window, miBA/DNI requirements, CENAT, online DDJJ, course, turno/BUI, psychophysical evaluation, theory, and B1 practical exam. |
| `gcba-renovacion` | https://buenosaires.gob.ar/tramites/renovacion-de-licencia-de-conducir | Current, redirects to `gcaba_historico` | Regular renewal is a separate adjacent path for an existing CABA license, with one-year grace from expiry; if expired, driving is not allowed; renewal uses CENAT, virtual renewal talk, online start, turno/BUI, and psychophysical evaluation. |
| `gcba-cambio-jurisdiccion` | https://buenosaires.gob.ar/tramites/renovacion-por-cambio-de-jurisdiccion | Current, redirects to `gcaba_historico` | Change-of-jurisdiction renewal is a separate adjacent path for moving domicile to CABA with an existing particular A/B/G license; canje countries currently listed by GCBA are Spain, Italy, Peru, Bolivia, Colombia, and Chile. |
| `gcba-extranjeros` | https://buenosaires.gob.ar/licenciasdeconducir/casosespeciales/extranjeros | Current, redirects to `gcaba_historico` | Foreign applicants with CABA domicile follow status-dependent documentation rules based on radicación, DNI/precaria/passport situation, and printed requirements; no universal document list is safe. |
| `gcba-curso` | https://buenosaires.gob.ar/gcaba_historico/infraestructura/movilidad/curso-de-educacion-vial-para-otorgamiento-de-licencia | Current historic URL | Otorgamiento course is required for first license and licenses expired more than one year; after data verification, GCBA sends course links by email; official options include virtual teacher-led course, presencial at Sede Roca, or habilitated driving academies; validity is one year. |
| `gcba-material-teorico` | https://buenosaires.gob.ar/licenciasdeconducir/curso-de-educacion-vial-para-otorgamiento-de-licencia/material-de-estudio-para | Current, redirects to `gcaba_historico` | The theory exam is multiple choice, 45 minutes; four-wheel urban vehicle manual is the official reading material for cars. This does not establish Cabadrive as an official full question bank. |
| `gcba-examen-practico` | https://buenosaires.gob.ar/gcaba_historico/gobierno/licencias-de-conducir/examen-practico | Current historic URL | B1 practical exam is in street traffic with dual-control cars on a monitored route near the communal venue; pass/fail and retry expectations remain official-action items. |
| `gcba-pista-aprendizaje` | https://buenosaires.gob.ar/infraestructura/movilidad/pistadeaprendizaje | Current, redirects to `gcaba_historico` | Learning track is optional preparation for CABA residents with prior appointment; it is not the mandatory B1 practical exam. |
| `gcba-cenat` | https://buenosaires.gob.ar/certificado-nacional-de-antecedentes-de-transito-cenat | Current, redirects to `gcaba_historico` | CENAT is required for all license procedures handled by DGHC and is separate from the city procedure fee. |
| `ansv-cenat-payment` | https://boletadepago.seguridadvial.gob.ar/ | Current volatile payment form | Official ANSV/Mi Argentina CENAT payment form collects province, issuing center, personal data, and email for the boleta/comprobante; current amount is volatile and not hardcoded. |
| `gcba-principiantes` | https://buenosaires.gob.ar/tramites/otorgamiento-de-licencia-de-conducir/casos-especiales/casosespeciales/principiantes | Current, redirects to `gcaba_historico` | Principiante applies to first private A/A4/B1 license, lasts six months, has a two-year maximum habilitation subject to psychophysical results, and can be avoided when prior license antiquity is properly accredited. |
| `gcba-manual-procedimientos-2025` | https://documentosboletinoficial.buenosaires.gob.ar/publico/PE-DIS-SECGVC-DGHC-562-25-ANX.pdf | Current official PDF | Used only as a linked official reference in the process guide; no medical eligibility advice or raw PDF viewer behavior was added. |

## Content Decisions

- Added `gcba-renovacion` as an official source and adjacent-path link so renewal is represented by a current official page rather than being folded into Otorgamiento.
- Kept regular renewal, change of jurisdiction, foreigners, and principiante as concise adjacent-path/support notes.
- Preserved warnings for official action, volatility, unofficial Russian support, and no official full-bank coverage.
- Did not update durable docs because this slice changes learner-visible process content and source evidence only; source governance and runtime behavior did not change.
- Did not update official archives or primary-source reader content because no new exact official document archive was introduced.
