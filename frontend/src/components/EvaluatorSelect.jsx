import React, { useState } from 'react';
import { soundService } from '../services/soundService';

export default function EvaluatorSelect({
  topicTitle = 'Photosynthesis',
  taskDescription = '',
  onSelectEvaluator,
  onCancel
}) {
  const [selected, setSelected] = useState('conductor');

  const evaluators = [
    {
      id: 'child',
      name: 'Capybara Child',
      title: 'The Curious 5-Year-Old',
      avatar: '/assets/avatar_capybara.png',
      badge: 'GENTLE & CURIOUS',
      badgeColor: '#27AE60',
      strictness: 'Low ★☆☆',
      rewardMultiplier: '1x Value (Basic)',
      description: 'Curious, innocent, and kind. Asks simple questions and rewards intuitive explanations without needing heavy jargon.',
      favoriteFor: 'Introductory topics or relaxed explanations',
      quote: '"Ooh! Can you tell me what that is like I was five?"'
    },
    {
      id: 'conductor',
      name: 'Friendly Conductor',
      title: 'The Railway Guide',
      avatar: '/assets/avatar_conductor.png',
      badge: 'BALANCED & WARM',
      badgeColor: '#E67E22',
      strictness: 'Medium ★★☆',
      rewardMultiplier: '2x Value (Standard)',
      description: 'Warm and knowledgeable dog conductor. Checks whether your explanation is clear, coherent, and covers the essential steps.',
      favoriteFor: 'Everyday study sessions & balanced feedback',
      quote: '"All aboard! Let’s make sure you know the route of this concept."'
    },
    {
      id: 'professor',
      name: 'Strict Professor',
      title: 'Academy Chair Mandrill',
      avatar: '/assets/avatar_professor.png',
      badge: 'STRICT & RIGOROUS',
      badgeColor: '#8E44AD',
      strictness: 'High ★★★',
      rewardMultiplier: '3x Value (Prestige)',
      description: 'Analytical and exacting baboon scholar. Demands conceptual correctness, cause-and-effect reasoning, and precision.',
      favoriteFor: 'Earning Professor — Excellent stamps to unlock Coach 2!',
      quote: '"Accuracy is paramount. Demonstrate your true depth of mastery."'
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
        background: 'linear-gradient(to bottom, #11251b, #1e3f2e 60%, #11251b)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 20px',
        color: '#2B170C'
      }}
      className="evaluator-select-page"
    >
      <div
        style={{
          maxWidth: '920px',
          width: '100%',
          background: '#FCF8EE',
          border: '4px solid #2B170C',
          borderRadius: '16px',
          boxShadow: '0 8px 0 #2B170C, inset 0 2px 0 rgba(255,255,255,0.8)',
          padding: '28px',
          position: 'relative'
        }}
      >
        {/* Station Sign & Topic Header */}
        <div
          style={{
            textAlign: 'center',
            borderBottom: '3px dashed #D4BC92',
            paddingBottom: '20px',
            marginBottom: '24px'
          }}
        >
          {/* Alpine Station Wooden Sign */}
          <div
            style={{
              display: 'inline-block',
              background: '#2B170C',
              color: '#FDF6E2',
              padding: '6px 24px',
              borderRadius: '6px',
              border: '3px solid #73452A',
              boxShadow: '0 4px 0 #180B05',
              fontFamily: "'Pixelify Sans', monospace",
              fontSize: '15px',
              letterSpacing: '2px',
              marginBottom: '10px'
            }}
          >
            🚉 ALPINE STATION STOP REACHED
          </div>

          <h2
            style={{
              fontFamily: "'Pixelify Sans', monospace",
              fontSize: '28px',
              color: '#B82B24',
              marginBottom: '6px'
            }}
          >
            Topic: {topicTitle}
          </h2>
          <p style={{ fontFamily: "'Patrick Hand', cursive", fontSize: '18px', color: '#73452A' }}>
            Choose which traveling scholar you will explain your learning to inside your study journal:
          </p>
        </div>

        {/* 3 Evaluator Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px',
            marginBottom: '28px'
          }}
        >
          {evaluators.map((ev) => {
            const isChosen = selected === ev.id;
            return (
              <div
                key={ev.id}
                onClick={() => handleSelect(ev.id)}
                style={{
                  background: isChosen ? '#FEF7EC' : '#FFF',
                  border: isChosen ? '4px solid #B82B24' : '3px solid #2B170C',
                  borderRadius: '12px',
                  boxShadow: isChosen ? '0 6px 0 #B82B24' : '0 4px 0 #2B170C',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                  transform: isChosen ? 'translateY(-4px)' : 'none',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
                className="evaluator-card hover:scale-102"
              >
                {/* Strictness & Badge */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span
                      style={{
                        background: ev.badgeColor,
                        color: '#FFF',
                        fontFamily: "'Pixelify Sans', monospace",
                        fontSize: '10px',
                        padding: '2px 8px',
                        borderRadius: '999px',
                        fontWeight: 'bold'
                      }}
                    >
                      {ev.badge}
                    </span>
                    <span style={{ fontFamily: "'Pixelify Sans', monospace", fontSize: '12px', color: '#73452A', fontWeight: 'bold' }}>
                      {ev.strictness}
                    </span>
                  </div>

                  {/* Avatar Portrait */}
                  <div
                    style={{
                      width: '100px',
                      height: '100px',
                      margin: '0 auto 12px auto',
                      borderRadius: '50%',
                      border: '3px solid #2B170C',
                      overflow: 'hidden',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
                      background: '#FFF'
                    }}
                  >
                    <img
                      src={ev.avatar}
                      alt={ev.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        // Fallback emoji if image failed
                        e.target.style.display = 'none';
                        e.target.parentNode.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:42px;">${
                          ev.id === 'child' ? '🐾' : ev.id === 'conductor' ? '🐶' : '🐵'
                        }</div>`;
                      }}
                    />
                  </div>

                  {/* Character Name & Title */}
                  <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                    <div style={{ fontFamily: "'Pixelify Sans', monospace", fontSize: '18px', fontWeight: 'bold', color: '#2B170C' }}>
                      {ev.name}
                    </div>
                    <div style={{ fontFamily: "'Patrick Hand', cursive", fontSize: '14px', color: '#73452A' }}>
                      {ev.title}
                    </div>
                  </div>

                  {/* Quote */}
                  <div
                    style={{
                      fontFamily: "'Patrick Hand', cursive",
                      fontSize: '14px',
                      fontStyle: 'italic',
                      color: '#4A2816',
                      background: 'rgba(212, 188, 146, 0.25)',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      marginBottom: '10px',
                      textAlign: 'center'
                    }}
                  >
                    {ev.quote}
                  </div>

                  <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '13px', color: '#555', lineHeight: 1.4, marginBottom: '12px' }}>
                    {ev.description}
                  </p>
                </div>

                {/* Reward Multiplier Banner */}
                <div
                  style={{
                    background: '#FAF0E6',
                    border: '1px solid #D4BC92',
                    borderRadius: '6px',
                    padding: '8px',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontFamily: "'Pixelify Sans', monospace", fontSize: '12px', color: '#B82B24', fontWeight: 'bold' }}>
                    💎 Reward: {ev.rewardMultiplier}
                  </div>
                  <div style={{ fontFamily: "'Patrick Hand', cursive", fontSize: '12px', color: '#73452A', marginTop: '2px' }}>
                    {ev.favoriteFor}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '3px dashed #D4BC92', paddingTop: '16px' }}>
          <button
            onClick={() => { soundService.playClick(); onCancel(); }}
            className="pixel-btn pixel-btn-parchment"
            style={{ fontSize: '14px' }}
          >
            ← Return to Coach
          </button>

          <button
            onClick={handleConfirm}
            className="pixel-btn pixel-btn-train"
            style={{ fontSize: '17px', padding: '12px 32px' }}
          >
            📖 Open Study Book with {evaluators.find(e => e.id === selected)?.name} →
          </button>
        </div>
      </div>
    </div>
  );
}
