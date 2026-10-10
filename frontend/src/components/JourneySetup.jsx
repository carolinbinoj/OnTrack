import React, { useState } from 'react';
import { soundService } from '../services/soundService';

export default function JourneySetup({
  initialTasks = [],
  onStartJourney,
  onBackToStation
}) {
  const [tasks, setTasks] = useState(
    initialTasks.length > 0
      ? initialTasks
      : [
          { id: '1', title: 'Math Revision', duration: 25 },
          { id: '2', title: 'Biology Notes', duration: 30 },
          { id: '3', title: 'History Essay', duration: 25 }
        ]
  );

  const [breakDuration, setBreakDuration] = useState(5);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDuration, setNewDuration] = useState(25);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    soundService.playClick();
    setTasks([
      ...tasks,
      { id: `t_${Date.now()}`, title: newTitle.trim(), duration: Number(newDuration) || 25 }
    ]);
    setNewTitle('');
    setIsAdding(false);
  };

  const removeTask = (id) => {
    soundService.playClick();
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleStart = () => {
    if (tasks.length === 0) return;
    soundService.playClick();
    soundService.playStationBell();
    onStartJourney({ tasks, breakDuration });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #162f22, #234832 60%, #162f22)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 20px',
        color: '#2A1810'
      }}
    >
      {/* Vibe Wood Framed Parchment Card (Matching Panel 4) */}
      <div
        className="vibe-wood-card"
        style={{
          width: '100%',
          maxWidth: '520px',
          padding: '28px'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#2A1810' }}>
            Plan Your Journey
          </h2>
          <button
            onClick={() => { soundService.playClick(); onBackToStation(); }}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '13px',
              fontWeight: '600',
              color: '#73452A',
              cursor: 'pointer'
            }}
          >
            ← Back
          </button>
        </div>

        {/* Task Rows List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
          {tasks.map((task) => (
            <div
              key={task.id}
              style={{
                background: '#FFFFFF',
                border: '1.5px solid #D4BC92',
                borderRadius: '8px',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#27AE60', fontSize: '18px', fontWeight: 'bold' }}>☑</span>
                <span style={{ fontSize: '15px', fontWeight: '600', color: '#2A1810' }}>
                  {task.title}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  className="num-clean"
                  style={{
                    background: '#FDF6E2',
                    border: '1px solid #D4BC92',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#73452A'
                  }}
                >
                  {task.duration} min
                </span>
                <button
                  onClick={() => removeTask(task.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#999'
                  }}
                  title="Remove"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Task Form or Button */}
        {isAdding ? (
          <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
            <input
              type="text"
              placeholder="Topic name..."
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              autoFocus
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1.5px solid #381E10',
                fontSize: '14px'
              }}
            />
            <input
              type="number"
              min="5"
              max="180"
              value={newDuration}
              onChange={e => setNewDuration(e.target.value)}
              style={{
                width: '60px',
                padding: '8px 4px',
                borderRadius: '6px',
                border: '1.5px solid #381E10',
                textAlign: 'center',
                fontSize: '14px'
              }}
            />
            <button type="submit" className="btn-green-pill" style={{ padding: '6px 14px', fontSize: '12px' }}>
              Add
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="btn-wood"
              style={{ padding: '6px 10px', fontSize: '12px' }}
            >
              ✕
            </button>
          </form>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
            <button
              onClick={() => setIsAdding(true)}
              className="btn-wood"
              style={{ padding: '6px 14px', fontSize: '13px' }}
            >
              + Add Task
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#73452A' }}>
              <span>Break Duration:</span>
              <select
                value={breakDuration}
                onChange={e => setBreakDuration(Number(e.target.value))}
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: '1px solid #D4BC92',
                  background: '#FFF',
                  fontWeight: '600'
                }}
              >
                <option value={5}>5 min</option>
                <option value={10}>10 min</option>
                <option value={15}>15 min</option>
              </select>
            </div>
          </div>
        )}

        {/* Start Focusing Green Pill Button */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={handleStart}
            disabled={tasks.length === 0}
            className="btn-green-pill"
            style={{
              width: '100%',
              padding: '12px 24px',
              fontSize: '17px'
            }}
          >
            Start Focusing
          </button>
        </div>
      </div>
    </div>
  );
}
