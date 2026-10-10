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
      name: 'Driver Engine',
      type: 'engine',
      selectable: false,
      desc: 'Locomotive driver engine.'
    },
    {
      id: 1,
      name: 'Coach 1',
      subtitle: 'Alpine Cedar',
      type: 'passenger',
      selectable: true,
      unlocked: true,
      desc: 'Warm cedar paneling with green velvet seats.'
    },
    {
      id: 2,
      name: 'Coach 2',
      subtitle: 'Panorama Vista',
      type: 'passenger',
      selectable: unlockedCoaches[2],
      unlocked: unlockedCoaches[2],
      req: '10 Professor Excellent stamps',
      progress: profExcellentCount,
      target: 10,
      desc: 'Glass arched ceiling overlooking the Alps.'
    },
    {
      id: 3,
      name: 'Coach 3',
      subtitle: 'Grand Academy',
      type: 'passenger',
      selectable: unlockedCoaches[3],
      unlocked: unlockedCoaches[3],
      req: '20 Total Excellent stamps',
      progress: totalExcellentCount,
      target: 20,
      desc: 'Scholars salon with archival library.'
    }
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #11251b, #1b3827 50%, #162f22)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        color: '#2A1810',
        userSelect: 'none'
      }}
    >
      {/* Top Header Bar */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 28px',
          zIndex: 10
        }}
      >
        {/* onTrack Logo matching Panel 1 of master reference */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '26px' }}>🏔️</span>
            <span
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '28px',
                fontWeight: '900',
                color: '#FFF',
                letterSpacing: '-0.5px'
              }}
            >
              onTrack
            </span>
          </div>
          <div style={{ fontSize: '13px', color: '#D4BC92', fontWeight: '500', marginLeft: '34px', letterSpacing: '1px' }}>
            study • reflect • journey • grow
          </div>
        </div>

        {/* Header Navigation Buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => { soundService.playClick(); onOpenJournal(); }}
            className="btn-wood"
            style={{ padding: '8px 16px', fontSize: '13px' }}
          >
            📖 Travel Journal
          </button>
          <button
            onClick={() => { soundService.playClick(); onOpenHub(); }}
            className="btn-wood"
            style={{ padding: '8px 16px', fontSize: '13px', background: '#FDF6E2', borderColor: '#E67E22', color: '#B82B24' }}
          >
            💼 Productivity Hub
          </button>
        </div>
      </header>

      {/* Main Center Area: Train & Coach Selection */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}
      >
        {/* Station Landing Banner Card (Matching Panel 1) */}
        <div
          className="vibe-wood-card"
          style={{
            width: '100%',
            maxWidth: '780px',
            padding: '24px 28px',
            textAlign: 'center',
            position: 'relative'
          }}
        >
          {/* Tagline */}
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#2A1810', marginBottom: '4px' }}>
            Start at the Train Station
          </h1>
          <p style={{ fontSize: '15px', color: '#73452A', marginBottom: '20px' }}>
            Choose your coach and begin your study journey
          </p>

          {/* 4 Connected Coaches Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '24px' }}>
            {coaches.map((c) => {
              const isSelected = selectedCoach === c.id;
              const isLocked = !c.unlocked;

              return (
                <div
                  key={c.id}
                  onClick={() => {
                    soundService.playClick();
                    if (c.selectable && c.unlocked) {
                      onSelectCoach(c.id);
                    } else if (isLocked) {
                      setInspectCoach(c);
                    }
                  }}
                  style={{
                    background: isLocked ? '#E2D5C3' : isSelected ? '#FEF7EC' : '#FFFFFF',
                    border: isSelected ? '3px solid #B82B24' : '2px solid #D4BC92',
                    borderRadius: '10px',
                    padding: '12px 8px',
                    cursor: c.selectable ? 'pointer' : 'default',
                    boxShadow: isSelected ? '0 4px 0 #B82B24' : '0 2px 4px rgba(0,0,0,0.06)',
                    transform: isSelected ? 'translateY(-2px)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ fontSize: '22px', marginBottom: '4px' }}>
                    {c.type === 'engine' ? '🚂' : isLocked ? '🔒' : isSelected ? '★' : '🚃'}
                  </div>

                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#2A1810' }}>
                    {c.name}
                  </div>
                  {c.subtitle && (
                    <div style={{ fontSize: '11px', color: '#73452A', fontWeight: '600' }}>
                      {c.subtitle}
                    </div>
                  )}

                  <div style={{ marginTop: '6px' }}>
                    <span
                      style={{
                        background: c.type === 'engine' ? '#4A2816' : isLocked ? '#9E9E9E' : isSelected ? '#B82B24' : '#27AE60',
                        color: '#FFF',
                        padding: '2px 6px',
                        borderRadius: '999px',
                        fontSize: '10px',
                        fontWeight: '700'
                      }}
                    >
                      {c.type === 'engine' ? 'DRIVER' : isLocked ? 'LOCKED' : isSelected ? 'READY' : 'SELECT'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Start Focusing Green Pill Button (Matching Panel 1) */}
          <button
            onClick={() => {
              soundService.playClick();
              soundService.playStationBell();
              onStartJourney();
            }}
            className="btn-green-pill"
            style={{
              padding: '14px 44px',
              fontSize: '18px'
            }}
          >
            Start Focusing
          </button>
        </div>

        {/* Coach Lock Details Modal */}
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
              className="vibe-wood-card"
              style={{ maxWidth: '400px', width: '100%', padding: '24px' }}
              onClick={e => e.stopPropagation()}
            >
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#B82B24', marginBottom: '8px' }}>
                🔒 {inspectCoach.name} ({inspectCoach.subtitle})
              </h3>
              <p style={{ fontSize: '14px', color: '#73452A', marginBottom: '14px' }}>
                {inspectCoach.desc}
              </p>

              <div style={{ background: '#FFF3E0', border: '1px solid #FFE0B2', borderRadius: '8px', padding: '10px', marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#D35400' }}>
                  Unlock Requirement:
                </div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#2A1810', marginTop: '2px' }}>
                  {inspectCoach.req}
                </div>
                <div style={{ fontSize: '12px', color: '#73452A', marginTop: '4px' }}>
                  Progress: {inspectCoach.progress} / {inspectCoach.target}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <button onClick={() => setInspectCoach(null)} className="btn-wood" style={{ padding: '6px 16px', fontSize: '13px' }}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ padding: '12px 28px', textAlign: 'center', color: '#9AB8A4', fontSize: '13px' }}>
        onTrack • Swiss Alpine Study Express
      </footer>
    </div>
  );
}
