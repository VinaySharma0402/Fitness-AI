/**
 * Multi-Week Roadmap Engine
 * Projects 4-8 week progression plan with milestones.
 */

function project(user, progressLogs, currentPlan) {
    const goal = user.goal || 'maintain';
    const currentWeight = user.weightKg || 70;
    const targetWeight = user.targetWeightKg || currentWeight;
    const weeks = 8;
    const roadmap = [];

    // Calculate current rate from progress logs
    let weeklyRate = 0;
    if (progressLogs && progressLogs.length >= 2) {
        const weights = progressLogs.filter(l => l.weightKg).map(l => l.weightKg);
        if (weights.length >= 2) {
            const recent = weights.slice(-4);
            const changes = [];
            for (let i = 1; i < recent.length; i++) changes.push(recent[i] - recent[i - 1]);
            weeklyRate = changes.reduce((a, b) => a + b, 0) / changes.length;
        }
    }

    // Default rates if no data
    if (weeklyRate === 0) {
        switch (goal) {
            case 'lose_weight': weeklyRate = -0.5; break;
            case 'build_muscle': weeklyRate = 0.2; break;
            default: weeklyRate = 0; break;
        }
    }

    // Base intensity progression
    const baseIntensity = 100; // percent
    let projectedWeight = currentWeight;

    for (let w = 1; w <= weeks; w++) {
        projectedWeight += weeklyRate;
        const intensity = Math.min(130, baseIntensity + (w - 1) * 3); // +3% per week, cap 130%
        const milestone = getMilestone(w, goal, projectedWeight, targetWeight);

        const weekPlan = {
            week: w,
            projectedWeight: +projectedWeight.toFixed(1),
            intensityPct: intensity,
            phase: getPhase(w),
            dietNote: getDietNote(w, goal),
            workoutNote: getWorkoutNote(w, goal, intensity),
            milestone,
        };
        roadmap.push(weekPlan);
    }

    return {
        totalWeeks: weeks,
        goal,
        startWeight: currentWeight,
        projectedEndWeight: +(currentWeight + weeklyRate * weeks).toFixed(1),
        weeklyRate: +weeklyRate.toFixed(2),
        roadmap,
    };
}

function getPhase(week) {
    if (week <= 2) return 'Foundation';
    if (week <= 4) return 'Building';
    if (week <= 6) return 'Intensification';
    return 'Peak';
}

function getDietNote(week, goal) {
    if (goal === 'lose_weight') {
        if (week <= 2) return 'Maintain current deficit. Focus on consistency.';
        if (week <= 4) return 'Consider reducing calories by 50-100 kcal if plateaued.';
        if (week <= 6) return 'Introduce a refeed day (1x/week, maintenance calories).';
        return 'Evaluate overall progress. Adjust deficit or transition to maintenance.';
    }
    if (goal === 'build_muscle') {
        if (week <= 2) return 'Maintain surplus. Ensure 1.8g/kg protein minimum.';
        if (week <= 4) return 'Increase protein to 2.0g/kg if tolerated.';
        if (week <= 6) return 'Add 100 kcal if weight gain has slowed.';
        return 'Evaluate muscle vs fat gain ratio. Adjust surplus if needed.';
    }
    return 'Maintain balanced nutrition. Adjust as needed based on energy.';
}

function getWorkoutNote(week, goal, intensity) {
    if (week <= 2) return 'Focus on form and consistency. Build habits.';
    if (week <= 4) return `Increase volume by 1 set per exercise (Intensity: ${intensity}%).`;
    if (week <= 6) return `Progressive overload — increase weight 5-10% (Intensity: ${intensity}%).`;
    return `Peak phase — deload week optional. Intensity at ${intensity}%.`;
}

function getMilestone(week, goal, projectedWeight, targetWeight) {
    if (week === 2) return '🎯 2-week check: Are habits forming?';
    if (week === 4) return '📊 Month 1 complete! Review all metrics.';
    if (week === 6) return '💪 6-week mark: Major adaptation point.';
    if (week === 8) return '🏆 8-week cycle complete! Evaluate and plan next cycle.';

    if (goal === 'lose_weight' && Math.abs(projectedWeight - targetWeight) < 2) {
        return `🎉 Approaching target weight (${targetWeight} kg)!`;
    }
    return null;
}

module.exports = { project };
