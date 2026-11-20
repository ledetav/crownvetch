/**
 * Секция «Общая информация» внутри отдельной страницы «О блоге» (/tz/blog/overview).
 * Отображает заголовок со световыми прострелами и переключатель трёх внутренних вкладок
 * («Аннотация», «Памятка по работе» и «Таблица готовности») слева, общую сводку
 * до дня рождения справа, а ниже — содержимое активной вкладки.
 */
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getTzBlogOverviewDataset } from '../../services/projectDataStore';
import type { BlogOverviewMicroTab } from '../../types/project';
import { BlogAnnotationBlock } from './BlogAnnotationBlock';
import { BlogGlobalSummary } from './BlogGlobalSummary';
import { BlogOverviewSubnav } from './BlogOverviewSubnav';
import { BlogReadinessTable } from './BlogReadinessTable';
import { BlogWorkGuidePanel } from './BlogWorkGuidePanel';

type OverviewTabId = BlogOverviewMicroTab['id'];

/**
 * Определяет активную внутреннюю вкладку по хэшу адресной строки (#annotation | #guide | #readiness).
 * @param hash Текущий хэш URL.
 * @returns Идентификатор активной вкладки.
 */
function resolveOverviewTabFromHash(hash: string): OverviewTabId {
  if (hash === '#guide') {
    return 'guide';
  }
  if (hash === '#readiness') {
    return 'readiness';
  }
  return 'annotation';
}

/**
 * Отрисовывает содержимое вкладки «Общая информация» с шапкой, общей сводкой
 * и переключением между вкладками «Аннотация», «Памятка по работе» и «Таблица готовности».
 * @returns JSX-разметка страницы /tz/blog/overview.
 */
export function BlogOverviewSection() {
  const { hash } = useLocation();
  const overviewData = getTzBlogOverviewDataset();
  const [activeTab, setActiveTab] = useState<OverviewTabId>(() =>
    resolveOverviewTabFromHash(hash),
  );

  useEffect(() => {
    if (hash === '#annotation' || hash === '#guide' || hash === '#readiness') {
      setActiveTab(hash.slice(1) as OverviewTabId);
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
          <div className="blog-overview-header__left">
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

          <BlogGlobalSummary
            birthdayDate={overviewData.birthdayDate}
            sections={overviewData.readinessSections}
          />
        </div>

        {activeTab === 'annotation' && <BlogAnnotationBlock body={overviewData.annotationBody} />}

        {activeTab === 'guide' && <BlogWorkGuidePanel guide={overviewData.workGuide} />}

        {activeTab === 'readiness' && (
          <BlogReadinessTable
            heading={overviewData.readinessHeading}
            note={overviewData.readinessNote}
            sections={overviewData.readinessSections}
          />
        )}
      </div>
    </section>
  );
}
