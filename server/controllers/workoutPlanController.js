let workoutPlan = {}; 

export const getWorkoutPlan = (req, res) => {
  res.json(workoutPlan);
};

export const updateWorkoutPlan = (req, res) => {
  const { plan } = req.body;
  if (!plan || typeof plan !== "object") {
    return res.status(400).json({ message: "Invalid plan data" });
  }
  workoutPlan = plan;
  res.json({ message: "Workout plan updated", workoutPlan });
};

export const clearWorkoutPlan = (req, res) => {
  workoutPlan = {};
  res.json({ message: "Workout plan cleared" });
};
