# Официальные источники и валидация

## Обязательное требование

Все материалы, используемые как официальные экзаменационные или нормативные материалы, должны быть в точности взяты из официальных источников.

К таким материалам относятся:

- билеты для тренировки;
- формулировки вопросов;
- варианты ответов;
- правильные ответы;
- правила дорожного движения;
- регламенты экзамена;
- требования к документам;
- требования к транспортному средству;
- административные процедуры;
- штрафы, ограничения и legal limits.

Строго запрещается:

- менять официальные формулировки вопросов;
- перефразировать официальные варианты ответов;
- придумывать несуществующие билеты;
- смешивать официальные вопросы с авторскими без явной маркировки;
- использовать неофициальные источники как источник истины;
- переносить нормы Provincia de Buenos Aires или национальные нормы в CABA без явной юрисдикционной пометки.

Если рядом с официальным материалом добавляется комментарий, перевод, объяснение, подсказка или учебная аннотация, это должно быть явно отделено от оригинала и сопровождаться дисклеймером.

Пример дисклеймера:

> Комментарий является учебным пояснением проекта и не является официальной формулировкой экзаменационного материала.

## Source of Truth

Для каждого материала должен быть указан source record:

- `source_id`;
- название источника;
- официальный URL или путь к сохраненному оригиналу;
- тип источника: PDF, HTML, scan, image, нормативный акт, dataset;
- дата публикации, если указана;
- дата проверки;
- jurisdiction: `CABA`, `Provincia de Buenos Aires`, `Argentina national`, `unknown`;
- статус актуальности: `current`, `outdated`, `unknown`, `superseded`;
- способ проверки актуальности;
- лицензия или условия использования, если указаны;
- hash сохраненного оригинала;
- алгоритм hash, по умолчанию `sha256`.

Hash обязателен для каждого официального источника, который используется в production content. Для HTML-страниц должен сохраняться snapshot и hash snapshot-а. Источник без сохраненного оригинала и hash может использоваться только на этапе discovery и не может попадать в production build.

## Exam Format Source of Truth

Формат экзамена должен иметь отдельный source record и machine-readable config. Нельзя зашивать количество вопросов, таймер, passing score или правила завершения только в UI-коде.

Source of truth для параметров exam mode:

```text
content/config/caba-exam-format.json
```

Минимальные поля:

- `sourceId` - официальный источник регламента экзамена;
- `officialUrl` или `localPath`;
- `sourceHash`;
- `checkedAt`;
- `jurisdiction`: только `CABA` для основной симуляции;
- `questionCount`;
- `timeLimitMinutes`;
- `passingScore`;
- `scoringRule`;
- `canSkipQuestion`;
- `questionOrderRule`;
- `completionRule`;
- `status`: `defined`, `assumed`, `to_verify`;
- `notes`.

Если config имеет статус `to_verify`, содержит незаполненное обязательное поле или источник не прошел hash validation, exam mode должен отображаться как приближенная тренировка, а не как точная симуляция официального экзамена.

CI должен проверять:

- config существует перед включением production exam mode;
- `sourceId` есть в source registry;
- `sourceHash` совпадает с hash сохраненного оригинала;
- все поля формата экзамена заполнены для статуса `defined`;
- `passingScore`, `questionCount` и `timeLimitMinutes` не берутся из hardcoded UI defaults.

## Приоритет источников

1. Официальные сайты правительства CABA.
2. Официальные страницы, документы и нормативные акты, связанные с выдачей водительских прав в CABA.
3. Официальные национальные нормы Аргентины, если они применимы к CABA.
4. Официальные материалы других юрисдикций только как справочный контекст и только с явной пометкой.
5. Неофициальные материалы допустимы только для discovery, но не как source of truth.

## Jurisdiction Policy

Проект ориентируется на экзамен в CABA. Каждый фрагмент контента должен быть привязан к юрисдикции.

Обязательные значения:

