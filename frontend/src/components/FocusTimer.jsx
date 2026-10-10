import React, { useState, useEffect, useRef } from 'react';
import { soundService } from '../services/soundService';

export default function FocusTimer({
  initialSeconds = 1500, // 25 min default
  taskTitle = 'Study Session',
  taskIndex = 0,
  totalTasks = 1,
  isBreak = false,
  onComplete,
  onSkipEarly
}) {
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
  const [isPaused, setIsPaused] = useState(false);
  const [showAdjustMenu, setShowAdjustMenu] = useState(false);

  // Store end timestamp to prevent background tab drift
  const endTimeRef = useRef(Date.now() + initialSeconds * 1000);
  const pausedTimeRef = useRef(null);

  // Sync when initialSeconds changes (e.g. next task)
  useEffect(() => {
    setRemainingSeconds(initialSeconds);
    setTotalSeconds(initialSeconds);
    endTimeRef.current = Date.now() + initialSeconds * 1000;
    pausedTimeRef.current = null;
    setIsPaused(false);
  }, [initialSeconds, taskIndex, isBreak]);

  // Accurate interval ticker based on real timestamp
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const left = Math.max(0, Math.round((endTimeRef.current - now) / 1000));
      setRemainingSeconds(left);

      if (left <= 0) {
        clearInterval(interval);
        soundService.playStationBell();
        onComplete();
      }
    }, 250);

    return () => clearInterval(interval);
  }, [isPaused, onComplete]);

  const togglePause = () => {
    soundService.playClick();
    if (!isPaused) {
      // Pausing: save how many seconds were left
      pausedTimeRef.current = remainingSeconds;
      setIsPaused(true);
    } else {
      // Resuming: recalculate new end timestamp
      const resumeLeft = pausedTimeRef.current || remainingSeconds;
      endTimeRef.current = Date.now() + resumeLeft * 1000;
      setIsPaused(false);
    }
  };

  const addTime = (minutes) => {
    soundService.playClick();
    const addedSecs = minutes * 60;
    const newRemaining = remainingSeconds + addedSecs;
    const newTotal = totalSeconds + addedSecs;
    setRemainingSeconds(newRemaining);
    setTotalSeconds(newTotal);
    endTimeRef.current = isPaused ? Date.now() + newRemaining * 1000 : endTimeRef.current + addedSecs * 1000;
    setShowAdjustMenu(false);
  };

  const reduceTime = (minutes) => {
    soundService.playClick();
    const reducedSecs = minutes * 60;
    const newRemaining = Math.max(10, remainingSeconds - reducedSecs);
    setRemainingSeconds(newRemaining);
    endTimeRef.current = isPaused ? Date.now() + newRemaining * 1000 : Date.now() + newRemaining * 1000;
    setShowAdjustMenu(false);
  };

  const handleFinishEarly = () => {
    soundService.playClick();
    soundService.playStationBell();
    setShowAdjustMenu(false);
    onSkipEarly ? onSkipEarly() : onComplete();
  };

  // Time format MM:SS
  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  const timeFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  // SVG circular progress calculation
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const progressPercent = totalSeconds > 0 ? (totalSeconds - remainingSeconds) / totalSeconds : 0;
  const strokeDashoffset = circumference * (1 - progressPercent);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '8px'
      }}
      className="focus-timer-widget"
    >
      {/* Duration Adjust Popover Menu */}
      {showAdjustMenu && (
        <div
          style={{
            background: '#FCF8EE',
            border: '3px solid #2B170C',
            borderRadius: '12px',
            boxShadow: '0 6px 0 #2B170C',
            padding: '14px 18px',
            marginBottom: '8px',
            width: '240px',
            animation: 'slide-up 0.2s ease'
          }}
        >
          <div style={{ fontFamily: "'Pixelify Sans', monospace", fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#2B170C' }}>
            Adjust Focus Duration
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => addTime(5)}
                className="pixel-btn pixel-btn-parchment"
                style={{ flex: 1, padding: '4px 6px', fontSize: '12px' }}
              >
                +5m
              </button>
              <button
                onClick={() => addTime(10)}
                className="pixel-btn pixel-btn-parchment"
                style={{ flex: 1, padding: '4px 6px', fontSize: '12px' }}
              >
                +10m
              </button>
              <button
                onClick={() => reduceTime(5)}
                className="pixel-btn pixel-btn-parchment"
                style={{ flex: 1, padding: '4px 6px', fontSize: '12px' }}
              >
                -5m
              </button>
            </div>

            <button
              onClick={handleFinishEarly}
              className="pixel-btn pixel-btn-primary"
              style={{ width: '100%', padding: '6px 8px', fontSize: '12px', marginTop: '4px' }}
            >
              ✓ Finished Early! Arrive Now
            </button>
          </div>
        </div>
      )}

      {/* Circular Timer Component */}
      <div
        style={{
          background: '#FCF8EE',
          border: '4px solid #2B170C',
          borderRadius: '50%',
          boxShadow: '0 8px 0 #2B170C, 0 0 24px rgba(245,166,35,0.4)',
          width: '160px',
          height: '160px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}
        onClick={() => setShowAdjustMenu(!showAdjustMenu)}
        title="Click to adjust time or finish early"
      >
        {/* SVG Circular Progress Ring */}
        <svg
          viewBox="0 0 160 160"
          width="160"
          height="160"
          style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}
        >
          {/* Background Ring Track */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="transparent"
            stroke="#E2D5C3"
            strokeWidth="9"
          />
          {/* Active Progress Ring */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="transparent"
            stroke={isBreak ? '#27AE60' : '#B82B24'}
            strokeWidth="9"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.35s ease' }}
          />
        </svg>

        {/* Inner Content */}
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <div
            style={{
              fontFamily: "'Pixelify Sans', monospace",
              fontSize: '11px',
              fontWeight: 'bold',
              color: isBreak ? '#27AE60' : '#B82B24',
              letterSpacing: '1px',
              textTransform: 'uppercase'
            }}
          >
            {isBreak ? '☕ Rest Break' : `Stop ${taskIndex + 1}/${totalTasks}`}
          </div>

          <div
            style={{
              fontFamily: "'Pixelify Sans', monospace",
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#2B170C',
              lineHeight: 1.1,
              marginTop: '2px'
            }}
          >
            {timeFormatted}
          </div>

          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginTop: '6px' }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePause();
              }}
              style={{
                background: isPaused ? '#27AE60' : '#E67E22',
                color: '#FFF',
                border: '2px solid #2B170C',
                borderRadius: '4px',
                padding: '2px 8px',
                fontSize: '11px',
                fontFamily: "'Pixelify Sans', monospace",
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              {isPaused ? '▶ RESUME' : '❚❚ PAUSE'}
            </button>
          </div>
        </div>

        {/* Small Adjust Time Indicator Icon */}
        <div
          style={{
            position: 'absolute',
            bottom: '2px',
            fontSize: '11px',
            color: '#73452A',
            fontFamily: "'Pixelify Sans', monospace"
          }}
        >
          ⚙ +/-
        </div>
      </div>
    </div>
  );
}
