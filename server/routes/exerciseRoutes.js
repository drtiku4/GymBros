import express from "express";
import { getExercises } from "../controllers/exercisesController.js";

const router = express.Router();

router.get("/", getExercises);

export default router;
