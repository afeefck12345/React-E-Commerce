import { createContext, useContext, useState } from "react";
import API from "../services/api";
import { replace } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
   try {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      return { ...savedUser, loginAt: Date.now() }; 
    }
    return null;
  } catch {
    return null;
  }
  }); 

  const register = async (name, email, password) => {
    const res = await API.get(`/users?email=${email}`);
    if (res.data.length > 0) throw new Error("Email already exists!");

    const newUser = { name, email, password, role: "user" };
    const response = await API.post("/users", newUser);
    const registeredUser = response.data;

    localStorage.setItem("user", JSON.stringify(registeredUser));
    setUser(registeredUser);
  };
  

  const login = async (email, password) => {
    const res = await API.get(`/users?email=${email}&password=${password}`);
    if (res.data.length === 0) throw new Error("Invalid email or password!");
    
    const loggedInUser = {
      ...res.data[0],
      loginAt: Date.now(), 
    };
    console.log("loginAt set to:", loggedInUser.loginAt)
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    return loggedInUser;
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  
  };

  return (
    <AuthContext.Provider value={{ user, register,setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

