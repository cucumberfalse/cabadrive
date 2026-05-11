# Frontend Docs

## Product Shape

Cabadrive is a static local-first SPA/PWA with no backend in MVP.

## Stack

Implemented MVP stack:

- TypeScript
- React
- Vite
- localStorage-backed progress adapter for MVP progress/statistics
- local in-memory search index over bundled content
- bundled topic study guide data rendered as local learning materials
- bundled CABA exam-process guide data rendered as an unofficial Russian procedural guide
- bundled primary-source reader data rendered as a local `Источники` section over the governed official-document manifest and current learner-source shards
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

The current MVP question set is `unofficial_b_fallback`, not an official GCBA question bank.

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
- Image-backed questions are guarded by `content/image-metadata/question-images.manifest.json` and related validation evidence. The metadata is not rendered in the MVP UI; it exists to prevent learning explanations from contradicting local images and to keep image-critical details reviewable.
- Future image highlight/dim overlays consume question-specific usage relevance from feature `009`; frontend overlay rendering must not infer importance from shared image metadata alone.
- Active exam attempts hide translation and explanation support.
- Active exam attempts do not show difficulty rationale, dimensions, or study hints; current UI omits difficulty chips during active attempts.
- Support mobile-first interaction and exam-focused speed.
- Keep weak-topic review prominent in study loops.
- Render question images as part of the question, using only local offline assets.
- `Материалы` renders the topic study guide from bundled JSON, labels it as draft/incomplete and unofficial while those statuses remain, and joins ticket references back to canonical questions for Spanish text, governed Russian translations when available, answers, correct answer, explanations, source status, and local images.
- Repeated materials ticket blocks should not each repeat the full fallback-status chip; section/product status surfaces carry the current unofficial fallback truth.
- `Процесс` renders the bundled CABA B1/private-car `Otorgamiento` process guide from local JSON, labels it as unofficial Russian support, shows official GCBA/ANSV source links with checked dates, and keeps volatile payments/sedes/turnos/document details behind explicit verify-on-official-source warnings.
- `CABA/RF` remains a separate compact contrast guide.
- `Источники` is implemented as a distinct official primary-source reader separate from `Материалы`. It uses the manifest/coverage inventory for corpus counts and status, but the reading list opens only chunks with approved Russian learner content from `content/primary-sources/`. It defaults available chunks to simple Russian, lets learners switch those chunks to full Russian translation or original Spanish stored in the learner shard, omits simplified Spanish, and labels Russian layers as unofficial learning support.
- The current primary-source corpus is intentionally partial while translation batches continue: documents/chunks without approved Russian learner shards are not published as readable items and are represented only by aggregate not-yet-available status. The UI must not describe the whole corpus as release-ready until strict/final primary-source gates pass.
- The official source archive under `content/official-documents/` remains verbatim Spanish-only source material. Russian translations and simple rewrites for the source reader are stored outside that archive under `content/primary-sources/`.
