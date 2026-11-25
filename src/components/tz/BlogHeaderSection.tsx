/**
 * Секция «Шапка» внутри отдельной страницы «О блоге» (/tz/blog/header).
 * Отображает заголовок «ШАПКА» со световыми прострелами, текстовое описание
 * сборной композиции со встроенными ссылками на карточки персонажей
 * (/tz/blog/characters#ancestor и /tz/blog/characters#vyazel) и блок
 * композиционного скетча с просмотром в полном размере (лайтбоксом).
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getTzBlogHeaderDataset } from '../../services/projectDataStore';
import { resolveAssetUrl } from '../../utils/assetUrl';
import { BlogImageLightbox } from './BlogImageLightbox';

/**
 * Отрисовывает страницу «О блоге → Шапка» с описанием композиции,
 * ссылками на персонажей и интерактивным просмотром скетча.
 * @returns JSX-разметка раздела /tz/blog/header.
 */
export function BlogHeaderSection() {
  const headerData = getTzBlogHeaderDataset();
  // Приводим путь скетча к текущему BASE_URL (для работы в подпапке GitHub Pages)
  const resolvedSketchSrc = resolveAssetUrl(headerData.sketch.src);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isSketchUnavailable, setIsSketchUnavailable] = useState(false);

  return (
    <section
      data-section="blog-header"
      className="viewfinder-slide viewfinder-slide--active"
      aria-label="О блоге: Шапка"
    >
      <div className="blog-overview-frame">
        <div className="blog-acts-header">
          <div className="dossier-headline-block">
            <div className="vyazel-wrapper">
              <div className="vyazel-ribbon" aria-hidden="true">
                <span className="vyazel-streak vyazel-streak--1" />
                <span className="vyazel-streak vyazel-streak--2" />
                <span className="vyazel-streak vyazel-streak--3" />
              </div>
              <h1 className="serif-vyazel serif-vyazel--blog">{headerData.primaryWord}</h1>
            </div>
            <p className="dossier-secondary-word">{headerData.secondaryWord}</p>
          </div>
        </div>

        {/* Основная рабочая панель ТЗ по шапке */}
        <section
          id="blog-header-spec"
          className="blog-readiness-panel blog-header-panel"
          aria-labelledby="blog-header-heading"
        >
          <div className="blog-readiness-head">
            <div className="blog-panel-head">
              <h2 id="blog-header-heading" className="dossier-bio__heading">
                {headerData.sectionHeading}
              </h2>
            </div>

            <Link to="/tz/blog/overview#readiness" className="blog-tz-link">
              <span>Таблица готовности</span>
              <span aria-hidden="true">↗</span>
            </Link>
          </div>

          {/* Текстовое описание со встроенными ссылками на конкретных персонажей */}
          <div className="blog-header-description">
            <p className="blog-header-description__text">
              {headerData.descriptionSegments.map((segment, index) => {
                if (segment.kind === 'link') {
                  return (
                    <Link
                      key={`header-link-${index}`}
                      to={segment.target}
                      className="blog-inline-character-link"
                    >
                      <span>{segment.text}</span>
                      <span className="blog-inline-character-link__arrow" aria-hidden="true">
                        ↗
                      </span>
                    </Link>
                  );
                }

                return <span key={`header-text-${index}`}>{segment.text}</span>;
              })}
            </p>
          </div>

          {/* Композиционный скетч шапки ниже текстового описания */}
          <div className="blog-header-sketch" aria-label={headerData.sketch.title}>
            <div className="blog-guide-refs__head">
              <span className="blog-guide-refs__title">{headerData.sketch.title}</span>
              {!isSketchUnavailable && (
                <span className="blog-guide-refs__hint">{headerData.sketch.hint}</span>
              )}
            </div>

            {isSketchUnavailable ? (
              <div className="blog-header-sketch__fallback" role="status">
                <span className="blog-header-sketch__fallback-label">Ожидается файл скетча</span>
                <p className="blog-header-sketch__fallback-note">
                  Загрузите файл скетча по пути <code>public{headerData.sketch.src}</code>, чтобы он
                  автоматически отобразился в этой рамке.
                </p>
              </div>
            ) : (
              <figure className="blog-header-sketch__frame">
                <button
                  type="button"
                  className="blog-header-sketch__trigger"
                  onClick={() => setIsLightboxOpen(true)}
                  aria-label="Открыть скетч композиции шапки в полном размере"
                >
                  <img
                    src={resolvedSketchSrc}
                    alt={headerData.sketch.alt}
                    className="blog-header-sketch__img"
                    onError={() => setIsSketchUnavailable(true)}
                  />
                </button>
              </figure>
            )}
          </div>
        </section>
      </div>

      <BlogImageLightbox
        src={isLightboxOpen && !isSketchUnavailable ? headerData.sketch.src : null}
        alt={headerData.sketch.alt}
        dialogAriaLabel="Просмотр скетча шапки в полном размере"
        closeAriaLabel="Закрыть просмотр скетча"
        onClose={() => setIsLightboxOpen(false)}
      />
    </section>
  );
}
