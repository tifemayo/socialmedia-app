import "./Login.scss";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/authContext";


const Login = () => {
  const { login } = useContext(AuthContext);

  const handleLogin = () => {
    login();
  };
  
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
            <button onClick={handleLogin}> Login</button>
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
