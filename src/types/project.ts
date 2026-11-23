/**
 * TypeScript-интерфейсы и схемы данных для проекта crownvetch.
 * Описывают конфигурацию главного экрана видоискателя (tzHero.json),
 * навигацию и палитру проекта.
 */

/** Пункт меню в верхнем правом углу видоискателя */
export interface HeroNavTab {
  /** Уникальный идентификатор раздела */
  id: string;
  /** Отображаемая подпись пункта меню */
  label: string;
  /** Якорный или маршрутный адрес перехода */
  target: string;
  /** Подсветка пункта меню по умолчанию */
  highlighted?: boolean;
}

/** Элемент палитры цветов из src/data/palette.json */
export interface PaletteSwatch {
  /** Идентификатор цветового токена */
  id: string;
  /** Название оттенка */
  name: string;
  /** Шестнадцатеричный код цвета */
  hex: string;
  /** Роль цвета в интерфейсе */
  role: string;
}

/** Ссылка на внешний ресурс персонажа в правой вертикальной менюшке */
export interface ExternalResourceLink {
  /** Уникальный идентификатор ссылки */
  id: string;
  /** Порядковый индекс пункта ([01], [02], [03]) */
  indexLabel: string;
  /** Подпись кнопки внешнего ресурса */
  label: string;
  /** Целевой URL внешнего ресурса (пустая строка на этапе заглушки) */
  url: string;
  /** Цветовой акцент пункта меню в палитре фотолаборатории */
  accent: 'cyan' | 'amber' | 'red';
}

/** Стилистический пресет контурной обводки и тени для конкретной иллюстрации персонажа */
export type CharacterArtworkStylePreset =
  | 'classic-cyan-amber'
  | 'frost-vignette'
  | 'crimson-grin'
  | 'robin-flight'
  | 'golden-embrace'
  | 'snow-prowl'
  | 'ember-profile'
  | 'fullbody-stride'
  | 'salmon-catch';

/** Элемент коллекции иллюстраций персонажа со своей обводкой и тенью */
export interface CharacterArtworkItem {
  /** Уникальный идентификатор иллюстрации */
  id: string;
  /** Локальный путь к оригинальному PNG-файлу */
  src: string;
  /** Имя файла при скачивании оригинала */
  downloadName: string;
  /** Описание иллюстрации для атрибута alt */
  alt: string;
  /** Стилистический пресет обводки и тени */
  stylePreset: CharacterArtworkStylePreset;
}

/** Полная структура данных конфигурации tzHero.json для досье и видоискателя */
export interface TzHeroDataset {
  /** Служебное название темы проекта */
  brandTitle: string;
  /** Начальный таймкод индикатора ● REC */
  recTimecode: string;
  /** Главный акцентный заголовок персонажа (ВЯЗЕЛЬ) */
  primaryWord: string;
  /** Вторичный приглушённый подзаголовок под основным именем (ЛИН ВЭЙ В БЛОГЕ) */
  secondaryWord: string;
  /** Заголовок блока описания */
  dossierHeading: string;
  /** Основной текст-описание персонажа в левой колонке */
  dossierBody: string;
  /** Локальный путь к основному арту персонажа с прозрачным фоном */
  characterArtworkSrc: string;
  /** Полная галерея сменяемых иллюстраций персонажа с индивидуальными стилями обводки и тени */
  characterArtworks: CharacterArtworkItem[];
  /** Пункты навигации в верхней шапке видоискателя */
  navTabs: HeroNavTab[];
  /** Пункты правого вертикального меню внешних ресурсов */
  externalLinks: ExternalResourceLink[];
}

/** Отдельная запись контакта в таблице «Круг общения» */
export interface OwnerContactItem {
  /** Уникальный идентификатор записи */
  id: string;
  /** Копируемый числовой/строковый ID пользователя (при наличии) */
  copyId?: string;
  /** Тип внешней площадки для подписи и фильтрации */
  platform: 'vk' | 'tg';
  /** Короткое отображаемое имя или дескриптор профиля */
  handle: string;
  /** Полный URL профиля в ВК или Telegram */
  url: string;
}

