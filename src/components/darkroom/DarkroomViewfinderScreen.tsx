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
  /** HTML-идентификатор секции для якорных переходов */
  sectionId?: string;
  /** Доступное имя секции для скринридеров */
  sectionLabel?: string;
  /** Нужно ли рендерить оверлей поворота устройства (отключается у дублирующих секций) */
  showOrientationOverlay?: boolean;
  /** Уровень заголовка для композиции OVERTHINK */
  headingLevel?: 'h1' | 'h2';
}

/**
 * Рендерит полноэкранный видоискатель со всеми интерактивными элементами.
 * @param props Параметры активного пункта меню, якоря и оверлея.
 * @returns JSX-разметка полноэкранного видоискателя.
 */
export function DarkroomViewfinderScreen({
  initialTabId,
  sectionId,
  sectionLabel,
  showOrientationOverlay = true,
  headingLevel = 'h1',
}: DarkroomViewfinderScreenProps) {
  const heroData = getTzHeroDataset();

  const resolvedDefaultTab =
    initialTabId ??
    heroData.navTabs.find((tab) => tab.highlighted)?.id ??
    heroData.navTabs[0]?.id ??
    'character';

  const [activeTabId, setActiveTabId] = useState<string>(resolvedDefaultTab);

  // При наличии sectionId секция всегда подсвечивает собственный пункт меню
  const effectiveActiveTabId = sectionId ? resolvedDefaultTab : activeTabId;

  return (
    <>
      {showOrientationOverlay ? <RotateDeviceOverlay /> : null}
      <FilmStripFrame
        sectionId={sectionId}
        sectionLabel={sectionLabel}
        navTabs={heroData.navTabs}
        activeTabId={effectiveActiveTabId}
        onSelectTab={(tab) => {
          if (!sectionId) {
            setActiveTabId(tab.id);
          }
        }}
      >
        <div className="viewfinder-frame">
          <GlitchTypography
            topQuote={heroData.topQuote}
            bottomQuote={heroData.bottomQuote}
            primaryWord={heroData.primaryWord}
            verticalWord={heroData.verticalWord}
            crossWord={heroData.crossWord}
            headingLevel={headingLevel}
          />

          <PolaroidVortex polaroids={heroData.polaroids} />
        </div>
      </FilmStripFrame>
    </>
  );
}
