import React from 'react';

// Parallax Scrolling Pixel-Art Swiss Alpine Forest
// Smooth infinite horizontal loop with distant mountains, mid pine ridge, foreground pine forest

export default function ParallaxForest({ trainState = 'travelling' }) {
  // trainState: 'travelling' | 'arriving' | 'stopped' | 'break' | 'waiting' | 'completed'
  const isMoving = trainState === 'travelling';
  const isArriving = trainState === 'arriving';

  const animationPlayState = (isMoving || isArriving) ? 'running' : 'paused';
  const slowMultiplier = isArriving ? '0.3' : '1';

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        background: 'linear-gradient(to bottom, #7ca1d1 0%, #a4c4e8 45%, #d5e5f5 75%, #bcd3c7 100%)',
        imageRendering: 'pixelated'
      }}
      className="parallax-viewport"
    >
      {/* 1. Distant Snow-Capped Alpine Peaks (Layer 1 - slowest) */}
      <div
        style={{
          position: 'absolute',
          bottom: '22%',
          left: 0,
          width: '200%',
          height: '140px',
          animation: `forest-scroll 70s linear infinite`,
          animationPlayState,
          opacity: 0.85
        }}
      >
        <svg viewBox="0 0 1000 120" preserveAspectRatio="none" width="100%" height="100%">
          {/* Repeatable mountain peaks */}
          <polygon points="0,120 60,30 140,120" fill="#718fa8" />
          <polygon points="45,50 60,30 80,50" fill="#ffffff" />

          <polygon points="120,120 200,15 280,120" fill="#5c7a94" />
          <polygon points="180,40 200,15 225,40" fill="#ffffff" />

          <polygon points="260,120 330,45 400,120" fill="#718fa8" />
          <polygon points="315,60 330,45 350,60" fill="#ffffff" />

          <polygon points="380,120 460,20 540,120" fill="#53728c" />
          <polygon points="440,42 460,20 485,42" fill="#ffffff" />

          {/* Mirrored half for seamless 100% loop */}
          <polygon points="500,120 560,30 640,120" fill="#718fa8" />
          <polygon points="545,50 560,30 580,50" fill="#ffffff" />

          <polygon points="620,120 700,15 780,120" fill="#5c7a94" />
          <polygon points="680,40 700,15 725,40" fill="#ffffff" />

          <polygon points="760,120 830,45 900,120" fill="#718fa8" />
          <polygon points="815,60 830,45 850,60" fill="#ffffff" />

          <polygon points="880,120 960,20 1040,120" fill="#53728c" />
          <polygon points="940,42 960,20 985,42" fill="#ffffff" />
        </svg>
      </div>

      {/* 2. Midground Misty Pine Ridges (Layer 2 - medium) */}
      <div
        style={{
          position: 'absolute',
          bottom: '12%',
          left: 0,
          width: '200%',
          height: '110px',
          animation: `forest-scroll 32s linear infinite`,
          animationPlayState,
          opacity: 0.9
        }}
      >
        <svg viewBox="0 0 1000 100" preserveAspectRatio="none" width="100%" height="100%">
          {[0, 500].map(offset => (
            <g key={offset} transform={`translate(${offset}, 0)`}>
              {/* Rolling hill */}
              <path d="M 0 100 Q 120 45 250 65 Q 380 40 500 100 Z" fill="#2d523e" />
              {/* Mid pines */}
              {[20, 50, 85, 130, 165, 210, 245, 290, 335, 380, 420, 465].map((x, i) => (
                <g key={i} transform={`translate(${x}, ${50 + (i % 3) * 6})`}>
                  <rect x="7" y="24" width="4" height="16" fill="#1b3024" />
                  <polygon points="9,0 0,16 18,16" fill="#244533" />
                  <polygon points="9,8 -2,24 20,24" fill="#203d2d" />
                  <polygon points="9,14 -4,32 22,32" fill="#1c3628" />
                </g>
              ))}
            </g>
          ))}
        </svg>
      </div>

      {/* 3. Foreground Swiss Pine Trees (Layer 3 - fast & crisp) */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '200%',
          height: '160px',
          animation: `forest-scroll 14s linear infinite`,
          animationPlayState
        }}
      >
        <svg viewBox="0 0 1000 150" preserveAspectRatio="none" width="100%" height="100%">
          {[0, 500].map(offset => (
            <g key={offset} transform={`translate(${offset}, 0)`}>
              {/* Rocky mossy ground */}
              <rect x="0" y="115" width="500" height="35" fill="#1b3827" />
              <line x1="0" y1="115" x2="500" y2="115" stroke="#37664a" strokeWidth="3" />
              <line x1="0" y1="126" x2="500" y2="126" stroke="#12261a" strokeWidth="2" />

              {/* Big foreground pixel pines */}
              {[15, 65, 115, 175, 230, 285, 345, 405, 465].map((x, idx) => {
                const scale = 0.9 + (idx % 3) * 0.15;
                const yShift = 10 + (idx % 2) * 10;
                return (
                  <g key={idx} transform={`translate(${x}, ${yShift}) scale(${scale})`}>
                    {/* Trunk */}
                    <rect x="16" y="65" width="8" height="50" fill="#3d2112" />
                    <rect x="18" y="65" width="3" height="50" fill="#29150a" />

                    {/* Pine Tier 1 (top) */}
                    <polygon points="20,0 6,26 34,26" fill="#1e4d34" />
                    <polygon points="20,0 20,26 34,26" fill="#163826" />

                    {/* Pine Tier 2 */}
                    <polygon points="20,18 2,46 38,46" fill="#24593c" />
                    <polygon points="20,18 20,46 38,46" fill="#1a422d" />

                    {/* Pine Tier 3 */}
                    <polygon points="20,38 -2,68 42,68" fill="#1b472f" />
                    <polygon points="20,38 20,68 42,68" fill="#133322" />

                    {/* Pine Tier 4 */}
                    <polygon points="20,56 -6,88 46,88" fill="#163d28" />
                    <polygon points="20,56 20,88 46,88" fill="#0f2b1c" />
                  </g>
                );
              })}

              {/* Little forest flowers and grass tufts */}
              {[35, 95, 150, 210, 270, 325, 390, 440].map((gx, gi) => (
                <g key={gi} transform={`translate(${gx}, 112)`}>
                  <rect x="0" y="-4" width="2" height="6" fill="#52996d" />
                  <rect x="3" y="-6" width="2" height="8" fill="#69bd89" />
                  <rect x="6" y="-3" width="2" height="5" fill="#52996d" />
                  {gi % 2 === 0 && <circle cx="3" cy="-7" r="2" fill="#fed330" />}
                </g>
              ))}
            </g>
          ))}
        </svg>
      </div>

      <style>{`
        @keyframes forest-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
