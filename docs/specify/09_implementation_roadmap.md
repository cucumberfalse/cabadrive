# Implementation Roadmap

## Phase 1: Research & Source Validation

Цель: найти и зафиксировать официальные источники.

Deliverables:

- source discovery report;
- реестр источников;
- сохраненные оригиналы и `sha256` hash для production sources;
- jurisdiction matrix;
- legal/compliance notes;
- список доступных официальных билетов;
- список отсутствующих или неполных материалов;
- выбранный content availability mode: `official_full_bank` или `official_sample_set`;
- официальный source record для формата экзамена или явный `to_verify` status;
- validation checklist.

Exit criteria:

- основные CABA sources найдены или явно указано, что они отсутствуют;
- если полная официальная база недоступна, определен официальный sample set и обязательная non-full-bank маркировка;
- каждый источник имеет дату проверки;
- определен порядок обновления источников;
- назначена роль `Official Content Validator`.
- параметры exam mode подтверждены официальным источником или exact simulation исключена из MVP.

## Phase 2: Content Ingestion

Цель: получить структурированные данные из официальных материалов.

Deliverables:

- сохраненные оригиналы;
- extraction scripts;
- OCR workflow, если нужен;
- черновой JSON вопросов;
- content mode metadata для `official_full_bank` или `official_sample_set`;
- черновой `content/config/caba-exam-format.json`;
- validation report;
- список фрагментов `needs_review`;
- черновой `content/validation/validator-approvals.json` для валидированных партий.

Exit criteria:

- все вопросы имеют source references;
- sample set не смешивается с author-created questions и не маркируется как full official bank;
- структура вопросов извлечена;
- OCR ошибки отмечены;
- контент не попадает в production без валидации.
- exact exam mode не включается без defined exam format config.

## Phase 3: Translation & Annotation

Цель: подготовить русские переводы и учебные объяснения.

Deliverables:

- переводы вопросов и ответов;
- glossary terminology map;
- объяснения правильных ответов;
- комментарии по сложным формулировкам;
- дисклеймеры для неофициального контента.

Exit criteria:

- переводы reviewed;
- терминология консистентна;
- объяснения отделены от официального текста;
- CI проверяет наличие дисклеймеров;
- валидированные переводы вопросов и ответов связаны с исходными вопросами.

## Phase 4: Vocabulary Extraction

Цель: создать минимальный exam-oriented vocabulary pack.

Deliverables:

- словарь терминов;
- категории терминов;
- частотный список;
- critical vocabulary threshold;
- связи терминов с вопросами.

Exit criteria:

- словарь построен из официальных билетов;
- каждый критичный термин связан с примерами;
- термины доступны для поиска и повторения.

## Phase 5: Trainer Implementation

Цель: реализовать локальный web trainer.

Deliverables:

- Dockerfile;
- docker compose config, если нужен;
- корневой `Makefile` с `make build`, `make up`, `make down`;
- React/Vite MVP app shell;
- learning mode;
- exam mode;
- bilingual display;
- local progress storage;
- mistake tracking;
- search and filters;
- guide and vocabulary screens;
- offline build.

Exit criteria:

- приложение работает без backend;
- приложение работает offline;
- приложение запускается локально через Docker;
- локальный запуск не требует установки пакетов на хост, кроме Docker;
- `make build`, `make up`, `make down` работают;
- пользователь может пройти тренировочный экзамен;
- ошибки сохраняются локально.

## Phase 6: Testing & Validation

Цель: проверить продукт, контент и release readiness.

Deliverables:

- unit tests;
- content validation tests;
- e2e tests;
- Docker-only run validation;
- offline smoke test;
- mobile smoke test;
- validator approval report.

Exit criteria:

- CI проходит;
- CI валидирует `make build`, `make up`, browser smoke test и `make down`;
- official content validation gate проходит;
- `Official Content Validator` одобрил контент;
- approval records валидны и совпадают с измененными official text diffs;
- production eligibility policy применяется к источникам, вопросам, переводам и объяснениям;
- exact exam mode имеет validated `caba-exam-format.json` или UI помечает режим как approximate;
- production build не содержит неподтвержденных материалов;
- solo self-audit не проходит release gate без активного ограниченного exception record;
- MVP readiness targets измерены по Measurement Protocol из `02_product_requirements.md`;
- готов release candidate.

## Suggested Milestones

1. `M0 Specify complete` - документация и implementation plan готовы.
2. `M1 Sources locked` - официальный source registry готов.
3. `M2 First validated question set` - первая партия вопросов прошла валидацию.
4. `M3 Trainer MVP` - можно тренироваться локально.
5. `M4 Offline exam simulation` - доступен экзаменационный режим.
6. `M5 Release candidate` - CI, validation и UX smoke tests пройдены.
