# Spec: Manual Visual Content Crop

## Architect Scope

This Architect assignment plans feature `034-manual-visual-content-crop` only.
Architect writes only `spec.md`, `plan.md`, and `tasks.md` under
`specs/034-manual-visual-content-crop/`.

- Assigned worktree:
  `/Users/chap/devel/cabadrive-worktrees/034-manual-visual-content-crop`.
- Assigned branch: `codex/034-manual-visual-content-crop`.
- Verified latest-main base: `origin/main` at
  `7b410e6c55be177e860cf28641c5181d67890862`.
- Intake artifact:
  `specs/034-manual-visual-content-crop/feature-request.md`.
- Parallel work may exist. Preserve all sibling worktrees, branches, commits,
  PRs, dirty diffs, and process memory.
- Background: Analyst reported an earlier accidental intake write in the main
  worktree. This Architect assignment uses the Orchestrator-assigned worktree
  and does not edit `feature-request.md`.

## Goal

Correct interactive manual visuals whose useful official content is tiny inside
large white or empty page margins, and restore learner-meaningful official
visuals that were lost or never exported into the interactive guide. The fix
must return to the official source PDF or best retained official source
material, extract or crop the meaningful visual content at faithful high
quality, and render that visual large enough to inspect without pixelated
browser upscaling.

The reported defect is in the interactive `Руководство` section titled
`Официальные листы регулирующих знаков`: the image element/card is large, but
the official regulatory sign sheet is a small island near the lower center of a
mostly white page image.

## User Outcome

As a Russian-speaking learner, I can inspect official sign sheets, marking
sheets, signal sheets, maps, diagrams, photos, infographics, charts, icons, and
source-document examples in `Руководство` at readable manual size. I do not see
a huge blank page with a tiny source visual inside it, I do not lose official
visual examples that the PDF relies on for learning, and the app does not blur
the visual by stretching an insufficient raster.

## Acceptance Clarification

User clarification received after PR `#200` opened:

> проверь весь документ, изображения должны быть крупными; один из ориенторов -
> текст на изображениях, размер минимального шрифта должен быть визуально не
> меньше, чем текст документа

Architect disposition: this is a same-cycle acceptance refinement for feature
`034`, not a new feature request. The original request already required checking
the whole document and making the image content large enough to inspect without
pixelated upscaling. The clarification adds a concrete readability anchor:
where an official image contains text intended to be read, the smallest
intended-readable text inside the rendered image should be visually no smaller
than nearby manual body text. If that cannot be achieved from the official PDF
or another best available official source without pixelated upscaling or
protected-pixel edits, Implementation Agent must record a source-limited
exception for Orchestrator/user disposition rather than silently accepting
unreadable text.

Current PR `#200` evidence records Appendix IV corrected crop widths around
`664-757px` and a `source-limited-native-raster-in-official-pdf` disposition.
That may be insufficient if sign labels/captions still render below manual body
text size, even though the excessive-margin bbox ratios are corrected. Follow-up
implementation evidence is required before review/final validation.

Latest user clarification after the source-limited Appendix IV evidence:

- Whole official sign sheets are not enough when individual signs and captions
  remain tiny. The official/original source can provide good quality for at
  least individual signs such as `NO AVANZAR`; implementation should extract or
  render from the official PDF/original at maximum practical quality and make
  the signs themselves large.
- Captions under signs such as `NO AVANZAR` must be translated into Russian
  only when they are external captions/labels below or near the sign and are
  not part of the sign itself.
- Protected source rule is stricter than prior shorthand: do not translate,
  edit, clean, redraw, mask, retouch, replace, or alter anything inside the
  sign body, including text inside a sign, supplementary plates/tablets, or
  small placards that are part of the official sign/plate visual. Those pixels
  must remain exactly as original source pixels.
- The hospital map (`app2-hospital-map-source-card`, `Исходная карта больниц`)
  must be sourced from the original at the best available quality so map labels
  are readable at a visual font size no smaller than document body text. Do not
  translate or modify anything inside the map image.
- The previous `source-limited-exception` path is no longer acceptable for
  these user-highlighted visuals unless implementation has exhausted official
  original extraction options and records a narrow evidence-backed blocker for
  Orchestrator/human disposition.

Architect disposition: this is still same-cycle acceptance refinement for
feature `034`, and it blocks final validation until implemented and evidenced.
Existing source-limited Appendix IV evidence is useful diagnostic evidence, but
it is not sufficient completion evidence.

Additional user clarification: the visual size relationship between source
image content and document body text must match the official original's
readability relationship. Images should be taken at the best available quality
and displayed larger, not rendered so image labels/captions are smaller than
the guide's body text. The user also called out learner-facing Russian copy that
sounds like internal provenance or service commentary, for example
`Визуал источника: правильный ремень`,
`Визуал источника: положение подголовника`,
`Фотографии сохранены как исходный фрагмент...`, and
`Главный вывод источника`. Runtime guide copy visible to learners must be
rewritten as normal adapted Russian learning copy. Internal evidence, specs,
validation records, source metadata, and provenance files may keep technical
source wording.

Additional visual-completeness clarification: the user now reports that many
official images appear to have been lost or not exported into the interactive
guide. Concrete required missing-image candidates include:

- the tire manufacturing/date and tread-life visual with headings
  `Fecha de Fabricación` and `Vida útil de los Neumáticos`;
- the blind-spot full-width visual headed `¿A qué se denomina punto ciego?`
  with `PUNTO CIEGO AUTOS`, `PUNTO CIEGO MOTOS`,
  `CAMIONES Y COLECTIVOS`, and the blue sentence
  `Cuanto más grande es el vehículo, mayor es el punto ciego.`;
- the `Matafuegos` visual/icon from the official manual;
- the `Chaleco reflectivo` visual/icon from the official manual.
- the public-space visual currently reconstructed in Russian as
  `СКОЛЬКО МЕСТА НУЖНО 50 ЛЮДЯМ, ЧТОБЫ ПЕРЕДВИГАТЬСЯ?`, with labels
  `НА АВТОБУСЕ`, `ПЕШКОМ`, `НА ВЕЛОСИПЕДЕ`, and `НА АВТОМОБИЛЕ`.

Architect disposition: this is the same feature cycle. The original request
said to check the whole document and fix all similar cases; the acceptance now
explicitly includes completeness, not only crop/readability of image cards that
already exist in runtime data. Final validation remains blocked until the
implementation compares official PDF visual regions against the current guide,
adds the missing learner-meaningful visuals, and records a narrow disposition
for any official visual that is intentionally omitted or impossible to export
faithfully.

