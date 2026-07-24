# Spec: Корректность fetch-обработчика service worker + unit-тесты текста SW (ТЗ-13, шаг 1)

## Cycle Context

- Feature ID: `048-service-worker-fetch-correctness` / ТЗ-13 шаг 1 (FR-4 + FR-7 ONLY).
- Base: verified `origin/main` = `9de3d419772cb9b971cc01299fa4f251b86c08a9` (merge PR #212, слайс 2 ТЗ-P1). Worktree HEAD подтверждён равным base; дерево чистое до записи `specs/048-*`.
- Branch/worktree: `claude/048-service-worker-fetch-correctness` / `/Users/chap/devel/cabadrive-claude/repo/.claude/worktrees/048-service-worker-fetch-correctness`.
- Intake: `specs/048-service-worker-fetch-correctness/feature-request.md` (Analyst-owned; не изменяется вне Analyst-owned секций).

## Goal

Сгенерированный service worker перестаёт отдавать некорректные ответы при оффлайне. Навигации получают закешированный app shell с матчингом, игнорирующим query-строку; упавшие субресурсы (картинки, JS-чанки, стили, шрифты) получают явную сетевую ошибку `Response.error()`, а не HTML-документ с чужим MIME-типом. Мёртвая `||`-ветка и путь к `respondWith(undefined)`/`TypeError` устраняются. Unit-тесты текста генерируемого SW расширяются так, что фолбэк-ветки, `ignoreSearch` и navigate-only-различие проверяются и защищены от регресса. Прекеш, `install`/`activate`, цикл обновления, `public/sw.js`, `src/main.tsx`, `src/App.tsx` в этом слайсе не трогаются.

## Background / Current Bugs (проверено на base `9de3d419`; номера строк перепроверить на HEAD)

`createServiceWorkerBody(assets, timestamp)` в `scripts/generate-service-worker.mjs` (строки 38–72) собирает текст SW; текущий fetch-обработчик — строки 54–70. Функция чистая (детерминированный вывод по фиксированным `assets` + `timestamp`) и экспортируется, поэтому unit-тесты вызывают её напрямую и проверяют возвращённую строку — SW не исполняется в рантайме теста.

Текущая catch-ветка (строка 67):
`.catch(() => caches.match("/") || caches.match("/index.html"))`

Четыре бага (проблема №3 ТЗ-13, §1 строка 17):

1. **Мёртвый правый операнд `||`.** `caches.match("/")` возвращает `Promise` (всегда truthy) → правый операнд `caches.match("/index.html")` недостижим; фолбэк на `/index.html` не срабатывает никогда.
2. **`respondWith(undefined)` → TypeError.** Если «/» отсутствует в кеше, `caches.match("/")` резолвится в `undefined`; `respondWith` получает Promise→`undefined` → `TypeError` в SW, запрос падает без валидного `Response`.
3. **HTML-фолбэк применяется ко всем упавшим GET без различия mode/destination.** Оффлайн-запрос картинки или JS-чанка при сетевой ошибке получает HTML app shell с неверным MIME («Failed to fetch dynamically imported module» для чанка; битый ресурс для картинки).
4. **Нет `ignoreSearch` для навигаций.** `caches.match(event.request)` без опций (строка 57): навигация на `/?legacyManual=1` не матчит прекешированный ключ «/».

Текущие unit-тесты (`tests/service-worker-generation.test.mjs`, второй `test()` блок, строки 113–149) проверяют только присутствие `cache.addAll(ASSETS)`, `fetch(event.request)`, `cache.put(event.request, copy)` и отсутствие отложенных ассетов. Ни одна проверка не покрывает фолбэк-ветки, `ignoreSearch` или navigate-only-различие.

## In Scope

- **FR-4 (корректность fetch-обработчика в `createServiceWorkerBody`).** Переписать ТОЛЬКО тело fetch-обработчика генерируемого SW так, чтобы итоговый текст удовлетворял функциональным требованиям ниже. Точная синтаксическая форма зафиксирована в `plan.md` (Design) как эталон для детерминированного воспроизведения.
- **FR-7 (расширение unit-тестов текста SW).** Дополнить `tests/service-worker-generation.test.mjs` проверками текста генерируемого SW, реально падающими на текущем баговом тексте и проходящими на исправленном.

## Out of Scope (явно исключается из этого слайса)

- FR-1 / FR-2 / FR-5 — двухфазный прекеш, reuse из предыдущего кеша, статус установки в UI. `cache.addAll(ASSETS)`, `collectInstallPrecacheAssets`/`shouldInstallPrecacheAsset`/`isManualDynamicChunk`/`isManualPageImageAsset` и имя кеша НЕ меняются.
- FR-3 — цикл обновления, `skipWaiting`, `onupdatefound`/`controllerchange`, баннер, периодический `registration.update()`. `src/main.tsx` и `src/App.tsx` НЕ трогаются.
- FR-6 — тонкий no-op `public/sw.js` + guard-тест. `public/sw.js` НЕ меняется.
- E2e с реальной регистрацией/установкой SW (e2e-часть AC-1/AC-2/AC-3/AC-4/AC-5). В этом слайсе — только unit-проверки текста генерируемого SW. **AC-3 e2e-часть — явный non-goal** (ТЗ-13 план откладывает e2e на более широкие шаги 2–4).
- Оценка/внедрение Workbox (NFR-1).
- Любые изменения UI, новые зависимости, изменения сборки/деплоя, роутинга, схемы кеша, прогресс-store.
- `install`/`activate`-обработчики и генерация списка ассетов.

## Functional Requirements

1. **FR-4.1 (ignoreSearch keyed on navigate).** Поиск в кеше использует `caches.match(event.request, { ignoreSearch: event.request.mode === "navigate" })`: навигации матчат прекешированный app shell независимо от query-строки; для не-навигационных запросов `ignoreSearch` равен `false` (разные query остаются разными ключами кеша — регресса матчинга субресурсов нет).
2. **FR-4.2 (рабочий двойной navigate-фолбэк).** В catch-ветке (сетевая ошибка) для навигационного запроса (`event.request.mode === "navigate"`) SW возвращает `(await caches.match("/")) ?? (await caches.match("/index.html")) ?? Response.error()`. Оператор `??` гарантирует, что `undefined`-результаты корректно проваливаются к следующему варианту; `respondWith` никогда не получает `undefined`. Мёртвый `||`-операнд устранён.
3. **FR-4.3 (субресурс → сетевая ошибка).** В catch-ветке для любого НЕ-навигационного запроса SW возвращает `Response.error()` — сетевую ошибку, а не HTML-документ.
4. **FR-4.4 (успешный путь без изменений).** `event.request.method !== "GET"` → ранний выход сохраняется; кеш-фёрст сохраняется; успешный сетевой путь для GET кеширует ТОЛЬКО `response.ok` через `caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy))` — без изменений семантики.
5. **FR-4.5 (никаких обходных Response).** Не вводятся литералы MIME-типов, ручной `new Response(...)` с HTML или `new Response(null, { status })` — терминальный фолбэк субресурса это ровно `Response.error()`.
6. **FR-6-invariant (прекеш и обработчики неизменны).** Прекеш (`ASSETS`, `cache.addAll`), `CACHE_NAME`, `install`/`activate` и генерация списка ассетов функционально не меняются.
7. **FR-7 (расширение unit-тестов).** `tests/service-worker-generation.test.mjs` расширен проверками текста генерируемого SW: наличие `ignoreSearch` в привязке к `event.request.mode === "navigate"`; обе навигационные фолбэк-ветки (`caches.match("/")`, `caches.match("/index.html")`) с терминальным `?? Response.error()`; отдельный `return Response.error();` для не-навигационной ветки; ОТСУТСТВИЕ мёртвого `caches.match("/") || caches.match(...)` и старого бесопционного `caches.match(event.request).then`. Существующие проверки (`addAll`, `fetch`, `put`, отсутствие отложенных ассетов, `body === generated`) остаются зелёными.
8. **FR-7-guard (реальная сторожевая сила).** Новые ассерты обязаны падать на текущем (баговом) тексте SW и проходить на исправленном — то есть служить реальным сторожем регресса fetch-логики, а не дублировать существующие `addAll/fetch/put`-проверки.

## Acceptance Criteria

- **AC-1 (FR-4, unit текста SW).** Сгенерированный текст SW содержит `caches.match(event.request, { ignoreSearch: event.request.mode === "navigate" })`; catch-навигация содержит цепочку `(await caches.match("/")) ?? (await caches.match("/index.html")) ?? Response.error()`; не-навигационная catch-ветка возвращает `Response.error()`; мёртвый `||` отсутствует.
- **AC-2 (AC-3 ТЗ-13, unit-часть).** Инварианты текста SW явно закрывают navigate-vs-subresource-различие: субресурс при сетевой ошибке даёт `Response.error()`, а не HTML. E2e-часть AC-3 — вне scope (документируется как non-goal).
- **AC-3 (FR-7 guard).** Новые ассерты в `tests/service-worker-generation.test.mjs` падают на текущем баговом тексте и проходят на исправленном (test-first порядок из плана).
- **AC-4 (границы дифа).** Диф ограничен `scripts/generate-service-worker.mjs` (тело fetch-обработчика) + `tests/service-worker-generation.test.mjs`; при необходимости — синхронизация durable-доков (см. Decisions в plan.md/tasks.md). `public/sw.js`, `src/main.tsx`, `src/App.tsx`, прекеш-логика, `package.json` НЕ изменены.
- **AC-5 (гейты).** `pnpm run quality:fast`, `pnpm run format:check`, `pnpm run test` (весь `node --test`), `pnpm run preflight` зелёные; фактические свидетельства записаны в `tasks.md` Verification Evidence.

## Negative Scenarios (обязательны для feature memory)

- **NS-1 (главный) — оффлайн-запрос отсутствующего субресурса (картинка / JS-чанк).** При сетевой ошибке для не-навигационного запроса SW обязан вернуть `Response.error()`, а НЕ HTML app shell с неверным MIME. Прежнее поведение (HTML для всех GET) давало «Failed to fetch dynamically imported module» для чанка и битые картинки; после FR-4 упавший субресурс детерминированно получает сетевую ошибку. Проверяется инвариантом текста SW `return Response.error();` в не-навигационной ветке + отсутствием HTML-фолбэка вне навигации.
- **NS-2 — навигация оффлайн при отсутствии «/» в кеше.** Навигационный catch не падает в `respondWith(undefined)`/`TypeError`: цепочка `??` проваливается к `caches.match("/index.html")`, при его отсутствии — к `Response.error()`. Проверяется инвариантом наличия полной `?? ... ?? Response.error()` цепочки и отсутствием мёртвого `||`.
- **NS-3 — навигация с query-параметром оффлайн (`/?legacyManual=1`).** С `ignoreSearch: event.request.mode === "navigate"` навигация матчит app shell; для субресурсов `ignoreSearch` остаётся `false`. Проверяется инвариантом привязки `ignoreSearch` к navigate-предикату.
- **NS-4 — регресс fetch-логики.** Новые ассерты FR-7 падают на исходном баговом тексте SW (мёртвый `||`, отсутствие `ignoreSearch`/`Response.error()`) — реальный сторож, а не одинаковый проход на старом и новом коде.

## Assumptions (из intake A1–A7; Architect-подтверждены)

- **A1 — форма реализации.** Тело обработчика переписывается на async-IIFE внутри `event.respondWith(...)` (см. plan.md Design), чтобы `await caches.match(...)` и `??` читались прямо по §3 ТЗ-13. Эталонный текст зафиксирован в plan.md для детерминизма.
- **A2 — проверяемые инварианты FR-7.** Тесты матчат по тексту генерируемого SW через `assert.match` / `assert.doesNotMatch` (как уже делают существующие проверки), а не исполняют SW в ServiceWorker-рантайме. Точные регэкспы — в plan.md.
- **A3 — терминальный фолбэк субресурса.** Строго `Response.error()`. Не `new Response(null, { status: 504 })` и не HTML.
- **A4 — определение навигации.** Единый предикат `event.request.mode === "navigate"` и для `ignoreSearch`, и для выбора HTML-фолбэк-ветки. Не эвристика по `Accept`/`destination`.
- **A5 — install/activate/прекеш не трогаются.**
- **A6 — durable-документация.** Если в `docs_project/` есть durable-описание fetch-поведения SW/оффлайна, затрагиваемое изменением — синхронизировать; иначе правок доков нет (Implementation Agent фиксирует фактический результат grep). Отметка выполненности шага 1 в чекбоксе `docs/improvements/13-service-worker-reliability.md` §4 НЕ редактируется (прецедент слайсов 1–2 ТЗ-P1).
- **A7 — номера строк.** Проверены на base `9de3d419`; Implementation Agent перепроверяет на HEAD.

## References

- `docs/improvements/13-service-worker-reliability.md` — проблема №3 (§1 строка 17), FR-4 (строка 32), FR-7 (строка 35), AC-3 (строка 49), план шаг 1 (строка 40), затрагиваемые файлы (строка 63).
- `docs/improvements/README.md` — «Рекомендуемая последовательность» этапа 1: ТЗ-13 шаг 1 после ТЗ-P1 слайсов 1–2, до ТЗ-14.
- `scripts/generate-service-worker.mjs` — `createServiceWorkerBody` (38–72), fetch-обработчик (54–70), баговая catch-ветка (67); install/activate/прекеш (42–52, не трогаются).
- `tests/service-worker-generation.test.mjs` — текущие проверки (113–149), узкие ассерты `addAll/fetch/put` (136–138).
- `specs/047-exam-attempt-persistence/{feature-request,spec,plan,tasks}.md` — образец формата предыдущего цикла.
- `.specify/memory/constitution.md`, `AGENTS.md`, `CLAUDE.md` — процессные границы, гейты качества.
