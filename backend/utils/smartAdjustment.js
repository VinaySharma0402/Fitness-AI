/**
 * Smart Plan Adjustment Engine
 * Analyzes weekly progress and generates automated plan adjustments.
 * Closed-loop: Plan → Execute → Track → Analyze → Adjust → Repeat
 */

function analyze(progressLogs, user) {
    const adjustments = [];
    if (!progressLogs || progressLogs.length < 2) {
        return { adjustments: [], summary: 'Need at least 2 weeks of data for smart adjustments. Keep logging!' };
    }

    const weights = progressLogs.filter(l => l.weightKg).map(l => l.weightKg);
    const recent = progressLogs.slice(-4); // last 4 weeks
    const goal = user.goal || 'maintain';

    // ── Weight Velocity Analysis ──
    let weeklyWeightChange = null;
    if (weights.length >= 2) {
        const recentWeights = weights.slice(-4);
        const changes = [];
        for (let i = 1; i < recentWeights.length; i++) {
            changes.push(recentWeights[i] - recentWeights[i - 1]);
        }
        weeklyWeightChange = changes.reduce((a, b) => a + b, 0) / changes.length;
    }

    // ── Adherence Analysis ──
    const avgWorkoutAdherence = recent.reduce((s, l) => s + (l.workoutAdherence || 0), 0) / recent.length;
    const avgDietAdherence = recent.reduce((s, l) => s + (l.dietAdherence || 0), 0) / recent.length;

    // ── TRIGGER 1: Weight loss too slow (< 0.3 kg/week for lose_weight) ──
    if (goal === 'lose_weight' && weeklyWeightChange !== null) {
        const lossRate = Math.abs(weeklyWeightChange);
        if (weeklyWeightChange >= -0.3 && weeklyWeightChange < 0) {
            adjustments.push({
                type: 'diet',
                severity: 'moderate',
                icon: '📉',
                title: 'Slow Weight Loss Detected',
                message: `You're losing only ${lossRate.toFixed(2)} kg/week (target: 0.5 kg/week). Consider reducing daily calories by 100-150 kcal or adding 10 minutes of daily walking.`,
                action: 'increase_deficit',
                detail: { currentRate: -lossRate, targetRate: -0.5, suggestedCutKcal: 150 },
            });
        } else if (weeklyWeightChange >= 0) {
            adjustments.push({
                type: 'diet',
                severity: 'high',
                icon: '🚨',
                title: 'Weight Not Decreasing',
                message: `Your weight hasn't dropped in recent weeks. Review portion sizes, hidden snacking, and consider tracking food more closely. A 200 kcal daily reduction may help restart progress.`,
                action: 'increase_deficit',
                detail: { currentRate: weeklyWeightChange, suggestedCutKcal: 200 },
            });
        }
    }

    // ── TRIGGER 2: Weight loss too fast (> 1 kg/week — safety) ──
    if (goal === 'lose_weight' && weeklyWeightChange !== null && weeklyWeightChange < -1) {
        adjustments.push({
            type: 'diet',
            severity: 'high',
            icon: '⚠️',
            title: 'Rapid Weight Loss — Safety Alert',
            message: `You're losing ${Math.abs(weeklyWeightChange).toFixed(2)} kg/week, which is too fast. Rapid loss risks muscle loss and nutrient deficiency. Increase daily intake by 200-300 kcal.`,
            action: 'reduce_deficit',
            detail: { currentRate: weeklyWeightChange, suggestedAddKcal: 250 },
        });
    }

    // ── TRIGGER 3: Muscle gain stagnant ──
    if ((goal === 'build_muscle' || goal === 'body_recomposition') && weeklyWeightChange !== null) {
        if (weeklyWeightChange < 0.1 && weeklyWeightChange > -0.1) {
            adjustments.push({
                type: 'workout',
                severity: 'moderate',
                icon: '💪',
                title: 'Muscle Gain Stagnant',
                message: `Weight is stable — muscle growth may have slowed. Try increasing workout volume (add 1 extra set per exercise) or boost protein by 10-15g/day.`,
                action: 'increase_volume',
                detail: { extraSets: 1, extraProteinG: 15 },
            });
        }
    }

    // ── TRIGGER 4: Low workout adherence → simplify plan ──
    if (avgWorkoutAdherence < 50) {
        adjustments.push({
            type: 'workout',
            severity: 'high',
            icon: '🔄',
            title: 'Low Workout Adherence',
            message: `Your workout adherence is ${Math.round(avgWorkoutAdherence)}% — your plan may be too demanding. Consider switching to 3 days/week or shorter sessions (30 min). Consistency beats intensity.`,
            action: 'simplify_workout',
            detail: { currentAdherence: Math.round(avgWorkoutAdherence), suggestedDays: 3 },
        });
    }

    // ── TRIGGER 5: Low diet adherence → simplify plan ──
    if (avgDietAdherence < 50) {
        adjustments.push({
            type: 'diet',
            severity: 'moderate',
            icon: '🍽️',
            title: 'Low Diet Adherence',
            message: `Diet adherence is ${Math.round(avgDietAdherence)}%. Try simplifying: meal prep on Sundays, keep 2-3 go-to meals, and allow 1 flexible meal/day.`,
            action: 'simplify_diet',
            detail: { currentAdherence: Math.round(avgDietAdherence) },
        });
    }

    // ── TRIGGER 6: High adherence but no results → plateau breaking ──
    if (avgWorkoutAdherence >= 80 && avgDietAdherence >= 80 && weeklyWeightChange !== null) {
        const moving = Math.abs(weeklyWeightChange) > 0.2;
        if (!moving && goal !== 'maintain') {
            adjustments.push({
                type: 'strategy',
                severity: 'moderate',
                icon: '🧠',
                title: 'Plateau Detected — High Effort, Low Results',
                message: `You're putting in the work (${Math.round(avgWorkoutAdherence)}% workout, ${Math.round(avgDietAdherence)}% diet) but weight isn't moving. Consider: changing exercise selection, adding a refeed day, or adjusting macros.`,
                action: 'break_plateau',
                detail: { workoutAdh: Math.round(avgWorkoutAdherence), dietAdh: Math.round(avgDietAdherence) },
            });
        }
    }

    // ── Build summary ──
    const highCount = adjustments.filter(a => a.severity === 'high').length;
    const modCount = adjustments.filter(a => a.severity === 'moderate').length;
    let summary;
    if (adjustments.length === 0) {
        summary = '✅ Everything looks great! Your plan is on track — keep going!';
    } else if (highCount > 0) {
        summary = `🚨 ${highCount} critical adjustment${highCount > 1 ? 's' : ''} needed. Review the recommendations below.`;
    } else {
        summary = `📋 ${modCount} suggestion${modCount > 1 ? 's' : ''} to optimize your plan.`;
    }

    return {
        adjustments,
        summary,
        metrics: {
            weeklyWeightChange: weeklyWeightChange !== null ? +weeklyWeightChange.toFixed(3) : null,
            avgWorkoutAdherence: Math.round(avgWorkoutAdherence),
            avgDietAdherence: Math.round(avgDietAdherence),
            weeksAnalyzed: recent.length,
        },
    };
}

module.exports = { analyze };
