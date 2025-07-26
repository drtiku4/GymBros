import mongoose from "mongoose";

const ExerciseSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  targetMuscles: [String],
  equipments: [String],
  difficulty: String,
  gifUrl: String,
  instructions: [String],
});

const Exercise = mongoose.model("Exercise", ExerciseSchema);
export default Exercise;
