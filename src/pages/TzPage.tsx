/**
 * Страница технического задания (/tz).
 * Первый экран построен как интерактивный видоискатель PARADOX // DARKROOM
 * с перфорацией киноплёнки, живой глитч-типографикой и вращающейся орбитой полароидов.
 * Ниже расположены секции спецификации, палитры и модулей из JSON-базы.
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { DarkroomTelemetryPanel } from '../components/darkroom/DarkroomTelemetryPanel';
import { FilmStripFrame } from '../components/darkroom/FilmStripFrame';
import { GlitchTypography } from '../components/darkroom/GlitchTypography';
import { PolaroidVortex } from '../components/darkroom/PolaroidVortex';
import { InteractivePalette } from '../components/InteractivePalette';
import {
  getAllModules,
  getPaletteDataset,
  getTzHeroDataset,
} from '../services/projectDataStore';
import '../styles/darkroomHero.css';

/**
 * Отрисовывает полную страницу /tz: стартовый экран-видоискатель и нижние секции ТЗ.
 * @returns JSX-разметка страницы технического задания.
 */
export function TzPage() {
  const heroData = getTzHeroDataset();
  const palette = getPaletteDataset();
  const modules = getAllModules();

  const defaultTab =
    heroData.navTabs.find((tab) => tab.highlighted)?.id ?? heroData.navTabs[0]?.id ?? 'archive';

  const [activeTabId, setActiveTabId] = useState<string>(defaultTab);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isReversed, setIsReversed] = useState<boolean>(false);

  useEffect(() => {
    document.title = 'PARADOX // DARKROOM — Техническое задание';
  }, []);

  return (
    <div>
      {/* Первый экран: видоискатель с перфорацией, глитчами и вращающейся орбитой */}
      <FilmStripFrame
        brandTitle={heroData.brandTitle}
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

      {/* Нижние секции ТЗ, куда ведут пункты ARCHIVE / GLITCH PLAYERS / ABOUT */}
      <div className="app-main">
        <section id="section-custom" className="section-block" aria-label="Кастомная область ТЗ">
          <div className="section-block__header">
            <h2 className="section-block__title">ARCHIVE // Структура ТЗ и концепт</h2>
            <span className="section-block__hint">src/data/tzHero.json</span>
          </div>
          <div className="custom-slot">
            <strong>Кастомный блок ТЗ:</strong> стартовый экран-видоискатель
            подключён к <code>src/data/tzHero.json</code>. Сюда ниже можно
            добавлять карточки персонажей, лор-досье, раскадровки и описание
            механик. Чтобы подставить свои арты в крутящиеся полароиды, достаточно
            указать поле <code>imageUrl</code> у нужного кадра в <code>tzHero.json</code>.
          </div>
        </section>

        <section id="section-modules" className="section-block" aria-labelledby="modules-heading">
          <div className="section-block__header">
            <h2 id="modules-heading" className="section-block__title">
              GLITCH PLAYERS // Подключаемые модули и задания
            </h2>
            <span className="section-block__hint">src/data/modules.json</span>
          </div>

          <div className="modules-grid">
            {modules.map((mod) => (
              <article key={mod.id} className="module-card">
                <div className="module-card__top">
                  <span
                    className={`module-badge ${
                      mod.enabled ? 'module-badge--active' : ''
                    }`}
                  >
                    {mod.enabled ? 'Подключён' : 'В резерве'}
                  </span>
                  <span className="section-block__hint">{mod.id}</span>
                </div>
                <h3 className="module-card__title">{mod.title}</h3>
                <p className="module-card__summary">{mod.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="section-palette" className="section-block" aria-labelledby="palette-heading">
          <div className="section-block__header">
            <h2 id="palette-heading" className="section-block__title">
              ABOUT // Палитра проекта ({palette.themeTitle})
            </h2>
            <span className="section-block__hint">src/data/palette.json</span>
          </div>
          <InteractivePalette swatches={palette.swatches} />
        </section>

        <section className="section-block">
          <Link to="/game" className="btn-primary">
            <span>DIVE IN — Перейти к заглушке новеллы (/game)</span>
            <ArrowRight size={16} />
          </Link>
        </section>
      </div>
    </div>
  );
}
