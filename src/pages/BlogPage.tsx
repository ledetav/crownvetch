/**
 * Отдельная страница раздела «О блоге» (/tz/blog/*).
 * Использует единую оболочку видоискателя 35-мм киноплёнки с собственной навигацией:
 * слева кнопка со стрелкой возврата к «О персонаже» (/tz/character),
 * справа меню подразделов (Общая информация, Персонажи, Палитра, Шапка, Акты).
 */
import { useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FilmStripFrame } from '../components/darkroom/FilmStripFrame';
import { getTzBlogDataset } from '../services/projectDataStore';
import '../styles/darkroomHero.css';

/**
 * Определяет идентификатор активного пункта подменю блога по текущему пути URL.
 * @param pathname Текущий pathname из React Router.
 * @param validIds Допустимые идентификаторы разделов блога.
 * @param fallbackId Идентификатор пункта по умолчанию.
 * @returns Идентификатор активного раздела блога.
 */
function resolveBlogTabFromPath(
  pathname: string,
  validIds: string[],
  fallbackId: string,
): string {
  const segments = pathname.replace(/\/+$/, '').split('/');
  const tail = segments[segments.length - 1] ?? '';
  return validIds.includes(tail) ? tail : fallbackId;
}

/**
 * Отрисовывает отдельную страницу «О блоге» с кнопкой возврата слева и подменю справа.
 * @returns JSX-разметка оболочки разделов блога.
 */
export function BlogPage() {
  const { pathname } = useLocation();
  const blogData = getTzBlogDataset();

  const validTabIds = blogData.navTabs.map((tab) => tab.id);
  const defaultTabId =
    blogData.navTabs.find((tab) => tab.highlighted)?.id ?? blogData.navTabs[0]?.id ?? 'overview';
  const activeTabId = resolveBlogTabFromPath(pathname, validTabIds, defaultTabId);
  const activeTab = blogData.navTabs.find((tab) => tab.id === activeTabId);

  useEffect(() => {
    const subtitle = activeTab?.label ?? 'О блоге';
    document.title = `О блоге — ${subtitle}`;
  }, [activeTab]);

  // Кнопка-стрелка возврата в левый слот шапки видоискателя
  const backButton = (
    <Link
      to={blogData.backTarget}
      className="blog-back-btn"
      aria-label={blogData.backAriaLabel}
      title={blogData.backAriaLabel}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M14.5 9H3.5M3.5 9L8 4.5M3.5 9L8 13.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
      </svg>
    </Link>
  );

  return (
    <FilmStripFrame
      sectionLabel="О блоге — навигация разделов"
      navTabs={blogData.navTabs}
      activeTabId={activeTabId}
      leftSlot={backButton}
    >
      <div className="viewfinder-route-stage">
        <Outlet />
      </div>
    </FilmStripFrame>
  );
}
