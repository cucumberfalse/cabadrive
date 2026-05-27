# Frontend Docs

## Product Shape

Cabadrive is a static local-first SPA/PWA with no runtime backend.

## Stack

Implemented stack:

- TypeScript
- React
- Vite
- localStorage-backed progress adapter for progress/statistics
- local in-memory search index over bundled content
- bundled topic study guide data rendered as local learning materials
- bundled CABA exam-process guide data rendered as an unofficial Russian procedural guide
- bundled complete RU 4-wheel GCBA manual surface backed by local translation, layout, navigation, and page-faithful visual manifests
- validated four-level learner difficulty metadata for every bundled question and topic material
- native service worker generated after production build
- Node test runner + Playwright for testing

## Runtime Contract

The local execution contract is Docker-only:

```bash
make build
make up
make down
```

After `make up`, the application is served at:

```text
http://localhost:5173
```

The Docker image builds the static app and serves it with nginx. Host Node.js or pnpm is not required for end-user runtime.

For parallel-agent validation, the Docker compose project and host port can be
isolated without changing the end-user default:

```bash
COMPOSE_PROJECT_NAME=cabadrive-021-isolation CABADRIVE_HOST_PORT=5175 make up
```

That serves the app at `http://localhost:5175` for that compose project. Agents
must choose a free port and must not stop or remove sibling compose projects.
The compose file uses the project-scoped image name that Docker Compose creates
for local builds instead of retagging a shared `cabadrive:local` image.

## Current Workflow Commands

Current repository verification commands:

```bash
pnpm run validate:content
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run preflight
```

## Planned Structure

```text
src/
  app/
  components/
  features/
  data/
  search/
  storage/
content/
tests/
```

Current implementation keeps the app under `src/` with domain helpers in `src/domain.ts`, storage in `src/storage.ts`, search in `src/search.ts`, and imported bundled content in `src/data/content.ts`.

## Content Mode

The current question set is `unofficial_b_fallback`, not an official GCBA question bank.

- Practice questions are category B/CABA fallback data from `bandinopla/simulador-test-de-conducir`.
- All referenced practice images are stored locally under `content/assets/questions/source-bandinopla-testdeconducir-b/`.
- Official GCBA sources are used for exam-format metadata and study-material attribution.
- The UI must not claim official or complete B-question coverage until a full official B bank is found and externally validated.

## UI Rules

- Official Spanish text stays primary.
- Russian translations and explanations are unofficial learning aids; product-level onboarding, content-mode/status surfaces, and source/status footers carry that clarity instead of repeating long disclaimer paragraphs inside every question card.
- Learning and mistake review start with Russian translation hidden.
- Learn question cards show the ticket ID in the metadata row for reporting and cross-reference.
- Learning, mistake review, and materials surfaces show a compact static difficulty indicator (`green`, `blue`, `yellow`, `red`) as unofficial study-planning metadata. Difficulty is not correctness, source confidence, progress, or the user-controlled `Сложный` mark.
- The Spanish question text area reveals or hides the question translation and answer-choice translations with the same shared state; the revealed question translation appears directly under the Spanish question text before images and answer choices.
- The current 460-question fallback bank has complete question-card Russian translation and explanation records. These records remain unofficial learning aids and are guarded by deterministic local fingerprint evidence.
- Image-backed questions are guarded by `content/image-metadata/question-images.manifest.json` and related validation evidence. The metadata is not rendered as a standalone user surface; it exists to prevent learning explanations from contradicting local images and to keep image-critical details reviewable.
- Future image highlight/dim overlays consume question-specific usage relevance from feature `009`; frontend overlay rendering must not infer importance from shared image metadata alone.
- Active exam attempts hide translation and explanation support.
- Active exam attempts do not show difficulty rationale, dimensions, or study hints; current UI omits difficulty chips during active attempts.
- Support mobile-first interaction and exam-focused speed.
- Keep weak-topic review prominent in study loops.
- Render question images as part of the question, using only local offline assets.
- `Материалы` renders the published unofficial topic study guide from bundled JSON and joins ticket references back to canonical questions for Spanish text, governed Russian translations when available, answers, correct answer, explanations, source status, and local images.
- Repeated materials ticket blocks should not each repeat the full fallback-status chip; section/product status surfaces carry the current unofficial fallback truth.
- `Процесс` renders the bundled CABA B1/private-car `Otorgamiento` process guide from local JSON, labels it as unofficial Russian support, shows official GCBA/ANSV source links with checked dates, and keeps volatile payments/sedes/turnos/document details behind explicit verify-on-official-source warnings.
- `CABA/RF` remains a separate compact contrast guide.
- `Источники` renders the official primary-source reader from bundled `content/primary-sources/` shards. It stays separate from `Материалы`, covers every current entry in `content/official-documents/manifest.json`, defaults to simple Russian, allows switching to full Russian translation and original Spanish, omits simplified Spanish, and labels Russian layers as unofficial learning support.
- `Руководство 4R` renders the complete 200-page GCBA `Vehiculo 4 Ruedas 2023` manual as a dedicated Russian-learning surface, separate from `Источники`. It uses `manual.ru.json` for exact Russian page text, `layout.ru.json` for the page-like Russian web layout, and `navigation.ru.json` for source-derived front matter/chapter/appendix/topic navigation.
- The complete manual primary reader is a single Russian page canvas: local page-faithful visual material remains in the page, source text regions are masked, and ordered Russian layout blocks are independently positioned from their own committed bounds inside the document composition. It must not fall back to a side-by-side Spanish screenshot plus separate translation transcript or a single scrolling transcript flow.
- On mobile, the manual detail pane keeps the page canvas at a readable minimum layout width and allows horizontal scrolling instead of shrinking primary Russian instructional text into unreadable microtype. Playwright coverage checks pages `114`-`123` for both no-overlap and computed text-size readability.
- Chapter 4 semantic navigation is pinned to page-heading/content evidence: `Стресс` opens PDF page `94`, while `Отвлечения` opens PDF page `95`; same-page topic identity remains covered by later real same-page topics.
- The complete manual surface must not use a runtime PDF iframe/viewer, PDF.js rendering, remote images, network fetches, or the text-only source-reader fallback. Page visuals are served through the existing `content/assets` sync path and are validated before build. The manual data chunk and page images remain deferred from service-worker install precache and load on demand when the manual is opened.
- The official source archive under `content/official-documents/` remains verbatim Spanish-only source material. Russian translations and simple rewrites for the source reader are stored outside that archive under `content/primary-sources/`.
- Release status: the reader UI is implemented and locally tested, and the official archive currentness/exact-text gates are passed for all 19 manifest entries.
- Feature `026-design-ux-modernization` adds the durable visual system in `docs_project/project/frontend/design-system.md`, local generated learning images for `Материалы` and `Словарь`, and a learning-image validator. Generated learning images are committed local SVG assets under `content/assets/learning/generated/v1/`; they are unofficial support and never replace canonical ticket images.
- `Материалы` uses explicit Spanish/Russian language-pair controls for Spanish terms and local learning-image figures for governed topic-study coverage units. Active exam attempts continue to hide generated learning images and all support scaffolding.
