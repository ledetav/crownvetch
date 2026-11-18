/**
 * Переиспользуемый полноэкранный контейнер видоискателя.
 * Объединяет рамку киноплёнки, верхние уголки камеры, счётчик REC,
 * анимированную глитч-типографику OVERTHINK / VORTEX, вращающуюся орбиту полароидов
 * и оверлей поворота экрана.
 * Используется на маршрутах /tz и /game.
 */
import { useState } from 'react';
import { getTzHeroDataset } from '../../services/projectDataStore';
import { FilmStripFrame } from './FilmStripFrame';
import { GlitchTypography } from './GlitchTypography';
import { PolaroidVortex } from './PolaroidVortex';
import { RotateDeviceOverlay } from './RotateDeviceOverlay';
import '../../styles/darkroomHero.css';

/** Входные свойства полноэкранного видоискателя */
interface DarkroomViewfinderScreenProps {
  /** Идентификатор таба, подсвеченного жёлтой рамкой по умолчанию */
  initialTabId?: string;
}

/**
 * Рендерит полноэкранный видоискатель со всеми интерактивными элементами.
 * @param props Необязательный идентификатор активного пункта навигации.
 * @returns JSX-разметка полноэкранного видоискателя.
 */
export function DarkroomViewfinderScreen({ initialTabId }: DarkroomViewfinderScreenProps) {
  const heroData = getTzHeroDataset();

  const resolvedDefaultTab =
    initialTabId ??
    heroData.navTabs.find((tab) => tab.highlighted)?.id ??
    heroData.navTabs[0]?.id ??
    'archive';

  const [activeTabId, setActiveTabId] = useState<string>(resolvedDefaultTab);

  return (
    <>
      <RotateDeviceOverlay />
      <FilmStripFrame
        navTabs={heroData.navTabs}
        activeTabId={activeTabId}
        onSelectTab={(tab) => setActiveTabId(tab.id)}
      >
        <GlitchTypography
          topQuote={heroData.topQuote}
          bottomQuote={heroData.bottomQuote}
          primaryWord={heroData.primaryWord}
          verticalWord={heroData.verticalWord}
          crossWord={heroData.crossWord}
        />

        <PolaroidVortex polaroids={heroData.polaroids} />
      </FilmStripFrame>
    </>
  );
}
