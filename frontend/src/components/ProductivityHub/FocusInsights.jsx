import React, { useState } from 'react';

export default function FocusInsights({ sessions = [] }) {
  const [breakdownView, setBreakdownView] = useState('Month');
  const [tagView, setTagView] = useState('Month');
  const [progressView, setProgressView] = useState('Week');

  // Real statistics derived from session history
  const todayStr = new Date().toISOString().split('T')[0];
  const todaySessions = sessions.filter(s => (s.completed_at || '').startsWith(todayStr));
  const todayMinutes = todaySessions.reduce((acc, s) => acc + Number(s.actual_duration || s.planned_duration || 0), 0);
  
  const allTimeSessionsCount = sessions.length;
  const lifetimeMinutes = sessions.reduce((acc, s) => acc + Number(s.actual_duration || s.planned_duration || 0), 0);
  const lifetimeHours = Math.floor(lifetimeMinutes / 60);
  const lifetimeRemainingMins = lifetimeMinutes % 60;

  // Tag aggregations
  const tagCounts = {};
  sessions.forEach(s => {
    const t = s.tag || 'General';
    tagCounts[t] = (tagCounts[t] || 0) + 1;
  });
  const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);

  // Hourly distribution for Peak Hours
  const hourlyCounts = Array(24).fill(0);
  sessions.forEach(s => {
    if (s.completed_at) {
      try {
        const hour = new Date(s.completed_at).getHours();
        hourlyCounts[hour] += 1;
      } catch (e) {}
    }
  });

  // Calculate 12-week Activity Map calendar
  const today = new Date();
  const activityDays = [];
  for (let i = 83; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateKey = d.toISOString().split('T')[0];
    const countForDay = sessions.filter(s => (s.completed_at || '').startsWith(dateKey)).length;
    activityDays.push({
      date: dateKey,
      dayOfWeek: d.getDay(),
      count: countForDay
    });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="focus-insights-view">
      {/* SECTION HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: '700',
            fontSize: '22px',
            color: '#2B170C',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          Focus Insights
        </h2>
        <span style={{ fontSize: '18px', color: '#73452A', cursor: 'pointer' }} title="Session Log">
          ⏱️
        </span>
      </div>

      {/* A. 4 METRIC CARDS ROW */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '14px'
        }}
      >
        {/* Card 1: Sessions Today */}
        <div className="hub-metric-card" style={cardStyle}>
          <div style={numberStyle}>{todaySessions.length}</div>
          <div style={labelStyle}>Sessions Today</div>
          <div style={subLabelStyle}>0 from yesterday</div>
        </div>

        {/* Card 2: All-Time Sessions */}
        <div className="hub-metric-card" style={cardStyle}>
          <div style={numberStyle}>{allTimeSessionsCount}</div>
          <div style={labelStyle}>All-Time Sessions</div>
          <div style={subLabelStyle}>{allTimeSessionsCount > 0 ? 'Consistent learner' : 'Start your first'}</div>
        </div>

        {/* Card 3: Time Today */}
        <div className="hub-metric-card" style={cardStyle}>
          <div style={numberStyle}>{todayMinutes}m</div>
          <div style={labelStyle}>Time Today</div>
          <div style={subLabelStyle}>0m from yesterday</div>
        </div>

        {/* Card 4: Lifetime Focus */}
        <div className="hub-metric-card" style={cardStyle}>
          <div style={numberStyle}>{lifetimeHours}h {lifetimeRemainingMins}m</div>
          <div style={labelStyle}>Lifetime Focus</div>
          <div style={subLabelStyle}>{allTimeSessionsCount} completed sessions</div>
        </div>
      </div>

      {/* B. BREAKDOWN & TOP TAGS ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {/* Breakdown Card */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontWeight: '700', fontSize: '16px', color: '#2B170C' }}>Breakdown</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={toggleContainerStyle}>
                {['Day', 'Week', 'Month'].map(t => (
                  <button
                    key={t}
                    onClick={() => setBreakdownView(t)}
                    style={t === breakdownView ? toggleActiveStyle : toggleInactiveStyle}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <span style={{ fontSize: '12px', color: '#73452A' }}>‹ Oct ›</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', minHeight: '120px' }}>
            {/* Circular Ring Chart */}
            <div style={{ position: 'relative', width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 100 100" width="90" height="90">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#EAE0CE" strokeWidth="12" />
                {lifetimeMinutes > 0 && (
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#E67E22"
                    strokeWidth="12"
                    strokeDasharray="251"
                    strokeDashoffset={251 * 0.3}
                    strokeLinecap="round"
                  />
                )}
              </svg>
              <div style={{ position: 'absolute', textAlign: 'center' }}>
                <div style={{ fontWeight: '700', fontSize: '14px', color: '#2B170C' }}>
                  {Math.floor(todayMinutes / 60)}h {todayMinutes % 60}m
                </div>
                <div style={{ fontSize: '10px', color: '#73452A' }}>Duration</div>
              </div>
            </div>

            <div style={{ fontFamily: "'Patrick Hand', cursive", fontSize: '15px', color: '#73452A' }}>
              {todaySessions.length === 0 ? 'No sessions logged today' : `${todaySessions.length} sessions completed`}
            </div>
          </div>
        </div>

        {/* Top Tags Card */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontWeight: '700', fontSize: '16px', color: '#2B170C' }}>Top Tags</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={toggleContainerStyle}>
                {['Week', 'Month', 'All'].map(t => (
                  <button
                    key={t}
                    onClick={() => setTagView(t)}
                    style={t === tagView ? toggleActiveStyle : toggleInactiveStyle}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <span style={{ fontSize: '12px', color: '#73452A' }}>‹ Oct ›</span>
            </div>
          </div>

          <div style={{ minHeight: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {sortedTags.length === 0 ? (
              <span style={{ fontFamily: "'Patrick Hand', cursive", fontSize: '16px', color: '#999' }}>
                No tagged sessions yet
              </span>
            ) : (
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {sortedTags.slice(0, 4).map(([tagName, count]) => (
                  <div key={tagName} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ background: '#E8F5E9', color: '#2E7D32', border: '1px solid #A5D6A7', padding: '2px 8px', borderRadius: '999px', fontSize: '12px', fontWeight: 'bold' }}>
                        {tagName}
                      </span>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#73452A' }}>{count} sessions</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* C. PROGRESS & PEAK HOURS ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {/* Progress Card */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div>
              <span style={{ fontWeight: '700', fontSize: '16px', color: '#2B170C' }}>Progress</span>
              <div style={{ fontSize: '12px', color: '#73452A' }}>
                Daily Average: {Math.round(lifetimeMinutes / Math.max(1, (allTimeSessionsCount || 1)))}m
              </div>
            </div>
            <div style={toggleContainerStyle}>
              {['Week', 'Month'].map(t => (
                <button
                  key={t}
                  onClick={() => setProgressView(t)}
                  style={t === progressView ? toggleActiveStyle : toggleInactiveStyle}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Simple 7-day mini bar chart */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '90px', paddingTop: '10px' }}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
              const height = (idx === 2 || idx === 5) && allTimeSessionsCount > 0 ? 55 : idx === 3 ? 40 : 15;
              return (
                <div key={day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: 1 }}>
                  <div
                    style={{
                      width: '18px',
                      height: `${height}px`,
                      background: height > 20 ? '#E67E22' : '#E8DEC9',
                      borderRadius: '4px 4px 0 0'
                    }}
                  />
                  <span style={{ fontSize: '11px', color: '#73452A' }}>{day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Peak Hours Card */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontWeight: '700', fontSize: '16px', color: '#2B170C' }}>Peak Hours</span>
            <span style={{ fontSize: '12px', color: '#73452A' }}>‹ Oct ›</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '90px', borderBottom: '1px dashed #D4BC92', paddingBottom: '4px' }}>
            {[6, 9, 12, 15, 18, 21].map((hour) => {
              const count = hourlyCounts[hour] || 0;
              const h = Math.max(8, count * 20);
              return (
                <div key={hour} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: 1 }}>
                  <div
                    style={{
                      width: '14px',
                      height: `${h}px`,
                      background: count > 0 ? '#E67E22' : '#EAE1CE',
                      borderRadius: '3px 3px 0 0'
                    }}
                  />
                  <span style={{ fontSize: '10px', color: '#73452A' }}>{hour}:00</span>
                </div>
              );
            })}
          </div>
          <div style={{ fontSize: '11px', color: '#73452A', textAlign: 'right', marginTop: '4px' }}>
            1m guideline
          </div>
        </div>
      </div>

      {/* D. ACTIVITY MAP (CALENDAR HEATMAP) */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <span style={{ fontWeight: '700', fontSize: '16px', color: '#2B170C' }}>Activity Map</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#73452A' }}>
            <span>Less</span>
            <div style={{ display: 'flex', gap: '3px' }}>
              <div style={{ width: '10px', height: '10px', background: '#EAE1CE', borderRadius: '2px' }} />
              <div style={{ width: '10px', height: '10px', background: '#F5B041', borderRadius: '2px' }} />
              <div style={{ width: '10px', height: '10px', background: '#E67E22', borderRadius: '2px' }} />
              <div style={{ width: '10px', height: '10px', background: '#B82B24', borderRadius: '2px' }} />
            </div>
            <span>More</span>
          </div>
        </div>

        {/* Heatmap Grid (7 rows for days of week, 12 columns for weeks) */}
        <div style={{ overflowX: 'auto', paddingBottom: '6px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '4px', minWidth: '400px' }}>
            {activityDays.map((d, i) => {
              const bg = d.count >= 3 ? '#B82B24' : d.count === 2 ? '#E67E22' : d.count === 1 ? '#F5B041' : '#EAE1CE';
              return (
                <div
                  key={i}
                  style={{
                    height: '14px',
                    background: bg,
                    borderRadius: '2px',
                    border: '1px solid rgba(0,0,0,0.06)'
                  }}
                  title={`${d.date}: ${d.count} session(s)`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  background: '#FCF8EE',
  border: '2px solid #E6A36E',
  borderRadius: '16px',
  padding: '16px 20px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
};

const numberStyle = {
  fontFamily: "'Outfit', sans-serif",
  fontWeight: '700',
  fontSize: '28px',
  color: '#2B170C',
  textAlign: 'center'
};

const labelStyle = {
  fontFamily: "'Outfit', sans-serif",
  fontWeight: '600',
  fontSize: '14px',
  color: '#73452A',
  textAlign: 'center',
  marginTop: '2px'
};

const subLabelStyle = {
  fontFamily: "'Patrick Hand', cursive",
  fontSize: '13px',
  color: '#999',
  textAlign: 'center',
  marginTop: '2px'
};

const toggleContainerStyle = {
  background: '#EAE1CE',
  borderRadius: '999px',
  padding: '2px',
  display: 'flex',
  gap: '2px'
};

const toggleActiveStyle = {
  background: '#FFF',
  color: '#2B170C',
  border: 'none',
  borderRadius: '999px',
  padding: '2px 8px',
  fontSize: '11px',
  fontWeight: 'bold',
  cursor: 'pointer'
};

const toggleInactiveStyle = {
  background: 'transparent',
  color: '#73452A',
  border: 'none',
  borderRadius: '999px',
  padding: '2px 8px',
  fontSize: '11px',
  cursor: 'pointer'
};
