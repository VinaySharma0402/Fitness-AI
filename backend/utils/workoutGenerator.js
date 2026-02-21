/**
 * Generates a 7-day workout plan based on goal and experience level.
 */

const TEMPLATES = {
    /* -------- LOSE WEIGHT -------- */
    lose_weight: {
        beginner: [
            {
                day: 'Monday', focus: 'Full Body', exercises: [
                    { name: 'Goblet Squat', sets: 3, reps: '12', restSec: 60, notes: '' },
                    { name: 'Dumbbell Bench Press', sets: 3, reps: '12', restSec: 60, notes: '' },
                    { name: 'Lat Pulldown', sets: 3, reps: '12', restSec: 60, notes: '' },
                    { name: 'Plank', sets: 3, reps: '30s', restSec: 45, notes: '' },
                ]
            },
            {
                day: 'Tuesday', focus: 'Cardio', exercises: [
                    { name: 'Brisk Walking', sets: 1, reps: '30min', restSec: 0, notes: 'Moderate pace' },
                    { name: 'Jump Rope', sets: 3, reps: '2min', restSec: 60, notes: '' },
                ]
            },
            {
                day: 'Wednesday', focus: 'Full Body', exercises: [
                    { name: 'Romanian Deadlift', sets: 3, reps: '12', restSec: 60, notes: '' },
                    { name: 'Shoulder Press', sets: 3, reps: '12', restSec: 60, notes: '' },
                    { name: 'Seated Row', sets: 3, reps: '12', restSec: 60, notes: '' },
                    { name: 'Bicycle Crunch', sets: 3, reps: '15', restSec: 45, notes: '' },
                ]
            },
            { day: 'Thursday', focus: 'Rest', exercises: [] },
            {
                day: 'Friday', focus: 'Full Body', exercises: [
                    { name: 'Leg Press', sets: 3, reps: '12', restSec: 60, notes: '' },
                    { name: 'Incline DB Press', sets: 3, reps: '12', restSec: 60, notes: '' },
                    { name: 'Cable Row', sets: 3, reps: '12', restSec: 60, notes: '' },
                    { name: 'Leg Raises', sets: 3, reps: '12', restSec: 45, notes: '' },
                ]
            },
            {
                day: 'Saturday', focus: 'Cardio', exercises: [
                    { name: 'Cycling', sets: 1, reps: '25min', restSec: 0, notes: 'Moderate intensity' },
                    { name: 'Burpees', sets: 3, reps: '10', restSec: 60, notes: '' },
                ]
            },
            { day: 'Sunday', focus: 'Rest', exercises: [] },
        ],
        intermediate: [
            {
                day: 'Monday', focus: 'Push', exercises: [
                    { name: 'Barbell Bench Press', sets: 4, reps: '10', restSec: 90, notes: '' },
                    { name: 'Overhead Press', sets: 3, reps: '10', restSec: 75, notes: '' },
                    { name: 'Incline DB Fly', sets: 3, reps: '12', restSec: 60, notes: '' },
                    { name: 'Tricep Pushdown', sets: 3, reps: '12', restSec: 60, notes: '' },
                ]
            },
            {
                day: 'Tuesday', focus: 'Pull', exercises: [
                    { name: 'Deadlift', sets: 4, reps: '8', restSec: 120, notes: '' },
                    { name: 'Barbell Row', sets: 4, reps: '10', restSec: 90, notes: '' },
                    { name: 'Face Pull', sets: 3, reps: '15', restSec: 60, notes: '' },
                    { name: 'Barbell Curl', sets: 3, reps: '12', restSec: 60, notes: '' },
                ]
            },
            {
                day: 'Wednesday', focus: 'HIIT Cardio', exercises: [
                    { name: 'Sprint Intervals', sets: 8, reps: '30s on / 30s off', restSec: 0, notes: '' },
                    { name: 'Mountain Climbers', sets: 3, reps: '20', restSec: 45, notes: '' },
                ]
            },
            {
                day: 'Thursday', focus: 'Legs', exercises: [
                    { name: 'Barbell Squat', sets: 4, reps: '10', restSec: 120, notes: '' },
                    { name: 'Walking Lunges', sets: 3, reps: '12 each', restSec: 75, notes: '' },
                    { name: 'Leg Curl', sets: 3, reps: '12', restSec: 60, notes: '' },
                    { name: 'Calf Raise', sets: 4, reps: '15', restSec: 45, notes: '' },
                ]
            },
            {
                day: 'Friday', focus: 'Upper Body', exercises: [
                    { name: 'Pull-Up', sets: 4, reps: '8', restSec: 90, notes: '' },
                    { name: 'Dumbbell Shoulder Press', sets: 3, reps: '10', restSec: 75, notes: '' },
                    { name: 'Cable Crossover', sets: 3, reps: '12', restSec: 60, notes: '' },
                    { name: 'Hanging Leg Raise', sets: 3, reps: '12', restSec: 60, notes: '' },
                ]
            },
            {
                day: 'Saturday', focus: 'Active Recovery', exercises: [
                    { name: 'Light Jogging', sets: 1, reps: '20min', restSec: 0, notes: '' },
                    { name: 'Stretching', sets: 1, reps: '15min', restSec: 0, notes: 'Focus on tight areas' },
                ]
            },
            { day: 'Sunday', focus: 'Rest', exercises: [] },
        ],
        advanced: [
            {
                day: 'Monday', focus: 'Push', exercises: [
                    { name: 'Barbell Bench Press', sets: 5, reps: '5', restSec: 180, notes: 'Heavy' },
                    { name: 'Incline DB Press', sets: 4, reps: '8', restSec: 90, notes: '' },
                    { name: 'Weighted Dips', sets: 4, reps: '8', restSec: 90, notes: '' },
                    { name: 'Lateral Raise', sets: 4, reps: '12', restSec: 60, notes: '' },
                    { name: 'Overhead Tricep Ext', sets: 3, reps: '12', restSec: 60, notes: '' },
                ]
            },
            {
                day: 'Tuesday', focus: 'Pull', exercises: [
                    { name: 'Barbell Row', sets: 5, reps: '5', restSec: 180, notes: 'Heavy' },
                    { name: 'Weighted Pull-Up', sets: 4, reps: '6', restSec: 120, notes: '' },
                    { name: 'Cable Row', sets: 4, reps: '10', restSec: 75, notes: '' },
                    { name: 'Hammer Curl', sets: 3, reps: '12', restSec: 60, notes: '' },
                    { name: 'Face Pull', sets: 3, reps: '15', restSec: 60, notes: '' },
                ]
            },
            {
                day: 'Wednesday', focus: 'HIIT', exercises: [
                    { name: 'Rowing Machine', sets: 6, reps: '500m sprint', restSec: 90, notes: '' },
                    { name: 'Kettlebell Swings', sets: 4, reps: '15', restSec: 60, notes: '' },
                    { name: 'Box Jumps', sets: 4, reps: '10', restSec: 75, notes: '' },
                ]
            },
            {
                day: 'Thursday', focus: 'Legs', exercises: [
                    { name: 'Barbell Squat', sets: 5, reps: '5', restSec: 180, notes: 'Heavy' },
                    { name: 'Bulgarian Split Squat', sets: 4, reps: '8 each', restSec: 90, notes: '' },
                    { name: 'Romanian Deadlift', sets: 4, reps: '8', restSec: 90, notes: '' },
                    { name: 'Leg Extension', sets: 3, reps: '12', restSec: 60, notes: '' },
                    { name: 'Standing Calf Raise', sets: 4, reps: '15', restSec: 45, notes: '' },
                ]
            },
            {
                day: 'Friday', focus: 'Upper Hypertrophy', exercises: [
                    { name: 'Incline Barbell Press', sets: 4, reps: '8', restSec: 90, notes: '' },
                    { name: 'T-Bar Row', sets: 4, reps: '10', restSec: 75, notes: '' },
                    { name: 'Arnold Press', sets: 3, reps: '10', restSec: 75, notes: '' },
                    { name: 'Preacher Curl', sets: 3, reps: '12', restSec: 60, notes: '' },
                    { name: 'Skull Crusher', sets: 3, reps: '12', restSec: 60, notes: '' },
                ]
            },
            {
                day: 'Saturday', focus: 'Conditioning', exercises: [
                    { name: 'Battle Ropes', sets: 5, reps: '30s', restSec: 30, notes: '' },
                    { name: 'Sled Push', sets: 4, reps: '30m', restSec: 60, notes: '' },
                    { name: 'Ab Wheel Rollout', sets: 4, reps: '10', restSec: 60, notes: '' },
                ]
            },
            { day: 'Sunday', focus: 'Rest', exercises: [] },
        ],
    },

    /* -------- BUILD MUSCLE -------- */
    build_muscle: {
        beginner: [
            {
                day: 'Monday', focus: 'Upper Body', exercises: [
                    { name: 'Bench Press', sets: 3, reps: '10', restSec: 90, notes: '' },
                    { name: 'Lat Pulldown', sets: 3, reps: '10', restSec: 75, notes: '' },
                    { name: 'Shoulder Press', sets: 3, reps: '10', restSec: 75, notes: '' },
                    { name: 'Bicep Curl', sets: 2, reps: '12', restSec: 60, notes: '' },
                    { name: 'Tricep Extension', sets: 2, reps: '12', restSec: 60, notes: '' },
                ]
            },
            {
                day: 'Tuesday', focus: 'Lower Body', exercises: [
                    { name: 'Goblet Squat', sets: 3, reps: '10', restSec: 90, notes: '' },
                    { name: 'Leg Press', sets: 3, reps: '12', restSec: 75, notes: '' },
                    { name: 'Leg Curl', sets: 3, reps: '12', restSec: 60, notes: '' },
                    { name: 'Calf Raise', sets: 3, reps: '15', restSec: 45, notes: '' },
                ]
            },
            { day: 'Wednesday', focus: 'Rest', exercises: [] },
            {
                day: 'Thursday', focus: 'Upper Body', exercises: [
                    { name: 'Incline DB Press', sets: 3, reps: '10', restSec: 90, notes: '' },
                    { name: 'Seated Row', sets: 3, reps: '10', restSec: 75, notes: '' },
                    { name: 'Lateral Raise', sets: 3, reps: '12', restSec: 60, notes: '' },
                    { name: 'Hammer Curl', sets: 2, reps: '12', restSec: 60, notes: '' },
                ]
            },
            {
                day: 'Friday', focus: 'Lower Body', exercises: [
                    { name: 'Romanian Deadlift', sets: 3, reps: '10', restSec: 90, notes: '' },
                    { name: 'Walking Lunges', sets: 3, reps: '10 each', restSec: 75, notes: '' },
                    { name: 'Leg Extension', sets: 3, reps: '12', restSec: 60, notes: '' },
                    { name: 'Seated Calf Raise', sets: 3, reps: '15', restSec: 45, notes: '' },
                ]
            },
            { day: 'Saturday', focus: 'Rest', exercises: [] },
            { day: 'Sunday', focus: 'Rest', exercises: [] },
        ],
        intermediate: [
            {
                day: 'Monday', focus: 'Chest & Triceps', exercises: [
                    { name: 'Barbell Bench Press', sets: 4, reps: '8', restSec: 120, notes: '' },
                    { name: 'Incline DB Press', sets: 4, reps: '10', restSec: 90, notes: '' },
                    { name: 'Cable Fly', sets: 3, reps: '12', restSec: 60, notes: '' },
                    { name: 'Close-Grip Bench', sets: 3, reps: '10', restSec: 75, notes: '' },
                    { name: 'Tricep Pushdown', sets: 3, reps: '12', restSec: 60, notes: '' },
                ]
            },
            {
                day: 'Tuesday', focus: 'Back & Biceps', exercises: [
                    { name: 'Deadlift', sets: 4, reps: '6', restSec: 180, notes: '' },
                    { name: 'Pull-Up', sets: 4, reps: '8', restSec: 90, notes: '' },
                    { name: 'Barbell Row', sets: 4, reps: '8', restSec: 90, notes: '' },
                    { name: 'Barbell Curl', sets: 3, reps: '10', restSec: 60, notes: '' },
                    { name: 'Incline DB Curl', sets: 3, reps: '12', restSec: 60, notes: '' },
                ]
            },
            {
                day: 'Wednesday', focus: 'Legs', exercises: [
                    { name: 'Barbell Squat', sets: 4, reps: '8', restSec: 120, notes: '' },
                    { name: 'Front Squat', sets: 3, reps: '8', restSec: 120, notes: '' },
                    { name: 'Leg Press', sets: 3, reps: '12', restSec: 75, notes: '' },
                    { name: 'Leg Curl', sets: 3, reps: '12', restSec: 60, notes: '' },
                    { name: 'Calf Raise', sets: 4, reps: '15', restSec: 45, notes: '' },
                ]
            },
            { day: 'Thursday', focus: 'Rest', exercises: [] },
            {
                day: 'Friday', focus: 'Shoulders & Arms', exercises: [
                    { name: 'Overhead Press', sets: 4, reps: '8', restSec: 90, notes: '' },
                    { name: 'Arnold Press', sets: 3, reps: '10', restSec: 75, notes: '' },
                    { name: 'Lateral Raise', sets: 4, reps: '12', restSec: 60, notes: '' },
                    { name: 'EZ Bar Curl', sets: 3, reps: '10', restSec: 60, notes: '' },
                    { name: 'Overhead Tricep Extension', sets: 3, reps: '12', restSec: 60, notes: '' },
                ]
            },
            {
                day: 'Saturday', focus: 'Full Body', exercises: [
                    { name: 'Trap Bar Deadlift', sets: 3, reps: '8', restSec: 120, notes: '' },
                    { name: 'Incline Bench Press', sets: 3, reps: '10', restSec: 90, notes: '' },
                    { name: 'Dumbbell Row', sets: 3, reps: '10 each', restSec: 75, notes: '' },
                    { name: 'Plank', sets: 3, reps: '45s', restSec: 45, notes: '' },
                ]
            },
            { day: 'Sunday', focus: 'Rest', exercises: [] },
        ],
        advanced: [
            {
                day: 'Monday', focus: 'Chest & Triceps', exercises: [
                    { name: 'Flat Barbell Bench', sets: 5, reps: '5', restSec: 180, notes: 'Heavy' },
                    { name: 'Incline DB Press', sets: 4, reps: '8', restSec: 90, notes: '' },
                    { name: 'Weighted Dips', sets: 4, reps: '8', restSec: 90, notes: '' },
                    { name: 'Cable Fly', sets: 3, reps: '12', restSec: 60, notes: '' },
                    { name: 'Skull Crusher', sets: 4, reps: '10', restSec: 75, notes: '' },
                ]
            },
            {
                day: 'Tuesday', focus: 'Back & Biceps', exercises: [
                    { name: 'Barbell Row', sets: 5, reps: '5', restSec: 180, notes: 'Heavy' },
                    { name: 'Weighted Pull-Up', sets: 4, reps: '6', restSec: 120, notes: '' },
                    { name: 'T-Bar Row', sets: 4, reps: '8', restSec: 90, notes: '' },
                    { name: 'Cable Row', sets: 3, reps: '12', restSec: 60, notes: '' },
                    { name: 'Preacher Curl', sets: 3, reps: '10', restSec: 60, notes: '' },
                ]
            },
            {
                day: 'Wednesday', focus: 'Legs (Quad focus)', exercises: [
                    { name: 'Barbell Squat', sets: 5, reps: '5', restSec: 180, notes: 'Heavy' },
                    { name: 'Front Squat', sets: 4, reps: '6', restSec: 120, notes: '' },
                    { name: 'Bulgarian Split Squat', sets: 3, reps: '10 each', restSec: 90, notes: '' },
                    { name: 'Leg Extension', sets: 3, reps: '12', restSec: 60, notes: '' },
                    { name: 'Standing Calf Raise', sets: 5, reps: '12', restSec: 45, notes: '' },
                ]
            },
            {
                day: 'Thursday', focus: 'Shoulders & Arms', exercises: [
                    { name: 'Overhead Press', sets: 5, reps: '5', restSec: 180, notes: 'Heavy' },
                    { name: 'Arnold Press', sets: 4, reps: '8', restSec: 90, notes: '' },
                    { name: 'Lateral Raise', sets: 4, reps: '15', restSec: 45, notes: '' },
                    { name: 'Barbell Curl', sets: 4, reps: '8', restSec: 75, notes: '' },
                    { name: 'Close-Grip Bench', sets: 4, reps: '8', restSec: 75, notes: '' },
                ]
            },
            {
                day: 'Friday', focus: 'Legs (Hamstring focus)', exercises: [
                    { name: 'Deadlift', sets: 5, reps: '5', restSec: 180, notes: 'Heavy' },
                    { name: 'Romanian Deadlift', sets: 4, reps: '8', restSec: 90, notes: '' },
                    { name: 'Glute-Ham Raise', sets: 3, reps: '10', restSec: 75, notes: '' },
                    { name: 'Walking Lunges', sets: 3, reps: '12 each', restSec: 75, notes: '' },
                    { name: 'Seated Calf Raise', sets: 4, reps: '15', restSec: 45, notes: '' },
                ]
            },
            {
                day: 'Saturday', focus: 'Weak Point Day', exercises: [
                    { name: 'Incline Press', sets: 4, reps: '8', restSec: 90, notes: 'Pick weak areas' },
                    { name: 'Chin-Up', sets: 4, reps: '8', restSec: 90, notes: '' },
                    { name: 'Dumbbell Row', sets: 3, reps: '10', restSec: 75, notes: '' },
                    { name: 'Abs Circuit', sets: 3, reps: '15', restSec: 45, notes: '' },
                ]
            },
            { day: 'Sunday', focus: 'Rest', exercises: [] },
        ],
    },
};

