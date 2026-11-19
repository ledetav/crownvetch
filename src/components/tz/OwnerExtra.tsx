/**
 * Компонент правой верхней колонки секции «О владельце» (/tz#owner).
 * Отображает блок «Дополнительно» в точном типографическом стиле блока «Предпочтения»
 * (с активной внешней ссылкой на ВК) и плейлисты владельца со стрелками ↗.
 */
import type { ExternalResourceLink } from '../../types/project';
import { ExternalArrowIcon } from '../darkroom/ExternalResourceMenu';

/** Входные свойства блока «Дополнительно» и плейлистов */
interface OwnerExtraProps {
  /** Заголовок блока «Дополнительно» */
  extraHeading: string;
  /** Дословный текст об атрибутике и контактах для вопросов */
  extraBody: string;
  /** Заголовок блока плейлистов */
  playlistsHeading: string;
  /** Ссылки на плейлисты владельца */
  playlists: ExternalResourceLink[];
}

const VK_INLINE_URL = 'https://vk.com/h4slcdrme';

/**
 * Рендерит текст блока «Дополнительно», превращая URL профиля ВК в активную ссылку без изменения текста.
 * @param text Исходная строка текста.
 * @returns Фрагмент JSX с текстом и кликабельной ссылкой.
 */
function renderExtraTextWithLink(text: string) {
  const parts = text.split(VK_INLINE_URL);
  if (parts.length !== 2) {
    return text;
  }

  return (
    <>
      {parts[0]}
      <a
        href={VK_INLINE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="owner-inline-link"
      >
        {VK_INLINE_URL}
      </a>
      {parts[1]}
    </>
  );
}

/**
 * Отрисовывает правую верхнюю колонку секции «О владельце»: «Дополнительно» и плейлисты.
 * @param props Заголовки, текст и список плейлистов из tzOwner.json.
 * @returns JSX-разметка блока «Дополнительно» и плейлистов владельца.
 */
export function OwnerExtra({
  extraHeading,
  extraBody,
  playlistsHeading,
  playlists,
}: OwnerExtraProps) {
  return (
    <div className="owner-extra-column">
      <div className="dossier-bio owner-bio">
        <h3 className="dossier-bio__heading">{extraHeading}</h3>
        <p className="dossier-bio__text">{renderExtraTextWithLink(extraBody)}</p>
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
