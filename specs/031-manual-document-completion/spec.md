# Spec: Complete The Interactive Russian Manual

## Architect Scope

This Architect assignment plans feature `031-manual-document-completion` only. Architect writes only `spec.md`, `plan.md`, and `tasks.md` under this feature folder.

- Assigned worktree: `/Users/chap/devel/cabadrive-worktrees/031-manual-document-completion`.
- Assigned branch: `codex/031-manual-document-completion`.
- Verified latest main base: `origin/main` at `b07d5c72bf1689e7dac480e937c366a528d20299`.
- Starting state: PR #184 / Chapter 1 is merged at the provided base; Chapter 2 remains pending and is the next likely chapter-level content PR.
- Parallel work may exist. All sibling worktrees, branches, commits, PRs, dirty diffs, and process memory must be preserved. Do not touch `/Users/chap/devel/cabadrive` root or sibling worktrees.

## Goal

Complete the native Russian interactive `Руководство` document for the official GCBA 4-wheel manual, using one PR per remaining source manual chapter from this point forward, while applying stricter source-fidelity visual rules to all future chapter work and to any needed corrections for already merged Introduction and Chapter 1 content.

The completed manual must remain a local-first native web document: source-derived hierarchy, selectable Russian learning text, source-faithful local visuals, no runtime PDF/page-image reader, and no remote/runtime service dependency.

## Governing Delivery Unit

The active user requirement is `одна глава - один пр`.

- One source manual chapter equals one implementation content PR from this point forward.
- A chapter PR may contain multiple website section pages/topics from that chapter.
- A chapter PR must not bundle separate source chapters.
- Appendices are chapter-equivalent PR units: Appendix I, Appendix II, Appendix III, and Appendix IV each get one PR.
- Chapter 2 is the next likely chapter-level content PR from a fresh latest-main base.
- Chapter 1 is already merged through PR #184 and must not be reimplemented inside Chapter 2 or later chapter PRs.
- Source PDF pages remain source/crop/QA metadata only. They are not user-facing route boundaries and not PR boundaries.
- Shared prerequisite, durable-guideline, tooling/checker, audit, or correction PRs may exist when explicitly planned and assigned, but they must not silently include unrelated chapter content.

## Front Matter Disposition

Front matter pages `1-13` are not a normal chapter. They receive a separate front-matter support disposition rather than being silently omitted or mixed into a chapter PR.

Architect disposition:

- Implement front matter as one optional-but-required-for-full-completion support PR after the visual-rule prerequisite work and before final full-manual validation, unless Orchestrator records a safer later order.
- In that PR, implement learner-useful front matter as support routes under `Руководство`, especially `front-presentation` and `front-glossary`.
- Omit or keep navigation-only the book-only/source-structure pages that do not improve exam learning: title page `1`, category/source-scope page `3` if it is only catalog metadata, and index pages `12-13` because the runtime navigation already represents the source `Índice`.
- Record per-page source-backed evidence for each included or omitted front-matter page.
- Do not use front matter to bundle chapter content.

If source inspection shows page `3` has learner-relevant category constraints, Implementation Agent records feedback for Architect disposition before omission.

## Source Unit Inventory

| Unit | Source pages | Current disposition | PR unit |
| --- | ---: | --- | --- |
| Front matter | `1-13` | Separate support disposition; include learner-useful presentation/glossary, omit title/index/book-only material with evidence | one front-matter support PR |
| Introduction | `14-20` | Already implemented; audit under stricter visual rules | correction PR only if audit finds gaps |
| Chapter 1 | `21-42` | Already merged through PR #184 at `b07d5c72bf1689e7dac480e937c366a528d20299`; audit under stricter visual rules | correction PRs only if audit finds gaps |
| Chapter 2 | `43-56` | Pending; next likely chapter-level content PR | one chapter PR |
| Chapter 3 | `57-88` | Pending | one chapter PR |
| Chapter 4 | `89-97` | Pending | one chapter PR |
| Chapter 5 | `98-103` | Pending | one chapter PR |
| Appendix I | `104-122` | Pending; chapter-equivalent | one appendix PR |
| Appendix II | `123-151` | Pending; chapter-equivalent | one appendix PR |
| Appendix III | `152-183` | Pending; chapter-equivalent | one appendix PR |
| Appendix IV | `184-200` | Pending; chapter-equivalent; sign/marking-heavy | one appendix PR |

Chapter and appendix child sections remain website section pages inside their chapter-equivalent PRs. Route/section boundaries come from `navigation.ru.json` source `Índice` children, with source-backed corrections allowed only through recorded Architect disposition.

