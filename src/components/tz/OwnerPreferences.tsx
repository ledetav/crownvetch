/**
 * Компонент левой колонки секции «О владельце» (/tz#owner).
 * Рендерит заголовок секции в едином стиле видоискателя (с VHS/RGB-прострелами),
 * подзаголовок и дословный блок «Предпочтения».
 */

/** Входные свойства левой колонки предпочтений владельца */
interface OwnerPreferencesProps {
  /** Главный акцентный заголовок секции (ВЛАДЕЛЕЦ) */
  primaryWord: string;
  /** Приглушённый подзаголовок под основным заголовком */
  secondaryWord: string;
  /** Заголовок блока предпочтений */
  preferencesHeading: string;
  /** Дословный авторский текст о предпочтениях */
  preferencesBody: string;
}

/**
 * Отрисовывает левую верхнюю колонку анкеты владельца с заголовком и предпочтениями.
 * @param props Заголовки и текст предпочтений из tzOwner.json.
 * @returns JSX-разметка левого верхнего блока секции «О владельце».
 */
export function OwnerPreferences({
  primaryWord,
  secondaryWord,
  preferencesHeading,
  preferencesBody,
}: OwnerPreferencesProps) {
  return (
    <div className="dossier-column owner-dossier-column">
      <div className="dossier-headline-block">
        {/* Заголовок секции с теми же VHS/RGB-прострелами, что и в секции персонажа */}
        <div className="vyazel-wrapper">
          <div className="vyazel-ribbon" aria-hidden="true">
            <span className="vyazel-streak vyazel-streak--1" />
            <span className="vyazel-streak vyazel-streak--2" />
            <span className="vyazel-streak vyazel-streak--3" />
          </div>
          <h2 className="serif-vyazel serif-vyazel--owner">{primaryWord}</h2>
        </div>

        <p className="dossier-secondary-word">{secondaryWord}</p>
      </div>

      <div className="dossier-bio owner-bio">
        <h3 className="dossier-bio__heading">{preferencesHeading}</h3>
        <p className="dossier-bio__text">{preferencesBody}</p>
      </div>
    </div>
  );
}
