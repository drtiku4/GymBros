import { useState } from 'react'
import './App.css'
import Login from './components/auth/LoginForm'
import Dashboard from './components/dashboard/Dashboard'
import LoginForm from './components/auth/LoginForm'

function App() {
  const [loggedIn, setLoggedIN] = useState(false)

  return (
    <div>
      {loggedIn ? (
        <Dashboard />
      ) : (
        <LoginForm onLogin={() => setLoggedIN(true)} />
      )}
    </div>
  )
}

export default App