## Consolidated User Requirements (2026-06-05)

This section is the canonical Architect memory for feature `034` after the
latest user clarifications. If other notes in this file are more granular, they
serve this consolidated contract.

1. Whole-document visual completeness audit:
   Check the entire interactive `Руководство` against the official PDF/manual.
   All learner-meaningful images, diagrams, photos, infographics, maps, sign
   sheets, charts, icons, and similar visuals that convey a rule, risk,
   classification, comparison, example, label, or visual term must be present
   in the guide or explicitly dispositioned with evidence. Missing examples
   called out by the user include the tire manufacturing/date and tread-life
   visual (`Fecha de Fabricación`, `Vida útil de los Neumáticos`), the
   blind-spot visual (`¿A qué se denomina punto ciego?`), `Matafuegos`,
   `Chaleco reflectivo`, the hospital map, Appendix IV signs, headrest
   diagrams, and the sustainable mobility/public-space visual about how much
   space `50` people need when moving by bus, walking, bicycle, or car.

2. Image quality and scale:
   Images must be exported from the official PDF/original at the best available
   faithful quality. Do not merely stretch a low-resolution bitmap; use
   high-scale official PDF/original extraction where available. Runtime image
   size must preserve approximately the original relationship between image
   content and document body text. Internal image text/labels should be
   visually no smaller than the surrounding document text unless the official
   original itself makes them smaller and a narrow evidence-backed disposition
   records that. Concrete scale guidance: the extinguisher in `Matafuegos` is
   about `15` lines of text tall in the original and should remain roughly that
   scale, not a thumbnail. Remove large empty/white fields around images; if
   the original image spans page width without extra white margins, runtime
   should also be full-width/tight.

3. Protected-image fidelity:
   Insert official visuals as-is unless a prior accepted feature explicitly
   allowed text cleanup/overlays for a specific infographic. Do not redraw,
   vector-recreate, retouch, recolor, mask, inpaint, clean, replace, or
   translate protected pixels inside images. For maps and the
   blind-spot/headrest/tire/extinguisher/vest/public-space visuals, use the
   original image; do not translate or modify text inside the image.

4. Term translations under images:
   For visuals with Spanish terms inside the image, keep the image unchanged
   and add a separate Russian translation of the terms below/near the image as
   normal selectable DOM text. The latest headrest example
   (`Altura apoyacabeza`, `Distancia del apoyacabeza`, `Bueno`, `Aceptable`,
   `Regular`, `Malo`, `Botón de desbloqueo`) must be shown as-is, not split or
   redrawn; translations of terms go outside the image. Similar images should
   follow this same pattern: original protected image first, separate Russian
   glossary/legend below.

5. Appendix IV traffic signs:
   Whole sign sheets are not enough when signs/captions remain tiny. Use
   maximum practical official PDF/original extraction and a layout with large
   individual signs, sign rows, or source-faithful panels. Translate only
   external captions/labels under or near signs when they are proven not to be
   part of the sign/plate visual. Never translate or alter text/pixels inside
   the sign body, supplementary plates/tablets, or official sign placards.
   Example: `NO AVANZAR` under a sign should be translated only if it is an
   external catalog caption; nothing inside signs/tablets/plates may be
   changed.

6. Hospital map:
   Replace or re-extract `Исходная карта больниц` /
   `app2-hospital-map-source-card` from the best official original source so
   map labels are readable at document-body-text scale. Do not translate or
   alter anything inside the map image.

7. Blind-spot visual:
   Insert/display the official blind-spot image as-is from the official
   original. In the original it is page-width and has no large blank white
   fields; runtime must be full-width/tight and not a small centered image
   inside a large blank area. Do not translate image internals; term
   translations/explanation, if needed, go outside.

8. Learner-facing Russian copy cleanup:
   Audit the entire runtime guide for service/provenance wording such as
   `источник`, `Визуал источника`, `из источника`, `исходный фрагмент`,
   `рабочий фрагмент`, `Главный вывод источника`, and similar. Rewrite
   learner-facing titles/bodies/captions into normal adapted Russian learning
   copy, not meta commentary about source/provenance. Internal
   evidence/spec/provenance fields may still use technical `source` wording.
   The cleanup applies to learner-visible Russian strings in the guide.

9. Evidence and tests:
   Implementation must produce a visual inventory comparing official PDF
   visual regions to runtime guide visuals. Evidence must list present, added,
   missing, and dispositioned visuals, with source page/region, extraction
   method/scale, asset dimensions, hash, runtime display size, no-upscale
   proof, and screenshots. Add/update tests or audit scripts so missing
   meaningful visuals, tiny image displays, large blank margins,
   protected-image edits, and learner-facing source/provenance wording
   regressions are caught. Required verification includes focused content
   tests, guide/content validation, TypeScript, Playwright screenshots for
   representative pages, `git diff --check`, and full preflight if feasible.

10. Completion gate:
    Final validation is blocked until the full-document visual completeness
    audit, required missing-image additions, image quality/scale fixes,
    protected-image rules, separate term translations, Appendix IV sign fix,
    hospital map fix, blind-spot visual, public-space visual, and
    learner-facing copy cleanup are implemented and evidenced, or a narrow
    evidence-backed blocker is routed to Orchestrator/human. Validation and
    build commands must also prove committed evidence is current without
    silently rewriting tracked evidence files.

## Current Review Feedback Disposition

Architect disposition `2026-06-05T17:30:29-03:00`: AI Review finding on PR
`#200` head `77126c397bdb26c8d0fa356cceadede516267fda` is a same-cycle
required fix for feature `034`.

The finding reports that `package.json` validation/build paths now invoke
`scripts/manual-guide-visual-completeness-audit.mjs`, but that script
unconditionally writes tracked evidence file
`content/validation/manual-guide-visual-completeness.evidence.json` with
`writeFileSync`. This can let validation or build regenerate stale committed
evidence and pass instead of detecting that the repository evidence is stale.

Required outcome:

- normal validation/build/check commands must run the visual-completeness audit
  in read-only check mode;
- read-only check mode must compute the expected evidence content and compare
  it with the committed tracked evidence file, then fail with a clear message
  when the file is missing, stale, malformed, or different;
- evidence regeneration must require an explicit opt-in such as `--write` or a
  similarly unambiguous generate command;
- package scripts used by `validate:manual-guide`, `validate:content`, `build`,
  preflight, or equivalent gates must call the read-only check path, not the
  write/regenerate path;
- implementation tests must cover stale evidence behavior, preferably by
  asserting check mode fails on a deliberately stale committed-evidence
  fixture or by proving check mode does not modify the evidence file while
  reporting a diff.

