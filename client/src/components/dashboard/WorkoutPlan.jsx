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
  const [plan, setPlan] = useState(() => {
    const saved = localStorage.getItem("workoutPlan");
    return saved ? JSON.parse(saved) : {};
  });
  const [selectedDay, setSelectedDay] = useState("Monday");

  const [selectedExercises, setSelectedExercises] = useState(() => {
    const saved = localStorage.getItem("selectedExercises");
    return saved ? JSON.parse(saved) : [];
  });

 const handleAddToPlan = () => {
  if (!Array.isArray(selectedExercises) || selectedExercises.length === 0) {
    alert("Please select exercises on the Exercises page first.");
    return;
  }

  const dayExercises = plan[selectedDay] || [];

  const newExercises = selectedExercises.filter(
    (ex) => !dayExercises.some((dEx) => (dEx.id || dEx.name) === (ex.id || ex.name))
  );

  const updatedPlan = {
    ...plan,
    [selectedDay]: [...dayExercises, ...newExercises],
  };

  setPlan(updatedPlan);

  localStorage.setItem("workoutPlan", JSON.stringify(updatedPlan));

  alert(`Added ${newExercises.length} exercises to ${selectedDay}`);
};


  useEffect(() => {
    const handleStorage = () => {
      const saved = localStorage.getItem("selectedExercises");
      setSelectedExercises(saved ? JSON.parse(saved) : []);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const getImageSrc = (gifUrl) => {
    if (!gifUrl) return "/images/gifs/placeholder.gif";
    return gifUrl.startsWith("http") ? gifUrl : `/images/gifs/${gifUrl}`;
  };
  function resetStorage () {    
      const updatedPlan = { ...plan, [selectedDay]: [] };
  setPlan(updatedPlan);
  localStorage.setItem("workoutPlan", JSON.stringify(updatedPlan));
  alert(`${selectedDay}'s workout has been reset.`);


  }
  return (
    <div className="workout-plan-container">
      <h2>Customize Your Weekly Workout Plan</h2>

      <div className="controls">
        <label>
          Choose Day:
          <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)}>
            {days.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </label>

        <button onClick={handleAddToPlan}>Add Selected Exercises to Plan</button>
        <button onClick={resetStorage}>Click here to reset Workout Plan</button>
      </div>

      <div className="weekly-plan">
        {days.map((day) => (
          <div key={day} className="day-card">
            <h3>{day}</h3>
            {plan[day] && plan[day].length > 0 ? (
              <ul className="exercise-list">
                {plan[day].map((ex) => (
                  <li key={ex.id || ex.name} className="exercise-card">
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

                    <p><strong>Muscles:</strong> {(ex.targetMuscles || []).join(", ")}</p>
                    <p><strong>Equipment:</strong> {Array.isArray(ex.equipments) ? ex.equipments.join(", ") : ex.equipments}</p>
                    <p><strong>Difficulty:</strong> {ex.difficulty}</p>

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