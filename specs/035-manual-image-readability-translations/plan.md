# Plan: Manual Image Readability And Russian Translations

## Summary

Implement this as one content/readability/validation PR slice unless
Orchestrator chooses to split implementation. The normal route can continue in
the Analyst-created latest-main handoff worktree and branch because this
feature is one whole-guide defect class.

The implementation should preserve the existing manual guide architecture:
static local React/TypeScript data, local assets, no runtime backend, no remote
images, and protected source pixels. The main new contract is a structured
whole-guide image-text inventory plus a validator that proves every
learner-relevant embedded Spanish text item has nearby Russian DOM support and
readability evidence.

## Existing Rails To Reuse

- `SourceImageCardsBlockView` already renders `card.termTranslations` as a
  semantic `<dl>` directly below the image/body copy.
- `ManualGuideContentBlock` already has `termTranslations?: { termEs;
  translationRu }[]` for `source-image-cards`.
- Existing visible-Spanish exception attributes are rendered on images:
  `data-visible-spanish`, `data-official-sign-exception`,
  `data-source-image-exception`, `data-visible-spanish-scope`, and
  `data-source-as-is`.
- Existing validator entry points are
  `scripts/manual-guide-source-fidelity.mjs` and
  `scripts/manual-guide-visual-completeness-audit.mjs`.
- Existing evidence style writes deterministic JSON under `content/validation/`
  and fails in check mode when committed evidence is missing or stale.
- Feature `034` evidence and assets provide source-fidelity, crop, no-upscale,
  and protected-pixel precedents.

## Data Model

Preferred path:

1. Keep `termTranslations` as the runtime display surface for
   `source-image-cards`.
2. Extend `termTranslations` only if needed for validation metadata, for
   example optional `id`, `role`, `learnerRelevance`, or `notesRu`. Preserve
   current `termEs` and `translationRu` so existing cards continue to render.
3. For non-`source-image-cards` image blocks that can contain Spanish text,
   add equivalent structured translation fields and render them with the same
   reusable DOM pattern or adapt those blocks to a shared translation-list
   helper.
4. Do not count `bodyRu`, `captionRu`, `noticeItemsRu`, or broad list prose as
   structured coverage unless the block has a single visible phrase and the
   audit explicitly records the one-to-one mapping.

If the implementation introduces a richer inventory-only evidence model rather
than adding validation metadata to runtime data, it must still be traceable back
to the runtime DOM selector and source data record that displays the Russian
translation.

## Inventory And Audit

Add a new validator, likely
`scripts/manual-guide-image-readability-translations-audit.mjs`, or extend an
existing manual-guide audit only if the resulting script remains clear. A new
script is preferred because this feature is not just visual completeness.

The audit should:

- Enumerate all implemented manual-guide image references from
  `src/data/manual-sections/` and relevant `ManualGuideContentBlock` shapes.
  Prefer TypeScript compiler AST parsing or a structured source/data adapter
  over fragile ad hoc string matching when practical.
- Cover `source-artwork`, `mobility-context.space`,
  `pedestrian-infrastructure.cards`, `priority-area-map`, `bicycle-signage`,
  `bicycle-distance.examples`, `public-transport-comparison`,
  `public-transport-infrastructure.cards`, `shared-trip-closing`, and
  `source-image-cards`, plus any other image-rendering blocks found in
  `src/App.tsx`.
- Emit committed evidence at
  `content/validation/manual-guide-image-readability-translations.evidence.json`
  with schema version, feature id, generatedBy, deterministic generatedAt
  convention, counts, inventory records, required-example coverage, exceptions,
  and screenshot/evidence paths.
- Fail in check mode when evidence is missing, malformed, stale, has count
  drift, or omits a visible-Spanish image.
- Fail when `visibleSpanish: true` lacks protected/source exception metadata.
- Fail when learner-relevant embedded Spanish text lacks structured Russian
  support or an explicit exception.
- Fail when a record claims coverage from only generic `bodyRu` for an image
  with multiple visible text items.
- Fail when an image has intended-readable embedded text but no readability
  disposition, no no-upscale proof, or no source-limited evidence.
- Keep `pnpm run validate:manual-guide` as the public gate by wiring it to:
  source fidelity, visual completeness, and the new readability/translation
  audit. Because `validate:content` already invokes manual-guide validators,
  update that path consistently.

## Readability Measurement

Use objective measurements where feasible and evidence-backed review where
automation is weak:

- Record nearby body-text baseline from computed manual guide CSS in Playwright
  for representative fixed sections.
- Record natural asset width/height and rendered desktop/mobile width/height.
- Assert browser display width does not exceed natural asset width.
- For intended-readable text, record either measured text height from OCR/manual
  pixel sampling or a manually reviewed screenshot annotation. The target is at
  least `14px` and at least `90%` of nearby body text; if implementation can
  measure stricter parity reliably, use parity.
- For mobile, preserve natural image width with contained figure-level scroll
  when downscaling would make embedded source text unreadable. Assert no
  document-level horizontal overflow.
- Source-limited exceptions must list attempted official extraction and layout
  alternatives before acceptance.

## Content Fix Strategy

Use the smallest source-faithful fix that satisfies readability and Russian
coverage:

1. Add missing `termTranslations` or equivalent structured translation fields
   to existing cards when the current asset is already readable enough.
2. Replace/supplement whole sheets with official high-resolution panels,
   focused cards, or source-faithful sub-crops when a whole sheet makes labels
   too small. Keep overview sheets only as overview context, not as the only
   learner support.
3. For protected images, leave pixels unchanged and put translations below or
   beside the image.
4. For transferred/non-protected diagrams with existing Russian overlays,
   keep the accepted overlay strategy only if source-fidelity rules allow it
   and text is selectable.
