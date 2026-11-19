/**
 * Макетная страница основных разделов технического задания (/tz/character и /tz/owner).
 * Удерживает единую оболочку видоискателя (перфорация плёнки, уголки камеры,
 * счётчик ● REC и верхнее меню) и отрисовывает активный дочерний маршрут через Outlet.
 */
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { FilmStripFrame } from '../components/darkroom/FilmStripFrame';
import { RotateDeviceOverlay } from '../components/darkroom/RotateDeviceOverlay';
import { getTzHeroDataset } from '../services/projectDataStore';
import '../styles/darkroomHero.css';

/**
 * Определяет идентификатор активного пункта меню по текущему пути URL.
 * @param pathname Текущий pathname из React Router.
 * @param fallbackId Идентификатор пункта по умолчанию.
 * @returns Идентификатор активной вкладки ('character' | 'owner').
 */
function resolveTzTabFromPath(pathname: string, fallbackId: string): string {
  if (pathname.startsWith('/tz/owner')) {
    return 'owner';
  }
  if (pathname.startsWith('/tz/character')) {
    return 'character';
  }
  return fallbackId;
}

/**
 * Отрисовывает каркас видоискателя для разделов ТЗ с переключением по маршрутам.
 * @returns JSX-разметка оболочки страниц /tz/character и /tz/owner.
 */
export function TzPage() {
  const { pathname } = useLocation();
  const heroData = getTzHeroDataset();
  const defaultTabId =
    heroData.navTabs.find((tab) => tab.highlighted)?.id ?? heroData.navTabs[0]?.id ?? 'character';
  const activeTabId = resolveTzTabFromPath(pathname, defaultTabId);

  useEffect(() => {
    document.title =
      activeTabId === 'owner'
        ? 'ДИАНА ЗАБОЛОЦКАЯ — О владельце'
        : 'ВЯЗЕЛЬ // ЛИН ВЭЙ — О персонаже';
  }, [activeTabId]);

  return (
    <>
      <RotateDeviceOverlay />
      <FilmStripFrame
        sectionLabel="Техническое задание — видоискатель"
        navTabs={heroData.navTabs}
        activeTabId={activeTabId}
      >
        <div className="viewfinder-route-stage">
          <Outlet />
        </div>
      </FilmStripFrame>
    </>
  );
}
