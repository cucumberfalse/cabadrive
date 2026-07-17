# Implementation Plan: LICENSE, Attribution, And Public Project Entry Point

## Delivery Shape

Use the Analyst-created latest-main handoff as one implementation branch and
one PR slice. The legal files, public documentation, About view, screenshots,
and validation form one coherent distribution contract; splitting them would
temporarily leave public claims and runtime attribution inconsistent. If the
security-channel blocker is not resolved, implementation may prepare all other
work but must not invent `SECURITY.md`, declare acceptance, or publish a ready
PR as complete.

No new abstraction or runtime dependency is justified. About remains a small
component in the current state-based SPA, uses existing bundled data, and reuses
existing layout tokens. A focused offline validation script is justified
because exact license texts and attribution boundaries are distribution gates
that ordinary UI tests cannot protect.

## Implementation Sequence

1. **Pre-edit discovery and blocker gate**
   - Confirm branch/worktree/base and preserve all existing untracked intake
     memory and sibling work.
   - Recheck sole-author/copyright evidence, canonical repo URL, pinned upstream
     commit/tree/license/NOTICE state, official-source classes/terms records,
     and GitHub private vulnerability reporting.
  - Recheck `Copyright 2026 Mikhail Orlov` against repository-owner/history
    evidence and confirm the owner-enabled GitHub Private Vulnerability
    Reporting endpoint still reports `enabled:true`.
   - Record evidence without copying credentials/tokens or exposing an
     unapproved email.

2. **Write failing focused tests**
   - Add static/unit coverage for exact Apache texts, inventory/provenance,
     README claims/relative images, package version and non-official boundaries.
   - Add E2E expectation for the not-yet-implemented About tab/view, canonical
     content, keyboard access, repository link and no runtime attribution fetch.
   - Run only focused tests and record the expected failure.

3. **Establish license and notice inventory**
   - Add exact root `LICENSE`, root `NOTICE`, exact pinned-upstream license copy,
     and detailed `licenses/THIRD-PARTY-NOTICES.md` according to the spec.
   - Do not edit archived originals or official manifests to force a stronger
     legal conclusion. Mark uncertainty explicitly.

4. **Build the truthful public entry point**
   - Rewrite README in RU-first/RU+EN form, separate Docker user flow from
     developer commands, describe actual structure and limitations, and link
     the license inventory.
  - Add CONTRIBUTING and the owner-approved GitHub Private Vulnerability
    Reporting SECURITY channel.
   - Add `version: 0.1.0` to `package.json`; avoid dependency changes.

5. **Implement minimal About navigation**
   - Add `about` to `View`, one top-level tab, AboutView and scoped responsive
     styling.
   - Render content-mode/source facts from existing imports and version from
     the package source. Preserve all current hash behavior.

6. **Protect the contract automatically**
   - Implement `scripts/validate-license-attribution.mjs`, expose
     `validate:attribution`, and include it in `validate:content`.
   - Make the focused static/unit and E2E tests pass, including negative claims
     and request interception.

7. **Capture and verify screenshots**
   - Build/serve locally, use Playwright at 1440×900 with disabled animations,
     capture three final PNGs under `docs_project/screens/readme/`, and visually
     inspect them for truthful labels, no clipped UI, no personal data, and no
     transient state.
   - Add the repository-relative paths to README, verify exact dimensions and
     PNG signatures, then verify rendered README paths through the GitHub PR or
     a GitHub Markdown/rendered-blob view. A local path check alone is not the
     claimed GitHub evidence.

8. **Durable docs and full verification**
   - Update `docs_project/project/frontend/frontend-docs.md`,
     `docs_project/project/feature-inventory.md`, and
     `docs_project/screens/learning-and-exam-flows.md` for About/version/
     attribution behavior. Update no unrelated product docs.
   - Run the matrix below, record exact outputs/current SHA, update tasks/process
     logs, then commit/push/open one ready PR only as assigned by Orchestrator.

9. **Review, feedback, and final validation**
   - Review Agent checks legal-boundary wording, exact inventory, misleading
     claims, security path, README images, UI accessibility/offline behavior,
     tests, and feature-memory compliance without editing.
   - Orchestrator routes every finding and Implementation feedback. Architect
     disposes feedback and performs final validation after fixes/checks; Analyst
     final validation follows only after Architect passes.

## Verification Matrix

| Boundary | Command/evidence | Pass condition |
|---|---|---|
| Focused attribution | `pnpm run validate:attribution` | Exact license texts, inventory, provenance, README image paths and negative boundaries pass offline |
| Focused unit/static | `node --test tests/license-attribution.test.mjs` | All new assertions pass |
| Focused About E2E | `pnpm run build` then `pnpm exec playwright test tests/e2e/app.spec.ts --grep "О приложении" --project=chromium` | Navigation, content, keyboard and no-fetch assertions pass |
| Canonical content | `pnpm run validate:content` | Existing and new gates pass without weakening `unofficial_b_fallback` |
| Node suite | `pnpm run test` | Full suite passes |
| Production bundle | `pnpm run build` | Static build and service worker generation pass; no remote About asset/request |
| E2E suite | `pnpm run test:e2e` | Both configured projects pass, including existing hash/manual modes |
| Repository preflight | `pnpm run preflight` | Full repository gate passes on candidate head |
| Docker runtime | isolated `COMPOSE_PROJECT_NAME`/free `CABADRIVE_HOST_PORT` with `make build`, `make up`, HTTP/UI smoke, `make down` | Docker-only contract serves About and shutdown affects only assigned compose project |
| Screenshots | fixed Playwright capture + image metadata/signature check + manual visual review | Three 1440×900 PNGs are current, readable, stable and linked |
| GitHub README | PR/blob rendered inspection | All three images render from relative paths and links resolve |
| Scope/format | `git diff --check`; `git diff --name-status ca5b5277195cd25d23b25f611dd5a3ac24d54586...HEAD` | No whitespace errors or unrelated improvement/sibling changes |

Do not run `make down` without an isolated compose project. Do not treat an
older head's preflight, screenshots, review, or GitHub checks as current.

## Review Checklist

- Root license scope is Cabadrive-owned work; third-party/content terms remain
  separate and exact upstream Apache text is preserved.
- Holder/year, upstream pin and no-NOTICE result are evidence-backed.
- GCBA website terms are dated and qualified; PDF/BORA/logo/artwork uncertainty
  is not silently converted into permission.
- All RU/EN/Spanish claims preserve the unofficial fallback and unofficial
  Russian-support boundaries.
- SECURITY is private and confirmed, not inferred from git history.
- README user flow is Docker-only and screenshots are final/public-safe.
- About uses canonical bundled data, no network/backend/new router, safe links,
  semantic headings and keyboard/mobile access.
- Existing manual hashes and top-level modes still work.
- Process memory and every feedback disposition are current.

## Completion And Cleanup

Orchestrator records the cycle PR set (expected one PR), effective content head,
required checks, review threads, conflicts, acceptance evidence, feedback
dispositions, final Architect then Analyst timestamps/SHAs, and the read-only
current-head guard. Any non-evidence change after validation makes validation
stale.

Cleanup is `not applicable` unless Orchestrator creates a separate Cleanup Agent
assignment naming approved roots and exclusions. This active handoff worktree
and all ambiguous/sibling environments must be preserved.
