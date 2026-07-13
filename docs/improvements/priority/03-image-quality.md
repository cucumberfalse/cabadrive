# ТЗ-P3: Качество изображений — комплексная модернизация пайплайна

| Поле | Значение |
|---|---|
| Приоритет | P0 (приоритет пользователя) |
| Категория | Контент / графический пайплайн / производительность |
| Оценка трудоёмкости | XL (разбита на 5 независимых этапов) |
| Статус | Предложено |
| Дата | 2026-07-11 |

## 1. Контекст и проблема

Cabadrive — визуально-нагруженный тренажёр: страницы официального учебника GCBA, кропы иллюстраций и знаков, фотографии дорожных ситуаций в билетах. Качество этих изображений — прямая составляющая качества обучения (читаемость текста на знаках, различимость деталей дорожной сцены). Аудит выявил системную проблему: **большинство растровых изображений имеют физическое разрешение ниже, чем размер их отображения на retina-экранах**, из-за чего они выглядят размытыми («мыло»).

Измеренные факты (все числа проверены по репозиторию):

1. **Страницы учебника** рендерятся из PDF скриптом [render-manual-pdf-pages.swift](../../../scripts/render-manual-pdf-pages.swift) с параметром по умолчанию `--scale 2` → **1191×1684 px** (A4 при ~144 DPI), JPEG quality 0.9. Пример: `content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/pages/page-001.jpg` — 1191×1684, 113 КБ. Колонка контента в приложении — до 860 CSS px (`src/styles.css`, `max-width: min(860px, 100%)`); при DPR=2 нужно 1720 физических px по ширине — картинок 1191 px не хватает, мелкий текст учебника при чтении нечитаем без зума.
2. **Кропы секций** (иллюстрации внутри глав руководства) генерируются [manual-visual-content-crops.swift](../../../scripts/manual-visual-content-crops.swift). Гистограмма ширин всех JPEG в `content/assets/manuals/.../sections/` (измерено sips): **14 файлов уже 200 px, 21 — 200–399 px, 11 — 400–599 px, 24 — 600–799 px** и лишь ~30 файлов шире 1000 px (в т. ч. sheet-рендеры 2976×4209 для приложения IV, сделанные при scale ~5 — доказательство, что пайплайн УЖЕ умеет рендерить с высоким разрешением). Кроп 585×125 px (`ch1-sustainable-mobility/space-comparison-50-people-source.jpg`), растянутый на колонку 780–860 CSS px, на retina размыт в 2,5–3 раза.
3. **Фотографии билетов** — сторонний источник (`content/assets/questions/source-bandinopla-testdeconducir-b/*.jpg`): 322 файла, типичная ширина **574 px** (максимум в выборке — 962 px). Контейнер `.question-image-frame` отображает их до **620 CSS px** (`src/styles.css:3558`: `width: min(100%, 620px, ...)`), т. е. при DPR=2 требуется 1240 px — фото растягивается более чем вдвое сверх натурального размера. Исходников лучшего качества нет — единственный путь = AI-апскейл или замена источника.
4. **Современные форматы не используются**: в `content/assets` — 1386 SVG, 592 JPG, 322 PNG; WebP/AVIF — 0 (grep по `src`, `scripts` пуст). Для одинакового визуального качества AVIF/WebP на 30–60 % легче JPEG — при прекеше сервис-воркером ~40 МБ ассетов это прямые мегабайты трафика.
5. **`<img>` без `srcset`/`sizes`**: все ~25 мест рендера изображений в [App.tsx](../../../src/App.tsx) используют один `src` (grep `srcset` пуст). Мобильный клиент с экраном 390 px скачивает ту же страницу учебника 1191 px, что и десктоп, а десктоп-retina не может получить версию больше.
6. **Часть `<img>` без `width`/`height`** → layout shift: `QuestionImageFigure` (App.tsx:311–324) не задаёт габариты до `onLoad` (детали — в [ТЗ-P1: юзабилити](./01-usability.md), раздел «Обратная связь»).
7. **Исходные PDF есть в репозитории** — перерендер возможен без внешних зависимостей от источника: `content/official-documents/originals/gcba-manual-vehiculo-4-ruedas-2023.pdf` (68 МБ, 200 стр.), `gcba-guia-practica-siniestros-viales.pdf`, `content/sources/originals/manual-procedimientos-abril-2025.pdf`.
8. **Генерация привязана к macOS**: все три генератора (`render-manual-pdf-pages.swift`, `manual-visual-content-crops.swift`, `manual-sign-crop-resolution.swift`) используют CoreGraphics/ImageIO — CI на Linux не может перегенерировать ассеты (см. связанное [ТЗ-20](../20-cross-platform-asset-generation.md)).
9. **Кеш-ловушка**: nginx отдаёт `/content/assets/` с `Cache-Control: immutable, max-age=31536000` при НЕ-хешированных путях (`nginx.conf:11-14`) — заменённая под тем же именем картинка не доедет до клиентов год. Любое улучшение качества обязано решить версионирование путей (см. [ТЗ-14](../14-nginx-caching-security.md)).

