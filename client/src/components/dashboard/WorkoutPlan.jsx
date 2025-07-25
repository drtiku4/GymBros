import { useState, useEffect } from "react";
import "./WorkoutPlan.css";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function WorkoutPlan() {
  const [plan, setPlan] = useState({});
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [selectedExercises, setSelectedExercises] = useState([]);

  useEffect(() => {
    const savedExercises = JSON.parse(
      localStorage.getItem("selectedWorkoutPlan")
    ) || [];
    setSelectedExercises(savedExercises);
  }, []);

  const handleAddToPlan = () => {
    if (selectedExercises.length === 0) return;
    setPlan((prev) => ({
      ...prev,
      [selectedDay]: selectedExercises,
    }));
  };

  const getImageSrc = (gifUrl) => {
    if (!gifUrl) return "/images/gifs/placeholder.gif";
    return gifUrl.startsWith("http")
      ? gifUrl
      : `/images/gifs/${gifUrl}`;
  };

  return (
    <div className="workout-plan-container">
      <h2>Customize Your Weekly Workout Plan</h2>

      <div className="controls">
        <label>
          Choose Day:
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
          >
            {days.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </label>

        <button onClick={handleAddToPlan}>
          Add Selected Exercises to Plan
        </button>
      </div>

      <div className="weekly-plan">
        {days.map((day) => (
          <div key={day} className="day-card">
            <h3>{day}</h3>
            {plan[day] && plan[day].length > 0 ? (
              <ul className="exercise-list">
                {plan[day].map((ex, idx) => (
                  <li key={idx} className="exercise-card">
                    <div className="exercise-title">
                      <strong>{ex.name}</strong>
                    </div>

                    <img
                      src={getImageSrc(ex.gifUrl)}
                      alt={ex.name}
                      className="exercise-gif"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images/gifs/placeholder.gif";
                      }}
                    />

                    <p>
                      <strong>Muscles:</strong>{" "}
                      {(ex.targetMuscles || []).join(", ")}
                    </p>
                    <p>
                      <strong>Equipment:</strong> {ex.equipments}
                    </p>
                    <p>
                      <strong>Difficulty:</strong> {ex.difficulty}
                    </p>

                    {ex.instructions && ex.instructions.length > 0 && (
                      <details>
                        <summary>Instructions</summary>
                        <ol>
                          {ex.instructions.map((step, i) => (
                            <li key={i}>{step}</li>
                          ))}
                        </ol>
                      </details>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No workout assigned</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
