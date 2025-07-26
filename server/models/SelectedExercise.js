import mongoose from "mongoose";

const SelectedExerciseSchema = new mongoose.Schema({
  userId: {
    type: String, 
    required: true,
  },
  exercises: [
    {
      name: String,
      gifUrl: String,
      targetMuscles: [String],
      equipments: [String],
      difficulty: String,
      instructions: [String],
    },
  ],
});

export default mongoose.model("SelectedExercise", SelectedExerciseSchema);
