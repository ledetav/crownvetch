/**
 * Страница технического задания (/tz).
 * Предоставляет базовый каркас для кастомной вёрстки ТЗ и подключает
 * данные из JSON-хранилища (палитра и конфигурация модулей-заданий).
 */
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers } from 'lucide-react';
import { InteractivePalette } from '../components/InteractivePalette';
import { getAllModules, getPaletteDataset } from '../services/projectDataStore';

/**
 * Отрисовывает страницу ТЗ с подключёнными JSON-блоками и слотом под кастомную вёрстку.
 * @returns JSX-разметка страницы /tz.
 */
export function TzPage() {
  const palette = getPaletteDataset();
  const modules = getAllModules();

  useEffect(() => {
    document.title = 'CROWNVETCH // Техническое задание';
  }, []);

  return (
    <div>
      <section className="page-hero">
        <div className="page-hero__eyebrow">
          <Layers size={14} />
          <span>Спецификация проекта · /tz</span>
        </div>
        <h1 className="page-hero__title">Техническое задание: CROWNVETCH</h1>
        <p className="page-hero__subtitle">
          Каркас страницы для кастомной вёрстки ТЗ. Данные палитры, сценария и
          подключаемых модулей-заданий вынесены в JSON-базу в{' '}
          <code>src/data/</code>, чтобы их можно было переиспользовать и в ТЗ,
          и в самой визуальной новелле.
        </p>
      </section>

      <section className="section-block" aria-label="Кастомная область ТЗ">
        <div className="custom-slot">
          <strong>Слот для кастомной структуры ТЗ:</strong> здесь можно
          свободно собирать любые авторские секции, карточки персонажей,
          блоки артов и интерактивные элементы.
        </div>
      </section>

      <section className="section-block" aria-labelledby="palette-heading">
        <div className="section-block__header">
          <h2 id="palette-heading" className="section-block__title">
            Палитра проекта ({palette.themeTitle})
          </h2>
          <span className="section-block__hint">src/data/palette.json</span>
        </div>
        <InteractivePalette swatches={palette.swatches} />
      </section>

      <section className="section-block" aria-labelledby="modules-heading">
        <div className="section-block__header">
          <h2 id="modules-heading" className="section-block__title">
            Подключаемые модули и задания
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

      <section className="section-block">
        <Link to="/game" className="btn-primary">
          <span>Перейти к заглушке игры (/game)</span>
          <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}
