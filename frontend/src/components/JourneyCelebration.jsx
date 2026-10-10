import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { soundService } from '../services/soundService';

export default function JourneyCelebration({
  journeyTasks = [],
  journeyResults = [],
  totalMinutes = 0,
  newCoachUnlocked = null,
  onStartNewJourney,
  onOpenJournal,
  onReturnToStation
}) {
  const earnedStampsCount = journeyResults.filter(r => r.result?.is_stamp_awarded).length;
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const timeFormatted = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  useEffect(() => {
    soundService.playStampFanfare();
    try {
      confetti({ particleCount: 90, spread: 75, origin: { y: 0.5 } });
    } catch (e) {}
  }, []);

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
      {/* Hanging Wooden Sign (Matching Panel 9) */}
      <div
        style={{
          background: '#FCF8EF',
          border: '3px solid #381E10',
          borderRadius: '10px',
          boxShadow: '0 4px 0 #201007',
          padding: '8px 32px',
          textAlign: 'center',
          marginBottom: '20px'
        }}
      >
        <div style={{ fontSize: '22px', fontWeight: '900', color: '#B82B24' }}>
          Journey Complete!
        </div>
      </div>

      {/* Vibe Destination Card (Matching Panel 9) */}
      <div
        className="vibe-wood-card"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '28px',
          textAlign: 'center'
        }}
      >
        <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#2A1810', marginBottom: '16px' }}>
          Journey Summary
        </h3>

        {/* Clean concise bullet metrics matching Panel 9 */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1.5px solid #D4BC92',
            borderRadius: '10px',
            padding: '16px 20px',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            marginBottom: '22px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px' }}>
            <span style={{ color: '#27AE60', fontWeight: 'bold' }}>•</span>
            <span><strong>{journeyTasks.length}</strong> tasks finished</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px' }}>
            <span style={{ color: '#27AE60', fontWeight: 'bold' }}>•</span>
            <span><strong>{timeFormatted}</strong> focus time</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px' }}>
            <span style={{ color: '#27AE60', fontWeight: 'bold' }}>•</span>
            <span><strong>{earnedStampsCount}</strong> stamps earned</span>
          </div>

          {newCoachUnlocked ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', color: '#B82B24' }}>
              <span style={{ fontWeight: 'bold' }}>🎉</span>
              <span><strong>New coach unlocked!</strong> (Coach {newCoachUnlocked})</span>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#73452A' }}>
              <span>🚂</span>
              <span>Progress saved to Travel Journal</span>
            </div>
          )}
        </div>

        {/* Green Button: View My Stamps (Matching Panel 9) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={() => { soundService.playClick(); onOpenJournal(); }}
            className="btn-green-pill"
            style={{ width: '100%', padding: '12px', fontSize: '16px' }}
          >
            View My Stamps
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => { soundService.playClick(); onReturnToStation(); }}
              className="btn-wood"
              style={{ flex: 1, padding: '8px', fontSize: '13px' }}
            >
              Train Station
            </button>
            <button
              onClick={() => { soundService.playClick(); onStartNewJourney(); }}
              className="btn-wood"
              style={{ flex: 1, padding: '8px', fontSize: '13px' }}
            >
              Plan Next Journey
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
