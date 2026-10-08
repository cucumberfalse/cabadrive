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

- Evidence passed: consolidated C055-214-OSV2/FRESH candidate `pnpm run preflight` EXIT0 with556/556 Node tests and160/160 desktop/mobile Playwright cases, all memory/repository/content/quality/format/negative/build guards and2156 cached worker assets. Six new actual HTTP-cache cases prove warmA/default-fetchA without extra server hits, legacy-default new cacheA, fixed reload origin hit/exact new cacheB, and503 rejected atomic installation with empty new cache/prior active cacheA/offline reload. No routing or HTTP-cache clearing is used. Log `/private/tmp/cabadrive-finalize214-preflight-final.log` SHA256 `ad6a38a24502a47e088f1d495beab0d979c752d86af5240a5a72fba6ed435f12`. Exact compatible brace1.1.21/5.0.12 with unchanged minimatch owners/source-map-js1.2.2 and manifest passed frozen install/hash audit; local same-version OSVv2.3.5 full recursive scan EXIT0,241 packages/zero vulnerable packages, raw report SHA256 `653ca6184b8c572167d82db713cb0ca5226f6d85963d8119c56202ee54710f4f`. Remote exact-new-head scanner remains independently required.
- Evidence passed: fresh isolated Docker image `cb8d0e3ec1eb5bc5f552716579686b0bbea60683fcdc13f59b4331ec2aeb1510` versus prior full actual-CSP audit image `3c8faf0f1b02e1fad1204fb3d629efdb59c2c94eb93b2781cbbfa8939bc77a57`: complete served inventory2358 files;2357 raw byte-identical shell/hashed assets/content files; only `sw.js` changed, exactly generated decimal cache token plus accepted atomic Request(cache:reload) install construction. Complete ASSETS2156 and all other worker bytes are identical; no raw whole-tree/worker identity is claimed. Prior inventory SHA256 `a35a19dd2815580e5899055feb4cb716a813351f8150a8cb0f5f7652a4e5b588`, current inventory SHA256 `54cd6d33c26a0ff279798e387326bea33d72b3f3b9154eec662dae419abc7d9a`; full comparison `/private/tmp/cabadrive-finalize214-runtime-final-comparison.json`. Prior154-screen CSP compatibility carries for unchanged app/headers; changed worker received fresh actual-browser verification rather than timestamp-only equivalence.
- Evidence passed: actual rebuilt nginx5194 desktop/mobile worker install/offline shell reload/first deferred manual load/offline manual reload2/2 cases and8 document responses with specified enforced CSP; zero securitypolicyviolation events, console errors or pageerrors. Both projects install current `cabadrive-static-1791481561584`; actual cache inspection proves manual chunk absent after install and present only after real first load of `/assets/manual4Ruedas-BSu9JrPn.js`. Raw events `/private/tmp/cabadrive-finalize214-osv2-browser/events.jsonl` SHA256 `85c9d39750fb1be22f795b8a3b88848871be3fe0dc960e219dd7424aff7dad6b`; browser command `pnpm exec playwright test --config /private/tmp/cabadrive-finalize214-osv2-browser/config.ts`. Fresh root/SW/hashedJS/stable image/404 exact five-header/cache/gzip smoke passed, UID101 actual nginx master; image unchanged after corrected scratch Request.url instrumentation. Own project `cabadrive-finalize214` container/network removed; sibling resources preserved. Ordered roles on new substantive SHA and live remote gates remain pending.

