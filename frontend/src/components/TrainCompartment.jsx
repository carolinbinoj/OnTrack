import React, { useState, useEffect } from 'react';
import ParallaxForest from './ParallaxForest';
import BearCompanion from './BearCompanion';
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
  const [trainState, setTrainState] = useState(isBreak ? 'break' : 'travelling');
  const [isMuted, setIsMuted] = useState(soundService.isMuted);

  // Play ambient train sounds on mount if not break
  useEffect(() => {
    if (!isBreak) {
      setTrainState('travelling');
      soundService.startAmbient('train');
    } else {
      setTrainState('break');
      soundService.stopAmbient();
    }

    return () => {
      soundService.stopAmbient();
    };
  }, [isBreak]);

  const toggleSound = () => {
    const muted = soundService.toggleMute();
    setIsMuted(muted);
  };

  const handleTimerFinish = () => {
    setTrainState('arriving');
    soundService.stopAmbient();
    setTimeout(() => {
      onTaskComplete();
    }, 1200);
  };

  const handleSkip = () => {
    setTrainState('arriving');
    soundService.stopAmbient();
    setTimeout(() => {
      onEarlyFinish();
    }, 600);
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
        background: '#2B170C',
        userSelect: 'none'
      }}
      className="train-compartment-view"
    >
      {/* 1. THE LARGE TRAIN WINDOW (Showing the scrolling Parallax Swiss Forest) */}
      <div
        style={{
          position: 'absolute',
          top: '8%',
          left: '12%',
          width: '76%',
          height: '62%',
          borderRadius: '16px 16px 4px 4px',
          overflow: 'hidden',
          border: '14px solid #4A2816',
          boxShadow: 'inset 0 10px 24px rgba(0,0,0,0.5), 0 8px 16px rgba(0,0,0,0.4)',
          zIndex: 1
        }}
        className="window-frame"
      >
        <ParallaxForest trainState={trainState} />

        {/* Window Glass Glare & Reflection */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 45%, rgba(255,255,255,0.06) 70%, transparent 100%)',
            pointerEvents: 'none'
          }}
        />

        {/* Window Frame Center Divider Bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: '50%',
            width: '8px',
            transform: 'translateX(-50%)',
            background: '#3D2012',
            boxShadow: '0 0 4px rgba(0,0,0,0.4)'
          }}
        />
      </div>

      {/* 2. THE COZY WOODEN COMPARTMENT INTERIOR (Layer 2 - in front of window) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 10
        }}
        className="interior-overlay"
      >
        {/* Wooden Side Walls & Moldings */}
        {/* Left Wooden Wall */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: '13%',
            background: 'linear-gradient(to right, #24130A, #3D2112 80%, #4A2816)',
            borderRight: '4px solid #1E0E07'
          }}
        >
          {/* onTrack Alpine Poster on Left Wall */}
          <div
            style={{
              position: 'absolute',
              top: '18%',
              left: '14%',
              width: '72%',
              background: '#FCF8EE',
              border: '3px solid #2B170C',
              borderRadius: '4px',
              padding: '6px',
              boxShadow: '2px 4px 6px rgba(0,0,0,0.4)',
              transform: 'rotate(-1deg)'
            }}
          >
            <div style={{ background: '#7CA1D1', height: '54px', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
              🏔️🚂
            </div>
            <div style={{ fontFamily: "'Pixelify Sans', monospace", fontSize: '9px', fontWeight: 'bold', textAlign: 'center', color: '#B82B24', marginTop: '4px' }}>
              onTrack Express
            </div>
          </div>

          {/* Hanging Backpacker Rucksack */}
          <div style={{ position: 'absolute', bottom: '26%', left: '16%', fontSize: '42px', filter: 'drop-shadow(2px 4px 4px rgba(0,0,0,0.5))' }}>
            🎒
          </div>
        </div>

        {/* Right Wooden Wall */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            width: '13%',
            background: 'linear-gradient(to left, #24130A, #3D2112 80%, #4A2816)',
            borderLeft: '4px solid #1E0E07'
          }}
        >
          {/* Alpine Fern / Ivy Plant creeping from shelf */}
          <div style={{ position: 'absolute', top: '12%', right: '18%', fontSize: '38px', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.4))' }}>
            🪴
          </div>
        </div>

        {/* Train Ceiling Beam & Curtains */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '9%',
            background: 'linear-gradient(to bottom, #1E0E07, #3D2112 85%, #24130A)',
            borderBottom: '4px solid #180B05',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
          }}
        />

        {/* 3. Dark Green Plush Passenger Seats */}
        {/* Left Seat */}
        <div
          style={{
            position: 'absolute',
            bottom: '8%',
            left: '10%',
            width: '24%',
            height: '34%',
            background: 'linear-gradient(to right, #1B3F2B, #23553A)',
            borderRadius: '16px 16px 0 0',
            border: '4px solid #142E1F',
            borderBottom: 'none',
            boxShadow: 'inset 0 4px 8px rgba(255,255,255,0.1), 0 8px 16px rgba(0,0,0,0.4)'
          }}
        />

        {/* Right Seat (Where Bear is Sitting) */}
        <div
          style={{
            position: 'absolute',
            bottom: '8%',
            right: '18%',
            width: '26%',
            height: '34%',
            background: 'linear-gradient(to left, #1B3F2B, #23553A)',
            borderRadius: '16px 16px 0 0',
            border: '4px solid #142E1F',
            borderBottom: 'none',
            boxShadow: 'inset 0 4px 8px rgba(255,255,255,0.1), 0 8px 16px rgba(0,0,0,0.4)'
          }}
        />

        {/* 4. Center Wooden Dining / Study Desk */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: '26%',
            width: '48%',
            height: '22%',
            background: 'linear-gradient(to bottom, #73452A, #5C3A25 60%, #4A2816)',
            borderRadius: '12px 12px 0 0',
            border: '4px solid #361A0C',
            borderBottom: 'none',
            boxShadow: '0 -4px 12px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.2)'
          }}
        >
          {/* Tablecloth runner */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '10%',
              right: '10%',
              height: '8px',
              background: '#FCF8EE',
              borderBottom: '2px solid #D4BC92'
            }}
          />

          {/* Desk Props: Open Notebook, Books, Coffee Mug */}
          <div
            style={{
              position: 'absolute',
              top: '-32px',
              left: '18%',
              display: 'flex',
              alignItems: 'flex-end',
              gap: '16px'
            }}
          >
            {/* Ceramic Alpine Coffee Mug */}
            <div style={{ fontSize: '32px', filter: 'drop-shadow(0 3px 3px rgba(0,0,0,0.4))' }} title="Warm Alpine Coffee">
              ☕
            </div>

            {/* Stack of Study Books */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
              <div style={{ width: '42px', height: '8px', background: '#27AE60', borderRadius: '2px', border: '1px solid #1E824C' }} />
              <div style={{ width: '46px', height: '10px', background: '#2980B9', borderRadius: '2px', border: '1px solid #1F618D' }} />
              <div style={{ width: '50px', height: '12px', background: '#8E44AD', borderRadius: '2px', border: '1px solid #6C3483' }} />
            </div>

            {/* Open Notebook with pencil */}
            <div
              style={{
                width: '64px',
                height: '38px',
                background: '#FCF8EE',
                border: '2px solid #361A0C',
                borderRadius: '3px',
                padding: '4px',
                boxShadow: '0 3px 4px rgba(0,0,0,0.3)',
                display: 'flex',
                flexDirection: 'column',
                gap: '3px'
              }}
            >
              <div style={{ width: '80%', height: '2px', background: '#D4BC92' }} />
              <div style={{ width: '90%', height: '2px', background: '#D4BC92' }} />
              <div style={{ width: '60%', height: '2px', background: '#D4BC92' }} />
            </div>
          </div>

          {/* Glowing Amber Lantern on Table */}
          <div
            style={{
              position: 'absolute',
              top: '-68px',
              right: '16%',
              width: '38px',
              height: '64px',
              filter: 'drop-shadow(0 0 20px rgba(245,166,35,0.85))'
            }}
          >
            <svg viewBox="0 0 40 70" width="100%" height="100%">
              {/* Lantern Hook */}
              <circle cx="20" cy="8" r="5" fill="none" stroke="#2B170C" strokeWidth="2.5" />
              {/* Lantern Cap */}
              <polygon points="10,18 30,18 25,12 15,12" fill="#4A2816" stroke="#2B170C" strokeWidth="2" />
              {/* Glass Chamber with Flame */}
              <rect x="8" y="18" width="24" height="34" rx="3" fill="#FFF5D6" stroke="#2B170C" strokeWidth="2.5" />
              {/* Glowing Warm Flame */}
              <ellipse cx="20" cy="35" rx="6" ry="10" fill="#FFA726" />
              <ellipse cx="20" cy="36" rx="3" ry="6" fill="#FFF" />
              {/* Base */}
              <rect x="6" y="52" width="28" height="8" rx="2" fill="#4A2816" stroke="#2B170C" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* 5. The Bear Character sitting by the window in the right seat */}
        <div
          style={{
            position: 'absolute',
            bottom: '12%',
            right: '20%',
            pointerEvents: 'auto',
            zIndex: 15
          }}
        >
          <BearCompanion
            state={isBreak ? 'break' : 'focus'}
            isTrainMoving={trainState === 'travelling'}
          />
        </div>
      </div>

      {/* 3. FLOATING TOP TASK HUD BAR (Interactive UI) */}
      <div
        style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 40,
          background: 'rgba(252, 248, 238, 0.95)',
          border: '3px solid #2B170C',
          borderRadius: '12px',
          boxShadow: '0 6px 0 #2B170C, 0 4px 12px rgba(0,0,0,0.3)',
          padding: '10px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          maxWidth: '820px',
          width: '90%'
        }}
        className="hud-task-banner"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
          <div
            style={{
              background: isBreak ? '#27AE60' : '#B82B24',
              color: '#FFF',
              padding: '4px 10px',
              borderRadius: '6px',
              fontFamily: "'Pixelify Sans', monospace",
              fontSize: '13px',
              fontWeight: 'bold',
              border: '2px solid #2B170C'
            }}
          >
            {isBreak ? 'BREAK TIME' : `TASK ${taskIndex + 1} OF ${totalTasks}`}
          </div>

          <div>
            <div
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: '700',
                fontSize: '17px',
                color: '#2B170C'
              }}
            >
              {isBreak ? 'Rest, sip your beverage, and recharge!' : currentTask?.title || 'Current Study Topic'}
            </div>
            {!isBreak && currentTask?.description && (
              <div style={{ fontFamily: "'Patrick Hand', cursive", fontSize: '15px', color: '#73452A' }}>
                {currentTask.description}
              </div>
            )}
          </div>
        </div>

        {/* Audio Toggle & Emergency Abandon Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={toggleSound}
            className="pixel-btn pixel-btn-parchment"
            style={{ padding: '6px 10px', fontSize: '12px' }}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? '🔇 Muted' : '🔊 Chug Sound'}
          </button>

          <button
            onClick={() => {
              if (window.confirm('Abandon current journey and return to train station?')) {
                soundService.stopAmbient();
                onAbandonJourney();
              }
            }}
            className="pixel-btn pixel-btn-parchment"
            style={{ padding: '6px 10px', fontSize: '12px', color: '#96281B' }}
            title="Leave journey"
          >
            ✕ Exit
          </button>
        </div>
      </div>

      {/* 4. THE ACCURATE CIRCULAR FOCUS TIMER (Bottom Right) */}
      <FocusTimer
        initialSeconds={currentSeconds}
        taskTitle={currentTask?.title}
        taskIndex={taskIndex}
        totalTasks={totalTasks}
        isBreak={isBreak}
        onComplete={handleTimerFinish}
        onSkipEarly={handleSkip}
      />
    </div>
  );
}
