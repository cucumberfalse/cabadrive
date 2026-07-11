import type { ManualGuideSectionContent } from "../manualGuide";

const assetRoot =
  "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/app3-safety-elements";

export const app3SafetyElementsSection: ManualGuideSectionContent = {
  id: "app3-safety-elements-content",
  sectionId: "app3-safety-elements",
  titleRu: "Элементы безопасности",
  sourcePages: [169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181],
  sourceTitleEs: "Elementos de seguridad",
  status: "implemented",
  styleTokenFamilies: [
    "manual-prose",
    "manual-section-heading",
    "manual-callout-blue",
    "manual-legal-detail",
    "manual-source-artwork"
  ],
  visualEvidence: {
    checkerStatus: "pass",
    sourceScreenshots: [
      "content/validation/manual-guide/app3-safety-elements/page-169-safety-elements-source-crop.jpg",
      "content/validation/manual-guide/app3-safety-elements/page-170-safety-elements-source-crop.jpg",
      "content/validation/manual-guide/app3-safety-elements/page-171-safety-elements-source-crop.jpg",
      "content/validation/manual-guide/app3-safety-elements/page-172-safety-elements-source-crop.jpg",
      "content/validation/manual-guide/app3-safety-elements/page-173-safety-elements-source-crop.jpg",
      "content/validation/manual-guide/app3-safety-elements/page-174-safety-elements-source-crop.jpg",
      "content/validation/manual-guide/app3-safety-elements/page-175-safety-elements-source-crop.jpg",
      "content/validation/manual-guide/app3-safety-elements/page-176-safety-elements-source-crop.jpg",
      "content/validation/manual-guide/app3-safety-elements/page-177-safety-elements-source-crop.jpg",
      "content/validation/manual-guide/app3-safety-elements/page-178-safety-elements-source-crop.jpg",
      "content/validation/manual-guide/app3-safety-elements/page-179-safety-elements-source-crop.jpg",
      "content/validation/manual-guide/app3-safety-elements/page-180-safety-elements-source-crop.jpg",
      "content/validation/manual-guide/app3-safety-elements/page-181-safety-elements-source-crop.jpg"
    ],
    russianScreenshots: [
      "content/validation/manual-guide/app3-safety-elements/app3-safety-elements-desktop.png",
      "content/validation/manual-guide/app3-safety-elements/app3-safety-elements-mobile.png"
    ],
    notes: [
      "Pages 169-181 are implemented as selectable Russian DOM text.",
      "Source tire, mirror, belt, headrest, impact-speed, extinguisher, vest, first-aid, and tow-bar visuals remain unchanged in x5 evidence and are not translated, retouched, or redrawn.",
      "Page 169 also preserves the terminal Paseo del Bajo permit and contingency-route details that appear before the safety-elements heading in the source page."
    ]
  },
  blocks: [
    {
      id: "professional-maintenance",
      kind: "lead",
      sourceTextEs:
        "Todos los vehiculos tienen vida util; VTV chequea mecanicamente para garantizar normas de seguridad vial, prevenir y reducir siniestros; conductores deben supervisar condiciones antes de iniciar marcha.",
      textRu:
        "Любое транспортное средство имеет срок службы и естественный износ. VTV проверяет механическое состояние, чтобы обеспечить соблюдение норм дорожной безопасности, предотвратить и уменьшить дорожные инциденты. Водитель обязан убедиться, что грузовой транспорт находится в безопасном состоянии до начала движения."
    },
    {
      id: "paseo-del-bajo-page-169-carryover",
      kind: "list",
      titleRu: "Завершение правил Paseo del Bajo на странице 169",
      sourceTextEs:
        "Vehiculos de transito pesado de 12 toneladas o mas dentro del area delimitada requieren permiso previo; ante contingencia vial que impida Paseo del Bajo se autorizan recorridos excepcionales sur-norte y norte-sur.",
      itemsRu: [
        "Если тяжелому транспорту из грузовиков и прицепов с индивидуальной массой 12 t или больше нужно прибыть в зону, ограниченную Av. Paseo Colon, Leandro N. Alem, San Martin, Av. Antartida Argentina, Cecilia Grierson, Av. Int. Hernan M. Giralt, Av. Dr. Tristan Achaval Rodriguez, Elvira Rawson de Dellepiane, Av. Alicia Moreau de Justo и Av. San Juan, нужно заранее оформить разрешение у компетентного органа.",
        "Если дорожная непредвиденная ситуация полностью исключает движение через Paseo del Bajo, действуют исключительные маршруты для тяжелых грузовиков и прицепов с индивидуальной массой 12 t или больше, с грузом или без него, а также для междугородних автобусов с пассажирами или без.",
        "Направление юг-север: от своего маршрута к Av. Elvira Rawson de Dellepiane, Calabria, Av. de los Italianos, Mariquita Sanchez de Thompson, Av. Int. Hernan M. Giralt, Cecilia Grierson, Av. Antartida Argentina, Av. Ramon S. Castillo, затем обратно на свой маршрут.",
        "Направление север-юг: от своего маршрута к Av. Ramon S. Castillo, Av. Antartida Argentina, San Martin, Av. Eduardo Madero, Av. Ing. Huergo, затем обратно на свой маршрут."
      ]
    },
    {
      id: "active-passive",
      kind: "list",
      titleRu: "Активная и пассивная безопасность",
      sourceTextEs:
        "Seguridad activa evita siniestros; seguridad pasiva minimiza consecuencias cuando el siniestro ya ocurrio.",
      itemsRu: [
        "Активная безопасность помогает не допустить инцидент, улучшая эффективность, устойчивость и работу движущегося транспортного средства.",
        "Пассивная безопасность уменьшает последствия уже произошедшего инцидента.",
        "Опыт водителя не должен компенсировать нарушения норм или невнимательность: он должен помогать отвечать на требования профессионального вождения."
      ]
    },
    {
      id: "engine-braking",
      kind: "callout",
      sourceTextEs:
        "El frenado tambien se puede conseguir con el motor; cuanto mas baja relacion de marcha mas retiene; evita desgaste prematuro del sistema de frenado.",
      textRu:
        "Торможение можно получать и двигателем: чем ниже передача, тем сильнее удержание. Это особенно важно на крутых спусках и помогает избежать преждевременного износа тормозной системы."
    },
    {
      id: "brake-system",
      kind: "list",
      titleRu: "Тормоза",
      sourceTextEs:
        "Sistema de frenos es la seguridad activa mas importante; revisar frenos cada 6 meses, amortiguadores, neumaticos, estado de carretera y liquido o presion de aire.",
      itemsRu: [
        "Тормозная система - самый важный элемент активной безопасности: она снижает скорость или останавливает транспорт без потери траектории.",
        "При частом использовании тормоза нужно проверять минимум каждые 6 месяцев.",
        "Амортизаторы должны быть в идеальном состоянии; иначе тормозной путь может увеличиться на 10%.",
        "Состояние и давление шин влияют на эффективность торможения.",
        "Нужно учитывать покрытие и погоду: разные асфальты и климатические условия меняют способность тормозить.",
        "Нужно поддерживать указанное количество жидкости или давление воздуха в тормозной системе."
      ]
    },
    {
      id: "steering-suspension",
      kind: "list",
      titleRu: "Рулевое управление и подвеска",
      sourceTextEs:
        "Direccion garantiza maniobra correcta; a altas velocidades se endurece; suspension mantiene neumaticos en contacto con el piso y absorbe irregularidades.",
      itemsRu: [
        "Рулевое управление направляет колеса и участвует в устойчивости; на высоких скоростях оно становится более жестким, чтобы избежать инцидентов.",
        "Если руль становится тяжелым, нестабильным или появляются необычные шумы, нужна проверка в мастерской.",
        "Существуют механическая, гидравлическая, электрогидравлическая и электромеханическая или электрическая системы.",
        "Подвеска удерживает шины в контакте с дорогой, поглощает неровности, поддерживает устойчивость и комфорт.",
        "Стабилизаторы соединяют колеса каждой оси и контролируют крен в поворотах; неисправная подвеска может привести к потере устойчивости и контроля."
      ]
    },
    {
      id: "tires",
      kind: "list",
      titleRu: "Шины",
      sourceTextEs:
        "Neumaticos soportan hasta 50 veces su propio peso; dibujo menor a 1,6 mm requiere reemplazo; en gran porte con 2 mm es recomendable cambio; no usar mas de 5 anos.",
      itemsRu: [
        "Шины - точка контакта с дорогой и могут выдерживать нагрузку до 50 раз больше собственного веса.",
        "От шин зависят сцепление, трение, тяга, устойчивость, подвеска и торможение.",
        "Если есть вздутия, разрывы или глубина рисунка меньше 1,6 mm, шины нужно заменить.",
        "Для крупногабаритного транспорта замену рекомендуется делать уже при 2 mm.",
        "Рисунок отводит воду из зоны контакта и помогает избежать потери сцепления на воде (aquaplaning).",
        "Не рекомендуется использовать шины старше 5 лет с даты изготовления независимо от износа, потому что они теряют гибкость и сцепление.",
        "Восстановленные шины запрещены на передних осях грузовиков и средне- и дальнемагистральных автобусов.",
        "Давление нужно измерять на холодных шинах и контролировать периодически."
      ]
    },
    {
      id: "mirrors-blind-spots",
      kind: "list",
      titleRu: "Зеркала и слепые зоны",
      sourceTextEs:
        "Espejos retrovisores reducen puntos ciegos pero nunca a cero; cuanto mas grande el vehiculo mayor punto ciego; como maximo debe reflejarse 10% de parte trasera; se pierden aproximadamente 3 metros de vision delantera a corta distancia.",
      itemsRu: [
        "Зеркала нужны, чтобы видеть другие транспортные средства и пешеходов, но даже правильная настройка не уменьшает слепые зоны до нуля.",
        "Чем больше транспортное средство, тем больше слепая зона.",
        "В грузовике нет внутреннего зеркала заднего вида, а внешние зеркала из-за высоты кабины не покрывают широко боковые зоны.",
        "Перед поворотом или перестроением нужно снизить скорость, включить указатель поворота и несколько раз посмотреть в зеркала.",
        "При настройке зеркал максимум 10% задней части транспортного средства должно отражаться в зеркале.",
        "В крупном транспортном средстве чем выше кабина, тем меньше ближний передний обзор: водитель теряет примерно 3 метра перед собой.",
        "Перед маневром рекомендуется смотреть в зеркала не менее двух раз и слегка податься корпусом вперед, чтобы расширить угол обзора.",
        "Выпуклые сертифицированные зеркала полезны, но отражают объекты меньшими и более удаленными, чем в действительности."
      ]
    },
    {
      id: "seatbelt-pregnancy-headrest",
      kind: "list",
      titleRu: "Ремень, беременность и подголовник",
      sourceTextEs:
        "Cinturon sujeta personas; conductores son responsables de su uso; embarazadas minimo 25 cm del abdomen/torax al volante; octavo mes recomendable otra persona conduzca; apoyacabeza reduce efecto latigo.",
      itemsRu: [
        "Ремень безопасности удерживает людей в транспортном средстве; после удара люди продолжают двигаться с прежней скоростью, если их ничто не останавливает.",
        "Для разных грузовых транспортных средств тип и расположение ремней зависит от количества перевозимых людей, типа транспорта и выполняемой деятельности.",
        "Водитель отвечает перед контролирующим органом за использование ремня.",
        "При беременности нужно регулировать руль и сиденье так, чтобы между животом или грудью и рулем было минимум 25 cm.",
        "Если руль регулируется по наклону, его направляют к груди, не к голове и не к животу.",
        "С восьмого месяца беременности лучше, чтобы управлял другой человек.",
        "Верхняя лямка должна проходить по ключице между плечом и шеей и спускаться по центру груди.",
        "Нижняя лямка должна лежать на костях таза, всегда ниже живота.",
        "Подголовник уменьшает эффект хлыста; его верхняя часть должна быть на высоте верхней части головы, а центральная часть - на линии глаз."
      ]
    },
    {
      id: "seatbelt-source-visual",
      kind: "source-image-cards",
      titleRu: "Фото правильного использования ремня",
      sourceTextEs:
        "Uso correcto del cinturon: debe pasar por la clavicula, quedar sobre los huesos de la cadera y no colocarse sobre el cuello, pecho o abdomen.",
      cards: [
        {
          id: "app3-seatbelt-source-card",
          titleRu: "Что означает фото",
          displayMode: "full-width",
          maxDisplayWidthPx: 1175,
          sourcePage: 176,
          sourceRegion: { x: 875, y: 1250, width: 1175, height: 1125 },
          assetPath: `${assetRoot}/seatbelt-source-as-is.png`,
          altRu:
            "Фото правильного и неправильного использования ремня безопасности.",
          visibleSpanish: true,
          sourceImageException: {
            kind: "source-image-original-visible-text",
            visibleSpanishScope: "source-image-only",
            sourceAsIs: true,
            russianExplanationOutsideImage: true
          },
          termTranslations: [
            { termEs: "Uso Correcto", translationRu: "Правильное использование" },
            { termEs: "Debe pasar por la clavícula", translationRu: "Плечевая лямка должна проходить по ключице." },
            { termEs: "Debe colocarse sobre los huesos de la cadera", translationRu: "Нижняя лямка должна лежать на костях таза, ниже живота." },
            { termEs: "Si está colocado sobre el cuello o pecho", translationRu: "Если ремень проходит по шее или груди, возможны тяжелые травмы." },
            { termEs: "Si se coloca sobre el abdomen", translationRu: "Если ремень проходит по животу, он может повредить внутренние органы." },
            { termEs: "Embarazadas", translationRu: "Беременные: настроить руль и сиденье так, чтобы оставалось минимум 25 cm до руля." }
          ],
          bodyRu:
            "Как читать фото: верхняя лямка проходит через ключицу между плечом и шеей; нижняя лямка лежит на костях таза ниже живота; ремень должен плотно прилегать, не быть перекрученным и не проходить по твердым или хрупким предметам. Ремень на шее, груди или животе может вызвать тяжелые травмы и ухудшает удержание при ударе."
        }
      ],
      visualNotes: [
        "The page 176 seatbelt photo/caption source visual is retained source-as-is; Russian explanation is outside the image as selectable DOM text."
      ]
    },
    {
      id: "airbag-bumper-glass-cabin",
      kind: "list",
      titleRu: "Подушка безопасности (airbag), бамперы, стекла и кабина",
      sourceTextEs:
        "Airbag complementa cinturon y requiere distancia minima 25 cm; paragolpes obligatorios; cristales templados o laminados; habitaculo debe ser indeformable y ordenado.",
      itemsRu: [
        "Подушка безопасности (airbag) дополняет ремень безопасности, но не заменяет его; без ремня подушка безопасности (airbag) может вызвать тяжелые травмы.",
        "Подушка безопасности (airbag) безопасна при минимальной дистанции 25 cm от тела до зоны раскрытия.",
        "Бамперы спереди и сзади обязательны по Ley N°2148 и должны соответствовать форме и размерам регламента.",
        "Стекла обеспечивают видимость, аэродинамику и защиту; по расположению и назначению они бывают закаленными или ламинированными.",
        "Кабина должна быть максимально недеформируемой, пока передняя и задняя зоны программируемо деформируются.",
        "Лишние предметы отвлекают, закрывают обзор или мешают командам. Их нельзя перевозить незакрепленными, потому что при ударе кинетическая энергия увеличивает риск тяжелой травмы.",
        "Порядок в кабине снижает дополнительный стресс при выполнении задач, связанных с вождением."
      ]
    },
    {
      id: "mandatory-equipment",
      kind: "list",
      titleRu: "Обязательные элементы",
      sourceTextEs:
        "Balizas al menos dos; matafuego obligatorio, carga periodica, al alcance en habitaculo salvo mayor a 1 kg, fijado; chaleco reflectivo obligatorio dentro del habitaculo y obligatorio al descender por fuerza mayor en autopistas/vias rapidas.",
      itemsRu: [
        "Аварийных треугольников должно быть минимум два, и они должны лежать в доступном месте.",
        "Их задача - предупредить других людей об остановленном транспортном средстве, чтобы они успели увидеть риск и отреагировать.",
        "Огнетушитель обязателен, его нужно периодически перезаряжать; емкость и класс зависят от типа транспортного средства.",
        "Огнетушитель должен быть в пределах досягаемости водителя в кабине, кроме случаев, когда его емкость больше 1 kg.",
        "Огнетушитель не может лежать свободно: он должен быть закреплен так, чтобы не создавать риск для людей, и его нельзя крепить на стойках крыши кузова.",
        "Световозвращающий жилет обязателен внутри кабины.",
        "При выходе на проезжую часть рекомендуется надевать жилет без другой одежды поверх него; при вынужденном выходе на автомагистралях или других скоростных дорогах его использование обязательно."
      ]
    },
    {
      id: "recommended-equipment",
      kind: "list",
      titleRu: "Рекомендуемые элементы",
      sourceTextEs:
        "Botiquin con gasas, vendas, tela adhesiva, agua oxigenada, solucion yodada, alcohol, guantes, cremas, medicamentos, pinzas, tijera y linterna; cuarta de enganche homologada reemplaza cuerdas y cables; no puede usarse dentro de CABA.",
      itemsRu: [
        "Аптечку рекомендуется иметь для базовой первой помощи до прибытия медицинской помощи.",
        "Аптечку нужно обозначить красным крестом на белой коробке или наоборот и закрепить в безопасном месте.",
        "Содержимое: стерильная гидрофильная марля, бинты и повязки разных размеров, гипоаллергенный пластырь, перекись водорода, раствор йода, спирт или другой дезинфектант.",
        "Также: несколько пар латексных или виниловых перчаток, крем от ожогов, противодиарейное средство, анальгетики, противовоспалительное, крем от укусов насекомых, пинцет, ножницы, фонарик и запасные батарейки или аккумулятор.",
        "Сертифицированная телескопическая буксировочная штанга заменяет веревки, тросы и другие гибкие средства, которые запрещены как небезопасные и недействительные для буксировки.",
        "Штанга соединяет заводские точки буксировки двух транспортных средств.",
        "В CABA ее нельзя использовать частному транспортному средству для буксировки другого: услуга должна выполняться уполномоченным транспортом."
      ]
    }
  ]
};
