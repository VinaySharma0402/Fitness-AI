/**
 * Progressive overload suggestions based on recent progress and user goal.
 */

function suggest(currentPlan, progressLogs, goal) {
    if (!progressLogs || progressLogs.length < 2) {
        return { action: 'maintain', message: 'Keep following your current plan. We need at least 2 weeks of data to suggest changes.' };
    }

    const recent = progressLogs.slice(-4);
    const avgWorkout = recent.reduce((s, l) => s + l.workoutAdherence, 0) / recent.length;
    const avgDiet = recent.reduce((s, l) => s + l.dietAdherence, 0) / recent.length;
    const avgAdherence = (avgWorkout + avgDiet) / 2;

    // Check if last 2 weeks were consistently high (≥90%)
    const last2 = progressLogs.slice(-2);
    const last2Avg = last2.reduce((s, l) => s + ((l.workoutAdherence + l.dietAdherence) / 2), 0) / last2.length;

    if (last2Avg >= 90) {
        // Goal-specific overload suggestions
        if (goal === 'build_muscle' || goal === 'body_recomposition') {
            return {
                action: 'increase',
                message: '💪 Excellent consistency for 2+ weeks! Increase load by 5-10% on compound lifts or add 1 extra set to target muscle growth.',
                details: { weightIncrease: '5-10%', extraSets: 1 },
            };
        }
        if (goal === 'lose_weight') {
            return {
                action: 'increase',
                message: '🔥 Great consistency! Add 5-10 minutes of cardio per session or increase HIIT intervals to boost calorie burn.',
                details: { extraCardioMin: 10, intensityBump: '5-10%' },
            };
        }
        if (goal === 'improve_endurance') {
            return {
                action: 'increase',
                message: '🏃 Strong adherence! Increase cardio duration by 10% or add 1 extra interval to improve VO2 max.',
                details: { durationIncrease: '10%', extraIntervals: 1 },
            };
        }
        // Default (maintain goal)
        return {
            action: 'increase',
            message: '✅ Consistent performance! Consider increasing weight by 5-10% or adding 1 extra set to keep progressing.',
            details: { weightIncrease: '5-10%', extraSets: 1 },
        };
    }

    if (avgAdherence >= 50) {
        return {
            action: 'maintain',
            message: 'Solid work! Maintain current intensity and focus on perfecting your form.',
        };
    }

    return {
        action: 'decrease',
        message: '⚠️ Adherence is low. Consider reducing volume by 1 set per exercise or switching to lighter weights to rebuild momentum.',
        details: { reduceSets: 1 },
    };
}

module.exports = { suggest };
