const mongoose = require('mongoose');

const bodyMeasurementSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    waistCm: Number,
    chestCm: Number,
    hipsCm: Number,
    armsCm: Number,
    thighsCm: Number,
}, { timestamps: true });

module.exports = mongoose.model('BodyMeasurement', bodyMeasurementSchema);
