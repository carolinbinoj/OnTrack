import React, { useState, useEffect } from 'react';
import FocusTimer from './FocusTimer';
import { soundService } from '../services/soundService';

export default function TrainCompartment({
  currentTask,
  taskIndex = 0,
  totalTasks = 1,
  isBreak = false,
  breakDuration = 5,
  onTaskComplete,
  onEarlyFinish,
  onAbandonJourney
}) {
  const [frameIndex, setFrameIndex] = useState(0); // 0 = still, 1 = moving
  const [isMuted, setIsMuted] = useState(soundService.isMuted);

  // When moving, cycle between the 2 user-supplied bear frames (breathing / motion)
  useEffect(() => {
    if (isBreak) {
      setFrameIndex(0);
      soundService.stopAmbient();
      return;
    }

    soundService.startAmbient('train');

    const animTimer = setInterval(() => {
      setFrameIndex(prev => (prev === 0 ? 1 : 0));
    }, 1500);

    return () => {
      clearInterval(animTimer);
      soundService.stopAmbient();
    };
  }, [isBreak]);

  const toggleSound = () => {
    const muted = soundService.toggleMute();
    setIsMuted(muted);
  };

  const handleTimerFinish = () => {
    soundService.stopAmbient();
    onTaskComplete();
  };

  const currentSeconds = isBreak
    ? breakDuration * 60
    : (currentTask ? currentTask.duration * 60 : 1500);

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: '#190E07',
        userSelect: 'none'
      }}
      className="train-compartment-container"
    >
      {/* 1. THE 2-FRAME AUTHENTIC PIXEL ART COMPARTMENT & BEAR */}
      {/* Frame 0: Still frame */}
      <img
        src="/assets/coach_still.jpg"
        alt="Train compartment still"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          opacity: frameIndex === 0 ? 1 : 0,
          transition: 'opacity 0.4s ease-in-out',
          imageRendering: 'pixelated'
        }}
      />

      {/* Frame 1: Moving frame with subtle bear shift & moving pixelated trees */}
      <img
        src="/assets/coach_moving.jpg"
        alt="Train compartment moving"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          opacity: frameIndex === 1 ? 1 : 0,
          transition: 'opacity 0.4s ease-in-out',
          imageRendering: 'pixelated'
        }}
      />

      {/* 2. TOP CONCISE HUD BAR (Concise & Readable) */}
      <div
        style={{
          position: 'fixed',
          top: '20px',
          left: '24px',
          zIndex: 40,
          background: 'rgba(252, 248, 239, 0.94)',
          border: '2px solid #381E10',
          borderRadius: '10px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              background: isBreak ? '#27AE60' : '#C0392B',
              color: '#FFF',
              padding: '2px 8px',
              borderRadius: '999px',
              fontSize: '11px',
              fontWeight: 'bold',
              fontFamily: "'Outfit', sans-serif"
            }}
          >
            {isBreak ? 'BREAK' : `STOP ${taskIndex + 1}/${totalTasks}`}
          </span>
          <span style={{ fontWeight: '700', fontSize: '15px', color: '#2A1810' }}>
            {isBreak ? 'Rest & Recharge' : currentTask?.title || 'Current Topic'}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={toggleSound}
            style={{
              background: '#FFF',
              border: '1px solid #D4BC92',
              borderRadius: '6px',
              padding: '4px 8px',
              fontSize: '12px',
              cursor: 'pointer',
              color: '#381E10'
            }}
            title="Toggle Sound"
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
          <button
            onClick={() => {
              if (window.confirm('Leave journey and return to station?')) {
                onAbandonJourney();
              }
            }}
            style={{
              background: '#FFF',
              border: '1px solid #C0392B',
              borderRadius: '6px',
              padding: '4px 8px',
              fontSize: '12px',
              cursor: 'pointer',
              color: '#C0392B'
            }}
            title="Leave"
          >
            ✕
          </button>
        </div>
      </div>

      {/* 3. CIRCULAR POMODORO TIMER IN TOP-RIGHT */}
      <FocusTimer
        initialSeconds={currentSeconds}
        taskTitle={currentTask?.title}
        isBreak={isBreak}
        onComplete={handleTimerFinish}
        onSkipEarly={onEarlyFinish}
      />
    </div>
  );
}
