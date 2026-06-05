import type { ManualGuideSectionContent } from "../manualGuide";

const assetRoot =
  "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/app4-signs-traffic-lights";

const officialSignException = {
  kind: "official-traffic-sign-source-as-is",
  visibleSpanishScope: "official-sign-image-only",
  sourceAsIs: true
} as const;

export const app4SignsTrafficLightsSection: ManualGuideSectionContent = {
  id: "app4-signs-traffic-lights-content",
  sectionId: "app4-signs-traffic-lights",
  titleRu: "Световая сигнализация",
  sourcePages: [197, 198, 199, 200],
  sourceTitleEs: "Senalizacion luminosa",
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
      "content/validation/manual-guide/app4-signs-traffic-lights/page-197-traffic-lights-source-crop.jpg",
      "content/validation/manual-guide/app4-signs-traffic-lights/page-198-traffic-lights-source-crop.jpg",
      "content/validation/manual-guide/app4-signs-traffic-lights/page-199-traffic-lights-source-crop.jpg",
      "content/validation/manual-guide/app4-signs-traffic-lights/page-200-traffic-lights-source-crop.jpg"
    ],
    russianScreenshots: [
      "content/validation/manual-guide/app4-signs-traffic-lights/app4-signs-traffic-lights-desktop.png",
      "content/validation/manual-guide/app4-signs-traffic-lights/app4-signs-traffic-lights-mobile.png"
    ],
    notes: [
      "Pages 197-200 are implemented with unchanged official signal and closing-page pixels cropped to remove empty outer page margins.",
      "Traffic-light and signal source visuals remain source-as-is; Russian meaning and closing-page translations are below the images."
    ]
  },
  blocks: [
    {
      id: "traffic-lights-role",
      kind: "lead",
      sourceTextEs:
        "Senalizacion luminosa. Significado de las luces. Disposicion de unidades opticas. Semaforos especiales.",
      textRu:
        "Световая сигнализация управляет движением через цвет, расположение и специальные световые устройства. Для экзамена важно связать цвет и форму сигнала с действием водителя, пешехода или велосипедиста."
    },
    {
      id: "traffic-lights-groups",
      kind: "list",
      titleRu: "Что покрывает источник",
      sourceTextEs:
        "Significado de las luces; disposicion de unidades opticas; semaforos especiales; las senales de transito por su color, tamano y posicion hacen mas agil, segura y eficiente la movilidad.",
      itemsRu: [
        "Значение огней объясняет, когда нужно остановиться, когда можно продолжить движение и когда следует подготовиться к изменению сигнала.",
        "Расположение оптических блоков помогает быстро распознать сигнал даже до чтения подписи.",
        "Специальные светофоры относятся к отдельным потокам или пользователям дороги, например пешеходам, велосипедам или общественному транспорту.",
        "Источник завершает приложение мыслью: знаки через цвет, размер и положение делают мобильность более быстрой, безопасной и эффективной."
      ]
    },
    {
      id: "traffic-lights-source-sheets",
      kind: "source-image-cards",
      titleRu: "Официальные листы световой сигнализации и закрывающие страницы",
      sourceTextEs:
        "Senalizacion luminosa: significado de las luces, disposicion de unidades opticas, semaforos especiales, cierre del manual.",
      cards: [
        {
          id: "app4-traffic-lights-page-197-source-card",
          titleRu: "Страница 197: значение огней и специальные светофоры",
          displayMode: "full-width",
          maxDisplayWidthPx: 673,
          minDisplayWidthPx: 673,
          sourcePage: 197,
          sourceRegion: { x: 1110, y: 1602, width: 673, height: 981 },
          assetPath: `${assetRoot}/signal-sheet-197-source-crop-as-is.jpg`,
          altRu:
            "Официальный лист световой сигнализации со значением огней, расположением оптических блоков и специальными светофорами, сохраненный без изменений.",
          visibleSpanish: true,
          officialSignException,
          bodyRu:
            "Световые сигналы, подписи и пиктограммы сохранены без изменения. Русское объяснение находится рядом и ниже, а не внутри изображения."
        },
        {
          id: "app4-traffic-lights-page-198-source-card",
          titleRu: "Страница 198: завершающее сообщение о знаках",
          displayMode: "full-width",
          maxDisplayWidthPx: 757,
          minDisplayWidthPx: 757,
          sourcePage: 198,
          sourceRegion: { x: 1105, y: 1602, width: 761, height: 1004 },
          assetPath: `${assetRoot}/signal-sheet-198-source-crop-as-is.jpg`,
          altRu:
            "Официальная завершающая страница о роли дорожных знаков, сохраненная без изменений.",
          visibleSpanish: true,
          officialSignException,
          bodyRu:
            "По-русски: дорожные знаки и сигналы через цвет, размер и положение делают мобильность более быстрой, безопасной и эффективной."
        },
        {
          id: "app4-traffic-lights-page-199-source-card",
          titleRu: "Страница 199: завершающая иллюстрация",
          displayMode: "full-width",
          maxDisplayWidthPx: 757,
          minDisplayWidthPx: 757,
          sourcePage: 199,
          sourceRegion: { x: 1106, y: 1602, width: 760, height: 1003 },
          assetPath: `${assetRoot}/signal-sheet-199-source-crop-as-is.jpg`,
          altRu:
            "Официальная завершающая иллюстрация с повторяющимися надписями, сохраненная без изменений.",
          visibleSpanish: true,
          officialSignException,
          bodyRu:
            "По-русски: завершающая иллюстрация повторяет темы дорожного движения, знаков, пешеходов и устойчивой мобильности. Изображение оставлено без перевода внутри."
        },
        {
          id: "app4-traffic-lights-page-200-source-card",
          titleRu: "Страница 200: логотип города",
          displayMode: "full-width",
          maxDisplayWidthPx: 757,
          minDisplayWidthPx: 757,
          sourcePage: 200,
          sourceRegion: { x: 1106, y: 1602, width: 764, height: 1006 },
          assetPath: `${assetRoot}/signal-sheet-200-source-crop-as-is.jpg`,
          altRu:
            "Официальная заключительная страница с логотипом Buenos Aires Ciudad, сохраненная без изменений.",
          visibleSpanish: true,
          officialSignException,
          bodyRu:
            "По-русски: город Буэнос-Айрес. Логотип и подпись источника сохранены без ретуши, перевода или замены."
        }
      ],
      visualNotes: [
        "Traffic-light and closing source visuals are feature 034 official-source crops with empty outer page margins removed.",
        "The official PDF source is source-limited for useful signal pixels, so runtime display is capped at each natural crop width.",
        "The cards keep natural crop width on narrow viewports with contained figure scrolling for source-faithful embedded text readability.",
        "Visible Spanish remains only inside the protected source images; Russian translation is adjacent or below."
      ]
    }
  ]
};
