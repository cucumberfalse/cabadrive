# Cabadrive

Cabadrive is a local-first web trainer for Russian-speaking drivers preparing for the CABA theory exam with official-source-first content and clearly marked unofficial learning aids.

## Development Workflow

This repository uses a portable multi-agent development workflow:

- durable project docs in `docs_project/`
- feature memory in `specs/<feature-id>/`
- SENAR-style verification evidence and process memory
- agent onboarding in `AGENTS.md`
- Claude-specific guidance in `CLAUDE.md`
- local preflight before push
- GitHub CI, PR Guard, and AI Review gates

## Current Project Baseline

- Legacy planning docs are in `docs/specify/`.
- Durable agent-facing docs are in `docs_project/`.
- No product runtime scaffold is committed yet; first implementation work should start from feature specs under `specs/`.

## Local Commands

```bash
pnpm run preflight
pnpm run worktree:new -- --slug 001-docs-bootstrap
pnpm run pr:publish
```

## Required PR Checks

The active list is `.unicorn-hub/config.json` (`requiredChecks`). The defaults installed by bootstrap reflect the chosen profile; stack-specific profiles that preserve existing target CI ship only Unicorn-controlled contexts (`guard`, `AI Review`) and expect the team to add the repository's real CI job names before applying branch protection.
