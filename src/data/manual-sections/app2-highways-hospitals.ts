import type { ManualGuideSectionContent } from "../manualGuide";

const assetRoot =
  "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/app2-highways-hospitals";

export const app2HighwaysHospitalsSection: ManualGuideSectionContent = {
  id: "app2-highways-hospitals-content",
  sectionId: "app2-highways-hospitals",
  titleRu: "Автомагистрали и больницы",
  sourcePages: [149, 150, 151],
  sourceTitleEs: "Autopistas y hospitales",
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
      "content/validation/manual-guide/app2-highways-hospitals/page-149-highways-hospitals-source-crop.jpg",
      "content/validation/manual-guide/app2-highways-hospitals/page-150-highways-hospitals-source-crop.jpg",
      "content/validation/manual-guide/app2-highways-hospitals/page-151-highways-hospitals-source-crop.jpg"
    ],
    russianScreenshots: [
      "content/validation/manual-guide/app2-highways-hospitals/app2-highways-hospitals-desktop.png",
      "content/validation/manual-guide/app2-highways-hospitals/app2-highways-hospitals-mobile.png"
    ],
    notes: [
      "Page 150 hospital map is rendered at runtime as a transferred source infographic from the x5 source crop.",
      "Spanish map labels were removed from tight label-local glyph regions with OpenCV Telea inpainting; no broad square/plate cleanup is used.",
      "Yellow H/H1/H2 hospital markers, colored regions, boundaries, roads/lines, icons, layout, and colors remain source-derived; Russian marker labels are selectable DOM overlay text."
    ]
  },
  blocks: [
    {
      id: "paseo-del-bajo-role",
      kind: "lead",
      sourceTextEs:
        "Paseo del Bajo es corredor vial preferencial para transito pesado y omnibus de larga distancia con mas de 19 asientos.",
      textRu:
        "Paseo del Bajo - предпочтительный дорожный коридор для тяжелого транспорта и междугородних пассажирских автобусов. Он отделяет такие потоки от пешеходов, частных автомобилей и городских автобусов, потому что они движутся на другом уровне."
    },
    {
      id: "paseo-del-bajo-allowed",
      kind: "list",
      titleRu: "Кто и как движется по Paseo del Bajo",
      sourceTextEs:
        "Camiones y acoplados de 12 toneladas o mas y omnibus de larga distancia con capacidad mayor de 19 asientos habilitados para turismo; velocidad maxima 60 km/h.",
      itemsRu: [
        "Коридор предназначен для грузовиков и прицепов с индивидуальной массой 12 t или больше.",
        "Также он предназначен для междугородних пассажирских автобусов с вместимостью больше 19 мест, допущенных для туристической деятельности, с пассажирами или без них.",
        "Он соединяет Autopista Illia, Autopista Buenos Aires-La Plata и Autopista 25 de Mayo.",
        "Максимальная скорость на разных уровнях - 60 km/h."
      ]
    },
    {
      id: "paseo-del-bajo-prohibitions",
      kind: "list",
      titleRu: "Запреты и неисправности",
      sourceTextEs:
        "Prohibida circulacion de ciclorodados, motovehiculos, automoviles, taxis, remises, lineas de colectivos y vehiculos no permitidos; prohibido estacionamiento y detencion 24 horas; avisar a AUSA ante imposibilidad de continuar.",
      itemsRu: [
        "Запрещено движение велосипедных транспортных средств, мототранспорта, автомобилей, такси, ремисов и линий общественного пассажирского автотранспорта.",
        "Запрещен любой транспорт, не разрешенный в соответствующем пункте источника.",
        "Стоянка и остановка запрещены 24 часа в сутки на обеих проезжих частях.",
        "Если транспорт не может продолжать нормальное движение, нужно уведомить AUSA; она отбуксирует и уберет транспорт."
      ]
    },
    {
      id: "paseo-del-bajo-exceptions",
      kind: "list",
      titleRu: "Исключительные маршруты при полной блокировке",
      sourceTextEs:
        "Solo ante contingencia vial que imposibilite totalmente la circulacion, transito pesado y omnibus de larga distancia circularan por arterias norte-sur y sur-norte indicadas.",
      itemsRu: [
        "Исключение действует только при дорожной непредвиденной ситуации, полностью блокирующей движение через Paseo del Bajo.",
        "Юг - север: от своего маршрута к Av. Elvira Rawson de Dellepiane, Calabria, Av. de los Italianos, Mariquita Sánchez de Thompson, Av. Int. Hernán M. Giralt, Cecilia Grierson, Av. Antártida Argentina, Av. Ramón S. Castillo, затем свой маршрут.",
        "Север - юг: от своего маршрута к Av. Ramón S. Castillo, Av. Antártida Argentina, San Martín, Av. Eduardo Madero, Av. Ing. Huergo, затем свой маршрут."
      ]
    },
    {
      id: "hospital-map-disposition",
      kind: "list",
      titleRu: "Карта больниц на странице источника",
      sourceTextEs:
        "Mapa de Hospitales Generales de Agudos: Dr. I. Pirovano, A. Zubizarreta, D. Velez Sarsfield, Dr. T. Alvarez, P. Pinero, J. M. Penna, Dr. C. Argerich, J. M. Ramos Mejia, Dr. E. Tornu, Dr. C. Durand, Dr. J. A. Fernandez, B. Rivadavia, Donacion F. Santojanni, Cecilia Grierson.",
      itemsRu: [
        "Страница 150 источника содержит карту общих больниц для острых случаев. В русской версии карта перенесена как исходное изображение: испанские подписи удалены на уровне букв, а русские метки добавлены поверх как выбираемый DOM-текст.",
        "Желтые маркеры H/H1/H2 сохранены как исходные пиксели карты. Русские метки Б/Б1/Б2 рядом с ними помогают читать карту без изменения самих маркеров.",
        "Полные названия больниц приведены ниже обычным русским текстом, потому что полностью подписывать каждую больницу внутри плотной карты было бы плохо читаемо."
      ]
    },
    {
      id: "hospital-map-source-visual",
      kind: "source-image-cards",
      titleRu: "Перенесенная карта больниц",
      sourceTextEs:
        "Mapa de Hospitales Generales de Agudos.",
      cards: [
        {
          id: "app2-hospital-map-source-card",
          titleRu: "Карта больниц CABA",
          sourcePage: 150,
          sourceRegion: { x: 1332, y: 1854, width: 780, height: 335 },
          assetPath: `${assetRoot}/hospital-map-transferred-infographic.png`,
          altRu:
            "Перенесенная карта общих больниц CABA с сохраненными исходными маркерами H и русскими метками поверх карты.",
          visibleSpanish: false,
          russianOverlayLabels: [
            { id: "hospital-map-title", textRu: "Больницы CABA", xPct: 6, yPct: 12, widthPct: 20, heightPct: 7, tone: "dark-on-light" },
            { id: "hospital-map-legend", textRu: "Б = больница", xPct: 6, yPct: 21, widthPct: 18, heightPct: 7, tone: "dark-on-light" },
            { id: "hospital-marker-north", textRu: "Б", xPct: 46.8, yPct: 13, widthPct: 4.5, heightPct: 6, tone: "dark-on-light" },
            { id: "hospital-marker-west-north", textRu: "Б", xPct: 42.2, yPct: 29.5, widthPct: 4.5, heightPct: 6, tone: "dark-on-light" },
            { id: "hospital-marker-west", textRu: "Б", xPct: 35.5, yPct: 36.8, widthPct: 4.5, heightPct: 6, tone: "dark-on-light" },
            { id: "hospital-marker-west-center", textRu: "Б", xPct: 36.7, yPct: 52.5, widthPct: 4.5, heightPct: 6, tone: "dark-on-light" },
            { id: "hospital-marker-southwest", textRu: "Б", xPct: 38.2, yPct: 68.5, widthPct: 4.5, heightPct: 6, tone: "dark-on-light" },
            { id: "hospital-marker-south", textRu: "Б", xPct: 47.5, yPct: 84.2, widthPct: 4.5, heightPct: 6, tone: "dark-on-light" },
            { id: "hospital-marker-h1-center", textRu: "Б1", xPct: 44.7, yPct: 53.5, widthPct: 5.5, heightPct: 6, tone: "dark-on-light" },
            { id: "hospital-marker-h2-center", textRu: "Б2", xPct: 48.5, yPct: 66.8, widthPct: 5.5, heightPct: 6, tone: "dark-on-light" },
            { id: "hospital-marker-red", textRu: "Б", xPct: 51.8, yPct: 42.6, widthPct: 4.5, heightPct: 6, tone: "dark-on-light" },
            { id: "hospital-marker-northeast-blue", textRu: "Б", xPct: 59, yPct: 26.7, widthPct: 4.5, heightPct: 6, tone: "light-on-blue" },
            { id: "hospital-marker-northeast-orange", textRu: "Б", xPct: 61.6, yPct: 33.4, widthPct: 4.5, heightPct: 6, tone: "dark-on-light" },
            { id: "hospital-marker-east", textRu: "Б", xPct: 59, yPct: 47.5, widthPct: 4.5, heightPct: 6, tone: "dark-on-light" },
            { id: "hospital-marker-h1-east", textRu: "Б1", xPct: 59.1, yPct: 63.1, widthPct: 5.5, heightPct: 6, tone: "dark-on-light" },
            { id: "hospital-marker-southeast", textRu: "Б", xPct: 68.4, yPct: 56.2, widthPct: 4.5, heightPct: 6, tone: "light-on-blue" }
          ],
          bodyRu:
            "Карта перенесена из x5-фрагмента страницы 150. Испанские подписи районов удалены только в узких областях букв, без перерисовки карты; русские метки Б/Б1/Б2 наложены как выбираемый текст поверх сохраненного исходного изображения."
        }
      ],
      visualNotes: [
        "The map base is the x5 page 150 source crop, not a redraw.",
        "Spanish map labels are cleaned with tight glyph-local inpainting; yellow H/H1/H2 markers, colored regions, boundaries, roads/lines, icons, layout, and colors are preserved.",
        "Russian map labels are selectable DOM overlays; full hospital names are listed below for readability."
      ]
    },
    {
      id: "hospital-map-full-list",
      kind: "list",
      titleRu: "Полный список больниц с карты",
      sourceTextEs:
        "Dr. I. Pirovano, A. Zubizarreta, D. Velez Sarsfield, Dr. T. Alvarez, P. Pinero, J. M. Penna, Dr. C. Argerich, J. M. Ramos Mejia, Dr. E. Tornu, Dr. C. Durand, Dr. J. A. Fernandez, B. Rivadavia, Donacion F. Santojanni, Cecilia Grierson.",
      itemsRu: [
        "Доктор И. Пировано.",
        "А. Субисаррета.",
        "Д. Велес Сарсфилд.",
        "Доктор Т. Альварес.",
        "П. Пиньеро.",
        "Х. М. Пенна.",
        "Доктор К. Аргерич.",
        "Х. М. Рамос Мехия.",
        "Доктор Э. Торну.",
        "Доктор К. Дуранд.",
        "Доктор Х. А. Фернандес.",
        "Б. Ривадавия.",
        "Донасьон Ф. Сантоханни.",
        "Сесилия Гриерсон."
      ]
    },
    {
      id: "closing-public-transport",
      kind: "quote",
      sourceTextEs:
        "El transporte publico es de gran importancia para el funcionamiento, mantenimiento y crecimiento de una sociedad.",
      textRu:
        "Общественный транспорт имеет большое значение для функционирования, поддержания и развития общества."
    }
  ]
};
