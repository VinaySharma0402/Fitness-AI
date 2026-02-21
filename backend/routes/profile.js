const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// GET /api/profile
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// PUT /api/profile
router.put('/', auth, async (req, res) => {
    try {
        const fields = ['name', 'age', 'sex', 'heightCm', 'weightKg', 'goal', 'activityLevel', 'experience', 'targetWeightKg'];
        const update = {};
        fields.forEach(f => { if (req.body[f] !== undefined) update[f] = req.body[f]; });
        update.profileComplete = true;

        const user = await User.findByIdAndUpdate(req.user.id, update, { new: true }).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
