import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import exercisesRoutes from "./routes/exercises.js";
import selectedExerciseRoutes from "./routes/selectedExercises.js";


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/gymbros", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/exercises", exercisesRoutes);
app.use("/api/selected-exercises", selectedExerciseRoutes);


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
