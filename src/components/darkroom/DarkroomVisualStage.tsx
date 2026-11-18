/**
 * Компонент центральной атмосферной сцены фотолаборатории.
 * Заменяет удалённую карусель полароидов: рендерит диагональную негативную 35-мм плёнку,
 * теневого двойника, золотистые искры засветки, векторный силуэт персонажа
 * с бирюзово-янтарной контурной подсветкой и перекрестие видоискателя.
 * Правая часть видоискателя остаётся свободной без боковых меню.
 */

/** Список координат декоративных искр фотозасветки на сцене */
const DARKROOM_SPARKS: ReadonlyArray<{
  id: string;
  cx: number;
  cy: number;
  r: number;
  opacity: number;
}> = [
  { id: 'sp-1', cx: 312, cy: 148, r: 2.2, opacity: 0.9 },
  { id: 'sp-2', cx: 344, cy: 192, r: 1.5, opacity: 0.72 },
  { id: 'sp-3', cx: 298, cy: 238, r: 2.6, opacity: 0.85 },
  { id: 'sp-4', cx: 368, cy: 266, r: 1.8, opacity: 0.68 },
  { id: 'sp-5', cx: 325, cy: 312, r: 3.0, opacity: 0.82 },
  { id: 'sp-6', cx: 288, cy: 364, r: 1.7, opacity: 0.75 },
  { id: 'sp-7', cx: 356, cy: 398, r: 2.3, opacity: 0.78 },
  { id: 'sp-8', cx: 314, cy: 446, r: 1.4, opacity: 0.64 },
  { id: 'sp-9', cx: 142, cy: 406, r: 2.1, opacity: 0.65 },
  { id: 'sp-10', cx: 164, cy: 454, r: 1.6, opacity: 0.55 },
  { id: 'sp-11', cx: 392, cy: 332, r: 1.9, opacity: 0.6 },
  { id: 'sp-12', cx: 274, cy: 284, r: 1.5, opacity: 0.8 },
];

/**
 * Отрисовывает центральную композицию тёмной фотолаборатории без правой менюшки.
 * @returns JSX-разметка визуальной сцены центра видоискателя.
 */
