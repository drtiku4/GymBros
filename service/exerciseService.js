require('dotenv').config();

const url = 'https://api.api-ninjas.com/v1/exercises';
const apiKey = process.env.API_KEY;

async function fetchExercises(muscle) {
  const response = await fetch(`${url}?muscle=${muscle}`, {
    headers: {
      'X-Api-Key': apiKey,
    },
  });

  if (!response.ok) {
    console.error("❌ Failed to fetch from API:", response.status, response.statusText);
    throw new Error("Failed to fetch exercises");
  }

  return await response.json();
}

module.exports = { fetchExercises };
