/**
 * Точка входа клиентского приложения crownvetch.
 * Инициализирует корневой React-рендер и подключает глобальные стили.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/global.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Не найден корневой DOM-элемент #root в index.html');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
