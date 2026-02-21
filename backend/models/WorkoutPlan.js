const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
    name: String,
    sets: Number,
    reps: String,   // e.g. "8-12" or "30s"
    restSec: Number,
    notes: String,
}, { _id: false });

const daySchema = new mongoose.Schema({
    day: String,           // "Monday", "Tuesday" …
    focus: String,           // "Push", "Pull", "Legs", "Rest"…
    exercises: [exerciseSchema],
}, { _id: false });

const workoutPlanSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    goal: String,
    experience: String,
    days: [daySchema],
    weekNumber: { type: Number, default: 1 },
}, { timestamps: true });

module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema);
