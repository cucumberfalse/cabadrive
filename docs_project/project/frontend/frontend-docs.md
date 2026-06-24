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
- interactive Russian `Руководство` document surface for source-`Índice` manual fragments, with conversion rules in [`manual-conversion-guidelines.md`](./manual-conversion-guidelines.md)
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
- `Руководство` is the current user-facing Russian interactive manual destination, replacing the visible `Руководство 4R` guide entry. It is organized by the official source `Índice` hierarchy, starts with the implemented Introduction child routes, and keeps future chapters/annexes as pending navigation placeholders until converted.
- The Introduction routes currently implemented inside `Руководство` are `Дорожная пандемия`, `Этико-гражданский подход в дорожной культуре`, `Авария или дорожный инцидент?`, and `План дорожной безопасности города Буэнос-Айрес`; existing hashes `#pandemia-vial`, `#intro-enfoque-etico`, `#intro-accidente-incidente`, and `#intro-plan-seguridad-vial` deep-link into those children.
- Manual-fragment conversion follows [`manual-conversion-guidelines.md`](./manual-conversion-guidelines.md): the PDF is a mockup/reference only; runtime output is native HTML/CSS/SVG with selectable Russian text, source-faithful local artwork crops, simple natural Russian, ticket-critical detail retention, recurring style tokens, and visual checker evidence.
- The manual surface must not use a runtime PDF iframe/viewer, PDF.js rendering, remote images, network fetches, full-page raster backgrounds, image-only pages, broad masks over Spanish text, DOM plates, or the text-only source-reader fallback. Source PDF renders and old complete-manual manifests/assets remain internal traceability and validation inputs unless a later feature re-exposes them through the interactive `Руководство` conversion path.
- The official source archive under `content/official-documents/` remains verbatim Spanish-only source material. Russian translations and simple rewrites for the source reader are stored outside that archive under `content/primary-sources/`.
- Release status: the reader UI is implemented and locally tested, and the official archive currentness/exact-text gates are passed for all 19 manifest entries.
- Feature `026-design-ux-modernization` adds the durable visual system in `docs_project/project/frontend/design-system.md`, local generated learning images for `Материалы` and `Словарь`, and a learning-image validator. Generated learning images are committed local SVG assets under `content/assets/learning/generated/v1/`; they are unofficial support and never replace canonical ticket images.
- `Материалы` uses explicit Spanish/Russian language-pair controls for Spanish terms and local learning-image figures for governed topic-study coverage units. Active exam attempts continue to hide generated learning images and all support scaffolding.
- `Руководство` appends reviewed canonical ticket blocks only after the existing content of each eligible substantive route. The appendix joins ticket IDs to canonical questions, governed Russian translations/explanations, correct answers, difficulty, source status, and local images; mapping files cannot override that content.
- Manual placement provenance is fail-closed: runtime consumes only committed ticket-to-page references whose exact visible anchor text and semantic review are sealed by the reviewed manifest. Candidate scoring is development-only and never appears as an approval or runtime content source.
- Manual ticket appendices render up to 6 tickets directly. Routes with 7 or more tickets use a collapsed native disclosure and do not mount rich ticket cards until opened. Ticket order is deterministic by canonical ID, images remain local and lazy-loaded, and support pages such as presentation, categories, and glossary never receive appendices.