## Remaining Section Inventory

### Chapter 2: `43-56`

| Section id | Source title | Russian title | Source pages | Notes |
| --- | --- | --- | ---: | --- |
| `ch2-legal-responsibility` | `Responsabilidad juridica` | `Юридическая ответственность` | `44-45` | Legal precision: Law 2148, responsibility types, sanctions, alcohol, fleeing scene, footnote substance. |
| `ch2-required-documents` | `Documentacion obligatoria` | `Обязательные документы` | `46-50` | Document precision: DNI/license, novice rules, `0.0 g/L`, insurance, VTV/RTO, GNC, sticker/certificate visuals. |
| `ch2-incident-obligations` | `Obligaciones en caso de incidentes viales` | `Обязанности в случае дорожных инцидентов` | `51-55` | Owns page `55` only before Scoring; phone/contact details need retention and volatility disposition. |
| `ch2-scoring` | `Sistema de puntos Scoring` | `Система баллов Scoring` | `55` | Use feature `030` correction: Scoring starts on page `55`; page `56` is closing slogan, not Scoring content. |

### Chapter 3: `57-88`

| Section id | Source title | Russian title | Source pages |
| --- | --- | --- | ---: |
| `ch3-priority-of-rules` | `Prioridad normativa` | `Приоритет норм` | `58-63` |
| `ch3-right-of-way` | `Prioridad de paso` | `Преимущество проезда` | `64-66` |
| `ch3-lights` | `Uso de luces` | `Использование света` | `67-68` |
| `ch3-speed` | `Velocidad` | `Скорость` | `69-74` |
| `ch3-turns` | `Giros en intersecciones` | `Повороты на перекрестках` | `75` |
| `ch3-overtaking` | `Adelantamiento y sobrepaso` | `Обгон и опережение` | `76-77` |
| `ch3-highways` | `Circulacion por autopistas y otras vias rapidas` | `Движение по автомагистралям и другим скоростным дорогам` | `78` |
| `ch3-adverse-conditions` | `Conduccion en condiciones adversas` | `Вождение в неблагоприятных условиях` | `79-82` |
| `ch3-stopping-parking` | `Detencion y estacionamiento` | `Остановка и стоянка` | `83-88` |

### Chapter 4: `89-97`

| Section id | Source title | Russian title | Source pages | Notes |
| --- | --- | --- | ---: | --- |
| `ch4-alcohol-drugs` | `Consumo de alcohol y drogas` | `Употребление алкоголя и наркотиков` | `90-92` | Numeric/legal thresholds and impairment effects must be retained. |
| `ch4-sleep-fatigue` | `Sueno y fatiga` | `Сон и усталость` | `93-94` | Shares page `94`; preserve source-backed boundary before `ch4-stress`. |
| `ch4-stress` | `Estres` | `Стресс` | `94` | Navigation already requires direct opening on page `94`. |
| `ch4-distractions` | `Distracciones` | `Отвлечения` | `95-97` | Navigation already requires direct opening on page `95`. |

### Chapter 5: `98-103`

| Section id | Source title | Russian title | Source pages |
| --- | --- | --- | ---: |
| `ch5-attitude-types` | `Tipos de actitudes` | `Типы установок` | `99` |
| `ch5-equal-society` | `Hacia una sociedad igualitaria` | `К равноправному обществу` | `100` |
| `ch5-gender-violence-prevention` | `Prevencion y asistencia en situaciones de violencia de genero` | `Профилактика и помощь в ситуациях гендерного насилия` | `100` |
| `ch5-anticipatory-efficient-driving` | `Conduccion preventiva y eficiente` | `Предупредительное и эффективное вождение` | `101-103` |

### Appendix I: `104-122`

| Section id | Source title | Russian title | Source pages |
| --- | --- | --- | ---: |
| `app1-safety-elements` | `Elementos de seguridad` | `Элементы безопасности` | `105-118` |
| `app1-other-required-safety-elements` | `Otros elementos de seguridad obligatorios` | `Другие обязательные элементы безопасности` | `119-120` |
| `app1-recommended-safety-elements` | `Elementos de seguridad recomendados` | `Рекомендуемые элементы безопасности` | `121-122` |

### Appendix II: `123-151`

