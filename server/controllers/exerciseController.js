import Exercise from "../models/Exercise.js";

// Get all exercises
export async function getExercises(req, res) {
  try {
    const exercises = await Exercise.find({});
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch exercises" });
  }
}

// Get exercise by ID
export async function getExerciseById(req, res) {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) return res.status(404).json({ error: "Exercise not found" });
    res.json(exercise);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch exercise" });
  }
}

// Create new exercise
export async function createExercise(req, res) {
  try {
    const newExercise = new Exercise(req.body);
    await newExercise.save();
    res.status(201).json(newExercise);
  } catch (error) {
    res.status(400).json({ error: "Failed to create exercise", details: error.message });
  }
}

// Update exercise by ID
export async function updateExercise(req, res) {
  try {
    const updatedExercise = await Exercise.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedExercise) return res.status(404).json({ error: "Exercise not found" });
    res.json(updatedExercise);
  } catch (error) {
    res.status(400).json({ error: "Failed to update exercise", details: error.message });
  }
}

// Delete exercise by ID
export async function deleteExercise(req, res) {
  try {
    const deletedExercise = await Exercise.findByIdAndDelete(req.params.id);
    if (!deletedExercise) return res.status(404).json({ error: "Exercise not found" });
    res.json({ message: "Exercise deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete exercise" });
  }
}
