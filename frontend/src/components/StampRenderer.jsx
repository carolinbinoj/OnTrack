import React from 'react';

// 9 Unique Pixel-Art Postage Stamps
// Perforated postage border, framed illustration, distinct color palettes

export const STAMP_CONFIGS = {
  // Capybara Child Stamps
  child_can_improve: {
    id: 'child_can_improve',
    name: 'Sprout of Wonder',
    evaluator: 'child',
    tier: 'can_improve',
    tierLabel: 'Can Improve',
    symbol: '🌱',
    themeColor: '#7a9e7e',
    bgColor: '#e2edd8',
    frameColor: '#4f7253',
    description: 'A tiny seed awakening in fertile forest soil.'
  },
  child_good: {
    id: 'child_good',
    name: 'Clover of Joy',
    evaluator: 'child',
    tier: 'good',
    tierLabel: 'Good',
    symbol: '🍀',
    themeColor: '#38a169',
    bgColor: '#c6f6d5',
    frameColor: '#22543d',
    description: 'A vibrant four-leaf clover glowing with alpine vitality.'
  },
  child_excellent: {
    id: 'child_excellent',
    name: 'Golden Star Seedling',
    evaluator: 'child',
    tier: 'excellent',
    tierLabel: 'Excellent',
    symbol: '🌟',
    themeColor: '#d69e2e',
    bgColor: '#fefcbf',
    frameColor: '#744210',
    description: 'A radiant golden seedling blooming under the alpine sun.'
  },

  // Conductor Dog Stamps
  conductor_can_improve: {
    id: 'conductor_can_improve',
    name: 'Ticket to Knowledge',
    evaluator: 'conductor',
    tier: 'can_improve',
    tierLabel: 'Can Improve',
    symbol: '🎫',
    themeColor: '#805ad5',
    bgColor: '#e9d8fd',
    frameColor: '#44337a',
    description: 'A punched vintage railway pass onto the next station.'
  },
  conductor_good: {
    id: 'conductor_good',
    name: 'Lantern of Clarity',
    evaluator: 'conductor',
    tier: 'good',
    tierLabel: 'Good',
    symbol: '🏮',
    themeColor: '#dd6b20',
    bgColor: '#feebc8',
    frameColor: '#7b341e',
    description: 'A warm brass train lantern cutting through mountain mist.'
  },
  conductor_excellent: {
    id: 'conductor_excellent',
    name: 'Winged Locomotive',
    evaluator: 'conductor',
    tier: 'excellent',
    tierLabel: 'Excellent',
    symbol: '🚂',
    themeColor: '#d69e2e',
    bgColor: '#feea7a',
    frameColor: '#5c3a21',
    description: 'A winged iron train wheel gliding swiftly along the peaks.'
  },

  // Strict Professor Stamps
  professor_can_improve: {
    id: 'professor_can_improve',
    name: 'Inkwell & Quill',
    evaluator: 'professor',
    tier: 'can_improve',
    tierLabel: 'Can Improve',
    symbol: '✒️',
    themeColor: '#4a5568',
    bgColor: '#e2e8f0',
    frameColor: '#1a202c',
    description: 'A focused scholar ink pot with an unsharpened quill.'
  },
  professor_good: {
    id: 'professor_good',
    name: 'Tome of Insight',
    evaluator: 'professor',
    tier: 'good',
    tierLabel: 'Good',
    symbol: '📖',
    themeColor: '#3182ce',
    bgColor: '#bee3f8',
    frameColor: '#2a4365',
    description: 'An open leather academy tome filled with rigorous proofs.'
  },
  professor_excellent: {
    id: 'professor_excellent',
    name: 'Academic Medallion',
    evaluator: 'professor',
    tier: 'excellent',
    tierLabel: 'Excellent',
    symbol: '🏅',
    themeColor: '#d69e2e',
    bgColor: '#ffd700',
    frameColor: '#652b19',
    description: 'The prestigious golden star medallion of the Alpine Academy.'
  }
};

