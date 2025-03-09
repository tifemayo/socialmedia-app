import "./Login.scss";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";


const Login = () => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  const [err, setErr] = useState(null);

  const navigate = useNavigate()

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(inputs);
      navigate("/")
    } catch (err) {
      setErr(err.response.data);
    }
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
            <input type="text" placeholder="Username" name="username" onChange={handleChange} />
            <input type="password" placeholder="Password" name="password" onChange={handleChange} />
            {err && err}
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
