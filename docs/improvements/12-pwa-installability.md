# ТЗ-12: PWA-манифест, иконки и установка приложения

| Поле | Значение |
|---|---|
| Приоритет | P1 |
| Категория | PWA / оффлайн |
| Оценка трудоёмкости | M |
| Статус | Предложено |
| Дата | 2026-07-11 |

## 1. Контекст и проблема

В [index.html](../../index.html) (строки 1-13) нет `<link rel="manifest">` — есть только `<meta name="theme-color" content="#12312b">` (index.html:6). В public/ лежит единственный файл — sw.js; manifest.json и иконок (192/512, maskable) нет. Grep по src/, index.html и public/ не находит ни manifest, ни beforeinstallprompt, ни apple-touch-icon. Итог: приложение имеет offline-кеширование, но **не проходит критерии installability** — нет A2HS, нет standalone-режима, нет иконки на домашнем экране. Для local-first тренажёра, который пользователь открывает без сети (в очереди на экзамен в CABA), это главный продуктовый пробел оффлайн-стратегии.

## 2. Цели

Приложение устанавливается на Android/десктоп (standalone) и корректно добавляется на домашний экран iOS.

## 3. Требования

- FR-1: `public/manifest.webmanifest`: name/short_name на русском («Cabadrive — экзамен CABA»/«Cabadrive»), `start_url: "/"`, `display: "standalone"`, `theme_color`/`background_color: "#12312b"`, `lang: "ru"`, иконки 192×192 и 512×512 + отдельные maskable (safe zone 80 %).
- FR-2: `<link rel="manifest" href="/manifest.webmanifest">` + `apple-touch-icon` 180×180 в index.html.
- FR-3: Обработчик beforeinstallprompt: событие сохраняется, в UI появляется ненавязчивая кнопка «Установить приложение» (шапка или StatusStrip); после установки/отклонения кнопка скрывается (персист решения).
- FR-4: Манифест и иконки попадают в SW-прекеш (walk по dist в generate-service-worker.mjs подхватит их автоматически — проверить исключения).
- FR-5: Unit-тест: dist содержит manifest с обязательными полями (по образцу tests/service-worker-generation.test.mjs); e2e: `<link rel="manifest">` в DOM.
- NFR-1: Иконки — из единого SVG-исходника (source в repo), растеризация в пайплайне ассетов ([ТЗ-P3](./priority/03-image-quality.md) build-images) или закоммиченные PNG.

## 4. План

- [ ] 1. Дизайн иконки (или временная типографическая) + генерация размеров
- [ ] 2. manifest.webmanifest + index.html правки
- [ ] 3. beforeinstallprompt UI
- [ ] 4. Тесты (unit dist-манифеста, e2e link)

## 5. Критерии приёмки

- AC-1: Lighthouse PWA-аудит: installable = pass (запуск на dist через `pnpm run preview`).
- AC-2: Chrome Android предлагает установку; установленное приложение открывается standalone без адресной строки (ручная проверка).
- AC-3: iOS Safari «На экран Домой» даёт иконку 180×180, не скриншот (ручная проверка).
- AC-4: Новые unit/e2e зелёные.

## 6. Риски и меры

| Риск | Вероятн. | Влияние | Мера |
|---|---|---|---|
| beforeinstallprompt не срабатывает без engagement-эвристик | Средняя | Кнопка не видна | Кнопка появляется только при полученном событии; iOS — инструкция-подсказка вместо кнопки |

## 7. Затрагиваемые файлы

`public/manifest.webmanifest` (новый), `public/icons/*` (новые), `index.html`, `src/App.tsx` (install UI), tests.

## 8. Связанные ТЗ

[ТЗ-13](./13-service-worker-reliability.md), [ТЗ-15](./15-ios-storage-persistence.md) (установка смягчает eviction-политику iOS)
