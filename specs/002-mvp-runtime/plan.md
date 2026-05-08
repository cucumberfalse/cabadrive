# Plan: MVP Runtime And Content Trainer

## Summary

Build the first complete Cabadrive MVP slice: content governance, validation, offline React app, Docker runtime, tests, docs, and release evidence. The implementation will ship as `unofficial_b_fallback` for category B questions until a complete official CABA B-class question bank is found and independently validated.

## Technical Context

- runtime: static React + TypeScript + Vite app.
- data: committed JSON and Markdown content under `content/`.
- storage: browser localStorage with a typed adapter for MVP; IndexedDB can replace the adapter post-MVP without changing feature boundaries.
- search: local in-memory index built from bundled content at startup.
- offline: native service worker caching app shell and static assets.
- validation: Node.js scripts using local JSON parsing and crypto hashing.
- tests: Node test runner for validation/domain logic; Playwright for browser smoke and offline checks.
- Docker: multi-stage Node build served by nginx.

## Scope Boundaries

- in scope: app runtime, static content schema, validation, Docker, tests, docs, CI contract.
- out of scope: cloud services, remote content sync, OCR production pipeline, complete B-class official bank claim, external content validator completion.

## Implementation Approach

1. Create content and validation foundations.
2. Add runtime dependencies and project scripts.
3. Implement content loader, domain logic, local storage, search, and app views.
4. Add Docker-only runtime and update CI/preflight to include validation/build checks.
5. Add unit/content and e2e smoke tests.
6. Run local preflight, app tests, e2e tests, and full Docker validation.
7. Record process memory, decisions, known issues, and verification evidence.

## Source And Content Mode

This branch uses official GCBA sources checked on 2026-05-08 for exam format and study context:

| Source | Purpose | Hash |
| --- | --- | --- |
| GCBA material page for theoretical exam | material page and 45-minute note | HTML snapshot hash to be generated in `content/sources/originals/` |
| Manual de Procedimientos Abril 2025 | defined exam format: 40 questions, 85%, 45 minutes | `d30b02338072607f6ea6fb8e590c5a76589a104fe13c83a37bb4addc00ad0f41` |
| bandinopla/simulador-test-de-conducir source1 | non-official category B fallback practice questions and images | source hash `2b0564366bc016a37ccdecf1c7b25d82b6cb4ab41ff2091a3d4fefa8e1087230`; images in `content/assets/questions/source-bandinopla-testdeconducir-b/manifest.json` |

The UI and release evidence must label the dataset as `unofficial_b_fallback`. A/A4 and motorcycle question sources are explicitly excluded from practice content.

## Constitution Check

- Spec-first: yes; this folder is created before product-code edits.
- Testable boundaries: yes; validation, scoring, search, storage, and e2e flows have explicit checks.
- Test-first bias: yes; tests and validation scripts are part of the implementation, and deferred external content review is documented as a known issue.
- Supervised verification: yes; acceptance criteria map to commands and recorded evidence.
- PR-only workflow: yes; implementation happens on `codex/002-mvp-runtime`.
- One worktree per task: yes; this branch is one implementation slice. Subagents are read-only explorers for this turn.
- Deployability: yes; Docker build and static serving are verification gates.
- Simplicity: yes; no backend, no server database, no remote APIs.
- Process memory: yes; tasks will record dead ends, decisions, known issues, and evidence.

## Complexity Tracking

- Native service worker is used instead of Workbox to avoid a heavier dependency before the offline strategy needs richer cache routing.
- MVP localStorage adapter is used behind a storage boundary. IndexedDB remains documented as the planned durable storage target once data volume or structured querying requires it.
- Search starts as a deterministic local index rather than adding Fuse/MiniSearch until the MVP dataset proves the need.

## Verification Plan

| Acceptance criterion | Evidence |
| --- | --- |
| AC-001 | `make down && make build && make up`, HTTP smoke against local URL, `make down` |
| AC-002 | `pnpm run validate:content` |
| AC-003 | Playwright assertion for `unofficial_b_fallback` label |
| AC-004 | Playwright learning-flow test plus unit scoring/storage tests |
| AC-005 | Playwright exam-flow test and config validation |
| AC-006 | Playwright mistake-review test and unit progress tests |
| AC-007 | Unit search tests and Playwright vocabulary smoke |
| AC-008 | Playwright guide smoke and content validation for guide references |
| AC-009 | Playwright offline reload test |
| AC-010 | `pnpm run preflight`, `pnpm run test`, `pnpm run test:e2e` |

## Risks

- Risk: full official B-class question bank is unavailable.
- Mitigation: ship only `unofficial_b_fallback` category B labeling and block official/full-bank claims.

- Risk: solo self-audit is not external content approval.
- Mitigation: release exception is local/private only, expires, and leaves `needs_external_review` as known issue.

- Risk: host environment has Node but end-user contract forbids relying on it.
- Mitigation: Docker validation is required; host pnpm commands are developer checks, not user runtime requirements.

- Risk: large official PDFs bloat repository.
- Mitigation: store only needed source originals for evidence. If size becomes problematic, replace with deterministic acquisition scripts and hashed snapshots in a follow-up.
