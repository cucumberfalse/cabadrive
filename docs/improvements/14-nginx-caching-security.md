# ТЗ-14: nginx — исправление кеш-политики, security-заголовки, сжатие

| Поле | Значение |
|---|---|
| Приоритет | P1 |
| Категория | Инфраструктура / безопасность |
| Оценка трудоёмкости | S |
| Статус | Предложено |
| Дата | 2026-07-11 |

## 1. Контекст и проблема

1. **Инвертированная кеш-политика** ([nginx.conf](../../nginx.conf):7-19): `/content/assets/` отдаётся с `Cache-Control: public, max-age=31536000, immutable`, хотя пути там НЕ хешированные (page-001.jpg, кропы, картинки вопросов — `assetUrl()` в src/data/content.ts:349-351 просто префиксует слэш). Исправленная под тем же путём картинка не доедет до клиентов год; смена имени SW-кеша не поможет — новый прекеш-fetch удовлетворится из HTTP-кеша браузера теми же устаревшими байтами. При этом действительно immutable хешированные Vite-бандлы `/assets/*-<hash>.js|css` не имеют явного Cache-Control вовсе.
2. **Нет security-заголовков**: CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy отсутствуют (весь nginx.conf — 370 байт).
3. **Нет gzip/brotli**: мегабайтные JSON-несущие JS-чанки отдаются несжатыми — прямое замедление первой загрузки и установки оффлайна.
4. Образ — обычный nginx:1.29-alpine (master от root), не unprivileged.

## 2. Цели

Правильная инвалидация контента; базовый security-профиль статического SPA; сжатие текстовых ответов.

## 3. Требования

- FR-1: `location /assets/` → `max-age=31536000, immutable`; `location /content/assets/` → `max-age=86400` + `stale-while-revalidate=604800` (после перехода на хешированные пути картинок в [ТЗ-P3](./priority/03-image-quality.md) новые пути `/content/img/` получают immutable честно).
- FR-2: Заголовки: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (камера/микрофон/геолокация off) и CSP: `default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'` — приложение local-first без внешних запросов (закреплено e2e «no external requests»), поэтому CSP строгая. Проверить инлайн-стили/скрипты в index.html до включения (grep style=/onload=; Vite при сборке инлайнов скриптов не создаёт).
- FR-3: `gzip on` для text/html, application/javascript, application/json, image/svg+xml, text/css (gzip_min_length 1024, gzip_comp_level 6); brotli — опционально (требует ngx_brotli, в стоковом alpine-образе нет — не городить кастомную сборку ради него).
- FR-4: Базовый образ → `nginxinc/nginx-unprivileged:1.29-alpine` (порт 8080 уже используется — совместимо).
- FR-5: docker-runtime тест расширяется проверками заголовков (curl -I: immutable на /assets/, nosniff, CSP, Content-Encoding: gzip при Accept-Encoding).
- NFR-1: e2e «no external requests» и офлайн-сценарии зелёные.

## 4. План

- [ ] 1. Кеш-локации + gzip + заголовки в nginx.conf
- [ ] 2. CSP в report-режиме локальной проверки (консоль браузера на полном прогоне e2e) → enforce
- [ ] 3. unprivileged-образ в Dockerfile
- [ ] 4. Расширение tests/docker-runtime.test.mjs

## 5. Критерии приёмки

- AC-1: `curl -I` подтверждает все заголовки FR-1..FR-3 (закреплено docker-тестом).
- AC-2: Консоль браузера без CSP-violation на всех экранах (полный e2e-прогон против Docker-образа).
- AC-3: Изменённая картинка под нехешированным путём доезжает до клиента ≤ 24 ч (осмотр заголовков; сценарная проверка не требуется).
- AC-4: `docker compose exec` — nginx-процессы не под root.

## 6. Риски и меры

| Риск | Вероятн. | Влияние | Мера |
|---|---|---|---|
| CSP сломает инлайн-стили Vite/React | Средняя | Белый экран | style-src 'unsafe-inline' оставлен; аудит консоли до enforce |
| unprivileged-образ — иные пути pid/чтения | Низкая | Контейнер не стартует | Официальный образ решает из коробки; docker-тест ловит |

## 7. Затрагиваемые файлы

`nginx.conf`, `Dockerfile`, `tests/docker-runtime.test.mjs`.

## 8. Связанные ТЗ

[ТЗ-P3](./priority/03-image-quality.md) (хешированные пути), [ТЗ-13](./13-service-worker-reliability.md)
