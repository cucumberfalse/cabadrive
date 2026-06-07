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
      id: "informational-individual-sign-catalog",
      kind: "manual-sign-catalog",
      titleRu: "Карточки информационных знаков",
      sourceTextEs: "Informativas: individual source-region catalog.",
      sectionId: "app4-signs-informational",
      visualNotes: [
        "Each entry clips an unchanged official source image region with CSS.",
        "Spanish and Russian captions are selectable text outside the protected source image."
      ]
    },
    {
      id: "informational-source-sheets",
      kind: "source-image-cards",
      titleRu: "Листы информационных знаков",
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
            "Лист информационных знаков о характеристиках дороги.",
          visibleSpanish: true,
          officialSignException,
          termTranslations: [
            { termEs: "Informativas", translationRu: "Информационные" },
            { termEs: "Características de la vía", translationRu: "Характеристики дороги" },
            { termEs: "Comienzo de autopista", translationRu: "Начало автомагистрали" },
            { termEs: "Fin de autopista", translationRu: "Конец автомагистрали" },
            { termEs: "Indicadora de utilización de carriles", translationRu: "Указатель использования полос" },
            { termEs: "Camino o calle sin salida", translationRu: "Тупиковая дорога или улица" },
            { termEs: "Camino o paso transitable", translationRu: "Проезжий путь / разрешенный проезд" },
            { termEs: "Velocidades máximas permitidas", translationRu: "Разрешенные максимальные скорости" },
            { termEs: "Esquema de recorrido", translationRu: "Схема маршрута" },
            { termEs: "Desvío por cambio de sentido de circulación", translationRu: "Объезд из-за изменения направления движения" },
            { termEs: "Estacionamiento permitido", translationRu: "Стоянка разрешена" },
            { termEs: "Estacionamiento permitido (a 45° o 90°)", translationRu: "Стоянка разрешена под 45° или 90°" },
            { termEs: "Estacionamiento ordenado", translationRu: "Упорядоченная стоянка" },
            { termEs: "Permitido girar", translationRu: "Поворот разрешен" },
            { termEs: "Direcciones permitidas", translationRu: "Разрешенные направления" }
          ],
          bodyRu:
            "Цвета, стрелки, пиктограммы и испанские подписи остаются внутри изображения."
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
            "Лист информационных знаков дорожной и городской номенклатуры.",
          visibleSpanish: true,
          officialSignException,
          termTranslations: [
            { termEs: "Cámara de control electrónico", translationRu: "Камера электронного контроля" },
            { termEs: "Fin de camino peatonal", translationRu: "Конец пешеходного пути" },
            { termEs: "Cruce peatonal", translationRu: "Пешеходный переход" },
            { termEs: "Descenso de la bicicleta", translationRu: "Сойти с велосипеда" },
            { termEs: "Finalización de la ciclovía", translationRu: "Конец велодорожки" },
            { termEs: "Advertencia de escuela", translationRu: "Предупреждение о школе" },
            { termEs: "Advertencia general", translationRu: "Общее предупреждение" },
            { termEs: "Nomenclatura vial y urbana", translationRu: "Дорожная и городская номенклатура" },
            { termEs: "Ruta Panamericana", translationRu: "Панамериканский маршрут" },
            { termEs: "Ruta nacional", translationRu: "Национальный маршрут" },
            { termEs: "Ruta provincial", translationRu: "Провинциальный маршрут" },
            { termEs: "Nomenclatura urbana", translationRu: "Городская номенклатура / таблички улиц" },
            { termEs: "Identificación de región y localidad", translationRu: "Обозначение региона и населенного пункта" },
            { termEs: "Orientación", translationRu: "Ориентирование по дорогам" },
            { termEs: "Comienzo o fin de zona urbana", translationRu: "Начало или конец городской зоны" },
            { termEs: "Identificación de jurisdicción o accidente", translationRu: "Обозначение юрисдикции или дорожного объекта" },
            { termEs: "Mojón kilométrico", translationRu: "Километровый столб" },
            { termEs: "Nomenclatura de autopista", translationRu: "Номенклатура автомагистрали" }
          ],
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
            "Лист информационных туристических, сервисных, образовательных и специальных знаков.",
          visibleSpanish: true,
          officialSignException,
          termTranslations: [
            { termEs: "Información turística y de servicios", translationRu: "Туристическая и сервисная информация" },
            { termEs: "Puesto sanitario", translationRu: "Медицинский пункт" },
            { termEs: "Servicio telefónico", translationRu: "Телефонная связь" },
            { termEs: "Estación de servicio", translationRu: "Автозаправочная станция" },
            { termEs: "Teleférico", translationRu: "Канатная дорога" },
            { termEs: "Servicio mecánico", translationRu: "Механическая помощь / сервис" },
            { termEs: "Restaurante", translationRu: "Ресторан" },
            { termEs: "Aeropuerto", translationRu: "Аэропорт" },
            { termEs: "Gomería", translationRu: "Шиномонтаж" },
            { termEs: "Estacionamiento", translationRu: "Стоянка" },
            { termEs: "Punto panorámico", translationRu: "Панорамная точка" },
            { termEs: "Plaza", translationRu: "Площадь / парк" },
            { termEs: "Correo", translationRu: "Почта" },
            { termEs: "Casas rodantes", translationRu: "Автодома / кемперы" },
            { termEs: "Museo", translationRu: "Музей" },
            { termEs: "Policía", translationRu: "Полиция" },
            { termEs: "Terminal de ómnibus", translationRu: "Автовокзал" },
            { termEs: "Estación de ferrocarril", translationRu: "Железнодорожная станция" },
            { termEs: "Teatro", translationRu: "Театр" },
            { termEs: "Ascenso y descenso", translationRu: "Подъем и спуск / посадка и высадка" },
            { termEs: "Escolares", translationRu: "Школьники" },
            { termEs: "Personas con movilidad reducida", translationRu: "Люди с ограниченной мобильностью" },
            { termEs: "Educativas y anuncios especiales", translationRu: "Образовательные и специальные объявления" },
            { termEs: "En conmemoración a una víctima de tránsito", translationRu: "В память о жертве дорожного инцидента" }
          ],
          bodyRu:
            "Пиктограммы и подписи остаются внутри изображения; русские надписи поверх них не добавляются."
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
            "Страница о знаке Желтая звезда с испанским текстом.",
          visibleSpanish: true,
          officialSignException,
          termTranslations: [
            { termEs: "Estrella Amarilla", translationRu: "Желтая звезда" },
            { termEs: "En memoria de una víctima de tránsito", translationRu: "В память о жертве дорожного инцидента" },
            { termEs: "Memoria, Prevención, Ley, Justicia y Educación", translationRu: "Память, предотвращение, закон, справедливость и образование" },
            { termEs: "estrellasamarillas@buenosaires.gob.ar", translationRu: "Официальный адрес для запроса установки Желтой звезды" },
            { termEs: "Mapa de estrellas amarillas", translationRu: "Карта Желтых звезд" }
          ],
          bodyRu:
            "Русский перевод содержания находится ниже; испанский текст внутри изображения не очищается и не переводится."
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
        "Также существует интерактивная карта Желтых звезд с данными о месте, имени, возрасте, дате рождения и дате смерти."
      ]
    }
  ]
};
