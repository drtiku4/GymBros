import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

export async function registerUser(userData) {
  return axios.post(`${API_URL}/register`, userData);
}