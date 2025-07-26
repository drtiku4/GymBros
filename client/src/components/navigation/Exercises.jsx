import { useEffect, useState } from "react";
import "./Exercises.css";

export default function Exercises() {
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [selectedMuscle, setSelectedMuscle] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedExercises, setSelectedExercises] = useState(() => {
    // Load selected exercises from localStorage initially
    const saved = localStorage.getItem("selectedExercises");
    return saved ? JSON.parse(saved) : [];
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load exercises from backend (or fake API)
  useEffect(() => {
    fetch("http://localhost:5000/api/exercises")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setExercises(data);
          setFilteredExercises(data);
        } else {
          setExercises([]);
          setFilteredExercises([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading exercises:", err);
        setError("Failed to load exercises.");
        setLoading(false);
      });
  }, []);

  // Filtering logic
  useEffect(() => {
    const filtered = exercises.filter((ex) => {
      const matchesMuscle =
        !selectedMuscle || (ex.targetMuscles || []).includes(selectedMuscle);

      const matchesEquipment =
        !selectedEquipment ||
        ((Array.isArray(ex.equipments) &&
          ex.equipments.some(
            (eq) => eq.toLowerCase() === selectedEquipment.toLowerCase()
          )) ||
          (typeof ex.equipments === "string" &&
            ex.equipments.toLowerCase() === selectedEquipment.toLowerCase()));

      const matchesDifficulty =
        !selectedDifficulty ||
        ex.difficulty?.toLowerCase() === selectedDifficulty.toLowerCase();

      const matchesSearch =
        !searchTerm ||
        ex.name.toLowerCase().includes(searchTerm.toLowerCase());

      return (
        matchesMuscle && matchesEquipment && matchesDifficulty && matchesSearch
      );
    });

    setFilteredExercises(filtered);
  }, [
    selectedMuscle,
    selectedEquipment,
    selectedDifficulty,
    searchTerm,
    exercises,
  ]);

  // Toggle exercise selection
  const toggleExercise = (exercise) => {
    const exerciseId = exercise.id || exercise.name;
    let updated;

    if (selectedExercises.some((e) => (e.id || e.name) === exerciseId)) {
      updated = selectedExercises.filter((e) => (e.id || e.name) !== exerciseId);
    } else {
      updated = [...selectedExercises, exercise];
    }

    setSelectedExercises(updated);

    // Save to localStorage
    localStorage.setItem("selectedExercises", JSON.stringify(updated));
  };

  // Unique filter options
  const uniqueMuscles = [...new Set(exercises.flatMap((e) => e.targetMuscles || []))];
  const uniqueEquipment = [
    ...new Set(
      exercises.flatMap((e) => {
        if (Array.isArray(e.equipments)) return e.equipments;
        if (typeof e.equipments === "string") return [e.equipments];
        return [];
      })
    ),
  ];
  const uniqueDifficulty = [...new Set(exercises.map((e) => e.difficulty || ""))];

  if (loading) return <p>Loading exercises...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="exercise-page">
      <h1>Exercises</h1>

      <div className="instructions">
        <p>1. Please select the exercises you would like to add to your personalized routine.</p>
        <p>2. On the Workout Plan Page, click the day you would like to add the exercises to.</p>
        <p>3. Click on <strong>"Add Selected Exercises to Plan"</strong>.</p>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search exercises..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />

        <select value={selectedMuscle} onChange={(e) => setSelectedMuscle(e.target.value)}>
          <option value="">All Muscles</option>
          {uniqueMuscles.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <select
          value={selectedEquipment}
          onChange={(e) => setSelectedEquipment(e.target.value)}
        >
          <option value="">All Equipment</option>
          {uniqueEquipment.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>

        <select
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
        >
          <option value="">All Difficulty</option>
          {uniqueDifficulty.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <div className="exercise-grid">
        {filteredExercises.length > 0 ? (
          filteredExercises.map((ex) => {
            const isChecked = selectedExercises.some(
              (e) => (e.id || e.name) === (ex.id || ex.name)
            );
            return (
              <div key={ex.id || ex.name} className="exercise-card">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleExercise(ex)}
                  />
                  <span>{ex.name}</span>
                </label>

                <img
                  src={
                    ex.gifUrl?.startsWith("http")
                      ? ex.gifUrl
                      : `/images/gifs/${ex.gifUrl || "placeholder.gif"}`
                  }
                  alt={ex.name}
                  className="exercise-gif"
                  onError={(e) => (e.target.src = "/images/gifs/placeholder.gif")}
                />

                <p><strong>Muscles:</strong> {(ex.targetMuscles || []).join(", ")}</p>
                <p><strong>Equipment:</strong> {Array.isArray(ex.equipments) ? ex.equipments.join(", ") : ex.equipments}</p>
                <p><strong>Difficulty:</strong> {ex.difficulty}</p>

                {Array.isArray(ex.instructions) && ex.instructions.length > 0 && (
                  <details>
                    <summary>Instructions</summary>
                    <ol>{ex.instructions.map((step, i) => <li key={i}>{step}</li>)}</ol>
                  </details>
                )}
              </div>
            );
          })
        ) : (
          <p>No exercises match your filters.</p>
        )}
      </div>

      {selectedExercises.length > 0 && (
        <div className="selected-summary" style={{ marginTop: "30px" }}>
          <h3>Selected Exercises:</h3>
          <ul>{selectedExercises.map((ex) => <li key={ex.id || ex.name}>{ex.name}</li>)}</ul>
        </div>
      )}
    </div>
  );
}
