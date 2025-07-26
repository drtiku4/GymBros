import express from "express";
import { getWorkoutPlan, updateWorkoutPlan, clearWorkoutPlan } from "../controllers/workoutPlanController.js";

const router = express.Router();

router.get("/", getWorkoutPlan);
router.put("/", updateWorkoutPlan);
router.delete("/", clearWorkoutPlan);

export default router;
