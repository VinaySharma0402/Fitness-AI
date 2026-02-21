/**
 * Generates a daily meal plan given calorie and macro targets.
 */

const MEAL_DB = {
    breakfast: [
        { foods: ['Oatmeal with banana & almonds', 'Scrambled eggs (2)'], per100: { cal: 350, p: 20, c: 45, f: 12 } },
        { foods: ['Greek yogurt parfait with berries & granola'], per100: { cal: 310, p: 22, c: 40, f: 10 } },
        { foods: ['Whole-wheat toast with avocado & eggs'], per100: { cal: 400, p: 18, c: 35, f: 22 } },
        { foods: ['Protein smoothie (whey, banana, PB, milk)'], per100: { cal: 380, p: 30, c: 42, f: 12 } },
    ],
    lunch: [
        { foods: ['Grilled chicken breast', 'Brown rice', 'Steamed broccoli'], per100: { cal: 480, p: 40, c: 50, f: 10 } },
        { foods: ['Turkey & veggie wrap with hummus'], per100: { cal: 420, p: 32, c: 45, f: 14 } },
        { foods: ['Salmon salad with quinoa & mixed greens'], per100: { cal: 500, p: 35, c: 38, f: 20 } },
        { foods: ['Lentil soup with whole-grain bread'], per100: { cal: 440, p: 24, c: 58, f: 10 } },
    ],
    snack: [
        { foods: ['Apple slices with almond butter'], per100: { cal: 200, p: 6, c: 22, f: 12 } },
        { foods: ['Protein bar'], per100: { cal: 220, p: 20, c: 24, f: 8 } },
        { foods: ['Trail mix (nuts, seeds, dried fruit)'], per100: { cal: 250, p: 8, c: 28, f: 14 } },
        { foods: ['Cottage cheese with pineapple'], per100: { cal: 180, p: 18, c: 16, f: 5 } },
    ],
    dinner: [
        { foods: ['Lean beef stir-fry with vegetables & rice'], per100: { cal: 520, p: 38, c: 48, f: 16 } },
        { foods: ['Baked chicken thighs', 'Sweet potato', 'Green beans'], per100: { cal: 500, p: 36, c: 44, f: 18 } },
        { foods: ['Grilled fish tacos with slaw'], per100: { cal: 460, p: 32, c: 40, f: 18 } },
        { foods: ['Tofu & vegetable curry with jasmine rice'], per100: { cal: 480, p: 22, c: 56, f: 16 } },
    ],
};

function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function scaleMeal(template, targetCal) {
    const ratio = targetCal / template.per100.cal;
    return {
        foods: template.foods,
        calories: Math.round(template.per100.cal * ratio),
        protein: Math.round(template.per100.p * ratio),
        carbs: Math.round(template.per100.c * ratio),
        fat: Math.round(template.per100.f * ratio),
    };
}

function generate(dailyCalories, macroTargets) {
    const split = { breakfast: 0.25, lunch: 0.30, snack: 0.15, dinner: 0.30 };
    const meals = Object.entries(split).map(([name, pct]) => {
        const target = Math.round(dailyCalories * pct);
        const template = pick(MEAL_DB[name]);
        const scaled = scaleMeal(template, target);
        return { name: name.charAt(0).toUpperCase() + name.slice(1), ...scaled };
    });
    return meals;
}

module.exports = { generate };
