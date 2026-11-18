/**
 * TypeScript-интерфейсы и схемы данных для проекта crownvetch.
 * Описывают конфигурацию первого экрана (tzHero.json), навигацию,
 * палитру и параметры вращения полароидов.
 */

/** Пункт меню в верхнем правом углу видоискателя */
export interface HeroNavTab {
  id: string;
  label: string;
  target: string;
  highlighted?: boolean;
}

/** Возможные типы иллюстраций/контента внутри полароида */
export type PolaroidArtworkKind =
  | 'darkroom-monitor'
  | 'silhouette-hand'
  | 'antique-clock'
  | 'sunset-figure'
  | 'dark-dial'
  | 'hourglass'
  | 'pocket-watch';

/** Сущность полароида на орбите спирального портала */
export interface HeroPolaroidCard {
  id: string;
  caption: string;
  artworkKind: PolaroidArtworkKind;
  angleDeg: number;
  tiltDeg: number;
}

/** Элемент палитры цветов из src/data/palette.json */
export interface PaletteSwatch {
  id: string;
  name: string;
  hex: string;
  role: string;
}

/** Полная структура данных конфигурации tzHero.json */
export interface TzHeroDataset {
  brandTitle: string;
  recTimecode: string;
  topQuote: string;
  bottomQuote: string;
  primaryWord: string;
  verticalWord: string;
  crossWord: string;
  navTabs: HeroNavTab[];
  polaroids: HeroPolaroidCard[];
}
