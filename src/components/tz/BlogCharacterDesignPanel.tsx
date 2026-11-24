/**
 * Панель вкладки «Дизайн и референсы» раздела «О блоге → Персонажи».
 * Отрисовывает скетч примерного образа персонажа (с просмотром в лайтбоксе)
 * и переиспользует общий компонент галереи референсов BlogReferenceGallery
 * из «Памятки по работе» в портретном формате карточек.
 */
import { useEffect, useState } from 'react';
import type { BlogCharacterDesignContent } from '../../types/project';
import { resolveAssetUrl } from '../../utils/assetUrl';
import { BlogReferenceGallery } from './BlogReferenceGallery';

/** Входные свойства панели дизайна и референсов персонажа */
interface BlogCharacterDesignPanelProps {
  /** Заголовок вкладки персонажа для доступной разметки */
  heading: string;
  /** Необязательное общее примечание к разделу дизайна */
  note?: string;
  /** Данные скетча образа и списка референсов персонажа */
  design: BlogCharacterDesignContent;
}

/**
 * Отрисовывает материалы вкладки «Дизайн и референсы» выбранного персонажа:
 * скетч примерного образа слева и сетку референсов справа (или в одну колонку,
 * если заполнен только один из блоков / на узких экранах).
 * @param props Заголовок, примечание и визуальные материалы дизайна персонажа.
 * @returns JSX-разметка панели дизайна и референсов персонажа.
 */
export function BlogCharacterDesignPanel({
  heading,
  note,
  design,
}: BlogCharacterDesignPanelProps) {
  const [isSketchLightboxOpen, setIsSketchLightboxOpen] = useState(false);

  // Закрываем полноэкранный просмотр скетча образа по клавише Escape
  useEffect(() => {
    if (!isSketchLightboxOpen) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSketchLightboxOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSketchLightboxOpen]);

  const hasSketch = Boolean(design.sketch?.src);
  const references = design.references ?? [];
  const hasReferences = references.length > 0;
  const isSplitLayout = hasSketch && hasReferences;
  const resolvedSketchSrc = design.sketch ? resolveAssetUrl(design.sketch.src) : '';

  return (
    <div className="blog-character-design" aria-label={heading}>
      {note && <p className="blog-character-sprites__note">{note}</p>}

      <div
        className={`blog-character-design__layout ${
          isSplitLayout ? 'blog-character-design__layout--split' : ''
        }`}
      >
        {/* Блок скетча примерного образа персонажа на базе стилей .blog-header-sketch */}
        {design.sketch && hasSketch && (
          <div
            className="blog-header-sketch blog-character-design__sketch"
            aria-label={design.sketch.title}
          >
            <div className="blog-guide-refs__head">
              <span className="blog-guide-refs__title">{design.sketch.title}</span>
              <span className="blog-guide-refs__hint">
                {design.sketch.hint ?? 'Нажмите, чтобы увеличить'}
              </span>
            </div>

            <figure className="blog-header-sketch__frame">
              <button
                type="button"
                className="blog-header-sketch__trigger"
                onClick={() => setIsSketchLightboxOpen(true)}
                aria-label={`Открыть «${design.sketch.title}» в полном размере`}
              >
                <img
                  key={resolvedSketchSrc}
                  src={resolvedSketchSrc}
                  alt={design.sketch.alt}
                  className="blog-header-sketch__img"
                />
              </button>
            </figure>
          </div>
        )}

        {/* Переиспользуемая галерея референсов из памятки по работе (портретный формат 4:5) */}
        {hasReferences && (
          <BlogReferenceGallery
            title={design.referencesTitle ?? 'Референсы'}
            hint={design.referencesHint ?? 'Нажмите на кадр, чтобы рассмотреть детали'}
            ariaLabel={`Референсы — ${heading}`}
            items={references}
            aspect="portrait"
            className={`blog-character-design__refs ${
              !isSplitLayout && references.length >= 3 ? 'blog-character-design__refs--wide' : ''
            }`}
          />
        )}
      </div>

      {/* Полноэкранный просмотр скетча примерного образа */}
      {isSketchLightboxOpen && design.sketch && (
        <div
          className="blog-guide-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Просмотр: ${design.sketch.title}`}
          onClick={() => setIsSketchLightboxOpen(false)}
        >
          <div
            className="blog-guide-lightbox__content"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="blog-guide-lightbox__bar">
              <button
                type="button"
                className="blog-guide-lightbox__close"
                onClick={() => setIsSketchLightboxOpen(false)}
                aria-label="Закрыть просмотр скетча"
              >
                Закрыть ×
              </button>
            </div>
            <img
              key={resolvedSketchSrc}
              src={resolvedSketchSrc}
              alt={design.sketch.alt}
              className="blog-guide-lightbox__img"
            />
          </div>
        </div>
      )}
    </div>
  );
}
