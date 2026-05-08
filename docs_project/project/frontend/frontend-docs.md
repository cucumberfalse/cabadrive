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
- Translation and explanations are explicitly marked as unofficial.
- Support mobile-first interaction and exam-focused speed.
- Keep weak-topic review prominent in study loops.
- Render question images as part of the question, using only local offline assets.
