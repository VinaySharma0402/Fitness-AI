const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
    name: String,           // "Breakfast", "Lunch"…
    foods: [String],
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
}, { _id: false });

const dietPlanSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    dailyCalories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    meals: [mealSchema],
}, { timestamps: true });

module.exports = mongoose.model('DietPlan', dietPlanSchema);
