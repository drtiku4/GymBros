import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import exerciseRoutes from './routes/exerciseRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/exercises", exerciseRoutes );
app.use('/images', express.static(path.join(process.cwd(), 'images')));


app.use((req, res) => {
  res.status(404).send("Not Found")
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
