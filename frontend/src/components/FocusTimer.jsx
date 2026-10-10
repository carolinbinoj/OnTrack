import React, { useState, useEffect, useRef } from 'react';
import { soundService } from '../services/soundService';

export default function FocusTimer({
  initialSeconds = 1500, // 25 min default
  taskTitle = 'Study Session',
  isBreak = false,
  onComplete,
  onSkipEarly
}) {
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
  const [isPaused, setIsPaused] = useState(false);
  const [showAdjust, setShowAdjust] = useState(false);

  const endTimeRef = useRef(Date.now() + initialSeconds * 1000);
  const pausedLeftRef = useRef(null);

  useEffect(() => {
    setRemainingSeconds(initialSeconds);
    setTotalSeconds(initialSeconds);
    endTimeRef.current = Date.now() + initialSeconds * 1000;
    pausedLeftRef.current = null;
    setIsPaused(false);
  }, [initialSeconds, isBreak]);

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

  const togglePause = (e) => {
    e.stopPropagation();
    soundService.playClick();
    if (!isPaused) {
      pausedLeftRef.current = remainingSeconds;
      setIsPaused(true);
    } else {
      const resumeLeft = pausedLeftRef.current || remainingSeconds;
      endTimeRef.current = Date.now() + resumeLeft * 1000;
      setIsPaused(false);
    }
  };

  const addTime = (mins) => {
    soundService.playClick();
    const addSecs = mins * 60;
    const newRemaining = remainingSeconds + addSecs;
    const newTotal = totalSeconds + addSecs;
    setRemainingSeconds(newRemaining);
    setTotalSeconds(newTotal);
    endTimeRef.current = isPaused ? Date.now() + newRemaining * 1000 : endTimeRef.current + addSecs * 1000;
    setShowAdjust(false);
  };

  const reduceTime = (mins) => {
    soundService.playClick();
    const newRemaining = Math.max(10, remainingSeconds - mins * 60);
    setRemainingSeconds(newRemaining);
    endTimeRef.current = isPaused ? Date.now() + newRemaining * 1000 : Date.now() + newRemaining * 1000;
    setShowAdjust(false);
  };

  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  const timeFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  // SVG Circular Segmented Progress Ring
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = totalSeconds > 0 ? (totalSeconds - remainingSeconds) / totalSeconds : 0;
  const strokeDashoffset = circumference * (1 - progressRatio);

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '24px',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '6px'
      }}
      className="pomodoro-timer-widget"
    >
      {/* Popover Adjust Duration Menu */}
      {showAdjust && (
        <div
          style={{
            background: '#FCF8EF',
            border: '2px solid #381E10',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            padding: '10px 14px',
            width: '210px',
            marginBottom: '4px'
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#2A1810', marginBottom: '6px' }}>
            Adjust Focus Time
          </div>
          <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
            <button
              onClick={() => addTime(5)}
              className="btn-wood"
              style={{ flex: 1, padding: '4px', fontSize: '11px' }}
            >
              +5m
            </button>
            <button
              onClick={() => addTime(10)}
              className="btn-wood"
              style={{ flex: 1, padding: '4px', fontSize: '11px' }}
            >
              +10m
            </button>
            <button
              onClick={() => reduceTime(5)}
              className="btn-wood"
              style={{ flex: 1, padding: '4px', fontSize: '11px' }}
            >
              -5m
            </button>
          </div>
          <button
            onClick={() => {
              setShowAdjust(false);
              onSkipEarly ? onSkipEarly() : onComplete();
            }}
            className="btn-green-pill"
            style={{ width: '100%', padding: '6px', fontSize: '11px' }}
          >
            ✓ Finish Early
          </button>
        </div>
      )}

      {/* Main Circular Timer Element (Exact styling from Panel 3 of reference infographic) */}
      <div
        onClick={() => setShowAdjust(!showAdjust)}
        style={{
          width: '124px',
          height: '124px',
          borderRadius: '50%',
          background: '#192C20',
          border: '3px solid #381E10',
          boxShadow: '0 6px 14px rgba(0,0,0,0.5)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          userSelect: 'none'
        }}
        title="Click to adjust time or finish early"
      >
        {/* SVG Progress Ring */}
        <svg
          viewBox="0 0 120 120"
          width="120"
          height="120"
          style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}
        >
          {/* Track background */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="transparent"
            stroke="#2F4F39"
            strokeWidth="9"
          />
          {/* Segmented Color Fill */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="transparent"
            stroke={isBreak ? '#27AE60' : '#4ADE80'}
            strokeWidth="9"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.3s ease' }}
          />
        </svg>

        {/* Center Content with High Legibility */}
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <div
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '11px',
              fontWeight: '700',
              color: isBreak ? '#2ECC71' : '#A3E635',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            {isBreak ? 'Break' : 'Focus'}
          </div>

          {/* Large, clean, high-contrast readable timer numbers */}
          <div
            className="num-clean"
            style={{
              fontSize: '24px',
              fontWeight: '800',
              color: '#FFFFFF',
              lineHeight: 1.15,
              textShadow: '0 2px 4px rgba(0,0,0,0.8)'
            }}
          >
            {timeFormatted}
          </div>

          {/* Pause / Resume Icon */}
          <button
            onClick={togglePause}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#F4ECE1',
              fontSize: '13px',
              cursor: 'pointer',
              marginTop: '2px',
              padding: '2px 8px'
            }}
          >
            {isPaused ? '▶' : '❚❚'}
          </button>
        </div>
      </div>
    </div>
  );
}