Final validation remains blocked until this review finding is fixed,
evidenced, and verified.

Implementation guidance: preserve the interrupted Swift direct PDF
source-region helper work and adapt it where useful, but treat it only as
supporting machinery. Implementation must preserve existing dirty/sibling work
and update `tasks.md` as it works.

## Context Examples From User

These concrete examples came from user screenshots or explicit user callouts.
Implementation must use them as a named evidence checklist while still auditing
the whole guide.

| User example | Why it matters | Expected implementation outcome | Review/evidence hook |
| --- | --- | --- | --- |
| Appendix IV regulatory signs: a tiny sign sheet inside huge white fields, plus a high-quality `NO AVANZAR` individual sign/caption example | This is the original reported defect and the clearest proof that whole-page sheets and whole-sheet crops can still leave signs unreadable | Use official PDF/original extraction at maximum practical quality; display large individual signs, sign rows, or source-faithful panels when full sheets remain tiny; translate only proven external captions such as `NO AVANZAR`; never translate or alter text/pixels inside signs, supplementary plates/tablets, or official sign placards | Evidence must include source page/region, per-sign/row/panel asset dimensions/hash, protected-vs-external caption boundary, no-upscale proof, desktop/mobile screenshots, and a review note confirming sign internals are unchanged |
| Hospital map: `Исходная карта больниц` / `app2-hospital-map-source-card` appears too small or low quality | The map labels are learner-facing visual information and cannot be accepted merely because the previous crop ratio looked tighter than Appendix IV | Re-extract or verify from the best official original source so map labels are readable at document-body-text scale; keep the map image unchanged inside | Evidence must include final source path/page/region, output dimensions/hash, runtime display size, label readability comparison, no-upscale proof, and screenshots with nearby body text |
| Seatbelt/headrest examples with learner-facing wording such as `Визуал источника` | This combines image scale/readability with the runtime copy problem: learners should see adapted learning copy, not provenance/service labels | Rewrite learner-facing titles, bodies, captions, and notes into normal Russian learning copy; keep protected images as original images and place any explanatory Russian text outside images | Runtime string audit must show the bad wording removed or allowlisted only for genuine citations; representative DOM/screenshot evidence should show the rewritten card copy |
| Blind-spot visual: `¿A qué se denomina punto ciego?` with `PUNTO CIEGO AUTOS`, `PUNTO CIEGO MOTOS`, `CAMIONES Y COLECTIVOS`, and blue sentence | The original visual is page-width/tight and teaches the size relationship of blind spots; a text-only summary or tiny centered image loses the visual lesson | Insert/display the official blind-spot image as-is from the official original, full-width/tight, with no large blank white fields; do not translate internals; put any translations/explanation outside | Evidence must identify the exact section/block and source page/region, include asset dimensions/hash, protected-image unchanged note, body-text scale comparison, and desktop/mobile screenshots |
| Tire manufacturing/date and tread-life visual: `Fecha de Fabricación`, `Vida útil de los Neumáticos` | User identified this as a missing/lost official visual; the tire photo/date callout, tread-life chart, and bullets convey exam-relevant maintenance rules | Export the complete learner-meaningful official visual from the PDF/original at faithful quality, crop excessive margins, display at original-like scale, and keep image internals unchanged | Evidence must include the located source page/region, added runtime section/block, dimensions/hash, no-upscale proof, body-text scale/readability comparison, and screenshots |
| `Matafuegos` and `Chaleco reflectivo` | User identified these as missing/lost official visuals; even simple icons teach mandatory safety equipment and must not become thumbnails | Add the official visuals/icons from the PDF/original at normal manual scale; for `Matafuegos`, preserve the approximate visual relation where the extinguisher is about `15` body-text lines tall | Evidence must include source page/region, added section/block, dimensions/hash, visual-height-to-line-height comparison, no-upscale proof, and screenshots |
| Headrest combined diagram: `Altura apoyacabeza`, `Distancia del apoyacabeza`, `Bueno`, `Aceptable`, `Regular`, `Malo`, `Botón de desbloqueo` | User clarified the official combined diagram should not be split, redrawn, or internally translated | Insert/display the original combined image as-is; provide Russian term translations as a separate selectable DOM glossary/legend below or near the image | Evidence must include protected-image unchanged note, separate DOM translation content, source page/region, dimensions/hash, no-upscale proof, and screenshot showing image plus external glossary |
| `¿Cuánto espacio necesitan 50 personas para moverse?` mobility-space visual for bus, walking, bicycle, and car; current runtime appears as low-quality/reconstructed Russian image with `СКОЛЬКО МЕСТА НУЖНО 50 ЛЮДЯМ, ЧТОБЫ ПЕРЕДВИГАТЬСЯ?` | A reconstructed or pixelated runtime infographic violates protected-image fidelity and loses original scale/quality | Replace with the official original image as-is from the PDF/original, keep image text unchanged, add Russian translations for the terms underneath, remove extra margins, and preserve original-like scale relative to body text | Evidence must identify the sustainable mobility/public-space section/block, source page/region, dimensions/hash, no-upscale proof, separate DOM translations, and before/after screenshots |
| Whole-guide `источник` wording examples: `Визуал источника`, `Главный вывод источника`, `исходный фрагмент`, `рабочий фрагмент` | User sees these as bad learner-facing service/provenance language rather than natural adapted Russian learning copy | Audit all learner-visible runtime Russian strings and rewrite provenance/meta labels into normal guide copy while preserving internal source/provenance metadata | Evidence must include grep/structured string audit, explicit allowlist only for genuine legal/source citation contexts, and representative DOM/screenshot examples |

## Relationship To Feature `032`

Feature `032-manual-figures-full-width` corrected the layout defect where
major `source-image-cards` were constrained to thumbnail-like columns. It added
explicit `displayMode`, no-upscale metadata, and full-width card rendering.

This feature is a follow-up, not a repeat of `032`. A card can now be
full-width while still failing the user because the underlying image is a
full-page raster with excessive blank margins. Feature `034` targets the source
asset/crop quality and useful-content ratio of the visual itself.

## Scope

In scope:

- Correct the reported regulatory sign-sheet case, including Appendix IV pages
  `185` and `186` unless implementation proves a narrower mapping.
- For Appendix IV signs, prefer individual official sign/source fragments,
  sign rows, or another source-faithful layout over whole sheets when the whole
  sheet keeps signs or captions smaller than document text.
- Translate external Spanish captions/labels under or near signs into Russian
  DOM text when those captions are not part of the protected sign/plate visual.
