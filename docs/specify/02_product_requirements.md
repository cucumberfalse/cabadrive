# Product Requirements

## Vision

Локальная web-платформа должна помочь опытному русскоязычному водителю быстро подготовиться к теоретическому экзамену в CABA, не проходя полноценный курс испанского языка и не изучая все ПДД Аргентины как с нуля.

## Пользовательские цели

- Понять, какие правила и экзаменационные темы отличаются от привычных ПДД РФ.
- Выучить минимальный испанский словарь, достаточный для понимания билетов.
- Тренироваться на официальных билетах.
- Видеть перевод и учебные пояснения без изменения официального текста.
- Находить слабые темы и повторять их.
- Работать offline после сборки проекта.

## Scope

Входит в scope:

- condensed guide для опытного водителя из РФ;
- exam-oriented vocabulary pack;
- тренажер официальных билетов;
- режим обучения;
- режим экзамена;
- статистика ошибок;
- поиск и фильтрация;
- bilingual display;
- local-first хранение прогресса;
- pipeline обновления базы вопросов.

Не входит в scope:

- полноценный курс испанского;
- обучение вождению;
- автошкола;
- пересказ всего ПДД;
- подготовка к практическому экзамену;
- серверная часть;
- user accounts;
- cloud sync.

## MVP

MVP должен включать:

- реестр официальных источников;
- импорт первой валидированной официальной базы вопросов или валидированного официального sample set, если полная база недоступна;
- отображение вопроса на испанском;
- показ русского перевода;
- показ правильного ответа в режиме обучения;
- простой экзаменационный режим;
- базовая статистика ошибок;
- словарь ключевых терминов;
- раздел отличий от ПДД РФ;
- CI content validation gate.

## MVP Content Availability Modes

MVP может быть готов в одном из двух content modes:

| Mode | Условие | UI / release label |
| --- | --- | --- |
| `official_full_bank` | Полная официальная база CABA найдена, сохранена, захеширована и прошла validation | `official full question bank` |
| `official_sample_set` | Полная база не опубликована или недоступна, но есть официальные примерные вопросы или другой официальный ограниченный набор | `official sample set, not a full question bank` |

Если доступен только `official_sample_set`, MVP все равно считается достижимым при соблюдении source registry, hash validation, approval records и явной маркировки неполного покрытия. Нельзя дополнять sample set авторскими вопросами под видом официальной базы.

## Non-Functional Requirements

- Полная работа без сервера.
- Полная работа offline после build.
- Быстрый старт локально.
- Локальный запуск должен требовать только установленный Docker.
- Нельзя требовать установки Node.js, npm, pnpm, yarn, Python, OCR tooling или других пакетов на локальный хост.
- Все зависимости и инструменты сборки должны устанавливаться внутри Docker image или container.
- Docker-only flow должен валидироваться по change type matrix из [08_local_development.md](./08_local_development.md).
- В корне проекта должен лежать `Makefile` с минимальными командами `make build`, `make up`, `make down`.
- После `make up` приложение должно быть доступно из браузера по явно указанному local URL.
- Минимальное количество зависимостей.
- Данные должны быть пригодны для ревью в Git.
- Официальный текст должен храниться отдельно от переводов и комментариев.
- Контент должен быть версионирован.
- Интерфейс должен быть удобен на desktop и mobile.
- Структура должна поддерживать обновление базы вопросов.

## Success Metrics

Продукт успешен, если пользователь:

- понимает большинство формулировок билетов без внешнего переводчика;
- распознает типовые конструкции вопросов;
- знает high-priority локальные отличия;
- уверенно проходит тренировочные экзамены;
- видит повторяющиеся ошибки и закрывает слабые темы;
- может готовиться без постоянного доступа к интернету.

## MVP Readiness Targets

Минимальные измеримые критерии готовности MVP:

| Metric | Target |
| --- | --- |
| Official source coverage | 100% production questions linked to current, hashed official sources; if full bank is unavailable, MVP may ship as `official_sample_set` with non-full-bank label |
| Content validation | 0 production questions without valid `approvalId` and eligibility pass |
| Exam format confidence | exact exam mode only when `caba-exam-format.json.status = defined`; otherwise approximate mode label is mandatory |
| Training exam score trend | user can complete 3 consecutive practice exams and see score trend |
| Repeat-error reduction | repeated wrong answers on the same question decrease by at least 30% across a local study session |
| Search latency | local search returns results under 200 ms for MVP dataset on a typical laptop |
| Cold start | app becomes usable within 3 seconds after local page load from Docker-served build |
| Offline behavior | reload works without network after initial build and app load |

## Measurement Protocol

MVP readiness measurements must be reproducible and recorded in the release checklist.

Baseline test conditions:

- dataset: current MVP production dataset, with content mode `official_full_bank` or `official_sample_set` recorded;
- device class: typical laptop, defined for CI as the default GitHub Actions runner or project-local Docker host used for release validation;
- browser: current stable Chromium in e2e tests;
- build: Docker-served production build, not dev server;
- runs: minimum 5 runs for latency and cold start, with median and worst run recorded;
- pass/fail: median must meet the target, and worst run must not exceed the target by more than 25%;
- artifacts: test command, dataset size, build hash, browser version and measurement output stored with release evidence.

Metric-specific rules:

| Metric | Measurement method | Pass/fail |
| --- | --- | --- |
| Search latency | E2E test issues fixed representative queries across Spanish terms, Russian translations and topic filters | median response time under 200 ms for MVP dataset |
| Cold start | Browser performance timing from navigation start to first usable trainer interaction in Docker-served production build | median under 3 seconds |
| Repeat-error reduction | Seeded local study session with at least 20 answered questions and repeated review attempts for missed questions | repeated wrong answers on the same questions decrease by at least 30% from first to final attempt group |
| Offline behavior | Build, load once, disable network in browser context, reload and complete one learning interaction | no network dependency failure |
| Training exam score trend | Complete 3 practice exams in e2e or scripted manual release run | score history is visible and persists locally |
