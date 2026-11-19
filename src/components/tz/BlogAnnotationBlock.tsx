/**
 * Вкладка «Аннотация» на странице «О блоге → Общая информация».
 * Отрисовывает дословный текст аннотации без внутреннего заголовка
 * в строгом оформлении тёмной фотолаборатории.
 */

/** Входные свойства текстового блока аннотации */
interface BlogAnnotationBlockProps {
  /** Дословный текст аннотации с разбивкой абзацев через пустую строку */
  body: string;
}

/**
 * Рендерит текстовый блок аннотации без заголовка внутри панели вкладки.
 * @param props Исходный текст аннотации блога.
 * @returns JSX-разметка панели вкладки «Аннотация».
 */
export function BlogAnnotationBlock({ body }: BlogAnnotationBlockProps) {
  const paragraphs = body
    .split('\n\n')
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <section
      id="annotation"
      role="tabpanel"
      className="blog-annotation-panel"
      aria-label="Аннотация"
    >
      <div className="blog-annotation-body">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="blog-annotation-paragraph">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