- Inspect the whole interactive manual/document for similar excessive-margin
  visual assets, not only the reported section.
- Compare the whole official PDF/manual page by page against current
  interactive guide visual blocks/assets to identify missing learner-meaningful
  visuals, not only flawed visuals that already exist as runtime cards.
- Add/export missing learner-meaningful official visuals from the PDF/original
  at best available faithful quality, with no large blank margins and with
  runtime size matching the original image-to-document-text relationship.
- Include as concrete required candidates the tire manufacturing/date and
  tread-life visual, the blind-spot full-width visual, `Matafuegos`, and
  `Chaleco reflectivo`.
- Treat Appendix IV page-sheet assets `185-200` as a high-risk group because
  they share the same sign/marking/signal sheet pattern.
- Include all current `source-image-cards`, `source-artwork` blocks, bespoke
  manual visual assets, and any other interactive manual images that could show
  useful content as a tiny island inside a larger raster.
- Re-extract, re-export, or crop affected visuals from
  `content/official-documents/originals/gcba-manual-vehiculo-4-ruedas-2023.pdf`
  or a better retained official source asset.
- Preserve official signs, road markings, signals, photos, maps, and
  source-document examples as source-faithful protected imagery. Cropping empty
  margin is allowed; editing meaningful pixels is not.
- Preserve everything inside sign bodies, supplementary plates/tablets, and
  small placards that are part of the official sign/plate visual exactly as
  original source pixels.
- Re-extract the hospital map from the official original/best retained source
  at the highest practical faithful quality and make its map labels readable
  without translating or modifying the image.
- Audit the whole runtime `Руководство` guide for learner-facing Russian copy
  that uses technical/provenance wording such as `источник`,
  `Визуал источника`, `из источника`, `исходный фрагмент`,
  `рабочий фрагмент`, `Главный вывод источника`, and similar formulations.
  Rewrite those user-visible strings as normal adapted Russian learning copy.
- Keep Russian explanation as selectable DOM/SVG text outside protected images.
- Add inventory, extraction/crop provenance, natural-dimension, hash,
  useful-content ratio, runtime display, and no-upscale evidence.
- Preserve the full-width/no-upscale layout contract from feature `032`.
- Update durable manual conversion documentation only if implementation changes
  reusable crop/inventory/evidence rules.

Out of scope:

- CSS-only zoom, transform, object-fit/object-position, or browser scaling of
  the existing margin-heavy raster as the primary fix.
- Stretching or distorting aspect ratios.
- Cropping meaningful official sign, label, road-marking, map, diagram, photo,
  caption, or source-document pixels.
- Translating, relabeling, redrawing, recoloring, cleaning, retouching,
  masking, inpainting, reconstructing, vector-recreating, or replacing
  protected official source imagery.
- Translating or altering text inside a sign body, supplementary plate/tablet,
  or placard that is part of the protected official sign visual.
- Moving Russian text into protected images or overlaying Russian labels on
  protected sign/map/photo pixels.
- Replacing `Руководство` with a runtime PDF viewer, PDF.js canvas,
  iframe/object/embed PDF, remote image, network fetch, backend endpoint, or
  full-page raster-only reader.
- Changing practice questions, exam mode, content availability mode, source
  archive policy, Docker runtime contract, or unrelated product surfaces.
- Removing source/provenance metadata from internal evidence, specs, validation
  files, or data fields that are not rendered as learner-facing copy. The copy
  cleanup applies to runtime guide text visible to learners.

## Visual Completeness Criteria

Implementation must audit the official PDF/manual as the ground truth for
learner-meaningful visuals. The audit must compare PDF visual regions against
the interactive guide, not merely enumerate assets already referenced by
runtime data.

Classify every visible PDF region that is not plain body text into one of:

- `learner-meaningful-present`: it conveys a rule, risk, classification,
  comparison, example, map, diagram, chart, sign, marking, signal, photo,
  visual label, or safety object, and is present in the guide;
- `learner-meaningful-added`: it was missing and is added by this feature;
- `learner-meaningful-missing-blocker`: it appears required but cannot be
  exported faithfully after official-source attempts, with a narrow blocker for
  Orchestrator/human disposition;
- `explicitly-omitted`: it is decorative, a background flourish, repeated
  simple page furniture, or a simple icon whose meaning is already fully
  represented elsewhere, with rationale;
- `duplicate-covered`: it repeats the same official visual already shown in a
  nearby or canonical guide block, with the covering block named.

The default is conservative: if a PDF visual conveys a rule, risk,
classification, comparison, example, diagram, map, sign, marking, signal,
chart, photo, visual label, or safety object, it must be present in the guide
or explicitly dispositioned with evidence. Decorative/background/page-furniture
items may be omitted only when the evidence explains why they do not teach or
identify exam-relevant content.

Concrete required candidates:

- Tire visual: locate the official source page/section for the visual headed
  `Fecha de Fabricación` and `Vida útil de los Neumáticos`, including the tire
  photo/date callout, tread-life chart, and associated bullet text. Export and
  insert it, or record a narrow official-source blocker.
- Blind-spot visual: locate the official source page/section for
  `¿A qué se denomina punto ciego?` with `PUNTO CIEGO AUTOS`,
  `PUNTO CIEGO MOTOS`, `CAMIONES Y COLECTIVOS`, and the blue sentence
  `Cuanto más grande es el vehículo, mayor es el punto ciego.` The source text
  index suggests the mirrors/blind-spots area around official page `108`, with
  possible related material around page `128`; implementation must verify the
  exact owning guide block. The image must be displayed as-is from the official
  original, full-width like the original, without large blank fields, and with
  protected image text unchanged.
- `Matafuegos` and `Chaleco reflectivo`: locate the official source
  page/section for the extinguisher and reflective vest visuals/icons and add
  them at normal manual scale. For the extinguisher example, use the user's
  size anchor: the extinguisher height in the official layout is roughly
  equivalent to about `15` lines of surrounding document text, so runtime must
  preserve approximately that relation instead of shrinking the icon to a
  thumbnail card.

For each present/added/dispositioned learner-meaningful visual, evidence must
record PDF page, source region, official source path, runtime section/block,
asset path, natural dimensions, hash where practical, runtime display size,
no-upscale status, and visual-size/readability disposition.

## Excessive-Margin Criteria

Implementation must produce a whole-manual inventory that records both
automatic measurements where feasible and manual reviewer dispositions.

Use the Orchestrator-provided one-off evidence as the baseline:

