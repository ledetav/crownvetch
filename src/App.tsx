/**
 * Корневой компонент маршрутизации SPA-приложения crownvetch.
 * Настраивает редирект с корневого маршрута '/' на '/tz',
 * а также отдельные маршруты '/tz' (ТЗ) и '/game' (заглушка игры).
 */
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppHeader } from './components/AppHeader';
import { GamePlaceholderPage } from './pages/GamePlaceholderPage';
import { TzPage } from './pages/TzPage';

/**
 * Определяет карту маршрутов приложения и общую оболочку интерфейса.
 * @returns Корневое дерево маршрутизации React.
 */
export function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <AppHeader />
        <main className="app-main">
          <Routes>
            {/* Корневой адрес временно перенаправляет на страницу ТЗ */}
            <Route path="/" element={<Navigate to="/tz" replace />} />
            <Route path="/tz" element={<TzPage />} />
            <Route path="/game" element={<GamePlaceholderPage />} />
            {/* Любые неизвестные маршруты также ведут на ТЗ */}
            <Route path="*" element={<Navigate to="/tz" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