export default function StampRenderer({ stampId, size = 120, isLocked = false, count = 0, onClick }) {
  const config = STAMP_CONFIGS[stampId] || STAMP_CONFIGS.conductor_good;

  // If this is professor_excellent, we also have the reference pixel asset
  const isGoldMedal = stampId === 'professor_excellent';

  return (
    <div
      onClick={onClick}
      style={{
        width: `${size}px`,
        height: `${size * 1.08}px`,
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        filter: isLocked ? 'grayscale(100%) opacity(35%)' : 'none',
        transition: 'transform 0.15s ease, filter 0.2s ease',
        transformOrigin: 'center bottom',
      }}
      className="stamp-card-container hover:scale-105"
      title={`${config.name} (${config.tierLabel})`}
    >
      {/* Perforated Postage Outer Frame */}
      <svg
        viewBox="0 0 100 110"
        width="100%"
        height="100%"
        style={{ filter: 'drop-shadow(0 3px 2px rgba(43,24,16,0.35))' }}
      >
        <defs>
          <pattern id={`perf-pattern-${stampId}`} x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="5" cy="5" r="2" fill="#2b170c" />
          </pattern>
        </defs>

        {/* Cream Perforated Border */}
        <rect x="2" y="2" width="96" height="106" rx="3" fill="#FDF8EB" stroke="#d4bc92" strokeWidth="1.5" />
        
        {/* Scalloped Stamp Perforations around the edge */}
        {/* Top/bottom perforations */}
        {[8, 18, 28, 38, 48, 58, 68, 78, 88].map(x => (
          <React.Fragment key={`perf-tb-${x}`}>
            <circle cx={x} cy="1.5" r="2.5" fill="#24140a" />
            <circle cx={x} cy="108.5" r="2.5" fill="#24140a" />
          </React.Fragment>
        ))}
        {/* Left/right perforations */}
        {[10, 21, 32, 43, 54, 65, 76, 87, 98].map(y => (
          <React.Fragment key={`perf-lr-${y}`}>
            <circle cx="1.5" cy={y} r="2.5" fill="#24140a" />
            <circle cx="98.5" cy={y} r="2.5" fill="#24140a" />
          </React.Fragment>
        ))}

        {/* Inner Colored Stamp Mat */}
        <rect
          x="10"
          y="10"
          width="80"
          height="90"
          rx="2"
          fill={config.bgColor}
          stroke={config.frameColor}
          strokeWidth="2.5"
        />

        {/* Decorative Pixel Corners */}
        <rect x="12" y="12" width="4" height="4" fill={config.frameColor} />
        <rect x="84" y="12" width="4" height="4" fill={config.frameColor} />
        <rect x="12" y="94" width="4" height="4" fill={config.frameColor} />
        <rect x="84" y="94" width="4" height="4" fill={config.frameColor} />

        {/* Center Illustration Frame */}
        <rect
          x="16"
          y="18"
          width="68"
          height="62"
          rx="2"
          fill="#FFFFFF"
          stroke={config.themeColor}
          strokeWidth="1.5"
        />

        {/* Stamp Emblem Rendering */}
        {renderStampEmblem(stampId, config)}

        {/* Bottom Banner Title */}
        <rect x="14" y="83" width="72" height="14" rx="2" fill={config.frameColor} />
        <text
          x="50"
          y="93"
          textAnchor="middle"
          fill="#FFF"
          fontSize="6.5"
          fontFamily="'Pixelify Sans', monospace"
          fontWeight="bold"
        >
          {config.name.toUpperCase()}
        </text>

        {/* Top Price / Tier tag */}
        <rect x="14" y="12" width="22" height="7" rx="1" fill={config.frameColor} opacity="0.8" />
        <text
          x="25"
          y="17"
          textAnchor="middle"
          fill="#FFF"
          fontSize="4.5"
          fontFamily="'Pixelify Sans', monospace"
          fontWeight="bold"
        >
          {config.tierLabel.toUpperCase()}
        </text>
      </svg>

      {/* Count Badge if count > 1 */}
      {count > 1 && !isLocked && (
        <div
          style={{
            position: 'absolute',
            top: '-6px',
            right: '-6px',
            background: '#C0392B',
            color: '#fff',
            fontFamily: "'Pixelify Sans', monospace",
            fontWeight: 'bold',
            fontSize: '11px',
            padding: '2px 6px',
            borderRadius: '999px',
            border: '2px solid #2B170C',
            boxShadow: '0 2px 0 #2B170C',
            zIndex: 10
          }}
        >
          x{count}
        </div>
      )}

      {/* Locked Silhouette Overlay */}
      {isLocked && (
        <div
          style={{
            position: 'absolute',
            inset: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(30, 20, 15, 0.45)',
            borderRadius: '4px',
            color: '#d4bc92',
            fontSize: '20px'
          }}
        >
          🔒
        </div>
      )}
    </div>
  );
}

