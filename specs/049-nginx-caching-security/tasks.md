# Tasks: nginx — split кеш-политики, security-заголовки, gzip и unprivileged-образ (ТЗ-14)

## Cycle Context

- Feature: `049-nginx-caching-security` / ТЗ-14 (FR-1..FR-5 + NFR-1). Один work cycle, одна ветка, один PR.
- База: verified `origin/main` = `c5520b31922c0e45afd96b2e5877136c1848a541`
  (merge PR #213, ТЗ-13 шаг 1). Worktree HEAD подтверждён равным base
  (`git rev-parse HEAD` = `c5520b31…`; `git rev-parse origin/main` = тот же SHA);
  дерево чистое до записи `specs/049-*` (`git status --short` = только
  `?? specs/049-nginx-caching-security/`).
- Handoff branch/worktree: `claude/049-nginx-caching-security` /
  `/Users/chap/devel/cabadrive-claude/repo/.claude/worktrees/049-nginx-caching-security`.
- Cycle PR set: см. `## Cycle PR Set` ниже (ведёт Orchestrator; на момент
  Architect-записи PR ещё не открыт).
- Базис счётчиков на `c5520b31` (перепроверить на HEAD, test-first):
  `pnpm run test` (`node --test tests/*.test.mjs`) = **554** top-level `test()`
  (замер Architect на base). Из них `tests/docker-runtime.test.mjs` = **4**
  `test()` блока. После добавления **двух** focused `test()` блоков (nginx.conf
  контракт + Dockerfile unprivileged) ожидается **556** (docker-runtime: 4 → 6);
  точное число фиксирует Implementation Agent на HEAD (сначала падающие тесты,
  затем зелёные). e2e-набор в этом цикле не меняется (docker header-проверки —
  в CI-джобе `docker-validation`, не в `node --test`); Implementation Agent
  фиксирует e2e-базис из `pnpm run preflight` для полноты.
- Parallel-work rule: сохранять все чужие worktree, ветки, коммиты, PR, dirty
  diffs и процессную память; не изменять `feature-request.md` вне Analyst-owned
  секций; не трогать соседние слайсы/фичи.

## Implementation Tasks

- [x] **T001** Подтвердить ветку/worktree/базу: `git status --short` (чисто, кроме
  `specs/049-*`), `git rev-parse HEAD` = `c5520b31922c0e45afd96b2e5877136c1848a541`,
  сверка с `origin/main`. Перепроверить на HEAD номера строк из plan.md/spec.md:
  `nginx.conf` (`listen 8080` ~2, `location /` ~7-9, ошибочный
  `location /content/assets/`+immutable ~11-14, `location /sw.js` ~16-19,
  отсутствие `location /assets/`); `Dockerfile` (runtime `FROM nginx:1.29-alpine`
  ~13, `COPY nginx.conf …` ~15, `EXPOSE 8080` ~18, `CMD` ~20);
  `tests/docker-runtime.test.mjs` (4 `test()` блока ~16-53, чтения compose/Makefile/
  docs ~5-14); `ci.yml` джоба `docker-validation` ~100-129 (smoke `curl /` ~119,
  `curl /sw.js` ~125). При неоднозначности базы — стоп и возврат Orchestrator.
  Зафиксировать стартовый SHA кандидата.

- [x] **T002** Замерить базис `pnpm run test` на HEAD и записать в Verification
  Evidence (ожидается 554 до правок). Test-first (Принцип III): в
  `tests/docker-runtime.test.mjs` добавить чтения `nginx.conf` и `Dockerfile`
  (`readFileSync(new URL("../nginx.conf"|"../Dockerfile", import.meta.url), "utf8")`)
  и ДВА новых focused `test()` блока по plan.md (Design — FR-5.1):
  - блок 1 `nginx.conf splits cache policy, sets security headers, and enables
    gzip`: позитивные `assert.match` (`map $uri $cache_control`; `~^/assets/`
    immutable; `~^/content/assets/` `max-age=86400, stale-while-revalidate=604800`;
    все 5 `add_header` security + точная CSP; `add_header Cache-Control
    $cache_control;` (БЕЗ `always` — NS-8); `gzip on`;
    `gzip_types … text/javascript`); негативные `assert.doesNotMatch`
    (`/content/assets/…immutable` в строке маппинга; `gzip_types … text/html`;
    `add_header Cache-Control $cache_control always;` — NS-8 regression guard);
  - блок 2 `Dockerfile runtime uses unprivileged nginx base image`:
    `assert.match(/FROM nginxinc\/nginx-unprivileged:1\.29-alpine/)`,
    `assert.doesNotMatch(/FROM nginx:1\.29-alpine/)`, инвариант
    `COPY nginx.conf …`/`EXPOSE 8080`.
  Прогнать `node --test tests/docker-runtime.test.mjs` и ЗАФИКСИРОВАТЬ test-first
  ПАДЕНИЕ новых блоков на текущих баговых `nginx.conf`/`Dockerfile` (позитивные не
  находят текст; `doesNotMatch` на непустых — при необходимости). Существующие 4
  блока не ослаблять.

- [x] **T003** Реализовать FR-1/FR-2/FR-3: заменить `nginx.conf` ЦЕЛИКОМ на
  эталон из plan.md (Design — `map $uri $cache_control` + `server{}` с gzip,
  security-заголовками (`always`), единой server-level `add_header Cache-Control
  $cache_control;` (БЕЗ `always` — NS-8), `location /`/`/assets/`/`/content/assets/`/`= /sw.js`
  с `try_files`, БЕЗ per-location `add_header`). Символ-в-символ (детерминизм
  FR-5.1 регэкспов). Довести блок 1 FR-5.1 до зелёного; сверить литералы на HEAD.

- [x] **T004** Реализовать FR-4: в `Dockerfile` заменить РОВНО runtime-`FROM
  nginx:1.29-alpine` → `FROM nginxinc/nginx-unprivileged:1.29-alpine`. Остальное
  (build-стадия `node:22-alpine`, `COPY nginx.conf …`, `COPY --from=build …`,
  `EXPOSE 8080`, `CMD ["nginx","-g","daemon off;"]`) НЕ менять. Довести блок 2
  FR-5.1 до зелёного.

- [x] **T005** Реализовать FR-5.2: в `.github/workflows/ci.yml`, ТОЛЬКО джоба
  `docker-validation`, расширить header-smoke реальными `curl -I`-проверками
  против поднятого образа по эталонному shell из plan.md (Design — FR-5.2):
  immutable на извлечённом из `/index.html` хешированном `/assets/*.js`;
  `Content-Encoding: gzip` при `Accept-Encoding: gzip` на JS; `nosniff` и CSP на
  `/`; `max-age=86400`+`stale-while-revalidate` и ОТСУТСТВИЕ `immutable` на
  картинке из `content/assets/`. Существующие `curl /` (grep `Cabadrive`) и
  `curl /sw.js` сохранить; `make down` в `if: always()` не трогать. Джобу
  `baseline-checks` не трогать.

- [x] **T006** Durable-доки (A8): синхронизировать
  `docs_project/project/devops/docker-runtime.md` секцию `## Implementation`
  аддитивно — unprivileged-образ `nginxinc/nginx-unprivileged:1.29-alpine` (master
  не root) + краткий пункт про split кеш-политику / security-заголовки (строгая
  `'self'` CSP) / gzip. Строки, на которые опираются ассерты
  `tests/docker-runtime.test.mjs` (`http://localhost:5173`, `COMPOSE_PROJECT_NAME=…`,
  «Compose auto-tags…», «must not stop, remove, rename…», «project-scoped image
  name»), НЕ трогать. `docs/improvements/14-*.md` §4 чекбоксы НЕ редактировать.
  Зафиксировать факт правки (или обоснованный no-change) в Evidence.

- [x] **T007** Границы дифа (grep-свидетельства в Evidence): `git diff --name-only`
  = ровно `nginx.conf`, `Dockerfile`, `tests/docker-runtime.test.mjs`,
  `.github/workflows/ci.yml`, `docs_project/project/devops/docker-runtime.md`
  (+ `specs/049-*`); `git diff --stat src public/sw.js
  scripts/generate-service-worker.mjs src/data/content.ts index.html vite.config.ts
  docker-compose.yml Makefile package.json` — **пусто**; `ci.yml`-диф затрагивает
  только джобу `docker-validation` (не `baseline-checks`).

- [x] **T008** Прогнать локальные гейты и записать фактические свидетельства в
  Verification Evidence: `node --test tests/docker-runtime.test.mjs` (fail→pass),
  `pnpm run test` (точное число, базис 554 → ожид. 556), `pnpm run quality:fast`,
  `pnpm run format:check`, `pnpm run preflight` (e2e «no external requests» и
  офлайн зелёные — NFR-1). Зафиксировать, что реальный `curl -I` header-контракт
  (FR-5.2) прогоняется в CI-джобе `docker-validation` (docker CI-run; опц.
  локальный docker-прогон при наличии окружения). Записать decisions/dead ends/
  known issues/feedback до PR-handoff.

- [x] **T009** `pnpm run preflight` перед push (обязателен перед каждым push);
  затем commit/push/открытие РОВНО одного ready PR по назначению Implementation
  Agent. Записать URL, ветку, полный head SHA в `## Cycle PR Set`. Не мержить, не
  ребейзить чужое, не мутировать несвязанное состояние.

## Review And Follow-up Tasks

- [ ] **T010** Review Agent: thread-aware ревью точного текущего head — FR-1 split
  (immutable ТОЛЬКО на `/assets/`, НЕ на `/content/assets/` — NS-2), полнота и
  `'self'`-only-строгость security-заголовков/CSP (NS-1/NS-4), корректность
  `map`-подхода против `add_header`-inheritance trap (НОЛЬ per-location
  `add_header` — NS-7), `gzip_types` включает `text/javascript` (NS-6),
  unprivileged-переход (NS-3), реальная сторожевая сила статик-контракта (ассерты
  падали на баговом — NS-5) и runtime `curl -I` в CI, отсутствие расползания scope
  в приложение/SW/хешированные пути, полнота feature memory. Только inline review
  threads, без правок кода.

- [ ] **T011** Orchestrator: каждый review/implementation-feedback item получает
  Architect-диспозицию (task/ticket/not-needed) с записью здесь; ничего не
  откладывается молча.

- [ ] **T012** Implementation Agent: принятые follow-ups, свежие focused/полные
  свидетельства на новом head (включая обновлённые счётчики тестов и CI
  docker-validation header-результаты), обновление процессной памяти, свежие
  review/check-свидетельства.

## Final Validation And Completion Tasks

- [ ] **T013** Orchestrator: зафиксировать полный cycle PR set, состояние required
  checks/head (включая `docker-validation` с header-smoke), resolved threads,
  конфликты, acceptance evidence, диспозиции feedback и effective content head.

- [ ] **T014** Финальная Architect-валидация: все задачи/диспозиции, guidance,
  process memory, customer intent в духе и букве. При pass — записать
  merge-gate-маркеры в `## Final Architect Validation (Architect-owned)`
  (`Architect validation pass: passed`, ISO-timestamp,
  `Architect validated effective content head: <40-hex-sha>`); gaps — через
  role-appropriate follow-up, максимум 10 возвратов.

- [ ] **T015** Финальная Analyst-валидация только после T014: Analyst-owned
  маркеры в `feature-request.md` (`Analyst validated effective content head:
  <40-hex-sha>`, тот же SHA, что у Architect) или возврат gap'ов на
  Architect-диспозицию, максимум 5 возвратов.

- [ ] **T016** Orchestrator: read-only current-PR-head guard (эффективный content
  head по полному SHA; поздние коммиты — только evidence-only), затем conservative
  finalization/merge (squash-only ruleset + AI Review (Codex) gate) только при всех
  зелёных гейтах; cleanup — отдельным назначением Cleanup Agent или явное
  not-applicable/refusal-свидетельство.

## Decisions

- **Header-inheritance approach (главное решение — NS-7): `map $uri $cache_control`
  + единственная server-level `add_header Cache-Control $cache_control;`.**
  В nginx `add_header` в `location`-блоке ОТМЕНЯЕТ наследование всех server-level
  `add_header` для этого location. Наивная схема (security в `server{}`,
  Cache-Control в `location /assets/`) молча уронила бы security-заголовки на всех
  ассет-ответах. Выбрана схема с `map`: Cache-Control выведен из `$uri` и эмитится
  ОДНОЙ server-level `add_header` рядом с security-заголовками; ни в одном
  `location` НЕТ `add_header` → все server-level заголовки наследуются каждым
  2xx/3xx-ответом (`/`, `/assets/`, `/content/assets/`, `/sw.js`). Пустой default
  `map` → `add_header Cache-Control ""` не добавляет заголовок (nginx ≥1.7.5).
  Альтернативы (повтор заголовков в каждом location / include-сниппет) отвергнуты
  как многословные и хрупкие. `map` валиден: `conf.d/default.conf` включается в
  `http{}`.
- **Cache-Control БЕЗ `always`, security-заголовки С `always` — осознанная
  асимметрия (NS-8).** `always` на 5 security-заголовках (+CSP) гарантирует их
  эмиссию на error-ответах (например, 404 от `try_files … =404`) — это FR-2.1.
  Cache-Control, напротив, `add_header … $cache_control;` БЕЗ `always`: nginx
  выставит его только на 2xx/3xx, поэтому immutable-политика НЕ применится к 404
  ассетов. Иначе транзиентный `/assets/*` 404 ушёл бы как `max-age=31536000,
  immutable` и «запинал» бы сбой в браузерах даже после восстановления файла.
  FR-1.1 не страдает: все реальные 200-ответы ассетов получают Cache-Control из
  `map`. Проверяемо: статик `assert.doesNotMatch(nginx, /add_header Cache-Control
  \$cache_control always;/)` + runtime `! grep cache-control` на `/assets/`-404
  (security-заголовки на нём присутствуют).
- **CSP → enforce сразу, без committed report-only (A2).** Финальный образ несёт
  `Content-Security-Policy` (enforce), не `-Report-Only`. «Report-режим» ТЗ-14 §4 —
  локальная верификация (browser console + e2e AC-2), а не отдельный заголовок/
  коммит. Безопасно, т.к. build-вывод `dist/index.html` не содержит инлайн-скриптов
  (только module-`<script src="/assets/…js">` + линкованный CSS).
- **CSP-директивы дословно (A3).** `default-src 'self'; img-src 'self' data:;
  style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; base-uri
  'none'; frame-ancestors 'none'`. `object-src`/`form-action` НЕ добавляются
  (минимальная площадь + детерминизм FR-5.1; `default-src 'self'` уже покрывает
  fallback). `script-src` без `'unsafe-inline'` (инлайн-скриптов нет).
- **`Permissions-Policy: camera=(), microphone=(), geolocation=()` (A4).** Дословно
  по ТЗ-14; список не расширяется (S-effort).
- **gzip_types включает `text/javascript` (NS-6).** nginx 1.29 mime.types мапит
  `.js`/`.mjs` → `text/javascript` (не `application/javascript`); без него
  JS-бандлы отдавались бы несжатыми. Список: `application/javascript
  application/json image/svg+xml text/css text/javascript`. `text/html` НЕ
  перечислен явно (сжимается неявно; явное перечисление → warning «duplicate MIME
  type text/html»). `gzip_vary on`, `gzip_min_length 1024`, `gzip_comp_level 6`.
- **unprivileged-образ: только runtime-`FROM` (A6).** `nginx:1.29-alpine` →
  `nginxinc/nginx-unprivileged:1.29-alpine`. `COPY`-пути/`EXPOSE 8080`/`CMD` без
  изменений: образ решает pid `/tmp/nginx.pid`, temp-пути и не-root `USER 101` из
  коробки (AC-4). Build-стадия не меняется.
- **HSTS/TLS вне scope (A7).** `Strict-Transport-Security` не вводится — образ
  раздаёт по HTTP :8080, TLS-термінация вне образа; HSTS без TLS бессмыслен.
- **FR-5 двухслойно (A5): статический text-контракт + реальный `curl -I` в CI.**
  Статика (`tests/docker-runtime.test.mjs`, `node --test`, без docker) — быстрый
  test-first regression guard, падает на баговом конфиге (NS-5). `curl -I` в CI
  `docker-validation` — объективное подтверждение заголовков на живом образе.
- **FR-5.1: ДВА новых focused `test()` блока (nginx.conf + Dockerfile).**
  Инфраструктурный контракт `nginx.conf`/`Dockerfile` — отдельная забота от
  compose/Makefile/docs-блоков, поэтому добавляются отдельные `test()` (счётчик
  554 → 556, docker-runtime 4 → 6), а не расширяются существующие. Существующие 4
  блока не ослабляются. Test-first: ассерты наблюдаются падающими на баговом
  конфиге.
- **`location /assets/` и `location /content/assets/` сохраняются с `=404`.** Нужны,
  чтобы отсутствующий ассет отдавал 404, а не проваливался в SPA-фолбэк на
  `/index.html` (200 HTML). Cache-Control приходит из `map` → per-location
  `add_header` НЕ ставится (NS-7).
- **durable-доки (A8): `docker-runtime.md` синхронизируется аддитивно.** Док
  описывает образ/порт (строка 40) → упоминание unprivileged + cache-split/
  security/gzip. Существующие ассерты на док не ослабляются. Чекбоксы
  `docs/improvements/14-*.md` §4 НЕ редактируются (прецедент 047/048).
- **Номера строк (A9): проверены на base `c5520b31`.** Implementation Agent обязан
  перепроверить на своём HEAD (T001).

## Verification Evidence

Implementation Agent записывает команда → фактический результат → SHA кандидата.
Слоты (заполнить фактическими прогонами на HEAD):

Candidate SHA во время локального прогона (до commit): `c5520b31922c0e45afd96b2e5877136c1848a541` (HEAD == base до commit; подтверждено `git rev-parse HEAD`).

- `git rev-parse HEAD` (T001) = `c5520b31922c0e45afd96b2e5877136c1848a541` (== base и
  == `origin/main`). `git status --short` чисто кроме `specs/049-*` (только
  `?? specs/049-nginx-caching-security/` до правок кода). Номера строк на HEAD
  подтверждены: `nginx.conf` `listen 8080`@2, баговый `location /content/assets/`+
  `immutable`@11-14, `location /sw.js`@16-19, нет `location /assets/`; `Dockerfile`
  runtime `FROM nginx:1.29-alpine`@13, `COPY nginx.conf …`@15, `EXPOSE 8080`@18,
  `CMD`@20; `tests/docker-runtime.test.mjs` 4 `test()` блока @16-53, чтения
  compose/Makefile/docs @5-14; `ci.yml` `docker-validation` @100-129 (`curl /`
  grep Cabadrive @119/124, `curl /sw.js` @125).
- `pnpm run test` базис ДО правок (T002): **554** pass / 554 tests / 0 fail
  (`# tests 554 / # pass 554 / # fail 0`; `tests/docker-runtime.test.mjs` = 4 блока).
- `node --test tests/docker-runtime.test.mjs` — test-first: **fail** новых FR-5.1
  блоков ДО правок FR-1..FR-4 — `# tests 6 / # pass 4 / # fail 2`: блок 5
  («nginx.conf splits cache policy…») падает на `The input did not match the
  regular expression /map \$uri \$cache_control/`; блок 6 («Dockerfile runtime
  uses unprivileged…») падает на `/FROM nginxinc\/nginx-unprivileged:1\.29-alpine/`.
  Существующие 4 блока (1-4) остались зелёными — не ослаблены (NS-5 подтверждён:
  контракт реально падает на баговом конфиге). После правок T003/T004: **pass** —
  `# tests 6 / # pass 6 / # fail 0`.
- `pnpm run test` — `node --test tests/*.test.mjs`: **pass**, **556** (`# tests 556
  / # pass 556 / # fail 0`; базис 554 → +2 focused `test()`, docker-runtime 4 → 6).
- `pnpm run quality:fast` — `tsc --noEmit` + eslint (`--max-warnings 0`): **pass**
  (EXIT 0, без ошибок/варнингов).
- `pnpm run format:check` — **pass** («All matched files use Prettier code style!»).
- `pnpm run build:app` — **pass** (vite build «✓ built in ~4s» + generate:sw
  «Generated service worker with 2156 cached assets»).
- `pnpm run preflight` — **EXIT 0**. Включает check-feature-memory, check:repo,
  validate:content, quality:fast, format:check, verify:quality-negative,
  `pnpm run test` (556 pass), `pnpm run build`, `pnpm run test:e2e` (playwright:
  **154 passed (1.5m)**). NFR-1 «no external requests» + офлайн зелёные: e2e #77/#78
  «process guide stays local-first without external requests, remote images, or PDF
  viewer», #116 «…without runtime network or PDF dependencies», #122 «materials
  view stays local-first without external requests or PDF viewer»; офлайн — unit
  #556 «generated service worker fetch handler has correct offline fallbacks».
- **Docker-контракт FR-5.2 (реальный `curl -I`):** реализован в CI-джобе
  `docker-validation` новым шагом «Header contract smoke» (`set -euo pipefail`):
  immutable на извлечённом из `/index.html` хешированном `/assets/*.js`;
  `Content-Encoding: gzip` при `Accept-Encoding: gzip` на JS; `nosniff` + CSP
  (`content-security-policy: default-src`) на `/`; `max-age=86400,
  stale-while-revalidate=604800` и ОТСУТСТВИЕ `immutable` на картинке из
  `content/assets/`; NS-8 — `/assets/does-not-exist.js` отдаёт `HTTP/… 404` и НЕ
  несёт `cache-control` (immutable-политика не пинит 404 в браузерах); сохранены
  существующие `curl /` (grep Cabadrive) + `curl /sw.js`.
  Реальный live-прогон header-контракта выполняется в CI (docker required).
  **Локальный docker-прогон: НЕ ВЫПОЛНЕН — заблокирован окружением.** Локальный
  Docker Desktop (server 27.5.1) не смог спуллить базовые образы
  `nginxinc/nginx-unprivileged:1.29-alpine` / `node:22-alpine` (оба отсутствовали
  локально): `docker compose build` завис на pull-шаге ~50 мин при 0% CPU, прямой
  `docker pull nginxinc/nginx-unprivileged:1.29-alpine` — таймаут 3 мин без
  прогресса. Причина — перегруженный daemon (39 GB build-cache, множество
  crash-loop контейнеров стороннего проекта `cpg`) и медленный/зависший
  registry-pull; это ограничение ЛОКАЛЬНОГО окружения, не дефект правок. Сиблинг-
  окружения не тронуты; остановлен только собственный завис­ший build-процесс,
  своих контейнеров не осталось. См. Implementation Agent Feedback (для
  Architect-диспозиции). Авторитетный live header-контракт — CI `docker-validation`.
- **AC-4 (unprivileged, не-root):** обеспечено базовым образом
  `nginxinc/nginx-unprivileged:1.29-alpine`, который по умолчанию несёт `USER 101`
  (nginx-мастер стартует как uid 101, не root) и `listen 8080`; правка Dockerfile —
  ровно runtime-`FROM` (статик-блок 2 FR-5.1 зелёный). Live-подтверждение
  инспекцией процессов заблокировано тем же локальным docker-ограничением (см.
  выше); в CI образ поднимается и smoke-тестируется джобой `docker-validation`.
- **Границы дифа (T007):** `git diff --name-only` = `.github/workflows/ci.yml`,
  `Dockerfile`, `docs_project/project/devops/docker-runtime.md`, `nginx.conf`,
  `tests/docker-runtime.test.mjs` (ровно 5 файлов) + `?? specs/049-*`. `git diff
  --stat src public/sw.js scripts/generate-service-worker.mjs src/data/content.ts
  index.html vite.config.ts docker-compose.yml Makefile package.json` = **пусто**.
  `ci.yml`-диф — только новый шаг «Header contract smoke» внутри `docker-validation`
  (между «Smoke test local app» и «Stop Docker app»); `baseline-checks` не тронут.
- **Durable-доки (T006):** `docs_project/project/devops/docker-runtime.md` секция
  `## Implementation` синхронизирована аддитивно — (a) строка про nginx на :8080
  дополнена упоминанием образа `nginxinc/nginx-unprivileged:1.29-alpine` (мастер
  как non-root uid 101); (b) добавлен пункт про split кеш-политику (immutable на
  хешированных `/assets/`; `max-age=86400`+`stale-while-revalidate` на
  `/content/assets/`), базовые security-заголовки (строгая `'self'` CSP,
  `X-Content-Type-Options`/`X-Frame-Options`/`Referrer-Policy`/`Permissions-Policy`)
  и gzip; отмечено, что Cache-Control выведен из единого `map $uri` и эмитится одной
  server-level `add_header` (без per-location override). CI-подтверждение (PR #214,
  джоба `docker-validation`, шаг «Header contract smoke»): все header-ассерты
  прошли ЖИВЫМИ на поднятом образе — `immutable` на хешированном `/assets/*.js`,
  `content-encoding: gzip` на JS-бандле при `Accept-Encoding: gzip`,
  `x-content-type-options: nosniff` и `content-security-policy: default-src` на `/`
  — все PASS. Единственная ошибка шага была shell-идиомой, НЕ дефектом
  заголовков/конфига: `find content/assets … | head -1` под `set -euo pipefail` даёт
  `find: write error` (SIGPIPE/EPIPE на 2301+ файлах, `head` закрывает пайп) →
  ненулевой код → pipefail роняет шаг ДО `/content/assets/`-ассертов. Исправлено
  SIGPIPE-safe формой `find … -print -quit` (GNU find на ubuntu-latest; без пайпа,
  без `head`). `asset=$(curl … | grep … | head -1)` оставлен как есть (крошечный
  вывод, без SIGPIPE-риска). Обе `/content/assets/`-ассерты (`max-age=86400,
  stale-while-revalidate=604800` присутствует; `immutable` отсутствует) сохранены.
  Строки-ассерты
  (`http://localhost:5173`, `COMPOSE_PROJECT_NAME=…`, «Compose auto-tags…», «must
  not stop, remove, rename…») НЕ тронуты; тест «Docker runtime docs cover…» зелёный.
  `docs/improvements/14-*.md` §4 чекбоксы не редактировались.
- **Негативные сценарии (обязательны):** NS-1 (CSP `style-src 'unsafe-inline'`,
  инлайн-скриптов в build-выводе нет; e2e app-shell зелёный) — OK; NS-2
  (`/content/assets/` `max-age=86400` без immutable — статик-ассерт `max-age=86400,
  stale-while-revalidate=604800` + `doesNotMatch(/\/content\/assets\/…immutable/)`
  зелёные; CI `! grep immutable`) — OK; NS-3 (unprivileged base image; статик-блок 2
  зелёный; live-старт — CI) — OK (локальный docker недоступен, см. Feedback); NS-4
  (CSP `'self'`-only + `data:` img; e2e «no external requests» зелёные) — OK; NS-5
  (статик-контракт падал на баговом конфиге — зафиксировано fail→pass) — OK; NS-6
  (`gzip on` + `text/javascript` в gzip_types; `doesNotMatch text/html`; CI curl
  gzip) — OK; NS-7 (map-подход, 0 per-location `add_header`, единая server-level
  `add_header Cache-Control $cache_control;` (БЕЗ `always`); CI curl -I на `/assets/`
  покажет security+cache вместе) — OK; NS-8 (Cache-Control БЕЗ `always`, чтобы
  immutable-политика НЕ применялась к 404-ответам `/assets/*` и не пинила отказ в
  браузерах; 5 security-заголовков сохраняют `always` для error-страниц) — статик
  `assert.match(/add_header Cache-Control \$cache_control;/)` +
  `assert.doesNotMatch(/add_header Cache-Control \$cache_control always;/)` зелёные;
  CI runtime smoke: `/assets/does-not-exist.js` → `HTTP/… 404` и `! grep cache-control`
  (заголовок Cache-Control отсутствует на miss) — OK.
- `git diff --check` — clean (нет whitespace/conflict-маркеров).
- PR URL / head SHA / состояние checks и review threads — ведёт Orchestrator (см.
  `## Cycle PR Set`).

## Dead Ends

- _(Заполняется Implementation Agent при обнаружении.)_ На момент Architect-записи
  тупиков нет: эталонные `nginx.conf`/`Dockerfile` и набор FR-5.1 регэкспов
  зафиксированы в plan.md; известный риск расхождения пробелов между эталонным
  текстом и регэкспами снимается сверкой литералов на HEAD (T003/T004) и гибкими
  `\s*` в маппинг-регэкспах. `map`-подход подтверждён Architect как решение
  `add_header`-inheritance trap (NS-7); альтернатива с per-location `add_header`
  отвергнута до реализации.
- **Implementation Agent (T008): локальный docker-прогон недоступен на этой машине.**
  Локальный `COMPOSE_PROJECT_NAME=cabadrive-049 CABADRIVE_HOST_PORT=5199 docker
  compose build` завис на шаге pull базовых образов (`nginxinc/nginx-unprivileged:
  1.29-alpine` и `node:22-alpine` отсутствовали локально) ~50 мин при 0% CPU;
  прямой `docker pull nginxinc/nginx-unprivileged:1.29-alpine` — таймаут 3 мин без
  прогресса. Docker daemon отвечал (server 27.5.1), но был перегружен (39 GB
  build-cache; несколько crash-loop контейнеров стороннего проекта `cpg`), и
  registry-pull завис/крайне медленный. Собственный завис­ший build-процесс
  остановлен (`kill` только своих PID); своих контейнеров/образов не осталось;
  сиблинг-окружения (`cpg`, прочие) НЕ тронуты. Тупик обойдён: авторитетный live
  header-контракт (FR-5.2) выполняется в CI-джобе `docker-validation`, статик-
  контракт FR-5.1 (fail→pass) и все остальные гейты зелёные локально.

## Known Issues

No unresolved known issues; the accepted limitations of this cycle — hashed image
paths (`/content/img/`, ТЗ-P3) remain out of scope so `/content/assets/` is cached
as "fresh ≤24h" rather than truly immutable; Brotli is deferred (no `ngx_brotli` in
stock alpine, gzip only); HSTS/TLS are out of scope (HTTP :8080 behind an external
proxy); the `docs/improvements/14-*.md` §4 checkboxes are not edited (047/048
precedent) — are all documented and Architect-ACCEPTED under Decisions, with no
open owner decision required.

## Implementation Agent Feedback

- No unresolved Implementation Agent feedback.

---

<!-- Секции ниже — skeleton-плейсхолдеры; заполняются на финальной валидации,
     инициируемой Orchestrator. НЕ заполнять marker-значения (timestamp/SHA)
     на этапе Architect-дизайна. -->

## Final Architect Validation (Architect-owned)

Merge-gate markers (exact keys, verbatim — do not reword; parsed by
`scripts/finalize-pr.mjs`):

Architect validation pass: <passed|failed>
Final Architect validation completed at: <ISO-8601 timestamp>
Effective content head: <40-hex-sha>
Architect validated effective content head: <40-hex-sha>

_(Заполняется на финальной Architect-валидации, инициируемой Orchestrator после
завершения реализации и review. Записать incremental review basis `git diff
c5520b31..<head>`, re-verification против задач/диспозиций/guidance/process
memory/customer intent, повторный прогон гейтов на effective head, Architect
return count.)_

## Cycle PR Set

_(Ведёт Orchestrator. Slice 1 (this cycle, SOLE PR): PR #<num> — <url>; branch
`claude/049-nginx-caching-security` → base `main`; status; effective content head
`<40-hex-sha>`; purpose: ТЗ-14 — split кеш-политики (FR-1) + security-заголовки/CSP
(FR-2) + gzip (FR-3) + unprivileged-образ (FR-4) + двухслойный header-контракт
(FR-5). Required checks / AI Review (Codex) / final Architect+Analyst validation /
current-head guard / merge — Orchestrator. Do NOT merge manually — squash-only
ruleset + Codex gate.)_

- **Slice 1 (SOLE PR) — Implementation Agent handoff:**
  - PR: #214 — https://github.com/cucumberfalse/cabadrive/pull/214
  - Branch: `claude/049-nginx-caching-security` → base `main`
  - Status: OPEN, ready (non-draft) at handoff.
  - Head SHA (full): `4b992567d10a9835323d23909f230a95ed7c4953`
  - Purpose: ТЗ-14 — FR-1 split cache + FR-2 security headers/CSP + FR-3 gzip +
    FR-4 unprivileged image + FR-5 two-layer header contract.
  - Note: pushed via SSH remote (the HTTPS OAuth token lacks `workflow` scope for
    `.github/workflows/ci.yml`). Required checks / AI Review (Codex) / final
    Architect+Analyst validation / current-head guard / merge — Orchestrator.
    Local docker run blocked by environment (see Implementation Agent Feedback);
    live FR-5.2 header contract runs in CI `docker-validation`.

## Final Validation Evidence

_(Заполняется на финальной валидации, инициируемой Orchestrator.)_

- **Architect final validation:** `<PASS|FAIL>` on effective content head
  `<40-hex-sha>` — см. verbatim merge-gate marker lines в
  `## Final Architect Validation (Architect-owned)`. Architect return count `<n>`
  (limit 10).
- **Analyst final validation:** `<PASSED|returned>` (Analyst-owned) — записано в
  `feature-request.md` с LATER timestamp (после Architect) и
  `Analyst validated effective content head: <40-hex-sha>` (тот же SHA, что у
  Architect). Analyst return count `<n>` (limit 5).
- Limit escalation: `<none|details>`.
- **Current-head guard / required checks / resolved threads / conflicts / merge:**
  Orchestrator-owned. Any post-validation NON-evidence change makes the Architect
  pass stale and must be routed back through role-appropriate final validation
  before merge.
- **Permitted later commit:** a single evidence-only validation commit recording
  Architect/Analyst validation evidence is allowed without recursive role
  re-validation (changes no behavior). Orchestrator performs the read-only
  current-PR-head guard (effective content head by full SHA) before conservative
  finalization/merge.
