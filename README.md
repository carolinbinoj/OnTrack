# 🚂 onTrack — Cozy Pixel-Art Study Journey

> A gamified, storybook-inspired study web application set inside a red toy train traveling through the Swiss Alps. Combines Pomodoro focus sessions, active recall learning, Google Gemini AI evaluation, 9 collectible postage stamps, and a Productivity Hub.

---

## 🌟 Visual & Gameplay Features

1. **Stationary Red Toy Train Landing**
   - 4 connected coaches: Locomotive Engine (driver only), Coach 1 (*Alpine Cedar Coach*, unlocked), Coach 2 (*Panorama Vista Coach*, unlockable), Coach 3 (*Grand Academy Coach*, unlockable).
   - Wheel rotation animations and coach inspection drawer displaying exact unlock milestones.
   - Smooth zoom transition into the boarded coach.

2. **Train Compartment & Parallax Swiss Forest**
   - Side-on coach perspective with large wooden window frames.
   - 3-layer seamless horizontally scrolling pine forest and snow-capped Alpine peaks.
   - Cozy wooden compartment with green velvet seats, glowing amber lantern, books, notebook, rucksack, and alpine mug.
   - Animated Brown Bear Companion wearing a red scarf with breathing, blinking, focus/reading, break/coffee drinking, and celebration poses.

3. **Accurate Pomodoro Focus Timer**
   - Circular countdown timer with visible SVG progress ring mounted at the bottom-right.
   - Real timestamp calculation (`Date.now() + remaining`) immune to browser tab sleep or background drift.
   - "Finished early? Reduce time" and "Need more time? Add time" (+5m, +10m) adjustments.

4. **Active Recall & Open Study Book Interface**
   - Upon completing a focus stop, the train arrives at an Alpine railway station platform.
   - 3 illustrated AI evaluator personalities with distinct strictness and reward values:
     - **Capybara Child** (Curious 5yo, propeller beanie, simple encouraging feedback, 1x stamp value)
     - **Friendly Conductor** (Rail guide dog in conductor cap, balanced assessment, 2x stamp value)
     - **Strict Professor** (Academy mandrill scholar, rigorous conceptual analysis, 3x stamp value, required for Coach 2 unlock)
   - Large two-page open physical parchment book in the compartment foreground:
     - **Page 1**: "Today's Learning", lined handwritten parchment textarea, word counter, and sample loader.
     - **Page 2**: Notes tab, chemical/conceptual diagram, and rubric breakdown.
     - Green pixel-art **Submit Journal** button.

5. **Google Gemini AI Evaluation (Python Backend)**
   - Backend evaluates factual correctness, concept coverage, misconceptions, and reasoning quality.
   - Returns structured JSON: score (0–100), correct concepts, missing concepts, misconceptions, improvement tips, and evaluator voice summary.
   - Thresholds:
     - `< 40%`: No stamp (helpful feedback + retry without penalty)
     - `40% – 69%`: **Can Improve** stamp
     - `70% – 89%`: **Good** stamp
     - `90% – 100%`: **Excellent** stamp
   - Evaluator reward values: Child (1x), Conductor (2x), Professor (3x).

6. **9 Collectible Postage Stamps & Travel Journal**
   - Exactly 9 distinct pixel-art stamps with perforated cream postage borders, framed illustrations, and emblems.
   - Leather-bound Travel Journal album with 3x3 collection slots, silhouettes for undiscovered stamps, detailed inspection view, and Coach unlock progression bars.
   - Unlocking **Coach 2**: Requires **10 Professor — Excellent stamps**.
   - Unlocking **Coach 3**: Requires **20 Total Excellent stamps**.

7. **Final Destination Celebration**
   - Stop at terminal station with confetti celebration (`canvas-confetti`).
   - Summary of completed tasks, total focus minutes, and a sequential stamp reveal animation for stamps earned during the current journey.

