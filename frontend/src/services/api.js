// API Service for onTrack
// Communicates with the Python Flask backend with local storage fallback

const BACKEND_BASE_URL = 'http://localhost:5000';

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/api/health`, { method: 'GET' });
    if (!res.ok) throw new Error('Backend not healthy');
    return await res.json();
  } catch (err) {
    return { status: 'offline', gemini_configured: false };
  }
}

export async function evaluateExplanation({ topic, explanation, evaluatorType, referenceNotes, forceDemo }) {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/api/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic,
        explanation,
        evaluator_type: evaluatorType,
        reference_notes: referenceNotes || '',
        force_demo: forceDemo || false
      })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Evaluation failed on server');
    }
    return data;
  } catch (err) {
    // If server is unreachable or returned error, check if client wants local offline demo simulation
    if (forceDemo || err.message.includes('offline') || err.message.includes('Failed to fetch')) {
      return runLocalFallbackEvaluation({ topic, explanation, evaluatorType });
    }
    throw err;
  }
}

export async function recordSession(sessionData) {
  // Mirror to LocalStorage first for instant persistence
  const localHistory = getLocalSessions();
  localHistory.unshift(sessionData);
  localStorage.setItem('ontrack_sessions', JSON.stringify(localHistory));

  // Update local stamps
  if (sessionData.stamp_id) {
    updateLocalStamps(sessionData.stamp_id);
  }

  try {
    const res = await fetch(`${BACKEND_BASE_URL}/api/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sessionData)
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Backend offline, session persisted locally:', err);
  }
  return { status: 'saved_locally', id: sessionData.id };
}

export async function fetchSessions() {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/api/sessions`);
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('ontrack_sessions', JSON.stringify(data));
      return data;
    }
  } catch (err) {
    // fallback to local storage
  }
  return getLocalSessions();
}

export async function fetchJournalData() {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/api/journal`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // fallback
  }
  return getLocalJournalData();
}

// Local Storage helpers
export function getLocalSessions() {
  try {
    const raw = localStorage.getItem('ontrack_sessions');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function updateLocalStamps(stampId) {
  try {
    const stamps = getLocalStamps();
    stamps[stampId] = (stamps[stampId] || 0) + 1;
    localStorage.setItem('ontrack_stamps', JSON.stringify(stamps));
  } catch (e) {
    console.error(e);
  }
}

export function getLocalStamps() {
  try {
    const raw = localStorage.getItem('ontrack_stamps');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getLocalJournalData() {
  const stamps = getLocalStamps();
  const stampsData = {};
  Object.keys(stamps).forEach(k => {
    stampsData[k] = { stamp_type: k, count: stamps[k] };
  });

  const profExcellent = stamps['professor_excellent'] || 0;
  const coach2Unlocked = profExcellent >= 10;
  const totalExcellent = (stamps['professor_excellent'] || 0) + 
                         (stamps['conductor_excellent'] || 0) + 
                         (stamps['child_excellent'] || 0);
  const coach3Unlocked = totalExcellent >= 20;
  const distinct = Object.keys(stamps).filter(k => stamps[k] > 0).length;

  return {
    stamps: stampsData,
    distinct_stamps_count: distinct,
    is_collection_complete: distinct === 9,
    coach_unlocks: {
      1: true,
      2: coach2Unlocked,
      3: coach3Unlocked
    },
    prof_excellent_count: profExcellent,
    prof_excellent_required: 10,
    total_excellent_count: totalExcellent,
    total_excellent_required: 20
  };
}

function runLocalFallbackEvaluation({ topic, explanation, evaluatorType }) {
  const words = explanation.trim().split(/\s+/).length;
  let score = 55 + Math.min(words * 2, 35);
  if (evaluatorType === 'professor') score = Math.max(38, score - 8);
  if (evaluatorType === 'child') score = Math.min(95, score + 10);

  const STAMPS = {
    child: {
      name: 'Capybara Child',
      can_improve: { id: 'child_can_improve', name: 'Sprout of Wonder' },
      good: { id: 'child_good', name: 'Clover of Joy' },
      excellent: { id: 'child_excellent', name: 'Golden Star Seedling' }
    },
    conductor: {
      name: 'Friendly Conductor',
      can_improve: { id: 'conductor_can_improve', name: 'Ticket to Knowledge' },
      good: { id: 'conductor_good', name: 'Lantern of Clarity' },
      excellent: { id: 'conductor_excellent', name: 'Winged Iron Locomotive' }
    },
    professor: {
      name: 'Strict Professor',
      can_improve: { id: 'professor_can_improve', name: 'Inkwell & Quill' },
      good: { id: 'professor_good', name: 'Tome of Insight' },
      excellent: { id: 'professor_excellent', name: 'Academic Star Medallion' }
    }
  };

  const evalInfo = STAMPS[evaluatorType] || STAMPS.conductor;
  let tier = null;
  let stampInfo = null;
  let rewardValue = 0;

  if (score >= 90) {
    tier = 'excellent';
    stampInfo = evalInfo.excellent;
    rewardValue = evaluatorType === 'professor' ? 450 : evaluatorType === 'conductor' ? 200 : 100;
  } else if (score >= 70) {
    tier = 'good';
    stampInfo = evalInfo.good;
    rewardValue = evaluatorType === 'professor' ? 300 : evaluatorType === 'conductor' ? 150 : 75;
  } else if (score >= 40) {
    tier = 'can_improve';
    stampInfo = evalInfo.can_improve;
    rewardValue = evaluatorType === 'professor' ? 150 : evaluatorType === 'conductor' ? 100 : 50;
  }

  return {
    score,
    tier,
    is_stamp_awarded: Boolean(tier),
    stamp_id: stampInfo ? stampInfo.id : null,
    stamp_name: stampInfo ? stampInfo.name : null,
    evaluator_type: evaluatorType,
    evaluator_name: evalInfo.name,
    reward_value: rewardValue,
    summary_message: `[Demo Mode Assessment by ${evalInfo.name}]: You explained the core ideas of "${topic}". Connect to Gemini AI for real dynamic feedback!`,
    correct_concepts: [`Explained core concepts of ${topic}`, 'Clear articulation of the primary mechanism'],
    missing_concepts: ['Advanced edge cases', 'Broader system-level interactions'],
    misconceptions: [],
    improvement_tips: ['Include concrete real-world applications or quantitative examples.'],
    is_real_gemini: false,
    timestamp: new Date().toISOString()
  };
}
