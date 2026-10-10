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

  const matrix = [
    {
      evaluator: 'The Capybara',
      rowKey: 'child',
      stamps: ['child_can_improve', 'child_good', 'child_excellent']
    },
    {
      evaluator: 'The Conductor',
      rowKey: 'conductor',
      stamps: ['conductor_can_improve', 'conductor_good', 'conductor_excellent']
    },
    {
      evaluator: 'The Professor',
      rowKey: 'professor',
      stamps: ['professor_can_improve', 'professor_good', 'professor_excellent']
    }
  ];

  const distinctCount = Object.keys(STAMP_CONFIGS).filter(
    id => (stampsData[id]?.count || 0) > 0
  ).length;

  const selectedConfig = STAMP_CONFIGS[selectedStampId] || STAMP_CONFIGS.professor_excellent;
  const selectedCount = stampsData[selectedStampId]?.count || 0;
  const isSelectedLocked = selectedCount === 0;

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
    >
      {/* Journal Binder (Matching Panel 8) */}
      <div
        style={{
          width: '100%',
          maxWidth: '900px',
          maxHeight: '90vh',
          background: '#3E2114',
          border: '6px solid #201007',
          borderRadius: '16px',
          boxShadow: '0 12px 32px rgba(0,0,0,0.7)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', color: '#FFF' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#F1C40F', margin: 0 }}>
              Travel Journal
            </h2>
            <div style={{ fontSize: '13px', color: '#D4BC92' }}>
              {distinctCount} of 9 unique stamps collected
            </div>
          </div>

          <button
            onClick={() => { soundService.playClick(); onClose(); }}
            className="btn-wood"
            style={{ padding: '6px 14px', fontSize: '12px' }}
          >
            ✕ Close
          </button>
        </div>

        {/* Parchment Interior Surface */}
        <div
          style={{
            background: '#FDF8EF',
            border: '2px solid #D4BC92',
            borderRadius: '10px',
            padding: '20px',
            flex: 1,
            overflowY: 'auto',
            display: 'grid',
            gridTemplateColumns: '1.3fr 1fr',
            gap: '20px'
          }}
        >
          {/* Left: 3x3 Stamp Grid & Coach Unlock Banner */}
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {matrix.map((row) => (
                <div key={row.rowKey}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#73452A', marginBottom: '6px' }}>
                    {row.evaluator}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    {row.stamps.map((sId) => {
                      const count = stampsData[sId]?.count || 0;
                      const isLocked = count === 0;
                      const isSelected = selectedStampId === sId;

                      return (
                        <div
                          key={sId}
                          onClick={() => { soundService.playClick(); setSelectedStampId(sId); }}
                          style={{
                            border: isSelected ? '2.5px solid #B82B24' : '1.5px dashed #D4BC92',
                            borderRadius: '6px',
                            padding: '4px',
                            background: isSelected ? '#FEF7EC' : 'transparent',
                            display: 'flex',
                            justifyContent: 'center',
                            cursor: 'pointer'
                          }}
                        >
                          <StampRenderer stampId={sId} size={72} isLocked={isLocked} count={count} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Coach Unlocks Milestone Box (Matching Panel 8) */}
            <div
              style={{
                marginTop: '18px',
                background: '#F7EFE1',
                border: '1.5px solid #D4BC92',
                borderRadius: '8px',
                padding: '12px'
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#B82B24', marginBottom: '4px' }}>
                Coach Unlocks
              </div>
              <div style={{ fontSize: '12px', color: '#4A2816', marginBottom: '6px' }}>
                Unlock Coach 2 after <strong>10 Professor Excellent stamps</strong> ({profExcellentCount}/10)
              </div>
              <div style={{ height: '6px', background: '#D5D8DC', borderRadius: '3px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    background: profExcellentCount >= 10 ? '#27AE60' : '#E67E22',
                    width: `${Math.min(100, (profExcellentCount / 10) * 100)}%`
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right: Selected Stamp Details */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1.5px solid #D4BC92',
              borderRadius: '8px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                <StampRenderer stampId={selectedStampId} size={95} isLocked={isSelectedLocked} count={selectedCount} />
              </div>

              <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                <h4 style={{ fontSize: '17px', fontWeight: '800', color: '#2A1810', margin: 0 }}>
                  {selectedConfig.name}
                </h4>
                <div style={{ fontSize: '12px', color: '#73452A' }}>
                  {selectedConfig.evaluator} • {selectedConfig.tierLabel}
                </div>
              </div>

              <p style={{ fontSize: '13px', color: '#555', fontStyle: 'italic', textAlign: 'center', marginBottom: '12px' }}>
                "{selectedConfig.description}"
              </p>

              <div style={{ fontSize: '13px', color: isSelectedLocked ? '#C0392B' : '#27AE60', fontWeight: '600', textAlign: 'center' }}>
                {isSelectedLocked ? '🔒 Not yet discovered' : `✓ Collected (${selectedCount} copies)`}
              </div>
            </div>

            <div style={{ textAlign: 'center', fontSize: '11px', color: '#999', marginTop: '12px' }}>
              onTrack Postal Collection
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
