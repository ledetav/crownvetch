/**
 * Компонент интерактивной палитры проекта.
 * Отображает цветовые образцы из src/data/palette.json и позволяет
 * скопировать HEX-код оттенка в буфер обмена по клику на карточку.
 */
import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import type { PaletteSwatch } from '../types/project';

/** Входные свойства компонента интерактивной палитры */
interface InteractivePaletteProps {
  /** Массив цветовых образцов из JSON-базы */
  swatches: PaletteSwatch[];
}

/**
 * Рендерит сетку карточек палитры с поддержкой копирования HEX-кода.
 * @param props Свойства компонента со списком оттенков.
 * @returns JSX-разметка сетки палитры.
 */
export function InteractivePalette({ swatches }: InteractivePaletteProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  /**
   * Копирует HEX-значение выбранного оттенка в буфер обмена
   * и временно подсвечивает индикатор успешного копирования.
   */
  const handleCopyHex = async (swatch: PaletteSwatch) => {
    try {
      await navigator.clipboard.writeText(swatch.hex);
      setCopiedId(swatch.id);
      window.setTimeout(() => {
        setCopiedId((current) => (current === swatch.id ? null : current));
      }, 1600);
    } catch {
      // В средах без доступа к Clipboard API просто фиксируем выбор визуально
      setCopiedId(swatch.id);
    }
  };

  return (
    <div className="palette-grid">
      {swatches.map((swatch) => {
        const isCopied = copiedId === swatch.id;
        return (
          <button
            key={swatch.id}
            type="button"
            className="palette-card"
            onClick={() => handleCopyHex(swatch)}
            aria-label={`Скопировать цвет ${swatch.name} ${swatch.hex}`}
          >
            <div
              className="palette-card__preview"
              style={{ backgroundColor: swatch.hex }}
            />
            <div className="palette-card__meta">
              <span className="palette-card__name">{swatch.name}</span>
              <span className="palette-card__hex">
                {isCopied ? <Check size={14} /> : <Copy size={14} />}
                <span>{isCopied ? 'Скопировано' : swatch.hex}</span>
              </span>
            </div>
            <p className="palette-card__role">{swatch.role}</p>
          </button>
        );
      })}
    </div>
  );
}
