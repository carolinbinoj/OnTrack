import React, { useState } from 'react';
import Sidebar from './Sidebar';
import FocusInsights from './FocusInsights';
import TasksManager from './TasksManager';
import HabitsTracker from './HabitsTracker';
import GoalsTracker from './GoalsTracker';
import DecksManager from './DecksManager';
import SoundsPage from './SoundsPage';
import SettingsPage from './SettingsPage';
import TravelJournal from '../TravelJournal';
import { soundService } from '../../services/soundService';

export default function ProductivityHub({
  sessions = [],
  stampsData = {},
  profExcellentCount = 0,
  totalExcellentCount = 0,
  onQueueTaskToJourney,
  onClose
}) {
  const [activeTab, setActiveTab] = useState('stats'); // 'home' | 'stats' | 'journal' | 'tasks' | 'habits' | 'goals' | 'decks' | 'sounds' | 'settings'

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(25, 18, 12, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 110,
        padding: '16px',
        userSelect: 'none'
      }}
      className="productivity-hub-modal-overlay"
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1120px',
          height: '92vh',
          background: '#FCF8EE',
          border: '3px solid #E6A36E',
          borderRadius: '24px',
          boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative'
        }}
        className="productivity-hub-window"
      >
        {/* TOP WINDOW HEADER BAR */}
        <header
          style={{
            height: '56px',
            background: '#FAF2DF',
            borderBottom: '2px solid #E6A36E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Briefcase Icon matching reference screenshot */}
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#FCF8EE',
                border: '1.5px solid #E67E22',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px'
              }}
            >
              💼
            </div>
            <h1
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: '700',
                fontSize: '20px',
                color: '#2B170C',
                margin: 0
              }}
            >
              Productivity Hub
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Fullscreen / expand dummy icon */}
            <button
              style={{
                background: 'transparent',
                border: '1px solid #D4BC92',
                borderRadius: '6px',
                padding: '4px 8px',
                cursor: 'pointer',
                color: '#73452A'
              }}
              title="Window Mode"
            >
              ⛶
            </button>
            {/* Close button */}
            <button
              onClick={() => {
                soundService.playClick();
                onClose();
              }}
              style={{
                background: 'transparent',
                border: '1px solid #D4BC92',
                borderRadius: '6px',
                padding: '4px 8px',
                cursor: 'pointer',
                color: '#73452A',
                fontWeight: 'bold'
              }}
              title="Close Productivity Hub"
            >
              ✕
            </button>
          </div>
        </header>

        {/* MAIN BODY: SIDEBAR + CONTENT VIEW */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Sidebar */}
          <Sidebar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            onClose={onClose}
          />

          {/* Main Content Area */}
          <main
            style={{
              flex: 1,
              padding: '24px 28px',
              overflowY: 'auto',
              background: '#FDFBF7'
            }}
            className="hub-content-container"
          >
            {activeTab === 'home' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div
                  style={{
                    background: '#FCF8EE',
                    border: '2px solid #E6A36E',
                    borderRadius: '16px',
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px'
                  }}
                >
                  <img
                    src="/assets/snoopy_logo.png"
                    alt="Snoopy Logo"
                    style={{ width: '80px', height: '80px', objectFit: 'contain' }}
                    onError={(e) => { e.target.src = '/assets/snoopy_logo.svg'; }}
                  />
                  <div>
                    <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: '700', fontSize: '24px', color: '#B82B24', margin: 0 }}>
                      Welcome to your onTrack Hub!
                    </h2>
                    <p style={{ fontFamily: "'Patrick Hand', cursive", fontSize: '18px', color: '#73452A', marginTop: '4px' }}>
                      Track your sessions, complete daily habit streaks, flip study cards, and manage your journey through the Swiss forest.
                    </p>
                  </div>
                </div>
                <FocusInsights sessions={sessions} />
              </div>
            )}

            {activeTab === 'stats' && <FocusInsights sessions={sessions} />}

            {activeTab === 'journal' && (
              <TravelJournal
                stampsData={stampsData}
                sessions={sessions}
                profExcellentCount={profExcellentCount}
                totalExcellentCount={totalExcellentCount}
                onClose={() => setActiveTab('stats')}
              />
            )}

            {activeTab === 'tasks' && (
              <TasksManager onQueueTaskToJourney={onQueueTaskToJourney} />
            )}

            {activeTab === 'habits' && <HabitsTracker />}

            {activeTab === 'goals' && <GoalsTracker />}

            {activeTab === 'decks' && <DecksManager />}

            {activeTab === 'sounds' && <SoundsPage />}

            {activeTab === 'settings' && <SettingsPage />}
          </main>
        </div>
      </div>
    </div>
  );
}