5. Do not introduce per-card CSS hacks. Use reusable display modes, CSS custom
   properties, contained figure scroll, and reusable translation-list styles.

Required group-specific guidance:

- App IV regulatory already has Anexo panels and some `termTranslations`; audit
  it fully and fill any CABA overview or panel coverage gaps. Apply analogous
  readable-panel/focused-card coverage to warning, informational, temporary,
  horizontal marking, and traffic-light/signal sheets.
- For App IV, translate only external catalog captions/labels when they are
  outside sign bodies/plates/tablets. Do not translate text inside the official
  sign, plate, marking, signal, or map pixels.
- For `app3-body-posture-source-card`, add structured translations for the
  posture image labels, not just the existing body summary. Re-extract or
  adjust display only if the current image text fails the readability target.
- For app1/app2/app3 safety elements, cover tire, blind spot, headrest, and
  belt/seatbelt visuals. Existing app1 tire/blind-spot and app2 headrest
  examples have `termTranslations`; verify completeness and add missing app3
  seatbelt/body labels or exceptions.
- For `app2-hospital-map-source-card`, keep the map unmodified. Ensure map
  labels/list/legend have structured Russian support or a grouped map-label
  disposition and that the map readability exception/evidence is current.
- For `ch2-required-documents`, itemize visible document names/fields that are
  exam-relevant, especially DNI, license, beginner sign, cedulas, VTV, and RVA.
- For `ch1-bicycle`, itemize the bicycle sign sheet and the safe/unsafe
  distance panels, or record why a grouped list maps all visible captions.
- For `ch4-distractions` and `ch5-anticipatory-efficient-driving`, add
  quote-level Spanish/Russian pairs for protected photo/quote images.

## Renderer And CSS

- Keep image first, then Russian support, unless a block-specific layout already
  intentionally places the explanation beside the image and remains responsive.
- Render Spanish source terms with `lang="es"` and Russian translations as
  selectable text.
- Reuse the existing `.manual-source-image-term-translations` pattern or create
  a general manual-image translation list class shared by all image block types.
- Ensure translation blocks wrap cleanly on mobile and do not overlap images,
  controls, or following content.
- Preserve existing data attributes used by source-fidelity and e2e checks.

## Tests

Add/update tests for:

- New audit evidence write/check behavior, stale evidence detection, and
  malformed/missing evidence failure.
- Complete enumeration of current manual-guide image references and refreshed
  counts.
- Failure fixtures where a visible-Spanish image has no structured Russian
  support, only generic `bodyRu`, or stale/missing exception metadata.
- Required user-named group coverage.
- App IV whole sheets cannot pass without readable panel/focused-card or
  structured translation coverage.
- `app3-body-posture-source-card` requires itemized label translations.
- Protected image rule: no translated-sign, retouched-photo, masked-map,
  opaque plate, broad mask, or Russian text inside protected image pixels.
- Renderer output for reusable translation lists, `lang="es"`, and data
  attributes.
- Existing source-fidelity and visual-completeness tests remain passing.

## Playwright And Visual Evidence

Collect desktop and mobile evidence for representative categories:

- One dense App IV sign/marking/signal group after fix.
- `app3-body-posture-source-card`.
- One document example from `ch2-required-documents`.
- `app2-hospital-map-source-card`.
- One quote/photo example from `ch4-distractions` or
  `ch5-anticipatory-efficient-driving`.

Playwright checks should verify:

- The image is visible, local, and not browser-upscaled.
- Translation DOM is close to the image and visible/selectable.
- Spanish terms render with `lang="es"` where applicable.
- Mobile has no document-level horizontal overflow.
- Any fixed natural-width image scroll is contained inside the figure/card.
- Screenshots are saved under `content/validation/manual-guide/...` or another
  existing validation evidence path and referenced by the audit evidence.

## Durable Docs

Update `docs_project/project/frontend/manual-conversion-guidelines.md` only if
the implementation creates a reusable rule beyond this feature memory. If
updated, document:

- Visible-Spanish image inventory requirements.
- Structured Russian DOM support expectations.
- Readability/no-upscale/source-limited exception rules.
- Protected-pixel prohibition on in-image translation.

Do not update unrelated durable docs.

## Verification Commands

Implementation Agent should run and record exact results in `tasks.md`:

```bash
node scripts/check-feature-memory.mjs --worktree
node scripts/manual-guide-image-readability-translations-audit.mjs --write
pnpm run validate:manual-guide
pnpm run validate:content
pnpm exec tsc --noEmit
pnpm run test
pnpm run build
pnpm run test:e2e
git diff --check
pnpm run preflight
```

Focused tests and focused Playwright checks may be run earlier while iterating.
If full preflight or e2e is blocked by environment, record the blocker and all
substitute evidence for Orchestrator disposition.

## Implementation Feedback And Disposition

Implementation Agent must record in `tasks.md`:

- Dead ends and extraction/readability attempts that failed.
- Every source-limited exception and whether owner disposition is needed.
- Any desired schema/UX improvement outside this feature's scope.
- Exact validation evidence paths and command results.

Orchestrator must route Implementation Agent feedback to Architect for
disposition before review/final validation. Any post-validation non-evidence
content change makes prior final validation stale.

## PR And Review Readiness

The implementation PR is not ready until:

- Feature memory is complete and current.
- New audit is wired into `validate:manual-guide`.
- Required user-named groups have evidence.
- Local validation/build/focused Playwright evidence is recorded.
- Protected-pixel and no-upscale rules are preserved.
- No unresolved Implementation Agent feedback remains without Architect
  disposition.

Review Agent should review for bugs, missing tests, source-fidelity regressions,
coverage holes, weak exceptions, role-boundary violations, and validator
loopholes. Orchestrator handles checks, final validation, and merge readiness
under the repository workflow.
