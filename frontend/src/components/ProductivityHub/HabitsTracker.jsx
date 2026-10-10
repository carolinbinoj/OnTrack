import React, { useState } from 'react';
import { soundService } from '../../services/soundService';

export default function HabitsTracker() {
  const [habits, setHabits] = useState(() => {
    try {
      const raw = localStorage.getItem('ontrack_habits');
      return raw ? JSON.parse(raw) : [
        { id: 'h1', name: 'Morning Deep Recall (25m)', streak: 5, doneToday: true },
        { id: 'h2', name: 'Review Active Biology Deck', streak: 3, doneToday: false },
        { id: 'h3', name: 'Evening Journaling & Reflection', streak: 7, doneToday: true }
      ];
    } catch {
      return [];
    }
  });

  const [newHabit, setNewHabit] = useState('');

  const saveHabits = (newH) => {
    setHabits(newH);
    localStorage.setItem('ontrack_habits', JSON.stringify(newH));
  };

  const toggleDoneToday = (id) => {
    soundService.playClick();
    saveHabits(
      habits.map(h => {
        if (h.id === id) {
          const done = !h.doneToday;
          return {
            ...h,
            doneToday: done,
            streak: done ? h.streak + 1 : Math.max(0, h.streak - 1)
          };
        }
        return h;
      })
    );
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newHabit.trim()) return;
    soundService.playClick();
    const created = {
      id: `h_${Date.now()}`,
      name: newHabit.trim(),
      streak: 0,
      doneToday: false
    };
    saveHabits([...habits, created]);
    setNewHabit('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: '700', fontSize: '22px', color: '#2B170C' }}>
        Habit Streaks & Daily Routine
      </h2>

      {/* Add Habit */}
      <form
        onSubmit={handleAdd}
        style={{
          background: '#FCF8EE',
          border: '2px solid #E6A36E',
          borderRadius: '12px',
          padding: '14px',
          display: 'flex',
          gap: '10px'
        }}
      >
        <input
          type="text"
          placeholder="New daily habit (e.g. Read 20 pages)..."
          value={newHabit}
          onChange={e => setNewHabit(e.target.value)}
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid #D4BC92',
            fontSize: '14px',
            background: '#FFF'
          }}
        />
        <button type="submit" className="pixel-btn pixel-btn-amber" style={{ padding: '8px 16px', fontSize: '13px' }}>
          + Add Habit
        </button>
      </form>

      {/* Habits List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {habits.map(h => (
          <div
            key={h.id}
            style={{
              background: '#FCF8EE',
              border: '2px solid #E6A36E',
              borderRadius: '12px',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => toggleDoneToday(h.id)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: h.doneToday ? '#27AE60' : '#FFF',
                  border: '2px solid #2B170C',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFF',
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}
              >
                {h.doneToday ? '✓' : ''}
              </button>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#2B170C' }}>{h.name}</div>
                <div style={{ fontSize: '13px', color: '#73452A', fontFamily: "'Patrick Hand', cursive" }}>
                  {h.doneToday ? 'Completed today!' : 'Pending today'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '18px' }}>🔥</span>
              <span style={{ fontFamily: "'Pixelify Sans', monospace", fontSize: '18px', fontWeight: 'bold', color: '#E67E22' }}>
                {h.streak} day streak
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
