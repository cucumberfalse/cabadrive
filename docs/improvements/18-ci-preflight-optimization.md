# ТЗ-18: Оптимизация CI и preflight — устранение повторных прогонов

| Поле | Значение |
|---|---|
| Приоритет | P2 |
| Категория | DX / CI |
| Оценка трудоёмкости | M |
| Статус | Предложено |
| Дата | 2026-07-11 |

## 1. Контекст и проблема

Структура прогонов содержит прямые дубли (проверено по package.json и ci.yml):

- **Двойной полный build**: baseline-checks выполняет шаг build, затем `test:e2e` = `pnpm run build && playwright test` — второй полный build (package.json:31: `"test:e2e": "pnpm run build && playwright test"`; preflight:33 вызывает и `build`, и `test:e2e`).
- **Тройной validate:content** по 316 МБ контента: напрямую в preflight, внутри build (package.json:28), снова внутри build из test:e2e. Замер: validate-content.mjs ≈ 5,7 с (доминирует sha256 77 МБ PDF), полная цепочка validate:content — 10–20 с, ×3.
- **Playwright без retries**: ~102 выполнения (51 тест × 2 проекта) последовательно; любой флейк валит обязательный чек; `trace: "on-first-retry"` при retries=0 никогда не пишется — отладка флейков в CI слепая (playwright.config.ts).
- E2e только chromium-движок (Desktop Chrome + эмуляция Pixel 7) — регрессии Safari/Firefox (особенно SW/оффлайн) не ловятся.
- Обязательный гейт AI Review ждёт внешнего бота до 20 мин (таймаут 30) — вне скоупа этого ТЗ, фиксируется как известное ограничение процесса.

## 2. Цели

Preflight и baseline-checks выполняют каждый дорогой шаг один раз; e2e устойчивы к флейкам и диагностируемы; кросс-браузерное покрытие оффлайн-критики.

## 3. Требования

- FR-1: `test:e2e` не пересобирает: новый скрипт `test:e2e:only` = `playwright test`; связка build→e2e выражается последовательностью в preflight/CI, а не вложенным build. Guard: playwright.config.ts проверяет наличие dist/ и падает с понятным сообщением.
- FR-2: validate:content выполняется один раз за прогон: из build выносится в явный шаг (`build:raw` без валидации + `build` = validate + build:raw для локального удобства; CI/preflight используют явную последовательность validate → build:raw → test → e2e).
- FR-3: Playwright: `retries: process.env.CI ? 2 : 0`, `trace: "on-first-retry"` начинает работать; репортёр junit/html-артефакт в CI.
- FR-4: Проект `webkit` (десктоп) добавляется для смоук-подмножества (тег @smoke: learn-поток, оффлайн-перезагрузка, SW-установка) — полный набор на webkit не гоняем (время).
- FR-5: Кеширование в CI: pnpm store (actions/setup-node cache) и браузеры Playwright (actions/cache по версии) — проверить текущее состояние ci.yml и добить недостающее.
- NFR-1: Суммарное время baseline-checks сокращается ≥ 30 % (замер до/после в PR).

## 4. План

- [ ] 1. FR-1 + FR-2 (перекомпоновка скриптов; синхронно обновить tests/ai-review-workflow и docker-тесты, если матчат имена скриптов)
- [ ] 2. FR-3 (retries/trace/reporter)
- [ ] 3. FR-5 (кеши CI)
- [ ] 4. FR-4 (webkit-смоук)

## 5. Критерии приёмки

- AC-1: В логе полного preflight `vite build` встречается один раз, validate-content.mjs — один раз.
- AC-2: Упавший и прошедший на retry тест даёт trace-артефакт в CI.
- AC-3: Время baseline-checks: до/после в описании PR, ≥ 30 % экономии.
- AC-4: webkit-смоук зелёный и обязателен.

## 6. Риски и меры

| Риск | Вероятн. | Влияние | Мера |
|---|---|---|---|
| Скрипты завязаны тестами на точные имена | Высокая | Красный CI | Инвентаризация grep по tests/ до правок |
| retries маскируют реальные флейки | Средняя | Скрытые дефекты | Еженедельный разбор junit-отчёта на повторяющиеся retry |
| webkit в CI нестабилен | Средняя | Флейки | Только смоук-набор; отдельный job, не блокирующий первое время |

## 7. Затрагиваемые файлы

`package.json` (scripts), `playwright.config.ts`, `.github/workflows/ci.yml`, точечные правки tests/*.

## 8. Связанные ТЗ

[ТЗ-16](./16-quality-tooling.md) (порядок дешёвых гейтов), [ТЗ-21](./21-content-scripts-refactoring.md) (ускорение самих валидаторов)
