import { useState, useEffect } from "react";
import "./Dashboard.css";

const muscleMap = {
  chest: ["chest", "pectorals"],
  back: ["back", "lats", "trapezius", "rhomboids"],
  legs: ["legs", "quadriceps", "hamstrings", "calves", "glutes"],
  abs: ["abs", "abdominals"],
  shoulders: ["shoulders", "delts", "deltoids"],
  arms: ["arms", "biceps", "triceps", "forearms"],
};

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function filterExercisesByMuscles(exercises, targetMuscles) {
  return exercises.filter((ex) =>
    (ex.targetMuscles || []).some((tm) =>
      targetMuscles.includes(tm.toLowerCase())
    )
  );
}

function splitRoutine(trainingStyle, exercises, userProgress, weakMuscle) {
  const routineByDay = {};

  const prioritizeWeakMuscle = (exerciseList) => {
    const weakTargets = muscleMap[weakMuscle] || [];
    return [
      ...exerciseList.filter((ex) =>
        (ex.targetMuscles || []).some((tm) =>
          weakTargets.includes(tm.toLowerCase())
        )
      ),
      ...exerciseList,
    ];
  };

  if (trainingStyle === "ppl") {
    const split = {
      Monday: "push",
      Tuesday: "pull",
      Wednesday: "legs",
      Thursday: "push",
      Friday: "pull",
      Saturday: "legs",
      Sunday: "rest",
    };

    for (const [day, type] of Object.entries(split)) {
      if (type === "rest") {
        routineByDay[day] = [];
        continue;
      }

       let targetGroups = [];
      if (type === "push") targetGroups = ["chest", "shoulders", "triceps"];
      if (type === "pull") targetGroups = ["back", "biceps"];
      if (type === "legs") targetGroups = ["legs", "glutes", "calves"];

      const weakInThisSplit = targetGroups.includes(weakMuscle);
      const weakTargets = muscleMap[weakMuscle] || [];

      const weakExercises = weakInThisSplit
        ? filterExercisesByMuscles(exercises, weakTargets).sort(() => 0.5 - Math.random()).slice(0, 4)
        : [];

      // Other target groups (excluding weak one)
      const secondaryGroups = targetGroups.filter((g) => g !== weakMuscle);
      const secondaryTargets = secondaryGroups.flatMap((g) => muscleMap[g] || []);
      const secondaryExercises = filterExercisesByMuscles(exercises, secondaryTargets)
        .sort(() => 0.5 - Math.random())
        .slice(0, weakInThisSplit ? 3 : 6);

      const dayExercises = [...weakExercises, ...secondaryExercises];
      routineByDay[day] = dayExercises.slice(0, 7);
    }
  } else if (trainingStyle === "fullbody") {
    const activeDays = ["Monday", "Wednesday", "Friday"];
    const allMuscleGroups = [
      "chest",
      "back",
      "legs",
      "abs",
      "arms",
      "shoulders",
    ];

    activeDays.forEach((day) => {
      let dayExercises = [];

      // Add 1 exercise for each major group
      allMuscleGroups.forEach((group) => {
        const muscleTargets = muscleMap[group];
        const groupExercises = filterExercisesByMuscles(
          exercises,
          muscleTargets
        );
        if (groupExercises.length > 0) {
          const random =
            groupExercises[Math.floor(Math.random() * groupExercises.length)];
          dayExercises.push(random);
        }
      });

      // Add 2–3 more exercises from weak muscle group
      const weakTargets = muscleMap[weakMuscle] || [];
      const weakExercises = filterExercisesByMuscles(exercises, weakTargets);
      const additionalWeak = [...weakExercises]
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      // Ensure no duplicates
      const uniqueIds = new Set(
        dayExercises.map((ex) => ex.id || ex.exerciseId)
      );
      additionalWeak.forEach((ex) => {
        const id = ex.id || ex.exerciseId;
        if (!uniqueIds.has(id)) {
          dayExercises.push(ex);
          uniqueIds.add(id);
        }
      });

      routineByDay[day] = dayExercises.slice(0, 8); 
    });

    daysOfWeek.forEach((day) => {
      if (!activeDays.includes(day)) routineByDay[day] = [];
    });
  } else if (trainingStyle === "split") {
    const muscleDays = ["chest", "back", "legs", "arms", "shoulders", "abs"];
    muscleDays.forEach((muscle, idx) => {
      const day = daysOfWeek[idx];
      let targets = muscleMap[muscle] || [];
      let filtered = filterExercisesByMuscles(exercises, targets);

      if (muscle === weakMuscle) {
        filtered = prioritizeWeakMuscle(filtered);
      }

      const exerciseCount = muscle === "abs" ? 3 : 6;
      routineByDay[day] = filtered.slice(0, exerciseCount);
    });
    routineByDay["Sunday"] = [];
  }

  return routineByDay;
}

