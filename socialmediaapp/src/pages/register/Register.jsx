import { Link, useNavigate } from "react-router-dom";
import "./Register.scss";
import axios from "axios";
import { useState } from "react";

const Register = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  });
  const [err, setErr] = useState(null);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleClick = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8800/api/auth/register", inputs);
      if (res.data.userId) {
        localStorage.setItem("userId", res.data.userId);
      }
      // Change this line from navigate("/login") to:
      navigate("/platforms");
    } catch (err) {
      setErr(err.response.data);
    }
  };

  console.log(err)
  
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
            
            <input type="email" placeholder="Email Address" name="email" onChange={handleChange} />
            <input type="password" placeholder="Password" name="password" onChange={handleChange}/>
            <input type="text" placeholder="Full Name" name="name" onChange={handleChange}/>
            <input type="text" placeholder="Username" name="username" onChange={handleChange}/>
            {/* <span>Date of Birth</span> 
            <input type="date" placeholder="Date of Birth" /> */}

            {err && err}
            <button onClick={handleClick}>Register</button>
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