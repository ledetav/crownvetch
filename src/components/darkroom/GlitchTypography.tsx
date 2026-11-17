/**
 * Компонент анимированной глитч-типографики левой части видоискателя.
 * Включает мигающий индикатор записи ● REC, слоганы временной петли,
 * крупный заголовок OVERTHINK с RGB-сдвигом и пересекающуюся связку VORTEX / VERTEX.
 */

/** Входные свойства компонента глитч-типографики */
interface GlitchTypographyProps {
  /** Таймкод записи возле красной точки REC */
  recTimecode: string;
  /** Верхняя цитата над OVERTHINK */
  topQuote: string;
  /** Нижняя цитата под композицией */
  bottomQuote: string;
  /** Основное крупное слово (OVERTHINK) */
  primaryWord: string;
  /** Вертикальное слово (VORTEX) */
  verticalWord: string;
  /** Горизонтальное полупрозрачное слово (VERTEX) */
  crossWord: string;
}

/**
 * Рендерит типографическую композицию с непрерывными глитч-анимациями.
 * @param props Тексты и таймкоды из JSON-конфигурации первого экрана.
 * @returns JSX-разметка левой типографической колонки.
 */
export function GlitchTypography({
  recTimecode,
  topQuote,
  bottomQuote,
  primaryWord,
  verticalWord,
  crossWord,
}: GlitchTypographyProps) {
  return (
    <div className="typo-column">
      <div className="rec-indicator" aria-label={`Запись ${recTimecode}`}>
        <span className="rec-indicator__dot" aria-hidden="true" />
        <span>REC {recTimecode}</span>
      </div>

      <div className="typo-stack">
        <p className="typo-quote typo-quote--top">{topQuote}</p>

        <h1 className="glitch-overthink" data-text={primaryWord}>
          {primaryWord}
        </h1>

        <p className="typo-quote">{bottomQuote}</p>

        <div className="vortex-cross-lockup" aria-label={`${verticalWord} / ${crossWord}`}>
          <span className="vortex-vertical">
            <span className="vortex-vertical__ghost" aria-hidden="true">
              {verticalWord}
            </span>
            {verticalWord}
          </span>
          <span className="vertex-horizontal" aria-hidden="true">
            {crossWord}
          </span>
        </div>
      </div>

      <p className="typo-quote">{bottomQuote}</p>
    </div>
  );
}
