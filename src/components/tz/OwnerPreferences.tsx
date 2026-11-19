/**
 * Компонент левой колонки секции «О владельце» (/tz#owner).
 * Рендерит заголовок секции в едином стиле видоискателя (с VHS/RGB-прострелами),
 * дословный текст предпочтений владельца и блок ссылок на плейлисты
 * со стрелками перехода в правый верхний угол (↗).
 */
import type { ExternalResourceLink } from '../../types/project';
import { ExternalArrowIcon } from '../darkroom/ExternalResourceMenu';

/** Входные свойства левой колонки анкеты владельца */
interface OwnerPreferencesProps {
  /** Главный акцентный заголовок секции (ВЛАДЕЛЕЦ) */
  primaryWord: string;
  /** Приглушённый подзаголовок под основным заголовком */
  secondaryWord: string;
  /** Заголовок блока предпочтений */
  preferencesHeading: string;
  /** Дословный авторский текст о предпочтениях */
  preferencesBody: string;
  /** Заголовок блока плейлистов */
  playlistsHeading: string;
  /** Список плейлистов владельца в стиле правого меню персонажа */
  playlists: ExternalResourceLink[];
}

/**
 * Отрисовывает левую колонку досье владельца с предпочтениями и плейлистами.
 * @param props Заголовки, текст предпочтений и ссылки на плейлисты из tzOwner.json.
 * @returns JSX-разметка левой колонки секции «О владельце».
 */
export function OwnerPreferences({
  primaryWord,
  secondaryWord,
  preferencesHeading,
  preferencesBody,
  playlistsHeading,
  playlists,
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

      <div className="owner-playlists">
        <h3 className="dossier-bio__heading">{playlistsHeading}</h3>
        <nav className="owner-playlists__list" aria-label="Плейлисты владельца">
          {playlists.map((item) => {
            const accentClass = `external-menu__item--${item.accent}`;

            return (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`external-menu__item owner-playlists__item ${accentClass}`}
              >
                <span className="external-menu__label-group">
                  <span className="external-menu__index">[{item.indexLabel}]</span>
                  <span className="external-menu__text">{item.label}</span>
                </span>
                <ExternalArrowIcon />
              </a>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