- Evidence passed: C055-214-CSP actual-browser verification on effective content head `aa261a7cbfd24b7cc1e739f1c4be397526d5b55c` used isolated nginx Docker project `cabadrive-finalize214` at `http://127.0.0.1:5194`, with enforced response CSP verified rather than Vite preview. Ephemeral copies of both existing browser suites changed only the import to an auto instrumentation fixture; tracked product/tests/runtime/dependencies remain unchanged. Commands: `pnpm exec playwright test --config /private/tmp/cabadrive-finalize214-csp/playwright.config.ts` and companion manual config;146 app cases plus8 manual-ticket cases cover desktop/mobile home/learn, exam/start/completion/resume/leave, mistakes, vocabulary/detail, materials/tickets, process, CABA/RF, manual/front-matter/chapter/appendix/detail/lazy corpus, source-reader/search/translation modes, progress/export/import/reset and offline reload.
- Evidence passed:154 distinct cases under real nginx policy,155 monitored records including one focused rerun; zero securitypolicyviolation events, zero enforced violations, zero console CSP errors, zero console errors and zero pageerrors. All successful document responses expose exactly the specified enforced CSP; actual network evidence includes `/assets/index-ui5s-K4J.js` and deferred `/assets/manual4Ruedas-BSu9JrPn.js`. Native Chromium hit SIGSEGV during one mobile lazy-chunk context teardown after assertions; only that case was rerun with `--project mobile --workers 1 --grep 'non-manual startup defers the manual corpus chunk until the manual view opens'` and passed EXIT0. Initial145 app+8 manual passes and focused1 pass establish all154 cases without a product fix or hidden test weakening. JSON audit/summary, unchanged assertions and dense-manual desktop/mobile screenshots retained in `/private/tmp/cabadrive-finalize214-csp`; summary records exact counts/hashes. HTTP/runtime smoke passed again; browser-run image `3c8faf0f1b02e1fad1204fb3d629efdb59c2c94eb93b2781cbbfa8939bc77a57` preserves prior JS hashes. Own Docker container/network removed successfully; siblings preserved.

- Current implementation verification passed on the content committed as6a7205b2: full preflight EXIT0,556/556 Node tests,154/154 Playwright cases, memory/repository/content/quality/format/negative/build guards,2156-asset generated worker. Original nginx049's NS1–NS8 and local-first/offline outcomes remain covered.
- Current real Docker evidence passed: project cabadrive-finalize214, port5194, build/up/down EXIT0, runtime imageae4c02775cd0efdc7a68855d4708d7518e2f7c3ebe9ab891bdd3d31c3b89034e. Exact five security headers on root/SW/current hashed JS/content image/404; immutable hashed assets;86400+stale604800 unhashed content; no-cache SW; no error Cache-Control; gzip and actual nginx PID1 non-root UID101. Sibling resources preserved.
- Security evidence passed: source-map-js1.2.2 only via postcss8.5.28; manifest unchanged; four target lock-key/integrity/edge/snapshot lines audited; frozen install EXIT0 without hash drift. New055 owns this narrow dependency remediation.
- Independent current-content Review passed on6a7205b2; this preparation changes only canonical process evidence/dispositions, with no product/runtime/test/dependency delta. Final remote exact-head checks remain Orchestrator gates.

### Historical implementation checkpoints

The following dated earlier baselines are preserved as historical evidence. Their blocked local Docker statement and older head/check expectations are superseded by current successful verification above.

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
- **Latest-main sync для PR #214 (Implementation Agent, 2026-10-06):** ветка
  `codex/pr214-sync`, отслеживающая `origin/claude/049-nginx-caching-security`,
  синхронизирована обычным merge (без rebase/history rewrite) с verified
  `origin/main` `2a92bcfcb7638d1094f33b28e4c2932fb2e4121e`; исходный PR head
  `f0f3734cb00ee0b728931169ad001ff70e4c38fc`, merge commit
  `77c2c1aea76e07e32f17549c47f692ed6bab6e76`. Конфликтов не было; merge
  сохранил обе стороны и принёс только `pnpm-lock.yaml` плюс полную feature memory
  `specs/050-security-baseline-refresh/` из `main`. `pnpm-lock.yaml` теперь
  разрешает единственную версию `postcss@8.5.28` (`pnpm why postcss --depth 1` →
  `postcss@8.5.28` через `vite@6.4.3`), то есть уязвимая `8.5.15` устранена и
  требование `>=8.5.18` выполнено. `pnpm install --frozen-lockfile` — EXIT 0.
- **Проверка после sync:** первый sandboxed `pnpm run preflight` дошёл до unit
  suite и завершился 555/556 из-за единственного ограничения окружения:
  `listen EPERM: operation not permitted 127.0.0.1` в тесте, который намеренно
  открывает локальный HTTP-порт. Повторный полный `pnpm run preflight` вне этого
  loopback-ограничения — **EXIT 0**: feature-memory/repository/content checks,
  typecheck, lint, format, negative-quality contract, **556/556 unit**, build +
  service worker (2156 cached assets), **154/154 Playwright e2e**. Это подтверждает
  объединённое дерево на merge commit до evidence-only правки; после записи этой
  процессной evidence полный preflight должен быть повторён на точном кандидате к
  push.