export default function Dashboard({ username }) {
  const [routineByDay, setRoutineByDay] = useState({});
  const [trainingStyle, setTrainingStyle] = useState("ppl");
  const [weakMuscle, setWeakMuscle] = useState("chest");

  const dummyProgress = {
    chest: 3,
    back: 6,
    legs: 2,
    abs: 4,
    shoulders: 7,
    arms: 5,
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/exercises")
      .then((res) => res.json())
      .then((data) => {
        const split = splitRoutine(
          trainingStyle,
          data,
          dummyProgress,
          weakMuscle
        );
        setRoutineByDay(split);
      })
      .catch((err) => console.error("Error fetching exercises:", err));
  }, [trainingStyle, weakMuscle]);

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h3>Routine</h3>
        </div>

        <div className="style-selector">
          <h1>Welcome, {username}</h1>
          <h3>Please select your routine type</h3>
          <label>Select training style:</label>
          <select
            value={trainingStyle}
            onChange={(e) => setTrainingStyle(e.target.value)}
          >
            <option value="ppl">Push Pull Legs</option>
            <option value="fullbody">Full Body</option>
            <option value="split">Split</option>
          </select>

          <label style={{ marginTop: "10px" }}>
            Select your weak muscle group:
          </label>
          <select
            value={weakMuscle}
            onChange={(e) => setWeakMuscle(e.target.value)}
          >
            {Object.keys(muscleMap).map((muscle) => (
              <option key={muscle} value={muscle}>
                {muscle}
              </option>
            ))}
          </select>
        </div>

        <div className="days-list">
          {Object.entries(routineByDay).map(([day, exercises]) => (
            <details key={day} className="day-dropdown">
              <summary className="day-button">{day}</summary>
              <div className="dropdown-content">
                {exercises.length === 0 ? (
                  <p className="rest-day">Rest day</p>
                ) : (
                  <ul className="exercise-list">
                    {exercises.map((ex, i) => (
                      <li
                        key={ex.id || ex.exerciseId || i}
                        className="exercise-card"
                      >
                        <div className="exercise-header">
                          <div className="exercise-title">
                            <strong>{ex.name}</strong>
                            {ex.targetMuscles?.length > 0 && (
                              <span className="muscle-tags">
                                {ex.targetMuscles.map((muscle, i) => (
                                  <span key={i} className="muscle-tag">
                                    {muscle}
                                  </span>
                                ))}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="exercise-meta">Sets: 4 | Reps: 10</div>

                        <details>
                          <summary>Instructions</summary>
                          <ol>
                            {(ex.instructions || []).map((step, idx) => (
                              <li key={idx}>{step}</li>
                            ))}
                          </ol>
                        </details>

                        {ex.gifUrl ? (
                          <div className="exercise-image-container">
                            <img
                              src={`/images/gifs/${ex.gifUrl}`}
                              alt={ex.name}
                              className="exercise-gif"
                            />
                          </div>
                        ) : (
                          <div className="no-image">No image available</div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </details>
          ))}
        </div>
      </aside>
    </div>
  );
}

