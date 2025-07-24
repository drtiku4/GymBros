import { useEffect, useState } from 'react';
import './Exercises.css';

export default function Exercises() {
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [selectedMuscle, setSelectedMuscle] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/exercises')
      .then(res => res.json())
      .then(data => {
        setExercises(data);
        setFilteredExercises(data);
      })
      .catch(err => console.error('Error loading exercises:', err));
  }, []);

  useEffect(() => {
    const filtered = exercises.filter(ex => {
      return (
        (!selectedMuscle || (ex.targetMuscles || []).includes(selectedMuscle)) &&
        (!selectedEquipment || ex.equipment?.toLowerCase() === selectedEquipment.toLowerCase()) &&
        (!selectedDifficulty || ex.difficulty?.toLowerCase() === selectedDifficulty.toLowerCase())
      );
    });
    setFilteredExercises(filtered);
  }, [selectedMuscle, selectedEquipment, selectedDifficulty, exercises]);

  const uniqueMuscles = [...new Set(exercises.flatMap(e => e.targetMuscles || []))];
  const uniqueEquipment = [...new Set(exercises.map(e => e.equipments || ''))];
  const uniqueDifficulty = [...new Set(exercises.map(e => e.difficulty || ''))];

  return (
    <div className="exercise-page">
      <h1>All Exercises</h1>

      <div className="filters">
        <select value={selectedMuscle} onChange={e => setSelectedMuscle(e.target.value)}>
          <option value="">All Muscles</option>
          {uniqueMuscles.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <select value={selectedEquipment} onChange={e => setSelectedEquipment(e.target.value)}>
          <option value="">All Equipment</option>
          {uniqueEquipment.map(e => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>

        <select value={selectedDifficulty} onChange={e => setSelectedDifficulty(e.target.value)}>
          <option value="">All Difficulty</option>
          {uniqueDifficulty.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      <div className="exercise-grid">
        {filteredExercises.map((ex, idx) => (
          <div key={idx} className="exercise-card">
            <h3>{ex.name}</h3>
            <img
              src={ex.gifUrl?.startsWith('http') ? ex.gifUrl : `/images/gifs/${ex.gifUrl}`}
              alt={ex.name}
              onError={(e) => e.target.style.display = 'none'}
            />
            <p><strong>Muscles:</strong> {(ex.targetMuscles || []).join(', ')}</p>
            <p><strong>Equipment:</strong> {ex.equipment}</p>
            <p><strong>Difficulty:</strong> {ex.difficulty}</p>

            <details>
              <summary>Instructions</summary>
              <ol>
                {(ex.instructions || []).map((step, i) => <li key={i}>{step}</li>)}
              </ol>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
}
