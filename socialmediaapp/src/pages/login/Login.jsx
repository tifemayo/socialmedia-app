import "./Login.scss";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="login">
      <div className="card">
        <div className="top">
          <h1>Unifeed</h1>
          <h2>Login</h2> 
          
          
        </div>
        <div className="bottom">
          
          <form>
            <input type="text" placeholder="Username" />
            <input type="password" placeholder="Password" />
            <button>Login</button>
          </form>
          <span>Forgot your password?</span>
          <span>OR </span>
          <span>Don't have an account?</span>
          <Link to="/register">
          <button>Register</button>
          </Link>
        </div>
      </div>
    </div>
     
  )
}

export default Login
