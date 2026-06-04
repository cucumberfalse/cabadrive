import type { ManualGuideSectionContent } from "../manualGuide";

export const app3SocialResponsibilitySection: ManualGuideSectionContent = {
  id: "app3-social-responsibility-content",
  sectionId: "app3-social-responsibility",
  titleRu: "Социальная ответственность",
  sourcePages: [155, 156, 157, 158, 159],
  sourceTitleEs: "Una responsabilidad social",
  status: "implemented",
  styleTokenFamilies: [
    "manual-prose",
    "manual-section-heading",
    "manual-callout-blue",
    "manual-legal-detail"
  ],
  visualEvidence: {
    checkerStatus: "pass",
    sourceScreenshots: [
      "content/validation/manual-guide/app3-social-responsibility/page-155-social-responsibility-source-crop.jpg",
      "content/validation/manual-guide/app3-social-responsibility/page-156-social-responsibility-source-crop.jpg",
      "content/validation/manual-guide/app3-social-responsibility/page-157-social-responsibility-source-crop.jpg",
      "content/validation/manual-guide/app3-social-responsibility/page-158-social-responsibility-source-crop.jpg",
      "content/validation/manual-guide/app3-social-responsibility/page-159-social-responsibility-source-crop.jpg"
    ],
    russianScreenshots: [
      "content/validation/manual-guide/app3-social-responsibility/app3-social-responsibility-desktop.png",
      "content/validation/manual-guide/app3-social-responsibility/app3-social-responsibility-mobile.png"
    ],
    notes: [
      "Pages 155-159 are implemented as selectable Russian DOM text.",
      "The source lifting/posture pictograms on page 157 remain unchanged in x5 evidence and are not redrawn, translated, masked, or retouched."
    ]
  },
  blocks: [
    {
      id: "social-role",
      kind: "lead",
      sourceTextEs:
        "El transporte de cargas y mercaderias es fundamental para el funcionamiento de una sociedad... quienes se desempenan en esta actividad tienen un rol muy importante que requiere gran responsabilidad.",
      textRu:
        "Перевозка грузов и товаров необходима для работы общества: через нее перемещаются сырье, продукты, лекарства и другие ежедневные товары. Поэтому водитель грузового транспорта выполняет важную общественную роль и несет большую ответственность."
    },
    {
      id: "sustainable-mobility",
      kind: "callout",
      sourceTextEs:
        "El rediseno de infraestructura favorece modalidades alternativas al automovil particular, promoviendo el derecho a la movilidad; quienes conducen cargas construyen el espacio del transito.",
      textRu:
        "В рамках устойчивой и безопасной мобильности город меняет инфраструктуру, поддерживает альтернативы частному автомобилю и право на мобильность. Водители грузов вместе с другими участниками формируют пространство дорожного движения."
    },
    {
      id: "professionalism-benefits",
      kind: "quote",
      sourceTextEs:
        "Lograr una mayor profesionalizacion del oficio conlleva mayor bienestar, disminuir riesgos de incidentes viales y mejorar la calidad laboral y del servicio.",
      textRu:
        "Чем выше профессионализация работы, тем выше благополучие общества, ниже риск дорожных инцидентов и лучше качество труда и предоставляемого сервиса."
    },
    {
      id: "preventive-factors",
      kind: "list",
      titleRu: "Факторы, которые нужно учитывать заранее",
      sourceTextEs:
        "Documentacion, vehiculo, carga, ascenso y descenso de la unidad, paradas de descanso, postura corporal, alimentacion.",
      itemsRu: [
        "Документация должна быть полной, упорядоченной и доступной до начала поездки.",
        "Транспортное средство нужно проверить по общему состоянию, безопасности и обслуживанию.",
        "Груз требует контроля, правильной обработки, распределения и крепления.",
        "Подъем в кабину и спуск из нее должны выполняться с учетом риска падений, ударов и травм.",
        "Нужно заранее планировать остановки для отдыха.",
        "Поза тела и эргономика важны для предотвращения мышечных и суставных травм.",
        "Питание должно планироваться так, чтобы прием пищи не совпадал с управлением транспортом."
      ]
    },
    {
      id: "confidence-risk",
      kind: "callout",
      sourceTextEs:
        "El exceso de confianza expone las habilidades al limite y promueve maniobras temerarias no percibidas como riesgosas.",
      textRu:
        "Избыточная уверенность выводит навыки водителя на предел и подталкивает к рискованным маневрам, которые могут не восприниматься как опасные."
    },
    {
      id: "vehicle-precheck",
      kind: "list",
      titleRu: "Проверка транспортного средства",
      sourceTextEs:
        "Verificar cierres, precintos, presion y aire de cubiertas, herramientas, neumaticos de reemplazo, frenos, fluidos, funcionamiento electrico, direccion, luces, bocina, parabrisas, espejos y visibilidad.",
      itemsRu: [
        "Проверить замки, пломбы, давление и состояние шин.",
        "Проверить инструменты и запасные шины.",
        "Проверить тормоза и уровни жидкостей: воду, масла, жидкость или давление воздуха в тормозной системе.",
        "Проверить электрику, рулевое управление, свет, сигнал, лобовое стекло, зеркала и видимость через стекла."
      ]
    },
    {
      id: "cargo-handling",
      kind: "list",
      titleRu: "Обращение с грузом",
      sourceTextEs:
        "Riesgos por exigencia biomecanica al acomodar lona, apretar fajas o amarras, sostenerse para subir; postura correcta: doblar rodillas, no cintura o espalda, mantener objeto cerca del cuerpo.",
      itemsRu: [
        "При проверках груза возможны биомеханические риски: натянуть тент, затянуть ремни или стяжки, удерживаться при подъеме на решетку для животных.",
        "Поднимать груз нужно сгибая колени, а не поясницу или спину.",
        "При подъеме или опускании предмета нужно напрягать мышцы живота и держать предмет как можно ближе к телу.",
        "Поднимать предметы нужно медленно, используя мышцы бедер и коленей.",
        "Груз должен быть правильно распределен, уложен и устойчиво закреплен, чтобы не смещаться внутри во время движения грузовика."
      ]
    },
    {
      id: "access-and-rest",
      kind: "list",
      titleRu: "Подъем, спуск и отдых",
      sourceTextEs:
        "Tres puntos de apoyo; manos libres; ropa no holgada; calzado y guantes adecuados; paradas de descanso para recuperar atencion.",
      itemsRu: [
        "Подниматься и спускаться нужно держась за поручни, с свободными руками.",
        "Нужно сохранять три точки опоры: две руки и одна нога или две ноги и одна рука.",
        "Следует проверять безопасность доступа и избегать влажных или нестабильных ступеней.",
        "Нельзя пользоваться телефоном или держать предметы в скользких или травмоопасных местах; во время вождения запрещены телефон и наушники.",
        "Рабочая одежда не должна быть свободной и цепляться; нужны подходящие обувь и перчатки от работодателя.",
        "Средства индивидуальной защиты не устраняют риск, но уменьшают вероятность инцидентов и профессиональных заболеваний.",
        "Остановки отдыха помогают восстановить внимание, снять тревожность и отделить дополнительные дела от момента управления."
      ]
    }
  ]
};
