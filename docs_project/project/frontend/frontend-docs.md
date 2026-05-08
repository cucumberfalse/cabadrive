# Frontend Docs

## Product Shape

Cabadrive is planned as a static local-first SPA/PWA with no backend in MVP.

## Stack

Proposed MVP stack from `docs/specify/07_technical_architecture.md`:

- TypeScript
- React
- Vite
- IndexedDB for progress/statistics
- localStorage for light settings
- local search index (Fuse.js or MiniSearch)
- Service worker (Workbox or native)
- Vitest + Playwright for testing

## Runtime Contract

The local execution contract is Docker-only:

```bash
make build
make up
make down
```

Important: this contract is documented and required, but the actual runtime scaffolding is still to be implemented.

## Current Workflow Commands

Current repository verification command:

```bash
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

## UI Rules

- Official Spanish text stays primary.
- Translation and explanations are explicitly marked as unofficial.
- Support mobile-first interaction and exam-focused speed.
- Keep weak-topic review prominent in study loops.
