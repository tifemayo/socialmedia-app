import { createContext, useEffect, useState } from "react";
// import profileImg from '../images/girl-afro (1).jpg';
import axios from "axios";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login = async (inputs) => {
    const res = await axios.post("http://localhost:8800/api/auth/login", inputs, {
      withCredentials: true,
    });
    setCurrentUser(res.data);
  };

  const updateUser = (userData) => {
    setCurrentUser(prev => ({
      ...prev,
      ...userData,
      name: userData.name || prev.name,
      username: userData.username || prev.username,
      profilePic: userData.profilePic || prev.profilePic,
      coverPic: userData.coverPic || prev.coverPic
    }));
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
