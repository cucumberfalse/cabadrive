import type { ManualGuideSectionContent } from "../manualGuide";

export const ch2IncidentObligationsSection: ManualGuideSectionContent = {
  id: "ch2-incident-obligations-content",
  sectionId: "ch2-incident-obligations",
  titleRu: "Обязанности в случае дорожных инцидентов",
  sourcePages: [51, 52, 53, 54, 55],
  sourceTitleEs: "Obligaciones en caso de incidentes viales",
  status: "implemented",
  styleTokenFamilies: ["manual-prose", "manual-section-heading", "manual-callout-blue", "manual-legal-detail"],
  visualEvidence: {
    checkerStatus: "pass",
    sourceScreenshots: [
      "content/validation/manual-guide/ch2-incident-obligations/page-051-incident-source-crop.jpg",
      "content/validation/manual-guide/ch2-incident-obligations/page-052-incident-source-crop.jpg",
      "content/validation/manual-guide/ch2-incident-obligations/page-053-incident-source-crop.jpg",
      "content/validation/manual-guide/ch2-incident-obligations/page-054-incident-source-crop.jpg",
      "content/validation/manual-guide/ch2-incident-obligations/page-055-ngo-source-crop.jpg"
    ],
    russianScreenshots: [
      "content/validation/manual-guide/ch2-incident-obligations/ch2-incident-obligations-desktop.png",
      "content/validation/manual-guide/ch2-incident-obligations/ch2-incident-obligations-mobile.png"
    ],
    notes: [
      "Source PDF pages 51-55 before Scoring are converted as one incident-obligations section.",
      "Source page 55 ownership ends before page-055-block-08; Scoring content is not included here.",
      "This runtime section is text-only and uses selectable Russian DOM text."
    ]
  },
  blocks: [
    {
      id: "incident-duty-core",
      kind: "lead",
      sourceTextEs:
        "Obligaciones en caso de incidentes viales. Detenerse inmediatamente... Suministrar datos... Denunciar el hecho...",
      textRu:
        "При дорожном инциденте водитель обязан остановиться сразу, безопасно обозначить место, предоставить данные и выполнить необходимые сообщения. Эти обязанности существуют независимо от того, насколько небольшим кажется ущерб."
    },
    {
      id: "incident-first-actions",
      kind: "list",
      titleRu: "Первые действия на месте",
      sourceTextEs:
        "1° Proteger. 2° Alertar. 3° Socorrer.",
      itemsRu: [
        "1-й шаг: Защитить. Остановиться, включить аварийную сигнализацию, оценить риск нового столкновения и не создавать дополнительной опасности.",
        "Поставить переносные предупреждающие устройства: на улице с односторонним движением - перед местом инцидента, по направлению движения; на улице с двусторонним движением - перед и после места инцидента. В городе расстояние составляет 30 м и 60 м, на дороге - 50 м и 100 м.",
        "В тоннеле нужно включить габаритные огни, надеть световозвращающий жилет, выйти из транспортного средства только если это безопасно, уйти за защитное ограждение и запросить механическую помощь.",
        "На автомагистралях нужно как можно быстрее убрать транспортное средство из полосы движения, не оставаться на проезжей части и использовать аварийные телефоны концессионера: AUSA 140 и AUSOL 0800-999-9999.",
        "Если есть раненые, нужно немедленно звонить в службу скорой медицинской помощи 107, а затем в 911, который централизует экстренные вызовы.",
        "2-й шаг: Сообщить. Передать данные о месте, количестве пострадавших, типе инцидента и других обстоятельствах, которые помогут службам.",
        "3-й шаг: Помочь. Пока ожидается помощь, оценить, можно ли помогать пострадавшим без ухудшения их состояния."
      ]
    },
    {
      id: "injured-person-care",
      kind: "list",
      titleRu: "Если есть пострадавшие",
      sourceTextEs:
        "No mover a la víctima... Si tiene casco no retirarlo... Si está inconsciente y se conocen técnicas de reanimación...",
      itemsRu: [
        "Не перемещать пострадавшего, чтобы не усилить скрытые травмы, кроме случая риска наезда.",
        "Если в тело вонзен предмет, не вынимать его, чтобы не вызвать кровотечение.",
        "Если на человеке шлем, не снимать его, кроме случаев рвоты или удушья.",
        "Если человек в сознании, успокоить его и просить не двигаться.",
        "Спросить о боли, потере чувствительности или трудности движения конечности.",
        "Если человек без сознания, техники реанимации известны и есть разрешение их выполнять, можно действовать. Иначе ждать вызванную экстренную помощь."
      ]
    },
    {
      id: "data-to-collect",
      kind: "list",
      titleRu: "Какие данные собрать",
      sourceTextEs:
        "Datos a recabar en el lugar del siniestro. De los vehículos involucrados... Del conductor... De testigos... Del siniestro...",
      itemsRu: [
        "По транспортным средствам: номер, марка, модель, цвет, страховая компания, номер полиса и имя владельца.",
        "По водителю: имя, DNI, адрес, телефон и водительское удостоверение.",
        "По застрахованному лицу, если это не водитель на момент инцидента: имя, DNI, адрес и телефон.",
        "По свидетелям: имя, DNI, адрес и телефон; эти данные могут быть важны в судебном процессе.",
        "По пострадавшим: имя, DNI, адрес и телефон.",
        "По инциденту: дата, время, место, улица или проспект, автомагистраль, пересечение, направление движения, примерная кадастровая нумерация, состояние проезжей части, погода и другие обстоятельства.",
        "Фотографии: по возможности сделать общие снимки места, детали повреждений транспортных средств и следы торможения."
      ]
    },
    {
      id: "follow-up-duties",
      kind: "list",
      titleRu: "Если данные нельзя собрать сразу",
      sourceTextEs:
        "Si no fuera posible recabar información... Si se colisiona contra un vehículo estacionado... procedimiento judicial...",
      itemsRu: [
        "Если невозможно собрать информацию на месте, ее можно получить в полицейском участке, прокуратуре или суде, который ведет дело.",
        "Если произошло столкновение с припаркованным транспортным средством и владелец неизвестен, нужно оставить личные данные, данные транспортного средства, лицензии и обязательной страховки в безопасном и хорошо закрепленном месте.",
        "Если по инциденту есть судебная процедура, при вызове в качестве свидетеля нужно явиться в соответствующую прокуратуру или суд.",
        "Важно рассказать судье или прокурору все, что известно и помнится, чтобы обстоятельства были выяснены."
      ]
    },
    {
      id: "legal-psychological-support",
      kind: "paragraph",
      sourceTextEs:
        "Asesoramiento jurídico y atención psicológica... seleccionar con calma el asesoramiento legal...",
      textRu:
        "После дорожного инцидента рекомендуется спокойно выбирать юридическую консультацию по компенсациям и возмещению вреда, не принимая поспешные предложения специалистов без предварительных рекомендаций. Для юридической консультации и/или бесплатной психологической помощи руководство приводит публичные органы и организации."
    },
    {
      id: "public-organizations",
      kind: "list",
      titleRu: "Публичные органы и службы",
      sourceTextEs:
        "Organismos Públicos Nacionales y de la Ciudad Autónoma de Buenos Aires...",
      itemsRu: [
        "Centro de Atención a la víctima y familiares de víctimas de siniestros viales, Agencia Nacional de Seguridad Vial, Ministerio de Transporte de la Nación. Тел.: 149, опция 2. www.argentina.gob.ar/seguridadvial/redfederal",
        "Unidades de Orientación y Denuncia, Ministerio Público Fiscal de CABA. Сопровождение по уголовным делам в CABA. Тел.: 6089-9114/9135 / Pte. Perón 671 / mpf.gob.ar/dovic",
        "Oficina de Asistencia a la Víctima y Testigo (OFAVYT), Ministerio Público Fiscal de CABA. Помощь людям после физического или эмоционального насилия. Тел.: 4014-1984 / Beruti Nº 3345, 3-й этаж, CABA / mpfciudad.gob.ar",
        "Centros de Acceso a la Justicia (CAJ), Ministerio de Justicia y DDHH de la Nación. Юридическая консультация и/или психологическая помощь. Тел.: 0800-222-3425 / argentina.gob.ar/justicia/afianzar/caj",
        "Centro de Formación Profesional, Palacio de Justicia de la Nación. Консультация и представительство пострадавших; дела о daños y perjuicios (возмещении вреда и убытков) не принимаются. Тел.: 4372861/7679 / Talcahuano 550, 8-й этаж / www.argentina.gob.ar/justicia"
      ]
    },
    {
      id: "ngo-organizations",
      kind: "list",
      titleRu: "Негосударственные организации",
      sourceTextEs:
        "Organismos No Gubernamentales...",
      itemsRu: [
        "A.C.T.I.V.V.A.S. / контакт: Ema Cibotti-Lischinsky / тел.: 1558125022 / emacibotti@activvas.org / activvas.org",
        "Asociación Civil Carla Arduini / контакт: Norma Bonelli / тел.: 1160565111 и 3971-5437 / asociacioncarlaarduini@gmail.com",
        "Asociación Civil Madres del Dolor / контакт: Viviam Perrone / тел.: 39684082, 35357569 и 08002229832 (AYUDA) / kevinsedano@yahoo.com.ar / madresdeldolor.org.ar",
        "Asociación Civil Red Nacional Familiares de Víctimas de Tránsito / контакты: Teresa Mellano и Patricia Pistarini / тел.: 1540832359 и 43013542 / transitoporlavida@yahoo.com.ar",
        "Asociación Civil Familias por la Vida / контакт: Cinthya Toledo / тел.: 08009992769 и 1132364063 / ongfamiliasporlavida@hotmail.com / Facebook-страница Familias Por La Vida ONG."
      ]
    },
    {
      id: "scoring-boundary-note",
      kind: "callout",
      sourceTextEs:
        "El Sistema de Evaluación Permanente de Conductores o Scoring...",
      textRu:
        "Граница темы: на странице 55 после списка НКО начинается отдельный раздел Scoring. Он вынесен в следующую страницу сайта `Система баллов Scoring`, чтобы не смешивать обязанности после инцидента с системой баллов."
    }
  ]
};
