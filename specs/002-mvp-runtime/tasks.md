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
- [x] T025 Address internal review findings for exam config behavior, fallback validation policy, non-B guard robustness, e2e CI coverage, and whitespace diff handling.
- [x] T026 Address latest AI Review findings for random exam pool selection and repeatable mistake retry.
- [x] T027 Re-run preflight and Docker validation after latest review-fix changes.

## Process Memory

### Dead Ends

- Initial attempt to use GCBA A4 question PDF was interrupted by the user as irrelevant. The A4 source file was removed, and specs/content were changed to exclude A/A4 and other non-B question sources.
- Initial bulk image download with curl config failed due to invalid config formatting and produced no files. Replaced it with a Node downloader with retries and hash manifest generation.
- First Playwright run failed because Chromium was not installed locally. Installed Chromium with `pnpm exec playwright install chromium`.
- E2E initially exposed a click bug where a local `answer` callback was shadowed by an answer object in `.map()`. Renamed the callback to `selectAnswer`.
- Offline reload initially failed because the static service worker did not precache hashed Vite assets. Added `scripts/generate-service-worker.mjs` to generate a post-build asset manifest.
- Post-PR internal review found blocking P2 issues: exam mode did not implement skip/timer completion, content policy claimed per-question approvals while fallback questions intentionally remain `needs_review`, and non-B source guard only checked lowercase source ids. These were fixed before marking the PR merge-ready.
- Targeted re-review found one remaining gap: the non-B source guard caught A4/moto but not plain `category A`, `categoria A`, `clase A`, or `tipo A`. The guard now rejects those source metadata patterns as well.
- Latest AI Review on commit `48814ac431` found two active P2 gaps: exam attempts reused the same deterministic first 40 questions despite the configured random pool rule, and mistake review could not record repeated attempts on the same mounted question card. Both were fixed in this follow-up.
- First `pnpm run preflight` after the latest code changes failed as intended because product/test files changed before `specs/002-mvp-runtime/tasks.md` was updated. This process-memory update unblocks the feature-memory guard.

### Decisions

- Treat this branch as the MVP runtime/content-validation slice rather than splitting into multiple PRs because the user requested full project implementation and the repo currently lacks any product runtime.
- Use `unofficial_b_fallback` labeling because a complete public official CABA B-class question bank has not been confirmed during source research and the user prefers the category B community simulator over irrelevant official A/A4 sources.
- Use the 2025 GCBA procedure manual for defined exam format because older 2022 records conflict with it.
- Exclude A/A4 and motorcycle question sources from practice content.
- Preserve all referenced category B question images locally in the repository because many questions depend on images.
- Use Vite 6 rather than Vite 7 so local development checks support the current Node 20.x baseline while Docker uses Node 22.
- Add `docker-validation` to required checks and CI because runtime scaffolding now exists.
- Include Playwright e2e in `preflight` and CI to prevent browser-flow regressions from bypassing the richer learning/exam/offline tests.
- Start with native service worker and a local search index to keep dependencies modest.
- Select exam questions randomly only when `questionOrderRule` is `random_questions_from_available_validated_pool`; keep a deterministic image-first fallback for any future non-random order rule.
- Allow repeated answer clicks only in mistake review, preserving locked single-answer behavior in learning and exam modes while enabling focused retry loops.

### Known Issues

- External official content validation is still pending. This branch may include solo self-audit records and a local/private release exception, but that is not equivalent to independent release approval.
- Full official B-class question bank availability remains unresolved; the app must not claim complete or official question coverage.
- Public release still requires legal/external review of official GCBA snapshots and replacement or validation of the non-official fallback question source.
- Vite continues to emit a non-blocking chunk-size warning because the MVP bundles the fallback question dataset into the app JS.

### Verification Evidence

- `pnpm install` completed and produced `pnpm-lock.yaml`; `esbuild` postinstall is allowed via `package.json` pnpm policy.
- `pnpm run validate:content` passed: 460 category B fallback questions and 276 local image references.
- `pnpm run test` passed: 14/14 Node tests including AI helper regressions, content validation, image reference checks, scoring, mistakes, and exam config.
- `pnpm run build` passed: content validation, asset sync, Vite build, generated service worker with 280 cached assets. Vite reports a non-blocking chunk-size warning for the bundled question dataset.
- `pnpm run test:e2e` passed: 8/8 Playwright tests across desktop Chromium and mobile viewport, covering learning with images, exam flow, vocabulary, guide, and offline reload.
- `pnpm run preflight` passed: feature-memory gate, repository baseline, content validation, Node tests, and production build.
- Full Docker validation passed after adding `.dockerignore`: `make down && make build && make up`, HTTP smoke against `http://localhost:5173/`, `sw.js` check, and `make down`.
- `git diff --check` passed with no whitespace errors.
- Review-fix verification:
  - `pnpm run validate:content` passed after policy changes requiring active release exception coverage for fallback question sources.
  - `pnpm run test` passed: 14/14.
  - `pnpm run build` passed and generated service worker with 280 cached assets.
  - `pnpm run test:e2e` passed: 8/8, including exam skip behavior and offline reload.
  - `pnpm run preflight` passed after adding e2e to preflight.
  - Full Docker validation passed after review fixes: `make down && make build && make up`, HTTP smoke against `http://localhost:5173/`, `sw.js` check, and `make down`.
  - `git diff --check origin/main...HEAD` passed after marking immutable source originals and assets as binary in `.gitattributes`.
- Latest AI Review fix verification:
  - `pnpm run validate:content` passed: 460 category B fallback questions and 276 local image references.
  - `pnpm run test` passed: 15/15 Node tests, including a regression for random exam selection.
  - `pnpm run build` passed and generated service worker with 280 cached assets; Vite chunk-size warning remains non-blocking.
  - `pnpm run test:e2e` passed: 8/8 Playwright tests across desktop Chromium and mobile viewport, including repeatable mistake retry.
  - `pnpm run preflight` initially failed because feature-memory guard detected product/test changes before this tasks file was updated.
  - `pnpm run preflight` passed after this feature-memory update.
  - Full Docker validation passed: `make down && make build && make up`, HTTP smoke against `http://localhost:5173/`, `sw.js` check, and `make down`.
