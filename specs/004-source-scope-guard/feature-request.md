# Feature Request: Source Scope Guard

## Analyst Artifact Status

Created by Analyst intake on 2026-05-08 for a new repository-changing feature.

## User Request

The user asked to start a new feature to fix the weak spot found in the A/A4/motorcycle guard. The requested workflow is Analyst intake first, then Orchestrator should trigger the rest of the flow and drive the work to a merge-ready PR.

Relevant prior analysis:

- The guard is useful when it prevents A, A4, or motorcycle-specific source banks from being used as category B practice material.
- It should not claim that the category B exam contains no motorcycle-related topics.
- It should not blindly remove or reject category B questions merely because the question text mentions motorcycles, ciclomotors, motovehicles, or shared-road topics.
- The better boundary is source selection: accept only sources explicitly scoped to category B practice, and reject sources explicitly scoped to category A, A4, motorcycle, or unknown practice scope.

## Clarified Answers And Assumptions

- No extra clarification was requested because the desired product direction is specific enough and matches the prior architectural review.
- Assume the implementation should update product validation code, tests, and durable docs where the source-selection contract is described.
- Assume current fallback data can remain if it is explicitly marked as category B practice source data.
- Assume exact official category B bank validation remains out of scope; this feature only hardens how practice sources are accepted or rejected.

## Project Context Reviewed

- `.specify/memory/constitution.md`: Analyst, Orchestrator, Architect, Implementation Agent, and Review Agent workflow.
- `docs_project/project-idea.md`: Cabadrive focuses on helping Russian-speaking experienced drivers pass the CABA category B theory exam.
- `docs_project/project/frontend/frontend-docs.md`: current app is local-first and uses `unofficial_b_fallback`.
- `docs_project/project/backend/backend-docs.md`: `scripts/validate-content.mjs` owns content validation.
- `docs_project/project/feature-inventory.md`: current boundary says A/A4, motorcycle, and other non-B question sources are not used.
- `docs_project/screens/learning-and-exam-flows.md`: UI must avoid official/full-bank claims.
- `docs/specify/README.md`: project success is exam-focused preparation, not broad driving-school coverage.
- `specs/002-mvp-runtime/spec.md`, `plan.md`, and `tasks.md`: current source policy, prior A4 dead end, and non-B guard history.
- `scripts/validate-content.mjs`: current guard rejects source metadata by regex.
- `content/sources/sources.json`: current source registry lacks a structured practice-question source scope.
- `tests/content-validation.test.mjs`: current tests cover passing validation and image count, but not source-scope edge cases.

## External Research

- [GCBA material page for theoretical exam](https://buenosaires.gob.ar/licenciasdeconducir/curso-de-educacion-vial-para-otorgamiento-de-licencia/material-de-estudio-para): distinguishes study materials for four-wheel vehicles, motos, and cuatriciclos.
- [GCBA Manual de Procedimientos Abril 2025 PDF](https://documentosboletinoficial.buenosaires.gob.ar/publico/PE-DIS-SECGVC-DGHC-562-25-ANX.pdf): records distinct theoretical exam groups for subclases A, A4, and B.
- [Argentina.gob.ar license classes](https://www.argentina.gob.ar/seguridadvial/licencianacional/clasesysubclases): class A is motorcycle/ciclomotor scope and class B is autos/utilitarios/camionetas scope.

These sources support source-level class separation, not text-level removal of every motorcycle reference from category B training.

## Problem Statement

The current non-B guard uses a regex over source metadata to reject A/A4/motorcycle-looking sources. That is a useful emergency safeguard, but it encodes source eligibility through fuzzy text matching. This can create false positives for valid category B sources that mention motorcycles as road users, and it does not create a clear machine-readable contract for future source ingestion.

## Proposed Outcome Or Workflow

1. Add an explicit source-scope contract for practice-question sources.
2. Update validation so category B questions must reference a source whose structured practice scope explicitly allows category B.
3. Reject missing, unknown, category A, category A4, motorcycle-specific, or otherwise non-B practice source scopes.
4. Stop treating ordinary motorcycle-related words in source text or question text as an automatic rejection when structured source scope is valid for category B.
5. Add regression tests for valid category B sources that mention motorcycles, invalid A/A4/motorcycle source scopes, and missing source scope.
6. Update durable docs and feature memory so future agents understand that the guard protects source selection, not topic mentions inside valid B material.

## Role Boundaries Or Affected Actors

- Analyst: creates this `feature-request.md` and hands off to Orchestrator.
- Orchestrator: coordinates Architect, Implementation Agent, and Review Agent through PR readiness.
- Architect: writes `spec.md`, `plan.md`, and `tasks.md` with the technical contract and verification plan.
- Implementation Agent: changes validation code, content source metadata, tests, and relevant docs according to the active feature memory.
- Review Agent: checks diff for behavioral bugs, missing tests, and workflow contract violations without changing code.

## Artifact And Handoff Expectations

- Analyst writes only this `feature-request.md` intake artifact.
- Analyst hands off to Orchestrator and shuts down after intake is ready.
- Architect starts from this artifact and writes `spec.md`, `plan.md`, and `tasks.md`.

## Open Questions And Risks

- There may be a future need for a richer source-ingestion schema. For this feature, keep the contract small and focused on practice-question source eligibility.
- Current official category B full-bank status remains unresolved and must not be implied by this change.
- Regex-based metadata rejection should not be replaced by a weaker check; it should be replaced by an explicit structured contract with tests.
- The current feature-memory guard may still manually/review-enforce `feature-request.md`; record evidence in `tasks.md`.

## Acceptance Expectations

- Architect should define acceptance criteria proving the validator rejects category A/A4/motorcycle-specific practice sources by structured scope.
- Architect should define acceptance criteria proving a category B source remains accepted even if metadata or question content mentions motorcycles as shared-road topics.
- Architect should require tests for source-scope validation edge cases.
- Architect should require docs/process memory updates and local preflight evidence before PR readiness.