- **Validation/check expectation после sync:** merge `origin/main` изменил
  non-evidence content (`pnpm-lock.yaml`), поэтому любые прежние current-head CI/
  review результаты и любые прежние final-validation выводы считаются stale.
  Final Architect validation остаётся pending и должна выполняться на новом
  effective content head только после fresh CI + current-head Review; Final
  Analyst validation остаётся pending и запускается строго после Architect pass.
  Implementation Agent эти role-owned validation-маркеры не заполнял.
- PR URL / head SHA / состояние checks и review threads — ведёт Orchestrator (см.
  `## Cycle PR Set`).

### Current continuation runtime verification (Implementation Agent,2026-10-08)

Cycle055 AD055-2 owns the minimal source-map-js lock-only1.2.2 security resolution; the original nginx scope is preserved. Cycle055 AD055-3 supersedes the historical local Docker pull limitation with actual successful current-tree Docker build/up/down in isolated project `cabadrive-finalize214` on free port5194. Runtime image SHA `ae4c02775cd0efdc7a68855d4708d7518e2f7c3ebe9ab891bdd3d31c3b89034e`; root/SW/hashed JS/unhashed content image/missing404 contracts passed, including exact five security headers on every response, immutable hashed JS,86400+stale604800 content image, no-cache SW, no immutable/cache header on404, gzip JS and Vary, UID101 and actual nginx master user `nginx`. Own container/network were stopped/removed and siblings preserved. The machine's credential-helper stall was resolved with disposable anonymous Docker config, preserving user credentials. Current full `pnpm run preflight` EXIT0:556/556 unit,154/154 desktop/mobile e2e, all memory/repository/content/quality/format/negative/build guards passed;2156 service-worker cached assets. Required exact-head remote checks/review and ordered final role passes remain pending Orchestrator coordination.

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

No unresolved known issues.

- C055-214-OSV2 safe graph advisory findings. Disposition: resolved by brace1.1.21/5.0.12/source-map-js1.2.2 with unchanged owners/manifest, frozen graph audit and fullOSVscan241/0; remote exact-head required check remains mandatory.
- C055-214-FRESH new-install HTTP-cache promotion. Disposition: resolved by atomic reload-request batch,6realHTTPcache/failure/offline controls, actual changedSWDocker/CSP smoke and truthfulHTTP-versus-SW docs; no unresolved owner decision.
- Historical local Docker/CSP-preview verification gaps. Disposition: superseded by real isolated headers/nonroot lifecycle and actual enforced-policy browser evidence.
- Hashed-image migration/Brotli/HSTS/TLS/status-checkbox updates. Disposition: not needed under declared scope; HTTP86400/SWR and persistent offlineSW snapshot are explicitly distinguished, not accepted defective behavior.

## Implementation Agent Feedback

- C055-214-OSV2 and C055-214-FRESH. Disposition: resolved by consolidated verified implementation, graph/fullscan and changed-worker regressions; no undisposed engineering feedback.
- No unresolved Implementation Agent feedback. New substantive review finding requires Architect disposition before repair; final role/current-head/remote gates remain Orchestrator obligations.

## Final Architect Validation (Architect-owned)

Final architectural validation is invoked after this process preparation receives its final effective content SHA. Record the pass only in the permitted `## Final Architect Validation Notes` evidence section on that SHA; prior placeholders are removed. The architecture has no open implementation disposition; independent review passed on product-identical content6a7205b2 and must remain valid through the process-only preparation.

## Cycle PR Set

