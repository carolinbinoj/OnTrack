import React, { useState, useEffect } from 'react';

// Cozy Brown Bear Travel Companion with Red Scarf
// Subtle breathing, blinking, focus/reading, break/coffee drinking, and celebration poses

export default function BearCompanion({
  state = 'focus', // 'focus' | 'break' | 'station' | 'celebrate' | 'idle'
  isTrainMoving = true,
  onClick
}) {
  const [blink, setBlink] = useState(false);
  const [windowGlance, setWindowGlance] = useState(false);

  // Periodic random blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 200);
    }, 4000 + Math.random() * 3000);

    return () => clearInterval(blinkInterval);
  }, []);

  // Occasional glance towards the train window
  useEffect(() => {
    const glanceInterval = setInterval(() => {
      if (state === 'focus' || state === 'idle') {
        setWindowGlance(true);
        setTimeout(() => setWindowGlance(false), 2500);
      }
    }, 9000);

    return () => clearInterval(glanceInterval);
  }, [state]);

  const isDrinking = state === 'break';
  const isHappy = state === 'celebrate';

  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative',
        width: '180px',
        height: '210px',
        cursor: onClick ? 'pointer' : 'default',
        transform: `translateY(${isTrainMoving ? '0px' : '2px'})`,
        animation: `${isTrainMoving ? 'train-bob 2.2s ease-in-out infinite' : 'bear-breath 3.5s ease-in-out infinite'}`
      }}
      className="bear-container"
      title="Your cozy study companion"
    >
      <svg
        viewBox="0 0 140 160"
        width="100%"
        height="100%"
        style={{ imageRendering: 'pixelated', filter: 'drop-shadow(0 4px 6px rgba(43,24,16,0.3))' }}
      >
        {/* Shadow on green seat */}
        <ellipse cx="70" cy="154" rx="42" ry="6" fill="#183626" opacity="0.6" />

        {/* 1. Bear Body (warm brown rounded torso) */}
        <g id="bear-torso" style={{ transformOrigin: '70px 140px', animation: 'bear-breath 3.5s ease-in-out infinite' }}>
          {/* Main body */}
          <path
            d="M 36 150 C 34 110, 44 88, 70 88 C 96 88, 106 110, 104 150 Z"
            fill="#8B5A2B"
            stroke="#4A2810"
            strokeWidth="3.5"
          />

          {/* Cozy belly patch */}
          <ellipse cx="70" cy="124" rx="22" ry="20" fill="#D29964" />

          {/* 2. Red Woolen Scarf (Cozy accessory) */}
          <g id="scarf">
            {/* Scarf neck wrap */}
            <path
              d="M 38 88 C 45 80, 95 80, 102 88 C 100 102, 40 102, 38 88 Z"
              fill="#C0392B"
              stroke="#5C140F"
              strokeWidth="3"
            />
            {/* Scarf folds */}
            <path d="M 48 85 Q 70 94 92 85" fill="none" stroke="#E74C3C" strokeWidth="2.5" />
            {/* Scarf tail hanging down */}
            <path
              d="M 52 92 L 48 126 L 62 124 L 64 94 Z"
              fill="#B02A1E"
              stroke="#5C140F"
              strokeWidth="2"
            />
            {/* Scarf fringes */}
            <line x1="49" y1="126" x2="48" y2="131" stroke="#E74C3C" strokeWidth="2" />
            <line x1="53" y1="125" x2="53" y2="131" stroke="#E74C3C" strokeWidth="2" />
            <line x1="58" y1="125" x2="58" y2="130" stroke="#E74C3C" strokeWidth="2" />
          </g>

          {/* 3. Bear Head */}
          <g
            id="bear-head"
            style={{
              transform: windowGlance ? 'rotate(-6deg) translateX(-4px)' : isDrinking ? 'rotate(4deg)' : 'none',
              transformOrigin: '70px 75px',
              transition: 'transform 0.4s ease'
            }}
          >
            {/* Left Ear */}
            <ellipse cx="44" cy="38" rx="10" ry="11" fill="#8B5A2B" stroke="#4A2810" strokeWidth="3" />
            <ellipse cx="45" cy="39" rx="5" ry="6" fill="#D29964" />

            {/* Right Ear */}
            <ellipse cx="96" cy="38" rx="10" ry="11" fill="#8B5A2B" stroke="#4A2810" strokeWidth="3" />
            <ellipse cx="95" cy="39" rx="5" ry="6" fill="#D29964" />

            {/* Head Silhouette */}
            <ellipse cx="70" cy="58" rx="30" ry="26" fill="#8B5A2B" stroke="#4A2810" strokeWidth="3.5" />

            {/* Snout */}
            <ellipse cx="70" cy="67" rx="15" ry="12" fill="#D29964" stroke="#4A2810" strokeWidth="2" />

            {/* Dark cute nose */}
            <ellipse cx="70" cy="62" rx="5" ry="4" fill="#2B170C" />
            <circle cx="68.5" cy="60.5" r="1.5" fill="#FFFFFF" />

            {/* Mouth */}
            {isHappy ? (
              <path d="M 64 69 Q 70 76 76 69" fill="#96281B" stroke="#4A2810" strokeWidth="1.8" />
            ) : isDrinking ? (
              <circle cx="70" cy="71" r="3" fill="#4A2810" />
            ) : (
              <path d="M 65 68 Q 70 72 75 68" fill="none" stroke="#4A2810" strokeWidth="2" strokeLinecap="round" />
            )}

            {/* Eyes */}
            {blink ? (
              // Blinking line
              <g>
                <path d="M 52 52 Q 56 55 60 52" fill="none" stroke="#2B170C" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 80 52 Q 84 55 88 52" fill="none" stroke="#2B170C" strokeWidth="2.5" strokeLinecap="round" />
              </g>
            ) : windowGlance ? (
              // Looking left out window
              <g>
                <ellipse cx="55" cy="51" rx="4" ry="5" fill="#2B170C" />
                <ellipse cx="83" cy="51" rx="4" ry="5" fill="#2B170C" />
                <circle cx="53" cy="49" r="1.5" fill="#FFFFFF" />
                <circle cx="81" cy="49" r="1.5" fill="#FFFFFF" />
              </g>
            ) : (
              // Normal forward eyes
              <g>
                <ellipse cx="56" cy="51" rx="4.5" ry="5.5" fill="#2B170C" />
                <ellipse cx="84" cy="51" rx="4.5" ry="5.5" fill="#2B170C" />
                <circle cx="55" cy="49" r="1.8" fill="#FFFFFF" />
                <circle cx="83" cy="49" r="1.8" fill="#FFFFFF" />
              </g>
            )}

            {/* Cute pink cheek blush */}
            <circle cx="48" cy="63" r="4.5" fill="#E57373" opacity="0.45" />
            <circle cx="92" cy="63" r="4.5" fill="#E57373" opacity="0.45" />
          </g>

          {/* 4. Bear Paws & Contextual Item */}
          {isDrinking ? (
            // Break time: Holding coffee mug to mouth
            <g id="drinking-pose">
              {/* Ceramic Alpine Mug */}
              <rect x="60" y="66" width="20" height="22" rx="3" fill="#FCF8EE" stroke="#4A2810" strokeWidth="2" />
              {/* Mug mountain graphic */}
              <polygon points="63,82 68,74 73,82" fill="#2E7D32" />
              <polygon points="70,82 74,76 78,82" fill="#1B5E20" />
              {/* Mug handle */}
              <path d="M 80 70 Q 86 76 80 82" fill="none" stroke="#4A2810" strokeWidth="2.5" />
              {/* Little steam puffs */}
              <path d="M 68 62 Q 66 56 69 52" fill="none" stroke="#FFF" strokeWidth="1.5" opacity="0.7" />
              <path d="M 73 60 Q 75 55 72 50" fill="none" stroke="#FFF" strokeWidth="1.5" opacity="0.7" />
              {/* Paws wrapped around mug */}
              <ellipse cx="58" cy="78" rx="6" ry="6" fill="#8B5A2B" stroke="#4A2810" strokeWidth="2" />
              <ellipse cx="80" cy="78" rx="6" ry="6" fill="#8B5A2B" stroke="#4A2810" strokeWidth="2" />
            </g>
          ) : isHappy ? (
            // Celebration: Paws raised high in victory!
            <g id="celebrate-pose">
              <ellipse cx="32" cy="70" rx="9" ry="8" fill="#8B5A2B" stroke="#4A2810" strokeWidth="2.5" />
              <ellipse cx="108" cy="70" rx="9" ry="8" fill="#8B5A2B" stroke="#4A2810" strokeWidth="2.5" />
              {/* Sparkle over head */}
              <polygon points="70,12 72,18 78,20 72,22 70,28 68,22 62,20 68,18" fill="#F1C40F" />
            </g>
          ) : (
            // Focus time: Attentively resting paws on small desk / open notebook
            <g id="focus-pose">
              {/* Left paw on table */}
              <ellipse cx="50" cy="116" rx="9" ry="7" fill="#8B5A2B" stroke="#4A2810" strokeWidth="2.5" />
              {/* Right paw holding pencil / on page */}
              <ellipse cx="90" cy="116" rx="9" ry="7" fill="#8B5A2B" stroke="#4A2810" strokeWidth="2.5" />
              {/* Tiny study pencil */}
              <line x1="88" y1="120" x2="102" y2="108" stroke="#E67E22" strokeWidth="3" strokeLinecap="round" />
              <polygon points="102,108 106,104 100,106" fill="#2B170C" />
            </g>
          )}
        </g>
      </svg>

      <style>{`
        @keyframes train-bob {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
        @keyframes bear-breath {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02, 1.01); }
        }
      `}</style>
    </div>
  );
}
