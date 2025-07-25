import { useState, useEffect } from "react";
import Dashboard from "../dashboard/Dashboard";
import Exercises from "./Exercises"; 
import "./NavBar.css";
import WorkoutPlan from "../dashboard/WorkoutPlan";

export default function NavBar({ username, onLogout }) {
  const [activePage, setActivePage] = useState("home");

  // Update body background class based on activePage
  useEffect(() => {
    document.body.classList.remove("login-bg", "dashboard-bg", "exercises-bg");

    if (activePage === "home") {
      document.body.classList.add("dashboard-bg");
    } else if (activePage === "exercises") {
      document.body.classList.add("exercises-bg");
    } else {
      document.body.classList.add("default-bg");
    }
  }, [activePage]);

  // Render content for current page
  const renderPage = () => {
    switch (activePage) {
      case "home":
        return <Dashboard username={username} />;
      case "exercises":
        return <Exercises />;
      case "workout":
        return <WorkoutPlan/>;
     
      default:
        return <Dashboard username={username} />;
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="logo">GymBros</div>

        <ul className="nav-links">
          {["home", "workout", "exercises"].map((page) => (
            <li key={page}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActivePage(page);
                }}
                className={activePage === page ? "active" : ""}
              >
                {page === "home"
                  ? "Home"
                  : page === "workout"
                  ? "Workout Plan"
                  : page.charAt(0).toUpperCase() + page.slice(1)}
              </a>
            </li>
          ))}
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
