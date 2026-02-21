const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },

    // Profile fields — filled after first login
    name: { type: String, default: '' },
    age: { type: Number },
    sex: { type: String, enum: ['male', 'female'] },
    heightCm: { type: Number },
    weightKg: { type: Number },
    goal: { type: String, enum: ['lose_weight', 'build_muscle', 'maintain', 'improve_endurance'] },
    activityLevel: { type: String, enum: ['sedentary', 'light', 'moderate', 'active', 'very_active'] },
    experience: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
    targetWeightKg: { type: Number },
    profileComplete: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
