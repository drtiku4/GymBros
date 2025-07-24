import { useState, useEffect } from 'react';
import './Dashboard.css';

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
      routineByDay[day] = filtered.sort(() => 0.5 - Math.random()).slice(0, 6);
    }

  } else if (trainingStyle === 'fullbody') {
    const activeDays = ['Monday', 'Wednesday', 'Friday'];
    daysOfWeek.forEach(day => {
      if (activeDays.includes(day)) {
        const filtered = exercises.sort(() => 0.5 - Math.random()).slice(0, 7);
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
      const exerciseCount = muscle === 'abs' ? 3 : 6;
      routineByDay[day] = filtered.sort(() => 0.5 - Math.random()).slice(0, exerciseCount);
    });
    routineByDay['Sunday'] = [];
  }

  return routineByDay;
}

export default function Dashboard({ username }) {
  const [routineByDay, setRoutineByDay] = useState({});
  const [trainingStyle, setTrainingStyle] = useState('ppl');

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
    <div className="dashboard-layout">
      
      <aside className="sidebar">
        <div className="sidebar-header">
          <h3>Routine</h3>
        </div>

        <div className="style-selector">
          <h1>Welcome, {username}</h1>
          <h3>Please select your routine type</h3>
          <label>Select training style:</label>
          <select value={trainingStyle} onChange={(e) => setTrainingStyle(e.target.value)}>
            <option value="ppl">Push Pull Legs</option>
            <option value="fullbody">Full Body</option>
            <option value="split">Split</option>
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
                      <li key={ex.id || ex.exerciseId || i} className="exercise-card">
                        <div className="exercise-header">
                          <strong>{ex.name}</strong>
                          {ex.targetMuscles?.length > 0 && (
                            <em>{ex.targetMuscles.join(', ')}</em>
                          )}
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
