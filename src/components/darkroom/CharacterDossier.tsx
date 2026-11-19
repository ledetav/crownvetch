/**
 * Компонент левой колонки досье персонажа внутри видоискателя.
 * Отрисовывает крупный акцентный заголовок (ВЯЗЕЛЬ) поверх световых VHS/RGB-прострелов,
 * приглушённый подзаголовок (ЛИН ВЭЙ), заголовок секции («О ПЕРСОНАЖЕ») и описание.
 */

/** Входные свойства компонента досье персонажа */
interface CharacterDossierProps {
  /** Основное крупное слово заголовка (ВЯЗЕЛЬ) */
  primaryWord: string;
  /** Приглушённый вторичный подзаголовок под именем (ЛИН ВЭЙ) */
  secondaryWord: string;
  /** Подзаголовок текстового блока (О ПЕРСОНАЖЕ) */
  dossierHeading: string;
  /** Основной текст описания персонажа */
  dossierBody: string;
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
  dossierHeading,
  dossierBody,
  headingLevel = 'h1',
}: CharacterDossierProps) {
  const HeadingTag = headingLevel;
  // Разбиваем описание на отдельные абзацы по пустой строке
  const paragraphs = dossierBody
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

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
      </div>

      <div className="dossier-bio">
        <h3 className="dossier-bio__heading">{dossierHeading}</h3>
        {paragraphs.map((paragraph, index) => (
          <p key={`dossier-p-${index}`} className="dossier-bio__text">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
