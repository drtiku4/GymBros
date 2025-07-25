import { useState, useEffect } from "react";
import "./WorkoutPlan.css";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

export default function WorkoutPlan() {
  const [plan, setPlan] = useState({});
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [selectedExercises, setSelectedExercises] = useState([]);

  // Load exercises from localStorage (shared from Exercises.jsx)
  useEffect(() => {
    const savedExercises = JSON.parse(localStorage.getItem("selectedWorkoutPlan")) || [];
    setSelectedExercises(savedExercises);
  }, []);

  const handleAddToPlan = () => {
    if (selectedExercises.length === 0) return;
    setPlan(prev => ({
      ...prev,
      [selectedDay]: selectedExercises
    }));
  };

  return (
    <div className="workout-plan-container">
      <h2>Customize Your Weekly Workout Plan</h2>

      <div className="controls">
        <label>
          Choose Day:
          <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)}>
            {days.map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </label>

        <button onClick={handleAddToPlan}>Add Selected Exercises to Plan</button>
      </div>

      <div className="weekly-plan">
        {days.map(day => (
          <div key={day} className="day-card">
            <h3>{day}</h3>
            {plan[day] && plan[day].length > 0 ? (
              <ul>
                {plan[day].map((ex, idx) => (
                  <li key={idx}>{ex.name}</li>
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