function renderStampEmblem(stampId, config) {
  switch (stampId) {
    case 'child_can_improve':
      return (
        <g>
          {/* Soil */}
          <ellipse cx="50" cy="62" rx="20" ry="6" fill="#8B5A2B" />
          {/* Green Sprout */}
          <path d="M 50 62 Q 48 48 46 36 Q 44 45 42 48" fill="none" stroke="#48BB78" strokeWidth="3" strokeLinecap="round" />
          <path d="M 46 38 Q 38 34 36 40 Q 42 44 46 38" fill="#48BB78" />
          <path d="M 46 42 Q 54 38 56 44 Q 50 48 46 42" fill="#38A169" />
          {/* Dew drop */}
          <circle cx="37" cy="35" r="1.5" fill="#63B3ED" />
        </g>
      );
    case 'child_good':
      return (
        <g>
          {/* Four-leaf Clover */}
          <circle cx="44" cy="42" r="7" fill="#38A169" />
          <circle cx="56" cy="42" r="7" fill="#38A169" />
          <circle cx="44" cy="54" r="7" fill="#2F855A" />
          <circle cx="56" cy="54" r="7" fill="#2F855A" />
          <circle cx="50" cy="48" r="4" fill="#68D391" />
          {/* Stem */}
          <path d="M 50 50 Q 52 64 48 70" fill="none" stroke="#276749" strokeWidth="2.5" strokeLinecap="round" />
          {/* Sparkles */}
          <polygon points="68,32 70,35 73,36 70,37 68,40 66,37 63,36 66,35" fill="#F6E05E" />
        </g>
      );
    case 'child_excellent':
      return (
        <g>
          {/* Golden Seedling Star */}
          <circle cx="50" cy="48" r="18" fill="#FAF089" opacity="0.6" />
          {/* Central Star */}
          <polygon
            points="50,30 54,42 66,42 56,50 60,62 50,54 40,62 44,50 34,42 46,42"
            fill="#ECC94B"
            stroke="#D69E2E"
            strokeWidth="1.5"
          />
          <circle cx="50" cy="48" r="4" fill="#FFF" />
          {/* Leaf base */}
          <path d="M 50 62 Q 44 68 50 72 Q 56 68 50 62" fill="#48BB78" />
          {/* Radiance sparkles */}
          <circle cx="32" cy="32" r="1.5" fill="#D69E2E" />
          <circle cx="68" cy="30" r="1.5" fill="#D69E2E" />
          <circle cx="70" cy="64" r="1.5" fill="#D69E2E" />
        </g>
      );
    case 'conductor_can_improve':
      return (
        <g>
          {/* Railway Ticket */}
          <rect x="30" y="32" width="40" height="28" rx="2" fill="#ED8936" stroke="#C05621" strokeWidth="1.5" />
          <line x1="42" y1="32" x2="42" y2="60" stroke="#FFF" strokeWidth="1" strokeDasharray="2,2" />
          <circle cx="30" cy="46" r="3" fill="#FFF" />
          <circle cx="70" cy="46" r="3" fill="#FFF" />
          <text x="56" y="48" fill="#FFF" fontSize="7" fontFamily="'Pixelify Sans', monospace" fontWeight="bold">PASS</text>
        </g>
      );
    case 'conductor_good':
      return (
        <g>
          {/* Brass Railway Lantern */}
          <rect x="42" y="30" width="16" height="6" rx="2" fill="#7B341E" />
          <path d="M 40 36 L 60 36 L 58 60 L 42 60 Z" fill="#ECC94B" stroke="#7B341E" strokeWidth="2" />
          {/* Lantern warm glow core */}
          <ellipse cx="50" cy="48" rx="6" ry="8" fill="#FFF" />
          <circle cx="50" cy="48" r="4" fill="#ED8936" />
          {/* Base */}
          <rect x="38" y="60" width="24" height="6" rx="1" fill="#7B341E" />
          {/* Handle */}
          <path d="M 44 30 Q 50 22 56 30" fill="none" stroke="#7B341E" strokeWidth="2" />
        </g>
      );
    case 'conductor_excellent':
      return (
        <g>
          {/* Winged Locomotive Wheel */}
          <circle cx="50" cy="50" r="14" fill="#ECC94B" stroke="#744210" strokeWidth="2" />
          <circle cx="50" cy="50" r="8" fill="#744210" />
          <circle cx="50" cy="50" r="3" fill="#FFF" />
          {/* Wheel spokes */}
          <line x1="50" y1="36" x2="50" y2="64" stroke="#ECC94B" strokeWidth="1.5" />
          <line x1="36" y1="50" x2="64" y2="50" stroke="#ECC94B" strokeWidth="1.5" />
          {/* Wings */}
          <path d="M 36 46 Q 22 36 24 54 Q 32 50 36 50" fill="#ED8936" stroke="#744210" strokeWidth="1" />
          <path d="M 64 46 Q 78 36 76 54 Q 68 50 64 50" fill="#ED8936" stroke="#744210" strokeWidth="1" />
        </g>
      );
    case 'professor_can_improve':
      return (
        <g>
          {/* Ceramic Inkwell & Feather Quill */}
          <rect x="40" y="50" width="20" height="14" rx="2" fill="#2D3748" stroke="#1A202C" strokeWidth="1.5" />
          <rect x="44" y="46" width="12" height="4" fill="#4A5568" />
          {/* Feather Quill */}
          <path d="M 48 54 Q 62 34 72 26 Q 66 38 52 50" fill="#E2E8F0" stroke="#1A202C" strokeWidth="1" />
          <line x1="52" y1="50" x2="48" y2="56" stroke="#1A202C" strokeWidth="1.5" />
          {/* Ink drop */}
          <circle cx="36" cy="62" r="2" fill="#1A202C" />
        </g>
      );
    case 'professor_good':
      return (
        <g>
          {/* Open Tome with Knowledge Glyphs */}
          <path d="M 30 42 Q 40 40 50 44 Q 60 40 70 42 L 70 62 Q 60 60 50 64 Q 40 60 30 62 Z" fill="#F7FAFC" stroke="#2B6CB0" strokeWidth="1.5" />
          {/* Book Spine */}
          <line x1="50" y1="44" x2="50" y2="64" stroke="#2B6CB0" strokeWidth="1.5" />
          {/* Text lines */}
          <line x1="34" y1="48" x2="46" y2="48" stroke="#4A5568" strokeWidth="1" />
          <line x1="34" y1="53" x2="44" y2="53" stroke="#4A5568" strokeWidth="1" />
          <line x1="54" y1="48" x2="66" y2="48" stroke="#4A5568" strokeWidth="1" />
          <line x1="54" y1="53" x2="64" y2="53" stroke="#4A5568" strokeWidth="1" />
          {/* Red Bookmark */}
          <path d="M 50 44 L 50 68 L 48 65 L 46 68 L 46 44" fill="#E53E3E" />
        </g>
      );
    case 'professor_excellent':
      return (
        <g>
          {/* Golden Academic Star Medallion */}
          {/* Gold Ribbons hanging down */}
          <polygon points="42,56 46,72 38,72" fill="#D69E2E" stroke="#744210" strokeWidth="1" />
          <polygon points="58,56 62,72 54,72" fill="#D69E2E" stroke="#744210" strokeWidth="1" />
          {/* Outer Sunburst */}
          <circle cx="50" cy="46" r="18" fill="#ECC94B" stroke="#744210" strokeWidth="2" />
          <circle cx="50" cy="46" r="13" fill="#FAF089" stroke="#B7791F" strokeWidth="1.5" />
          {/* Star in Center */}
          <polygon
            points="50,34 53,42 62,42 55,48 58,56 50,51 42,56 45,48 38,42 47,42"
            fill="#D69E2E"
            stroke="#744210"
            strokeWidth="1"
          />
          {/* Sparkles around */}
          <polygon points="26,30 28,32 30,30 28,28" fill="#FFF" />
          <polygon points="72,32 74,34 76,32 74,30" fill="#FFF" />
          <polygon points="70,58 72,60 74,58 72,56" fill="#FFF" />
        </g>
      );
    default:
      return null;
  }
}
