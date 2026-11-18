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

/** Полная структура данных конфигурации tzHero.json для досье и видоискателя */
export interface TzHeroDataset {
  /** Служебное название темы проекта */
  brandTitle: string;
  /** Начальный таймкод индикатора ● REC */
  recTimecode: string;
  /** Главный акцентный заголовок персонажа (ВЯЗЕЛЬ) */
  primaryWord: string;
  /** Вторичный приглушённый подзаголовок под основным именем (CROWNVETCH) */
  secondaryWord: string;
  /** Краткая строка роли/метаданных досье */
  roleMeta: string;
  /** Временная метка кадра под метаданными */
  timecodeTag: string;
  /** Заголовок блока описания */
  dossierHeading: string;
  /** Базовый текст-описание персонажа в левой колонке */
  dossierBody: string;
  /** Финальная цитата внизу блока описания */
  dossierQuote: string;
  /** Пункты навигации в верхней шапке видоискателя */
  navTabs: HeroNavTab[];
}
