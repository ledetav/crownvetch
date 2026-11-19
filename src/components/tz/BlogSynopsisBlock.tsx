/**
 * Секция #synopsis на странице «О блоге → Общая информация».
 * Представляет структурированный черновой каркас синопсиса блога
 * из 4 смысловых слотов, готовый к последующему заполнению финальным текстом.
 */
import type { BlogSynopsisSlot } from '../../types/project';

/** Входные свойства секции синопсиса */
interface BlogSynopsisBlockProps {
  /** Заголовок секции синопсиса */
  heading: string;
  /** Вводное пояснение о назначении черновика */
  lead: string;
  /** Массив смысловых блоков-заготовок синопсиса */
  slots: BlogSynopsisSlot[];
}

/**
 * Рендерит якорный блок синопсиса блога в стилистике тёмной фотолаборатории.
 * @param props Заголовок, лид-абзац и список тематических слотов.
 * @returns JSX-разметка секции #synopsis.
 */
export function BlogSynopsisBlock({ heading, lead, slots }: BlogSynopsisBlockProps) {
  return (
    <section
      id="synopsis"
      className="blog-anchor-section blog-synopsis-panel"
      aria-labelledby="blog-synopsis-title"
    >
      <div className="blog-panel-head">
        <h2 id="blog-synopsis-title" className="dossier-bio__heading">
          {heading}
        </h2>
        <p className="blog-panel-lead">{lead}</p>
      </div>

      <div className="blog-synopsis-grid">
        {slots.map((slot) => (
          <article key={slot.id} className="blog-synopsis-card">
            <h3 className="blog-synopsis-card__title">{slot.title}</h3>
            <p className="blog-synopsis-card__text">{slot.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
