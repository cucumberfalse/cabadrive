import type { ManualGuideSectionContent } from "../manualGuide";

const assetRoot =
  "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/app4-signs-regulatory";

const officialSignException = {
  kind: "official-traffic-sign-source-as-is",
  visibleSpanishScope: "official-sign-image-only",
  sourceAsIs: true
} as const;

export const app4SignsRegulatorySection: ManualGuideSectionContent = {
  id: "app4-signs-regulatory-content",
  sectionId: "app4-signs-regulatory",
  titleRu: "Предписывающие",
  sourcePages: [185, 186],
  sourceTitleEs: "Reglamentarias",
  status: "implemented",
  styleTokenFamilies: [
    "manual-prose",
    "manual-section-heading",
    "manual-callout-blue",
    "manual-source-artwork",
    "manual-legal-detail"
  ],
  visualEvidence: {
    checkerStatus: "pass",
    sourceScreenshots: [
      "content/validation/manual-guide/app4-signs-regulatory/page-185-regulatory-source-crop.jpg",
      "content/validation/manual-guide/app4-signs-regulatory/page-186-regulatory-source-crop.jpg"
    ],
    russianScreenshots: [
      "content/validation/manual-guide/app4-signs-regulatory/app4-signs-regulatory-desktop.png",
      "content/validation/manual-guide/app4-signs-regulatory/app4-signs-regulatory-mobile.png"
    ],
    notes: [
      "Pages 185-186 are implemented with source-as-is traffic sign sheet crops extracted from the official PDF source.",
      "No sign pixels are translated, recolored, cleaned, masked, retouched, reconstructed, or redrawn.",
      "Russian explanations are adjacent to and below the images as selectable DOM text."
    ]
  },
  blocks: [
    {
      id: "regulatory-role",
      kind: "lead",
      sourceTextEs: "Reglamentarias. De prohibicion, de restriccion, de prioridad y de fin de prescripcion.",
      textRu:
        "Регулирующие знаки сообщают водителю обязательное правило: запрет, ограничение, приоритет или конец ранее действовавшего предписания. Сами знаки на листах идут на испанском как визуальные образцы."
    },
    {
      id: "regulatory-groups",
      kind: "list",
      titleRu: "Как читать эту группу",
      sourceTextEs:
        "De prohibicion. De restriccion. De prioridad. De fin de prescripcion.",
      itemsRu: [
        "Запрещающие знаки обычно сообщают, какое действие нельзя выполнять: въезд, поворот, обгон, остановку, стоянку или движение определенного типа транспорта.",
        "Ограничивающие знаки задают пределы или условия движения: скорость, массу, высоту, ширину, длину, дистанцию, направление или обязательный режим.",
        "Знаки приоритета показывают, кто должен уступить или кто имеет преимущество на конкретном участке.",
        "Знаки окончания предписания отменяют ранее действовавший запрет или ограничение."
      ]
    },
    {
      id: "regulatory-focused-signs",
      kind: "source-image-cards",
      titleRu: "Крупный пример запрещающего знака",
      sourceTextEs: "R.1 NO AVANZAR.",
      cards: [
        {
          id: "app4-regulatory-no-avanzar-source-card",
          titleRu: "Движение прямо запрещено",
          displayMode: "full-width",
          maxDisplayWidthPx: 200,
          minDisplayWidthPx: 200,
          sourcePage: 185,
          sourceRegion: { x: 32, y: 85, width: 200, height: 145 },
          assetPath: `${assetRoot}/no-avanzar-source-as-is.jpg`,
          altRu:
            "Знак R.1 NO AVANZAR с испанской подписью под знаком.",
          visibleSpanish: true,
          officialSignException,
          termTranslations: [
            { termEs: "NO AVANZAR", translationRu: "Движение прямо запрещено" }
          ],
          bodyRu:
            "Здесь знак показан отдельно и крупнее, чем на обзорном листе. Русская расшифровка дана ниже, а изображение знака и испанская подпись внутри картинки не менялись."
        }
      ],
      visualNotes: [
        "The focused card uses the retained official Anexo L image for the R.1 sign because the CABA Appendix IV page-sheet raster is source-limited.",
        "Only the external catalog caption is explained in Russian as selectable text below the image.",
        "The sign body, arrow, red prohibition mark, and Spanish source caption remain protected image pixels."
      ]
    },
    {
      id: "regulatory-anexo-panels",
      kind: "source-image-cards",
      titleRu: "Крупные панели знаков из Anexo L",
      sourceTextEs:
        "Sistema de señalización vial uniforme. Señales reglamentarias.",
      cards: [
        {
          id: "app4-regulatory-anexo-panel-01-source-card",
          titleRu: "Запрещающие знаки: въезд и виды транспорта",
          displayMode: "full-width",
          maxDisplayWidthPx: 615,
          minDisplayWidthPx: 615,
          sourcePage: 185,
          sourceRegion: { x: 0, y: 0, width: 615, height: 743 },
          assetPath: `${assetRoot}/anexo-regulatory-panel-01-source-as-is.jpg`,
          altRu:
            "Панель Anexo L с запрещающими дорожными знаками R.1-R.3(10) и испанскими подписями.",
          visibleSpanish: true,
          officialSignException,
          termTranslations: [
            { termEs: "NO AVANZAR", translationRu: "Движение прямо запрещено" },
            { termEs: "CONTRAMANO", translationRu: "Встречное направление" },
            { termEs: "PROHIBICIÓN DE CIRCULAR AUTOS", translationRu: "Движение автомобилей запрещено" },
            { termEs: "PROHIBICIÓN DE CIRCULAR MOTOS", translationRu: "Движение мотоциклов запрещено" },
            { termEs: "PROHIBICIÓN DE CIRCULAR BICICLETA", translationRu: "Движение велосипедов запрещено" },
            { termEs: "PROHIBICIÓN DE CIRCULAR CAMIÓN", translationRu: "Движение грузовиков запрещено" },
            { termEs: "PROHIBICIÓN DE CIRCULAR ACOPLADO", translationRu: "Движение с прицепом запрещено" },
            { termEs: "PROHIBICIÓN DE CIRCULAR PEATÓN", translationRu: "Движение пешеходов запрещено" },
            { termEs: "PROHIBICIÓN DE CIRCULAR TRAC. A.N.", translationRu: "Движение на тяге животных запрещено" },
            { termEs: "PROHIBICIÓN DE CIRCULAR ANIMAL", translationRu: "Прогон животных запрещен" },
            { termEs: "PROHIBICIÓN DE CIRCULAR CARRO DE MANO", translationRu: "Движение ручных тележек запрещено" },
            { termEs: "PROHIBICIÓN DE CIRCULAR TRACTOR", translationRu: "Движение тракторов запрещено" }
          ],
          bodyRu:
            "Панель показывает первые запрещающие знаки крупнее обзорного листа CABA. Испанские подписи остаются частью изображения; русская расшифровка дана отдельным текстом ниже."
        },
        {
          id: "app4-regulatory-anexo-panel-02-source-card",
          titleRu: "Запреты маневров и ограничения",
          displayMode: "full-width",
          maxDisplayWidthPx: 618,
          minDisplayWidthPx: 618,
          sourcePage: 186,
          sourceRegion: { x: 0, y: 0, width: 618, height: 733 },
          assetPath: `${assetRoot}/anexo-regulatory-panel-02-source-as-is.jpg`,
          altRu:
            "Панель Anexo L со знаками запрета поворотов, обгона, стоянки и ограничений R.4-R.16.",
          visibleSpanish: true,
          officialSignException,
          termTranslations: [
            { termEs: "NO GIRAR A LA IZQUIERDA", translationRu: "Поворот налево запрещен" },
            { termEs: "NO GIRAR A LA DERECHA", translationRu: "Поворот направо запрещен" },
            { termEs: "NO GIRAR EN U (NO RETOMAR)", translationRu: "Разворот запрещен" },
            { termEs: "PROHIBIDO ADELANTAR", translationRu: "Обгон запрещен" },
            { termEs: "NO RUIDOS MOLESTOS", translationRu: "Запрещены раздражающие шумы" },
            { termEs: "NO ESTACIONAR", translationRu: "Стоянка запрещена" },
            { termEs: "NO ESTACIONAR NI DETENERSE", translationRu: "Остановка и стоянка запрещены" },
            { termEs: "PROHIBICIÓN DE CAMBIAR DE CARRIL", translationRu: "Перестроение запрещено" },
            { termEs: "LIMITACIÓN DE PESO", translationRu: "Ограничение массы" },
            { termEs: "LIMITACIÓN DE ALTURA", translationRu: "Ограничение высоты" },
            { termEs: "LIMITACIÓN DE ANCHO", translationRu: "Ограничение ширины" },
            { termEs: "LIMITACIÓN DEL LARGO DEL VEHÍCULO", translationRu: "Ограничение длины транспортного средства" },
            { termEs: "LIMITACIÓN DE VELOCIDAD MÁXIMA", translationRu: "Ограничение максимальной скорости" },
            { termEs: "LIMITACIÓN DE VELOCIDAD MÍNIMA", translationRu: "Ограничение минимальной скорости" }
          ],
          bodyRu:
            "Здесь собраны запреты маневров, остановки и стоянки, а также ограничения по массе, габаритам и скорости. Числа и испанские подписи внутри картинки сохранены без изменений."
        },
        {
          id: "app4-regulatory-anexo-panel-03-source-card",
          titleRu: "Исключительные полосы и обязательные направления",
          displayMode: "full-width",
          maxDisplayWidthPx: 616,
          minDisplayWidthPx: 616,
          sourcePage: 186,
          sourceRegion: { x: 0, y: 0, width: 616, height: 734 },
          assetPath: `${assetRoot}/anexo-regulatory-panel-03-source-as-is.jpg`,
          altRu:
            "Панель Anexo L с регулирующими знаками R.17-R.22 про исключительное движение и обязательные направления.",
          visibleSpanish: true,
          officialSignException,
          termTranslations: [
            { termEs: "ESTACIONAMIENTO EXCLUSIVO", translationRu: "Исключительная стоянка" },
            { termEs: "CIRCULACIÓN EXCLUSIVA (TRANSP. PÚBL.)", translationRu: "Движение только общественного транспорта" },
            { termEs: "CIRCULACIÓN EXCLUSIVA (MOTOS)", translationRu: "Движение только мотоциклов" },
            { termEs: "CIRCULACIÓN EXCLUSIVA (BICICLETA)", translationRu: "Движение только велосипедов" },
            { termEs: "CIRCULACIÓN EXCLUSIVA (JINETES)", translationRu: "Движение только всадников" },
            { termEs: "CIRCULACIÓN EXCLUSIVA (PEATONES)", translationRu: "Движение только пешеходов" },
            { termEs: "USO DE CADENAS PARA NIEVE", translationRu: "Использование цепей противоскольжения" },
            { termEs: "GIRO OBLIGATORIO (DERECHA)", translationRu: "Обязательный поворот направо" },
            { termEs: "GIRO OBLIGATORIO (IZQUIERDA)", translationRu: "Обязательный поворот налево" },
            { termEs: "SENTIDO DE CIRCULACIÓN (DERECHA)", translationRu: "Направление движения направо" },
            { termEs: "SENTIDO DE CIRCULACIÓN (IZQUIERDA)", translationRu: "Направление движения налево" },
            { termEs: "SENTIDO DE CIRCULACIÓN (comienzo sentido único)", translationRu: "Начало одностороннего движения" },
            { termEs: "SENTIDO DE CIRCULACIÓN (alternativa)", translationRu: "Альтернативное указание направления" },
            { termEs: "PASO OBLIGADO (derecha)", translationRu: "Обязательный объезд справа" },
            { termEs: "PASO OBLIGADO (izquierda)", translationRu: "Обязательный объезд слева" }
          ],
          bodyRu:
            "Эта панель помогает рассмотреть знаки исключительного движения и обязательного направления. Перевод вынесен в подписи под изображением."
        },
        {
          id: "app4-regulatory-anexo-panel-04-source-card",
          titleRu: "Приоритет, контроль и конец предписания",
          displayMode: "full-width",
          maxDisplayWidthPx: 616,
          minDisplayWidthPx: 616,
          sourcePage: 186,
          sourceRegion: { x: 0, y: 0, width: 616, height: 694 },
          assetPath: `${assetRoot}/anexo-regulatory-panel-04-source-as-is.jpg`,
          altRu:
            "Панель Anexo L со знаками приоритета, контроля, железнодорожного барьера и конца предписания R.23-R.32.",
          visibleSpanish: true,
          officialSignException,
          termTranslations: [
            { termEs: "TRÁNSITO PESADO A LA DERECHA", translationRu: "Тяжелый транспорт направо" },
            { termEs: "PEATONES POR LA IZQUIERDA", translationRu: "Пешеходы слева" },
            { termEs: "PUESTO DEL CONTROL", translationRu: "Пункт контроля" },
            { termEs: "COMIENZO DE DOBLE MANO", translationRu: "Начало двустороннего движения" },
            { termEs: "PARE", translationRu: "Стоп" },
            { termEs: "CEDA EL PASO", translationRu: "Уступите дорогу" },
            { termEs: "PREFERENCIA DE AVANCE", translationRu: "Преимущество встречного разъезда" },
            { termEs: "BARRERAS FERROVIALES", translationRu: "Железнодорожные шлагбаумы" },
            { termEs: "FIN DE LA PRESCRIPCIÓN", translationRu: "Конец предписания" },
            { termEs: "FIN DE LA PRESCRIPCIÓN (ej.)", translationRu: "Пример конца предписания" },
            { termEs: "CRUCE FERROVIARIO", translationRu: "Железнодорожный переезд" }
          ],
          bodyRu:
            "Панель закрывает оставшуюся часть регулирующих знаков: приоритет, контроль, железнодорожные барьеры и конец действия предписания."
        }
      ],
      visualNotes: [
        "Panels 01-04 are byte-identical copies of retained official Anexo L JPG files.",
        "Panel 05 starts warning-sign material, so it is not part of this regulatory-panel scope.",
        "Spanish sign and catalog-caption pixels remain unchanged; Russian translations are separate DOM text."
      ]
    },
    {
      id: "regulatory-source-sheets",
      kind: "source-image-cards",
      titleRu: "Листы CABA с локальными вариантами",
      sourceTextEs:
        "Reglamentarias: de prohibicion, de restriccion, de prioridad y de fin de prescripcion.",
      cards: [
        {
          id: "app4-regulatory-page-185-source-card",
          titleRu: "Страница 185: запрещающие",
          displayMode: "full-width",
          maxDisplayWidthPx: 664,
          minDisplayWidthPx: 664,
          sourcePage: 185,
          sourceRegion: { x: 1110, y: 1602, width: 663, height: 981 },
          assetPath: `${assetRoot}/sign-sheet-185-source-crop-as-is.jpg`,
          altRu:
            "Лист запрещающих регулирующих дорожных знаков с испанскими подписями.",
          visibleSpanish: true,
          officialSignException,
          bodyRu:
            "Испанские названия внутри изображения не переведены и не закрыты; используйте знаки как визуальный образец, а русскую расшифровку групп читайте рядом."
        },
        {
          id: "app4-regulatory-page-186-source-card",
          titleRu: "Страница 186: ограничения, приоритет и конец предписания",
          displayMode: "full-width",
          maxDisplayWidthPx: 704,
          minDisplayWidthPx: 704,
          sourcePage: 186,
          sourceRegion: { x: 1162, y: 1602, width: 704, height: 981 },
          assetPath: `${assetRoot}/sign-sheet-186-source-crop-as-is.jpg`,
          altRu:
            "Лист регулирующих знаков ограничения, приоритета и окончания предписания с испанскими подписями.",
          visibleSpanish: true,
          officialSignException,
          bodyRu:
            "Русский текст дан рядом: он не нанесен поверх знаков, чтобы их внешний вид не менялся."
        }
      ],
      visualNotes: [
        "Both runtime images are byte-identical to their feature 034 official-source crop evidence.",
        "Feature 034 removed only empty outer page margins and caps display at each natural crop width because the official PDF source is source-limited for useful sign pixels.",
        "For text-readability evidence, these source-limited sheets keep their natural crop width on narrow viewports with contained figure scrolling instead of being downscaled to phone width or browser-upscaled.",
        "The visible Spanish text is allowed only inside the official sign sheets.",
        "Russian explanatory text is selectable DOM text outside the protected images."
      ]
    }
  ]
};
