# Image pipeline (ТЗ-P3 stage 1)

The pipeline creates and verifies derived images before build. Today's canonical
assets, content pins and UI remain unchanged. Production has no verified PNG
masters yet: the committed empty registry reports `no-masters`, rather than
claiming production raster quality or later-stage resolution/traffic targets.

## Commands

```sh
pnpm run setup:image-qa
pnpm run audit:image-qa
pnpm run build:images
pnpm run validate:images
node scripts/content-image-derivatives.mjs --write
```

Setup and the native dependency audit are explicit network-enabled maintainer operations. Generation and
validation operate offline with already installed tools. `validate:content`
includes image validation; normal `build` validates and copies assets without
regenerating reviewed content. `--write` refreshes measured audit evidence only
after current bytes, identities and real quality gates pass. It cannot adopt a
tampered derivative or rewrite source approvals.

For isolated tests, both CLIs support `--root /absolute/fixture-root`; adding
`--raster-only` skips production SVG audit only for such a separate fixture root.
Unknown flags fail. Normal production commands always include the SVG audit.

## Source registry and derived files

`content/image-pipeline.sources.json` has schema version 1 and sorted `sources`:

```json
{
  "sourcePath": "content/assets/questions/original.jpg",
  "masterPath": "content/assets-masters/questions/original.png",
  "class": "a",
  "profile": "photo",
  "targetWidth": 1600
}
```

Classes `a`, `b`, `c` represent the later raster stages; profiles are explicit
`photo` or `text`. The logical source must exist. Every file under the ignored
master directory must be registered real lossless PNG: extension, byte MIME,
complete pixel decode and single-frame orientation checks all apply. JPEG
(including current Swift-generated page JPEG), renamed formats, truncated or
animated PNG, duplicate/unregistered inputs, traversal and symlinks fail. Future
maintainers must preserve/recover actual PNG master provenance outside the
runtime payload; existing JPEGs are not promoted into masters.

Raster derivatives are commit-eligible in
`content/assets-derived/img/<class>/<id>-<width>.<hash8>.<ext>`. The manifest stores
relative delivery paths `content/img/...`, full hashes, byte sizes, dimensions,
quality/attempt, source/generation identity and measured QA. Asset sync copies
only persistent raster derivatives to `public/content/img/`, preserving hashed
URLs. Masters, native caches and SVG audit output do not enter public/dist.
Stage 1 adds no immutable image-cache or service-worker delivery policy.

The canonical manifest uses the shared `canonicalJson` serializer with one
newline, no timestamps or absolute paths. Generation hashes bind current
registry semantics, source bytes, encoder policy and relevant tool versions.
Reuse requires complete expected inventories, fresh output/source hashes,
MIME/format/dimensions and recomputed real metrics. Existence, mtime and stored
scores never authorize reuse. Generation keeps old hashed outputs; pruning is a
later deliberate operation. Hash URL collisions refuse overwrite, and a failed
build preserves the prior manifest.

## Encoding and real quality gates

All references and derivatives normalize to 8-bit sRGB, flatten alpha on white
and strip metadata. Widths are 480, 800, 1200, 1600 and 2400, never enlarged; a
smaller source keeps its natural width. Heights are rounded from the source
aspect ratio. Explicit target widths must be reachable. Each encoder gets its
own buffer with explicit `fill`, `lanczos3` and `withoutEnlargement` settings.

| Profile | AVIF | WebP | JPEG |
| --- | --- | --- | --- |
| photo | quality 55, effort 4, 8-bit, tune iq, 4:2:0 | quality 82, effort 4 | quality 82, mozjpeg/progressive, 4:2:0 |
| text | quality 70, effort 4, 8-bit, tune iq, 4:4:4 | quality 90, effort 4 | quality 90, mozjpeg/progressive, 4:4:4 |

Every variant passes native DSSIM `<=0.01`. SSIMULACRA2 `>=70` applies to the
hash-ranked 5% sample (rounded up, at least one nonempty candidate), ordered by
SHA-256 of `sourcePath|width|format`. A failed codec gets exactly one quality +5
retry capped at 100; a second failure aborts. The candidate is decoded at its
actual size; only the master reference is resized to that exact size. Larger
candidates, mismatched dimensions, missing/wrong tools and nonfinite scores fail.
Real tests cover same-image equality, good/degraded output, all codecs/widths,
repeatability, forged QA, tamper/write rejection and natural-width fallback.

## SVG audit

The explicit SVGO 4 configuration preserves dimensions, viewBox, titles,
descriptions, IDs/references, geometry and styles. All 1,382 class-(d) learning
SVGs are actually processed into ignored `content/assets-derived/svg/` output.
The committed full inventory audit stores before/after hashes and byte sizes,
config/tool/renderer identity and 30 deterministic prefix-bucket representative
samples. Each pair uses the same Sharp/libvips renderer on a 640×480 sRGB white
canvas and native DSSIM `<=0.001`. Validation optimizes in memory and recomputes
all sample metrics even on a clean checkout with no ignored outputs.

