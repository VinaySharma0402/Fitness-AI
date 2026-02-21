const router = require('express').Router();
const auth = require('../middleware/auth');
const ProgressLog = require('../models/ProgressLog');
const EnergyLog = require('../models/EnergyLog');
const User = require('../models/User');
const habit = require('../utils/habitEngine');
const forecast = require('../utils/goalForecast');

// POST /api/progress/log
router.post('/log', auth, async (req, res) => {
    try {
        const { weekNumber, weightKg, workoutAdherence, dietAdherence, notes } = req.body;
        const log = await ProgressLog.create({
            userId: req.user.id,
            weekNumber: weekNumber || 1,
            weightKg,
            workoutAdherence,
            dietAdherence,
            notes,
        });

        // update user weight
        if (weightKg) await User.findByIdAndUpdate(req.user.id, { weightKg });

        res.status(201).json(log);
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// GET /api/progress/history
router.get('/history', auth, async (req, res) => {
    try {
        const logs = await ProgressLog.find({ userId: req.user.id }).sort({ createdAt: 1 });
        res.json(logs);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// GET /api/progress/habit
router.get('/habit', auth, async (req, res) => {
    try {
        const logs = await ProgressLog.find({ userId: req.user.id }).sort({ createdAt: 1 });
        const analysis = habit.analyseStreak(logs);
        const latestLog = logs.length > 0 ? logs[logs.length - 1] : null;
        const currentScore = latestLog ? habit.calculateScore(latestLog.workoutAdherence, latestLog.dietAdherence) : 0;
        res.json({ currentScore, ...analysis });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// GET /api/progress/forecast
router.get('/forecast', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const logs = await ProgressLog.find({ userId: req.user.id }).sort({ createdAt: 1 });
        const result = forecast.estimate(user.weightKg, user.targetWeightKg || user.weightKg, logs);
        res.json(result);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// POST /api/progress/energy
router.post('/energy', auth, async (req, res) => {
    try {
        const { fatigueLevel, sleepHours, stressLevel, notes } = req.body;
        const log = await EnergyLog.create({ userId: req.user.id, fatigueLevel, sleepHours, stressLevel, notes });
        res.status(201).json(log);
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// GET /api/progress/energy
router.get('/energy', auth, async (req, res) => {
    try {
        const logs = await EnergyLog.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(30);
        res.json(logs);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// GET /api/progress/energy-adjustment
router.get('/energy-adjustment', auth, async (req, res) => {
    try {
        const logs = await EnergyLog.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(7);
        if (logs.length === 0) {
            return res.json({ adjustment: 'none', message: 'No energy data yet. Log your energy to get smart workout adjustments.' });
        }

        const avgFatigue = logs.reduce((s, l) => s + l.fatigueLevel, 0) / logs.length;
        const avgSleep = logs.reduce((s, l) => s + l.sleepHours, 0) / logs.length;
        const highFatigueDays = logs.filter(l => l.fatigueLevel >= 7).length;

        // 3 high-fatigue days in 7 → force recovery
        if (highFatigueDays >= 3) {
            return res.json({
                adjustment: 'recovery',
                message: `⚠️ You've had ${highFatigueDays} high-fatigue days this week. Take a recovery day — try light walking or yoga instead of your scheduled workout.`,
                avgFatigue: +avgFatigue.toFixed(1),
                avgSleep: +avgSleep.toFixed(1),
                highFatigueDays,
            });
        }

        // Avg fatigue ≥ 7 → reduce intensity
        if (avgFatigue >= 7) {
            return res.json({
                adjustment: 'reduce',
                message: `📉 Your average fatigue is ${avgFatigue.toFixed(1)}/10. Consider reducing workout intensity by 10-20% or swapping a strength day for active recovery.`,
                avgFatigue: +avgFatigue.toFixed(1),
                avgSleep: +avgSleep.toFixed(1),
                highFatigueDays,
            });
        }

        // Low sleep → warning
        if (avgSleep < 6) {
            return res.json({
                adjustment: 'sleep_warning',
                message: `😴 You're averaging only ${avgSleep.toFixed(1)} hours of sleep. Prioritize rest — consider lighter workouts until sleep improves.`,
                avgFatigue: +avgFatigue.toFixed(1),
                avgSleep: +avgSleep.toFixed(1),
                highFatigueDays,
            });
        }

        // All good
        return res.json({
            adjustment: 'none',
            message: `✅ Energy levels look good! Fatigue: ${avgFatigue.toFixed(1)}/10, Sleep: ${avgSleep.toFixed(1)}h. You're cleared for full intensity.`,
            avgFatigue: +avgFatigue.toFixed(1),
            avgSleep: +avgSleep.toFixed(1),
            highFatigueDays,
        });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
