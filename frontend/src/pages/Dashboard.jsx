import { useEffect, useState } from 'react';
import API from '../api/axios';

export default function Dashboard() {
    const [profile, setProfile] = useState(null);
    const [habit, setHabit] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [overload, setOverload] = useState(null);

    useEffect(() => {
        API.get('/profile').then(r => setProfile(r.data)).catch(() => { });
        API.get('/progress/habit').then(r => setHabit(r.data)).catch(() => { });
        API.get('/progress/forecast').then(r => setForecast(r.data)).catch(() => { });
        API.get('/workout/overload').then(r => setOverload(r.data)).catch(() => { });
    }, []);

    if (!profile) return <div className="loading-center"><div className="spinner" /></div>;

    const goalLabel = {
        lose_weight: 'Lose Weight', build_muscle: 'Build Muscle',
        body_recomposition: 'Body Recomposition',
        maintain: 'Maintain', improve_endurance: 'Endurance',
    };

    return (
        <>
            <div className="page-header">
                <h1>Welcome back, {profile.name || 'Athlete'} 👋</h1>
                <p>Here's your fitness overview at a glance</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card stat-cyan">
                    <div className="stat-label">Current Weight</div>
                    <div className="stat-value">{profile.weightKg || '—'} <span style={{ fontSize: '1rem' }}>kg</span></div>
                    <div className="stat-sub">Target: {profile.targetWeightKg || '—'} kg</div>
                </div>
                <div className="stat-card stat-violet">
                    <div className="stat-label">Goal</div>
                    <div className="stat-value" style={{ fontSize: '1.4rem' }}>{goalLabel[profile.goal] || '—'}</div>
                    <div className="stat-sub">Level: {profile.experience || '—'}</div>
                </div>
                <div className="stat-card stat-emerald">
                    <div className="stat-label">Habit Score</div>
                    <div className="stat-value">{habit?.currentScore ?? '—'}</div>
                    <div className="stat-sub">Streak: {habit?.streak ?? 0} weeks</div>
                </div>
                <div className="stat-card stat-amber">
                    <div className="stat-label">Goal Forecast</div>
                    <div className="stat-value" style={{ fontSize: '1.2rem' }}>
                        {forecast?.weeksRemaining ? `${forecast.weeksRemaining} wks` : '—'}
                    </div>
                    <div className="stat-sub">{forecast?.avgWeeklyChange ? `${forecast.avgWeeklyChange > 0 ? '+' : ''}${forecast.avgWeeklyChange} kg/wk` : 'Need more data'}</div>
                </div>
            </div>

            <div className="grid-2">
                {/* Habit Trend */}
                <div className="glass-card">
                    <div className="section-title"><span className="dot" /> Habit Trend</div>
                    {habit?.alert && <div className="alert alert-warning">{habit.alert}</div>}
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Trend: <strong style={{ color: 'var(--text-primary)' }}>{habit?.trend || 'none'}</strong>
                    </p>
                    {habit?.currentScore > 0 && (
                        <div style={{ marginTop: 12 }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 6 }}>
                                Current score: {habit.currentScore}%
                            </div>
                            <div className="progress-bar-bg">
                                <div className="progress-bar-fill" style={{ width: `${habit.currentScore}%` }} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Progressive Overload */}
                <div className="glass-card">
                    <div className="section-title"><span className="dot" style={{ background: 'var(--accent-violet)' }} /> Progressive Overload</div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                        {overload?.message || 'Generate a workout plan and log progress to get personalized suggestions.'}
                    </p>
                    {overload?.action && (
                        <div style={{ marginTop: 12 }}>
                            <span className={`badge-pill ${overload.action === 'increase' ? 'badge-green' : overload.action === 'decrease' ? 'badge-red' : 'badge-blue'}`}
                                style={{
                                    padding: '6px 14px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600,
                                    background: overload.action === 'increase' ? 'rgba(16,185,129,0.15)' : overload.action === 'decrease' ? 'rgba(244,63,94,0.15)' : 'rgba(6,182,212,0.15)',
                                    color: overload.action === 'increase' ? 'var(--accent-emerald)' : overload.action === 'decrease' ? 'var(--accent-rose)' : 'var(--accent-cyan)',
                                }}>
                                {overload.action.toUpperCase()}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Goal Forecast */}
            {forecast && (
                <div className="glass-card" style={{ marginTop: 24 }}>
                    <div className="section-title"><span className="dot" style={{ background: 'var(--accent-amber)' }} /> Goal Timeline</div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                        {forecast.message}
                    </p>
                    {forecast.estimatedDate && (
                        <p style={{ color: 'var(--accent-amber)', fontWeight: 600, marginTop: 8 }}>
                            📅 Estimated completion: {forecast.estimatedDate}
                        </p>
                    )}
                    {forecast.confidenceBand && (
                        <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: '0.85rem' }}>
                            <span style={{ color: 'var(--accent-emerald)' }}>
                                🟢 Best case: {forecast.confidenceBand.optimistic.date} ({forecast.confidenceBand.optimistic.weeks}w)
                            </span>
                            <span style={{ color: 'var(--accent-rose)' }}>
                                🔴 Worst case: {forecast.confidenceBand.pessimistic.date} ({forecast.confidenceBand.pessimistic.weeks}w)
                            </span>
                        </div>
                    )}
                </div>
            )}

            <div className="glass-card" style={{ marginTop: 24, padding: '16px 20px', borderLeft: '3px solid var(--accent-amber)', opacity: 0.85 }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
                    ⚠️ <strong style={{ color: 'var(--accent-amber)' }}>Medical Disclaimer:</strong> FitAI provides fitness guidance for informational purposes only. Always consult a qualified healthcare professional before starting any exercise or nutrition program. Individual results may vary.
                </p>
            </div>
        </>
    );
}
