import "./NavBar.css"


export default function NavBar({ username, onLogout }) {
  return (
    <nav className="navbar">
      <div className="logo">GymBros</div>

      <ul className="nav-links">
        <li><a href="#">Home</a></li>
        <li><a href="#">Workout Plan</a></li>
        <li><a href="#">Profile</a></li>
      </ul>

      <div className="user-info">
        <span>Welcome, {username}</span>
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </div>
    </nav>
  );
}
