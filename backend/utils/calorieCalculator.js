/**
 * Mifflin-St Jeor equation + TDEE multiplier
 */

const ACTIVITY_MULTIPLIERS = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
};

function bmr(sex, weightKg, heightCm, age) {
    // Mifflin-St Jeor
    const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
    return sex === 'male' ? base + 5 : base - 161;
}

function tdee(sex, weightKg, heightCm, age, activityLevel) {
    return Math.round(bmr(sex, weightKg, heightCm, age) * (ACTIVITY_MULTIPLIERS[activityLevel] || 1.55));
}

function targetCalories(tdeeVal, goal, sex) {
    // Sex-specific calorie safety floors
    const minCal = sex === 'male' ? 1500 : 1200;
    switch (goal) {
        case 'lose_weight': return Math.max(minCal, Math.round(tdeeVal - 500));
        case 'build_muscle': return Math.round(tdeeVal + 350);
        case 'body_recomposition': return Math.round(tdeeVal);
        case 'improve_endurance': return Math.round(tdeeVal + 200);
        default: return tdeeVal;              // maintain
    }
}

function macros(calories, goal) {
    let proteinPct, carbsPct, fatPct;
    switch (goal) {
        case 'lose_weight': proteinPct = 0.40; carbsPct = 0.30; fatPct = 0.30; break;
        case 'build_muscle': proteinPct = 0.30; carbsPct = 0.50; fatPct = 0.20; break;
        case 'body_recomposition': proteinPct = 0.35; carbsPct = 0.35; fatPct = 0.30; break;
        case 'improve_endurance': proteinPct = 0.25; carbsPct = 0.50; fatPct = 0.25; break;
        default: proteinPct = 0.30; carbsPct = 0.40; fatPct = 0.30;
    }
    return {
        protein: Math.round((calories * proteinPct) / 4),
        carbs: Math.round((calories * carbsPct) / 4),
        fat: Math.round((calories * fatPct) / 9),
    };
}

function bmi(weightKg, heightCm) {
    const heightM = heightCm / 100;
    return +(weightKg / (heightM * heightM)).toFixed(1);
}

module.exports = { bmr, tdee, targetCalories, macros, bmi };
