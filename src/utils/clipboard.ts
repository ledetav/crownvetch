/**
 * Утилита безопасного копирования текста в буфер обмена.
 * Использует современный Clipboard API с автоматическим резервным fallback
 * через скрытое текстовое поле для ограниченных iframe-окружений.
 */

/**
 * Копирует переданную строку в буфер обмена пользователя.
 * @param text Строка для копирования (например, ID контакта или HEX-код цвета).
 * @returns Промис, завершающийся после попытки копирования.
 */
export async function copyTextToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // При отказе браузера или iframe-ограничениях переходим к резервному способу
    }
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', 'true');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();

  try {
    document.execCommand('copy');
  } finally {
    document.body.removeChild(textarea);
  }
}
