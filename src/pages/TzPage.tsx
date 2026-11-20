/**
 * Макетная страница основных разделов технического задания (/tz/character и /tz/owner).
 * Удерживает единую оболочку видоискателя (перфорация плёнки, уголки камеры,
 * счётчик ● REC и верхнее меню) и отрисовывает активный дочерний маршрут через Outlet.
 * Для «О персонаже» (/tz/character):
 * - на вертикальных телефонах/планшетах показывает заглушку поворота;
 * - на планшетах и компактных экранах оставляет внешний каркас (меню, уголки, ● REC,
 *   перфорацию) в точном ПК-размере, пропорционально уменьшая только внутреннюю сцену;
 * - на горизонтальных телефонах пропорционально уменьшает экран целиком.
 */
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { FilmStripFrame } from '../components/darkroom/FilmStripFrame';
import { RotateDeviceOverlay } from '../components/darkroom/RotateDeviceOverlay';
import { useCharacterViewportScale } from '../hooks/useCharacterViewportScale';
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
  const isCharacterRoute = activeTabId === 'character';

  const viewportScale = useCharacterViewportScale(isCharacterRoute);

  useEffect(() => {
    document.title =
      activeTabId === 'owner'
        ? 'ДИАНА ЗАБОЛОЦКАЯ — О владельце'
        : 'ВЯЗЕЛЬ // ЛИН ВЭЙ — О персонаже';
  }, [activeTabId]);

  // Для «О владельце» заглушка поворота и жёсткое масштабирование не применяются
  if (!isCharacterRoute) {
    return (
      <FilmStripFrame
        sectionLabel="Техническое задание — видоискатель"
        navTabs={heroData.navTabs}
        activeTabId={activeTabId}
      >
        <div className="viewfinder-route-stage">
          <Outlet />
        </div>
      </FilmStripFrame>
    );
  }

  // Внутренняя сцена персонажа: на планшетах масштабируется только она, внешний каркас остаётся как на ПК
  const stageBody =
    viewportScale.scaleMode === 'inner' ? (
      <div className="character-inner-scale-lock">
        <div
          className="character-scale-canvas character-scale-canvas--inner"
          style={{
            width: `${viewportScale.canvasWidth}px`,
            height: `${viewportScale.canvasHeight}px`,
            transform: `scale(${viewportScale.scale})`,
          }}
        >
          <Outlet />
        </div>
      </div>
    ) : (
      <Outlet />
    );

  const viewfinderContent = (
    <FilmStripFrame
      sectionLabel="Техническое задание — видоискатель"
      navTabs={heroData.navTabs}
      activeTabId={activeTabId}
    >
      <div className="viewfinder-route-stage">{stageBody}</div>
    </FilmStripFrame>
  );

  // Для «О персонаже»: портретная заглушка + либо полный масштаб на телефоне, либо ПК-каркас на планшете/ПК
  return (
    <div
      className={`character-orientation-guard ${
        viewportScale.isPortraitBlocked ? 'character-orientation-guard--portrait' : ''
      } ${viewportScale.scaleMode !== 'full' ? 'character-shell-pc' : ''}`}
    >
      <RotateDeviceOverlay />

      {viewportScale.scaleMode === 'full' ? (
        <div className="character-scale-lock">
          <div
            className="character-scale-canvas character-scale-canvas--active"
            style={{
              width: `${viewportScale.canvasWidth}px`,
              height: `${viewportScale.canvasHeight}px`,
              transform: `scale(${viewportScale.scale})`,
            }}
          >
            {viewfinderContent}
          </div>
        </div>
      ) : (
        viewfinderContent
      )}
    </div>
  );
}
