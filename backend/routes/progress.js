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

// ─── #16: Smart Plan Adjustment ───
const smartAdj = require('../utils/smartAdjustment');

router.get('/adjustment', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        const logs = await ProgressLog.find({ userId: req.user.id }).sort({ createdAt: 1 });
        const result = smartAdj.analyze(logs, user);
        res.json(result);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// ─── #18: Extended Analytics ───
const BodyMeasurement = require('../models/BodyMeasurement');

router.get('/analytics', auth, async (req, res) => {
    try {
        const logs = await ProgressLog.find({ userId: req.user.id }).sort({ createdAt: 1 });
        const energyLogs = await EnergyLog.find({ userId: req.user.id }).sort({ createdAt: 1 });
        const measurements = await BodyMeasurement.find({ userId: req.user.id }).sort({ createdAt: 1 });

        // Multi-week habit trends
        const habitTrends = logs.map(l => ({
            week: l.weekNumber,
            workout: l.workoutAdherence,
            diet: l.dietAdherence,
            score: Math.round((l.workoutAdherence + l.dietAdherence) / 2),
        }));

        // Progress velocity (weight change rate per week)
        const velocityData = [];
        const weights = logs.filter(l => l.weightKg);
        for (let i = 1; i < weights.length; i++) {
            velocityData.push({
                week: weights[i].weekNumber,
                change: +(weights[i].weightKg - weights[i - 1].weightKg).toFixed(2),
            });
        }

        // Workout volume progression (adherence trend as proxy)
        const volumeTrend = logs.map(l => ({
            week: l.weekNumber,
            adherence: l.workoutAdherence,
        }));

        // Energy trends
        const energyTrend = energyLogs.map(l => ({
            date: l.createdAt,
            fatigue: l.fatigueLevel,
            sleep: l.sleepHours,
            stress: l.stressLevel,
        }));

        // Measurement trends
        const measureTrend = measurements.map(m => ({
            date: m.createdAt,
            waist: m.waistCm,
            chest: m.chestCm,
            hips: m.hipsCm,
            arms: m.armsCm,
            thighs: m.thighsCm,
        }));

        res.json({ habitTrends, velocityData, volumeTrend, energyTrend, measureTrend });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// ─── #19: Multi-Week Roadmap ───
const roadmap = require('../utils/roadmapEngine');

router.get('/roadmap', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        const logs = await ProgressLog.find({ userId: req.user.id }).sort({ createdAt: 1 });
        const result = roadmap.project(user, logs);
        res.json(result);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// ─── #20: Monthly Report ───
router.get('/report', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        const logs = await ProgressLog.find({ userId: req.user.id }).sort({ createdAt: 1 });
        const measurements = await BodyMeasurement.find({ userId: req.user.id }).sort({ createdAt: 1 });

        // Last 30 days of logs (approx 4 weeks)
        const recent = logs.slice(-4);
        const allWeights = logs.filter(l => l.weightKg).map(l => l.weightKg);

        // Weight change
        const weightStart = allWeights.length > 0 ? allWeights[0] : null;
        const weightCurrent = allWeights.length > 0 ? allWeights[allWeights.length - 1] : null;
        const totalWeightChange = weightStart && weightCurrent ? +(weightCurrent - weightStart).toFixed(1) : null;

        // Recent weight change (last 4 weeks)
        const recentWeights = logs.slice(-4).filter(l => l.weightKg).map(l => l.weightKg);
        const monthlyWeightChange = recentWeights.length >= 2
            ? +(recentWeights[recentWeights.length - 1] - recentWeights[0]).toFixed(1)
            : null;

        // Measurement change
        let measurementChange = null;
        if (measurements.length >= 2) {
            const first = measurements[0];
            const latest = measurements[measurements.length - 1];
            measurementChange = {
                waist: +(latest.waistCm - first.waistCm).toFixed(1),
                chest: +(latest.chestCm - first.chestCm).toFixed(1),
                hips: +(latest.hipsCm - first.hipsCm).toFixed(1),
                arms: +(latest.armsCm - first.armsCm).toFixed(1),
                thighs: +(latest.thighsCm - first.thighsCm).toFixed(1),
            };
        }

        // Averages
        const avgWorkout = recent.length > 0
            ? Math.round(recent.reduce((s, l) => s + (l.workoutAdherence || 0), 0) / recent.length)
            : 0;
        const avgDiet = recent.length > 0
            ? Math.round(recent.reduce((s, l) => s + (l.dietAdherence || 0), 0) / recent.length)
            : 0;
        const habitAvg = Math.round((avgWorkout + avgDiet) / 2);

        // Goal progress %
        const targetWeight = user.targetWeightKg;
        let goalProgress = null;
        if (targetWeight && weightStart && weightCurrent) {
            const totalNeeded = Math.abs(targetWeight - weightStart);
            const achieved = Math.abs(weightCurrent - weightStart);
            goalProgress = totalNeeded > 0 ? Math.min(100, Math.round((achieved / totalNeeded) * 100)) : 100;
        }

        res.json({
            period: `${recent.length} weeks analyzed`,
            weightStart,
            weightCurrent,
            totalWeightChange,
            monthlyWeightChange,
            measurementChange,
            avgWorkoutAdherence: avgWorkout,
            avgDietAdherence: avgDiet,
            habitScoreAvg: habitAvg,
            goalProgress,
            totalWeeksLogged: logs.length,
            grade: habitAvg >= 80 ? 'A' : habitAvg >= 60 ? 'B' : habitAvg >= 40 ? 'C' : 'D',
        });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
