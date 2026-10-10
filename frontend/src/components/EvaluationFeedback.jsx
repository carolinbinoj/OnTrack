import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import StampRenderer from './StampRenderer';
import { soundService } from '../services/soundService';

export default function EvaluationFeedback({
  result,
  topicTitle = 'Topic',
  profExcellentCount = 0,
  isLastTask = false,
  onContinue,
  onRetry
}) {
  const isAwarded = result?.is_stamp_awarded && result?.stamp_id;
  const isProfessorExcellent = result?.stamp_id === 'professor_excellent';

  useEffect(() => {
    if (isAwarded) {
      soundService.playStampFanfare();
      // Burst celebratory confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  }, [isAwarded]);

  const score = result?.score ?? 0;
  const scoreColor =
    score >= 90 ? '#27AE60' : score >= 70 ? '#2980B9' : score >= 40 ? '#E67E22' : '#C0392B';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(20, 15, 10, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '20px',
        overflowY: 'auto'
      }}
      className="feedback-modal-overlay"
    >
      <div
        style={{
          maxWidth: '720px',
          width: '100%',
          background: '#FCF8EE',
          border: '4px solid #2B170C',
          borderRadius: '16px',
          boxShadow: '0 10px 0 #2B170C, 0 16px 32px rgba(0,0,0,0.5)',
          padding: '28px',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
        className="feedback-card"
      >
        {/* Header Ribbon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '3px dashed #D4BC92',
            paddingBottom: '16px',
            marginBottom: '20px'
          }}
        >
          <div>
            <span
              style={{
                background: scoreColor,
                color: '#FFF',
                fontFamily: "'Pixelify Sans', monospace",
                fontSize: '11px',
                padding: '3px 8px',
                borderRadius: '999px',
                fontWeight: 'bold',
                letterSpacing: '1px'
              }}
            >
              {score >= 90
                ? 'EXCELLENT'
                : score >= 70
                ? 'GOOD PROGRESS'
                : score >= 40
                ? 'CAN IMPROVE'
                : 'NEEDS REVIEW'}
            </span>
            <h2
              style={{
                fontFamily: "'Pixelify Sans', monospace",
                fontSize: '24px',
                color: '#2B170C',
                marginTop: '6px'
              }}
            >
              Assessment for: {topicTitle}
            </h2>
          </div>

          {/* Big Score Badge */}
          <div
            style={{
              textAlign: 'center',
              background: '#FFF',
              border: `3px solid ${scoreColor}`,
              borderRadius: '12px',
              padding: '6px 16px',
              boxShadow: `0 4px 0 ${scoreColor}`
            }}
          >
            <div style={{ fontFamily: "'Pixelify Sans', monospace", fontSize: '28px', fontWeight: 'bold', color: scoreColor }}>
              {score}%
            </div>
            <div style={{ fontFamily: "'Patrick Hand', cursive", fontSize: '13px', color: '#73452A' }}>
              Recall Score
            </div>
          </div>
        </div>

        {/* Real vs Demo Model Badge */}
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-end' }}>
          {result?.is_real_gemini ? (
            <span
              style={{
                background: '#E8F5E9',
                color: '#2E7D32',
                border: '1px solid #A5D6A7',
                padding: '2px 8px',
                borderRadius: '4px',
                fontFamily: "'Pixelify Sans', monospace",
                fontSize: '11px'
              }}
            >
              ⚡ Powered by Google Gemini AI
            </span>
          ) : (
            <span
              style={{
                background: '#FFF3E0',
                color: '#E65100',
                border: '1px solid #FFE0B2',
                padding: '2px 8px',
                borderRadius: '4px',
                fontFamily: "'Pixelify Sans', monospace",
                fontSize: '11px'
              }}
            >
              🧪 Demo Simulation (Offline / No Key Configured)
            </span>
          )}
        </div>

        {/* STAMP REVEAL SECTION (If Stamp Earned) */}
        {isAwarded ? (
          <div
            style={{
              background: '#FFFDF5',
              border: '2px solid #D4BC92',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              marginBottom: '20px',
              boxShadow: 'inset 0 0 10px rgba(245,166,35,0.2)'
            }}
            className="stamp-award-banner"
          >
            <div>
              <StampRenderer stampId={result.stamp_id} size={110} />
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: "'Pixelify Sans', monospace",
                  fontSize: '13px',
                  color: '#E67E22',
                  fontWeight: 'bold',
                  letterSpacing: '1px'
                }}
              >
                ★ NEW COLLECTIBLE STAMP EARNED! ★
              </div>
              <h3
                style={{
                  fontFamily: "'Pixelify Sans', monospace",
                  fontSize: '20px',
                  color: '#B82B24',
                  margin: '4px 0'
                }}
              >
                {result.stamp_name}
              </h3>
              <p style={{ fontFamily: "'Patrick Hand', cursive", fontSize: '16px', color: '#73452A' }}>
                Awarded by {result.evaluator_name} • Value: +{result.reward_value} pts
              </p>

              {/* Progress towards Coach 2 */}
              {isProfessorExcellent && (
                <div
                  style={{
                    marginTop: '8px',
                    background: '#FEF9E7',
                    border: '1px solid #F1C40F',
                    borderRadius: '6px',
                    padding: '6px 10px',
                    fontSize: '13px'
                  }}
                >
                  <span style={{ fontWeight: 'bold', color: '#D68910', fontFamily: "'Pixelify Sans', monospace" }}>
                    🚂 Coach 2 Unlock Progress: {profExcellentCount} / 10 Professor Excellent Stamps!
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div
            style={{
              background: '#FDEDEC',
              border: '2px solid #E74C3C',
              borderRadius: '10px',
              padding: '14px',
              marginBottom: '20px',
              textAlign: 'center'
            }}
          >
            <div style={{ fontFamily: "'Pixelify Sans', monospace", fontSize: '16px', color: '#C0392B', fontWeight: 'bold' }}>
              No Stamp Earned (Score Below 40%)
            </div>
            <div style={{ fontFamily: "'Patrick Hand', cursive", fontSize: '15px', color: '#73452A', marginTop: '4px' }}>
              Don't worry! Review the feedback below and try explaining again without any penalty to your focus journey.
            </div>
          </div>
        )}

        {/* Evaluator Voice Persona Quote */}
        {result?.summary_message && (
          <div
            style={{
              background: '#F4ECE1',
              borderLeft: '4px solid #B82B24',
              borderRadius: '0 8px 8px 0',
              padding: '12px 16px',
              marginBottom: '18px',
              fontFamily: "'Patrick Hand', cursive",
              fontSize: '18px',
              color: '#2B170C',
              fontStyle: 'italic'
            }}
          >
            "{result.summary_message}"
          </div>
        )}

        {/* Detailed Breakdown: Correct vs Missing vs Tips */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginBottom: '24px' }}>
          {/* Correct concepts */}
          <div style={{ background: '#FFF', border: '1px solid #D4BC92', borderRadius: '8px', padding: '12px' }}>
            <div style={{ fontFamily: "'Pixelify Sans', monospace", fontSize: '13px', color: '#27AE60', fontWeight: 'bold', marginBottom: '6px' }}>
              ✓ Concepts Understood Well:
            </div>
            <ul style={{ paddingLeft: '18px', fontFamily: "'Patrick Hand', cursive", fontSize: '15px', color: '#333' }}>
              {result?.correct_concepts?.length > 0 ? (
                result.correct_concepts.map((c, i) => <li key={i}>{c}</li>)
              ) : (
                <li>Foundations touched on.</li>
              )}
            </ul>
          </div>

          {/* Missing Concepts */}
          <div style={{ background: '#FFF', border: '1px solid #D4BC92', borderRadius: '8px', padding: '12px' }}>
            <div style={{ fontFamily: "'Pixelify Sans', monospace", fontSize: '13px', color: '#E67E22', fontWeight: 'bold', marginBottom: '6px' }}>
              ⚠️ Missing or Omitted Ideas:
            </div>
            <ul style={{ paddingLeft: '18px', fontFamily: "'Patrick Hand', cursive", fontSize: '15px', color: '#333' }}>
              {result?.missing_concepts?.length > 0 ? (
                result.missing_concepts.map((m, i) => <li key={i}>{m}</li>)
              ) : (
                <li>None! Comprehensive explanation.</li>
              )}
            </ul>
          </div>
        </div>

        {/* Improvement Suggestions */}
        {result?.improvement_tips?.length > 0 && (
          <div style={{ background: '#E8F8F5', border: '1px solid #A3E4D7', borderRadius: '8px', padding: '12px', marginBottom: '24px' }}>
            <div style={{ fontFamily: "'Pixelify Sans', monospace", fontSize: '13px', color: '#16A085', fontWeight: 'bold', marginBottom: '6px' }}>
              💡 Actionable Study Suggestions:
            </div>
            <ul style={{ paddingLeft: '18px', fontFamily: "'Patrick Hand', cursive", fontSize: '15px', color: '#117A65' }}>
              {result.improvement_tips.map((tip, i) => <li key={i}>{tip}</li>)}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '3px dashed #D4BC92', paddingTop: '16px' }}>
          {!isAwarded && (
            <button
              onClick={() => { soundService.playClick(); onRetry(); }}
              className="pixel-btn pixel-btn-amber"
              style={{ fontSize: '14px' }}
            >
              🔄 Retry Explanation
            </button>
          )}

          <button
            onClick={() => { soundService.playClick(); onContinue(); }}
            className="pixel-btn pixel-btn-train"
            style={{ fontSize: '16px', padding: '10px 28px' }}
          >
            {isLastTask ? '🏁 Conclude Journey & Arrive at Destination' : '☕ Proceed to Rest Break →'}
          </button>
        </div>
      </div>
    </div>
  );
}
