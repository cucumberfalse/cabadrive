# Plan: Russian CABA License Exam Process Guide

## Summary

Implement one conservative content-and-UI slice that adds a Russian CABA driver's-license process guide to the static local-first app. The slice should focus on B1/private car `Otorgamiento de Licencia de Conducir`, bundle all guide content locally, show official links and checked dates, label volatile/currentness-sensitive information, preserve Spanish administrative terms, and avoid legal, immigration, medical, runtime-network, and raw-PDF behavior.

This Architect pass only creates feature memory. It does not edit product code, tests, runtime files, durable docs outside `specs/012-caba-exam-process/`, commits, pushes, PRs, or reviews.

## Technical Context

- Frontend: React + TypeScript + Vite static SPA.
- Runtime contract: Docker-served static build; no backend in MVP.
- Existing data boundary: `src/data/content.ts` imports bundled JSON content and exposes typed data/helpers.
- Existing app state: `src/App.tsx` uses React state-driven views, currently including learning, exam, mistakes, vocabulary, CABA/RF guide, and materials UI in the observed codebase.
- Existing content-source governance:
  - official archives belong under `content/official-documents/` when committing verbatim official source materials;
  - Russian learning prose belongs outside the official archive;
  - guide claims should retain source traceability and currentness metadata.
- Existing verification commands:
  - `pnpm run validate:content`;
  - `pnpm run test`;
  - `pnpm run build`;
  - `pnpm run test:e2e`;
  - `pnpm run preflight`;
  - `git diff --check`.

## Constitution Check

- Spec-first: yes; `feature-request.md` exists and this pass creates `spec.md`, `plan.md`, and `tasks.md` before implementation.
- Testable boundaries: yes; structured content, source metadata validation, UI rendering, and offline/no-request behavior can be tested without real external services.
- Test-first bias: yes; implementation should add or update focused tests alongside the new content model and UI.
- Supervised verification: yes; acceptance criteria require source-currentness evidence, command evidence, Playwright evidence, and process memory.
- PR-only workflow: yes; future implementation must land through a branch/PR managed by Orchestrator.
- One worktree per task: yes; implementation must use the Orchestrator-assigned isolated worktree and preserve parallel diffs.
- Deployability: yes; the app remains static/local-first and existing flows remain reachable.
- Simplicity: yes; prefer bundled JSON and existing React view patterns before adding dependencies.
- Process memory: yes; `tasks.md` must record decisions, dead ends, known issues, verification evidence, and Implementation Agent feedback.

## Architect Decisions

### Scope B1/Private Car Otorgamiento First

The first slice should focus on CABA `Otorgamiento de Licencia de Conducir` for B1/private car/non-professional users. This matches Cabadrive's current category B emphasis and avoids creating a broad licensing portal with many edge cases.

### Use Adjacent-Path Callouts, Not Full Adjacent Guides

`Renovación`, `Renovación por cambio de jurisdicción`, beginner status, prior foreign licenses, foreigner documentation, motorcycle/moto, and professional/interjurisdictional paths may be mentioned only as compact callouts with direct official links. They must not be expanded into full guidance in this slice.

### Treat Official Sources As Primary Data

Content must be based on official GCBA/ANSV sources. Community research from Analyst intake may explain why Russian users are confused by certain terms, stale prices, or routing choices, but cannot define requirements or current values.

### Prefer Structured Bundled Content

The likely implementation should introduce a bundled content artifact such as `content/guide/caba-exam-process.ru.json` or similar, imported through `src/data/content.ts`. Hard-coded JSX prose is discouraged if it makes source links, checked dates, volatile flags, or glossary entries hard to validate.

### Source Metadata Is Part Of The Content Contract

Every major process section should carry source metadata. A minimal source shape should include:

```ts
type ProcessGuideSourceRef = {
  id: string;
  title: string;
  url: string;
  checkedAt: string; // ISO date
  officialOwner: "GCBA" | "ANSV" | "Gobierno Argentino";
  currentnessStatus: "checked_current" | "checked_current_with_historico_url" | "volatile_check_required";
};
```

Implementation may adjust names to match local conventions, but must preserve the semantics.

### Model Volatile Claims Explicitly

Fee amounts, appointment/sede availability, CENAT amount, BUI details, and Boti/miBA screens should be modeled as volatile, dated, or omitted. The guide should avoid evergreen exact amounts unless the UI makes the checked date and official verification path obvious.

### No Legal Or Medical Advice

The copy should use procedural language: "official page says", "verify on official page", "this depends on status", "the guide does not determine eligibility." It must avoid advising the user that they qualify, should submit a particular immigration/legal document, or meet medical criteria.

