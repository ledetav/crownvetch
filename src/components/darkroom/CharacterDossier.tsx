/**
 * Компонент левой колонки досье персонажа внутри видоискателя.
 * Отрисовывает крупный акцентный заголовок (ВЯЗЕЛЬ) поверх световых VHS/RGB-прострелов,
 * приглушённый подзаголовок (CROWNVETCH), метаданные кадра, заголовок секции («О ПЕРСОНАЖЕ»),
 * описание и финальную цитату.
 */

/** Входные свойства компонента досье персонажа */
interface CharacterDossierProps {
  /** Основное крупное слово заголовка (ВЯЗЕЛЬ) */
  primaryWord: string;
  /** Приглушённый вторичный подзаголовок под именем (CROWNVETCH) */
  secondaryWord: string;
  /** Краткая строка метаданных архива */
  roleMeta: string;
  /** Временная метка кадра */
  timecodeTag: string;
  /** Подзаголовок текстового блока (О ПЕРСОНАЖЕ) */
  dossierHeading: string;
  /** Основной текст описания персонажа */
  dossierBody: string;
  /** Итоговая реплика-цитата под текстом */
  dossierQuote: string;
  /** Уровень HTML-заголовка для главного имени */
  headingLevel?: 'h1' | 'h2';
}

/**
 * Рендерит типографическое досье левой колонки видоискателя.
 * @param props Поля досье из tzHero.json и уровень заголовка.
 * @returns JSX-разметка левой колонки досье персонажа.
 */
export function CharacterDossier({
  primaryWord,
  secondaryWord,
  roleMeta,
  timecodeTag,
  dossierHeading,
  dossierBody,
  dossierQuote,
  headingLevel = 'h1',
}: CharacterDossierProps) {
  const HeadingTag = headingLevel;

  return (
    <div className="dossier-column">
      <div className="dossier-headline-block">
        {/* Главный заголовок ВЯЗЕЛЬ поверх световых VHS/RGB-прострелов, выходящих на перфорацию */}
        <div className="vyazel-wrapper">
          <div className="vyazel-ribbon" aria-hidden="true">
            <span className="vyazel-streak vyazel-streak--1" />
            <span className="vyazel-streak vyazel-streak--2" />
            <span className="vyazel-streak vyazel-streak--3" />
          </div>
          <HeadingTag className="serif-vyazel">{primaryWord}</HeadingTag>
        </div>

        <p className="dossier-secondary-word">{secondaryWord}</p>

        <div className="dossier-meta">
          <p className="dossier-meta__line">{roleMeta}</p>
          <p className="dossier-meta__time">{timecodeTag}</p>
        </div>
      </div>

      <div className="dossier-bio">
        <h3 className="dossier-bio__heading">{dossierHeading}</h3>
        <p className="dossier-bio__text">{dossierBody}</p>
        <blockquote className="dossier-bio__quote">{dossierQuote}</blockquote>
      </div>
    </div>
  );
}
