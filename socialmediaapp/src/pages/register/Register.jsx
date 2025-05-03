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
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };


  //validate that the user enters information in the right format
  const validate = () => {
    const newErrors = {};
    if (!inputs.username) newErrors.username = 'Username is required';
    if (!inputs.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(inputs.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!inputs.password) {
      newErrors.password = 'Password is required';
    } else if (inputs.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    return newErrors;
  };


  //ensures that user has passed validation , and the registration info is then sent to the backend
  const handleClick = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        const res = await axios.post("http://localhost:8800/api/auth/register", inputs);
        if (res.data.userId) {
          localStorage.setItem("userId", res.data.userId);
        }
        navigate("/platforms");
      } catch (err) {
        setErr(err.response.data);
      }
    }
  };

  console.log(err)
  
  return (
    <div className="register">
      <div className="card">
        <div className="top">
          <h1>Unifeed</h1>
          <p>
            This Unifeed a Platform that unifies different social media platforms into a streamlined interface.
            
          </p>
          
        </div>
        <div className="bottom">
          <h1>Register</h1>
          <form>
            
            <input type="email" placeholder="Email Address" name="email" onChange={handleChange} />
            {errors.email && <span>{errors.email}</span>}
            <input type="password" placeholder="Password" name="password" onChange={handleChange}/>
            {errors.password && <span>{errors.password}</span>}
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