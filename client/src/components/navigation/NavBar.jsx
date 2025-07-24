import { useState, useEffect } from "react";
import Dashboard from "../dashboard/Dashboard";
import Exercises from "./Exercises"; 
import "./NavBar.css";

export default function NavBar({ username, onLogout }) {
  const [activePage, setActivePage] = useState("home");

  useEffect(() => {
    document.body.classList.remove("login-bg", "dashboard-bg", "exercises-bg");

    if (activePage === "home") {
      document.body.classList.add("dashboard-bg");
    } else if (activePage === "exercises") {
      document.body.classList.add("exercises-bg");
    }
  }, [activePage]);

  const renderPage = () => {
  switch (activePage) {
    case "home":
      return <Dashboard username={username} />;  
    case "exercises":
      return <Exercises />;
    case "workout":
      return <div>Workout Plan Page</div>;
    case "profile":
      return <div>Profile Page</div>;
    default:
      return <Dashboard username={username} />;
  }
};

  return (
    <>
      <nav className="navbar">
        <div className="logo">GymBros</div>

        <ul className="nav-links">
          <li>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActivePage("home");
              }}
              className={activePage === "home" ? "active" : ""}
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActivePage("workout");
              }}
              className={activePage === "workout" ? "active" : ""}
            >
              Workout Plan
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActivePage("profile");
              }}
              className={activePage === "profile" ? "active" : ""}
            >
              Profile
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActivePage("exercises");
              }}
              className={activePage === "exercises" ? "active" : ""}
            >
              Exercises
            </a>
          </li>
        </ul>

        <div className="user-info">
          <span>Welcome, {username}</span>
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="page-content">{renderPage()}</div>
    </>
  );
}
