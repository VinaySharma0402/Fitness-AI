import { useEffect, useState } from 'react';
import API from '../api/axios';

export default function DietPlan() {
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);

    const fetchPlan = () => {
        setLoading(true);
        API.get('/diet/current').then(r => setPlan(r.data)).catch(() => setPlan(null)).finally(() => setLoading(false));
    };

    useEffect(fetchPlan, []);

    const generate = async () => {
        setGenerating(true);
        try {
            const { data } = await API.post('/diet/generate');
            setPlan(data);
        } catch (err) {
            alert(err.response?.data?.msg || 'Failed to generate');
        } finally {
            setGenerating(false);
        }
    };

    if (loading) return <div className="loading-center"><div className="spinner" /></div>;

    return (
        <>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1>🥗 Diet Plan</h1>
                    <p>Your tailored nutrition plan with macros</p>
                </div>
                <button className="btn btn-success" onClick={generate} disabled={generating}>
                    {generating ? 'Generating…' : plan ? '↻ Regenerate' : '+ Generate Plan'}
                </button>
            </div>

            {!plan ? (
                <div className="glass-card" style={{ textAlign: 'center', padding: 60 }}>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
                        No diet plan yet. Generate one based on your calorie needs!
                    </p>
                    <button className="btn btn-success btn-lg" onClick={generate} disabled={generating}>
                        Generate My Plan
                    </button>
                </div>
            ) : (
                <>
                    <div className="stats-grid" style={{ marginBottom: 24 }}>
                        <div className="stat-card stat-cyan">
                            <div className="stat-label">Daily Calories</div>
                            <div className="stat-value">{plan.dailyCalories}</div>
                        </div>
                        <div className="stat-card stat-emerald">
                            <div className="stat-label">Protein</div>
                            <div className="stat-value">{plan.protein}g</div>
                        </div>
                        <div className="stat-card stat-violet">
                            <div className="stat-label">Carbs</div>
                            <div className="stat-value">{plan.carbs}g</div>
                        </div>
                        <div className="stat-card stat-amber">
                            <div className="stat-label">Fat</div>
                            <div className="stat-value">{plan.fat}g</div>
                        </div>
                    </div>

                    <div className="grid-2">
                        {plan.meals.map((meal, i) => (
                            <div className="meal-card" key={i}>
                                <h3>{meal.name}</h3>
                                <div className="meal-foods">
                                    {meal.foods.map((f, j) => <div key={j}>• {f}</div>)}
                                </div>
                                <div className="meal-macros">
                                    <span>Calories:<span className="val">{meal.calories}</span></span>
                                    <span>Protein:<span className="val">{meal.protein}g</span></span>
                                    <span>Carbs:<span className="val">{meal.carbs}g</span></span>
                                    <span>Fat:<span className="val">{meal.fat}g</span></span>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            <div className="glass-card" style={{ marginTop: 24, padding: '16px 20px', borderLeft: '3px solid var(--accent-amber)', opacity: 0.85 }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
                    ⚠️ <strong style={{ color: 'var(--accent-amber)' }}>Medical Disclaimer:</strong> This nutrition plan is generated for informational purposes only and is not a substitute for professional dietary advice. Consult a registered dietitian or healthcare provider before making significant changes to your diet, especially if you have food allergies, medical conditions, or are on medication.
                </p>
            </div>
        </>
    );
}
