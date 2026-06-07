import type { ManualGuideSectionContent } from "../manualGuide";

const assetRoot =
  "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/app4-signs-temporary";

const officialSignException = {
  kind: "official-traffic-sign-source-as-is",
  visibleSpanishScope: "official-sign-image-only",
  sourceAsIs: true
} as const;

export const app4SignsTemporarySection: ManualGuideSectionContent = {
  id: "app4-signs-temporary-content",
  sectionId: "app4-signs-temporary",
  titleRu: "Временные",
  sourcePages: [193, 194],
  sourceTitleEs: "Transitorias",
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
      "content/validation/manual-guide/app4-signs-temporary/page-193-temporary-source-crop.jpg",
      "content/validation/manual-guide/app4-signs-temporary/page-194-temporary-source-crop.jpg"
    ],
    russianScreenshots: [
      "content/validation/manual-guide/app4-signs-temporary/app4-signs-temporary-desktop.png",
      "content/validation/manual-guide/app4-signs-temporary/app4-signs-temporary-mobile.png"
    ],
    notes: [
      "Pages 193-194 are implemented with unchanged official temporary sign pixels cropped to remove empty outer page margins.",
      "Russian explanations for temporary-road, pedestrian, cycleway, and other-device categories are outside the images."
    ]
  },
  blocks: [
    {
      id: "temporary-role",
      kind: "lead",
      sourceTextEs:
        "Transitorias. Viales. Peatonales y de ciclovias. Peatonales. De ciclovias. Otros dispositivos.",
      textRu:
        "Временные знаки и устройства меняют обычный режим движения на время работ, перекрытий, объездов, временной организации пешеходного или велосипедного движения и других дорожных ситуаций."
    },
    {
      id: "temporary-groups",
      kind: "list",
      titleRu: "Как использовать временную сигнализацию",
      sourceTextEs:
        "Transitorias: viales, peatonales y de ciclovias, peatonales, de ciclovias y otros dispositivos.",
      itemsRu: [
        "Временные дорожные знаки имеют приоритет как актуальная организация движения в конкретном месте.",
        "Пешеходные временные устройства направляют людей по безопасному временному пути и отделяют их от зоны риска.",
        "Временные элементы для велодорожек показывают перенос, закрытие или особый режим велосипедного маршрута.",
        "Другие устройства могут физически направлять или ограничивать движение: конусы, ограждения, панели, маяки и разметочные элементы."
      ]
    },
    {
      id: "temporary-individual-sign-catalog",
      kind: "manual-sign-catalog",
      titleRu: "Карточки временных знаков и устройств",
      sourceTextEs: "Transitorias: individual source-region catalog.",
      sectionId: "app4-signs-temporary",
      visualNotes: [
        "Each entry clips an unchanged official source image region with CSS.",
        "Spanish and Russian captions are selectable text outside the protected source image."
      ]
    },
    {
      id: "temporary-source-sheets",
      kind: "source-image-cards",
      titleRu: "Листы временных знаков и устройств",
      sourceTextEs:
        "Transitorias: viales, peatonales y de ciclovias, peatonales, de ciclovias, otros dispositivos.",
      cards: [
        {
          id: "app4-temporary-page-193-source-card",
          titleRu: "Страница 193: дорожные, пешеходные и велосипедные временные знаки",
          displayMode: "full-width",
          maxDisplayWidthPx: 673,
          minDisplayWidthPx: 673,
          sourcePage: 193,
          sourceRegion: { x: 1110, y: 1602, width: 673, height: 981 },
          assetPath: `${assetRoot}/sign-sheet-193-source-crop-as-is.jpg`,
          altRu:
            "Лист временных дорожных, пешеходных и велосипедных знаков.",
          visibleSpanish: true,
          officialSignException,
          termTranslations: [
            { termEs: "Transitorias", translationRu: "Временные" },
            { termEs: "Viales", translationRu: "Дорожные" },
            { termEs: "No girar", translationRu: "Поворот запрещен" },
            { termEs: "Giro anulado", translationRu: "Поворот отменен" },
            { termEs: "No estacionar ni detenerse", translationRu: "Остановка и стоянка запрещены" },
            { termEs: "Límite de velocidad máxima", translationRu: "Ограничение максимальной скорости" },
            { termEs: "Sentido de circulación", translationRu: "Направление движения" },
            { termEs: "Direcciones permitidas", translationRu: "Разрешенные направления" },
            { termEs: "Estrechamiento", translationRu: "Сужение" },
            { termEs: "A 100 m reducción de calzada", translationRu: "Через 100 м сужение проезжей части" },
            { termEs: "Calzada dividida", translationRu: "Разделенная проезжая часть" },
            { termEs: "Personas trabajando", translationRu: "Люди работают" },
            { termEs: "Inicio obras", translationRu: "Начало работ" },
            { termEs: "Fin obras", translationRu: "Конец работ" },
            { termEs: "Desvío", translationRu: "Объезд" },
            { termEs: "Calle cerrada", translationRu: "Улица закрыта" },
            { termEs: "Calle transversal en obra", translationRu: "Поперечная улица в работах" },
            { termEs: "Inicio evento", translationRu: "Начало события" },
            { termEs: "Fin evento", translationRu: "Конец события" },
            { termEs: "Solo acceso frentistas", translationRu: "Только доступ для жителей/собственников прилегающих участков" },
            { termEs: "Peatonales y de ciclovías", translationRu: "Пешеходные и велосипедные временные указатели" }
          ],
          bodyRu:
            "Русские пояснения рядом не заменяют испанские подписи внутри изображения."
        },
        {
          id: "app4-temporary-page-194-source-card",
          titleRu: "Страница 194: пешеходные, велосипедные и другие временные устройства",
          displayMode: "full-width",
          maxDisplayWidthPx: 705,
          minDisplayWidthPx: 705,
          sourcePage: 194,
          sourceRegion: { x: 1162, y: 1602, width: 704, height: 981 },
          assetPath: `${assetRoot}/sign-sheet-194-source-crop-as-is.jpg`,
          altRu:
            "Лист временных пешеходных, велосипедных и других устройств.",
          visibleSpanish: true,
          officialSignException,
          termTranslations: [
            { termEs: "Peatonales", translationRu: "Пешеходные" },
            { termEs: "Anuncio de obra", translationRu: "Объявление о работах" },
            { termEs: "Comienzo de obra", translationRu: "Начало работ" },
            { termEs: "Desvío", translationRu: "Объезд" },
            { termEs: "Anulación temporal de paradas", translationRu: "Временная отмена остановок" },
            { termEs: "Acerquese a la parada más cercana", translationRu: "Подойдите к ближайшей остановке" },
            { termEs: "Anulación de parada", translationRu: "Отмена остановки" },
            { termEs: "Prohibido el paso", translationRu: "Проход запрещен" },
            { termEs: "Senda deshabilitada", translationRu: "Переход/путь отключен" },
            { termEs: "De ciclovías", translationRu: "Для велодорожек" },
            { termEs: "Interrupción de ciclovía", translationRu: "Прерывание велодорожки" },
            { termEs: "Descenso de la bicicleta", translationRu: "Сойти с велосипеда" },
            { termEs: "Otros dispositivos", translationRu: "Другие устройства" },
            { termEs: "Valla barrera / peatonal / de obra", translationRu: "Барьерное, пешеходное или строительное ограждение" },
            { termEs: "Conos", translationRu: "Конусы" },
            { termEs: "Tambores", translationRu: "Дорожные бочки" },
            { termEs: "Delineadores", translationRu: "Направляющие делинеаторы" },
            { termEs: "Barandas canalizadoras", translationRu: "Направляющие ограждения" },
            { termEs: "Reflector", translationRu: "Рефлектор / осветитель" },
            { termEs: "Baliza intermitente", translationRu: "Мигающий маяк" },
            { termEs: "Flecha vial intermitente", translationRu: "Мигающая дорожная стрелка" },
            { termEs: "Semáforo", translationRu: "Светофор" },
            { termEs: "Paneles", translationRu: "Панели" }
          ],
          bodyRu:
            "Пиктограммы, цвета, подписи и форма устройств не переведены, не ретушированы и не перерисованы."
        }
      ],
      visualNotes: [
        "Temporary signs and devices are treated as protected official source visuals cropped only to remove empty outer page margins.",
        "The official PDF source is source-limited for useful sign pixels, so runtime display is capped at each natural crop width.",
        "On narrow viewports, contained figure scrolling preserves the natural crop width for embedded source text rather than shrinking it further.",
        "No Spanish cleanup or Russian overlay is applied to the images."
      ]
    }
  ]
};
