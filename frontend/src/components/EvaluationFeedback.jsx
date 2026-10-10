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

  useEffect(() => {
    if (isAwarded) {
      soundService.playStampFanfare();
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
    }
  }, [isAwarded]);

  const score = result?.score ?? 0;
  const scoreTier =
    score >= 90 ? 'Excellent' : score >= 70 ? 'Good' : score >= 40 ? 'Can Improve' : 'Needs Review';
  const tierColor =
    score >= 90 ? '#27AE60' : score >= 70 ? '#E67E22' : score >= 40 ? '#F39C12' : '#C0392B';

  const avatar = `/assets/evaluator_${result?.evaluator_type === 'child' ? 'capybara' : result?.evaluator_type === 'professor' ? 'professor' : 'conductor'}_vibe.png`;

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
        padding: '20px'
      }}
    >
      {/* Vibe Card (Matching Panel 7) */}
      <div
        className="vibe-wood-card"
        style={{
          width: '100%',
          maxWidth: '540px',
          padding: '28px'
        }}
      >
        {/* Header */}
        <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#2A1810', textAlign: 'center', marginBottom: '18px' }}>
          Evaluation Result
        </h3>

        {/* Evaluator & Score Card */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#FFFFFF',
            border: '2px solid #D4BC92',
            borderRadius: '12px',
            padding: '14px 18px',
            marginBottom: '18px'
          }}
        >
          {/* Avatar & Evaluator Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src={avatar}
              alt="Evaluator"
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                border: '2px solid #381E10',
                objectFit: 'cover'
              }}
            />
            <div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#2A1810' }}>
                {result?.evaluator_name || 'The Evaluator'}
              </div>
              <div style={{ fontSize: '13px', color: '#73452A' }}>
                {topicTitle}
              </div>
            </div>
          </div>

          {/* Score & Tier Pill */}
          <div style={{ textAlign: 'right' }}>
            <div
              className="num-clean"
              style={{
                display: 'inline-block',
                background: '#F0FFF4',
                border: '2px solid #27AE60',
                color: '#27AE60',
                padding: '4px 12px',
                borderRadius: '8px',
                fontSize: '18px',
                fontWeight: '800'
              }}
            >
              {score} / 100
            </div>
            <div style={{ marginTop: '4px' }}>
              <span
                style={{
                  background: tierColor,
                  color: '#FFF',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  fontSize: '11px',
                  fontWeight: '700'
                }}
              >
                {scoreTier}
              </span>
            </div>
          </div>
        </div>

        {/* Short Structured Checklist (Matching Panel 7) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
          {/* Well explained concepts */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '14px' }}>
            <span style={{ color: '#27AE60', fontWeight: 'bold' }}>✓</span>
            <div>
              <strong>Well explained concepts:</strong>{' '}
              <span style={{ color: '#4A2816' }}>
                {result?.correct_concepts?.slice(0, 2).join(', ') || 'Demonstrated core concepts'}
              </span>
            </div>
          </div>

          {/* Missing concepts */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '14px' }}>
            <span style={{ color: '#E67E22', fontWeight: 'bold' }}>•</span>
            <div>
              <strong>Missing concepts:</strong>{' '}
              <span style={{ color: '#4A2816' }}>
                {result?.missing_concepts?.slice(0, 2).join(', ') || 'Minor sub-details omitted'}
              </span>
            </div>
          </div>

          {/* Misconceptions */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '14px' }}>
            <span style={{ color: '#C0392B', fontWeight: 'bold' }}>✕</span>
            <div>
              <strong>Misconceptions:</strong>{' '}
              <span style={{ color: '#4A2816' }}>
                {result?.misconceptions?.length > 0 ? result.misconceptions.join(', ') : 'None identified'}
              </span>
            </div>
          </div>

          {/* Suggestions */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '14px' }}>
            <span style={{ color: '#F39C12' }}>💡</span>
            <div>
              <strong>Suggestions for improvement:</strong>{' '}
              <span style={{ color: '#4A2816' }}>
                {result?.improvement_tips?.[0] || 'Good effort explaining in your own words!'}
              </span>
            </div>
          </div>
        </div>

        {/* Stamp Award Display */}
        {isAwarded && (
          <div
            style={{
              background: '#FFFDF5',
              border: '2px solid #D4BC92',
              borderRadius: '10px',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              marginBottom: '20px'
            }}
          >
            <StampRenderer stampId={result.stamp_id} size={76} />
            <div>
              <div style={{ fontSize: '12px', fontWeight: '800', color: '#E67E22' }}>
                ★ STAMP AWARDED!
              </div>
              <div style={{ fontSize: '16px', fontWeight: '800', color: '#2A1810' }}>
                {result.stamp_name}
              </div>
              <div style={{ fontSize: '13px', color: '#73452A' }}>
                Added to your Travel Journal
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          {!isAwarded && (
            <button onClick={onRetry} className="btn-wood" style={{ padding: '8px 16px', fontSize: '13px' }}>
              Retry
            </button>
          )}

          <button
            onClick={onContinue}
            className="btn-green-pill"
            style={{ padding: '10px 24px', fontSize: '15px' }}
          >
            {isLastTask ? 'View Final Destination →' : 'Next Stop →'}
          </button>
        </div>
      </div>
    </div>
  );
}
