# Cabadrive Design System

This document defines the durable visual and interaction system introduced by feature `026-design-ux-modernization`.

## Principles

- The app opens directly into the trainer. There is no marketing hero or decorative landing page.
- Official Spanish ticket text remains primary. Russian copy is learning support and must be visibly close to the Spanish it explains.
- Active exam attempts stay clean: no translations, explanations, overlays, generated learning images, or other support scaffolding.
- All runtime assets are local. Remote fonts, remote images, live AI, analytics, backend calls, and PDF viewers are outside this system.
- The interface is study-dense, readable, and calm. Status labels stay visible without turning every card into a disclaimer.

## Palette

Core colors:

- Ink: `#17211f`
- Muted text: `#56655f`
- App background: `#eef3f1`
- Surface: `#fffefa`
- Strong surface: `#ffffff`
- Border: `#cfd8d3`
- Primary accent: `#176b57`
- Accent surface: `#e2f4ec`
- Source/translation blue: `#315f9a`
- Warning amber: `#a06916`
- Error red: `#b8473f`

Colors are semantic. Green accents indicate progression, active controls, and correct states; blue indicates language/source support; amber indicates status or caution; red indicates incorrect or blocking states. Do not make the page read as a single-hue theme.

## Typography

- Use system/local fonts only: `Inter`, `Segoe UI`, `Noto Sans`, and platform sans-serif fallbacks.
- Do not fetch Google Fonts or other remote font files at runtime.
- Use normal letter spacing. Do not use negative tracking.
- Do not scale font size with viewport width.
- Spanish chunks use `lang="es"` where feasible. Russian support uses `lang="ru"` where feasible.
- Long Spanish and Russian strings must wrap with `overflow-wrap` or responsive layout constraints instead of overflowing.

## Geometry And Spacing

- Cards, panels, controls, images, and dialogs use `8px` radius or less.
- Repeated cards use bordered surfaces; page sections remain unframed or use full-width app bands.
- Controls have at least `42px` height where practical for touch.
- Focus rings use the primary accent with an offset so keyboard position is visible.
- Avoid nested decorative cards. Cards are for repeated items, framed tools, and ticket/material blocks.

## App Shell

- Header: compact product identity and reset icon button.
- Status strip: current content mode, ticket count, review count, and latest exam status.
- Primary navigation: stable top-level modes: `Учить`, `Экзамен`, `Ошибки`, `Словарь`, `Материалы`, `Источники`, `Процесс`, `CABA/RF`.
- Main workspace: dense trainer-first layout with responsive stacking under mobile widths.

## Question Cards And Timers

- Metadata appears first: ticket ID, category, jurisdiction, topics, difficulty when support mode allows it.
- Spanish official text appears before Russian support.
- The Spanish question block is the reveal target in learning and mistakes, with accessible expanded/collapsed state.
- Ticket images remain canonical local question images and are never replaced by generated learning images.
- Learning timer is a compact status rail with pause/resume; active exam uses only the exam-wide timer.
- Answer buttons show Spanish first and Russian translations only when support is revealed.

## Bilingual Materials

Passive support surfaces may show Russian support by default. `Материалы` uses two patterns:

- material unit: a local learning image plus Russian paragraph text;
- language pair: a keyboard/touch accessible `details` control with Spanish term in `lang="es"` and Russian translation in `lang="ru"`.

Canonical Spanish ticket text in materials still joins from the question bank by `questionId`; it is not duplicated as material prose.

## Generated Learning Images

Style version: `cabadrive-learning-image-v1`.

Generated learning images are deterministic local SVG illustrations:

- stored under `content/assets/learning/generated/v1/`;
- referenced through `content/learning-images/learning-images.manifest.json`;
- validated by `scripts/content-learning-images.mjs`;
- included in normal public asset sync and offline build output;
- original Cabadrive learning-support assets, not official source evidence.

Visual rules:

- 4:3 concept-card aspect by default;
- simple road-safety diagrams with muted surfaces, one primary accent, one warning accent, and no decorative clutter;
- no official logos, personal data, or copied ticket-image pixels;
- no readable text inside the SVG unless the same text is also present as real HTML text;
- alt text explains the learning concept in Russian;
- shared topic images are allowed only when each content unit has an explicit coverage record.

## Validation

Feature 026 adds:

- `pnpm run validate:learning-images`
- integration into `pnpm run validate:content`

The validator computes coverage units from current JSON and rejects missing coverage, stale fingerprints, remote paths, question-image replacement paths, hash mismatches, missing alt text, missing provenance, unapproved coverage, and stale evidence.
