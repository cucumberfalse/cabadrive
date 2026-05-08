# Feature Memory

Create one folder per repository-changing feature or change:

```text
001-example/
  feature-request.md
  spec.md
  plan.md
  tasks.md
```

`feature-request.md` is the Analyst intake artifact. It records the original
request, clarification Q&A, assumptions, project context, external research
when used, open questions, risks, and acceptance expectations before Architect
planning starts.

`spec.md`, `plan.md`, and `tasks.md` are the Architect-owned implementation
feature memory. Repository-changing PRs must include all four artifacts once the
Analyst workflow is in use. Legacy feature folders created before Analyst
adoption may omit `feature-request.md` only when the reason is recorded in
`tasks.md`.

Use the installed `.specify/templates/` files so each feature records goal,
scope, acceptance evidence, negative scenarios, process memory, review
requirements, and verification requirements.

## Numbering

The Analyst chooses the feature folder number by scanning existing directories
under `specs/`, taking the maximum numeric prefix, adding one, and zero-padding
to three digits. Duplicate existing prefixes do not change the rule; for
example, if several `002-*` folders exist, the next prefix is `003`.

If the target folder name collides, keep the same next numeric prefix and choose
a clearer slug, or ask the Orchestrator to coordinate before writing. If one
request contains independent goals, split them into separate folders or record a
split decision before handoff.
