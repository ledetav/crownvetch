/**
 * Компонент анимированной глитч-типографики левой части видоискателя.
 * Отрисовывает:
 * - индикатор записи ● REC;
 * - заголовок OVERTHINK узким антиквенным шрифтом с засечками поверх
 *   3-полосной глитч-ленты с зазорами из перемежающихся сегментов жёлтого,
 *   бирюзового и красного цветов;
 * - пересекающуюся связку вертикального VORTEX (с глитч-полосами по тексту
 *   и полупрозрачной красной дублирующей тенью) и горизонтального VERTEX
 *   в едином типографическом стиле с OVERTHINK.
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
 * Рендерит типографическую композицию с клиновидными засечками и раздельными глитч-слоями.
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

        {/* OVERTHINK: вытянутый антиквенный текст поверх 3-полосной глитч-ленты с зазорами */}
        <div className="overthink-wrapper">
          <div className="overthink-ribbon" aria-hidden="true">
            <span className="glitch-lane glitch-lane--1" />
            <span className="glitch-lane glitch-lane--2" />
            <span className="glitch-lane glitch-lane--3" />
          </div>
          <h1 className="serif-overthink">{primaryWord}</h1>
        </div>

        <p className="typo-quote">{bottomQuote}</p>

        {/* Пересекающаяся связка VORTEX (вертикальный) + VERTEX (горизонтальный) в стиле OVERTHINK */}
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
