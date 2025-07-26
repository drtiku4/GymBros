import express from "express";
import {
  getSelectedExercises,
  addSelectedExercise,
  removeSelectedExercise,
} from "../controllers/selectedExerciseController.js";

const router = express.Router();

router.get("/:userId", getSelectedExercises);
router.post("/:userId", addSelectedExercise);
router.delete("/:userId/:name", removeSelectedExercise);

export default router;
