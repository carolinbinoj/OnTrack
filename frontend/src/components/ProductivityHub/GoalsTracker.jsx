import React, { useState } from 'react';
import { soundService } from '../../services/soundService';

export default function GoalsTracker() {
  const [goals, setGoals] = useState(() => {
    try {
      const raw = localStorage.getItem('ontrack_goals');
      return raw ? JSON.parse(raw) : [
        { id: 'g1', title: 'Master AP Biology Unit 1', targetHours: 15, currentHours: 8.5, category: 'Biology' },
        { id: 'g2', title: 'Earn 10 Professor Excellent Stamps', targetHours: 10, currentHours: 4, category: 'Coaches' },
        { id: 'g3', title: 'Complete 30 Focus Sessions', targetHours: 20, currentHours: 14, category: 'Habits' }
      ];
    } catch {
      return [];
    }
  });

  const [title, setTitle] = useState('');
  const [target, setTarget] = useState(10);
  const [category, setCategory] = useState('Study');

  const saveGoals = (newG) => {
    setGoals(newG);
    localStorage.setItem('ontrack_goals', JSON.stringify(newG));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    soundService.playClick();
    const created = {
      id: `g_${Date.now()}`,
      title: title.trim(),
      targetHours: Number(target) || 10,
      currentHours: 0,
      category: category.trim() || 'General'
    };
    saveGoals([...goals, created]);
    setTitle('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: '700', fontSize: '22px', color: '#2B170C' }}>
        Productivity Goals & Milestones
      </h2>

      {/* Add Goal */}
      <form
        onSubmit={handleAdd}
        style={{
          background: '#FCF8EE',
          border: '2px solid #E6A36E',
          borderRadius: '12px',
          padding: '14px',
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 90px auto',
          gap: '10px'
        }}
      >
        <input
          type="text"
          placeholder="New Goal Title..."
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #D4BC92', fontSize: '14px' }}
        />
        <input
          type="text"
          placeholder="Category (e.g. Exam)"
          value={category}
          onChange={e => setCategory(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #D4BC92', fontSize: '14px' }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <input
            type="number"
            min="1"
            max="500"
            value={target}
            onChange={e => setTarget(e.target.value)}
            style={{ width: '50px', padding: '8px 4px', borderRadius: '8px', border: '1px solid #D4BC92', textAlign: 'center', fontSize: '14px' }}
          />
          <span style={{ fontSize: '12px', color: '#73452A' }}>hrs</span>
        </div>
        <button type="submit" className="pixel-btn pixel-btn-amber" style={{ padding: '8px 16px', fontSize: '13px' }}>
          + Add
        </button>
      </form>

      {/* Goals List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {goals.map(g => {
          const pct = Math.min(100, Math.round((g.currentHours / g.targetHours) * 100));
          return (
            <div
              key={g.id}
              style={{
                background: '#FCF8EE',
                border: '2px solid #E6A36E',
                borderRadius: '14px',
                padding: '16px 20px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div>
                  <span style={{ fontWeight: '700', fontSize: '17px', color: '#2B170C' }}>{g.title}</span>
                  <span style={{ marginLeft: '10px', background: '#E8F5E9', color: '#2E7D32', padding: '2px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 'bold' }}>
                    {g.category}
                  </span>
                </div>
                <span style={{ fontFamily: "'Pixelify Sans', monospace", fontSize: '16px', fontWeight: 'bold', color: '#E67E22' }}>
                  {g.currentHours} / {g.targetHours} hrs ({pct}%)
                </span>
              </div>

              {/* Progress bar */}
              <div style={{ height: '12px', background: '#EAE1CE', borderRadius: '6px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    background: pct >= 100 ? '#27AE60' : 'linear-gradient(to right, #F39C12, #E67E22)',
                    width: `${pct}%`,
                    transition: 'width 0.4s ease'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
