# Structured Implementation Plan

## 1. Research Scope

На этапе specify нужно исследовать официальные материалы, применимые к теоретическому экзамену на водительские права в CABA.

Исследование должно покрыть:

- официальные материалы подготовки;
- официальные правила дорожного движения;
- официальные билеты, вопросы или примерные тесты;
- официальный регламент экзамена;
- требования к документам;
- правила допуска к экзамену;
- применимость национальных норм Аргентины к CABA.

Результат исследования:

- source registry;
- jurisdiction matrix;
- список материалов, доступных официально;
- список отсутствующих материалов;
- legal/compliance notes;
- дата проверки каждого источника.

## 2. Source and Content Governance

Официальный испанский контент является source of truth.

Все билеты, правила и регламенты должны быть взяты из официальных источников без изменения формулировок. Переводы, объяснения и учебные комментарии разрешены только как отдельный слой с явным дисклеймером.

Перед merge в `main` и перед релизным тестированием контент должен пройти проверку роли `Official Content Validator`. Эта проверка должна быть встроена в CI/CD как обязательный gate и иметь машиночитаемый approval record в репозитории.

Approval должен ссылаться на evidence bundle: diff официального текста, сохраненный source snapshot, hash report, affected question ids, дату проверки и jurisdiction check. В solo mode допускается formal self-audit с `releaseReadiness: needs_external_review`; ограниченный локальный или preview-релиз возможен только через временный Solo Release Exception Flow с явной маркировкой pending external review.

Подробности: [01_sources_and_validation.md](./01_sources_and_validation.md).

## 3. Product Architecture

Итоговый продукт - локальный web trainer:

- static SPA/PWA;
- без backend;
- работает offline после первоначальной сборки;
- содержит встроенные материалы;
- хранит прогресс локально;
- поддерживает обновление базы вопросов через новый build;
- запускается локально через Docker без установки Node.js, package managers или другого tooling на хост;
- управляется из корневого `Makefile`.

Основные модули:

- trainer;
- exam simulation;
- vocabulary;
- condensed guide;
- progress and mistakes;
- search;
- source attribution;
- content validation.

Подробности: [07_technical_architecture.md](./07_technical_architecture.md).

## 3.1 Local Development Contract

Локальное окружение пользователя должно требовать только Docker.

Обязательные команды в корневом `Makefile`:

- `make build` - собрать или пересобрать Docker image;
- `make up` - запустить Docker container так, чтобы приложение стало доступно из браузера;
- `make down` - остановить Docker container.

Для каждого изменения должен выбираться validation profile, который подтверждает, что проект по-прежнему соблюдает Docker-only contract. Установка зависимостей на хост запрещена.

Тип проверки зависит от change type matrix: docs-only изменения без contract impact не требуют полного Docker flow, а app-code, content, pipeline и infra changes требуют полного `make down/build/up/down` или эквивалентного CI job.

Подробности: [08_local_development.md](./08_local_development.md).

## 4. Data Model

Данные должны быть структурированы вокруг сущностей:

- `Source`;
- `Question`;
- `Answer`;
- `Translation`;
- `Explanation`;
- `VocabularyTerm`;
- `RuleDifference`;
- `Topic`;
- `ExamSession`;
- `UserQuestionAnswer`;
- `ContentValidation`;
- `OfficialContentApproval`.
- `ExamFormatConfig`;
- `ProductionContentEligibility`.

Ключевой принцип: официальный текст, перевод и комментарий не смешиваются в одном поле.

Подробности: [04_data_model.md](./04_data_model.md).

## 5. Content Processing Pipeline

Pipeline обработки материалов:

1. Найти официальный источник.
2. Сохранить оригинал.
3. Зарегистрировать источник.
4. Извлечь текст или выполнить OCR.
5. Выделить структуру вопросов.
6. Нормализовать данные без изменения официального текста.
7. Валидировать официальный текст.
8. Подготовить перевод.
9. Добавить учебные объяснения и дисклеймеры.
10. Извлечь словарь.
11. Сгенерировать web-friendly данные.
12. Запустить CI validation.

Подробности: [05_content_pipeline.md](./05_content_pipeline.md).

## 6. Translation Strategy

Перевод нужен только как учебный слой. Он должен помогать понять экзаменационный смысл, но не подменять официальный вопрос.

Требования:

- human review для финальных переводов;
- единый glossary;
- сохранение отрицаний и tricky wording;
- отдельное хранение от оригинала;
- обязательный дисклеймер.

## 7. Learning Strategy

Обучение должно минимизировать cognitive load.

Фокус:

- отличия от ПДД РФ;
- бюрократические и теоретические темы, которые встречаются в билетах;
- частотная экзаменационная лексика;
- типовые конструкции вопросов;
- повторение ошибок;
- weak-topic practice.

Не нужно учить пользователя всему испанскому или всему аргентинскому ПДД.

Подробности: [03_content_strategy.md](./03_content_strategy.md).

## 8. UX Plan

Основные flow:

- onboarding;
- режим обучения;
- режим экзамена;
- повтор ошибок;
- словарь;
- condensed guide;
- поиск и фильтры.

Испанский оригинал должен быть виден как основной текст. Русский перевод, объяснения и комментарии должны быть доступны рядом, но визуально отделены от официального материала.

Подробности: [06_ux_flows.md](./06_ux_flows.md).

## 9. MVP Definition

MVP включает:

- source registry;
- `content/config/caba-exam-format.json` со статусом `defined` или явной пометкой approximate exam mode;
- валидированную официальную базу вопросов или официальный sample set с явной пометкой неполного покрытия;
- learning mode;
- exam mode;
- показ перевода;
- объяснение правильного ответа;
- словарь ключевых терминов;
- раздел отличий от ПДД РФ;
- локальное хранение прогресса;
- mistake tracking;
- CI content validation gate;
- Docker-only local run;
- корневой `Makefile` с `make build`, `make up`, `make down`;
- проверку Docker contract после изменений;
- release checklist с measurement protocol для MVP readiness targets.

## 10. Roadmap

Фазы реализации:

1. Research & source validation.
2. Content ingestion.
3. Translation & annotation.
4. Vocabulary extraction.
5. Trainer implementation.
6. Testing & validation.

Подробности: [09_implementation_roadmap.md](./09_implementation_roadmap.md).

## 11. Risk Analysis

Ключевые риски:

- официальные билеты недоступны;
- смешение юрисдикций;
- устаревание материалов;
- OCR ошибки;
- неверный перевод;
- copyright и условия использования.

Подробности: [10_risks_open_questions.md](./10_risks_open_questions.md).

## 12. Open Questions

Главные вопросы для закрытия на этапе research:

- публикует ли CABA полную официальную базу вопросов;
- какой текущий формат экзамена и какой официальный source record подтверждает параметры exam mode;
- какие материалы можно распространять;
- какие источники являются актуальными source of truth;
- какие национальные нормы применяются к CABA;
- как часто нужно обновлять source registry.
