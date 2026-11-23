/**
 * Текстовое описание (пересказ) выбранного акта в разделе «О блоге → Акты».
 * Отрисовывает пронумерованные смысловые части акта в оформлении тёмной фотолаборатории
 * с сохранением авторской разбивки на абзацы.
 */
import type { BlogActDescriptionPart } from '../../types/project';

/** Входные свойства компонента текстового описания акта */
interface BlogActDescriptionProps {
  /** Пронумерованные смысловые части текстового описания акта */
  parts: BlogActDescriptionPart[];
  /** Заголовок акта для доступной подписи списка */
  actHeading: string;
}

/**
 * Рендерит текстовое описание акта в виде пронумерованных карточек-эпизодов.
 * @param props Массив пронумерованных частей текста и заголовок акта.
 * @returns JSX-разметка вкладки «Текстовое описание» внутри акта.
 */
export function BlogActDescription({ parts, actHeading }: BlogActDescriptionProps) {
  return (
    <ol
      className="blog-act-description"
      aria-label={`Текстовое описание: ${actHeading}`}
    >
      {parts.map((part) => (
        <li key={part.index} className="blog-act-description__item">
          <div className="blog-act-description__index" aria-hidden="true">
            {part.index}.
          </div>
          <div className="blog-act-description__content">
            {part.paragraphs.map((paragraph, paragraphIndex) => (
              <p
                key={`${part.index}-${paragraphIndex}`}
                className="blog-act-description__paragraph"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </li>
      ))}
    </ol>
  );
}
