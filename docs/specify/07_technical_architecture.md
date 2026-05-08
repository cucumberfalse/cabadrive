# Technical Architecture

## Architecture Summary

Итоговая система - static local-first web application.

Основные свойства:

- SPA или PWA;
- без backend;
- без обязательного интернета после build;
- все материалы встроены в build artifact;
- пользовательский прогресс хранится локально;
- контент обновляется через новую сборку;
- локальный запуск выполняется только через Docker;
- локальный хост пользователя не требует установки пакетов, runtime или tooling кроме Docker.

## Proposed Stack

MVP stack:

- TypeScript;
- Vite;
- React;
- статические JSON/Markdown assets;
- IndexedDB для прогресса и статистики;
- localStorage только для простых настроек;
- Fuse.js или MiniSearch для локального поиска;
- Workbox или нативный service worker для PWA;
- Vitest для unit tests;
- Playwright для e2e и visual smoke tests;
- Zod или JSON Schema для content validation.

Все элементы stack должны устанавливаться и запускаться внутри Docker. Локальная установка Node.js, package manager, Python, OCR tools или browser test dependencies не должна требоваться.

Svelte может рассматриваться как post-MVP альтернатива только через отдельное архитектурное решение. Для MVP delivery stack фиксируется как React, чтобы build, тесты и Docker contract были воспроизводимыми.

Критерии выбора:

- простой локальный запуск;
- минимальные зависимости;
- хорошая поддержка static build;
- удобная работа с JSON контентом;
- возможность offline-first.

## Project Structure Proposal

```text
cabadrive/
  Makefile
  Dockerfile
  docker-compose.yml
  content/
    sources/
    questions/
    translations/
    explanations/
    vocabulary/
    guide/
    validation/
  docs/
    specify/
  scripts/
    ingest/
    validate/
    export/
  src/
    app/
    components/
    features/
      trainer/
      exam/
      vocabulary/
      guide/
      progress/
    data/
    search/
    storage/
  tests/
    unit/
    e2e/
```

## Makefile Contract

В корне проекта должен лежать `Makefile` со следующими обязательными командами:

```make
make build
make up
make down
```

Команды:

- `make build` - собирает или пересобирает Docker image;
- `make up` - запускает Docker container и делает web-приложение доступным в браузере;
- `make down` - останавливает Docker container и освобождает порт.

После `make up` пользователь должен получить локальный URL, например `http://localhost:5173` или другой явно зафиксированный порт.

Все дополнительные команды допустимы, но не заменяют обязательный contract.

## Docker Validation Requirement

После каждого изменения в коде, контенте, конфигурации или документации, влияющей на build/run flow, должна выполняться проверка Docker-only запуска по матрице из [08_local_development.md](./08_local_development.md).

Полная проверка:

```text
make down
make build
make up
browser smoke test
make down
```

Критерии прохождения:

- build завершается успешно;
- container стартует без ручной установки зависимостей на хост;
- приложение открывается в браузере;
- статические данные доступны;
- offline/local-first режим не нарушен;
- команда `make down` корректно останавливает окружение.

CI должен иметь job, который повторяет этот flow в чистом окружении с Docker.

## Offline Strategy

Offline-first требования:

- приложение открывается без сети;
- вопросы, словарь и методичка включены в build;
- service worker кеширует shell и assets;
- прогресс сохраняется в IndexedDB;
- отсутствие сети не ломает trainer;
- build может быть запущен локально как статический сайт.

## Search and Indexing

Поисковый индекс генерируется на build step.

Индексировать:

- официальный испанский текст;
- русский перевод;
- темы;
- термины;
- source titles;
- explanations.

Официальный текст и неофициальные поля должны оставаться различимыми в результатах поиска.

## Data Validation

Validation layers:

- schema validation;
- referential integrity;
- source validation;
- jurisdiction validation;
- disclaimer validation;
- production eligibility validation;
- official text diff validation;
- validator approval validation через `content/validation/validator-approvals.json`.

Production build должен падать при content validation errors.

## Testing Strategy

Unit tests:

- scoring;
- randomization;
- filtering;
- search;
- progress tracking;
- schema parsing.

Content tests:

- каждый вопрос имеет источник;
- правильный ответ существует;
- все ids уникальны;
- все переводы имеют disclaimer;
- нет `unknown` jurisdiction в production CABA set.

E2E tests:

- learning flow;
- exam flow;
- show translation;
- mistake tracking;
- offline reload;
- mobile viewport smoke test.

Infrastructure tests:

- `make build` succeeds in a clean environment;
- `make up` starts the browser-accessible app;
- no host-level package installation is required;
- `make down` stops the stack;
- Docker validation runs after relevant changes.

## Deployment Model

Варианты:

- локальный static build;
- GitHub Pages или аналог только как способ раздачи build;
- архив с готовым `dist/`;
- PWA installable app.

Даже при web hosting приложение должно оставаться полностью работоспособным offline после загрузки.

## Future Extensibility

Архитектура должна поддерживать:

- обновление базы вопросов;
- импорт/экспорт прогресса;
- spaced repetition;
- дополнительные юрисдикции;
- альтернативные языки перевода;
- новые наборы официальных источников;
- расширение словаря.
