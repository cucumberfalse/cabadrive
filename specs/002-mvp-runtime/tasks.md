# Tasks: MVP Runtime And Content Trainer

## Setup

- [x] T001 Read repository constitution, durable docs, active bootstrap feature memory, and current source files.
- [x] T002 Create implementation branch `codex/002-mvp-runtime`.
- [x] T003 Delegate read-only documentation/technical reconnaissance to subagents.
- [x] T004 Verify current official GCBA source pages for exam material and exam format.
- [x] T005 Create this feature memory before product-code edits.

## Implementation

- [x] T006 Add content source originals, source registry, exam config, category B fallback questions with local images, translations, explanations, vocabulary, guide, validation policy, approvals, release exception, and release checklist.
- [x] T007 Add content validation script and package scripts.
- [x] T008 Add React + TypeScript + Vite app scaffold.
- [x] T009 Implement typed content loader, domain scoring, progress storage, search, and app state.
- [x] T010 Implement home, learning, exam, mistake review, vocabulary, guide, and search/filter UI.
- [x] T011 Add native service worker and offline-ready static asset handling.
- [x] T012 Add Dockerfile, docker-compose.yml, Makefile, nginx config, and runtime documentation.
- [x] T013 Add unit/content tests for validation, scoring, search, and progress behavior.
- [x] T014 Add Playwright smoke tests for learning, exam, mistake review, vocabulary, mobile, and offline reload.
- [x] T015 Update CI/preflight/build scripts for validation and Docker-aware checks without breaking bootstrap guard behavior.
- [x] T016 Update durable docs for runtime, content validation, Docker-only flow, and MVP release evidence.

## Verification

- [x] T017 Run `pnpm install --lockfile-only` if dependencies changed and commit lockfile.
- [x] T018 Run `pnpm run validate:content`.
- [x] T019 Run `pnpm run test`.
- [x] T020 Run `pnpm run build`.
- [x] T021 Run `pnpm run test:e2e`.
- [x] T022 Run `pnpm run preflight`.
- [x] T023 Run full Docker validation: `make down`, `make build`, `make up`, browser smoke test, `make down`.
- [x] T024 Record final verification evidence in this file.

## Process Memory

### Dead Ends

- Initial attempt to use GCBA A4 question PDF was interrupted by the user as irrelevant. The A4 source file was removed, and specs/content were changed to exclude A/A4 and other non-B question sources.
- Initial bulk image download with curl config failed due to invalid config formatting and produced no files. Replaced it with a Node downloader with retries and hash manifest generation.
- First Playwright run failed because Chromium was not installed locally. Installed Chromium with `pnpm exec playwright install chromium`.
- E2E initially exposed a click bug where a local `answer` callback was shadowed by an answer object in `.map()`. Renamed the callback to `selectAnswer`.
- Offline reload initially failed because the static service worker did not precache hashed Vite assets. Added `scripts/generate-service-worker.mjs` to generate a post-build asset manifest.

### Decisions

- Treat this branch as the MVP runtime/content-validation slice rather than splitting into multiple PRs because the user requested full project implementation and the repo currently lacks any product runtime.
- Use `unofficial_b_fallback` labeling because a complete public official CABA B-class question bank has not been confirmed during source research and the user prefers the category B community simulator over irrelevant official A/A4 sources.
- Use the 2025 GCBA procedure manual for defined exam format because older 2022 records conflict with it.
- Exclude A/A4 and motorcycle question sources from practice content.
- Preserve all referenced category B question images locally in the repository because many questions depend on images.
- Use Vite 6 rather than Vite 7 so local development checks support the current Node 20.x baseline while Docker uses Node 22.
- Add `docker-validation` to required checks and CI because runtime scaffolding now exists.
- Start with native service worker and a local search index to keep dependencies modest.

### Known Issues

- External official content validation is still pending. This branch may include solo self-audit records and a local/private release exception, but that is not equivalent to independent release approval.
- Full official B-class question bank availability remains unresolved; the app must not claim complete or official question coverage.
- Public release still requires legal/external review of official GCBA snapshots and replacement or validation of the non-official fallback question source.

### Verification Evidence

- `pnpm install` completed and produced `pnpm-lock.yaml`; `esbuild` postinstall is allowed via `package.json` pnpm policy.
- `pnpm run validate:content` passed: 460 category B fallback questions and 276 local image references.
- `pnpm run test` passed: 14/14 Node tests including AI helper regressions, content validation, image reference checks, scoring, mistakes, and exam config.
- `pnpm run build` passed: content validation, asset sync, Vite build, generated service worker with 280 cached assets. Vite reports a non-blocking chunk-size warning for the bundled question dataset.
- `pnpm run test:e2e` passed: 8/8 Playwright tests across desktop Chromium and mobile viewport, covering learning with images, exam flow, vocabulary, guide, and offline reload.
- `pnpm run preflight` passed: feature-memory gate, repository baseline, content validation, Node tests, and production build.
- Full Docker validation passed after adding `.dockerignore`: `make down && make build && make up`, HTTP smoke against `http://localhost:5173/`, `sw.js` check, and `make down`.
- `git diff --check` passed with no whitespace errors.