export function DarkroomVisualStage() {
  return (
    <div className="darkroom-visual-stage" aria-hidden="true">
      <svg
        className="darkroom-silhouette-svg"
        viewBox="0 0 560 580"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Мягкое бирюзово-янтарное свечение за силуэтом */}
          <radialGradient id="vyazelAuraGlow" cx="46%" cy="46%" r="48%">
            <stop offset="0%" stopColor="#3BC7D6" stopOpacity="0.18" />
            <stop offset="48%" stopColor="#E8BE67" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#0B1317" stopOpacity="0" />
          </radialGradient>

          {/* Градиент корпуса силуэта в худи */}
          <linearGradient id="vyazelBodyFill" x1="160" y1="60" x2="310" y2="570" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1B252B" />
            <stop offset="45%" stopColor="#121A1F" />
            <stop offset="100%" stopColor="#090E12" />
          </linearGradient>

          {/* Градиент теневого двойника */}
          <linearGradient id="vyazelShadowDouble" x1="300" y1="70" x2="400" y2="560" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#060A0D" stopOpacity="0.88" />
            <stop offset="100%" stopColor="#060A0D" stopOpacity="0.18" />
          </linearGradient>

          <filter id="rimCyanGlow" x="-15%" y="-15%" width="130%" height="130%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Атмосферное свечение фона */}
        <circle cx="258" cy="275" r="245" fill="url(#vyazelAuraGlow)" />

        {/* Диагональная лента негативной 35-мм киноплёнки за персонажем */}
        <g transform="translate(30 228) rotate(-13)" opacity="0.82">
          <rect
            x="0"
            y="0"
            width="430"
            height="108"
            rx="3"
            fill="#0A1014"
            stroke="rgba(234, 226, 208, 0.22)"
            strokeWidth="1.2"
          />
          {/* Верхняя и нижняя дорожки перфорации негатива */}
          {Array.from({ length: 14 }).map((_, index) => {
            const holeX = 12 + index * 30;
            return (
              <g key={`perf-${index}`}>
                <rect x={holeX} y="7" width="16" height="9" rx="1.5" fill="#040709" stroke="rgba(234,226,208,0.16)" strokeWidth="0.7" />
                <rect x={holeX} y="92" width="16" height="9" rx="1.5" fill="#040709" stroke="rgba(234,226,208,0.16)" strokeWidth="0.7" />
              </g>
            );
          })}
          {/* Три кадра-экспозиции внутри диагональной плёнки */}
          <rect x="16" y="22" width="124" height="64" fill="#131C22" stroke="rgba(234, 226, 208, 0.16)" />
          <circle cx="62" cy="48" r="14" fill="rgba(59, 199, 214, 0.18)" />
          <path d="M24 84 C38 60, 76 58, 92 84 Z" fill="rgba(232, 190, 103, 0.14)" />

          <rect x="152" y="22" width="124" height="64" fill="#162027" stroke="rgba(234, 226, 208, 0.16)" />
          <path d="M168 84 L204 42 L238 84 Z" fill="rgba(234, 226, 208, 0.08)" />

          <rect x="288" y="22" width="124" height="64" fill="#11191F" stroke="rgba(232, 190, 103, 0.22)" />
          <circle cx="350" cy="46" r="12" fill="rgba(232, 190, 103, 0.22)" />
          <path d="M312 84 C330 56, 372 56, 388 84 Z" fill="rgba(59, 199, 214, 0.12)" />
        </g>

        {/* Тонкие золотистые дуги засветки, пересекающие кадр */}
        <path
          d="M342 12 C320 182, 344 368, 412 564"
          stroke="rgba(232, 190, 103, 0.42)"
          strokeWidth="1.2"
        />
        <path
          d="M352 496 C418 468, 488 476, 536 530"
          stroke="rgba(232, 190, 103, 0.28)"
          strokeWidth="1"
        />

        {/* Теневой двойник за основным силуэтом */}
        <g transform="translate(86, 18)" opacity="0.9">
          <path
            d="M250 66
               C275 66, 294 84, 294 112
               C294 134, 282 152, 268 158
               L280 176
               C326 190, 352 238, 356 320
               L364 548
               L194 548
               L198 318
               C200 236, 212 192, 232 174
               L236 156
               C218 148, 208 130, 208 108
               C208 82, 226 66, 250 66 Z"
            fill="url(#vyazelShadowDouble)"
          />
        </g>

        {/* Золотистые искры и осколки фотозасветки */}
        {DARKROOM_SPARKS.map((spark) => (
          <circle
            key={spark.id}
            cx={spark.cx}
            cy={spark.cy}
            r={spark.r}
            fill="#E8BE67"
            opacity={spark.opacity}
          />
        ))}
        <polygon points="94,478 118,464 106,492" fill="rgba(234, 226, 208, 0.24)" stroke="rgba(59, 199, 214, 0.45)" strokeWidth="0.8" />
        <polygon points="348,176 358,170 353,182" fill="rgba(232, 190, 103, 0.65)" />

        {/* Основной силуэт персонажа в худи со смещённым бирюзовым и янтарным контуром */}
        <g className="vyazel-silhouette-group">
          {/* Левый бирюзовый хроматический сдвиг контура */}
          <path
            d="M206 54
               L220 44 L224 58 L244 48 L242 64 C264 72, 272 94, 266 118
               C262 136, 248 152, 236 156 L246 172
               C286 184, 314 232, 326 326 L342 564
               L136 564 L126 392 C122 308, 134 228, 166 184
               L180 156 C164 146, 156 124, 160 100
               C162 80, 174 64, 188 58 L194 46 Z"
            transform="translate(-4, 0)"
            fill="none"
            stroke="#3BC7D6"
            strokeWidth="3.5"
            opacity="0.88"
            filter="url(#rimCyanGlow)"
          />

          {/* Правый янтарный хроматический сдвиг контура */}
          <path
            d="M206 54
               L220 44 L224 58 L244 48 L242 64 C264 72, 272 94, 266 118
               C262 136, 248 152, 236 156 L246 172
               C286 184, 314 232, 326 326 L342 564
               L136 564 L126 392 C122 308, 134 228, 166 184
               L180 156 C164 146, 156 124, 160 100
               C162 80, 174 64, 188 58 L194 46 Z"
            transform="translate(4, 1)"
            fill="none"
            stroke="#E8BE67"
            strokeWidth="3.2"
            opacity="0.85"
          />

          {/* Заполнение силуэта в худи */}
          <path
            d="M206 54
               L220 44 L224 58 L244 48 L242 64 C264 72, 272 94, 266 118
               C262 136, 248 152, 236 156 L246 172
               C286 184, 314 232, 326 326 L342 564
               L136 564 L126 392 C122 308, 134 228, 166 184
               L180 156 C164 146, 156 124, 160 100
               C162 80, 174 64, 188 58 L194 46 Z"
            fill="url(#vyazelBodyFill)"
            stroke="rgba(234, 226, 208, 0.24)"
            strokeWidth="1.1"
          />

          {/* Графичные линии складок капюшона, ворота и шнурков худи */}
          <path
            d="M174 188 C196 172, 242 172, 266 192 C252 216, 212 226, 176 212 Z"
            fill="#1D282F"
            stroke="rgba(234, 226, 208, 0.22)"
            strokeWidth="1.2"
          />
          <path d="M206 218 L200 296" stroke="rgba(234, 226, 208, 0.34)" strokeWidth="2" strokeLinecap="round" />
          <path d="M226 218 L234 288" stroke="rgba(234, 226, 208, 0.28)" strokeWidth="2" strokeLinecap="round" />
          <path d="M188 264 C178 334, 180 410, 190 486" stroke="rgba(234, 226, 208, 0.14)" strokeWidth="1.4" />
          <path d="M276 278 C294 348, 300 426, 294 510" stroke="rgba(234, 226, 208, 0.16)" strokeWidth="1.4" />
          <path d="M148 486 L320 486" stroke="rgba(59, 199, 214, 0.2)" strokeWidth="1.2" />
        </g>
      </svg>

      {/* Перекрестие прицела видоискателя в правом нижнем углу */}
      <svg
        className="reticle-crosshair"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M20 6 V34 M6 20 H34" stroke="#eae2d0" strokeWidth="1.5" strokeOpacity="0.72" />
        <circle cx="20" cy="20" r="12" stroke="#3bc7d6" strokeWidth="1" strokeOpacity="0.58" />
      </svg>
    </div>
  );
}
