const express = require("express");
const router = express.Router();
const Progress = require("../models/progress");

router.post("/", async (req, res) => {
  try {
    const progress = new Progress(req.body);
    const saved = await progress.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/:username", async (req, res) => {
  try {
    const logs = await Progress.find({ username: req.params.username });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Progress.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
