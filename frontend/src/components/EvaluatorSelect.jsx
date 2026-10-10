import React, { useState } from 'react';
import { soundService } from '../services/soundService';

export default function EvaluatorSelect({
  topicTitle = 'Biology: Cell Structure',
  onSelectEvaluator,
  onCancel
}) {
  const [selected, setSelected] = useState('conductor');

  const evaluators = [
    {
      id: 'child',
      name: 'The Capybara',
      avatar: '/assets/evaluator_capybara_vibe.png',
      traits: 'Curious • Gentle',
      badge: 'Beginner friendly',
      badgeBg: '#E8F5E9',
      badgeColor: '#2E7D32'
    },
    {
      id: 'conductor',
      name: 'The Conductor',
      avatar: '/assets/evaluator_conductor_vibe.png',
      traits: 'Encouraging • Balanced',
      badge: 'Moderately strict',
      badgeBg: '#FFF3E0',
      badgeColor: '#D35400'
    },
    {
      id: 'professor',
      name: 'The Professor',
      avatar: '/assets/evaluator_professor_vibe.png',
      traits: 'Analytical • Rigorous',
      badge: 'Most valuable rewards',
      badgeBg: '#F3E5F5',
      badgeColor: '#6A1B9A'
    }
  ];

  const handleSelect = (id) => {
    soundService.playClick();
    setSelected(id);
  };

  const handleConfirm = () => {
    soundService.playClick();
    onSelectEvaluator(selected);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #162f22, #234832 60%, #162f22)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 20px',
        color: '#2A1810'
      }}
    >
      {/* Wooden Hanging Next Stop Sign (Matching Panel 5) */}
      <div
        style={{
          background: '#FCF8EF',
          border: '3px solid #381E10',
          borderRadius: '10px',
          boxShadow: '0 4px 0 #201007',
          padding: '8px 28px',
          textAlign: 'center',
          marginBottom: '24px'
        }}
      >
        <div style={{ fontSize: '11px', fontWeight: '800', color: '#B82B24', letterSpacing: '1px' }}>
          NEXT STOP
        </div>
        <div style={{ fontSize: '20px', fontWeight: '800', color: '#2A1810' }}>
          {topicTitle}
        </div>
      </div>

      {/* 3 Character Cards Container */}
      <div
        className="vibe-wood-card"
        style={{
          width: '100%',
          maxWidth: '820px',
          padding: '24px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '18px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#2A1810' }}>
            Choose an Evaluator
          </h3>
          <p style={{ fontSize: '14px', color: '#73452A' }}>
            Each has a unique personality and reward value
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '22px' }}>
          {evaluators.map((ev) => {
            const isChosen = selected === ev.id;
            return (
              <div
                key={ev.id}
                onClick={() => handleSelect(ev.id)}
                style={{
                  background: isChosen ? '#FEF7EC' : '#FFFFFF',
                  border: isChosen ? '3px solid #B82B24' : '2px solid #D4BC92',
                  borderRadius: '12px',
                  boxShadow: isChosen ? '0 4px 0 #B82B24' : '0 2px 4px rgba(0,0,0,0.06)',
                  padding: '16px 12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transform: isChosen ? 'translateY(-3px)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {/* Character Avatar */}
                <div
                  style={{
                    width: '84px',
                    height: '84px',
                    margin: '0 auto 10px auto',
                    borderRadius: '50%',
                    border: '2px solid #381E10',
                    overflow: 'hidden',
                    background: '#FFF'
                  }}
                >
                  <img
                    src={ev.avatar}
                    alt={ev.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      // Fallback avatar
                      e.target.src = `/assets/avatar_${ev.id === 'child' ? 'capybara' : ev.id}.png`;
                    }}
                  />
                </div>

                <div style={{ fontSize: '16px', fontWeight: '800', color: '#2A1810' }}>
                  {ev.name}
                </div>
                <div style={{ fontSize: '13px', color: '#73452A', margin: '3px 0 8px 0' }}>
                  {ev.traits}
                </div>

                <span
                  style={{
                    background: ev.badgeBg,
                    color: ev.badgeColor,
                    padding: '3px 8px',
                    borderRadius: '999px',
                    fontSize: '11px',
                    fontWeight: '700'
                  }}
                >
                  {ev.badge}
                </span>
              </div>
            );
          })}
        </div>

        {/* Action Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => { soundService.playClick(); onCancel(); }}
            className="btn-wood"
            style={{ padding: '8px 16px', fontSize: '13px' }}
          >
            ← Back to Train
          </button>

          <button
            onClick={handleConfirm}
            className="btn-green-pill"
            style={{ padding: '10px 28px', fontSize: '15px' }}
          >
            Open Study Book →
          </button>
        </div>
      </div>
    </div>
  );
}
