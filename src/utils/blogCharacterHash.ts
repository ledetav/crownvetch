/**
 * Утилита разбора URL-хэшей для раздела «О блоге → Персонажи» (/tz/blog/characters).
 * Поддерживает якоря вида #<characterId>, #<characterId>-sprites и #<characterId>-design.
 */
import type {
  BlogCharacterId,
  BlogCharacterProfile,
  BlogCharacterSubTabId,
} from '../types/project';

/** Упорядоченный список внутренних вкладок внутри карточки персонажа */
export const CHARACTER_SUBTAB_ORDER: BlogCharacterSubTabId[] = ['sprites', 'design'];

/** Результат разбора хэша URL: активный персонаж и выбранная внутренняя вкладка */
export interface ResolvedCharacterHashTarget {
  /** Системный идентификатор выбранного персонажа */
  characterId: BlogCharacterId;
  /** Активная внутренняя вкладка («sprites» или «design») */
  subTabId: BlogCharacterSubTabId;
}

/**
 * Разбирает хэш URL вида #<characterId>, #<characterId>-sprites или #<characterId>-design
 * и определяет целевого персонажа вместе с нужной внутренней вкладкой.
 * @param hash Текущий хэш адресной строки из React Router.
 * @param characters Полный список персонажей из JSON-хранилища.
 * @returns Идентификатор персонажа и вкладки (по умолчанию первый персонаж и «Спрайты»).
 */
export function resolveCharacterTargetFromHash(
  hash: string,
  characters: BlogCharacterProfile[],
): ResolvedCharacterHashTarget {
  const cleanHash = hash.replace(/^#/, '').trim();
  const fallbackCharacterId = characters[0]?.id ?? 'vyazel';

  if (!cleanHash) {
    return { characterId: fallbackCharacterId, subTabId: 'sprites' };
  }

  for (const character of characters) {
    // 1. Точное совпадение по базовому якорю персонажа (#vyazel, #ancestor и т. д.)
    if (cleanHash === character.id || hash === character.anchor) {
      return { characterId: character.id, subTabId: 'sprites' };
    }

    // 2. Совпадение по конкретной внутренней вкладке (#vyazel-sprites, #ancestor-design)
    for (const subTabId of CHARACTER_SUBTAB_ORDER) {
      if (cleanHash === `${character.id}-${subTabId}`) {
        return { characterId: character.id, subTabId };
      }
    }
  }

  return { characterId: fallbackCharacterId, subTabId: 'sprites' };
}
