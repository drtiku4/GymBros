import { useState, useEffect } from 'react';
import "./Dashboard.css";

const muscleMap = {
  chest: ['chest', 'pectorals'],
  back: ['back', 'lats', 'trapezius', 'rhomboids'],
  legs: ['legs', 'quadriceps', 'hamstrings', 'calves', 'glutes'],
  abs: ['abs', 'abdominals'],
  shoulders: ['shoulders', 'delts', 'deltoids'],
  arms: ['arms', 'biceps', 'triceps', 'forearms'],
};

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function filterExercisesByMuscles(exercises, targetMuscles) {
  return exercises.filter(ex =>
    (ex.targetMuscles || []).some(tm =>
      targetMuscles.includes(tm.toLowerCase())
    )
  );
}

function splitRoutine(trainingStyle, exercises, userProgress) {
  const routineByDay = {};

  // Training split logic
  if (trainingStyle === 'ppl') {
    const split = {
      Monday: 'push',
      Tuesday: 'pull',
      Wednesday: 'legs',
      Thursday: 'push',
      Friday: 'pull',
      Saturday: 'legs',
      Sunday: 'rest'
    };

    for (const [day, type] of Object.entries(split)) {
      if (type === 'rest') {
        routineByDay[day] = [];
        continue;
      }

      let targetGroups = [];
      if (type === 'push') targetGroups = ['chest', 'shoulders', 'triceps'];
      if (type === 'pull') targetGroups = ['back', 'biceps'];
      if (type === 'legs') targetGroups = ['legs', 'glutes', 'calves'];

      const muscleTargets = targetGroups.flatMap(m => muscleMap[m] || []);
      const filtered = filterExercisesByMuscles(exercises, muscleTargets);
      routineByDay[day] = filtered.sort(() => 0.5 - Math.random()).slice(0, 5);
    }

  } else if (trainingStyle === 'fullbody') {
    const activeDays = ['Monday', 'Wednesday', 'Friday'];
    daysOfWeek.forEach(day => {
      if (activeDays.includes(day)) {
        const filtered = exercises.sort(() => 0.5 - Math.random()).slice(0, 6);
        routineByDay[day] = filtered;
      } else {
        routineByDay[day] = [];
      }
    });

  } else if (trainingStyle === 'split') {
    const muscleDays = ['chest', 'back', 'legs', 'arms', 'shoulders', 'abs'];
    muscleDays.forEach((muscle, idx) => {
      const day = daysOfWeek[idx];
      const targets = muscleMap[muscle] || [];
      const filtered = filterExercisesByMuscles(exercises, targets);
      routineByDay[day] = filtered.sort(() => 0.5 - Math.random()).slice(0, 4);
    });
    // Sunday = rest
    routineByDay['Sunday'] = [];
  }

  return routineByDay;
}

export default function Dashboard({ username, trainingStyle = 'ppl' }) {
  const [routineByDay, setRoutineByDay] = useState({});

  const dummyProgress = {
    chest: 3,
    back: 6,
    legs: 2,
    abs: 4,
    shoulders: 7,
    arms: 5,
  };

  useEffect(() => {
    fetch('http://localhost:5000/api/exercises')
      .then(res => res.json())
      .then(data => {
        const split = splitRoutine(trainingStyle, data, dummyProgress);
        setRoutineByDay(split);
      })
      .catch(err => console.error('Error fetching exercises:', err));
  }, [trainingStyle]);

  return (
    <div className="dashboard-container">
      <h1>Welcome, {username}</h1>
      <h2>Your Weekly Routine ({trainingStyle.toUpperCase()})</h2>

      {Object.entries(routineByDay).map(([day, exercises]) => (
        <div key={day} className="day-section">
          <h3>{day}</h3>
          {exercises.length === 0 ? (
            <p>Rest day</p>
          ) : (
            <ul className="exercise-list">
              {exercises.map((ex, i) => (
                <li key={ex.id || ex.exerciseId || i} className="exercise-card">
                  <strong>{ex.name}</strong> <em>{ex.targetMuscles}</em><br />
                  Sets: 4 | Reps: 10
                  <details>
                    <summary>Instructions</summary>
                    <ol>
                      {(ex.instructions || []).map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ol>
                  </details>
                  {ex.gifUrl && (
                    <img
                      src={ex.gifUrl}
                      alt={ex.name}
                      className="exercise-gif"
                    />
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