### Классификация изображений и потолок улучшения

| Класс | Где лежит | Текущее качество | Потолок улучшения |
|---|---|---|---|
| (a) Рендеры страниц PDF | `assets/manuals/**/pages/` (200 JPG, 31 МБ) | 1191×1684 (~144 DPI) | Перерендер из PDF до 300–400 DPI — без потерь, вектор в PDF |
| (b) Кропы секций из PDF | `assets/manuals/**/sections/` (~100 JPG, 24 МБ) | 70 % уже 800 px | Перегенерация кропов с большим renderScale — без потерь |
| (c) Фото билетов (сторонние) | `assets/questions/` (322 JPG, 9.6 МБ) | 574 px, JPEG-артефакты | AI-апскейл ×4 + даунскейл до ×2–2.3 (с ручным QA) |
| (d) Генерированные обучающие SVG | `assets/learning/generated/v1/` (SVG 640×480) | Вектор — качество ок | Только оптимизация размера (svgo) |
| (e) SVG знаков из Anexo L | `assets/primary-sources/decreto-779-.../` (большинство из 1386 SVG) | Вектор — качество ок | Только оптимизация размера (svgo) |

## 2. Цели

1. Ни одно растровое изображение не отображается с масштабом более 1.0× от натурального размера при DPR=2 на самой широкой раскладке (т. е. натуральная ширина ≥ 2× CSS-ширины контейнера).
2. Текст на страницах учебника и кропах читаем без зума (перерендер ≥300 DPI).
3. Суммарный трафик изображений снижен ≥30 % за счёт AVIF/WebP + srcset, несмотря на рост разрешений.
4. Автоматический QA-гейт качества (перцептивные метрики) встроен в `validate:content` — деградация картинок ловится CI, а не глазами.
5. Пайплайн воспроизводим одной командой и документирован.

## 3. Не-цели

- Замена стороннего банка фотографий билетов на собственную съёмку (отдельное продуктовое решение).
- Перевод генерации на Linux (переносимость — [ТЗ-20](../20-cross-platform-asset-generation.md); здесь используем существующие Swift-скрипты, где они уже работают, и добавляем кросс-платформенные инструменты только для НОВЫХ шагов).
- Редизайн вёрстки изображений (размеры контейнеров не меняем).
- Оптимизация веса git-репозитория (см. [ТЗ-19](../19-repo-size-lfs.md)); здесь только не ухудшаем ситуацию осознанно.

## 4. Текущее состояние (как работает сейчас)

- `pnpm build` = `validate:content` → `sync-public-assets.mjs` (копия `content/assets` → `public/content/assets`) → `vite build` → `generate-service-worker.mjs`. Картинки не трансформируются нигде — что закоммичено в `content/assets`, то и уезжает в прод.
- `assetUrl(localPath)` в `src/data/content.ts` просто префиксует путь слэшем; никакого манифеста вариантов не существует.
- Метаданные изображений с sha256 уже есть: `content/image-metadata/question-images.manifest.json` (+ шарды `question-images/`) и валидируются `content-image-metadata.mjs` — на эту инфраструктуру можно опереться для версионирования и QA.
- Аудит читаемости картинок с испанским текстом — `manual-guide-image-readability-translations-audit.mjs` — проверяет наличие переводов, но НЕ разрешение/резкость.
- renderScale в конфигах кропов знаков: 12, 20, 36 (высокие — для мелких знаков), но сами кропы секций сгенерированы с низким эффективным разрешением (см. гистограмму выше).

