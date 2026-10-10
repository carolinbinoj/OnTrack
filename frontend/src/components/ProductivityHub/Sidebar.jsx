import React from 'react';
import { soundService } from '../../services/soundService';

export default function Sidebar({
  activeTab = 'stats',
  onSelectTab,
  onClose
}) {
  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'stats', label: 'Stats', icon: '📊' },
    { id: 'journal', label: 'Journal', icon: '📖' },
    { id: 'tasks', label: 'Tasks', icon: '📋' },
    { id: 'habits', label: 'Habits', icon: '🔁' },
    { id: 'goals', label: 'Goals', icon: '🚩' },
    { id: 'decks', label: 'Decks', icon: '📁' },
    { id: 'sounds', label: 'Sounds', icon: '🔊' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <aside
      style={{
        width: '110px',
        background: '#FAF2DF',
        borderRight: '3px solid #E6A36E',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '16px 8px',
        justifyContent: 'space-between',
        userSelect: 'none',
        flexShrink: 0
      }}
      className="productivity-hub-sidebar"
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        {/* SNOOPY LOGO FOR PRODUCTIVITY HUB (Exact Requirement) */}
        <div
          style={{
            marginBottom: '18px',
            textAlign: 'center',
            cursor: 'pointer'
          }}
          title="Productivity Hub Logo (Snoopy Asset)"
          onClick={() => { soundService.playClick(); onSelectTab('home'); }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              border: '3px solid #E67E22',
              background: '#FDF6E2',
              boxShadow: '0 4px 0 #D35400',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 4px auto'
            }}
          >
            <img
              src="/assets/snoopy_logo.png"
              alt="Snoopy Productivity Hub Logo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
              onError={(e) => {
                // If PNG isn't loaded, fallback to SVG
                e.target.src = '/assets/snoopy_logo.svg';
              }}
            />
          </div>
          <div
            style={{
              fontFamily: "'Pixelify Sans', monospace",
              fontSize: '11px',
              fontWeight: 'bold',
              color: '#B82B24',
              letterSpacing: '0.5px'
            }}
          >
            HUB LOGO
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  soundService.playClick();
                  onSelectTab(item.id);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px 4px',
                  borderRadius: '12px',
                  background: isActive ? '#EA580C' : 'transparent',
                  color: isActive ? '#FFF' : '#73452A',
                  border: isActive ? '2px solid #9A3412' : '2px solid transparent',
                  boxShadow: isActive ? '0 3px 0 #9A3412' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  fontFamily: "'Outfit', sans-serif"
                }}
                className="nav-tab-btn hover:bg-orange-100"
              >
                <span style={{ fontSize: '18px', marginBottom: '2px' }}>{item.icon}</span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: isActive ? 'bold' : '500',
                    letterSpacing: '0.3px'
                  }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Return to Train button at bottom */}
      <div style={{ width: '100%', textAlign: 'center', paddingTop: '12px', borderTop: '2px dashed #E6A36E' }}>
        <button
          onClick={() => {
            soundService.playClick();
            onClose();
          }}
          style={{
            background: '#FDF6E2',
            border: '2px solid #B82B24',
            color: '#B82B24',
            borderRadius: '8px',
            padding: '6px 4px',
            width: '100%',
            cursor: 'pointer',
            fontSize: '11px',
            fontFamily: "'Pixelify Sans', monospace",
            fontWeight: 'bold'
          }}
          title="Return to the train ride"
        >
          🚂 Back
        </button>
      </div>
    </aside>
  );
}
