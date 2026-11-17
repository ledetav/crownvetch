/**
 * Типы данных для JSON-хранилища проекта crownvetch (PARADOX // DARKROOM).
 * Описывают структуру палитры, реестра подключаемых модулей-заданий,
 * графа сцен визуальной новеллы и конфигурации стартового экрана видоискателя.
 */

/** Описание одного цветового токена палитры проекта */
export interface PaletteSwatch {
  /** Уникальный идентификатор цвета (используется как ключ и CSS-ссылка) */
  id: string;
  /** Человекочитаемое название оттенка */
  name: string;
  /** HEX-код цвета с решёткой (например, #0A0F12) */
  hex: string;
  /** Назначение цвета в интерфейсе или артах */
  role: string;
}

/** Структура JSON-файла с цветовой палитрой */
export interface PaletteDataset {
  /** Название концепта или темы оформления */
  themeTitle: string;
  /** Список цветовых образцов */
  swatches: PaletteSwatch[];
}

/** Статус готовности подключаемого модуля-задания */
export type ModuleStatus = 'planned' | 'in_progress' | 'ready';

/** Описание одного подключаемого модуля (задания или механики квеста) */
export interface QuestModuleItem {
  /** Уникальный идентификатор модуля */
  id: string;
  /** Название модуля или задания */
  title: string;
  /** Краткое описание механики или назначения */
  summary: string;
  /** Текущий статус разработки модуля */
  status: ModuleStatus;
  /** Флаг активности: подключён ли модуль в текущую сборку */
  enabled: boolean;
  /** Связанный идентификатор стартовой сцены в quest.json (если есть) */
  entrySceneId?: string;
}

/** Структура JSON-файла со списком подключаемых модулей */
export interface ModulesDataset {
  /** Список модулей-заданий, которыми управляет конфиг */
  modules: QuestModuleItem[];
}

/** Вариант выбора игрока в диалоге или текстовом квесте */
export interface QuestChoice {
  /** Текст кнопки выбора */
  label: string;
  /** Идентификатор следующей сцены при выборе этого варианта */
  nextSceneId: string;
}

/** Отдельная сцена или реплика визуальной новеллы / текстового квеста */
export interface QuestScene {
  /** Уникальный идентификатор сцены */
  id: string;
  /** Заголовок эпизода или локации */
  chapter: string;
  /** Имя говорящего персонажа (или «Нарратор» / «Система») */
  speaker: string;
  /** Текст реплики или описания сцены */
  text: string;
  /** Список доступных вариантов действия */
  choices: QuestChoice[];
}

/** Структура JSON-файла со сценарием визуальной новеллы и квеста */
export interface QuestDataset {
  /** Рабочее название новеллы */
  projectTitle: string;
  /** Идентификатор стартовой сцены */
  startSceneId: string;
  /** Словарь сцен, индексированный по id сцены */
  scenes: Record<string, QuestScene>;
}

/** Тип визуального сюжета заглушки полароида на орбите вихря */
export type PolaroidArtworkKind =
  | 'darkroom-monitor'
  | 'silhouette-hand'
  | 'antique-clock'
  | 'sunset-figure'
  | 'dark-dial'
  | 'hourglass'
  | 'pocket-watch';

/** Отдельный снимок-полароид, вращающийся вокруг центрального портала */
export interface HeroPolaroidCard {
  /** Уникальный идентификатор карточки */
  id: string;
  /** Подпись кадра для alt и всплывающей подсказки */
  caption: string;
  /** Тип встроенной векторной иллюстрации (используется, если не задан imageUrl) */
  artworkKind: PolaroidArtworkKind;
  /** Опциональный путь к кастомному арту (например, '/assets/frame-01.png') */
  imageUrl?: string;
  /** Угол расположения карточки на орбите в градусах (0..360) */
  angleDeg: number;
  /** Собственный наклон рамки полароида в градусах */
  tiltDeg: number;
}

/** Пункт верхнего меню видоискателя */
export interface HeroNavTab {
  /** Идентификатор таба */
  id: string;
  /** Отображаемая метка в шапке (например, ARCHIVE, DIVE IN) */
  label: string;
  /** Целевой якорь секции на странице ТЗ или маршрут */
  target: string;
  /** Выделять ли пункт жёлтой рамкой как активный по умолчанию */
  highlighted?: boolean;
}

/** Конфигурация стартового экрана видоискателя (src/data/tzHero.json) */
export interface TzHeroDataset {
  /** Логотип-заголовок в левом верхнем углу */
  brandTitle: string;
  /** Начальный таймкод индикатора REC */
  recTimecode: string;
  /** Верхний слоган над OVERTHINK */
  topQuote: string;
  /** Нижний слоган под OVERTHINK / VORTEX */
  bottomQuote: string;
  /** Основное крупное слово композиции */
  primaryWord: string;
  /** Вертикальное слово композиции */
  verticalWord: string;
  /** Горизонтальное пересекающее слово композиции */
  crossWord: string;
  /** Пункты навигации в правом верхнем углу */
  navTabs: HeroNavTab[];
  /** Данные правой телеметрической панели */
  telemetry: {
    /** Верхний таймкод справа */
    topTimecode: string;
    /** Зачёркнутый глитч-таймкод */
    struckTimecode: string;
    /** Подпись под зачёркнутым таймкодом */
    channelLabel: string;
    /** Зачёркнутый числовой код */
    struckSerial: string;
    /** Фрагмент глитч-текста справа */
    glitchExcerpt: string[];
    /** Отрицательный таймкод над превью-кадром */
    negativeTimecode: string;
    /** Нижний повреждённый таймкод */
    corruptedFooterCode: string;
  };
  /** Список полароидов на вращающейся орбите */
  polaroids: HeroPolaroidCard[];
}
