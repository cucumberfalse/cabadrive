# Implementation Plan: Complete RU Manual Surface

## Summary

Implement a new complete Russian manual surface backed by deterministic source, translation, and visual-preservation manifests. The preferred architecture is a hybrid page-faithful reader: each source page has a local rendered visual asset for fidelity and a complete exact RU translation aligned to that page/content unit. This keeps the official Spanish source traceable while giving Russian-speaking learners a complete local-first study surface.

## Architecture

### 1. Source Registry

- Treat `content/official-documents/originals/gcba-manual-vehiculo-4-ruedas-2023.pdf` as the canonical source.
- Add or extend source metadata with the intake SHA-256 and 200-page count.
- Every generated manifest entry must reference the canonical source ID and page number.

### 2. Visual Preservation Assets

- Generate local page-faithful render assets for all 200 PDF pages, or implement an equivalent local manifest-backed visual strategy that proves all images and layout-sensitive visual relationships are preserved.
- Store assets under a manual-specific static content namespace.
- Record per-page asset path, dimensions, checksum, source page number, and generation metadata.
- Do not load the PDF at runtime. The PDF is a traceable archived source, not the UI rendering engine.

### 3. RU Translation Corpus

- Build a page/content-unit aligned RU corpus for the complete manual.
- Validate existing approved RU chunks against source coverage before reuse.
- For reused chunks, record provenance and coverage status in the manifest.
- Translate all missing or unmatched source text exactly and completely.
- Keep the RU corpus separate from official Spanish source metadata so labeling remains clear.

### 4. Manual Manifest and Loader

- Introduce a typed manifest consumed by the frontend. Required fields include source metadata, ordered page entries, local visual asset refs, RU content refs, translation coverage state, and source traceability refs.
- Add schema/shape validation for the manifest.
- The frontend loader should consume local bundled/static data only.

### 5. Dedicated RU Surface

- Add a distinct route, block, or source-reader mode for the complete RU 4-wheel manual.
- The UI should support ordered navigation through all manual pages/content units and show page/source attribution.
- The surface must render representative visual assets and exact RU content without depending on remote services or runtime PDF rendering.
- Existing reader components may be reused only if they can support complete manual fidelity; otherwise add a purpose-built manual reader.

## Validation Strategy

- Source coverage validator: confirms source page count, ordered page range, source hash, and page entries are complete.
- Visual asset validator: confirms every page has a local render/equivalent asset, existing file, dimensions, and checksum.
- Translation coverage validator: confirms every page/content unit has RU content and no known source unit is missing.
- Reuse validator: confirms approved RU chunks used by the manual have explicit source mappings and pass exact coverage checks.
- Runtime validator: scans/build-tests for disallowed runtime PDF viewers, PDF iframe usage, remote asset URLs, and network fetches in the manual surface.
- UI tests: verify the RU surface is reachable and can render first, middle, and last representative pages with local assets.

## Documentation Plan

Update durable project docs when implementation changes are made:

- `docs_project/project/frontend/frontend-docs.md` for the new RU manual surface and reader behavior.
- `docs_project/project/feature-inventory.md` for the complete manual feature.
- Backend/content docs if new content-generation scripts, manifests, or validation commands are added.
- Any source-document or local-runtime docs affected by generated assets, Docker build behavior, or static hosting assumptions.

## Testing Plan

- Run repository lint/type/build checks available for the current stack.
- Run any new manifest validators directly and through the normal preflight path.
- Run local static/Docker build checks required by the repository once runtime scaffolding supports them.
- Add focused tests around manifest loading, route availability, representative rendering, and prohibited runtime dependencies.
- Capture verification evidence in `tasks.md` or implementation notes once commands pass.

## Risks and Mitigations

- Translation alignment drift: require page/content-unit mapping and coverage validation before completion.
- Missing tiny visuals/icons: prefer page-faithful renders and checksum-backed per-page asset inventory.
- Existing chunk mismatch: require exact source mapping before reuse; treat uncertain chunks as not reusable.
- Large asset footprint: use deterministic image settings and document size/performance tradeoffs without reducing completeness.
- Official/unofficial confusion: keep source attribution visible and separate official Spanish source metadata from RU learning support.

## Architect Guidance to Implementation Agent

- Preserve parallel work and do not mutate sibling worktrees, branches, commits, PRs, dirty diffs, or process memory.
- Stay within the assigned implementation PR slice and keep this feature memory current.
- Do not ship a partial/manual preview path under the complete manual entry point.
- Record any needed divergence or improvement as Implementation Agent feedback for Architect disposition instead of expanding scope silently.
- No repository completion claim is valid until validators, tests, docs, and acceptance evidence cover the full 200-page manual.
