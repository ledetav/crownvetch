/**
 * Модуль доступа к JSON-хранилищу проекта crownvetch.
 * Инкапсулирует импорт статических JSON-файлов и предоставляет
 * типизированные функции выборки палитры, модулей, сценария квеста
 * и конфигурации стартового экрана видоискателя.
 */
import paletteRaw from '../data/palette.json';
import modulesRaw from '../data/modules.json';
import questRaw from '../data/quest.json';
import tzHeroRaw from '../data/tzHero.json';
import type {
  ModulesDataset,
  PaletteDataset,
  QuestDataset,
  QuestModuleItem,
  TzHeroDataset,
} from '../types/project';

/**
 * Возвращает типизированный набор цветовой палитры проекта.
 * @returns Объект с названием темы и массивом цветовых образцов.
 */
export function getPaletteDataset(): PaletteDataset {
  return paletteRaw as PaletteDataset;
}

/**
 * Возвращает полный список модулей-заданий из JSON-конфига.
 * @returns Массив описаний всех зарегистрированных модулей.
 */
export function getAllModules(): QuestModuleItem[] {
  const dataset = modulesRaw as ModulesDataset;
  return dataset.modules;
}

/**
 * Возвращает только те модули-задания, которые помечены как активные (enabled: true).
 * @returns Отфильтрованный массив активных модулей.
 */
export function getEnabledModules(): QuestModuleItem[] {
  return getAllModules().filter((item) => item.enabled);
}

/**
 * Возвращает типизированный датасет сценария визуальной новеллы и квеста.
 * @returns Объект сценария со стартовой сценой и словарём узлов.
 */
export function getQuestDataset(): QuestDataset {
  return questRaw as QuestDataset;
}

/**
 * Возвращает конфигурацию стартового экрана ТЗ (PARADOX // DARKROOM).
 * @returns Типизированный объект с цитатами, таймкодами, меню и полароидами.
 */
export function getTzHeroDataset(): TzHeroDataset {
  return tzHeroRaw as TzHeroDataset;
}
