const router = require('express').Router();
const auth = require('../middleware/auth');
const aiChat = require('../utils/aiChat');
const User = require('../models/User');
const ProgressLog = require('../models/ProgressLog');
const DietPlan = require('../models/DietPlan');
const EnergyLog = require('../models/EnergyLog');
const habit = require('../utils/habitEngine');

// POST /api/chat/ask
router.post('/ask', auth, async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ msg: 'Message required' });

        // Fetch user context data for personalized responses
        const user = await User.findById(req.user.id).select('-password');
        const progressLogs = await ProgressLog.find({ userId: req.user.id }).sort({ createdAt: 1 });
        const dietPlan = await DietPlan.findOne({ userId: req.user.id }).sort({ createdAt: -1 });
        const energyLogs = await EnergyLog.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(7);

        // Build context object
        const context = {
            name: user?.name || 'Athlete',
            goal: user?.goal || null,
            weightKg: user?.weightKg || null,
            targetWeightKg: user?.targetWeightKg || null,
            dailyCalories: dietPlan?.dailyCalories || null,
            protein: dietPlan?.protein || null,
            habitScore: null,
            streak: 0,
            trend: 'none',
            avgFatigue: null,
            weightChange: null,
        };

        // Calculate habit data
        if (progressLogs.length > 0) {
            const analysis = habit.analyseStreak(progressLogs);
            const latestLog = progressLogs[progressLogs.length - 1];
            context.habitScore = habit.calculateScore(latestLog.workoutAdherence, latestLog.dietAdherence);
            context.streak = analysis.streak;
            context.trend = analysis.trend;
        }

        // Calculate weight change
        if (progressLogs.length >= 2) {
            const first = progressLogs[0].weightKg;
            const latest = progressLogs[progressLogs.length - 1].weightKg;
            context.weightChange = +(latest - first).toFixed(1);
        }

        // Calculate average fatigue
        if (energyLogs.length > 0) {
            context.avgFatigue = +(energyLogs.reduce((s, l) => s + l.fatigueLevel, 0) / energyLogs.length).toFixed(1);
        }

        const response = aiChat.getResponse(message, context);
        res.json({ response });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
