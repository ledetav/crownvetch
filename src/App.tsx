/**
 * Корневой компонент маршрутизации SPA-приложения crownvetch.
 * Управляет отображением глобальной шапки (скрывается на /tz, где встроена
 * авторская панель видоискателя PARADOX // DARKROOM) и редиректом с '/' на '/tz'.
 */
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AppHeader } from './components/AppHeader';
import { GamePlaceholderPage } from './pages/GamePlaceholderPage';
import { TzPage } from './pages/TzPage';

/**
 * Внутренняя оболочка маршрутов с условным рендером верхней навигационной панели.
 * @returns Разметка текущей страницы с нужной шапкой.
 */
function AppLayout() {
  const location = useLocation();
  const isTzRoute = location.pathname === '/tz';

  return (
    <div className="app-shell">
      {!isTzRoute && <AppHeader />}
      <div className="app-content">
        <Routes>
          {/* Корневой адрес временно перенаправляет на страницу ТЗ */}
          <Route path="/" element={<Navigate to="/tz" replace />} />
          <Route path="/tz" element={<TzPage />} />
          <Route path="/game" element={<GamePlaceholderPage />} />
          {/* Любые неизвестные маршруты также ведут на ТЗ */}
          <Route path="*" element={<Navigate to="/tz" replace />} />
        </Routes>
      </div>
    </div>
  );
}

/**
 * Определяет корневой роутер приложения crownvetch.
 * @returns Корневое дерево маршрутизации React.
 */
export function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
