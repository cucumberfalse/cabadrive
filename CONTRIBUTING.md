# Contributing to Cabadrive

Read [`AGENTS.md`](AGENTS.md) before proposing a repository change. Cabadrive uses an Orchestrator-first, spec-driven workflow: each change gets feature memory under `specs/<feature-id>/`, isolated work, and one scoped branch/pull request per implementation slice.

- Preserve sibling worktrees, branches, commits, PRs, dirty diffs, and process memory.
- Do not commit secrets or change production resources directly.
- Keep official Spanish sources primary and label Russian learning support as unofficial.
- Run `pnpm run preflight` before every push.
- Deliver changes through a pull request; never push directly to `main`.

The complete role boundaries, verification gates, review contract, and current Docker-only runtime rules are authoritative in [`AGENTS.md`](AGENTS.md).

## Code quality

Use `pnpm run typecheck`, `pnpm run lint`, and `pnpm run format:check` for focused
checks. `pnpm run quality:fast` combines typecheck and lint. `pnpm run format`
formats only the explicit code allowlist; governed manual sources, content,
documentation, licenses, evidence, images, and generated artifacts are excluded.

When investigating history across the mechanical formatting migration, use:

```bash
git blame --ignore-revs-file .git-blame-ignore-revs <path>
```
