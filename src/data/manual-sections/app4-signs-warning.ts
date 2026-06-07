import type { ManualGuideSectionContent } from "../manualGuide";

const assetRoot =
  "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/app4-signs-warning";

const officialSignException = {
  kind: "official-traffic-sign-source-as-is",
  visibleSpanishScope: "official-sign-image-only",
  sourceAsIs: true
} as const;

export const app4SignsWarningSection: ManualGuideSectionContent = {
  id: "app4-signs-warning-content",
  sectionId: "app4-signs-warning",
  titleRu: "Предупреждающие",
  sourcePages: [187, 188],
  sourceTitleEs: "Preventivas",
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
      "content/validation/manual-guide/app4-signs-warning/page-187-warning-source-crop.jpg",
      "content/validation/manual-guide/app4-signs-warning/page-188-warning-source-crop.jpg"
    ],
    russianScreenshots: [
      "content/validation/manual-guide/app4-signs-warning/app4-signs-warning-desktop.png",
      "content/validation/manual-guide/app4-signs-warning/app4-signs-warning-mobile.png"
    ],
    notes: [
      "Pages 187-188 are implemented with unchanged official warning sign sheet pixels cropped to remove empty outer page margins.",
      "Russian learner text explains the warning categories outside the protected source images."
    ]
  },
  blocks: [
    {
      id: "warning-role",
      kind: "lead",
      sourceTextEs:
        "Preventivas. Advertencias sobre caracteristicas de la via. Advertencias de maximo peligro. Posibilidad de riesgo eventual. Anticipo de otros dispositivos de control del transito. Fin de prevencion.",
      textRu:
        "Предупреждающие знаки заранее готовят водителя к риску: особенности дороги, место максимальной опасности, возможная временная опасность, приближение другого устройства управления движением или конец предупреждения."
    },
    {
      id: "warning-groups",
      kind: "list",
      titleRu: "Что важно для экзамена",
      sourceTextEs:
        "Advertencias sobre caracteristicas de la via; advertencias de maximo peligro; posibilidad de riesgo eventual; anticipo de otros dispositivos de control del transito; fin de prevencion.",
      itemsRu: [
        "Предупреждение не всегда запрещает действие, но требует заранее снизить риск: уменьшить скорость, увеличить внимание и подготовиться к маневру.",
        "Знаки о характеристиках дороги предупреждают о кривых, уклонах, сужениях, мостах, туннелях, пересечениях и других особенностях траектории.",
        "Знаки максимальной опасности выделяют места, где ошибка особенно критична: железнодорожный переезд, опасный перекресток, дети, пешеходы или животные.",
        "Предупреждения о возможном риске и приближении устройств контроля помогают заранее ожидать светофор, знак, контроль или временное изменение."
      ]
    },
    {
      id: "warning-individual-sign-catalog",
      kind: "manual-sign-catalog",
      titleRu: "Карточки предупреждающих знаков",
      sourceTextEs: "Preventivas: individual source-region catalog.",
      sectionId: "app4-signs-warning",
      visualNotes: [
        "Each entry clips an unchanged official source image region with CSS.",
        "Spanish and Russian captions are selectable text outside the protected source image."
      ]
    },
    {
      id: "warning-source-sheets",
      kind: "source-image-cards",
      titleRu: "Листы предупреждающих знаков",
      sourceTextEs:
        "Preventivas: advertencias sobre caracteristicas de la via, maximo peligro, riesgo eventual, anticipo de otros dispositivos y fin de prevencion.",
      cards: [
        {
          id: "app4-warning-page-187-source-card",
          titleRu: "Страница 187: характеристики дороги",
          displayMode: "full-width",
          maxDisplayWidthPx: 672,
          minDisplayWidthPx: 672,
          sourcePage: 187,
          sourceRegion: { x: 1110, y: 1602, width: 671, height: 981 },
          assetPath: `${assetRoot}/sign-sheet-187-source-crop-as-is.jpg`,
          altRu:
            "Лист предупреждающих знаков о характеристиках дороги.",
          visibleSpanish: true,
          officialSignException,
          termTranslations: [
            { termEs: "Preventivas", translationRu: "Предупреждающие" },
            { termEs: "Advertencias sobre características de la vía", translationRu: "Предупреждения об особенностях дороги" },
            { termEs: "Curva", translationRu: "Кривая / поворот" },
            { termEs: "Curva (contracurva)", translationRu: "Кривая с обратным поворотом" },
            { termEs: "Camino sinuoso", translationRu: "Извилистая дорога" },
            { termEs: "Pendiente", translationRu: "Уклон" },
            { termEs: "Estrechamiento", translationRu: "Сужение" },
            { termEs: "Perfil irregular", translationRu: "Неровный профиль дороги" },
            { termEs: "Calzada resbaladiza", translationRu: "Скользкая проезжая часть" },
            { termEs: "Proyección de piedras", translationRu: "Выброс камней" },
            { termEs: "Derrumbes", translationRu: "Обвалы" },
            { termEs: "Túnel", translationRu: "Туннель" },
            { termEs: "Puente angosto", translationRu: "Узкий мост" },
            { termEs: "Puente móvil", translationRu: "Разводной мост" },
            { termEs: "Altura limitada", translationRu: "Ограниченная высота" },
            { termEs: "Ancho limitado", translationRu: "Ограниченная ширина" },
            { termEs: "Calzada dividida", translationRu: "Разделенная проезжая часть" },
            { termEs: "Rotonda", translationRu: "Круговое движение" },
            { termEs: "Incorporación de tránsito lateral", translationRu: "Вливание бокового потока" },
            { termEs: "Inicio de doble circulación", translationRu: "Начало двустороннего движения" },
            { termEs: "Encrucijada", translationRu: "Перекресток" },
            { termEs: "Empalme", translationRu: "Примыкание" },
            { termEs: "Bifurcación", translationRu: "Разветвление" }
          ],
          bodyRu:
            "Пиктограммы, подписи и цвета остаются внутри листа. Русское объяснение не заменяет текст внутри листа и не накладывается на знаки."
        },
        {
          id: "app4-warning-page-188-source-card",
          titleRu: "Страница 188: максимальная опасность и другие предупреждения",
          displayMode: "full-width",
          maxDisplayWidthPx: 705,
          minDisplayWidthPx: 705,
          sourcePage: 188,
          sourceRegion: { x: 1161, y: 1602, width: 705, height: 981 },
          assetPath: `${assetRoot}/sign-sheet-188-source-crop-as-is.jpg`,
          altRu:
            "Лист предупреждающих знаков максимальной опасности, возможного риска и окончания предупреждения.",
          visibleSpanish: true,
          officialSignException,
          termTranslations: [
            { termEs: "Posibilidad de riesgo eventual", translationRu: "Возможность случайного риска" },
            { termEs: "Escolares", translationRu: "Школьники" },
            { termEs: "Niños", translationRu: "Дети" },
            { termEs: "Cruce de ciclistas", translationRu: "Пересечение велосипедистов" },
            { termEs: "Jinetes", translationRu: "Всадники" },
            { termEs: "Animales sueltos", translationRu: "Животные на дороге" },
            { termEs: "Corredor aéreo", translationRu: "Воздушный коридор" },
            { termEs: "Presencia de vehículos extraños", translationRu: "Возможное появление необычных транспортных средств" },
            { termEs: "Advertencias de máximo peligro", translationRu: "Предупреждения максимальной опасности" },
            { termEs: "Cruce ferroviario", translationRu: "Железнодорожный переезд" },
            { termEs: "Paneles de prevención", translationRu: "Предупредительные панели" },
            { termEs: "Cruz de San Andrés", translationRu: "Андреевский крест" },
            { termEs: "Curva cerrada", translationRu: "Крутой поворот" },
            { termEs: "Cruce de peatones", translationRu: "Пешеходный переход" },
            { termEs: "Atención", translationRu: "Внимание" },
            { termEs: "Anticipo de otros dispositivos de control del tránsito", translationRu: "Предупреждение о других устройствах контроля движения" },
            { termEs: "Flecha direccional", translationRu: "Направляющая стрелка" },
            { termEs: "Proximidad de semáforo", translationRu: "Приближение к светофору" },
            { termEs: "Proximidad de señal restrictiva", translationRu: "Приближение к ограничивающему знаку" },
            { termEs: "Fin de prevención", translationRu: "Конец предупреждения" }
          ],
          bodyRu:
            "Испанские подписи остаются только внутри изображения; русская памятка находится в тексте вокруг него."
        }
      ],
      visualNotes: [
        "Warning signs remain source-as-is in feature 034 official-source crops with empty outer page margins removed.",
        "The official PDF source is source-limited for useful sign pixels, so runtime display is capped at each natural crop width.",
        "The sheets keep natural crop width on narrow viewports with contained figure scrolling so embedded labels are not further reduced below the source-limited raster.",
        "No glyph cleanup or Russian overlay is applied to official sign sheets."
      ]
    }
  ]
};
