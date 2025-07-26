
import selectedExercises from "../data/selectedExercises.js";

export const getSelectedExercises = (req, res) => {
  res.json(selectedExercises);
};

export const addSelectedExercise = (req, res) => {
  const newExercise = req.body;

  if (!newExercise || !newExercise.name) {
    return res.status(400).json({ message: "Invalid exercise data" });
  }

  selectedExercises.push(newExercise);
  res.status(201).json({ message: "Exercise added", exercise: newExercise });
};

export const deleteSelectedExercise = (req, res) => {
  const { name } = req.params;

  const index = selectedExercises.findIndex(ex => ex.name === name);
  if (index !== -1) {
    selectedExercises.splice(index, 1);
    return res.json({ message: "Exercise removed" });
  }

  res.status(404).json({ message: "Exercise not found" });
};
