/**
 * Хук пропорционального масштабирования экрана «О персонаже» (/tz/character).
 * Отслеживает геометрию вьюпорта (resize, orientationchange, visualViewport):
 * - определяет портретную ориентацию мобильных и планшетов (ширина <= высоты при width <= 1180px),
 *   при которой раздел скрывается за заглушкой поворота устройства;
 * - на планшетах и компактных горизонтальных экранах (выше телефонного порога 932x520)
 *   оставляет внешний каркас видоискателя (меню, уголки, ● REC, перфорация) в 100% ПК-размере
 *   и масштабирует только внутреннюю анкету/сцену персонажа (scaleMode: 'inner');
 * - на экранах телефонов в горизонтальном положении (width <= 932 или height <= 520)
 *   равномерно уменьшает всю сцену целиком вместе с внешним каркасом (scaleMode: 'full').
 */
import { useEffect, useState } from 'react';

/** Базовая ширина ПК-сцены целиком (с перфорацией и отступами) */
const BASE_DESKTOP_WIDTH = 1360;
/** Базовая высота ПК-сцены целиком */
const BASE_DESKTOP_HEIGHT = 760;
/** Суммарный горизонтальный отступ внешнего ПК-каркаса (2*50px перфорация + 2*34px stage + 2*20px shell) */
const OUTER_SHELL_HORIZONTAL_PX = 208;
/** Суммарный вертикальный отступ внешнего ПК-каркаса (липкая шапка + нижний отступ) */
const OUTER_SHELL_VERTICAL_PX = 104;
/** Эталонная ширина внутренней 3-колоночной сцены анкеты персонажа */
const INNER_BASE_WIDTH = BASE_DESKTOP_WIDTH - OUTER_SHELL_HORIZONTAL_PX;
/** Эталонная высота внутренней 3-колоночной сцены анкеты персонажа */
const INNER_BASE_HEIGHT = BASE_DESKTOP_HEIGHT - OUTER_SHELL_VERTICAL_PX;
/** Максимальная ширина, при которой портретная ориентация (телефоны и планшеты) блокируется заглушкой */
const PORTRAIT_GUARD_MAX_WIDTH = 1180;
/** Порог размеров альбомного телефона, ниже которого уменьшается и внешний каркас видоискателя */
const PHONE_LANDSCAPE_MAX_WIDTH = 932;
const PHONE_LANDSCAPE_MAX_HEIGHT = 520;

/** Режим масштабирования страницы «О персонаже» */
export type CharacterScaleMode = 'none' | 'inner' | 'full';

/** Параметры состояния ориентации и пропорционального масштаба вьюпорта */
export interface CharacterViewportScaleState {
  /** True, если устройство находится в вертикальной ориентации (большая сторона не горизонтально) */
  isPortraitBlocked: boolean;
  /** Режим масштабирования: 'none' (ПК 1:1), 'inner' (только анкета, каркас как на ПК), 'full' (телефон целиком) */
  scaleMode: CharacterScaleMode;
  /** Коэффициент равномерного масштабирования (0 < scale <= 1) */
  scale: number;
  /** Виртуальная ширина масштабируемого холста (в пикселях) */
  canvasWidth: number;
  /** Виртуальная высота масштабируемого холста (в пикселях) */
  canvasHeight: number;
}

/**
 * Рассчитывает текущее состояние ориентации и режим масштабирования по размерам окна.
 * @param enabled Активен ли расчёт (true только на маршруте /tz/character).
 * @returns Параметры ориентации, режима и трансформации холста.
 */
function computeViewportScale(enabled: boolean): CharacterViewportScaleState {
  if (!enabled || typeof window === 'undefined') {
    return {
      isPortraitBlocked: false,
      scaleMode: 'none',
      scale: 1,
      canvasWidth: BASE_DESKTOP_WIDTH,
      canvasHeight: BASE_DESKTOP_HEIGHT,
    };
  }

  const vw = Math.max(window.innerWidth, 1);
  const vh = Math.max(window.innerHeight, 1);

  // Для мобильных и планшетов раздел доступен только если большая сторона расположена горизонтально
  const isPortraitBlocked = vw <= vh && vw <= PORTRAIT_GUARD_MAX_WIDTH;
  if (isPortraitBlocked) {
    return {
      isPortraitBlocked: true,
      scaleMode: 'none',
      scale: 1,
      canvasWidth: vw,
      canvasHeight: vh,
    };
  }

  // На полноразмерном десктопе рендерим нативно 1:1 без transform: scale
  if (vw >= BASE_DESKTOP_WIDTH && vh >= BASE_DESKTOP_HEIGHT) {
    return {
      isPortraitBlocked: false,
      scaleMode: 'none',
      scale: 1,
      canvasWidth: vw,
      canvasHeight: vh,
    };
  }

  // На телефонах в альбомной ориентации уменьшаем всю страницу целиком вместе с меню, уголками и перфорацией
  const isPhoneLandscape = vw <= PHONE_LANDSCAPE_MAX_WIDTH || vh <= PHONE_LANDSCAPE_MAX_HEIGHT;
  if (isPhoneLandscape) {
    const scale = Math.min(vw / BASE_DESKTOP_WIDTH, vh / BASE_DESKTOP_HEIGHT, 1);
    return {
      isPortraitBlocked: false,
      scaleMode: 'full',
      scale,
      canvasWidth: Math.ceil(vw / scale),
      canvasHeight: Math.ceil(vh / scale),
    };
  }

  // На планшетах и компактных экранах внешний каркас остаётся в ПК-размере, уменьшается только внутренняя сцена
  const availWidth = Math.max(vw - OUTER_SHELL_HORIZONTAL_PX, 320);
  const availHeight = Math.max(vh - OUTER_SHELL_VERTICAL_PX, 300);
  const scale = Math.min(availWidth / INNER_BASE_WIDTH, availHeight / INNER_BASE_HEIGHT, 1);

  return {
    isPortraitBlocked: false,
    scaleMode: 'inner',
    scale,
    canvasWidth: Math.ceil(availWidth / scale),
    canvasHeight: Math.ceil(availHeight / scale),
  };
}

/**
 * Отслеживает размеры окна и ориентацию экрана для пропорционального масштабирования /tz/character.
 * @param enabled Флаг включения расчётов (false для остальных разделов).
 * @returns Актуальные параметры блокировки портретного режима и масштаба.
 */
export function useCharacterViewportScale(enabled: boolean): CharacterViewportScaleState {
  const [state, setState] = useState<CharacterViewportScaleState>(() =>
    computeViewportScale(enabled),
  );

  useEffect(() => {
    if (!enabled) {
      setState(computeViewportScale(false));
      return;
    }

    const update = () => {
      setState(computeViewportScale(true));
    };

    update();
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    window.visualViewport?.addEventListener('resize', update);

    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
      window.visualViewport?.removeEventListener('resize', update);
    };
  }, [enabled]);

  return state;
}
