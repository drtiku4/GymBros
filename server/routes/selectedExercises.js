const express = require('express');
const router = express.Router();
const controller = require('../controllers/exercisesController.js');

router.get('/', controller.getSelectedExercises);
router.put('/', controller.updateSelectedExercises);
router.delete('/', controller.clearSelectedExercises);

module.exports = router;
