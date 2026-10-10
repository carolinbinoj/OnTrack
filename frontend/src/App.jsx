import React, { useState, useEffect } from 'react';
import TrainLanding from './components/TrainLanding';
import JourneySetup from './components/JourneySetup';
import TrainCompartment from './components/TrainCompartment';
import EvaluatorSelect from './components/EvaluatorSelect';
import StudyBook from './components/StudyBook';
import EvaluationFeedback from './components/EvaluationFeedback';
import JourneyCelebration from './components/JourneyCelebration';
import TravelJournal from './components/TravelJournal';
import ProductivityHub from './components/ProductivityHub/ProductivityHub';

import {
  fetchSessions,
  fetchJournalData,
  recordSession,
  evaluateExplanation
} from './services/api';
import { soundService } from './services/soundService';

export default function App() {
  // Navigation / Game Screen State:
  // 'landing' | 'setup' | 'focus' | 'station' | 'book' | 'feedback' | 'celebration'
  const [screen, setScreen] = useState('landing');

  // Modals
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [isHubOpen, setIsHubOpen] = useState(false);

  // Persistent Progress
  const [sessions, setSessions] = useState([]);
  const [journalData, setJournalData] = useState({
    stamps: {},
    coach_unlocks: { 1: true, 2: false, 3: false },
    prof_excellent_count: 0,
    total_excellent_count: 0
  });

  // Active Journey Setup State
  const [journeyTasks, setJourneyTasks] = useState([
    {
      id: 'task_1',
      title: 'Photosynthesis & Chloroplast Reactions',
      description: 'Explain inputs, chlorophyll absorption, glucose formation, and oxygen release.',
      tag: 'Biology',
      duration: 25
    },
    {
      id: 'task_2',
      title: 'Cellular Respiration & ATP Cycle',
      description: 'Explain glycolysis, Krebs cycle, and how cells extract usable energy.',
      tag: 'Biology',
      duration: 25
    }
  ]);
  const [breakDuration, setBreakDuration] = useState(5);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [isBreak, setIsBreak] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState(1);

  // Evaluator & Study Book Interaction
  const [chosenEvaluator, setChosenEvaluator] = useState('conductor');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [lastEvalResult, setLastEvalResult] = useState(null);

  // Journey Summary Cache (current trip results)
  const [journeyResults, setJourneyResults] = useState([]);
  const [newlyUnlockedCoach, setNewlyUnlockedCoach] = useState(null);

  // Load persistent records on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [sessList, jData] = await Promise.all([
        fetchSessions(),
        fetchJournalData()
      ]);
      setSessions(sessList || []);
      setJournalData(jData || {
        stamps: {},
        coach_unlocks: { 1: true, 2: false, 3: false },
        prof_excellent_count: 0,
        total_excellent_count: 0
      });
    } catch (e) {
      console.error('Failed to load data:', e);
    }
  };

  // Journey Flow Handlers
  const handleStartSetup = () => {
    setScreen('setup');
  };

  const handleLaunchJourney = ({ tasks, breakDuration: bDur }) => {
    setJourneyTasks(tasks);
    setBreakDuration(bDur);
    setCurrentTaskIndex(0);
    setIsBreak(false);
    setJourneyResults([]);
    setNewlyUnlockedCoach(null);
    setScreen('focus');
  };

  const handleTaskTimerComplete = () => {
    // When focus timer finishes: arrive at railway station stop!
    soundService.playStationBell();
    setScreen('station');
  };

  const handleChooseEvaluator = (evaluatorType) => {
    setChosenEvaluator(evaluatorType);
    setScreen('book');
  };

  const handleSubmitExplanation = async ({ topic, explanation, evaluatorType }) => {
    setIsEvaluating(true);
    const activeTask = journeyTasks[currentTaskIndex];

    try {
      const result = await evaluateExplanation({
        topic: topic || activeTask?.title || 'Study Concept',
        explanation,
        evaluatorType,
        referenceNotes: activeTask?.description || '',
        forceDemo: false // Backend will attempt real Gemini, falls back gracefully
      });

      setLastEvalResult(result);

      // Record to persistent sessions and check coach unlocks
      const prevProfCount = journalData.prof_excellent_count || 0;
      const record = {
        id: `sess_${Date.now()}`,
        topic: activeTask?.title || topic,
        tag: activeTask?.tag || 'General',
        planned_duration: activeTask?.duration || 25,
        actual_duration: activeTask?.duration || 25,
        evaluator_type: evaluatorType,
        score: result.score,
        tier: result.tier,
        stamp_id: result.stamp_id,
        explanation,
        feedback: result,
        completed_at: new Date().toISOString(),
        is_real_gemini: result.is_real_gemini
      };

      await recordSession(record);
      await loadData(); // refresh counts from backend

      // Check if Coach 2 became newly unlocked
      if (result.stamp_id === 'professor_excellent' && prevProfCount + 1 >= 10 && !journalData.coach_unlocks?.[2]) {
        setNewlyUnlockedCoach(2);
      }

      // Add to journey results for end celebration
      setJourneyResults(prev => [...prev, { task: activeTask, result }]);

      setIsEvaluating(false);
      setScreen('feedback');
    } catch (err) {
      setIsEvaluating(false);
      alert(`Evaluation error: ${err.message}. Please verify backend server is running.`);
    }
  };

  const handleFeedbackContinue = () => {
    const nextIdx = currentTaskIndex + 1;
    if (nextIdx >= journeyTasks.length) {
      // All tasks completed! Final destination celebration!
      setScreen('celebration');
    } else {
      // Start Rest Break
      setCurrentTaskIndex(nextIdx);
      setIsBreak(true);
      setScreen('focus');
    }
  };

  const handleBreakComplete = () => {
    // Break finished, start next task!
    setIsBreak(false);
    setScreen('focus');
  };

  const handleQueueTaskFromHub = (task) => {
    setJourneyTasks(prev => [...prev, task]);
    setIsHubOpen(false);
    setScreen('setup');
  };

  const totalJourneyFocusMinutes = journeyTasks.reduce((acc, t) => acc + (t.duration || 0), 0);

  return (
    <div className="ontrack-app-root">
      {/* 1. SCREEN: STATION LANDING (Train Exterior) */}
      {screen === 'landing' && (
        <TrainLanding
          unlockedCoaches={journalData.coach_unlocks || { 1: true, 2: false, 3: false }}
          profExcellentCount={journalData.prof_excellent_count || 0}
          totalExcellentCount={journalData.total_excellent_count || 0}
          selectedCoach={selectedCoach}
          onSelectCoach={setSelectedCoach}
          onStartJourney={handleStartSetup}
          onOpenJournal={() => setIsJournalOpen(true)}
          onOpenHub={() => setIsHubOpen(true)}
        />
      )}

      {/* 2. SCREEN: PRE-SESSION SETUP / TICKET PLANNER */}
      {screen === 'setup' && (
        <JourneySetup
          initialTasks={journeyTasks}
          onStartJourney={handleLaunchJourney}
          onBackToStation={() => setScreen('landing')}
        />
      )}

      {/* 3. SCREEN: COMPARTMENT FOCUS & BREAK VIEW */}
      {screen === 'focus' && (
        <TrainCompartment
          currentTask={journeyTasks[currentTaskIndex]}
          taskIndex={currentTaskIndex}
          totalTasks={journeyTasks.length}
          isBreak={isBreak}
          breakDuration={breakDuration}
          onTaskComplete={isBreak ? handleBreakComplete : handleTaskTimerComplete}
          onEarlyFinish={isBreak ? handleBreakComplete : handleTaskTimerComplete}
          onAbandonJourney={() => setScreen('landing')}
        />
      )}

      {/* 4. SCREEN: STATION ARRIVAL & EVALUATOR SELECTION */}
      {screen === 'station' && (
        <EvaluatorSelect
          topicTitle={journeyTasks[currentTaskIndex]?.title}
          taskDescription={journeyTasks[currentTaskIndex]?.description}
          onSelectEvaluator={handleChooseEvaluator}
          onCancel={() => setScreen('focus')}
        />
      )}

      {/* 5. SCREEN: OPEN STUDY BOOK INTERFACE */}
      {screen === 'book' && (
        <StudyBook
          topicTitle={journeyTasks[currentTaskIndex]?.title}
          taskDescription={journeyTasks[currentTaskIndex]?.description}
          evaluatorType={chosenEvaluator}
          onSubmitExplanation={handleSubmitExplanation}
          onBackToEvaluators={() => setScreen('station')}
          isSubmitting={isEvaluating}
        />
      )}

      {/* 6. SCREEN: EVALUATION RESULTS & STAMP AWARD MODAL */}
      {screen === 'feedback' && (
        <EvaluationFeedback
          result={lastEvalResult}
          topicTitle={journeyTasks[currentTaskIndex]?.title}
          profExcellentCount={journalData.prof_excellent_count || 0}
          isLastTask={currentTaskIndex + 1 >= journeyTasks.length}
          onContinue={handleFeedbackContinue}
          onRetry={() => setScreen('book')}
        />
      )}

      {/* 7. SCREEN: FINAL DESTINATION CELEBRATION */}
      {screen === 'celebration' && (
        <JourneyCelebration
          journeyTasks={journeyTasks}
          journeyResults={journeyResults}
          totalMinutes={totalJourneyFocusMinutes}
          newCoachUnlocked={newlyUnlockedCoach}
          onStartNewJourney={() => setScreen('setup')}
          onOpenJournal={() => setIsJournalOpen(true)}
          onReturnToStation={() => setScreen('landing')}
        />
      )}

      {/* MODAL OVERLAY: TRAVEL JOURNAL */}
      {isJournalOpen && (
        <TravelJournal
          stampsData={journalData.stamps || {}}
          sessions={sessions}
          profExcellentCount={journalData.prof_excellent_count || 0}
          totalExcellentCount={journalData.total_excellent_count || 0}
          onClose={() => setIsJournalOpen(false)}
        />
      )}

      {/* MODAL OVERLAY: PRODUCTIVITY HUB */}
      {isHubOpen && (
        <ProductivityHub
          sessions={sessions}
          stampsData={journalData.stamps || {}}
          profExcellentCount={journalData.prof_excellent_count || 0}
          totalExcellentCount={journalData.total_excellent_count || 0}
          onQueueTaskToJourney={handleQueueTaskFromHub}
          onClose={() => setIsHubOpen(false)}
        />
      )}
    </div>
  );
}
