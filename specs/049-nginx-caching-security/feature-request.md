# Feature Request: nginx — исправление кеш-политики, security-заголовки, gzip и unprivileged-образ (ТЗ-14)

## Intake Metadata

- Feature ID: `049-nginx-caching-security`
- Роль intake: Analyst
- Назначенный worktree: `/Users/chap/devel/cabadrive-claude/repo/.claude/worktrees/049-nginx-caching-security`
- Назначенная ветка: `claude/049-nginx-caching-security`
- Verified base от Orchestrator: `origin/main` = `c5520b31922c0e45afd96b2e5877136c1848a541` (merge PR #213, ТЗ-13 шаг 1 — баги fetch-обработчика SW).
- Подтверждение базы при intake: локальный `HEAD` worktree = `c5520b31922c0e45afd96b2e5877136c1848a541` = назначенный base; дерево чистое до записи этого артефакта (`git status --short` пуст).
- Дата intake: 2026-07-24
- Parallel-work warning: возможна параллельная работа других агентов в соседних worktree/ветках/PR. Их dirty diffs, ветки, коммиты, PR и процессную память сохранять; не мутировать.
- Scope Analyst: только этот intake-артефакт. Никаких `spec.md`, `plan.md`, `tasks.md`, кода, тестов, коммитов, push, PR, ревью, мержей.

## Исходный запрос и выбор приоритета

Владелец репозитория попросил (по-русски): «Выбери в improvements в порядке приоритета самую важную нереализованную доработку и реализуй». Значит — взять высший по приоритету нереализованный пункт `docs/improvements/` в рекомендованном порядке и реализовать его по гайдлайнам проекта.

По «Рекомендуемой последовательности» этапа 1 (`docs/improvements/README.md`, строка 47: «…ТЗ-P1 слайсы 1–2 (потеря данных, поверх store), ТЗ-13 шаг 1 (баги fetch SW), **ТЗ-14 (nginx)**») уже реализованы предшествующие пункты этапа 1: ТЗ-22 (#208), ТЗ-16 (#209), ТЗ-06 (#210), ТЗ-P1 слайс 1 (#211), ТЗ-P1 слайс 2 (#212), ТЗ-13 шаг 1 (#213). Следующий и **последний** нереализованный пункт этапа 1 — **ТЗ-14 (nginx)** — из durable-спецификации `docs/improvements/14-nginx-caching-security.md` (приоритет P1, категория «Инфраструктура / безопасность», оценка трудоёмкости S).

Данный intake оформляет **весь ТЗ-14 как один work cycle**: одна ветка, один PR. ТЗ-14 небольшой (оценка S, затрагивает три файла: `nginx.conf`, `Dockerfile`, `tests/docker-runtime.test.mjs`) и внутренне связный — кеш-политика, security-заголовки, сжатие и unprivileged-образ проверяются одними и теми же приёмочными механизмами (`curl -I` в docker-runtime/CI-smoke, e2e «no external requests»), поэтому разбивать на слайсы не требуется. Architect вправе при необходимости выделить CSP-enforce отдельным шагом внутри цикла (см. Допущения A2), но по умолчанию это один PR.

## Контекст продукта и проблема

Cabadrive — статический local-first React/Vite тренажёр теории вождения CABA для русскоязычных пользователей; бэкенда нет, приложение спроектировано как оффлайн-способная PWA и раздаётся статикой через nginx в Docker-образе. Весь runtime-конфиг nginx — это `nginx.conf` (сейчас 20 строк / ~370 байт), копируемый в образ как `/etc/nginx/conf.d/default.conf` (`Dockerfile:15`).

ТЗ-14 фиксирует четыре связанные инфраструктурные/security-проблемы текущего `nginx.conf`/`Dockerfile`. Факты по текущему коду (проверены на base `c5520b31`; номера строк актуальны на этом HEAD — исполнитель обязан перепроверять их на своём HEAD):

- **Проблема №1 — инвертированная (перепутанная) кеш-политика.** `location /content/assets/` отдаётся с `add_header Cache-Control "public, max-age=31536000, immutable"` (`nginx.conf:11-14`), хотя пути под `/content/assets/` **НЕ хешированные**: `assetUrl()` в `src/data/content.ts:383-385` просто префиксует слэш (`return \`/${localPath}\``), то есть фото билетов/кропы/картинки вопросов живут под стабильными именами вроде `page-001.jpg`. Пере-загруженная под тем же путём картинка не доедет до клиентов **год**: даже смена имени SW-кеша не поможет, потому что новый прекеш-`fetch` удовлетворится из HTTP-кеша браузера теми же устаревшими `immutable`-байтами. При этом действительно immutable хешированные Vite-бандлы `/assets/*-<hash>.js|css` **не имеют явного `Cache-Control` вовсе** — в `nginx.conf` нет `location /assets/` (есть только `location /`, `location /content/assets/`, `location /sw.js`), то есть immutable-заголовок стоит ровно на тех путях, где он вреден, и отсутствует там, где уместен.
- **Проблема №2 — нет security-заголовков.** CSP, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` полностью отсутствуют — во всём `nginx.conf` нет ни одного security-заголовка. Приложение при этом local-first и не делает внешних запросов (закреплено e2e «process guide stays local-first without external requests…», `tests/e2e/app.spec.ts:1918-1934`), поэтому уместна максимально строгая `'self'`-only CSP.
- **Проблема №3 — нет сжатия.** `gzip` в конфиге не включён; мегабайтные JSON-несущие JS-чанки (контент манула/вопросов) отдаются несжатыми — прямое замедление первой загрузки и установки оффлайна. Brotli в стоковом alpine-образе недоступен (нет `ngx_brotli`) — кастомную сборку ради него не городим.
- **Проблема №4 — образ под root.** Runtime-стадия — `FROM nginx:1.29-alpine` (`Dockerfile:13`): master-процесс nginx работает от root. Порт уже `8080` (`Dockerfile:18` `EXPOSE 8080`, `nginx.conf:2` `listen 8080`), что совместимо с unprivileged-образом из коробки.

Приёмка ТЗ-14 опирается на два существующих механизма: (а) docker-контрактные проверки — сейчас `tests/docker-runtime.test.mjs` статически проверяет только текст `docker-compose.yml`/`Makefile`/docs (`tests/docker-runtime.test.mjs:16-53`) и **не делает** реальных HTTP-проверок заголовков; реальный runtime-smoke живёт в CI-джобе `docker-validation` (`.github/workflows/ci.yml:100-129`, curl `/` на строке 119 и curl `/sw.js` на строке 125); (б) e2e-контракт «no external requests» (`tests/e2e/app.spec.ts`, тесты на строках 1918-1934, а также ~2223 и ~2307), который CSP не должна ломать введением внешнего origin.

## Цель

nginx перестаёт «замораживать» перезагруженный контент под нехешированными путями и корректно инвалидирует его в пределах суток, при этом честно immutable-кеширует хешированные Vite-бандлы; статический SPA получает базовый security-профиль (строгая `'self'`-only CSP + стандартные защитные заголовки), не ломающий local-first-контракт «no external requests»; текстовые ответы (HTML/JS/JSON/CSS/SVG) отдаются сжатыми gzip; nginx запускается из официального unprivileged-образа (master не под root) на уже используемом порту 8080. Изменения закреплены расширенным docker-контрактным тестом (`curl -I`: immutable на `/assets/`, `nosniff`, CSP, `Content-Encoding: gzip`), а e2e «no external requests» и офлайн-сценарии остаются зелёными.

## Scope

В scope (весь ТЗ-14, три файла — `nginx.conf`, `Dockerfile`, `tests/docker-runtime.test.mjs`):

- **FR-1 (кеш-политика — split по типу пути).** В `nginx.conf` развести кеширование: `location /assets/` (хешированные Vite-бандлы `*-<hash>.js|css`) → `Cache-Control: public, max-age=31536000, immutable`; `location /content/assets/` (нехешированные картинки) → `Cache-Control: public, max-age=86400, stale-while-revalidate=604800`. Убрать ошибочный `immutable` с `/content/assets/` (`nginx.conf:11-14`). Существующие `location /` (`try_files … /index.html`) и `location /sw.js` (`no-cache`) сохраняются.
- **FR-2 (security-заголовки).** Добавить `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (камера/микрофон/геолокация выключены) и строгую CSP: `default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'`. До включения CSP в enforce провести аудит инлайн-стилей/скриптов (grep `style=`/`onload=`/inline `<script>` в `index.html` и в сборке).
- **FR-3 (gzip).** `gzip on` для `text/html`, `application/javascript`, `application/json`, `image/svg+xml`, `text/css`, с `gzip_min_length 1024` и `gzip_comp_level 6`. Brotli — вне scope (нет `ngx_brotli` в стоковом alpine; кастомную сборку не делаем).
- **FR-4 (unprivileged-образ).** Runtime-стадию `Dockerfile` перевести на `nginxinc/nginx-unprivileged:1.29-alpine` (`Dockerfile:13`). Порт 8080 уже используется — совместимо.
- **FR-5 (расширение docker-контрактного теста).** Расширить проверку заголовков через `curl -I` (immutable на `/assets/`, `nosniff`, CSP, `Content-Encoding: gzip` при `Accept-Encoding`). Способ реализации (расширить статический `tests/docker-runtime.test.mjs` реальным HTTP-запросом к поднятому образу и/или добавить проверки в CI-джобу `docker-validation` `ci.yml:100-129`) фиксирует Architect — см. Допущения A5; пользовательская гарантия — заголовки объективно подтверждаются на работающем образе.
- **NFR-1.** e2e «no external requests» (`tests/e2e/app.spec.ts:1918-1934` и параллельные) и офлайн-сценарии остаются зелёными.
- Тесты на новое поведение и прогон существующего набора (`node --test`, docker-контракт, e2e, гейты качества).

Вне scope (явно исключается):

- **Переход на хешированные пути картинок** (`/content/img/`, ТЗ-P3 «image quality»). ТЗ-14 корректно кеширует **текущие** нехешированные `/content/assets/` как «свежие ≤24 ч»; честный immutable для картинок появится позже, когда ТЗ-P3 введёт хешированные пути. `assetUrl()`/`src/data/content.ts` в этом цикле **не меняются**.
- **Brotli / кастомная сборка nginx с `ngx_brotli`.** Явно отложено (FR-3): только gzip на стоковом unprivileged-alpine.
- **Изменения приложения, роутинга, схемы SW-кеша, прекеша, `public/sw.js`, `src/main.tsx`, `src/App.tsx`, генератора SW.** ТЗ-14 — чисто инфраструктурный слой раздачи (nginx/Docker) плюс его контрактный тест.
- **HSTS / TLS-заголовки.** Образ раздаёт по HTTP на :8080 за внешним прокси/без TLS в этом контуре; `Strict-Transport-Security` не вводится (нет требования в ТЗ-14 и нет TLS-термінации в образе). Architect вправе зафиксировать это как явное решение.
- **Новые зависимости, изменения деплой-пайплайна вне `Dockerfile`/`nginx.conf`/docker-контрактного теста.**

## Функциональные требования

1. **Split кеш-политики.** `nginx.conf` содержит `location /assets/` c `Cache-Control: public, max-age=31536000, immutable` (хешированные Vite-бандлы) и `location /content/assets/` c `Cache-Control: public, max-age=86400, stale-while-revalidate=604800` (нехешированные картинки). Ошибочный `immutable` на `/content/assets/` (текущие `nginx.conf:11-14`) удалён. `location /` (`try_files $uri $uri/ /index.html`) и `location /sw.js` (`Cache-Control: no-cache`) сохранены функционально.
2. **Security-заголовки на отдаваемых ответах.** Присутствуют `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` с выключенными camera/microphone/geolocation, и CSP ровно вида `default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'`. CSP не содержит ни одного внешнего origin/CDN (`'self'`-only + `data:` для картинок), чтобы не ломать e2e «no external requests».
3. **gzip.** `gzip on` активен для `text/html`, `application/javascript`, `application/json`, `image/svg+xml`, `text/css`; `gzip_min_length 1024`; `gzip_comp_level 6`. При запросе с `Accept-Encoding: gzip` ответ на текстовый ресурс (например, JS-чанк) содержит `Content-Encoding: gzip`.
4. **unprivileged-образ.** Runtime-стадия `Dockerfile` — `nginxinc/nginx-unprivileged:1.29-alpine`; контейнер стартует и обслуживает на `:8080`; master-процесс nginx **не** под root. Пути копирования конфига/статики и запуск скорректированы под unprivileged-образ, если требуется (официальный образ решает pid/read-пути из коробки).
5. **CSP не ломает рендер SPA.** `style-src 'unsafe-inline'` оставлен под runtime-инлайн-стили Vite/React; `script-src 'self'` совместим с текущим `index.html`, где единственный скрипт — внешний модуль `<script type="module" src="/src/main.tsx">` (`index.html:11`), инлайн-скриптов/`on*`-хендлеров нет. До enforce проведён аудит (grep `style=`/`onload=`/inline `<script>`); отсутствие CSP-violation подтверждено консолью браузера на полном e2e-прогоне против Docker-образа.
6. **Расширенный docker-контрактный тест.** Контрактная проверка объективно подтверждает на работающем образе: `immutable` на `/assets/`, `X-Content-Type-Options: nosniff`, наличие CSP-заголовка, `Content-Encoding: gzip` при `Accept-Encoding: gzip`. Существующие проверки `tests/docker-runtime.test.mjs` (project-scoped контейнеры, host-порт, docs-flows — строки 16-53) и текущий CI-smoke `docker-validation` (curl `/` и `/sw.js`, `ci.yml:119,125`) остаются зелёными.
7. **NFR-1 сохранён.** e2e «no external requests» (`tests/e2e/app.spec.ts:1918-1934` и параллельные ~2223/~2307) и офлайн-сценарии остаются зелёными: CSP `'self'`-only не вводит внешний origin, кеш-политика не ломает офлайн-прекеш.

## Ожидания приёмки

- **AC-1 (заголовки — из ТЗ-14 §5).** `curl -I` подтверждает все заголовки FR-1..FR-3 на работающем образе (immutable на `/assets/`, отсутствие immutable на `/content/assets/` с `max-age=86400`+`stale-while-revalidate`, `nosniff`/`X-Frame-Options`/`Referrer-Policy`/`Permissions-Policy`/CSP, `Content-Encoding: gzip` при `Accept-Encoding`). Закреплено docker-контрактным тестом (FR-5).
- **AC-2 (CSP — из ТЗ-14 §5).** Консоль браузера без CSP-violation на всех экранах при полном e2e-прогоне против Docker-образа (аудит инлайн-стилей/скриптов проведён до enforce).
- **AC-3 (инвалидация контента — из ТЗ-14 §5).** Изменённая картинка под нехешированным путём `/content/assets/` доезжает до клиента ≤ 24 ч (осмотр заголовков `Cache-Control: max-age=86400`+`stale-while-revalidate`; отдельная сценарная проверка не требуется).
- **AC-4 (unprivileged — из ТЗ-14 §5).** В работающем контейнере nginx-процессы **не** под root (`docker compose exec` / инспекция процессов); контейнер стартовал и обслуживает на :8080.
- **NFR-1.** e2e «no external requests» и офлайн-сценарии зелёные; CSP не вводит внешний origin.
- Гейты `pnpm run quality:fast`, `pnpm run format:check`, `pnpm run preflight` (плюс Docker-контрактные проверки для runtime-affecting изменения) зелёные; в PR записаны фактические свидетельства верификации (`curl -I`-вывод, docker-тест, e2e), а не только AI-резюме. Свидетельства фиксируются последующими ролями (Implementation/Architect), не Analyst-intake.
- Диф ограничен `nginx.conf`, `Dockerfile`, `tests/docker-runtime.test.mjs` (+ при необходимости CI-джоба `docker-validation` в `.github/workflows/ci.yml` для реального header-smoke и синхронизация durable devops-документации `docs_project/project/devops/docker-runtime.md`, если она описывает заголовки/образ). Приложение, SW, роутинг, контент не изменены.

## Негативные сценарии (обязательные для feature memory)

- **NS-1 — строгая CSP ломает инлайн-стили Vite/React → белый экран.** Vite/React в рантайме инжектируют инлайн-стили; CSP без `style-src 'unsafe-inline'` заблокировала бы их и дала бы белый экран/поломанную вёрстку. Мера: `style-src 'unsafe-inline'` оставлен в CSP; перед переводом CSP в enforce проведён аудит консоли браузера (grep инлайн-стилей/скриптов + полный e2e-прогон без CSP-violation). Проверяемо: AC-2 (ноль CSP-violation на всех экранах). Инлайн-скриптов в `index.html` нет (`index.html:11` — только внешний module-скрипт), поэтому `script-src 'self'` безопасен и в CSP **не** добавляется `'unsafe-inline'` для скриптов.
- **NS-2 — `/content/assets/` НЕ должен отдаваться `immutable` (регресс-guard, суть ТЗ).** Главный смысл ТЗ-14: нехешированная перезагруженная картинка не должна «залипать» на год. Ответ на `/content/assets/…` обязан содержать `max-age=86400`+`stale-while-revalidate=604800` и **НЕ** содержать `immutable`. Проверяемо: docker-контрактный `curl -I` на пути `/content/assets/` показывает отсутствие `immutable` и корректный `max-age`; параллельно `/assets/` (хешированные бандлы) показывает `immutable`. Тест обязан падать на текущем (баговом) конфиге, где `/content/assets/` = `immutable`.
- **NS-3 — unprivileged-образ не стартует / master под root.** Переход на `nginxinc/nginx-unprivileged` меняет pid/read-пути и дефолтного пользователя; при неверной адаптации `Dockerfile`/конфига контейнер может не подняться или nginx-master останется под root. Мера: официальный образ решает пути из коробки; docker-контрактный smoke обязан подтвердить старт и обслуживание на :8080, а AC-4 — что master-процесс не под root. Проверяемо: контейнер отвечает на `curl /` и `/sw.js`; инспекция процессов показывает не-root.
- **NS-4 — security-заголовки вводят внешний origin и ломают e2e «no external requests».** Если в CSP попадёт CDN/внешний хост (например, для шрифтов/аналитики), local-first-контракт `tests/e2e/app.spec.ts:1918-1934` (и параллельные) упадёт: `externalRequests` перестанет быть пустым. Мера: CSP строго `'self'`-only (+`data:` для `img-src`), никаких внешних директив; e2e «no external requests» остаётся зелёным как guard. Проверяемо: NFR-1 (e2e зелёный) + инспекция текста CSP (нет `http(s)://`-origin).

## Допущения и default-ответы на открытые вопросы

Пользователь недоступен для Q&A; зафиксированы явные допущения. Architect может уточнить их в `spec.md` без изменения пользовательских гарантий; конфликт с гарантиями — блокер через Orchestrator.

- **A1. Точная форма `Cache-Control` для `/content/assets/`.** Default: `public, max-age=86400, stale-while-revalidate=604800` дословно по ТЗ-14 §3 FR-1. Синтаксис `add_header` (`always` vs условный, порядок при наследовании локаций) — за Architect, при условии, что итоговый заголовок на пути соответствует FR-1 и NS-2.
- **A2. CSP report-only перед enforce.** Default: локально можно прогнать CSP в report-режиме (консоль браузера на полном e2e) и затем перевести в enforce (ТЗ-14 §4 план, шаг 2). В финальном образе CSP — **enforce** (не report-only), чтобы AC-1/AC-2 закрывались реально. Решение о промежуточном report-only-шаге и о том, отдельный ли это коммит внутри одного PR, — за Architect.
- **A3. Директивы CSP — дословно из ТЗ-14.** Default: `default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'`. Добавление `object-src 'none'`/`form-action 'self'` возможно только как усиление, не ослабляющее гарантии и не вводящее внешний origin, — с явным обоснованием Architect. `'unsafe-inline'` для `script-src` **не** добавляется (инлайн-скриптов нет).
- **A4. `Permissions-Policy` — набор фич.** Default: как минимум `camera=(), microphone=(), geolocation=()` (выключены), дословно по ТЗ-14 §3 FR-2. Расширение списка выключаемых фич — на усмотрение Architect, без ослабления.
- **A5. Реализация header-проверки (FR-5).** Default: расширить контрактную проверку так, чтобы `curl -I` на работающем образе объективно подтверждал заголовки. Текущий `tests/docker-runtime.test.mjs` — статический (проверяет текст compose/Makefile/docs, `16-53`) и не поднимает контейнер; реальный runtime-smoke сейчас в CI-джобе `docker-validation` (`ci.yml:100-129`). Architect решает, где живёт header-smoke: расширить `docker-runtime.test.mjs` реальным HTTP-запросом к поднятому образу, и/или добавить `curl -I`-проверки заголовков в `docker-validation`-джобу. Пользовательская гарантия неизменна: заголовки подтверждаются на работающем образе, а не только по тексту конфига.
- **A6. unprivileged-образ и `Dockerfile`.** Default: сменить только runtime-`FROM` на `nginxinc/nginx-unprivileged:1.29-alpine` и, при необходимости, адаптировать путь копирования конфига/статики и запуск под дефолтного не-root пользователя образа. Порт остаётся 8080 (уже `EXPOSE 8080`/`listen 8080`). Build-стадия (`node:22-alpine`) не меняется.
- **A7. HSTS/TLS вне scope.** Default: `Strict-Transport-Security` не вводится (образ раздаёт по HTTP :8080; TLS-термінация — вне этого образа). Зафиксировать как явное решение, если Architect сочтёт нужным.
- **A8. Синхронизация durable-документации.** Default: если `docs_project/project/devops/docker-runtime.md` (или иная durable devops-документация) описывает образ/порт/заголовки, затрагиваемые этим изменением, синхронизировать её в рамках цикла; иначе — правок доков нет. Отметка выполненности пунктов плана в чекбоксах `docs/improvements/14-nginx-caching-security.md` §4 — на усмотрение Architect (в предыдущих циклах статус-поля/чекбоксы ТЗ не всегда обновлялись — зафиксировать решение).
- **A9. Номера строк.** Все ссылки на строки в этом документе проверены на base `c5520b31`; исполнитель обязан перепроверять их на своём HEAD.

## Риски и меры

| Риск | Вероятн. | Влияние | Мера |
|---|---|---|---|
| Строгая CSP ломает инлайн-стили Vite/React → белый экран | Средняя | Белый экран / поломанная вёрстка | `style-src 'unsafe-inline'` оставлен; аудит консоли (grep инлайн + полный e2e) до enforce; AC-2 = ноль CSP-violation (NS-1) |
| `/content/assets/` остаётся `immutable` (регресс сути ТЗ) | Средняя | Перезагруженная картинка «залипает» на год | docker-контрактный `curl -I` guard: `/content/assets/` без `immutable`, с `max-age=86400`+`stale-while-revalidate`; тест падает на текущем конфиге (NS-2) |
| unprivileged-образ не стартует / master под root | Низкая | Контейнер не поднимается или root-master | Официальный образ решает pid/read-пути из коробки; docker-smoke ловит старт+:8080; AC-4 проверяет не-root (NS-3) |
| Security-заголовки вводят внешний origin и рушат «no external requests» | Низкая | Падение e2e local-first-контракта | CSP строго `'self'`-only (+`data:` img); e2e «no external requests» как guard остаётся зелёным (NS-4) |
| Header-проверка «косметическая» (по тексту конфига, не на живом образе) | Средняя | Ложное чувство защиты | FR-5: `curl -I` на работающем образе (docker-runtime и/или CI `docker-validation`); тест обязан падать на текущем баговом конфиге (A5) |
| gzip настроен, но не срабатывает (тип/`min_length`) | Низкая | Нет ускорения первой загрузки | Явный список типов + `gzip_min_length 1024`; contract-проверка `Content-Encoding: gzip` при `Accept-Encoding` на JS-чанке (FR-3, AC-1) |
| Скоуп «расползается» в хешированные пути картинок/приложение/SW | Средняя | Рост риска, нарушение атомарности PR | Явные Вне-scope границы; диф ограничен `nginx.conf`/`Dockerfile`/`docker-runtime.test.mjs` (+CI-джоба/devops-доки при необходимости) |

## Источники

- `docs/improvements/14-nginx-caching-security.md` — авторизованная владельцем durable-спецификация ТЗ-14: контекст/проблема (§1, строки 11-16), цели (§2), требования FR-1..FR-5/NFR-1 (§3, строки 24-29), план (§4, строки 33-36), критерии приёмки AC-1..AC-4 (§5, строки 40-43), риски (§6), затрагиваемые файлы (§7, строка 54), связанные ТЗ (§8).
- `docs/improvements/README.md` — «Рекомендуемая последовательность» этапа 1 (строка 47): ТЗ-14 (nginx) — последний нереализованный пункт этапа 1 после ТЗ-13 шаг 1.
- `nginx.conf` — текущий конфиг (20 строк): `listen 8080` (2), `location /`→`try_files … /index.html` (7-9), ошибочный `location /content/assets/` c `immutable` (11-14), `location /sw.js`→`no-cache` (16-19); `location /assets/` отсутствует (хешированные бандлы без явного `Cache-Control`).
- `Dockerfile` — build-стадия `node:22-alpine` (1), runtime `FROM nginx:1.29-alpine` (13, → unprivileged), `COPY nginx.conf /etc/nginx/conf.d/default.conf` (15), `COPY --from=build /app/dist …` (16), `EXPOSE 8080` (18), `CMD ["nginx","-g","daemon off;"]` (20).
- `src/data/content.ts` — `assetUrl(localPath)` возвращает `\`/${localPath}\`` (383-385): подтверждает, что `/content/assets/` пути нехешированные (обоснование FR-1/NS-2).
- `tests/docker-runtime.test.mjs` — текущие статические контрактные проверки compose/Makefile/docs (16-53); реальных HTTP-проверок заголовков нет (расширяется под FR-5).
- `.github/workflows/ci.yml` — джоба `docker-validation` (100-129): `make build`/`make up`, runtime-smoke `curl /` (119) и `curl /sw.js` (125), `make down` (129); кандидат на добавление `curl -I` header-smoke (A5).
- `tests/e2e/app.spec.ts` — e2e «no external requests» local-first-контракт (тест 1918-1934: `externalRequests` фильтр по hostname 1925, `expect([]).toEqual` 1934; параллельные проверки ~2223, ~2307) — guard NFR-1/NS-4.
- `index.html` — единственный скрипт `<script type="module" src="/src/main.tsx">` (11), инлайн-скриптов/`on*`-хендлеров/инлайн-стилей нет: обоснование `script-src 'self'` без `'unsafe-inline'` (FR-2/NS-1).
- `docker-compose.yml`, `Makefile` — build/up/down/логи, host-порт `${CABADRIVE_HOST_PORT:-5173}:8080`: контекст запуска образа для контрактной приёмки.
- `CLAUDE.md`, `AGENTS.md` (раздел Analyst), процессная память quality gates — процессные границы, гейты (`quality:fast`, `format:check`, `preflight`, Docker-контракт).
- Внешние исследования не требовались: требования полностью определены в авторизованной владельцем durable-спецификации улучшений (ТЗ-14). Заголовки CSP/`Cache-Control`/`gzip`-директивы и образ `nginxinc/nginx-unprivileged` — стандартные примитивы nginx/HTTP, заданные прямо в §3 ТЗ-14.

## Границы ролей и handoff

- Analyst создал только этот intake-артефакт и передаёт управление Orchestrator.
- Architect создаёт `spec.md`, `plan.md`, `tasks.md`: финализирует форму `Cache-Control`/локаций (A1), стратегию CSP report→enforce и её оформление в PR (A2), точный набор CSP-директив (A3) и `Permissions-Policy` (A4), место и способ header-проверки FR-5 (A5), адаптацию `Dockerfile` под unprivileged (A6), решение по HSTS (A7) и durable-докам/чекбоксам плана (A8), матрицу верификации и cycle PR set. Architect подтверждает, что новый header-контрактный тест падает на текущем баговом конфиге (NS-2).
- Implementation Agent работает только по полной feature memory в назначенном worktree/ветке/PR-слайсе; меняет `nginx.conf`, `Dockerfile`, `tests/docker-runtime.test.mjs` (+ при необходимости `ci.yml` `docker-validation` и devops-доки); фиксирует фактические свидетельства (`curl -I`-вывод, docker-контракт, e2e, гейты) и feedback для диспозиции Architect. Не мержит.
- Review Agent проверяет диф и соответствие feature memory без правок кода: корректность split кеш-политики (immutable только на `/assets/`, не на `/content/assets/` — NS-2), полноту и `'self'`-only-строгость security-заголовков/CSP (NS-1/NS-4), gzip-типы, unprivileged-переход (NS-3), реальную сторожевую силу header-теста, отсутствие расползания scope в приложение/SW/хешированные пути.
- Orchestrator ведёт PR, проверки, финальные валидации Architect→Analyst, guard текущего/effective head и merge; cleanup — только назначенный Cleanup Agent.

## Initial Cycle Context

На момент intake PR по этому фичеру не существует. Handoff-контекст Analyst: ветка `claude/049-nginx-caching-security` в `/Users/chap/devel/cabadrive-claude/repo/.claude/worktrees/049-nginx-caching-security` от verified `origin/main` `c5520b31922c0e45afd96b2e5877136c1848a541` (= merge PR #213, ТЗ-13 шаг 1 уже смержен). Локальный HEAD worktree подтверждён равным этому base, дерево чистое. Orchestrator может явно продолжить этот latest-main контекст как единственный implementation PR slice либо назначить отдельный свежий worktree; любой дополнительный слайс фиксируется в feature memory. ТЗ-14 — последний нереализованный пункт этапа 1 «критическое» (`docs/improvements/README.md` строка 47); после его мержа этап 1 завершён.

## Final Analyst Validation Notes

_(Заполняется на финальной валидации Analyst, инициируемой Orchestrator.)_
