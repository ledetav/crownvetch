/**
 * Компонент левой колонки секции «О владельце» (/tz#owner).
 * Рендерит заголовок секции («Диана Заболоцкая») поверх световых VHS/RGB-прострелов,
 * подзаголовок («глава Дарителей тепла») с микрокнопкой VK ↗ и дословный блок «Предпочтения».
 */
import { ExternalArrowIcon } from '../darkroom/ExternalResourceMenu';

/** Входные свойства левой колонки анкеты владельца */
interface OwnerPreferencesProps {
  /** Главный акцентный заголовок секции */
  primaryWord: string;
  /** Приглушённый подзаголовок под основным заголовком */
  secondaryWord: string;
  /** Микрокнопка со ссылкой на профиль рядом с подзаголовком */
  subtitleLink?: {
    /** Короткая подпись микрокнопки (VK) */
    label: string;
    /** Целевой URL профиля */
    url: string;
  };
  /** Заголовок блока предпочтений */
  preferencesHeading: string;
  /** Дословный авторский текст о предпочтениях */
  preferencesBody: string;
}

/**
 * Отрисовывает левую верхнюю колонку анкеты владельца с заголовком, микрокнопкой VK и предпочтениями.
 * @param props Заголовки, ссылка и текст предпочтений из tzOwner.json.
 * @returns JSX-разметка левого верхнего блока секции «О владельце».
 */
export function OwnerPreferences({
  primaryWord,
  secondaryWord,
  subtitleLink,
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

        <div className="owner-subtitle-row">
          <p className="dossier-secondary-word owner-subtitle-text">{secondaryWord}</p>
          {subtitleLink ? (
            <a
              href={subtitleLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="owner-vk-chip"
              aria-label={`Профиль владельца ${subtitleLink.label}`}
            >
              <span>{subtitleLink.label}</span>
              <ExternalArrowIcon />
            </a>
          ) : null}
        </div>
      </div>

      <div className="dossier-bio owner-bio">
        <h3 className="dossier-bio__heading">{preferencesHeading}</h3>
        <p className="dossier-bio__text">{preferencesBody}</p>
      </div>
    </div>
  );
}
