import React, { useState } from 'react';
import { soundService } from '../../services/soundService';

export default function SoundsPage() {
  const [activeSound, setActiveSound] = useState(soundService.activeAmbient);
  const [volume, setVolume] = useState(soundService.volume);
  const [isMuted, setIsMuted] = useState(soundService.isMuted);

  const soundOptions = [
    { id: 'train', label: 'Vintage Train Chug', icon: '🚂', desc: 'Rhythmic click-clack locomotive wheels on iron mountain rails.' },
    { id: 'rain', label: 'Alpine Forest Rain', icon: '🌧️', desc: 'Gentle raindrops tapping on the coach carriage window.' },
    { id: 'fire', label: 'Amber Hearth & Lantern', icon: '🔥', desc: 'Cozy crackling embers from the coach potbelly stove.' }
  ];

  const handleSelectSound = (id) => {
    soundService.playClick();
    if (activeSound === id) {
      soundService.stopAmbient();
      setActiveSound(null);
    } else {
      soundService.startAmbient(id);
      setActiveSound(id);
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    soundService.setVolume(val);
  };

  const handleToggleMute = () => {
    soundService.playClick();
    const muted = soundService.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: '700', fontSize: '22px', color: '#2B170C' }}>
          Ambient Audio & Soundscapes
        </h2>
        <button
          onClick={handleToggleMute}
          className="pixel-btn pixel-btn-parchment"
          style={{ fontSize: '13px', padding: '6px 14px' }}
        >
          {isMuted ? '🔇 Unmute Master Audio' : '🔊 Master Audio On'}
        </button>
      </div>

      {/* Master Volume Slider */}
      <div
        style={{
          background: '#FCF8EE',
          border: '2px solid #E6A36E',
          borderRadius: '12px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}
      >
        <span style={{ fontSize: '18px' }}>🎚️</span>
        <span style={{ fontWeight: '600', fontSize: '14px', color: '#2B170C', minWidth: '100px' }}>
          Master Volume: {Math.round(volume * 100)}%
        </span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={handleVolumeChange}
          style={{ flex: 1, accentColor: '#E67E22', cursor: 'pointer' }}
        />
      </div>

      {/* Ambient Sound Selection Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
        {soundOptions.map((s) => {
          const isPlaying = activeSound === s.id;
          return (
            <div
              key={s.id}
              onClick={() => handleSelectSound(s.id)}
              style={{
                background: isPlaying ? '#FFF3E0' : '#FCF8EE',
                border: isPlaying ? '3px solid #E67E22' : '2px solid #E6A36E',
                borderRadius: '14px',
                padding: '18px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.15s ease',
                boxShadow: isPlaying ? '0 4px 0 #D35400' : 'none'
              }}
              className="hover:scale-102"
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '28px' }}>{s.icon}</span>
                  <span
                    style={{
                      background: isPlaying ? '#E67E22' : '#EAE1CE',
                      color: isPlaying ? '#FFF' : '#73452A',
                      padding: '2px 8px',
                      borderRadius: '999px',
                      fontSize: '11px',
                      fontFamily: "'Pixelify Sans', monospace",
                      fontWeight: 'bold'
                    }}
                  >
                    {isPlaying ? 'PLAYING ♫' : 'IDLE'}
                  </span>
                </div>
                <div style={{ fontWeight: '700', fontSize: '16px', color: '#2B170C', marginBottom: '4px' }}>
                  {s.label}
                </div>
                <p style={{ fontFamily: "'Patrick Hand', cursive", fontSize: '15px', color: '#73452A', lineHeight: 1.4 }}>
                  {s.desc}
                </p>
              </div>

              <div style={{ marginTop: '14px' }}>
                <button
                  className={isPlaying ? 'pixel-btn pixel-btn-amber' : 'pixel-btn pixel-btn-parchment'}
                  style={{ width: '100%', fontSize: '12px', padding: '6px' }}
                >
                  {isPlaying ? '❚❚ Stop Ambient' : '▶ Play Ambient'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
