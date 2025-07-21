import "./LoginForm.css"


export default function LoginForm({onLogin}) {

  function handleSubmit (e) {
    e.preventDefault();
    onLogin();
  }
  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <h1>Sign In</h1>
        <div className="input-box">
          <input type="text" placeholder="Username" required />
        </div>
        <div className="input-box">
          <input type="password" placeholder="Password" required />
        </div>
        <div className="remember-forgot">
          <label><input type="checkbox" />Remember</label>
          <a href="#">Forgot password?</a>
        </div>
        <button type="submit">Sign In</button>
        <div className="register-link">
          <p>Don't have an account? <a href="#">Sign Up</a></p>
        </div>
        
      </form>
    </div>
  );
}
