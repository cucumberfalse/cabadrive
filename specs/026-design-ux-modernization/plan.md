# Plan: Design, UX, Typography, And Learning Visual Modernization

## Strategy

Treat this as a product-system modernization, not a cosmetic CSS pass. The work should first establish documented design and content-governance rules, then update reusable UI patterns, then add governed local learning images with validation. The final result should feel like one coherent app while keeping the exam trainer fast, local, and trustworthy.

The safest implementation order is:

1. document the design system and learning-image governance;
2. add the learning-image manifest/validator and tests;
3. modernize UI components and bilingual materials behavior;
4. generate/add local learning images and coverage records;
5. harden e2e, visual, accessibility, local-only, and ticket-immutability evidence.

Orchestrator may assign this as multiple PR slices if image production volume is too large for one reviewable PR. Each slice must preserve sibling work and update this feature memory.

## Recommended Slice Order

### Slice 1: Design System And Governance

- Create `docs_project/project/frontend/design-system.md`.
- Update existing durable docs only where behavior/governance changes:
  - `docs_project/project/frontend/ui-ux-source-of-truth.md`
  - `docs_project/project/learning/learning-experience-source-of-truth.md`
  - `docs_project/screens/learning-and-exam-flows.md`
  - `docs_project/project/content-sources.md`
  - `docs_project/project/feature-inventory.md`
- Define tokens for color, type, spacing, radii, borders, focus, status, answer states, timer states, navigation, language pairs, and learning-image cards.
- Define generated-image style `cabadrive-learning-image-v1`.
- Record how Spanish/Russian pairs should render in passive materials versus active recall surfaces.

### Slice 2: Learning-Image Data Contract And Validation

- Add a manifest and validation evidence path for learning images:
  - `content/learning-images/learning-images.manifest.json`
  - `content/validation/learning-images.evidence.json`
- Add local generated image asset root:
  - `content/assets/learning/generated/v1/`
- Add validator:
  - `scripts/content-learning-images.mjs`
- Wire validation into:
  - `scripts/validate-content.mjs`
  - `package.json` script, recommended `validate:learning-images`
- Add tests:
  - `tests/content-learning-images.test.mjs`
  - update `tests/content-validation.test.mjs` if needed.
- Validator should compute topic/vocabulary coverage units from current JSON, check source fingerprints, local paths, hashes, dimensions, alt text, status, provenance, reviewed exceptions, and absence of question-image asset paths.

### Slice 3: UI Modernization And Bilingual Materials UX

- Modernize app shell, status strip, tabs, workspace layout, cards, sidebars, controls, focus states, answer states, timer, and responsive behavior.
- Keep no landing page; first screen remains the trainer.
- Prefer existing React structure unless extraction reduces real duplication. Reasonable additions include shared components for:
  - app shell/status/navigation;
  - language pair or inline translation reveal;
  - learning-image figure/card;
  - material content unit;
  - term card.
- Use `lang="es"` on Spanish terms/text and `lang="ru"` on Russian support where feasible.
- In `Материалы`, render Spanish terms and necessary Spanish ticket text with close Russian support and keyboard/touch-accessible reveal or pair layout.
- In `Словарь`, render generated term images and preserve search.
- Preserve learning, mistake review, exam, source reader, process guide, and CABA/RF behavior while modernizing layout.

### Slice 4: Image Production And Coverage

- Generate or otherwise create approved local learning images under `content/assets/learning/generated/v1/`.
- Add manifest image records, per-unit coverage records, and validation evidence.
- Cover:
  - all general vocabulary terms;
  - all topic summaries;
  - all `learningMaterialRu` units;
  - all `practicalReasoningRu` units;
  - all trap notes;
  - all topic Spanish term rows.
- Shared images are allowed when a record proves the image explains each linked unit.
- Exceptions must be explicit, reviewed, and validator-approved.
- Do not use generated images inside active exam attempts.
- Do not replace canonical ticket images in material ticket blocks.

### Slice 5: Evidence, Review Fixes, And Final Readiness

- Run full verification.
- Record coverage totals, exception totals, local asset counts, screenshot paths, no-network evidence, ticket-immutability evidence, and known issues in `tasks.md`.
- Route any Implementation Agent feedback to Architect for disposition.
- Prepare for Review Agent and final validation.

## Likely Implementation Paths

Documentation:

- `docs_project/project/frontend/design-system.md`
- `docs_project/project/frontend/ui-ux-source-of-truth.md`
- `docs_project/project/learning/learning-experience-source-of-truth.md`
- `docs_project/screens/learning-and-exam-flows.md`
- `docs_project/project/content-sources.md`
- `docs_project/project/feature-inventory.md`

Runtime UI:

- `src/App.tsx`
- `src/styles.css`
- optional `src/components/*`
- optional `src/learningImages.ts` or `src/data/learningImages.ts`
- `src/data/content.ts`
- `src/search.ts` only if search indexing needs image-backed term metadata.

