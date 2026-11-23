/**
 * Корневой компонент маршрутизации SPA-приложения crownvetch.
 * Настраивает обычные URL-маршруты без якорных ссылок:
 * /tz/character, /tz/owner, отдельный раздел /tz/blog/* и /game.
 */
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { BlogActsSection } from './components/tz/BlogActsSection';
import { BlogHeaderSection } from './components/tz/BlogHeaderSection';
import { BlogOverviewSection } from './components/tz/BlogOverviewSection';
import { BlogSection } from './components/tz/BlogSection';
import { CharacterSection } from './components/tz/CharacterSection';
import { OwnerSection } from './components/tz/OwnerSection';
import { BlogPage } from './pages/BlogPage';
import { GamePlaceholderPage } from './pages/GamePlaceholderPage';
import { TzPage } from './pages/TzPage';
import { getTzHeroDataset } from './services/projectDataStore';

/**
 * Определяет корневой роутер приложения crownvetch.
 * @returns Корневое дерево маршрутизации React.
 */
export function App() {
  const heroData = getTzHeroDataset();

  return (
    <BrowserRouter>
      <div className="app-shell">
        <main className="app-content">
          <Routes>
            {/* Корневой адрес и базовый /tz перенаправляют на страницу персонажа */}
            <Route path="/" element={<Navigate to="/tz/character" replace />} />
            <Route path="/tz" element={<TzPage />}>
              <Route index element={<Navigate to="/tz/character" replace />} />
              <Route path="character" element={<CharacterSection heroData={heroData} />} />
              <Route path="owner" element={<OwnerSection />} />
            </Route>
            <Route path="/tz/blog" element={<BlogPage />}>
              <Route index element={<Navigate to="/tz/blog/overview" replace />} />
              <Route path="overview" element={<BlogOverviewSection />} />
              <Route
                path="characters"
                element={<BlogSection sectionId="characters" title="Персонажи" />}
              />
              <Route path="palette" element={<BlogSection sectionId="palette" title="Палитра" />} />
              <Route path="header" element={<BlogHeaderSection />} />
              <Route path="acts" element={<BlogActsSection />} />
            </Route>
            <Route path="/game" element={<GamePlaceholderPage />} />
            {/* Любые неизвестные маршруты ведут на страницу персонажа */}
            <Route path="*" element={<Navigate to="/tz/character" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
