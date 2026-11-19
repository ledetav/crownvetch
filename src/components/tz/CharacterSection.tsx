/**
 * Секция «О персонаже» на маршруте /tz/character.
 * Отображает 3-колоночную композицию: досье ВЯЗЕЛЬ слева, сменяемый арт персонажа
 * с контурной обводкой и тенью в центре и вертикальное меню внешних ресурсов справа.
 */
import type { TzHeroDataset } from '../../types/project';
import { CharacterDossier } from '../darkroom/CharacterDossier';
import { DarkroomVisualStage } from '../darkroom/DarkroomVisualStage';
import { ExternalResourceMenu } from '../darkroom/ExternalResourceMenu';

/** Входные свойства секции «О персонаже» */
export interface CharacterSectionProps {
  /** Конфигурация контента видоискателя из tzHero.json */
  heroData: TzHeroDataset;
  /** Признак активности сцены (по умолчанию true на выделенном маршруте) */
  isActive?: boolean;
}

/**
 * Рендерит содержимое маршрута /tz/character внутри рамки видоискателя.
 * @param props Данные секции и флаг активности галереи артов.
 * @returns JSX-разметка раздела «О персонаже».
 */
export function CharacterSection({ heroData, isActive = true }: CharacterSectionProps) {
  return (
    <section
      data-section="character"
      className="viewfinder-slide viewfinder-slide--active"
      aria-label="Секция: О персонаже"
    >
      <div className="viewfinder-frame">
        <CharacterDossier
          primaryWord={heroData.primaryWord}
          secondaryWord={heroData.secondaryWord}
          dossierHeading={heroData.dossierHeading}
          dossierBody={heroData.dossierBody}
          headingLevel="h1"
        />

        <DarkroomVisualStage
          artworkSrc={heroData.characterArtworkSrc}
          artworks={heroData.characterArtworks}
          isStageActive={isActive}
          altText={`${heroData.primaryWord} (${heroData.secondaryWord}) — персонаж`}
        />

        <ExternalResourceMenu links={heroData.externalLinks} />
      </div>
    </section>
  );
}
