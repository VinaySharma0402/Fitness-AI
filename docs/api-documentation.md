# FitAI — API Documentation

## Base URL
```
http://localhost:5000/api
```

All protected endpoints require an `Authorization: Bearer <token>` header.

---

## Authentication

### POST `/auth/register`
**Body:** `{ "email": "user@example.com", "password": "password123" }`
**Response:** `{ "token": "jwt...", "user": { "id", "email", "profileComplete" } }`

### POST `/auth/login`
**Body:** `{ "email": "user@example.com", "password": "password123" }`
**Response:** `{ "token": "jwt...", "user": { "id", "email", "profileComplete" } }`

---

## Profile (Protected)

### GET `/profile`
Returns the full user profile (excludes password).

### PUT `/profile`
**Body:**
```json
{
  "name": "John Doe",
  "age": 25,
  "sex": "male",
  "heightCm": 175,
  "weightKg": 75,
  "goal": "lose_weight",
  "activityLevel": "moderate",
  "experience": "intermediate",
  "targetWeightKg": 70
}
```

---

## Workout (Protected)

### POST `/workout/generate`
Generates a new 7-day workout plan based on user profile. Returns the full plan with exercises.

### GET `/workout/current`
Returns the most recently generated workout plan.

### GET `/workout/overload`
Returns progressive overload suggestion based on recent adherence.

---

## Diet (Protected)

### POST `/diet/generate`
Generates a meal plan with 4 meals based on calculated TDEE and macros.

### GET `/diet/current`
Returns the most recently generated diet plan.

---

## Progress (Protected)

### POST `/progress/log`
**Body:** `{ "weekNumber": 1, "weightKg": 74.5, "workoutAdherence": 80, "dietAdherence": 75, "notes": "" }`

### GET `/progress/history`
Returns all progress logs sorted chronologically.

### GET `/progress/habit`
Returns habit analysis: `{ "currentScore", "streak", "trend", "alert" }`

### GET `/progress/forecast`
Returns goal timeline: `{ "weeksRemaining", "avgWeeklyChange", "estimatedDate", "message" }`

### POST `/progress/energy`
**Body:** `{ "fatigueLevel": 5, "sleepHours": 7, "stressLevel": 4, "notes": "" }`

### GET `/progress/energy`
Returns last 30 energy logs.

---

## Measurements (Protected)

### POST `/measurements/log`
**Body:** `{ "waistCm": 82, "chestCm": 95, "hipsCm": 90, "armsCm": 33, "thighsCm": 55 }`

### GET `/measurements/history`
Returns all measurement entries chronologically.

---

## Chat (Protected)

### POST `/chat/ask`
**Body:** `{ "message": "Why am I not losing weight?" }`
**Response:** `{ "response": "Plateaus are normal! ..." }`
