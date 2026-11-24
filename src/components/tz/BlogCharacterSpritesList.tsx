/**
 * Список карточек спрайтов персонажа во вкладке «Спрайты» раздела «О блоге → Персонажи».
 * Отрисовывает общее примечание (при наличии), нумерованную сетку эмоций/поз
 * с текстовым описанием и слотом под скетч (с просмотром в лайтбоксе, когда скетч добавлен).
 */
import { useEffect, useState } from 'react';
import type { BlogCharacterSpriteItem } from '../../types/project';

/** Входные свойства списка спрайтов персонажа */
interface BlogCharacterSpritesListProps {
  /** Заголовок списка спрайтов */
  heading: string;
  /** Необязательное общее примечание к набору спрайтов (например, «Все скетчи будут позже.») */
  note?: string;
  /** Упорядоченный список спрайтов персонажа */
  sprites: BlogCharacterSpriteItem[];
}

/**
 * Отрисовывает сетку карточек спрайтов выбранного персонажа с текстовым описанием
 * и поддержкой полноэкранного просмотра прикреплённых скетчей.
 * @param props Заголовок, примечание и массив спрайтов персонажа.
 * @returns JSX-разметка списка спрайтов персонажа.
 */
export function BlogCharacterSpritesList({
  heading,
  note,
  sprites,
}: BlogCharacterSpritesListProps) {
  const [lightboxSprite, setLightboxSprite] = useState<BlogCharacterSpriteItem | null>(null);

  // Закрываем лайтбокс скетча по клавише Escape
  useEffect(() => {
    if (!lightboxSprite) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLightboxSprite(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxSprite]);

  return (
    <div className="blog-character-sprites" aria-label={heading}>
      {note && <p className="blog-character-sprites__note">{note}</p>}

      <ol className="blog-character-sprites__grid">
        {sprites.map((sprite, index) => {
          const formattedIndex = String(index + 1).padStart(2, '0');
          return (
            <li key={sprite.id} id={sprite.id} className="blog-sprite-card">
              <div className="blog-sprite-card__header">
                <span className="blog-sprite-card__index">{formattedIndex}</span>
                <h4 className="blog-sprite-card__title">{sprite.title}</h4>
              </div>

              <div className="blog-sprite-card__body">
                <span className="blog-sprite-card__label">Описание</span>
                {sprite.description ? (
                  <p className="blog-sprite-card__desc">{sprite.description}</p>
                ) : (
                  <p className="blog-sprite-card__desc blog-sprite-card__desc--pending">
                    Будет позже.
                  </p>
                )}
              </div>

              {sprite.sketchSrc ? (
                <figure className="blog-sprite-card__sketch">
                  <button
                    type="button"
                    className="blog-sprite-card__sketch-trigger"
                    onClick={() => setLightboxSprite(sprite)}
                    aria-label={`Открыть скетч спрайта «${sprite.title}» в полном размере`}
                  >
                    <img
                      src={sprite.sketchSrc}
                      alt={sprite.sketchAlt ?? `Скетч спрайта «${sprite.title}»`}
                      className="blog-sprite-card__sketch-img"
                      loading="lazy"
                    />
                  </button>
                </figure>
              ) : (
                <div className="blog-sprite-card__sketch-soon" aria-label="Скетч появится позже">
                  <span className="blog-sprite-card__sketch-soon-label">Скетч — позже</span>
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {/* Полноэкранный просмотр скетча спрайта при клике */}
      {lightboxSprite?.sketchSrc && (
        <div
          className="blog-guide-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Скетч спрайта «${lightboxSprite.title}»`}
          onClick={() => setLightboxSprite(null)}
        >
          <div
            className="blog-guide-lightbox__content"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="blog-guide-lightbox__bar">
              <button
                type="button"
                className="blog-guide-lightbox__close"
                onClick={() => setLightboxSprite(null)}
                aria-label="Закрыть просмотр скетча"
              >
                Закрыть ×
              </button>
            </div>
            <img
              src={lightboxSprite.sketchSrc}
              alt={lightboxSprite.sketchAlt ?? `Скетч спрайта «${lightboxSprite.title}»`}
              className="blog-guide-lightbox__img"
            />
          </div>
        </div>
      )}
    </div>
  );
}
