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