| Asset | Natural size | Approx useful bbox | Bbox area ratio | Ink ratio |
| --- | ---: | ---: | ---: | ---: |
| `sign-sheet-185-source-as-is.jpg` | `2976x4209` | `1190,1682,503x821` | `0.0330` | `0.0040` |
| `sign-sheet-186-source-as-is.jpg` | `2976x4209` | `1242,1682,544x821` | `0.0357` | `0.0043` |
| `sign-sheet-187-source-as-is.jpg` | `2976x4209` | `1190,1682,511x821` | `0.0335` | not recorded |
| `marking-sheet-195-source-as-is.jpg` | `2976x4209` | `1190,1682,513x821` | `0.0336` | not recorded |
| `hospital-map-source-as-is.png` | current crop | not recorded | `0.4205` | not recorded |
| `body-posture-source-as-is.png` | current crop | not recorded | `0.3652` | not recorded |

Initial detector threshold may use non-white pixels where each RGB channel is
less than `245`, but implementation may refine it if evidence shows a safer
threshold for anti-aliased source artwork. The threshold and any false-positive
handling must be recorded.

A visual must be flagged for correction or explicit exception when one or more
of these apply:

- useful-content bbox area ratio is below `0.20`;
- useful-content bbox width or height ratio is below `0.60` for a major manual
  visual;
- the rendered useful-content bbox, not merely the outer image element, occupies
  less than `65%` of the manual content width on desktop or mobile when source
  quality should allow a larger display;
- the asset is a full-width/page-sheet visual but `sourceRegion` still records
  the whole PDF page/render rather than the meaningful source content;
- a reviewer can reproduce the user symptom: a huge white or empty image area
  with a tiny official visual island.

A visual may be dispositioned as acceptable when evidence shows it is already a
tight crop, intentionally sparse source material, a genuinely compact snippet,
or a source-limited case where higher-quality extraction cannot improve the
user outcome without altering official pixels.

## Image Text Readability Criteria

The whole-manual inventory must also flag images that contain text intended to
be read by the learner, including sign labels, map labels, document examples,
diagram captions, infographics, and source-visible Spanish text preserved under
approved exceptions.

For traffic-sign visuals, classify text and pixels before translation:

- `protected sign body`: the sign face, border, pictogram, text inside the sign
  face, supplementary plates/tablets, and small placards that form part of the
  official sign or sign-plus-plate visual. These pixels stay original.
- `external source caption/label`: printed catalog labels under or near a sign,
  outside the sign body and not part of the official sign/plate visual. These
  may be translated into selectable Russian DOM text; the Spanish caption may
  be omitted from the visible crop only when provenance proves it is external.

When in doubt, treat the text/pixels as protected until evidence proves the
caption is external.

Use nearby manual body text as the visual baseline. In current styling this is
typically around `1rem` or `0.93rem-1.08rem` depending on the block; tests may
measure the actual computed body/prose size at runtime instead of hard-coding a
number.

For each candidate image with readable source text:

- record whether the embedded text is required for learning, source
  traceability, or official visual identification;
- estimate or measure the smallest intended-readable text height at the
  rendered size;
- compare that text height to nearby manual body text;
- disposition the item as `readable`, `needs-larger-display`,
  `needs-better-source`, `source-limited-exception`, or another clear local
  equivalent.

Where automated OCR/text-height measurement is practical, use it. Where it is
not reliable for small source labels, Implementation Agent must perform and
record manual visual inspection with representative screenshots and a concrete
body-text comparison. A screenshot-only "looks okay" note is insufficient; the
evidence must name the inspected image, viewport, text sample, nearby body text
baseline, and pass/fail disposition.

The target is strict: the minimum intended-readable text inside the image
should be visually no smaller than nearby document text. If an official source
image cannot satisfy that target at no-upscale size, implementation must try a
better official source or strategy first. Acceptable strategies include a
higher-quality official PDF/source extraction, official source-native sign or
marking sheets retained in the archive, splitting a low-resolution sheet into
official sub-crops that can be displayed larger, or another source-faithful
presentation that does not alter protected pixels. Only after those options are
exhausted may a source-limited exception be recorded for Orchestrator/user
disposition.

For Appendix IV, a whole-sheet source-limited exception is not enough once an
individual-sign or row/fragment strategy can make signs larger while preserving
source pixels. Implementation must try source-faithful fragment extraction or
another large-sign layout before asking Orchestrator/human to accept a
source-limited blocker.

Images with text should preserve the official original's visual hierarchy: if
the original presents image labels/captions as readable text relative to the
document body, the adapted guide must not shrink those labels below the guide's
body text. If the original itself intentionally contains tiny incidental text,
record that distinction in evidence rather than using it to waive readable
labels/captions elsewhere.

## Learner-Facing Copy Criteria

Runtime guide copy must read like adapted Russian learning material, not like
an implementation/evidence report. The following wording families are banned
from learner-facing Russian text unless they appear in a genuine legal/source
citation context rather than a visual-card title, body, note, caption, or
learning explanation:

- `Визуал источника`, `визуал источника`;
- `источник` / `из источника` when used as provenance shorthand instead of
  content meaning;
- `исходный фрагмент`, `рабочий фрагмент`, `исходная схема`,
  `исходная карта`, `исходные примеры` when used as image provenance labels;
- `Главный вывод источника`;
- similar service/meta formulations that describe how the asset was obtained
  rather than what the learner should understand.

Preferred runtime copy should name the learning object directly, for example:
`Правильное положение ремня`, `Положение подголовника`,
`Карта больниц`, `Пример cédula`, `Что важно запомнить`, or other
section-specific Russian phrasing. Technical provenance remains available in
metadata/evidence, not in learner prose.

## Extraction And Crop Requirements

- Corrected affected assets must come from the official PDF or best retained
  official source material, not from AI generation, redraws, generic icons, or
  browser magnification.
- Do not enlarge a cropped low-resolution raster with a bitmap scaler and call
  it a source-quality fix.
- If the current x5 page render yields an insufficient crop width for runtime
  display, re-render the relevant source region/page at higher DPI or use a
  source-native extraction so the final crop has enough natural pixels.
- The crop should remove only excessive outer blank/empty margins. Preserve
  all meaningful signs, labels, captions, map details, diagram lines, and other
  exam-relevant source pixels.
- Add modest safety padding around the useful bbox so anti-aliased edges,
  captions, and tiny labels are not clipped. The padding amount or rule must be
  recorded.
- Prefer crop-specific asset names that make provenance clear, for example
  `sign-sheet-185-source-crop-as-is.jpg`, unless implementation records why
  replacing the existing path is safer and updates all provenance/tests.
