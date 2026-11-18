/**
 * Страница технического задания (/tz).
 * Удерживает неподвижную оболочку видоискателя (перфорация плёнки, уголки камеры,
 * счётчик ● REC и верхнее меню) и горизонтально переключает внутреннее наполнение
 * разделов «О персонаже», «О владельце» и «О блоге».
 */
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FilmStripFrame } from '../components/darkroom/FilmStripFrame';
import { RotateDeviceOverlay } from '../components/darkroom/RotateDeviceOverlay';
import { BlogSection } from '../components/tz/BlogSection';
import { CharacterSection } from '../components/tz/CharacterSection';
import { OwnerSection } from '../components/tz/OwnerSection';
import { getTzHeroDataset } from '../services/projectDataStore';
import '../styles/darkroomHero.css';

/**
 * Определяет идентификатор активной вкладки по хэшу URL или дефолтному пункту меню.
 * @param hash Текущий хэш адресной строки (#character | #owner | #blog).
 * @param validIds Список допустимых идентификаторов вкладок.
 * @param fallbackId Значение по умолчанию, если хэш не задан или неизвестен.
 * @returns Валидный идентификатор активного раздела.
 */
function resolveTabFromHash(hash: string, validIds: string[], fallbackId: string): string {
  const normalized = hash.replace(/^#/, '');
  return validIds.includes(normalized) ? normalized : fallbackId;
}

/**
 * Отрисовывает главную страницу ТЗ с неподвижной рамкой видоискателя
 * и горизонтальной сменой секций.
 * @returns JSX-разметка страницы технического задания.
 */
export function TzPage() {
  const { hash } = useLocation();
  const heroData = getTzHeroDataset();

  const validTabIds = heroData.navTabs.map((tab) => tab.id);
  const defaultTabId =
    heroData.navTabs.find((tab) => tab.highlighted)?.id ?? heroData.navTabs[0]?.id ?? 'character';

  const [activeTabId, setActiveTabId] = useState<string>(() =>
    resolveTabFromHash(hash, validTabIds, defaultTabId),
  );

  useEffect(() => {
    document.title = 'OVERTHINK // VORTEX — Техническое задание';
  }, []);

  useEffect(() => {
    if (!hash) {
      return;
    }

    // Синхронизируем активный слайд только при изменении React Router hash
    const data = getTzHeroDataset();
    const ids = data.navTabs.map((tab) => tab.id);
    const fallback = data.navTabs.find((tab) => tab.highlighted)?.id ?? data.navTabs[0]?.id ?? 'character';
    setActiveTabId(resolveTabFromHash(hash, ids, fallback));
  }, [hash]);

  const activeIndex = Math.max(0, heroData.navTabs.findIndex((tab) => tab.id === activeTabId));

  return (
    <>
      <RotateDeviceOverlay />
      <FilmStripFrame
        sectionLabel="Техническое задание — видоискатель"
        navTabs={heroData.navTabs}
        activeTabId={activeTabId}
        onSelectTab={(tab) => setActiveTabId(tab.id)}
      >
        <div className="viewfinder-carousel">
          <div
            className="viewfinder-carousel__track"
            style={{ transform: `translate3d(-${activeIndex * 100}%, 0, 0)` }}
          >
            <CharacterSection heroData={heroData} isActive={activeTabId === 'character'} />
            <OwnerSection heroData={heroData} isActive={activeTabId === 'owner'} />
            <BlogSection heroData={heroData} isActive={activeTabId === 'blog'} />
          </div>
        </div>
      </FilmStripFrame>
    </>
  );
}
