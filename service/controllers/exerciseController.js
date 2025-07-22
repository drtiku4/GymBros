const axios = require("axios");

const apiKey = "496c3ec7e3msh3f1e5ee50883e75p1dea54jsn57e55fc3b08b";
const API_URL = "https://exercisedb.p.rapidapi.com/exercises";

exports.getExercises = async (req, res) => {
  const { muscle } = req.query;

  try {
    const response = await axios.get(API_URL, {
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
      },
    });

    let exercises = response.data;

    if (muscle) {
      exercises = exercises.filter((exercise) =>
        exercise.target.toLowerCase().includes(muscle.toLowerCase())
      );
    }

    res.json(exercises);
  } catch (err) {
    console.error("❌ Failed to fetch from RapidAPI:", err.message);
    res.status(500).json({ error: "Failed to fetch exercises from RapidAPI." });
  }
};
