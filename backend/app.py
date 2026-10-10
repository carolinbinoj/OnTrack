import os
import json
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from flask import Flask, request, jsonify
import httpx
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Basic CORS headers
@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    return response

DB_PATH = Path(__file__).parent / "data" / "ontrack.db"
DB_PATH.parent.mkdir(parents=True, exist_ok=True)

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS sessions (
            id TEXT PRIMARY KEY,
            topic TEXT,
            tag TEXT,
            planned_duration INTEGER,
            actual_duration INTEGER,
            evaluator_type TEXT,
            score INTEGER,
            tier TEXT,
            stamp_id TEXT,
            explanation TEXT,
            feedback_json TEXT,
            completed_at TEXT,
            is_real_gemini INTEGER
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS stamps (
            id TEXT PRIMARY KEY,
            stamp_type TEXT UNIQUE,
            count INTEGER DEFAULT 0,
            first_earned_at TEXT,
            last_earned_at TEXT
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS user_progress (
            key TEXT PRIMARY KEY,
            value TEXT
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS tasks (
            id TEXT PRIMARY KEY,
            title TEXT,
            description TEXT,
            tag TEXT,
            duration INTEGER,
            completed INTEGER DEFAULT 0,
            due_date TEXT,
            created_at TEXT
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS habits (
            id TEXT PRIMARY KEY,
            name TEXT,
            streak INTEGER DEFAULT 0,
            history_json TEXT,
            created_at TEXT
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS goals (
            id TEXT PRIMARY KEY,
            title TEXT,
            target_hours REAL,
            current_hours REAL DEFAULT 0,
            category TEXT,
            created_at TEXT
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS decks (
            id TEXT PRIMARY KEY,
            title TEXT,
            cards_json TEXT,
            created_at TEXT
        )
    """)
    conn.commit()
    conn.close()

init_db()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()

STAMP_RULES = {
    "child": {
        "name": "Capybara Child",
        "multiplier": 1,
        "base_value": 50,
        "stamps": {
            "can_improve": {"id": "child_can_improve", "name": "Sprout of Wonder", "symbol": "🌱"},
            "good": {"id": "child_good", "name": "Clover of Joy", "symbol": "🍀"},
            "excellent": {"id": "child_excellent", "name": "Golden Star Seedling", "symbol": "⭐"}
        }
    },
    "conductor": {
        "name": "Friendly Conductor",
        "multiplier": 2,
        "base_value": 100,
        "stamps": {
            "can_improve": {"id": "conductor_can_improve", "name": "Ticket to Knowledge", "symbol": "🎫"},
            "good": {"id": "conductor_good", "name": "Lantern of Clarity", "symbol": "🏮"},
            "excellent": {"id": "conductor_excellent", "name": "Winged Iron Locomotive", "symbol": "🚂"}
        }
    },
    "professor": {
        "name": "Strict Professor",
        "multiplier": 3,
        "base_value": 150,
        "stamps": {
            "can_improve": {"id": "professor_can_improve", "name": "Inkwell & Quill", "symbol": "✒️"},
            "good": {"id": "professor_good", "name": "Tome of Insight", "symbol": "📖"},
            "excellent": {"id": "professor_excellent", "name": "Academic Star Medallion", "symbol": "🏅"}
        }
    }
}

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "online",
        "gemini_configured": bool(GEMINI_API_KEY),
        "api_version": "1.0.0",
        "database": "sqlite_connected"
    })

@app.route("/api/evaluate", methods=["POST", "OPTIONS"])
def evaluate():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

    data = request.get_json() or {}
    topic = data.get("topic", "").strip()
    explanation = data.get("explanation", "").strip()
    evaluator_type = data.get("evaluator_type", "conductor").lower()
    reference_notes = data.get("reference_notes", "")
    force_demo = data.get("force_demo", False)

    if evaluator_type not in STAMP_RULES:
        evaluator_type = "conductor"

    if not explanation:
        return jsonify({
            "error": "Explanation cannot be empty. Please explain what you learned in your own words."
        }), 400

    if not topic:
        topic = "General Study Topic"

    # Strictness instructions based on evaluator character
    evaluator_prompts = {
        "child": (
            "You are a sweet, curious, friendly 5-year-old Capybara wearing a propeller beanie hat. "
            "You listen with wide-eyed wonder. You reward simple, intuitive understanding, analogies, "
            "and basic explanations. Do NOT penalize lack of heavy technical jargon. Speak in warm, "
            "gentle, encouraging, child-like words. However, if the explanation is factually untrue, "
            "gently ask about it."
        ),
        "conductor": (
            "You are a friendly, experienced train conductor dog wearing a classic navy conductor cap. "
            "You want to make sure your passenger truly understands where they are going and what they learned. "
            "You expect a balanced, clear explanation with essential concepts covered and sensible reasoning. "
            "Give encouraging yet clear railway-themed feedback with balanced praise and gentle pointers."
        ),
        "professor": (
            "You are a distinguished, rigorous Mandrill Professor of the Alpine Academy. "
            "You have high academic standards. You expect conceptual precision, logical structure, "
            "correct terminology, and cause-and-effect reasoning. You penalize hand-waving, misconceptions, "
            "or vague superficial statements. Provide analytical, highly structured, constructive feedback."
        )
    }

    evaluator_persona = evaluator_prompts.get(evaluator_type, evaluator_prompts["conductor"])

    system_prompt = f"""
{evaluator_persona}

Evaluate the student's explanation of the topic: "{topic}".
Topic Reference Notes (if provided): "{reference_notes}"
Student Explanation:
"{explanation}"

Respond with ONLY valid JSON (no markdown fences, no surrounding text) with the exact structure:
{{
  "score": <integer 0 to 100>,
  "summary_message": "<feedback message written strictly in your character's persona and voice>",
  "correct_concepts": ["<list of concepts the student explained well and correctly>"],
  "missing_concepts": ["<list of key concepts that were missed or omitted>"],
  "misconceptions": ["<list of factual mistakes or flawed reasoning, empty if none>"],
  "improvement_tips": ["<concrete actionable suggestions for how to improve understanding>"]
}}
"""

    gemini_result = None
    is_real_gemini = False

    if GEMINI_API_KEY and not force_demo:
        try:
            # Call Gemini REST API using httpx
            # Use gemini-2.5-flash or gemini-1.5-flash
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
            payload = {
                "contents": [
                    {
                        "parts": [{"text": system_prompt}]
                    }
                ],
                "generationConfig": {
                    "temperature": 0.4,
                    "responseMimeType": "application/json"
                }
            }
            with httpx.Client(timeout=25.0) as client:
                res = client.post(url, json=payload)
                if res.status_code == 200:
                    resp_json = res.json()
                    candidates = resp_json.get("candidates", [])
                    if candidates and "content" in candidates[0]:
                        parts = candidates[0]["content"].get("parts", [])
                        if parts:
                            raw_text = parts[0].get("text", "")
                            # Clean possible markdown wrap
                            raw_text = raw_text.strip()
                            if raw_text.startswith("```json"):
                                raw_text = raw_text[7:]
                            if raw_text.startswith("```"):
                                raw_text = raw_text[3:]
                            if raw_text.endswith("```"):
                                raw_text = raw_text[:-3]
                            gemini_result = json.loads(raw_text.strip())
                            is_real_gemini = True
        except Exception as e:
            print(f"Gemini API request failed: {e}")
            gemini_result = None

    # If Gemini API failed or is not configured, handle appropriately
    if not gemini_result:
        if not GEMINI_API_KEY and not force_demo:
            # Let the user know GEMINI_API_KEY is required for real evaluation, or they can switch to demo mode
            return jsonify({
                "error": "Gemini API key is not configured in backend/.env. To test without an API key, enable Demo Mode in settings or supply GEMINI_API_KEY in the backend environment.",
                "requires_api_key": True
            }), 503

        # Realistic rule-based simulation when in explicit Demo Mode or offline
        word_count = len(explanation.split())
        base_score = 50 + min(word_count * 2, 35)
        if evaluator_type == "professor":
            base_score = max(35, base_score - 10)
        elif evaluator_type == "child":
            base_score = min(95, base_score + 10)

        gemini_result = {
            "score": base_score,
            "summary_message": f"[{STAMP_RULES[evaluator_type]['name']} Demo Assessment]: Good effort explaining '{topic}'. For production AI insights, add GEMINI_API_KEY to backend/.env.",
            "correct_concepts": [f"Demonstrated fundamental understanding of {topic}"],
            "missing_concepts": ["Deeper sub-mechanisms and practical edge cases"],
            "misconceptions": [],
            "improvement_tips": ["Try incorporating specific examples or diagrams."]
        }
        is_real_gemini = False

    score = max(0, min(100, int(gemini_result.get("score", 50))))
    
    # Calculate stamp tier according to exact specification:
    # Below 40%: no stamp
    # 40% to below 70%: Can Improve
    # 70% to below 90%: Good
    # 90% to 100%: Excellent
    if score < 40:
        tier = None
        stamp_info = None
        is_stamp_awarded = False
        reward_value = 0
    elif score < 70:
        tier = "can_improve"
        stamp_info = STAMP_RULES[evaluator_type]["stamps"]["can_improve"]
        is_stamp_awarded = True
        reward_value = STAMP_RULES[evaluator_type]["base_value"]
    elif score < 90:
        tier = "good"
        stamp_info = STAMP_RULES[evaluator_type]["stamps"]["good"]
        is_stamp_awarded = True
        reward_value = STAMP_RULES[evaluator_type]["base_value"] * 2
    else:
        tier = "excellent"
        stamp_info = STAMP_RULES[evaluator_type]["stamps"]["excellent"]
        is_stamp_awarded = True
        reward_value = STAMP_RULES[evaluator_type]["base_value"] * 3

    stamp_id = stamp_info["id"] if stamp_info else None
    stamp_name = stamp_info["name"] if stamp_info else None

    response_payload = {
        "score": score,
        "tier": tier,
        "is_stamp_awarded": is_stamp_awarded,
        "stamp_id": stamp_id,
        "stamp_name": stamp_name,
        "evaluator_type": evaluator_type,
        "evaluator_name": STAMP_RULES[evaluator_type]["name"],
        "reward_value": reward_value,
        "summary_message": gemini_result.get("summary_message", ""),
        "correct_concepts": gemini_result.get("correct_concepts", []),
        "missing_concepts": gemini_result.get("missing_concepts", []),
        "misconceptions": gemini_result.get("misconceptions", []),
        "improvement_tips": gemini_result.get("improvement_tips", []),
        "is_real_gemini": is_real_gemini,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

    return jsonify(response_payload)

@app.route("/api/sessions", methods=["GET", "POST", "OPTIONS"])
def sessions():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

    conn = get_db()
    cursor = conn.cursor()

    if request.method == "POST":
        data = request.get_json() or {}
        session_id = data.get("id") or f"sess_{int(datetime.now().timestamp()*1000)}"
        topic = data.get("topic", "Untitled Focus Session")
        tag = data.get("tag", "Study")
        planned_duration = data.get("planned_duration", 25)
        actual_duration = data.get("actual_duration", 25)
        evaluator_type = data.get("evaluator_type", "conductor")
        score = data.get("score", 0)
        tier = data.get("tier")
        stamp_id = data.get("stamp_id")
        explanation = data.get("explanation", "")
        feedback_json = json.dumps(data.get("feedback", {}))
        completed_at = data.get("completed_at") or datetime.now(timezone.utc).isoformat()
        is_real_gemini = 1 if data.get("is_real_gemini") else 0

        # Save session
        cursor.execute("""
            INSERT OR REPLACE INTO sessions 
            (id, topic, tag, planned_duration, actual_duration, evaluator_type, score, tier, stamp_id, explanation, feedback_json, completed_at, is_real_gemini)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (session_id, topic, tag, planned_duration, actual_duration, evaluator_type, score, tier, stamp_id, explanation, feedback_json, completed_at, is_real_gemini))

        # Update stamp record if eligible
        if stamp_id:
            cursor.execute("SELECT count FROM stamps WHERE stamp_type = ?", (stamp_id,))
            row = cursor.fetchone()
            if row:
                cursor.execute("""
                    UPDATE stamps 
                    SET count = count + 1, last_earned_at = ?
                    WHERE stamp_type = ?
                """, (completed_at, stamp_id))
            else:
                cursor.execute("""
                    INSERT INTO stamps (id, stamp_type, count, first_earned_at, last_earned_at)
                    VALUES (?, ?, 1, ?, ?)
                """, (f"st_{stamp_id}", stamp_id, completed_at, completed_at))

        conn.commit()
        conn.close()
        return jsonify({"status": "saved", "id": session_id})

    # GET sessions
    cursor.execute("SELECT * FROM sessions ORDER BY completed_at DESC")
    rows = cursor.fetchall()
    sessions_list = []
    for r in rows:
        d = dict(r)
        if d.get("feedback_json"):
            try:
                d["feedback"] = json.loads(d["feedback_json"])
            except:
                d["feedback"] = {}
        sessions_list.append(d)

    conn.close()
    return jsonify(sessions_list)

@app.route("/api/journal", methods=["GET"])
def journal():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT stamp_type, count, first_earned_at, last_earned_at FROM stamps")
    stamps_data = {row["stamp_type"]: dict(row) for row in cursor.fetchall()}

    # Count Professor Excellent stamps for Coach 2 unlock
    prof_excellent_count = stamps_data.get("professor_excellent", {}).get("count", 0)
    
    # Coach 2 unlocks at 10 Professor - Excellent stamps
    coach_2_unlocked = prof_excellent_count >= 10
    
    # Coach 3 unlocks at 20 total Excellent stamps
    total_excellent = (
        stamps_data.get("professor_excellent", {}).get("count", 0) +
        stamps_data.get("conductor_excellent", {}).get("count", 0) +
        stamps_data.get("child_excellent", {}).get("count", 0)
    )
    coach_3_unlocked = total_excellent >= 20

    # Total distinct stamps collected (out of 9)
    distinct_collected = sum(1 for k in stamps_data if stamps_data[k].get("count", 0) > 0)
    all_collected = distinct_collected == 9

    conn.close()
    return jsonify({
        "stamps": stamps_data,
        "distinct_stamps_count": distinct_collected,
        "is_collection_complete": all_collected,
        "coach_unlocks": {
            1: True, # Default unlocked
            2: coach_2_unlocked,
            3: coach_3_unlocked
        },
        "prof_excellent_count": prof_excellent_count,
        "prof_excellent_required": 10,
        "total_excellent_count": total_excellent,
        "total_excellent_required": 20
    })

@app.route("/api/productivity/tasks", methods=["GET", "POST", "DELETE", "OPTIONS"])
def tasks():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200
    conn = get_db()
    cursor = conn.cursor()

    if request.method == "POST":
        data = request.get_json() or {}
        task_id = data.get("id") or f"task_{int(datetime.now().timestamp()*1000)}"
        title = data.get("title", "New Task")
        description = data.get("description", "")
        tag = data.get("tag", "General")
        duration = data.get("duration", 25)
        completed = 1 if data.get("completed") else 0
        due_date = data.get("due_date", "")
        created_at = data.get("created_at") or datetime.now(timezone.utc).isoformat()

        cursor.execute("""
            INSERT OR REPLACE INTO tasks (id, title, description, tag, duration, completed, due_date, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (task_id, title, description, tag, duration, completed, due_date, created_at))
        conn.commit()
        conn.close()
        return jsonify({"status": "saved", "id": task_id})

    if request.method == "DELETE":
        task_id = request.args.get("id")
        if task_id:
            cursor.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
            conn.commit()
        conn.close()
        return jsonify({"status": "deleted"})

    cursor.execute("SELECT * FROM tasks ORDER BY created_at DESC")
    tasks_list = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return jsonify(tasks_list)

@app.route("/api/productivity/habits", methods=["GET", "POST", "OPTIONS"])
def habits():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200
    conn = get_db()
    cursor = conn.cursor()

    if request.method == "POST":
        data = request.get_json() or {}
        habit_id = data.get("id") or f"habit_{int(datetime.now().timestamp()*1000)}"
        name = data.get("name", "New Habit")
        streak = data.get("streak", 0)
        history_json = json.dumps(data.get("history", []))
        created_at = datetime.now(timezone.utc).isoformat()

        cursor.execute("""
            INSERT OR REPLACE INTO habits (id, name, streak, history_json, created_at)
            VALUES (?, ?, ?, ?, ?)
        """, (habit_id, name, streak, history_json, created_at))
        conn.commit()
        conn.close()
        return jsonify({"status": "saved", "id": habit_id})

    cursor.execute("SELECT * FROM habits")
    habits_list = []
    for r in cursor.fetchall():
        d = dict(r)
        d["history"] = json.loads(d.get("history_json") or "[]")
        habits_list.append(d)
    conn.close()
    return jsonify(habits_list)

@app.route("/api/productivity/goals", methods=["GET", "POST", "OPTIONS"])
def goals():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200
    conn = get_db()
    cursor = conn.cursor()

    if request.method == "POST":
        data = request.get_json() or {}
        goal_id = data.get("id") or f"goal_{int(datetime.now().timestamp()*1000)}"
        title = data.get("title", "New Goal")
        target_hours = float(data.get("target_hours", 10.0))
        current_hours = float(data.get("current_hours", 0.0))
        category = data.get("category", "Study")
        created_at = datetime.now(timezone.utc).isoformat()

        cursor.execute("""
            INSERT OR REPLACE INTO goals (id, title, target_hours, current_hours, category, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (goal_id, title, target_hours, current_hours, category, created_at))
        conn.commit()
        conn.close()
        return jsonify({"status": "saved", "id": goal_id})

    cursor.execute("SELECT * FROM goals")
    goals_list = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return jsonify(goals_list)

@app.route("/api/productivity/decks", methods=["GET", "POST", "OPTIONS"])
def decks():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200
    conn = get_db()
    cursor = conn.cursor()

    if request.method == "POST":
        data = request.get_json() or {}
        deck_id = data.get("id") or f"deck_{int(datetime.now().timestamp()*1000)}"
        title = data.get("title", "New Study Deck")
        cards_json = json.dumps(data.get("cards", []))
        created_at = datetime.now(timezone.utc).isoformat()

        cursor.execute("""
            INSERT OR REPLACE INTO decks (id, title, cards_json, created_at)
            VALUES (?, ?, ?, ?)
        """, (deck_id, title, cards_json, created_at))
        conn.commit()
        conn.close()
        return jsonify({"status": "saved", "id": deck_id})

    cursor.execute("SELECT * FROM decks")
    decks_list = []
    for r in cursor.fetchall():
        d = dict(r)
        d["cards"] = json.loads(d.get("cards_json") or "[]")
        decks_list.append(d)
    conn.close()
    return jsonify(decks_list)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