Class (e) is absent and explicitly recorded; future appearance requires a policy
update. Four governed manual SVGs remain protected outside optimization. No
canonical source or existing pin is overwritten. Savings are measured in the
audit; stage 1 does not promise the proposal's estimated percentage.

## Native tools and platform boundary

Exact development packages: Sharp 0.35.5, SVGO 4.1.0, file-type 21.3.2.
The project keeps the seven-day release-age rule and requires Node >=20.9.0. D-011 replaces the initial security-flagged npm pins; the complete resolved candidate graph passed pinned OSV Scanner 2.3.5 before installation. AVIF tuning is explicitly `iq` in encoder options and policy identity. Native DSSIM 3.4.0 and
SSIMULACRA2 CLI 0.5.2 live under `.cache/image-qa/`; setup verifies crate checksums,
locked source identity, reported versions and a real known-equal comparison.
SSIMULACRA2 retains CLI 0.5.2/core 0.5.0 and uses the reviewed committed
`Cargo.lock`: bytemuck 1.16.3, bytes 1.11.1, crossbeam-channel 0.5.15,
spin 0.9.9, anyhow 1.0.103, crossbeam-epoch 0.9.20 and rand 0.8.6 replace the
approved published entries. DSSIM's reviewed lock changes only crossbeam-epoch
to 0.9.20. Metric sources, core versions and feature selection stay fixed. Setup
copies checksum-verified crates into owned scratch and installs `--path --locked`,
with `--no-default-features` for SSIMULACRA2 and no runtime `cargo update`.
The receipt binds source, effective lock, features and actual binary hashes;
all integrity checks run before help/version or metric execution. Stale same-version
installations rebuild via root-local Cargo ownership. CI pins Rust 1.85.1 and uses the same setup. Docker uses a build-only
Rust 1.85.1 Alpine 3.21 stage, then copies only QA binaries into Node 22 Alpine
build tooling and executes actual raster/native/SVG fixture tests. Native tooling,
Rust and caches stay out of the nginx and release-stager images.

Relevant encoder/renderer versions participate in policy identity. Incidental
CPU, paths and compiler metadata do not. Validation tolerates small platform
score differences only while the independently recomputed threshold still passes;
a relevant version mismatch fails rather than silently rewriting reviewed audit.

Development-tool licenses: [DSSIM AGPL-3.0](https://github.com/kornelski/dssim),
[SSIMULACRA2 CLI BSD-2-Clause](https://github.com/rust-av/ssimulacra2),
[Sharp Apache-2.0](https://github.com/lovell/sharp),
[SVGO MIT](https://github.com/svg/svgo),
[file-type MIT](https://github.com/sindresorhus/file-type).
These tools remain outside application runtime; this stage changes no app or
content licensing declaration.

## Native dependency maintenance (M-001)

The full SSIMULACRA2 lock retains five **unmaintained notices**, not five
security waivers: adler (RUSTSEC-2025-0056), instant (RUSTSEC-2024-0384),
number_prefix (RUSTSEC-2025-0119), paste (RUSTSEC-2024-0436) and ttf-parser
(RUSTSEC-2026-0192). adler, number_prefix and paste occur in the selected
still-image dependency tree; instant and ttf-parser are inactive lock branches.
DSSIM's complete repaired graph has no returned OSV finding in the stage-1 audit.
Anyhow/crossbeam UB and the optional rand security record are fixed, never ignored.

Repository maintainers own M-001, with review due **2027-01-10**. Assess maintained
parent dependencies, removal of unused lock branches or a newer CLI in a separate
cycle using the same metric acceptance fixtures. Only the adjacent SSIMULACRA2
`osv-scanner.toml` lists these five exact IDs, reasons and expiry. It has no package,
version or directory exclusions; it cannot suppress sibling locks. The existing
OSV workflow remains unchanged.

`audit:image-qa` independently queries every package/version in both committed
locks and hydrates all five accepted records. Existing CI runs it explicitly.
Aliases, classification/package drift, security findings, broad configuration,
expiry, malformed/partial responses and network errors fail. This check uses the
current OSV service; offline image/content validation stays independent of it.

## Future frontend boundary

`assetSrcSet` is re-exported beside `assetUrl`, using the pure typed
`assetSrcSetFromManifest` boundary. It returns separate AVIF/WebP/JPEG source
sets, JPEG `srcSet`, largest JPEG fallback and its positive integer dimensions,
or `null` for missing/malformed/unsafe/unbalanced records. URLs are root-relative
local paths. Container `sizes`, `<picture>` activation and delivery/offline policy
belong to later reviewed UI stages; today's components keep their existing paths.