- `CABA` - основной целевой материал;
- `Argentina national` - федеральная норма, применимая к CABA;
- `Provincia de Buenos Aires` - не основной материал, нельзя использовать без пометки;
- `unknown` - нельзя публиковать как экзаменационный материал до уточнения.

Если правило отличается между CABA, Provincia de Buenos Aires и национальными нормами, это должно быть явно отражено в методичке и в карточке вопроса.

## Роль Official Content Validator

В процессе разработки вводится специальная роль: `Official Content Validator`.

Ответственность роли:

- проверять, что каждый билет взят из официального источника;
- сверять оригинальный испанский текст вопроса и вариантов ответа с source of truth;
- проверять, что правильный ответ соответствует официальному материалу;
- проверять jurisdiction;
- проверять дату актуальности источника;
- проверять наличие дисклеймеров у переводов, комментариев и объяснений;
- блокировать merge в `main`, если контент не прошел проверку.

Эта роль обязательна перед тестированием релизного кандидата и перед merge в `main`.

## Operational Validation Policy

В одиночном локальном проекте роль `Official Content Validator` все равно должна быть операционализирована, а не оставаться декларацией.

Preferred mode:

- минимум два review-subject: `Content Author` и `Official Content Validator`;
- валидатор не должен аппрувить собственный неподтвержденный diff официального текста;
- каждый approval должен ссылаться на evidence bundle.

Fallback для solo mode допустим только до появления второго reviewer:

- автор выполняет formal self-audit checklist;
- evidence bundle обязателен;
- approval получает пометку `soloSelfAudit: true`;
- approval получает `releaseReadiness: needs_external_review`, пока независимый reviewer не подтвердит official text и источники.

Evidence bundle должен включать:

- Git diff измененных official text fields;
- snapshot или сохраненный оригинал источника;
- hash report;
- список question ids и source ids;
- дату проверки;
- отметку о jurisdiction;
- результат сверки правильных ответов;
- список переводов и объяснений, затронутых изменением.

## Solo Release Exception Flow

По умолчанию solo self-audit не является полноценной release readiness. Он может разблокировать только ограниченный локальный или preview-релиз через явное временное исключение.

Исключение допустимо, если:

- release type ограничен значениями `local_private_mvp` или `research_preview`;
- все затронутые материалы имеют evidence bundle и валидный hash оригиналов;
- approval сохраняет `soloSelfAudit: true` и `releaseReadiness: needs_external_review`;
- в UI, release notes и source attribution есть пометка `self-audited, pending external review`;
- запрещены claims `official full question bank`, `externally validated` и `exact official release readiness`;
- создан follow-up task на внешний review;
- исключение имеет срок действия не больше 30 дней или одного release cycle, что наступит раньше.

Source of truth для исключений:

```text
content/validation/release-exceptions.json
```

Каждый exception record должен содержать:

- `id`;
- `createdAt`;
- `expiresAt`;
- `releaseType`: `local_private_mvp`, `research_preview`;
- `scope`: `source`, `question`, `question_set`;
- список `sourceIds`;
- список `questionIds`, если применимо;
- список `approvalIds`;
- `evidenceBundlePath`;
- `reason`;
- `followUpReviewTask`;
- `allowedClaims`;
- `blockedClaims`;
- `status`: `active`, `expired`, `revoked`, `resolved`.

Release gate должен падать при `soloSelfAudit: true` и `releaseReadiness: needs_external_review`, если нет активного exception record, покрывающего тот же scope и approval ids. Исключение не переводит контент в `content_approved`; оно только разрешает ограниченную сборку с явной маркировкой до внешнего review.

## Машиночитаемый Approval

Approval от `Official Content Validator` должен храниться в репозитории, а не только в тексте PR или устном комментарии.

Source of truth для approval:

```text
content/validation/validator-approvals.json
```

Каждый approval record должен содержать:

