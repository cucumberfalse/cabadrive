# Plan: Корректность fetch-обработчика service worker + unit-тесты текста SW (ТЗ-13, шаг 1)

## Cycle Context

- Feature ID: `048-service-worker-fetch-correctness` / ТЗ-13 шаг 1 (FR-4 + FR-7 ONLY).
- Base: verified `origin/main` = `9de3d419772cb9b971cc01299fa4f251b86c08a9` (merge PR #212). Worktree HEAD == base, дерево чистое до `specs/048-*`.
- Branch/worktree: `claude/048-service-worker-fetch-correctness` / `/Users/chap/devel/cabadrive-claude/repo/.claude/worktrees/048-service-worker-fetch-correctness`.
- Одна ветка, один PR, минимальная площадь: два файла (+ опц. durable-док по A6).

## Principles Applied (Constitution)

- **Principle III (Test-first).** FR-7 ассерты пишутся и наблюдаются падающими на текущем баговом тексте SW ДО правки FR-4; затем FR-4 делает их зелёными.
- **Simplicity / minimal surface.** Меняется только тело fetch-обработчика в `createServiceWorkerBody` + тест-файл. Никаких новых функций-абстракций, зависимостей, изменений прекеша/`install`/`activate`/`public/sw.js`/`src`.
- **Determinism.** `createServiceWorkerBody(assets, timestamp)` остаётся чистой; тесты передают фиксированный `timestamp` (`12345`) и матчат возвращённую строку.

## Design — эталонный emitted fetch-обработчик (FR-4)

Заменяется РОВНО тело слушателя `self.addEventListener("fetch", ...)` внутри template-строки `createServiceWorkerBody` (текущие строки 54–70 файла `scripts/generate-service-worker.mjs`). `install`/`activate`/`CACHE_NAME`/`ASSETS`/`generateServiceWorker` — без изменений.

Эталонный текст emitted-обработчика (это СТРОКА, генерируемая скриптом; она не прогоняется через prettier/eslint — форматируется как записано; Implementation Agent воспроизводит её символ-в-символ, чтобы FR-7 регэкспы матчились детерминированно):

```js
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    (async () => {
      const cached = await caches.match(event.request, {
        ignoreSearch: event.request.mode === "navigate",
      });
      if (cached) return cached;
      try {
        const response = await fetch(event.request);
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      } catch {
        if (event.request.mode === "navigate") {
          return (await caches.match("/")) ?? (await caches.match("/index.html")) ?? Response.error();
        }
        return Response.error();
      }
    })(),
  );
});
```

Обоснование формы (A1):

- **async-IIFE внутри `respondWith`** предпочтена `.then`-цепочке: `await` + оператор `??` читаются прямо по §3 ТЗ-13, а `respondWith` получает единственный Promise от IIFE. Альтернатива (`async function handleFetch(event)` + `respondWith(handleFetch(event))`) добавляет именованную функцию ради одноразовой логики — против Simplicity; IIFE держит всё в одном обработчике.
- **`catch {` (optional catch binding, ES2019)** — без неиспользуемого биндинга `error`; чисто и валидно в SW-рантайме evergreen-браузеров.
- **`ignoreSearch: event.request.mode === "navigate"`** — единый navigate-предикат (A4); для субресурсов `ignoreSearch` вычисляется в `false`, матчинг разных query не ломается (NS-3).
- **navigate catch** — `(await caches.match("/")) ?? (await caches.match("/index.html")) ?? Response.error()`: рабочий двойной фолбэк, `??` корректно проваливает `undefined` (устраняет баги 1 и 2; NS-2).
- **не-навигационный catch** — `return Response.error();`: субресурс получает сетевую ошибку, не HTML (баг 3; NS-1). Терминальный фолбэк строго `Response.error()` (A3) — никаких `new Response(...)`/MIME-литералов (FR-4.5).
- **Успешный путь неизменен** — ранний выход `method !== "GET"`, кеш-фёрст, `response.ok` → `caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy))` сохранены дословно (FR-4.4), поэтому существующие ассерты `fetch(event.request)` и `cache.put(event.request, copy)` остаются зелёными.

Подстрочные инварианты (сохраняются как substring ⇒ существующие тесты зелёные):

- `cache.addAll(ASSETS)` — в install, неизменно.
- `fetch(event.request)` — присутствует (`await fetch(event.request)`).
- `cache.put(event.request, copy)` — присутствует.

Замечания по формированию строки:

- Новый текст обработчика не содержит символов `` ` `` или `${` — экранирование в объемлющем template-литерале `createServiceWorkerBody` не требуется.
- Emitted-текст не проходит prettier (это runtime-строка), но объемлющий `.mjs` проходит prettier+eslint — Implementation Agent обязан прогнать `pnpm run format:check` и `pnpm run quality:fast` над самим `.mjs` после правки.

## Design — FR-7 unit-тесты (текст генерируемого SW)

Файл: `tests/service-worker-generation.test.mjs`. Решение (см. Decisions в tasks.md): добавить ОДИН новый focused `test()` блок, посвящённый корректности fetch-обработчика (отдельная забота от прекеша/runtime-кеша во втором блоке). Существующие два `test()` блока и их ассерты не ослабляются. Новый блок повторно использует `withTempDist` + `generateServiceWorker({ dist, timestamp: 12345 })` и матчит `generated` (или напрямую `createServiceWorkerBody(assets, 12345)`).

Набор ассертов (эталон; точные литералы Implementation Agent сверяет с emitted-текстом на HEAD):

Позитивные (проходят на новом тексте, ПАДАЮТ на текущем баговом — реальный сторож):

- `assert.match(generated, /caches\.match\(event\.request, \{\s*ignoreSearch: event\.request\.mode === "navigate",?\s*\}\)/)` — FR-4.1: ignoreSearch keyed on navigate mode (текущий текст `caches.match(event.request).then` не матчит).
- `assert.match(generated, /\(await caches\.match\("\/"\)\) \?\? \(await caches\.match\("\/index\.html"\)\) \?\? Response\.error\(\)/)` — FR-4.2: полная navigate-фолбэк-цепочка с `??` и терминальным `Response.error()`.
- `assert.match(generated, /if \(event\.request\.mode === "navigate"\)/)` — navigate-only ветвление HTML-фолбэка в catch.
- `assert.match(generated, /return Response\.error\(\);/)` — FR-4.3: не-навигационная ветка возвращает `Response.error()` (эта строка отсутствует на теле `return (await caches.match("/")) ?? ...`, поэтому матчит только субресурсную ветку).

Негативные (падают на текущем баговом тексте ⇒ гарантируют test-first; проходят на новом):

- `assert.doesNotMatch(generated, /caches\.match\("\/"\) \|\| caches\.match/)` — мёртвый `||`-операнд устранён (текущий текст содержит `caches.match("/") || caches.match("/index.html")`).
- `assert.doesNotMatch(generated, /caches\.match\(event\.request\)\.then/)` — старый бесопционный кеш-матч заменён (текущий текст содержит `caches.match(event.request).then`).

Существующие ассерты (остаются зелёными, не переписываются): `cache.addAll(ASSETS)`, `fetch(event.request)`, `cache.put(event.request, copy)`, `body === generated`, `doesNotMatch` отложенных ассетов.

Test-first наблюдение (T-порядок в tasks.md): сначала добавить новый `test()` с ассертами и прогнать `node --test tests/service-worker-generation.test.mjs` — ожидается FAIL нового блока (позитивные `assert.match` не находят новый текст; `assert.doesNotMatch(||)` падает на мёртвом `||`). Затем правка FR-4 → повторный прогон зелёный. Обе стадии записываются в Verification Evidence.

## Files Touched

- `scripts/generate-service-worker.mjs` — ТОЛЬКО тело fetch-обработчика в `createServiceWorkerBody`. Всё остальное (импорты, `isManualDynamicChunk`, `isManualPageImageAsset`, `shouldInstallPrecacheAsset`, `walk`, `collectInstallPrecacheAssets`, `install`/`activate`, `CACHE_NAME`, `ASSETS`, `generateServiceWorker`) — без изменений.
- `tests/service-worker-generation.test.mjs` — добавить один focused `test()` блок (FR-7); существующие два блока не ослаблять.
- (Опц., A6) durable-док в `docs_project/`, если он описывает fetch/оффлайн-поведение SW — синхронизация. `docs/improvements/13-*.md` чекбокс НЕ редактируется.

Файлы, которые НЕ трогаются: `public/sw.js`, `src/main.tsx`, `src/App.tsx`, `package.json`, прекеш-логика, `install`/`activate`.

## Verification Strategy

- `node --test tests/service-worker-generation.test.mjs` — test-first fail, затем pass.
- `pnpm run test` (`node --test tests/*.test.mjs`) — весь набор зелёный; базис 553 (на base `9de3d419`), после добавления одного `test()` ожидается 554 (Implementation Agent подтверждает точное число на HEAD).
- `pnpm run quality:fast` (`tsc --noEmit` + eslint `--max-warnings 0`) — зелёный.
- `pnpm run format:check` — зелёный.
- `pnpm run preflight` — перед push, EXIT 0.
- Границы: `git diff --stat` показывает только два файла (+ опц. durable-док); `git diff --stat public/sw.js src/main.tsx src/App.tsx package.json` — пусто; grep, что прекеш/`install`/`activate`/`CACHE_NAME` не изменены (`git diff scripts/generate-service-worker.mjs` затрагивает только тело fetch-обработчика).

## Risks & Mitigations

| Риск | Вероятн. | Влияние | Мера |
|---|---|---|---|
| Новый обработчик ломает кеш-фёрст/`response.ok`-кеширование | Низкая | Регресс оффлайна | Менять только форму кеш-матча и catch; сохранить `method !== "GET"`, кеш-фёрст, `cache.put` для `response.ok`; существующие `addAll/fetch/put` ассерты зелёные |
| FR-7 ассерты «косметические» (проходят и на баговом, и на новом) | Средняя | Ложная защита | Требование FR-7-guard: наблюдать падение на текущем тексте (мёртвый `||`, `.then`-форма, отсутствие `ignoreSearch`/`Response.error()`); зафиксировать test-first в Evidence |
| `ignoreSearch` включён для субресурсов → отдача не того query-варианта | Низкая | Неверный ассет | `ignoreSearch` строго завязан на `event.request.mode === "navigate"`; для субресурсов `false`; покрыто ассертом |
| Emitted-текст расходится с FR-7 регэкспами (пробелы/переносы) | Средняя | Красные тесты | Эталонный текст зафиксирован здесь символ-в-символ; регэкспы допускают гибкие `\s*` в объектной опции; Implementation Agent сверяет литералы на HEAD |
| Скоуп расползается в прекеш/цикл обновления/`public/sw.js` | Средняя | Нарушение «маленького PR» | Явные Out-of-scope границы; `git diff --stat` контроль |
| Расхождение с prettier в `.mjs` | Низкая | Красный `format:check` | Прогнать `pnpm run format:check`/`format` над `.mjs`; emitted-строка prettier не затрагивается |
