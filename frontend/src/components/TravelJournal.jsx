import React, { useState } from 'react';
import StampRenderer, { STAMP_CONFIGS } from './StampRenderer';
import { soundService } from '../services/soundService';

export default function TravelJournal({
  stampsData = {},
  sessions = [],
  profExcellentCount = 0,
  totalExcellentCount = 0,
  onClose
}) {
  const [selectedStampId, setSelectedStampId] = useState('professor_excellent');

  // 3x3 Matrix of stamps:
  const matrix = [
    {
      evaluator: 'Capybara Child',
      rowKey: 'child',
      stamps: ['child_can_improve', 'child_good', 'child_excellent']
    },
    {
      evaluator: 'Friendly Conductor',
      rowKey: 'conductor',
      stamps: ['conductor_can_improve', 'conductor_good', 'conductor_excellent']
    },
    {
      evaluator: 'Strict Professor',
      rowKey: 'professor',
      stamps: ['professor_can_improve', 'professor_good', 'professor_excellent']
    }
  ];

  // Count distinct stamps unlocked
  const distinctCount = Object.keys(STAMP_CONFIGS).filter(
    id => (stampsData[id]?.count || 0) > 0
  ).length;

  const isCollectionComplete = distinctCount === 9;

  // Selected stamp info
  const selectedConfig = STAMP_CONFIGS[selectedStampId] || STAMP_CONFIGS.professor_excellent;
  const selectedCount = stampsData[selectedStampId]?.count || 0;
  const isSelectedLocked = selectedCount === 0;

  // Relevant sessions for this stamp
  const relevantSessions = sessions.filter(s => s.stamp_id === selectedStampId);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 10, 5, 0.82)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 120,
        padding: '20px'
      }}
      className="travel-journal-modal"
    >
      <div
        style={{
          width: '100%',
          maxWidth: '960px',
          maxHeight: '92vh',
          background: '#4A2816',
          border: '6px solid #2B170C',
          borderRadius: '18px',
          boxShadow: '0 12px 0 #180B05, 0 20px 40px rgba(0,0,0,0.7)',
          padding: '24px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        className="journal-leather-binder"
      >
        {/* Red Ribbon Bookmark */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: '48px',
            width: '28px',
            height: '46px',
            background: '#C0392B',
            border: '2px solid #5C140F',
            borderTop: 'none',
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)',
            zIndex: 30
          }}
        />

        {/* Top Header of Journal */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            color: '#FDF6E2'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '28px' }}>📖</span>
            <div>
              <h2
                style={{
                  fontFamily: "'Pixelify Sans', monospace",
                  fontSize: '24px',
                  color: '#F1C40F',
                  margin: 0,
                  letterSpacing: '1px'
                }}
              >
                Alpine Travel Journal & Stamp Album
              </h2>
              <div style={{ fontFamily: "'Patrick Hand', cursive", fontSize: '16px', color: '#E2D5C3' }}>
                Collection: {distinctCount} / 9 Unique Stamps Discovered
              </div>
            </div>
          </div>

          <button
            onClick={() => { soundService.playClick(); onClose(); }}
            className="pixel-btn pixel-btn-train"
            style={{ padding: '6px 14px', fontSize: '13px' }}
          >
            ✕ Close Journal
          </button>
        </div>

        {/* Parchment Book Interior Surface */}
        <div
          style={{
            background: '#FCF8EE',
            border: '3px solid #D4BC92',
            borderRadius: '12px',
            boxShadow: 'inset 0 0 20px rgba(180, 150, 100, 0.4)',
            padding: '20px',
            flex: 1,
            overflowY: 'auto',
            display: 'grid',
            gridTemplateColumns: '1.4fr 1fr',
            gap: '24px'
          }}
        >
          {/* Left Column: 3x3 Postage Stamp Grid */}
          <div>
            {isCollectionComplete && (
              <div
                style={{
                  background: 'linear-gradient(to right, #F1C40F, #F39C12)',
                  color: '#2B170C',
                  border: '2px solid #2B170C',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  fontFamily: "'Pixelify Sans', monospace",
                  fontWeight: 'bold',
                  fontSize: '13px',
                  textAlign: 'center',
                  marginBottom: '16px',
                  boxShadow: '0 3px 0 #2B170C'
                }}
              >
                🏆 MASTER SCHOLAR: ALL 9 POSTAGE STAMPS COLLECTED! 🏆
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {matrix.map((row) => (
                <div key={row.rowKey}>
                  <div
                    style={{
                      fontFamily: "'Pixelify Sans', monospace",
                      fontSize: '13px',
                      color: '#73452A',
                      fontWeight: 'bold',
                      marginBottom: '8px',
                      borderBottom: '1px dashed #D4BC92',
                      paddingBottom: '2px'
                    }}
                  >
                    {row.evaluator} Stamps
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    {row.stamps.map((sId) => {
                      const count = stampsData[sId]?.count || 0;
                      const isLocked = count === 0;
                      const isSelected = selectedStampId === sId;

                      return (
                        <div
                          key={sId}
                          onClick={() => {
                            soundService.playClick();
                            setSelectedStampId(sId);
                          }}
                          style={{
                            border: isSelected ? '3px solid #B82B24' : '2px dashed #D4BC92',
                            borderRadius: '8px',
                            padding: '6px',
                            background: isSelected ? '#FEF7EC' : 'transparent',
                            display: 'flex',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            position: 'relative'
                          }}
                        >
                          <StampRenderer stampId={sId} size={78} isLocked={isLocked} count={count} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Coach Unlock Progress Bars */}
            <div
              style={{
                marginTop: '20px',
                background: '#F4ECE1',
                border: '2px solid #2B170C',
                borderRadius: '8px',
                padding: '12px'
              }}
            >
              <div style={{ fontFamily: "'Pixelify Sans', monospace", fontSize: '13px', fontWeight: 'bold', color: '#B82B24', marginBottom: '8px' }}>
                🚂 Coach Unlocking Milestones:
              </div>

              {/* Coach 2 */}
              <div style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Patrick Hand', cursive", fontSize: '14px' }}>
                  <span>Coach 2 (Panorama Vista): 10 Prof. Excellent Stamps</span>
                  <span><strong>{profExcellentCount} / 10</strong></span>
                </div>
                <div style={{ height: '8px', background: '#D5D8DC', borderRadius: '4px', overflow: 'hidden', marginTop: '2px' }}>
                  <div
                    style={{
                      height: '100%',
                      background: profExcellentCount >= 10 ? '#27AE60' : '#E67E22',
                      width: `${Math.min(100, (profExcellentCount / 10) * 100)}%`
                    }}
                  />
                </div>
              </div>

              {/* Coach 3 */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Patrick Hand', cursive", fontSize: '14px' }}>
                  <span>Coach 3 (Grand Academy): 20 Total Excellent Stamps</span>
                  <span><strong>{totalExcellentCount} / 20</strong></span>
                </div>
                <div style={{ height: '8px', background: '#D5D8DC', borderRadius: '4px', overflow: 'hidden', marginTop: '2px' }}>
                  <div
                    style={{
                      height: '100%',
                      background: totalExcellentCount >= 20 ? '#27AE60' : '#8E44AD',
                      width: `${Math.min(100, (totalExcellentCount / 20) * 100)}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Selected Stamp Deep Inspection */}
          <div
            style={{
              background: '#FFF',
              border: '2px solid #D4BC92',
              borderRadius: '10px',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ textAlign: 'center', marginBottom: '14px' }}>
                <StampRenderer stampId={selectedStampId} size={110} isLocked={isSelectedLocked} count={selectedCount} />
              </div>

              <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                <h3
                  style={{
                    fontFamily: "'Pixelify Sans', monospace",
                    fontSize: '20px',
                    color: '#B82B24',
                    margin: 0
                  }}
                >
                  {selectedConfig.name}
                </h3>
                <div
                  style={{
                    fontFamily: "'Patrick Hand', cursive",
                    fontSize: '15px',
                    color: '#73452A',
                    marginTop: '2px'
                  }}
                >
                  Tier: <strong>{selectedConfig.tierLabel}</strong> • Evaluator: <strong>{selectedConfig.evaluator}</strong>
                </div>
              </div>

              <p
                style={{
                  fontFamily: "'Patrick Hand', cursive",
                  fontSize: '16px',
                  color: '#4A2816',
                  lineHeight: 1.4,
                  background: '#F9F6F0',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #E2D5BE',
                  marginBottom: '14px'
                }}
              >
                "{selectedConfig.description}"
              </p>

              {/* Status / Copies */}
              <div style={{ fontFamily: "'Pixelify Sans', monospace", fontSize: '13px', color: '#2B170C', marginBottom: '10px' }}>
                {isSelectedLocked ? (
                  <span style={{ color: '#C0392B' }}>🔒 Locked — Earn this by explaining to {selectedConfig.evaluator} with a {selectedConfig.tierLabel} score!</span>
                ) : (
                  <span style={{ color: '#27AE60' }}>✓ In Collection: {selectedCount} copies earned</span>
                )}
              </div>

              {/* Recent Sessions that earned this stamp */}
              <div>
                <div style={{ fontFamily: "'Pixelify Sans', monospace", fontSize: '12px', color: '#73452A', fontWeight: 'bold', marginBottom: '6px' }}>
                  Award History:
                </div>
                {relevantSessions.length === 0 ? (
                  <div style={{ fontFamily: "'Patrick Hand', cursive", fontSize: '14px', color: '#888' }}>
                    {isSelectedLocked ? 'No topics evaluated with this award yet.' : 'Earned during your journeys.'}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '140px', overflowY: 'auto' }}>
                    {relevantSessions.map((s, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: '#FAF0E6',
                          border: '1px solid #D4BC92',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          fontSize: '13px',
                          fontFamily: "'Patrick Hand', cursive"
                        }}
                      >
                        <strong>{s.topic}</strong> (Score: {s.score}%) • {new Date(s.completed_at || Date.now()).toLocaleDateString()}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '14px', borderTop: '1px dashed #D4BC92', paddingTop: '10px' }}>
              <span style={{ fontFamily: "'Patrick Hand', cursive", fontSize: '13px', color: '#73452A' }}>
                Stamp #{selectedStampId} in the onTrack Alpine Collection
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
