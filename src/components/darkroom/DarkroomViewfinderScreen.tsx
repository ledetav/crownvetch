/**
 * Переиспользуемый полноэкранный контейнер видоискателя.
 * Объединяет рамку киноплёнки, анимированную глитч-типографику OVERTHINK / VORTEX,
 * вращающуюся орбиту полароидов, правую телеметрическую панель с управлением PLAY / REVERSE
 * и перекрывающее окно поворота экрана для узких мобильных устройств.
 * Используется на маршрутах /tz и /game.
 */
import { useState } from 'react';
import { getTzHeroDataset } from '../../services/projectDataStore';
import { DarkroomTelemetryPanel } from './DarkroomTelemetryPanel';
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
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isReversed, setIsReversed] = useState<boolean>(false);

  return (
    <>
      <RotateDeviceOverlay />
      <FilmStripFrame
        navTabs={heroData.navTabs}
        activeTabId={activeTabId}
        onSelectTab={(tab) => setActiveTabId(tab.id)}
      >
        <GlitchTypography
          recTimecode={heroData.recTimecode}
          topQuote={heroData.topQuote}
          bottomQuote={heroData.bottomQuote}
          primaryWord={heroData.primaryWord}
          verticalWord={heroData.verticalWord}
          crossWord={heroData.crossWord}
        />

        <PolaroidVortex
          polaroids={heroData.polaroids}
          isPlaying={isPlaying}
          isReversed={isReversed}
        />

        <DarkroomTelemetryPanel
          telemetry={heroData.telemetry}
          isPlaying={isPlaying}
          isReversed={isReversed}
          onTogglePlay={() => setIsPlaying((prev) => !prev)}
          onToggleReverse={() => setIsReversed((prev) => !prev)}
        />
      </FilmStripFrame>
    </>
  );
}
