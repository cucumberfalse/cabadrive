# Content Processing Pipeline

## Goals

Pipeline должен преобразовать официальные материалы в валидированные, структурированные и удобные для web-интерфейса данные.

Исходные материалы могут быть:

- PDF;
- HTML;
- сканы;
- изображения;
- нормативные акты;
- табличные datasets.

## Pipeline Overview

1. Source discovery.
2. Source acquisition.
3. Source registration.
4. OCR при необходимости.
5. Text extraction.
6. Structure extraction.
7. Normalization.
8. Official text validation.
9. Translation.
10. Annotation.
11. Vocabulary extraction.
12. Web-friendly export.
13. CI validation.

## Source Discovery

Искать нужно:

- официальные материалы подготовки к экзамену;
- официальные ПДД;
- официальные билеты, вопросы или примерные тесты;
- официальные регламенты экзамена;
- требования к документам;
- административные процедуры CABA.

Для каждого найденного источника:

- определить владельца сайта;
- определить jurisdiction;
- сохранить URL;
- сохранить дату проверки;
- сохранить оригинальный файл;
- зафиксировать hash;
- зафиксировать hash algorithm;
- проверить, не заменен ли документ более новой версией.

Официальный источник без сохраненного оригинала и hash не допускается в production build.

## Extraction

### PDF

Для текстовых PDF:

- извлечь текст;
- сохранить page references;
- проверить структуру вопросов;
- сверить выборочно с оригиналом.

Для сканированных PDF:

- выполнить OCR;
- сохранить confidence score;
- вручную проверить все вопросы и ответы;
- пометить сомнительные фрагменты как `needs_review`.

### HTML

Для HTML:

- сохранить snapshot;
- извлечь основной контент;
- удалить навигацию и служебные блоки;
- сохранить canonical URL;
- сохранить дату проверки.

### Images

Для изображений:

- выполнить OCR;
- сохранить оригинал;
- вручную сверить весь официальный текст;
- не публиковать без validator approval.

Для изображений, которые используются в fallback practice questions, но не являются official source text, дополнительно хранится learning-support metadata:

- локальный путь и SHA-256 изображения;
- единый структурированный JSON с visible-scene facts, объектами, участниками движения, знаками/разметкой, аннотациями, отношениями и uncertainty notes;
- отдельный per-question usage record с answer-critical visual details и ссылками на варианты ответа;
- deterministic evidence fingerprints для image metadata, question usage и explanation alignment;
- явная uncertainty вместо неподтвержденной детализации, если изображение не прошло ручной визуальный review.

## Normalization

Нормализация допустима только для структуры данных, но не для официального текста.

Разрешено:

- выделять вопрос и варианты ответа в отдельные поля;
- присваивать id;
- добавлять topics;
- добавлять vocabulary references;
- добавлять source references.

Запрещено:

- менять пунктуацию официального вопроса без причины;
- упрощать испанский;
- заменять слова;
- исправлять стиль;
- объединять разные официальные вопросы;
- создавать новые варианты ответов.

## Translation Strategy

Перевод нужен для понимания смысла билета, но не является официальным материалом.

Допустимые варианты:

- machine translation как черновик;
- human-reviewed machine translation;
- human translation для финального варианта.

Требования:

- перевод должен сохранять экзаменационный смысл;
- терминология должна быть консистентной;
- tricky wording и отрицания должны быть сохранены;
- перевод не должен подсказывать ответ сильнее, чем оригинальный вопрос;
- каждый перевод должен иметь disclaimer.
- для текущего question-card слоя перевод должен иметь deterministic alignment evidence; `validate-content` отклоняет отсутствующие, лишние, пустые или устаревшие переводы и варианты ответов.

## Annotation Strategy

Аннотации могут включать:

- объяснение правильного ответа;
- указание ключевых слов;
- предупреждение о формулировке;
- отличие от ПДД РФ;
- ссылку на тему методички;
- ссылку на словарь.

Аннотации не должны выглядеть как официальный текст.

Question-card explanations должны иметь structured correct-answer rationale и wrong-answer rationales для каждого неверного варианта. Для image-backed questions explanations ссылаются на answer-critical details из image metadata; structured visual claims валидируются детерминированно против metadata, чтобы регрессии вроде перепутанной руки/объекта не проходили preflight.

## Vocabulary Extraction

Словарь строится из официальных билетов:

1. Собрать все слова и фразы.
2. Отфильтровать общеязыковые слова.
3. Выделить дорожные, юридические и административные термины.
4. Посчитать частотность.
5. Связать термины с вопросами.
6. Присвоить criticality.
7. Добавить перевод и объяснение.

## Export

Итоговые данные должны экспортироваться в формат, удобный для статического web-приложения:

- JSON для вопросов;
- JSON для словаря;
- JSON для источников;
- JSON config для формата экзамена;
- Markdown или JSON для методички;
- поисковый индекс;
- validation report.

## CI Validation

CI должен выполнять:

- schema validation;
- source reference validation;
- jurisdiction validation;
- disclaimer validation;
- hash validation;
- production content eligibility check;
- diff check для официального текста;
- проверку approval record от `Official Content Validator`;
- проверку совпадения `contentDiffHash` и `sourceHashes` с `content/validation/validator-approvals.json`.
- проверку `content/config/caba-exam-format.json` перед включением exact exam mode;
- применение единого `content/validation/production-eligibility.policy.json`.
- strict coverage для current Russian question/answer translations;
- strict coverage для current Russian explanations, answer rationales и image-aware explanation evidence;
- strict coverage для question-image metadata, question usage mappings, answer-critical details и stale image/question fingerprints.
