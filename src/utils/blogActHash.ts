/**
 * Утилиты разбора URL-хэшей для раздела «О блоге → Акты» (/tz/blog/acts).
 * Определяют выбранный акт, режим просмотра («Текстовое описание» / «Схема сцен»)
 * и целевую сцену для автофокуса по якорям вида #act-1, #act-1-description и #act-1-scene-X.
 */
import type { BlogActId, BlogActItem } from '../types/project';

/** Режим отображения содержимого внутри выбранного акта */
export type ActContentView = 'description' | 'flow';

/** Результат разбора хэша URL: выбранный акт, режим и необязательная целевая сцена */
export interface ResolvedActHashTarget {
  /** Идентификатор акта */
  actId: BlogActId;
  /** Целевой режим внутри акта (если задан якорь сцены, принудительно открывается схема) */
  view: ActContentView | null;
  /** Идентификатор целевой сцены для раскрытия и фокуса (если передан якорь сцены) */
  sceneId: string | null;
}

/**
 * Проверяет, содержит ли сценарная цепочка акта сцену с указанным идентификатором.
 * @param act Описание акта.
 * @param sceneId Искомый идентификатор сцены.
 * @returns true, если сцена принадлежит этому акту.
 */
export function actContainsScene(act: BlogActItem, sceneId: string): boolean {
  if (!act.flow) {
    return false;
  }
  return act.flow.some((node) => {
    if (node.kind === 'scene') {
      return node.scene.id === sceneId;
    }
    if (node.kind === 'branch') {
      return node.columns.some((column) => column.scene.id === sceneId);
    }
    return false;
  });
}

/**
 * Возвращает стартовый режим отображения для указанного акта с учётом доступных данных.
 * @param act Описание акта.
 * @returns 'description', если у акта есть текстовое описание, иначе 'flow'.
 */
export function getDefaultActView(act: BlogActItem | undefined): ActContentView {
  if (act?.descriptionParts && act.descriptionParts.length > 0) {
    return 'description';
  }
  return 'flow';
}

/**
 * Определяет активный акт, внутренний режим и (при наличии) целевую сцену по хэшу URL.
 * Поддерживает якоря актов (#act-1..#act-4), якорь описания (#act-1-description)
 * и прямые якоря сцен (#act-1-scene-1..#act-1-scene-10) из таблицы готовности.
 * @param hash Текущий хэш URL из React Router.
 * @param acts Доступный список актов из JSON-хранилища.
 * @returns Объект с идентификатором акта, режимом просмотра и целевой сценой (или null).
 */
export function resolveActTargetFromHash(hash: string, acts: BlogActItem[]): ResolvedActHashTarget {
  const cleanHash = hash.replace(/^#/, '');

  if (cleanHash) {
    // 1. Прямое совпадение по якорю акта (#act-1..#act-4)
    const matchedAct = acts.find((act) => act.anchor === hash || act.id === cleanHash);
    if (matchedAct) {
      return { actId: matchedAct.id, view: null, sceneId: null };
    }

    // 2. Прямой переход к текстовому описанию акта (#act-1-description)
    const descriptionAct = acts.find((act) => cleanHash === `${act.id}-description`);
    if (descriptionAct) {
      return { actId: descriptionAct.id, view: 'description', sceneId: null };
    }

    // 3. Поиск сцены внутри схем актов (#act-1-scene-6-1, #act-1-scene-8-1 и т. д.)
    const actWithScene = acts.find((act) => actContainsScene(act, cleanHash));
    if (actWithScene) {
      return { actId: actWithScene.id, view: 'flow', sceneId: cleanHash };
    }
  }

  return { actId: acts[0]?.id ?? 'act-1', view: null, sceneId: null };
}
