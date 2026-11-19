/**
 * Очищенная рабочая сцена для подразделов страницы «О блоге» (/tz/blog/*).
 * Старое наполнение удалено — контейнер служит чистым холстом видоискателя
 * для последующего поэтапного наполнения разделов блога.
 */

/** Входные свойства подраздела страницы «О блоге» */
export interface BlogSectionProps {
  /** Системный идентификатор активного подраздела блога */
  sectionId: 'overview' | 'characters' | 'palette' | 'header' | 'acts';
  /** Человекочитаемое название подраздела для доступности */
  title: string;
}

/**
 * Рендерит чистую пустую сцену видоискателя для выбранного подраздела блога.
 * @param props Идентификатор и название текущего подраздела блога.
 * @returns JSX-разметка пустого контейнера подраздела.
 */
export function BlogSection({ sectionId, title }: BlogSectionProps) {
  return (
    <section
      data-section={`blog-${sectionId}`}
      className="viewfinder-slide viewfinder-slide--active blog-empty-stage"
      aria-label={`О блоге: ${title}`}
    />
  );
}