- For corrected crops, `sourceRegion` must describe the meaningful crop region
  in the chosen source coordinate system. It must not remain the old full-page
  `0,0,2976,4209` unless an explicit exception proves the page itself is the
  meaningful visual.
- Evidence must record source page, source PDF or source asset path, crop
  bounds, extraction method, output dimensions, SHA-256 where practical,
  before/after useful-content ratio, runtime display size, and no-upscale proof.
- New corrected crops should have useful-content bbox width and height ratios
  of at least `0.75` where the source shape allows it, or a documented exception
  for intentionally sparse visuals. For page-sheet assets, target bbox area
  ratio after crop should be at least `0.55`.
- For reported sign-sheet crops, natural crop width must meet or exceed the
  intended maximum CSS display width. Prefer enough source pixels for common
  high-DPI screens when feasible; if the official source cannot provide that,
  record the source limitation and cap display rather than upscaling.
- If corrected crop widths are too small for embedded source text to meet the
  body-text readability target, do not treat the crop as complete solely because
  it passes useful bbox ratio thresholds. Find a better official source/strategy
  or record a source-limited exception for Orchestrator/user disposition.
- For sign sheets, "better official source/strategy" includes direct PDF
  source-region rendering of individual signs or rows, extraction from retained
  official original image assets where available, and source-faithful
  multi-panel layouts where each protected sign is displayed large enough.
- For the hospital map, "better official source/strategy" means the official
  original map/page/source image with maximum practical faithful extraction
  quality. The map image itself must remain untranslated and unmodified.
- For missing learner-meaningful visuals, extraction must begin from the
  official PDF/original source region, not from screenshots of the current app
  or ad hoc recreated artwork. Cropping may remove empty margin, but the
  visual itself remains source-faithful and is displayed at a size consistent
  with the original's relationship to surrounding document text.
- For simple object visuals/icons that carry learning meaning, such as
  `Matafuegos` and `Chaleco reflectivo`, do not collapse them into tiny
  thumbnails. Preserve the original manual's visual scale relationship; for
  the extinguisher, use approximately `15` lines of body text as the visual
  height anchor unless exact source evidence supports a different relation.

## Functional Requirements

- FR-001: The whole interactive manual must have an inventory for
  excessive-margin/useful-content-ratio risk across source-image cards,
  source-artwork, and bespoke visual assets.
- FR-002: Appendix IV page-sheet assets `185-200` must be scanned and
  dispositioned as a group.
- FR-003: Page `185` and page `186` regulatory sign sheets must be replaced or
  regenerated as high-quality meaningful-content crops unless implementation
  records a blocker approved by Architect/Orchestrator.
- FR-004: Any inventory item with bbox area ratio below `0.20`, or an
  equivalent manual-review tiny-content symptom, must be corrected or receive
  a specific recorded exception.
- FR-005: Corrected assets must be extracted from the official source at
  sufficient DPI/source-native quality so runtime display does not browser
  upscale beyond natural asset dimensions.
- FR-006: The useful official content, not just the outer `<img>` box, must
  occupy a meaningful share of the manual content width after correction.
- FR-007: Protected source-as-is imagery remains unedited except for removing
  empty outer margin by source-faithful cropping.
- FR-008: Existing feature `032` full-width behavior remains intact, including
  `displayMode`, no-upscale caps, panoramic contained scrolling where present,
  local assets, lazy loading, source exception attributes, and no document-level
  horizontal overflow.
- FR-009: Russian explanation remains selectable DOM/SVG text outside protected
  images.
- FR-010: Manual navigation, section order, route hashes, source page metadata,
  source archive policy, and local-first behavior remain stable.
- FR-011: Tooling/tests must catch regressions where a full-width image element
  hides a tiny useful-content island inside excessive blank margins.
- FR-012: Tooling/evidence must catch images whose useful-content bbox is large
  but whose intended-readable embedded text still renders smaller than nearby
  manual body text.
- FR-013: For any source-limited text-readability exception, Implementation
  Agent must record the better-source strategies attempted and route the
  exception for Orchestrator/user disposition before final validation.
- FR-014: Appendix IV sign visuals must render as large, inspectable official
  sign fragments/rows/panels when whole sheets keep signs or external captions
  too small. Whole-sheet display may remain as supplementary context, but it is
  not sufficient by itself for user-highlighted sign readability.
- FR-015: External sign captions/labels may be translated into Russian only
  outside protected sign pixels; text inside sign bodies, supplementary plates,
  tablets, or official sign placards remains original source pixels.
- FR-016: `app2-hospital-map-source-card` must use the best available official
  original map/source extraction, remain unmodified/untranslated inside the map
  image, and render map labels visually no smaller than nearby document body
  text or record a narrow evidence-backed blocker.
- FR-017: Runtime learner-facing `Руководство` Russian copy must not use
  provenance/service wording such as `Визуал источника`, `из источника`,
  `исходный фрагмент`, or `Главный вывод источника` for visual titles,
  captions, body text, notes, or explanations.
- FR-018: Internal technical source/provenance fields and evidence files may
  retain source terminology, but tests/audit must distinguish internal metadata
  from learner-visible runtime copy.
- FR-019: The whole official PDF/manual must be audited for learner-meaningful
  visual regions and compared against the current interactive guide visual
  blocks/assets.
- FR-020: Every learner-meaningful PDF visual must be present, added, covered
  by a named duplicate/canonical visual, explicitly omitted with rationale, or
  routed as a narrow missing-image blocker after official-source attempts.
- FR-021: The tire manufacturing/date and tread-life visual, blind-spot
  full-width visual, `Matafuegos`, `Chaleco reflectivo`, headrest diagrams,
  and sustainable mobility/public-space `50` people visual are required
  missing or replacement candidates for same-cycle implementation follow-up.
- FR-022: Added missing visuals must be exported from the official PDF/original
  at best available faithful quality, cropped to avoid excessive blank margins,
  capped against natural size, and displayed at a size preserving the original
  image-to-document-text relationship.
- FR-023: Simple meaningful icons or object visuals must not be reduced to
  thumbnails when the official manual uses them as large learning visuals; the
  extinguisher visual should be checked against the user's approximate
  `15`-body-text-line height anchor.

## Acceptance Criteria

1. Given the user opens `Официальные листы регулирующих знаков`, page `185`
   shows a high-quality source crop where the regulatory sign sheet itself
   occupies the manual reading area; the old tiny island inside a large white
   page is gone.
2. Given the user opens the same section, page `186` receives the same
   source-quality crop treatment.
3. Given Appendix IV pages `185-200` are checked, every excessive-margin
   page-sheet sibling is corrected or explicitly dispositioned with evidence.
