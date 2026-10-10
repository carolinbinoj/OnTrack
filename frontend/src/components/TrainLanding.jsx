import React, { useState } from 'react';
import { soundService } from '../services/soundService';

export default function TrainLanding({
  unlockedCoaches = { 1: true, 2: false, 3: false },
  profExcellentCount = 0,
  totalExcellentCount = 0,
  selectedCoach = 1,
  onSelectCoach,
  onStartJourney,
  onOpenJournal,
  onOpenHub
}) {
  const [inspectCoach, setInspectCoach] = useState(null);

  const coaches = [
    {
      id: 0,
      name: 'Locomotive Engine',
      type: 'engine',
      selectable: false,
      description: 'Driven by the Master Conductor. Powers the journey through the Swiss passes.',
      interiorTheme: 'Engine Room with Firebox & Brass Gauges'
    },
    {
      id: 1,
      name: 'Alpine Cedar Coach',
      type: 'passenger',
      selectable: true,
      unlocked: true,
      description: 'Cozy dark green velvet upholstery, warm pine paneling, glowing lantern, and window views.',
      interiorTheme: 'Traditional Swiss Mountain Train'
    },
    {
      id: 2,
      name: 'Panorama Vista Coach',
      type: 'passenger',
      selectable: unlockedCoaches[2],
      unlocked: unlockedCoaches[2],
      unlockReq: '10 Professor — Excellent Stamps',
      currentProgress: profExcellentCount,
      targetProgress: 10,
      description: 'Wide glass arched ceiling, alpine botany displays, rich mahogany bookshelves.',
      interiorTheme: 'Alpine Observatory'
    },
    {
      id: 3,
      name: 'Grand Academy Coach',
      type: 'passenger',
      selectable: unlockedCoaches[3],
      unlocked: unlockedCoaches[3],
      unlockReq: '20 Total Excellent Stamps',
      currentProgress: totalExcellentCount,
      targetProgress: 20,
      description: 'Golden brass chandeliers, private leather study booths, archival atlas maps.',
      interiorTheme: 'Grand Scholars Salon'
    }
  ];

  const handleCoachClick = (c) => {
    soundService.playClick();
    if (!c.selectable) {
      setInspectCoach(c);
      return;
    }
    if (c.unlocked) {
      onSelectCoach(c.id);
    }
    setInspectCoach(c);
  };

  const handleStart = () => {
    soundService.playClick();
    soundService.playStationBell();
    onStartJourney();
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: 'linear-gradient(to bottom, #7ca1d1 0%, #a8c8e8 40%, #cce0f0 65%, #234832 65%, #183323 100%)',
        position: 'relative',
        overflow: 'hidden',
        color: '#2b170c'
      }}
      className="train-landing-page"
    >
      {/* Top Navigation Bar */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 28px',
          zIndex: 10
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              background: '#b82b24',
              border: '3px solid #2b170c',
              borderRadius: '8px',
              padding: '6px 12px',
              boxShadow: '0 4px 0 #2b170c',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span style={{ fontSize: '20px' }}>🚂</span>
            <span
              style={{
                fontFamily: "'Pixelify Sans', monospace",
                fontWeight: 'bold',
                fontSize: '22px',
                color: '#fff',
                letterSpacing: '1px',
                textShadow: '0 2px 0 #2b170c'
              }}
            >
              onTrack
            </span>
          </div>
          <span
            style={{
              fontFamily: "'Patrick Hand', cursive",
              fontSize: '18px',
              color: '#fff',
              textShadow: '0 2px 4px rgba(0,0,0,0.6)',
              background: 'rgba(35, 72, 50, 0.45)',
              padding: '4px 10px',
              borderRadius: '6px'
            }}
          >
            Swiss Alpine Study Express
          </span>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => { soundService.playClick(); onOpenJournal(); }}
            className="pixel-btn pixel-btn-amber"
            style={{ padding: '8px 16px', fontSize: '14px' }}
          >
            📖 Travel Journal
          </button>
          <button
            onClick={() => { soundService.playClick(); onOpenHub(); }}
            className="pixel-btn pixel-btn-primary"
            style={{ padding: '8px 16px', fontSize: '14px' }}
          >
            📊 Productivity Hub
          </button>
        </div>
      </header>

      {/* Main Scenery & Station Platform */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '10px 20px',
          position: 'relative',
          zIndex: 5
        }}
      >
        {/* Welcome Banner */}
        <div
          style={{
            background: '#fcf8ee',
            border: '3px solid #2b170c',
            borderRadius: '12px',
            boxShadow: '0 6px 0 #2b170c',
            padding: '16px 28px',
            textAlign: 'center',
            maxWidth: '680px',
            marginBottom: '28px',
            animation: 'float-gentle 4s ease-in-out infinite'
          }}
        >
          <h1
            style={{
              fontFamily: "'Pixelify Sans', monospace",
              fontSize: '26px',
              color: '#b82b24',
              marginBottom: '6px'
            }}
          >
            All Aboard the onTrack Express! 🌲
          </h1>
          <p
            style={{
              fontFamily: "'Patrick Hand', cursive",
              fontSize: '19px',
              color: '#4a2816',
              lineHeight: 1.4
            }}
          >
            Select your coach, set your focus milestones, and study while journeying through the Swiss pine forests.
            Explain what you learn to animal evaluators to earn collectible postage stamps!
          </p>
        </div>

        {/* THE RED TOY TRAIN DISPLAY (Stationary with 4 Coaches) */}
        <div
          style={{
            width: '100%',
            maxWidth: '1040px',
            background: 'rgba(252, 248, 238, 0.95)',
            border: '4px solid #2b170c',
            borderRadius: '16px',
            boxShadow: '0 8px 0 #2b170c, inset 0 2px 0 rgba(255,255,255,0.8)',
            padding: '24px 20px 16px 20px',
            position: 'relative'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '14px',
              paddingBottom: '8px',
              borderBottom: '2px dashed #d4bc92'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>🚩</span>
              <span style={{ fontFamily: "'Pixelify Sans', monospace", fontWeight: 'bold', fontSize: '16px' }}>
                Platform 1 • Select Your Passenger Coach
              </span>
            </div>
            <span style={{ fontFamily: "'Patrick Hand', cursive", fontSize: '16px', color: '#73452a' }}>
              Coach {selectedCoach} is currently boarded
            </span>
          </div>

          {/* Connected Train Train-Body Strip */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '12px',
              position: 'relative',
              alignItems: 'end',
              paddingBottom: '16px'
            }}
          >
            {coaches.map((c) => {
              const isSelected = selectedCoach === c.id;
              const isLocked = !c.unlocked;

              return (
                <div
                  key={c.id}
                  onClick={() => handleCoachClick(c)}
                  style={{
                    cursor: c.selectable ? 'pointer' : 'help',
                    border: isSelected ? '4px solid #b82b24' : '3px solid #2b170c',
                    borderRadius: '10px',
                    background: isLocked ? '#e2d5c3' : isSelected ? '#fbf0e4' : '#fff',
                    padding: '12px',
                    position: 'relative',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    boxShadow: isSelected ? '0 6px 0 #b82b24' : '0 4px 0 #2b170c',
                    transform: isSelected ? 'translateY(-4px)' : 'none'
                  }}
                  className="coach-card hover:scale-102"
                >
                  {/* Lock or Active Badge */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '-10px',
                      right: '10px',
                      background: isLocked ? '#4a2816' : isSelected ? '#b82b24' : '#27ae60',
                      color: '#fff',
                      fontSize: '11px',
                      fontFamily: "'Pixelify Sans', monospace",
                      padding: '2px 8px',
                      borderRadius: '999px',
                      border: '2px solid #2b170c',
                      fontWeight: 'bold',
                      zIndex: 3
                    }}
                  >
                    {c.type === 'engine'
                      ? 'DRIVER ONLY'
                      : isLocked
                      ? 'LOCKED 🔒'
                      : isSelected
                      ? 'SELECTED ★'
                      : 'READY'}
                  </div>

                  {/* Pixel Art Rendering of Coach */}
                  <div style={{ width: '100%', height: '110px', position: 'relative' }}>
                    <svg viewBox="0 0 160 100" width="100%" height="100%">
                      {/* Coach Roof */}
                      <path
                        d="M 10 25 Q 80 18 150 25 L 150 32 L 10 32 Z"
                        fill={c.type === 'engine' ? '#1a1a1a' : '#96281B'}
                        stroke="#2B170C"
                        strokeWidth="2.5"
                      />
                      {/* Engine Smokestack */}
                      {c.type === 'engine' && (
                        <g>
                          <rect x="25" y="8" width="14" height="18" fill="#2B170C" stroke="#000" strokeWidth="1.5" />
                          <circle cx="32" cy="4" r="5" fill="#e0e0e0" opacity="0.7" />
                          <circle cx="38" cy="-2" r="7" fill="#f5f5f5" opacity="0.6" />
                        </g>
                      )}

                      {/* Coach Main Body (Red Toy Train) */}
                      <rect
                        x="10"
                        y="32"
                        width="140"
                        height="44"
                        rx="3"
                        fill={isLocked ? '#8C4843' : c.type === 'engine' ? '#C0392B' : '#D94534'}
                        stroke="#2B170C"
                        strokeWidth="3"
                      />
                      {/* Yellow / Gold Decorative Train Stripe */}
                      <rect x="10" y="58" width="140" height="6" fill="#F1C40F" stroke="#2B170C" strokeWidth="1" />

                      {/* Coach Windows with Warm Lantern Interior Glow */}
                      {c.type === 'engine' ? (
                        <g>
                          <rect x="75" y="38" width="22" height="16" rx="2" fill="#FEEAA7" stroke="#2B170C" strokeWidth="2" />
                          {/* Driver silhouette */}
                          <circle cx="86" cy="46" r="4" fill="#2B170C" />
                        </g>
                      ) : (
                        <g>
                          <rect x="22" y="38" width="28" height="16" rx="2" fill={isLocked ? '#9E9E9E' : '#FFF9E6'} stroke="#2B170C" strokeWidth="2" />
                          <rect x="66" y="38" width="28" height="16" rx="2" fill={isLocked ? '#9E9E9E' : '#FFF9E6'} stroke="#2B170C" strokeWidth="2" />
                          <rect x="110" y="38" width="28" height="16" rx="2" fill={isLocked ? '#9E9E9E' : '#FFF9E6'} stroke="#2B170C" strokeWidth="2" />

                          {/* Passenger Bear silhouette inside selected coach */}
                          {isSelected && (
                            <circle cx="80" cy="45" r="5" fill="#8B5A2B" />
                          )}
                        </g>
                      )}

                      {/* Under-carriage & Coupling */}
                      <rect x="6" y="74" width="148" height="6" fill="#2B170C" />

                      {/* Rotating Train Wheels (Subtle rotation animation) */}
                      <g className="wheel-spin" style={{ transformOrigin: '35px 84px' }}>
                        <circle cx="35" cy="84" r="10" fill="#424242" stroke="#2B170C" strokeWidth="2.5" />
                        <circle cx="35" cy="84" r="5" fill="#9E9E9E" />
                        <line x1="35" y1="74" x2="35" y2="94" stroke="#FFF" strokeWidth="1.5" />
                        <line x1="25" y1="84" x2="45" y2="84" stroke="#FFF" strokeWidth="1.5" />
                      </g>
                      <g className="wheel-spin" style={{ transformOrigin: '125px 84px' }}>
                        <circle cx="125" cy="84" r="10" fill="#424242" stroke="#2B170C" strokeWidth="2.5" />
                        <circle cx="125" cy="84" r="5" fill="#9E9E9E" />
                        <line x1="125" y1="74" x2="125" y2="94" stroke="#FFF" strokeWidth="1.5" />
                        <line x1="115" y1="84" x2="135" y2="84" stroke="#FFF" strokeWidth="1.5" />
                      </g>
                    </svg>
                  </div>

                  {/* Coach Title & Subtitle */}
                  <div style={{ marginTop: '6px' }}>
                    <div
                      style={{
                        fontFamily: "'Pixelify Sans', monospace",
                        fontWeight: 'bold',
                        fontSize: '13px',
                        color: isLocked ? '#666' : '#2b170c',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {c.name}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Patrick Hand', cursive",
                        fontSize: '12px',
                        color: isLocked ? '#8B0000' : '#73452a',
                        marginTop: '2px'
                      }}
                    >
                      {isLocked ? `Req: ${c.unlockReq}` : c.interiorTheme}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Railway Tracks Ground Base */}
          <div
            style={{
              height: '14px',
              background: '#4a2816',
              borderTop: '3px solid #2b170c',
              borderBottom: '3px solid #2b170c',
              borderRadius: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              marginTop: '4px'
            }}
          >
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} style={{ width: '4px', height: '100%', background: '#73452a' }} />
            ))}
          </div>

          {/* Action Row: Start Focusing & Coach Inspection Details */}
          <div
            style={{
              marginTop: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '20px' }}>🌲</span>
              <div style={{ fontFamily: "'Patrick Hand', cursive", fontSize: '16px' }}>
                Boarded in <strong>Coach {selectedCoach}: {coaches[selectedCoach].name}</strong>
              </div>
            </div>

            <button
              onClick={handleStart}
              className="pixel-btn pixel-btn-primary"
              style={{
                fontSize: '18px',
                padding: '12px 32px',
                letterSpacing: '1px'
              }}
            >
              🚀 Start Focusing
            </button>
          </div>
        </div>

        {/* Coach Inspection Modal / Detail Drawer if clicked */}
        {inspectCoach && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(20, 15, 10, 0.65)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100,
              padding: '20px'
            }}
            onClick={() => setInspectCoach(null)}
          >
            <div
              style={{
                maxWidth: '460px',
                width: '100%',
                background: '#FCF8EE',
                border: '4px solid #2B170C',
                borderRadius: '14px',
                boxShadow: '0 8px 0 #2B170C',
                padding: '24px'
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ fontFamily: "'Pixelify Sans', monospace", fontSize: '20px', color: '#B82B24' }}>
                  {inspectCoach.name}
                </h3>
                <button
                  onClick={() => setInspectCoach(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '22px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  ✕
                </button>
              </div>

              <p style={{ fontFamily: "'Patrick Hand', cursive", fontSize: '18px', color: '#4A2816', marginBottom: '14px' }}>
                {inspectCoach.description}
              </p>

              {inspectCoach.unlocked ? (
                <div style={{ background: '#E8F8F5', border: '2px solid #27AE60', borderRadius: '8px', padding: '10px', marginBottom: '14px' }}>
                  <div style={{ fontFamily: "'Pixelify Sans', monospace", color: '#27AE60', fontWeight: 'bold' }}>
                    ✓ Coach Unlocked & Ready
                  </div>
                  <div style={{ fontFamily: "'Patrick Hand', cursive", fontSize: '15px' }}>
                    Select this coach to ride in this compartment during your session.
                  </div>
                </div>
              ) : (
                <div style={{ background: '#FDEDEC', border: '2px solid #E74C3C', borderRadius: '8px', padding: '10px', marginBottom: '14px' }}>
                  <div style={{ fontFamily: "'Pixelify Sans', monospace", color: '#C0392B', fontWeight: 'bold' }}>
                    🔒 Unlock Milestone: {inspectCoach.unlockReq}
                  </div>
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontFamily: "'Pixelify Sans', monospace" }}>
                      <span>Progress:</span>
                      <span>{inspectCoach.currentProgress} / {inspectCoach.targetProgress}</span>
                    </div>
                    <div style={{ height: '10px', background: '#D5D8DC', borderRadius: '5px', overflow: 'hidden', marginTop: '4px' }}>
                      <div
                        style={{
                          height: '100%',
                          background: '#E67E22',
                          width: `${Math.min(100, (inspectCoach.currentProgress / inspectCoach.targetProgress) * 100)}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                {inspectCoach.selectable && inspectCoach.unlocked && (
                  <button
                    onClick={() => {
                      onSelectCoach(inspectCoach.id);
                      setInspectCoach(null);
                    }}
                    className="pixel-btn pixel-btn-train"
                    style={{ fontSize: '14px' }}
                  >
                    Select This Coach
                  </button>
                )}
                <button
                  onClick={() => setInspectCoach(null)}
                  className="pixel-btn pixel-btn-parchment"
                  style={{ fontSize: '14px' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Decorative Station Platform Footer */}
      <footer
        style={{
          background: '#1b3827',
          borderTop: '4px solid #2b170c',
          padding: '12px 24px',
          color: '#d4bc92',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 10
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontFamily: "'Pixelify Sans', monospace" }}>
          <span>🇨🇭</span>
          <span>Station: Zermatt Central • Elevation: 1,608m</span>
        </div>
        <div style={{ fontFamily: "'Patrick Hand', cursive", fontSize: '15px' }}>
          Relax, breathe deeply, and enjoy your focus journey.
        </div>
      </footer>

      <style>{`
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        .wheel-spin {
          animation: wheel-rotate 4s linear infinite;
        }
        @keyframes wheel-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
