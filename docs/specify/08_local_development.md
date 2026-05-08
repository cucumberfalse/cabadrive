# Local Development Contract

## Requirement

Проект должен запускаться локально в Docker и не должен требовать установки каких-либо пакетов, runtime или software на локальное окружение пользователя, кроме самого Docker.

Запрещено требовать от пользователя локальной установки:

- Node.js;
- npm, pnpm или yarn;
- Python;
- OCR tooling;
- Playwright browser dependencies;
- static server packages;
- build tools;
- любых других проектных зависимостей.

Все, что требуется для сборки, запуска, тестирования, обработки контента и валидации, должно устанавливаться внутри Docker image или выполняться внутри Docker container.

## Root Makefile

В корне проекта должен лежать `Makefile`.

Минимальные обязательные команды:

```make
make build
make up
make down
```

### make build

Должен собрать или пересобрать Docker image.

Требования:

- работает в чистом окружении, где установлен только Docker;
- устанавливает зависимости внутри image;
- не пишет зависимости в host environment;
- завершает build с ошибкой, если зависимости или content validation не проходят.

### make up

Должен запустить Docker container или docker compose stack.

Требования:

- после выполнения приложение доступно из браузера;
- URL и порт должны быть задокументированы;
- backend не требуется;
- web-приложение должно отдавать статический build или dev server из container;
- пользователь не должен запускать дополнительные команды.

### make down

Должен остановить запущенный container или docker compose stack.

Требования:

- освобождает занятый порт;
- не удаляет пользовательские данные без явного отдельного destructive command;
- безопасен для повторного запуска.

## Validation Profiles

Выполнение Docker-only требования должно валидироваться по профилю изменения. Полный flow обязателен для изменений, которые могут повлиять на:

- приложение;
- content pipeline;
- build scripts;
- dependencies;
- Dockerfile;
- docker compose config;
- Makefile;
- CI/CD;
- статические assets;
- content validation.

### Full Docker Validation

Полный validation flow:

```bash
make down
make build
make up
# открыть приложение в браузере и выполнить smoke test
make down
```

Smoke test должен подтверждать:

- приложение открывается в браузере;
- стартовый экран доступен;
- встроенные данные загружаются;
- нет runtime errors;
- Docker container стартовал без локальной установки пакетов.

### Change Type Matrix

| Change type | Examples | Required checks |
| --- | --- | --- |
| Docs-only, no contract changes | wording, README links, non-normative notes | markdown/link review; no Docker flow required |
| Docs affecting build/run/content policy | Makefile contract, Docker requirement, validation policy, data schema | full Docker validation or CI job that runs it |
| Content-only | questions, translations, vocabulary, guide | content validation, schema validation, eligibility policy; full Docker validation before merge |
| App code | `src/**`, UI, storage, search, scoring | unit tests, relevant e2e/smoke tests, full Docker validation |
| Content pipeline | ingest/export/validation scripts, OCR flow | pipeline tests, content validation, full Docker validation |
| Infrastructure | Dockerfile, docker compose, Makefile, CI/CD, package config | full Docker validation in clean environment |
| Static assets | PWA assets, icons, bundled data, search index | asset availability smoke test, full Docker validation before merge |

Если изменение попадает в несколько категорий, применяется самый строгий профиль.

## CI/CD Requirement

CI/CD должен запускать Docker validation в чистом окружении.

Минимальный CI contract:

- checkout repository;
- run `make build`;
- run `make up`;
- run smoke test against local URL;
- run `make down`;
- fail pipeline on any error.

Эта проверка должна быть обязательной перед merge в `main`.

## Developer Experience

Разработчик должен иметь возможность начать работу так:

```bash
make build
make up
```

После этого приложение должно быть доступно в браузере без дополнительных инструкций по установке зависимостей.