4. Given the whole interactive manual inventory runs, every manual visual asset
   has an affected/not-affected/corrected/exception disposition with source
   page, asset path, natural dimensions, useful bbox or reviewer note, ratio
   where practical, protected status, and reason.
5. Given a corrected asset is displayed on desktop and mobile, Playwright or an
   equivalent browser check proves the useful-content bbox occupies a meaningful
   share of the manual content width and the image is not blurry from browser
   upscaling.
6. Given a corrected asset contains intended-readable text, the smallest
   intended-readable text inside the rendered image is visually no smaller than
   nearby manual body text, or a source-limited exception is recorded after
   better official source/strategy attempts and routed to Orchestrator/user
   disposition.
7. Given Appendix IV sign material is rendered, individual signs or
   source-faithful sign rows/panels are large enough to inspect; external
   catalog captions such as `NO AVANZAR` are translated into Russian DOM text
   only when proven outside the protected sign/plate visual.
8. Given a sign contains text inside the sign face, a supplementary plate, a
   tablet, or a placard that is part of the official sign visual, that text
   remains original source pixels and is not translated, redrawn, covered,
   cleaned, or replaced.
9. Given `Исходная карта больниц` is displayed, the hospital map comes from the
   official original/best retained source at maximum practical faithful quality,
   map labels are readable at body-text-equivalent visual size, and no text or
   pixels inside the map image are translated or modified.
10. Given a corrected protected sign/marking/signal/photo/map/source-document
   image is inspected, meaningful official pixels remain source-faithful and
   Russian text remains outside the image.
11. Given the adapted guide renders learner-facing Russian text for image
   titles, captions, card bodies, notes, and explanations, it does not contain
   provenance/service formulations such as `Визуал источника`,
   `исходный фрагмент`, or `Главный вывод источника`; it uses normal learning
   copy instead.
12. Given an audit scans runtime guide strings, every occurrence of
   `источник`-family wording in learner-visible Russian is either removed,
   rewritten, or explicitly allowed because it is a genuine legal/source
   citation context rather than visual provenance copy.
13. Given already tight crops such as the body-posture example are
   inventoried, they are not blindly recropped or enlarged; their disposition
   explains why their ratio and embedded text readability are acceptable or
   source-limited.
14. Given the official PDF/manual is audited, every learner-meaningful visual
   region is matched to a runtime guide visual, added, duplicate-covered,
   explicitly omitted with rationale, or recorded as a narrow
   official-source blocker.
15. Given the tire manufacturing/date and tread-life visual is present in the
   official PDF, the guide includes it from the official source at readable
   size and faithful quality, or records a narrow blocker after source
   extraction attempts.
16. Given the blind-spot visual headed `¿A qué se denomina punto ciego?` is
   present in the official PDF, the guide displays it as-is from the official
   original, full-width like the original, without large blank margins, and
   with text inside the image unchanged.
17. Given `Matafuegos` and `Chaleco reflectivo` appear as official learning
   visuals/icons, the guide includes them at normal manual scale and good
   quality; the extinguisher visual is not reduced below the approximate
   `15`-body-text-line height relationship unless source evidence supports a
   narrower disposition.
18. Given headrest diagrams contain Spanish terms such as
   `Altura apoyacabeza`, `Distancia del apoyacabeza`, `Bueno`, `Aceptable`,
   `Regular`, `Malo`, and `Botón de desbloqueo`, the original protected image
   is displayed as-is and Russian term translations are provided separately
   outside the image.
19. Given the sustainable mobility/public-space visual about how much space
   `50` people need is shown, it uses the original official image at faithful
   quality/scale, not a low-quality reconstructed Russian image; Russian term
   translations are separate DOM text outside protected pixels.
20. Given local verification runs, content tests, source-fidelity validation,
   TypeScript/build, Playwright desktop/mobile evidence, `git diff --check`, and
   preflight all pass or any omitted check has a documented blocker.

## Negative Scenarios

- Enlarging the current image element while the useful sign sheet remains tiny
  inside a blank page.
- Cropping the existing x5 page raster to a `~500px` useful area and then
  displaying it at manual width, causing pixelation.
- Fixing only `sign-sheet-185-source-as-is.jpg` while leaving page `186` or
  other Appendix IV page sheets with the same excessive-margin ratio.
- Recording the outer image/card width as evidence without measuring the useful
  content inside the image.
- Passing useful-content bbox ratio tests while sign labels, captions, or other
  intended-readable image text remain visually smaller than nearby document
  body text.
- Using CSS `transform`, `zoom`, `object-fit`, `clip-path`, `image-rendering`,
  or similar display tricks as the primary quality fix.
- Silently accepting a source-limited PDF raster when a better official source
  or source-faithful split/sub-crop strategy might make embedded text readable.
- Treating the current Appendix IV whole-sheet source-limited exception as
  final after the user asked for large individual signs.
- Translating text inside a sign face, supplementary plate/tablet, or official
  sign placard.
- Altering sign pixels to remove Spanish from protected sign bodies.
- Translating or editing map labels inside the hospital map image.
- Leaving the hospital map in a low-quality/readability-limited crop without
  exhausting official-original extraction options.
- Leaving learner-facing visual-card titles such as `Визуал источника:
  правильный ремень`, `Фото и цитата источника`, or `Главный вывод источника`
  in the runtime guide.
- Auditing only images already referenced by the interactive guide while
  missing official PDF visuals remain unexported.
- Omitting learner-meaningful PDF visuals because they are icons, photos, or
  infographics rather than existing `source-image-card` entries.
- Shrinking official visuals such as `Matafuegos` or `Chaleco reflectivo` into
  thumbnails when the original manual uses them at body-scale or larger.
- Adding the tire, blind-spot, extinguisher, or vest visuals from a recreated
  icon, AI-generated substitute, low-quality screenshot, or non-official
  source instead of the official PDF/original.
- Translating or modifying text inside the blind-spot visual for this feature.
- Rewriting internal metadata/evidence by removing needed source provenance
  instead of cleaning only learner-visible copy.
- Removing sign labels, tiny captions, or other official source details while
  auto-cropping.
- Retouching, repainting, inpainting, redrawing, vector-recreating, or
  translating protected source imagery.
- Moving Russian explanation into protected source images to save layout space.
- Reintroducing runtime PDF rendering, remote manual assets, or a full-page
  raster-only reader.
- Breaking mobile layout with document-level horizontal overflow.
- Weakening existing source-fidelity, hash, no-upscale, source exception, or
  feature-memory evidence.

## Verification Requirements