- PR #214 https://github.com/cucumberfalse/cabadrive/pull/214; branch `claude/049-nginx-caching-security`; status open, ready for review; head SHA is the effective content preparation committed after `6a7205b2e585fb026261c77c96550d93d29b65ba`; sole original049 implementation slice; included in final validation. The remote head is refreshed by Orchestrator at push/finalization, never inferred from this local preparation checkpoint.
- PR #214 purpose: split cache/security/gzip/unprivileged header delivery; later compatible source-map-js1.2.2 remediation belongs to completion-cycle055 AD055-2. Original049 validation covers its preserved product contract and integrated security baseline.
- PR #217 and PR #215 are separate original product cycles and downstream members of055; status remains in progress. They are excluded from original nginx049 final-validation scope and receive independent ordered validation after214 merge. No055 cumulative pass or all-target merge claim is made here.
- PR #214 local preflight and actual Docker runtime evidence passed; exact final remote head, all five checks, fully resolved conversations, conflict-free state, current-head guard and GitHub merge result are Orchestrator finalization evidence. No merge before those live gates pass.

## Final Validation Evidence

- Architect return count:3/10; prior passes onaa261a7c are historical and superseded for merge authority by the consolidated dependency/generator content. New final Architect pass is invoked only after exact new-content review.
- Analyst return count:1/5; new Analyst pass follows renewed Architect pass on the same final effective SHA in Analyst-owned feature-request.md.
- Limit escalation: none.
- Final-validation evidence-only commit: after new effective content SHA, only original049 role-validation/verification evidence additions are permitted; all future non-evidence changes restart roles.
- Current-PR-head read-only guard: Orchestrator refreshes published/newGitHub head, references the final new effective SHA, proves later evidence-only delta and verifies all five required checks/fullreview/conversations/conflicts before expected-head finalization. Oldaa local guard is preserved only in historical notes and cannot authorize new content.
- Cleanup: not applicable; no deletion scope assigned, continuation/intake environments preserved.

## Final Architect Validation Notes

Architect validation pass: passed
Final Architect validation completed at: 2026-10-08T17:16:31Z
Architect return count: 0 / 10
Architect validated effective content head: aa261a7cbfd24b7cc1e739f1c4be397526d5b55c
Architect validation evidence: Original nginx049 sole included PR #214 inspected against spec/plan/tasks, current process memory, actual nginx/Docker/CI/test/lock diff and customer intent. Full preflight556/556 Node and154/154 browser cases, isolated port5194 real Docker headers/gzip/404/non-rootUID101 lifecycle, frozen source-map-js1.2.2 graph and independent no-finding Review on product-identical6a7205b2 establish acceptance. Preparation6a7205b2..aa261a7c changed only canonical049 task evidence; runtime, tests, dependency and product content are byte-identical.
Architect disposition: T010 independent Review completed; T011 all scoped review/implementation feedback disposed; T012 no engineering follow-up remains after consolidated security/runtime verification; T014 architectural validation completes here. T013 exact remote check state, T015 ordered Analyst validation and T016 expected-head finalization/merge are sequential role/merge gates, not missing engineering tasks. No unresolved implementation feedback or owner-risk decision remains.
Open Architect dispositions: none
Architect validation evidence: This pass covers original049 and integrated security baseline only. Cumulative055 and downstream217/215 remain in progress and require their own later integrated role evidence; no prerequisite merge or remote green check is fabricated. Orchestrator must obtain all five exact-current-head checks and resolved conversations, then run the authoritative GitHub/current-head guard before authorized merge.


## Final Architect Validation Notes

Architect validation pass: not ready
Architect return count: 1 / 10
Architect gaps: Analyst final verification correctly identified that the154-case Playwright preflight used Vite preview without nginx CSP. Header/runtime evidence proves server policy emission but does not prove original049 FR5/AC2 browser compatibility under that policy. The earlier all-acceptance claim is superseded until actual Docker browser evidence is recorded; no code defect is currently established.
Architect disposition: Accepted evidence task C055-214-CSP. Implementation214 must run a real browser against its isolated Docker5194 runtime, visit all learner screens and representative lazy/detail routes, collect securitypolicyviolation events and console/page errors, and assert rendered app/no enforced CSP violations. A complete existing browser suite may reuse the Docker server; ephemeral instrumentation is sufficient without a repository test/product edit. Record commands and actual results in allowed Verification Evidence bullets. Genuine CSP defects require role-routed substantive repair and renewed effective content SHA; evidence-only success retains effective SHAaa261a7cbfd24b7cc1e739f1c4be397526d5b55c and receives renewed Architect-before-Analyst notes.
Open Architect dispositions: C055-214-CSP actual Docker browser verification


