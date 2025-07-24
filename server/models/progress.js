const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  username: { type: String, required: true },
  exercise: { type: String, required: true },
  reps: Number,
  sets: Number,
  weight: Number,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Progress", progressSchema);
