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
  id: 'annotation' | 'readiness';
  /** Якорь адресной строки (#annotation | #readiness) */
  anchor: string;
  /** Подпись вкладки */
  label: string;
}

/** Возможные статусы выполнения отдельной работы в таблице готовности */
export type BlogWorkStatus = 'done' | 'in_progress' | 'planned';

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
  /** Список работ раздела */
  works: BlogReadinessWorkItem[];
}

/** Полная конфигурация раздела «О блоге → Общая информация» из tzBlogOverview.json */
export interface TzBlogOverviewDataset {
  /** Главный акцентный заголовок страницы */
  primaryWord: string;
  /** Вторичный приглушённый подзаголовок */
  secondaryWord: string;
  /** Внутренние вкладки (Аннотация / Таблица готовности) */
  microTabs: BlogOverviewMicroTab[];
  /** Дословный текст аннотации блога без внутреннего заголовка */
  annotationBody: string;
  /** Заголовок секции таблицы готовности */
  readinessHeading: string;
  /** Краткое пояснение к таблице готовности */
  readinessNote: string;
  /** Разделы готовности (Общее, Шапка, Акт I–IV) со списком работ и дедлайнами из JSON */
  readinessSections: BlogReadinessSection[];
}



