const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const WorkoutPlan = require('../models/WorkoutPlan');
const ProgressLog = require('../models/ProgressLog');
const workoutGen = require('../utils/workoutGenerator');
const overload = require('../utils/progressiveOverload');

// POST /api/workout/generate
router.post('/generate', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || !user.profileComplete) return res.status(400).json({ msg: 'Complete your profile first' });

        const days = workoutGen.generate(user.goal, user.experience);
        const plan = await WorkoutPlan.create({
            userId: user._id,
            goal: user.goal,
            experience: user.experience,
            days,
        });
        res.status(201).json(plan);
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// GET /api/workout/current
router.get('/current', auth, async (req, res) => {
    try {
        const plan = await WorkoutPlan.findOne({ userId: req.user.id }).sort({ createdAt: -1 });
        if (!plan) return res.status(404).json({ msg: 'No workout plan found. Generate one first.' });
        res.json(plan);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// GET /api/workout/overload
router.get('/overload', auth, async (req, res) => {
    try {
        const plan = await WorkoutPlan.findOne({ userId: req.user.id }).sort({ createdAt: -1 });
        const logs = await ProgressLog.find({ userId: req.user.id }).sort({ createdAt: 1 });
        const user = await User.findById(req.user.id);
        const suggestion = overload.suggest(plan, logs, user?.goal);
        res.json(suggestion);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
