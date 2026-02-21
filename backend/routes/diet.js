const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const DietPlan = require('../models/DietPlan');
const { tdee, targetCalories, macros } = require('../utils/calorieCalculator');
const dietGen = require('../utils/dietGenerator');

// POST /api/diet/generate
router.post('/generate', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || !user.profileComplete) return res.status(400).json({ msg: 'Complete your profile first' });

        const userTdee = tdee(user.sex, user.weightKg, user.heightCm, user.age, user.activityLevel);
        const dailyCals = targetCalories(userTdee, user.goal, user.sex);
        const macroTargets = macros(dailyCals, user.goal);
        const meals = dietGen.generate(dailyCals, macroTargets);

        const plan = await DietPlan.create({
            userId: user._id,
            dailyCalories: dailyCals,
            ...macroTargets,
            meals,
        });
        res.status(201).json(plan);
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// GET /api/diet/current
router.get('/current', auth, async (req, res) => {
    try {
        const plan = await DietPlan.findOne({ userId: req.user.id }).sort({ createdAt: -1 });
        if (!plan) return res.status(404).json({ msg: 'No diet plan found. Generate one first.' });
        res.json(plan);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