Implementation must record exact commands and evidence in `tasks.md`.

Required local checks:

- `node scripts/check-feature-memory.mjs --worktree`
- focused inventory/source-crop content tests
- `pnpm run validate:manual-guide`
- `pnpm run validate:content`
- `pnpm exec tsc --noEmit`
- `pnpm run test`
- `pnpm run build`
- focused Playwright desktop/mobile checks for corrected examples and
  representative inventory findings
- `git diff --check`
- `pnpm run preflight` before PR readiness when feasible

Evidence must include:

- whole-manual inventory/disposition table or structured evidence;
- official PDF visual-region inventory compared against runtime guide visuals,
  including each visual's `present`, `added`, `duplicate-covered`,
  `explicitly-omitted`, or `missing-blocker` disposition;
- list of added, still-missing, duplicate-covered, and explicitly dispositioned
  learner-meaningful visuals;
- per-visual source page/region, runtime section/block/card id, asset path,
  dimensions, hash where practical, display size, no-upscale status, and
  protected/source-as-is policy;
- before/after useful-content bbox ratios for corrected assets;
- extraction/crop method and output dimensions;
- source PDF/page/crop bounds and SHA-256 where practical;
- natural-dimension/runtime-display/no-upscale proof;
- desktop/mobile screenshots or assertions for pages `185` and `186`;
- desktop/mobile screenshots or assertions for the tire manufacturing/date and
  tread-life visual, the blind-spot full-width visual, `Matafuegos`,
  `Chaleco reflectivo`, headrest diagrams, and public-space mobility visual
  after addition or correction;
- representative OCR/manual text-size/readability checks comparing source-image
  text to nearby manual body text;
- visual-size relation evidence for simple meaningful icons/object visuals,
  including the extinguisher's approximate `15` body-text-line height anchor or
  a source-evidenced alternative;
- Appendix IV individual-sign/row/panel extraction evidence, including a
  protected-pixel boundary classification for translated external captions;
- hospital map official-original extraction evidence and label readability
  comparison;
- grep/audit evidence over runtime guide strings for banned/meta source wording
  and explicit allowlist decisions for genuine legal/source citation contexts;
- DOM or screenshot evidence for representative rewritten guide cards where
  useful;
- representative Appendix IV and non-Appendix evidence when corrected;
- proof that source-as-is protected pixels are unedited except empty-margin
  cropping.

## Implementation Slice Guidance

Use one implementation PR slice unless implementation discovers a narrow
blocker such as a missing official source region, unsafe automatic crop
behavior, unexpectedly broad asset regeneration, or repository/parallel-work
conflict. The work is cohesive: inventory, source extraction/crops, metadata,
renderer/test preservation, documentation updates when needed, evidence, and
process memory all serve one user-visible defect class.

No additional user clarification is required. If an official source cannot
yield a better faithful crop for a candidate, Implementation Agent must record a
source-quality/no-upscale limitation and feedback for Architect disposition
rather than stretching or retouching the image.

## Architect Handoff

This feature is ready for Implementation Agent after Orchestrator assignment.
Implementation must preserve role boundaries and sibling work, then keep
`tasks.md` current with inventory results, extraction decisions, verification
evidence, known issues, and any feedback requiring Architect disposition.

## Architect Review Disposition - Current Head `ec2125ffa28cc5b079f7c0ed777b1ef9aba5e097`

Disposition recorded at `2026-06-05T17:49:29-03:00` for PR `#200`
current-head AI Review feedback. Both P2 findings are accepted as same-cycle
required fixes and block final validation until implemented and evidenced:

1. `scripts/manual-guide-visual-completeness-audit.mjs` must not hide
   app-specific residual scope from `remainingRequiredExamples` or equivalent
   disposition evidence. A status such as `implemented-app1-only` cannot be
   filtered out by a broad `startsWith("implemented")` rule while its notes say
   App2/App3 equipment visuals remain pending. Implementation must either keep
   such records visible in remaining/disposition evidence, rename/classify the
   status so partial implementation remains distinguishable from complete
   implementation, or explicitly update the status and notes only after
   validating against the original user request that the App2/App3 scope is
   truly out of this feature and no longer a user-required example.
2. The learner-facing Russian translation for `NO AVANZAR` must be corrected
   everywhere visible and evidence-tested. `Движение прямо запрещено` is not
   acceptable because it implies only straight-ahead movement is forbidden.
   Use `Проезд запрещен` or another accurate Russian phrase that conveys not
   proceeding/entering past the sign. The protected image pixels, including the
   Spanish catalog caption inside the source crop/panels, must remain
   unchanged.

Implementation evidence must cover both fixes with focused tests or audit
assertions, regenerated/check-mode evidence as needed, and `tasks.md` notes
showing the status/disposition semantics and corrected translation were
verified.

## Architect Review Disposition - Current Head `d062fee35daa445d2caadbd2770900d1b93d2263`

Disposition recorded at `2026-06-05T18:02:47-03:00` for PR `#200` current-head
AI Review and CI feedback. Both items are same-cycle blockers for feature
`034` and block final validation until implemented, evidenced, and verified:

1. AI Review P2 thread `PRRT_kwDOSX65IM6Herjc` on
   `scripts/manual-guide-visual-completeness-audit.mjs` around line `94` is
   accepted. The learner-facing provenance-copy audit must not rely on
   JavaScript ASCII `\b` word boundaries for Cyrillic patterns. Forbidden
   Russian provenance words and phrases such as `источник`, `источника`,
   `из источника`, `Визуал источника`, and `Главный вывод источника` must be
   detected in learner-visible copy with Unicode-aware boundaries/lookarounds
   or explicit Cyrillic/non-Cyrillic boundary handling. The legitimate
   allowlisted semantic phrase `источник стресса` must remain allowed because
   it means a cause of stress rather than document/source provenance.
2. Current-head `baseline-checks` CI failure is accepted as a same-cycle CI
   stabilization blocker. The Playwright e2e test
   `Manual guide full-width source image cards stay readable and avoid
   upscaling` timed out in `tests/e2e/app.spec.ts` around lines `4762` and
   `4778` while using `image.decode()` for image sizing checks. Implementation
   Agent Curie is assigned to stabilize this. The fix must make the image
   sizing helper robust and bounded rather than weakening the no-upscale /
   readability assertion.

Required evidence: focused tests or audit fixtures must prove Cyrillic
forbidden provenance words are caught without regressing the
`источник стресса` allowlist, and focused Playwright/CI evidence must prove the
image sizing check no longer hangs on `image.decode()` while still failing
clearly for unreadable, broken, or upscaled images.
