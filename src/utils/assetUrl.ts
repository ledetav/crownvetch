/**
 * Утилита формирования корректных URL для статических ассетов из папки public/.
 * Учитывает Vite BASE_URL ('/' локально и на Vercel, '/crownvetch/' на GitHub Pages),
 * чтобы изображения и ссылки скачивания корректно загружались при деплое в подпапку.
 */

/** Регулярное выражение для внешних протоколов (http/https/data/blob) и protocol-relative ссылок */
const EXTERNAL_OR_INLINE_URL_PATTERN = /^(?:[a-z][a-z\d+\-.]*:|\/\/)/i;

/**
 * Преобразует путь к статическому ассету с учётом текущего базового пути приложения.
 * Внешние ссылки и data/blob URI возвращаются без изменений.
 * Локальные пути вида '/assets/...' или 'assets/...' объединяются с BASE_URL без дублирования префикса.
 * @param assetPath Исходный путь к файлу из JSON-конфигурации или пропсов.
 * @returns Готовый URL ассета для атрибутов src и href.
 */
export function resolveAssetUrl(assetPath: string): string {
  const trimmedPath = assetPath.trim();
  if (!trimmedPath || EXTERNAL_OR_INLINE_URL_PATTERN.test(trimmedPath)) {
    return trimmedPath;
  }

  // Гарантируем ровно один завершающий слэш у базового пути ('/' или '/crownvetch/')
  const rawBase = import.meta.env.BASE_URL || '/';
  const normalizedBase = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;

  // Исключаем двойной префикс, если путь уже содержит BASE_URL подпапки
  if (normalizedBase !== '/' && trimmedPath.startsWith(normalizedBase)) {
    return trimmedPath;
  }

  const relativePath = trimmedPath.replace(/^\/+/, '');
  return `${normalizedBase}${relativePath}`;
}
