/**
 * Компонент анимированной глитч-типографики левой части видоискателя.
 * Отрисовывает:
 * - приподнятый индикатор записи ● REC с обратным отсчётом петли;
 * - заголовок OVERTHINK узким антиквенным шрифтом с засечками поверх
 *   световых VHS/RGB-прострелов (бирюзовый, белый, красный, жёлтый);
 * - пересекающуюся связку вертикального VORTEX (с локальным глитчем строго
 *   на букве E), статичного полупрозрачного красного дубля и горизонтального
 *   полупрозрачного VORTEX, выровненных по единой нижней границе.
 */
import { RecTimer } from './RecTimer';

/** Входные свойства компонента глитч-типографики */
interface GlitchTypographyProps {
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
  /** Уровень HTML-заголовка для основного слова */
  headingLevel?: 'h1' | 'h2';
}

/**
 * Рендерит типографическую композицию с клиновидными засечками и световыми VHS-глитчами.
 * @param props Тексты и цитаты из JSON-конфигурации первого экрана.
 * @returns JSX-разметка левой типографической колонки.
 */
export function GlitchTypography({
  topQuote,
  bottomQuote,
  primaryWord,
  verticalWord,
  crossWord,
  headingLevel = 'h1',
}: GlitchTypographyProps) {
  const HeadingTag = headingLevel;

  return (
    <div className="typo-column">
      <div className="rec-slot">
        <RecTimer />
      </div>

      <div className="typo-stack">
        <p className="typo-quote typo-quote--top">{topQuote}</p>

        {/* OVERTHINK: вытянутый антиквенный текст поверх световых VHS/RGB-прострелов */}
        <div className="overthink-wrapper">
          <div className="overthink-ribbon" aria-hidden="true">
            <span className="overthink-streak overthink-streak--1" />
            <span className="overthink-streak overthink-streak--2" />
            <span className="overthink-streak overthink-streak--3" />
          </div>
          <HeadingTag className="serif-overthink">{primaryWord}</HeadingTag>
        </div>

        <p className="typo-quote typo-quote--middle">{bottomQuote}</p>

        {/* Пересекающаяся связка VORTEX (вертикальный) + VORTEX (горизонтальный) по общей нижней линии */}
        <div className="vortex-cross-lockup" aria-label={`${verticalWord} / ${crossWord}`}>
          {/* Статичный полупрозрачный красный дубль, выступающий из-под основы ровно наполовину */}
          <span className="vortex-vertical-ghost" aria-hidden="true">
            {verticalWord}
          </span>

          {/* Основной вертикальный VORTEX с локальным VHS-разрезом строго на букве E */}
          <span className="vortex-vertical" data-text={verticalWord}>
            {verticalWord}
          </span>

          {/* Горизонтальный полупрозрачный VORTEX в цвет текста по той же нижней границе */}
          <span className="vertex-horizontal" data-text={crossWord} aria-hidden="true">
            {crossWord}
          </span>

          {/* Световые VHS-прострелы локально в зоне буквы E */}
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
