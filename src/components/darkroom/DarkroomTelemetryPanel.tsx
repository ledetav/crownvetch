/**
 * Компонент правой телеметрической панели видоискателя.
 * Отображает чистую аудио-осциллограмму, шкалу перемотки,
 * мини-монитор проявочной комнаты и кнопки PLAY / REVERSE
 * без лишних текстовых и глитч-заглушек.
 */
import { Pause, Play, RotateCcw } from 'lucide-react';
import type { TzHeroDataset } from '../../types/project';

/** Входные свойства панели телеметрии */
interface DarkroomTelemetryPanelProps {
  /** Блок данных телеметрии из tzHero.json */
  telemetry: TzHeroDataset['telemetry'];
  /** Текущее состояние воспроизведения вращения орбиты */
  isPlaying: boolean;
  /** Текущее состояние реверса направления */
  isReversed: boolean;
  /** Переключатель паузы/воспроизведения */
  onTogglePlay: () => void;
  /** Переключатель направления вращения */
  onToggleReverse: () => void;
}

/**
 * Рендерит правую колонку видоискателя с интерактивными кнопками управления.
 * @param props Свойства панели телеметрии и обработчики управления.
 * @returns JSX-разметка правой колонки.
 */
export function DarkroomTelemetryPanel({
  telemetry,
  isPlaying,
  isReversed,
  onTogglePlay,
  onToggleReverse,
}: DarkroomTelemetryPanelProps) {
  return (
    <aside className="telemetry-column" aria-label="Телеметрия и управление вихрем">
      {/* Двухканальная аудио-волна с хроматическим сдвигом */}
      <div className="waveform-box" aria-hidden="true">
        <svg
          className={`waveform-svg ${isPlaying ? 'waveform-svg--active' : ''}`}
          viewBox="0 0 240 54"
        >
          <polyline
            className="waveform-path-cyan"
            fill="none"
            stroke="#3bc7d6"
            strokeWidth="1.6"
            points="0,27 18,27 26,20 34,34 44,12 52,44 60,18 68,36 78,24 88,29 98,10 106,46 114,6 122,49 130,15 138,38 148,19 156,33 166,22 176,30 186,16 196,35 206,24 218,27 240,27"
          />
          <polyline
            className="waveform-path-red"
            fill="none"
            stroke="#d63638"
            strokeWidth="1.4"
            opacity="0.85"
            points="2,28 20,28 28,23 36,32 46,15 54,41 62,21 70,34 80,25 90,28 100,13 108,43 116,9 124,46 132,18 140,36 150,21 158,31 168,24 178,29 188,19 198,33 208,26 220,28 240,28"
          />
        </svg>
      </div>

      {/* Шкала перемотки и таймкод -00:03:45 */}
      <div className="scrubber-row">
        <div className="scrubber-track" aria-hidden="true">
          <div className="scrubber-track__fill" />
          <div className="scrubber-track__thumb" />
        </div>
        <span className="scrubber-time">{telemetry.negativeTimecode}</span>
      </div>

      {/* Превью проявочного экрана с полароидом */}
      <div className="darkroom-monitor-preview" aria-hidden="true">
        <div className="darkroom-monitor-preview__polaroid">
          <div className="darkroom-monitor-preview__inner" />
        </div>
      </div>

      {/* Кнопки управления анимацией орбиты */}
      <div className="telemetry-controls">
        <button
          type="button"
          className={`telemetry-btn ${isPlaying ? 'telemetry-btn--active' : ''}`}
          onClick={onTogglePlay}
          aria-pressed={isPlaying}
        >
          {isPlaying ? <Pause size={13} /> : <Play size={13} />}
          <span>{isPlaying ? 'PLAY' : 'PAUSE'}</span>
        </button>

        <button
          type="button"
          className={`telemetry-btn ${isReversed ? 'telemetry-btn--active' : ''}`}
          onClick={onToggleReverse}
          aria-pressed={isReversed}
        >
          <span>REVERSE</span>
          <RotateCcw size={13} />
        </button>
      </div>
    </aside>
  );
}
