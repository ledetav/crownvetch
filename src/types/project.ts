/**
 * TypeScript-интерфейсы и схемы данных для проекта crownvetch.
 * Описывают конфигурацию первого экрана (tzHero.json), навигацию,
 * телеметрию и параметры вращения полароидов.
 */

/** Пункт меню в верхнем правом углу видоискателя */
export interface HeroNavTab {
  id: string;
  label: string;
  target: string;
  highlighted?: boolean;
}

/** Параметры телеметрической панели */
export interface HeroTelemetryData {
  negativeTimecode: string;
}

/** Сущность полароида на орбите спирального портала */
export interface PolaroidItem {
  id: string;
  caption: string;
  artworkKind: string;
  angleDeg: number;
  tiltDeg: number;
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
  telemetry: HeroTelemetryData;
  polaroids: PolaroidItem[];
}
