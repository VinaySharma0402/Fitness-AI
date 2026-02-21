const router = require('express').Router();
const auth = require('../middleware/auth');
const BodyMeasurement = require('../models/BodyMeasurement');

// POST /api/measurements/log
router.post('/log', auth, async (req, res) => {
    try {
        const { waistCm, chestCm, hipsCm, armsCm, thighsCm } = req.body;
        const entry = await BodyMeasurement.create({
            userId: req.user.id,
            waistCm, chestCm, hipsCm, armsCm, thighsCm,
        });
        res.status(201).json(entry);
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// GET /api/measurements/history
router.get('/history', auth, async (req, res) => {
    try {
        const entries = await BodyMeasurement.find({ userId: req.user.id }).sort({ createdAt: 1 });
        res.json(entries);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
