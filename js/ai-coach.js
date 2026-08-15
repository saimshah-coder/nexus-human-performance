/* =========================================================
   NEXUS AI COACH 2.0
   Client-side fitness recommendation engine
   No backend • No API • No external dependency
   ========================================================= */

(() => {
    "use strict";

    const STORAGE_KEY = "nexus_ai_coach_plan_v2";

    const EXERCISES = {
        chest: [
            { name: "Barbell Bench Press", equipment: ["gym"], level: 2, compound: true },
            { name: "Incline Dumbbell Press", equipment: ["gym"], level: 2, compound: true },
            { name: "Machine Chest Press", equipment: ["gym"], level: 1, compound: true },
            { name: "Push-Ups", equipment: ["bodyweight", "home"], level: 1, compound: true },
            { name: "Dumbbell Floor Press", equipment: ["dumbbell", "home"], level: 1, compound: true }
        ],

        back: [
            { name: "Lat Pulldown", equipment: ["gym"], level: 1, compound: true },
            { name: "Seated Cable Row", equipment: ["gym"], level: 1, compound: true },
            { name: "Pull-Ups", equipment: ["gym", "bodyweight"], level: 2, compound: true },
            { name: "One-Arm Dumbbell Row", equipment: ["dumbbell", "home"], level: 1, compound: true },
            { name: "Resistance Band Row", equipment: ["home", "bodyweight"], level: 1, compound: true }
        ],

        legs: [
            { name: "Barbell Back Squat", equipment: ["gym"], level: 2, compound: true },
            { name: "Leg Press", equipment: ["gym"], level: 1, compound: true },
            { name: "Romanian Deadlift", equipment: ["gym", "dumbbell"], level: 2, compound: true },
            { name: "Goblet Squat", equipment: ["dumbbell", "home"], level: 1, compound: true },
            { name: "Bulgarian Split Squat", equipment: ["dumbbell", "home", "bodyweight"], level: 2, compound: true },
            { name: "Bodyweight Squat", equipment: ["bodyweight", "home"], level: 1, compound: true }
        ],

        shoulders: [
            { name: "Overhead Press", equipment: ["gym"], level: 2, compound: true },
            { name: "Dumbbell Shoulder Press", equipment: ["dumbbell", "home"], level: 1, compound: true },
            { name: "Lateral Raise", equipment: ["gym", "dumbbell"], level: 1, compound: false },
            { name: "Pike Push-Up", equipment: ["bodyweight", "home"], level: 2, compound: true }
        ],

        arms: [
            { name: "Cable Triceps Pushdown", equipment: ["gym"], level: 1, compound: false },
            { name: "Dumbbell Curl", equipment: ["gym", "dumbbell", "home"], level: 1, compound: false },
            { name: "Hammer Curl", equipment: ["gym", "dumbbell", "home"], level: 1, compound: false },
            { name: "Bench Dips", equipment: ["bodyweight", "home"], level: 1, compound: true },
            { name: "Close-Grip Push-Ups", equipment: ["bodyweight", "home"], level: 1, compound: true }
        ],

        core: [
            { name: "Cable Crunch", equipment: ["gym"], level: 1, compound: false },
            { name: "Hanging Knee Raise", equipment: ["gym"], level: 2, compound: false },
            { name: "Plank", equipment: ["bodyweight", "home"], level: 1, compound: false },
            { name: "Dead Bug", equipment: ["bodyweight", "home"], level: 1, compound: false },
            { name: "Mountain Climbers", equipment: ["bodyweight", "home"], level: 1, compound: true }
        ]
    };

    const SPLITS = {
        2: [
            ["Full Body", ["chest", "back", "legs", "shoulders", "arms", "core"]],
            ["Full Body", ["legs", "back", "chest", "shoulders", "core", "arms"]]
        ],

        3: [
            ["Upper Body", ["chest", "back", "shoulders", "arms"]],
            ["Lower Body", ["legs", "core"]],
            ["Full Body", ["chest", "back", "legs", "shoulders", "arms", "core"]]
        ],

        4: [
            ["Upper A", ["chest", "shoulders", "arms"]],
            ["Lower A", ["legs", "core"]],
            ["Upper B", ["back", "shoulders", "arms"]],
            ["Lower B", ["legs", "core"]]
        ],

        5: [
            ["Chest + Triceps", ["chest", "arms"]],
            ["Back + Biceps", ["back", "arms"]],
            ["Legs", ["legs", "core"]],
            ["Shoulders + Core", ["shoulders", "core"]],
            ["Full Body", ["chest", "back", "legs", "shoulders"]]
        ],

        6: [
            ["Push", ["chest", "shoulders", "arms"]],
            ["Pull", ["back", "arms"]],
            ["Legs", ["legs", "core"]],
            ["Push", ["chest", "shoulders", "arms"]],
            ["Pull", ["back", "arms"]],
            ["Legs", ["legs", "core"]]
        ]
    };

    const GOAL_SETTINGS = {
        muscle: {
            label: "Muscle Gain",
            sets: 4,
            reps: "6–12",
            rest: "90–150 sec",
            intensity: "RPE 7–9",
            volume: "high"
        },

        strength: {
            label: "Strength",
            sets: 4,
            reps: "3–6",
            rest: "150–210 sec",
            intensity: "RPE 8–9",
            volume: "moderate"
        },

        fatloss: {
            label: "Fat Loss",
            sets: 3,
            reps: "8–15",
            rest: "45–90 sec",
            intensity: "RPE 7–8",
            volume: "moderate"
        },

        fitness: {
            label: "General Fitness",
            sets: 3,
            reps: "8–15",
            rest: "60–90 sec",
            intensity: "RPE 6–8",
            volume: "moderate"
        }
    };

    const LEVEL_SETTINGS = {
        beginner: {
            label: "Beginner",
            maxExercises: 4,
            multiplier: 0.75
        },

        intermediate: {
            label: "Intermediate",
            maxExercises: 5,
            multiplier: 1
        },

        advanced: {
            label: "Advanced",
            maxExercises: 6,
            multiplier: 1.15
        }
    };

    const state = {
        form: null,
        plan: null
    };

    const $ = (selector, root = document) => root.querySelector(selector);
    const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

    function randomId() {
        return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    }

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    function normalize(value) {
        return String(value || "").trim().toLowerCase();
    }

    function getEquipment(form) {
        const selected = form.equipment || [];

        if (selected.includes("gym")) {
            return ["gym", "dumbbell", "bodyweight", "home"];
        }

        if (selected.includes("dumbbell")) {
            return ["dumbbell", "bodyweight", "home"];
        }

        return ["home", "bodyweight"];
    }

    function exercisePool(muscle, form) {
        const equipment = getEquipment(form);

        return EXERCISES[muscle].filter(exercise =>
            exercise.equipment.some(item => equipment.includes(item))
        );
    }

    function chooseExercises(muscles, form, count) {
        const pool = [];

        muscles.forEach(muscle => {
            exercisePool(muscle, form).forEach(exercise => {
                pool.push({
                    ...exercise,
                    muscle
                });
            });
        });

        const levelRank = {
            beginner: 1,
            intermediate: 2,
            advanced: 3
        };

        const rank = levelRank[form.level] || 1;

        const compatible = pool.filter(exercise => exercise.level <= rank);

        const source = compatible.length ? compatible : pool;

        const selected = [];
        const used = new Set();

        source
            .sort((a, b) => Number(b.compound) - Number(a.compound))
            .forEach(exercise => {
                if (selected.length >= count) return;

                if (!used.has(exercise.name)) {
                    used.add(exercise.name);
                    selected.push(exercise);
                }
            });

        return selected;
    }

    function getExerciseCount(form, muscleCount) {
        const level = LEVEL_SETTINGS[form.level] || LEVEL_SETTINGS.beginner;

        const durationMap = {
            "30": 3,
            "45": 4,
            "60": 5,
            "75": 6
        };

        const durationCount = durationMap[form.duration] || 4;

        return clamp(
            Math.round((durationCount + level.multiplier + muscleCount) / 2),
            3,
            level.maxExercises
        );
    }

    function buildExercise(exercise, form, goal) {
        const settings = GOAL_SETTINGS[goal];

        let sets = settings.sets;

        if (form.level === "beginner") {
            sets = Math.max(2, sets - 1);
        }

        if (form.level === "advanced" && goal === "muscle") {
            sets += 1;
        }

        let reps = settings.reps;

        if (goal === "fatloss" && form.duration === "30") {
            reps = "10–15";
        }

        return {
            id: randomId(),
            name: exercise.name,
            muscle: exercise.muscle,
            sets,
            reps,
            rest: settings.rest,
            intensity: settings.intensity
        };
    }

    function buildDay(dayIndex, split, form) {
        const [name, muscles] = split;

        const count = getExerciseCount(form, muscles.length);

        const exercises = chooseExercises(muscles, form, count)
            .map(exercise =>
                buildExercise(exercise, form, form.goal)
            );

        return {
            day: dayIndex + 1,
            name,
            focus: muscles,
            exercises
        };
    }

    function getWeeklySchedule(form) {
        const days = Number(form.days);

        const split = SPLITS[days] || SPLITS[3];

        return split.map((day, index) =>
            buildDay(index, day, form)
        );
    }

    function buildWarmup(form) {
        const minutes = form.duration === "30" ? 5 : 8;

        return [
            `${minutes} min progressive warm-up`,
            "Dynamic mobility for the joints involved",
            "1–2 lighter preparation sets before the first compound movement"
        ];
    }

    function buildRecovery(form) {
        const recovery = [
            "Aim for 7–9 hours of sleep.",
            "Keep at least one genuine recovery day each week.",
            "Hydrate consistently throughout the day.",
            "Increase training load gradually instead of forcing jumps."
        ];

        if (form.goal === "fatloss") {
            recovery.push("Prioritize recovery so the calorie deficit does not destroy training quality.");
        }

        if (form.goal === "strength") {
            recovery.push("Use the longer rest periods and avoid turning heavy sets into conditioning work.");
        }

        if (form.level === "advanced") {
            recovery.push("Monitor fatigue closely and reduce volume when performance consistently drops.");
        }

        return recovery;
    }

    function buildProgression(form) {
        if (form.goal === "strength") {
            return "When every working set reaches the top of the prescribed range with clean technique, increase load slightly in the next session.";
        }

        if (form.goal === "muscle") {
            return "Use double progression: first add reps within the range, then increase load once all sets reach the upper end.";
        }

        if (form.goal === "fatloss") {
            return "Keep technique stable and progressively improve reps, load, or work density rather than chasing exhaustion.";
        }

        return "Progress one variable at a time: reps first, then load, then total training volume.";
    }

    function generatePlan(form) {
        const goal = GOAL_SETTINGS[form.goal] ? form.goal : "fitness";
        const level = LEVEL_SETTINGS[form.level] ? form.level : "beginner";

        const safeForm = {
            ...form,
            goal,
            level
        };

        const weeklyPlan = getWeeklySchedule(safeForm);

        return {
            id: randomId(),
            createdAt: new Date().toISOString(),

            profile: {
                goal,
                goalLabel: GOAL_SETTINGS[goal].label,
                level,
                levelLabel: LEVEL_SETTINGS[level].label,
                days: Number(safeForm.days),
                duration: Number(safeForm.duration),
                equipment: safeForm.equipment
            },

            title: `${GOAL_SETTINGS[goal].label} Protocol`,

            summary: `A ${safeForm.days}-day ${GOAL_SETTINGS[goal].label.toLowerCase()} program built for a ${LEVEL_SETTINGS[level].label.toLowerCase()} athlete with ${safeForm.duration}-minute sessions.`,

            weeklyPlan,

            warmup: buildWarmup(safeForm),

            recovery: buildRecovery(safeForm),

            progression: buildProgression(safeForm),

            disclaimer:
                "This plan is general fitness guidance, not medical advice. Stop if you experience unusual pain, dizziness, or other concerning symptoms and seek qualified professional guidance."
        };
    }

    function validate(form) {
        const errors = [];

        if (!form.goal || !GOAL_SETTINGS[form.goal]) {
            errors.push("Select your primary goal.");
        }

        if (!form.level || !LEVEL_SETTINGS[form.level]) {
            errors.push("Select your experience level.");
        }

        const days = Number(form.days);

        if (!Number.isInteger(days) || days < 2 || days > 6) {
            errors.push("Choose between 2 and 6 training days.");
        }

        const duration = Number(form.duration);

        if (![30, 45, 60, 75].includes(duration)) {
            errors.push("Choose a valid session duration.");
        }

        if (!Array.isArray(form.equipment) || form.equipment.length === 0) {
            errors.push("Select your available equipment.");
        }

        return errors;
    }

    function collectForm(formElement) {
        const data = new FormData(formElement);

        return {
            goal: normalize(data.get("goal")),
            level: normalize(data.get("level")),
            days: data.get("days"),
            duration: data.get("duration"),
            equipment: data.getAll("equipment")
                .map(normalize)
                .filter(Boolean)
        };
    }

    function savePlan(plan) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
            return true;
        } catch {
            return false;
        }
    }

    function loadPlan() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);

            if (!stored) return null;

            return JSON.parse(stored);
        } catch {
            return null;
        }
    }

    function showError(messages, container) {
        if (!container) return;

        container.hidden = false;

        container.innerHTML = `
            <div class="nexus-coach-error" role="alert">
                <strong>Coach needs a little more information.</strong>
                <ul>
                    ${messages.map(message => `<li>${escapeHTML(message)}</li>`).join("")}
                </ul>
            </div>
        `;
    }

    function escapeHTML(value) {
        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function renderPlan(plan, container) {
        if (!container || !plan) return;

        container.hidden = false;

        container.innerHTML = `
            <section class="coach-result-head">
                <div>
                    <span class="eyebrow">NEXUS / GENERATED PROTOCOL</span>
                    <h2>${escapeHTML(plan.title)}</h2>
                    <p>${escapeHTML(plan.summary)}</p>
                </div>

                <div class="coach-result-actions">
                    <button type="button" class="btn btn-primary" data-coach-save>
                        SAVE PLAN
                    </button>

                    <button type="button" class="btn btn-secondary" data-coach-print>
                        PRINT
                    </button>
                </div>
            </section>

            <div class="coach-profile-grid">
                <article class="coach-stat">
                    <span>GOAL</span>
                    <strong>${escapeHTML(plan.profile.goalLabel)}</strong>
                </article>

                <article class="coach-stat">
                    <span>LEVEL</span>
                    <strong>${escapeHTML(plan.profile.levelLabel)}</strong>
                </article>

                <article class="coach-stat">
                    <span>FREQUENCY</span>
                    <strong>${plan.profile.days} DAYS</strong>
                </article>

                <article class="coach-stat">
                    <span>SESSION</span>
                    <strong>${plan.profile.duration} MIN</strong>
                </article>
            </div>

            <div class="coach-week">
                ${plan.weeklyPlan.map(day => `
                    <article class="coach-day">
                        <header class="coach-day-header">
                            <div>
                                <span>DAY ${day.day}</span>
                                <h3>${escapeHTML(day.name)}</h3>
                            </div>

                            <span class="coach-focus">
                                ${day.focus.map(escapeHTML).join(" · ")}
                            </span>
                        </header>

                        <div class="coach-exercises">
                            ${day.exercises.map((exercise, index) => `
                                <div class="coach-exercise">
                                    <div class="coach-exercise-number">
                                        ${String(index + 1).padStart(2, "0")}
                                    </div>

                                    <div class="coach-exercise-main">
                                        <strong>${escapeHTML(exercise.name)}</strong>
                                        <span>${escapeHTML(exercise.muscle)}</span>
                                    </div>

                                    <div class="coach-exercise-meta">
                                        <b>${exercise.sets} × ${escapeHTML(exercise.reps)}</b>
                                        <span>${escapeHTML(exercise.rest)}</span>
                                    </div>
                                </div>
                            `).join("")}
                        </div>
                    </article>
                `).join("")}
            </div>

            <div class="coach-guidance-grid">
                <article class="coach-guidance">
                    <span class="eyebrow">WARM-UP</span>
                    <ul>
                        ${plan.warmup.map(item => `<li>${escapeHTML(item)}</li>`).join("")}
                    </ul>
                </article>

                <article class="coach-guidance">
                    <span class="eyebrow">RECOVERY</span>
                    <ul>
                        ${plan.recovery.map(item => `<li>${escapeHTML(item)}</li>`).join("")}
                    </ul>
                </article>

                <article class="coach-guidance coach-guidance-wide">
                    <span class="eyebrow">PROGRESSION ENGINE</span>
                    <p>${escapeHTML(plan.progression)}</p>
                </article>
            </div>

            <p class="coach-disclaimer">
                ${escapeHTML(plan.disclaimer)}
            </p>
        `;

        bindResultActions(container, plan);
    }

    function bindResultActions(container, plan) {
        const saveButton = $("[data-coach-save]", container);
        const printButton = $("[data-coach-print]", container);

        saveButton?.addEventListener("click", () => {
            const saved = savePlan(plan);

            saveButton.textContent = saved ? "PLAN SAVED ✓" : "SAVE FAILED";

            if (saved) {
                saveButton.classList.add("is-saved");
            }
        });

        printButton?.addEventListener("click", () => {
            window.print();
        });
    }

    function setLoading(button, loading) {
        if (!button) return;

        if (loading) {
            button.dataset.originalText = button.textContent;
            button.textContent = "BUILDING PROTOCOL...";
            button.disabled = true;
            button.setAttribute("aria-busy", "true");
        } else {
            button.textContent =
                button.dataset.originalText || "GENERATE MY PLAN";

            button.disabled = false;
            button.removeAttribute("aria-busy");
        }
    }

    function initCoach() {
        const form = $("#aiCoachForm");

        if (!form) return;

        const result = $("#aiCoachResult");
        const error = $("#aiCoachError");
        const submit = $("button[type='submit']", form);

        form.addEventListener("submit", event => {
            event.preventDefault();

            if (error) {
                error.hidden = true;
                error.innerHTML = "";
            }

            const data = collectForm(form);
            const errors = validate(data);

            if (errors.length) {
                showError(errors, error);
                return;
            }

            setLoading(submit, true);

            window.setTimeout(() => {
                try {
                    const plan = generatePlan(data);

                    state.form = data;
                    state.plan = plan;

                    renderPlan(plan, result);

                    result?.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                } finally {
                    setLoading(submit, false);
                }
            }, 650);
        });

        const savedPlan = loadPlan();

        if (savedPlan && result) {
            renderPlan(savedPlan, result);
        }
    }

    window.NexusAICoach = {
        generatePlan,
        validate,
        savePlan,
        loadPlan
    };

    document.addEventListener("DOMContentLoaded", initCoach);
})();