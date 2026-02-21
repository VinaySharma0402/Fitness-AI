const mongoose = require('mongoose');

const energyLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fatigueLevel: { type: Number, min: 1, max: 10, required: true },  // 1=fresh, 10=exhausted
    sleepHours: Number,
    stressLevel: { type: Number, min: 1, max: 10 },
    notes: String,
}, { timestamps: true });

module.exports = mongoose.model('EnergyLog', energyLogSchema);
