import type { ManualGuideSectionContent } from "../manualGuide";

export const ch3PriorityOfRulesSection: ManualGuideSectionContent = {
  id: "ch3-priority-of-rules-content",
  sectionId: "ch3-priority-of-rules",
  titleRu: "Приоритет норм",
  sourcePages: [58, 59, 60, 61, 62, 63],
  sourceTitleEs: "Prioridad normativa",
  status: "implemented",
  styleTokenFamilies: ["manual-prose", "manual-section-heading", "manual-callout-blue", "manual-legal-detail"],
  visualEvidence: {
    checkerStatus: "pass",
    sourceScreenshots: [
      "content/validation/manual-guide/ch3-priority-of-rules/page-058-priority-source-crop.jpg",
      "content/validation/manual-guide/ch3-priority-of-rules/page-059-priority-source-crop.jpg",
      "content/validation/manual-guide/ch3-priority-of-rules/page-060-priority-source-crop.jpg",
      "content/validation/manual-guide/ch3-priority-of-rules/page-061-priority-source-crop.jpg",
      "content/validation/manual-guide/ch3-priority-of-rules/page-062-priority-source-crop.jpg",
      "content/validation/manual-guide/ch3-priority-of-rules/page-063-priority-source-crop.jpg"
    ],
    russianScreenshots: [
      "content/validation/manual-guide/ch3-priority-of-rules/ch3-priority-of-rules-desktop.png",
      "content/validation/manual-guide/ch3-priority-of-rules/ch3-priority-of-rules-mobile.png"
    ],
    notes: [
      "Source PDF page 57 is a Chapter 3 divider and is skipped as standalone runtime content.",
      "Source PDF pages 58-63 are converted as the Chapter 3 priority-of-rules section.",
      "The runtime section uses selectable Russian DOM text. Source infographics with embedded Spanish labels are retained as x5 reference evidence only; no Spanish cleanup or broad masking is performed in runtime."
    ]
  },
  blocks: [
    {
      id: "rule-priority-lead",
      kind: "lead",
      sourceTextEs:
        "Para ejercer la conducción, de forma adecuada y segura, se debe respetar y prestar atención a todas las señales de tránsito, indicaciones y marcas en la calzada.",
      textRu:
        "Чтобы вести автомобиль безопасно, водитель должен учитывать все сигналы дорожного движения, указания и разметку. Цвет и форма знаков помогают понять, как двигаться и какую ситуацию ожидать на маршруте."
    },
    {
      id: "priority-order",
      kind: "list",
      titleRu: "Порядок приоритета по Закону 2148",
      sourceTextEs:
        "La Ley 2148 establece un orden de prioridad normativo... señales u órdenes de la autoridad de control, señales transitorias, semáforos, señalización vertical y demarcación horizontal, normas legales de carácter general.",
      itemsRu: [
        "1. Сигналы и распоряжения контролирующего органа: agentes de tránsito (дорожные агенты), Policía de la Ciudad (городская полиция), уполномоченный персонал работ на дороге и железнодорожный персонал в соответствующей зоне.",
        "2. Временная сигнализация на участках работ или рядом с ними. Она действует только пока есть конкретная ситуация и имеет приоритет над обычной сигнализацией дороги.",
        "3. Светофоры: постоянный или мигающий свет, стрелки и специальные фигуры, которые передают приказы, запреты, предупреждения и регулируют движение.",
        "4. Вертикальная сигнализация и горизонтальная разметка. Они имеют одинаковый уровень приоритета между собой, поэтому соблюдать нужно каждую из них, даже если присутствует только одна.",
        "5. Общие нормы закона, которые действуют там, где нет специальной сигнализации."
      ]
    },
    {
      id: "control-authority",
      kind: "callout",
      sourceTextEs:
        "Sus indicaciones u órdenes se encuentran por encima de cualquier norma o señalización.",
      textRu:
        "Указание контролирующего органа выше любой нормы или знака. В CABA Cuerpo de Agentes de Tránsito (корпус дорожных агентов) отвечает, среди прочего, за организацию движения и контроль соблюдения действующих правил."
    },
    {
      id: "temporary-signals",
      kind: "list",
      titleRu: "Временная сигнализация",
      sourceTextEs:
        "Señales transitorias: indican la ejecución de trabajos de construcción y mantenimiento... Su color predominante es el naranja.",
      itemsRu: [
        "Указывает на строительство, обслуживание дороги или работы рядом с ней.",
        "Появляется на ограниченное время из-за конкретной ситуации и затем убирается.",
        "Имеет приоритет над обычной сигнализацией дороги.",
        "Основной цвет - оранжевый.",
        "Формы включают вертикальные щиты, ограждения и конусы. Конусы запрещают пересекать воображаемую линию, которая их соединяет."
      ]
    },
    {
      id: "horizontal-vertical-marking",
      kind: "list",
      titleRu: "Разметка и вертикальные знаки",
      sourceTextEs:
        "Demarcación horizontal... Marcas longitudinales... Marcas transversales... Marcas especiales... Señalización vertical.",
      itemsRu: [
        "Горизонтальная разметка регулирует, передает приказы, предупреждает, направляет поток или показывает запрещенные зоны.",
        "Продольные линии помогают водителю понимать свое положение на дороге, границы полос и участков проезжей части; в широком смысле они показывают, где безопасно или запрещено обгонять.",
        "Поперечные линии используются перед точками риска и перед линиями, которые нельзя пересекать без действия, связанного с правом проезда: линия остановки, пешеходный переход, велосипедный переход.",
        "Специальные марки включают стрелки, Ceda el paso (уступите дорогу), железнодорожный переезд, эксклюзивную и аварийную полосу, Pare (стоп), направляющие островки, разметку для тумана и другие специальные случаи.",
        "Окрашенные бордюры тоже относятся к специальной разметке: оранжевый - места для ciclorodados (велотранспорта) и motovehículos (мототранспорта); желтый - запрет стоянки 24 часа."
      ]
    },
    {
      id: "general-legal-rules",
      kind: "paragraph",
      sourceTextEs:
        "Argentina tiene una forma de gobierno federal... En CABA rige la Ley 2148.",
      textRu:
        "Если конкретной сигнализации нет, действуют общие нормы. Из-за федеративного устройства Аргентины существуют национальные и провинциальные правила; в CABA применяется Закон 2148, и действия на дороге должны соответствовать именно ему."
    },
    {
      id: "emergency-vehicles",
      kind: "list",
      titleRu: "Приоритет транспортных средств экстренных служб",
      sourceTextEs:
        "Si se aproxima un vehículo de emergencia... con las señales lumínicas/sonoras encendidas... el resto debe facilitarle el paso.",
      itemsRu: [
        "Полиция, пожарные, Defensa Civil (гражданская оборона) и скорая помощь имеют приоритет, когда выполняют свои функции с включенными световыми и/или звуковыми сигналами.",
        "Остальные водители должны освободить предпочтительную полосу для экстренных служб и при необходимости остановиться.",
        "Если включены только balizas (аварийные огни), транспорт находится в службе, но не обязательно в экстренном режиме. Однако при некоторых медицинских перевозках сирена может включаться кратко; когда свет включен и звуковой сигнал подается в момент необходимости, путь нужно уступить.",
        "Экстренные транспортные средства при выполнении функций освобождаются от некоторых правил, кроме распоряжений органа контроля, но их движение не должно создавать больший риск.",
        "В крайней необходимости обычный автомобиль может сообщать о подобном срочном случае balizas (аварийными огнями), прерывистой bocina (звуковым сигналом) и размахиванием платком. Приоритета проезда это дает, но правила дорожного движения для такого автомобиля не приостанавливаются."
      ]
    }
  ]
};
