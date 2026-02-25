/**
 * Rule-based AI fitness chat assistant with data-aware personalized responses.
 */

const RULES = [
    {
        keywords: ['not losing weight', 'plateau', 'stuck', 'stalled', 'no progress', 'stop losing', 'weight stuck', 'not working'],
        response: (ctx) => {
            let msg = "Plateaus are normal! Here's what to try:\n";
            if (ctx.weightChange !== null) {
                msg += `📊 Your data shows a weight change of ${ctx.weightChange > 0 ? '+' : ''}${ctx.weightChange} kg since you started tracking.\n`;
            }
            if (ctx.dailyCalories) {
                msg += `🔢 Your current target is ${ctx.dailyCalories} kcal/day. Consider reducing by 100-150 kcal if progress has stalled.\n`;
            }
            if (ctx.habitScore !== null && ctx.habitScore < 70) {
                msg += `⚠️ Your habit score is ${ctx.habitScore}% — improving consistency will help more than cutting calories further.\n`;
            }
            msg += "1. Re-check your calorie intake — are you tracking accurately?\n2. Increase NEAT (walk more throughout the day).\n3. Add one extra HIIT session per week.\n4. Make sure you're sleeping 7-9 hours.";
            return msg;
        }
    },

    {
        keywords: ['sore', 'muscle pain', 'doms', 'recovery', 'recover', 'rest day', 'injury', 'hurt', 'ache', 'aching'],
        response: (ctx) => {
            let msg = "Muscle soreness (DOMS) is normal, especially after increasing intensity.\n";
            if (ctx.avgFatigue !== null && ctx.avgFatigue >= 7) {
                msg += `⚠️ Your average fatigue is ${ctx.avgFatigue}/10 — you may be overtraining. Consider an extra rest day this week.\n`;
            }
            msg += "• Light stretching and foam rolling help.\n• Stay hydrated and eat enough protein.\n• If soreness lasts longer than 72 hours, consider reducing volume.\n• Active recovery (walking, light yoga) speeds up recovery.";
            return msg;
        }
    },

    {
        keywords: ['motivat', 'give up', 'quit', 'tired of', 'lazy', 'no energy', 'demotivat', 'discipline', 'consistent', 'consistency', 'stay on track', 'keep going', 'losing hope'],
        response: (ctx) => {
            let msg = "Everyone hits rough patches! Remember:\n";
            if (ctx.streak > 0) {
                msg += `🔥 You have a ${ctx.streak}-week consistency streak — don't break it now!\n`;
            }
            if (ctx.weightChange !== null && ctx.weightChange !== 0) {
                const dir = ctx.goal === 'lose_weight' ? (ctx.weightChange < 0 ? 'lost' : 'gained') : (ctx.weightChange > 0 ? 'gained' : 'lost');
                msg += `📊 Real progress: You've ${dir} ${Math.abs(ctx.weightChange)} kg — that's not nothing!\n`;
            }
            if (ctx.habitScore !== null) {
                msg += `💪 Your habit score is ${ctx.habitScore}% — `;
                msg += ctx.habitScore >= 70 ? "you're doing better than you think!\n" : "even small improvements compound over time.\n";
            }
            msg += "• Focus on small wins: showing up is half the battle.\n• Set micro-goals: focus on this week, not the next 6 months.\n• Find a workout buddy or community for accountability.";
            return msg;
        }
    },

    {
        keywords: ['protein', 'how much protein', 'protein intake', 'protein source', 'protein rich'],
        response: (ctx) => {
            let msg = "";
            if (ctx.weightKg) {
                const minP = Math.round(ctx.weightKg * 1.6);
                const maxP = Math.round(ctx.weightKg * 2.2);
                msg += `Based on your weight (${ctx.weightKg} kg), aim for ${minP}–${maxP}g of protein daily.\n`;
                if (ctx.protein) {
                    msg += `📋 Your current diet plan targets ${ctx.protein}g protein/day`;
                    msg += ctx.protein >= minP ? " — you're on track! ✅\n" : " — consider increasing slightly.\n";
                }
            } else {
                msg += "Aim for 1.6–2.2g of protein per kg of body weight daily.\n";
            }
            msg += "• Spread it across 3-5 meals.\n• Great sources: chicken, fish, eggs, Greek yogurt, lentils, whey protein.\n• Protein timing matters less than total daily intake.";
            return msg;
        }
    },

    {
        keywords: ['cheat meal', 'cheat day', 'eating out', 'junk food', 'pizza', 'burger', 'can i eat', 'unhealthy food'],
        response: () => "One meal won't ruin your progress!\n• Choose grilled over fried when eating out.\n• Don't skip meals before — eat normally.\n• Get back on track the next meal, not 'next Monday'.\n• Consider it a 'refeed' rather than a cheat — enjoy it guilt-free."
    },

    {
        keywords: ['sleep', 'insomnia', "can't sleep", 'tired', 'fatigue', 'exhausted', 'rest', 'sleeping'],
        response: (ctx) => {
            let msg = "Sleep is crucial for fitness results!\n";
            if (ctx.avgFatigue !== null) {
                msg += `📊 Your recent average fatigue is ${ctx.avgFatigue}/10`;
                msg += ctx.avgFatigue >= 7 ? " — that's quite high. Prioritize recovery!\n" : ctx.avgFatigue >= 5 ? " — moderate. Room for improvement.\n" : " — looking good! Keep it up.\n";
            }
            msg += "• Aim for 7-9 hours per night.\n• Avoid caffeine after 2 PM.\n• Keep your room cool and dark.\n• Stop screens 30 min before bed.\n• Consider magnesium or chamomile tea.";
            return msg;
        }
    },

    {
        keywords: ['supplement', 'creatine', 'pre-workout', 'vitamin', 'whey', 'bcaa', 'omega', 'fish oil', 'multivitamin'],
        response: () => "Evidence-backed supplements:\n• Creatine monohydrate (5g/day) — most studied, safe, effective.\n• Vitamin D if you don't get much sun.\n• Protein powder to reach daily targets.\n• Caffeine before workouts (200-400mg).\n• Skip fat burners and BCAAs — they're generally not worth it."
    },

    {
        keywords: ['beginner', 'just started', 'new to', 'first time', 'start working out', 'getting started', 'newbie', 'starting out', 'how to start', 'where to start'],
        response: () => "Welcome to your fitness journey! Key tips:\n• Focus on form before adding weight.\n• Start with 3 sessions per week.\n• Progressive overload: add a small amount each week.\n• Nutrition matters more than you think — track your meals.\n• Rest days are growth days — don't skip them!"
    },

    {
        keywords: ['bulk', 'gain weight', 'gain muscle', 'mass', 'skinny', 'underweight', 'too thin', 'build muscle', 'bigger', 'size', 'muscle growth', 'improve weight', 'increase weight', 'put on weight', 'weight gain'],
        response: (ctx) => {
            let msg = "To build mass effectively:\n";
            if (ctx.dailyCalories) {
                msg += `📋 Your current plan has you at ${ctx.dailyCalories} kcal/day. Make sure you're hitting this consistently.\n`;
            }
            msg += "• Eat in a 300-500 calorie surplus.\n• Prioritize compound lifts (squat, bench, deadlift, OHP).\n• Train each muscle group 2x per week.\n• Get 7-9 hours of sleep.\n• Be patient — healthy muscle gain is ~0.25-0.5 kg/week.";
            return msg;
        }
    },

    {
        keywords: ['cut', 'lose fat', 'lean', 'shred', 'lose weight', 'weight loss', 'belly fat', 'burn fat', 'slim', 'reduce weight', 'drop weight', 'diet plan', 'calorie deficit', 'fat loss'],
        response: (ctx) => {
            let msg = "For an effective cut:\n";
            if (ctx.dailyCalories) {
                msg += `📋 Your current target: ${ctx.dailyCalories} kcal/day.\n`;
            }
            if (ctx.weightChange !== null && ctx.weightChange < 0) {
                msg += `📊 Great work! You've already lost ${Math.abs(ctx.weightChange)} kg.\n`;
            }
            msg += "• Aim for a 400-600 calorie deficit.\n• Keep protein high (2g/kg body weight).\n• Maintain strength training to preserve muscle.\n• Add 2-3 cardio sessions per week.\n• Don't rush it — 0.5-1% body weight loss per week is ideal.";
            return msg;
        }
    },

    {
        keywords: ['water', 'hydrat', 'how much water', 'drink more', 'dehydrat'],
        response: (ctx) => {
            let msg = "Stay hydrated!\n";
            if (ctx.weightKg) {
                const ml = Math.round(ctx.weightKg * 35);
                msg += `💧 Based on your weight (${ctx.weightKg} kg), aim for ~${ml}ml (${(ml / 1000).toFixed(1)}L) of water daily.\n`;
            }
            msg += "• Drink extra on training days (500ml+ during workouts).\n• Signs of dehydration: dark urine, fatigue, headaches.\n• Water helps with recovery, performance, and even fat loss.";
            return msg;
        }
    },

    {
        keywords: ['cardio', 'running', 'how much cardio', 'jogging', 'cycling', 'treadmill', 'hiit', 'walk', 'steps', 'aerobic'],
        response: (ctx) => {
            let msg = "Cardio guidelines:\n";
            if (ctx.goal === 'lose_weight') {
                msg += "🎯 Since your goal is weight loss, cardio is important! Aim for the higher end.\n";
            } else if (ctx.goal === 'build_muscle') {
                msg += "🎯 Since your goal is muscle gain, keep cardio moderate to avoid burning too many calories.\n";
            }
            msg += "• For fat loss: 150-300 min moderate/week or 75-150 min vigorous.\n• For muscle building: 2-3 sessions of 20-30 min (don't overdo it).\n• LISS (walking, cycling) is great for recovery days.\n• HIIT is time-efficient but more fatiguing — limit to 2-3x/week.";
            return msg;
        }
    },

    {
        keywords: ['abs', 'core', 'six pack', 'stomach', 'midsection', 'plank'],
        response: () => "Getting visible abs:\n• Abs are made in the kitchen — you need low body fat (10-15% for men, 16-22% for women).\n• Train core 2-3x per week with varied exercises.\n• Best moves: hanging leg raises, ab wheel, cable crunches, planks.\n• Don't just do crunches — hit all planes of movement.\n• Compound lifts (squats, deadlifts) already work your core heavily."
    },

    {
        keywords: ['stretch', 'flex', 'warm up', 'cool down', 'mobility', 'stiff', 'tight'],
        response: () => "Mobility & stretching tips:\n• Dynamic stretching before workouts (leg swings, arm circles).\n• Static stretching after workouts (hold 30-60 sec per stretch).\n• Focus on hip flexors, hamstrings, and shoulders — commonly tight areas.\n• Add 5-10 min mobility work daily for long-term benefits.\n• Foam rolling helps release muscle tension."
    },

    {
        keywords: ['workout plan', 'routine', 'program', 'split', 'how many days', 'schedule', 'what exercises'],
        response: () => "Workout programming tips:\n• Beginners: Full body 3x/week.\n• Intermediate: Upper/Lower 4x/week or Push/Pull/Legs.\n• Advanced: PPL 6x/week or specialized splits.\n• Always include compound movements as your foundation.\n• Progressive overload is key — track your lifts!\n• Check your Workout Plan page for a personalized program."
    },

    {
        keywords: ['meal', 'food', 'what to eat', 'nutrition', 'calori', 'macro', 'diet', 'eat'],
        response: (ctx) => {
            let msg = "Nutrition fundamentals:\n";
            if (ctx.dailyCalories) {
                msg += `📋 Your personalized target: ${ctx.dailyCalories} kcal/day with ${ctx.protein || '—'}g protein.\n`;
            }
            msg += "• Calculate your TDEE and adjust based on goals.\n• Hit your protein target first (1.6-2.2g/kg).\n• Fill the rest with carbs and fats based on preference.\n• Eat plenty of vegetables and whole foods.\n• Check your Diet Plan page for personalized meals.";
            return msg;
        }
    },

    {
        keywords: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'what can you do', 'help', 'how are you'],
        response: (ctx) => {
            let msg = `Hey ${ctx.name}! 💪 I'm your AI fitness coach. `;
            if (ctx.habitScore !== null) {
                msg += `Your current habit score is ${ctx.habitScore}%. `;
            }
            if (ctx.streak > 0) {
                msg += `You're on a ${ctx.streak}-week streak! `;
            }
            msg += "\n\nHere's what I can help with:\n• 🏋️ Workout plans & exercise tips\n• 🥗 Nutrition & diet advice\n• 💊 Supplement recommendations\n• 😴 Sleep & recovery tips\n• 🔥 Motivation & consistency\n• 📏 Body measurements & progress tracking\n\nJust ask me anything about fitness!";
            return msg;
        }
    },

    {
        keywords: ['thank', 'thanks', 'awesome', 'great', 'perfect', 'helpful', 'nice', 'good advice', 'appreciate'],
        response: (ctx) => {
            let msg = "You're welcome! 😊 ";
            if (ctx.streak > 0) {
                msg += `Keep that ${ctx.streak}-week streak going! `;
            }
            msg += "Consistency is the real secret. Feel free to ask me anything else anytime!";
            return msg;
        }
    },

    // ── #21 Premium Coaching: Deep Recovery Insights ──
    {
        keywords: ['recovery plan', 'deload', 'overtraining', 'burned out', 'need rest', 'training too much', 'overtrained'],
        response: (ctx) => {
            let msg = "🧘 **Recovery & Deload Analysis:**\n";
            if (ctx.avgFatigue !== null) {
                msg += `📊 Your avg fatigue: ${ctx.avgFatigue}/10 | Avg sleep: ${ctx.avgSleep || '—'}h | Avg stress: ${ctx.avgStress || '—'}/10\n`;
                if (ctx.avgFatigue >= 7) {
                    msg += "⚠️ **Deload recommended!** Your fatigue is high. Here's a recovery protocol:\n";
                    msg += "• Reduce training volume by 40-50% this week\n• Keep weight the same, cut sets in half\n";
                    msg += "• Prioritize sleep (aim for 9 hours)\n• Add stretching/yoga sessions\n";
                } else if (ctx.avgFatigue >= 5) {
                    msg += "🟡 Fatigue is moderate. Consider:\n";
                    msg += "• Reduce intensity by 20% for 2-3 days\n• An extra rest day this week\n";
                    msg += "• Focus on hydration and sleep quality\n";
                } else {
                    msg += "✅ Recovery looks solid! You can maintain or increase intensity.\n";
                }
            } else {
                msg += "No energy data yet. Log your energy check-ins to get personalized recovery insights.\n";
            }
            msg += "• Signs of overtraining: persistent fatigue, decreased performance, mood changes, sleep issues.\n";
            msg += "• Every 4-6 weeks, take a planned deload week (lighter volume).";
            return msg;
        }
    },

    // ── #21 Premium Coaching: Progress Review ──
    {
        keywords: ['how am i doing', 'my progress', 'review', 'assess', 'summary', 'report', 'overview', 'am i on track'],
        response: (ctx) => {
            let msg = "📊 **Your Fitness Progress Review:**\n";
            if (ctx.weightChange !== null) {
                msg += `⚖️ Weight: ${ctx.weightChange > 0 ? '+' : ''}${ctx.weightChange} kg since start\n`;
            }
            if (ctx.habitScore !== null) {
                const grade = ctx.habitScore >= 80 ? 'A 🌟' : ctx.habitScore >= 60 ? 'B 👍' : ctx.habitScore >= 40 ? 'C ⚡' : 'D 😕';
                msg += `📋 Habit Score: ${ctx.habitScore}% (Grade: ${grade})\n`;
            }
            if (ctx.streak > 0) msg += `🔥 Streak: ${ctx.streak} weeks consistent\n`;
            if (ctx.dailyCalories) msg += `🍽️ Daily target: ${ctx.dailyCalories} kcal\n`;
            if (ctx.avgFatigue !== null) {
                msg += `⚡ Energy: Fatigue ${ctx.avgFatigue}/10, Sleep ${ctx.avgSleep || '—'}h\n`;
            }
            msg += "\n**Recommendations:**\n";
            if (ctx.habitScore !== null && ctx.habitScore < 60) {
                msg += "• Focus on consistency before intensity — aim for 80%+ adherence\n";
            }
            if (ctx.avgFatigue !== null && ctx.avgFatigue >= 7) {
                msg += "• Your fatigue is high — consider more rest or a deload\n";
            }
            msg += "• Check the Report page for a detailed monthly breakdown\n";
            msg += "• Visit Analytics for trend visualizations";
            return msg;
        }
    },

    // ── #21 Premium Coaching: Meal Planning ──
    {
        keywords: ['meal prep', 'meal plan', 'meal timing', 'when to eat', 'pre workout meal', 'post workout meal', 'breakfast ideas', 'dinner ideas', 'lunch ideas', 'swap meal'],
        response: (ctx) => {
            let msg = "🍽️ **Meal Planning Coaching:**\n";
            if (ctx.dailyCalories) {
                msg += `Your target: ${ctx.dailyCalories} kcal/day split as:\n`;
                msg += `• Breakfast: ~${Math.round(ctx.dailyCalories * 0.25)} kcal\n`;
                msg += `• Lunch: ~${Math.round(ctx.dailyCalories * 0.30)} kcal\n`;
                msg += `• Snack: ~${Math.round(ctx.dailyCalories * 0.15)} kcal\n`;
                msg += `• Dinner: ~${Math.round(ctx.dailyCalories * 0.30)} kcal\n\n`;
            }
            msg += "**Timing Tips:**\n";
            msg += "• Pre-workout (1-2h before): Carbs + moderate protein (e.g., banana + yogurt)\n";
            msg += "• Post-workout (within 1h): Protein + carbs (e.g., protein shake + fruit)\n";
            msg += "• Don't like a meal? Use the 🔄 Swap button on your Diet Plan page!\n";
            msg += "\n**Meal Prep Tips:**\n";
            msg += "• Batch cook protein (chicken, eggs) on Sundays\n";
            msg += "• Pre-portion snacks into containers\n";
            msg += "• Keep 2-3 go-to recipes you enjoy";
            return msg;
        }
    },
];

