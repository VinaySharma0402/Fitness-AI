/**
 * Goal timeline estimation with confidence band.
 */

function estimate(currentWeightKg, targetWeightKg, progressLogs) {
    if (!progressLogs || progressLogs.length < 2) {
        return { weeksRemaining: null, message: 'Not enough data yet. Log at least 2 weeks to forecast.' };
    }

    const weights = progressLogs.filter(l => l.weightKg).map(l => l.weightKg);
    if (weights.length < 2) {
        return { weeksRemaining: null, message: 'Need at least 2 weight entries to forecast.' };
    }

    const weeklyChanges = [];
    for (let i = 1; i < weights.length; i++) {
        weeklyChanges.push(weights[i] - weights[i - 1]);
    }
    const avgChange = weeklyChanges.reduce((a, b) => a + b, 0) / weeklyChanges.length;

    const diff = targetWeightKg - currentWeightKg;

    // Same direction check
    if ((diff > 0 && avgChange <= 0) || (diff < 0 && avgChange >= 0)) {
        return {
            weeksRemaining: null,
            avgWeeklyChange: +avgChange.toFixed(2),
            message: 'Your current trend is going in the opposite direction of your goal. Consider adjusting your plan.',
        };
    }

    if (Math.abs(avgChange) < 0.05) {
        return {
            weeksRemaining: null,
            avgWeeklyChange: +avgChange.toFixed(2),
            message: 'Weight is stable. Adjust your calorie intake or exercise volume to make progress towards your goal.',
        };
    }

    // Calculate standard deviation for confidence band
    const variance = weeklyChanges.reduce((s, c) => s + Math.pow(c - avgChange, 2), 0) / weeklyChanges.length;
    const stdDev = Math.sqrt(variance);

    const weeks = Math.ceil(Math.abs(diff / avgChange));

    // Confidence band: optimistic (faster rate) and pessimistic (slower rate)
    const optimisticRate = Math.abs(avgChange) + stdDev;
    const pessimisticRate = Math.max(0.05, Math.abs(avgChange) - stdDev);
    const optimisticWeeks = Math.ceil(Math.abs(diff) / optimisticRate);
    const pessimisticWeeks = Math.ceil(Math.abs(diff) / pessimisticRate);

    const now = Date.now();
    const msPerWeek = 7 * 24 * 3600 * 1000;

    return {
        weeksRemaining: weeks,
        avgWeeklyChange: +avgChange.toFixed(2),
        estimatedDate: new Date(now + weeks * msPerWeek).toISOString().slice(0, 10),
        confidenceBand: {
            optimistic: {
                weeks: optimisticWeeks,
                date: new Date(now + optimisticWeeks * msPerWeek).toISOString().slice(0, 10),
            },
            pessimistic: {
                weeks: pessimisticWeeks,
                date: new Date(now + pessimisticWeeks * msPerWeek).toISOString().slice(0, 10),
            },
        },
        message: `At your current rate (${avgChange > 0 ? '+' : ''}${avgChange.toFixed(2)} kg/week), you'll reach ${targetWeightKg} kg in ~${weeks} weeks (${optimisticWeeks}–${pessimisticWeeks} week range).`,
    };
}

module.exports = { estimate };
