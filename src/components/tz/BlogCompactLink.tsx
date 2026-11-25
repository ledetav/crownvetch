/**
 * Компактная кнопка-ссылка для ячеек таблицы готовности блога («Ссылка на ТЗ» / «Работа»).
 * Автоматически выбирает React Router Link для внутренних маршрутов (/...)
 * и внешнюю ссылку с rel="noopener noreferrer" для внешних URL, либо выводит прочерк «—».
 */
import { Link } from 'react-router-dom';

/** Входные свойства компактной ссылки таблицы готовности */
interface BlogCompactLinkProps {
  /** Целевой URL из JSON (внутренний путь или внешний адрес) */
  url: string | undefined;
  /** Короткая подпись на кнопке-ссылке */
  label: string;
  /** Подсказка для атрибута title */
  titleText: string;
  /** Доступная подпись при отсутствии ссылки */
  emptyAriaLabel: string;
  /** Визуальный вариант ссылки: ссылка на ТЗ ('tz') или на готовую работу ('result') */
  variant: 'tz' | 'result';
}

/**
 * Отрисовывает компактную ссылку на ТЗ или готовую работу, либо прочерк «—», если адрес не задан.
 * @param props URL, подписи и визуальный стиль ссылки.
 * @returns JSX-разметка ссылки или заглушки «—».
 */
export function BlogCompactLink({
  url,
  label,
  titleText,
  emptyAriaLabel,
  variant,
}: BlogCompactLinkProps) {
  const trimmedUrl = url?.trim() ?? '';
  if (!trimmedUrl) {
    return (
      <span className="blog-tz-empty" aria-label={emptyAriaLabel}>
        —
      </span>
    );
  }

  const linkClass = variant === 'result' ? 'blog-tz-link blog-tz-link--result' : 'blog-tz-link';
  const isInternalRoute = trimmedUrl.startsWith('/');

  if (isInternalRoute) {
    return (
      <Link to={trimmedUrl} className={linkClass} title={titleText}>
        <span>{label}</span>
        <span aria-hidden="true">↗</span>
      </Link>
    );
  }

  return (
    <a
      href={trimmedUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={linkClass}
      title={titleText}
    >
      <span>{label}</span>
      <span aria-hidden="true">↗</span>
    </a>
  );
}