## 5. Требования

Функциональные:
- **FR-1**: Страницы учебника (класс a) перерендерены с разрешением ≥300 DPI (≈2481×3508 для A4) и доставляются в ≥2 ширинах через srcset.
- **FR-2**: Все кропы секций (класс b) с натуральной шириной < 1600 px перегенерированы так, чтобы ширина была ≥ min(1600 px, 2× CSS-ширина контейнера).
- **FR-3**: Все фото билетов (класс c) апскейлены до ширины ≥1200 px с ручной верификацией отсутствия артефактов на выборке и полным журналом обработки.
- **FR-4**: Для классов a–c генерируются AVIF + WebP + JPEG-фолбэк в наборе ширин; `<img>` в App.tsx переведены на `<picture>`/`srcset` + обязательные `width`/`height`.
- **FR-5**: SVG (классы d, e) прогнаны через svgo с безопасным конфигом; визуальная идентичность подтверждена QA-гейтом.
- **FR-6**: Новый скрипт `scripts/build-images.mjs` — единая точка генерации производных изображений + `content/image-derivatives.manifest.json`.
- **FR-7**: Перцептивный QA-гейт (DSSIM) встроен в `validate:content`; провал порога — ошибка CI.
- **FR-8**: Пути производных изображений содержат контент-хеш (решение кеш-ловушки immutable).

Нефункциональные:
- **NFR-1**: Пайплайн идемпотентен: повторный запуск без изменения исходников не меняет ни одного байта производных (детерминированные параметры кодирования, без таймстампов).
- **NFR-2**: Основные шаги (кроме одноразового AI-апскейла и Swift-рендера) работают на macOS и Linux.
- **NFR-3**: Полный прогон build-images на всех ассетах ≤ 15 мин на M-серии Mac; инкрементальный (по mtime/sha) — ≤ 1 мин при отсутствии изменений.
- **NFR-4**: Прирост веса раздаваемых ассетов (dist) ≤ +25 % при выполнении FR-1..FR-4 (компенсация форматами); прирост git-репозитория задокументирован в PR.

## 6. Предлагаемое решение

### 6.0. Архитектура пайплайна (обзор)

```
content/official-documents/originals/*.pdf          content/assets/questions/*.jpg (574px)
        │ (1) pdftoppm -r 300 (или Swift --scale 4)         │ (2) Real-ESRGAN x4 → PNG
        ▼                                                    ▼
content/assets-masters/**  (PNG-мастера, максимальное разрешение)
        │ (3) scripts/build-images.mjs  (sharp: resize → AVIF/WebP/JPEG, ширины 480/800/1200/1600/2400)
        ▼
public/content/img/<class>/<id>-<w>.<hash8>.<ext>  +  content/image-derivatives.manifest.json
        │ (4) QA-гейт: dssim ≤ 0.01 против мастера; ssimulacra2 ≥ 70 на сэмплах
        │ (5) svgo для SVG-классов
        ▼
src: assetSrcSet(id) — хелпер собирает srcset/sizes из манифеста
```

Ключевое решение: производные НЕ генерируются внутри Vite (vite-imagetools отвергнут — см. 6.7), а создаются pre-build-скриптом с манифестом. Это позволяет: встроить QA-гейты и AI-апскейл, читать манифест из контент-валидаторов и Swift-скриптов, кешировать производные между сборками.

### 6.1. Класс (a): перерендер страниц учебника

Два равнозначных пути; выбрать первый, если регенерацию делает владелец macOS-машины (сегодняшний режим), второй — если сразу закладываем переносимость.