### Images Are Optional

Images should ship only if they pass asset-specific checks. A first PR with no images is acceptable if the guide is otherwise useful and complete. Do not use screenshots from Boti/miBA/community chats.

## Recommended Content Shape

Implementation should consider this local content structure:

```text
content/guide/caba-exam-process.ru.json
```

Suggested high-level fields:

```ts
type CabaExamProcessGuide = {
  version: number;
  id: "caba-exam-process";
  locale: "ru";
  status: "draft" | "published";
  contentStatus: "unofficial_learning_aid";
  primaryScope: {
    jurisdiction: "CABA";
    procedure: "otorgamiento";
    category: "B1";
    audienceRu: string;
  };
  lastReviewedAt: string;
  disclaimerRu: string;
  officialActionWarningRu: string;
  sources: ProcessGuideSourceRef[];
  sections: ProcessGuideSection[];
  officialLinks: ProcessGuideOfficialLinkGroup[];
  glossary: ProcessGuideGlossaryTerm[];
  optionalImages?: ProcessGuideImage[];
};
```

Suggested section fields:

```ts
type ProcessGuideSection = {
  id: string;
  titleRu: string;
  summaryRu?: string;
  bodyRu: string[];
  spanishTerms?: string[];
  sourceIds: string[];
  volatility?: "stable_procedure" | "volatile_fee" | "volatile_location" | "volatile_screen" | "volatile_document_list";
  calloutType?: "required_step" | "optional_preparation" | "adjacent_path" | "warning";
};
```

Suggested glossary fields:

```ts
type ProcessGuideGlossaryTerm = {
  id: string;
  termEs: string;
  translationRu: string;
  explanationRu: string;
  sourceIds?: string[];
};
```

Suggested image fields, only if used:

```ts
type ProcessGuideImage = {
  id: string;
  localPath: string;
  altRu: string;
  captionRu: string;
  sourceUrl: string;
  license: string;
  attribution: string;
  checkedAt: string;
  privacyReview: "passed";
};
```

Implementation can choose a different exact schema if it is simpler and testable. Any schema decision must be recorded in `tasks.md`.

## Official Source Set For Implementation Recheck

Implementation must recheck current official pages after the 2026-05-10 Analyst intake and record evidence in `tasks.md`. At minimum:

- GCBA `Otorgamiento de Licencia de Conducir`;
- GCBA `Extranjeros`;
- GCBA `Curso de Educación Vial para Otorgamiento de Licencia`;
- GCBA `Material de estudio para examen teórico`;
- GCBA `Examen práctico`;
- GCBA `Pista de aprendizaje para conductores`;
- GCBA `Certificado Nacional de Antecedentes de Tránsito (CENAT)`;
- ANSV/Gobierno Argentino CENAT payment page;
- GCBA `Principiantes`;
- GCBA April 2025 `Manual de Procedimientos` only if manual-backed psychophysical, validity, exception, or deep procedural claims are included.

If a listed page is unavailable, redirected, or materially changed, implementation must either update the guide to the current official source or record a blocker for Orchestrator/Architect disposition.

## Implementation Strategy

1. Recheck official sources and record currentness evidence before finalizing content.
2. Decide the navigation placement:
   - preferred: distinct process-guide view with a short Russian label such as `Процесс` or `Права в CABA`;
   - acceptable fallback: visible entry under `Материалы` if top navigation is too crowded and Playwright proves reachability.
3. Add bundled structured guide content with source metadata, checked dates, volatile fields, official-link groups, sections, glossary terms, and optional images only if approved.
4. Import guide content through `src/data/content.ts` or a nearby established data boundary.
5. Add TypeScript types for the subset of content used by the UI.
6. Add unit/data validation for new content model if one is introduced.
7. Add the UI surface:
   - first screen should be the actual guide, not a landing page;
   - show scope and unofficial-support status near the top;
   - show source checked/review date prominently;
   - render step flow, practical/psychophysical/theory/course/payment/location sections, official link groups, and glossary.
8. Render source/date labels near process claims without turning the UI into an archive browser.
9. Render volatile warnings for fees, sedes, appointments, Boti/miBA screens, and document lists.
10. Render adjacent-path callouts compactly and with direct official links.
11. If images are approved:
   - store them locally under a content asset path;
   - add attribution and license metadata;
   - render with local asset semantics;
   - test local rendering and no external image requests.
12. Update durable docs only where behavior changes:
   - `docs_project/screens/learning-and-exam-flows.md` if navigation/flow changes;
   - `docs_project/project/frontend/frontend-docs.md` if the new content surface/data import becomes part of the frontend baseline;
   - `docs_project/project/feature-inventory.md` if the feature becomes part of inventory;
   - `docs_project/project/content-sources.md` if source/archive/image policy or maintenance workflow changes.