| Section id | Source title | Russian title | Source pages |
| --- | --- | --- | ---: |
| `app2-social-responsibility` | `Responsabilidad social` | `Социальная ответственность` | `124` |
| `app2-safety-elements` | `Elementos de seguridad` | `Элементы безопасности` | `125-136` |
| `app2-driving-factors` | `Factores que intervienen en la conduccion` | `Факторы, участвующие в вождении` | `137-143` |
| `app2-safe-driving` | `Conduccion segura` | `Безопасное вождение` | `144-148` |
| `app2-highways-hospitals` | `Autopistas y hospitales` | `Автомагистрали и больницы` | `149-151` |

### Appendix III: `152-183`

| Section id | Source title | Russian title | Source pages |
| --- | --- | --- | ---: |
| `app3-cargo-driver-profile` | `Perfil del transportista de carga` | `Профиль перевозчика грузов` | `153-154` |
| `app3-social-responsibility` | `Responsabilidad social` | `Социальная ответственность` | `155-159` |
| `app3-driving-factors` | `Factores que intervienen en la conduccion` | `Факторы, участвующие в вождении` | `160-161` |
| `app3-safe-driving` | `Conduccion segura` | `Безопасное вождение` | `162-168` |
| `app3-safety-elements` | `Elementos de seguridad` | `Элементы безопасности` | `169-181` |
| `app3-highways` | `Autopistas` | `Автомагистрали` | `182-183` |

### Appendix IV: `184-200`

| Section id | Source title | Russian title | Source pages | Notes |
| --- | --- | --- | ---: | --- |
| `app4-signs-regulatory` | `Reglamentarias` | `Предписывающие` | `185-186` | Official traffic signs source-as-is. |
| `app4-signs-warning` | `Preventivas` | `Предупреждающие` | `187-188` | Official traffic signs source-as-is. |
| `app4-signs-informational` | `Informativas` | `Информационные` | `189-192` | Official traffic signs source-as-is. |
| `app4-signs-temporary` | `Transitorias` | `Временные` | `193-194` | Official traffic signs source-as-is. |
| `app4-signs-horizontal` | `Horizontales` | `Горизонтальные` | `195-196` | Road-marking images source-as-is. |
| `app4-signs-traffic-lights` | `Senalizacion luminosa` | `Световая сигнализация` | `197-200` | Signal images/source diagrams source-as-is unless non-sign infographic cleanup is explicitly evidenced. |

## Controlling Visual Requirements

These requirements are acceptance gates, not polish guidance:

1. New image/crop extraction/export must be high resolution with an x5 zoom/source export target, or documented equivalent/better evidence. Evidence must record method, source page/render, output dimensions, hash where practical, and why the result is not upscaled or degraded.
2. Photos, traffic-sign images, and road-marking images must remain unmodified source-as-is. This forbids translation, relabeling, redraw, recolor, cleanup, reconstruction, retouching, masking, inpainting, or cropping that removes meaningful content. Russian explanation belongs outside the image.
3. Infographics must be transferred as high-quality source images, not redrawn or reconstructed. Spanish cleanup is allowed only at glyph/letter level, restoring each letter area with surrounding background pixels/colors while preserving connectors, shapes, pictograms, borders, and spacing. Broad boxes, plates, patches, masks, DOM label backgrounds, and opaque rectangles are forbidden. Russian overlay text should be selectable DOM/SVG when feasible without modifying the source image.

These rules strengthen, and do not replace, existing rules against runtime PDF viewers, full-page raster pages, remote assets, generic icon substitution, visible Spanish residue outside explicit source-as-is exceptions, or unselectable Russian learning text.

## Correction And Audit Requirements

Already merged Introduction and Chapter 1 content must be audited under the stricter visual requirements before final full-document completion.

Audit/correction disposition:

- Create a separate visual-rule audit PR or audit task slice before or alongside the next chapter PR, depending on Orchestrator sequencing.
- The audit must inspect Introduction pages `14-20` and Chapter 1 pages `21-42`, including named Introduction fixtures from the durable guidelines and all Chapter 1 implemented sections.
- If no gaps are found, record evidence and no-fix disposition in process memory.
- If gaps are found, correction PRs must be explicit and scoped as shared/prerequisite or affected section/chapter correction PRs. They must not be mixed silently into unrelated Chapter 2+ content PRs.
- High-risk already merged areas include Introduction infographics, Chapter 1 source-image crops, traffic signs, sign-like markings, road markings, and any visual reconstructed from DOM/CSS/SVG rather than transferred source imagery.

## User Stories

### Story 1

As a Russian-speaking learner, I want the full official manual available inside `Руководство`, so I can study all exam-relevant source material without switching to a PDF viewer or separate Spanish document.

### Story 2