- `id`;
- `approvedBy`;
- `approvedAt`;
- `scope`: `source`, `question`, `question_set`, `translation`, `explanation`;
- список `sourceIds`;
- список `questionIds`, если применимо;
- `contentDiffHash`;
- `sourceHashes`;
- `evidenceBundlePath`;
- `reviewMode`: `two_person_review`, `solo_self_audit`, `external_review`;
- `soloSelfAudit`: boolean;
- `releaseReadiness`: `content_approved`, `needs_external_review`;
- `status`: `approved`, `rejected`, `revoked`;
- короткую заметку валидатора.

CI должен считать валидным только approval со статусом `approved`, совпадающим `contentDiffHash`, актуальными `sourceHashes` и существующим `evidenceBundlePath`.

Release gate должен падать, если approval имеет `soloSelfAudit: true` и `releaseReadiness: needs_external_review`, кроме ограниченного случая, описанного в Solo Release Exception Flow.

PR metadata, GitHub labels и комментарии ревью могут использоваться дополнительно, но не являются source of truth. Для защиты ветки рекомендуется также использовать CODEOWNERS на `content/**` и `docs/specify/**`, чтобы изменения контента требовали review от владельца роли.

## CI/CD Gates

В CI/CD должен быть встроен content validation gate.

Минимальные проверки:

- каждый вопрос имеет `source_id`;
- каждый `source_id` существует в реестре источников;
- каждый официальный текст хранится отдельно от перевода и комментариев;
- у каждого вопроса есть jurisdiction;
- у каждого официального материала есть дата проверки;
- у каждого комментария или объяснения есть дисклеймер;
- запрещены вопросы со статусом источника `unknown`, `outdated` или `superseded` в production build;
- hash оригинала совпадает с ожидаемым значением;
- изменения в официальном тексте требуют approval record от `Official Content Validator`;
- `contentDiffHash` измененных официальных текстов совпадает с approval record;
- approval record не `revoked` и не `rejected`.

CI должен падать, если:

- официальный текст изменен без валидного validator approval record;
- вопрос не имеет источника;
- источник неофициальный и помечен как официальный;
- отсутствует дисклеймер у учебного комментария;
- материал другой юрисдикции попал в CABA-подготовку без явной пометки.

## Production Content Eligibility

Production build может включать только материалы, проходящие единый eligibility rule-set.

Разрешенные состояния:

| Content type | Required status | Required jurisdiction | Required approval | Required source |
| --- | --- | --- | --- | --- |
| CABA official question | `validated` | `CABA` | yes | official, `current`, hashed |
| Argentina national rule | `validated` | `Argentina national` | yes | official, `current`, hashed |
| Translation | `human_reviewed_machine` or `human` | inherited from question | yes | linked question/source |
| Explanation | reviewed | inherited from question | yes | at least one related official source |
| Vocabulary term | reviewed | inherited from examples | no, unless it quotes official text | linked official question ids |

Запрещено в production:

- `unknown`, `outdated` или `superseded` sources;
- `unknown` jurisdiction;
- official questions без `approvalId`;
- translations без disclaimer;
- explanations без related official source;
- CABA exam simulation со статусом format config `to_verify`.

Machine-readable policy должна жить рядом с validation scripts:

```text
content/validation/production-eligibility.policy.json
```

CI и локальный validation должны использовать один и тот же policy-файл, чтобы разные scripts не расходились в трактовке production eligibility.

## Pull Request Checklist

Каждый PR, меняющий контент, должен содержать:

- список измененных источников;
- список измененных вопросов;
- ссылку на официальный источник;
- дату проверки;
- jurisdiction;
- результат сверки оригинальных формулировок;
- ссылку на `id` из `content/validation/validator-approvals.json` или причину блокировки.

## Content Immutability Policy

Официальный текст вопроса должен храниться как immutable source text.

Допустимые изменения:

- исправление ошибки OCR после сверки с оригиналом;
- обновление текста при обновлении официального источника;
- добавление нового официального вопроса;
- удаление вопроса, если источник устарел или больше не применим.

Недопустимые изменения:

- улучшение стиля;
- адаптация под русский язык;
- упрощение испанского;
- замена терминов синонимами;
- изменение порядка слов без необходимости;
- добавление авторских вариантов ответа.
