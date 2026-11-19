/**
 * Сервис доступа к JSON-данным проекта.
 * Предоставляет типизированные методы загрузки конфигурации главного экрана.
 */
import tzBlogData from '../data/tzBlog.json';
import tzHeroData from '../data/tzHero.json';
import tzOwnerData from '../data/tzOwner.json';
import type { TzBlogDataset, TzHeroDataset, TzOwnerDataset } from '../types/project';

/**
 * Возвращает типизированный объект конфигурации первого экрана.
 * @returns Набор данных из tzHero.json.
 */
export function getTzHeroDataset(): TzHeroDataset {
  return tzHeroData as unknown as TzHeroDataset;
}

/**
 * Возвращает типизированные данные секции «О владельце» (предпочтения, круг общения, плейлисты).
 * @returns Набор данных из tzOwner.json.
 */
export function getTzOwnerDataset(): TzOwnerDataset {
  return tzOwnerData as unknown as TzOwnerDataset;
}

/**
 * Возвращает конфигурацию отдельной страницы «О блоге» (маршрут возврата и пункты подменю).
 * @returns Набор данных из tzBlog.json.
 */
export function getTzBlogDataset(): TzBlogDataset {
  return tzBlogData as unknown as TzBlogDataset;
}

