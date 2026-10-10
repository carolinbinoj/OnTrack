import React, { useState, useEffect } from 'react';
import { soundService } from '../../services/soundService';
import { checkBackendHealth } from '../../services/api';

export default function SettingsPage() {
  const [defaultFocus, setDefaultFocus] = useState(25);
  const [defaultBreak, setDefaultBreak] = useState(5);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [backendStatus, setBackendStatus] = useState({ status: 'checking', gemini_configured: false });

  useEffect(() => {
    checkBackendHealth().then(setBackendStatus);
  }, []);

  const handleClearData = () => {
    if (window.confirm('Clear all local session data, stamps, and habits? (This cannot be undone!)')) {
      localStorage.clear();
      soundService.playClick();
      window.location.reload();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: '700', fontSize: '22px', color: '#2B170C' }}>
        onTrack Study Settings
      </h2>

      {/* Focus Preferences */}
      <div
        style={{
          background: '#FCF8EE',
          border: '2px solid #E6A36E',
          borderRadius: '14px',
          padding: '18px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        <div style={{ fontWeight: '700', fontSize: '16px', color: '#2B170C' }}>
          ⏱️ Default Pomodoro Intervals
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '13px', color: '#73452A', display: 'block', marginBottom: '4px' }}>
              Default Focus Duration (Minutes):
            </label>
            <input
              type="number"
              min="5"
              max="120"
              value={defaultFocus}
              onChange={e => setDefaultFocus(Number(e.target.value))}
              style={{ padding: '8px 12px', border: '1px solid #D4BC92', borderRadius: '6px', width: '100px', fontSize: '15px' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', color: '#73452A', display: 'block', marginBottom: '4px' }}>
              Default Rest Break Duration (Minutes):
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={defaultBreak}
              onChange={e => setDefaultBreak(Number(e.target.value))}
              style={{ padding: '8px 12px', border: '1px solid #D4BC92', borderRadius: '6px', width: '100px', fontSize: '15px' }}
            />
          </div>
        </div>
      </div>

      {/* Accessibility & Visual Preferences */}
      <div
        style={{
          background: '#FCF8EE',
          border: '2px solid #E6A36E',
          borderRadius: '14px',
          padding: '18px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div>
          <div style={{ fontWeight: '700', fontSize: '16px', color: '#2B170C' }}>
            ♿ Reduced Motion
          </div>
          <div style={{ fontSize: '13px', color: '#73452A', fontFamily: "'Patrick Hand', cursive" }}>
            Minimizes background parallax forest scrolling and character bouncing for sensitive eyes.
          </div>
        </div>

        <input
          type="checkbox"
          checked={reducedMotion}
          onChange={e => {
            soundService.playClick();
            setReducedMotion(e.target.checked);
          }}
          style={{ width: '22px', height: '22px', cursor: 'pointer' }}
        />
      </div>

      {/* Backend & Gemini AI Integration Status */}
      <div
        style={{
          background: '#FCF8EE',
          border: '2px solid #E6A36E',
          borderRadius: '14px',
          padding: '18px 24px'
        }}
      >
        <div style={{ fontWeight: '700', fontSize: '16px', color: '#2B170C', marginBottom: '6px' }}>
          🤖 Gemini AI Backend Status
        </div>
        <div style={{ fontSize: '13px', color: '#73452A', marginBottom: '12px' }}>
          Status of Python Flask API at <code>http://localhost:5000</code>:
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '14px' }}>
          <span
            style={{
              background: backendStatus.status === 'online' ? '#E8F5E9' : '#FFF3E0',
              color: backendStatus.status === 'online' ? '#2E7D32' : '#E65100',
              border: '1px solid #A5D6A7',
              padding: '4px 10px',
              borderRadius: '999px',
              fontWeight: 'bold',
              fontSize: '12px',
              fontFamily: "'Pixelify Sans', monospace"
            }}
          >
            {backendStatus.status === 'online' ? '● BACKEND ONLINE' : '○ BACKEND OFFLINE (FALLBACK MODE)'}
          </span>

          <span
            style={{
              background: backendStatus.gemini_configured ? '#E8F5E9' : '#FFEBEE',
              color: backendStatus.gemini_configured ? '#2E7D32' : '#C62828',
              border: '1px solid #EF9A9A',
              padding: '4px 10px',
              borderRadius: '999px',
              fontWeight: 'bold',
              fontSize: '12px',
              fontFamily: "'Pixelify Sans', monospace"
            }}
          >
            {backendStatus.gemini_configured ? '✓ GEMINI API KEY CONFIGURED' : '⚠ GEMINI API KEY MISSING'}
          </span>
        </div>

        <p style={{ fontFamily: "'Patrick Hand', cursive", fontSize: '14px', color: '#555' }}>
          To connect real Gemini AI: add <code>GEMINI_API_KEY=your_key</code> inside <code>backend/.env</code> and launch <code>python backend/app.py</code>.
        </p>
      </div>

      {/* Danger Zone: Data Reset */}
      <div
        style={{
          background: '#FDEDEC',
          border: '2px solid #C0392B',
          borderRadius: '14px',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div>
          <div style={{ fontWeight: '700', fontSize: '15px', color: '#C0392B' }}>
            Clear Local Storage Progress
          </div>
          <div style={{ fontSize: '13px', color: '#73452A' }}>
            Erases all earned stamp counts, history, and custom tasks.
          </div>
        </div>

        <button
          onClick={handleClearData}
          className="pixel-btn pixel-btn-parchment"
          style={{ color: '#C0392B', borderColor: '#C0392B', fontSize: '12px' }}
        >
          🗑️ Reset Progress
        </button>
      </div>
    </div>
  );
}
