# Specification: LICENSE, Attribution, And Public Project Entry Point

## Goal

Ship the P0 improvement `ТЗ-22` as one distribution-contract PR: license
Cabadrive's own code under the owner-selected Apache License 2.0, preserve the
upstream question-bank attribution, document conservative boundaries for
official-source materials, replace the stale repository entry point, and add a
small offline `О приложении` surface that exposes the same source truth to a
learner.

The cycle starts from verified `origin/main`
`ca5b5277195cd25d23b25f611dd5a3ac24d54586` in the Analyst-created worktree
`/Users/chap/devel/cabadrive-worktrees/043-license-attribution` on
`codex/043-license-attribution`. Parallel work may exist; no sibling diff,
branch, commit, PR, worktree, or process memory may be rewritten or removed.

## Scope

### In scope

- Root `LICENSE` containing the unmodified Apache License 2.0 text for
  Cabadrive-owned code and a root `NOTICE` with accurate project and retained
  upstream notices.
- A `licenses/` inventory that preserves the unmodified Apache-2.0 license for
  the pinned `bandinopla/simulador-test-de-conducir` source and documents
  third-party/official-content provenance without relicensing that content.
- A RU-first, RU+EN `README.md` with a truthful product summary, Docker-only
  user quick start, separate developer verification commands, current
  repository structure, 2–3 stable screenshots, limitations, and attribution.
- Concise `CONTRIBUTING.md` and `SECURITY.md` consistent with repository policy.
- A top-level `О приложении` tab/view implemented inside the existing
  state-based navigation, with version, canonical content-mode disclaimers,
  source attribution, official-source boundary, and canonical HTTPS repository
  link. It must remain local/offline except for user-activated external links.
- Focused automated attribution validation, unit/static tests, E2E navigation
  coverage, README image/link verification, durable docs updates, and complete
  process evidence.

### Out of scope

- `CHANGELOG`, because no release-history source or release workflow exists and
  FR-1..FR-5 do not require inventing one.
- Implementing improvement `05-url-routing`, `priority/01-usability`, or a new
  router. `#/about` is deliberately deferred; the current tab/view contract is
  sufficient and avoids a temporary competing route contract.
- Changing the question bank, official archive, translations, explanations,
  manual content, source snapshots, or their licensing status.
- A legal certification or blanket claim that GCBA, Boletín Oficial, national
  legal text, logos, marks, or third-party artwork are covered by one license.
- Enabling repository settings, publishing a personal address without owner
  approval, changing production resources, or cleaning worktrees.
- Any other item in `docs/improvements/`; each independent improvement requires
  its own Orchestrator-routed feature cycle.

## Licensing And Attribution Contract

### Cabadrive-owned code

- `LICENSE` must be byte-for-byte the canonical Apache License, Version 2.0
  text, with no custom restrictions inserted into the license body.
- Root `NOTICE` may identify the project as `Cabadrive` and use
  `Copyright 2026 Mikhail Orlov`. Discovery basis:
  the repository history begins in 2026 and all observed commits resolve to
  `Mikhail Orlov`/the repository-owner `cucumberfalse` account. Implementation
  rechecks that evidence immediately before writing; contradictory owner
  metadata is a blocker and must not be replaced by an invented organization.
- The root Apache license applies only to Cabadrive-owned code/documentation
  unless a file or inventory entry says otherwise. It must not purport to
  relicense bundled third-party or official-source content.

### Community question source

- Preserve a separately named exact license copy under
  `licenses/bandinopla-simulador-test-de-conducir-Apache-2.0.txt`; verify it is
  byte-identical to
  `content/sources/originals/bandinopla-simulador-test-de-conducir/LICENSE`.
- Attribute `bandinopla/simulador-test-de-conducir`, its HTTPS repository URL,
  Apache-2.0, pinned commit
  `90d17d47864b807415ba505b682710a8f4c441f5`, and the category-B-only
  derivation. The pinned upstream tree contains `LICENSE` and no `NOTICE`, so no
  upstream NOTICE text may be fabricated.
- Every public surface must retain the negative truth: the 460-question set is
  a community fallback, not an official or complete GCBA category-B bank.

### Official-source content