const DISCLAIMER = '\n\n⚠️ _Disclaimer: This is general fitness guidance, not medical advice. Consult a healthcare professional before making significant changes to your fitness or nutrition routine._';

function getResponse(message, context = {}) {
    const lower = message.toLowerCase();
    const ctx = context || {};

    // Check each rule — use partial matching for better coverage
    for (const rule of RULES) {
        if (rule.keywords.some(kw => lower.includes(kw))) {
            const resp = typeof rule.response === 'function' ? rule.response(ctx) : rule.response;
            return resp + DISCLAIMER;
        }
    }

    // Try word-level matching as a fallback
    const words = lower.split(/\s+/);
    for (const rule of RULES) {
        for (const kw of rule.keywords) {
            if (words.some(word => word.length >= 4 && kw.startsWith(word))) {
                const resp = typeof rule.response === 'function' ? rule.response(ctx) : rule.response;
                return resp + DISCLAIMER;
            }
        }
    }

    return "Great question! Here are some areas I can help with — try asking about:\n• 🏋️ \"workout plan\" or \"what exercises should I do?\"\n• 🥗 \"what should I eat?\" or \"how much protein?\"\n• 📉 \"how to lose weight\" or \"how to gain muscle\"\n• 💊 \"what supplements should I take?\"\n• 😴 \"how to improve sleep\" or \"recovery tips\"\n• 🔥 \"how to stay motivated\"\n\nThe more specific your question, the better I can help!" + DISCLAIMER;
}

module.exports = { getResponse };
