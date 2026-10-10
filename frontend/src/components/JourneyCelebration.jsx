import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import StampRenderer from './StampRenderer';
import { soundService } from '../services/soundService';

export default function JourneyCelebration({
  journeyTasks = [],
  journeyResults = [], // array of { task, result }
  totalMinutes = 0,
  newCoachUnlocked = null,
  onStartNewJourney,
  onOpenJournal,
  onReturnToStation
}) {
  const [revealedIndex, setRevealedIndex] = useState(0);
  const [isSkipped, setIsSkipped] = useState(false);

  useEffect(() => {
    soundService.playStampFanfare();
    try {
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.5 }
      });
    } catch (e) {}

    // Staggered reveal of stamps
    const timer = setInterval(() => {
      setRevealedIndex((prev) => {
        if (prev < journeyResults.length) {
          soundService.playClick();
          return prev + 1;
        }
        clearInterval(timer);
        return prev;
      });
    }, 800);

    return () => clearInterval(timer);
  }, [journeyResults.length]);

  const handleSkip = () => {
    soundService.playClick();
    setIsSkipped(true);
    setRevealedIndex(journeyResults.length);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #162f22, #234832 60%, #162f22)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '30px 20px',
        color: '#2B170C'
      }}
      className="journey-celebration-page"
    >
      <div
        style={{
          width: '100%',
          maxWidth: '860px',
          background: '#FCF8EE',
          border: '4px solid #2B170C',
          borderRadius: '16px',
          boxShadow: '0 8px 0 #2B170C, inset 0 2px 0 rgba(255,255,255,0.8)',
          padding: '32px',
          position: 'relative'
        }}
      >
        {/* Terminal Station Banner */}
        <div style={{ textAlign: 'center', borderBottom: '3px dashed #D4BC92', paddingBottom: '20px', marginBottom: '24px' }}>
          <div
            style={{
              display: 'inline-block',
              background: '#27AE60',
              color: '#FFF',
              padding: '6px 20px',
              borderRadius: '999px',
              fontFamily: "'Pixelify Sans', monospace",
              fontWeight: 'bold',
              fontSize: '14px',
              letterSpacing: '1px',
              marginBottom: '10px',
              border: '2px solid #2B170C'
            }}
          >
            ★ JOURNEY COMPLETE • TERMINAL STATION REACHED ★
          </div>

          <h1
            style={{
              fontFamily: "'Pixelify Sans', monospace",
              fontSize: '32px',
              color: '#B82B24',
              marginBottom: '6px'
            }}
          >
            Splendid Work, Traveler! 🌲
          </h1>
          <p style={{ fontFamily: "'Patrick Hand', cursive", fontSize: '20px', color: '#73452A' }}>
            You completed your study stops through the Swiss Alps and recorded your learning in your journal.
          </p>
        </div>

        {/* Journey Statistics Ribbon */}
        <div
          style={{
            background: '#F4ECE1',
            border: '2px solid #2B170C',
            borderRadius: '10px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            marginBottom: '28px',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Patrick Hand', cursive", fontSize: '15px', color: '#73452A' }}>Focus Tasks Completed</div>
            <div style={{ fontFamily: "'Pixelify Sans', monospace", fontSize: '26px', fontWeight: 'bold', color: '#B82B24' }}>
              {journeyTasks.length}
            </div>
          </div>
          <div style={{ width: '2px', height: '40px', background: '#D4BC92' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Patrick Hand', cursive", fontSize: '15px', color: '#73452A' }}>Total Focus Minutes</div>
            <div style={{ fontFamily: "'Pixelify Sans', monospace", fontSize: '26px', fontWeight: 'bold', color: '#27AE60' }}>
              {totalMinutes} mins
            </div>
          </div>
          <div style={{ width: '2px', height: '40px', background: '#D4BC92' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Patrick Hand', cursive", fontSize: '15px', color: '#73452A' }}>Stamps Earned This Trip</div>
            <div style={{ fontFamily: "'Pixelify Sans', monospace", fontSize: '26px', fontWeight: 'bold', color: '#E67E22' }}>
              {journeyResults.filter(r => r.result?.is_stamp_awarded).length}
            </div>
          </div>
        </div>

        {/* Newly Unlocked Coach Banner (If triggered) */}
        {newCoachUnlocked && (
          <div
            style={{
              background: '#E8F8F5',
              border: '3px solid #27AE60',
              borderRadius: '10px',
              padding: '14px',
              marginBottom: '24px',
              textAlign: 'center',
              boxShadow: '0 4px 0 #1E824C'
            }}
          >
            <div style={{ fontFamily: "'Pixelify Sans', monospace", fontSize: '18px', color: '#27AE60', fontWeight: 'bold' }}>
              🎉 CONGRATULATIONS! COACH {newCoachUnlocked} UNLOCKED!
            </div>
            <div style={{ fontFamily: "'Patrick Hand', cursive", fontSize: '16px', color: '#2C3E50', marginTop: '4px' }}>
              You have unlocked a brand new passenger coach for your future journeys! Select it at the starting station.
            </div>
          </div>
        )}

        {/* CURRENT JOURNEY STAMP REVEAL GALLERY */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontFamily: "'Pixelify Sans', monospace", fontSize: '20px', color: '#2B170C', margin: 0 }}>
              Journey Stamp Revelations
            </h3>
            {!isSkipped && revealedIndex < journeyResults.length && (
              <button
                onClick={handleSkip}
                style={{
                  background: 'none',
                  border: '1px solid #D4BC92',
                  borderRadius: '4px',
                  padding: '4px 10px',
                  fontFamily: "'Patrick Hand', cursive",
                  fontSize: '14px',
                  cursor: 'pointer',
                  color: '#73452A'
                }}
              >
                ⏩ Skip Animation
              </button>
            )}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px'
            }}
          >
            {journeyResults.map((item, idx) => {
              const isRevealed = isSkipped || idx < revealedIndex;
              const hasStamp = item.result?.is_stamp_awarded && item.result?.stamp_id;

              return (
                <div
                  key={idx}
                  style={{
                    background: '#FFF',
                    border: '2px solid #2B170C',
                    borderRadius: '10px',
                    padding: '14px',
                    textAlign: 'center',
                    boxShadow: '0 4px 0 #2B170C',
                    opacity: isRevealed ? 1 : 0.25,
                    transform: isRevealed ? 'scale(1)' : 'scale(0.95)',
                    transition: 'opacity 0.4s ease, transform 0.4s ease',
                    position: 'relative'
                  }}
                >
                  <div style={{ fontFamily: "'Pixelify Sans', monospace", fontSize: '11px', color: '#73452A', marginBottom: '6px' }}>
                    STOP #{idx + 1}: {item.task?.title}
                  </div>

                  {hasStamp ? (
                    <div>
                      <div style={{ margin: '8px auto', display: 'flex', justifyContent: 'center' }}>
                        <StampRenderer stampId={item.result.stamp_id} size={90} />
                      </div>
                      <div style={{ fontFamily: "'Pixelify Sans', monospace", fontSize: '14px', fontWeight: 'bold', color: '#B82B24' }}>
                        {item.result.stamp_name}
                      </div>
                      <div style={{ fontFamily: "'Patrick Hand', cursive", fontSize: '13px', color: '#27AE60' }}>
                        Score: {item.result.score}% • +{item.result.reward_value} pts
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: '24px 8px' }}>
                      <div style={{ fontSize: '32px', marginBottom: '6px' }}>📝</div>
                      <div style={{ fontFamily: "'Pixelify Sans', monospace", fontSize: '13px', color: '#888' }}>
                        No Stamp Awarded
                      </div>
                      <div style={{ fontFamily: "'Patrick Hand', cursive", fontSize: '12px', color: '#999', marginTop: '2px' }}>
                        Score: {item.result?.score ?? 0}% (Below 40%)
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderTop: '3px dashed #D4BC92', paddingTop: '18px' }}>
          <button
            onClick={() => { soundService.playClick(); onReturnToStation(); }}
            className="pixel-btn pixel-btn-parchment"
            style={{ fontSize: '14px' }}
          >
            ← Return to Station
          </button>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => { soundService.playClick(); onOpenJournal(); }}
              className="pixel-btn pixel-btn-amber"
              style={{ fontSize: '14px' }}
            >
              📖 View Journal Album
            </button>
            <button
              onClick={() => { soundService.playClick(); onStartNewJourney(); }}
              className="pixel-btn pixel-btn-train"
              style={{ fontSize: '16px', padding: '10px 24px' }}
            >
              🚂 Plan Next Journey →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
