import React, { useState } from 'react';
import { soundService } from '../../services/soundService';

export default function TasksManager({ onQueueTaskToJourney }) {
  const [tasks, setTasks] = useState(() => {
    try {
      const raw = localStorage.getItem('ontrack_user_tasks');
      return raw ? JSON.parse(raw) : [
        { id: '1', title: 'Cellular Mitosis Stages', tag: 'Biology', duration: 25, completed: false, dueDate: 'Today' },
        { id: '2', title: 'Thermodynamics Second Law', tag: 'Physics', duration: 30, completed: true, dueDate: 'Tomorrow' },
        { id: '3', title: 'Calculus Integration by Parts', tag: 'Math', duration: 25, completed: false, dueDate: 'Oct 15' }
      ];
    } catch {
      return [];
    }
  });

  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('Study');
  const [duration, setDuration] = useState(25);

  const saveTasks = (newTasks) => {
    setTasks(newTasks);
    localStorage.setItem('ontrack_user_tasks', JSON.stringify(newTasks));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    soundService.playClick();
    const newTask = {
      id: `task_${Date.now()}`,
      title: title.trim(),
      tag: tag.trim() || 'General',
      duration: Number(duration) || 25,
      completed: false,
      dueDate: 'Soon'
    };
    saveTasks([newTask, ...tasks]);
    setTitle('');
  };

  const toggleComplete = (id) => {
    soundService.playClick();
    saveTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    soundService.playClick();
    saveTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: '700', fontSize: '22px', color: '#2B170C' }}>
          Study Tasks ({tasks.filter(t => !t.completed).length} Pending)
        </h2>
      </div>

      {/* Add Task Input Form */}
      <form
        onSubmit={handleAddTask}
        style={{
          background: '#FCF8EE',
          border: '2px solid #E6A36E',
          borderRadius: '12px',
          padding: '16px',
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 90px auto',
          gap: '10px',
          alignItems: 'center'
        }}
      >
        <input
          type="text"
          placeholder="New task title..."
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid #D4BC92',
            fontSize: '14px',
            background: '#FFF'
          }}
        />
        <input
          type="text"
          placeholder="Tag (e.g. History)"
          value={tag}
          onChange={e => setTag(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid #D4BC92',
            fontSize: '14px',
            background: '#FFF'
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <input
            type="number"
            min="5"
            max="180"
            value={duration}
            onChange={e => setDuration(e.target.value)}
            style={{
              width: '50px',
              padding: '8px 4px',
              borderRadius: '8px',
              border: '1px solid #D4BC92',
              textAlign: 'center',
              fontSize: '14px',
              background: '#FFF'
            }}
          />
          <span style={{ fontSize: '12px', color: '#73452A' }}>m</span>
        </div>
        <button
          type="submit"
          className="pixel-btn pixel-btn-amber"
          style={{ padding: '8px 16px', fontSize: '13px' }}
        >
          + Add
        </button>
      </form>

      {/* Tasks List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {tasks.map(t => (
          <div
            key={t.id}
            style={{
              background: '#FCF8EE',
              border: '2px solid #E6A36E',
              borderRadius: '12px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              opacity: t.completed ? 0.6 : 1
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input
                type="checkbox"
                checked={t.completed}
                onChange={() => toggleComplete(t.id)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <div>
                <span
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#2B170C',
                    textDecoration: t.completed ? 'line-through' : 'none'
                  }}
                >
                  {t.title}
                </span>
                <span
                  style={{
                    marginLeft: '10px',
                    background: '#E8F5E9',
                    color: '#2E7D32',
                    border: '1px solid #A5D6A7',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    fontSize: '11px',
                    fontWeight: 'bold'
                  }}
                >
                  {t.tag}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '13px', color: '#73452A' }}>⏱️ {t.duration}m</span>

              {onQueueTaskToJourney && !t.completed && (
                <button
                  onClick={() => {
                    soundService.playClick();
                    onQueueTaskToJourney(t);
                  }}
                  className="pixel-btn pixel-btn-primary"
                  style={{ padding: '4px 10px', fontSize: '11px' }}
                  title="Queue this task into your train focus journey"
                >
                  🚂 Add to Journey
                </button>
              )}

              <button
                onClick={() => deleteTask(t.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#C0392B',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
