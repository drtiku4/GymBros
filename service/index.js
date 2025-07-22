const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const exerciseRoutes = require("./routes/routes");
const progressRoutes = require("./routes/progressRoutes");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.use("/api/exercises", exerciseRoutes);
app.use("/api/progress", progressRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the GymBros API with RapidAPI!");
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
