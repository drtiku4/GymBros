import SelectedExercise from "../models/SelectedExercise.js";

export const getSelectedExercises = async (req, res) => {
  const { userId } = req.params;

  try {
    let data = await SelectedExercise.findOne({ userId });
    if (!data) {
      return res.json({ exercises: [] });
    }
    res.json(data.exercises);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addSelectedExercise = async (req, res) => {
  const { userId } = req.params;
  const exercise = req.body;

  try {
    let userSelection = await SelectedExercise.findOne({ userId });
    if (!userSelection) {
      userSelection = new SelectedExercise({ userId, exercises: [exercise] });
    } else {
      userSelection.exercises.push(exercise);
    }
    await userSelection.save();
    res.json(userSelection.exercises);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const removeSelectedExercise = async (req, res) => {
  const { userId, name } = req.params;

  try {
    let userSelection = await SelectedExercise.findOne({ userId });
    if (!userSelection) return res.status(404).json({ error: "User not found" });

    userSelection.exercises = userSelection.exercises.filter(
      (ex) => ex.name !== name
    );
    await userSelection.save();
    res.json(userSelection.exercises);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