**Путь A (существующий Swift-скрипт, минимальное изменение):**
```bash
swift scripts/render-manual-pdf-pages.swift \
  content/official-documents/originals/gcba-manual-vehiculo-4-ruedas-2023.pdf \
  content/assets-masters/manuals/gcba-manual-vehiculo-4-ruedas-2023/pages \
  --scale 4 --quality 0.95
```
`--scale 4` даёт 2382×3368 (~288 DPI) — достаточно для FR-1. Скрипт уже поддерживает параметр (см. `parseArguments`, scripts/render-manual-pdf-pages.swift:33-45).

**Путь B (кросс-платформенный, рекомендуемый как целевой):** poppler `pdftoppm`.
```bash
brew install poppler        # Linux: apt install poppler-utils
pdftoppm -png -r 300 -cropbox \
  content/official-documents/originals/gcba-manual-vehiculo-4-ruedas-2023.pdf \
  content/assets-masters/manuals/gcba-manual-vehiculo-4-ruedas-2023/pages/page
```
Пояснение флагов: `-png` — lossless-мастер (JPEG-мастер запрещён: перекодирование JPEG→AVIF из уже сжатого источника накапливает артефакты); `-r 300` — 300 DPI (A4 → 2481×3508; для страниц с самым мелким текстом допускается `-r 400`); `-cropbox` — рендер по CropBox, отсекает возможные типографские поля MediaBox; `page` — префикс имён (`page-001.png`, нумерация с ведущими нулями при >99 страниц — в скриптах парсить glob'ом, не хардкодить формат). Быстрая альтернатива для больших батчей — `mutool draw -r 300 -o out/page%03d.png input.pdf` (brew install mupdf-tools); на типографике результат эквивалентен, банding-режим `-B 512` снижает пиковую память.

Мастера кладутся в **новый каталог `content/assets-masters/`** (не в раздаваемый `content/assets/`!), финальные производные для раздачи создаёт build-images (6.4). Важно: JPEG-страницы в `content/assets/.../pages/` сейчас кешируются сервис-воркером лениво и валидируются sha256-пинами — их замена требует синхронного обновления манифестов метаданных (прогнать существующие `--write`-режимы аудитов).

### 6.2. Класс (b): перегенерация кропов секций

Кропы описаны конфигами с полями `renderScale`/`probeRenderScales` (структуры `CropConfig`/`CropTarget` в scripts/manual-visual-content-crops.swift:8-38). Порядок:

1. Инвентаризация: расширить `manual-guide-visual-completeness-audit.mjs` отчётом «натуральная ширина против целевой»: для каждого кропа целевая ширина = 2× CSS-ширина его контейнера (по классу блока; таблица соответствий блок→контейнер составляется один раз по styles.css: `manual-source-figure` → 860 px → цель 1720 px; карточки `source-image-cards` → ~400 px → цель 800 px; и т. д.).
2. Для каждого кропа с шириной ниже целевой поднять `renderScale` в его конфиге пропорционально (кроп 585 px при scale 2 → scale 6 даст 1755 px). Ограничение сверху: не превышать эквивалент 400 DPI источника — выше этого PDF-растр не добавляет деталей.
3. Перегенерировать: существующей Swift-лентой (`manual-visual-content-crops.swift` читает конфиг и пишет evidence с фактическими размерами — механизм probeRenderScales уже поддерживает подбор масштаба).
4. Обновить sha256-пины и evidence (`--write`-режимы соответствующих аудитов), прогнать `pnpm run validate:content`.

### 6.3. Класс (c): AI-апскейл фотографий билетов

Инструмент: **Real-ESRGAN (realesrgan-ncnn-vulkan)** — работает на Apple Silicon GPU через MoltenVK, без Python:

```bash
# Установка (brew-формулы нет):
# 1) скачать realesrgan-ncnn-vulkan-*-macos.zip с github.com/xinntao/Real-ESRGAN-ncnn-vulkan/releases
# 2) распаковать в ~/tools/realesrgan (бинарь ищет папку models/ РЯДОМ с собой — не разносить)
xattr -dr com.apple.quarantine ~/tools/realesrgan && chmod +x ~/tools/realesrgan/realesrgan-ncnn-vulkan
# Актуальный поддерживаемый форк с теми же флагами + модели ultrasharp/remacri: github.com/upscayl/upscayl-ncnn (бинарь upscayl-bin)

# Батч: папка → папка, модель для реальных фото, выход PNG:
~/tools/realesrgan/realesrgan-ncnn-vulkan \
  -i content/assets/questions/source-bandinopla-testdeconducir-b \
  -o content/assets-masters/questions/source-bandinopla-testdeconducir-b \
  -n realesrgan-x4plus -s 4 -f png -j 2:2:2
```
Пояснение флагов: `-n realesrgan-x4plus` — универсальная модель для реальных фото, обучена в т. ч. на JPEG-деградациях (наш случай: пережатые 574 px фото); НЕ использовать `-anime`-модель (испортит фото); `-s 4` — масштаб ×4 (574→2296 px); `-f png` — lossless-промежуток; `-t 0` — авторазмер тайла (уменьшить до 256 при ошибке `vkQueueSubmit failed`); `-j 2:2:2` — потоки load:proc:save для загрузки GPU.

**Обязательный приём против артефактов**: финальные производные делать даунскейлом ×4-результата до ×2–2.3 (2296 → 1200–1300 px) — даунскейл после апскейла прячет «пластиковость» и галлюцинации текстур. **Обязательный ручной QA**: Real-ESRGAN может ломать мелкий текст (номерные знаки, надписи на табличках) — метрики этого не ловят. Процедура: (1) прогнать A/B на выборке 15 фото тремя моделями — `realesrgan-x4plus`, `realesrnet-x4plus` (нейтральнее, меньше галлюцинаций), `remacri` (из upscayl-ncnn, часто лучше на уличных сценах); (2) выбранной моделью обработать все 322; (3) ручной просмотр каждого фото с текстом/знаками в кадре (фильтр по `content/image-metadata/question-images.manifest.json`); (4) файлы с артефактами — заменить на бикубический ресайз исходника (честное «мыло» лучше галлюцинаций) и пометить в манифесте `"upscale": "rejected"`.

Для апскейла эталона нет, полноссылочные метрики неприменимы напрямую; автогейт: даунскейл результата обратно к 574 px и `dssim ≤ 0.02` против исходника (ловит грубые поломки геометрии/цвета).

### 6.4. Сквозной шаг: `scripts/build-images.mjs` (sharp)

```bash
pnpm add -D sharp globby p-limit execa   # sharp 0.34.x, пребилды для macOS arm64 и Linux
# в package.json уже есть pnpm.onlyBuiltDependencies — добавить "sharp"
```

Скрипт (структура; стиль — как у существующих scripts/*.mjs, ESM + node:fs):
```js
import sharp from "sharp";
const WIDTHS = [480, 800, 1200, 1600, 2400];
// для каждого мастера из content/assets-masters/**:
const img = sharp(file, { failOn: "error" });           // падать на битых файлах
const { width: srcW } = await img.metadata();
for (const w of WIDTHS.filter((w) => w <= srcW)) {      // withoutEnlargement — не растягиваем
  const pipe = img.clone().resize({ width: w, withoutEnlargement: true, kernel: "lanczos3" });
  await pipe.clone().avif({ quality: 55, effort: 4, chromaSubsampling: "4:2:0" }).toFile(out(w, "avif"));
  await pipe.clone().webp({ quality: 82, effort: 4 }).toFile(out(w, "webp"));
  await pipe.clone().jpeg({ quality: 82, mozjpeg: true, progressive: true }).toFile(out(w, "jpg"));
}
```
Критичные настройки: `.clone()` обязателен (pipeline нельзя переиспользовать); шкала качества AVIF ≠ JPEG: `avif quality 55` визуально ≈ JPEG 80; **для страниц учебника (текст!)** — отдельный профиль: `webp({ quality: 90 })` и `avif({ quality: 70, chromaSubsampling: "4:4:4" })` — сабсемплинг 4:4:4 убирает цветное мыло на тексте; параллелизм ограничить `p-limit(os.cpus().length)` — AVIF в 5–15 раз медленнее WebP и прожорлив по памяти; sharp по умолчанию стирает EXIF (для веба — плюс) и конвертирует ICC в sRGB.

Имя файла: `<basename>-<w>.<sha256(содержимого).slice(0,8)>.<ext>` → решает FR-8 (иммутабельные пути честны). Манифест `content/image-derivatives.manifest.json`: `{ sourcePath, sourceSha256, variants: [{ width, format, path, bytes, dssim }] }` — канонический JSON тем же `canonicalJson`-хелпером, что в `content-shards.mjs` (не плодить третью копию — см. [ТЗ-21](../21-content-scripts-refactoring.md)).

Инкрементальность: пропускать мастера, чей `sourceSha256` уже в манифесте и все варианты существуют (NFR-3).

### 6.5. QA-гейт: перцептивные метрики

```bash
brew install dssim      # Rust-реализация kornelski; Linux: cargo install dssim
```
В `build-images.mjs` после кодирования каждого варианта: декодировать вариант, привести к размеру эталона (sharp resize) и `execa("dssim", [refPng, candPng])`. Шкала DSSIM: 0 = идентичны; пороги: **< 0.003 отлично, 0.003–0.01 приемлемо, > 0.01 — брак** → автоматический пересжим с quality +5 (одна повторная попытка), после второго провала — ошибка скрипта. Выборочная контрольная метрика точнее — SSIMULACRA2 (`brew install jpeg-xl`, бинарь `ssimulacra2`; шкала: 70+ высокое качество, 80+ практически без потерь): гонять на случайных 5 % вариантов, гейт ≥ 70. Чисто-JS ssim.js не использовать — классический SSIM плохо коррелирует с восприятием на артефактах современных кодеков.

Новый валидатор `scripts/content-image-derivatives.mjs` (по образцу существующих аудитов, с `--write` для evidence): (1) каждый мастер имеет полный набор вариантов; (2) sha мастера совпадает с манифестом; (3) все dssim в манифесте ≤ 0.01; (4) натуральная ширина максимального варианта ≥ целевой ширины класса (FR-1/FR-2 закрепляются навсегда). Подключить в цепочку `validate:content` в package.json.

### 6.6. SVG (классы d, e): svgo

```bash
pnpm add -D svgo   # v4.x: removeViewBox и removeTitle больше НЕ в дефолтном пресете
svgo -rf content/assets/learning -o content/assets/learning --multipass
```
Конфиг `svgo.config.mjs`: `multipass: true`; в `preset-default` overrides: `removeViewBox: false` (фиксация намерения), `cleanupIds: false` (если есть `<use href="#...">` — проверить grep'ом до включения), `inlineStyles: false`; плагины `removeDimensions` (width/height → масштабирование через CSS; НЕ сочетать с removeViewBox) и `convertPathData` с `floatPrecision: 2` (точность 1 может исказить мелкие иконки). Гейт: рендер до/после в PNG через sharp + dssim ≤ 0.001 на выборке 30 файлов. Ожидаемая экономия на 1386 SVG — 20–40 % веса класса.

### 6.7. Доставка в UI: srcset и `<picture>`

Хелпер в `src/data/content.ts` рядом с `assetUrl`:
```ts
export function assetSrcSet(sourcePath: string): { srcSet: string; fallbackSrc: string; width: number; height: number } | null
```
— читает `image-derivatives.manifest.json` (импорт JSON в бандл; манифест лёгкий — только пути/числа). Компоненты (`QuestionImageFigure`, `ManualSourceFigure`, блоки `source-image-cards` и др. — все ~25 мест `<img>` в App.tsx) переводятся на:
```tsx
<picture>
  <source type="image/avif" srcSet={avifSrcSet} sizes="(max-width: 760px) 100vw, 620px" />
  <source type="image/webp" srcSet={webpSrcSet} sizes="..." />
  <img src={jpegFallback} width={w} height={h} loading="lazy" decoding="async" alt={...} />
</picture>
```
`sizes` задаётся по фактическим контейнерам из styles.css (620 px для вопросов, 860 px для manual-figure и т. д.). Обязательные `width`/`height` на `<img>` закрывают CLS (FR-4). **vite-imagetools сознательно не используется**: он трансформирует в момент бандлинга, куда не встроить AI-апскейл, QA-гейты и контент-валидацию до коммита; query-директивы в импортах не типизируются; манифест-подход читаем также из Node-валидаторов и Swift-скриптов.

Сопутствующие обновления: `generate-service-worker.mjs` — правила прекеша/ленивого кеширования расширить на новые пути `/content/img/` (страницы учебника оставить в lazy-режиме, как сейчас pages-JPG); `sync-public-assets.mjs` — не копировать `assets-masters/` в public; nginx — новые хешированные пути честно immutable.

## 7. План реализации

Этапы независимы и мержатся по одному PR (соответствует процессу репозитория «один слайс = один PR»).

**Этап 1 — инфраструктура (без визуальных изменений):**
- [ ] `scripts/build-images.mjs` + sharp + манифест производных + инкрементальность
- [ ] `scripts/content-image-derivatives.mjs` (валидатор) + подключение в `validate:content`
- [ ] `svgo.config.mjs` + прогон SVG-классов + dssim-гейт на выборке
- [ ] Хелпер `assetSrcSet()` + unit-тест (node --test, по образцу tests/domain.test.mjs)

**Этап 2 — фото билетов (класс c, максимальный видимый эффект):**
- [ ] A/B трёх моделей на выборке 15 фото; зафиксировать выбор в `docs/improvements/priority/03-image-quality-decisions.md`
- [ ] Батч-апскейл 322 фото → мастера; ручной QA текстовых кадров; журнал upscale-статусов в манифесте
- [ ] Производные + перевод `QuestionImageFigure` на `<picture>`/srcset + `width`/`height`
- [ ] Обновить sha256-пины question-images; `pnpm run validate:content` зелёный

**Этап 3 — страницы учебника (класс a):**
- [ ] Перерендер 200 страниц при 300 DPI (путь A или B) в мастера
- [ ] Производные (профиль «текст»: 4:4:4) + srcset в обоих ридерах мануала
- [ ] Обновить ленивое SW-кеширование под новые пути; проверить оффлайн-e2e (существующий тест офлайн-перезагрузки)

**Этап 4 — кропы секций (класс b):**
- [ ] Отчёт «ширина против цели» в visual-completeness-audit; таблица целевых ширин по типам блоков
- [ ] Поднять renderScale в конфигах, перегенерировать Swift-лентой, обновить evidence
- [ ] Производные + srcset в блоках руководства

**Этап 5 — доставка и закрепление:**
- [ ] Все `<img>` App.tsx на манифестных путях; grep-тест «нет прямых src на /content/assets для растров»
- [ ] Обновить nginx/SW правила; замерить до/после (см. §12) и записать в PR

## 8. Критерии приёмки

- **AC-1**: `node scripts/content-image-derivatives.mjs` завершается 0; отчёт подтверждает: для каждого растра max-вариант ≥ 2× CSS-ширины контейнера его класса.
- **AC-2**: Страница учебника page-069 (таблицы скоростей): текст читается при 100 % зуме на 2× DPR (ручная процедура: открыть раздел «Скорость», сравнить скриншоты до/после).
- **AC-3**: Все 322 фото билетов имеют вариант ≥1200 px; в манифесте нет незаполненных upscale-статусов; список `rejected` приложен к PR.
- **AC-4**: В HTML рендерится `<picture>` с AVIF/WebP source для вопросов и учебника (проверяется новым e2e-шагом: `page.locator('picture source[type="image/avif"]')`).
- **AC-5**: Все dssim в манифесте ≤ 0.01; выборочные ssimulacra2 ≥ 70.
- **AC-6**: Ни один `<img>` растровых классов без `width`/`height` (grep/e2e-проверка).
- **AC-7**: Суммарный вес изображений, скачиваемых при первом открытии LearnView на 390 px вьюпорте, снижен ≥ 25 % (замер через Playwright route-логирование до/после).
- **AC-8**: Повторный запуск `build-images.mjs` без изменений исходников не меняет байты производных (NFR-1, проверка git status).

## 9. План тестирования

- Unit (node --test): `assetSrcSet()` — сборка srcset из фикстурного манифеста; валидатор производных — на фикстурах с намеренно «плохим» dssim.
- E2e (Playwright): AVIF-source присутствует; изображение вопроса отдаёт вариант ≤ 800 px на мобильном проекте (Pixel 7) и ≥ 1200 px на десктопе (проверка через request URL); отсутствие layout shift — сравнение boundingBox карточки до/после загрузки изображения.
- Ручной QA: протокол просмотра апскейленных фото (этап 2); скриншот-сравнение страниц учебника (этап 3).
- Регрессия: полный `pnpm run preflight` на каждом этапе.

## 10. Риски и меры

| Риск | Вероятн. | Влияние | Мера |
|---|---|---|---|
| Real-ESRGAN галлюцинирует текст на знаках/номерах | Высокая | Искажение учебного материала | Обязательный ручной QA текстовых кадров; fallback на бикубик; статус в манифесте |
| Рост git-репо (уже 433 МБ .git) от новых мастеров | Высокая | Замедление клона | Мастера классов a/b НЕ коммитить (воспроизводимы из PDF: команда в манифесте); коммитить только производные; вопрос LFS — ТЗ-19 |
| AVIF-кодирование медленное → долгий пайплайн | Средняя | DX | Инкрементальность по sha; p-limit; effort 4 (не 9) |
| Старые клиенты с immutable-кешем не увидят новые пути | Низкая | UX | Новые пути = новые URL — immutable-ловушка не срабатывает по определению |
| SW-прекеш вырастет из-за трёх форматов | Средняя | Оффлайн-трафик | Прекешировать только JPEG-фолбэк ИЛИ только AVIF; runtime-кеш подберёт фактически запрошенный формат (правки generate-service-worker.mjs, связка с [ТЗ-13](../13-service-worker-reliability.md)) |
| Byte-exact evidence-гейты сломаются при перегенерации | Высокая | Красный CI | Прогонять соответствующие `--write`-режимы в том же PR; последовательность зафиксирована в плане |

## 11. Затрагиваемые файлы

| Файл | Тип изменения |
|---|---|
| `scripts/build-images.mjs` | новый |
| `scripts/content-image-derivatives.mjs` | новый |
| `svgo.config.mjs` | новый |
| `content/assets-masters/**` | новый (частично не коммитится) |
| `content/image-derivatives.manifest.json` | новый |
| `package.json` | скрипты `build:images`, зависимости sharp/svgo/globby/p-limit/execa, цепочка validate:content |
| `src/data/content.ts` | хелпер assetSrcSet |
| `src/App.tsx` | ~25 мест `<img>` → `<picture>`/srcset |
| `scripts/generate-service-worker.mjs` | правила кеширования новых путей |
| `scripts/sync-public-assets.mjs` | исключение assets-masters |
| `nginx.conf` | location для хешированных путей |
| конфиги кропов (content/validation/manual-guide/**) | renderScale |
| `tests/e2e/app.spec.ts`, новые tests/*.test.mjs | проверки AC |

## 12. Метрики успеха (до/после)

| Метрика | До | Цель |
|---|---|---|
| Ширина страницы учебника | 1191 px (~144 DPI) | ≥2481 px (300 DPI) |
| Кропы секций уже 800 px | ~70 из ~102 | 0 (кроме физически мелких фрагментов источника) |
| Ширина фото билетов | 574 px (типично) | ≥1200 px |
| Форматы доставки | JPEG/PNG только | AVIF + WebP + JPEG-фолбэк |
| `<img>` с srcset | 0 | 100 % растровых классов |
| Трафик изображений LearnView (mobile) | базовый замер | −25 % и более |
| Автоматический контроль качества | только sha256 | dssim/ssimulacra2-гейты в CI |