Content and assets:

- `content/assets/learning/generated/v1/*`
- `content/learning-images/learning-images.manifest.json`
- `content/validation/learning-images.evidence.json`
- `content/vocabulary/ru.vocabulary.json` only if implementation chooses to add image refs directly instead of keeping refs only in the manifest.
- `content/guide/topic-study-guide.ru.json` only if implementation needs stable paragraph/term IDs that cannot be derived externally. Do not edit canonical ticket data.

Tooling and tests:

- `scripts/content-learning-images.mjs`
- `scripts/validate-content.mjs`
- `scripts/sync-public-assets.mjs` only if existing `content/assets` sync is insufficient for learning images.
- `package.json`
- `tests/content-learning-images.test.mjs`
- `tests/content-validation.test.mjs`
- `tests/e2e/app.spec.ts` or a new focused Playwright spec.

Feature memory:

- `specs/026-design-ux-modernization/tasks.md`
- optional evidence files under `specs/026-design-ux-modernization/evidence/` if Implementation Agent needs structured coverage summaries or screenshot indexes.

## Design Guidance

- Keep the palette restrained but not one-note. Use neutral backgrounds, high-contrast text, status colors with semantic purpose, and limited accent colors.
- Cards/panels should use 8px radius or less unless the documented design system records a reason.
- Avoid decorative orbs, marketing hero layouts, and oversized display type inside operational panels.
- Use lucide icons where icons help recognition.
- Text must wrap cleanly; do not use viewport-scaled font sizing or negative letter spacing.
- Keep status labels compact but visible enough for trust decisions.
- Use a consistent focus ring and keep focus order aligned with reading order.
- Use system/local fonts. Remote Google Fonts or similar runtime fetches are forbidden.

## Bilingual UX Guidance

- Active recall surfaces (`Учить`, `Ошибки`) keep existing hidden-before-answer behavior.
- Active exam attempts keep support hidden.
- Passive support surfaces (`Материалы`, `Словарь`, `Процесс`, `Источники`, `CABA/RF`) may show Russian support by default when it helps comprehension.
- For `Материалы`, Spanish terms and Spanish ticket text should have nearby Russian support. A compact language-pair component or inline reveal is preferred over distant legends.
- Reveal controls must expose state (`aria-expanded` or equivalent), work by keyboard and touch, and preserve context.
- Spanish chunks/terms should use `lang="es"` and Russian support should use `lang="ru"` where feasible.

## Learning Image Guidance

- Style version: `cabadrive-learning-image-v1`.
- Preferred format: optimized local WebP or PNG where transparency/line art requires it.
- Preferred aspect families: 4:3 for concept cards, 16:9 for wide material callouts, 1:1 for compact vocabulary thumbnails.
- Avoid photorealistic fake official scenes when a simple educational diagram is clearer.
- Do not include official logos, personal data, misleading signs, or generated text unless reviewed and duplicated as real text.
- Do not make generated learning images look like canonical ticket images.
- Alt text should explain the learning concept, not repeat decoration.

## Verification Plan

Required commands:

```bash
git status --short --branch
pnpm run validate:learning-images
pnpm run validate:content
pnpm run validate:content:quality
pnpm run test
pnpm run build
pnpm run test:e2e
node scripts/check-feature-memory.mjs --worktree
git diff --check
pnpm run preflight
```

Ticket immutability evidence:

```bash
git diff --exit-code c083b248564a67d7599fa63d4181759fe30cd6a7 -- content/questions/caba-b.unofficial-fallback.questions.json content/assets/questions/source-bandinopla-testdeconducir-b
```

Visual/accessibility evidence:

- Playwright screenshots or saved evidence for desktop and mobile `Учить`, active `Экзамен`, `Словарь`, and `Материалы`.
- Request interception proving no remote images/backend/AI/PDF requests.
- Keyboard traversal evidence for navigation and bilingual reveal controls.
- Evidence that generated images are included in production build/service-worker asset handling.

## Risks

- Full image coverage is large: current planning counts include hundreds of material units and terms.
- Generated road-safety images can mislead if not reviewed carefully.
- Shared image coverage can become too vague; validator and evidence must make every unit traceable.
- UI polish can accidentally hide status labels or make the app feel like marketing instead of a study tool.
- Broad CSS changes can regress mobile layout or source-reader behavior.
- New asset volume can increase build size and service-worker cache size.

Mitigation: keep records structured, reuse images only with explicit coverage evidence, test mobile/desktop, and split PRs if review size becomes unsafe.

## Handoff

Implementation Agent should start with Slice 1 and Slice 2 unless Orchestrator assigns a narrower slice. Do not start image production before the manifest schema, validator expectations, and style documentation are in place. Record all evidence and feedback in `tasks.md`; return any scope expansion, image-coverage blocker, source/status conflict, or ticket-immutability concern to Orchestrator for Architect disposition.