- `licenses/THIRD-PARTY-NOTICES.md` is the detailed inventory; root `NOTICE`
  and README link to it rather than making broad legal conclusions.
- Inventory separately: (1) GCBA website HTML; (2) GCBA PDFs/manual derivatives
  and source-faithful artwork; (3) Boletín Oficial documents/attachments;
  (4) Argentina.gob.ar/InfoLEG/ANSV/DNRPA national legal and administrative
  sources; and (5) governmental names, logos, marks, and third-party artwork.
  Each row names representative governed paths, source/terms URL, repository
  checked/retrieval date, attribution, and the applicable status.
- GCBA's published site terms and referenced CC BY 2.5 Argentina terms may be
  reported as the terms observed on 2026-07-16 for in-scope GCBA site content;
  they must not be asserted to cover documents or components with separate
  notices. PDFs, Boletín Oficial attachments, logos/marks, and third-party
  artwork remain `terms not conclusively established; owner/legal review
  required before broader redistribution` wherever file-specific evidence is
  absent.
- Existing source URLs, retrieval dates, hashes, conversion notes, and
  currentness records stay canonical in `content/sources/sources.json` and
  `content/official-documents/manifest.json`. Attribution docs summarize and
  link; they do not overwrite that provenance.
- No wording may imply governmental endorsement or that Russian translations,
  explanations, rewrites, or guide comments are official text.

## Documentation Contract

- README begins with a short Russian product/audience paragraph followed by a
  concise English equivalent. It describes the implemented React/Vite local-
  first trainer and removes `No product runtime scaffold is committed yet`.
- End-user quick start is exactly the Docker contract: `make build`, `make up`,
  `http://localhost:5173`, and `make down`. Host Node/pnpm is not an end-user
  requirement.
- Developer verification is clearly separate and derives commands from
  `package.json`: focused validation/tests plus `pnpm run preflight`. PR-only
  and Docker runtime rules are not weakened.
- README structure describes actual top-level areas (`src`, `content`,
  `tests`, `scripts`, `docs_project`, `specs`) and does not promise a backend.
- Screenshots live at stable repository-relative paths under
  `docs_project/screens/readme/`: desktop `Учить`, `Материалы` or `Источники`,
  and the new `О приложении` view. Use PNG, a fixed 1440×900 viewport, local
  build data, disabled animations, and a reproducible Playwright capture
  procedure. Capture only after UI/content is final; do not reuse source-manual
  pages or validation crops as product screenshots. README paths must resolve
  with exact case and render through GitHub's Markdown path rules.
- `CONTRIBUTING.md` points to `AGENTS.md`, requires Orchestrator-first feature
  memory, isolated work, PR-only delivery, `pnpm run preflight`, preservation of
  sibling work, and no secrets/production changes.
- `SECURITY.md` uses GitHub Private Vulnerability Reporting at the canonical
  repository Security Advisories page. Discovery initially found it disabled;
  on 2026-07-16 the owner explicitly authorized enabling it, Orchestrator
  enabled it, and a follow-up API read returned `enabled:true`. Public issues
  must be explicitly discouraged for undisclosed vulnerabilities, and no email
  is inferred from git history.

## UI And Version Contract

- Extend the existing `View` union with `about`, add one keyboard-operable tab
  button labelled `О приложении`, and render a semantic `AboutView`. Do not add
  hash parsing, browser-router dependencies, or change existing manual hashes.
- About content reads canonical `data.contentMode` and the registered upstream
  source from existing bundled local data; do not hand-copy a second mutable
  disclaimer source. It states Russian learning layers are unofficial.
- Add explicit package version `0.1.0` as the initial pre-1.0 application
  identifier and render it from `package.json` (or one typed module derived
  directly from it). No runtime network, current date, random value, or stale
  hard-coded commit SHA may be used as version source.
- The repository link is
  `https://github.com/cucumberfalse/cabadrive`, opens safely as an explicit
  external user action, and remains usable without making page rendering
  depend on the network.
- Existing responsive styles/tokens are reused. Links have visible text,
  headings are ordered, the active tab is visually/semantically distinguishable,
  and the view is reachable and readable at desktop and mobile widths.

## Validation Contract

