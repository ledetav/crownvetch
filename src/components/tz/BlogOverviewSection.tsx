/**
 * Секция «Общая информация» внутри отдельной страницы «О блоге» (/tz/blog/overview).
 * Отображает заголовок со световыми прострелами, переключатель двух отдельных
 * внутренних вкладок («Аннотация» и «Таблица готовности») и содержимое активной вкладки.
 */
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getTzBlogOverviewDataset } from '../../services/projectDataStore';
import { BlogAnnotationBlock } from './BlogAnnotationBlock';
import { BlogOverviewSubnav } from './BlogOverviewSubnav';
import { BlogReadinessTable } from './BlogReadinessTable';

/**
 * Определяет активную внутреннюю вкладку по хэшу адресной строки (#annotation | #readiness).
 * @param hash Текущий хэш URL.
 * @returns Идентификатор активной вкладки.
 */
function resolveOverviewTabFromHash(hash: string): 'annotation' | 'readiness' {
  return hash === '#readiness' ? 'readiness' : 'annotation';
}

/**
 * Отрисовывает содержимое вкладки «Общая информация» с раздельной сменой
 * вкладок «Аннотация» и «Таблица готовности».
 * @returns JSX-разметка страницы /tz/blog/overview.
 */
export function BlogOverviewSection() {
  const { hash } = useLocation();
  const overviewData = getTzBlogOverviewDataset();
  const [activeTab, setActiveTab] = useState<'annotation' | 'readiness'>(() =>
    resolveOverviewTabFromHash(hash),
  );

  useEffect(() => {
    if (hash === '#annotation' || hash === '#readiness') {
      setActiveTab(hash.slice(1) as 'annotation' | 'readiness');
    }
  }, [hash]);

  return (
    <section
      data-section="blog-overview"
      className="viewfinder-slide viewfinder-slide--active"
      aria-label="О блоге: Общая информация"
    >
      <div className="blog-overview-frame">
        <div className="blog-overview-header">
          <div className="dossier-headline-block">
            <div className="vyazel-wrapper">
              <div className="vyazel-ribbon" aria-hidden="true">
                <span className="vyazel-streak vyazel-streak--1" />
                <span className="vyazel-streak vyazel-streak--2" />
                <span className="vyazel-streak vyazel-streak--3" />
              </div>
              <h1 className="serif-vyazel serif-vyazel--blog">{overviewData.primaryWord}</h1>
            </div>
            <p className="dossier-secondary-word">{overviewData.secondaryWord}</p>
          </div>

          <BlogOverviewSubnav
            tabs={overviewData.microTabs}
            activeId={activeTab}
            onSelect={setActiveTab}
          />
        </div>

        {activeTab === 'annotation' ? (
          <BlogAnnotationBlock body={overviewData.annotationBody} />
        ) : (
          <BlogReadinessTable
            heading={overviewData.readinessHeading}
            note={overviewData.readinessNote}
            initialActs={overviewData.acts}
          />
        )}
      </div>
    </section>
  );
}
