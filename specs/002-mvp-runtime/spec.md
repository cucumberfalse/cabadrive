# Spec: MVP Runtime And Content Trainer

## Goal

Implement Cabadrive as a local-first, Docker-served React trainer that follows the existing product documentation: official Spanish source material stays primary and traceable, Russian translations and explanations are clearly labeled as unofficial learning support, progress is local, and the app can be built and run with Docker-only commands.

## Scope

In scope:

- React + TypeScript + Vite static SPA/PWA runtime.
- Docker-only local execution contract with root `Makefile`, `Dockerfile`, and `docker-compose.yml`.
- Machine-readable content layout under `content/` for sources, questions, translations, explanations, vocabulary, guide, validation policy, approvals, release exception, and exam config.
- Content validation script that checks schemas, source references, hashes, disclaimers, approval records, release exceptions, and exam-format source integrity.
- MVP UI modes: home, learning, exam simulation, mistake review, vocabulary, CABA-vs-RF guide, and search/filter support.
- Local progress, mistakes, difficult marks, exam history, and settings persistence in browser storage.
- Offline-capable build through a native service worker and bundled static content.
- Unit/content tests and Playwright smoke tests for core learning, exam, persistence, and offline behavior.
- Durable docs updates for runtime, Docker, validation, and release evidence.

Out of scope:

- Claiming a complete official CABA question bank until an official full bank is found and externally validated.
- Backend services, user accounts, cloud sync, remote analytics, or managed content delivery.
- OCR automation beyond deterministic source snapshots and validation scaffolding.
- Human-independent final content approval. This branch may include a solo self-audit plus a limited local/private release exception, but external content review remains a known release follow-up.

## Current Source Research

- On 2026-05-08, the official GCBA material page stated that the theoretical exam is multiple choice and each applicant has 45 minutes.
- On 2026-05-08, the official `Manual de Procedimientos Abril 2025` stated that theoretical exams use 40 random questions, require 85% correct answers, and have a 45 minute limit.
- The public material page links mandatory study materials, but a complete public official CABA category B question bank has not been confirmed in this branch.
- The user explicitly rejected A/A4 and other non-B question sources. Only category B practice data may be used for questions.
- Therefore the MVP content mode is `unofficial_b_fallback`: official GCBA sources anchor exam format and study context, while question practice uses a clearly labeled non-official category B fallback from `bandinopla/simulador-test-de-conducir` when no official B bank is available.

## User Stories

### User Story 1

As a Russian-speaking experienced driver preparing for the CABA theory exam, I want to study official Spanish material with optional Russian help, so that I can understand the exam wording without losing sight of the source text.

### User Story 2

As the same user, I want an exam-like practice mode driven by official format configuration, so that I can track score trends and weak topics while knowing whether the simulation is exact or approximate.

### User Story 3

As a project maintainer, I want content validation and Docker-only checks to run locally and in CI, so that source traceability, offline behavior, and deployability are protected before merge.

## Acceptance Criteria

1. Given a clean checkout with Docker installed, when `make build`, `make up`, and `make down` are run, then the production app builds in Docker, serves at a documented local URL, and stops cleanly without requiring host Node, pnpm, Python, or browser tooling.
2. Given the committed content set, when `pnpm run validate:content` or production build runs, then validation checks source hashes, required fields, source references, jurisdiction, disclaimers, image files, image hashes, approval records, release exception coverage, and `content/config/caba-exam-format.json`.
3. Given the current MVP content mode, when the app renders any primary view, then it clearly labels the dataset as `unofficial_b_fallback` and avoids official/full-bank claims.
4. Given learning mode, when a user answers a question, then the official Spanish text remains primary, Russian translation and explanation are labeled unofficial, correctness appears after submission, source/jurisdiction are visible, and mistakes/difficult marks persist locally.
5. Given exam mode, when a practice exam starts, then question count, time limit, passing score, skip/completion rules, and exact/approximate label are read from `content/config/caba-exam-format.json`, translations and explanations are hidden until completion, and score history persists.
6. Given mistake review, when the user has previous wrong answers, then the app surfaces repeated misses, weak-topic recommendations, and a focused retry loop.
7. Given vocabulary mode, when the user searches in Spanish or Russian, then matching terms, criticality, topics, and linked example questions are shown without network calls.
8. Given guide mode, when the user opens CABA-vs-RF content, then the app shows concise exam-relevant differences, source links, confidence labels, and unofficial-comment disclaimers.
9. Given the app is loaded once from the Docker-served production build, when the browser goes offline and reloads, then the app shell and bundled content remain usable.
10. Given local checks run, then unit/content tests, Playwright smoke tests, and repository preflight pass with verification evidence recorded in `tasks.md`.

## Negative Scenarios

1. Given an official source hash mismatch, missing source record, missing disclaimer, revoked approval, or uncovered solo self-audit approval, when validation runs, then the command fails and production build is blocked.
2. Given `content/config/caba-exam-format.json.status` is not `defined`, when exam mode renders, then exact simulation claims are hidden and the UI shows approximate practice labeling.
3. Given full official B-class question bank has not been validated, when home or release evidence renders, then the UI must show `unofficial category B practice set, not an official question bank`.
4. Given a non-B question source such as A/A4 or motorcycle material, when content validation runs, then the source must not be accepted as a practice question source.
5. Given translation or explanation text is shown, when the user sees it, then it must be visually separate from Spanish source text and explicitly marked as unofficial.
6. Given Docker runtime changes are made, when completion is claimed, then `make down && make build && make up && smoke && make down` evidence must exist.

## Requirements

- FR-001: Add a static SPA/PWA using React, TypeScript, and Vite.
- FR-002: Add Docker-only runtime commands `make build`, `make up`, and `make down`.
- FR-003: Store source, question, translation, explanation, vocabulary, guide, validation, and exam config data under the documented `content/` layout.
- FR-004: Keep official Spanish text in separate immutable fields from Russian translations and explanations.
- FR-005: Generate app-consumable content from committed JSON/Markdown assets without runtime network APIs.
- FR-006: Validate production content through one canonical policy file at `content/validation/production-eligibility.policy.json`.
- FR-007: Read exam parameters only from `content/config/caba-exam-format.json`.
- FR-008: Persist progress, mistakes, difficult marks, settings, and exam attempts locally in the browser.
- FR-009: Implement local search across official text, translations, topics, vocabulary, guide, and sources.
- FR-010: Register a service worker for offline app shell and asset caching.
- FR-011: Add tests covering scoring, validation, search, storage behavior, learning flow, exam flow, mobile smoke, and offline reload.
- FR-012: Update durable docs and release evidence for Docker, validation, content mode, known issues, and verification.

## Success Criteria

- SC-001: `pnpm run preflight` passes.
- SC-002: `pnpm run validate:content` passes.
- SC-003: `pnpm run test` passes.
- SC-004: `pnpm run test:e2e` passes against the production preview or Docker-served build.
- SC-005: Full Docker validation passes: `make down`, `make build`, `make up`, browser smoke test, `make down`.
- SC-006: UI shows `unofficial_b_fallback` and exact exam simulation only when source-backed config is `defined`.
- SC-007: Offline reload smoke test succeeds.

## Assumptions

- Docker is available on the user host, matching the documented repository contract.
- Internet access is allowed during Docker image build for package installation, but not required to use the built app.
- Current official GCBA sources may be bundled for local/private MVP under the recorded source licenses and release exception, while public distribution remains blocked pending legal/external review.
- A complete official CABA B-class question bank is not confirmed during this branch, so the dataset starts as an unofficial category B fallback with explicit non-official and non-full-bank labeling.