/** Логическая группа контактов с заголовком и авторским комментарием */
export interface OwnerContactGroup {
  /** Уникальный идентификатор группы */
  id: string;
  /** Название группы контактов */
  title: string;
  /** Дословный комментарий автора к группе (при наличии) */
  comment?: string;
  /** Список контактов группы */
  contacts: OwnerContactItem[];
}

/** Полная конфигурация данных секции «О владельце» из tzOwner.json */
export interface TzOwnerDataset {
  /** Главный акцентный заголовок секции */
  primaryWord: string;
  /** Приглушённый подзаголовок секции */
  secondaryWord: string;
  /** Микрокнопка внешней ссылки рядом с подзаголовком (например, VK) */
  subtitleLink?: {
    /** Короткая подпись на кнопке */
    label: string;
    /** Целевой URL ссылки */
    url: string;
  };
  /** Заголовок блока предпочтений */
  preferencesHeading: string;
  /** Дословный авторский текст о предпочтениях */
  preferencesBody: string;
  /** Заголовок блока дополнительной информации */
  extraHeading: string;
  /** Дословный текст блока «Дополнительно» об атрибутике персонажа и контактах для вопросов */
  extraBody: string;
  /** Заголовок блока плейлистов */
  playlistsHeading: string;
  /** Ссылки на плейлисты владельца в стиле правого меню персонажа */
  playlists: ExternalResourceLink[];
  /** Заголовок таблицы круга общения */
  socialCircleHeading: string;
  /** Сгруппированные списки контактов круга общения */
  contactGroups: OwnerContactGroup[];
  /** Заключительный авторский комментарий под таблицей */
  closingComment: string;
}

/** Конфигурация навигации и кнопки возврата отдельной страницы «О блоге» из tzBlog.json */
export interface TzBlogDataset {
  /** Маршрут возврата при нажатии кнопки стрелки назад */
  backTarget: string;
  /** Текст доступного описания и всплывающей подсказки кнопки возврата */
  backAriaLabel: string;
  /** Список пунктов верхнего меню раздела «О блоге» */
  navTabs: HeroNavTab[];
}

/** Внутренняя вкладка на странице «Общая информация» */
export interface BlogOverviewMicroTab {
  /** Уникальный идентификатор вкладки */
  id: 'annotation' | 'guide' | 'readiness';
  /** Якорь адресной строки (#annotation | #guide | #readiness) */
  anchor: string;
  /** Подпись вкладки */
  label: string;
}

/** Идентификаторы подразделов вкладки «Памятка по работе» */
export type BlogWorkGuideSectionId = 'sprites' | 'backgrounds' | 'cutscenes';

/** Изображение-референс внутри подраздела памятки по работе */
export interface BlogWorkGuideReference {
  /** Уникальный идентификатор референса */
  id: string;
  /** Локальный путь к изображению в public/assets/... */
  src: string;
  /** Описание изображения для атрибута alt и подписи */
  caption: string;
}

/** Отдельный подраздел памятки по работе (О спрайтах, О фонах, О катсценах) */
export interface BlogWorkGuideSection {
  /** Системный идентификатор подраздела */
  id: BlogWorkGuideSectionId;
  /** Подпись пункта внутреннего меню */
  label: string;
  /** Заголовок активного блока памятки */
  heading: string;
  /** Основные правила и требования подраздела (маркированный список) */
  points: string[];
  /** Дополнительное примечание к подразделу */
  note?: string;
  /** Подборка визуальных референсов (при наличии) */
  references?: BlogWorkGuideReference[];
  /** Необязательная внутренняя ссылка на связанный раздел ТЗ */
  relatedLink?: {
    /** Подпись ссылки */
    label: string;
    /** Целевой маршрут приложения */
    target: string;
  };
}

