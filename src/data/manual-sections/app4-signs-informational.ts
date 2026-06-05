import type { ManualGuideSectionContent } from "../manualGuide";

const assetRoot =
  "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/app4-signs-informational";

const officialSignException = {
  kind: "official-traffic-sign-source-as-is",
  visibleSpanishScope: "official-sign-image-only",
  sourceAsIs: true
} as const;

export const app4SignsInformationalSection: ManualGuideSectionContent = {
  id: "app4-signs-informational-content",
  sectionId: "app4-signs-informational",
  titleRu: "Информационные",
  sourcePages: [189, 190, 191, 192],
  sourceTitleEs: "Informativas",
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
      "content/validation/manual-guide/app4-signs-informational/page-189-informational-source-crop.jpg",
      "content/validation/manual-guide/app4-signs-informational/page-190-informational-source-crop.jpg",
      "content/validation/manual-guide/app4-signs-informational/page-191-informational-source-crop.jpg",
      "content/validation/manual-guide/app4-signs-informational/page-192-informational-source-crop.jpg"
    ],
    russianScreenshots: [
      "content/validation/manual-guide/app4-signs-informational/app4-signs-informational-desktop.png",
      "content/validation/manual-guide/app4-signs-informational/app4-signs-informational-mobile.png"
    ],
    notes: [
      "Pages 189-192 are implemented with unchanged official informational sign/source pixels cropped to remove empty outer page margins.",
      "The Yellow Star source text from page 192 is translated in selectable DOM text below the unchanged source page image."
    ]
  },
  blocks: [
    {
      id: "informational-role",
      kind: "lead",
      sourceTextEs:
        "Informativas. Caracteristicas de la via. Nomenclatura vial y urbana. Informacion turistica y de servicios. Educativas y anuncios especiales. Estrella Amarilla.",
      textRu:
        "Информационные знаки помогают ориентироваться: сообщают характеристики дороги, городскую и дорожную номенклатуру, туристическую или сервисную информацию, образовательные сообщения и специальные объявления."
    },
    {
      id: "informational-groups",
      kind: "list",
      titleRu: "Группы информационных знаков",
      sourceTextEs:
        "Caracteristicas de la via; nomenclatura vial y urbana; informacion turistica y de servicios; educativas y anuncios especiales.",
      itemsRu: [
        "Характеристики дороги подсказывают тип участка, направление, начало или конец зоны, остановки и другие условия движения.",
        "Дорожная и городская номенклатура помогает понять названия улиц, номер маршрута, километр, район или ориентир.",
        "Туристическая и сервисная информация указывает места услуг, помощи, отдыха и полезной инфраструктуры.",
        "Образовательные и специальные объявления передают социально важные сообщения, которые водитель должен узнавать на дороге."
      ]
    },
    {
      id: "informational-source-sheets",
      kind: "source-image-cards",
      titleRu: "Официальные листы информационных знаков",
      sourceTextEs:
        "Informativas: caracteristicas de la via, nomenclatura vial y urbana, informacion turistica y de servicios, educativas y anuncios especiales.",
      cards: [
        {
          id: "app4-informational-page-189-source-card",
          titleRu: "Страница 189: характеристики дороги",
          displayMode: "full-width",
          maxDisplayWidthPx: 673,
          minDisplayWidthPx: 673,
          sourcePage: 189,
          sourceRegion: { x: 1110, y: 1602, width: 673, height: 981 },
          assetPath: `${assetRoot}/sign-sheet-189-source-crop-as-is.jpg`,
          altRu:
            "Официальный лист информационных знаков о характеристиках дороги, сохраненный без изменений.",
          visibleSpanish: true,
          officialSignException,
          bodyRu:
            "Лист сохранен без изменений: цвета, стрелки, пиктограммы и испанские подписи не изменены."
        },
        {
          id: "app4-informational-page-190-source-card",
          titleRu: "Страница 190: дорожная и городская номенклатура",
          displayMode: "full-width",
          maxDisplayWidthPx: 704,
          minDisplayWidthPx: 704,
          sourcePage: 190,
          sourceRegion: { x: 1162, y: 1602, width: 704, height: 981 },
          assetPath: `${assetRoot}/sign-sheet-190-source-crop-as-is.jpg`,
          altRu:
            "Официальный лист информационных знаков дорожной и городской номенклатуры, сохраненный без изменений.",
          visibleSpanish: true,
          officialSignException,
          bodyRu:
            "Названия и формы внутри листа не переводятся в изображении; русское пояснение дано отдельным текстом."
        },
        {
          id: "app4-informational-page-191-source-card",
          titleRu: "Страница 191: туристическая, сервисная и специальная информация",
          displayMode: "full-width",
          maxDisplayWidthPx: 672,
          minDisplayWidthPx: 672,
          sourcePage: 191,
          sourceRegion: { x: 1110, y: 1602, width: 671, height: 981 },
          assetPath: `${assetRoot}/sign-sheet-191-source-crop-as-is.jpg`,
          altRu:
            "Официальный лист информационных туристических, сервисных, образовательных и специальных знаков, сохраненный без изменений.",
          visibleSpanish: true,
          officialSignException,
          bodyRu:
            "Все пиктограммы и подписи оставлены без ретуши, масок, перерисовки или русских надписей поверх изображения."
        },
        {
          id: "app4-informational-page-192-source-card",
          titleRu: "Страница 192: Желтая звезда",
          displayMode: "full-width",
          maxDisplayWidthPx: 706,
          minDisplayWidthPx: 706,
          sourcePage: 192,
          sourceRegion: { x: 1161, y: 1602, width: 705, height: 981 },
          assetPath: `${assetRoot}/sign-sheet-192-source-crop-as-is.jpg`,
          altRu:
            "Официальная страница о знаке Желтая звезда, сохраненная без изменений.",
          visibleSpanish: true,
          officialSignException,
          bodyRu:
            "Страница сохранена без изменений. Русский перевод содержания находится ниже, а испанская страница не очищается и не переводится внутри изображения."
        }
      ],
      visualNotes: [
        "Informational sign/source sheets are feature 034 official-source crops with empty outer page margins removed.",
        "The official PDF source is source-limited for useful sign pixels, so runtime display is capped at each natural crop width.",
        "The cards keep natural crop width on narrow viewports with contained figure scrolling for source-faithful text readability instead of phone-width downscaling.",
        "Russian learner text remains outside the protected source images."
      ]
    },
    {
      id: "yellow-star-meaning",
      kind: "list",
      titleRu: "Знак «Желтая звезда»",
      sourceTextEs:
        "Una senal de Estrella Amarilla significa que en ese lugar hubo una victima fatal por un incidente de transito; las cinco puntas representan Memoria, Prevencion, Ley, Justicia y Educacion; familiares pueden solicitarla por correo o ONG.",
      itemsRu: [
        "Желтая звезда означает, что в этом месте погиб человек в дорожном инциденте. Это памятный и предупреждающий знак о предотвратимых смертях.",
        "Пять лучей звезды обозначают ценности: память, предотвращение, закон, справедливость и образование.",
        "На звезде указывают имя или прозвище и возраст жертвы с надписью «En memoria de una victima de transito».",
        "Семья погибшего может бесплатно запросить установку по адресу estrellasamarillas@buenosaires.gob.ar или через НКО.",
        "В источнике также упомянута интерактивная карта Желтых звезд с данными о месте, имени, возрасте, дате рождения и дате смерти."
      ]
    }
  ]
};
