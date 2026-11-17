/**
 * Компонент анимированной глитч-типографики левой части видоискателя.
 * Отрисовывает:
 * - индикатор записи ● REC;
 * - заголовок OVERTHINK шрифтом с засечками на фоне анимированных
 *   перемежающихся горизонтальных полос (жёлтых, бирюзовых и красных);
 * - пересекающуюся связку вертикального VORTEX (с глитч-полосами по тексту
 *   и полупрозрачной красной дублирующей тенью) и горизонтального VERTEX
 *   в полупрозрачном цвете основного текста.
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
  /** Горизонтальное пересекающее слово (VERTEX) */
  crossWord: string;
}

/**
 * Рендерит типографическую композицию с засечками и раздельными глитч-слоями.
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

        {/* OVERTHINK с засечками и перемежающимися цветными глитч-полосками позади текста */}
        <div className="overthink-wrapper">
          <div className="overthink-stripes" aria-hidden="true">
            <span className="glitch-bar glitch-bar--yellow-1" />
            <span className="glitch-bar glitch-bar--cyan-1" />
            <span className="glitch-bar glitch-bar--red-1" />
            <span className="glitch-bar glitch-bar--yellow-2" />
            <span className="glitch-bar glitch-bar--cyan-2" />
            <span className="glitch-bar glitch-bar--red-2" />
          </div>
          <h1 className="serif-overthink">{primaryWord}</h1>
        </div>

        <p className="typo-quote">{bottomQuote}</p>

        {/* Пересекающаяся связка VORTEX (вертикальный) + VERTEX (горизонтальный) */}
        <div className="vortex-cross-lockup" aria-label={`${verticalWord} / ${crossWord}`}>
          {/* Полупрозрачный красный дубль под вертикальным VORTEX */}
          <span className="vortex-vertical-ghost" aria-hidden="true">
            {verticalWord}
          </span>

          {/* Основной вертикальный VORTEX с глитч-полосами по самому тексту */}
          <span className="vortex-vertical" data-text={verticalWord}>
            {verticalWord}
          </span>

          {/* Горизонтальный полупрозрачный VERTEX в цвет основного текста с глитч-срезами */}
          <span className="vertex-horizontal" data-text={crossWord} aria-hidden="true">
            {crossWord}
          </span>
        </div>
      </div>

      <p className="typo-quote">{bottomQuote}</p>
    </div>
  );
}
