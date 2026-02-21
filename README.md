# FitAI — Adaptive Fitness Intelligence Platform

> An AI-powered fitness platform that creates personalized workout and nutrition plans, tracks progress with intelligent analytics, and adapts recommendations based on your habits and body data.

## 🏆 Team

- **Team Name**: Silver Kuiper
- **Project**: FitAI — Adaptive Fitness Intelligence Platform

## 🎯 Problem Statement

Most fitness apps offer static, one-size-fits-all workout and diet plans. They fail to adapt when users hit plateaus, lose motivation, or have changing energy levels. FitAI solves this by building an **adaptive loop** — the platform continuously analyzes your progress, habit scores, energy levels, and body measurements to provide personalized, evolving recommendations.

## 💡 Key Features

1. **Smart Workout Generator** — 7-day workout plans tailored to your goal (weight loss, muscle building, endurance) and experience level
2. **Adaptive Diet Planner** — Meal plans with calorie and macro targets using Mifflin-St Jeor equation
3. **Progress Tracking** — Weekly weight and adherence logging with interactive Chart.js visualizations
4. **Body Measurements** — Track waist, chest, hips, arms, and thighs over time with trend charts
5. **Habit Intelligence** — Habit score (60% workout + 40% diet adherence), streak tracking, and drop-off detection
6. **Energy & Recovery Tracking** — Daily fatigue, sleep, and stress check-ins
7. **Progressive Overload Engine** — Intelligent suggestions to increase, maintain, or decrease training volume
8. **Goal Timeline Forecast** — Estimates when you'll reach your target weight based on current trends
9. **AI Fitness Coach** — Rule-based chat assistant covering 12+ fitness topics (nutrition, recovery, supplements, motivation)
10. **Secure Authentication** — JWT-based auth with bcrypt password hashing

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Vanilla CSS (dark theme, glassmorphism) |
| Charts | Chart.js via react-chartjs-2 |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | bcrypt + JWT |

## 📁 Folder Structure

```
FitAI/
├── backend/
│   ├── config/          # Database connection
│   ├── middleware/       # JWT auth middleware
│   ├── models/          # Mongoose schemas (6 models)
│   ├── routes/          # Express routes (7 route files)
│   ├── utils/           # Core engines (7 utility modules)
│   ├── server.js        # Entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/         # Axios instance
│   │   ├── components/  # AppShell layout
│   │   ├── pages/       # 10 page components
│   │   ├── App.jsx      # Router
│   │   ├── main.jsx     # Entry point
│   │   └── index.css    # Design system
│   └── package.json
├── docs/
│   └── api-documentation.md
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- MongoDB running locally on port 27017

### Backend
```bash
cd backend
npm install
npm start          # Starts on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev        # Starts on http://localhost:5173
```

### Environment Variables (backend/.env)
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/fitai
JWT_SECRET=your_secret_key
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/profile` | Get user profile |
| PUT | `/api/profile` | Update profile |
| POST | `/api/workout/generate` | Generate workout plan |
| GET | `/api/workout/current` | Get current workout |
| GET | `/api/workout/overload` | Get overload suggestion |
| POST | `/api/diet/generate` | Generate diet plan |
| GET | `/api/diet/current` | Get current diet |
| POST | `/api/progress/log` | Log weekly progress |
| GET | `/api/progress/history` | Get progress history |
| GET | `/api/progress/habit` | Get habit analysis |
| GET | `/api/progress/forecast` | Get goal forecast |
| POST | `/api/progress/energy` | Log energy check-in |
| GET | `/api/progress/energy` | Get energy history |
| POST | `/api/measurements/log` | Log body measurements |
| GET | `/api/measurements/history` | Get measurement history |
| POST | `/api/chat/ask` | Ask AI coach a question |

## 🧮 Key Algorithms

### Mifflin-St Jeor (Calorie Calculation)
```
Men:   BMR = 10×weight(kg) + 6.25×height(cm) − 5×age + 5
Women: BMR = 10×weight(kg) + 6.25×height(cm) − 5×age − 161
TDEE = BMR × Activity Multiplier
```

### Habit Score
```
Score = (Workout Adherence% × 0.60) + (Diet Adherence% × 0.40)
```

### Goal Forecast
```
Weeks Remaining = |Target Weight − Current Weight| ÷ |Avg Weekly Change|
```

## 🔮 Future Improvements

- Integration with real AI/LLM APIs for smarter coaching
- Wearable device sync (Apple Health, Google Fit)
- Social features and community challenges
- Exercise video demonstrations
- Barcode scanning for food logging
- Push notification reminders
- Export progress reports as PDF

## 📄 License

Built for hackathon demonstration purposes.