- Add a deterministic attribution validator and wire it into
  `pnpm run validate:content` (and therefore build/preflight). It verifies exact
  root/upstream Apache texts, required inventory paths/provenance identifiers,
  canonical repository URL, README screenshot existence/extensions, and the
  required fallback/unofficial boundaries. It must not perform network calls.
- Begin behavior work test-first: failing focused tests for license inventory,
  README links/claims, package version, About navigation/content, accessibility,
  and offline/no-fetch behavior precede implementation, or the Implementation
  Agent records a concrete reason for any exception.
- E2E opens `О приложении` through the visible tab, verifies version,
  fallback/upstream attribution, official/unofficial boundaries and HTTPS repo
  link, checks keyboard reachability, and confirms no app-initiated request is
  made to GitHub/GCBA while rendering the view.
- Screenshot capture is evidence in addition to tests, not a replacement for
  them. Implementation records the command, viewport, final paths, dimensions,
  checked head, and manual visual inspection result.

## Acceptance Criteria

1. Root `LICENSE` is exact Apache-2.0; root `NOTICE` and `licenses/` satisfy the
   inventory above, including exact upstream license copy and pinned provenance.
2. Copyright holder/year are evidence-backed and rechecked; the upstream
   absence of NOTICE is recorded, not filled with invented text.
3. Official-material rows distinguish GCBA HTML, PDFs/manual/artwork, Boletín
   Oficial, national sources, and marks/third-party material; uncertain rights
   stay explicitly pending review and no root license claims them.
4. README is truthful RU+EN, contains separated user/developer quick starts,
   current structure/limitations/attribution, and 2–3 verified GitHub-renderable
   product screenshots.
5. `CONTRIBUTING.md` matches `AGENTS.md` and actual preflight. `SECURITY.md`
   contains a confirmed private path and no invented or unapproved contact.
6. `О приложении` is reachable by keyboard from top-level navigation and shows
   package version `0.1.0`, canonical fallback status, unofficial Russian-aid
   status, upstream and official-source boundaries, attribution links, and the
   canonical repository link while rendering entirely from bundled data.
7. Existing manual hashes/navigation and all other app modes remain functional;
   no new router/runtime backend/network dependency is introduced.
8. Focused attribution validator/tests and E2E pass, followed by
   `pnpm run validate:content`, `pnpm run test`, `pnpm run build`,
   `pnpm run test:e2e`, `pnpm run preflight`, and proportionate Docker smoke.
9. Negative-claim audit finds no surface presenting the fallback bank as
   official/complete, Russian support as official, or official materials as
   Apache-licensed by Cabadrive.
10. Process memory contains decisions, dead ends, evidence, known issues,
    cycle PR set, and every Implementation Agent feedback item with Architect
    disposition. Final Architect validation passes before final Analyst
    validation for the same effective content head.

## Negative Scenarios

- A custom/shortened Apache text, missing upstream copy, stale/missing pinned
  commit, fabricated upstream NOTICE, or a root license that appears to cover
  all bundled content fails acceptance.
- `CC BY` used as a blanket label for every GCBA/BORA/PDF/logo/artwork item, or
  language promising “legal clearance”, fails acceptance.
- A public GitHub issue, git-author email, placeholder email, or unavailable
  private-reporting URL presented as the security channel fails acceptance.
- An About view that duplicates mutable disclaimer text, loads attribution at
  runtime, introduces `#/about` routing, or breaks existing hash behavior fails.
- README screenshots made from source PDFs, stale evidence, missing paths, or
  unreviewed layouts fail; the README must not claim screenshots render on
  GitHub without evidence.
- Passing focused tests while full content/build/E2E/preflight or required
  current-head checks fail does not complete the feature.

## Required Evidence

Evidence must name exact command, outcome, full checked SHA, and relevant file
paths. It includes license byte/hash comparison, upstream tree NOTICE check,
copyright and security-channel discovery, official-source inventory review,
README local-link/image and GitHub-render check, screenshot capture/visual QA,
focused validator/unit/E2E results, full verification matrix, Docker smoke,
scope diff, `git diff --check`, independent Review Agent result, required
GitHub checks/thread/conflict state, cycle PR set, feedback dispositions, and
the final effective-content-head/current-head guard.
