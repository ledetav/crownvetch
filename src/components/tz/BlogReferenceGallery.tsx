/**
 * Переиспользуемая галерея визуальных референсов с полноэкранным лайтбоксом.
 * Используется в «Памятке по работе» (фоны/катсцены, формат 16:9) и во вкладке
 * «Дизайн и референсы» персонажей (референсы одежды и деталей, вертикальный формат 4:5).
 */
import { useState } from 'react';
import type { BlogWorkGuideReference } from '../../types/project';
import { resolveAssetUrl } from '../../utils/assetUrl';
import { BlogImageLightbox } from './BlogImageLightbox';

/** Пропорции карточек в сетке галереи референсов */
export type BlogReferenceGalleryAspect = 'landscape' | 'portrait';

/** Входные свойства переиспользуемой галереи референсов */
interface BlogReferenceGalleryProps {
  /** Заголовок блока референсов */
  title?: string;
  /** Подсказка справа от заголовка */
  hint?: string;
  /** Доступная подпись контейнера галереи для aria-label */
  ariaLabel?: string;
  /** Список изображений-референсов */
  items: BlogWorkGuideReference[];
  /** Формат карточек: 'landscape' (16:9 по умолчанию) или 'portrait' (4:5 для одежды и деталей) */
  aspect?: BlogReferenceGalleryAspect;
  /** Дополнительный CSS-класс корневого блока */
  className?: string;
}

/**
 * Отрисовывает сетку карточек-референсов (.blog-guide-refs) с увеличением
 * выбранного изображения в полноэкранном лайтбоксе (BlogImageLightbox).
 * @param props Заголовок, подсказка, массив референсов и пропорции карточек.
 * @returns JSX-разметка галереи референсов или null при пустом списке.
 */
export function BlogReferenceGallery({
  title = 'Референсы',
  hint = 'Нажмите на кадр, чтобы рассмотреть детали',
  ariaLabel = 'Галерея референсов',
  items,
  aspect = 'landscape',
  className = '',
}: BlogReferenceGalleryProps) {
  const [activeLightboxItem, setActiveLightboxItem] = useState<BlogWorkGuideReference | null>(null);

  if (items.length === 0) {
    return null;
  }

  const aspectModifier = aspect === 'portrait' ? 'blog-guide-refs--portrait' : '';
  const rootClassName = ['blog-guide-refs', aspectModifier, className].filter(Boolean).join(' ');

  return (
    <>
      <div className={rootClassName} aria-label={ariaLabel}>
        <div className="blog-guide-refs__head">
          <span className="blog-guide-refs__title">{title}</span>
          {hint && <span className="blog-guide-refs__hint">{hint}</span>}
        </div>

        <div className="blog-guide-refs__grid">
          {items.map((refItem, index) => (
            <figure key={refItem.id} className="blog-guide-ref">
              <button
                type="button"
                className="blog-guide-ref__trigger"
                onClick={() => setActiveLightboxItem(refItem)}
                aria-label={`Открыть референс ${index + 1} в полном размере`}
              >
                <img
                  src={resolveAssetUrl(refItem.src)}
                  alt={refItem.caption}
                  className="blog-guide-ref__img"
                  loading="lazy"
                />
              </button>
            </figure>
          ))}
        </div>
      </div>

      <BlogImageLightbox
        src={activeLightboxItem?.src}
        alt={activeLightboxItem?.caption ?? ''}
        dialogAriaLabel="Просмотр референса в полном размере"
        closeAriaLabel="Закрыть просмотр референса"
        onClose={() => setActiveLightboxItem(null)}
      />
    </>
  );
}
