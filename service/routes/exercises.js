const express = require('express');
const router = express.Router();
const {
  getAllExercises,
  recommendExercises
} = require('../controllers/exerciseController');

router.get('/', getAllExercises);
router.get('/recommend', recommendExercises);

module.exports = router;
