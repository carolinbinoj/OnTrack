import React, { useState } from 'react';
import { soundService } from '../services/soundService';

export default function StudyBook({
  topicTitle = 'Photosynthesis',
  taskDescription = '',
  evaluatorType = 'conductor', // 'child' | 'conductor' | 'professor'
  onSubmitExplanation,
  onBackToEvaluators,
  isSubmitting = false
}) {
  const [page, setPage] = useState(1);
  const [explanation, setExplanation] = useState('');
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' | 'diagram' | 'rubric'

  // Backdrop scene images matching the user uploaded references
  const backdropImages = {
    child: '/assets/evaluator_capybara_scene.jpg',
    conductor: '/assets/evaluator_conductor_scene.jpg',
    professor: '/assets/evaluator_professor_scene.jpg'
  };

  const evaluatorTitles = {
    child: 'Capybara Child (Curious 5yo)',
    conductor: 'Friendly Conductor Dog',
    professor: 'Professor Baboon of Alpine Academy'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!explanation.trim()) {
      alert('Please explain what you learned in your own words before submitting.');
      return;
    }
    soundService.playClick();
    onSubmitExplanation({
      topic: topicTitle,
      explanation: explanation.trim(),
      evaluatorType
    });
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        minHeight: '100vh',
        overflowX: 'hidden',
        overflowY: 'auto',
        background: '#1A0E07',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 10px'
      }}
      className="study-book-screen"
    >
      {/* Background Illustrated Compartment Backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `url(${backdropImages[evaluatorType] || backdropImages.conductor})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(3px) brightness(0.65)',
          transform: 'scale(1.04)',
          zIndex: 1
        }}
      />

      {/* Foreground Interactive Study Book Container */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '1020px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {/* Top Evaluator Presence Banner */}
        <div
          style={{
            background: 'rgba(252, 248, 238, 0.96)',
            border: '3px solid #2B170C',
            borderRadius: '12px 12px 0 0',
            padding: '8px 24px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '92%',
            marginBottom: '-4px',
            zIndex: 15
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>
              {evaluatorType === 'child' ? '🐾' : evaluatorType === 'conductor' ? '🐶' : '🎓'}
            </span>
            <span style={{ fontFamily: "'Pixelify Sans', monospace", fontSize: '15px', fontWeight: 'bold', color: '#B82B24' }}>
              Explaining to: {evaluatorTitles[evaluatorType]}
            </span>
          </div>

          <button
            onClick={() => { soundService.playClick(); onBackToEvaluators(); }}
            className="pixel-btn pixel-btn-parchment"
            style={{ padding: '4px 10px', fontSize: '11px' }}
          >
            ← Change Evaluator
          </button>
        </div>

        {/* 2-PAGE OPEN PHYSICAL PARCHMENT BOOK */}
        <div
          style={{
            width: '100%',
            background: '#4A2816',
            border: '8px solid #2B170C',
            borderRadius: '18px',
            boxShadow: '0 12px 24px rgba(0,0,0,0.6), inset 0 2px 4px rgba(255,255,255,0.2)',
            padding: '16px 20px',
            position: 'relative'
          }}
          className="open-book-frame"
        >
          {/* Red Ribbon Bookmark Hanging at Center Top */}
          <div
            style={{
              position: 'absolute',
              top: '-6px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '24px',
              height: '42px',
              background: '#C0392B',
              border: '2px solid #5C140F',
              borderTop: 'none',
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)',
              zIndex: 30
            }}
          />

          {/* Book Pages Container */}
          <div
            style={{
              background: '#FBF6EA',
              border: '2px solid #D4BC92',
              borderRadius: '12px',
              boxShadow: 'inset 0 0 16px rgba(180, 150, 100, 0.35)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: '0',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Center Fold Shadow */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: '50%',
                width: '32px',
                transform: 'translateX(-50%)',
                background: 'linear-gradient(to right, rgba(0,0,0,0.12), transparent 45%, transparent 55%, rgba(0,0,0,0.12))',
                pointerEvents: 'none',
                zIndex: 20
              }}
            />

            {/* === PAGE 1 (LEFT PAGE: Today's Learning & Explanation Text Area) === */}
            <div
              style={{
                padding: '24px 28px',
                borderRight: '2px solid #E6D7BD',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '440px'
              }}
              className="book-page-left"
            >
              <div>
                {/* Page 1 Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div
                    style={{
                      background: '#EAE1CE',
                      padding: '4px 12px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      border: '1px solid #D4BC92'
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>🍃</span>
                    <span style={{ fontFamily: "'Pixelify Sans', monospace", fontSize: '16px', fontWeight: 'bold', color: '#2B170C' }}>
                      Today's Learning
                    </span>
                  </div>
                  <span style={{ fontFamily: "'Patrick Hand', cursive", fontSize: '15px', color: '#73452A' }}>
                    Page 1 of 2
                  </span>
                </div>

                {/* Prompt Question */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontFamily: "'Patrick Hand', cursive", fontSize: '20px', fontWeight: 'bold', color: '#2B170C' }}>
                    Explain {topicTitle} in your own words:
                  </div>
                  <div style={{ fontFamily: "'Patrick Hand', cursive", fontSize: '15px', color: '#73452A', marginTop: '2px' }}>
                    {evaluatorType === 'child'
                      ? 'Keep it simple and fun! Use analogies a five-year-old would enjoy.'
                      : evaluatorType === 'professor'
                      ? 'Be precise. Explain the core mechanism, inputs, outputs, and significance.'
                      : 'Cover the essential concepts clearly and logically.'}
                  </div>
                </div>

                {/* Handwritten Lined Parchment Editable Text Area */}
                <div
                  style={{
                    background: '#FBF6EA',
                    backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 27px, #E2D5BE 28px)',
                    lineHeight: '28px',
                    borderRadius: '6px',
                    border: '1px solid #D4BC92',
                    padding: '8px 12px',
                    position: 'relative'
                  }}
                >
                  <textarea
                    rows={8}
                    value={explanation}
                    onChange={e => setExplanation(e.target.value)}
                    placeholder="Type your explanation here on the parchment lines... e.g. Plants use sunlight, water, and carbon dioxide inside chloroplasts..."
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      resize: 'none',
                      fontFamily: "'Patrick Hand', cursive",
                      fontSize: '19px',
                      lineHeight: '28px',
                      color: '#2B170C',
                      minHeight: '220px'
                    }}
                  />
                </div>
              </div>

              {/* Page 1 Bottom Navigation Controls */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '16px',
                  paddingTop: '8px',
                  borderTop: '1px dashed #D4BC92'
                }}
              >
                <div style={{ fontFamily: "'Patrick Hand', cursive", fontSize: '14px', color: '#73452A' }}>
                  ✍️ {explanation.trim().split(/\s+/).filter(Boolean).length} words written
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => {
                      if (!explanation) {
                        setExplanation(
                          'Plants take in sunlight, water from the soil, and carbon dioxide from the air. Inside the chloroplasts, chlorophyll absorbs light energy and converts it into glucose sugar for food, while releasing oxygen into the atmosphere.'
                        );
                      }
                    }}
                    style={{
                      background: 'none',
                      border: '1px solid #D4BC92',
                      borderRadius: '4px',
                      padding: '2px 8px',
                      fontFamily: "'Patrick Hand', cursive",
                      fontSize: '13px',
                      cursor: 'pointer',
                      color: '#73452A'
                    }}
                    title="Insert sample notes"
                  >
                    ✏️ Load sample explanation
                  </button>
                </div>
              </div>
            </div>

            {/* === PAGE 2 (RIGHT PAGE: Reference Notes, Diagram & Concept Checklist) === */}
            <div
              style={{
                padding: '24px 28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '440px',
                position: 'relative'
              }}
              className="book-page-right"
            >
              <div>
                {/* Page 2 Header with Category Tabs */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => setActiveTab('notes')}
                      style={{
                        background: activeTab === 'notes' ? '#27AE60' : '#EAE1CE',
                        color: activeTab === 'notes' ? '#FFF' : '#2B170C',
                        border: '1px solid #D4BC92',
                        borderRadius: '4px',
                        padding: '2px 8px',
                        fontFamily: "'Pixelify Sans', monospace",
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      🌿 Summary
                    </button>
                    <button
                      onClick={() => setActiveTab('diagram')}
                      style={{
                        background: activeTab === 'diagram' ? '#27AE60' : '#EAE1CE',
                        color: activeTab === 'diagram' ? '#FFF' : '#2B170C',
                        border: '1px solid #D4BC92',
                        borderRadius: '4px',
                        padding: '2px 8px',
                        fontFamily: "'Pixelify Sans', monospace",
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      🔬 Diagram
                    </button>
                    <button
                      onClick={() => setActiveTab('rubric')}
                      style={{
                        background: activeTab === 'rubric' ? '#27AE60' : '#EAE1CE',
                        color: activeTab === 'rubric' ? '#FFF' : '#2B170C',
                        border: '1px solid #D4BC92',
                        borderRadius: '4px',
                        padding: '2px 8px',
                        fontFamily: "'Pixelify Sans', monospace",
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      📋 Rubric
                    </button>
                  </div>
                  <span style={{ fontFamily: "'Patrick Hand', cursive", fontSize: '15px', color: '#73452A' }}>
                    Page 2 of 2
                  </span>
                </div>

                {/* Tab Content Display */}
                {activeTab === 'notes' && (
                  <div style={{ fontFamily: "'Patrick Hand', cursive", fontSize: '18px', color: '#2B170C', lineHeight: 1.5 }}>
                    <p style={{ marginBottom: '10px' }}>
                      <strong>Topic Overview:</strong>
                    </p>
                    <p style={{ marginBottom: '12px' }}>
                      {taskDescription ||
                        'Plants use sunlight, water, and carbon dioxide to make food. This process happens in the chloroplasts, where chlorophyll absorbs light energy. The plant converts this energy into glucose and releases oxygen.'}
                    </p>
                    <div style={{ background: '#F4ECE1', padding: '10px 14px', borderRadius: '6px', border: '1px dashed #D4BC92' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#B82B24', marginBottom: '4px' }}>
                        💡 Key Recall Concepts:
                      </div>
                      <ul style={{ paddingLeft: '18px', fontSize: '16px' }}>
                        <li>Inputs: Light energy, H₂O, CO₂</li>
                        <li>Location: Chloroplasts (Chlorophyll pigment)</li>
                        <li>Outputs: Glucose (energy store), O₂ (oxygen byproduct)</li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'diagram' && (
                  <div style={{ textAlign: 'center', padding: '10px 0' }}>
                    <svg viewBox="0 0 280 160" width="100%" height="150" style={{ imageRendering: 'pixelated' }}>
                      {/* Sun */}
                      <circle cx="50" cy="40" r="14" fill="#F1C40F" stroke="#E67E22" strokeWidth="2" />
                      <line x1="50" y1="20" x2="50" y2="12" stroke="#E67E22" strokeWidth="2" />
                      <line x1="50" y1="60" x2="50" y2="68" stroke="#E67E22" strokeWidth="2" />
                      <line x1="30" y1="40" x2="22" y2="40" stroke="#E67E22" strokeWidth="2" />
                      <line x1="70" y1="40" x2="78" y2="40" stroke="#E67E22" strokeWidth="2" />
                      <text x="50" y="44" textAnchor="middle" fill="#2B170C" fontSize="9" fontFamily="'Pixelify Sans', monospace">Sunlight</text>

                      {/* Plant in pot */}
                      <ellipse cx="140" cy="140" rx="30" ry="8" fill="#8B5A2B" />
                      <path d="M 140 138 L 140 70" stroke="#27AE60" strokeWidth="5" />
                      {/* Leaves */}
                      <path d="M 140 100 Q 110 80 120 70 Q 140 90 140 100" fill="#2ECC71" stroke="#27AE60" strokeWidth="1.5" />
                      <path d="M 140 90 Q 170 70 160 60 Q 140 80 140 90" fill="#2ECC71" stroke="#27AE60" strokeWidth="1.5" />
                      <path d="M 140 70 Q 130 45 140 40 Q 150 45 140 70" fill="#27AE60" stroke="#1E8449" strokeWidth="1.5" />

                      {/* Chemical arrows */}
                      <text x="75" y="100" fill="#2980B9" fontSize="11" fontFamily="'Pixelify Sans', monospace">CO₂ + H₂O ➜</text>
                      <text x="175" y="100" fill="#C0392B" fontSize="11" fontFamily="'Pixelify Sans', monospace">➜ Glucose + O₂</text>
                    </svg>
                    <div style={{ fontFamily: "'Patrick Hand', cursive", fontSize: '15px', color: '#73452A' }}>
                      Visual flow of inputs into organic glucose and oxygen.
                    </div>
                  </div>
                )}

                {activeTab === 'rubric' && (
                  <div style={{ fontFamily: "'Patrick Hand', cursive", fontSize: '16px', color: '#2B170C' }}>
                    <div style={{ fontWeight: 'bold', color: '#B82B24', marginBottom: '6px' }}>
                      Evaluator Rubric Thresholds:
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ background: '#FFF9E6', padding: '6px 10px', borderRadius: '4px', border: '1px solid #F1C40F' }}>
                        ⭐ <strong>90–100%: Excellent</strong> → Earns highest tier stamp & progress toward coach unlock!
                      </div>
                      <div style={{ background: '#E8F8F5', padding: '6px 10px', borderRadius: '4px', border: '1px solid #2ECC71' }}>
                        🍀 <strong>70–89%: Good</strong> → Earns Good quality collectible stamp.
                      </div>
                      <div style={{ background: '#FEF9E7', padding: '6px 10px', borderRadius: '4px', border: '1px solid #E67E22' }}>
                        🌱 <strong>40–69%: Can Improve</strong> → Earns introductory stamp + helpful tips.
                      </div>
                      <div style={{ background: '#FDEDEC', padding: '6px 10px', borderRadius: '4px', border: '1px solid #E74C3C' }}>
                        ❌ <strong>Below 40%</strong> → No stamp awarded, free retry without penalty.
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Page 2 Bottom Footer */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  marginTop: '16px',
                  paddingTop: '8px',
                  borderTop: '1px dashed #D4BC92'
                }}
              >
                <div style={{ fontFamily: "'Patrick Hand', cursive", fontSize: '14px', color: '#73452A' }}>
                  onTrack Alpine Field Notes • {topicTitle}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SUBMIT JOURNAL BUTTON (Green Pixel Art Button below book) */}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !explanation.trim()}
            className="pixel-btn pixel-btn-primary"
            style={{
              fontSize: '20px',
              padding: '14px 44px',
              borderRadius: '8px',
              letterSpacing: '1px',
              boxShadow: '0 8px 0 #1E824C, 0 12px 20px rgba(0,0,0,0.4)'
            }}
          >
            {isSubmitting ? '⏳ Submitting Journal to Evaluator...' : '📗 Submit Journal'}
          </button>

          {isSubmitting && (
            <div
              style={{
                marginTop: '10px',
                fontFamily: "'Patrick Hand', cursive",
                fontSize: '16px',
                color: '#FFF',
                textShadow: '0 2px 4px #000'
              }}
            >
              The evaluator is reviewing your explanation and preparing your stamp feedback...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
