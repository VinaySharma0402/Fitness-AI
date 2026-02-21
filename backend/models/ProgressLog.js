const mongoose = require('mongoose');

const progressLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    weekNumber: { type: Number, required: true },
    weightKg: Number,
    workoutAdherence: { type: Number, min: 0, max: 100 },   // percentage
    dietAdherence: { type: Number, min: 0, max: 100 },
    notes: String,
}, { timestamps: true });

module.exports = mongoose.model('ProgressLog', progressLogSchema);
