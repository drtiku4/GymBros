let selectedExercises = [];

module.exports = {
  get: () => selectedExercises,
  set: (newData) => { selectedExercises = newData },
  clear: () => { selectedExercises = [] }
};