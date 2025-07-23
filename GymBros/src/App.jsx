import { useState, useEffect } from 'react';
import './App.css';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import Dashboard from './components/dashboard/Dashboard';
import NavBar from './components/navigation/NavBar';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    document.body.classList.remove('login-bg', 'dashboard-bg');
    document.body.classList.add(loggedIn ? 'dashboard-bg' : 'login-bg');
  }, [loggedIn]);

  function handleLogin(name) {
    setUsername(name);
    setLoggedIn(true);
  }

  function handleLogout() {
    setLoggedIn(false);
    setUsername('');
  }

  return (
    <div>
      {loggedIn ? (
        <>
          <NavBar username={username} onLogout={handleLogout} />
          <Dashboard username={username} />
        </>
      ) : showRegister ? (
        <RegisterForm onRegister={handleLogin} onBack={() => setShowRegister(false)} />
      ) : (
        <LoginForm onLogin={handleLogin} onRegisterClick={() => setShowRegister(true)} />
      )}
    </div>
  );
}

export default App;
