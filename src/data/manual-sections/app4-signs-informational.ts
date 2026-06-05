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
      "Pages 189-192 are implemented with unchanged x5 informational sign/source sheets.",
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
          sourcePage: 189,
          sourceRegion: { x: 0, y: 0, width: 2976, height: 4209 },
          assetPath: `${assetRoot}/sign-sheet-189-source-as-is.jpg`,
          altRu:
            "Официальный лист информационных знаков о характеристиках дороги, сохраненный без изменений.",
          visibleSpanish: true,
          officialSignException,
          bodyRu:
            "Лист сохранен как официальный источник: цвета, стрелки, пиктограммы и испанские подписи не изменены."
        },
        {
          id: "app4-informational-page-190-source-card",
          titleRu: "Страница 190: дорожная и городская номенклатура",
          sourcePage: 190,
          sourceRegion: { x: 0, y: 0, width: 2976, height: 4209 },
          assetPath: `${assetRoot}/sign-sheet-190-source-as-is.jpg`,
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
          sourcePage: 191,
          sourceRegion: { x: 0, y: 0, width: 2976, height: 4209 },
          assetPath: `${assetRoot}/sign-sheet-191-source-as-is.jpg`,
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
          sourcePage: 192,
          sourceRegion: { x: 0, y: 0, width: 2976, height: 4209 },
          assetPath: `${assetRoot}/sign-sheet-192-source-as-is.jpg`,
          altRu:
            "Официальная страница о знаке Желтая звезда, сохраненная без изменений.",
          visibleSpanish: true,
          officialSignException,
          bodyRu:
            "Страница показана как неизмененный источник. Русский перевод содержания находится ниже, а исходная испанская страница не очищается и не переводится внутри изображения."
        }
      ],
      visualNotes: [
        "Informational sign/source sheets are x5 source-as-is runtime images.",
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
