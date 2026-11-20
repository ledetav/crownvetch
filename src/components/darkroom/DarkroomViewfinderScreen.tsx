/**
 * Переиспользуемый полноэкранный контейнер видоискателя.
 * Объединяет рамку киноплёнки, липкую верхнюю панель, счётчик REC,
 * досье персонажа ВЯЗЕЛЬ, сцену фотолаборатории и оверлей поворота экрана.
 * Используется на маршруте /game.
 */
import { useState } from 'react';
import { getTzHeroDataset } from '../../services/projectDataStore';
import { CharacterDossier } from './CharacterDossier';
import { DarkroomVisualStage } from './DarkroomVisualStage';
import { ExternalResourceMenu } from './ExternalResourceMenu';
import { FilmStripFrame } from './FilmStripFrame';
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
  /** Уровень заголовка для композиции ВЯЗЕЛЬ */
  headingLevel?: 'h1' | 'h2';
}

/**
 * Рендерит полноэкранный видоискатель со всеми элементами сцены.
 * @param props Параметры активного пункта меню, якоря и оверлея.
 * @returns JSX-разметка полноэкранного видоискателя.
 */
export function DarkroomViewfinderScreen({
  initialTabId,
  sectionId,
  sectionLabel,
  showOrientationOverlay = false,
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
          <CharacterDossier
            primaryWord={heroData.primaryWord}
            secondaryWord={heroData.secondaryWord}
            dossierHeading={heroData.dossierHeading}
            dossierBody={heroData.dossierBody}
            headingLevel={headingLevel}
          />

          <DarkroomVisualStage
            artworkSrc={heroData.characterArtworkSrc}
            artworks={heroData.characterArtworks}
            isStageActive
            altText={`${heroData.primaryWord} (${heroData.secondaryWord}) — персонаж`}
          />

          <ExternalResourceMenu links={heroData.externalLinks} />
        </div>
      </FilmStripFrame>
    </>
  );
}
