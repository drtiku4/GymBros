import { useState } from "react";
import { registerUser } from "../../services/userService";
import './RegisterForm.css'

export default function RegisterForm({ onRegister }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    goals: "",
    focusAreas: [],
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleCheckboxChange(e) {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const updatedFocus = checked
        ? [...prev.focusAreas, value]
        : prev.focusAreas.filter((area) => area !== value);
      return { ...prev, focusAreas: updatedFocus };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await registerUser(formData);
      onRegister(); 
    } catch (err) {
      console.error("Registration failed:", err.response?.data || err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="goals"
        placeholder="Your fitness goals"
        value={formData.goals}
        onChange={handleChange}
        required
      />

      <label>
        <input
          type="checkbox"
          value="arms"
          onChange={handleCheckboxChange}
        />
        Arms
      </label>
      <label>
        <input
          type="checkbox"
          value="legs"
          onChange={handleCheckboxChange}
        />
        Legs
      </label>

      <button type="submit">Register</button>
    </form>
  );
}