As a learner with low Spanish proficiency, I want Russian text and labels to be selectable and natural, while source details stay accurate, so I can understand legal, safety, document, and sign material without losing exam-critical meaning.

### Story 3

As the project owner, I want one chapter-level PR per remaining source chapter and explicit visual-fidelity evidence, so the manual can be finished steadily without page/section PR churn or low-quality visual shortcuts.

## Acceptance Criteria

1. Given the remaining manual work starts, when Orchestrator assigns content implementation, then each remaining source chapter or appendix is assigned as one content PR and no content PR bundles separate chapters.
2. Given Chapter 2 is assigned, then it starts from fresh latest `main` and implements only Chapter 2 sections, with Chapter 1 preserved as already merged through PR #184.
3. Given front matter is considered, then pages `1-13` receive explicit include/omit evidence and are not silently ignored or mixed into a chapter PR.
4. Given a chapter PR is reviewed, then every source `Índice` child section in that chapter has source-range metadata, content coverage evidence, visual asset evidence, and responsive/selectable-text evidence.
5. Given a new visual asset is extracted, then evidence records x5 zoom/source export target or equivalent/better method, source region, output dimensions, hash where practical, and no degraded/upscaled runtime use.
6. Given a photo, traffic sign, or road-marking image appears, then the runtime image is an unmodified high-quality source image/crop and Russian explanation appears only outside the image.
7. Given an infographic appears, then it is a high-quality transferred source image; Spanish cleanup, if any, is glyph/letter-level only; shapes/connectors/pictograms remain source-faithful; Russian overlay text is selectable DOM/SVG where feasible.
8. Given ordinary headings, prose, lists, callouts, captions, tables, and labels are rendered, then Russian text is selectable/copyable DOM or SVG text and does not require horizontal scrolling.
9. Given fixed visual blocks need source layout preservation, then any horizontal scrolling is contained to the visual block and verified on mobile.
10. Given Introduction and Chapter 1 already exist, then stricter visual-rule audit evidence or explicit correction PRs are recorded before final full-document completion.
11. Given runtime/manual rendering is scanned, then no PDF viewer, PDF.js render, iframe/object/embed PDF, full-page raster/page-image transcript, side-by-side Spanish/Russian reader, remote manual asset, runtime fetch, backend endpoint, analytics call, live AI call, or remote font dependency is introduced.
12. Given final validation starts, then the cycle PR set records every contributing prerequisite, audit, correction, front-matter, chapter, and appendix PR with head SHA, status, evidence, merge state, and inclusion in final validation.
13. Given final completion is claimed, then final Architect validation passes before final Analyst validation, all required checks are green on current PR heads, blocking review findings are resolved, process memory is current, and any post-validation evidence-only commit passes Orchestrator's current-head guard.

## Negative Scenarios

1. Completing all remaining manual content in one giant PR.
2. Returning to source-PDF-page-per-PR or website-section-per-PR slicing for future content after the user requested one chapter per PR.
3. Bundling Chapter 2 with Chapter 3, or bundling any appendix with another chapter/appendix.
4. Silently omitting appendices or front matter without explicit disposition.
5. Reimplementing or modifying Chapter 1 inside unrelated Chapter 2+ content PRs instead of a scoped correction PR.
6. Rendering manual content through a runtime PDF viewer, full-page raster, side-by-side Spanish/Russian screenshot reader, or image-only Russian page.
7. Rasterizing Russian learning text when DOM/SVG selectable text is feasible.
8. Translating, relabeling, redrawing, recoloring, cleaning, reconstructing, retouching, masking, or inpainting photos, traffic signs, or road markings.
9. Redrawing infographics as approximate CSS/SVG/icon diagrams instead of transferring high-quality source images.
10. Removing Spanish infographic text with broad masks, boxes, plates, patches, or opaque backgrounds.
11. Leaving Spanish text visible in non-exempt learner-facing infographic artwork after cleanup.
12. Replacing source visuals with generic icons, approximate diagrams, low-resolution crops, cropped fragments, or text-only substitutes.
13. Removing legal, numeric, safety, sign, document, restriction, exception, ordered-list, phone/contact, or scoring details without Architect disposition.
14. Adding remote assets/fonts, runtime network calls, backend behavior, analytics, live AI, or unrelated product behavior.

## Functional Requirements