/** Конфигурация вкладки «Памятка по работе» (#guide) */
export interface BlogWorkGuideData {
  /** Заголовок секции памятки */
  heading: string;
  /** Краткое пояснение к памятке */
  lead: string;
  /** Подразделы памятки (О спрайтах, О фонах, О катсценах) */
  sections: BlogWorkGuideSection[];
}

/** Возможные статусы выполнения отдельной работы в таблице готовности */
export type BlogWorkStatus = 'done' | 'in_progress' | 'planned';

/** Категория (тег) отдельной работы в таблице готовности */
export type BlogWorkTag = 'art' | 'text' | 'dialogue' | 'design' | 'code' | 'other';

/** Идентификаторы внутренних разделов таблицы готовности блога */
export type BlogReadinessSectionId =
  | 'general'
  | 'header'
  | 'act-1'
  | 'act-2'
  | 'act-3'
  | 'act-4';

/** Отдельная строка работы внутри выбранного раздела таблицы готовности */
export interface BlogReadinessWorkItem {
  /** Уникальный идентификатор работы */
  id: string;
  /** Ссылка на соответствующее ТЗ (внутренний маршрут /tz/... или внешний URL) */
  tzUrl?: string;
  /** Название работы */
  title: string;
  /** Тег типа работы (Арты, Тексты, Реплики, Оформление, Код, Другое) */
  tag: BlogWorkTag;
  /** Текущий статус (Готово / В процессе / В планах) */
  status: BlogWorkStatus;
  /** Имя или список исполнителей (пустая строка означает «не взято») */
  assignee: string;
  /** Ссылка на готовую работу (внутренний маршрут или внешний URL, если работа готова) */
  resultUrl?: string;
}

/** Раздел таблицы готовности (Общее, Шапка, Акты I–IV) со своим дедлайном и работами */
export interface BlogReadinessSection {
  /** Системный идентификатор раздела */
  id: BlogReadinessSectionId;
  /** Подпись пункта во внутреннем меню над таблицей */
  label: string;
  /** Крайний срок сдачи раздела в формате YYYY-MM-DD (пустая строка, если не задан) */
  deadlineDate: string;
  /** Если true, вместо таблицы работ отображается плашка «СКОРО» */
  comingSoon?: boolean;
  /** Список работ раздела */
  works: BlogReadinessWorkItem[];
}

/** Полная конфигурация раздела «О блоге → Общая информация» из tzBlogOverview.json */
export interface TzBlogOverviewDataset {
  /** Главный акцентный заголовок страницы */
  primaryWord: string;
  /** Вторичный приглушённый подзаголовок */
  secondaryWord: string;
  /** Целевая дата дня рождения в формате YYYY-MM-DD для общей сводки наверху страницы */
  birthdayDate: string;
  /** Внутренние вкладки (Аннотация / Памятка по работе / Таблица готовности) */
  microTabs: BlogOverviewMicroTab[];
  /** Дословный текст аннотации блога без внутреннего заголовка */
  annotationBody: string;
  /** Данные вкладки «Памятка по работе» (О спрайтах, О фонах, О катсценах) */
  workGuide: BlogWorkGuideData;
  /** Заголовок секции таблицы готовности */
  readinessHeading: string;
  /** Краткое пояснение к таблице готовности */
  readinessNote: string;
  /** Разделы готовности (Общее, Шапка, Акт I–IV) со списком работ и дедлайнами из JSON */
  readinessSections: BlogReadinessSection[];
}

/** Идентификаторы четырёх актов в разделе «О блоге → Акты» */
export type BlogActId = 'act-1' | 'act-2' | 'act-3' | 'act-4';

/** Формат игровой сцены в сценарии акта */
export type BlogActSceneMode = 'text_quest' | 'visual_novel';

/** Тип структурированного поля внутри раскрытой карточки сцены */
export type BlogActSceneBlockKind = 'visual' | 'narrative' | 'sprites';

/** Отдельный блок внутри развёрнутого описания сцены (Катсцена/Фон, Текстовый блок/Мысли, Спрайты) */
export interface BlogActSceneBlock {
  /** Визуальный и смысловой тип поля */
  kind: BlogActSceneBlockKind;
  /** Заголовок поля («Катсцена», «Фон», «Текстовый блок», «Мысли», «Спрайты») */
  label: string;
  /** Основное текстовое описание */
  text: string;
}