// Fallback: use appropriate templates for other goals
TEMPLATES.maintain = TEMPLATES.lose_weight;
TEMPLATES.improve_endurance = TEMPLATES.lose_weight;
TEMPLATES.body_recomposition = TEMPLATES.build_muscle;

// Form guidance notes — auto-populated for exercises with empty notes
const FORM_TIPS = {
    'Goblet Squat': 'Keep chest up, push knees out. Weight at chest height.',
    'Dumbbell Bench Press': 'Retract shoulder blades. Lower to chest, press up explosively.',
    'Lat Pulldown': 'Pull to upper chest, squeeze shoulder blades together. Avoid leaning too far back.',
    'Plank': 'Keep body in a straight line. Engage core, don\'t let hips sag.',
    'Jump Rope': 'Stay on balls of feet. Keep elbows close to body.',
    'Romanian Deadlift': 'Hinge at hips, slight knee bend. Keep bar close to legs, feel hamstring stretch.',
    'Shoulder Press': 'Press overhead, fully extend arms. Core tight, don\'t arch back excessively.',
    'Seated Row': 'Pull to lower chest. Squeeze shoulder blades, control the negative.',
    'Bicycle Crunch': 'Opposite elbow to knee. Keep lower back pressed to floor.',
    'Leg Press': 'Feet shoulder-width apart. Don\'t lock knees at the top.',
    'Leg Raises': 'Keep lower back flat. Slow controlled movement up and down.',
    'Burpees': 'Full extension at the top. Chest to ground at the bottom.',
    'Barbell Bench Press': 'Grip slightly wider than shoulders. Touch chest, drive feet into floor.',
    'Overhead Press': 'Brace core, press straight up. Move head forward as bar clears.',
    'Deadlift': 'Neutral spine, push through heels. Bar stays close to body throughout.',
    'Barbell Row': 'Hinge 45°, pull to lower chest. Don\'t use momentum.',
    'Face Pull': 'Pull to face level, externally rotate hands at end. Light weight, high control.',
    'Barbell Curl': 'Keep elbows pinned to sides. Full range of motion, no swinging.',
    'Barbell Squat': 'Break at hips and knees simultaneously. Depth to parallel or below.',
    'Walking Lunges': 'Knee tracks over toes. Upright torso, controlled steps.',
    'Leg Curl': 'Squeeze hamstrings at peak contraction. Slow eccentric.',
    'Calf Raise': 'Full stretch at bottom, pause at top. Control the negative.',
    'Pull-up': 'Dead hang start, pull chin over bar. Avoid kipping.',
    'Incline Barbell Press': 'Bench at 30-45°. Lower to upper chest, press up and slightly back.',
    'Dumbbell Row': 'Support on bench. Pull to hip, squeeze lat at the top.',
    'Lateral Raise': 'Slight elbow bend, raise to shoulder height. Don\'t swing.',
    'Hack Squat': 'Feet shoulder-width, mid-platform. Full depth, controlled ascent.',
    'Leg Extension': 'Squeeze quads at the top. Slow controlled movement.',
    'Bulgarian Split Squat': 'Rear foot on bench. Keep torso upright, front knee over toe.',
    'Hip Thrust': 'Upper back on bench, drive hips up. Squeeze glutes at the top.',
    'Mountain Climbers': 'Maintain plank position. Drive knees to chest rapidly.',
};

function generate(goal, experience) {
    const g = TEMPLATES[goal] || TEMPLATES.lose_weight;
    const plan = g[experience] || g.beginner;
    const cloned = JSON.parse(JSON.stringify(plan)); // deep clone

    // Auto-populate form guidance notes
    cloned.forEach(day => {
        day.exercises.forEach(ex => {
            if (!ex.notes && FORM_TIPS[ex.name]) {
                ex.notes = FORM_TIPS[ex.name];
            }
        });
    });

    return cloned;
}

module.exports = { generate };
