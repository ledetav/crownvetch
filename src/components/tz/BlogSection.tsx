/**
 * Секция «О блоге» внутри горизонтального слайдера страницы ТЗ (/tz#blog).
 * На текущем этапе копирует внутреннее наполнение секции «О персонаже»
 * для последующей кастомизации контента.
 */
import { GlitchTypography } from '../darkroom/GlitchTypography';
import { PolaroidVortex } from '../darkroom/PolaroidVortex';
import type { TzSectionSlideProps } from './CharacterSection';

/**
 * Рендерит внутреннее содержимое секции «О блоге» для горизонтального слайдера.
 * @param props Данные секции и флаг активности слайда.
 * @returns JSX-разметка слайда #blog.
 */
export function BlogSection({ heroData, isActive }: TzSectionSlideProps) {
  return (
    <section
      data-section="blog"
      className={`viewfinder-slide ${isActive ? 'viewfinder-slide--active' : 'viewfinder-slide--inactive'}`}
      aria-label="Секция: О блоге"
      aria-hidden={!isActive}
    >
      <div className="viewfinder-frame">
        <GlitchTypography
          topQuote={heroData.topQuote}
          bottomQuote={heroData.bottomQuote}
          primaryWord={heroData.primaryWord}
          verticalWord={heroData.verticalWord}
          crossWord={heroData.crossWord}
          headingLevel="h2"
        />

        <PolaroidVortex polaroids={heroData.polaroids} />
      </div>
    </section>
  );
}