## Final Architect Validation Notes

Architect validation pass: passed
Final Architect validation completed at: 2026-10-08T17:28:21Z
Architect return count: 1 / 10
Architect validated effective content head: aa261a7cbfd24b7cc1e739f1c4be397526d5b55c
Architect validation evidence: Renewed original049 validation inspected actual Docker browser audit/summary, instrumentation, focused rerun log and tracked evidence.154 distinct original desktop/mobile cases pass against nginx5194,155 monitored records,182 document responses carry the exact enforced CSP, zero securitypolicyviolation/enforced violations/console CSP/console errors/pageerrors; actual manual4Ruedas and source-reader deferred shards loaded. Raw events SHA256 matches summary40fa0c9da057836fc79f0a36876b39778df4b8c9375ed95b4b779f643c7bc73a. The single native Chromium context-teardown crash was independently rerun successfully without changing tracked assertions or product.
Architect disposition: C055-214-CSP resolved by actual enforced-policy browser evidence, closing originalFR5/AC2 and superseding the earlier evidence gap. T010–T012/T014 architectural and engineering obligations are complete; no open implementation task/disposition or accepted owner risk remains. Prior full556/154 preflight, actual headers/gzip/404/non-rootUID101 Docker smoke, compatible frozen source-map-js1.2.2 graph, independent product-current review and canonical process preparation remain valid on the same effective SHA. Only sequential Analyst and live remote finalization gates remain; no gates are waived.
Open Architect dispositions: none
Architect validation evidence: No substantive post-effective change occurred. All proposed changes after aa261a7cbfd24b7cc1e739f1c4be397526d5b55c are permitted original049 verification and role-validation evidence.055 remains in progress and downstream217/215 validations are excluded from this original049 pass.


## Final Architect Validation Notes

Architect validation pass: not ready
Architect return count: 2 / 10
Architect gaps: Required exact-head OSV on published68f1d758a1c0010b2e5ccb5b9925192152dcf09b finds both brace-expansion major lines below safe compatible floors. New substantive dependency remediation supersedes original049 Architect/Analyst passes onaa261a7cbfd24b7cc1e739f1c4be397526d5b55c for merge authority.
Architect disposition: Accepted new055 taskC055-214-OSV2 for ordinary compatible lock-only advancement of BOTH1.x>=1.1.21 and5.x>=5.0.12, complete graph/frozen-install audit and full same-version localOSVscan before push, fullpreflight/rebuiltDocker verification and ordered renewed role passes on a new final effective content SHA. Preserve Analystreturn1/5 and exact-head remote gates; no suppression, manifest/owner drift, stale pass reuse or merge of published68.
Open Architect dispositions: C055-214-OSV2


## Final Architect Validation Notes

Architect validation pass: not ready
Architect return count: 3 / 10
Architect gaps: Accepted P1r4222201360 identifies real install-time promotion of staleHTTP stablecontent into a new timestamp worker cache. Headers do not establish release freshness while stringaddAll consults defaultHTTP cache.
Architect disposition: New055C055-214-FRESH narrowly authorizes install reloadRequests in one atomic batch, meaningful realHTTPfreshA→originB newinstall regression, failure/offline controls and truthfulHTTP-versus-CacheStorage docs. Consolidate this substantive generator fix with brace/security work before final verification and a new effective content SHA; preserve215 modern reload-request protocol and historicalA fixture. Earlier cache-token-only equivalence and original049rolepasses cannot authorize changed worker content; renewed ordered Architect/Analyst passes mandatory.
Open Architect dispositions: C055-214-OSV2 and C055-214-FRESH


## Final Architect Validation Notes

Architect validation pass: not ready
Architect return count: 3 / 10
Architect disposition: C055-214-OSV2 and C055-214-FRESH engineering tasks resolved by final consolidated fullpreflight556Node/160browser, completeOSVv2.3.5 scan241/0, compatible audited frozen safegraph and rebuiltDocker security/cache/gzip/404/nonroot plus changedSWCSP/offline/lazy verification. No engineering disposition remains. Final current-content independent review and renewed chronological same-SHA Architect/Analyst validations are sequential obligations; no final pass is claimed before content commit/review.
Open Architect dispositions: none
