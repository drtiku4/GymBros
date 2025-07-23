import "./LoginForm.css"

export default function LoginForm({ onLogin, onRegisterClick }) {
  function handleSubmit(e) {
    e.preventDefault();
    const username = e.target.username.value;
    onLogin(username);
  }

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <h1>Sign In</h1>
        <div className="input-box">
          <input type="text" name="username" placeholder="Username" required />
        </div>
        <div className="input-box">
          <input type="password" name="password" placeholder="Password" required />
        </div>
        <div className="remember-forgot">
          <label><input type="checkbox" />Remember</label>
          <a href="#">Forgot password?</a>
        </div>
        <button type="submit">Sign In</button>
        <div className="register-link">
          <p>Don't have an account? <a onClick={onRegisterClick}>Sign Up</a></p>
        </div>
      </form>
    </div>
  );
}