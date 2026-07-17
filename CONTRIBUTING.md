# Contributing to Cabadrive

Read [`AGENTS.md`](AGENTS.md) before proposing a repository change. Cabadrive uses an Orchestrator-first, spec-driven workflow: each change gets feature memory under `specs/<feature-id>/`, isolated work, and one scoped branch/pull request per implementation slice.

- Preserve sibling worktrees, branches, commits, PRs, dirty diffs, and process memory.
- Do not commit secrets or change production resources directly.
- Keep official Spanish sources primary and label Russian learning support as unofficial.
- Run `pnpm run preflight` before pushing.
- Deliver changes through a pull request; never push directly to `main`.

The complete role boundaries, verification gates, review contract, and current Docker-only runtime rules are authoritative in [`AGENTS.md`](AGENTS.md).
