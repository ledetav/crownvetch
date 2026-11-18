/**
 * Компонент анимированной глитч-типографики левой части видоискателя.
 * Отрисовывает:
 * - индикатор записи ● REC;
 * - заголовок OVERTHINK узким антиквенным шрифтом с засечками поверх
 *   многослойных оптических VHS-треков (бирюзовый, красный, жёлтый с белыми ядрами)
 *   и лёгкого горизонтального сдвига центральной полосы слова;
 * - пересекающуюся связку вертикального VORTEX, его полупрозрачного красного дубля
 *   (выступающего из-под основы ровно наполовину) и горизонтального полупрозрачного VORTEX,
 *   выровненных по единой нижней границе с реалистичными VHS-разрезами и хроматической аберрацией.
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
  /** Горизонтальное пересекающее слово (VORTEX) */
  crossWord: string;
}

/**
 * Рендерит типографическую композицию с клиновидными засечками и многослойными VHS-глитчами.
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

        {/* OVERTHINK: вытянутый антиквенный текст поверх мягких VHS-треков с оптическим сдвигом */}
        <div className="overthink-wrapper">
          <div className="overthink-ribbon" aria-hidden="true">
            <span className="glitch-lane glitch-lane--1" />
            <span className="glitch-lane glitch-lane--2" />
            <span className="glitch-lane glitch-lane--3" />
          </div>
          <h1 className="serif-overthink" data-text={primaryWord}>
            {primaryWord}
          </h1>
        </div>

        <p className="typo-quote typo-quote--middle">{bottomQuote}</p>

        {/* Пересекающаяся связка VORTEX (вертикальный) + VORTEX (горизонтальный) по общей нижней линии */}
        <div className="vortex-cross-lockup" aria-label={`${verticalWord} / ${crossWord}`}>
          {/* Полупрозрачный красный дубль, выровненный по нижней границе и выступающий вправо наполовину */}
          <span className="vortex-vertical-ghost" aria-hidden="true">
            {verticalWord}
          </span>

          {/* Основной вертикальный VORTEX с VHS-разрезами и хроматической аберрацией */}
          <span className="vortex-vertical" data-text={verticalWord}>
            {verticalWord}
          </span>

          {/* Горизонтальный полупрозрачный VORTEX в цвет текста по той же нижней границе */}
          <span className="vertex-horizontal" data-text={crossWord} aria-hidden="true">
            {crossWord}
          </span>

          {/* Поперечные VHS-прострелы по связке VORTEX */}
          <div className="vortex-glitch-streaks" aria-hidden="true">
            <span className="vortex-streak vortex-streak--1" />
            <span className="vortex-streak vortex-streak--2" />
            <span className="vortex-streak vortex-streak--3" />
          </div>
        </div>
      </div>

      <p className="typo-quote typo-quote--bottom">{bottomQuote}</p>
    </div>
  );
}
