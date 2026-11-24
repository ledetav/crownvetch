/**
 * Секция «Палитра» внутри отдельной страницы «О блоге» (/tz/blog/palette).
 * Отображает заголовок «ПАЛИТРА» со световыми прострелами, блок примечания
 * с подписью автора и цветовые палетки с вертикальными образцами оттенков,
 * каждый из которых копируется в HEX по клику (без названий цветов).
 */
import { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { getTzBlogPaletteDataset } from '../../services/projectDataStore';

/** Длительность отображения подтверждения копирования HEX-кода (мс) */
const COPY_FEEDBACK_DURATION_MS = 1500;

/**
 * Копирует строку в буфер обмена через Clipboard API с резервным fallback
 * для окружений с ограничениями прав доступа к буферу (например, встроенный iframe).
 * @param value Текст для копирования (HEX-код оттенка).
 * @returns Промис, завершающийся после попытки копирования.
 */
async function copyHexToClipboard(value: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return;
    } catch {
      // Переходим к резервному способу копирования через скрытое текстовое поле
    }
  }

  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', '');
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

/**
 * Отрисовывает раздел «О блоге → Палитра» с примечанием и интерактивными
 * карточками оттенков, отсортированных от тёмного к светлому.
 * @returns JSX-разметка раздела /tz/blog/palette.
 */
export function BlogPaletteSection() {
  const paletteData = getTzBlogPaletteDataset();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const resetTimerRef = useRef<number | null>(null);

  // Очищаем таймер сброса индикатора при размонтировании компонента
  useEffect(() => {
    return () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  /**
   * Копирует HEX-код выбранной плитки и кратковременно показывает отметку «Скопировано».
   * @param swatchKey Уникальный ключ плитки (groupId + hex).
   * @param hex Значение цвета в формате #RRGGBB.
   */
  const handleCopyColor = async (swatchKey: string, hex: string) => {
    await copyHexToClipboard(hex);
    setCopiedKey(swatchKey);

    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
    }
    resetTimerRef.current = window.setTimeout(() => {
      setCopiedKey((current) => (current === swatchKey ? null : current));
      resetTimerRef.current = null;
    }, COPY_FEEDBACK_DURATION_MS);
  };

  return (
    <section
      data-section="blog-palette"
      className="viewfinder-slide viewfinder-slide--active"
      aria-label="О блоге: Палитра"
    >
      <div className="blog-overview-frame">
        <div className="blog-acts-header">
          <div className="dossier-headline-block">
            <div className="vyazel-wrapper">
              <div className="vyazel-ribbon" aria-hidden="true">
                <span className="vyazel-streak vyazel-streak--1" />
                <span className="vyazel-streak vyazel-streak--2" />
                <span className="vyazel-streak vyazel-streak--3" />
              </div>
              <h1 className="serif-vyazel serif-vyazel--blog">{paletteData.primaryWord}</h1>
            </div>
            <p className="dossier-secondary-word">{paletteData.secondaryWord}</p>
          </div>

          {/* Общее примечание о палитре блога и образов с подписью автора */}
          <aside
            className="blog-acts-editorial-note blog-palette-note"
            aria-label={paletteData.editorialNote.label}
          >
            <span className="blog-acts-editorial-note__label">
              {paletteData.editorialNote.label}
            </span>
            <p className="blog-acts-editorial-note__text">{paletteData.editorialNote.text}</p>
            <p className="blog-palette-note__signature">{paletteData.editorialNote.signature}</p>
          </aside>
        </div>

        {/* Цветовые палетки: вертикальные прямоугольники-образцы и копирование HEX по клику */}
        {paletteData.groups.map((group) => (
          <section
            key={group.id}
            id={group.id}
            className="blog-readiness-panel blog-palette-panel"
            aria-labelledby={`blog-palette-heading-${group.id}`}
          >
            <div className="blog-readiness-head blog-palette-panel__head">
              <h2 id={`blog-palette-heading-${group.id}`} className="dossier-bio__heading">
                {group.title}
              </h2>
              <span className="blog-guide-refs__hint">Нажмите на цвет, чтобы скопировать HEX</span>
            </div>

            <div className="blog-palette-grid" role="list" aria-label={group.title}>
              {group.colors.map((hex) => {
                const normalizedHex = hex.toUpperCase();
                const swatchKey = `${group.id}-${normalizedHex}`;
                const isCopied = copiedKey === swatchKey;

                return (
                  <button
                    key={swatchKey}
                    type="button"
                    role="listitem"
                    className={`blog-palette-swatch ${
                      isCopied ? 'blog-palette-swatch--copied' : ''
                    }`}
                    onClick={() => handleCopyColor(swatchKey, normalizedHex)}
                    aria-label={`Скопировать HEX ${normalizedHex}`}
                    title={`Нажмите, чтобы скопировать ${normalizedHex}`}
                  >
                    <span
                      className="blog-palette-swatch__color"
                      style={{ backgroundColor: normalizedHex }}
                      aria-hidden="true"
                    />
                    <span className="blog-palette-swatch__footer">
                      <span className="blog-palette-swatch__icon" aria-hidden="true">
                        {isCopied ? <Check size={13} /> : <Copy size={13} />}
                      </span>
                      <span className="blog-palette-swatch__hex">
                        {isCopied ? 'Скопировано' : normalizedHex}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
