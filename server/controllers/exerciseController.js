import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'exercises.json');
let allExercises = [];

try {
  const raw = fs.readFileSync(filePath, 'utf-8');
  allExercises = JSON.parse(raw);
} catch (err) {
  console.error('❌ Failed to load exercises:', err.message);
}
export const getAllExercises = (req, res) => {
  if (!allExercises.length) {
    return res.status(500).json({ error: 'No exercise data available' });
  }

  res.json(allExercises)
};