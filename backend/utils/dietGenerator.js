/**
 * Generates a daily meal plan given calorie and macro targets.
 * Includes meal swap engine (#21 Premium Coaching).
 */

const MEAL_DB = {
    breakfast: [
        { id: 'b1', foods: ['Oatmeal with banana & almonds', 'Scrambled eggs (2)'], per100: { cal: 350, p: 20, c: 45, f: 12 } },
        { id: 'b2', foods: ['Greek yogurt parfait with berries & granola'], per100: { cal: 310, p: 22, c: 40, f: 10 } },
        { id: 'b3', foods: ['Whole-wheat toast with avocado & eggs'], per100: { cal: 400, p: 18, c: 35, f: 22 } },
        { id: 'b4', foods: ['Protein smoothie (whey, banana, PB, milk)'], per100: { cal: 380, p: 30, c: 42, f: 12 } },
        { id: 'b5', foods: ['Egg white omelette with spinach & cheese'], per100: { cal: 280, p: 28, c: 12, f: 14 } },
        { id: 'b6', foods: ['Chia pudding with almond milk & berries'], per100: { cal: 290, p: 12, c: 38, f: 14 } },
    ],
    lunch: [
        { id: 'l1', foods: ['Grilled chicken breast', 'Brown rice', 'Steamed broccoli'], per100: { cal: 480, p: 40, c: 50, f: 10 } },
        { id: 'l2', foods: ['Turkey & veggie wrap with hummus'], per100: { cal: 420, p: 32, c: 45, f: 14 } },
        { id: 'l3', foods: ['Salmon salad with quinoa & mixed greens'], per100: { cal: 500, p: 35, c: 38, f: 20 } },
        { id: 'l4', foods: ['Lentil soup with whole-grain bread'], per100: { cal: 440, p: 24, c: 58, f: 10 } },
        { id: 'l5', foods: ['Tuna poke bowl with edamame & rice'], per100: { cal: 470, p: 38, c: 44, f: 14 } },
        { id: 'l6', foods: ['Chicken Caesar salad with croutons'], per100: { cal: 430, p: 34, c: 30, f: 20 } },
    ],
    snack: [
        { id: 's1', foods: ['Apple slices with almond butter'], per100: { cal: 200, p: 6, c: 22, f: 12 } },
        { id: 's2', foods: ['Protein bar'], per100: { cal: 220, p: 20, c: 24, f: 8 } },
        { id: 's3', foods: ['Trail mix (nuts, seeds, dried fruit)'], per100: { cal: 250, p: 8, c: 28, f: 14 } },
        { id: 's4', foods: ['Cottage cheese with pineapple'], per100: { cal: 180, p: 18, c: 16, f: 5 } },
        { id: 's5', foods: ['Rice cakes with PB & honey'], per100: { cal: 210, p: 6, c: 32, f: 8 } },
        { id: 's6', foods: ['Greek yogurt with honey & walnuts'], per100: { cal: 230, p: 16, c: 24, f: 10 } },
    ],
    dinner: [
        { id: 'd1', foods: ['Lean beef stir-fry with vegetables & rice'], per100: { cal: 520, p: 38, c: 48, f: 16 } },
        { id: 'd2', foods: ['Baked chicken thighs', 'Sweet potato', 'Green beans'], per100: { cal: 500, p: 36, c: 44, f: 18 } },
        { id: 'd3', foods: ['Grilled fish tacos with slaw'], per100: { cal: 460, p: 32, c: 40, f: 18 } },
        { id: 'd4', foods: ['Tofu & vegetable curry with jasmine rice'], per100: { cal: 480, p: 22, c: 56, f: 16 } },
        { id: 'd5', foods: ['Grilled shrimp with asparagus & quinoa'], per100: { cal: 440, p: 36, c: 42, f: 12 } },
        { id: 'd6', foods: ['Turkey meatballs with marinara & pasta'], per100: { cal: 510, p: 34, c: 52, f: 16 } },
    ],
};

function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function scaleMeal(template, targetCal) {
    const ratio = targetCal / template.per100.cal;
    return {
        id: template.id,
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

/**
 * Meal Swap Engine (#21)
 * Given a meal slot and the current meal ID, return alternative options
 * from the same meal category, excluding the current one.
 */
function getSwapOptions(mealSlot, currentMealId, dailyCalories) {
    const slot = mealSlot.toLowerCase();
    const options = MEAL_DB[slot];
    if (!options) return [];

    const split = { breakfast: 0.25, lunch: 0.30, snack: 0.15, dinner: 0.30 };
    const targetCal = Math.round(dailyCalories * (split[slot] || 0.25));

    return options
        .filter(opt => opt.id !== currentMealId)
        .map(opt => scaleMeal(opt, targetCal));
}

module.exports = { generate, getSwapOptions, MEAL_DB };
