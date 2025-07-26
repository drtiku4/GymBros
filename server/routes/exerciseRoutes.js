import express from 'express';
import { getAllExercises } from '../controllers/exercisesController.js';

const router = express.Router();

router.get('/', getAllExercises); 

export default router;