/** Полное описание одной сцены сценария в блоке-развороте */
export interface BlogActScene {
  /** Уникальный идентификатор сцены (используется для управления раскрытием и якорей) */
  id: string;
  /** Название сцены строго в формате «Сцена Номер» (например, «Сцена 1», «Сцена 8.1») */
  title: string;
  /** Игровой формат сцены («Текстовый блок» или «Визуальная новелла») */
  mode: BlogActSceneMode;
  /** Упорядоченный список полей сцены: Катсцена/Фон, Текстовый блок/Мысли, Спрайты (для ВН) */
  blocks: BlogActSceneBlock[];
}

/** Отдельный нераскрывающийся мостик-действие между сценами схемы */
export interface BlogActActionBridge {
  /** Уникальный идентификатор мостика-действия */
  id: string;
  /** Название действия (например, «Действие: протереть пол») */
  label: string;
  /** Необязательное пояснение эффекта действия на фон, спрайты или предметы */
  description?: string;
}

/** Колонка параллельной ветки схемы (сцена осмотра + закрывающее действие под ней) */
export interface BlogActBranchColumn {
  /** Сцена внутри ветки (например, Сцена 8.1 или Сцена 8.2) */
  scene: BlogActScene;
  /** Необязательный мостик-действие под сценой перед схождением к следующей сцене */
  afterAction?: BlogActActionBridge;
}

/** Узел сценарной схемы-цепочки акта: сцена, мостик-действие или параллельное ветвление */
export type BlogActFlowNode =
  | {
      /** Обычная последовательная сцена-разворот */
      kind: 'scene';
      /** Уникальный идентификатор узла */
      id: string;
      /** Данные сцены */
      scene: BlogActScene;
    }
  | {
      /** Нераскрывающийся блок-мостик с действием между сценами */
      kind: 'action';
      /** Уникальный идентификатор узла действия */
      id: string;
      /** Данные мостика-действия */
      action: BlogActActionBridge;
    }
  | {
      /** Параллельное ветвление из двух сцен (8.1 / 8.2), сходящееся стрелками к следующей сцене */
      kind: 'branch';
      /** Уникальный идентификатор узла ветвления */
      id: string;
      /** Параллельные колонки ветвления */
      columns: BlogActBranchColumn[];
    };

/** Описание отдельного акта во внутреннем меню раздела «Акты» */
export interface BlogActItem {
  /** Системный идентификатор акта */
  id: BlogActId;
  /** Якорь адресной строки (#act-1 .. #act-4) */
  anchor: string;
  /** Короткая подпись во внутреннем меню (Акт I .. Акт IV) */
  label: string;
  /** Полный заголовок панели акта */
  heading: string;
  /** Если true, содержимое акта отображается плашкой «СКОРО» */
  comingSoon?: boolean;
  /** Краткое пояснение или заглушка до наполнения сцен ТЗ */
  summary: string;
  /** Сценарная цепочка-схема акта из блоков-разворотов (если уже расписана) */
  flow?: BlogActFlowNode[];
}

/** Общее примечание редакции сценария, отображаемое под меню актов на всех актах */
export interface BlogActEditorialNote {
  /** Короткий заголовок-метка примечания */
  label: string;
  /** Текст примечания для сценаристов и участников */
  text: string;
}

/** Полная конфигурация раздела «О блоге → Акты» из tzBlogActs.json */
export interface TzBlogActsDataset {
  /** Главный акцентный заголовок страницы */
  primaryWord: string;
  /** Вторичный приглушённый подзаголовок */
  secondaryWord: string;
  /** Общее примечание о свободе правки/расширения текста внутри блоков (видно на всех актах) */
  editorialNote: BlogActEditorialNote;
  /** Список всех четырёх актов для внутреннего меню */
  acts: BlogActItem[];
}