8. **Productivity Hub Dashboard & Snoopy Logo**
   - Styled after the reference design: warm cream background, orange borders, and brown typography.
   - **Snoopy Logo**: Located in `/assets/snoopy_logo.png` and rendered prominently in the sidebar.
   - **Focus Insights**: Sessions Today, All-Time Sessions, Time Today, Lifetime Focus.
   - **Breakdown**: Circular duration ring with Day/Week/Month views.
   - **Top Tags**: Most-used study tags.
   - **Progress & Peak Hours**: Productivity graphs by hour and day.
   - **Activity Map**: 12-week GitHub-style activity calendar heatmap.
   - **Tasks**: Create, toggle, delete, and queue directly into the next train journey.
   - **Habits**: Daily streak tracking with check-ins.
   - **Goals**: Target hours and progress bars.
   - **Decks**: Flashcard flip-card study mode.
   - **Sounds**: Procedural Web Audio mixer (train chug, forest rain, fireplace crackle) with volume and mute.
   - **Settings**: Focus/break defaults, reduced motion toggle, and backend status.

---

## 🛠️ Project Structure

```
OnTrack/
├── frontend/
│   ├── public/
│   │   └── assets/
│   │       ├── snoopy_logo.png           # Snoopy Productivity Hub logo
│   │       ├── snoopy_logo.svg           # Scalable vector Snoopy badge
│   │       ├── avatar_capybara.png       # Capybara evaluator portrait
│   │       ├── avatar_conductor.png      # Conductor dog portrait
│   │       ├── avatar_professor.png      # Professor baboon portrait
│   │       ├── stamp_gold_star.jpg       # Golden star reference stamp
│   │       └── README_SNOOPY.md          # Snoopy asset instructions
│   ├── src/
│   │   ├── components/
│   │   │   ├── TrainLanding.jsx          # Red train exterior (4 coaches)
│   │   │   ├── JourneySetup.jsx          # Ticket planner
│   │   │   ├── TrainCompartment.jsx      # Coach interior view
│   │   │   ├── ParallaxForest.jsx        # Looping Swiss pine forest
│   │   │   ├── BearCompanion.jsx         # Animated bear companion
│   │   │   ├── FocusTimer.jsx            # Circular Pomodoro timer
│   │   │   ├── EvaluatorSelect.jsx       # 3 evaluator cards
│   │   │   ├── StudyBook.jsx             # Open parchment study book
│   │   │   ├── EvaluationFeedback.jsx    # Evaluation results modal
│   │   │   ├── StampRenderer.jsx         # 9 collectible postage stamps
│   │   │   ├── TravelJournal.jsx         # Leather journal & 3x3 album
│   │   │   ├── JourneyCelebration.jsx    # Destination ceremony
│   │   │   └── ProductivityHub/          # Productivity Hub dashboard
│   │   ├── services/
│   │   │   ├── api.js                    # Backend client with local mirror
│   │   │   └── soundService.js           # Procedural Web Audio engine
│   │   ├── index.css                     # Cozy pixel-art design system
│   │   └── App.jsx                       # Main application coordinator
│   └── package.json
├── backend/
│   ├── app.py                            # Flask server (Gemini + SQLite)
│   ├── requirements.txt
│   ├── .env.example
│   └── data/
│       └── ontrack.db                    # SQLite persistent database
└── README.md
```

---

## 🚀 Running the Application Locally

### 1. Start the Python Backend
From the root directory:
```bash
# Install backend requirements
pip install -r backend/requirements.txt

# (Optional) Add your Gemini API key:
# Copy backend/.env.example to backend/.env and add GEMINI_API_KEY=your_key
# Without a key, the backend automatically provides realistic demo evaluation!

# Start Flask server (runs on http://localhost:5000)
python backend/app.py
```

### 2. Start the React Frontend
In a new terminal:
```bash
cd frontend

# Install dependencies (if not already installed)
npm install

# Start Vite development server
npm run dev
```

Open your browser at **`http://localhost:5173/`**.

---

## 🎨 Snoopy Logo Location
Per specifications:
- Place any custom Snoopy logo image directly at `frontend/public/assets/snoopy_logo.png`.
- The Productivity Hub sidebar automatically renders this image with fallbacks.