- FR-001: `Руководство` remains the single user-facing interactive manual destination.
- FR-002: Source `Índice` hierarchy controls chapter, appendix, and section organization.
- FR-003: Remaining source chapters and appendices are implemented one content PR per chapter-equivalent unit.
- FR-004: Chapter 1 is recorded as merged through PR #184; Chapter 2 is the next likely content PR from fresh latest `main`.
- FR-005: Front matter pages `1-13` receive the support-route disposition described above.
- FR-006: Each chapter PR must preserve all source child sections in source order and include all exam-relevant text, visuals, lists, tables, signs, diagrams, captions, and legal/document details.
- FR-007: Runtime content uses native HTML/CSS/SVG/local assets only; runtime PDF rendering, remote assets, backend calls, live AI, and remote fonts are forbidden.
- FR-008: Russian learning text is selectable/copyable DOM or SVG text where feasible.
- FR-009: New visual extraction evidence must prove x5 zoom/source export target or documented equivalent/better quality.
- FR-010: Photos, traffic-sign images, and road-marking images are unmodified source-as-is runtime assets.
- FR-011: Infographics are transferred as high-quality source images; cleanup is glyph/letter-level only; Russian overlay text is selectable DOM/SVG where feasible.
- FR-012: Visual metadata records source unit, section id, page(s), region(s), asset path, extraction/export method, dimensions, hash where practical, cleanup scope, visible-Spanish status, exceptions, and screenshot evidence.
- FR-013: Visual checker/tests reject low-resolution assets, broad masks/plates/patches, translated/reconstructed signs/markings/photos, approximate infographic redraws, visible Spanish residue outside explicit source-as-is exceptions, and missing source metadata.
- FR-014: Normal prose must be responsive; fixed visual block scrolling is allowed only when needed for source fidelity and must be contained.
- FR-015: Durable manual conversion guidelines and checker/evidence schema should be updated through a separate planned task before broad implementation if current docs/tooling do not enforce the stricter visual rules.
- FR-016: Introduction and Chapter 1 receive audit evidence and scoped corrections if needed before final full-document completion.
- FR-017: Implementation Agents update `tasks.md` process memory with decisions, dead ends, known issues, verification evidence, feedback, and cycle PR-set rows.
- FR-018: Review Agent checks role boundaries, complete feature memory, chapter-level scope, source-fidelity evidence, no sibling-work mutation, and final-validation compliance.
- FR-019: Orchestrator tracks the cycle PR set and invokes final Architect validation before final Analyst validation.
- FR-020: Effective content head markers and current-head guards are required when evidence-only commits follow final validation.
- FR-021: Cleanup is out of scope unless Orchestrator assigns Cleanup Agent work with approved roots and positive-proof validation.

## Assumptions

- The official source manual remains `content/official-documents/originals/gcba-manual-vehiculo-4-ruedas-2023.pdf` with the previously validated 200-page local render set.
- Existing `manual.ru.json`, `layout.ru.json`, `navigation.ru.json`, and local page images are source/reference inputs, not the final runtime model.
- Appendix IV can fit one chapter-equivalent PR despite being sign-heavy; if implementation proves this unsafe, Implementation Agent records feedback and stops for Architect/Orchestrator disposition before splitting.
- The x5 export requirement is an extraction-quality target. Equivalent/better evidence may include direct high-DPI PDF export, source-native raster dimensions above x5, or crop dimensions that exceed the rendered runtime size without browser upscaling.
- Front-matter glossary is learner-useful enough to implement unless source inspection proves it duplicates a better existing vocabulary surface and Architect records an omission disposition.

## Open Questions For Orchestrator

- No blocking user clarification is required before implementation planning proceeds.
- Orchestrator should decide sequencing between the visual-rule prerequisite PR, Introduction/Chapter 1 audit PR, and the Chapter 2 content PR based on worktree/PR availability and risk.
- If Appendix IV proves too large for one PR, Orchestrator must route feedback to Architect before any split, because splitting would be an exception to the active user requirement.

## Success Criteria

- SC-001: The remaining manual completion work is represented by a current feature memory and a cycle PR set covering visual-rule prerequisites, audit/corrections, front matter, Chapters 2-5, and Appendices I-IV.
- SC-002: Chapter 2 lands as one chapter-level PR after fresh latest-main assignment, with Chapter 1 preserved as already merged.
- SC-003: Chapters 3-5 and Appendices I-IV each land as one chapter-equivalent PR unless a later Architect-recorded exception is accepted.
- SC-004: Front matter has implemented/omitted evidence for pages `1-13`.
- SC-005: All visual assets satisfy high-resolution, source-as-is photo/sign/marking, and source-image infographic rules.
- SC-006: Introduction and Chapter 1 have audit/correction evidence under the stricter rules.
- SC-007: Final validation and merge-readiness gates pass for the full cycle before completion is declared.
