# Image Explanation Overlays

This document defines the Cabadrive UI contract for explanation-time image dimming and highlighting. It deliberately does not define image semantics; feature 009 owns image metadata and answer-critical detail identification.

## Current Dependency Status

Feature 009 is merged in `origin/main` as of PR #63 and this feature branch has been synchronized with that baseline. Overlay implementation now consumes only the merged `content/image-metadata/question-images.manifest.json` per-question usage/relevance records and `content/validation/question-image-metadata.evidence.json`.

Local feature 009 worktrees, draft PR branches, and unmerged artifacts remain invalid implementation inputs.

## Rule IDs

### IMG-001 Metadata Owns Meaning

Feature 009 metadata owns scene facts, visible objects, road users, signs, markings, gestures, relationships, uncertainty, answer-critical details, image hashes, question usage mappings, and metadata/usage fingerprints.

Feature 010 overlays own only presentation: geometry, dimming, spotlight, outline, callout, label placement, and rendering rules.

### IMG-002 No Invented Highlights

If approved 009 metadata or usage mapping is missing, stale, or incomplete for a question image, the UI must not show a guessed highlight. The fallback is a normal local image plus truthful explanation text.

### IMG-003 Overlays Are Explanation-Time Support

Image overlays may appear only when explanation support is visible and the current mode allows learning support. They are hidden:

- before answer selection in learning/support attempts;
- during active exam attempts;
- when overlay dependencies fail validation.

### IMG-004 Dim Irrelevant Detail, Preserve Critical Detail

When valid overlay data exists, the visual treatment should reduce irrelevant visual load while keeping answer-critical regions prominent. The treatment can use dimming, spotlight, outline, or callout labels, but it must avoid decorative effects that distract from the explanation.

### IMG-005 Spatial Contiguity

Labels and callouts stay near the image region they explain. Do not force the learner to map a distant legend to the visual cue when an in-image or adjacent callout is feasible.

### IMG-006 Local Offline Rendering

Overlay definitions and assets are local bundled content. Rendering cannot depend on remote image services, live image analysis, or runtime AI.

### IMG-007 Durable Overlay Records

Overlay records are stored near image-support content:

```text
content/image-overlays/question-explanation-overlays.manifest.json
content/validation/question-image-overlays.evidence.json
```

Shards may be added under `content/image-overlays/question-explanation-overlays/` if overlay volume grows. The exact path can change only with a recorded reason in active feature memory.

### IMG-008 Stale Data Fails Validation

Overlay validation must fail when image hashes, question fingerprints, metadata fingerprints, usage fingerprints, referenced question IDs, referenced answer IDs, or referenced 009 detail IDs are missing or stale.

## Overlay Record Contract

An overlay record includes:

- `questionId`;
- `imageId` or local image path;
- image SHA-256;
- question fingerprint;
- 009 metadata and usage fingerprints;
- referenced 009 `relevanceId`s;
- referenced 009 `detailId`s and `regionId`s;
- image-relative geometry in normalized percentages;
- source role copied from the current question's 009 usage record, not authored by the UI;
- provenance, reviewer, status, and stale-data evidence.

## Product Behavior

When a validated overlay exists, explanation reveal in learning and mistake review may render overlays. Active exam attempts remain clean.

When an image-backed question has no approved overlay, the learner-facing app shows the normal local image and a truthful fallback that no checked visual overlay exists for that ticket. It must not claim a highlight exists or infer important/unimportant regions from shared image metadata alone.
