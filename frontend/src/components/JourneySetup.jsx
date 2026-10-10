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
          {
            id: 'task_1',
            title: 'Photosynthesis & Light Reactions',
            description: 'Understand chloroplasts, chlorophyll pigment, and ATP production',
            tag: 'Biology',
            duration: 25
          },
          {
            id: 'task_2',
            title: 'Cellular Respiration',
            description: 'Glycolysis, Krebs cycle, and electron transport chain comparison',
            tag: 'Biology',
            duration: 25
          }
        ]
  );

  const [breakDuration, setBreakDuration] = useState(5);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskTag, setNewTaskTag] = useState('Study');
  const [newTaskDuration, setNewTaskDuration] = useState(25);
  const [errorMsg, setErrorMsg] = useState('');

  const totalFocusMinutes = tasks.reduce((acc, t) => acc + Number(t.duration || 0), 0);
  const totalBreakMinutes = Math.max(0, tasks.length - 1) * Number(breakDuration);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) {
      setErrorMsg('Please enter a topic or task title.');
      return;
    }
    setErrorMsg('');
    soundService.playClick();

    const created = {
      id: `task_${Date.now()}`,
      title: newTaskTitle.trim(),
      description: newTaskDesc.trim(),
      tag: newTaskTag.trim() || 'General',
      duration: Math.max(1, Number(newTaskDuration) || 25)
    };

    setTasks([...tasks, created]);
    setNewTaskTitle('');
    setNewTaskDesc('');
  };

  const handleRemoveTask = (id) => {
    soundService.playClick();
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleMoveTask = (index, direction) => {
    soundService.playClick();
    const newTasks = [...tasks];
    const target = index + direction;
    if (target < 0 || target >= newTasks.length) return;
    const temp = newTasks[index];
    newTasks[index] = newTasks[target];
    newTasks[target] = temp;
    setTasks(newTasks);
  };

  const handleStart = () => {
    if (tasks.length === 0) {
      setErrorMsg('Please add at least one study task for your train journey.');
      return;
    }
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
        padding: '30px 20px',
        color: '#2b170c'
      }}
      className="journey-setup-page"
    >
      <div
        style={{
          width: '100%',
          maxWidth: '820px',
          background: '#FCF8EE',
          border: '4px solid #2B170C',
          borderRadius: '16px',
          boxShadow: '0 8px 0 #2B170C, inset 0 2px 0 rgba(255,255,255,0.8)',
          padding: '28px 32px',
          position: 'relative'
        }}
        className="ticket-planner"
      >
        {/* Ticket Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '3px dashed #d4bc92',
            paddingBottom: '16px',
            marginBottom: '20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '32px' }}>🎫</span>
            <div>
              <h2
                style={{
                  fontFamily: "'Pixelify Sans', monospace",
                  fontSize: '26px',
                  color: '#B82B24',
                  margin: 0
                }}
              >
                Study Journey Ticket Planner
              </h2>
              <div style={{ fontFamily: "'Patrick Hand', cursive", fontSize: '17px', color: '#73452a' }}>
                Plan your station stops, focus intervals, and break times
              </div>
            </div>
          </div>

          <button
            onClick={() => { soundService.playClick(); onBackToStation(); }}
            className="pixel-btn pixel-btn-parchment"
            style={{ fontSize: '13px', padding: '6px 14px' }}
          >
            ← Back to Train
          </button>
        </div>

        {/* Journey Statistics Summary Ribbon */}
        <div
          style={{
            background: '#F4ECE1',
            border: '2px solid #2B170C',
            borderRadius: '10px',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Patrick Hand', cursive", fontSize: '14px', color: '#73452a' }}>Tasks / Stops</div>
            <div style={{ fontFamily: "'Pixelify Sans', monospace", fontSize: '20px', fontWeight: 'bold', color: '#B82B24' }}>
              {tasks.length}
            </div>
          </div>
          <div style={{ width: '2px', height: '32px', background: '#D4BC92' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Patrick Hand', cursive", fontSize: '14px', color: '#73452a' }}>Total Focus Time</div>
            <div style={{ fontFamily: "'Pixelify Sans', monospace", fontSize: '20px', fontWeight: 'bold', color: '#27AE60' }}>
              {totalFocusMinutes} mins
            </div>
          </div>
          <div style={{ width: '2px', height: '32px', background: '#D4BC92' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Patrick Hand', cursive", fontSize: '14px', color: '#73452a' }}>Break Between Tasks</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <input
                type="number"
                min="1"
                max="30"
                value={breakDuration}
                onChange={e => setBreakDuration(Math.max(1, Number(e.target.value)))}
                style={{
                  width: '54px',
                  padding: '2px 6px',
                  fontFamily: "'Pixelify Sans', monospace",
                  fontSize: '15px',
                  textAlign: 'center',
                  border: '2px solid #2B170C',
                  borderRadius: '4px',
                  background: '#FFF'
                }}
              />
              <span style={{ fontFamily: "'Pixelify Sans', monospace", fontSize: '13px' }}>mins</span>
            </div>
          </div>
        </div>

        {/* Task Cards List */}
        <div style={{ marginBottom: '24px' }}>
          <h3
            style={{
              fontFamily: "'Pixelify Sans', monospace",
              fontSize: '18px',
              color: '#2B170C',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span>Planned Study Tasks ({tasks.length})</span>
            <span style={{ fontFamily: "'Patrick Hand', cursive", fontSize: '14px', color: '#73452a' }}>
              Drag or use arrows to reorder stops
            </span>
          </h3>

          {tasks.length === 0 ? (
            <div
              style={{
                padding: '24px',
                textAlign: 'center',
                background: '#FAF0E6',
                border: '2px dashed #D4BC92',
                borderRadius: '8px',
                fontFamily: "'Patrick Hand', cursive",
                fontSize: '18px',
                color: '#73452a'
              }}
            >
              No tasks planned yet. Add your study topics below to begin your train journey!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {tasks.map((task, idx) => (
                <div
                  key={task.id}
                  style={{
                    background: '#FFFFFF',
                    border: '2px solid #2B170C',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 3px 0 #2B170C'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                    <div
                      style={{
                        background: '#B82B24',
                        color: '#FFF',
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: "'Pixelify Sans', monospace",
                        fontSize: '14px',
                        fontWeight: 'bold',
                        border: '2px solid #2B170C'
                      }}
                    >
                      {idx + 1}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: '600', fontSize: '16px' }}>
                          {task.title}
                        </span>
                        <span
                          style={{
                            background: '#E8F5E9',
                            color: '#2E7D32',
                            padding: '2px 8px',
                            borderRadius: '999px',
                            fontSize: '11px',
                            fontFamily: "'Pixelify Sans', monospace",
                            border: '1px solid #A5D6A7'
                          }}
                        >
                          {task.tag}
                        </span>
                      </div>
                      {task.description && (
                        <div style={{ fontFamily: "'Patrick Hand', cursive", fontSize: '15px', color: '#666', marginTop: '2px' }}>
                          {task.description}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '14px' }}>⏱️</span>
                      <input
                        type="number"
                        min="1"
                        max="180"
                        value={task.duration}
                        onChange={(e) => {
                          const updated = [...tasks];
                          updated[idx].duration = Math.max(1, Number(e.target.value));
                          setTasks(updated);
                        }}
                        style={{
                          width: '50px',
                          padding: '2px 4px',
                          fontFamily: "'Pixelify Sans', monospace",
                          fontSize: '14px',
                          textAlign: 'center',
                          border: '2px solid #2B170C',
                          borderRadius: '4px'
                        }}
                      />
                      <span style={{ fontFamily: "'Pixelify Sans', monospace", fontSize: '12px' }}>m</span>
                    </div>

                    {/* Reorder Buttons */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <button
                        disabled={idx === 0}
                        onClick={() => handleMoveTask(idx, -1)}
                        style={{
                          background: '#E2D5C3',
                          border: '1px solid #2B170C',
                          borderRadius: '3px',
                          cursor: idx === 0 ? 'not-allowed' : 'pointer',
                          padding: '1px 6px',
                          fontSize: '10px'
                        }}
                      >
                        ▲
                      </button>
                      <button
                        disabled={idx === tasks.length - 1}
                        onClick={() => handleMoveTask(idx, 1)}
                        style={{
                          background: '#E2D5C3',
                          border: '1px solid #2B170C',
                          borderRadius: '3px',
                          cursor: idx === tasks.length - 1 ? 'not-allowed' : 'pointer',
                          padding: '1px 6px',
                          fontSize: '10px'
                        }}
                      >
                        ▼
                      </button>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => handleRemoveTask(task.id)}
                      style={{
                        background: '#FDEDEC',
                        color: '#C0392B',
                        border: '2px solid #C0392B',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        padding: '4px 8px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}
                      title="Remove task"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add New Task Form */}
        <form
          onSubmit={handleAddTask}
          style={{
            background: '#F7EDD7',
            border: '2px solid #2B170C',
            borderRadius: '10px',
            padding: '16px',
            marginBottom: '24px'
          }}
        >
          <div style={{ fontFamily: "'Pixelify Sans', monospace", fontWeight: 'bold', fontSize: '15px', marginBottom: '10px' }}>
            + Add a Study Stop / Topic
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 90px', gap: '10px', marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="Topic or Concept (e.g. Newton's 3 Laws)"
              value={newTaskTitle}
              onChange={e => setNewTaskTitle(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '2px solid #2B170C',
                borderRadius: '6px',
                fontFamily: "'Outfit', sans-serif",
                fontSize: '14px',
                background: '#FFF'
              }}
            />
            <input
              type="text"
              placeholder="Tag (e.g. Physics)"
              value={newTaskTag}
              onChange={e => setNewTaskTag(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '2px solid #2B170C',
                borderRadius: '6px',
                fontFamily: "'Outfit', sans-serif",
                fontSize: '14px',
                background: '#FFF'
              }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <input
                type="number"
                min="1"
                max="180"
                value={newTaskDuration}
                onChange={e => setNewTaskDuration(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 6px',
                  border: '2px solid #2B170C',
                  borderRadius: '6px',
                  fontFamily: "'Pixelify Sans', monospace",
                  fontSize: '14px',
                  textAlign: 'center',
                  background: '#FFF'
                }}
              />
              <span style={{ fontSize: '12px', fontFamily: "'Pixelify Sans', monospace" }}>min</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Optional notes or rubric (e.g. Key terms: inertia, F=ma, action-reaction)"
              value={newTaskDesc}
              onChange={e => setNewTaskDesc(e.target.value)}
              style={{
                flex: 1,
                padding: '8px 12px',
                border: '2px solid #2B170C',
                borderRadius: '6px',
                fontFamily: "'Patrick Hand', cursive",
                fontSize: '16px',
                background: '#FFF'
              }}
            />
            <button
              type="submit"
              className="pixel-btn pixel-btn-amber"
              style={{ padding: '8px 18px', fontSize: '14px' }}
            >
              Add Stop
            </button>
          </div>

          {errorMsg && (
            <div style={{ color: '#C0392B', fontFamily: "'Pixelify Sans', monospace", fontSize: '13px', marginTop: '8px' }}>
              ⚠️ {errorMsg}
            </div>
          )}
        </form>

        {/* Departure Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: "'Patrick Hand', cursive", fontSize: '16px', color: '#73452a' }}>
            Ready to depart on your learning adventure?
          </div>
          <button
            onClick={handleStart}
            className="pixel-btn pixel-btn-train"
            style={{ fontSize: '18px', padding: '12px 36px' }}
          >
            🚂 Board Train & Depart
          </button>
        </div>
      </div>
    </div>
  );
}
