import { Link } from "react-router-dom";
import "./Register.scss";

const Register = () => {
  return (
    <div className="register">
      <div className="card">
        <div className="top">
          <h1>Unifeed</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cum,
            alias totam numquam  error nam, consequatur.
          </p>
          
        </div>
        <div className="bottom">
          <h1>Register</h1>
          <form>
            
            <input type="email" placeholder="Email Address" />
            <input type="password" placeholder="Password" />
            <input type="text" placeholder="Full Name" />
            <input type="text" placeholder="Username" />
            <span>Date of Birth</span> 
            <input type="date" placeholder="Date of Birth" />
            <button>Register</button>
          </form>
         
          <span>  OR  <br></br>    Do you have an account?</span>
          <Link to="/login">
          <button>Login</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;