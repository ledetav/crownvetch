/**
 * Страница технического задания (/tz).
 * Объединяет три полноэкранные якорные секции («О персонаже», «О владельце»,
 * «О блоге») с переходом по внутреннему меню видоискателя.
 */
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BlogSection } from '../components/tz/BlogSection';
import { CharacterSection } from '../components/tz/CharacterSection';
import { OwnerSection } from '../components/tz/OwnerSection';

/**
 * Отрисовывает главную страницу ТЗ с тремя якорными секциями.
 * @returns JSX-разметка страницы технического задания.
 */
export function TzPage() {
  const { hash } = useLocation();

  useEffect(() => {
    document.title = 'OVERTHINK // VORTEX — Техническое задание';
  }, []);

  useEffect(() => {
    if (!hash) {
      return;
    }

    // При переходе на /tz#<anchor> со стороннего маршрута прокручиваем к нужной секции
    const targetId = hash.slice(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [hash]);

  return (
    <>
      <CharacterSection />
      <OwnerSection />
      <BlogSection />
    </>
  );
}
