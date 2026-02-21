/**
 * Habit score, streak calculation, monthly average, and drop-off detection.
 */

function calculateScore(workoutAdherence, dietAdherence) {
    return Math.round(workoutAdherence * 0.60 + dietAdherence * 0.40);
}

function monthlyAverage(logs) {
    if (!logs || logs.length === 0) return null;
    const last4 = logs.slice(-4); // ~1 month of weekly logs
    const avg = last4.reduce((s, l) => s + calculateScore(l.workoutAdherence, l.dietAdherence), 0) / last4.length;
    return Math.round(avg);
}

function analyseStreak(logs) {
    if (!logs || logs.length === 0) return { streak: 0, trend: 'none', alert: null, monthlyAvg: null };

    let streak = 0;
    for (let i = logs.length - 1; i >= 0; i--) {
        const score = calculateScore(logs[i].workoutAdherence, logs[i].dietAdherence);
        if (score >= 60) streak++;
        else break;
    }

    // Trend from last 4 weeks
    let trend = 'stable';
    if (logs.length >= 4) {
        const recent = logs.slice(-4).map(l => calculateScore(l.workoutAdherence, l.dietAdherence));
        const first2 = (recent[0] + recent[1]) / 2;
        const last2 = (recent[2] + recent[3]) / 2;
        if (last2 > first2 + 5) trend = 'improving';
        else if (last2 < first2 - 5) trend = 'declining';
    }

    // Enhanced drop-off detection
    let alert = null;
    let dropOffRisk = false;

    // Trigger 1: 3 consecutive missed/low workouts (adherence < 30%)
    if (logs.length >= 3) {
        const last3 = logs.slice(-3);
        const missedWorkouts = last3.filter(l => l.workoutAdherence < 30).length;
        if (missedWorkouts >= 3) {
            alert = '🚨 3 consecutive low workout weeks detected! Consider switching to a lighter plan or adjusting your schedule.';
            dropOffRisk = true;
        }
    }

    // Trigger 2: Diet adherence < 40% for 2 weeks
    if (!alert && logs.length >= 2) {
        const last2 = logs.slice(-2);
        const lowDiet = last2.every(l => l.dietAdherence < 40);
        if (lowDiet) {
            alert = '🍽️ Diet adherence has been below 40% for 2 weeks. Try simplifying your meals or allowing more flexible eating days.';
            dropOffRisk = true;
        }
    }

    // Trigger 3: Score drop > 15 points (existing logic)
    if (!alert && logs.length >= 2) {
        const lastScore = calculateScore(logs[logs.length - 1].workoutAdherence, logs[logs.length - 1].dietAdherence);
        const prevScore = calculateScore(logs[logs.length - 2].workoutAdherence, logs[logs.length - 2].dietAdherence);
        if (lastScore < prevScore - 15) {
            alert = '📉 Significant drop detected! Your consistency fell by more than 15 points this week. Would you like to reset your schedule or try a lighter plan?';
            dropOffRisk = true;
        }
    }

    const monthlyAvg = monthlyAverage(logs);

    return { streak, trend, alert, monthlyAvg, dropOffRisk };
}

module.exports = { calculateScore, analyseStreak, monthlyAverage };
