# Plan: nginx — split кеш-политики, security-заголовки, gzip и unprivileged-образ (ТЗ-14)

## Cycle Context

- Feature ID: `049-nginx-caching-security` / ТЗ-14 (FR-1..FR-5 + NFR-1). Один work cycle, одна ветка, один PR.
- Base: verified `origin/main` = `c5520b31922c0e45afd96b2e5877136c1848a541` (merge PR #213). Worktree HEAD == base, дерево чистое до `specs/049-*`.
- Branch/worktree: `claude/049-nginx-caching-security` / `/Users/chap/devel/cabadrive-claude/repo/.claude/worktrees/049-nginx-caching-security`.
- Минимальная площадь: `nginx.conf`, `Dockerfile`, `tests/docker-runtime.test.mjs`, `.github/workflows/ci.yml` (только `docker-validation`), `docs_project/project/devops/docker-runtime.md` (аддитивная синхронизация).

## Principles Applied (Constitution)

- **Principle III (Test-first).** Статические text-ассерты FR-5.1 на `nginx.conf`/`Dockerfile` пишутся и наблюдаются падающими на ТЕКУЩЕМ баговом конфиге ДО правки nginx.conf/Dockerfile; затем правки делают их зелёными.
- **Simplicity / minimal surface.** Инфраструктурный слой раздачи + контрактный тест. Приложение/роутинг/контент/`assetUrl()` не меняются. Узкое C055-214-FRESH исключение разрешает только install-precache reload request construction, meaningful HTTP-cache regression и truthful freshness docs; остальной SW protocol сохраняется. Cache-Control через `map` (одна server-level `add_header`), а не размазан по `location`-блокам.
- **Determinism.** Эталонные `nginx.conf` и `Dockerfile` зафиксированы ниже символ-в-символ, чтобы FR-5.1 статические ассерты матчились детерминированно (тот же приём, что 048 применял к тексту SW-обработчика).

## Design — эталонный `nginx.conf` (FR-1/FR-2/FR-3)

Полный текст файла `nginx.conf` (заменяет текущие 20 строк ЦЕЛИКОМ; Implementation Agent воспроизводит символ-в-символ):

```nginx
map $uri $cache_control {
  default            "";
  ~^/assets/         "public, max-age=31536000, immutable";
  ~^/content/assets/ "public, max-age=86400, stale-while-revalidate=604800";
  /sw.js             "no-cache";
}

server {
  listen 8080;
  server_name _;
  root /usr/share/nginx/html;
  index index.html;

  gzip on;
  gzip_vary on;
  gzip_min_length 1024;
  gzip_comp_level 6;
  gzip_types application/javascript application/json image/svg+xml text/css text/javascript;

  add_header X-Content-Type-Options "nosniff" always;
  add_header X-Frame-Options "DENY" always;
  add_header Referrer-Policy "strict-origin-when-cross-origin" always;
  add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
  add_header Content-Security-Policy "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'" always;
  # NS-8: без `always` — Cache-Control выставляется только на 2xx/3xx, не на 404 ассетов (immutable не «залипает» на error-ответах)
  add_header Cache-Control $cache_control;

  location / {
    try_files $uri $uri/ /index.html;
  }

  location /assets/ {
    try_files $uri =404;
  }

  location /content/assets/ {
    try_files $uri =404;
  }

  location = /sw.js {
    try_files $uri =404;
  }
}
```

### Обоснование формы (Decisions)

- **`map $uri $cache_control` + единственный server-level `add_header Cache-Control $cache_control;` (решает `add_header`-inheritance trap — NS-7).** В nginx `add_header` в `location`-блоке ОТМЕНЯЕТ наследование ВСЕХ server-level `add_header` для ответов этого location. Наивная схема (security-заголовки в `server{}`, `Cache-Control` в `location /assets/`) молча уронила бы security-заголовки на всех ассет-ответах. Здесь Cache-Control выведен из `map` по `$uri`, а эмитится ОДНОЙ server-level `add_header` вместе с security-заголовками; ни в одном `location` НЕТ `add_header` → все server-level заголовки (security + Cache-Control) наследуются каждым 2xx/3xx-ответом (`/`, `/assets/`, `/content/assets/`, `/sw.js`). Эта Cache-Control-`add_header` намеренно БЕЗ `always` (NS-8), чтобы immutable-политика не применялась к 404 ассетов; security-заголовки сохраняют `always` и потому покрывают и error-ответы. `map` — http-context-директива; `nginx.conf` копируется в `/etc/nginx/conf.d/default.conf`, который `include`-ится внутри `http{}`, поэтому `map` перед `server{}` в этом файле валиден.
  - Когда `$cache_control` = `""` (default: `/`, `/index.html`), nginx НЕ добавляет заголовок `Cache-Control` (штатное поведение `add_header` с пустым значением, начиная с nginx 1.7.5) — на HTML-shell Cache-Control не навязывается, что корректно.
  - `map` использует точное сопоставление для `/sw.js` (exact-string ключи в `map` имеют приоритет над regex независимо от порядка) и regex `~^/assets/` / `~^/content/assets/` для префиксов. `$uri` — нормализованный путь без query-строки.
  - Альтернативы отвергнуты: (б) повтор полного набора заголовков в каждом `location` — многословно и хрупко (легко забыть заголовок в одном location → дыра); (в) `include`-сниппет общих заголовков в каждом location — тоже требует per-location `add_header` (или `include` внутри location) и не даёт выигрыша над `map` при нашей простой матрице путей. `map`-подход — идиоматичный, единая точка правды, нулевой риск inheritance-trap.
- **`always` на security-заголовках, но НЕ на Cache-Control — осознанная асимметрия (NS-8).** `always` стоит на 5 security-заголовках (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, CSP), чтобы гарантировать их эмиссию на error-ответах (например, 404 от `try_files … =404`), а не только на 2xx/3xx — это выполняет FR-2.1. Cache-Control, напротив, эмитится `add_header` БЕЗ `always`: nginx выставит его только на 2xx/3xx, и immutable-политика НЕ применится к 404 ассетов (иначе транзиентный `/assets/*` 404 ушёл бы как `max-age=31536000, immutable` и «запинал» бы сбой в браузерах после восстановления файла — NS-8). FR-1.1 не страдает: все реальные 200-ответы ассетов по-прежнему получают свой Cache-Control из `map`.
- **`location /assets/` и `location /content/assets/` с `try_files $uri =404;` (без `add_header`).** Нужны, чтобы отсутствующий ассет отдавал 404, а не проваливался в SPA-фолбэк `location /` → `/index.html` (200 HTML с чужим MIME). Cache-Control для них приходит из `map`, поэтому `add_header` в этих блоках НЕТ (иначе сломается наследование security-заголовков — NS-7). `location = /sw.js` (exact match) — тем же приёмом, cache-control `no-cache` из `map`.
- **`gzip_types` включает `text/javascript` (NS-6, ключевое).** nginx 1.29 mime.types мапит `.js`/`.mjs` → `text/javascript` (не `application/javascript`, как в старых версиях). Без `text/javascript` в списке Vite-JS-бандлы отдавались бы НЕсжатыми. Список: `application/javascript application/json image/svg+xml text/css text/javascript` — `text/javascript` (фактический тип .js в 1.29) + `application/javascript` (страховка) + JSON/CSS/SVG. `text/html` НЕ перечислен: он всегда сжимается неявно, а явное перечисление вызвало бы warning «duplicate MIME type text/html». `gzip_vary on` добавляет `Vary: Accept-Encoding`. `gzip_min_length 1024`, `gzip_comp_level 6` дословно по ТЗ-14 §3.
- **CSP символ-в-символ по ТЗ-14/A3.** `default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'`. `'self'`-only (+`data:` img) → не вводит внешний origin (NS-4). `script-src 'self'` без `'unsafe-inline'` безопасен: build-вывод `dist/index.html` не содержит инлайн-скриптов (только module-`<script src="/assets/…js">` + линкованный `<link … /assets/…css>`); modulepreload-polyfill Vite инжектится module-импортом внутри entry-чанка, а не инлайн в HTML. `style-src 'unsafe-inline'` покрывает рантайм-инлайн-стили React/Vite; линкованный CSS покрыт `'self'` (NS-1). `object-src`/`form-action` не добавляются (A3).
- **`Permissions-Policy: camera=(), microphone=(), geolocation=()`** дословно по ТЗ-14 §3 FR-2 (A4).
- **HSTS не вводится (A7).** Образ раздаёт по HTTP на :8080; TLS-термінация — вне образа. `Strict-Transport-Security` без TLS бессмыслен/вреден → явно не добавляется.
- **`location /`, `listen 8080`, `server_name _`, `root`, `index` сохранены** функционально из текущего конфига (SPA-фолбэк неизменен, NFR-1/офлайн не ломается).

## Design — эталонный `Dockerfile` (FR-4)

Меняется РОВНО одна строка (runtime-`FROM`); остальное — символ-в-символ как сейчас:

```dockerfile
FROM node:22-alpine AS build

WORKDIR /app
RUN corepack enable

COPY package.json pnpm-workspace.yaml ./
COPY pnpm-lock.yaml* ./
RUN if [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile; else pnpm install --no-frozen-lockfile; fi

COPY . .
RUN pnpm run build

FROM nginxinc/nginx-unprivileged:1.29-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
```

### Обоснование (A6 / NS-3)

- **Единственная правка — `FROM nginx:1.29-alpine` → `FROM nginxinc/nginx-unprivileged:1.29-alpine`.** Официальный unprivileged-образ: запускается как `nginx` (uid 101) через `USER 101` из коробки → AC-4 (master не root) выполняется без доп. директив; `listen 8080` по умолчанию (совпадает с нашим); pid `/tmp/nginx.pid` и temp-пути под `/tmp` writable — заданы в главном `/etc/nginx/nginx.conf` образа, который мы НЕ переопределяем (меняем только `conf.d/default.conf`). Html-root `/usr/share/nginx/html` и `include /etc/nginx/conf.d/*.conf` внутри `http{}` — идентичны стоковому образу, поэтому оба `COPY` работают без изменений.
- **`EXPOSE 8080` и `CMD ["nginx","-g","daemon off;"]` сохранены.** Совместимы с unprivileged-образом (его ENTRYPOINT `/docker-entrypoint.sh` + наш CMD работают как в стоке). `user`-директива в `conf.d` невозможна (main-context) и не нужна — не-root обеспечен базовым образом.
- **Build-стадия `node:22-alpine` не меняется.**

## Design — FR-5.1 статический контракт (`tests/docker-runtime.test.mjs`)

Файл читает `nginx.conf` и `Dockerfile` (добавить два `readFileSync(new URL("../nginx.conf"|"../Dockerfile", import.meta.url), "utf8")` рядом с существующими чтениями compose/Makefile/docs). Добавить ДВА новых focused `test()` блока (решение — см. Decisions; отдельная забота от compose/Makefile/docs-блоков). Существующие 4 блока (строки 16-53) НЕ ослабляются.

Блок 1 — `test("nginx.conf splits cache policy, sets security headers, and enables gzip", …)`:

Позитивные (проходят на новом тексте, ПАДАЮТ на текущем баговом — test-first regression guard):

- `assert.match(nginx, /map \$uri \$cache_control/)` — текущий конфиг без `map` → FAIL.
- `assert.match(nginx, /~\^\/assets\/\s+"public, max-age=31536000, immutable"/)` — immutable на хешированных бандлах; текущий без `/assets/`-маппинга → FAIL.
- `assert.match(nginx, /~\^\/content\/assets\/\s+"public, max-age=86400, stale-while-revalidate=604800"/)` — **NS-2 regression guard**: текущий конфиг не содержит `content/assets` с `max-age=86400` (там `immutable`/`31536000`) → FAIL.
- `assert.match(nginx, /add_header X-Content-Type-Options "nosniff" always;/)` — текущий без security-заголовков → FAIL.
- `assert.match(nginx, /add_header X-Frame-Options "DENY" always;/)`, `Referrer-Policy "strict-origin-when-cross-origin"`, `Permissions-Policy "camera=\(\), microphone=\(\), geolocation=\(\)"` → FAIL на текущем.
- `assert.match(nginx, /add_header Content-Security-Policy "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'" always;/)` — точная CSP; текущий без CSP → FAIL.
- `assert.match(nginx, /add_header Cache-Control \$cache_control;/)` — единая server-level Cache-Control из map, БЕЗ `always` (NS-8) → FAIL на текущем (нет строки вовсе).
- `assert.match(nginx, /gzip on;/)` и `assert.match(nginx, /gzip_types[^;]*text\/javascript/)` — **NS-6 guard**: gzip включён и `text/javascript` в типах; текущий без gzip → FAIL.

Негативные (гарантируют устранение бага; на текущем — FAIL, потому что содержит запрещённый паттерн):

- `assert.doesNotMatch(nginx, /\/content\/assets\/[^\n]*immutable/)` — на нехешированном пути нет immutable в одной строке маппинга (текущий баговый маппинг `/content/assets/ … immutable` — но он в двухстрочном location; этот ассерт держится за строку `map`; на новом конфиге строка `~^/content/assets/ "public, max-age=86400, …"` не содержит immutable → PASS). Основной NS-2-guard — позитивный ассерт `max-age=86400` выше.
- `assert.doesNotMatch(nginx, /gzip_types[^;]*text\/html/)` — text/html не в явном списке (иначе warning duplicate); PASS на новом.
- `assert.doesNotMatch(nginx, /add_header Cache-Control \$cache_control always;/)` — **NS-8 regression guard**: Cache-Control-`add_header` НЕ несёт `always` (иначе immutable «залипнет» на 404 ассетов); PASS на новом.

Блок 2 — `test("Dockerfile runtime uses unprivileged nginx base image", …)`:

- `assert.match(dockerfile, /FROM nginxinc\/nginx-unprivileged:1\.29-alpine/)` — текущий `nginx:1.29-alpine` → FAIL.
- `assert.doesNotMatch(dockerfile, /FROM nginx:1\.29-alpine/)` — стоковый root-образ устранён; текущий содержит → FAIL.
- `assert.match(dockerfile, /COPY nginx\.conf \/etc\/nginx\/conf\.d\/default\.conf/)` и `assert.match(dockerfile, /EXPOSE 8080/)` — инвариант портов/копирования (PASS на обоих; страхует от регресса).

Test-first наблюдение (T-порядок в tasks.md): сначала добавить оба `test()` блока (и чтения `nginx.conf`/`Dockerfile`) и прогнать `node --test tests/docker-runtime.test.mjs` — ожидается FAIL новых блоков на текущих баговых `nginx.conf`/`Dockerfile`. Затем правки FR-1..FR-4 → повторный прогон зелёный. Обе стадии в Verification Evidence.

## Design — FR-5.2 runtime-контракт (`.github/workflows/ci.yml`, джоба `docker-validation`)

Расширить существующий шаг «Smoke test local app» (или добавить шаг «Header contract smoke» после него, до `make down`) реальными `curl -I`-проверками против поднятого образа на `localhost:${CABADRIVE_HOST_PORT}` (5173). Существующие `curl /` (проверка `Cabadrive` в HTML) и `curl /sw.js` сохранить. Эталонный shell (Implementation Agent воспроизводит семантику; `set -euo pipefail`):

```bash
# hashed Vite bundle discovered from index.html
asset=$(curl --fail --silent "http://localhost:${CABADRIVE_HOST_PORT}/" | grep -oE '/assets/[^"]+\.js' | head -1)
test -n "$asset"
# FR-1: immutable on hashed /assets/
curl -sI "http://localhost:${CABADRIVE_HOST_PORT}${asset}" | grep -qi 'cache-control: public, max-age=31536000, immutable'
# FR-3 (NS-6): gzip on a JS asset when Accept-Encoding: gzip
curl -sI -H 'Accept-Encoding: gzip' "http://localhost:${CABADRIVE_HOST_PORT}${asset}" | grep -qi 'content-encoding: gzip'
# FR-2: security headers on the app shell
curl -sI "http://localhost:${CABADRIVE_HOST_PORT}/" | grep -qi 'x-content-type-options: nosniff'
curl -sI "http://localhost:${CABADRIVE_HOST_PORT}/" | grep -qi 'content-security-policy: default-src'
# FR-2/NS-8: missing /assets/ 404 keeps security headers (always) but carries NO Cache-Control (immutable must not stick to error responses)
missing="/assets/__ns8-nonexistent__.js"
curl -sI "http://localhost:${CABADRIVE_HOST_PORT}${missing}" | grep -qi 'x-content-type-options: nosniff'
! curl -sI "http://localhost:${CABADRIVE_HOST_PORT}${missing}" | grep -qi 'cache-control'
# FR-1 (NS-2): non-hashed /content/assets/ must NOT be immutable, must carry max-age=86400
img=$(find content/assets -type f \( -name '*.jpg' -o -name '*.png' -o -name '*.webp' \) | head -1)
test -n "$img"
curl -sI "http://localhost:${CABADRIVE_HOST_PORT}/${img}" | grep -qi 'cache-control: public, max-age=86400, stale-while-revalidate=604800'
! curl -sI "http://localhost:${CABADRIVE_HOST_PORT}/${img}" | grep -qi 'immutable'
```

Замечания:

- Хешированное имя `/assets/*.js` меняется каждую сборку → извлекается из `/index.html` grep-ом, не хардкодится.
- Путь картинки берётся из checked-out `content/assets/` (репозиторий на runner-е); served-URL = `/${img}` (dist зеркалит `content/assets`). Проверенный Architect пример: `/content/assets/primary-sources/…/dec196AnexoIII-01.jpg`.
- `! curl … | grep -qi immutable` — сторож NS-2 на живом образе (падает, если `/content/assets/` вернул immutable).
- Запрос к несуществующему `/assets/`-пути возвращает 404 (`try_files $uri =404`); проверяется, что security-заголовки на нём присутствуют (`always`), а заголовка `Cache-Control` НЕТ — сторож NS-8 (immutable не эмитится на error-ответах, потому что Cache-Control-`add_header` без `always`).
- `docker-validation` — CI-only (требует docker); локально Implementation Agent фиксирует, что реальный `curl -I` прогоняется в CI, и опционально прогоняет docker локально при наличии окружения.

## Design — durable-документация (A8)

`docs_project/project/devops/docker-runtime.md`, секция `## Implementation`: аддитивно (a) `Runtime is nginx on port 8080 …` → упомянуть unprivileged-образ `nginxinc/nginx-unprivileged:1.29-alpine` (master не root); (b) добавить краткий пункт, что nginx применяет split кеш-политику (immutable на хешированных `/assets/`, `max-age=86400`+`stale-while-revalidate` на нехешированных `/content/assets/`), базовые security-заголовки (включая строгую `'self'` CSP) и gzip для текстовых ответов. Только добавление/уточнение — существующие строки, на которые опираются ассерты `tests/docker-runtime.test.mjs` (`http://localhost:5173`, `COMPOSE_PROJECT_NAME=…`, «Compose auto-tags…», «must not stop, remove, rename…», «project-scoped image name»), НЕ трогаются. Чекбоксы `docs/improvements/14-*.md` §4 НЕ редактируются (прецедент 047/048).

## Files Touched

- `nginx.conf` — заменяется целиком на эталон выше (map + server с gzip/security-headers/cache + locations).
- `Dockerfile` — одна строка: runtime-`FROM` → `nginxinc/nginx-unprivileged:1.29-alpine`.
- `tests/docker-runtime.test.mjs` — +2 чтения (`nginx.conf`/`Dockerfile`), +2 focused `test()` блока (FR-5.1). Существующие 4 блока не ослабляются.
- `.github/workflows/ci.yml` — только джоба `docker-validation`: `curl -I` header-smoke (FR-5.2). Джоба `baseline-checks` не трогается.
- `docs_project/project/devops/docker-runtime.md` — аддитивная синхронизация (A8).
- C055-214-FRESH: `scripts/generate-service-worker.mjs` install request construction; `tests/service-worker-generation.test.mjs` и `tests/e2e/service-worker-http-cache.spec.ts` behavioral regression; improvements/runtime docs HTTP-versus-release-snapshot explanation без изменения status checkboxes.
- New055: compatible security-only `pnpm-lock.yaml` resolution и process memory, без manifest/owner churn.

Файлы, которые НЕ трогаются: приложение (`src/**`), ручной `public/sw.js` и остальной SW protocol (generator install request construction отдельно разрешён C055-FRESH), `assetUrl()`/`src/data/content.ts`, роутинг, контент, `index.html`, `vite.config.ts`, `docker-compose.yml`, `Makefile`, `package.json`, чекбоксы `docs/improvements/14-*.md`.

## Verification Strategy

- `node --test tests/docker-runtime.test.mjs` — test-first: FAIL новых блоков на текущих `nginx.conf`/`Dockerfile`, затем PASS после правок FR-1..FR-4.
- `pnpm run test` (`node --test tests/*.test.mjs`) — весь набор зелёный; базис **554** (замер Architect на base `c5520b31`), после добавления **двух** focused `test()` блоков ожидается **556** (`tests/docker-runtime.test.mjs`: 4 → 6). Точное число фиксирует Implementation Agent на HEAD.
- `pnpm run quality:fast` (`tsc --noEmit` + eslint `--max-warnings 0`) — зелёный (правки не касаются TS/JS-исходников приложения; тест-файл — `node --test`).
- `pnpm run format:check` — зелёный (тест-файл/ci.yml/doc проходят prettier; `nginx.conf`/`Dockerfile` вне prettier-allowlist).
- `pnpm run preflight` — перед push, EXIT 0 (включает e2e; NFR-1 «no external requests» и офлайн зелёные).
- **Docker-контракт (реальный `curl -I`)** — прогоняется в CI-джобе `docker-validation`; Implementation Agent записывает, что реальные header-проверки идут в CI, и (опц.) прогоняет docker локально.
- Границы (AC-6): nginx/runtime/test/doc файлы выше плюс явно разрешённые C055-FRESH generator/request/regression/docs и compatible security lock/process memory. `src/**`, ручной `public/sw.js`, роутинг/контент/assetUrl, index/vite/compose/Makefile/package.json и прочий SW protocol сохраняются.
- Freshness: реальный HTTP-fresh A → origin B → новая SW install с reloadRequests сохраняет B/server-hit; default-request negative A, failed-install ready-cache/offline shell controls обязательны. HTTP86400/SWR не выдаётся за CacheStorage TTL.

## Verification Matrix

| Требование | Слой проверки | Артефакт |
|---|---|---|
| FR-1.1 split cache | статик + runtime | test блок 1 (`/assets/`/`/content/assets/` маппинги) + CI curl -I |
| FR-2.1/2.2/2.3 headers+CSP | статик + runtime | test блок 1 (5 add_header + CSP) + CI curl -I (nosniff, CSP) |
| FR-3.1 gzip (NS-6) | статик + runtime | test блок 1 (`gzip on`, `text/javascript`) + CI curl -I (Content-Encoding: gzip) |
| FR-4.1 unprivileged (NS-3) | статик + docker-smoke | test блок 2 (base image) + CI `curl /`+`/sw.js` + AC-4 (uid 101 из образа) |
| FR-5.1 test-first guard | локальный `node --test` | FAIL→PASS зафиксирован в Evidence |
| FR-5.2 runtime headers | CI docker-validation | `curl -I` набор |
| NFR-1 no external / offline | preflight e2e | `tests/e2e/app.spec.ts` зелёные |
| NS-2 (`/content/assets/` не immutable) | статик + runtime | test блок 1 (`max-age=86400`) + CI `! grep immutable` |
| NS-7 (inheritance trap) | архитектура + runtime | map-подход (0 per-location add_header) + CI curl -I на `/assets/` показывает и security, и cache |
| NS-8 (immutable не «залипает» на 404 ассетов) | статик + runtime | test блок 1 `doesNotMatch(… Cache-Control … always)` + CI `! grep cache-control` на `/assets/`-404 (security-заголовки при этом присутствуют) |

## Risks & Mitigations

| Риск | Вероятн. | Влияние | Мера |
|---|---|---|---|
| `add_header`-inheritance trap стирает security-заголовки на ассетах (NS-7) | Средняя | Дыра в security на всех `/assets/`/`/content/assets/`-ответах | `map`+единая server-level `add_header Cache-Control`; НОЛЬ per-location `add_header`; runtime curl -I на `/assets/` подтверждает security-заголовки |
| `/content/assets/` остаётся immutable (регресс сути ТЗ, NS-2) | Средняя | Картинка «залипает» на год | Статик-ассерт `max-age=86400` (падает на баговом) + runtime `! grep immutable`; test-first |
| gzip не срабатывает: `.js`→`text/javascript` в 1.29, а не `application/javascript` (NS-6) | Средняя | JS-бандлы несжаты, нет ускорения | `gzip_types` включает `text/javascript`; runtime curl -I `Content-Encoding: gzip` на JS |
| CSP ломает инлайн-стили → белый экран (NS-1) | Средняя | Белый экран | `style-src 'unsafe-inline'`; build-вывод подтвердил отсутствие инлайн-скриптов; AC-2 e2e-консоль |
| CSP вводит внешний origin → падение «no external requests» (NS-4) | Низкая | Красный e2e | CSP строго `'self'`-only (+`data:` img); e2e guard в preflight |
| unprivileged-образ не стартует / master root (NS-3) | Низкая | Контейнер не поднят / root-master | Официальный образ решает pid/user из коробки; `COPY`/`CMD`/`listen 8080` неизменны; docker-smoke + AC-4 |
| Статик-ассерты «косметические» (проходят и на баговом, и на новом) — NS-5 | Средняя | Ложная защита | FR-5.1 test-first: наблюдать FAIL на текущих `nginx.conf`/`Dockerfile`; двойной слой с реальным curl -I |
| Эталонный текст расходится с регэкспами (пробелы) | Средняя | Красные тесты | `nginx.conf`/`Dockerfile` зафиксированы символ-в-символ; регэкспы с гибкими `\s*` в маппингах; сверка на HEAD |
| Скоуп расползается в приложение/SW/хешированные пути | Средняя | Нарушение атомарности PR | Явные Out-of-scope границы плюс одно C055-FRESH install исключение; `git diff --name-only` контроль (AC-6) |
| Duplicate MIME warning от `text/html` в gzip_types | Низкая | Шумный лог nginx | `text/html` НЕ перечислен явно (сжимается неявно); ассерт `doesNotMatch(gzip_types … text/html)` |
| immutable Cache-Control «залипает» на 404 ассетов (NS-8) | Средняя | Транзиентный `/assets/*` 404 запинается в браузере как immutable даже после восстановления файла | Cache-Control-`add_header` БЕЗ `always` (эмиссия только на 2xx/3xx); security-заголовки сохраняют `always`; статик `doesNotMatch(… Cache-Control … always)` + runtime `! grep cache-control` на `/assets/`-404 |

## Architect completion-cycle055 disposition (2026-10-08)

New055 carries the shared source-map-js security-only resolution on existing214; this does not change nginx049 product scope. Preserve the single server cache map/security headers, gzip and unprivileged image. Historical local Docker pull failure is an execution checkpoint, not an accepted owner-risk decision: new full preflight, isolated real Docker header/non-root smoke and exact-current-head CI must supply the missing evidence. After that evidence exists, reconcile the issue/feedback as verified closed, retain the historical failure narrative as history, and renew original049 Architect then Analyst passes on the real effective content head before merge.055 remains in progress until217 and215 subsequently complete.

## Architect disposition: exact-head OSV brace-expansion follow-up

GitHub required OSV run37817165454 on published214 head68f1d758a1c0010b2e5ccb5b9925192152dcf09b reports six advisory matches: brace-expansion1.1.18 and5.0.9 below compatible safe floors1.1.21 and5.0.12 (GHSA-6j4f-fj2g-mc7p, GHSA-qhr7-859c-m2p7, GHSA-q2hr-2g5m-vwhr). source-map-js1.2.2 is cleared. Merge remains blocked. New055 owns this narrow shared security remediation; historical217 feature053 evidence/ownership is preserved, and both PRs later inherit one converged safe graph through main.

- C055-214-OSV2: accepted implementation task. With pinnedpnpm10.33.0, use ordinary targeted lockfile-only compatible resolution to advance both existing brace-expansion major lines independently to1.x>=1.1.21 and5.x>=5.0.12. Preserve minimatch owners/direct ranges, existing overrides/scripts/packageManager and source-map-js1.2.2. Audit every package key, snapshot, owner edge, integrity/engine/peer difference; eliminate every below-floor duplicate. No blanket override, new manifest policy, owner upgrade, forced/latest major churn or scanner suppression without exact constraint evidence and prior Architect disposition.
- C055-214-OSV2 verification: run the complete repository scan with the same OSVscannerv2.3.5 as CI using disposable anonymousDocker context before any push; inspect every reported package/advisory, not only brace-expansion, to consolidate all actual blockers. An advisory beyond this assigned graph is recorded for exact bounded Architect disposition before mutation. Zero full-scan findings, deterministic frozen-install/hash/graph evidence, appropriate full preflight and rebuilt isolated actualDocker/nginx headers/non-root/CSP behavior establish candidate readiness before publication. Keep all required CI policies unchanged and require exact-current-head green remoteOSV independently.
- C055-214-OSV2 validation: dependency content is substantive. Earlier original049 Architect/Analyst passes onaa261a7c are historical and cannot authorize the new content. Preserve real Architectreturn2/10 and Analystreturn1/5; establish one final new effective content SHA after fixes/audit/process preparation, then renew Architect first and Analyst second. New055 cumulative validation remains uninvoked until215. Do not merge published68 or guess-and-push partial dependency fixes.

### Historical conditional OSV2 verification proportionality (superseded by FRESH logic change)

PR #217 original053 already resolves brace-expansion to exact1.1.21/5.0.12; converge214 to those same compatible entries and later inherit source-map-js1.2.2 through main. Because brace-expansion is dev/build-only, the completed actualDocker154-case CSP audit may carry forward only when a fresh complete built/served artifact inventory proves shell, generated SW, hashed assets and content byte-identical to the audited runtime, and a rebuilt isolated Docker header/gzip/non-root smoke passes. A single JS hash or unchanged source file is insufficient. Any served artifact drift receives appropriate actual policy/browser verification before claiming compatibility. Full preflight, fullOSVv2.3.5 prepush scan, frozen graph/hash audit and ordered role validation on the new effective content SHA remain mandatory; no unnecessary broad CSP rerun is required once identity is proven.

### Historical conditional generated-cache-token comparison (superseded by actual changed-worker verification)

Generator inspection confirms `createServiceWorkerBody(assets, timestamp = Date.now())` emits a leading `const CACHE_NAME = "cabadrive-static-<decimal timestamp>";`. Accept normalization of that exact generated decimal cache-name field only after reporting raw SW drift and proving generator code plus executable dependency logic unchanged, complete ASSETS list and every remaining SW byte identical. Every other served shell/asset/content file must be compared raw byte-for-byte; no broad timestamp/regex normalization or executable-logic drift is authorized. This is normalized equivalence, never raw full-tree byte identity.

Require fresh rebuiltDocker worker response/policy smoke and a real service-worker install, offline reload and deferred/lazy-asset CSP smoke on the new token. The original full154-case actual nginx CSP compatibility evidence may then carry forward because the sole generated cache identifier change cannot affect policy compatibility; complete inventory and exact normalization demonstrate that boundary. Any additional drift requires explicit appropriate verification/disposition before final role pass. Full preflight/fullOSV/frozen-audit/newSHA ordered-role gates remain intact.

## Architect disposition: P1 stable-content HTTP-cache promotion

Accepted current214 P1r4222201360/PRRT_kwDOSX65IM6qewtC. Source inspection confirms generated install uses `cache.addAll(ASSETS)` strings and fetch uses indefinite cache-first `caches.match`. A new timestamp worker can copy still-fresh or stale-while-revalidate old `/content/assets/` HTTP bytes into its new release CacheStorage despite the new origin content. The nginx HTTP policy alone does not establish the claimed worker refresh; out-of-scope SW wording is not a valid rejection of this regression.

C055-214-FRESH is a narrow explicit exception owned by new055 to original nginx049's SW exclusion. Change only install request construction so stable `/content/assets/` precache requests bypass HTTP cache with `Request(...,{cache:"reload"})`, keeping one atomic `cache.addAll(requests)` and unchanged cache keys/list coverage. Applying reload to the entire install batch is also compatible and converges with215's already-implemented reload batch; choose the smaller coherent change. Preserve deferred manual exclusions, offline-ready prior cache on failed installation, feature048 response/error behavior, no external request and existing activation behavior. No URL-version migration, runtime TTL subsystem, new dependency or unrelated update protocol change is authorized.

Evidence must reproduce HTTP-fresh A bytes warmed under a real cacheable response, origin switch to B at the same stable URL without clearing/route-disabling HTTP cache, and new worker install. Baseline default request must return/promote A; fixed install reload request must hit B origin and store exact B bytes. A meaningful generated-worker execution test may model the browser cache semantics, but actual same-origin browser/server hit evidence is required for the HTTP-cache boundary. Add failed install/atomic cache and offline fallback controls; preserve hashed/deferred coverage. Never use Playwright routing that silently disables HTTP cache for the freshness regression.

Documentation must distinguish nginx HTTP86400/SWR policy from release-snapshot CacheStorage: new online worker installation refreshes current origin bytes, while offline/unchanged-worker cache-first snapshots have no wall-clock24h TTL. Remove unqualified blanket24h claims rather than pretending headers govern CacheStorage. This is truthful clarification of existing local-first behavior, not weakening new-release freshness acceptance.

Current Context7MDN `/mdn/content` documents Cache.addAll accepting Request objects and fetching them; primary Request.cache documentation states reload bypasses the HTTP cache and updates it. Sources: https://developer.mozilla.org/en-US/docs/Web/API/Cache/addAll and https://developer.mozilla.org/en-US/docs/Web/API/Request/cache .215 implementation independently confirms its modern protocol already constructs reload Requests and atomically caches them before marker/activation; preserve that during integration. Historical215A fixture remains the genuine old stringaddAll/excludedmanual worker, not silently repaired.

Consolidate with current brace/security remediation before renewed full preflight/rebuilt real Docker+appropriate CSP/SW browser verification and fullOSVscan. A running earlier preflight is superseded by changed generator; stop only the assigned own process safely or treat results as preliminary. Substantive generated-worker change invalidates cache-token-only carry-forward equivalence; obtain real changed-worker policy/offline/freshness evidence. Renew ordered roles on one final new effectiveSHA; real Architectreturn3/10 and Analystreturn1/5 remain recorded.


## Current214 engineering handoff

OSV2/FRESH implemented and verified: both compatible safe brace lines and source-map-js, fullscanner241/0, frozen audit, fullpreflight556/160 and actual rebuiltDocker headers/nonroot/changedSWCSP-offline-lazy checks. Prior cache-token-only comparison conditions are historical; actual install logic changed and received real regression evidence. No engineering follow-up remains. Commit final content/process preparation, independently review its exact SHA, then renew original049 Architect-before-Analyst passes with retained returns3/10 and1/5; live remote gates/guard/merge remain mandatory. Cumulative055 stays in progress through217/215.