13. Run required tests/preflight and record evidence.

## UI Guidance

- Keep the UI work-focused and scannable, similar to a trainer/control surface.
- Avoid a marketing-style landing page; the guide itself should be the first useful view.
- Russian labels are primary; Spanish terms should be visible in their official form.
- Keep official links grouped by action: start procedure, pay CENAT, check foreigners, course, theory material, practical exam, optional practice, beginner status.
- Use concise warnings for volatile data and unofficial status.
- Do not put raw official PDFs inside an in-app viewer. Link to the official PDF/page when needed.
- Use icons only where they clarify navigation or sections; preserve readable text.
- Ensure long Russian and Spanish terms wrap cleanly on mobile.

## Test And Verification Matrix

| Area | Evidence |
| --- | --- |
| Feature memory | `feature-request.md`, `spec.md`, `plan.md`, and `tasks.md` exist before product edits. |
| Source currentness | `tasks.md` records official URLs, checked dates, and result of implementation-time recheck. |
| Content model | Unit/data validation covers required fields, official source metadata, checked dates, volatile labels, glossary shape, links, and optional image metadata if a new model is added. |
| Navigation | Playwright opens the process guide from the chosen navigation path and existing app sections remain reachable. |
| Scope clarity | Playwright or DOM evidence confirms B1/private car `Otorgamiento` scope and unofficial Russian support labels are visible. |
| Official links | Playwright asserts official source titles, checked dates, and links are visible for major claim groups. |
| Volatile data | Tests assert volatile warnings or omission behavior for fee/sede/turn/form-screen details. |
| Glossary | Tests assert representative Spanish terms and Russian explanations render. |
| Practical/psychophysical | Tests assert those sections render with procedural wording and no medical/legal advice marker text introduced by the app. |
| Images | If images ship, tests assert local asset rendering and attribution; if not, process memory records omission decision. |
| Local-first | Playwright request monitoring confirms browsing the guide makes no external requests; code review confirms no runtime fetch/backend/PDF viewer. |
| Regression | Existing learning, exam, mistakes, vocabulary, materials, and CABA/RF flows still pass relevant e2e coverage. |
| Preflight | Required commands pass or exact unrelated blockers are recorded. |

## Likely Files For Implementation

Implementation will probably touch a subset of:

```text
content/guide/caba-exam-process.ru.json
content/assets/... if optional images are approved
scripts/validate-content.mjs or a focused validator if adding governed content validation
scripts/*.mjs test files if validator/unit coverage is added
src/data/content.ts
src/App.tsx or nearby view/components
src/styles.css
tests/e2e/app.spec.ts
docs_project/screens/learning-and-exam-flows.md if navigation changes
docs_project/project/frontend/frontend-docs.md if frontend content behavior changes
docs_project/project/feature-inventory.md if inventory changes
docs_project/project/content-sources.md if source/image governance changes
specs/012-caba-exam-process/tasks.md
```

Implementation must not edit unrelated feature memory, product areas, runtime files, or docs outside the required scope unless Orchestrator/Architect explicitly broadens the task.

## Risks And Mitigations

- Risk: Official fees or form flow changes between intake and implementation.
  - Mitigation: recheck sources near release; prefer dated/volatile wording; avoid evergreen exact amounts.
- Risk: Community anecdotes make the guide sound more confident than official sources allow.
  - Mitigation: keep community context separate and subordinate; Review Agent checks official priority.
- Risk: Foreigner status/document requirements are oversimplified.
  - Mitigation: use conditional caveats and official links; avoid universal checklist wording.
- Risk: Psychophysical details become medical advice.
  - Mitigation: describe procedure only; cite official/manual sources for any detail beyond high-level expectation.
- Risk: Images become stale or licensing/privacy is unclear.
  - Mitigation: omit images unless review passes; local attribution metadata is required.
- Risk: New content model creates validation debt.
  - Mitigation: add focused schema/unit validation with required source metadata and checked dates.
- Risk: Navigation becomes crowded.
  - Mitigation: choose a short label or a clearly reachable materials subsection; verify on mobile.

## Handoff To Implementation

Implementation Agent must start only after this `spec.md`, `plan.md`, and `tasks.md` exist. The implementation PR should be one conservative content-and-UI slice, use the assigned isolated worktree and branch, keep `tasks.md` current, and stop for Architect disposition if current official sources force a scope change or if implementation needs to expand beyond B1/private car `Otorgamiento`.
