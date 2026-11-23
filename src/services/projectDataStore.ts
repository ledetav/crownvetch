/**
 * Сервис доступа к JSON-данным проекта.
 * Предоставляет типизированные методы загрузки конфигурации главного экрана.
 */
import tzBlogActsData from '../data/tzBlogActs.json';
import tzBlogCharactersData from '../data/tzBlogCharacters.json';
import tzBlogData from '../data/tzBlog.json';
import tzBlogHeaderData from '../data/tzBlogHeader.json';
import tzBlogOverviewData from '../data/tzBlogOverview.json';
import tzHeroData from '../data/tzHero.json';
import tzOwnerData from '../data/tzOwner.json';
import type {
  TzBlogActsDataset,
  TzBlogCharactersDataset,
  TzBlogDataset,
  TzBlogHeaderDataset,
  TzBlogOverviewDataset,
  TzHeroDataset,
  TzOwnerDataset,
} from '../types/project';

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

/**
 * Возвращает данные вкладки «Общая информация» раздела «О блоге»
 * (внутренние вкладки, аннотация, памятка по работе и таблица готовности).
 * @returns Набор данных из tzBlogOverview.json.
 */
export function getTzBlogOverviewDataset(): TzBlogOverviewDataset {
  return tzBlogOverviewData as unknown as TzBlogOverviewDataset;
}

/**
 * Возвращает конфигурацию вкладки «Акты» раздела «О блоге»
 * (заголовок и список всех четырёх актов для внутреннего меню).
 * @returns Набор данных из tzBlogActs.json.
 */
export function getTzBlogActsDataset(): TzBlogActsDataset {
  return tzBlogActsData as unknown as TzBlogActsDataset;
}

/**
 * Возвращает конфигурацию вкладки «Шапка» раздела «О блоге»
 * (текстовое описание со ссылками на персонажей и данные композиционного скетча).
 * @returns Набор данных из tzBlogHeader.json.
 */
export function getTzBlogHeaderDataset(): TzBlogHeaderDataset {
  return tzBlogHeaderData as unknown as TzBlogHeaderDataset;
}

/**
 * Возвращает конфигурацию вкладки «Персонажи» раздела «О блоге»
 * (список из четырёх персонажей и заготовки их внутренних вкладок «Спрайты» / «Дизайн и референсы»).
 * @returns Набор данных из tzBlogCharacters.json.
 */
export function getTzBlogCharactersDataset(): TzBlogCharactersDataset {
  return tzBlogCharactersData as unknown as TzBlogCharactersDataset;
}


