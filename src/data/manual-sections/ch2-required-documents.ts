import type { ManualGuideSectionContent } from "../manualGuide";

const assetRoot =
  "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/ch2-required-documents";

const sourceImageException = {
  kind: "source-document-example-original-visible-text",
  visibleSpanishScope: "source-document-example-image-only",
  sourceAsIs: true,
  russianExplanationOutsideImage: true
} as const;

export const ch2RequiredDocumentsSection: ManualGuideSectionContent = {
  id: "ch2-required-documents-content",
  sectionId: "ch2-required-documents",
  titleRu: "Обязательные документы",
  sourcePages: [46, 47, 48, 49, 50],
  sourceTitleEs: "Documentación obligatoria",
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
      "content/validation/manual-guide/ch2-required-documents/page-046-dni-source-crop.jpg",
      "content/validation/manual-guide/ch2-required-documents/page-046-license-source-crop.jpg",
      "content/validation/manual-guide/ch2-required-documents/page-047-beginner-sign-source-crop.jpg",
      "content/validation/manual-guide/ch2-required-documents/page-047-cedulas-source-crop.jpg",
      "content/validation/manual-guide/ch2-required-documents/page-049-vtv-source-crop.jpg",
      "content/validation/manual-guide/ch2-required-documents/page-050-rva-source-crop.jpg"
    ],
    russianScreenshots: [
      "content/validation/manual-guide/ch2-required-documents/ch2-required-documents-desktop.png",
      "content/validation/manual-guide/ch2-required-documents/ch2-required-documents-mobile.png"
    ],
    notes: [
      "Source PDF pages 46-50 are converted as one Chapter 2 documentation section.",
      "DNI, license, beginner, cédula, VTV, and RVA visuals are scale-5 source document example crops rendered source-as-is.",
      "The Spanish text inside document visuals is not translated or cleaned; Russian explanations are selectable DOM text outside each image."
    ]
  },
  blocks: [
    {
      id: "documents-scope",
      kind: "lead",
      sourceTextEs:
        "Esta documentación es exigida para conducir todo tipo de vehículo en CABA.",
      textRu:
        "Этот набор документов требуется для управления любым типом транспортного средства в CABA. Национальный закон 24449 также добавляет подтверждения оплаты налога на регистрацию транспортного средства и, когда применимо, оплаты проезда; для профессиональных или специальных услуг могут требоваться дополнительные документы."
    },
    {
      id: "identity-license-visuals",
      kind: "source-image-cards",
      titleRu: "Документы личности и водительское удостоверение",
      sourceTextEs: "Documento Nacional de Identidad. Licencia de Conducir.",
      cards: [
        {
          id: "dni-source-card",
          titleRu: "DNI",
          sourcePage: 46,
          sourceRegion: { x: 1085, y: 1795, width: 320, height: 118 },
          assetPath: `${assetRoot}/dni-source-as-is.jpg`,
          altRu: "Исходный пример DNI из manual, оставленный без изменений.",
          visibleSpanish: true,
          sourceImageException,
          bodyRu:
            "DNI подтверждает личность гражданина Аргентины или иностранца с местом жительства в стране. Водительское удостоверение не заменяет документ личности; иностранцы должны иметь действующий личный документ."
        },
        {
          id: "license-source-card",
          titleRu: "Licencia de Conducir",
          sourcePage: 46,
          sourceRegion: { x: 1085, y: 1950, width: 300, height: 105 },
          assetPath: `${assetRoot}/license-source-as-is.jpg`,
          altRu: "Исходный пример Licencia Nacional de Conducir, оставленный без изменений.",
          visibleSpanish: true,
          sourceImageException,
          bodyRu:
            "Лицензия, выданная компетентным органом, подтверждает право управлять указанным типом транспортного средства после проверки психофизических и теоретико-практических требований."
        }
      ],
      visualNotes: [
        "Both document examples are source-as-is scale-5 crops.",
        "Russian explanations are outside the source images and remain selectable."
      ]
    },
    {
      id: "license-rules",
      kind: "list",
      titleRu: "Правила по водительскому удостоверению",
      sourceTextEs:
        "Obtención... Vigencia... Edad mínima... Educación vial...",
      itemsRu: [
        "Получение лицензии - не простой административный шаг: из-за ответственности водителя требуется оценка психофизических способностей и теоретико-практической пригодности.",
        "Срок действия зависит от возраста и результата психофизического экзамена.",
        "Нельзя управлять без лицензии или с просроченной лицензией. Если срок истек в нерабочий день, он переносится на следующий рабочий день.",
        "Просроченная лицензия может быть причиной удержания агентом дорожного движения или другим органом контроля.",
        "Если срок истек не более года назад, возможна renovación. Если прошло больше года, оформление идет как новое otorgamiento.",
        "Минимальный возраст: 16 лет для мопедов, 17 лет для остальных категорий, 21 год для профессиональных водителей. Эти минимумы не имеют исключений и не меняются эмансипацией.",
        "CABA предоставляет учебную площадку для безопасной практики и обязательные теоретические курсы для получения лицензии; для продления используются обновляющие материалы."
      ]
    },
    {
      id: "beginner-cedula-visuals",
      kind: "source-image-cards",
      titleRu: "Начинающий водитель и cédula",
      sourceTextEs:
        "Conductor/a principiante. Cédula de identificación del vehículo.",
      cards: [
        {
          id: "beginner-sign-source-card",
          titleRu: "Знак начинающего водителя",
          sourcePage: 47,
          sourceRegion: { x: 1085, y: 1605, width: 315, height: 215 },
          assetPath: `${assetRoot}/beginner-sign-source-as-is.jpg`,
          altRu: "Исходный знак Conductor Principiante, оставленный без изменений.",
          visibleSpanish: true,
          sourceImageException,
          bodyRu:
            "Статус principiante действует для человека, впервые получившего лицензию для мототранспортных средств или автомобилей. Знак нужно возить и показывать по правилам раздела."
        },
        {
          id: "cedulas-source-card",
          titleRu: "Cédula de identificación",
          sourcePage: 47,
          sourceRegion: { x: 1085, y: 2490, width: 1110, height: 260 },
          assetPath: `${assetRoot}/cedulas-source-as-is.jpg`,
          altRu: "Исходные примеры зеленой, синей, коричневой и розовой cédula, оставленные без изменений.",
          visibleSpanish: true,
          sourceImageException,
          bodyRu:
            "Cédula, выданная DNRPA, идентифицирует транспортное средство и владельца или уполномоченное лицо. Источник показывает прежние цветовые варианты; текущая логика раздела объясняется рядом текстом."
        }
      ],
      visualNotes: [
        "The beginner sign and cédula examples are source-as-is document visuals.",
        "No text inside the crops is translated, cleaned, or relabeled."
      ]
    },
    {
      id: "beginner-rules",
      kind: "list",
      titleRu: "Ограничения начинающего водителя",
      sourceTextEs:
        "Durante los primeros 6 meses... No podrán circular con más de 0,0 gramos de alcohol por litro de sangre durante los dos años...",
      itemsRu: [
        "Первые 6 месяцев нельзя ездить по arterias, где разрешена скорость выше 70 км/ч.",
        "В автомобиле знак начинающего водителя должен быть в нижней части лобового стекла и на заднем стекле; для мототранспортного средства его нужно иметь с собой вместе с остальными обязательными документами.",
        "В течение двух лет статуса начинающего водителя нельзя двигаться с уровнем алкоголя в крови выше 0,0 г/л.",
        "Классы лицензий не дают стаж друг для друга; тот, кто доказывает стаж с лицензией из другого муниципалитета или страны, не считается начинающим."
      ]
    },
    {
      id: "cedula-rules",
      kind: "list",
      titleRu: "Cédula de identificación del vehículo",
      sourceTextEs:
        "Función... Tipos... Vigencia... Uso... Trámite...",
      itemsRu: [
        "Если cédula не иметь при себе, невозможно подтвердить, что водитель является владельцем или имеет разрешение пользоваться транспортным средством.",
        "Ранее DNRPA выдавала разные cédulas по типу транспорта и статусу владельца/уполномоченного. Для унификации создана новая cédula, заменяющая прежние и действующая непрерывно.",
        "Срок действия: 1 год, но без срока истечения для владельца и для должным образом уполномоченных такси, remises, грузовых и пассажирских транспортных средств, когда cédula указывает услугу.",
        "Если cédula актуальна, любой человек с лицензией нужной категории может управлять этим транспортным средством.",
        "Если cédula просрочена, управлять может только владелец. Нельзя управлять с cédula, оформленной на другое лицо как уполномоченного.",
        "Документ личный, непередаваемый и не имеет срока действия для владельца.",
        "При продаже транспортного средства cédula владельца и cédulas уполномоченных сдаются в Registro Nacional de la Propiedad Automotor и автоматически снимаются с учета.",
        "Владелец может оформить столько cédulas для уполномоченных, сколько пожелает."
      ]
    },
    {
      id: "insurance-vtv-rva",
      kind: "list",
      titleRu: "GNC, страховка, VTV, номера и RVA",
      sourceTextEs:
        "Equipo de GNC... Comprobante del seguro obligatorio... Certificado de Verificación Técnica Vehicular obligatoria (VTV) y oblea... Placas de dominio... Registro de Verificación de Autopartes (RVA).",
      itemsRu: [
        "Если у автомобиля есть оборудование GNC, нужно иметь cédula de identificación этого оборудования и действующую обязательную oblea.",
        "Обязательная страховка защищает пострадавших в дорожных инцидентах и гарантирует возмещение за вред, причиненный третьим лицам, перевозимым или не перевозимым.",
        "Для подтверждения страховки обязательно иметь certificado del seguro de responsabilidad civil независимо от дороги, по которой движется транспорт.",
        "VTV обязательна для транспортных средств и мототранспортных средств, зарегистрированных в CABA или в другой юрисдикции и движущихся по CABA.",
        "При VTV проводится механический контроль: безопасность, загрязнение, состояние шин, тормозов, световых приборов, аварийного оборудования и документации.",
        "Первая VTV для частных автомобилей и мототранспортных средств в CABA выполняется с четвертого года от регистрации или при достижении 60 000 км, в зависимости от того, что наступит раньше, с допуском до 4 000 км.",
        "После первой VTV для частных автомобилей и мототранспортных средств срок действия остается 2 года, пока транспортному средству не исполнится 8 лет или оно не достигнет 80 000 км; если переход связан с пробегом, действует допуск 4 000 км. После этого VTV обновляется ежегодно.",
        "Результаты VTV: apto - можно ездить, выдается certificado, informe и oblea; condicional - есть легкие дефекты, нужно исправить и пройти повторную проверку в течение 60 рабочих дней; rechazado - есть серьезные дефекты, ездить нельзя, повторная проверка бесплатна в течение 60 рабочих дней по предварительной записи.",
        "Номерные знаки должны быть официальными, установленными в положенном месте и без изменений. У автомобиля знак спереди и сзади; у мототранспортного средства один знак сзади.",
        "RVA по Закону 3708: все автомобили, зарегистрированные в CABA, включая 0 km, должны выгравировать автозапчасти в течение 30 дней после постановки на учет. После гравировки размещается защитная oblea на лобовом стекле и выдается certificado."
      ]
    },
    {
      id: "vtv-rva-visuals",
      kind: "source-image-cards",
      titleRu: "Визуальные примеры VTV и RVA",
      sourceTextEs:
        "VTV... Registro de Verificación de Autopartes (RVA).",
      cards: [
        {
          id: "vtv-source-card",
          titleRu: "VTV и месяц по номеру",
          sourcePage: 49,
          sourceRegion: { x: 1085, y: 2000, width: 1150, height: 335 },
          assetPath: `${assetRoot}/vtv-source-as-is.jpg`,
          altRu: "Исходная схема VTV с возрастом, пробегом и месяцем по последней цифре номера.",
          visibleSpanish: true,
          sourceImageException,
          bodyRu:
            "Схема оставлена как источник: она показывает первую VTV, renovación и связь последней цифры номера с месяцем процедуры. Правила рядом изложены русским текстом."
        },
        {
          id: "rva-source-card",
          titleRu: "RVA Autopartes Grabadas",
          sourcePage: 50,
          sourceRegion: { x: 1085, y: 2190, width: 360, height: 300 },
          assetPath: `${assetRoot}/rva-source-as-is.jpg`,
          altRu: "Исходный визуальный пример RVA Autopartes Grabadas, оставленный без изменений.",
          visibleSpanish: true,
          sourceImageException,
          bodyRu:
            "Этот источник оставлен без изменений. Русское пояснение вынесено наружу: цель RVA - снизить оборот украденных автозапчастей и дать возможность проверить происхождение деталей."
        }
      ],
      visualNotes: [
        "VTV and RVA visuals are source-as-is scale-5 crops.",
        "Spanish labels remain only inside the original source images; Russian explanation is outside."
      ]
    }
  ]
};
