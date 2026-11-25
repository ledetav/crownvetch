/**
 * Единый компонент полноэкранного лайтбокса для просмотра референсов и скетчей
 * в разделе «О блоге». Обеспечивает закрытие по клику на затемнённый фон,
 * кнопке «Закрыть ×» и клавише Escape, а также приведение путей ассетов
 * к текущему Vite BASE_URL.
 */
import { useEffect } from 'react';
import { resolveAssetUrl } from '../../utils/assetUrl';

/** Входные свойства полноэкранного лайтбокса изображения */
interface BlogImageLightboxProps {
  /** Путь к изображению (относительный или уже нормализованный); при null/пустой строке лайтбокс скрыт */
  src: string | null | undefined;
  /** Описание изображения для атрибута alt */
  alt: string;
  /** Доступное название диалогового окна (aria-label) */
  dialogAriaLabel: string;
  /** Подпись для aria-label кнопки закрытия */
  closeAriaLabel?: string;
  /** Обработчик закрытия лайтбокса */
  onClose: () => void;
}

/**
 * Отрисовывает модальный лайтбокс (.blog-guide-lightbox) с изображением в полном размере
 * и автоматической подпиской на клавишу Escape.
 * @param props Путь к изображению, подписи доступности и колбэк закрытия.
 * @returns JSX-разметка лайтбокса или null, если изображение не выбрано.
 */
export function BlogImageLightbox({
  src,
  alt,
  dialogAriaLabel,
  closeAriaLabel = 'Закрыть просмотр изображения',
  onClose,
}: BlogImageLightboxProps) {
  // Закрываем полноэкранный просмотр по клавише Escape, пока лайтбокс открыт
  useEffect(() => {
    if (!src) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [src, onClose]);

  if (!src) {
    return null;
  }

  const resolvedSrc = resolveAssetUrl(src);

  return (
    <div
      className="blog-guide-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={dialogAriaLabel}
      onClick={onClose}
    >
      <div
        className="blog-guide-lightbox__content"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="blog-guide-lightbox__bar">
          <button
            type="button"
            className="blog-guide-lightbox__close"
            onClick={onClose}
            aria-label={closeAriaLabel}
          >
            Закрыть ×
          </button>
        </div>
        <img
          key={resolvedSrc}
          src={resolvedSrc}
          alt={alt}
          className="blog-guide-lightbox__img"
        />
      </div>
    </div>
  );
}
